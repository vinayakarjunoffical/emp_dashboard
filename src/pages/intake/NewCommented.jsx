
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
  Loader2, Plus, Trash2, Layers, Cpu, ExternalLink, Database,
  Globe, ShieldCheck, History, X, LinkIcon, FileUp, ChevronRight, ChevronLeft, ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import { candidateService } from "../../services/candidateService";
import { departmentService } from "../../services/department.service";

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between items-center">
      <span>{label}</span>
      <span className={`font-bold normal-case ${required ? "text-red-500" : "text-slate-300"}`}>
        {required ? "Required" : "Optional"}
      </span>
    </label>
    {children}
    {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
  </div>
);

const ManualEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const effectiveId = id || "34"; // Using ID 34 as per your provided JSON response

  // Enterprise Styling
  const inputStyle = "w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";

  // 1. STATES
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [resumeMode, setResumeMode] = useState("file");
  const [skillInput, setSkillInput] = useState("");
  const [assetInput, setAssetInput] = useState("");
  const [isFresher, setIsFresher] = useState(null);
  const [deptSearch, setDeptSearch] = useState("");
  const [eduSearch, setEduSearch] = useState("");
  const [dynamicSkills, setDynamicSkills] = useState([]);
  const [dynamicAssets, setDynamicAssets] = useState([]);
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [showAssetDrop, setShowAssetDrop] = useState(false);
  const [skillFocused, setSkillFocused] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const dropdownContainerRef = useRef(null);
  const careerStepRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address1: "", address2: "", location: "",
    pincode: "", state: "", city: "", district: "", country: "India", position: "",
    education: "", gender: "", dob: "", experience: "", about_me: "",
    languages_spoken: [], skills: [], assets: [], department: "",
    cvFile: null, resume_link: "", certificateFiles: [], certificateLinks: [""], experiences: [],
  });

  // 2. STATIC OPTIONS
  const totalSteps = 6;
  const POSITION_OPTIONS = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Executive", "UI/UX Designer", "DevOps Engineer"];
  const educationOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "Diploma", "PhD"];

  const filteredEducation = educationOptions.filter(e => e.toLowerCase().includes(eduSearch.toLowerCase()));
  const filteredDepartments = departments.filter(d => (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()));
  const isStep1Valid = formData.name && formData.email && formData.phone;

  // 3. API FETCH / HYDRATION LOGIC
  const fetchSkills = async () => {
    try {
      const response = await fetch("https://apihrr.goelectronix.co.in/masters/skills");
      const data = await response.json();
      setDynamicSkills(data.map(item => item.name || item));
    } catch { console.error("Skill sync failed"); }
  };

  const fetchAssets = async (candidateId) => {
    try {
      const response = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidateId}/assets`);
      const data = await response.json();
      setDynamicAssets(Array.isArray(data) ? data.map(a => a.name) : []);
    } catch { console.error("Asset sync failed"); }
  };

  useEffect(() => {
    const hydrateForm = async () => {
      setFetchingData(true);
      try {
        const response = await fetch(`https://apihrr.goelectronix.co.in/candidates/${effectiveId}`);
        const data = await response.json();

        if (data) {
          // Robust JSON Parser for the weird stringified arrays in your response
          const safeParse = (input) => {
            if (!input) return [];
            if (Array.isArray(input)) {
                // If it's the ["[\"React\""] format
                if (typeof input[0] === 'string' && input[0].startsWith('[')) {
                    try { return JSON.parse(input.join('')); } catch { return input; }
                }
                return input;
            }
            try { return JSON.parse(input); } catch { return []; }
          };

          setFormData(prev => ({
            ...prev,
            name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            dob: data.dob || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            location: data.location || "",
            pincode: data.pincode || "",
            city: data.city || "",
            state: data.state || "",
            district: data.district || "",
            position: data.position || "",
            experience: data.experience || "",
            education: data.education || "",
            department: data.department || "",
            about_me: data.about_me || "",
            resume_link: data.resume_path || "",
            languages_spoken: safeParse(data.languages_spoken),
            experiences: data.experiences || [], // Your JSON shows a clean array here
            skills: safeParse(data.skills),
            assets: safeParse(data.assets),
          }));

          setIsFresher(!data.experiences || data.experiences.length === 0);
        }

        const deptData = await departmentService.getAll();
        setDepartments(deptData || []);
        fetchSkills();
        fetchAssets(effectiveId);
      } catch (err) {
        console.warn("Hydration failed");
      } finally {
        setFetchingData(false);
      }
    };
    hydrateForm();
  }, [effectiveId]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setShowSkillDrop(false);
        setShowAssetDrop(false);
        setSkillFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. HANDLERS
  const handleManualAddSkill = async () => {
    const name = skillInput.trim();
    if (!name) { await fetchSkills(); return; }
    const success = await handleCreateMaster("skills", name);
    if (success) {
      if (!formData.skills.includes(name)) setFormData(p => ({ ...p, skills: [...p.skills, name] }));
      setSkillInput("");
      await fetchSkills();
    }
  };

  const handleCreateMaster = async (type, name) => {
    try {
      const res = await fetch(`https://apihrr.goelectronix.co.in/masters/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      return res.ok;
    } catch { return false; }
  };

  const handleAddAssetAPI = async (assetName) => {
    if (!assetName.trim()) return;
    const loadingToast = toast.loading(`Linking asset...`);
    try {
      const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${effectiveId}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: assetName.trim() }),
      });
      if (res.ok) {
        toast.success("Linked", { id: loadingToast });
        fetchAssets(effectiveId);
        return true;
      }
      throw new Error();
    } catch { toast.error("Failed", { id: loadingToast }); return false; }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;
    setIsFetchingPincode(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        setCityOptions(data[0].PostOffice.map(o => o.Name));
      }
    } finally { setIsFetchingPincode(false); }
  };

  const validateField = (field, value) => {
    let error = "";
    if (["name", "email", "phone"].includes(field) && !value) error = "Required field";
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Executing PATCH Sync...");
    try {
      const apiData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "skills", "assets"].includes(key)) {
          apiData.append(key, formData[key]);
        }
      });
      apiData.append("full_name", formData.name);
      apiData.append("experience_details", JSON.stringify(formData.experiences));
      apiData.append("languages_spoken", JSON.stringify(formData.languages_spoken));
      apiData.append("skills", JSON.stringify(formData.skills));
      apiData.append("assets", JSON.stringify(formData.assets));

      const response = await fetch(`https://apihrr.goelectronix.co.in/candidates/${effectiveId}`, {
        method: "PATCH",
        body: apiData,
      });

      if (response.ok) {
        toast.success("Synchronized successfully", { id: loadingToast });
      } else { throw new Error(); }
    } catch { toast.error("Commit failed", { id: loadingToast }); }
    finally { setLoading(false); }
  };

  if (fetchingData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pulling Data Node {effectiveId}...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
      <div className="max-w-6xl mx-auto space-y-8" ref={dropdownContainerRef}>
        
        {/* ROADMAP HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
              <Database size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Manual Registry</h2>
              <div className="flex items-center gap-2 mt-2 text-blue-600">
                <ShieldCheck size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Candidate Node: {effectiveId}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl w-full px-4">
            <div className="relative flex justify-between items-center w-full">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700" 
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-4 ${step === num ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg" : step > num ? "bg-emerald-500 text-white border-emerald-50" : "bg-white text-slate-300 border-slate-50"}`}>
                    {step > num ? <Check size={14} strokeWidth={4} /> : num}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
            <div className="text-right"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Complete</p><p className="text-sm font-black text-slate-900 mt-1">{Math.round((step / totalSteps) * 100)}%</p></div>
            <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner"><Check size={18} /></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><User size={18} className="text-blue-600" /><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identification</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormField label="Full Name" required error={errors.name}><input placeholder="Legal Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputStyle} /></FormField>
                  <FormField label="Email" required error={errors.email}><input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputStyle} /></FormField>
                  <FormField label="Phone" required><div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm"><span className="px-5 text-[11px] font-black text-slate-400 border-r border-slate-100">+91</span><input maxLength={10} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-4 bg-transparent text-sm font-bold outline-none" /></div></FormField>
                  <FormField label="Gender Strategy"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputStyle}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></FormField>
                </div>
                <div className="flex justify-end pt-4"><button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)} className={`px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all`}>Next Phase <ChevronRight size={16} className="inline ml-2" /></button></div>
              </div>
            )}

            {/* STEP 2: GEOGRAPHY */}
            {step === 2 && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><MapPin size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Geolocation Registry</h3></div>
                <div className="space-y-8">
                  <FormField label="Address line 1" required><input placeholder="Building/Street" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className={inputStyle} /></FormField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField label="Location" required><input placeholder="City Hub" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={inputStyle} /></FormField>
                    <FormField label="Pincode" required><input maxLength={6} placeholder="000000" value={formData.pincode} onChange={(e) => { setFormData({ ...formData, pincode: e.target.value }); if(e.target.value.length === 6) fetchPincodeDetails(e.target.value); }} className={inputStyle} /></FormField>
                  </div>
                </div>
                <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(1)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all shadow-sm">← Back</button><button onClick={() => setStep(3)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl transition-all">Continue →</button></div>
              </div>
            )}

            {/* STEP 3: EXPERIENCE (HYDRATED FROM API) */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-slate-900 font-black">
                      <Briefcase size={24} className="text-blue-600" />
                      <div><h3 className="text-sm uppercase tracking-widest leading-none">Are you a Fresher?</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Select career status</p></div>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
                      <button type="button" onClick={() => { setIsFresher(true); setFormData({ ...formData, experiences: [] }); }} className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border" : "text-slate-400"}`}>Yes</button>
                      <button type="button" onClick={() => setIsFresher(false)} className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border" : "text-slate-400"}`}>No</button>
                    </div>
                  </div>
                </div>

                {isFresher === false && (
                  <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl space-y-10 animate-in fade-in zoom-in-95">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
                      <div className="flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg"><History size={20} /></div><h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Experience Timeline</h3></div>
                      <button type="button" onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", uploadMode: "file" }] })} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg transition-all active:scale-95">+ Add Organization</button>
                    </div>
                    <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
                       {formData.experiences.length > 0 ? (
                         formData.experiences.map((exp, i) => (
                          <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-8 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl shadow-inner animate-in zoom-in-95">
                             <button type="button" onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 z-20 transition-all"><Trash2 size={18} /></button>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <FormField label="Employer"><input placeholder="Organization" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle} /></FormField>
                               <FormField label="Designation"><input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle} /></FormField>
                             </div>

                             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                <FormField label="Start Date"><input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle} /></FormField>
                                <FormField label="End Date"><input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle} /></FormField>
                                <FormField label="Annual CTC"><input type="number" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle} /></FormField>
                                <FormField label="Office City"><input value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle} /></FormField>
                             </div>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <FormField label="Remarks / Summary"><textarea rows={5} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle + " resize-none min-h-[140px]"} /></FormField>
                                <div className="space-y-3">
                                   <div className="flex justify-between items-center px-1"><p className="text-[10px] font-black text-slate-400 uppercase">Verification Artifact</p><div className="flex bg-slate-100 p-1 rounded-xl border"><button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "file"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1 text-[9px] font-black rounded-lg ${exp.uploadMode !== 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>FILE</button><button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "link"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1 text-[9px] font-black rounded-lg ${exp.uploadMode === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>URL</button></div></div>
                                   <div className="bg-white/50 border border-slate-100 rounded-3xl p-4 min-h-[140px] flex flex-col justify-center">
                                     {exp.uploadMode !== 'link' ? (
                                       <label className="flex flex-col items-center justify-center gap-3 w-full h-full border-2 border-dashed border-slate-200 rounded-2xl hover:bg-blue-50/30 cursor-pointer group p-4 transition-all">
                                         <FileUp size={24} className="text-slate-400 group-hover:text-blue-500" />
                                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                           {exp.experience_letter_path ? "Node Attachment Present" : (exp.expLetterFile ? exp.expLetterFile.name : "Drop PDF Validation")}
                                         </span>
                                         <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const u = [...formData.experiences]; u[i].expLetterFile = e.target.files[0]; setFormData({ ...formData, experiences: u }); }} />
                                       </label>
                                     ) : (
                                       <div className="relative"><LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input placeholder="URI Storage Link" value={exp.exp_letter_link || exp.experience_letter_path || ""} onChange={(e) => { const u = [...formData.experiences]; u[i].exp_letter_link = e.target.value; setFormData({ ...formData, experiences: u }); }} className={inputStyle + " pl-11"} /></div>
                                     )}
                                   </div>
                                </div>
                             </div>
                             <div className="flex justify-end pt-2 border-t border-slate-50"><button type="button" onClick={() => toast.success("Node Details Saved")} className="flex items-center gap-2 px-8 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"><Check size={16} strokeWidth={3} /> Save Record</button></div>
                          </div>
                        ))
                       ) : (
                         <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]"><History size={32} className="mx-auto text-slate-300 mb-4"/><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Employment Artifacts Submited</p></div>
                       )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between pt-4"><button onClick={() => setStep(2)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase shadow-sm transition-all hover:text-slate-900 flex items-center gap-2"><ChevronLeft size={16}/> Back</button><button onClick={() => setStep(4)} type="button" disabled={isFresher === null} className={`px-12 py-4 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95 ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-600/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Next Phase →</button></div>
              </div>
            )}

            {/* STEP 4: CAREER (Position, Education, Department) */}
            {step === 4 && (
              <div ref={careerStepRef} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8 overflow-visible">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><Award size={20} className="text-blue-600" /><h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Career Profile</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
                  <FormField label="Position"><div className="relative overflow-visible"><div className="relative group"><input placeholder="Select role..." value={formData.position} onFocus={() => { setShowSkillDrop(true); setShowAssetDrop(false); setSkillFocused(false); }} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className={inputStyle} /><ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${showSkillDrop ? 'rotate-180' : ''}`} /></div>
                  {showSkillDrop && (<div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto no-scrollbar">{POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).map((pos, i) => (<div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({ ...formData, position: pos }); setShowSkillDrop(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b last:border-0">{pos}</div>))}</div>)}</div></FormField>
                  <FormField label="Seniority Level (Years)"><input type="number" value={formData.experience} onFocus={() => { setShowSkillDrop(false); setShowAssetDrop(false); setSkillFocused(false); }} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={inputStyle} /></FormField>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
                  <FormField label="Education"><div className="relative overflow-visible"><div className="relative group"><input placeholder="Search degree..." value={eduSearch || formData.education} onFocus={() => { setShowAssetDrop(true); setShowSkillDrop(false); setSkillFocused(false); }} onChange={(e) => { setEduSearch(e.target.value); setFormData({ ...formData, education: e.target.value }); }} className={inputStyle} /><ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${showAssetDrop ? 'rotate-180' : ''}`} /></div>
                  {showAssetDrop && (<div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto no-scrollbar">{filteredEducation.map((e, i) => (<div key={i} onMouseDown={(ev) => { ev.preventDefault(); setFormData({ ...formData, education: e }); setEduSearch(""); setShowAssetDrop(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b last:border-0">{e}</div>))}</div>)}</div></FormField>
                  <FormField label="Department"><div className="relative overflow-visible"><div className="relative group"><input placeholder="Search dept..." value={deptSearch || formData.department} onFocus={() => { setSkillFocused(true); setShowSkillDrop(false); setShowAssetDrop(false); }} onChange={(e) => { setDeptSearch(e.target.value); setFormData({ ...formData, department: e.target.value }); }} className={inputStyle} /><ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${skillFocused ? 'rotate-180' : ''}`} /></div>
                  {skillFocused && (<div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto no-scrollbar">{filteredDepartments.map((d) => (<div key={d.id} onMouseDown={(ev) => { ev.preventDefault(); setFormData({ ...formData, department: d.name }); setDeptSearch(""); setSkillFocused(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b last:border-0">{d.name}</div>))}</div>)}</div></FormField>
                </div>
                <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">← Back</button><button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl transition-all active:scale-95">Next Phase →</button></div>
              </div>
            )}

            {/* STEP 5: INVENTORY */}
            {step === 5 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible">
                <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl overflow-visible shadow-slate-200/50">
                  <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]"><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg"><Cpu size={20} /></div><div><h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Expertise Matrix</h3><p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Hydrate skills and hardware</p></div></div></div>
                  <div className="p-8 md:p-12 space-y-12 overflow-visible">
                    <FormField label="Technical Matrix"><div className="space-y-6"><div className="flex flex-col sm:flex-row gap-4 items-end"><div className="relative max-w-md w-full"><Plus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleManualAddSkill(); } }} placeholder="Register skill..." className={inputStyle + " pl-12"} /></div><button type="button" onClick={handleManualAddSkill} className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg"><Database size={14} /> Sync Registry</button></div><div className="flex flex-wrap gap-3 p-1">{dynamicSkills.map((skill) => { const isSelected = formData.skills.includes(skill); return (<button key={skill} type="button" onClick={() => setFormData({...formData, skills: isSelected ? formData.skills.filter(s => s !== skill) : [...formData.skills, skill]})} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"}`}>{skill} {isSelected && <Check size={14} strokeWidth={3} />}</button>); })}</div></div></FormField>
                    <FormField label="Hardware Matrix"><div className="space-y-6 pt-8 border-t border-slate-100"><div className="relative max-w-md w-full"><Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={assetInput} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={async (e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) { const ok = await handleAddAssetAPI(v); if(ok) { setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); } } } }} placeholder="Link hardware..." className={inputStyle + " pl-12"} /></div><div className="flex flex-wrap gap-3 p-1">{dynamicAssets.map((asset) => { const isSelected = formData.assets.includes(asset); return (<button key={asset} type="button" onClick={async () => { if(!isSelected) { const ok = await handleAddAssetAPI(asset); if(ok) setFormData({...formData, assets: [...formData.assets, asset]}); } else { setFormData({...formData, assets: formData.assets.filter(a => a !== asset)}); } }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black border-2 transition-all active:scale-90 ${isSelected ? "bg-slate-900 text-white" : "bg-white border-slate-100 text-slate-500"}`}>{asset} {isSelected && <Check size={14} strokeWidth={3} />}</button>); })}</div></div></FormField>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4"><button onClick={() => setStep(4)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase hover:text-slate-900 flex items-center gap-2 transition-all shadow-sm"><ChevronLeft size={16}/> Previous Phase</button><button onClick={() => setStep(6)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl active:scale-95 flex items-center gap-2 transition-all">Vault Registry <ChevronRight size={16}/></button></div>
              </div>
            )}

            {/* STEP 6: DOCUMENT VAULT */}
            {step === 6 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
                <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-xl shadow-slate-200/60 border border-slate-200 space-y-12 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-12 text-slate-100 opacity-40 rotate-12 scale-150"><ShieldCheck size={240} /></div>
                  <div className="flex items-center gap-5 pb-8 border-b border-slate-100 relative z-10"><div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><ShieldCheck size={28} className="text-white" /></div><div><h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Registry Artifacts</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Document Verification Matrix</p></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-8 p-1"><div className="flex justify-between items-center"><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Resume Profile</p><div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200"><button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-white text-slate-900 shadow-sm border' : 'text-slate-400'}`}>FILE</button><button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-white text-slate-900 shadow-sm border' : 'text-slate-400'}`}>URL</button></div></div>
                    {resumeMode === 'file' ? (<label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-blue-500 transition-all cursor-pointer group text-center bg-white shadow-inner"><FileUp size={40} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-5 duration-500" /><p className="text-[10px] font-black text-slate-900 uppercase truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select Resume PDF"}</p><input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} /></label>) : <input placeholder="URI Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className={inputStyle} />}</div>
                    <div className="space-y-8 p-1"><div className="flex justify-between items-center"><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Validation Metadata</p></div><div className="text-xs text-slate-400 font-bold uppercase leading-relaxed p-6 bg-slate-50 rounded-3xl border border-dashed shadow-inner">Candidate hydrated from Node {effectiveId}. Final PATCH Synchronize will commit registry artifacts to database repository.</div></div>
                  </div>
                  <div className="pt-16 border-t border-slate-100 flex flex-col items-center gap-8 relative z-10"><button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[3rem] shadow-2xl active:scale-[0.98] uppercase disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} /><span>Finalize PATCH Synchronize</span></>}</button><button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 transition-all"><ChevronLeft size={16}/> Return to Inventory</button></div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }.custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }.custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }.custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }`}} />
    </div>
  );
};

