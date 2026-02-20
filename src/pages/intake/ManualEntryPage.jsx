import React, { useState, useEffect ,  useRef } from "react";
import {
  Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
  Loader2, Plus, Trash2, Layers, Cpu, ExternalLink, Database,
  Globe, ShieldCheck, History, X, LinkIcon, FileUp, ChevronRight, ChevronLeft,ChevronDown
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
  // 1. INITIALIZE ALL STATES FIRST
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [resumeMode, setResumeMode] = useState("file");
  const [expLetterMode, setExpLetterMode] = useState("file");
  const [skillInput, setSkillInput] = useState("");
  const [assetInput, setAssetInput] = useState("");
  const [isFresher, setIsFresher] = useState(null); // null = unselected, true = yes, false = no
  const [deptSearch, setDeptSearch] = useState("");
  const [eduSearch, setEduSearch] = useState(""); // Variable now initialized before use
  const [skillFocused, setSkillFocused] = useState(false);
const dropdownContainerRef = useRef(null);
  const [assetFocused, setAssetFocused] = useState(false);
  const [dynamicSkills, setDynamicSkills] = useState([]);
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [showAssetDrop, setShowAssetDrop] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", address1: "", address2: "", location: "",
    pincode: "", state: "", city: "", district: "", country: "India", position: "",
    education: "", gender: "", dob: "", experience: "", about_me: "",
    languages_spoken: [], skills: [], assets: [], department: "",
    cvFile: null, resume_link: "", expLetterFile: null,
    experience_letter_link: "", certificateFiles: [], certificateLinks: [""], experiences: [],
  });

  // 2. STATIC DATA & FILTER LOGIC (Now safe to use state variables)
  const totalSteps = 6;
  const SKILL_OPTIONS = ["React", "JavaScript", "Node.js", "MongoDB", "MySQL", "HTML", "CSS", "Tailwind", "Python", "Java", "AWS", "Docker"];
  const ASSET_OPTIONS = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Mobile", "ID Card", "SIM Card"];
  const POSITION_OPTIONS = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Executive", "UI/UX Designer", "DevOps Engineer", "Data Analyst"];
  const educationOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "Diploma", "PhD"];

  const filteredSkills = SKILL_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s));
  const filteredAssets = ASSET_OPTIONS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()) && !formData.assets.includes(a));
  const filteredDepartments = departments.filter(d => (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()));
  const filteredEducation = educationOptions.filter(e => e.toLowerCase().includes(eduSearch.toLowerCase()));

  const isStep1Valid = formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && /^[6-9]\d{9}$/.test(formData.phone);

  // 3. EFFECTS
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  useEffect(() => {
    const loadDepartments = async () => {
      try { const data = await departmentService.getAll(); setDepartments(data || []); }
      catch (err) { toast.error("Failed to load departments"); }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
  fetchSkills();
}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    // Check if the click is OUTSIDE the dropdown container ref
    if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
      setShowSkillDrop(false);
      setShowAssetDrop(false);
      setSkillFocused(false);
    }
  };

  // Use 'click' instead of 'mousedown' for better mobile support
  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

  // 4. HANDLERS
  const validateField = (field, value) => {
    let error = "";
    if (["name", "email", "phone"].includes(field) && !value) error = "Required field";
    if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
    if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;
    try {
      setIsFetchingPincode(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const offices = data[0].PostOffice;
        const cities = offices.map(o => o.Name);
        setCityOptions(cities);
        setFormData(prev => ({ ...prev, city: cities.length === 1 ? cities[0] : "", state: offices[0].State, district: offices[0].District, country: offices[0].Country }));
      }
    } catch { toast.error("Lookup failed"); }
    finally { setIsFetchingPincode(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateField("name", formData.name) || !validateField("email", formData.email) || !validateField("phone", formData.phone)) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      setLoading(true);
      const formDataApi = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "expLetterFile", "certificateLinks", "skills", "assets"].includes(key)) {
          formDataApi.append(key, formData[key]);
        }
      });
      formDataApi.append("full_name", formData.name);
      formDataApi.append("languages_spoken", JSON.stringify(formData.languages_spoken));
      formDataApi.append("experience_details", JSON.stringify(formData.experiences));
      formDataApi.append("skills", JSON.stringify(formData.skills));
      formDataApi.append("assets", JSON.stringify(formData.assets));
      if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
      if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);
      formData.certificateFiles.forEach(file => formDataApi.append("certificate_files[]", file));
      formData.certificateLinks.filter(l => String(l).startsWith("http")).forEach(link => formDataApi.append("certificate_links", link));
      
      await candidateService.createCandidate(formDataApi);
      toast.success("Profile committed successfully 🎉");
    } catch (err) { toast.error("Commit failed"); }
    finally { setLoading(false); }
  };


// Function to Create + Refresh
const handleManualAddSkill = async () => {
  const name = skillInput.trim();
  
  if (!name) {
    await fetchSkills(); // Just refresh if empty
    toast.success("Registry Refreshed");
    return;
  }

  // Create skill via API
  const success = await handleCreateMaster("skills", name);
  if (success) {
    // 1. Add to selected list immediately
    if (!formData.skills.includes(name)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, name] }));
    }
    // 2. Clear input
    setSkillInput(""); 
    // 3. Re-fetch all chips from server
    await fetchSkills(); 
  }
};


const handleCreateMaster = async (type, name) => {
  if (!name.trim()) return;
  
  const loadingToast = toast.loading(`Registering new ${type}...`);
  try {
    const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    if (response.ok) {
      toast.success(`${name} added to global ${type} registry`, { id: loadingToast });
      
      // IMPORTANT: After creating, re-fetch the list so the new skill shows up as a chip
      if (type === "skills") {
        await fetchSkills(); 
      }
      return true;
    } else {
      throw new Error("Failed to create");
    }
  } catch (error) {
    toast.error(`Could not register ${name}`, { id: loadingToast });
    return false;
  }
};

const fetchSkills = async () => {
  try {
    const response = await fetch("https://apihrr.goelectronix.co.in/masters/skills");
    const data = await response.json();
    // Assuming the API returns an array of objects like [{id: 1, name: "React"}, ...]
    // Adjust the map based on your actual API response structure
    setDynamicSkills(data.map(item => item.name));
  } catch (error) {
    toast.error("Failed to sync skill registry");
  }
};

const handleAddAssetAPI = async (assetName) => {
  if (!assetName.trim()) return;

  const loadingToast = toast.loading(`Assigning ${assetName}...`);
  try {
    const response = await fetch("https://apihrr.goelectronix.co.in/candidates/1/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: assetName.trim(),
       
      }),
    });

    if (response.ok) {
      toast.success(`${assetName} linked to candidate`, { id: loadingToast });
      return true;
    } else {
      throw new Error("Failed to link asset");
    }
  } catch (error) {
    toast.error(`Could not link ${assetName}`, { id: loadingToast });
    return false;
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}


        <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
  {/* Left: Branding */}
  <div className="flex items-center gap-6">
    <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
      <Database size={32} />
    </div>
    <div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
      <div className="flex items-center gap-2 mt-1 text-blue-600">
        <ShieldCheck size={14} />
        <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
      </div>
    </div>
  </div>

  {/* Right: Professional Roadmap */}
  <div className="flex-1 max-w-2xl w-full px-4">
    <div className="relative flex justify-between items-center w-full">
      {/* Background Connecting Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
      
      {/* Active Progress Line */}
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
      />

      {/* Roadmap Steps */}
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div key={num} className="relative z-10 flex flex-col items-center gap-2">
          {/* Step Circle */}
          <div 
            className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
              ${step === num 
                ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
                : step > num 
                ? "bg-emerald-500 text-white border-emerald-50" 
                : "bg-white text-slate-300 border-slate-50"}`}
          >
            {step > num ? <Check size={14} strokeWidth={4} /> : num}
          </div>
          
          {/* Step Label (Hidden on small mobile, visible on tablet+) */}
          <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300
            ${step === num ? "text-blue-600" : step > num ? "text-emerald-600" : "text-slate-300"}`}>
            {num === 1 && "Personal details"}
            {num === 2 && "Location"}
            {num === 3 && "Experience"}
            {num === 4 && "Carrer"}
            {num === 5 && "Asset & Skill"}
            {num === 6 && "Document"}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Progress Percentage Badge */}
  <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
    <div className="text-right">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</p>
      <p className="text-sm font-black text-slate-900 leading-none mt-1">{Math.round((step / totalSteps) * 100)}%</p>
    </div>
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
       {step === 6 ? <Check size={18} strokeWidth={3} /> : <Loader2 size={18} className="animate-spin" />}
    </div>
  </div>
</div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1">
          <div className="space-y-12">

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><User size={18} className="text-blue-600" /><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identification</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormField label="Full Name" required error={errors.name}><input placeholder="Legal Name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); validateField("name", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
                  <FormField label="Email Address" required error={errors.email}><input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateField("email", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
                  <FormField label="Phone Number" required error={errors.phone}><div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm"><span className="px-5 text-[11px] font-black text-slate-400 border-r border-slate-100">+91</span><input maxLength={10} value={formData.phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, phone: v }); validateField("phone", v); }} className="w-full px-5 py-4 bg-transparent text-sm font-bold outline-none" /></div></FormField>
                  <FormField label="Gender Selection"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></FormField>
                  <FormField label="Date of Birth"><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" /></FormField>
                  <FormField label="Languages"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-h-40 overflow-y-auto grid grid-cols-2 gap-4 shadow-inner">{["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"].map(lang => (<label key={lang} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 cursor-pointer hover:text-blue-600"><input type="checkbox" checked={formData.languages_spoken.includes(lang)} onChange={() => { const u = formData.languages_spoken.includes(lang) ? formData.languages_spoken.filter(l => l !== lang) : [...formData.languages_spoken, lang]; setFormData({ ...formData, languages_spoken: u }); }} className="w-4 h-4 accent-blue-600" /> {lang}</label>))}</div></FormField>
                </div>
                <FormField label="Profile Bio"><textarea rows={4} placeholder="Brief summary..." value={formData.about_me} onChange={(e) => setFormData({ ...formData, about_me: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none resize-none shadow-sm" /></FormField>
                <div className="flex justify-end pt-4"><button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)} className={`flex items-center gap-3 px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isStep1Valid ? "bg-blue-600 text-white shadow-blue-600/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Next Phase <ChevronRight size={16}/></button></div>
              </div>
            )}

            {/* STEP 2: GEOGRAPHY */}
            {step === 2 && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><MapPin size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Geolocation Registry</h3></div>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField label="Address line 1" required><input placeholder="Building/Flat/Street" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
                    <FormField label="Address line 2" required><input placeholder="Landmark/Locality" value={formData.address2} onChange={(e) => setFormData({...formData, address2: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField label="Location/Area Hub" required><input placeholder="City Hub/Area" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" /></FormField>
                    <FormField label="Pincode Mapping" required><div className="relative"><input maxLength={6} placeholder="000000" value={formData.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, pincode: v }); if (v.length === 6) fetchPincodeDetails(v); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500" />{isFetchingPincode && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />}</div></FormField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* <FormField label="City">{cityOptions.length > 1 ? (<select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold appearance-none">{cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}</select>) : <input value={formData.city} readOnly placeholder="System Identified" className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" />}</FormField> */}
                    {/* CITY SELECTION */}
  <FormField label="City">
    <div className="relative group">
      {cityOptions.length > 1 ? (
        <>
          <select 
            value={formData.city} 
            onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select City</option>
            {cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </>
      ) : (
        <input 
          value={formData.city} 
          readOnly 
          placeholder="Auto-filled" 
          className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner cursor-not-allowed" 
        />
      )}
    </div>
  </FormField>
                    <FormField label="District"><input value={formData.district} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
                    <FormField label="State"><input value={formData.state} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
                    {/* ADDED COUNTRY FIELD */}
      <FormField label="Country">
        <input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="India" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
      </FormField>
                  </div>
                </div>
                <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(1)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all"><ChevronLeft size={16} className="inline mr-2"/> Back</button><button onClick={() => setStep(3)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl active:scale-95 transition-all">Continue →</button></div>
              </div>
            )}

            {/* STEP 3: EMPLOYMENT */}
           


{/* STEP 3: EMPLOYMENT HISTORY - ENTERPRISE ALIGNED DESIGN */}

{step === 3 && (
  <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
    
    {/* FRESHER SELECTION CARD */}
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Are you a Fresher?</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Select your current career status</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => {
                setIsFresher(true);
                setFormData({ ...formData, experiences: [] }); 
            }}
            className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            Yes, I am
          </button>
          <button 
            type="button"
            onClick={() => setIsFresher(false)}
            className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            No, Experienced
          </button>
        </div>
      </div>
    </div>

    {/* EXPERIENCED UI */}
    {isFresher === false && (
      <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "", expLetterFile: null, exp_letter_link: "", uploadMode: "file" }] })} 
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
          >
            <Plus size={14} strokeWidth={3} /> Add Organization
          </button>
        </div>

      

        <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
  {formData.experiences.map((exp, i) => (
    <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95 shadow-inner">
      
      {/* DELETE BUTTON */}
      <button 
        type="button" 
        onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
        className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
      >
        <Trash2 size={18} />
      </button>

      {/* TOP ROW: EMPLOYER & DESIGNATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <FormField label="Employer / Organization">
          <input placeholder="e.g. Google India" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
        </FormField>
        <FormField label="Professional Designation">
          <input placeholder="e.g. Senior Product Designer" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
        </FormField>
      </div>

      {/* MIDDLE ROW: DATES, CTC, CITY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
         <FormField label="Start Date">
           <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
         </FormField>
         <FormField label="End Date">
           <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
         </FormField>
         <FormField label="Annual CTC">
           <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
             <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
           </div>
         </FormField>
         <FormField label="Office City">
           <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
         </FormField>
      </div>

      {/* REFINED BOTTOM ROW: REMARKS & ARTIFACT SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: REMARKS / RESPONSIBILITIES */}
        <FormField label="Core Responsibilities & Achievements">
          <textarea 
            placeholder="Briefly describe your impact and scope..." 
            rows={5} 
            value={exp.description} 
            onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none h-full min-h-[140px]" 
          />
        </FormField>

        {/* RIGHT COLUMN: EXPERIENCE LETTER UPLOAD */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Letter</p>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "file"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === 'file' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>FILE</button>
              <button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "link"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === 'link' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>URL</button>
            </div>
          </div>

          <div className="bg-white/50 border border-slate-100 rounded-3xl p-4 min-h-[140px] flex flex-col justify-center">
            {exp.uploadMode === 'file' ? (
              <label className="flex flex-col items-center justify-center gap-3 w-full h-full border-2 border-dashed border-slate-200 rounded-2xl hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer group p-4">
                <FileUp size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center line-clamp-1 px-2">
                  {exp.expLetterFile ? exp.expLetterFile.name : "Drop Validation PDF"}
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const u = [...formData.experiences]; u[i].expLetterFile = e.target.files[0]; setFormData({ ...formData, experiences: u }); }} />
              </label>
            ) : (
              <div className="relative">
                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="G-Drive / Dropbox Link" value={exp.exp_letter_link} onChange={(e) => { const u = [...formData.experiences]; u[i].exp_letter_link = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-11 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FINAL SAVE ACTION */}
      <div className="flex justify-end pt-2 border-t border-slate-50">
        <button 
          type="button" 
          onClick={() => toast.success(`${exp.company_name || 'Experience'} record updated`)}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Check size={16} strokeWidth={3} /> Save Record
        </button>
      </div>
    </div>
  ))}
</div>
      </div>
    )}

    {isFresher === true && (
       <div className="text-center py-20 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[3rem] animate-in fade-in duration-700">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-400 shadow-sm mb-4 border border-blue-100">
            <Award size={32} />
          </div>
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Entering as a Professional Fresher</p>
          <p className="text-[10px] font-bold text-slate-400 normal-case mt-1">We will skip the employment history for your profile. Click next to proceed.</p>
       </div>
    )}

    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
      <button onClick={() => setStep(2)} type="button" className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">
        <ChevronLeft size={16} className="inline mr-2" /> Back
      </button>
      <button onClick={() => setStep(4)} type="button" disabled={isFresher === null} className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
        Next Phase →
      </button>
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
      .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
      .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
    `}} />
  </div>
)}



            {/* STEP 4: QUANTS */}
            

 

{/* Wrap your steps in this div with the ref */}
<div ref={dropdownContainerRef}>
  
  {/* STEP 4: CAREER (Position, Education, Department) */}
  {step === 4 && (
    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8 overflow-visible">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <Award size={20} className="text-blue-600" />
        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Career</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
        {/* 1. POSITION DROPDOWN */}
        <FormField label="Position">
          <div className="relative overflow-visible">
            <div className="relative group">
              <input
                placeholder="Select professional role..."
                value={formData.position}
                onFocus={(e) => {
                  e.stopPropagation(); // Prevents immediate close
                  setShowSkillDrop(true);
                  setShowAssetDrop(false);
                  setSkillFocused(false);
                }} 
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none appearance-none"
              />
              <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showSkillDrop ? 'rotate-180' : ''}`} />
            </div>

            {showSkillDrop && (
              <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).length > 0 ? (
                    POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).map((pos, i) => (
                      <div
                        key={i}
                        onMouseDown={(e) => {
                          e.preventDefault(); 
                          setFormData({ ...formData, position: pos });
                          setShowSkillDrop(false);
                        }}
                        className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
                      >
                        {pos}
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">No matching roles found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </FormField>

        <FormField label="Total Experience (Years)">
          <input
            type="number"
            placeholder="Total Experience"
            value={formData.experience}
            onFocus={() => {
              setShowSkillDrop(false);
              setShowAssetDrop(false);
              setSkillFocused(false);
            }}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 shadow-sm transition-all"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
        {/* 2. EDUCATION DROPDOWN */}
        <FormField label="Education">
          <div className="relative overflow-visible">
            <div className="relative group">
              <input
                placeholder="Select degree..."
                value={eduSearch || formData.education}
                onFocus={(e) => {
                  e.stopPropagation();
                  setShowAssetDrop(true);
                  setShowSkillDrop(false);
                  setSkillFocused(false);
                }} 
                onChange={(e) => {
                  setEduSearch(e.target.value);
                  setFormData({ ...formData, education: e.target.value });
                }}
                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
              />
              <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showAssetDrop ? 'rotate-180' : ''}`} />
            </div>

            {showAssetDrop && (
              <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {filteredEducation.map((e, i) => (
                    <div
                      key={i}
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        setFormData({ ...formData, education: e });
                        setEduSearch("");
                        setShowAssetDrop(false);
                      }}
                      className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-slate-50 last:border-none"
                    >
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FormField>

        {/* 3. DEPARTMENT DROPDOWN */}
       
      </div>

      <div className="flex justify-between pt-8 border-t border-slate-50">
        <button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">← Back</button>
        <button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl active:scale-95">Next Phase →</button>
      </div>
    </div>
  )}

</div>

           
            {/* STEP 5: STACK & ASSETS INVENTORY (ENTERPRISE CHIP CLOUD DESIGN) */}
{step === 5 && (
  <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
    <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl shadow-slate-200/50 overflow-visible">
      {/* Section Header */}
      <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inventory & Expertise</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Select applicable technical skills and physical assets</p>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-12 overflow-visible">
        {/* TECHNICAL SKILLS CLOUD */}
        <div className="space-y-6">
          

        <FormField label="Technical Expertise Matrix">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="relative max-w-md w-full">
                <Plus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                      e.preventDefault();
                      handleManualAddSkill();
                    }
                  }}
                  placeholder="Type new skill..." 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 shadow-inner transition-all"
                />
              </div>
              
              <button 
                type="button" 
                onClick={handleManualAddSkill}
                className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg"
              >
                <Database size={14} /> {skillInput.trim() ? "Register & Add" : "Sync Registry"}
              </button>
            </div>

            <div className="flex flex-wrap gap-3 p-1">
              {dynamicSkills.map((skill) => {
                const isSelected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const updated = isSelected 
                        ? formData.skills.filter(s => s !== skill)
                        : [...formData.skills, skill];
                      setFormData({...formData, skills: updated});
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
                      ${isSelected 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30"}`}
                  >
                    {skill}
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })}
              {dynamicSkills.length === 0 && <p className="text-[10px] font-bold text-slate-300 italic uppercase">Initializing Registry...</p>}
            </div>
          </div>
        </FormField>
        </div>

        {/* ASSET ALLOCATION CLOUD */}
        <div className="space-y-6 pt-8 border-t border-slate-100">
          

          <FormField label="Enterprise Hardware Matrix">
  <div className="space-y-6">
    {/* Search & Manual Add Input */}
    <div className="relative max-w-md">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Layers size={16} />
      </div>
      <input 
        value={assetInput} 
        onChange={(e) => setAssetInput(e.target.value)}
        onKeyDown={async (e) => {
          if(e.key === 'Enter') {
            e.preventDefault();
            const v = assetInput.trim();
            if(v && !formData.assets.includes(v)) {
              // API INTEGRATION
              const success = await handleAddAssetAPI(v);
              if(success) {
                setFormData({...formData, assets: [...formData.assets, v]});
                setAssetInput("");
              }
            }
          }
        }}
        placeholder="Type hardware name and press Enter..." 
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
      />
    </div>

    {/* Asset Cloud */}
    <div className="flex flex-wrap gap-3 p-1">
      {ASSET_OPTIONS.map((asset) => {
        const isSelected = formData.assets.includes(asset);
        return (
          <button
            key={asset}
            type="button"
            onClick={async () => {
              if (!isSelected) {
                // API INTEGRATION on selection
                const success = await handleAddAssetAPI(asset);
                if(success) {
                  setFormData({...formData, assets: [...formData.assets, asset]});
                }
              } else {
                // Optional: Add delete API call here if needed
                setFormData({...formData, assets: formData.assets.filter(a => a !== asset)});
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
              ${isSelected 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}
          >
            {asset}
            {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
          </button>
        );
      })}
      
      {/* Custom dynamic assets already in state */}
      {formData.assets.filter(a => !ASSET_OPTIONS.includes(a)).map((customAsset) => (
         <button
          key={customAsset}
          type="button"
          onClick={() => setFormData({...formData, assets: formData.assets.filter(a => a !== customAsset)})}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-900 border-2 border-slate-900 text-white shadow-lg active:scale-90"
        >
          {customAsset} <Check size={14} strokeWidth={3} />
        </button>
      ))}
    </div>
  </div>
</FormField>
        </div>
      </div>
    </div>

    {/* NAVIGATION ACTIONS */}
    <div className="flex justify-between items-center pt-4">
      <button 
        onClick={() => setStep(4)} 
        type="button" 
        className="flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
      >
        <ChevronLeft size={16}/> Previous Phase
      </button>
      <button 
        onClick={() => setStep(6)} 
        type="button" 
        className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
      >
        Vault Registry <ChevronRight size={16}/>
      </button>
    </div>
  </div>
)}

            
            {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
{/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
{step === 6 && (
  <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
    {/* Unified White Enterprise Card */}
    <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-xl shadow-slate-200/60 border border-slate-200 space-y-12 overflow-hidden relative">
      
      {/* Subtle Background Branding Accent */}
      <div className="absolute top-0 right-0 p-12 text-slate-100 opacity-40 pointer-events-none rotate-12 scale-150">
        <ShieldCheck size={240} />
      </div>

      {/* Vault Header */}
      <div className="flex items-center gap-5 pb-8 border-b border-slate-100 relative z-10">
        <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <ShieldCheck size={28} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Registry Artifacts</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Document Verification Matrix</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        {/* 1. MASTER RESUME */}
        <div className="space-y-8 p-1">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 1. Master Resume
            </p>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
              <button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
            </div>
          </div>
          {resumeMode === 'file' ? (
            <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-blue-500 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
              <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-5 group-hover:scale-110 transition-all duration-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select Resume PDF"}</p>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} />
            </label>
          ) : (
            <input placeholder="Enter Public Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5" />
          )}
        </div>

        {/* 2. EXPERIENCE LETTER */}
        <div className="space-y-8 p-1">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> 2. Exp. Letter
            </p>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button type="button" onClick={() => setExpLetterMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
              <button type="button" onClick={() => setExpLetterMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
            </div>
          </div>
          {expLetterMode === 'file' ? (
            <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
              <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-slate-900 mb-5 group-hover:scale-110 transition-all duration-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.expLetterFile ? formData.expLetterFile.name : "Select Exp. PDF"}</p>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} />
            </label>
          ) : (
            <input placeholder="Enter Public Exp. Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-slate-900 transition-all shadow-sm focus:ring-4 focus:ring-slate-900/5" />
          )}
        </div>
      </div>

      {/* 3. CERTIFICATIONS */}
      <div className="pt-8 border-t border-slate-100 space-y-8 relative z-10">
         <div className="flex justify-between items-center mb-2">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 3. Credentials Matrix
            </p>
            <div className="flex gap-4">
              <label className="cursor-pointer h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 transition-all flex items-center justify-center shadow-sm">
                <FileUp size={20}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})}/>
              </label>
              <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 flex items-center justify-center shadow-sm">
                <LinkIcon size={20}/>
              </button>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
           {formData.certificateFiles.map((file, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-xs text-slate-900 font-bold animate-in zoom-in-95 hover:border-emerald-200 transition-colors shadow-sm">
                <div className="flex items-center gap-4 truncate max-w-[85%]">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> 
                  {file.name}
                </div>
                <X size={20} className="text-slate-300 hover:text-red-500 cursor-pointer transition-all hover:rotate-90" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})}/>
              </div>
           ))}
           {formData.certificateLinks.map((link, idx) => (
              <div key={idx} className="flex gap-4 animate-in slide-in-from-right-4">
                <div className="relative flex-1">
                  <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input value={link} placeholder="Credential Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-sm" />
                </div>
                <button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-red-500 bg-white h-16 w-16 rounded-[2rem] border border-slate-200 transition-all flex items-center justify-center shadow-sm">
                  <Trash2 size={24}/>
                </button>
              </div>
           ))}
         </div>
      </div>

      {/* FINAL SUBMIT BUTTONS */}
      <div className="pt-16 border-t border-slate-100 flex flex-col items-center gap-8 relative z-10">
        <button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[3rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] text-sm tracking-widest uppercase disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} strokeWidth={2.5}/><span>Submit all Profile</span></>}
        </button>
        <button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
          <ChevronLeft size={16}/> Return to Previous Module
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualEntryPage;
//*************************************************phase code 2336 17/02/26********************************************************** */
// import React, { useState, useEffect ,  useRef } from "react";
// import {
//   Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
//   Loader2, Plus, Trash2, Layers, Cpu, ExternalLink, Database,
//   Globe, ShieldCheck, History, X, LinkIcon, FileUp, ChevronRight, ChevronLeft,ChevronDown
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between items-center">
//       <span>{label}</span>
//       <span className={`font-bold normal-case ${required ? "text-red-500" : "text-slate-300"}`}>
//         {required ? "Required" : "Optional"}
//       </span>
//     </label>
//     {children}
//     {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
//   </div>
// );

// const ManualEntryPage = () => {
//   // 1. INITIALIZE ALL STATES FIRST
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [isFresher, setIsFresher] = useState(null); // null = unselected, true = yes, false = no
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState(""); // Variable now initialized before use
//   const [skillFocused, setSkillFocused] = useState(false);
// const dropdownContainerRef = useRef(null);
//   const [assetFocused, setAssetFocused] = useState(false);
//   const [dynamicSkills, setDynamicSkills] = useState([]);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", address: "", address1: "", address2: "", location: "",
//     pincode: "", state: "", city: "", district: "", country: "India", position: "",
//     education: "", gender: "", dob: "", experience: "", about_me: "",
//     languages_spoken: [], skills: [], assets: [], department: "",
//     cvFile: null, resume_link: "", expLetterFile: null,
//     experience_letter_link: "", certificateFiles: [], certificateLinks: [""], experiences: [],
//   });

//   // 2. STATIC DATA & FILTER LOGIC (Now safe to use state variables)
//   const totalSteps = 6;
//   const SKILL_OPTIONS = ["React", "JavaScript", "Node.js", "MongoDB", "MySQL", "HTML", "CSS", "Tailwind", "Python", "Java", "AWS", "Docker"];
//   const ASSET_OPTIONS = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Mobile", "ID Card", "SIM Card"];
//   const POSITION_OPTIONS = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Executive", "UI/UX Designer", "DevOps Engineer", "Data Analyst"];
//   const educationOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "Diploma", "PhD"];

//   const filteredSkills = SKILL_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s));
//   const filteredAssets = ASSET_OPTIONS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()) && !formData.assets.includes(a));
//   const filteredDepartments = departments.filter(d => (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()));
//   const filteredEducation = educationOptions.filter(e => e.toLowerCase().includes(eduSearch.toLowerCase()));

//   const isStep1Valid = formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && /^[6-9]\d{9}$/.test(formData.phone);

//   // 3. EFFECTS
//   useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

//   useEffect(() => {
//     const loadDepartments = async () => {
//       try { const data = await departmentService.getAll(); setDepartments(data || []); }
//       catch (err) { toast.error("Failed to load departments"); }
//     };
//     loadDepartments();
//   }, []);

//   useEffect(() => {
//   fetchSkills();
// }, []);

// useEffect(() => {
//   const handleClickOutside = (event) => {
//     // Check if the click is OUTSIDE the dropdown container ref
//     if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
//       setShowSkillDrop(false);
//       setShowAssetDrop(false);
//       setSkillFocused(false);
//     }
//   };

//   // Use 'click' instead of 'mousedown' for better mobile support
//   document.addEventListener("click", handleClickOutside);
//   return () => {
//     document.removeEventListener("click", handleClickOutside);
//   };
// }, []);

//   // 4. HANDLERS
//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value) error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";
//     setErrors(prev => ({ ...prev, [field]: error }));
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         const cities = offices.map(o => o.Name);
//         setCityOptions(cities);
//         setFormData(prev => ({ ...prev, city: cities.length === 1 ? cities[0] : "", state: offices[0].State, district: offices[0].District, country: offices[0].Country }));
//       }
//     } catch { toast.error("Lookup failed"); }
//     finally { setIsFetchingPincode(false); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateField("name", formData.name) || !validateField("email", formData.email) || !validateField("phone", formData.phone)) {
//       toast.error("Please fill required fields");
//       return;
//     }
//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "expLetterFile", "certificateLinks", "skills", "assets"].includes(key)) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       formDataApi.append("full_name", formData.name);
//       formDataApi.append("languages_spoken", JSON.stringify(formData.languages_spoken));
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));
//       formDataApi.append("skills", JSON.stringify(formData.skills));
//       formDataApi.append("assets", JSON.stringify(formData.assets));
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);
//       formData.certificateFiles.forEach(file => formDataApi.append("certificate_files[]", file));
//       formData.certificateLinks.filter(l => String(l).startsWith("http")).forEach(link => formDataApi.append("certificate_links", link));
      
//       await candidateService.createCandidate(formDataApi);
//       toast.success("Profile committed successfully 🎉");
//     } catch (err) { toast.error("Commit failed"); }
//     finally { setLoading(false); }
//   };


// // Function to Create + Refresh
// const handleManualAddSkill = async () => {
//   const name = skillInput.trim();
  
//   if (!name) {
//     await fetchSkills(); // Just refresh if empty
//     toast.success("Registry Refreshed");
//     return;
//   }

//   // Create skill via API
//   const success = await handleCreateMaster("skills", name);
//   if (success) {
//     // 1. Add to selected list immediately
//     if (!formData.skills.includes(name)) {
//       setFormData(prev => ({ ...prev, skills: [...prev.skills, name] }));
//     }
//     // 2. Clear input
//     setSkillInput(""); 
//     // 3. Re-fetch all chips from server
//     await fetchSkills(); 
//   }
// };


// const handleCreateMaster = async (type, name) => {
//   if (!name.trim()) return;
  
//   const loadingToast = toast.loading(`Registering new ${type}...`);
//   try {
//     const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${type}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: name.trim() }),
//     });

//     if (response.ok) {
//       toast.success(`${name} added to global ${type} registry`, { id: loadingToast });
      
//       // IMPORTANT: After creating, re-fetch the list so the new skill shows up as a chip
//       if (type === "skills") {
//         await fetchSkills(); 
//       }
//       return true;
//     } else {
//       throw new Error("Failed to create");
//     }
//   } catch (error) {
//     toast.error(`Could not register ${name}`, { id: loadingToast });
//     return false;
//   }
// };

// const fetchSkills = async () => {
//   try {
//     const response = await fetch("https://apihrr.goelectronix.co.in/masters/skills");
//     const data = await response.json();
//     // Assuming the API returns an array of objects like [{id: 1, name: "React"}, ...]
//     // Adjust the map based on your actual API response structure
//     setDynamicSkills(data.map(item => item.name));
//   } catch (error) {
//     toast.error("Failed to sync skill registry");
//   }
// };

// const handleAddAssetAPI = async (assetName) => {
//   if (!assetName.trim()) return;

//   const loadingToast = toast.loading(`Assigning ${assetName}...`);
//   try {
//     const response = await fetch("https://apihrr.goelectronix.co.in/candidates/1/assets", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: assetName.trim(),
       
//       }),
//     });

//     if (response.ok) {
//       toast.success(`${assetName} linked to candidate`, { id: loadingToast });
//       return true;
//     } else {
//       throw new Error("Failed to link asset");
//     }
//   } catch (error) {
//     toast.error(`Could not link ${assetName}`, { id: loadingToast });
//     return false;
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* HEADER */}


//         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//   {/* Left: Branding */}
//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//       <div className="flex items-center gap-2 mt-1 text-blue-600">
//         <ShieldCheck size={14} />
//         <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//       </div>
//     </div>
//   </div>

//   {/* Right: Professional Roadmap */}
//   <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">
//       {/* Background Connecting Line */}
//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
      
//       {/* Active Progress Line */}
//       <div 
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {/* Roadmap Steps */}
//       {[1, 2, 3, 4, 5, 6].map((num) => (
//         <div key={num} className="relative z-10 flex flex-col items-center gap-2">
//           {/* Step Circle */}
//           <div 
//             className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               ${step === num 
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num 
//                 ? "bg-emerald-500 text-white border-emerald-50" 
//                 : "bg-white text-slate-300 border-slate-50"}`}
//           >
//             {step > num ? <Check size={14} strokeWidth={4} /> : num}
//           </div>
          
//           {/* Step Label (Hidden on small mobile, visible on tablet+) */}
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300
//             ${step === num ? "text-blue-600" : step > num ? "text-emerald-600" : "text-slate-300"}`}>
//             {num === 1 && "Personal details"}
//             {num === 2 && "Location"}
//             {num === 3 && "Experience"}
//             {num === 4 && "Carrer"}
//             {num === 5 && "Asset & Skill"}
//             {num === 6 && "Document"}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Progress Percentage Badge */}
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</p>
//       <p className="text-sm font-black text-slate-900 leading-none mt-1">{Math.round((step / totalSteps) * 100)}%</p>
//     </div>
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
//        {step === 6 ? <Check size={18} strokeWidth={3} /> : <Loader2 size={18} className="animate-spin" />}
//     </div>
//   </div>
// </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1">
//           <div className="space-y-12">

//             {/* STEP 1: IDENTITY */}
//             {step === 1 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><User size={18} className="text-blue-600" /><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identification</h3></div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <FormField label="Full Name" required error={errors.name}><input placeholder="Legal Name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); validateField("name", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
//                   <FormField label="Email Address" required error={errors.email}><input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateField("email", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
//                   <FormField label="Phone Number" required error={errors.phone}><div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm"><span className="px-5 text-[11px] font-black text-slate-400 border-r border-slate-100">+91</span><input maxLength={10} value={formData.phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, phone: v }); validateField("phone", v); }} className="w-full px-5 py-4 bg-transparent text-sm font-bold outline-none" /></div></FormField>
//                   <FormField label="Gender Selection"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></FormField>
//                   <FormField label="Date of Birth"><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" /></FormField>
//                   <FormField label="Languages"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-h-40 overflow-y-auto grid grid-cols-2 gap-4 shadow-inner">{["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"].map(lang => (<label key={lang} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 cursor-pointer hover:text-blue-600"><input type="checkbox" checked={formData.languages_spoken.includes(lang)} onChange={() => { const u = formData.languages_spoken.includes(lang) ? formData.languages_spoken.filter(l => l !== lang) : [...formData.languages_spoken, lang]; setFormData({ ...formData, languages_spoken: u }); }} className="w-4 h-4 accent-blue-600" /> {lang}</label>))}</div></FormField>
//                 </div>
//                 <FormField label="Profile Bio"><textarea rows={4} placeholder="Brief summary..." value={formData.about_me} onChange={(e) => setFormData({ ...formData, about_me: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none resize-none shadow-sm" /></FormField>
//                 <div className="flex justify-end pt-4"><button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)} className={`flex items-center gap-3 px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isStep1Valid ? "bg-blue-600 text-white shadow-blue-600/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Next Phase <ChevronRight size={16}/></button></div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><MapPin size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Geolocation Registry</h3></div>
//                 <div className="space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Address line 1" required><input placeholder="Building/Flat/Street" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
//                     <FormField label="Address line 2" required><input placeholder="Landmark/Locality" value={formData.address2} onChange={(e) => setFormData({...formData, address2: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Location/Area Hub" required><input placeholder="City Hub/Area" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" /></FormField>
//                     <FormField label="Pincode Mapping" required><div className="relative"><input maxLength={6} placeholder="000000" value={formData.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, pincode: v }); if (v.length === 6) fetchPincodeDetails(v); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500" />{isFetchingPincode && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />}</div></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     {/* <FormField label="City">{cityOptions.length > 1 ? (<select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold appearance-none">{cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}</select>) : <input value={formData.city} readOnly placeholder="System Identified" className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" />}</FormField> */}
//                     {/* CITY SELECTION */}
//   <FormField label="City">
//     <div className="relative group">
//       {cityOptions.length > 1 ? (
//         <>
//           <select 
//             value={formData.city} 
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
//             className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
//           >
//             <option value="">Select City</option>
//             {cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}
//           </select>
//           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//             <ChevronDown size={16} />
//           </div>
//         </>
//       ) : (
//         <input 
//           value={formData.city} 
//           readOnly 
//           placeholder="Auto-filled" 
//           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner cursor-not-allowed" 
//         />
//       )}
//     </div>
//   </FormField>
//                     <FormField label="District"><input value={formData.district} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
//                     <FormField label="State"><input value={formData.state} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
//                     {/* ADDED COUNTRY FIELD */}
//       <FormField label="Country">
//         <input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="India" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
//       </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(1)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all"><ChevronLeft size={16} className="inline mr-2"/> Back</button><button onClick={() => setStep(3)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl active:scale-95 transition-all">Continue →</button></div>
//               </div>
//             )}

