    import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Smartphone,
  Monitor,
  FileCheck,
  FileText,
  Activity,
  Database,
  ShieldCheck,
  MapPin,
  History,
  User,
  Briefcase,
  ExternalLink,
  Calendar,
  Globe,
  Shield,
  Download,
  MoreVertical,
  Edit3,
  Fingerprint,
  Cpu,
  Layers,
  Award,
  BadgeCheck,
  Languages
} from "lucide-react";

const CandidateProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://apihrr.goelectronix.co.in/candidates/${id}`,
        );
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error("Profile Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const formatDocUrl = (rawUrl) => {
    if (!rawUrl) return "#";
    const path = rawUrl.split("uploads/")[1];
    return `https://apihrr.goelectronix.co.in/uploads/${path}`;
  };

  const calculateTotalExperience = (experiences) => {
    if (!experiences || experiences.length === 0) return "0 Months";
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.start_date);
      const end = exp.end_date ? new Date(exp.end_date) : new Date();
      const diff =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, diff);
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0) return `${months} Months`;
    return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <nav className="flex text-sm font-medium text-slate-500 gap-2">
              <span className="hover:text-blue-600 cursor-pointer">Candidates</span>
              <span>/</span>
              <span className="text-slate-900 font-bold tracking-tight">{employee?.full_name}</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          {/* <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              
               <Fingerprint className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none" size={140} />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative group mb-6">
                  <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
                  <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
                      {employee?.profile_image ? (
                        <img
                          src={employee.profile_image}
                          alt={employee?.full_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
                          <User size={42} className="text-slate-500 mb-1" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                  {employee?.full_name || "Unknown"}
                </h1>

                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      employee?.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
                    }`}>
                    {employee?.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t border-slate-50 pt-6 relative z-10">
                <SidebarInfo icon={<Mail size={16} />} label="System Email" value={employee?.email} />
                <SidebarInfo icon={<Smartphone size={16} />} label="Primary Contact" value={employee?.phone} />
                <SidebarInfo icon={<MapPin size={16} />} label="Geographic Node" value={`${employee?.city}, ${employee?.state}`} />
              </div>
            </section>
          </div> */}  

          <div className="col-span-12 lg:col-span-4 space-y-6">
  <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
    {/* Decorative Background Icon */}
    <Fingerprint className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none" size={140} />
    
    <div className="flex flex-col items-center text-center relative z-10">
      <div className="relative group mb-6">
        <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
        <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
            {employee?.profile_image ? (
              <img
                src={employee.profile_image}
                alt={employee?.full_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
                <User size={42} className="text-slate-500 mb-1" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
        {employee?.full_name || "Unknown"}
      </h1>

      <div className="flex gap-2 mt-2">
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            employee?.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
          }`}>
          {employee?.status || "Pending"}
        </span>
      </div>
    </div>

    {/* DATA STACK: Left Aligned Personal Info */}
    <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
      <SidebarInfo icon={<Mail />} label="System Email" value={employee?.email} />
      <SidebarInfo icon={<Smartphone />} label="Primary Contact" value={employee?.phone} />
      
      {/* ADDED DOB & GENDER HERE */}
      <div className="grid grid-cols-2 gap-4">
        <SidebarInfo icon={<Calendar />} label="Birth date" value={employee?.dob} />
        <SidebarInfo  icon={<User />} label="Gender" 
        // value={employee?.gender}
        value={
  employee?.gender
    ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)
    : ""
}

         />
      </div>

      <SidebarInfo icon={<MapPin />} label="Location" value={`${employee?.city}, ${employee?.state} , ${employee?.pincode}`} />
    </div>
  </section>
</div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
              <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Candidate Overview" icon={<Activity size={18} />} />
              <TabButton active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Document" icon={<ShieldCheck size={18} />} />
            </div>

            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="Core Identity" icon={Fingerprint}>
                      <DetailRow label="DOB" value={employee?.dob} icon={<Calendar size={14} />} />
                      <DetailRow label="Gender Spec" value={employee?.gender} icon={<User size={14} />} />
                      <DetailRow label="Linguistic Stack" value={employee?.languages_spoken?.join(", ")} icon={<Languages size={14} />} />
                    </InfoCard>

                    <InfoCard title="Professional Stack" icon={Cpu}>
                      <DetailRow label="Technical Skills" value={employee?.skills} icon={<Layers size={14} />} isSkills={true} />
                      <div className="my-2 border-t border-slate-100/50" />
                      <DetailRow label="Hardware Assets" value={employee?.assets} icon={<Monitor size={14} />} isSkills={true} />
                    </InfoCard>
                  </div> */}
                  {/* MODERN INFO STRIP SECTION */}
{/* <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
  
 
  <div className="group relative flex flex-wrap md:flex-nowrap items-center gap-6 bg-white border border-slate-200 p-2 pr-6 rounded-2xl transition-all hover:border-blue-200 hover:shadow-md overflow-hidden">
    
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[180px]">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
        <Fingerprint size={20} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Identity</h3>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">Core Profile</p>
      </div>
    </div>

    <div className="flex flex-1 flex-wrap items-center gap-x-12 gap-y-4 px-4">
      <StripDetail icon={<Calendar size={14} />} label="Date of Birth" value={employee?.dob} />
      <div className="hidden md:block h-8 w-[1px] bg-slate-100" />
      <StripDetail icon={<User size={14} />} label="Gender Spec" value={employee?.gender} />
      <div className="hidden md:block h-8 w-[1px] bg-slate-100" />
      <StripDetail icon={<Languages size={14} />} label="Linguistic Stack" value={employee?.languages_spoken?.join(", ")} />
    </div>

 
    <Fingerprint className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={80} />
  </div>


  <div className="group relative flex flex-wrap md:flex-nowrap items-center gap-6 bg-white border border-slate-200 p-2 pr-6 rounded-2xl transition-all hover:border-emerald-200 hover:shadow-md overflow-hidden">
  
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[180px]">
      <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-200">
        <Cpu size={20} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Technology</h3>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">Professional Stack</p>
      </div>
    </div>


    <div className="flex flex-1 flex-wrap items-center gap-8 px-4">
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Skills</span>
        <div className="flex flex-wrap gap-1.5">
          {employee?.skills ? (
            String(employee.skills).split(',').map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-black uppercase">
                {skill.trim()}
              </span>
            ))
          ) : <span className="text-[9px] text-slate-300 italic">None Logged</span>}
        </div>
      </div>

      <div className="hidden md:block h-10 w-[1px] bg-slate-100" />

      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Assets</span>
        <div className="flex flex-wrap gap-1.5">
          {employee?.assets ? (
            String(employee.assets).split(',').map((asset, i) => (
              <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase">
                {asset.trim()}
              </span>
            ))
          ) : <span className="text-[9px] text-slate-300 italic">No Assets Assigned</span>}
        </div>
      </div>
    </div>


    <Cpu className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={80} />
  </div>
</div> */}

<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
  
  {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
  <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
    {/* Decorative Security Pattern Header */}
    <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
    
    <div className="flex flex-col md:flex-row items-stretch">
      {/* Branding Box (Left) */}
      <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
          <Languages size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Language</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Spoken</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex items-center">
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Languages</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>
          <div className="flex flex-wrap gap-2">
            {employee?.languages_spoken?.length > 0 ? (
              employee.languages_spoken.map((lang, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[11px] font-black text-slate-700 uppercase">{lang}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic font-medium">No language data</span>
            )}
          </div>
        </div>
      </div>
    </div>
    <Globe className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={120} />
  </div>

  {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
  <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5">
    <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-emerald-300 to-transparent" />
    
    <div className="flex flex-col md:flex-row items-stretch">
      {/* Branding Box (Left) */}
      <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:rotate-12 transition-transform">
          <Cpu size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Assets & Skill</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Assets & Skills Data</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills Subsection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {employee?.skills ? (
              String(employee.skills).split(',').map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default">
                  {skill.trim()}
                </span>
              ))
            ) : <span className="text-[9px] text-slate-300 uppercase">Empty Set</span>}
          </div>
        </div>

        {/* Assets Subsection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {employee?.assets ? (
              String(employee.assets).split(',').map((asset, i) => (
                <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight">
                  {asset.trim()}
                </span>
              ))
            ) : <span className="text-[9px] text-slate-300 uppercase">No Assets Logged</span>}
          </div>
        </div>
      </div>
    </div>
    <Layers className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none" size={120} />
  </div>

</div>

                  {/* EXPERIENCE SECTION */}
                  {/* <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
                    <History className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none" size={200} />
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <History size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Experience History</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Experience Logs</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tenure</span>
                        <span className="text-[11px] font-black text-blue-600 uppercase">{calculateTotalExperience(employee?.experiences)}</span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      {employee?.experiences?.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {employee.experiences.map((exp, i) => (
                            <div key={i} className="group hover:bg-slate-50/40 transition-colors p-8">
                              <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-32">
                                  <span className="text-xl font-black text-slate-900 tracking-tighter block">
                                    {exp?.start_date ? new Date(exp.start_date).getFullYear() : "----"}
                                  </span>
                                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Experience</span>
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{exp?.company_name || "Unidentified Entity"}</h4>
                                      <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">{exp?.job_title || "Role Undefined"}</p>
                                    </div>
                                    {exp?.experience_letter_path && (
                                      <a href={formatDocUrl(exp.experience_letter_path)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
                                        <FileText size={14} className="text-slate-400" /> View <ExternalLink size={10} />
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex gap-10">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Previous CTC</span>
                                      <span className="text-[11px] font-bold text-slate-700">₹{exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "N/A"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                      <span className="text-[11px] font-bold text-slate-700 uppercase">{new Date(exp.start_date).toLocaleDateString('en-IN', {month:'short', year:'numeric'})} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-IN', {month:'short', year:'numeric'}) : 'Present'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-20 flex flex-col items-center opacity-50"><Database size={40} className="mb-4 text-slate-200" /><p className="text-[10px] font-black uppercase tracking-widest">No Historical Data</p></div>
                      )}
                    </div>
                  </div> */}
                                   {/* <div>
                        <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
                        <History
                            className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none"
                            size={200}
                        />

                        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <History size={18} strokeWidth={2.5} />
                            </div>

                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
                                Candidate
                                </h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Previous History
                                </p>
                            </div>
                            </div>

                          
                            <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                Total Experiance
                                </span>
                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
                                {calculateTotalExperience(employee?.experiences)}
                                </span>
                            </div>

                            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                Active Stream
                                </span>
                            </div>
                            </div>
                        </div>

                    
                        <div className="relative z-10">
                            {employee?.experiences &&
                            employee.experiences.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {employee.experiences.map((exp, i) => (
                                <div
                                    key={i}
                                    className="group hover:bg-slate-50/40 transition-colors duration-300"
                                >
                                    <div className="flex flex-col md:flex-row p-8 gap-8">
                             
                                    <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                                        <span className="text-xl font-black text-slate-900 tracking-tighter">
                                        {exp?.start_date
                                            ? new Date(exp.start_date).getFullYear()
                                            : "----"}
                                        </span>

                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
                                        {exp?.start_date
                                            ? new Date(
                                                exp.start_date,
                                            ).toLocaleDateString("en-IN", {
                                                month: "short",
                                            })
                                            : "---"}{" "}
                                        DEPLOYMENT
                                        </span>
                                    </div>

                                 
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                {exp?.company_name ||
                                                "Unidentified Entity"}
                                            </h4>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {exp?.location || "Global Node"}
                                            </span>
                                            </div>

                                            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                                            {exp?.job_title || "Role Undefined"}
                                            </p>
                                        </div>

                                        {exp?.experience_letter_path && (
                                            <a
                                            href={formatDocUrl(
                                                exp.experience_letter_path,
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
                                            >
                                            <FileText
                                                size={14}
                                                className="text-slate-400 group-hover/artifact:text-blue-500"
                                            />
                                            Experience Letter
                                            <ExternalLink
                                                size={10}
                                                className="opacity-40"
                                            />
                                            </a>
                                        )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            Previous CTC
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                            <span className="text-blue-600 font-black text-[10px]">
                                                ₹
                                            </span>
                                            <span className="text-[11px] font-bold text-slate-700">
                                                {exp?.previous_ctc
                                                ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
                                                : "Not Logged"}
                                            </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            Duration
                                            </span>

                                            <span className="text-[11px] font-bold text-slate-700 uppercase">
                                            {exp?.start_date
                                                ? new Date(
                                                    exp.start_date,
                                                ).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "---"}{" "}
                                            -{" "}
                                            {exp?.end_date
                                                ? new Date(
                                                    exp.end_date,
                                                ).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "Present"}
                                            </span>
                                        </div>
                                        </div>

                                        {exp?.description && (
                                        <div className="max-w-3xl">
                                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
                                            "{exp.description}"
                                            </p>
                                        </div>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
                                <Database size={28} strokeWidth={1.5} />
                                </div>

                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                                Fresher Profile
                                </h4>

                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                No prior professional experience recorded
                                </p>
                            </div>
                            )}
                        </div>
                        </div>
                    </div> */}


                    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">
  
  {/* SYSTEM WATERMARK: Large rotated background icon */}
  <History
    className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
    size={260}
    strokeWidth={1}
  />

  {/* HEADER SECTION */}
  <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
        <History size={18} strokeWidth={2.5} />
      </div>

      <div>
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
          Candidate
        </h3>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Previous Job History
        </p>
      </div>
    </div>

    {/* TENURE COUNTER */}
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          Total Experience
        </span>
        <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
          {calculateTotalExperience(employee?.experiences)}
        </span>
      </div>

      <div className="h-8 w-[1px] bg-slate-200 mx-1" />

      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
         {/* EDIT BUTTON */}
  <button
    type="button"
onClick={() => navigate(`/editentry/${id}?step=4`)}
    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
  >
    <Edit3 size={12} strokeWidth={3} />
    Edit
  </button>
      </div>
    </div>
  </div>

  {/* BODY CONTENT */}
  <div className="relative z-10">
    {employee?.experiences && employee.experiences.length > 0 ? (
      <div className="divide-y divide-slate-100">
        {employee.experiences.map((exp, i) => (
          <div
            key={i}
            className="group hover:bg-slate-50/40 transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row p-8 gap-8">
              {/* TIME IDENTIFIER */}
              <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  {exp?.start_date
                    ? new Date(exp.start_date).getFullYear()
                    : "----"}
                </span>

                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
                  {exp?.start_date
                    ? new Date(exp.start_date).toLocaleDateString("en-IN", {
                        month: "short",
                      })
                    : "---"}{" "}
                  DEPLOYMENT
                </span>
              </div>

              {/* CONTENT BODY */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {exp?.company_name || "Unidentified Entity"}
                      </h4>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {exp?.location || "Global Node"}
                      </span>
                    </div>

                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                      {exp?.job_title || "Role Undefined"}
                    </p>
                  </div>

                  {exp?.experience_letter_path && (
                    <a
                      href={formatDocUrl(exp.experience_letter_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
                    >
                      <FileText
                        size={14}
                        className="text-slate-400 group-hover/artifact:text-blue-500"
                      />
                      Experience Letter
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Previous CTC
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-600 font-black text-[10px]">
                        ₹
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">
                        {exp?.previous_ctc
                          ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
                          : "Not Logged"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Duration
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      {exp?.start_date
                        ? new Date(exp.start_date).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })
                        : "---"}{" "}
                      -{" "}
                      {exp?.end_date
                        ? new Date(exp.end_date).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Present"}
                    </span>
                  </div>
                </div>

                {exp?.description && (
                  <div className="max-w-3xl">
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
                      "{exp.description}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
          <Database size={28} strokeWidth={1.5} />
        </div>
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
          Fresher Profile
        </h4>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          No prior professional experience recorded
        </p>
      </div>
    )}
  </div>
</div>

{/* EDUCATION HISTORY: SYSTEM STREAM */}
<div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
  {/* SYSTEM WATERMARK */}
  <Award
    className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
    size={260}
    strokeWidth={1}
  />

  {/* HEADER SECTION */}
  <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
        <Award size={18} strokeWidth={2.5} />
      </div>

      <div>
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
          Academic Nodes
        </h3>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Verified Education History
        </p>
      </div>
    </div>

    {/* EDIT REDIRECT */}
    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
      <button
        type="button"
        onClick={() => navigate(`/editentry/${id}?step=3`)}
        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
      >
        <Edit3 size={12} strokeWidth={3} />
        Edit Nodes
      </button>
    </div>
  </div>

  {/* BODY CONTENT */}
  <div className="relative z-10">
    {employee?.educations && employee.educations.length > 0 ? (
      <div className="divide-y divide-slate-100">
        {employee.educations.map((edu, i) => (
          <div
            key={i}
            className="group/item hover:bg-slate-50/40 transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row p-8 gap-8">
              {/* TIME IDENTIFIER */}
              <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  {edu?.end_year || "----"}
                </span>

                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
                  GRADUATION
                </span>
              </div>

              {/* CONTENT BODY */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {edu?.institution_name || "Unidentified Institute"}
                      </h4>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                    
                    {/* Degree Name from education_master mapping */}
                    <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
                      {edu?.education_master?.name || "Specialization Undefined"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Academic Period
                    </span>
                    <div className="flex items-center gap-2">
                       <Calendar size={12} className="text-slate-300" />
                       <span className="text-[11px] font-bold text-slate-700 uppercase">
                        {edu?.start_year || "----"} — {edu?.end_year || "----"}
                      </span>
                    </div>
                  </div>
{/* 
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Verification Status
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
                      <BadgeCheck size={12} /> Registry Confirmed
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      /* EMPTY STATE */
      <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
          <GraduationCap size={28} strokeWidth={1.5} />
        </div>
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
          No Academic Records
        </h4>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          Node synchronized but education array is empty
        </p>
      </div>
    )}
  </div>
</div>



                </div>
              )}

              {activeTab === "vault" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Identification</h3>
                    </div>
                    {employee?.resume_path ? (
                      <ModernDocCard title="Master Curriculum Vitae" url={employee.resume_path} type="PDF_VERSION_VERIFIED" formatDocUrl={formatDocUrl} />
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center"><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Resume Missing</p></div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Credentials</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employee?.certificates?.map((cert) => (
                        <ModernDocCard key={cert.id} title={cert.name} url={cert.file_path} type="ACCREDITED_CERT" formatDocUrl={formatDocUrl} icon={Award} />
                      )) || <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">No Certificates Found</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

const SidebarInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
      {React.cloneElement(icon, { size: 14 })}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
      <span className="text-sm font-bold text-slate-700 break-all">{value || "NULL_DATA"}</span>
    </div>
  </div>
);

const InfoCard = ({ title, children, icon: HeaderIcon }) => (
  <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
      <div className="p-1.5 bg-blue-50 rounded-lg">
        {HeaderIcon && <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />}
      </div>
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="relative z-10 p-6 space-y-4">{children}</div>
    <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
      {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
    </div>
  </div>
);

const DetailRow = ({ label, value, icon, isSkills = false }) => (
  <div className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}>
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {isSkills ? (
      <div className="flex flex-wrap gap-2">
        {value ? (
          String(value).split(',').map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter">
              {skill.trim()}
            </span>
          ))
        ) : <span className="text-[10px] text-slate-300 uppercase">Void</span>}
      </div>
    ) : (
      <span className="text-xs font-black text-slate-800 uppercase">{value || "—"}</span>
    )}
  </div>
);

const ModernDocCard = ({ title, url, type, formatDocUrl, icon: CardIcon = FileText }) => (
  <a href={formatDocUrl(url)} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
        <CardIcon size={20} />
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{title}</p>
        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{type}</p>
      </div>
    </div>
    <ExternalLink size={16} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
  </a>
);

const TabButton = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
    active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
  }`}>
    {icon} {label}
  </button>
);

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing System Nodes...</p>
  </div>
);

