import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  IndianRupee, 
  FileText,
  GraduationCap,
  Activity ,
  ChevronRight,
  Zap,
  X,
  ChevronLeft, 
  ChevronDown,
  ShieldCheck,
  Layers,
  Loader2,
  Building2,
  Phone,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";

const VacancyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Add this near your other useState declarations
const [activeAccordion, setActiveAccordion] = useState("description");
  const [vacancy, setVacancy] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [company, setCompany] = useState(null); // New state for Company data
  const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
  const [activeMetricTab, setActiveMetricTab] = useState(null); // 'responses', 'leads', 'database'
const [metricData, setMetricData] = useState([]);
const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        // STAGE 1: Fetch Vacancy Metadata
        const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
        if (!vacRes.ok) throw new Error("Vacancy node not found");
        const vacData = await vacRes.json();
        setVacancy(vacData);

        // STAGE 2: Fetch Job Description Template
        if (vacData.job_description) {
        const id = vacData?.job_description?.id || null;   // or "" or 0
          const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${id}`);
          const jdData = await jdRes.json();
          setJobDescription(jdData);
        }

        // STAGE 3: Fetch Company details based on ID in vacancy response
        // if (vacData.company?.id) {
        //     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
        //     const compData = await compRes.json();
        //     setCompany(compData);
        // }
        if (vacData.company?.id) {
    const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
    const compListData = await compRes.json();
    
    // Match the company from the list with the vacancy's company ID
    const matchedCompany = compListData.find(c => c.id === vacData.company.id);
    
    if (matchedCompany) {
        setCompany(matchedCompany);
    }
}

      } catch (err) {
        toast.error(err.message);
        navigate("/vacancies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id, navigate]);

  useEffect(() => {
  const fetchAllDetails = async () => {
    setLoading(true);
    try {
      // Existing Vacancy Fetch
      const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
      if (!vacRes.ok) throw new Error("Vacancy node not found");
      const vacData = await vacRes.json();
      setVacancy(vacData);

      // --- NEW: FETCH METRICS ---
      const [resResp, resLeads, resDb] = await Promise.all([
        fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent`),
        fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
        fetch(`https://apihrr.goelectronix.co.in/candidates`)
      ]);
      
      const [dataResp, dataLeads, dataDb] = await Promise.all([
        resResp.json(), resLeads.json(), resDb.json()
      ]);

      setMetrics({
        responses: dataResp.length || 0,
        leads: dataLeads.length || 0,
        database: dataDb.length || 0
      });

      // (Keep your existing JD and Company fetch logic here...)
      if (vacData.job_description) {
         const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
         const jdData = await jdRes.json();
         setJobDescription(jdData);
      }

      if (vacData.company?.id) {
        const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
        const compListData = await compRes.json();
        const matchedCompany = compListData.find(c => c.id === vacData.company.id);
        if (matchedCompany) setCompany(matchedCompany);
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchAllDetails();
}, [id]);


const handleTabClick = async (tabType) => {
  // Toggle off if clicking the same tab
  if (activeMetricTab === tabType) {
    setActiveMetricTab(null);
    return;
  }

  setActiveMetricTab(tabType);
  setLoadingMetrics(true);
  
  try {
    let url = "";
    if (tabType === 'responses') url = `https://apihrr.goelectronix.co.in/candidates?status=jd_sent`;
    else if (tabType === 'leads') url = `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`;
    else url = `https://apihrr.goelectronix.co.in/candidates`;

    const res = await fetch(url);
    const data = await res.json();
    setMetricData(data);
  } catch (err) {
    toast.error("Failed to sync registry data");
  } finally {
    setLoadingMetrics(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fetching Vacancy Details....</p>
      </div>
    );
  }

  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
  const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

// const MetricTab = ({ icon: Icon, label, count, isActive, onClick, colorClass, iconBg }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-2 rounded-[1.5rem] transition-all duration-300 border-2 ${
//       isActive
//         ? "!bg-white !border-blue-600 shadow-lg !shadow-blue-100/50 scale-[1.02] z-10"
//         : "!bg-white !border-slate-100 !text-slate-400 hover:!border-blue-200 hover:!text-blue-600"
//     }`}
//   >
//     <div className="flex items-center gap-4 ml-2">
//       {/* Branding Box for Icon */}
//       <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
//         isActive ? "!bg-blue-50 !text-blue-600" : "!bg-slate-50 !text-slate-400"
//       }`}>
//         <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
//       </div>

//       <div className="flex flex-col items-start text-left">
//         <span className={`text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 ${
//           isActive ? "!text-blue-600/60" : "!text-slate-400"
//         }`}>
//           {label}
//         </span>
//         <div className="flex items-center gap-2">
//           <span className={`text-xl font-black leading-none ${
//             isActive ? '!text-blue-600' : '!text-slate-600'
//           }`}>
//             {count.toString().padStart(2, '0')}
//           </span>
//           {isActive && (
//             <div className="flex gap-1">
//               <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
//               <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Interaction Arrow */}
//     <div className={`mr-2 p-2 rounded-lg transition-all ${
//       isActive ? 'bg-blue-50 text-blue-600' : 'opacity-0'
//     }`}>
//        <ChevronRight size={16} strokeWidth={3} />
//     </div>
//   </button>
// );


const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg }) => (
  <button
    onClick={onClick}
    className="flex-1 flex !bg-transparent items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 !border-slate-200 hover:!border-blue-600 hover:shadow-lg hover:shadow-blue-100 bg-white group active:scale-[0.98]"
  >
    <div className="flex items-center gap-4">
      {/* Icon Branding Box */}
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
        <Icon size={22} className={colorClass} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col items-start text-left">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black leading-none !text-slate-900 group-hover:!text-blue-600 transition-colors">
            {count.toString().padStart(2, '0')}
          </span>
          <div className="h-1.5 w-1.5 rounded-full !bg-slate-200 group-hover:!bg-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
    <div className="p-2 rounded-lg !bg-slate-50 !text-slate-300 group-hover:!bg-blue-50 group-hover:!text-blue-600 transition-all">
       <ChevronRight size={18} strokeWidth={3} />
    </div>
  </button>
);



  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] !bg-transparent font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
       {/* --- ENTERPRISE REGISTRY NAVIGATOR --- */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. COMPANY & JOB HEADER */}
            {/* <section className="space-y-6 p-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <span className={labelClass}>Hiring Organization</span>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{company?.name || vacancy?.company?.name}</h2>
                  </div>
               </div>

               <div>
                 <span className={labelClass}>Job Title</span>
                 <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                   {vacancy?.title}
                 </h1>
               </div>
              
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-50"><Briefcase size={20} /></div>
                  <div>
                    <span className={labelClass}>Job Type</span>
                    <p className={valueClass}>{vacancy?.job_type || "Permanent"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-50"><Clock size={20} /></div>
                  <div>
                    <span className={labelClass}>Experience</span>
                    <p className={valueClass}>{vacancy?.min_experience} - {vacancy?.max_experience} Years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-50"><IndianRupee size={20} /></div>
                  <div>
                    <span className={labelClass}>Package</span>
                    <p className={valueClass}>{vacancy?.min_salary.toLocaleString()} - {vacancy?.max_salary.toLocaleString()} LPA</p>
                  </div>
                </div>
              </div>

            </section> */}  


            
            {/* <section className="relative overflow-hidden p-8 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_50px_rgba(37,99,235,0.04)]">
 
  <ShieldCheck 
    className="absolute -right-8 -bottom-8 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" 
    size={200} 
  />

  <div className="relative z-10 space-y-8">

    <div className="flex items-center gap-5">
      <div className="relative">
        <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm transition-transform duration-500 hover:scale-105">
          <Building2 size={28} strokeWidth={2.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
      </div>
      
      <div className="flex flex-col justify-center">
        <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.2em] leading-none mb-2">
          Hiring Organization
        </span>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-[#2563eb] transition-colors">
          {company?.name || vacancy?.company?.name}
        </h2>
      </div>
    </div>

 
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-8 bg-[#2563eb] rounded-full" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
          Position 
        </span>
      </div>
      <h1 className="text-3xl px-2 font-black text-slate-900 tracking-tighter leading-none uppercase drop-shadow-sm">
        {vacancy?.title}
      </h1>
    </div>

 
    <div className="flex flex-wrap items-center gap-4 pt-4">
    
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-all hover:bg-white hover:border-blue-200 group/item">
        <div className="h-10 w-10 bg-white text-slate-400 group-hover/item:text-[#2563eb] group-hover/item:shadow-md rounded-xl flex items-center justify-center border border-slate-100 transition-all">
          <Briefcase size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
            Job Type
          </span>
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
            {vacancy?.job_type || "Permanent"}
          </p>
        </div>
      </div>

  
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-all hover:bg-white hover:border-blue-200 group/item">
        <div className="h-10 w-10 bg-white text-slate-400 group-hover/item:text-[#2563eb] group-hover/item:shadow-md rounded-xl flex items-center justify-center border border-slate-100 transition-all">
          <Clock size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
            Experience
          </span>
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
            {vacancy?.min_experience} - {vacancy?.max_experience} Years
          </p>
        </div>
      </div>

     
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-all hover:bg-white hover:border-blue-200 group/item">
        <div className="h-10 w-10 bg-white text-slate-400 group-hover/item:text-[#2563eb] group-hover/item:shadow-md rounded-xl flex items-center justify-center border border-slate-100 transition-all">
          <IndianRupee size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
            Annual Package
          </span>
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
            {vacancy?.min_salary.toLocaleString()} - {vacancy?.max_salary.toLocaleString()} LPA
          </p>
        </div>
      </div>
    </div>
  </div>
</section> */}


