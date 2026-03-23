import React, { useState, useMemo, useEffect, useRef } from "react";

import {
  FileSpreadsheet,
  Webhook,
  UserPlus,
  Filter,
  Search,
  GraduationCap,
  ShieldAlert,
  ArrowLeft,
  Mail,
  XCircle,
  MoreHorizontal,
  Upload,
  Hash,
  User,
  CalendarIcon ,
  Building2,
  ClipboardClock,
  ExternalLink,
  CircleX,
  CheckCircle2,
  FileWarning,
  Loader2,
  UserCog,
  Gavel,
  Activity,
  IndianRupee,
  BadgeCheck,
  Telescope,
  UserCheck,
  Terminal,
  Layers,
  Users,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  Pencil,
  ShieldCheck,
  Database,
  Globe,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Send,
  Phone,
  PlusCircle,
  Maximize2,
  X,
  Printer,
  Languages,
  Clock,
  Check,
  ChevronDown,
  Calendar,
  Zap,
  ArrowUpRight,
  Eye,
  FileText,
  Award,
  Download,
  AlertCircle,
  Cross,
} from "lucide-react";
import { candidateService } from "../../services/candidateService";
import toast from "react-hot-toast";
import { getJobTemplates } from "../../services/jobTemplateService";
import { useNavigate, useLocation } from "react-router-dom";

const MetricTab = ({
  icon: Icon,
  label,
  count = 0, // 🟢 Set default value to 0
  onClick,
  colorClass,
  iconBg,
  isActive,
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-between p-3 rounded-lg !bg-white transition-all duration-300 border-2 group active:scale-[0.98] outline-none ${
      isActive ? "!border-blue-600   scale-[1.02]" : "border-slate-100 "
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}
      >
        <Icon size={22} className={colorClass} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-black leading-none ${isActive ? "text-blue-600" : "text-slate-900"}`}
          >
            {/* 🟢 Add the '?? 0' nullish coalescing operator for extra safety */}
            {(count ?? 0).toString().padStart(2, "0")}
          </span>
          <div
            className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`}
          />
        </div>
      </div>
    </div>
  </button>
);

