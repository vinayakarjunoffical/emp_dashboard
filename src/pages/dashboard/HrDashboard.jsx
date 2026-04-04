import React, { useEffect, useState, useMemo } from "react";
import {
  Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus, 
  Lock, FileText, Activity, Clock, Loader2, CheckCircle2, Database, User, 
  Phone, ChevronDown, X, Layers, XCircle, Timer, Mail, Award, UserPlus, 
  LogOut, ShieldAlert, Fingerprint, CreditCard, Landmark, PenTool, Video, 
  MapPin, Star, ThumbsUp, ThumbsDown, BellRing, FileCheck, Check,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { departmentService } from "../../services/department.service";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const HRGovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("candidates"); // candidates | employees | followups
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
  const location = useLocation();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [exportFilters, setExportFilters] = useState({
    start_date: "", end_date: "", status: "", department: "",
  });

  // 🚀 NEW PAGINATION STATES FOR ALL TABS
  const [candidatePage, setCandidatePage] = useState(1);
  const [employeePage, setEmployeePage] = useState(1);
  const [followupPage, setFollowupPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination when filters or tabs change
  useEffect(() => {
    setCandidatePage(1);
    setEmployeePage(1);
    setFollowupPage(1);
  }, [searchText, statusFilter, decisionFilter, timeRange, activeTab]);

  // --- DUMMY DATA FOR FOLLOW UPS ---
  const dummyFollowUps = useMemo(() => [
    { id: 1, name: "Amit Patel", role: "Frontend Developer", type: "Visted", dueDate: "2026-03-12", priority: "High", status: "pending" },
    { id: 2, name: "Sarah Jenkins", role: "Product Manager", type: "Rejected", dueDate: "2026-03-10", priority: "Critical", status: "overdue" },
    { id: 3, name: "Rahul Sharma", role: "DevOps Engineer", type: "Interview Scheduled", dueDate: "2026-03-15", priority: "Medium", status: "in_progress" },
    { id: 4, name: "Priya Desai", role: "UI/UX Designer", type: "Visited", dueDate: "2026-03-11", priority: "Low", status: "completed" },
    { id: 5, name: "John Doe", role: "Backend Engineer", type: "Document Submission", dueDate: "2026-03-20", priority: "Medium", status: "pending" },
    { id: 6, name: "Jane Smith", role: "Data Scientist", type: "Offer Letter Signing", dueDate: "2026-03-22", priority: "High", status: "completed" },
  ], []);

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (exportFilters.start_date) params.append("start_date", exportFilters.start_date);
      if (exportFilters.end_date) params.append("end_date", exportFilters.end_date);
      if (exportFilters.status) params.append("status", exportFilters.status);
      if (exportFilters.department) params.append("department", exportFilters.department);

      const url = `https://apihrr.goelectronix.co.in/interviews/export?${params.toString()}`;
      window.open(url, "_blank");

      toast.success("Excel generation protocol initiated");
      setExportModalOpen(false);
    } catch (err) {
      toast.error("Failed to generate export manifest");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(searchText, 1000);

  useEffect(() => {
    if (activeTab === "candidates") {
      fetchDashboardStats();
    } else if (activeTab === "employees") {
      fetchEmployeeStats();
    }
  }, [timeRange, debouncedSearch, statusFilter, activeTab]);


  useEffect(() => {
    if (location.state?.openCandidateModalId) {
      const candidateId = location.state.openCandidateModalId;
      const type = location.state.openCandidateModalType;
      
      // Switch to the correct tab first
      setActiveTab(type);

      // Now fetch that specific user to populate the modal
      const fetchSpecificUser = async () => {
        try {
           const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidateId}`);
           const data = await res.json();
           setSelectedCandidate(data);
        } catch(err) {
           console.error("Failed to auto-load returning profile");
        }
      };
      fetchSpecificUser();
    }
  }, [location.state]);


  // const handleViewFullProfile = () => {
  //   if (!selectedCandidate) return;

  //   // Define base path based on activeTab
  //   const basePath = activeTab === "employees" ? "/dummyemp/1" : "/profile/57";
    
  //   // Navigate and pass state so we know to reopen this modal if the user hits the browser "Back" button
  //   navigate(`${basePath}/${selectedCandidate.id}`, {
  //     state: { 
  //       returnToDashboard: true,
  //       openCandidateModalId: selectedCandidate.id,
  //       openCandidateModalType: activeTab
  //     }
  //   });
  // };

  const handleViewFullProfile = () => {
  if (!selectedCandidate) return;

  // Dynamically insert the ID into the respective paths
  const targetPath = activeTab === "employees" 
    ? `/dummyemp/${selectedCandidate.id}` 
    : `/profile/${selectedCandidate.id}`;
  
  // Navigate with the state to preserve the modal if the user clicks "Back"
  navigate(targetPath, {
    state: { 
      returnToDashboard: true,
      openCandidateModalId: selectedCandidate.id,
      openCandidateModalType: activeTab
    }
  });
};

  const buildFilters = (extra = {}) => {
    const filters = {};
    if (extra.type) filters.type = extra.type;
    if (timeRange && timeRange !== "All") filters.range = timeRange;
    if (debouncedSearch) filters.search = debouncedSearch;
    if (statusFilter !== "All") filters.status = statusFilter.toLowerCase();
    if (extra.location) filters.location = extra.location;
    return filters;
  };

  useEffect(() => {
    if (!exportModalOpen) return;
    const fetchDepts = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load departments", err);
        setDepartments([]);
      }
    };
    fetchDepts();
  }, [exportModalOpen]);

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
          status: round.status,
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
        status: emp.joining_attendance_status,
        docStatus: emp.doc_submission_status,
        date: emp.joining_date,
      });
    });
    return map;
  }, [apiStats, activeTab]);

  const stats = {
    candidates: [
      { id: "total", label: "Total Candidates", type: "all", val: apiStats?.total_candidates ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
      { id: "interviewing", label: "Interviewing", type: "interviewing", val: apiStats?.status_distribution?.find((s) => s.label === "interviewing")?.count ?? 0, icon: <Video size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
      { id: "migrated", label: "Migrated", type: "migrated", val: apiStats?.status_distribution?.find((s) => s.label === "migrated")?.count ?? 0, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
      { id: "manual", label: "Manual Entry", type: "manual", val: apiStats?.entry_method_distribution?.find((s) => s.label === "manual")?.count ?? 0, icon: <Database size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
    ],
    employees: [
      { id: "total_employees", label: "Total Employees", type: "all", val: apiStats?.total_employees ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
      { id: "active_employees", label: "Active Employees", type: "confirmed", val: apiStats?.active_employees ?? 0, icon: <ShieldCheck size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
      { id: "on_probation", label: "On Probation", type: "on_probation", val: apiStats?.status_distribution?.find((s) => s.label === "on_probation")?.count ?? 0, icon: <ShieldAlert size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
      { id: "departments", label: "Departments", type: "department", val: apiStats?.department_distribution?.length ?? 0, icon: <Landmark size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
    ],
    followups: [
      { id: "total_followups", label: "Total Follow-ups", type: "all", val: 24, icon: <Timer size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
      { id: "pending_followups", label: "Pending Actions", type: "pending", val: 12, icon: <Clock size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
      { id: "overdue_followups", label: "Overdue", type: "overdue", val: 3, icon: <ShieldAlert size={20} />, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
      { id: "completed_followups", label: "Completed", type: "completed", val: 9, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
    ],
  };

  const filteredInterviewReviews = useMemo(() => {
    return interviewReviews
      .filter((item) => {
        const matchSearch = !debouncedSearch || item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
        const lastInterview = item.interviews?.[item.interviews.length - 1];
        let decision = "in_progress";
        if (lastInterview?.review?.decision) {
          decision = lastInterview.review.decision;
        }
        const matchDecision = decisionFilter === "All" || decision === decisionFilter;
        return matchSearch && matchStatus && matchDecision;
      })
      .map((item) => {
        const lastInterview = item.interviews?.[item.interviews.length - 1];
        const score = lastInterview?.review?.total_score ? Math.round(lastInterview.review.total_score * 10) : null;
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
          date: new Date(item.updated_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
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
        emp.department_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    });
  }, [apiStats, debouncedSearch]);

  const filteredFollowUps = useMemo(() => {
    if (!debouncedSearch) return dummyFollowUps;
    return dummyFollowUps.filter((f) => 
      f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.role.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [dummyFollowUps, debouncedSearch]);

  // 🚀 CALCULATE PAGINATION DATA FOR ALL TABS
  // 1. Candidates
  const totalCandidatePages = Math.ceil(filteredInterviewReviews.length / itemsPerPage);
  const currentCandidates = filteredInterviewReviews.slice((candidatePage - 1) * itemsPerPage, candidatePage * itemsPerPage);

  // 2. Employees
  const totalEmployeePages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice((employeePage - 1) * itemsPerPage, employeePage * itemsPerPage);

  // 3. Follow Ups
  const totalFollowupPages = Math.ceil(filteredFollowUps.length / itemsPerPage);
  const currentFollowups = filteredFollowUps.slice((followupPage - 1) * itemsPerPage, followupPage * itemsPerPage);

  // 🚀 SMART PAGINATION ARRAY GENERATOR (1, 2, 3 ... 10)
  const getPaginationRange = (currentPage, totalPages) => {
    if (totalPages === 0) return [];
    const delta = 1; 
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages !== 1) range.push(totalPages);
    return range;
  };

  const interviewStatusMeta = {
    completed: { color: "bg-emerald-500", text: "Completed" },
    scheduled: { color: "bg-amber-500", text: "Scheduled" },
    cancelled: { color: "bg-rose-500", text: "Cancelled" },
    pending: { color: "bg-blue-500", text: "Pending" },
  };

  const employeeStatusMeta = {
    joined: { color: "bg-emerald-500", text: "Joined" },
    pending: { color: "bg-amber-500", text: "Pending" },
    no_show: { color: "bg-rose-500", text: "No Show" },
  };

  const GlobalTerminalLoader = () => (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
        <div className="absolute inset-0 w-24 h-24 !bg-white rounded-full animate-ping" />
        <div className="relative w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
          <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-3 text-center">
        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
            Data Fetching Processing
        </h3>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Connecting to Dashboard Page...
          </p>
          <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading && <GlobalTerminalLoader />}

      <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans antialiased text-slate-900">
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-white text-blue-500 border border-blue-500 rounded text-[9px] font-black tracking-[0.2em] uppercase shadow-sm shadow-slate-200">
                Smart HRMS
              </span>
              <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                <Lock size={10} /> Dashboard
              </div>
            </div>
            <h1 className="text-2xl font-black !tracking-[0.10em] text-slate-800">
              {activeTab === "candidates" ? "Candidate Dashboard" : activeTab === "employees" ? "Employee Dashboard" : "Follow-Up Terminal"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setExportModalOpen(true)}
              className="group flex items-center gap-3 px-6 py-3 !bg-white border !border-slate-200 rounded-xl shadow-sm hover:!border-blue-500 hover:!shadow-emerald-50 transition-all active:scale-95 cursor-pointer outline-none"
            >
              <FileText size={16} className="text-blue-600 group-hover:animate-bounce" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-700">
                Export Data
              </span>
            </button>
          </div>
        </div>

        {/* --- TRACK SWITCHER & ACTION BUTTONS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
            {[
              { id: "candidates", label: "Candidates", icon: <UserPlus size={14} strokeWidth={2.5} /> },
              { id: "employees", label: "Employees", icon: <Briefcase size={14} strokeWidth={2.5} /> },
              { id: "followups", label: "Follow Ups", icon: <Timer size={14} strokeWidth={2.5} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveView("dashboard");
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl !bg-transparent text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer outline-none border-0 ${
                  activeTab === tab.id
                    ? "!bg-blue-50 !text-blue-600 shadow-sm border !border-blue-500"
                    : "!text-slate-400 hover:!text-slate-600 hover:!bg-slate-50"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "candidates" ? (
              <button
                 onClick={() => navigate("/candidate", { state: { modal: true } })}
                className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white border border-blue-500 transition-all active:scale-95 whitespace-nowrap cursor-pointer outline-none"
              >
                <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Candidate</span>
              </button>
            ) : activeTab === "employees" ? (
              <button
                onClick={() => navigate("/newemployeesalary")}
                className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white transition-all active:scale-95 whitespace-nowrap cursor-pointer outline-none"
              >
                <Zap size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest">Onboard Employee</span>
              </button>
            ) : (
              <button
                    onClick={() => navigate("/candidatefilter")}
                className="group flex items-center gap-3 px-6 py-3 !bg-white !text-amber-600 rounded-xl border border-amber-500 shadow-md shadow-amber-100 hover:!bg-amber-50 transition-all active:scale-95 whitespace-nowrap cursor-pointer outline-none"
              >
                <BellRing size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest">New Follow Up</span>
              </button>
            )}
          </div>
        </div>

        {activeView === "dashboard" ? (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats[activeTab].map((stat) => (
                <div
                  key={stat.id}
                  onClick={() => {
                    if (activeTab === "candidates") {
                      navigate(`/dashboard/candidate-table?type=${stat.type}`);
                    } else if (activeTab === "employees") {
                      navigate(`/dashboard/employee-table?type=${stat.type}`);
                    }
                  }}
                  className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100 group-hover:bg-blue-500 transition-colors duration-300" />
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:text-blue-600 group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-500 pointer-events-none">
                    {React.cloneElement(stat.icon, { size: 100 })}
                  </div>
                  <div className="flex items-center gap-5 relative z-10 pl-2">
                    <div className={`${stat.bg} border ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 group-hover:text-slate-500 transition-colors">
                        {stat.label}
                      </p>
                      <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mt-0.5 group-hover:text-blue-600 transition-colors">
                        {stat.val}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- LEFT: MAIN LIST LOGIC --- */}
            <div className="col-span-12 xl:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  {activeTab === "candidates" ? "Interview Review " : activeTab === "employees" ? "Employee Overview" : "Active Follow-Up Tracker"}
                </h3>

                {/* --- SEARCH & FILTER BAR --- */}
                <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
                  <div className="relative flex-1 min-w-[250px] group">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search records by name, email or ID..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 text-[11px] font-bold bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium shadow-inner"
                    />
                  </div>

                  {activeTab === "candidates" && (
                    <div className="relative min-w-[180px]">
                      <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={decisionFilter}
                        onChange={(e) => setDecisionFilter(e.target.value)}
                        className="appearance-none w-full h-11 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest bg-white rounded-xl border border-slate-200 focus:border-blue-600 outline-none cursor-pointer transition-all shadow-inner text-slate-600"
                      >
                        <option value="All">All Decisions</option>
                        <option value="strong_pass">Strong Pass</option>
                        <option value="pass">Pass</option>
                        <option value="reject">Reject</option>
                        <option value="in_progress">In Progress</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  )}

                  {(searchText || (activeTab === "candidates" && decisionFilter !== "All")) && (
                    <button
                      onClick={() => { setSearchText(""); setDecisionFilter("All"); }}
                      className="h-11 px-5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm cursor-pointer outline-none"
                    >
                      <X size={12} strokeWidth={3} /> Clear
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* ================= CANDIDATE LIST ================= */}
                  {activeTab === "candidates" && (
                    <>
                      {currentCandidates.length > 0 ? (
                        <>
                          {currentCandidates.map((review) => {
                            const fullCandidate = interviewReviews.find((c) => c.id === review.id);
                            return (
                              <div
                                key={review.id}
                                onClick={() => setSelectedCandidate(fullCandidate)}
                                className="group relative flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer overflow-hidden"
                              >
                                <User className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 group-hover:text-blue-50 transition-colors pointer-events-none" size={100} />
                                
                                <div className="flex items-center gap-5 relative z-10">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${
                                      review.status === "Reject" ? "bg-rose-50 border-rose-100 text-rose-600"
                                      : review.status === "Strong Pass" ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                      : "bg-blue-50 border-blue-100 text-blue-600"
                                    }`}
                                  >
                                    {review.status === "Reject" ? <ThumbsDown size={20} /> : <ThumbsUp size={20} />}
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                                      {review.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                          review.status === "Reject" ? "bg-rose-50 text-rose-700 border-rose-100"
                                          : review.status === "Strong Pass" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                          : "bg-blue-50 text-blue-700 border-blue-100"
                                        }`}
                                      >
                                        {review.status}
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={10}/> {review.date}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {(review.status === "Pass" || review.status === "Strong Pass") && (
                                  <div className="flex items-center gap-6 relative z-10">
                                    <div className="hidden md:flex flex-col items-end">
                                      <div className="flex gap-0.5 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"} />
                                        ))}
                                      </div>
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating Match</p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-center shadow-inner group-hover:bg-white group-hover:border-blue-100 transition-colors">
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                                      <p className="text-lg font-black text-blue-600 leading-none">
                                        {review.score ?? 0}<span className="text-[10px] text-slate-300 font-bold">/100</span>
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {review.status === "Reject" && (
                                  <div className="relative z-10 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-inner">
                                    Profile Archived
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          
                          {/* 🚀 PAGINATION CONTROLS */}
                          {totalCandidatePages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6 mt-4 border-t border-slate-100">
                              <button
                                onClick={() => setCandidatePage(p => Math.max(1, p - 1))}
                                disabled={candidatePage === 1}
                                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all outline-none cursor-pointer"
                              >
                                <ChevronLeft size={16} />
                              </button>

                              {getPaginationRange(candidatePage, totalCandidatePages).map((page, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => typeof page === 'number' ? setCandidatePage(page) : null}
                                  disabled={typeof page !== 'number'}
                                  className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black transition-all border outline-none ${
                                    page === candidatePage
                                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                      : typeof page === 'number'
                                      ? "bg-white text-slate-500 border-slate-200 hover:border-blue-500 cursor-pointer"
                                      : "bg-transparent border-transparent text-slate-400 cursor-default"
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}

                              <button
                                onClick={() => setCandidatePage(p => Math.min(totalCandidatePages, p + 1))}
                                disabled={candidatePage === totalCandidatePages}
                                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all outline-none cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                            <Search size={28} strokeWidth={1.5} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">No Matches Found</h4>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Adjust filters or search criteria</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* ================= EMPLOYEE LIST ================= */}
                  {activeTab === "employees" && (
                    <>
                      {currentEmployees.length > 0 ? (
                        <>
                          {currentEmployees.map((emp) => (
                            <div 
                              key={emp.id} 
                              onClick={() => setSelectedCandidate(emp)}
                              className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden cursor-pointer"
                            >
                              <Briefcase className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-blue-50 transition-colors pointer-events-none" size={120} />
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : emp.status === 'on_probation' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                              <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
                                <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  {emp.full_name?.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                                    {emp.full_name}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1 text-slate-600"><Briefcase size={10} className="text-blue-500"/> {emp.role || "TBD"}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="flex items-center gap-1"><Landmark size={10} className="text-slate-400"/> {emp.department_name || "Unassigned"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                 <div className="flex flex-col items-start md:items-end gap-1">
                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Joined</span>
                                   <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                                     <Clock size={10} className="text-slate-400"/> 
                                     {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                                   </span>
                                 </div>

                                 <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
                                    emp.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : emp.status === "on_probation" ? "bg-amber-50 text-amber-700 border-amber-100"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                  }`}>
                                  {emp.status?.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          {/* 🚀 PAGINATION CONTROLS */}
                          {totalEmployeePages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6 mt-4 border-t border-slate-100">
                              <button
                                onClick={() => setEmployeePage(p => Math.max(1, p - 1))}
                                disabled={employeePage === 1}
                                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all outline-none cursor-pointer"
                              >
                                <ChevronLeft size={16} />
                              </button>

                              {getPaginationRange(employeePage, totalEmployeePages).map((page, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => typeof page === 'number' ? setEmployeePage(page) : null}
                                  disabled={typeof page !== 'number'}
                                  className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black transition-all border outline-none ${
                                    page === employeePage
                                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                      : typeof page === 'number'
                                      ? "bg-white text-slate-500 border-slate-200 hover:border-blue-500 cursor-pointer"
                                      : "bg-transparent border-transparent text-slate-400 cursor-default"
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}

                              <button
                                onClick={() => setEmployeePage(p => Math.min(totalEmployeePages, p + 1))}
                                disabled={employeePage === totalEmployeePages}
                                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all outline-none cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                            <Briefcase size={28} strokeWidth={1.5} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">No Employees Found</h4>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Adjust filters to see results</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* ================= FOLLOW UP LIST (DUMMY) ================= */}
                  {activeTab === "followups" && (
                    <>
                      {currentFollowups.length > 0 ? (
                        <>
                          {currentFollowups.map((follow) => (
                            <div key={follow.id} className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all overflow-hidden cursor-pointer">
                              <Timer className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-amber-50 transition-colors pointer-events-none" size={120} />
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${follow.status === 'completed' ? 'bg-emerald-500' : follow.status === 'overdue' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                              <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
                                <div className={`w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner transition-colors ${
                                    follow.status === 'overdue' ? 'text-rose-600 group-hover:bg-rose-600 group-hover:text-white' 
                                    : follow.status === 'completed' ? 'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                                    : 'text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                                  }`}>
                                  {follow.status === 'overdue' ? <ShieldAlert size={20} /> : follow.status === 'completed' ? <CheckCircle2 size={20} /> : <Timer size={20} />}
                                </div>
                                
                                <div className="space-y-1">
                                  <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
                                    {follow.name}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1 text-slate-600"><FileText size={10} className="text-amber-500"/> {follow.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="flex items-center gap-1"><User size={10} className="text-slate-400"/> {follow.role}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                 <div className="flex flex-col items-start md:items-end gap-1">
                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
                                   <span className={`text-[10px] font-bold flex items-center gap-1 ${follow.status === 'overdue' ? 'text-rose-600' : 'text-slate-600'}`}>
                                     <Clock size={10} className={follow.status === 'overdue' ? 'text-rose-500' : 'text-slate-400'}/> 
                                     {new Date(follow.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                   </span>
                                 </div>

                                 <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
                                    follow.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : follow.status === "overdue" ? "bg-rose-50 text-rose-700 border-rose-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                  }`}>
                                  {follow.status?.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* 🚀 PAGINATION CONTROLS */}
                          {totalFollowupPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6 mt-4 border-t border-slate-100">
                              <button
                                onClick={() => setFollowupPage(p => Math.max(1, p - 1))}
                                disabled={followupPage === 1}
                                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all outline-none cursor-pointer"
                              >
                                <ChevronLeft size={16} />
                              </button>

                              {getPaginationRange(followupPage, totalFollowupPages).map((page, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => typeof page === 'number' ? setFollowupPage(page) : null}
                                  disabled={typeof page !== 'number'}
                                  className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black transition-all border outline-none ${
                                    page === followupPage
                                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                      : typeof page === 'number'
                                      ? "bg-white text-slate-500 border-slate-200 hover:border-blue-500 cursor-pointer"
                                      : "bg-transparent border-transparent text-slate-400 cursor-default"
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}

                              <button
                                onClick={() => setFollowupPage(p => Math.min(totalFollowupPages, p + 1))}
                                disabled={followupPage === totalFollowupPages}
                                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all outline-none cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                            <Timer size={28} strokeWidth={1.5} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">No Follow-ups Found</h4>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Your queue is currently empty</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* --- RIGHT: CALENDAR PANEL --- */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Scheduling
                   </h4>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-4 shadow-inner mb-8">
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
                          {interviewList?.slice(0, 2).map((item, i) => (
                            <span key={`i-${i}`} className={`w-1.5 h-1.5 rounded-full ${interviewStatusMeta[item.status]?.color || "bg-slate-400"}`} />
                          ))}
                          {employeeList?.slice(0, 2).map((emp, i) => (
                            <span key={`e-${i}`} className={`w-1.5 h-1.5 rounded-full ${employeeStatusMeta[emp.status]?.color || "bg-blue-400"}`} />
                          ))}
                        </div>
                      );
                    }}
                  />
                </div>

                {/* Selected Day Feed */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Day Itinerary
                    </span>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest shadow-sm">
                      {calendarDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year:"numeric" })}
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {(() => {
                      const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
                      const interviewList = interviewDateMap[d] ?? [];
                      const employeeList = employeeJoinDateMap[d] ?? [];

                      if (interviewList.length === 0 && employeeList.length === 0)
                        return (
                          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                            <Clock size={20} className="text-slate-300 mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              No Tactical Events Found
                            </p>
                          </div>
                        );

                      return (
                        <div className="space-y-4">
                          {/* INTERVIEWS */}
                          {interviewList.map((item, i) => (
                            <div key={`int-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assessment</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">R{item.round}</span>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                    item.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : item.status === "scheduled" ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : item.status === "cancelled" ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                  }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* EMPLOYEES */}
                          {employeeList.map((emp, i) => (
                            <div key={`emp-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                    {emp.name}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Joining</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{emp.role}</span>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                    emp.status === "joined" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : emp.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : emp.status === "no_show" ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                  }`}>
                                  {emp.status === "joined" ? "Joined" : emp.status === "pending" ? "Pending" : emp.status === "no_show" ? "No Show" : emp.status}
                                </span>
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
        ) : null}

        {/* ================= MODAL: CANDIDATE / EMPLOYEE DETAIL ================= */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
              
              {/* MODAL HEADER */}
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100 flex-shrink-0">
                    <User size={28} strokeWidth={2.5}/>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                        {selectedCandidate.full_name}
                      </h2>
                      <span className="px-3 py-1 bg-white text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 shadow-sm">
                        {selectedCandidate.position || selectedCandidate.role || "Unassigned Role"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <Mail size={12} className="text-slate-400" /> {selectedCandidate.email}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <Phone size={12} className="text-slate-400" /> {selectedCandidate.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer outline-none"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="px-10 py-8 space-y-12 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 relative">
                <ShieldCheck className="absolute -right-12 -bottom-12 text-slate-50 opacity-40 pointer-events-none z-0" size={300} />
                
                {/* DATA MATRIX */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 relative z-10">
                  {[
                    { label: "Status", value: selectedCandidate.status?.replace(/_/g, ' '), icon: Activity, color: "text-emerald-500" },
                    { label: "Experiance", value: selectedCandidate.experience || "N/A", icon: Layers, color: "text-blue-500" },
                    { label: "Current Location", value: selectedCandidate.location || "Remote", icon: MapPin, color: "text-rose-500" },
                    { label: "Department", value: selectedCandidate.department_name || "N/A", icon: Landmark, color: "text-amber-500" },
                    { label: "Created on", value: selectedCandidate.created_at ? new Date(selectedCandidate.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-", icon: Clock, color: "text-slate-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        {item.icon && <item.icon size={12} className={item.color} />}
                        {item.label}
                      </p>
                      <p className="text-[13px] font-bold text-slate-800 capitalize pl-5">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="border-slate-100 relative z-10" />

                {/* ONBOARDING PROGRESS (Shows for Employees) */}
                {activeTab === "employees" ? (
                  <div className="space-y-6 relative z-10">
                    <div className="space-y-1 border-b border-slate-100 pb-4">
                      <h3 className="font-black text-blue-600 uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Zap size={14} /> Onboarding Process
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold">documentation and Onboarding Process</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Document Milestone */}
                      <div className={`p-5 border rounded-2xl flex flex-col justify-between min-h-[120px] transition-all ${selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-xl ${selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                            <FileCheck size={16} />
                          </div>
                          {selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <Clock size={16} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mt-3">KYC & Documents</p>
                          <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {selectedCandidate.doc_submission_status?.replace(/_/g, ' ') || 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Offer Letter Milestone */}
                      <div className={`p-5 border rounded-2xl flex flex-col justify-between min-h-[120px] transition-all ${selectedCandidate.offer_letter_status === 'sent' || selectedCandidate.offer_letter_status === 'accepted' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-xl ${selectedCandidate.offer_letter_status === 'sent' || selectedCandidate.offer_letter_status === 'accepted' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                            <Mail size={16} />
                          </div>
                          {selectedCandidate.offer_letter_status === 'accepted' ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : selectedCandidate.offer_letter_status === 'sent' ? (
                            <Check size={16} className="text-indigo-500" />
                          ) : (
                            <Clock size={16} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mt-3">Offer Letter</p>
                          <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCandidate.offer_letter_status === 'sent' || selectedCandidate.offer_letter_status === 'accepted' ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {selectedCandidate.offer_letter_status?.replace(/_/g, ' ') || 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Joining Letter Milestone */}
                      <div className={`p-5 border rounded-2xl flex flex-col justify-between min-h-[120px] transition-all ${selectedCandidate.joining_letter_status === 'sent' || selectedCandidate.joining_letter_status === 'accepted' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-xl ${selectedCandidate.joining_letter_status === 'sent' || selectedCandidate.joining_letter_status === 'accepted' ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                            <Briefcase size={16} />
                          </div>
                          {selectedCandidate.joining_letter_status === 'accepted' ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : selectedCandidate.joining_letter_status === 'sent' ? (
                            <Check size={16} className="text-amber-500" />
                          ) : (
                            <Clock size={16} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mt-3">Joining Letter</p>
                          <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCandidate.joining_letter_status === 'sent' || selectedCandidate.joining_letter_status === 'accepted' ? 'text-amber-600' : 'text-slate-400'}`}>
                            {selectedCandidate.joining_letter_status?.replace(/_/g, ' ') || 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* OLD ASSESSMENT PIPELINE (Shows for Candidates) */
                  <div className="space-y-8 relative z-10">
                    <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <h3 className="font-black text-blue-600 uppercase tracking-widest text-[10px] flex items-center gap-2">
                          <ShieldCheck size={14} /> Interview
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold">Interview and decision history log.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Efficiency</span>
                        <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">
                          {selectedCandidate.interviews?.length || 0} Phases
                        </span>
                      </div>
                    </div>

                    {!selectedCandidate.interviews || selectedCandidate.interviews.length === 0 ? (
                      <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
                          <Activity size={20} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">No Assessment Data</p>
                      </div>
                    ) : (
                      <div className="relative pl-2 md:pl-6">
                        <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block" />
                        <div className="space-y-10">
                          {selectedCandidate.interviews.map((round) => (
                            <div key={round.id} className="relative pl-0 md:pl-12 group transition-all">
                              <div className="absolute -left-2 top-0 hidden md:flex w-8 h-8 rounded-xl bg-white border-2 border-slate-200 items-center justify-center z-10 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors shadow-sm">
                                <span className="text-[10px] font-black">{round.round_number}</span>
                              </div>

                              <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                  <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">
                                      Phase {round.round_number}: {round.mode} Assessment
                                    </h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                      <Clock size={10}/> {new Date(round.interview_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </p>
                                  </div>
                                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border bg-white shadow-sm ${
                                      round.status === "completed" ? "text-emerald-600 border-emerald-200" : "text-slate-500 border-slate-200"
                                    }`}>
                                    {round.status}
                                  </span>
                                </div>

                                {round.review ? (
                                  <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                                    <div className="grid md:grid-cols-12">
                                      <div className="md:col-span-4 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between gap-6">
                                        <div>
                                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Decision</span>
                                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${
                                              ["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase())
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-rose-50 text-rose-700 border-rose-100"
                                            }`}>
                                            {["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase()) ? <ShieldCheck size={14}/> : <Activity size={14}/>}
                                            {round.review.decision}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Performance</span>
                                          <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-slate-800 tracking-tighter">
                                              {round.review.total_score ? Math.round(round.review.total_score * 10) : 0}
                                            </span>
                                            <span className="text-slate-400 font-bold text-xs">/100</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="md:col-span-8 p-6 space-y-6">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                                          {[
                                            { l: "Technical", v: round.review.technical_skill },
                                            { l: "Comm.", v: round.review.communication },
                                            { l: "Logic", v: round.review.problem_solving },
                                            { l: "Expertesie", v: round.review.relevant_experience },
                                          ].map((stat, i) => (
                                            <div key={i} className="space-y-1.5">
                                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</p>
                                              <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                  {[...Array(5)].map((_, star) => (
                                                    <div key={star} className={`w-1 h-2 rounded-full ${star < (stat.v/2) ? "bg-blue-500" : "bg-slate-200"}`} />
                                                  ))}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600">{stat.v}/10</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        {round.review.remarks && (
                                          <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Reviewer Remarks</p>
                                            <p className="text-[11px] text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
                                              "{round.review.remarks}"
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] p-6 flex items-center justify-center gap-4">
                                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Analytical Input...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-8 py-3 !bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest !text-slate-600 hover:!bg-slate-100 transition-all shadow-sm active:scale-95 outline-none cursor-pointer"
                >
                  Close
                </button>
                <button
                    onClick={handleViewFullProfile}
                    className="px-6 py-2.5 !bg-white !text-blue-600 border !border-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-white transition-all shadow-md shadow-blue-500/20 active:scale-95 outline-none cursor-pointer flex items-center gap-2"
                  >
                    <ArrowUpRight size={14} strokeWidth={3} /> 
                    View Full Profile
                  </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= EXCEL EXPORT MODAL ================= */}
        {exportModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
              <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                  <Database size={20} strokeWidth={2.5}/>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Data Export</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure registry extraction parameters</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
                      value={exportFilters.start_date}
                      onChange={(e) => setExportFilters({ ...exportFilters, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                    <input
                      type="date"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
                      value={exportFilters.end_date}
                      onChange={(e) => setExportFilters({ ...exportFilters, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Status</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
                      value={exportFilters.status}
                      onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
                    >
                      <option value="">All Statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Node</label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={exportFilters.department}
                      onChange={(e) => setExportFilters({ ...exportFilters, department: e.target.value })}
                      className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
                    >
                      <option value="">Select Organizational Unit</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>{dept.name} ({dept.code || "N/A"})</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => setExportModalOpen(false)}
                  className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95 outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2 outline-none cursor-pointer"
                >
                  <ArrowUpRight size={14} strokeWidth={3} /> Execute Export
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
//********************************************************************************************************* */
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus, 
//   Lock, FileText, Activity, Clock, Loader2, CheckCircle2, Database, User, 
//   Phone, ChevronDown, X, Layers, XCircle, Timer, Mail, Award, UserPlus, 
//   LogOut, ShieldAlert, Fingerprint, CreditCard, Landmark, PenTool, Video, 
//   MapPin, Star, ThumbsUp, ThumbsDown, BellRing, FileCheck, Check
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { departmentService } from "../../services/department.service";
// import toast from "react-hot-toast";

// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates"); // candidates | employees | followups
//   const [activeView, setActiveView] = useState("dashboard");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState("All");
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [apiStats, setApiStats] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   // Reuse this state for both candidates and employees
//   const [selectedCandidate, setSelectedCandidate] = useState(null); 
  
//   const [decisionFilter, setDecisionFilter] = useState("All");
//   const navigate = useNavigate();
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [exportFilters, setExportFilters] = useState({
//     start_date: "", end_date: "", status: "", department: "",
//   });

//   // --- DUMMY DATA FOR FOLLOW UPS ---
//   const dummyFollowUps = useMemo(() => [
//     { id: 1, name: "Amit Patel", role: "Frontend Developer", type: "Visted", dueDate: "2026-03-12", priority: "High", status: "pending" },
//     { id: 2, name: "Sarah Jenkins", role: "Product Manager", type: "Rejected", dueDate: "2026-03-10", priority: "Critical", status: "overdue" },
//     { id: 3, name: "Rahul Sharma", role: "DevOps Engineer", type: "Interview Scheduled", dueDate: "2026-03-15", priority: "Medium", status: "in_progress" },
//     { id: 4, name: "Priya Desai", role: "UI/UX Designer", type: "Visited", dueDate: "2026-03-11", priority: "Low", status: "completed" },
//   ], []);

//   const handleExportExcel = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (exportFilters.start_date) params.append("start_date", exportFilters.start_date);
//       if (exportFilters.end_date) params.append("end_date", exportFilters.end_date);
//       if (exportFilters.status) params.append("status", exportFilters.status);
//       if (exportFilters.department) params.append("department", exportFilters.department);

//       const url = `https://apihrr.goelectronix.co.in/interviews/export?${params.toString()}`;
//       window.open(url, "_blank");

//       toast.success("Excel generation protocol initiated");
//       setExportModalOpen(false);
//     } catch (err) {
//       toast.error("Failed to generate export manifest");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//     if (timeRange && timeRange !== "All") filters.range = timeRange;
//     if (debouncedSearch) filters.search = debouncedSearch;
//     if (statusFilter !== "All") filters.status = statusFilter.toLowerCase();
//     if (extra.location) filters.location = extra.location;
//     return filters;
//   };

//   useEffect(() => {
//     if (!exportModalOpen) return;
//     const fetchDepts = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load departments", err);
//         setDepartments([]);
//       }
//     };
//     fetchDepts();
//   }, [exportModalOpen]);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const start = Date.now();
//       const filters = buildFilters();
//       const data = await dashboardService.getCandidateStats(filters);
//       const elapsed = Date.now() - start;
//       if (elapsed < 400) {
//         await new Promise((r) => setTimeout(r, 400 - elapsed));
//       }
//       setApiStats(data);
//     } catch (err) {
//       console.error(err);
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
//           status: round.status,
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
//         status: emp.joining_attendance_status,
//         docStatus: emp.doc_submission_status,
//         date: emp.joining_date,
//       });
//     });
//     return map;
//   }, [apiStats, activeTab]);

//   const stats = {
//     candidates: [
//       { id: "total", label: "Total Candidates", type: "all", val: apiStats?.total_candidates ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "interviewing", label: "Interviewing", type: "interviewing", val: apiStats?.status_distribution?.find((s) => s.label === "interviewing")?.count ?? 0, icon: <Video size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
//       { id: "migrated", label: "Migrated", type: "migrated", val: apiStats?.status_distribution?.find((s) => s.label === "migrated")?.count ?? 0, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//       { id: "manual", label: "Manual Entry", type: "manual", val: apiStats?.entry_method_distribution?.find((s) => s.label === "manual")?.count ?? 0, icon: <Database size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//     ],
//     employees: [
//       { id: "total_employees", label: "Total Employees", type: "all", val: apiStats?.total_employees ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "active_employees", label: "Active Employees", type: "confirmed", val: apiStats?.active_employees ?? 0, icon: <ShieldCheck size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//       { id: "on_probation", label: "On Probation", type: "on_probation", val: apiStats?.status_distribution?.find((s) => s.label === "on_probation")?.count ?? 0, icon: <ShieldAlert size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//       { id: "departments", label: "Departments", type: "department", val: apiStats?.department_distribution?.length ?? 0, icon: <Landmark size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
//     ],
//     followups: [
//       { id: "total_followups", label: "Total Follow-ups", type: "all", val: 24, icon: <Timer size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "pending_followups", label: "Pending Actions", type: "pending", val: 12, icon: <Clock size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//       { id: "overdue_followups", label: "Overdue", type: "overdue", val: 3, icon: <ShieldAlert size={20} />, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
//       { id: "completed_followups", label: "Completed", type: "completed", val: 9, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         const matchSearch = !debouncedSearch || item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
//         const matchStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
//         const lastInterview = item.interviews?.[item.interviews.length - 1];
//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision;
//         }
//         const matchDecision = decisionFilter === "All" || decision === decisionFilter;
//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];
//         const score = lastInterview?.review?.total_score ? Math.round(lastInterview.review.total_score * 10) : null;
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
//           date: new Date(item.updated_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
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
//         emp.department_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
//       );
//     });
//   }, [apiStats, debouncedSearch]);

//   const filteredFollowUps = useMemo(() => {
//     if (!debouncedSearch) return dummyFollowUps;
//     return dummyFollowUps.filter((f) => 
//       f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//       f.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//       f.role.toLowerCase().includes(debouncedSearch.toLowerCase())
//     );
//   }, [dummyFollowUps, debouncedSearch]);

//   const interviewStatusMeta = {
//     completed: { color: "bg-emerald-500", text: "Completed" },
//     scheduled: { color: "bg-amber-500", text: "Scheduled" },
//     cancelled: { color: "bg-rose-500", text: "Cancelled" },
//     pending: { color: "bg-blue-500", text: "Pending" },
//   };

//   const employeeStatusMeta = {
//     joined: { color: "bg-emerald-500", text: "Joined" },
//     pending: { color: "bg-amber-500", text: "Pending" },
//     no_show: { color: "bg-rose-500", text: "No Show" },
//   };

//   const GlobalTerminalLoader = () => (
//     <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-8">
//         <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
//         <div className="absolute inset-0 w-24 h-24 !bg-white rounded-full animate-ping" />
//         <div className="relative w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//           <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-3 text-center">
//         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
//            Data Fetching Processing
//         </h3>
//         <div className="flex flex-col items-center gap-1">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//             Connecting to Dashboard Page...
//           </p>
//           <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
//             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
//           </div>
//         </div>
//       </div>
//       <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
//         <div className="flex items-center gap-1.5">
//           <Lock size={10} />
//           <span className="text-[9px] font-black uppercase tracking-tighter">Encrypted Handshake</span>
//         </div>
//         <div className="w-1 h-1 bg-slate-200 rounded-full" />
//         <div className="text-[9px] font-black uppercase tracking-tighter">ISO 27001 Verified</div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {loading && <GlobalTerminalLoader />}

//       <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans antialiased text-slate-900">
//         {/* --- HEADER --- */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <span className="px-2 py-0.5 bg-white text-blue-500 border border-blue-500 rounded text-[9px] font-black tracking-[0.2em] uppercase shadow-sm shadow-slate-200">
//                 Smart HRMS
//               </span>
//               <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//                 <Lock size={10} /> Dashboard
//               </div>
//             </div>
//             <h1 className="text-2xl font-black !tracking-[0.10em] text-slate-800">
//               {activeTab === "candidates" ? "Candidate Dashboard" : activeTab === "employees" ? "Employee Dashboard" : "Follow-Up Terminal"}
//             </h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setExportModalOpen(true)}
//               className="group flex items-center gap-3 px-6 py-3 !bg-white border !border-slate-200 rounded-xl shadow-sm hover:!border-blue-500 hover:!shadow-emerald-50 transition-all active:scale-95 cursor-pointer outline-none"
//             >
//               <FileText size={16} className="text-blue-600 group-hover:animate-bounce" />
//               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-700">
//                 Export Data
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* --- TRACK SWITCHER & ACTION BUTTONS --- */}
//         <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
//           <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
//             {[
//               { id: "candidates", label: "Candidates", icon: <UserPlus size={14} strokeWidth={2.5} /> },
//               { id: "employees", label: "Employees", icon: <Briefcase size={14} strokeWidth={2.5} /> },
//               { id: "followups", label: "Follow Ups", icon: <Timer size={14} strokeWidth={2.5} /> },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setActiveView("dashboard");
//                 }}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl !bg-transparent text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer outline-none border-0 ${
//                   activeTab === tab.id
//                     ? "!bg-blue-50 !text-blue-600 shadow-sm border !border-blue-500"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-slate-50"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div>
//             {activeTab === "candidates" ? (
//               <button
//                  onClick={() => navigate("/candidate", { state: { modal: true } })}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white border border-blue-500 transition-all active:scale-95 whitespace-nowrap cursor-pointer outline-none"
//               >
//                 <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Add Candidate</span>
//               </button>
//             ) : activeTab === "employees" ? (
//               <button
//                 onClick={() => navigate("/newemployeesalary")}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white transition-all active:scale-95 whitespace-nowrap cursor-pointer outline-none"
//               >
//                 <Zap size={16} strokeWidth={2.5} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Onboard Employee</span>
//               </button>
//             ) : (
//               <button
//                     onClick={() => navigate("/candidatefilter")}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-amber-600 rounded-xl border border-amber-500 shadow-md shadow-amber-100 hover:!bg-amber-50 transition-all active:scale-95 whitespace-nowrap cursor-pointer outline-none"
//               >
//                 <BellRing size={16} strokeWidth={2.5} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">New Follow Up</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {activeView === "dashboard" ? (
//           <div className="grid grid-cols-12 gap-8">
//             {/* --- KPI CARDS --- */}
//             {/* <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//                 {stats[activeTab].map((stat) => (
//                   <div
//                     key={stat.id}
//                     onClick={() => {
//                       if (activeTab === "candidates") {
//                         navigate(`/dashboard/candidate-table?type=${stat.type}`);
//                       } else if (activeTab === "employees") {
//                         navigate(`/dashboard/employee-table?type=${stat.type}`);
//                       }
//                     }}
//                     className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all group relative overflow-hidden"
//                   >
                  
//                     <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:text-blue-900 transition-colors pointer-events-none">
//                         {React.cloneElement(stat.icon, { size: 100 })}
//                     </div>

//                   <div  className="flex" >
//                       <div className={`${stat.bg} border ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
//                       {stat.icon}
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">
//                       {stat.label}
//                     </p>
//                     <h2 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 group-hover:text-blue-600 transition-colors">
//                       {stat.val}
//                     </h2>
//                     </div>
//                   </div>
//                   </div>
//                 ))}
//             </div> */}

//             <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//   {stats[activeTab].map((stat) => (
//     <div
//       key={stat.id}
//       onClick={() => {
//         if (activeTab === "candidates") {
//           navigate(`/dashboard/candidate-table?type=${stat.type}`);
//         } else if (activeTab === "employees") {
//           navigate(`/dashboard/employee-table?type=${stat.type}`);
//         }
//       }}
//       className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 cursor-pointer transition-all duration-300 group relative overflow-hidden"
//     >
//       {/* ✨ Subtle left accent bar that illuminates on hover */}
//       <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100 group-hover:bg-blue-500 transition-colors duration-300" />

//       {/* 🎨 Background Decorative Icon with subtle float animation */}
//       <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:text-blue-600 group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-500 pointer-events-none">
//         {React.cloneElement(stat.icon, { size: 100 })}
//       </div>

//       {/* 📊 Horizontal Content Layout */}
//       <div className="flex items-center gap-5 relative z-10 pl-2">
//         {/* Icon Container */}
//         <div className={`${stat.bg} border ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
//           {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
//         </div>
        
//         {/* Text Container */}
//         <div className="flex flex-col justify-center">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 group-hover:text-slate-500 transition-colors">
//             {stat.label}
//           </p>
//           <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mt-0.5 group-hover:text-blue-600 transition-colors">
//             {stat.val}
//           </h2>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>

//             {/* --- LEFT: MAIN LIST LOGIC --- */}
//             <div className="col-span-12 xl:col-span-8 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
//                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
//                   {activeTab === "candidates" ? "Interview Review " : activeTab === "employees" ? "Employee Overview" : "Active Follow-Up Tracker"}
//                 </h3>

//                 {/* --- SEARCH & FILTER BAR --- */}
//                 <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
//                   <div className="relative flex-1 min-w-[250px] group">
//                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                     <input
//                       type="text"
//                       placeholder="Search records by name, email or ID..."
//                       value={searchText}
//                       onChange={(e) => setSearchText(e.target.value)}
//                       className="w-full h-11 pl-11 pr-4 text-[11px] font-bold bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium shadow-inner"
//                     />
//                   </div>

//                   {activeTab === "candidates" && (
//                     <div className="relative min-w-[180px]">
//                       <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                       <select
//                         value={decisionFilter}
//                         onChange={(e) => setDecisionFilter(e.target.value)}
//                         className="appearance-none w-full h-11 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest bg-white rounded-xl border border-slate-200 focus:border-blue-600 outline-none cursor-pointer transition-all shadow-inner text-slate-600"
//                       >
//                         <option value="All">All Decisions</option>
//                         <option value="strong_pass">Strong Pass</option>
//                         <option value="pass">Pass</option>
//                         <option value="reject">Reject</option>
//                         <option value="in_progress">In Progress</option>
//                       </select>
//                       <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   )}

//                   {(searchText || (activeTab === "candidates" && decisionFilter !== "All")) && (
//                     <button
//                       onClick={() => { setSearchText(""); setDecisionFilter("All"); }}
//                       className="h-11 px-5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm cursor-pointer outline-none"
//                     >
//                       <X size={12} strokeWidth={3} /> Clear
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {/* ================= CANDIDATE LIST ================= */}
//                   {activeTab === "candidates" && (
//                     <>
//                       {filteredInterviewReviews.map((review) => {
//                         const fullCandidate = interviewReviews.find((c) => c.id === review.id);
//                         return (
//                           <div
//                             key={review.id}
//                             onClick={() => setSelectedCandidate(fullCandidate)}
//                             className="group relative flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer overflow-hidden"
//                           >
//                             <User className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 group-hover:text-blue-50 transition-colors pointer-events-none" size={100} />
                            
//                             <div className="flex items-center gap-5 relative z-10">
//                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${
//                                   review.status === "Reject" ? "bg-rose-50 border-rose-100 text-rose-600"
//                                   : review.status === "Strong Pass" ? "bg-emerald-50 border-emerald-100 text-emerald-600"
//                                   : "bg-blue-50 border-blue-100 text-blue-600"
//                                 }`}
//                               >
//                                 {review.status === "Reject" ? <ThumbsDown size={20} /> : <ThumbsUp size={20} />}
//                               </div>

//                               <div>
//                                 <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                                   {review.name}
//                                 </h4>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
//                                       review.status === "Reject" ? "bg-rose-50 text-rose-700 border-rose-100"
//                                       : review.status === "Strong Pass" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                                       : "bg-blue-50 text-blue-700 border-blue-100"
//                                     }`}
//                                   >
//                                     {review.status}
//                                   </span>
//                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                                     <Clock size={10}/> {review.date}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {(review.status === "Pass" || review.status === "Strong Pass") && (
//                               <div className="flex items-center gap-6 relative z-10">
//                                 <div className="hidden md:flex flex-col items-end">
//                                   <div className="flex gap-0.5 mb-1">
//                                     {[...Array(5)].map((_, i) => (
//                                       <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"} />
//                                     ))}
//                                   </div>
//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating Match</p>
//                                 </div>

//                                 <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-center shadow-inner group-hover:bg-white group-hover:border-blue-100 transition-colors">
//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</p>
//                                   <p className="text-lg font-black text-blue-600 leading-none">
//                                     {review.score ?? 0}<span className="text-[10px] text-slate-300 font-bold">/100</span>
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {review.status === "Reject" && (
//                               <div className="relative z-10 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-inner">
//                                 Profile Archived
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </>
//                   )}

//                   {/* ================= EMPLOYEE LIST ================= */}
//                   {activeTab === "employees" &&
//                     filteredEmployees.map((emp) => (
//                       <div 
//                         key={emp.id} 
//                         // 🔥 ADDED ONCLICK HANDLER HERE
//                         onClick={() => setSelectedCandidate(emp)}
//                         className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden cursor-pointer"
//                       >
//                         <Briefcase className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-blue-50 transition-colors pointer-events-none" size={120} />
                        
//                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : emp.status === 'on_probation' ? 'bg-amber-500' : 'bg-slate-300'}`} />

//                         <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
//                           <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
//                             {emp.full_name?.charAt(0)}
//                           </div>
                          
//                           <div className="space-y-1">
//                             <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                               {emp.full_name}
//                             </h4>
//                             <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                               <span className="flex items-center gap-1 text-slate-600"><Briefcase size={10} className="text-blue-500"/> {emp.role || "TBD"}</span>
//                               <span className="w-1 h-1 rounded-full bg-slate-200" />
//                               <span className="flex items-center gap-1"><Landmark size={10} className="text-slate-400"/> {emp.department_name || "Unassigned"}</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
//                            <div className="flex flex-col items-start md:items-end gap-1">
//                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Joined</span>
//                              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
//                                <Clock size={10} className="text-slate-400"/> 
//                                {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
//                              </span>
//                            </div>

//                            <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
//                               emp.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                               : emp.status === "on_probation" ? "bg-amber-50 text-amber-700 border-amber-100"
//                               : "bg-slate-50 text-slate-600 border-slate-200"
//                             }`}>
//                             {emp.status?.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                       </div>
//                     ))}

//                   {/* ================= FOLLOW UP LIST (DUMMY) ================= */}
//                   {activeTab === "followups" &&
//                     filteredFollowUps.map((follow) => (
//                       <div key={follow.id} className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all overflow-hidden cursor-pointer">
//                         <Timer className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-amber-50 transition-colors pointer-events-none" size={120} />
                        
//                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${follow.status === 'completed' ? 'bg-emerald-500' : follow.status === 'overdue' ? 'bg-rose-500' : 'bg-amber-500'}`} />

//                         <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
//                           <div className={`w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner transition-colors ${
//                               follow.status === 'overdue' ? 'text-rose-600 group-hover:bg-rose-600 group-hover:text-white' 
//                               : follow.status === 'completed' ? 'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
//                               : 'text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
//                             }`}>
//                             {follow.status === 'overdue' ? <ShieldAlert size={20} /> : follow.status === 'completed' ? <CheckCircle2 size={20} /> : <Timer size={20} />}
//                           </div>
                          
//                           <div className="space-y-1">
//                             <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
//                               {follow.name}
//                             </h4>
//                             <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                               <span className="flex items-center gap-1 text-slate-600"><FileText size={10} className="text-amber-500"/> {follow.type}</span>
//                               <span className="w-1 h-1 rounded-full bg-slate-200" />
//                               <span className="flex items-center gap-1"><User size={10} className="text-slate-400"/> {follow.role}</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
//                            <div className="flex flex-col items-start md:items-end gap-1">
//                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
//                              <span className={`text-[10px] font-bold flex items-center gap-1 ${follow.status === 'overdue' ? 'text-rose-600' : 'text-slate-600'}`}>
//                                <Clock size={10} className={follow.status === 'overdue' ? 'text-rose-500' : 'text-slate-400'}/> 
//                                {new Date(follow.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//                              </span>
//                            </div>

//                            <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
//                               follow.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                               : follow.status === "overdue" ? "bg-rose-50 text-rose-700 border-rose-100"
//                               : "bg-amber-50 text-amber-700 border-amber-100"
//                             }`}>
//                             {follow.status?.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>

//             {/* --- RIGHT: CALENDAR PANEL --- */}
//             <div className="col-span-12 xl:col-span-4 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <div className="flex items-center justify-between mb-6">
//                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Calander
//                    </h4>
//                 </div>

//                 <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-4 shadow-inner mb-8">
//                   <Calendar
//                     value={calendarDate}
//                     onChange={setCalendarDate}
//                     tileContent={({ date, view }) => {
//                       if (view !== "month") return null;
//                       const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                       const interviewList = interviewDateMap[d];
//                       const employeeList = employeeJoinDateMap[d];
//                       if (!interviewList && !employeeList) return null;

//                       return (
//                         <div className="flex justify-center mt-1 gap-1 flex-wrap">
//                           {interviewList?.slice(0, 2).map((item, i) => (
//                             <span key={`i-${i}`} className={`w-1.5 h-1.5 rounded-full ${interviewStatusMeta[item.status]?.color || "bg-slate-400"}`} />
//                           ))}
//                           {employeeList?.slice(0, 2).map((emp, i) => (
//                             <span key={`e-${i}`} className={`w-1.5 h-1.5 rounded-full ${employeeStatusMeta[emp.status]?.color || "bg-blue-400"}`} />
//                           ))}
//                         </div>
//                       );
//                     }}
//                   />
//                 </div>

//                 {/* Selected Day Feed */}
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                       Day Itinerary
//                     </span>
//                     <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest shadow-sm">
//                       {calendarDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year:"numeric" })}
//                     </span>
//                   </div>

//                   <div className="max-h-72 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
//                     {(() => {
//                       const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
//                       const interviewList = interviewDateMap[d] ?? [];
//                       const employeeList = employeeJoinDateMap[d] ?? [];

//                       if (interviewList.length === 0 && employeeList.length === 0)
//                         return (
//                           <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
//                             <Clock size={20} className="text-slate-300 mb-3" />
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                               No Tactical Events Found
//                             </p>
//                           </div>
//                         );

//                       return (
//                         <div className="space-y-4">
//                           {/* INTERVIEWS */}
//                           {interviewList.map((item, i) => (
//                             <div key={`int-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
//                                     {item.name}
//                                   </span>
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assessment</span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">R{item.round}</span>
//                                   </div>
//                                 </div>
//                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
//                                     item.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                     : item.status === "scheduled" ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : item.status === "cancelled" ? "bg-rose-50 text-rose-600 border-rose-100"
//                                     : "bg-slate-50 text-slate-500 border-slate-200"
//                                   }`}>
//                                   {item.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}

//                           {/* EMPLOYEES */}
//                           {employeeList.map((emp, i) => (
//                             <div key={`emp-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
//                                     {emp.name}
//                                   </span>
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Joining</span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{emp.role}</span>
//                                   </div>
//                                 </div>
//                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
//                                     emp.status === "joined" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                     : emp.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : emp.status === "no_show" ? "bg-rose-50 text-rose-600 border-rose-100"
//                                     : "bg-slate-50 text-slate-500 border-slate-200"
//                                   }`}>
//                                   {emp.status === "joined" ? "Joined" : emp.status === "pending" ? "Pending" : emp.status === "no_show" ? "No Show" : emp.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : null}

//         {/* ================= MODAL: CANDIDATE / EMPLOYEE DETAIL ================= */}
//         {selectedCandidate && (
//           <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
              
//               {/* MODAL HEADER */}
//               <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
//                 <div className="flex gap-6 items-center">
//                   <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100 flex-shrink-0">
//                     <User size={28} strokeWidth={2.5}/>
//                   </div>
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-3">
//                       <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
//                         {selectedCandidate.full_name}
//                       </h2>
//                       <span className="px-3 py-1 bg-white text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 shadow-sm">
//                         {selectedCandidate.position || selectedCandidate.role || "Unassigned Role"}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-4">
//                       <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
//                         <Mail size={12} className="text-slate-400" /> {selectedCandidate.email}
//                       </p>
//                       <div className="w-1 h-1 rounded-full bg-slate-300" />
//                       <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
//                         <Phone size={12} className="text-slate-400" /> {selectedCandidate.phone || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-2.5 !bg-white border !border-slate-200 !text-slate-400 hover:text-slate-500 hover:border-slate-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer outline-none"
//                 >
//                   <X size={18} strokeWidth={2.5} />
//                 </button>
//               </div>

//               {/* MODAL BODY */}
//               <div className="px-10 py-8 space-y-12 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 relative">
//                 <ShieldCheck className="absolute -right-12 -bottom-12 text-slate-50 opacity-40 pointer-events-none z-0" size={300} />
                
//                 {/* DATA MATRIX */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 relative z-10">
//                   {[
//                     { label: "Status", value: selectedCandidate.status?.replace(/_/g, ' '), icon: Activity, color: "text-emerald-500" },
//                     { label: "Experiance", value: selectedCandidate.experience || "N/A", icon: Layers, color: "text-blue-500" },
//                     { label: "Current Location", value: selectedCandidate.location || "Remote", icon: MapPin, color: "text-rose-500" },
//                     { label: "Department", value: selectedCandidate.department_name || "N/A", icon: Landmark, color: "text-amber-500" },
//                     { label: "Created on", value: selectedCandidate.created_at ? new Date(selectedCandidate.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-", icon: Clock, color: "text-slate-400" },
//                   ].map((item, idx) => (
//                     <div key={idx} className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                         {item.icon && <item.icon size={12} className={item.color} />}
//                         {item.label}
//                       </p>
//                       <p className="text-[13px] font-bold text-slate-800 capitalize pl-5">
//                         {item.value}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <hr className="border-slate-100 relative z-10" />

//                 {/* 🔥 NEW: ONBOARDING PROGRESS (Shows for Employees) */}
//                 {activeTab === "employees" ? (
//                   <div className="space-y-6 relative z-10">
//                     <div className="space-y-1 border-b border-slate-100 pb-4">
//                       <h3 className="font-black text-blue-600 uppercase tracking-widest text-[10px] flex items-center gap-2">
//                         <Zap size={14} /> Onboarding Process
//                       </h3>
//                       <p className="text-[11px] text-slate-400 font-bold">documentation and Onboarding Process</p>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {/* Document Milestone */}
//                       <div className={`p-5 border rounded-2xl flex flex-col justify-between min-h-[120px] transition-all ${selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
//                         <div className="flex items-start justify-between">
//                           <div className={`p-2 rounded-xl ${selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
//                             <FileCheck size={16} />
//                           </div>
//                           {selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? (
//                             <CheckCircle2 size={16} className="text-emerald-500" />
//                           ) : (
//                             <Clock size={16} className="text-slate-300" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mt-3">KYC & Documents</p>
//                           <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCandidate.doc_submission_status === 'submitted' || selectedCandidate.doc_submission_status === 'verified' ? 'text-emerald-600' : 'text-slate-400'}`}>
//                             {selectedCandidate.doc_submission_status?.replace(/_/g, ' ') || 'Pending'}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Offer Letter Milestone */}
//                       <div className={`p-5 border rounded-2xl flex flex-col justify-between min-h-[120px] transition-all ${selectedCandidate.offer_letter_status === 'sent' || selectedCandidate.offer_letter_status === 'accepted' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
//                         <div className="flex items-start justify-between">
//                           <div className={`p-2 rounded-xl ${selectedCandidate.offer_letter_status === 'sent' || selectedCandidate.offer_letter_status === 'accepted' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
//                             <Mail size={16} />
//                           </div>
//                           {selectedCandidate.offer_letter_status === 'accepted' ? (
//                             <CheckCircle2 size={16} className="text-emerald-500" />
//                           ) : selectedCandidate.offer_letter_status === 'sent' ? (
//                             <Check size={16} className="text-indigo-500" />
//                           ) : (
//                             <Clock size={16} className="text-slate-300" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mt-3">Offer Letter</p>
//                           <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCandidate.offer_letter_status === 'sent' || selectedCandidate.offer_letter_status === 'accepted' ? 'text-indigo-600' : 'text-slate-400'}`}>
//                             {selectedCandidate.offer_letter_status?.replace(/_/g, ' ') || 'Pending'}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Joining Letter Milestone */}
//                       <div className={`p-5 border rounded-2xl flex flex-col justify-between min-h-[120px] transition-all ${selectedCandidate.joining_letter_status === 'sent' || selectedCandidate.joining_letter_status === 'accepted' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
//                         <div className="flex items-start justify-between">
//                           <div className={`p-2 rounded-xl ${selectedCandidate.joining_letter_status === 'sent' || selectedCandidate.joining_letter_status === 'accepted' ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
//                             <Briefcase size={16} />
//                           </div>
//                           {selectedCandidate.joining_letter_status === 'accepted' ? (
//                             <CheckCircle2 size={16} className="text-emerald-500" />
//                           ) : selectedCandidate.joining_letter_status === 'sent' ? (
//                             <Check size={16} className="text-amber-500" />
//                           ) : (
//                             <Clock size={16} className="text-slate-300" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mt-3">Joining Letter</p>
//                           <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCandidate.joining_letter_status === 'sent' || selectedCandidate.joining_letter_status === 'accepted' ? 'text-amber-600' : 'text-slate-400'}`}>
//                             {selectedCandidate.joining_letter_status?.replace(/_/g, ' ') || 'Pending'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   /* OLD ASSESSMENT PIPELINE (Shows for Candidates) */
//                   <div className="space-y-8 relative z-10">
//                     <div className="flex items-end justify-between border-b border-slate-100 pb-4">
//                       <div className="space-y-1">
//                         <h3 className="font-black text-blue-600 uppercase tracking-widest text-[10px] flex items-center gap-2">
//                           <ShieldCheck size={14} /> Interview
//                         </h3>
//                         <p className="text-[11px] text-slate-400 font-bold">Interview and decision history log.</p>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Efficiency</span>
//                         <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">
//                           {selectedCandidate.interviews?.length || 0} Phases
//                         </span>
//                       </div>
//                     </div>

//                     {!selectedCandidate.interviews || selectedCandidate.interviews.length === 0 ? (
//                       <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
//                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
//                           <Activity size={20} />
//                         </div>
//                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">No Assessment Data</p>
//                       </div>
//                     ) : (
//                       <div className="relative pl-2 md:pl-6">
//                         <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block" />
//                         <div className="space-y-10">
//                           {selectedCandidate.interviews.map((round) => (
//                             <div key={round.id} className="relative pl-0 md:pl-12 group transition-all">
//                               <div className="absolute -left-2 top-0 hidden md:flex w-8 h-8 rounded-xl bg-white border-2 border-slate-200 items-center justify-center z-10 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors shadow-sm">
//                                 <span className="text-[10px] font-black">{round.round_number}</span>
//                               </div>

//                               <div className="flex flex-col gap-4">
//                                 <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
//                                   <div>
//                                     <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">
//                                       Phase {round.round_number}: {round.mode} Assessment
//                                     </h4>
//                                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
//                                       <Clock size={10}/> {new Date(round.interview_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                                     </p>
//                                   </div>
//                                   <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border bg-white shadow-sm ${
//                                       round.status === "completed" ? "text-emerald-600 border-emerald-200" : "text-slate-500 border-slate-200"
//                                     }`}>
//                                     {round.status}
//                                   </span>
//                                 </div>

//                                 {round.review ? (
//                                   <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
//                                     <div className="grid md:grid-cols-12">
//                                       <div className="md:col-span-4 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between gap-6">
//                                         <div>
//                                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Decision</span>
//                                           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${
//                                               ["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase())
//                                                 ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                                                 : "bg-rose-50 text-rose-700 border-rose-100"
//                                             }`}>
//                                             {["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase()) ? <ShieldCheck size={14}/> : <Activity size={14}/>}
//                                             {round.review.decision}
//                                           </div>
//                                         </div>
//                                         <div>
//                                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Performance</span>
//                                           <div className="flex items-baseline gap-1">
//                                             <span className="text-3xl font-black text-slate-800 tracking-tighter">
//                                               {round.review.total_score ? Math.round(round.review.total_score * 10) : 0}
//                                             </span>
//                                             <span className="text-slate-400 font-bold text-xs">/100</span>
//                                           </div>
//                                         </div>
//                                       </div>

//                                       <div className="md:col-span-8 p-6 space-y-6">
//                                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
//                                           {[
//                                             { l: "Technical", v: round.review.technical_skill },
//                                             { l: "Comm.", v: round.review.communication },
//                                             { l: "Logic", v: round.review.problem_solving },
//                                             { l: "Expertesie", v: round.review.relevant_experience },
//                                           ].map((stat, i) => (
//                                             <div key={i} className="space-y-1.5">
//                                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</p>
//                                               <div className="flex items-center gap-2">
//                                                 <div className="flex gap-0.5">
//                                                   {[...Array(5)].map((_, star) => (
//                                                     <div key={star} className={`w-1 h-2 rounded-full ${star < (stat.v/2) ? "bg-blue-500" : "bg-slate-200"}`} />
//                                                   ))}
//                                                 </div>
//                                                 <span className="text-[10px] font-black text-slate-600">{stat.v}/10</span>
//                                               </div>
//                                             </div>
//                                           ))}
//                                         </div>

//                                         {round.review.remarks && (
//                                           <div className="pt-4 border-t border-slate-100">
//                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Reviewer Remarks</p>
//                                             <p className="text-[11px] text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
//                                               "{round.review.remarks}"
//                                             </p>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] p-6 flex items-center justify-center gap-4">
//                                     <Loader2 size={16} className="text-blue-500 animate-spin" />
//                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Analytical Input...</p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* MODAL FOOTER */}
//               <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="px-8 py-3 !bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest !text-slate-600 hover:!bg-slate-100 transition-all shadow-sm active:scale-95 outline-none cursor-pointer"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= EXCEL EXPORT MODAL ================= */}
//         {exportModalOpen && (
//           <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
//               <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
//                   <Database size={20} strokeWidth={2.5}/>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Data Export</h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure registry extraction parameters</p>
//                 </div>
//               </div>

//               <div className="p-8 space-y-6">
//                 <div className="grid grid-cols-2 gap-5">
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
//                     <input
//                       type="date"
//                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
//                       value={exportFilters.start_date}
//                       onChange={(e) => setExportFilters({ ...exportFilters, start_date: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
//                     <input
//                       type="date"
//                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
//                       value={exportFilters.end_date}
//                       onChange={(e) => setExportFilters({ ...exportFilters, end_date: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Status</label>
//                   <div className="relative">
//                     <select
//                       className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
//                       value={exportFilters.status}
//                       onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
//                     >
//                       <option value="">All Statuses</option>
//                       <option value="scheduled">Scheduled</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                     <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Node</label>
//                   <div className="relative">
//                     <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <select
//                       value={exportFilters.department}
//                       onChange={(e) => setExportFilters({ ...exportFilters, department: e.target.value })}
//                       className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
//                     >
//                       <option value="">Select Organizational Unit</option>
//                       {departments.map((dept) => (
//                         <option key={dept.id} value={dept.name}>{dept.name} ({dept.code || "N/A"})</option>
//                       ))}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//               </div>

//               <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
//                 <button
//                   onClick={() => setExportModalOpen(false)}
//                   className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95 outline-none cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleExportExcel}
//                   className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2 outline-none cursor-pointer"
//                 >
//                   <ArrowUpRight size={14} strokeWidth={3} /> Execute Export
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HRGovernanceDashboard;
//******************************************************************************************************* */
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
//   Loader2,
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
//   BellRing
// } from "lucide-react";
// import { dashboardService } from "../../services/dashboard.service";
// import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { departmentService } from "../../services/department.service";

// function useDebounce(value, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);

//   React.useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debounced;
// }

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState("candidates"); // candidates | employees | followups
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
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [exportFilters, setExportFilters] = useState({
//     start_date: "",
//     end_date: "",
//     status: "",
//     department: "",
//   });

//   // --- DUMMY DATA FOR FOLLOW UPS ---
//   const dummyFollowUps = useMemo(() => [
//     { id: 1, name: "Amit Patel", role: "Frontend Developer", type: "Document Submission", dueDate: "2026-03-12", priority: "High", status: "pending" },
//     { id: 2, name: "Sarah Jenkins", role: "Product Manager", type: "Offer Letter Signing", dueDate: "2026-03-10", priority: "Critical", status: "overdue" },
//     { id: 3, name: "Rahul Sharma", role: "DevOps Engineer", type: "Background Check", dueDate: "2026-03-15", priority: "Medium", status: "in_progress" },
//     { id: 4, name: "Priya Desai", role: "UI/UX Designer", type: "First Day Orientation", dueDate: "2026-03-11", priority: "Low", status: "completed" },
//   ], []);

//   const handleExportExcel = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (exportFilters.start_date) params.append("start_date", exportFilters.start_date);
//       if (exportFilters.end_date) params.append("end_date", exportFilters.end_date);
//       if (exportFilters.status) params.append("status", exportFilters.status);
//       if (exportFilters.department) params.append("department", exportFilters.department);

//       const url = `https://apihrr.goelectronix.co.in/interviews/export?${params.toString()}`;
//       window.open(url, "_blank");

//       toast.success("Excel generation protocol initiated");
//       setExportModalOpen(false);
//     } catch (err) {
//       toast.error("Failed to generate export manifest");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedSearch = useDebounce(searchText, 1000);

//   useEffect(() => {
//     if (activeTab === "candidates") {
//       fetchDashboardStats();
//     } else if (activeTab === "employees") {
//       fetchEmployeeStats();
//     }
//     // Follow ups uses dummy data, no API call needed here currently
//   }, [timeRange, debouncedSearch, statusFilter, activeTab]);

//   const buildFilters = (extra = {}) => {
//     const filters = {};
//     if (extra.type) filters.type = extra.type;
//     if (timeRange && timeRange !== "All") filters.range = timeRange;
//     if (debouncedSearch) filters.search = debouncedSearch;
//     if (statusFilter !== "All") filters.status = statusFilter.toLowerCase();
//     if (extra.location) filters.location = extra.location;
//     return filters;
//   };

//   useEffect(() => {
//     if (!exportModalOpen) return;
//     const fetchDepts = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load departments", err);
//         setDepartments([]);
//       }
//     };
//     fetchDepts();
//   }, [exportModalOpen]);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const start = Date.now();
//       const filters = buildFilters();
//       const data = await dashboardService.getCandidateStats(filters);
//       const elapsed = Date.now() - start;
//       if (elapsed < 400) {
//         await new Promise((r) => setTimeout(r, 400 - elapsed));
//       }
//       setApiStats(data);
//     } catch (err) {
//       console.error(err);
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
//           status: round.status,
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
//         status: emp.joining_attendance_status,
//         docStatus: emp.doc_submission_status,
//         date: emp.joining_date,
//       });
//     });
//     return map;
//   }, [apiStats, activeTab]);

//   const stats = {
//     candidates: [
//       { id: "total", label: "Total Candidates", type: "all", val: apiStats?.total_candidates ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "interviewing", label: "Interviewing", type: "interviewing", val: apiStats?.status_distribution?.find((s) => s.label === "interviewing")?.count ?? 0, icon: <Video size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
//       { id: "migrated", label: "Migrated", type: "migrated", val: apiStats?.status_distribution?.find((s) => s.label === "migrated")?.count ?? 0, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//       { id: "manual", label: "Manual Entry", type: "manual", val: apiStats?.entry_method_distribution?.find((s) => s.label === "manual")?.count ?? 0, icon: <Database size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//     ],
//     employees: [
//       { id: "total_employees", label: "Total Employees", type: "all", val: apiStats?.total_employees ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "active_employees", label: "Active Employees", type: "confirmed", val: apiStats?.active_employees ?? 0, icon: <ShieldCheck size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//       { id: "on_probation", label: "On Probation", type: "on_probation", val: apiStats?.status_distribution?.find((s) => s.label === "on_probation")?.count ?? 0, icon: <ShieldAlert size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//       { id: "departments", label: "Departments", type: "department", val: apiStats?.department_distribution?.length ?? 0, icon: <Landmark size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
//     ],
//     followups: [
//       { id: "total_followups", label: "Total Follow-ups", type: "all", val: 24, icon: <Timer size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "pending_followups", label: "Pending Actions", type: "pending", val: 12, icon: <Clock size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//       { id: "overdue_followups", label: "Overdue", type: "overdue", val: 3, icon: <ShieldAlert size={20} />, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
//       { id: "completed_followups", label: "Completed", type: "completed", val: 9, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         const matchSearch = !debouncedSearch || item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
//         const matchStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
//         const lastInterview = item.interviews?.[item.interviews.length - 1];
//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision;
//         }
//         const matchDecision = decisionFilter === "All" || decision === decisionFilter;
//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];
//         const score = lastInterview?.review?.total_score ? Math.round(lastInterview.review.total_score * 10) : null;
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
//           date: new Date(item.updated_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
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
//         emp.department_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
//       );
//     });
//   }, [apiStats, debouncedSearch]);

//   const filteredFollowUps = useMemo(() => {
//     if (!debouncedSearch) return dummyFollowUps;
//     return dummyFollowUps.filter((f) => 
//       f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//       f.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//       f.role.toLowerCase().includes(debouncedSearch.toLowerCase())
//     );
//   }, [dummyFollowUps, debouncedSearch]);

//   const interviewStatusMeta = {
//     completed: { color: "bg-emerald-500", text: "Completed" },
//     scheduled: { color: "bg-amber-500", text: "Scheduled" },
//     cancelled: { color: "bg-rose-500", text: "Cancelled" },
//     pending: { color: "bg-blue-500", text: "Pending" },
//   };

//   const employeeStatusMeta = {
//     joined: { color: "bg-emerald-500", text: "Joined" },
//     pending: { color: "bg-amber-500", text: "Pending" },
//     no_show: { color: "bg-rose-500", text: "No Show" },
//   };

//   const GlobalTerminalLoader = () => (
//     <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-8">
//         <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
//         <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
//         <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//           <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-3 text-center">
//         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
//             System Data Processing
//         </h3>
//         <div className="flex flex-col items-center gap-1">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//             Connecting to Governance Node...
//           </p>
//           <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
//             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
//           </div>
//         </div>
//       </div>
//       <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
//         <div className="flex items-center gap-1.5">
//           <Lock size={10} />
//           <span className="text-[9px] font-black uppercase tracking-tighter">Encrypted Handshake</span>
//         </div>
//         <div className="w-1 h-1 bg-slate-200 rounded-full" />
//         <div className="text-[9px] font-black uppercase tracking-tighter">ISO 27001 Verified</div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {loading && <GlobalTerminalLoader />}

//       <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans antialiased text-slate-900">
//         {/* --- HEADER --- */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <span className="px-2 py-0.5 bg-white text-blue-500 border border-blue-500 rounded text-[9px] font-black tracking-[0.2em] uppercase shadow-sm shadow-slate-200">
//                 Smart HRMS
//               </span>
//               <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//                 <Lock size={10} /> Dashboard
//               </div>
//             </div>
//             <h1 className="text-2xl font-black !tracking-[0.10em] text-slate-800">
//               {activeTab === "candidates" ? "Candidate Dashboard" : activeTab === "employees" ? "Employee Dashboard" : "Follow-Up Terminal"}
//             </h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setExportModalOpen(true)}
//               className="group flex items-center gap-3 px-6 py-3 !bg-white border !border-slate-200 rounded-xl shadow-sm hover:!border-blue-500 hover:!shadow-emerald-50 transition-all active:scale-95"
//             >
//               <FileText size={16} className="text-blue-600 group-hover:animate-bounce" />
//               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-700">
//                 Export Data
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* --- TRACK SWITCHER & ACTION BUTTONS --- */}
//         <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
//           <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
//             {[
//               { id: "candidates", label: "Candidates", icon: <UserPlus size={14} strokeWidth={2.5} /> },
//               { id: "employees", label: "Employees", icon: <Briefcase size={14} strokeWidth={2.5} /> },
//               { id: "followups", label: "Follow Ups", icon: <Timer size={14} strokeWidth={2.5} /> },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setActiveView("dashboard");
//                 }}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl !bg-transparent text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? "!bg-blue-50 !text-blue-600 shadow-sm border !border-blue-500"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-slate-50"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div>
//             {activeTab === "candidates" ? (
//               <button
//                  onClick={() => navigate("/candidate", { state: { modal: true } })}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white border border-blue-500 transition-all active:scale-95 whitespace-nowrap"
//               >
//                 <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Add Candidate</span>
//               </button>
//             ) : activeTab === "employees" ? (
//               <button
//                 onClick={() => navigate("/newemployeesalary")}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white transition-all active:scale-95 whitespace-nowrap"
//               >
//                 <Zap size={16} strokeWidth={2.5} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Onboard Employee</span>
//               </button>
//             ) : (
//               <button
//                     onClick={() => navigate("/candidatefilter")}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-amber-600 rounded-xl border border-amber-500 shadow-md shadow-amber-100 hover:!bg-amber-50 transition-all active:scale-95 whitespace-nowrap"
//               >
//                 <BellRing size={16} strokeWidth={2.5} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">New Follow Up</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {activeView === "dashboard" ? (
//           <div className="grid grid-cols-12 gap-8">
//             {/* --- KPI CARDS --- */}
//             <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//                 {stats[activeTab].map((stat) => (
//                   <div
//                     key={stat.id}
//                     onClick={() => {
//                       if (activeTab === "candidates") {
//                         navigate(`/dashboard/candidate-table?type=${stat.type}`);
//                       } else if (activeTab === "employees") {
//                         navigate(`/dashboard/employee-table?type=${stat.type}`);
//                       }
//                     }}
//                     className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all group relative overflow-hidden"
//                   >
//                     {/* Background Decorative Icon */}
//                     <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:text-blue-900 transition-colors pointer-events-none">
//                         {React.cloneElement(stat.icon, { size: 100 })}
//                     </div>

//                     <div className={`${stat.bg} border ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
//                       {stat.icon}
//                     </div>
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">
//                       {stat.label}
//                     </p>
//                     <h2 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 group-hover:text-blue-600 transition-colors">
//                       {stat.val}
//                     </h2>
//                   </div>
//                 ))}
//             </div>

//             {/* --- LEFT: MAIN LIST LOGIC --- */}
//             <div className="col-span-12 xl:col-span-8 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
//                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
//                   {activeTab === "candidates" ? "Interview Review Matrix" : activeTab === "employees" ? "Employee Overview Hub" : "Active Follow-Up Tracker"}
//                 </h3>

//                 {/* --- SEARCH & FILTER BAR --- */}
//                 <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
//                   <div className="relative flex-1 min-w-[250px] group">
//                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                     <input
//                       type="text"
//                       placeholder="Search records by name, email or ID..."
//                       value={searchText}
//                       onChange={(e) => setSearchText(e.target.value)}
//                       className="w-full h-11 pl-11 pr-4 text-[11px] font-bold bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium shadow-inner"
//                     />
//                   </div>

//                   {activeTab === "candidates" && (
//                     <div className="relative min-w-[180px]">
//                       <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                       <select
//                         value={decisionFilter}
//                         onChange={(e) => setDecisionFilter(e.target.value)}
//                         className="appearance-none w-full h-11 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest bg-white rounded-xl border border-slate-200 focus:border-blue-600 outline-none cursor-pointer transition-all shadow-inner text-slate-600"
//                       >
//                         <option value="All">All Decisions</option>
//                         <option value="strong_pass">Strong Pass</option>
//                         <option value="pass">Pass</option>
//                         <option value="reject">Reject</option>
//                         <option value="in_progress">In Progress</option>
//                       </select>
//                       <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   )}

//                   {(searchText || (activeTab === "candidates" && decisionFilter !== "All")) && (
//                     <button
//                       onClick={() => { setSearchText(""); setDecisionFilter("All"); }}
//                       className="h-11 px-5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
//                     >
//                       <X size={12} strokeWidth={3} /> Clear
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {/* ================= CANDIDATE LIST ================= */}
//                   {activeTab === "candidates" && (
//                     <>
//                       {filteredInterviewReviews.map((review) => {
//                         const fullCandidate = interviewReviews.find((c) => c.id === review.id);
//                         return (
//                           <div
//                             key={review.id}
//                             onClick={() => setSelectedCandidate(fullCandidate)}
//                             className="group relative flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer overflow-hidden"
//                           >
//                             <User className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 group-hover:text-blue-50 transition-colors pointer-events-none" size={100} />
                            
//                             <div className="flex items-center gap-5 relative z-10">
//                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${
//                                   review.status === "Reject" ? "bg-rose-50 border-rose-100 text-rose-600"
//                                   : review.status === "Strong Pass" ? "bg-emerald-50 border-emerald-100 text-emerald-600"
//                                   : "bg-blue-50 border-blue-100 text-blue-600"
//                                 }`}
//                               >
//                                 {review.status === "Reject" ? <ThumbsDown size={20} /> : <ThumbsUp size={20} />}
//                               </div>

//                               <div>
//                                 <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                                   {review.name}
//                                 </h4>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
//                                       review.status === "Reject" ? "bg-rose-50 text-rose-700 border-rose-100"
//                                       : review.status === "Strong Pass" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                                       : "bg-blue-50 text-blue-700 border-blue-100"
//                                     }`}
//                                   >
//                                     {review.status}
//                                   </span>
//                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                                     <Clock size={10}/> {review.date}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {(review.status === "Pass" || review.status === "Strong Pass") && (
//                               <div className="flex items-center gap-6 relative z-10">
//                                 <div className="hidden md:flex flex-col items-end">
//                                   <div className="flex gap-0.5 mb-1">
//                                     {[...Array(5)].map((_, i) => (
//                                       <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"} />
//                                     ))}
//                                   </div>
//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating Match</p>
//                                 </div>

//                                 <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-center shadow-inner group-hover:bg-white group-hover:border-blue-100 transition-colors">
//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</p>
//                                   <p className="text-lg font-black text-blue-600 leading-none">
//                                     {review.score ?? 0}<span className="text-[10px] text-slate-300 font-bold">/100</span>
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {review.status === "Reject" && (
//                               <div className="relative z-10 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-inner">
//                                 Profile Archived
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </>
//                   )}

//                   {/* ================= EMPLOYEE LIST ================= */}
//                   {activeTab === "employees" &&
//                     filteredEmployees.map((emp) => (
//                       <div key={emp.id} className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden">
//                         <Briefcase className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-blue-50 transition-colors pointer-events-none" size={120} />
                        
//                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : emp.status === 'on_probation' ? 'bg-amber-500' : 'bg-slate-300'}`} />

//                         <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
//                           <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
//                             {emp.full_name?.charAt(0)}
//                           </div>
                          
//                           <div className="space-y-1">
//                             <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                               {emp.full_name}
//                             </h4>
//                             <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                               <span className="flex items-center gap-1 text-slate-600"><Briefcase size={10} className="text-blue-500"/> {emp.role || "TBD"}</span>
//                               <span className="w-1 h-1 rounded-full bg-slate-200" />
//                               <span className="flex items-center gap-1"><Landmark size={10} className="text-slate-400"/> {emp.department_name || "Unassigned"}</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
//                            <div className="flex flex-col items-start md:items-end gap-1">
//                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Joined</span>
//                              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
//                                <Clock size={10} className="text-slate-400"/> 
//                                {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
//                              </span>
//                            </div>

//                            <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
//                               emp.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                               : emp.status === "on_probation" ? "bg-amber-50 text-amber-700 border-amber-100"
//                               : "bg-slate-50 text-slate-600 border-slate-200"
//                             }`}>
//                             {emp.status?.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                       </div>
//                     ))}

//                   {/* ================= FOLLOW UP LIST (DUMMY) ================= */}
//                   {activeTab === "followups" &&
//                     filteredFollowUps.map((follow) => (
//                       <div key={follow.id} className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all overflow-hidden cursor-pointer">
//                         <Timer className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-amber-50 transition-colors pointer-events-none" size={120} />
                        
//                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${follow.status === 'completed' ? 'bg-emerald-500' : follow.status === 'overdue' ? 'bg-rose-500' : 'bg-amber-500'}`} />

//                         <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
//                           <div className={`w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner transition-colors ${
//                               follow.status === 'overdue' ? 'text-rose-600 group-hover:bg-rose-600 group-hover:text-white' 
//                               : follow.status === 'completed' ? 'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
//                               : 'text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
//                             }`}>
//                             {follow.status === 'overdue' ? <ShieldAlert size={20} /> : follow.status === 'completed' ? <CheckCircle2 size={20} /> : <Timer size={20} />}
//                           </div>
                          
//                           <div className="space-y-1">
//                             <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
//                               {follow.name}
//                             </h4>
//                             <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                               <span className="flex items-center gap-1 text-slate-600"><FileText size={10} className="text-amber-500"/> {follow.type}</span>
//                               <span className="w-1 h-1 rounded-full bg-slate-200" />
//                               <span className="flex items-center gap-1"><User size={10} className="text-slate-400"/> {follow.role}</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
//                            <div className="flex flex-col items-start md:items-end gap-1">
//                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
//                              <span className={`text-[10px] font-bold flex items-center gap-1 ${follow.status === 'overdue' ? 'text-rose-600' : 'text-slate-600'}`}>
//                                <Clock size={10} className={follow.status === 'overdue' ? 'text-rose-500' : 'text-slate-400'}/> 
//                                {new Date(follow.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
//                              </span>
//                            </div>

//                            <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
//                               follow.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                               : follow.status === "overdue" ? "bg-rose-50 text-rose-700 border-rose-100"
//                               : "bg-amber-50 text-amber-700 border-amber-100"
//                             }`}>
//                             {follow.status?.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>

//             {/* --- RIGHT: CALENDAR PANEL --- */}
//             <div className="col-span-12 xl:col-span-4 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <div className="flex items-center justify-between mb-6">
//                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Scheduling Matrix
//                    </h4>
//                 </div>

//                 <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-4 shadow-inner mb-8">
//                   <Calendar
//                     value={calendarDate}
//                     onChange={setCalendarDate}
//                     tileContent={({ date, view }) => {
//                       if (view !== "month") return null;
//                       const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                       const interviewList = interviewDateMap[d];
//                       const employeeList = employeeJoinDateMap[d];
//                       if (!interviewList && !employeeList) return null;

//                       return (
//                         <div className="flex justify-center mt-1 gap-1 flex-wrap">
//                           {interviewList?.slice(0, 2).map((item, i) => (
//                             <span key={`i-${i}`} className={`w-1.5 h-1.5 rounded-full ${interviewStatusMeta[item.status]?.color || "bg-slate-400"}`} />
//                           ))}
//                           {employeeList?.slice(0, 2).map((emp, i) => (
//                             <span key={`e-${i}`} className={`w-1.5 h-1.5 rounded-full ${employeeStatusMeta[emp.status]?.color || "bg-blue-400"}`} />
//                           ))}
//                         </div>
//                       );
//                     }}
//                   />
//                 </div>

//                 {/* Selected Day Feed */}
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                       Day Itinerary
//                     </span>
//                     <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest shadow-sm">
//                       {calendarDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year:"numeric" })}
//                     </span>
//                   </div>

//                   <div className="max-h-72 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
//                     {(() => {
//                       const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
//                       const interviewList = interviewDateMap[d] ?? [];
//                       const employeeList = employeeJoinDateMap[d] ?? [];

//                       if (interviewList.length === 0 && employeeList.length === 0)
//                         return (
//                           <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
//                             <Clock size={20} className="text-slate-300 mb-3" />
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                               No Tactical Events Found
//                             </p>
//                           </div>
//                         );

//                       return (
//                         <div className="space-y-4">
//                           {/* INTERVIEWS */}
//                           {interviewList.map((item, i) => (
//                             <div key={`int-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
//                                     {item.name}
//                                   </span>
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assessment</span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">R{item.round}</span>
//                                   </div>
//                                 </div>
//                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
//                                     item.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                     : item.status === "scheduled" ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : item.status === "cancelled" ? "bg-rose-50 text-rose-600 border-rose-100"
//                                     : "bg-slate-50 text-slate-500 border-slate-200"
//                                   }`}>
//                                   {item.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}

//                           {/* EMPLOYEES */}
//                           {employeeList.map((emp, i) => (
//                             <div key={`emp-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
//                                     {emp.name}
//                                   </span>
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Joining</span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{emp.role}</span>
//                                   </div>
//                                 </div>
//                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
//                                     emp.status === "joined" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                     : emp.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : emp.status === "no_show" ? "bg-rose-50 text-rose-600 border-rose-100"
//                                     : "bg-slate-50 text-slate-500 border-slate-200"
//                                   }`}>
//                                   {emp.status === "joined" ? "Joined" : emp.status === "pending" ? "Pending" : emp.status === "no_show" ? "No Show" : emp.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* --- DETAIL PAGE --- */
//           <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 rounded-t-[3rem]">
//               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">{selectedCategory} Register</h3>
//               <button
//                 onClick={() => setActiveView("dashboard")}
//                 className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 flex items-center gap-2"
//               >
//                 <ChevronLeft size={14}/> Dashboard
//               </button>
//             </div>
//             <div className="p-10 min-h-[400px]">
//                {/* Placeholder for detail grid */}
//                <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:shadow-blue-50">
//                   <div>
//                     <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                       Aadhaar: Verified | eSign: Pending | Interview: Online
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
//                       Attended
//                     </span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
//                       Doc Uploaded
//                     </span>
//                   </div>
//                 </div>
//             </div>
//           </div>
//         )}

//         {/* ================= MODAL: CANDIDATE DETAIL ================= */}
//         {selectedCandidate && (
//           <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
              
//               {/* MODAL HEADER */}
//               <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
//                 <div className="flex gap-6 items-center">
//                   <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100 flex-shrink-0">
//                     <User size={28} strokeWidth={2.5}/>
//                   </div>
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-3">
//                       <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
//                         {selectedCandidate.full_name}
//                       </h2>
//                       <span className="px-3 py-1 bg-white text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 shadow-sm">
//                         {selectedCandidate.position || "Unassigned Role"}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-4">
//                       <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
//                         <Mail size={12} className="text-slate-400" /> {selectedCandidate.email}
//                       </p>
//                       <div className="w-1 h-1 rounded-full bg-slate-300" />
//                       <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
//                         <Phone size={12} className="text-slate-400" /> {selectedCandidate.phone || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-95"
//                 >
//                   <X size={18} strokeWidth={2.5} />
//                 </button>
//               </div>

//               {/* MODAL BODY */}
//               <div className="px-10 py-8 space-y-12 overflow-y-auto custom-scrollbar flex-1 relative">
//                 <ShieldCheck className="absolute -right-12 -bottom-12 text-slate-50 opacity-40 pointer-events-none z-0" size={300} />
                
//                 {/* DATA MATRIX */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 relative z-10">
//                   {[
//                     { label: "System Status", value: selectedCandidate.status, icon: Activity, color: "text-emerald-500" },
//                     { label: "Seniority/Exp", value: selectedCandidate.experience || "N/A", icon: Layers, color: "text-blue-500" },
//                     { label: "Current Location", value: selectedCandidate.location || "Remote", icon: MapPin, color: "text-rose-500" },
//                     { label: "Ingestion Node", value: selectedCandidate.entry_method, icon: ArrowUpRight, color: "text-amber-500" },
//                     { label: "Record Created", value: selectedCandidate.created_at ? new Date(selectedCandidate.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-", icon: Clock, color: "text-slate-400" },
//                   ].map((item, idx) => (
//                     <div key={idx} className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                         {item.icon && <item.icon size={12} className={item.color} />}
//                         {item.label}
//                       </p>
//                       <p className="text-[13px] font-bold text-slate-800 capitalize pl-5">
//                         {item.value}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <hr className="border-slate-100 relative z-10" />

//                 {/* ASSESSMENT PIPELINE */}
//                 <div className="space-y-8 relative z-10">
//                   <div className="flex items-end justify-between border-b border-slate-100 pb-4">
//                     <div className="space-y-1">
//                       <h3 className="font-black text-blue-600 uppercase tracking-widest text-[10px] flex items-center gap-2">
//                         <ShieldCheck size={14} /> Assessment Ledger
//                       </h3>
//                       <p className="text-[11px] text-slate-400 font-bold">Technical evaluation and decision history log.</p>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Efficiency</span>
//                       <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">
//                         {selectedCandidate.interviews?.length || 0} Phases
//                       </span>
//                     </div>
//                   </div>

//                   {!selectedCandidate.interviews || selectedCandidate.interviews.length === 0 ? (
//                     <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
//                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
//                         <Activity size={20} />
//                       </div>
//                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">No Assessment Data</p>
//                     </div>
//                   ) : (
//                     <div className="relative pl-2 md:pl-6">
//                       <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block" />

//                       <div className="space-y-10">
//                         {selectedCandidate.interviews.map((round) => (
//                           <div key={round.id} className="relative pl-0 md:pl-12 group transition-all">
//                             <div className="absolute -left-2 top-0 hidden md:flex w-8 h-8 rounded-xl bg-white border-2 border-slate-200 items-center justify-center z-10 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors shadow-sm">
//                               <span className="text-[10px] font-black">{round.round_number}</span>
//                             </div>

//                             <div className="flex flex-col gap-4">
//                               <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
//                                 <div>
//                                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">
//                                     Phase {round.round_number}: {round.mode} Assessment
//                                   </h4>
//                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
//                                     <Clock size={10}/> {new Date(round.interview_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                                   </p>
//                                 </div>
//                                 <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border bg-white shadow-sm ${
//                                     round.status === "completed" ? "text-emerald-600 border-emerald-200" : "text-slate-500 border-slate-200"
//                                   }`}>
//                                   {round.status}
//                                 </span>
//                               </div>

//                               {round.review ? (
//                                 <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
//                                   <div className="grid md:grid-cols-12">
//                                     <div className="md:col-span-4 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between gap-6">
//                                       <div>
//                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Verdict</span>
//                                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${
//                                             ["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase())
//                                               ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                                               : "bg-rose-50 text-rose-700 border-rose-100"
//                                           }`}>
//                                           {["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase()) ? <ShieldCheck size={14}/> : <Activity size={14}/>}
//                                           {round.review.decision}
//                                         </div>
//                                       </div>
//                                       <div>
//                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Performance</span>
//                                         <div className="flex items-baseline gap-1">
//                                           <span className="text-3xl font-black text-slate-800 tracking-tighter">
//                                             {round.review.total_score ? Math.round(round.review.total_score * 10) : 0}
//                                           </span>
//                                           <span className="text-slate-400 font-bold text-xs">/100</span>
//                                         </div>
//                                       </div>
//                                     </div>

//                                     <div className="md:col-span-8 p-6 space-y-6">
//                                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
//                                         {[
//                                           { l: "Technical", v: round.review.technical_skill },
//                                           { l: "Comm.", v: round.review.communication },
//                                           { l: "Logic", v: round.review.problem_solving },
//                                           { l: "Domain", v: round.review.relevant_experience },
//                                         ].map((stat, i) => (
//                                           <div key={i} className="space-y-1.5">
//                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</p>
//                                             <div className="flex items-center gap-2">
//                                               <div className="flex gap-0.5">
//                                                 {[...Array(5)].map((_, star) => (
//                                                   <div key={star} className={`w-1 h-2 rounded-full ${star < (stat.v/2) ? "bg-blue-500" : "bg-slate-200"}`} />
//                                                 ))}
//                                               </div>
//                                               <span className="text-[10px] font-black text-slate-600">{stat.v}/10</span>
//                                             </div>
//                                           </div>
//                                         ))}
//                                       </div>

//                                       {round.review.remarks && (
//                                         <div className="pt-4 border-t border-slate-100">
//                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Reviewer Remarks</p>
//                                           <p className="text-[11px] text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
//                                             "{round.review.remarks}"
//                                           </p>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] p-6 flex items-center justify-center gap-4">
//                                   <Loader2 size={16} className="text-blue-500 animate-spin" />
//                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Analytical Input...</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* MODAL FOOTER */}
//               <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
//                 >
//                   Close Matrix
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= EXCEL EXPORT MODAL ================= */}
//         {exportModalOpen && (
//           <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
//               <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
//                   <Database size={20} strokeWidth={2.5}/>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Data Export</h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure registry extraction parameters</p>
//                 </div>
//               </div>

//               <div className="p-8 space-y-6">
//                 <div className="grid grid-cols-2 gap-5">
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
//                     <input
//                       type="date"
//                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
//                       value={exportFilters.start_date}
//                       onChange={(e) => setExportFilters({ ...exportFilters, start_date: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
//                     <input
//                       type="date"
//                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
//                       value={exportFilters.end_date}
//                       onChange={(e) => setExportFilters({ ...exportFilters, end_date: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Status</label>
//                   <div className="relative">
//                     <select
//                       className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
//                       value={exportFilters.status}
//                       onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
//                     >
//                       <option value="">All Statuses</option>
//                       <option value="scheduled">Scheduled</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                     <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Node</label>
//                   <div className="relative">
//                     <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <select
//                       value={exportFilters.department}
//                       onChange={(e) => setExportFilters({ ...exportFilters, department: e.target.value })}
//                       className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
//                     >
//                       <option value="">Select Organizational Unit</option>
//                       {departments.map((dept) => (
//                         <option key={dept.id} value={dept.name}>{dept.name} ({dept.code || "N/A"})</option>
//                       ))}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//               </div>

//               <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
//                 <button
//                   onClick={() => setExportModalOpen(false)}
//                   className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleExportExcel}
//                   className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
//                 >
//                   <ArrowUpRight size={14} strokeWidth={3} /> Execute Export
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HRGovernanceDashboard;
//************************************************working code phase 2 11/03/26************************************************************* */
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
// import { departmentService } from "../../services/department.service";

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
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [exportFilters, setExportFilters] = useState({
//     start_date: "",
//     end_date: "",
//     status: "",
//     department: "",
//   });

//   const handleExportExcel = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (exportFilters.start_date) params.append("start_date", exportFilters.start_date);
//       if (exportFilters.end_date) params.append("end_date", exportFilters.end_date);
//       if (exportFilters.status) params.append("status", exportFilters.status);
//       if (exportFilters.department) params.append("department", exportFilters.department);

//       const url = `https://apihrr.goelectronix.co.in/interviews/export?${params.toString()}`;
//       window.open(url, "_blank");

//       toast.success("Excel generation protocol initiated");
//       setExportModalOpen(false);
//     } catch (err) {
//       toast.error("Failed to generate export manifest");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//     if (timeRange && timeRange !== "All") filters.range = timeRange;
//     if (debouncedSearch) filters.search = debouncedSearch;
//     if (statusFilter !== "All") filters.status = statusFilter.toLowerCase();
//     if (extra.location) filters.location = extra.location;
//     return filters;
//   };

//   useEffect(() => {
//     if (!exportModalOpen) return;
//     const fetchDepts = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load departments", err);
//         setDepartments([]);
//       }
//     };
//     fetchDepts();
//   }, [exportModalOpen]);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const start = Date.now();
//       const filters = buildFilters();
//       const data = await dashboardService.getCandidateStats(filters);
//       const elapsed = Date.now() - start;
//       if (elapsed < 400) {
//         await new Promise((r) => setTimeout(r, 400 - elapsed));
//       }
//       setApiStats(data);
//     } catch (err) {
//       console.error(err);
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
//           status: round.status,
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
//         status: emp.joining_attendance_status,
//         docStatus: emp.doc_submission_status,
//         date: emp.joining_date,
//       });
//     });
//     return map;
//   }, [apiStats, activeTab]);

//   const stats = {
//     candidates: [
//       { id: "total", label: "Total Candidates", type: "all", val: apiStats?.total_candidates ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "interviewing", label: "Interviewing", type: "interviewing", val: apiStats?.status_distribution?.find((s) => s.label === "interviewing")?.count ?? 0, icon: <Video size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
//       { id: "migrated", label: "Migrated", type: "migrated", val: apiStats?.status_distribution?.find((s) => s.label === "migrated")?.count ?? 0, icon: <CheckCircle2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//       { id: "manual", label: "Manual Entry", type: "manual", val: apiStats?.entry_method_distribution?.find((s) => s.label === "manual")?.count ?? 0, icon: <Database size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//     ],
//     employees: [
//       { id: "total_employees", label: "Total Employees", type: "all", val: apiStats?.total_employees ?? 0, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
//       { id: "active_employees", label: "Active Employees", type: "confirmed", val: apiStats?.active_employees ?? 0, icon: <ShieldCheck size={20} />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
//       { id: "on_probation", label: "On Probation", type: "on_probation", val: apiStats?.status_distribution?.find((s) => s.label === "on_probation")?.count ?? 0, icon: <ShieldAlert size={20} />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
//       { id: "departments", label: "Departments", type: "department", val: apiStats?.department_distribution?.length ?? 0, icon: <Landmark size={20} />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
//     ],
//   };

//   const filteredInterviewReviews = useMemo(() => {
//     return interviewReviews
//       .filter((item) => {
//         const matchSearch = !debouncedSearch || item.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
//         const matchStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
//         const lastInterview = item.interviews?.[item.interviews.length - 1];
//         let decision = "in_progress";
//         if (lastInterview?.review?.decision) {
//           decision = lastInterview.review.decision;
//         }
//         const matchDecision = decisionFilter === "All" || decision === decisionFilter;
//         return matchSearch && matchStatus && matchDecision;
//       })
//       .map((item) => {
//         const lastInterview = item.interviews?.[item.interviews.length - 1];
//         const score = lastInterview?.review?.total_score ? Math.round(lastInterview.review.total_score * 10) : null;
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
//           date: new Date(item.updated_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
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
//         emp.department_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
//       );
//     });
//   }, [apiStats, debouncedSearch]);

//   const interviewStatusMeta = {
//     completed: { color: "bg-emerald-500", text: "Completed" },
//     scheduled: { color: "bg-amber-500", text: "Scheduled" },
//     cancelled: { color: "bg-rose-500", text: "Cancelled" },
//     pending: { color: "bg-blue-500", text: "Pending" },
//   };

//   const employeeStatusMeta = {
//     joined: { color: "bg-emerald-500", text: "Joined" },
//     pending: { color: "bg-amber-500", text: "Pending" },
//     no_show: { color: "bg-rose-500", text: "No Show" },
//   };

//   const GlobalTerminalLoader = () => (
//     <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-8">
//         <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
//         <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
//         <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//           <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-3 text-center">
//         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
//             System Data Processing
//         </h3>
//         <div className="flex flex-col items-center gap-1">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//             Connecting to Governance Node...
//           </p>
//           <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
//             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
//           </div>
//         </div>
//       </div>
//       <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
//         <div className="flex items-center gap-1.5">
//           <Lock size={10} />
//           <span className="text-[9px] font-black uppercase tracking-tighter">Encrypted Handshake</span>
//         </div>
//         <div className="w-1 h-1 bg-slate-200 rounded-full" />
//         <div className="text-[9px] font-black uppercase tracking-tighter">ISO 27001 Verified</div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {loading && <GlobalTerminalLoader />}

//       <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans antialiased text-slate-900">
//         {/* --- HEADER --- */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <span className="px-2 py-0.5 bg-white text-blue-500 border border-blue-500 rounded text-[9px] font-black tracking-[0.2em] uppercase shadow-sm shadow-slate-200">
//                 Smart HRMS
//               </span>
//               <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//                 <Lock size={10} /> Dashboard
//               </div>
//             </div>
//            <h1 className="text-2xl font-black !tracking-[0.10em] text-slate-800">
//   {activeTab === "candidates" ? "Candidate Dashboard" : "Employee Dashboard"}
// </h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setExportModalOpen(true)}
//               className="group flex items-center gap-3 px-6 py-3 !bg-white border !border-slate-200 rounded-xl shadow-sm hover:!border-blue-500 hover:!shadow-emerald-50 transition-all active:scale-95"
//             >
//               <FileText size={16} className="text-blue-600 group-hover:animate-bounce" />
//               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-700">
//                 Export Data
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* --- TRACK SWITCHER & ACTION BUTTONS --- */}
//         <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
//           <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
//             {[
//               { id: "candidates", label: "Candidates", icon: <UserPlus size={14} strokeWidth={2.5} /> },
//               { id: "employees", label: "Employees", icon: <Briefcase size={14} strokeWidth={2.5} /> },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setActiveView("dashboard");
//                 }}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl !bg-transparent text-[10px] font-black uppercase tracking-widest transition-all ${
//                   activeTab === tab.id
//                     ? "!bg-blue-50 !text-blue-600 shadow-sm border !border-blue-500"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-slate-50"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div>
//             {activeTab === "candidates" ? (
//               <button
//                  onClick={() => navigate("/candidate", { state: { modal: true } })}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 rounded-xl shadow-md shadow-blue-200 hove!r:bg-white border border-blue-500 transition-all active:scale-95"
//               >
//                 <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Add Candidate</span>
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/dummyemp")}
//                 className="group flex items-center gap-3 px-6 py-3 !bg-white !text-blue-500 rounded-xl shadow-md shadow-blue-200 hover:!bg-white transition-all active:scale-95"
//               >
//                 <Zap size={16} strokeWidth={2.5} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Onboard Employee</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {activeView === "dashboard" ? (
//           <div className="grid grid-cols-12 gap-8">
//             {/* --- KPI CARDS --- */}
//             <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//                 {stats[activeTab].map((stat) => (
//                   <div
//                     key={stat.id}
//                     onClick={() => {
//                       if (activeTab === "candidates") {
//                         navigate(`/dashboard/candidate-table?type=${stat.type}`);
//                       } else {
//                         navigate(`/dashboard/employee-table?type=${stat.type}`);
//                       }
//                     }}
//                     className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all group relative overflow-hidden"
//                   >
//                     {/* Background Decorative Icon */}
//                     <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:text-blue-900 transition-colors pointer-events-none">
//                         {React.cloneElement(stat.icon, { size: 100 })}
//                     </div>

//                     <div className={`${stat.bg} border ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
//                       {stat.icon}
//                     </div>
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">
//                       {stat.label}
//                     </p>
//                     <h2 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 group-hover:text-blue-600 transition-colors">
//                       {stat.val}
//                     </h2>
//                   </div>
//                 ))}
//             </div>

//             {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//             <div className="col-span-12 xl:col-span-8 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
//                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
//                   {activeTab === "candidates" ? "Interview Review Matrix" : "Employee Overview Hub"}
//                 </h3>

//                 {/* --- SEARCH & FILTER BAR --- */}
//                 <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
//                   <div className="relative flex-1 min-w-[250px] group">
//                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//                     <input
//                       type="text"
//                       placeholder="Search records by name, email or ID..."
//                       value={searchText}
//                       onChange={(e) => setSearchText(e.target.value)}
//                       className="w-full h-11 pl-11 pr-4 text-[11px] font-bold bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium shadow-inner"
//                     />
//                   </div>

//                   {activeTab === "candidates" && (
//                     <div className="relative min-w-[180px]">
//                       <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                       <select
//                         value={decisionFilter}
//                         onChange={(e) => setDecisionFilter(e.target.value)}
//                         className="appearance-none w-full h-11 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest bg-white rounded-xl border border-slate-200 focus:border-blue-600 outline-none cursor-pointer transition-all shadow-inner text-slate-600"
//                       >
//                         <option value="All">All Decisions</option>
//                         <option value="strong_pass">Strong Pass</option>
//                         <option value="pass">Pass</option>
//                         <option value="reject">Reject</option>
//                         <option value="in_progress">In Progress</option>
//                       </select>
//                       <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   )}

//                   {(searchText || (activeTab === "candidates" && decisionFilter !== "All")) && (
//                     <button
//                       onClick={() => { setSearchText(""); setDecisionFilter("All"); }}
//                       className="h-11 px-5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
//                     >
//                       <X size={12} strokeWidth={3} /> Clear
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {/* ================= CANDIDATE LIST ================= */}
//                   {activeTab === "candidates" && (
//                     <>
//                       {filteredInterviewReviews.map((review) => {
//                         const fullCandidate = interviewReviews.find((c) => c.id === review.id);
//                         return (
//                           <div
//                             key={review.id}
//                             onClick={() => setSelectedCandidate(fullCandidate)}
//                             className="group relative flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer overflow-hidden"
//                           >
//                             <User className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 group-hover:text-blue-50 transition-colors pointer-events-none" size={100} />
                            
//                             <div className="flex items-center gap-5 relative z-10">
//                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${
//                                   review.status === "Reject" ? "bg-rose-50 border-rose-100 text-rose-600"
//                                   : review.status === "Strong Pass" ? "bg-emerald-50 border-emerald-100 text-emerald-600"
//                                   : "bg-blue-50 border-blue-100 text-blue-600"
//                                 }`}
//                               >
//                                 {review.status === "Reject" ? <ThumbsDown size={20} /> : <ThumbsUp size={20} />}
//                               </div>

//                               <div>
//                                 <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                                   {review.name}
//                                 </h4>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
//                                       review.status === "Reject" ? "bg-rose-50 text-rose-700 border-rose-100"
//                                       : review.status === "Strong Pass" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                                       : "bg-blue-50 text-blue-700 border-blue-100"
//                                     }`}
//                                   >
//                                     {review.status}
//                                   </span>
//                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
//                                     <Clock size={10}/> {review.date}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {(review.status === "Pass" || review.status === "Strong Pass") && (
//                               <div className="flex items-center gap-6 relative z-10">
//                                 <div className="hidden md:flex flex-col items-end">
//                                   <div className="flex gap-0.5 mb-1">
//                                     {[...Array(5)].map((_, i) => (
//                                       <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"} />
//                                     ))}
//                                   </div>
//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating Match</p>
//                                 </div>

//                                 <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-center shadow-inner group-hover:bg-white group-hover:border-blue-100 transition-colors">
//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</p>
//                                   <p className="text-lg font-black text-blue-600 leading-none">
//                                     {review.score ?? 0}<span className="text-[10px] text-slate-300 font-bold">/100</span>
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {review.status === "Reject" && (
//                               <div className="relative z-10 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-inner">
//                                 Profile Archived
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </>
//                   )}

//                   {/* ================= EMPLOYEE LIST (UPGRADED) ================= */}
//                   {activeTab === "employees" &&
//                     filteredEmployees.map((emp) => (
//                       <div key={emp.id} className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden">
//                         {/* Decorative Background Element */}
//                         <Briefcase className="absolute -right-6 -bottom-6 text-slate-50 opacity-60 group-hover:text-blue-50 transition-colors pointer-events-none" size={120} />
                        
//                         {/* Status Line */}
//                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : emp.status === 'on_probation' ? 'bg-amber-500' : 'bg-slate-300'}`} />

//                         <div className="flex items-center gap-5 flex-1 pl-2 relative z-10">
//                           {/* Avatar Box */}
//                           <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
//                             {emp.full_name?.charAt(0)}
//                           </div>
                          
//                           {/* Main Info */}
//                           <div className="space-y-1">
//                             <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                               {emp.full_name}
//                             </h4>
//                             <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                               <span className="flex items-center gap-1 text-slate-600"><Briefcase size={10} className="text-blue-500"/> {emp.role || "TBD"}</span>
//                               <span className="w-1 h-1 rounded-full bg-slate-200" />
//                               <span className="flex items-center gap-1"><Landmark size={10} className="text-slate-400"/> {emp.department_name || "Unassigned"}</span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Right Actions & Meta */}
//                         <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
//                            <div className="flex flex-col items-start md:items-end gap-1">
//                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Joined</span>
//                              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
//                                <Clock size={10} className="text-slate-400"/> 
//                                {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
//                              </span>
//                            </div>

//                            <span className={`px-3 py-1.5 text-[9px] rounded-xl font-black uppercase tracking-widest border shadow-sm ${
//                               emp.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                               : emp.status === "on_probation" ? "bg-amber-50 text-amber-700 border-amber-100"
//                               : "bg-slate-50 text-slate-600 border-slate-200"
//                             }`}>
//                             {emp.status?.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>

//             {/* --- RIGHT: CALENDAR PANEL --- */}
//             <div className="col-span-12 xl:col-span-4 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <div className="flex items-center justify-between mb-6">
//                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> Scheduling Matrix
//                    </h4>
//                 </div>

//                 <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-4 shadow-inner mb-8">
//                   <Calendar
//                     value={calendarDate}
//                     onChange={setCalendarDate}
//                     tileContent={({ date, view }) => {
//                       if (view !== "month") return null;
//                       const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//                       const interviewList = interviewDateMap[d];
//                       const employeeList = employeeJoinDateMap[d];
//                       if (!interviewList && !employeeList) return null;

//                       return (
//                         <div className="flex justify-center mt-1 gap-1 flex-wrap">
//                           {interviewList?.slice(0, 2).map((item, i) => (
//                             <span key={`i-${i}`} className={`w-1.5 h-1.5 rounded-full ${interviewStatusMeta[item.status]?.color || "bg-slate-400"}`} />
//                           ))}
//                           {employeeList?.slice(0, 2).map((emp, i) => (
//                             <span key={`e-${i}`} className={`w-1.5 h-1.5 rounded-full ${employeeStatusMeta[emp.status]?.color || "bg-blue-400"}`} />
//                           ))}
//                         </div>
//                       );
//                     }}
//                   />
//                 </div>

//                 {/* Selected Day Feed */}
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                       Day Itinerary
//                     </span>
//                     <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest shadow-sm">
//                       {calendarDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year:"numeric" })}
//                     </span>
//                   </div>

//                   <div className="max-h-72 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
//                     {(() => {
//                       const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
//                       const interviewList = interviewDateMap[d] ?? [];
//                       const employeeList = employeeJoinDateMap[d] ?? [];

//                       if (interviewList.length === 0 && employeeList.length === 0)
//                         return (
//                           <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
//                             <Clock size={20} className="text-slate-300 mb-3" />
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                               No Tactical Events Found
//                             </p>
//                           </div>
//                         );

//                       return (
//                         <div className="space-y-4">
//                           {/* INTERVIEWS */}
//                           {interviewList.map((item, i) => (
//                             <div key={`int-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
//                                     {item.name}
//                                   </span>
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assessment</span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">R{item.round}</span>
//                                   </div>
//                                 </div>
//                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
//                                     item.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                     : item.status === "scheduled" ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : item.status === "cancelled" ? "bg-rose-50 text-rose-600 border-rose-100"
//                                     : "bg-slate-50 text-slate-500 border-slate-200"
//                                   }`}>
//                                   {item.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}

//                           {/* EMPLOYEES */}
//                           {employeeList.map((emp, i) => (
//                             <div key={`emp-${i}`} className="group relative pl-6 py-2 transition-all hover:translate-x-1">
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                               <div className="flex items-center justify-between">
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
//                                     {emp.name}
//                                   </span>
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Joining</span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{emp.role}</span>
//                                   </div>
//                                 </div>
//                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
//                                     emp.status === "joined" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                     : emp.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : emp.status === "no_show" ? "bg-rose-50 text-rose-600 border-rose-100"
//                                     : "bg-slate-50 text-slate-500 border-slate-200"
//                                   }`}>
//                                   {emp.status === "joined" ? "Joined" : emp.status === "pending" ? "Pending" : emp.status === "no_show" ? "No Show" : emp.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* --- DETAIL PAGE --- */
//           <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 rounded-t-[3rem]">
//               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">{selectedCategory} Register</h3>
//               <button
//                 onClick={() => setActiveView("dashboard")}
//                 className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 flex items-center gap-2"
//               >
//                 <ChevronLeft size={14}/> Dashboard
//               </button>
//             </div>
//             <div className="p-10 min-h-[400px]">
//                {/* Placeholder for detail grid */}
//                <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:shadow-blue-50">
//                   <div>
//                     <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                       Aadhaar: Verified | eSign: Pending | Interview: Online
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
//                       Attended
//                     </span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
//                       Doc Uploaded
//                     </span>
//                   </div>
//                 </div>
//             </div>
//           </div>
//         )}

//         {/* ================= MODAL: CANDIDATE DETAIL ================= */}
//         {selectedCandidate && (
//           <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
              
//               {/* MODAL HEADER */}
//               <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
//                 <div className="flex gap-6 items-center">
//                   <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100 flex-shrink-0">
//                     <User size={28} strokeWidth={2.5}/>
//                   </div>
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-3">
//                       <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
//                         {selectedCandidate.full_name}
//                       </h2>
//                       <span className="px-3 py-1 bg-white text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 shadow-sm">
//                         {selectedCandidate.position || "Unassigned Role"}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-4">
//                       <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
//                         <Mail size={12} className="text-slate-400" /> {selectedCandidate.email}
//                       </p>
//                       <div className="w-1 h-1 rounded-full bg-slate-300" />
//                       <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
//                         <Phone size={12} className="text-slate-400" /> {selectedCandidate.phone || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-95"
//                 >
//                   <X size={18} strokeWidth={2.5} />
//                 </button>
//               </div>

//               {/* MODAL BODY */}
//               <div className="px-10 py-8 space-y-12 overflow-y-auto custom-scrollbar flex-1 relative">
//                 <ShieldCheck className="absolute -right-12 -bottom-12 text-slate-50 opacity-40 pointer-events-none z-0" size={300} />
                
//                 {/* DATA MATRIX */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 relative z-10">
//                   {[
//                     { label: "System Status", value: selectedCandidate.status, icon: Activity, color: "text-emerald-500" },
//                     { label: "Seniority/Exp", value: selectedCandidate.experience || "N/A", icon: Layers, color: "text-blue-500" },
//                     { label: "Current Location", value: selectedCandidate.location || "Remote", icon: MapPin, color: "text-rose-500" },
//                     { label: "Ingestion Node", value: selectedCandidate.entry_method, icon: ArrowUpRight, color: "text-amber-500" },
//                     { label: "Record Created", value: selectedCandidate.created_at ? new Date(selectedCandidate.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-", icon: Clock, color: "text-slate-400" },
//                   ].map((item, idx) => (
//                     <div key={idx} className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                         {item.icon && <item.icon size={12} className={item.color} />}
//                         {item.label}
//                       </p>
//                       <p className="text-[13px] font-bold text-slate-800 capitalize pl-5">
//                         {item.value}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <hr className="border-slate-100 relative z-10" />

//                 {/* ASSESSMENT PIPELINE */}
//                 <div className="space-y-8 relative z-10">
//                   <div className="flex items-end justify-between border-b border-slate-100 pb-4">
//                     <div className="space-y-1">
//                       <h3 className="font-black text-blue-600 uppercase tracking-widest text-[10px] flex items-center gap-2">
//                         <ShieldCheck size={14} /> Assessment Ledger
//                       </h3>
//                       <p className="text-[11px] text-slate-400 font-bold">Technical evaluation and decision history log.</p>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Efficiency</span>
//                       <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">
//                         {selectedCandidate.interviews?.length || 0} Phases
//                       </span>
//                     </div>
//                   </div>

//                   {!selectedCandidate.interviews || selectedCandidate.interviews.length === 0 ? (
//                     <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
//                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
//                         <Activity size={20} />
//                       </div>
//                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">No Assessment Data</p>
//                     </div>
//                   ) : (
//                     <div className="relative pl-2 md:pl-6">
//                       <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block" />

//                       <div className="space-y-10">
//                         {selectedCandidate.interviews.map((round) => (
//                           <div key={round.id} className="relative pl-0 md:pl-12 group transition-all">
//                             <div className="absolute -left-2 top-0 hidden md:flex w-8 h-8 rounded-xl bg-white border-2 border-slate-200 items-center justify-center z-10 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors shadow-sm">
//                               <span className="text-[10px] font-black">{round.round_number}</span>
//                             </div>

//                             <div className="flex flex-col gap-4">
//                               <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
//                                 <div>
//                                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">
//                                     Phase {round.round_number}: {round.mode} Assessment
//                                   </h4>
//                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
//                                     <Clock size={10}/> {new Date(round.interview_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                                   </p>
//                                 </div>
//                                 <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border bg-white shadow-sm ${
//                                     round.status === "completed" ? "text-emerald-600 border-emerald-200" : "text-slate-500 border-slate-200"
//                                   }`}>
//                                   {round.status}
//                                 </span>
//                               </div>

//                               {round.review ? (
//                                 <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
//                                   <div className="grid md:grid-cols-12">
//                                     <div className="md:col-span-4 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between gap-6">
//                                       <div>
//                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Verdict</span>
//                                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${
//                                             ["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase())
//                                               ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                                               : "bg-rose-50 text-rose-700 border-rose-100"
//                                           }`}>
//                                           {["hire", "pass", "strong pass"].includes(round.review.decision?.toLowerCase()) ? <ShieldCheck size={14}/> : <Activity size={14}/>}
//                                           {round.review.decision}
//                                         </div>
//                                       </div>
//                                       <div>
//                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Performance</span>
//                                         <div className="flex items-baseline gap-1">
//                                           <span className="text-3xl font-black text-slate-800 tracking-tighter">
//                                             {round.review.total_score ? Math.round(round.review.total_score * 10) : 0}
//                                           </span>
//                                           <span className="text-slate-400 font-bold text-xs">/100</span>
//                                         </div>
//                                       </div>
//                                     </div>

//                                     <div className="md:col-span-8 p-6 space-y-6">
//                                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
//                                         {[
//                                           { l: "Technical", v: round.review.technical_skill },
//                                           { l: "Comm.", v: round.review.communication },
//                                           { l: "Logic", v: round.review.problem_solving },
//                                           { l: "Domain", v: round.review.relevant_experience },
//                                         ].map((stat, i) => (
//                                           <div key={i} className="space-y-1.5">
//                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</p>
//                                             <div className="flex items-center gap-2">
//                                               <div className="flex gap-0.5">
//                                                 {[...Array(5)].map((_, star) => (
//                                                   <div key={star} className={`w-1 h-2 rounded-full ${star < (stat.v/2) ? "bg-blue-500" : "bg-slate-200"}`} />
//                                                 ))}
//                                               </div>
//                                               <span className="text-[10px] font-black text-slate-600">{stat.v}/10</span>
//                                             </div>
//                                           </div>
//                                         ))}
//                                       </div>

//                                       {round.review.remarks && (
//                                         <div className="pt-4 border-t border-slate-100">
//                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Reviewer Remarks</p>
//                                           <p className="text-[11px] text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
//                                             "{round.review.remarks}"
//                                           </p>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] p-6 flex items-center justify-center gap-4">
//                                   <Loader2 size={16} className="text-blue-500 animate-spin" />
//                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Analytical Input...</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* MODAL FOOTER */}
//               <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
//                 >
//                   Close Matrix
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= EXCEL EXPORT MODAL ================= */}
//         {exportModalOpen && (
//           <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
//               <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
//                   <Database size={20} strokeWidth={2.5}/>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Data Export</h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure registry extraction parameters</p>
//                 </div>
//               </div>

//               <div className="p-8 space-y-6">
//                 <div className="grid grid-cols-2 gap-5">
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
//                     <input
//                       type="date"
//                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
//                       value={exportFilters.start_date}
//                       onChange={(e) => setExportFilters({ ...exportFilters, start_date: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
//                     <input
//                       type="date"
//                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
//                       value={exportFilters.end_date}
//                       onChange={(e) => setExportFilters({ ...exportFilters, end_date: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Status</label>
//                   <div className="relative">
//                     <select
//                       className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
//                       value={exportFilters.status}
//                       onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
//                     >
//                       <option value="">All Statuses</option>
//                       <option value="scheduled">Scheduled</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                     <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Node</label>
//                   <div className="relative">
//                     <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <select
//                       value={exportFilters.department}
//                       onChange={(e) => setExportFilters({ ...exportFilters, department: e.target.value })}
//                       className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner appearance-none cursor-pointer uppercase tracking-widest"
//                     >
//                       <option value="">Select Organizational Unit</option>
//                       {departments.map((dept) => (
//                         <option key={dept.id} value={dept.name}>{dept.name} ({dept.code || "N/A"})</option>
//                       ))}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//               </div>

//               <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
//                 <button
//                   onClick={() => setExportModalOpen(false)}
//                   className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleExportExcel}
//                   className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
//                 >
//                   <ArrowUpRight size={14} strokeWidth={3} /> Execute Export
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HRGovernanceDashboard;
//************************************************************************************************** */
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
// import { departmentService } from "../../services/department.service";

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
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [exportFilters, setExportFilters] = useState({
//     start_date: "",
//     end_date: "",
//     status: "",
//     department: "",
//   });

//   const handleExportExcel = async () => {
//     try {
//       setLoading(true);
//       // Construct query parameters
//       const params = new URLSearchParams();
//       if (exportFilters.start_date)
//         params.append("start_date", exportFilters.start_date);
//       if (exportFilters.end_date)
//         params.append("end_date", exportFilters.end_date);
//       if (exportFilters.status) params.append("status", exportFilters.status);
//       if (exportFilters.department)
//         params.append("department", exportFilters.department);

//       const url = `https://apihrr.goelectronix.co.in/interviews/export?${params.toString()}`;

//       // Trigger download
//       window.open(url, "_blank");

//       toast.success("Excel generation protocol initiated");
//       setExportModalOpen(false);
//     } catch (err) {
//       toast.error("Failed to generate export manifest");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   // Fetch departments when modal opens
//   // useEffect(() => {
//   //   if (exportModalOpen) {
//   //     const fetchDepts = async () => {
//   //       try {
//   //         // Assuming you imported departmentService from your service file
//   //         const data = await departmentService.getAll();
//   //         setDepartments(data);
//   //       } catch (err) {
//   //         console.error("Failed to load departments", err);
//   //       }
//   //     };
//   //     fetchDepts();
//   //   }
//   // }, [exportModalOpen]);

//   useEffect(() => {
//     if (!exportModalOpen) return;

//     const fetchDepts = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load departments", err);
//         setDepartments([]); // prevents crash
//       }
//     };

//     fetchDepts();
//   }, [exportModalOpen]);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const start = Date.now();

//       const filters = buildFilters();
//       const data = await dashboardService.getCandidateStats(filters);

//       const elapsed = Date.now() - start;
//       if (elapsed < 400) {
//         await new Promise((r) => setTimeout(r, 400 - elapsed));
//       }

//       setApiStats(data);
//     } catch (err) {
//       console.error(err);
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
//         type: "confirmed",
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

//   const TerminalLoader = () => (
//     <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-6">
//         {/* Outer Pulse Ring */}
//         <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
//         {/* Inner Core */}
//         <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
//           <Activity size={28} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-2 text-center">
//         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
//           Executing Data Retrieval
//         </p>
//         <div className="flex items-center justify-center gap-1">
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
//         </div>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
//           Synchronizing with Governance Node...
//         </p>
//       </div>
//     </div>
//   );

//   const GlobalTerminalLoader = () => (
//     <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-8">
//         {/* Outer Rotating Gear Effect */}
//         <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />

//         {/* Pulse Rings */}
//         <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />

//         {/* Central Identity Core */}
//         <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//           <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>

//       {/* Technical Status Text */}
//       <div className="space-y-3 text-center">
//         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
//             Employee Data Processing
//         </h3>
//         <div className="flex flex-col items-center gap-1">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//             Connecting to Employee Records...
//           </p>
//           {/* Progress Bar Micro-animation */}
//           <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
//             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
//           </div>
//         </div>
//       </div>

//       {/* Security Metadata Footer */}
//       <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
//         <div className="flex items-center gap-1.5">
//           <Lock size={10} />
//           <span className="text-[9px] font-black uppercase tracking-tighter">
//             Encrypted Handshake
//           </span>
//         </div>
//         <div className="w-1 h-1 bg-slate-200 rounded-full" />
//         <div className="text-[9px] font-black uppercase tracking-tighter">
//           ISO 27001 Verified
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* GLOBAL LOADER OVERLAY */}
//       {loading && <GlobalTerminalLoader />}

//       <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
//         {/* --- HEADER --- */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//                 {/* Core Terminal */}
//                 Smart HRMS
//               </span>
//               <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//                 <Lock size={10} /> Secure HR Operations
//               </div>
//             </div>
//             <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//               {activeTab === "candidates"
//                 ? "Candidate Dashboard"
//                 : "Employee Dashboard"}
//             </h1>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* EXCEL EXPORT TRIGGER */}
//             <button
//               onClick={() => setExportModalOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 group"
//             >
//               <FileText
//                 size={14}
//                 className="text-white group-hover:animate-bounce"
//               />
//               <span className="text-[10px] font-black p-1 uppercase tracking-widest">
//                 Export Interview Data
//               </span>
//             </button>
//             {/* <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//               {["All", "Today", "Week", "Monthly"].map((range) => (
//                 <button
//                   key={range}
//                   onClick={() => setTimeRange(range)}
//                   className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                     timeRange === range
//                       ? "bg-slate-900 text-white shadow-md"
//                       : "text-slate-400 hover:bg-slate-100"
//                   }`}
//                 >
//                   {range}
//                 </button>
//               ))}
//             </div> */}
//           </div>
//         </div>

//         {/* --- TRACK SWITCHER --- */}

//         {/* --- TRACK SWITCHER --- */}
//         <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 border-b border-slate-200 pb-1 gap-4">
//           <div className="flex gap-4">
//             {[
//               {
//                 id: "candidates",
//                 label: "Candidates",
//                 icon: <UserPlus size={16} />,
//               },
//               {
//                 id: "employees",
//                 label: "Employees",
//                 icon: <Briefcase size={16} />,
//               },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setActiveView("dashboard");
//                 }}
//                 className={`flex items-center gap-2 px-4 py-3 !text-slate-600 !bg-transparent text-xs font-black uppercase tracking-widest transition-all relative ${
//                   activeTab === tab.id
//                     ? "text-blue-600"
//                     : "text-slate-400 hover:text-slate-600"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//                 {activeTab === tab.id && (
//                   <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* --- DYNAMIC ACTION BUTTONS --- */}
//           <div className="pb-2">
//             {activeTab === "candidates" ? (
//               <button
//                 // onClick={() => navigate("/candidate")}
//                  onClick={() => navigate("/candidate", { state: { modal: true } })}
//                 className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
//               >
//                 <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
//                   <Plus size={14} strokeWidth={3} />
//                 </div>
//                 <span className="text-[10px] font-black uppercase tracking-widest">
//                   Add Candidate
//                 </span>
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/dummyemp")}
//                 className="group flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95"
//               >
//                 <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
//                   <Zap size={14} fill="currentColor" strokeWidth={0} />
//                 </div>
//                 <span className="text-[10px] font-black uppercase tracking-widest">
//                   Onboard Employee
//                 </span>
//               </button>
//             )}
//           </div>
//         </div>

//         {activeView === "dashboard" ? (
//           <div className="grid grid-cols-12 gap-8">
//             {/* --- KPI CARDS --- */}

//             <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//               {loading ? (
//                 <TerminalLoader />
//               ) : (
//                 stats[activeTab].map((stat) => (
//                   <div
//                     key={stat.id}
//                     onClick={() => {
//                       if (activeTab === "candidates") {
//                         navigate(
//                           `/dashboard/candidate-table?type=${stat.type}`,
//                         );
//                       } else {
//                         navigate(`/dashboard/employee-table?type=${stat.type}`);
//                       }
//                     }}
//                     className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
//                   >
//                     <div
//                       className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
//                     >
//                       {stat.icon}
//                       {console.log("new data show in code", stat)}
//                     </div>

//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       {stat.label}
//                     </p>

//                     <h2 className="text-2xl font-black text-slate-900">
//                       {stat.val}
//                     </h2>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//             <div className="col-span-12 lg:col-span-8 space-y-8">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//                 <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                   <Zap size={16} className="text-amber-500" />
//                   {activeTab === "candidates"
//                     ? "Interview Review"
//                     : "Employee Overview"}
//                 </h3>

//                 {/* --- SEARCH & FILTER BAR --- */}

//                 <div className="flex flex-wrap items-center gap-3 mb-8 bg-slate-50/50 p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
//                   {/* SEARCH NODE - Primary Action */}
//                   <div className="relative flex-[2] min-w-[300px] group">
//                     <Search
//                       size={15}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Search by candidate, email or role..."
//                       value={searchText}
//                       onChange={(e) => setSearchText(e.target.value)}
//                       className="w-full h-11 pl-11 pr-4 text-[13px] font-medium bg-white rounded-[18px] border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-slate-400"
//                     />
//                   </div>

//                   {/* DECISION FILTER - Secondary Utility */}

//                   {/* DECISION FILTER - Only for Candidates */}
//                   {activeTab === "candidates" && (
//                     <div className="relative group min-w-[180px]">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
//                         <Filter size={13} />
//                       </div>

//                       <select
//                         value={decisionFilter}
//                         onChange={(e) => setDecisionFilter(e.target.value)}
//                         className="appearance-none w-full h-11 pl-10 pr-10 text-[11px] font-black uppercase tracking-[0.1em] bg-white rounded-[18px] border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer transition-all shadow-sm shadow-slate-100/20"
//                       >
//                         <option value="All">All Decisions</option>
//                         <option value="strong_pass">Strong Pass</option>
//                         <option value="pass">Pass</option>
//                         <option value="reject">Reject</option>
//                         <option value="in_progress">In Progress</option>
//                       </select>

//                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                         <ChevronDown size={14} />
//                       </div>
//                     </div>
//                   )}

//                   {/* CLEAR ACTION - Refined for visual alignment */}
//                   {(searchText ||
//                     (activeTab === "candidates" &&
//                       decisionFilter !== "All")) && (
//                     <button
//                       onClick={() => {
//                         setSearchText("");
//                         setDecisionFilter("All");
//                       }}
//                       className="h-11 px-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-[18px] transition-all border border-transparent hover:border-rose-100 active:scale-95"
//                     >
//                       <span className="mr-2">✕</span> Reset
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {activeTab === "candidates" && (
//                     <>
//                       {filteredInterviewReviews.map((review) => {
//                         const fullCandidate = interviewReviews.find(
//                           (c) => c.id === review.id,
//                         );

//                         return (
//                           <div
//                             key={review.id}
//                             onClick={() => setSelectedCandidate(fullCandidate)}
//                             className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer"
//                           >
//                             <div className="flex items-center gap-4">
//                               <div
//                                 className={`p-3 rounded-2xl ${
//                                   review.status === "Reject"
//                                     ? "bg-rose-100 text-rose-600"
//                                     : review.status === "Strong Pass"
//                                       ? "bg-emerald-100 text-emerald-600"
//                                       : "bg-blue-100 text-blue-600"
//                                 }`}
//                               >
//                                 {review.status === "Reject" ? (
//                                   <ThumbsDown size={18} />
//                                 ) : (
//                                   <ThumbsUp size={18} />
//                                 )}
//                               </div>

//                               <div>
//                                 <h4 className="text-sm font-black text-slate-900">
//                                   {review.name}
//                                 </h4>

//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span
//                                     className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                                       review.status === "Reject"
//                                         ? "bg-rose-200 text-rose-700"
//                                         : review.status === "Strong Pass"
//                                           ? "bg-emerald-200 text-emerald-700"
//                                           : "bg-blue-200 text-blue-700"
//                                     }`}
//                                   >
//                                     {review.status}
//                                   </span>

//                                   <span className="text-[9px] font-bold text-slate-400 uppercase">
//                                     {review.date}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {(review.status === "Pass" ||
//                               review.status === "Strong Pass") && (
//                               <div className="flex items-center gap-8">
//                                 <div className="hidden md:flex flex-col items-end">
//                                   <div className="flex gap-0.5 mb-1">
//                                     {[...Array(5)].map((_, i) => (
//                                       <Star
//                                         key={i}
//                                         size={12}
//                                         className={
//                                           i < review.stars
//                                             ? "fill-amber-400 text-amber-400"
//                                             : "text-slate-200"
//                                         }
//                                       />
//                                     ))}
//                                   </div>

//                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
//                                     Feedback Rating
//                                   </p>
//                                 </div>

//                                 <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                                   <p className="text-[8px] font-black text-slate-400 uppercase">
//                                     Score
//                                   </p>

//                                   <p className="text-lg font-black text-blue-600">
//                                     {review.score ?? 0}
//                                     <span className="text-[10px] text-slate-300">
//                                       /100
//                                     </span>
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {review.status === "Reject" && (
//                               <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                                 Profile Archived
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </>
//                   )}

//                   {/* ================= EMPLOYEE LIST ================= */}
//                   {activeTab === "employees" &&
//                     filteredEmployees.map((emp) => (
//                       <div
//                         key={emp.id}
//                         className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all"
//                       >
//                         <div>
//                           <h4 className="text-sm font-black text-slate-900">
//                             {emp.full_name}
//                           </h4>

//                           <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
//                             <span>Role • {emp.role || "-"}</span>
//                             <span>Dept • {emp.department_name || "-"}</span>
//                           </div>

//                           <div className="text-[9px] text-slate-400 mt-1">
//                             Joined •{" "}
//                             {emp.joining_date
//                               ? new Date(emp.joining_date).toLocaleDateString(
//                                   "en-GB",
//                                   {
//                                     day: "2-digit",
//                                     month: "short",
//                                     year: "numeric",
//                                   },
//                                 )
//                               : "-"}
//                           </div>
//                         </div>

//                         <span
//                           className={`px-3 py-1 text-xs rounded-full font-bold ${
//                             emp.status === "active"
//                               ? "bg-emerald-100 text-emerald-700"
//                               : emp.status === "on_probation"
//                                 ? "bg-amber-100 text-amber-700"
//                                 : "bg-slate-100 text-slate-600"
//                           }`}
//                         >
//                           {emp.status}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               </div>

//               {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             </div>

//             {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//             <div className="col-span-12 lg:col-span-4 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
//                 <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
//                   Calendar
//                 </h4>

//                 {/* Calendar */}

//                 <Calendar
//                   value={calendarDate}
//                   onChange={setCalendarDate}
//                   tileContent={({ date, view }) => {
//                     if (view !== "month") return null;

//                     const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//                     const interviewList = interviewDateMap[d];
//                     const employeeList = employeeJoinDateMap[d];

//                     if (!interviewList && !employeeList) return null;

//                     return (
//                       <div className="flex justify-center mt-1 gap-1 flex-wrap">
//                         {/* Interview dots */}
//                         {interviewList?.slice(0, 2).map((item, i) => (
//                           <span
//                             key={`i-${i}`}
//                             className={`w-1.5 h-1.5 rounded-full ${
//                               interviewStatusMeta[item.status]?.color ||
//                               "bg-slate-400"
//                             }`}
//                           />
//                         ))}

//                         {/* Employee joining dots */}
//                         {employeeList?.slice(0, 2).map((emp, i) => (
//                           <span
//                             key={`e-${i}`}
//                             className={`w-1.5 h-1.5 rounded-full ${
//                               employeeStatusMeta[emp.status]?.color ||
//                               "bg-blue-400"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     );
//                   }}
//                 />

//                 {/* Selected Day Interviews */}

//                 <div className="mt-8">
//                   {/* SECTION HEADER */}
//                   <div className="flex items-center justify-between mb-4 px-1">
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                       Day Schedule
//                     </span>
//                     <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//                       {calendarDate.toLocaleDateString("en-US", {
//                         day: "2-digit",
//                         month: "short",
//                       })}
//                     </span>
//                   </div>

//                   {/* SCROLLABLE FEED CONTAINER */}
//                   <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
//                     {(() => {
//                       const d = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;

//                       const interviewList = interviewDateMap[d] ?? [];
//                       const employeeList = employeeJoinDateMap[d] ?? [];

//                       if (
//                         interviewList.length === 0 &&
//                         employeeList.length === 0
//                       )
//                         return (
//                           <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-[24px] bg-slate-50/30">
//                             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                               No tactical events found
//                             </p>
//                           </div>
//                         );

//                       return (
//                         <div className="space-y-4">
//                           {/* INTERVIEW SEGMENT */}
//                           {interviewList.map((item, i) => (
//                             <div
//                               key={`int-${i}`}
//                               className="group relative pl-5 py-1 transition-all hover:translate-x-1"
//                             >
//                               {/* VERTICAL INTENT LINE */}
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />

//                               <div className="flex items-center justify-between group">
//                                 {/* NAME & PRIMARY IDENTITY */}
//                                 <div className="flex flex-col gap-1">
//                                   <span className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
//                                     {item.name}
//                                   </span>
//                                   {/* ROUND CONTEXT - Minimalist Sub-Label */}
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
//                                       Assessment Phase
//                                     </span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-200" />
//                                     <span className="text-[10px] font-bold text-slate-600">
//                                       Round {item.round}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* STATUS INDICATOR - Enterprise Style */}
//                                 <div className="flex items-center">
//                                   <div
//                                     className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all shadow-sm
//         ${
//           item.status === "completed"
//             ? "bg-emerald-50/50 border-emerald-100/60 text-emerald-700"
//             : item.status === "scheduled"
//               ? "bg-amber-50/50 border-amber-100/60 text-amber-700"
//               : item.status === "cancelled"
//                 ? "bg-rose-50/50 border-rose-100/60 text-rose-700"
//                 : "bg-slate-50 border-slate-200 text-slate-600"
//         }`}
//                                   >
//                                     {/* GLOWING STATUS DOT */}
//                                     <span
//                                       className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.1)] 
//         ${
//           item.status === "completed"
//             ? "bg-emerald-500"
//             : item.status === "scheduled"
//               ? "bg-amber-500"
//               : item.status === "cancelled"
//                 ? "bg-rose-500"
//                 : "bg-slate-400"
//         }`}
//                                     />

//                                     <span className="text-[10px] font-black uppercase tracking-tight">
//                                       {item.status}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}

//                           {/* JOINING SEGMENT */}
//                           {employeeList.map((emp, i) => (
//                             <div
//                               key={`emp-${i}`}
//                               className="group relative pl-5 py-1 transition-all hover:translate-x-1"
//                             >
//                               {/* VERTICAL INTENT LINE */}
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />

//                               <div className="flex flex-col gap-0.5">
//                                 <div className="flex items-center justify-between">
//                                   <span className="text-[12px] font-black text-slate-900 leading-none">
//                                     {emp.name}
//                                   </span>

//                                   {/* STATUS BADGE */}
//                                   <span
//                                     className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter
//       ${
//         emp.status === "joined"
//           ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
//           : emp.status === "pending"
//             ? "text-amber-700 bg-amber-50 border border-amber-100"
//             : emp.status === "no_show"
//               ? "text-rose-700 bg-rose-50 border border-rose-100"
//               : "text-slate-600 bg-slate-100"
//       }`}
//                                   >
//                                     {emp.status === "joined"
//                                       ? "Joined"
//                                       : emp.status === "pending"
//                                         ? "Pending"
//                                         : emp.status === "no_show"
//                                           ? "No Show"
//                                           : emp.status}
//                                   </span>
//                                 </div>

//                                 <div className="flex items-center gap-1.5">
//                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
//                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                                     {emp.role} • Employee Activation
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* --- DETAIL PAGE (UNTOUCHED) --- */
//           <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//               <button
//                 onClick={() => setActiveView("dashboard")}
//                 className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase"
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//             <div className="p-10">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                   <div>
//                     <p className="text-sm font-black">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">
//                       Aadhaar: Verified | eSign: Pending | Interview: Online
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                       Attended
//                     </span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
//                       Doc Uploaded
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= MODAL ================= */}
//         {selectedCandidate && (
//           <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
//             {/* Increased max-width to 4xl for better data spacing */}
//             <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white/20 h-full max-h-[90vh]">
//               {/* --- ENTERPRISE HEADER (Enhanced Padding) --- */}
//               <div className="px-10 py-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
//                 <div className="flex gap-6">
//                   <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 flex-shrink-0">
//                     <User size={32} />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3">
//                       <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
//                         {selectedCandidate.full_name}
//                       </h2>
//                       <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-100">
//                         {selectedCandidate.position || "Candidate"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-5">
//                       <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                         <Mail size={15} className="text-slate-300" />{" "}
//                         {selectedCandidate.email}
//                       </p>
//                       <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
//                       <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
//                         <Phone size={15} className="text-slate-300" />{" "}
//                         {selectedCandidate.phone || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               {/* --- MODAL BODY (Deep Vertical Spacing) --- */}
//               <div className="px-10 py-10 space-y-12 overflow-y-auto custom-scrollbar flex-1">
//                 {/* DATA MATRIX SECTION */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
//                   {[
//                     {
//                       label: "System Status",
//                       value: selectedCandidate.status,
//                       icon: Activity,
//                       color: "text-emerald-500",
//                     },
//                     {
//                       label: "Seniority/Exp",
//                       value: selectedCandidate.experience || "N/A",
//                       icon: Layers,
//                       color: "text-blue-500",
//                     },
//                     {
//                       label: "Current Location",
//                       value: selectedCandidate.location || "Remote",
//                       icon: MapPin,
//                       color: "text-rose-500",
//                     },
//                     {
//                       label: "Ingestion Node",
//                       value: selectedCandidate.entry_method,
//                       icon: ArrowUpRight,
//                       color: "text-amber-500",
//                     },
//                     {
//                       label: "Record Created",
//                       value: selectedCandidate.created_at
//                         ? new Date(
//                             selectedCandidate.created_at,
//                           ).toLocaleDateString("en-GB", {
//                             day: "2-digit",
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "-",
//                       icon: null,
//                       color: "text-slate-500",
//                     },
//                   ].map((item, idx) => (
//                     <div key={idx} className="space-y-2">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2.5">
//                         {item.icon && (
//                           <item.icon size={14} className={item.color} />
//                         )}
//                         {item.label}
//                       </p>
//                       <p className="text-base font-bold text-slate-800 capitalize">
//                         {item.value}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

//                 {/* ASSESSMENT SECTION */}
//                 <div className="space-y-12">
//                   {/* SECTION HEADER: HIGH-DENSITY */}
//                   <div className="flex items-end justify-between border-b border-slate-100 pb-6">
//                     <div className="space-y-1.5">
//                       <div className="flex items-center gap-2">
//                         <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
//                           <ShieldCheck size={16} className="text-white" />
//                         </div>
//                         <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">
//                           Assessment Pipeline
//                         </h3>
//                       </div>
//                       <p className="text-xs text-slate-400 font-medium">
//                         Technical evaluation ledger and decision history.
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end gap-1">
//                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         Efficiency Rating
//                       </span>
//                       <span className="text-sm font-black text-blue-600 tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
//                         {selectedCandidate.interviews?.length || 0} Phases
//                         Cleared
//                       </span>
//                     </div>
//                   </div>

//                   {/* TIMELINE ARCHITECTURE */}
//                   {!selectedCandidate.interviews ||
//                   selectedCandidate.interviews.length === 0 ? (
//                     <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
//                       <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
//                         <Activity size={24} />
//                       </div>
//                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
//                         No Assessment Data Found
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="relative">
//                       {/* THE CENTRAL PIPELINE THREAD */}
//                       <div className="absolute left-[20px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-slate-200 to-transparent hidden md:block" />

//                       <div className="space-y-12">
//                         {selectedCandidate.interviews.map((round, idx) => (
//                           <div
//                             key={round.id}
//                             className="relative pl-0 md:pl-14 group transition-all"
//                           >
//                             {/* TIMELINE NODE */}
//                             <div className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full bg-white border-2 border-slate-100 items-center justify-center z-10 group-hover:border-blue-500 transition-colors shadow-sm">
//                               <span className="text-[10px] font-black text-slate-900">
//                                 {round.round_number}
//                               </span>
//                             </div>

//                             <div className="flex flex-col gap-6">
//                               {/* ROUND METADATA */}
//                               <div className="flex flex-wrap items-center justify-between gap-4">
//                                 <div>
//                                   <div className="flex items-center gap-3 mb-1">
//                                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                       Phase {round.round_number}: {round.mode}{" "}
//                                       Assessment
//                                     </h4>
//                                     <span
//                                       className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
//                                         round.status === "completed"
//                                           ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                           : "bg-slate-50 text-slate-400 border-slate-100"
//                                       }`}
//                                     >
//                                       {round.status}
//                                     </span>
//                                   </div>
//                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//                                     Execution Date:{" "}
//                                     {new Date(
//                                       round.interview_date,
//                                     ).toLocaleDateString("en-US", {
//                                       month: "long",
//                                       day: "numeric",
//                                       year: "numeric",
//                                     })}
//                                   </p>
//                                 </div>
//                               </div>

//                               {/* DYNAMIC CONTENT BOX */}
//                               {round.review ? (
//                                 <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-100/50">
//                                   <div className="grid md:grid-cols-12">
//                                     {/* LEFT PANEL: DECISION & SCORE */}
//                                     <div className="md:col-span-4 p-6 bg-slate-50/50 border-r border-slate-50 flex flex-col justify-between gap-8">
//                                       <div>
//                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">
//                                           System Verdict
//                                         </span>
//                                         <div
//                                           className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-tighter ${
//                                             [
//                                               "hire",
//                                               "pass",
//                                               "strong pass",
//                                             ].includes(
//                                               round.review.decision?.toLowerCase(),
//                                             )
//                                               ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
//                                               : "bg-rose-500 text-white shadow-lg shadow-rose-100"
//                                           }`}
//                                         >
//                                           {/* Dynamic Icon Logic */}
//                                           {[
//                                             "hire",
//                                             "pass",
//                                             "strong pass",
//                                           ].includes(
//                                             round.review.decision?.toLowerCase(),
//                                           ) ? (
//                                             <ShieldCheck
//                                               size={14}
//                                               className={
//                                                 round.review.decision?.toLowerCase() ===
//                                                 "strong pass"
//                                                   ? "animate-pulse"
//                                                   : ""
//                                               }
//                                             />
//                                           ) : (
//                                             <Activity size={14} />
//                                           )}

//                                           {/* Label Display */}
//                                           {round.review.decision}
//                                         </div>
//                                       </div>

//                                       <div>
//                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
//                                           Weighted Performance
//                                         </span>
//                                         <div className="flex items-baseline gap-1">
//                                           <span className="text-4xl font-black text-slate-900 tracking-tighter">
//                                             {round.review.total_score
//                                               ? Math.round(
//                                                   round.review.total_score * 10,
//                                                 )
//                                               : 0}
//                                           </span>
//                                           <span className="text-slate-300 font-bold text-sm">
//                                             /100
//                                           </span>
//                                         </div>
//                                       </div>
//                                     </div>

//                                     {/* RIGHT PANEL: METRICS & REMARKS */}
//                                     <div className="md:col-span-8 p-6 space-y-6">
//                                       <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
//                                         {[
//                                           {
//                                             l: "Technical",
//                                             v: round.review.technical_skill,
//                                           },
//                                           {
//                                             l: "Linguistics",
//                                             v: round.review.communication,
//                                           },
//                                           {
//                                             l: "Cognition",
//                                             v: round.review.problem_solving,
//                                           },
//                                           {
//                                             l: "Cultural",
//                                             v: round.review.cultural_fit,
//                                           },
//                                           {
//                                             l: "Domain Exp",
//                                             v: round.review.relevant_experience,
//                                           },
//                                         ].map((stat, i) => (
//                                           <div key={i} className="space-y-1.5">
//                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                               {stat.l}
//                                             </p>
//                                             <div className="flex items-center gap-2">
//                                               <div className="flex gap-0.5">
//                                                 {[...Array(5)].map(
//                                                   (_, star) => (
//                                                     <div
//                                                       key={star}
//                                                       className={`w-1.5 h-3 rounded-full ${star < stat.v ? "bg-blue-600" : "bg-slate-100"}`}
//                                                     />
//                                                   ),
//                                                 )}
//                                               </div>
//                                               <span className="text-[10px] font-black text-slate-900">
//                                                 {stat.v}/10
//                                               </span>
//                                             </div>
//                                           </div>
//                                         ))}
//                                       </div>

//                                       {round.review.remarks && (
//                                         <div className="pt-4 border-t border-slate-50">
//                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
//                                             Executive Summary
//                                           </p>
//                                           <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100/50 italic">
//                                             "{round.review.remarks}"
//                                           </p>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
//                                   <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin mb-3" />
//                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                                     Interview Pending
//                                   </p>
//                                   <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
//                                     Awaiting Post-Round Analytical Input
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* --- FOOTER ACTIONS (Refined Padding) --- */}
//               <div className="px-10 py-8 bg-slate-50/80 border-t border-slate-100 flex justify-end items-center gap-6">
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
//                 >
//                   Dismiss
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ================= EXCEL EXPORT MODAL ================= */}
//         {exportModalOpen && (
//           <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20">
//               {/* HEADER */}
//               <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
//                     <Database size={20} />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">
//                       Export Registry
//                     </h3>
//                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
//                       Interview Data manifest / v1.0
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setExportModalOpen(false)}
//                   className="text-slate-400 hover:text-white transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* FILTER BODY */}
//               <div className="p-8 space-y-6 bg-slate-50/30">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all"
//                       value={exportFilters.start_date}
//                       onChange={(e) =>
//                         setExportFilters({
//                           ...exportFilters,
//                           start_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none transition-all"
//                       value={exportFilters.end_date}
//                       onChange={(e) =>
//                         setExportFilters({
//                           ...exportFilters,
//                           end_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Audit Status
//                   </label>
//                   <select
//                     className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-blue-600 outline-none appearance-none"
//                     value={exportFilters.status}
//                     onChange={(e) =>
//                       setExportFilters({
//                         ...exportFilters,
//                         status: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="">All Statuses</option>
//                     <option value="scheduled">Scheduled</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>

//                 {/* Department dropdown replacing the text input */}
//                 <div className="space-y-1.5 group">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
//                     Department Node
//                   </label>
//                   <div className="relative">
//                     {/* ICONS for consistency with your previous enterprise UI */}
//                     <Briefcase
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                       size={14}
//                     />

//                     <select
//                       value={exportFilters.department}
//                       onChange={(e) =>
//                         setExportFilters({
//                           ...exportFilters,
//                           department: e.target.value,
//                         })
//                       }
//                       className="w-full h-12 bg-white border border-slate-200 pl-11 pr-10 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer shadow-inner"
//                     >
//                       <option value="">Select Organizational Unit</option>
//                       {departments.map((dept) => (
//                         <option key={dept.id} value={dept.name}>
//                           {dept.name} ({dept.code || "N/A"})
//                         </option>
//                       ))}
//                     </select>

//                     <ChevronDown
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                       size={14}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* FOOTER ACTIONS */}
//               <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
//                 <button
//                   onClick={() => setExportModalOpen(false)}
//                   className="flex-1 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleExportExcel}
//                   className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
//                 >
//                   <ArrowUpRight size={14} /> Execute Export
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HRGovernanceDashboard;