<section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
  {/* Security Watermark */}
  <ShieldCheck 
    className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
    size={320} 
  />

  <div className="relative z-10 flex flex-col gap-10">
    {/* TOP ROW: Organization & Title */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] border border-blue-100 shadow-sm">
            <Building2 size={32} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] leading-none mb-2">
              Hiring Organization
            </span>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {company?.name || vacancy?.company?.name}
            </h2>
          </div>
        </div>
        
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
            {vacancy?.title}
          </h1>
        </div>
      </div>

      {/* QUICK STATUS CHIP */}
      {/* <div className="flex flex-col items-end gap-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Status</span>
        <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 shadow-inner">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
            {vacancy?.status || "Active"}
          </span>
        </div>
      </div> */}
    </div>

    {/* MIDDLE ROW: The Big 3 Tabs */}
    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <MetricTab 
        icon={Users} 
        label="Responses" 
        count={metrics.responses} 
        iconBg="bg-blue-50"
        colorClass="text-blue-600"
        onClick={() => navigate(`/candidatefilter?status=jd_sent`)}
      />
      <MetricTab 
        icon={Zap} 
        label="Hot Leads" 
        count={metrics.leads} 
        iconBg="bg-orange-50"
        colorClass="text-orange-500"
        onClick={() => navigate(`/candidatefilter?vacancy_id=${id}`)}
      />
      <MetricTab 
        icon={ShieldCheck} 
        label="Candidate" 
        count={metrics.database} 
        iconBg="bg-slate-50"
        colorClass="text-slate-600"
        onClick={() => navigate(`/candidatefilter`)}
      />
    </div> */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  <MetricTab 
    icon={Users} 
    label="Responses" 
    count={metrics.responses} 
    isActive={activeMetricTab === 'responses'}
    iconBg="bg-blue-50"
    colorClass="text-blue-600"
    onClick={() => handleTabClick('responses')}
  />
  <MetricTab 
    icon={Zap} 
    label="Hot Leads" 
    count={metrics.leads} 
    isActive={activeMetricTab === 'leads'}
    iconBg="bg-orange-50"
    colorClass="text-orange-500"
    onClick={() => handleTabClick('leads')}
  />
  <MetricTab 
    icon={ShieldCheck} 
    label="Candidate" 
    count={metrics.database} 
    isActive={activeMetricTab === 'database'}
    iconBg="bg-slate-50"
    colorClass="text-slate-600"
    onClick={() => handleTabClick('database')}
  />