export default ManualEntryPage; 
//*************************************************working code phase 2233 4/02/26****************************************************** */

// import React, { useState, useMemo, useEffect } from "react";

// import {
//   FileSpreadsheet,
//   Webhook,
//   UserPlus,
//   Filter,
//   Search,
//   Mail,
//   MoreHorizontal,
//   ExternalLink,
//   Briefcase,
//   MapPin,
//   X,
//   Check,
//   GraduationCap,
//   ChevronDown,
//   Calendar,
//   Zap,
//   ArrowUpRight,
//   Eye,
//   FileText,
//   Award,
//   Download,
//   AlertCircle,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import toast from "react-hot-toast";
// import { getJobTemplates } from "../../services/jobTemplateService";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---

//   // const [candidates, setCandidates] = useState([
//   //   {
//   //     id: 1,
//   //     name: "Jane Doe",
//   //     email: "jane.doe@example.com",
//   //     exp: 8,
//   //     location: "Mumbai, MH",
//   //     source: "Excel Import",
//   //     position: "Fullstack Dev",
//   //     education: "B.Tech",
//   //     selected: false,
//   //     cvUrl:
//   //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   //   },

//   //   {
//   //     id: 2,
//   //     name: "Arjun Mehta",
//   //     email: "arjun.m@tech.com",
//   //     exp: 4,
//   //     location: "Bangalore, KA",
//   //     source: "Webhook",
//   //     position: "UI Designer",
//   //     education: "Masters",
//   //     selected: false,
//   //     cvUrl: null,
//   //   },

//   //   {
//   //     id: 3,
//   //     name: "Sarah Smith",
//   //     email: "sarah.s@global.com",
//   //     exp: 12,
//   //     location: "Remote",
//   //     source: "Manual Entry",
//   //     position: "Product Manager",
//   //     education: "MBA",
//   //     selected: false,
//   //     cvUrl:
//   //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   //   },

