import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  Briefcase,
  Zap,
  Search,
  Filter,
  ArrowUpRight,
  Plus,
  Lock,
  FileText,
  Activity,
  Clock,
  CheckCircle2,
  Database,
  User,
  Phone,
  ChevronDown,
  X,
  Layers,
  XCircle,
  Timer,
  Mail,
  Award,
  UserPlus,
  LogOut,
  ShieldAlert,
  Fingerprint,
  CreditCard,
  Landmark,
  PenTool,
  Video,
  MapPin,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const HRGovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [decisionFilter, setDecisionFilter] = useState("All");
  const navigate = useNavigate();

  // debounced search
  const debouncedSearch = useDebounce(searchText, 1000);

  useEffect(() => {
    if (activeTab === "candidates") {
      fetchDashboardStats();
    } else if (activeTab === "employees") {
      fetchEmployeeStats();
    }
  }, [timeRange, debouncedSearch, statusFilter, activeTab]);

  const buildFilters = (extra = {}) => {
    const filters = {};

    if (extra.type) filters.type = extra.type;

    // ONLY send range if not ALL
    if (timeRange && timeRange !== "All") {
      filters.range = timeRange;
    }

    // if (searchText) filters.search = searchText;

    if (debouncedSearch) filters.search = debouncedSearch;

    if (statusFilter !== "All") {
      filters.status = statusFilter.toLowerCase();
    }

    if (extra.location) filters.location = extra.location;

    return filters;
  };


  const fetchDashboardStats = async () => {
  try {
    setLoading(true);
    const start = Date.now();

    const filters = buildFilters();
    const data = await dashboardService.getCandidateStats(filters);

    const elapsed = Date.now() - start;
    if (elapsed < 400) {
      await new Promise((r) => setTimeout(r, 400 - elapsed));
    }

    setApiStats(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const fetchEmployeeStats = async () => {
    try {
      setLoading(true);

      const filters = buildFilters();
      const data = await dashboardService.getEmployeeStats(filters);

      setApiStats(data);
    } catch (err) {
      console.error("Employee Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const interviewReviews = apiStats?.recent_activity ?? [];

  // Map interviews by date (YYYY-MM-DD)
  const interviewDateMap = useMemo(() => {
    const map = {};

    interviewReviews.forEach((candidate) => {
      candidate.interviews?.forEach((round) => {
        if (!round.interview_date) return;

        const dt = new Date(round.interview_date);
        const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

        if (!map[d]) map[d] = [];

        map[d].push({
          id: candidate.id,
          name: candidate.full_name,
          round: round.round_number,
          status: round.status, // completed / scheduled
          mode: round.mode,
          time: new Date(round.interview_date).toLocaleTimeString(),
        });
      });
    });

    return map;
  }, [interviewReviews]);

  const employeeJoinDateMap = useMemo(() => {
    if (activeTab !== "employees") return {};

    const map = {};
    const employees = apiStats?.recent_joiners ?? [];

    employees.forEach((emp) => {
      if (!emp.joining_date) return;

      const dt = new Date(emp.joining_date);
      const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

      if (!map[d]) map[d] = [];

      map[d].push({
        id: emp.id,
        name: emp.full_name,
        role: emp.role,
        status: emp.joining_attendance_status, // joined / pending / no_show
        docStatus: emp.doc_submission_status,
        date: emp.joining_date,
      });
    });

    return map;
  }, [apiStats, activeTab]);

  // --- YOUR EXISTING METRIC DEFINITIONS ---
  const stats = {
    candidates: [
      {
        id: "total",
        label: "Total Candidates",
        type: "all",
        val: apiStats?.total_candidates ?? 0,
        icon: <Users size={20} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        id: "interviewing",
        label: "Interviewing",
        type: "interviewing",
        val:
          apiStats?.status_distribution?.find((s) => s.label === "interviewing")
            ?.count ?? 0,
        icon: <Video size={20} />,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        id: "migrated",
        label: "Migrated",
        type: "migrated",
        val:
          apiStats?.status_distribution?.find((s) => s.label === "migrated")
            ?.count ?? 0,
        icon: <CheckCircle2 size={20} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        id: "manual",
        label: "Manual Entry",
        type: "manual",
        val:
          apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
            ?.count ?? 0,
        icon: <Database size={20} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
    ],
    
    employees: [
      {
        id: "total_employees",
        label: "Total Employees",
        type: "all",
        val: apiStats?.total_employees ?? 0,
        icon: <Users size={20} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        id: "active_employees",
        label: "Active Employees",
        type: "active",
        val: apiStats?.active_employees ?? 0,
        icon: <ShieldCheck size={20} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        id: "on_probation",
        label: "On Probation",
        type: "on_probation",
        val:
          apiStats?.status_distribution?.find((s) => s.label === "on_probation")
            ?.count ?? 0,
        icon: <ShieldAlert size={20} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        id: "departments",
        label: "Departments",
        type: "department",
        val: apiStats?.department_distribution?.length ?? 0,
        icon: <Landmark size={20} />,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
    
    ],
  };

  const filteredInterviewReviews = useMemo(() => {
    return interviewReviews
      .filter((item) => {
        const matchSearch =
          !debouncedSearch ||
          item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());

        // API status filter (existing)
        const matchStatus =
          statusFilter === "All" || item.status === statusFilter.toLowerCase();

        // 🎯 Decision filter (from review)
        const lastInterview = item.interviews?.[item.interviews.length - 1];

        let decision = "in_progress";
        if (lastInterview?.review?.decision) {
          decision = lastInterview.review.decision; // pass / reject / strong_pass
        }

        const matchDecision =
          decisionFilter === "All" || decision === decisionFilter;

        return matchSearch && matchStatus && matchDecision;
      })
      .map((item) => {
        const lastInterview = item.interviews?.[item.interviews.length - 1];

        const score = lastInterview?.review?.total_score
          ? Math.round(lastInterview.review.total_score * 10)
          : null;

        const decision = lastInterview?.review?.decision;

        let statusLabel = "In Progress";
        if (decision === "strong_pass") statusLabel = "Strong Pass";
        else if (decision === "pass") statusLabel = "Pass";
        else if (decision === "reject") statusLabel = "Reject";

        return {
          id: item.id,
          name: item.full_name,
          status: statusLabel,
          score,
          stars: Math.round((score || 0) / 20),
          date: new Date(item.updated_at).toLocaleDateString(),
        };
      });
  }, [interviewReviews, debouncedSearch, statusFilter, decisionFilter]);

  const filteredEmployees = useMemo(() => {
    const list = apiStats?.recent_joiners ?? [];

    return list.filter((emp) => {
      if (!debouncedSearch) return true;

      return (
        emp.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.role?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.department_name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    });
  }, [apiStats, debouncedSearch]);

  const interviewStatusMeta = {
    completed: {
      color: "bg-emerald-500",
      text: "Completed",
    },
    scheduled: {
      color: "bg-amber-500",
      text: "Scheduled",
    },
    cancelled: {
      color: "bg-rose-500",
      text: "Cancelled",
    },
    pending: {
      color: "bg-blue-500",
      text: "Pending",
    },
  };

  const employeeStatusMeta = {
    joined: {
      color: "bg-emerald-500",
      text: "Joined",
    },
    pending: {
      color: "bg-amber-500",
      text: "Pending",
    },
    no_show: {
      color: "bg-rose-500",
      text: "No Show",
    },
  };
  

  const TerminalLoader = () => (
  <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
    <div className="relative mb-6">
      {/* Outer Pulse Ring */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
      {/* Inner Core */}
      <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
        <Activity size={28} className="text-blue-500 animate-pulse" />
      </div>
    </div>
    <div className="space-y-2 text-center">
      <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
        Executing Data Retrieval
      </p>
      <div className="flex items-center justify-center gap-1">
        <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
        Synchronizing with Governance Node...
      </p>
    </div>
  </div>
);

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

  return (
    <>

    {/* GLOBAL LOADER OVERLAY */}
      {loading && <GlobalTerminalLoader />}
    
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
              Core Terminal
            </span>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
              <Lock size={10} /> ISO 27001 Compliant
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            {activeTab === "candidates"
              ? "Candidate Dashboard"
              : "Employee Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {["All", "Today", "Week", "Monthly"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
                  timeRange === range
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TRACK SWITCHER --- */}
      {/* <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
        {[
          {
            id: "candidates",
            label: "Candidates",
            icon: <UserPlus size={16} />,
          },
          {
            id: "employees",
            label: "Employees",
            icon: <Briefcase size={16} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setActiveView("dashboard");
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div> */}
      {/* --- TRACK SWITCHER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 border-b border-slate-200 pb-1 gap-4">
        <div className="flex gap-4">
          {[
            {
              id: "candidates",
              label: "Candidates",
              icon: <UserPlus size={16} />,
            },
            {
              id: "employees",
              label: "Employees",
              icon: <Briefcase size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveView("dashboard");
              }}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC ACTION BUTTONS --- */}
        <div className="pb-2">
          {activeTab === "candidates" ? (
            <button 
              onClick={() => navigate("/candidate")}
              className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
            >
              <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Plus size={14} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Add Candidate</span>
            </button>
          ) : (
            <button 
              onClick={() => navigate("/dummyemp")}
              className="group flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95"
            >
              <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Zap size={14} fill="currentColor" strokeWidth={0} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Onboard Employee</span>
            </button>
          )}
        </div>
      </div>

      {activeView === "dashboard" ? (
        <div className="grid grid-cols-12 gap-8">
          {/* --- KPI CARDS --- */}

          <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading ? (
              // <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
              //   Loading dashboard...
              // </div>
              <TerminalLoader />
            ) : (
              stats[activeTab].map((stat) => (
                <div
                  key={stat.id}
                  
                  onClick={() => {
                    if (activeTab === "candidates") {
                      navigate(`/dashboard/candidate-table?type=${stat.type}`);
                    } else {
                      navigate(`/dashboard/employee-table?type=${stat.type}`);
                    }
                  }}
                  className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
                >
                  <div
                    className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
                  >
                    {stat.icon}
                    {console.log("new data show in code", stat)}
                  </div>

                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>

                  <h2 className="text-2xl font-black text-slate-900">
                    {stat.val}
                  </h2>
                </div>
              ))
            )}
          </div>

          {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                {activeTab === "candidates"
                  ? "Interview Performance Review"
                  : "Employee Performance Overview"}
              </h3>

              {/* --- SEARCH & FILTER BAR --- */}

              <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50/50 p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
                {/* SEARCH NODE - Primary Action */}
                <div className="relative flex-[2] min-w-[300px] group">
                  <Search
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Search by candidate, email or role..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 text-[13px] font-medium bg-white rounded-[18px] border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* DECISION FILTER - Secondary Utility */}
               
                {/* DECISION FILTER - Only for Candidates */}
                {activeTab === "candidates" && (
                  <div className="relative group min-w-[180px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                      <Filter size={13} />
                    </div>

                    <select
                      value={decisionFilter}
                      onChange={(e) => setDecisionFilter(e.target.value)}
                      className="appearance-none w-full h-11 pl-10 pr-10 text-[11px] font-black uppercase tracking-[0.1em] bg-white rounded-[18px] border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer transition-all shadow-sm shadow-slate-100/20"
                    >
                      <option value="All">All Decisions</option>
                      <option value="strong_pass">Strong Pass</option>
                      <option value="pass">Pass</option>
                      <option value="reject">Reject</option>
                      <option value="in_progress">In Progress</option>
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                )}

                {/* CLEAR ACTION - Refined for visual alignment */}
                {(searchText ||
                  (activeTab === "candidates" && decisionFilter !== "All")) && (
                  <button
                    onClick={() => {
                      setSearchText("");
                      setDecisionFilter("All");
                    }}
                    className="h-11 px-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-[18px] transition-all border border-transparent hover:border-rose-100 active:scale-95"
                  >
                    <span className="mr-2">✕</span> Reset
                  </button>
                )}
              </div>

              <div className="space-y-4">
                
                {activeTab === "candidates" && (
                  <>
                    {filteredInterviewReviews.map((review) => {
                      const fullCandidate = interviewReviews.find(
                        (c) => c.id === review.id,
                      );

                      return (
                        <div
                          key={review.id}
                          onClick={() => setSelectedCandidate(fullCandidate)}
                          className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-2xl ${
                                review.status === "Reject"
                                  ? "bg-rose-100 text-rose-600"
                                  : review.status === "Strong Pass"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {review.status === "Reject" ? (
                                <ThumbsDown size={18} />
                              ) : (
                                <ThumbsUp size={18} />
                              )}
                            </div>

                            <div>
                              <h4 className="text-sm font-black text-slate-900">
                                {review.name}
                              </h4>

                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                    review.status === "Reject"
                                      ? "bg-rose-200 text-rose-700"
                                      : review.status === "Strong Pass"
                                        ? "bg-emerald-200 text-emerald-700"
                                        : "bg-blue-200 text-blue-700"
                                  }`}
                                >
                                  {review.status}
                                </span>

                                <span className="text-[9px] font-bold text-slate-400 uppercase">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>

                          {(review.status === "Pass" ||
                            review.status === "Strong Pass") && (
                            <div className="flex items-center gap-8">
                              <div className="hidden md:flex flex-col items-end">
                                <div className="flex gap-0.5 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={
                                        i < review.stars
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-slate-200"
                                      }
                                    />
                                  ))}
                                </div>

                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  Feedback Rating
                                </p>
                              </div>

                              <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  Score
                                </p>

                                <p className="text-lg font-black text-blue-600">
                                  {review.score ?? 0}
                                  <span className="text-[10px] text-slate-300">
                                    /100
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}

                          {review.status === "Reject" && (
                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              Profile Archived
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* ================= EMPLOYEE LIST ================= */}
                {activeTab === "employees" &&
                  filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all"
                    >
                      <div>
                        <h4 className="text-sm font-black text-slate-900">
                          {emp.full_name}
                        </h4>

                        <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                          <span>Role • {emp.role || "-"}</span>
                          <span>Dept • {emp.department_name || "-"}</span>
                        </div>

                        <div className="text-[9px] text-slate-400 mt-1">
                          Joined •{" "}
                          {emp.joining_date
                            ? new Date(emp.joining_date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold ${
                          emp.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : emp.status === "on_probation"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
           
          </div>

          {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
                Calendar
              </h4>

              {/* Calendar */}

              <Calendar
                value={calendarDate}
                onChange={setCalendarDate}
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;

                  const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                  const interviewList = interviewDateMap[d];
                  const employeeList = employeeJoinDateMap[d];

                  if (!interviewList && !employeeList) return null;

                  return (
                    <div className="flex justify-center mt-1 gap-1 flex-wrap">
                      {/* Interview dots */}
                      {interviewList?.slice(0, 2).map((item, i) => (
                        <span
                          key={`i-${i}`}
                          className={`w-1.5 h-1.5 rounded-full ${
                            interviewStatusMeta[item.status]?.color ||
                            "bg-slate-400"
                          }`}
                        />
                      ))}

                      {/* Employee joining dots */}
                      {employeeList?.slice(0, 2).map((emp, i) => (
                        <span
                          key={`e-${i}`}
                          className={`w-1.5 h-1.5 rounded-full ${
                            employeeStatusMeta[emp.status]?.color ||
                            "bg-blue-400"
                          }`}
                        />
                      ))}
                    </div>
                  );
                }}
              />

              {/* Selected Day Interviews */}


              <div className="mt-8">
  {/* SECTION HEADER */}
  <div className="flex items-center justify-between mb-4 px-1">
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      Day Schedule
    </span>
    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
      {calendarDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
    </span>
  </div>

  {/* SCROLLABLE FEED CONTAINER */}
  <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
    {(() => {
      const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;

      const interviewList = interviewDateMap[d] ?? [];
      const employeeList = employeeJoinDateMap[d] ?? [];

      if (interviewList.length === 0 && employeeList.length === 0)
        return (
          <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-[24px] bg-slate-50/30">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              No tactical events found
            </p>
          </div>
        );

      return (
        <div className="space-y-4">
          {/* INTERVIEW SEGMENT */}
          {interviewList.map((item, i) => (
            <div
              key={`int-${i}`}
              className="group relative pl-5 py-1 transition-all hover:translate-x-1"
            >
              {/* VERTICAL INTENT LINE */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
             
              <div className="flex items-center justify-between group">
  {/* NAME & PRIMARY IDENTITY */}
  <div className="flex flex-col gap-1">
    <span className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
      {item.name}
    </span>
    {/* ROUND CONTEXT - Minimalist Sub-Label */}
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
        Assessment Phase
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-200" />
      <span className="text-[10px] font-bold text-slate-600">
        Round {item.round}
      </span>
    </div>
  </div>

  {/* STATUS INDICATOR - Enterprise Style */}
  <div className="flex items-center">
    <div
      className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all shadow-sm
        ${
          item.status === "completed"
            ? "bg-emerald-50/50 border-emerald-100/60 text-emerald-700"
            : item.status === "scheduled"
            ? "bg-amber-50/50 border-amber-100/60 text-amber-700"
            : item.status === "cancelled"
            ? "bg-rose-50/50 border-rose-100/60 text-rose-700"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
    >
      {/* GLOWING STATUS DOT */}
      <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.1)] 
        ${
          item.status === "completed" ? "bg-emerald-500" : 
          item.status === "scheduled" ? "bg-amber-500" : 
          item.status === "cancelled" ? "bg-rose-500" : "bg-slate-400"
        }`} 
      />
      
      <span className="text-[10px] font-black uppercase tracking-tight">
        {item.status}
      </span>
    </div>
  </div>
</div>
            </div>
          ))}

          {/* JOINING SEGMENT */}
          {employeeList.map((emp, i) => (
            <div
              key={`emp-${i}`}
              className="group relative pl-5 py-1 transition-all hover:translate-x-1"
            >
              {/* VERTICAL INTENT LINE */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              
              <div className="flex flex-col gap-0.5">
               
                <div className="flex items-center justify-between">
  <span className="text-[12px] font-black text-slate-900 leading-none">
    {emp.name}
  </span>

  {/* STATUS BADGE */}
  <span
    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter
      ${
        emp.status === "joined"
          ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
          : emp.status === "pending"
          ? "text-amber-700 bg-amber-50 border border-amber-100"
          : emp.status === "no_show"
          ? "text-rose-700 bg-rose-50 border border-rose-100"
          : "text-slate-600 bg-slate-100"
      }`}
  >
    {emp.status === "joined"
      ? "Joined"
      : emp.status === "pending"
      ? "Pending"
      : emp.status === "no_show"
      ? "No Show"
      : emp.status}
  </span>
</div>

                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {emp.role} • Employee Activation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    })()}
  </div>
</div>
            </div>
          </div>
        </div>
      ) : (
        /* --- DETAIL PAGE (UNTOUCHED) --- */
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black">{selectedCategory} Table</h3>
            <button
              onClick={() => setActiveView("dashboard")}
              className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
            >
              Back to Dashboard
            </button>
          </div>
          <div className="p-10">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
                <div>
                  <p className="text-sm font-black">Rajesh Kumar</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Aadhaar: Verified | eSign: Pending | Interview: Online
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
                    Attended
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
                    Doc Uploaded
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          {/* Increased max-width to 4xl for better data spacing */}
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
            {/* --- ENTERPRISE HEADER (Enhanced Padding) --- */}
            <div className="px-10 py-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 flex-shrink-0">
                  <User size={32} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {selectedCandidate.full_name}
                    </h2>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-100">
                      {selectedCandidate.position || "Candidate"}
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                      <Mail size={15} className="text-slate-300" />{" "}
                      {selectedCandidate.email}
                    </p>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                      <Phone size={15} className="text-slate-300" />{" "}
                      {selectedCandidate.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- MODAL BODY (Deep Vertical Spacing) --- */}
            <div className="px-10 py-10 space-y-12 overflow-y-auto custom-scrollbar flex-1">
              {/* DATA MATRIX SECTION */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
                {[
                  {
                    label: "System Status",
                    value: selectedCandidate.status,
                    icon: Activity,
                    color: "text-emerald-500",
                  },
                  {
                    label: "Seniority/Exp",
                    value: selectedCandidate.experience || "N/A",
                    icon: Layers,
                    color: "text-blue-500",
                  },
                  {
                    label: "Current Location",
                    value: selectedCandidate.location || "Remote",
                    icon: MapPin,
                    color: "text-rose-500",
                  },
                  {
                    label: "Ingestion Node",
                    value: selectedCandidate.entry_method,
                    icon: ArrowUpRight,
                    color: "text-amber-500",
                  },
                  {
                    label: "Record Created",
                    value: selectedCandidate.created_at
                      ? new Date(
                          selectedCandidate.created_at,
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-",
                    icon: null,
                    color: "text-slate-500",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5">
                      {item.icon && (
                        <item.icon size={14} className={item.color} />
                      )}
                      {item.label}
                    </p>
                    <p className="text-base font-bold text-slate-800 capitalize">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

              {/* ASSESSMENT SECTION */}
              <div className="space-y-12">
                {/* SECTION HEADER: HIGH-DENSITY */}
                <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
                        <ShieldCheck size={16} className="text-white" />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">
                        Assessment Pipeline
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Technical evaluation ledger and decision history.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Efficiency Rating
                    </span>
                    <span className="text-sm font-black text-blue-600 tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
                      {selectedCandidate.interviews?.length || 0} Phases Cleared
                    </span>
                  </div>
                </div>

                {/* TIMELINE ARCHITECTURE */}
                {!selectedCandidate.interviews ||
                selectedCandidate.interviews.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                      <Activity size={24} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                      No Assessment Data Found
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* THE CENTRAL PIPELINE THREAD */}
                    <div className="absolute left-[20px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-slate-200 to-transparent hidden md:block" />

                    <div className="space-y-12">
                      {selectedCandidate.interviews.map((round, idx) => (
                        <div
                          key={round.id}
                          className="relative pl-0 md:pl-14 group transition-all"
                        >
                          {/* TIMELINE NODE */}
                          <div className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full bg-white border-2 border-slate-100 items-center justify-center z-10 group-hover:border-blue-500 transition-colors shadow-sm">
                            <span className="text-[10px] font-black text-slate-900">
                              {round.round_number}
                            </span>
                          </div>

                          <div className="flex flex-col gap-6">
                            {/* ROUND METADATA */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                    Phase {round.round_number}: {round.mode}{" "}
                                    Assessment
                                  </h4>
                                  <span
                                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
                                      round.status === "completed"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                    }`}
                                  >
                                    {round.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                  Execution Date:{" "}
                                  {new Date(
                                    round.interview_date,
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* DYNAMIC CONTENT BOX */}
                            {round.review ? (
                              <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-100/50">
                                <div className="grid md:grid-cols-12">
                                  {/* LEFT PANEL: DECISION & SCORE */}
                                  <div className="md:col-span-4 p-6 bg-slate-50/50 border-r border-slate-50 flex flex-col justify-between gap-8">
                                    <div>
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">
                                        System Verdict
                                      </span>
                                      <div
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-tighter ${
                                          [
                                            "hire",
                                            "pass",
                                            "strong pass",
                                          ].includes(
                                            round.review.decision?.toLowerCase(),
                                          )
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                                            : "bg-rose-500 text-white shadow-lg shadow-rose-100"
                                        }`}
                                      >
                                        {/* Dynamic Icon Logic */}
                                        {[
                                          "hire",
                                          "pass",
                                          "strong pass",
                                        ].includes(
                                          round.review.decision?.toLowerCase(),
                                        ) ? (
                                          <ShieldCheck
                                            size={14}
                                            className={
                                              round.review.decision?.toLowerCase() ===
                                              "strong pass"
                                                ? "animate-pulse"
                                                : ""
                                            }
                                          />
                                        ) : (
                                          <Activity size={14} />
                                        )}

                                        {/* Label Display */}
                                        {round.review.decision}
                                      </div>
                                    </div>

                                    <div>
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
                                        Weighted Performance
                                      </span>
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                          {round.review.total_score
                                            ? Math.round(
                                                round.review.total_score * 10,
                                              )
                                            : 0}
                                        </span>
                                        <span className="text-slate-300 font-bold text-sm">
                                          /100
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* RIGHT PANEL: METRICS & REMARKS */}
                                  <div className="md:col-span-8 p-6 space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                      {[
                                        {
                                          l: "Technical",
                                          v: round.review.technical_skill,
                                        },
                                        {
                                          l: "Linguistics",
                                          v: round.review.communication,
                                        },
                                        {
                                          l: "Cognition",
                                          v: round.review.problem_solving,
                                        },
                                        {
                                          l: "Cultural",
                                          v: round.review.cultural_fit,
                                        },
                                        {
                                          l: "Domain Exp",
                                          v: round.review.relevant_experience,
                                        },
                                      ].map((stat, i) => (
                                        <div key={i} className="space-y-1.5">
                                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {stat.l}
                                          </p>
                                          <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">
                                              {[...Array(5)].map((_, star) => (
                                                <div
                                                  key={star}
                                                  className={`w-1.5 h-3 rounded-full ${star < stat.v ? "bg-blue-600" : "bg-slate-100"}`}
                                                />
                                              ))}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900">
                                              {stat.v}/10
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {round.review.remarks && (
                                      <div className="pt-4 border-t border-slate-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                          Executive Summary
                                        </p>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100/50 italic">
                                          "{round.review.remarks}"
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                  Interview Pending
                                </p>
                                <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
                                  Awaiting Post-Round Analytical Input
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- FOOTER ACTIONS (Refined Padding) --- */}
            <div className="px-10 py-8 bg-slate-50/80 border-t border-slate-100 flex justify-end items-center gap-6">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default HRGovernanceDashboard;
//*************************************************working code phase 1 11/02/26******************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Users,
//   ShieldCheck,
//   Briefcase,
//   Zap,
//   Search,
//   Filter,
//   ArrowUpRight,
//   Plus,
//   Lock,
//   FileText,
//   Activity,
//   Clock,
//   CheckCircle2,
//   Database,
//   User,
//   Phone,
//   ChevronDown,
//   X,
//   Layers,
//   XCircle,
//   Timer,
//   Mail,
//   Award,
//   UserPlus,
//   LogOut,
//   ShieldAlert,
//   Fingerprint,
//   CreditCard,
//   Landmark,
//   PenTool,
//   Video,
//   MapPin,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates");
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [decisionFilter, setDecisionFilter] = useState("All");
//   const navigate = useNavigate();

//   // debounced search
//   const debouncedSearch = useDebounce(searchText, 1000);

//   useEffect(() => {
//     if (activeTab === "candidates") {
//       fetchDashboardStats();
//     } else if (activeTab === "employees") {
//       fetchEmployeeStats();
//     }
//   }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   const buildFilters = (extra = {}) => {
//     const filters = {};

//     if (extra.type) filters.type = extra.type;

//     // ONLY send range if not ALL
//     if (timeRange && timeRange !== "All") {
//       filters.range = timeRange;
//     }

//     // if (searchText) filters.search = searchText;

//     if (debouncedSearch) filters.search = debouncedSearch;

//     if (statusFilter !== "All") {
//       filters.status = statusFilter.toLowerCase();
//     }

//     if (extra.location) filters.location = extra.location;

//     return filters;
//   };

//   // const fetchDashboardStats = async () => {
//   //   try {
//   //     setLoading(true);

//   //     const filters = buildFilters();

//   //     const data = await dashboardService.getCandidateStats(filters);

//   //     setApiStats(data);
//   //   } catch (err) {
//   //     console.error("Dashboard API Error:", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const fetchDashboardStats = async () => {
//   try {
//     setLoading(true);
//     const start = Date.now();

//     const filters = buildFilters();
//     const data = await dashboardService.getCandidateStats(filters);

//     const elapsed = Date.now() - start;
//     if (elapsed < 400) {
//       await new Promise((r) => setTimeout(r, 400 - elapsed));
//     }

//     setApiStats(data);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };

//   const fetchEmployeeStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();
//       const data = await dashboardService.getEmployeeStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Employee Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // Map interviews by date (YYYY-MM-DD)
//   const interviewDateMap = useMemo(() => {
//     const map = {};

//     interviewReviews.forEach((candidate) => {
//       candidate.interviews?.forEach((round) => {
//         if (!round.interview_date) return;

//         const dt = new Date(round.interview_date);
//         const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

//         if (!map[d]) map[d] = [];

//         map[d].push({
//           id: candidate.id,
//           name: candidate.full_name,
//           round: round.round_number,
//           status: round.status, // completed / scheduled
//           mode: round.mode,
//           time: new Date(round.interview_date).toLocaleTimeString(),
//         });
//       });
//     });

//     return map;
//   }, [interviewReviews]);

//   const employeeJoinDateMap = useMemo(() => {
//     if (activeTab !== "employees") return {};

//     const map = {};
//     const employees = apiStats?.recent_joiners ?? [];

//     employees.forEach((emp) => {
//       if (!emp.joining_date) return;

//       const dt = new Date(emp.joining_date);
//       const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

//       if (!map[d]) map[d] = [];

//       map[d].push({
//         id: emp.id,
//         name: emp.full_name,
//         role: emp.role,
//         status: emp.joining_attendance_status, // joined / pending / no_show
//         docStatus: emp.doc_submission_status,
//         date: emp.joining_date,
//       });
//     });

//     return map;
//   }, [apiStats, activeTab]);

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       {
//         id: "total",
//         label: "Total Candidates",
//         type: "all",
//         val: apiStats?.total_candidates ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "interviewing",
//         label: "Interviewing",
//         type: "interviewing",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "interviewing")
//             ?.count ?? 0,
//         icon: <Video size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       {
//         id: "migrated",
//         label: "Migrated",
//         type: "migrated",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "migrated")
//             ?.count ?? 0,
//         icon: <CheckCircle2 size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "manual",
//         label: "Manual Entry",
//         type: "manual",
//         val:
//           apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
//             ?.count ?? 0,
//         icon: <Database size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//     ],
    
//     employees: [
//       {
//         id: "total_employees",
//         label: "Total Employees",
//         type: "all",
//         val: apiStats?.total_employees ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "active_employees",
//         label: "Active Employees",
//         type: "active",
//         val: apiStats?.active_employees ?? 0,
//         icon: <ShieldCheck size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "on_probation",
//         label: "On Probation",
//         type: "on_probation",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "on_probation")
//             ?.count ?? 0,
//         icon: <ShieldAlert size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//       {
//         id: "departments",
//         label: "Departments",
//         type: "department",
//         val: apiStats?.department_distribution?.length ?? 0,
//         icon: <Landmark size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
    
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         const matchSearch =
//           !debouncedSearch ||
//           item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());

//         // API status filter (existing)
//         const matchStatus =
//           statusFilter === "All" || item.status === statusFilter.toLowerCase();

//         // 🎯 Decision filter (from review)
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision; // pass / reject / strong_pass
//         }

//         const matchDecision =
//           decisionFilter === "All" || decision === decisionFilter;

//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         const score = lastInterview?.review?.total_score
//           ? Math.round(lastInterview.review.total_score * 10)
//           : null;

//         const decision = lastInterview?.review?.decision;

//         let statusLabel = "In Progress";
//         if (decision === "strong_pass") statusLabel = "Strong Pass";
//         else if (decision === "pass") statusLabel = "Pass";
//         else if (decision === "reject") statusLabel = "Reject";

//         return {
//           id: item.id,
//           name: item.full_name,
//           status: statusLabel,
//           score,
//           stars: Math.round((score || 0) / 20),
//           date: new Date(item.updated_at).toLocaleDateString(),
//         };
//       });
//   }, [interviewReviews, debouncedSearch, statusFilter, decisionFilter]);

//   const filteredEmployees = useMemo(() => {
//     const list = apiStats?.recent_joiners ?? [];

//     return list.filter((emp) => {
//       if (!debouncedSearch) return true;

//       return (
//         emp.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         emp.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         emp.role?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         emp.department_name
//           ?.toLowerCase()
//           .includes(debouncedSearch.toLowerCase())
//       );
//     });
//   }, [apiStats, debouncedSearch]);

//   const interviewStatusMeta = {
//     completed: {
//       color: "bg-emerald-500",
//       text: "Completed",
//     },
//     scheduled: {
//       color: "bg-amber-500",
//       text: "Scheduled",
//     },
//     cancelled: {
//       color: "bg-rose-500",
//       text: "Cancelled",
//     },
//     pending: {
//       color: "bg-blue-500",
//       text: "Pending",
//     },
//   };

//   const employeeStatusMeta = {
//     joined: {
//       color: "bg-emerald-500",
//       text: "Joined",
//     },
//     pending: {
//       color: "bg-amber-500",
//       text: "Pending",
//     },
//     no_show: {
//       color: "bg-rose-500",
//       text: "No Show",
//     },
//   };
  

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Core Terminal
//             </span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === "candidates"
//               ? "Talent Acquisition"
//               : "Employee Governance"}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {["All", "Today", "Week", "Monthly"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range
//                     ? "bg-slate-900 text-white shadow-md"
//                     : "text-slate-400 hover:bg-slate-100"
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           {
//             id: "candidates",
//             label: "Candidates",
//             icon: <UserPlus size={16} />,
//           },
//           {
//             id: "employees",
//             label: "Employees",
//             icon: <Briefcase size={16} />,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => {
//               setActiveTab(tab.id);
//               setActiveView("dashboard");
//             }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id
//                 ? "text-blue-600"
//                 : "text-slate-400 hover:text-slate-600"
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && (
//               <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {activeView === "dashboard" ? (
//         <div className="grid grid-cols-12 gap-8">
//           {/* --- KPI CARDS --- */}

//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {loading ? (
//               <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//                 Loading dashboard...
//               </div>
//             ) : (
//               stats[activeTab].map((stat) => (
//                 <div
//                   key={stat.id}
                  
//                   onClick={() => {
//                     if (activeTab === "candidates") {
//                       navigate(`/dashboard/candidate-table?type=${stat.type}`);
//                     } else {
//                       navigate(`/dashboard/employee-table?type=${stat.type}`);
//                     }
//                   }}
//                   className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                 >
//                   <div
//                     className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                   >
//                     {stat.icon}
//                     {console.log("new data show in code", stat)}
//                   </div>

//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     {stat.label}
//                   </p>

//                   <h2 className="text-2xl font-black text-slate-900">
//                     {stat.val}
//                   </h2>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" />
//                 {activeTab === "candidates"
//                   ? "Interview Performance Review"
//                   : "Employee Performance Overview"}
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}

//               <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50/50 p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
//                 {/* SEARCH NODE - Primary Action */}
//                 <div className="relative flex-[2] min-w-[300px] group">
//                   <Search
//                     size={15}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search by candidate, email or role..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="w-full h-11 pl-11 pr-4 text-[13px] font-medium bg-white rounded-[18px] border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-slate-400"
//                   />
//                 </div>

//                 {/* DECISION FILTER - Secondary Utility */}
               
//                 {/* DECISION FILTER - Only for Candidates */}
//                 {activeTab === "candidates" && (
//                   <div className="relative group min-w-[180px]">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
//                       <Filter size={13} />
//                     </div>

//                     <select
//                       value={decisionFilter}
//                       onChange={(e) => setDecisionFilter(e.target.value)}
//                       className="appearance-none w-full h-11 pl-10 pr-10 text-[11px] font-black uppercase tracking-[0.1em] bg-white rounded-[18px] border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer transition-all shadow-sm shadow-slate-100/20"
//                     >
//                       <option value="All">All Decisions</option>
//                       <option value="strong_pass">Strong Pass</option>
//                       <option value="pass">Pass</option>
//                       <option value="reject">Reject</option>
//                       <option value="in_progress">In Progress</option>
//                     </select>

//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                       <ChevronDown size={14} />
//                     </div>
//                   </div>
//                 )}

//                 {/* CLEAR ACTION - Refined for visual alignment */}
//                 {(searchText ||
//                   (activeTab === "candidates" && decisionFilter !== "All")) && (
//                   <button
//                     onClick={() => {
//                       setSearchText("");
//                       setDecisionFilter("All");
//                     }}
//                     className="h-11 px-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-[18px] transition-all border border-transparent hover:border-rose-100 active:scale-95"
//                   >
//                     <span className="mr-2">✕</span> Reset
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-4">
                
//                 {activeTab === "candidates" && (
//                   <>
//                     {filteredInterviewReviews.map((review) => {
//                       const fullCandidate = interviewReviews.find(
//                         (c) => c.id === review.id,
//                       );

//                       return (
//                         <div
//                           key={review.id}
//                           onClick={() => setSelectedCandidate(fullCandidate)}
//                           className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//                         >
//                           <div className="flex items-center gap-4">
//                             <div
//                               className={`p-3 rounded-2xl ${
//                                 review.status === "Reject"
//                                   ? "bg-rose-100 text-rose-600"
//                                   : review.status === "Strong Pass"
//                                     ? "bg-emerald-100 text-emerald-600"
//                                     : "bg-blue-100 text-blue-600"
//                               }`}
//                             >
//                               {review.status === "Reject" ? (
//                                 <ThumbsDown size={18} />
//                               ) : (
//                                 <ThumbsUp size={18} />
//                               )}
//                             </div>

//                             <div>
//                               <h4 className="text-sm font-black text-slate-900">
//                                 {review.name}
//                               </h4>

//                               <div className="flex items-center gap-2 mt-1">
//                                 <span
//                                   className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                                     review.status === "Reject"
//                                       ? "bg-rose-200 text-rose-700"
//                                       : review.status === "Strong Pass"
//                                         ? "bg-emerald-200 text-emerald-700"
//                                         : "bg-blue-200 text-blue-700"
//                                   }`}
//                                 >
//                                   {review.status}
//                                 </span>

//                                 <span className="text-[9px] font-bold text-slate-400 uppercase">
//                                   {review.date}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {(review.status === "Pass" ||
//                             review.status === "Strong Pass") && (
//                             <div className="flex items-center gap-8">
//                               <div className="hidden md:flex flex-col items-end">
//                                 <div className="flex gap-0.5 mb-1">
//                                   {[...Array(5)].map((_, i) => (
//                                     <Star
//                                       key={i}
//                                       size={12}
//                                       className={
//                                         i < review.stars
//                                           ? "fill-amber-400 text-amber-400"
//                                           : "text-slate-200"
//                                       }
//                                     />
//                                   ))}
//                                 </div>

//                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                                   Feedback Rating
//                                 </p>
//                               </div>

//                               <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                                 <p className="text-[8px] font-black text-slate-400 uppercase">
//                                   Score
//                                 </p>

//                                 <p className="text-lg font-black text-blue-600">
//                                   {review.score ?? 0}
//                                   <span className="text-[10px] text-slate-300">
//                                     /100
//                                   </span>
//                                 </p>
//                               </div>
//                             </div>
//                           )}

//                           {review.status === "Reject" && (
//                             <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                               Profile Archived
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </>
//                 )}

//                 {/* ================= EMPLOYEE LIST ================= */}
//                 {activeTab === "employees" &&
//                   filteredEmployees.map((emp) => (
//                     <div
//                       key={emp.id}
//                       className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all"
//                     >
//                       <div>
//                         <h4 className="text-sm font-black text-slate-900">
//                           {emp.full_name}
//                         </h4>

//                         <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
//                           <span>Role • {emp.role || "-"}</span>
//                           <span>Dept • {emp.department_name || "-"}</span>
//                         </div>

//                         <div className="text-[9px] text-slate-400 mt-1">
//                           Joined •{" "}
//                           {emp.joining_date
//                             ? new Date(emp.joining_date).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "short",
//                                   year: "numeric",
//                                 },
//                               )
//                             : "-"}
//                         </div>
//                       </div>

//                       <span
//                         className={`px-3 py-1 text-xs rounded-full font-bold ${
//                           emp.status === "active"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : emp.status === "on_probation"
//                               ? "bg-amber-100 text-amber-700"
//                               : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {emp.status}
//                       </span>
//                     </div>
//                   ))}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             {/* <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview
//                 Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true },
//                 ].map((box, i) => (
//                   <div
//                     key={i}
//                     className={`p-4 rounded-3xl border ${box.red ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
//                   >
//                     <p className="text-[9px] font-black text-slate-400 uppercase">
//                       {box.label}
//                     </p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
//                       {box.sub}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div> */}
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
//                 Calendar
//               </h4>

//               {/* Calendar */}

//               <Calendar
//                 value={calendarDate}
//                 onChange={setCalendarDate}
//                 tileContent={({ date, view }) => {
//                   if (view !== "month") return null;

//                   const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//                   const interviewList = interviewDateMap[d];
//                   const employeeList = employeeJoinDateMap[d];

//                   if (!interviewList && !employeeList) return null;

//                   return (
//                     <div className="flex justify-center mt-1 gap-1 flex-wrap">
//                       {/* Interview dots */}
//                       {interviewList?.slice(0, 2).map((item, i) => (
//                         <span
//                           key={`i-${i}`}
//                           className={`w-1.5 h-1.5 rounded-full ${
//                             interviewStatusMeta[item.status]?.color ||
//                             "bg-slate-400"
//                           }`}
//                         />
//                       ))}

//                       {/* Employee joining dots */}
//                       {employeeList?.slice(0, 2).map((emp, i) => (
//                         <span
//                           key={`e-${i}`}
//                           className={`w-1.5 h-1.5 rounded-full ${
//                             employeeStatusMeta[emp.status]?.color ||
//                             "bg-blue-400"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   );
//                 }}
//               />

//               {/* Selected Day Interviews */}

//               {/* <div className="mt-4 max-h-56 overflow-auto space-y-2">
//                 {(() => {
//                   const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;

//                   const interviewList = interviewDateMap[d] ?? [];
//                   const employeeList = employeeJoinDateMap[d] ?? [];

//                   if (interviewList.length === 0 && employeeList.length === 0)
//                     return (
//                       <div className="text-xs text-slate-400">
//                         No activity for this date
//                       </div>
//                     );

//                   return (
//                     <>
                  
//                       {interviewList.map((item, i) => (
//                         <div
//                           key={`int-${i}`}
//                           className="p-3 border rounded-xl bg-slate-50"
//                         >
//                           <div className="text-xs font-bold">{item.name}</div>
//                           <div className="text-[10px] text-slate-500">
//                             Interview • Round {item.round}
//                           </div>
//                         </div>
//                       ))}

                    
//                       {employeeList.map((emp, i) => (
//                         <div
//                           key={`emp-${i}`}
//                           className="p-3 border rounded-xl bg-blue-50"
//                         >
//                           <div className="text-xs font-bold">{emp.name}</div>
//                           <div className="text-[10px] text-slate-500">
//                             Employee Joining • {emp.role}
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   );
//                 })()}
//               </div> */}


//               <div className="mt-8">
//   {/* SECTION HEADER */}
//   <div className="flex items-center justify-between mb-4 px-1">
//     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//       Day Schedule
//     </span>
//     <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//       {calendarDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
//     </span>
//   </div>

//   {/* SCROLLABLE FEED CONTAINER */}
//   <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
//     {(() => {
//       const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;

//       const interviewList = interviewDateMap[d] ?? [];
//       const employeeList = employeeJoinDateMap[d] ?? [];

//       if (interviewList.length === 0 && employeeList.length === 0)
//         return (
//           <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-[24px] bg-slate-50/30">
//             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//               No tactical events found
//             </p>
//           </div>
//         );

//       return (
//         <div className="space-y-4">
//           {/* INTERVIEW SEGMENT */}
//           {interviewList.map((item, i) => (
//             <div
//               key={`int-${i}`}
//               className="group relative pl-5 py-1 transition-all hover:translate-x-1"
//             >
//               {/* VERTICAL INTENT LINE */}
//               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
              
//               {/* <div className="flex flex-col gap-0.5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[12px] font-black text-slate-900 leading-none">
//                     {item.name}
//                   </span>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
//                     Round {item.round}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Candidate Interview Assessment
//                   </span>
//                 </div>
//               </div> */}
//               <div className="flex items-center justify-between group">
//   {/* NAME & PRIMARY IDENTITY */}
//   <div className="flex flex-col gap-1">
//     <span className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
//       {item.name}
//     </span>
//     {/* ROUND CONTEXT - Minimalist Sub-Label */}
//     <div className="flex items-center gap-1.5">
//       <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
//         Assessment Phase
//       </span>
//       <span className="w-1 h-1 rounded-full bg-slate-200" />
//       <span className="text-[10px] font-bold text-slate-600">
//         Round {item.round}
//       </span>
//     </div>
//   </div>

//   {/* STATUS INDICATOR - Enterprise Style */}
//   <div className="flex items-center">
//     <div
//       className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all shadow-sm
//         ${
//           item.status === "completed"
//             ? "bg-emerald-50/50 border-emerald-100/60 text-emerald-700"
//             : item.status === "scheduled"
//             ? "bg-amber-50/50 border-amber-100/60 text-amber-700"
//             : item.status === "cancelled"
//             ? "bg-rose-50/50 border-rose-100/60 text-rose-700"
//             : "bg-slate-50 border-slate-200 text-slate-600"
//         }`}
//     >
//       {/* GLOWING STATUS DOT */}
//       <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.1)] 
//         ${
//           item.status === "completed" ? "bg-emerald-500" : 
//           item.status === "scheduled" ? "bg-amber-500" : 
//           item.status === "cancelled" ? "bg-rose-500" : "bg-slate-400"
//         }`} 
//       />
      
//       <span className="text-[10px] font-black uppercase tracking-tight">
//         {item.status}
//       </span>
//     </div>
//   </div>
// </div>
//             </div>
//           ))}

//           {/* JOINING SEGMENT */}
//           {employeeList.map((emp, i) => (
//             <div
//               key={`emp-${i}`}
//               className="group relative pl-5 py-1 transition-all hover:translate-x-1"
//             >
//               {/* VERTICAL INTENT LINE */}
//               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              
//               <div className="flex flex-col gap-0.5">
//                 {/* <div className="flex items-center justify-between">
//                   <span className="text-[12px] font-black text-slate-900 leading-none">
//                     {emp.name}
//                   </span>
//                   <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">
//                     Onboarding
//                   </span>
//                 </div> */}
//                 <div className="flex items-center justify-between">
//   <span className="text-[12px] font-black text-slate-900 leading-none">
//     {emp.name}
//   </span>

//   {/* STATUS BADGE */}
//   <span
//     className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter
//       ${
//         emp.status === "joined"
//           ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
//           : emp.status === "pending"
//           ? "text-amber-700 bg-amber-50 border border-amber-100"
//           : emp.status === "no_show"
//           ? "text-rose-700 bg-rose-50 border border-rose-100"
//           : "text-slate-600 bg-slate-100"
//       }`}
//   >
//     {emp.status === "joined"
//       ? "Joined"
//       : emp.status === "pending"
//       ? "Pending"
//       : emp.status === "no_show"
//       ? "No Show"
//       : emp.status}
//   </span>
// </div>

//                 <div className="flex items-center gap-1.5">
//                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     {emp.role} • Employee Activation
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     })()}
//   </div>
// </div>
//             </div>

//             {/* <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">
//                 eSign Status Workflow
//               </h4>
//               <div className="space-y-4">
//                 {["Document Uploaded", "Pending Signature", "Signed"].map(
//                   (status, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                         <span>{status}</span>
//                         <span>{Math.floor(Math.random() * 100)}%</span>
//                       </div>
//                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                         <div
//                           className="bg-blue-600 h-full"
//                           style={{ width: `${Math.random() * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div> */}
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//             <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//             <button
//               onClick={() => setActiveView("dashboard")}
//               className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <div className="p-10">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                 <div>
//                   <p className="text-sm font-black">Rajesh Kumar</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">
//                     Aadhaar: Verified | eSign: Pending | Interview: Online
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Attended
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Doc Uploaded
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//           {/* Increased max-width to 4xl for better data spacing */}
//           <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
//             {/* --- ENTERPRISE HEADER (Enhanced Padding) --- */}
//             <div className="px-10 py-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
//               <div className="flex gap-6">
//                 <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 flex-shrink-0">
//                   <User size={32} />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3">
//                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
//                       {selectedCandidate.full_name}
//                     </h2>
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-100">
//                       {selectedCandidate.position || "Candidate"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-5">
//                     <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                       <Mail size={15} className="text-slate-300" />{" "}
//                       {selectedCandidate.email}
//                     </p>
//                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
//                     <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                       <Phone size={15} className="text-slate-300" />{" "}
//                       {selectedCandidate.phone || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* --- MODAL BODY (Deep Vertical Spacing) --- */}
//             <div className="px-10 py-10 space-y-12 overflow-y-auto custom-scrollbar flex-1">
//               {/* DATA MATRIX SECTION */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
//                 {[
//                   {
//                     label: "System Status",
//                     value: selectedCandidate.status,
//                     icon: Activity,
//                     color: "text-emerald-500",
//                   },
//                   {
//                     label: "Seniority/Exp",
//                     value: selectedCandidate.experience || "N/A",
//                     icon: Layers,
//                     color: "text-blue-500",
//                   },
//                   {
//                     label: "Current Location",
//                     value: selectedCandidate.location || "Remote",
//                     icon: MapPin,
//                     color: "text-rose-500",
//                   },
//                   {
//                     label: "Ingestion Node",
//                     value: selectedCandidate.entry_method,
//                     icon: ArrowUpRight,
//                     color: "text-amber-500",
//                   },
//                   {
//                     label: "Record Created",
//                     value: selectedCandidate.created_at
//                       ? new Date(
//                           selectedCandidate.created_at,
//                         ).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : "-",
//                     icon: null,
//                     color: "text-slate-500",
//                   },
//                 ].map((item, idx) => (
//                   <div key={idx} className="space-y-2">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5">
//                       {item.icon && (
//                         <item.icon size={14} className={item.color} />
//                       )}
//                       {item.label}
//                     </p>
//                     <p className="text-base font-bold text-slate-800 capitalize">
//                       {item.value}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

//               {/* ASSESSMENT SECTION */}
//               <div className="space-y-12">
//                 {/* SECTION HEADER: HIGH-DENSITY */}
//                 <div className="flex items-end justify-between border-b border-slate-100 pb-6">
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-2">
//                       <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
//                         <ShieldCheck size={16} className="text-white" />
//                       </div>
//                       <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">
//                         Assessment Pipeline
//                       </h3>
//                     </div>
//                     <p className="text-xs text-slate-400 font-medium">
//                       Technical evaluation ledger and decision history.
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1">
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Efficiency Rating
//                     </span>
//                     <span className="text-sm font-black text-blue-600 tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
//                       {selectedCandidate.interviews?.length || 0} Phases Cleared
//                     </span>
//                   </div>
//                 </div>

//                 {/* TIMELINE ARCHITECTURE */}
//                 {!selectedCandidate.interviews ||
//                 selectedCandidate.interviews.length === 0 ? (
//                   <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
//                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
//                       <Activity size={24} />
//                     </div>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
//                       No Assessment Data Found
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     {/* THE CENTRAL PIPELINE THREAD */}
//                     <div className="absolute left-[20px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-slate-200 to-transparent hidden md:block" />

//                     <div className="space-y-12">
//                       {selectedCandidate.interviews.map((round, idx) => (
//                         <div
//                           key={round.id}
//                           className="relative pl-0 md:pl-14 group transition-all"
//                         >
//                           {/* TIMELINE NODE */}
//                           <div className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full bg-white border-2 border-slate-100 items-center justify-center z-10 group-hover:border-blue-500 transition-colors shadow-sm">
//                             <span className="text-[10px] font-black text-slate-900">
//                               {round.round_number}
//                             </span>
//                           </div>

//                           <div className="flex flex-col gap-6">
//                             {/* ROUND METADATA */}
//                             <div className="flex flex-wrap items-center justify-between gap-4">
//                               <div>
//                                 <div className="flex items-center gap-3 mb-1">
//                                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                     Phase {round.round_number}: {round.mode}{" "}
//                                     Assessment
//                                   </h4>
//                                   <span
//                                     className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
//                                       round.status === "completed"
//                                         ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                         : "bg-slate-50 text-slate-400 border-slate-100"
//                                     }`}
//                                   >
//                                     {round.status}
//                                   </span>
//                                 </div>
//                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//                                   Execution Date:{" "}
//                                   {new Date(
//                                     round.interview_date,
//                                   ).toLocaleDateString("en-US", {
//                                     month: "long",
//                                     day: "numeric",
//                                     year: "numeric",
//                                   })}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* DYNAMIC CONTENT BOX */}
//                             {round.review ? (
//                               <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-100/50">
//                                 <div className="grid md:grid-cols-12">
//                                   {/* LEFT PANEL: DECISION & SCORE */}
//                                   <div className="md:col-span-4 p-6 bg-slate-50/50 border-r border-slate-50 flex flex-col justify-between gap-8">
//                                     <div>
//                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">
//                                         System Verdict
//                                       </span>
//                                       <div
//                                         className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-tighter ${
//                                           [
//                                             "hire",
//                                             "pass",
//                                             "strong pass",
//                                           ].includes(
//                                             round.review.decision?.toLowerCase(),
//                                           )
//                                             ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
//                                             : "bg-rose-500 text-white shadow-lg shadow-rose-100"
//                                         }`}
//                                       >
//                                         {/* Dynamic Icon Logic */}
//                                         {[
//                                           "hire",
//                                           "pass",
//                                           "strong pass",
//                                         ].includes(
//                                           round.review.decision?.toLowerCase(),
//                                         ) ? (
//                                           <ShieldCheck
//                                             size={14}
//                                             className={
//                                               round.review.decision?.toLowerCase() ===
//                                               "strong pass"
//                                                 ? "animate-pulse"
//                                                 : ""
//                                             }
//                                           />
//                                         ) : (
//                                           <Activity size={14} />
//                                         )}

//                                         {/* Label Display */}
//                                         {round.review.decision}
//                                       </div>
//                                     </div>

//                                     <div>
//                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
//                                         Weighted Performance
//                                       </span>
//                                       <div className="flex items-baseline gap-1">
//                                         <span className="text-4xl font-black text-slate-900 tracking-tighter">
//                                           {round.review.total_score
//                                             ? Math.round(
//                                                 round.review.total_score * 10,
//                                               )
//                                             : 0}
//                                         </span>
//                                         <span className="text-slate-300 font-bold text-sm">
//                                           /100
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {/* RIGHT PANEL: METRICS & REMARKS */}
//                                   <div className="md:col-span-8 p-6 space-y-6">
//                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
//                                       {[
//                                         {
//                                           l: "Technical",
//                                           v: round.review.technical_skill,
//                                         },
//                                         {
//                                           l: "Linguistics",
//                                           v: round.review.communication,
//                                         },
//                                         {
//                                           l: "Cognition",
//                                           v: round.review.problem_solving,
//                                         },
//                                         {
//                                           l: "Cultural",
//                                           v: round.review.cultural_fit,
//                                         },
//                                         {
//                                           l: "Domain Exp",
//                                           v: round.review.relevant_experience,
//                                         },
//                                       ].map((stat, i) => (
//                                         <div key={i} className="space-y-1.5">
//                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                             {stat.l}
//                                           </p>
//                                           <div className="flex items-center gap-2">
//                                             <div className="flex gap-0.5">
//                                               {[...Array(5)].map((_, star) => (
//                                                 <div
//                                                   key={star}
//                                                   className={`w-1.5 h-3 rounded-full ${star < stat.v ? "bg-blue-600" : "bg-slate-100"}`}
//                                                 />
//                                               ))}
//                                             </div>
//                                             <span className="text-[10px] font-black text-slate-900">
//                                               {stat.v}/10
//                                             </span>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>

//                                     {round.review.remarks && (
//                                       <div className="pt-4 border-t border-slate-50">
//                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
//                                           Executive Summary
//                                         </p>
//                                         <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100/50 italic">
//                                           "{round.review.remarks}"
//                                         </p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
//                                 <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin mb-3" />
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                                   Interview Pending
//                                 </p>
//                                 <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
//                                   Awaiting Post-Round Analytical Input
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* --- FOOTER ACTIONS (Refined Padding) --- */}
//             <div className="px-10 py-8 bg-slate-50/80 border-t border-slate-100 flex justify-end items-center gap-6">
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//******************************************************working code phase 12 9/02/26********************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Users,
//   ShieldCheck,
//   Briefcase,
//   Zap,
//   Search,
//   Filter,
//   ArrowUpRight,
//   Plus,
//   Lock,
//   FileText,
//   Activity,
//   Clock,
//   CheckCircle2,
//   Database,
//   User,
//   Phone,
//   ChevronDown,
//   X,
//   Layers,
//   XCircle,
//   Timer,
//   Mail,
//   Award,
//   UserPlus,
//   LogOut,
//   ShieldAlert,
//   Fingerprint,
//   CreditCard,
//   Landmark,
//   PenTool,
//   Video,
//   MapPin,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates");
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [decisionFilter, setDecisionFilter] = useState("All");
//   const navigate = useNavigate();

//   // debounced search
//   const debouncedSearch = useDebounce(searchText, 1000);

//   // useEffect(() => {
//   //   if (activeTab === "candidates") {
//   //     fetchDashboardStats();
//   //   }
//   // }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   useEffect(() => {
//     if (activeTab === "candidates") {
//       fetchDashboardStats();
//     } else if (activeTab === "employees") {
//       fetchEmployeeStats();
//     }
//   }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   const buildFilters = (extra = {}) => {
//     const filters = {};

//     if (extra.type) filters.type = extra.type;

//     // ONLY send range if not ALL
//     if (timeRange && timeRange !== "All") {
//       filters.range = timeRange;
//     }

//     // if (searchText) filters.search = searchText;

//     if (debouncedSearch) filters.search = debouncedSearch;

//     if (statusFilter !== "All") {
//       filters.status = statusFilter.toLowerCase();
//     }

//     if (extra.location) filters.location = extra.location;

//     return filters;
//   };

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();

//       const data = await dashboardService.getCandidateStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEmployeeStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();
//       const data = await dashboardService.getEmployeeStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Employee Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // Map interviews by date (YYYY-MM-DD)
//   const interviewDateMap = useMemo(() => {
//     const map = {};

//     interviewReviews.forEach((candidate) => {
//       candidate.interviews?.forEach((round) => {
//         if (!round.interview_date) return;

//         const dt = new Date(round.interview_date);
//         const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

//         if (!map[d]) map[d] = [];

//         map[d].push({
//           id: candidate.id,
//           name: candidate.full_name,
//           round: round.round_number,
//           status: round.status, // completed / scheduled
//           mode: round.mode,
//           time: new Date(round.interview_date).toLocaleTimeString(),
//         });
//       });
//     });

//     return map;
//   }, [interviewReviews]);

//   const employeeJoinDateMap = useMemo(() => {
//     if (activeTab !== "employees") return {};

//     const map = {};
//     const employees = apiStats?.recent_joiners ?? [];

//     employees.forEach((emp) => {
//       if (!emp.joining_date) return;

//       const dt = new Date(emp.joining_date);
//       const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

//       if (!map[d]) map[d] = [];

//       map[d].push({
//         id: emp.id,
//         name: emp.full_name,
//         role: emp.role,
//         status: emp.joining_attendance_status, // joined / pending / no_show
//         docStatus: emp.doc_submission_status,
//         date: emp.joining_date,
//       });
//     });

//     return map;
//   }, [apiStats, activeTab]);

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       {
//         id: "total",
//         label: "Total Candidates",
//         type: "all",
//         val: apiStats?.total_candidates ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "interviewing",
//         label: "Interviewing",
//         type: "interviewing",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "interviewing")
//             ?.count ?? 0,
//         icon: <Video size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       {
//         id: "migrated",
//         label: "Migrated",
//         type: "migrated",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "migrated")
//             ?.count ?? 0,
//         icon: <CheckCircle2 size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "manual",
//         label: "Manual Entry",
//         type: "manual",
//         val:
//           apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
//             ?.count ?? 0,
//         icon: <Database size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//     ],
//     // employees: [
//     //   {
//     //     id: "kyc_pending",
//     //     label: "KYC Pending",
//     //     val: "14",
//     //     icon: <Fingerprint size={20} />,
//     //     color: "text-rose-600",
//     //     bg: "bg-rose-50",
//     //   },
//     //   {
//     //     id: "esign",
//     //     label: "eSign Done",
//     //     val: "112",
//     //     icon: <PenTool size={20} />,
//     //     color: "text-emerald-600",
//     //     bg: "bg-emerald-50",
//     //   },
//     //   {
//     //     id: "probation",
//     //     label: "On Probation",
//     //     val: "84",
//     //     icon: <ShieldAlert size={20} />,
//     //     color: "text-orange-600",
//     //     bg: "bg-orange-50",
//     //   },
//     //   {
//     //     id: "active",
//     //     label: "Active Staff",
//     //     val: "1.2k",
//     //     icon: <ShieldCheck size={20} />,
//     //     color: "text-blue-600",
//     //     bg: "bg-blue-50",
//     //   },
//     // ],
//     employees: [
//       {
//         id: "total_employees",
//         label: "Total Employees",
//         type: "all",
//         val: apiStats?.total_employees ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "active_employees",
//         label: "Active Employees",
//         type: "active",
//         val: apiStats?.active_employees ?? 0,
//         icon: <ShieldCheck size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "on_probation",
//         label: "On Probation",
//         type: "on_probation",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "on_probation")
//             ?.count ?? 0,
//         icon: <ShieldAlert size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//       {
//         id: "departments",
//         label: "Departments",
//         type: "department",
//         val: apiStats?.department_distribution?.length ?? 0,
//         icon: <Landmark size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       // {
//       //   id: "roles",
//       //   label: "Roles",
//       //   type: "role",
//       //   val: apiStats?.role_distribution?.length ?? 0,
//       //   icon: <Briefcase size={20} />,
//       //   color: "text-purple-600",
//       //   bg: "bg-purple-50",
//       // },
//       // {
//       //   id: "recent_joiners",
//       //   label: "Recent Joiners",
//       //   type: "recent",
//       //   val: apiStats?.recent_joiners?.length ?? 0,
//       //   icon: <UserPlus size={20} />,
//       //   color: "text-pink-600",
//       //   bg: "bg-pink-50",
//       // },
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         // 🔎 Debounced Search
//         // const matchSearch = item.full_name
//         //   ?.toLowerCase()
//         //   .includes(debouncedSearch.toLowerCase());
//         const matchSearch =
//           !debouncedSearch ||
//           item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());

//         // API status filter (existing)
//         const matchStatus =
//           statusFilter === "All" || item.status === statusFilter.toLowerCase();

//         // 🎯 Decision filter (from review)
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision; // pass / reject / strong_pass
//         }

//         const matchDecision =
//           decisionFilter === "All" || decision === decisionFilter;

//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         const score = lastInterview?.review?.total_score
//           ? Math.round(lastInterview.review.total_score * 10)
//           : null;

//         const decision = lastInterview?.review?.decision;

//         let statusLabel = "In Progress";
//         if (decision === "strong_pass") statusLabel = "Strong Pass";
//         else if (decision === "pass") statusLabel = "Pass";
//         else if (decision === "reject") statusLabel = "Reject";

//         return {
//           id: item.id,
//           name: item.full_name,
//           status: statusLabel,
//           score,
//           stars: Math.round((score || 0) / 20),
//           date: new Date(item.updated_at).toLocaleDateString(),
//         };
//       });
//   }, [interviewReviews, debouncedSearch, statusFilter, decisionFilter]);

//   const filteredEmployees = useMemo(() => {
//     const list = apiStats?.recent_joiners ?? [];

//     return list.filter((emp) => {
//       if (!debouncedSearch) return true;

//       return (
//         emp.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         emp.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         emp.role?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         emp.department_name
//           ?.toLowerCase()
//           .includes(debouncedSearch.toLowerCase())
//       );
//     });
//   }, [apiStats, debouncedSearch]);

//   const interviewStatusMeta = {
//     completed: {
//       color: "bg-emerald-500",
//       text: "Completed",
//     },
//     scheduled: {
//       color: "bg-amber-500",
//       text: "Scheduled",
//     },
//     cancelled: {
//       color: "bg-rose-500",
//       text: "Cancelled",
//     },
//     pending: {
//       color: "bg-blue-500",
//       text: "Pending",
//     },
//   };

//   const employeeStatusMeta = {
//     joined: {
//       color: "bg-emerald-500",
//       text: "Joined",
//     },
//     pending: {
//       color: "bg-amber-500",
//       text: "Pending",
//     },
//     no_show: {
//       color: "bg-rose-500",
//       text: "No Show",
//     },
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Core Terminal
//             </span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === "candidates"
//               ? "Talent Acquisition"
//               : "Employee Governance"}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {["All", "Today", "Week", "Monthly"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range
//                     ? "bg-slate-900 text-white shadow-md"
//                     : "text-slate-400 hover:bg-slate-100"
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           {
//             id: "candidates",
//             label: "Candidates",
//             icon: <UserPlus size={16} />,
//           },
//           {
//             id: "employees",
//             label: "Employees",
//             icon: <Briefcase size={16} />,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => {
//               setActiveTab(tab.id);
//               setActiveView("dashboard");
//             }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id
//                 ? "text-blue-600"
//                 : "text-slate-400 hover:text-slate-600"
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && (
//               <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {activeView === "dashboard" ? (
//         <div className="grid grid-cols-12 gap-8">
//           {/* --- KPI CARDS --- */}

//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {loading ? (
//               <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//                 Loading dashboard...
//               </div>
//             ) : (
//               stats[activeTab].map((stat) => (
//                 <div
//                   key={stat.id}
//                   // onClick={() =>
//                   //   navigate(`/dashboard/candidate-table?type=${stat.type}`)
//                   // }
//                   onClick={() => {
//                     if (activeTab === "candidates") {
//                       navigate(`/dashboard/candidate-table?type=${stat.type}`);
//                     } else {
//                       navigate(`/dashboard/employee-table?type=${stat.type}`);
//                     }
//                   }}
//                   className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                 >
//                   <div
//                     className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                   >
//                     {stat.icon}
//                     {console.log("new data show in code", stat)}
//                   </div>

//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     {stat.label}
//                   </p>

//                   <h2 className="text-2xl font-black text-slate-900">
//                     {stat.val}
//                   </h2>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               {/* <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview
//                 Performance Review
//               </h3> */}
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" />
//                 {activeTab === "candidates"
//                   ? "Interview Performance Review"
//                   : "Employee Performance Overview"}
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
//               {/* <div className="flex flex-wrap gap-3 mb-6">
                
//                 <div className="relative">
//                   <Search
//                     size={14}
//                     className="absolute left-3 top-2.5 text-slate-400"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search candidate..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//                   />
//                 </div>

    
//                 <select
//                   value={decisionFilter}
//                   onChange={(e) => setDecisionFilter(e.target.value)}
//                   className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//                 >
//                   <option value="All">All Decision</option>
//                   <option value="strong_pass">Strong Pass</option>
//                   <option value="pass">Pass</option>
//                   <option value="reject">Reject</option>
//                   <option value="in_progress">In Progress</option>
//                 </select>
//               </div> */}

//               <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50/50 p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
//                 {/* SEARCH NODE - Primary Action */}
//                 <div className="relative flex-[2] min-w-[300px] group">
//                   <Search
//                     size={15}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search by candidate, email or role..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="w-full h-11 pl-11 pr-4 text-[13px] font-medium bg-white rounded-[18px] border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-slate-400"
//                   />
//                 </div>

//                 {/* DECISION FILTER - Secondary Utility */}
//                 {/* <div className="relative group min-w-[180px]">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
//                     <Filter size={13} />
//                   </div>
//                   <select
//                     value={decisionFilter}
//                     onChange={(e) => setDecisionFilter(e.target.value)}
//                     className="appearance-none w-full h-11 pl-10 pr-10 text-[11px] font-black uppercase tracking-[0.1em] bg-white rounded-[18px] border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer transition-all shadow-sm shadow-slate-100/20"
//                   >
//                     <option value="All">All Decisions</option>
//                     <option value="strong_pass">Strong Pass</option>
//                     <option value="pass">Pass</option>
//                     <option value="reject">Reject</option>
//                     <option value="in_progress">In Progress</option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                     <ChevronDown size={14} />
//                   </div>
//                 </div> */}
//                 {/* DECISION FILTER - Only for Candidates */}
//                 {activeTab === "candidates" && (
//                   <div className="relative group min-w-[180px]">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
//                       <Filter size={13} />
//                     </div>

//                     <select
//                       value={decisionFilter}
//                       onChange={(e) => setDecisionFilter(e.target.value)}
//                       className="appearance-none w-full h-11 pl-10 pr-10 text-[11px] font-black uppercase tracking-[0.1em] bg-white rounded-[18px] border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer transition-all shadow-sm shadow-slate-100/20"
//                     >
//                       <option value="All">All Decisions</option>
//                       <option value="strong_pass">Strong Pass</option>
//                       <option value="pass">Pass</option>
//                       <option value="reject">Reject</option>
//                       <option value="in_progress">In Progress</option>
//                     </select>

//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                       <ChevronDown size={14} />
//                     </div>
//                   </div>
//                 )}

//                 {/* CLEAR ACTION - Refined for visual alignment */}
//                 {/* {(searchText || decisionFilter !== "All") && ( */}
//                 {(searchText ||
//                   (activeTab === "candidates" && decisionFilter !== "All")) && (
//                   <button
//                     onClick={() => {
//                       setSearchText("");
//                       setDecisionFilter("All");
//                     }}
//                     className="h-11 px-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-[18px] transition-all border border-transparent hover:border-rose-100 active:scale-95"
//                   >
//                     <span className="mr-2">✕</span> Reset
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 {/* {filteredInterviewReviews.map((review) => {
//                   const fullCandidate = interviewReviews.find(
//                     (c) => c.id === review.id,
//                   );

//                   return (
//                     <div
//                       key={review.id}
//                       onClick={() => setSelectedCandidate(fullCandidate)}
//                       className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//                     >
                  
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`p-3 rounded-2xl ${
//                             review.status === "Reject"
//                               ? "bg-rose-100 text-rose-600"
//                               : review.status === "Strong Pass"
//                                 ? "bg-emerald-100 text-emerald-600"
//                                 : "bg-blue-100 text-blue-600"
//                           }`}
//                         >
//                           {review.status === "Reject" ? (
//                             <ThumbsDown size={18} />
//                           ) : (
//                             <ThumbsUp size={18} />
//                           )}
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-black text-slate-900">
//                             {review.name}
//                           </h4>

//                           <div className="flex items-center gap-2 mt-1">
//                             <span
//                               className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                                 review.status === "Reject"
//                                   ? "bg-rose-200 text-rose-700"
//                                   : review.status === "Strong Pass"
//                                     ? "bg-emerald-200 text-emerald-700"
//                                     : "bg-blue-200 text-blue-700"
//                               }`}
//                             >
//                               {review.status}
//                             </span>

//                             <span className="text-[9px] font-bold text-slate-400 uppercase">
//                               {review.date}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

                  
//                       {(review.status === "Pass" ||
//                         review.status === "Strong Pass") && (
//                         <div className="flex items-center gap-8">
//                           <div className="hidden md:flex flex-col items-end">
//                             <div className="flex gap-0.5 mb-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   size={12}
//                                   className={
//                                     i < review.stars
//                                       ? "fill-amber-400 text-amber-400"
//                                       : "text-slate-200"
//                                   }
//                                 />
//                               ))}
//                             </div>

//                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                               Feedback Rating
//                             </p>
//                           </div>

//                           <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                             <p className="text-[8px] font-black text-slate-400 uppercase">
//                               Score
//                             </p>

//                             <p className="text-lg font-black text-blue-600">
//                               {review.score ?? 0}
//                               <span className="text-[10px] text-slate-300">
//                                 /100
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       )}

                     
//                       {review.status === "Reject" && (
//                         <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                           Profile Archived
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })} */}

//                 {activeTab === "candidates" && (
//                   <>
//                     {filteredInterviewReviews.map((review) => {
//                       const fullCandidate = interviewReviews.find(
//                         (c) => c.id === review.id,
//                       );

//                       return (
//                         <div
//                           key={review.id}
//                           onClick={() => setSelectedCandidate(fullCandidate)}
//                           className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//                         >
//                           <div className="flex items-center gap-4">
//                             <div
//                               className={`p-3 rounded-2xl ${
//                                 review.status === "Reject"
//                                   ? "bg-rose-100 text-rose-600"
//                                   : review.status === "Strong Pass"
//                                     ? "bg-emerald-100 text-emerald-600"
//                                     : "bg-blue-100 text-blue-600"
//                               }`}
//                             >
//                               {review.status === "Reject" ? (
//                                 <ThumbsDown size={18} />
//                               ) : (
//                                 <ThumbsUp size={18} />
//                               )}
//                             </div>

//                             <div>
//                               <h4 className="text-sm font-black text-slate-900">
//                                 {review.name}
//                               </h4>

//                               <div className="flex items-center gap-2 mt-1">
//                                 <span
//                                   className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                                     review.status === "Reject"
//                                       ? "bg-rose-200 text-rose-700"
//                                       : review.status === "Strong Pass"
//                                         ? "bg-emerald-200 text-emerald-700"
//                                         : "bg-blue-200 text-blue-700"
//                                   }`}
//                                 >
//                                   {review.status}
//                                 </span>

//                                 <span className="text-[9px] font-bold text-slate-400 uppercase">
//                                   {review.date}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {(review.status === "Pass" ||
//                             review.status === "Strong Pass") && (
//                             <div className="flex items-center gap-8">
//                               <div className="hidden md:flex flex-col items-end">
//                                 <div className="flex gap-0.5 mb-1">
//                                   {[...Array(5)].map((_, i) => (
//                                     <Star
//                                       key={i}
//                                       size={12}
//                                       className={
//                                         i < review.stars
//                                           ? "fill-amber-400 text-amber-400"
//                                           : "text-slate-200"
//                                       }
//                                     />
//                                   ))}
//                                 </div>

//                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                                   Feedback Rating
//                                 </p>
//                               </div>

//                               <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                                 <p className="text-[8px] font-black text-slate-400 uppercase">
//                                   Score
//                                 </p>

//                                 <p className="text-lg font-black text-blue-600">
//                                   {review.score ?? 0}
//                                   <span className="text-[10px] text-slate-300">
//                                     /100
//                                   </span>
//                                 </p>
//                               </div>
//                             </div>
//                           )}

//                           {review.status === "Reject" && (
//                             <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                               Profile Archived
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </>
//                 )}

//                 {/* ================= EMPLOYEE LIST ================= */}
//                 {activeTab === "employees" &&
//                   filteredEmployees.map((emp) => (
//                     <div
//                       key={emp.id}
//                       className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all"
//                     >
//                       <div>
//                         <h4 className="text-sm font-black text-slate-900">
//                           {emp.full_name}
//                         </h4>

//                         <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
//                           <span>Role • {emp.role || "-"}</span>
//                           <span>Dept • {emp.department_name || "-"}</span>
//                         </div>

//                         <div className="text-[9px] text-slate-400 mt-1">
//                           Joined •{" "}
//                           {emp.joining_date
//                             ? new Date(emp.joining_date).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "short",
//                                   year: "numeric",
//                                 },
//                               )
//                             : "-"}
//                         </div>
//                       </div>

//                       <span
//                         className={`px-3 py-1 text-xs rounded-full font-bold ${
//                           emp.status === "active"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : emp.status === "on_probation"
//                               ? "bg-amber-100 text-amber-700"
//                               : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {emp.status}
//                       </span>
//                     </div>
//                   ))}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview
//                 Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true },
//                 ].map((box, i) => (
//                   <div
//                     key={i}
//                     className={`p-4 rounded-3xl border ${box.red ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
//                   >
//                     <p className="text-[9px] font-black text-slate-400 uppercase">
//                       {box.label}
//                     </p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
//                       {box.sub}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
//                 Interview Calendar
//               </h4>

//               {/* Calendar */}

//               <Calendar
//                 value={calendarDate}
//                 onChange={setCalendarDate}
//                 // tileContent={({ date, view }) => {
//                 //   if (view !== "month") return null;

//                 //   const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                 //   const list = interviewDateMap[d];

//                 //   if (!list) return null;

//                 //   return (
//                 //     <div className="flex justify-center mt-1 gap-1">
//                 //       {list.slice(0, 3).map((item, i) => (
//                 //         <span
//                 //           key={i}
//                 //           className={`w-1.5 h-1.5 rounded-full ${
//                 //             interviewStatusMeta[item.status]?.color ||
//                 //             "bg-slate-400"
//                 //           }`}
//                 //         />
//                 //       ))}
//                 //     </div>
//                 //   );
//                 // }}
//                 tileContent={({ date, view }) => {
//                   if (view !== "month") return null;

//                   const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//                   const interviewList = interviewDateMap[d];
//                   const employeeList = employeeJoinDateMap[d];

//                   if (!interviewList && !employeeList) return null;

//                   return (
//                     <div className="flex justify-center mt-1 gap-1 flex-wrap">
//                       {/* Interview dots */}
//                       {interviewList?.slice(0, 2).map((item, i) => (
//                         <span
//                           key={`i-${i}`}
//                           className={`w-1.5 h-1.5 rounded-full ${
//                             interviewStatusMeta[item.status]?.color ||
//                             "bg-slate-400"
//                           }`}
//                         />
//                       ))}

//                       {/* Employee joining dots */}
//                       {employeeList?.slice(0, 2).map((emp, i) => (
//                         <span
//                           key={`e-${i}`}
//                           className={`w-1.5 h-1.5 rounded-full ${
//                             employeeStatusMeta[emp.status]?.color ||
//                             "bg-blue-400"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   );
//                 }}
//               />

//               {/* Selected Day Interviews */}

//               {/* <div className="mt-4 max-h-56 overflow-auto">
//                 {(() => {
//                   // const d = calendarDate.toISOString().split("T")[0];
//                   const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
//                   const list = interviewDateMap[d];

//                   if (!list || list.length === 0)
//                     return (
//                       <div className="text-xs text-slate-400">
//                         No interviews scheduled
//                       </div>
//                     );

//                   return list.map((item, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border rounded-xl mb-2 bg-slate-50 flex justify-between items-center"
//                     >
//                       <div>
//                         <div className="text-xs font-bold">{item.name}</div>
//                         <div className="text-[10px] text-slate-500">
//                           Round {item.round} • {item.mode}
//                         </div>
//                         <div className="text-[10px] text-slate-400">
//                           {item.time}
//                         </div>
//                       </div>

                  
//                       <div
//                         className={`text-[9px] px-2 py-1 rounded-full font-bold uppercase
//           ${
//             item.status === "completed"
//               ? "bg-emerald-100 text-emerald-700"
//               : "bg-amber-100 text-amber-700"
//           }`}
//                       >
//                         {item.status}
//                       </div>
//                     </div>
//                   ));
//                 })()}
//               </div> */}

//               <div className="mt-4 max-h-56 overflow-auto space-y-2">
//                 {(() => {
//                   const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;

//                   const interviewList = interviewDateMap[d] ?? [];
//                   const employeeList = employeeJoinDateMap[d] ?? [];

//                   if (interviewList.length === 0 && employeeList.length === 0)
//                     return (
//                       <div className="text-xs text-slate-400">
//                         No activity for this date
//                       </div>
//                     );

//                   return (
//                     <>
//                       {/* Interviews */}
//                       {interviewList.map((item, i) => (
//                         <div
//                           key={`int-${i}`}
//                           className="p-3 border rounded-xl bg-slate-50"
//                         >
//                           <div className="text-xs font-bold">{item.name}</div>
//                           <div className="text-[10px] text-slate-500">
//                             Interview • Round {item.round}
//                           </div>
//                         </div>
//                       ))}

//                       {/* Employee Joining */}
//                       {employeeList.map((emp, i) => (
//                         <div
//                           key={`emp-${i}`}
//                           className="p-3 border rounded-xl bg-blue-50"
//                         >
//                           <div className="text-xs font-bold">{emp.name}</div>
//                           <div className="text-[10px] text-slate-500">
//                             Employee Joining • {emp.role}
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">
//                 eSign Status Workflow
//               </h4>
//               <div className="space-y-4">
//                 {["Document Uploaded", "Pending Signature", "Signed"].map(
//                   (status, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                         <span>{status}</span>
//                         <span>{Math.floor(Math.random() * 100)}%</span>
//                       </div>
//                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                         <div
//                           className="bg-blue-600 h-full"
//                           style={{ width: `${Math.random() * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//             <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//             <button
//               onClick={() => setActiveView("dashboard")}
//               className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <div className="p-10">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                 <div>
//                   <p className="text-sm font-black">Rajesh Kumar</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">
//                     Aadhaar: Verified | eSign: Pending | Interview: Online
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Attended
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Doc Uploaded
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//           {/* Increased max-width to 4xl for better data spacing */}
//           <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
//             {/* --- ENTERPRISE HEADER (Enhanced Padding) --- */}
//             <div className="px-10 py-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
//               <div className="flex gap-6">
//                 <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 flex-shrink-0">
//                   <User size={32} />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3">
//                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
//                       {selectedCandidate.full_name}
//                     </h2>
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-100">
//                       {selectedCandidate.position || "Candidate"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-5">
//                     <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                       <Mail size={15} className="text-slate-300" />{" "}
//                       {selectedCandidate.email}
//                     </p>
//                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
//                     <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                       <Phone size={15} className="text-slate-300" />{" "}
//                       {selectedCandidate.phone || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* --- MODAL BODY (Deep Vertical Spacing) --- */}
//             <div className="px-10 py-10 space-y-12 overflow-y-auto custom-scrollbar flex-1">
//               {/* DATA MATRIX SECTION */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
//                 {[
//                   {
//                     label: "System Status",
//                     value: selectedCandidate.status,
//                     icon: Activity,
//                     color: "text-emerald-500",
//                   },
//                   {
//                     label: "Seniority/Exp",
//                     value: selectedCandidate.experience || "N/A",
//                     icon: Layers,
//                     color: "text-blue-500",
//                   },
//                   {
//                     label: "Current Location",
//                     value: selectedCandidate.location || "Remote",
//                     icon: MapPin,
//                     color: "text-rose-500",
//                   },
//                   {
//                     label: "Ingestion Node",
//                     value: selectedCandidate.entry_method,
//                     icon: ArrowUpRight,
//                     color: "text-amber-500",
//                   },
//                   {
//                     label: "Record Created",
//                     value: selectedCandidate.created_at
//                       ? new Date(
//                           selectedCandidate.created_at,
//                         ).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : "-",
//                     icon: null,
//                     color: "text-slate-500",
//                   },
//                 ].map((item, idx) => (
//                   <div key={idx} className="space-y-2">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5">
//                       {item.icon && (
//                         <item.icon size={14} className={item.color} />
//                       )}
//                       {item.label}
//                     </p>
//                     <p className="text-base font-bold text-slate-800 capitalize">
//                       {item.value}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

//               {/* ASSESSMENT SECTION */}
//               <div className="space-y-12">
//                 {/* SECTION HEADER: HIGH-DENSITY */}
//                 <div className="flex items-end justify-between border-b border-slate-100 pb-6">
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-2">
//                       <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
//                         <ShieldCheck size={16} className="text-white" />
//                       </div>
//                       <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">
//                         Assessment Pipeline
//                       </h3>
//                     </div>
//                     <p className="text-xs text-slate-400 font-medium">
//                       Technical evaluation ledger and decision history.
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1">
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Efficiency Rating
//                     </span>
//                     <span className="text-sm font-black text-blue-600 tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
//                       {selectedCandidate.interviews?.length || 0} Phases Cleared
//                     </span>
//                   </div>
//                 </div>

//                 {/* TIMELINE ARCHITECTURE */}
//                 {!selectedCandidate.interviews ||
//                 selectedCandidate.interviews.length === 0 ? (
//                   <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
//                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
//                       <Activity size={24} />
//                     </div>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
//                       No Assessment Data Found
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     {/* THE CENTRAL PIPELINE THREAD */}
//                     <div className="absolute left-[20px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-slate-200 to-transparent hidden md:block" />

//                     <div className="space-y-12">
//                       {selectedCandidate.interviews.map((round, idx) => (
//                         <div
//                           key={round.id}
//                           className="relative pl-0 md:pl-14 group transition-all"
//                         >
//                           {/* TIMELINE NODE */}
//                           <div className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full bg-white border-2 border-slate-100 items-center justify-center z-10 group-hover:border-blue-500 transition-colors shadow-sm">
//                             <span className="text-[10px] font-black text-slate-900">
//                               {round.round_number}
//                             </span>
//                           </div>

//                           <div className="flex flex-col gap-6">
//                             {/* ROUND METADATA */}
//                             <div className="flex flex-wrap items-center justify-between gap-4">
//                               <div>
//                                 <div className="flex items-center gap-3 mb-1">
//                                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                     Phase {round.round_number}: {round.mode}{" "}
//                                     Assessment
//                                   </h4>
//                                   <span
//                                     className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
//                                       round.status === "completed"
//                                         ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                         : "bg-slate-50 text-slate-400 border-slate-100"
//                                     }`}
//                                   >
//                                     {round.status}
//                                   </span>
//                                 </div>
//                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//                                   Execution Date:{" "}
//                                   {new Date(
//                                     round.interview_date,
//                                   ).toLocaleDateString("en-US", {
//                                     month: "long",
//                                     day: "numeric",
//                                     year: "numeric",
//                                   })}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* DYNAMIC CONTENT BOX */}
//                             {round.review ? (
//                               <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-100/50">
//                                 <div className="grid md:grid-cols-12">
//                                   {/* LEFT PANEL: DECISION & SCORE */}
//                                   <div className="md:col-span-4 p-6 bg-slate-50/50 border-r border-slate-50 flex flex-col justify-between gap-8">
//                                     <div>
//                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">
//                                         System Verdict
//                                       </span>
//                                       <div
//                                         className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-tighter ${
//                                           [
//                                             "hire",
//                                             "pass",
//                                             "strong pass",
//                                           ].includes(
//                                             round.review.decision?.toLowerCase(),
//                                           )
//                                             ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
//                                             : "bg-rose-500 text-white shadow-lg shadow-rose-100"
//                                         }`}
//                                       >
//                                         {/* Dynamic Icon Logic */}
//                                         {[
//                                           "hire",
//                                           "pass",
//                                           "strong pass",
//                                         ].includes(
//                                           round.review.decision?.toLowerCase(),
//                                         ) ? (
//                                           <ShieldCheck
//                                             size={14}
//                                             className={
//                                               round.review.decision?.toLowerCase() ===
//                                               "strong pass"
//                                                 ? "animate-pulse"
//                                                 : ""
//                                             }
//                                           />
//                                         ) : (
//                                           <Activity size={14} />
//                                         )}

//                                         {/* Label Display */}
//                                         {round.review.decision}
//                                       </div>
//                                     </div>

//                                     <div>
//                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
//                                         Weighted Performance
//                                       </span>
//                                       <div className="flex items-baseline gap-1">
//                                         <span className="text-4xl font-black text-slate-900 tracking-tighter">
//                                           {round.review.total_score
//                                             ? Math.round(
//                                                 round.review.total_score * 10,
//                                               )
//                                             : 0}
//                                         </span>
//                                         <span className="text-slate-300 font-bold text-sm">
//                                           /100
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {/* RIGHT PANEL: METRICS & REMARKS */}
//                                   <div className="md:col-span-8 p-6 space-y-6">
//                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
//                                       {[
//                                         {
//                                           l: "Technical",
//                                           v: round.review.technical_skill,
//                                         },
//                                         {
//                                           l: "Linguistics",
//                                           v: round.review.communication,
//                                         },
//                                         {
//                                           l: "Cognition",
//                                           v: round.review.problem_solving,
//                                         },
//                                         {
//                                           l: "Cultural",
//                                           v: round.review.cultural_fit,
//                                         },
//                                         {
//                                           l: "Domain Exp",
//                                           v: round.review.relevant_experience,
//                                         },
//                                       ].map((stat, i) => (
//                                         <div key={i} className="space-y-1.5">
//                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                             {stat.l}
//                                           </p>
//                                           <div className="flex items-center gap-2">
//                                             <div className="flex gap-0.5">
//                                               {[...Array(5)].map((_, star) => (
//                                                 <div
//                                                   key={star}
//                                                   className={`w-1.5 h-3 rounded-full ${star < stat.v ? "bg-blue-600" : "bg-slate-100"}`}
//                                                 />
//                                               ))}
//                                             </div>
//                                             <span className="text-[10px] font-black text-slate-900">
//                                               {stat.v}/10
//                                             </span>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>

//                                     {round.review.remarks && (
//                                       <div className="pt-4 border-t border-slate-50">
//                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
//                                           Executive Summary
//                                         </p>
//                                         <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100/50 italic">
//                                           "{round.review.remarks}"
//                                         </p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
//                                 <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin mb-3" />
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                                   Interview Pending
//                                 </p>
//                                 <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
//                                   Awaiting Post-Round Analytical Input
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* --- FOOTER ACTIONS (Refined Padding) --- */}
//             <div className="px-10 py-8 bg-slate-50/80 border-t border-slate-100 flex justify-end items-center gap-6">
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//************************************************working code phase 41 9/02/26********************************************************* */
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Users,
//   ShieldCheck,
//   Briefcase,
//   Zap,
//   Search,
//   Filter,
//   ArrowUpRight,
//   Plus,
//   Lock,
//   FileText,
//   Activity,
//   Clock,
//   CheckCircle2,
//   Database,
//   User,
//   Phone,
//   X,
//   Layers,
//   XCircle,
//   Timer,
//   Mail,
//   Award,
//   UserPlus,
//   LogOut,
//   ShieldAlert,
//   Fingerprint,
//   CreditCard,
//   Landmark,
//   PenTool,
//   Video,
//   MapPin,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates");
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [decisionFilter, setDecisionFilter] = useState("All");
//   const navigate = useNavigate();

//   // debounced search
//   const debouncedSearch = useDebounce(searchText, 1000);

//   useEffect(() => {
//     if (activeTab === "candidates") {
//       fetchDashboardStats();
//     }
//   }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   const buildFilters = (extra = {}) => {
//     const filters = {};

//     if (extra.type) filters.type = extra.type;

//     // ONLY send range if not ALL
//     if (timeRange && timeRange !== "All") {
//       filters.range = timeRange;
//     }

//     // if (searchText) filters.search = searchText;

//     if (debouncedSearch) filters.search = debouncedSearch;

//     if (statusFilter !== "All") {
//       filters.status = statusFilter.toLowerCase();
//     }

//     if (extra.location) filters.location = extra.location;

//     return filters;
//   };

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();

//       const data = await dashboardService.getCandidateStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // Map interviews by date (YYYY-MM-DD)
//   const interviewDateMap = useMemo(() => {
//     const map = {};

//     interviewReviews.forEach((candidate) => {
//       candidate.interviews?.forEach((round) => {
//         if (!round.interview_date) return;

//         const dt = new Date(round.interview_date);
//         const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

//         if (!map[d]) map[d] = [];

//         map[d].push({
//           id: candidate.id,
//           name: candidate.full_name,
//           round: round.round_number,
//           status: round.status, // completed / scheduled
//           mode: round.mode,
//           time: new Date(round.interview_date).toLocaleTimeString(),
//         });
//       });
//     });

//     return map;
//   }, [interviewReviews]);

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       {
//         id: "total",
//         label: "Total Candidates",
//         type: "all",
//         val: apiStats?.total_candidates ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "interviewing",
//         label: "Interviewing",
//         type: "interviewing",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "interviewing")
//             ?.count ?? 0,
//         icon: <Video size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       {
//         id: "migrated",
//         label: "Migrated",
//         type: "migrated",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "migrated")
//             ?.count ?? 0,
//         icon: <CheckCircle2 size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "manual",
//         label: "Manual Entry",
//         type: "manual",
//         val:
//           apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
//             ?.count ?? 0,
//         icon: <Database size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//     ],
//     employees: [
//       {
//         id: "kyc_pending",
//         label: "KYC Pending",
//         val: "14",
//         icon: <Fingerprint size={20} />,
//         color: "text-rose-600",
//         bg: "bg-rose-50",
//       },
//       {
//         id: "esign",
//         label: "eSign Done",
//         val: "112",
//         icon: <PenTool size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "probation",
//         label: "On Probation",
//         val: "84",
//         icon: <ShieldAlert size={20} />,
//         color: "text-orange-600",
//         bg: "bg-orange-50",
//       },
//       {
//         id: "active",
//         label: "Active Staff",
//         val: "1.2k",
//         icon: <ShieldCheck size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         // 🔎 Debounced Search
//         const matchSearch = item.full_name
//           ?.toLowerCase()
//           .includes(debouncedSearch.toLowerCase());

//         // API status filter (existing)
//         const matchStatus =
//           statusFilter === "All" || item.status === statusFilter.toLowerCase();

//         // 🎯 Decision filter (from review)
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision; // pass / reject / strong_pass
//         }

//         const matchDecision =
//           decisionFilter === "All" || decision === decisionFilter;

//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         const score = lastInterview?.review?.total_score
//           ? Math.round(lastInterview.review.total_score * 10)
//           : null;

//         const decision = lastInterview?.review?.decision;

//         let statusLabel = "In Progress";
//         if (decision === "strong_pass") statusLabel = "Strong Pass";
//         else if (decision === "pass") statusLabel = "Pass";
//         else if (decision === "reject") statusLabel = "Reject";

//         return {
//           id: item.id,
//           name: item.full_name,
//           status: statusLabel,
//           score,
//           stars: Math.round((score || 0) / 20),
//           date: new Date(item.updated_at).toLocaleDateString(),
//         };
//       });
//   }, [interviewReviews, debouncedSearch, statusFilter, decisionFilter]);

//   const interviewStatusMeta = {
//     completed: {
//       color: "bg-emerald-500",
//       text: "Completed",
//     },
//     scheduled: {
//       color: "bg-amber-500",
//       text: "Scheduled",
//     },
//     cancelled: {
//       color: "bg-rose-500",
//       text: "Cancelled",
//     },
//     pending: {
//       color: "bg-blue-500",
//       text: "Pending",
//     },
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Core Terminal
//             </span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === "candidates"
//               ? "Talent Acquisition"
//               : "Employee Governance"}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {["All", "Today", "Week", "Monthly"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range
//                     ? "bg-slate-900 text-white shadow-md"
//                     : "text-slate-400 hover:bg-slate-100"
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           {
//             id: "candidates",
//             label: "Candidates",
//             icon: <UserPlus size={16} />,
//           },
//           {
//             id: "employees",
//             label: "Employees",
//             icon: <Briefcase size={16} />,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => {
//               setActiveTab(tab.id);
//               setActiveView("dashboard");
//             }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id
//                 ? "text-blue-600"
//                 : "text-slate-400 hover:text-slate-600"
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && (
//               <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {activeView === "dashboard" ? (
//         <div className="grid grid-cols-12 gap-8">
//           {/* --- KPI CARDS --- */}

//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {loading ? (
//               <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//                 Loading dashboard...
//               </div>
//             ) : (
//               stats[activeTab].map((stat) => (
//                 <div
//                   key={stat.id}
//                   onClick={() =>
//                     navigate(`/dashboard/candidate-table?type=${stat.type}`)
//                   }
//                   className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                 >
//                   <div
//                     className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                   >
//                     {stat.icon}
//                     {console.log("new data show in code", stat)}
//                   </div>

//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     {stat.label}
//                   </p>

//                   <h2 className="text-2xl font-black text-slate-900">
//                     {stat.val}
//                   </h2>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview
//                 Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {/* Search */}
//                 <div className="relative">
//                   <Search
//                     size={14}
//                     className="absolute left-3 top-2.5 text-slate-400"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search candidate..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//                   />
//                 </div>

//                 {/* Status Filter */}

//                 {/* Decision Filter */}
//                 <select
//                   value={decisionFilter}
//                   onChange={(e) => setDecisionFilter(e.target.value)}
//                   className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//                 >
//                   <option value="All">All Decision</option>
//                   <option value="strong_pass">Strong Pass</option>
//                   <option value="pass">Pass</option>
//                   <option value="reject">Reject</option>
//                   <option value="in_progress">In Progress</option>
//                 </select>
//               </div>

//               <div className="space-y-4">
//                 {filteredInterviewReviews.map((review) => {
//                   const fullCandidate = interviewReviews.find(
//                     (c) => c.id === review.id,
//                   );

//                   return (
//                     <div
//                       key={review.id}
//                       onClick={() => setSelectedCandidate(fullCandidate)}
//                       className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//                     >
//                       {/* LEFT */}
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`p-3 rounded-2xl ${
//                             review.status === "Reject"
//                               ? "bg-rose-100 text-rose-600"
//                               : review.status === "Strong Pass"
//                                 ? "bg-emerald-100 text-emerald-600"
//                                 : "bg-blue-100 text-blue-600"
//                           }`}
//                         >
//                           {review.status === "Reject" ? (
//                             <ThumbsDown size={18} />
//                           ) : (
//                             <ThumbsUp size={18} />
//                           )}
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-black text-slate-900">
//                             {review.name}
//                           </h4>

//                           <div className="flex items-center gap-2 mt-1">
//                             <span
//                               className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                                 review.status === "Reject"
//                                   ? "bg-rose-200 text-rose-700"
//                                   : review.status === "Strong Pass"
//                                     ? "bg-emerald-200 text-emerald-700"
//                                     : "bg-blue-200 text-blue-700"
//                               }`}
//                             >
//                               {review.status}
//                             </span>

//                             <span className="text-[9px] font-bold text-slate-400 uppercase">
//                               {review.date}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* RIGHT SCORE */}
//                       {(review.status === "Pass" ||
//                         review.status === "Strong Pass") && (
//                         <div className="flex items-center gap-8">
//                           <div className="hidden md:flex flex-col items-end">
//                             <div className="flex gap-0.5 mb-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   size={12}
//                                   className={
//                                     i < review.stars
//                                       ? "fill-amber-400 text-amber-400"
//                                       : "text-slate-200"
//                                   }
//                                 />
//                               ))}
//                             </div>

//                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                               Feedback Rating
//                             </p>
//                           </div>

//                           <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                             <p className="text-[8px] font-black text-slate-400 uppercase">
//                               Score
//                             </p>

//                             <p className="text-lg font-black text-blue-600">
//                               {review.score ?? 0}
//                               <span className="text-[10px] text-slate-300">
//                                 /100
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {/* REJECT LABEL */}
//                       {review.status === "Reject" && (
//                         <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                           Profile Archived
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview
//                 Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true },
//                 ].map((box, i) => (
//                   <div
//                     key={i}
//                     className={`p-4 rounded-3xl border ${box.red ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
//                   >
//                     <p className="text-[9px] font-black text-slate-400 uppercase">
//                       {box.label}
//                     </p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
//                       {box.sub}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
//                 Interview Calendar
//               </h4>

//               {/* Calendar */}

//               <Calendar
//                 value={calendarDate}
//                 onChange={setCalendarDate}
//                 tileContent={({ date, view }) => {
//                   if (view !== "month") return null;

//                   const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                   const list = interviewDateMap[d];

//                   if (!list) return null;

//                   return (
//                     <div className="flex justify-center mt-1 gap-1">
//                       {list.slice(0, 3).map((item, i) => (
//                         <span
//                           key={i}
//                           className={`w-1.5 h-1.5 rounded-full ${
//                             interviewStatusMeta[item.status]?.color ||
//                             "bg-slate-400"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   );
//                 }}
//               />

//               {/* Selected Day Interviews */}

//               <div className="mt-4 max-h-56 overflow-auto">
//                 {(() => {
//                   // const d = calendarDate.toISOString().split("T")[0];
//                   const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
//                   const list = interviewDateMap[d];

//                   if (!list || list.length === 0)
//                     return (
//                       <div className="text-xs text-slate-400">
//                         No interviews scheduled
//                       </div>
//                     );

//                   return list.map((item, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border rounded-xl mb-2 bg-slate-50 flex justify-between items-center"
//                     >
//                       <div>
//                         <div className="text-xs font-bold">{item.name}</div>
//                         <div className="text-[10px] text-slate-500">
//                           Round {item.round} • {item.mode}
//                         </div>
//                         <div className="text-[10px] text-slate-400">
//                           {item.time}
//                         </div>
//                       </div>

//                       {/* Status Badge */}
//                       <div
//                         className={`text-[9px] px-2 py-1 rounded-full font-bold uppercase
//           ${
//             item.status === "completed"
//               ? "bg-emerald-100 text-emerald-700"
//               : "bg-amber-100 text-amber-700"
//           }`}
//                       >
//                         {item.status}
//                       </div>
//                     </div>
//                   ));
//                 })()}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">
//                 eSign Status Workflow
//               </h4>
//               <div className="space-y-4">
//                 {["Document Uploaded", "Pending Signature", "Signed"].map(
//                   (status, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                         <span>{status}</span>
//                         <span>{Math.floor(Math.random() * 100)}%</span>
//                       </div>
//                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                         <div
//                           className="bg-blue-600 h-full"
//                           style={{ width: `${Math.random() * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//             <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//             <button
//               onClick={() => setActiveView("dashboard")}
//               className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <div className="p-10">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                 <div>
//                   <p className="text-sm font-black">Rajesh Kumar</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">
//                     Aadhaar: Verified | eSign: Pending | Interview: Online
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Attended
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Doc Uploaded
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {/* {selectedCandidate && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
//           <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">

//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-black">
//                   {selectedCandidate.full_name}
//                 </h2>
//                 <p className="text-xs text-slate-500">
//                   {selectedCandidate.email} • {selectedCandidate.phone}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="text-slate-400 hover:text-slate-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">

//               <div className="grid grid-cols-2 gap-4 text-xs">
//                 <div>
//                   <b>Status:</b> {selectedCandidate.status}
//                 </div>
//                 <div>
//                   <b>Position:</b> {selectedCandidate.position}
//                 </div>
//                 <div>
//                   <b>Experience:</b> {selectedCandidate.experience}
//                 </div>
//                 <div>
//                   <b>Location:</b> {selectedCandidate.location}
//                 </div>
//                 <div>
//                   <b>Entry:</b> {selectedCandidate.entry_method}
//                 </div>
//                 <div>
//                   <b>Created:</b>{" "}
//                   {selectedCandidate.created_at
//                     ? new Date(
//                         selectedCandidate.created_at,
//                       ).toLocaleDateString()
//                     : "-"}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="font-black text-sm mb-3">Interview Rounds</h3>

//                 {selectedCandidate.interviews?.length === 0 && (
//                   <div className="text-xs text-slate-400">
//                     No interview conducted
//                   </div>
//                 )}

//                 {selectedCandidate.interviews?.map((round) => (
//                   <div
//                     key={round.id}
//                     className="border rounded-xl p-4 mb-3 bg-slate-50"
//                   >
//                     <div className="flex justify-between text-xs mb-2">
//                       <span>
//                         <b>Round:</b> {round.round_number}
//                       </span>
//                       <span>
//                         <b>Status:</b> {round.status}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-xs mb-2">
//                       <span>
//                         <b>Mode:</b> {round.mode}
//                       </span>
//                       <span>
//                         <b>Date:</b>{" "}
//                         {new Date(round.interview_date).toLocaleString()}
//                       </span>
//                     </div>

//                     {round.review ? (
//                       <div className="mt-3 p-3 bg-white rounded-lg border text-xs">
//                         <div className="flex justify-between mb-2">
//                           <span>
//                             <b>Decision:</b> {round.review.decision}
//                           </span>
//                           <span>
//                             <b>Score:</b>{" "}
//                             {round.review.total_score
//                               ? Math.round(round.review.total_score * 10)
//                               : 0}
//                             /100
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-2 gap-2">
//                           <div>Technical: {round.review.technical_skill}</div>
//                           <div>Communication: {round.review.communication}</div>
//                           <div>
//                             Problem Solving: {round.review.problem_solving}
//                           </div>
//                           <div>Culture Fit: {round.review.cultural_fit}</div>
//                           <div>
//                             Experience: {round.review.relevant_experience}
//                           </div>
//                         </div>

//                         {round.review.remarks && (
//                           <div className="mt-2 text-slate-600">
//                             <b>Remarks:</b> {round.review.remarks}
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="text-xs text-slate-400 mt-2">
//                         No review submitted
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* {selectedCandidate && (
//   <div className="fixed  inset-0 z-99 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
//     <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20">

//       <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
//         <div className="flex gap-5">
//           <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//             <User size={28} />
//           </div>
//           <div>
//             <div className="flex items-center gap-3 mb-1">
//               <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
//                 {selectedCandidate.full_name}
//               </h2>
//               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded border border-blue-100">
//                 {selectedCandidate.position || "Candidate"}
//               </span>
//             </div>
//             <p className="text-sm text-slate-500 font-medium flex items-center gap-4">
//               <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-300"/> {selectedCandidate.email}</span>
//               <span className="w-1 h-1 rounded-full bg-slate-300" />
//               <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-300"/> {selectedCandidate.phone || "No Phone"}</span>
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={() => setSelectedCandidate(null)}
//           className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
//   {[
//     { label: 'System Status', value: selectedCandidate.status, icon: Activity, color: 'text-emerald-500' },
//     { label: 'Seniority/Exp', value: selectedCandidate.experience || 'N/A', icon: Layers, color: 'text-blue-500' },
//     { label: 'Current Location', value: selectedCandidate.location || 'Remote', icon: MapPin, color: 'text-rose-500' },
//     { label: 'Ingestion Node', value: selectedCandidate.entry_method, icon: ArrowUpRight, color: 'text-amber-500' },
//     {
//       label: 'Record Created',
//       value: selectedCandidate.created_at
//         ? new Date(selectedCandidate.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//         : "-",
//       icon: null, // Icon removed
//       color: 'text-slate-500'
//     }
//   ].map((item, idx) => (
//     <div key={idx} className="space-y-1.5">
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">

//         {item.icon && <item.icon size={12} className={item.color} />}
//         {item.label}
//       </p>
//       <p className="text-sm font-bold text-slate-800 capitalize">
//         {item.value}
//       </p>
//     </div>
//   ))}
// </div>

//         <div className="h-px bg-slate-100 w-full" />

//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
//               <ShieldCheck size={16} className="text-blue-600" /> Assessment Intelligence
//             </h3>
//             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
//               {selectedCandidate.interviews?.length || 0} Rounds Found
//             </span>
//           </div>

//           {(!selectedCandidate.interviews || selectedCandidate.interviews.length === 0) ? (
//             <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
//               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No evaluation records generated yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {selectedCandidate.interviews.map((round) => (
//                 <div
//                   key={round.id}
//                   className="group border border-slate-100 rounded-[20px] p-5 bg-white hover:border-blue-200 hover:shadow-md transition-all relative overflow-hidden"
//                 >
//                   <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-blue-500 transition-all" />

//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">
//                         {round.round_number}
//                       </div>
//                       <div>
//                         <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Round {round.round_number}</p>
//                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{round.mode} • {new Date(round.interview_date).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase rounded-full text-slate-600 tracking-widest">
//                       {round.status}
//                     </span>
//                   </div>

//                   {round.review ? (
//                     <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
//                       <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
//                         <div className="flex flex-col">
//                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System Recommendation</span>
//                            <span className={`text-xs font-bold ${round.review.decision === 'hire' ? 'text-emerald-600' : 'text-rose-600'} uppercase`}>
//                              {round.review.decision}
//                            </span>
//                         </div>
//                         <div className="text-right">
//                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Aggregate Score</span>
//                            <span className="text-lg font-black text-slate-900">
//                             {round.review.total_score ? Math.round(round.review.total_score * 10) : 0}<span className="text-slate-300 text-xs">/100</span>
//                            </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                         {[
//                           { l: 'Tech', v: round.review.technical_skill },
//                           { l: 'Comm', v: round.review.communication },
//                           { l: 'Problem', v: round.review.problem_solving },
//                           { l: 'Culture', v: round.review.cultural_fit },
//                           { l: 'Exp', v: round.review.relevant_experience }
//                         ].map((stat, i) => (
//                           <div key={i}>
//                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{stat.l}</p>
//                             <div className="flex items-center gap-1.5">
//                               <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
//                                 <div className="h-full bg-blue-600" style={{ width: `${(stat.v / 5) * 100}%` }} />
//                               </div>
//                               <span className="text-[10px] font-bold text-slate-700">{stat.v}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {round.review.remarks && (
//                         <div className="mt-4 pt-3 border-t border-slate-100">
//                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Technical Remarks</p>
//                           <p className="text-xs text-slate-600 leading-relaxed italic">"{round.review.remarks}"</p>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                       <Activity size={12} /> Pending reviewer submission...
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
//         <button
//           onClick={() => setSelectedCandidate(null)}
//           className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
//         >
//           Dismiss
//         </button>
//         <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">
//           Generate Full Report
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//           {/* Increased max-width to 4xl for better data spacing */}
//           <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
//             {/* --- ENTERPRISE HEADER (Enhanced Padding) --- */}
//             <div className="px-10 py-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
//               <div className="flex gap-6">
//                 <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 flex-shrink-0">
//                   <User size={32} />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3">
//                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
//                       {selectedCandidate.full_name}
//                     </h2>
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-100">
//                       {selectedCandidate.position || "Candidate"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-5">
//                     <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                       <Mail size={15} className="text-slate-300" />{" "}
//                       {selectedCandidate.email}
//                     </p>
//                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
//                     <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                       <Phone size={15} className="text-slate-300" />{" "}
//                       {selectedCandidate.phone || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* --- MODAL BODY (Deep Vertical Spacing) --- */}
//             <div className="px-10 py-10 space-y-12 overflow-y-auto custom-scrollbar flex-1">
//               {/* DATA MATRIX SECTION */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
//                 {[
//                   {
//                     label: "System Status",
//                     value: selectedCandidate.status,
//                     icon: Activity,
//                     color: "text-emerald-500",
//                   },
//                   {
//                     label: "Seniority/Exp",
//                     value: selectedCandidate.experience || "N/A",
//                     icon: Layers,
//                     color: "text-blue-500",
//                   },
//                   {
//                     label: "Current Location",
//                     value: selectedCandidate.location || "Remote",
//                     icon: MapPin,
//                     color: "text-rose-500",
//                   },
//                   {
//                     label: "Ingestion Node",
//                     value: selectedCandidate.entry_method,
//                     icon: ArrowUpRight,
//                     color: "text-amber-500",
//                   },
//                   {
//                     label: "Record Created",
//                     value: selectedCandidate.created_at
//                       ? new Date(
//                           selectedCandidate.created_at,
//                         ).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : "-",
//                     icon: null,
//                     color: "text-slate-500",
//                   },
//                 ].map((item, idx) => (
//                   <div key={idx} className="space-y-2">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5">
//                       {item.icon && (
//                         <item.icon size={14} className={item.color} />
//                       )}
//                       {item.label}
//                     </p>
//                     <p className="text-base font-bold text-slate-800 capitalize">
//                       {item.value}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

//               {/* ASSESSMENT SECTION */}
//               {/* <div className="space-y-8">
//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//                 <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
//                 <ShieldCheck size={18} className="text-blue-600" /> Assessment Intelligence
//                 </h3>
//                 <p className="text-[11px] text-slate-400 font-medium">Detailed breakdown of historical interview performance.</p>
//             </div>
//             <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-tighter">
//               {selectedCandidate.interviews?.length || 0} Records Found
//             </span>
//           </div>

//           {(!selectedCandidate.interviews || selectedCandidate.interviews.length === 0) ? (
//             <div className="bg-slate-50/50 rounded-[32px] p-12 border border-dashed border-slate-200 text-center">
//               <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">No evaluation records detected in vault.</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {selectedCandidate.interviews.map((round) => (
//                 <div
//                   key={round.id}
//                   className="group border border-slate-100 rounded-[28px] p-8 bg-white hover:border-blue-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all relative overflow-hidden"
//                 >
//                   <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-all" />

//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-slate-200">
//                         {round.round_number}
//                       </div>
//                       <div>
//                         <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Round {round.round_number}</p>
//                         <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{round.mode} • {new Date(round.interview_date).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase rounded-full text-slate-600 tracking-widest">
//                       {round.status}
//                     </span>
//                   </div>

//                   {round.review ? (
//                     <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
//                       <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-5">
//                         <div className="space-y-1">
//                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Decision Output</span>
//                            <span className={`text-xs font-black ${round.review.decision === 'hire' ? 'text-emerald-600' : 'text-rose-600'} uppercase bg-white px-3 py-1 rounded-md shadow-sm border border-slate-100`}>
//                              {round.review.decision}
//                            </span>
//                         </div>
//                         <div className="text-right space-y-1">
//                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Aggregate Score</span>
//                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
//                             {round.review.total_score ? Math.round(round.review.total_score * 10) : 0}<span className="text-slate-300 text-sm">/100</span>
//                            </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
//                         {[
//                           { l: 'Tech', v: round.review.technical_skill },
//                           { l: 'Comm', v: round.review.communication },
//                           { l: 'Logic', v: round.review.problem_solving },
//                           { l: 'Culture', v: round.review.cultural_fit },
//                           { l: 'Exp', v: round.review.relevant_experience }
//                         ].map((stat, i) => (
//                           <div key={i} className="space-y-2">
//                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</p>
//                             <div className="flex items-center gap-2">
//                               <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
//                                 <div className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: `${(stat.v / 5) * 100}%` }} />
//                               </div>
//                               <span className="text-xs font-black text-slate-700">{stat.v}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {round.review.remarks && (
//                         <div className="mt-6 pt-5 border-t border-slate-100">
//                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Remarks</p>
//                           <p className="text-sm text-slate-600 leading-relaxed font-medium italic bg-white p-4 rounded-xl border border-slate-100">
//                             "{round.review.remarks}"
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-dashed border-slate-200 rounded-2xl">
//                       <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
//                       Pending post-round debriefing
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div> */}
//               <div className="space-y-12">
//                 {/* SECTION HEADER: HIGH-DENSITY */}
//                 <div className="flex items-end justify-between border-b border-slate-100 pb-6">
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-2">
//                       <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
//                         <ShieldCheck size={16} className="text-white" />
//                       </div>
//                       <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">
//                         Assessment Pipeline
//                       </h3>
//                     </div>
//                     <p className="text-xs text-slate-400 font-medium">
//                       Technical evaluation ledger and decision history.
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1">
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Efficiency Rating
//                     </span>
//                     <span className="text-sm font-black text-blue-600 tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
//                       {selectedCandidate.interviews?.length || 0} Phases Cleared
//                     </span>
//                   </div>
//                 </div>

//                 {/* TIMELINE ARCHITECTURE */}
//                 {!selectedCandidate.interviews ||
//                 selectedCandidate.interviews.length === 0 ? (
//                   <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
//                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
//                       <Activity size={24} />
//                     </div>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
//                       No Assessment Data Found
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     {/* THE CENTRAL PIPELINE THREAD */}
//                     <div className="absolute left-[20px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-slate-200 to-transparent hidden md:block" />

//                     <div className="space-y-12">
//                       {selectedCandidate.interviews.map((round, idx) => (
//                         <div
//                           key={round.id}
//                           className="relative pl-0 md:pl-14 group transition-all"
//                         >
//                           {/* TIMELINE NODE */}
//                           <div className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full bg-white border-2 border-slate-100 items-center justify-center z-10 group-hover:border-blue-500 transition-colors shadow-sm">
//                             <span className="text-[10px] font-black text-slate-900">
//                               {round.round_number}
//                             </span>
//                           </div>

//                           <div className="flex flex-col gap-6">
//                             {/* ROUND METADATA */}
//                             <div className="flex flex-wrap items-center justify-between gap-4">
//                               <div>
//                                 <div className="flex items-center gap-3 mb-1">
//                                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                     Phase {round.round_number}: {round.mode}{" "}
//                                     Assessment
//                                   </h4>
//                                   <span
//                                     className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
//                                       round.status === "completed"
//                                         ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                         : "bg-slate-50 text-slate-400 border-slate-100"
//                                     }`}
//                                   >
//                                     {round.status}
//                                   </span>
//                                 </div>
//                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//                                   Execution Date:{" "}
//                                   {new Date(
//                                     round.interview_date,
//                                   ).toLocaleDateString("en-US", {
//                                     month: "long",
//                                     day: "numeric",
//                                     year: "numeric",
//                                   })}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* DYNAMIC CONTENT BOX */}
//                             {round.review ? (
//                               <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-100/50">
//                                 <div className="grid md:grid-cols-12">
//                                   {/* LEFT PANEL: DECISION & SCORE */}
//                                   <div className="md:col-span-4 p-6 bg-slate-50/50 border-r border-slate-50 flex flex-col justify-between gap-8">
//                                     {/* <div>
//                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">System Verdict</span>
//                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-tighter ${
//                           round.review.decision === 'hire' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-rose-500 text-white shadow-lg shadow-rose-100'
//                         }`}>
//                           {round.review.decision === 'hire' ? <ShieldCheck size={14}/> : <Activity size={14}/>}
//                           {round.review.decision}
//                         </div>
//                       </div> */}
//                                     <div>
//                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">
//                                         System Verdict
//                                       </span>
//                                       <div
//                                         className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-tighter ${
//                                           [
//                                             "hire",
//                                             "pass",
//                                             "strong pass",
//                                           ].includes(
//                                             round.review.decision?.toLowerCase(),
//                                           )
//                                             ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
//                                             : "bg-rose-500 text-white shadow-lg shadow-rose-100"
//                                         }`}
//                                       >
//                                         {/* Dynamic Icon Logic */}
//                                         {[
//                                           "hire",
//                                           "pass",
//                                           "strong pass",
//                                         ].includes(
//                                           round.review.decision?.toLowerCase(),
//                                         ) ? (
//                                           <ShieldCheck
//                                             size={14}
//                                             className={
//                                               round.review.decision?.toLowerCase() ===
//                                               "strong pass"
//                                                 ? "animate-pulse"
//                                                 : ""
//                                             }
//                                           />
//                                         ) : (
//                                           <Activity size={14} />
//                                         )}

//                                         {/* Label Display */}
//                                         {round.review.decision}
//                                       </div>
//                                     </div>

//                                     <div>
//                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
//                                         Weighted Performance
//                                       </span>
//                                       <div className="flex items-baseline gap-1">
//                                         <span className="text-4xl font-black text-slate-900 tracking-tighter">
//                                           {round.review.total_score
//                                             ? Math.round(
//                                                 round.review.total_score * 10,
//                                               )
//                                             : 0}
//                                         </span>
//                                         <span className="text-slate-300 font-bold text-sm">
//                                           /100
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {/* RIGHT PANEL: METRICS & REMARKS */}
//                                   <div className="md:col-span-8 p-6 space-y-6">
//                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
//                                       {[
//                                         {
//                                           l: "Technical",
//                                           v: round.review.technical_skill,
//                                         },
//                                         {
//                                           l: "Linguistics",
//                                           v: round.review.communication,
//                                         },
//                                         {
//                                           l: "Cognition",
//                                           v: round.review.problem_solving,
//                                         },
//                                         {
//                                           l: "Cultural",
//                                           v: round.review.cultural_fit,
//                                         },
//                                         {
//                                           l: "Domain Exp",
//                                           v: round.review.relevant_experience,
//                                         },
//                                       ].map((stat, i) => (
//                                         <div key={i} className="space-y-1.5">
//                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                             {stat.l}
//                                           </p>
//                                           <div className="flex items-center gap-2">
//                                             <div className="flex gap-0.5">
//                                               {[...Array(5)].map((_, star) => (
//                                                 <div
//                                                   key={star}
//                                                   className={`w-1.5 h-3 rounded-full ${star < stat.v ? "bg-blue-600" : "bg-slate-100"}`}
//                                                 />
//                                               ))}
//                                             </div>
//                                             <span className="text-[10px] font-black text-slate-900">
//                                               {stat.v}/10
//                                             </span>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>

//                                     {round.review.remarks && (
//                                       <div className="pt-4 border-t border-slate-50">
//                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
//                                           Executive Summary
//                                         </p>
//                                         <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100/50 italic">
//                                           "{round.review.remarks}"
//                                         </p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
//                                 <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin mb-3" />
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                                   Interview Pending
//                                 </p>
//                                 <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
//                                   Awaiting Post-Round Analytical Input
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* --- FOOTER ACTIONS (Refined Padding) --- */}
//             <div className="px-10 py-8 bg-slate-50/80 border-t border-slate-100 flex justify-end items-center gap-6">
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
//               >
//                 Dismiss
//               </button>
//               {/* <button className="px-8 py-4 bg-slate-900 text-white rounded-[18px] text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 shadow-2xl shadow-slate-200 transition-all active:scale-95">
//           Download Executive Summary
//         </button> */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//**********************************************************working code phase 18 9/02/26******************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Users,
//   ShieldCheck,
//   Briefcase,
//   Zap,
//   Search,
//   Filter,
//   ArrowUpRight,
//   Plus,
//   Lock,
//   FileText,
//   Activity,
//   Clock,
//   CheckCircle2,
//   Database,
//   XCircle,
//   Timer,
//   Mail,
//   Award,
//   UserPlus,
//   LogOut,
//   ShieldAlert,
//   Fingerprint,
//   CreditCard,
//   Landmark,
//   PenTool,
//   Video,
//   MapPin,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates");
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [decisionFilter, setDecisionFilter] = useState("All");
//   const navigate = useNavigate();

//   // debounced search
//   const debouncedSearch = useDebounce(searchText, 1000);

//   useEffect(() => {
//     if (activeTab === "candidates") {
//       fetchDashboardStats();
//     }
//   }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   const buildFilters = (extra = {}) => {
//     const filters = {};

//     if (extra.type) filters.type = extra.type;

//     // ONLY send range if not ALL
//     if (timeRange && timeRange !== "All") {
//       filters.range = timeRange;
//     }

//     // if (searchText) filters.search = searchText;

//     if (debouncedSearch) filters.search = debouncedSearch;

//     if (statusFilter !== "All") {
//       filters.status = statusFilter.toLowerCase();
//     }

//     if (extra.location) filters.location = extra.location;

//     return filters;
//   };

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();

//       const data = await dashboardService.getCandidateStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // Map interviews by date (YYYY-MM-DD)
//   const interviewDateMap = useMemo(() => {
//     const map = {};

//     interviewReviews.forEach((candidate) => {
//       candidate.interviews?.forEach((round) => {
//         if (!round.interview_date) return;

//         const dt = new Date(round.interview_date);
//         const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

//         if (!map[d]) map[d] = [];

//         map[d].push({
//           id: candidate.id,
//           name: candidate.full_name,
//           round: round.round_number,
//           status: round.status, // completed / scheduled
//           mode: round.mode,
//           time: new Date(round.interview_date).toLocaleTimeString(),
//         });
//       });
//     });

//     return map;
//   }, [interviewReviews]);

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       {
//         id: "total",
//         label: "Total Candidates",
//         type: "all",
//         val: apiStats?.total_candidates ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "interviewing",
//         label: "Interviewing",
//         type: "interviewing",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "interviewing")
//             ?.count ?? 0,
//         icon: <Video size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       {
//         id: "migrated",
//         label: "Migrated",
//         type: "migrated",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "migrated")
//             ?.count ?? 0,
//         icon: <CheckCircle2 size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "manual",
//         label: "Manual Entry",
//         type: "manual",
//         val:
//           apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
//             ?.count ?? 0,
//         icon: <Database size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//     ],
//     employees: [
//       {
//         id: "kyc_pending",
//         label: "KYC Pending",
//         val: "14",
//         icon: <Fingerprint size={20} />,
//         color: "text-rose-600",
//         bg: "bg-rose-50",
//       },
//       {
//         id: "esign",
//         label: "eSign Done",
//         val: "112",
//         icon: <PenTool size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "probation",
//         label: "On Probation",
//         val: "84",
//         icon: <ShieldAlert size={20} />,
//         color: "text-orange-600",
//         bg: "bg-orange-50",
//       },
//       {
//         id: "active",
//         label: "Active Staff",
//         val: "1.2k",
//         icon: <ShieldCheck size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         // 🔎 Debounced Search
//         const matchSearch = item.full_name
//           ?.toLowerCase()
//           .includes(debouncedSearch.toLowerCase());

//         // API status filter (existing)
//         const matchStatus =
//           statusFilter === "All" || item.status === statusFilter.toLowerCase();

//         // 🎯 Decision filter (from review)
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision; // pass / reject / strong_pass
//         }

//         const matchDecision =
//           decisionFilter === "All" || decision === decisionFilter;

//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];

//         const score = lastInterview?.review?.total_score
//           ? Math.round(lastInterview.review.total_score * 10)
//           : null;

//         const decision = lastInterview?.review?.decision;

//         let statusLabel = "In Progress";
//         if (decision === "strong_pass") statusLabel = "Strong Pass";
//         else if (decision === "pass") statusLabel = "Pass";
//         else if (decision === "reject") statusLabel = "Reject";

//         return {
//           id: item.id,
//           name: item.full_name,
//           status: statusLabel,
//           score,
//           stars: Math.round((score || 0) / 20),
//           date: new Date(item.updated_at).toLocaleDateString(),
//         };
//       });
//   }, [interviewReviews, debouncedSearch, statusFilter, decisionFilter]);

//   const interviewStatusMeta = {
//     completed: {
//       color: "bg-emerald-500",
//       text: "Completed",
//     },
//     scheduled: {
//       color: "bg-amber-500",
//       text: "Scheduled",
//     },
//     cancelled: {
//       color: "bg-rose-500",
//       text: "Cancelled",
//     },
//     pending: {
//       color: "bg-blue-500",
//       text: "Pending",
//     },
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Core Terminal
//             </span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === "candidates"
//               ? "Talent Acquisition"
//               : "Employee Governance"}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {["All", "Today", "Week", "Monthly"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range
//                     ? "bg-slate-900 text-white shadow-md"
//                     : "text-slate-400 hover:bg-slate-100"
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           {
//             id: "candidates",
//             label: "Candidates",
//             icon: <UserPlus size={16} />,
//           },
//           {
//             id: "employees",
//             label: "Employees",
//             icon: <Briefcase size={16} />,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => {
//               setActiveTab(tab.id);
//               setActiveView("dashboard");
//             }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id
//                 ? "text-blue-600"
//                 : "text-slate-400 hover:text-slate-600"
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && (
//               <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {activeView === "dashboard" ? (
//         <div className="grid grid-cols-12 gap-8">
//           {/* --- KPI CARDS --- */}

//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {loading ? (
//               <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//                 Loading dashboard...
//               </div>
//             ) : (
//               stats[activeTab].map((stat) => (
//                 <div
//                   key={stat.id}
//                   onClick={() =>
//                     navigate(`/dashboard/candidate-table?type=${stat.type}`)
//                   }
//                   className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                 >
//                   <div
//                     className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                   >
//                     {stat.icon}
//                     {console.log("new data show in code", stat)}
//                   </div>

//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     {stat.label}
//                   </p>

//                   <h2 className="text-2xl font-black text-slate-900">
//                     {stat.val}
//                   </h2>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview
//                 Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {/* Search */}
//                 <div className="relative">
//                   <Search
//                     size={14}
//                     className="absolute left-3 top-2.5 text-slate-400"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search candidate..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//                   />
//                 </div>

//                 {/* Status Filter */}

//                 {/* Decision Filter */}
//                 <select
//                   value={decisionFilter}
//                   onChange={(e) => setDecisionFilter(e.target.value)}
//                   className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//                 >
//                   <option value="All">All Decision</option>
//                   <option value="strong_pass">Strong Pass</option>
//                   <option value="pass">Pass</option>
//                   <option value="reject">Reject</option>
//                   <option value="in_progress">In Progress</option>
//                 </select>
//               </div>

//               <div className="space-y-4">
//                 {filteredInterviewReviews.map((review) => {
//                   const fullCandidate = interviewReviews.find(
//                     (c) => c.id === review.id,
//                   );

//                   return (
//                     <div
//                       key={review.id}
//                       onClick={() => setSelectedCandidate(fullCandidate)}
//                       className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//                     >
//                       {/* LEFT */}
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`p-3 rounded-2xl ${
//                             review.status === "Reject"
//                               ? "bg-rose-100 text-rose-600"
//                               : review.status === "Strong Pass"
//                                 ? "bg-emerald-100 text-emerald-600"
//                                 : "bg-blue-100 text-blue-600"
//                           }`}
//                         >
//                           {review.status === "Reject" ? (
//                             <ThumbsDown size={18} />
//                           ) : (
//                             <ThumbsUp size={18} />
//                           )}
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-black text-slate-900">
//                             {review.name}
//                           </h4>

//                           <div className="flex items-center gap-2 mt-1">
//                             <span
//                               className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                                 review.status === "Reject"
//                                   ? "bg-rose-200 text-rose-700"
//                                   : review.status === "Strong Pass"
//                                     ? "bg-emerald-200 text-emerald-700"
//                                     : "bg-blue-200 text-blue-700"
//                               }`}
//                             >
//                               {review.status}
//                             </span>

//                             <span className="text-[9px] font-bold text-slate-400 uppercase">
//                               {review.date}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* RIGHT SCORE */}
//                       {(review.status === "Pass" ||
//                         review.status === "Strong Pass") && (
//                         <div className="flex items-center gap-8">
//                           <div className="hidden md:flex flex-col items-end">
//                             <div className="flex gap-0.5 mb-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   size={12}
//                                   className={
//                                     i < review.stars
//                                       ? "fill-amber-400 text-amber-400"
//                                       : "text-slate-200"
//                                   }
//                                 />
//                               ))}
//                             </div>

//                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                               Feedback Rating
//                             </p>
//                           </div>

//                           <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                             <p className="text-[8px] font-black text-slate-400 uppercase">
//                               Score
//                             </p>

//                             <p className="text-lg font-black text-blue-600">
//                               {review.score ?? 0}
//                               <span className="text-[10px] text-slate-300">
//                                 /100
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {/* REJECT LABEL */}
//                       {review.status === "Reject" && (
//                         <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                           Profile Archived
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview
//                 Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true },
//                 ].map((box, i) => (
//                   <div
//                     key={i}
//                     className={`p-4 rounded-3xl border ${box.red ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
//                   >
//                     <p className="text-[9px] font-black text-slate-400 uppercase">
//                       {box.label}
//                     </p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
//                       {box.sub}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
//                 Interview Calendar
//               </h4>

//               {/* Calendar */}

//               {/* <Calendar
//                 value={calendarDate}
//                 onChange={setCalendarDate}
//                 tileClassName={({ date, view }) => {
//                   if (view !== "month") return null;

//                   // const d = date.toISOString().split("T")[0];
//                   const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                   const list = interviewDateMap[d];

//                   if (!list) return null;

//                   const hasCompleted = list.some(
//                     (i) => i.status === "completed",
//                   );
//                   const hasScheduled = list.some(
//                     (i) => i.status === "scheduled",
//                   );

//                   if (hasCompleted)
//                     return "bg-emerald-100 text-emerald-700 rounded-lg";
//                   if (hasScheduled)
//                     return "bg-amber-100 text-amber-700 rounded-lg";

//                   return "bg-blue-100 text-blue-700 rounded-lg";
//                 }}
//               /> */}

//               <Calendar
//                 value={calendarDate}
//                 onChange={setCalendarDate}
//                 tileContent={({ date, view }) => {
//                   if (view !== "month") return null;

//                   const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                   const list = interviewDateMap[d];

//                   if (!list) return null;

//                   return (
//                     <div className="flex justify-center mt-1 gap-1">
//                       {list.slice(0, 3).map((item, i) => (
//                         <span
//                           key={i}
//                           className={`w-1.5 h-1.5 rounded-full ${
//                             interviewStatusMeta[item.status]?.color ||
//                             "bg-slate-400"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   );
//                 }}
//               />

//               {/* Selected Day Interviews */}

//               <div className="mt-4 max-h-56 overflow-auto">
//                 {(() => {
//                   // const d = calendarDate.toISOString().split("T")[0];
//                   const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
//                   const list = interviewDateMap[d];

//                   if (!list || list.length === 0)
//                     return (
//                       <div className="text-xs text-slate-400">
//                         No interviews scheduled
//                       </div>
//                     );

//                   return list.map((item, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border rounded-xl mb-2 bg-slate-50 flex justify-between items-center"
//                     >
//                       <div>
//                         <div className="text-xs font-bold">{item.name}</div>
//                         <div className="text-[10px] text-slate-500">
//                           Round {item.round} • {item.mode}
//                         </div>
//                         <div className="text-[10px] text-slate-400">
//                           {item.time}
//                         </div>
//                       </div>

//                       {/* Status Badge */}
//                       <div
//                         className={`text-[9px] px-2 py-1 rounded-full font-bold uppercase
//           ${
//             item.status === "completed"
//               ? "bg-emerald-100 text-emerald-700"
//               : "bg-amber-100 text-amber-700"
//           }`}
//                       >
//                         {item.status}
//                       </div>
//                     </div>
//                   ));
//                 })()}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">
//                 eSign Status Workflow
//               </h4>
//               <div className="space-y-4">
//                 {["Document Uploaded", "Pending Signature", "Signed"].map(
//                   (status, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                         <span>{status}</span>
//                         <span>{Math.floor(Math.random() * 100)}%</span>
//                       </div>
//                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                         <div
//                           className="bg-blue-600 h-full"
//                           style={{ width: `${Math.random() * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//             <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//             <button
//               onClick={() => setActiveView("dashboard")}
//               className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <div className="p-10">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                 <div>
//                   <p className="text-sm font-black">Rajesh Kumar</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">
//                     Aadhaar: Verified | eSign: Pending | Interview: Online
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Attended
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Doc Uploaded
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
//           <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">
//             {/* Header */}
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-black">
//                   {selectedCandidate.full_name}
//                 </h2>
//                 <p className="text-xs text-slate-500">
//                   {selectedCandidate.email} • {selectedCandidate.phone}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="text-slate-400 hover:text-slate-700"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">
//               {/* Candidate Info */}
//               <div className="grid grid-cols-2 gap-4 text-xs">
//                 <div>
//                   <b>Status:</b> {selectedCandidate.status}
//                 </div>
//                 <div>
//                   <b>Position:</b> {selectedCandidate.position}
//                 </div>
//                 <div>
//                   <b>Experience:</b> {selectedCandidate.experience}
//                 </div>
//                 <div>
//                   <b>Location:</b> {selectedCandidate.location}
//                 </div>
//                 <div>
//                   <b>Entry:</b> {selectedCandidate.entry_method}
//                 </div>
//                 <div>
//                   <b>Created:</b>{" "}
//                   {selectedCandidate.created_at
//                     ? new Date(
//                         selectedCandidate.created_at,
//                       ).toLocaleDateString()
//                     : "-"}
//                 </div>
//               </div>

//               {/* Interviews */}
//               <div>
//                 <h3 className="font-black text-sm mb-3">Interview Rounds</h3>

//                 {selectedCandidate.interviews?.length === 0 && (
//                   <div className="text-xs text-slate-400">
//                     No interview conducted
//                   </div>
//                 )}

//                 {selectedCandidate.interviews?.map((round) => (
//                   <div
//                     key={round.id}
//                     className="border rounded-xl p-4 mb-3 bg-slate-50"
//                   >
//                     <div className="flex justify-between text-xs mb-2">
//                       <span>
//                         <b>Round:</b> {round.round_number}
//                       </span>
//                       <span>
//                         <b>Status:</b> {round.status}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-xs mb-2">
//                       <span>
//                         <b>Mode:</b> {round.mode}
//                       </span>
//                       <span>
//                         <b>Date:</b>{" "}
//                         {new Date(round.interview_date).toLocaleString()}
//                       </span>
//                     </div>

//                     {/* Review */}
//                     {round.review ? (
//                       <div className="mt-3 p-3 bg-white rounded-lg border text-xs">
//                         <div className="flex justify-between mb-2">
//                           <span>
//                             <b>Decision:</b> {round.review.decision}
//                           </span>
//                           <span>
//                             <b>Score:</b>{" "}
//                             {round.review.total_score
//                               ? Math.round(round.review.total_score * 10)
//                               : 0}
//                             /100
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-2 gap-2">
//                           <div>Technical: {round.review.technical_skill}</div>
//                           <div>Communication: {round.review.communication}</div>
//                           <div>
//                             Problem Solving: {round.review.problem_solving}
//                           </div>
//                           <div>Culture Fit: {round.review.cultural_fit}</div>
//                           <div>
//                             Experience: {round.review.relevant_experience}
//                           </div>
//                         </div>

//                         {round.review.remarks && (
//                           <div className="mt-2 text-slate-600">
//                             <b>Remarks:</b> {round.review.remarks}
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="text-xs text-slate-400 mt-2">
//                         No review submitted
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//*****************************************************working code phase 12*********************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Users,
//   ShieldCheck,
//   Briefcase,
//   Zap,
//   Search,
//   Filter,
//   ArrowUpRight,
//   Plus,
//   Lock,
//   FileText,
//   Activity,
//   Clock,
//   CheckCircle2,
//   Database,
//   XCircle,
//   Timer,
//   Mail,
//   Award,
//   UserPlus,
//   LogOut,
//   ShieldAlert,
//   Fingerprint,
//   CreditCard,
//   Landmark,
//   PenTool,
//   Video,
//   MapPin,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

//  function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates");
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//  const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [decisionFilter, setDecisionFilter] = useState("All");
//   const navigate = useNavigate();

//   // debounced search
// const debouncedSearch = useDebounce(searchText, 1000);

//   // useEffect(() => {
//   //   if (activeTab === "candidates") {
//   //     fetchDashboardStats();
//   //   }
//   // }, [timeRange, searchText, statusFilter, activeTab]);

//   useEffect(() => {
//   if (activeTab === "candidates") {
//     fetchDashboardStats();
//   }
// }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   const buildFilters = (extra = {}) => {
//   const filters = {};

//   if (extra.type) filters.type = extra.type;

//   // ONLY send range if not ALL
//   if (timeRange && timeRange !== "All") {
//     filters.range = timeRange;
//   }

//   // if (searchText) filters.search = searchText;

//   if (debouncedSearch) filters.search = debouncedSearch;

//   if (statusFilter !== "All") {
//     filters.status = statusFilter.toLowerCase();
//   }

//   if (extra.location) filters.location = extra.location;

//   return filters;
// };

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();

//       const data = await dashboardService.getCandidateStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // Map interviews by date (YYYY-MM-DD)
// // const interviewDateMap = useMemo(() => {
// //   const map = {};

// //   interviewReviews.forEach((candidate) => {
// //     candidate.interviews?.forEach((round) => {
// //       if (!round.interview_date) return;

// //       const d = new Date(round.interview_date)
// //         .toISOString()
// //         .split("T")[0];

// //       if (!map[d]) map[d] = [];
// //       map[d].push({
// //         name: candidate.full_name,
// //         round: round.round_number,
// //         status: round.status,
// //         mode: round.mode,
// //         time: new Date(round.interview_date).toLocaleTimeString(),
// //       });
// //     });
// //   });

// //   return map;
// // }, [interviewReviews]);

// // Map interviews by date (YYYY-MM-DD)
// const interviewDateMap = useMemo(() => {
//   const map = {};

//   interviewReviews.forEach((candidate) => {
//     candidate.interviews?.forEach((round) => {
//       if (!round.interview_date) return;

//       // const d = new Date(round.interview_date)
//       //   .toISOString()
//       //   .split("T")[0];

// //       const dt = new Date(round.interview_date);
// // const d = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;

// const dt = new Date(round.interview_date);
// const d = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;

//       if (!map[d]) map[d] = [];

//       map[d].push({
//         id: candidate.id,
//         name: candidate.full_name,
//         round: round.round_number,
//         status: round.status, // completed / scheduled
//         mode: round.mode,
//         time: new Date(round.interview_date).toLocaleTimeString(),
//       });
//     });
//   });

//   return map;
// }, [interviewReviews]);

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       {
//         id: "total",
//         label: "Total Candidates",
//         type: "all",
//         val: apiStats?.total_candidates ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "interviewing",
//         label: "Interviewing",
//         type: "interviewing",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "interviewing")
//             ?.count ?? 0,
//         icon: <Video size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       {
//         id: "migrated",
//         label: "Migrated",
//         type: "migrated",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "migrated")
//             ?.count ?? 0,
//         icon: <CheckCircle2 size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "manual",
//         label: "Manual Entry",
//         type: "manual",
//         val:
//           apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
//             ?.count ?? 0,
//         icon: <Database size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//     ],
//     employees: [
//       {
//         id: "kyc_pending",
//         label: "KYC Pending",
//         val: "14",
//         icon: <Fingerprint size={20} />,
//         color: "text-rose-600",
//         bg: "bg-rose-50",
//       },
//       {
//         id: "esign",
//         label: "eSign Done",
//         val: "112",
//         icon: <PenTool size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "probation",
//         label: "On Probation",
//         val: "84",
//         icon: <ShieldAlert size={20} />,
//         color: "text-orange-600",
//         bg: "bg-orange-50",
//       },
//       {
//         id: "active",
//         label: "Active Staff",
//         val: "1.2k",
//         icon: <ShieldCheck size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//     ],
//   };

//   // const filteredInterviewReviews = interviewReviews
//   //   .filter((item) => {
//   //     const matchSearch = item.full_name
//   //       ?.toLowerCase()
//   //       .includes(searchText.toLowerCase());

//   //     const matchStatus =
//   //       statusFilter === "All" || item.status === statusFilter.toLowerCase();

//   //     return matchSearch && matchStatus;
//   //   })
//   //   .map((item) => {
//   //     const lastInterview = item.interviews?.[item.interviews.length - 1];

//   //     const score = lastInterview?.review?.total_score
//   //       ? Math.round(lastInterview.review.total_score * 10)
//   //       : null;

//   //     const decision = lastInterview?.review?.decision;

//   //     let statusLabel = "In Progress";
//   //     if (decision === "strong_pass") statusLabel = "Strong Pass";
//   //     else if (decision === "pass") statusLabel = "Pass";
//   //     else if (decision === "reject") statusLabel = "Reject";

//   //     return {
//   //       id: item.id,
//   //       name: item.full_name,
//   //       status: statusLabel,
//   //       score,
//   //       stars: Math.round((score || 0) / 20),
//   //       date: new Date(item.updated_at).toLocaleDateString(),
//   //     };
//   //   });

//   const filteredInterviewReviews = useMemo(() => {
//   return interviewReviews
//     .filter((item) => {
//       // 🔎 Debounced Search
//       const matchSearch = item.full_name
//         ?.toLowerCase()
//         .includes(debouncedSearch.toLowerCase());

//       // API status filter (existing)
//       const matchStatus =
//         statusFilter === "All" ||
//         item.status === statusFilter.toLowerCase();

//       // 🎯 Decision filter (from review)
//       const lastInterview = item.interviews?.[item.interviews.length - 1];

//       let decision = "in_progress";
//       if (lastInterview?.review?.decision) {
//         decision = lastInterview.review.decision; // pass / reject / strong_pass
//       }

//       const matchDecision =
//         decisionFilter === "All" ||
//         decision === decisionFilter;

//       return matchSearch && matchStatus && matchDecision;
//     })
//     .map((item) => {
//       const lastInterview = item.interviews?.[item.interviews.length - 1];

//       const score = lastInterview?.review?.total_score
//         ? Math.round(lastInterview.review.total_score * 10)
//         : null;

//       const decision = lastInterview?.review?.decision;

//       let statusLabel = "In Progress";
//       if (decision === "strong_pass") statusLabel = "Strong Pass";
//       else if (decision === "pass") statusLabel = "Pass";
//       else if (decision === "reject") statusLabel = "Reject";

//       return {
//         id: item.id,
//         name: item.full_name,
//         status: statusLabel,
//         score,
//         stars: Math.round((score || 0) / 20),
//         date: new Date(item.updated_at).toLocaleDateString(),
//       };
//     });
// }, [interviewReviews, debouncedSearch, statusFilter, decisionFilter]);

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Core Terminal
//             </span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === "candidates"
//               ? "Talent Acquisition"
//               : "Employee Governance"}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {["All", "Today", "Week", "Monthly"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range
//                     ? "bg-slate-900 text-white shadow-md"
//                     : "text-slate-400 hover:bg-slate-100"
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           {
//             id: "candidates",
//             label: "Candidates",
//             icon: <UserPlus size={16} />,
//           },
//           {
//             id: "employees",
//             label: "Employees",
//             icon: <Briefcase size={16} />,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => {
//               setActiveTab(tab.id);
//               setActiveView("dashboard");
//             }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id
//                 ? "text-blue-600"
//                 : "text-slate-400 hover:text-slate-600"
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && (
//               <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {activeView === "dashboard" ? (
//         <div className="grid grid-cols-12 gap-8">
//           {/* --- KPI CARDS --- */}

//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {loading ? (
//               <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//                 Loading dashboard...
//               </div>
//             ) : (
//               stats[activeTab].map((stat) => (
//                 <div
//                   key={stat.id}
//                   onClick={() =>
//                     navigate(`/dashboard/candidate-table?type=${stat.type}`)
//                   }
//                   className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                 >
//                   <div
//                     className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                   >
//                     {stat.icon}
//                     {console.log("new data show in code", stat)}
//                   </div>

//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     {stat.label}
//                   </p>

//                   <h2 className="text-2xl font-black text-slate-900">
//                     {stat.val}
//                   </h2>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview
//                 Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {/* Search */}
//                 <div className="relative">
//                   <Search
//                     size={14}
//                     className="absolute left-3 top-2.5 text-slate-400"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search candidate..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//                   />
//                 </div>

//                 {/* Status Filter */}
//                 {/* <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="Strong Pass">Strong Pass</option>
//                   <option value="Pass">Pass</option>
//                   <option value="Reject">Reject</option>
//                 </select> */}
//                 {/* Decision Filter */}
// <select
//   value={decisionFilter}
//   onChange={(e) => setDecisionFilter(e.target.value)}
//   className="px-3 py-2 text-xs rounded-xl border border-slate-200"
// >
//   <option value="All">All Decision</option>
//   <option value="strong_pass">Strong Pass</option>
//   <option value="pass">Pass</option>
//   <option value="reject">Reject</option>
//   <option value="in_progress">In Progress</option>
// </select>

//               </div>

//               <div className="space-y-4">
//   {filteredInterviewReviews.map((review) => {
//     const fullCandidate = interviewReviews.find(
//       (c) => c.id === review.id
//     );

//     return (
//       <div
//         key={review.id}
//         onClick={() => setSelectedCandidate(fullCandidate)}
//         className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-4">
//           <div
//             className={`p-3 rounded-2xl ${
//               review.status === "Reject"
//                 ? "bg-rose-100 text-rose-600"
//                 : review.status === "Strong Pass"
//                 ? "bg-emerald-100 text-emerald-600"
//                 : "bg-blue-100 text-blue-600"
//             }`}
//           >
//             {review.status === "Reject" ? (
//               <ThumbsDown size={18} />
//             ) : (
//               <ThumbsUp size={18} />
//             )}
//           </div>

//           <div>
//             <h4 className="text-sm font-black text-slate-900">
//               {review.name}
//             </h4>

//             <div className="flex items-center gap-2 mt-1">
//               <span
//                 className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                   review.status === "Reject"
//                     ? "bg-rose-200 text-rose-700"
//                     : review.status === "Strong Pass"
//                     ? "bg-emerald-200 text-emerald-700"
//                     : "bg-blue-200 text-blue-700"
//                 }`}
//               >
//                 {review.status}
//               </span>

//               <span className="text-[9px] font-bold text-slate-400 uppercase">
//                 {review.date}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SCORE */}
//         {(review.status === "Pass" ||
//           review.status === "Strong Pass") && (
//           <div className="flex items-center gap-8">
//             <div className="hidden md:flex flex-col items-end">
//               <div className="flex gap-0.5 mb-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={12}
//                     className={
//                       i < review.stars
//                         ? "fill-amber-400 text-amber-400"
//                         : "text-slate-200"
//                     }
//                   />
//                 ))}
//               </div>

//               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                 Feedback Rating
//               </p>
//             </div>

//             <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//               <p className="text-[8px] font-black text-slate-400 uppercase">
//                 Score
//               </p>

//               <p className="text-lg font-black text-blue-600">
//                 {review.score ?? 0}
//                 <span className="text-[10px] text-slate-300">/100</span>
//               </p>
//             </div>
//           </div>
//         )}

//         {/* REJECT LABEL */}
//         {review.status === "Reject" && (
//           <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//             Profile Archived
//           </div>
//         )}
//       </div>
//     );
//   })}
// </div>

//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview
//                 Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true },
//                 ].map((box, i) => (
//                   <div
//                     key={i}
//                     className={`p-4 rounded-3xl border ${box.red ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
//                   >
//                     <p className="text-[9px] font-black text-slate-400 uppercase">
//                       {box.label}
//                     </p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
//                       {box.sub}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             {/* <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">
//                 Verification Registry
//               </h4>
//               <div className="space-y-5">
//                 {[
//                   {
//                     label: "Address Verified",
//                     count: 89,
//                     icon: <MapPin size={12} />,
//                   },
//                   {
//                     label: "Aadhaar / PAN",
//                     count: 142,
//                     icon: <CreditCard size={12} />,
//                   },
//                   {
//                     label: "Bank Details",
//                     count: 76,
//                     icon: <Landmark size={12} />,
//                   },
//                   {
//                     label: "eSign (Pending)",
//                     count: 12,
//                     icon: <PenTool size={12} />,
//                     alert: true,
//                   },
//                 ].map((doc, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`p-2 rounded-lg ${doc.alert ? "bg-rose-500/20 text-rose-400" : "bg-blue-500/20 text-blue-400"}`}
//                       >
//                         {doc.icon}
//                       </div>
//                       <span className="text-[10px] font-bold uppercase">
//                         {doc.label}
//                       </span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div> */}

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
//   <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
//     Interview Calendar
//   </h4>

//   {/* Calendar */}
//   {/* <Calendar
//     value={calendarDate}
//     onChange={setCalendarDate}
//     tileClassName={({ date, view }) => {
//       if (view !== "month") return null;

//       const d = date.toISOString().split("T")[0];
//       return interviewDateMap[d]
//         ? "bg-blue-100 text-blue-700 rounded-lg"
//         : null;
//     }}
//   /> */}
//   <Calendar
//   value={calendarDate}
//   onChange={setCalendarDate}
//   tileClassName={({ date, view }) => {
//     if (view !== "month") return null;

//     // const d = date.toISOString().split("T")[0];
//     const d = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
//     const list = interviewDateMap[d];

//     if (!list) return null;

//     const hasCompleted = list.some((i) => i.status === "completed");
//     const hasScheduled = list.some((i) => i.status === "scheduled");

//     if (hasCompleted) return "bg-emerald-100 text-emerald-700 rounded-lg";
//     if (hasScheduled) return "bg-amber-100 text-amber-700 rounded-lg";

//     return "bg-blue-100 text-blue-700 rounded-lg";
//   }}
// />

//   {/* Selected Day Interviews */}
//   {/* <div className="mt-4 max-h-48 overflow-auto">
//     {(() => {
//       const d = calendarDate.toISOString().split("T")[0];
//       const list = interviewDateMap[d];

//       if (!list || list.length === 0)
//         return (
//           <div className="text-xs text-slate-400">
//             No interviews scheduled
//           </div>
//         );

//       return list.map((item, i) => (
//         <div
//           key={i}
//           className="p-3 border rounded-xl mb-2 bg-slate-50"
//         >
//           <div className="text-xs font-bold">{item.name}</div>
//           <div className="text-[10px] text-slate-500">
//             Round {item.round} • {item.mode}
//           </div>
//           <div className="text-[10px] text-blue-600">
//             {item.time} • {item.status}
//           </div>
//         </div>
//       ));
//     })()}
//   </div> */}
//   <div className="mt-4 max-h-56 overflow-auto">
//   {(() => {
//     // const d = calendarDate.toISOString().split("T")[0];
//     const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth()+1).padStart(2,"0")}-${String(calendarDate.getDate()).padStart(2,"0")}`;
//     const list = interviewDateMap[d];

//     if (!list || list.length === 0)
//       return (
//         <div className="text-xs text-slate-400">
//           No interviews scheduled
//         </div>
//       );

//     return list.map((item, i) => (
//       <div
//         key={i}
//         className="p-3 border rounded-xl mb-2 bg-slate-50 flex justify-between items-center"
//       >
//         <div>
//           <div className="text-xs font-bold">{item.name}</div>
//           <div className="text-[10px] text-slate-500">
//             Round {item.round} • {item.mode}
//           </div>
//           <div className="text-[10px] text-slate-400">{item.time}</div>
//         </div>

//         {/* Status Badge */}
//         <div
//           className={`text-[9px] px-2 py-1 rounded-full font-bold uppercase
//           ${
//             item.status === "completed"
//               ? "bg-emerald-100 text-emerald-700"
//               : "bg-amber-100 text-amber-700"
//           }`}
//         >
//           {item.status}
//         </div>
//       </div>
//     ));
//   })()}
// </div>

// </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">
//                 eSign Status Workflow
//               </h4>
//               <div className="space-y-4">
//                 {["Document Uploaded", "Pending Signature", "Signed"].map(
//                   (status, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                         <span>{status}</span>
//                         <span>{Math.floor(Math.random() * 100)}%</span>
//                       </div>
//                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                         <div
//                           className="bg-blue-600 h-full"
//                           style={{ width: `${Math.random() * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//             <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//             <button
//               onClick={() => setActiveView("dashboard")}
//               className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <div className="p-10">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                 <div>
//                   <p className="text-sm font-black">Rajesh Kumar</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">
//                     Aadhaar: Verified | eSign: Pending | Interview: Online
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Attended
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Doc Uploaded
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
// {selectedCandidate && (
//   <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
//     <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">

//       {/* Header */}
//       <div className="p-6 border-b flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-black">{selectedCandidate.full_name}</h2>
//           <p className="text-xs text-slate-500">
//             {selectedCandidate.email} • {selectedCandidate.phone}
//           </p>
//         </div>

//         <button
//           onClick={() => setSelectedCandidate(null)}
//           className="text-slate-400 hover:text-slate-700"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Body */}
//       <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">

//         {/* Candidate Info */}
//         <div className="grid grid-cols-2 gap-4 text-xs">
//           <div><b>Status:</b> {selectedCandidate.status}</div>
//           <div><b>Position:</b> {selectedCandidate.position}</div>
//           <div><b>Experience:</b> {selectedCandidate.experience}</div>
//           <div><b>Location:</b> {selectedCandidate.location}</div>
//           <div><b>Entry:</b> {selectedCandidate.entry_method}</div>
//           <div><b>Created:</b> {selectedCandidate.created_at
//   ? new Date(selectedCandidate.created_at).toLocaleDateString()
//   : "-"
// }</div>
//         </div>

//         {/* Interviews */}
//         <div>
//           <h3 className="font-black text-sm mb-3">Interview Rounds</h3>

//           {selectedCandidate.interviews?.length === 0 && (
//             <div className="text-xs text-slate-400">No interview conducted</div>
//           )}

//           {selectedCandidate.interviews?.map((round) => (
//             <div key={round.id} className="border rounded-xl p-4 mb-3 bg-slate-50">

//               <div className="flex justify-between text-xs mb-2">
//                 <span><b>Round:</b> {round.round_number}</span>
//                 <span><b>Status:</b> {round.status}</span>
//               </div>

//               <div className="flex justify-between text-xs mb-2">
//                 <span><b>Mode:</b> {round.mode}</span>
//                 <span>
//                   <b>Date:</b>{" "}
//                   {new Date(round.interview_date).toLocaleString()}
//                 </span>
//               </div>

//               {/* Review */}
//               {round.review ? (
//                 <div className="mt-3 p-3 bg-white rounded-lg border text-xs">

//                   <div className="flex justify-between mb-2">
//                     <span><b>Decision:</b> {round.review.decision}</span>
//                     <span><b>Score:</b> {round.review.total_score
//   ? Math.round(round.review.total_score * 10)
//   : 0
// }/100</span>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <div>Technical: {round.review.technical_skill}</div>
//                     <div>Communication: {round.review.communication}</div>
//                     <div>Problem Solving: {round.review.problem_solving}</div>
//                     <div>Culture Fit: {round.review.cultural_fit}</div>
//                     <div>Experience: {round.review.relevant_experience}</div>
//                   </div>

//                   {round.review.remarks && (
//                     <div className="mt-2 text-slate-600">
//                       <b>Remarks:</b> {round.review.remarks}
//                     </div>
//                   )}

//                 </div>
//               ) : (
//                 <div className="text-xs text-slate-400 mt-2">
//                   No review submitted
//                 </div>
//               )}

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//**********************************************working code phase 12********************************************************* */
// import React, { useEffect, useState } from "react";
// import {
//   Users,
//   ShieldCheck,
//   Briefcase,
//   Zap,
//   Search,
//   Filter,
//   ArrowUpRight,
//   Plus,
//   Lock,
//   FileText,
//   Activity,
//   Clock,
//   CheckCircle2,
//   Database,
//   XCircle,
//   Timer,
//   Mail,
//   Award,
//   UserPlus,
//   LogOut,
//   ShieldAlert,
//   Fingerprint,
//   CreditCard,
//   Landmark,
//   PenTool,
//   Video,
//   MapPin,
//   Star,
//   ThumbsUp,
//   ThumbsDown,
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates");
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//  const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (activeTab === "candidates") {
//       fetchDashboardStats();
//     }
//   }, [timeRange, searchText, statusFilter, activeTab]);

//   // const buildFilters = () => ({
//   //   location: "vashi",
//   //   range: timeRange,        // Today | Week | Monthly
//   //   search: searchText || "",
//   //   status: statusFilter !== "All" ? statusFilter : ""
//   // });

//   // const buildFilters = (extra = {}) => {
//   //   const filters = {};

//   //   if (extra.type) filters.type = extra.type;

//   //   if (timeRange && timeRange !== "All") filters.range = timeRange;

//   //   if (searchText) filters.search = searchText;

//   //   if (statusFilter !== "All") filters.status = statusFilter.toLowerCase();

//   //   // REMOVE default location filter (important)
//   //   // Only apply if user selects location
//   //   if (extra.location) filters.location = extra.location;

//   //   return filters;
//   // };

//   const buildFilters = (extra = {}) => {
//   const filters = {};

//   if (extra.type) filters.type = extra.type;

//   // ONLY send range if not ALL
//   if (timeRange && timeRange !== "All") {
//     filters.range = timeRange;
//   }

//   if (searchText) filters.search = searchText;

//   if (statusFilter !== "All") {
//     filters.status = statusFilter.toLowerCase();
//   }

//   if (extra.location) filters.location = extra.location;

//   return filters;
// };

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);

//       const filters = buildFilters();

//       const data = await dashboardService.getCandidateStats(filters);

//       setApiStats(data);
//     } catch (err) {
//       console.error("Dashboard API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       {
//         id: "total",
//         label: "Total Candidates",
//         type: "all",
//         val: apiStats?.total_candidates ?? 0,
//         icon: <Users size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//       {
//         id: "interviewing",
//         label: "Interviewing",
//         type: "interviewing",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "interviewing")
//             ?.count ?? 0,
//         icon: <Video size={20} />,
//         color: "text-indigo-600",
//         bg: "bg-indigo-50",
//       },
//       {
//         id: "migrated",
//         label: "Migrated",
//         type: "migrated",
//         val:
//           apiStats?.status_distribution?.find((s) => s.label === "migrated")
//             ?.count ?? 0,
//         icon: <CheckCircle2 size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "manual",
//         label: "Manual Entry",
//         type: "manual",
//         val:
//           apiStats?.entry_method_distribution?.find((s) => s.label === "manual")
//             ?.count ?? 0,
//         icon: <Database size={20} />,
//         color: "text-amber-600",
//         bg: "bg-amber-50",
//       },
//     ],
//     employees: [
//       {
//         id: "kyc_pending",
//         label: "KYC Pending",
//         val: "14",
//         icon: <Fingerprint size={20} />,
//         color: "text-rose-600",
//         bg: "bg-rose-50",
//       },
//       {
//         id: "esign",
//         label: "eSign Done",
//         val: "112",
//         icon: <PenTool size={20} />,
//         color: "text-emerald-600",
//         bg: "bg-emerald-50",
//       },
//       {
//         id: "probation",
//         label: "On Probation",
//         val: "84",
//         icon: <ShieldAlert size={20} />,
//         color: "text-orange-600",
//         bg: "bg-orange-50",
//       },
//       {
//         id: "active",
//         label: "Active Staff",
//         val: "1.2k",
//         icon: <ShieldCheck size={20} />,
//         color: "text-blue-600",
//         bg: "bg-blue-50",
//       },
//     ],
//   };

//   const filteredInterviewReviews = interviewReviews
//     .filter((item) => {
//       const matchSearch = item.full_name
//         ?.toLowerCase()
//         .includes(searchText.toLowerCase());

//       const matchStatus =
//         statusFilter === "All" || item.status === statusFilter.toLowerCase();

//       return matchSearch && matchStatus;
//     })
//     .map((item) => {
//       const lastInterview = item.interviews?.[item.interviews.length - 1];

//       const score = lastInterview?.review?.total_score
//         ? Math.round(lastInterview.review.total_score * 10)
//         : null;

//       const decision = lastInterview?.review?.decision;

//       let statusLabel = "In Progress";
//       if (decision === "strong_pass") statusLabel = "Strong Pass";
//       else if (decision === "pass") statusLabel = "Pass";
//       else if (decision === "reject") statusLabel = "Reject";

//       return {
//         id: item.id,
//         name: item.full_name,
//         status: statusLabel,
//         score,
//         stars: Math.round((score || 0) / 20),
//         date: new Date(item.updated_at).toLocaleDateString(),
//       };
//     });

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Core Terminal
//             </span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === "candidates"
//               ? "Talent Acquisition"
//               : "Employee Governance"}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {["All", "Today", "Week", "Monthly"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range
//                     ? "bg-slate-900 text-white shadow-md"
//                     : "text-slate-400 hover:bg-slate-100"
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           {
//             id: "candidates",
//             label: "Candidates",
//             icon: <UserPlus size={16} />,
//           },
//           {
//             id: "employees",
//             label: "Employees",
//             icon: <Briefcase size={16} />,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => {
//               setActiveTab(tab.id);
//               setActiveView("dashboard");
//             }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id
//                 ? "text-blue-600"
//                 : "text-slate-400 hover:text-slate-600"
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && (
//               <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {activeView === "dashboard" ? (
//         <div className="grid grid-cols-12 gap-8">
//           {/* --- KPI CARDS --- */}

//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {loading ? (
//               <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//                 Loading dashboard...
//               </div>
//             ) : (
//               stats[activeTab].map((stat) => (
//                 <div
//                   key={stat.id}
//                   // onClick={() => {
//                   //   setSelectedCategory(stat.label);
//                   //   setActiveView("detail");
//                   // }}
//                   onClick={() =>
//                     navigate(`/dashboard/candidate-table?type=${stat.type}`)
//                   }
//                   className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                 >
//                   <div
//                     className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                   >
//                     {stat.icon}
//                     {console.log("new data show in code", stat)}
//                   </div>

//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     {stat.label}
//                   </p>

//                   <h2 className="text-2xl font-black text-slate-900">
//                     {stat.val}
//                   </h2>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview
//                 Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {/* Search */}
//                 <div className="relative">
//                   <Search
//                     size={14}
//                     className="absolute left-3 top-2.5 text-slate-400"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search candidate..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//                   />
//                 </div>

//                 {/* Status Filter */}
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="Strong Pass">Strong Pass</option>
//                   <option value="Pass">Pass</option>
//                   <option value="Reject">Reject</option>
//                 </select>
//               </div>

//               {/* <div className="space-y-4">
//                 {filteredInterviewReviews.map((review) => {

//   const fullCandidate = interviewReviews.find(c => c.id === review.id);
//                   return
//                   (
//                   <div
//                     key={review.id}
//                      onClick={() => setSelectedCandidate(fullCandidate)}
//                     className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={`p-3 rounded-2xl ${
//                           review.status === "Reject"
//                             ? "bg-rose-100 text-rose-600"
//                             : review.status === "Strong Pass"
//                               ? "bg-emerald-100 text-emerald-600"
//                               : "bg-blue-100 text-blue-600"
//                         }`}
//                       >
//                         {review.status === "Reject" ? (
//                           <ThumbsDown size={18} />
//                         ) : (
//                           <ThumbsUp size={18} />
//                         )}
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-black text-slate-900">
//                           {review.name}
//                         </h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span
//                             className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                               review.status === "Reject"
//                                 ? "bg-rose-200 text-rose-700"
//                                 : review.status === "Strong Pass"
//                                   ? "bg-emerald-200 text-emerald-700"
//                                   : "bg-blue-200 text-blue-700"
//                             }`}
//                           >
//                             {review.status}
//                           </span>
//                           <span className="text-[9px] font-bold text-slate-400 uppercase">
//                             {review.date}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {(review.status === "Pass" ||
//                       review.status === "Strong Pass") && (
//                       <div className="flex items-center gap-8">
//                         <div className="hidden md:flex flex-col items-end">
//                           <div className="flex gap-0.5 mb-1">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 size={12}
//                                 className={
//                                   i < review.stars
//                                     ? "fill-amber-400 text-amber-400"
//                                     : "text-slate-200"
//                                 }
//                               />
//                             ))}
//                           </div>
//                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                             Feedback Rating
//                           </p>
//                         </div>
//                         <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                           <p className="text-[8px] font-black text-slate-400 uppercase">
//                             Score
//                           </p>
//                           <p className="text-lg font-black text-blue-600">
//                             {review.score}
//                             <span className="text-[10px] text-slate-300">
//                               /100
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {review.status === "Reject" && (
//                       <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                         Profile Archived
//                       </div>
//                     )}
//                   </div>
//                 )
//                 }
//               )
//                 }
//               </div> */}

//               <div className="space-y-4">
//   {filteredInterviewReviews.map((review) => {
//     const fullCandidate = interviewReviews.find(
//       (c) => c.id === review.id
//     );

//     return (
//       <div
//         key={review.id}
//         onClick={() => setSelectedCandidate(fullCandidate)}
//         className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-4">
//           <div
//             className={`p-3 rounded-2xl ${
//               review.status === "Reject"
//                 ? "bg-rose-100 text-rose-600"
//                 : review.status === "Strong Pass"
//                 ? "bg-emerald-100 text-emerald-600"
//                 : "bg-blue-100 text-blue-600"
//             }`}
//           >
//             {review.status === "Reject" ? (
//               <ThumbsDown size={18} />
//             ) : (
//               <ThumbsUp size={18} />
//             )}
//           </div>

//           <div>
//             <h4 className="text-sm font-black text-slate-900">
//               {review.name}
//             </h4>

//             <div className="flex items-center gap-2 mt-1">
//               <span
//                 className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                   review.status === "Reject"
//                     ? "bg-rose-200 text-rose-700"
//                     : review.status === "Strong Pass"
//                     ? "bg-emerald-200 text-emerald-700"
//                     : "bg-blue-200 text-blue-700"
//                 }`}
//               >
//                 {review.status}
//               </span>

//               <span className="text-[9px] font-bold text-slate-400 uppercase">
//                 {review.date}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SCORE */}
//         {(review.status === "Pass" ||
//           review.status === "Strong Pass") && (
//           <div className="flex items-center gap-8">
//             <div className="hidden md:flex flex-col items-end">
//               <div className="flex gap-0.5 mb-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={12}
//                     className={
//                       i < review.stars
//                         ? "fill-amber-400 text-amber-400"
//                         : "text-slate-200"
//                     }
//                   />
//                 ))}
//               </div>

//               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                 Feedback Rating
//               </p>
//             </div>

//             <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//               <p className="text-[8px] font-black text-slate-400 uppercase">
//                 Score
//               </p>

//               <p className="text-lg font-black text-blue-600">
//                 {review.score ?? 0}
//                 <span className="text-[10px] text-slate-300">/100</span>
//               </p>
//             </div>
//           </div>
//         )}

//         {/* REJECT LABEL */}
//         {review.status === "Reject" && (
//           <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//             Profile Archived
//           </div>
//         )}
//       </div>
//     );
//   })}
// </div>

//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview
//                 Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true },
//                 ].map((box, i) => (
//                   <div
//                     key={i}
//                     className={`p-4 rounded-3xl border ${box.red ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
//                   >
//                     <p className="text-[9px] font-black text-slate-400 uppercase">
//                       {box.label}
//                     </p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
//                       {box.sub}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">
//                 Verification Registry
//               </h4>
//               <div className="space-y-5">
//                 {[
//                   {
//                     label: "Address Verified",
//                     count: 89,
//                     icon: <MapPin size={12} />,
//                   },
//                   {
//                     label: "Aadhaar / PAN",
//                     count: 142,
//                     icon: <CreditCard size={12} />,
//                   },
//                   {
//                     label: "Bank Details",
//                     count: 76,
//                     icon: <Landmark size={12} />,
//                   },
//                   {
//                     label: "eSign (Pending)",
//                     count: 12,
//                     icon: <PenTool size={12} />,
//                     alert: true,
//                   },
//                 ].map((doc, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`p-2 rounded-lg ${doc.alert ? "bg-rose-500/20 text-rose-400" : "bg-blue-500/20 text-blue-400"}`}
//                       >
//                         {doc.icon}
//                       </div>
//                       <span className="text-[10px] font-bold uppercase">
//                         {doc.label}
//                       </span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">
//                 eSign Status Workflow
//               </h4>
//               <div className="space-y-4">
//                 {["Document Uploaded", "Pending Signature", "Signed"].map(
//                   (status, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                         <span>{status}</span>
//                         <span>{Math.floor(Math.random() * 100)}%</span>
//                       </div>
//                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                         <div
//                           className="bg-blue-600 h-full"
//                           style={{ width: `${Math.random() * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//             <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//             <button
//               onClick={() => setActiveView("dashboard")}
//               className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <div className="p-10">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                 <div>
//                   <p className="text-sm font-black">Rajesh Kumar</p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">
//                     Aadhaar: Verified | eSign: Pending | Interview: Online
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Attended
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                     Doc Uploaded
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
// {selectedCandidate && (
//   <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
//     <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">

//       {/* Header */}
//       <div className="p-6 border-b flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-black">{selectedCandidate.full_name}</h2>
//           <p className="text-xs text-slate-500">
//             {selectedCandidate.email} • {selectedCandidate.phone}
//           </p>
//         </div>

//         <button
//           onClick={() => setSelectedCandidate(null)}
//           className="text-slate-400 hover:text-slate-700"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Body */}
//       <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">

//         {/* Candidate Info */}
//         <div className="grid grid-cols-2 gap-4 text-xs">
//           <div><b>Status:</b> {selectedCandidate.status}</div>
//           <div><b>Position:</b> {selectedCandidate.position}</div>
//           <div><b>Experience:</b> {selectedCandidate.experience}</div>
//           <div><b>Location:</b> {selectedCandidate.location}</div>
//           <div><b>Entry:</b> {selectedCandidate.entry_method}</div>
//           <div><b>Created:</b> {selectedCandidate.created_at
//   ? new Date(selectedCandidate.created_at).toLocaleDateString()
//   : "-"
// }</div>
//         </div>

//         {/* Interviews */}
//         <div>
//           <h3 className="font-black text-sm mb-3">Interview Rounds</h3>

//           {selectedCandidate.interviews?.length === 0 && (
//             <div className="text-xs text-slate-400">No interview conducted</div>
//           )}

//           {selectedCandidate.interviews?.map((round) => (
//             <div key={round.id} className="border rounded-xl p-4 mb-3 bg-slate-50">

//               <div className="flex justify-between text-xs mb-2">
//                 <span><b>Round:</b> {round.round_number}</span>
//                 <span><b>Status:</b> {round.status}</span>
//               </div>

//               <div className="flex justify-between text-xs mb-2">
//                 <span><b>Mode:</b> {round.mode}</span>
//                 <span>
//                   <b>Date:</b>{" "}
//                   {new Date(round.interview_date).toLocaleString()}
//                 </span>
//               </div>

//               {/* Review */}
//               {round.review ? (
//                 <div className="mt-3 p-3 bg-white rounded-lg border text-xs">

//                   <div className="flex justify-between mb-2">
//                     <span><b>Decision:</b> {round.review.decision}</span>
//                     <span><b>Score:</b> {round.review.total_score
//   ? Math.round(round.review.total_score * 10)
//   : 0
// }/100</span>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <div>Technical: {round.review.technical_skill}</div>
//                     <div>Communication: {round.review.communication}</div>
//                     <div>Problem Solving: {round.review.problem_solving}</div>
//                     <div>Culture Fit: {round.review.cultural_fit}</div>
//                     <div>Experience: {round.review.relevant_experience}</div>
//                   </div>

//                   {round.review.remarks && (
//                     <div className="mt-2 text-slate-600">
//                       <b>Remarks:</b> {round.review.remarks}
//                     </div>
//                   )}

//                 </div>
//               ) : (
//                 <div className="text-xs text-slate-400 mt-2">
//                   No review submitted
//                 </div>
//               )}

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//***************************************************working code phase 1 9/02/26******************************************************************* */
// import React, {useEffect, useState } from 'react';
// import {
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus,
//   Lock, FileText, Activity, Clock, CheckCircle2, Database,
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert,
//   Fingerprint, CreditCard, Landmark, PenTool, Video, MapPin, Star, ThumbsUp, ThumbsDown
// } from 'lucide-react';
// import { dashboardService } from "../../services/dashboard.service";

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates');
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');
//   const [searchText, setSearchText] = useState("");
// const [statusFilter, setStatusFilter] = useState("All");
// const [apiStats, setApiStats] = useState(null);
// const [loading, setLoading] = useState(false);

// useEffect(() => {
//   if (activeTab === "candidates") {
//     fetchDashboardStats();
//   }
// }, [timeRange, searchText, statusFilter, activeTab]);

// const buildFilters = () => ({
//   location: "vashi",
//   range: timeRange,        // Today | Week | Monthly
//   search: searchText || "",
//   status: statusFilter !== "All" ? statusFilter : ""
// });

// const fetchDashboardStats = async () => {
//   try {
//     setLoading(true);

//     const filters = buildFilters();

//     const data = await dashboardService.getCandidateStats(filters);

//     setApiStats(data);
//   } catch (err) {
//     console.error("Dashboard API Error:", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   // --- MOCK DATA FOR REVIEWS ---
//   // const interviewReviews = [
//   //   { id: 1, name: "Arjun Mehta", status: "Strong Pass", score: 94, stars: 5, date: "2 Hours ago" },
//   //   { id: 2, name: "Sanya Iyer", status: "Pass", score: 78, stars: 4, date: "5 Hours ago" },
//   //   { id: 3, name: "Kevin Pietersen", status: "Reject", score: null, stars: 0, date: "Yesterday" },
//   //   { id: 4, name: "Priya Das", status: "Strong Pass", score: 88, stars: 5, date: "Yesterday" }
//   // ];
//   const interviewReviews = apiStats?.recent_activity ?? [];

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     // candidates: [
//     //   { id: 'interviews', label: "Interviews", val: "128", icon: <Video size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//     //   { id: 'jd_sent', label: "JD Pipeline", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//     //   { id: 'offers', label: "Offers Sent", val: "42", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//     //   { id: 'total', label: "Total Apps", val: "2.8k", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     // ],
//     candidates: [
//     {
//       id: "total",
//       label: "Total Candidates",
//       val: apiStats?.total_candidates ?? 0,
//       icon: <Users size={20} />,
//       color: "text-blue-600",
//       bg: "bg-blue-50"
//     },
//     {
//       id: "interviewing",
//       label: "Interviewing",
//       val:
//         apiStats?.status_distribution?.find(s => s.label === "interviewing")?.count ?? 0,
//       icon: <Video size={20} />,
//       color: "text-indigo-600",
//       bg: "bg-indigo-50"
//     },
//     {
//       id: "migrated",
//       label: "Migrated",
//       val:
//         apiStats?.status_distribution?.find(s => s.label === "migrated")?.count ?? 0,
//       icon: <CheckCircle2 size={20} />,
//       color: "text-emerald-600",
//       bg: "bg-emerald-50"
//     },
//     {
//       id: "manual",
//       label: "Manual Entry",
//       val:
//         apiStats?.entry_method_distribution?.find(s => s.label === "manual")?.count ?? 0,
//       icon: <Database size={20} />,
//       color: "text-amber-600",
//       bg: "bg-amber-50"
//     }
//   ],
//     employees: [
//       { id: 'kyc_pending', label: "KYC Pending", val: "14", icon: <Fingerprint size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//       { id: 'esign', label: "eSign Done", val: "112", icon: <PenTool size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//       { id: 'probation', label: "On Probation", val: "84", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//       { id: 'active', label: "Active Staff", val: "1.2k", icon: <ShieldCheck size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ]
//   };

// //   const filteredInterviewReviews = interviewReviews.filter((item) => {
// //   const matchSearch =
// //     item.name.toLowerCase().includes(searchText.toLowerCase());

// //   const matchStatus =
// //     statusFilter === "All" || item.status === statusFilter;

// //   return matchSearch && matchStatus;
// // });

// const filteredInterviewReviews = interviewReviews
//   .filter((item) => {
//     const matchSearch =
//       item.full_name?.toLowerCase().includes(searchText.toLowerCase());

//     const matchStatus =
//       statusFilter === "All" || item.status === statusFilter.toLowerCase();

//     return matchSearch && matchStatus;
//   })
//   .map((item) => {

//     const lastInterview =
//       item.interviews?.[item.interviews.length - 1];

//     const score = lastInterview?.review?.total_score
//       ? Math.round(lastInterview.review.total_score * 10)
//       : null;

//     const decision = lastInterview?.review?.decision;

//     let statusLabel = "In Progress";
//     if (decision === "strong_pass") statusLabel = "Strong Pass";
//     else if (decision === "pass") statusLabel = "Pass";
//     else if (decision === "reject") statusLabel = "Reject";

//     return {
//       id: item.id,
//       name: item.full_name,
//       status: statusLabel,
//       score,
//       stars: Math.round((score || 0) / 20),
//       date: new Date(item.updated_at).toLocaleDateString()
//     };
//   });

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">

//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">Core Terminal</span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Talent Acquisition' : 'Employee Governance'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button key={range} onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}>{range}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[{ id: 'candidates', label: 'Candidates', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employees', icon: <Briefcase size={16}/> }].map((tab) => (
//           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}>
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <div className="grid grid-cols-12 gap-8">

//           {/* --- KPI CARDS --- */}
//           {/* <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {stats[activeTab].map((stat) => (
//               <div key={stat.id} onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
//                 <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                 <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
//               </div>
//             ))}
//           </div> */}
//           {/* --- KPI CARDS --- */}
// <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">

//   {loading ? (
//     <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
//       Loading dashboard...
//     </div>
//   ) : (
//     stats[activeTab].map((stat) => (
//       <div
//         key={stat.id}
//         onClick={() => {
//           setSelectedCategory(stat.label);
//           setActiveView("detail");
//         }}
//         className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//       >
//         <div
//           className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//         >
//           {stat.icon}{console.log("new data show in code",stat)}
//         </div>

//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//           {stat.label}
//         </p>

//         <h2 className="text-2xl font-black text-slate-900">
//           {stat.val}
//         </h2>
//       </div>
//     ))
//   )}

// </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
// <div className="flex flex-wrap gap-3 mb-6">
//   {/* Search */}
//   <div className="relative">
//     <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
//     <input
//       type="text"
//       placeholder="Search candidate..."
//       value={searchText}
//       onChange={(e) => setSearchText(e.target.value)}
//       className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//     />
//   </div>

//   {/* Status Filter */}
//   <select
//     value={statusFilter}
//     onChange={(e) => setStatusFilter(e.target.value)}
//     className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//   >
//     <option value="All">All Status</option>
//     <option value="Strong Pass">Strong Pass</option>
//     <option value="Pass">Pass</option>
//     <option value="Reject">Reject</option>
//   </select>
// </div>

//               <div className="space-y-4">
//                 {filteredInterviewReviews.map((review) => (
//                   <div key={review.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all">
//                     <div className="flex items-center gap-4">
//                       <div className={`p-3 rounded-2xl ${
//                         review.status === 'Reject' ? 'bg-rose-100 text-rose-600' :
//                         review.status === 'Strong Pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
//                       }`}>
//                         {review.status === 'Reject' ? <ThumbsDown size={18}/> : <ThumbsUp size={18}/>}
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-black text-slate-900">{review.name}</h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                             review.status === 'Reject' ? 'bg-rose-200 text-rose-700' :
//                             review.status === 'Strong Pass' ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-200 text-blue-700'
//                           }`}>
//                             {review.status}
//                           </span>
//                           <span className="text-[9px] font-bold text-slate-400 uppercase">{review.date}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* DYNAMIC SCORECARD FOR PASS / STRONG PASS */}
//                     {(review.status === 'Pass' || review.status === 'Strong Pass') && (
//                       <div className="flex items-center gap-8">
//                         <div className="hidden md:flex flex-col items-end">
//                            <div className="flex gap-0.5 mb-1">
//                              {[...Array(5)].map((_, i) => (
//                                <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
//                              ))}
//                            </div>
//                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Feedback Rating</p>
//                         </div>
//                         <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                           <p className="text-[8px] font-black text-slate-400 uppercase">Score</p>
//                           <p className="text-lg font-black text-blue-600">{review.score}<span className="text-[10px] text-slate-300">/100</span></p>
//                         </div>
//                       </div>
//                     )}

//                     {review.status === 'Reject' && (
//                       <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                         Profile Archived
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true }
//                 ].map((box, i) => (
//                   <div key={i} className={`p-4 rounded-3xl border ${box.red ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
//                     <p className="text-[9px] font-black text-slate-400 uppercase">{box.label}</p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{box.sub}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Verification Registry</h4>
//               <div className="space-y-5">
//                 {[
//                   { label: "Address Verified", count: 89, icon: <MapPin size={12}/> },
//                   { label: "Aadhaar / PAN", count: 142, icon: <CreditCard size={12}/> },
//                   { label: "Bank Details", count: 76, icon: <Landmark size={12}/> },
//                   { label: "eSign (Pending)", count: 12, icon: <PenTool size={12}/>, alert: true }
//                 ].map((doc, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${doc.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{doc.icon}</div>
//                       <span className="text-[10px] font-bold uppercase">{doc.label}</span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">eSign Status Workflow</h4>
//               <div className="space-y-4">
//                 {['Document Uploaded', 'Pending Signature', 'Signed'].map((status, i) => (
//                   <div key={i} className="space-y-2">
//                     <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                       <span>{status}</span>
//                       <span>{Math.floor(Math.random()*100)}%</span>
//                     </div>
//                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                       <div className="bg-blue-600 h-full" style={{ width: `${Math.random()*100}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//               <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Back to Dashboard</button>
//            </div>
//            <div className="p-10">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                   <div>
//                     <p className="text-sm font-black">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar: Verified | eSign: Pending | Interview: Online</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Attended</span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Doc Uploaded</span>
//                   </div>
//                 </div>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;

//***********************************************working code phase 1 07/02/26************************************************************** */
// import React, { useState } from 'react';
// import {
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus,
//   Lock, FileText, Activity, Clock, CheckCircle2, Database,
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert,
//   Fingerprint, CreditCard, Landmark, PenTool, Video, MapPin, Star, ThumbsUp, ThumbsDown
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates');
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');
//   const [searchText, setSearchText] = useState("");
// const [statusFilter, setStatusFilter] = useState("All");

//   // --- MOCK DATA FOR REVIEWS ---
//   const interviewReviews = [
//     { id: 1, name: "Arjun Mehta", status: "Strong Pass", score: 94, stars: 5, date: "2 Hours ago" },
//     { id: 2, name: "Sanya Iyer", status: "Pass", score: 78, stars: 4, date: "5 Hours ago" },
//     { id: 3, name: "Kevin Pietersen", status: "Reject", score: null, stars: 0, date: "Yesterday" },
//     { id: 4, name: "Priya Das", status: "Strong Pass", score: 88, stars: 5, date: "Yesterday" }
//   ];

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       { id: 'interviews', label: "Interviews", val: "128", icon: <Video size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//       { id: 'jd_sent', label: "JD Pipeline", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//       { id: 'offers', label: "Offers Sent", val: "42", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//       { id: 'total', label: "Total Apps", val: "2.8k", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ],
//     employees: [
//       { id: 'kyc_pending', label: "KYC Pending", val: "14", icon: <Fingerprint size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//       { id: 'esign', label: "eSign Done", val: "112", icon: <PenTool size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//       { id: 'probation', label: "On Probation", val: "84", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//       { id: 'active', label: "Active Staff", val: "1.2k", icon: <ShieldCheck size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ]
//   };

//   const filteredInterviewReviews = interviewReviews.filter((item) => {
//   const matchSearch =
//     item.name.toLowerCase().includes(searchText.toLowerCase());

//   const matchStatus =
//     statusFilter === "All" || item.status === statusFilter;

//   return matchSearch && matchStatus;
// });

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">

//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">Core Terminal</span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Talent Acquisition' : 'Employee Governance'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button key={range} onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}>{range}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[{ id: 'candidates', label: 'Candidates', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employees', icon: <Briefcase size={16}/> }].map((tab) => (
//           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}>
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <div className="grid grid-cols-12 gap-8">

//           {/* --- KPI CARDS --- */}
//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {stats[activeTab].map((stat) => (
//               <div key={stat.id} onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
//                 <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                 <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
//               </div>
//             ))}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
// <div className="flex flex-wrap gap-3 mb-6">
//   {/* Search */}
//   <div className="relative">
//     <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
//     <input
//       type="text"
//       placeholder="Search candidate..."
//       value={searchText}
//       onChange={(e) => setSearchText(e.target.value)}
//       className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//     />
//   </div>

//   {/* Status Filter */}
//   <select
//     value={statusFilter}
//     onChange={(e) => setStatusFilter(e.target.value)}
//     className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//   >
//     <option value="All">All Status</option>
//     <option value="Strong Pass">Strong Pass</option>
//     <option value="Pass">Pass</option>
//     <option value="Reject">Reject</option>
//   </select>
// </div>

//               <div className="space-y-4">
//                 {filteredInterviewReviews.map((review) => (
//                   <div key={review.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all">
//                     <div className="flex items-center gap-4">
//                       <div className={`p-3 rounded-2xl ${
//                         review.status === 'Reject' ? 'bg-rose-100 text-rose-600' :
//                         review.status === 'Strong Pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
//                       }`}>
//                         {review.status === 'Reject' ? <ThumbsDown size={18}/> : <ThumbsUp size={18}/>}
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-black text-slate-900">{review.name}</h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                             review.status === 'Reject' ? 'bg-rose-200 text-rose-700' :
//                             review.status === 'Strong Pass' ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-200 text-blue-700'
//                           }`}>
//                             {review.status}
//                           </span>
//                           <span className="text-[9px] font-bold text-slate-400 uppercase">{review.date}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* DYNAMIC SCORECARD FOR PASS / STRONG PASS */}
//                     {(review.status === 'Pass' || review.status === 'Strong Pass') && (
//                       <div className="flex items-center gap-8">
//                         <div className="hidden md:flex flex-col items-end">
//                            <div className="flex gap-0.5 mb-1">
//                              {[...Array(5)].map((_, i) => (
//                                <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
//                              ))}
//                            </div>
//                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Feedback Rating</p>
//                         </div>
//                         <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                           <p className="text-[8px] font-black text-slate-400 uppercase">Score</p>
//                           <p className="text-lg font-black text-blue-600">{review.score}<span className="text-[10px] text-slate-300">/100</span></p>
//                         </div>
//                       </div>
//                     )}

//                     {review.status === 'Reject' && (
//                       <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                         Profile Archived
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true }
//                 ].map((box, i) => (
//                   <div key={i} className={`p-4 rounded-3xl border ${box.red ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
//                     <p className="text-[9px] font-black text-slate-400 uppercase">{box.label}</p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{box.sub}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Verification Registry</h4>
//               <div className="space-y-5">
//                 {[
//                   { label: "Address Verified", count: 89, icon: <MapPin size={12}/> },
//                   { label: "Aadhaar / PAN", count: 142, icon: <CreditCard size={12}/> },
//                   { label: "Bank Details", count: 76, icon: <Landmark size={12}/> },
//                   { label: "eSign (Pending)", count: 12, icon: <PenTool size={12}/>, alert: true }
//                 ].map((doc, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${doc.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{doc.icon}</div>
//                       <span className="text-[10px] font-bold uppercase">{doc.label}</span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">eSign Status Workflow</h4>
//               <div className="space-y-4">
//                 {['Document Uploaded', 'Pending Signature', 'Signed'].map((status, i) => (
//                   <div key={i} className="space-y-2">
//                     <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                       <span>{status}</span>
//                       <span>{Math.floor(Math.random()*100)}%</span>
//                     </div>
//                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                       <div className="bg-blue-600 h-full" style={{ width: `${Math.random()*100}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//               <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Back to Dashboard</button>
//            </div>
//            <div className="p-10">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                   <div>
//                     <p className="text-sm font-black">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar: Verified | eSign: Pending | Interview: Online</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Attended</span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Doc Uploaded</span>
//                   </div>
//                 </div>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;

//************************************************working code pahse 2356*********************************************************** */
// import React, { useState } from 'react';
// import {
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus,
//   Lock, FileText, Activity, Clock, CheckCircle2, Database,
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert,
//   Fingerprint, CreditCard, Landmark, PenTool, Video, MapPin
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates');
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');

//   // --- EXPANDED METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       { id: 'interviews', label: "Interviews", val: "128", icon: <Video size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//       { id: 'jd_sent', label: "JD Pipeline", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//       { id: 'offers', label: "Offers Sent", val: "42", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//       { id: 'total', label: "Total Apps", val: "2.8k", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ],
//     employees: [
//       { id: 'kyc_pending', label: "KYC Pending", val: "14", icon: <Fingerprint size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//       { id: 'esign', label: "eSign Done", val: "112", icon: <PenTool size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//       { id: 'probation', label: "On Probation", val: "84", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//       { id: 'active', label: "Active Staff", val: "1.2k", icon: <ShieldCheck size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ]
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">

//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">Core Terminal</span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Talent Acquisition' : 'Employee Governance'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button key={range} onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}>{range}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[{ id: 'candidates', label: 'Candidates', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employees', icon: <Briefcase size={16}/> }].map((tab) => (
//           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}>
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <div className="grid grid-cols-12 gap-8">

//           {/* --- KPI CARDS --- */}
//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {stats[activeTab].map((stat) => (
//               <div key={stat.id} onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
//                 <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                 <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
//               </div>
//             ))}
//           </div>

//           {/* --- LEFT: INTERVIEW & JD LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true }
//                 ].map((box, i) => (
//                   <div key={i} className={`p-4 rounded-3xl border ${box.red ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
//                     <p className="text-[9px] font-black text-slate-400 uppercase">{box.label}</p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{box.sub}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Interview Status Breakdown */}
//               <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
//                 <div className="space-y-4">
//                   <p className="text-[10px] font-black text-slate-400 uppercase">Stage Status</p>
//                   {['Scheduled', 'Completed', 'Cancelled'].map(s => (
//                     <div key={s} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
//                       <span className="text-xs font-bold">{s}</span>
//                       <span className="text-xs font-mono font-black text-blue-600">{(Math.random()*50).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="space-y-4">
//                   <p className="text-[10px] font-black text-slate-400 uppercase">Attendance Logic</p>
//                   {['Pending', 'Attended', 'No Show'].map(s => (
//                     <div key={s} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
//                       <span className="text-xs font-bold">{s}</span>
//                       <span className="text-xs font-mono font-black text-indigo-600">{(Math.random()*50).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Verification Registry</h4>
//               <div className="space-y-5">
//                 {[
//                   { label: "Address Verified", count: 89, icon: <MapPin size={12}/> },
//                   { label: "Aadhaar / PAN", count: 142, icon: <CreditCard size={12}/> },
//                   { label: "Bank Details", count: 76, icon: <Landmark size={12}/> },
//                   { label: "eSign (Pending)", count: 12, icon: <PenTool size={12}/>, alert: true }
//                 ].map((doc, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${doc.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{doc.icon}</div>
//                       <span className="text-[10px] font-bold uppercase">{doc.label}</span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">eSign Status Workflow</h4>
//               <div className="space-y-4">
//                 {['Document Uploaded', 'Pending Signature', 'Signed'].map((status, i) => (
//                   <div key={i} className="space-y-2">
//                     <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                       <span>{status}</span>
//                       <span>{Math.floor(Math.random()*100)}%</span>
//                     </div>
//                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                       <div className="bg-blue-600 h-full" style={{ width: `${Math.random()*100}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//               <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Back to Dashboard</button>
//            </div>
//            <div className="p-10">
//               <div className="grid grid-cols-1 gap-4">
//                 {/* Example of a detailed row showing combined status */}
//                 <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                   <div>
//                     <p className="text-sm font-black">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar: Verified | eSign: Pending | Interview: Online</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Attended</span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Doc Uploaded</span>
//                   </div>
//                 </div>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//*******************************************working code pahse 66666************************************************* */
// import React, { useState, useMemo } from 'react';
// import {
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus,
//   Lock, Globe, FileText, Activity, TrendingUp, Clock, CheckCircle2,Database,
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' or 'employees'
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');

//   // Unified Data (Candidate + Employee Lifecycle)
//   const [data] = useState([
//     { id: "CAN-4012", name: "Alex Rivera", type: "candidate", status: "JD Accepted", source: "Manual", date: "2026-02-03" },
//     { id: "EMP-9021", name: "Sarah Chen", type: "employee", status: "On Probation", source: "Excel", date: "2026-02-01" },
//     { id: "CAN-4015", name: "Jordan Smit", type: "candidate", status: "Offer Sent", source: "Webhook", date: "2026-01-28" },
//     { id: "EMP-8820", name: "David Park", type: "employee", status: "Confirmed", source: "Manual", date: "2026-01-15" },
//   ]);

//   // --- METRIC DEFINITIONS ---
//   const candidateStats = [
//     { id: 'total', label: "Total Pipeline", val: "2,840", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     { id: 'jd_sent', label: "JD Sent", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//     { id: 'jd_accepted', label: "JD Accepted", val: "420", icon: <CheckCircle2 size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//     { id: 'interviews', label: "Interviews", val: "48", icon: <Timer size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//   ];

//   const employeeStats = [
//     { id: 'offer_sent', label: "Offer Sent", val: "24", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//     { id: 'on_probation', label: "On Probation", val: "112", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//     { id: 'confirmed', label: "Confirmed", val: "840", icon: <ShieldCheck size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//     { id: 'exited', label: "Exited", val: "12", icon: <LogOut size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//   ];

//   const currentStats = activeTab === 'candidates' ? candidateStats : employeeStats;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">

//       {/* --- TOP HUD --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Operational Terminal
//             </div>
//             <div className="h-4 w-[1px] bg-slate-200" />
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> AES-256 Encrypted
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Candidate Pipeline' : 'Personnel Registry'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Time Filter Toggle */}
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//           <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2 active:scale-95">
//             <Plus size={14} /> New Entry
//           </button>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER (CANDIDATE VS EMPLOYEE) --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           { id: 'candidates', label: 'Talent Acquisition', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employee Management', icon: <Briefcase size={16}/> }
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <>
//           {/* --- KPI GRID --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//             {currentStats.map((stat) => (
//               <div
//                 key={stat.id}
//                 onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-7 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group relative overflow-hidden"
//               >
//                 <div className="relative z-10">
//                   <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform`}>
//                     {stat.icon}
//                   </div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                   <div className="flex items-end gap-2 mt-1">
//                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</h2>
//                     <span className="text-[10px] font-bold text-emerald-500 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                       {timeRange}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-12 gap-8">
//             {/* --- SIDEBAR: STATUS FLOW --- */}
//             <div className="col-span-12 lg:col-span-4 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Detailed Status Distribution</h4>
//                 <div className="space-y-6">
//                   {(activeTab === 'candidates'
//                     ? ['JD Sent', 'JD Accepted', 'JD Rejected', 'JD Pending']
//                     : ['Offer Sent', 'Offer Accepted', 'Offer Rejected', 'Joining Letter', 'On Probation', 'Probation Review', 'Confirmed', 'Extended', 'Exited']
//                   ).map((status, i) => (
//                     <div key={i} className="flex items-center justify-between group">
//                       <div className="flex items-center gap-3">
//                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
//                         <span className="text-xs font-bold text-slate-600">{status}</span>
//                       </div>
//                       <span className="text-xs font-mono font-bold text-slate-400">{(Math.random() * 100).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Entry Methods */}
//               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
//                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-2">
//                   <Database size={14} /> Ingestion Sources
//                 </h4>
//                 <div className="space-y-4">
//                   {['Manual Entry', 'Excel Import', 'Webhook API'].map((source, i) => (
//                     <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors">
//                       <span className="text-[11px] font-bold uppercase tracking-tight text-slate-300">{source}</span>
//                       <ArrowUpRight size={14} className="text-blue-400" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* --- RECENT ACTIVITY TABLE --- */}
//             <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
//                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <Clock size={14} className="text-blue-500" /> Recent {activeTab} Activity
//                 </h3>
//                 <button onClick={() => setActiveView('detail')} className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
//                   Expand Registry
//                 </button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-slate-50">
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Source</th>
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Reference</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.filter(d => d.type === activeTab.slice(0, -1)).map((item, i) => (
//                       <tr key={i} className="hover:bg-blue-50/20 transition-colors group">
//                         <td className="px-8 py-5">
//                           <div className="flex flex-col">
//                             <span className="text-sm font-black text-slate-800">{item.name}</span>
//                             <span className="text-[10px] font-bold text-slate-400">{item.id}</span>
//                           </div>
//                         </td>
//                         <td className="px-8 py-5">
//                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
//                             item.status.includes('Confirmed') || item.status.includes('Accepted')
//                             ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
//                           }`}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-5">
//                           <span className="text-[10px] font-black text-slate-500 uppercase">{item.source}</span>
//                         </td>
//                         <td className="px-8 py-5 text-right">
//                           <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ArrowUpRight size={16}/></button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         /* --- FULL PAGE DETAIL REGISTRY (Filters applied here) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm animate-in fade-in zoom-in-95">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <div className="relative w-96">
//                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input placeholder={`Search ${selectedCategory}...`} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
//               </div>
//               <button onClick={() => setActiveView('dashboard')} className="text-[10px] font-black uppercase text-blue-600">Close Detail View</button>
//            </div>
//            {/* Table would render here with full filtered data */}
//            <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-[0.3em]">Filtered Data Registry Loaded</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//***********************************************working code phase 55************************************************************* */
// import React, { useState } from 'react';
// import {
//   Users, ShieldCheck, Briefcase, Zap,
//   Search, Filter, ArrowUpRight, Plus,
//   MoreHorizontal, Lock, Globe, FileText,
//   Activity, TrendingUp, AlertCircle, Clock,
//   ChevronDown, Database, Mail, Link,
//   CheckCircle2, XCircle, Timer
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   // States for Navigation and Filtering
//   const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'detail'
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('This Month');

//   // Dummy Data - Candidate Assets
//   const [candidates] = useState([
//     { id: "CAN-4012", name: "Alex Rivera", source: "Manual", jdStatus: "Accepted", interviewStatus: "Pending", appliedDate: "2024-03-01" },
//     { id: "CAN-4013", name: "Priya Sharma", source: "Excel Import", jdStatus: "Sent", interviewStatus: "Scheduled", appliedDate: "2024-03-02" },
//     { id: "CAN-4014", name: "Jordan Smit", source: "Webhook", jdStatus: "Rejected", interviewStatus: "N/A", appliedDate: "2024-02-28" },
//     { id: "CAN-4015", name: "Sarah Connor", source: "Webhook", jdStatus: "Pending", interviewStatus: "Review", appliedDate: "2024-03-03" },
//   ]);

//   const stats = [
//     { id: 'total', label: "Total Candidates", val: "2,840", change: "+14%", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     { id: 'applied', label: "Applied (Today)", val: "142", change: "Real-time", icon: <Activity size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//     { id: 'jd_sent', label: "JD Sent Count", val: "892", change: "64% Ratio", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//     { id: 'interviews', label: "Interviews", val: "48", change: "8 Today", icon: <Timer size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//   ];

//   const jdMetrics = [
//     { label: "JD Accepted", count: 420, color: "bg-emerald-500" },
//     { label: "JD Rejected", count: 112, color: "bg-rose-500" },
//     { label: "JD Pending", count: 360, color: "bg-amber-400" },
//   ];

//   const handleCardClick = (category) => {
//     setSelectedCategory(category);
//     setActiveView('detail');
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">

//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Recruitment Terminal
//             </div>
//             {activeView === 'detail' && (
//                <button
//                 onClick={() => setActiveView('dashboard')}
//                 className="text-[9px] font-black text-blue-600 uppercase tracking-tighter hover:underline"
//                >
//                  ← Back to Governance
//                </button>
//             )}
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeView === 'dashboard' ? 'Candidate Lifecycle' : `${selectedCategory} Registry`}
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Time Filter Toggle */}
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//           <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
//             <Plus size={14} /> New Candidate
//           </button>
//         </div>
//       </div>

//       {activeView === 'dashboard' ? (
//         <>
//           {/* --- TOP CARDS (Interactive) --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//             {stats.map((stat) => (
//               <div
//                 key={stat.id}
//                 onClick={() => handleCardClick(stat.label)}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all relative overflow-hidden group"
//               >
//                 <div className="relative z-10">
//                   <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//                     {stat.icon}
//                   </div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                   <div className="flex items-end gap-2 mt-1">
//                     <h2 className="text-3xl font-black text-slate-900">{stat.val}</h2>
//                     <span className="text-[10px] font-bold text-emerald-500 mb-1.5">{stat.change}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-12 gap-8">
//             {/* Entry Methods & Metrics */}
//             <div className="col-span-12 lg:col-span-4 space-y-6">
//               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Ingestion Methods</h4>
//                 <div className="space-y-6">
//                   {[
//                     { label: "Manual Entry", val: "1,204", icon: <Plus size={14}/> },
//                     { label: "Excel Bulk", val: "840", icon: <FileText size={14}/> },
//                     { label: "API Webhook", val: "796", icon: <Zap size={14}/> },
//                   ].map((item, i) => (
//                     <div key={i} className="flex justify-between items-center group cursor-pointer">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">{item.icon}</div>
//                         <span className="text-xs font-bold text-white/70 uppercase tracking-tight">{item.label}</span>
//                       </div>
//                       <span className="font-mono font-bold text-blue-400">{item.val}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* JD Status Breakdown */}
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">JD Lifecycle Status</h4>
//                 <div className="space-y-5">
//                   {jdMetrics.map((jd, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
//                         <span>{jd.label}</span>
//                         <span>{jd.count}</span>
//                       </div>
//                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                         <div className={`${jd.color} h-full`} style={{ width: `${(jd.count/892)*100}%` }} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Recent Table Preview */}
//             <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Influx</h3>
//                 <button onClick={() => setActiveView('detail')} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All Candidates</button>
//               </div>
//               <div className="p-4 overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-slate-50">
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</th>
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">JD Status</th>
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Interview</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((can, i) => (
//                       <tr key={i} className="hover:bg-slate-50 transition-colors">
//                         <td className="px-4 py-4">
//                            <div className="flex flex-col">
//                             <span className="text-xs font-black text-slate-800 tracking-tight">{can.name}</span>
//                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{can.id}</span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4">
//                           <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">{can.source}</span>
//                         </td>
//                         <td className="px-4 py-4">
//                            <div className={`text-[9px] font-black uppercase px-2 py-1 rounded-full w-fit flex items-center gap-1 ${
//                              can.jdStatus === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
//                              can.jdStatus === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
//                            }`}>
//                              {can.jdStatus === 'Accepted' ? <CheckCircle2 size={10}/> : can.jdStatus === 'Rejected' ? <XCircle size={10}/> : <Clock size={10}/>}
//                              {can.jdStatus}
//                            </div>
//                         </td>
//                         <td className="px-4 py-4 text-[10px] font-bold text-slate-500">{can.interviewStatus}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         /* --- FULL PAGE DATA TABLE (Filterable) --- */
//         <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm animate-in fade-in zoom-in-95 duration-300">
//           <div className="p-8 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
//             <div className="flex items-center gap-4 flex-1">
//               <div className="relative flex-1 max-w-md">
//                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   placeholder="Search name, ID, or source..."
//                   className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                 />
//               </div>
//               <button className="h-12 px-6 border border-slate-200 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
//                 <Filter size={14}/> Filters
//               </button>
//             </div>
//             <div className="flex gap-2 text-[10px] font-black uppercase text-slate-400">
//               Showing 1,284 Candidates for <span className="text-slate-900 underline">{timeRange}</span>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-slate-50/50">
//                 <tr>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate Name</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Source Method</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">JD Lifecycle</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Index</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {candidates.map((can) => (
//                   <tr key={can.id} className="hover:bg-blue-50/10 group cursor-pointer">
//                     <td className="px-8 py-6 font-mono text-[10px] font-bold text-blue-600">#{can.id}</td>
//                     <td className="px-8 py-6">
//                        <span className="text-sm font-black text-slate-800 tracking-tight">{can.name}</span>
//                     </td>
//                     <td className="px-8 py-6">
//                       <div className="flex items-center gap-2">
//                         {can.source === 'Manual' ? <Plus size={12}/> : can.source === 'Webhook' ? <Zap size={12}/> : <FileText size={12}/>}
//                         <span className="text-[10px] font-black text-slate-500 uppercase">{can.source}</span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6">
//                       <div className="flex items-center gap-2">
//                          <div className={`w-1.5 h-1.5 rounded-full ${can.jdStatus === 'Accepted' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
//                          <span className="text-[10px] font-black text-slate-700 uppercase">{can.jdStatus}</span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6">
//                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                           <div className="w-1/3 h-full bg-blue-500" />
//                        </div>
//                     </td>
//                     <td className="px-8 py-6 text-right">
//                       <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
//                         <ArrowUpRight size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//******************************************************working phase 11************************************************** */
// import {
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import VerificationChart from "../../components/charts/VerificationChart";
// import EmployeeStatusChart from "../../components/charts/EmployeeStatusChart";
// import DashboardActions from "../../pages/dashboard/DashboardActions";

// import {
//   hrStats,
//   verificationChartData,
//   employeeStatusFlow,
// } from "../../data/hrDashboardData";

// const icons = [
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// ];

// export default function HrDashboard() {
//   return (
//     <div className="space-y-10">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">
//           HR Dashboard
//         </h1>
//         <p className="text-sm text-slate-500">
//           Employee onboarding & verification overview
//         </p>
//       </div>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//         {hrStats.map((item, index) => (
//           <MaterialStatCard
//             key={item.title}
//             title={item.title}
//             value={item.value}
//             icon={icons[index]}
//             percent={item.percent}
//             trend={item.trend}
//             subtitle={item.subtitle}
//           />
//         ))}
//       </div>

//       {/* ACTIONS */}
//       <DashboardActions />

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard
//           title="Verification Status"
//           subtitle="Completed vs Pending documents"
//           footer="Aadhaar, PAN, Bank & Address"
//         >
//           <VerificationChart data={verificationChartData} />
//         </ChartCard>

//         <ChartCard
//           title="Employee Lifecycle"
//           subtitle="Created → Confirmed"
//           footer="Based on HR review flow"
//         >
//           <EmployeeStatusChart data={employeeStatusFlow} />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }

// import {
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import VerificationChart from "../../components/charts/VerificationChart";
// import EmployeeStatusChart from "../../components/charts/EmployeeStatusChart";
// import DashboardActions from "../../pages/dashboard/DashboardActions";

// import {
//   hrStats,
//   verificationChartData,
//   employeeStatusFlow,
// } from "../../data/hrDashboardData";

// const icons = [
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// ];

// export default function HrDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-semibold">
//         HR Dashboard
//       </h1>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {hrStats.map((item, index) => (
//           <MaterialStatCard
//             key={item.title}
//             title={item.title}
//             value={item.value}
//             icon={icons[index]}
//             percent={item.percent}
//             trend={item.trend}
//             subtitle={item.subtitle}
//           />
//         ))}
//       </div>

//       {/* ACTION BUTTONS */}
//       <DashboardActions />

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard
//           title="Verification Status"
//           subtitle="Completed vs Pending documents"
//           footer="based on employee KYC"
//         >
//           <VerificationChart data={verificationChartData} />
//         </ChartCard>

//         <ChartCard
//           title="Employee Status Flow"
//           subtitle="Lifecycle progress"
//           footer="Created → Confirmed"
//         >
//           <EmployeeStatusChart data={employeeStatusFlow} />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }

// import {
//   DollarSign,
//   Users,
//   UserPlus,
//   BarChart3,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import WebsiteViewChart from "../../components/charts/WebsiteViewChart";
// import DailySalesChart from "../../components/charts/DailySalesChart";
// import CompletedTasksChart from "../../components/charts/CompletedTasksChart";

// export default function HrDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-xl font-semibold">Home</h1>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <MaterialStatCard
//           title="Today's Money"
//           value="$53k"
//           icon={DollarSign}
//           percent={55}
//           trend="up"
//           subtitle="than last week"
//         />
//         <MaterialStatCard
//           title="Today's Users"
//           value="2,300"
//           icon={Users}
//           percent={3}
//           trend="up"
//           subtitle="than last month"
//         />
//         <MaterialStatCard
//           title="New Clients"
//           value="3,462"
//           icon={UserPlus}
//           percent={2}
//           trend="down"
//           subtitle="than yesterday"
//         />
//         <MaterialStatCard
//           title="Sales"
//           value="$103,430"
//           icon={BarChart3}
//           percent={5}
//           trend="up"
//           subtitle="than yesterday"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <ChartCard
//           title="Website View"
//           subtitle="Last Campaign Performance"
//           footer="campaign sent 2 days ago"
//         >
//           <WebsiteViewChart />
//         </ChartCard>

//         <ChartCard
//           title="Daily Sales"
//           subtitle="15% increase in today sales"
//           footer="updated 4 min ago"
//         >
//           <DailySalesChart />
//         </ChartCard>

//         <ChartCard
//           title="Completed Tasks"
//           subtitle="Last Campaign Performance"
//           footer="just updated"
//         >
//           <CompletedTasksChart />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }
