import React, { useState, useEffect } from "react";
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
  UserCheck,
  Info,
  Building2,
  UserPlus,
  Smartphone,
  ChevronDown,
  Calendar,
  Globe,
  ChevronRight,
  ShieldCheck,
  Lock,
  Activity,
  Fingerprint,
Calendar as CalendarIcon, // Rename the icon here
  FileText,
  Zap,
  AlertCircle,
  ArrowUpRight,
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
import { candidateService } from "../../services/candidateService";
import { interviewService } from "../../services/interviewService";
import toast from "react-hot-toast";

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
    technicalScore: 0,
    culturalFit: 0,
    softSkills: 0,
    comments: "",
    recommendation: "", // hire, strong_hire, no_hire
  });
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState(null);

  const [rescheduleForm, setRescheduleForm] = useState({
    interview_date: "",
    mode: "online",
    meeting_link: "",
    venue_details: "",
    reason: "",
  });

  const [isNextRoundModalOpen, setIsNextRoundModalOpen] = useState(false);

  const [nextRoundForm, setNextRoundForm] = useState({
    date: "",
    time: "",
    mode: "online",
    location: "",
    interviewerName: "",
    interviewerEmail: "",
    interviewerRole: "",
  });
  const [attendanceStatus, setAttendanceStatus] = useState("");