//   //   {
//   //     id: 4,
//   //     name: "Rahul Verma",
//   //     email: "rahul.v@dev.io",
//   //     exp: 2,
//   //     location: "Delhi, NCR",
//   //     source: "Excel Import",
//   //     position: "Fullstack Dev",
//   //     education: "B.Tech",
//   //     selected: false,
//   //     cvUrl: null,
//   //   },
//   // ]);
//   const [candidates, setCandidates] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // --- NEW STATE FOR SOURCE MODALS ---
//   const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [webhookUrl, setWebhookUrl] = useState("");
//   const [isTestingConnection, setIsTestingConnection] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
//   const [expProof, setExpProof] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMailModalOpen, setIsMailModalOpen] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [customRole, setCustomRole] = useState("");
//   const [customContent, setCustomContent] = useState("");
//   const [saveAsTemplate, setSaveAsTemplate] = useState(false);
//   const [newTemplateTitle, setNewTemplateTitle] = useState("");
//   const [excelFile, setExcelFile] = useState(null);
//   const [isImporting, setIsImporting] = useState(false);

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   phone: "",
//   //   address: "",
//   //   exp: "",
//   //   position: "",
//   //   education: "",
//   // });

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     exp: "",
//     position: "",
//     education: "",
//     fileName: "",
//     cvFile: null,
//     expLetterName: "",
//     expLetterFile: null,
//   });
//   const [loadingCandidates, setLoadingCandidates] = useState(true);

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((c) => {
//       const name = c.name || c.full_name || "";
//       const email = c.email || c.email_address || "";

//       const matchesSearch =
//         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition =
//         filters.position === "All Positions" || c.position === filters.position;

//       const matchesEducation =
//         filters.education === "All Education" ||
//         c.education === filters.education;

//       let matchesExperience = true;

//       if (filters.experience === "Junior (0-3 yrs)")
//         matchesExperience = Number(c.exp || c.experience) <= 3;

//       if (filters.experience === "Mid (4-7 yrs)")
//         matchesExperience =
//           Number(c.exp || c.experience) >= 4 &&
//           Number(c.exp || c.experience) <= 7;

//       if (filters.experience === "Senior (8+ yrs)")
//         matchesExperience = Number(c.exp || c.experience) >= 8;

//       return (
//         matchesSearch &&
//         matchesPosition &&
//         matchesEducation &&
//         matchesExperience
//       );
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   useEffect(() => {
//     const loadCandidates = async () => {
//       try {
//         const data = await candidateService.getAll();

//         console.log("API DATA:", data); // debug

//         const mapped = data.map((c) => ({
//           id: c.id,
//           name: c.full_name || c.name,
//           email: c.email,
//           exp: c.experience,
//           location: c.location,
//           position: c.position,
//           education: c.education,
//           source: c.entry_method || "API",
//           selected: false,
//           cvUrl: c.resume_path,
//           expLetterUrl: c.experience_letter_path,
//         }));

//         setCandidates(mapped);
//       } catch (err) {
//         console.error("API ERROR:", err);
//         toast.error("Failed to load candidates");
//       }
//     };

//     loadCandidates();
//   }, []);

//   useEffect(() => {
//     const loadTemplates = async () => {
//       try {
//         const data = await getJobTemplates();
//         setTemplates(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadTemplates();
//   }, []);

//   const handleManualEntry = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const formDataApi = new FormData();

//       // ✅ Backend field names
//       formDataApi.append("name", formData.name);
//       formDataApi.append("email", formData.email);
//       formDataApi.append("phone", formData.phone || "");
//       formDataApi.append("address", formData.address);
//       formDataApi.append("location", formData.address);
//       formDataApi.append("position", formData.position);
//       formDataApi.append("experience", formData.exp);
//       formDataApi.append("education", formData.education);
//       formDataApi.append("entry_method", "manual");

//       // ✅ Resume Upload
//       if (formData.cvFile) {
//         formDataApi.append("resumepdf", formData.cvFile);
//       }

//       // ✅ Experience Letter Upload
//       if (formData.expLetterFile) {
//         formDataApi.append("experience_letter", formData.expLetterFile);
//       }

//       // 🔥 API CALL
//       const createdCandidate =
//         await candidateService.createCandidate(formDataApi);

//       // Add candidate to UI
//       setCandidates((prev) => [
//         {
//           id: createdCandidate.id,
//           name: createdCandidate.full_name,
//           email: createdCandidate.email,
//           exp: createdCandidate.experience,
//           location: createdCandidate.location,
//           position: createdCandidate.position,
//           education: createdCandidate.education,
//           source: "Manual Entry",
//           selected: false,
//           cvUrl: createdCandidate.resume_path,
//           expLetterUrl: createdCandidate.experience_letter_path,
//         },
//         ...prev,
//       ]);

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         exp: "",
//         position: "",
//         education: "",
//         fileName: "",
//         cvFile: null,
//         expLetterName: "",
//         expLetterFile: null,
//       });

//       setIsModalOpen(false);

//       // ✅ SUCCESS TOASTER
//       toast.success("Candidate uploaded successfully 🎉");
//     } catch (err) {
//       console.error("Create candidate failed:", err);
//       toast.error("Failed to upload candidate ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendJD = async () => {
//     try {
//       const selectedIds = candidates.filter((c) => c.selected).map((c) => c.id);

//       if (!selectedIds.length) {
//         toast.error("Please select candidates");
//         return;
//       }

//       const payload = {
//         candidate_ids: selectedIds,
//         template_id: Number(selectedTemplate),
//         custom_role: customRole,
//         custom_content: customContent,
//         save_as_new_template: saveAsTemplate,
//         new_template_title: newTemplateTitle,
//       };

//       await candidateService.sendJD(payload);

//       toast.success("JD sent successfully 🚀");

//       // ✅ CLOSE MODAL
//       setIsMailModalOpen(false);

//       // ✅ CLEAR MODAL FORM DATA
//       setSelectedTemplate("");
//       setCustomRole("");
//       setCustomContent("");
//       setSaveAsTemplate(false);
//       setNewTemplateTitle("");

//       // ✅ OPTIONAL: UNSELECT ALL CANDIDATES
//       setCandidates((prev) => prev.map((c) => ({ ...c, selected: false })));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send JD ❌");
//     }
//   };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every((c) => c.selected);

//     setCandidates(
//       candidates.map((c) =>
//         filteredCandidates.find((f) => f.id === c.id)
//           ? { ...c, selected: !allSelected }
//           : c,
//       ),
//     );
//   };

//   const toggleSelect = (id) => {
//     setCandidates(
//       candidates.map((c) =>
//         c.id === id ? { ...c, selected: !c.selected } : c,
//       ),
//     );
//   };

//   const getInitials = (name = "") => {
//     if (!name) return "U";
//     const parts = name.split(" ");
//     return parts
//       .map((p) => p[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleExcelImport = async () => {
//     if (!excelFile) {
//       toast.error("Please select an Excel file ❌");
//       return;
//     }

//     try {
//       setIsImporting(true);

//       const formData = new FormData();
//       formData.append("file", excelFile); // 🔥 backend field name

//       const res = await fetch("http://72.62.242.223:8000/candidates/import", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         // backend error message
//         throw new Error(data?.message || "Import failed");
//       }

//       toast.success(data?.message || "Candidates imported successfully 🎉");

//       // 🔁 Reload candidates after import
//       const updated = await candidateService.getAll();
//       setCandidates(
//         updated.map((c) => ({
//           id: c.id,
//           name: c.full_name || c.name,
//           email: c.email,
//           exp: c.experience,
//           location: c.location,
//           position: c.position,
//           education: c.education,
//           source: "Excel Import",
//           selected: false,
//           cvUrl: c.resume_path,
//           expLetterUrl: c.experience_letter_path,
//         })),
//       );

//       setActiveSourceModal(null);
//       setExcelFile(null);
//     } catch (err) {
//       console.error("Excel import error:", err);
//       toast.error(err.message || "Excel import failed ❌");
//     } finally {
//       setIsImporting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div onClick={() => setActiveSourceModal("excel")}>
//           <SourceCard
//             icon={<FileSpreadsheet />}
//             title="Excel Import"
//             desc="Bulk upload .csv or .xlsx"
//             color="emerald"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setActiveSourceModal("webhook")}>
//           <SourceCard
//             icon={<Webhook />}
//             title="API Webhook"
//             desc="Connect LinkedIn/Indeed"
//             color="indigo"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}

//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />

//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
//             Filters
//           </span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={[
//             "All Positions",
//             "Fullstack Dev",
//             "UI Designer",
//             "Product Manager",
//           ]}
//           value={filters.position}
//           onChange={(v) => setFilters({ ...filters, position: v })}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={[
//             "All Experience",
//             "Junior (0-3 yrs)",
//             "Mid (4-7 yrs)",
//             "Senior (8+ yrs)",
//           ]}
//           value={filters.experience}
//           onChange={(v) => setFilters({ ...filters, experience: v })}
//         />

//         <FilterDropdown
//           label="Education"
//           options={["All Education", "B.Tech", "Masters", "MBA"]}
//           value={filters.education}
//           onChange={(v) => setFilters({ ...filters, education: v })}
//         />

//         <button
//           onClick={() =>
//             setFilters({
//               position: "All Positions",
//               experience: "All Experience",
//               education: "All Education",
//             })
//           }
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}

//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">
//               Candidate Pool
//             </h2>

//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                 size={16}
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>

//             {/* <button
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button> */}
//             <button
//               onClick={() => setIsMailModalOpen(true)}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
//                 candidates.some((c) => c.selected)
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
//               }`}
//               disabled={!candidates.some((c) => c.selected)}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {/* Add table-auto or table-fixed depending on how rigid you want it */}
//           <table className="w-full border-collapse table-auto">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 {/* Fixed narrow width for checkbox */}
//                 <th className="w-16 px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredCandidates.length > 0 &&
//                       filteredCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

//                 {/* This column will take most of the space */}
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Candidate Info
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Position & Exp
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Education
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Source
//                 </th>

//                 {/* Explicitly narrow the Actions column */}
//                 <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {/* {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)} */}
//                         {(c.name || "U").charAt(0)}
//                         {(c.name?.split(" ")[1] || "").charAt(0)}
//                       </div>
//                       <div className="min-w-0">
//                         {" "}
//                         {/* Prevents text from breaking layout */}
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {c.name}
//                         </p>
//                         <p className="text-[11px] text-slate-500 font-medium truncate">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp}
//                         {/* <Calendar size={12} /> {c.exp} Years Exp */}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>
//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <span
//                       className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   {/* Action cell with forced narrow width */}
//                   <td className="px-8 py-5 text-right w-24">
//                     <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                         title="View Profile"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//           {/* High-End Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           {/* Main Modal Container */}
//           <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
//             {/* 1. Integrated Header Section */}
//             <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//               <div className="flex items-center gap-6">
//                 <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
//                   {/* {selectedCandidate.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")} */}
//                   {getInitials(selectedCandidate?.name)}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">
//                       {selectedCandidate.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
//                     >
//                       {selectedCandidate.source}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Mail size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.email}
//                     </span>
//                     <span className="w-1 h-1 bg-slate-200 rounded-full" />
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Briefcase size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.position}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//                   <Download size={14} /> Download CV
//                 </button>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             {/* 2. Main Content Area */}
//             <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
//               {/* Quick Info Bar */}
//               <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//                 <QuickMetric
//                   label="Experience"
//                   value={`${selectedCandidate.exp} Years`}
//                 />
//                 <QuickMetric
//                   label="Education"
//                   value={selectedCandidate.education}
//                 />
//                 <QuickMetric
//                   label="Location"
//                   value={selectedCandidate.location}
//                 />
//                 <QuickMetric
//                   label="Candidate ID"
//                   value={`#TR-${selectedCandidate.id}`}
//                 />
//               </div>

//               {/* The PDF Viewer Surface */}
//               <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//                 <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                       className="w-full h-full border-none"
//                       title="Resume Viewer"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                         <FileText size={48} />
//                       </div>
//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Missing Curriculum Vitae
//                       </h5>
//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                         This record does not have a professional resume
//                         attached.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 3. Status Footer / Progress Bar */}
//             <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div
//                       key={i}
//                       className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Shared with 3 Hiring Managers
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">
//                   Application Health
//                 </span>
//                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MANUAL ENTRY MODAL (EXISITING) */}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* HEADER */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">
//                   New Candidate
//                 </h3>
//                 <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//                   Manual Record Entry
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               {/* ROW 1: Identity */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Full Name"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(v) => setFormData({ ...formData, name: v })}
//                 />
//                 <InputField
//                   label="Email Address"
//                   placeholder="john@example.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(v) => setFormData({ ...formData, email: v })}
//                 />
//               </div>

//               {/* ROW 2: Professional Details */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Position"
//                   placeholder="e.g. Fullstack Dev"
//                   value={formData.position}
//                   onChange={(v) => setFormData({ ...formData, position: v })}
//                 />
//                 <InputField
//                   label="Years of Experience"
//                   placeholder="e.g. 5"
//                   type="number"
//                   value={formData.exp}
//                   onChange={(v) => setFormData({ ...formData, exp: v })}
//                 />
//               </div>

//               {/* ROW 3: Contact & Education */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Phone Number"
//                   placeholder="+91 00000 00000"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(v) => setFormData({ ...formData, phone: v })}
//                 />
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                   value={formData.education}
//                   onChange={(v) => setFormData({ ...formData, education: v })}
//                 />
//               </div>

//               {/* ROW 4: Geography */}
//               <div className="grid grid-cols-1">
//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   value={formData.address}
//                   onChange={(v) => setFormData({ ...formData, address: v })}
//                 />
//               </div>

//               {/* --- DOCUMENT UPLOAD SECTION --- */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//                   Supporting Documents
//                 </label>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* RESUME UPLOAD */}
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           fileName: file.name,
//                           cvFile: file,
//                           cvUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div
//                       className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg mb-2 ${formData.fileName ? "bg-blue-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
//                       >
//                         {formData.fileName ? (
//                           <Check size={16} />
//                         ) : (
//                           <FileText size={16} />
//                         )}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.fileName
//                           ? formData.fileName
//                           : "Upload Resume"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* EXPERIENCE LETTER UPLOAD */}
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           expLetterName: file.name,
//                           expLetterFile: file,
//                           expLetterUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div
//                       className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.expLetterName ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50 group-hover:border-emerald-400 group-hover:bg-emerald-50/50"}`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg mb-2 ${formData.expLetterName ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
//                       >
//                         {formData.expLetterName ? (
//                           <Check size={16} />
//                         ) : (
//                           <Award size={16} />
//                         )}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.expLetterName
//                           ? formData.expLetterName
//                           : "Experience Letter"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-[8px] font-bold text-slate-400 uppercase text-center tracking-widest mt-2">
//                   Maximum file size: 10MB per document
//                 </p>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-60"
//                 >
//                   {loading ? (
//                     "Saving..."
//                   ) : (
//                     <>
//                       <Check size={16} /> Save Candidate
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- ENTERPRISE SOURCE PROTOCOL MODAL --- */}
//       {activeSourceModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setActiveSourceModal(null)}
//           />

//           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header */}
//             <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`p-4 rounded-2xl ${activeSourceModal === "excel" ? "bg-emerald-500" : "bg-indigo-500"} text-white shadow-xl`}
//                 >
//                   {activeSourceModal === "excel" ? (
//                     <FileSpreadsheet size={24} />
//                   ) : (
//                     <Webhook size={24} />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
//                     {activeSourceModal === "excel"
//                       ? "Bulk Data Ingestion"
//                       : "API Endpoint Configuration"}
//                   </h3>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                     {activeSourceModal === "excel"
//                       ? "Protocol: CSV / XLSX Source"
//                       : "Protocol: Restful Webhook"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setActiveSourceModal(null)}
//                 className="p-3 hover:bg-white rounded-2xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8">
//               {activeSourceModal === "excel" ? (
//                 <>
//                   {/* Formatting Note */}
//                   <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
//                     <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
//                       <AlertCircle size={20} />
//                     </div>
//                     <div className="space-y-1">
//                       <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">
//                         Required Schema Format
//                       </h4>
//                       <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
//                         To ensure successful synchronization, please arrange
//                         your columns in the following order:
//                         <span className="text-amber-900">
//                           {" "}
//                           Full Name, Email, Position, Experience (Years), and
//                           Education.
//                         </span>
//                         Empty rows will be automatically discarded during
//                         parsing.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Dropzone Area */}
//                   <div className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
//                     {/* <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       accept=".csv, .xlsx"
//                     /> */}
//                     <input
//                       type="file"
//                       accept=".csv,.xlsx"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setExcelFile(file);
//                       }}
//                     />

//                     <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
//                       <Download size={32} />
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-500 mt-2">
//                       {excelFile ? excelFile.name : "No file selected"}
//                     </p>

//                     <p className="text-sm font-black text-slate-800 tracking-tight">
//                       Deploy Spreadsheet File
//                     </p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
//                       Max Payload: 25MB
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 /* Webhook UI - Enterprise Entry Mode */
//                 <div className="space-y-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between ml-1">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Destination Endpoint
//                       </label>
//                       <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase">
//                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                         System Ready
//                       </span>
//                     </div>

//                     <div className="relative group">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                         <Webhook size={18} />
//                       </div>
//                       <input
//                         type="text"
//                         value={webhookUrl}
//                         onChange={(e) => setWebhookUrl(e.target.value)}
//                         placeholder="https://your-api-endpoint.com/hooks"
//                         className="w-full pl-12 pr-4 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm font-mono text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
//                       />
//                     </div>
//                   </div>

//                   {/* Connection Guidance */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Method
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         POST Request
//                       </p>
//                     </div>
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Auth Type
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         Bearer Token
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 flex items-start gap-4">
//                     <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
//                       <AlertCircle size={16} />
//                     </div>
//                     <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
//                       Ensure your endpoint is configured to accept{" "}
//                       <span className="underline">JSON payloads</span>. The
//                       system will send a ping request to verify this URL upon
//                       activation.
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {/* --- PLACE THE NEW BUTTON CODE HERE --- */}
//               <button
//                 disabled={
//                   isImporting || (activeSourceModal === "excel" && !excelFile)
//                 }
//                 className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
//             ${
//               activeSourceModal === "excel"
//                 ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
//                 : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
//             }`}
//                 // onClick={() => {
//                 //   if (activeSourceModal === "webhook") {
//                 //     setIsTestingConnection(true);
//                 //     // Simulate a verification pulse
//                 //     setTimeout(() => {
//                 //       setIsTestingConnection(false);
//                 //       setActiveSourceModal(null);
//                 //     }, 2000);
//                 //   } else {
//                 //     setActiveSourceModal(null);
//                 //   }
//                 // }}

//                 onClick={() => {
//                   if (activeSourceModal === "excel") {
//                     handleExcelImport();
//                   } else {
//                     setIsTestingConnection(true);
//                     setTimeout(() => {
//                       setIsTestingConnection(false);
//                       setActiveSourceModal(null);
//                       toast.success("Webhook activated successfully 🚀");
//                     }, 2000);
//                   }
//                 }}
//               >
//                 {isTestingConnection ? (
//                   <>
//                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Verifying Protocol...
//                   </>
//                 ) : activeSourceModal === "excel" ? (
//                   "Begin Synchronized Ingestion"
//                 ) : (
//                   "Activate Webhook"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {isMailModalOpen && (
//   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//       onClick={() => setIsMailModalOpen(false)}
//     />

//     <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10">
//       <h3 className="text-lg font-bold mb-4">Send Job Description</h3>

//       <select
//         value={selectedTemplate}
//         onChange={(e) => setSelectedTemplate(e.target.value)}
//         className="w-full border p-2 rounded mb-3"
//       >
//         <option value="">Select Template</option>
//         {templates.map((t) => (
//           <option key={t.id} value={t.id}>
//             {t.title}
//           </option>
//         ))}
//       </select>

//       <input
//         placeholder="Custom Role"
//         value={customRole}
//         onChange={(e) => setCustomRole(e.target.value)}
//         className="w-full border p-2 rounded mb-3"
//       />

//       <textarea
//         placeholder="Custom Content"
//         value={customContent}
//         onChange={(e) => setCustomContent(e.target.value)}
//         className="w-full border p-2 rounded mb-3"
//       />

//       <label className="flex items-center gap-2 text-sm">
//         <input
//           type="checkbox"
//           checked={saveAsTemplate}
//           onChange={(e) => setSaveAsTemplate(e.target.checked)}
//         />
//         Save as new template
//       </label>

//       {saveAsTemplate && (
//         <input
//           placeholder="New Template Title"
//           value={newTemplateTitle}
//           onChange={(e) => setNewTemplateTitle(e.target.value)}
//           className="w-full border p-2 rounded mt-2"
//         />
//       )}

//       <div className="flex gap-3 mt-4">
//         <button
//           onClick={() => setIsMailModalOpen(false)}
//           className="flex-1 bg-gray-200 py-2 rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleSendJD}
//           className="flex-1 bg-blue-600 text-white py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

//       {isMailModalOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsMailModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Communication Hub */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
//                   <Zap size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Transmission Protocol
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Deploying Job Architecture
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsMailModalOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Template Selector Section */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Select Source Template
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                     <FileText size={16} />
//                   </div>
//                   <select
//                     value={selectedTemplate}
//                     onChange={(e) => setSelectedTemplate(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
//                   >
//                     <option value="">Manual Override (No Template)</option>
//                     {templates.map((t) => (
//                       <option key={t.id} value={t.id}>
//                         {t.title}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <Filter size={14} />
//                   </div>
//                 </div>
//               </div>

//               {/* Dynamic Fields Grid */}
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Effective Role Designation
//                   </label>
//                   <input
//                     placeholder="e.g. Senior Logic Architect"
//                     value={customRole}
//                     onChange={(e) => setCustomRole(e.target.value)}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all placeholder:text-slate-300"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Custom Logic Payload
//                   </label>
//                   <textarea
//                     placeholder="Define specific transmission content..."
//                     value={customContent}
//                     onChange={(e) => setCustomContent(e.target.value)}
//                     className="w-full h-32 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all resize-none leading-relaxed"
//                   />
//                 </div>
//               </div>

//               {/* Logic Save Control */}
//               <div
//                 className={`p-4 rounded-2xl border transition-all duration-500 ${saveAsTemplate ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"}`}
//               >
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={saveAsTemplate}
//                       onChange={(e) => setSaveAsTemplate(e.target.checked)}
//                       className="peer sr-only"
//                     />
//                     <div className="w-10 h-5 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
//                     <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
//                   </div>
//                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
//                     Commit to Registry as New Template
//                   </span>
//                 </label>

//                 {saveAsTemplate && (
//                   <div className="mt-4 animate-in slide-in-from-top-2">
//                     <input
//                       placeholder="Input New Registry Name"
//                       value={newTemplateTitle}
//                       onChange={(e) => setNewTemplateTitle(e.target.value)}
//                       className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-blue-700 outline-none placeholder:text-blue-200"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer Actions */}
//             <div className="p-6 bg-slate-900 flex gap-3">
//               <button
//                 onClick={() => setIsMailModalOpen(false)}
//                 className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
//               >
//                 Abort
//               </button>

//               <button
//                 onClick={handleSendJD}
//                 className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
//               >
//                 Execute Transmission
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
//       {icon}
//     </div>

//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SidebarItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
//     <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>

//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
//         {label}
//       </p>

//       <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
//       {label}
//     </span>

//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={14}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
//       />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//   const colors = {
//     emerald:
//       "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

//     indigo:
//       "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

//     blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
//   };

//   return (
//     <div
//       className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//             {title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
//             {desc}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//     </label>

//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//       {label}
//     </p>
//     <p className="text-xs font-black text-slate-800">{value}</p>
//   </div>
// );

// const getSourceStyles = (source) => {
//   if (source === "Excel Import")
//     return "bg-emerald-50 text-emerald-600 border-emerald-100";

//   if (source === "Webhook")
//     return "bg-indigo-50 text-indigo-600 border-indigo-100";

//   return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//****************************************************working code phase 22**************************************************** */
// import React, { useState, useMemo ,useEffect } from "react";

// import {
//   FileSpreadsheet,
//   Webhook,
//   UserPlus,
//   Filter,
//   Search,
//   Mail,
//   MoreHorizontal,
//   ExternalLink,
//   Briefcase,
//   MapPin,
//   X,
//   Check,
//   GraduationCap,
//   ChevronDown,
//   Calendar,
//   Zap,
//   ArrowUpRight,
//   Eye,
//   FileText,
//   Award,
//   Download,
//   AlertCircle,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import toast from "react-hot-toast";
// import {
//   getJobTemplates,
// } from "../../services/jobTemplateService";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---

//   // const [candidates, setCandidates] = useState([
//   //   {
//   //     id: 1,
//   //     name: "Jane Doe",
//   //     email: "jane.doe@example.com",
//   //     exp: 8,
//   //     location: "Mumbai, MH",
//   //     source: "Excel Import",
//   //     position: "Fullstack Dev",
//   //     education: "B.Tech",
//   //     selected: false,
//   //     cvUrl:
//   //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   //   },

//   //   {
//   //     id: 2,
//   //     name: "Arjun Mehta",
//   //     email: "arjun.m@tech.com",
//   //     exp: 4,
//   //     location: "Bangalore, KA",
//   //     source: "Webhook",
//   //     position: "UI Designer",
//   //     education: "Masters",
//   //     selected: false,
//   //     cvUrl: null,
//   //   },

//   //   {
//   //     id: 3,
//   //     name: "Sarah Smith",
//   //     email: "sarah.s@global.com",
//   //     exp: 12,
//   //     location: "Remote",
//   //     source: "Manual Entry",
//   //     position: "Product Manager",
//   //     education: "MBA",
//   //     selected: false,
//   //     cvUrl:
//   //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   //   },

//   //   {
//   //     id: 4,
//   //     name: "Rahul Verma",
//   //     email: "rahul.v@dev.io",
//   //     exp: 2,
//   //     location: "Delhi, NCR",
//   //     source: "Excel Import",
//   //     position: "Fullstack Dev",
//   //     education: "B.Tech",
//   //     selected: false,
//   //     cvUrl: null,
//   //   },
//   // ]);
//   const [candidates, setCandidates] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // --- NEW STATE FOR SOURCE MODALS ---
//   const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [webhookUrl, setWebhookUrl] = useState("");
//   const [isTestingConnection, setIsTestingConnection] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
// const [expProof, setExpProof] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMailModalOpen, setIsMailModalOpen] = useState(false);
// const [templates, setTemplates] = useState([]);
// const [selectedTemplate, setSelectedTemplate] = useState("");
// const [customRole, setCustomRole] = useState("");
// const [customContent, setCustomContent] = useState("");
// const [saveAsTemplate, setSaveAsTemplate] = useState(false);
// const [newTemplateTitle, setNewTemplateTitle] = useState("");

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   phone: "",
//   //   address: "",
//   //   exp: "",
//   //   position: "",
//   //   education: "",
//   // });

//   const [formData, setFormData] = useState({
//   name: "",
//   email: "",
//   phone: "",
//   address: "",
//   exp: "",
//   position: "",
//   education: "",
//   fileName: "",
//   cvFile: null,
//   expLetterName: "",
//   expLetterFile: null,
// });
// const [loadingCandidates, setLoadingCandidates] = useState(true);

//   // --- FILTERING LOGIC ---

//   // const filteredCandidates = useMemo(() => {
//   //   return candidates.filter((c) => {
//   //     const matchesSearch =
//   //       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //       c.email.toLowerCase().includes(searchQuery.toLowerCase());

//   //     const matchesPosition =
//   //       filters.position === "All Positions" || c.position === filters.position;

//   //     const matchesEducation =
//   //       filters.education === "All Education" ||
//   //       c.education === filters.education;

//   //     let matchesExperience = true;

//   //     if (filters.experience === "Junior (0-3 yrs)")
//   //       matchesExperience = c.exp <= 3;

//   //     if (filters.experience === "Mid (4-7 yrs)")
//   //       matchesExperience = c.exp >= 4 && c.exp <= 7;

//   //     if (filters.experience === "Senior (8+ yrs)")
//   //       matchesExperience = c.exp >= 8;

//   //     return (
//   //       matchesSearch &&
//   //       matchesPosition &&
//   //       matchesEducation &&
//   //       matchesExperience
//   //     );
//   //   });
//   // }, [candidates, searchQuery, filters]);

//   const filteredCandidates = useMemo(() => {
//   return candidates.filter((c) => {
//     const name = c.name || c.full_name || "";
//     const email = c.email || c.email_address || "";

//     const matchesSearch =
//       name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       email.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesPosition =
//       filters.position === "All Positions" || c.position === filters.position;

//     const matchesEducation =
//       filters.education === "All Education" ||
//       c.education === filters.education;

//     let matchesExperience = true;

//     if (filters.experience === "Junior (0-3 yrs)")
//       matchesExperience = Number(c.exp || c.experience) <= 3;

//     if (filters.experience === "Mid (4-7 yrs)")
//       matchesExperience =
//         Number(c.exp || c.experience) >= 4 &&
//         Number(c.exp || c.experience) <= 7;

//     if (filters.experience === "Senior (8+ yrs)")
//       matchesExperience = Number(c.exp || c.experience) >= 8;

//     return (
//       matchesSearch &&
//       matchesPosition &&
//       matchesEducation &&
//       matchesExperience
//     );
//   });
// }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   // const handleManualEntry = (e) => {
//   //   e.preventDefault();

//   //   const newCandidate = {
//   //     id: Date.now(),
//   //     ...formData,
//   //     exp: parseInt(formData.exp),
//   //     source: "Manual Entry",
//   //     selected: false,
//   //     cvUrl: formData.cvUrl || null,
//   //   };

//   //   setCandidates([newCandidate, ...candidates]);

//   //   setIsModalOpen(false);
//   // };

// //   useEffect(() => {
// //   const loadCandidates = async () => {
// //     try {
// //       const data = await candidateService.getAll();
// //       setCandidates(data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   loadCandidates();
// // }, []);
// // useEffect(() => {
// //   const loadCandidates = async () => {
// //     try {
// //       const data = await candidateService.getAll();

// //       const mapped = data.map((c) => ({
// //         id: c.id,
// //         name: c.name || c.full_name,
// //         email: c.email,
// //         exp: c.experience,
// //         location: c.location,
// //         position: c.position,
// //         education: c.education,
// //         source: "API",
// //         selected: false,
// //         cvUrl: c.resumepdf_url || c.cv_url,
// //       }));

// //       setCandidates(mapped);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   loadCandidates();
// // }, []);
// // useEffect(() => {
// //   const loadCandidates = async () => {
// //     const data = await candidateService.getAll();

// //     const mapped = data.map((c) => ({
// //       id: c.id,
// //       name: c.full_name,
// //       email: c.email,
// //       exp: c.experience,
// //       location: c.location,
// //       position: c.position,
// //       education: c.education,
// //       source: c.entry_method || "API",
// //       selected: false,
// //       cvUrl: c.resume_path,
// //       expLetterUrl: c.experience_letter_path,
// //     }));

// //     setCandidates(mapped);
// //   };

// //   loadCandidates();
// // }, []);
// useEffect(() => {
//   const loadCandidates = async () => {
//     try {
//       const data = await candidateService.getAll();

//       console.log("API DATA:", data); // debug

//       const mapped = data.map((c) => ({
//         id: c.id,
//         name: c.full_name || c.name,
//         email: c.email,
//         exp: c.experience,
//         location: c.location,
//         position: c.position,
//         education: c.education,
//         source: c.entry_method || "API",
//         selected: false,
//         cvUrl: c.resume_path,
//         expLetterUrl: c.experience_letter_path,
//       }));

//       setCandidates(mapped);
//     } catch (err) {
//       console.error("API ERROR:", err);
//       toast.error("Failed to load candidates");
//     }
//   };

//   loadCandidates();
// }, []);

// // useEffect(() => {
// //   const loadCandidates = async () => {
// //     try {
// //       const data = await candidateService.getAll();
// //       setCandidates(mapped);
// //     } finally {
// //       setLoadingCandidates(false);
// //     }
// //   };
// //   loadCandidates();
// // }, []);

// useEffect(() => {
//   const loadTemplates = async () => {
//     try {
//       const data = await getJobTemplates();
//       setTemplates(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   loadTemplates();
// }, []);

// // const handleManualEntry = async (e) => {
// //   e.preventDefault();
// // console.log(formData)
// //   try {
// //     setLoading(true);

// //     // ✅ Create FormData
// //     const formDataApi = new FormData();
// //     formDataApi.append("name", formData.name);
// //     formDataApi.append("email", formData.email);
// //     formDataApi.append("position", formData.position);
// //     formDataApi.append("experience", formData.exp);
// //     formDataApi.append("education", formData.education);

// //     // 🔥 Backend expects "location" NOT address
// //     formDataApi.append("location", formData.address);

// //     // 🔥 Backend expects "resumepdf" NOT cv
// //     if (formData.cvFile) {
// //       formDataApi.append("resumepdf", formData.cvFile);
// //     }

// //     // 🔥 API CALL
// //     const createdCandidate = await candidateService.createCandidate(formDataApi);

// //     // Add candidate to UI table
// //     setCandidates((prev) => [
// //       {
// //         id: createdCandidate.id,
// //         name: formData.name,
// //         email: formData.email,
// //         exp: Number(formData.exp),
// //         location: formData.address,
// //         position: formData.position,
// //         education: formData.education,
// //         source: "Manual Entry",
// //         selected: false,
// //         cvUrl: createdCandidate.resumepdf_url || formData.cvUrl,
// //       },
// //       ...prev,
// //     ]);

// //     // Reset form
// //     setFormData({
// //       name: "",
// //       email: "",
// //       phone: "",
// //       address: "",
// //       exp: "",
// //       position: "",
// //       education: "",
// //     });

// //     setIsModalOpen(false);
// //   } catch (err) {
// //     console.error("Create candidate failed:", err);
// //     alert("Failed to create candidate");
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// const handleManualEntry = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     const formDataApi = new FormData();

//     // ✅ Backend field names
//     formDataApi.append("name", formData.name);
//     formDataApi.append("email", formData.email);
//     formDataApi.append("phone", formData.phone || "");
//     formDataApi.append("address", formData.address);
//     formDataApi.append("location", formData.address);
//     formDataApi.append("position", formData.position);
//     formDataApi.append("experience", formData.exp);
//     formDataApi.append("education", formData.education);
//     formDataApi.append("entry_method", "manual");

//     // ✅ Resume Upload
//     if (formData.cvFile) {
//          formDataApi.append("resumepdf", formData.cvFile);
//     }

//     // ✅ Experience Letter Upload
//     if (formData.expLetterFile) {
//       formDataApi.append("experience_letter", formData.expLetterFile);
//     }

//     // 🔥 API CALL
//     const createdCandidate = await candidateService.createCandidate(formDataApi);

//     // Add candidate to UI
//     setCandidates((prev) => [
//       {
//         id: createdCandidate.id,
//         name: createdCandidate.full_name,
//         email: createdCandidate.email,
//         exp: createdCandidate.experience,
//         location: createdCandidate.location,
//         position: createdCandidate.position,
//         education: createdCandidate.education,
//         source: "Manual Entry",
//         selected: false,
//         cvUrl: createdCandidate.resume_path,
//         expLetterUrl: createdCandidate.experience_letter_path,
//       },
//       ...prev,
//     ]);

//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       address: "",
//       exp: "",
//       position: "",
//       education: "",
//       fileName: "",
//       cvFile: null,
//       expLetterName: "",
//       expLetterFile: null,
//     });

//     setIsModalOpen(false);

//     // ✅ SUCCESS TOASTER
//     toast.success("Candidate uploaded successfully 🎉");

//   } catch (err) {
//     console.error("Create candidate failed:", err);
//     toast.error("Failed to upload candidate ❌");
//   } finally {
//     setLoading(false);
//   }
// };

// // const handleSendJD = async () => {
// //   try {
// //     const selectedIds = candidates
// //       .filter(c => c.selected)
// //       .map(c => c.id);

// //     const payload = {
// //       candidate_ids: selectedIds,
// //       template_id: Number(selectedTemplate),
// //       custom_role: customRole,
// //       custom_content: customContent,
// //       save_as_new_template: saveAsTemplate,
// //       new_template_title: newTemplateTitle,
// //     };

// //     await candidateService.sendJD(payload);

// //     toast.success("JD sent successfully 🚀");
// //   } catch (err) {
// //     console.error(err);
// //     toast.error("Failed to send JD ❌");
// //   }
// // };

// const handleSendJD = async () => {
//   try {
//     const selectedIds = candidates
//       .filter((c) => c.selected)
//       .map((c) => c.id);

//     if (!selectedIds.length) {
//       toast.error("Please select candidates");
//       return;
//     }

//     const payload = {
//       candidate_ids: selectedIds,
//       template_id: Number(selectedTemplate),
//       custom_role: customRole,
//       custom_content: customContent,
//       save_as_new_template: saveAsTemplate,
//       new_template_title: newTemplateTitle,
//     };

//     await candidateService.sendJD(payload);

//     toast.success("JD sent successfully 🚀");

//     // ✅ CLOSE MODAL
//     setIsMailModalOpen(false);

//     // ✅ CLEAR MODAL FORM DATA
//     setSelectedTemplate("");
//     setCustomRole("");
//     setCustomContent("");
//     setSaveAsTemplate(false);
//     setNewTemplateTitle("");

//     // ✅ OPTIONAL: UNSELECT ALL CANDIDATES
//     setCandidates((prev) =>
//       prev.map((c) => ({ ...c, selected: false }))
//     );

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to send JD ❌");
//   }
// };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every((c) => c.selected);

//     setCandidates(
//       candidates.map((c) =>
//         filteredCandidates.find((f) => f.id === c.id)
//           ? { ...c, selected: !allSelected }
//           : c,
//       ),
//     );
//   };

//   const toggleSelect = (id) => {
//     setCandidates(
//       candidates.map((c) =>
//         c.id === id ? { ...c, selected: !c.selected } : c,
//       ),
//     );
//   };

//   const getInitials = (name = "") => {
//   if (!name) return "U";
//   const parts = name.split(" ");
//   return parts.map(p => p[0]).join("").toUpperCase();
// };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">

//         <div onClick={() => setActiveSourceModal("excel")}>
//           <SourceCard
//             icon={<FileSpreadsheet />}
//             title="Excel Import"
//             desc="Bulk upload .csv or .xlsx"
//             color="emerald"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setActiveSourceModal("webhook")}>
//           <SourceCard
//             icon={<Webhook />}
//             title="API Webhook"
//             desc="Connect LinkedIn/Indeed"
//             color="indigo"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}

//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />

//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
//             Filters
//           </span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={[
//             "All Positions",
//             "Fullstack Dev",
//             "UI Designer",
//             "Product Manager",
//           ]}
//           value={filters.position}
//           onChange={(v) => setFilters({ ...filters, position: v })}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={[
//             "All Experience",
//             "Junior (0-3 yrs)",
//             "Mid (4-7 yrs)",
//             "Senior (8+ yrs)",
//           ]}
//           value={filters.experience}
//           onChange={(v) => setFilters({ ...filters, experience: v })}
//         />

//         <FilterDropdown
//           label="Education"
//           options={["All Education", "B.Tech", "Masters", "MBA"]}
//           value={filters.education}
//           onChange={(v) => setFilters({ ...filters, education: v })}
//         />

//         <button
//           onClick={() =>
//             setFilters({
//               position: "All Positions",
//               experience: "All Experience",
//               education: "All Education",
//             })
//           }
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}

