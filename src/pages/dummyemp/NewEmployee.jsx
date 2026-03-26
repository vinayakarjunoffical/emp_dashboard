import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Phone, Briefcase, Building2, Save, ArrowLeft,
  MapPin, Globe, Map, Navigation, Loader2, ShieldAlert, 
  Heart, Droplets, Zap, Calendar, Wallet, Landmark, ToggleLeft, ToggleRight,
  GraduationCap, Award, BookOpen, Clock, Check, History, Plus, Edit3, Trash2,
  CheckCircle2, XCircle, CalendarDays, Upload, FileCheck, ChevronDown, PlusCircle,
  Coins, MinusCircle, MoreVertical, Info 
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NewEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [formData, setFormData] = useState({
    // --- STEP 1: IDENTITY & REGIONAL ---
    full_name: "", email: "", phone: "", department_id: "", joining_date: "", role: "", is_fresher: false,
    pincode: "", district: "", state: "", country: "India",
    emergency_contact_name: "", emergency_contact_relation: "", emergency_contact_phone: "", blood_group: "",

    // --- STEP 3: SALARY & SYSTEM ---
    staff_id: `MUMGE${Math.floor(100 + Math.random() * 900)}`,
    attendance_template: "", salary_cycle: "1 to 1 of Every Month", staff_type: "Monthly Regular",
    salary_structure: "Regular PT", opening_balance_type: "Advance", opening_balance_value: "0",
    select_shift: "Don't assign shift", salary_details_access: true, current_cycle_access: false
  });

  // 🚀 Step 2: Edu & Exp States
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduEditingId, setEduEditingId] = useState(null);
  const [eduForm, setEduForm] = useState({
    institution_name: "", score_metric: "Percentage", score: "", start_year: "", end_year: "", education_id: 0, degree: ""
  });

  const emptyExperience = {
    company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: "", location: "", description: "", industry_id: "", department_id: "", exp_letter_file: null,
  };
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [draftExperiences, setDraftExperiences] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ ...emptyExperience });
  const [editingExp, setEditingExp] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);

  // 🚀 API Dropdown States
  const [industries, setIndustries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [educationMasters, setEducationMasters] = useState({ educations: [] });
  const years = Array.from({ length: 61 }, (_, i) => (2030 - i).toString());

  // 🚀 STEP 4: SALARY STRUCTURE STATES (Merged)
  const [newCustomName, setNewCustomName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [selectedEsiItems, setSelectedEsiItems] = useState(["Basic + DA", "HRA"]); 
  const [pfCalcType, setPfCalcType] = useState("Variable");
  const [pfVariablePercent, setPfVariablePercent] = useState("12");
  const [pfFixedAmount, setPfFixedAmount] = useState("1,800");
  const [selectedPfComponents, setSelectedPfComponents] = useState(["Basic + DA"]);

  const [ptSlabs, setPtSlabs] = useState([{ id: 1, min: "0", max: "", tax: "0" }]);
  const [activePtMenu, setActivePtMenu] = useState(null);

  const [earnings, setEarnings] = useState([{ id: 1, label: "HRA", amount: "" }, { id: 2, label: "Medical Allowance", amount: "" }, { id: 3, label: "Special Allowance", amount: "" }]);
  const [deductions, setDeductions] = useState([{ id: 1, label: "Provident Fund (PF)", type: "Variable [12%]", amount: "", hasInfo: true }, { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected", amount: "" }, { id: 3, label: "Professional Tax (PT)", amount: "" }]);
  const [employerContributions, setEmployerContributions] = useState([{ id: 1, label: "Provident Fund (PF)", amount: "" }, { id: 2, label: "Employee State Insurance (ESI)", amount: "" }]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

  const [suggestedEarnings, setSuggestedEarnings] = useState([{ label: "Basic + DA", selected: false }, { label: "HRA", selected: true }, { label: "Medical Allowance", selected: true }, { label: "Special Allowance", selected: true }, { label: "Bonus", selected: false }]);
  const [suggestedDeductions, setSuggestedDeductions] = useState([{ label: "Provident Fund (PF)", selected: true }, { label: "Employee State Insurance (ESI)", selected: true }, { label: "Professional Tax (PT)", selected: true }, { label: "Income Tax (TDS)", selected: false }]);
  const [suggestedEmployer, setSuggestedEmployer] = useState([{ label: "Provident Fund (PF)", selected: true }, { label: "Employee State Insurance (ESI)", selected: true }, { label: "Health Insurance", selected: false }]);


  // 🚀 API Calls for Dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const indRes = await fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100");
        if (indRes.ok) {
          const data = await indRes.json();
          setIndustries(Array.isArray(data) ? data : data.data || []);
        }
        const deptRes = await fetch("https://apihrr.goelectronix.co.in/departments");
        if (deptRes.ok) {
          const data = await deptRes.json();
          setDepartments(Array.isArray(data) ? data : data.data || []);
        }
        const eduRes = await fetch("https://apihrr.goelectronix.co.in/masters?types=educations&skip=0&limit=100");
        if (eduRes.ok) {
          const data = await eduRes.json();
          setEducationMasters(data); 
        }
      } catch (error) {
        console.error("Failed to fetch dropdowns", error);
      }
    };
    fetchDropdowns();
  }, []);

  // 🚀 Pincode Logic
  useEffect(() => {
    const fetchAddress = async () => {
      if (formData.pincode.length === 6 && !formData.district && !formData.state) {
        setPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setFormData(prev => ({ ...prev, state: details.State, district: details.District, country: details.Country }));
            toast.success(`Node Identified: ${details.District}`);
          } else {
            toast.error("Invalid Pincode");
          }
        } catch (error) {
          toast.error("Network Link Failure");
        } finally {
          setPincodeLoading(false);
        }
      }
    };
    fetchAddress();
  }, [formData.pincode, formData.district, formData.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "pincode" && value.length < 6) {
        newData.district = "";
        newData.state = "";
      }
      return newData;
    });
  };

  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Employee Onboard Successfull");
      setIsSubmitting(false);
      navigate("/dummyemp");
    }, 1500);
  };

  // 🚀 Handlers for Modals (Edu & Exp)
  const handleAddEdu = () => {
    setEduEditingId(null);
    setEduForm({ institution_name: "", score_metric: "Percentage", score: "", start_year: "", end_year: "", education_id: 0, degree: "" });
    setShowEduModal(true);
  };

  const handleEditEdu = (edu) => {
    setEduEditingId(edu.id);
    setEduForm({ ...edu });
    setShowEduModal(true);
  };

  const saveEducation = () => {
    if (eduEditingId) {
      setEducations(educations.map(e => e.id === eduEditingId ? { ...eduForm } : e));
    } else {
      setEducations([...educations, { ...eduForm, id: Date.now() }]);
    }
    setShowEduModal(false);
    toast.success("Academic Appended");
  };

  const handleSaveExperience = () => {
    const validDrafts = draftExperiences.filter(exp => exp.company_name);
    setExperiences([...experiences, ...validDrafts.map(e => ({ ...e, id: Date.now() }))]);
    setShowExperienceModal(false);
    setDraftExperiences([]);
    toast.success("Professional  Appended");
  };

  const handleEditExperience = (exp) => {
    setEditingExp(exp);
    setEditForm({ ...exp });
    setShowEditModal(true);
  };

  const handleUpdateExperience = () => {
    setExperiences(experiences.map(e => e.id === editingExp.id ? { ...editForm, id: editingExp.id } : e));
    setShowEditModal(false);
    toast.success("Professional Node Updated");
  };

  const calculateDuration = (start, end) => {
    if (!start) return "Current";
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    if (diffMonths >= 12) {
      const yrs = Math.floor(diffMonths / 12);
      const mos = diffMonths % 12;
      return `${yrs} YR ${mos > 0 ? mos + " MO" : ""}`;
    }
    return `${diffMonths} MO`;
  };

  // 🚀 STEP 4 HELPER FUNCTIONS (Salary Structure)
  const handlePtSlabChange = (id, field, value) => {
    setPtSlabs(ptSlabs.map(slab => slab.id === id ? { ...slab, [field]: value } : slab));
  };
  const addPtRow = (index) => {
    const newSlabs = [...ptSlabs];
    newSlabs.splice(index + 1, 0, { id: Date.now(), min: "", max: "", tax: "0" });
    setPtSlabs(newSlabs);
    setActivePtMenu(null);
  };
  const deletePtRow = (id) => {
    if (ptSlabs.length > 1) {
      setPtSlabs(ptSlabs.filter((slab) => slab.id !== id));
    }
    setActivePtMenu(null);
  };
  const calculateTotal = (list) => {
    return list.reduce((total, item) => {
      const val = parseFloat(item.amount || 0);
      return total + (isNaN(val) ? 0 : val);
    }, 0);
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount);
  };
  const totalEarnings = calculateTotal(earnings);
  const totalDeductions = calculateTotal(deductions); 
  const totalEmployer = calculateTotal(employerContributions);
  const grossPay = totalEarnings;
  const netPay = Math.max(0, grossPay - totalDeductions);
  const ctc = grossPay + totalEmployer;

  const handleInputChange = (id, value, list, setList) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, ''); 
    setList(list.map(item => item.id === id ? { ...item, amount: sanitizedValue } : item));
  };
  const handleSaveList = (suggested, currentList, setList, setModal) => {
    const selectedList = suggested.filter(item => item.selected).map((item, index) => {
      const existing = currentList.find(e => e.label === item.label);
      return existing || { id: Date.now() + index, label: item.label, amount: "", type: "0 Selected" };
    });
    setList(selectedList);
    setModal(false);
  };
  const removeRow = (id, list, setList, suggested, setSuggested) => {
    const itemToRemove = list.find(e => e.id === id);
    setList(list.filter(item => item.id !== id));
    if (itemToRemove) setSuggested(suggested.map(s => s.label === itemToRemove.label ? { ...s, selected: false } : s));
  };


  const departmentName = departments.find(d => d.id == formData.department_id)?.name || "Pending Assignment";

  return (
    <div className="min-h-screen bg-white text-left pb-6">
      <Toaster position="top-right" />

      {/* 🚀 ENTERPRISE HEADER */}
      <div className="backdrop-blur-md border-b border-slate-100 px-6 mb-4 py-3 flex bg-transparent items-center gap-4 sticky top-0 z-[50]">
        <button 
          onClick={() => currentStep === 1 ? navigate(-1) : prevStep()} 
          className="flex items-center gap-2 !text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black capitalize tracking-widest leading-none">
            {currentStep === 1 ? "Back to Page" : "Previous Step"}
          </span>
        </button>
        <div className="h-4 w-[1px] bg-slate-200 mx-2" />
        <div>
          <h2 className="text-[12px] font-black !text-slate-900 !capitalize tracking-tighter leading-none">
            Employee Onboarding
          </h2>
        </div>
      </div>
      
      <div className="mx-6 p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm bg-white">
        
        {/* 🚀 4-STEP PROGRESS TRACKER */}
        <div className="flex items-center gap-2 mb-8 ml-2 overflow-x-auto custom-scrollbar pb-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-black ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {currentStep > 1 ? <Check size={10} strokeWidth={4} /> : "1"}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep >= 1 ? "text-blue-600" : "text-slate-400"}`}>Basic Details</span>
          </div>
          <div className={`w-6 h-[2px] rounded-full shrink-0 ${currentStep >= 2 ? "bg-blue-600" : "bg-slate-100"}`} />
          
          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-black ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {currentStep > 2 ? <Check size={10} strokeWidth={4} /> : "2"}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep >= 2 ? "text-blue-600" : "text-slate-400"}`}>Edu & Exp</span>
          </div>
          <div className={`w-6 h-[2px] rounded-full shrink-0 ${currentStep >= 3 ? "bg-blue-600" : "bg-slate-100"}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-black ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {currentStep > 3 ? <Check size={10} strokeWidth={4} /> : "3"}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep >= 3 ? "text-blue-600" : "text-slate-400"}`}>Salary & Shift</span>
          </div>
          <div className={`w-6 h-[2px] rounded-full shrink-0 ${currentStep >= 4 ? "bg-blue-600" : "bg-slate-100"}`} />

          {/* Step 4 */}
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-black ${currentStep === 4 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>4</div>
            <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep === 4 ? "text-blue-600" : "text-slate-400"}`}>Salary structure</span>
          </div>
        </div>

        <form onSubmit={currentStep === 4 ? handleSubmit : nextStep} className="space-y-8">
          
          {/* ================= STEP 1: BASIC DETAILS ================= */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
              <section className="space-y-4 mb-4">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                   <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100"><User size={14} /></div>
                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Employee Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} icon={<User className={iconStyle}/>}  placeholder="John Doe" />
                  <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail className={iconStyle}/>}  placeholder="john@enterprise.com" />
                  <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className={iconStyle}/>}  placeholder="+91..." />
                  
                  <div className="space-y-1 group">
                    <label className={labelStyle}>Department</label>
                    <div className="relative">
                      <Building2 className={iconStyle} />
                      <select name="department_id" value={formData.department_id} onChange={handleChange} className={inputStyle} >
                        <option value="">Select Domain</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <FormInput label="Role" name="role" value={formData.role} onChange={handleChange} icon={<Briefcase className={iconStyle}/>}  placeholder="Senior Lead" />
                  <FormInput label="Joining Date" name="joining_date" type="date" value={formData.joining_date} onChange={handleChange} icon={<CalendarDays className={iconStyle}/>}  />
                  
                </div>
              </section>

              <section className="space-y-4 mb-4">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                   <div className="w-7 h-7 rounded-lg bg-white border border-blue-600 flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={14} /></div>
                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Address Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1 group">
                    <label className={labelStyle}>Pincode</label>
                    <div className="relative">
                      {pincodeLoading ? <Loader2 className={`${iconStyle} animate-spin text-blue-600`} /> : <Navigation className={iconStyle} />}
                      <input name="pincode" maxLength={6} value={formData.pincode} onChange={handleChange} className={`${inputStyle} pl-8 tracking-[0.2em]`}  placeholder="000000" />
                    </div>
                  </div>
                  <FormInput label="District" name="district" value={formData.district} readOnly icon={<MapPin className={iconStyle}/>} placeholder="Fetching" />
                  <FormInput label="State" name="state" value={formData.state} readOnly icon={<Map className={iconStyle}/>} placeholder="Fetching" />
                  <FormInput label="Country" name="country" value={formData.country} readOnly icon={<Globe className={iconStyle}/>} />
                </div>
              </section>

              <section className="space-y-4 pt-4">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                   <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-blue-600 text-blue-600 shadow-sm shadow-rose-100"><ShieldAlert size={14} /></div>
                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Emergency Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormInput label="Contact Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} icon={<User className={iconStyle}/>} placeholder="Next of Kin" />
                  <FormInput label="Relation" name="emergency_contact_relation" value={formData.emergency_contact_relation} onChange={handleChange} icon={<Heart className={iconStyle}/>} placeholder="e.g. Spouse" />
                  <FormInput label="Emergency Phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} placeholder="+91..." />
                  <div className="space-y-1 group">
                    <label className={labelStyle}>Blood Group</label>
                    <div className="relative">
                      <Droplets className={iconStyle} />
                      <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputStyle}>
                        <option value="">Select Group</option>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ================= STEP 2: EDUCATION & EXPERIENCE ================= */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
              {/* 🎓 EDUCATION SECTION */}
              <section className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                      <Landmark size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Academic Details</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Education History</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleAddEdu} className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:!bg-white transition-all border-2 border-blue-600 active:scale-95 shadow-sm shadow-blue-100 cursor-pointer">
                    <Plus size={14} strokeWidth={3} /> Add Education
                  </button>
                </div>

                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-20 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                  {educations.length > 0 ? (
                    educations.map((edu, index) => (
                      <div key={edu.id || index} className="relative flex items-start group">
                        <div className="w-20 pt-1 shrink-0">
                          <p className="text-xl font-black text-slate-900 leading-none">{edu.end_year || new Date().getFullYear()}</p>
                          <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-1">Completion</p>
                        </div>
                        <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-600 z-10 mt-2 group-hover:scale-125 transition-transform" />
                        <div className="flex-1 ml-10 bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{edu.institution_name}</h3>
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{edu.degree}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                                <CheckCircle2 size={12} /> {edu.score} {edu.score_metric === 'Percentage' ? '%' : 'CGPA'}
                              </div>
                              <button type="button" onClick={() => handleEditEdu(edu)} className="p-2 !bg-blue-50 !text-blue-600 border-2 border-blue-600 hover:!bg-white hover:!text-white rounded-lg transition-all cursor-pointer">
                                <Edit3 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-50">
                            <MiniField label="Degree" value={edu.degree} />
                            <MiniField label="Duration" value={`${edu.start_year} - ${edu.end_year}`} />
                            <MiniField label="Status" value="Verified" />
                          </div>
                          <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none rotate-12"><Landmark size={100} /></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="ml-20 bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300"><Landmark size={40} /></div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Academic History Blank</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">No educational nodes appended to this profile</p>
                    </div>
                  )}
                </div>
              </section>

              {/* 💼 EXPERIENCE SECTION */}
              {!formData.is_fresher && (
                <section className="space-y-4 pt-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                        <History size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Experience</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional History</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => { setDraftExperiences([...draftExperiences, emptyExperience]); setShowExperienceModal(true); }} className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-white border-2 border-blue-600 transition-all active:scale-95 cursor-pointer">
                      <Plus size={14} strokeWidth={3} /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-10 relative before:absolute before:inset-0 before:ml-20 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                    
                    {/* CURRENT NODE */}
                    <div className="relative flex items-start group">
                      <div className="w-20 pt-1 shrink-0">
                        <p className="text-xl font-black text-blue-600 leading-none">{new Date().getFullYear()}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Current Node</p>
                      </div>
                      <div className="absolute left-20 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white z-10 mt-1.5 shadow-sm" />
                      <div className="flex-1 ml-10 bg-gradient-to-br from-blue-50/40 to-white border border-blue-100 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-blue-600 text-white uppercase tracking-widest mb-2 inline-block">Active Deployment</span>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">GoElectronix Enterprise</h3>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{formData.role || "Pending Assignment"}</p>
                          </div>
                          <div className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Active</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-blue-50">
                          <MiniField label="Department" value={departmentName} />
                          <MiniField label="Confirm Date" value="Pending" />
                          <MiniField label="Status" value="Onboarding" isBold />
                          <MiniField label="Location" value={formData.district || "Pending"} />
                        </div>
                      </div>
                    </div>

                    {/* PAST NODES */}
                    {experiences.map((exp, index) => {
                      const indName = industries.find(i => i.id == exp.industry_id)?.name || "General";
                      const depName = departments.find(d => d.id == exp.department_id)?.name || "Operations";
                      return (
                        <div key={exp.id || index} className="relative flex items-start group">
                          <div className="w-20 pt-1 shrink-0 opacity-60">
                            <p className="text-xl font-black text-slate-400 leading-none">{exp.start_date ? new Date(exp.start_date).getFullYear() : "Past"}</p>
                          </div>
                          <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white z-10 mt-2" />
                          <div className="flex-1 ml-10 bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h3 className="text-md font-black text-slate-800 uppercase">{exp.company_name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.job_title}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-1 bg-slate-50 text-slate-500 rounded-md text-[9px] font-black border border-slate-100 flex items-center gap-1">
                                  <Clock size={10} /> {calculateDuration(exp.start_date, exp.end_date)}
                                </div>
                                <button type="button" onClick={() => handleEditExperience(exp)} className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer">
                                  <Edit3 size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-50">
                              <MiniField label="Previous CTC" value={exp.previous_ctc ? `₹${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "—"} isBold />
                              <MiniField label="Industry" value={indName} />
                              <MiniField label="Department" value={depName} />
                              <MiniField label="Location" value={exp.location} />
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none rotate-12"><Briefcase size={80} /></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ================= STEP 3: SHIFT DETAILS ================= */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                  <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600"><Wallet size={14} /></div>
                  <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Shift & Configuration Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormInput label="Employee ID" name="staff_id" value={formData.staff_id} readOnly icon={<Landmark className={iconStyle}/>} />
                  
                  <div className="space-y-1 group">
                    <label className={labelStyle}>Attendance Settings</label>
                    <div className="relative">
                      <Calendar className={iconStyle} />
                      <select name="attendance_template" value={formData.attendance_template} onChange={handleChange} className={inputStyle}>
                        <option value="">Select template</option>
                        <option value="1">Standard Shift (9-6)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1 group">
                    <label className={labelStyle}>Salary Cycle</label>
                    <div className="relative">
                      <Zap className={iconStyle} />
                      <select name="salary_cycle" value={formData.salary_cycle} onChange={handleChange} className={inputStyle}>
                        <option>1 to 1 of Every Month</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1 group">
                    <label className={labelStyle}>Salary Structure Template</label>
                    <div className="relative">
                      <Building2 className={iconStyle} />
                      <select name="salary_structure" value={formData.salary_structure} onChange={handleChange} className={inputStyle}>
                        <option>Regular PT</option>
                        <option>Hourly Contract</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1 group">
                    <label className={labelStyle}>Opening Balance</label>
                    <div className="flex gap-2 relative">
                       <select name="opening_balance_type" value={formData.opening_balance_type} onChange={handleChange} className={`${inputStyle} !pl-3 w-2/5`}>
                         <option>Advance</option>
                         <option>Pending</option>
                       </select>
                       <ChevronDown size={14} className="absolute left-[33%] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1 group">
                    <label className={labelStyle}>Balance Amount</label>
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
                          <input name="opening_balance_value" type="number" value={formData.opening_balance_value} onChange={handleChange} className={`${inputStyle} !pl-3 w-sm`} />
                       </div>
                    </div>
                  </div>
                </div>

                {/* ACCESS LOGIC SWITCHES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30 transition-all hover:bg-white">
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Salary Details Access</p>
                      <p className="text-[9px] text-slate-400">Allow staff member to view full salary calculations</p>
                    </div>
                    <button type="button" className=' !bg-transparent cursor-pointer outline-none border-0' onClick={() => setFormData(p => ({...p, salary_details_access: !p.salary_details_access}))}>
                      {formData.salary_details_access ? <ToggleRight size={28} className="!text-blue-600" /> : <ToggleLeft size={28} className="!text-slate-300" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30 transition-all hover:bg-white">
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Allow Current Cycle Salary Access</p>
                      <p className="text-[9px] text-slate-400">Allow viewing current cycle salary accumulation</p>
                    </div>
                    <button type="button" className=' !bg-transparent cursor-pointer outline-none border-0' onClick={() => setFormData(p => ({...p, current_cycle_access: !p.current_cycle_access}))}>
                      {formData.current_cycle_access ? <ToggleRight size={28} className="text-blue-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ================= STEP 4: SALARY STRUCTURE ================= */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              
              {/* 💰 1. EARNINGS SECTION */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Coins size={18} strokeWidth={2.5} /></div>
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Earnings</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 tracking-tight">₹ {formatCurrency(totalEarnings)}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">/ Month</span>
                    </div>
                    <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> Add More</button>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  {earnings.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                      <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
                      <div className="relative w-full md:w-64 ml-auto text-left">
                        <input 
                          type="text" 
                          placeholder="0.00" 
                          value={item.amount}
                          onChange={(e) => handleInputChange(item.id, e.target.value, earnings, setEarnings)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all" 
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">₹</span>
                      </div>
                      <button type="button" onClick={() => removeRow(item.id, earnings, setEarnings, suggestedEarnings, setSuggestedEarnings)} className="p-2 !text-slate-200 hover:!text-rose-500 rounded-xl !bg-transparent border border-transparent hover:border-rose-100 cursor-pointer transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📉 2. DEDUCTIONS SECTION */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MinusCircle size={18} strokeWidth={2.5} /></div>
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Deductions</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 tracking-tight">₹ {formatCurrency(totalDeductions)}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">/ Month</span>
                    </div>
                    <button type="button" onClick={() => setIsDeductionModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> Add More</button>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {deductions.map((item) => (
                    <div key={item.id} className={`space-y-4 relative ${activeDropdown === item.id ? 'z-[60]' : 'z-10'}`}>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="md:w-1/2 flex items-center gap-2 text-left">
                          {item.isExpandable && <ChevronUp size={14} className="text-blue-600" />}
                          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
                          {item.hasInfo && <Info size={12} className="text-slate-300" />}
                        </div>

                        <div className="relative w-full md:w-64 ml-auto flex gap-2">
                          {/* 🚀 PF DYNAMIC DROPDOWN */}
                          {item.label === "Provident Fund (PF)" ? (
                            <div className="relative w-full">
                              <div
                                onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? "border-blue-600 bg-white" : "hover:border-slate-300"}`}
                              >
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter truncate pr-2">
                                  {pfCalcType === "Fixed" ? `₹ ${pfFixedAmount} Fixed` : `${pfVariablePercent}% Variable`}
                                </span>
                                <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                              </div>

                              {activeDropdown === item.id && (
                                <>
                                  <div className="fixed inset-0 z-[70]" onClick={() => setActiveDropdown(null)} />
                                  <div className="absolute top-full right-0 mt-1 w-full min-w-[240px] bg-white border border-slate-200 rounded-xl shadow-xl z-[80] p-1.5 animate-in fade-in slide-in-from-top-1 duration-200 text-left">
                                    <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all" onClick={() => setPfCalcType("Fixed")}>
                                      <input type="radio" checked={pfCalcType === "Fixed"} onChange={() => setPfCalcType("Fixed")} className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-0" />
                                      <span className={`text-[11px] font-bold ${pfCalcType === "Fixed" ? "text-slate-900" : "text-slate-400"}`}>₹ 1,800 Fixed</span>
                                    </label>

                                    <label className="flex flex-row items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all mt-0.5" onClick={() => setPfCalcType("Variable")}>
                                      <input type="radio" checked={pfCalcType === "Variable"} onChange={() => setPfCalcType("Variable")} className="w-3.5 h-3.5 shrink-0 text-blue-600 border-slate-300 focus:ring-0" />
                                      <div className="flex items-center gap-1.5 flex-1 whitespace-nowrap">
                                        <input type="text" value={pfVariablePercent} onChange={(e) => setPfVariablePercent(e.target.value)} onFocus={() => setPfCalcType("Variable")} onClick={(e) => e.stopPropagation()} className="w-8 shrink-0 bg-transparent border-b border-slate-200 text-center outline-none text-[11px] font-black text-slate-700 focus:border-blue-600 py-0" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">% Variable</span>
                                      </div>
                                    </label>

                                    <div className={`mt-1.5 pt-1 border-t border-slate-50 space-y-0.5 ${pfCalcType === "Variable" ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                                      {["Basic + DA", "HRA", "Medical Allowance", "Special Allowance", "OT Wages", "Bonus Wages", "Allowance Wages"].map((comp) => (
                                        <label key={comp} className="flex items-center gap-2.5 px-2 py-1 hover:bg-blue-50/50 rounded-md cursor-pointer transition-all">
                                          <input type="checkbox" checked={selectedPfComponents.includes(comp)} disabled={pfCalcType !== "Variable"} onChange={() => setSelectedPfComponents((prev) => prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp])} className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-0" />
                                          <span className={`text-[9px] font-black uppercase tracking-tight ${selectedPfComponents.includes(comp) && pfCalcType === "Variable" ? "text-blue-600" : "text-slate-400"}`}>{comp}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : item.label === "Employee State Insurance (ESI)" ? (
                            /* 🚀 ESI DYNAMIC DROPDOWN */
                            <div className="relative w-full">
                              <div onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? 'border-blue-600 ring-4 ring-blue-600/5 bg-white' : 'hover:border-slate-300'}`}>
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                  {selectedEsiItems.length > 0 ? `${selectedEsiItems.length} Selected` : "Select Components"}
                                </span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                              </div>

                              {activeDropdown === item.id && (
                                <>
                                  <div className="fixed inset-0 z-[70]" onClick={() => setActiveDropdown(null)} />
                                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] p-2 animate-in fade-in slide-in-from-top-1 duration-200 max-h-64 overflow-y-auto custom-scrollbar text-left">
                                    {['Basic + DA', 'HRA', 'Medical Allowance', 'Special Allowance', 'OT Wages', 'Bonus Wages', 'Allowance Wages'].map((opt) => (
                                      <label key={opt} className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all">
                                        <input type="checkbox" checked={selectedEsiItems.includes(opt)} onChange={() => setSelectedEsiItems(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])} className="w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 accent-blue-600" />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedEsiItems.includes(opt) ? 'text-blue-600' : 'text-slate-500'}`}>
                                          {opt}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : item.label === "Professional Tax (PT)" ? (
                            /* 🚀 PT HEADER */
                            <div className="w-full text-right h-10 flex items-center justify-end px-2">
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Manual Configuration</span>
                            </div>
                          ) : (
                            /* 🚀 STANDARD DEDUCTION INPUT */
                            <div className="relative w-full text-left">
                              <input 
                                type="text" 
                                placeholder="0.00"
                                value={item.amount}
                                onChange={(e) => handleInputChange(item.id, e.target.value, deductions, setDeductions)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all shadow-sm" 
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">₹</span>
                            </div>
                          )}
                        </div>

                        {item.label !== "Professional Tax (PT)" && (
                          <button type="button" onClick={() => removeRow(item.id, deductions, setDeductions, suggestedDeductions, setSuggestedDeductions)} className="p-2 !text-slate-200 hover:!text-rose-500 !bg-transparent border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* 🚀 PROFESSIONAL TAX SLABS LOGIC */}
                      {item.label === "Professional Tax (PT)" && (
                        <div className="space-y-3 pt-2 pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between ml-1 sm:ml-8 gap-3 sm:gap-0 mb-4">
                            <button type="button" className="text-[10px] font-medium !text-blue-600 hover:underline border-0 p-0 !bg-transparent cursor-pointer flex items-center gap-1.5 w-fit">
                              Read Professional Tax Policy <span className="text-slate-400">Across States</span>
                            </button>
                          </div>

                          <div className="flex flex-col gap-3 sm:gap-2 ml-1 sm:ml-8">
                            {ptSlabs.map((slab, index) => (
                              // 🔥 DYNAMIC Z-INDEX FIX FOR SLABS
                              <div key={slab.id} className={`flex flex-col md:flex-row md:items-center justify-end gap-3 sm:gap-4 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-none relative ${activePtMenu === slab.id ? 'z-[60]' : 'z-10'}`}>
                                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 italic mb-1 sm:mb-0 mr-2">If monthly payable salary is</p>

                                <div className="grid grid-cols-[1fr_1fr] sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                  {/* MIN Input */}
                                  <div className="relative w-full sm:w-24">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                                    <input
                                      type="text"
                                      value={index === 0 ? slab.min : ptSlabs[index - 1].max}
                                      onChange={(e) => { if (index === 0) handlePtSlabChange(slab.id, "min", e.target.value); }}
                                      readOnly={index !== 0}
                                      className={`w-full pl-7 pr-3 py-2 bg-white sm:bg-slate-50 border border-slate-200 sm:border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 outline-none focus:border-blue-400 ${index !== 0 ? "opacity-70 bg-slate-100 cursor-not-allowed" : ""}`}
                                    />
                                  </div>

                                  {/* MAX Input */}
                                  <div className="relative w-full sm:w-24">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                                    <input
                                      type="text"
                                      value={index === ptSlabs.length - 1 ? "" : slab.max}
                                      onChange={(e) => { if (index !== ptSlabs.length - 1) handlePtSlabChange(slab.id, "max", e.target.value); }}
                                      readOnly={index === ptSlabs.length - 1}
                                      placeholder={index === ptSlabs.length - 1 ? "max" : ""}
                                      className={`w-full pl-7 pr-3 py-2 bg-white sm:bg-slate-50 border border-slate-200 sm:border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 outline-none focus:border-blue-400 ${index === ptSlabs.length - 1 ? "opacity-70 bg-slate-100 cursor-not-allowed" : ""}`}
                                    />
                                  </div>
                                </div>

                                {/* Tax Amount Input & Menu */}
                                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 sm:ml-4 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto relative">
                                  <div className="relative flex-1 sm:flex-none sm:w-24">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                                    <input
                                      type="text"
                                      value={slab.tax}
                                      onChange={(e) => handlePtSlabChange(slab.id, "tax", e.target.value)}
                                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 shadow-sm"
                                    />
                                  </div>

                                  <button type="button" onClick={() => setActivePtMenu(activePtMenu === slab.id ? null : slab.id)} className="p-1.5 !text-slate-400 hover:!text-slate-900 !bg-white sm:!bg-transparent border border-slate-200 sm:border-0 rounded-lg shrink-0 transition-colors cursor-pointer">
                                    <MoreVertical size={16} />
                                  </button>

                                  {activePtMenu === slab.id && (
                                    <>
                                      <div className="fixed inset-0 z-[70]" onClick={() => setActivePtMenu(null)} />
                                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl z-[80] p-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <button type="button" onClick={() => addPtRow(index)} className="w-full text-left px-3 py-2 text-[10px] font-black !text-slate-600 hover:!bg-slate-50 hover:!text-blue-600 rounded-lg transition-colors uppercase tracking-widest cursor-pointer !bg-transparent border-0 outline-none">
                                          Add Row
                                        </button>
                                        <button type="button" onClick={() => deletePtRow(slab.id)} disabled={ptSlabs.length === 1} className="w-full text-left px-3 py-2 text-[10px] font-black !text-rose-500 hover:!bg-rose-50 hover:!text-rose-600 rounded-lg transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed mt-0.5 !bg-transparent border-0 outline-none">
                                          Delete Row
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 🤝 3. EMPLOYER SECTION */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={18} strokeWidth={2.5} /></div>
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Employer's Contribution</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 tracking-tight">₹ {formatCurrency(totalEmployer)}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">/ Month</span>
                    </div>
                    <button type="button" onClick={() => setIsEmployerModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> Add More</button>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  {employerContributions.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                      <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
                      <div className="relative w-full md:w-64 ml-auto text-left">
                        <input 
                          type="text" 
                          placeholder="0.00" 
                          value={item.amount}
                          onChange={(e) => handleInputChange(item.id, e.target.value, employerContributions, setEmployerContributions)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all" 
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                      </div>
                      <button type="button" onClick={() => removeRow(item.id, employerContributions, setEmployerContributions, suggestedEmployer, setSuggestedEmployer)} className="p-2 !text-slate-200 hover:!text-rose-500 !bg-transparent border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                {/* 🔥 FINAL CTC SUMMARY */}
                <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-xl">
                  <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">CTC <span className="text-[9px] font-bold text-slate-400 tracking-widest ml-2">(Gross Pay + Contributions)</span></span>
                  <span className="text-base font-black text-blue-600">₹ {formatCurrency(ctc)} <span className="text-[9px] text-slate-400">/ Month</span></span>
                </div>
              </div>

            </div>
          )}

          {/* ACTION DOCK */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => currentStep === 1 ? navigate(-1) : prevStep()} className="px-6 py-2.5 !text-slate-500 !bg-transparent font-black text-[10px] uppercase border !border-slate-300 rounded-xl hover:!bg-slate-50 transition-all cursor-pointer outline-none">
              {currentStep === 1 ? "Cancel" : "Previous"}
            </button>
            <button type="submit" disabled={isSubmitting || pincodeLoading} className="flex items-center gap-2 !bg-white hover:!bg-white disabled:!bg-slate-200 !text-blue-600 font-black border border-blue-600 text-[10px] uppercase tracking-[0.1em] px-10 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-100 active:scale-95 cursor-pointer outline-none">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {currentStep === 4 ? "Finalize Onboarding" : `Proceed to Step ${currentStep + 1}`}</>}
            </button>
          </div>
        </form>
      </div>

      {/* 🛡️ MODALS FOR SALARY STRUCTURE */}
      {[
        { open: isModalOpen, setOpen: setIsModalOpen, list: suggestedEarnings, setList: setSuggestedEarnings, title: "Earnings", onSave: () => handleSaveList(suggestedEarnings, earnings, setEarnings, setIsModalOpen) },
        { open: isDeductionModalOpen, setOpen: setIsDeductionModalOpen, list: suggestedDeductions, setList: setSuggestedDeductions, title: "Deductions", onSave: () => handleSaveList(suggestedDeductions, deductions, setDeductions, setIsDeductionModalOpen) },
        { open: isEmployerModalOpen, setOpen: setIsEmployerModalOpen, list: suggestedEmployer, setList: setSuggestedEmployer, title: "Employer Contribution", onSave: () => handleSaveList(suggestedEmployer, employerContributions, setEmployerContributions, setIsEmployerModalOpen) }
      ].map((modal) => modal.open && (
        <div key={modal.title} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => modal.setOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 text-left">
            <div className="p-6 space-y-1"><h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{modal.title} List</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">*Select at least one component</p></div>
            <div className="px-6 py-4 space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Suggested</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {modal.list.map((item, index) => (
                  <label key={index} className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" checked={item.selected} onChange={() => { const updated = [...modal.list]; updated[index].selected = !updated[index].selected; modal.setList(updated); }} className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="pt-2"><h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Custom List</h4>
                <div className="flex gap-2"><input type="text" placeholder="Add custom item" className="flex-1 !bg-slate-50 border !border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:!border-blue-400" value={newCustomName} onChange={(e) => setNewCustomName(e.target.value)} /><button type="button" onClick={() => { if(newCustomName) { modal.setList([...modal.list, {label: newCustomName, selected: true}]); setNewCustomName(""); } }} className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer outline-none">Add</button></div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
              <button type="button" onClick={() => modal.setOpen(false)} className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={modal.onSave} className="flex-1 py-3 !bg-blue-600 !text-white border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      ))}

      {/* 🛡️ MODALS: EDUCATION & EXPERIENCE (Placed outside the main content) */}
      {/* ADD/EDIT EDUCATION MODAL */}
      {showEduModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEduModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase">Academic Details</h2>
              </div>
              <button type="button" onClick={() => setShowEduModal(false)} className="p-1.5 !bg-transparent rounded-lg hover:!bg-slate-100 !text-slate-400 hover:!text-slate-600 transition-colors border-0 cursor-pointer">
                <XCircle size={16} strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 relative group">
                    <label className={labelStyle}>Degree Type</label>
                    <div className="relative">
                      <select value={eduForm.degree || ""} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className={inputStyle}>
                        <option value="">Select Qualification</option>
                        {educationMasters?.educations?.length > 0 ? (
                          educationMasters.educations.map((edu) => <option key={edu.id} value={edu.name}>{edu.name}</option>)
                        ) : (<option disabled>Loading registry...</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                  <FormInput label="Institution Name" value={eduForm.institution_name} onChange={(e) => setEduForm({...eduForm, institution_name: e.target.value})} placeholder="e.g. Mumbai University" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 relative group">
                    <label className={labelStyle}>Start Year</label>
                    <div className="relative">
                      <select value={eduForm.start_year || ""} onChange={(e) => setEduForm({ ...eduForm, start_year: e.target.value })} className={inputStyle}>
                        <option value="">YYYY</option>
                        {years.map((year) => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 relative group">
                    <label className={labelStyle}>End Year</label>
                    <div className="relative">
                      <select value={eduForm.end_year || ""} onChange={(e) => setEduForm({ ...eduForm, end_year: e.target.value })} className={inputStyle}>
                        <option value="">YYYY</option>
                        {years.map((year) => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className={labelStyle}>Academic Performance</label>
                    <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                      {["Percentage", "CGPA"].map((metric) => (
                        <button key={metric} type="button" onClick={() => setEduForm(prev => ({ ...prev, score_metric: metric, score: "" }))} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border-0 outline-none cursor-pointer ${eduForm.score_metric === metric ? "!bg-white !text-blue-600 shadow-sm border !border-slate-200" : "!text-slate-400 !bg-transparent"}`}>
                          {metric}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-black text-[10px]">
                      {eduForm.score_metric === "Percentage" ? "%" : "★"}
                    </div>
                    <input type="text" className={`${inputStyle} h-12 !pl-8`} placeholder={eduForm.score_metric === "Percentage" ? "Enter Percentage" : "Enter CGPA"} value={eduForm.score} onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-white flex justify-end gap-2 sticky bottom-0 z-20">
              <button type="button" onClick={saveEducation} className="px-6 py-1.5 !bg-white !text-blue-600 border-2 !border-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-50 shadow-sm active:scale-95 cursor-pointer">
                <Save size={12} strokeWidth={2.5} /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPERIENCE MODAL */}
      {showExperienceModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowExperienceModal(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 !bg-white !text-blue-600 rounded-xl shadow-sm shadow-blue-200"><Briefcase size={20} strokeWidth={2.5} /></div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Professional Experience</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Add Employment Node</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowExperienceModal(false)} className="p-2 !bg-transparent hover:!bg-slate-100 rounded-full !text-slate-400 transition-colors border-0 cursor-pointer">
                <XCircle size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30 custom-scrollbar">
              {draftExperiences.map((exp, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                    <span className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">Entry Node #{index + 1}</span>
                    {draftExperiences.length > 1 && (
                      <button type="button" onClick={() => setDraftExperiences(draftExperiences.filter((_, i) => i !== index))} className="text-[10px] !bg-transparent font-black !text-blue-600 uppercase flex items-center gap-1 border-0 cursor-pointer">
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormInput label="Company Name" value={exp.company_name} onChange={(e) => { const u=[...draftExperiences]; u[index].company_name=e.target.value; setDraftExperiences(u); }} placeholder="e.g. Google" />
                    
                    <div className="space-y-1 group">
                      <label className={labelStyle}>Industry</label>
                      <div className="relative">
                        <select value={exp.industry_id || ""} onChange={(e) => { const u=[...draftExperiences]; u[index].industry_id=e.target.value; setDraftExperiences(u); }} className={inputStyle}>
                          <option value="">Select Industry</option>
                          {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <label className={labelStyle}>Department</label>
                      <div className="relative">
                        <select value={exp.department_id || ""} onChange={(e) => { const u=[...draftExperiences]; u[index].department_id=e.target.value; setDraftExperiences(u); }} className={inputStyle}>
                          <option value="">Select Department</option>
                          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <FormInput label="Position" value={exp.job_title} onChange={(e) => { const u=[...draftExperiences]; u[index].job_title=e.target.value; setDraftExperiences(u); }} placeholder="e.g. Engineer" />
                    <FormInput label="Start Date" type="date" value={exp.start_date} onChange={(e) => { const u=[...draftExperiences]; u[index].start_date=e.target.value; setDraftExperiences(u); }} />
                    <FormInput label="End Date" type="date" value={exp.end_date} onChange={(e) => { const u=[...draftExperiences]; u[index].end_date=e.target.value; setDraftExperiences(u); }} />
                    
                    <div className="space-y-1 group">
                      <label className={labelStyle}>Previous CTC</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input type="number" className={`${inputStyle} !pl-8`} value={exp.previous_ctc} onChange={(e) => { const u=[...draftExperiences]; u[index].previous_ctc=e.target.value; setDraftExperiences(u); }} placeholder="0.00" />
                      </div>
                    </div>

                    <FormInput label="Location" value={exp.location} onChange={(e) => { const u=[...draftExperiences]; u[index].location=e.target.value; setDraftExperiences(u); }} placeholder="e.g. Mumbai" />
                    
                    <div className="md:col-span-2 space-y-1">
                      <label className={labelStyle}>Description</label>
                      <textarea rows={3} className={`${inputStyle} resize-none rounded-xl`} value={exp.description} onChange={(e) => { const u=[...draftExperiences]; u[index].description=e.target.value; setDraftExperiences(u); }} placeholder="Key responsibilities..." />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setDraftExperiences([...draftExperiences, emptyExperience])} className="w-full py-4 border-2 border-dashed !border-slate-200 rounded-2xl !text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:!bg-white hover:!border-blue-400 hover:!text-blue-600 !bg-transparent transition-all flex items-center justify-center gap-2 cursor-pointer outline-none">
                <PlusCircle size={18} /> Add Another Record
              </button>
            </div>
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 z-20">
              <button type="button" onClick={handleSaveExperience} className="flex items-center border !border-blue-600 gap-2 bg-blue-600 hover:bg-blue-700 !text-white font-black px-10 py-3 rounded-xl shadow-sm shadow-blue-600/20 transition-all active:scale-95 text-[11px] uppercase tracking-[0.15em] cursor-pointer">
                <Save size={16} /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EXPERIENCE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Experience</h2>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.15em] mt-0.5">System Record : {editForm.company_name}</p>
              </div>
              <button type="button" onClick={() => setShowEditModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all border-0 !bg-transparent cursor-pointer">
                <XCircle size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormInput label="Company Name" value={editForm.company_name} onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} />
                <FormInput label="Job Title" value={editForm.job_title} onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })} />
                <FormInput label="Start Date" type="date" value={editForm.start_date} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} />
                <FormInput label="End Date" type="date" value={editForm.end_date} onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} />
                <div className="space-y-1 group">
                  <label className={labelStyle}>Previous CTC</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input type="number" className={`${inputStyle} !pl-8`} value={editForm.previous_ctc} onChange={(e) => setEditForm({ ...editForm, previous_ctc: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
                <FormInput label="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyle}>Description</label>
                  <textarea rows={3} className={`${inputStyle} resize-none`} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 !bg-white border !border-slate-300 text-sm font-bold !text-slate-600 rounded-xl transition-all cursor-pointer hover:!bg-slate-100">Cancel</button>
              <button type="button" onClick={handleUpdateExperience} className="flex items-center gap-2 px-8 !border-blue-600 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl border transition-all active:scale-[0.98] cursor-pointer">
                <Save size={18} /> Update Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// 🚀 ENTERPRISE SHARED STYLES
const labelStyle = "block text-[9px] font-black text-slate-400 capitalize tracking-[0.1em] mb-1.5 ml-1";
const inputStyle = "w-full pl-3 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-[12px] font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-200 shadow-sm appearance-none";
const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors pointer-events-none";

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1 group">
    <label className={labelStyle}>{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">{icon}</div>}
      <input {...props} className={` ml-2 ${icon ? '!pl-9' : ''} ${inputStyle} ${props.readOnly ? 'cursor-default bg-slate-50/50' : ''}`} />
    </div>
  </div>
);

const MiniField = ({ label, value, isBold }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
    <p className={`text-[10px] uppercase tracking-tight ${isBold ? "font-black text-slate-900" : "font-bold text-slate-600"}`}>
      {value || "Not Specified"}
    </p>
  </div>
);

// 📄 REUSABLE UPLOAD CARD COMPONENT
const UploadCard = ({ label }) => (
  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all group">
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <Upload className="w-6 h-6 mb-2 text-slate-400 group-hover:text-blue-600 transition-colors" />
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 text-center">{label}</p>
      <p className="text-[8px] text-slate-400 uppercase tracking-widest">PDF, JPG (Max 5MB)</p>
    </div>
    <input type="file" className="hidden" />
  </label>
);

export default NewEmployee;
//*************************************************************************************************************** */
// import React, { useState, useEffect } from 'react'
// import { 
//   User, Mail, Phone, Briefcase, Building2, Save, ArrowLeft,
//   MapPin, Globe, Map, Navigation, Loader2, ShieldAlert, 
//   Heart, Droplets, Zap, Calendar, Wallet, Landmark, ToggleLeft, ToggleRight,
//   GraduationCap, Award, BookOpen, Clock, Check, History, Plus, Edit3, Trash2,
//   CheckCircle2, XCircle, CalendarDays, Upload, FileCheck, ChevronDown, PlusCircle,
// } from "lucide-react";
// import { Toaster, toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const NewEmployee = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     // --- STEP 1: IDENTITY & REGIONAL ---
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     is_fresher: false,
//     pincode: "",
//     district: "",
//     state: "",
//     country: "India",
//     emergency_contact_name: "",
//     emergency_contact_relation: "",
//     emergency_contact_phone: "",
//     blood_group: "",

//     // --- STEP 3: SALARY & SYSTEM ---
//     staff_id: `MUMGE${Math.floor(100 + Math.random() * 900)}`,
//     attendance_template: "",
//     salary_cycle: "1 to 1 of Every Month",
//     staff_type: "Monthly Regular",
//     salary_structure: "Regular PT",
//     opening_balance_type: "Advance",
//     opening_balance_value: "0",
//     select_shift: "Don't assign shift",
//     salary_details_access: true,
//     current_cycle_access: false
//   });

//   // 🚀 Step 2: Edu & Exp States
//   const [educations, setEducations] = useState([]);
//   const [experiences, setExperiences] = useState([]);
  
//   const [showEduModal, setShowEduModal] = useState(false);
//   const [eduEditingId, setEduEditingId] = useState(null);
//   const [eduForm, setEduForm] = useState({
//     institution_name: "", score_metric: "Percentage", score: "", start_year: "", end_year: "", education_id: 0, degree: ""
//   });

//   const emptyExperience = {
//     company_name: "", job_title: "", start_date: "", end_date: "", previous_ctc: "", location: "", description: "", industry_id: "", department_id: "", exp_letter_file: null,
//   };
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
//   const [draftExperiences, setDraftExperiences] = useState([]);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editForm, setEditForm] = useState({ ...emptyExperience });
//   const [editingExp, setEditingExp] = useState(null);

//   const [openDropdown, setOpenDropdown] = useState(null);

//   // 🚀 API Dropdown States
//   const [industries, setIndustries] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [educationMasters, setEducationMasters] = useState({ educations: [] });
//   const years = Array.from({ length: 61 }, (_, i) => (2030 - i).toString());

//   // 🚀 API Calls for Dropdowns
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const indRes = await fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100");
//         if (indRes.ok) {
//           const data = await indRes.json();
//           setIndustries(Array.isArray(data) ? data : data.data || []);
//         }
//         const deptRes = await fetch("https://apihrr.goelectronix.co.in/departments");
//         if (deptRes.ok) {
//           const data = await deptRes.json();
//           setDepartments(Array.isArray(data) ? data : data.data || []);
//         }
//         const eduRes = await fetch("https://apihrr.goelectronix.co.in/masters?types=educations&skip=0&limit=100");
//         if (eduRes.ok) {
//           const data = await eduRes.json();
//           setEducationMasters(data); 
//         }
//       } catch (error) {
//         console.error("Failed to fetch dropdowns", error);
//       }
//     };
//     fetchDropdowns();
//   }, []);

//   // 🚀 Pincode Logic
//   useEffect(() => {
//     const fetchAddress = async () => {
//       if (formData.pincode.length === 6 && !formData.district && !formData.state) {
//         setPincodeLoading(true);
//         try {
//           const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
//           const data = await res.json();
//           if (data[0].Status === "Success") {
//             const details = data[0].PostOffice[0];
//             setFormData(prev => ({ ...prev, state: details.State, district: details.District, country: details.Country }));
//             toast.success(`Node Identified: ${details.District}`);
//           } else {
//             toast.error("Invalid Pincode");
//           }
//         } catch (error) {
//           toast.error("Network Link Failure");
//         } finally {
//           setPincodeLoading(false);
//         }
//       }
//     };
//     fetchAddress();
//   }, [formData.pincode, formData.district, formData.state]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => {
//       const newData = { ...prev, [name]: type === "checkbox" ? checked : value };
//       if (name === "pincode" && value.length < 6) {
//         newData.district = "";
//         newData.state = "";
//       }
//       return newData;
//     });
//   };

//   const nextStep = (e) => {
//     e.preventDefault();
//     setCurrentStep(prev => prev + 1);
//     window.scrollTo(0, 0);
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => prev - 1);
//     window.scrollTo(0, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setTimeout(() => {
//       toast.success("Employee Registry Synchronized");
//       setIsSubmitting(false);
//       navigate("/managesalarytemplates");
//     }, 1500);
//   };

//   // 🚀 Handlers for Modals
//   const handleAddEdu = () => {
//     setEduEditingId(null);
//     setEduForm({ institution_name: "", score_metric: "Percentage", score: "", start_year: "", end_year: "", education_id: 0, degree: "" });
//     setShowEduModal(true);
//   };

//   const handleEditEdu = (edu) => {
//     setEduEditingId(edu.id);
//     setEduForm({ ...edu });
//     setShowEduModal(true);
//   };

//   const saveEducation = () => {
//     if (eduEditingId) {
//       setEducations(educations.map(e => e.id === eduEditingId ? { ...eduForm } : e));
//     } else {
//       setEducations([...educations, { ...eduForm, id: Date.now() }]);
//     }
//     setShowEduModal(false);
//     toast.success("Academic Node Appended");
//   };

//   const handleSaveExperience = () => {
//     const validDrafts = draftExperiences.filter(exp => exp.company_name);
//     setExperiences([...experiences, ...validDrafts.map(e => ({ ...e, id: Date.now() }))]);
//     setShowExperienceModal(false);
//     setDraftExperiences([]);
//     toast.success("Professional Node Appended");
//   };

//   const handleEditExperience = (exp) => {
//     setEditingExp(exp);
//     setEditForm({ ...exp });
//     setShowEditModal(true);
//   };

//   const handleUpdateExperience = () => {
//     setExperiences(experiences.map(e => e.id === editingExp.id ? { ...editForm, id: editingExp.id } : e));
//     setShowEditModal(false);
//     toast.success("Professional Node Updated");
//   };

//   const formatRegistryDate = (dateString) => {
//     if (!dateString) return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
//     return new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
//   };

//   const calculateDuration = (start, end) => {
//     if (!start) return "Current";
//     const startDate = new Date(start);
//     const endDate = end ? new Date(end) : new Date();
//     const diffTime = Math.abs(endDate - startDate);
//     const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
//     if (diffMonths >= 12) {
//       const yrs = Math.floor(diffMonths / 12);
//       const mos = diffMonths % 12;
//       return `${yrs} YR ${mos > 0 ? mos + " MO" : ""}`;
//     }
//     return `${diffMonths} MO`;
//   };

//   const departmentName = departments.find(d => d.id == formData.department_id)?.name || "Pending Assignment";

//   return (
//     <div className="min-h-screen bg-white text-left">
//       <Toaster position="top-right" />

//       {/* 🚀 ENTERPRISE HEADER */}
//       <div className="backdrop-blur-md border-b border-slate-100 px-6 mb-4 py-3 flex bg-transparent items-center gap-4 sticky top-0 z-[100]">
//         <button 
//           onClick={() => currentStep === 1 ? navigate(-1) : prevStep()} 
//           className="flex items-center gap-2 !text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="text-[11px] font-black capitalize tracking-widest leading-none">
//             {currentStep === 1 ? "Back to Page" : "Previous Step"}
//           </span>
//         </button>
//         <div className="h-4 w-[1px] bg-slate-200 mx-2" />
//         <div>
//           <h2 className="text-[12px] font-black !text-slate-900 !capitalize tracking-tighter leading-none">
//             Employee Onboarding
//           </h2>
//         </div>
//       </div>
      
//       <div className="max-w-7xl mx-auto p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm bg-white">
        
//         {/* 🚀 3-STEP PROGRESS TRACKER */}
//         <div className="flex items-center gap-4 mb-8 ml-2 overflow-x-auto">
//           <div className="flex items-center gap-3">
//             <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
//               {currentStep > 1 ? <Check size={12} strokeWidth={4} /> : "1"}
//             </div>
//             <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 1 ? "text-blue-600" : "text-slate-400"}`}>Basic Details</span>
//           </div>
//           <div className={`w-8 h-[2px] rounded-full shrink-0 ${currentStep >= 2 ? "bg-blue-600" : "bg-slate-100"}`} />
          
//           <div className="flex items-center gap-3">
//             <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
//               {currentStep > 2 ? <Check size={12} strokeWidth={4} /> : "2"}
//             </div>
//             <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 2 ? "text-blue-600" : "text-slate-400"}`}>Edu & Exp</span>
//           </div>
//           <div className={`w-8 h-[2px] rounded-full shrink-0 ${currentStep >= 3 ? "bg-blue-600" : "bg-slate-100"}`} />

//           {/* Step 3 */}
//           <div className="flex items-center gap-2">
//             <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-black ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
//               {currentStep > 3 ? <Check size={10} strokeWidth={4} /> : "3"}
//             </div>
//             <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep >= 3 ? "text-blue-600" : "text-slate-400"}`}>Salary</span>
//           </div>
//           <div className={`w-6 h-[2px] rounded-full shrink-0 ${currentStep >= 4 ? "bg-blue-600" : "bg-slate-100"}`} />

//           {/* Step 4 */}
//           <div className="flex items-center gap-2">
//             <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-black ${currentStep === 4 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>4</div>
//             <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep === 4 ? "text-blue-600" : "text-slate-400"}`}>Salary structure</span>
//           </div>
//         </div>

//         <form onSubmit={currentStep === 4 ? handleSubmit : nextStep} className="space-y-8">
          
//           {/* ================= STEP 1: BASIC DETAILS ================= */}
//           {currentStep === 1 && (
//             <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
//               <section className="space-y-4">
//                 <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                    <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100"><User size={14} /></div>
//                    <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Employee Details</h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <FormInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} icon={<User className={iconStyle}/>} required placeholder="John Doe" />
//                   <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail className={iconStyle}/>} required placeholder="john@enterprise.com" />
//                   <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} required placeholder="+91..." />
                  
//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Department</label>
//                     <div className="relative">
//                       <Building2 className={iconStyle} />
//                       <select name="department_id" value={formData.department_id} onChange={handleChange} className={inputStyle} required>
//                         <option value="">Select Domain</option>
//                         {departments.map((dept) => (
//                           <option key={dept.id} value={dept.id}>{dept.name}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <FormInput label="Organizational Role" name="role" value={formData.role} onChange={handleChange} icon={<Briefcase className={iconStyle}/>} required placeholder="Senior Lead" />

               
//                 </div>
//               </section>

//               <section className="space-y-4 pt-4">
//                 <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                    <div className="w-7 h-7 rounded-lg bg-white border border-blue-600 flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={14} /></div>
//                    <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Address Details</h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                  <div className="space-y-1 group">
//   <label className={labelStyle}>Pincode</label>

//   <div className="relative">
//     {pincodeLoading ? (
//       <Loader2 className={`absolute left-2 top-1/2 -translate-y-1/2 ${iconStyle} animate-spin text-blue-600`} />
//     ) : (
//       <Navigation className={`absolute left-2 top-1/2 -translate-y-1/2 ${iconStyle}`} />
//     )}

//     <input
//       name="pincode"
//       maxLength={6}
//       value={formData.pincode}
//       onChange={handleChange}
//       className={`${inputStyle} pl-8 tracking-[0.2em]`}  // 👈 important
//       required
//       placeholder="000000"
//     />
//   </div>
// </div>
//                   <FormInput label="District" name="district" value={formData.district} readOnly icon={<MapPin className={iconStyle}/>} placeholder="Generated" />
//                   <FormInput label="State" name="state" value={formData.state} readOnly icon={<Map className={iconStyle}/>} placeholder="Generated" />
//                   <FormInput label="Country" name="country" value={formData.country} readOnly icon={<Globe className={iconStyle}/>} />
//                 </div>
//               </section>

//               <section className="space-y-4 pt-4">
//                 <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-blue-600 text-blue-600 shadow-sm shadow-blue-100"><ShieldAlert size={14} /></div>
//                    <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Emergency Details</h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <FormInput label="Contact Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} icon={<User className={iconStyle}/>} placeholder="Next of Kin" />
//                   <FormInput label="Relation" name="emergency_contact_relation" value={formData.emergency_contact_relation} onChange={handleChange} icon={<Heart className={iconStyle}/>} placeholder="e.g. Spouse" />
//                   <FormInput label="Emergency Phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} placeholder="+91..." />
//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Blood Group</label>
//                     <div className="relative">
//                       <Droplets className={iconStyle} />
//                       <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputStyle}>
//                         <option value="">Select Group</option>
//                         {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             </div>
//           )}

//           {/* ================= STEP 2: EDUCATION & EXPERIENCE ================= */}
//           {currentStep === 2 && (
//             <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
              
//               {/* 🎓 EDUCATION SECTION */}
//               <section className="space-y-4">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
//                       <Landmark size={24} strokeWidth={2.5} />
//                     </div>
//                     <div>
//                       <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Academic Details</h2>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Education History</p>
//                     </div>
//                   </div>
//                   <button type="button" onClick={handleAddEdu} className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:!bg-white transition-all border-2 border-blue-600 active:scale-95 shadow-sm shadow-blue-100 cursor-pointer">
//                     <Plus size={14} strokeWidth={3} /> Add Education
//                   </button>
//                 </div>

//                 <div className="space-y-10 relative before:absolute before:inset-0 before:ml-20 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
//                   {educations.length > 0 ? (
//                     educations.map((edu, index) => (
//                       <div key={edu.id || index} className="relative flex items-start group">
//                         <div className="w-20 pt-1 shrink-0">
//                           <p className="text-xl font-black text-slate-900 leading-none">{edu.end_year || new Date().getFullYear()}</p>
//                           <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-1">Completion</p>
//                         </div>
//                         <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-600 z-10 mt-2 group-hover:scale-125 transition-transform" />
//                         <div className="flex-1 ml-10 bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
//                           <div className="flex justify-between items-start mb-6">
//                             <div>
//                               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{edu.institution_name}</h3>
//                               <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{edu.degree}</p>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
//                                 <CheckCircle2 size={12} /> {edu.score} {edu.score_metric === 'Percentage' ? '%' : 'CGPA'}
//                               </div>
//                               <button type="button" onClick={() => handleEditEdu(edu)} className="p-2 !bg-blue-50 !text-blue-600 border-2 border-blue-600 hover:!bg-white hover:!text-white rounded-lg transition-all cursor-pointer">
//                                 <Edit3 size={14} />
//                               </button>
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-50">
//                             <MiniField label="Degree" value={edu.degree} />
//                             <MiniField label="Duration" value={`${edu.start_year} - ${edu.end_year}`} />
//                             <MiniField label="Status" value="Verified" />
//                           </div>
//                           <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none rotate-12"><Landmark size={100} /></div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="ml-20 bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
//                       <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300"><Landmark size={40} /></div>
//                       <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Academic History Blank</p>
//                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">No educational nodes appended to this profile</p>
//                     </div>
//                   )}
//                 </div>
//               </section>

//               {/* 💼 EXPERIENCE SECTION */}
//               {!formData.is_fresher && (
//                 <section className="space-y-4 pt-4">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
//                         <History size={24} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Experience</h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional History</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => { setDraftExperiences([...draftExperiences, emptyExperience]); setShowExperienceModal(true); }} className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-white border-2 border-blue-600 transition-all active:scale-95 cursor-pointer">
//                       <Plus size={14} strokeWidth={3} /> Add Experience
//                     </button>
//                   </div>

//                   <div className="space-y-10 relative before:absolute before:inset-0 before:ml-20 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                    
//                     {/* CURRENT NODE */}
//                     <div className="relative flex items-start group">
//                       <div className="w-20 pt-1 shrink-0">
//                         <p className="text-xl font-black text-blue-600 leading-none">{new Date().getFullYear()}</p>
//                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Current Node</p>
//                       </div>
//                       <div className="absolute left-20 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white z-10 mt-1.5 shadow-sm" />
//                       <div className="flex-1 ml-10 bg-gradient-to-br from-blue-50/40 to-white border border-blue-100 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
//                         <div className="flex justify-between items-start mb-6">
//                           <div>
//                             <span className="px-2 py-0.5 rounded text-[8px] font-black bg-blue-600 text-white uppercase tracking-widest mb-2 inline-block">Active Deployment</span>
//                             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">GoElectronix Enterprise</h3>
//                             <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{formData.role || "Pending Assignment"}</p>
//                           </div>
//                           <div className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Active</div>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-blue-50">
//                           <MiniField label="Department" value={departmentName} />
//                           <MiniField label="Confirm Date" value="Pending" />
//                           <MiniField label="Status" value="Onboarding" isBold />
//                           <MiniField label="Location" value={formData.district || "Pending"} />
//                         </div>
//                       </div>
//                     </div>

//                     {/* PAST NODES */}
//                     {experiences.map((exp, index) => {
//                       const indName = industries.find(i => i.id == exp.industry_id)?.name || "General";
//                       const depName = departments.find(d => d.id == exp.department_id)?.name || "Operations";
//                       return (
//                         <div key={exp.id || index} className="relative flex items-start group">
//                           <div className="w-20 pt-1 shrink-0 opacity-60">
//                             <p className="text-xl font-black text-slate-400 leading-none">{exp.start_date ? new Date(exp.start_date).getFullYear() : "Past"}</p>
//                           </div>
//                           <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white z-10 mt-2" />
//                           <div className="flex-1 ml-10 bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
//                             <div className="flex justify-between items-start mb-6">
//                               <div>
//                                 <h3 className="text-md font-black text-slate-800 uppercase">{exp.company_name}</h3>
//                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.job_title}</p>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <div className="px-2 py-1 bg-slate-50 text-slate-500 rounded-md text-[9px] font-black border border-slate-100 flex items-center gap-1">
//                                   <Clock size={10} /> {calculateDuration(exp.start_date, exp.end_date)}
//                                 </div>
//                                 <button type="button" onClick={() => handleEditExperience(exp)} className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer">
//                                   <Edit3 size={14} />
//                                 </button>
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-50">
//                               <MiniField label="Previous CTC" value={exp.previous_ctc ? `₹${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "—"} isBold />
//                               <MiniField label="Industry" value={indName} />
//                               <MiniField label="Department" value={depName} />
//                               <MiniField label="Location" value={exp.location} />
//                             </div>
//                             <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none rotate-12"><Briefcase size={80} /></div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </section>
//               )}
//             </div>
//           )}

//           {/* ================= STEP 3: SALARY DETAILS ================= */}
//           {currentStep === 3 && (
//             <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
//               <section className="space-y-6">
//                 <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                   <div className="w-7 h-7 rounded-lg border border-emerald-500 bg-white flex items-center justify-center text-emerald-500"><Wallet size={14} /></div>
//                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Salary & Shift Details</h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <FormInput label="Staff ID" name="staff_id" value={formData.staff_id} readOnly icon={<Landmark className={iconStyle}/>} />
                  
//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Attendance Settings</label>
//                     <div className="relative">
//                       <Calendar className={iconStyle} />
//                       <select name="attendance_template" value={formData.attendance_template} onChange={handleChange} className={inputStyle}>
//                         <option value="">Select template</option>
//                         <option value="1">Standard Shift (9-6)</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Salary Cycle</label>
//                     <div className="relative">
//                       <Zap className={iconStyle} />
//                       <select name="salary_cycle" value={formData.salary_cycle} onChange={handleChange} className={inputStyle}>
//                         <option>1 to 1 of Every Month</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Salary Structure Template</label>
//                     <div className="relative">
//                       <Building2 className={iconStyle} />
//                       <select name="salary_structure" value={formData.salary_structure} onChange={handleChange} className={inputStyle}>
//                         <option>Regular PT</option>
//                         <option>Hourly Contract</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Opening Balance</label>
//                     <div className="flex gap-2">
//                        <select name="opening_balance_type" value={formData.opening_balance_type} onChange={handleChange} className={`${inputStyle} !pl-3 w-2/5`}>
//                          <option>Advance</option>
//                          <option>Pending</option>
//                        </select>
//                     </div>
//                   </div>
//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Balance Amount</label>
//                     <div className="flex gap-2">
//                        <div className="relative flex-1">
//                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
//                           <input name="opening_balance_value" type="number" value={formData.opening_balance_value} onChange={handleChange} className={`${inputStyle} !pl-3 w-sm`} />
//                        </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACCESS LOGIC SWITCHES */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                   <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30 transition-all hover:bg-white">
//                     <div>
//                       <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Salary Details Access</p>
//                       <p className="text-[9px] text-slate-400">Allow staff member to view full salary calculations</p>
//                     </div>
//                     <button type="button" className=' !bg-transparent cursor-pointer outline-none border-0' onClick={() => setFormData(p => ({...p, salary_details_access: !p.salary_details_access}))}>
//                       {formData.salary_details_access ? <ToggleRight size={28} className="!text-blue-600" /> : <ToggleLeft size={28} className="!text-slate-300" />}
//                     </button>
//                   </div>
//                   <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30 transition-all hover:bg-white">
//                     <div>
//                       <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Allow Current Cycle Salary Access</p>
//                       <p className="text-[9px] text-slate-400">Allow viewing current cycle salary accumulation</p>
//                     </div>
//                     <button type="button" className=' !bg-transparent cursor-pointer outline-none border-0' onClick={() => setFormData(p => ({...p, current_cycle_access: !p.current_cycle_access}))}>
//                       {formData.current_cycle_access ? <ToggleRight size={28} className="text-blue-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
//                     </button>
//                   </div>
//                 </div>
//               </section>
//             </div>
//           )}


//           {/* ================= STEP 2: EDUCATION & EXPERIENCE ================= */}
//           {currentStep === 4 && (
//            <></>
//           )}

//           {/* ACTION DOCK */}
//           <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
//             <button type="button" onClick={() => currentStep === 1 ? navigate(-1) : prevStep()} className="px-6 py-2.5 !text-slate-500 !bg-transparent font-black text-[10px] uppercase border !border-slate-300 rounded-xl hover:!bg-slate-50 transition-all cursor-pointer">
//               {currentStep === 1 ? "Cancel" : "Previous"}
//             </button>
//             <button type="submit" disabled={isSubmitting || pincodeLoading} className="flex items-center gap-2 !bg-white hover:!bg-slate-50 disabled:!bg-white !text-blue-600 font-black border border-blue-600 text-[10px] uppercase tracking-[0.1em] px-10 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-100 active:scale-95 cursor-pointer">
//               {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {currentStep === 4 ? "Finalize Onboarding" : `Proceed to Step ${currentStep + 1}`}</>}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* 🛡️ MODALS: EDUCATION & EXPERIENCE (Placed outside the main content) */}
      
//       {/* ADD/EDIT EDUCATION MODAL */}
//       {showEduModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-3">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEduModal(false)} />
//           <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
//             <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
//               <div className="flex items-center gap-2">
//                 <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                 <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase">Academic Details</h2>
//               </div>
//               <button type="button" onClick={() => setShowEduModal(false)} className="p-1.5 !bg-transparent rounded-lg hover:!bg-slate-100 !text-slate-400 hover:!text-slate-600 transition-colors border-0 cursor-pointer">
//                 <XCircle size={16} strokeWidth={2.5} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
//               <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <div className="flex flex-col gap-1 relative group">
//                     <label className={labelStyle}>Degree Type</label>
//                     <div className="relative">
//                       <select value={eduForm.degree || ""} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className={inputStyle}>
//                         <option value="">Select Qualification</option>
//                         {educationMasters?.educations?.length > 0 ? (
//                           educationMasters.educations.map((edu) => <option key={edu.id} value={edu.name}>{edu.name}</option>)
//                         ) : (<option disabled>Loading registry...</option>)}
//                       </select>
//                       <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                     </div>
//                   </div>
//                   <FormInput label="Institution Name" value={eduForm.institution_name} onChange={(e) => setEduForm({...eduForm, institution_name: e.target.value})} placeholder="e.g. Mumbai University" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex flex-col gap-1 relative group">
//                     <label className={labelStyle}>Start Year</label>
//                     <div className="relative">
//                       <select value={eduForm.start_year || ""} onChange={(e) => setEduForm({ ...eduForm, start_year: e.target.value })} className={inputStyle}>
//                         <option value="">YYYY</option>
//                         {years.map((year) => <option key={year} value={year}>{year}</option>)}
//                       </select>
//                       <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-1 relative group">
//                     <label className={labelStyle}>End Year</label>
//                     <div className="relative">
//                       <select value={eduForm.end_year || ""} onChange={(e) => setEduForm({ ...eduForm, end_year: e.target.value })} className={inputStyle}>
//                         <option value="">YYYY</option>
//                         {years.map((year) => <option key={year} value={year}>{year}</option>)}
//                       </select>
//                       <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3 pt-2">
//                   <div className="flex items-center justify-between">
//                     <label className={labelStyle}>Academic Performance</label>
//                     <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
//                       {["Percentage", "CGPA"].map((metric) => (
//                         <button key={metric} type="button" onClick={() => setEduForm(prev => ({ ...prev, score_metric: metric, score: "" }))} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border-0 outline-none cursor-pointer ${eduForm.score_metric === metric ? "!bg-white !text-blue-600 shadow-sm border !border-slate-200" : "!text-slate-400 !bg-transparent"}`}>
//                           {metric}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="relative group">
//                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-black text-[10px]">
//                       {eduForm.score_metric === "Percentage" ? "%" : "★"}
//                     </div>
//                     <input type="text" className={`${inputStyle} h-12 !pl-8`} placeholder={eduForm.score_metric === "Percentage" ? "Enter Percentage" : "Enter CGPA"} value={eduForm.score} onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="px-5 py-3 border-t border-slate-100 bg-white flex justify-end gap-2 sticky bottom-0 z-20">
//               <button type="button" onClick={saveEducation} className="px-6 py-1.5 !bg-white !text-blue-600 border-2 !border-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-50 shadow-sm active:scale-95 cursor-pointer">
//                 <Save size={12} strokeWidth={2.5} /> Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ADD EXPERIENCE MODAL */}
//       {showExperienceModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowExperienceModal(false)} />
//           <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
//             <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 !bg-white !text-blue-600 rounded-xl shadow-sm shadow-blue-200"><Briefcase size={20} strokeWidth={2.5} /></div>
//                 <div>
//                   <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Professional Experience</h2>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Add Employment Node</p>
//                 </div>
//               </div>
//               <button type="button" onClick={() => setShowExperienceModal(false)} className="p-2 !bg-transparent hover:!bg-slate-100 rounded-full !text-slate-400 transition-colors border-0 cursor-pointer">
//                 <XCircle size={24} strokeWidth={2} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30 custom-scrollbar">
//               {draftExperiences.map((exp, index) => (
//                 <div key={index} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative">
//                   <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
//                     <span className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">Entry Node #{index + 1}</span>
//                     {draftExperiences.length > 1 && (
//                       <button type="button" onClick={() => setDraftExperiences(draftExperiences.filter((_, i) => i !== index))} className="text-[10px] !bg-transparent font-black !text-blue-600 uppercase flex items-center gap-1 border-0 cursor-pointer">
//                         <Trash2 size={14} /> Remove
//                       </button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                     <FormInput label="Company Name" value={exp.company_name} onChange={(e) => { const u=[...draftExperiences]; u[index].company_name=e.target.value; setDraftExperiences(u); }} placeholder="e.g. Google" />
                    
//                     <div className="space-y-1 group">
//                       <label className={labelStyle}>Industry</label>
//                       <div className="relative">
//                         <select value={exp.industry_id || ""} onChange={(e) => { const u=[...draftExperiences]; u[index].industry_id=e.target.value; setDraftExperiences(u); }} className={inputStyle}>
//                           <option value="">Select Industry</option>
//                           {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
//                         </select>
//                         <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                       </div>
//                     </div>

//                     <div className="space-y-1 group">
//                       <label className={labelStyle}>Department</label>
//                       <div className="relative">
//                         <select value={exp.department_id || ""} onChange={(e) => { const u=[...draftExperiences]; u[index].department_id=e.target.value; setDraftExperiences(u); }} className={inputStyle}>
//                           <option value="">Select Department</option>
//                           {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//                         </select>
//                         <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                       </div>
//                     </div>

//                     <FormInput label="Position" value={exp.job_title} onChange={(e) => { const u=[...draftExperiences]; u[index].job_title=e.target.value; setDraftExperiences(u); }} placeholder="e.g. Engineer" />
//                     <FormInput label="Start Date" type="date" value={exp.start_date} onChange={(e) => { const u=[...draftExperiences]; u[index].start_date=e.target.value; setDraftExperiences(u); }} />
//                     <FormInput label="End Date" type="date" value={exp.end_date} onChange={(e) => { const u=[...draftExperiences]; u[index].end_date=e.target.value; setDraftExperiences(u); }} />
                    
//                     <div className="space-y-1 group">
//                       <label className={labelStyle}>Previous CTC</label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
//                         <input type="number" className={`${inputStyle} !pl-8`} value={exp.previous_ctc} onChange={(e) => { const u=[...draftExperiences]; u[index].previous_ctc=e.target.value; setDraftExperiences(u); }} placeholder="0.00" />
//                       </div>
//                     </div>

//                     <FormInput label="Location" value={exp.location} onChange={(e) => { const u=[...draftExperiences]; u[index].location=e.target.value; setDraftExperiences(u); }} placeholder="e.g. Mumbai" />
                    
//                     <div className="md:col-span-2 space-y-1">
//                       <label className={labelStyle}>Description</label>
//                       <textarea rows={3} className={`${inputStyle} resize-none rounded-xl`} value={exp.description} onChange={(e) => { const u=[...draftExperiences]; u[index].description=e.target.value; setDraftExperiences(u); }} placeholder="Key responsibilities..." />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button type="button" onClick={() => setDraftExperiences([...draftExperiences, emptyExperience])} className="w-full py-4 border-2 border-dashed !border-slate-200 rounded-2xl !text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:!bg-white hover:!border-blue-400 hover:!text-blue-600 !bg-transparent transition-all flex items-center justify-center gap-2 cursor-pointer outline-none">
//                 <PlusCircle size={18} /> Add Another Record
//               </button>
//             </div>
//             <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 z-20">
//               <button type="button" onClick={handleSaveExperience} className="flex items-center border !border-blue-600 gap-2 !bg-transparent hover:!bg-white !text-blue-600 font-black px-10 py-3 rounded-xl shadow-sm shadow-blue-600/20 transition-all active:scale-95 text-[11px] uppercase tracking-[0.15em] cursor-pointer">
//                 <Save size={16} /> Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT EXPERIENCE MODAL */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowEditModal(false)} />
//           <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Experience</h2>
//                 <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.15em] mt-0.5">System Record : {editForm.company_name}</p>
//               </div>
//               <button type="button" onClick={() => setShowEditModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all border-0 !bg-transparent cursor-pointer">
//                 <XCircle size={22} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
//                 <FormInput label="Company Name" value={editForm.company_name} onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} />
//                 <FormInput label="Job Title" value={editForm.job_title} onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })} />
//                 <FormInput label="Start Date" type="date" value={editForm.start_date} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} />
//                 <FormInput label="End Date" type="date" value={editForm.end_date} onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} />
//                 <div className="space-y-1 group">
//                   <label className={labelStyle}>Previous CTC</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
//                     <input type="number" className={`${inputStyle} !pl-8`} value={editForm.previous_ctc} onChange={(e) => setEditForm({ ...editForm, previous_ctc: e.target.value })} placeholder="0.00" />
//                   </div>
//                 </div>
//                 <FormInput label="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
//                 <div className="md:col-span-2 space-y-1">
//                   <label className={labelStyle}>Description</label>
//                   <textarea rows={3} className={`${inputStyle} resize-none`} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
//                 </div>
//               </div>
//             </div>
//             <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0">
//               <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 !bg-white border !border-blue-600 text-sm font-bold !text-slate-600 rounded-xl transition-all cursor-pointer">Cancel</button>
//               <button type="button" onClick={handleUpdateExperience} className="flex items-center gap-2 px-8 !border-blue-600 py-2.5 !bg-white !text-blue-600 text-sm font-bold rounded-xl border transition-all active:scale-[0.98] cursor-pointer">
//                 <Save size={18} /> Update Record
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// // 🚀 ENTERPRISE SHARED STYLES
// const labelStyle = "block text-[9px] font-black text-slate-400 capitalize tracking-[0.1em] mb-1.5 ml-1";
// const inputStyle = "w-full pl-3 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-[12px] font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-200 shadow-sm appearance-none";
// const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors pointer-events-none";

// const FormInput = ({ label, icon, ...props }) => (
//   <div className="space-y-1 group">
//     <label className={labelStyle}>{label}</label>
//     <div className="relative">
//       {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">{icon}</div>}
//       <input {...props} className={` ml-2 ${inputStyle} ${icon ? '!pl-9' : ''} ${props.readOnly ? 'cursor-default bg-slate-50/50' : ''}`} />
//     </div>
//   </div>
// );

// const MiniField = ({ label, value, isBold }) => (
//   <div className="space-y-1">
//     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
//     <p className={`text-[10px] uppercase tracking-tight ${isBold ? "font-black text-slate-900" : "font-bold text-slate-600"}`}>
//       {value || "Not Specified"}
//     </p>
//   </div>
// );

// export default NewEmployee;
//********************************************************************************************************* */
// import React, { useState, useEffect } from 'react'
// import { 
//   User, Mail, Phone, Briefcase, Building2, Save, ArrowLeft,
//   MapPin, Globe, Map, Navigation, Loader2, ShieldAlert, 
//   Heart, Droplets, Zap, Calendar, Wallet, Landmark, ToggleLeft, ToggleRight
// } from "lucide-react";
// import { Toaster, toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const NewEmployee = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     // --- STEP 1: IDENTITY & REGIONAL ---
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     is_fresher: false,
//     pincode: "",
//     district: "",
//     state: "",
//     country: "India",
//     emergency_contact_name: "",
//     emergency_contact_relation: "",
//     emergency_contact_phone: "",
//     blood_group: "",

//     // --- STEP 2: SALARY & SYSTEM (From image_6f02c0.png) ---
//     staff_id: `MUMGE${Math.floor(100 + Math.random() * 900)}`,
//     attendance_template: "",
//     salary_cycle: "1 to 1 of Every Month",
//     staff_type: "Monthly Regular",
//     salary_structure: "Regular PT",
//     opening_balance_type: "Advance",
//     opening_balance_value: "0",
//     select_shift: "Don't assign shift",
//     salary_details_access: true,
//     current_cycle_access: false
//   });

//   // 🚀 Pincode Logic
//   // useEffect(() => {
//   //   const fetchAddress = async () => {
//   //     if (formData.pincode.length === 6) {
//   //       setPincodeLoading(true);
//   //       try {
//   //         const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
//   //         const data = await res.json();
//   //         if (data[0].Status === "Success") {
//   //           const details = data[0].PostOffice[0];
//   //           setFormData(prev => ({ ...prev, state: details.State, district: details.District , country: details.Country  }));
//   //           toast.success(`Node Identified: ${details.District}`);
//   //         }
//   //       } catch (error) {
//   //         toast.error("Network Link Failure");
//   //       } finally {
//   //         setPincodeLoading(false);
//   //       }
//   //     }
//   //   };
//   //   fetchAddress();
//   // }, [formData.pincode]);
//   // 🚀 Optimized Pincode Logic
// useEffect(() => {
//   const fetchAddress = async () => {
//     // Only call API if pincode is 6 digits AND we don't already have the location data
//     if (formData.pincode.length === 6 && !formData.district && !formData.state) {
//       setPincodeLoading(true);
//       try {
//         const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
//         const data = await res.json();
        
//         if (data[0].Status === "Success") {
//           const details = data[0].PostOffice[0];
//           setFormData(prev => ({ 
//             ...prev, 
//             state: details.State, 
//             district: details.District, 
//             country: details.Country  
//           }));
//           toast.success(`Pincode is: ${formData.pincode}`);
//         } else {
//           toast.error("Invalid Pincode");
//         }
//       } catch (error) {
//         toast.error("Network Link Failure");
//       } finally {
//         setPincodeLoading(false);
//       }
//     }
//   };

//   fetchAddress();
// }, [formData.pincode, formData.district, formData.state]); // Added dependencies for safety

//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target;
//   //   setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//   // };


//   const handleChange = (e) => {
//   const { name, value, type, checked } = e.target;
  
//   setFormData(prev => {
//     const newData = { ...prev, [name]: type === "checkbox" ? checked : value };
    
//     // 💡 Reset location fields if the user starts typing a new pincode
//     if (name === "pincode" && value.length < 6) {
//       newData.district = "";
//       newData.state = "";
//     }
    
//     return newData;
//   });
// };

//   const nextStep = (e) => {
//     e.preventDefault();
//     setCurrentStep(2);
//     window.scrollTo(0, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     // API execution logic goes here
//     setTimeout(() => {
//       toast.success("Employee Registry Synchronized");
//       setIsSubmitting(false);
//       navigate("/managesalarytemplates");
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-white text-left">
//       <Toaster position="top-right" />

//       {/* 🚀 ENTERPRISE HEADER */}
//       <div className="backdrop-blur-md border-b border-slate-100 px-6 py-3 flex bg-white/80 items-center gap-4 sticky top-0 z-[100]">
//         <button onClick={() => currentStep === 1 ? navigate(-1) : setCurrentStep(1)} className="flex items-center gap-2 !text-slate-400 hover:text-blue-600  transition-all group border-0 !bg-transparent cursor-pointer outline-none">
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="text-[11px] font-black capitalize tracking-widest leading-none">Back</span>
//         </button>
//         <div className="h-4 w-[1px] bg-slate-200 mx-2" />
//         <h2 className="text-[12px] font-black !text-slate-900 capitalize tracking-tighter leading-none">
//           {currentStep === 1 ? "Basic Details" : "Salary Configuration"}
//         </h2>
//       </div>

//       <div className=" mx-auto p-4 md:p-6">
//         {/* PROGRESS TRACKER */}
//         <div className="flex items-center gap-6 mb-8 ml-2">
//           <div className="flex items-center gap-3">
//             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 1 ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"}`}>
//               {currentStep === 1 ? "1" : <User size={12} fill="currentColor" />}
//             </div>
//             <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === 1 ? "text-blue-600" : "text-slate-400"}`}>Basic Details</span>
//           </div>
//           <div className="w-10 h-[1px] bg-slate-100" />
//           <div className="flex items-center gap-3">
//             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>2</div>
//             <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === 2 ? "text-blue-600" : "text-slate-400"}`}>Salary & Shift Details</span>
//           </div>
//         </div>

//         <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm">
//           <form onSubmit={currentStep === 1 ? nextStep : handleSubmit} className="space-y-10">
            
//             {currentStep === 1 ? (
//               <>
//                 {/* IDENTITY SECTION */}
//                 <section className="space-y-4">
//                   <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                     <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600"><User size={14} /></div>
//                     <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Employee Details</h3>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <FormInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} icon={<User className={iconStyle}/>} required />
//                     <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail className={iconStyle}/>} required />
//                     <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} required />
//                     <FormInput label="Department" name="department" value={formData.role} onChange={handleChange} icon={<Briefcase className={iconStyle}/>} required />
//                     <FormInput label="Role" name="role" value={formData.role} onChange={handleChange} icon={<Briefcase className={iconStyle}/>} required />
//                   </div>
//                 </section>

//                 {/* REGIONAL SECTION */}
//                 <section className="space-y-4 pt-4">
//                   <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                     <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600"><MapPin size={14} /></div>
//                     <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Address Details</h3>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="space-y-1 group">
//                       <label className={labelStyle}>Pincode</label>
//                       <div className="relative">
//                         {pincodeLoading ? <Loader2 className={`${iconStyle} animate-spin text-blue-600`} /> : <Navigation className={iconStyle} />}
//                         <input name="pincode" maxLength={6} value={formData.pincode} onChange={handleChange} className={`${inputStyle} tracking-[0.2em]`} required placeholder="000000" />
//                       </div>
//                     </div>
//                     <FormInput label="District" name="district" value={formData.district} readOnly icon={<MapPin className={iconStyle}/>} />
//                     <FormInput label="State" name="state" value={formData.state} readOnly icon={<Map className={iconStyle}/>} />
//                     <FormInput label="Country" name="country" value={formData.country} readOnly icon={<Globe className={iconStyle}/>} />
//                   </div>
//                 </section>

//                 {/* EMERGENCY SECTION */}
//                 <section className="space-y-4 pt-4">
//                   <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                     <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600"><ShieldAlert size={14} /></div>
//                     <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Emergency Details</h3>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <FormInput label="Emergency Person Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} icon={<User className={iconStyle}/>} />
//                     <FormInput label="Relation" name="emergency_contact_relation" value={formData.emergency_contact_relation} onChange={handleChange} icon={<Heart className={iconStyle}/>} />
//                     <FormInput label="Emergency Person Phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} />
//                     <div className="space-y-1 group">
//                       <label className={labelStyle}>Blood Group</label>
//                       <div className="relative">
//                         <Droplets className={iconStyle} />
//                         <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputStyle}>
//                           <option value="">Select Group</option>
//                           {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </section>
//               </>
//             ) : (
//               /* --- STEP 2: SALARY DETAILS --- */
//               <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
//                 <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                   <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600"><Wallet size={14} /></div>
//                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Salary & Shift Details</h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <FormInput label="Staff ID" name="staff_id" value={formData.staff_id} readOnly icon={<Landmark className={iconStyle}/>} />
                  
//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Attendance Settings</label>
//                     <div className="relative">
//                       <Calendar className={iconStyle} />
//                       <select name="attendance_template" value={formData.attendance_template} onChange={handleChange} className={inputStyle}>
//                         <option value="">Select template</option>
//                         <option value="1">Standard Shift (9-6)</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Salary Cycle</label>
//                     <div className="relative">
//                       <Zap className={iconStyle} />
//                       <select name="salary_cycle" value={formData.salary_cycle} onChange={handleChange} className={inputStyle}>
//                         <option>1 to 1 of Every Month</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Salary Structure Template</label>
//                     <div className="relative">
//                       <Building2 className={iconStyle} />
//                       <select name="salary_structure" value={formData.salary_structure} onChange={handleChange} className={inputStyle}>
//                         <option>Regular PT</option>
//                         <option>Hourly Contract</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Opening Balance</label>
//                     <div className="flex gap-2">
//                        <select name="opening_balance_type" value={formData.opening_balance_type} onChange={handleChange} className={`${inputStyle} !pl-3 w-2/5`}>
//                          <option>Advance</option>
//                          <option>Pending</option>
//                        </select>
                      
//                     </div>
//                   </div>
//                   <div className="space-y-1 group">
//                     <label className={labelStyle}>Balance Amount</label>
//                     <div className="flex gap-2">
                      
//                        <div className="relative flex-1">
//                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
//                           <input name="opening_balance_value" type="number" value={formData.opening_balance_value} onChange={handleChange} className={`${inputStyle} !pl-3 w-sm`} />
//                        </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACCESS LOGIC SWITCHES */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                   <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30 transition-all hover:bg-white">
//                     <div>
//                       <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Salary Details Access</p>
//                       <p className="text-[9px] text-slate-400">Allow staff member to view full salary calculations</p>
//                     </div>
//                     <button type="button" className=' !bg-transparent' onClick={() => setFormData(p => ({...p, salary_details_access: !p.salary_details_access}))}>
//                       {formData.salary_details_access ? <ToggleRight size={28} className="!text-blue-600" /> : <ToggleLeft size={28} className="!text-slate-300" />}
//                     </button>
//                   </div>
//                   <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30 transition-all hover:bg-white">
//                     <div>
//                       <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Allow Current Cycle Salary Access</p>
//                       <p className="text-[9px] text-slate-400">Allow viewing current cycle salary accumulation</p>
//                     </div>
//                     <button type="button" className=' !bg-transparent' onClick={() => setFormData(p => ({...p, current_cycle_access: !p.current_cycle_access}))}>
//                       {formData.current_cycle_access ? <ToggleRight size={28} className="text-blue-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
//                     </button>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* ACTION DOCK */}
//             <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
//               <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 !text-slate-500 !bg-transparent font-black text-[10px] uppercase border !border-slate-500 rounded-xl hover:!bg-slate-50 transition-all">Cancel</button>
//               <button type="submit" disabled={isSubmitting || pincodeLoading} className="flex items-center gap-2 !bg-white hover:!bg-white disabled:!bg-white !text-blue-600 font-black border border-blue-600 text-[10px] uppercase tracking-[0.1em] px-10 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-100 active:scale-95">
//                 {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {currentStep === 1 ? "Execute Phase 1" : "Finalize Onboarding"}</>}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// // 🚀 ENTERPRISE SHARED STYLES
// const labelStyle = "block text-[9px] font-black text-slate-400 capitalize tracking-[0.1em] mb-1.5 ml-1";
// const inputStyle = "w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-[12px] font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-200 shadow-sm appearance-none";
// const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors pointer-events-none";

// const FormInput = ({ label, icon, ...props }) => (
//   <div className="space-y-1 group">
//     <label className={labelStyle}>{label}</label>
//     <div className="relative">
//       {icon}
//       <input {...props} className={`${inputStyle} ${props.readOnly ? 'cursor-default bg-slate-50/50' : ''}`} />
//     </div>
//   </div>
// );

// export default NewEmployee;
//*****************************************working code phase 1 25/03/26******************************************************* */
// import React, { useState, useEffect } from 'react'
// import { 
//   User, Mail, Phone, Briefcase, Building2, Save,  ArrowLeft,
//   MapPin, Globe, Map, Navigation, Loader2, ShieldAlert, 
//   Heart, Droplets, Zap 
// } from "lucide-react";
// import { Toaster, toast } from "react-hot-toast";

// const NewEmployee = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     is_fresher: false,
//     pincode: "",
//     district: "",
//     state: "",
//     country: "India",
//     emergency_contact_name: "",
//     emergency_contact_relation: "",
//     emergency_contact_phone: "",
//     blood_group: "",
//   });

//   useEffect(() => {
//     const fetchAddress = async () => {
//       if (formData.pincode.length === 6) {
//         setPincodeLoading(true);
//         try {
//           const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
//           const data = await res.json();
//           if (data[0].Status === "Success") {
//             const details = data[0].PostOffice[0];
//             setFormData((prev) => ({
//               ...prev,
//               state: details.State,
//               district: details.District,
//             }));
//             toast.success(`Location identified: ${details.District}`);
//           } else {
//             toast.error("Invalid Pincode provided");
//           }
//         } catch (error) {
//           toast.error("Pincode service unreachable");
//         } finally {
//           setPincodeLoading(false);
//         }
//       }
//     };
//     fetchAddress();
//   }, [formData.pincode]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setTimeout(() => {
//       toast.success("Employee Registry Synchronized");
//       setIsSubmitting(false);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-white p-4 md:p-6 text-left">
//       <Toaster position="top-right" />

//       {/* 🚀 STICKY ENTERPRISE HEADER */}
//     <div className=" backdrop-blur-md border-b border-slate-100 px-1 mb-4 py-3 flex bg-transparent items-center gap-4 sticky top-0 z-[100]">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 !text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
//       >
//         <ArrowLeft
//           size={18}
//           className="group-hover:-translate-x-1 transition-transform"
//         />
//         <span className="text-[11px] font-black capitalize tracking-widest leading-none">
//           Back to Page
//         </span>
//       </button>
      
//       <div className="h-4 w-[1px] bg-slate-200 mx-2" /> {/* Vertical Divider */}
      
//       <div>
//         <h2 className="text-[12px] font-black !text-slate-900 !capitalize tracking-tighter leading-none">
//           Employee Onboarding
//         </h2>
//       </div>
//     </div>
      
//       {/* Reduced padding from p-12 to p-6/p-8 */}
//       <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
//         {/* Tightened space-y-16 to space-y-8 */}
//         <form onSubmit={handleSubmit} className="space-y-8">
          
//           {/* 🆔 MODULE 1: PRIMARY IDENTITY */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                <div className="w-7 h-7 rounded-lg border border-blue-600 bg-white flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
//                   <User size={14} />
//                </div>
//                <div>
//                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Basic Details</h3>
//                </div>
//             </div>
//             {/* Reduced gap from 6 to 4 */}
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               <FormInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} icon={<User className={iconStyle}/>} required placeholder="John Doe" />
//               <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail className={iconStyle}/>} required placeholder="john@enterprise.com" />
//               <FormInput label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} required placeholder="+91..." />
              
//               <div className="space-y-1 group">
//                 <label className={labelStyle}>Department</label>
//                 <div className="relative">
//                   <Building2 className={iconStyle} />
//                   <select name="department_id" value={formData.department_id} onChange={handleChange} className={inputStyle} required>
//                     <option value="">Select Domain</option>
//                     <option value="1">Engineering</option>
//                     <option value="2">Human Resources</option>
//                   </select>
//                 </div>
//               </div>

//               <FormInput label="Organizational Role" name="role" value={formData.role} onChange={handleChange} icon={<Briefcase className={iconStyle}/>} required placeholder="Senior Lead" />

//               <div className="space-y-1">
//                 <label className={labelStyle}>Experience</label>
//                 {/* Reduced height from 46px to 42px */}
//                 <div className="flex items-center h-[42px]">
//                   <label className={`relative flex items-center justify-between w-full h-full px-3 rounded-xl border transition-all cursor-pointer shadow-sm ${formData.is_fresher ? "bg-amber-50/50 border-amber-200" : "bg-white border-slate-200 hover:border-slate-300"}`}>
//                     <input type="checkbox" name="is_fresher" checked={formData.is_fresher} onChange={handleChange} className="hidden" />
//                     <div className="flex items-center gap-2">
//                       <div className={`p-1 rounded-md transition-colors ${formData.is_fresher ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"}`}>
//                         <Zap size={12} fill={formData.is_fresher ? "currentColor" : "none"} />
//                       </div>
//                       <span className={`text-[10px] font-black capitalize tracking-widest ${formData.is_fresher ? "text-amber-700" : "text-slate-500"}`}>Fresher</span>
//                     </div>
//                     <div className={`w-7 h-3.5 rounded-full relative transition-colors ${formData.is_fresher ? "bg-emerald-500" : "bg-slate-200"}`}>
//                       <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${formData.is_fresher ? "left-4" : "left-0.5"}`} />
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 📍 MODULE 2: REGIONAL REGISTRY */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                <div className="w-7 h-7 rounded-lg bg-white border border-blue-600 flex items-center justify-center text-blue-600 shadow-sm">
//                   <MapPin size={14} />
//                </div>
//                <div>
//                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Address Details</h3>
//                </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="space-y-1 group">
//                 <label className={labelStyle}>Pincode</label>
//                 <div className="relative">
//                   {pincodeLoading ? <Loader2 className={`${iconStyle} animate-spin text-blue-600`} /> : <Navigation className={iconStyle} />}
//                   <input name="pincode" maxLength={6} value={formData.pincode} onChange={handleChange} className={`${inputStyle} tracking-[0.1em]`} required placeholder="000000" />
//                 </div>
//               </div>
//               <FormInput label="District" name="district" value={formData.district} readOnly icon={<MapPin className={iconStyle}/>} placeholder="Generated" />
//               <FormInput label="State" name="state" value={formData.state} readOnly icon={<Map className={iconStyle}/>} placeholder="Generated" />
//               <FormInput label="Country" name="country" value={formData.country} readOnly icon={<Globe className={iconStyle}/>} />
//             </div>
//           </section>

//           {/* 🚑 MODULE 3: CONTINGENCY PROTOCOL */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
//                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-blue-600 text-blue-600 shadow-sm shadow-blue-100">
//                   <ShieldAlert size={14} />
//                </div>
//                <div>
//                   <h3 className="text-xs font-black text-slate-900 capitalize tracking-widest">Emergency Details</h3>
//                </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <FormInput label="Contact Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} icon={<User className={iconStyle}/>} placeholder="Next of Kin" />
//               <FormInput label="Relation" name="emergency_contact_relation" value={formData.emergency_contact_relation} onChange={handleChange} icon={<Heart className={iconStyle}/>} placeholder="e.g. Spouse" />
//               <FormInput label="Emergency Phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} placeholder="+91..." />
              
//               <div className="space-y-1 group">
//                 <label className={labelStyle}>Blood Group</label>
//                 <div className="relative">
//                   <Droplets className={iconStyle} />
//                   <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputStyle}>
//                     <option value="">Select</option>
//                     {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* SUBMISSION ACTION */}
//           <div className="flex justify-end pt-4 border-t border-slate-100">
//             <button
//               type="submit"
//               disabled={isSubmitting || pincodeLoading}
//               className="group flex items-center gap-2 bg-white hover:bg-white disabled:bg-slate-200 text-blue-600 font-black text-[10px] capitalize tracking-[0.15em] px-8 py-3 rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-100"
//             >
//               {isSubmitting ? (
//                 <><Loader2 className="animate-spin" size={16} /> Deploying...</>
//               ) : (
//                 <><Save size={16} /> Next</>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // 🚀 MINIMIZED STYLES
// const labelStyle = "block text-[9px] font-black text-slate-400 capitalize tracking-[0.1em] mb-1.5 ml-1";
// const inputStyle = "w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-[12px] font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-300 shadow-sm";
// const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within:text-blue-600 transition-colors";

// const FormInput = ({ label, icon, ...props }) => {
//   return (
//     <div className="space-y-1 group">
//       <label className={labelStyle}>{label}</label>
//       <div className="relative">
//         {icon}
//         <input {...props} className={`${inputStyle} ${props.readOnly ? 'cursor-default bg-slate-50/50' : ''}`} />
//       </div>
//     </div>
//   );
// };

// export default NewEmployee;