const [attendanceLoading, setAttendanceLoading] = useState(false);


  const splitDateTime = (isoString) => {
    if (!isoString) return { date: "", time: "" };

    const d = new Date(isoString);

    const date = d.toISOString().slice(0, 10); // YYYY-MM-DD

    const time = d.toTimeString().slice(0, 5); // HH:MM (24h)

    return { date, time };
  };

  useEffect(() => {
    if (id) fetchCandidate();
  }, [id]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (candidate) {
      setFormData({
        full_name: candidate.full_name || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        address: candidate.address || "",
        status: candidate.status || "jd_pending",
        position: candidate.position || "",
        experience: candidate.experience || "",
        education: candidate.education || "",
        location: candidate.location || "",
      });
    }
  }, [candidate]);

  useEffect(() => {
    if (activeInterview && isRescheduleOpen) {
      setRescheduleForm({
        interview_date: activeInterview.interview_date
          ? new Date(activeInterview.interview_date).toISOString().slice(0, 16) // required for datetime-local
          : "",
        mode: activeInterview.mode || "online",
        meeting_link: activeInterview.meeting_link || "",
        venue_details: activeInterview.venue_details || "",
        reason: "",
      });
    }
  }, [activeInterview, isRescheduleOpen]);

  useEffect(() => {
    if (!isNextRoundModalOpen || interviews.length === 0) return;

    const last = interviews[interviews.length - 1];

    const { date, time } = splitDateTime(last.interview_date);

    setNextRoundForm({
      date,
      time,
      mode: last?.mode || "online",
      location: last?.meeting_link || last?.venue_details || "",
      interviewerName: last?.interviewer_name || "",
      interviewerEmail: last?.interviewer_email || "",
      interviewerRole: last?.interviewer_designation || "",
    });
  }, [isNextRoundModalOpen]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);

      const data = await candidateService.getById(id);
      setCandidate(data);

      if (data.interviews) {
        const normalized = data.interviews.map((i) => {
          const dt = new Date(i.interview_date);

          return {
            ...i,
            round: i.round_number,
            date: dt.toLocaleDateString(),
            time: dt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: i.mode === "online" ? i.meeting_link : i.venue_details,
            interviewerName: i.interviewer_name,
            interviewerRole: "Interviewer",
            status: i.status === "scheduled" ? "Scheduled" : i.status,
          };
        });

        setInterviews(normalized);
      } else {
        setInterviews([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  // const handleCreateNextRound = async () => {
  //   try {
  //     const payload = {
  //       candidate_id: Number(candidate.id),

  //       mode: nextRoundForm.mode,

  //       interview_date: new Date(
  //         `${nextRoundForm.date}T${nextRoundForm.time}`,
  //       ).toISOString(),

  //       interviewer_name: nextRoundForm.interviewerName,
  //       interviewer_email: nextRoundForm.interviewerEmail,
  //       interviewer_designation: nextRoundForm.interviewerRole,

  //       ...(nextRoundForm.mode === "online"
  //         ? { meeting_link: nextRoundForm.location }
  //         : { venue_details: nextRoundForm.location }),
  //     };

  //     await toast.promise(
  //       fetch("https://apihrr.goelectronix.co.in/interviews/schedule", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }),
  //       {
  //         loading: "Scheduling next round...",
  //         success: "Next round scheduled 🎉",
  //         error: "Failed to schedule",
  //       },
  //     );

  //     setIsNextRoundModalOpen(false);
  //     fetchCandidate(); // refresh interviews
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

 const handleCreateNextRound = async () => {
  try {
    const payload = {
      candidate_id: Number(candidate.id),

      mode: nextRoundForm.mode,

      interview_date: new Date(
        `${nextRoundForm.date}T${nextRoundForm.time}`
      ).toISOString(),

      interviewer_name: nextRoundForm.interviewerName,
      interviewer_email: nextRoundForm.interviewerEmail,
      interviewer_designation: nextRoundForm.interviewerRole,

      ...(nextRoundForm.mode === "online"
        ? { meeting_link: nextRoundForm.location }
        : { venue_details: nextRoundForm.location }),
    };

    await toast.promise(
      (async () => {
        const res = await fetch(
          "https://apihrr.goelectronix.co.in/interviews/schedule",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to schedule interview");
        }

        return data;
      })(),
      {
        loading: "Scheduling next round...",
        success: "Next round scheduled 🎉",
        error: (err) => err.message || "Something went wrong",
      }
    );

    setIsNextRoundModalOpen(false);
    fetchCandidate();
  } catch (err) {
    console.error("Schedule error:", err);
    // ❌ DO NOT show toast here (already handled by toast.promise)
  }
};

const GlobalTerminalLoader = () => (
  <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
    <div className="relative mb-8">
      {/* Outer Rotating Gear Effect */}
      <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
      
      {/* Pulse Rings */}
      <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
      
      {/* Central Identity Core */}
      <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
        <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
      </div>
    </div>

    {/* Technical Status Text */}
    <div className="space-y-3 text-center">
      <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
        System Protocol: Data Retrieval
      </h3>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Synchronizing with Governance Node...
        </p>
        {/* Progress Bar Micro-animation */}
        <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
        </div>
      </div>
    </div>

    {/* Security Metadata Footer */}
    <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
       <div className="flex items-center gap-1.5">
          <Lock size={10} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Encrypted Handshake</span>
       </div>
       <div className="w-1 h-1 bg-slate-200 rounded-full" />
       <div className="text-[9px] font-black uppercase tracking-tighter">ISO 27001 Verified</div>
    </div>
  </div>
);



  // if (loading) {
  //   return (
  //     <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
  //   );
  // }

    if (loading) {
    return (
      <>
      <div className="p-10 text-lg font-bold">
        <GlobalTerminalLoader />
      </div>
      </>
    );
  }

  



  if (error) {
    return <div className="p-10 text-red-500 font-bold">{error}</div>;
  }

  if (!candidate) return null;

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

  const handleFeedbackSubmit = async () => {
    if (!selectedInterview) return;

    try {
      const payload = {
        technical_skill: feedbackData.technicalScore,
        communication: feedbackData.softSkills,
        problem_solving: feedbackData.technicalScore, // adjust if you add separate score
        cultural_fit: feedbackData.culturalFit,
        relevant_experience: feedbackData.technicalScore, // optional mapping
        remarks: feedbackData.comments,
        decision: feedbackData.recommendation,
      };

      await toast.promise(
        interviewService.submitReview(selectedInterview.id, payload),
        {
          loading: "Submitting review...",
          success: "Review submitted successfully 🎉",
          error: "Failed to submit review",
        },
      );

      // ✅ Close modal
      setIsFeedbackModalOpen(false);

      // ✅ Reset form
      setFeedbackData({
        technicalScore: 0,
        culturalFit: 0,
        softSkills: 0,
        comments: "",
        recommendation: "",
      });

      // ⭐ VERY IMPORTANT → Refresh candidate
      fetchCandidate();
    } catch (err) {
      console.error(err);
    }
  };

  const updateAttendance = async (interviewId, status) => {
    try {
      await toast.promise(
        interviewService.updateAttendance(interviewId, {
          attendance_status: status,
        }),
        {
          loading: "Updating attendance...",
          success: "Attendance updated successfully",
          error: "Failed to update attendance",
        },
      );

      setIsAttendanceOpen(false);
      fetchCandidate(); // 🔁 refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!activeInterview) return;

    try {
      await toast.promise(
        interviewService.rescheduleInterview(
          activeInterview.id,
          rescheduleForm,
        ),
        {
          loading: "Rescheduling interview...",
          success: "Interview rescheduled",
          error: "Failed to reschedule interview",
        },
      );

      setIsRescheduleOpen(false);
      fetchCandidate(); // 🔁 refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await toast.promise(
        fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            status: formData.status,
            position: formData.position,
            experience: formData.experience,
            education: formData.education,
            location: formData.location,
          }),
        }),
        {
          loading: "Updating candidate...",
          success: "Candidate updated successfully ✅",
          error: "Failed to update candidate ❌",
        },
      );

      setIsEditModalOpen(false);
      fetchCandidate(); // 🔁 refresh profile
    } catch (err) {
      console.error(err);
    }
  };

  const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

  const calculateVulnerabilityScore = () => {
    if (!interviews || interviews.length === 0) return 0;

    const completed = interviews.filter(
      (i) => i.review && i.status === "completed",
    );

    if (completed.length === 0) return 0;

    const total = completed.reduce((sum, i) => {
      const avg =
        (i.review.technical_skill +
          i.review.communication +
          i.review.cultural_fit) /
        3;
      return sum + avg;
    }, 0);

    const score10 = total / completed.length; // avg out of 10
    const score100 = Math.round(score10 * 10); // convert to /100

    return score100;
  };

  const vulnerabilityScore = calculateVulnerabilityScore();

  const formatStatus = (status) => {
    if (!status) return "N/A";

    const map = {
      jd_pending: "JD Pending",
      jd_accepted: "JD Accepted",
      selected: "Selected",
      scheduled: "Scheduled",
      completed: "Completed",
      rejected: "Rejected",
      no_show: "No Show",
      attended: "Attended",
      pending: "Pending",
    };

    return (
      map[status] ||
      status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  const allowedStatuses = [
    "applied",
    "interviewing",
    "rejected",
    "jd_sent",
    "jd_accepted",
    "jd_rejected",
    "jd_pending",
  ];

  const latestInterview =
  candidate?.interviews?.length > 0
    ? [...candidate.interviews].sort(
        (a, b) => b.round_number - a.round_number
      )[0]
    : null;

const latestStatus = latestInterview?.status || null;


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
            {/* {candidate.status} */}
            {formatStatus(candidate.status)}
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
                {candidate?.name?.charAt(0) || "?"}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
                <Fingerprint size={16} className="text-indigo-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {candidate.full_name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
                <HeroMeta
                  icon={<MapPin size={14} />}
                  text={candidate.location}
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

            <div className="mt-8 border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden font-sans transition-all hover:shadow-md">
              {/* HEADER */}
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      vulnerabilityScore > 70
                        ? "bg-rose-500"
                        : vulnerabilityScore > 40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    {/* Vulnerability Analysis */}
                    Interview Review
                  </h4>
                </div>

                <span className="text-[9px] whitespace-nowrap font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded tracking-wider uppercase">
                  {/* Live Sync */}
                     Auto Calculated
                </span>
              </div>

              {/* BODY */}
              <div className="p-6">
                {/* SCORE + THREAT */}
                <div className="flex items-baseline justify-between mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                      {vulnerabilityScore}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      /100
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {/* Threat Level */}
                       Result
                    </span>

                    <span
                      className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wide ${
                        vulnerabilityScore > 70
                          ? "bg-rose-50 text-rose-700"
                          : vulnerabilityScore > 40
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {vulnerabilityScore > 70
                        ? "Strong"
                        : vulnerabilityScore > 40
                          ? "Average"
                          : "Weak"}
                    </span>
                  </div>
                </div>

                {/* SEGMENTED ENTERPRISE BAR */}
                <div className="flex gap-[2px] h-3 w-full mb-2">
                  {[...Array(20)].map((_, i) => {
                    const active = i < vulnerabilityScore / 5;

                    const color =
                      vulnerabilityScore > 70
                        ? "bg-rose-500"
                        : vulnerabilityScore > 40
                          ? "bg-amber-500"
                          : "bg-slate-900";

                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm transition-all duration-500 ${
                          active ? color : "bg-slate-100"
                        }`}
                        style={{ transitionDelay: `${i * 18}ms` }}
                      />
                    );
                  })}
                </div>

                {/* LABEL SCALE */}
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 04. CONTENT ENGINE */}
          <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
            {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

            {/* --- ACTION TRIGGER BANNER --- */}
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
                                <CalendarIcon size={18} />
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

                              <div className="flex flex-col items-end gap-2">
                                <div
                                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                    i.status === "Completed"
                                      ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  }`}
                                >
                                  {i.status}
                                </div>

                                {i.attendance_status === "pending" ? (
                                  <div className="flex flex-col items-end gap-2">
                                    <button
                                      onClick={() => {
                                        setActiveInterview(i);
                                        setIsRescheduleOpen(true);
                                      }}
                                      className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
                                    >
                                      Reschedule
                                    </button>

                                    <button
                                      onClick={() => {
                                        setActiveInterview(i);
                                        setIsAttendanceOpen(true);
                                      }}
                                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
                                    >
                                      Interview Status
                                    </button>
                                  </div>
                                ) : i.attendance_status === "no_show" ? (
                                  /* 🔴 NO SHOW – NEW CONDITION */
                                  <button
                                    onClick={() => {
                                      setActiveInterview(i);
                                      setIsRescheduleOpen(true);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
                                  >
                                    Schedule Again
                                  </button>
                                ) : (
                                  <>
                                    {i.status === "completed" && i.review ? (
                                      <div className="flex flex-col items-end gap-2">
                                        {/* SCORE */}
                                        <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
                                          <Star size={12} fill="currentColor" />
                                          SCORE:{" "}
                                          {i.review.total_score.toFixed(1)}
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setSelectedInterview(i);
                                          setIsFeedbackModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                                      >
                                        Evaluate <ExternalLink size={12} />
                                      </button>
                                    )}
                                  </>
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

                      {/* <button
                       onClick={() => navigate(`/invitation/${id}/scheduleinterview`)}
                        className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all"
                      >
                        Initialize Round 01 <ArrowRight size={14} />
                      </button> */}
                      <button
  onClick={() => navigate(`/invitation/${id}/scheduleinterview`)}
  className="mt-10 group relative flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 overflow-hidden"
>
  {/* SHIMMER EFFECT - Enterprise Detail */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

  <div className="flex flex-col items-start">

    <span className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
      Initialize Round <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </span>
  </div>

  {/* ICON BACKDROP */}
  <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
    <Calendar size={60} strokeWidth={1} />
  </div>
</button>
                    </div>
                  )}
                </div>

                {/* NEXT ROUND SCHEDULER BAR */}
                {/* <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      Next Round Schedule
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Create and deploy next interview round
                    </span>
                  </div>

                  <button
                    onClick={() => setIsNextRoundModalOpen(true)}
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                  >
                    Schedule Next Round
                  </button>
                </div> */}

                {/* NEXT ROUND SCHEDULER BAR */}
{/* <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4">

  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
      Next Round Schedule
    </span>

    {latestStatus === "scheduled" ? (
      <span className="text-xs text-red-500 font-semibold">
        Please complete the latest round first
      </span>
    ) : latestStatus === "completed" ? (
      <span className="text-xs text-slate-500 font-semibold">
        Latest round completed. You can schedule next round.
      </span>
    ) : (
      <span className="text-xs text-slate-400 font-semibold">
        No interview data found
      </span>
    )}
  </div>


  {latestStatus === "completed" && (
    <button
      onClick={() => setIsNextRoundModalOpen(true)}
      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
    >
      Schedule Next Round
    </button>
  )}
 

</div> */}

<div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4">

  <div className="flex flex-col">
   

    {/* 🟢 Candidate Selected */}
    {candidate.status?.toLowerCase() === "selected" ? (
     <>
      
      <span className="text-xs text-emerald-600 font-semibold">
        Candidate Selected — Interview process completed
      </span>
     </>

    ) : latestStatus === "scheduled" ? (
      <span className="text-xs text-red-500 font-semibold">
        Please complete the latest round first
      </span>

    ) : latestStatus === "completed" ? (
      <span className="text-xs text-slate-500 font-semibold">
        Latest round completed. You can schedule next round.
      </span>

    ) : (
      <span className="text-xs text-slate-400 font-semibold">
        No interview data found
      </span>
    )}
  </div>

  {/* ❌ Hide button when candidate is selected */}
  {latestStatus === "completed" &&
   candidate.status?.toLowerCase() !== "selected" && (
    <button
      onClick={() => setIsNextRoundModalOpen(true)}
      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
    >
      Schedule Next Round
    </button>
  )}
</div>



                <SectionHeader title="Candidate Information" />
                <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
                  <InfoItem
                    label="Candidate Name"
                    // value={candidate.full_name}
                     value={candidate.full_name?.toUpperCase()}
                    icon={<User size={14} className="text-gray-400" />}
                  />
                  <InfoItem
                    label="Operational Role"
                    value={candidate.position?.toUpperCase()}
                    icon={<Award size={14} className="text-amber-500" />}
                  />
                  <InfoItem
                    label="Contact Email"
                    value={candidate.email}
                    icon={<Mail size={14} className="text-blue-500" />}
                  />
                  <InfoItem
                    label="Contact Number"
                    value={candidate.phone?.toUpperCase()}
                    icon={<Smartphone size={14} className="text-emerald-500" />}
                  />
                  <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <InfoItem
                      label="Professional Abstract"
                      value={candidate.bio?.toUpperCase()}
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
                    label="Candidate Id"
                    value={`${candidate.id}`}
                  />
                  {/* <InfoItem
                    icon={<Briefcase size={14} />}
                    label="Market Experience"
                    value={candidate.experience}
                  /> */}
                  <InfoItem
  icon={<Briefcase size={14} />}
  label="Market Experience"
  value={
    candidate.experience
      ? `${candidate.experience} Years`
      : "N/A"
  }
/>

                  <InfoItem
                    icon={<GraduationCap size={14} />}
                    label="Academic Details"
                    value={candidate.education?.toUpperCase()}
                  />
                  <InfoItem
                    icon={<Building2 size={14} />}
                    label="Base Operations"
                    value={`${candidate.location?.toUpperCase()}`}
                    // value={`${candidate.location.city}, ${candidate.location.state}`}
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

                  {allowedStatuses.includes(candidate.status) && (
                    <div className="col-span-2 flex items-center justify-end p-4">
                      <button
                        onClick={() =>
                          navigate(`/invitation/${id}/scheduleinterview`)
                        }
                        className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
                      >
                        <Edit3 size={16} /> Interview Schedule
                      </button>
                    </div>
                  )}
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
                  {/* Sync Entity Records */}
                  Edit Candidate Data
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {/* Updating global profile attributes */}
                  Updating candidate profile information
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
                  value={formData.full_name}
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
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
                    Candidate Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  >
                    <option value="jd_pending">JD Pending</option>
                    <option value="jd_accepted">JD Accepted</option>
                    <option value="selected">Selected</option>
                  </select>
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
                      Resume
                    </h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Status: Uploaded Document
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3">
                {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
                  <Download size={14} /> Export PDF
                </button> */}
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
              {/* <div className="flex-grow bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] p-16 relative">
                

             
                  <div className="w-full h-full">
                    {candidate.resume_path ? (
                      isPdf(candidate.resume_path) ? (
                        <iframe
                          src={candidate.resume_path}
                          title="Candidate Resume"
                          className="w-full h-[1000px] rounded-xl border border-slate-200"
                        />
                      ) : (
                        <img
                          src={candidate.resume_path}
                          alt="Candidate Resume"
                          className="w-full rounded-xl border border-slate-200"
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
                        No Resume Uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div> */}

              <div className="flex-grow bg-slate-50/50 p-6 overflow-hidden">
  <div className="w-full h-full max-w-[900px] mx-auto bg-white rounded-xl shadow border border-slate-100 relative flex flex-col">

    {/* Resume Viewer */}
    <div className="flex-grow w-full h-full overflow-hidden rounded-xl">
      {candidate.resume_path ? (
        isPdf(candidate.resume_path) ? (
          <iframe
            // src={candidate.resume_path}
            src={`${candidate.resume_path}#zoom=51&toolbar=0&navpanes=0&scrollbar=0`}
            title="Candidate Resume"
            className="w-full h-full min-h-[70vh] border-0 rounded-xl"
          />
        ) : (
          <img
            src={candidate.resume_path}
            alt="Candidate Resume"
            className="w-full h-full object-contain rounded-xl"
          />
        )
      ) : (
        <div className="flex items-center justify-center h-[70vh] text-slate-400 text-sm font-bold uppercase tracking-widest">
          No Resume Uploaded
        </div>
      )}
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
                    {/* <div className="space-y-3">
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
                    </div> */}

                    {/* Verified Metadata Blocks */}
                    <MetadataInsight
                      label="Education"
                      value={`Completed ${candidate.education}`}
                      icon={<GraduationCap className="text-emerald-500" />}
                    />
                    {/* <MetadataInsight
                      label="Integrity"
                      value="No Anomalies"
                      icon={<ShieldCheck className="text-blue-500" />}
                    /> */}
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
                  <ShieldAlert size={16} className="text-indigo-600" /> Final
                  Determination Panel
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  Authorized Personnel Only
                </p>
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
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Protocol Remarks
                  </label>
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

      {isRescheduleOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* High-fidelity Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={() => setIsRescheduleOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
            {/* Header: Timeline Modification */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Clock size={20} />
                </div>
                <div>
                  
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                    Reschedule Interview — Round {activeInterview?.round_number}
                  </h3>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Update Interview Date & Time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRescheduleOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Core Scheduling Logic */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Target Timestamp
                  </label>
                  <div className="relative group">
                    <CalendarIcon
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                    />
                    <input
                      type="datetime-local"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
                      value={rescheduleForm.interview_date}
                      onChange={(e) =>
                        setRescheduleForm({
                          ...rescheduleForm,
                          interview_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Interaction Mode
                  </label>
                  <div className="relative group">
                    <Globe
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                    />
                    <select
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
                      value={rescheduleForm.mode}
                      onChange={(e) =>
                        setRescheduleForm({
                          ...rescheduleForm,
                          mode: e.target.value,
                        })
                      }
                    >
                      <option value="online">Virtual / Online</option>
                      <option value="offline">On-Site / Physical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Context-Aware Location Field */}
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {rescheduleForm.mode === "online"
                    ? "Digital Access Link"
                    : "Facility / Venue Details"}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {rescheduleForm.mode === "online" ? (
                      <Zap size={14} />
                    ) : (
                      <MapPin size={14} />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={
                      rescheduleForm.mode === "online"
                        ? "https://meet.google.com/..."
                        : "Boardroom 4C, Level 2"
                    }
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
                    value={
                      rescheduleForm.mode === "online"
                        ? rescheduleForm.meeting_link
                        : rescheduleForm.venue_details
                    }
                    onChange={(e) =>
                      setRescheduleForm({
                        ...rescheduleForm,
                        [rescheduleForm.mode === "online"
                          ? "meeting_link"
                          : "venue_details"]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Audit Log / Reason */}
              <div className="space-y-2">
                <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Justification for Reschedule
                </label>
                <textarea
                  placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
                  className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
                  value={rescheduleForm.reason}
                  onChange={(e) =>
                    setRescheduleForm({
                      ...rescheduleForm,
                      reason: e.target.value,
                    })
                  }
                />
              </div>

              {/* Warning Policy Card */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle size={16} className="text-amber-500 shrink-0" />
                <p className="text-[10px] font-medium text-amber-800 leading-tight">
                  <strong>Policy Notice:</strong> Rescheduling will
                  automatically trigger an email notification to the candidate
                  and update the internal calendar registry.
                </p>
              </div>
            </div>

            {/* Footer: Execution Bar */}
            <div className="p-6 bg-slate-900 flex items-center justify-between">
              <button
                onClick={() => setIsRescheduleOpen(false)}
                className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleRescheduleSubmit}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
              >
                Confirm Adjustment
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {isAttendanceOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Backdrop with extreme glass effect */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={() => setIsAttendanceOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
            {/* Header: Disposition Logic */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                    Attendance Registry
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Post-Interview Disposition
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAttendanceOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Candidate Meta Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Active Interviewee
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {activeInterview?.candidate_name || "Unidentified Asset"}
                  </span>
                </div>
                <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
                  ID:{" "}
                  {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
                    "N/A"}
                </div>
              </div>

              {/* Status Selection: High-Contrast Interaction */}
              <div className="space-y-3">
                <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Update Final Status
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <Activity size={16} />
                  </div>
                  {/* <select
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
                    onChange={(e) =>
                      updateAttendance(activeInterview.id, e.target.value)
                    }
                  >
                    <option value="">Select Protocol</option>
                    <option value="attended" className="text-emerald-600">
                      ✓ Mark as Attended
                    </option>
                    <option value="no_show" className="text-rose-600">
                      ✗ Report No-Show
                    </option>
                  </select> */}
                  <select
  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
  value={attendanceStatus}
  onChange={(e) => setAttendanceStatus(e.target.value)}
>
  <option value="">Select Protocol</option>

  <option value="attended" className="text-emerald-600">
    ✓ Mark as Attended
  </option>

  <option value="no_show" className="text-rose-600">
    ✗ Report No-Show
  </option>
</select>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* System Notice */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <ShieldAlert
                  size={16}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
                  <strong>Audit Note:</strong> Changing this status will update
                  the candidate's lifecycle history and notify the assigned
                  hiring manager. This action is logged under your session.
                </p>
              </div>
            </div>

            {/* Footer: Close Execution */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              {/* <button
                onClick={() => setIsAttendanceOpen(false)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
              >
                Confirm & Close
              </button> */}
              <button
  disabled={attendanceLoading}
  onClick={async () => {
    if (!attendanceStatus) {
      toast.error("Please select attendance status");
      return;
    }

    try {
      setAttendanceLoading(true);

      await updateAttendance(activeInterview.id, attendanceStatus);

      toast.success("Attendance updated");

      setIsAttendanceOpen(false);
      setAttendanceStatus(""); // reset dropdown
    } catch (err) {
      toast.error(err?.message || "Failed to update attendance");
    } finally {
      setAttendanceLoading(false);
    }
  }}
  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-60"
>
  {attendanceLoading ? "Updating..." : "Confirm & Close"}
</button>

            </div>
          </div>
        </div>
      )}

      {isNextRoundModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsNextRoundModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Schedule Interview
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">
                  Next Round Orchestration
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <CalendarIcon className="text-indigo-600" size={24} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Main Form Area */}
              <div className="flex-1 p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Section: Logistics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Timing & Logistics
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Interview Date
                      </label>
                      <div className="relative">
                        <CalendarIcon
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                          size={16}
                        />
                        <input
                          type="date"
                          value={nextRoundForm.date}
                          onChange={(e) =>
                            setNextRoundForm({
                              ...nextRoundForm,
                              date: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Interview Time
                      </label>
                      <div className="relative">
                        <Clock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                          size={16}
                        />
                        <input
                          type="time"
                          value={nextRoundForm.time}
                          onChange={(e) =>
                            setNextRoundForm({
                              ...nextRoundForm,
                              time: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                        Interview Mode
                      </label>
                      <div className="relative">
                        <ShieldCheck
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                          size={16}
                        />
                        <select
                          value={nextRoundForm.mode}
                          onChange={(e) =>
                            setNextRoundForm({
                              ...nextRoundForm,
                              mode: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 appearance-none outline-none transition-all shadow-sm"
                        >
                          <option value="online">Online Conference</option>
                          <option value="offline">In-Person Meeting</option>
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={14}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                        {nextRoundForm.mode === "online"
                          ? "Meeting Link"
                          : "Venue Details"}
                      </label>
                      <div className="relative">
                        <Info
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder={
                            nextRoundForm.mode === "online"
                              ? "https://zoom.us/j/..."
                              : "Enter conference room"
                          }
                          value={nextRoundForm.location}
                          onChange={(e) =>
                            setNextRoundForm({
                              ...nextRoundForm,
                              location: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Personnel */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <UserPlus size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Interviewer Personnel
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserPlus
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={nextRoundForm.interviewerName}
                          onChange={(e) =>
                            setNextRoundForm({
                              ...nextRoundForm,
                              interviewerName: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
                        Professional Role
                      </label>
                      <div className="relative">
                        <ShieldCheck
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="e.g. Senior Architect"
                          value={nextRoundForm.interviewerRole}
                          onChange={(e) =>
                            setNextRoundForm({
                              ...nextRoundForm,
                              interviewerRole: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
                      Email Address
                    </label>
                    <div className="relative">
                      <MessageSquare
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
                        size={16}
                      />
                      <input
                        type="email"
                        placeholder="interviewer@company.com"
                        value={nextRoundForm.interviewerEmail}
                        onChange={(e) =>
                          setNextRoundForm({
                            ...nextRoundForm,
                            interviewerEmail: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full md:w-64 bg-slate-50/50 p-8 border-l border-slate-100 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      System Notice
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Generating this round will notify the candidate and
                      reserve the interviewer's calendar slot automatically.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <Fingerprint
                      className="absolute -right-2 -bottom-2 text-slate-50"
                      size={60}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-700 uppercase">
                          Live Draft
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500">
                        Awaiting dispatch...
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsNextRoundModalOpen(false)}
                  className="mt-8 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  Discard Round
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                Enterprise Talent v4.0
              </p>
              <button
                onClick={handleCreateNextRound}
                className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                Dispatch Invite
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsFeedbackModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            {/* Left: Scoreboard Sidebar (35%) */}
            <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Pending Review
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  Scorecard <br />
                  Analysis
                </h2>
              </div>

              <div className="space-y-8 flex-grow">
                <RatingRow
                  label="Technical Logic"
                  icon={Cpu}
                  value={feedbackData.technicalScore}
                  onChange={(val) =>
                    setFeedbackData({ ...feedbackData, technicalScore: val })
                  }
                />
                <RatingRow
                  label="Cultural Synergy"
                  icon={Users}
                  value={feedbackData.culturalFit}
                  onChange={(val) =>
                    setFeedbackData({ ...feedbackData, culturalFit: val })
                  }
                />
                <RatingRow
                  label="Articulate/Comms"
                  icon={MessageSquare}
                  value={feedbackData.softSkills}
                  onChange={(val) =>
                    setFeedbackData({ ...feedbackData, softSkills: val })
                  }
                />
              </div>

              <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                  Aggregate Intelligence
                </p>
                <div className="text-3xl font-black italic">
                  {(
                    (feedbackData.technicalScore +
                      feedbackData.culturalFit +
                      feedbackData.softSkills) /
                    3
                  ).toFixed(1)}
                  <span className="text-lg opacity-50 not-italic ml-1">
                    /10
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Narrative & Conclusion (62%) */}
            <div className="flex-grow p-8 lg:p-10 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    Final Verdict
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Please provide your executive recommendation below.
                  </p>
                </div>
                <button
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow space-y-8">
                {/* Detailed Narrative */}
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
                    Candidate Assessment Narrative
                  </label>
                  <textarea
                    rows="6"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
                    placeholder="Highlight key strengths, weaknesses, and overall impression..."
                    value={feedbackData.comments}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        comments: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Decision Buttons */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Decision Path
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "reject",
                        label: "Reject",
                        color: "hover:border-red-500 hover:text-red-600",
                        active: "bg-red-50 border-red-500 text-red-600",
                      },
                      {
                        id: "pass",
                        label: "Pass",
                        color: "hover:border-indigo-500 hover:text-indigo-600",
                        active:
                          "bg-indigo-50 border-indigo-500 text-indigo-600",
                      },
                      {
                        id: "strong_pass",
                        label: "Strong Pass",
                        color:
                          "hover:border-emerald-500 hover:text-emerald-600",
                        active:
                          "bg-emerald-50 border-emerald-500 text-emerald-600",
                      },
                    ].map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() =>
                          setFeedbackData({
                            ...feedbackData,
                            recommendation: rec.id,
                          })
                        }
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
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
          {label}
        </span>
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
//***************************************************working code phase 1 14/07/26************************************************************* */
// import React, { useState, useEffect } from "react";
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
//   UserCheck,
//   Info,
//   Building2,
//   UserPlus,
//   Smartphone,
//   ChevronDown,
//   Calendar,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Lock,
//   Activity,
//   Fingerprint,
// Calendar as CalendarIcon, // Rename the icon here
//   FileText,
//   Zap,
//   AlertCircle,
//   ArrowUpRight,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   ShieldAlert,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import { interviewService } from "../../services/interviewService";
// import toast from "react-hot-toast";

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
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     technicalScore: 0,
//     culturalFit: 0,
//     softSkills: 0,
//     comments: "",
//     recommendation: "", // hire, strong_hire, no_hire
//   });
//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
//   const [activeInterview, setActiveInterview] = useState(null);

//   const [rescheduleForm, setRescheduleForm] = useState({
//     interview_date: "",
//     mode: "online",
//     meeting_link: "",
//     venue_details: "",
//     reason: "",
//   });

//   const [isNextRoundModalOpen, setIsNextRoundModalOpen] = useState(false);

//   const [nextRoundForm, setNextRoundForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerEmail: "",
//     interviewerRole: "",
//   });

//   const splitDateTime = (isoString) => {
//     if (!isoString) return { date: "", time: "" };

//     const d = new Date(isoString);

//     const date = d.toISOString().slice(0, 10); // YYYY-MM-DD

//     const time = d.toTimeString().slice(0, 5); // HH:MM (24h)

//     return { date, time };
//   };

//   useEffect(() => {
//     if (id) fetchCandidate();
//   }, [id]);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (candidate) {
//       setFormData({
//         full_name: candidate.full_name || "",
//         email: candidate.email || "",
//         phone: candidate.phone || "",
//         address: candidate.address || "",
//         status: candidate.status || "jd_pending",
//         position: candidate.position || "",
//         experience: candidate.experience || "",
//         education: candidate.education || "",
//         location: candidate.location || "",
//       });
//     }
//   }, [candidate]);

//   useEffect(() => {
//     if (activeInterview && isRescheduleOpen) {
//       setRescheduleForm({
//         interview_date: activeInterview.interview_date
//           ? new Date(activeInterview.interview_date).toISOString().slice(0, 16) // required for datetime-local
//           : "",
//         mode: activeInterview.mode || "online",
//         meeting_link: activeInterview.meeting_link || "",
//         venue_details: activeInterview.venue_details || "",
//         reason: "",
//       });
//     }
//   }, [activeInterview, isRescheduleOpen]);

//   useEffect(() => {
//     if (!isNextRoundModalOpen || interviews.length === 0) return;

//     const last = interviews[interviews.length - 1];

//     const { date, time } = splitDateTime(last.interview_date);

//     setNextRoundForm({
//       date,
//       time,
//       mode: last?.mode || "online",
//       location: last?.meeting_link || last?.venue_details || "",
//       interviewerName: last?.interviewer_name || "",
//       interviewerEmail: last?.interviewer_email || "",
//       interviewerRole: last?.interviewer_designation || "",
//     });
//   }, [isNextRoundModalOpen]);

//   const fetchCandidate = async () => {
//     try {
//       setLoading(true);

//       const data = await candidateService.getById(id);
//       setCandidate(data);

//       if (data.interviews) {
//         const normalized = data.interviews.map((i) => {
//           const dt = new Date(i.interview_date);

//           return {
//             ...i,
//             round: i.round_number,
//             date: dt.toLocaleDateString(),
//             time: dt.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             location: i.mode === "online" ? i.meeting_link : i.venue_details,
//             interviewerName: i.interviewer_name,
//             interviewerRole: "Interviewer",
//             status: i.status === "scheduled" ? "Scheduled" : i.status,
//           };
//         });

//         setInterviews(normalized);
//       } else {
//         setInterviews([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   // const handleCreateNextRound = async () => {
//   //   try {
//   //     const payload = {
//   //       candidate_id: Number(candidate.id),

//   //       mode: nextRoundForm.mode,

//   //       interview_date: new Date(
//   //         `${nextRoundForm.date}T${nextRoundForm.time}`,
//   //       ).toISOString(),

//   //       interviewer_name: nextRoundForm.interviewerName,
//   //       interviewer_email: nextRoundForm.interviewerEmail,
//   //       interviewer_designation: nextRoundForm.interviewerRole,

//   //       ...(nextRoundForm.mode === "online"
//   //         ? { meeting_link: nextRoundForm.location }
//   //         : { venue_details: nextRoundForm.location }),
//   //     };

//   //     await toast.promise(
//   //       fetch("https://apihrr.goelectronix.co.in/interviews/schedule", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(payload),
//   //       }),
//   //       {
//   //         loading: "Scheduling next round...",
//   //         success: "Next round scheduled 🎉",
//   //         error: "Failed to schedule",
//   //       },
//   //     );

//   //     setIsNextRoundModalOpen(false);
//   //     fetchCandidate(); // refresh interviews
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

//  const handleCreateNextRound = async () => {
//   try {
//     const payload = {
//       candidate_id: Number(candidate.id),

//       mode: nextRoundForm.mode,

//       interview_date: new Date(
//         `${nextRoundForm.date}T${nextRoundForm.time}`
//       ).toISOString(),

//       interviewer_name: nextRoundForm.interviewerName,
//       interviewer_email: nextRoundForm.interviewerEmail,
//       interviewer_designation: nextRoundForm.interviewerRole,

//       ...(nextRoundForm.mode === "online"
//         ? { meeting_link: nextRoundForm.location }
//         : { venue_details: nextRoundForm.location }),
//     };

//     await toast.promise(
//       (async () => {
//         const res = await fetch(
//           "https://apihrr.goelectronix.co.in/interviews/schedule",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data?.message || "Failed to schedule interview");
//         }

//         return data;
//       })(),
//       {
//         loading: "Scheduling next round...",
//         success: "Next round scheduled 🎉",
//         error: (err) => err.message || "Something went wrong",
//       }
//     );

//     setIsNextRoundModalOpen(false);
//     fetchCandidate();
//   } catch (err) {
//     console.error("Schedule error:", err);
//     // ❌ DO NOT show toast here (already handled by toast.promise)
//   }
// };

// const GlobalTerminalLoader = () => (
//   <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//     <div className="relative mb-8">
//       {/* Outer Rotating Gear Effect */}
//       <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
      
//       {/* Pulse Rings */}
//       <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
      
//       {/* Central Identity Core */}
//       <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//         <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//       </div>
//     </div>

//     {/* Technical Status Text */}
//     <div className="space-y-3 text-center">
//       <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
//         System Protocol: Data Retrieval
//       </h3>
//       <div className="flex flex-col items-center gap-1">
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//           Synchronizing with Governance Node...
//         </p>
//         {/* Progress Bar Micro-animation */}
//         <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
//           <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
//         </div>
//       </div>
//     </div>

//     {/* Security Metadata Footer */}
//     <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
//        <div className="flex items-center gap-1.5">
//           <Lock size={10} />
//           <span className="text-[9px] font-black uppercase tracking-tighter">Encrypted Handshake</span>
//        </div>
//        <div className="w-1 h-1 bg-slate-200 rounded-full" />
//        <div className="text-[9px] font-black uppercase tracking-tighter">ISO 27001 Verified</div>
//     </div>
//   </div>
// );



//   // if (loading) {
//   //   return (
//   //     <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
//   //   );
//   // }

//     if (loading) {
//     return (
//       <>
//       <div className="p-10 text-lg font-bold">
//         <GlobalTerminalLoader />
//       </div>
//       </>
//     );
//   }

  



//   if (error) {
//     return <div className="p-10 text-red-500 font-bold">{error}</div>;
//   }

//   if (!candidate) return null;

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

//   const handleFeedbackSubmit = async () => {
//     if (!selectedInterview) return;

//     try {
//       const payload = {
//         technical_skill: feedbackData.technicalScore,
//         communication: feedbackData.softSkills,
//         problem_solving: feedbackData.technicalScore, // adjust if you add separate score
//         cultural_fit: feedbackData.culturalFit,
//         relevant_experience: feedbackData.technicalScore, // optional mapping
//         remarks: feedbackData.comments,
//         decision: feedbackData.recommendation,
//       };

//       await toast.promise(
//         interviewService.submitReview(selectedInterview.id, payload),
//         {
//           loading: "Submitting review...",
//           success: "Review submitted successfully 🎉",
//           error: "Failed to submit review",
//         },
//       );

//       // ✅ Close modal
//       setIsFeedbackModalOpen(false);

//       // ✅ Reset form
//       setFeedbackData({
//         technicalScore: 0,
//         culturalFit: 0,
//         softSkills: 0,
//         comments: "",
//         recommendation: "",
//       });

//       // ⭐ VERY IMPORTANT → Refresh candidate
//       fetchCandidate();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateAttendance = async (interviewId, status) => {
//     try {
//       await toast.promise(
//         interviewService.updateAttendance(interviewId, {
//           attendance_status: status,
//         }),
//         {
//           loading: "Updating attendance...",
//           success: "Attendance updated successfully",
//           error: "Failed to update attendance",
//         },
//       );

//       setIsAttendanceOpen(false);
//       fetchCandidate(); // 🔁 refresh UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!activeInterview) return;

//     try {
//       await toast.promise(
//         interviewService.rescheduleInterview(
//           activeInterview.id,
//           rescheduleForm,
//         ),
//         {
//           loading: "Rescheduling interview...",
//           success: "Interview rescheduled",
//           error: "Failed to reschedule interview",
//         },
//       );

//       setIsRescheduleOpen(false);
//       fetchCandidate(); // 🔁 refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await toast.promise(
//         fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             full_name: formData.full_name,
//             email: formData.email,
//             phone: formData.phone,
//             address: formData.address,
//             status: formData.status,
//             position: formData.position,
//             experience: formData.experience,
//             education: formData.education,
//             location: formData.location,
//           }),
//         }),
//         {
//           loading: "Updating candidate...",
//           success: "Candidate updated successfully ✅",
//           error: "Failed to update candidate ❌",
//         },
//       );

//       setIsEditModalOpen(false);
//       fetchCandidate(); // 🔁 refresh profile
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

//   const calculateVulnerabilityScore = () => {
//     if (!interviews || interviews.length === 0) return 0;

//     const completed = interviews.filter(
//       (i) => i.review && i.status === "completed",
//     );

//     if (completed.length === 0) return 0;

//     const total = completed.reduce((sum, i) => {
//       const avg =
//         (i.review.technical_skill +
//           i.review.communication +
//           i.review.cultural_fit) /
//         3;
//       return sum + avg;
//     }, 0);

//     const score10 = total / completed.length; // avg out of 10
//     const score100 = Math.round(score10 * 10); // convert to /100

//     return score100;
//   };

//   const vulnerabilityScore = calculateVulnerabilityScore();

//   const formatStatus = (status) => {
//     if (!status) return "N/A";

//     const map = {
//       jd_pending: "JD Pending",
//       jd_accepted: "JD Accepted",
//       selected: "Selected",
//       scheduled: "Scheduled",
//       completed: "Completed",
//       rejected: "Rejected",
//       no_show: "No Show",
//       attended: "Attended",
//       pending: "Pending",
//     };

//     return (
//       map[status] ||
//       status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//     );
//   };

//   const allowedStatuses = [
//     "applied",
//     "interviewing",
//     "rejected",
//     "jd_sent",
//     "jd_accepted",
//     "jd_rejected",
//     "jd_pending",
//   ];

//   const latestInterview =
//   candidate?.interviews?.length > 0
//     ? [...candidate.interviews].sort(
//         (a, b) => b.round_number - a.round_number
//       )[0]
//     : null;

// const latestStatus = latestInterview?.status || null;


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
//             {/* {candidate.status} */}
//             {formatStatus(candidate.status)}
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
//                 {candidate?.name?.charAt(0) || "?"}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.full_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location}
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

//             <div className="mt-8 border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden font-sans transition-all hover:shadow-md">
//               {/* HEADER */}
//               <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-2.5 h-2.5 rounded-full animate-pulse ${
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-emerald-500"
//                     }`}
//                   />
//                   <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
//                     {/* Vulnerability Analysis */}
//                     Interview Review
//                   </h4>
//                 </div>

//                 <span className="text-[9px] whitespace-nowrap font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded tracking-wider uppercase">
//                   {/* Live Sync */}
//                      Auto Calculated
//                 </span>
//               </div>

//               {/* BODY */}
//               <div className="p-6">
//                 {/* SCORE + THREAT */}
//                 <div className="flex items-baseline justify-between mb-6">
//                   <div className="flex items-end gap-1">
//                     <span className="text-5xl font-black text-slate-900 tracking-tight leading-none">
//                       {vulnerabilityScore}
//                     </span>
//                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       /100
//                     </span>
//                   </div>

//                   <div className="text-right flex flex-col items-end">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       {/* Threat Level */}
//                        Result
//                     </span>

//                     <span
//                       className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wide ${
//                         vulnerabilityScore > 70
//                           ? "bg-rose-50 text-rose-700"
//                           : vulnerabilityScore > 40
//                             ? "bg-amber-50 text-amber-700"
//                             : "bg-emerald-50 text-emerald-700"
//                       }`}
//                     >
//                       {vulnerabilityScore > 70
//                         ? "Strong"
//                         : vulnerabilityScore > 40
//                           ? "Average"
//                           : "Weak"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* SEGMENTED ENTERPRISE BAR */}
//                 <div className="flex gap-[2px] h-3 w-full mb-2">
//                   {[...Array(20)].map((_, i) => {
//                     const active = i < vulnerabilityScore / 5;

//                     const color =
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-slate-900";

//                     return (
//                       <div
//                         key={i}
//                         className={`flex-1 rounded-sm transition-all duration-500 ${
//                           active ? color : "bg-slate-100"
//                         }`}
//                         style={{ transitionDelay: `${i * 18}ms` }}
//                       />
//                     );
//                   })}
//                 </div>

//                 {/* LABEL SCALE */}
//                 <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                   <span>Poor</span>
//                   <span>Average</span>
//                   <span>Excellent</span>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

//             {/* --- ACTION TRIGGER BANNER --- */}
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
//                                 <CalendarIcon size={18} />
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

//                               <div className="flex flex-col items-end gap-2">
//                                 <div
//                                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                                     i.status === "Completed"
//                                       ? "bg-indigo-50 text-indigo-600 border-indigo-100"
//                                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   }`}
//                                 >
//                                   {i.status}
//                                 </div>

//                                 {i.attendance_status === "pending" ? (
//                                   <div className="flex flex-col items-end gap-2">
//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsRescheduleOpen(true);
//                                       }}
//                                       className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
//                                     >
//                                       Reschedule
//                                     </button>

//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsAttendanceOpen(true);
//                                       }}
//                                       className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
//                                     >
//                                       Interview Status
//                                     </button>
//                                   </div>
//                                 ) : i.attendance_status === "no_show" ? (
//                                   /* 🔴 NO SHOW – NEW CONDITION */
//                                   <button
//                                     onClick={() => {
//                                       setActiveInterview(i);
//                                       setIsRescheduleOpen(true);
//                                     }}
//                                     className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
//                                   >
//                                     Schedule Again
//                                   </button>
//                                 ) : (
//                                   <>
//                                     {i.status === "completed" && i.review ? (
//                                       <div className="flex flex-col items-end gap-2">
//                                         {/* SCORE */}
//                                         <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//                                           <Star size={12} fill="currentColor" />
//                                           SCORE:{" "}
//                                           {i.review.total_score.toFixed(1)}
//                                         </div>
//                                       </div>
//                                     ) : (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedInterview(i);
//                                           setIsFeedbackModalOpen(true);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                                       >
//                                         Evaluate <ExternalLink size={12} />
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
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

//                       {/* <button
//                        onClick={() => navigate(`/invitation/${id}/scheduleinterview`)}
//                         className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all"
//                       >
//                         Initialize Round 01 <ArrowRight size={14} />
//                       </button> */}
//                       <button
//   onClick={() => navigate(`/invitation/${id}/scheduleinterview`)}
//   className="mt-10 group relative flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 overflow-hidden"
// >
//   {/* SHIMMER EFFECT - Enterprise Detail */}
//   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

//   <div className="flex flex-col items-start">

//     <span className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
//       Initialize Round <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//     </span>
//   </div>

//   {/* ICON BACKDROP */}
//   <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
//     <Calendar size={60} strokeWidth={1} />
//   </div>
// </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* NEXT ROUND SCHEDULER BAR */}
//                 {/* <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4">
//                   <div className="flex flex-col">
//                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
//                       Next Round Schedule
//                     </span>
//                     <span className="text-xs text-slate-500 font-semibold">
//                       Create and deploy next interview round
//                     </span>
//                   </div>

//                   <button
//                     onClick={() => setIsNextRoundModalOpen(true)}
//                     className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                   >
//                     Schedule Next Round
//                   </button>
//                 </div> */}

//                 {/* NEXT ROUND SCHEDULER BAR */}
// <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4">

//   <div className="flex flex-col">
//     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
//       Next Round Schedule
//     </span>

//     {latestStatus === "scheduled" ? (
//       <span className="text-xs text-red-500 font-semibold">
//         Please complete the latest round first
//       </span>
//     ) : latestStatus === "completed" ? (
//       <span className="text-xs text-slate-500 font-semibold">
//         Latest round completed. You can schedule next round.
//       </span>
//     ) : (
//       <span className="text-xs text-slate-400 font-semibold">
//         No interview data found
//       </span>
//     )}
//   </div>

//   {/* SHOW BUTTON ONLY WHEN COMPLETED */}
//   {latestStatus === "completed" && (
//     <button
//       onClick={() => setIsNextRoundModalOpen(true)}
//       className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//     >
//       Schedule Next Round
//     </button>
//   )}
// </div>


//                 <SectionHeader title="Candidate Information" />
//                 <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
//                   <InfoItem
//                     label="Candidate Name"
//                     // value={candidate.full_name}
//                      value={candidate.full_name?.toUpperCase()}
//                     icon={<User size={14} className="text-gray-400" />}
//                   />
//                   <InfoItem
//                     label="Operational Role"
//                     value={candidate.position?.toUpperCase()}
//                     icon={<Award size={14} className="text-amber-500" />}
//                   />
//                   <InfoItem
//                     label="Contact Email"
//                     value={candidate.email}
//                     icon={<Mail size={14} className="text-blue-500" />}
//                   />
//                   <InfoItem
//                     label="Contact Number"
//                     value={candidate.phone?.toUpperCase()}
//                     icon={<Smartphone size={14} className="text-emerald-500" />}
//                   />
//                   <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
//                     <InfoItem
//                       label="Professional Abstract"
//                       value={candidate.bio?.toUpperCase()}
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
//                     label="Candidate Id"
//                     value={`${candidate.id}`}
//                   />
//                   {/* <InfoItem
//                     icon={<Briefcase size={14} />}
//                     label="Market Experience"
//                     value={candidate.experience}
//                   /> */}
//                   <InfoItem
//   icon={<Briefcase size={14} />}
//   label="Market Experience"
//   value={
//     candidate.experience
//       ? `${candidate.experience} Years`
//       : "N/A"
//   }
// />

//                   <InfoItem
//                     icon={<GraduationCap size={14} />}
//                     label="Academic Details"
//                     value={candidate.education?.toUpperCase()}
//                   />
//                   <InfoItem
//                     icon={<Building2 size={14} />}
//                     label="Base Operations"
//                     value={`${candidate.location?.toUpperCase()}`}
//                     // value={`${candidate.location.city}, ${candidate.location.state}`}
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

//                   {allowedStatuses.includes(candidate.status) && (
//                     <div className="col-span-2 flex items-center justify-end p-4">
//                       <button
//                         onClick={() =>
//                           navigate(`/invitation/${id}/scheduleinterview`)
//                         }
//                         className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                       >
//                         <Edit3 size={16} /> Interview Schedule
//                       </button>
//                     </div>
//                   )}
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
//                   {/* Sync Entity Records */}
//                   Edit Candidate Data
//                 </h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//                   {/* Updating global profile attributes */}
//                   Updating candidate profile information
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
//                   value={formData.full_name}
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
//                 <InputField
//                   label="Phone Number"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Education"
//                   name="education"
//                   value={formData.education}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                 />

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Candidate Status
//                   </label>

//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//                   >
//                     <option value="jd_pending">JD Pending</option>
//                     <option value="jd_accepted">JD Accepted</option>
//                     <option value="selected">Selected</option>
//                   </select>
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
//                       Resume
//                     </h2>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                       Status: Uploaded Document
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Controls */}
//               <div className="flex items-center gap-3">
//                 {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
//                   <Download size={14} /> Export PDF
//                 </button> */}
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
//               {/* <div className="flex-grow bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar">
//                 <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] p-16 relative">
                

             
//                   <div className="w-full h-full">
//                     {candidate.resume_path ? (
//                       isPdf(candidate.resume_path) ? (
//                         <iframe
//                           src={candidate.resume_path}
//                           title="Candidate Resume"
//                           className="w-full h-[1000px] rounded-xl border border-slate-200"
//                         />
//                       ) : (
//                         <img
//                           src={candidate.resume_path}
//                           alt="Candidate Resume"
//                           className="w-full rounded-xl border border-slate-200"
//                         />
//                       )
//                     ) : (
//                       <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
//                         No Resume Uploaded
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div> */}

//               <div className="flex-grow bg-slate-50/50 p-6 overflow-hidden">
//   <div className="w-full h-full max-w-[900px] mx-auto bg-white rounded-xl shadow border border-slate-100 relative flex flex-col">

//     {/* Resume Viewer */}
//     <div className="flex-grow w-full h-full overflow-hidden rounded-xl">
//       {candidate.resume_path ? (
//         isPdf(candidate.resume_path) ? (
//           <iframe
//             // src={candidate.resume_path}
//             src={`${candidate.resume_path}#zoom=51&toolbar=0&navpanes=0&scrollbar=0`}
//             title="Candidate Resume"
//             className="w-full h-full min-h-[70vh] border-0 rounded-xl"
//           />
//         ) : (
//           <img
//             src={candidate.resume_path}
//             alt="Candidate Resume"
//             className="w-full h-full object-contain rounded-xl"
//           />
//         )
//       ) : (
//         <div className="flex items-center justify-center h-[70vh] text-slate-400 text-sm font-bold uppercase tracking-widest">
//           No Resume Uploaded
//         </div>
//       )}
//     </div>

//   </div>
// </div>


//               {/* 03. ANALYTICS SIDEBAR - Integrated with Dashboard Style */}
//               <aside className="w-[340px] border-l border-slate-100 bg-white flex flex-col p-8 space-y-10">
//                 <div>
//                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-3">
//                     <Activity size={14} /> Smart Insights
//                   </h3>

//                   <div className="space-y-8">
//                     {/* Score Meter */}
//                     {/* <div className="space-y-3">
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
//                     </div> */}

//                     {/* Verified Metadata Blocks */}
//                     <MetadataInsight
//                       label="Education"
//                       value={`Completed ${candidate.education}`}
//                       icon={<GraduationCap className="text-emerald-500" />}
//                     />
//                     {/* <MetadataInsight
//                       label="Integrity"
//                       value="No Anomalies"
//                       icon={<ShieldCheck className="text-blue-500" />}
//                     /> */}
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </div>
//       )}

//       {isDecisionModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsDecisionModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
//             {/* Modal Header */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="space-y-1">
//                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <ShieldAlert size={16} className="text-indigo-600" /> Final
//                   Determination Panel
//                 </h2>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                   Authorized Personnel Only
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDecisionModalOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 pt-4">
//               <div className="space-y-6">
//                 {/* Remark Input */}
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                     Protocol Remarks
//                   </label>
//                   <textarea
//                     placeholder="Provide context for this decision..."
//                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
//                   />
//                 </div>

//                 {/* Action Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
//                     <ShieldCheck size={16} /> Approve
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Audit Footer */}
//             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                 Secure Terminal Session • Immutable Audit Log Enabled
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {isRescheduleOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* High-fidelity Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsRescheduleOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Timeline Modification */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//                   <Clock size={20} />
//                 </div>
//                 <div>
                  
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Reschedule Interview — Round {activeInterview?.round_number}
//                   </h3>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Update Interview Date & Time
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Core Scheduling Logic */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Target Timestamp
//                   </label>
//                   <div className="relative group">
//                     <CalendarIcon
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <input
//                       type="datetime-local"
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                       value={rescheduleForm.interview_date}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           interview_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Interaction Mode
//                   </label>
//                   <div className="relative group">
//                     <Globe
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <select
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
//                       value={rescheduleForm.mode}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="online">Virtual / Online</option>
//                       <option value="offline">On-Site / Physical</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Context-Aware Location Field */}
//               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   {rescheduleForm.mode === "online"
//                     ? "Digital Access Link"
//                     : "Facility / Venue Details"}
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     {rescheduleForm.mode === "online" ? (
//                       <Zap size={14} />
//                     ) : (
//                       <MapPin size={14} />
//                     )}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder={
//                       rescheduleForm.mode === "online"
//                         ? "https://meet.google.com/..."
//                         : "Boardroom 4C, Level 2"
//                     }
//                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                     value={
//                       rescheduleForm.mode === "online"
//                         ? rescheduleForm.meeting_link
//                         : rescheduleForm.venue_details
//                     }
//                     onChange={(e) =>
//                       setRescheduleForm({
//                         ...rescheduleForm,
//                         [rescheduleForm.mode === "online"
//                           ? "meeting_link"
//                           : "venue_details"]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Audit Log / Reason */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Justification for Reschedule
//                 </label>
//                 <textarea
//                   placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
//                   className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
//                   value={rescheduleForm.reason}
//                   onChange={(e) =>
//                     setRescheduleForm({
//                       ...rescheduleForm,
//                       reason: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Warning Policy Card */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <AlertCircle size={16} className="text-amber-500 shrink-0" />
//                 <p className="text-[10px] font-medium text-amber-800 leading-tight">
//                   <strong>Policy Notice:</strong> Rescheduling will
//                   automatically trigger an email notification to the candidate
//                   and update the internal calendar registry.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Execution Bar */}
//             <div className="p-6 bg-slate-900 flex items-center justify-between">
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRescheduleSubmit}
//                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
//               >
//                 Confirm Adjustment
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAttendanceOpen && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
//             onClick={() => setIsAttendanceOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Disposition Logic */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                   <UserCheck size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Attendance Registry
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Post-Interview Disposition
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Candidate Meta Info */}
//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                 <div className="flex flex-col">
//                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Active Interviewee
//                   </span>
//                   <span className="text-sm font-bold text-slate-800">
//                     {activeInterview?.candidate_name || "Unidentified Asset"}
//                   </span>
//                 </div>
//                 <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
//                   ID:{" "}
//                   {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
//                     "N/A"}
//                 </div>
//               </div>

//               {/* Status Selection: High-Contrast Interaction */}
//               <div className="space-y-3">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Update Final Status
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
//                     <Activity size={16} />
//                   </div>
//                   <select
//                     className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
//                     onChange={(e) =>
//                       updateAttendance(activeInterview.id, e.target.value)
//                     }
//                   >
//                     <option value="">Select Protocol</option>
//                     <option value="attended" className="text-emerald-600">
//                       ✓ Mark as Attended
//                     </option>
//                     <option value="no_show" className="text-rose-600">
//                       ✗ Report No-Show
//                     </option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </div>

//               {/* System Notice */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <ShieldAlert
//                   size={16}
//                   className="text-amber-500 shrink-0 mt-0.5"
//                 />
//                 <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
//                   <strong>Audit Note:</strong> Changing this status will update
//                   the candidate's lifecycle history and notify the assigned
//                   hiring manager. This action is logged under your session.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Close Execution */}
//             <div className="p-6 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
//               >
//                 Confirm & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isNextRoundModalOpen && (
//         <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsNextRoundModalOpen(false)}
//           />

//           {/* Modal Container */}
//           <div className="relative bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Header */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
//               <div>
//                 <h3 className="text-xl font-black text-slate-900 tracking-tight">
//                   Schedule Interview
//                 </h3>
//                 <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">
//                   Next Round Orchestration
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
//                 <CalendarIcon className="text-indigo-600" size={24} />
//               </div>
//             </div>

//             <div className="flex flex-col md:flex-row">
//               {/* Main Form Area */}
//               <div className="flex-1 p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
//                 {/* Section: Logistics */}
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Clock size={14} className="text-indigo-600" />
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Timing & Logistics
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2 group">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                         Interview Date
//                       </label>
//                       <div className="relative">
//                         <CalendarIcon
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                           size={16}
//                         />
//                         <input
//                           type="date"
//                           value={nextRoundForm.date}
//                           onChange={(e) =>
//                             setNextRoundForm({
//                               ...nextRoundForm,
//                               date: e.target.value,
//                             })
//                           }
//                           className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2 group">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                         Interview Time
//                       </label>
//                       <div className="relative">
//                         <Clock
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                           size={16}
//                         />
//                         <input
//                           type="time"
//                           value={nextRoundForm.time}
//                           onChange={(e) =>
//                             setNextRoundForm({
//                               ...nextRoundForm,
//                               time: e.target.value,
//                             })
//                           }
//                           className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2 group">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                         Interview Mode
//                       </label>
//                       <div className="relative">
//                         <ShieldCheck
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                           size={16}
//                         />
//                         <select
//                           value={nextRoundForm.mode}
//                           onChange={(e) =>
//                             setNextRoundForm({
//                               ...nextRoundForm,
//                               mode: e.target.value,
//                             })
//                           }
//                           className="w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 appearance-none outline-none transition-all shadow-sm"
//                         >
//                           <option value="online">Online Conference</option>
//                           <option value="offline">In-Person Meeting</option>
//                         </select>
//                         <ChevronDown
//                           className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                           size={14}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2 group">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                         {nextRoundForm.mode === "online"
//                           ? "Meeting Link"
//                           : "Venue Details"}
//                       </label>
//                       <div className="relative">
//                         <Info
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                           size={16}
//                         />
//                         <input
//                           type="text"
//                           placeholder={
//                             nextRoundForm.mode === "online"
//                               ? "https://zoom.us/j/..."
//                               : "Enter conference room"
//                           }
//                           value={nextRoundForm.location}
//                           onChange={(e) =>
//                             setNextRoundForm({
//                               ...nextRoundForm,
//                               location: e.target.value,
//                             })
//                           }
//                           className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Section: Personnel */}
//                 <div className="space-y-4 pt-6 border-t border-slate-100">
//                   <div className="flex items-center gap-2 mb-2">
//                     <UserPlus size={14} className="text-indigo-600" />
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Interviewer Personnel
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2 group">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                         Full Name
//                       </label>
//                       <div className="relative">
//                         <UserPlus
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                           size={16}
//                         />
//                         <input
//                           type="text"
//                           placeholder="Enter full name"
//                           value={nextRoundForm.interviewerName}
//                           onChange={(e) =>
//                             setNextRoundForm({
//                               ...nextRoundForm,
//                               interviewerName: e.target.value,
//                             })
//                           }
//                           className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2 group">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                         Professional Role
//                       </label>
//                       <div className="relative">
//                         <ShieldCheck
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                           size={16}
//                         />
//                         <input
//                           type="text"
//                           placeholder="e.g. Senior Architect"
//                           value={nextRoundForm.interviewerRole}
//                           onChange={(e) =>
//                             setNextRoundForm({
//                               ...nextRoundForm,
//                               interviewerRole: e.target.value,
//                             })
//                           }
//                           className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2 group">
//                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <MessageSquare
//                         className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all"
//                         size={16}
//                       />
//                       <input
//                         type="email"
//                         placeholder="interviewer@company.com"
//                         value={nextRoundForm.interviewerEmail}
//                         onChange={(e) =>
//                           setNextRoundForm({
//                             ...nextRoundForm,
//                             interviewerEmail: e.target.value,
//                           })
//                         }
//                         className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Sidebar */}
//               <div className="w-full md:w-64 bg-slate-50/50 p-8 border-l border-slate-100 flex flex-col justify-between">
//                 <div className="space-y-6">
//                   <div className="space-y-2">
//                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       System Notice
//                     </h4>
//                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
//                       Generating this round will notify the candidate and
//                       reserve the interviewer's calendar slot automatically.
//                     </p>
//                   </div>

//                   <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
//                     <Fingerprint
//                       className="absolute -right-2 -bottom-2 text-slate-50"
//                       size={60}
//                     />
//                     <div className="relative z-10">
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
//                         <span className="text-[10px] font-black text-slate-700 uppercase">
//                           Live Draft
//                         </span>
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-500">
//                         Awaiting dispatch...
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setIsNextRoundModalOpen(false)}
//                   className="mt-8 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
//                 >
//                   Discard Round
//                 </button>
//               </div>
//             </div>

//             {/* Footer Actions */}
//             <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
//               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                 Enterprise Talent v4.0
//               </p>
//               <button
//                 onClick={handleCreateNextRound}
//                 className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
//               >
//                 Dispatch Invite
//                 <ArrowRight
//                   size={14}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isFeedbackModalOpen && (
//         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsFeedbackModalOpen(false)}
//           />

//           <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Left: Scoreboard Sidebar (35%) */}
//             <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//                   <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                     Pending Review
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-black text-slate-900 leading-tight">
//                   Scorecard <br />
//                   Analysis
//                 </h2>
//               </div>

//               <div className="space-y-8 flex-grow">
//                 <RatingRow
//                   label="Technical Logic"
//                   icon={Cpu}
//                   value={feedbackData.technicalScore}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, technicalScore: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Cultural Synergy"
//                   icon={Users}
//                   value={feedbackData.culturalFit}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, culturalFit: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Articulate/Comms"
//                   icon={MessageSquare}
//                   value={feedbackData.softSkills}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, softSkills: val })
//                   }
//                 />
//               </div>

//               <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
//                   Aggregate Intelligence
//                 </p>
//                 <div className="text-3xl font-black italic">
//                   {(
//                     (feedbackData.technicalScore +
//                       feedbackData.culturalFit +
//                       feedbackData.softSkills) /
//                     3
//                   ).toFixed(1)}
//                   <span className="text-lg opacity-50 not-italic ml-1">
//                     /10
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Narrative & Conclusion (62%) */}
//             <div className="flex-grow p-8 lg:p-10 flex flex-col">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                     Final Verdict
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Please provide your executive recommendation below.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-grow space-y-8">
//                 {/* Detailed Narrative */}
//                 <div className="group">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
//                     Candidate Assessment Narrative
//                   </label>
//                   <textarea
//                     rows="6"
//                     className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//                     placeholder="Highlight key strengths, weaknesses, and overall impression..."
//                     value={feedbackData.comments}
//                     onChange={(e) =>
//                       setFeedbackData({
//                         ...feedbackData,
//                         comments: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Decision Buttons */}
//                 <div className="space-y-4">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Decision Path
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       {
//                         id: "reject",
//                         label: "Reject",
//                         color: "hover:border-red-500 hover:text-red-600",
//                         active: "bg-red-50 border-red-500 text-red-600",
//                       },
//                       {
//                         id: "pass",
//                         label: "Pass",
//                         color: "hover:border-indigo-500 hover:text-indigo-600",
//                         active:
//                           "bg-indigo-50 border-indigo-500 text-indigo-600",
//                       },
//                       {
//                         id: "strong_pass",
//                         label: "Strong Pass",
//                         color:
//                           "hover:border-emerald-500 hover:text-emerald-600",
//                         active:
//                           "bg-emerald-50 border-emerald-500 text-emerald-600",
//                       },
//                     ].map((rec) => (
//                       <button
//                         key={rec.id}
//                         onClick={() =>
//                           setFeedbackData({
//                             ...feedbackData,
//                             recommendation: rec.id,
//                           })
//                         }
//                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                           feedbackData.recommendation === rec.id
//                             ? rec.active
//                             : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                         }`}
//                       >
//                         {rec.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFeedbackSubmit}
//                 className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 <Briefcase size={16} /> Finalize Session Audit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
//           {label}
//         </span>
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
//               ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
//               : "bg-slate-100 hover:bg-slate-200"
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
//*****************************************************working code phase 3 07/02/26********************************************************** */
// import React, { useState, useEffect } from "react";
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
//   UserCheck,
//   Info,
//   Building2,
//   UserPlus,
//   Smartphone,
//   ChevronDown,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Activity,
//   Fingerprint,
//   Calendar,
//   FileText,
//   Zap,
//   AlertCircle,
//   ArrowUpRight,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   ShieldAlert,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import { interviewService } from "../../services/interviewService";
// import toast from "react-hot-toast";

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
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     technicalScore: 0,
//     culturalFit: 0,
//     softSkills: 0,
//     comments: "",
//     recommendation: "", // hire, strong_hire, no_hire
//   });
//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
//   const [activeInterview, setActiveInterview] = useState(null);

//   const [rescheduleForm, setRescheduleForm] = useState({
//     interview_date: "",
//     mode: "online",
//     meeting_link: "",
//     venue_details: "",
//     reason: "",
//   });

//   const [isNextRoundModalOpen, setIsNextRoundModalOpen] = useState(false);

// const [nextRoundForm, setNextRoundForm] = useState({
//   date: "",
//   time: "",
//   mode: "online",
//   location: "",
//   interviewerName: "",
//   interviewerEmail: "",
//   interviewerRole: "",
// });

// const splitDateTime = (isoString) => {
//   if (!isoString) return { date: "", time: "" };

//   const d = new Date(isoString);

//   const date = d.toISOString().slice(0, 10); // YYYY-MM-DD

//   const time = d.toTimeString().slice(0, 5); // HH:MM (24h)

//   return { date, time };
// };

//   useEffect(() => {
//     if (id) fetchCandidate();
//   }, [id]);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (candidate) {
//       setFormData({
//         full_name: candidate.full_name || "",
//         email: candidate.email || "",
//         phone: candidate.phone || "",
//         address: candidate.address || "",
//         status: candidate.status || "jd_pending",
//         position: candidate.position || "",
//         experience: candidate.experience || "",
//         education: candidate.education || "",
//         location: candidate.location || "",
//       });
//     }
//   }, [candidate]);

//   useEffect(() => {
//     if (activeInterview && isRescheduleOpen) {
//       setRescheduleForm({
//         interview_date: activeInterview.interview_date
//           ? new Date(activeInterview.interview_date).toISOString().slice(0, 16) // required for datetime-local
//           : "",
//         mode: activeInterview.mode || "online",
//         meeting_link: activeInterview.meeting_link || "",
//         venue_details: activeInterview.venue_details || "",
//         reason: "",
//       });
//     }
//   }, [activeInterview, isRescheduleOpen]);

// //   useEffect(() => {
// //   if (!isNextRoundModalOpen || interviews.length === 0) return;

// //   const last = interviews[interviews.length - 1];

// //   const rawDate = last?.interview_date
// //     ? new Date(last.interview_date)
// //     : null;

// //   setNextRoundForm({
// //     date: rawDate ? rawDate.toISOString().slice(0, 10) : "",
// //     time: rawDate
// //       ? rawDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// //       : "",
// //     mode: last?.mode || "online",
// //     location: last?.location || "",
// //     interviewerName: last?.interviewerName || "",
// //     interviewerEmail: last?.interviewer_email || "",
// //     interviewerRole: last?.interviewerRole || "",
// //   });
// // }, [isNextRoundModalOpen]);

// useEffect(() => {
//   if (!isNextRoundModalOpen || interviews.length === 0) return;

//   const last = interviews[interviews.length - 1];

//   const { date, time } = splitDateTime(last.interview_date);

//   setNextRoundForm({
//     date,
//     time,
//     mode: last?.mode || "online",
//     location: last?.meeting_link || last?.venue_details || "",
//     interviewerName: last?.interviewer_name || "",
//     interviewerEmail: last?.interviewer_email || "",
//     interviewerRole: last?.interviewer_designation || "",
//   });
// }, [isNextRoundModalOpen]);

//   const fetchCandidate = async () => {
//     try {
//       setLoading(true);

//       const data = await candidateService.getById(id);
//       setCandidate(data);

//       if (data.interviews) {
//         const normalized = data.interviews.map((i) => {
//           const dt = new Date(i.interview_date);

//           return {
//             ...i,
//             round: i.round_number,
//             date: dt.toLocaleDateString(),
//             time: dt.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             location: i.mode === "online" ? i.meeting_link : i.venue_details,
//             interviewerName: i.interviewer_name,
//             interviewerRole: "Interviewer",
//             status: i.status === "scheduled" ? "Scheduled" : i.status,
//           };
//         });

//         setInterviews(normalized);
//       } else {
//         setInterviews([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const handleCreateNextRound = async () => {
//   try {
//     const payload = {
//       candidate_id: Number(candidate.id),

//       mode: nextRoundForm.mode,

//       interview_date: new Date(
//         `${nextRoundForm.date}T${nextRoundForm.time}`
//       ).toISOString(),

//       interviewer_name: nextRoundForm.interviewerName,
//       interviewer_email: nextRoundForm.interviewerEmail,
//       interviewer_designation: nextRoundForm.interviewerRole,

//       ...(nextRoundForm.mode === "online"
//         ? { meeting_link: nextRoundForm.location }
//         : { venue_details: nextRoundForm.location }),
//     };

//     await toast.promise(
//       fetch("https://apihrr.goelectronix.co.in/interviews/schedule", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }),
//       {
//         loading: "Scheduling next round...",
//         success: "Next round scheduled 🎉",
//         error: "Failed to schedule",
//       }
//     );

//     setIsNextRoundModalOpen(false);
//     fetchCandidate(); // refresh interviews
//   } catch (err) {
//     console.error(err);
//   }
// };

//   if (loading) {
//     return (
//       <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
//     );
//   }

//   if (error) {
//     return <div className="p-10 text-red-500 font-bold">{error}</div>;
//   }

//   if (!candidate) return null;

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

//   const handleFeedbackSubmit = async () => {
//     if (!selectedInterview) return;

//     try {
//       const payload = {
//         technical_skill: feedbackData.technicalScore,
//         communication: feedbackData.softSkills,
//         problem_solving: feedbackData.technicalScore, // adjust if you add separate score
//         cultural_fit: feedbackData.culturalFit,
//         relevant_experience: feedbackData.technicalScore, // optional mapping
//         remarks: feedbackData.comments,
//         decision: feedbackData.recommendation,
//       };

//       await toast.promise(
//         interviewService.submitReview(selectedInterview.id, payload),
//         {
//           loading: "Submitting review...",
//           success: "Review submitted successfully 🎉",
//           error: "Failed to submit review",
//         },
//       );

//       // ✅ Close modal
//       setIsFeedbackModalOpen(false);

//       // ✅ Reset form
//       setFeedbackData({
//         technicalScore: 0,
//         culturalFit: 0,
//         softSkills: 0,
//         comments: "",
//         recommendation: "",
//       });

//       // ⭐ VERY IMPORTANT → Refresh candidate
//       fetchCandidate();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateAttendance = async (interviewId, status) => {
//     try {
//       await toast.promise(
//         interviewService.updateAttendance(interviewId, {
//           attendance_status: status,
//         }),
//         {
//           loading: "Updating attendance...",
//           success: "Attendance updated successfully",
//           error: "Failed to update attendance",
//         },
//       );

//       setIsAttendanceOpen(false);
//       fetchCandidate(); // 🔁 refresh UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!activeInterview) return;

//     try {
//       await toast.promise(
//         interviewService.rescheduleInterview(
//           activeInterview.id,
//           rescheduleForm,
//         ),
//         {
//           loading: "Rescheduling interview...",
//           success: "Interview rescheduled",
//           error: "Failed to reschedule interview",
//         },
//       );

//       setIsRescheduleOpen(false);
//       fetchCandidate(); // 🔁 refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await toast.promise(
//         fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             full_name: formData.full_name,
//             email: formData.email,
//             phone: formData.phone,
//             address: formData.address,
//             status: formData.status,
//             position: formData.position,
//             experience: formData.experience,
//             education: formData.education,
//             location: formData.location,
//           }),
//         }),
//         {
//           loading: "Updating candidate...",
//           success: "Candidate updated successfully ✅",
//           error: "Failed to update candidate ❌",
//         },
//       );

//       setIsEditModalOpen(false);
//       fetchCandidate(); // 🔁 refresh profile
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

//   const calculateVulnerabilityScore = () => {
//     if (!interviews || interviews.length === 0) return 0;

//     const completed = interviews.filter(
//       (i) => i.review && i.status === "completed",
//     );

//     if (completed.length === 0) return 0;

//     const total = completed.reduce((sum, i) => {
//       const avg =
//         (i.review.technical_skill +
//           i.review.communication +
//           i.review.cultural_fit) /
//         3;
//       return sum + avg;
//     }, 0);

//     const score10 = total / completed.length; // avg out of 10
//     const score100 = Math.round(score10 * 10); // convert to /100

//     return score100;
//   };

//   const vulnerabilityScore = calculateVulnerabilityScore();

//   const formatStatus = (status) => {
//     if (!status) return "N/A";

//     const map = {
//       jd_pending: "JD Pending",
//       jd_accepted: "JD Accepted",
//       selected: "Selected",
//       scheduled: "Scheduled",
//       completed: "Completed",
//       rejected: "Rejected",
//       no_show: "No Show",
//       attended: "Attended",
//       pending: "Pending",
//     };

//     return (
//       map[status] ||
//       status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//     );
//   };

//   const allowedStatuses = [
//     "applied",
//     "interviewing",
//     "rejected",
//     "jd_sent",
//     "jd_accepted",
//     "jd_rejected",
//     "jd_pending",
//   ];

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
//             {/* {candidate.status} */}
//             {formatStatus(candidate.status)}
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
//                 {candidate?.name?.charAt(0) || "?"}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.full_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location}
//                 />
//                 {/* <HeroMeta
//                   icon={<Calendar size={14} />}
//                   text="Member since 2026"
//                 /> */}
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

//             <div className="mt-8 border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden font-sans transition-all hover:shadow-md">
//               {/* HEADER */}
//               <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-2.5 h-2.5 rounded-full animate-pulse ${
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-emerald-500"
//                     }`}
//                   />
//                   <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
//                     Vulnerability Analysis
//                   </h4>
//                 </div>

//                 <span className="text-[9px] whitespace-nowrap font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded tracking-wider uppercase">
//                   Live Sync
//                 </span>
//               </div>

//               {/* BODY */}
//               <div className="p-6">
//                 {/* SCORE + THREAT */}
//                 <div className="flex items-baseline justify-between mb-6">
//                   <div className="flex items-end gap-1">
//                     <span className="text-5xl font-black text-slate-900 tracking-tight leading-none">
//                       {vulnerabilityScore}
//                     </span>
//                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       /100
//                     </span>
//                   </div>

//                   <div className="text-right flex flex-col items-end">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       Threat Level
//                     </span>

//                     <span
//                       className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wide ${
//                         vulnerabilityScore > 70
//                           ? "bg-rose-50 text-rose-700"
//                           : vulnerabilityScore > 40
//                             ? "bg-amber-50 text-amber-700"
//                             : "bg-emerald-50 text-emerald-700"
//                       }`}
//                     >
//                       {vulnerabilityScore > 70
//                         ? "Critical"
//                         : vulnerabilityScore > 40
//                           ? "Elevated"
//                           : "Low Risk"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* SEGMENTED ENTERPRISE BAR */}
//                 <div className="flex gap-[2px] h-3 w-full mb-2">
//                   {[...Array(20)].map((_, i) => {
//                     const active = i < vulnerabilityScore / 5;

//                     const color =
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-slate-900";

//                     return (
//                       <div
//                         key={i}
//                         className={`flex-1 rounded-sm transition-all duration-500 ${
//                           active ? color : "bg-slate-100"
//                         }`}
//                         style={{ transitionDelay: `${i * 18}ms` }}
//                       />
//                     );
//                   })}
//                 </div>

//                 {/* LABEL SCALE */}
//                 <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                   <span>Low</span>
//                   <span>Moderate</span>
//                   <span>High</span>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

//             {/* --- ACTION TRIGGER BANNER --- */}
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

//                               <div className="flex flex-col items-end gap-2">
//                                 <div
//                                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                                     i.status === "Completed"
//                                       ? "bg-indigo-50 text-indigo-600 border-indigo-100"
//                                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   }`}
//                                 >
//                                   {i.status}
//                                 </div>

//                                 {i.attendance_status === "pending" ? (
//                                   <div className="flex flex-col items-end gap-2">
//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsRescheduleOpen(true);
//                                       }}
//                                       className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
//                                     >
//                                       Reschedule
//                                     </button>

//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsAttendanceOpen(true);
//                                       }}
//                                       className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
//                                     >
//                                       Interview Status
//                                     </button>
//                                   </div>
//                                 ) : i.attendance_status === "no_show" ? (
//                                   /* 🔴 NO SHOW – NEW CONDITION */
//                                   <button
//                                     onClick={() => {
//                                       setActiveInterview(i);
//                                       setIsRescheduleOpen(true);
//                                     }}
//                                     className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
//                                   >
//                                     Schedule Again
//                                   </button>
//                                 ) : (
//                                   <>
//                                     {i.status === "completed" && i.review ? (
//                                       // <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//                                       //   <Star size={12} fill="currentColor" />
//                                       //   SCORE: {i.review.total_score.toFixed(1)}
//                                       // </div>
//                                        <div className="flex flex-col items-end gap-2">

//       {/* SCORE */}
//       <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//         <Star size={12} fill="currentColor" />
//         SCORE: {i.review.total_score.toFixed(1)}
//       </div>

//     </div>
//                                     ) : (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedInterview(i);
//                                           setIsFeedbackModalOpen(true);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                                       >
//                                         Evaluate <ExternalLink size={12} />
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
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

//                 {/* NEXT ROUND SCHEDULER BAR */}
// <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4">
//   <div className="flex flex-col">
//     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
//       Next Round Schedule
//     </span>
//     <span className="text-xs text-slate-500 font-semibold">
//       Create and deploy next interview round
//     </span>
//   </div>

//   <button
//     onClick={() => setIsNextRoundModalOpen(true)}
//     className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//   >
//     Schedule Next Round
//   </button>
// </div>

//                 <SectionHeader title="Candidate Information" />
//                 <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
//                   <InfoItem
//                     label="Legal Entity Name"
//                     value={candidate.full_name}
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
//                     value={`${candidate.location}`}
//                     // value={`${candidate.location.city}, ${candidate.location.state}`}
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

//                   {allowedStatuses.includes(candidate.status) && (
//                     <div className="col-span-2 flex items-center justify-end p-4">
//                       <button
//                         onClick={() =>
//                           navigate(`/invitation/${id}/scheduleinterview`)
//                         }
//                         className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                       >
//                         <Edit3 size={16} /> Interview Schedule
//                       </button>
//                     </div>
//                   )}
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
//                   {/* Sync Entity Records */}
//                   Edit Candidate Data
//                 </h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//                   {/* Updating global profile attributes */}
//                   Updating candidate profile information
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
//                   value={formData.full_name}
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
//                 <InputField
//                   label="Phone Number"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Education"
//                   name="education"
//                   value={formData.education}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                 />

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Candidate Status
//                   </label>

//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//                   >
//                     <option value="jd_pending">JD Pending</option>
//                     <option value="jd_accepted">JD Accepted</option>
//                     <option value="selected">Selected</option>
//                   </select>
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

//                   {/* Resume Viewer */}
//                   <div className="w-full h-full">
//                     {candidate.resume_path ? (
//                       isPdf(candidate.resume_path) ? (
//                         <iframe
//                           src={candidate.resume_path}
//                           title="Candidate Resume"
//                           className="w-full h-[1000px] rounded-xl border border-slate-200"
//                         />
//                       ) : (
//                         <img
//                           src={candidate.resume_path}
//                           alt="Candidate Resume"
//                           className="w-full rounded-xl border border-slate-200"
//                         />
//                       )
//                     ) : (
//                       <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
//                         No Resume Uploaded
//                       </div>
//                     )}
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
//                       value={`Verified ${candidate.education}`}
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

//       {isDecisionModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsDecisionModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
//             {/* Modal Header */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="space-y-1">
//                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <ShieldAlert size={16} className="text-indigo-600" /> Final
//                   Determination Panel
//                 </h2>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                   Authorized Personnel Only
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDecisionModalOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 pt-4">
//               <div className="space-y-6">
//                 {/* Remark Input */}
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                     Protocol Remarks
//                   </label>
//                   <textarea
//                     placeholder="Provide context for this decision..."
//                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
//                   />
//                 </div>

//                 {/* Action Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
//                     <ShieldCheck size={16} /> Approve
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Audit Footer */}
//             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                 Secure Terminal Session • Immutable Audit Log Enabled
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {isRescheduleOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* High-fidelity Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsRescheduleOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Timeline Modification */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//                   <Clock size={20} />
//                 </div>
//                 <div>
//                   {/* <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Timeline Adjustment
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Modifying Interview Schedule
//                   </p> */}
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Reschedule Interview — Round {activeInterview?.round_number}
//                   </h3>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Update Interview Date & Time
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Core Scheduling Logic */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Target Timestamp
//                   </label>
//                   <div className="relative group">
//                     <Calendar
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <input
//                       type="datetime-local"
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                       value={rescheduleForm.interview_date}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           interview_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Interaction Mode
//                   </label>
//                   <div className="relative group">
//                     <Globe
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <select
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
//                       value={rescheduleForm.mode}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="online">Virtual / Online</option>
//                       <option value="offline">On-Site / Physical</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Context-Aware Location Field */}
//               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   {rescheduleForm.mode === "online"
//                     ? "Digital Access Link"
//                     : "Facility / Venue Details"}
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     {rescheduleForm.mode === "online" ? (
//                       <Zap size={14} />
//                     ) : (
//                       <MapPin size={14} />
//                     )}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder={
//                       rescheduleForm.mode === "online"
//                         ? "https://meet.google.com/..."
//                         : "Boardroom 4C, Level 2"
//                     }
//                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                     value={
//                       rescheduleForm.mode === "online"
//                         ? rescheduleForm.meeting_link
//                         : rescheduleForm.venue_details
//                     }
//                     onChange={(e) =>
//                       setRescheduleForm({
//                         ...rescheduleForm,
//                         [rescheduleForm.mode === "online"
//                           ? "meeting_link"
//                           : "venue_details"]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Audit Log / Reason */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Justification for Reschedule
//                 </label>
//                 <textarea
//                   placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
//                   className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
//                   value={rescheduleForm.reason}
//                   onChange={(e) =>
//                     setRescheduleForm({
//                       ...rescheduleForm,
//                       reason: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Warning Policy Card */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <AlertCircle size={16} className="text-amber-500 shrink-0" />
//                 <p className="text-[10px] font-medium text-amber-800 leading-tight">
//                   <strong>Policy Notice:</strong> Rescheduling will
//                   automatically trigger an email notification to the candidate
//                   and update the internal calendar registry.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Execution Bar */}
//             <div className="p-6 bg-slate-900 flex items-center justify-between">
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRescheduleSubmit}
//                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
//               >
//                 Confirm Adjustment
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAttendanceOpen && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
//             onClick={() => setIsAttendanceOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Disposition Logic */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                   <UserCheck size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Attendance Registry
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Post-Interview Disposition
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Candidate Meta Info */}
//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                 <div className="flex flex-col">
//                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Active Interviewee
//                   </span>
//                   <span className="text-sm font-bold text-slate-800">
//                     {activeInterview?.candidate_name || "Unidentified Asset"}
//                   </span>
//                 </div>
//                 <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
//                   ID:{" "}
//                   {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
//                     "N/A"}
//                 </div>
//               </div>

//               {/* Status Selection: High-Contrast Interaction */}
//               <div className="space-y-3">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Update Final Status
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
//                     <Activity size={16} />
//                   </div>
//                   <select
//                     className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
//                     onChange={(e) =>
//                       updateAttendance(activeInterview.id, e.target.value)
//                     }
//                   >
//                     <option value="">Select Protocol</option>
//                     <option value="attended" className="text-emerald-600">
//                       ✓ Mark as Attended
//                     </option>
//                     <option value="no_show" className="text-rose-600">
//                       ✗ Report No-Show
//                     </option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </div>

//               {/* System Notice */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <ShieldAlert
//                   size={16}
//                   className="text-amber-500 shrink-0 mt-0.5"
//                 />
//                 <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
//                   <strong>Audit Note:</strong> Changing this status will update
//                   the candidate's lifecycle history and notify the assigned
//                   hiring manager. This action is logged under your session.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Close Execution */}
//             <div className="p-6 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
//               >
//                 Confirm & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {isNextRoundModalOpen && (
//   <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
//     <div
//       className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//       onClick={() => setIsNextRoundModalOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 space-y-6">

//       <h3 className="text-lg font-bold">Schedule Next Interview Round</h3>

//       <div className="grid grid-cols-2 gap-4">
//         <input
//           type="date"
//           value={nextRoundForm.date}
//           onChange={(e) =>
//             setNextRoundForm({ ...nextRoundForm, date: e.target.value })
//           }
//           className="border p-3 rounded-xl"
//         />
//         <input
//           type="time"
//           value={nextRoundForm.time}
//           onChange={(e) =>
//             setNextRoundForm({ ...nextRoundForm, time: e.target.value })
//           }
//           className="border p-3 rounded-xl"
//         />
//       </div>

//       <select
//         value={nextRoundForm.mode}
//         onChange={(e) =>
//           setNextRoundForm({ ...nextRoundForm, mode: e.target.value })
//         }
//         className="w-full border p-3 rounded-xl"
//       >
//         <option value="online">Online</option>
//         <option value="offline">Offline</option>
//       </select>

//       <input
//         type="text"
//         placeholder={
//           nextRoundForm.mode === "online"
//             ? "Meeting Link"
//             : "Venue Details"
//         }
//         value={nextRoundForm.location}
//         onChange={(e) =>
//           setNextRoundForm({ ...nextRoundForm, location: e.target.value })
//         }
//         className="w-full border p-3 rounded-xl"
//       />

//       <input
//         type="text"
//         placeholder="Interviewer Name"
//         value={nextRoundForm.interviewerName}
//         onChange={(e) =>
//           setNextRoundForm({
//             ...nextRoundForm,
//             interviewerName: e.target.value,
//           })
//         }
//         className="w-full border p-3 rounded-xl"
//       />

//       <input
//         type="email"
//         placeholder="Interviewer Email"
//         value={nextRoundForm.interviewerEmail}
//         onChange={(e) =>
//           setNextRoundForm({
//             ...nextRoundForm,
//             interviewerEmail: e.target.value,
//           })
//         }
//         className="w-full border p-3 rounded-xl"
//       />

//       <input
//         type="text"
//         placeholder="Interviewer Role"
//         value={nextRoundForm.interviewerRole}
//         onChange={(e) =>
//           setNextRoundForm({
//             ...nextRoundForm,
//             interviewerRole: e.target.value,
//           })
//         }
//         className="w-full border p-3 rounded-xl"
//       />

//       <button
//         onClick={handleCreateNextRound}
//         className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
//       >
//         Create Next Round
//       </button>
//     </div>
//   </div>
// )} */}

// {/* {isNextRoundModalOpen && (
//   <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
//     <div
//       className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//       onClick={() => setIsNextRoundModalOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 space-y-6">
//       <h3 className="text-lg font-bold">Schedule Next Interview Round</h3>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1">
//           <label className="text-xs font-semibold text-gray-600">
//             Interview Date
//           </label>
//           <input
//             type="date"
//             value={nextRoundForm.date}
//             onChange={(e) =>
//               setNextRoundForm({ ...nextRoundForm, date: e.target.value })
//             }
//             className="border p-3 rounded-xl"
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label className="text-xs font-semibold text-gray-600">
//             Interview Time
//           </label>
//           <input
//             type="time"
//             value={nextRoundForm.time}
//             onChange={(e) =>
//               setNextRoundForm({ ...nextRoundForm, time: e.target.value })
//             }
//             className="border p-3 rounded-xl"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-semibold text-gray-600">
//           Interview Mode
//         </label>
//         <select
//           value={nextRoundForm.mode}
//           onChange={(e) =>
//             setNextRoundForm({ ...nextRoundForm, mode: e.target.value })
//           }
//           className="w-full border p-3 rounded-xl"
//         >
//           <option value="online">Online</option>
//           <option value="offline">Offline</option>
//         </select>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-semibold text-gray-600">
//           {nextRoundForm.mode === "online"
//             ? "Meeting Link"
//             : "Venue Details"}
//         </label>
//         <input
//           type="text"
//           placeholder={
//             nextRoundForm.mode === "online"
//               ? "Enter meeting link"
//               : "Enter venue details"
//           }
//           value={nextRoundForm.location}
//           onChange={(e) =>
//             setNextRoundForm({ ...nextRoundForm, location: e.target.value })
//           }
//           className="w-full border p-3 rounded-xl"
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-semibold text-gray-600">
//           Interviewer Name
//         </label>
//         <input
//           type="text"
//           placeholder="Enter interviewer name"
//           value={nextRoundForm.interviewerName}
//           onChange={(e) =>
//             setNextRoundForm({
//               ...nextRoundForm,
//               interviewerName: e.target.value,
//             })
//           }
//           className="w-full border p-3 rounded-xl"
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-semibold text-gray-600">
//           Interviewer Email
//         </label>
//         <input
//           type="email"
//           placeholder="Enter interviewer email"
//           value={nextRoundForm.interviewerEmail}
//           onChange={(e) =>
//             setNextRoundForm({
//               ...nextRoundForm,
//               interviewerEmail: e.target.value,
//             })
//           }
//           className="w-full border p-3 rounded-xl"
//         />
//       </div>

//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-semibold text-gray-600">
//           Interviewer Role / Designation
//         </label>
//         <input
//           type="text"
//           placeholder="Enter interviewer role"
//           value={nextRoundForm.interviewerRole}
//           onChange={(e) =>
//             setNextRoundForm({
//               ...nextRoundForm,
//               interviewerRole: e.target.value,
//             })
//           }
//           className="w-full border p-3 rounded-xl"
//         />
//       </div>

//       <button
//         onClick={handleCreateNextRound}
//         className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
//       >
//         Create Next Round
//       </button>
//     </div>
//   </div>
// )} */}

// {/* {isNextRoundModalOpen && (
//   <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">

//     <div
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//       onClick={() => setIsNextRoundModalOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">

//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
//         <div>
//           <h3 className="text-xl font-black text-slate-900 tracking-tight">Schedule Interview</h3>
//           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">Next Round Orchestration</p>
//         </div>
//         <div className="p-3 bg-indigo-50 rounded-xl">
//           <Calendar className="text-indigo-600" size={24} />
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row">

//         <div className="flex-1 p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2 group">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                 Interview Date
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                   type="date"
//                   value={nextRoundForm.date}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, date: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2 group">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                 Interview Time
//               </label>
//               <div className="relative">
//                 <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                   type="time"
//                   value={nextRoundForm.time}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, time: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4 pt-4 border-t border-slate-50">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interview Mode</label>
//               <div className="relative">
//                 <select
//                   value={nextRoundForm.mode}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, mode: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 appearance-none outline-none transition-all"
//                 >
//                   <option value="online">Online Conference</option>
//                   <option value="offline">In-Person Meeting</option>
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//               </div>
//             </div>

//             <div className="space-y-2 group">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                 {nextRoundForm.mode === "online" ? "Meeting Link" : "Venue Details"}
//               </label>
//               <div className="relative">
//                 <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                   type="text"
//                   placeholder={nextRoundForm.mode === "online" ? "https://zoom.us/j/..." : "Enter conference room or address"}
//                   value={nextRoundForm.location}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, location: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4 pt-4 border-t border-slate-50">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interviewer Designation</label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={nextRoundForm.interviewerName}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, interviewerName: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Role / Designation"
//                   value={nextRoundForm.interviewerRole}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, interviewerRole: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                 />
//               </div>
//               <input
//                 type="email"
//                 placeholder="Interviewer Email Address"
//                 value={nextRoundForm.interviewerEmail}
//                 onChange={(e) => setNextRoundForm({ ...nextRoundForm, interviewerEmail: e.target.value })}
//                 className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="w-full md:w-64 bg-slate-50/50 p-8 border-l border-slate-100 flex flex-col justify-between">
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</h4>
//               <p className="text-[11px] text-slate-500 leading-relaxed">
//                 Scheduling will trigger an automated calendar invite to both the candidate and the interviewer.
//               </p>
//             </div>

//             <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                <div className="flex items-center gap-2 mb-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
//                   <span className="text-[10px] font-black text-slate-700 uppercase">Status</span>
//                </div>
//                <p className="text-[10px] font-bold text-slate-500">Drafting Round</p>
//             </div>
//           </div>

//           <button
//             onClick={() => setIsNextRoundModalOpen(false)}
//             className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
//           >
//             Cancel Draft
//           </button>
//         </div>
//       </div>

//       <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
//         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Enterprise Talent Module v4.0</p>
//         <button
//           onClick={handleCreateNextRound}
//           className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
//         >
//           Schedule Round
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

// {isNextRoundModalOpen && (
//   <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
//     {/* Backdrop */}
//     <div
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//       onClick={() => setIsNextRoundModalOpen(false)}
//     />

//     {/* Modal Container */}
//     <div className="relative bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">

//       {/* Header */}
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
//         <div>
//           <h3 className="text-xl font-black text-slate-900 tracking-tight">Schedule Interview</h3>
//           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">Next Round Orchestration</p>
//         </div>
//         <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
//           <Calendar className="text-indigo-600" size={24} />
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row">
//         {/* Main Form Area */}
//         <div className="flex-1 p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

//           {/* Section: Logistics */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 mb-2">
//               <Clock size={14} className="text-indigo-600" />
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing & Logistics</span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                   Interview Date
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                   <input
//                     type="date"
//                     value={nextRoundForm.date}
//                     onChange={(e) => setNextRoundForm({ ...nextRoundForm, date: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                   Interview Time
//                 </label>
//                 <div className="relative">
//                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                   <input
//                     type="time"
//                     value={nextRoundForm.time}
//                     onChange={(e) => setNextRoundForm({ ...nextRoundForm, time: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                   Interview Mode
//                 </label>
//                 <div className="relative">
//                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                   <select
//                     value={nextRoundForm.mode}
//                     onChange={(e) => setNextRoundForm({ ...nextRoundForm, mode: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 appearance-none outline-none transition-all shadow-sm"
//                   >
//                     <option value="online">Online Conference</option>
//                     <option value="offline">In-Person Meeting</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//                 </div>
//               </div>

//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
//                   {nextRoundForm.mode === "online" ? "Meeting Link" : "Venue Details"}
//                 </label>
//                 <div className="relative">
//                   <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                   <input
//                     type="text"
//                     placeholder={nextRoundForm.mode === "online" ? "https://zoom.us/j/..." : "Enter conference room"}
//                     value={nextRoundForm.location}
//                     onChange={(e) => setNextRoundForm({ ...nextRoundForm, location: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section: Personnel */}
//           <div className="space-y-4 pt-6 border-t border-slate-100">
//             <div className="flex items-center gap-2 mb-2">
//               <UserPlus size={14} className="text-indigo-600" />
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interviewer Personnel</span>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                   <input
//                     type="text"
//                     placeholder="Enter full name"
//                     value={nextRoundForm.interviewerName}
//                     onChange={(e) => setNextRoundForm({ ...nextRoundForm, interviewerName: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                   Professional Role
//                 </label>
//                 <div className="relative">
//                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                   <input
//                     type="text"
//                     placeholder="e.g. Senior Architect"
//                     value={nextRoundForm.interviewerRole}
//                     onChange={(e) => setNextRoundForm({ ...nextRoundForm, interviewerRole: e.target.value })}
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2 group">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" size={16} />
//                 <input
//                   type="email"
//                   placeholder="interviewer@company.com"
//                   value={nextRoundForm.interviewerEmail}
//                   onChange={(e) => setNextRoundForm({ ...nextRoundForm, interviewerEmail: e.target.value })}
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Sidebar */}
//         <div className="w-full md:w-64 bg-slate-50/50 p-8 border-l border-slate-100 flex flex-col justify-between">
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Notice</h4>
//               <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
//                 Generating this round will notify the candidate and reserve the interviewer's calendar slot automatically.
//               </p>
//             </div>

//             <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
//                <Fingerprint className="absolute -right-2 -bottom-2 text-slate-50" size={60} />
//                <div className="relative z-10">
//                  <div className="flex items-center gap-2 mb-2">
//                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
//                     <span className="text-[10px] font-black text-slate-700 uppercase">Live Draft</span>
//                  </div>
//                  <p className="text-[10px] font-bold text-slate-500">Awaiting dispatch...</p>
//                </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setIsNextRoundModalOpen(false)}
//             className="mt-8 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
//           >
//             Discard Round
//           </button>
//         </div>
//       </div>

//       {/* Footer Actions */}
//       <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
//         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Enterprise Talent v4.0</p>
//         <button
//           onClick={handleCreateNextRound}
//           className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
//         >
//           Dispatch Invite
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       {isFeedbackModalOpen && (
//         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsFeedbackModalOpen(false)}
//           />

//           <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Left: Scoreboard Sidebar (35%) */}
//             <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//                   <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                     Pending Review
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-black text-slate-900 leading-tight">
//                   Scorecard <br />
//                   Analysis
//                 </h2>
//               </div>

//               <div className="space-y-8 flex-grow">
//                 <RatingRow
//                   label="Technical Logic"
//                   icon={Cpu}
//                   value={feedbackData.technicalScore}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, technicalScore: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Cultural Synergy"
//                   icon={Users}
//                   value={feedbackData.culturalFit}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, culturalFit: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Articulate/Comms"
//                   icon={MessageSquare}
//                   value={feedbackData.softSkills}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, softSkills: val })
//                   }
//                 />
//               </div>

//               <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
//                   Aggregate Intelligence
//                 </p>
//                 <div className="text-3xl font-black italic">
//                   {(
//                     (feedbackData.technicalScore +
//                       feedbackData.culturalFit +
//                       feedbackData.softSkills) /
//                     3
//                   ).toFixed(1)}
//                   <span className="text-lg opacity-50 not-italic ml-1">
//                     /10
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Narrative & Conclusion (62%) */}
//             <div className="flex-grow p-8 lg:p-10 flex flex-col">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                     Final Verdict
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Please provide your executive recommendation below.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-grow space-y-8">
//                 {/* Detailed Narrative */}
//                 <div className="group">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
//                     Candidate Assessment Narrative
//                   </label>
//                   <textarea
//                     rows="6"
//                     className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//                     placeholder="Highlight key strengths, weaknesses, and overall impression..."
//                     value={feedbackData.comments}
//                     onChange={(e) =>
//                       setFeedbackData({
//                         ...feedbackData,
//                         comments: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Decision Buttons */}
//                 <div className="space-y-4">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Decision Path
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       {
//                         id: "reject",
//                         label: "Reject",
//                         color: "hover:border-red-500 hover:text-red-600",
//                         active: "bg-red-50 border-red-500 text-red-600",
//                       },
//                       {
//                         id: "pass",
//                         label: "Pass",
//                         color: "hover:border-indigo-500 hover:text-indigo-600",
//                         active:
//                           "bg-indigo-50 border-indigo-500 text-indigo-600",
//                       },
//                       {
//                         id: "strong_pass",
//                         label: "Strong Pass",
//                         color:
//                           "hover:border-emerald-500 hover:text-emerald-600",
//                         active:
//                           "bg-emerald-50 border-emerald-500 text-emerald-600",
//                       },
//                     ].map((rec) => (
//                       <button
//                         key={rec.id}
//                         onClick={() =>
//                           setFeedbackData({
//                             ...feedbackData,
//                             recommendation: rec.id,
//                           })
//                         }
//                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                           feedbackData.recommendation === rec.id
//                             ? rec.active
//                             : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                         }`}
//                       >
//                         {rec.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFeedbackSubmit}
//                 className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 <Briefcase size={16} /> Finalize Session Audit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
//           {label}
//         </span>
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
//               ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
//               : "bg-slate-100 hover:bg-slate-200"
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
//*********************************************************working code phase 1 7/02/26*************************************************************** */
// import React, { useState, useEffect } from "react";
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
//   UserCheck,
//   Building2,
//   Smartphone,
//   ChevronDown,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Activity,
//   Fingerprint,
//   Calendar,
//   FileText,
//   Zap,
//   AlertCircle,
//   ArrowUpRight,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   ShieldAlert,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import { interviewService } from "../../services/interviewService";
// import toast from "react-hot-toast";

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
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     technicalScore: 0,
//     culturalFit: 0,
//     softSkills: 0,
//     comments: "",
//     recommendation: "", // hire, strong_hire, no_hire
//   });

//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
//   const [activeInterview, setActiveInterview] = useState(null);

//   const [rescheduleForm, setRescheduleForm] = useState({
//     interview_date: "",
//     mode: "online",
//     meeting_link: "",
//     venue_details: "",
//     reason: "",
//   });

//   useEffect(() => {
//     if (id) fetchCandidate();
//   }, [id]);
//   const [formData, setFormData] = useState({});
//   const [isNextRoundOpen, setIsNextRoundOpen] = useState(false);
// const [nextRoundBaseInterview, setNextRoundBaseInterview] = useState(null);

// const [nextRoundForm, setNextRoundForm] = useState({
//   interview_date: "",
//   mode: "online",
//   meeting_link: "",
//   venue_details: "",
//   interviewer_name: "",
// });

//   useEffect(() => {
//     if (candidate) {
//       setFormData({
//         full_name: candidate.full_name || "",
//         email: candidate.email || "",
//         phone: candidate.phone || "",
//         address: candidate.address || "",
//         status: candidate.status || "jd_pending",
//         position: candidate.position || "",
//         experience: candidate.experience || "",
//         education: candidate.education || "",
//         location: candidate.location || "",
//       });
//     }
//   }, [candidate]);

//   useEffect(() => {
//     if (activeInterview && isRescheduleOpen) {
//       setRescheduleForm({
//         interview_date: activeInterview.interview_date
//           ? new Date(activeInterview.interview_date).toISOString().slice(0, 16) // required for datetime-local
//           : "",
//         mode: activeInterview.mode || "online",
//         meeting_link: activeInterview.meeting_link || "",
//         venue_details: activeInterview.venue_details || "",
//         reason: "",
//       });
//     }
//   }, [activeInterview, isRescheduleOpen]);

//   // const normalized = data.interviews.map((i) => {
//   //   const dt = new Date(i.interview_date);

//   //   return {
//   //     ...i, // keep original fields (IMPORTANT)
//   //     round: i.round_number,
//   //     date: dt.toLocaleDateString(),
//   //     time: dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//   //     location: i.mode === "online" ? i.meeting_link : i.venue_details,
//   //     interviewerName: i.interviewer_name,
//   //     interviewerRole: "Interviewer",
//   //     status: i.status,
//   //   };
//   // });

//   const fetchCandidate = async () => {
//     try {
//       setLoading(true);

//       const data = await candidateService.getById(id);
//       setCandidate(data);

//       if (data.interviews) {
//         const normalized = data.interviews.map((i) => {
//           const dt = new Date(i.interview_date);

//           return {
//             ...i,
//             round: i.round_number,
//             date: dt.toLocaleDateString(),
//             time: dt.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             location: i.mode === "online" ? i.meeting_link : i.venue_details,
//             interviewerName: i.interviewer_name,
//             interviewerRole: "Interviewer",
//             status: i.status === "scheduled" ? "Scheduled" : i.status,
//           };
//         });

//         setInterviews(normalized);
//       } else {
//         setInterviews([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   if (loading) {
//     return (
//       <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
//     );
//   }

//   if (error) {
//     return <div className="p-10 text-red-500 font-bold">{error}</div>;
//   }

//   if (!candidate) return null;

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

//   const handleFeedbackSubmit = async () => {
//     if (!selectedInterview) return;

//     try {
//       const payload = {
//         technical_skill: feedbackData.technicalScore,
//         communication: feedbackData.softSkills,
//         problem_solving: feedbackData.technicalScore, // adjust if you add separate score
//         cultural_fit: feedbackData.culturalFit,
//         relevant_experience: feedbackData.technicalScore, // optional mapping
//         remarks: feedbackData.comments,
//         decision: feedbackData.recommendation,
//       };

//       await toast.promise(
//         interviewService.submitReview(selectedInterview.id, payload),
//         {
//           loading: "Submitting review...",
//           success: "Review submitted successfully 🎉",
//           error: "Failed to submit review",
//         },
//       );

//       // ✅ Close modal
//       setIsFeedbackModalOpen(false);

//       // ✅ Reset form
//       setFeedbackData({
//         technicalScore: 0,
//         culturalFit: 0,
//         softSkills: 0,
//         comments: "",
//         recommendation: "",
//       });

//       // ⭐ VERY IMPORTANT → Refresh candidate
//       fetchCandidate();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateAttendance = async (interviewId, status) => {
//     try {
//       await toast.promise(
//         interviewService.updateAttendance(interviewId, {
//           attendance_status: status,
//         }),
//         {
//           loading: "Updating attendance...",
//           success: "Attendance updated successfully",
//           error: "Failed to update attendance",
//         },
//       );

//       setIsAttendanceOpen(false);
//       fetchCandidate(); // 🔁 refresh UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!activeInterview) return;

//     try {
//       await toast.promise(
//         interviewService.rescheduleInterview(
//           activeInterview.id,
//           rescheduleForm,
//         ),
//         {
//           loading: "Rescheduling interview...",
//           success: "Interview rescheduled",
//           error: "Failed to reschedule interview",
//         },
//       );

//       setIsRescheduleOpen(false);
//       fetchCandidate(); // 🔁 refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await toast.promise(
//         fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             full_name: formData.full_name,
//             email: formData.email,
//             phone: formData.phone,
//             address: formData.address,
//             status: formData.status,
//             position: formData.position,
//             experience: formData.experience,
//             education: formData.education,
//             location: formData.location,
//           }),
//         }),
//         {
//           loading: "Updating candidate...",
//           success: "Candidate updated successfully ✅",
//           error: "Failed to update candidate ❌",
//         },
//       );

//       setIsEditModalOpen(false);
//       fetchCandidate(); // 🔁 refresh profile
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

//   const calculateVulnerabilityScore = () => {
//     if (!interviews || interviews.length === 0) return 0;

//     const completed = interviews.filter(
//       (i) => i.review && i.status === "completed",
//     );

//     if (completed.length === 0) return 0;

//     const total = completed.reduce((sum, i) => {
//       const avg =
//         (i.review.technical_skill +
//           i.review.communication +
//           i.review.cultural_fit) /
//         3;
//       return sum + avg;
//     }, 0);

//     const score10 = total / completed.length; // avg out of 10
//     const score100 = Math.round(score10 * 10); // convert to /100

//     return score100;
//   };

//   const vulnerabilityScore = calculateVulnerabilityScore();

//   const formatStatus = (status) => {
//     if (!status) return "N/A";

//     const map = {
//       jd_pending: "JD Pending",
//       jd_accepted: "JD Accepted",
//       selected: "Selected",
//       scheduled: "Scheduled",
//       completed: "Completed",
//       rejected: "Rejected",
//       no_show: "No Show",
//       attended: "Attended",
//       pending: "Pending",
//     };

//     return (
//       map[status] ||
//       status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//     );
//   };

//   const allowedStatuses = [
//     "applied",
//     "interviewing",
//     "rejected",
//     "jd_sent",
//     "jd_accepted",
//     "jd_rejected",
//     "jd_pending",
//   ];

//   const handleScheduleNextRound = (interview) => {
//   setNextRoundBaseInterview(interview);

//   setNextRoundForm({
//     interview_date: interview.interview_date
//       ? new Date(interview.interview_date).toISOString().slice(0, 16)
//       : "",
//     mode: interview.mode || "online",
//     meeting_link: interview.meeting_link || "",
//     venue_details: interview.venue_details || "",
//     interviewer_name: interview.interviewerName || "",
//     notes: "",
//   });

//   setIsNextRoundOpen(true);
// };

// const handleNextRoundSubmit = async () => {
//   if (!nextRoundBaseInterview) return;

//   try {
//     const payload = {
//       candidate_id: candidate.id,
//       interview_date: nextRoundForm.interview_date,
//       mode: nextRoundForm.mode,
//       meeting_link:
//         nextRoundForm.mode === "online"
//           ? nextRoundForm.meeting_link
//           : null,
//       venue_details:
//         nextRoundForm.mode === "offline"
//           ? nextRoundForm.venue_details
//           : null,
//       interviewer_name: nextRoundForm.interviewer_name,
//       notes: nextRoundForm.notes,
//       round_number: (nextRoundBaseInterview.round || 0) + 1, // 🔥 NEW ROUND
//     };

//     await toast.promise(
//       interviewService.createInterview(payload), // ⚡ create new, not update
//       {
//         loading: "Scheduling next round...",
//         success: "Next round created successfully 🚀",
//         error: "Failed to create next round",
//       }
//     );

//     setIsNextRoundOpen(false);
//     fetchCandidate(); // refresh
//   } catch (err) {
//     console.error(err);
//   }
// };

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
//             {/* {candidate.status} */}
//             {formatStatus(candidate.status)}
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
//                 {candidate?.name?.charAt(0) || "?"}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.full_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location}
//                 />
//                 {/* <HeroMeta
//                   icon={<Calendar size={14} />}
//                   text="Member since 2026"
//                 /> */}
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

//             <div className="mt-8 border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden font-sans transition-all hover:shadow-md">
//               {/* HEADER */}
//               <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-2.5 h-2.5 rounded-full animate-pulse ${
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-emerald-500"
//                     }`}
//                   />
//                   <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
//                     Vulnerability Analysis
//                   </h4>
//                 </div>

//                 <span className="text-[9px] whitespace-nowrap font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded tracking-wider uppercase">
//                   Live Sync
//                 </span>
//               </div>

//               {/* BODY */}
//               <div className="p-6">
//                 {/* SCORE + THREAT */}
//                 <div className="flex items-baseline justify-between mb-6">
//                   <div className="flex items-end gap-1">
//                     <span className="text-5xl font-black text-slate-900 tracking-tight leading-none">
//                       {vulnerabilityScore}
//                     </span>
//                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       /100
//                     </span>
//                   </div>

//                   <div className="text-right flex flex-col items-end">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       Threat Level
//                     </span>

//                     <span
//                       className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wide ${
//                         vulnerabilityScore > 70
//                           ? "bg-rose-50 text-rose-700"
//                           : vulnerabilityScore > 40
//                             ? "bg-amber-50 text-amber-700"
//                             : "bg-emerald-50 text-emerald-700"
//                       }`}
//                     >
//                       {vulnerabilityScore > 70
//                         ? "Critical"
//                         : vulnerabilityScore > 40
//                           ? "Elevated"
//                           : "Low Risk"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* SEGMENTED ENTERPRISE BAR */}
//                 <div className="flex gap-[2px] h-3 w-full mb-2">
//                   {[...Array(20)].map((_, i) => {
//                     const active = i < vulnerabilityScore / 5;

//                     const color =
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-slate-900";

//                     return (
//                       <div
//                         key={i}
//                         className={`flex-1 rounded-sm transition-all duration-500 ${
//                           active ? color : "bg-slate-100"
//                         }`}
//                         style={{ transitionDelay: `${i * 18}ms` }}
//                       />
//                     );
//                   })}
//                 </div>

//                 {/* LABEL SCALE */}
//                 <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                   <span>Low</span>
//                   <span>Moderate</span>
//                   <span>High</span>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

//             {/* --- ACTION TRIGGER BANNER --- */}
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

//                               <div className="flex flex-col items-end gap-2">
//                                 <div
//                                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                                     i.status === "Completed"
//                                       ? "bg-indigo-50 text-indigo-600 border-indigo-100"
//                                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   }`}
//                                 >
//                                   {i.status}
//                                 </div>

//                                 {i.attendance_status === "pending" ? (
//                                   <div className="flex flex-col items-end gap-2">
//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsRescheduleOpen(true);
//                                       }}
//                                       className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
//                                     >
//                                       Reschedule
//                                     </button>

//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsAttendanceOpen(true);
//                                       }}
//                                       className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
//                                     >
//                                       Interview Status
//                                     </button>
//                                   </div>
//                                 ) : i.attendance_status === "no_show" ? (
//                                   /* 🔴 NO SHOW – NEW CONDITION */
//                                   <button
//                                     onClick={() => {
//                                       setActiveInterview(i);
//                                       setIsRescheduleOpen(true);
//                                     }}
//                                     className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
//                                   >
//                                     Schedule Again
//                                   </button>
//                                 ) : (
//                                   <>
//                                     {i.status === "completed" && i.review ? (
//                                       // <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//                                       //   <Star size={12} fill="currentColor" />
//                                       //   SCORE: {i.review.total_score.toFixed(1)}
//                                       // </div>
//                                        <div className="flex flex-col items-end gap-2">

//       {/* SCORE */}
//       <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//         <Star size={12} fill="currentColor" />
//         SCORE: {i.review.total_score.toFixed(1)}
//       </div>

//       {/* NEW BUTTON — NEXT ROUND */}
//       <button
//         onClick={() => handleScheduleNextRound(i)}
//         className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
//       >
//         Schedule Next Round
//       </button>
//     </div>
//                                     ) : (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedInterview(i);
//                                           setIsFeedbackModalOpen(true);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                                       >
//                                         Evaluate <ExternalLink size={12} />
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
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
//                     value={candidate.full_name}
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
//                     value={`${candidate.location}`}
//                     // value={`${candidate.location.city}, ${candidate.location.state}`}
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

//                   {allowedStatuses.includes(candidate.status) && (
//                     <div className="col-span-2 flex items-center justify-end p-4">
//                       <button
//                         onClick={() =>
//                           navigate(`/invitation/${id}/scheduleinterview`)
//                         }
//                         className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                       >
//                         <Edit3 size={16} /> Interview Schedule
//                       </button>
//                     </div>
//                   )}
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
//                   {/* Sync Entity Records */}
//                   Edit Candidate Data
//                 </h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//                   {/* Updating global profile attributes */}
//                   Updating candidate profile information
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
//                   value={formData.full_name}
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
//                 <InputField
//                   label="Phone Number"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Education"
//                   name="education"
//                   value={formData.education}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                 />

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Candidate Status
//                   </label>

//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//                   >
//                     <option value="jd_pending">JD Pending</option>
//                     <option value="jd_accepted">JD Accepted</option>
//                     <option value="selected">Selected</option>
//                   </select>
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

//                   {/* Resume Viewer */}
//                   <div className="w-full h-full">
//                     {candidate.resume_path ? (
//                       isPdf(candidate.resume_path) ? (
//                         <iframe
//                           src={candidate.resume_path}
//                           title="Candidate Resume"
//                           className="w-full h-[1000px] rounded-xl border border-slate-200"
//                         />
//                       ) : (
//                         <img
//                           src={candidate.resume_path}
//                           alt="Candidate Resume"
//                           className="w-full rounded-xl border border-slate-200"
//                         />
//                       )
//                     ) : (
//                       <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
//                         No Resume Uploaded
//                       </div>
//                     )}
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
//                       value={`Verified ${candidate.education}`}
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

//       {isDecisionModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsDecisionModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
//             {/* Modal Header */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="space-y-1">
//                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <ShieldAlert size={16} className="text-indigo-600" /> Final
//                   Determination Panel
//                 </h2>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                   Authorized Personnel Only
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDecisionModalOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 pt-4">
//               <div className="space-y-6">
//                 {/* Remark Input */}
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                     Protocol Remarks
//                   </label>
//                   <textarea
//                     placeholder="Provide context for this decision..."
//                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
//                   />
//                 </div>

//                 {/* Action Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
//                     <ShieldCheck size={16} /> Approve
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Audit Footer */}
//             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                 Secure Terminal Session • Immutable Audit Log Enabled
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {isRescheduleOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* High-fidelity Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsRescheduleOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Timeline Modification */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//                   <Clock size={20} />
//                 </div>
//                 <div>
//                   {/* <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Timeline Adjustment
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Modifying Interview Schedule
//                   </p> */}
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Reschedule Interview — Round {activeInterview?.round_number}
//                   </h3>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Update Interview Date & Time
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Core Scheduling Logic */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Target Timestamp
//                   </label>
//                   <div className="relative group">
//                     <Calendar
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <input
//                       type="datetime-local"
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                       value={rescheduleForm.interview_date}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           interview_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Interaction Mode
//                   </label>
//                   <div className="relative group">
//                     <Globe
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <select
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
//                       value={rescheduleForm.mode}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="online">Virtual / Online</option>
//                       <option value="offline">On-Site / Physical</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Context-Aware Location Field */}
//               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   {rescheduleForm.mode === "online"
//                     ? "Digital Access Link"
//                     : "Facility / Venue Details"}
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     {rescheduleForm.mode === "online" ? (
//                       <Zap size={14} />
//                     ) : (
//                       <MapPin size={14} />
//                     )}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder={
//                       rescheduleForm.mode === "online"
//                         ? "https://meet.google.com/..."
//                         : "Boardroom 4C, Level 2"
//                     }
//                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                     value={
//                       rescheduleForm.mode === "online"
//                         ? rescheduleForm.meeting_link
//                         : rescheduleForm.venue_details
//                     }
//                     onChange={(e) =>
//                       setRescheduleForm({
//                         ...rescheduleForm,
//                         [rescheduleForm.mode === "online"
//                           ? "meeting_link"
//                           : "venue_details"]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Audit Log / Reason */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Justification for Reschedule
//                 </label>
//                 <textarea
//                   placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
//                   className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
//                   value={rescheduleForm.reason}
//                   onChange={(e) =>
//                     setRescheduleForm({
//                       ...rescheduleForm,
//                       reason: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Warning Policy Card */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <AlertCircle size={16} className="text-amber-500 shrink-0" />
//                 <p className="text-[10px] font-medium text-amber-800 leading-tight">
//                   <strong>Policy Notice:</strong> Rescheduling will
//                   automatically trigger an email notification to the candidate
//                   and update the internal calendar registry.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Execution Bar */}
//             <div className="p-6 bg-slate-900 flex items-center justify-between">
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRescheduleSubmit}
//                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
//               >
//                 Confirm Adjustment
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAttendanceOpen && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
//             onClick={() => setIsAttendanceOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Disposition Logic */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                   <UserCheck size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Attendance Registry
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Post-Interview Disposition
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Candidate Meta Info */}
//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                 <div className="flex flex-col">
//                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Active Interviewee
//                   </span>
//                   <span className="text-sm font-bold text-slate-800">
//                     {activeInterview?.candidate_name || "Unidentified Asset"}
//                   </span>
//                 </div>
//                 <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
//                   ID:{" "}
//                   {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
//                     "N/A"}
//                 </div>
//               </div>

//               {/* Status Selection: High-Contrast Interaction */}
//               <div className="space-y-3">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Update Final Status
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
//                     <Activity size={16} />
//                   </div>
//                   <select
//                     className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
//                     onChange={(e) =>
//                       updateAttendance(activeInterview.id, e.target.value)
//                     }
//                   >
//                     <option value="">Select Protocol</option>
//                     <option value="attended" className="text-emerald-600">
//                       ✓ Mark as Attended
//                     </option>
//                     <option value="no_show" className="text-rose-600">
//                       ✗ Report No-Show
//                     </option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </div>

//               {/* System Notice */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <ShieldAlert
//                   size={16}
//                   className="text-amber-500 shrink-0 mt-0.5"
//                 />
//                 <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
//                   <strong>Audit Note:</strong> Changing this status will update
//                   the candidate's lifecycle history and notify the assigned
//                   hiring manager. This action is logged under your session.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Close Execution */}
//             <div className="p-6 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
//               >
//                 Confirm & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isNextRoundOpen && (
//   <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//       onClick={() => setIsNextRoundOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 space-y-6">
//       <h3 className="text-lg font-bold">
//         Schedule Round {(nextRoundBaseInterview?.round || 0) + 1}
//       </h3>

//       {/* Date Time */}
//       <input
//         type="datetime-local"
//         value={nextRoundForm.interview_date}
//         onChange={(e) =>
//           setNextRoundForm({
//             ...nextRoundForm,
//             interview_date: e.target.value,
//           })
//         }
//         className="w-full border rounded-lg p-3"
//       />

//       {/* Mode */}
//       <select
//         value={nextRoundForm.mode}
//         onChange={(e) =>
//           setNextRoundForm({ ...nextRoundForm, mode: e.target.value })
//         }
//         className="w-full border rounded-lg p-3"
//       >
//         <option value="online">Online</option>
//         <option value="offline">Offline</option>
//       </select>

//       {/* Link / Venue */}
//       {nextRoundForm.mode === "online" ? (
//         <input
//           placeholder="Meeting Link"
//           value={nextRoundForm.meeting_link}
//           onChange={(e) =>
//             setNextRoundForm({
//               ...nextRoundForm,
//               meeting_link: e.target.value,
//             })
//           }
//           className="w-full border rounded-lg p-3"
//         />
//       ) : (
//         <input
//           placeholder="Venue Details"
//           value={nextRoundForm.venue_details}
//           onChange={(e) =>
//             setNextRoundForm({
//               ...nextRoundForm,
//               venue_details: e.target.value,
//             })
//           }
//           className="w-full border rounded-lg p-3"
//         />
//       )}

//       {/* Interviewer */}
//       <input
//         placeholder="Interviewer Name"
//         value={nextRoundForm.interviewer_name}
//         onChange={(e) =>
//           setNextRoundForm({
//             ...nextRoundForm,
//             interviewer_name: e.target.value,
//           })
//         }
//         className="w-full border rounded-lg p-3"
//       />

//       {/* Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setIsNextRoundOpen(false)}
//           className="px-5 py-2 border rounded-lg"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleNextRoundSubmit}
//           className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
//         >
//           Create Next Round
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       {isFeedbackModalOpen && (
//         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsFeedbackModalOpen(false)}
//           />

//           <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Left: Scoreboard Sidebar (35%) */}
//             <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//                   <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                     Pending Review
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-black text-slate-900 leading-tight">
//                   Scorecard <br />
//                   Analysis
//                 </h2>
//               </div>

//               <div className="space-y-8 flex-grow">
//                 <RatingRow
//                   label="Technical Logic"
//                   icon={Cpu}
//                   value={feedbackData.technicalScore}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, technicalScore: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Cultural Synergy"
//                   icon={Users}
//                   value={feedbackData.culturalFit}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, culturalFit: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Articulate/Comms"
//                   icon={MessageSquare}
//                   value={feedbackData.softSkills}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, softSkills: val })
//                   }
//                 />
//               </div>

//               <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
//                   Aggregate Intelligence
//                 </p>
//                 <div className="text-3xl font-black italic">
//                   {(
//                     (feedbackData.technicalScore +
//                       feedbackData.culturalFit +
//                       feedbackData.softSkills) /
//                     3
//                   ).toFixed(1)}
//                   <span className="text-lg opacity-50 not-italic ml-1">
//                     /10
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Narrative & Conclusion (62%) */}
//             <div className="flex-grow p-8 lg:p-10 flex flex-col">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                     Final Verdict
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Please provide your executive recommendation below.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-grow space-y-8">
//                 {/* Detailed Narrative */}
//                 <div className="group">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
//                     Candidate Assessment Narrative
//                   </label>
//                   <textarea
//                     rows="6"
//                     className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//                     placeholder="Highlight key strengths, weaknesses, and overall impression..."
//                     value={feedbackData.comments}
//                     onChange={(e) =>
//                       setFeedbackData({
//                         ...feedbackData,
//                         comments: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Decision Buttons */}
//                 <div className="space-y-4">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Decision Path
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       {
//                         id: "reject",
//                         label: "Reject",
//                         color: "hover:border-red-500 hover:text-red-600",
//                         active: "bg-red-50 border-red-500 text-red-600",
//                       },
//                       {
//                         id: "pass",
//                         label: "Pass",
//                         color: "hover:border-indigo-500 hover:text-indigo-600",
//                         active:
//                           "bg-indigo-50 border-indigo-500 text-indigo-600",
//                       },
//                       {
//                         id: "strong_pass",
//                         label: "Strong Pass",
//                         color:
//                           "hover:border-emerald-500 hover:text-emerald-600",
//                         active:
//                           "bg-emerald-50 border-emerald-500 text-emerald-600",
//                       },
//                     ].map((rec) => (
//                       <button
//                         key={rec.id}
//                         onClick={() =>
//                           setFeedbackData({
//                             ...feedbackData,
//                             recommendation: rec.id,
//                           })
//                         }
//                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                           feedbackData.recommendation === rec.id
//                             ? rec.active
//                             : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                         }`}
//                       >
//                         {rec.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFeedbackSubmit}
//                 className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 <Briefcase size={16} /> Finalize Session Audit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
//           {label}
//         </span>
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
//               ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
//               : "bg-slate-100 hover:bg-slate-200"
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
//*************************************************working code phase 22*************************************************************** */
// import React, { useState, useEffect } from "react";
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
//   UserCheck,
//   Building2,
//   Smartphone,
//   ChevronDown,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Activity,
//   Fingerprint,
//   Calendar,
//   FileText,
//   Zap,
//   AlertCircle,
//   ArrowUpRight,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   ShieldAlert,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import { interviewService } from "../../services/interviewService";
// import toast from "react-hot-toast";

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
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     technicalScore: 0,
//     culturalFit: 0,
//     softSkills: 0,
//     comments: "",
//     recommendation: "", // hire, strong_hire, no_hire
//   });

//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
//   const [activeInterview, setActiveInterview] = useState(null);

//   const [rescheduleForm, setRescheduleForm] = useState({
//     interview_date: "",
//     mode: "online",
//     meeting_link: "",
//     venue_details: "",
//     reason: "",
//   });

//   useEffect(() => {
//     if (id) fetchCandidate();
//   }, [id]);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (candidate) {
//       setFormData({
//         full_name: candidate.full_name || "",
//         email: candidate.email || "",
//         phone: candidate.phone || "",
//         address: candidate.address || "",
//         status: candidate.status || "jd_pending",
//         position: candidate.position || "",
//         experience: candidate.experience || "",
//         education: candidate.education || "",
//         location: candidate.location || "",
//       });
//     }
//   }, [candidate]);

//   useEffect(() => {
//     if (activeInterview && isRescheduleOpen) {
//       setRescheduleForm({
//         interview_date: activeInterview.interview_date
//           ? new Date(activeInterview.interview_date).toISOString().slice(0, 16) // required for datetime-local
//           : "",
//         mode: activeInterview.mode || "online",
//         meeting_link: activeInterview.meeting_link || "",
//         venue_details: activeInterview.venue_details || "",
//         reason: "",
//       });
//     }
//   }, [activeInterview, isRescheduleOpen]);

//   // const normalized = data.interviews.map((i) => {
//   //   const dt = new Date(i.interview_date);

//   //   return {
//   //     ...i, // keep original fields (IMPORTANT)
//   //     round: i.round_number,
//   //     date: dt.toLocaleDateString(),
//   //     time: dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//   //     location: i.mode === "online" ? i.meeting_link : i.venue_details,
//   //     interviewerName: i.interviewer_name,
//   //     interviewerRole: "Interviewer",
//   //     status: i.status,
//   //   };
//   // });

//   const fetchCandidate = async () => {
//     try {
//       setLoading(true);

//       const data = await candidateService.getById(id);
//       setCandidate(data);

//       if (data.interviews) {
//         const normalized = data.interviews.map((i) => {
//           const dt = new Date(i.interview_date);

//           return {
//             ...i,
//             round: i.round_number,
//             date: dt.toLocaleDateString(),
//             time: dt.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             location: i.mode === "online" ? i.meeting_link : i.venue_details,
//             interviewerName: i.interviewer_name,
//             interviewerRole: "Interviewer",
//             status: i.status === "scheduled" ? "Scheduled" : i.status,
//           };
//         });

//         setInterviews(normalized);
//       } else {
//         setInterviews([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   if (loading) {
//     return (
//       <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
//     );
//   }

//   if (error) {
//     return <div className="p-10 text-red-500 font-bold">{error}</div>;
//   }

//   if (!candidate) return null;

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

//   const handleFeedbackSubmit = async () => {
//     if (!selectedInterview) return;

//     try {
//       const payload = {
//         technical_skill: feedbackData.technicalScore,
//         communication: feedbackData.softSkills,
//         problem_solving: feedbackData.technicalScore, // adjust if you add separate score
//         cultural_fit: feedbackData.culturalFit,
//         relevant_experience: feedbackData.technicalScore, // optional mapping
//         remarks: feedbackData.comments,
//         decision: feedbackData.recommendation,
//       };

//       await toast.promise(
//         interviewService.submitReview(selectedInterview.id, payload),
//         {
//           loading: "Submitting review...",
//           success: "Review submitted successfully 🎉",
//           error: "Failed to submit review",
//         },
//       );

//       // ✅ Close modal
//       setIsFeedbackModalOpen(false);

//       // ✅ Reset form
//       setFeedbackData({
//         technicalScore: 0,
//         culturalFit: 0,
//         softSkills: 0,
//         comments: "",
//         recommendation: "",
//       });

//       // ⭐ VERY IMPORTANT → Refresh candidate
//       fetchCandidate();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateAttendance = async (interviewId, status) => {
//     try {
//       await toast.promise(
//         interviewService.updateAttendance(interviewId, {
//           attendance_status: status,
//         }),
//         {
//           loading: "Updating attendance...",
//           success: "Attendance updated successfully",
//           error: "Failed to update attendance",
//         },
//       );

//       setIsAttendanceOpen(false);
//       fetchCandidate(); // 🔁 refresh UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!activeInterview) return;

//     try {
//       await toast.promise(
//         interviewService.rescheduleInterview(
//           activeInterview.id,
//           rescheduleForm,
//         ),
//         {
//           loading: "Rescheduling interview...",
//           success: "Interview rescheduled",
//           error: "Failed to reschedule interview",
//         },
//       );

//       setIsRescheduleOpen(false);
//       fetchCandidate(); // 🔁 refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await toast.promise(
//         fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             full_name: formData.full_name,
//             email: formData.email,
//             phone: formData.phone,
//             address: formData.address,
//             status: formData.status,
//             position: formData.position,
//             experience: formData.experience,
//             education: formData.education,
//             location: formData.location,
//           }),
//         }),
//         {
//           loading: "Updating candidate...",
//           success: "Candidate updated successfully ✅",
//           error: "Failed to update candidate ❌",
//         },
//       );

//       setIsEditModalOpen(false);
//       fetchCandidate(); // 🔁 refresh profile
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

//   const calculateVulnerabilityScore = () => {
//     if (!interviews || interviews.length === 0) return 0;

//     const completed = interviews.filter(
//       (i) => i.review && i.status === "completed",
//     );

//     if (completed.length === 0) return 0;

//     const total = completed.reduce((sum, i) => {
//       const avg =
//         (i.review.technical_skill +
//           i.review.communication +
//           i.review.cultural_fit) /
//         3;
//       return sum + avg;
//     }, 0);

//     const score10 = total / completed.length; // avg out of 10
//     const score100 = Math.round(score10 * 10); // convert to /100

//     return score100;
//   };

//   const vulnerabilityScore = calculateVulnerabilityScore();

//   const formatStatus = (status) => {
//     if (!status) return "N/A";

//     const map = {
//       jd_pending: "JD Pending",
//       jd_accepted: "JD Accepted",
//       selected: "Selected",
//       scheduled: "Scheduled",
//       completed: "Completed",
//       rejected: "Rejected",
//       no_show: "No Show",
//       attended: "Attended",
//       pending: "Pending",
//     };

//     return (
//       map[status] ||
//       status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//     );
//   };

//   const allowedStatuses = [
//     "applied",
//     "interviewing",
//     "rejected",
//     "jd_sent",
//     "jd_accepted",
//     "jd_rejected",
//     "jd_pending",
//   ];

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
//             {/* {candidate.status} */}
//             {formatStatus(candidate.status)}
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
//                 {candidate?.name?.charAt(0) || "?"}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.full_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location}
//                 />
//                 {/* <HeroMeta
//                   icon={<Calendar size={14} />}
//                   text="Member since 2026"
//                 /> */}
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

//             {/* <div className="mt-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
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
//             </div> */}

//             {/* <div class="mt-8 border border-slate-200 bg-white rounded-lg shadow-sm overflow-hidden font-sans">

//   <div class="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//     <div class="flex items-center gap-2">
//       <div class={`w-2 h-2 rounded-full animate-pulse ${
//         vulnerabilityScore > 70 ? 'bg-rose-500' : vulnerabilityScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
//       }`}></div>
//       <h4 class="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
//         Vulnerability Analysis
//       </h4>
//     </div>
//     <span class="text-[9px] whitespace-nowrap font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded tracking-tighter uppercase">
//       Live Sync
//     </span>
//   </div>

//   <div class="p-6">
//     <div class="flex items-baseline justify-between mb-5">
//       <div class="flex items-baseline gap-1">
//         <span class="text-5xl font-black text-slate-900 tracking-tighter leading-none">
//           {vulnerabilityScore}
//         </span>
//         <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
//       </div>

//       <div class="text-right flex flex-col items-end">
//         <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Threat Level</span>
//         <span class={`text-xs font-black uppercase px-2 py-1 rounded-md ${
//           vulnerabilityScore > 70 ? 'bg-rose-50 text-rose-700' :
//           vulnerabilityScore > 40 ? 'bg-amber-50 text-amber-700' :
//           'bg-emerald-50 text-emerald-700'
//         }`}>
//           {vulnerabilityScore > 70 ? 'Critical' : vulnerabilityScore > 40 ? 'Elevated' : 'Low Risk'}
//         </span>
//       </div>
//     </div>

//     <div class="flex gap-1 h-3 w-full mb-6">
//       {[...Array(20)].map((_, i) => (
//         <div
//           key={i}
//           className={`h-full flex-1 rounded-sm transition-all duration-500 ${
//             i < (vulnerabilityScore / 5)
//               ? (vulnerabilityScore > 70 ? 'bg-rose-500' : vulnerabilityScore > 40 ? 'bg-amber-500' : 'bg-slate-900')
//               : 'bg-slate-100'
//           }`}
//           style={{ transitionDelay: `${i * 15}ms` }}
//         />
//       ))}
//     </div>
//   </div>
// </div> */}

//             <div className="mt-8 border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden font-sans transition-all hover:shadow-md">
//               {/* HEADER */}
//               <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-2.5 h-2.5 rounded-full animate-pulse ${
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-emerald-500"
//                     }`}
//                   />
//                   <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
//                     Vulnerability Analysis
//                   </h4>
//                 </div>

//                 <span className="text-[9px] whitespace-nowrap font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded tracking-wider uppercase">
//                   Live Sync
//                 </span>
//               </div>

//               {/* BODY */}
//               <div className="p-6">
//                 {/* SCORE + THREAT */}
//                 <div className="flex items-baseline justify-between mb-6">
//                   <div className="flex items-end gap-1">
//                     <span className="text-5xl font-black text-slate-900 tracking-tight leading-none">
//                       {vulnerabilityScore}
//                     </span>
//                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       /100
//                     </span>
//                   </div>

//                   <div className="text-right flex flex-col items-end">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                       Threat Level
//                     </span>

//                     <span
//                       className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wide ${
//                         vulnerabilityScore > 70
//                           ? "bg-rose-50 text-rose-700"
//                           : vulnerabilityScore > 40
//                             ? "bg-amber-50 text-amber-700"
//                             : "bg-emerald-50 text-emerald-700"
//                       }`}
//                     >
//                       {vulnerabilityScore > 70
//                         ? "Critical"
//                         : vulnerabilityScore > 40
//                           ? "Elevated"
//                           : "Low Risk"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* SEGMENTED ENTERPRISE BAR */}
//                 <div className="flex gap-[2px] h-3 w-full mb-2">
//                   {[...Array(20)].map((_, i) => {
//                     const active = i < vulnerabilityScore / 5;

//                     const color =
//                       vulnerabilityScore > 70
//                         ? "bg-rose-500"
//                         : vulnerabilityScore > 40
//                           ? "bg-amber-500"
//                           : "bg-slate-900";

//                     return (
//                       <div
//                         key={i}
//                         className={`flex-1 rounded-sm transition-all duration-500 ${
//                           active ? color : "bg-slate-100"
//                         }`}
//                         style={{ transitionDelay: `${i * 18}ms` }}
//                       />
//                     );
//                   })}
//                 </div>

//                 {/* LABEL SCALE */}
//                 <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                   <span>Low</span>
//                   <span>Moderate</span>
//                   <span>High</span>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* 04. CONTENT ENGINE */}
//           <article className="col-span-12 lg:col-span-9 bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden min-h-[550px]">
//             {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

//             {/* --- ACTION TRIGGER BANNER --- */}
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

//                               <div className="flex flex-col items-end gap-2">
//                                 <div
//                                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                                     i.status === "Completed"
//                                       ? "bg-indigo-50 text-indigo-600 border-indigo-100"
//                                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   }`}
//                                 >
//                                   {i.status}
//                                 </div>

//                                 {i.attendance_status === "pending" ? (
//                                   <div className="flex flex-col items-end gap-2">
//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsRescheduleOpen(true);
//                                       }}
//                                       className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
//                                     >
//                                       Reschedule
//                                     </button>

//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsAttendanceOpen(true);
//                                       }}
//                                       className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
//                                     >
//                                       Interview Status
//                                     </button>
//                                   </div>
//                                 ) : i.attendance_status === "no_show" ? (
//                                   /* 🔴 NO SHOW – NEW CONDITION */
//                                   <button
//                                     onClick={() => {
//                                       setActiveInterview(i);
//                                       setIsRescheduleOpen(true);
//                                     }}
//                                     className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
//                                   >
//                                     Schedule Again
//                                   </button>
//                                 ) : (
//                                   <>
//                                     {i.status === "completed" && i.review ? (
//                                       <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//                                         <Star size={12} fill="currentColor" />
//                                         SCORE: {i.review.total_score.toFixed(1)}
//                                       </div>
//                                     ) : (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedInterview(i);
//                                           setIsFeedbackModalOpen(true);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                                       >
//                                         Evaluate <ExternalLink size={12} />
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
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
//                     value={candidate.full_name}
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
//                     value={`${candidate.location}`}
//                     // value={`${candidate.location.city}, ${candidate.location.state}`}
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

//                   {/* <div className="col-span-2 flex items-center justify-end p-4 ">
//                     <button
//                       onClick={() =>
//                         navigate(`/invitation/${id}/scheduleinterview`)
//                       }
//                       className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                     >
//                       <Edit3 size={16} /> Interview Schedule
//                     </button>
//                   </div> */}

//                   {allowedStatuses.includes(candidate.status) && (
//                     <div className="col-span-2 flex items-center justify-end p-4">
//                       <button
//                         onClick={() =>
//                           navigate(`/invitation/${id}/scheduleinterview`)
//                         }
//                         className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                       >
//                         <Edit3 size={16} /> Interview Schedule
//                       </button>
//                     </div>
//                   )}
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
//                   {/* Sync Entity Records */}
//                   Edit Candidate Data
//                 </h2>
//                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//                   {/* Updating global profile attributes */}
//                   Updating candidate profile information
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
//                   value={formData.full_name}
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
//                 <InputField
//                   label="Phone Number"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Education"
//                   name="education"
//                   value={formData.education}
//                   onChange={handleInputChange}
//                 />

//                 <InputField
//                   label="Location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                 />

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//                   />
//                 </div>

//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//                     Candidate Status
//                   </label>

//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//                   >
//                     <option value="jd_pending">JD Pending</option>
//                     <option value="jd_accepted">JD Accepted</option>
//                     <option value="selected">Selected</option>
//                   </select>
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

//                   {/* Resume Viewer */}
//                   <div className="w-full h-full">
//                     {candidate.resume_path ? (
//                       isPdf(candidate.resume_path) ? (
//                         <iframe
//                           src={candidate.resume_path}
//                           title="Candidate Resume"
//                           className="w-full h-[1000px] rounded-xl border border-slate-200"
//                         />
//                       ) : (
//                         <img
//                           src={candidate.resume_path}
//                           alt="Candidate Resume"
//                           className="w-full rounded-xl border border-slate-200"
//                         />
//                       )
//                     ) : (
//                       <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
//                         No Resume Uploaded
//                       </div>
//                     )}
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
//                       value={`Verified ${candidate.education}`}
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

//       {isDecisionModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsDecisionModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
//             {/* Modal Header */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="space-y-1">
//                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <ShieldAlert size={16} className="text-indigo-600" /> Final
//                   Determination Panel
//                 </h2>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                   Authorized Personnel Only
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDecisionModalOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 pt-4">
//               <div className="space-y-6">
//                 {/* Remark Input */}
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                     Protocol Remarks
//                   </label>
//                   <textarea
//                     placeholder="Provide context for this decision..."
//                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
//                   />
//                 </div>

//                 {/* Action Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
//                     <ShieldCheck size={16} /> Approve
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Audit Footer */}
//             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                 Secure Terminal Session • Immutable Audit Log Enabled
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {isRescheduleOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* High-fidelity Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsRescheduleOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Timeline Modification */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//                   <Clock size={20} />
//                 </div>
//                 <div>
//                   {/* <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Timeline Adjustment
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Modifying Interview Schedule
//                   </p> */}
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Reschedule Interview — Round {activeInterview?.round_number}
//                   </h3>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Update Interview Date & Time
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Core Scheduling Logic */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Target Timestamp
//                   </label>
//                   <div className="relative group">
//                     <Calendar
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <input
//                       type="datetime-local"
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                       value={rescheduleForm.interview_date}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           interview_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Interaction Mode
//                   </label>
//                   <div className="relative group">
//                     <Globe
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <select
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
//                       value={rescheduleForm.mode}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="online">Virtual / Online</option>
//                       <option value="offline">On-Site / Physical</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Context-Aware Location Field */}
//               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   {rescheduleForm.mode === "online"
//                     ? "Digital Access Link"
//                     : "Facility / Venue Details"}
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     {rescheduleForm.mode === "online" ? (
//                       <Zap size={14} />
//                     ) : (
//                       <MapPin size={14} />
//                     )}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder={
//                       rescheduleForm.mode === "online"
//                         ? "https://meet.google.com/..."
//                         : "Boardroom 4C, Level 2"
//                     }
//                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                     value={
//                       rescheduleForm.mode === "online"
//                         ? rescheduleForm.meeting_link
//                         : rescheduleForm.venue_details
//                     }
//                     onChange={(e) =>
//                       setRescheduleForm({
//                         ...rescheduleForm,
//                         [rescheduleForm.mode === "online"
//                           ? "meeting_link"
//                           : "venue_details"]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Audit Log / Reason */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Justification for Reschedule
//                 </label>
//                 <textarea
//                   placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
//                   className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
//                   value={rescheduleForm.reason}
//                   onChange={(e) =>
//                     setRescheduleForm({
//                       ...rescheduleForm,
//                       reason: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Warning Policy Card */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <AlertCircle size={16} className="text-amber-500 shrink-0" />
//                 <p className="text-[10px] font-medium text-amber-800 leading-tight">
//                   <strong>Policy Notice:</strong> Rescheduling will
//                   automatically trigger an email notification to the candidate
//                   and update the internal calendar registry.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Execution Bar */}
//             <div className="p-6 bg-slate-900 flex items-center justify-between">
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRescheduleSubmit}
//                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
//               >
//                 Confirm Adjustment
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAttendanceOpen && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
//             onClick={() => setIsAttendanceOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Disposition Logic */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                   <UserCheck size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Attendance Registry
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Post-Interview Disposition
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Candidate Meta Info */}
//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                 <div className="flex flex-col">
//                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Active Interviewee
//                   </span>
//                   <span className="text-sm font-bold text-slate-800">
//                     {activeInterview?.candidate_name || "Unidentified Asset"}
//                   </span>
//                 </div>
//                 <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
//                   ID:{" "}
//                   {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
//                     "N/A"}
//                 </div>
//               </div>

//               {/* Status Selection: High-Contrast Interaction */}
//               <div className="space-y-3">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Update Final Status
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
//                     <Activity size={16} />
//                   </div>
//                   <select
//                     className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
//                     onChange={(e) =>
//                       updateAttendance(activeInterview.id, e.target.value)
//                     }
//                   >
//                     <option value="">Select Protocol</option>
//                     <option value="attended" className="text-emerald-600">
//                       ✓ Mark as Attended
//                     </option>
//                     <option value="no_show" className="text-rose-600">
//                       ✗ Report No-Show
//                     </option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </div>

//               {/* System Notice */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <ShieldAlert
//                   size={16}
//                   className="text-amber-500 shrink-0 mt-0.5"
//                 />
//                 <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
//                   <strong>Audit Note:</strong> Changing this status will update
//                   the candidate's lifecycle history and notify the assigned
//                   hiring manager. This action is logged under your session.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Close Execution */}
//             <div className="p-6 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
//               >
//                 Confirm & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isFeedbackModalOpen && (
//         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsFeedbackModalOpen(false)}
//           />

//           <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Left: Scoreboard Sidebar (35%) */}
//             <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//                   <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                     Pending Review
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-black text-slate-900 leading-tight">
//                   Scorecard <br />
//                   Analysis
//                 </h2>
//               </div>

//               <div className="space-y-8 flex-grow">
//                 <RatingRow
//                   label="Technical Logic"
//                   icon={Cpu}
//                   value={feedbackData.technicalScore}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, technicalScore: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Cultural Synergy"
//                   icon={Users}
//                   value={feedbackData.culturalFit}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, culturalFit: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Articulate/Comms"
//                   icon={MessageSquare}
//                   value={feedbackData.softSkills}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, softSkills: val })
//                   }
//                 />
//               </div>

//               <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
//                   Aggregate Intelligence
//                 </p>
//                 <div className="text-3xl font-black italic">
//                   {(
//                     (feedbackData.technicalScore +
//                       feedbackData.culturalFit +
//                       feedbackData.softSkills) /
//                     3
//                   ).toFixed(1)}
//                   <span className="text-lg opacity-50 not-italic ml-1">
//                     /10
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Narrative & Conclusion (62%) */}
//             <div className="flex-grow p-8 lg:p-10 flex flex-col">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                     Final Verdict
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Please provide your executive recommendation below.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-grow space-y-8">
//                 {/* Detailed Narrative */}
//                 <div className="group">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
//                     Candidate Assessment Narrative
//                   </label>
//                   <textarea
//                     rows="6"
//                     className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//                     placeholder="Highlight key strengths, weaknesses, and overall impression..."
//                     value={feedbackData.comments}
//                     onChange={(e) =>
//                       setFeedbackData({
//                         ...feedbackData,
//                         comments: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Decision Buttons */}
//                 <div className="space-y-4">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Decision Path
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       {
//                         id: "reject",
//                         label: "Reject",
//                         color: "hover:border-red-500 hover:text-red-600",
//                         active: "bg-red-50 border-red-500 text-red-600",
//                       },
//                       {
//                         id: "pass",
//                         label: "Pass",
//                         color: "hover:border-indigo-500 hover:text-indigo-600",
//                         active:
//                           "bg-indigo-50 border-indigo-500 text-indigo-600",
//                       },
//                       {
//                         id: "strong_pass",
//                         label: "Strong Pass",
//                         color:
//                           "hover:border-emerald-500 hover:text-emerald-600",
//                         active:
//                           "bg-emerald-50 border-emerald-500 text-emerald-600",
//                       },
//                     ].map((rec) => (
//                       <button
//                         key={rec.id}
//                         onClick={() =>
//                           setFeedbackData({
//                             ...feedbackData,
//                             recommendation: rec.id,
//                           })
//                         }
//                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                           feedbackData.recommendation === rec.id
//                             ? rec.active
//                             : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                         }`}
//                       >
//                         {rec.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFeedbackSubmit}
//                 className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 <Briefcase size={16} /> Finalize Session Audit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
//           {label}
//         </span>
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
//               ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
//               : "bg-slate-100 hover:bg-slate-200"
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
//****************************************************working code phase 1 5/02/26******************************************************** */
// import React, { useState, useEffect } from "react";
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
//   UserCheck,
//   Building2,
//   Smartphone,
//   ChevronDown,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Activity,
//   Fingerprint,
//   Calendar,
//   FileText,
//   Zap,
//   AlertCircle,
//   ArrowUpRight,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   ShieldAlert,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import { interviewService } from "../../services/interviewService";
// import toast from "react-hot-toast";

// const CandidateProfile = () => {
//   const { id } = useParams();

//   console.log("id", id);
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
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     technicalScore: 0,
//     culturalFit: 0,
//     softSkills: 0,
//     comments: "",
//     recommendation: "", // hire, strong_hire, no_hire
//   });

//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
//   const [activeInterview, setActiveInterview] = useState(null);

//   const [rescheduleForm, setRescheduleForm] = useState({
//     interview_date: "",
//     mode: "online",
//     meeting_link: "",
//     venue_details: "",
//     reason: "",
//   });

//   useEffect(() => {
//     if (id) fetchCandidate();
//   }, [id]);
//   const [formData, setFormData] = useState({});

// useEffect(() => {
//   if (candidate) {
//     setFormData({
//       full_name: candidate.full_name || "",
//       email: candidate.email || "",
//       phone: candidate.phone || "",
//       address: candidate.address || "",
//       status: candidate.status || "jd_pending",
//       position: candidate.position || "",
//       experience: candidate.experience || "",
//       education: candidate.education || "",
//       location: candidate.location || "",
//     });
//   }
// }, [candidate]);

//   const fetchCandidate = async () => {
//     try {
//       setLoading(true);

//       const data = await candidateService.getById(id);
//       setCandidate(data);

//       if (data.interviews) {
//         const normalized = data.interviews.map((i) => {
//           const dt = new Date(i.interview_date);

//           return {
//             ...i,
//             round: i.round_number,
//             date: dt.toLocaleDateString(),
//             time: dt.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             location: i.mode === "online" ? i.meeting_link : i.venue_details,
//             interviewerName: i.interviewer_name,
//             interviewerRole: "Interviewer",
//             status: i.status === "scheduled" ? "Scheduled" : i.status,
//           };
//         });

//         setInterviews(normalized);
//       } else {
//         setInterviews([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const [formData, setFormData] = useState({ ...candidate });

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

//   if (loading) {
//     return (
//       <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
//     );
//   }

//   if (error) {
//     return <div className="p-10 text-red-500 font-bold">{error}</div>;
//   }

//   if (!candidate) return null;

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

//   const handleFeedbackSubmit = async () => {
//     if (!selectedInterview) return;

//     try {
//       const payload = {
//         technical_skill: feedbackData.technicalScore,
//         communication: feedbackData.softSkills,
//         problem_solving: feedbackData.technicalScore, // adjust if you add separate score
//         cultural_fit: feedbackData.culturalFit,
//         relevant_experience: feedbackData.technicalScore, // optional mapping
//         remarks: feedbackData.comments,
//         decision: feedbackData.recommendation,
//       };

//       await toast.promise(
//         interviewService.submitReview(selectedInterview.id, payload),
//         {
//           loading: "Submitting review...",
//           success: "Review submitted successfully 🎉",
//           error: "Failed to submit review",
//         },
//       );

//       // ✅ Close modal
//       setIsFeedbackModalOpen(false);

//       // ✅ Reset form
//       setFeedbackData({
//         technicalScore: 0,
//         culturalFit: 0,
//         softSkills: 0,
//         comments: "",
//         recommendation: "",
//       });

//       // ⭐ VERY IMPORTANT → Refresh candidate
//       fetchCandidate();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // const handleSave = () => {
//   //   setCandidate(formData);
//   //   setIsEditModalOpen(false);
//   // };

//   const updateAttendance = async (interviewId, status) => {
//     try {
//       await toast.promise(
//         interviewService.updateAttendance(interviewId, {
//           attendance_status: status,
//         }),
//         {
//           loading: "Updating attendance...",
//           success: "Attendance updated successfully",
//           error: "Failed to update attendance",
//         },
//       );

//       setIsAttendanceOpen(false);
//       fetchCandidate(); // 🔁 refresh UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!activeInterview) return;

//     try {
//       await toast.promise(
//         interviewService.rescheduleInterview(
//           activeInterview.id,
//           rescheduleForm,
//         ),
//         {
//           loading: "Rescheduling interview...",
//           success: "Interview rescheduled",
//           error: "Failed to reschedule interview",
//         },
//       );

//       setIsRescheduleOpen(false);
//       fetchCandidate(); // 🔁 refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//   try {
//     await toast.promise(
//       fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           full_name: formData.full_name,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           status: formData.status,
//           position: formData.position,
//           experience: formData.experience,
//           education: formData.education,
//           location: formData.location,
//         }),
//       }),
//       {
//         loading: "Updating candidate...",
//         success: "Candidate updated successfully ✅",
//         error: "Failed to update candidate ❌",
//       }
//     );

//     setIsEditModalOpen(false);
//     fetchCandidate(); // 🔁 refresh profile
//   } catch (err) {
//     console.error(err);
//   }
// };

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

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
//                 {candidate?.name?.charAt(0) || "?"}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.full_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location}
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
//             {/* <TabButton
//               active={activeTab === "interview"}
//               onClick={() => setActiveTab("interview")}
//               icon={<Calendar size={18} />}
//               label="Schedule Interview"
//             /> */}
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
//             {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

//             {/* --- ACTION TRIGGER BANNER --- */}
//             {/* <div className="mt-10 animate-in fade-in zoom-in-95 duration-500 mx-3">
//               <div className="bg-slate-900 rounded-[24px] p-1.5 shadow-2xl shadow-indigo-200/20">
//                 <div className="flex items-center justify-between pl-6 pr-1.5 py-2">

//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
//                       <Mail size={18} className="text-indigo-400" />
//                     </div>
//                     <div className="flex flex-col">
//                       <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
//                         Manual Protocol Override
//                       </h4>
//                       <p className="text-[10px] text-slate-400 font-medium">
//                         Need to adjust the workflow? You can manually trigger
//                         invitations or{" "}
//                         <span className="text-indigo-400 font-bold">
//                           finalize the dossier
//                         </span>{" "}
//                         here.
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => setIsDecisionModalOpen(true)}
//                     className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-indigo-50 text-slate-900 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group"
//                   >
//                     Executive Action
//                     <ChevronRight
//                       size={14}
//                       className="group-hover:translate-x-1 transition-transform"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div> */}

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

//                               <div className="flex flex-col items-end gap-2">
//                                 <div
//                                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                                     i.status === "Completed"
//                                       ? "bg-indigo-50 text-indigo-600 border-indigo-100"
//                                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   }`}
//                                 >
//                                   {i.status}
//                                 </div>

//                                 {i.attendance_status === "pending" ? (
//                                   <div className="flex flex-col items-end gap-2">
//                                     <button

//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsRescheduleOpen(true);
//                                       }}
//                                       className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
//                                     >
//                                       Reschedule
//                                     </button>

//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsAttendanceOpen(true);
//                                       }}
//                                       className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
//                                     >
//                                       Interview Status
//                                     </button>
//                                   </div>
//                                 ) : i.attendance_status === "no_show" ? (
//   /* 🔴 NO SHOW – NEW CONDITION */
//   <button
//     onClick={() => {
//       setActiveInterview(i);
//       setIsRescheduleOpen(true);
//     }}
//     className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
//   >
//     Schedule Again
//   </button>

// )

//                                 : (

//                                   <>
//                                     {i.status === "completed" && i.review ? (
//                                       <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//                                         <Star size={12} fill="currentColor" />
//                                         SCORE: {i.review.total_score.toFixed(1)}
//                                       </div>
//                                     ) : (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedInterview(i);
//                                           setIsFeedbackModalOpen(true);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                                       >
//                                         Evaluate <ExternalLink size={12} />
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
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
//                     value={candidate.full_name}
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
//                     value={`${candidate.location}`}
//                     // value={`${candidate.location.city}, ${candidate.location.state}`}
//                   />
//                   {/* <InfoItem
//                     icon={<Globe size={14} />}
//                     label="Global Pincode"
//                     value={candidate.location.pincode}
//                   /> */}
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

//                   <div className="col-span-2 flex items-center justify-end p-4 ">
//                     <button
//                       onClick={() =>
//                         navigate(`/invitation/${id}/scheduleinterview`)
//                       }
//                       className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                     >
//                       <Edit3 size={16} /> Interview Schedule
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
//                   value={formData.full_name}
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
//                 <InputField
//   label="Phone Number"
//   name="phone"
//   value={formData.phone}
//   onChange={handleInputChange}
// />

// <InputField
//   label="Education"
//   name="education"
//   value={formData.education}
//   onChange={handleInputChange}
// />

// <InputField
//   label="Location"
//   name="location"
//   value={formData.location}
//   onChange={handleInputChange}
// />

// <div className="col-span-2">
//   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//     Address
//   </label>
//   <textarea
//     name="address"
//     value={formData.address}
//     onChange={handleInputChange}
//     rows="3"
//     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
//   />
// </div>

//                 <div className="col-span-2">
//   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
//     Candidate Status
//   </label>

//   <select
//     name="status"
//     value={formData.status}
//     onChange={handleInputChange}
//     className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
//   >
//     <option value="jd_pending">JD Pending</option>
//     <option value="jd_accepted">JD Accepted</option>
//     <option value="selected">Selected</option>
//   </select>
// </div>

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

//                   {/* Resume Viewer */}
//                   <div className="w-full h-full">
//                     {candidate.resume_path ? (
//                       isPdf(candidate.resume_path) ? (
//                         <iframe
//                           src={candidate.resume_path}
//                           title="Candidate Resume"
//                           className="w-full h-[1000px] rounded-xl border border-slate-200"
//                         />
//                       ) : (
//                         <img
//                           src={candidate.resume_path}
//                           alt="Candidate Resume"
//                           className="w-full rounded-xl border border-slate-200"
//                         />
//                       )
//                     ) : (
//                       <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
//                         No Resume Uploaded
//                       </div>
//                     )}
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
//                       value={`Verified ${candidate.education}`}
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

//       {isDecisionModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsDecisionModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
//             {/* Modal Header */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="space-y-1">
//                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <ShieldAlert size={16} className="text-indigo-600" /> Final
//                   Determination Panel
//                 </h2>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                   Authorized Personnel Only
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDecisionModalOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 pt-4">
//               <div className="space-y-6">
//                 {/* Remark Input */}
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                     Protocol Remarks
//                   </label>
//                   <textarea
//                     placeholder="Provide context for this decision..."
//                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
//                   />
//                 </div>

//                 {/* Action Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
//                     <ShieldCheck size={16} /> Approve
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Audit Footer */}
//             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                 Secure Terminal Session • Immutable Audit Log Enabled
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {isRescheduleOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* High-fidelity Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsRescheduleOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Timeline Modification */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//                   <Clock size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Timeline Adjustment
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Modifying Interview Schedule
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Core Scheduling Logic */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Target Timestamp
//                   </label>
//                   <div className="relative group">
//                     <Calendar
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <input
//                       type="datetime-local"
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                       value={rescheduleForm.interview_date}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           interview_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Interaction Mode
//                   </label>
//                   <div className="relative group">
//                     <Globe
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <select
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
//                       value={rescheduleForm.mode}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="online">Virtual / Online</option>
//                       <option value="physical">On-Site / Physical</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Context-Aware Location Field */}
//               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   {rescheduleForm.mode === "online"
//                     ? "Digital Access Link"
//                     : "Facility / Venue Details"}
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     {rescheduleForm.mode === "online" ? (
//                       <Zap size={14} />
//                     ) : (
//                       <MapPin size={14} />
//                     )}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder={
//                       rescheduleForm.mode === "online"
//                         ? "https://meet.google.com/..."
//                         : "Boardroom 4C, Level 2"
//                     }
//                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                     value={
//                       rescheduleForm.mode === "online"
//                         ? rescheduleForm.meeting_link
//                         : rescheduleForm.venue_details
//                     }
//                     onChange={(e) =>
//                       setRescheduleForm({
//                         ...rescheduleForm,
//                         [rescheduleForm.mode === "online"
//                           ? "meeting_link"
//                           : "venue_details"]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Audit Log / Reason */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Justification for Reschedule
//                 </label>
//                 <textarea
//                   placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
//                   className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
//                   value={rescheduleForm.reason}
//                   onChange={(e) =>
//                     setRescheduleForm({
//                       ...rescheduleForm,
//                       reason: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Warning Policy Card */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <AlertCircle size={16} className="text-amber-500 shrink-0" />
//                 <p className="text-[10px] font-medium text-amber-800 leading-tight">
//                   <strong>Policy Notice:</strong> Rescheduling will
//                   automatically trigger an email notification to the candidate
//                   and update the internal calendar registry.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Execution Bar */}
//             <div className="p-6 bg-slate-900 flex items-center justify-between">
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRescheduleSubmit}
//                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
//               >
//                 Confirm Adjustment
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAttendanceOpen && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
//             onClick={() => setIsAttendanceOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Disposition Logic */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                   <UserCheck size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Attendance Registry
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Post-Interview Disposition
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Candidate Meta Info */}
//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                 <div className="flex flex-col">
//                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Active Interviewee
//                   </span>
//                   <span className="text-sm font-bold text-slate-800">
//                     {activeInterview?.candidate_name || "Unidentified Asset"}
//                   </span>
//                 </div>
//                 <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
//                   ID:{" "}
//                   {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
//                     "N/A"}
//                 </div>
//               </div>

//               {/* Status Selection: High-Contrast Interaction */}
//               <div className="space-y-3">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Update Final Status
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
//                     <Activity size={16} />
//                   </div>
//                   <select
//                     className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
//                     onChange={(e) =>
//                       updateAttendance(activeInterview.id, e.target.value)
//                     }
//                   >
//                     <option value="">Select Protocol</option>
//                     <option value="attended" className="text-emerald-600">
//                       ✓ Mark as Attended
//                     </option>
//                     <option value="no_show" className="text-rose-600">
//                       ✗ Report No-Show
//                     </option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </div>

//               {/* System Notice */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <ShieldAlert
//                   size={16}
//                   className="text-amber-500 shrink-0 mt-0.5"
//                 />
//                 <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
//                   <strong>Audit Note:</strong> Changing this status will update
//                   the candidate's lifecycle history and notify the assigned
//                   hiring manager. This action is logged under your session.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Close Execution */}
//             <div className="p-6 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
//               >
//                 Confirm & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isFeedbackModalOpen && (
//         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsFeedbackModalOpen(false)}
//           />

//           <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Left: Scoreboard Sidebar (35%) */}
//             <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//                   <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                     Pending Review
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-black text-slate-900 leading-tight">
//                   Scorecard <br />
//                   Analysis
//                 </h2>
//               </div>

//               <div className="space-y-8 flex-grow">
//                 <RatingRow
//                   label="Technical Logic"
//                   icon={Cpu}
//                   value={feedbackData.technicalScore}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, technicalScore: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Cultural Synergy"
//                   icon={Users}
//                   value={feedbackData.culturalFit}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, culturalFit: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Articulate/Comms"
//                   icon={MessageSquare}
//                   value={feedbackData.softSkills}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, softSkills: val })
//                   }
//                 />
//               </div>

//               <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
//                   Aggregate Intelligence
//                 </p>
//                 <div className="text-3xl font-black italic">
//                   {(
//                     (feedbackData.technicalScore +
//                       feedbackData.culturalFit +
//                       feedbackData.softSkills) /
//                     3
//                   ).toFixed(1)}
//                   <span className="text-lg opacity-50 not-italic ml-1">
//                     /10
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Narrative & Conclusion (62%) */}
//             <div className="flex-grow p-8 lg:p-10 flex flex-col">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                     Final Verdict
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Please provide your executive recommendation below.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-grow space-y-8">
//                 {/* Detailed Narrative */}
//                 <div className="group">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
//                     Candidate Assessment Narrative
//                   </label>
//                   <textarea
//                     rows="6"
//                     className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//                     placeholder="Highlight key strengths, weaknesses, and overall impression..."
//                     value={feedbackData.comments}
//                     onChange={(e) =>
//                       setFeedbackData({
//                         ...feedbackData,
//                         comments: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Decision Buttons */}
//                 <div className="space-y-4">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Decision Path
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       {
//                         id: "reject",
//                         label: "Reject",
//                         color: "hover:border-red-500 hover:text-red-600",
//                         active: "bg-red-50 border-red-500 text-red-600",
//                       },
//                       {
//                         id: "pass",
//                         label: "Pass",
//                         color: "hover:border-indigo-500 hover:text-indigo-600",
//                         active:
//                           "bg-indigo-50 border-indigo-500 text-indigo-600",
//                       },
//                       {
//                         id: "strong_pass",
//                         label: "Strong Pass",
//                         color:
//                           "hover:border-emerald-500 hover:text-emerald-600",
//                         active:
//                           "bg-emerald-50 border-emerald-500 text-emerald-600",
//                       },
//                     ].map((rec) => (
//                       <button
//                         key={rec.id}
//                         onClick={() =>
//                           setFeedbackData({
//                             ...feedbackData,
//                             recommendation: rec.id,
//                           })
//                         }
//                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                           feedbackData.recommendation === rec.id
//                             ? rec.active
//                             : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                         }`}
//                       >
//                         {rec.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFeedbackSubmit}
//                 className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 <Briefcase size={16} /> Finalize Session Audit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
//           {label}
//         </span>
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
//               ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
//               : "bg-slate-100 hover:bg-slate-200"
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
//******************************************working code phase 22 3/02/26*********************************************************** */
// import React, { useState, useEffect } from "react";
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
//   UserCheck,
//   Building2,
//   Smartphone,
//   ChevronDown,
//   Globe,
//   ChevronRight,
//   ShieldCheck,
//   Activity,
//   Fingerprint,
//   Calendar,
//   FileText,
//   Zap,
//   AlertCircle,
//   ArrowUpRight,
//   Download,
//   Clock,
//   Award,
//   ArrowRight,
//   ShieldAlert,
//   Cpu,
//   Star,
//   Users,
//   MessageSquare,
//   Hash,
//   Link as LinkIcon,
//   ExternalLink,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import { interviewService } from "../../services/interviewService";
// import toast from "react-hot-toast";

// const CandidateProfile = () => {
//   const { id } = useParams();

//   console.log("id", id);
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
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [feedbackData, setFeedbackData] = useState({
//     technicalScore: 0,
//     culturalFit: 0,
//     softSkills: 0,
//     comments: "",
//     recommendation: "", // hire, strong_hire, no_hire
//   });

//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
//   const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
//   const [activeInterview, setActiveInterview] = useState(null);

//   const [rescheduleForm, setRescheduleForm] = useState({
//     interview_date: "",
//     mode: "online",
//     meeting_link: "",
//     venue_details: "",
//     reason: "",
//   });

//   useEffect(() => {
//     if (id) fetchCandidate();
//   }, [id]);

//   //  const fetchCandidate = async () => {
//   //     try {
//   //       setLoading(true);

//   //       const data = await candidateService.getById(id);

//   //       setCandidate(data);

//   //       // ⭐ If backend returns interviews inside candidate
//   //       if (data.interviews) {
//   //         setInterviews(data.interviews);
//   //       }

//   //     } catch (err) {
//   //       console.error(err);
//   //       setError(err.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   const fetchCandidate = async () => {
//     try {
//       setLoading(true);

//       const data = await candidateService.getById(id);
//       setCandidate(data);

//       if (data.interviews) {
//         const normalized = data.interviews.map((i) => {
//           const dt = new Date(i.interview_date);

//           return {
//             ...i,
//             round: i.round_number,
//             date: dt.toLocaleDateString(),
//             time: dt.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             location: i.mode === "online" ? i.meeting_link : i.venue_details,
//             interviewerName: i.interviewer_name,
//             interviewerRole: "Interviewer",
//             status: i.status === "scheduled" ? "Scheduled" : i.status,
//           };
//         });

//         setInterviews(normalized);
//       } else {
//         setInterviews([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   if (loading) {
//     return (
//       <div className="p-10 text-lg font-bold">Loading candidate profile...</div>
//     );
//   }

//   if (error) {
//     return <div className="p-10 text-red-500 font-bold">{error}</div>;
//   }

//   if (!candidate) return null;

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

//   const handleFeedbackSubmit = async () => {
//     if (!selectedInterview) return;

//     try {
//       const payload = {
//         technical_skill: feedbackData.technicalScore,
//         communication: feedbackData.softSkills,
//         problem_solving: feedbackData.technicalScore, // adjust if you add separate score
//         cultural_fit: feedbackData.culturalFit,
//         relevant_experience: feedbackData.technicalScore, // optional mapping
//         remarks: feedbackData.comments,
//         decision: feedbackData.recommendation,
//       };

//       await toast.promise(
//         interviewService.submitReview(selectedInterview.id, payload),
//         {
//           loading: "Submitting review...",
//           success: "Review submitted successfully 🎉",
//           error: "Failed to submit review",
//         },
//       );

//       // ✅ Close modal
//       setIsFeedbackModalOpen(false);

//       // ✅ Reset form
//       setFeedbackData({
//         technicalScore: 0,
//         culturalFit: 0,
//         softSkills: 0,
//         comments: "",
//         recommendation: "",
//       });

//       // ⭐ VERY IMPORTANT → Refresh candidate
//       fetchCandidate();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = () => {
//     setCandidate(formData);
//     setIsEditModalOpen(false);
//   };

//   //   const handleRescheduleSubmit = async () => {
//   //   try {
//   //     await interviewService.rescheduleInterview(
//   //       selectedInterview.id,
//   //       rescheduleForm
//   //     );

//   //     setIsRescheduleOpen(false);
//   //     // optional: refetch interviews or update local state
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

//   const updateAttendance = async (interviewId, status) => {
//     try {
//       await toast.promise(
//         interviewService.updateAttendance(interviewId, {
//           attendance_status: status,
//         }),
//         {
//           loading: "Updating attendance...",
//           success: "Attendance updated successfully",
//           error: "Failed to update attendance",
//         },
//       );

//       setIsAttendanceOpen(false);
//       fetchCandidate(); // 🔁 refresh UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!activeInterview) return;

//     try {
//       await toast.promise(
//         interviewService.rescheduleInterview(
//           activeInterview.id,
//           rescheduleForm,
//         ),
//         {
//           loading: "Rescheduling interview...",
//           success: "Interview rescheduled",
//           error: "Failed to reschedule interview",
//         },
//       );

//       setIsRescheduleOpen(false);
//       fetchCandidate(); // 🔁 refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

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
//                 {candidate?.name?.charAt(0) || "?"}
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
//                 <Fingerprint size={16} className="text-indigo-600" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                 {candidate.full_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4">
//                 <HeroMeta icon={<Mail size={14} />} text={candidate.email} />
//                 <HeroMeta
//                   icon={<MapPin size={14} />}
//                   text={candidate.location}
//                 />
//                 <HeroMeta
//                   icon={<Calendar size={14} />}
//                   text="Member since 2026"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* <button
//             onClick={() => setIsEditModalOpen(true)}
//             className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//           >
//             <Edit3 size={16} /> Edit Attributes
//           </button> */}
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
//             {/* <TabButton
//               active={activeTab === "interview"}
//               onClick={() => setActiveTab("interview")}
//               icon={<Calendar size={18} />}
//               label="Schedule Interview"
//             /> */}
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
//             {/* --- EXECUTIVE DECISION CONSOLE (Outside Tabs) --- */}

//             {/* --- ACTION TRIGGER BANNER --- */}
//             <div className="mt-10 animate-in fade-in zoom-in-95 duration-500 mx-3">
//               <div className="bg-slate-900 rounded-[24px] p-1.5 shadow-2xl shadow-indigo-200/20">
//                 <div className="flex items-center justify-between pl-6 pr-1.5 py-2">
//                   {/* Left side: Strategic Message */}
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
//                       <Mail size={18} className="text-indigo-400" />
//                     </div>
//                     <div className="flex flex-col">
//                       <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
//                         Manual Protocol Override
//                       </h4>
//                       <p className="text-[10px] text-slate-400 font-medium">
//                         Need to adjust the workflow? You can manually trigger
//                         invitations or{" "}
//                         <span className="text-indigo-400 font-bold">
//                           finalize the dossier
//                         </span>{" "}
//                         here.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right side: The Trigger */}
//                   <button
//                     onClick={() => setIsDecisionModalOpen(true)}
//                     className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-indigo-50 text-slate-900 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group"
//                   >
//                     Executive Action
//                     <ChevronRight
//                       size={14}
//                       className="group-hover:translate-x-1 transition-transform"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

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

//                               <div className="flex flex-col items-end gap-2">
//                                 <div
//                                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                                     i.status === "Completed"
//                                       ? "bg-indigo-50 text-indigo-600 border-indigo-100"
//                                       : "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   }`}
//                                 >
//                                   {i.status}
//                                 </div>

//                                 {i.attendance_status === "pending" ? (
//                                   <div className="flex flex-col items-end gap-2">
//                                     <button

//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsRescheduleOpen(true);
//                                       }}
//                                       className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100"
//                                     >
//                                       Reschedule
//                                     </button>

//                                     <button
//                                       onClick={() => {
//                                         setActiveInterview(i);
//                                         setIsAttendanceOpen(true);
//                                       }}
//                                       className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
//                                     >
//                                       Interview Status
//                                     </button>
//                                   </div>
//                                 ) : i.attendance_status === "no_show" ? (
//   /* 🔴 NO SHOW – NEW CONDITION */
//   <button
//     onClick={() => {
//       setActiveInterview(i);
//       setIsRescheduleOpen(true);
//     }}
//     className="px-5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
//   >
//     Schedule Again
//   </button>

// )

//                                 : (

//                                   <>
//                                     {i.status === "completed" && i.review ? (
//                                       <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
//                                         <Star size={12} fill="currentColor" />
//                                         SCORE: {i.review.total_score.toFixed(1)}
//                                       </div>
//                                     ) : (
//                                       <button
//                                         onClick={() => {
//                                           setSelectedInterview(i);
//                                           setIsFeedbackModalOpen(true);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
//                                       >
//                                         Evaluate <ExternalLink size={12} />
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
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
//                     value={candidate.full_name}
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
//                     value={`${candidate.location}`}
//                     // value={`${candidate.location.city}, ${candidate.location.state}`}
//                   />
//                   {/* <InfoItem
//                     icon={<Globe size={14} />}
//                     label="Global Pincode"
//                     value={candidate.location.pincode}
//                   /> */}
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

//                   <div className="col-span-2 flex items-center justify-end p-4 ">
//                     <button
//                       onClick={() =>
//                         navigate(`/invitation/${id}/scheduleinterview`)
//                       }
//                       className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
//                     >
//                       <Edit3 size={16} /> Interview Schedule
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
//                   value={formData.full_name}
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

//                   {/* Resume Viewer */}
//                   <div className="w-full h-full">
//                     {candidate.resume_path ? (
//                       isPdf(candidate.resume_path) ? (
//                         <iframe
//                           src={candidate.resume_path}
//                           title="Candidate Resume"
//                           className="w-full h-[1000px] rounded-xl border border-slate-200"
//                         />
//                       ) : (
//                         <img
//                           src={candidate.resume_path}
//                           alt="Candidate Resume"
//                           className="w-full rounded-xl border border-slate-200"
//                         />
//                       )
//                     ) : (
//                       <div className="flex items-center justify-center h-[600px] text-slate-400 text-sm font-bold uppercase tracking-widest">
//                         No Resume Uploaded
//                       </div>
//                     )}
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
//                       value={`Verified ${candidate.education}`}
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

//       {isDecisionModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsDecisionModalOpen(false)}
//           />

//           {/* Modal Content */}
//           <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
//             {/* Modal Header */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="space-y-1">
//                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <ShieldAlert size={16} className="text-indigo-600" /> Final
//                   Determination Panel
//                 </h2>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                   Authorized Personnel Only
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDecisionModalOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 pt-4">
//               <div className="space-y-6">
//                 {/* Remark Input */}
//                 <div className="space-y-3">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                     Protocol Remarks
//                   </label>
//                   <textarea
//                     placeholder="Provide context for this decision..."
//                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 placeholder:text-slate-300 shadow-inner"
//                   />
//                 </div>

//                 {/* Action Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-amber-400" /> Hold
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all active:scale-95 bg-white">
//                     <div className="h-2 w-2 rounded-full bg-red-500" /> Reject
//                   </button>

//                   <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
//                     <ShieldCheck size={16} /> Approve
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Audit Footer */}
//             <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                 Secure Terminal Session • Immutable Audit Log Enabled
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {isRescheduleOpen && (
//   <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-black/50"
//       onClick={() => setIsRescheduleOpen(false)}
//     />

//     <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 space-y-4">
//       <h3 className="text-lg font-black text-gray-900">
//         Reschedule Interview
//       </h3>

//       <input
//         type="datetime-local"
//         className="w-full border rounded-xl px-4 py-2"
//         value={rescheduleForm.interview_date}
//         onChange={(e) =>
//           setRescheduleForm({ ...rescheduleForm, interview_date: e.target.value })
//         }
//       />

//       <select
//         className="w-full border rounded-xl px-4 py-2"
//         value={rescheduleForm.mode}
//         onChange={(e) =>
//           setRescheduleForm({ ...rescheduleForm, mode: e.target.value })
//         }
//       >
//         <option value="online">Online</option>
//         <option value="physical">Physical</option>
//       </select>

//       {rescheduleForm.mode === "online" ? (
//         <input
//           type="text"
//           placeholder="Meeting Link"
//           className="w-full border rounded-xl px-4 py-2"
//           value={rescheduleForm.meeting_link}
//           onChange={(e) =>
//             setRescheduleForm({ ...rescheduleForm, meeting_link: e.target.value })
//           }
//         />
//       ) : (
//         <input
//           type="text"
//           placeholder="Venue Details"
//           className="w-full border rounded-xl px-4 py-2"
//           value={rescheduleForm.venue_details}
//           onChange={(e) =>
//             setRescheduleForm({ ...rescheduleForm, venue_details: e.target.value })
//           }
//         />
//       )}

//       <textarea
//         placeholder="Reason for reschedule"
//         className="w-full border rounded-xl px-4 py-2"
//         value={rescheduleForm.reason}
//         onChange={(e) =>
//           setRescheduleForm({ ...rescheduleForm, reason: e.target.value })
//         }
//       />

//       <div className="flex justify-end gap-3 pt-2">
//         <button
//           onClick={() => setIsRescheduleOpen(false)}
//           className="px-4 py-2 rounded-xl border text-sm font-bold"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleRescheduleSubmit}
//           className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-black"
//         >
//           Reschedule
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

//       {isRescheduleOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* High-fidelity Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsRescheduleOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Timeline Modification */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//                   <Clock size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Timeline Adjustment
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Modifying Interview Schedule
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Core Scheduling Logic */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Target Timestamp
//                   </label>
//                   <div className="relative group">
//                     <Calendar
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <input
//                       type="datetime-local"
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                       value={rescheduleForm.interview_date}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           interview_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 col-span-2 sm:col-span-1">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Interaction Mode
//                   </label>
//                   <div className="relative group">
//                     <Globe
//                       size={14}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                     />
//                     <select
//                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none"
//                       value={rescheduleForm.mode}
//                       onChange={(e) =>
//                         setRescheduleForm({
//                           ...rescheduleForm,
//                           mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="online">Virtual / Online</option>
//                       <option value="physical">On-Site / Physical</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Context-Aware Location Field */}
//               <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   {rescheduleForm.mode === "online"
//                     ? "Digital Access Link"
//                     : "Facility / Venue Details"}
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     {rescheduleForm.mode === "online" ? (
//                       <Zap size={14} />
//                     ) : (
//                       <MapPin size={14} />
//                     )}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder={
//                       rescheduleForm.mode === "online"
//                         ? "https://meet.google.com/..."
//                         : "Boardroom 4C, Level 2"
//                     }
//                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
//                     value={
//                       rescheduleForm.mode === "online"
//                         ? rescheduleForm.meeting_link
//                         : rescheduleForm.venue_details
//                     }
//                     onChange={(e) =>
//                       setRescheduleForm({
//                         ...rescheduleForm,
//                         [rescheduleForm.mode === "online"
//                           ? "meeting_link"
//                           : "venue_details"]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Audit Log / Reason */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Justification for Reschedule
//                 </label>
//                 <textarea
//                   placeholder="Document the internal logic for this change (e.g., Interviewer conflict)..."
//                   className="w-full h-24 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
//                   value={rescheduleForm.reason}
//                   onChange={(e) =>
//                     setRescheduleForm({
//                       ...rescheduleForm,
//                       reason: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Warning Policy Card */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <AlertCircle size={16} className="text-amber-500 shrink-0" />
//                 <p className="text-[10px] font-medium text-amber-800 leading-tight">
//                   <strong>Policy Notice:</strong> Rescheduling will
//                   automatically trigger an email notification to the candidate
//                   and update the internal calendar registry.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Execution Bar */}
//             <div className="p-6 bg-slate-900 flex items-center justify-between">
//               <button
//                 onClick={() => setIsRescheduleOpen(false)}
//                 className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRescheduleSubmit}
//                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group"
//               >
//                 Confirm Adjustment
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {isAttendanceOpen && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4">

//       <h3 className="text-lg font-bold">Interview Status</h3>

//       <select
//         className="w-full border rounded-lg p-2"
//         onChange={e => updateAttendance(activeInterview.id, e.target.value)}
//       >
//         <option value="">Select Status</option>
//         <option value="attended">Attended</option>
//         <option value="no_show">No_Show</option>
//       </select>

//       <button
//         onClick={() => setIsAttendanceOpen(false)}
//         className="w-full bg-gray-900 text-white py-2 rounded-lg"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )} */}

//       {isAttendanceOpen && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
//             onClick={() => setIsAttendanceOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Disposition Logic */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                   <UserCheck size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Attendance Registry
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Post-Interview Disposition
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Candidate Meta Info */}
//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                 <div className="flex flex-col">
//                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Active Interviewee
//                   </span>
//                   <span className="text-sm font-bold text-slate-800">
//                     {activeInterview?.candidate_name || "Unidentified Asset"}
//                   </span>
//                 </div>
//                 <div className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-[9px] font-black text-slate-500">
//                   ID:{" "}
//                   {activeInterview?.id?.toString().slice(-6).toUpperCase() ||
//                     "N/A"}
//                 </div>
//               </div>

//               {/* Status Selection: High-Contrast Interaction */}
//               <div className="space-y-3">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Update Final Status
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
//                     <Activity size={16} />
//                   </div>
//                   <select
//                     className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer hover:bg-slate-50"
//                     onChange={(e) =>
//                       updateAttendance(activeInterview.id, e.target.value)
//                     }
//                   >
//                     <option value="">Select Protocol</option>
//                     <option value="attended" className="text-emerald-600">
//                       ✓ Mark as Attended
//                     </option>
//                     <option value="no_show" className="text-rose-600">
//                       ✗ Report No-Show
//                     </option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </div>

//               {/* System Notice */}
//               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
//                 <ShieldAlert
//                   size={16}
//                   className="text-amber-500 shrink-0 mt-0.5"
//                 />
//                 <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
//                   <strong>Audit Note:</strong> Changing this status will update
//                   the candidate's lifecycle history and notify the assigned
//                   hiring manager. This action is logged under your session.
//                 </p>
//               </div>
//             </div>

//             {/* Footer: Close Execution */}
//             <div className="p-6 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsAttendanceOpen(false)}
//                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
//               >
//                 Confirm & Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isFeedbackModalOpen && (
//         <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsFeedbackModalOpen(false)}
//           />

//           <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
//             {/* Left: Scoreboard Sidebar (35%) */}
//             <div className="lg:w-[38%] bg-slate-50 p-8 lg:p-10 border-r border-slate-100 flex flex-col">
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
//                   <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                     Pending Review
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-black text-slate-900 leading-tight">
//                   Scorecard <br />
//                   Analysis
//                 </h2>
//               </div>

//               <div className="space-y-8 flex-grow">
//                 <RatingRow
//                   label="Technical Logic"
//                   icon={Cpu}
//                   value={feedbackData.technicalScore}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, technicalScore: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Cultural Synergy"
//                   icon={Users}
//                   value={feedbackData.culturalFit}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, culturalFit: val })
//                   }
//                 />
//                 <RatingRow
//                   label="Articulate/Comms"
//                   icon={MessageSquare}
//                   value={feedbackData.softSkills}
//                   onChange={(val) =>
//                     setFeedbackData({ ...feedbackData, softSkills: val })
//                   }
//                 />
//               </div>

//               <div className="mt-10 p-5 bg-indigo-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
//                   Aggregate Intelligence
//                 </p>
//                 <div className="text-3xl font-black italic">
//                   {(
//                     (feedbackData.technicalScore +
//                       feedbackData.culturalFit +
//                       feedbackData.softSkills) /
//                     3
//                   ).toFixed(1)}
//                   <span className="text-lg opacity-50 not-italic ml-1">
//                     /10
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Narrative & Conclusion (62%) */}
//             <div className="flex-grow p-8 lg:p-10 flex flex-col">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                     Final Verdict
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Please provide your executive recommendation below.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-grow space-y-8">
//                 {/* Detailed Narrative */}
//                 <div className="group">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">
//                     Candidate Assessment Narrative
//                   </label>
//                   <textarea
//                     rows="6"
//                     className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
//                     placeholder="Highlight key strengths, weaknesses, and overall impression..."
//                     value={feedbackData.comments}
//                     onChange={(e) =>
//                       setFeedbackData({
//                         ...feedbackData,
//                         comments: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Decision Buttons */}
//                 <div className="space-y-4">
//                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Decision Path
//                   </label>
//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       {
//                         id: "reject",
//                         label: "Reject",
//                         color: "hover:border-red-500 hover:text-red-600",
//                         active: "bg-red-50 border-red-500 text-red-600",
//                       },
//                       {
//                         id: "pass",
//                         label: "Pass",
//                         color: "hover:border-indigo-500 hover:text-indigo-600",
//                         active:
//                           "bg-indigo-50 border-indigo-500 text-indigo-600",
//                       },
//                       {
//                         id: "strong_pass",
//                         label: "Strong Pass",
//                         color:
//                           "hover:border-emerald-500 hover:text-emerald-600",
//                         active:
//                           "bg-emerald-50 border-emerald-500 text-emerald-600",
//                       },
//                     ].map((rec) => (
//                       <button
//                         key={rec.id}
//                         onClick={() =>
//                           setFeedbackData({
//                             ...feedbackData,
//                             recommendation: rec.id,
//                           })
//                         }
//                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
//                           feedbackData.recommendation === rec.id
//                             ? rec.active
//                             : `bg-white border-slate-100 text-slate-400 ${rec.color}`
//                         }`}
//                       >
//                         {rec.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFeedbackSubmit}
//                 className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 <Briefcase size={16} /> Finalize Session Audit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
//         <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
//           {label}
//         </span>
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
//               ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
//               : "bg-slate-100 hover:bg-slate-200"
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