//             {/* STEP 3: EMPLOYMENT */}
           


// {/* STEP 3: EMPLOYMENT HISTORY - ENTERPRISE ALIGNED DESIGN */}
// {/* {step === 3 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
    

//     <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all overflow-hidden">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//             <Briefcase size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Are you a Fresher?</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Select your current career status</p>
//           </div>
//         </div>

//         <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//           <button 
//             type="button"
//             onClick={() => {
//                 setIsFresher(true);
//                 setFormData({ ...formData, experiences: [] }); // Clear experiences if fresher
//             }}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             Yes, I am
//           </button>
//           <button 
//             type="button"
//             onClick={() => setIsFresher(false)}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             No, Experienced
//           </button>
//         </div>
//       </div>
//     </div>


//     {isFresher === false && (
//       <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
        
       
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//               <History size={20} />
//             </div>
//             <div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
//             </div>
//           </div>
          
//           <button 
//             type="button" 
//             onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} 
//             className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
//           >
//             <Plus size={14} strokeWidth={3} /> Add Organization
//           </button>
//         </div>


//         <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//           {formData.experiences.map((exp, i) => (
//             <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95">
              
//               <button 
//                 type="button" 
//                 onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//                 className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//               >
//                 <Trash2 size={18} />
//               </button>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                 <FormField label="Employer / Organization">
//                   <input 
//                     placeholder="e.g. Google India" 
//                     value={exp.company_name} 
//                     onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                   />
//                 </FormField>
//                 <FormField label="Professional Designation">
//                   <input 
//                     placeholder="e.g. Senior Product Designer" 
//                     value={exp.job_title} 
//                     onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                  <FormField label="Start Date">
//                    <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//                  <FormField label="End Date">
//                    <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//                  <FormField label="Annual CTC">
//                    <div className="relative">
//                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//                      <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                    </div>
//                  </FormField>
//                  <FormField label="Office City">
//                    <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//               </div>

//               <FormField label="Core Responsibilities & Achievements">
//                 <textarea 
//                   placeholder="Briefly describe your impact and scope..." 
//                   rows={3} 
//                   value={exp.description} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none" 
//                 />
//               </FormField>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}

    
//     {isFresher === true && (
//        <div className="text-center py-20 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[3rem] animate-in fade-in duration-700">
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-400 shadow-sm mb-4 border border-blue-100">
//             <Award size={32} />
//           </div>
//           <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Entering as a Professional Fresher</p>
//           <p className="text-[10px] font-bold text-slate-400 normal-case mt-1">We will skip the employment history for your profile. Click next to proceed.</p>
//        </div>
//     )}


//     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
//       <button 
//         onClick={() => setStep(2)} 
//         type="button" 
//         className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16} className="inline mr-2" /> Back
//       </button>
//       <button 
//         onClick={() => setStep(4)} 
//         type="button"
//         disabled={isFresher === null} // Prevent proceeding until choice is made
//         className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
//       >
//         Next Phase →
//       </button>
//     </div>

 
//     <style dangerouslySetInnerHTML={{ __html: `
//       .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//     `}} />
//   </div>
// )}   */}

// {step === 3 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
    
//     {/* FRESHER SELECTION CARD */}
//     <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all overflow-hidden">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//             <Briefcase size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Are you a Fresher?</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Select your current career status</p>
//           </div>
//         </div>

//         <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//           <button 
//             type="button"
//             onClick={() => {
//                 setIsFresher(true);
//                 setFormData({ ...formData, experiences: [] }); 
//             }}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             Yes, I am
//           </button>
//           <button 
//             type="button"
//             onClick={() => setIsFresher(false)}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             No, Experienced
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* EXPERIENCED UI */}
//     {isFresher === false && (
//       <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
        
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//               <History size={20} />
//             </div>
//             <div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
//             </div>
//           </div>
          
//           <button 
//             type="button" 
//             onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "", expLetterFile: null, exp_letter_link: "", uploadMode: "file" }] })} 
//             className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
//           >
//             <Plus size={14} strokeWidth={3} /> Add Organization
//           </button>
//         </div>

//         {/* <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//           {formData.experiences.map((exp, i) => (
//             <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95 shadow-inner">
              
//               <button 
//                 type="button" 
//                 onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//                 className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//               >
//                 <Trash2 size={18} />
//               </button>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                 <FormField label="Employer / Organization">
//                   <input placeholder="e.g. Google India" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
//                 </FormField>
//                 <FormField label="Professional Designation">
//                   <input placeholder="e.g. Senior Product Designer" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                  <FormField label="Start Date">
//                    <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
//                  </FormField>
//                  <FormField label="End Date">
//                    <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
//                  </FormField>
//                  <FormField label="Annual CTC">
//                    <div className="relative">
//                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//                      <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
//                    </div>
//                  </FormField>
//                  <FormField label="Office City">
//                    <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
//                  </FormField>
//               </div>

//               <FormField label="Core Responsibilities & Achievements">
//                 <textarea placeholder="Briefly describe your impact and scope..." rows={3} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none" />
//               </FormField>

              
//               <div className="bg-white/50 border border-slate-100 rounded-3xl p-6 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Letter</p>
//                   <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 scale-90">
//                     <button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "file"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>PDF</button>
//                     <button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "link"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>URL</button>
//                   </div>
//                 </div>

//                 {exp.uploadMode === 'file' ? (
//                   <label className="flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer group">
//                     <FileUp size={20} className="text-slate-400 group-hover:text-blue-500" />
//                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px]">
//                       {exp.expLetterFile ? exp.expLetterFile.name : "Select Letter PDF"}
//                     </span>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const u = [...formData.experiences]; u[i].expLetterFile = e.target.files[0]; setFormData({ ...formData, experiences: u }); }} />
//                   </label>
//                 ) : (
//                   <div className="relative">
//                     <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input placeholder="Public Storage Link (G-Drive / Dropbox)" value={exp.exp_letter_link} onChange={(e) => { const u = [...formData.experiences]; u[i].exp_letter_link = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
//                   </div>
//                 )}
//               </div>

            
//               <div className="flex justify-end pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => toast.success(`${exp.company_name || 'Experience'} record updated`)}
//                   className="flex items-center gap-2 px-8 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
//                 >
//                   <Check size={16} strokeWidth={3} /> Save Record
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div> */}

//         <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//   {formData.experiences.map((exp, i) => (
//     <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95 shadow-inner">
      
//       {/* DELETE BUTTON */}
//       <button 
//         type="button" 
//         onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//         className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//       >
//         <Trash2 size={18} />
//       </button>

//       {/* TOP ROW: EMPLOYER & DESIGNATION */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//         <FormField label="Employer / Organization">
//           <input placeholder="e.g. Google India" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
//         </FormField>
//         <FormField label="Professional Designation">
//           <input placeholder="e.g. Senior Product Designer" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
//         </FormField>
//       </div>

//       {/* MIDDLE ROW: DATES, CTC, CITY */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//          <FormField label="Start Date">
//            <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//          </FormField>
//          <FormField label="End Date">
//            <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//          </FormField>
//          <FormField label="Annual CTC">
//            <div className="relative">
//              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//              <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
//            </div>
//          </FormField>
//          <FormField label="Office City">
//            <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none shadow-inner" />
//          </FormField>
//       </div>

//       {/* REFINED BOTTOM ROW: REMARKS & ARTIFACT SIDE-BY-SIDE */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
//         {/* LEFT COLUMN: REMARKS / RESPONSIBILITIES */}
//         <FormField label="Core Responsibilities & Achievements">
//           <textarea 
//             placeholder="Briefly describe your impact and scope..." 
//             rows={5} 
//             value={exp.description} 
//             onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//             className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none h-full min-h-[140px]" 
//           />
//         </FormField>

//         {/* RIGHT COLUMN: EXPERIENCE LETTER UPLOAD */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center px-1">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Letter</p>
//             <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "file"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === 'file' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>FILE</button>
//               <button type="button" onClick={() => { const u = [...formData.experiences]; u[i].uploadMode = "link"; setFormData({ ...formData, experiences: u }); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === 'link' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>URL</button>
//             </div>
//           </div>

//           <div className="bg-white/50 border border-slate-100 rounded-3xl p-4 min-h-[140px] flex flex-col justify-center">
//             {exp.uploadMode === 'file' ? (
//               <label className="flex flex-col items-center justify-center gap-3 w-full h-full border-2 border-dashed border-slate-200 rounded-2xl hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer group p-4">
//                 <FileUp size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
//                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center line-clamp-1 px-2">
//                   {exp.expLetterFile ? exp.expLetterFile.name : "Drop Validation PDF"}
//                 </span>
//                 <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const u = [...formData.experiences]; u[i].expLetterFile = e.target.files[0]; setFormData({ ...formData, experiences: u }); }} />
//               </label>
//             ) : (
//               <div className="relative">
//                 <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input placeholder="G-Drive / Dropbox Link" value={exp.exp_letter_link} onChange={(e) => { const u = [...formData.experiences]; u[i].exp_letter_link = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-11 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* FINAL SAVE ACTION */}
//       <div className="flex justify-end pt-2 border-t border-slate-50">
//         <button 
//           type="button" 
//           onClick={() => toast.success(`${exp.company_name || 'Experience'} record updated`)}
//           className="flex items-center gap-2 px-8 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
//         >
//           <Check size={16} strokeWidth={3} /> Save Record
//         </button>
//       </div>
//     </div>
//   ))}
// </div>
//       </div>
//     )}

//     {isFresher === true && (
//        <div className="text-center py-20 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[3rem] animate-in fade-in duration-700">
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-400 shadow-sm mb-4 border border-blue-100">
//             <Award size={32} />
//           </div>
//           <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Entering as a Professional Fresher</p>
//           <p className="text-[10px] font-bold text-slate-400 normal-case mt-1">We will skip the employment history for your profile. Click next to proceed.</p>
//        </div>
//     )}

//     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
//       <button onClick={() => setStep(2)} type="button" className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">
//         <ChevronLeft size={16} className="inline mr-2" /> Back
//       </button>
//       <button onClick={() => setStep(4)} type="button" disabled={isFresher === null} className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
//         Next Phase →
//       </button>
//     </div>

//     <style dangerouslySetInnerHTML={{ __html: `
//       .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//     `}} />
//   </div>
// )}



//             {/* STEP 4: QUANTS */}
            

//  {/* {step === 4 && (
//   <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8 overflow-visible">
//     <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
//       <Award size={20} className="text-blue-600" />
//       <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Carrer</h3>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
     
//       <FormField label="Position">
//         <div className="relative overflow-visible">
//           <div className="relative group">
//             <input
//               placeholder="Select professional role..."
//               value={formData.position}
           
//               onFocus={() => {
//                 setShowSkillDrop(true);
//                 setShowAssetDrop(false);
//                 setSkillFocused(false);
//               }} 
//               onChange={(e) => setFormData({ ...formData, position: e.target.value })}
//               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none appearance-none"
//             />
//             <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showSkillDrop ? 'rotate-180' : ''}`} />
//           </div>

//           {showSkillDrop && (
//             <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="max-h-60 overflow-y-auto no-scrollbar">
//                 {POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).length > 0 ? (
//                   POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).map((pos, i) => (
//                     <div
//                       key={i}
//                       onMouseDown={(e) => {
//                         e.preventDefault();
//                         setFormData({ ...formData, position: pos });
//                         setShowSkillDrop(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
//                     >
//                       {pos}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">No matching roles found</div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </FormField>

//       <FormField label="Total Experience (Years)">
//         <input
//           type="number"
//           placeholder="Total Experience"
//           value={formData.experience}
//           onFocus={() => {
//             setShowSkillDrop(false);
//             setShowAssetDrop(false);
//             setSkillFocused(false);
//           }}
//           onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//           className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 shadow-sm transition-all"
//         />
//       </FormField>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
    
//       <FormField label="Education">
//         <div className="relative overflow-visible">
//           <div className="relative group">
//             <input
//               placeholder="Select degree..."
//               value={eduSearch || formData.education}
        
//               onFocus={() => {
//                 setShowAssetDrop(true);
//                 setShowSkillDrop(false);
//                 setSkillFocused(false);
//               }} 
//               onChange={(e) => {
//                 setEduSearch(e.target.value);
//                 setFormData({ ...formData, education: e.target.value });
//               }}
//               className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
//             />
//             <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showAssetDrop ? 'rotate-180' : ''}`} />
//           </div>

//           {showAssetDrop && (
//             <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="max-h-60 overflow-y-auto no-scrollbar">
//                 {filteredEducation.length > 0 ? (
//                   filteredEducation.map((e, i) => (
//                     <div
//                       key={i}
//                       onMouseDown={(ev) => {
//                         ev.preventDefault();
//                         setFormData({ ...formData, education: e });
//                         setEduSearch("");
//                         setShowAssetDrop(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-slate-50 last:border-none"
//                     >
//                       {e}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">Qualification not in registry</div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </FormField>

//       <FormField label="Department">
//         <div className="relative overflow-visible">
//           <div className="relative group">
//             <input
//               placeholder="Search departments..."
//               value={deptSearch || formData.department}
          
//               onFocus={() => {
//                 setSkillFocused(true);
//                 setShowSkillDrop(false);
//                 setShowAssetDrop(false);
//               }} 
//               onChange={(e) => {
//                 setDeptSearch(e.target.value);
//                 setFormData({ ...formData, department: e.target.value });
//               }}
//               className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
//             />
//             <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${skillFocused ? 'rotate-180' : ''}`} />
//           </div>

//           {skillFocused && (
//             <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="max-h-60 overflow-y-auto no-scrollbar">
//                 {filteredDepartments.length > 0 ? (
//                   filteredDepartments.map((d) => (
//                     <div
//                       key={d.id}
//                       onMouseDown={(ev) => {
//                         ev.preventDefault();
//                         setFormData({ ...formData, department: d.name });
//                         setDeptSearch("");
//                         setSkillFocused(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none"
//                     >
//                       {d.name}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">Department not found</div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </FormField>
//     </div>

//     <div className="flex justify-between pt-8 border-t border-slate-50">
//       <button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">
//         ← Back
//       </button>
//       <button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-100 transition-all active:scale-95">
//         Next Phase →
//       </button>
//     </div>
//   </div>
// )} */}  

// {/* Wrap your steps in this div with the ref */}
// <div ref={dropdownContainerRef}>
  
//   {/* STEP 4: CAREER (Position, Education, Department) */}
//   {step === 4 && (
//     <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8 overflow-visible">
//       <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
//         <Award size={20} className="text-blue-600" />
//         <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Career</h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
//         {/* 1. POSITION DROPDOWN */}
//         <FormField label="Position">
//           <div className="relative overflow-visible">
//             <div className="relative group">
//               <input
//                 placeholder="Select professional role..."
//                 value={formData.position}
//                 onFocus={(e) => {
//                   e.stopPropagation(); // Prevents immediate close
//                   setShowSkillDrop(true);
//                   setShowAssetDrop(false);
//                   setSkillFocused(false);
//                 }} 
//                 onChange={(e) => setFormData({ ...formData, position: e.target.value })}
//                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none appearance-none"
//               />
//               <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showSkillDrop ? 'rotate-180' : ''}`} />
//             </div>

//             {showSkillDrop && (
//               <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="max-h-60 overflow-y-auto no-scrollbar">
//                   {POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).length > 0 ? (
//                     POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).map((pos, i) => (
//                       <div
//                         key={i}
//                         onMouseDown={(e) => {
//                           e.preventDefault(); 
//                           setFormData({ ...formData, position: pos });
//                           setShowSkillDrop(false);
//                         }}
//                         className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
//                       >
//                         {pos}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">No matching roles found</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </FormField>

//         <FormField label="Total Experience (Years)">
//           <input
//             type="number"
//             placeholder="Total Experience"
//             value={formData.experience}
//             onFocus={() => {
//               setShowSkillDrop(false);
//               setShowAssetDrop(false);
//               setSkillFocused(false);
//             }}
//             onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 shadow-sm transition-all"
//           />
//         </FormField>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
//         {/* 2. EDUCATION DROPDOWN */}
//         <FormField label="Education">
//           <div className="relative overflow-visible">
//             <div className="relative group">
//               <input
//                 placeholder="Select degree..."
//                 value={eduSearch || formData.education}
//                 onFocus={(e) => {
//                   e.stopPropagation();
//                   setShowAssetDrop(true);
//                   setShowSkillDrop(false);
//                   setSkillFocused(false);
//                 }} 
//                 onChange={(e) => {
//                   setEduSearch(e.target.value);
//                   setFormData({ ...formData, education: e.target.value });
//                 }}
//                 className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
//               />
//               <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showAssetDrop ? 'rotate-180' : ''}`} />
//             </div>

//             {showAssetDrop && (
//               <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="max-h-60 overflow-y-auto no-scrollbar">
//                   {filteredEducation.map((e, i) => (
//                     <div
//                       key={i}
//                       onMouseDown={(ev) => {
//                         ev.preventDefault();
//                         setFormData({ ...formData, education: e });
//                         setEduSearch("");
//                         setShowAssetDrop(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-slate-50 last:border-none"
//                     >
//                       {e}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </FormField>

//         {/* 3. DEPARTMENT DROPDOWN */}
//         {/* <FormField label="Department">
//           <div className="relative overflow-visible">
//             <div className="relative group">
//               <input
//                 placeholder="Search departments..."
//                 value={deptSearch || formData.department}
//                 onFocus={(e) => {
//                   e.stopPropagation();
//                   setSkillFocused(true);
//                   setShowSkillDrop(false);
//                   setShowAssetDrop(false);
//                 }} 
//                 onChange={(e) => {
//                   setDeptSearch(e.target.value);
//                   setFormData({ ...formData, department: e.target.value });
//                 }}
//                 className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
//               />
//               <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${skillFocused ? 'rotate-180' : ''}`} />
//             </div>

//             {skillFocused && (
//               <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="max-h-60 overflow-y-auto no-scrollbar">
//                   {filteredDepartments.map((d) => (
//                     <div
//                       key={d.id}
//                       onMouseDown={(ev) => {
//                         ev.preventDefault();
//                         setFormData({ ...formData, department: d.name });
//                         setDeptSearch("");
//                         setSkillFocused(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none"
//                     >
//                       {d.name}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </FormField> */}
//       </div>

//       <div className="flex justify-between pt-8 border-t border-slate-50">
//         <button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">← Back</button>
//         <button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl active:scale-95">Next Phase →</button>
//       </div>
//     </div>
//   )}

// </div>

           
//             {/* STEP 5: STACK & ASSETS INVENTORY (ENTERPRISE CHIP CLOUD DESIGN) */}
// {step === 5 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
//     <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl shadow-slate-200/50 overflow-visible">
//       {/* Section Header */}
//       <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <Cpu size={20} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inventory & Expertise</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Select applicable technical skills and physical assets</p>
//           </div>
//         </div>
//       </div>

//       <div className="p-8 md:p-12 space-y-12 overflow-visible">
//         {/* TECHNICAL SKILLS CLOUD */}
//         <div className="space-y-6">
          

//         <FormField label="Technical Expertise Matrix">
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row gap-4 items-end">
//               <div className="relative max-w-md w-full">
//                 <Plus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input 
//                   value={skillInput} 
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       handleManualAddSkill();
//                     }
//                   }}
//                   placeholder="Type new skill..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 shadow-inner transition-all"
//                 />
//               </div>
              
//               <button 
//                 type="button" 
//                 onClick={handleManualAddSkill}
//                 className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg"
//               >
//                 <Database size={14} /> {skillInput.trim() ? "Register & Add" : "Sync Registry"}
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-3 p-1">
//               {dynamicSkills.map((skill) => {
//                 const isSelected = formData.skills.includes(skill);
//                 return (
//                   <button
//                     key={skill}
//                     type="button"
//                     onClick={() => {
//                       const updated = isSelected 
//                         ? formData.skills.filter(s => s !== skill)
//                         : [...formData.skills, skill];
//                       setFormData({...formData, skills: updated});
//                     }}
//                     className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                       ${isSelected 
//                         ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
//                         : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30"}`}
//                   >
//                     {skill}
//                     {isSelected && <Check size={14} strokeWidth={3} />}
//                   </button>
//                 );
//               })}
//               {dynamicSkills.length === 0 && <p className="text-[10px] font-bold text-slate-300 italic uppercase">Initializing Registry...</p>}
//             </div>
//           </div>
//         </FormField>
//         </div>

//         {/* ASSET ALLOCATION CLOUD */}
//         <div className="space-y-6 pt-8 border-t border-slate-100">
//           {/* <FormField label="Enterprise Hardware Matrix">
//             <div className="space-y-6">
            
//               <div className="relative max-w-md">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Layers size={16} />
//                 </div>
//                 <input 
//                   value={assetInput} 
//                   onChange={(e) => setAssetInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       const v = assetInput.trim();
//                       if(v && !formData.assets.includes(v)) setFormData({...formData, assets: [...formData.assets, v]});
//                       setAssetInput("");
//                     }
//                   }}
//                   placeholder="Assign other hardware..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//                 />
//               </div>

          
//               <div className="flex flex-wrap gap-3 p-1">
//                 {ASSET_OPTIONS.map((asset) => {
//                   const isSelected = formData.assets.includes(asset);
//                   return (
//                     <button
//                       key={asset}
//                       type="button"
//                       onClick={() => {
//                         const updated = isSelected 
//                           ? formData.assets.filter(a => a !== asset)
//                           : [...formData.assets, asset];
//                         setFormData({...formData, assets: updated});
//                       }}
//                       className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                         ${isSelected 
//                           ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
//                           : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"}`}
//                     >
//                       {asset}
//                       {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
//                     </button>
//                   );
//                 })}
             
//                 {formData.assets.filter(a => !ASSET_OPTIONS.includes(a)).map((customAsset) => (
//                    <button
//                     key={customAsset}
//                     type="button"
//                     onClick={() => setFormData({...formData, assets: formData.assets.filter(a => a !== customAsset)})}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-900 border-2 border-slate-900 text-white shadow-lg active:scale-90"
//                   >
//                     {customAsset}
//                     <Check size={14} strokeWidth={3} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </FormField> */}

//           <FormField label="Enterprise Hardware Matrix">
//   <div className="space-y-6">
//     {/* Search & Manual Add Input */}
//     <div className="relative max-w-md">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//         <Layers size={16} />
//       </div>
//       <input 
//         value={assetInput} 
//         onChange={(e) => setAssetInput(e.target.value)}
//         onKeyDown={async (e) => {
//           if(e.key === 'Enter') {
//             e.preventDefault();
//             const v = assetInput.trim();
//             if(v && !formData.assets.includes(v)) {
//               // API INTEGRATION
//               const success = await handleAddAssetAPI(v);
//               if(success) {
//                 setFormData({...formData, assets: [...formData.assets, v]});
//                 setAssetInput("");
//               }
//             }
//           }
//         }}
//         placeholder="Type hardware name and press Enter..." 
//         className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//       />
//     </div>

//     {/* Asset Cloud */}
//     <div className="flex flex-wrap gap-3 p-1">
//       {ASSET_OPTIONS.map((asset) => {
//         const isSelected = formData.assets.includes(asset);
//         return (
//           <button
//             key={asset}
//             type="button"
//             onClick={async () => {
//               if (!isSelected) {
//                 // API INTEGRATION on selection
//                 const success = await handleAddAssetAPI(asset);
//                 if(success) {
//                   setFormData({...formData, assets: [...formData.assets, asset]});
//                 }
//               } else {
//                 // Optional: Add delete API call here if needed
//                 setFormData({...formData, assets: formData.assets.filter(a => a !== asset)});
//               }
//             }}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//               ${isSelected 
//                 ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
//                 : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}
//           >
//             {asset}
//             {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
//           </button>
//         );
//       })}
      
//       {/* Custom dynamic assets already in state */}
//       {formData.assets.filter(a => !ASSET_OPTIONS.includes(a)).map((customAsset) => (
//          <button
//           key={customAsset}
//           type="button"
//           onClick={() => setFormData({...formData, assets: formData.assets.filter(a => a !== customAsset)})}
//           className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-900 border-2 border-slate-900 text-white shadow-lg active:scale-90"
//         >
//           {customAsset} <Check size={14} strokeWidth={3} />
//         </button>
//       ))}
//     </div>
//   </div>
// </FormField>
//         </div>
//       </div>
//     </div>

//     {/* NAVIGATION ACTIONS */}
//     <div className="flex justify-between items-center pt-4">
//       <button 
//         onClick={() => setStep(4)} 
//         type="button" 
//         className="flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16}/> Previous Phase
//       </button>
//       <button 
//         onClick={() => setStep(6)} 
//         type="button" 
//         className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
//       >
//         Vault Registry <ChevronRight size={16}/>
//       </button>
//     </div>
//   </div>
// )}

            
//             {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
// {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
// {step === 6 && (
//   <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
//     {/* Unified White Enterprise Card */}
//     <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-xl shadow-slate-200/60 border border-slate-200 space-y-12 overflow-hidden relative">
      
//       {/* Subtle Background Branding Accent */}
//       <div className="absolute top-0 right-0 p-12 text-slate-100 opacity-40 pointer-events-none rotate-12 scale-150">
//         <ShieldCheck size={240} />
//       </div>

//       {/* Vault Header */}
//       <div className="flex items-center gap-5 pb-8 border-b border-slate-100 relative z-10">
//         <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
//           <ShieldCheck size={28} className="text-white" />
//         </div>
//         <div>
//           <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Registry Artifacts</h3>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Document Verification Matrix</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
//         {/* 1. MASTER RESUME */}
//         <div className="space-y-8 p-1">
//           <div className="flex justify-between items-center">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 1. Master Resume
//             </p>
//             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
//               <button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
//             </div>
//           </div>
//           {resumeMode === 'file' ? (
//             <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-blue-500 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
//               <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-5 group-hover:scale-110 transition-all duration-500" />
//               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select Resume PDF"}</p>
//               <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} />
//             </label>
//           ) : (
//             <input placeholder="Enter Public Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5" />
//           )}
//         </div>

//         {/* 2. EXPERIENCE LETTER */}
//         <div className="space-y-8 p-1">
//           <div className="flex justify-between items-center">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> 2. Exp. Letter
//             </p>
//             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => setExpLetterMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
//               <button type="button" onClick={() => setExpLetterMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
//             </div>
//           </div>
//           {expLetterMode === 'file' ? (
//             <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
//               <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-slate-900 mb-5 group-hover:scale-110 transition-all duration-500" />
//               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.expLetterFile ? formData.expLetterFile.name : "Select Exp. PDF"}</p>
//               <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} />
//             </label>
//           ) : (
//             <input placeholder="Enter Public Exp. Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-slate-900 transition-all shadow-sm focus:ring-4 focus:ring-slate-900/5" />
//           )}
//         </div>
//       </div>

//       {/* 3. CERTIFICATIONS */}
//       <div className="pt-8 border-t border-slate-100 space-y-8 relative z-10">
//          <div className="flex justify-between items-center mb-2">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 3. Credentials Matrix
//             </p>
//             <div className="flex gap-4">
//               <label className="cursor-pointer h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 transition-all flex items-center justify-center shadow-sm">
//                 <FileUp size={20}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})}/>
//               </label>
//               <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 flex items-center justify-center shadow-sm">
//                 <LinkIcon size={20}/>
//               </button>
//             </div>
//          </div>
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
//            {formData.certificateFiles.map((file, idx) => (
//               <div key={idx} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-xs text-slate-900 font-bold animate-in zoom-in-95 hover:border-emerald-200 transition-colors shadow-sm">
//                 <div className="flex items-center gap-4 truncate max-w-[85%]">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> 
//                   {file.name}
//                 </div>
//                 <X size={20} className="text-slate-300 hover:text-red-500 cursor-pointer transition-all hover:rotate-90" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})}/>
//               </div>
//            ))}
//            {formData.certificateLinks.map((link, idx) => (
//               <div key={idx} className="flex gap-4 animate-in slide-in-from-right-4">
//                 <div className="relative flex-1">
//                   <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
//                   <input value={link} placeholder="Credential Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-sm" />
//                 </div>
//                 <button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-red-500 bg-white h-16 w-16 rounded-[2rem] border border-slate-200 transition-all flex items-center justify-center shadow-sm">
//                   <Trash2 size={24}/>
//                 </button>
//               </div>
//            ))}
//          </div>
//       </div>

//       {/* FINAL SUBMIT BUTTONS */}
//       <div className="pt-16 border-t border-slate-100 flex flex-col items-center gap-8 relative z-10">
//         <button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[3rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] text-sm tracking-widest uppercase disabled:opacity-50">
//           {loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} strokeWidth={2.5}/><span>Submit all Profile</span></>}
//         </button>
//         <button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
//           <ChevronLeft size={16}/> Return to Previous Module
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//***********************************************************WORKING CODE PHASE 123 17/03/26************************************************ */
// import React, { useState, useEffect } from "react";
// import {
//   Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
//   Loader2, Plus, Trash2, Layers, Cpu, ExternalLink, Database,
//   Globe, ShieldCheck, History, X, LinkIcon, FileUp, ChevronRight, ChevronLeft,ChevronDown
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between items-center">
//       <span>{label}</span>
//       <span className={`font-bold normal-case ${required ? "text-red-500" : "text-slate-300"}`}>
//         {required ? "Required" : "Optional"}
//       </span>
//     </label>
//     {children}
//     {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
//   </div>
// );

// const ManualEntryPage = () => {
//   // 1. INITIALIZE ALL STATES FIRST
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [isFresher, setIsFresher] = useState(null); // null = unselected, true = yes, false = no
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState(""); // Variable now initialized before use
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [assetFocused, setAssetFocused] = useState(false);
//   const [dynamicSkills, setDynamicSkills] = useState([]);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", address: "", address1: "", address2: "", location: "",
//     pincode: "", state: "", city: "", district: "", country: "India", position: "",
//     education: "", gender: "", dob: "", experience: "", about_me: "",
//     languages_spoken: [], skills: [], assets: [], department: "",
//     cvFile: null, resume_link: "", expLetterFile: null,
//     experience_letter_link: "", certificateFiles: [], certificateLinks: [""], experiences: [],
//   });

//   // 2. STATIC DATA & FILTER LOGIC (Now safe to use state variables)
//   const totalSteps = 6;
//   const SKILL_OPTIONS = ["React", "JavaScript", "Node.js", "MongoDB", "MySQL", "HTML", "CSS", "Tailwind", "Python", "Java", "AWS", "Docker"];
//   const ASSET_OPTIONS = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Mobile", "ID Card", "SIM Card"];
//   const POSITION_OPTIONS = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Executive", "UI/UX Designer", "DevOps Engineer", "Data Analyst"];
//   const educationOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "Diploma", "PhD"];

//   const filteredSkills = SKILL_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s));
//   const filteredAssets = ASSET_OPTIONS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()) && !formData.assets.includes(a));
//   const filteredDepartments = departments.filter(d => (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()));
//   const filteredEducation = educationOptions.filter(e => e.toLowerCase().includes(eduSearch.toLowerCase()));

//   const isStep1Valid = formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && /^[6-9]\d{9}$/.test(formData.phone);

//   // 3. EFFECTS
//   useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

//   useEffect(() => {
//     const loadDepartments = async () => {
//       try { const data = await departmentService.getAll(); setDepartments(data || []); }
//       catch (err) { toast.error("Failed to load departments"); }
//     };
//     loadDepartments();
//   }, []);

//   useEffect(() => {
//   fetchSkills();
// }, []);

//   // 4. HANDLERS
//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value) error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";
//     setErrors(prev => ({ ...prev, [field]: error }));
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         const cities = offices.map(o => o.Name);
//         setCityOptions(cities);
//         setFormData(prev => ({ ...prev, city: cities.length === 1 ? cities[0] : "", state: offices[0].State, district: offices[0].District, country: offices[0].Country }));
//       }
//     } catch { toast.error("Lookup failed"); }
//     finally { setIsFetchingPincode(false); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateField("name", formData.name) || !validateField("email", formData.email) || !validateField("phone", formData.phone)) {
//       toast.error("Please fill required fields");
//       return;
//     }
//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "expLetterFile", "certificateLinks", "skills", "assets"].includes(key)) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       formDataApi.append("full_name", formData.name);
//       formDataApi.append("languages_spoken", JSON.stringify(formData.languages_spoken));
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));
//       formDataApi.append("skills", JSON.stringify(formData.skills));
//       formDataApi.append("assets", JSON.stringify(formData.assets));
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);
//       formData.certificateFiles.forEach(file => formDataApi.append("certificate_files[]", file));
//       formData.certificateLinks.filter(l => String(l).startsWith("http")).forEach(link => formDataApi.append("certificate_links", link));
      
//       await candidateService.createCandidate(formDataApi);
//       toast.success("Profile committed successfully 🎉");
//     } catch (err) { toast.error("Commit failed"); }
//     finally { setLoading(false); }
//   };


// // Function to Create + Refresh
// const handleManualAddSkill = async () => {
//   const name = skillInput.trim();
  
//   if (!name) {
//     await fetchSkills(); // Just refresh if empty
//     toast.success("Registry Refreshed");
//     return;
//   }

//   // Create skill via API
//   const success = await handleCreateMaster("skills", name);
//   if (success) {
//     // 1. Add to selected list immediately
//     if (!formData.skills.includes(name)) {
//       setFormData(prev => ({ ...prev, skills: [...prev.skills, name] }));
//     }
//     // 2. Clear input
//     setSkillInput(""); 
//     // 3. Re-fetch all chips from server
//     await fetchSkills(); 
//   }
// };


//   // 1. New Helper function to handle API Creation
// // const handleCreateMaster = async (type, name) => {
// //   if (!name.trim()) return;
  
// //   const loadingToast = toast.loading(`Registering new ${type}...`);
// //   try {
// //     const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${type}`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ name: name.trim() }),
// //     });

// //     if (response.ok) {
// //       toast.success(`${name} added to global ${type} registry`, { id: loadingToast });
// //       return true;
// //     } else {
// //       throw new Error("Failed to create");
// //     }
// //   } catch (error) {
// //     toast.error(`Could not register ${name}`, { id: loadingToast });
// //     return false;
// //   }
// // };

// const handleCreateMaster = async (type, name) => {
//   if (!name.trim()) return;
  
//   const loadingToast = toast.loading(`Registering new ${type}...`);
//   try {
//     const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${type}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: name.trim() }),
//     });

//     if (response.ok) {
//       toast.success(`${name} added to global ${type} registry`, { id: loadingToast });
      
//       // IMPORTANT: After creating, re-fetch the list so the new skill shows up as a chip
//       if (type === "skills") {
//         await fetchSkills(); 
//       }
//       return true;
//     } else {
//       throw new Error("Failed to create");
//     }
//   } catch (error) {
//     toast.error(`Could not register ${name}`, { id: loadingToast });
//     return false;
//   }
// };

// const fetchSkills = async () => {
//   try {
//     const response = await fetch("https://apihrr.goelectronix.co.in/masters/skills");
//     const data = await response.json();
//     // Assuming the API returns an array of objects like [{id: 1, name: "React"}, ...]
//     // Adjust the map based on your actual API response structure
//     setDynamicSkills(data.map(item => item.name));
//   } catch (error) {
//     toast.error("Failed to sync skill registry");
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* HEADER */}
//         {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-6">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//               <Database size={32} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//               <div className="flex items-center gap-2 mt-1 text-blue-600">
//                 <ShieldCheck size={14} />
//                 <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-w-[240px]">
//             <div className="flex justify-between mb-2 text-[9px] font-black uppercase text-slate-400">
//               <span>Step {step} of {totalSteps}</span>
//               <span>{Math.round((step / totalSteps) * 100)}%</span>
//             </div>
//             <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"><div className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
//           </div>
//         </div> */}
//         {/* <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">

//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//       <div className="flex items-center gap-2 mt-1 text-blue-600">
//         <ShieldCheck size={14} />
//         <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//       </div>
//     </div>
//   </div>


//   <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">