const StripDetail = ({ icon, label, value }) => (
  <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
    {/* ICON BRANDING BOX: Glassmorphism effect */}
    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
      <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
        {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
      </div>
    </div>

    {/* DATA STACK */}
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
          {label}
        </span>
        {/* Verification Dot: Hidden by default, shown on hover */}
        <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
          {value || "—"}
        </span>
      </div>
    </div>
  </div>
);

export default CandidateProfilePage;
    //*******************************************************working code phase 2 19/02/26******************************************************** */
    // import React, { useEffect, useState } from "react";
    // import { useParams, useNavigate } from "react-router-dom";
    // import {
    // ArrowLeft,
    // Mail,
    // Smartphone,
    // Monitor,
    // FileCheck,
    // FileText,
    // Activity,
    // Database,
    // ShieldCheck,
    // MapPin,
    // History,
    // User,
    // Briefcase,
    // ExternalLink,
    // Calendar,
    // Globe,
    // Shield,
    // Download,
    // MoreVertical,
    // Edit3,
    // } from "lucide-react";

    // const CandidateProfilePage = () => {
    // const { id } = useParams();
    // const navigate = useNavigate();
    // const [employee, setEmployee] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [activeTab, setActiveTab] = useState("overview");

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await fetch(
    //         `https://apihrr.goelectronix.co.in/candidates/${id}`,
    //         );
    //         const data = await res.json();
    //         setEmployee(data);
    //     } catch (err) {
    //         console.error("Profile Load Error", err);
    //     } finally {
    //         setLoading(false);
    //     }
    //     };
    //     fetchProfile();
    // }, [id]);

    // const formatDocUrl = (rawUrl) => {
    //     if (!rawUrl) return "#";
    //     // This removes everything before 'uploads/' and adds your new base URL
    //     const path = rawUrl.split("uploads/")[1];
    //     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
    // };

    // const calculateTotalExperience = (experiences) => {
    //     if (!experiences || experiences.length === 0) return "0 Months";

    //     let totalMonths = 0;
    //     experiences.forEach((exp) => {
    //     const start = new Date(exp.start_date);
    //     const end = exp.end_date ? new Date(exp.end_date) : new Date(); // Defaults to today if no end_date
    //     const diff =
    //         (end.getFullYear() - start.getFullYear()) * 12 +
    //         (end.getMonth() - start.getMonth());
    //     totalMonths += Math.max(0, diff);
    //     });

    //     const years = Math.floor(totalMonths / 12);
    //     const months = totalMonths % 12;

    //     if (years === 0) return `${months} Months`;
    //     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
    // };

    // if (loading) return <LoadingSkeleton />;

    // return (
    //     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
    //     {/* TOP NAVIGATION BAR */}
    //     <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
    //         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    //         <div className="flex items-center gap-4">
    //             <button
    //             onClick={() => navigate(-1)}
    //             className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
    //             >
    //             <ArrowLeft size={20} />
    //             </button>
    //             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
    //             <nav className="flex text-sm font-medium text-slate-500 gap-2">
    //             <span className="hover:text-blue-600 cursor-pointer">
    //                 Candidates
    //             </span>
    //             <span>/</span>
    //             <span className="text-slate-900">{employee?.full_name}</span>
    //             </nav>
    //         </div>
    //         </div>
    //     </header>

    //     <main className="max-w-7xl mx-auto px-4 py-8">
    //         <div className="grid grid-cols-12 gap-8">
    //         {/* LEFT COLUMN: IDENTITY CARD */}
    //         <div className="col-span-12 lg:col-span-4 space-y-6">
    //             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
    //             <div className="flex flex-col items-center text-center">
    //                 <div className="relative group mb-6">
    //                 {/* External Soft Glow Layer */}
    //                 <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>

    //                 {/* Main Avatar Container */}
    //                 <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
    //                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
    //                     {employee?.profile_image ? (
    //                         <img
    //                         src={employee.profile_image}
    //                         alt={employee?.full_name}
    //                         loading="lazy"
    //                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    //                         onError={(e) => {
    //                             e.target.onerror = null;
    //                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
    //                         }}
    //                         />
    //                     ) : (
    //                         /* FALLBACK: Enterprise Personnel Icon */
    //                         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
    //                         <User
    //                             size={42}
    //                             className="text-slate-500 mb-1"
    //                             strokeWidth={1.5}
    //                         />
    //                         <div className="absolute bottom-3 flex gap-1">
    //                             <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
    //                             <div className="h-1 w-1 rounded-full bg-blue-500/40" />
    //                             <div className="h-1 w-1 rounded-full bg-blue-500/20" />
    //                         </div>
    //                         </div>
    //                     )}

    //                     {/* Decorative Overlay for a "Digital ID" feel */}
    //                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    //                     </div>

    //                     {/* Verification Badge (System Active) */}
    //                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
    //                     <div className="relative flex h-2.5 w-2.5">
    //                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    //                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
    //                     </div>
    //                     </div>
    //                 </div>
    //                 </div>
    //                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
    //                 {employee?.full_name
    //                     ? employee.full_name.charAt(0).toUpperCase() +
    //                     employee.full_name.slice(1)
    //                     : "Unkown"}
    //                 </h1>

    //                 <div className="flex gap-2 mt-2">
    //                 <span
    //                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
    //                     employee?.status === "Active"
    //                         ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    //                         : "bg-orange-50 text-orange-700 border-orange-100"
    //                     }`}
    //                 >
    //                     {employee?.status || "Pending"}
    //                 </span>
    //                 </div>
    //             </div>

    //             <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
    //                 <SidebarInfo
    //                 icon={<Mail size={16} />}
    //                 label="Email"
    //                 value={employee?.email}
    //                 />
    //                 <SidebarInfo
    //                 icon={<Smartphone size={16} />}
    //                 label="Phone"
    //                 value={employee?.phone}
    //                 />
    //                 <SidebarInfo
    //                 icon={<MapPin size={16} />}
    //                 label="Location"
    //                 value={`${employee?.city}, ${employee?.state}, ${employee?.district} , ${employee?.pincode}`}
    //                 />
    //             </div>
    //             </section>
    //         </div>

    //         {/* RIGHT COLUMN: TABS AND CONTENT */}
    //         <div className="col-span-12 lg:col-span-8">
    //             {/* TAB SELECTOR */}
    //             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
    //             <TabButton
    //                 active={activeTab === "overview"}
    //                 onClick={() => setActiveTab("overview")}
    //                 label="General Overview"
    //                 icon={<Activity size={18} />}
    //             />

    //             <TabButton
    //                 active={activeTab === "vault"}
    //                 onClick={() => setActiveTab("vault")}
    //                 label="Documentation"
    //                 icon={<FileCheck size={18} />}
    //             />
    //             </div>

    //             {/* TAB CONTENT */}
    //             <div className="min-h-[400px]">
    //             {activeTab === "overview" && (
    //                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //                     <InfoCard title="Personal Information">
    //                     <DetailRow
    //                         label="Date of Birth"
    //                         value={employee?.dob}
    //                         icon={<Calendar size={14} />}
    //                     />
    //                     <DetailRow
    //                         label="Gender "
    //                         value={employee?.gender}
    //                         icon={<Shield size={14} />}
    //                     />
    //                     <DetailRow
    //                         label="language"
    //                         value={employee?.languages_spoken?.join(", ")}
    //                         icon={<Globe size={14} />}
    //                     />
    //                     </InfoCard>

    //                     <InfoCard title="Professional Information">
    //                     <DetailRow
    //                         label="Skill"
    //                         value={employee?.skills || "-"}
    //                         icon={<Briefcase size={14} />}
    //                         isSkills={true}
    //                     />

    //                     <div className="my-4 border-t border-slate-50" />

    //                     <DetailRow
    //                         label="Assets"
    //                         value={employee?.assets || "-"}
    //                         icon={<Shield size={14} />}
    //                         isSkills={true}
    //                     />
    //                     </InfoCard>
    //                 </div>

                    // <div>
                    //     <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative">
                    //     <History
                    //         className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none"
                    //         size={200}
                    //     />

                    //     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
                    //         <div className="flex items-center gap-3">
                    //         <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                    //             <History size={18} strokeWidth={2.5} />
                    //         </div>

                    //         <div>
                    //             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
                    //             Candidate
                    //             </h3>
                    //             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    //             Previous History
                    //             </p>
                    //         </div>
                    //         </div>

                    //         {/* TENURE COUNTER */}
                    //         <div className="flex items-center gap-3">
                    //         <div className="flex flex-col items-end">
                    //             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    //             Total Experiance
                    //             </span>
                    //             <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
                    //             {calculateTotalExperience(employee?.experiences)}
                    //             </span>
                    //         </div>

                    //         <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                    //         <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                    //             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    //             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    //             Active Stream
                    //             </span>
                    //         </div>
                    //         </div>
                    //     </div>

                    //     {/* BODY */}
                    //     <div className="relative z-10">
                    //         {employee?.experiences &&
                    //         employee.experiences.length > 0 ? (
                    //         <div className="divide-y divide-slate-100">
                    //             {employee.experiences.map((exp, i) => (
                    //             <div
                    //                 key={i}
                    //                 className="group hover:bg-slate-50/40 transition-colors duration-300"
                    //             >
                    //                 <div className="flex flex-col md:flex-row p-8 gap-8">
                    //                 {/* TIME IDENTIFIER */}
                    //                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                    //                     <span className="text-xl font-black text-slate-900 tracking-tighter">
                    //                     {exp?.start_date
                    //                         ? new Date(exp.start_date).getFullYear()
                    //                         : "----"}
                    //                     </span>

                    //                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
                    //                     {exp?.start_date
                    //                         ? new Date(
                    //                             exp.start_date,
                    //                         ).toLocaleDateString("en-IN", {
                    //                             month: "short",
                    //                         })
                    //                         : "---"}{" "}
                    //                     DEPLOYMENT
                    //                     </span>
                    //                 </div>

                    //                 {/* CONTENT BODY */}
                    //                 <div className="flex-1 space-y-4">
                    //                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    //                     <div>
                    //                         <div className="flex items-center gap-2 mb-1">
                    //                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    //                             {exp?.company_name ||
                    //                             "Unidentified Entity"}
                    //                         </h4>
                    //                         <span className="h-1 w-1 rounded-full bg-slate-300" />
                    //                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    //                             {exp?.location || "Global Node"}
                    //                         </span>
                    //                         </div>

                    //                         <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                    //                         {exp?.job_title || "Role Undefined"}
                    //                         </p>
                    //                     </div>

                    //                     {exp?.experience_letter_path && (
                    //                         <a
                    //                         href={formatDocUrl(
                    //                             exp.experience_letter_path,
                    //                         )}
                    //                         target="_blank"
                    //                         rel="noreferrer"
                    //                         className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
                    //                         >
                    //                         <FileText
                    //                             size={14}
                    //                             className="text-slate-400 group-hover/artifact:text-blue-500"
                    //                         />
                    //                         Experience Letter
                    //                         <ExternalLink
                    //                             size={10}
                    //                             className="opacity-40"
                    //                         />
                    //                         </a>
                    //                     )}
                    //                     </div>

                    //                     <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
                    //                     <div className="flex flex-col">
                    //                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    //                         Previous CTC
                    //                         </span>

                    //                         <div className="flex items-center gap-1.5">
                    //                         <span className="text-blue-600 font-black text-[10px]">
                    //                             ₹
                    //                         </span>
                    //                         <span className="text-[11px] font-bold text-slate-700">
                    //                             {exp?.previous_ctc
                    //                             ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
                    //                             : "Not Logged"}
                    //                         </span>
                    //                         </div>
                    //                     </div>

                    //                     <div className="flex flex-col">
                    //                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    //                         Duration
                    //                         </span>

                    //                         <span className="text-[11px] font-bold text-slate-700 uppercase">
                    //                         {exp?.start_date
                    //                             ? new Date(
                    //                                 exp.start_date,
                    //                             ).toLocaleDateString("en-IN", {
                    //                                 month: "short",
                    //                                 year: "numeric",
                    //                             })
                    //                             : "---"}{" "}
                    //                         -{" "}
                    //                         {exp?.end_date
                    //                             ? new Date(
                    //                                 exp.end_date,
                    //                             ).toLocaleDateString("en-IN", {
                    //                                 month: "short",
                    //                                 year: "numeric",
                    //                             })
                    //                             : "Present"}
                    //                         </span>
                    //                     </div>
                    //                     </div>

                    //                     {exp?.description && (
                    //                     <div className="max-w-3xl">
                    //                         <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
                    //                         "{exp.description}"
                    //                         </p>
                    //                     </div>
                    //                     )}
                    //                 </div>
                    //                 </div>
                    //             </div>
                    //             ))}
                    //         </div>
                    //         ) : (
                    //         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
                    //             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
                    //             <Database size={28} strokeWidth={1.5} />
                    //             </div>

                    //             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                    //             Fresher Profile
                    //             </h4>

                    //             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    //             No prior professional experience recorded
                    //             </p>
                    //         </div>
                    //         )}
                    //     </div>
                    //     </div>
                    // </div>
    //                 </div>
    //             )}

    //             {activeTab === "vault" && (
    //                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    //                 {/* SECTION 1: MASTER IDENTITY DOCUMENTS */}
    //                 <div className="space-y-4">
    //                     <div className="flex items-center gap-3 px-2">
    //                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
    //                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
    //                         Master Identity Node
    //                     </h3>
    //                     </div>

    //                     {employee?.resume_path ? (
    //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                         <ModernDocCard
    //                         title="Candidate Resume"
    //                         url={employee.resume_path}
    //                         type="employee"
    //                         formatDocUrl={formatDocUrl}
    //                         />
    //                     </div>
    //                     ) : (
    //                     <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
    //                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
    //                         Resume not updated
    //                         </p>
    //                     </div>
    //                     )}
    //                 </div>

    //                 {/* SECTION 3: ACADEMIC & SKILL CERTIFICATIONS */}
    //                 <div className="space-y-4">
    //                     <div className="flex items-center gap-3 px-2">
    //                     <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
    //                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
    //                         Certifications
    //                     </h3>
    //                     </div>

    //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //                     {employee?.certificates?.length > 0 ? (
    //                         employee.certificates.map((cert) => (
    //                         <ModernDocCard
    //                             key={cert.id}
    //                             title={cert.name}
    //                             url={cert.file_path}
    //                             type="COMPLIANCE_CERT"
    //                             formatDocUrl={formatDocUrl}
    //                         />
    //                         ))
    //                     ) : (
    //                         <div className="col-span-full p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
    //                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
    //                             No External Credentials Found
    //                         </p>
    //                         </div>
    //                     )}
    //                     </div>
    //                 </div>

    //                 {/* SYSTEM FOOTER WATERMARK */}
    //                 <div className="pt-10 border-t border-slate-100 flex justify-center">
    //                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
    //                     <ShieldCheck size={12} className="text-slate-400" />
    //                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
    //                         Encrypted Artifact Vault v4.2.0
    //                     </span>
    //                     </div>
    //                 </div>
    //                 </div>
    //             )}
    //             </div>
    //         </div>
    //         </div>
    //     </main>
    //     </div>
    // );
    // };

    // /* REUSABLE SUB-COMPONENTS */

    // const LoadingSkeleton = () => (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    //     <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
    //     <p className="text-sm font-medium text-slate-500 animate-pulse">
    //     Initializing Candidate Data...
    //     </p>
    // </div>
    // );

    // const SidebarInfo = ({ icon, label, value }) => (
    // <div className="flex items-center gap-4 group">
    //     <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
    //     {icon}
    //     </div>
    //     <div className="flex flex-col">
    //     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
    //         {label}
    //     </span>
    //     <span className="text-sm font-semibold text-slate-700 break-all">
    //         {value || "Not provided"}
    //     </span>
    //     </div>
    // </div>
    // );

    // const TabButton = ({ active, onClick, label, icon }) => (
    // <button
    //     onClick={onClick}
    //     className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 ${
    //     active
    //         ? "border-blue-600 text-blue-600"
    //         : "border-transparent text-slate-500 hover:text-slate-700"
    //     }`}
    // >
    //     {icon} {label}
    // </button>
    // );

    // // const InfoCard = ({ title, children }) => (
    // //   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    // //     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
    // //       <h3 className="text-sm font-bold text-slate-800 capitalize tracking-tight">
    // //         {title}
    // //       </h3>
    // //     </div>
    // //     <div className="p-6 space-y-4">{children}</div>
    // //   </div>
    // // );


    // const InfoCard = ({ title, children, icon: HeaderIcon }) => (
    // <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
    //     {/* Header Section */}
    //     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
    //     <div className="p-1.5 bg-blue-50 rounded-lg">
    //         {HeaderIcon && <HeaderIcon size={16} className="text-blue-600" strokeWidth={2} />}
    //     </div>
    //     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
    //         {title}
    //     </h3>
    //     </div>

    //     {/* Content Area */}
    //     <div className="relative z-10 p-6 space-y-5">
    //     {children}
    //     </div>

    //     {/* Branding/Security Watermark */}
    //     <div className="absolute -bottom-6 -right-6 opacity-[0.04] text-slate-900 pointer-events-none">
    //     {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
    //     </div>
    // </div>
    // );

    // /* UPDATED COMPONENT */
    // const ModernDocCard = ({ title, url, type, formatDocUrl }) => {
    // // Apply the URL transformation here
    // const formattedUrl = formatDocUrl(url);

    // return (
    //     <a
    //     href={formattedUrl}
    //     target="_blank"
    //     rel="noreferrer"
    //     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
    //     >
    //     <div className="flex items-center gap-4">
    //         <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
    //         <FileText size={20} />
    //         </div>
    //         <div>
    //         <p className="text-sm font-bold text-slate-800">{title}</p>
    //         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
    //             {type}
    //         </p>
    //         </div>
    //     </div>
    //     <div className="flex items-center gap-2">
    //         <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
    //         View Document
    //         </span>
    //         <ExternalLink
    //         size={16}
    //         className="text-slate-300 group-hover:text-blue-600"
    //         />
    //     </div>
    //     </a>
    // );
    // };

    // const EmptyState = ({ message }) => (
    // <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
    //     <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
    //     <Shield size={32} />
    //     </div>
    //     <p className="text-slate-500 text-sm font-medium">{message}</p>
    // </div>
    // );

    // const DetailRow = ({ label, value, icon, isSkills = false }) => (
    // <div
    //     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-2`}
    // >
    //     <div className="flex items-center gap-2 text-slate-500">
    //     {icon}
    //     <span className="text-[11px] font-semibold uppercase tracking-wider">
    //         {label}
    //     </span>
    //     </div>

    //     {isSkills ? (
    //     <div className="flex flex-wrap gap-2">
    //         {Array.isArray(value) && value.length > 0 ? (
    //         value.map((skill, i) => (
    //             <span
    //             key={i}
    //             className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
    //             >
    //             {skill}
    //             </span>
    //         ))
    //         ) : (
    //         <span className="text-xs text-slate-400 italic">
    //             No skills listed
    //         </span>
    //         )}
    //     </div>
    //     ) : (
    //     <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
    //     )}
    // </div>
    // );

    // export default CandidateProfilePage;
//***********************************************working phase 1 19/02/26**************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   MapPin,
//   History,
//   User,
//   Briefcase,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     // This removes everything before 'uploads/' and adds your new base URL
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//   if (!experiences || experiences.length === 0) return "0 Months";

//   let totalMonths = 0;
//   experiences.forEach(exp => {
//     const start = new Date(exp.start_date);
//     const end = exp.end_date ? new Date(exp.end_date) : new Date(); // Defaults to today if no end_date
//     const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
//     totalMonths += Math.max(0, diff);
//   });

//   const years = Math.floor(totalMonths / 12);
//   const months = totalMonths % 12;

//   if (years === 0) return `${months} Months`;
//   return `${years} Year${years > 1 ? 's' : ''} ${months > 0 ? `& ${months} Month${months > 1 ? 's' : ''}` : ''}`;
// };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       {/* TOP NAVIGATION BAR */}
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900">{employee?.full_name}</span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN: IDENTITY CARD */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//               <div className="flex flex-col items-center text-center">
//                <div className="relative group mb-6">
//   {/* External Soft Glow Layer */}
//   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>

//   {/* Main Avatar Container */}
//   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">

//       {employee?.profile_image ? (
//         <img
//           src={employee.profile_image}
//           alt={employee?.full_name}
//           loading="lazy"
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//           }}
//         />
//       ) : (
//         /* FALLBACK: Enterprise Personnel Icon */
//         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
//           <User size={42} className="text-slate-500 mb-1" strokeWidth={1.5} />
//           <div className="absolute bottom-3 flex gap-1">
//             <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
//             <div className="h-1 w-1 rounded-full bg-blue-500/40" />
//             <div className="h-1 w-1 rounded-full bg-blue-500/20" />
//           </div>
//         </div>
//       )}

//       {/* Decorative Overlay for a "Digital ID" feel */}
//       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//     </div>

//     {/* Verification Badge (System Active) */}
//     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//       <div className="relative flex h-2.5 w-2.5">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
//       </div>
//     </div>
//   </div>
// </div>
//                 {/* <h1 className="text-2xl font-bold text-slate-900 leading-tight">
//                   {employee?.full_name}
//                 </h1> */}
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
//   {employee?.full_name
//     ? employee.full_name.charAt(0).toUpperCase() + employee.full_name.slice(1)
//     : "Unkown"}
// </h1>
//                 {/* <p className="text-slate-500 font-medium mb-4">
//                   {employee?.position || "Position not set"}
//                 </p> */}
//                 <div className="flex gap-2 mt-2">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
//                       employee?.status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                         : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}
//                   >
//                     {employee?.status || "Pending"}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
//                 <SidebarInfo
//                   icon={<Mail size={16} />}
//                   label="Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone size={16} />}
//                   label="Phone"
//                   value={employee?.phone}
//                 />
//                 <SidebarInfo
//                   icon={<MapPin size={16} />}
//                   label="Location"
//                   value={`${employee?.city}, ${employee?.state}, ${employee?.district} , ${employee?.pincode}`}
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN: TABS AND CONTENT */}
//           <div className="col-span-12 lg:col-span-8">
//             {/* TAB SELECTOR */}
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="General Overview"
//                 icon={<Activity size={18} />}
//               />

//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Documentation"
//                 icon={<FileCheck size={18} />}
//               />
//             </div>

//             {/* TAB CONTENT */}
//             <div className="min-h-[400px]">
//               {/* {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InfoCard title="Personal Details">
//                       <DetailRow
//                         label="Date of Birth"
//                         value={employee?.dob}
//                         icon={<Calendar size={14} />}
//                       />
//                       <DetailRow
//                         label="Gender"
//                         value={employee?.gender}
//                         icon={<Shield size={14} />}
//                       />
//                       <DetailRow
//                         label="Languages"
//                         value={employee?.languages_spoken?.join(", ")}
//                         icon={<Globe size={14} />}
//                       />
//                     </InfoCard>

//                     <InfoCard title="Professional information">

//                       <DetailRow
//                         label="Skills"
//                         value={employee?.skills}
//                         icon={<Briefcase size={14} />}
//                         isSkills={true}
//                       />
//                       <DetailRow
//                         label="Assets"
//                         value={employee?.assets}
//                         icon={<Briefcase size={14} />}
//                         isSkills={true}
//                       />
//                       <div className="my-4 border-t border-slate-50" />{" "}

//                     </InfoCard>
//                   </div>
//                 </div>
//               )} */}

// {/* {activeTab === "overview" && (
//   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//       <InfoCard title="Identity Metadata">
//         <DetailRow
//           label="Date of Birth"
//           value={employee?.dob}
//           icon={<Calendar size={14} />}
//         />
//         <DetailRow
//           label="Gender Mapping"
//           value={employee?.gender}
//           icon={<Shield size={14} />}
//         />
//         <DetailRow
//           label="Linguistic Stack"
//           value={employee?.languages_spoken?.join(", ")}
//           icon={<Globe size={14} />}
//         />
//       </InfoCard>

//       <InfoCard title="Professional Induction">
//         <DetailRow
//           label="Core Proficiency"
//           value={employee?.skills}
//           icon={<Briefcase size={14} />}
//           isSkills={true}
//         />

//         <div className="my-4 border-t border-slate-50" />

//         <DetailRow
//           label="Assigned Department"
//           value={employee?.department || "General Pool"}
//           icon={<Shield size={14} />}
//         />
//       </InfoCard>
//     </div>

//     <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative">

//       <History className="absolute -right-10 -bottom-10 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={250} />

//       <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//             <History size={20} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Professional Audit Trail</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
//                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Career Trajectory Log
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-10 relative z-10">

//         <div className="absolute left-1/2 top-10 bottom-10 w-[1px] bg-slate-100 -translate-x-1/2 hidden md:block" />

//         <div className="space-y-12">
//           {employee?.experiences && employee.experiences.length > 0 ? (
//             employee.experiences.map((exp, i) => (
//               <div key={i} className="relative flex flex-col md:flex-row items-center justify-between md:odd:flex-row-reverse group transition-all duration-500">

//                 <div className="absolute left-1/2 flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-white border-[4px] border-slate-50 text-slate-300 group-hover:border-blue-600 group-hover:text-blue-600 group-hover:shadow-xl group-hover:shadow-blue-100 transition-all duration-500 z-20 -translate-x-1/2 hidden md:flex">
//                   <Briefcase size={18} strokeWidth={2.5} />
//                 </div>

//                 <div className="w-full md:w-[calc(50%-3.5rem)] bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-blue-300 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 relative overflow-hidden group/card">

//                   <FileCheck className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 group-hover/card:text-blue-50 transition-colors duration-500" size={100} />

//                   <div className="relative z-10">
//                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
//                       <div>
//                         <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-blue-100">
//                           {exp?.job_title || "Position Undefined"}
//                         </div>
//                         <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
//                           {exp?.company_name || "Entity Unnamed"}
//                         </h4>
//                       </div>

//                       {exp?.experience_letter_path && (
//                         <a
//                           href={formatDocUrl(exp.experience_letter_path)}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95 group/btn"
//                         >
//                           <FileText size={14} />
//                           Artifact
//                           <ExternalLink size={12} className="opacity-50 group-hover/btn:translate-x-0.5 transition-transform" />
//                         </a>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 mb-6">
//                       <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Induction Period</p>
//                         <p className="text-[11px] font-bold text-slate-700 uppercase">
//                           {exp?.start_date ? new Date(exp.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '---'} — {exp?.end_date ? new Date(exp.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Present'}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Final Compensation</p>
//                         <div className="flex items-center gap-1.5">
//                           <span className="text-blue-600 font-black text-[11px]">₹</span>
//                           <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
//                             {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Disclosed"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {exp?.description ? (
//                       <div className="bg-white border-l-4 border-blue-500 pl-4 py-1 mb-6">
//                         <p className="text-[12px] text-slate-600 font-medium leading-relaxed italic">
//                           "{exp.description}"
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-6 italic">No execution notes provided</p>
//                     )}

//                     <div className="flex items-center gap-2.5 pt-5 border-t border-slate-50">
//                       <MapPin size={14} className="text-slate-300" />
//                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Deployment: {exp?.location || "Remote/Global"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="hidden md:flex flex-col items-center w-[calc(50%-3.5rem)] px-10">
//                    <div className="text-3xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-500">
//                      {exp?.start_date ? new Date(exp.start_date).getFullYear() : '----'}
//                    </div>
//                    <div className="h-1 w-8 bg-slate-100 group-hover:bg-blue-200 transition-colors mt-2 rounded-full" />
//                 </div>

//               </div>
//             ))
//           ) : (

//             <div className="py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 animate-in fade-in duration-1000">
//               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100 mb-6">
//                 <Database size={32} strokeWidth={1.5} />
//               </div>
//               <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">No Professional Data</h4>
//               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Candidate has not yet provided experience artifacts</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="px-10 py-5 bg-slate-900 border-t border-slate-800 text-center relative overflow-hidden">
//         <div className="absolute inset-0 bg-blue-600 opacity-5" />
//         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] relative z-10">
//           End of verified career trajectory record • ID: {id}
//         </p>
//       </div>
//     </div>
//   </div>
// )} */}

// {activeTab === "overview" && (
//   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//       <InfoCard title="Personal Information">
//         <DetailRow
//           label="Date of Birth"
//           value={employee?.dob}
//           icon={<Calendar size={14} />}
//         />
//         <DetailRow
//           label="Gender "
//           value={employee?.gender}
//           icon={<Shield size={14} />}
//         />
//         <DetailRow
//           label="language"
//           value={employee?.languages_spoken?.join(", ")}
//           icon={<Globe size={14} />}
//         />
//       </InfoCard>

//       <InfoCard title="Professional Information">
//         <DetailRow
//           label="Skill"
//           value={employee?.skills || "-"}
//           icon={<Briefcase size={14} />}
//           isSkills={true}
//         />

//         <div className="my-4 border-t border-slate-50" />

//         <DetailRow
//           label="Assets"
//           value={employee?.assets || "-"}
//           icon={<Shield size={14} />}
//              isSkills={true}
//         />
//       </InfoCard>
//     </div>

//     <div>
//         <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative">
//   <History
//     className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none"
//     size={200}
//   />

//   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//     <div className="flex items-center gap-3">
//       <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <History size={18} strokeWidth={2.5} />
//       </div>

//       <div>
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//           Candidate
//         </h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//          Previous History
//         </p>
//       </div>
//     </div>

//     {/* TENURE COUNTER */}
//     <div className="flex items-center gap-3">
//       <div className="flex flex-col items-end">
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//           Total Experiance
//         </span>
//         <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//           {calculateTotalExperience(employee?.experiences)}
//         </span>
//       </div>

//       <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
//           Active Stream
//         </span>
//       </div>
//     </div>
//   </div>

//   {/* BODY */}
//   <div className="relative z-10">
//     {employee?.experiences && employee.experiences.length > 0 ? (
//       <div className="divide-y divide-slate-100">
//         {employee.experiences.map((exp, i) => (
//           <div
//             key={i}
//             className="group hover:bg-slate-50/40 transition-colors duration-300"
//           >
//             <div className="flex flex-col md:flex-row p-8 gap-8">

//               {/* TIME IDENTIFIER */}
//               <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                 <span className="text-xl font-black text-slate-900 tracking-tighter">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).getFullYear()
//                     : "----"}
//                 </span>

//                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                         month: "short",
//                       })
//                     : "---"}{" "}
//                   DEPLOYMENT
//                 </span>
//               </div>

//               {/* CONTENT BODY */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                         {exp?.company_name || "Unidentified Entity"}
//                       </h4>
//                       <span className="h-1 w-1 rounded-full bg-slate-300" />
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                         {exp?.location || "Global Node"}
//                       </span>
//                     </div>

//                     <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                       {exp?.job_title || "Role Undefined"}
//                     </p>
//                   </div>

//                   {exp?.experience_letter_path && (
//                     <a
//                       href={formatDocUrl(exp.experience_letter_path)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                     >
//                       <FileText
//                         size={14}
//                         className="text-slate-400 group-hover/artifact:text-blue-500"
//                       />
//                      Experience Letter
//                       <ExternalLink size={10} className="opacity-40" />
//                     </a>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                      Previous  CTC
//                     </span>

//                     <div className="flex items-center gap-1.5">
//                       <span className="text-blue-600 font-black text-[10px]">
//                         ₹
//                       </span>
//                       <span className="text-[11px] font-bold text-slate-700">
//                         {exp?.previous_ctc
//                           ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                           : "Not Logged"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Duration
//                     </span>

//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                       {exp?.start_date
//                         ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "---"}{" "}
//                       -{" "}
//                       {exp?.end_date
//                         ? new Date(exp.end_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "Present"}
//                     </span>
//                   </div>
//                 </div>

//                 {exp?.description && (
//                   <div className="max-w-3xl">
//                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                       "{exp.description}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//           <Database size={28} strokeWidth={1.5} />
//         </div>

//         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//            Fresher Profile
//         </h4>

//         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//          No prior professional experience recorded
//         </p>
//       </div>
//     )}
//   </div>

// </div>

//     </div>

//   </div>
// )}

//               {/* {activeTab === "vault" && (
//                 <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

//                   {employee?.resume_path && (
//                     <ModernDocCard
//                       title="Primary Resume"
//                       url={employee.resume_path}
//                       type="PDF"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   )}

//                   {employee?.experiences?.map(
//                     (exp) =>
//                       exp.experience_letter_path && (
//                         <ModernDocCard
//                           key={exp.id}
//                           title={`${exp.company_name} Experience Letter`}
//                           url={exp.experience_letter_path}
//                           type="Experience"
//                           formatDocUrl={formatDocUrl}
//                         />
//                       ),
//                   )}

//                   {employee?.certificates?.map((cert) => (
//                     <ModernDocCard
//                       key={cert.id}
//                       title={cert.name}
//                       url={cert.file_path}
//                       type="Certificate"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   ))}
//                 </div>
//               )} */}

//               {activeTab === "vault" && (
//   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

//     {/* SECTION 1: MASTER IDENTITY DOCUMENTS */}
//     <div className="space-y-4">
//       <div className="flex items-center gap-3 px-2">
//         <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Identity Node</h3>
//       </div>

//       {employee?.resume_path ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <ModernDocCard
//             title="Candidate Resume"
//             url={employee.resume_path}
//             type="employee"
//             formatDocUrl={formatDocUrl}
//           />
//         </div>
//       ) : (
//         <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Resume not updated</p>
//         </div>
//       )}
//     </div>

//     {/* SECTION 2: SERVICE & TENURE VERIFICATION */}
//     {/* <div className="space-y-4">
//       <div className="flex items-center gap-3 px-2">
//         <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
//         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tenure Verification Artifacts</h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {employee?.experiences?.filter(exp => exp.experience_letter_path).length > 0 ? (
//           employee.experiences.map((exp) => exp.experience_letter_path && (
//             <ModernDocCard
//               key={exp.id}
//               title={`${exp.company_name} Relieving`}
//               url={exp.experience_letter_path}
//               type="EXPERIENCE_AUDIT"
//               formatDocUrl={formatDocUrl}
//             />
//           ))
//         ) : (
//           <div className="col-span-full p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Experience Artifacts Registered</p>
//           </div>
//         )}
//       </div>
//     </div> */}

//     {/* SECTION 3: ACADEMIC & SKILL CERTIFICATIONS */}
//     <div className="space-y-4">
//       <div className="flex items-center gap-3 px-2">
//         <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
//         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Certifications</h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {employee?.certificates?.length > 0 ? (
//           employee.certificates.map((cert) => (
//             <ModernDocCard
//               key={cert.id}
//               title={cert.name}
//               url={cert.file_path}
//               type="COMPLIANCE_CERT"
//               formatDocUrl={formatDocUrl}
//             />
//           ))
//         ) : (
//           <div className="col-span-full p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No External Credentials Found</p>
//           </div>
//         )}
//       </div>
//     </div>

//     {/* SYSTEM FOOTER WATERMARK */}
//     <div className="pt-10 border-t border-slate-100 flex justify-center">
//       <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
//         <ShieldCheck size={12} className="text-slate-400" />
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Artifact Vault v4.2.0</span>
//       </div>
//     </div>
//   </div>
// )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
//     <p className="text-sm font-medium text-slate-500 animate-pulse">
//       Initializing Candidate Data...
//     </p>
//   </div>
// );

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-semibold text-slate-700 break-all">
//         {value || "Not provided"}
//       </span>
//     </div>
//   </div>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-500 hover:text-slate-700"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const InfoCard = ({ title, children }) => (
//   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
//       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//         {title}
//       </h3>
//     </div>
//     <div className="p-6 space-y-4">{children}</div>
//   </div>
// );

// /* UPDATED COMPONENT */
// const ModernDocCard = ({ title, url, type, formatDocUrl }) => {
//   // Apply the URL transformation here
//   const formattedUrl = formatDocUrl(url);

//   return (
//     <a
//       href={formattedUrl}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
//     >
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//           <FileText size={20} />
//         </div>
//         <div>
//           <p className="text-sm font-bold text-slate-800">{title}</p>
//           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
//             {type}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
//           View Document
//         </span>
//         <ExternalLink
//           size={16}
//           className="text-slate-300 group-hover:text-blue-600"
//         />
//       </div>
//     </a>
//   );
// };

// const EmptyState = ({ message }) => (
//   <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
//     <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
//       <Shield size={32} />
//     </div>
//     <p className="text-slate-500 text-sm font-medium">{message}</p>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-2`}
//   >
//     <div className="flex items-center gap-2 text-slate-500">
//       {icon}
//       <span className="text-[11px] font-semibold uppercase tracking-wider">
//         {label}
//       </span>
//     </div>

//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {Array.isArray(value) && value.length > 0 ? (
//           value.map((skill, i) => (
//             <span
//               key={i}
//               className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
//             >
//               {skill}
//             </span>
//           ))
//         ) : (
//           <span className="text-xs text-slate-400 italic">
//             No skills listed
//           </span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
//     )}
//   </div>
// );

// export default CandidateProfilePage;
//******************************************************working cdoe phase 1 19/02/26********************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   MapPin,
//   Briefcase,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     // This removes everything before 'uploads/' and adds your new base URL
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       {/* TOP NAVIGATION BAR */}
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900">{employee?.full_name}</span>
//             </nav>
//           </div>

//           {/* <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
//               <Download size={16} /> Export PDF
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all">
//               <Edit3 size={16} /> Edit Profile
//             </button>
//           </div> */}
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN: IDENTITY CARD */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-100">
//                   {employee?.full_name?.charAt(0)}
//                 </div>
//                 <h1 className="text-2xl font-bold text-slate-900 leading-tight">
//                   {employee?.full_name}
//                 </h1>
//                 <p className="text-slate-500 font-medium mb-4">
//                   {employee?.position || "Position not set"}
//                 </p>
//                 <div className="flex gap-2">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
//                       employee?.status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                         : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}
//                   >
//                     {employee?.status || "Pending"}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
//                 <SidebarInfo
//                   icon={<Mail size={16} />}
//                   label="Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone size={16} />}
//                   label="Phone"
//                   value={employee?.phone}
//                 />
//                 <SidebarInfo
//                   icon={<MapPin size={16} />}
//                   label="Location"
//                   value={`${employee?.city}, ${employee?.state}, ${employee?.district} , ${employee?.pincode}`}
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN: TABS AND CONTENT */}
//           <div className="col-span-12 lg:col-span-8">
//             {/* TAB SELECTOR */}
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="General Overview"
//                 icon={<Activity size={18} />}
//               />
//               {/* <TabButton
//                 active={activeTab === "infrastructure"}
//                 onClick={() => setActiveTab("infrastructure")}
//                 label="Assets & Tools"
//                 icon={<Monitor size={18} />}
//               /> */}
//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Documentation"
//                 icon={<FileCheck size={18} />}
//               />
//             </div>