//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">
//               Candidate Pool
//             </h2>

//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                 size={16}
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>

//             {/* <button
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button> */}
//             <button
//   onClick={() => setIsMailModalOpen(true)}
//   className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
//     candidates.some((c) => c.selected)
//       ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//       : "bg-slate-100 text-slate-400 cursor-not-allowed"
//   }`}
//   disabled={!candidates.some((c) => c.selected)}
// >
//   <Mail size={14} /> Shoot Mail
// </button>

//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {/* Add table-auto or table-fixed depending on how rigid you want it */}
//           <table className="w-full border-collapse table-auto">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 {/* Fixed narrow width for checkbox */}
//                 <th className="w-16 px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredCandidates.length > 0 &&
//                       filteredCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

//                 {/* This column will take most of the space */}
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Candidate Info
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Position & Exp
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Education
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Source
//                 </th>

//                 {/* Explicitly narrow the Actions column */}
//                 <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {/* {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)} */}
//                         {(c.name || "U").charAt(0)}
// {(c.name?.split(" ")[1] || "").charAt(0)}

//                       </div>
//                       <div className="min-w-0">
//                         {" "}
//                         {/* Prevents text from breaking layout */}
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {c.name}
//                         </p>
//                         <p className="text-[11px] text-slate-500 font-medium truncate">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp}
//                           {/* <Calendar size={12} /> {c.exp} Years Exp */}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>
//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <span
//                       className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   {/* Action cell with forced narrow width */}
//                   <td className="px-8 py-5 text-right w-24">
//                     <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                         title="View Profile"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//           {/* High-End Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           {/* Main Modal Container */}
//           <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
//             {/* 1. Integrated Header Section */}
//             <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//               <div className="flex items-center gap-6">
//                 <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
//                   {/* {selectedCandidate.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")} */}
//                     {getInitials(selectedCandidate?.name)}

//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">
//                       {selectedCandidate.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
//                     >
//                       {selectedCandidate.source}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Mail size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.email}
//                     </span>
//                     <span className="w-1 h-1 bg-slate-200 rounded-full" />
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Briefcase size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.position}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//                   <Download size={14} /> Download CV
//                 </button>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             {/* 2. Main Content Area */}
//             <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
//               {/* Quick Info Bar */}
//               <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//                 <QuickMetric
//                   label="Experience"
//                   value={`${selectedCandidate.exp} Years`}
//                 />
//                 <QuickMetric
//                   label="Education"
//                   value={selectedCandidate.education}
//                 />
//                 <QuickMetric
//                   label="Location"
//                   value={selectedCandidate.location}
//                 />
//                 <QuickMetric
//                   label="Candidate ID"
//                   value={`#TR-${selectedCandidate.id}`}
//                 />
//               </div>

//               {/* The PDF Viewer Surface */}
//               <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//                 <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                       className="w-full h-full border-none"
//                       title="Resume Viewer"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                         <FileText size={48} />
//                       </div>
//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Missing Curriculum Vitae
//                       </h5>
//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                         This record does not have a professional resume
//                         attached.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 3. Status Footer / Progress Bar */}
//             <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div
//                       key={i}
//                       className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Shared with 3 Hiring Managers
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">
//                   Application Health
//                 </span>
//                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MANUAL ENTRY MODAL (EXISITING) */}

//      {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* HEADER */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">
//                   New Candidate
//                 </h3>
//                 <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//                   Manual Record Entry
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               {/* ROW 1: Identity */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Full Name"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(v) => setFormData({ ...formData, name: v })}
//                 />
//                 <InputField
//                   label="Email Address"
//                   placeholder="john@example.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(v) => setFormData({ ...formData, email: v })}
//                 />
//               </div>

//               {/* ROW 2: Professional Details */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Position"
//                   placeholder="e.g. Fullstack Dev"
//                   value={formData.position}
//                   onChange={(v) => setFormData({ ...formData, position: v })}
//                 />
//                 <InputField
//                   label="Years of Experience"
//                   placeholder="e.g. 5"
//                   type="number"
//                   value={formData.exp}
//                   onChange={(v) => setFormData({ ...formData, exp: v })}
//                 />
//               </div>

//               {/* ROW 3: Contact & Education */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Phone Number"
//                   placeholder="+91 00000 00000"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(v) => setFormData({ ...formData, phone: v })}
//                 />
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                   value={formData.education}
//                   onChange={(v) => setFormData({ ...formData, education: v })}
//                 />
//               </div>

//               {/* ROW 4: Geography */}
//               <div className="grid grid-cols-1">
//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   value={formData.address}
//                   onChange={(v) => setFormData({ ...formData, address: v })}
//                 />
//               </div>

//               {/* --- DOCUMENT UPLOAD SECTION --- */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//                   Supporting Documents
//                 </label>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* RESUME UPLOAD */}
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           fileName: file.name,
//                           cvFile: file,
//                           cvUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}`}
//                     >
//                       <div className={`p-2 rounded-lg mb-2 ${formData.fileName ? "bg-blue-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}>
//                         {formData.fileName ? <Check size={16} /> : <FileText size={16} />}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.fileName ? formData.fileName : "Upload Resume"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* EXPERIENCE LETTER UPLOAD */}
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           expLetterName: file.name,
//                           expLetterFile: file,
//                           expLetterUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.expLetterName ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50 group-hover:border-emerald-400 group-hover:bg-emerald-50/50"}`}
//                     >
//                       <div className={`p-2 rounded-lg mb-2 ${formData.expLetterName ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}>
//                         {formData.expLetterName ? <Check size={16} /> : <Award size={16} />}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.expLetterName ? formData.expLetterName : "Experience Letter"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-[8px] font-bold text-slate-400 uppercase text-center tracking-widest mt-2">
//                   Maximum file size: 10MB per document
//                 </p>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-60"
//                 >
//                   {loading ? "Saving..." : <><Check size={16} /> Save Candidate</>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- ENTERPRISE SOURCE PROTOCOL MODAL --- */}
//       {activeSourceModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setActiveSourceModal(null)}
//           />

//           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header */}
//             <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`p-4 rounded-2xl ${activeSourceModal === "excel" ? "bg-emerald-500" : "bg-indigo-500"} text-white shadow-xl`}
//                 >
//                   {activeSourceModal === "excel" ? (
//                     <FileSpreadsheet size={24} />
//                   ) : (
//                     <Webhook size={24} />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
//                     {activeSourceModal === "excel"
//                       ? "Bulk Data Ingestion"
//                       : "API Endpoint Configuration"}
//                   </h3>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                     {activeSourceModal === "excel"
//                       ? "Protocol: CSV / XLSX Source"
//                       : "Protocol: Restful Webhook"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setActiveSourceModal(null)}
//                 className="p-3 hover:bg-white rounded-2xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8">
//               {activeSourceModal === "excel" ? (
//                 <>
//                   {/* Formatting Note */}
//                   <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
//                     <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
//                       <AlertCircle size={20} />
//                     </div>
//                     <div className="space-y-1">
//                       <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">
//                         Required Schema Format
//                       </h4>
//                       <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
//                         To ensure successful synchronization, please arrange
//                         your columns in the following order:
//                         <span className="text-amber-900">
//                           {" "}
//                           Full Name, Email, Position, Experience (Years), and
//                           Education.
//                         </span>
//                         Empty rows will be automatically discarded during
//                         parsing.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Dropzone Area */}
//                   <div className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
//                     <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       accept=".csv, .xlsx"
//                     />
//                     <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
//                       <Download size={32} />
//                     </div>
//                     <p className="text-sm font-black text-slate-800 tracking-tight">
//                       Deploy Spreadsheet File
//                     </p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
//                       Max Payload: 25MB
//                     </p>
//                   </div>
//                 </>
//               ) : (

//                 /* Webhook UI - Enterprise Entry Mode */
//                 <div className="space-y-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between ml-1">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Destination Endpoint
//                       </label>
//                       <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase">
//                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                         System Ready
//                       </span>
//                     </div>

//                     <div className="relative group">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                         <Webhook size={18} />
//                       </div>
//                       <input
//                         type="text"
//                         value={webhookUrl}
//                         onChange={(e) => setWebhookUrl(e.target.value)}
//                         placeholder="https://your-api-endpoint.com/hooks"
//                         className="w-full pl-12 pr-4 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm font-mono text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
//                       />
//                     </div>
//                   </div>

//                   {/* Connection Guidance */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Method
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         POST Request
//                       </p>
//                     </div>
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Auth Type
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         Bearer Token
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 flex items-start gap-4">
//                     <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
//                       <AlertCircle size={16} />
//                     </div>
//                     <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
//                       Ensure your endpoint is configured to accept{" "}
//                       <span className="underline">JSON payloads</span>. The
//                       system will send a ping request to verify this URL upon
//                       activation.
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {/* --- PLACE THE NEW BUTTON CODE HERE --- */}
//               <button
//                 className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
//             ${
//               activeSourceModal === "excel"
//                 ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
//                 : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
//             }`}
//                 onClick={() => {
//                   if (activeSourceModal === "webhook") {
//                     setIsTestingConnection(true);
//                     // Simulate a verification pulse
//                     setTimeout(() => {
//                       setIsTestingConnection(false);
//                       setActiveSourceModal(null);
//                     }, 2000);
//                   } else {
//                     setActiveSourceModal(null);
//                   }
//                 }}
//               >
//                 {isTestingConnection ? (
//                   <>
//                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Verifying Protocol...
//                   </>
//                 ) : activeSourceModal === "excel" ? (
//                   "Begin Synchronized Ingestion"
//                 ) : (
//                   "Activate Webhook"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {isMailModalOpen && (
//   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//       onClick={() => setIsMailModalOpen(false)}
//     />

//     <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10">
//       <h3 className="text-lg font-bold mb-4">Send Job Description</h3>

//       <select
//         value={selectedTemplate}
//         onChange={(e) => setSelectedTemplate(e.target.value)}
//         className="w-full border p-2 rounded mb-3"
//       >
//         <option value="">Select Template</option>
//         {templates.map((t) => (
//           <option key={t.id} value={t.id}>
//             {t.title}
//           </option>
//         ))}
//       </select>

//       <input
//         placeholder="Custom Role"
//         value={customRole}
//         onChange={(e) => setCustomRole(e.target.value)}
//         className="w-full border p-2 rounded mb-3"
//       />

//       <textarea
//         placeholder="Custom Content"
//         value={customContent}
//         onChange={(e) => setCustomContent(e.target.value)}
//         className="w-full border p-2 rounded mb-3"
//       />

//       <label className="flex items-center gap-2 text-sm">
//         <input
//           type="checkbox"
//           checked={saveAsTemplate}
//           onChange={(e) => setSaveAsTemplate(e.target.checked)}
//         />
//         Save as new template
//       </label>

//       {saveAsTemplate && (
//         <input
//           placeholder="New Template Title"
//           value={newTemplateTitle}
//           onChange={(e) => setNewTemplateTitle(e.target.value)}
//           className="w-full border p-2 rounded mt-2"
//         />
//       )}

//       <div className="flex gap-3 mt-4">
//         <button
//           onClick={() => setIsMailModalOpen(false)}
//           className="flex-1 bg-gray-200 py-2 rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleSendJD}
//           className="flex-1 bg-blue-600 text-white py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

// {isMailModalOpen && (
//   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//     {/* Backdrop with extreme glass effect */}
//     <div
//       className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//       onClick={() => setIsMailModalOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">

//       {/* Header: Communication Hub */}
//       <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <Zap size={20} />
//           </div>
//           <div>
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Transmission Protocol</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Deploying Job Architecture</p>
//           </div>
//         </div>
//         <button onClick={() => setIsMailModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
//           <X size={20} />
//         </button>
//       </div>

//       <div className="p-8 space-y-6">

//         {/* Template Selector Section */}
//         <div className="space-y-2">
//           <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Source Template</label>
//           <div className="relative group">
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//               <FileText size={16} />
//             </div>
//             <select
//               value={selectedTemplate}
//               onChange={(e) => setSelectedTemplate(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
//             >
//               <option value="">Manual Override (No Template)</option>
//               {templates.map((t) => (
//                 <option key={t.id} value={t.id}>{t.title}</option>
//               ))}
//             </select>
//             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                 <Filter size={14} />
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Fields Grid */}
//         <div className="grid grid-cols-1 gap-4">
//           <div className="space-y-2">
//             <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Effective Role Designation</label>
//             <input
//               placeholder="e.g. Senior Logic Architect"
//               value={customRole}
//               onChange={(e) => setCustomRole(e.target.value)}
//               className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all placeholder:text-slate-300"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Custom Logic Payload</label>
//             <textarea
//               placeholder="Define specific transmission content..."
//               value={customContent}
//               onChange={(e) => setCustomContent(e.target.value)}
//               className="w-full h-32 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all resize-none leading-relaxed"
//             />
//           </div>
//         </div>

//         {/* Logic Save Control */}
//         <div className={`p-4 rounded-2xl border transition-all duration-500 ${saveAsTemplate ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
//           <label className="flex items-center gap-3 cursor-pointer">
//             <div className="relative">
//                 <input
//                     type="checkbox"
//                     checked={saveAsTemplate}
//                     onChange={(e) => setSaveAsTemplate(e.target.checked)}
//                     className="peer sr-only"
//                 />
//                 <div className="w-10 h-5 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
//                 <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
//             </div>
//             <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Commit to Registry as New Template</span>
//           </label>

//           {saveAsTemplate && (
//             <div className="mt-4 animate-in slide-in-from-top-2">
//                 <input
//                     placeholder="Input New Registry Name"
//                     value={newTemplateTitle}
//                     onChange={(e) => setNewTemplateTitle(e.target.value)}
//                     className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-blue-700 outline-none placeholder:text-blue-200"
//                 />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer Actions */}
//       <div className="p-6 bg-slate-900 flex gap-3">
//         <button
//           onClick={() => setIsMailModalOpen(false)}
//           className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
//         >
//           Abort
//         </button>

//         <button
//           onClick={handleSendJD}
//           className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
//         >
//           Execute Transmission
//           <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
//       {icon}
//     </div>

//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SidebarItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
//     <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>

//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
//         {label}
//       </p>

//       <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
//       {label}
//     </span>

//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={14}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
//       />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//   const colors = {
//     emerald:
//       "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

//     indigo:
//       "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

//     blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
//   };

//   return (
//     <div
//       className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//             {title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
//             {desc}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//     </label>

//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//       {label}
//     </p>
//     <p className="text-xs font-black text-slate-800">{value}</p>
//   </div>
// );

// const getSourceStyles = (source) => {
//   if (source === "Excel Import")
//     return "bg-emerald-50 text-emerald-600 border-emerald-100";

//   if (source === "Webhook")
//     return "bg-indigo-50 text-indigo-600 border-indigo-100";

//   return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//****************************************************working code phase 55555************************************************ */
// import React, { useState, useMemo } from "react";

// import {
//   FileSpreadsheet,
//   Webhook,
//   UserPlus,
//   Filter,
//   Search,
//   Mail,
//   MoreHorizontal,
//   ExternalLink,
//   Briefcase,
//   MapPin,
//   X,
//   Check,
//   GraduationCap,
//   ChevronDown,
//   Calendar,
//   Eye,
//   FileText,
//   Download,
//   AlertCircle,
// } from "lucide-react";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---

//   const [candidates, setCandidates] = useState([
//     {
//       id: 1,
//       name: "Jane Doe",
//       email: "jane.doe@example.com",
//       exp: 8,
//       location: "Mumbai, MH",
//       source: "Excel Import",
//       position: "Fullstack Dev",
//       education: "B.Tech",
//       selected: false,
//       cvUrl:
//         "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     },

//     {
//       id: 2,
//       name: "Arjun Mehta",
//       email: "arjun.m@tech.com",
//       exp: 4,
//       location: "Bangalore, KA",
//       source: "Webhook",
//       position: "UI Designer",
//       education: "Masters",
//       selected: false,
//       cvUrl: null,
//     },