//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
      
 
//       <div 
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {[1, 2, 3, 4, 5, 6].map((num) => (
//         <div key={num} className="relative z-10 flex flex-col items-center gap-2">
      
//           <div 
//             className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               ${step === num 
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num 
//                 ? "bg-emerald-500 text-white border-emerald-50" 
//                 : "bg-white text-slate-300 border-slate-50"}`}
//           >
//             {step > num ? <Check size={14} strokeWidth={4} /> : num}
//           </div>
          
         
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300
//             ${step === num ? "text-blue-600" : step > num ? "text-emerald-600" : "text-slate-300"}`}>
//             {num === 1 && "Personal details"}
//             {num === 2 && "Location"}
//             {num === 3 && "Experience"}
//             {num === 4 && "Carrer"}
//             {num === 5 && "Asset & Skill"}
//             {num === 6 && "Document"}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>

  
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</p>
//       <p className="text-sm font-black text-slate-900 leading-none mt-1">{Math.round((step / totalSteps) * 100)}%</p>
//     </div>
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
//        {step === 6 ? <Check size={18} strokeWidth={3} /> : <Loader2 size={18} className="animate-spin" />}
//     </div>
//   </div>
// </div> */}

//         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//   {/* Left: Branding */}
//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//       <div className="flex items-center gap-2 mt-1 text-blue-600">
//         <ShieldCheck size={14} />
//         <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//       </div>
//     </div>
//   </div>

//   {/* Right: Professional Roadmap */}
//   <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">
//       {/* Background Connecting Line */}
//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
      
//       {/* Active Progress Line */}
//       <div 
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {/* Roadmap Steps */}
//       {[1, 2, 3, 4, 5, 6].map((num) => (
//         <div key={num} className="relative z-10 flex flex-col items-center gap-2">
//           {/* Step Circle */}
//           <div 
//             className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               ${step === num 
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num 
//                 ? "bg-emerald-500 text-white border-emerald-50" 
//                 : "bg-white text-slate-300 border-slate-50"}`}
//           >
//             {step > num ? <Check size={14} strokeWidth={4} /> : num}
//           </div>
          
//           {/* Step Label (Hidden on small mobile, visible on tablet+) */}
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300
//             ${step === num ? "text-blue-600" : step > num ? "text-emerald-600" : "text-slate-300"}`}>
//             {num === 1 && "Personal details"}
//             {num === 2 && "Location"}
//             {num === 3 && "Experience"}
//             {num === 4 && "Carrer"}
//             {num === 5 && "Asset & Skill"}
//             {num === 6 && "Document"}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Progress Percentage Badge */}
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</p>
//       <p className="text-sm font-black text-slate-900 leading-none mt-1">{Math.round((step / totalSteps) * 100)}%</p>
//     </div>
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
//        {step === 6 ? <Check size={18} strokeWidth={3} /> : <Loader2 size={18} className="animate-spin" />}
//     </div>
//   </div>
// </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1">
//           <div className="space-y-12">

//             {/* STEP 1: IDENTITY */}
//             {step === 1 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><User size={18} className="text-blue-600" /><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identification</h3></div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <FormField label="Full Name" required error={errors.name}><input placeholder="Legal Name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); validateField("name", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
//                   <FormField label="Email Address" required error={errors.email}><input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateField("email", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
//                   <FormField label="Phone Number" required error={errors.phone}><div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm"><span className="px-5 text-[11px] font-black text-slate-400 border-r border-slate-100">+91</span><input maxLength={10} value={formData.phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, phone: v }); validateField("phone", v); }} className="w-full px-5 py-4 bg-transparent text-sm font-bold outline-none" /></div></FormField>
//                   <FormField label="Gender Selection"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></FormField>
//                   <FormField label="Date of Birth"><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" /></FormField>
//                   <FormField label="Languages"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-h-40 overflow-y-auto grid grid-cols-2 gap-4 shadow-inner">{["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"].map(lang => (<label key={lang} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 cursor-pointer hover:text-blue-600"><input type="checkbox" checked={formData.languages_spoken.includes(lang)} onChange={() => { const u = formData.languages_spoken.includes(lang) ? formData.languages_spoken.filter(l => l !== lang) : [...formData.languages_spoken, lang]; setFormData({ ...formData, languages_spoken: u }); }} className="w-4 h-4 accent-blue-600" /> {lang}</label>))}</div></FormField>
//                 </div>
//                 <FormField label="Profile Bio"><textarea rows={4} placeholder="Brief summary..." value={formData.about_me} onChange={(e) => setFormData({ ...formData, about_me: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none resize-none shadow-sm" /></FormField>
//                 <div className="flex justify-end pt-4"><button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)} className={`flex items-center gap-3 px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isStep1Valid ? "bg-blue-600 text-white shadow-blue-600/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Next Phase <ChevronRight size={16}/></button></div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><MapPin size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Geolocation Registry</h3></div>
//                 <div className="space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Address line 1" required><input placeholder="Building/Flat/Street" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
//                     <FormField label="Address line 2" required><input placeholder="Landmark/Locality" value={formData.address2} onChange={(e) => setFormData({...formData, address2: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Location/Area Hub" required><input placeholder="City Hub/Area" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" /></FormField>
//                     <FormField label="Pincode Mapping" required><div className="relative"><input maxLength={6} placeholder="000000" value={formData.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, pincode: v }); if (v.length === 6) fetchPincodeDetails(v); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500" />{isFetchingPincode && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />}</div></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     {/* <FormField label="City">{cityOptions.length > 1 ? (<select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold appearance-none">{cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}</select>) : <input value={formData.city} readOnly placeholder="System Identified" className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" />}</FormField> */}
//                     {/* CITY SELECTION */}
//   <FormField label="City">
//     <div className="relative group">
//       {cityOptions.length > 1 ? (
//         <>
//           <select 
//             value={formData.city} 
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
//             className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
//           >
//             <option value="">Select City</option>
//             {cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}
//           </select>
//           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//             <ChevronDown size={16} />
//           </div>
//         </>
//       ) : (
//         <input 
//           value={formData.city} 
//           readOnly 
//           placeholder="Auto-filled" 
//           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner cursor-not-allowed" 
//         />
//       )}
//     </div>
//   </FormField>
//                     <FormField label="District"><input value={formData.district} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
//                     <FormField label="State"><input value={formData.state} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
//                     {/* ADDED COUNTRY FIELD */}
//       <FormField label="Country">
//         <input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="India" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
//       </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(1)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all"><ChevronLeft size={16} className="inline mr-2"/> Back</button><button onClick={() => setStep(3)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl active:scale-95 transition-all">Continue →</button></div>
//               </div>
//             )}

//             {/* STEP 3: EMPLOYMENT */}
//             {/* {step === 3 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10 border border-white/5">
//                   <div className="flex justify-between items-center border-b border-white/10 pb-8 text-white">
//                     <div className="flex items-center gap-4"><History size={28}/><h3 className="text-sm font-black uppercase tracking-widest leading-none">Career Timeline</h3></div>
//                     <button type="button" onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95">+ Add Organization</button>
//                   </div>
//                   <div className="space-y-10 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
//                     {formData.experiences.map((exp, i) => (
//                       <div key={i} className="relative bg-white/[0.04] border border-white/10 p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white/[0.08] animate-in zoom-in-95">
//                         <button type="button" onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} className="absolute -top-3 -right-3 h-12 w-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                           <input placeholder="Employer / Organization" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-b border-white/10 px-2 py-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
//                           <input placeholder="Role / Job Title" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-b border-white/10 px-2 py-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Joined</p><input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Departure</p><input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Annual CTC</p><input placeholder="₹" type="number" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Work City</p><input placeholder="Office Loc." value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                         </div>
//                         <textarea placeholder="Job scope responsibilities..." rows={3} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-6 text-[12px] font-medium text-slate-300 outline-none focus:bg-white/10" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-4"><button onClick={() => setStep(2)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase">← Back</button><button onClick={() => setStep(4)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-600/20">Next Phase →</button></div>
//               </div>
//             )} */}

//             {/* STEP 3: EMPLOYMENT HISTORY (REFINED ENTERPRISE UI) */}
// {/* STEP 3: EMPLOYMENT HISTORY - ENTERPRISE ALIGNED DESIGN */}
// {/* {step === 3 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//     <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10">
      
    
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <History size={20} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
//           </div>
//         </div>
        
//         <button 
//           type="button" 
//           onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} 
//           className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
//         >
//           <Plus size={14} strokeWidth={3} /> Add Organization
//         </button>
//       </div>

   
//       <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//         {formData.experiences.map((exp, i) => (
//           <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95">
            
         
//             <button 
//               type="button" 
//               onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//               className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//             >
//               <Trash2 size={18} />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//               <FormField label="Employer / Organization">
//                 <input 
//                   placeholder="e.g. Google India" 
//                   value={exp.company_name} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                 />
//               </FormField>
//               <FormField label="Professional Designation">
//                 <input 
//                   placeholder="e.g. Senior Product Designer" 
//                   value={exp.job_title} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                 />
//               </FormField>
//             </div>

          
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                <FormField label="Start Date">
//                  <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                </FormField>
//                <FormField label="End Date">
//                  <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                </FormField>
//                <FormField label="Annual CTC">
//                  <div className="relative">
//                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//                    <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </div>
//                </FormField>
//                <FormField label="Office City">
//                  <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                </FormField>
//             </div>

            
//             <FormField label="Core Responsibilities & Achievements">
//               <textarea 
//                 placeholder="Briefly describe your impact and scope..." 
//                 rows={3} 
//                 value={exp.description} 
//                 onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                 className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none" 
//               />
//             </FormField>
//           </div>
//         ))}

//         {formData.experiences.length === 0 && (
//           <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] animate-in fade-in duration-700">
//             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm mb-4">
//               <Briefcase size={32} />
//             </div>
//             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Employment Records Detected</p>
//             <p className="text-[10px] font-bold text-slate-300 normal-case mt-1">Click the button above to add your previous work experience.</p>
//           </div>
//         )}
//       </div>
//     </div>

    
//     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
//       <button 
//         onClick={() => setStep(2)} 
//         type="button" 
//         className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16} className="inline mr-2" /> Back
//       </button>
//       <button 
//         onClick={() => setStep(4)} 
//         type="button" 
//         className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95"
//       >
//         Next Phase →
//       </button>
//     </div>

   
//     <style dangerouslySetInnerHTML={{ __html: `
//       .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//     `}} />
//   </div>
// )} */}


// {/* STEP 3: EMPLOYMENT HISTORY - ENTERPRISE ALIGNED DESIGN */}
// {step === 3 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
    
//     {/* NEW: FRESHER SELECTION CARD */}
//     <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all overflow-hidden">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//             <Briefcase size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Are you a Fresher?</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Select your current career status</p>
//           </div>
//         </div>

//         <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//           <button 
//             type="button"
//             onClick={() => {
//                 setIsFresher(true);
//                 setFormData({ ...formData, experiences: [] }); // Clear experiences if fresher
//             }}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             Yes, I am
//           </button>
//           <button 
//             type="button"
//             onClick={() => setIsFresher(false)}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             No, Experienced
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* CONDITIONAL UI: SHOW ONLY IF NOT A FRESHER */}
//     {isFresher === false && (
//       <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
        
//         {/* Header with Professional Blue Accent */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//               <History size={20} />
//             </div>
//             <div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
//             </div>
//           </div>
          
//           <button 
//             type="button" 
//             onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} 
//             className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
//           >
//             <Plus size={14} strokeWidth={3} /> Add Organization
//           </button>
//         </div>

//         {/* Experience List - Fixed Scrollbar Logic */}
//         <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//           {formData.experiences.map((exp, i) => (
//             <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95">
              
//               <button 
//                 type="button" 
//                 onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//                 className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//               >
//                 <Trash2 size={18} />
//               </button>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                 <FormField label="Employer / Organization">
//                   <input 
//                     placeholder="e.g. Google India" 
//                     value={exp.company_name} 
//                     onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                   />
//                 </FormField>
//                 <FormField label="Professional Designation">
//                   <input 
//                     placeholder="e.g. Senior Product Designer" 
//                     value={exp.job_title} 
//                     onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                  <FormField label="Start Date">
//                    <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//                  <FormField label="End Date">
//                    <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//                  <FormField label="Annual CTC">
//                    <div className="relative">
//                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//                      <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                    </div>
//                  </FormField>
//                  <FormField label="Office City">
//                    <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//               </div>

//               <FormField label="Core Responsibilities & Achievements">
//                 <textarea 
//                   placeholder="Briefly describe your impact and scope..." 
//                   rows={3} 
//                   value={exp.description} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none" 
//                 />
//               </FormField>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}

//     {/* EMPTY STATE FOR FRESHER YES */}
//     {isFresher === true && (
//        <div className="text-center py-20 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[3rem] animate-in fade-in duration-700">
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-400 shadow-sm mb-4 border border-blue-100">
//             <Award size={32} />
//           </div>
//           <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Entering as a Professional Fresher</p>
//           <p className="text-[10px] font-bold text-slate-400 normal-case mt-1">We will skip the employment history for your profile. Click next to proceed.</p>
//        </div>
//     )}

//     {/* NAVIGATION BUTTONS */}
//     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
//       <button 
//         onClick={() => setStep(2)} 
//         type="button" 
//         className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16} className="inline mr-2" /> Back
//       </button>
//       <button 
//         onClick={() => setStep(4)} 
//         type="button"
//         disabled={isFresher === null} // Prevent proceeding until choice is made
//         className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
//       >
//         Next Phase →
//       </button>
//     </div>

//     {/* CSS Styles... same as before */}
//     <style dangerouslySetInnerHTML={{ __html: `
//       .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//     `}} />
//   </div>
// )}



//             {/* STEP 4: QUANTS */}
//             {/* {step === 4 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8">
//                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><Award size={20} className="text-blue-600" /><h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Context Registry</h3></div>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                     <FormField label="Assigned Position"><input list="pos-opts" placeholder="Search role..." value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all" /><datalist id="pos-opts">{POSITION_OPTIONS.map((p, i) => <option key={i} value={p}/>)}</datalist></FormField>
//                     <FormField label="Seniority Level (Years)"><input type="number" placeholder="Total Experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none shadow-sm" /></FormField>
//                  </div>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                     <FormField label="Education Registry"><div className="relative"><input placeholder="Type degree..." value={formData.education} onChange={(e) => { setEduSearch(e.target.value); setFormData({...formData, education: e.target.value}); }} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white shadow-sm" />{eduSearch && filteredEducation.length > 0 && <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">{filteredEducation.map((e, i) => <div key={i} onClick={() => { setFormData({...formData, education: e}); setEduSearch(""); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 transition-colors last:border-none">{e}</div>)}</div>}</div></FormField>
//                     <FormField label="Business Department"><div className="relative"><input placeholder="Search dept..." value={formData.department} onChange={(e) => { setDeptSearch(e.target.value); setFormData({...formData, department: e.target.value}); }} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white shadow-sm" />{deptSearch && filteredDepartments.length > 0 && <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">{filteredDepartments.map((d) => <div key={d.id} onClick={() => { setFormData({...formData, department: d.name}); setDeptSearch(""); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none">{d.name}</div>)}</div>}</div></FormField>
//                  </div>
//                  <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase">← Back</button><button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-100">Next Phase →</button></div>
//               </div>
//             )} */}

//  {step === 4 && (
//   <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8 overflow-visible">
//     <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
//       <Award size={20} className="text-blue-600" />
//       <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Context Registry</h3>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
//       {/* 1. POSITION DROPDOWN */}
//       <FormField label="Assigned Position">
//         <div className="relative overflow-visible">
//           <div className="relative group">
//             <input
//               placeholder="Select professional role..."
//               value={formData.position}
//               /* AUTO-CLOSE OTHERS ON FOCUS */
//               onFocus={() => {
//                 setShowSkillDrop(true);
//                 setShowAssetDrop(false);
//                 setSkillFocused(false);
//               }} 
//               onChange={(e) => setFormData({ ...formData, position: e.target.value })}
//               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none appearance-none"
//             />
//             <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showSkillDrop ? 'rotate-180' : ''}`} />
//           </div>

//           {showSkillDrop && (
//             <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="max-h-60 overflow-y-auto no-scrollbar">
//                 {POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).length > 0 ? (
//                   POSITION_OPTIONS.filter(p => p.toLowerCase().includes(formData.position.toLowerCase())).map((pos, i) => (
//                     <div
//                       key={i}
//                       onMouseDown={(e) => {
//                         e.preventDefault();
//                         setFormData({ ...formData, position: pos });
//                         setShowSkillDrop(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
//                     >
//                       {pos}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">No matching roles found</div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </FormField>

//       <FormField label="Seniority Level (Years)">
//         <input
//           type="number"
//           placeholder="Total Experience"
//           value={formData.experience}
//           onFocus={() => {
//             setShowSkillDrop(false);
//             setShowAssetDrop(false);
//             setSkillFocused(false);
//           }}
//           onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//           className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 shadow-sm transition-all"
//         />
//       </FormField>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
//       {/* 2. EDUCATION DROPDOWN */}
//       <FormField label="Education">
//         <div className="relative overflow-visible">
//           <div className="relative group">
//             <input
//               placeholder="Select degree..."
//               value={eduSearch || formData.education}
//               /* AUTO-CLOSE OTHERS ON FOCUS */
//               onFocus={() => {
//                 setShowAssetDrop(true);
//                 setShowSkillDrop(false);
//                 setSkillFocused(false);
//               }} 
//               onChange={(e) => {
//                 setEduSearch(e.target.value);
//                 setFormData({ ...formData, education: e.target.value });
//               }}
//               className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
//             />
//             <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showAssetDrop ? 'rotate-180' : ''}`} />
//           </div>

//           {showAssetDrop && (
//             <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="max-h-60 overflow-y-auto no-scrollbar">
//                 {filteredEducation.length > 0 ? (
//                   filteredEducation.map((e, i) => (
//                     <div
//                       key={i}
//                       onMouseDown={(ev) => {
//                         ev.preventDefault();
//                         setFormData({ ...formData, education: e });
//                         setEduSearch("");
//                         setShowAssetDrop(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-slate-50 last:border-none"
//                     >
//                       {e}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">Qualification not in registry</div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </FormField>

//       {/* 3. DEPARTMENT DROPDOWN */}
//       <FormField label="Business Department">
//         <div className="relative overflow-visible">
//           <div className="relative group">
//             <input
//               placeholder="Search departments..."
//               value={deptSearch || formData.department}
//               /* AUTO-CLOSE OTHERS ON FOCUS */
//               onFocus={() => {
//                 setSkillFocused(true);
//                 setShowSkillDrop(false);
//                 setShowAssetDrop(false);
//               }} 
//               onChange={(e) => {
//                 setDeptSearch(e.target.value);
//                 setFormData({ ...formData, department: e.target.value });
//               }}
//               className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all outline-none"
//             />
//             <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${skillFocused ? 'rotate-180' : ''}`} />
//           </div>

//           {skillFocused && (
//             <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="max-h-60 overflow-y-auto no-scrollbar">
//                 {filteredDepartments.length > 0 ? (
//                   filteredDepartments.map((d) => (
//                     <div
//                       key={d.id}
//                       onMouseDown={(ev) => {
//                         ev.preventDefault();
//                         setFormData({ ...formData, department: d.name });
//                         setDeptSearch("");
//                         setSkillFocused(false);
//                       }}
//                       className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-none"
//                     >
//                       {d.name}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-4 text-xs font-bold text-slate-400 italic bg-slate-50/50">Department not found</div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </FormField>
//     </div>

//     <div className="flex justify-between pt-8 border-t border-slate-50">
//       <button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm">
//         ← Back
//       </button>
//       <button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-100 transition-all active:scale-95">
//         Next Phase →
//       </button>
//     </div>
//   </div>
// )}

//             {/* STEP 5: INVENTORY */}
//             {/* {step === 5 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
//                 <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-sm overflow-visible">
//                   <div className="bg-slate-50/50 px-10 py-5 border-b border-slate-200 flex items-center gap-4 rounded-t-[3.5rem]"><Cpu size={24} className="text-blue-600" /><h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Stack & Asset Registry</h3></div>
//                   <div className="p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16 overflow-visible">
//                      <FormField label="Technical Expertise">
//                         <div className="space-y-6 relative overflow-visible">
//                            <div className="flex flex-wrap gap-2 min-h-[44px] p-5 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 shadow-inner">{formData.skills.map((s, i) => <span key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-blue-600/20">{s}<X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setFormData({...formData, skills: formData.skills.filter((_, idx) => idx !== i)})} /></span>)}{formData.skills.length === 0 && <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">No selection mapped</span>}</div>
//                            <div className="relative overflow-visible"><input value={skillInput} onFocus={() => {setShowSkillDrop(true); setShowAssetDrop(false);}} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); const v = skillInput.trim(); if(v && !formData.skills.includes(v)) setFormData({...formData, skills: [...formData.skills, v]}); setSkillInput(""); setShowSkillDrop(false); } }} placeholder="Add skill & Enter..." className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 shadow-sm" />
//                            {showSkillDrop && filteredSkills.length > 0 && <div className="absolute z-[200] w-full mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-52 overflow-y-auto no-scrollbar">{filteredSkills.map((s, i) => <div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({...formData, skills: [...formData.skills, s]}); setSkillInput(""); setShowSkillDrop(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center">{s}<Plus size={16} className="text-blue-500 opacity-40" /></div>)}</div>}</div>
//                         </div>
//                      </FormField>
//                      <FormField label="Hardware Matrix">
//                         <div className="space-y-6 relative overflow-visible">
//                            <div className="flex flex-wrap gap-2 min-h-[44px] p-5 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 shadow-inner">{formData.assets.map((a, i) => <span key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-slate-900/40">{a}<X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setFormData({...formData, assets: formData.assets.filter((_, idx) => idx !== i)})} /></span>)}{formData.assets.length === 0 && <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">No hardware assigned</span>}</div>
//                            <div className="relative overflow-visible"><input value={assetInput} onFocus={() => {setShowAssetDrop(true); setShowSkillDrop(false);}} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); setShowAssetDrop(false); } }} placeholder="Assign asset..." className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-slate-900 shadow-sm" />
//                            {showAssetDrop && filteredAssets.length > 0 && <div className="absolute z-[200] w-full mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-52 overflow-y-auto no-scrollbar">{filteredAssets.map((a, i) => <div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({...formData, assets: [...formData.assets, a]}); setAssetInput(""); setShowAssetDrop(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center">{a}<Plus size={16} className="text-slate-400 opacity-40" /></div>)}</div>}</div>
//                         </div>
//                      </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-4"><button onClick={() => setStep(4)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase hover:text-slate-900">← Back</button><button onClick={() => setStep(6)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-100 transition-all active:scale-95">Vault Access →</button></div>
//               </div>
//             )} */}
//             {/* STEP 5: STACK & ASSETS INVENTORY (ENTERPRISE CHIP CLOUD DESIGN) */}
// {step === 5 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
//     <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl shadow-slate-200/50 overflow-visible">
//       {/* Section Header */}
//       <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <Cpu size={20} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inventory & Expertise</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Select applicable technical skills and physical assets</p>
//           </div>
//         </div>
//       </div>

//       <div className="p-8 md:p-12 space-y-12 overflow-visible">
//         {/* TECHNICAL SKILLS CLOUD */}
//         <div className="space-y-6">
//           {/* <FormField label="Technical Expertise Matrix">
//             <div className="space-y-6">
          
//               <div className="relative max-w-md">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Plus size={16} />
//                 </div>
//                 <input 
//                   value={skillInput} 
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       const v = skillInput.trim();
//                       if(v && !formData.skills.includes(v)) setFormData({...formData, skills: [...formData.skills, v]});
//                       setSkillInput("");
//                     }
//                   }}
//                   placeholder="Type a skill and press Enter..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//                 />
//               </div>

             
//               <div className="flex flex-wrap gap-3 p-1">
//                 {SKILL_OPTIONS.map((skill) => {
//                   const isSelected = formData.skills.includes(skill);
//                   return (
//                     <button
//                       key={skill}
//                       type="button"
//                       onClick={() => {
//                         const updated = isSelected 
//                           ? formData.skills.filter(s => s !== skill)
//                           : [...formData.skills, skill];
//                         setFormData({...formData, skills: updated});
//                       }}
//                       className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                         ${isSelected 
//                           ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
//                           : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30"}`}
//                     >
//                       {skill}
//                       {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
//                     </button>
//                   );
//                 })}
               
//                 {formData.skills.filter(s => !SKILL_OPTIONS.includes(s)).map((customSkill) => (
//                    <button
//                     key={customSkill}
//                     type="button"
//                     onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== customSkill)})}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 border-2 border-blue-600 text-white shadow-lg shadow-blue-200 active:scale-90"
//                   >
//                     {customSkill}
//                     <Check size={14} strokeWidth={3} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </FormField> */}

//         <FormField label="Technical Expertise Matrix">
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row gap-4 items-end">
//               <div className="relative max-w-md w-full">
//                 <Plus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input 
//                   value={skillInput} 
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       handleManualAddSkill();
//                     }
//                   }}
//                   placeholder="Type new skill..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 shadow-inner transition-all"
//                 />
//               </div>
              
//               <button 
//                 type="button" 
//                 onClick={handleManualAddSkill}
//                 className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg"
//               >
//                 <Database size={14} /> {skillInput.trim() ? "Register & Add" : "Sync Registry"}
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-3 p-1">
//               {dynamicSkills.map((skill) => {
//                 const isSelected = formData.skills.includes(skill);
//                 return (
//                   <button
//                     key={skill}
//                     type="button"
//                     onClick={() => {
//                       const updated = isSelected 
//                         ? formData.skills.filter(s => s !== skill)
//                         : [...formData.skills, skill];
//                       setFormData({...formData, skills: updated});
//                     }}
//                     className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                       ${isSelected 
//                         ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
//                         : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30"}`}
//                   >
//                     {skill}
//                     {isSelected && <Check size={14} strokeWidth={3} />}
//                   </button>
//                 );
//               })}
//               {dynamicSkills.length === 0 && <p className="text-[10px] font-bold text-slate-300 italic uppercase">Initializing Registry...</p>}
//             </div>
//           </div>
//         </FormField>
//         </div>

//         {/* ASSET ALLOCATION CLOUD */}
//         <div className="space-y-6 pt-8 border-t border-slate-100">
//           <FormField label="Enterprise Hardware Matrix">
//             <div className="space-y-6">
//               {/* Search & Manual Add Input */}
//               <div className="relative max-w-md">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Layers size={16} />
//                 </div>
//                 <input 
//                   value={assetInput} 
//                   onChange={(e) => setAssetInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       const v = assetInput.trim();
//                       if(v && !formData.assets.includes(v)) setFormData({...formData, assets: [...formData.assets, v]});
//                       setAssetInput("");
//                     }
//                   }}
//                   placeholder="Assign other hardware..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//                 />
//               </div>

//               {/* Asset Cloud (Matches Reference Design) */}
//               <div className="flex flex-wrap gap-3 p-1">
//                 {ASSET_OPTIONS.map((asset) => {
//                   const isSelected = formData.assets.includes(asset);
//                   return (
//                     <button
//                       key={asset}
//                       type="button"
//                       onClick={() => {
//                         const updated = isSelected 
//                           ? formData.assets.filter(a => a !== asset)
//                           : [...formData.assets, asset];
//                         setFormData({...formData, assets: updated});
//                       }}
//                       className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                         ${isSelected 
//                           ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
//                           : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"}`}
//                     >
//                       {asset}
//                       {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
//                     </button>
//                   );
//                 })}
//                 {/* Dynamically added custom assets */}
//                 {formData.assets.filter(a => !ASSET_OPTIONS.includes(a)).map((customAsset) => (
//                    <button
//                     key={customAsset}
//                     type="button"
//                     onClick={() => setFormData({...formData, assets: formData.assets.filter(a => a !== customAsset)})}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-900 border-2 border-slate-900 text-white shadow-lg active:scale-90"
//                   >
//                     {customAsset}
//                     <Check size={14} strokeWidth={3} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </FormField>
//         </div>
//       </div>
//     </div>

//     {/* NAVIGATION ACTIONS */}
//     <div className="flex justify-between items-center pt-4">
//       <button 
//         onClick={() => setStep(4)} 
//         type="button" 
//         className="flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16}/> Previous Phase
//       </button>
//       <button 
//         onClick={() => setStep(6)} 
//         type="button" 
//         className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
//       >
//         Vault Registry <ChevronRight size={16}/>
//       </button>
//     </div>
//   </div>
// )}

//             {/* STEP 6: DOCUMENT VAULT (FULL RESTORE) */}
//             {/* {step === 6 && (
//               <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
//                 <div className="bg-[#0F172A] p-10 md:p-16 rounded-[4rem] shadow-2xl border border-white/5 space-y-12 overflow-hidden relative">
//                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 scale-150"><ShieldCheck size={200} /></div>
//                   <div className="flex items-center gap-5 pb-8 border-b border-white/5 relative z-10">
//                     <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-pulse"><ShieldCheck size={28} className="text-white" /></div>
//                     <div><h3 className="text-xl font-black text-white uppercase tracking-widest">Registry Artifacts</h3><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Verification Matrix</p></div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
              
//                     <div className="space-y-8">
//                       <div className="flex justify-between items-center"><p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">1. Master Resume</p>
//                         <div className="flex bg-white/5 p-1 rounded-xl border border-white/10"><button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>PDF</button><button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>URL</button></div>
//                       </div>
//                       {resumeMode === 'file' ? (<label className="block p-12 border-2 border-dashed border-white/10 rounded-[3rem] hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center"><FileUp size={40} className="mx-auto text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-500" /><p className="text-xs font-bold text-slate-300 uppercase tracking-widest truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select PDF Document"}</p><input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} /></label>) : <input placeholder="Paste Cloud Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-blue-500 transition-all shadow-2xl" />}
//                     </div>

             
//                     <div className="space-y-8">
//                       <div className="flex justify-between items-center"><p className="text-[11px] font-black text-purple-400 uppercase tracking-widest">2. Exp. Letter</p>
//                         <div className="flex bg-white/5 p-1 rounded-xl border border-white/10"><button type="button" onClick={() => setExpLetterMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'file' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>PDF</button><button type="button" onClick={() => setExpLetterMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'link' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>URL</button></div>
//                       </div>
//                       {expLetterMode === 'file' ? (<label className="block p-12 border-2 border-dashed border-white/10 rounded-[3rem] hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center"><FileUp size={40} className="mx-auto text-purple-400 mb-5 group-hover:scale-110 transition-transform duration-500" /><p className="text-xs font-bold text-slate-300 uppercase tracking-widest truncate px-4">{formData.expLetterFile ? formData.expLetterFile.name : "Select PDF Document"}</p><input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} /></label>) : <input placeholder="Paste Cloud Storage Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-purple-500 transition-all shadow-2xl" />}
//                     </div>
//                   </div>

                 
//                   <div className="pt-8 border-t border-white/5 space-y-8 relative z-10">
//                      <div className="flex justify-between items-center mb-2"><p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">3. Credentials Matrix</p><div className="flex gap-4">
//                         <label className="cursor-pointer h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500/30 border border-emerald-500/20 active:scale-90 transition-all flex items-center justify-center shadow-lg"><FileUp size={20}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})}/></label>
//                         <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 active:scale-90 flex items-center justify-center shadow-lg"><LinkIcon size={20}/></button>
//                      </div></div>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
//                        {formData.certificateFiles.map((file, idx) => (<div key={idx} className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5 text-xs text-slate-300 font-bold animate-in zoom-in-95"><div className="flex items-center gap-4 truncate max-w-[85%]"><div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" /> {file.name}</div><X size={20} className="text-red-400 cursor-pointer hover:rotate-90 transition-transform" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})}/></div>))}
//                        {formData.certificateLinks.map((link, idx) => (<div key={idx} className="flex gap-4 animate-in slide-in-from-right-4"><div className="relative flex-1"><Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40" /><input value={link} placeholder="Public URI" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-6 py-5 text-sm text-white outline-none focus:border-emerald-500 shadow-xl transition-all" /></div><button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-red-400 bg-red-500/5 hover:bg-red-500/10 h-16 w-16 rounded-[2rem] transition-all flex items-center justify-center shadow-inner"><Trash2 size={24}/></button></div>))}
//                      </div>
//                   </div>

                  
//                   <div className="pt-16 border-t border-white/5 flex flex-col items-center gap-8 relative z-10">
//                     <button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-[3rem] transition-all shadow-[0_25px_60px_rgba(37,99,235,0.5)] active:scale-[0.98] text-sm tracking-widest uppercase disabled:opacity-50">
//                       {loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} strokeWidth={2.5}/><span>Finalize & Synchronize Profile</span></>}
//                     </button>
//                     <button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"><ChevronLeft size={16}/> Return to Previous Module</button>
//                   </div>
//                 </div>
//               </div>
//             )} */}

//             {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
// {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
// {step === 6 && (
//   <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
//     {/* Unified White Enterprise Card */}
//     <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-xl shadow-slate-200/60 border border-slate-200 space-y-12 overflow-hidden relative">
      
//       {/* Subtle Background Branding Accent */}
//       <div className="absolute top-0 right-0 p-12 text-slate-100 opacity-40 pointer-events-none rotate-12 scale-150">
//         <ShieldCheck size={240} />
//       </div>

//       {/* Vault Header */}
//       <div className="flex items-center gap-5 pb-8 border-b border-slate-100 relative z-10">
//         <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
//           <ShieldCheck size={28} className="text-white" />
//         </div>
//         <div>
//           <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Registry Artifacts</h3>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Document Verification Matrix</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
//         {/* 1. MASTER RESUME */}
//         <div className="space-y-8 p-1">
//           <div className="flex justify-between items-center">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 1. Master Resume
//             </p>
//             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
//               <button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
//             </div>
//           </div>
//           {resumeMode === 'file' ? (
//             <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-blue-500 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
//               <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-5 group-hover:scale-110 transition-all duration-500" />
//               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select Resume PDF"}</p>
//               <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} />
//             </label>
//           ) : (
//             <input placeholder="Enter Public Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5" />
//           )}
//         </div>

//         {/* 2. EXPERIENCE LETTER */}
//         <div className="space-y-8 p-1">
//           <div className="flex justify-between items-center">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> 2. Exp. Letter
//             </p>
//             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => setExpLetterMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
//               <button type="button" onClick={() => setExpLetterMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
//             </div>
//           </div>
//           {expLetterMode === 'file' ? (
//             <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
//               <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-slate-900 mb-5 group-hover:scale-110 transition-all duration-500" />
//               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.expLetterFile ? formData.expLetterFile.name : "Select Exp. PDF"}</p>
//               <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} />
//             </label>
//           ) : (
//             <input placeholder="Enter Public Exp. Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-slate-900 transition-all shadow-sm focus:ring-4 focus:ring-slate-900/5" />
//           )}
//         </div>
//       </div>

//       {/* 3. CERTIFICATIONS */}
//       <div className="pt-8 border-t border-slate-100 space-y-8 relative z-10">
//          <div className="flex justify-between items-center mb-2">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 3. Credentials Matrix
//             </p>
//             <div className="flex gap-4">
//               <label className="cursor-pointer h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 transition-all flex items-center justify-center shadow-sm">
//                 <FileUp size={20}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})}/>
//               </label>
//               <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 flex items-center justify-center shadow-sm">
//                 <LinkIcon size={20}/>
//               </button>
//             </div>
//          </div>
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
//            {formData.certificateFiles.map((file, idx) => (
//               <div key={idx} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-xs text-slate-900 font-bold animate-in zoom-in-95 hover:border-emerald-200 transition-colors shadow-sm">
//                 <div className="flex items-center gap-4 truncate max-w-[85%]">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> 
//                   {file.name}
//                 </div>
//                 <X size={20} className="text-slate-300 hover:text-red-500 cursor-pointer transition-all hover:rotate-90" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})}/>
//               </div>
//            ))}
//            {formData.certificateLinks.map((link, idx) => (
//               <div key={idx} className="flex gap-4 animate-in slide-in-from-right-4">
//                 <div className="relative flex-1">
//                   <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
//                   <input value={link} placeholder="Credential Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-sm" />
//                 </div>
//                 <button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-red-500 bg-white h-16 w-16 rounded-[2rem] border border-slate-200 transition-all flex items-center justify-center shadow-sm">
//                   <Trash2 size={24}/>
//                 </button>
//               </div>
//            ))}
//          </div>
//       </div>

//       {/* FINAL SUBMIT BUTTONS */}
//       <div className="pt-16 border-t border-slate-100 flex flex-col items-center gap-8 relative z-10">
//         <button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[3rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] text-sm tracking-widest uppercase disabled:opacity-50">
//           {loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} strokeWidth={2.5}/><span>Submit all Profile</span></>}
//         </button>
//         <button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
//           <ChevronLeft size={16}/> Return to Previous Module
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//***************************************************working code phase 33 17/02/26********************************************************* */
// import React, { useState, useEffect } from "react";
// import {
//   Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
//   Loader2, Plus, Trash2, Layers, Cpu, ExternalLink, Database,
//   Globe, ShieldCheck, History, X, LinkIcon, FileUp, ChevronRight, ChevronLeft,ChevronDown
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between items-center">
//       <span>{label}</span>
//       <span className={`font-bold normal-case ${required ? "text-red-500" : "text-slate-300"}`}>
//         {required ? "Required" : "Optional"}
//       </span>
//     </label>
//     {children}
//     {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
//   </div>
// );

// const ManualEntryPage = () => {
//   // 1. INITIALIZE ALL STATES FIRST
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [isFresher, setIsFresher] = useState(null); // null = unselected, true = yes, false = no
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState(""); // Variable now initialized before use
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [assetFocused, setAssetFocused] = useState(false);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", address: "", address1: "", address2: "", location: "",
//     pincode: "", state: "", city: "", district: "", country: "India", position: "",
//     education: "", gender: "", dob: "", experience: "", about_me: "",
//     languages_spoken: [], skills: [], assets: [], department: "",
//     cvFile: null, resume_link: "", expLetterFile: null,
//     experience_letter_link: "", certificateFiles: [], certificateLinks: [""], experiences: [],
//   });

//   // 2. STATIC DATA & FILTER LOGIC (Now safe to use state variables)
//   const totalSteps = 6;
//   const SKILL_OPTIONS = ["React", "JavaScript", "Node.js", "MongoDB", "MySQL", "HTML", "CSS", "Tailwind", "Python", "Java", "AWS", "Docker"];
//   const ASSET_OPTIONS = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Mobile", "ID Card", "SIM Card"];
//   const POSITION_OPTIONS = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Executive", "UI/UX Designer", "DevOps Engineer", "Data Analyst"];
//   const educationOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "Diploma", "PhD"];

//   const filteredSkills = SKILL_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s));
//   const filteredAssets = ASSET_OPTIONS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()) && !formData.assets.includes(a));
//   const filteredDepartments = departments.filter(d => (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()));
//   const filteredEducation = educationOptions.filter(e => e.toLowerCase().includes(eduSearch.toLowerCase()));

//   const isStep1Valid = formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && /^[6-9]\d{9}$/.test(formData.phone);

//   // 3. EFFECTS
//   useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

//   useEffect(() => {
//     const loadDepartments = async () => {
//       try { const data = await departmentService.getAll(); setDepartments(data || []); }
//       catch (err) { toast.error("Failed to load departments"); }
//     };
//     loadDepartments();
//   }, []);

//   // 4. HANDLERS
//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value) error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";
//     setErrors(prev => ({ ...prev, [field]: error }));
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         const cities = offices.map(o => o.Name);
//         setCityOptions(cities);
//         setFormData(prev => ({ ...prev, city: cities.length === 1 ? cities[0] : "", state: offices[0].State, district: offices[0].District, country: offices[0].Country }));
//       }
//     } catch { toast.error("Lookup failed"); }
//     finally { setIsFetchingPincode(false); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateField("name", formData.name) || !validateField("email", formData.email) || !validateField("phone", formData.phone)) {
//       toast.error("Please fill required fields");
//       return;
//     }
//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "expLetterFile", "certificateLinks", "skills", "assets"].includes(key)) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       formDataApi.append("full_name", formData.name);
//       formDataApi.append("languages_spoken", JSON.stringify(formData.languages_spoken));
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));
//       formDataApi.append("skills", JSON.stringify(formData.skills));
//       formDataApi.append("assets", JSON.stringify(formData.assets));
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);
//       formData.certificateFiles.forEach(file => formDataApi.append("certificate_files[]", file));
//       formData.certificateLinks.filter(l => String(l).startsWith("http")).forEach(link => formDataApi.append("certificate_links", link));
      
//       await candidateService.createCandidate(formDataApi);
//       toast.success("Profile committed successfully 🎉");
//     } catch (err) { toast.error("Commit failed"); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* HEADER */}
//         {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-6">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//               <Database size={32} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//               <div className="flex items-center gap-2 mt-1 text-blue-600">
//                 <ShieldCheck size={14} />
//                 <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-w-[240px]">
//             <div className="flex justify-between mb-2 text-[9px] font-black uppercase text-slate-400">
//               <span>Step {step} of {totalSteps}</span>
//               <span>{Math.round((step / totalSteps) * 100)}%</span>
//             </div>
//             <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"><div className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
//           </div>
//         </div> */}
//         {/* <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">