//             {/* TAB CONTENT */}
//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InfoCard title="Personal Details">
//                       <DetailRow
//                         label="Date of Birth"
//                         value={employee?.dob}
//                         icon={<Calendar size={14} />}
//                       />
//                       <DetailRow
//                         label="Gender"
//                         value={employee?.gender}
//                         icon={<Shield size={14} />}
//                       />
//                       <DetailRow
//                         label="Languages"
//                         value={employee?.languages_spoken?.join(", ")}
//                         icon={<Globe size={14} />}
//                       />
//                     </InfoCard>

//                     {/* <InfoCard title="Professional Setup">
//                       <DetailRow
//                         label="Skills"
//                         value={employee?.skills?.join(", ")}
//                         icon={<Briefcase size={14} />}
//                       />
//                       <DetailRow
//                         label="Pincode"
//                         value={employee?.pincode}
//                         icon={<MapPin size={14} />}
//                       />
//                       <DetailRow label="District" value={employee?.district} />
//                     </InfoCard> */}
//                     <InfoCard title="Professional information">
//   {/* SKILLS SECTION WITH CHIPS */}
//   <DetailRow
//     label="Skills"
//     value={employee?.skills}
//     icon={<Briefcase size={14} />}
//     isSkills={true}
//   />

//    <DetailRow
//     label="Assets"
//     value={employee?.assets}
//     icon={<Briefcase size={14} />}
//     isSkills={true}
//   />
//   <div className="my-4 border-t border-slate-50" /> {/* Visual Separator */}

//   {/* <DetailRow
//     label="Pincode"
//     value={employee?.pincode}
//     icon={<MapPin size={14} />}
//   />

//   <DetailRow
//     label="District"
//     value={employee?.district}
//     icon={<Shield size={14} />}
//   /> */}
// </InfoCard>
//                   </div>
//                 </div>
//               )}
// {/*
//               {activeTab === "infrastructure" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   {employee?.assets?.length > 0 ? (
//                     employee.assets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors"
//                       >
//                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4">
//                           <Monitor size={20} />
//                         </div>
//                         <span className="font-semibold text-slate-700">
//                           {asset}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <EmptyState message="No assets assigned to this candidate." />
//                   )}
//                 </div>
//               )} */}

//               {/* {activeTab === "vault" && (
//                 <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   {employee?.resume_path && <ModernDocCard title="Primary Resume" url={employee.resume_path} type="PDF" />}
//                   {employee?.experiences?.map(exp => exp.experience_letter_path && (
//                     <ModernDocCard key={exp.id} title={`${exp.company_name} Experience Letter`} url={exp.experience_letter_path} type="Experience" />
//                   ))}
//                   {employee?.certificates?.map(cert => (
//                     <ModernDocCard key={cert.id} title={cert.name} url={cert.file_path} type="Certificate" />
//                   ))}
//                 </div>
//               )} */}