//     {
//       id: 3,
//       name: "Sarah Smith",
//       email: "sarah.s@global.com",
//       exp: 12,
//       location: "Remote",
//       source: "Manual Entry",
//       position: "Product Manager",
//       education: "MBA",
//       selected: false,
//       cvUrl:
//         "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     },

//     {
//       id: 4,
//       name: "Rahul Verma",
//       email: "rahul.v@dev.io",
//       exp: 2,
//       location: "Delhi, NCR",
//       source: "Excel Import",
//       position: "Fullstack Dev",
//       education: "B.Tech",
//       selected: false,
//       cvUrl: null,
//     },
//   ]);

//   // --- NEW STATE FOR SOURCE MODALS ---
//   const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [webhookUrl, setWebhookUrl] = useState("");
//   const [isTestingConnection, setIsTestingConnection] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
// const [expProof, setExpProof] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     exp: "",
//     position: "Fullstack Dev",
//     education: "B.Tech",
//   });

//   // --- FILTERING LOGIC ---

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((c) => {
//       const matchesSearch =
//         c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         c.email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition =
//         filters.position === "All Positions" || c.position === filters.position;

//       const matchesEducation =
//         filters.education === "All Education" ||
//         c.education === filters.education;

//       let matchesExperience = true;

//       if (filters.experience === "Junior (0-3 yrs)")
//         matchesExperience = c.exp <= 3;

//       if (filters.experience === "Mid (4-7 yrs)")
//         matchesExperience = c.exp >= 4 && c.exp <= 7;

//       if (filters.experience === "Senior (8+ yrs)")
//         matchesExperience = c.exp >= 8;

//       return (
//         matchesSearch &&
//         matchesPosition &&
//         matchesEducation &&
//         matchesExperience
//       );
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   const handleManualEntry = (e) => {
//     e.preventDefault();

//     const newCandidate = {
//       id: Date.now(),
//       ...formData,
//       exp: parseInt(formData.exp),
//       source: "Manual Entry",
//       selected: false,
//       cvUrl: formData.cvUrl || null,
//     };

//     setCandidates([newCandidate, ...candidates]);

//     setIsModalOpen(false);
//   };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every((c) => c.selected);

//     setCandidates(
//       candidates.map((c) =>
//         filteredCandidates.find((f) => f.id === c.id)
//           ? { ...c, selected: !allSelected }
//           : c,
//       ),
//     );
//   };

//   const toggleSelect = (id) => {
//     setCandidates(
//       candidates.map((c) =>
//         c.id === id ? { ...c, selected: !c.selected } : c,
//       ),
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* <SourceCard
//           icon={<FileSpreadsheet />}
//           title="Excel Import"
//           desc="Bulk upload .csv or .xlsx"
//           color="emerald"
//         />

//         <SourceCard
//           icon={<Webhook />}
//           title="API Webhook"
//           desc="Connect LinkedIn/Indeed"
//           color="indigo"
//         />

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div> */}
//         <div onClick={() => setActiveSourceModal("excel")}>
//           <SourceCard
//             icon={<FileSpreadsheet />}
//             title="Excel Import"
//             desc="Bulk upload .csv or .xlsx"
//             color="emerald"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setActiveSourceModal("webhook")}>
//           <SourceCard
//             icon={<Webhook />}
//             title="API Webhook"
//             desc="Connect LinkedIn/Indeed"
//             color="indigo"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}

//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />

//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
//             Filters
//           </span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={[
//             "All Positions",
//             "Fullstack Dev",
//             "UI Designer",
//             "Product Manager",
//           ]}
//           value={filters.position}
//           onChange={(v) => setFilters({ ...filters, position: v })}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={[
//             "All Experience",
//             "Junior (0-3 yrs)",
//             "Mid (4-7 yrs)",
//             "Senior (8+ yrs)",
//           ]}
//           value={filters.experience}
//           onChange={(v) => setFilters({ ...filters, experience: v })}
//         />

//         <FilterDropdown
//           label="Education"
//           options={["All Education", "B.Tech", "Masters", "MBA"]}
//           value={filters.education}
//           onChange={(v) => setFilters({ ...filters, education: v })}
//         />

//         <button
//           onClick={() =>
//             setFilters({
//               position: "All Positions",
//               experience: "All Experience",
//               education: "All Education",
//             })
//           }
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}

//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">
//               Candidate Pool
//             </h2>

//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                 size={16}
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>

//             <button
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {/* Add table-auto or table-fixed depending on how rigid you want it */}
//           <table className="w-full border-collapse table-auto">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 {/* Fixed narrow width for checkbox */}
//                 <th className="w-16 px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredCandidates.length > 0 &&
//                       filteredCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

//                 {/* This column will take most of the space */}
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Candidate Info
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Position & Exp
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Education
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Source
//                 </th>

//                 {/* Explicitly narrow the Actions column */}
//                 <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)}
//                       </div>
//                       <div className="min-w-0">
//                         {" "}
//                         {/* Prevents text from breaking layout */}
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {c.name}
//                         </p>
//                         <p className="text-[11px] text-slate-500 font-medium truncate">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp} Years Exp
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>
//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <span
//                       className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   {/* Action cell with forced narrow width */}
//                   <td className="px-8 py-5 text-right w-24">
//                     <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                         title="View Profile"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//           {/* High-End Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           {/* Main Modal Container */}
//           <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
//             {/* 1. Integrated Header Section */}
//             <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//               <div className="flex items-center gap-6">
//                 <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
//                   {selectedCandidate.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">
//                       {selectedCandidate.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
//                     >
//                       {selectedCandidate.source}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Mail size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.email}
//                     </span>
//                     <span className="w-1 h-1 bg-slate-200 rounded-full" />
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Briefcase size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.position}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//                   <Download size={14} /> Download CV
//                 </button>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             {/* 2. Main Content Area */}
//             <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
//               {/* Quick Info Bar */}
//               <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//                 <QuickMetric
//                   label="Experience"
//                   value={`${selectedCandidate.exp} Years`}
//                 />
//                 <QuickMetric
//                   label="Education"
//                   value={selectedCandidate.education}
//                 />
//                 <QuickMetric
//                   label="Location"
//                   value={selectedCandidate.location}
//                 />
//                 <QuickMetric
//                   label="Candidate ID"
//                   value={`#TR-${selectedCandidate.id}`}
//                 />
//               </div>

//               {/* The PDF Viewer Surface */}
//               <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//                 <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                       className="w-full h-full border-none"
//                       title="Resume Viewer"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                         <FileText size={48} />
//                       </div>
//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Missing Curriculum Vitae
//                       </h5>
//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                         This record does not have a professional resume
//                         attached.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 3. Status Footer / Progress Bar */}
//             <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div
//                       key={i}
//                       className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Shared with 3 Hiring Managers
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">
//                   Application Health
//                 </span>
//                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MANUAL ENTRY MODAL (EXISITING) */}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* HEADER */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">
//                   New Candidate
//                 </h3>
//                 <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//                   Manual Record Entry
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               {/* ROW 1 */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Full Name"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(v) => setFormData({ ...formData, name: v })}
//                 />
//                 <InputField
//                   label="Email Address"
//                   placeholder="john@example.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(v) => setFormData({ ...formData, email: v })}
//                 />
//               </div>

//               {/* ROW 2 */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Position"
//                   placeholder="e.g. Fullstack Dev"
//                   value={formData.position}
//                   onChange={(v) => setFormData({ ...formData, position: v })}
//                 />
//                 <InputField
//                   label="Years of Experience"
//                   placeholder="e.g. 5"
//                   type="number"
//                   value={formData.exp}
//                   onChange={(v) => setFormData({ ...formData, exp: v })}
//                 />
//               </div>

//               {/* ROW 3 */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                   value={formData.education}
//                   onChange={(v) => setFormData({ ...formData, education: v })}
//                 />
//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   value={formData.address}
//                   onChange={(v) => setFormData({ ...formData, address: v })}
//                 />
//               </div>

//               {/* --- ENTERPRISE UPLOAD SECTION --- */}
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//                   Resume / Curriculum Vitae
//                 </label>
//                 <div className="relative group">
//                   {/* Hidden Input for Functionality */}
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (!file) return;

//                       const previewUrl = URL.createObjectURL(file);

//                       setFormData({
//                         ...formData,
//                         fileName: file.name,
//                         cvFile: file,
//                         cvUrl: previewUrl, // 🔥 important
//                       });
//                     }}
//                   />

//                   {/* Visual UI Box */}
//                   <div
//                     className={`
//               border-2 border-dashed rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col items-center justify-center
//               ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}
//             `}
//                   >
//                     <div
//                       className={`
//                 p-3 rounded-xl mb-3 transition-colors
//                 ${formData.fileName ? "bg-blue-500 text-white" : "bg-white text-slate-400 shadow-sm group-hover:text-blue-500"}
//               `}
//                     >
//                       {formData.fileName ? (
//                         <Check size={20} />
//                       ) : (
//                         <FileText size={20} />
//                       )}
//                     </div>

//                     <div className="text-center">
//                       <p className="text-xs font-bold text-slate-700">
//                         {formData.fileName
//                           ? formData.fileName
//                           : "Click or drag to upload candidate CV"}
//                       </p>
//                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">
//                         Supported formats: PDF, DOCX (Max 10MB)
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ACTION BUTTONS */}
//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
//                 >
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- ENTERPRISE SOURCE PROTOCOL MODAL --- */}
//       {activeSourceModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setActiveSourceModal(null)}
//           />

//           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header */}
//             <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`p-4 rounded-2xl ${activeSourceModal === "excel" ? "bg-emerald-500" : "bg-indigo-500"} text-white shadow-xl`}
//                 >
//                   {activeSourceModal === "excel" ? (
//                     <FileSpreadsheet size={24} />
//                   ) : (
//                     <Webhook size={24} />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
//                     {activeSourceModal === "excel"
//                       ? "Bulk Data Ingestion"
//                       : "API Endpoint Configuration"}
//                   </h3>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                     {activeSourceModal === "excel"
//                       ? "Protocol: CSV / XLSX Source"
//                       : "Protocol: Restful Webhook"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setActiveSourceModal(null)}
//                 className="p-3 hover:bg-white rounded-2xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8">
//               {activeSourceModal === "excel" ? (
//                 <>
//                   {/* Formatting Note */}
//                   <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
//                     <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
//                       <AlertCircle size={20} />
//                     </div>
//                     <div className="space-y-1">
//                       <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">
//                         Required Schema Format
//                       </h4>
//                       <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
//                         To ensure successful synchronization, please arrange
//                         your columns in the following order:
//                         <span className="text-amber-900">
//                           {" "}
//                           Full Name, Email, Position, Experience (Years), and
//                           Education.
//                         </span>
//                         Empty rows will be automatically discarded during
//                         parsing.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Dropzone Area */}
//                   <div className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
//                     <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       accept=".csv, .xlsx"
//                     />
//                     <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
//                       <Download size={32} />
//                     </div>
//                     <p className="text-sm font-black text-slate-800 tracking-tight">
//                       Deploy Spreadsheet File
//                     </p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
//                       Max Payload: 25MB
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 /* Webhook UI */
//                 // <div className="space-y-6">
//                 //   <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
//                 //     <div className="flex items-center justify-between">
//                 //       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Endpoint URL</span>
//                 //       <span className="text-[9px] font-bold text-slate-500 uppercase">Status: Active</span>
//                 //     </div>
//                 //     <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
//                 //       <code className="text-xs font-mono text-indigo-300 overflow-hidden text-ellipsis">https://api.talent-os.io/v1/webhook/TR-9921</code>
//                 //       <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><ExternalLink size={14}/></button>
//                 //     </div>
//                 //   </div>
//                 //   <p className="text-[11px] text-slate-500 font-bold text-center italic">
//                 //     "System is listening for incoming POST requests from LinkedIn and Indeed integration."
//                 //   </p>
//                 // </div>
//                 /* Webhook UI - Enterprise Entry Mode */
//                 <div className="space-y-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between ml-1">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Destination Endpoint
//                       </label>
//                       <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase">
//                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                         System Ready
//                       </span>
//                     </div>

//                     <div className="relative group">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                         <Webhook size={18} />
//                       </div>
//                       <input
//                         type="text"
//                         value={webhookUrl}
//                         onChange={(e) => setWebhookUrl(e.target.value)}
//                         placeholder="https://your-api-endpoint.com/hooks"
//                         className="w-full pl-12 pr-4 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm font-mono text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
//                       />
//                     </div>
//                   </div>

//                   {/* Connection Guidance */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Method
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         POST Request
//                       </p>
//                     </div>
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Auth Type
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         Bearer Token
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 flex items-start gap-4">
//                     <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
//                       <AlertCircle size={16} />
//                     </div>
//                     <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
//                       Ensure your endpoint is configured to accept{" "}
//                       <span className="underline">JSON payloads</span>. The
//                       system will send a ping request to verify this URL upon
//                       activation.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* <button
//           className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl ${activeSourceModal === 'excel' ? 'bg-emerald-600 shadow-emerald-200 text-white' : 'bg-slate-900 shadow-slate-200 text-white'}`}
//           onClick={() => setActiveSourceModal(null)}
//         >
//           {activeSourceModal === 'excel' ? "Begin Synchronized Ingestion" : "Validate Connection"}
//         </button> */}
//               {/* --- PLACE THE NEW BUTTON CODE HERE --- */}
//               <button
//                 className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
//             ${
//               activeSourceModal === "excel"
//                 ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
//                 : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
//             }`}
//                 onClick={() => {
//                   if (activeSourceModal === "webhook") {
//                     setIsTestingConnection(true);
//                     // Simulate a verification pulse
//                     setTimeout(() => {
//                       setIsTestingConnection(false);
//                       setActiveSourceModal(null);
//                     }, 2000);
//                   } else {
//                     setActiveSourceModal(null);
//                   }
//                 }}
//               >
//                 {isTestingConnection ? (
//                   <>
//                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Verifying Protocol...
//                   </>
//                 ) : activeSourceModal === "excel" ? (
//                   "Begin Synchronized Ingestion"
//                 ) : (
//                   "Activate Webhook"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
//       {icon}
//     </div>

//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SidebarItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
//     <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>

//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
//         {label}
//       </p>

//       <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
//       {label}
//     </span>

//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={14}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
//       />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//   const colors = {
//     emerald:
//       "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

//     indigo:
//       "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

//     blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
//   };

//   return (
//     <div
//       className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//             {title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
//             {desc}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//     </label>

//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//       {label}
//     </p>
//     <p className="text-xs font-black text-slate-800">{value}</p>
//   </div>
// );

// const getSourceStyles = (source) => {
//   if (source === "Excel Import")
//     return "bg-emerald-50 text-emerald-600 border-emerald-100";

//   if (source === "Webhook")
//     return "bg-indigo-50 text-indigo-600 border-indigo-100";

//   return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//**************************************************working code phase 1*********************************************************** */
// import React, { useState, useMemo } from "react";

// import {
//   FileSpreadsheet,
//   Webhook,
//   UserPlus,
//   Filter,
//   Search,
//   Mail,
//   MoreHorizontal,
//   ExternalLink,
//   Briefcase,
//   MapPin,
//   X,
//   Check,
//   GraduationCap,
//   ChevronDown,
//   Calendar,
//   Eye,
//   FileText,
//   Download,
//   AlertCircle,
// } from "lucide-react";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---

//   const [candidates, setCandidates] = useState([
//     {
//       id: 1,
//       name: "Jane Doe",
//       email: "jane.doe@example.com",
//       exp: 8,
//       location: "Mumbai, MH",
//       source: "Excel Import",
//       position: "Fullstack Dev",
//       education: "B.Tech",
//       selected: false,
//       cvUrl:
//         "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     },

