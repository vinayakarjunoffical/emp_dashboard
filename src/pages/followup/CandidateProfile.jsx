import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  MapPin,
  Edit3,
  X,
  Save,
  ArrowLeft,
  Building2,
  Smartphone,
  Globe,
  ChevronRight,
  ShieldCheck,
  Activity,
  Fingerprint,
  Calendar,
  FileText,
  Download,
  Clock,
  Award,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Star,
  Users,
  MessageSquare,
  Hash,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [interviews, setInterviews] = useState([]);

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    mode: "online",
    location: "",
    interviewerName: "",
    interviewerRole: "",
    notes: "",
  });
const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
const [selectedInterview, setSelectedInterview] = useState(null);
const [feedbackData, setFeedbackData] = useState({
  technicalScore: 5,
  culturalFit: 5,
  softSkills: 5,
  comments: "",
  recommendation: "hire" // hire, strong_hire, no_hire
});
  const [candidate, setCandidate] = useState({
    id: id || "CAN-8821",
    name: "Arjun Mehta",
    email: "arjun.m@tech-global.com",
    phone: "+91 98765 43210",
    position: "Senior Frontend Lead",
    experience: "6 Years",
    education: "B.Tech Computer Science",
    status: "Verified",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      address: "124, Skyline Towers, Andheri East",
    },
    bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
  });

  const [formData, setFormData] = useState({ ...candidate });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const handleScheduleSubmit = () => {
  //   const data = {
  //     ...scheduleForm,
  //     candidateId: candidate.id,
  //     createdAt: new Date().toISOString(),
  //   };

  //   setSavedSchedule(data);   // ✅ Save interview details
  //   setIsScheduled(true);

  //   // optional toast / UI reset
  //   setTimeout(() => setIsScheduled(false), 3000);
  // };

  const handleScheduleSubmit = () => {
    const data = {
      ...scheduleForm,
      candidateId: candidate.id,
      round: interviews.length + 1,
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    };

    setInterviews((prev) => [...prev, data]); // ✅ Store multiple interviews
    setIsScheduled(true);

    setScheduleForm({
      date: "",
      time: "",
      mode: "online",
      location: "",
      interviewerName: "",
      interviewerRole: "",
      notes: "",
    });

    setTimeout(() => setIsScheduled(false), 3000);
  };

  // Function to handle feedback submission
const handleFeedbackSubmit = () => {
  setInterviews(prev => prev.map(i => 
    i.id === selectedInterview.id ? { ...i, status: "Completed", feedback: feedbackData } : i
  ));
  setIsFeedbackModalOpen(false);
  // Reset feedback data
  setFeedbackData({ technicalScore: 5, culturalFit: 5, softSkills: 5, comments: "", recommendation: "hire" });
};

  const handleSave = () => {
    setCandidate(formData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased">
      {/* 01. GLOBAL TOP NAVIGATION */}
      <nav className="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95 text-gray-500 group"
          >
            <ArrowLeft size={18} className="group-hover:text-gray-900" />
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">
              Talent Pipeline
            </span>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
              Profile {candidate.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
            {candidate.status}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-8">
        {/* 02. PROFILE HERO SECTION */}
        <section className="bg-white border border-gray-200 rounded-[24px] p-10 mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400" />

          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-[#111827] flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                {candidate.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
                <Fingerprint size={16} className="text-indigo-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {candidate.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
                <HeroMeta
                  icon={<MapPin size={14} />}
                  text={candidate.location.city}
                />
                <HeroMeta
                  icon={<Calendar size={14} />}
                  text="Member since 2026"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <Edit3 size={16} /> Edit Attributes
          </button>
        </section>

        <div className="grid grid-cols-12 gap-10">
          {/* 03. SIDEBAR NAVIGATION */}
          <aside className="col-span-12 lg:col-span-3 space-y-2">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<User size={18} />}
              label="Overview"
            />
            <TabButton
              active={activeTab === "professional"}
              onClick={() => setActiveTab("professional")}
              icon={<Briefcase size={18} />}
              label="Career History"
            />
            {/* NEW TAB BUTTON */}
            <TabButton
              active={activeTab === "interview"}
              onClick={() => setActiveTab("interview")}
              icon={<Calendar size={18} />}
              label="Schedule Interview"
            />
            {/* <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={<Activity size={18}/>} label="Audit Logs" /> */}

            <div className="mt-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">
                Vulnerability Score
              </h4>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-indigo-900 leading-none">
                  94
                </span>
                <span className="text-sm font-semibold text-indigo-400">
                  /100
                </span>
              </div>
              <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
              </div>
            </div>
          </aside>

          {/* 04. CONTENT ENGINE */}
          <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
            {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

            {/* --- ACTION TRIGGER BANNER --- */}
<div className="mt-10 animate-in fade-in zoom-in-95 duration-500 mx-3">
  <div className="bg-slate-900 rounded-[24px] p-1.5 shadow-2xl shadow-indigo-200/20">
    <div className="flex items-center justify-between pl-6 pr-1.5 py-2">
      
      {/* Left side: Strategic Message */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
          <Mail size={18} className="text-indigo-400" />
        </div>
        <div className="flex flex-col">
          <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Manual Protocol Override</h4>
          <p className="text-[10px] text-slate-400 font-medium">
            Need to adjust the workflow? You can manually trigger invitations or <span className="text-indigo-400 font-bold">finalize the dossier</span> here.
          </p>
        </div>
      </div>

      {/* Right side: The Trigger */}
      <button 
        onClick={() => setIsDecisionModalOpen(true)}
        className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-indigo-50 text-slate-900 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group"
      >
        Executive Action
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
      
    </div>
  </div>
</div>

            {activeTab === "overview" && (
              <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mt-10 space-y-6 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
                      <Activity size={14} /> Global Interview Registry
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {interviews.length} Scheduled
                    </span>
                  </div>

                  {interviews.length > 0 ? (
                    <div className="space-y-4 mb-4">
                      {interviews.map((i, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                        >
                          {/* Status Accent Bar */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />

                          <div className="flex flex-col lg:flex-row justify-between gap-6">
                            <div className="flex items-start gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Calendar size={18} />
                                <span className="text-[10px] font-black mt-1 uppercase">
                                  RD {i.round}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold text-gray-900">
                                    {i.date}
                                  </h4>
                                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                                  <span className="text-sm font-semibold text-indigo-600">
                                    {i.time}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                                  <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <Globe
                                      size={12}
                                      className="text-gray-400"
                                    />
                                    <span className="capitalize">
                                      {i.mode} Protocol
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <MapPin
                                      size={12}
                                      className="text-gray-400"
                                    />
                                    <span className="truncate max-w-[200px]">
                                      {i.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  Lead Panelist
                                </p>
                                <h4 className="text-sm font-bold text-gray-800">
                                  {i.interviewerName}
                                </h4>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase">
                                  {i.interviewerRole}
                                </p>
                              </div>

                              {/* <div className="flex flex-col items-end gap-2">
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                  {i.status}
                                </div>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                  <ExternalLink size={16} />
                                </button>
                              </div> */}

                              <div className="flex flex-col items-end gap-2">
  <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
    i.status === "Completed" 
    ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
    : "bg-emerald-50 text-emerald-600 border-emerald-100"
  }`}>
    {i.status}
  </div>
  
  {i.status !== "Completed" ? (
    <button 
      onClick={() => { setSelectedInterview(i); setIsFeedbackModalOpen(true); }}
      className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
    >
      Evaluate <ExternalLink size={12} />
    </button>
  ) : (
    <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
      <Star size={12} fill="currentColor" /> SCORE: {((i.feedback.technicalScore + i.feedback.culturalFit + i.feedback.softSkills)/3).toFixed(1)}
    </div>
  )}
</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* EMPTY STATE - Enterprise Style */
                    <div className="py-16 px-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
                      <div className="h-20 w-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 relative">
                        <Clock size={32} className="text-gray-300" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full border-4 border-gray-50" />
                      </div>

                      <div className="max-w-xs space-y-2">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                          No Active Sessions
                        </h3>
                        <p className="text-xs font-medium text-gray-400 leading-relaxed">
                          The interview pipeline for this candidate is currently
                          dormant. Use the configuration panel above to deploy
                          the first round.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          /* maybe scroll to top or trigger focus */
                        }}
                        className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all"
                      >
                        Initialize Round 01 <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <SectionHeader title="Dossier Information" />
                <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
                  <InfoItem
                    label="Legal Entity Name"
                    value={candidate.name}
                    icon={<User size={14} className="text-gray-400" />}
                  />
                  <InfoItem
                    label="Operational Role"
                    value={candidate.position}
                    icon={<Award size={14} className="text-amber-500" />}
                  />
                  <InfoItem
                    label="Secure Email"
                    value={candidate.email}
                    icon={<Mail size={14} className="text-blue-500" />}
                  />
                  <InfoItem
                    label="Contact Hash"
                    value={candidate.phone}
                    icon={<Smartphone size={14} className="text-emerald-500" />}
                  />
                  <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <InfoItem
                      label="Professional Abstract"
                      value={candidate.bio}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <SectionHeader title="Professional Credentials" />
                <div className="grid grid-cols-2 gap-10 mt-8">
                  <InfoItem
                    icon={<Hash size={14} />}
                    label="System Identifier"
                    value={`UUID-${candidate.id}`}
                  />
                  <InfoItem
                    icon={<Briefcase size={14} />}
                    label="Market Experience"
                    value={candidate.experience}
                  />
                  <InfoItem
                    icon={<GraduationCap size={14} />}
                    label="Academic Verification"
                    value={candidate.education}
                  />
                  <InfoItem
                    icon={<Building2 size={14} />}
                    label="Base Operations"
                    value={`${candidate.location.city}, ${candidate.location.state}`}
                  />
                  <InfoItem
                    icon={<Globe size={14} />}
                    label="Global Pincode"
                    value={candidate.location.pincode}
                  />
                  <div className="col-span-2 flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl">
                    <span className="text-xs font-medium text-gray-500">
                      Portfolio URL
                    </span>
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      View Documents <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "interview" && (
              <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <SectionHeader title="Logistics & Orchestration" />
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                      Schedule Interview
                    </h2>
                  </div>
                  <div className="px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                      Secure Channel
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                  {/* Left Column: Core Details */}
                  <div className="col-span-12 lg:col-span-7 space-y-8">
                    {/* Professional Mode Selector */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        Meeting Protocol
                      </label>
                      <div className="flex p-1.5 bg-gray-100/50 border border-gray-200 rounded-[20px] w-full">
                        {["online", "physical"].map((m) => (
                          <button
                            key={m}
                            onClick={() =>
                              setScheduleForm({ ...scheduleForm, mode: m })
                            }
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                              scheduleForm.mode === m
                                ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-indigo-600 scale-[1.02]"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            {m === "online" ? (
                              <Globe size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                            {m} Interface
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <InputField
                        label="Date of Engagement"
                        type="date"
                        placeholder="Select Date"
                        value={scheduleForm.date}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            date: e.target.value,
                          })
                        }
                      />
                      <InputField
                        label="Synchronization Time"
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Dynamic Contextual Input */}
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <InputField
                        label={
                          scheduleForm.mode === "online"
                            ? "Encrypted Meeting Link"
                            : "Physical Venue Address"
                        }
                        placeholder={
                          scheduleForm.mode === "online"
                            ? "https://meet.google.com/..."
                            : "Board Room 4, Sector 5..."
                        }
                        icon={
                          scheduleForm.mode === "online" ? (
                            <LinkIcon size={14} />
                          ) : (
                            <Building2 size={14} />
                          )
                        }
                        value={scheduleForm.location}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Right Column: Personnel & Action */}
                  {/* <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="p-8 bg-[#111827] rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <User size={80} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Lead Interviewer</div>
            
            <div className="space-y-4">
              <input 
                className="w-full bg-white/5 border-b border-white/10 py-2 outline-none focus:border-indigo-400 transition-colors placeholder:text-white/20 text-sm font-semibold"
                placeholder="Assign Interviewer Name"
                value={scheduleForm.interviewerName}
                onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
              />
              <input 
                className="w-full bg-white/5 border-b border-white/10 py-2 outline-none focus:border-indigo-400 transition-colors placeholder:text-white/20 text-[11px] uppercase tracking-widest"
                placeholder="Assign Corporate Role"
                value={scheduleForm.interviewerRole}
                onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerRole: e.target.value })}
              />
            </div>

            <button
              onClick={handleScheduleSubmit}
              disabled={isScheduled}
              className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                isScheduled 
                ? "bg-emerald-500 text-white" 
                : "bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 shadow-xl shadow-indigo-900/20"
              }`}
            >
              {isScheduled ? (
                <><ShieldCheck size={16} /> Schedule Confirmed</>
              ) : (
                <><Clock size={16} /> Deploy Schedule</>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
           <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
             <span className="text-indigo-600">PRO TIP:</span> Confirming this schedule will automatically trigger a calendar invite and a verification hash to the candidate's registered secure email.
           </p>
        </div>
      </div> */}
                  {/* Right Column: Personnel & Action */}
                  <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                    {/* Personnel Selection Card */}
                    <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                      {/* Decorative background element */}
                      <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />

                      <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                              Authority Figure
                            </span>
                            <h4 className="text-sm font-black text-gray-900 uppercase">
                              Lead Interviewer
                            </h4>
                          </div>
                          <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:rotate-12 transition-transform">
                            <User size={20} className="text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Modern Floating-Label style inputs */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                              Assigned Name
                            </label>
                            <input
                              className="w-full bg-gray-50/50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                              placeholder="e.g. Sarah Jenkins"
                              value={scheduleForm.interviewerName}
                              onChange={(e) =>
                                setScheduleForm({
                                  ...scheduleForm,
                                  interviewerName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                              Corporate Designation
                            </label>
                            <input
                              className="w-full bg-gray-50/50 border-2 border-transparent rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-tighter text-gray-600 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                              placeholder="e.g. Engineering Manager"
                              value={scheduleForm.interviewerRole}
                              onChange={(e) =>
                                setScheduleForm({
                                  ...scheduleForm,
                                  interviewerRole: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={handleScheduleSubmit}
                            disabled={isScheduled}
                            className={`w-full py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                              isScheduled
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                                : "bg-[#111827] text-white hover:bg-indigo-600 shadow-xl shadow-gray-200"
                            }`}
                          >
                            {isScheduled ? (
                              <>
                                <ShieldCheck size={16} /> Schedule Dispatched
                              </>
                            ) : (
                              <>
                                <Clock size={16} /> Deploy Schedule
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Pro Tip with refined UI */}
                    <div className="flex items-start gap-4 p-6 bg-indigo-50/40 rounded-[28px] border border-indigo-100/50">
                      <div className="h-8 w-8 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
                        <Activity size={14} className="text-indigo-600" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 leading-relaxed">
                        <span className="text-indigo-700 uppercase tracking-tighter">
                          System Logic:
                        </span>{" "}
                        This action will link the candidate profile to the
                        interviewer's dashboard and lock the selected time-slot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      {/* 05. DATA UPDATE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  Sync Entity Records
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Updating global profile attributes
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <InputField
                  label="Full Entity Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Operational Position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Communications Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Years Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
                    Profile Abstract
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button
                onClick={handleSave}
                className="flex-grow bg-[#111827] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Save size={16} /> Save Record Changes
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-8 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          {/* Backdrop with high-end blur */}
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xl"
            onClick={() => setIsPreviewOpen(false)}
          />

          {/* Main Workspace Container */}
          <div className="relative w-full max-w-7xl h-[92vh] bg-white border border-slate-200 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* 01. INTEGRATED TOOLBAR */}
            <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Profile
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none uppercase">
                      Resume_Arjun_2026
                    </h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Status: Verified Document
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
                  <Download size={14} /> Export PDF
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-grow flex overflow-hidden">
              {/* 02. DOCUMENT CANVAS */}
              <div className="flex-grow bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] p-16 relative">
                  {/* Professional Resume Content */}
                  <div className="flex justify-between items-start mb-12">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                        {candidate.name}
                      </h1>
                      <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">
                        {candidate.position}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {candidate.location.city}, India
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {candidate.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-8 space-y-10">
                      <ResumeSection title="Executive Summary">
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                          {candidate.bio}
                        </p>
                      </ResumeSection>
                      <ResumeSection title="Professional Experience">
                        <ExperienceBlock
                          title="Senior Lead"
                          company="Global Tech"
                          date="2022-2026"
                        />
                        <ExperienceBlock
                          title="Product Engineer"
                          company="Systematic"
                          date="2020-2022"
                        />
                      </ResumeSection>
                    </div>
                    <div className="col-span-4 space-y-10">
                      <ResumeSection title="Core Tech Stack">
                        <div className="flex flex-wrap gap-2">
                          {[
                            "React 19",
                            "Next.js",
                            "Typescript",
                            "Framer Motion",
                            "Tailwind",
                          ].map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tight"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </ResumeSection>
                    </div>
                  </div>
                </div>
              </div>

              {/* 03. ANALYTICS SIDEBAR - Integrated with Dashboard Style */}
              <aside className="w-[340px] border-l border-slate-100 bg-white flex flex-col p-8 space-y-10">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-3">
                    <Activity size={14} /> Smart Insights
                  </h3>

                  <div className="space-y-8">
                    {/* Score Meter */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Job Relevance
                        </span>
                        <span className="text-xs font-black text-indigo-600">
                          94%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
                      </div>
                    </div>

                    {/* Verified Metadata Blocks */}
                    <MetadataInsight
                      label="Education"
                      value="Verified B.Tech"
                      icon={<GraduationCap className="text-emerald-500" />}
                    />
                    <MetadataInsight
                      label="Integrity"
                      value="No Anomalies"
                      icon={<ShieldCheck className="text-blue-500" />}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {isDecisionModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={() => setIsDecisionModalOpen(false)}
    />

    {/* Modal Content */}
    <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
      
      {/* Modal Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-600" /> Final Determination Panel
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Authorized Personnel Only</p>
        </div>
        <button 
          onClick={() => setIsDecisionModalOpen(false)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-8 pt-4">
        <div className="space-y-6">
          {/* Remark Input */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Protocol Remarks</label>
            <textarea 
              placeholder="Provide context for this decision..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
            />
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
              <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
            </button>
            
            <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
              <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
            </button>

            <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
              <ShieldCheck size={16} /> Approve
            </button>
          </div>
        </div>
      </div>

      {/* Audit Footer */}
      <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
           Secure Terminal Session • Immutable Audit Log Enabled
         </span>
      </div>
    </div>
  </div>
)}

{isFeedbackModalOpen && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFeedbackModalOpen(false)} />
    
    <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
      
      {/* Left: Scoreboard Sidebar (35%) */}
      <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Review</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Scorecard <br/>Analysis</h2>
        </div>

        <div className="space-y-8 flex-grow">
          <RatingRow 
            label="Technical Logic" 
            icon={Cpu}
            value={feedbackData.technicalScore} 
            onChange={(val) => setFeedbackData({...feedbackData, technicalScore: val})} 
          />
          <RatingRow 
            label="Cultural Synergy" 
            icon={Users}
            value={feedbackData.culturalFit} 
            onChange={(val) => setFeedbackData({...feedbackData, culturalFit: val})} 
          />
          <RatingRow 
            label="Articulate/Comms" 
            icon={MessageSquare}
            value={feedbackData.softSkills} 
            onChange={(val) => setFeedbackData({...feedbackData, softSkills: val})} 
          />
        </div>

        <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
           <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Aggregate Intelligence</p>
           <div className="text-3xl font-black italic">
             {((feedbackData.technicalScore + feedbackData.culturalFit + feedbackData.softSkills) / 3).toFixed(1)}
             <span className="text-lg opacity-50 not-italic ml-1">/10</span>
           </div>
        </div>
      </div>

      {/* Right: Narrative & Conclusion (62%) */}
      <div className="flex-grow p-8 lg:p-10 flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Final Verdict</p>
            <p className="text-xs text-slate-400 font-medium">Please provide your executive recommendation below.</p>
          </div>
          <button onClick={() => setIsFeedbackModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow space-y-8">
          {/* Detailed Narrative */}
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Candidate Assessment Narrative</label>
            <textarea 
              rows="6"
              className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
              placeholder="Highlight key strengths, weaknesses, and overall impression..."
              value={feedbackData.comments}
              onChange={(e) => setFeedbackData({...feedbackData, comments: e.target.value})}
            />
          </div>

          {/* Decision Buttons */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decision Path</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {id: 'no_hire', label: 'Reject', color: 'hover:border-red-500 hover:text-red-600', active: 'bg-red-50 border-red-500 text-red-600'},
                {id: 'hire', label: 'Pass', color: 'hover:border-indigo-500 hover:text-indigo-600', active: 'bg-indigo-50 border-indigo-500 text-indigo-600'},
                {id: 'strong_hire', label: 'Strong Pass', color: 'hover:border-emerald-500 hover:text-emerald-600', active: 'bg-emerald-50 border-emerald-500 text-emerald-600'}
              ].map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setFeedbackData({...feedbackData, recommendation: rec.id})}
                  className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                    feedbackData.recommendation === rec.id 
                    ? rec.active 
                    : `bg-white border-slate-100 text-slate-400 ${rec.color}`
                  }`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleFeedbackSubmit}
          className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <Briefcase size={16} /> Finalize Session Audit
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

/* REUSABLE SUB-COMPONENTS */

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? "bg-white border border-gray-200 shadow-md text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"}`}
  >
    <span className={`${active ? "scale-110" : "opacity-60"}`}>{icon}</span>
    <span
      className={`text-[11px] font-bold uppercase tracking-[0.15em] ${active ? "opacity-100" : "opacity-70"}`}
    >
      {label}
    </span>
  </button>
);

const SectionHeader = ({ title }) => (
  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-gray-100">
    {title}
  </h3>
);

const RatingRow = ({ label, value, onChange, icon: Icon }) => (
  <div className="group space-y-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
          <Icon size={14} />
        </div>
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
        {value}/10
      </span>
    </div>
    
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            num <= value 
            ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
            : "bg-slate-100 hover:bg-slate-200"
          }`}
          title={`Rate ${num}/10`}
        />
      ))}
    </div>
  </div>
);

// Matches the "SectionHeader" from your main dashboard
const ResumeSection = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-slate-100">
      {title}
    </h3>
    {children}
  </div>
);

// High-density Metadata block for Sidebar
const MetadataInsight = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-100 transition-all">
    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-none">
        {value}
      </p>
    </div>
  </div>
);

const ExperienceBlock = ({ title, company, date }) => (
  <div className="flex justify-between items-start">
    <div>
      <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-none">
        {title}
      </h4>
      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
        {company}
      </p>
    </div>
    <span className="text-[10px] font-black text-slate-300 uppercase">
      {date}
    </span>
  </div>
);

const InfoItem = ({ label, value, icon }) => (
  <div className="space-y-2 group">
    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
      {icon} {label}
    </div>
    <p className="text-[15px] font-semibold text-gray-800 leading-relaxed">
      {value || "N/A"}
    </p>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}) => (
  <div className="flex flex-col gap-2.5 group">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-gray-50 border-2 border-transparent rounded-[18px] ${icon ? "pl-12" : "px-6"} py-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-[6px] focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 placeholder:font-medium`}
      />
    </div>
  </div>
);

const HeroMeta = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-gray-500 font-semibold text-[13px] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
    <span className="opacity-50">{icon}</span>
    {text}
  </div>
);

const LogNode = ({ date, title, desc, type }) => {
  const dotColor =
    type === "success"
      ? "bg-emerald-500"
      : type === "warning"
        ? "bg-amber-500"
        : "bg-blue-500";
  return (
    <div className="relative pl-10 group cursor-default">
      <div
        className={`absolute left-0 top-1 h-5 w-5 rounded-full ${dotColor} ring-[6px] ring-white transition-transform group-hover:scale-125`}
      />
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {date}
      </p>
      <p className="text-[14px] font-bold text-gray-800 mt-1">{title}</p>
      <p className="text-xs font-medium text-gray-500 mt-0.5 max-w-md">
        {desc}
      </p>
    </div>
  );
};

export default CandidateProfile;
//*********************************************working code phase 22***************************************************** */
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   User,
//   Mail,
//   Briefcase,
//   GraduationCap,
//   MapPin,
//   Edit3,
//   X,
//   Save,
//   ArrowLeft,
//   Building2,
//   Smartphone,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Activity,
//   Fingerprint,
//   Calendar,
//   FileText,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";

// const CandidateProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [interviews, setInterviews] = useState([]);

//   const [isScheduled, setIsScheduled] = useState(false);
//   const [scheduleForm, setScheduleForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerRole: "",
//     notes: "",
//   });
// const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
// const [selectedInterview, setSelectedInterview] = useState(null);
// const [feedbackData, setFeedbackData] = useState({
//   technicalScore: 5,
//   culturalFit: 5,
//   softSkills: 5,
//   comments: "",
//   recommendation: "hire" // hire, strong_hire, no_hire
// });
//   const [candidate, setCandidate] = useState({
//     id: id || "CAN-8821",
//     name: "Arjun Mehta",
//     email: "arjun.m@tech-global.com",
//     phone: "+91 98765 43210",
//     position: "Senior Frontend Lead",
//     experience: "6 Years",
//     education: "B.Tech Computer Science",
//     status: "Verified",
//     location: {
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       address: "124, Skyline Towers, Andheri East",
//     },
//     bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
//   });

//   const [formData, setFormData] = useState({ ...candidate });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // const handleScheduleSubmit = () => {
//   //   const data = {
//   //     ...scheduleForm,
//   //     candidateId: candidate.id,
//   //     createdAt: new Date().toISOString(),
//   //   };

//   //   setSavedSchedule(data);   // ✅ Save interview details
//   //   setIsScheduled(true);

//   //   // optional toast / UI reset
//   //   setTimeout(() => setIsScheduled(false), 3000);
//   // };

//   const handleScheduleSubmit = () => {
//     const data = {
//       ...scheduleForm,
//       candidateId: candidate.id,
//       round: interviews.length + 1,
//       status: "Scheduled",
//       createdAt: new Date().toISOString(),
//     };

//     setInterviews((prev) => [...prev, data]); // ✅ Store multiple interviews
//     setIsScheduled(true);

//     setScheduleForm({
//       date: "",
//       time: "",
//       mode: "online",
//       location: "",
//       interviewerName: "",
//       interviewerRole: "",
//       notes: "",
//     });

//     setTimeout(() => setIsScheduled(false), 3000);
//   };

//   // Function to handle feedback submission
// const handleFeedbackSubmit = () => {
//   setInterviews(prev => prev.map(i => 
//     i.id === selectedInterview.id ? { ...i, status: "Completed", feedback: feedbackData } : i
//   ));
//   setIsFeedbackModalOpen(false);
//   // Reset feedback data
//   setFeedbackData({ technicalScore: 5, culturalFit: 5, softSkills: 5, comments: "", recommendation: "hire" });
// };

//   const handleSave = () => {
//     setCandidate(formData);
//     setIsEditModalOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased">
//       {/* 01. GLOBAL TOP NAVIGATION */}
//       <nav className="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-8 sticky top-0 z-50">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95 text-gray-500 group"
//           >
//             <ArrowLeft size={18} className="group-hover:text-gray-900" />
//           </button>
//           <div className="h-5 w-px bg-gray-200" />
//           <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
//             <span className="hover:text-gray-600 cursor-pointer transition-colors">
//               Talent Pipeline
//             </span>
//             <ChevronRight size={14} className="opacity-40" />
//             <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
//               Profile {candidate.id}
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
//             <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//             {candidate.status}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto py-10 px-8">
//         {/* 02. PROFILE HERO SECTION */}
//         <section className="bg-white border border-gray-200 rounded-[24px] p-10 mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400" />

//           <div className="flex items-center gap-8">
//             <div className="relative">
//               <div className="h-24 w-24 rounded-2xl bg-[#111827] flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
//                 {candidate.name.charAt(0)}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location.city}
//                 />
//                 <HeroMeta
//                   icon={<Calendar size={14} />}
//                   text="Member since 2026"
//                 />
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setIsEditModalOpen(true)}
//             className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//           >
//             <Edit3 size={16} /> Edit Attributes
//           </button>
//         </section>

//         <div className="grid grid-cols-12 gap-10">
//           {/* 03. SIDEBAR NAVIGATION */}
//           <aside className="col-span-12 lg:col-span-3 space-y-2">
//             <TabButton
//               active={activeTab === "overview"}
//               onClick={() => setActiveTab("overview")}
//               icon={<User size={18} />}
//               label="Overview"
//             />
//             <TabButton
//               active={activeTab === "professional"}
//               onClick={() => setActiveTab("professional")}
//               icon={<Briefcase size={18} />}
//               label="Career History"
//             />
//             {/* NEW TAB BUTTON */}
//             <TabButton
//               active={activeTab === "interview"}
//               onClick={() => setActiveTab("interview")}
//               icon={<Calendar size={18} />}
//               label="Schedule Interview"
//             />
//             {/* <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={<Activity size={18}/>} label="Audit Logs" /> */}

//             <div className="mt-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
//               <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">
//                 Vulnerability Score
//               </h4>
//               <div className="flex items-end gap-2 mb-3">
//                 <span className="text-3xl font-bold text-indigo-900 leading-none">
//                   94
//                 </span>
//                 <span className="text-sm font-semibold text-indigo-400">
//                   /100
//                 </span>
//               </div>
//               <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
//                 <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {activeTab === "overview" && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <div className="mt-10 space-y-6 mb-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
//                       <Activity size={14} /> Global Interview Registry
//                     </h3>
//                     <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
//                       {interviews.length} Scheduled
//                     </span>
//                   </div>

//                   {interviews.length > 0 ? (
//                     <div className="space-y-4 mb-4">
//                       {interviews.map((i, idx) => (
//                         <div
//                           key={idx}
//                           className="group relative bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
//                         >
//                           {/* Status Accent Bar */}
//                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />

//                           <div className="flex flex-col lg:flex-row justify-between gap-6">
//                             <div className="flex items-start gap-5">
//                               <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
//                                 <Calendar size={18} />
//                                 <span className="text-[10px] font-black mt-1 uppercase">
//                                   RD {i.round}
//                                 </span>
//                               </div>

//                               <div className="space-y-1">
//                                 <div className="flex items-center gap-2">
//                                   <h4 className="text-base font-bold text-gray-900">
//                                     {i.date}
//                                   </h4>
//                                   <span className="h-1 w-1 rounded-full bg-gray-300" />
//                                   <span className="text-sm font-semibold text-indigo-600">
//                                     {i.time}
//                                   </span>
//                                 </div>

//                                 <div className="flex flex-wrap items-center gap-4 text-gray-500">
//                                   <div className="flex items-center gap-1.5 text-xs font-medium">
//                                     <Globe
//                                       size={12}
//                                       className="text-gray-400"
//                                     />
//                                     <span className="capitalize">
//                                       {i.mode} Protocol
//                                     </span>
//                                   </div>
//                                   <div className="flex items-center gap-1.5 text-xs font-medium">
//                                     <MapPin
//                                       size={12}
//                                       className="text-gray-400"
//                                     />
//                                     <span className="truncate max-w-[200px]">
//                                       {i.location}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
//                               <div className="text-right">
//                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                                   Lead Panelist
//                                 </p>
//                                 <h4 className="text-sm font-bold text-gray-800">
//                                   {i.interviewerName}
//                                 </h4>
//                                 <p className="text-[10px] font-bold text-indigo-500 uppercase">
//                                   {i.interviewerRole}
//                                 </p>
//                               </div>

//                               {/* <div className="flex flex-col items-end gap-2">
//                                 <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
//                                   {i.status}
//                                 </div>
//                                 <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
//                                   <ExternalLink size={16} />
//                                 </button>
//                               </div> */}

//                               <div className="flex flex-col items-end gap-2">
//   <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//     i.status === "Completed" 
//     ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
//     : "bg-emerald-50 text-emerald-600 border-emerald-100"
//   }`}>
//     {i.status}
//   </div>
  
//   {i.status !== "Completed" ? (
//     <button 
//       onClick={() => { setSelectedInterview(i); setIsFeedbackModalOpen(true); }}
//       className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//     >
//       Evaluate <ExternalLink size={12} />
//     </button>
//   ) : (
//     <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//       <Star size={12} fill="currentColor" /> SCORE: {((i.feedback.technicalScore + i.feedback.culturalFit + i.feedback.softSkills)/3).toFixed(1)}
//     </div>
//   )}
// </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     /* EMPTY STATE - Enterprise Style */
//                     <div className="py-16 px-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
//                       <div className="h-20 w-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 relative">
//                         <Clock size={32} className="text-gray-300" />
//                         <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full border-4 border-gray-50" />
//                       </div>

//                       <div className="max-w-xs space-y-2">
//                         <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
//                           No Active Sessions
//                         </h3>
//                         <p className="text-xs font-medium text-gray-400 leading-relaxed">
//                           The interview pipeline for this candidate is currently
//                           dormant. Use the configuration panel above to deploy
//                           the first round.
//                         </p>
//                       </div>

//                       <button
//                         onClick={() => {
//                           /* maybe scroll to top or trigger focus */
//                         }}
//                         className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all"
//                       >
//                         Initialize Round 01 <ArrowRight size={14} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <SectionHeader title="Dossier Information" />
//                 <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
//                   <InfoItem
//                     label="Legal Entity Name"
//                     value={candidate.name}
//                     icon={<User size={14} className="text-gray-400" />}
//                   />
//                   <InfoItem
//                     label="Operational Role"
//                     value={candidate.position}
//                     icon={<Award size={14} className="text-amber-500" />}
//                   />
//                   <InfoItem
//                     label="Secure Email"
//                     value={candidate.email}
//                     icon={<Mail size={14} className="text-blue-500" />}
//                   />
//                   <InfoItem
//                     label="Contact Hash"
//                     value={candidate.phone}
//                     icon={<Smartphone size={14} className="text-emerald-500" />}
//                   />
//                   <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
//                     <InfoItem
//                       label="Professional Abstract"
//                       value={candidate.bio}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "professional" && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <SectionHeader title="Professional Credentials" />
//                 <div className="grid grid-cols-2 gap-10 mt-8">
//                   <InfoItem
//                     icon={<Hash size={14} />}
//                     label="System Identifier"
//                     value={`UUID-${candidate.id}`}
//                   />
//                   <InfoItem
//                     icon={<Briefcase size={14} />}
//                     label="Market Experience"
//                     value={candidate.experience}
//                   />
//                   <InfoItem
//                     icon={<GraduationCap size={14} />}
//                     label="Academic Verification"
//                     value={candidate.education}
//                   />
//                   <InfoItem
//                     icon={<Building2 size={14} />}
//                     label="Base Operations"
//                     value={`${candidate.location.city}, ${candidate.location.state}`}
//                   />
//                   <InfoItem
//                     icon={<Globe size={14} />}
//                     label="Global Pincode"
//                     value={candidate.location.pincode}
//                   />
//                   <div className="col-span-2 flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl">
//                     <span className="text-xs font-medium text-gray-500">
//                       Portfolio URL
//                     </span>
//                     <button
//                       onClick={() => setIsPreviewOpen(true)}
//                       className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
//                     >
//                       View Documents <ExternalLink size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "interview" && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <div className="flex justify-between items-end mb-8">
//                   <div>
//                     <SectionHeader title="Logistics & Orchestration" />
//                     <h2 className="text-2xl font-bold text-gray-900 mt-2">
//                       Schedule Interview
//                     </h2>
//                   </div>
//                   <div className="px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center gap-2">
//                     <ShieldCheck size={14} className="text-indigo-600" />
//                     <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
//                       Secure Channel
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-12 gap-10">
//                   {/* Left Column: Core Details */}
//                   <div className="col-span-12 lg:col-span-7 space-y-8">
//                     {/* Professional Mode Selector */}
//                     <div className="space-y-3">
//                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
//                         Meeting Protocol
//                       </label>
//                       <div className="flex p-1.5 bg-gray-100/50 border border-gray-200 rounded-[20px] w-full">
//                         {["online", "physical"].map((m) => (
//                           <button
//                             key={m}
//                             onClick={() =>
//                               setScheduleForm({ ...scheduleForm, mode: m })
//                             }
//                             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
//                               scheduleForm.mode === m
//                                 ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-indigo-600 scale-[1.02]"
//                                 : "text-gray-400 hover:text-gray-600"
//                             }`}
//                           >
//                             {m === "online" ? (
//                               <Globe size={14} />
//                             ) : (
//                               <MapPin size={14} />
//                             )}
//                             {m} Interface
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6">
//                       <InputField
//                         label="Date of Engagement"
//                         type="date"
//                         placeholder="Select Date"
//                         value={scheduleForm.date}
//                         onChange={(e) =>
//                           setScheduleForm({
//                             ...scheduleForm,
//                             date: e.target.value,
//                           })
//                         }
//                       />
//                       <InputField
//                         label="Synchronization Time"
//                         type="time"
//                         value={scheduleForm.time}
//                         onChange={(e) =>
//                           setScheduleForm({
//                             ...scheduleForm,
//                             time: e.target.value,
//                           })
//                         }
//                       />
//                     </div>

//                     {/* Dynamic Contextual Input */}
//                     <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                       <InputField
//                         label={
//                           scheduleForm.mode === "online"
//                             ? "Encrypted Meeting Link"
//                             : "Physical Venue Address"
//                         }
//                         placeholder={
//                           scheduleForm.mode === "online"
//                             ? "https://meet.google.com/..."
//                             : "Board Room 4, Sector 5..."
//                         }
//                         icon={
//                           scheduleForm.mode === "online" ? (
//                             <LinkIcon size={14} />
//                           ) : (
//                             <Building2 size={14} />
//                           )
//                         }
//                         value={scheduleForm.location}
//                         onChange={(e) =>
//                           setScheduleForm({
//                             ...scheduleForm,
//                             location: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   </div>

//                   {/* Right Column: Personnel & Action */}
//                   {/* <div className="col-span-12 lg:col-span-5 space-y-6">
//         <div className="p-8 bg-[#111827] rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
//           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
//             <User size={80} />
//           </div>
          
//           <div className="relative z-10 space-y-6">
//             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Lead Interviewer</div>
            
//             <div className="space-y-4">
//               <input 
//                 className="w-full bg-white/5 border-b border-white/10 py-2 outline-none focus:border-indigo-400 transition-colors placeholder:text-white/20 text-sm font-semibold"
//                 placeholder="Assign Interviewer Name"
//                 value={scheduleForm.interviewerName}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
//               />
//               <input 
//                 className="w-full bg-white/5 border-b border-white/10 py-2 outline-none focus:border-indigo-400 transition-colors placeholder:text-white/20 text-[11px] uppercase tracking-widest"
//                 placeholder="Assign Corporate Role"
//                 value={scheduleForm.interviewerRole}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerRole: e.target.value })}
//               />
//             </div>

//             <button
//               onClick={handleScheduleSubmit}
//               disabled={isScheduled}
//               className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
//                 isScheduled 
//                 ? "bg-emerald-500 text-white" 
//                 : "bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 shadow-xl shadow-indigo-900/20"
//               }`}
//             >
//               {isScheduled ? (
//                 <><ShieldCheck size={16} /> Schedule Confirmed</>
//               ) : (
//                 <><Clock size={16} /> Deploy Schedule</>
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="p-6 bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
//            <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
//              <span className="text-indigo-600">PRO TIP:</span> Confirming this schedule will automatically trigger a calendar invite and a verification hash to the candidate's registered secure email.
//            </p>
//         </div>
//       </div> */}
//                   {/* Right Column: Personnel & Action */}
//                   <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
//                     {/* Personnel Selection Card */}
//                     <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
//                       {/* Decorative background element */}
//                       <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />

//                       <div className="relative z-10 space-y-8">
//                         <div className="flex items-center justify-between">
//                           <div className="space-y-1">
//                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
//                               Authority Figure
//                             </span>
//                             <h4 className="text-sm font-black text-gray-900 uppercase">
//                               Lead Interviewer
//                             </h4>
//                           </div>
//                           <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:rotate-12 transition-transform">
//                             <User size={20} className="text-gray-400" />
//                           </div>
//                         </div>

//                         <div className="space-y-6">
//                           {/* Modern Floating-Label style inputs */}
//                           <div className="space-y-1.5">
//                             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
//                               Assigned Name
//                             </label>
//                             <input
//                               className="w-full bg-gray-50/50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
//                               placeholder="e.g. Sarah Jenkins"
//                               value={scheduleForm.interviewerName}
//                               onChange={(e) =>
//                                 setScheduleForm({
//                                   ...scheduleForm,
//                                   interviewerName: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>

//                           <div className="space-y-1.5">
//                             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
//                               Corporate Designation
//                             </label>
//                             <input
//                               className="w-full bg-gray-50/50 border-2 border-transparent rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-tighter text-gray-600 focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
//                               placeholder="e.g. Engineering Manager"
//                               value={scheduleForm.interviewerRole}
//                               onChange={(e) =>
//                                 setScheduleForm({
//                                   ...scheduleForm,
//                                   interviewerRole: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                         </div>

//                         <div className="pt-2">
//                           <button
//                             onClick={handleScheduleSubmit}
//                             disabled={isScheduled}
//                             className={`w-full py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
//                               isScheduled
//                                 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
//                                 : "bg-[#111827] text-white hover:bg-indigo-600 shadow-xl shadow-gray-200"
//                             }`}
//                           >
//                             {isScheduled ? (
//                               <>
//                                 <ShieldCheck size={16} /> Schedule Dispatched
//                               </>
//                             ) : (
//                               <>
//                                 <Clock size={16} /> Deploy Schedule
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Pro Tip with refined UI */}
//                     <div className="flex items-start gap-4 p-6 bg-indigo-50/40 rounded-[28px] border border-indigo-100/50">
//                       <div className="h-8 w-8 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
//                         <Activity size={14} className="text-indigo-600" />
//                       </div>
//                       <p className="text-[10px] font-bold text-gray-500 leading-relaxed">
//                         <span className="text-indigo-700 uppercase tracking-tighter">
//                           System Logic:
//                         </span>{" "}
//                         This action will link the candidate profile to the
//                         interviewer's dashboard and lock the selected time-slot.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </article>
//         </div>
//       </main>

//       {/* 05. DATA UPDATE MODAL */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           <div
//             className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsEditModalOpen(false)}
//           />
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 tracking-tight">
//                   Sync Entity Records
//                 </h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//                   Updating global profile attributes
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 max-h-[65vh] overflow-y-auto">
//               <div className="grid grid-cols-2 gap-8">
//                 <InputField
//                   label="Full Entity Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//                 <InputField
//                   label="Operational Position"
//                   name="position"
//                   value={formData.position}
//                   onChange={handleInputChange}
//                 />
//                 <InputField
//                   label="Communications Email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />
//                 <InputField
//                   label="Years Experience"
//                   name="experience"
//                   value={formData.experience}
//                   onChange={handleInputChange}
//                 />
//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Profile Abstract
//                   </label>
//                   <textarea
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     rows="4"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
//               <button
//                 onClick={handleSave}
//                 className="flex-grow bg-[#111827] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
//               >
//                 <Save size={16} /> Save Record Changes
//               </button>
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="px-8 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100"
//               >
//                 Discard
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isPreviewOpen && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
//           {/* Backdrop with high-end blur */}
//           <div
//             className="absolute inset-0 bg-slate-900/20 backdrop-blur-xl"
//             onClick={() => setIsPreviewOpen(false)}
//           />

//           {/* Main Workspace Container */}
//           <div className="relative w-full max-w-7xl h-[92vh] bg-white border border-slate-200 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
//             {/* 01. INTEGRATED TOOLBAR */}
//             <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md">
//               <div className="flex items-center gap-6">
//                 <button
//                   onClick={() => setIsPreviewOpen(false)}
//                   className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
//                 >
//                   <ArrowLeft
//                     size={16}
//                     className="group-hover:-translate-x-1 transition-transform"
//                   />
//                   Back to Profile
//                 </button>
//                 <div className="h-4 w-px bg-slate-200" />
//                 <div className="flex items-center gap-3">
//                   <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
//                     <FileText size={16} className="text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none uppercase">
//                       Resume_Arjun_2026
//                     </h2>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                       Status: Verified Document
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Controls */}
//               <div className="flex items-center gap-3">
//                 <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
//                   <Download size={14} /> Export PDF
//                 </button>
//                 <button
//                   onClick={() => setIsPreviewOpen(false)}
//                   className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-grow flex overflow-hidden">
//               {/* 02. DOCUMENT CANVAS */}
//               <div className="flex-grow bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar">
//                 <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] p-16 relative">
//                   {/* Professional Resume Content */}
//                   <div className="flex justify-between items-start mb-12">
//                     <div className="space-y-1">
//                       <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
//                         {candidate.name}
//                       </h1>
//                       <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">
//                         {candidate.position}
//                       </p>
//                     </div>
//                     <div className="text-right space-y-1">
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
//                         {candidate.location.city}, India
//                       </p>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
//                         {candidate.email}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-12 gap-12">
//                     <div className="col-span-8 space-y-10">
//                       <ResumeSection title="Executive Summary">
//                         <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
//                           {candidate.bio}
//                         </p>
//                       </ResumeSection>
//                       <ResumeSection title="Professional Experience">
//                         <ExperienceBlock
//                           title="Senior Lead"
//                           company="Global Tech"
//                           date="2022-2026"
//                         />
//                         <ExperienceBlock
//                           title="Product Engineer"
//                           company="Systematic"
//                           date="2020-2022"
//                         />
//                       </ResumeSection>
//                     </div>
//                     <div className="col-span-4 space-y-10">
//                       <ResumeSection title="Core Tech Stack">
//                         <div className="flex flex-wrap gap-2">
//                           {[
//                             "React 19",
//                             "Next.js",
//                             "Typescript",
//                             "Framer Motion",
//                             "Tailwind",
//                           ].map((s) => (
//                             <span
//                               key={s}
//                               className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tight"
//                             >
//                               {s}
//                             </span>
//                           ))}
//                         </div>
//                       </ResumeSection>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* 03. ANALYTICS SIDEBAR - Integrated with Dashboard Style */}
//               <aside className="w-[340px] border-l border-slate-100 bg-white flex flex-col p-8 space-y-10">
//                 <div>
//                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-3">
//                     <Activity size={14} /> Smart Insights
//                   </h3>

//                   <div className="space-y-8">
//                     {/* Score Meter */}
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                           Job Relevance
//                         </span>
//                         <span className="text-xs font-black text-indigo-600">
//                           94%
//                         </span>
//                       </div>
//                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
//                         <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
//                       </div>
//                     </div>

//                     {/* Verified Metadata Blocks */}
//                     <MetadataInsight
//                       label="Education"
//                       value="Verified B.Tech"
//                       icon={<GraduationCap className="text-emerald-500" />}
//                     />
//                     <MetadataInsight
//                       label="Integrity"
//                       value="No Anomalies"
//                       icon={<ShieldCheck className="text-blue-500" />}
//                     />
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </div>
//       )}

// {isFeedbackModalOpen && (
//   <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFeedbackModalOpen(false)} />
    
//     <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
      
//       {/* Left: Scoreboard Sidebar (35%) */}
//       <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//         <div className="mb-10">
//           <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//             <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Review</span>
//           </div>
//           <h2 className="text-2xl font-black text-slate-900 leading-tight">Scorecard <br/>Analysis</h2>
//         </div>

//         <div className="space-y-8 flex-grow">
//           <RatingRow 
//             label="Technical Logic" 
//             icon={Cpu}
//             value={feedbackData.technicalScore} 
//             onChange={(val) => setFeedbackData({...feedbackData, technicalScore: val})} 
//           />
//           <RatingRow 
//             label="Cultural Synergy" 
//             icon={Users}
//             value={feedbackData.culturalFit} 
//             onChange={(val) => setFeedbackData({...feedbackData, culturalFit: val})} 
//           />
//           <RatingRow 
//             label="Articulate/Comms" 
//             icon={MessageSquare}
//             value={feedbackData.softSkills} 
//             onChange={(val) => setFeedbackData({...feedbackData, softSkills: val})} 
//           />
//         </div>

//         <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Aggregate Intelligence</p>
//            <div className="text-3xl font-black italic">
//              {((feedbackData.technicalScore + feedbackData.culturalFit + feedbackData.softSkills) / 3).toFixed(1)}
//              <span className="text-lg opacity-50 not-italic ml-1">/10</span>
//            </div>
//         </div>
//       </div>

//       {/* Right: Narrative & Conclusion (62%) */}
//       <div className="flex-grow p-8 lg:p-10 flex flex-col">
//         <div className="flex justify-between items-start mb-8">
//           <div className="space-y-1">
//             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Final Verdict</p>
//             <p className="text-xs text-slate-400 font-medium">Please provide your executive recommendation below.</p>
//           </div>
//           <button onClick={() => setIsFeedbackModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex-grow space-y-8">
//           {/* Detailed Narrative */}
//           <div className="group">
//             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Candidate Assessment Narrative</label>
//             <textarea 
//               rows="6"
//               className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//               placeholder="Highlight key strengths, weaknesses, and overall impression..."
//               value={feedbackData.comments}
//               onChange={(e) => setFeedbackData({...feedbackData, comments: e.target.value})}
//             />
//           </div>

//           {/* Decision Buttons */}
//           <div className="space-y-4">
//             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decision Path</label>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 {id: 'no_hire', label: 'Reject', color: 'hover:border-red-500 hover:text-red-600', active: 'bg-red-50 border-red-500 text-red-600'},
//                 {id: 'hire', label: 'Pass', color: 'hover:border-indigo-500 hover:text-indigo-600', active: 'bg-indigo-50 border-indigo-500 text-indigo-600'},
//                 {id: 'strong_hire', label: 'Strong Pass', color: 'hover:border-emerald-500 hover:text-emerald-600', active: 'bg-emerald-50 border-emerald-500 text-emerald-600'}
//               ].map((rec) => (
//                 <button
//                   key={rec.id}
//                   onClick={() => setFeedbackData({...feedbackData, recommendation: rec.id})}
//                   className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                     feedbackData.recommendation === rec.id 
//                     ? rec.active 
//                     : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                   }`}
//                 >
//                   {rec.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <button 
//           onClick={handleFeedbackSubmit}
//           className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//         >
//           <Briefcase size={16} /> Finalize Session Audit
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const TabButton = ({ active, onClick, icon, label }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? "bg-white border border-gray-200 shadow-md text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"}`}
//   >
//     <span className={`${active ? "scale-110" : "opacity-60"}`}>{icon}</span>
//     <span
//       className={`text-[11px] font-bold uppercase tracking-[0.15em] ${active ? "opacity-100" : "opacity-70"}`}
//     >
//       {label}
//     </span>
//   </button>
// );

// const SectionHeader = ({ title }) => (
//   <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-gray-100">
//     {title}
//   </h3>
// );

// const RatingRow = ({ label, value, onChange, icon: Icon }) => (
//   <div className="group space-y-3">
//     <div className="flex justify-between items-center">
//       <div className="flex items-center gap-2">
//         <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
//           <Icon size={14} />
//         </div>
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{label}</span>
//       </div>
//       <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
//         {value}/10
//       </span>
//     </div>
    
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//         <button
//           key={num}
//           onClick={() => onChange(num)}
//           className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
//             num <= value 
//             ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
//             : "bg-slate-100 hover:bg-slate-200"
//           }`}
//           title={`Rate ${num}/10`}
//         />
//       ))}
//     </div>
//   </div>
// );

// // Matches the "SectionHeader" from your main dashboard
// const ResumeSection = ({ title, children }) => (
//   <div className="space-y-4">
//     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-slate-100">
//       {title}
//     </h3>
//     {children}
//   </div>
// );

// // High-density Metadata block for Sidebar
// const MetadataInsight = ({ label, value, icon }) => (
//   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-100 transition-all">
//     <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </p>
//       <p className="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-none">
//         {value}
//       </p>
//     </div>
//   </div>
// );

// const ExperienceBlock = ({ title, company, date }) => (
//   <div className="flex justify-between items-start">
//     <div>
//       <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-none">
//         {title}
//       </h4>
//       <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
//         {company}
//       </p>
//     </div>
//     <span className="text-[10px] font-black text-slate-300 uppercase">
//       {date}
//     </span>
//   </div>
// );

// const InfoItem = ({ label, value, icon }) => (
//   <div className="space-y-2 group">
//     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
//       {icon} {label}
//     </div>
//     <p className="text-[15px] font-semibold text-gray-800 leading-relaxed">
//       {value || "N/A"}
//     </p>
//   </div>
// );

// const InputField = ({
//   label,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
//   icon,
// }) => (
//   <div className="flex flex-col gap-2.5 group">
//     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">
//       {label}
//     </label>
//     <div className="relative">
//       {icon && (
//         <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
//           {icon}
//         </div>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full bg-gray-50 border-2 border-transparent rounded-[18px] ${icon ? "pl-12" : "px-6"} py-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-[6px] focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 placeholder:font-medium`}
//       />
//     </div>
//   </div>
// );

// const HeroMeta = ({ icon, text }) => (
//   <div className="flex items-center gap-2 text-gray-500 font-semibold text-[13px] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
//     <span className="opacity-50">{icon}</span>
//     {text}
//   </div>
// );

// const LogNode = ({ date, title, desc, type }) => {
//   const dotColor =
//     type === "success"
//       ? "bg-emerald-500"
//       : type === "warning"
//         ? "bg-amber-500"
//         : "bg-blue-500";
//   return (
//     <div className="relative pl-10 group cursor-default">
//       <div
//         className={`absolute left-0 top-1 h-5 w-5 rounded-full ${dotColor} ring-[6px] ring-white transition-transform group-hover:scale-125`}
//       />
//       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//         {date}
//       </p>
//       <p className="text-[14px] font-bold text-gray-800 mt-1">{title}</p>
//       <p className="text-xs font-medium text-gray-500 mt-0.5 max-w-md">
//         {desc}
//       </p>
//     </div>
//   );
// };

// export default CandidateProfile;
//**********************************************working cdoe phase 2******************************************************* */
// import React, { useState } from 'react';
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   User, Mail, Briefcase, GraduationCap, MapPin,
//   Edit3, X, Save, ArrowLeft, Building2,
//   Smartphone, Globe, ChevronRight,
//   ShieldCheck, Activity, Fingerprint, Calendar,FileText,Download,Clock,
//   Award, Hash, Link as LinkIcon, ExternalLink
// } from 'lucide-react';

// const CandidateProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
// const [savedSchedule, setSavedSchedule] = useState(null);

// // Form state for the scheduling tab
// const [scheduleForm, setScheduleForm] = useState({
//   date: "2026-02-15",
//   time: "14:00",
//   mode: "online",
//   location: "Google Meet",
//   interviewerName: "Sarah Jenkins",
//   interviewerRole: "Engineering Manager"
// });

//   const [candidate, setCandidate] = useState({
//     id: id || "CAN-8821",
//     name: "Arjun Mehta",
//     email: "arjun.m@tech-global.com",
//     phone: "+91 98765 43210",
//     position: "Senior Frontend Lead",
//     experience: "6 Years",
//     education: "B.Tech Computer Science",
//     status: "Verified",
//     location: {
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       address: "124, Skyline Towers, Andheri East"
//     },
//     bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale."
//   });

//   const [formData, setFormData] = useState({ ...candidate });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleScheduleSubmit = () => {
//   setSavedSchedule({ ...scheduleForm });
//   // Optional: Switch back to overview to see the confirmed card
//   // setActiveTab('overview');
// };

//   const handleSave = () => {
//     setCandidate(formData);
//     setIsEditModalOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased">
//       {/* 01. GLOBAL TOP NAVIGATION */}
//       <nav className="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-8 sticky top-0 z-50">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95 text-gray-500 group"
//           >
//             <ArrowLeft size={18} className="group-hover:text-gray-900" />
//           </button>
//           <div className="h-5 w-px bg-gray-200" />
//           <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
//             <span className="hover:text-gray-600 cursor-pointer transition-colors">Talent Pipeline</span>
//             <ChevronRight size={14} className="opacity-40" />
//             <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">Profile {candidate.id}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
//             <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//             {candidate.status}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto py-10 px-8">
//         {/* 02. PROFILE HERO SECTION */}
//         <section className="bg-white border border-gray-200 rounded-[24px] p-10 mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400" />

//           <div className="flex items-center gap-8">
//             <div className="relative">
//               <div className="h-24 w-24 rounded-2xl bg-[#111827] flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
//                 {candidate.name.charAt(0)}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">{candidate.name}</h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14}/>} text={candidate.email} />
//                 <HeroMeta icon={<MapPin size={14}/>} text={candidate.location.city} />
//                 <HeroMeta icon={<Calendar size={14}/>} text="Member since 2026" />
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setIsEditModalOpen(true)}
//             className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//           >
//             <Edit3 size={16} /> Edit Attributes
//           </button>
//         </section>

//         <div className="grid grid-cols-12 gap-10">
//           {/* 03. SIDEBAR NAVIGATION */}
//           <aside className="col-span-12 lg:col-span-3 space-y-2">
//             <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<User size={18}/>} label="Overview" />
//             <TabButton active={activeTab === 'professional'} onClick={() => setActiveTab('professional')} icon={<Briefcase size={18}/>} label="Career History" />
//             {/* NEW TAB BUTTON */}
// <TabButton
//   active={activeTab === 'interview'}
//   onClick={() => setActiveTab('interview')}
//   icon={<Calendar size={18}/>}
//   label="Schedule Interview"
// />
//             {/* <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={<Activity size={18}/>} label="Audit Logs" /> */}

//             <div className="mt-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
//               <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">Vulnerability Score</h4>
//               <div className="flex items-end gap-2 mb-3">
//                 <span className="text-3xl font-bold text-indigo-900 leading-none">94</span>
//                 <span className="text-sm font-semibold text-indigo-400">/100</span>
//               </div>
//               <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
//                 <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {activeTab === 'overview' && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 {savedSchedule && (
//       <div className="bg-indigo-600 rounded-[24px] p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-100">
//         <div className="flex items-center gap-6">
//           <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
//             <Calendar size={20} />
//           </div>
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Upcoming Interview</p>
//             <h4 className="text-lg font-bold">{savedSchedule.date} at {savedSchedule.time}</h4>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Interviewer</p>
//           <h4 className="font-bold">{savedSchedule.interviewerName}</h4>
//         </div>
//       </div>
//     )}
//                 <SectionHeader title="Dossier Information" />
//                 <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
//                   <InfoItem label="Legal Entity Name" value={candidate.name} icon={<User size={14} className="text-gray-400"/>} />
//                   <InfoItem label="Operational Role" value={candidate.position} icon={<Award size={14} className="text-amber-500"/>} />
//                   <InfoItem label="Secure Email" value={candidate.email} icon={<Mail size={14} className="text-blue-500"/>} />
//                   <InfoItem label="Contact Hash" value={candidate.phone} icon={<Smartphone size={14} className="text-emerald-500"/>} />
//                   <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
//                     <InfoItem label="Professional Abstract" value={candidate.bio} />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'professional' && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <SectionHeader title="Professional Credentials" />
//                 <div className="grid grid-cols-2 gap-10 mt-8">
//                   <InfoItem icon={<Hash size={14}/>} label="System Identifier" value={`UUID-${candidate.id}`} />
//                   <InfoItem icon={<Briefcase size={14}/>} label="Market Experience" value={candidate.experience} />
//                   <InfoItem icon={<GraduationCap size={14}/>} label="Academic Verification" value={candidate.education} />
//                   <InfoItem icon={<Building2 size={14}/>} label="Base Operations" value={`${candidate.location.city}, ${candidate.location.state}`} />
//                   <InfoItem icon={<Globe size={14}/>} label="Global Pincode" value={candidate.location.pincode} />
//                   <div className="col-span-2 flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl">
//                     <span className="text-xs font-medium text-gray-500">Portfolio URL</span>
//                    <button
//   onClick={() => setIsPreviewOpen(true)}
//   className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
// >
//   View Documents <ExternalLink size={14} />
// </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'interview' && (
//   <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//     <SectionHeader title="Interview Configuration" />

//     <div className="mt-8 grid grid-cols-2 gap-8">
//       {/* Mode Toggle */}
//       <div className="col-span-2 flex gap-4 p-1 bg-gray-50 rounded-2xl border border-gray-100">
//         {['online', 'physical'].map((m) => (
//           <button
//             key={m}
//             onClick={() => setScheduleForm({...scheduleForm, mode: m})}
//             className={`flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${scheduleForm.mode === m ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'}`}
//           >
//             {m} Session
//           </button>
//         ))}
//       </div>

//       <InputField
//         label="Scheduled Date"
//         type="date"
//         value={scheduleForm.date}
//         onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
//       />
//       <InputField
//         label="Start Time"
//         type="time"
//         value={scheduleForm.time}
//         onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
//       />

//       <div className="col-span-2">
//         <InputField
//           label={scheduleForm.mode === 'online' ? "Meeting URL" : "Office Location"}
//           value={scheduleForm.location}
//           onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
//         />
//       </div>

//       <div className="col-span-2 p-8 bg-indigo-50/30 rounded-[24px] border border-indigo-100 grid grid-cols-2 gap-6">
//         <div className="col-span-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Interviewer Details</div>
//         <InputField
//           label="Full Name"
//           value={scheduleForm.interviewerName}
//           onChange={(e) => setScheduleForm({...scheduleForm, interviewerName: e.target.value})}
//         />
//         <InputField
//           label="Designation"
//           value={scheduleForm.interviewerRole}
//           onChange={(e) => setScheduleForm({...scheduleForm, interviewerRole: e.target.value})}
//         />
//       </div>

//       <div className="col-span-2 pt-4">
//         <button
//           onClick={handleScheduleSubmit}
//           className="w-full bg-[#111827] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
//         >
//           <Clock size={16} /> Confirm & Notify Candidate
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//             {/* {activeTab === 'activity' && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <SectionHeader title="System Integrity Logs" />
//                 <div className="mt-10 space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
//                   <LogNode date="Jan 24, 2026" title="Identity Hash Verified" desc="KYC compliance checks completed successfully." type="success" />
//                   <LogNode date="Jan 25, 2026" title="Session Authenticated" desc="Candidate logged in via Mumbai Node (IP: 102.34...)" type="neutral" />
//                   <LogNode date="Jan 27, 2026" title="Metadata Update" desc="Administrative changes applied to professional bio." type="warning" />
//                 </div>
//               </div>
//             )} */}
//           </article>
//         </div>
//       </main>

//       {/* 05. DATA UPDATE MODAL */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 tracking-tight">Sync Entity Records</h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Updating global profile attributes</p>
//               </div>
//               <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 max-h-[65vh] overflow-y-auto">
//               <div className="grid grid-cols-2 gap-8">
//                 <InputField label="Full Entity Name" name="name" value={formData.name} onChange={handleInputChange} />
//                 <InputField label="Operational Position" name="position" value={formData.position} onChange={handleInputChange} />
//                 <InputField label="Communications Email" name="email" value={formData.email} onChange={handleInputChange} />
//                 <InputField label="Years Experience" name="experience" value={formData.experience} onChange={handleInputChange} />
//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">Profile Abstract</label>
//                   <textarea
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     rows="4"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
//               <button onClick={handleSave} className="flex-grow bg-[#111827] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
//                 <Save size={16} /> Save Record Changes
//               </button>
//               <button onClick={() => setIsEditModalOpen(false)} className="px-8 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100">
//                 Discard
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

// {isPreviewOpen && (
//   <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
//     {/* Backdrop with high-end blur */}
//     <div
//       className="absolute inset-0 bg-slate-900/20 backdrop-blur-xl"
//       onClick={() => setIsPreviewOpen(false)}
//     />

//     {/* Main Workspace Container */}
//     <div className="relative w-full max-w-7xl h-[92vh] bg-white border border-slate-200 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

//       {/* 01. INTEGRATED TOOLBAR */}
//       <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md">
//         <div className="flex items-center gap-6">
//           <button
//             onClick={() => setIsPreviewOpen(false)}
//             className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
//           >
//             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//             Back to Profile
//           </button>
//           <div className="h-4 w-px bg-slate-200" />
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
//               <FileText size={16} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none uppercase">Resume_Arjun_2026</h2>
//               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Verified Document</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Controls */}
//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
//             <Download size={14} /> Export PDF
//           </button>
//           <button
//             onClick={() => setIsPreviewOpen(false)}
//             className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>

//       <div className="flex-grow flex overflow-hidden">
//         {/* 02. DOCUMENT CANVAS */}
//         <div className="flex-grow bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar">
//           <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] p-16 relative">
//             {/* Professional Resume Content */}
//             <div className="flex justify-between items-start mb-12">
//               <div className="space-y-1">
//                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{candidate.name}</h1>
//                 <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">{candidate.position}</p>
//               </div>
//               <div className="text-right space-y-1">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{candidate.location.city}, India</p>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{candidate.email}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-12 gap-12">
//               <div className="col-span-8 space-y-10">
//                 <ResumeSection title="Executive Summary">
//                   <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{candidate.bio}</p>
//                 </ResumeSection>
//                 <ResumeSection title="Professional Experience">
//                   <ExperienceBlock title="Senior Lead" company="Global Tech" date="2022-2026" />
//                   <ExperienceBlock title="Product Engineer" company="Systematic" date="2020-2022" />
//                 </ResumeSection>
//               </div>
//               <div className="col-span-4 space-y-10">
//                 <ResumeSection title="Core Tech Stack">
//                   <div className="flex flex-wrap gap-2">
//                     {['React 19', 'Next.js', 'Typescript', 'Framer Motion', 'Tailwind'].map(s => (
//                       <span key={s} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tight">{s}</span>
//                     ))}
//                   </div>
//                 </ResumeSection>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 03. ANALYTICS SIDEBAR - Integrated with Dashboard Style */}
//         <aside className="w-[340px] border-l border-slate-100 bg-white flex flex-col p-8 space-y-10">
//           <div>
//             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-3">
//               <Activity size={14} /> Smart Insights
//             </h3>

//             <div className="space-y-8">
//               {/* Score Meter */}
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Relevance</span>
//                   <span className="text-xs font-black text-indigo-600">94%</span>
//                 </div>
//                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
//                   <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
//                 </div>
//               </div>

//               {/* Verified Metadata Blocks */}
//               <MetadataInsight label="Education" value="Verified B.Tech" icon={<GraduationCap className="text-emerald-500"/>} />
//               <MetadataInsight label="Integrity" value="No Anomalies" icon={<ShieldCheck className="text-blue-500"/>} />
//             </div>
//           </div>

//         </aside>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const TabButton = ({ active, onClick, icon, label }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-white border border-gray-200 shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'}`}
//   >
//     <span className={`${active ? 'scale-110' : 'opacity-60'}`}>{icon}</span>
//     <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
//   </button>
// );

// const SectionHeader = ({ title }) => (
//   <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-gray-100">
//     {title}
//   </h3>
// );

// // Matches the "SectionHeader" from your main dashboard
// const ResumeSection = ({ title, children }) => (
//   <div className="space-y-4">
//     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-slate-100">
//       {title}
//     </h3>
//     {children}
//   </div>
// );

// // High-density Metadata block for Sidebar
// const MetadataInsight = ({ label, value, icon }) => (
//   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-100 transition-all">
//     <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
//     <div>
//       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-none">{value}</p>
//     </div>
//   </div>
// );

// const ExperienceBlock = ({ title, company, date }) => (
//   <div className="flex justify-between items-start">
//     <div>
//       <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-none">{title}</h4>
//       <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{company}</p>
//     </div>
//     <span className="text-[10px] font-black text-slate-300 uppercase">{date}</span>
//   </div>
// );

// const InfoItem = ({ label, value, icon }) => (
//   <div className="space-y-2 group">
//     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
//       {icon} {label}
//     </div>
//     <p className="text-[15px] font-semibold text-gray-800 leading-relaxed">{value || "N/A"}</p>
//   </div>
// );

// // const InputField = ({ label, name, value, onChange }) => (
// //   <div className="flex flex-col gap-2.5">
// //     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
// //     <input
// //       type="text"
// //       name={name}
// //       value={value}
// //       onChange={onChange}
// //       className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
// //     />
// //   </div>
// // );

// const InputField = ({ label, name, value, onChange, type = "text" }) => (
//   <div className="flex flex-col gap-2.5">
//     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//     />
//   </div>
// );

// const HeroMeta = ({ icon, text }) => (
//   <div className="flex items-center gap-2 text-gray-500 font-semibold text-[13px] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
//     <span className="opacity-50">{icon}</span>
//     {text}
//   </div>
// );

// const LogNode = ({ date, title, desc, type }) => {
//   const dotColor = type === 'success' ? 'bg-emerald-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
//   return (
//     <div className="relative pl-10 group cursor-default">
//       <div className={`absolute left-0 top-1 h-5 w-5 rounded-full ${dotColor} ring-[6px] ring-white transition-transform group-hover:scale-125`} />
//       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</p>
//       <p className="text-[14px] font-bold text-gray-800 mt-1">{title}</p>
//       <p className="text-xs font-medium text-gray-500 mt-0.5 max-w-md">{desc}</p>
//     </div>
//   );
// };

// export default CandidateProfile;
//***************************************working cdoe phase 1******************************************************* */
// import React, { useState } from 'react';
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   User, Mail, Briefcase, GraduationCap, MapPin,
//   Edit3, X, Save, ArrowLeft, Building2,
//   Smartphone, Globe, ChevronRight,
//   ShieldCheck, Activity, Fingerprint, Calendar,FileText,Download,Clock,
//   Award, Hash, Link as LinkIcon, ExternalLink
// } from 'lucide-react';

// const CandidateProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   const [candidate, setCandidate] = useState({
//     id: id || "CAN-8821",
//     name: "Arjun Mehta",
//     email: "arjun.m@tech-global.com",
//     phone: "+91 98765 43210",
//     position: "Senior Frontend Lead",
//     experience: "6 Years",
//     education: "B.Tech Computer Science",
//     status: "Verified",
//     location: {
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       address: "124, Skyline Towers, Andheri East"
//     },
//     bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale."
//   });

//   const [formData, setFormData] = useState({ ...candidate });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSave = () => {
//     setCandidate(formData);
//     setIsEditModalOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased">
//       {/* 01. GLOBAL TOP NAVIGATION */}
//       <nav className="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-8 sticky top-0 z-50">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95 text-gray-500 group"
//           >
//             <ArrowLeft size={18} className="group-hover:text-gray-900" />
//           </button>
//           <div className="h-5 w-px bg-gray-200" />
//           <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
//             <span className="hover:text-gray-600 cursor-pointer transition-colors">Talent Pipeline</span>
//             <ChevronRight size={14} className="opacity-40" />
//             <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">Profile {candidate.id}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
//             <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//             {candidate.status}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto py-10 px-8">
//         {/* 02. PROFILE HERO SECTION */}
//         <section className="bg-white border border-gray-200 rounded-[24px] p-10 mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400" />

//           <div className="flex items-center gap-8">
//             <div className="relative">
//               <div className="h-24 w-24 rounded-2xl bg-[#111827] flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
//                 {candidate.name.charAt(0)}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">{candidate.name}</h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14}/>} text={candidate.email} />
//                 <HeroMeta icon={<MapPin size={14}/>} text={candidate.location.city} />
//                 <HeroMeta icon={<Calendar size={14}/>} text="Member since 2026" />
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setIsEditModalOpen(true)}
//             className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//           >
//             <Edit3 size={16} /> Edit Attributes
//           </button>
//         </section>

//         <div className="grid grid-cols-12 gap-10">
//           {/* 03. SIDEBAR NAVIGATION */}
//           <aside className="col-span-12 lg:col-span-3 space-y-2">
//             <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<User size={18}/>} label="Overview" />
//             <TabButton active={activeTab === 'professional'} onClick={() => setActiveTab('professional')} icon={<Briefcase size={18}/>} label="Career History" />
//             {/* <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={<Activity size={18}/>} label="Audit Logs" /> */}

//             <div className="mt-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
//               <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">Vulnerability Score</h4>
//               <div className="flex items-end gap-2 mb-3">
//                 <span className="text-3xl font-bold text-indigo-900 leading-none">94</span>
//                 <span className="text-sm font-semibold text-indigo-400">/100</span>
//               </div>
//               <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
//                 <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {activeTab === 'overview' && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <SectionHeader title="Dossier Information" />
//                 <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
//                   <InfoItem label="Legal Entity Name" value={candidate.name} icon={<User size={14} className="text-gray-400"/>} />
//                   <InfoItem label="Operational Role" value={candidate.position} icon={<Award size={14} className="text-amber-500"/>} />
//                   <InfoItem label="Secure Email" value={candidate.email} icon={<Mail size={14} className="text-blue-500"/>} />
//                   <InfoItem label="Contact Hash" value={candidate.phone} icon={<Smartphone size={14} className="text-emerald-500"/>} />
//                   <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
//                     <InfoItem label="Professional Abstract" value={candidate.bio} />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'professional' && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <SectionHeader title="Professional Credentials" />
//                 <div className="grid grid-cols-2 gap-10 mt-8">
//                   <InfoItem icon={<Hash size={14}/>} label="System Identifier" value={`UUID-${candidate.id}`} />
//                   <InfoItem icon={<Briefcase size={14}/>} label="Market Experience" value={candidate.experience} />
//                   <InfoItem icon={<GraduationCap size={14}/>} label="Academic Verification" value={candidate.education} />
//                   <InfoItem icon={<Building2 size={14}/>} label="Base Operations" value={`${candidate.location.city}, ${candidate.location.state}`} />
//                   <InfoItem icon={<Globe size={14}/>} label="Global Pincode" value={candidate.location.pincode} />
//                   <div className="col-span-2 flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl">
//                     <span className="text-xs font-medium text-gray-500">Portfolio URL</span>
//                    <button
//   onClick={() => setIsPreviewOpen(true)}
//   className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
// >
//   View Documents <ExternalLink size={14} />
// </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* {activeTab === 'activity' && (
//               <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <SectionHeader title="System Integrity Logs" />
//                 <div className="mt-10 space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
//                   <LogNode date="Jan 24, 2026" title="Identity Hash Verified" desc="KYC compliance checks completed successfully." type="success" />
//                   <LogNode date="Jan 25, 2026" title="Session Authenticated" desc="Candidate logged in via Mumbai Node (IP: 102.34...)" type="neutral" />
//                   <LogNode date="Jan 27, 2026" title="Metadata Update" desc="Administrative changes applied to professional bio." type="warning" />
//                 </div>
//               </div>
//             )} */}
//           </article>
//         </div>
//       </main>

//       {/* 05. DATA UPDATE MODAL */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 tracking-tight">Sync Entity Records</h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Updating global profile attributes</p>
//               </div>
//               <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 max-h-[65vh] overflow-y-auto">
//               <div className="grid grid-cols-2 gap-8">
//                 <InputField label="Full Entity Name" name="name" value={formData.name} onChange={handleInputChange} />
//                 <InputField label="Operational Position" name="position" value={formData.position} onChange={handleInputChange} />
//                 <InputField label="Communications Email" name="email" value={formData.email} onChange={handleInputChange} />
//                 <InputField label="Years Experience" name="experience" value={formData.experience} onChange={handleInputChange} />
//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">Profile Abstract</label>
//                   <textarea
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     rows="4"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
//               <button onClick={handleSave} className="flex-grow bg-[#111827] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
//                 <Save size={16} /> Save Record Changes
//               </button>
//               <button onClick={() => setIsEditModalOpen(false)} className="px-8 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100">
//                 Discard
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

// {isPreviewOpen && (
//   <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
//     {/* Backdrop with high-end blur */}
//     <div
//       className="absolute inset-0 bg-slate-900/20 backdrop-blur-xl"
//       onClick={() => setIsPreviewOpen(false)}
//     />

//     {/* Main Workspace Container */}
//     <div className="relative w-full max-w-7xl h-[92vh] bg-white border border-slate-200 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

//       {/* 01. INTEGRATED TOOLBAR */}
//       <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md">
//         <div className="flex items-center gap-6">
//           <button
//             onClick={() => setIsPreviewOpen(false)}
//             className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
//           >
//             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//             Back to Profile
//           </button>
//           <div className="h-4 w-px bg-slate-200" />
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
//               <FileText size={16} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none uppercase">Resume_Arjun_2026</h2>
//               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Verified Document</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Controls */}
//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
//             <Download size={14} /> Export PDF
//           </button>
//           <button
//             onClick={() => setIsPreviewOpen(false)}
//             className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>

//       <div className="flex-grow flex overflow-hidden">
//         {/* 02. DOCUMENT CANVAS */}
//         <div className="flex-grow bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar">
//           <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] p-16 relative">
//             {/* Professional Resume Content */}
//             <div className="flex justify-between items-start mb-12">
//               <div className="space-y-1">
//                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{candidate.name}</h1>
//                 <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">{candidate.position}</p>
//               </div>
//               <div className="text-right space-y-1">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{candidate.location.city}, India</p>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{candidate.email}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-12 gap-12">
//               <div className="col-span-8 space-y-10">
//                 <ResumeSection title="Executive Summary">
//                   <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{candidate.bio}</p>
//                 </ResumeSection>
//                 <ResumeSection title="Professional Experience">
//                   <ExperienceBlock title="Senior Lead" company="Global Tech" date="2022-2026" />
//                   <ExperienceBlock title="Product Engineer" company="Systematic" date="2020-2022" />
//                 </ResumeSection>
//               </div>
//               <div className="col-span-4 space-y-10">
//                 <ResumeSection title="Core Tech Stack">
//                   <div className="flex flex-wrap gap-2">
//                     {['React 19', 'Next.js', 'Typescript', 'Framer Motion', 'Tailwind'].map(s => (
//                       <span key={s} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tight">{s}</span>
//                     ))}
//                   </div>
//                 </ResumeSection>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 03. ANALYTICS SIDEBAR - Integrated with Dashboard Style */}
//         <aside className="w-[340px] border-l border-slate-100 bg-white flex flex-col p-8 space-y-10">
//           <div>
//             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-3">
//               <Activity size={14} /> Smart Insights
//             </h3>

//             <div className="space-y-8">
//               {/* Score Meter */}
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Relevance</span>
//                   <span className="text-xs font-black text-indigo-600">94%</span>
//                 </div>
//                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
//                   <div className="h-full bg-indigo-600 rounded-full w-[94%]" />
//                 </div>
//               </div>

//               {/* Verified Metadata Blocks */}
//               <MetadataInsight label="Education" value="Verified B.Tech" icon={<GraduationCap className="text-emerald-500"/>} />
//               <MetadataInsight label="Integrity" value="No Anomalies" icon={<ShieldCheck className="text-blue-500"/>} />
//             </div>
//           </div>

//         </aside>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const TabButton = ({ active, onClick, icon, label }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-white border border-gray-200 shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'}`}
//   >
//     <span className={`${active ? 'scale-110' : 'opacity-60'}`}>{icon}</span>
//     <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
//   </button>
// );

// const SectionHeader = ({ title }) => (
//   <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-gray-100">
//     {title}
//   </h3>
// );

// // Matches the "SectionHeader" from your main dashboard
// const ResumeSection = ({ title, children }) => (
//   <div className="space-y-4">
//     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-slate-100">
//       {title}
//     </h3>
//     {children}
//   </div>
// );

// // High-density Metadata block for Sidebar
// const MetadataInsight = ({ label, value, icon }) => (
//   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-100 transition-all">
//     <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
//     <div>
//       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-none">{value}</p>
//     </div>
//   </div>
// );

// const ExperienceBlock = ({ title, company, date }) => (
//   <div className="flex justify-between items-start">
//     <div>
//       <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-none">{title}</h4>
//       <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{company}</p>
//     </div>
//     <span className="text-[10px] font-black text-slate-300 uppercase">{date}</span>
//   </div>
// );

// const InfoItem = ({ label, value, icon }) => (
//   <div className="space-y-2 group">
//     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
//       {icon} {label}
//     </div>
//     <p className="text-[15px] font-semibold text-gray-800 leading-relaxed">{value || "N/A"}</p>
//   </div>
// );

// const InputField = ({ label, name, value, onChange }) => (
//   <div className="flex flex-col gap-2.5">
//     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
//     <input
//       type="text"
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//     />
//   </div>
// );

// const HeroMeta = ({ icon, text }) => (
//   <div className="flex items-center gap-2 text-gray-500 font-semibold text-[13px] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
//     <span className="opacity-50">{icon}</span>
//     {text}
//   </div>
// );

// const LogNode = ({ date, title, desc, type }) => {
//   const dotColor = type === 'success' ? 'bg-emerald-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
//   return (
//     <div className="relative pl-10 group cursor-default">
//       <div className={`absolute left-0 top-1 h-5 w-5 rounded-full ${dotColor} ring-[6px] ring-white transition-transform group-hover:scale-125`} />
//       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</p>
//       <p className="text-[14px] font-bold text-gray-800 mt-1">{title}</p>
//       <p className="text-xs font-medium text-gray-500 mt-0.5 max-w-md">{desc}</p>
//     </div>
//   );
// };

// export default CandidateProfile;