const CandidateIntakeFilter = () => {
  // --- EXTENDED MOCK DATA ---
  const [candidates, setCandidates] = useState([]);
  const lastFetchedId = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // --- NEW STATE FOR SOURCE MODALS ---
  const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
  const [expProof, setExpProof] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [errors, setErrors] = useState({});
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [educationMasters, setEducationMasters] = useState([]);
  const [skillsMaster, setSkillsMaster] = useState([]);
  const [isFetchingSkills, setIsFetchingSkills] = useState(false);
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [singleMailCandidate, setSingleMailCandidate] = useState(null);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [metrics, setMetrics] = useState({ responses: 0, leads: 0, all: 0 });
  const [cityOptions, setCityOptions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [vacancyDetail, setVacancyDetail] = useState(null);
  const [positionMasters, setPositionMasters] = useState([]); // 🛠️ Missing state added
  const [loadingVacancy, setLoadingVacancy] = useState(false);
  const [decisionCandidate, setDecisionCandidate] = useState(null); // Tracks candidate for modal
  const [decisionData, setDecisionData] = useState({
    status: "",
    remark: "",
    follow_up_date: "",
    follow_up_time: "",
  });
  const [emailStatuses, setEmailStatuses] = useState({}); // { candidateId: true/false }
  // 1. Add this state at the top of your component
  const [followUpHistory, setFollowUpHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [followUpVariation, setFollowUpVariation] = useState(null); // today, future, pending, reject
  const [followUpData, setFollowUpData] = useState([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  // Keep 'metrics' for the top 3 tabs
  const [followUpMetrics, setFollowUpMetrics] = useState({
    today: 0,
    future: 0,
    pending: 0,
    reject: 0,
  });
const [protocolError, setProtocolError] = useState(null); // Stores the error message
  const [followUpUpdateTarget, setFollowUpUpdateTarget] = useState(null);
  const [updatePayload, setUpdatePayload] = useState({
    status: "pending",
    remark: "",
  });
  const [isCommiting, setIsCommiting] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  // 🎯 Controls the visibility of the Scheduling Modal
const [isNextRoundModalOpen, setIsNextRoundModalOpen] = useState(false);
const [conflictData, setConflictData] = useState(null);
// 🎯 Form state for the modal
const [nextRoundForm, setNextRoundForm] = useState({
  date: "",
  time: "",
  mode: "online",
  location: "",
  interviewerName: "",
  interviewerRole: "",
  interviewerEmail: "",
});
const [employeeList, setEmployeeList] = useState([]);
const [isFetchingEmployees, setIsFetchingEmployees] = useState(false);
const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
const [employeeSearch, setEmployeeSearch] = useState("");

// 🎯 This holds the specific candidate being scheduled
const [candidate, setCandidate] = useState(null);

  const [filters, setFilters] = useState({
    positions: [],
    experiences: [],
    educations: [],
    cities: [],
    ages: [],
    languages: [],
    districts: [],
    genders: [],
    statuses: [],
    industries: [], // 🛠️ ADD THIS
    departments: [],
    skills: [],
  });

  const validate = (rules) => {
    const newErrors = {};

    Object.keys(rules).forEach((field) => {
      const { value, required, pattern, message } = rules[field];

      if (required && !value) {
        newErrors[field] = "This field is required";
      }

      if (pattern && value && !pattern.test(value)) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
    district: "",
    country: "India",
    exp: "",
    position: "",
    education: "",
    fileName: "",
    cvFile: null,
    expLetterName: "",
    expLetterFile: null,

    department: "",
  });

  const [loadingCandidates, setLoadingCandidates] = useState(true);

  const normalizeText = (val) => {
    if (!val) return "";

    return val
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\s+/g, " ");
  };

  useEffect(() => {
    if (location.state?.modal) {
      setIsModalOpen(true);
    }
  }, [location.state]);


  // 🎯 AUTO-FILL LOGIC: Pre-fills Date/Time when the Schedule Modal opens
// 🎯 AUTO-FILL LOGIC: Pre-fills Date/Time (with -1 day offset) when the Schedule Modal opens
useEffect(() => {
  const latestLog = followUpHistory.find(h => h.action_type === "schedule_interaction");

  if (isNextRoundModalOpen && latestLog?.scheduled_at) {
    // 🛡️ 1. Extract the raw date part (YYYY-MM-DD) directly from the string
    const rawDateString = latestLog.scheduled_at.split('T')[0]; // Result: "2026-03-10"

    console.log("schedule date" , rawDateString)
    
    // 📅 2. Create the date object using local components to avoid UTC shifts
    const [year, month, day] = rawDateString.split('-').map(Number);
    const dt = new Date(year, month - 1, day);
    
    // 🎯 3. APPLY OFFSET: Subtract 1 day (Result: 2026-03-09)
    dt.setDate(dt.getDate()); 

    // 📅 4. Format back to YYYY-MM-DD for the HTML input
    const finalYear = dt.getFullYear();
    const finalMonth = String(dt.getMonth() + 1).padStart(2, '0');
    const finalDay = String(dt.getDate()).padStart(2, '0');
    const datePart = `${finalYear}-${finalMonth}-${finalDay}`;

    console.log(finalDay)

    console.log("🎯 Corrected Date Node:", datePart); // Will log 2026-03-09
    
    // 🕒 5. Extract Time (HH:mm) directly from the string to keep it stable
    const timePart = latestLog.scheduled_at.split('T')[1].slice(0, 5);

    setNextRoundForm(prev => ({
      ...prev,
      date: datePart,
      time: timePart,
      interviewerName: latestLog.performed_by || prev.interviewerName
    }));
  }
}, [isNextRoundModalOpen, followUpHistory]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vId = params.get("vacancy_id");

    // 🛡️ GUARD 1: If no ID, reset and exit
    if (!vId) {
      setVacancyDetail(null);
      return;
    }

    // 🛡️ GUARD 2: Prevents re-fetching (and re-logging) if data is already loaded for this ID
    if (vacancyDetail?.id?.toString() === vId) {
      return;
    }

    fetchVacancy(vId);
  }, [location.search, vacancyDetail?.id]); // Added vacancyDetail.id to the dependency array

  const fetchVacancy = async (vId) => {
    try {
      setLoadingVacancy(true);
      console.log("🚀 TELEMETRY: Fetching Vacancy ID:", vId); // Should now only log once per ID change

      const res = await fetch(
        `https://apihrr.goelectronix.co.in/vacancies/${vId}`,
      );
      const data = await res.json();

      setVacancyDetail(data);
    } catch (err) {
      console.error("❌ TELEMETRY ERROR:", err);
    } finally {
      setLoadingVacancy(false);
    }
  };

  // --- 🛰️ PERSISTENCE PROTOCOL: RUNS ON PAGE REFRESH ---

  // --- 🛰️ PERSISTENCE PROTOCOL: RUNS ON PAGE REFRESH ---
  useEffect(() => {
    const syncRegistryOnRefresh = async () => {
      const params = new URLSearchParams(location.search);
      const vId = params.get("vacancy_id") || "36";

      try {
        // 1. Existing Main Metrics Fetch (No changes here)
        const [resAll, resMatches, resLeads] = await Promise.all([
          candidateService.getAll1(""),
          candidateService.getAll1(`?status=jd_sent&vacancy_id=${vId}`),
          candidateService.getAll1(`?vacancy_id=${vId}`),
        ]);

        setMetrics({
          all: resAll.length,
          responses: resMatches.length,
          leads: resLeads.length,
        });

        // 2. 🎯 UPDATED: Fetch Follow-Up Counts with Specific Key Mapping
        const [todayRes, futureRes, pendingRes, rejectRes] = await Promise.all([
          fetch(
            `https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${vId}&variation=today`,
          ),
          fetch(
            `https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${vId}&variation=future`,
          ),
          fetch(
            `https://apihrr.goelectronix.co.in/follow-ups?status=overdue&vacancy_id=${vId}`,
          ),
          fetch(
            `https://apihrr.goelectronix.co.in/follow-ups?action_type=reject&vacancy_id=${vId}`,
          ),
        ]);

        const [todayD, futureD, pendingD, rejectD] = await Promise.all([
          todayRes.json(),
          futureRes.json(),
          pendingRes.json(),
          rejectRes.json(),
        ]);

        // 🎯 NEW HELPER: Sum for Today/Future/Pending, but SPECIFIC for Reject
        const getSum = (obj) =>
          Object.values(obj?.counts || {}).reduce((a, b) => a + b, 0);

        setFollowUpMetrics({
          today: getSum(todayD),
          future: getSum(futureD),
          pending: getSum(pendingD),
          // 🎯 ONLY GET REJECT COUNT: Access the 'reject' property directly
          reject: rejectD?.counts?.reject || 0,
        });

        loadCandidates(filters, searchQuery);
      } catch (e) {
        console.error("Refresh sync failed:", e);
      }
    };

    syncRegistryOnRefresh();
  }, []);

  useEffect(() => {
    const checkEmailLogs = async () => {
      if (activeTab !== "hot_leads" || candidates.length === 0) return;

      const newStatuses = { ...emailStatuses };

      // We only check candidates on the current page to optimize API calls
      const visibleCandidates = candidates.slice(
        (currentPage - 1) * 10,
        currentPage * 10,
      );

      await Promise.all(
        visibleCandidates.map(async (c) => {
          // Skip if already fetched in this session
          if (newStatuses[c.id] !== undefined) return;

          try {
            const res = await fetch(
              `https://apihrr.goelectronix.co.in/emails/logs?skip=0&limit=1&candidate_id=${c.id}&email_type=jd`,
            );
            const logs = await res.json();

            // Check the latest log entry (index 0) for is_opened
            newStatuses[c.id] = logs.length > 0 ? logs[0].is_opened : false;
          } catch (err) {
            console.error(`Log fetch failed for ${c.id}`, err);
            newStatuses[c.id] = false;
          }
        }),
      );
      setEmailStatuses(newStatuses);
    };

    checkEmailLogs();
  }, [candidates, currentPage, activeTab]);

  useEffect(() => {
    const fetchFilterMasters = async () => {
      try {
        const [indRes, depRes, eduRes, skillRes, posRes] = await Promise.all([
          fetch(
            "https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100",
          ),
          fetch("https://apihrr.goelectronix.co.in/departments"),
          fetch(
            "https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100",
          ),
          fetch(
            "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
          ),
          fetch("https://apihrr.goelectronix.co.in/positions?skip=0&limit=100"), // 🎓 New API
        ]);

        const indData = await indRes.json();
        const depData = await depRes.json();
        const eduData = await eduRes.json();
        const skillData = await skillRes.json();
        const posData = await posRes.json();

        setIndustries(indData || []);
        setDepartments(depData || []);
        setEducationMasters(eduData || []);
        setSkillsMaster(skillData || []);
        setPositionMasters(posData || []); // Store master education list
      } catch (err) {
        console.error("Filter Master Sync Failure", err);
      }
    };
    fetchFilterMasters();
  }, []);

  // --- 🛰️ PERSISTENCE PROTOCOL: RUNS ON PAGE REFRESH ---
  useEffect(() => {
    const syncRegistryOnRefresh = async () => {
      const params = new URLSearchParams(location.search);
      const vId = params.get("vacancy_id");

      try {
        let matchParams = `?status=jd_sent`;
        if (vId) matchParams += `&vacancy_id=${vId}`;

        // 1. Fetch Vacancy Requirements FIRST to build the perfect match query
        if (vId) {
          const vacRes = await fetch(
            `https://apihrr.goelectronix.co.in/vacancies/${vId}`,
          );
          const vacData = await vacRes.json();
          setVacancyDetail(vacData); // Restore top header UI

          // Build the Requirement String (Matching your Responses tab logic)
          const reqQuery = new URLSearchParams();
          if (vacData.title)
            reqQuery.append("position", vacData.title.toLowerCase());
          if (vacData.skills_req) {
            vacData.skills_req.forEach((s) =>
              reqQuery.append("skills", s.toLowerCase()),
            );
          }
          if (vacData.city?.[0])
            reqQuery.append("city", vacData.city[0].toLowerCase());

          // Combine status and vacancy_id with specific matching requirements
          matchParams += `&${reqQuery.toString()}`;
        }

        // 2. Fetch initial counts for all tabs using the Requirement Node
        const [resAll, resMatches, resLeads] = await Promise.all([
          candidateService.getAll1(""), // Total Database
          candidateService.getAll1(matchParams), // 🎯 Perfect Hot Match Count
          candidateService.getAll1(vId ? `?vacancy_id=${vId}` : ""), // Hot Leads Count
        ]);

        setMetrics({
          all: resAll.length,
          responses: resMatches.length,
          leads: resLeads.length,
        });

        // 3. Trigger initial list load
        // Passing true/false depending on if you want filters prefilled on refresh
        loadCandidates(filters, searchQuery);
      } catch (e) {
        console.error("Refresh sync failed:", e);
      }
    };

    syncRegistryOnRefresh();
  }, []);

  // --- 👥 EMPLOYEE REGISTRY HANDLER ---
// Define it here so it's available to the whole component
// const fetchConfirmedEmployees = async () => {
//   try {
//     setIsFetchingEmployees(true);
//     const res = await fetch("https://apihrr.goelectronix.co.in/employees?status=confirmed");
//     const data = await res.json();
//     setEmployeeList(data || []);
//   } catch (err) {
//     console.error("Employee Registry Error:", err);
//   } finally {
//     setIsFetchingEmployees(false);
//   }
// };

// --- 👥 EMPLOYEE REGISTRY HANDLER ---
const fetchConfirmedEmployees = async () => {
  try {
    setIsFetchingEmployees(true);
    const res = await fetch("https://apihrr.goelectronix.co.in/employees?status=confirmed");
    const data = await res.json();
    // 🛡️ Ensure we always set an array, even if API fails or returns null
    setEmployeeList(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Employee Registry Error:", err);
    setEmployeeList([]); // Fallback to empty array on error
  } finally {
    setIsFetchingEmployees(false);
  }
};

// 🎯 Trigger fetch and reset search when modal opens
useEffect(() => {
  if (isNextRoundModalOpen) {
    setEmployeeSearch(""); 
    fetchConfirmedEmployees();
  }
}, [isNextRoundModalOpen]);

// 🔍 The Safe Filtered List (Fixes your line 587 crash)
const filteredEmployees = useMemo(() => {
  if (!employeeList) return [];
  const searchLower = (employeeSearch || "").toLowerCase();

  return employeeList.filter(emp => {
    const name = (emp?.name || "").toLowerCase();
    const email = (emp?.email || "").toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });
}, [employeeSearch, employeeList]);

// Hook 1: Trigger fetch when modal opens
useEffect(() => {
  if (isNextRoundModalOpen) {
    fetchConfirmedEmployees();
  }
}, [isNextRoundModalOpen]);

// Hook 2: Reset search state when modal opens
useEffect(() => {
  if (isNextRoundModalOpen) {
    setEmployeeSearch(""); 
    // fetchConfirmedEmployees(); // This call is now safe because the function is defined above
  }
}, [isNextRoundModalOpen]);

// 🔍 Filtered list based on search input (Safe Version)
// 🔍 Filtered list based on search input (Safe Version)
// const filteredEmployees = useMemo(() => {
//   // 🛡️ Guard against null/undefined employee list
//   if (!employeeList || !Array.isArray(employeeList)) return [];
  
//   const searchLower = employeeSearch.toLowerCase();

//   return employeeList.filter(emp => {
//     if (!emp) return false;

//     // 🛡️ Use Optional Chaining and Nullish Coalescing to prevent 'toLowerCase' on undefined
//     const nameMatch = (emp.full_name ?? "").toLowerCase().includes(searchLower);
//     const emailMatch = (emp.email ?? "").toLowerCase().includes(searchLower);
    
//     return nameMatch || emailMatch;
//   });
// }, [employeeSearch, employeeList]);


  useEffect(() => {
    if (!activeTab) return;

    if (activeTab === "responses" && vacancyDetail) {
      setFilters((prev) => ({
        ...prev,
        // Map vacancy requirement data to your filter state
        skills: vacancyDetail.skills_req
          ? vacancyDetail.skills_req.map((s) => s.toUpperCase())
          : [],
        positions: vacancyDetail.title
          ? [vacancyDetail.title.toUpperCase()]
          : [],
        cities: vacancyDetail.city
          ? vacancyDetail.city.map((c) => c.toUpperCase())
          : [],
        // For experience, we map the range to your specific UI format if needed,
        // or simply store the numeric values if your UI supports it.
        experiences:
          vacancyDetail.min_experience !== undefined
            ? [`${Math.floor(vacancyDetail.min_experience)} YEARS`]
            : [],
        // Reset others if you want a clean vacancy-focused view
        languages: vacancyDetail.spoken_languages
          ? vacancyDetail.spoken_languages.map((l) => l.toUpperCase())
          : [],
      }));

      toast.success("Vacancy requirements applied to filters 🎯");
    }

    // 🎯 SCENARIO 2 & 3: Hot Leads or All -> CLEAR ALL UI INPUTS
    else {
      clearAllFilters();
    }

    // Load candidates with the fresh filter state
    loadCandidates(filters, searchQuery);
  }, [activeTab, vacancyDetail]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCityOptions([]);
    if (location.state?.modal) {
    }
  };

  const educationOptions = useMemo(() => {
    // Use the master list names for the dropdown options
    return educationMasters.map((edu) => edu.name.toUpperCase()).sort();
  }, [educationMasters]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const removeFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      positions: [],
      experiences: [],
      educations: [],
      districts: [],
      cities: [],
      ages: [],
      languages: [],
      genders: [],
      statuses: [],
      industries: [],
      departments: [],
      skills: [],
    });
  };

  const fetchFollowUpRegistry = async (variation) => {
    setFollowUpVariation(variation);
    setIsFollowUpLoading(true);

    try {
      const vId =
        new URLSearchParams(location.search).get("vacancy_id") || "36";
      let url = "";

      if (variation === "today")
        url = `https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${vId}&variation=today`;
      else if (variation === "future")
        url = `https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${vId}&variation=future`;
      else if (variation === "pending")
        url = `https://apihrr.goelectronix.co.in/follow-ups?status=overdue&vacancy_id=${vId}`;
      else if (variation === "reject")
        url = `https://apihrr.goelectronix.co.in/follow-ups?action_type=reject&vacancy_id=${vId}`;

      const res = await fetch(url);
      const result = await res.json();

      setFollowUpData(result.data || []);

      // 🎯 FIX: Conditional Count logic
      setFollowUpMetrics((prev) => ({
        ...prev,
        [variation]:
          variation === "reject"
            ? result?.counts?.reject || 0 // Only show the 'reject' number
            : Object.values(result?.counts || {}).reduce((a, b) => a + b, 0), // Sum for others
      }));
    } catch (err) {
      console.error("Registry Sync Failed", err);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  const actionMapping = {
    schedule_interaction: {
      label: "Call For Interview",
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: <Phone size={10} />,
    },
    call_not_connected: {
      label: "Not Connected",
      color: "text-orange-500",
      bg: "bg-orange-50",
      icon: <X size={10} />,
    },
    reschedule: {
      label: "Rescheduled",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      icon: <Clock size={10} />,
    },
    reject: {
      label: "Rejected",
      color: "text-red-600",
      bg: "bg-red-50",
      icon: <XCircle size={10} />,
    },
    visited: {
      label: "Visited",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: <CheckCircle2 size={10} />,
    },
  };

  const experienceOptions = useMemo(() => {
    const allExps = candidates.map((c) =>
      Math.floor(parseFloat(c.total_experience_years || 0)),
    );
    const maxExp = Math.max(...allExps, 5);
    return Array.from(
      { length: maxExp + 1 },
      (_, i) => `${i} YEAR${i !== 1 ? "S" : ""}`,
    );
  }, [candidates]);

  const skillsOptions = useMemo(() => {
    return skillsMaster.map((s) => s.name.toUpperCase()).sort();
  }, [skillsMaster]);

  // 🎯 MOVE THIS HERE: Industry logic
  const industryOptions = useMemo(() => {
    return industries.map((i) => i.name.toUpperCase());
  }, [industries]);

  const languageOptions = useMemo(() => {
    const allLanguages = new Set();

    candidates.forEach((c) => {
      // Check both potential keys in your candidate object
      const rawLangs = c.languages_spoken || c.language || [];

      // Force into an array if the data is just a string
      const langArray = Array.isArray(rawLangs) ? rawLangs : [rawLangs];

      langArray.forEach((l) => {
        if (l && typeof l === "string") {
          // .trim() removes hidden spaces, .toUpperCase() matches "hindi" with "Hindi"
          const cleanLang = l.trim().toUpperCase();
          if (cleanLang) {
            allLanguages.add(cleanLang);
          }
        }
      });
    });

    return Array.from(allLanguages).sort();
  }, [candidates]);

  // 1. Extract unique Districts from candidate data
  const districtOptions = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => {
      if (c.district) set.add(c.district.toUpperCase());
    });
    return Array.from(set).sort();
  }, [candidates]);

  // 2. Extract Cities based on selected Districts
  const dependentCityOptions = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => {
      const candidateDist = c.district?.toUpperCase();

      // Logic: If no district is selected, show all cities.
      // If a district is selected, only show cities belonging to that district.
      if (
        filters.districts.length === 0 ||
        filters.districts.includes(candidateDist)
      ) {
        if (c.city) set.add(c.city.toUpperCase());
      }
    });
    return Array.from(set).sort();
  }, [candidates, filters.districts]); // ✅ Triggers when district selection changes

  const filteredCandidates = useMemo(() => {
    return candidates;
  }, [candidates]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCandidates(filters, searchQuery);
    }, 500); // Wait 500ms after user stops typing/clicking

    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchQuery]);

  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";

  const loadCandidates = async (
    activeFilters = filters,
    query = searchQuery,
  ) => {
    try {
      setLoadingCandidates(true);
      const params = new URLSearchParams(location.search);

      const currentVacancyId = params.get("vacancy_id");

      if (activeTab === "responses") {
        params.set("status", "jd_sent"); // Keep your existing status

        if (currentVacancyId) {
          params.set("vacancy_id", currentVacancyId);
        }

        // 🔥 AUTO-INJECT VACANCY PARAMETERS
        if (vacancyDetail) {
          // 1. Position from Vacancy Title
          if (vacancyDetail.title) {
            params.append("position", vacancyDetail.title.toLowerCase());
          }

          // 2. Multi-Skills from skills_req
          if (vacancyDetail.skills_req?.length > 0) {
            vacancyDetail.skills_req.forEach((skill) => {
              params.append("skills", skill.toLowerCase());
            });
          }

          // 3. Experience Range
          if (vacancyDetail.min_experience !== undefined) {
            params.append("min_experience", vacancyDetail.min_experience);
          }
          if (vacancyDetail.max_experience !== undefined) {
            params.append("max_experience", vacancyDetail.max_experience);
          }

          // 4. Age Range
          if (vacancyDetail.min_age)
            params.append("min_age", vacancyDetail.min_age);
          if (vacancyDetail.max_age)
            params.append("max_age", vacancyDetail.max_age);

          // 5. Salary Range (Converted to Number)
          if (vacancyDetail.min_salary)
            params.append("min_salary", vacancyDetail.min_salary);
          if (vacancyDetail.max_salary)
            params.append("max_salary", vacancyDetail.max_salary);

          // 6. Location (First location from array)
          if (vacancyDetail.city?.[0]) {
            params.append("city", vacancyDetail.city[0].toLowerCase());
          }
        }
      } else if (activeTab === "hot_leads") {
        if (currentVacancyId) params.set("vacancy_id", currentVacancyId);
        params.delete("status");
      } else if (activeTab === "all") {
        params.delete("status");
        params.delete("vacancy_id");
      }

      // Search Query
      if (query) params.append("search", query);

      activeFilters.industries.forEach((selectedName) => {
        const match = industries.find(
          (ind) => ind.name.toUpperCase() === selectedName.toUpperCase(),
        );
        if (match) {
          params.append("industry_id", match.id);
        }
      });

      activeFilters.educations.forEach((eduName) => {
        params.append("education", eduName);
      });

      activeFilters.cities.forEach((c) => params.append("city", c));
      activeFilters.districts?.forEach((d) => params.append("district", d));

      if (activeFilters.experiences.length > 0) {
        const expValue = parseInt(
          activeFilters.experiences[0].replace(/\D/g, ""),
        );
        params.append("experience", expValue);
      }

      activeFilters.departments.forEach((d) => params.append("department", d));
      activeFilters.genders.forEach((g) => params.append("gender", g));
      activeFilters.statuses.forEach((s) =>
        params.append("status", s.toLowerCase()),
      );

      // Inside loadCandidates function...

      // 🎯 Convert to lowercase before appending to API params
      activeFilters.skills.forEach((skillName) => {
        params.append("skills", skillName.toLowerCase()); // 🔥 Send "react" instead of "REACT"
      });

      activeFilters.positions.forEach((posName) => {
        params.append("position", posName.toLowerCase());
      });

      if (activeFilters.ages.length > 0) {
        const range = activeFilters.ages[0];
        if (range === "18 - 25") {
          params.append("min_age", 18);
          params.append("max_age", 25);
        } else if (range === "26 - 35") {
          params.append("min_age", 26);
          params.append("max_age", 35);
        } else if (range === "35 - 45") {
          params.append("min_age", 35);
          params.append("max_age", 45);
        } else if (range === "45+") {
          params.append("min_age", 45);
        }
      }
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await candidateService.getAll1(queryString);

      const mapped = await Promise.all(
        data.map(async (c) => {
          // --- NEW: PERSISTENT PHONE FETCH LOGIC ---
          let phoneData = c.phone;
          const isAlreadyRevealed =
            currentVacancyId &&
            c.applied_vacancy_ids?.some(
              (id) => id.toString() === currentVacancyId.toString(),
            );

          if (isAlreadyRevealed) {
            try {
              const res = await fetch(
                `https://apihrr.goelectronix.co.in/candidates/${c.id}`,
              );
              const fullProfile = await res.json();
              phoneData = fullProfile.phone; // Update with real number
            } catch (e) {
              console.error(`Failed to re-sync phone for ID: ${c.id}`);
            }
          }

          // --- KEEPING ALL YOUR EXISTING LOGIC EXACTLY AS IS ---
          const sortedExperiences = (c.experiences || []).sort((a, b) => {
            if (!a.end_date) return -1;
            if (!b.end_date) return 1;
            return new Date(b.end_date) - new Date(a.end_date);
          });
          const latestExperience = sortedExperiences[0] || null;
          const rawCTC = c.previous_ctc ? parseFloat(c.previous_ctc) : 0;
          const sortedEducation = (c.educations || []).sort(
            (a, b) => b.end_year - a.end_year,
          );
          const latestEdu = sortedEducation[0] || null;
          const highestDegree =
            latestEdu?.education_master?.name ||
            c.latest_education ||
            "Not Specified";
          const totalExp = parseFloat(c.total_experience_years || 0);
          const yearsLabel = Math.floor(totalExp);
          const remainingMonths = Math.round((totalExp % 1) * 12);

          return {
            ...c,
            phone: phoneData, // 🔥 Now populated on refresh
            id: c.id,
            full_name: c.full_name,
            total_experience_years: totalExp.toFixed(1),
            experienceDisplay:
              yearsLabel > 0 || remainingMonths > 0
                ? `${yearsLabel}y ${remainingMonths}m`
                : "Fresher",
            latestJobTitle:
              c.latest_job_title ||
              latestExperience?.job_title ||
              "Not Specified",
            latestCTC: rawCTC,
            highestDegree: highestDegree,
            status: c.status || "open",
            cvUrl: c.resume_path,
          };
        }),
      );

      const finalView = mapped.filter((candidate) => {
        if (activeFilters.experiences.length === 0) return true;
        const selectedMax = parseInt(
          activeFilters.experiences[0].replace(/\D/g, ""),
        );
        const candidateExp = parseFloat(candidate.total_experience_years || 0);
        return candidateExp <= selectedMax;
      });

      setMetrics((prev) => ({
        ...prev,
        [activeTab === "all"
          ? "all"
          : activeTab === "responses"
            ? "responses"
            : "leads"]: data.length,
      }));

      setCandidates(mapped);
    } catch (err) {
      console.error("API FILTER ERROR:", err);
      toast.error("Failed to sync filtered data");
    } finally {
      setTimeout(() => setLoadingCandidates(false), 300);
    }
  };

  useEffect(() => {
    if (candidates.length > 0) {
      setLoadingCandidates(true);
      const timer = setTimeout(() => {
        setLoadingCandidates(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getJobTemplates();
        setTemplates(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadTemplates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    loadCandidates(filters, searchQuery);
  }, [activeTab]);

  const handleManualEntry = async (e) => {
    e.preventDefault();

    const isValid = validate({
      name: {
        value: formData.name,
        required: true,
      },
      email: {
        value: formData.email,
        required: true,
        pattern: /^\S+@\S+\.\S+$/,
        message: "Invalid email address",
      },
      phone: {
        value: formData.phone,
        pattern: /^[6-9]\d{9}$/,
        message: "Enter valid 10 digit Indian number",
      },
    });

    if (!isValid) {
      toast.error("Please fix form errors ❌");
      return;
    }

    try {
      setLoading(true);

      const formDataApi = new FormData();

      // ✅ Backend field names
      formDataApi.append("name", formData.name);
      formDataApi.append("email", formData.email);
      formDataApi.append("phone", formData.phone || "");
      formDataApi.append("address", formData.address);
      formDataApi.append("location", formData.address);
      formDataApi.append("position", formData.position);
      formDataApi.append("experience", formData.exp);
      formDataApi.append("city", formData.city);
      formDataApi.append("education", formData.education);
      formDataApi.append("department", formData.department);
      formDataApi.append("entry_method", "manual");
      formDataApi.append("pincode", formData.pincode);
      formDataApi.append("state", formData.state);
      formDataApi.append("district", formData.district);
      formDataApi.append("country", formData.country);

      // ✅ Resume Upload
      if (formData.cvFile) {
        formDataApi.append("resumepdf", formData.cvFile);
      }

      // ✅ Experience Letter Upload
      if (formData.expLetterFile) {
        formDataApi.append("experience_letter", formData.expLetterFile);
      }

      // 🔥 API CALL
      const createdCandidate =
        await candidateService.createCandidate(formDataApi);

      // Add candidate to UI
      setCandidates((prev) => [
        {
          id: createdCandidate.id,
          name: createdCandidate.full_name,
          email: createdCandidate.email,
          exp: createdCandidate.experience,
          location: createdCandidate.location,
          position: createdCandidate.position,
          education: createdCandidate.education,
          source: "Manual Entry",
          selected: false,
          cvUrl: createdCandidate.resume_path,
          expLetterUrl: createdCandidate.experience_letter_path,
        },
        ...prev,
      ]);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        exp: "",
        position: "",
        education: "",
        department: "",
        fileName: "",
        cvFile: null,
        expLetterName: "",
        expLetterFile: null,
      });

      // setIsModalOpen(false);
      closeModal();

      await loadCandidates();

      // ✅ SUCCESS TOASTER
      toast.success("Candidate uploaded successfully 🎉");
    } catch (err) {
      console.error("Create candidate failed:", err);

      let message = "Failed to upload candidate ❌";

      // Try to extract backend message
      try {
        if (typeof err?.message === "string" && err.message.startsWith("{")) {
          const parsed = JSON.parse(err.message);
          message = parsed?.detail || message;
        } else {
          message = err?.message || message;
        }
      } catch {}

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Only returns true if the MOST RECENT interaction is "visited"
  const isLatestInteractionVisited = useMemo(() => {
    if (!followUpHistory || followUpHistory.length === 0) return false;

    // Sort history to find the absolute latest entry by date
    const latestEntry = [...followUpHistory].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    )[0];

    return latestEntry?.action_type === "visited";
  }, [followUpHistory]);


  // 🎯 Returns true if the MOST RECENT interaction is "reject"
const isLatestInteractionRejected = useMemo(() => {
  if (!followUpHistory || followUpHistory.length === 0) return false;

  // Sort history to find the absolute latest entry by date
  const latestEntry = [...followUpHistory].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )[0];

  return latestEntry?.action_type === "reject";
}, [followUpHistory]);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Recently";

    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // 1. Seconds logic (Now)
    if (diffInSeconds < 60) return "Just now";

    // 2. Minutes logic
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    // 3. Hours logic (if today)
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    // 4. Days logic (if older than 24 hours)
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;

    // 5. Date logic (older than a week)
    return past.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;

    try {
      setIsFetchingPincode(true);
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0]?.Status === "Success" && data[0].PostOffice) {
        const offices = data[0].PostOffice;

        // Store all offices so the dropdown can map over them
        setCityOptions(offices);

        // Auto-fill with the first result as a sensible default
        const first = offices[0];
        setFormData((prev) => ({
          ...prev,
          city: first.Name,
          state: first.State,
          district: first.District,
          country: first.Country,
        }));

        if (offices.length > 1) {
          toast.success(
            `${offices.length} locations identified. Please select your area. 📍`,
          );
        } else {
          toast.success("Location auto-filled 📍");
        }
      } else {
        setCityOptions([]);
        toast.error("Invalid pincode ❌");
      }
    } catch (err) {
      console.error("Pincode API error:", err);
      setCityOptions([]);
      toast.error("Network Error: Location sync failed");
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const handleSendJD = async () => {
    try {
      const selectedIds = candidates.filter((c) => c.selected).map((c) => c.id);

      console.log("ssssss", selectedIds);

      if (!selectedIds.length) {
        toast.error("Please select candidates");
        return;
      }

      const payload = {
        candidate_ids: selectedIds,
        template_id: Number(selectedTemplate),
        custom_role: customRole,
        custom_content: customContent,
        save_as_new_template: saveAsTemplate,
        new_template_title: newTemplateTitle,
      };

      await candidateService.sendJD(payload);

      toast.success("JD sent successfully 🚀");

      // ✅ CLOSE MODAL
      setIsMailModalOpen(false);

      // ✅ CLEAR MODAL FORM DATA
      setSelectedTemplate("");
      setCustomRole("");
      setCustomContent("");
      setSaveAsTemplate(false);
      setNewTemplateTitle("");

      // ✅ OPTIONAL: UNSELECT ALL CANDIDATES
      setCandidates((prev) => prev.map((c) => ({ ...c, selected: false })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to send JD ❌");
    }
  };

  const handlesingleSendJD = async () => {
    try {
      let selectedIds = [];

      // 👉 SINGLE MODE (from View Modal)
      if (singleMailCandidate) {
        selectedIds = [singleMailCandidate.id];
      }
      // 👉 MULTI MODE (from table)
      else {
        selectedIds = candidates.filter((c) => c.selected).map((c) => c.id);
      }

      if (!selectedIds.length) {
        toast.error("Please select candidate");
        return;
      }

      const payload = {
        candidate_ids: selectedIds,
        template_id: Number(selectedTemplate) || null,
        custom_role: customRole,
        custom_content: customContent,
        save_as_new_template: saveAsTemplate,
        new_template_title: newTemplateTitle,
      };

      await candidateService.sendJD(payload);

      toast.success("JD sent successfully 🚀");

      // reset modal
      setIsMailModalOpen(false);
      setSelectedTemplate("");
      setCustomRole("");
      setCustomContent("");
      setSaveAsTemplate(false);
      setNewTemplateTitle("");
      setSingleMailCandidate(null);

      // unselect rows only if multi mode
      setCandidates((prev) => prev.map((c) => ({ ...c, selected: false })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to send JD ❌");
    }
  };

  const toggleSelectAll = () => {
    const allSelected = paginatedCandidates.every((c) => c.selected);

    setCandidates((prev) =>
      prev.map((c) =>
        paginatedCandidates.find((p) => p.id === c.id)
          ? { ...c, selected: !allSelected }
          : c,
      ),
    );
  };

  const toggleSelect = (id) => {
    setCandidates(
      candidates.map((c) =>
        c.id === id ? { ...c, selected: !c.selected } : c,
      ),
    );
  };

  const getInitials = (name = "") => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  const handleExcelImport = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file ❌");
      return;
    }

    try {
      setIsImporting(true);

      const formData = new FormData();
      formData.append("file", excelFile);

      const res = await fetch(
        "https://apihrr.goelectronix.co.in/candidates/import",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // backend error message
        throw new Error(data?.message || "Import failed");
      }

      toast.success(data?.message || "Candidates imported successfully 🎉");

      // 🔁 Reload candidates after import
      const updated = await candidateService.getAll();
      setCandidates(
        updated.map((c) => ({
          id: c.id,
          name: c.full_name || c.name,
          email: c.email,
          exp: c.experience,
          location: c.location,
          position: c.position,
          education: c.education,
          source: "Excel Import",
          selected: false,
          cvUrl: c.resume_path,
          expLetterUrl: c.experience_letter_path,
        })),
      );

      setActiveSourceModal(null);
      setExcelFile(null);
    } catch (err) {
      console.error("Excel import error:", err);
      toast.error(err.message || "Excel import failed ❌");
    } finally {
      setIsImporting(false);
    }
  };

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCandidates.slice(start, end);
  }, [filteredCandidates, currentPage]);

  const formatStatus = (status) => {
    if (!status) return "Applied";
    return status
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleStatusUpdate = async (candidateId, status) => {
    const loadingToast = toast.loading(`Moving to ${status.toUpperCase()}...`);
    try {
      const response = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${candidateId}/${status}`,
        { method: "POST" }, // Assuming POST based on standard enterprise patterns
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Success: Refresh candidate list to reflect new status
      await loadCandidates();
      toast.success(
        `Candidate ${status === "hold" ? "put on Hold" : "Rejected"} successfully`,
        {
          id: loadingToast,
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.", { id: loadingToast });
    }
  };

  const isFormInvalid =
    !formData.name || !formData.email || Object.keys(errors).length > 0;

  const validateField = (field, value) => {
    let error = "";

    if (field === "email" && value) {
      const [localPart, domainPart] = value.split("@");

      // 1. Check for basic format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format (e.g., user@domain.com)";
      }
      // 2. Check Local Part Length (User Name)
      else if (localPart.length > 64) {
        error = `User ID too long (${localPart.length}/64)`;
      }
      // 3. Check Domain Part Length (🛠️ DOMAIN PROTOCOL)
      else if (domainPart && domainPart.length > 255) {
        error = `Domain too long (${domainPart.length}/255)`;
      }
    }

    if (field === "phone" && value) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        error = "Enter valid 10 digit Indian mobile number";
      }
    }

    setErrors((prev) => {
      const updated = { ...prev };

      if (error) {
        updated[field] = error;
      } else {
        delete updated[field]; // 🔥 THIS IS KEY
      }

      return updated;
    });
  };

  const isRevealedForThisVacancy = (candidate) => {
    const params = new URLSearchParams(location.search);
    const currentVacancyId = params.get("vacancy_id");

    // Guard: if no context, check if any vacancy is linked
    if (!currentVacancyId) return !!candidate?.applied_vacancy_ids;

    // Safe split logic to handle null/undefined
    const rawIds = candidate?.applied_vacancy_ids || "";
    const existingIds = rawIds
      .toString()
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    return existingIds.includes(currentVacancyId.toString());
  };

  // 🛡️ Logic to lock the form if the process is effectively "Finished" (Rejected or Visited)
const isInteractionLocked = useMemo(() => {
  if (!followUpHistory || followUpHistory.length === 0) return false;

  // Sort history to find the absolute latest entry by date
  const latestEntry = [...followUpHistory].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )[0];

  return latestEntry?.action_type === "reject" || latestEntry?.action_type === "visited";
}, [followUpHistory]);

  // const toggleNumberReveal = async (candidate) => {
  //   const params = new URLSearchParams(location.search);
  //   const currentVacancyId = params.get("vacancy_id");

  //   if (!currentVacancyId) {
  //     toast.error("Protocol Error: No Vacancy Context");
  //     return;
  //   }

  //   const loadingToast = toast.loading("Revealing Identity Node...");

  //   try {
  //     // 🛠️ 1. CLUSTER AGGREGATION
  //     const rawValue = candidate?.applied_vacancy_ids || "";
  //     const existingIds = rawValue
  //       .toString()
  //       .split(",")
  //       .map((item) => item.trim())
  //       .filter(Boolean);
  //     const updatedCluster = [
  //       ...new Set([...existingIds, currentVacancyId.toString()]),
  //     ].join(",");

  //     // 📦 2. PATCH: Update Access Registry
  //     const formPayload = new FormData();
  //     formPayload.append("applied_vacancy_ids", updatedCluster);

  //     const patchRes = await fetch(
  //       `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
  //       {
  //         method: "PATCH",
  //         body: formPayload,
  //       },
  //     );

  //     if (!patchRes.ok) throw new Error("Registry Sync Failed");

  //     // 🔍 3. GET: Fetch Fresh Candidate Profile (Revealing the Number)
  //     const getRes = await fetch(
  //       `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
  //     );
  //     const freshData = await getRes.json();

  //     console.log("get by id", freshData);

  //     setCandidates((prev) =>
  //       prev.map((item) =>
  //         item.id === candidate.id
  //           ? {
  //               ...item,
  //               ...freshData,
  //               phone: freshData.phone,
  //               cvUrl: freshData.resume_path, // 🎯 Map the path from API to cvUrl
  //             }
  //           : item,
  //       ),
  //     );

  //     // 🔥 THE FIX: Instantly increment the Hot Leads metric badge
  //     setMetrics((prev) => ({
  //       ...prev,
  //       leads: prev.leads + 1
  //     }));

  //     toast.success("Candidate Number Revealed", { id: loadingToast });
  //   } catch (err) {
  //     console.error("Telemetry Error:", err);
  //     toast.error("Access Denied: Protocol Failure", { id: loadingToast });
  //   }
  // };

//   const handleCreateNextRound = async () => {
//   try {
//     const payload = {
//       candidate_id: Number(candidate.id),
//       mode: nextRoundForm.mode,
//       interview_date: new Date(`${nextRoundForm.date}T${nextRoundForm.time}`).toISOString(),
//       interviewer_name: nextRoundForm.interviewerName,
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
//         loading: "Scheduling interview...",
//         success: "Invitation dispatched successfully 🎉",
//         error: "Failed to schedule interview",
//       }
//     );

//     setIsNextRoundModalOpen(false);
//     loadCandidates(filters, searchQuery); // Refresh the list
//   } catch (err) {
//     console.error(err);
//   }
// };


// const handleCreateNextRound = async () => {
//   try {
//     // 🎯 1. Extract Vacancy ID Context from URL
//     const params = new URLSearchParams(location.search);
//     const currentVacancyId = parseInt(params.get("vacancy_id")) || 0;

//     // 🎯 2. Construct Protocol Payload matching your API spec
//     const payload = {
//       candidate_id: Number(candidate.id),
//       vacancy_id: currentVacancyId,
//       // Find the interviewer object to get the ID if available, else default to 0
//       interviewer_id: employeeList.find(emp => emp.full_name === nextRoundForm.interviewerName)?.id || 0,
//       mode: nextRoundForm.mode,
//       // Combine Date + Time into ISO string
//       interview_date: new Date(`${nextRoundForm.date}T${nextRoundForm.time}`).toISOString(),
//       meeting_link: nextRoundForm.mode === "online" ? nextRoundForm.location : "",
//       venue_details: nextRoundForm.mode === "offline" ? nextRoundForm.location : "",
//       interviewer_name: nextRoundForm.interviewerName,
//       interviewer_email: nextRoundForm.interviewerEmail,
//       interviewer_designation: nextRoundForm.interviewerRole,
//     };

//     console.log("🚀 DEPLOYING INTERVIEW PAYLOAD:", payload);

//     // 🎯 3. Execute Transmission
//     await toast.promise(
//       fetch("https://apihrr.goelectronix.co.in/interviews/schedule", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }),
//       {
//         loading: "Deploying Invitation Node...",
//         success: "Interview Scheduled & Calendar Synced 🚀",
//         error: "Transmission Failure: Check Registry Data",
//       }
//     );

//     // 🎯 4. Post-Success Protocol
//     setIsNextRoundModalOpen(false);
//     // Reload candidates to reflect status change
//     loadCandidates(filters, searchQuery); 
//   } catch (err) {
//     console.error("FATAL ERROR:", err);
//     toast.error("Process Aborted: Payload Error");
//   }
// };


const toggleNumberReveal = async (candidate) => {
    const params = new URLSearchParams(location.search);
    const currentVacancyId = params.get("vacancy_id");

    if (!currentVacancyId) {
      toast.error("Protocol Error: No Vacancy Context");
      return;
    }

    const loadingToast = toast.loading("Processing Request...");

    try {
      // --- 🚀 NEW: AUTO-JD PROTOCOL ---
      const currentStatus = candidate.status?.toLowerCase() || "applied";

      if (currentStatus === "applied") {
        toast.loading("Deploying JD Context...", { id: loadingToast });

        // Auto-attach the vacancy's template if available
        const defaultTemplateId = vacancyDetail?.job_description?.id 
          ? Number(vacancyDetail.job_description.id) 
          : null;

        const jdPayload = {
          candidate_ids: [candidate.id],
          template_id: defaultTemplateId,
          custom_role: "",
          custom_content: "",
          save_as_new_template: false,
          new_template_title: "",
        };

        // Fire JD API
        await candidateService.sendJD(jdPayload);
        
        toast.loading("JD Sent. Revealing Identity Node...", { id: loadingToast });
      } else {
        toast.loading("Revealing Identity Node...", { id: loadingToast });
      }
      // --- END AUTO-JD PROTOCOL ---


      // 🛠️ 1. CLUSTER AGGREGATION (Your Existing Logic)
      const rawValue = candidate?.applied_vacancy_ids || "";
      const existingIds = rawValue
        .toString()
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const updatedCluster = [
        ...new Set([...existingIds, currentVacancyId.toString()]),
      ].join(",");

      // 📦 2. PATCH: Update Access Registry
      const formPayload = new FormData();
      formPayload.append("applied_vacancy_ids", updatedCluster);

      // We also update the status to jd_sent if it was just applied
      if (currentStatus === "applied") {
        formPayload.append("status", "jd_sent"); 
      }

      const patchRes = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
        {
          method: "PATCH",
          body: formPayload,
        },
      );

      if (!patchRes.ok) throw new Error("Registry Sync Failed");

      // 🔍 3. GET: Fetch Fresh Candidate Profile (Revealing the Number)
      const getRes = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
      );
      const freshData = await getRes.json();

      setCandidates((prev) =>
        prev.map((item) =>
          item.id === candidate.id
            ? {
                ...item,
                ...freshData,
                phone: freshData.phone,
                cvUrl: freshData.resume_path, 
                // Instantly reflect the status change in UI if we just sent JD
                status: currentStatus === "applied" ? "jd_sent" : freshData.status
              }
            : item,
        ),
      );

      // 🔥 THE FIX: Instantly increment the Hot Leads metric badge
      setMetrics((prev) => ({
        ...prev,
        leads: prev.leads + 1
      }));

      toast.success("Candidate Number Revealed", { id: loadingToast });
    } catch (err) {
      console.error("Telemetry Error:", err);
      toast.error("Access Denied: Protocol Failure", { id: loadingToast });
    }
  };

const handleCreateNextRound = async () => {
  try {
    // 🎯 1. Extract Context
    const params = new URLSearchParams(location.search);
    const currentVacancyId = parseInt(params.get("vacancy_id")) || 0;
    const candidateId = Number(candidate?.id);

    // 🎯 2. Construct Protocol Payload
    const payload = {
      candidate_id: candidateId,
      vacancy_id: currentVacancyId,
      interviewer_id: employeeList.find(emp => emp.full_name === nextRoundForm.interviewerName)?.id || 0,
      mode: nextRoundForm.mode,
      interview_date: new Date(`${nextRoundForm.date}T${nextRoundForm.time}`).toISOString(),
      meeting_link: nextRoundForm.mode === "online" ? nextRoundForm.location : "",
      venue_details: nextRoundForm.mode === "offline" ? nextRoundForm.location : "",
      interviewer_name: nextRoundForm.interviewerName,
      interviewer_email: nextRoundForm.interviewerEmail,
      interviewer_designation: nextRoundForm.interviewerRole,
    };

    // 🎯 3. Execute Transmission with Redirect Logic
    const response = await toast.promise(
      fetch("https://apihrr.goelectronix.co.in/interviews/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      {
        loading: "Deploying Invitation Node...",
        success: "Interview Scheduled Successfully 🚀",
        error: "Transmission Failure",
      }
    );

    if (response.ok) {
      setIsNextRoundModalOpen(false);
      
      // 🚀 4. REDIRECT PROTOCOL: Navigate to the invitation page for this specific candidate
      // Example: /invitation/47
      setTimeout(() => {
        navigate(`/invitation/${candidateId}`);
      }, 500); // Slight delay so the user can see the success toast
    }
    
  } catch (err) {
    console.error("FATAL ERROR:", err);
    toast.error("Process Aborted: Payload Error");
  }
};


  const selectedCount = candidates.filter((c) => c.selected).length;

  const mailTargetCount = singleMailCandidate
    ? 1
    : candidates.filter((c) => c.selected).length;

  const mailTargetName = singleMailCandidate?.name || "";

  const handleToggleLanguages = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isLanguagesExpanded: !c.isLanguagesExpanded } : c,
      ),
    );
  };


  // --- 🏢 COMPANY REGISTRY HANDLER ---