//     {
//       id: 2,
//       name: "Arjun Mehta",
//       email: "arjun.m@tech.com",
//       exp: 4,
//       location: "Bangalore, KA",
//       source: "Webhook",
//       position: "UI Designer",
//       education: "Masters",
//       selected: false,
//       cvUrl: null,
//     },

//     {
//       id: 3,
//       name: "Sarah Smith",
//       email: "sarah.s@global.com",
//       exp: 12,
//       location: "Remote",
//       source: "Manual Entry",
//       position: "Product Manager",
//       education: "MBA",
//       selected: false,
//       cvUrl:
//         "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     },

//     {
//       id: 4,
//       name: "Rahul Verma",
//       email: "rahul.v@dev.io",
//       exp: 2,
//       location: "Delhi, NCR",
//       source: "Excel Import",
//       position: "Fullstack Dev",
//       education: "B.Tech",
//       selected: false,
//       cvUrl: null,
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog

//   const [searchQuery, setSearchQuery] = useState("");

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     exp: "",
//     position: "Fullstack Dev",
//     education: "B.Tech",
//   });

//   // --- FILTERING LOGIC ---

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((c) => {
//       const matchesSearch =
//         c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         c.email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition =
//         filters.position === "All Positions" || c.position === filters.position;

//       const matchesEducation =
//         filters.education === "All Education" ||
//         c.education === filters.education;

//       let matchesExperience = true;

//       if (filters.experience === "Junior (0-3 yrs)")
//         matchesExperience = c.exp <= 3;

//       if (filters.experience === "Mid (4-7 yrs)")
//         matchesExperience = c.exp >= 4 && c.exp <= 7;

//       if (filters.experience === "Senior (8+ yrs)")
//         matchesExperience = c.exp >= 8;

//       return (
//         matchesSearch &&
//         matchesPosition &&
//         matchesEducation &&
//         matchesExperience
//       );
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   const handleManualEntry = (e) => {
//     e.preventDefault();

//    const newCandidate = {
//   id: Date.now(),
//   ...formData,
//   exp: parseInt(formData.exp),
//   source: "Manual Entry",
//   selected: false,
//   cvUrl: formData.cvUrl || null,
// };

//     setCandidates([newCandidate, ...candidates]);

//     setIsModalOpen(false);
//   };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every((c) => c.selected);

//     setCandidates(
//       candidates.map((c) =>
//         filteredCandidates.find((f) => f.id === c.id)
//           ? { ...c, selected: !allSelected }
//           : c,
//       ),
//     );
//   };

//   const toggleSelect = (id) => {
//     setCandidates(
//       candidates.map((c) =>
//         c.id === id ? { ...c, selected: !c.selected } : c,
//       ),
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard
//           icon={<FileSpreadsheet />}
//           title="Excel Import"
//           desc="Bulk upload .csv or .xlsx"
//           color="emerald"
//         />

//         <SourceCard
//           icon={<Webhook />}
//           title="API Webhook"
//           desc="Connect LinkedIn/Indeed"
//           color="indigo"
//         />

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}

//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />

//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
//             Filters
//           </span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={[
//             "All Positions",
//             "Fullstack Dev",
//             "UI Designer",
//             "Product Manager",
//           ]}
//           value={filters.position}
//           onChange={(v) => setFilters({ ...filters, position: v })}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={[
//             "All Experience",
//             "Junior (0-3 yrs)",
//             "Mid (4-7 yrs)",
//             "Senior (8+ yrs)",
//           ]}
//           value={filters.experience}
//           onChange={(v) => setFilters({ ...filters, experience: v })}
//         />

//         <FilterDropdown
//           label="Education"
//           options={["All Education", "B.Tech", "Masters", "MBA"]}
//           value={filters.education}
//           onChange={(v) => setFilters({ ...filters, education: v })}
//         />

//         <button
//           onClick={() =>
//             setFilters({
//               position: "All Positions",
//               experience: "All Experience",
//               education: "All Education",
//             })
//           }
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}

//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">
//               Candidate Pool
//             </h2>

//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                 size={16}
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>

//             <button
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}

//         {/* <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredCandidates.length > 0 &&
//                       filteredCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Candidate Info
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Position & Exp
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Education
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Source
//                 </th>

//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5 text-left">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)}
//                       </div>

//                       <div>
//                         <p className="text-sm font-bold text-slate-800">
//                           {c.name}
//                         </p>

//                         <p className="text-[11px] text-slate-500 font-medium">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>

//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp} Years Exp
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>

//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 text-[10px]">
//                     <span
//                       className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
//                       >
//                         <Eye size={16} />
//                       </button>

//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredCandidates.length === 0 && (
//             <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
//               No candidates match your filters
//             </div>
//           )}
//         </div> */}
//         <div className="overflow-x-auto">
//   {/* Add table-auto or table-fixed depending on how rigid you want it */}
//   <table className="w-full border-collapse table-auto">
//     <thead>
//       <tr className="bg-slate-50/50">
//         {/* Fixed narrow width for checkbox */}
//         <th className="w-16 px-8 py-4 text-left">
//           <input
//             type="checkbox"
//             checked={filteredCandidates.length > 0 && filteredCandidates.every((c) => c.selected)}
//             onChange={toggleSelectAll}
//             className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//           />
//         </th>

//         {/* This column will take most of the space */}
//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Candidate Info
//         </th>

//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Position & Exp
//         </th>

//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Education
//         </th>

//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Source
//         </th>

//         {/* Explicitly narrow the Actions column */}
//         <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//           Actions
//         </th>
//       </tr>
//     </thead>

//     <tbody className="divide-y divide-slate-100">
//       {filteredCandidates.map((c) => (
//         <tr
//           key={c.id}
//           className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//         >
//           <td className="px-8 py-5">
//             <input
//               type="checkbox"
//               checked={c.selected}
//               onChange={() => toggleSelect(c.id)}
//               className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//             />
//           </td>

//           <td className="px-4 py-5">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                 {c.name.charAt(0)}{c.name.split(" ")[1]?.charAt(0)}
//               </div>
//               <div className="min-w-0"> {/* Prevents text from breaking layout */}
//                 <p className="text-sm font-bold text-slate-800 truncate">{c.name}</p>
//                 <p className="text-[11px] text-slate-500 font-medium truncate">{c.email}</p>
//               </div>
//             </div>
//           </td>

//           <td className="px-4 py-5 whitespace-nowrap">
//             <div className="space-y-1">
//               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                 <Briefcase size={12} className="text-blue-500" /> {c.position}
//               </div>
//               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                 <Calendar size={12} /> {c.exp} Years Exp
//               </div>
//             </div>
//           </td>

//           <td className="px-4 py-5 whitespace-nowrap">
//             <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//               <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                 <GraduationCap size={12} />
//               </div>
//               {c.education}
//             </div>
//           </td>

//           <td className="px-4 py-5">
//             <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}>
//               {c.source}
//             </span>
//           </td>

//           {/* Action cell with forced narrow width */}
//           <td className="px-8 py-5 text-right w-24">
//             <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//               <button
//                 onClick={() => setSelectedCandidate(c)}
//                 className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                 title="View Profile"
//               >
//                 <Eye size={16} />
//               </button>
//             </div>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex justify-end overflow-hidden">
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           <div className="relative w-full max-w-5xl bg-white h-full shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 ease-in-out">

//             <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//                 >
//                   <X size={20} />
//                 </button>

//                 <div className="h-6 w-[1px] bg-slate-100" />

//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                     Candidate ID:
//                   </span>

//                   <span className="text-[10px] font-black uppercase text-slate-900">
//                     #TR-{selectedCandidate.id}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
//                   Archive
//                 </button>

//                 <button className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
//                   <Calendar size={14} /> Schedule Interview
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 flex overflow-hidden">

//               <div className="w-[380px] border-r border-slate-100 overflow-y-auto bg-slate-50/30 p-8 space-y-8">

//                 <div className="space-y-6">
//                   <div className="flex flex-col items-center text-center p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
//                     <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-slate-200 mb-4">
//                       {selectedCandidate.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </div>

//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//                       {selectedCandidate.name}
//                     </h3>

//                     <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-tighter">
//                       {selectedCandidate.position}
//                     </p>

//                     <div className="flex gap-2 mt-6 w-full">
//                       <button className="flex-1 p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
//                         <Mail size={18} className="mx-auto" />
//                       </button>

//                       <button className="flex-1 p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
//                         <MoreHorizontal size={18} className="mx-auto" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="p-4 bg-white border border-slate-100 rounded-2xl">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Experience
//                       </p>

//                       <p className="text-sm font-black text-slate-800">
//                         {selectedCandidate.exp} Yrs
//                       </p>
//                     </div>

//                     <div className="p-4 bg-white border border-slate-100 rounded-2xl">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Education
//                       </p>

//                       <p className="text-sm font-black text-slate-800">
//                         {selectedCandidate.education}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
//                     General Information
//                   </h4>

//                   <SidebarItem
//                     icon={<Mail size={14} />}
//                     label="Email Address"
//                     value={selectedCandidate.email}
//                   />

//                   <SidebarItem
//                     icon={<MapPin size={14} />}
//                     label="Location"
//                     value={selectedCandidate.location}
//                   />

//                   <SidebarItem
//                     icon={<Webhook size={14} />}
//                     label="Application Source"
//                     value={selectedCandidate.source}
//                   />
//                 </div>

//                 <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[10px] font-black text-emerald-700 uppercase">
//                       Current Stage
//                     </span>

//                     <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
//                   </div>

//                   <p className="text-lg font-black text-emerald-900 tracking-tight">
//                     Technical Review
//                   </p>
//                 </div>
//               </div>

//               <div className="flex-1 bg-white p-8 lg:p-12 flex flex-col">
//                 <div className="flex items-center justify-between mb-8">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
//                       <FileText size={24} />
//                     </div>

//                     <div>
//                       <h4 className="text-lg font-black text-slate-800 tracking-tight">
//                         Curriculum Vitae
//                       </h4>

//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         Verified Document • PDF
//                       </p>
//                     </div>
//                   </div>

//                   {selectedCandidate.cvUrl && (
//                     <div className="flex gap-3">
//                       <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
//                         <Download size={18} />
//                       </button>

//                       <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
//                         <ExternalLink size={18} />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden relative shadow-inner">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#view=FitH&toolbar=0`}
//                       className="w-full h-full border-none"
//                       title="Resume Preview"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm border border-slate-100">
//                         <AlertCircle size={32} />
//                       </div>

//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Document Not Found
//                       </h5>

//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[280px] leading-relaxed">
//                         This candidate was added manually without an attached
//                         resume.
//                       </p>

//                       <button className="mt-8 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
//                         Request Document
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
// {selectedCandidate && (
//   <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//     {/* High-End Backdrop */}
//     <div
//       className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//       onClick={() => setSelectedCandidate(null)}
//     />

//     {/* Main Modal Container */}
//     <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">

//       {/* 1. Integrated Header Section */}
//       <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//         <div className="flex items-center gap-6">
//           <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
//             {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
//           </div>
//           <div>
//             <div className="flex items-center gap-3">
//               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCandidate.name}</h3>
//               <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}>
//                 {selectedCandidate.source}
//               </span>
//             </div>
//             <div className="flex items-center gap-4 mt-1">
//               <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                 <Mail size={12} className="text-blue-500"/> {selectedCandidate.email}
//               </span>
//               <span className="w-1 h-1 bg-slate-200 rounded-full"/>
//               <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                 <Briefcase size={12} className="text-blue-500"/> {selectedCandidate.position}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//             <Download size={14} /> Download CV
//           </button>
//           {/* <button className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
//              Schedule Interview
//           </button> */}
//           <button onClick={() => setSelectedCandidate(null)} className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
//             <X size={24} />
//           </button>
//         </div>
//       </div>

//       {/* 2. Main Content Area */}
//       <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">

//         {/* Quick Info Bar */}
//         <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//           <QuickMetric label="Experience" value={`${selectedCandidate.exp} Years`} />
//           <QuickMetric label="Education" value={selectedCandidate.education} />
//           <QuickMetric label="Location" value={selectedCandidate.location} />
//           <QuickMetric label="Candidate ID" value={`#TR-${selectedCandidate.id}`} />
//         </div>

//         {/* The PDF Viewer Surface */}
//         <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//           <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//             {selectedCandidate.cvUrl ? (
//               <iframe
//                 src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                 className="w-full h-full border-none"
//                 title="Resume Viewer"
//               />
//             ) : (
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                 <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                   <FileText size={48} />
//                 </div>
//                 <h5 className="text-xl font-black text-slate-800 tracking-tight">Missing Curriculum Vitae</h5>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                   This record does not have a professional resume attached.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 3. Status Footer / Progress Bar */}
//       <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="flex -space-x-2">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
//             ))}
//           </div>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shared with 3 Hiring Managers</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-[10px] font-black text-slate-400 uppercase">Application Health</span>
//           <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//             <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//       {/* MANUAL ENTRY MODAL (EXISITING) */}

//       {/* {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">
//                   New Candidate
//                 </h3>

//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">
//                   Manual Record Entry
//                 </p>
//               </div>

//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Full Name"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(v) => setFormData({ ...formData, name: v })}
//                 />

//                 <InputField
//                   label="Email Address"
//                   placeholder="john@example.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(v) => setFormData({ ...formData, email: v })}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Position"
//                   placeholder="e.g. Fullstack Dev"
//                   value={formData.position}
//                   onChange={(v) => setFormData({ ...formData, position: v })}
//                 />

//                 <InputField
//                   label="Years of Experience"
//                   placeholder="e.g. 5"
//                   type="number"
//                   value={formData.exp}
//                   onChange={(v) => setFormData({ ...formData, exp: v })}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                   value={formData.education}
//                   onChange={(v) => setFormData({ ...formData, education: v })}
//                 />

//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   value={formData.address}
//                   onChange={(v) => setFormData({ ...formData, address: v })}
//                 />
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
//                 >
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}

//       {isModalOpen && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//       onClick={() => setIsModalOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//       {/* HEADER */}
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div>
//           <h3 className="text-xl font-black text-slate-800 tracking-tight">
//             New Candidate
//           </h3>
//           <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//             Manual Record Entry
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//         {/* ROW 1 */}
//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             label="Full Name"
//             placeholder="e.g. John Doe"
//             value={formData.name}
//             onChange={(v) => setFormData({ ...formData, name: v })}
//           />
//           <InputField
//             label="Email Address"
//             placeholder="john@example.com"
//             type="email"
//             value={formData.email}
//             onChange={(v) => setFormData({ ...formData, email: v })}
//           />
//         </div>

//         {/* ROW 2 */}
//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             label="Position"
//             placeholder="e.g. Fullstack Dev"
//             value={formData.position}
//             onChange={(v) => setFormData({ ...formData, position: v })}
//           />
//           <InputField
//             label="Years of Experience"
//             placeholder="e.g. 5"
//             type="number"
//             value={formData.exp}
//             onChange={(v) => setFormData({ ...formData, exp: v })}
//           />
//         </div>

//         {/* ROW 3 */}
//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             label="Education"
//             placeholder="e.g. B.Tech"
//             value={formData.education}
//             onChange={(v) => setFormData({ ...formData, education: v })}
//           />
//           <InputField
//             label="Location"
//             placeholder="Mumbai, MH"
//             value={formData.address}
//             onChange={(v) => setFormData({ ...formData, address: v })}
//           />
//         </div>

//         {/* --- ENTERPRISE UPLOAD SECTION --- */}
//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//             Resume / Curriculum Vitae
//           </label>
//           <div className="relative group">
//             {/* Hidden Input for Functionality */}
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//              onChange={(e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const previewUrl = URL.createObjectURL(file);