//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//       <div className="flex items-center gap-2 mt-1 text-blue-600">
//         <ShieldCheck size={14} />
//         <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//       </div>
//     </div>
//   </div>


//   <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">

//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
      
 
//       <div 
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {[1, 2, 3, 4, 5, 6].map((num) => (
//         <div key={num} className="relative z-10 flex flex-col items-center gap-2">
      
//           <div 
//             className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               ${step === num 
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num 
//                 ? "bg-emerald-500 text-white border-emerald-50" 
//                 : "bg-white text-slate-300 border-slate-50"}`}
//           >
//             {step > num ? <Check size={14} strokeWidth={4} /> : num}
//           </div>
          
         
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300
//             ${step === num ? "text-blue-600" : step > num ? "text-emerald-600" : "text-slate-300"}`}>
//             {num === 1 && "Personal details"}
//             {num === 2 && "Location"}
//             {num === 3 && "Experience"}
//             {num === 4 && "Carrer"}
//             {num === 5 && "Asset & Skill"}
//             {num === 6 && "Document"}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>

  
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</p>
//       <p className="text-sm font-black text-slate-900 leading-none mt-1">{Math.round((step / totalSteps) * 100)}%</p>
//     </div>
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
//        {step === 6 ? <Check size={18} strokeWidth={3} /> : <Loader2 size={18} className="animate-spin" />}
//     </div>
//   </div>
// </div> */}

//         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//   {/* Left: Branding */}
//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manual Registry</h2>
//       <div className="flex items-center gap-2 mt-1 text-blue-600">
//         <ShieldCheck size={14} />
//         <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Secured</p>
//       </div>
//     </div>
//   </div>

//   {/* Right: Professional Roadmap */}
//   <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">
//       {/* Background Connecting Line */}
//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
      
//       {/* Active Progress Line */}
//       <div 
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {/* Roadmap Steps */}
//       {[1, 2, 3, 4, 5, 6].map((num) => (
//         <div key={num} className="relative z-10 flex flex-col items-center gap-2">
//           {/* Step Circle */}
//           <div 
//             className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               ${step === num 
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num 
//                 ? "bg-emerald-500 text-white border-emerald-50" 
//                 : "bg-white text-slate-300 border-slate-50"}`}
//           >
//             {step > num ? <Check size={14} strokeWidth={4} /> : num}
//           </div>
          
//           {/* Step Label (Hidden on small mobile, visible on tablet+) */}
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors duration-300
//             ${step === num ? "text-blue-600" : step > num ? "text-emerald-600" : "text-slate-300"}`}>
//             {num === 1 && "Personal details"}
//             {num === 2 && "Location"}
//             {num === 3 && "Experience"}
//             {num === 4 && "Carrer"}
//             {num === 5 && "Asset & Skill"}
//             {num === 6 && "Document"}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Progress Percentage Badge */}
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Completion</p>
//       <p className="text-sm font-black text-slate-900 leading-none mt-1">{Math.round((step / totalSteps) * 100)}%</p>
//     </div>
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
//        {step === 6 ? <Check size={18} strokeWidth={3} /> : <Loader2 size={18} className="animate-spin" />}
//     </div>
//   </div>
// </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1">
//           <div className="space-y-12">

//             {/* STEP 1: IDENTITY */}
//             {step === 1 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><User size={18} className="text-blue-600" /><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identification</h3></div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <FormField label="Full Name" required error={errors.name}><input placeholder="Legal Name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); validateField("name", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
//                   <FormField label="Email Address" required error={errors.email}><input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateField("email", e.target.value); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm" /></FormField>
//                   <FormField label="Phone Number" required error={errors.phone}><div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm"><span className="px-5 text-[11px] font-black text-slate-400 border-r border-slate-100">+91</span><input maxLength={10} value={formData.phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, phone: v }); validateField("phone", v); }} className="w-full px-5 py-4 bg-transparent text-sm font-bold outline-none" /></div></FormField>
//                   <FormField label="Gender Selection"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></FormField>
//                   <FormField label="Date of Birth"><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" /></FormField>
//                   <FormField label="Languages"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-h-40 overflow-y-auto grid grid-cols-2 gap-4 shadow-inner">{["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"].map(lang => (<label key={lang} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 cursor-pointer hover:text-blue-600"><input type="checkbox" checked={formData.languages_spoken.includes(lang)} onChange={() => { const u = formData.languages_spoken.includes(lang) ? formData.languages_spoken.filter(l => l !== lang) : [...formData.languages_spoken, lang]; setFormData({ ...formData, languages_spoken: u }); }} className="w-4 h-4 accent-blue-600" /> {lang}</label>))}</div></FormField>
//                 </div>
//                 <FormField label="Profile Bio"><textarea rows={4} placeholder="Brief summary..." value={formData.about_me} onChange={(e) => setFormData({ ...formData, about_me: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none resize-none shadow-sm" /></FormField>
//                 <div className="flex justify-end pt-4"><button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)} className={`flex items-center gap-3 px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isStep1Valid ? "bg-blue-600 text-white shadow-blue-600/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>Next Phase <ChevronRight size={16}/></button></div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><MapPin size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Geolocation Registry</h3></div>
//                 <div className="space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Address line 1" required><input placeholder="Building/Flat/Street" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
//                     <FormField label="Address line 2" required><input placeholder="Landmark/Locality" value={formData.address2} onChange={(e) => setFormData({...formData, address2: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" /></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Location/Area Hub" required><input placeholder="City Hub/Area" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" /></FormField>
//                     <FormField label="Pincode Mapping" required><div className="relative"><input maxLength={6} placeholder="000000" value={formData.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, pincode: v }); if (v.length === 6) fetchPincodeDetails(v); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500" />{isFetchingPincode && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />}</div></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     {/* <FormField label="City">{cityOptions.length > 1 ? (<select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold appearance-none">{cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}</select>) : <input value={formData.city} readOnly placeholder="System Identified" className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" />}</FormField> */}
//                     {/* CITY SELECTION */}
//   <FormField label="City">
//     <div className="relative group">
//       {cityOptions.length > 1 ? (
//         <>
//           <select 
//             value={formData.city} 
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
//             className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
//           >
//             <option value="">Select City</option>
//             {cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}
//           </select>
//           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//             <ChevronDown size={16} />
//           </div>
//         </>
//       ) : (
//         <input 
//           value={formData.city} 
//           readOnly 
//           placeholder="Auto-filled" 
//           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner cursor-not-allowed" 
//         />
//       )}
//     </div>
//   </FormField>
//                     <FormField label="District"><input value={formData.district} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
//                     <FormField label="State"><input value={formData.state} readOnly className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 shadow-inner" /></FormField>
//                     {/* ADDED COUNTRY FIELD */}
//       <FormField label="Country">
//         <input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="India" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
//       </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(1)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all"><ChevronLeft size={16} className="inline mr-2"/> Back</button><button onClick={() => setStep(3)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl active:scale-95 transition-all">Continue →</button></div>
//               </div>
//             )}

//             {/* STEP 3: EMPLOYMENT */}
//             {/* {step === 3 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10 border border-white/5">
//                   <div className="flex justify-between items-center border-b border-white/10 pb-8 text-white">
//                     <div className="flex items-center gap-4"><History size={28}/><h3 className="text-sm font-black uppercase tracking-widest leading-none">Career Timeline</h3></div>
//                     <button type="button" onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95">+ Add Organization</button>
//                   </div>
//                   <div className="space-y-10 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
//                     {formData.experiences.map((exp, i) => (
//                       <div key={i} className="relative bg-white/[0.04] border border-white/10 p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white/[0.08] animate-in zoom-in-95">
//                         <button type="button" onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} className="absolute -top-3 -right-3 h-12 w-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                           <input placeholder="Employer / Organization" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-b border-white/10 px-2 py-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
//                           <input placeholder="Role / Job Title" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-b border-white/10 px-2 py-4 text-sm font-bold text-white outline-none focus:border-blue-500" />
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Joined</p><input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Departure</p><input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Annual CTC</p><input placeholder="₹" type="number" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                            <div className="space-y-2"><p className="text-[9px] font-black text-slate-500 uppercase ml-1">Work City</p><input placeholder="Office Loc." value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-xl p-3 text-[11px] font-bold text-white shadow-inner" /></div>
//                         </div>
//                         <textarea placeholder="Job scope responsibilities..." rows={3} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-6 text-[12px] font-medium text-slate-300 outline-none focus:bg-white/10" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-4"><button onClick={() => setStep(2)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase">← Back</button><button onClick={() => setStep(4)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-600/20">Next Phase →</button></div>
//               </div>
//             )} */}

//             {/* STEP 3: EMPLOYMENT HISTORY (REFINED ENTERPRISE UI) */}
// {/* STEP 3: EMPLOYMENT HISTORY - ENTERPRISE ALIGNED DESIGN */}
// {/* {step === 3 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//     <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10">
      
    
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <History size={20} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
//           </div>
//         </div>
        
//         <button 
//           type="button" 
//           onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} 
//           className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
//         >
//           <Plus size={14} strokeWidth={3} /> Add Organization
//         </button>
//       </div>

   
//       <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//         {formData.experiences.map((exp, i) => (
//           <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95">
            
         
//             <button 
//               type="button" 
//               onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//               className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//             >
//               <Trash2 size={18} />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//               <FormField label="Employer / Organization">
//                 <input 
//                   placeholder="e.g. Google India" 
//                   value={exp.company_name} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                 />
//               </FormField>
//               <FormField label="Professional Designation">
//                 <input 
//                   placeholder="e.g. Senior Product Designer" 
//                   value={exp.job_title} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                 />
//               </FormField>
//             </div>

          
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                <FormField label="Start Date">
//                  <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                </FormField>
//                <FormField label="End Date">
//                  <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                </FormField>
//                <FormField label="Annual CTC">
//                  <div className="relative">
//                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//                    <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </div>
//                </FormField>
//                <FormField label="Office City">
//                  <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                </FormField>
//             </div>

            
//             <FormField label="Core Responsibilities & Achievements">
//               <textarea 
//                 placeholder="Briefly describe your impact and scope..." 
//                 rows={3} 
//                 value={exp.description} 
//                 onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                 className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none" 
//               />
//             </FormField>
//           </div>
//         ))}

//         {formData.experiences.length === 0 && (
//           <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] animate-in fade-in duration-700">
//             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm mb-4">
//               <Briefcase size={32} />
//             </div>
//             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Employment Records Detected</p>
//             <p className="text-[10px] font-bold text-slate-300 normal-case mt-1">Click the button above to add your previous work experience.</p>
//           </div>
//         )}
//       </div>
//     </div>

    
//     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
//       <button 
//         onClick={() => setStep(2)} 
//         type="button" 
//         className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16} className="inline mr-2" /> Back
//       </button>
//       <button 
//         onClick={() => setStep(4)} 
//         type="button" 
//         className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95"
//       >
//         Next Phase →
//       </button>
//     </div>

   
//     <style dangerouslySetInnerHTML={{ __html: `
//       .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//     `}} />
//   </div>
// )} */}


// {/* STEP 3: EMPLOYMENT HISTORY - ENTERPRISE ALIGNED DESIGN */}
// {step === 3 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
    
//     {/* NEW: FRESHER SELECTION CARD */}
//     <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all overflow-hidden">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//             <Briefcase size={24} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Are you a Fresher?</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Select your current career status</p>
//           </div>
//         </div>

//         <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//           <button 
//             type="button"
//             onClick={() => {
//                 setIsFresher(true);
//                 setFormData({ ...formData, experiences: [] }); // Clear experiences if fresher
//             }}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             Yes, I am
//           </button>
//           <button 
//             type="button"
//             onClick={() => setIsFresher(false)}
//             className={`flex-1 md:flex-none px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             No, Experienced
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* CONDITIONAL UI: SHOW ONLY IF NOT A FRESHER */}
//     {isFresher === false && (
//       <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 animate-in fade-in zoom-in-95 duration-500">
        
//         {/* Header with Professional Blue Accent */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//               <History size={20} />
//             </div>
//             <div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Career Timeline</h3>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Employment History & Milestones</p>
//             </div>
//           </div>
          
//           <button 
//             type="button" 
//             onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} 
//             className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
//           >
//             <Plus size={14} strokeWidth={3} /> Add Organization
//           </button>
//         </div>

//         {/* Experience List - Fixed Scrollbar Logic */}
//         <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar-professional">
//           {formData.experiences.map((exp, i) => (
//             <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-6 md:p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 animate-in zoom-in-95">
              
//               <button 
//                 type="button" 
//                 onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} 
//                 className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-20"
//               >
//                 <Trash2 size={18} />
//               </button>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                 <FormField label="Employer / Organization">
//                   <input 
//                     placeholder="e.g. Google India" 
//                     value={exp.company_name} 
//                     onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                   />
//                 </FormField>
//                 <FormField label="Professional Designation">
//                   <input 
//                     placeholder="e.g. Senior Product Designer" 
//                     value={exp.job_title} 
//                     onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" 
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                  <FormField label="Start Date">
//                    <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//                  <FormField label="End Date">
//                    <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//                  <FormField label="Annual CTC">
//                    <div className="relative">
//                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
//                      <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full pl-7 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                    </div>
//                  </FormField>
//                  <FormField label="Office City">
//                    <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:border-blue-500 shadow-inner" />
//                  </FormField>
//               </div>

//               <FormField label="Core Responsibilities & Achievements">
//                 <textarea 
//                   placeholder="Briefly describe your impact and scope..." 
//                   rows={3} 
//                   value={exp.description} 
//                   onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} 
//                   className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-5 text-[11px] font-medium text-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm resize-none" 
//                 />
//               </FormField>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}

//     {/* EMPTY STATE FOR FRESHER YES */}
//     {isFresher === true && (
//        <div className="text-center py-20 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[3rem] animate-in fade-in duration-700">
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-400 shadow-sm mb-4 border border-blue-100">
//             <Award size={32} />
//           </div>
//           <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Entering as a Professional Fresher</p>
//           <p className="text-[10px] font-bold text-slate-400 normal-case mt-1">We will skip the employment history for your profile. Click next to proceed.</p>
//        </div>
//     )}

//     {/* NAVIGATION BUTTONS */}
//     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
//       <button 
//         onClick={() => setStep(2)} 
//         type="button" 
//         className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16} className="inline mr-2" /> Back
//       </button>
//       <button 
//         onClick={() => setStep(4)} 
//         type="button"
//         disabled={isFresher === null} // Prevent proceeding until choice is made
//         className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
//       >
//         Next Phase →
//       </button>
//     </div>

//     {/* CSS Styles... same as before */}
//     <style dangerouslySetInnerHTML={{ __html: `
//       .custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//     `}} />
//   </div>
// )}



//             {/* STEP 4: QUANTS */}
//             {step === 4 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-12 animate-in slide-in-from-right-8">
//                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100"><Award size={20} className="text-blue-600" /><h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Context Registry</h3></div>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                     <FormField label="Assigned Position"><input list="pos-opts" placeholder="Search role..." value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 shadow-sm transition-all" /><datalist id="pos-opts">{POSITION_OPTIONS.map((p, i) => <option key={i} value={p}/>)}</datalist></FormField>
//                     <FormField label="Seniority Level (Years)"><input type="number" placeholder="Total Experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none shadow-sm" /></FormField>
//                  </div>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                     <FormField label="Education Registry"><div className="relative"><input placeholder="Type degree..." value={formData.education} onChange={(e) => { setEduSearch(e.target.value); setFormData({...formData, education: e.target.value}); }} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white shadow-sm" />{eduSearch && filteredEducation.length > 0 && <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">{filteredEducation.map((e, i) => <div key={i} onClick={() => { setFormData({...formData, education: e}); setEduSearch(""); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 transition-colors last:border-none">{e}</div>)}</div>}</div></FormField>
//                     <FormField label="Business Department"><div className="relative"><input placeholder="Search dept..." value={formData.department} onChange={(e) => { setDeptSearch(e.target.value); setFormData({...formData, department: e.target.value}); }} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white shadow-sm" />{deptSearch && filteredDepartments.length > 0 && <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">{filteredDepartments.map((d) => <div key={d.id} onClick={() => { setFormData({...formData, department: d.name}); setDeptSearch(""); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none">{d.name}</div>)}</div>}</div></FormField>
//                  </div>
//                  <div className="flex justify-between pt-8 border-t border-slate-50"><button onClick={() => setStep(3)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase">← Back</button><button onClick={() => setStep(5)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-100">Next Phase →</button></div>
//               </div>
//             )}

//             {/* STEP 5: INVENTORY */}
//             {/* {step === 5 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
//                 <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-sm overflow-visible">
//                   <div className="bg-slate-50/50 px-10 py-5 border-b border-slate-200 flex items-center gap-4 rounded-t-[3.5rem]"><Cpu size={24} className="text-blue-600" /><h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Stack & Asset Registry</h3></div>
//                   <div className="p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16 overflow-visible">
//                      <FormField label="Technical Expertise">
//                         <div className="space-y-6 relative overflow-visible">
//                            <div className="flex flex-wrap gap-2 min-h-[44px] p-5 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 shadow-inner">{formData.skills.map((s, i) => <span key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-blue-600/20">{s}<X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setFormData({...formData, skills: formData.skills.filter((_, idx) => idx !== i)})} /></span>)}{formData.skills.length === 0 && <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">No selection mapped</span>}</div>
//                            <div className="relative overflow-visible"><input value={skillInput} onFocus={() => {setShowSkillDrop(true); setShowAssetDrop(false);}} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); const v = skillInput.trim(); if(v && !formData.skills.includes(v)) setFormData({...formData, skills: [...formData.skills, v]}); setSkillInput(""); setShowSkillDrop(false); } }} placeholder="Add skill & Enter..." className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 shadow-sm" />
//                            {showSkillDrop && filteredSkills.length > 0 && <div className="absolute z-[200] w-full mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-52 overflow-y-auto no-scrollbar">{filteredSkills.map((s, i) => <div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({...formData, skills: [...formData.skills, s]}); setSkillInput(""); setShowSkillDrop(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center">{s}<Plus size={16} className="text-blue-500 opacity-40" /></div>)}</div>}</div>
//                         </div>
//                      </FormField>
//                      <FormField label="Hardware Matrix">
//                         <div className="space-y-6 relative overflow-visible">
//                            <div className="flex flex-wrap gap-2 min-h-[44px] p-5 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 shadow-inner">{formData.assets.map((a, i) => <span key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-slate-900/40">{a}<X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setFormData({...formData, assets: formData.assets.filter((_, idx) => idx !== i)})} /></span>)}{formData.assets.length === 0 && <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">No hardware assigned</span>}</div>
//                            <div className="relative overflow-visible"><input value={assetInput} onFocus={() => {setShowAssetDrop(true); setShowSkillDrop(false);}} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); setShowAssetDrop(false); } }} placeholder="Assign asset..." className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-slate-900 shadow-sm" />
//                            {showAssetDrop && filteredAssets.length > 0 && <div className="absolute z-[200] w-full mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-52 overflow-y-auto no-scrollbar">{filteredAssets.map((a, i) => <div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({...formData, assets: [...formData.assets, a]}); setAssetInput(""); setShowAssetDrop(false); }} className="px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center">{a}<Plus size={16} className="text-slate-400 opacity-40" /></div>)}</div>}</div>
//                         </div>
//                      </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-4"><button onClick={() => setStep(4)} type="button" className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase hover:text-slate-900">← Back</button><button onClick={() => setStep(6)} type="button" className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-blue-100 transition-all active:scale-95">Vault Access →</button></div>
//               </div>
//             )} */}
//             {/* STEP 5: STACK & ASSETS INVENTORY (ENTERPRISE CHIP CLOUD DESIGN) */}
// {step === 5 && (
//   <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
//     <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl shadow-slate-200/50 overflow-visible">
//       {/* Section Header */}
//       <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <Cpu size={20} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inventory & Expertise</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Select applicable technical skills and physical assets</p>
//           </div>
//         </div>
//       </div>

//       <div className="p-8 md:p-12 space-y-12 overflow-visible">
//         {/* TECHNICAL SKILLS CLOUD */}
//         <div className="space-y-6">
//           <FormField label="Technical Expertise Matrix">
//             <div className="space-y-6">
//               {/* Search & Manual Add Input */}
//               <div className="relative max-w-md">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Plus size={16} />
//                 </div>
//                 <input 
//                   value={skillInput} 
//                   onChange={(e) => setSkillInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       const v = skillInput.trim();
//                       if(v && !formData.skills.includes(v)) setFormData({...formData, skills: [...formData.skills, v]});
//                       setSkillInput("");
//                     }
//                   }}
//                   placeholder="Type a skill and press Enter..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//                 />
//               </div>

//               {/* Chip Cloud (Matches Reference Design) */}
//               <div className="flex flex-wrap gap-3 p-1">
//                 {SKILL_OPTIONS.map((skill) => {
//                   const isSelected = formData.skills.includes(skill);
//                   return (
//                     <button
//                       key={skill}
//                       type="button"
//                       onClick={() => {
//                         const updated = isSelected 
//                           ? formData.skills.filter(s => s !== skill)
//                           : [...formData.skills, skill];
//                         setFormData({...formData, skills: updated});
//                       }}
//                       className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                         ${isSelected 
//                           ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
//                           : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30"}`}
//                     >
//                       {skill}
//                       {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
//                     </button>
//                   );
//                 })}
//                 {/* Dynamically added custom skills */}
//                 {formData.skills.filter(s => !SKILL_OPTIONS.includes(s)).map((customSkill) => (
//                    <button
//                     key={customSkill}
//                     type="button"
//                     onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== customSkill)})}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 border-2 border-blue-600 text-white shadow-lg shadow-blue-200 active:scale-90"
//                   >
//                     {customSkill}
//                     <Check size={14} strokeWidth={3} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </FormField>
//         </div>

//         {/* ASSET ALLOCATION CLOUD */}
//         <div className="space-y-6 pt-8 border-t border-slate-100">
//           <FormField label="Enterprise Hardware Matrix">
//             <div className="space-y-6">
//               {/* Search & Manual Add Input */}
//               <div className="relative max-w-md">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Layers size={16} />
//                 </div>
//                 <input 
//                   value={assetInput} 
//                   onChange={(e) => setAssetInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if(e.key === 'Enter') {
//                       e.preventDefault();
//                       const v = assetInput.trim();
//                       if(v && !formData.assets.includes(v)) setFormData({...formData, assets: [...formData.assets, v]});
//                       setAssetInput("");
//                     }
//                   }}
//                   placeholder="Assign other hardware..." 
//                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//                 />
//               </div>

//               {/* Asset Cloud (Matches Reference Design) */}
//               <div className="flex flex-wrap gap-3 p-1">
//                 {ASSET_OPTIONS.map((asset) => {
//                   const isSelected = formData.assets.includes(asset);
//                   return (
//                     <button
//                       key={asset}
//                       type="button"
//                       onClick={() => {
//                         const updated = isSelected 
//                           ? formData.assets.filter(a => a !== asset)
//                           : [...formData.assets, asset];
//                         setFormData({...formData, assets: updated});
//                       }}
//                       className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
//                         ${isSelected 
//                           ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
//                           : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"}`}
//                     >
//                       {asset}
//                       {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
//                     </button>
//                   );
//                 })}
//                 {/* Dynamically added custom assets */}
//                 {formData.assets.filter(a => !ASSET_OPTIONS.includes(a)).map((customAsset) => (
//                    <button
//                     key={customAsset}
//                     type="button"
//                     onClick={() => setFormData({...formData, assets: formData.assets.filter(a => a !== customAsset)})}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-900 border-2 border-slate-900 text-white shadow-lg active:scale-90"
//                   >
//                     {customAsset}
//                     <Check size={14} strokeWidth={3} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </FormField>
//         </div>
//       </div>
//     </div>

//     {/* NAVIGATION ACTIONS */}
//     <div className="flex justify-between items-center pt-4">
//       <button 
//         onClick={() => setStep(4)} 
//         type="button" 
//         className="flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
//       >
//         <ChevronLeft size={16}/> Previous Phase
//       </button>
//       <button 
//         onClick={() => setStep(6)} 
//         type="button" 
//         className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
//       >
//         Vault Registry <ChevronRight size={16}/>
//       </button>
//     </div>
//   </div>
// )}

//             {/* STEP 6: DOCUMENT VAULT (FULL RESTORE) */}
//             {/* {step === 6 && (
//               <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
//                 <div className="bg-[#0F172A] p-10 md:p-16 rounded-[4rem] shadow-2xl border border-white/5 space-y-12 overflow-hidden relative">
//                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 scale-150"><ShieldCheck size={200} /></div>
//                   <div className="flex items-center gap-5 pb-8 border-b border-white/5 relative z-10">
//                     <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-pulse"><ShieldCheck size={28} className="text-white" /></div>
//                     <div><h3 className="text-xl font-black text-white uppercase tracking-widest">Registry Artifacts</h3><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Verification Matrix</p></div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
              
//                     <div className="space-y-8">
//                       <div className="flex justify-between items-center"><p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">1. Master Resume</p>
//                         <div className="flex bg-white/5 p-1 rounded-xl border border-white/10"><button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>PDF</button><button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>URL</button></div>
//                       </div>
//                       {resumeMode === 'file' ? (<label className="block p-12 border-2 border-dashed border-white/10 rounded-[3rem] hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center"><FileUp size={40} className="mx-auto text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-500" /><p className="text-xs font-bold text-slate-300 uppercase tracking-widest truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select PDF Document"}</p><input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} /></label>) : <input placeholder="Paste Cloud Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-blue-500 transition-all shadow-2xl" />}
//                     </div>

             
//                     <div className="space-y-8">
//                       <div className="flex justify-between items-center"><p className="text-[11px] font-black text-purple-400 uppercase tracking-widest">2. Exp. Letter</p>
//                         <div className="flex bg-white/5 p-1 rounded-xl border border-white/10"><button type="button" onClick={() => setExpLetterMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'file' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>PDF</button><button type="button" onClick={() => setExpLetterMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'link' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>URL</button></div>
//                       </div>
//                       {expLetterMode === 'file' ? (<label className="block p-12 border-2 border-dashed border-white/10 rounded-[3rem] hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center"><FileUp size={40} className="mx-auto text-purple-400 mb-5 group-hover:scale-110 transition-transform duration-500" /><p className="text-xs font-bold text-slate-300 uppercase tracking-widest truncate px-4">{formData.expLetterFile ? formData.expLetterFile.name : "Select PDF Document"}</p><input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} /></label>) : <input placeholder="Paste Cloud Storage Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-purple-500 transition-all shadow-2xl" />}
//                     </div>
//                   </div>

                 
//                   <div className="pt-8 border-t border-white/5 space-y-8 relative z-10">
//                      <div className="flex justify-between items-center mb-2"><p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">3. Credentials Matrix</p><div className="flex gap-4">
//                         <label className="cursor-pointer h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500/30 border border-emerald-500/20 active:scale-90 transition-all flex items-center justify-center shadow-lg"><FileUp size={20}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})}/></label>
//                         <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 active:scale-90 flex items-center justify-center shadow-lg"><LinkIcon size={20}/></button>
//                      </div></div>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
//                        {formData.certificateFiles.map((file, idx) => (<div key={idx} className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5 text-xs text-slate-300 font-bold animate-in zoom-in-95"><div className="flex items-center gap-4 truncate max-w-[85%]"><div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" /> {file.name}</div><X size={20} className="text-red-400 cursor-pointer hover:rotate-90 transition-transform" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})}/></div>))}
//                        {formData.certificateLinks.map((link, idx) => (<div key={idx} className="flex gap-4 animate-in slide-in-from-right-4"><div className="relative flex-1"><Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40" /><input value={link} placeholder="Public URI" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-6 py-5 text-sm text-white outline-none focus:border-emerald-500 shadow-xl transition-all" /></div><button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-red-400 bg-red-500/5 hover:bg-red-500/10 h-16 w-16 rounded-[2rem] transition-all flex items-center justify-center shadow-inner"><Trash2 size={24}/></button></div>))}
//                      </div>
//                   </div>

                  
//                   <div className="pt-16 border-t border-white/5 flex flex-col items-center gap-8 relative z-10">
//                     <button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-[3rem] transition-all shadow-[0_25px_60px_rgba(37,99,235,0.5)] active:scale-[0.98] text-sm tracking-widest uppercase disabled:opacity-50">
//                       {loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} strokeWidth={2.5}/><span>Finalize & Synchronize Profile</span></>}
//                     </button>
//                     <button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"><ChevronLeft size={16}/> Return to Previous Module</button>
//                   </div>
//                 </div>
//               </div>
//             )} */}

//             {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
// {/* STEP 6: DOCUMENT VAULT (SYNCHRONIZED WITH UI THEME) */}
// {step === 6 && (
//   <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
//     {/* Unified White Enterprise Card */}
//     <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-xl shadow-slate-200/60 border border-slate-200 space-y-12 overflow-hidden relative">
      
//       {/* Subtle Background Branding Accent */}
//       <div className="absolute top-0 right-0 p-12 text-slate-100 opacity-40 pointer-events-none rotate-12 scale-150">
//         <ShieldCheck size={240} />
//       </div>

//       {/* Vault Header */}
//       <div className="flex items-center gap-5 pb-8 border-b border-slate-100 relative z-10">
//         <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
//           <ShieldCheck size={28} className="text-white" />
//         </div>
//         <div>
//           <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">Registry Artifacts</h3>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Document Verification Matrix</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
//         {/* 1. MASTER RESUME */}
//         <div className="space-y-8 p-1">
//           <div className="flex justify-between items-center">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 1. Master Resume
//             </p>
//             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => setResumeMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
//               <button type="button" onClick={() => setResumeMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${resumeMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
//             </div>
//           </div>
//           {resumeMode === 'file' ? (
//             <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-blue-500 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
//               <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-5 group-hover:scale-110 transition-all duration-500" />
//               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.cvFile ? formData.cvFile.name : "Select Resume PDF"}</p>
//               <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} />
//             </label>
//           ) : (
//             <input placeholder="Enter Public Storage Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/5" />
//           )}
//         </div>

//         {/* 2. EXPERIENCE LETTER */}
//         <div className="space-y-8 p-1">
//           <div className="flex justify-between items-center">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> 2. Exp. Letter
//             </p>
//             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
//               <button type="button" onClick={() => setExpLetterMode("file")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>FILE</button>
//               <button type="button" onClick={() => setExpLetterMode("link")} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${expLetterMode === 'link' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>URL</button>
//             </div>
//           </div>
//           {expLetterMode === 'file' ? (
//             <label className="block p-12 border-2 border-dashed border-slate-200 rounded-[3rem] hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer group text-center bg-white">
//               <FileUp size={40} className="mx-auto text-slate-300 group-hover:text-slate-900 mb-5 group-hover:scale-110 transition-all duration-500" />
//               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate px-4">{formData.expLetterFile ? formData.expLetterFile.name : "Select Exp. PDF"}</p>
//               <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} />
//             </label>
//           ) : (
//             <input placeholder="Enter Public Exp. Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-900 outline-none focus:border-slate-900 transition-all shadow-sm focus:ring-4 focus:ring-slate-900/5" />
//           )}
//         </div>
//       </div>

//       {/* 3. CERTIFICATIONS */}
//       <div className="pt-8 border-t border-slate-100 space-y-8 relative z-10">
//          <div className="flex justify-between items-center mb-2">
//             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 3. Credentials Matrix
//             </p>
//             <div className="flex gap-4">
//               <label className="cursor-pointer h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 transition-all flex items-center justify-center shadow-sm">
//                 <FileUp size={20}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})}/>
//               </label>
//               <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="h-12 w-12 bg-white text-slate-400 rounded-2xl hover:text-emerald-600 border border-slate-200 active:scale-90 flex items-center justify-center shadow-sm">
//                 <LinkIcon size={20}/>
//               </button>
//             </div>
//          </div>
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
//            {formData.certificateFiles.map((file, idx) => (
//               <div key={idx} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-xs text-slate-900 font-bold animate-in zoom-in-95 hover:border-emerald-200 transition-colors shadow-sm">
//                 <div className="flex items-center gap-4 truncate max-w-[85%]">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> 
//                   {file.name}
//                 </div>
//                 <X size={20} className="text-slate-300 hover:text-red-500 cursor-pointer transition-all hover:rotate-90" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})}/>
//               </div>
//            ))}
//            {formData.certificateLinks.map((link, idx) => (
//               <div key={idx} className="flex gap-4 animate-in slide-in-from-right-4">
//                 <div className="relative flex-1">
//                   <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
//                   <input value={link} placeholder="Credential Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-sm" />
//                 </div>
//                 <button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-red-500 bg-white h-16 w-16 rounded-[2rem] border border-slate-200 transition-all flex items-center justify-center shadow-sm">
//                   <Trash2 size={24}/>
//                 </button>
//               </div>
//            ))}
//          </div>
//       </div>

//       {/* FINAL SUBMIT BUTTONS */}
//       <div className="pt-16 border-t border-slate-100 flex flex-col items-center gap-8 relative z-10">
//         <button type="submit" disabled={loading} className="w-full md:max-w-xl flex items-center justify-center gap-5 bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[3rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] text-sm tracking-widest uppercase disabled:opacity-50">
//           {loading ? <Loader2 className="animate-spin" size={28} /> : <><Database size={24} strokeWidth={2.5}/><span>Submit all Profile</span></>}
//         </button>
//         <button type="button" onClick={() => setStep(5)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
//           <ChevronLeft size={16}/> Return to Previous Module
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//************************************************************************************************************** */
// import React, { useState, useEffect } from "react";
// import {
//   Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
//   Loader2, Plus, Trash2, Layers, Cpu, ExternalLink, Database,
//   Globe, ShieldCheck, History, X, LinkIcon, FileUp
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between items-center">
//       <span>{label}</span>
//       <span className={`font-bold normal-case text-[9px] md:text-[10px] ${required ? "text-red-500" : "text-slate-300"}`}>
//         {required ? "Required" : "Optional"}
//       </span>
//     </label>
//     {children}
//     {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState("");
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [assetFocused, setAssetFocused] = useState(false);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [step, setStep] = useState(1);
//   const totalSteps = 6;

//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", address: "", address1: "", pincode: "", state: "", city: "",
//     district: "", country: "India", position: "", education: "", gender: "", dob: "",
//     experience: "", about_me: "", languages_spoken: [], skills: [], assets: [],
//     department: "", cvFile: null, resume_link: "", expLetterFile: null,
//     experience_letter_link: "", certificateFiles: [], certificateLinks: [""], experiences: [],
//   });

//   const SKILL_OPTIONS = ["React", "JavaScript", "Node.js", "MongoDB", "MySQL", "HTML", "CSS", "Tailwind", "Python", "Java", "AWS", "Docker"];
//   const ASSET_OPTIONS = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Mobile", "ID Card", "SIM Card"];
//   const POSITION_OPTIONS = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Executive", "HR Manager", "UI/UX Designer", "QA Engineer", "DevOps Engineer", "Software Engineer", "Data Analyst"];
//   const educationOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "Diploma", "PhD"];

//   const filteredSkills = SKILL_OPTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s));
//   const filteredAssets = ASSET_OPTIONS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()) && !formData.assets.includes(a));
//   const filteredDepartments = departments.filter(d => d.name?.toLowerCase().includes(deptSearch.toLowerCase()));
//   const filteredEducation = educationOptions.filter(e => e.toLowerCase().includes(eduSearch.toLowerCase()));

//   const isStep1Valid = formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && /^[6-9]\d{9}$/.test(formData.phone);

//   useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value) error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";
//     setErrors(prev => { const updated = { ...prev }; if (error) updated[field] = error; else delete updated[field]; return updated; });
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         const cities = offices.map(o => o.Name);
//         setCityOptions(cities);
//         setFormData(prev => ({ ...prev, city: cities.length === 1 ? cities[0] : "", state: offices[0].State, district: offices[0].District, country: offices[0].Country }));
//       }
//     } catch { toast.error("Lookup failed"); }
//     finally { setIsFetchingPincode(false); }
//   };

//   useEffect(() => {
//     const loadDepartments = async () => {
//       try { const data = await departmentService.getAll(); setDepartments(data || []); }
//       catch (err) { toast.error("Failed to load departments"); }
//     };
//     loadDepartments();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateField("name", formData.name) || !validateField("email", formData.email) || !validateField("phone", formData.phone)) {
//       toast.error("Please fill required fields");
//       return;
//     }
//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "expLetterFile", "certificateLinks"].includes(key)) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       formDataApi.append("full_name", formData.name);
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);
//       formDataApi.append("languages_spoken", JSON.stringify(formData.languages_spoken.map(l => String(l).trim()).filter(Boolean)));
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));
//       formData.certificateFiles.forEach(file => formDataApi.append("certificate_files[]", file));
//       formData.certificateLinks.filter(l => String(l).trim().startsWith("http")).forEach(link => formDataApi.append("certificate_links", link));
//       await candidateService.createCandidate(formDataApi);
//       toast.success("Sync Complete 🎉");
//     } catch (err) { toast.error("Commit failed"); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8">
        
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200"><Database size={24} className="text-white" /></div>
//             <div>
//               <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Manual Candidate Entry</h2>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Registry Mode</p>
//             </div>
//           </div>
//           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-w-[200px]">
//             <div className="flex justify-between mb-1 text-[10px] font-black uppercase text-slate-400">
//               <span>Step {step} of {totalSteps}</span>
//               <span>{Math.round((step / totalSteps) * 100)}%</span>
//             </div>
//             <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-12 space-y-8">
            