</div>

    {/* BOTTOM ROW: Core Protocol Summary */}
    <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
      {[
        { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
        { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
        { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
        { icon: <MapPin size={14}/>, label: "Base", value: vacancy?.location[0] }
      ].map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
          <div className="text-blue-600">{item.icon}</div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

            {/* 2. RICH TEXT CONTENT SECTIONS */}
            {/* <div className="space-y-12 pb-10">
              <section className="space-y-4 p-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Description</h3>
                </div>
                <div 
                  className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
                  dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
                />
              </section>

              <section className="space-y-4 p-5">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Responsibilities</h4>
                <div 
                  className="prose prose-slate text-slate-600 font-medium [overflow-wrap:anywhere] leading-relaxed custom-html-view"
                  dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
                />
              </section>

              <section className="space-y-4 p-5">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Prerequisite</h4>
                <div 
                  className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
                  dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
                />
              </section>
            </div> */}
         {/* <div className="space-y-4 pb-10">
  
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${
    activeAccordion === "description" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"
  }`}>
    <button 
      onClick={() => setActiveAccordion(activeAccordion === "description" ? null : "description")}
      className="w-full px-8 py-7 flex !bg-transparent items-center justify-between transition-all"
    >
      <div className="flex items-center gap-5">
       
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
          activeAccordion === "description" 
            ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" 
            : "!bg-slate-50 !border-slate-100 !text-slate-400"
        }`}>
          <FileText size={24} strokeWidth={2.5} />
        </div>
        
      
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase !bg-transparent tracking-[0.3em] leading-none mb-1.5 transition-colors ${
            activeAccordion === "description" ? "!text-white/60" : "!text-slate-400"
          }`}>
            Section 01
          </span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${
            activeAccordion === "description" ? "!text-white" : "!text-slate-900"
          }`}>
            Job Description
          </h3>
        </div>
      </div>

      <div className={`p-2 rounded-full transition-all duration-500 ${
        activeAccordion === "description" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"
      }`}>
        <ChevronDown size={20} strokeWidth={3} />
      </div>
    </button>
    
  
    {activeAccordion === "description" && (
      <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
        <div className="h-[1px] w-full !bg-slate-50 mb-8" />
        <div 
          className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
          dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
        />
      </div>
    )}
  </div>

  
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${
    activeAccordion === "responsibilities" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"
  }`}>
    <button 
      onClick={() => setActiveAccordion(activeAccordion === "responsibilities" ? null : "responsibilities")}
      className="w-full px-8 py-7 flex items-center  !bg-transparent justify-between transition-all"
    >
      <div className="flex items-center gap-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
          activeAccordion === "responsibilities" 
            ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" 
            : "!bg-slate-50 !border-slate-100 !text-slate-400"
        }`}>
          <Zap size={24} strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] !bg-transparent leading-none mb-1.5 transition-colors ${
            activeAccordion === "responsibilities" ? "!text-white/60" : "!text-slate-400"
          }`}>
            Section 02
          </span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${
            activeAccordion === "responsibilities" ? "!text-white" : "!text-slate-900"
          }`}>
            Responsibilities
          </h3>
        </div>
      </div>

      <div className={`p-2 rounded-full transition-all duration-500 ${
        activeAccordion === "responsibilities" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"
      }`}>
        <ChevronDown size={20} strokeWidth={3} />
      </div>
    </button>

    {activeAccordion === "responsibilities" && (
      <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
        <div className="h-[1px] w-full !bg-slate-50 mb-8" />
        <div 
          className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
          dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
        />
      </div>
    )}
  </div>

 
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${
    activeAccordion === "prerequisite" ? "bg-[#2563eb] border-[#2563eb]" : "bg-white border-slate-100"
  }`}>
    <button 
      onClick={() => setActiveAccordion(activeAccordion === "prerequisite" ? null : "prerequisite")}
      className="w-full px-8 py-7 flex items-center  !bg-transparent justify-between transition-all"
    >
      <div className="flex items-center gap-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
          activeAccordion === "prerequisite" 
            ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" 
            : "!bg-slate-50 !border-slate-100 !text-slate-400"
        }`}>
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${
            activeAccordion === "prerequisite" ? "!text-white/60" : "!text-slate-400"
          }`}>
            Section 03
          </span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${
            activeAccordion === "prerequisite" ? "!text-white" : "!text-slate-900"
          }`}>
            Eligibility
          </h3>
        </div>
      </div>

      <div className={`p-2 rounded-full transition-all duration-500 ${
        activeAccordion === "prerequisite" ? "bg-white text-[#2563eb] rotate-180 shadow-lg" : "bg-slate-50 text-slate-300"
      }`}>
        <ChevronDown size={20} strokeWidth={3} />
      </div>
    </button>

    {activeAccordion === "prerequisite" && (
      <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 bg-white mx-1.5 mb-1.5 rounded-[2rem]">
        <div className="h-[1px] w-full bg-slate-50 mb-8" />
        <div 
          className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
          dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
        />
      </div>
    )}
  </div>
</div> */}


{/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
{/* {activeMetricTab && (
  <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
    <div className="bg-white rounded-[2.5rem] border-2 border-blue-600 p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Activity size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {activeMetricTab} Registry Results
          </h3>
        </div>
        <button 
          onClick={() => setActiveMetricTab(null)}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      {loadingMetrics ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Processing Registry Query...</p>
        </div>
      ) : metricData.length > 0 ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {metricData.map((cand) => (
            <div key={cand.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-300 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[12px] font-black text-blue-600 border border-slate-200 uppercase">
                  {(cand.full_name || cand.name || "U").charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">{cand.full_name || cand.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Briefcase size={10} /> {cand.total_experience_years || cand.experience || 0} Years
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <MapPin size={10} /> {cand.city || "Remote"}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/profile/${cand.id}`)}
                className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-xl group-hover:border-blue-600 group-hover:text-blue-600 transition-all shadow-sm"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center text-center">
          <ShieldCheck size={48} className="text-slate-200 mb-4" />
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">No matching records in registry</p>
        </div>
      )}
    </div>
  </div>
)} */}


{/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
{activeMetricTab && (
  <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
    <div className="bg-white rounded-[3rem] border-2 border-blue-600 p-8 shadow-2xl relative overflow-hidden">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
            <Activity size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
            {activeMetricTab} Registry Results
          </h3>
        </div>
        <button onClick={() => setActiveMetricTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
      </div>

      {loadingMetrics ? (
        <div className="py-32 flex flex-col items-center justify-center animate-pulse">
          <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
        </div>
      ) : (
        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
          {metricData.map((c) => (
            /* --- EXACT CANDIDATE CARD DESIGN START --- */
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Security Watermark Anchor */}
              <ShieldCheck
                className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
                size={150}
              />

              <div className="relative z-10 space-y-6">
                {/* TOP SECTION: IDENTITY */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
                      {(c.full_name || "U").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
                        {c.full_name?.toLowerCase()}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {c.age || "?? "} • {c.gender || "Not Specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MIDDLE SECTION: CORE METADATA STRIP */}
                <div className="space-y-4 pl-1">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
                    {/* EXPERIENCE NODE */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
                        <Briefcase size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Experience</span>
                        <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.experienceDisplay}</span>
                      </div>
                    </div>

                    {/* LOCATION NODE */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
                        <MapPin size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
                        <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.city || "Not Specified"}</span>
                      </div>
                    </div>

                    {/* SALARY NODE */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
                        <span className="text-[16px] font-black leading-none">₹</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
                        <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                          {c.latestCTC ? `${(c.latestCTC / 100000).toFixed(2)} LPA` : "Not Specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={15} className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic truncate max-w-[200px]">
                      {c.highestDegree}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => navigate(`/profile/${c.id}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                    >
                      <FileText size={14} /> View Registry
                    </button>
                  </div>
                </div>
              </div>
            </div>
            /* --- EXACT CANDIDATE CARD DESIGN END --- */
          ))}
        </div>
      )}
    </div>
  </div>
)}


<div className="space-y-4 pb-10">
  {/* 1. JOB DESCRIPTION ACCORDION (Existing) */}
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "description" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
    <button onClick={() => setActiveAccordion(activeAccordion === "description" ? null : "description")} className="w-full px-8 py-7 flex !bg-transparent items-center justify-between transition-all">
      <div className="flex items-center gap-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "description" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
          <FileText size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase !bg-transparent tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "description" ? "!text-white/60" : "!text-slate-400"}`}>Section 01</span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "description" ? "!text-white" : "!text-slate-900"}`}>Job Description</h3>
        </div>
      </div>
      <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "description" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
    </button>
    {activeAccordion === "description" && (
      <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
        <div className="h-[1px] w-full !bg-slate-50 mb-8" />
        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }} />
      </div>
    )}
  </div>

  {/* 2. RESPONSIBILITIES ACCORDION (Existing) */}
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "responsibilities" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
    <button onClick={() => setActiveAccordion(activeAccordion === "responsibilities" ? null : "responsibilities")} className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all">
      <div className="flex items-center gap-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
          <Zap size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] !bg-transparent leading-none mb-1.5 transition-colors ${activeAccordion === "responsibilities" ? "!text-white/60" : "!text-slate-400"}`}>Section 02</span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "responsibilities" ? "!text-white" : "!text-slate-900"}`}>Responsibilities</h3>
        </div>
      </div>
      <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
    </button>
    {activeAccordion === "responsibilities" && (
      <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
        <div className="h-[1px] w-full !bg-slate-50 mb-8" />
        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }} />
      </div>
    )}
  </div>

  {/* 3. ELIGIBILITY ACCORDION (Existing) */}
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "prerequisite" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
    <button onClick={() => setActiveAccordion(activeAccordion === "prerequisite" ? null : "prerequisite")} className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all">
      <div className="flex items-center gap-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "prerequisite" ? "!text-white/60" : "!text-slate-400"}`}>Section 03</span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "prerequisite" ? "!text-white" : "!text-slate-900"}`}>Eligibility</h3>
        </div>
      </div>
      <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
    </button>
    {activeAccordion === "prerequisite" && (
      <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 bg-white mx-1.5 mb-1.5 rounded-[2rem]">
        <div className="h-[1px] w-full bg-slate-50 mb-8" />
        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }} />
      </div>
    )}
  </div>

  {/* 4. NEW: REGISTRY DATA ACCORDION (Added for Degrees, Languages, Assets, Certs) */}
  <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "registry" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
    <button onClick={() => setActiveAccordion(activeAccordion === "registry" ? null : "registry")} className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all">
      <div className="flex items-center gap-5">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
          <Layers size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col text-left">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "registry" ? "!text-white/60" : "!text-slate-400"}`}>Section 04</span>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "registry" ? "!text-white" : "!text-slate-900"}`}>Addtional Information</h3>
        </div>
      </div>
      <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
    </button>
    {activeAccordion === "registry" && (
      <div className="px-8 pb-10 pt-6 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem] space-y-8">
        <div className="h-[1px] w-full !bg-slate-50" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Degrees */}
          <div className="space-y-2">
            <span className={labelClass}>Degree</span>
            <div className="flex flex-wrap gap-2">
              {vacancy?.degrees?.map(d => (
                <span key={d.id} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100">{d.name}</span>
              )) || <p className="text-xs text-slate-400">Standard Degree applies</p>}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <span className={labelClass}>Languages</span>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{vacancy?.spoken_languages?.join(" • ") || "English / Hindi"}</p>
          </div>

          {/* Assets */}
          <div className="space-y-2">
            <span className={labelClass}>Assets</span>
            <div className="flex flex-wrap gap-2">
              {vacancy?.assets_req?.map(asset => (
                <span key={asset} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase border border-slate-100">{asset}</span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <span className={labelClass}>Professional Certifications</span>
            <div className="flex flex-wrap gap-2">
              {vacancy?.certificates_req?.map(cert => (
                <span key={cert} className="px-3 py-1 bg-[#2563eb] text-white rounded-lg text-[9px] font-black uppercase shadow-sm">{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
           
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={20}/></div>
                  <div>
                    <span className={labelClass}>Location</span>
                    <p className={valueClass}>{vacancy?.location[0]}</p>
                  </div>
                </div>

                {/* SHOWING COMPANY CONTACT FROM NEW API */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Phone size={20}/></div>
                  <div>
                    <span className={labelClass}>Contact Registry</span>
                    <p className={valueClass}>{company?.contact_number || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><UserCheck size={20}/></div>
                  <div>
                    <span className={labelClass}>Contact Person</span>
                    <p className={valueClass}>{company?.contact_person || "-"}</p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Layers size={20}/></div>
                  <div>
                    <span className={labelClass}>Status</span>
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
                      {vacancy?.status}
                    </div>
                  </div>
                </div> */}

                {/* --- STATUS PROTOCOL NODE --- */}
<div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
    <Layers size={20} />
  </div>
  <div>
    <span className={labelClass}>Status</span>
    <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1 ${
      vacancy?.status === 'open' ? 'text-emerald-500' : 
      vacancy?.status === 'closed' ? 'text-red-500' : 
      'text-orange-400'
    }`}>
      {/* Dynamic Status Indicator (The Pulse Dot) */}
      <div className={`h-2 w-2 rounded-full animate-pulse ${
        vacancy?.status === 'open' ? 'bg-emerald-500' : 
        vacancy?.status === 'closed' ? 'bg-red-500' : 
        'bg-orange-400'
      }`} /> 
      
      {vacancy?.status ? vacancy.status.replace('_', ' ') : 'N/A'}
    </div>
  </div>
</div>
              </div>

              <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
                 <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Application Deadline</p>
                 <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
              </div>

              <button className="w-full bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all active:scale-95">
                Apply for this job
              </button>
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-html-view p { margin-bottom: 1rem; }
        .custom-html-view ul, .custom-html-view ol { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
        .custom-html-view li { margin-bottom: 0.5rem; }
        .custom-html-view strong { color: #0F172A; font-weight: 800; }
      `}} />
    </div>
  );
}

export default VacancyDetails;
//*********************************************working code phase 12 27/02/26************************************************************* */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   FileText,
//   Zap,
//   ChevronLeft, 
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   // Add this near your other useState declarations
// const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null); // New state for Company data

//   useEffect(() => {
//     const fetchAllDetails = async () => {
//       setLoading(true);
//       try {
//         // STAGE 1: Fetch Vacancy Metadata
//         const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//         if (!vacRes.ok) throw new Error("Vacancy node not found");
//         const vacData = await vacRes.json();
//         setVacancy(vacData);

//         // STAGE 2: Fetch Job Description Template
//         if (vacData.job_description) {
//         const id = vacData?.job_description?.id || null;   // or "" or 0
//           const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${id}`);
//           const jdData = await jdRes.json();
//           setJobDescription(jdData);
//         }

//         // STAGE 3: Fetch Company details based on ID in vacancy response
//         // if (vacData.company?.id) {
//         //     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//         //     const compData = await compRes.json();
//         //     setCompany(compData);
//         // }
//         if (vacData.company?.id) {
//     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//     const compListData = await compRes.json();
    
//     // Match the company from the list with the vacancy's company ID
//     const matchedCompany = compListData.find(c => c.id === vacData.company.id);
    
//     if (matchedCompany) {
//         setCompany(matchedCompany);
//     }
// }

//       } catch (err) {
//         toast.error(err.message);
//         navigate("/vacancies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllDetails();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fetching Vacancy Details....</p>
//       </div>
//     );
//   }

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-[10px] !bg-transparent font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group"
//           >
//             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
            
//             {/* 1. COMPANY & JOB HEADER */}
//             {/* <section className="space-y-6 p-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
//                <div className="flex items-center gap-4 mb-4">
//                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
//                     <Building2 size={24} />
//                   </div>
//                   <div>
//                     <span className={labelClass}>Hiring Organization</span>
//                     <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{company?.name || vacancy?.company?.name}</h2>
//                   </div>
//                </div>

//                <div>
//                  <span className={labelClass}>Job Title</span>
//                  <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">
//                    {vacancy?.title}
//                  </h1>
//                </div>
              
//               <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 pb-5">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-50"><Briefcase size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Job Type</span>
//                     <p className={valueClass}>{vacancy?.job_type || "Permanent"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-50"><Clock size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Experience</span>
//                     <p className={valueClass}>{vacancy?.min_experience} - {vacancy?.max_experience} Years</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-50"><IndianRupee size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Package</span>
//                     <p className={valueClass}>{vacancy?.min_salary.toLocaleString()} - {vacancy?.max_salary.toLocaleString()} LPA</p>
//                   </div>
//                 </div>
//               </div>

//             </section> */}
//             <section className="relative overflow-hidden p-8 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_50px_rgba(37,99,235,0.04)]">
//   {/* Security Watermark Icon */}
//   <ShieldCheck 
//     className="absolute -right-8 -bottom-8 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" 
//     size={200} 
//   />

//   <div className="relative z-10 space-y-8">
//     {/* 1. ORGANIZATION IDENTITY NODE */}
//     <div className="flex items-center gap-5">
//       <div className="relative">
//         <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm transition-transform duration-500 hover:scale-105">
//           <Building2 size={28} strokeWidth={2.5} />
//         </div>
//         <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
//       </div>
      
//       <div className="flex flex-col justify-center">
//         <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.2em] leading-none mb-2">
//           Hiring Organization
//         </span>
//         <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-[#2563eb] transition-colors">
//           {company?.name || vacancy?.company?.name}
//         </h2>
//       </div>
//     </div>

//     {/* 2. JOB TITLE REGISTRY */}
//     <div className="space-y-3">
//       <div className="flex items-center gap-3">
//         <div className="h-[2px] w-8 bg-[#2563eb] rounded-full" />
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
//           Position 
//         </span>
//       </div>
//       <h1 className="text-3xl px-2 font-black text-slate-900 tracking-tighter leading-none uppercase drop-shadow-sm">
//         {vacancy?.title}
//       </h1>
//     </div>

//     {/* 3. HORIZONTAL INFO STRIP */}
//     <div className="flex flex-wrap items-center gap-4 pt-4">
//       {/* JOB TYPE NODE */}
//       <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-all hover:bg-white hover:border-blue-200 group/item">
//         <div className="h-10 w-10 bg-white text-slate-400 group-hover/item:text-[#2563eb] group-hover/item:shadow-md rounded-xl flex items-center justify-center border border-slate-100 transition-all">
//           <Briefcase size={20} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col">
//           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
//             Job Type
//           </span>
//           <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
//             {vacancy?.job_type || "Permanent"}
//           </p>
//         </div>
//       </div>

//       {/* EXPERIENCE NODE */}
//       <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-all hover:bg-white hover:border-blue-200 group/item">
//         <div className="h-10 w-10 bg-white text-slate-400 group-hover/item:text-[#2563eb] group-hover/item:shadow-md rounded-xl flex items-center justify-center border border-slate-100 transition-all">
//           <Clock size={20} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col">
//           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
//             Experience
//           </span>
//           <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
//             {vacancy?.min_experience} - {vacancy?.max_experience} Years
//           </p>
//         </div>
//       </div>

//       {/* SALARY NODE */}
//       <div className="flex items-center gap-4 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm transition-all hover:bg-white hover:border-blue-200 group/item">
//         <div className="h-10 w-10 bg-white text-slate-400 group-hover/item:text-[#2563eb] group-hover/item:shadow-md rounded-xl flex items-center justify-center border border-slate-100 transition-all">
//           <IndianRupee size={20} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col">
//           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
//             Annual Package
//           </span>
//           <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
//             {vacancy?.min_salary.toLocaleString()} - {vacancy?.max_salary.toLocaleString()} LPA
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>

//             {/* 2. RICH TEXT CONTENT SECTIONS */}
//             {/* <div className="space-y-12 pb-10">
//               <section className="space-y-4 p-5">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Description</h3>
//                 </div>
//                 <div 
//                   className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
//                 />
//               </section>

//               <section className="space-y-4 p-5">
//                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Responsibilities</h4>
//                 <div 
//                   className="prose prose-slate text-slate-600 font-medium [overflow-wrap:anywhere] leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
//                 />
//               </section>

//               <section className="space-y-4 p-5">
//                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Prerequisite</h4>
//                 <div 
//                   className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
//                 />
//               </section>
//             </div> */}
//          {/* <div className="space-y-4 pb-10">
  
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${
//     activeAccordion === "description" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"
//   }`}>
//     <button 
//       onClick={() => setActiveAccordion(activeAccordion === "description" ? null : "description")}
//       className="w-full px-8 py-7 flex !bg-transparent items-center justify-between transition-all"
//     >
//       <div className="flex items-center gap-5">
       
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
//           activeAccordion === "description" 
//             ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" 
//             : "!bg-slate-50 !border-slate-100 !text-slate-400"
//         }`}>
//           <FileText size={24} strokeWidth={2.5} />
//         </div>
        
      
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase !bg-transparent tracking-[0.3em] leading-none mb-1.5 transition-colors ${
//             activeAccordion === "description" ? "!text-white/60" : "!text-slate-400"
//           }`}>
//             Section 01
//           </span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${
//             activeAccordion === "description" ? "!text-white" : "!text-slate-900"
//           }`}>
//             Job Description
//           </h3>
//         </div>
//       </div>

//       <div className={`p-2 rounded-full transition-all duration-500 ${
//         activeAccordion === "description" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"
//       }`}>
//         <ChevronDown size={20} strokeWidth={3} />
//       </div>
//     </button>
    
  
//     {activeAccordion === "description" && (
//       <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//         <div className="h-[1px] w-full !bg-slate-50 mb-8" />
//         <div 
//           className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
//           dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
//         />
//       </div>
//     )}
//   </div>

  
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${
//     activeAccordion === "responsibilities" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"
//   }`}>
//     <button 
//       onClick={() => setActiveAccordion(activeAccordion === "responsibilities" ? null : "responsibilities")}
//       className="w-full px-8 py-7 flex items-center  !bg-transparent justify-between transition-all"
//     >
//       <div className="flex items-center gap-5">
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
//           activeAccordion === "responsibilities" 
//             ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" 
//             : "!bg-slate-50 !border-slate-100 !text-slate-400"
//         }`}>
//           <Zap size={24} strokeWidth={2.5} />
//         </div>
        
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase tracking-[0.3em] !bg-transparent leading-none mb-1.5 transition-colors ${
//             activeAccordion === "responsibilities" ? "!text-white/60" : "!text-slate-400"
//           }`}>
//             Section 02
//           </span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${
//             activeAccordion === "responsibilities" ? "!text-white" : "!text-slate-900"
//           }`}>
//             Responsibilities
//           </h3>
//         </div>
//       </div>

//       <div className={`p-2 rounded-full transition-all duration-500 ${
//         activeAccordion === "responsibilities" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"
//       }`}>
//         <ChevronDown size={20} strokeWidth={3} />
//       </div>
//     </button>

//     {activeAccordion === "responsibilities" && (
//       <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//         <div className="h-[1px] w-full !bg-slate-50 mb-8" />
//         <div 
//           className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
//           dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
//         />
//       </div>
//     )}
//   </div>

 
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${
//     activeAccordion === "prerequisite" ? "bg-[#2563eb] border-[#2563eb]" : "bg-white border-slate-100"
//   }`}>
//     <button 
//       onClick={() => setActiveAccordion(activeAccordion === "prerequisite" ? null : "prerequisite")}
//       className="w-full px-8 py-7 flex items-center  !bg-transparent justify-between transition-all"
//     >
//       <div className="flex items-center gap-5">
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
//           activeAccordion === "prerequisite" 
//             ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" 
//             : "!bg-slate-50 !border-slate-100 !text-slate-400"
//         }`}>
//           <ShieldCheck size={24} strokeWidth={2.5} />
//         </div>
        
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${
//             activeAccordion === "prerequisite" ? "!text-white/60" : "!text-slate-400"
//           }`}>
//             Section 03
//           </span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${
//             activeAccordion === "prerequisite" ? "!text-white" : "!text-slate-900"
//           }`}>
//             Eligibility
//           </h3>
//         </div>
//       </div>

//       <div className={`p-2 rounded-full transition-all duration-500 ${
//         activeAccordion === "prerequisite" ? "bg-white text-[#2563eb] rotate-180 shadow-lg" : "bg-slate-50 text-slate-300"
//       }`}>
//         <ChevronDown size={20} strokeWidth={3} />
//       </div>
//     </button>

//     {activeAccordion === "prerequisite" && (
//       <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//         <div className="h-[1px] w-full bg-slate-50 mb-8" />
//         <div 
//           className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
//           dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
//         />
//       </div>
//     )}
//   </div>
// </div> */}


// <div className="space-y-4 pb-10">
//   {/* 1. JOB DESCRIPTION ACCORDION (Existing) */}
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "description" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
//     <button onClick={() => setActiveAccordion(activeAccordion === "description" ? null : "description")} className="w-full px-8 py-7 flex !bg-transparent items-center justify-between transition-all">
//       <div className="flex items-center gap-5">
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "description" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
//           <FileText size={24} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase !bg-transparent tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "description" ? "!text-white/60" : "!text-slate-400"}`}>Section 01</span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "description" ? "!text-white" : "!text-slate-900"}`}>Job Description</h3>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "description" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
//     </button>
//     {activeAccordion === "description" && (
//       <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//         <div className="h-[1px] w-full !bg-slate-50 mb-8" />
//         <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }} />
//       </div>
//     )}
//   </div>

//   {/* 2. RESPONSIBILITIES ACCORDION (Existing) */}
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "responsibilities" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
//     <button onClick={() => setActiveAccordion(activeAccordion === "responsibilities" ? null : "responsibilities")} className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all">
//       <div className="flex items-center gap-5">
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
//           <Zap size={24} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase tracking-[0.3em] !bg-transparent leading-none mb-1.5 transition-colors ${activeAccordion === "responsibilities" ? "!text-white/60" : "!text-slate-400"}`}>Section 02</span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "responsibilities" ? "!text-white" : "!text-slate-900"}`}>Responsibilities</h3>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
//     </button>
//     {activeAccordion === "responsibilities" && (
//       <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//         <div className="h-[1px] w-full !bg-slate-50 mb-8" />
//         <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }} />
//       </div>
//     )}
//   </div>

//   {/* 3. ELIGIBILITY ACCORDION (Existing) */}
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "prerequisite" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
//     <button onClick={() => setActiveAccordion(activeAccordion === "prerequisite" ? null : "prerequisite")} className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all">
//       <div className="flex items-center gap-5">
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
//           <ShieldCheck size={24} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "prerequisite" ? "!text-white/60" : "!text-slate-400"}`}>Section 03</span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "prerequisite" ? "!text-white" : "!text-slate-900"}`}>Eligibility</h3>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
//     </button>
//     {activeAccordion === "prerequisite" && (
//       <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//         <div className="h-[1px] w-full bg-slate-50 mb-8" />
//         <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }} />
//       </div>
//     )}
//   </div>

//   {/* 4. NEW: REGISTRY DATA ACCORDION (Added for Degrees, Languages, Assets, Certs) */}
//   <div className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "registry" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}>
//     <button onClick={() => setActiveAccordion(activeAccordion === "registry" ? null : "registry")} className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all">
//       <div className="flex items-center gap-5">
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}>
//           <Layers size={24} strokeWidth={2.5} />
//         </div>
//         <div className="flex flex-col text-left">
//           <span className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "registry" ? "!text-white/60" : "!text-slate-400"}`}>Section 04</span>
//           <h3 className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "registry" ? "!text-white" : "!text-slate-900"}`}>Addtional Information</h3>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}><ChevronDown size={20} strokeWidth={3} /></div>
//     </button>
//     {activeAccordion === "registry" && (
//       <div className="px-8 pb-10 pt-6 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem] space-y-8">
//         <div className="h-[1px] w-full !bg-slate-50" />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Degrees */}
//           <div className="space-y-2">
//             <span className={labelClass}>Degree</span>
//             <div className="flex flex-wrap gap-2">
//               {vacancy?.degrees?.map(d => (
//                 <span key={d.id} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100">{d.name}</span>
//               )) || <p className="text-xs text-slate-400">Standard Degree applies</p>}
//             </div>
//           </div>

//           {/* Languages */}
//           <div className="space-y-2">
//             <span className={labelClass}>Languages</span>
//             <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{vacancy?.spoken_languages?.join(" • ") || "English / Hindi"}</p>
//           </div>

//           {/* Assets */}
//           <div className="space-y-2">
//             <span className={labelClass}>Assets</span>
//             <div className="flex flex-wrap gap-2">
//               {vacancy?.assets_req?.map(asset => (
//                 <span key={asset} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase border border-slate-100">{asset}</span>
//               ))}
//             </div>
//           </div>

//           {/* Certifications */}
//           <div className="space-y-2">
//             <span className={labelClass}>Professional Certifications</span>
//             <div className="flex flex-wrap gap-2">
//               {vacancy?.certificates_req?.map(cert => (
//                 <span key={cert} className="px-3 py-1 bg-[#2563eb] text-white rounded-lg text-[9px] font-black uppercase shadow-sm">{cert}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// </div>
           
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Location</span>
//                     <p className={valueClass}>{vacancy?.location[0]}</p>
//                   </div>
//                 </div>

//                 {/* SHOWING COMPANY CONTACT FROM NEW API */}
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Phone size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Contact Registry</span>
//                     <p className={valueClass}>{company?.contact_number || "-"}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><UserCheck size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Contact Person</span>
//                     <p className={valueClass}>{company?.contact_person || "-"}</p>
//                   </div>
//                 </div>

//                 {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Layers size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Status</span>
//                     <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
//                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
//                       {vacancy?.status}
//                     </div>
//                   </div>
//                 </div> */}

//                 {/* --- STATUS PROTOCOL NODE --- */}
// <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
//     <Layers size={20} />
//   </div>
//   <div>
//     <span className={labelClass}>Status</span>
//     <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1 ${
//       vacancy?.status === 'open' ? 'text-emerald-500' : 
//       vacancy?.status === 'closed' ? 'text-red-500' : 
//       'text-orange-400'
//     }`}>
//       {/* Dynamic Status Indicator (The Pulse Dot) */}
//       <div className={`h-2 w-2 rounded-full animate-pulse ${
//         vacancy?.status === 'open' ? 'bg-emerald-500' : 
//         vacancy?.status === 'closed' ? 'bg-red-500' : 
//         'bg-orange-400'
//       }`} /> 
      
//       {vacancy?.status ? vacancy.status.replace('_', ' ') : 'N/A'}
//     </div>
//   </div>
// </div>
//               </div>

//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Application Deadline</p>
//                  <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
//               </div>

//               <button className="w-full bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all active:scale-95">
//                 Apply for this job
//               </button>
//             </div>
//           </div>

//         </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1rem; }
//         .custom-html-view ul, .custom-html-view ol { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.5rem; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//       `}} />
//     </div>
//   );
// }

// export default VacancyDetails;
//************************************************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   ChevronLeft, 
//   Share2, 
//   Heart,
//   ShieldCheck,
//   Layers,
//   Loader2
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [vacancy, setVacancy] = useState(null);
//   const [jobDescription, setJobDescription] = useState(null);

//   useEffect(() => {
//     const fetchAllDetails = async () => {
//       setLoading(true);
//       try {
//         // STAGE 1: Fetch Vacancy Metadata
//         const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//         if (!vacRes.ok) throw new Error("Vacancy node not found");
//         const vacData = await vacRes.json();
//         setVacancy(vacData);

//         // STAGE 2: Fetch Job Description Template using the ID from vacancy
//         if (vacData.job_description_id) {
//           const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description_id}`);
//           const jdData = await jdRes.json();
//           setJobDescription(jdData);
//         }
//       } catch (err) {
//         toast.error(err.message);
//         navigate("/vacancies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllDetails();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decrypting Registry Node...</p>
//       </div>
//     );
//   }

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       {/* 1. TOP NAVIGATION BAR */}
//       <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group"
//           >
//             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
//           </button>
//           {/* <div className="flex items-center gap-4">
//             <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-all"><Heart size={20} /></button>
//             <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-500 transition-all"><Share2 size={20} /></button>
//           </div> */}
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           {/* LEFT CONTENT AREA: 8 COLS */}
//           <div className="lg:col-span-8 space-y-10">
            
//             {/* MAIN HEADER SECTION */}
//             <section className="space-y-6 p-5">
//                <div>
//                  <span className={`px-3 ${{labelClass}}`}>Job Title</span>
//               <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
//                 {vacancy?.title}
//               </h1>
//                </div>
              
//               <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Briefcase size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Job Type</span>
//                     <p className={valueClass}>Full Time / Permanent</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Clock size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Experience</span>
//                     <p className={valueClass}>{vacancy?.experience_required || "Not Specified"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><IndianRupee size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Package</span>
//                     <p className={valueClass}>{vacancy?.salary_range} LPA</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 flex items-center gap-4 border-t border-slate-100 mt-6">
//                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job ID: GOEX-V{vacancy?.id}</span>
//                  <div className="h-1 w-1 rounded-full bg-slate-200" />
//                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted: {new Date(vacancy?.created_at).toLocaleDateString()}</span>
//               </div>

//               <button className="bg-blue-600 text-white px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
//                 Apply for this job
//               </button>
//             </section>

//             <hr className="border-slate-200" />

//             {/* RICH TEXT CONTENT SECTIONS */}
//             <div className="space-y-12 pb-10">
//               {/* 1. JOB DESCRIPTION */}
//               <section className="space-y-4 p-5">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Description</h3>
//                 </div>
//                 <div 
//                   className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
//                 />
//               </section>

//               {/* 2. RESPONSIBILITIES */}
//               <section className="space-y-4 p-5">
//                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Responsibilities</h4>
//                 <div 
//                   className="prose prose-slate text-slate-600 font-medium [overflow-wrap:anywhere] leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
//                 />
//               </section>

//               {/* 3. REQUIREMENTS */}
//               <section className="space-y-4 p-5">
//                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Prerequisite</h4>
//                 <div 
//                   className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
//                 />
//               </section>
//             </div>
//           </div>

//           {/* RIGHT SIDEBAR: 4 COLS */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Location</span>
//                     <p className={valueClass}>{vacancy?.location}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Users size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Total Openings</span>
//                     <p className={valueClass}>{vacancy?.number_of_openings} Open Positions</p>
//                   </div>
//                 </div>

//                 {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Layers size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Status Registry</span>
//                     <p className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
//                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {vacancy?.status}
//                     </p>
//                   </div>
//                 </div> */}
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
//     <Layers size={20}/>
//   </div>
//   <div>
//     <span className={labelClass}>Status</span>
//     {/* FIXED: Changed <p> to <div> to allow the child <div> pulse dot */}
//     <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
//       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
//       {vacancy?.status}
//     </div>
//   </div>
// </div>
//               </div>

//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group">
//                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing date</p>
//                  <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1rem; }
//         .custom-html-view ul, .custom-html-view ol { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.5rem; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//       `}} />
//     </div>
//   );
// }

// export default VacancyDetails;
//***************************************************************working code phase 1 26/02/26**************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   ChevronLeft, 
//   Share2, 
//   Heart,
//   ShieldCheck,
//   Layers,
//   Loader2
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [vacancy, setVacancy] = useState(null);
//   const [jobDescription, setJobDescription] = useState(null);

//   useEffect(() => {
//     const fetchAllDetails = async () => {
//       setLoading(true);
//       try {
//         // STAGE 1: Fetch Vacancy Metadata
//         const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//         if (!vacRes.ok) throw new Error("Vacancy node not found");
//         const vacData = await vacRes.json();
//         setVacancy(vacData);

//         // STAGE 2: Fetch Job Description Template using the ID from vacancy
//         if (vacData.job_description_id) {
//           const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description_id}`);
//           const jdData = await jdRes.json();
//           setJobDescription(jdData);
//         }
//       } catch (err) {
//         toast.error(err.message);
//         navigate("/vacancies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllDetails();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decrypting Registry Node...</p>
//       </div>
//     );
//   }

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       {/* 1. TOP NAVIGATION BAR */}
//       <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group"
//           >
//             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
//           </button>
//           {/* <div className="flex items-center gap-4">
//             <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-all"><Heart size={20} /></button>
//             <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-500 transition-all"><Share2 size={20} /></button>
//           </div> */}
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           {/* LEFT CONTENT AREA: 8 COLS */}
//           <div className="lg:col-span-8 space-y-10">
            
//             {/* MAIN HEADER SECTION */}
//             <section className="space-y-6 p-5">
//                <div>
//                  <span className={`px-3 ${{labelClass}}`}>Job Title</span>
//               <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
//                 {vacancy?.title}
//               </h1>
//                </div>
              
//               <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Briefcase size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Job Type</span>
//                     <p className={valueClass}>Full Time / Permanent</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Clock size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Experience</span>
//                     <p className={valueClass}>{vacancy?.experience_required || "Not Specified"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><IndianRupee size={20} /></div>
//                   <div>
//                     <span className={labelClass}>Package</span>
//                     <p className={valueClass}>{vacancy?.salary_range} LPA</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 flex items-center gap-4 border-t border-slate-100 mt-6">
//                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job ID: GOEX-V{vacancy?.id}</span>
//                  <div className="h-1 w-1 rounded-full bg-slate-200" />
//                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted: {new Date(vacancy?.created_at).toLocaleDateString()}</span>
//               </div>

//               <button className="bg-blue-600 text-white px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
//                 Apply for this job
//               </button>
//             </section>

//             <hr className="border-slate-200" />

//             {/* RICH TEXT CONTENT SECTIONS */}
//             <div className="space-y-12 pb-10">
//               {/* 1. JOB DESCRIPTION */}
//               <section className="space-y-4 p-5">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Description</h3>
//                 </div>
//                 <div 
//                   className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
//                 />
//               </section>

//               {/* 2. RESPONSIBILITIES */}
//               <section className="space-y-4 p-5">
//                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Responsibilities</h4>
//                 <div 
//                   className="prose prose-slate text-slate-600 font-medium [overflow-wrap:anywhere] leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
//                 />
//               </section>

//               {/* 3. REQUIREMENTS */}
//               <section className="space-y-4 p-5">
//                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Prerequisite</h4>
//                 <div 
//                   className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
//                   dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
//                 />
//               </section>
//             </div>
//           </div>

//           {/* RIGHT SIDEBAR: 4 COLS */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Location</span>
//                     <p className={valueClass}>{vacancy?.location}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Users size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Total Openings</span>
//                     <p className={valueClass}>{vacancy?.number_of_openings} Open Positions</p>
//                   </div>
//                 </div>

//                 {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Layers size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Status Registry</span>
//                     <p className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
//                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {vacancy?.status}
//                     </p>
//                   </div>
//                 </div> */}
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
//     <Layers size={20}/>
//   </div>
//   <div>
//     <span className={labelClass}>Status</span>
//     {/* FIXED: Changed <p> to <div> to allow the child <div> pulse dot */}
//     <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
//       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
//       {vacancy?.status}
//     </div>
//   </div>
// </div>
//               </div>

//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group">
//                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing date</p>
//                  <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1rem; }
//         .custom-html-view ul, .custom-html-view ol { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.5rem; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//       `}} />
//     </div>
//   );
// }

// export default VacancyDetails;
//************************************************************************************************************** */
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const VacancyDetails = () => {
//   const { id } = useParams(); // Gets the ID from /vacancy-details/:id

//   useEffect(() => {
//     // Call your GET API: https://apihrr.goelectronix.co.in/vacancies/{id}
//     const fetchDetails = async () => {
//        const res = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//        const data = await res.json();
//        // Hydrate your UI with data.title, data.content, etc.
//     }
//     fetchDetails();
//   }, [id]);

//   return (
//     // Your Detail UI here...
//     <>
//     sdfsdf</>
//   );
// }
// export default VacancyDetails;