//   setFormData({
//     ...formData,
//     fileName: file.name,
//     cvFile: file,
//     cvUrl: previewUrl, // 🔥 important
//   });
// }}

//             />

//             {/* Visual UI Box */}
//             <div className={`
//               border-2 border-dashed rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col items-center justify-center
//               ${formData.fileName ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50'}
//             `}>
//               <div className={`
//                 p-3 rounded-xl mb-3 transition-colors
//                 ${formData.fileName ? 'bg-blue-500 text-white' : 'bg-white text-slate-400 shadow-sm group-hover:text-blue-500'}
//               `}>
//                 {formData.fileName ? <Check size={20} /> : <FileText size={20} />}
//               </div>

//               <div className="text-center">
//                 <p className="text-xs font-bold text-slate-700">
//                   {formData.fileName ? formData.fileName : "Click or drag to upload candidate CV"}
//                 </p>
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">
//                   Supported formats: PDF, DOCX (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="pt-4 flex gap-3">
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(false)}
//             className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
//           >
//             <Check size={16} /> Save Candidate
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
//       {icon}
//     </div>

//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SidebarItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
//     <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>

//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
//         {label}
//       </p>

//       <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
//       {label}
//     </span>

//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={14}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
//       />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//   const colors = {
//     emerald:
//       "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

//     indigo:
//       "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

//     blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
//   };

//   return (
//     <div
//       className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//             {title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
//             {desc}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//     </label>

//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
//     <p className="text-xs font-black text-slate-800">{value}</p>
//   </div>
// );

// const getSourceStyles = (source) => {
//   if (source === "Excel Import")
//     return "bg-emerald-50 text-emerald-600 border-emerald-100";

//   if (source === "Webhook")
//     return "bg-indigo-50 text-indigo-600 border-indigo-100";

//   return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//*********************************working code************************************************ */

// import React, { useState, useMemo } from 'react';
// import {
//   FileSpreadsheet, Webhook, UserPlus, Filter, Search, Mail,
//   MoreHorizontal, ExternalLink, Briefcase, MapPin, X, Check,
//   GraduationCap, ChevronDown, Calendar
// } from 'lucide-react';

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Jane Doe", email: "jane.doe@example.com", exp: 8, location: "Mumbai, MH", source: "Excel Import", position: "Fullstack Dev", education: "B.Tech", selected: false },
//     { id: 2, name: "Arjun Mehta", email: "arjun.m@tech.com", exp: 4, location: "Bangalore, KA", source: "Webhook", position: "UI Designer", education: "Masters", selected: false },
//     { id: 3, name: "Sarah Smith", email: "sarah.s@global.com", exp: 12, location: "Remote", source: "Manual Entry", position: "Product Manager", education: "MBA", selected: false },
//     { id: 4, name: "Rahul Verma", email: "rahul.v@dev.io", exp: 2, location: "Delhi, NCR", source: "Excel Import", position: "Fullstack Dev", education: "B.Tech", selected: false }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   // --- FILTER STATES ---
//   const [filters, setFilters] = useState({
//     position: 'All Positions',
//     experience: 'All Experience',
//     education: 'All Education'
//   });

//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', exp: '', position: 'Fullstack Dev', education: 'B.Tech' });

//   // --- FILTERING LOGIC ---
//   const filteredCandidates = useMemo(() => {
//     return candidates.filter(c => {
//       const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             c.email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition = filters.position === 'All Positions' || c.position === filters.position;

//       const matchesEducation = filters.education === 'All Education' || c.education === filters.education;

//       let matchesExperience = true;
//       if (filters.experience === 'Junior (0-3 yrs)') matchesExperience = c.exp <= 3;
//       if (filters.experience === 'Mid (4-7 yrs)') matchesExperience = c.exp >= 4 && c.exp <= 7;
//       if (filters.experience === 'Senior (8+ yrs)') matchesExperience = c.exp >= 8;

//       return matchesSearch && matchesPosition && matchesEducation && matchesExperience;
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---
//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     const newCandidate = {
//       id: Date.now(),
//       ...formData,
//       exp: parseInt(formData.exp),
//       source: "Manual Entry",
//       selected: false
//     };
//     setCandidates([newCandidate, ...candidates]);
//     setIsModalOpen(false);
//   };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every(c => c.selected);
//     setCandidates(candidates.map(c =>
//       filteredCandidates.find(f => f.id === c.id) ? { ...c, selected: !allSelected } : c
//     ));
//   };

//   const toggleSelect = (id) => {
//     setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">

//       {/* SOURCE CONTROL HEADER */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard icon={<FileSpreadsheet />} title="Excel Import" desc="Bulk upload .csv or .xlsx" color="emerald" />
//         <SourceCard icon={<Webhook />} title="API Webhook" desc="Connect LinkedIn/Indeed" color="indigo" />
//         <div onClick={() => setIsModalOpen(true)}>
//             <SourceCard icon={<UserPlus />} title="Manual Entry" desc="Single candidate record" color="blue" isAction />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}
//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />
//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Filters</span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={['All Positions', 'Fullstack Dev', 'UI Designer', 'Product Manager']}
//           value={filters.position}
//           onChange={(v) => setFilters({...filters, position: v})}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={['All Experience', 'Junior (0-3 yrs)', 'Mid (4-7 yrs)', 'Senior (8+ yrs)']}
//           value={filters.experience}
//           onChange={(v) => setFilters({...filters, experience: v})}
//         />

//         <FilterDropdown
//           label="Education"
//           options={['All Education', 'B.Tech', 'Masters', 'MBA']}
//           value={filters.education}
//           onChange={(v) => setFilters({...filters, education: v})}
//         />

//         <button
//           onClick={() => setFilters({ position: 'All Positions', experience: 'All Experience', education: 'All Education' })}
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}
//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">Candidate Pool</h2>
//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>
//             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some(c => c.selected) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={filteredCandidates.length > 0 && filteredCandidates.every(c => c.selected)}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Info</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Position & Exp</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Education</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Source</th>
//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr key={c.id} className={`group transition-colors ${c.selected ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'}`}>
//                   <td className="px-8 py-5 text-left">
//                     <input
//                         type="checkbox"
//                         checked={c.selected}
//                         onChange={() => toggleSelect(c.id)}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{c.name}</p>
//                         <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" /> {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp} Years Exp
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><GraduationCap size={12} /></div>
//                         {c.education}
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-[10px]">
//                     <span className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}>
//                         {c.source}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink size={16} /></button>
//                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredCandidates.length === 0 && (
//             <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
//               No candidates match your filters
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL IS UNCHANGED BUT REQUIRES POSITION/EDUCATION INPUTS */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">New Candidate</h3>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Manual Record Entry</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 <InputField label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Position" placeholder="e.g. Fullstack Dev" value={formData.position} onChange={(v) => setFormData({...formData, position: v})} />
//                 <InputField label="Years of Experience" placeholder="e.g. 5" type="number" value={formData.exp} onChange={(v) => setFormData({...formData, exp: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Education" placeholder="e.g. B.Tech" value={formData.education} onChange={(v) => setFormData({...formData, education: v})} />
//                 <InputField label="Location" placeholder="Mumbai, MH" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- REFINED SUB-COMPONENTS ---
// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">{label}</span>
//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//       </select>
//       <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//     const colors = {
//         emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
//         indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
//         blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
//     };
//     return (
//         <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1' : ''}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}>{icon}</div>
//                 <div>
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{desc}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const getSourceStyles = (source) => {
//     if (source === "Excel Import") return "bg-emerald-50 text-emerald-600 border-emerald-100";
//     if (source === "Webhook") return "bg-indigo-50 text-indigo-600 border-indigo-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//*********************************************************************************************** */
// import React, { useState, useMemo } from 'react';
// import {
//   FileSpreadsheet, Webhook, UserPlus, Filter, Search, Mail,
//   MoreHorizontal, ExternalLink, Briefcase, MapPin, X, Check
// } from 'lucide-react';

// const CandidateIntake = () => {
//   // --- STATE MANAGEMENT ---
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Jane Doe", email: "jane.doe@example.com", exp: "8.5", location: "Mumbai, MH", source: "Excel Import", selected: false },
//     { id: 2, name: "Arjun Mehta", email: "arjun.m@tech.com", exp: "4.2", location: "Bangalore, KA", source: "Webhook", selected: false }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', exp: '' });

//   // --- HANDLERS ---
//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     const newCandidate = {
//       id: Date.now(),
//       name: formData.name,
//       email: formData.email,
//       exp: formData.exp,
//       location: formData.address,
//       source: "Manual Entry",
//       selected: false
//     };
//     setCandidates([newCandidate, ...candidates]);
//     setIsModalOpen(false);
//     setFormData({ name: '', email: '', phone: '', address: '', exp: '' });
//   };

//   const toggleSelectAll = () => {
//     const allSelected = candidates.every(c => c.selected);
//     setCandidates(candidates.map(c => ({ ...c, selected: !allSelected })));
//   };

//   const toggleSelect = (id) => {
//     setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
//   };

//   // --- FILTERING LOGIC ---
//   const filteredCandidates = useMemo(() => {
//     return candidates.filter(c =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [candidates, searchQuery]);

//   const selectedCount = candidates.filter(c => c.selected).length;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">

//       {/* SOURCE CONTROL HEADER */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard icon={<FileSpreadsheet />} title="Excel Import" desc="Bulk upload .csv or .xlsx" color="emerald" />
//         <SourceCard icon={<Webhook />} title="API Webhook" desc="Connect LinkedIn/Indeed" color="indigo" />
//         <div onClick={() => setIsModalOpen(true)}>
//             <SourceCard icon={<UserPlus />} title="Manual Entry" desc="Single candidate record" color="blue" isAction />
//         </div>
//       </div>

//       {/* TABLE CONTAINER */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">

//         {/* Toolbar */}
//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight">Candidate Pool</h2>
//             <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Displayed
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search candidates..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>
//             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCount > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
//               <Mail size={14} /> Shoot Mail ({selectedCount})
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={candidates.length > 0 && candidates.every(c => c.selected)}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Info</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Experience</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Location</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Source</th>
//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr key={c.id} className={`group transition-colors ${c.selected ? 'bg-blue-50/30' : 'hover:bg-slate-50/80'}`}>
//                   <td className="px-8 py-5 text-left">
//                     <input
//                         type="checkbox"
//                         checked={c.selected}
//                         onChange={() => toggleSelect(c.id)}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200 uppercase">
//                         {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{c.name}</p>
//                         <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={12} /></div>
//                       {c.exp} Years
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-xs font-bold text-slate-700">
//                     <div className="flex items-center gap-2">
//                         <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><MapPin size={12} /></div>
//                         {c.location}
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-[10px]">
//                     <span className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}>
//                         {c.source}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink size={16} /></button>
//                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MANUAL ENTRY MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">New Candidate</h3>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Manual Record Entry</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 <InputField label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Contact Number" placeholder="+91 ..." value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
//                 <InputField label="Years of Experience" placeholder="e.g. 5" type="number" value={formData.exp} onChange={(v) => setFormData({...formData, exp: v})} />
//               </div>
//               <InputField label="Office Address / Location" placeholder="e.g. Mumbai, Maharashtra" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />

//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---
// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//     const colors = {
//         emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
//         indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
//         blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
//     };
//     return (
//         <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1' : ''}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}>{icon}</div>
//                 <div>
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{desc}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const getSourceStyles = (source) => {
//     if (source === "Excel Import") return "bg-emerald-50 text-emerald-600 border-emerald-100";
//     if (source === "Webhook") return "bg-indigo-50 text-indigo-600 border-indigo-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;

//**************************************************working code phase 1 27/01/25******************************************************** */

// import React, { useState, useMemo } from 'react';
// import {
//   FileSpreadsheet, Webhook, UserPlus, Filter, Search, Mail,
//   MoreHorizontal, ExternalLink, Briefcase, MapPin, X, Check
// } from 'lucide-react';

// const CandidateIntake = () => {
//   // --- STATE MANAGEMENT ---
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Jane Doe", email: "jane.doe@example.com", exp: "8.5", location: "Mumbai, MH", source: "Excel Import", selected: false },
//     { id: 2, name: "Arjun Mehta", email: "arjun.m@tech.com", exp: "4.2", location: "Bangalore, KA", source: "Webhook", selected: false }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', exp: '' });

//   // --- HANDLERS ---
//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     const newCandidate = {
//       id: Date.now(),
//       name: formData.name,
//       email: formData.email,
//       exp: formData.exp,
//       location: formData.address,
//       source: "Manual Entry",
//       selected: false
//     };
//     setCandidates([newCandidate, ...candidates]);
//     setIsModalOpen(false);
//     setFormData({ name: '', email: '', phone: '', address: '', exp: '' });
//   };

//   const toggleSelectAll = () => {
//     const allSelected = candidates.every(c => c.selected);
//     setCandidates(candidates.map(c => ({ ...c, selected: !allSelected })));
//   };

//   const toggleSelect = (id) => {
//     setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
//   };

//   // --- FILTERING LOGIC ---
//   const filteredCandidates = useMemo(() => {
//     return candidates.filter(c =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [candidates, searchQuery]);

//   const selectedCount = candidates.filter(c => c.selected).length;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">

//       {/* SOURCE CONTROL HEADER */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard icon={<FileSpreadsheet />} title="Excel Import" desc="Bulk upload .csv or .xlsx" color="emerald" />
//         <SourceCard icon={<Webhook />} title="API Webhook" desc="Connect LinkedIn/Indeed" color="indigo" />
//         <div onClick={() => setIsModalOpen(true)}>
//             <SourceCard icon={<UserPlus />} title="Manual Entry" desc="Single candidate record" color="blue" isAction />
//         </div>
//       </div>

//       {/* TABLE CONTAINER */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">

//         {/* Toolbar */}
//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight">Candidate Pool</h2>
//             <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Displayed
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search candidates..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>
//             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCount > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
//               <Mail size={14} /> Shoot Mail ({selectedCount})
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={candidates.length > 0 && candidates.every(c => c.selected)}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Info</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Experience</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Location</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Source</th>
//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr key={c.id} className={`group transition-colors ${c.selected ? 'bg-blue-50/30' : 'hover:bg-slate-50/80'}`}>
//                   <td className="px-8 py-5 text-left">
//                     <input
//                         type="checkbox"
//                         checked={c.selected}
//                         onChange={() => toggleSelect(c.id)}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200 uppercase">
//                         {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{c.name}</p>
//                         <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={12} /></div>
//                       {c.exp} Years
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-xs font-bold text-slate-700">
//                     <div className="flex items-center gap-2">
//                         <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><MapPin size={12} /></div>
//                         {c.location}
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-[10px]">
//                     <span className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}>
//                         {c.source}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink size={16} /></button>
//                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MANUAL ENTRY MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">New Candidate</h3>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Manual Record Entry</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 <InputField label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Contact Number" placeholder="+91 ..." value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
//                 <InputField label="Years of Experience" placeholder="e.g. 5" type="number" value={formData.exp} onChange={(v) => setFormData({...formData, exp: v})} />
//               </div>
//               <InputField label="Office Address / Location" placeholder="e.g. Mumbai, Maharashtra" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />

//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---
// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//     const colors = {
//         emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
//         indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
//         blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
//     };
//     return (
//         <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1' : ''}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}>{icon}</div>
//                 <div>
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{desc}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const getSourceStyles = (source) => {
//     if (source === "Excel Import") return "bg-emerald-50 text-emerald-600 border-emerald-100";
//     if (source === "Webhook") return "bg-indigo-50 text-indigo-600 border-indigo-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