//             {/* STEP 1: PERSONAL */}
//             {step === 1 && (
//               <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-right-4">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><User size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Identity</h3></div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField label="Full Name" required error={errors.name}><input placeholder="Name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); validateField("name", e.target.value); }} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" /></FormField>
//                   <FormField label="Email" required error={errors.email}><input type="email" placeholder="email@company.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateField("email", e.target.value); }} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" /></FormField>
//                   <FormField label="Phone" required error={errors.phone}><div className="flex items-center bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white transition-all"><div className="px-3 text-[10px] font-black text-slate-400 border-r border-slate-100">+91</div><input maxLength={10} value={formData.phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setFormData({ ...formData, phone: v }); validateField("phone", v); }} className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none" /></div></FormField>
//                   <FormField label="Gender"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold outline-none"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></FormField>
//                   <FormField label="DOB"><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" /></FormField>
//                   <FormField label="Languages"><div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto space-y-2">{["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"].map(lang => (<label key={lang} className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={formData.languages_spoken.includes(lang)} onChange={() => { const u = formData.languages_spoken.includes(lang) ? formData.languages_spoken.filter(l => l !== lang) : [...formData.languages_spoken, lang]; setFormData({ ...formData, languages_spoken: u }); }} className="w-4 h-4 accent-blue-600" /> {lang}</label>))}</div></FormField>
//                 </div>
//                 <FormField label="Profile Summary"><textarea rows={3} value={formData.about_me} onChange={(e) => setFormData({ ...formData, about_me: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white resize-none" /></FormField>
//                 <div className="flex justify-end pt-4"><button type="button" disabled={!isStep1Valid} onClick={() => setStep(2)} className={`px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isStep1Valid ? "bg-blue-600 text-white shadow-blue-100" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>Next Step →</button></div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-right-4">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><MapPin size={18} className="text-blue-600" /><h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Location Matrix</h3></div>
//                 <div className="space-y-6">
//                   <FormField label="Address 1" required><input placeholder="Street address line 1" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white" /></FormField>
                
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField label="Address 2" required><input placeholder="Street address line 2" value={formData.address2} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white" /></FormField>
//                       <FormField label="Location / Area" required><input placeholder="Area / Neighborhood" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white" /></FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField label="Pincode" required><div className="relative"><input maxLength={6} value={formData.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setFormData({ ...formData, pincode: v }); if (v.length === 6) fetchPincodeDetails(v); }} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500" />{isFetchingPincode && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />}</div></FormField>
//                     <FormField label="City">{cityOptions.length > 1 ? (<select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none appearance-none">{cityOptions.map((c, i) => (<option key={i} value={c}>{c}</option>))}</select>) : <input value={formData.city} readOnly placeholder="Locked" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500" />}</FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <FormField label="District"><input value={formData.district} readOnly className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-500" /></FormField>
//                     <FormField label="State"><input value={formData.state} readOnly className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-500" /></FormField>
//                     <FormField label="Country"><input value={formData.country} readOnly className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-500" /></FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-4"><button onClick={() => setStep(1)} type="button" className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">← Back</button><button onClick={() => setStep(3)} type="button" className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all">Next Step →</button></div>
//               </div>
//             )}

//             {/* STEP 3: EMPLOYMENT */}
//             {step === 3 && (
//               <div className="space-y-8 animate-in slide-in-from-right-4">
//                 <div className="bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl space-y-8">
//                   <div className="flex justify-between items-center border-b border-white/10 pb-4">
//                     <div className="flex items-center gap-3 text-blue-400"><History size={20}/><h3 className="text-xs font-black text-white uppercase tracking-widest">Career Timeline</h3></div>
//                     <button type="button" onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }] })} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">+ Add Role</button>
//                   </div>
//                   <div className="space-y-6">
//                     {formData.experiences.map((exp, i) => (
//                       <div key={i} className="relative bg-white/5 border border-white/5 p-6 rounded-3xl space-y-6 animate-in zoom-in-95">
//                         <button type="button" onClick={() => setFormData({ ...formData, experiences: formData.experiences.filter((_, idx) => idx !== i) })} className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90"><Trash2 size={16} /></button>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <input placeholder="Employer" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-b border-white/10 px-2 py-3 text-xs font-bold text-white outline-none focus:border-blue-500" />
//                           <input placeholder="Role" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-b border-white/10 px-2 py-3 text-xs font-bold text-white outline-none focus:border-blue-500" />
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                            <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-lg p-2 text-[10px] text-white" />
//                            <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-lg p-2 text-[10px] text-white" />
//                            <input placeholder="CTC" type="number" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-lg p-2 text-[10px] text-white" />
//                            <input placeholder="Location" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border-none rounded-lg p-2 text-[10px] text-white" />
//                         </div>
//                         <textarea placeholder="Key Responsibilities..." rows={2} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({ ...formData, experiences: u }); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none resize-none" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-4"><button onClick={() => setStep(2)} type="button" className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase transition-all">← Back</button><button onClick={() => setStep(4)} type="button" className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl transition-all">Next Step →</button></div>
//               </div>
//             )}

//             {/* STEP 4: SKILLS */}
//             {step === 4 && (
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-visible animate-in slide-in-from-right-4">
//                 <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center gap-3 rounded-t-[2.5rem]"><Cpu size={18} className="text-blue-600" /><h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Stack Inventory</h3></div>
//                 <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-visible">
//                   <FormField label="Technical Skills">
//                     <div className="space-y-4 relative overflow-visible" onClick={(e) => e.stopPropagation()}>
//                       <div className="flex flex-wrap gap-2 min-h-[44px] p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//                         {formData.skills.map((s, i) => <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg shadow-md">{s}<X size={12} className="cursor-pointer" onClick={() => setFormData({...formData, skills: formData.skills.filter((_, idx) => idx !== i)})} /></span>)}
//                       </div>
//                       <div className="relative overflow-visible">
//                         <input value={skillInput} onFocus={() => setShowSkillDrop(true)} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); const v = skillInput.trim(); if(v && !formData.skills.includes(v)) setFormData({...formData, skills: [...formData.skills, v]}); setSkillInput(""); setShowSkillDrop(false); } }} placeholder="Search skill & Enter..." className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 shadow-sm" />
//                         {showSkillDrop && filteredSkills.length > 0 && <div className="absolute z-[200] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] no-scrollbar max-h-48 overflow-y-auto animate-in fade-in">{filteredSkills.map((s, i) => <div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({...formData, skills: [...formData.skills, s]}); setSkillInput(""); setShowSkillDrop(false); }} className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center">{s}<Plus size={14} className="text-blue-500 opacity-40" /></div>)}</div>}
//                       </div>
//                     </div>
//                   </FormField>
//                   <FormField label="Assets Issued">
//                     <div className="space-y-4 relative overflow-visible" onClick={(e) => e.stopPropagation()}>
//                       <div className="flex flex-wrap gap-2 min-h-[44px] p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//                         {formData.assets.map((a, i) => <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg shadow-md">{a}<X size={12} className="cursor-pointer" onClick={() => setFormData({...formData, assets: formData.assets.filter((_, idx) => idx !== i)})} /></span>)}
//                       </div>
//                       <div className="relative overflow-visible">
//                         <input value={assetInput} onFocus={() => setShowAssetDrop(true)} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); setShowAssetDrop(false); } }} placeholder="Assign asset..." className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-900 shadow-sm" />
//                         {showAssetDrop && filteredAssets.length > 0 && <div className="absolute z-[200] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] no-scrollbar max-h-48 overflow-y-auto animate-in fade-in">{filteredAssets.map((a, i) => <div key={i} onMouseDown={(e) => { e.preventDefault(); setFormData({...formData, assets: [...formData.assets, a]}); setAssetInput(""); setShowAssetDrop(false); }} className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center">{a}<Plus size={14} className="text-slate-400 opacity-40" /></div>)}</div>}
//                       </div>
//                     </div>
//                   </FormField>
//                 </div>
//                 <div className="flex justify-between p-6"><button onClick={() => setStep(3)} type="button" className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase transition-all">← Back</button><button onClick={() => setStep(5)} type="button" className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl transition-all">Next Step →</button></div>
//               </div>
//             )}

//             {/* STEP 5: PROFESSIONAL INFO */}
//             {step === 5 && (
//               <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-right-4">
//                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100"><Briefcase size={18} className="text-blue-600" /><h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest text-nowrap">Professional Profile</h3></div>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <FormField label="Position"><input list="pos-opts" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} placeholder="Search Role..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500" /><datalist id="pos-opts">{POSITION_OPTIONS.map((p, i) => <option key={i} value={p}/>)}</datalist></FormField>
//                     <FormField label="Total Exp (Years)"><input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none" /></FormField>
//                  </div>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <FormField label="Highest Education"><div className="relative"><input value={formData.education} onChange={(e) => { setEduSearch(e.target.value); setFormData({...formData, education: e.target.value}); }} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none" />{eduSearch && filteredEducation.length > 0 && <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-40 overflow-y-auto no-scrollbar">{filteredEducation.map((e, i) => <div key={i} onClick={() => { setFormData({...formData, education: e}); setEduSearch(""); }} className="px-5 py-3 text-[11px] font-bold text-slate-600 hover:bg-blue-50 cursor-pointer">{e}</div>)}</div>}</div></FormField>
//                     <FormField label="Department"><div className="relative"><input value={formData.department} onChange={(e) => { setDeptSearch(e.target.value); setFormData({...formData, department: e.target.value}); }} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none" />{deptSearch && filteredDepartments.length > 0 && <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-40 overflow-y-auto no-scrollbar">{filteredDepartments.map((d) => <div key={d.id} onClick={() => { setFormData({...formData, department: d.name}); setDeptSearch(""); }} className="px-5 py-3 text-[11px] font-bold text-slate-600 hover:bg-blue-50 cursor-pointer">{d.name}</div>)}</div>}</div></FormField>
//                  </div>
//                  <div className="flex justify-between pt-4"><button onClick={() => setStep(4)} type="button" className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">← Back</button><button onClick={() => setStep(6)} type="button" className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl transition-all">Final Assets →</button></div>
//               </div>
//             )}

//              <div className={` space-y-8 ${step !== 6 ? "hidden lg:block opacity-30 blur-[1px] pointer-events-none" : "block animate-in zoom-in-95"}`}>
//             <div className="bg-[#0F172A] p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-10 sticky top-10 border border-white/5">
//               <div className="flex items-center gap-3 pb-4 border-b border-white/5"><ShieldCheck size={18} className="text-blue-400" /><h3 className="text-xs font-black text-white uppercase tracking-widest">Document Vault</h3></div>
//               <div className="space-y-8">
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center"><p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">1. Master Resume</p><div className="flex bg-white/5 p-1 rounded-xl"><button type="button" onClick={() => setResumeMode("file")} className={`px-3 py-1 text-[9px] font-black rounded transition-all ${resumeMode==='file'?'bg-blue-600 text-white':'text-slate-500'}`}>PDF</button><button type="button" onClick={() => setResumeMode("link")} className={`px-3 py-1 text-[9px] font-black rounded transition-all ${resumeMode==='link'?'bg-blue-600 text-white':'text-slate-500'}`}>Link</button></div></div>
//                   {resumeMode === 'file' ? (<label className="block p-8 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer text-center group"><FileUp size={28} className="mx-auto text-blue-400 mb-4 group-hover:scale-110 transition-transform" /><p className="text-[9px] font-bold text-slate-300 uppercase truncate px-2">{formData.cvFile ? formData.cvFile.name : "Select PDF"}</p><input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} /></label>) : <input placeholder="Paste Resume URL" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" />}
//                 </div>
//                 <div className="space-y-4 pt-4 border-t border-white/5">
//                   <div className="flex justify-between items-center"><p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">2. Certifications</p><div className="flex gap-2"><label className="cursor-pointer p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 border border-emerald-500/20 transition-all active:scale-90"><FileUp size={16}/><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)] })} /></label><button type="button" onClick={() => setFormData({ ...formData, certificateLinks: [...formData.certificateLinks, ""] })} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 active:scale-90 transition-all"><LinkIcon size={16}/></button></div></div>
//                   <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2">{formData.certificateFiles.map((file, idx) => (<div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl text-[9px] text-slate-300 font-bold border border-white/5 animate-in slide-in-from-right-2"><span className="truncate max-w-[85%]">{file.name}</span><X size={14} className="text-red-400 cursor-pointer" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx) })} /></div>))}{formData.certificateLinks.map((link, idx) => (<div key={idx} className="flex gap-2 animate-in slide-in-from-right-2"><input value={link} placeholder="Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({ ...formData, certificateLinks: u }); }} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white outline-none focus:border-emerald-500" /><button type="button" onClick={() => setFormData({ ...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx) })} className="text-red-400 p-2"><Trash2 size={16}/></button></div>))}</div>
//                 </div>
//               </div>
//               <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
//                 <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[2rem] transition-all shadow-[0_15px_30px_rgba(37,99,235,0.4)] active:scale-[0.97] disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={22} /> : <><Database size={20} /><span>Sync to Cloud</span></>}</button>
//                 <button type="button" onClick={() => setStep(5)} className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300">Previous Phase</button>
//               </div>
//             </div>
//           </div>
//           </div>

          
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//*****************************************************working code phase 123***************************************************************** */
// import React, { useState, useEffect } from "react";
// import {
//   Check,
//   FileText,
//   Award,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   Phone,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   ExternalLink,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   LinkIcon,
//   FileUp,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// // const FormField = ({ label, required, error, children }) => (
// //   <div className="space-y-1.5">
// //     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
// //       <span>
// //         {label} {required && <span className="text-red-500">*</span>}
// //       </span>
// //       {!required && (
// //         <span className="text-slate-300 font-bold normal-case">Optional</span>
// //       )}
// //     </label>
// //     {children}
// //     {error && (
// //       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
// //         {error}
// //       </p>
// //     )}
// //   </div>
// // );
// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>{label}</span>

//       {/* RIGHT SIDE TEXT */}
//       <span
//         className={`font-bold normal-case ${
//           required ? "text-red-500" : "text-slate-300"
//         }`}
//       >
//         {required ? "Required" : "Optional"}
//       </span>
//     </label>

//     {children}

//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   // UI States for Toggles
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [deptSearch, setDeptSearch] = useState("");
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [assetFocused, setAssetFocused] = useState(false);
//   const [assetInput, setAssetInput] = useState("");
//   const [educationOptions, setEducationOptions] = useState([
//     "B.Tech",
//     "M.Tech",
//     "B.Sc",
//     "M.Sc",
//     "BCA",
//     "MCA",
//     "MBA",
//     "Diploma",
//     "PhD",
//   ]);
//   const [eduSearch, setEduSearch] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "India",
//     position: "",
//     education: "",
//     gender: "",
//     dob: "",
//     experience: "",
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     expLetterFile: null,
//     experience_letter_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   // ===== STEP WIZARD STATE =====
//   const [step, setStep] = useState(1);
//   const totalSteps = 6;

//   const isStep1Valid =
//     formData.name &&
//     /^\S+@\S+\.\S+$/.test(formData.email) &&
//     /^[6-9]\d{9}$/.test(formData.phone);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [step]);

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value)
//       error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
//       error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value))
//       error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;

//     try {
//       setIsFetchingPincode(true);

//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();

//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;

//         const cities = offices.map((o) => o.Name);
//         setCityOptions(cities);

//         setFormData((prev) => ({
//           ...prev,
//           city: cities.length === 1 ? cities[0] : "", // ✅ auto fill single
//           state: offices[0].State,
//           district: offices[0].District,
//           country: offices[0].Country,
//         }));
//       }
//     } catch {
//       toast.error("Location lookup failed");
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   useEffect(() => {
//     const loadDepartments = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(data || []);
//       } catch (err) {
//         toast.error("Failed to load departments");
//       }
//     };

//     loadDepartments();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log(formData);
//     const isNameValid = validateField("name", formData.name);
//     const isEmailValid = validateField("email", formData.email);
//     const isPhoneValid = validateField("phone", formData.phone);

//     if (!isNameValid || !isEmailValid || !isPhoneValid) {
//       toast.error("Please fill required fields correctly");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       //   Object.keys(formData).forEach((key) => {
//       //     if (
//       //       formData[key] &&
//       //       ![
//       //         "experiences",
//       //         "certificateFiles",
//       //         "languages_spoken",
//       //         "cvFile",
//       //         "expLetterFile",
//       //         "certificateLinks",
//       //       ].includes(key)
//       //     ) {
//       //       formDataApi.append(key, formData[key]);
//       //     }
//       //   });
//       Object.keys(formData).forEach((key) => {
//         if (
//           formData[key] &&
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "expLetterFile",
//             "certificateLinks",
//           ].includes(key)
//         ) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       formDataApi.append("full_name", formData.name);

//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile)
//         formDataApi.append("experience_letter", formData.expLetterFile);
//       //      const cleanLanguages = formData.languages_spoken
//       //   .map((l) => String(l).replace(/[\[\]"]/g, "").trim())
//       //   .filter(Boolean);

//       // formDataApi.append(
//       //   "languages_spoken",
//       //   JSON.stringify(cleanLanguages)
//       // );

//       // formDataApi.append(
//       //   "languages_spoken",
//       //   JSON.stringify(cleanLanguages)
//       // );

//       // const cleanLanguages = formData.languages_spoken
//       //   .map((l) => String(l).trim())
//       //   .filter(Boolean);

//       // formDataApi.append("languages_spoken", JSON.stringify(cleanLanguages));
//       const cleanLanguages = formData.languages_spoken
//         .map((l) => String(l).trim())
//         .filter(Boolean)
//         .join(", ");

//       formDataApi.append("languages_spoken", cleanLanguages);

//       // ✅ Added Experience details as JSON string per API standards
//       formDataApi.append(
//         "experience_details",
//         JSON.stringify(formData.experiences),
//       );

//       formData.certificateFiles.forEach((file) =>
//         formDataApi.append("certificate_files[]", file),
//       );
//       //   formDataApi.append(
//       //     "certificate_links",
//       //     JSON.stringify(formData.certificateLinks.filter(Boolean)),
//       //   );
//       //    const cleanLinks = formData.certificateLinks
//       //   .map((l) => String(l).replace(/[\[\]"]/g, "").trim())
//       //   .filter((l) => l.startsWith("http"));

//       // formDataApi.append("certificate_links", JSON.stringify(cleanLinks));

//       // const cleanLinks = formData.certificateLinks
//       //   .map((l) => String(l).trim())
//       //   .filter((l) => l.startsWith("http"));

//       // formDataApi.append("certificate_links", JSON.stringify(cleanLinks));
//       const cleanLinks = formData.certificateLinks
//         .map((l) => String(l).trim())
//         .filter((l) => l.startsWith("http"));

//       cleanLinks.forEach((link) => {
//         formDataApi.append("certificate_links", link);
//       });

//       await candidateService.createCandidate(formDataApi);
//       toast.success("Candidate record committed successfully 🎉");
//     } catch (err) {
//       toast.error("Failed to commit record");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const SKILL_OPTIONS = [
//     "React",
//     "JavaScript",
//     "Node.js",
//     "MongoDB",
//     "MySQL",
//     "HTML",
//     "CSS",
//     "Tailwind",
//     "Python",
//     "Java",
//     "AWS",
//     "Docker",
//   ];

//   const ASSET_OPTIONS = [
//     "Laptop",
//     "Mouse",
//     "Keyboard",
//     "Monitor",
//     "Headset",
//     "Mobile",
//     "ID Card",
//     "SIM Card",
//   ];

//   const POSITION_OPTIONS = [
//     "Frontend Developer",
//     "Backend Developer",
//     "Full Stack Developer",
//     "HR Executive",
//     "HR Manager",
//     "UI/UX Designer",
//     "QA Engineer",
//     "DevOps Engineer",
//     "Software Engineer",
//     "Data Analyst",
//   ];

//   const filteredSkills = SKILL_OPTIONS.filter(
//     (s) =>
//       s.toLowerCase().includes(skillInput.toLowerCase()) &&
//       !formData.skills.includes(s),
//   );

//   const filteredAssets = ASSET_OPTIONS.filter(
//     (a) =>
//       a.toLowerCase().includes(assetInput.toLowerCase()) &&
//       !formData.assets.includes(a),
//   );

//   const filteredDepartments = departments.filter((d) =>
//     d.name?.toLowerCase().includes(deptSearch.toLowerCase()),
//   );

//   const filteredEducation = educationOptions.filter((e) =>
//     e.toLowerCase().includes(eduSearch.toLowerCase()),
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 Manual Candidate Entry
//               </h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                 Talent Acquisition Registry
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">
//               Enterprise Security Enabled
//             </span>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           {/* STEP PROGRESS */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
//             <div className="flex justify-between mb-1">
//               <span className="text-xs font-bold text-slate-600">
//                 Step {step} / {totalSteps}
//               </span>
//               <span className="text-xs text-slate-400">
//                 {Math.round((step / totalSteps) * 100)}%
//               </span>
//             </div>

//             <div className="w-full bg-slate-100 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all"
//                 style={{ width: `${(step / totalSteps) * 100}%` }}
//               />
//             </div>
//           </div>

//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* PERSONAL INFO */}

//             {step === 1 && (
//               <>
//                 <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
//                   <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                     <User size={16} className="text-blue-600" />
//                     <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                       Personal Identification
//                     </h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField label="Full Name" required error={errors.name}>
//                       <input
//                         placeholder="John Doe"
//                         value={formData.name}
//                         onChange={(e) => {
//                           setFormData({ ...formData, name: e.target.value });
//                           validateField("name", e.target.value);
//                         }}
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                       />
//                     </FormField>
//                     <FormField
//                       label="Email Address"
//                       required
//                       error={errors.email}
//                     >
//                       <input
//                         type="email"
//                         placeholder="john@company.com"
//                         value={formData.email}
//                         onChange={(e) => {
//                           setFormData({ ...formData, email: e.target.value });
//                           validateField("email", e.target.value);
//                         }}
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                       />
//                     </FormField>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField
//                       label="Phone Number"
//                       required
//                       error={errors.phone}
//                     >
//                       <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                         <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">
//                           +91
//                         </div>
//                         <input
//                           maxLength={10}
//                           placeholder="9876543210"
//                           value={formData.phone}
//                           onChange={(e) => {
//                             const v = e.target.value
//                               .replace(/\D/g, "")
//                               .slice(0, 10);
//                             setFormData({ ...formData, phone: v });
//                             validateField("phone", v);
//                           }}
//                           className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                         />
//                       </div>
//                     </FormField>
//                     <FormField label="Gender">
//                       <select
//                         value={formData.gender}
//                         onChange={(e) =>
//                           setFormData({ ...formData, gender: e.target.value })
//                         }
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </FormField>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField label="Date of Birth">
//                       <input
//                         type="date"
//                         value={formData.dob}
//                         onChange={(e) =>
//                           setFormData({ ...formData, dob: e.target.value })
//                         }
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                       />
//                     </FormField>
//                     <FormField label="Languages Spoken">
//                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar space-y-2">
//                         {[
//                           "English",
//                           "Hindi",
//                           "Marathi",
//                           "Gujarati",
//                           "Tamil",
//                           "Telugu",
//                         ].map((lang) => (
//                           <label
//                             key={lang}
//                             className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={formData.languages_spoken.includes(lang)}
//                               onChange={() => {
//                                 const updated =
//                                   formData.languages_spoken.includes(lang)
//                                     ? formData.languages_spoken.filter(
//                                         (l) => l !== lang,
//                                       )
//                                     : [...formData.languages_spoken, lang];
//                                 setFormData({
//                                   ...formData,
//                                   languages_spoken: updated,
//                                 });
//                               }}
//                               className="w-4 h-4 accent-blue-600 rounded"
//                             />{" "}
//                             {lang}
//                           </label>
//                         ))}
//                       </div>
//                     </FormField>
//                   </div>

//                   <FormField label="About Profile Summary">
//                     <textarea
//                       rows={3}
//                       placeholder="Brief summary..."
//                       value={formData.about_me}
//                       onChange={(e) =>
//                         setFormData({ ...formData, about_me: e.target.value })
//                       }
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none transition-all"
//                     />
//                   </FormField>
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     disabled={!isStep1Valid}
//                     onClick={() => setStep(2)}
//                     className={`px-6 py-3 rounded-xl text-xs font-bold transition-all
//       ${
//         isStep1Valid
//           ? "bg-blue-600 text-white"
//           : "bg-slate-200 text-slate-400 cursor-not-allowed"
//       }`}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </>
//             )}

// {step === 2 && (
// <>
// <div>
//   <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">

//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <MapPin size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Location Data
//                   </h3>
//                 </div>
//                 <div>
//                   <FormField label="Address 1" required error={errors.name}>
//                     <input
//                       placeholder="address 1"
//                       value={formData.address1}
//                       onChange={(e) => {
//                         setFormData({ ...formData, name: e.target.value });
//                         validateField("address", e.target.value);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </FormField>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="Address 2" required error={errors.name}>
//                     <input
//                       placeholder="address 2"
//                       value={formData.address1}
//                       onChange={(e) => {
//                         setFormData({ ...formData, name: e.target.value });
//                         validateField("address", e.target.value);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </FormField>

//                   <FormField label="Location" required error={errors.name}>
//                     <input
//                       placeholder="location"
//                       value={formData.location}
//                       onChange={(e) => {
//                         setFormData({ ...formData, name: e.target.value });
//                         validateField("address", e.target.value);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </FormField>
//                   <FormField required label="Pincode">
//                     <input
//                       placeholder="6 Digits"
//                       maxLength={6}
//                       value={formData.pincode}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "");
//                         setFormData({ ...formData, pincode: v });
//                         if (v.length === 6) fetchPincodeDetails(v);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />
//                   </FormField>

//                   <FormField label="City">
//                     {cityOptions.length > 1 ? (
//                       <select
//                         value={formData.city}
//                         onChange={(e) =>
//                           setFormData({ ...formData, city: e.target.value })
//                         }
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
//                       >
//                         <option value="">Select City</option>
//                         {cityOptions.map((c, i) => (
//                           <option key={i} value={c}>
//                             {c}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <input
//                         value={formData.city}
//                         readOnly
//                         placeholder="Auto-filled"
//                         className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
//                       />
//                     )}
//                   </FormField>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="District">
//                     <input
//                       value={formData.district}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                     />
//                   </FormField>
//                   <FormField label="State">
//                     <input
//                       value={formData.state}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                     />
//                   </FormField>
//                 </div>
//                 <FormField label="Country">
//                   <input
//                     value={formData.country}
//                     readOnly
//                     placeholder="Auto-filled"
//                     className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                   />
//                 </FormField>
//               </div>
//             </div>
            
// <div className="flex justify-between">
//   <button type="button" onClick={() => setStep(1)}
//     className="px-6 py-3 bg-slate-200 rounded-xl text-xs font-bold">
//     ← Back
//   </button>

//   <button type="button" onClick={() => setStep(3)}
//     className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold">
//     Next →
//   </button>
// </div>
// </>
// )}

//             {/* 🛡️ EMPLOYMENT HISTORY (MULTIPLE ADD/DELETE) */}
//       {step === 3 && (
// <>
// <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-6">

//               <div className="flex justify-between items-center border-b border-white/10 pb-4">
//                 <div className="flex items-center gap-2">
//                   <History size={18} className="text-blue-400" />
//                   <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                     Employment History
//                   </h3>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setFormData({
//                       ...formData,
//                       experiences: [
//                         ...formData.experiences,
//                         {
//                           company_name: "",
//                           job_title: "",
//                           start_date: "",
//                           end_date: "",
//                           previous_ctc: 0,
//                           location: "",
//                           description: "",
//                         },
//                       ],
//                     })
//                   }
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
//                 >
//                   <Plus size={14} /> Add Company
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.experiences.map((exp, i) => (
//                   <div
//                     key={i}
//                     className="relative bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 group animate-in slide-in-from-bottom-2"
//                   >
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           experiences: formData.experiences.filter(
//                             (_, idx) => idx !== i,
//                           ),
//                         })
//                       }
//                       className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash2 size={16} />
//                     </button>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <input
//                         placeholder="Company Name"
//                         value={exp.company_name}
//                         onChange={(e) => {
//                           const u = [...formData.experiences];
//                           u[i].company_name = e.target.value;
//                           setFormData({ ...formData, experiences: u });
//                         }}
//                         className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500"
//                       />
//                       <input
//                         placeholder="Job Title"
//                         value={exp.job_title}
//                         onChange={(e) => {
//                           const u = [...formData.experiences];
//                           u[i].job_title = e.target.value;
//                           setFormData({ ...formData, experiences: u });
//                         }}
//                         className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">
//                           Start
//                         </label>
//                         <input
//                           type="date"
//                           value={exp.start_date}
//                           onChange={(e) => {
//                             const u = [...formData.experiences];
//                             u[i].start_date = e.target.value;
//                             setFormData({ ...formData, experiences: u });
//                           }}
//                           className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">
//                           End
//                         </label>
//                         <input
//                           type="date"
//                           value={exp.end_date}
//                           onChange={(e) => {
//                             const u = [...formData.experiences];
//                             u[i].end_date = e.target.value;
//                             setFormData({ ...formData, experiences: u });
//                           }}
//                           className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">
//                           CTC
//                         </label>
//                         <input
//                           type="number"
//                           placeholder="0"
//                           value={exp.previous_ctc}
//                           onChange={(e) => {
//                             const u = [...formData.experiences];
//                             u[i].previous_ctc = e.target.value;
//                             setFormData({ ...formData, experiences: u });
//                           }}
//                           className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">
//                           Location
//                         </label>
//                         <input
//                           placeholder="City"
//                           value={exp.location}
//                           onChange={(e) => {
//                             const u = [...formData.experiences];
//                             u[i].location = e.target.value;
//                             setFormData({ ...formData, experiences: u });
//                           }}
//                           className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white"
//                         />
//                       </div>
//                     </div>

//                     <textarea
//                       placeholder="Description of role..."
//                       rows={2}
//                       value={exp.description}
//                       onChange={(e) => {
//                         const u = [...formData.experiences];
//                         u[i].description = e.target.value;
//                         setFormData({ ...formData, experiences: u });
//                       }}
//                       className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-blue-500 resize-none"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-between">
//   <button onClick={() => setStep(2)} type="button"
//     className="px-6 py-3 bg-slate-200 rounded-xl text-xs font-bold">
//     ← Back
//   </button>

//   <button onClick={() => setStep(4)} type="button"
//     className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold">
//     Next →
//   </button>
// </div>
// </>
// )}

//             {/* QUALIFICATIONS & LOCATION */}
// {step === 4 && (
// <>
// <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <Award size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Professional Quals
//                   </h3>
//                 </div>

//                 <FormField label="Position">
//                   <input
//                     list="position-options"
//                     placeholder="Search position..."
//                     value={formData.position}
//                     onChange={(e) =>
//                       setFormData({ ...formData, position: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                   />

//                   <datalist id="position-options">
//                     {POSITION_OPTIONS.map((pos, i) => (
//                       <option key={i} value={pos} />
//                     ))}
//                   </datalist>
//                 </FormField>

//                 <FormField label="Experience">
//                   <div className="relative group">
//                     <History
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       placeholder="Total years"
//                       value={formData.experience}
//                       onChange={(e) =>
//                         setFormData({ ...formData, experience: e.target.value })
//                       }
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>

//                 <FormField label="Education">
//                   <div className="relative space-y-2">
//                     <input
//                       placeholder="Search or type education..."
//                       value={eduSearch || formData.education}
//                       onChange={(e) => {
//                         setEduSearch(e.target.value);
//                         setFormData({ ...formData, education: e.target.value });
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />

//                     {eduSearch && filteredEducation.length > 0 && (
//                       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//                         {filteredEducation.map((edu, i) => (
//                           <div
//                             key={i}
//                             onClick={() => {
//                               setFormData({ ...formData, education: edu });
//                               setEduSearch("");
//                             }}
//                             className="px-3 py-2 text-xs font-bold hover:bg-slate-100 cursor-pointer"
//                           >
//                             {edu}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </FormField>

//                 <FormField label="Department">
//                   <div className="relative space-y-2">
//                     <input
//                       placeholder="Search or type department..."
//                       value={deptSearch || formData.department}
//                       onChange={(e) => {
//                         setDeptSearch(e.target.value);
//                         setFormData({
//                           ...formData,
//                           department: e.target.value,
//                         });
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />

//                     {/* Dropdown */}
//                     {deptSearch && filteredDepartments.length > 0 && (
//                       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//                         {filteredDepartments.map((dept) => (
//                           <div
//                             key={dept.id}
//                             onClick={() => {
//                               setFormData({
//                                 ...formData,
//                                 department: dept.name,
//                               });
//                               setDeptSearch("");
//                             }}
//                             className="px-3 py-2 text-xs font-bold hover:bg-blue-50 cursor-pointer"
//                           >
//                             {dept.name}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </FormField>
//               </div>
//             </div>

//             <div className="flex justify-between">
//   <button onClick={() => setStep(3)} type="button"
//     className="px-6 py-3 bg-slate-200 rounded-xl text-xs font-bold">
//     ← Back
//   </button>

//   <button onClick={() => setStep(5)} type="button"
//     className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold">
//     Next →
//   </button>
// </div>
// </>
// )}

//             {/* SKILLS & ASSETS */}

//    {step === 5 && (
// <>
// <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50">

//               <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-200 flex items-center gap-3 rounded-t-[2.5rem]">
//                 <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
//                   Skills & Assets Inventory
//                 </h3>
//               </div>

//               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
//                 {/* TECHNICAL SKILLS SECTION */}
//                 <FormField label="Technical Expertise">
//                   <div className="space-y-4">
//                     {/* Chips Preview */}
//                     <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl transition-all">
//                       {formData.skills.map((skill, index) => (
//                         <span
//                           key={index}
//                           className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 text-[10px] font-black uppercase rounded-xl border border-blue-100 shadow-sm animate-in zoom-in-95"
//                         >
//                           {skill}
//                           <X
//                             size={14}
//                             className="cursor-pointer hover:text-red-500 transition-colors"
//                             onClick={() =>
//                               setFormData({
//                                 ...formData,
//                                 skills: formData.skills.filter(
//                                   (_, i) => i !== index,
//                                 ),
//                               })
//                             }
//                           />
//                         </span>
//                       ))}
//                       {formData.skills.length === 0 && (
//                         <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest my-auto ml-1">
//                           No Skills Logged
//                         </span>
//                       )}
//                     </div>

//                     <div className="relative">
//                       <div className="relative group z-30">
//                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                           <Cpu size={16} />
//                         </div>
//                         {/* <input
//               value={skillInput}
//               onChange={(e) => setSkillInput(e.target.value)}
              
//               placeholder="Click to search skills..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const val = skillInput.trim();
//                   if (val && !formData.skills.includes(val)) {
//                     setFormData({ ...formData, skills: [...formData.skills, val] });
//                   }
//                   setSkillInput("");
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
//             /> */}
//                         <input
//                           id="skill-input"
//                           value={skillInput}
//                           onFocus={() => setSkillFocused(true)}
//                           //   onBlur={() => setTimeout(() => setSkillFocused(false), 150)}
//                           onBlur={(e) => {
//                             const next = e.relatedTarget;
//                             if (
//                               !next ||
//                               !e.currentTarget.parentElement.contains(next)
//                             ) {
//                               setTimeout(() => setSkillFocused(false), 120);
//                             }
//                           }}
//                           onChange={(e) => setSkillInput(e.target.value)}
//                           placeholder="Click to search skills..."
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               const val = skillInput.trim();
//                               if (val && !formData.skills.includes(val)) {
//                                 setFormData({
//                                   ...formData,
//                                   skills: [...formData.skills, val],
//                                 });
//                               }
//                               setSkillInput("");
//                             }
//                           }}
//                           className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
//                         />
//                       </div>

//                       {/* Search Dropdown: Shows on Focus or when Typing */}
//                       {/* {(skillInput.length > 0 || document.activeElement === document.getElementById('skill-input')) && filteredSkills.length > 0 && (
//             <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//               <div className="max-h-48 overflow-y-auto no-scrollbar">
//                 {filteredSkills.map((skill, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setFormData({ ...formData, skills: [...formData.skills, skill] });
//                       setSkillInput("");
//                     }}
//                     className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                   >
//                     {skill}
//                     <Plus size={14} className="text-blue-400 opacity-40" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )} */}
//                       {skillFocused && filteredSkills.length > 0 && (
//                         <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//                           <div className="max-h-48 overflow-y-auto no-scrollbar">
//                             {filteredSkills.map((skill, i) => (
//                               <div
//                                 key={i}
//                                 //   onClick={() => {
//                                 //     setFormData({
//                                 //       ...formData,
//                                 //       skills: [...formData.skills, skill],
//                                 //     });
//                                 //     setSkillInput("");
//                                 //   }}
//                                 onMouseDown={(e) => {
//                                   e.preventDefault(); // stop blur
//                                   setFormData((prev) => ({
//                                     ...prev,
//                                     skills: [...prev.skills, skill],
//                                   }));
//                                   setSkillInput("");
//                                   setSkillFocused(false);
//                                 }}
//                                 className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                               >
//                                 {skill}
//                                 <Plus
//                                   size={14}
//                                   className="text-blue-400 opacity-40"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </FormField>

//                 {/* ASSETS ISSUED SECTION */}
//                 <FormField label="Enterprise Assets">
//                   <div className="space-y-4">
//                     {/* Chips Preview */}
//                     <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl transition-all">
//                       {formData.assets.map((asset, index) => (
//                         <span
//                           key={index}
//                           className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 text-[10px] font-black uppercase rounded-xl border border-slate-200 shadow-sm animate-in zoom-in-95"
//                         >
//                           {asset}
//                           <X
//                             size={14}
//                             className="cursor-pointer hover:text-red-500 transition-colors"
//                             onClick={() =>
//                               setFormData({
//                                 ...formData,
//                                 assets: formData.assets.filter(
//                                   (_, i) => i !== index,
//                                 ),
//                               })
//                             }
//                           />
//                         </span>
//                       ))}
//                       {formData.assets.length === 0 && (
//                         <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest my-auto ml-1">
//                           No Assets Assigned
//                         </span>
//                       )}
//                     </div>

//                     <div className="relative">
//                       <div className="relative group z-30">
//                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
//                           <Layers size={16} />
//                         </div>
//                         {/* <input
//               value={assetInput}
//               onChange={(e) => setAssetInput(e.target.value)}
//               placeholder="Click to assign assets..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const val = assetInput.trim();
//                   if (val && !formData.assets.includes(val)) {
//                     setFormData({ ...formData, assets: [...formData.assets, val] });
//                   }
//                   setAssetInput("");
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
//             /> */}
//                         <input
//                           value={assetInput}
//                           onFocus={() => setAssetFocused(true)}
//                           //   onBlur={() => setTimeout(() => setAssetFocused(false), 150)}
//                           onBlur={(e) => {
//                             const next = e.relatedTarget;
//                             if (
//                               !next ||
//                               !e.currentTarget.parentElement.contains(next)
//                             ) {
//                               setTimeout(() => setAssetFocused(false), 120);
//                             }
//                           }}
//                           onChange={(e) => setAssetInput(e.target.value)}
//                           placeholder="Click to assign assets..."
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               const val = assetInput.trim();
//                               if (val && !formData.assets.includes(val)) {
//                                 setFormData({
//                                   ...formData,
//                                   assets: [...formData.assets, val],
//                                 });
//                               }
//                               setAssetInput("");
//                             }
//                           }}
//                           className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-900"
//                         />
//                       </div>

//                       {/* Search Dropdown */}
//                       {/* {assetInput.length >= 0 && filteredAssets.length > 0 && (
//             <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//               <div className="max-h-48 overflow-y-auto no-scrollbar">
//                 {filteredAssets.map((asset, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setFormData({ ...formData, assets: [...formData.assets, asset] });
//                       setAssetInput("");
//                     }}
//                     className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                   >
//                     {asset}
//                     <Plus size={14} className="text-slate-400 opacity-40" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )} */}
//                       {assetFocused && filteredAssets.length > 0 && (
//                         <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//                           <div className="max-h-48 overflow-y-auto no-scrollbar">
//                             {filteredAssets.map((asset, i) => (
//                               <div
//                                 key={i}
//                                 //   onClick={() => {
//                                 //     setFormData({
//                                 //       ...formData,
//                                 //       assets: [...formData.assets, asset],
//                                 //     });
//                                 //     setAssetInput("");
//                                 //   }}
//                                 onMouseDown={(e) => {
//                                   e.preventDefault(); // stop blur
//                                   setFormData((prev) => ({
//                                     ...prev,
//                                     assets: [...prev.assets, asset],
//                                   }));
//                                   setAssetInput("");
//                                   setAssetFocused(false);
//                                 }}
//                                 className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                               >
//                                 {asset}
//                                 <Plus
//                                   size={14}
//                                   className="text-slate-400 opacity-40"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </FormField>
//               </div>
//             </div>

//             <div className="flex justify-between">
//   <button onClick={() => setStep(4)} type="button"
//     className="px-6 py-3 bg-slate-200 rounded-xl text-xs font-bold">
//     ← Back
//   </button>

//   <button onClick={() => setStep(6)} type="button"
//     className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold">
//     Next →
//   </button>
// </div>
// </>
// )}
//           </div>

//           {/* RIGHT COLUMN */}
// {step === 6 && (
// <div className="lg:col-span-4 space-y-8">

//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                   Registry Assets
//                 </h3>
//               </div>

//               {/* 1. MASTER RESUME TOGGLE */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
//                     1. Master Resume
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button
//                       type="button"
//                       onClick={() => setResumeMode("file")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "file" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       File
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setResumeMode("link")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "link" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       Link
//                     </button>
//                   </div>
//                 </div>
//                 {resumeMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center">
//                     <FileUp size={20} className="mx-auto text-blue-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">
//                       {formData.cvFile ? formData.cvFile.name : "Select PDF"}
//                     </p>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       className="hidden"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           cvFile: e.target.files[0],
//                           resume_link: "",
//                         })
//                       }
//                     />
//                   </label>
//                 ) : (
//                   <input
//                     placeholder="Paste Resume URL"
//                     value={formData.resume_link}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         resume_link: e.target.value,
//                         cvFile: null,
//                       })
//                     }
//                     className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-blue-500"
//                   />
//                 )}
//               </div>

//               {/* 2. EXPERIENCE LETTER TOGGLE */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
//                     2. Exp. Letter
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button
//                       type="button"
//                       onClick={() => setExpLetterMode("file")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "file" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       File
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setExpLetterMode("link")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "link" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       Link
//                     </button>
//                   </div>
//                 </div>
//                 {expLetterMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer text-center">
//                     <FileUp
//                       size={20}
//                       className="mx-auto text-purple-400 mb-2"
//                     />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">
//                       {formData.expLetterFile
//                         ? formData.expLetterFile.name
//                         : "Select PDF"}
//                     </p>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       className="hidden"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           expLetterFile: e.target.files[0],
//                           experience_letter_link: "",
//                         })
//                       }
//                     />
//                   </label>
//                 ) : (
//                   <input
//                     placeholder="Paste Letter URL"
//                     value={formData.experience_letter_link}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         experience_letter_link: e.target.value,
//                         expLetterFile: null,
//                       })
//                     }
//                     className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-purple-500"
//                   />
//                 )}
//               </div>

//               {/* 3. CERTIFICATES REGISTRY */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
//                     3. Certifications
//                   </p>
//                   <div className="flex gap-2">
//                     <label className="cursor-pointer p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20">
//                       <FileUp size={12} />
//                       <input
//                         type="file"
//                         multiple
//                         accept=".pdf"
//                         className="hidden"
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             certificateFiles: [
//                               ...formData.certificateFiles,
//                               ...Array.from(e.target.files),
//                             ],
//                           })
//                         }
//                       />
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           certificateLinks: [...formData.certificateLinks, ""],
//                         })
//                       }
//                       className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"
//                     >
//                       <LinkIcon size={12} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2 text-white">
//                   {formData.certificateFiles.map((file, idx) => (
//                     <div
//                       key={idx}
//                       className="flex justify-between bg-white/5 p-2 rounded-lg text-[9px]"
//                     >
//                       <span className="truncate">{file.name}</span>
//                       <X
//                         size={12}
//                         className="text-red-400 cursor-pointer"
//                         onClick={() =>
//                           setFormData({
//                             ...formData,
//                             certificateFiles: formData.certificateFiles.filter(
//                               (_, i) => i !== idx,
//                             ),
//                           })
//                         }
//                       />
//                     </div>
//                   ))}
//                   {formData.certificateLinks.map((link, idx) => (
//                     <div key={idx} className="flex gap-2">
//                       <input
//                         value={link}
//                         placeholder="Link"
//                         onChange={(e) => {
//                           const u = [...formData.certificateLinks];
//                           u[idx] = e.target.value;
//                           setFormData({ ...formData, certificateLinks: u });
//                         }}
//                         className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px]"
//                       />
//                       <X
//                         size={12}
//                         className="text-red-400 cursor-pointer my-auto"
//                         onClick={() =>
//                           setFormData({
//                             ...formData,
//                             certificateLinks: formData.certificateLinks.filter(
//                               (_, i) => i !== idx,
//                             ),
//                           })
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <Database size={18} />
//                     <span>Commit Record</span>
//                   </>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors text-center"
//               >
//                 Discard & Exit
//               </button>
//             </div>
//           </div>

//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//****************************************************************************************************************** */
// import React, { useState,useEffect } from "react";
// import {
//   Check,
//   FileText,
//   Award,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   Phone,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   ExternalLink,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   LinkIcon,
//   FileUp,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// // const FormField = ({ label, required, error, children }) => (
// //   <div className="space-y-1.5">
// //     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
// //       <span>
// //         {label} {required && <span className="text-red-500">*</span>}
// //       </span>
// //       {!required && (
// //         <span className="text-slate-300 font-bold normal-case">Optional</span>
// //       )}
// //     </label>
// //     {children}
// //     {error && (
// //       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
// //         {error}
// //       </p>
// //     )}
// //   </div>
// // );
// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>{label}</span>

//       {/* RIGHT SIDE TEXT */}
//       <span
//         className={`font-bold normal-case ${
//           required ? "text-red-500" : "text-slate-300"
//         }`}
//       >
//         {required ? "Required" : "Optional"}
//       </span>
//     </label>

//     {children}

//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
// const [cityOptions, setCityOptions] = useState([]);
//   // UI States for Toggles
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [departments, setDepartments] = useState([]);
// const [deptSearch, setDeptSearch] = useState("");
// const [skillFocused, setSkillFocused] = useState(false);
// const [assetFocused, setAssetFocused] = useState(false);
// const [assetInput, setAssetInput] = useState("");
// const [educationOptions, setEducationOptions] = useState([
//   "B.Tech",
//   "M.Tech",
//   "B.Sc",
//   "M.Sc",
//   "BCA",
//   "MCA",
//   "MBA",
//   "Diploma",
//   "PhD",
// ]);
// const [eduSearch, setEduSearch] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "India",
//     position: "",
//     education: "",
//     gender: "",
//     dob: "",
//     experience: "" ,
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     expLetterFile: null,
//     experience_letter_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value)
//       error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
//       error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value))
//       error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

// const fetchPincodeDetails = async (pincode) => {
//   if (!/^\d{6}$/.test(pincode)) return;

//   try {
//     setIsFetchingPincode(true);

//     const res = await fetch(
//       `https://api.postalpincode.in/pincode/${pincode}`
//     );
//     const data = await res.json();

//     if (data[0]?.Status === "Success") {
//       const offices = data[0].PostOffice;

//       const cities = offices.map((o) => o.Name);
//       setCityOptions(cities);

//       setFormData((prev) => ({
//         ...prev,
//         city: cities.length === 1 ? cities[0] : "",   // ✅ auto fill single
//         state: offices[0].State,
//         district: offices[0].District,
//         country: offices[0].Country,
//       }));
//     }
//   } catch {
//     toast.error("Location lookup failed");
//   } finally {
//     setIsFetchingPincode(false);
//   }
// };

// useEffect(() => {
//   const loadDepartments = async () => {
//     try {
//       const data = await departmentService.getAll();
//       setDepartments(data || []);
//     } catch (err) {
//       toast.error("Failed to load departments");
//     }
//   };

//   loadDepartments();
// }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log(formData)
//     const isNameValid = validateField("name", formData.name);
//     const isEmailValid = validateField("email", formData.email);
//     const isPhoneValid = validateField("phone", formData.phone);

//     if (!isNameValid || !isEmailValid || !isPhoneValid) {
//       toast.error("Please fill required fields correctly");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//     //   Object.keys(formData).forEach((key) => {
//     //     if (
//     //       formData[key] &&
//     //       ![
//     //         "experiences",
//     //         "certificateFiles",
//     //         "languages_spoken",
//     //         "cvFile",
//     //         "expLetterFile",
//     //         "certificateLinks",
//     //       ].includes(key)
//     //     ) {
//     //       formDataApi.append(key, formData[key]);
//     //     }
//     //   });
//     Object.keys(formData).forEach((key) => {
//   if (
//     formData[key] &&
//     ![
//       "experiences",
//       "certificateFiles",
//       "languages_spoken",
//       "cvFile",
//       "expLetterFile",
//       "certificateLinks",
//     ].includes(key)
//   ) {
//     formDataApi.append(key, formData[key]);
//   }
// });
// formDataApi.append("full_name", formData.name);

//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile)
//         formDataApi.append("experience_letter", formData.expLetterFile);
// //      const cleanLanguages = formData.languages_spoken
// //   .map((l) => String(l).replace(/[\[\]"]/g, "").trim())
// //   .filter(Boolean);

// // formDataApi.append(
// //   "languages_spoken",
// //   JSON.stringify(cleanLanguages)
// // );

// // formDataApi.append(
// //   "languages_spoken",
// //   JSON.stringify(cleanLanguages)
// // );

// // const cleanLanguages = formData.languages_spoken
// //   .map((l) => String(l).trim())
// //   .filter(Boolean);

// // formDataApi.append("languages_spoken", JSON.stringify(cleanLanguages));
// const cleanLanguages = formData.languages_spoken
//   .map((l) => String(l).trim())
//   .filter(Boolean)
//   .join(", ");

// formDataApi.append("languages_spoken", cleanLanguages);

//       // ✅ Added Experience details as JSON string per API standards
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));

//       formData.certificateFiles.forEach((file) =>
//         formDataApi.append("certificate_files[]", file),
//       );
//     //   formDataApi.append(
//     //     "certificate_links",
//     //     JSON.stringify(formData.certificateLinks.filter(Boolean)),
//     //   );
// //    const cleanLinks = formData.certificateLinks
// //   .map((l) => String(l).replace(/[\[\]"]/g, "").trim())
// //   .filter((l) => l.startsWith("http"));

// // formDataApi.append("certificate_links", JSON.stringify(cleanLinks));

// // const cleanLinks = formData.certificateLinks
// //   .map((l) => String(l).trim())
// //   .filter((l) => l.startsWith("http"));

// // formDataApi.append("certificate_links", JSON.stringify(cleanLinks));
// const cleanLinks = formData.certificateLinks
//   .map((l) => String(l).trim())
//   .filter((l) => l.startsWith("http"));

// cleanLinks.forEach((link) => {
//   formDataApi.append("certificate_links", link);
// });

//       await candidateService.createCandidate(formDataApi);
//       toast.success("Candidate record committed successfully 🎉");
//     } catch (err) {
//       toast.error("Failed to commit record");
//     } finally {
//       setLoading(false);
//     }
//   };

//     const SKILL_OPTIONS = [
//   "React",
//   "JavaScript",
//   "Node.js",
//   "MongoDB",
//   "MySQL",
//   "HTML",
//   "CSS",
//   "Tailwind",
//   "Python",
//   "Java",
//   "AWS",
//   "Docker",
// ];

// const ASSET_OPTIONS = [
//   "Laptop",
//   "Mouse",
//   "Keyboard",
//   "Monitor",
//   "Headset",
//   "Mobile",
//   "ID Card",
//   "SIM Card",
// ];

// const POSITION_OPTIONS = [
//   "Frontend Developer",
//   "Backend Developer",
//   "Full Stack Developer",
//   "HR Executive",
//   "HR Manager",
//   "UI/UX Designer",
//   "QA Engineer",
//   "DevOps Engineer",
//   "Software Engineer",
//   "Data Analyst",
// ];

//   const filteredSkills = SKILL_OPTIONS.filter(
//   (s) =>
//     s.toLowerCase().includes(skillInput.toLowerCase()) &&
//     !formData.skills.includes(s)
// );

// const filteredAssets = ASSET_OPTIONS.filter(
//   (a) =>
//     a.toLowerCase().includes(assetInput.toLowerCase()) &&
//     !formData.assets.includes(a)
// );

// const filteredDepartments = departments.filter((d) =>
//   d.name?.toLowerCase().includes(deptSearch.toLowerCase())
// );

// const filteredEducation = educationOptions.filter((e) =>
//   e.toLowerCase().includes(eduSearch.toLowerCase())
// );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 Manual Candidate Entry
//               </h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                 Talent Acquisition Registry
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">
//               Enterprise Security Enabled
//             </span>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* PERSONAL INFO */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <User size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                   Personal Identification
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Full Name" required error={errors.name}>
//                   <input
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("name", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//                 <FormField label="Email Address" required error={errors.email}>
//                   <input
//                     type="email"
//                     placeholder="john@company.com"
//                     value={formData.email}
//                     onChange={(e) => {
//                       setFormData({ ...formData, email: e.target.value });
//                       validateField("email", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                     <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">
//                       +91
//                     </div>
//                     <input
//                       maxLength={10}
//                       placeholder="9876543210"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const v = e.target.value
//                           .replace(/\D/g, "")
//                           .slice(0, 10);
//                         setFormData({ ...formData, phone: v });
//                         validateField("phone", v);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                     />
//                   </div>
//                 </FormField>
//                 <FormField label="Gender">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) =>
//                       setFormData({ ...formData, gender: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Date of Birth">
//                   <input
//                     type="date"
//                     value={formData.dob}
//                     onChange={(e) =>
//                       setFormData({ ...formData, dob: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                   />
//                 </FormField>
//                 <FormField label="Languages Spoken">
//                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar space-y-2">
//                     {[
//                       "English",
//                       "Hindi",
//                       "Marathi",
//                       "Gujarati",
//                       "Tamil",
//                       "Telugu",
//                     ].map((lang) => (
//                       <label
//                         key={lang}
//                         className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.languages_spoken.includes(lang)}
//                           onChange={() => {
//                             const updated = formData.languages_spoken.includes(
//                               lang,
//                             )
//                               ? formData.languages_spoken.filter(
//                                   (l) => l !== lang,
//                                 )
//                               : [...formData.languages_spoken, lang];
//                             setFormData({
//                               ...formData,
//                               languages_spoken: updated,
//                             });
//                           }}
//                           className="w-4 h-4 accent-blue-600 rounded"
//                         />{" "}
//                         {lang}
//                       </label>
//                     ))}
//                   </div>
//                 </FormField>
//               </div>

//               <FormField label="About Profile Summary">
//                 <textarea
//                   rows={3}
//                   placeholder="Brief summary..."
//                   value={formData.about_me}
//                   onChange={(e) =>
//                     setFormData({ ...formData, about_me: e.target.value })
//                   }
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none transition-all"
//                 />
//               </FormField>
//             </div>

//             <div>
//                   <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <MapPin size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Location Data
//                   </h3>
//                 </div>
//                 <div>
//                      <FormField label="Address 1" required error={errors.name}>
//                   <input
//                     placeholder="address 1"
//                     value={formData.address1}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("address", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">

//                 <FormField label="Address 2" required error={errors.name}>
//                   <input
//                     placeholder="address 2"
//                     value={formData.address1}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("address", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>

//                  <FormField label="Location" required error={errors.name}>
//                   <input
//                     placeholder="location"
//                     value={formData.location}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("address", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//                   <FormField required label="Pincode">
//                     <input
//                       placeholder="6 Digits"
//                       maxLength={6}
//                       value={formData.pincode}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "");
//                         setFormData({ ...formData, pincode: v });
//                         if (v.length === 6) fetchPincodeDetails(v);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />
//                   </FormField>

//                   <FormField label="City">
//   {cityOptions.length > 1 ? (
//     <select
//       value={formData.city}
//       onChange={(e) =>
//         setFormData({ ...formData, city: e.target.value })
//       }
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
//     >
//       <option value="">Select City</option>
//       {cityOptions.map((c, i) => (
//         <option key={i} value={c}>
//           {c}
//         </option>
//       ))}
//     </select>
//   ) : (
//     <input
//       value={formData.city}
//       readOnly
//       placeholder="Auto-filled"
//       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
//     />
//   )}
// </FormField>

//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="District">
//                     <input value={formData.district} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField>
//                   <FormField label="State">
//                     <input value={formData.state} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField>
//                 </div>
//                 <FormField label="Country">
//                     <input value={formData.country} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                 </FormField>

//               </div>
//             </div>

//             {/* 🛡️ EMPLOYMENT HISTORY (MULTIPLE ADD/DELETE) */}
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-6">
//               <div className="flex justify-between items-center border-b border-white/10 pb-4">
//                 <div className="flex items-center gap-2">
//                   <History size={18} className="text-blue-400" />
//                   <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                     Employment History
//                   </h3>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setFormData({
//                     ...formData,
//                     experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }]
//                   })}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
//                 >
//                   <Plus size={14} /> Add Company
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.experiences.map((exp, i) => (
//                   <div key={i} className="relative bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 group animate-in slide-in-from-bottom-2">
//                     <button
//                       type="button"
//                       onClick={() => setFormData({
//                         ...formData,
//                         experiences: formData.experiences.filter((_, idx) => idx !== i)
//                       })}
//                       className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash2 size={16} />
//                     </button>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({...formData, experiences: u}); }} className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500" />
//                       <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({...formData, experiences: u}); }} className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500" />
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">Start</label>
//                         <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">End</label>
//                         <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">CTC</label>
//                         <input type="number" placeholder="0" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">Location</label>
//                         <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                     </div>

//                     <textarea placeholder="Description of role..." rows={2} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-blue-500 resize-none" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* QUALIFICATIONS & LOCATION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <Award size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Professional Quals
//                   </h3>
//                 </div>

//                 <FormField label="Position">
//   <input
//     list="position-options"
//     placeholder="Search position..."
//     value={formData.position}
//     onChange={(e) =>
//       setFormData({ ...formData, position: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />

//   <datalist id="position-options">
//     {POSITION_OPTIONS.map((pos, i) => (
//       <option key={i} value={pos} />
//     ))}
//   </datalist>
// </FormField>

//                 <FormField label="Experience">
//                   <div className="relative group">
//                     <History className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input type="number" placeholder="Total years" value={formData.experience}
// onChange={(e) =>
//   setFormData({ ...formData, experience: e.target.value })
// }
//  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
//                   </div>
//                 </FormField>

// <FormField label="Education">
//   <div className="relative space-y-2">

//     <input
//       placeholder="Search or type education..."
//       value={eduSearch || formData.education}
//       onChange={(e) => {
//         setEduSearch(e.target.value);
//         setFormData({ ...formData, education: e.target.value });
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {eduSearch && filteredEducation.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredEducation.map((edu, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({ ...formData, education: edu });
//               setEduSearch("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-slate-100 cursor-pointer"
//           >
//             {edu}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </FormField>

// <FormField label="Department">
//   <div className="relative space-y-2">

//     <input
//       placeholder="Search or type department..."
//       value={deptSearch || formData.department}
//       onChange={(e) => {
//         setDeptSearch(e.target.value);
//         setFormData({ ...formData, department: e.target.value });
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {/* Dropdown */}
//     {deptSearch && filteredDepartments.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredDepartments.map((dept) => (
//           <div
//             key={dept.id}
//             onClick={() => {
//               setFormData({ ...formData, department: dept.name });
//               setDeptSearch("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-blue-50 cursor-pointer"
//           >
//             {dept.name}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </FormField>

//               </div>

//             </div>

//             {/* SKILLS & ASSETS */}

// <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
//   <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-200 flex items-center gap-3 rounded-t-[2.5rem]">
//     <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//     <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
//       Skills & Assets Inventory
//     </h3>
//   </div>

//   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
//     {/* TECHNICAL SKILLS SECTION */}
//     <FormField label="Technical Expertise">
//       <div className="space-y-4">
//         {/* Chips Preview */}
//         <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl transition-all">
//           {formData.skills.map((skill, index) => (
//             <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 text-[10px] font-black uppercase rounded-xl border border-blue-100 shadow-sm animate-in zoom-in-95">
//               {skill}
//               <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })} />
//             </span>
//           ))}
//           {formData.skills.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest my-auto ml-1">No Skills Logged</span>}
//         </div>

//         <div className="relative">
//           <div className="relative group z-30">
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//               <Cpu size={16} />
//             </div>
//             {/* <input
//               value={skillInput}
//               onChange={(e) => setSkillInput(e.target.value)}

//               placeholder="Click to search skills..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const val = skillInput.trim();
//                   if (val && !formData.skills.includes(val)) {
//                     setFormData({ ...formData, skills: [...formData.skills, val] });
//                   }
//                   setSkillInput("");
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
//             /> */}
//             <input
//   id="skill-input"
//   value={skillInput}
//   onFocus={() => setSkillFocused(true)}
// //   onBlur={() => setTimeout(() => setSkillFocused(false), 150)}
// onBlur={(e) => {
//   const next = e.relatedTarget;
//   if (!next || !e.currentTarget.parentElement.contains(next)) {
//     setTimeout(() => setSkillFocused(false), 120);
//   }
// }}

//   onChange={(e) => setSkillInput(e.target.value)}
//   placeholder="Click to search skills..."
//   onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const val = skillInput.trim();
//       if (val && !formData.skills.includes(val)) {
//         setFormData({
//           ...formData,
//           skills: [...formData.skills, val],
//         });
//       }
//       setSkillInput("");
//     }
//   }}
//   className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
// />

//           </div>

//           {/* Search Dropdown: Shows on Focus or when Typing */}
//           {/* {(skillInput.length > 0 || document.activeElement === document.getElementById('skill-input')) && filteredSkills.length > 0 && (
//             <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//               <div className="max-h-48 overflow-y-auto no-scrollbar">
//                 {filteredSkills.map((skill, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setFormData({ ...formData, skills: [...formData.skills, skill] });
//                       setSkillInput("");
//                     }}
//                     className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                   >
//                     {skill}
//                     <Plus size={14} className="text-blue-400 opacity-40" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )} */}
//           {skillFocused && filteredSkills.length > 0 && (
//   <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//     <div className="max-h-48 overflow-y-auto no-scrollbar">
//       {filteredSkills.map((skill, i) => (
//         <div
//           key={i}
//         //   onClick={() => {
//         //     setFormData({
//         //       ...formData,
//         //       skills: [...formData.skills, skill],
//         //     });
//         //     setSkillInput("");
//         //   }}
//         onMouseDown={(e) => {
//   e.preventDefault(); // stop blur
//   setFormData((prev) => ({
//     ...prev,
//     skills: [...prev.skills, skill],
//   }));
//   setSkillInput("");
//   setSkillFocused(false);
// }}

//           className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//         >
//           {skill}
//           <Plus size={14} className="text-blue-400 opacity-40" />
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//         </div>
//       </div>
//     </FormField>

//     {/* ASSETS ISSUED SECTION */}
//     <FormField label="Enterprise Assets">
//       <div className="space-y-4">
//         {/* Chips Preview */}
//         <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl transition-all">
//           {formData.assets.map((asset, index) => (
//             <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 text-[10px] font-black uppercase rounded-xl border border-slate-200 shadow-sm animate-in zoom-in-95">
//               {asset}
//               <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setFormData({ ...formData, assets: formData.assets.filter((_, i) => i !== index) })} />
//             </span>
//           ))}
//           {formData.assets.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest my-auto ml-1">No Assets Assigned</span>}
//         </div>

//         <div className="relative">
//           <div className="relative group z-30">
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
//               <Layers size={16} />
//             </div>
//             {/* <input
//               value={assetInput}
//               onChange={(e) => setAssetInput(e.target.value)}
//               placeholder="Click to assign assets..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const val = assetInput.trim();
//                   if (val && !formData.assets.includes(val)) {
//                     setFormData({ ...formData, assets: [...formData.assets, val] });
//                   }
//                   setAssetInput("");
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
//             /> */}
//             <input
//   value={assetInput}
//   onFocus={() => setAssetFocused(true)}
// //   onBlur={() => setTimeout(() => setAssetFocused(false), 150)}
// onBlur={(e) => {
//   const next = e.relatedTarget;
//   if (!next || !e.currentTarget.parentElement.contains(next)) {
//     setTimeout(() => setAssetFocused(false), 120);
//   }
// }}

//   onChange={(e) => setAssetInput(e.target.value)}
//   placeholder="Click to assign assets..."
//   onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const val = assetInput.trim();
//       if (val && !formData.assets.includes(val)) {
//         setFormData({ ...formData, assets: [...formData.assets, val] });
//       }
//       setAssetInput("");
//     }
//   }}
//   className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-900"
// />

//           </div>

//           {/* Search Dropdown */}
//           {/* {assetInput.length >= 0 && filteredAssets.length > 0 && (
//             <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//               <div className="max-h-48 overflow-y-auto no-scrollbar">
//                 {filteredAssets.map((asset, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setFormData({ ...formData, assets: [...formData.assets, asset] });
//                       setAssetInput("");
//                     }}
//                     className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                   >
//                     {asset}
//                     <Plus size={14} className="text-slate-400 opacity-40" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )} */}
//           {assetFocused && filteredAssets.length > 0 && (
//   <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//     <div className="max-h-48 overflow-y-auto no-scrollbar">
//       {filteredAssets.map((asset, i) => (
//         <div
//           key={i}
//         //   onClick={() => {
//         //     setFormData({
//         //       ...formData,
//         //       assets: [...formData.assets, asset],
//         //     });
//         //     setAssetInput("");
//         //   }}
//         onMouseDown={(e) => {
//   e.preventDefault(); // stop blur
//   setFormData((prev) => ({
//     ...prev,
//     assets: [...prev.assets, asset],
//   }));
//   setAssetInput("");
//   setAssetFocused(false);
// }}

//           className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//         >
//           {asset}
//           <Plus size={14} className="text-slate-400 opacity-40" />
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//         </div>
//       </div>
//     </FormField>
//   </div>
// </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                   Registry Assets
//                 </h3>
//               </div>

//               {/* 1. MASTER RESUME TOGGLE */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
//                     1. Master Resume
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button type="button" onClick={() => setResumeMode("file")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "file" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>File</button>
//                     <button type="button" onClick={() => setResumeMode("link")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "link" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Link</button>
//                   </div>
//                 </div>
//                 {resumeMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center">
//                     <FileUp size={20} className="mx-auto text-blue-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.cvFile ? formData.cvFile.name : "Select PDF"}</p>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, cvFile: e.target.files[0], resume_link: "" })} />
//                   </label>
//                 ) : (
//                   <input placeholder="Paste Resume URL" value={formData.resume_link} onChange={(e) => setFormData({ ...formData, resume_link: e.target.value, cvFile: null })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-blue-500" />
//                 )}
//               </div>

//               {/* 2. EXPERIENCE LETTER TOGGLE */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">2. Exp. Letter</p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button type="button" onClick={() => setExpLetterMode("file")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "file" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>File</button>
//                     <button type="button" onClick={() => setExpLetterMode("link")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "link" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Link</button>
//                   </div>
//                 </div>
//                 {expLetterMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer text-center">
//                     <FileUp size={20} className="mx-auto text-purple-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.expLetterFile ? formData.expLetterFile.name : "Select PDF"}</p>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, expLetterFile: e.target.files[0], experience_letter_link: "" })} />
//                   </label>
//                 ) : (
//                   <input placeholder="Paste Letter URL" value={formData.experience_letter_link} onChange={(e) => setFormData({ ...formData, experience_letter_link: e.target.value, expLetterFile: null })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-purple-500" />
//                 )}
//               </div>

//               {/* 3. CERTIFICATES REGISTRY */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">3. Certifications</p>
//                   <div className="flex gap-2">
//                     <label className="cursor-pointer p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20"><FileUp size={12} /><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)] })} /></label>
//                     <button type="button" onClick={() => setFormData({ ...formData, certificateLinks: [...formData.certificateLinks, ""] })} className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"><LinkIcon size={12} /></button>
//                   </div>
//                 </div>
//                 <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2 text-white">
//                   {formData.certificateFiles.map((file, idx) => (
//                     <div key={idx} className="flex justify-between bg-white/5 p-2 rounded-lg text-[9px]"><span className="truncate">{file.name}</span><X size={12} className="text-red-400 cursor-pointer" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})} /></div>
//                   ))}
//                   {formData.certificateLinks.map((link, idx) => (
//                     <div key={idx} className="flex gap-2"><input value={link} placeholder="Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({ ...formData, certificateLinks: u }); }} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px]" /><X size={12} className="text-red-400 cursor-pointer my-auto" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} /></div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50">
//                 {loading ? <Loader2 className="animate-spin" size={20} /> : <><Database size={18} /><span>Commit Record</span></>}
//               </button>
//               <button type="button" onClick={() => window.history.back()} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors text-center">Discard & Exit</button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//*************************************************working code phase 22 ****************************************************** */
// import React, { useState,useEffect } from "react";
// import {
//   Check,
//   FileText,
//   Award,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   Phone,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   ExternalLink,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   LinkIcon,
//   FileUp,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>
//         {label} {required && <span className="text-red-500">*</span>}
//       </span>
//       {!required && (
//         <span className="text-slate-300 font-bold normal-case">Optional</span>
//       )}
//     </label>
//     {children}
//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
// const [cityOptions, setCityOptions] = useState([]);
//   // UI States for Toggles
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [departments, setDepartments] = useState([]);
// const [deptSearch, setDeptSearch] = useState("");

// const [assetInput, setAssetInput] = useState("");
// const [educationOptions, setEducationOptions] = useState([
//   "B.Tech",
//   "M.Tech",
//   "B.Sc",
//   "M.Sc",
//   "BCA",
//   "MCA",
//   "MBA",
//   "Diploma",
//   "PhD",
// ]);
// const [eduSearch, setEduSearch] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "",
//     position: "",
//     education: "",
//     gender: "",
//     dob: "",
//     experience: "" ,
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     expLetterFile: null,
//     experience_letter_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value)
//       error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
//       error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value))
//       error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

// //   const fetchPincodeDetails = async (pincode) => {
// //     if (!/^\d{6}$/.test(pincode)) return;
// //     try {
// //       setIsFetchingPincode(true);
// //       const res = await fetch(
// //         `https://api.postalpincode.in/pincode/${pincode}`,
// //       );
// //       const data = await res.json();
// //       if (data[0]?.Status === "Success") {
// //         const postOffice = data[0].PostOffice[0];
// //         setFormData((prev) => ({
// //           ...prev,
// //           city: postOffice.Name,
// //           state: postOffice.State,
// //           district: postOffice.District,
// //           country: postOffice.Country,
// //         }));
// //       }
// //     } catch {
// //       toast.error("Location lookup failed");
// //     } finally {
// //       setIsFetchingPincode(false);
// //     }
// //   };

// const fetchPincodeDetails = async (pincode) => {
//   if (!/^\d{6}$/.test(pincode)) return;

//   try {
//     setIsFetchingPincode(true);

//     const res = await fetch(
//       `https://api.postalpincode.in/pincode/${pincode}`
//     );
//     const data = await res.json();

//     if (data[0]?.Status === "Success") {
//       const offices = data[0].PostOffice;

//       const cities = offices.map((o) => o.Name);
//       setCityOptions(cities);

//       setFormData((prev) => ({
//         ...prev,
//         city: cities.length === 1 ? cities[0] : "",   // ✅ auto fill single
//         state: offices[0].State,
//         district: offices[0].District,
//         country: offices[0].Country,
//       }));
//     }
//   } catch {
//     toast.error("Location lookup failed");
//   } finally {
//     setIsFetchingPincode(false);
//   }
// };

// useEffect(() => {
//   const loadDepartments = async () => {
//     try {
//       const data = await departmentService.getAll();
//       setDepartments(data || []);
//     } catch (err) {
//       toast.error("Failed to load departments");
//     }
//   };

//   loadDepartments();
// }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isNameValid = validateField("name", formData.name);
//     const isEmailValid = validateField("email", formData.email);
//     const isPhoneValid = validateField("phone", formData.phone);

//     if (!isNameValid || !isEmailValid || !isPhoneValid) {
//       toast.error("Please fill required fields correctly");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (
//           formData[key] &&
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "expLetterFile",
//             "certificateLinks",
//           ].includes(key)
//         ) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile)
//         formDataApi.append("experience_letter", formData.expLetterFile);
//      const cleanLanguages = formData.languages_spoken
//   .map((l) => String(l).replace(/[\[\]"]/g, "").trim())
//   .filter(Boolean);

// formDataApi.append(
//   "languages_spoken",
//   JSON.stringify(cleanLanguages)
// );

//       // ✅ Added Experience details as JSON string per API standards
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));

//       formData.certificateFiles.forEach((file) =>
//         formDataApi.append("certificate_files[]", file),
//       );
//       formDataApi.append(
//         "certificate_links",
//         JSON.stringify(formData.certificateLinks.filter(Boolean)),
//       );

//       await candidateService.createCandidate(formDataApi);
//       toast.success("Candidate record committed successfully 🎉");
//     } catch (err) {
//       toast.error("Failed to commit record");
//     } finally {
//       setLoading(false);
//     }
//   };

//     const SKILL_OPTIONS = [
//   "React",
//   "JavaScript",
//   "Node.js",
//   "MongoDB",
//   "MySQL",
//   "HTML",
//   "CSS",
//   "Tailwind",
//   "Python",
//   "Java",
//   "AWS",
//   "Docker",
// ];

// const ASSET_OPTIONS = [
//   "Laptop",
//   "Mouse",
//   "Keyboard",
//   "Monitor",
//   "Headset",
//   "Mobile",
//   "ID Card",
//   "SIM Card",
// ];

// const POSITION_OPTIONS = [
//   "Frontend Developer",
//   "Backend Developer",
//   "Full Stack Developer",
//   "HR Executive",
//   "HR Manager",
//   "UI/UX Designer",
//   "QA Engineer",
//   "DevOps Engineer",
//   "Software Engineer",
//   "Data Analyst",
// ];

//   const filteredSkills = SKILL_OPTIONS.filter(
//   (s) =>
//     s.toLowerCase().includes(skillInput.toLowerCase()) &&
//     !formData.skills.includes(s)
// );

// const filteredAssets = ASSET_OPTIONS.filter(
//   (a) =>
//     a.toLowerCase().includes(assetInput.toLowerCase()) &&
//     !formData.assets.includes(a)
// );

// const filteredDepartments = departments.filter((d) =>
//   d.name?.toLowerCase().includes(deptSearch.toLowerCase())
// );

// const filteredEducation = educationOptions.filter((e) =>
//   e.toLowerCase().includes(eduSearch.toLowerCase())
// );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 Manual Candidate Entry
//               </h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                 Talent Acquisition Registry
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">
//               Enterprise Security Enabled
//             </span>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* PERSONAL INFO */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <User size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                   Personal Identification
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Full Name" required error={errors.name}>
//                   <input
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("name", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//                 <FormField label="Email Address" required error={errors.email}>
//                   <input
//                     type="email"
//                     placeholder="john@company.com"
//                     value={formData.email}
//                     onChange={(e) => {
//                       setFormData({ ...formData, email: e.target.value });
//                       validateField("email", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                     <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">
//                       +91
//                     </div>
//                     <input
//                       maxLength={10}
//                       placeholder="9876543210"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const v = e.target.value
//                           .replace(/\D/g, "")
//                           .slice(0, 10);
//                         setFormData({ ...formData, phone: v });
//                         validateField("phone", v);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                     />
//                   </div>
//                 </FormField>
//                 <FormField label="Gender">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) =>
//                       setFormData({ ...formData, gender: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Date of Birth">
//                   <input
//                     type="date"
//                     value={formData.dob}
//                     onChange={(e) =>
//                       setFormData({ ...formData, dob: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                   />
//                 </FormField>
//                 <FormField label="Languages Spoken">
//                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar space-y-2">
//                     {[
//                       "English",
//                       "Hindi",
//                       "Marathi",
//                       "Gujarati",
//                       "Tamil",
//                       "Telugu",
//                     ].map((lang) => (
//                       <label
//                         key={lang}
//                         className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.languages_spoken.includes(lang)}
//                           onChange={() => {
//                             const updated = formData.languages_spoken.includes(
//                               lang,
//                             )
//                               ? formData.languages_spoken.filter(
//                                   (l) => l !== lang,
//                                 )
//                               : [...formData.languages_spoken, lang];
//                             setFormData({
//                               ...formData,
//                               languages_spoken: updated,
//                             });
//                           }}
//                           className="w-4 h-4 accent-blue-600 rounded"
//                         />{" "}
//                         {lang}
//                       </label>
//                     ))}
//                   </div>
//                 </FormField>
//               </div>

//               <FormField label="About Profile Summary">
//                 <textarea
//                   rows={3}
//                   placeholder="Brief summary..."
//                   value={formData.about_me}
//                   onChange={(e) =>
//                     setFormData({ ...formData, about_me: e.target.value })
//                   }
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none transition-all"
//                 />
//               </FormField>
//             </div>

//             {/* 🛡️ EMPLOYMENT HISTORY (MULTIPLE ADD/DELETE) */}
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-6">
//               <div className="flex justify-between items-center border-b border-white/10 pb-4">
//                 <div className="flex items-center gap-2">
//                   <History size={18} className="text-blue-400" />
//                   <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                     Employment History
//                   </h3>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setFormData({
//                     ...formData,
//                     experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }]
//                   })}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
//                 >
//                   <Plus size={14} /> Add Company
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.experiences.map((exp, i) => (
//                   <div key={i} className="relative bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 group animate-in slide-in-from-bottom-2">
//                     <button
//                       type="button"
//                       onClick={() => setFormData({
//                         ...formData,
//                         experiences: formData.experiences.filter((_, idx) => idx !== i)
//                       })}
//                       className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash2 size={16} />
//                     </button>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({...formData, experiences: u}); }} className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500" />
//                       <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({...formData, experiences: u}); }} className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500" />
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">Start</label>
//                         <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">End</label>
//                         <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">CTC</label>
//                         <input type="number" placeholder="0" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">Location</label>
//                         <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                     </div>

//                     <textarea placeholder="Description of role..." rows={2} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-blue-500 resize-none" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* QUALIFICATIONS & LOCATION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <Award size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Professional Quals
//                   </h3>
//                 </div>
//                 {/* <FormField label="Position">
//                   <div className="relative group">
//                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input
//                       list="position-options"
//                       placeholder="Search position..."
//                       value={formData.position}
//                       onChange={(e) => setFormData({...formData, position: e.target.value})}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField> */}
//                 <FormField label="Position">
//   <input
//     list="position-options"
//     placeholder="Search position..."
//     value={formData.position}
//     onChange={(e) =>
//       setFormData({ ...formData, position: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />

//   <datalist id="position-options">
//     {POSITION_OPTIONS.map((pos, i) => (
//       <option key={i} value={pos} />
//     ))}
//   </datalist>
// </FormField>

//                 <FormField label="Experience">
//                   <div className="relative group">
//                     <History className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input type="number" placeholder="Total years" value={formData.experience}
// onChange={(e) =>
//   setFormData({ ...formData, experience: e.target.value })
// }
//  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
//                   </div>
//                 </FormField>

//                 {/* <FormField label="Education">
//   <input
//     placeholder="Degree / Qualification"
//     value={formData.education}
//     onChange={(e) =>
//       setFormData({ ...formData, education: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />
// </FormField> */}

// <FormField label="Education">
//   <div className="relative space-y-2">

//     <input
//       placeholder="Search or type education..."
//       value={eduSearch || formData.education}
//       onChange={(e) => {
//         setEduSearch(e.target.value);
//         setFormData({ ...formData, education: e.target.value });
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {eduSearch && filteredEducation.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredEducation.map((edu, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({ ...formData, education: edu });
//               setEduSearch("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-slate-100 cursor-pointer"
//           >
//             {edu}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </FormField>

// {/* <FormField label="Department">
//   <input
//     placeholder="Department"
//     value={formData.department}
//     onChange={(e) =>
//       setFormData({ ...formData, department: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />
// </FormField> */}

// <FormField label="Department">
//   <div className="relative space-y-2">

//     <input
//       placeholder="Search or type department..."
//       value={deptSearch || formData.department}
//       onChange={(e) => {
//         setDeptSearch(e.target.value);
//         setFormData({ ...formData, department: e.target.value });
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {/* Dropdown */}
//     {deptSearch && filteredDepartments.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredDepartments.map((dept) => (
//           <div
//             key={dept.id}
//             onClick={() => {
//               setFormData({ ...formData, department: dept.name });
//               setDeptSearch("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-blue-50 cursor-pointer"
//           >
//             {dept.name}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </FormField>

//               </div>

//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <MapPin size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Location Data
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="Pincode">
//                     <input
//                       placeholder="6 Digits"
//                       maxLength={6}
//                       value={formData.pincode}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "");
//                         setFormData({ ...formData, pincode: v });
//                         if (v.length === 6) fetchPincodeDetails(v);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />
//                   </FormField>
//                   {/* <FormField label="City">
//                     <input value={formData.city} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField> */}
//                   <FormField label="City">
//   {cityOptions.length > 1 ? (
//     <select
//       value={formData.city}
//       onChange={(e) =>
//         setFormData({ ...formData, city: e.target.value })
//       }
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
//     >
//       <option value="">Select City</option>
//       {cityOptions.map((c, i) => (
//         <option key={i} value={c}>
//           {c}
//         </option>
//       ))}
//     </select>
//   ) : (
//     <input
//       value={formData.city}
//       readOnly
//       placeholder="Auto-filled"
//       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
//     />
//   )}
// </FormField>

//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="District">
//                     <input value={formData.district} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField>
//                   <FormField label="State">
//                     <input value={formData.state} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField>
//                 </div>
//                 <FormField label="Country">
//                     <input value={formData.country} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                 </FormField>
//               </div>
//             </div>

//             {/* SKILLS & ASSETS */}
//             {/* <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <Cpu size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                   Skills & Assets Inventory
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <FormField label="Technical Skills">
//   <div className="space-y-3 relative">

//     <input
//       value={skillInput}
//       onChange={(e) => setSkillInput(e.target.value)}
//       placeholder="Type skill..."
//       onKeyDown={(e) => {
//         if (e.key === "Enter") {
//           e.preventDefault();
//           const val = skillInput.trim();
//           if (val && !formData.skills.includes(val)) {
//             setFormData({
//               ...formData,
//               skills: [...formData.skills, val],
//             });
//           }
//           setSkillInput("");
//         }
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {skillInput && filteredSkills.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredSkills.map((skill, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({
//                 ...formData,
//                 skills: [...formData.skills, skill],
//               });
//               setSkillInput("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-blue-50 cursor-pointer"
//           >
//             {skill}
//           </div>
//         ))}
//       </div>
//     )}

//     <div className="flex flex-wrap gap-2">
//       {formData.skills.map((skill, index) => (
//         <span
//           key={index}
//           className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg"
//         >
//           {skill}
//           <X
//             size={12}
//             className="cursor-pointer"
//             onClick={() =>
//               setFormData({
//                 ...formData,
//                 skills: formData.skills.filter((_, i) => i !== index),
//               })
//             }
//           />
//         </span>
//       ))}
//     </div>
//   </div>
// </FormField>

// <FormField label="Assets Issued">
//   <div className="space-y-3 relative">

//     <input
//       value={assetInput}
//       onChange={(e) => setAssetInput(e.target.value)}
//       placeholder="Type asset..."
//       onKeyDown={(e) => {
//         if (e.key === "Enter") {
//           e.preventDefault();
//           const val = assetInput.trim();
//           if (val && !formData.assets.includes(val)) {
//             setFormData({
//               ...formData,
//               assets: [...formData.assets, val],
//             });
//           }
//           setAssetInput("");
//         }
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {assetInput && filteredAssets.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredAssets.map((asset, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({
//                 ...formData,
//                 assets: [...formData.assets, asset],
//               });
//               setAssetInput("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-slate-100 cursor-pointer"
//           >
//             {asset}
//           </div>
//         ))}
//       </div>
//     )}

//     <div className="flex flex-wrap gap-2">
//       {formData.assets.map((asset, index) => (
//         <span
//           key={index}
//           className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg"
//         >
//           {asset}
//           <X
//             size={12}
//             className="cursor-pointer"
//             onClick={() =>
//               setFormData({
//                 ...formData,
//                 assets: formData.assets.filter((_, i) => i !== index),
//               })
//             }
//           />
//         </span>
//       ))}
//     </div>
//   </div>
// </FormField>

//               </div>
//             </div> */}
// {/* Remove overflow-hidden from this parent to allow dropdowns to "float" out */}
// {/* Remove overflow-hidden from the main container to allow dropdowns to float */}
// <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
//   <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-200 flex items-center gap-3 rounded-t-[2.5rem]">
//     <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//     <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
//       Skills & Assets Inventory
//     </h3>
//   </div>

//   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
//     {/* TECHNICAL SKILLS SECTION */}
//     <FormField label="Technical Expertise">
//       <div className="space-y-4">
//         {/* Chips Preview */}
//         <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl transition-all">
//           {formData.skills.map((skill, index) => (
//             <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 text-[10px] font-black uppercase rounded-xl border border-blue-100 shadow-sm animate-in zoom-in-95">
//               {skill}
//               <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })} />
//             </span>
//           ))}
//           {formData.skills.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest my-auto ml-1">No Skills Logged</span>}
//         </div>

//         <div className="relative">
//           <div className="relative group z-30">
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//               <Cpu size={16} />
//             </div>
//             <input
//               value={skillInput}
//               onChange={(e) => setSkillInput(e.target.value)}
//               onFocus={() => {/* Dropdown will show via conditional below */}}
//               placeholder="Click to search skills..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const val = skillInput.trim();
//                   if (val && !formData.skills.includes(val)) {
//                     setFormData({ ...formData, skills: [...formData.skills, val] });
//                   }
//                   setSkillInput("");
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
//             />
//           </div>

//           {/* Search Dropdown: Shows on Focus or when Typing */}
//           {(skillInput.length > 0 || document.activeElement === document.getElementById('skill-input')) && filteredSkills.length > 0 && (
//             <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//               <div className="max-h-48 overflow-y-auto no-scrollbar">
//                 {filteredSkills.map((skill, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setFormData({ ...formData, skills: [...formData.skills, skill] });
//                       setSkillInput("");
//                     }}
//                     className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                   >
//                     {skill}
//                     <Plus size={14} className="text-blue-400 opacity-40" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </FormField>

//     {/* ASSETS ISSUED SECTION */}
//     <FormField label="Enterprise Assets">
//       <div className="space-y-4">
//         {/* Chips Preview */}
//         <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl transition-all">
//           {formData.assets.map((asset, index) => (
//             <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 text-[10px] font-black uppercase rounded-xl border border-slate-200 shadow-sm animate-in zoom-in-95">
//               {asset}
//               <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setFormData({ ...formData, assets: formData.assets.filter((_, i) => i !== index) })} />
//             </span>
//           ))}
//           {formData.assets.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest my-auto ml-1">No Assets Assigned</span>}
//         </div>

//         <div className="relative">
//           <div className="relative group z-30">
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
//               <Layers size={16} />
//             </div>
//             <input
//               value={assetInput}
//               onChange={(e) => setAssetInput(e.target.value)}
//               placeholder="Click to assign assets..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const val = assetInput.trim();
//                   if (val && !formData.assets.includes(val)) {
//                     setFormData({ ...formData, assets: [...formData.assets, val] });
//                   }
//                   setAssetInput("");
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
//             />
//           </div>

//           {/* Search Dropdown */}
//           {assetInput.length >= 0 && filteredAssets.length > 0 && (
//             <div className="absolute left-0 right-0 z-[100] mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2">
//               <div className="max-h-48 overflow-y-auto no-scrollbar">
//                 {filteredAssets.map((asset, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setFormData({ ...formData, assets: [...formData.assets, asset] });
//                       setAssetInput("");
//                     }}
//                     className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
//                   >
//                     {asset}
//                     <Plus size={14} className="text-slate-400 opacity-40" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </FormField>
//   </div>
// </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                   Registry Assets
//                 </h3>
//               </div>

//               {/* 1. MASTER RESUME TOGGLE */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
//                     1. Master Resume
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button type="button" onClick={() => setResumeMode("file")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "file" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>File</button>
//                     <button type="button" onClick={() => setResumeMode("link")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "link" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Link</button>
//                   </div>
//                 </div>
//                 {resumeMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center">
//                     <FileUp size={20} className="mx-auto text-blue-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.cvFile ? formData.cvFile.name : "Select PDF"}</p>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, cvFile: e.target.files[0], resume_link: "" })} />
//                   </label>
//                 ) : (
//                   <input placeholder="Paste Resume URL" value={formData.resume_link} onChange={(e) => setFormData({ ...formData, resume_link: e.target.value, cvFile: null })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-blue-500" />
//                 )}
//               </div>

//               {/* 2. EXPERIENCE LETTER TOGGLE */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">2. Exp. Letter</p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button type="button" onClick={() => setExpLetterMode("file")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "file" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>File</button>
//                     <button type="button" onClick={() => setExpLetterMode("link")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "link" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Link</button>
//                   </div>
//                 </div>
//                 {expLetterMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer text-center">
//                     <FileUp size={20} className="mx-auto text-purple-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.expLetterFile ? formData.expLetterFile.name : "Select PDF"}</p>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, expLetterFile: e.target.files[0], experience_letter_link: "" })} />
//                   </label>
//                 ) : (
//                   <input placeholder="Paste Letter URL" value={formData.experience_letter_link} onChange={(e) => setFormData({ ...formData, experience_letter_link: e.target.value, expLetterFile: null })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-purple-500" />
//                 )}
//               </div>

//               {/* 3. CERTIFICATES REGISTRY */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">3. Certifications</p>
//                   <div className="flex gap-2">
//                     <label className="cursor-pointer p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20"><FileUp size={12} /><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)] })} /></label>
//                     <button type="button" onClick={() => setFormData({ ...formData, certificateLinks: [...formData.certificateLinks, ""] })} className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"><LinkIcon size={12} /></button>
//                   </div>
//                 </div>
//                 <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2 text-white">
//                   {formData.certificateFiles.map((file, idx) => (
//                     <div key={idx} className="flex justify-between bg-white/5 p-2 rounded-lg text-[9px]"><span className="truncate">{file.name}</span><X size={12} className="text-red-400 cursor-pointer" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})} /></div>
//                   ))}
//                   {formData.certificateLinks.map((link, idx) => (
//                     <div key={idx} className="flex gap-2"><input value={link} placeholder="Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({ ...formData, certificateLinks: u }); }} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px]" /><X size={12} className="text-red-400 cursor-pointer my-auto" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} /></div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50">
//                 {loading ? <Loader2 className="animate-spin" size={20} /> : <><Database size={18} /><span>Commit Record</span></>}
//               </button>
//               <button type="button" onClick={() => window.history.back()} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors text-center">Discard & Exit</button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//******************************************************working code phase 11 16/02/26********************************************************** */
// import React, { useState,useEffect } from "react";
// import {
//   Check,
//   FileText,
//   Award,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   Phone,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   ExternalLink,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   LinkIcon,
//   FileUp,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>
//         {label} {required && <span className="text-red-500">*</span>}
//       </span>
//       {!required && (
//         <span className="text-slate-300 font-bold normal-case">Optional</span>
//       )}
//     </label>
//     {children}
//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
// const [cityOptions, setCityOptions] = useState([]);
//   // UI States for Toggles
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [departments, setDepartments] = useState([]);
// const [deptSearch, setDeptSearch] = useState("");

// const [assetInput, setAssetInput] = useState("");
// const [educationOptions, setEducationOptions] = useState([
//   "B.Tech",
//   "M.Tech",
//   "B.Sc",
//   "M.Sc",
//   "BCA",
//   "MCA",
//   "MBA",
//   "Diploma",
//   "PhD",
// ]);
// const [eduSearch, setEduSearch] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "",
//     position: "",
//     education: "",
//     gender: "",
//     dob: "",
//     experience: "" ,
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     expLetterFile: null,
//     experience_letter_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value)
//       error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
//       error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value))
//       error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

// //   const fetchPincodeDetails = async (pincode) => {
// //     if (!/^\d{6}$/.test(pincode)) return;
// //     try {
// //       setIsFetchingPincode(true);
// //       const res = await fetch(
// //         `https://api.postalpincode.in/pincode/${pincode}`,
// //       );
// //       const data = await res.json();
// //       if (data[0]?.Status === "Success") {
// //         const postOffice = data[0].PostOffice[0];
// //         setFormData((prev) => ({
// //           ...prev,
// //           city: postOffice.Name,
// //           state: postOffice.State,
// //           district: postOffice.District,
// //           country: postOffice.Country,
// //         }));
// //       }
// //     } catch {
// //       toast.error("Location lookup failed");
// //     } finally {
// //       setIsFetchingPincode(false);
// //     }
// //   };

// const fetchPincodeDetails = async (pincode) => {
//   if (!/^\d{6}$/.test(pincode)) return;

//   try {
//     setIsFetchingPincode(true);

//     const res = await fetch(
//       `https://api.postalpincode.in/pincode/${pincode}`
//     );
//     const data = await res.json();

//     if (data[0]?.Status === "Success") {
//       const offices = data[0].PostOffice;

//       const cities = offices.map((o) => o.Name);
//       setCityOptions(cities);

//       setFormData((prev) => ({
//         ...prev,
//         city: cities.length === 1 ? cities[0] : "",   // ✅ auto fill single
//         state: offices[0].State,
//         district: offices[0].District,
//         country: offices[0].Country,
//       }));
//     }
//   } catch {
//     toast.error("Location lookup failed");
//   } finally {
//     setIsFetchingPincode(false);
//   }
// };

// useEffect(() => {
//   const loadDepartments = async () => {
//     try {
//       const data = await departmentService.getAll();
//       setDepartments(data || []);
//     } catch (err) {
//       toast.error("Failed to load departments");
//     }
//   };

//   loadDepartments();
// }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isNameValid = validateField("name", formData.name);
//     const isEmailValid = validateField("email", formData.email);
//     const isPhoneValid = validateField("phone", formData.phone);

//     if (!isNameValid || !isEmailValid || !isPhoneValid) {
//       toast.error("Please fill required fields correctly");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (
//           formData[key] &&
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "expLetterFile",
//             "certificateLinks",
//           ].includes(key)
//         ) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile)
//         formDataApi.append("experience_letter", formData.expLetterFile);
//      const cleanLanguages = formData.languages_spoken
//   .map((l) => String(l).replace(/[\[\]"]/g, "").trim())
//   .filter(Boolean);

// formDataApi.append(
//   "languages_spoken",
//   JSON.stringify(cleanLanguages)
// );

//       // ✅ Added Experience details as JSON string per API standards
//       formDataApi.append("experience_details", JSON.stringify(formData.experiences));

//       formData.certificateFiles.forEach((file) =>
//         formDataApi.append("certificate_files[]", file),
//       );
//       formDataApi.append(
//         "certificate_links",
//         JSON.stringify(formData.certificateLinks.filter(Boolean)),
//       );

//       await candidateService.createCandidate(formDataApi);
//       toast.success("Candidate record committed successfully 🎉");
//     } catch (err) {
//       toast.error("Failed to commit record");
//     } finally {
//       setLoading(false);
//     }
//   };

//     const SKILL_OPTIONS = [
//   "React",
//   "JavaScript",
//   "Node.js",
//   "MongoDB",
//   "MySQL",
//   "HTML",
//   "CSS",
//   "Tailwind",
//   "Python",
//   "Java",
//   "AWS",
//   "Docker",
// ];

// const ASSET_OPTIONS = [
//   "Laptop",
//   "Mouse",
//   "Keyboard",
//   "Monitor",
//   "Headset",
//   "Mobile",
//   "ID Card",
//   "SIM Card",
// ];

// const POSITION_OPTIONS = [
//   "Frontend Developer",
//   "Backend Developer",
//   "Full Stack Developer",
//   "HR Executive",
//   "HR Manager",
//   "UI/UX Designer",
//   "QA Engineer",
//   "DevOps Engineer",
//   "Software Engineer",
//   "Data Analyst",
// ];

//   const filteredSkills = SKILL_OPTIONS.filter(
//   (s) =>
//     s.toLowerCase().includes(skillInput.toLowerCase()) &&
//     !formData.skills.includes(s)
// );

// const filteredAssets = ASSET_OPTIONS.filter(
//   (a) =>
//     a.toLowerCase().includes(assetInput.toLowerCase()) &&
//     !formData.assets.includes(a)
// );

// const filteredDepartments = departments.filter((d) =>
//   d.name?.toLowerCase().includes(deptSearch.toLowerCase())
// );

// const filteredEducation = educationOptions.filter((e) =>
//   e.toLowerCase().includes(eduSearch.toLowerCase())
// );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 Manual Candidate Entry
//               </h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                 Talent Acquisition Registry
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">
//               Enterprise Security Enabled
//             </span>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* PERSONAL INFO */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <User size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                   Personal Identification
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Full Name" required error={errors.name}>
//                   <input
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("name", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//                 <FormField label="Email Address" required error={errors.email}>
//                   <input
//                     type="email"
//                     placeholder="john@company.com"
//                     value={formData.email}
//                     onChange={(e) => {
//                       setFormData({ ...formData, email: e.target.value });
//                       validateField("email", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                     <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">
//                       +91
//                     </div>
//                     <input
//                       maxLength={10}
//                       placeholder="9876543210"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const v = e.target.value
//                           .replace(/\D/g, "")
//                           .slice(0, 10);
//                         setFormData({ ...formData, phone: v });
//                         validateField("phone", v);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                     />
//                   </div>
//                 </FormField>
//                 <FormField label="Gender">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) =>
//                       setFormData({ ...formData, gender: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Date of Birth">
//                   <input
//                     type="date"
//                     value={formData.dob}
//                     onChange={(e) =>
//                       setFormData({ ...formData, dob: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                   />
//                 </FormField>
//                 <FormField label="Languages Spoken">
//                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar space-y-2">
//                     {[
//                       "English",
//                       "Hindi",
//                       "Marathi",
//                       "Gujarati",
//                       "Tamil",
//                       "Telugu",
//                     ].map((lang) => (
//                       <label
//                         key={lang}
//                         className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.languages_spoken.includes(lang)}
//                           onChange={() => {
//                             const updated = formData.languages_spoken.includes(
//                               lang,
//                             )
//                               ? formData.languages_spoken.filter(
//                                   (l) => l !== lang,
//                                 )
//                               : [...formData.languages_spoken, lang];
//                             setFormData({
//                               ...formData,
//                               languages_spoken: updated,
//                             });
//                           }}
//                           className="w-4 h-4 accent-blue-600 rounded"
//                         />{" "}
//                         {lang}
//                       </label>
//                     ))}
//                   </div>
//                 </FormField>
//               </div>

//               <FormField label="About Profile Summary">
//                 <textarea
//                   rows={3}
//                   placeholder="Brief summary..."
//                   value={formData.about_me}
//                   onChange={(e) =>
//                     setFormData({ ...formData, about_me: e.target.value })
//                   }
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none transition-all"
//                 />
//               </FormField>
//             </div>

//             {/* 🛡️ EMPLOYMENT HISTORY (MULTIPLE ADD/DELETE) */}
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-6">
//               <div className="flex justify-between items-center border-b border-white/10 pb-4">
//                 <div className="flex items-center gap-2">
//                   <History size={18} className="text-blue-400" />
//                   <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                     Employment History
//                   </h3>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setFormData({
//                     ...formData,
//                     experiences: [...formData.experiences, { company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: 0, location: "", description: "" }]
//                   })}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
//                 >
//                   <Plus size={14} /> Add Company
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.experiences.map((exp, i) => (
//                   <div key={i} className="relative bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 group animate-in slide-in-from-bottom-2">
//                     <button
//                       type="button"
//                       onClick={() => setFormData({
//                         ...formData,
//                         experiences: formData.experiences.filter((_, idx) => idx !== i)
//                       })}
//                       className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash2 size={16} />
//                     </button>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...formData.experiences]; u[i].company_name = e.target.value; setFormData({...formData, experiences: u}); }} className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500" />
//                       <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...formData.experiences]; u[i].job_title = e.target.value; setFormData({...formData, experiences: u}); }} className="bg-transparent border-b border-white/20 text-xs text-white p-2 outline-none focus:border-blue-500" />
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">Start</label>
//                         <input type="date" value={exp.start_date} onChange={(e) => { const u = [...formData.experiences]; u[i].start_date = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">End</label>
//                         <input type="date" value={exp.end_date} onChange={(e) => { const u = [...formData.experiences]; u[i].end_date = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">CTC</label>
//                         <input type="number" placeholder="0" value={exp.previous_ctc} onChange={(e) => { const u = [...formData.experiences]; u[i].previous_ctc = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[8px] font-bold text-slate-500 uppercase">Location</label>
//                         <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...formData.experiences]; u[i].location = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
//                       </div>
//                     </div>

//                     <textarea placeholder="Description of role..." rows={2} value={exp.description} onChange={(e) => { const u = [...formData.experiences]; u[i].description = e.target.value; setFormData({...formData, experiences: u}); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-blue-500 resize-none" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* QUALIFICATIONS & LOCATION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <Award size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Professional Quals
//                   </h3>
//                 </div>
//                 {/* <FormField label="Position">
//                   <div className="relative group">
//                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input
//                       list="position-options"
//                       placeholder="Search position..."
//                       value={formData.position}
//                       onChange={(e) => setFormData({...formData, position: e.target.value})}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField> */}
//                 <FormField label="Position">
//   <input
//     list="position-options"
//     placeholder="Search position..."
//     value={formData.position}
//     onChange={(e) =>
//       setFormData({ ...formData, position: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />

//   <datalist id="position-options">
//     {POSITION_OPTIONS.map((pos, i) => (
//       <option key={i} value={pos} />
//     ))}
//   </datalist>
// </FormField>

//                 <FormField label="Experience">
//                   <div className="relative group">
//                     <History className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input type="number" placeholder="Total years" value={formData.experience}
// onChange={(e) =>
//   setFormData({ ...formData, experience: e.target.value })
// }
//  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
//                   </div>
//                 </FormField>

//                 {/* <FormField label="Education">
//   <input
//     placeholder="Degree / Qualification"
//     value={formData.education}
//     onChange={(e) =>
//       setFormData({ ...formData, education: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />
// </FormField> */}

// <FormField label="Education">
//   <div className="relative space-y-2">

//     <input
//       placeholder="Search or type education..."
//       value={eduSearch || formData.education}
//       onChange={(e) => {
//         setEduSearch(e.target.value);
//         setFormData({ ...formData, education: e.target.value });
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {eduSearch && filteredEducation.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredEducation.map((edu, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({ ...formData, education: edu });
//               setEduSearch("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-slate-100 cursor-pointer"
//           >
//             {edu}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </FormField>

// {/* <FormField label="Department">
//   <input
//     placeholder="Department"
//     value={formData.department}
//     onChange={(e) =>
//       setFormData({ ...formData, department: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//   />
// </FormField> */}

// <FormField label="Department">
//   <div className="relative space-y-2">

//     <input
//       placeholder="Search or type department..."
//       value={deptSearch || formData.department}
//       onChange={(e) => {
//         setDeptSearch(e.target.value);
//         setFormData({ ...formData, department: e.target.value });
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {/* Dropdown */}
//     {deptSearch && filteredDepartments.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredDepartments.map((dept) => (
//           <div
//             key={dept.id}
//             onClick={() => {
//               setFormData({ ...formData, department: dept.name });
//               setDeptSearch("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-blue-50 cursor-pointer"
//           >
//             {dept.name}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// </FormField>

//               </div>

//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <MapPin size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Location Data
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="Pincode">
//                     <input
//                       placeholder="6 Digits"
//                       maxLength={6}
//                       value={formData.pincode}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "");
//                         setFormData({ ...formData, pincode: v });
//                         if (v.length === 6) fetchPincodeDetails(v);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />
//                   </FormField>
//                   {/* <FormField label="City">
//                     <input value={formData.city} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField> */}
//                   <FormField label="City">
//   {cityOptions.length > 1 ? (
//     <select
//       value={formData.city}
//       onChange={(e) =>
//         setFormData({ ...formData, city: e.target.value })
//       }
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
//     >
//       <option value="">Select City</option>
//       {cityOptions.map((c, i) => (
//         <option key={i} value={c}>
//           {c}
//         </option>
//       ))}
//     </select>
//   ) : (
//     <input
//       value={formData.city}
//       readOnly
//       placeholder="Auto-filled"
//       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
//     />
//   )}
// </FormField>

//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="District">
//                     <input value={formData.district} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField>
//                   <FormField label="State">
//                     <input value={formData.state} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                   </FormField>
//                 </div>
//                 <FormField label="Country">
//                     <input value={formData.country} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" />
//                 </FormField>
//               </div>
//             </div>

//             {/* SKILLS & ASSETS */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <Cpu size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                   Skills & Assets Inventory
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <FormField label="Technical Skills">
//   <div className="space-y-3 relative">

//     <input
//       value={skillInput}
//       onChange={(e) => setSkillInput(e.target.value)}
//       placeholder="Type skill..."
//       onKeyDown={(e) => {
//         if (e.key === "Enter") {
//           e.preventDefault();
//           const val = skillInput.trim();
//           if (val && !formData.skills.includes(val)) {
//             setFormData({
//               ...formData,
//               skills: [...formData.skills, val],
//             });
//           }
//           setSkillInput("");
//         }
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {/* Suggestions */}
//     {skillInput && filteredSkills.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredSkills.map((skill, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({
//                 ...formData,
//                 skills: [...formData.skills, skill],
//               });
//               setSkillInput("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-blue-50 cursor-pointer"
//           >
//             {skill}
//           </div>
//         ))}
//       </div>
//     )}

//     {/* Selected Tags */}
//     <div className="flex flex-wrap gap-2">
//       {formData.skills.map((skill, index) => (
//         <span
//           key={index}
//           className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg"
//         >
//           {skill}
//           <X
//             size={12}
//             className="cursor-pointer"
//             onClick={() =>
//               setFormData({
//                 ...formData,
//                 skills: formData.skills.filter((_, i) => i !== index),
//               })
//             }
//           />
//         </span>
//       ))}
//     </div>
//   </div>
// </FormField>

// <FormField label="Assets Issued">
//   <div className="space-y-3 relative">

//     <input
//       value={assetInput}
//       onChange={(e) => setAssetInput(e.target.value)}
//       placeholder="Type asset..."
//       onKeyDown={(e) => {
//         if (e.key === "Enter") {
//           e.preventDefault();
//           const val = assetInput.trim();
//           if (val && !formData.assets.includes(val)) {
//             setFormData({
//               ...formData,
//               assets: [...formData.assets, val],
//             });
//           }
//           setAssetInput("");
//         }
//       }}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />

//     {assetInput && filteredAssets.length > 0 && (
//       <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
//         {filteredAssets.map((asset, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               setFormData({
//                 ...formData,
//                 assets: [...formData.assets, asset],
//               });
//               setAssetInput("");
//             }}
//             className="px-3 py-2 text-xs font-bold hover:bg-slate-100 cursor-pointer"
//           >
//             {asset}
//           </div>
//         ))}
//       </div>
//     )}

//     <div className="flex flex-wrap gap-2">
//       {formData.assets.map((asset, index) => (
//         <span
//           key={index}
//           className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg"
//         >
//           {asset}
//           <X
//             size={12}
//             className="cursor-pointer"
//             onClick={() =>
//               setFormData({
//                 ...formData,
//                 assets: formData.assets.filter((_, i) => i !== index),
//               })
//             }
//           />
//         </span>
//       ))}
//     </div>
//   </div>
// </FormField>

//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                   Registry Assets
//                 </h3>
//               </div>

//               {/* 1. MASTER RESUME TOGGLE */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
//                     1. Master Resume
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button type="button" onClick={() => setResumeMode("file")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "file" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>File</button>
//                     <button type="button" onClick={() => setResumeMode("link")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "link" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Link</button>
//                   </div>
//                 </div>
//                 {resumeMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group text-center">
//                     <FileUp size={20} className="mx-auto text-blue-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.cvFile ? formData.cvFile.name : "Select PDF"}</p>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, cvFile: e.target.files[0], resume_link: "" })} />
//                   </label>
//                 ) : (
//                   <input placeholder="Paste Resume URL" value={formData.resume_link} onChange={(e) => setFormData({ ...formData, resume_link: e.target.value, cvFile: null })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-blue-500" />
//                 )}
//               </div>

//               {/* 2. EXPERIENCE LETTER TOGGLE */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">2. Exp. Letter</p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button type="button" onClick={() => setExpLetterMode("file")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "file" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>File</button>
//                     <button type="button" onClick={() => setExpLetterMode("link")} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "link" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Link</button>
//                   </div>
//                 </div>
//                 {expLetterMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer text-center">
//                     <FileUp size={20} className="mx-auto text-purple-400 mb-2" />
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.expLetterFile ? formData.expLetterFile.name : "Select PDF"}</p>
//                     <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, expLetterFile: e.target.files[0], experience_letter_link: "" })} />
//                   </label>
//                 ) : (
//                   <input placeholder="Paste Letter URL" value={formData.experience_letter_link} onChange={(e) => setFormData({ ...formData, experience_letter_link: e.target.value, expLetterFile: null })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-purple-500" />
//                 )}
//               </div>

//               {/* 3. CERTIFICATES REGISTRY */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">3. Certifications</p>
//                   <div className="flex gap-2">
//                     <label className="cursor-pointer p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20"><FileUp size={12} /><input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({ ...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)] })} /></label>
//                     <button type="button" onClick={() => setFormData({ ...formData, certificateLinks: [...formData.certificateLinks, ""] })} className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"><LinkIcon size={12} /></button>
//                   </div>
//                 </div>
//                 <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2 text-white">
//                   {formData.certificateFiles.map((file, idx) => (
//                     <div key={idx} className="flex justify-between bg-white/5 p-2 rounded-lg text-[9px]"><span className="truncate">{file.name}</span><X size={12} className="text-red-400 cursor-pointer" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})} /></div>
//                   ))}
//                   {formData.certificateLinks.map((link, idx) => (
//                     <div key={idx} className="flex gap-2"><input value={link} placeholder="Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({ ...formData, certificateLinks: u }); }} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px]" /><X size={12} className="text-red-400 cursor-pointer my-auto" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} /></div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50">
//                 {loading ? <Loader2 className="animate-spin" size={20} /> : <><Database size={18} /><span>Commit Record</span></>}
//               </button>
//               <button type="button" onClick={() => window.history.back()} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors text-center">Discard & Exit</button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//********************************************************working code phase 2*************************************************************** */
// import React, { useState } from "react";
// import {
//   Check,
//   FileText,
//   Award,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   Phone,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   ExternalLink,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   LinkIcon,
//   FileUp,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>
//         {label} {required && <span className="text-red-500">*</span>}
//       </span>
//       {!required && (
//         <span className="text-slate-300 font-bold normal-case">Optional</span>
//       )}
//     </label>
//     {children}
//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);

//   // UI States for Toggles
//   const [resumeMode, setResumeMode] = useState("file");
//   const [expLetterMode, setExpLetterMode] = useState("file");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "",
//     exp: "",
//     position: "",
//     education: "",
//     gender: "",
//     dob: "",
//     about_me: "",
//     languages_spoken: [],

//       // 🔹 ADD THESE
//   skills: [],
//   assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     expLetterFile: null,
//     experience_letter_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value)
//       error = "Required field";
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
//       error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value))
//       error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const postOffice = data[0].PostOffice[0];
//         setFormData((prev) => ({
//           ...prev,
//           city: postOffice.Name,
//           state: postOffice.State,
//           district: postOffice.District,
//           country: postOffice.Country,
//         }));
//       }
//     } catch {
//       toast.error("Location lookup failed");
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isNameValid = validateField("name", formData.name);
//     const isEmailValid = validateField("email", formData.email);
//     const isPhoneValid = validateField("phone", formData.phone);

//     if (!isNameValid || !isEmailValid || !isPhoneValid) {
//       toast.error("Please fill required fields correctly");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (
//           formData[key] &&
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "expLetterFile",
//             "certificateLinks",
//           ].includes(key)
//         ) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile)
//         formDataApi.append("experience_letter", formData.expLetterFile);
//       formDataApi.append(
//         "languages_spoken",
//         JSON.stringify(formData.languages_spoken),
//       );
//       formData.certificateFiles.forEach((file) =>
//         formDataApi.append("certificate_files[]", file),
//       );
//       formDataApi.append(
//         "certificate_links",
//         JSON.stringify(formData.certificateLinks.filter(Boolean)),
//       );

//       await candidateService.createCandidate(formDataApi);
//       toast.success("Candidate record committed successfully 🎉");
//     } catch (err) {
//       toast.error("Failed to commit record");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 Manual Candidate Entry
//               </h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                 Talent Acquisition Registry
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">
//               Enterprise Security Enabled
//             </span>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* PERSONAL INFO */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <User size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                   Personal Identification
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Full Name" required error={errors.name}>
//                   <input
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       validateField("name", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//                 <FormField label="Email Address" required error={errors.email}>
//                   <input
//                     type="email"
//                     placeholder="john@company.com"
//                     value={formData.email}
//                     onChange={(e) => {
//                       setFormData({ ...formData, email: e.target.value });
//                       validateField("email", e.target.value);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   />
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                     <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">
//                       +91
//                     </div>
//                     <input
//                       maxLength={10}
//                       placeholder="9876543210"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const v = e.target.value
//                           .replace(/\D/g, "")
//                           .slice(0, 10);
//                         setFormData({ ...formData, phone: v });
//                         validateField("phone", v);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                     />
//                   </div>
//                 </FormField>
//                 <FormField label="Gender">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) =>
//                       setFormData({ ...formData, gender: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Date of Birth">
//                   <input
//                     type="date"
//                     value={formData.dob}
//                     onChange={(e) =>
//                       setFormData({ ...formData, dob: e.target.value })
//                     }
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                   />
//                 </FormField>
//                 <FormField label="Languages Spoken">
//                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto space-y-2">
//                     {[
//                       "English",
//                       "Hindi",
//                       "Marathi",
//                       "Gujarati",
//                       "Tamil",
//                       "Telugu",
//                     ].map((lang) => (
//                       <label
//                         key={lang}
//                         className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.languages_spoken.includes(lang)}
//                           onChange={() => {
//                             const updated = formData.languages_spoken.includes(
//                               lang,
//                             )
//                               ? formData.languages_spoken.filter(
//                                   (l) => l !== lang,
//                                 )
//                               : [...formData.languages_spoken, lang];
//                             setFormData({
//                               ...formData,
//                               languages_spoken: updated,
//                             });
//                           }}
//                           className="w-4 h-4 accent-blue-600 rounded"
//                         />{" "}
//                         {lang}
//                       </label>
//                     ))}
//                   </div>
//                 </FormField>
//               </div>

//               <FormField label="About Profile Summary">
//                 <textarea
//                   rows={3}
//                   placeholder="Brief summary..."
//                   value={formData.about_me}
//                   onChange={(e) =>
//                     setFormData({ ...formData, about_me: e.target.value })
//                   }
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none transition-all"
//                 />
//               </FormField>
//             </div>

//             {/* QUALIFICATIONS & LOCATION (Condensed) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Professional Qualifications Card */}
//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <Award size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Professional Quals
//                   </h3>
//                 </div>

//                 {/* Position Input with Searchable Static Data */}
//                 <FormField label="Position">
//                   <div className="relative group">
//                     <Briefcase
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                       size={16}
//                     />
//                     <input
//                       list="position-options"
//                       placeholder="Search or type position..."
//                       value={formData.position}
//                       onChange={(e) =>
//                         setFormData({ ...formData, position: e.target.value })
//                       }
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                     <datalist id="position-options">
//                       {/* IT & Tech */}
//                       <option value="Software Engineer" />
//                       <option value="Frontend Developer" />
//                       <option value="Backend Developer" />
//                       <option value="Full Stack Developer" />
//                       <option value="DevOps Engineer" />
//                       <option value="UI/UX Designer" />
//                       <option value="Data Scientist" />
//                       <option value="IT Support Specialist" />

//                       {/* Sales & Marketing */}
//                       <option value="Sales Manager" />
//                       <option value="Business Development Executive" />
//                       <option value="Account Manager" />
//                       <option value="Marketing Coordinator" />
//                       <option value="Digital Marketing Specialist" />
//                       <option value="Sales Representative" />

//                       {/* Commerce & Finance */}
//                       <option value="Accountant" />
//                       <option value="Financial Analyst" />
//                       <option value="E-commerce Manager" />
//                       <option value="Operations Manager" />
//                       <option value="Product Manager" />
//                       <option value="Finance Executive" />

//                       {/* Human Resources */}
//                       <option value="HR Manager" />
//                       <option value="Recruiter" />
//                       <option value="HR Generalist" />
//                     </datalist>
//                   </div>
//                 </FormField>

//                 {/* Experience Field */}
//                 <FormField label="Experience">
//                   <div className="relative group">
//                     <History
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                       size={16}
//                     />
//                     <input
//                       type="number"
//                       placeholder="Total years"
//                       value={formData.exp}
//                       onChange={(e) =>
//                         setFormData({ ...formData, exp: e.target.value })
//                       }
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>
//               </div>

//               {/* Location Data Card */}
//               <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 h-full">
//                 <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                   <MapPin size={16} className="text-blue-600" />
//                   <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
//                     Location Data
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="Pincode">
//                     <input
//                       placeholder="6 Digits"
//                       maxLength={6}
//                       value={formData.pincode}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "").slice(0, 6);
//                         setFormData({ ...formData, pincode: v });
//                         if (v.length === 6) fetchPincodeDetails(v);
//                       }}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                     />
//                   </FormField>
//                   <FormField label="City">
//                     <input
//                       value={formData.city}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                     />
//                   </FormField>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="District">
//                     <input
//                       value={formData.district}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                     />
//                   </FormField>
//                   <FormField label="State">
//                     <input
//                       value={formData.state}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                     />
//                   </FormField>
//                 </div>

//                 <FormField label="Country">
//                   <input
//                     value={formData.country}
//                     readOnly
//                     placeholder="Auto-filled"
//                     className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
//                   />
//                 </FormField>
//               </div>
//             </div>

//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//   <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//     <Cpu size={16} className="text-blue-600" />
//     <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Skills & Assets Inventory</h3>
//   </div>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//     {/* MULTI-SELECT SKILLS SECTION */}
//     <FormField label="Technical Skills">
//       <div className="space-y-3">
//         <div className="relative group">
//           <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
//           <input
//             list="skill-suggestions"
//             placeholder="Type skill & press Enter..."
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 const val = e.target.value.trim();
//                 if (val && !formData.skills.includes(val)) {
//                   setFormData({ ...formData, skills: [...formData.skills, val] });
//                 }
//                 e.target.value = '';
//               }
//             }}
//             className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//           />
//           <datalist id="skill-suggestions">
//             <option value="React.js" />
//             <option value="Node.js" />
//             <option value="Python" />
//             <option value="Java" />
//             <option value="SQL" />
//             <option value="AWS" />
//             <option value="Digital Marketing" />
//             <option value="B2B Sales" />
//             <option value="Project Management" />
//           </datalist>
//         </div>

//         {/* Skills Chips Preview */}
//         <div className="flex flex-wrap gap-2">
//           {formData.skills.map((skill, index) => (
//             <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg border border-blue-100 animate-in zoom-in-90 transition-all">
//               {skill}
//               <button
//                 type="button"
//                 onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })}
//                 className="hover:text-red-500"
//               >
//                 <X size={12} />
//               </button>
//             </span>
//           ))}
//           {formData.skills.length === 0 && <p className="text-[10px] text-slate-300 italic ml-1">No skills added yet</p>}
//         </div>
//       </div>
//     </FormField>

//     {/* MULTI-SELECT ASSETS SECTION */}
//     <FormField label="Enterprise Assets Issued">
//       <div className="space-y-3">
//         <div className="relative group">
//           <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
//           <input
//             list="asset-suggestions"
//             placeholder="Type asset & press Enter..."
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 const val = e.target.value.trim();
//                 if (val && !formData.assets.includes(val)) {
//                   setFormData({ ...formData, assets: [...formData.assets, val] });
//                 }
//                 e.target.value = '';
//               }
//             }}
//             className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//           />
//           <datalist id="asset-suggestions">
//             <option value="MacBook Pro" />
//             <option value="Dell Latitude" />
//             <option value="iPhone 15" />
//             <option value="Security ID Card" />
//             <option value="Noise Cancelling Headphones" />
//             <option value="Home Office Chair" />
//           </datalist>
//         </div>

//         {/* Assets Chips Preview */}
//         <div className="flex flex-wrap gap-2">
//           {formData.assets.map((asset, index) => (
//             <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded-lg border border-slate-200 animate-in zoom-in-90 transition-all">
//               {asset}
//               <button
//                 type="button"
//                 onClick={() => setFormData({ ...formData, assets: formData.assets.filter((_, i) => i !== index) })}
//                 className="hover:text-red-500"
//               >
//                 <X size={12} />
//               </button>
//             </span>
//           ))}
//           {formData.assets.length === 0 && <p className="text-[10px] text-slate-300 italic ml-1">No assets allocated</p>}
//         </div>
//       </div>
//     </FormField>

//   </div>
// </div>
//           </div>

//           {/* RIGHT COLUMN - ASSET REGISTRY */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
//                   Registry Assets
//                 </h3>
//               </div>

//               {/* 1. MASTER RESUME TOGGLE */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
//                     1. Master Resume
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button
//                       type="button"
//                       onClick={() => setResumeMode("file")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "file" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       File
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setResumeMode("link")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${resumeMode === "link" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       Link
//                     </button>
//                   </div>
//                 </div>

//                 {resumeMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
//                         <FileUp size={20} />
//                       </div>
//                       <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">
//                         {formData.cvFile
//                           ? formData.cvFile.name
//                           : "Select PDF Resume"}
//                       </p>
//                     </div>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       className="hidden"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           cvFile: e.target.files[0],
//                           resume_link: "",
//                         })
//                       }
//                     />
//                   </label>
//                 ) : (
//                   <div className="relative animate-in slide-in-from-top-2">
//                     <LinkIcon
//                       size={12}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
//                     />
//                     <input
//                       placeholder="Paste Resume URL"
//                       value={formData.resume_link}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           resume_link: e.target.value,
//                           cvFile: null,
//                         })
//                       }
//                       className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-blue-500"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* 2. EXPERIENCE LETTER TOGGLE */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
//                     2. Exp. Letter
//                   </p>
//                   <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
//                     <button
//                       type="button"
//                       onClick={() => setExpLetterMode("file")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "file" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       File
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setExpLetterMode("link")}
//                       className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${expLetterMode === "link" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
//                     >
//                       Link
//                     </button>
//                   </div>
//                 </div>

//                 {expLetterMode === "file" ? (
//                   <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
//                         <FileUp size={20} />
//                       </div>
//                       <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">
//                         {formData.expLetterFile
//                           ? formData.expLetterFile.name
//                           : "Select PDF Letter"}
//                       </p>
//                     </div>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       className="hidden"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           expLetterFile: e.target.files[0],
//                           experience_letter_link: "",
//                         })
//                       }
//                     />
//                   </label>
//                 ) : (
//                   <div className="relative animate-in slide-in-from-top-2">
//                     <LinkIcon
//                       size={12}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
//                     />
//                     <input
//                       placeholder="Paste Letter URL"
//                       value={formData.experience_letter_link}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_letter_link: e.target.value,
//                           expLetterFile: null,
//                         })
//                       }
//                       className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-purple-500"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* 3. CERTIFICATES REGISTRY */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
//                     3. Certifications
//                   </p>
//                   <div className="flex gap-2">
//                     <label className="cursor-pointer p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-90">
//                       <FileUp size={12} />
//                       <input
//                         type="file"
//                         multiple
//                         accept=".pdf"
//                         className="hidden"
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             certificateFiles: [
//                               ...formData.certificateFiles,
//                               ...Array.from(e.target.files),
//                             ],
//                           })
//                         }
//                       />
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           certificateLinks: [...formData.certificateLinks, ""],
//                         })
//                       }
//                       className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-90"
//                     >
//                       <LinkIcon size={12} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2">
//                   {/* Show Files */}
//                   {formData.certificateFiles.map((file, idx) => (
//                     <div
//                       key={`file-${idx}`}
//                       className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2.5 group animate-in fade-in slide-in-from-right-2"
//                     >
//                       <div className="flex items-center gap-3 overflow-hidden">
//                         <FileText
//                           size={14}
//                           className="text-emerald-500 shrink-0"
//                         />
//                         <span className="text-[10px] font-bold text-slate-300 truncate">
//                           {file.name}
//                         </span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setFormData({
//                             ...formData,
//                             certificateFiles: formData.certificateFiles.filter(
//                               (_, i) => i !== idx,
//                             ),
//                           })
//                         }
//                         className="text-red-400 hover:text-red-300 transition-colors p-1"
//                       >
//                         <Trash2 size={12} />
//                       </button>
//                     </div>
//                   ))}
//                   {/* Show Links */}
//                   {formData.certificateLinks.map((link, idx) => (
//                     <div
//                       key={`link-${idx}`}
//                       className="flex gap-2 group animate-in slide-in-from-right-2"
//                     >
//                       <div className="relative flex-1">
//                         <Globe
//                           className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500/50"
//                           size={12}
//                         />
//                         <input
//                           value={link}
//                           placeholder="Credential link"
//                           onChange={(e) => {
//                             const u = [...formData.certificateLinks];
//                             u[idx] = e.target.value;
//                             setFormData({ ...formData, certificateLinks: u });
//                           }}
//                           className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-[10px] text-white outline-none focus:border-emerald-500 transition-all"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setFormData({
//                             ...formData,
//                             certificateLinks: formData.certificateLinks.filter(
//                               (_, i) => i !== idx,
//                             ),
//                           })
//                         }
//                         className="text-red-400 hover:text-red-300 p-1"
//                       >
//                         <Trash2 size={12} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ACTION CARD */}
//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <Database size={18} />
//                     <span>Commit Record</span>
//                   </>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
//               >
//                 Discard & Exit
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//****************************************************working code phase 2***************************************************************** */
// import React, { useState } from "react";
// import {
//   Check, FileText, Award, User, Briefcase, MapPin, Mail, Phone,
//   Loader2, Plus, Trash2, ExternalLink, Database, Globe,
//   ShieldCheck, History, X, LinkIcon
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>{label} {required && <span className="text-red-500">*</span>}</span>
//       {!required && <span className="text-slate-300 font-bold normal-case">Optional</span>}
//     </label>
//     {children}
//     {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "",
//     exp: "",
//     position: "",
//     education: "",
//     gender: "",
//     dob: "",
//     about_me: "",
//     languages_spoken: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     expLetterFile: null,
//     experience_letter_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const validateField = (field, value) => {
//     let error = "";
//     if (["name", "email", "phone"].includes(field) && !value) {
//       error = "Required field";
//     }
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const postOffice = data[0].PostOffice[0];
//         setFormData(prev => ({
//           ...prev,
//           city: postOffice.Name,
//           state: postOffice.State,
//           district: postOffice.District,
//           country: postOffice.Country,
//         }));
//       }
//     } catch { toast.error("Location lookup failed"); }
//     finally { setIsFetchingPincode(false); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isNameValid = validateField("name", formData.name);
//     const isEmailValid = validateField("email", formData.email);
//     const isPhoneValid = validateField("phone", formData.phone);

//     if (!isNameValid || !isEmailValid || !isPhoneValid) {
//       toast.error("Please fill required fields correctly");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formDataApi = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] && !["experiences", "certificateFiles", "languages_spoken", "cvFile", "expLetterFile", "certificateLinks"].includes(key)) {
//           formDataApi.append(key, formData[key]);
//         }
//       });
//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);
//       formDataApi.append("languages_spoken", JSON.stringify(formData.languages_spoken));

//       // Fixed: Proper appending for multiple files
//       formData.certificateFiles.forEach((file) => formDataApi.append("certificate_files[]", file));
//       formDataApi.append("certificate_links", JSON.stringify(formData.certificateLinks.filter(Boolean)));

//       await candidateService.createCandidate(formDataApi);
//       toast.success("Candidate record committed successfully 🎉");
//     } catch (err) {
//       toast.error("Failed to commit record");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased selection:bg-blue-500/30">
//       <div className="max-w-6xl mx-auto space-y-8">

//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manual Candidate Entry</h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Enterprise Talent Acquisition Registry</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">Active Registry Mode</span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-8">
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <User size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Primary Identification</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Full Name" required error={errors.name}>
//                   <div className="relative group">
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input
//                       placeholder="e.g. John Doe"
//                       value={formData.name}
//                       onChange={(e) => { setFormData({...formData, name: e.target.value}); validateField("name", e.target.value); }}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>

//                 <FormField label="Email Address" required error={errors.email}>
//                   <div className="relative group">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input
//                       type="email"
//                       placeholder="john@company.com"
//                       value={formData.email}
//                       onChange={(e) => { setFormData({...formData, email: e.target.value}); validateField("email", e.target.value); }}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                     <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">+91</div>
//                     <input
//                       maxLength={10}
//                       placeholder="9876543210"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "").slice(0, 10);
//                         setFormData({...formData, phone: v});
//                         validateField("phone", v);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                     />
//                   </div>
//                 </FormField>
//                 <FormField label="Gender">
//                   <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all">
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Date of Birth"><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" /></FormField>
//                 <FormField label="Languages Spoken">
//                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar space-y-2">
//                     {["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"].map((lang) => (
//                       <label key={lang} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
//                         <input type="checkbox" checked={formData.languages_spoken.includes(lang)} onChange={() => {
//                           const updated = formData.languages_spoken.includes(lang) ? formData.languages_spoken.filter((l) => l !== lang) : [...formData.languages_spoken, lang];
//                           setFormData({ ...formData, languages_spoken: updated });
//                         }} className="w-4 h-4 accent-blue-600 rounded" /> {lang}
//                       </label>
//                     ))}
//                   </div>
//                 </FormField>
//               </div>

//               <FormField label="About Profile Summary">
//                 <textarea rows={3} placeholder="Brief professional biography..." value={formData.about_me} onChange={(e) => setFormData({ ...formData, about_me: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none transition-all" />
//               </FormField>
//             </div>

//             {/* LOCATION DATA */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
//                 <MapPin size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Location Data</h3>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <FormField label="Pincode"><input placeholder="6 Digits" maxLength={6} value={formData.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setFormData({...formData, pincode: v}); if (v.length === 6) fetchPincodeDetails(v); }} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" /></FormField>
//                 <FormField label="City"><input value={formData.city} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" /></FormField>
//                 <FormField label="District"><input value={formData.district} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" /></FormField>
//                 <FormField label="State"><input value={formData.state} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed" /></FormField>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="lg:col-span-4 space-y-8">

//             {/* DOCUMENT REGISTRY */}
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Registry Assets</h3>
//               </div>

//               {/* RESUME REGISTRY */}
//               <div className="space-y-4">
//                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">1. Master Resume</p>
//                 <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><FileText size={20} /></div>
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.cvFile ? formData.cvFile.name : "Upload PDF Resume"}</p>
//                   </div>
//                   <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0], resume_link: ""})} />
//                 </label>
//                 <div className="relative">
//                   <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//                   <input placeholder="Or Paste Resume Link" value={formData.resume_link} onChange={(e) => setFormData({...formData, resume_link: e.target.value, cvFile: null})} className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-blue-500" />
//                 </div>
//               </div>

//               {/* EXP LETTER REGISTRY */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">2. Experience Letter</p>
//                 <label className="block p-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><Award size={20} /></div>
//                     <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{formData.expLetterFile ? formData.expLetterFile.name : "Upload PDF Letter"}</p>
//                   </div>
//                   <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0], experience_letter_link: ""})} />
//                 </label>
//                 <div className="relative">
//                   <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//                   <input placeholder="Or Paste Exp. Letter Link" value={formData.experience_letter_link} onChange={(e) => setFormData({...formData, experience_letter_link: e.target.value, expLetterFile: null})} className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white outline-none focus:border-purple-500" />
//                 </div>
//               </div>

//               {/* CERTIFICATE REGISTRY - FIXED: SHOWS UPLOADED FILES */}
//               <div className="space-y-4 pt-4 border-t border-white/5">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">3. Certifications</p>
//                   <label className="cursor-pointer text-[9px] font-black text-emerald-400 hover:text-emerald-300 transition-colors">
//                     <Plus size={10} className="inline mb-0.5" /> PDF
//                     <input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, certificateFiles: [...formData.certificateFiles, ...Array.from(e.target.files)]})} />
//                   </label>
//                 </div>

//                 <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
//                   {/* Render Uploaded Certificate Files */}
//                   {formData.certificateFiles.map((file, idx) => (
//                     <div key={`file-${idx}`} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2.5 group animate-in fade-in slide-in-from-right-2">
//                       <div className="flex items-center gap-3 overflow-hidden">
//                         <FileText size={14} className="text-emerald-500 shrink-0" />
//                         <span className="text-[10px] font-bold text-slate-300 truncate">{file.name}</span>
//                       </div>
//                       <button type="button" onClick={() => setFormData({...formData, certificateFiles: formData.certificateFiles.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-300 transition-colors p-1">
//                         <Trash2 size={12} />
//                       </button>
//                     </div>
//                   ))}

//                   {/* Render Certificate Links */}
//                   {formData.certificateLinks.map((link, idx) => (
//                     <div key={`link-${idx}`} className="flex gap-2 group animate-in slide-in-from-right-2">
//                       <div className="relative flex-1">
//                         <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500/50" size={12} />
//                         <input value={link} placeholder="Paste Certificate Link" onChange={(e) => { const u = [...formData.certificateLinks]; u[idx] = e.target.value; setFormData({...formData, certificateLinks: u}); }} className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-[10px] text-white outline-none focus:border-emerald-500 transition-all" />
//                       </div>
//                       <button type="button" onClick={() => setFormData({...formData, certificateLinks: formData.certificateLinks.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-300 p-1">
//                         <Trash2 size={12} />
//                       </button>
//                     </div>
//                   ))}

//                   <button type="button" onClick={() => setFormData({...formData, certificateLinks: [...formData.certificateLinks, ""]})} className="text-[9px] font-black text-emerald-400/60 hover:text-emerald-400 transition-colors mt-2">
//                     + Add More Link
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* ACTION CARD */}
//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button type="submit" disabled={loading} className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-50">
//                 {loading ? <Loader2 className="animate-spin" size={20} /> : <><Database size={18} /><span>Commit Record</span></>}
//               </button>
//               <button type="button" onClick={() => window.history.back()} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Discard & Exit</button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//************************************************working code phase 1 ************************************************************** */
// import React, { useState } from "react";
// import {
//   Check,
//   FileText,
//   Award,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   Phone,
//   Loader2,
//   Plus,
//   Trash2,
//   ExternalLink,
//   Database,
//   Globe
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";

// // Helper Component for consistent input styling
// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
//       <span>{label} {required && <span className="text-red-500">*</span>}</span>
//       {!required && <span className="text-slate-300 font-bold normal-case">Optional</span>}
//     </label>
//     {children}
//     {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</p>}
//   </div>
// );

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     pincode: "",
// //     state: "",
// //     city: "",
// //     district: "",
// //     country: "",
// //     exp: "",
// //     position: "",
// //     education: "",
// //     gender: "",
// // dob: "",
// // about_me: "",
// // languages_spoken: [],
// // resume_link: "",
// // experience_letter_link: "",
// // certificateLinks: [""],
// // certificateFiles: [],

// //     department: "",
// //     cvFile: null,
// //     expLetterFile: null,
// //     // Enterprise Data structure
// //     experiences: [],
// //     certificateFiles: [],
// //     certificateLinks: [""]
// //   });

// const [formData, setFormData] = useState({
//   name: "",
//   email: "",
//   phone: "",
//   address: "",
//   pincode: "",
//   state: "",
//   city: "",
//   district: "",
//   country: "",
//   exp: "",
//   position: "",
//   education: "",
//   gender: "",
//   dob: "",
//   about_me: "",
//   languages_spoken: [],

//   department: "",

//   // Resume (only one)
//   cvFile: null,
//   resume_link: "",

//   // Experience Letter (only one)
//   expLetterFile: null,
//   experience_letter_link: "",

//   // Certificates (multiple both allowed)
//   certificateFiles: [],
//   certificateLinks: [""],

//   experiences: [],
// });

//   const validateField = (field, value) => {
//     let error = "";
//     // Only Name, Email, and Phone are Required
//     if (["name", "email", "phone"].includes(field) && !value) {
//       error = "Required field";
//     }
//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid 10-digit number";

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//     return !error;
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;
//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const postOffice = data[0].PostOffice[0];
//         setFormData(prev => ({
//           ...prev,
//           city: postOffice.Name,
//           state: postOffice.State,
//           district: postOffice.District,
//           country: postOffice.Country,
//         }));
//       }
//     } catch { toast.error("Location lookup failed"); }
//     finally { setIsFetchingPincode(false); }
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const isNameValid = validateField("name", formData.name);
// //     const isEmailValid = validateField("email", formData.email);
// //     const isPhoneValid = validateField("phone", formData.phone);
// //     formDataApi.append("gender", formData.gender);
// // formDataApi.append("dob", formData.dob);
// // formDataApi.append("about_me", formData.about_me);
// // formDataApi.append(
// //   "languages_spoken",
// //   JSON.stringify(formData.languages_spoken)
// // );

// //     if (!isNameValid || !isEmailValid || !isPhoneValid) {
// //       toast.error("Please fill required fields correctly");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const formDataApi = new FormData();
// //       Object.keys(formData).forEach((key) => {
// //         if (formData[key] && !['experiences', 'certificateFiles'].includes(key))
// //           formDataApi.append(key, formData[key]);
// //       });
// //       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
// //       if (formData.expLetterFile) formDataApi.append("experience_letter", formData.expLetterFile);

// //       await candidateService.createCandidate(formDataApi);
// //       toast.success("Candidate file committed to database 🎉");
// //       // Reset logic...
// //     } catch { toast.error("Failed to commit record"); }
// //     finally { setLoading(false); }
// //   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const isNameValid = validateField("name", formData.name);
//   const isEmailValid = validateField("email", formData.email);
//   const isPhoneValid = validateField("phone", formData.phone);

//   if (!isNameValid || !isEmailValid || !isPhoneValid) {
//     toast.error("Please fill required fields correctly");
//     return;
//   }

//   try {
//     setLoading(true);

//     const formDataApi = new FormData();

//     // Append normal fields
//     Object.keys(formData).forEach((key) => {
//       if (
//         formData[key] &&
//         !["experiences", "certificateFiles", "languages_spoken"].includes(key)
//       ) {
//         formDataApi.append(key, formData[key]);
//       }
//     });

//     // Append files
//     if (formData.cvFile) {
//       formDataApi.append("resumepdf", formData.cvFile);
//     }

//     if (formData.expLetterFile) {
//       formDataApi.append("experience_letter", formData.expLetterFile);
//     }

//     // Append new custom fields
//     formDataApi.append("gender", formData.gender);
//     formDataApi.append("dob", formData.dob);
//     formDataApi.append("about_me", formData.about_me);
//     formDataApi.append(
//       "languages_spoken",
//       JSON.stringify(formData.languages_spoken)
//     );

//     // Resume (PDF OR Link)
// if (formData.resume_link) {
//   formDataApi.append("resume_link", formData.resume_link);
// }

// // Experience Letter (PDF OR Link)
// if (formData.experience_letter_link) {
//   formDataApi.append("experience_letter_link", formData.experience_letter_link);
// }

// // Certificate Files (Multiple)
// formData.certificateFiles.forEach((file) => {
//   formDataApi.append("certificate_files[]", file);
// });

// // Certificate Links (Multiple)
// formDataApi.append(
//   "certificate_links",
//   JSON.stringify(formData.certificateLinks.filter(Boolean))
// );

//     await candidateService.createCandidate(formDataApi);

//     toast.success("Candidate file committed to database 🎉");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to commit record");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 antialiased selection:bg-blue-500/30">
//       <div className="max-w-5xl mx-auto space-y-8">

//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//               <Database size={24} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight tracking-tight">Manual Candidate Entry</h2>
//               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Enterprise Talent Acquisition Registry</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
//              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Session</span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           {/* LEFT COLUMN - Primary Data */}
//           <div className="lg:col-span-8 space-y-8">

//             {/* 1. Identity Card */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <User size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Core Identification</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Full Name" required error={errors.name}>
//                   <div className="relative group">
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input
//                       placeholder="e.g. John Doe"
//                       value={formData.name}
//                       onChange={(e) => { setFormData({...formData, name: e.target.value}); validateField("name", e.target.value); }}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>

//                 <FormField label="Email Address" required error={errors.email}>
//                   <div className="relative group">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//                     <input
//                       type="email"
//                       placeholder="john@company.com"
//                       value={formData.email}
//                       onChange={(e) => { setFormData({...formData, email: e.target.value}); validateField("email", e.target.value); }}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Phone Number" required error={errors.phone}>
//                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:border-blue-500 focus-within:bg-white transition-all">
//                     <div className="px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-500 border-r border-slate-200">+91</div>
//                     <input
//                       maxLength={10}
//                       placeholder="9876543210"
//                       value={formData.phone}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(/\D/g, "").slice(0, 10);
//                         setFormData({...formData, phone: v});
//                         validateField("phone", v);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent text-xs font-bold outline-none"
//                     />
//                   </div>
//                 </FormField>
//                 <FormField label="Current Position">
//                   <div className="relative group">
//                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={16} />
//                     <input
//                       placeholder="e.g. Senior Software Engineer"
//                       value={formData.position}
//                       onChange={(e) => setFormData({...formData, position: e.target.value})}
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </FormField>
//               </div>
//             </div>

//             {/* --- NEW PERSONAL DETAILS --- */}
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//   {/* Gender */}
//   <FormField label="Gender">
//     <select
//       value={formData.gender}
//       onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     >
//       <option value="">Select Gender</option>
//       <option value="male">Male</option>
//       <option value="female">Female</option>
//       <option value="other">Other</option>
//     </select>
//   </FormField>

//   {/* DOB */}
//   <FormField label="Date of Birth">
//     <input
//       type="date"
//       value={formData.dob}
//       onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//     />
//   </FormField>

// </div>

// {/* About Me */}
// <FormField label="About Me">
//   <textarea
//     rows={3}
//     placeholder="Short professional summary..."
//     value={formData.about_me}
//     onChange={(e) =>
//       setFormData({ ...formData, about_me: e.target.value })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 resize-none"
//   />
// </FormField>

// {/* Languages Spoken (Multi Select) */}
// {/* Languages Spoken - Multi Select Dropdown */}
// <FormField label="Languages Spoken">

//   <div className="relative">

//     {/* Dropdown Box */}
//     <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">

//       {[
//         "English",
//         "Hindi",
//         "Marathi",
//         "Gujarati",
//         "Tamil",
//         "Telugu",
//         "Kannada",
//         "Bengali"
//       ].map((lang) => (
//         <label
//           key={lang}
//           className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer"
//         >
//           <input
//             type="checkbox"
//             checked={formData.languages_spoken.includes(lang)}
//             onChange={() => {
//               const updated = formData.languages_spoken.includes(lang)
//                 ? formData.languages_spoken.filter((l) => l !== lang)
//                 : [...formData.languages_spoken, lang];

//               setFormData({
//                 ...formData,
//                 languages_spoken: updated,
//               });
//             }}
//             className="w-4 h-4 accent-blue-600"
//           />
//           {lang}
//         </label>
//       ))}

//     </div>

//     {/* Selected Languages Preview */}
//     {formData.languages_spoken.length > 0 && (
//       <div className="flex flex-wrap gap-2 mt-2">
//         {formData.languages_spoken.map((lang) => (
//           <span
//             key={lang}
//             className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md"
//           >
//             {lang}
//           </span>
//         ))}
//       </div>
//     )}

//   </div>

// </FormField>

//             {/* 2. Professional & Education Card */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2">
//                 <Award size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Professional Qualifications</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <FormField label="Total Experience">
//                   <input type="number" placeholder="Years" value={formData.exp} onChange={(e) => setFormData({...formData, exp: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" />
//                 </FormField>
//                 <FormField label="Department">
//                   <input placeholder="HR, Tech, Sales" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" />
//                 </FormField>
//                 <FormField label="Highest Education">
//                   <input placeholder="e.g. MBA, B.Tech" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" />
//                 </FormField>
//               </div>
//             </div>

//             {/* 3. Location Card */}
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2">
//                 <MapPin size={16} className="text-blue-600" />
//                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Permanent Address</h3>
//               </div>
//               <FormField label="Street Address">
//                 <input placeholder="Building name, Flat no, Landmark" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500" />
//               </FormField>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <FormField label="Pincode">
//                   <input
//                     placeholder="000000"
//                     maxLength={6}
//                     value={formData.pincode}
//                     onChange={(e) => {
//                       const v = e.target.value.replace(/\D/g, "").slice(0, 6);
//                       setFormData({...formData, pincode: v});
//                       if (v.length === 6) fetchPincodeDetails(v);
//                     }}
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
//                   />
//                 </FormField>
//                 <FormField label="City"><input value={formData.city} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 outline-none" /></FormField>
//                 <FormField label="District"><input value={formData.district} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 outline-none" /></FormField>
//                 <FormField label="State"><input value={formData.state} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 outline-none" /></FormField>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - Assets & Action */}
//           <div className="lg:col-span-4 space-y-8">

//             {/* Documentation Registry */}
//             <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl space-y-8">
//               <div className="flex items-center gap-2 mb-2">
//                 <FileText size={16} className="text-blue-400" />
//                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Document Registry</h3>
//               </div>

//               {/* Master Resume */}
//               <div className="space-y-4">
//                 <label className="block p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
//                       <FileText size={20} />
//                     </div>
//                     <div className="text-center">
//                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Master Resume</p>
//                       <p className="text-[9px] text-slate-500 mt-1">{formData.cvFile ? formData.cvFile.name : "Select PDF Document"}</p>
//                     </div>
//                   </div>
//                   <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, cvFile: e.target.files[0]})} />
//                 </label>

//                 {/* Experience Letter Link */}
// <FormField label="Experience Letter Link (Optional)">
//   <input
//     type="url"
//     placeholder="https://experience-letter-link.com"
//     value={formData.experience_letter_link}
//     onChange={(e) =>
//       setFormData({
//         ...formData,
//         experience_letter_link: e.target.value,
//         expLetterFile: null,
//       })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
//   />
//   <p className="text-[9px] text-slate-400 font-bold">
//     Upload PDF OR provide link (only one allowed)
//   </p>
// </FormField>

//               </div>

//               {/* Experience Letter */}
//               <div className="space-y-4">
//                 <label className="block p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
//                       <Award size={20} />
//                     </div>
//                     <div className="text-center">
//                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Relieving / Exp Letter</p>
//                       <p className="text-[9px] text-slate-500 mt-1">{formData.expLetterFile ? formData.expLetterFile.name : "Select PDF Document"}</p>
//                     </div>
//                   </div>
//                   <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFormData({...formData, expLetterFile: e.target.files[0]})} />
//                 </label>
//                 {/* Experience Letter Link */}
// <FormField label="Experience Letter Link (Optional)">
//   <input
//     type="url"
//     placeholder="https://experience-letter-link.com"
//     value={formData.experience_letter_link}
//     onChange={(e) =>
//       setFormData({
//         ...formData,
//         experience_letter_link: e.target.value,
//         expLetterFile: null,
//       })
//     }
//     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
//   />
//   <p className="text-[9px] text-slate-400 font-bold">
//     Upload PDF OR provide link (only one allowed)
//   </p>
// </FormField>

//               </div>

//               {/* Certificates */}
// <div className="space-y-4">
//   <h3 className="text-[11px] font-black text-slate-800 uppercase">
//     Certificates (Multiple Allowed)
//   </h3>

//   {/* Certificate Files */}
//   <input
//     type="file"
//     multiple
//     accept=".pdf"
//     onChange={(e) =>
//       setFormData({
//         ...formData,
//         certificateFiles: [...formData.certificateFiles, ...e.target.files],
//       })
//     }
//   />

//   {/* Certificate Links */}
//   {formData.certificateLinks.map((link, index) => (
//     <div key={index} className="flex gap-2">
//       <input
//         type="url"
//         placeholder="Certificate link"
//         value={link}
//         onChange={(e) => {
//           const updated = [...formData.certificateLinks];
//           updated[index] = e.target.value;
//           setFormData({ ...formData, certificateLinks: updated });
//         }}
//         className="flex-1 px-3 py-2 border rounded-lg text-xs"
//       />

//       <button
//         type="button"
//         onClick={() => {
//           const updated = formData.certificateLinks.filter((_, i) => i !== index);
//           setFormData({ ...formData, certificateLinks: updated });
//         }}
//         className="text-red-500 text-xs"
//       >
//         Remove
//       </button>
//     </div>
//   ))}

//   <button
//     type="button"
//     onClick={() =>
//       setFormData({
//         ...formData,
//         certificateLinks: [...formData.certificateLinks, ""],
//       })
//     }
//     className="text-blue-600 text-xs font-bold"
//   >
//     + Add Certificate Link
//   </button>
// </div>

//               <div className="pt-4 border-t border-white/10 text-center">
//                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Verified by Enterprise-grade Encryption</p>
//               </div>
//             </div>

//             {/* Submission Actions */}
//             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <Database size={18} />
//                     <span>Commit Record</span>
//                   </>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
//               >
//                 Discard & Exit
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
//********************************************************working code phase 1 16/02/26***************************************************** */
// import React, { useState } from "react";
// import { Check, FileText, Award } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";

// const ManualEntryPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "",
//     exp: "",
//     position: "",
//     education: "",
//     department: "",
//     fileName: "",
//     cvFile: null,
//     expLetterName: "",
//     expLetterFile: null,
//   });

//   const validateField = (field, value) => {
//     let error = "";

//     if (
//       ["name", "email", "position", "exp", "address", "education", "department"].includes(field) &&
//       !value
//     ) {
//       error = "This field is required";
//     }

//     if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
//       error = "Invalid email";
//     }

//     if (field === "phone" && value && !/^[6-9]\d{9}$/.test(value)) {
//       error = "Invalid phone";
//     }

//     if (field === "pincode" && value && !/^\d{6}$/.test(value)) {
//       error = "Invalid pincode";
//     }

//     setErrors((prev) => {
//       const updated = { ...prev };
//       if (error) updated[field] = error;
//       else delete updated[field];
//       return updated;
//     });
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;

//     try {
//       setIsFetchingPincode(true);
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();

//       if (data[0]?.Status !== "Success") {
//         toast.error("Invalid pincode");
//         return;
//       }

//       const postOffice = data[0].PostOffice[0];

//       setFormData((prev) => ({
//         ...prev,
//         city: postOffice.Name,
//         state: postOffice.State,
//         district: postOffice.District,
//         country: postOffice.Country,
//       }));
//     } catch {
//       toast.error("Failed to fetch pincode");
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const formDataApi = new FormData();

//       Object.keys(formData).forEach((key) => {
//         if (formData[key]) formDataApi.append(key, formData[key]);
//       });

//       if (formData.cvFile) formDataApi.append("resumepdf", formData.cvFile);
//       if (formData.expLetterFile)
//         formDataApi.append("experience_letter", formData.expLetterFile);

//       await candidateService.createCandidate(formDataApi);

//       toast.success("Candidate created 🎉");

//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         pincode: "",
//         state: "",
//         city: "",
//         district: "",
//         country: "",
//         exp: "",
//         position: "",
//         education: "",
//         department: "",
//         fileName: "",
//         cvFile: null,
//         expLetterName: "",
//         expLetterFile: null,
//       });
//     } catch {
//       toast.error("Failed to create candidate");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-10">
//       <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border p-8">
//         <h2 className="text-xl font-black mb-6">Manual Candidate Entry</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={(e) => {
//               setFormData({ ...formData, name: e.target.value });
//               validateField("name", e.target.value);
//             }}
//             className="input"
//           />

//           <input
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => {
//               setFormData({ ...formData, email: e.target.value });
//               validateField("email", e.target.value);
//             }}
//             className="input"
//           />

//           <input
//             placeholder="Phone"
//             value={formData.phone}
//             onChange={(e) => {
//               const v = e.target.value.replace(/\D/g, "").slice(0, 10);
//               setFormData({ ...formData, phone: v });
//               validateField("phone", v);
//             }}
//             className="input"
//           />

//           <input
//             placeholder="Position"
//             value={formData.position}
//             onChange={(e) =>
//               setFormData({ ...formData, position: e.target.value })
//             }
//             className="input"
//           />

//           <input
//             placeholder="Experience"
//             value={formData.exp}
//             onChange={(e) =>
//               setFormData({ ...formData, exp: e.target.value })
//             }
//             className="input"
//           />

//           <input
//             placeholder="Department"
//             value={formData.department}
//             onChange={(e) =>
//               setFormData({ ...formData, department: e.target.value })
//             }
//             className="input"
//           />

//           <input
//             placeholder="Address"
//             value={formData.address}
//             onChange={(e) =>
//               setFormData({ ...formData, address: e.target.value })
//             }
//             className="input"
//           />

//           <input
//             placeholder="Pincode"
//             value={formData.pincode}
//             onChange={(e) => {
//               const v = e.target.value.replace(/\D/g, "").slice(0, 6);
//               setFormData({ ...formData, pincode: v });
//               if (v.length === 6) fetchPincodeDetails(v);
//             }}
//             className="input"
//           />

//           <input value={formData.city} placeholder="City" className="input" readOnly />
//           <input value={formData.state} placeholder="State" className="input" readOnly />
//           <input value={formData.district} placeholder="District" className="input" readOnly />
//           <input value={formData.country} placeholder="Country" className="input" readOnly />

//           {/* Resume */}
//           <input
//             type="file"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 cvFile: e.target.files[0],
//                 fileName: e.target.files[0]?.name,
//               })
//             }
//           />

//           {/* Experience Letter */}
//           <input
//             type="file"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 expLetterFile: e.target.files[0],
//                 expLetterName: e.target.files[0]?.name,
//               })
//             }
//           />

//           <button
//             disabled={loading}
//             className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2"
//           >
//             {loading ? "Saving..." : <> <Check size={16}/> Save Candidate</>}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManualEntryPage;