const fetchCompanyAddress = async () => {
  try {
    const res = await fetch("https://apihrr.goelectronix.co.in/companies");
    const data = await res.json();

    if (data && data.length > 0) {
      // 🎯 Pull the address from the FIRST company in the list
      const firstCompanyAddress = data[0].address;
      
      setNextRoundForm(prev => ({
        ...prev,
        location: firstCompanyAddress || "Address not found in registry"
      }));
      
      toast.success("Office HQ address auto-synced 🏢");
    }
  } catch (err) {
    console.error("Company Registry Error:", err);
    toast.error("Failed to sync company address");
  }
};

  const getPaginationRange = () => {
    const totalPages = Math.ceil(filteredCandidates.length / 10);
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // 🎯 TERMINAL CHECK: Scans history to see if the loop is closed

  // const executeFollowUpProtocol = async () => {
  //   if (!decisionData.status) {
  //     return toast.error("Status Node Required ❌");
  //   }

  //   const loadingToast = toast.loading("Transmitting Follow-Up Data...");

  //   try {
  //     // 1. FORMAT DATA: Construct the Request Body
  //     const payload = {
  //       candidate_ids: [decisionCandidate.id], // Array wrapping the current candidate
  //       vacancy_id:
  //         parseInt(new URLSearchParams(location.search).get("vacancy_id")) || 0,
  //       action_type: decisionData.status, // mapped from Follow Type dropdown
  //       status: "pending", // Default as per your API spec
  //       remark: decisionData.remark || "No remarks provided.",
  //       send_email: true, // Internal protocol default
  //       // Format: YYYY-MM-DDTHH:mm:ssZ
  //       scheduled_at:
  //         decisionData.follow_up_date && decisionData.follow_up_time
  //           ? `${decisionData.follow_up_date}T${decisionData.follow_up_time}:00.000Z`
  //           : new Date().toISOString(),
  //       schedule_link: "", // Placeholder for interaction link
  //     };

  //     // 2. TRANSMISSION
  //     const response = await fetch(
  //       "https://apihrr.goelectronix.co.in/follow-ups",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       },
  //     );

  //     if (!response.ok) throw new Error("API Transmission Failed");

  //     // 3. REGISTRY SUCCESS
  //     toast.success("Registry Protocol Updated successfully 🚀", {
  //       id: loadingToast,
  //     });

  //     // Reset and Close
  //     setDecisionCandidate(null);
  //     setDecisionData({
  //       status: "",
  //       remark: "",
  //       follow_up_date: "",
  //       follow_up_time: "",
  //     });

  //     // Refresh the list to show updated status
  //     loadCandidates(filters, searchQuery);
  //   } catch (err) {
  //     console.error("Transmission Error:", err);
  //     toast.error("Protocol Error: Failed to sync with server", {
  //       id: loadingToast,
  //     });
  //   }
  // };


//   const executeFollowUpProtocol = async () => {
//   if (!decisionData.status) {
//     toast.error("Cannot create follow-up. Candidate is already in the Interview stage for this vacancy.");
//     return false;
//   }

//   const loadingToast = toast.loading("Transmitting Follow-Up Data...");

//   try {
//     const payload = {
//       candidate_ids: [decisionCandidate.id],
//       vacancy_id: parseInt(new URLSearchParams(location.search).get("vacancy_id")) || 0,
//       action_type: decisionData.status,
//       status: "pending",
//       remark: decisionData.remark || "No remarks provided.",
//       send_email: true,
//       scheduled_at: decisionData.follow_up_date && decisionData.follow_up_time
//           ? `${decisionData.follow_up_date}T${decisionData.follow_up_time}:00.000Z`
//           : new Date().toISOString(),
//       schedule_link: "",
//     };

//     const response = await fetch("https://apihrr.goelectronix.co.in/follow-ups", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       // 🛡️ API Error Handling (e.g., 400 Bad Request)
//       toast.error(result.message || "Protocol Error", { id: loadingToast });
//       return false; // ❌ STOP: Do not proceed to scheduling
//     }

//     toast.success("Registry Protocol Updated successfully 🚀", { id: loadingToast });
//     return true; // ✅ SUCCESS: Proceed to scheduling
    
//   } catch (err) {
//     console.error("Transmission Error:", err);
//     toast.error("Network Failure", { id: loadingToast });
//     return false;
//   }
// };


// 🔄 HELPER: Silently updates the Follow-Up Metric Hub
const refreshFollowUpMetrics = async () => {
  const vId = new URLSearchParams(location.search).get("vacancy_id") || "36";
  try {
    const [todayRes, futureRes, pendingRes, rejectRes] = await Promise.all([
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${vId}&variation=today`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${vId}&variation=future`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?status=overdue&vacancy_id=${vId}`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?action_type=reject&vacancy_id=${vId}`),
    ]);

    const [todayD, futureD, pendingD, rejectD] = await Promise.all([
      todayRes.json(), futureRes.json(), pendingRes.json(), rejectRes.json()
    ]);

    const getSum = (obj) => Object.values(obj?.counts || {}).reduce((a, b) => a + b, 0);

    setFollowUpMetrics({
      today: getSum(todayD),
      future: getSum(futureD),
      pending: getSum(pendingD),
      reject: rejectD?.counts?.reject || 0,
    });
  } catch (e) {
    console.error("Failed to refresh metrics:", e);
  }
};