//               {activeTab === "vault" && (
//                 <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   {/* Resume */}
//                   {employee?.resume_path && (
//                     <ModernDocCard
//                       title="Primary Resume"
//                       url={employee.resume_path}
//                       type="PDF"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   )}

//                   {/* Experience Letters */}
//                   {employee?.experiences?.map(
//                     (exp) =>
//                       exp.experience_letter_path && (
//                         <ModernDocCard
//                           key={exp.id}
//                           title={`${exp.company_name} Experience Letter`}
//                           url={exp.experience_letter_path}
//                           type="Experience"
//                           formatDocUrl={formatDocUrl}
//                         />
//                       ),
//                   )}

//                   {/* Certificates */}
//                   {employee?.certificates?.map((cert) => (
//                     <ModernDocCard
//                       key={cert.id}
//                       title={cert.name}
//                       url={cert.file_path}
//                       type="Certificate"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
//     <p className="text-sm font-medium text-slate-500 animate-pulse">
//       Initializing Secure Environment...
//     </p>
//   </div>
// );

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-semibold text-slate-700 break-all">
//         {value || "Not provided"}
//       </span>
//     </div>
//   </div>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-500 hover:text-slate-700"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const InfoCard = ({ title, children }) => (
//   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
//       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//         {title}
//       </h3>
//     </div>
//     <div className="p-6 space-y-4">{children}</div>
//   </div>
// );

