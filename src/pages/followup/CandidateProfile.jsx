import React, { useState, useEffect , useMemo } from "react";
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
  Check,
  ArrowLeft,
  UserCheck,
  Search,
  Info,
  CheckCircle2,
  Building2,
  UserPlus,
  History,
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
    recommendation: "pass", // hire, strong_hire, no_hire
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
  const [historyVacancy, setHistoryVacancy] = useState(null); // Tracks the vacancy being reviewed

  const [nextRoundForm, setNextRoundForm] = useState({
    date: "",
    time: "",
    mode: "online",
    location: "",
    interviewerName: "",
    interviewerEmail: "",
    interviewerRole: "",
    vacancy_id: null,
  });
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  // --- EMPLOYEE SEARCH REGISTRY ---
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [isFetchingEmployees, setIsFetchingEmployees] = useState(false);

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

  // 🎯 CHANGE: Use functional update 'prev =>' to keep the vacancy_id
  setNextRoundForm(prev => ({
    ...prev, // This preserves vacancy_id
    date,
    time,
    mode: last?.mode || "online",
    location: last?.meeting_link || last?.venue_details || "",
    interviewerName: last?.interviewer_name || "",
    interviewerEmail: last?.interviewer_email || "",
    interviewerRole: last?.interviewer_designation || "",
  }));
}, [isNextRoundModalOpen, interviews]); // Added interviews as dependency

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
            // date: dt.toLocaleDateString(),
            date: dt.toLocaleDateString("en-GB").replace(/\//g, "-"),
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


  const handleCreateNextRound = async () => {
    try {
      const payload = {
        candidate_id: Number(candidate.id),

        mode: nextRoundForm.mode,
vacancy_id: nextRoundForm.vacancy_id,
        interview_date: new Date(
          `${nextRoundForm.date}T${nextRoundForm.time}`,
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
            },
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
        },
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
        <div className="relative w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-blue-600">
          <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
        </div>
      </div>

      {/* Technical Status Text */}
      <div className="space-y-3 text-center">
        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
          Candidate Personal Data Fetch
        </h3>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Candidate personal data Loading...
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
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Encrypted Handshake
          </span>
        </div>
        <div className="w-1 h-1 bg-slate-200 rounded-full" />
        <div className="text-[9px] font-black uppercase tracking-tighter">
          ISO 27001 Verified
        </div>
      </div>
    </div>
  );


  const interviewsByVacancy = useMemo(() => {
  if (!candidate?.interviews) return {};
  return candidate.interviews.reduce((acc, interview) => {
    const vId = interview.vacancy?.id;
    if (!acc[vId]) acc[vId] = [];
    acc[vId].push(interview);
    return acc;
  }, {});
}, [candidate]);


// 🏢 Fetch confirmed employees from registry
  const fetchConfirmedEmployees = async () => {
    try {
      setIsFetchingEmployees(true);
      const res = await fetch("https://apihrr.goelectronix.co.in/employees?status=confirmed");
      const data = await res.json();
      setEmployeeList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Employee Registry Error:", err);
      setEmployeeList([]);
    } finally {
      setIsFetchingEmployees(false);
    }
  };

  // 🏢 Fetch company address for In-Person mode
  const fetchCompanyAddress = async () => {
    try {
      const res = await fetch("https://apihrr.goelectronix.co.in/companies");
      const data = await res.json();
      if (data && data.length > 0) {
        setNextRoundForm(prev => ({ ...prev, location: data[0].address }));
        toast.success("Office HQ address synced 🏢");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 Safe filtered list for the dropdown
  const filteredEmployees = useMemo(() => {
    if (!employeeList) return [];
    const searchLower = (employeeSearch || "").toLowerCase();
    return employeeList.filter(emp => {
      const name = (emp?.full_name || "").toLowerCase();
      const email = (emp?.email || "").toLowerCase();
      return name.includes(searchLower) || email.includes(searchLower);
    });
  }, [employeeSearch, employeeList]);

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
      // 🎯 Use toast.promise for high-fidelity user feedback during transmission
      await toast.promise(
        (async () => {
          // 🎯 1. Initialize FormData Protocol (Required for multipart/form-data)
          const dataPayload = new FormData();

          // 🎯 2. Map state object to FormData keys
          // This dynamically appends all fields from your formData state
          Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined) {
              dataPayload.append(key, formData[key]);
            }
          });

          const res = await fetch(
            `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
            {
              method: "PATCH",
              // ⚠️ SECURITY/TECH NOTE: Do NOT set 'Content-Type' header.
              // The browser automatically injects 'multipart/form-data' with the correct boundary.
              body: dataPayload,
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.message || "Registry synchronization failed");
          }

          return data;
        })(),
        {
          loading: "Synchronizing Identity Node...",
          success: "Candidate record updated successfully ✅",
          error: (err) => `Update failed: ${err.message} ❌`,
        },
      );

      // 🔒 Post-Success Protocol
      setIsEditModalOpen(false);
      fetchCandidate(); // 🔁 Re-fetch to sync the UI with backend-generated metadata


      navigate('/invitation');
    } catch (err) {
      console.error("Critical Registry Update Failure:", err);
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
          (a, b) => b.round_number - a.round_number,
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
            className="p-2 hover:!bg-gray-100 rounded-lg transition-all !bg-transparent active:scale-95 !text-gray-500 group"
          >
            <ArrowLeft size={18} className="group-hover:text-gray-900" />
          </button>
          <div className="h-5 w-px bg-gray-200" />

          <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
  {/* 🎯 Updated to anchor tag for Next Tab behavior */}
  <a 
    href={`/profile/${id}`} 
    // target="_blank" 
    rel="noopener noreferrer"
    className="hover:text-gray-600 cursor-pointer transition-colors"
  >
    Candidate Profile
  </a>
  
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
              <div className="h-24 w-24 rounded-2xl bg-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-2xl">
                {candidate?.full_name?.charAt(0) || "?"}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
                <Fingerprint size={16} className="text-indigo-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {candidate.full_name}
              </h1>
           <div className="flex items-center gap-4 mt-2">
  {/* 📍 LOCATION NODE */}
  <div className="flex items-center gap-1.5 text-xs font-medium min-w-0">
    <MapPin size={12} className="text-gray-400 shrink-0" />
    <span
      className="truncate max-w-[250px] text-slate-600 font-semibold"
      title={[
        candidate.city,
        candidate.district,
        candidate.state,
        candidate.country,
        candidate.pincode,
      ].filter(Boolean).join(", ")}
    >
      {[
        candidate.city,
        candidate.district,
        candidate.state,
        candidate.country,
        candidate.pincode,
      ]
        .filter((val) => val && val !== "undefined" && val !== "null" && val !== "")
        .join(", ") || "Location Unspecified"}
    </span>
  </div>

  {/* 📧 EMAIL NODE */}
  {candidate.email && (
    <div className="flex items-center gap-1.5 text-xs font-medium border-l border-slate-200 pl-4">
      <Mail size={12} className="text-gray-400 shrink-0" />
      <a 
        href={`mailto:${candidate.email}`} 
        className="text-slate-500 hover:text-blue-600 transition-all lowercase tracking-tight"
      >
        {candidate.email}
      </a>
    </div>
  )}

  {/* 📱 PHONE NODE */}
  {candidate.phone && (
    <div className="flex items-center gap-1.5 text-xs font-medium border-l border-slate-200 pl-4">
      <Smartphone size={12} className="text-gray-400 shrink-0" />
      <span className="text-slate-500 tracking-widest font-bold">
        {/* candidate.phone is typically numeric, but keeping toUpperCase() as requested for consistency */}
        +91{candidate.phone.toUpperCase()}
      </span>
    </div>
  )}
</div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-8 lg:mt-0 flex items-center gap-2.5 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <Edit3 size={16} /> Update
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
            {/* <TabButton
              active={activeTab === "professional"}
              onClick={() => setActiveTab("professional")}
              icon={<Briefcase size={18} />}
              label="Career History"
            /> */}

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
              <div className="px-10 py-5 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* <div className="mt-10 space-y-6 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
                      <Activity size={14} /> Global Interview Registry
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {interviews.length} Scheduled
                    </span>
                  </div>

                  {interviews.length > 0 ? (
                    <>
                    <div className="space-y-4 mb-4">
                      {interviews.map((i, idx) => (

                        <div
                          key={idx}
                          className="group relative bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                        >
                       
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />

                          <div className="grid grid-cols-12 items-center gap-6">
                          
                            <div className="col-span-12 lg:col-span-4 flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                                <CalendarIcon size={18} />
                                <span className="text-[10px] font-black mt-1 uppercase">
                                  RD {i.round}
                                </span>
                              </div>

                              <div className="space-y-1 min-w-0">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
                                  Scheduled Date
                                </span>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-[12px] font-black text-slate-900 tracking-tight leading-none uppercase whitespace-nowrap">
                                    {i.date}
                                  </h4>
                                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                                  <span className="text-[12px] font-bold text-blue-600 uppercase tracking-tighter">
                                    {i.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 mt-2">
                                  <Globe size={12} className="text-gray-400" />
                                  <span className="text-[10px] font-bold uppercase tracking-tight capitalize">
                                    {i.mode} Interview
                                  </span>
                                </div>
                              </div>
                            </div>

                          
                            <div className="col-span-12 lg:col-span-5 gap-4 flex max-h-56 h-full items-center justify-evenly border-l lg:border-l-0 lg:border-x border-slate-100 px-0 lg:px-2">
                              <div className="flex  h-full flex-col min-w-0">
                                {" "}
                              
                                <p
                                  className="text-[9px] font-black pt-2 text-slate-400 tracking-[0.2em] block mb-1 uppercase truncate"
                                  title={i.interviewerRole}
                                >
                                  {i.interviewerRole}
                                </p>
                                <h4
                                  className="text-sm font-bold text-gray-800 leading-tight truncate cursor-help"
                                  title={i.interviewerName} // 🎯 Native tooltip on hover
                                >
                                  {i.interviewerName}
                                </h4>
                                <div>
                                  <p
                                  className="text-[9px] font-black pt-2 text-slate-400 tracking-[0.2em] block mb-1 uppercase truncate"
                                 
                                >
                                Vacancy Name
                                </p>
                                  <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight truncate leading-none">
            {i?.vacancy?.title ||  "Not Specified"}
          </p>
                                </div>
                              
                              </div>

                              <div>
                                   <div className="flex flex-col items-start shrink-0">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-0 lg:block hidden">
                                  State
                                </span>
                                <div
                                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                    i.status === "Completed"
                                      ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  }`}
                                >
                                  {i.status}
                                </div>
                              </div>
                              </div>

                             
                            </div>

                           
                            <div className="col-span-12 lg:col-span-3 flex flex-col items-stretch lg:items-center justify-center min-h-[60px]">
                              <div className="w-32 flex flex-col gap-2">
                     
                                {i.attendance_status === "pending" ? (
                                  <div className="flex flex-col items-end gap-2">
                                    <button
                                      onClick={() => {
                                        setActiveInterview(i);
                                        setIsRescheduleOpen(true);
                                      }}
                                      className="w-full px-1 py-2.5 rounded-xl !bg-white !text-blue-600 border !border-blue-500 text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 shadow-sm"
                                    >
                                      Reschedule
                                    </button>

                                    <button
                                      onClick={() => {
                                        setActiveInterview(i);
                                        setIsAttendanceOpen(true);
                                      }}
                                      className="w-full px-1 py-2.5 !bg-white !text-blue-600 border !border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                                    >
                                      Interview Status
                                    </button>
                                  </div>
                                ) : i.attendance_status === "no_show" ? (
                             
                                  <button
                                    onClick={() => {
                                      setActiveInterview(i);
                                      setIsRescheduleOpen(true);
                                    }}
                                    className="px-2 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100"
                                  >
                                    Schedule Again
                                  </button>
                                ) : (
                                  <>
                                    {i.status === "completed" && i.review ? (
                                      <div className="flex flex-col items-center gap-2">
                                 
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
                                        className="w-full px-4 py-2.5 flex items-center justify-center gap-2  !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-white transition-all active:scale-95 "
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
                    

                    </>
                  ) : (
                   
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
    // 🎯 Set the first vacancy ID as a default if none exist
    const defaultVacId = candidate.applied_vacancies?.[0]?.id;
    setNextRoundForm(prev => ({ ...prev, vacancy_id: defaultVacId }));
    setIsNextRoundModalOpen(true);
  }}
                        className="mt-10 group relative flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:scale-95 overflow-hidden"
                      >
                   
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="flex flex-col items-start">
                          <span className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            Initialize Round{" "}
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </span>
                        </div>

                        <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
                          <Calendar size={60} strokeWidth={1} />
                        </div>
                      </button>
                    </div>
                  )}
                </div> */}

             
              

                {/* --- MULTI-VACANCY SCHEDULING CONSOLE --- */}
{/* <div className="space-y-4 mb-8">
  {candidate.applied_vacancies?.map((vac) => {

    const vacancyInterviews = interviewsByVacancy[vac.id] || [];
    
    // 🎯 Sort safely to get the latest round
    const lastInt = vacancyInterviews.length > 0 
      ? [...vacancyInterviews].sort((a, b) => b.round_number - a.round_number)[0] 
      : null;

    // 🔒 Logic: Can schedule if no interview exists OR if the last one is completed
    const canSchedule = (!lastInt || lastInt.status?.toLowerCase() === "completed") && 
                       candidate.status?.toLowerCase() !== "selected";

    return (
      <div key={vac.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm hover:border-indigo-200 transition-all">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              {vac.title}
            </span>
            <span className="text-[9px] font-bold text-slate-400">ID: #{vac.id}</span>
          </div>

          {lastInt?.status === "scheduled" ? (
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
              <Clock size={12} /> Round {lastInt.round_number} is currently active. Complete review to unlock next round.
            </span>
          ) : lastInt?.status === "completed" ? (
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} /> Round {lastInt.round_number} passed. Ready for Round {lastInt.round_number + 1}.
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-bold mt-1">
              No interview rounds initialized for this vacancy yet.
            </span>
          )}
        </div>

        {canSchedule ? (
         <button 
         className="px-5 py-2 !bg-white !text-blue-600 border !border-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-white  transition-all active:scale-95"
         onClick={() => {
           setNextRoundForm(prev => ({ ...prev, vacancy_id: vac.id }));
           setIsNextRoundModalOpen(true);
           fetchConfirmedEmployees(); // Load employees when opening
            
         }}>
           Schedule Next Round
         </button>
       ) : (
         <span className="text-red-500 text-[10px]">Complete Round {lastInt.round_number} first</span>
       )}
      </div>
    );
  })}
</div> */}

 {/* <div className="mt-10 space-y-6 mb-4">
    
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
          <Activity size={14} /> Global Interview Registry
        </h3>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {interviews.length} Scheduled Sessions
        </span>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-4 mb-4">
          {interviews.map((i, idx) => {
            // 🎯 LOGIC: Find the latest round state for THIS vacancy to show the action button
            const vacancyId = i?.vacancy?.id;
            const vacancyInterviews = interviewsByVacancy[vacancyId] || [];
            const latestRoundForThisVac = vacancyInterviews.length > 0 
              ? [...vacancyInterviews].sort((a, b) => b.round_number - a.round_number)[0] 
              : null;

            // Determine if we show "Schedule Next Round" or "Complete Round X first"
            const isLatestActive = latestRoundForThisVac?.status?.toLowerCase() === "scheduled";
            const isLatestDone = latestRoundForThisVac?.status?.toLowerCase() === "completed";
            const isRecruited = candidate.status?.toLowerCase() === "selected";

            return (
              <div
                key={idx}
                className="group relative bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
              >
                
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${i.status === 'Scheduled' ? 'bg-amber-500' : 'bg-indigo-500'}`} />

                <div className="grid grid-cols-12 items-center gap-6">
                  
                  <div className="col-span-12 lg:col-span-4 flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <CalendarIcon size={18} />
                      <span className="text-[10px] font-black mt-1 uppercase">RD {i.round}</span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Scheduled Date</span>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[12px] font-black text-slate-900 tracking-tight leading-none uppercase whitespace-nowrap">{i.date}</h4>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[12px] font-bold text-blue-600 uppercase tracking-tighter">{i.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 mt-2">
                        <Globe size={12} className="text-gray-400" />
                        <span className="text-[10px] font-bold uppercase tracking-tight capitalize">{i.mode} Interview</span>
                      </div>
                    </div>
                  </div>

               
                  <div className="col-span-12 lg:col-span-5 gap-4 flex max-h-56 h-full items-center justify-evenly border-l lg:border-l-0 lg:border-x border-slate-100 px-0 lg:px-2">
                    <div className="flex h-full flex-col min-w-0">
                      <p className="text-[9px] font-black pt-2 text-slate-400 tracking-[0.2em] block mb-1 uppercase truncate">{i.interviewerRole}</p>
                      <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">{i.interviewerName}</h4>
                      <div>
                        <p className="text-[9px] font-black pt-2 text-slate-400 tracking-[0.2em] block mb-1 uppercase truncate">Vacancy Node</p>
                        <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight truncate leading-none">{i?.vacancy?.title || "Not Specified"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start shrink-0">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-0 lg:block hidden">State</span>
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${i.status === "Completed" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                        {i.status}
                      </div>
                    </div>
                  </div>

             
                  <div className="col-span-12 lg:col-span-3 flex flex-col items-stretch lg:items-center justify-center min-h-[60px]">
                    <div className="w-32 flex flex-col gap-2">
                      {i.attendance_status === "pending" ? (
                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => { setActiveInterview(i); setIsRescheduleOpen(true); }} className="w-full px-1 py-2.5 rounded-xl !bg-white !text-blue-600 border !border-blue-500 text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 shadow-sm">Reschedule</button>
                          <button onClick={() => { setActiveInterview(i); setIsAttendanceOpen(true); }} className="w-full px-1 py-2.5 !bg-white !text-blue-600 border !border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-sm whitespace-nowrap">Status Update</button>
                        </div>
                      ) : i.attendance_status === "no_show" ? (
                        <button onClick={() => { setActiveInterview(i); setIsRescheduleOpen(true); }} className="px-2 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100">Schedule Again</button>
                      ) : (
                        <>
                          {i.status === "completed" && i.review ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
                                <Star size={12} fill="currentColor" /> SCORE: {i.review.total_score.toFixed(1)}
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => { setSelectedInterview(i); setIsFeedbackModalOpen(true); }} className="w-full px-4 py-2.5 flex items-center justify-center gap-2 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-white transition-all active:scale-95">Evaluate <ExternalLink size={12} /></button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pipeline Logic</span>
                  </div>

                  {isRecruited ? (
                     <span className="text-[10px] font-black text-indigo-600 uppercase">Process Finalized</span>
                  ) : isLatestActive ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-500">
                      <span className="text-rose-600 text-[10px] font-black uppercase tracking-tight">Complete Round {latestRoundForThisVac.round_number} first</span>
                      <div className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded border border-rose-100 text-[8px] font-black uppercase">Blocked</div>
                    </div>
                  ) : isLatestDone ? (
                    <button 
                      onClick={() => {
                        setNextRoundForm(prev => ({ ...prev, vacancy_id: vacancyId }));
                        setIsNextRoundModalOpen(true);
                        fetchConfirmedEmployees();
                      }}
                      className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-md"
                    >
                      Schedule Next Round <ArrowRight size={10} />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 italic uppercase">Initializing...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
      
        <div className="py-16 px-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="h-20 w-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
            <Clock size={32} className="text-gray-300" />
          </div>
          <div className="max-w-xs space-y-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">No Active Sessions</h3>
            <p className="text-xs font-medium text-gray-400 leading-relaxed">No interviews scheduled yet. Deploy the first round below.</p>
          </div>
          <button 
            onClick={() => {
              const defaultVacId = candidate.applied_vacancies?.[0]?.id;
              setNextRoundForm(prev => ({ ...prev, vacancy_id: defaultVacId }));
              setIsNextRoundModalOpen(true);
            }}
            className="mt-10 flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            <span className="text-sm font-black uppercase tracking-tight">Initialize Round 1</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div> */}

     <div className="mt-10 space-y-6 mb-4">
  {/* --- HEADER --- */}
  <div className="flex items-center justify-between">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
      <Activity size={14} /> Global Interview
    </h3>
    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
      {interviews.length} Total Sessions
    </span>
  </div>

  {interviews.length > 0 ? (
    <div className="space-y-4 mb-4">
      {(() => {
        // 🎯 STEP 1: Filter to only keep the LATEST round card for each unique Vacancy ID
        const latestRoundsOnly = [];
        const vacancyMap = new Map();

        // Sort to ensure we are looking at rounds in order
        const sortedInterviews = [...interviews].sort((a, b) => a.round_number - b.round_number);

        sortedInterviews.forEach((inter) => {
          const vId = inter.vacancy?.id;
          // Always overwrite with the newer round so only the max round remains
          vacancyMap.set(vId, inter); 
        });

        const filteredInterviews = Array.from(vacancyMap.values());

        return filteredInterviews.map((i, idx) => {
          const vacancyId = i?.vacancy?.id;
          const vacancyInterviews = interviewsByVacancy[vacancyId] || [];
          
          // Latest state check for this specific vacancy
          const latestRoundForThisVac = vacancyInterviews.length > 0 
            ? [...vacancyInterviews].sort((a, b) => b.round_number - a.round_number)[0] 
            : null;

          const isLatestActive = latestRoundForThisVac?.status?.toLowerCase() === "scheduled";
          const isLatestDone = latestRoundForThisVac?.status?.toLowerCase() === "completed";
          const isRecruited = candidate.status?.toLowerCase() === "selected";

          return (
            <div
              key={idx}
              
              className="group cursor-pointer relative bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
            >

              {/* Status Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${i.status === 'Scheduled' ? 'bg-amber-500' : 'bg-indigo-500'}`} />

              <div className="grid grid-cols-12 items-center gap-6">
                {/* 01. TEMPORAL & ROUND TRACK */}
                <div className="col-span-12 lg:col-span-4 flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    <CalendarIcon size={18} />
                    <span className="text-[10px] font-black mt-1 uppercase">RD {i.round}</span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Latest Progress</span>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[12px] font-black text-slate-900 tracking-tight leading-none uppercase whitespace-nowrap">{i.date}</h4>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[12px] font-bold text-blue-600 uppercase tracking-tighter">{i.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 mt-2">
                      <Globe size={12} className="text-gray-400" />
                      <span className="text-[10px] font-bold uppercase tracking-tight capitalize">{i.mode} Interview</span>
                    </div>
                  </div>
                </div>

                {/* 02. PERSONNEL & VACANCY TRACK */}
                <div className="col-span-12 lg:col-span-5 gap-4 flex max-h-56 h-full items-center justify-evenly border-l lg:border-l-0 lg:border-x border-slate-100 px-0 lg:px-2">
                  <div className="flex h-full flex-col min-w-0">
                    <p className="text-[9px] font-black pt-2 text-slate-400 tracking-[0.2em] block mb-1 uppercase truncate">{i.interviewerRole}</p>
                    <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">{i.interviewerName}</h4>
                    <div>
                      <p className="text-[9px] font-black pt-2 text-slate-400 tracking-[0.2em] block mb-1 uppercase truncate">Vacancy Name</p>
                      <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight truncate leading-none">{i?.vacancy?.title || "Not Specified"}</p>
                    </div>
                  </div>
                  {/* <div className="flex flex-col items-start shrink-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-0 lg:block hidden">State</span>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${i.status === "Completed" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                      {i.status}
                    </div>
                  </div> */}
                 <div className="flex flex-col items-start shrink-0">
  {/* 🏷️ META-DATA LABEL */}
  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2 lg:block hidden">
    Status
  </span>
  
  {i.status?.toLowerCase() === "scheduled" ? (
    /* 🕒 SCHEDULED STATE: Interactive Amber Theme */
    <div className="flex flex-col items-start gap-1.5 group">
      <div className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all group-hover:bg-amber-100">
        <div className="relative flex h-2 w-2">
          {/* Dual-layer Pulse Effect */}
          <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
          <div className="relative h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
        </div>
        Round {i.round}
      </div>
      
      {/* Pending Message with Slide-in Animation */}
      <div className="flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-left-2 duration-700">
        <div className="h-1 w-1 rounded-full bg-amber-400" />
        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest opacity-80">
          Pending: Please Complete
        </span>
      </div>
    </div>
  ) : (
    /* ✅ COMPLETED STATE: Emerald & Slate Depth Theme */
    <div className="flex flex-col items-start gap-1.5 group">
      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all group-hover:bg-emerald-100">
        <CheckCircle2 size={12} strokeWidth={2.5} className="text-emerald-500" />
        Interview done
      </div>
      
      {/* Decision Text with Professional Leading */}
      <div className="flex flex-col ml-1 leading-tight animate-in fade-in duration-1000">
        <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter">
          Waiting for Decision
        </span>
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
          and Next Process
        </span>
      </div>
    </div>
  )}
</div>
                </div>

                {/* 03. ACTION EXECUTION TRACK */}
                <div className="col-span-12 lg:col-span-3 flex flex-col items-stretch lg:items-center justify-center min-h-[60px]">
                  <div className="w-32 flex flex-col gap-2">
                    {i.attendance_status === "pending" ? (
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => { setActiveInterview(i); setIsRescheduleOpen(true); }} className="w-full px-1 py-2.5 rounded-xl !bg-white !text-blue-600 border !border-blue-500 text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 shadow-sm">Reschedule</button>
                        <button onClick={() => { setActiveInterview(i); setIsAttendanceOpen(true); }} className="w-full px-1 py-2.5 !bg-white !text-blue-600 border !border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-sm whitespace-nowrap">Status Update</button>
                      </div>
                    ) : i.attendance_status === "no_show" ? (
                      <button onClick={() => { setActiveInterview(i); setIsRescheduleOpen(true); }} className="px-2 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100">Schedule Again</button>
                    ) : (
                      <>
                        {i.status === "completed" && i.review ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1 text-indigo-600 font-black text-[10px]">
                              <Star size={12} fill="currentColor" /> SCORE: {i.review.total_score.toFixed(1)}
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setSelectedInterview(i); setIsFeedbackModalOpen(true); }} className="w-full px-4 py-2.5 flex items-center justify-center gap-2 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-white transition-all active:scale-95">Evaluate <ExternalLink size={12} /></button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 🎯 PIPELINE LOGIC SECTION */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-slate-300" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Round Scheduled Process</span>

                  {/* 🔍 History Trigger: Integrated into the footer instead of absolute positioning */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // 🎯 Prevents card-level conflicts
        setHistoryVacancy(i.vacancy);
      }}
      className="flex items-center gap-2 px-2.5 py-1 !bg-white !text-blue-600 rounded-lg border !border-blue-100 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 group/hist shadow-sm"
      title="View Interview History"
    >
      <History size={14} strokeWidth={3} className="group-hover/hist:rotate-[-45deg] transition-transform" />
      <span className="text-[8px] font-black uppercase tracking-tighter">Interview History</span>
    </button>
                </div>

                {isRecruited ? (
                   <span className="text-[10px] font-black text-indigo-600 uppercase">Process Finalized</span>
                ) : isLatestActive ? (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-500">
                    <span className="text-rose-600 text-[10px] font-black uppercase tracking-tight">Complete Round {latestRoundForThisVac.round_number} first</span>
                    <div className="px-2 py-0.5 bg-yellow-50 text-yellow-500 rounded border border-rose-100 text-[8px] font-black uppercase animate-pulse">Pending</div>
                  </div>
                ) : isLatestDone ? (
                  <button 
                    onClick={() => {
                      setNextRoundForm(prev => ({ ...prev, vacancy_id: vacancyId }));
                      setIsNextRoundModalOpen(true);
                      fetchConfirmedEmployees();
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-md"
                  >
                    Schedule Next Round <ArrowRight size={10} />
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-300 italic uppercase">Initializing...</span>
                )}
              </div>
            </div>
          );
        });
      })()}
    </div>
  ) : (
    /* EMPTY STATE - Enterprise Style */
    <div className="py-16 px-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="h-20 w-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
        <Clock size={32} className="text-gray-300" />
      </div>
      <div className="max-w-xs space-y-2">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">No Active Sessions</h3>
        <p className="text-xs font-medium text-gray-400 leading-relaxed">No interviews scheduled yet. Deploy the first round below.</p>
      </div>
      <button 
        onClick={() => {
          const defaultVacId = candidate.applied_vacancies?.[0]?.id;
          setNextRoundForm(prev => ({ ...prev, vacancy_id: defaultVacId }));
          setIsNextRoundModalOpen(true);
        }}
        className="mt-10 flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
      >
        <span className="text-sm font-black uppercase tracking-tight">Initialize Round 1</span>
        <ArrowRight size={16} />
      </button>
    </div>
  )}
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
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {/* Sync Entity Records */}
                  Edit Candidate 
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {/* Updating global profile attributes */}
                  Updating candidate profile information
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:!bg-gray-100 rounded-xl !bg-transparent transition-colors !text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
               

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">
                    Candidate Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-slate-300 rounded-2xl p-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  >
                    <option value="">Select Type</option>
                    {/* <option value="jd_accepted">JD Accepted</option> */}
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button
                onClick={handleSave}
                className="flex-grow !bg-white !text-blue-600 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:!bg-white shadow-sm shadow-gray-200 border border-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Save size={16} /> Save Record Changes
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-8 !bg-white border !border-gray-200 !text-gray-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:!bg-gray-100"
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
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-grow flex overflow-hidden">
              

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

                    {/* Verified Metadata Blocks */}
                    <MetadataInsight
                      label="Education"
                      value={`Completed ${candidate.education}`}
                      icon={<GraduationCap className="text-emerald-500" />}
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
                <div className="w-10 h-10 !bg-white rounded-xl !text-blue-600 flex items-center justify-center  shadow-lg">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                    Attendance Interview
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Post-Interview
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

              {/* Status Selection: High-Contrast Interaction */}
              <div className="space-y-3">
                <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Update Final Status
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <Activity size={16} />
                  </div>
                 
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
              
            </div>

            {/* Footer: Close Execution */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button
                disabled={attendanceLoading}
                onClick={async () => {
                  if (!attendanceStatus) {
                    toast.error("Please select attendance status");
                    return;
                  }

                  try {
                    setAttendanceLoading(true);

                    await updateAttendance(
                      activeInterview.id,
                      attendanceStatus,
                    );

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
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsNextRoundModalOpen(false)} />
    
    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
      
      {/* 1. HEADER with Close Button */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Schedule Interview</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Candidate: <span className="text-blue-600">{candidate?.full_name}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsNextRoundModalOpen(false)} 
          className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-all"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* 2. MAIN FORM AREA */}
        <div className="flex-1 p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* SECTION: TIMING */}
          <div className="space-y-4">
            <ModalSectionHeader icon={Clock} title="Timing & Logistics" />
            <div className="grid grid-cols-2 gap-5">
              <InputField label="Interview Date" type="date" value={nextRoundForm.date} onChange={(v) => setNextRoundForm({ ...nextRoundForm, date: v })} />
              <InputField label="Preferred Time" type="time" value={nextRoundForm.time} onChange={(v) => setNextRoundForm({ ...nextRoundForm, time: v })} />
            </div>

            {/* INTERVIEW MODE SELECTOR */}
            <div className="grid grid-cols-1 gap-5 pt-2">
              <div className="space-y-2 !w-full">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interview Mode</label>
                <div className="flex !bg-slate-100 p-1 rounded-xl border !border-slate-200 shadow-inner w-fit">
                  <button 
                    onClick={() => setNextRoundForm({ ...nextRoundForm, mode: "online", location: "" })} 
                    className={`px-6 py-2 rounded-lg !bg-transparent text-[10px] font-black uppercase tracking-widest transition-all ${nextRoundForm.mode === "online" ? "!bg-white !text-blue-600 shadow-md" : "!text-slate-400 hover:!text-slate-600"}`}
                  >Online</button>
                  <button 
                    onClick={() => {
                      setNextRoundForm({ ...nextRoundForm, mode: "offline" });
                      fetchCompanyAddress(); 
                    }} 
                    className={`px-6 py-2 rounded-lg !bg-transparent text-[10px] font-black uppercase tracking-widest transition-all ${nextRoundForm.mode === "offline" ? "!bg-white !text-blue-600 shadow-md" : "!text-slate-400 hover:!text-slate-600"}`}
                  >In-Person</button>
                </div>
              </div>
              
              <InputField
                label={nextRoundForm.mode === "online" ? "Digital Meeting Link" : "Office HQ Address"}
                placeholder={nextRoundForm.mode === "online" ? "https://zoom.us/..." : "Fetching address..."}
                icon={nextRoundForm.mode === "online" ? <Globe size={14} /> : <MapPin size={14} />}
                value={nextRoundForm.location}
                onChange={(v) => setNextRoundForm({ ...nextRoundForm, location: v })}
              />
            </div>
          </div>

          {/* SECTION: INTERVIEWER REGISTRY */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <ModalSectionHeader icon={UserPlus} title="Interviewer Details" />
            
            <div className="space-y-5">
              {/* SEARCHABLE DROPDOWN FIELD */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search confirmed employees..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm"
                    value={employeeSearch}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                  />
                  
                  {/* SEARCH RESULTS DROPDOWN */}
                  {showEmployeeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[500] max-h-52 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
                      {isFetchingEmployees ? (
                        <div className="p-4 text-center"><Loader2 className="animate-spin inline mr-2" size={16}/> <span className="text-[10px] font-bold text-slate-400 uppercase">Syncing Registry...</span></div>
                      ) : filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                          <div
                            key={emp.id}
                            onClick={() => {
                              setNextRoundForm({
                                ...nextRoundForm,
                                interviewerName: emp.full_name,
                                interviewerRole: emp.role || emp.designation || "Panelist",
                                interviewerEmail: emp.email || ""
                              });
                              setEmployeeSearch(emp.full_name);
                              setShowEmployeeDropdown(false);
                            }}
                            className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors group"
                          >
                            <p className="text-[12px] font-black text-slate-800 uppercase group-hover:text-blue-600">{emp.full_name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role || 'No Role'}</span>
                              <span className="text-[9px] font-medium text-blue-500/70 lowercase">{emp.email}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase">No employees found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Role" value={nextRoundForm.interviewerRole} onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerRole: v })} />
                <InputField label="Email" type="email" value={nextRoundForm.interviewerEmail} onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerEmail: v })} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SYSTEM NOTICE SIDEBAR */}
     
      </div>

      {/* 4. FOOTER ACTIONS */}
      <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
        <button onClick={() => setIsNextRoundModalOpen(false)} className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Abort</button>
        <button 
          onClick={handleCreateNextRound} 
          className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
        >
          Dispatch Invite <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  Scorecard Analysis
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
                  label="Cultural Understanding"
                  icon={Users}
                  value={feedbackData.culturalFit}
                  onChange={(val) =>
                    setFeedbackData({ ...feedbackData, culturalFit: val })
                  }
                />
                <RatingRow
                  label="Communication Skills"
                  icon={MessageSquare}
                  value={feedbackData.softSkills}
                  onChange={(val) =>
                    setFeedbackData({ ...feedbackData, softSkills: val })
                  }
                />
              </div>

              <div className="mt-10 p-5 !bg-blue-600 rounded-[24px] text-white shadow-lg shadow-indigo-200">
                <p className="text-[10px] font-bold uppercase !text-white tracking-widest opacity-70 mb-1">
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
                    Final Decision
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
                        color: "hover:!border-red-500 hover:!text-red-600",
                        active: "!bg-white !border-red-500 !text-red-600",
                      },
                      {
                        id: "pass",
                        label: "Pass",
                        color:
                          "hover:!border-indigo-500 hover:!text-indigo-600",
                        active: "!bg-white !border-indigo-500 !text-indigo-600",
                      },
                      {
                        id: "strong_pass",
                        label: "Strong Pass",
                        color:
                          "hover:!border-emerald-500 hover:!text-emerald-600",
                        active:
                          "!bg-white !border-emerald-500 !text-emerald-600",
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
                            : `!bg-white !border-slate-300 !text-slate-400 ${rec.color}`
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
                <Briefcase size={16} /> Final Decision
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- 📜 VACANCY HISTORY MODAL --- */}
{/* --- 📜 COMPACT & ATTRACTIVE VACANCY HISTORY MODAL --- */}
{historyVacancy && (
  <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setHistoryVacancy(null)} />
    
    <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
      
      {/* 🚀 COMPACT HEADER */}
      <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 relative">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <History size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Interview History</h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase border border-blue-100">
                {historyVacancy.title}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
              Vacancy Id: <span className="text-slate-600">#{historyVacancy.id}</span>
            </p>
          </div>
        </div>
        <button onClick={() => setHistoryVacancy(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      {/* 📜 COMPACT TIMELINE CONTENT */}
      <div className="p-6 overflow-y-auto custom-scrollbar bg-white flex-grow space-y-4">
        {interviewsByVacancy[historyVacancy.id]?.sort((a, b) => b.round_number - a.round_number).map((item, index) => (
          <div key={item.id} className="relative pl-8 border-l border-slate-100 last:border-transparent pb-4 group">
            
            {/* 🎯 Minimal Timeline Marker */}
            <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full ring-4 ring-white shadow-sm transition-all ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />

            <div className="bg-slate-50/50 group-hover:bg-white group-hover:border-blue-200 border border-slate-100 rounded-2xl p-4 transition-all duration-300">
              {/* TOP ROW: MULTI-DATA HORIZONTAL STRIP */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                
                {/* 1. Round & Mode */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-white text-blue-500 border border-blue-600 px-2 py-1 rounded-md uppercase tracking-widest">
                    RD {item.round_number}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Interview Mode</span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      {item.mode === 'online' ? <Globe size={10}/> : <MapPin size={10}/>} {item.mode}
                    </span>
                  </div>
                </div>

                {/* 2. Horizontal Interviewer Block */}
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <UserCheck size={14} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Assigned Interviewer</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-slate-800 uppercase">{item.interviewer_name}</span>
                      <span className="text-[9px] font-bold text-blue-500/70 border-l border-slate-200 pl-2 uppercase">{item.interviewer_designation || 'Technical'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Temporal Node */}
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400">
                    <CalendarIcon size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Scheduled Date</span>
                    <span className="text-[11px] font-black text-slate-700 tracking-tighter uppercase">
                      {new Date(item.interview_date).toLocaleDateString('en-GB')} • {new Date(item.interview_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* 4. Status Badge */}
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {item.status}
                </div>
              </div>

              {/* BOTTOM ROW: HORIZONTAL SCORES (Only if review exists) */}
              {item.review ? (
                <div className="grid grid-cols-4 gap-4 items-center bg-white p-3 rounded-xl border border-slate-100/50">
                  <MetricBarHorizontal label="Technical" value={item.review.technical_skill} color="bg-blue-500" />
                  <MetricBarHorizontal label="Comm." value={item.review.communication} color="bg-emerald-500" />
                  <MetricBarHorizontal label="Cultural" value={item.review.cultural_fit} color="bg-indigo-500" />
                  
                  {/* Aggregated Weighted Score */}
                  <div className="flex items-center justify-end gap-2 border-l border-slate-100 pl-4">
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Score</p>
                      <p className="text-[14px] font-black text-blue-600 leading-none mt-1">{item.review.total_score.toFixed(1)}<span className="text-[10px] opacity-40">/10</span></p>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Award size={16} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex items-center justify-center gap-3">
                  <Activity size={14} className="text-amber-400 animate-spin-slow" />
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Waiting for interview review </span>
                </div>
              )}

              {/* 💬 REMARK (Optional/Compact) */}
              {item.review?.remarks && (
                <div className="mt-3 px-1 flex gap-2">
                  <MessageSquare size={10} className="text-slate-300 mt-0.5" />
                  <p className="text-[10px] font-medium text-slate-500 italic line-clamp-1">"{item.review.remarks}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔒 COMPACT FOOTER */}
      <div className="p-3 bg-slate-100 border-t border-slate-100 flex justify-center items-center gap-4">
       
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
    className={`w-full flex items-center gap-4 !bg-transparent px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? "!bg-white border !border-gray-200 !shadow-md !text-blue-600" : "!text-gray-400 hover:!text-gray-600 hover:!bg-gray-100/50"}`}
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
        <div className="p-1.5 !bg-indigo-50 rounded-lg !text-indigo-600 group-focus-within:!bg-indigo-600 group-focus-within:!text-white transition-all">
          <Icon size={14} />
        </div>
        <span className="text-[11px] font-black !text-slate-700 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-black text-indigo-600 !bg-indigo-50 px-3 py-1 rounded-full">
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
              ? "!bg-indigo-500 !shadow-[0_0_10px_rgba(99,102,241,0.4)]"
              : "!bg-slate-100 hover:!bg-slate-200 border border-slate-300"
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

const ModalSectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={14} className="text-indigo-600" />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {title}
    </span>
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

const MetricBarHorizontal = ({ label, value, color }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center px-0.5">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
      <span className="text-[9px] font-black text-slate-700">{value}/10</span>
    </div>
    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-700`} 
        style={{ width: `${(value/10) * 100}%` }}
      />
    </div>
  </div>
);

export default CandidateProfile;
