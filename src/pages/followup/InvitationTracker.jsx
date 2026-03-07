import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Database,
  X,
  Briefcase,
  GraduationCap,
  Phone,
  Activity,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  User,
  Eye,
  MapPin,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { candidateService } from "../../services/candidateService";

// 🕒 Global Enterprise Date Formatter
const formatDateTime = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LoadingStateCards = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white border border-slate-100 rounded-[2rem] p-6 animate-pulse"
      >
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 w-[22%]">
            <div className="h-14 w-14 rounded-2xl bg-slate-100" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-2 w-2/3 bg-slate-50 rounded" />
            </div>
          </div>
          <div className="h-10 w-[22%] bg-slate-50 rounded-xl" />
          <div className="h-10 w-[20%] bg-slate-50 rounded-xl" />
          <div className="h-10 w-[20%] bg-slate-50 rounded-xl" />
          <div className="h-10 w-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

const InvitationTracker = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();
  const [isMigrating, setIsMigrating] = useState(false);
  // New Filters State
  const [posFilter, setPosFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [eduFilter, setEduFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFilteringDate, setIsFilteringDate] = useState(false);

  const itemsPerPage = 8;


  useEffect(() => {
  // 🕒 Setup Debounce Timer (500ms)
  const debounceTimer = setTimeout(() => {
    fetchInterviewRegistry();
  }, 500);

  // 🧹 Cleanup protocol: Cancels the previous timer if the user types again
  return () => clearTimeout(debounceTimer);
}, [filter, fromDate, toDate, searchQuery]);

  // useEffect(() => {
  //   const fetchCandidates = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await candidateService.getAll();

  //       // 🔁 Map API → EXISTING invitation structure

  //       const normalizeStatus = (status) => {
  //         if (!status) return "sent";

  //         const s = status.toLowerCase();

  //         const map = {
  //           jd_accepted: "accepted",
  //           jd_rejected: "rejected",
  //           jd_sent: "pending",
  //         };

  //         // return mapped value OR original status
  //         return map[s] || s;
  //       };

  //       const mapped = data.map((c, index) => ({
  //         id: c.id ?? index + 1,
  //         name: c.full_name ?? "Unknown",
  //         email: c.email ?? "—",
  //         sentDate: c.invited_at ?? "—",
  //         status: normalizeStatus(c.status),
  //         responseDate: c.response_date ?? null,
  //         position: c.position ?? "—",
  //         experience: c.experience ?? "—",
  //         education: c.education ?? "—",
  //         location: c.location ?? "—",
  //       }));

  //       setInvitations(mapped);
  //     } catch (err) {
  //       console.error("Failed to load candidates", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCandidates();
  // }, []);

  //   useEffect(() => {
  //   const fetchInterviewRegistry = async () => {
  //     try {
  //       setLoading(true);
  //       // 🎯 Fetching from the Interview endpoint
  //       const res = await fetch("https://apihrr.goelectronix.co.in/interviews");
  //       const data = await res.json();

  //       // 🔁 Map API response to the Tracker's flat structure
  //       const mapped = data.map((item) => ({
  //         id: item.id,
  //         // Candidate Metadata
  //         name: item.candidate?.full_name || "Unknown",
  //         candidateId: item.candidate?.id,
  //         email: item.candidate?.email || "—",
  //         phone: item.candidate?.phone || "—",
  //         // Vacancy Metadata
  //         position: item.vacancy?.title || "Direct Interview",
  //         jobType: item.vacancy?.job_type || "N/A",
  //         // Interview Specifics
  //         round: item.round_number,
  //         mode: item.mode,
  //         interviewDate: item.interview_date,
  //         interviewerName: item.interviewer?.full_name || "Unassigned",
  //   interviewerEmail: item.interviewer?.email || "No email node",
  //         // Status Registry
  //         status: item.status, // scheduled, completed, etc.
  //         attendance: item.attendance_status, // pending, attended, etc.
  //         // Review Data
  //         score: item.review?.total_score || null,
  //         decision: item.review?.decision || "Pending",
  //         // For Drawer
  //         interviewer: item.interviewer_name,
  //         interviewerRole: item.interviewer_designation,
  //         location: item.venue_details || item.meeting_link || "Remote",
  //       }));

  //       setInvitations(mapped);
  //     } catch (err) {
  //       toast.error("Failed to sync Interview Registry");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchInterviewRegistry();
  // }, []);

  // const fetchInterviewRegistry = async () => {
  //   try {
  //     setLoading(true);

  //     // 🎯 1. Construct Enterprise Query Protocol
  //     const params = new URLSearchParams();
  //     if (fromDate) params.append("from_date", fromDate);
  //     if (toDate) params.append("to_date", toDate);

  //     const queryString = params.toString() ? `?${params.toString()}` : "";
  //     const res = await fetch(
  //       `https://apihrr.goelectronix.co.in/interviews${queryString}`,
  //     );
  //     const data = await res.json();

  //     // 🎯 2. Map and Filter strictly Scheduled/Completed
  //     const mapped = data
  //       .filter((item) =>
  //         ["scheduled", "completed"].includes(item.status?.toLowerCase()),
  //       )
  //       .map((item) => ({
  //         id: item.id,
  //         candidateId: item.candidate?.id,
  //         name: item.candidate?.full_name || "Unknown",
  //         email: item.candidate?.email || "—",
  //         phone: item.candidate?.phone || "—",
  //         position: item.vacancy?.title || "Direct Interview",
  //         jobType: item.vacancy?.job_type || "N/A",
  //         round: item.round_number,
  //         mode: item.mode,
  //         interviewDate: item.interview_date,
  //         interviewerName:
  //           item.interviewer?.full_name ||
  //           item.interviewer_name ||
  //           "Unassigned",
  //         interviewerEmail:
  //           item.interviewer?.email || item.interviewer_email || "—",
  //         status: item.status?.toLowerCase(),
  //         attendance: item.attendance_status,
  //       }));

  //     setInvitations(mapped);
  //   } catch (err) {
  //     toast.error("Temporal Registry Sync Failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // 🛰️ Trigger fetch on mount and whenever date parameters change
  // useEffect(() => {
  //   fetchInterviewRegistry();
  // }, [fromDate, toDate]);

  const fetchInterviewRegistry = async () => {
  try {
    setLoading(true);
    
    // 🎯 1. Initialize URL Parameter Protocol
    const params = new URLSearchParams();
    
    // 📅 Existing Date Parameters
    if (fromDate) params.append("from_date", fromDate);
    if (toDate) params.append("to_date", toDate);
    
    // 🏷️ NEW: Status Parameter Handshake
    // Convert "Scheduled" -> "scheduled" for API compatibility
    if (filter !== "all") {
      params.append("status", filter.toLowerCase());
    }


    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : "";
    
    // 📡 Execute Transmission
    const res = await fetch(`https://apihrr.goelectronix.co.in/interviews${queryString}`);
    const data = await res.json();

    // 🔁 Map API response (filtering remains on backend now)
    const mapped = data.map((item) => ({
      id: item.id,
      candidateId: item.candidate?.id,
      name: item.candidate?.full_name || "Unknown",
      email: item.candidate?.email || "—",
      phone: item.candidate?.phone || "—",
      position: item.vacancy?.title || "Direct Interview",
      jobType: item.vacancy?.job_type || "N/A",
      round: item.round_number,
      mode: item.mode,
      interviewDate: item.interview_date,
      interviewerName: item.interviewer?.full_name || item.interviewer_name || "Unassigned",
      interviewerEmail: item.interviewer?.email || item.interviewer_email || "—",
      status: item.status?.toLowerCase(),
      attendance: item.attendance_status,
      location: item.venue_details || item.meeting_link || "Remote",
      position: item.vacancy?.title || "Null", // This is your Vacancy Name
  jobType: item.vacancy?.job_type || "N/A",
      
    }));

    setInvitations(mapped);
  } catch (err) {
    toast.error("Failed to sync status-filtered registry");
  } finally {
    setLoading(false);
  }
};

// 🛰️ Dependency Array: Re-run fetch when Filter or Dates change
useEffect(() => {
  fetchInterviewRegistry();
}, [filter, fromDate, toDate]);

  const normalizeText = (val) => {
    if (!val) return "—";

    return val
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\s+/g, " ");
  };

  const uniqueNormalized = (list, key) => [
    "all",
    ...new Map(
      list.map((i) => {
        const raw = i[key] || "—";
        return [normalizeText(raw), raw];
      }),
    ).values(),
  ];

  const getPaginationRange = () => {
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

  const positions = uniqueNormalized(invitations, "position");
  const experiences = uniqueNormalized(invitations, "experience");
  const educations = uniqueNormalized(invitations, "education");
  const states = uniqueNormalized(invitations, "location");

  // LOGIC: Global Filtering
  // const filteredData = useMemo(() => {
  //   return invitations.filter((inv) => {
  //     const matchesSearch =
  //       (inv.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (inv.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());

  //     const matchesStatus = filter === "all" || inv.status === filter;
  //     const matchesPos = posFilter === "all" || inv.position === posFilter;
  //     const matchesExp = expFilter === "all" || inv.experience === expFilter;
  //     // const matchesEdu = eduFilter === "all" || inv.education === eduFilter;
  //     const matchesEdu =
  //       eduFilter === "all" ||
  //       normalizeText(inv.education) === normalizeText(eduFilter);

  //     const matchesState =
  //       stateFilter === "all" || inv.location === stateFilter;

  //     return (
  //       matchesSearch &&
  //       matchesStatus &&
  //       matchesPos &&
  //       matchesExp &&
  //       matchesEdu &&
  //       matchesState
  //     );
  //   });
  // }, [
  //   invitations,
  //   searchQuery,
  //   filter,
  //   posFilter,
  //   expFilter,
  //   eduFilter,
  //   stateFilter,
  // ]);
// LOGIC: Global Filtering
const filteredData = useMemo(() => {
  return invitations.filter((inv) => {
    // 🔍 Search Match
    // const matchesSearch =
    //   (inv.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   (inv.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    // 🎯 FIX: Convert UI filter (e.g., "Scheduled") to lowercase to match "scheduled"
    const matchesStatus = 
      filter === "all" || inv.status === filter.toLowerCase();

    // 🏷️ Metadata Filters
    const matchesPos = posFilter === "all" || inv.position === posFilter;
    const matchesExp = expFilter === "all" || inv.experience === expFilter;
    const matchesEdu =
      eduFilter === "all" ||
      normalizeText(inv.education) === normalizeText(eduFilter);

    const matchesState =
      stateFilter === "all" || inv.location === stateFilter;

    return (

      matchesStatus && // ✅ This now synchronizes correctly
      matchesPos &&
      matchesExp &&
      matchesEdu &&
      matchesState
    );
  });
}, [
  invitations,
  filter, // UI state "Scheduled"
  posFilter,
  expFilter,
  eduFilter,
  stateFilter,
]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      await candidateService.migrateCandidates();
      toast.success("Migration completed successfully 🚀");
      navigate("/dummyemp");
    } catch (err) {
      toast.error(err.message || "Migration failed ❌");
    } finally {
      setIsMigrating(false);
    }
  };

  const formatStatus = (status) => {
    const map = {
      jd_sent: "JD Sent",
      opened: "Opened",
      viewed: "Viewed",
      responded: "Responded",
      accepted: "Accepted",
      rejected: "Rejected",
      pending: "Pending",
    };

    return map[status] || status || "Unknown";
  };

  const LoadingState = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-100 rounded" />
                <div className="h-2 w-20 bg-slate-50 rounded" />
              </div>
            </div>
          </td>
          <td className="px-6 py-6">
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </td>
          <td className="px-6 py-6">
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </td>
          <td className="px-6 py-6">
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </td>
          <td className="px-6 py-6">
            <div className="h-6 w-20 bg-slate-50 rounded-lg" />
          </td>
          <td className="px-10 py-6">
            <div className="h-8 w-8 ml-auto bg-slate-50 rounded-xl" />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[850px]">
      {/* HEADER & GLOBAL FILTERS */}
      <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Invitation Analytics
            </h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              Followup data • {filteredData.length} Candidates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search name or email..."
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
              {["all", "Scheduled", "Completed"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilter(t);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg !bg-transparent text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? "!bg-white !text-blue-600 shadow-sm" : "!text-slate-400"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ADVANCED FILTER ROW */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">
          {/* 📅 FROM DATE FILTER */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              From Date
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
            />
          </div>

          {/* 📅 TO DATE FILTER */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              To Date
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
            />
          </div>

          {/* 🧹 CLEAR TEMPORAL FILTERS */}
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 px-4 py-2 mt-4 !bg-transparent border border-rose-100 !text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95"
            >
              <XCircle size={14} strokeWidth={2.5} />
              Clear Date
            </button>
          )}

          <button
            onClick={handleMigration}
            disabled={isMigrating}
            className="relative ml-auto group !bg-transparent overflow-hidden"
          >
            {/* ... rest of your Migration Button code ... */}
            <div className="flex items-center gap-3 px-6 py-2.5 bg-white border border-blue-500 rounded-xl transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-95 disabled:opacity-50">
              <div
                className={`transition-transform duration-700 ${isMigrating ? "animate-spin" : "group-hover:rotate-180"}`}
              >
                <RefreshCw
                  size={21}
                  className="text-blue-600 group-hover:text-blue-600"
                />
              </div>
              {/* <div className="flex flex-col items-start">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">
          {isMigrating ? 'Loading' : 'Refresh System'}
        </span>
        <span className="text-[8px] font-bold text-blue-600 uppercase tracking-tighter mt-1 group-hover:text-blue-600 transition-colors">
          Data Migration 
        </span>
      </div> */}
              {/* <div className="ml-2 w-1 h-4 bg-white rounded-full overflow-hidden">
          <div className={`w-full bg-blue-400 transition-all duration-1000 ${isMigrating ? 'h-full' : 'h-0 group-hover:h-1/2'}`} />
      </div> */}
            </div>
          </button>
        </div>
        {/* <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">

         
    <div className="flex flex-col gap-1.5 min-w-[140px]">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            From Date
        </span>
        <input 
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
        />
    </div>

   
    <div className="flex flex-col gap-1.5 min-w-[140px]">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            To Date
        </span>
        <input 
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
        />
    </div>

         <button
  onClick={handleMigration}
  disabled={isMigrating} // Assuming a loading state exists
  className="relative ml-auto group !bg-transparent overflow-hidden"
>

  <div className="flex items-center gap-3 px-6 py-2.5 bg-white border border-blue-500 rounded-xl transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-95 disabled:opacity-50">
    
 
    <div className={`transition-transform duration-700 ${isMigrating ? 'animate-spin' : 'group-hover:rotate-180'}`}>
      <RefreshCw size={21} className="text-blue-600 group-hover:text-blue-600" />
    </div>

    <div className="flex flex-col items-start">
      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">
        {isMigrating ? 'Loading' : 'Refresh System'}
      </span>
      <span className="text-[8px] font-bold text-blue-600 uppercase tracking-tighter mt-1 group-hover:text-blue-600 transition-colors">
        Data Migration 
      </span>
    </div>

    
    <div className="ml-2 w-1 h-4 bg-white rounded-full overflow-hidden">
        <div className={`w-full bg-blue-400 transition-all duration-1000 ${isMigrating ? 'h-full' : 'h-0 group-hover:h-1/2'}`} />
    </div>
  </div>
</button>
        </div> */}
      </div>

      {/* TABLE SECTION */}
      <div className="flex-grow overflow-y-auto">
        {/* <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
            <tr>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Candidate
              </th>
             
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Interviewer Name & Email
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Round
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Status
              </th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
         


      <tbody className="divide-y divide-slate-100">
  {loading ? (
    <LoadingState />
  ) : currentData.length > 0 ? (
    currentData.map((inv) => (
      <tr key={inv.id} className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600">
  
        <td className="px-10 py-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-100">
              {inv.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{inv.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{inv.email}</p>
            </div>
          </div>
        </td>

    
        
        <td className="px-6 py-6 border-l border-slate-50">
  <div className="flex items-center gap-3">
 
    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
      <User size={14} strokeWidth={2.5} />
    </div>
    
    <div className="flex flex-col min-w-0">
   
      <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight truncate">
        {inv.interviewerName}
      </span>
      
      
      <div className="flex items-center gap-1 mt-0.5">
        <Mail size={10} className="text-blue-500" />
        <span className="text-[10px] font-bold text-slate-400 lowercase tracking-tighter truncate">
          {inv.interviewerEmail}
        </span>
      </div>
    </div>
  </div>
</td>
        <td className="px-6 py-6 text-[10px] font-black text-slate-600 uppercase">R-{inv.round} ({inv.mode})</td>

      
        <td className="px-6 py-6">
          <StatusBadge status={inv.status} date={inv.interviewDate} />
        </td>

    
        <td className="px-10 py-6 text-right">
          <div className="flex justify-end gap-2">
            <button onClick={() => setSelectedCandidate(inv)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
              <Eye size={16} />
            </button>
            <button onClick={() => navigate(`/invitation/${inv.candidateId}`)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
              <User size={16} />
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center opacity-40">
           <Database size={40} className="text-slate-300 mb-4" />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No active records matched</p>
        </div>
      </td>
    </tr>
  )}
</tbody>
        </table> */}

        {/* --- ENTERPRISE CARD STREAM SECTION --- */}
        {/* <div className="flex-grow overflow-y-auto p-10 bg-slate-50/30 custom-scrollbar">
  <div className="space-y-4 max-w-7xl mx-auto">
    {loading ? (
      <LoadingStateCards />
    ) : currentData.length > 0 ? (
      currentData.map((inv) => {
        const isCompleted = inv.status === "completed";
        
        return (
          <div 
            key={inv.id} 
            className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
          >
          
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'} opacity-80 group-hover:w-2 transition-all`} />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
            
              <div className="flex items-center gap-4 w-full lg:w-[22%]">
                <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                  {inv.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Candidate</span>
                  <p className="text-[15px] font-black text-slate-900 uppercase tracking-tight truncate">{inv.name}</p>
                  <p className="text-[10px] text-blue-600 font-bold lowercase truncate">{inv.email}</p>
                </div>
              </div>

           
              <div className="flex items-center gap-4 w-full lg:w-[22%] border-l border-slate-100 pl-6">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:text-blue-600 transition-colors border border-slate-100">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Interviewer</span>
                  <p className="text-[13px] font-black text-slate-800 uppercase truncate">{inv.interviewerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 lowercase truncate tracking-tighter">{inv.interviewerEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-[20%] border-l border-slate-100 pl-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <Briefcase size={18} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Job Context</span>
                  <p className="text-[13px] font-black text-slate-700 uppercase truncate">{inv.position}</p>
                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{inv.jobType}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-[20%] border-l border-slate-100 pl-6">
                <div className="min-w-0 flex flex-col gap-2">
                  <StatusBadge status={inv.status} />
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-slate-300" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{formatDateTime(inv.interviewDate)}</span>
                  </div>
                </div>
              </div>

            
              <div className="flex items-center gap-2 lg:w-[10%] justify-end">
                <button 
                  onClick={() => setSelectedCandidate(inv)} 
                  className="p-3 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-400 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95"
                >
                  <Eye size={18} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => navigate(`/invitation/${inv.candidateId}`)} 
                  className="p-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95"
                >
                  <User size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        );
      })
    ) : (
   
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-32 flex flex-col items-center justify-center text-center opacity-60">
        <Database size={48} className="text-slate-200 mb-4" />
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Node Registry Empty</p>
      </div>
    )}
  </div>
</div> */}

        {/* --- ENTERPRISE CARD STREAM SECTION --- */}
        <div className="flex-grow overflow-y-auto p-10 bg-slate-50/30 custom-scrollbar">
          <div className="space-y-4 max-w-7xl mx-auto">
            {loading ? (
              <LoadingStateCards />
            ) : currentData.length > 0 ? (
              currentData.map((inv) => {
                const isCompleted = inv.status === "completed";

                return (
                  <div
                    key={inv.id}
                    className="group relative bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
                  >
                    {/* 🟢 VISUAL STATUS ANCHOR (Left Pillar) */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCompleted ? "bg-emerald-500" : "bg-blue-600"} opacity-80 group-hover:w-2 transition-all`}
                    />

                    {/* 1. CANDIDATE IDENTITY NODE */}
                    <div className="flex items-center gap-4 w-[19%]">
                      <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center text-blue-500 text-sm font-black uppercase ring-2 ring-slate-50 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        {inv.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                          Candidate
                        </span>
                        {/* <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight truncate">
                          {inv.name}
                        </p> */}
                        <p 
  className="text-[14px] font-black text-slate-900 uppercase tracking-tight truncate cursor-help"
  title={inv.name} // 🎯 This creates the native browser tooltip on hover
>
  {inv.name}
</p>
                      </div>
                    </div>

                    {/* 3. CONTACT NODE */}
                    <div className="flex items-center gap-4 w-[18%] border-l border-slate-100 pl-8">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <Phone size={16} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black whitespace-nowrap text-slate-400 uppercase tracking-widest block mb-1">
                          Contact Number
                        </span>
                        <p className="text-[12px] whitespace-nowrap font-black text-slate-900 tracking-widest">
                          <span className="text-slate-400 font-bold mr-1">
                            +91
                          </span>{" "}
                          {inv.phone}
                        </p>
                      </div>
                    </div>

                    {/* 🎯 3. VACANCY CONTEXT NODE (NEW) */}
            <div className="flex items-center gap-4 w-[18%] border-l border-slate-100 pl-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Briefcase size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Vacancy
                </span>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate">
                  {inv.position} {/* Shows "node js" */}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter bg-blue-50 px-1.5 rounded">
                    {inv.jobType}
                  </span>
                </div>
              </div>
            </div>

                    {/* 2. INTERVIEWER NODE (Branding Box Style) */}
                    <div className="flex items-center gap-4 w-[20%] border-l border-slate-100 pl-8">
                      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 transition-colors">
                        <User size={16} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                          Interviewer
                        </span>
                        <p className="text-[12px] font-bold text-slate-700 uppercase tracking-tight truncate">
                          {inv.interviewerName}
                        </p>
                        {/* <p className="text-[9px] font-bold text-slate-400 lowercase truncate tracking-tighter italic">{inv.interviewerEmail}</p> */}
                      </div>
                    </div>

                    {/*            
            <div className="flex items-center gap-4 w-[18%] border-l border-slate-100 pl-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Activity size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Process State</span>
                <StatusBadge status={inv.status} />
              </div>
            </div>

           
            <div className="flex items-center gap-4 w-[15%] border-l border-slate-100 pl-8">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <Calendar size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Timestamp</span>
                <div className="flex flex-col">
                  <p className="text-[11px] font-black text-slate-900 leading-none">{inv.interviewDate ? new Date(inv.interviewDate).toLocaleDateString('en-GB').replace(/\//g, '-') : "—"}</p>
                  <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">
                    {inv.interviewDate ? new Date(inv.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "—"}
                  </p>
                </div>
              </div>
            </div> */}

                    {/* --- INTEGRATED PROCESS & TEMPORAL NODE --- */}
                    <div className="flex items-center gap-5 w-[15%] border-l border-slate-100 pl-8">
                      {/* Branding Box: Dynamic Icon based on Status */}
                      {/* <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
    inv.status === "completed" 
      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
      : "bg-blue-50 text-blue-600 border-blue-100"
  }`}>
    {inv.status === "completed" ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <Calendar size={18} strokeWidth={2.5} />}
  </div> */}

                      <div className="flex flex-col gap-2 min-w-0">
                        {/* 1. Status Label & Badge Row */}
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            {/* <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          Current State
        </span> */}
                            <StatusBadge status={inv.status} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-[15%] border-l border-slate-100 pl-8">
                      <div className="flex flex-col border-t border-slate-50 pt-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Scheduled time
                        </span>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-black text-slate-900 leading-none">
                            {inv.interviewDate
                              ? new Date(inv.interviewDate)
                                  .toLocaleDateString("en-GB")
                                  .replace(/\//g, "-")
                              : "—"}
                          </p>
                          
                          
                        </div>
                        <div>
                          <p className="text-[9px] font-bold pt-1 text-blue-600 uppercase tracking-tighter">
                            {inv.interviewDate
                              ? new Date(inv.interviewDate).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 6. ACTION NODE */}
                    <div className="flex items-center gap-2 pl-4">
                      {/* <button
                        onClick={() => setSelectedCandidate(inv)}
                        className="p-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-400 rounded-xl transition-all border border-slate-100 shadow-sm active:scale-95"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </button> */}
                      <button
                        onClick={() =>
                          navigate(`/invitation/${inv.candidateId}`)
                        }
                        className="p-2.5 !bg-slate-50 hover:!bg-blue-600 hover:!text-white !text-blue-500 border !border-blue-600 rounded-xl transition-all border border-slate-100 shadow-sm active:scale-95"
                      >
                        <User size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-32 flex flex-col items-center justify-center text-center opacity-60">
                <Database size={48} className="text-slate-200 mb-4" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                  Interview Data Empty
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      {/* <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div> */}

      <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        {/* 📊 LEFT: RECORD STATS */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Records {(currentPage - 1) * itemsPerPage + 1} —{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} /{" "}
            {filteredData.length}
          </span>
        </div>

        {/* 🎮 CENTER: NAVIGATION CONTROLS */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm">
          {/* PREV BUTTON */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 rounded-xl !bg-transparent !text-blue-600 !text-slate-400 hover:!text-blue-600 disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>

          {/* 🔢 DYNAMIC PAGE LIST */}
          <div className="flex items-center gap-1">
            {getPaginationRange().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="w-6 text-center text-slate-300 font-black text-[10px] tracking-widest"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all duration-300 ${
                    currentPage === page
                      ? "bg-white text-blue-600  scale-110"
                      : "!bg-transparent !text-slate-400 hover:!text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* NEXT BUTTON */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 rounded-xl !bg-transparent !text-slate-400 hover:!text-blue-600 disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        {/* 📄 RIGHT: TOTAL PAGE COUNTER */}
        {/* <div className="hidden sm:block">
     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
        Jump to Final: {totalPages}
     </span>
  </div> */}
      </div>

      {/* SIDE DRAWER */}
      {selectedCandidate && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
            onClick={() => setSelectedCandidate(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col p-10">
            <div className="flex justify-between items-start mb-10">
              <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-100">
                {selectedCandidate.name.charAt(0)}
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-10 overflow-y-auto pr-4">
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                  {selectedCandidate.name}
                </h3>
                <p className="text-blue-600 font-bold mt-4 text-sm">
                  {selectedCandidate.email}
                </p>
              </div>

              <div className="space-y-8">
                <DetailRow
                  icon={<Briefcase size={18} />}
                  label="Position & Experience"
                  value={selectedCandidate.position}
                  sub={selectedCandidate.experience}
                />
                <DetailRow
                  icon={<GraduationCap size={18} />}
                  label="Highest Qualification"
                  value={selectedCandidate.education}
                />
                <DetailRow
                  icon={<MapPin size={18} />}
                  label="Location Details"
                  value={`${selectedCandidate.location}`}
                />
                <DetailRow
                  icon={<Clock size={18} />}
                  label="Timeline"
                  value={`Invited: ${formatStatus(selectedCandidate.status)}`}
                  // sub={
                  //   formatStatus(selectedCandidate.status)
                  //     ? `Response: ${formatStatus(selectedCandidate.status)}`
                  //     : "Awaiting response..."
                  // }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// COMPONENT: Custom Filter Dropdown
const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5 min-w-[140px]">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "all" ? `All ${label}s` : opt}
        </option>
      ))}
    </select>
  </div>
);

// COMPONENT: Detail Row for Drawer
const DetailRow = ({ icon, label, value, sub }) => (
  <div className="flex gap-5">
    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-base font-bold text-slate-800 leading-snug">{value}</p>
      {sub && (
        <p className="text-xs font-bold text-blue-500/70 mt-0.5">{sub}</p>
      )}
    </div>
  </div>
);

// COMPONENT: Status Badge
const StatusBadge = ({ status, date }) => {
  const styles = {
    completed: {
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <CheckCircle2 size={12} />,
      label: "Completed",
    },
    scheduled: {
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <Calendar size={12} />,
      label: "Scheduled",
    },
    // Keep 'sent' as a fallback for pending JD invites
    sent: {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <Clock size={12} />,
      label: "Pending",
    },
  };

  // Normalize status for safe lookup
  const normalizedStatus = status?.toLowerCase() || "";
  const current = styles[normalizedStatus] ?? {
    bg: "bg-slate-50 text-slate-600 border-slate-200",
    icon: <Clock size={12} />,
    label: normalizedStatus ? normalizedStatus.replace("_", " ") : "Unknown",
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}
      >
        {current.icon} {current.label}
      </div>
      {date && (
        <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 uppercase">
          {/* ✅ Now this function call will work! */}
          {formatDateTime(date)}
        </span>
      )}
    </div>
  );
};

export default InvitationTracker;