// // const DetailRow = ({ label, value, icon }) => (
// //   <div className="flex items-start justify-between">
// //     <div className="flex items-center gap-2 text-slate-500">
// //       {icon} <span className="text-xs font-medium">{label}</span>
// //     </div>
// //     <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
// //   </div>
// // );

// // const ModernDocCard = ({ title, url, type }) => (
// //   <a
// //     href={url} target="_blank" rel="noreferrer"
// //     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
// //   >
// //     <div className="flex items-center gap-4">
// //       <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
// //         <FileText size={20} />
// //       </div>
// //       <div>
// //         <p className="text-sm font-bold text-slate-800">{title}</p>
// //         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{type}</p>
// //       </div>
// //     </div>
// //     <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
// //   </a>
// // );

// /* UPDATED COMPONENT */
// const ModernDocCard = ({ title, url, type, formatDocUrl }) => {
//   // Apply the URL transformation here
//   const formattedUrl = formatDocUrl(url);

//   return (
//     <a
//       href={formattedUrl}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
//     >
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//           <FileText size={20} />
//         </div>
//         <div>
//           <p className="text-sm font-bold text-slate-800">{title}</p>
//           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
//             {type}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
//           View Document
//         </span>
//         <ExternalLink
//           size={16}
//           className="text-slate-300 group-hover:text-blue-600"
//         />
//       </div>
//     </a>
//   );
// };

