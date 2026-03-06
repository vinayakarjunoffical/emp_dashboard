import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  IndianRupee,
  FileText,
  Gavel,
  ExternalLink,
  Check,
  GraduationCap,
  Mail,
  UserPlus,
  Pencil,
  CheckCircle2,
  Activity,
  Languages,
  Search,
  ChevronRight,
  Zap,
  XCircle,
  X,
  ChevronLeft,
  Navigation,
  ChevronDown,
  ShieldCheck,
  Layers,
  Calendar,
  Loader2,
  Building2,
  Phone,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const VacancyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE REGISTRY ---
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState("description");
  const [vacancy, setVacancy] = useState(null);
  const [revealedNumbers, setRevealedNumbers] = useState({});
  const [jobDescription, setJobDescription] = useState(null);
  const [company, setCompany] = useState(null);
  const [metrics, setMetrics] = useState({
    responses: 0,
    leads: 0,
    database: 0,
  });
  const [activeMetricTab, setActiveMetricTab] = useState(null);
  const [metricData, setMetricData] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [candidatePage, setCandidatePage] = useState(1);
  const candidatesPerPage = 5;
  const [registrySearch, setRegistrySearch] = useState("");
  const [showMetadata, setShowMetadata] = useState(true);
  const [skillsMaster, setSkillsMaster] = useState([]);

  // --- ADD TO STATE REGISTRY ---
  const [filters, setFilters] = useState({
    experiences: [],
    educations: [],
    districts: [],
    cities: [],
    genders: [],
    industries: [],
    skills: [],
    languages: [], // 🛠️ Added
    ages: [],
  });
  const [industries, setIndustries] = useState([]);
  const [educationMasters, setEducationMasters] = useState([]);
  const [decisionCandidate, setDecisionCandidate] = useState(null); // Tracks candidate for modal
const [decisionData, setDecisionData] = useState({
  status: "",
  remark: "",
  follow_up_date: "",
  follow_up_time: "",
});
// --- FOLLOW UP STATE HUB ---
const [followUpVariation, setFollowUpVariation] = useState(null); // today, future, pending, reject
const [followUpData, setFollowUpData] = useState([]);
const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
const [followUpHistory, setFollowUpHistory] = useState([]);
const [loadingHistory, setLoadingHistory] = useState(false);

// Keep specific metrics for follow-ups
const [followUpMetrics, setFollowUpMetrics] = useState({ 
  today: 0, 
  future: 0, 
  pending: 0, 
  reject: 0 
});

const [templates, setTemplates] = useState([]);
const [isMailModalOpen, setIsMailModalOpen] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState("");
const [singleMailCandidate, setSingleMailCandidate] = useState(null);