const executeFollowUpProtocol = async () => {
  if (!decisionData.status) {
    toast.error("Status Node Required ❌");
    return false;
  }

  const loadingToast = toast.loading("Verifying Protocol...");

  try {
    const payload = {
      candidate_ids: [decisionCandidate.id],
      vacancy_id: parseInt(new URLSearchParams(location.search).get("vacancy_id")) || 0,
      action_type: decisionData.status,
      status: "pending",
      remark: decisionData.remark || "No remarks provided.",
      send_email: true,
      scheduled_at: decisionData.follow_up_date && decisionData.follow_up_time
          ? `${decisionData.follow_up_date}T${decisionData.follow_up_time}:00.000Z`
          : new Date().toISOString(),
    };

    const response = await fetch("https://apihrr.goelectronix.co.in/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      // 🛡️ CAPTURE SPECIFIC CONFLICT DATA FROM YOUR JSON
      if (result.conflict_data) {
        setConflictData(result.conflict_data);
      } else {
        toast.error(result.message || "Protocol Error");
      }
      toast.dismiss(loadingToast);
      return false; 
    }

    toast.success("Registry Updated successfully 🚀", { id: loadingToast });

    setDecisionCandidate(null);
    setDecisionData({
      status: "",
      remark: "",
      follow_up_date: "",
      follow_up_time: "",
    });

    await refreshFollowUpMetrics();

    // Optional: Refresh the specific active queue if you are currently viewing one
    if (followUpVariation) {
      fetchFollowUpRegistry(followUpVariation);
    } 
    
    return true;
  } catch (err) {
    toast.error("Network connection failure", { id: loadingToast });
    return false;
  }
};


  const executeFollowUpUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsCommiting(true);
    const loadingToast = toast.loading("Updating Protocol Node...");

    try {
      const response = await fetch(
        `https://apihrr.goelectronix.co.in/follow-ups/${followUpUpdateTarget.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        },
      );

      if (!response.ok) throw new Error("Sync Failed");

      toast.success("Registry Updated Successfully", { id: loadingToast });
      setFollowUpUpdateTarget(null); // Close Modal

      // Refresh the specific follow-up queue to show changes
      fetchFollowUpRegistry(followUpVariation);
    } catch (err) {
      toast.error("Transmission Failure", { id: loadingToast });
    } finally {
      setIsCommiting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
      {/* SOURCE CONTROL HEADER */}
      <nav className="!bg-white border-b border-slate-200 px-6 py-4 mb-4 rounded-lg sticky top-0 z-50 shadow-sm">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none"
                >
                  <ChevronLeft size={16} /> Back to Search
                </button>
              </div>
            </nav>

      {/* --- VACANCY CONTEXT STRIP --- */}
      {(loadingVacancy || vacancyDetail) && (
        <div className="mb-0 animate-in slide-in-from-top-4 duration-700">
          <div className="!bg-transparent   relative overflow-hidden group">
            {/* Design Watermark */}
            <Briefcase
              className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
              size={120}
            />

            {/* --- VACANCY INTELLIGENCE HUB (MATCHING IMAGE DESIGN) --- */}
            {(loadingVacancy || vacancyDetail) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4 animate-in slide-in-from-top-4 duration-700">
                {/* 🟢 LEFT: PRIMARY IDENTITY CARD (70% Width) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl px-8 py-5 shadow-sm relative overflow-hidden group">
                  <ShieldCheck
                    className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000"
                    size={350}
                  />

                  <div className="relative z-10 space-y-10">
                    {/* Row 1: Org & Status */}
                    <div className="flex items-center mb-4 justify-between">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                          {loadingVacancy ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Building2 size={28} strokeWidth={2.5} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] leading-none mb-2">
                            Hiring Organization
                          </span>
                          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                            {vacancyDetail?.company?.name ||
                              "Not Specified"}
                          </h2>
                        </div>
                      </div>

                      {/* --- UPDATED DYNAMIC STATUS NODE WITH INTERNAL GLOW --- */}

                      <div className="flex items-center gap-4 px-5 py-2 bg-slate-50/80 rounded-2xl  shadow-inner backdrop-blur-sm">
                        {/* --- ENTERPRISE STATUS NODE: PILL + INTERNAL GLOW --- */}
                        <div className="flex flex-col pr-2">
                          <div
                            className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 px-0 py-0 rounded-full transition-all duration-500  ${
                              vacancyDetail?.status === "open"
                                ? "  text-emerald-600"
                                : vacancyDetail?.status === "closed"
                                  ? "  text-red-600"
                                  : "  text-orange-500"
                            }`}
                          >
                            {/* DUAL-LAYER GLOW UNIT: Creates the diffused background shadow behind the active dot */}
                            <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                              {/* Layer 1: The Diffused Shadow (Blurry Background) */}
                              <div
                                className={`absolute inset-0 rounded-full blur-[6px] opacity-40 transition-colors duration-500 ${
                                  vacancyDetail?.status === "open"
                                    ? "bg-emerald-400"
                                    : vacancyDetail?.status === "closed"
                                      ? "bg-red-400"
                                      : "bg-orange-400"
                                }`}
                              />

                              {/* Layer 2: The Core Indicator (Pulsing Active Signal) */}
                              <div
                                className={`relative h-2 w-2 rounded-full animate-pulse z-10 transition-colors duration-500 ${
                                  vacancyDetail?.status === "open"
                                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                    : vacancyDetail?.status === "closed"
                                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                      : "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                                }`}
                              />
                            </div>

                            {/* TEXT NODE: Normalized Status Label */}
                            <span className="relative z-10 leading-none">
                              {vacancyDetail?.status
                                ? vacancyDetail.status.replace("_", " ")
                                : "PENDING"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Position Title */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                          Position
                        </span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mt-2">
                          {vacancyDetail?.title || "NODE JS"}
                        </h1>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/vacancy-details/${vacancyDetail?.id}`)
                        }
                        className="relative group/btn flex items-center justify-center gap-3 w-[150px] h-10 !bg-white rounded-2xl border !border-blue-500 !text-[#2563eb]   active:scale-95 overflow-hidden"
                      >
                        {/* 🔵 ANIMATED BACKGROUND GLOW (Saas Hover Effect) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />

                        {/* 🚀 ICON WITH BRANDING BOX PROTOCOL */}
                        <div className="relative z-10 flex items-center justify-center p-1.5 !bg-blue-50 rounded-lg group-hover/btn:bg-blue-600 group-hover/btn:text-white ">
                          <ArrowUpRight
                            size={14}
                            strokeWidth={3}
                            className=""
                          />
                        </div>

                        {/* 📝 TEXT NODE: META-DATA FIRST STYLE */}
                        <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 group-hover/btn:text-slate-900">
                          Overview
                        </span>

                        {/* ✨ BOTTOM ACCENT LINE */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-600 transition-all duration-500 group-hover/btn:w-full opacity-0 group-hover/btn:opacity-100" />
                      </button>
                    </div>

                    {/* --- DYNAMIC METRIC HUB --- */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                      <MetricTab
                        icon={Users}
                        label="Hot Match"
                        count={metrics.responses}
                        isActive={
                          activeTab === "responses" && !followUpVariation
                        } // 🎯 Only active if queue is closed
                        iconBg="bg-blue-50"
                        colorClass="text-blue-600"
                        onClick={() => {
                          setActiveTab("responses");
                          setFollowUpVariation(null); // 🎯 Hide Follow Up Queue
                        }}
                      />
                      <MetricTab
                        icon={Zap}
                        label="Hot Leads"
                        count={metrics.leads}
                        isActive={
                          activeTab === "hot_leads" && !followUpVariation
                        }
                        iconBg="bg-orange-50"
                        colorClass="text-orange-500"
                        onClick={() => {
                          setActiveTab("hot_leads");
                          setFollowUpVariation(null); // 🎯 Hide Follow Up Queue
                        }}
                      />
                      <MetricTab
                        icon={ShieldCheck}
                        label="Total Candidate"
                        count={metrics.all}
                        isActive={activeTab === "all" && !followUpVariation}
                        iconBg="bg-slate-50"
                        colorClass="text-slate-600"
                        onClick={() => {
                          setActiveTab("all");
                          setFollowUpVariation(null); // 🎯 Hide Follow Up Queue
                        }}
                      />
                    </div>

                    {/* --- FOLLOW UP HEADER NODE --- */}
                    <div className="flex items-center gap-3 mb-4 ml-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">
                        Follow Up
                      </h2>
                    </div>

                    {/* --- METRIC GRID: 4-COLUMN PROTOCOL --- */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                      <MetricTab
                        icon={Users}
                        label="Today"
                        count={followUpMetrics.today} // 🎯 Use followUpMetrics
                        isActive={followUpVariation === "today"}
                        iconBg="bg-blue-50"
                        colorClass="text-blue-600"
                        onClick={() => fetchFollowUpRegistry("today")}
                      />
                      <MetricTab
                        icon={Zap}
                        label="Future"
                        count={followUpMetrics.future} // 🎯 Use followUpMetrics
                        isActive={followUpVariation === "future"}
                        iconBg="bg-orange-50"
                        colorClass="text-orange-500"
                        onClick={() => fetchFollowUpRegistry("future")}
                      />
                      <MetricTab
                        icon={Clock}
                        label="Pending"
                        count={followUpMetrics.pending} // 🎯 Use followUpMetrics
                        isActive={followUpVariation === "pending"}
                        iconBg="bg-slate-50"
                        colorClass="text-slate-600"
                        onClick={() => fetchFollowUpRegistry("pending")}
                      />
                      <MetricTab
                        icon={XCircle}
                        label="Reject"
                        count={followUpMetrics.reject} // 🎯 Use followUpMetrics
                        isActive={followUpVariation === "reject"}
                        iconBg="bg-red-50"
                        colorClass="text-red-600"
                        onClick={() => fetchFollowUpRegistry("reject")}
                      />
                    </div>

                    {/* Row 4: Info Strip Layout logic */}
                    <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                      {[
                        {
                          label: "Type",
                          value: vacancyDetail?.job_type || "Part Time",
                          icon: <Briefcase size={12} />,
                        },
                        {
                          label: "Experience",
                          value: `${vacancyDetail?.min_experience}-${vacancyDetail?.max_experience}Y`,
                          icon: <Clock size={12} />,
                        },
                        {
                          label: "CTC",
                          value:
                            vacancyDetail?.min_salary &&
                            vacancyDetail?.max_salary
                              ? `${(vacancyDetail.min_salary / 100000).toFixed(0)} - ${(vacancyDetail.max_salary / 100000).toFixed(0)} LPA`
                              : "Not Specified",
                          icon: <IndianRupee size={12} />,
                        },
                        {
                          label: "Location",
                          value:
                            vacancyDetail?.location?.[0] || "Kalyan, Thane",
                          icon: <MapPin size={12} />,
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-5 py-3 w-[150px] bg-white rounded-lg border border-slate-100 shadow-sm transition-all hover:scale-105"
                        >
                          <div className="text-blue-500">{item.icon}</div>
                          <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                              {item.label}
                            </span>
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-none">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🔵 RIGHT: SIDEBAR DETAILS (30% Width) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-8 h-fit flex flex-col justify-between">
                  <div className="space-y-8">
                    <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-widest border-b border-slate-50 pb-4">
                      Job Details
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-4 border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-blue-200">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
                          <Phone size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                            Contact Person Number
                          </span>
                          <p className="text-xs font-black text-slate-700 uppercase tracking-tight">
                            9004949482
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-blue-200">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
                          <UserCheck size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                            Contact Person
                          </span>
                          <p className="text-xs font-black text-slate-700 uppercase tracking-tight">
                            SUJIT HANKARE 2
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-600 p-6 rounded-xl relative overflow-hidden group shadow-lg shadow-blue-100">
                    <ShieldCheck
                      className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700"
                      size={120}
                    />
                    <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.25em] mb-2 relative z-10">
                      Closing Date
                    </p>
                    <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">
                      27-FEB-2026
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ENTERPRISE FILTER BAR --- */}

      {/* --- ENTERPRISE FILTER HUB --- */}
      {/* {!followUpVariation && (
        <div className="animate-in fade-in duration-500">
          
          <div className="mb-4 space-y-4">
            <div className="flex-wrap items-center gap-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 px-3 border-r border-slate-100 mb-5">
                <Filter size={16} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Add Filters
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                <FilterDropdown
                  label="Experience (Years)"
                  options={experienceOptions}
                  onChange={(v) => toggleFilter("experiences", v)}
                  selected={filters.experiences}
                />

                <FilterDropdown
                  label="Education"
                  options={educationOptions} // Now comes from educationMasters API
                  onChange={(v) => toggleFilter("educations", v)}
                  selected={filters.educations}
                />

                <FilterDropdown
                  label="District"
                  options={districtOptions}
                  onChange={(v) => toggleFilter("districts", v)}
                  selected={filters.districts || []}
                />

                <FilterDropdown
                  label="City"
                  options={dependentCityOptions}
                  onChange={(v) => toggleFilter("cities", v)}
                  selected={filters.cities}
                />

                <FilterDropdown
                  label="Age Range"
                  options={["18 - 25", "26 - 35", "35 - 45", "45+"]}
                  onChange={(v) => toggleFilter("ages", v)}
                  selected={filters.ages}
                />

                <FilterDropdown
                  label="Language"
                  options={languageOptions}
                  onChange={(v) => toggleFilter("languages", v)}
                  selected={filters.languages}
                />

                <FilterDropdown
                  label="Gender"
                  options={["MALE", "FEMALE", "OTHER", "NOT SPECIFIED"]}
                  onChange={(v) => toggleFilter("genders", v)}
                  selected={filters.genders}
                />

                <FilterDropdown
                  label="Industry"
                  // options={industries.map((i) => i.name.toUpperCase())}
                  options={industryOptions}
                  onChange={(v) => toggleFilter("industries", v)}
                  selected={filters.industries}
                />

                <FilterDropdown
                  label="Skills"
                  options={skillsOptions}
                  onChange={(v) => toggleFilter("skills", v)}
                  selected={filters.skills}
                />
              </div>
            </div>
          </div>

         
          {(filters.positions.length > 0 ||
            filters.experiences.length > 0 ||
            filters.educations.length > 0 ||
            filters.cities.length > 0 ||
            filters.ages.length > 0 ||
            filters.languages.length > 0 ||
            filters.genders.length > 0 ||
            filters.statuses.length > 0 ||
            filters.departments.length > 0 ||
            filters.industries.length > 0 ||
            filters.skills.length > 0) && (
            <div className="mb-8 flex flex-wrap items-center gap-3 bg-white/50 p-4 rounded-2xl border border-dashed border-slate-200">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">
                Filters Applied:
              </span>

              {Object.entries(filters).map(([category, values]) =>
                values.map((val) => (
                  <button
                    key={val}
                    onClick={() => removeFilter(category, val)}
                    className="flex items-center gap-2 px-3 py-1.5 !bg-white border !border-blue-500 !text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-blue-50 transition-all group"
                  >
                    {val}
                    <X
                      size={12}
                      className="text-blue-300 group-hover:text-blue-600"
                    />
                  </button>
                )),
              )}

              <button
                onClick={clearAllFilters}
                className="text-[10px] font-black !bg-transparent uppercase !text-blue-500 hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )} */}


      {/* 🎚️ ENTERPRISE SIDE FILTER DRAWER */}
<div className={`fixed inset-0 z-[600] transition-all duration-500 ${isFilterDrawerOpen ? "visible" : "invisible"}`}>
    {/* Backdrop */}
    <div 
      className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isFilterDrawerOpen ? "opacity-100" : "opacity-0"}`}
      onClick={() => setIsFilterDrawerOpen(false)}
    />
    
    {/* Drawer Panel */}
    <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-500 flex flex-col ${isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                    <Filter size={18} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Filters</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Candidate Search</p>
                </div>
            </div>
            <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-white rounded-3xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                <X size={20} />
            </button>
        </div>

        {/* Filter Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-white">
            <FilterDropdown label="Experience (Years)" options={experienceOptions} onChange={(v) => toggleFilter("experiences", v)} selected={filters.experiences} />
            <FilterDropdown label="Education" options={educationOptions} onChange={(v) => toggleFilter("educations", v)} selected={filters.educations} />
            <FilterDropdown label="District" options={districtOptions} onChange={(v) => toggleFilter("districts", v)} selected={filters.districts || []} />
            <FilterDropdown label="City" options={dependentCityOptions} onChange={(v) => toggleFilter("cities", v)} selected={filters.cities} />
            <FilterDropdown label="Age Range" options={["18 - 25", "26 - 35", "35 - 45", "45+"]} onChange={(v) => toggleFilter("ages", v)} selected={filters.ages} />
            <FilterDropdown label="Language" options={languageOptions} onChange={(v) => toggleFilter("languages", v)} selected={filters.languages} />
            <FilterDropdown label="Gender" options={["MALE", "FEMALE", "OTHER", "NOT SPECIFIED"]} onChange={(v) => toggleFilter("genders", v)} selected={filters.genders} />
            <FilterDropdown label="Industry" options={industryOptions} onChange={(v) => toggleFilter("industries", v)} selected={filters.industries} />
            <FilterDropdown label="Skills" options={skillsOptions} onChange={(v) => toggleFilter("skills", v)} selected={filters.skills} />
        </div>

        {/* Footer: Active Pills & Clear */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
            {Object.values(filters).flat().length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    <button onClick={clearAllFilters} className="text-[9px] font-black !text-blue-600 uppercase !bg-transparent tracking-widest hover:underline mb-2 w-full text-left">
                        Clear All Filters
                    </button>
                </div>
            )}
            <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95"
            >
                Apply Criteria
            </button>
        </div>
    </div>
</div>

      {/* --- START CANDIDATE REGISTRY BLOCK --- */}

      {/* --- END CANDIDATE REGISTRY BLOCK --- */}

      {/* --- 🎯 DYNAMIC VIEW TOGGLE --- */}

      {!followUpVariation ? (
        /* 🟢 VIEW A: MAIN CANDIDATE REGISTRY (Shows when no Follow-up tab is clicked) */
        <div className="space-y-6 animate-in fade-in duration-700">
          {/* 1. ENTERPRISE TOOLBAR (Updated with Select All Input) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group animate-in fade-in zoom-in-95">
                <input
                  type="checkbox"
                  checked={
                    filteredCandidates.length > 0 &&
                    filteredCandidates
                      .slice((currentPage - 1) * 10, currentPage * 10)
                      .every((c) => c.selected)
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer shadow-sm transition-transform group-hover:scale-110"
                />
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">
                  Select All
                </label>
              </div>

              <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />

              <div className="flex items-center gap-4">
                <div className="p-3 !bg-white rounded-xl border border-blue-500 !text-blue-500 shadow-sm shadow-blue-100">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none">
                    Candidate
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    {filteredCandidates.length} Total Candidate
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Candiate Name..."
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 w-full md:w-64 transition-all shadow-inner"
                />
              </div>

              <button 
    onClick={() => setIsFilterDrawerOpen(true)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
      Object.values(filters).some(arr => arr.length > 0) 
      ? "!bg-blue-50 !border-blue-600 !text-blue-600 shadow-blue-100" 
      : "!bg-white !border-slate-200 !text-slate-500 hover:border-blue-400"
    }`}
  >
    <Filter size={14} strokeWidth={3} />
    Filters {Object.values(filters).flat().length > 0 && `(${Object.values(filters).flat().length})`}
  </button>

              {/* --- UPDATED SHOOT MAIL BUTTON --- */}

              <button
                onClick={() => {
                  setSingleMailCandidate(null);

                  // 🎯 PRE-FILL LOGIC: Match vacancy JD with template list
                  if (vacancyDetail?.job_description?.id) {
                    setSelectedTemplate(
                      vacancyDetail.job_description.id.toString(),
                    );
                    toast.success(
                      `Template pre-filled: ${vacancyDetail.job_description.title}`,
                    );
                  } else {
                    setSelectedTemplate("");
                  }

                  setIsMailModalOpen(true);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCount > 0
                    ? "!bg-white !text-blue-500 border border-blue-500 shadow-sm shadow-blue-200 active:scale-95"
                    : "!bg-slate-100 !text-slate-400 cursor-not-allowed"
                }`}
                disabled={selectedCount === 0}
              >
                <Mail size={14} />
                {selectedCount <= 1
                  ? "Send Jd"
                  : `Send ${selectedCount} Mails`}
              </button>
            </div>
          </div>

          {/* --- START ENTERPRISE WORKINDIA-STYLE CARD STREAM --- */}
          {/* 2. ENTERPRISE CARD STREAM */}
          <div className="space-y-4 min-h-[400px] relative mb-4">
            {loadingCandidates ? (
              /* --- ENTERPRISE LOADER STATE --- */
              <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-xl shadow-sm animate-pulse">
                <div className="relative">
                  <Loader2
                    size={48}
                    className="text-blue-600 animate-spin mb-4"
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse rounded-full" />
                </div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-bounce">
                  Fetching Data...
                </h3>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                  Fetching secure candidate data
                </p>
              </div>
            ) : filteredCandidates.slice(
                (currentPage - 1) * 10,
                currentPage * 10,
              ).length > 0 ? (
              filteredCandidates
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((c) => (
                  <div
                    key={c.id}
                    className={`bg-white border rounded-xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden ${
                      c.selected
                        ? "border-blue-500 bg-blue-50/5 shadow-blue-100/20"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Security Watermark Anchor */}
                    <ShieldCheck
                      className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
                      size={150}
                    />

                    <div className="relative z-10 space-y-6">
                      {/* TOP SECTION: IDENTITY & ENGAGEMENT */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={c.selected}
                            onChange={() => toggleSelect(c.id)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer shadow-sm transition-transform hover:scale-110"
                          />

                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-blue-500 text-xl font-black shadow-sm border-2 border-blue-500 uppercase tracking-tighter ring-4 ring-white">
                              {(c.full_name || "U").charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
                              {c.full_name?.toLowerCase()}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              {/* {calculateAge(c.dob)} •{" "} */}
                              {c.age} • {c.gender || "Not Specified"}
                            </p>
                          </div>

                          <div className="absolute top-6 right-6 z-20">
                            {(() => {
                              const statusConfig = {
                                // 🟡 YELLOW/AMBER for Applied (JD NOT SENT)
                                applied: {
                                  label: "JD NOT SENT",
                                  color: "text-amber-700",
                                  bg: "bg-amber-50",
                                  border: "border-amber-200",
                                  glow: "bg-amber-500",
                                },
                                // 🔵 BLUE for Interviewing
                                interviewing: {
                                  label: "INTERVIEWING",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🟢 EMERALD for Selected
                                selected: {
                                  label: "SELECTED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🔴 RED for Rejected
                                rejected: {
                                  label: "REJECTED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🟣 INDIGO for JD Sent
                                jd_sent: {
                                  label: "JD SENT",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🟢 GREEN for JD Accepted
                                jd_accepted: {
                                  label: "JD ACCEPTED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🔴 ROSE for JD Rejected
                                jd_rejected: {
                                  label: "JD REJECTED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🟠 ORANGE for JD Pending
                                jd_pending: {
                                  label: "JD PENDING",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🔘 SLATE for Migrated
                                migrated: {
                                  label: "MIGRATED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // ⚪ GRAY for Hold
                                on_hold: {
                                  label: "ON HOLD",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 💎 CYAN for Talked
                                talked: {
                                  label: "TALKED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                                // 🌑 SLATE LIGHT for Not Talked
                                not_talked: {
                                  label: "NOT TALKED",
                                  color: "text-green-700",
                                  bg: "bg-green-50",
                                  border: "bg-green-100",
                                  glow: "bg-green-500",
                                },
                              };

                              const currentStatus =
                                c.status?.toLowerCase() || "applied";
                              const config =
                                statusConfig[currentStatus] ||
                                statusConfig.applied;

                              const displayLabel =
                                currentStatus === "applied"
                                  ? "JD NOT SENT"
                                  : "JD SENT";

                              return (
                                <div
                                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 shadow-sm transition-all duration-300 ${config.bg} ${config.border} ${config.color}`}
                                >
                                  {/* Dual-Pulse Indicator */}
                                  <div className="relative flex h-2 w-2">
                                    <span
                                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.glow}`}
                                    ></span>
                                    <span
                                      className={`relative inline-flex rounded-full h-2 w-2 ${config.glow}`}
                                    ></span>
                                  </div>

                                  {/* Meta-Data First Label */}
                                  <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
                                    {displayLabel}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* MIDDLE SECTION: CORE METADATA STRIP */}
                      <div className="space-y-4 pl-14">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2">
                          {/* EXPERIENCE NODE */}
                          <div className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-white text-blue-600 shadow-sm transition-all  group-hover:text-blue-600">
                              <Briefcase size={18} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                                Total Experience
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                                  {c.total_experience_years || "Not Specified"}
                                </span>
                                {/* Optional secondary badge for months */}
                              </div>
                            </div>
                          </div>

                          <div className="h-6 w-[13px] bg-slate-100 hidden sm:block" />

                          {/* LOCATION NODE */}
                          <div className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-white text-blue-600 shadow-sm transition-colors group-hover:border-blue-200 group-hover:text-blue-600">
                              <MapPin size={18} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                                Location
                              </span>
                              <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                                {c.city || "Not Specified"}
                              </span>
                            </div>
                          </div>

                          <div className="h-6 w-[1px] bg-slate-100 hidden sm:block" />

                          <div className="flex items-center gap-3 group min-w-[140px]">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-xl bg-white border shadow-sm transition-colors ${
                                c.latestCTC
                                  ? "border-emerald-100 text-blue-600"
                                  : "border-slate-100 text-blue-500"
                              }`}
                            >
                              <span className="text-[16px] font-black leading-none">
                                ₹
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1.5">
                                Previous CTC
                              </span>

                              <div className="flex items-center gap-1.5">
                                {c.latestCTC ? (
                                  /* DATA PRESENT: Emerald Success State */
                                  <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                                    {(c.latestCTC / 100000).toFixed(2)}{" "}
                                    <span className="text-blue-600 text-[11px]">
                                      LPA
                                    </span>
                                  </span>
                                ) : (
                                  /* DATA MISSING: Neutral Slate State */
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                                    Not Specified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 min-w-[160px]">
                          <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                            <Zap size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                              Languages
                            </p>
                            <div className="text-[13px] font-black text-slate-900 uppercase leading-tight">
                              {c.languages_spoken &&
                              c.languages_spoken.length > 0 ? (
                                <div className="flex items-center flex-wrap gap-1">
                                  {/* Main Logic: If total > 2, we use the collapse pattern */}
                                  <span>
                                    {c.isLanguagesExpanded
                                      ? c.languages_spoken.join(", ")
                                      : c.languages_spoken
                                          .slice(0, 2)
                                          .join(", ")}
                                  </span>

                                  {c.languages_spoken.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // We update the candidate object locally or via a toggle function
                                        handleToggleLanguages(c.id);
                                      }}
                                      className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black border transition-all cursor-pointer ${
                                        c.isLanguagesExpanded
                                          ? "bg-slate-900 text-white border-slate-900"
                                          : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"
                                      }`}
                                    >
                                      {c.isLanguagesExpanded
                                        ? "SHOW LESS"
                                        : `+${c.languages_spoken.length - 2} MORE`}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                "Not Specified"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RELEVANT EXPERIENCE BOX (High Contrast Container) */}

                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 ml-14 relative overflow-hidden transition-all duration-300">
                        {/* VERTICAL ACCENT LINE */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

                        <div className="space-y-3">
                          {/* HEADER SECTION */}

                          {/* DATA GRID: 3 COLS */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* ROLE */}
                            <div className="flex items-center gap-2.5">
                              <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                                <UserCog size={18} strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                                  Current Job
                                </p>
                                <p className="text-[13px] font-black text-slate-900 uppercase truncate max-w-[120px]">
                                  {c.latestJobTitle || "Not Specified"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 min-w-[160px]">
                              <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                                <Layers size={18} strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                                  Industry
                                </p>
                                <div className="text-[13px] font-black text-slate-900 uppercase leading-tight flex items-center flex-wrap gap-1">
                                  {c.industries_worked &&
                                  c.industries_worked.length > 0 ? (
                                    <>
                                      <span>
                                        {c.industries_worked
                                          .slice(0, 2)
                                          .map((ind) => ind.name)
                                          .join(", ")}
                                      </span>
                                      {c.industries_worked.length > 2 && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toast(
                                              <div className="p-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-1">
                                                  Full Industry History
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                                                  {c.industries_worked
                                                    .map((i) => i.name)
                                                    .join(", ")}
                                                </p>
                                              </div>,
                                              {
                                                style: {
                                                  borderRadius: "1rem",
                                                  border: "1px solid #f1f5f9",
                                                  padding: "12px",
                                                },
                                                duration: 3000,
                                              },
                                            );
                                          }}
                                          className="ml-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                        >
                                          +{c.industries_worked.length - 2} MORE
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    "Not Specified"
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* EDUCATION NODE */}
                            <div className="flex items-center gap-2.5">
                              <div className="flex-shrink-0 p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                                <GraduationCap size={18} strokeWidth={2.5} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                                  Education
                                </p>
                                <p
                                  className="text-[13px] font-black text-slate-800 uppercase truncate"
                                  title={c.highestDegree}
                                >
                                  {c.highestDegree}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* SKILLS STACK */}
                          <div className="pt-2 border-t border-slate-200/50">
                            <div className="flex flex-wrap items-center gap-1.5 transition-all">
                              <div className="p-1 mr-1 text-blue-600 bg-white rounded-lg shadow-sm border border-slate-100">
                                <Zap size={18} strokeWidth={3} />
                              </div>

                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                                  Skill
                                </p>
                                {/* IF NO SKILLS */}
                                {(!c.skills || c.skills.length === 0) && (
                                  <span className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">
                                    Not Specified
                                  </span>
                                )}

                                {/* SKILL MAPPING */}
                                {(showAllSkills
                                  ? c.skills
                                  : (c.skills || []).slice(0, 6)
                                ).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded text-[9px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default"
                                  >
                                    {skill}
                                  </span>
                                ))}

                                {/* TOGGLE BUTTON */}
                                {(c.skills || []).length > 6 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAllSkills(!showAllSkills);
                                    }}
                                    className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-900 transition-all active:scale-90"
                                  >
                                    {showAllSkills
                                      ? "Show Less"
                                      : `+${(c.skills || []).length - 6} More`}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM SECTION: SYNC DATA & OPERATIONS (Right Aligned) */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 ml-14">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Phone
                              size={15}
                              className={`${isRevealedForThisVacancy(c) ? "text-blue-600" : "text-slate-400"}`}
                            />
                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest">
                              {isRevealedForThisVacancy(c) ? (
                                // c.phone || "No Data"
                                c.phone ? (
                                  `+91 ${c.phone}`
                                ) : (
                                  "No Data"
                                )
                              ) : (
                                <span className="text-slate-300 tracking-[0.2em]">
                                  +91 ••••••••••
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* ACTION STACK: ANCHORED BOTTOM RIGHT */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {/* NEW: DECISION DROPDOWN */}

                          {isRevealedForThisVacancy(c) && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                setDecisionCandidate(c);
                                setDecisionData({
                                  status: "",
                                  remark: "",
                                  follow_up_date: "",
                                  follow_up_time: "",
                                });

                                // 🎯 TRIGGER HISTORY FETCH
                                setLoadingHistory(true);
                                try {
                                  const vId = new URLSearchParams(
                                    location.search,
                                  ).get("vacancy_id");
                                  const res = await fetch(
                                    `https://apihrr.goelectronix.co.in/follow-ups/${c.id}?vacancy_id=${vId}`,
                                  );
                                  const result = await res.json();
                                  const historyData = result.data || [];
                                  setFollowUpHistory(historyData || []);

                                   // 🎯 PRE-FILL LOGIC: Get the latest action type from history
      const latestAction = historyData.length > 0 ? historyData[0].action_type : "";

      setDecisionData({ 
        status: latestAction, // ✅ Prefills the dropdown
        remark: "", // Usually keep remark empty for new interaction
        follow_up_date: "", 
        follow_up_time: "" 
      })
                                } catch (err) {
                                  console.error("History sync failed", err);
                                } finally {
                                  setLoadingHistory(false);
                                }
                              }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 animate-in fade-in zoom-in-95 duration-300"
                            >
                              <Gavel size={14} /> Follow Up
                            </button>
                          )}

                          {!isRevealedForThisVacancy(c) ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // toggleNumberReveal(c.id);
                                toggleNumberReveal(c);
                              }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
                            >
                              <UserCheck size={14} strokeWidth={3} /> View
                              Number
                            </button>
                          ) : (
                            /* Optional: Show a "Linked" badge instead of a button for better UX */
                            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                              <CheckCircle2
                                size={12}
                                className="text-emerald-500"
                              />
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">
                                Viewed Number
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => navigate(`/profile/${c.id}`)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 !bg-white border border-blue-600 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                          >
                            <Eye size={14} /> View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              /* --- EMPTY DATA UI --- */
              <div className="py-32 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[3rem] shadow-inner">
                <Database size={48} className="text-slate-100 mb-4" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  No Candidates Found
                </p>
              </div>
            )}
          </div>

          {/* --- 3. SLIDING WINDOW PAGINATION CONTROLLER --- */}
          {Math.ceil(filteredCandidates.length / 10) > 1 && (
            <div className="bg-white px-10 py-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Records {(currentPage - 1) * 10 + 1} —{" "}
                  {Math.min(currentPage * 10, filteredCandidates.length)} of{" "}
                  {filteredCandidates.length}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* PREVIOUS BUTTON */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-3 !bg-white border !border-slate-200 rounded-2xl !text-slate-400 hover:!text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
                >
                  <ChevronLeft size={18} strokeWidth={3} />
                </button>

                {/* DYNAMIC PAGE NODES */}
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-inner">
                  {getPaginationRange().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="w-8 text-center text-slate-400 font-black text-[10px] tracking-widest"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 w-10 rounded-xl text-[10px] font-black !bg-transparent uppercase transition-all ${
                          currentPage === page
                            ? "!bg-white !text-blue-600 shadow-lg"
                            : "!text-slate-400 hover:!bg-white hover:!text-slate-900"
                        }`}
                      >
                        {String(page).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>

                {/* NEXT BUTTON */}
                <button
                  disabled={
                    currentPage === Math.ceil(filteredCandidates.length / 10)
                  }
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
                >
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 🔵 VIEW B: FOLLOW UP QUEUE (Shows when Today/Future/Pending/Reject is clicked) */
        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500 w-full mb-4">
          {/* Registry Header Logic */}
          <div className="flex items-center justify-between px-6 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
                {followUpVariation.replace("_", " ")} Queue
              </h3>
            </div>
            <button
              onClick={() => setFollowUpVariation(null)}
              className="text-[9px] font-black !text-blue-600 hover:text-slate-900 uppercase !bg-transparent tracking-widest transition-colors flex items-center gap-2"
            >
              <XCircle size={14} /> Close View
            </button>
          </div>

          {/* Loader & Data Mapping */}
          {isFollowUpLoading ? (
            <div className="bg-white p-16 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-4 shadow-sm">
              <Loader2 className="animate-spin text-blue-600" size={28} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Fetching the Follow Up Data...
              </p>
            </div>
          ) : followUpData.length > 0 ? (
            followUpData.map((item) => (
              <div
                key={item.id}
                className="!bg-white border !border-slate-200 rounded-2xl p-5  flex items-center justify-between hover:!border-blue-400 hover:shadow-md transition-all group"
              >
                {/* 1. CANDIDATE IDENTITY NODE */}
                <div className="flex items-center gap-4 w-[15%]">
                  <div className="h-11 w-11 rounded-xl !bg-white flex items-center justify-center !text-blue-500 text-sm font-black uppercase ring-2 ring-slate-50 shadow-md group-hover:bg-blue-600 transition-colors">
                    {item.candidate?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Candidate
                    </span>
                    <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight truncate">
                      {item.candidate?.full_name || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* 2. INDUSTRY / AREA NODE */}
                {/* 2. INDUSTRY / AREA NODE */}
                <div className="flex items-center gap-4 w-[14%] border-l border-slate-100 pl-8">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 transition-colors">
                    <MapPin size={16} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Area / Sector
                    </span>
                    <p
                      className="text-[12px] font-bold text-slate-700 uppercase tracking-tight truncate"
                      title={[
                        item.candidate?.city,
                        item.candidate?.district,
                        item.candidate?.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    >
                      {/* 🎯 LOGIC: Filter out null/undefined/empty strings, then join with comma */}
                      {[
                        item.candidate?.city,
                        item.candidate?.district,
                        item.candidate?.state,
                      ]
                        .filter(
                          (val) => val && val !== "undefined" && val !== "null",
                        )
                        .join(", ") || "Not Specified"}
                    </p>
                  </div>
                </div>

                {/* 3. VACANCY CONTEXT NODE */}
                {/* 4. CONTACT NODE (PHONE) */}
                <div className="flex items-center gap-4 w-[18%] border-l border-slate-100 pl-8">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Phone size={16} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black whitespace-nowrap text-slate-400 uppercase tracking-widest block mb-1">
                      Contact Number
                    </span>
                    <p className="text-[12px] font-black text-slate-900 tracking-widest">
                      {item.candidate?.phone ? (
                        <>
                          <span className="text-slate-400 font-bold mr-1">
                            +91
                          </span>
                          {item.candidate.phone}
                        </>
                      ) : (
                        <span className="text-slate-300 italic font-bold">
                          Node Empty
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* 5. PROCESS NODE (ACTION & STATUS) */}
                <div className="flex items-center gap-4 w-[14%] border-l border-slate-100 pl-8">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Activity size={16} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Process State
                    </span>
                    <div className="flex flex-col gap-1">
                      {/* 🎯 ACTION TYPE: e.g., Schedule Interaction */}
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">
                        {item.action_type
                          ? item.action_type.replace(/_/g, " ")
                          : "No Action"}
                      </p>

                      {followUpVariation === "pending" && (
                        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-300">
                          {(() => {
                            const rawStatus = item.status?.toLowerCase();
                            const isOverdue = rawStatus === "overdue";

                            // Visual Config for Overdue vs Standard Pending
                            let dotClass = "bg-orange-400";
                            let textClass = "text-orange-500";

                            if (isOverdue) {
                              dotClass =
                                "bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]";
                              textClass = "text-rose-600";
                            }

                            return (
                              <>
                                <div
                                  className={`h-1.5 w-1.5 rounded-full animate-pulse ${dotClass}`}
                                />
                                <span
                                  className={`text-[9px] font-black uppercase tracking-widest ${textClass}`}
                                >
                                  Pending
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 6. TEMPORAL NODE (CREATED AT) */}
                <div className="flex items-center gap-4 w-[14%] border-l border-slate-100 pl-8">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                    <Calendar size={16} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Created Date
                    </span>
                    <div className="flex flex-col">
                      {/* 🎯 DATE: DD-MM-YYYY */}
                      <p className="text-[11px] font-black text-slate-900 leading-none">
                        {new Date(item.created_at)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </p>

                      {/* 🎯 TIME: HH:MM AM/PM */}
                      <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">
                        {new Date(item.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 🕒 7. TEMPORAL NODE (SCHEDULED AT) */}
<div className="flex items-center gap-4 w-[15%] border-l border-slate-100 pl-8">
  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
    <Clock size={16} strokeWidth={2.5} />
  </div>
  <div className="min-w-0">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
      Scheduled Date
    </span>
    <div className="flex flex-col leading-tight">
      {/* 📅 DATE: DD-MM-YYYY extracted from scheduled_at */}
      <p className="text-[11px] font-black text-slate-900 leading-none">
        {item.scheduled_at 
          ? new Date(item.scheduled_at).toLocaleDateString('en-GB').replace(/\//g, '-') 
          : "Not Set"}
      </p>
      
      {/* 🕒 TIME: HH:MM AM/PM */}
      <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">
        {item.scheduled_at 
          ? new Date(item.scheduled_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            }) 
          : "--:--"}
      </p>
    </div>
  </div>
</div>

                {/* ACTION NAVIGATION */}

                <button
                  onClick={async (e) => {
                    e.stopPropagation();

                    // 1. BRIDGE DATA: Convert Queue structure to Decision Modal structure
                    const candidateContext = {
                      ...item.candidate,
                      full_name: item.candidate?.full_name,
                      id: item.candidate?.id,
                    };

                    // 2. SET MODAL CONTEXT
                    setDecisionCandidate(candidateContext);
                    setDecisionData({
                      status: item.action_type || "",
                      remark: item.remark || "",
                      follow_up_date: "",
                      follow_up_time: "",
                    });

                    // 3. TRIGGER HISTORY FETCH
                    setLoadingHistory(true);
                    try {
                      const vId =
                        new URLSearchParams(location.search).get(
                          "vacancy_id",
                        ) || "36";
                      const res = await fetch(
                        `https://apihrr.goelectronix.co.in/follow-ups/${item.candidate.id}?vacancy_id=${vId}`,
                      );
                      const result = await res.json();
                      setFollowUpHistory(result.data || []);
                    } catch (err) {
                      console.error("History sync failed", err);
                    } finally {
                      setLoadingHistory(false);
                    }
                  }}
                  className="p-2.5 hover:bg-blue-600 hover:text-white text-slate-400 rounded-xl transition-all active:scale-95 bg-slate-50 border border-slate-100 shadow-sm"
                >
                  <Pencil size={18} strokeWidth={2.5} />
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center opacity-60">
              <Database size={40} className="text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                No Active Records for this variation
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- ENTERPRISE POPUP PREVIEW --- */}

      {selectedCandidate && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setSelectedCandidate(null)}
          />

          <div className="relative bg-white w-full max-w-7xl h-[92vh] rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* 1. HEADER - Enhanced with more actions */}
            <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-lg font-black text-white shadow-lg">
                  {getInitials(selectedCandidate?.name)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {selectedCandidate.name}
                    </h3>
                    <span
                      className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
                    >
                      {selectedCandidate.source}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Application ID: #TR-{selectedCandidate.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSingleMailCandidate(selectedCandidate);

                    // 🎯 PRE-FILL LOGIC: Individual View
                    if (vacancyDetail?.job_description?.id) {
                      setSelectedTemplate(
                        vacancyDetail.job_description.id.toString(),
                      );
                    } else {
                      setSelectedTemplate("");
                    }

                    setIsMailModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  <Send size={14} /> Shoot Mail
                </button>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* 2. SPLIT CONTENT AREA */}
            <div className="flex-1 flex overflow-hidden">
              {/* LEFT PANEL: Detailed Information (Scrollable) */}
              <div className="w-[680px] border-r border-slate-100 bg-white overflow-y-auto custom-scrollbar flex flex-col">
                <div className="p-8 space-y-10">
                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-1">
                      Contact Intelligence
                    </h4>
                    <div className="grid gap-3">
                      <InfoCard
                        icon={<Mail size={14} />}
                        label="Primary Email"
                        value={selectedCandidate.email}
                      />
                      <InfoCard
                        icon={<Phone size={14} />}
                        label="Phone Number"
                        value={selectedCandidate.phone}
                      />
                      <InfoCard
                        icon={<MapPin size={14} />}
                        label="Current Location"
                        value={selectedCandidate.location}
                      />
                    </div>
                  </div>

                  {/* Professional Background Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] px-1">
                      Experience & Education
                    </h4>
                    <div className="grid gap-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                          Current Position
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedCandidate.position}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                            Experience
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            {selectedCandidate.exp} Years
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                            Education
                          </p>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">
                            {selectedCandidate.education}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Manager Notes / Shared Status */}
                </div>
              </div>

              {/* RIGHT PANEL: Document Workspace */}
              <div className="flex-1 bg-slate-100/50 overflow-hidden flex flex-col">
                {/* 1. Integrated Workspace Toolbar */}
                <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">
                        Professional_Curriculum_Vitae.pdf
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 block">
                        Standardized PDF Document • 1.2 MB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                      <Printer size={14} /> Print
                    </button>
                    <div className="h-4 w-px bg-slate-200 mx-2" />
                    {/* Link to open in a completely new tab for true "Full Screen" */}
                    <a
                      href={selectedCandidate.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all tooltip"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

                {/* 2. FULL SCREEN IFRAME CONTAINER */}
                <div className="flex-1 relative w-full h-full bg-white">
                  {selectedCandidate.cvUrl ? (
                    <iframe
                      src={`${selectedCandidate.cvUrl}#page=1&zoom=page-fit&view=FitV&toolbar=0&navpanes=0&scrollbar=1`}
                      className="absolute inset-0 w-full h-full border-none bg-white"
                      title="Resume Viewer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      {/* Empty State UI */}
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-4 shadow-xl">
                        <FileWarning size={40} />
                      </div>
                      <h5 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                        Preview Unavailable
                      </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. FOOTER: Application Health */}
            <div className="px-10 py-5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    AI Match Score: 92%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Identity Verified
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg">
                  Advance Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ENTRY MODAL (EXISITING) */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            // onClick={() => setIsModalOpen(false)}
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* 1. STICKY HEADER */}
            <div className="shrink-0 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  New Candidate
                </h3>
                <p className="text-[10px] font-black text-slate-600 uppercase mt-1 tracking-widest flex items-center gap-2">
                  Manual Record Entry
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-slate-600 normal-case font-bold italic">
                    Fields marked (*) are required
                  </span>
                </p>
              </div>
              <button
                // onClick={() => setIsModalOpen(false)}
                onClick={closeModal}
                className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
              <form
                id="candidate-form"
                onSubmit={handleManualEntry}
                className="space-y-6"
              >
                {/* Section: Identity */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-5">
                    <InputField
                      label="Full Name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      error={errors.name}
                      required
                      onChange={(v) => {
                        setFormData({ ...formData, name: v });
                        validateField("name", v);
                      }}
                    />
                    <InputField
                      label="Email Address"
                      placeholder="john@example.com"
                      type="email"
                      value={formData.email}
                      error={errors.email}
                      required
                      onChange={(v) => {
                        const email = v.trim();
                        setFormData({ ...formData, email });
                        validateField("email", email);
                      }}
                    />
                  </div>
                </div>

                {/* Section: Professional */}

                {/* Section: Contact */}
                <div className="grid grid-cols-2 gap-5">
                  <InputField
                    label="Phone Number"
                    placeholder="+91 00000 00000"
                    type="tel"
                    maxLength={10}
                    required
                    error={errors.phone}
                    value={formData.phone}
                    onChange={(v) => {
                      const digits = v.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, phone: digits });
                      validateField("phone", digits);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5"></div>

                <div className="grid grid-cols-2 gap-5">
                  <InputField
                    label="Pincode"
                    placeholder="e.g. 400701"
                    // required
                    value={formData.pincode}
                    error={errors.pincode}
                    onChange={(v) => {
                      const digits = v.replace(/\D/g, "").slice(0, 6);

                      setFormData((prev) => ({
                        ...prev,
                        pincode: digits,
                        state: "",
                        district: "",
                      }));

                      validateField("pincode", digits);

                      if (digits.length === 6) {
                        fetchPincodeDetails(digits);
                      }
                    }}
                  />

                  {/* DYNAMIC CITY/AREA FIELD */}
                  <div className="space-y-1.5">
                    <div className="flex gap-1 items-center ml-1">
                      <label className="text-[10px] !font-black text-slate-800 uppercase tracking-[0.15em]">
                        City
                      </label>
                    </div>

                    {isFetchingPincode ? (
                      /* LOADING STATE */
                      <div className="w-full px-4 py-3 rounded-xl text-xs font-bold bg-white border border-slate-500 text-slate-400 flex items-center gap-2">
                        <Loader2
                          size={14}
                          className="animate-spin text-blue-500"
                        />
                        <span className="uppercase tracking-widest text-[9px]">
                          Fetch Locations...
                        </span>
                      </div>
                    ) : cityOptions.length > 1 ? (
                      /* MULTIPLE DATA: DROPDOWN MODE */
                      <div className="relative group">
                        <select
                          value={formData.city}
                          onChange={(e) => {
                            const selected = cityOptions.find(
                              (c) => c.Name === e.target.value,
                            );
                            setFormData((prev) => ({
                              ...prev,
                              city: selected.Name,
                              district: selected.District,
                              state: selected.State,
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-xl text-xs font-bold outline-none transition-all bg-white border-2 border-blue-100 focus:border-blue-500 appearance-none cursor-pointer shadow-sm shadow-blue-50"
                        >
                          {cityOptions.map((opt, idx) => (
                            <option key={idx} value={opt.Name}>
                              {opt.Name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none group-hover:scale-110 transition-transform"
                        />
                      </div>
                    ) : (
                      /* SINGLE DATA: STANDARD INPUT MODE */
                      <input
                        readOnly
                        value={formData.city || ""}
                        placeholder="Auto-filled"
                        className="w-full px-4 py-3 rounded-xl text-xs font-bold outline-none bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed"
                      />
                    )}

                    {errors.city && (
                      <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <InputField
                    label="State"
                    // value={formData.state}
                    value={
                      isFetchingPincode
                        ? "Fetching location..."
                        : formData.state
                    }
                    placeholder="Auto-filled"
                    onChange={() => {}}
                  />

                  <InputField
                    label="District"
                    // value={formData.district}
                    value={
                      isFetchingPincode ? "Please wait..." : formData.district
                    }
                    placeholder="Auto-filled"
                    onChange={() => {}}
                  />
                </div>

                <InputField
                  label="Country"
                  // value={formData.country}
                  value={isFetchingPincode ? "Loading..." : formData.country}
                  onChange={() => {}}
                />

                {/* DOCUMENT UPLOAD SECTION */}
              </form>
            </div>

            {/* 3. STICKY FOOTER */}
            <div className="shrink-0 px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                type="button"
                // onClick={() => setIsModalOpen(false)}
                onClick={closeModal}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
              <button
                form="candidate-form" // Connects to the form ID inside scrollable area
                type="submit"
                disabled={loading || isFormInvalid}
                className="flex-2 px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Check size={16} strokeWidth={3} />
                    Finalize & Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {decisionCandidate && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDecisionCandidate(null)}
          />

          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            {/* --- STICKY HEADER --- */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Follow Up
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {decisionCandidate.full_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDecisionCandidate(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* --- MASTER CONTENT GRID (Fixed Height) --- */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden h-[550px]">
              {/* 🟢 LEFT SIDE: UPDATE FORM (Fixed/Scrollable independently) */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar border-r border-slate-100 bg-white">
                

                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Follow Type
                  </label>
                  <div className="relative group">
                    {/* --- UPDATED SELECT PROTOCOL --- */}
                    <select
                      value={decisionData.status}
                      disabled={isInteractionLocked}
                      onChange={(e) =>
                        setDecisionData({
                          ...decisionData,
                          status: e.target.value,
                        })
                      }
                      // className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 uppercase outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                      className={`w-full pl-4 pr-10 py-4 border rounded-2xl text-xs font-black text-slate-700 uppercase outline-none appearance-none transition-all ${
    isInteractionLocked
      ? "!bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
      : "bg-slate-50 border-slate-200 focus:border-blue-600 cursor-pointer shadow-inner"
  }`}
                    >
                      <option value="">Select Protocol</option>
                      {/* 🎯 Exact Backend Enum Values */}
                      <option value="schedule_interaction">
                        📞 Call For Interview
                      </option>
                      <option value="call_not_connected">
                        🚫 Not Connected
                      </option>
                      <option value="reschedule">🔄 Reschedule</option>
                      <option value="reject">❌ Reject</option>
                      <option value="visited">🏁 Visited</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                {/* Conditional Date/Time */}
                {[
                  "schedule_interaction",
                  "call_not_connected",
                  "reschedule",
                ].includes(decisionData.status) && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Date
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className={`${inputClass} !bg-white border-blue-100 focus:border-blue-600`}
                        value={decisionData.follow_up_date}
                        onChange={(e) =>
                          setDecisionData({
                            ...decisionData,
                            follow_up_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Time
                      </label>
                      <input
                        type="time"
                        className={`${inputClass} !bg-white border-blue-100 focus:border-blue-600`}
                        value={decisionData.follow_up_time}
                        onChange={(e) =>
                          setDecisionData({
                            ...decisionData,
                            follow_up_time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Current Remarks
                  </label>
                  <textarea
                    rows={4}
                    disabled={isInteractionLocked}
                    placeholder="Type current call interaction details..."
                    // className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all resize-none shadow-inner"
                    className={`w-full px-5 py-4 border rounded-2xl text-[13px] font-bold outline-none transition-all resize-none shadow-inner ${
    isInteractionLocked
      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
      : "bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-600"
  }`}
                    value={decisionData.remark}
                    onChange={(e) =>
                      setDecisionData({
                        ...decisionData,
                        remark: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* 🔵 RIGHT SIDE: REGISTRY HISTORY (DYNAMIC) */}
              <div className="bg-slate-50/50 p-8 flex flex-col h-[400px] overflow-scroll">
                <div className="flex items-center justify-between mb-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 border border-slate-100">
                      <Clock size={16} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                      History Logs
                    </h4>
                  </div>
                  <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md uppercase border border-blue-200 shadow-sm">
                    {followUpHistory.length} Follow Up 
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {loadingHistory ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                      <Loader2 className="animate-spin mb-2" size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        Syncing...
                      </span>
                    </div>
                  ) : followUpHistory.length > 0 ? (
                    <div className="pl-2 space-y-10 relative border-l-2 border-slate-200 ml-2 py-4">
                      {followUpHistory.map((item, idx) => {
                        const config =
                          actionMapping[item.action_type] ||
                          actionMapping.schedule_interaction;

                        // 🕒 Temporal Node Parsing
                        const scheduledDate = new Date(item.scheduled_at);
                        const createdDate = new Date(item.created_at);

                        return (
                          <div
                            key={item.id}
                            className="relative pl-8 animate-in fade-in slide-in-from-left-3 duration-700"
                          >
                            {/* Timeline Connector Dot */}
                            <div
                              className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full ${config.bg} border-4 border-white shadow-md flex items-center justify-center ${config.color} z-10`}
                            >
                              {config.icon}
                            </div>

                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}
                                >
                                  {config.label}
                                </span>
                                {/* Main Display: Scheduled Date Badge */}
                              </div>

                              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm group/card relative overflow-hidden">
                                {/* TOP STRIP: Actor & Scheduled Time Details */}
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-50">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
                                    By:{" "}
                                    <span className="text-slate-900">
                                      {item.performed_by}
                                    </span>
                                  </span>
                                  <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100">
                                    <Clock size={10} strokeWidth={3} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">
                                      {scheduledDate.toLocaleDateString(
                                        "en-GB",
                                        { day: "2-digit", month: "short" },
                                      )}{" "}
                                      •{" "}
                                      {scheduledDate.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>

                                {/* REMARK CONTENT */}
                                <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                                  "{item.remark}"
                                </p>

                                {/* BOTTOM STRIP: Systematic Created At Timestamp */}
                                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                    Created At:{" "}
                                    {createdDate.toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                    })}{" "}
                                    |{" "}
                                    {createdDate.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>

                                {/* Side Indicator Line */}
                                <div
                                  className={`absolute right-0 top-0 bottom-0 w-1 ${config.color.replace("text", "bg")}`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                      <Activity size={32} strokeWidth={1} className="mb-2" />
                      <p className="text-[9px] font-black uppercase tracking-widest">
                        No Interaction History
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- STICKY FOOTER: ACTION PROTOCOL --- */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3 shrink-0">
              {/* 2. VISIT BUTTON: 🎯 Only show if action_type "visited" exists in history */}
              {/* {(decisionData.status === "visited" || isLatestInteractionVisited) && (
               

<button
  disabled={loading}
  onClick={async () => {
    const currentStatus = decisionData.status;

    // 🛡️ 1. Logic for "Visited" (Requires API validation first)
    if (currentStatus === "visited") {
      const isSuccess = await executeFollowUpProtocol();
      if (!isSuccess) return; // 🛑 Stop if API says candidate is already interviewing
      
      // ✅ If Success, proceed to open modal
      setCandidate(decisionCandidate); 
      setDecisionCandidate(null); 
      setIsNextRoundModalOpen(true); 
      return;
    }

    // 🛡️ 2. Logic for "Schedule Interaction" (Open modal directly or after API)
    if (currentStatus === "schedule_interaction") {
       await executeFollowUpProtocol(); // Log the call first
       setCandidate(decisionCandidate); 
       setDecisionCandidate(null); 
       setIsNextRoundModalOpen(true);
       return;
    }

    // 🛡️ 3. For all other statuses (Reject, Not Connected, Reschedule)
    // Just run the protocol and CLOSE the modal, do NOT open the Scheduler
    const isSuccess = await executeFollowUpProtocol();
    if (isSuccess) {
      setDecisionCandidate(null);
    }
  }}
  className="px-8 py-3 !bg-blue-600 border border-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
>
  {loading ? (
    <Loader2 size={14} className="animate-spin" />
  ) : (
    <>
      <ExternalLink size={14} strokeWidth={3} /> 
     Confirm & Schedule Interview
    </>
  )}
</button>
              )} */}

              {/* --- STICKY FOOTER: ACTION PROTOCOL --- */}


  {/* 🚫 1. REJECTED STATE: Highest Priority */}
  { isLatestInteractionRejected ? (
    <div className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-100 rounded-xl animate-in slide-in-from-right-2 duration-500">
      <XCircle size={14} className="text-red-500" />
      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">
        Candidate Rejected
      </span>
    </div>
  ) : (decisionData.status === "visited" || isLatestInteractionVisited) ? (
    /* 🏁 2. VISITED STATE: Show Badge + Scheduling Button */
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-right-2 duration-500">
        <CheckCircle2 size={14} className="text-emerald-500" />
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
          Candidate Visited
        </span>
      </div>
      
      <button
        disabled={loading}
        onClick={async () => {
          const currentStatus = decisionData.status;
          if (currentStatus === "visited") {
            const isSuccess = await executeFollowUpProtocol();
            if (!isSuccess) return; 
          }
          setCandidate(decisionCandidate); 
          setDecisionCandidate(null); 
          setIsNextRoundModalOpen(true); 
        }}
        className="px-8 py-3 !bg-blue-600 border border-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            <ExternalLink size={14} strokeWidth={3} /> 
            Confirm & Schedule Interview
          </>
        )}
      </button>
    </div>
  ) : (
    /* 🚀 3. DEFAULT STATE: Show standard Follow Up button */
    <button
      disabled={loading || !decisionData.status}
      onClick={executeFollowUpProtocol}
      className={`px-8 py-3 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 animate-in fade-in zoom-in-95 duration-300 ${
        loading || !decisionData.status
          ? "!bg-slate-100 !border-slate-200 !text-slate-400 cursor-not-allowed"
          : "!bg-white !text-blue-600 !border-blue-700 hover:!bg-white"
      }`}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" /> Syncing...
        </>
      ) : (
        <>
          Follow Up <Check size={14} strokeWidth={4} />
        </>
      )}
    </button>
  )}


              {/* 2. VISIT NAVIGATION */}

              {/* 3. CONDITIONAL FOLLOW UP BUTTON */}
              {/* {(decisionData.status === "visited" || isLatestInteractionVisited) ? (
             
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-right-2 duration-500">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                    Candidate Visited
                  </span>
                </div>
              ) : (
             
                <button
                  disabled={loading || !decisionData.status}
                  onClick={executeFollowUpProtocol}
                  className={`px-8 py-3 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 animate-in fade-in zoom-in-95 duration-300 ${
                    loading || !decisionData.status
                      ? "!bg-slate-100 !border-slate-200 !text-slate-400 cursor-not-allowed"
                      : "!bg-white !text-blue-600 !border-blue-700 hover:!bg-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Syncing...
                    </>
                  ) : (
                    <>
                      Follow Up <Check size={14} strokeWidth={4} />
                    </>
                  )}
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}

      {/* --- ENTERPRISE SOURCE PROTOCOL MODAL --- */}
      {activeSourceModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setActiveSourceModal(null)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl ${activeSourceModal === "excel" ? "bg-emerald-500" : "bg-indigo-500"} text-white shadow-xl`}
                >
                  {activeSourceModal === "excel" ? (
                    <FileSpreadsheet size={24} />
                  ) : (
                    <Webhook size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    {activeSourceModal === "excel"
                      ? "Bulk Data Push"
                      : "API Endpoint Configuration"}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                    {activeSourceModal === "excel"
                      ? "Protocol: CSV / XLSX Source"
                      : "Protocol: Restful Webhook"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSourceModal(null)}
                className="p-3 hover:bg-white rounded-2xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              {activeSourceModal === "excel" ? (
                <>
                  {/* Dropzone Area */}
                  <div className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setExcelFile(file);
                      }}
                    />

                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
                      {/* <Download size={32} /> */}
                      <Upload size={32} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-2">
                      {excelFile ? excelFile.name : "No file selected"}
                    </p>

                    <p className="text-sm font-black text-slate-800 tracking-tight">
                      Deploy Spreadsheet File
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                      Max Payload: 25MB
                    </p>
                  </div>
                </>
              ) : (
                /* Webhook UI - Enterprise Entry Mode */
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Destination Endpoint
                      </label>
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Ready
                      </span>
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Webhook size={18} />
                      </div>
                      <input
                        type="text"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-api-endpoint.com/hooks"
                        className="w-full pl-12 pr-4 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm font-mono text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Connection Guidance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Method
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        POST Request
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Auth Type
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        Bearer Token
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                      <AlertCircle size={16} />
                    </div>
                    <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
                      Ensure your endpoint is configured to accept{" "}
                      <span className="underline">JSON payloads</span>. The
                      system will send a ping request to verify this URL upon
                      activation.
                    </p>
                  </div>
                </div>
              )}
              {/* --- PLACE THE NEW BUTTON CODE HERE --- */}

              {/* --- ACTION BUTTONS AREA --- */}
              <div className="flex flex-col items-center gap-4">
                {/* Primary Action Button */}
                <button
                  disabled={
                    isImporting || (activeSourceModal === "excel" && !excelFile)
                  }
                  className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
    ${
      activeSourceModal === "excel"
        ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
        : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
    }`}
                  onClick={() => {
                    if (activeSourceModal === "excel") {
                      handleExcelImport();
                    } else {
                      setIsTestingConnection(true);
                      setTimeout(() => {
                        setIsTestingConnection(false);
                        setActiveSourceModal(null);
                        toast.success("Webhook activated successfully 🚀");
                      }, 2000);
                    }
                  }}
                >
                  {isTestingConnection ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying Protocol...
                    </>
                  ) : activeSourceModal === "excel" ? (
                    "Begin Synchronized Ingestion"
                  ) : (
                    "Activate Webhook"
                  )}
                </button>

                {/* Secondary Download Button - Centered below */}
                {activeSourceModal === "excel" && (
                  <a
                    href="/documents/sampleexcel.zip"
                    download
                    className="group flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors py-2"
                  >
                    <Download
                      size={14}
                      className="group-hover:translate-y-0.5 transition-transform"
                    />
                    <span>Download Sample Schema Template</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isMailModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Backdrop with extreme glass effect */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={() => setIsMailModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
            {/* Header: Communication Hub */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shadow-blue-200">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                    Candidate Invitation
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Sending Job Description & Interview Invitation
                  </p>

                  <p className="text-[10px] font-bold text-blue-600 mt-1">
                    {singleMailCandidate
                      ? `Sending to: ${mailTargetName}`
                      : `Sending to: ${mailTargetCount} Candidate${mailTargetCount > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMailModalOpen(false)}
                className="p-2 hover:!bg-slate-200 !bg-slate-200 rounded-full transition-colors !text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Template Selector Section */}
              <div className="space-y-2">
                <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Select Source Template
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <FileText size={16} />
                  </div>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="">Manual Override (No Template)</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <Filter size={14} />
                  </div>
                </div>
              </div>

              {/* NEW: ADD TEMPLATE ACTION */}
              {/* <button
                onClick={() => navigate("/jobtemplate")} // Adjust this path to your actual route
                className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-tighter hover:text-blue-700 transition-colors group"
              >
                <PlusCircle size={12} strokeWidth={3} />
                Add New Template
              </button> */}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-50 flex gap-3">
              <button
                onClick={() => setIsMailModalOpen(false)}
                className="px-6 py-3 border border-slate-200 !bg-slate-200 hover:!bg-slate-200 !text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Abort
              </button>

              <button
                // onClick={handleSendJD}
                onClick={
                  singleMailCandidate ? handlesingleSendJD : handleSendJD
                }
                className="flex-1 !bg-white hover:!bg-white !text-blue-500 py-3 rounded-xl border border-blue-500 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 group"
              >
                Execute Transmission
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {followUpUpdateTarget && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Glass Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setFollowUpUpdateTarget(null)}
          />

          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* HEADER: Shows the Candidate (Parent) Name */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <ClipboardClock size={20} />
                </div>
                <div>
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-0.5">
                    Protocol Update
                  </span>
                  {/* 🎯 DISPLAY PARENT NAME HERE */}
                  <h3 className="text-sm font-black text-slate-900 uppercase truncate max-w-[200px]">
                    {followUpUpdateTarget.candidate?.full_name ||
                      "Unknown Identity"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setFollowUpUpdateTarget(null)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={executeFollowUpUpdate} className="p-8 space-y-6">
              {/* Status Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Follow Status
                </label>
                <div className="relative">
                  <select
                    value={updatePayload.status}
                    onChange={(e) =>
                      setUpdatePayload({
                        ...updatePayload,
                        status: e.target.value,
                      })
                    }
                    className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase text-slate-700 outline-none focus:border-blue-600 appearance-none transition-all cursor-pointer shadow-inner"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">🚫 Cancel</option>
                    <option value="visited">🚫 visited</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Remark Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Update Remark
                </label>
                <textarea
                  rows={4}
                  value={updatePayload.remark}
                  onChange={(e) =>
                    setUpdatePayload({
                      ...updatePayload,
                      remark: e.target.value,
                    })
                  }
                  placeholder="Document interaction details..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFollowUpUpdateTarget(null)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-400 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isCommiting}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isCommiting ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  Sync Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* {isNextRoundModalOpen && (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
   
    <div
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => setIsNextRoundModalOpen(false)}
    />

    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
      

      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Call For Interview
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Scheduling for: <span className="text-blue-600">{candidate?.full_name}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsNextRoundModalOpen(false)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
        >
          <X size={22} />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
        <div className="grid grid-cols-2 gap-5">
          <InputField
            label="Interview Date"
            type="date"
            required
            value={nextRoundForm.date}
            onChange={(v) => setNextRoundForm({ ...nextRoundForm, date: v })}
          />
          <InputField
            label="Preferred Time"
            type="time"
            required
            value={nextRoundForm.time}
            onChange={(v) => setNextRoundForm({ ...nextRoundForm, time: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Mode</label>
            <select
              value={nextRoundForm.mode}
              onChange={(e) => setNextRoundForm({ ...nextRoundForm, mode: e.target.value })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-blue-600 outline-none appearance-none cursor-pointer"
            >
              <option value="online">Online Conference</option>
              <option value="offline">In-Person Office</option>
            </select>
          </div>
          <InputField
            label={nextRoundForm.mode === "online" ? "Meeting Link" : "Venue Details"}
            placeholder={nextRoundForm.mode === "online" ? "https://zoom.us/..." : "Boardroom A"}
            value={nextRoundForm.location}
            onChange={(v) => setNextRoundForm({ ...nextRoundForm, location: v })}
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
           <SectionHeader title="Assigned Panelist" />
           <div className="grid grid-cols-2 gap-5 mt-4">
              <InputField
                label="Interviewer Name"
                placeholder="Full Name"
                value={nextRoundForm.interviewerName}
                onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerName: v })}
              />
              <InputField
                label="Role / Designation"
                placeholder="e.g. Hiring Manager"
                value={nextRoundForm.interviewerRole}
                onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerRole: v })}
              />
           </div>
        </div>
      </div>


      <div className="p-8 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Automatic Calendar Sync Enabled
          </span>
        </div>
        <button
          onClick={handleCreateNextRound}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2"
        >
          Dispatch Invitation <Send size={14} />
        </button>
      </div>
    </div>
  </div>
)} */}


{/* {isNextRoundModalOpen && (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
    <div
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => setIsNextRoundModalOpen(false)}
    />

    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
    
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Call For Interview
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Scheduling for: <span className="text-blue-600">{candidate?.full_name}</span>
            </p>
          </div>
        </div>
        <button onClick={() => setIsNextRoundModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
          <X size={22} />
        </button>
      </div>

      

      <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
  
  
  {followUpHistory
    .filter(h => h.action_type === "schedule_interaction")
    .slice(0, 1)
    .map((log) => {
      const prevDate = new Date(log.scheduled_at);
      return (
        <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 mb-8 relative overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-700">
      
          <Clock className="absolute -right-4 -bottom-4 text-white/5 -rotate-12" size={100} />
          
          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Previous Scheduled Parameters</span>
            </div>

            <div className="grid grid-cols-2 gap-8">
            
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Interaction Date</span>
                  <p className="text-sm font-black text-white tracking-widest uppercase">
                    {prevDate.toLocaleDateString('en-GB').replace(/\//g, '-')}
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Interaction Time</span>
                  <p className="text-sm font-black text-blue-400 uppercase tracking-tighter">
                    {prevDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>

              <div className="border-l border-white/10 pl-6 flex flex-col justify-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Internal Remark</span>
                <p className="text-xs font-bold text-slate-300 leading-relaxed italic line-clamp-3">
                  "{log.remark}"
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    })}


  <div className="space-y-6">
    <SectionHeader title="Define New Timeline" />
    <div className="grid grid-cols-2 gap-5 mt-4">
      <InputField
    label="New Interview Date"
    type="date"
    required
    value={nextRoundForm.date} // ✅ This will now show the pre-filled date
    onChange={(v) => setNextRoundForm({ ...nextRoundForm, date: v })}
  />
  <InputField
    label="New Preferred Time"
    type="time"
    required
    value={nextRoundForm.time} // ✅ This will now show the pre-filled time
    onChange={(v) => setNextRoundForm({ ...nextRoundForm, time: v })}
  />
    </div>

    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Mode</label>
        <select
          value={nextRoundForm.mode}
          onChange={(e) => setNextRoundForm({ ...nextRoundForm, mode: e.target.value })}
          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-blue-600 outline-none appearance-none cursor-pointer shadow-inner"
        >
          <option value="online">Online Conference</option>
          <option value="offline">In-Person Office</option>
        </select>
      </div>
      <InputField
        label={nextRoundForm.mode === "online" ? "Meeting Link" : "Venue Details"}
        placeholder={nextRoundForm.mode === "online" ? "https://zoom.us/..." : "Boardroom A"}
        value={nextRoundForm.location}
        onChange={(v) => setNextRoundForm({ ...nextRoundForm, location: v })}
      />
    </div>

    <div className="pt-4 border-t border-slate-100">
       <SectionHeader title="Assigned Panelist" />
       <div className="grid grid-cols-2 gap-5 mt-4">
          <InputField
            label="Interviewer Name"
            placeholder="Full Name"
            value={nextRoundForm.interviewerName}
            onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerName: v })}
          />
          <InputField
            label="Role / Designation"
            placeholder="e.g. Hiring Manager"
            value={nextRoundForm.interviewerRole}
            onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerRole: v })}
          />
       </div>
    </div>
  </div>
</div>

   
      <div className="p-8 bg-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Automatic Calendar Sync Enabled
          </span>
        </div>
        <button
          onClick={handleCreateNextRound}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2"
        >
          Dispatch Invitation <Send size={14} />
        </button>
      </div>
    </div>
  </div>
)} */}


{/* --- NEXT ROUND SCHEDULING MODAL --- */}
      {isNextRoundModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsNextRoundModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><CalendarIcon size={24} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Call For Interview</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Scheduling for: <span className="text-blue-600">{candidate?.full_name}</span></p>
                </div>
              </div>
              <button onClick={() => setIsNextRoundModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={22} /></button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {/* 📋 PREVIOUS LOGISTICS INSIGHT */}
              {followUpHistory.filter(h => h.action_type === "schedule_interaction").slice(0, 1).map((log) => {
                const prevDate = new Date(log.scheduled_at);
                return (
                  // <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 mb-8 relative overflow-hidden shadow-2xl">
                  //   <Clock className="absolute -right-4 -bottom-4 text-white/5 -rotate-12" size={100} />
                  //   <div className="relative z-10 flex flex-col gap-5">
                  //     <div className="flex items-center gap-2">
                  //       <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  //       <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Previous Scheduled Parameters</span>
                  //     </div>
                  //     <div className="grid grid-cols-2 gap-8">
                  //       <div className="space-y-3">
                  //         <div className="flex flex-col">
                  //           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Interaction Date</span>
                  //           <p className="text-sm font-black text-white tracking-widest uppercase">{prevDate.toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
                  //         </div>
                  //         <div className="flex flex-col">
                  //           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Interaction Time</span>
                  //           <p className="text-sm font-black text-blue-400 uppercase tracking-tighter">{prevDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  //         </div>
                  //       </div>
                  //       <div className="border-l border-white/10 pl-6 flex flex-col justify-center">
                  //         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Internal Remark</span>
                  //         <p className="text-xs font-bold text-slate-300 leading-relaxed italic line-clamp-3">"{log.remark}"</p>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                  <></>
                );
              })}

              <div className="space-y-6">
                <SectionHeader title="Define New Timeline" />
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <InputField label="New Interview Date" type="date" required value={nextRoundForm.date} onChange={(v) => setNextRoundForm({ ...nextRoundForm, date: v })} />
                  <InputField label="New Preferred Time" type="time" required value={nextRoundForm.time} onChange={(v) => setNextRoundForm({ ...nextRoundForm, time: v })} />
                </div>

                {/* 🔄 TABS: INTERVIEW MODE */}
                {/* <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Deployment Mode</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                      <button onClick={() => setNextRoundForm({ ...nextRoundForm, mode: "online", location: "" })} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${nextRoundForm.mode === "online" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>Online</button>
                      <button onClick={() => setNextRoundForm({ ...nextRoundForm, mode: "offline" })} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${nextRoundForm.mode === "offline" ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>In-Person</button>
                    </div>
                  </div>
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <InputField
                      label={nextRoundForm.mode === "online" ? "Meeting Link" : "Office Address"}
                      placeholder={nextRoundForm.mode === "online" ? "https://meet.google.com/..." : "Loading office address..."}
                      icon={nextRoundForm.mode === "online" ? <Globe size={14} /> : <MapPin size={14} />}
                      value={nextRoundForm.location}
                      onChange={(v) => setNextRoundForm({ ...nextRoundForm, location: v })}
                    />
                  </div>
                </div> */}

                {/* --- 🔄 TABS: INTERVIEW MODE --- */}
<div className="space-y-4 pt-4 border-t border-slate-100">
  <div className="flex items-center justify-between mb-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      Interview Time
    </label>
    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
      {/* 🌐 ONLINE TAB */}
      <button 
        onClick={() => setNextRoundForm({ ...nextRoundForm, mode: "online", location: "" })} 
        className={`px-6 py-2 rounded-lg text-[10px] font-black !bg-transparent uppercase tracking-widest transition-all ${nextRoundForm.mode === "online" ? "!bg-white !text-blue-600 shadow-md" : "!text-slate-400 hover:!text-slate-600"}`}
      >
        Online
      </button>

      {/* 🏢 IN-PERSON TAB (Calls API on Click) */}
      <button 
        onClick={() => {
          setNextRoundForm({ ...nextRoundForm, mode: "offline" });
          fetchCompanyAddress(); // 🔥 Trigger the Company API
        }} 
        className={`px-6 py-2 rounded-lg text-[10px] font-black !bg-transparent uppercase tracking-widest transition-all ${nextRoundForm.mode === "offline" ? "!bg-white !text-blue-600 shadow-md" : "!text-slate-400 hover:!text-slate-600"}`}
      >
        In-Person
      </button>
    </div>
  </div>

  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
    <InputField
      label={nextRoundForm.mode === "online" ? "Digital Meeting Link" : "Office Facility Address"}
      placeholder={nextRoundForm.mode === "online" ? "https://meet.google.com/..." : "Fetching HQ Address..."}
      icon={nextRoundForm.mode === "online" ? <Globe size={14} /> : <MapPin size={14} />}
      value={nextRoundForm.location}
      onChange={(v) => setNextRoundForm({ ...nextRoundForm, location: v })}
    />
  </div>
</div>

                {/* <div className="pt-4 border-t border-slate-100">
                  <SectionHeader title="Assigned Panelist" />
                  <div className="grid grid-cols-2 gap-5 mt-4">
                    <InputField label="Interviewer Name" placeholder="Full Name" value={nextRoundForm.interviewerName} onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerName: v })} />
                    <InputField label="Role / Designation" placeholder="e.g. Hiring Manager" value={nextRoundForm.interviewerRole} onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerRole: v })} />
                    <div className="mt-5">
    <InputField 
      label="Interviewer Email" 
      type="email"
      placeholder="interviewer@company.com" 
      value={nextRoundForm.interviewerEmail} 
      onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerEmail: v })} 
    />
  </div>
                  </div>
                </div> */}

                <div className="pt-4 border-t border-slate-100">
  {/* <SectionHeader title="Assigned Panelist" /> */}
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1 relative">
    {/* 🔍 SEARCHABLE EMPLOYEE DROPDOWN */}
    <div className="space-y-2 relative">
      <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
        Interviewer Name
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search confirmed employees..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold focus:bg-white focus:border-blue-600 outline-none transition-all"
          value={nextRoundForm.interviewerName || employeeSearch}
          onFocus={() => setShowEmployeeDropdown(true)}
          onChange={(e) => {
            setEmployeeSearch(e.target.value);
            setNextRoundForm({...nextRoundForm, interviewerName: e.target.value});
          }}
        />
        
        {/* DROPDOWN MENU */}
        {showEmployeeDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[500] max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            {isFetchingEmployees ? (
              <div className="p-4 text-center"><Loader2 className="animate-spin inline mr-2" size={16}/> <span className="text-[10px] font-bold uppercase text-slate-400">Syncing Registry...</span></div>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => {
                    setNextRoundForm({
                      ...nextRoundForm,
                      interviewerName: emp.full_name,
                      interviewerRole: emp.role || "Panelist",
                      interviewerEmail: emp.email || ""
                    });
                    setEmployeeSearch(emp.name);
                    setShowEmployeeDropdown(false);
                  }}
                  className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors group"
                >
                  <p className="text-[12px] font-black text-slate-800 uppercase group-hover:text-blue-600">{emp.full_name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role || 'No Role'}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-medium text-blue-500/70 lowercase">{emp.email}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase">No confirmed employees found</div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* DESIGNATION FIELD (Auto-filled) */}
   <div className="animate-in fade-in duration-300" key={nextRoundForm.interviewerRole}>
  <InputField 
    label="Role / Designation" 
    placeholder="e.g. Hiring Manager" 
    value={nextRoundForm.interviewerRole} 
    onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerRole: v })} 
  />
</div>
  </div>
  
  {/* EMAIL FIELD (Auto-filled) */}
  <div className="mt-5 animate-in fade-in duration-500">
    <InputField 
      label="Interviewer Email" 
      type="email"
      placeholder="interviewer@company.com" 
      value={nextRoundForm.interviewerEmail} 
      onChange={(v) => setNextRoundForm({ ...nextRoundForm, interviewerEmail: v })} 
    />
  </div>
</div>
              </div>
            </div>

            <div className="p-8 bg-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {/* <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" /> */}
                {/* <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auto Calendar Sync Enabled</span> */}
              </div>
              <button onClick={handleCreateNextRound} className="px-10 py-4 !bg-white !text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500 flex items-center gap-2">Confirm Interview <Send size={14} /></button>
            </div>
          </div>
        </div>
      )}


      {/* 🛡️ CONFLICT RESOLUTION MODAL */}
{/* 🛡️ CONFLICT RESOLUTION MODAL */}
{/* 🛡️ ENTERPRISE CONFLICT ALERT (SWEETALERT STYLE) */}
{/* {conflictData && (
  <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 animate-in fade-in duration-300">
 
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
    
    <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col items-center text-center p-8">
      
      
      <div className="mb-6 relative">
        <div className="h-20 w-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 animate-pulse">
          <ShieldAlert size={40} strokeWidth={1.5} />
        </div>
      
        <div className="absolute inset-0 h-20 w-20 border-2 border-blue-100 rounded-[2.5rem] animate-ping opacity-20" />
      </div>

      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
          already Scheduled
        </h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">
          Candidate <span className="text-blue-600 underline decoration-2 underline-offset-4">{conflictData.candidate_name}</span> is already Scheduled interview round.
        </p>
      </div>

     
      <div className="w-full space-y-3 mb-8">
    
        <div className="flex gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Session</span>
                <p className="text-[11px] font-black text-slate-700 uppercase leading-none">RD 0{conflictData.round_number}</p>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">State</span>
                <p className="text-[11px] font-black text-emerald-600 uppercase leading-none">{conflictData.status}</p>
            </div>
        </div>

      
        <div className="w-full bg-white border border-blue-600 rounded-2xl py-4 px-6 flex items-center justify-between   relative overflow-hidden group">
            <CalendarIcon className="absolute -right-2 -bottom-2 text-white/10 -rotate-12 transition-transform group-hover:scale-125" size={60} />
            <div className="text-left relative z-10">
                <span className="text-[8px] font-black text-Slate-500 uppercase tracking-widest block mb-0.5">Scheduled Time</span>
                <p className="text-[13px] font-black text-blue-500 uppercase tracking-tighter">{conflictData.interview_date}</p>
            </div>
            <div className="relative z-10 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Clock size={16} className="text-white" />
            </div>
        </div>

       
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <User size={14} />
             </div>
             <div className="text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Interviewer Name</span>
                <p className="text-[11px] font-black text-slate-800 uppercase leading-none">{conflictData.interviewer_name}</p>
             </div>
        </div>
      </div>

 
      <div className="w-full space-y-3">
        <button
          onClick={() => setConflictData(null)}
          className="w-full py-4 !bg-blue-50 !text-blue-500 border border-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]  hover:!bg-white transition-all active:scale-95"
        >
          Close
        </button>
        
        
      </div>
    </div>
  </div>
)} */}


{/* 🛡️ ENTERPRISE CONFLICT ALERT (SWEETALERT STYLE) */}
{conflictData && (
  <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 animate-in fade-in duration-300">
    {/* Glassmorphism Backdrop */}
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
    
    <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col items-center text-center p-8">
      
      {/* ❌ TOP RIGHT CLOSE BUTTON */}
      <button 
        onClick={() => setConflictData(null)}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all active:scale-90 z-20"
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      {/* 🔵 ICON HUB: The "SweetAlert" Signature */}
      <div className="mb-6 relative">
        <div className="h-20 w-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 animate-pulse">
          <ShieldAlert size={40} strokeWidth={1.5} />
        </div>
        {/* Absolute pulse ring */}
        <div className="absolute inset-0 h-20 w-20 border-2 border-blue-100 rounded-[2.5rem] animate-ping opacity-20" />
      </div>

      {/* PRIMARY CONTENT */}
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
          already Scheduled
        </h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">
          Candidate <span className="text-blue-600 underline decoration-2 underline-offset-4">{conflictData.candidate_name}</span> is already Scheduled interview round.
        </p>
      </div>

      {/* METADATA STRIPS: High-Density Info */}
      <div className="w-full space-y-3 mb-4">
        {/* Round & Status Strip */}
        <div className="flex gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Session</span>
                <p className="text-[13px] font-black text-slate-700 uppercase leading-none">Round 0{conflictData.round_number}</p>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State</span>
                <p className="text-[13px] font-black text-emerald-600 uppercase leading-none">{conflictData.status}</p>
            </div>
        </div>

        {/* Date & Time Strip */}
        <div className="w-full bg-white border border-blue-600 rounded-2xl py-4 px-6 flex items-center justify-between relative overflow-hidden group">
            <CalendarIcon className="absolute -right-2 -bottom-2 text-white/10 -rotate-12 transition-transform group-hover:scale-125" size={60} />
            <div className="text-left relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Scheduled Time</span>
                <p className="text-[15px] font-black text-blue-500 uppercase tracking-tighter">{conflictData.interview_date}</p>
            </div>
            <div className="relative z-10 bg-slate-50 p-2 rounded-lg backdrop-blur-sm border border-slate-100">
                <Clock size={22} className="text-blue-600" />
            </div>
        </div>

        {/* Interviewer Node */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <User size={14} />
             </div>
             <div className="text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Interviewer Name</span>
                <p className="text-[11px] font-black text-slate-800 uppercase leading-none">{conflictData.interviewer_name}</p>
             </div>
        </div>
      </div>

      
    </div>
  </div>
)}
    </div>
  );
};

// Updated FilterDropdown to handle multi-select (selected array)
const FilterDropdown = ({ label, options, selected = [], onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = React.useMemo(
    () =>
      !search
        ? options
        : options.filter((opt) =>
            opt.toLowerCase().includes(search.toLowerCase()),
          ),
    [search, options],
  );

  return (
    <div className="flex flex-col min-w-[140px] relative" ref={ref}>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
        {label}
      </span>

      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-full border rounded-lg px-3 py-2 text-[11px] font-bold cursor-pointer flex items-center justify-between transition-all ${
          selected.length > 0
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
        }`}
      >
        <span className="truncate max-w-[120px]">
          {selected.length === 0
            ? `Select ${label}`
            : `${selected.length} Selected`}
        </span>
        <ChevronDown
          size={14}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] p-2 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-1 px-2 py-1.5 border border-slate-100 rounded-lg mb-2 bg-slate-50">
            <Search size={12} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label}...`}
              className="w-full bg-transparent text-[11px] outline-none font-semibold"
            />
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="text-[10px] text-slate-400 text-center py-4">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`flex items-center justify-between px-3 py-2 text-[11px] font-semibold rounded-md cursor-pointer mb-0.5 transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {opt}
                    {isSelected && <Check size={12} strokeWidth={4} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
      <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:text-blue-500 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-[13px] font-bold text-slate-700 break-all leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

const InputField = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}) => (
  <div className="space-y-2">
    <div className="flex gap-1 items-center ml-1">
      <label className="text-[10px] !font-black text-slate-800 uppercase tracking-[0.15em]">
        {label}
      </label>
      {required && (
        <span className="text-red-500 font-bold text-[14px]">*</span>
      )}
    </div>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-5 py-3.5 rounded-2xl text-[13px] font-bold outline-none transition-all duration-300
        ${
          error
            ? "bg-red-50/50 border-2 border-red-200 focus:border-red-500"
            : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 shadow-sm"
        }`}
    />
  </div>
);

// 🎯 Added missing sub-component to fix the ReferenceError
const SectionHeader = ({ title }) => (
  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600/60 flex items-center gap-4 after:h-[1px] after:flex-grow after:bg-gray-100">
    {title}
  </h3>
);

const getSourceStyles = (source) => {
  if (source === "Excel Import")
    return "bg-emerald-50 text-emerald-600 border-emerald-100";

  if (source === "Webhook")
    return "bg-indigo-50 text-indigo-600 border-indigo-100";

  return "bg-blue-50 text-blue-600 border-blue-100";
};

const ConflictMeta = ({ label, value, icon }) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors group">
    <div className="flex items-center gap-2 mb-1.5">
      {icon}
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
    <p className="text-[12px] font-black text-slate-800 uppercase truncate">
      {value || "Not Assigned"}
    </p>
  </div>
);

export default CandidateIntakeFilter;