// const EmptyState = ({ message }) => (
//   <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
//     <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
//       <Shield size={32} />
//     </div>
//     <p className="text-slate-500 text-sm font-medium">{message}</p>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-2`}>
//     <div className="flex items-center gap-2 text-slate-500">
//       {icon}
//       <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
//     </div>

//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {Array.isArray(value) && value.length > 0 ? (
//           value.map((skill, i) => (
//             <span
//               key={i}
//               className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
//             >
//               {skill}
//             </span>
//           ))
//         ) : (
//           <span className="text-xs text-slate-400 italic">No skills listed</span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
//     )}
//   </div>
// );

// export default CandidateProfilePage;
//********************************************************************************************************************* */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor,
//   FileCheck, FileText, ShieldCheck, Activity, MapPin,
//   Briefcase, ExternalLink
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`
//         );
//         const data = await res.json();

//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen font-black uppercase text-slate-400 animate-pulse tracking-widest text-xs">
//         Node_Retrieval_In_Progress
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900">

//       {/* HEADER */}
//       <div className="bg-slate-50/50 border-b pt-8 pb-0">
//         <div className="max-w-[1400px] mx-auto px-8">

//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">

//             <div className="flex items-start gap-6">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="mt-1 p-2 bg-white border rounded-xl hover:shadow-md"
//               >
//                 <ArrowLeft size={18} />
//               </button>

//               <div>
//                 <div className="flex items-center gap-2 mb-1.5">
//                   <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase">
//                     Candidate
//                   </span>

//                   <span className="text-[10px] font-bold text-slate-400 uppercase">
//                     ID-{employee?.id}
//                   </span>
//                 </div>

//                 <h1 className="text-4xl font-black tracking-tighter uppercase italic">
//                   {employee?.full_name}
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center gap-8 pb-1">
//               <StatNode label="Status" val={employee?.status} />
//               <StatNode label="Position" val={employee?.position} />
//               <StatNode label="City" val={employee?.city} />
//             </div>

//           </div>

//           {/* TABS */}
//           <div className="flex gap-1 overflow-x-auto">

//             <NavSegment
//               active={activeTab === "overview"}
//               onClick={() => setActiveTab("overview")}
//               label="Overview"
//               icon={<Activity size={14} />}
//             />

//             <NavSegment
//               active={activeTab === "infrastructure"}
//               onClick={() => setActiveTab("infrastructure")}
//               label="Assets"
//               icon={<Monitor size={14} />}
//             />

//             <NavSegment
//               active={activeTab === "vault"}
//               onClick={() => setActiveTab("vault")}
//               label="Documents"
//               icon={<FileCheck size={14} />}
//             />
//           </div>
//         </div>
//       </div>

//       {/* MAIN */}
//       <main className="max-w-[1400px] mx-auto px-8 py-12">

//         {/* OVERVIEW */}
//         {activeTab === "overview" && (
//           <div className="grid grid-cols-12 gap-10">

//             <div className="col-span-12 lg:col-span-8 space-y-10">

//               <div className="grid grid-cols-3 gap-6">
//                 <ValueBlock
//                   label="Email"
//                   val={employee?.email}
//                   icon={<Mail size={16} />}
//                 />

//                 <ValueBlock
//                   label="Phone"
//                   val={employee?.phone}
//                   icon={<Smartphone size={16} />}
//                 />

//                 <ValueBlock
//                   label="Skills"
//                   val={employee?.skills?.join(", ")}
//                   icon={<Briefcase size={16} />}
//                 />
//               </div>

//               <div>
//                 <h4 className="text-[11px] font-black uppercase text-slate-400 border-b pb-3">
//                   Personal Info
//                 </h4>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 mt-6">
//                   <GhostField label="DOB" val={employee?.dob} />
//                   <GhostField label="Gender" val={employee?.gender} />
//                   <GhostField
//                     label="Languages"
//                     val={employee?.languages_spoken?.join(", ")}
//                   />
//                   <GhostField label="State" val={employee?.state} />
//                   <GhostField label="District" val={employee?.district} />
//                   <GhostField label="Pincode" val={employee?.pincode} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ASSETS */}
//         {activeTab === "infrastructure" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {employee?.assets?.map((asset, i) => (
//               <div
//                 key={i}
//                 className="p-6 bg-slate-50 border rounded-2xl flex items-center gap-3"
//               >
//                 <Monitor size={18} className="text-blue-600" />
//                 <span className="font-bold">{asset}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* DOCUMENTS */}
//         {activeTab === "vault" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             {/* Resume */}
//             {employee?.resume_path && (
//               <DocCard title="Resume" url={employee.resume_path} />
//             )}

//             {/* Experience Letters */}
//             {employee?.experiences?.map(
//               (exp) =>
//                 exp.experience_letter_path && (
//                   <DocCard
//                     key={exp.id}
//                     title={`${exp.company_name} Experience Letter`}
//                     url={exp.experience_letter_path}
//                   />
//                 )
//             )}

//             {/* Certificates */}
//             {employee?.certificates?.map((cert) => (
//               <DocCard key={cert.id} title={cert.name} url={cert.file_path} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// /* COMPONENTS */

// const StatNode = ({ label, val }) => (
//   <div className="flex flex-col items-end">
//     <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
//     <p className="text-xs font-black uppercase">{val || "Pending"}</p>
//   </div>
// );

// const NavSegment = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className="px-6 py-4 flex gap-2 items-center">
//     <span className={active ? "text-blue-600" : "text-slate-400"}>
//       {icon}
//     </span>
//     <span className="text-[11px] font-black uppercase">{label}</span>
//   </button>
// );

// const ValueBlock = ({ label, val, icon }) => (
//   <div className="p-6 border rounded-3xl shadow-sm">
//     <div className="flex items-center gap-3 mb-4">
//       <div className="p-2 bg-slate-50 rounded-xl text-blue-600">{icon}</div>
//       <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
//     </div>
//     <p className="text-sm font-black">{val || "—"}</p>
//   </div>
// );

// const GhostField = ({ label, val }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
//     <p className="text-sm font-bold">{val || "Not Set"}</p>
//   </div>
// );

// const DocCard = ({ title, url }) => (
//   <a
//     href={url}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-6 bg-white border rounded-3xl shadow-sm hover:border-blue-600"
//   >
//     <div className="flex items-center gap-4">
//       <FileText size={20} />
//       <span className="text-[11px] font-black uppercase">{title}</span>
//     </div>
//     <ExternalLink size={14} />
//   </a>
// );

// export default CandidateProfilePage;

//*********************************************************working code phase 1************************************************************ */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import {
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor,
//   FileCheck, FileText, ShieldCheck, Activity, MapPin, Lock,
//   Briefcase, Calendar, ChevronRight, ExternalLink, Hash, Info
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchFullProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await employeeKycService.getFull(id);
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullProfile();
//   }, [id]);

//   if (loading) return <div className="flex items-center justify-center min-h-screen font-black uppercase text-slate-400 animate-pulse tracking-widest text-xs">Node_Retrieval_In_Progress</div>;

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">

//       {/* 01. INTEGRATED SYSTEM HEADER */}
//       <div className="bg-slate-50/50 border-b border-slate-100 pt-8 pb-0">
//         <div className="max-w-[1400px] mx-auto px-8">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
//             <div className="flex items-start gap-6">
//               <button onClick={() => navigate(-1)} className="mt-1 p-2 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
//                 <ArrowLeft size={18} />
//               </button>
//               <div>
//                 <div className="flex items-center gap-2 mb-1.5">
//                   <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-widest">Employee</span>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{employee?.employee_code}</span>
//                 </div>
//                 <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
//                   {employee?.full_name}
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center gap-8 pb-1">
//                <StatNode label="Employment" val={employee?.status} color="text-emerald-500" />
//                <StatNode label="Assignment" val={employee?.role} />
//                <StatNode label="Node" val={employee?.address?.current_city} />
//             </div>
//           </div>

//           {/* 02. SEGMENTED TAB NAVIGATOR (Linear Style) */}
//           <div className="flex items-center gap-1 border-b border-transparent overflow-x-auto no-scrollbar">
//             <NavSegment active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" icon={<Activity size={14}/>} />
//             <NavSegment active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} label="Identity Registry" icon={<Fingerprint size={14}/>} />
//             <NavSegment active={activeTab === "infrastructure"} onClick={() => setActiveTab("infrastructure")} label="Assets & Hardware" icon={<Monitor size={14}/>} />
//             <NavSegment active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Documentation" icon={<FileCheck size={14}/>} />
//           </div>
//         </div>
//       </div>

//       {/* 03. MAIN STAGE */}
//       <main className="max-w-[1400px] mx-auto px-8 py-12">

//         {/* TAB: OVERVIEW */}
//         {activeTab === "overview" && (
//           <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
//             {/* Core Metrics */}
//             <div className="col-span-12 lg:col-span-8 space-y-10">
//                <div className="grid grid-cols-3 gap-6">
//                   <ValueBlock label="Communications" val={employee.email} icon={<Mail size={16}/>} />
//                   <ValueBlock label="Contact" val={employee.phone} icon={<Smartphone size={16}/>} />
//                   <ValueBlock label="Offered CTC" val={`₹${employee.offered_ctc?.toLocaleString()}`} icon={<TrendingUp size={16}/>} />
//                </div>

//                <div className="space-y-6">
//                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-3">Deployment Schedule</h4>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
//                      <GhostField label="Probation Start" val={employee.probation_start_date} />
//                      <GhostField label="Probation End" val={employee.probation_end_date} />
//                      <GhostField label="Confirmation" val={employee.confirmation_date} />
//                      <GhostField label="Actual Joining" val={employee.actual_joining_date} />
//                   </div>
//                </div>
//             </div>

//             {/* Reporting Context Sidebar */}
//             <div className="col-span-12 lg:col-span-4">
//                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
//                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Matrix</h4>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 shadow-sm">
//                       {employee.reporting_manager_name?.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-xs font-black text-slate-900 uppercase">{employee.reporting_manager_name}</p>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase">Reporting Head</p>
//                     </div>
//                   </div>
//                </div>
//             </div>
//           </div>
//         )}

//         {/* TAB: KYC */}
//         {activeTab === "kyc" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
//              <RegistrySlate label="Aadhaar UID" val={employee.kyc?.aadhaar_number} status={employee.kyc?.aadhaar_status} />
//              <RegistrySlate label="PAN Inventory" val={employee.kyc?.pan_number} status={employee.kyc?.pan_status} />
//              <RegistrySlate label="IFSC Protocol" val={employee.kyc?.ifsc_code} status={employee.kyc?.bank_status} />
//              <RegistrySlate label="Settlement Index" val={employee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={employee.kyc?.bank_status} />
//           </div>
//         )}

//         {/* TAB: INFRASTRUCTURE */}
//         {activeTab === "infrastructure" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
//              {employee.assets?.map(asset => (
//                <div key={asset.id} className="group p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
//                   <div className="flex justify-between items-start mb-6">
//                     <div className="flex gap-4">
//                       <div className="p-3 bg-white rounded-2xl border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform shadow-sm"><Monitor size={20}/></div>
//                       <div>
//                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{asset.asset_category}</p>
//                         <h5 className="text-lg font-black text-slate-800 leading-none mt-1">{asset.asset_name}</h5>
//                       </div>
//                     </div>
//                     <span className="text-[10px] font-mono font-bold text-slate-400">{asset.serial_number}</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200/50">
//                     {asset.images?.map((img, i) => (
//                       <img key={i} src={`https://apihrr.goelectronix.co.in${img}`} className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer" alt="asset" />
//                     ))}
//                   </div>
//                </div>
//              ))}
//           </div>
//         )}