// 🎯 Add this at the top level of your VacancyDetails component
const actionMapping = {
  schedule_interaction: { label: "Call For Interview", color: "text-blue-600", bg: "bg-blue-50", icon: <Phone size={10} /> },
  call_not_connected: { label: "Not Connected", color: "text-orange-500", bg: "bg-orange-50", icon: <X size={10} /> },
  reschedule: { label: "Rescheduled", color: "text-indigo-600", bg: "bg-indigo-50", icon: <Clock size={10} /> },
  reject: { label: "Rejected", color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={10} /> },
  visited: { label: "Visited", color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle2 size={10} /> },
};

  // const fetchAllDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const vacRes = await fetch(
  //       `https://apihrr.goelectronix.co.in/vacancies/${id}`,
  //     );
  //     if (!vacRes.ok) throw new Error("Vacancy node not found");
  //     const vacData = await vacRes.json();
  //     setVacancy(vacData);

  //     // 🎯 Construct Requirement Query for Initial Responses Count
  //     const reqQuery = new URLSearchParams();
  //     reqQuery.append("status", "jd_sent");
  //     reqQuery.append("vacancy_id", id);

  //     // Auto-map vacancy requirements to the count API call
  //     if (vacData.title)
  //       reqQuery.append("position", vacData.title.toLowerCase());

  //     if (vacData.skills_req?.length > 0) {
  //       vacData.skills_req.forEach((skill) =>
  //         reqQuery.append("skills", skill.toLowerCase()),
  //       );
  //     }

  //     if (vacData.city?.[0])
  //       reqQuery.append("city", vacData.city[0].toLowerCase());

  //     if (vacData.min_experience !== undefined)
  //       reqQuery.append("min_experience", vacData.min_experience);
  //     if (vacData.max_experience !== undefined)
  //       reqQuery.append("max_experience", vacData.max_experience);

  //     // 🛰️ Parallel Execution with full requirement parameters
  //     const [resResp, resLeads, resDb] = await Promise.all([
  //       fetch(
  //         `https://apihrr.goelectronix.co.in/candidates?${reqQuery.toString()}`,
  //       ), // 🔥 Fixed with params
  //       fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
  //       fetch(`https://apihrr.goelectronix.co.in/candidates`),
  //     ]);

  //     const [dataResp, dataLeads, dataDb] = await Promise.all([
  //       resResp.json(),
  //       resLeads.json(),
  //       resDb.json(),
  //     ]);

  //     // Update Metrics State with filtered initial data
  //     setMetrics({
  //       responses: dataResp.length || 0,
  //       leads: dataLeads.length || 0,
  //       database: dataDb.length || 0,
  //     });

  //     // ... (rest of your JD and Company logic remains the same)
  //     if (vacData.job_description) {
  //       const jdRes = await fetch(
  //         `https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`,
  //       );
  //       setJobDescription(await jdRes.json());
  //     }

  //     const compRes = await fetch(
  //       `https://apihrr.goelectronix.co.in/companies`,
  //     );
  //     const compListData = await compRes.json();
  //     const matchedCompany = compListData.find(
  //       (c) => c.id === vacData.company?.id,
  //     );
  //     if (matchedCompany) setCompany(matchedCompany);
  //   } catch (err) {
  //     toast.error(err.message);
  //     navigate("/vacancies");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const fetchAllDetails = async () => {
  setLoading(true);
  try {
    // 1. Fetch Core Vacancy Node
    const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
    if (!vacRes.ok) throw new Error("Vacancy node not found");
    const vacData = await vacRes.json();
    setVacancy(vacData);

    // 🎯 2. Construct Requirement Query for Initial Responses Count
    const reqQuery = new URLSearchParams();
    reqQuery.append("status", "jd_sent");
    reqQuery.append("vacancy_id", id);

    if (vacData.title) reqQuery.append("position", vacData.title.toLowerCase());
    if (vacData.skills_req?.length > 0) {
      vacData.skills_req.forEach((skill) => reqQuery.append("skills", skill.toLowerCase()));
    }
    if (vacData.city?.[0]) reqQuery.append("city", vacData.city[0].toLowerCase());
    if (vacData.min_experience !== undefined) reqQuery.append("min_experience", vacData.min_experience);
    if (vacData.max_experience !== undefined) reqQuery.append("max_experience", vacData.max_experience);

    // 🛰️ 3. Parallel Execution: Main Metrics & Follow-Up Registry
    const [
      resResp, resLeads, resDb, // Main Metrics
      todayRes, futureRes, pendingRes, rejectRes // Follow-Up Metrics
    ] = await Promise.all([
      fetch(`https://apihrr.goelectronix.co.in/candidates?${reqQuery.toString()}`),
      fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
      fetch(`https://apihrr.goelectronix.co.in/candidates`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${id}&variation=today`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${id}&variation=future`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?status=overdue&vacancy_id=${id}`),
      fetch(`https://apihrr.goelectronix.co.in/follow-ups?action_type=reject&vacancy_id=${id}`)
    ]);

    const [
      dataResp, dataLeads, dataDb,
      todayD, futureD, pendingD, rejectD
    ] = await Promise.all([
      resResp.json(), resLeads.json(), resDb.json(),
      todayRes.json(), futureRes.json(), pendingRes.json(), rejectRes.json()
    ]);

    // 📊 4. Update Main Metrics
    setMetrics({
      responses: dataResp.length || 0,
      leads: dataLeads.length || 0,
      database: dataDb.length || 0,
    });

    // 📊 5. Update Follow-Up Metrics with Summation and Specific Reject Logic
    const sumCounts = (obj) => Object.values(obj?.counts || {}).reduce((a, b) => a + b, 0);

    setFollowUpMetrics({
      today: sumCounts(todayD),
      future: sumCounts(futureD),
      pending: sumCounts(pendingD),
      // 🎯 Only get for reject (from counts object)
      reject: rejectD?.counts?.reject || 0 
    });

    // 📝 6. Sync Job Description and Company Details
    if (vacData.job_description) {
      const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
      setJobDescription(await jdRes.json());
    }

    const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
    const compListData = await compRes.json();
    const matchedCompany = compListData.find((c) => c.id === vacData.company?.id);
    if (matchedCompany) setCompany(matchedCompany);

  } catch (err) {
    console.error("Master Sync Failure:", err);
    toast.error(err.message);
    navigate("/vacancies");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (activeMetricTab) {
      const delayDebounceFn = setTimeout(() => {
        // 🟢 Pass 'true' for isAutoRefresh
        handleTabClick(activeMetricTab, filters, registrySearch, true);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [filters, registrySearch]);

  // 2. The useEffect now simply triggers the shared function on mount
  useEffect(() => {
    fetchAllDetails();
  }, [id, navigate]);

  // Add these to your fetchAllDetails function or a new useEffect
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [eduRes, indRes, skillRes] = await Promise.all([
          fetch(
            "https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100",
          ),
          fetch(
            "https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100",
          ),
          fetch(
            "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
          ),
        ]);
        const eduData = await eduRes.json();
        const indData = await indRes.json();
        const skillData = await skillRes.json();

        setEducationMasters(eduData || []);
        setIndustries(indData || []);
        setSkillsMaster(skillData || []);
      } catch (err) {
        console.error("Master Data Sync Failure", err);
      }
    };
    fetchMasters();
  }, []);


  const filteredResults = useMemo(() => {
    // Now simply returns the data from the API
    return metricData;
  }, [metricData]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
    setCandidatePage(1); // Reset to first page on filter change
  };

  // This was likely defined too low in your previous code
  const skillOptions = useMemo(() => {
    return skillsMaster.map((s) => s.name.toUpperCase()).sort();
  }, [skillsMaster]);

  // --- LOGIC HELPERS ---

  const indexOfLastCandidate = candidatePage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredResults.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate,
  );
  const totalCandidatePages = Math.ceil(
    filteredResults.length / candidatesPerPage,
  );

  useEffect(() => {
    setCandidatePage(1);
  }, [activeMetricTab, registrySearch]);


  const handleTabClick = async (
    tabType,
    currentFilters = filters,
    searchQuery = registrySearch,
    isAutoRefresh = false,
  ) => {
    const activeTab = tabType || activeMetricTab;
    if (!activeTab) return;

    if (!isAutoRefresh) {
    setFollowUpVariation(null); 
  }

    if (!isAutoRefresh && activeMetricTab === tabType) {
      setActiveMetricTab(null);
      setShowMetadata(true);
      return;
    }

    // 🎯 TAB SYNC LOGIC: Determine fresh filters based on tab
    let nextFilters = currentFilters;

    if (!isAutoRefresh) {
      // Only do this on a human click, not a debounce refresh
      if (tabType === "responses" && vacancy) {
        nextFilters = {
          ...filters,
          skills: vacancy.skills_req
            ? vacancy.skills_req.map((s) => s.toUpperCase())
            : [],
          industries: vacancy.industries
            ? vacancy.industries.map((i) => i.name.toUpperCase())
            : [],
          cities: vacancy.city ? vacancy.city.map((c) => c.toUpperCase()) : [],
          experiences:
            vacancy.min_experience !== undefined
              ? [`${Math.floor(vacancy.min_experience)} YEARS`]
              : [],
          languages: vacancy.spoken_languages
            ? vacancy.spoken_languages.map((l) => l.toUpperCase())
            : [],
        };
        setFilters(nextFilters); // Update the UI state
        toast.success("Vacancy requirements applied 🎯");
      } else {
        // Clear filters for Hot Leads or Database
        nextFilters = {
          experiences: [],
          educations: [],
          districts: [],
          cities: [],
          genders: [],
          industries: [],
          skills: [],
          languages: [],
          ages: [],
        };
        setFilters(nextFilters);
      }
    }

    setActiveMetricTab(activeTab);
    setShowMetadata(false);
    setLoadingMetrics(true);

    try {
      const params = new URLSearchParams();
      if (activeTab !== "database") params.append("vacancy_id", id);
      if (activeTab === "responses") params.append("status", "jd_sent");
      if (searchQuery) params.append("search", searchQuery);

      // 🛠️ Plural & Lowercase Mapping (Matching your previous request)
      nextFilters.skills.forEach((skill) =>
        params.append("skills", skill.toLowerCase()),
      );
      nextFilters.industries.forEach((ind) =>
        params.append("industry", ind.toLowerCase()),
      );
      nextFilters.cities.forEach((city) =>
        params.append("city", city.toLowerCase()),
      );
      nextFilters.educations.forEach((edu) =>
        params.append("education", edu.toLowerCase()),
      );
      nextFilters.genders.forEach((gen) =>
        params.append("gender", gen.toLowerCase()),
      );
      nextFilters.languages.forEach((l) =>
        params.append("languages", l.toLowerCase()),
      );

      // 2. Age Range Mapping Protocol
      if (currentFilters.ages.length > 0) {
        const range = currentFilters.ages[0];
        if (range === "18 - 25") {
          params.append("min_age", 18);
          params.append("max_age", 25);
        } else if (range === "26 - 35") {
          params.append("min_age", 26);
          params.append("max_age", 35);
        } else if (range === "36 - 45") {
          params.append("min_age", 36);
          params.append("max_age", 45);
        } else if (range === "45+") {
          params.append("min_age", 45);
        }
      }

      const url = `https://apihrr.goelectronix.co.in/candidates?${params.toString()}`;
      const res = await fetch(url);
      const rawData = await res.json();

      setMetrics((prev) => ({
        ...prev,
        [activeTab]: rawData.length || 0,
      }));

      // Re-sync phone numbers (Keeping your existing logic)
      const synchronizedData = await Promise.all(
        rawData.map(async (c) => {
          const existingIds =
            c.applied_vacancy_ids
              ?.toString()
              .split(",")
              .map((x) => x.trim()) || [];
          if (existingIds.includes(id.toString())) {
            try {
              const pRes = await fetch(
                `https://apihrr.goelectronix.co.in/candidates/${c.id}`,
              );
              const pData = await pRes.json();
              return { ...c, phone: pData.phone };
            } catch (e) {
              return c;
            }
          }
          return c;
        }),
      );

      setMetricData(synchronizedData);
    } catch (err) {
      toast.error("Candidate fetch failed");
    } finally {
      setLoadingMetrics(false);
    }
  };

  const getPaginationGroup = () => {
    const range = [];
    const delta = 1;
    for (let i = 1; i <= totalCandidatePages; i++) {
      if (
        i === 1 ||
        i === totalCandidatePages ||
        (i >= candidatePage - delta && i <= candidatePage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  const clearAllFilters = () => {
    setFilters({
      experiences: [],
      educations: [],
      districts: [], // 🟢 Reset Districts
      cities: [], // 🟢 Reset Cities
      genders: [],
      industries: [], // 🟢 Reset Industries
    });

    setRegistrySearch("");

    // Reset pagination to page 1
    setCandidatePage(1);
  };

  const formatEnterpriseDate = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString("en-US", { month: "short" }).toUpperCase()}-${date.getFullYear()}`;
  };

  // 1. Extract unique Districts from the current metric data
  const districtOptions = useMemo(() => {
    const set = new Set();
    metricData.forEach((c) => {
      if (c.district) set.add(c.district.toUpperCase());
    });
    return Array.from(set).sort();
  }, [metricData]);

  // 2. Extract Cities based on selected Districts
  const dependentCityOptions = useMemo(() => {
    const set = new Set();
    metricData.forEach((c) => {
      const candidateDist = c.district?.toUpperCase();

      // Logic: If no district is selected, show all.
      // If district is selected, only show cities belonging to that district.
      if (
        filters.districts.length === 0 ||
        filters.districts.includes(candidateDist)
      ) {
        if (c.city) set.add(c.city.toUpperCase());
      }
    });
    return Array.from(set).sort();
  }, [metricData, filters.districts]);

  const toggleNumberReveal = async (candidate) => {
    if (revealedNumbers[candidate.id]) return;

    const loadingToast = toast.loading("Revealing Identity Node...");

    try {
      // 1. DATA NORMALIZATION
      const rawValue = candidate.applied_vacancy_ids;
      let existingIds = [];
      if (rawValue !== null && rawValue !== undefined) {
        existingIds = rawValue
          .toString()
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      // 2. CLUSTER AGGREGATION
      const currentVacancyId = id.toString();
      const updatedClusterArray = [
        ...new Set([...existingIds, currentVacancyId]),
      ];
      const updatedClusterString = updatedClusterArray.join(",");

      // 3. PATCH: Update Access Registry
      const formPayload = new FormData();
      formPayload.append("applied_vacancy_ids", updatedClusterString);

      const patchRes = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
        {
          method: "PATCH",
          body: formPayload,
        },
      );

      if (!patchRes.ok) throw new Error("Registry Sync Failed");

      // 4. GET: Fetch Fresh Candidate Profile (This gets the real phone number)
      const getRes = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
      );
      const freshData = await getRes.json();

      // 5. ATOMIC STATE UPDATE: Update ONLY this candidate in the current list
      // This prevents the whole list from disappearing/reloading
      setMetricData((prevData) =>
        prevData.map((item) =>
          item.id === candidate.id
            ? { ...item, ...freshData, phone: freshData.phone }
            : item,
        ),
      );

      // 6. UPDATE REVEALED CACHE
      setRevealedNumbers((prev) => ({
        ...prev,
        [candidate.id]: true,
      }));

      toast.success("Candidate Number Revealed", { id: loadingToast });

      // ⚠️ REMOVE handleTabClick(activeMetricTab) from here
      // because it clears the list and shows the loader.
      // The setMetricData above handles the UI refresh smoothly.
    } catch (err) {
      console.error("Telemetry Error:", err);
      toast.error("Access Denied", { id: loadingToast });
    }
  };

  const isRevealedForThisVacancy = (candidate) => {
    const currentId = id.toString();

    // Check local state first for immediate UI feedback
    if (revealedNumbers[candidate.id]) return true;

    // Check the data from the API
    const existingIds = candidate.applied_vacancy_ids
      ? candidate.applied_vacancy_ids
          .toString()
          .split(",")
          .map((x) => x.trim())
      : [];

    return existingIds.includes(currentId);
  };

  // 1. Fetch Follow-Up Queue
// const fetchFollowUpRegistry = async (variation) => {
//   setFollowUpVariation(variation);
//   setIsFollowUpLoading(true);
//   setActiveMetricTab(null);
//   setShowMetadata(false); // Hide the vacancy post
//   setActiveMetricTab(null); // Deselect top tabs

//   try {
//     const res = await fetch(`https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${id}&variation=${variation}`);
//     const result = await res.json();
    
//     setFollowUpData(result.data || []);
    
//     if (result.counts) {
//       setFollowUpMetrics({
//         today: result.counts.schedule_interaction || 0,
//         future: result.counts.call_not_connected || 0,
//         pending: result.counts.visited || 0,
//         reject: result.counts.reject || 0
//       });
//     }
//   } catch (err) {
//     console.error("Registry Sync Failed", err);
//     toast.error("Failed to sync queue");
//   } finally {
//     setIsFollowUpLoading(false);
//   }
// };

const fetchFollowUpRegistry = async (variation) => {
  setFollowUpVariation(variation);
  setIsFollowUpLoading(true);
  setActiveMetricTab(null);
  setShowMetadata(false);

  try {
    let url = "";
    // 🎯 Variation Logic Hub
    if (variation === "today") url = `https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${id}&variation=today`;
    else if (variation === "future") url = `https://apihrr.goelectronix.co.in/follow-ups?vacancy_id=${id}&variation=future`;
    else if (variation === "pending") url = `https://apihrr.goelectronix.co.in/follow-ups?status=overdue&vacancy_id=${id}`;
    else if (variation === "reject") url = `https://apihrr.goelectronix.co.in/follow-ups?action_type=reject&vacancy_id=${id}`;

    const res = await fetch(url);
    const result = await res.json();
    
    setFollowUpData(result.data || []);
    
    // 🎯 Update Metrics logic
    setFollowUpMetrics(prev => ({
      ...prev,
      [variation]: variation === "reject" 
        ? (result?.counts?.reject || 0) 
        : Object.values(result?.counts || {}).reduce((a, b) => a + b, 0)
    }));

  } catch (err) {
    toast.error("Failed to sync queue");
  } finally {
    setIsFollowUpLoading(false);
  }
};

const executeFollowUpProtocol = async () => {
  if (!decisionData.status) {
    return toast.error("Status Node Required ❌");
  }

  // Use the loading state you already have or the toast loading
  const loadingToast = toast.loading("Transmitting Follow-Up Data...");

  try {
    // 1. FORMAT DATA: Construct the Request Body using the 'id' from useParams
    const payload = {
      candidate_ids: [decisionCandidate.id], 
      vacancy_id: parseInt(id), // 'id' from useParams()
      action_type: decisionData.status, 
      status: "pending", 
      remark: decisionData.remark || "No remarks provided.",
      send_email: true, 
      scheduled_at: decisionData.follow_up_date && decisionData.follow_up_time 
        ? `${decisionData.follow_up_date}T${decisionData.follow_up_time}:00.000Z`
        : new Date().toISOString(),
      schedule_link: "" 
    };

    // 2. TRANSMISSION
    const response = await fetch("https://apihrr.goelectronix.co.in/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("API Transmission Failed");

    // 3. SUCCESS PROTOCOL
    toast.success("Registry Protocol Updated successfully 🚀", { id: loadingToast });
    
    // Reset and Close
    setDecisionCandidate(null);
    setDecisionData({ status: "", remark: "", follow_up_date: "", follow_up_time: "" });
    
    // Refresh counts and current list to reflect new data
    fetchAllDetails();
    if (activeMetricTab) {
        handleTabClick(activeMetricTab, filters, registrySearch, true);
    }
    if (followUpVariation) {
        fetchFollowUpRegistry(followUpVariation);
    }

  } catch (err) {
    console.error("Transmission Error:", err);
    toast.error("Protocol Error: Failed to sync with server", { id: loadingToast });
  }
};

// 🎯 Add this at the top level of your VacancyDetails component
// 🎯 Add this at the top level of your VacancyDetails component
// const isInteractionVisited = useMemo(() => {
//   return followUpHistory.some(log => log.action_type === "visited");
// }, [followUpHistory]);


// 🎯 Only returns true if the MOST RECENT interaction is "visited"
const isLatestInteractionVisited = useMemo(() => {
  if (!followUpHistory || followUpHistory.length === 0) return false;

  // Sort history to find the absolute latest entry by date
  const latestEntry = [...followUpHistory].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )[0];

  return latestEntry?.action_type === "visited";
}, [followUpHistory]);

  const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
          {icon} {label}
        </label>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 border rounded-2xl text-[11px] font-bold transition-all ${
            selected
              ? "!bg-blue-50 !border-blue-200 !text-blue-700"
              : "!bg-slate-50 !border-slate-200 !text-slate-700 !hover:border-blue-400"
          }`}
        >
          <span className="truncate uppercase">
            {selected || "Select Unit"}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            {/* Overlay to close dropdown when clicking outside */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute top-full left-0 w-full mt-2 !bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
              {/* "All" or "Reset" Option */}
              <button
                onClick={() => {
                  onSelect("");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-[10px] !bg-transparent font-black uppercase !text-slate-400 hover:!bg-slate-50 transition-colors border-b !border-slate-50"
              >
                Clear Filter
              </button>

              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false); // Close immediately on selection
                  }}
                  className={`w-full text-left px-4 py-3 text-[10px] font-black !bg-transparent uppercase transition-colors border-b !border-slate-50 last:border-0 ${
                    selected === opt
                      ? "!bg-white !text-black"
                      : "!text-slate-600 hover:!bg-white hover:!text-blue-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };


  // 1. Toggle Single Selection
const toggleSelect = (id) => {
  setMetricData(prev => prev.map(c => 
    c.id === id ? { ...c, selected: !c.selected } : c
  ));
};

// 2. Toggle Select All (Current Page)
const toggleSelectAll = () => {
  const allSelected = currentCandidates.every(c => c.selected);
  setMetricData(prev => prev.map(c => 
    currentCandidates.find(curr => curr.id === c.id) 
      ? { ...c, selected: !allSelected } 
      : c
  ));
};



// 3. API: Send JD Logic
const handleSendJD = async () => {
  const targetIds = singleMailCandidate 
    ? [singleMailCandidate.id] 
    : metricData.filter(c => c.selected).map(c => c.id);

  if (!targetIds.length) return toast.error("Please select candidates");

  const loadingToast = toast.loading("Transmitting JDs...");
  try {
    const payload = {
      candidate_ids: targetIds,
      template_id: Number(selectedTemplate) || null,
      custom_role: vacancy?.title || "",
    };

    const res = await fetch("https://apihrr.goelectronix.co.in/emails/send-jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Transmission Failed");

    toast.success("JDs sent successfully 🚀", { id: loadingToast });
    setIsMailModalOpen(false);
    setSingleMailCandidate(null);
    // Unselect all
    setMetricData(prev => prev.map(c => ({ ...c, selected: false })));
  } catch (err) {
    toast.error("Failed to send JDs", { id: loadingToast });
  }
};

// Fetch Templates on mount
useEffect(() => {
  fetch("https://apihrr.goelectronix.co.in/job-descriptions").then(res => res.json()).then(data => setTemplates(data));
}, []);

const selectedCount = metricData.filter(c => c.selected).length;


  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Loading Fetch Data...
        </p>
      </div>
    );

  const labelClass =
    "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
  const valueClass =
    "text-sm font-bold text-slate-700 uppercase tracking-tight";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none"
          >
            <ChevronLeft size={16} /> Back to Search
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            {/* --- HEADER IDENTITY SECTION --- */}

            <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
              {/* Security Watermark */}
              <ShieldCheck
                className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none"
                size={320}
              />

              <div className="relative z-10 flex flex-col gap-10">
                {/* TOP ROW: Organization & Title */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-6  w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
                      {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
                      <div className="flex items-center gap-5">
                        {/* Identity Box */}
                        <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
                          <Building2 size={32} strokeWidth={2.5} />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
                            Hiring Organization
                          </span>
                          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
                            {company?.name || vacancy?.company?.name}
                          </h2>
                        </div>

                        {(activeMetricTab || followUpVariation) && (
                          <button
                            // onClick={() => setShowMetadata(!showMetadata)}
                            onClick={() => {
                              if (!showMetadata) {
                                // 🟢 If we are showing the Post, we must hide the Candidate Registry box
                                setShowMetadata(true);
                                setActiveMetricTab(null); // This clears the registry selection
                                setFollowUpVariation(null);
                              } else {
                                setShowMetadata(false);
                              }
                            }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
                              showMetadata
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            <Layers size={14} strokeWidth={3} />
                            {showMetadata ? "View Candidate List" : "Overview"}
                          </button>
                        )}
                      </div>

                      {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
                          {/* Visual Indicator Branding Box */}

                          <div className="flex flex-col pr-2">
                            <div
                              className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
                                vacancy?.status === "open"
                                  ? "text-emerald-500"
                                  : vacancy?.status === "closed"
                                    ? "text-red-500"
                                    : "text-orange-400"
                              }`}
                            >
                              {/* Pulsing Core Indicator */}
                              <div
                                className={`h-2 w-2 rounded-full animate-pulse ${
                                  vacancy?.status === "open"
                                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                    : vacancy?.status === "closed"
                                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                      : "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                                }`}
                              />

                              {vacancy?.status
                                ? vacancy.status.replace("_", " ")
                                : "PENDING"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
                        Position
                      </span>
                      <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
                        {vacancy?.title}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <MetricTab
                    icon={Users}
                    label="Hot Match"
                    count={metrics.responses}
                    isActive={activeMetricTab === "responses"}
                    iconBg="bg-blue-50"
                    colorClass="text-blue-600"
                    onClick={() => handleTabClick("responses")}
                  />
                  <MetricTab
                    icon={Zap}
                    label="Hot Leads"
                    count={metrics.leads}
                    isActive={activeMetricTab === "leads"}
                    iconBg="bg-orange-50"
                    colorClass="text-orange-500"
                    onClick={() => handleTabClick("leads")}
                  />
                  <MetricTab
                    icon={ShieldCheck}
                    label="Total Candidate"
                    count={metrics.database}
                    isActive={activeMetricTab === "database"}
                    iconBg="bg-slate-50"
                    colorClass="text-slate-600"
                    onClick={() => handleTabClick("database")}
                  />
                
                </div>

               
{/* <div>
   <div className="flex items-center gap-3 mb-5 ml-1">
 
  <div className="relative flex h-2 w-2">
    <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25" />
    <div className="relative h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
  </div>
  
  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
    Follow Up 
  </h2>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-1">
  <MetricTab
    icon={Users}
    label="Today"
    count={metrics.responses}
    isActive={activeMetricTab === "responses"} // 🟢 Changed from activeTab
    iconBg="bg-blue-50"
    colorClass="text-blue-600"
    onClick={() => handleTabClick("responses")}
  />
  <MetricTab
    icon={Zap}
    label="Future"
    count={metrics.leads}
    isActive={activeMetricTab === "hot_leads"} // 🟢 Changed from activeTab
    iconBg="bg-orange-50"
    colorClass="text-orange-500"
    onClick={() => handleTabClick("hot_leads")}
  />
  <MetricTab
    icon={Clock}
    label="Pending"
    count={metrics.all}
    isActive={activeMetricTab === "pending"} // 🟢 Changed from activeTab
    iconBg="bg-slate-50"
    colorClass="text-slate-600"
    onClick={() => handleTabClick("pending")}
  />
  <MetricTab
    icon={XCircle}
    label="Reject"
    count={metrics.rejected || 0}
    isActive={activeMetricTab === "rejected"} // 🟢 Changed from activeTab
    iconBg="bg-red-50"
    colorClass="text-red-600"
    onClick={() => handleTabClick("rejected")}
  />
</div>
</div> */}


{/* --- FOLLOW UP HUB --- */}
<div className="mt-8">
  <div className="flex items-center gap-3 mb-5 ml-1">
    <div className="relative flex h-2 w-2">
      <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25" />
      <div className="relative h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
    </div>
    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Follow Up </h2>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-1">
    <MetricTab
      icon={Users}
      label="Today"
      count={followUpMetrics.today}
      isActive={followUpVariation === "today"}
      iconBg="bg-blue-50"
      colorClass="text-blue-600"
      onClick={() => fetchFollowUpRegistry("today")}
    />
    <MetricTab
      icon={Zap}
      label="Future"
      count={followUpMetrics.future}
      isActive={followUpVariation === "future"}
      iconBg="bg-orange-50"
      colorClass="text-orange-500"
      onClick={() => fetchFollowUpRegistry("future")}
    />
    <MetricTab
      icon={Clock}
      label="Pending"
      count={followUpMetrics.pending}
      isActive={followUpVariation === "pending"}
      iconBg="bg-slate-50"
      colorClass="text-slate-600"
      onClick={() => fetchFollowUpRegistry("pending")}
    />
    <MetricTab
      icon={XCircle}
      label="Reject"
      count={followUpMetrics.reject}
      isActive={followUpVariation === "reject"}
      iconBg="bg-red-50"
      colorClass="text-red-600"
      onClick={() => fetchFollowUpRegistry("reject")}
    />
  </div>
</div>

                {/* BOTTOM ROW: Core Protocol Summary */}
                {/* <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
                  {[
                    {
                      icon: <Briefcase size={14} />,
                      label: "Type",
                      value: vacancy?.job_type,
                    },
                    {
                      icon: <Clock size={14} />,
                      label: "Experience",
                      value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y`,
                    },
                    {
  icon: <IndianRupee size={14} />,
  label: "CTC",
  // 🎯 Logic: Divide raw numbers by 100,000 to get Lakhs (e.g., 500000 -> 5)
  value: vacancy?.min_salary && vacancy?.max_salary 
    ? `${Math.floor(vacancy.min_salary / 100000)} - ${Math.floor(vacancy.max_salary / 100000)} LPA`
    : "Not Specified",
},
                    {
                      icon: <MapPin size={14} />,
                      label: "location",
                      value: vacancy?.location[0],
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200"
                    >
                      <div className="text-blue-600">{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">
                          {item.label}
                        </span>
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
  {[
    {
      icon: <Briefcase size={14} />,
      label: "Type",
      value: vacancy?.job_type || "N/A",
    },
    {
      icon: <Clock size={14} />,
      label: "Experience",
      value: vacancy?.min_experience !== undefined ? `${vacancy.min_experience}-${vacancy.max_experience}Y` : "N/A",
    },
    {
      icon: <IndianRupee size={14} />,
      label: "CTC",
      value: vacancy?.min_salary && vacancy?.max_salary 
        ? `${Math.floor(vacancy.min_salary / 100000)} - ${Math.floor(vacancy.max_salary / 100000)} LPA`
        : "Not Specified",
    },
    {
      icon: <MapPin size={14} />,
      label: "Location",
      value: vacancy?.location?.[0] || "Remote",
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200 min-w-0 h-full"
    >
      <div className="flex-shrink-0 text-blue-600 bg-blue-50 p-2 rounded-lg">
        {item.icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {item.label}
        </span>
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none truncate" title={item.value}>
          {item.value}
        </span>
      </div>
    </div>
  ))}
</div>
              </div>
            </section>
          </div>

          {/* --- SIDEBAR MODULE --- */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32 pb-12">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
                Job Details
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className={labelClass}>Contact Person Number</span>
                    <p className={valueClass}>
                      {company?.contact_number ||
                        vacancy?.company?.phone ||
                        "+91 ••••••••••"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <span className={labelClass}>Contact Person</span>
                    <p className={valueClass}>
                      {company?.contact_person ||
                        vacancy?.company?.contact_person ||
                        "Hiring Lead"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-blue-600 rounded-2xl relative overflow-hidden group shadow-lg shadow-blue-200 ">
                <ShieldCheck
                  className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700"
                  size={100}
                />
                <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">
                  Closing Date
                </p>
                <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">
                  {formatEnterpriseDate(vacancy?.deadline_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full">
          {/* --- MASTER SWITCH CONTENT AREA --- */}

          {/* 🔵 CANDIDATE REGISTRY VIEW */}
          {activeMetricTab && !showMetadata && !followUpVariation && (
            <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
              <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
                {/* Header Info */}
                {/* ================= FILTER REGISTRY CONSOLE ================= */}
                <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                    {/* SECTION HEADER */}
                    <div className="flex items-center gap-3 mb-6 px-1">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
                        <Layers size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Filter
                      </span>
                    </div>

                    {/* FILTER GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                      {/* EXPERIENCE FILTER */}
                      <FilterDropdown
                        label="Experience"
                        icon={<Clock size={13} />}
                        options={[
                          "0-1 Years",
                          "1-3 Years",
                          "3-5 Years",
                          "5-10 Years",
                          "10+ Years",
                        ]}
                        selected={filters.experiences}
                        onSelect={(v) => toggleFilter("experiences", v)}
                      />

                      {/* EDUCATION FILTER */}
                      <FilterDropdown
                        label="Eduction"
                        icon={<GraduationCap size={13} />}
                        options={educationMasters.map((edu) =>
                          edu.name.toUpperCase(),
                        )}
                        selected={filters.educations}
                        onSelect={(v) => toggleFilter("educations", v)}
                      />

                      <FilterDropdown
                        label="Language"
                        icon={<Languages size={13} />}
                        options={[
                          "ENGLISH",
                          "HINDI",
                          "MARATHI",
                          "GUJARATI",
                          "TAMIL",
                        ]}
                        selected={filters.languages}
                        onSelect={(v) => toggleFilter("languages", v)}
                      />

                      {/* 🎂 AGE RANGE FILTER */}
                      <FilterDropdown
                        label="Age Range"
                        icon={<Calendar size={13} />}
                        options={["18 - 25", "26 - 35", "36 - 45", "45+"]}
                        selected={filters.ages}
                        onSelect={(v) => toggleFilter("ages", v)}
                      />

                      {/* 🏭 INDUSTRY FILTER (New) */}
                      <FilterDropdown
                        label="Industry"
                        icon={<Building2 size={13} />}
                        options={industries.map((ind) =>
                          ind.name.toUpperCase(),
                        )}
                        selected={filters.industries}
                        onSelect={(v) => toggleFilter("industries", v)}
                      />

                      <FilterDropdown
                        label="District"
                        icon={<MapPin size={13} />}
                        options={districtOptions}
                        selected={filters.districts}
                        onSelect={(v) => {
                          toggleFilter("districts", v);
                          // Optional: Clear cities when district changes to avoid invalid combinations
                          setFilters((prev) => ({ ...prev, cities: [] }));
                        }}
                      />

                      {/* CITY FILTER (Dependent) */}
                      <FilterDropdown
                        label="City"
                        icon={<Navigation size={13} />}
                        options={dependentCityOptions}
                        selected={filters.cities}
                        onSelect={(v) => toggleFilter("cities", v)}
                      />

                      {/* GENDER FILTER */}
                      <FilterDropdown
                        label="Gender"
                        icon={<Users size={13} />}
                        options={["MALE", "FEMALE", "OTHER"]}
                        selected={filters.genders}
                        onSelect={(v) => toggleFilter("genders", v)}
                      />

                      <FilterDropdown
                        label="Skills"
                        icon={<Zap size={13} />}
                        options={skillOptions}
                        selected={filters.skills}
                        onSelect={(v) => toggleFilter("skills", v)}
                      />
                    </div>

                  
                    {/* ACTIVE FILTER CHIPS */}
                    {Object.values(filters).some((arr) => arr.length > 0) && (
                      <div
                        className={`mt-8 pt-6 border-t flex flex-wrap items-center gap-3 p-4 rounded-2xl border-dashed transition-all ${
                          activeMetricTab === "responses"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-slate-100"
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">
                          {activeMetricTab === "responses"
                            ? "Requirement Match:"
                            : "Filter Applied:"}
                        </span>
                        {Object.entries(filters).map(([cat, vals]) =>
                          vals.map((v) => (
                            <button
                              key={v}
                              onClick={() => toggleFilter(cat, v)}
                              className="flex items-center gap-2 px-3 py-1.5 !bg-white !text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-500"
                            >
                              {v}{" "}
                              <X
                                size={12}
                                className="text-blue-300 group-hover:text-white"
                              />
                            </button>
                          )),
                        )}
                        <button
                          onClick={clearAllFilters}
                          className="ml-auto text-[9px] !bg-transparent font-black uppercase !text-black hover:underline"
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
                  {/* SELECT ALL NODE */}
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group transition-all hover:bg-white hover:border-blue-200">
      <input
        type="checkbox"
        checked={currentCandidates.length > 0 && currentCandidates.every((c) => c.selected)}
        onChange={toggleSelectAll}
        className="w-5 h-5 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer transition-transform group-hover:scale-110"
      />
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">
        Select All
      </label>
    </div>

    <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
                      <Activity size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                      {activeMetricTab} Candidate
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 flex-1 justify-end">
                    {/* SEARCH NODE */}
                    <div className="relative group flex-1 max-w-[280px]">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
                        <Search size={14} strokeWidth={3} />
                      </div>
                      <input
                        type="text"
                        placeholder="Filter by name..."
                        value={registrySearch}
                        onChange={(e) => setRegistrySearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
                      />
                      {registrySearch && (
                        <button
                          onClick={() => setRegistrySearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                    {/* 🚀 SHOOT MAIL BUTTON */}
    <button
      onClick={() => {
        setSingleMailCandidate(null);
        if (vacancy?.job_description?.id) setSelectedTemplate(vacancy.job_description.id.toString());
        setIsMailModalOpen(true);
      }}
      disabled={selectedCount === 0}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        selectedCount > 0 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95" 
          : "!bg-slate-100 !text-slate-400 cursor-not-allowed"
      }`}
    >
      <Mail size={14} />
      {selectedCount <= 1 ? "Shoot Mail" : `Shoot ${selectedCount} Mails`}
    </button>

                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
                      {filteredResults.length} Found
                    </span>

                    <button
                      onClick={() => {
                        setActiveMetricTab(null);
                        setRegistrySearch("");
                      }}
                      className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {loadingMetrics ? (
                  <div className="py-32 flex flex-col items-center justify-center animate-pulse">
                    <Loader2
                      size={40}
                      className="text-blue-600 animate-spin mb-4"
                    />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      Synchronizing Registry...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                      {currentCandidates.map((c) => (
                        /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
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
                                {/* 🎯 INDIVIDUAL CHECKBOX */}
    <input
      type="checkbox"
      checked={c.selected || false}
      onChange={() => toggleSelect(c.id)}
      className="w-5 h-5 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer transition-transform hover:scale-110"
    />
                                <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
                                  {(c.full_name || "U").charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
                                    {c.full_name?.toLowerCase()}
                                  </h3>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {c.age || "Not Specified"} •{" "}
                                    {c.gender || "Not Specified"}
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
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                                      Experience
                                    </span>
                                    <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                                      {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
                                      {parseFloat(c.total_experience_years) ===
                                      0
                                        ? "Fresher"
                                        : `${c.total_experience_years} Years`}
                                    </span>
                                  </div>
                                </div>

                                {/* LOCATION NODE */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
                                    <MapPin size={18} strokeWidth={2.5} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                                      Location
                                    </span>
                                    <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                                      {c.location || "Not Specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* SALARY NODE */}
                                <div className="flex items-center gap-3 min-w-[140px]">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
                                    <span className="text-[16px] font-black leading-none">
                                      ₹
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
                                      Prev. CTC
                                    </span>
                                    <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                                      {c.previous_ctc
                                        ? `${(c.previous_ctc / 100000).toFixed(2)} LPA`
                                        : "Not Specified"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
                            <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
                              {/* Vertical System Accent */}
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                {/* COLUMN 1: CURRENT JOB */}
                                <div className="flex items-center gap-3">
                                  <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
                                    <Briefcase size={14} strokeWidth={3} />
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
                                      Current Job
                                    </p>
                                    <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
                                      {c.latest_job_title || "Not Specified"}
                                    </p>
                                  </div>
                                </div>

                                {/* COLUMN 2: CANDIDATE AGE */}
                                <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
                                  <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
                                    <GraduationCap size={14} strokeWidth={3} />
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
                                      Eduction
                                    </p>
                                    <p className="text-[12px] font-black text-slate-700 uppercase">
                                      {c.latest_education || "Not Specified"}
                                    </p>
                                  </div>
                                </div>

                                {/* COLUMN 3: LANGUAGES HUB */}
                                <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
                                  {/* 🟢 ALIGNED HEADER UNIT */}
                                  <div className="flex items-center gap-3">
                                    {/* Branding Box - Sized to match the visual weight of the title */}
                                    <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
                                      <Languages size={14} strokeWidth={2.5} />
                                    </div>

                                    {/* Heading - Vertically centered with icon */}
                                    <div>
                                      <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
                                        Spoken Language
                                      </p>
                                      {/* 🔵 CONTENT AREA */}
                                      <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
                                        {(c.languages_spoken || []).length >
                                        0 ? (
                                          <>
                                            {(c.isLanguagesExpanded
                                              ? c.languages_spoken
                                              : c.languages_spoken.slice(0, 2)
                                            ).map((lang, idx) => (
                                              <span
                                                key={idx}
                                                className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
                                              >
                                                {lang}
                                              </span>
                                            ))}

                                            {/* TOGGLE BUTTON */}
                                            {c.languages_spoken.length > 2 && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMetricData((prev) =>
                                                    prev.map((item) =>
                                                      item.id === c.id
                                                        ? {
                                                            ...item,
                                                            isLanguagesExpanded:
                                                              !item.isLanguagesExpanded,
                                                          }
                                                        : item,
                                                    ),
                                                  );
                                                }}
                                                className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
                                                  c.isLanguagesExpanded
                                                    ? "bg-slate-800 text-white shadow-md"
                                                    : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
                                                }`}
                                              >
                                                {c.isLanguagesExpanded
                                                  ? "Less"
                                                  : `+${c.languages_spoken.length - 2} More`}
                                              </button>
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
                                            Not Specified
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
                                {/* SKILLS REGISTRY */}
                                <div className="space-y-2">
                                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
                                    Skills
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {(c.skills || []).length > 0 ? (
                                      <>
                                        {(c.isSkillsExpanded
                                          ? c.skills
                                          : c.skills.slice(0, 2)
                                        ).map((skill, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                        {c.skills.length > 2 && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setMetricData((prev) =>
                                                prev.map((item) =>
                                                  item.id === c.id
                                                    ? {
                                                        ...item,
                                                        isSkillsExpanded:
                                                          !item.isSkillsExpanded,
                                                      }
                                                    : item,
                                                ),
                                              );
                                            }}
                                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
                                              c.isSkillsExpanded
                                                ? "bg-slate-800 text-white"
                                                : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
                                            }`}
                                          >
                                            {c.isSkillsExpanded
                                              ? "Less"
                                              : `+${c.skills.length - 2} More`}
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-300 italic uppercase">
                                        No Skills
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* INDUSTRIES HUB */}
                                <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
                                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
                                    Industry
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                    {(c.industries_worked || []).length > 0 ? (
                                      <>
                                        {(c.isIndustriesExpanded
                                          ? c.industries_worked
                                          : c.industries_worked.slice(0, 2)
                                        ).map((ind, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95"
                                          >
                                            <Layers size={10} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">
                                              {ind.name || ind}
                                            </span>
                                          </div>
                                        ))}
                                        {c.industries_worked.length > 2 && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setMetricData((prev) =>
                                                prev.map((item) =>
                                                  item.id === c.id
                                                    ? {
                                                        ...item,
                                                        isIndustriesExpanded:
                                                          !item.isIndustriesExpanded,
                                                      }
                                                    : item,
                                                ),
                                              );
                                            }}
                                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
                                              c.isIndustriesExpanded
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                                            }`}
                                          >
                                            {c.isIndustriesExpanded
                                              ? "Less"
                                              : `+${c.industries_worked.length - 2} More`}
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-300 italic uppercase">
                                        No Sectors
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* BOTTOM ACTION BAR */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
                              {/* --- CONTACT NODE --- */}
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg transition-all duration-500 ${
                                    revealedNumbers[c.id]
                                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                      : "bg-slate-100 text-slate-400"
                                  }`}
                                >
                                  <Phone size={14} strokeWidth={2.5} />
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    Contact Number
                                  </span>

                                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
                                    {isRevealedForThisVacancy(c) ? (
                                      <span className="animate-in fade-in zoom-in-95 duration-300">
  {c.phone ? (
    <>
      <span className="text-slate-400 font-bold mr-1">+91</span>
      {c.phone}
    </>
  ) : (
    "No Data"
  )}
</span>
                                    ) : (
                                      <span className="text-slate-300 select-none tracking-[0.3em]">
                                        +91 ••••••••••
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* RIGHT SIDE: ACTIONS */}
                              <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* <button
                                  onClick={() =>
                                    navigate(`/candidateflow?id=${c.id}`)
                                  }
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                                >
                                  <Gavel size={14} /> Decision
                                </button> */}
                              {isRevealedForThisVacancy(c) && (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        setDecisionCandidate(c);
        setDecisionData({ 
          status: c.status || "", 
          remark: c.remark || "", 
          follow_up_date: "", 
          follow_up_time: "" 
        });
        
        // Fetch History for the modal
        setLoadingHistory(true);
        try {
          const vId = id; // From useParams
          const res = await fetch(`https://apihrr.goelectronix.co.in/follow-ups/${c.id}?vacancy_id=${vId}`);
          const result = await res.json();
          setFollowUpHistory(result.data || []);
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
                                    navigate(`/profile/${c.id}`);
                                  }}
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
                                >
                                  {/* Branding Box Icon Effect */}
                                  <UserCheck
                                    size={14}
                                    strokeWidth={3}
                                    className="group-hover:scale-110 transition-transform"
                                  />
                                  View Candidate
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
                    {totalCandidatePages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
                        {/* LEFT SIDE: Technical Registry Info */}
                        <div className="flex items-center gap-4">
                          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                              Showing{" "}
                              <span className="text-slate-900">
                                {indexOfFirstCandidate + 1} -{" "}
                                {Math.min(
                                  indexOfLastCandidate,
                                  metricData.length,
                                )}
                              </span>
                              <span className="mx-2 opacity-30">|</span>
                              Total{" "}
                              <span className="text-slate-900">
                                {metricData.length}
                              </span>{" "}
                              Entries
                            </p>
                          </div>
                        </div>

                        {/* RIGHT SIDE: Navigation Controls */}
                        <div className="flex items-center gap-3">
                          {/* Previous Page Arrow */}
                          <button
                            disabled={candidatePage === 1}
                            onClick={() => setCandidatePage((p) => p - 1)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
                          >
                            <ChevronLeft size={18} strokeWidth={3} />
                          </button>

                          {/* Truncated Number Strip */}
                          <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
                            {getPaginationGroup().map((item, index) => (
                              <React.Fragment key={index}>
                                {item === "..." ? (
                                  <div className="w-8 flex items-center justify-center">
                                    <span className="text-[10px] font-black !text-slate-300 tracking-tighter">
                                      •••
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setCandidatePage(item)}
                                    className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
                                      candidatePage === item
                                        ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
                                        : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
                                    }`}
                                  >
                                    {item.toString().padStart(2, "0")}
                                  </button>
                                )}
                              </React.Fragment>
                            ))}
                          </div>

                          {/* Next Page Arrow */}
                          <button
                            disabled={candidatePage === totalCandidatePages}
                            onClick={() => setCandidatePage((p) => p + 1)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
                          >
                            <ChevronRight size={18} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- 🔵 VIEW C: FOLLOW UP QUEUE --- */}
{followUpVariation && !showMetadata && (
  <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500 w-full mb-10">
    <div className="flex items-center justify-between px-6 mb-4">
      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{followUpVariation} Queue</h3>
      <button onClick={() => {setFollowUpVariation(null); setShowMetadata(true);}} className="text-[9px] font-black !text-blue-600 uppercase !bg-transparent tracking-widest flex items-center gap-2">
        <X size={14} /> Close View
      </button>
    </div>

    {isFollowUpLoading ? (
      <div className="bg-white p-16 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border border-slate-100"><Loader2 className="animate-spin text-blue-600" /></div>
    ) : followUpData.length > 0 ? (
     followUpData.map((item) => (
  <div key={item.id} className="!bg-white border !border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:!border-blue-400 hover:shadow-md transition-all group overflow-hidden">
    
    {/* 1. CANDIDATE IDENTITY NODE (18%) */}
    <div className="flex items-center gap-4 w-[18%] min-w-0">
      <div className="h-11 w-11 rounded-xl !bg-white flex items-center justify-center !text-blue-500 text-sm font-black uppercase ring-2 ring-slate-50 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
        {item.candidate?.full_name?.charAt(0) || "U"}
      </div>
      <div className="min-w-0">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Candidate</span>
        <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight truncate">
          {item.candidate?.full_name || "Unknown"}
        </p>
      </div>
    </div>

    {/* 2. INDUSTRY / AREA NODE (20%) */}
    <div className="flex items-center gap-4 w-[20%] border-l border-slate-100 pl-8 min-w-0">
      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 transition-colors shrink-0">
        <MapPin size={16} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Area / Sector</span>
        <p className="text-[12px] font-bold text-slate-700 uppercase tracking-tight truncate" title={[item.candidate?.city, item.candidate?.district, item.candidate?.state].filter(Boolean).join(", ")}>
          {[item.candidate?.city, item.candidate?.district, item.candidate?.state]
            .filter(val => val && val !== "undefined" && val !== "null")
            .join(", ") || "Not Specified"}
        </p>
      </div>
    </div>

    {/* 4. CONTACT NODE (18%) */}
    <div className="flex items-center gap-4 w-[18%] border-l border-slate-100 pl-8 min-w-0">
      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
        <Phone size={16} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <span className="text-[9px] font-black whitespace-nowrap text-slate-400 uppercase tracking-widest block mb-1">
          Contact Number
        </span>
        <p className="text-[12px] font-black text-slate-900 tracking-widest truncate">
          {item.candidate?.phone ? (
            <>
              <span className="text-slate-400 font-bold mr-1">+91</span>
              {item.candidate.phone}
            </>
          ) : (
            <span className="text-slate-300 italic font-bold">Node Empty</span>
          )}
        </p>
      </div>
    </div>

    {/* 5. PROCESS NODE (20%) */}
    <div className="flex items-center gap-4 w-[20%] border-l border-slate-100 pl-8 min-w-0">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
        <Activity size={16} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
          Process State
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">
            {item.action_type ? item.action_type.replace(/_/g, ' ') : "No Action"}
          </p>
          {/* <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${item.status === 'pending' ? 'bg-orange-400' : 'bg-emerald-400'}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'pending' ? 'text-orange-500' : 'text-emerald-600'}`}>
              {item.status || "Unknown"}
            </span>
          </div> */}
          {/* Replace the Process State Block inside followUpData.map */}
{/* <div className="flex flex-col gap-1 min-w-0">
 
  <div className="flex items-center gap-1.5">
    {(() => {
      const rawStatus = item.status?.toLowerCase();
      const isOverdue = rawStatus === 'overdue';
      const isPending = rawStatus === 'pending' || isOverdue;

      return (
        <>
          <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${
            isOverdue ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]' : 
            isPending ? 'bg-orange-400' : 'bg-emerald-400'}`} 
          />
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            isOverdue ? 'text-rose-600' : 
            isPending ? 'text-orange-500' : 'text-emerald-600'}`}
          >
            {isPending ? "Pending" : item.status || "Unknown"}
          </span>
        </>
      );
    })()}
  </div>
</div> */}

{/* 🎯 CONDITIONAL STATUS: Only visible if Pending tab is active */}
      {followUpVariation === 'pending' && (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-300">
          {(() => {
            const rawStatus = item.status?.toLowerCase();
            const isOverdue = rawStatus === 'overdue';
            
            // Visual Alert: Rose for Overdue, Orange for standard Pending
            let dotClass = "bg-orange-400";
            let textClass = "text-orange-500";

            if (isOverdue) {
              dotClass = "bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]";
              textClass = "text-rose-600";
            }

            return (
              <>
                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${dotClass}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${textClass}`}>
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

    {/* 6. TEMPORAL NODE (15%) */}
    <div className="flex items-center gap-4 w-[15%] border-l border-slate-100 pl-8 min-w-0">
      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0">
        <Calendar size={16} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
          Timestamp
        </span>
        <div className="flex flex-col leading-tight">
          <p className="text-[11px] font-black text-slate-900 leading-none">
            {new Date(item.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}
          </p>
          <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">
            {new Date(item.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
        </div>
      </div>
    </div>

    {/* ACTION BUTTON (9%) */}
    <div className="w-[9%] flex justify-end">
      <button
        onClick={async (e) => {
          e.stopPropagation();
          const candidateContext = {
            ...item.candidate,
            full_name: item.candidate?.full_name,
            id: item.candidate?.id
          };
          setDecisionCandidate(candidateContext);
          setDecisionData({ 
            status: item.action_type || "", 
            remark: item.remark || "", 
            follow_up_date: "", 
            follow_up_time: "" 
          });
          setLoadingHistory(true);
          try {
            const vId = new URLSearchParams(location.search).get("vacancy_id") || "36";
            const res = await fetch(`https://apihrr.goelectronix.co.in/follow-ups/${item.candidate.id}?vacancy_id=${vId}`);
            const result = await res.json();
            setFollowUpHistory(result.data || []);
          } catch (err) {
            console.error("History sync failed", err);
          } finally {
            setLoadingHistory(false);
          }
        }}
        className="p-2.5 hover:bg-blue-600 hover:text-white text-slate-400 rounded-xl transition-all active:scale-95 bg-slate-50 border border-slate-100 shadow-sm shrink-0"
      >
        <Pencil size={18} strokeWidth={2.5} />
      </button>
    </div>

  </div>
))
    ) : (
      <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center text-slate-400 uppercase text-[10px] font-black">Queue Empty</div>
    )}
  </div>
)}

          {/* 🟢 VACANCY DETAILS VIEW */}
          {showMetadata && (
            <div className="space-y-4 pb-10 mt-10 w-full">
              {/* 1. JOB DESCRIPTION ACCORDION (Existing) */}
              <div
                className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "description" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
              >
                <button
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === "description" ? null : "description",
                    )
                  }
                  className="w-full px-8 py-7 flex !bg-transparent items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "description" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
                    >
                      <FileText size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span
                        className={`text-[9px] font-black uppercase !bg-transparent tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "description" ? "!text-white/60" : "!text-slate-400"}`}
                      >
                        Section 01
                      </span>
                      <h3
                        className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "description" ? "!text-white" : "!text-slate-900"}`}
                      >
                        Job Description
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "description" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
                  >
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </button>
                {activeAccordion === "description" && (
                  <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
                    <div className="h-[1px] w-full !bg-slate-50 mb-8" />
                    <div
                      className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{
                        __html:
                          jobDescription?.content ||
                          "No overview protocol found.",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 2. RESPONSIBILITIES ACCORDION (Existing) */}
              <div
                className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "responsibilities" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
              >
                <button
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === "responsibilities"
                        ? null
                        : "responsibilities",
                    )
                  }
                  className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
                    >
                      <Zap size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.3em] !bg-transparent leading-none mb-1.5 transition-colors ${activeAccordion === "responsibilities" ? "!text-white/60" : "!text-slate-400"}`}
                      >
                        Section 02
                      </span>
                      <h3
                        className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "responsibilities" ? "!text-white" : "!text-slate-900"}`}
                      >
                        Responsibilities
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
                  >
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </button>
                {activeAccordion === "responsibilities" && (
                  <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
                    <div className="h-[1px] w-full !bg-slate-50 mb-8" />
                    <div
                      className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{
                        __html:
                          jobDescription?.responsibilities ||
                          "Standard operating procedures apply.",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 3. ELIGIBILITY ACCORDION (Existing) */}
              <div
                className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "prerequisite" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
              >
                <button
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === "prerequisite"
                        ? null
                        : "prerequisite",
                    )
                  }
                  className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
                    >
                      <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "prerequisite" ? "!text-white/60" : "!text-slate-400"}`}
                      >
                        Section 03
                      </span>
                      <h3
                        className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "prerequisite" ? "!text-white" : "!text-slate-900"}`}
                      >
                        Eligibility
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
                  >
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </button>
                {activeAccordion === "prerequisite" && (
                  <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 bg-white mx-1.5 mb-1.5 rounded-[2rem]">
                    <div className="h-[1px] w-full bg-slate-50 mb-8" />
                    <div
                      className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{
                        __html:
                          jobDescription?.requirements ||
                          "No specific prerequisites listed.",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 4. NEW: REGISTRY DATA ACCORDION (Added for Degrees, Languages, Assets, Certs) */}
              <div
                className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "registry" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
              >
                <button
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === "registry" ? null : "registry",
                    )
                  }
                  className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
                    >
                      <Layers size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "registry" ? "!text-white/60" : "!text-slate-400"}`}
                      >
                        Section 04
                      </span>
                      <h3
                        className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "registry" ? "!text-white" : "!text-slate-900"}`}
                      >
                        Addtional Information
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
                  >
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </button>
                {activeAccordion === "registry" && (
                  <div className="px-8 pb-10 pt-6 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem] space-y-8">
                    <div className="h-[1px] w-full !bg-slate-50" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Degrees */}
                      <div className="space-y-2">
                        <span className={labelClass}>Degree</span>
                        <div className="flex flex-wrap gap-2">
                          {vacancy?.degrees?.map((d) => (
                            <span
                              key={d.id}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100"
                            >
                              {d.name}
                            </span>
                          )) || (
                            <p className="text-xs text-slate-400">
                              Standard Degree applies
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="space-y-2">
                        <span className={labelClass}>Languages</span>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                          {vacancy?.spoken_languages?.join(" • ") ||
                            "English / Hindi"}
                        </p>
                      </div>

                      {/* Assets */}
                      <div className="space-y-2">
                        <span className={labelClass}>Assets</span>
                        <div className="flex flex-wrap gap-2">
                          {vacancy?.assets_req?.map((asset) => (
                            <span
                              key={asset}
                              className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase border border-slate-100"
                            >
                              {asset}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="space-y-2">
                        <span className={labelClass}>
                          Professional Certifications
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {vacancy?.certificates_req?.map((cert) => (
                            <span
                              key={cert}
                              className="px-3 py-1 bg-[#2563eb] text-white rounded-lg text-[9px] font-black uppercase shadow-sm"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          

{decisionCandidate && (
  <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 lg:p-8">
    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setDecisionCandidate(null)} />
    
    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg"><Activity size={20} /></div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Follow Up Protocol</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{decisionCandidate.full_name}</p>
          </div>
        </div>
        <button onClick={() => setDecisionCandidate(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-white">
        {/* LEFT: FORM */}
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar border-r border-slate-100 h-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow Type</label>
          <select 
            value={decisionData.status}
            onChange={(e) => setDecisionData({...decisionData, status: e.target.value})}
            className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 uppercase outline-none focus:border-blue-600 appearance-none"
          >
            <option value="">Select Protocol</option>
            <option value="schedule_interaction">📞 Call For Interview</option>
            <option value="call_not_connected">🚫 Not Connected</option>
            <option value="reschedule">🔄 Reschedule</option>
            <option value="reject">❌ Reject</option>
            <option value="visited">🏁 Visited</option>
          </select>

          {/* Date/Time Inputs */}
          {['schedule_interaction', 'call_not_connected', 'reschedule'].includes(decisionData.status) && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
              <input type="date" className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-[11px] font-bold" value={decisionData.follow_up_date} onChange={(e) => setDecisionData({...decisionData, follow_up_date: e.target.value})} />
              <input type="time" className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-[11px] font-bold" value={decisionData.follow_up_time} onChange={(e) => setDecisionData({...decisionData, follow_up_time: e.target.value})} />
            </div>
          )}

          <textarea rows={6} placeholder="Interaction remarks..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 shadow-inner" value={decisionData.remark} onChange={(e) => setDecisionData({...decisionData, remark: e.target.value})} />
        </div>

        {/* RIGHT: HISTORY */}
        {/* <div className="bg-slate-50/50 p-8 flex flex-col overflow-hidden h-full">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Audit Trail</h4>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30"><Loader2 className="animate-spin mb-2" /><span className="text-[9px] font-black uppercase">Syncing...</span></div>
            ) : (
              <div className="pl-2 space-y-10 relative border-l-2 border-slate-200 ml-2 py-4">
                {followUpHistory.map((item, idx) => (
                  <div key={idx} className="relative pl-8 animate-in fade-in slide-in-from-left-3">
                    <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center text-blue-600 z-10"><Activity size={10} /></div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{item.action_type.replace('_', ' ')}</span>
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                        <p className="text-[11px] font-medium text-slate-600 italic">"{item.remark}"</p>
                        <div className="mt-2 text-[9px] font-black text-slate-400 uppercase text-right">By {item.performed_by}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}
        <div className="bg-slate-50/50 p-8 flex flex-col h-[400px] overflow-scroll">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 border border-slate-100">
                <Clock size={16} strokeWidth={2.5} />
              </div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">History Logs</h4>
            </div>
            <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md uppercase border border-blue-200 shadow-sm">
              {followUpHistory.length} Audit Nodes
            </span>
          </div>
        
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <Loader2 className="animate-spin mb-2" size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest">Syncing...</span>
              </div>
            ) : followUpHistory.length > 0 ? (
              <div className="pl-2 space-y-10 relative border-l-2 border-slate-200 ml-2 py-4">
                {/* {followUpHistory.map((item, idx) => {
                  const config = actionMapping[item.action_type] || actionMapping.schedule_interaction;
                  const scheduledDate = new Date(item.scheduled_at);
                  
                  return (
                    <div key={item.id} className="relative pl-8 animate-in fade-in slide-in-from-left-3 duration-700">
                   
                      <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full ${config.bg} border-4 border-white shadow-md flex items-center justify-center ${config.color} z-10`}>
                        {config.icon}
                      </div>
        
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-[8px] font-black text-slate-400 uppercase bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                            {scheduledDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm group/card relative overflow-hidden">
                          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-50">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
                              By: <span className="text-slate-900">{item.performed_by}</span>
                            </span>
                           
                            <div className="flex items-center gap-1.5 text-blue-600">
              <Clock size={10} strokeWidth={3} />
              <span className="text-[9px] font-black uppercase">
                {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
                          </div>
        
                          <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                            "{item.remark}"
                          </p>
                          <div className={`absolute right-0 top-0 bottom-0 w-1 ${config.color.replace('text', 'bg')}`} />
                        </div>
                      </div>
                    </div>
                  );
                })} */}

                {followUpHistory.map((item, idx) => {
  const config = actionMapping[item.action_type] || actionMapping.schedule_interaction;
  
  // 🕒 Temporal Node Parsing
  const scheduledDate = new Date(item.scheduled_at);
  const createdDate = new Date(item.created_at);

  return (
    <div key={item.id} className="relative pl-8 animate-in fade-in slide-in-from-left-3 duration-700">
      {/* Timeline Connector Dot */}
      <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full ${config.bg} border-4 border-white shadow-md flex items-center justify-center ${config.color} z-10`}>
        {config.icon}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
            {config.label}
          </span>
          {/* Main Display: Scheduled Date Badge */}
         
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm group/card relative overflow-hidden">
          {/* TOP STRIP: Actor & Scheduled Time Details */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-50">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
              By: <span className="text-slate-900">{item.performed_by}</span>
            </span>
            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100">
  <Clock size={10} strokeWidth={3} />
  <span className="text-[9px] font-black uppercase tracking-tighter">
    {scheduledDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              Created At: {createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} | {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Side Indicator Line */}
          <div className={`absolute right-0 top-0 bottom-0 w-1 ${config.color.replace('text', 'bg')}`} />
        </div>
      </div>
    </div>
  );
})}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <Activity size={32} strokeWidth={1} className="mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest">No Interaction History</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      {/* <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3 shrink-0">
        <button onClick={() => setDecisionCandidate(null)} className="px-6 py-3 text-[10px] rounded-xl font-black uppercase text-slate-400 hover:text-slate-600 transition-all">Discard</button>
        
       
        {decisionData.status !== "visited" && !isInteractionVisited ? (
          <button 
            disabled={!decisionData.status}
            onClick={executeFollowUpProtocol}
            className={`px-8 py-3 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all ${
              !decisionData.status ? "opacity-40" : "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-100"
            }`}
          >
            Follow Up <Check size={14} strokeWidth={4} />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-right-2">
             <CheckCircle2 size={14} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
               {isInteractionVisited ? "Protocol Completed" : "Visited Marked"}
             </span>
          </div>
        )}
      </div> */}

      {/* --- STICKY FOOTER: RIGHT ALIGNED PROTOCOL --- */}
<div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3 shrink-0">
  
  {/* 1. DISCARD */}
  <button 
    onClick={() => setDecisionCandidate(null)} 
    className="px-6 py-3 text-[10px] font-black uppercase rounded-xl text-slate-400 hover:text-slate-600 transition-all active:scale-95"
  >
    Discard
  </button>

  {/* 2. VISIT: 🎯 Only show if "visited" exists in history */}
  {isLatestInteractionVisited && (
    <button 
      onClick={() => navigate(`/invitation/${decisionCandidate.id}/scheduleinterview`)}
      className="px-5 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm animate-in slide-in-from-right-2"
    >
      <ExternalLink size={12} strokeWidth={3} /> Visit
    </button>
  )}

  {/* 3. FOLLOW UP vs COMPLETED BADGE */}
  {!isLatestInteractionVisited ? (
    /* 🚀 ACTIVE STATE: Show button if not visited yet */
    <button 
      disabled={loading || !decisionData.status}
      onClick={executeFollowUpProtocol}
      className={`px-8 py-3 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 animate-in fade-in zoom-in-95 duration-300 ${
        loading || !decisionData.status
          ? "!bg-slate-100 !border-slate-200 !text-slate-400 cursor-not-allowed" 
          : "!bg-white !text-blue-600 !border-blue-700 hover:!bg-blue-700"
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
  ) : (
    /* 🏁 COMPLETED STATE: Show emerald badge */
    <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-right-2 duration-500">
       <CheckCircle2 size={14} className="text-emerald-500" />
       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
         Follow Up Completed
       </span>
    </div>
  )}
</div>
    </div>
  </div>
)}


{isMailModalOpen && (
  <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsMailModalOpen(false)} />
    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Zap size={20} /></div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Bulk Invitation</h3>
            <p className="text-[10px] font-bold text-blue-600 mt-1">
              Target: {singleMailCandidate ? singleMailCandidate.full_name : `${selectedCount} Node(s)`}
            </p>
          </div>
        </div>
        <button onClick={() => setIsMailModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Source Template</label>
          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white appearance-none"
            >
              <option value="">Manual Override (No Template)</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900 flex gap-3">
        <button onClick={() => setIsMailModalOpen(false)} className="px-6 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-xl">Abort</button>
        <button onClick={handleSendJD} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20">Execute Transmission</button>
      </div>
    </div>
  </div>
)}
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
        .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
        .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
        .custom-html-view strong { color: #0F172A; font-weight: 800; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `,
        }}
      />
    </div>
  );
};

// --- SUB-COMPONENT REGISTRY ---
const MetricTab = ({
  icon: Icon,
  label,
 count = 0,
  onClick,
  colorClass,
  iconBg,
  isActive,
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}
      >
        <Icon size={22} className={colorClass} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}
          >
            {count.toString().padStart(2, "0")}
          </span>
          <div
            className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`}
          />
        </div>
      </div>
    </div>
  </button>
);

export default VacancyDetails;