//         {/* TAB: VAULT */}
//         {activeTab === "vault" && (
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-500">
//              {employee.documents?.map(doc => (
//                <a key={doc.id} href={doc.document_path} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 transition-all shadow-sm group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors"><FileText size={20} className="text-slate-400 group-hover:text-blue-600"/></div>
//                     <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight leading-tight">{doc.document_type.replace(/_/g, " ")}</span>
//                   </div>
//                   <ExternalLink size={14} className="text-slate-200 group-hover:text-blue-600 transition-all" />
//                </a>
//              ))}
//            </div>
//         )}

//       </main>
//     </div>
//   );
// };

// /* --- ENTERPRISE SLATE SUB-COMPONENTS --- */

// const StatNode = ({ label, val, color }) => (
//   <div className="flex flex-col items-end">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
//     <p className={`text-xs font-black uppercase tracking-widest ${color || 'text-slate-900'}`}>{val || "Pending"}</p>
//   </div>
// );

// const NavSegment = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2.5 px-6 py-4 transition-all relative group`}
//   >
//     <span className={`transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
//     <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{label}</span>
//     {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.4)]" />}
//   </button>
// );

// const ValueBlock = ({ label, val, icon }) => (
//   <div className="p-6 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
//     <div className="flex items-center gap-3 mb-4">
//       <div className="p-2 bg-slate-50 rounded-xl text-blue-600">{icon}</div>
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//     </div>
//     <p className="text-sm font-black text-slate-900 truncate">{val || "—"}</p>
//   </div>
// );

// const GhostField = ({ label, val }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
//     <p className="text-sm font-bold text-slate-700">{val || "Not_Set"}</p>
//   </div>
// );

// const RegistrySlate = ({ label, val, status }) => (
//   <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
//     <div className="space-y-1">
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//       <p className="text-sm font-black text-slate-800 font-mono tracking-[0.1em]">{val || "--- --- ---"}</p>
//     </div>
//     <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${status === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
//        <div className={`w-1.5 h-1.5 rounded-full ${status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
//        {status || "Pending"}
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
