
//****************************************************working code phase 1 5/03/26*********************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Users,
//   IndianRupee,
//   FileText,
//   Gavel,
//   GraduationCap,
//   UserPlus,
//   CheckCircle2,
//   Activity,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft,
//   Navigation,
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE REGISTRY ---
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [metrics, setMetrics] = useState({
//     responses: 0,
//     leads: 0,
//     database: 0,
//   });
//   const [activeMetricTab, setActiveMetricTab] = useState(null);
//   const [metricData, setMetricData] = useState([]);
//   const [loadingMetrics, setLoadingMetrics] = useState(false);
//   const [candidatePage, setCandidatePage] = useState(1);
//   const candidatesPerPage = 5;
//   const [registrySearch, setRegistrySearch] = useState("");
//   const [showMetadata, setShowMetadata] = useState(true);
//   const [skillsMaster, setSkillsMaster] = useState([]);

//   // --- ADD TO STATE REGISTRY ---
//   const [filters, setFilters] = useState({
//     experiences: [],
//     educations: [],
//     districts: [],
//     cities: [],
//     genders: [],
//     industries: [],
//     skills: [],
//     languages: [], // 🛠️ Added
//     ages: [],
//   });
//   const [industries, setIndustries] = useState([]);
//   const [educationMasters, setEducationMasters] = useState([]);

//   // 1. Move the function out so the whole component can use it
//   // const fetchAllDetails = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//   //     if (!vacRes.ok) throw new Error("Vacancy node not found");
//   //     const vacData = await vacRes.json();
//   //     setVacancy(vacData);

//   //     const [resResp, resLeads, resDb] = await Promise.all([
//   //       fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//   //       fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//   //       fetch(`https://apihrr.goelectronix.co.in/candidates`)
//   //     ]);

//   //     const [dataResp, dataLeads, dataDb] = await Promise.all([
//   //       resResp.json(), resLeads.json(), resDb.json()
//   //     ]);

//   //     setMetrics({
//   //       responses: dataResp.length || 0,
//   //       leads: dataLeads.length || 0,
//   //       database: dataDb.length || 0
//   //     });

//   //     if (vacData.job_description) {
//   //       const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//   //       const jdData = await jdRes.json();
//   //       setJobDescription(jdData);
//   //     }

//   //     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//   //     const compListData = await compRes.json();
//   //     const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//   //     if (matchedCompany) setCompany(matchedCompany);

//   //   } catch (err) {
//   //     toast.error(err.message);
//   //     navigate("/vacancies");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchAllDetails = async () => {
//     setLoading(true);
//     try {
//       const vacRes = await fetch(
//         `https://apihrr.goelectronix.co.in/vacancies/${id}`,
//       );
//       if (!vacRes.ok) throw new Error("Vacancy node not found");
//       const vacData = await vacRes.json();
//       setVacancy(vacData);

//       // 🎯 Construct Requirement Query for Initial Responses Count
//       const reqQuery = new URLSearchParams();
//       reqQuery.append("status", "jd_sent");
//       reqQuery.append("vacancy_id", id);

//       // Auto-map vacancy requirements to the count API call
//       if (vacData.title)
//         reqQuery.append("position", vacData.title.toLowerCase());

//       if (vacData.skills_req?.length > 0) {
//         vacData.skills_req.forEach((skill) =>
//           reqQuery.append("skills", skill.toLowerCase()),
//         );
//       }

//       if (vacData.city?.[0])
//         reqQuery.append("city", vacData.city[0].toLowerCase());

//       if (vacData.min_experience !== undefined)
//         reqQuery.append("min_experience", vacData.min_experience);
//       if (vacData.max_experience !== undefined)
//         reqQuery.append("max_experience", vacData.max_experience);

//       // 🛰️ Parallel Execution with full requirement parameters
//       const [resResp, resLeads, resDb] = await Promise.all([
//         fetch(
//           `https://apihrr.goelectronix.co.in/candidates?${reqQuery.toString()}`,
//         ), // 🔥 Fixed with params
//         fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates`),
//       ]);

//       const [dataResp, dataLeads, dataDb] = await Promise.all([
//         resResp.json(),
//         resLeads.json(),
//         resDb.json(),
//       ]);

//       // Update Metrics State with filtered initial data
//       setMetrics({
//         responses: dataResp.length || 0,
//         leads: dataLeads.length || 0,
//         database: dataDb.length || 0,
//       });

//       // ... (rest of your JD and Company logic remains the same)
//       if (vacData.job_description) {
//         const jdRes = await fetch(
//           `https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`,
//         );
//         setJobDescription(await jdRes.json());
//       }

//       const compRes = await fetch(
//         `https://apihrr.goelectronix.co.in/companies`,
//       );
//       const compListData = await compRes.json();
//       const matchedCompany = compListData.find(
//         (c) => c.id === vacData.company?.id,
//       );
//       if (matchedCompany) setCompany(matchedCompany);
//     } catch (err) {
//       toast.error(err.message);
//       navigate("/vacancies");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeMetricTab) {
//       const delayDebounceFn = setTimeout(() => {
//         // 🟢 Pass 'true' for isAutoRefresh
//         handleTabClick(activeMetricTab, filters, registrySearch, true);
//       }, 500);

//       return () => clearTimeout(delayDebounceFn);
//     }
//   }, [filters, registrySearch]);

//   // 2. The useEffect now simply triggers the shared function on mount
//   useEffect(() => {
//     fetchAllDetails();
//   }, [id, navigate]);

//   // Add these to your fetchAllDetails function or a new useEffect
//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const [eduRes, indRes, skillRes] = await Promise.all([
//           fetch(
//             "https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100",
//           ),
//           fetch(
//             "https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100",
//           ),
//           fetch(
//             "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
//           ),
//         ]);
//         const eduData = await eduRes.json();
//         const indData = await indRes.json();
//         const skillData = await skillRes.json();

//         setEducationMasters(eduData || []);
//         setIndustries(indData || []);
//         setSkillsMaster(skillData || []);
//       } catch (err) {
//         console.error("Master Data Sync Failure", err);
//       }
//     };
//     fetchMasters();
//   }, []);

//   // const filteredResults = useMemo(() => {
//   //   return metricData.filter((c) => {
//   //     // 1. Search Query
//   //     const matchesSearch = c.full_name?.toLowerCase().includes(registrySearch.toLowerCase());

//   //     // 2. City Filter
//   //     const matchesCity = filters.cities.length === 0 || filters.cities.includes(c.city?.toUpperCase());

//   //     // 3. Education Filter
//   //     const matchesEdu = filters.educations.length === 0 || filters.educations.includes(c.latest_education?.toUpperCase());

//   //     // 4. Gender Filter
//   //     const matchesGender = filters.genders.length === 0 || filters.genders.includes(c.gender?.toUpperCase());

//   //     return matchesSearch && matchesCity && matchesEdu && matchesGender;
//   //   });
//   // }, [metricData, registrySearch, filters]);

//   const filteredResults = useMemo(() => {
//     // Now simply returns the data from the API
//     return metricData;
//   }, [metricData]);

//   const toggleFilter = (category, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [category]: prev[category].includes(value)
//         ? prev[category].filter((item) => item !== value)
//         : [...prev[category], value],
//     }));
//     setCandidatePage(1); // Reset to first page on filter change
//   };

//   // This was likely defined too low in your previous code
//   const skillOptions = useMemo(() => {
//     return skillsMaster.map((s) => s.name.toUpperCase()).sort();
//   }, [skillsMaster]);

//   // --- LOGIC HELPERS ---

//   const indexOfLastCandidate = candidatePage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const currentCandidates = filteredResults.slice(
//     indexOfFirstCandidate,
//     indexOfLastCandidate,
//   );
//   const totalCandidatePages = Math.ceil(
//     filteredResults.length / candidatesPerPage,
//   );

//   useEffect(() => {
//     setCandidatePage(1);
//   }, [activeMetricTab, registrySearch]);

//   // const handleTabClick = async (tabType) => {
//   //   if (activeMetricTab === tabType) {
//   //     setActiveMetricTab(null);
//   //     setShowMetadata(true);
//   //     return;
//   //   }
//   //   setActiveMetricTab(tabType);
//   //   setShowMetadata(false); // 🟢 Auto-hide Vacancy Post when Registry is clicked
//   //   setLoadingMetrics(true);
//   //   try {
//   //     let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//   //               tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//   //               `https://apihrr.goelectronix.co.in/candidates`;
//   //     const res = await fetch(url);
//   //     const data = await res.json();
//   //     setMetricData(data);
//   //   } catch (err) {
//   //     toast.error("Registry sync failed");
//   //   } finally {
//   //     setLoadingMetrics(false);
//   //   }
//   // };

//   //   const handleTabClick = async (tabType) => {
//   //   if (activeMetricTab === tabType) {
//   //     setActiveMetricTab(null);
//   //     setShowMetadata(true);
//   //     return;
//   //   }

//   //   setActiveMetricTab(tabType);
//   //   setShowMetadata(false);
//   //   setLoadingMetrics(true);

//   //   try {
//   //     let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//   //               tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//   //               `https://apihrr.goelectronix.co.in/candidates`;

//   //     const res = await fetch(url);
//   //     const rawData = await res.json();

//   //     // 🛠️ ATOMIC DATA SYNC: Fetch full profile for revealed candidates
//   //     const synchronizedData = await Promise.all(rawData.map(async (c) => {
//   //       // Check if this candidate is already revealed for the current vacancy
//   //       const currentVacancyId = id.toString();
//   //       const existingIds = c.applied_vacancy_ids
//   //         ? c.applied_vacancy_ids.toString().split(',').map(x => x.trim())
//   //         : [];

//   //       const isAlreadyRevealed = existingIds.includes(currentVacancyId);

//   //       if (isAlreadyRevealed) {
//   //         try {
//   //           // Trigger individual fetch to get the real phone number
//   //           const profileRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${c.id}`);
//   //           const fullProfile = await profileRes.json();
//   //           return { ...c, phone: fullProfile.phone }; // Merge real phone into candidate object
//   //         } catch (e) {
//   //           console.error(`Telemetry sync failed for candidate ${c.id}`);
//   //           return c;
//   //         }
//   //       }
//   //       return c; // Return as is if not revealed
//   //     }));

//   //     setMetricData(synchronizedData);
//   //   } catch (err) {
//   //     toast.error("Registry sync failed");
//   //   } finally {
//   //     setLoadingMetrics(false);
//   //   }
//   // };

//   // 🟢 Added 'isAutoRefresh' parameter to identify where the call is coming from
//   // 🟢 Added 'isAutoRefresh' parameter
//   // const handleTabClick = async (tabType, currentFilters = filters, searchQuery = registrySearch, isAutoRefresh = false) => {

//   //   const activeTab = tabType || activeMetricTab;
//   //   if (!activeTab) return;

//   //   // 🛡️ Logic Gate:
//   //   // If NOT an auto-refresh (human clicked) AND the tab is already open -> Close it.
//   //   // If it IS an auto-refresh (filter change) -> SKIP this close logic.
//   //   if (!isAutoRefresh && activeMetricTab === tabType) {
//   //     setActiveMetricTab(null);
//   //     setShowMetadata(true);
//   //     return;
//   //   }

//   //   setActiveMetricTab(activeTab);
//   //   setShowMetadata(false);
//   //   setLoadingMetrics(true);

//   //   try {
//   //     const params = new URLSearchParams();

//   //     if (activeTab !== 'database') {
//   //       params.append("vacancy_id", id);
//   //     }
//   //     if (activeTab === 'responses') {
//   //       params.append("status", "jd_sent");
//   //     }

//   //     if (searchQuery) {
//   //       params.append("search", searchQuery);
//   //     }

//   //     // Add filters to URL params
//   //     // currentFilters.cities.forEach(city => params.append("city", city));
//   //     // Add District Filters
//   //   currentFilters.districts.forEach(d => params.append("district", d));
//   //   // Add City Filters
//   //   currentFilters.cities.forEach(c => params.append("city", c));
//   //     currentFilters.educations.forEach(edu => params.append("education", edu));
//   //     currentFilters.genders.forEach(gen => params.append("gender", gen.toLowerCase()));

//   //     currentFilters.industries.forEach((industryName) => {
//   //       const match = industries.find(i => i.name.toUpperCase() === industryName.toUpperCase());
//   //       if (match) params.append("industry_id", match.id);
//   //     });

//   //     currentFilters.skills.forEach(skill => {
//   //   params.append("skills", skill.toLowerCase());
//   // });

//   //     const url = `https://apihrr.goelectronix.co.in/candidates?${params.toString()}`;
//   //     const res = await fetch(url);
//   //     const rawData = await res.json();

//   //     // Re-sync phone numbers for revealed candidates
//   //     const synchronizedData = await Promise.all(rawData.map(async (c) => {
//   //       const currentVacancyId = id.toString();
//   //       const existingIds = c.applied_vacancy_ids
//   //         ? c.applied_vacancy_ids.toString().split(',').map(x => x.trim())
//   //         : [];

//   //       if (existingIds.includes(currentVacancyId)) {
//   //         try {
//   //           const profileRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${c.id}`);
//   //           const fullProfile = await profileRes.json();
//   //           return { ...c, phone: fullProfile.phone };
//   //         } catch (e) { return c; }
//   //       }
//   //       return c;
//   //     }));

//   //     setMetricData(synchronizedData);
//   //   } catch (err) {
//   //     toast.error("candidate Fetch failed");
//   //   } finally {
//   //     setLoadingMetrics(false);
//   //   }
//   // };

//   const handleTabClick = async (
//     tabType,
//     currentFilters = filters,
//     searchQuery = registrySearch,
//     isAutoRefresh = false,
//   ) => {
//     const activeTab = tabType || activeMetricTab;
//     if (!activeTab) return;

//     if (!isAutoRefresh && activeMetricTab === tabType) {
//       setActiveMetricTab(null);
//       setShowMetadata(true);
//       return;
//     }

//     // 🎯 TAB SYNC LOGIC: Determine fresh filters based on tab
//     let nextFilters = currentFilters;

//     if (!isAutoRefresh) {
//       // Only do this on a human click, not a debounce refresh
//       if (tabType === "responses" && vacancy) {
//         nextFilters = {
//           ...filters,
//           skills: vacancy.skills_req
//             ? vacancy.skills_req.map((s) => s.toUpperCase())
//             : [],
//           industries: vacancy.industries
//             ? vacancy.industries.map((i) => i.name.toUpperCase())
//             : [],
//           cities: vacancy.city ? vacancy.city.map((c) => c.toUpperCase()) : [],
//           experiences:
//             vacancy.min_experience !== undefined
//               ? [`${Math.floor(vacancy.min_experience)} YEARS`]
//               : [],
//           languages: vacancy.spoken_languages
//             ? vacancy.spoken_languages.map((l) => l.toUpperCase())
//             : [],
//         };
//         setFilters(nextFilters); // Update the UI state
//         toast.success("Vacancy requirements applied 🎯");
//       } else {
//         // Clear filters for Hot Leads or Database
//         nextFilters = {
//           experiences: [],
//           educations: [],
//           districts: [],
//           cities: [],
//           genders: [],
//           industries: [],
//           skills: [],
//           languages: [],
//           ages: [],
//         };
//         setFilters(nextFilters);
//       }
//     }

//     setActiveMetricTab(activeTab);
//     setShowMetadata(false);
//     setLoadingMetrics(true);

//     try {
//       const params = new URLSearchParams();
//       if (activeTab !== "database") params.append("vacancy_id", id);
//       if (activeTab === "responses") params.append("status", "jd_sent");
//       if (searchQuery) params.append("search", searchQuery);

//       // 🛠️ Plural & Lowercase Mapping (Matching your previous request)
//       nextFilters.skills.forEach((skill) =>
//         params.append("skills", skill.toLowerCase()),
//       );
//       nextFilters.industries.forEach((ind) =>
//         params.append("industry", ind.toLowerCase()),
//       );
//       nextFilters.cities.forEach((city) =>
//         params.append("city", city.toLowerCase()),
//       );
//       nextFilters.educations.forEach((edu) =>
//         params.append("education", edu.toLowerCase()),
//       );
//       nextFilters.genders.forEach((gen) =>
//         params.append("gender", gen.toLowerCase()),
//       );
//       nextFilters.languages.forEach((l) =>
//         params.append("languages", l.toLowerCase()),
//       );

//       // 2. Age Range Mapping Protocol
//       if (currentFilters.ages.length > 0) {
//         const range = currentFilters.ages[0];
//         if (range === "18 - 25") {
//           params.append("min_age", 18);
//           params.append("max_age", 25);
//         } else if (range === "26 - 35") {
//           params.append("min_age", 26);
//           params.append("max_age", 35);
//         } else if (range === "36 - 45") {
//           params.append("min_age", 36);
//           params.append("max_age", 45);
//         } else if (range === "45+") {
//           params.append("min_age", 45);
//         }
//       }

//       const url = `https://apihrr.goelectronix.co.in/candidates?${params.toString()}`;
//       const res = await fetch(url);
//       const rawData = await res.json();

//       setMetrics((prev) => ({
//         ...prev,
//         [activeTab]: rawData.length || 0,
//       }));

//       // Re-sync phone numbers (Keeping your existing logic)
//       const synchronizedData = await Promise.all(
//         rawData.map(async (c) => {
//           const existingIds =
//             c.applied_vacancy_ids
//               ?.toString()
//               .split(",")
//               .map((x) => x.trim()) || [];
//           if (existingIds.includes(id.toString())) {
//             try {
//               const pRes = await fetch(
//                 `https://apihrr.goelectronix.co.in/candidates/${c.id}`,
//               );
//               const pData = await pRes.json();
//               return { ...c, phone: pData.phone };
//             } catch (e) {
//               return c;
//             }
//           }
//           return c;
//         }),
//       );

//       setMetricData(synchronizedData);
//     } catch (err) {
//       toast.error("Candidate fetch failed");
//     } finally {
//       setLoadingMetrics(false);
//     }
//   };

//   const getPaginationGroup = () => {
//     const range = [];
//     const delta = 1;
//     for (let i = 1; i <= totalCandidatePages; i++) {
//       if (
//         i === 1 ||
//         i === totalCandidatePages ||
//         (i >= candidatePage - delta && i <= candidatePage + delta)
//       ) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "...") {
//         range.push("...");
//       }
//     }
//     return range;
//   };

//   //   const toggleFilter = (category, value) => {
//   //   setFilters((prev) => ({
//   //     ...prev,
//   //     [category]: prev[category].includes(value)
//   //       ? prev[category].filter((item) => item !== value)
//   //       : [...prev[category], value],
//   //   }));
//   // };

//   const clearAllFilters = () => {
//     setFilters({
//       experiences: [],
//       educations: [],
//       districts: [], // 🟢 Reset Districts
//       cities: [], // 🟢 Reset Cities
//       genders: [],
//       industries: [], // 🟢 Reset Industries
//     });

//     setRegistrySearch("");

//     // Reset pagination to page 1
//     setCandidatePage(1);
//   };

//   const formatEnterpriseDate = (d) => {
//     if (!d) return "N/A";
//     const date = new Date(d);
//     return `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString("en-US", { month: "short" }).toUpperCase()}-${date.getFullYear()}`;
//   };

//   // 1. Extract unique Districts from the current metric data
//   const districtOptions = useMemo(() => {
//     const set = new Set();
//     metricData.forEach((c) => {
//       if (c.district) set.add(c.district.toUpperCase());
//     });
//     return Array.from(set).sort();
//   }, [metricData]);

//   // 2. Extract Cities based on selected Districts
//   const dependentCityOptions = useMemo(() => {
//     const set = new Set();
//     metricData.forEach((c) => {
//       const candidateDist = c.district?.toUpperCase();

//       // Logic: If no district is selected, show all.
//       // If district is selected, only show cities belonging to that district.
//       if (
//         filters.districts.length === 0 ||
//         filters.districts.includes(candidateDist)
//       ) {
//         if (c.city) set.add(c.city.toUpperCase());
//       }
//     });
//     return Array.from(set).sort();
//   }, [metricData, filters.districts]);

//   // const toggleNumberReveal = async (candidate) => {
//   //   // 🛡️ Guard: Check session state
//   //   if (revealedNumbers[candidate.id]) return;

//   //   const loadingToast = toast.loading("Executing Multi-Node Sync...");

//   //   try {
//   //     // 1. DATA NORMALIZATION PROTOCOL
//   //     // Use 'applied_vacancy_ids' (plural) to match your logic
//   //     const rawValue = candidate.applied_vacancy_ids;
//   //     let existingIds = [];

//   //     if (rawValue !== null && rawValue !== undefined) {
//   //       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
//   //     }

//   //     // 2. CLUSTER AGGREGATION
//   //     const currentVacancyId = id.toString();
//   //     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
//   //     const updatedClusterString = updatedClusterArray.join(',');

//   //     // 3. TELEMETRY TRANSMISSION
//   //     const formPayload = new FormData();
//   //     // ⚠️ Ensure "applied_vacancy_ids" is the exact key your backend expects
//   //     formPayload.append("applied_vacancy_ids", updatedClusterString);

//   //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//   //       method: 'PATCH',
//   //       body: formPayload,
//   //       // Note: No Content-Type header for FormData
//   //     });

//   //     if (!res.ok) {
//   //       const errorData = await res.json().catch(() => ({}));
//   //       console.error("Server Rejected Protocol:", errorData);
//   //       throw new Error(errorData.message || "API Node Sync Failed");
//   //     }

//   //     // 4. REGISTRY UPDATE
//   //     setRevealedNumbers((prev) => ({
//   //       ...prev,
//   //       [candidate.id]: true,
//   //     }));

//   //     toast.success(`Access Logged: Node Cluster Updated`, { id: loadingToast });

//   //     // 5. ATOMIC RE-SYNCHRONIZATION
//   //     // Ensure fetchAllDetails is the function name you defined in your useEffect
//   //     await Promise.all([
//   //        fetchAllDetails(),
//   //     ]);

//   //     handleTabClick(activeMetricTab)

//   //   } catch (err) {
//   //     console.error("Telemetry Error Detail:", err);
//   //     // Dynamic error message for better forensic debugging
//   //     toast.error(`Access Denied: ${err.message || "Protocol Failure"}`, { id: loadingToast });
//   //   }
//   // };

//   const toggleNumberReveal = async (candidate) => {
//     if (revealedNumbers[candidate.id]) return;

//     const loadingToast = toast.loading("Revealing Identity Node...");

//     try {
//       // 1. DATA NORMALIZATION
//       const rawValue = candidate.applied_vacancy_ids;
//       let existingIds = [];
//       if (rawValue !== null && rawValue !== undefined) {
//         existingIds = rawValue
//           .toString()
//           .split(",")
//           .map((item) => item.trim())
//           .filter(Boolean);
//       }

//       // 2. CLUSTER AGGREGATION
//       const currentVacancyId = id.toString();
//       const updatedClusterArray = [
//         ...new Set([...existingIds, currentVacancyId]),
//       ];
//       const updatedClusterString = updatedClusterArray.join(",");

//       // 3. PATCH: Update Access Registry
//       const formPayload = new FormData();
//       formPayload.append("applied_vacancy_ids", updatedClusterString);

//       const patchRes = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
//         {
//           method: "PATCH",
//           body: formPayload,
//         },
//       );

//       if (!patchRes.ok) throw new Error("Registry Sync Failed");

//       // 4. GET: Fetch Fresh Candidate Profile (This gets the real phone number)
//       const getRes = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${candidate.id}`,
//       );
//       const freshData = await getRes.json();

//       // 5. ATOMIC STATE UPDATE: Update ONLY this candidate in the current list
//       // This prevents the whole list from disappearing/reloading
//       setMetricData((prevData) =>
//         prevData.map((item) =>
//           item.id === candidate.id
//             ? { ...item, ...freshData, phone: freshData.phone }
//             : item,
//         ),
//       );

//       // 6. UPDATE REVEALED CACHE
//       setRevealedNumbers((prev) => ({
//         ...prev,
//         [candidate.id]: true,
//       }));

//       toast.success("Candidate Number Revealed", { id: loadingToast });

//       // ⚠️ REMOVE handleTabClick(activeMetricTab) from here
//       // because it clears the list and shows the loader.
//       // The setMetricData above handles the UI refresh smoothly.
//     } catch (err) {
//       console.error("Telemetry Error:", err);
//       toast.error("Access Denied", { id: loadingToast });
//     }
//   };

//   //   const isRevealedForThisVacancy = (candidate) => {
//   //   const currentId = id.toString();

//   //   if (revealedNumbers[candidate.id]) return true;

//   //   // Safely check the comma string
//   //   const existingIds = candidate.applied_vacancy_ids
//   //     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim())
//   //     : [];

//   //   return existingIds.includes(currentId);
//   // };

//   // const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
//   //   const [isOpen, setIsOpen] = useState(false);
//   //   return (
//   //     <div className="relative space-y-2">
//   //       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//   //         {icon} {label}
//   //       </label>
//   //       <button
//   //         onClick={() => setIsOpen(!isOpen)}
//   //         className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-blue-400 transition-all"
//   //       >
//   //         <span className="truncate">{selected.length > 0 ? `${selected.length} Selected` : "All Units"}</span>
//   //         <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//   //       </button>

//   //       {isOpen && (
//   //         <>
//   //           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
//   //           <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
//   //             {options.map(opt => (
//   //               <label key={opt} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
//   //                 <input
//   //                   type="checkbox"
//   //                   checked={selected.includes(opt)}
//   //                   onChange={() => onSelect(opt)}
//   //                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0"
//   //                 />
//   //                 <span className="text-[10px] font-black uppercase text-slate-600">{opt}</span>
//   //               </label>
//   //             ))}
//   //           </div>
//   //         </>
//   //       )}
//   //     </div>
//   //   );
//   // };

//   const isRevealedForThisVacancy = (candidate) => {
//     const currentId = id.toString();

//     // Check local state first for immediate UI feedback
//     if (revealedNumbers[candidate.id]) return true;

//     // Check the data from the API
//     const existingIds = candidate.applied_vacancy_ids
//       ? candidate.applied_vacancy_ids
//           .toString()
//           .split(",")
//           .map((x) => x.trim())
//       : [];

//     return existingIds.includes(currentId);
//   };
//   const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//       <div className="relative space-y-2">
//         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//           {icon} {label}
//         </label>

//         <button
//           type="button"
//           onClick={() => setIsOpen(!isOpen)}
//           className={`w-full flex items-center justify-between px-4 py-3 border rounded-2xl text-[11px] font-bold transition-all ${
//             selected
//               ? "!bg-blue-50 !border-blue-200 !text-blue-700"
//               : "!bg-slate-50 !border-slate-200 !text-slate-700 !hover:border-blue-400"
//           }`}
//         >
//           <span className="truncate uppercase">
//             {selected || "Select Unit"}
//           </span>
//           <ChevronDown
//             size={14}
//             className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
//           />
//         </button>

//         {isOpen && (
//           <>
//             {/* Overlay to close dropdown when clicking outside */}
//             <div
//               className="fixed inset-0 z-10"
//               onClick={() => setIsOpen(false)}
//             />

//             <div className="absolute top-full left-0 w-full mt-2 !bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
//               {/* "All" or "Reset" Option */}
//               <button
//                 onClick={() => {
//                   onSelect("");
//                   setIsOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 text-[10px] !bg-transparent font-black uppercase !text-slate-400 hover:!bg-slate-50 transition-colors border-b !border-slate-50"
//               >
//                 Clear Filter
//               </button>

//               {options.map((opt) => (
//                 <button
//                   key={opt}
//                   onClick={() => {
//                     onSelect(opt);
//                     setIsOpen(false); // Close immediately on selection
//                   }}
//                   className={`w-full text-left px-4 py-3 text-[10px] font-black !bg-transparent uppercase transition-colors border-b !border-slate-50 last:border-0 ${
//                     selected === opt
//                       ? "!bg-white !text-black"
//                       : "!text-slate-600 hover:!bg-white hover:!text-blue-600"
//                   }`}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//           Loading Node Protocol...
//         </p>
//       </div>
//     );

//   const labelClass =
//     "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass =
//     "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none"
//           >
//             <ChevronLeft size={16} /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//           <div className="lg:col-span-8 space-y-10">
//             {/* --- HEADER IDENTITY SECTION --- */}

//             <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//               {/* Security Watermark */}
//               <ShieldCheck
//                 className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none"
//                 size={320}
//               />

//               <div className="relative z-10 flex flex-col gap-10">
//                 {/* TOP ROW: Organization & Title */}
//                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//                   <div className="space-y-6  w-full">
//                     <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
//                       {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//                       <div className="flex items-center gap-5">
//                         {/* Identity Box */}
//                         <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//                           <Building2 size={32} strokeWidth={2.5} />
//                         </div>

//                         <div className="flex flex-col">
//                           <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//                             Hiring Organization
//                           </span>
//                           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//                             {company?.name || vacancy?.company?.name}
//                           </h2>
//                         </div>

//                         {activeMetricTab && (
//                           <button
//                             // onClick={() => setShowMetadata(!showMetadata)}
//                             onClick={() => {
//                               if (!showMetadata) {
//                                 // 🟢 If we are showing the Post, we must hide the Candidate Registry box
//                                 setShowMetadata(true);
//                                 setActiveMetricTab(null); // This clears the registry selection
//                               } else {
//                                 setShowMetadata(false);
//                               }
//                             }}
//                             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                               showMetadata
//                                 ? "bg-slate-900 border-slate-900 text-white shadow-lg"
//                                 : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                             }`}
//                           >
//                             <Layers size={14} strokeWidth={3} />
//                             {showMetadata ? "View Candidate List" : "Overview"}
//                           </button>
//                         )}
//                       </div>

//                       {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//                       <div className="flex flex-col items-end gap-2 shrink-0">
//                         <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//                           {/* Visual Indicator Branding Box */}

//                           <div className="flex flex-col pr-2">
//                             <div
//                               className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//                                 vacancy?.status === "open"
//                                   ? "text-emerald-500"
//                                   : vacancy?.status === "closed"
//                                     ? "text-red-500"
//                                     : "text-orange-400"
//                               }`}
//                             >
//                               {/* Pulsing Core Indicator */}
//                               <div
//                                 className={`h-2 w-2 rounded-full animate-pulse ${
//                                   vacancy?.status === "open"
//                                     ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
//                                     : vacancy?.status === "closed"
//                                       ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
//                                       : "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
//                                 }`}
//                               />

//                               {vacancy?.status
//                                 ? vacancy.status.replace("_", " ")
//                                 : "PENDING"}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
//                         Position
//                       </span>
//                       <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//                         {vacancy?.title}
//                       </h1>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                   <MetricTab
//                     icon={Users}
//                     label="Hot Match"
//                     count={metrics.responses}
//                     isActive={activeMetricTab === "responses"}
//                     iconBg="bg-blue-50"
//                     colorClass="text-blue-600"
//                     onClick={() => handleTabClick("responses")}
//                   />
//                   <MetricTab
//                     icon={Zap}
//                     label="Hot Leads"
//                     count={metrics.leads}
//                     isActive={activeMetricTab === "leads"}
//                     iconBg="bg-orange-50"
//                     colorClass="text-orange-500"
//                     onClick={() => handleTabClick("leads")}
//                   />
//                   <MetricTab
//                     icon={ShieldCheck}
//                     label="Total Candidate"
//                     count={metrics.database}
//                     isActive={activeMetricTab === "database"}
//                     iconBg="bg-slate-50"
//                     colorClass="text-slate-600"
//                     onClick={() => handleTabClick("database")}
//                   />
//                   {/* <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   /> */}
//                 </div>

//                 {/* BOTTOM ROW: Core Protocol Summary */}
//                 <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
//                   {[
//                     {
//                       icon: <Briefcase size={14} />,
//                       label: "Type",
//                       value: vacancy?.job_type,
//                     },
//                     {
//                       icon: <Clock size={14} />,
//                       label: "Experience",
//                       value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y`,
//                     },
//                     {
//                       icon: <IndianRupee size={14} />,
//                       label: "CTC",
//                       value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA`,
//                     },
//                     {
//                       icon: <MapPin size={14} />,
//                       label: "location",
//                       value: vacancy?.location[0],
//                     },
//                   ].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200"
//                     >
//                       <div className="text-blue-600">{item.icon}</div>
//                       <div className="flex flex-col">
//                         <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">
//                           {item.label}
//                         </span>
//                         <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">
//                           {item.value}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* --- SIDEBAR MODULE --- */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32 pb-12">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
//                 Job Details
//               </h3>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
//                     <Phone size={20} />
//                   </div>
//                   <div>
//                     <span className={labelClass}>Contact Person Number</span>
//                     <p className={valueClass}>
//                       {company?.contact_number ||
//                         vacancy?.company?.phone ||
//                         "+91 ••••••••••"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
//                     <UserCheck size={20} />
//                   </div>
//                   <div>
//                     <span className={labelClass}>Contact Person</span>
//                     <p className={valueClass}>
//                       {company?.contact_person ||
//                         vacancy?.company?.contact_person ||
//                         "Hiring Lead"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200 ">
//                 <ShieldCheck
//                   className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700"
//                   size={100}
//                 />
//                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">
//                   Closing Date
//                 </p>
//                 <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">
//                   {formatEnterpriseDate(vacancy?.deadline_date)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex w-full">
//           {/* --- MASTER SWITCH CONTENT AREA --- */}

//           {/* 🔵 CANDIDATE REGISTRY VIEW */}
//           {activeMetricTab && !showMetadata && (
//             <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
//               <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
//                 {/* Header Info */}
//                 {/* ================= FILTER REGISTRY CONSOLE ================= */}
//                 <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
//                   <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
//                     {/* SECTION HEADER */}
//                     <div className="flex items-center gap-3 mb-6 px-1">
//                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
//                         <Layers size={16} strokeWidth={2.5} />
//                       </div>
//                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
//                         Filter
//                       </span>
//                     </div>

//                     {/* FILTER GRID */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
//                       {/* EXPERIENCE FILTER */}
//                       <FilterDropdown
//                         label="Experience"
//                         icon={<Clock size={13} />}
//                         options={[
//                           "0-1 Years",
//                           "1-3 Years",
//                           "3-5 Years",
//                           "5-10 Years",
//                           "10+ Years",
//                         ]}
//                         selected={filters.experiences}
//                         onSelect={(v) => toggleFilter("experiences", v)}
//                       />

//                       {/* EDUCATION FILTER */}
//                       <FilterDropdown
//                         label="Eduction"
//                         icon={<GraduationCap size={13} />}
//                         options={educationMasters.map((edu) =>
//                           edu.name.toUpperCase(),
//                         )}
//                         selected={filters.educations}
//                         onSelect={(v) => toggleFilter("educations", v)}
//                       />

//                       <FilterDropdown
//                         label="Language"
//                         icon={<Languages size={13} />}
//                         options={[
//                           "ENGLISH",
//                           "HINDI",
//                           "MARATHI",
//                           "GUJARATI",
//                           "TAMIL",
//                         ]}
//                         selected={filters.languages}
//                         onSelect={(v) => toggleFilter("languages", v)}
//                       />

//                       {/* 🎂 AGE RANGE FILTER */}
//                       <FilterDropdown
//                         label="Age Range"
//                         icon={<Calendar size={13} />}
//                         options={["18 - 25", "26 - 35", "36 - 45", "45+"]}
//                         selected={filters.ages}
//                         onSelect={(v) => toggleFilter("ages", v)}
//                       />

//                       {/* 🏭 INDUSTRY FILTER (New) */}
//                       <FilterDropdown
//                         label="Industry"
//                         icon={<Building2 size={13} />}
//                         options={industries.map((ind) =>
//                           ind.name.toUpperCase(),
//                         )}
//                         selected={filters.industries}
//                         onSelect={(v) => toggleFilter("industries", v)}
//                       />

//                       <FilterDropdown
//                         label="District"
//                         icon={<MapPin size={13} />}
//                         options={districtOptions}
//                         selected={filters.districts}
//                         onSelect={(v) => {
//                           toggleFilter("districts", v);
//                           // Optional: Clear cities when district changes to avoid invalid combinations
//                           setFilters((prev) => ({ ...prev, cities: [] }));
//                         }}
//                       />

//                       {/* CITY FILTER (Dependent) */}
//                       <FilterDropdown
//                         label="City"
//                         icon={<Navigation size={13} />}
//                         options={dependentCityOptions}
//                         selected={filters.cities}
//                         onSelect={(v) => toggleFilter("cities", v)}
//                       />

//                       {/* GENDER FILTER */}
//                       <FilterDropdown
//                         label="Gender"
//                         icon={<Users size={13} />}
//                         options={["MALE", "FEMALE", "OTHER"]}
//                         selected={filters.genders}
//                         onSelect={(v) => toggleFilter("genders", v)}
//                       />

//                       <FilterDropdown
//                         label="Skills"
//                         icon={<Zap size={13} />}
//                         options={skillOptions}
//                         selected={filters.skills}
//                         onSelect={(v) => toggleFilter("skills", v)}
//                       />
//                     </div>

//                     {/* ACTIVE FILTER CHIPS */}
//                     {/* {Object.values(filters).some(arr => arr.length > 0) && (
//       <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
//         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Filter Applied:</span>
//         {Object.entries(filters).map(([cat, vals]) => 
//           vals.map(v => (
//             <button key={v} onClick={() => toggleFilter(cat, v)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-100">
//               {v} <X size={12} className="text-blue-300 group-hover:text-white" />
//             </button>
//           ))
//         )}
//         <button onClick={clearAllFilters} className="ml-auto text-[9px] !bg-transparent font-black uppercase !text-black hover:underline">Clear All</button>
//       </div>
//     )} */}
//                     {/* ACTIVE FILTER CHIPS */}
//                     {Object.values(filters).some((arr) => arr.length > 0) && (
//                       <div
//                         className={`mt-8 pt-6 border-t flex flex-wrap items-center gap-3 p-4 rounded-2xl border-dashed transition-all ${
//                           activeMetricTab === "responses"
//                             ? "bg-blue-50 border-blue-200"
//                             : "bg-white border-slate-100"
//                         }`}
//                       >
//                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">
//                           {activeMetricTab === "responses"
//                             ? "Requirement Match:"
//                             : "Filter Applied:"}
//                         </span>
//                         {Object.entries(filters).map(([cat, vals]) =>
//                           vals.map((v) => (
//                             <button
//                               key={v}
//                               onClick={() => toggleFilter(cat, v)}
//                               className="flex items-center gap-2 px-3 py-1.5 !bg-white !text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-500"
//                             >
//                               {v}{" "}
//                               <X
//                                 size={12}
//                                 className="text-blue-300 group-hover:text-white"
//                               />
//                             </button>
//                           )),
//                         )}
//                         <button
//                           onClick={clearAllFilters}
//                           className="ml-auto text-[9px] !bg-transparent font-black uppercase !text-black hover:underline"
//                         >
//                           Clear All
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//                       <Activity size={20} strokeWidth={2.5} />
//                     </div>
//                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//                       {activeMetricTab} Candidate
//                     </h3>
//                   </div>

//                   <div className="flex items-center gap-4 flex-1 justify-end">
//                     {/* SEARCH NODE */}
//                     <div className="relative group flex-1 max-w-[280px]">
//                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//                         <Search size={14} strokeWidth={3} />
//                       </div>
//                       <input
//                         type="text"
//                         placeholder="Filter by name..."
//                         value={registrySearch}
//                         onChange={(e) => setRegistrySearch(e.target.value)}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//                       />
//                       {registrySearch && (
//                         <button
//                           onClick={() => setRegistrySearch("")}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500"
//                         >
//                           <X size={12} strokeWidth={3} />
//                         </button>
//                       )}
//                     </div>

//                     <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//                       {filteredResults.length} Found
//                     </span>

//                     <button
//                       onClick={() => {
//                         setActiveMetricTab(null);
//                         setRegistrySearch("");
//                       }}
//                       className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90"
//                     >
//                       <X size={20} strokeWidth={2.5} />
//                     </button>
//                   </div>
//                 </div>

//                 {loadingMetrics ? (
//                   <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//                     <Loader2
//                       size={40}
//                       className="text-blue-600 animate-spin mb-4"
//                     />
//                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
//                       Synchronizing Registry...
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//                       {currentCandidates.map((c) => (
//                         /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                         <div
//                           key={c.id}
//                           className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//                         >
//                           {/* Security Watermark Anchor */}
//                           <ShieldCheck
//                             className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                             size={150}
//                           />

//                           <div className="relative z-10 space-y-6">
//                             {/* TOP SECTION: IDENTITY */}
//                             <div className="flex items-start justify-between">
//                               <div className="flex items-center gap-4">
//                                 <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                                   {(c.full_name || "U").charAt(0)}
//                                 </div>
//                                 <div>
//                                   <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                                     {c.full_name?.toLowerCase()}
//                                   </h3>
//                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                                     {c.age || "Not Specified"} •{" "}
//                                     {c.gender || "Not Specified"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                             <div className="space-y-4 pl-1">
//                               <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                                 {/* EXPERIENCE NODE */}
//                                 <div className="flex items-center gap-3">
//                                   <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                                     <Briefcase size={18} strokeWidth={2.5} />
//                                   </div>
//                                   <div className="flex flex-col">
//                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//                                       Experience
//                                     </span>
//                                     <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//                                       {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//                                       {parseFloat(c.total_experience_years) ===
//                                       0
//                                         ? "Fresher"
//                                         : `${c.total_experience_years} Years`}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* LOCATION NODE */}
//                                 <div className="flex items-center gap-3">
//                                   <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                                     <MapPin size={18} strokeWidth={2.5} />
//                                   </div>
//                                   <div className="flex flex-col">
//                                     <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//                                       Location
//                                     </span>
//                                     <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//                                       {c.location || "Not Specified"}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* SALARY NODE */}
//                                 <div className="flex items-center gap-3 min-w-[140px]">
//                                   <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                                     <span className="text-[16px] font-black leading-none">
//                                       ₹
//                                     </span>
//                                   </div>
//                                   <div className="flex flex-col">
//                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//                                       Prev. CTC
//                                     </span>
//                                     <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                                       {c.previous_ctc
//                                         ? `${(c.previous_ctc / 100000).toFixed(2)} LPA`
//                                         : "Not Specified"}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
//                             <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//                               {/* Vertical System Accent */}
//                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//                                 {/* COLUMN 1: CURRENT JOB */}
//                                 <div className="flex items-center gap-3">
//                                   <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//                                     <Briefcase size={14} strokeWidth={3} />
//                                   </div>
//                                   <div>
//                                     <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
//                                       Current Job
//                                     </p>
//                                     <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//                                       {c.latest_job_title || "Not Specified"}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 {/* COLUMN 2: CANDIDATE AGE */}
//                                 <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//                                   <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//                                     <GraduationCap size={14} strokeWidth={3} />
//                                   </div>
//                                   <div>
//                                     <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
//                                       Eduction
//                                     </p>
//                                     <p className="text-[12px] font-black text-slate-700 uppercase">
//                                       {c.latest_education || "Not Specified"}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 {/* COLUMN 3: LANGUAGES HUB */}
//                                 <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//                                   {/* 🟢 ALIGNED HEADER UNIT */}
//                                   <div className="flex items-center gap-3">
//                                     {/* Branding Box - Sized to match the visual weight of the title */}
//                                     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//                                       <Languages size={14} strokeWidth={2.5} />
//                                     </div>

//                                     {/* Heading - Vertically centered with icon */}
//                                     <div>
//                                       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//                                         Spoken Language
//                                       </p>
//                                       {/* 🔵 CONTENT AREA */}
//                                       <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//                                         {(c.languages_spoken || []).length >
//                                         0 ? (
//                                           <>
//                                             {(c.isLanguagesExpanded
//                                               ? c.languages_spoken
//                                               : c.languages_spoken.slice(0, 2)
//                                             ).map((lang, idx) => (
//                                               <span
//                                                 key={idx}
//                                                 className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//                                               >
//                                                 {lang}
//                                               </span>
//                                             ))}

//                                             {/* TOGGLE BUTTON */}
//                                             {c.languages_spoken.length > 2 && (
//                                               <button
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setMetricData((prev) =>
//                                                     prev.map((item) =>
//                                                       item.id === c.id
//                                                         ? {
//                                                             ...item,
//                                                             isLanguagesExpanded:
//                                                               !item.isLanguagesExpanded,
//                                                           }
//                                                         : item,
//                                                     ),
//                                                   );
//                                                 }}
//                                                 className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                                                   c.isLanguagesExpanded
//                                                     ? "bg-slate-800 text-white shadow-md"
//                                                     : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//                                                 }`}
//                                               >
//                                                 {c.isLanguagesExpanded
//                                                   ? "Less"
//                                                   : `+${c.languages_spoken.length - 2} More`}
//                                               </button>
//                                             )}
//                                           </>
//                                         ) : (
//                                           <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//                                             Not Specified
//                                           </span>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
//                               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
//                                 {/* SKILLS REGISTRY */}
//                                 <div className="space-y-2">
//                                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
//                                     Skills
//                                   </p>
//                                   <div className="flex flex-wrap gap-1.5 items-center">
//                                     {(c.skills || []).length > 0 ? (
//                                       <>
//                                         {(c.isSkillsExpanded
//                                           ? c.skills
//                                           : c.skills.slice(0, 2)
//                                         ).map((skill, idx) => (
//                                           <span
//                                             key={idx}
//                                             className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//                                           >
//                                             {skill}
//                                           </span>
//                                         ))}
//                                         {c.skills.length > 2 && (
//                                           <button
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               setMetricData((prev) =>
//                                                 prev.map((item) =>
//                                                   item.id === c.id
//                                                     ? {
//                                                         ...item,
//                                                         isSkillsExpanded:
//                                                           !item.isSkillsExpanded,
//                                                       }
//                                                     : item,
//                                                 ),
//                                               );
//                                             }}
//                                             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                                               c.isSkillsExpanded
//                                                 ? "bg-slate-800 text-white"
//                                                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//                                             }`}
//                                           >
//                                             {c.isSkillsExpanded
//                                               ? "Less"
//                                               : `+${c.skills.length - 2} More`}
//                                           </button>
//                                         )}
//                                       </>
//                                     ) : (
//                                       <span className="text-[10px] font-bold text-slate-300 italic uppercase">
//                                         No Skills
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>

//                                 {/* INDUSTRIES HUB */}
//                                 <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//                                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
//                                     Industry
//                                   </p>
//                                   <div className="flex flex-wrap gap-2 items-center">
//                                     {(c.industries_worked || []).length > 0 ? (
//                                       <>
//                                         {(c.isIndustriesExpanded
//                                           ? c.industries_worked
//                                           : c.industries_worked.slice(0, 2)
//                                         ).map((ind, idx) => (
//                                           <div
//                                             key={idx}
//                                             className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95"
//                                           >
//                                             <Layers size={10} strokeWidth={3} />
//                                             <span className="text-[9px] font-black uppercase tracking-tighter">
//                                               {ind.name || ind}
//                                             </span>
//                                           </div>
//                                         ))}
//                                         {c.industries_worked.length > 2 && (
//                                           <button
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               setMetricData((prev) =>
//                                                 prev.map((item) =>
//                                                   item.id === c.id
//                                                     ? {
//                                                         ...item,
//                                                         isIndustriesExpanded:
//                                                           !item.isIndustriesExpanded,
//                                                       }
//                                                     : item,
//                                                 ),
//                                               );
//                                             }}
//                                             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                                               c.isIndustriesExpanded
//                                                 ? "bg-slate-800 text-white"
//                                                 : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//                                             }`}
//                                           >
//                                             {c.isIndustriesExpanded
//                                               ? "Less"
//                                               : `+${c.industries_worked.length - 2} More`}
//                                           </button>
//                                         )}
//                                       </>
//                                     ) : (
//                                       <span className="text-[10px] font-bold text-slate-300 italic uppercase">
//                                         No Sectors
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* BOTTOM ACTION BAR */}
//                             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
//                               {/* --- CONTACT NODE --- */}
//                               <div className="flex items-center gap-3">
//                                 <div
//                                   className={`p-2 rounded-lg transition-all duration-500 ${
//                                     revealedNumbers[c.id]
//                                       ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
//                                       : "bg-slate-100 text-slate-400"
//                                   }`}
//                                 >
//                                   <Phone size={14} strokeWidth={2.5} />
//                                 </div>

//                                 <div className="flex flex-col">
//                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                                     Contact Number
//                                   </span>

//                                   <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//                                     {isRevealedForThisVacancy(c) ? (
//                                       <span className="animate-in fade-in zoom-in-95 duration-300">
//                                         {c.phone || "No Data"}
//                                       </span>
//                                     ) : (
//                                       <span className="text-slate-300 select-none tracking-[0.3em]">
//                                         +91 ••••••••••
//                                       </span>
//                                     )}
//                                   </p>
//                                 </div>
//                               </div>

//                               {/* RIGHT SIDE: ACTIONS */}
//                               <div className="flex items-center gap-3 w-full sm:w-auto">
//                                 <button
//                                   onClick={() =>
//                                     navigate(`/candidateflow?id=${c.id}`)
//                                   }
//                                   className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                                 >
//                                   <Gavel size={14} /> Decision
//                                 </button>

//                                 {!isRevealedForThisVacancy(c) ? (
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       // toggleNumberReveal(c.id);
//                                       toggleNumberReveal(c);
//                                     }}
//                                     className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//                                   >
//                                     <UserCheck size={14} strokeWidth={3} /> View
//                                     Number
//                                   </button>
//                                 ) : (
//                                   /* Optional: Show a "Linked" badge instead of a button for better UX */
//                                   <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
//                                     <CheckCircle2
//                                       size={12}
//                                       className="text-emerald-500"
//                                     />
//                                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">
//                                       Viewed Number
//                                     </span>
//                                   </div>
//                                 )}

//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//                                     navigate(`/profile/${c.id}`);
//                                   }}
//                                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
//                                 >
//                                   {/* Branding Box Icon Effect */}
//                                   <UserCheck
//                                     size={14}
//                                     strokeWidth={3}
//                                     className="group-hover:scale-110 transition-transform"
//                                   />
//                                   View Candidate
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
//                     {totalCandidatePages > 1 && (
//                       <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
//                         {/* LEFT SIDE: Technical Registry Info */}
//                         <div className="flex items-center gap-4">
//                           <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//                             <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//                               Showing{" "}
//                               <span className="text-slate-900">
//                                 {indexOfFirstCandidate + 1} -{" "}
//                                 {Math.min(
//                                   indexOfLastCandidate,
//                                   metricData.length,
//                                 )}
//                               </span>
//                               <span className="mx-2 opacity-30">|</span>
//                               Total{" "}
//                               <span className="text-slate-900">
//                                 {metricData.length}
//                               </span>{" "}
//                               Entries
//                             </p>
//                           </div>
//                         </div>

//                         {/* RIGHT SIDE: Navigation Controls */}
//                         <div className="flex items-center gap-3">
//                           {/* Previous Page Arrow */}
//                           <button
//                             disabled={candidatePage === 1}
//                             onClick={() => setCandidatePage((p) => p - 1)}
//                             className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//                           >
//                             <ChevronLeft size={18} strokeWidth={3} />
//                           </button>

//                           {/* Truncated Number Strip */}
//                           <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//                             {getPaginationGroup().map((item, index) => (
//                               <React.Fragment key={index}>
//                                 {item === "..." ? (
//                                   <div className="w-8 flex items-center justify-center">
//                                     <span className="text-[10px] font-black !text-slate-300 tracking-tighter">
//                                       •••
//                                     </span>
//                                   </div>
//                                 ) : (
//                                   <button
//                                     onClick={() => setCandidatePage(item)}
//                                     className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                                       candidatePage === item
//                                         ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                                         : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                                     }`}
//                                   >
//                                     {item.toString().padStart(2, "0")}
//                                   </button>
//                                 )}
//                               </React.Fragment>
//                             ))}
//                           </div>

//                           {/* Next Page Arrow */}
//                           <button
//                             disabled={candidatePage === totalCandidatePages}
//                             onClick={() => setCandidatePage((p) => p + 1)}
//                             className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//                           >
//                             <ChevronRight size={18} strokeWidth={3} />
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* 🟢 VACANCY DETAILS VIEW */}
//           {showMetadata && (
//             <div className="space-y-4 pb-10 mt-10 w-full">
//               {/* 1. JOB DESCRIPTION ACCORDION (Existing) */}
//               <div
//                 className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "description" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
//               >
//                 <button
//                   onClick={() =>
//                     setActiveAccordion(
//                       activeAccordion === "description" ? null : "description",
//                     )
//                   }
//                   className="w-full px-8 py-7 flex !bg-transparent items-center justify-between transition-all"
//                 >
//                   <div className="flex items-center gap-5">
//                     <div
//                       className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "description" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
//                     >
//                       <FileText size={24} strokeWidth={2.5} />
//                     </div>
//                     <div className="flex flex-col text-left">
//                       <span
//                         className={`text-[9px] font-black uppercase !bg-transparent tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "description" ? "!text-white/60" : "!text-slate-400"}`}
//                       >
//                         Section 01
//                       </span>
//                       <h3
//                         className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "description" ? "!text-white" : "!text-slate-900"}`}
//                       >
//                         Job Description
//                       </h3>
//                     </div>
//                   </div>
//                   <div
//                     className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "description" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
//                   >
//                     <ChevronDown size={20} strokeWidth={3} />
//                   </div>
//                 </button>
//                 {activeAccordion === "description" && (
//                   <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//                     <div className="h-[1px] w-full !bg-slate-50 mb-8" />
//                     <div
//                       className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           jobDescription?.content ||
//                           "No overview protocol found.",
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* 2. RESPONSIBILITIES ACCORDION (Existing) */}
//               <div
//                 className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "responsibilities" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
//               >
//                 <button
//                   onClick={() =>
//                     setActiveAccordion(
//                       activeAccordion === "responsibilities"
//                         ? null
//                         : "responsibilities",
//                     )
//                   }
//                   className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all"
//                 >
//                   <div className="flex items-center gap-5">
//                     <div
//                       className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
//                     >
//                       <Zap size={24} strokeWidth={2.5} />
//                     </div>
//                     <div className="flex flex-col text-left">
//                       <span
//                         className={`text-[9px] font-black uppercase tracking-[0.3em] !bg-transparent leading-none mb-1.5 transition-colors ${activeAccordion === "responsibilities" ? "!text-white/60" : "!text-slate-400"}`}
//                       >
//                         Section 02
//                       </span>
//                       <h3
//                         className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "responsibilities" ? "!text-white" : "!text-slate-900"}`}
//                       >
//                         Responsibilities
//                       </h3>
//                     </div>
//                   </div>
//                   <div
//                     className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "responsibilities" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
//                   >
//                     <ChevronDown size={20} strokeWidth={3} />
//                   </div>
//                 </button>
//                 {activeAccordion === "responsibilities" && (
//                   <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//                     <div className="h-[1px] w-full !bg-slate-50 mb-8" />
//                     <div
//                       className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           jobDescription?.responsibilities ||
//                           "Standard operating procedures apply.",
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* 3. ELIGIBILITY ACCORDION (Existing) */}
//               <div
//                 className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "prerequisite" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
//               >
//                 <button
//                   onClick={() =>
//                     setActiveAccordion(
//                       activeAccordion === "prerequisite"
//                         ? null
//                         : "prerequisite",
//                     )
//                   }
//                   className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all"
//                 >
//                   <div className="flex items-center gap-5">
//                     <div
//                       className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
//                     >
//                       <ShieldCheck size={24} strokeWidth={2.5} />
//                     </div>
//                     <div className="flex flex-col text-left">
//                       <span
//                         className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "prerequisite" ? "!text-white/60" : "!text-slate-400"}`}
//                       >
//                         Section 03
//                       </span>
//                       <h3
//                         className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "prerequisite" ? "!text-white" : "!text-slate-900"}`}
//                       >
//                         Eligibility
//                       </h3>
//                     </div>
//                   </div>
//                   <div
//                     className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "prerequisite" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
//                   >
//                     <ChevronDown size={20} strokeWidth={3} />
//                   </div>
//                 </button>
//                 {activeAccordion === "prerequisite" && (
//                   <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 bg-white mx-1.5 mb-1.5 rounded-[2rem]">
//                     <div className="h-[1px] w-full bg-slate-50 mb-8" />
//                     <div
//                       className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed custom-html-view [overflow-wrap:anywhere]"
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           jobDescription?.requirements ||
//                           "No specific prerequisites listed.",
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* 4. NEW: REGISTRY DATA ACCORDION (Added for Degrees, Languages, Assets, Certs) */}
//               <div
//                 className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-sm ${activeAccordion === "registry" ? "!bg-[#2563eb] !border-[#2563eb]" : "!bg-white !border-slate-100"}`}
//               >
//                 <button
//                   onClick={() =>
//                     setActiveAccordion(
//                       activeAccordion === "registry" ? null : "registry",
//                     )
//                   }
//                   className="w-full px-8 py-7 flex items-center !bg-transparent justify-between transition-all"
//                 >
//                   <div className="flex items-center gap-5">
//                     <div
//                       className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white/10 !text-white !border-white/20 backdrop-blur-md shadow-inner" : "!bg-slate-50 !border-slate-100 !text-slate-400"}`}
//                     >
//                       <Layers size={24} strokeWidth={2.5} />
//                     </div>
//                     <div className="flex flex-col text-left">
//                       <span
//                         className={`text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 transition-colors ${activeAccordion === "registry" ? "!text-white/60" : "!text-slate-400"}`}
//                       >
//                         Section 04
//                       </span>
//                       <h3
//                         className={`text-sm font-black uppercase tracking-[0.15em] leading-none transition-colors ${activeAccordion === "registry" ? "!text-white" : "!text-slate-900"}`}
//                       >
//                         Addtional Information
//                       </h3>
//                     </div>
//                   </div>
//                   <div
//                     className={`p-2 rounded-full transition-all duration-500 ${activeAccordion === "registry" ? "!bg-white !text-[#2563eb] rotate-180 shadow-lg" : "!bg-slate-50 !text-slate-300"}`}
//                   >
//                     <ChevronDown size={20} strokeWidth={3} />
//                   </div>
//                 </button>
//                 {activeAccordion === "registry" && (
//                   <div className="px-8 pb-10 pt-6 animate-in slide-in-from-top-4 duration-500 !bg-white mx-1.5 mb-1.5 rounded-[2rem] space-y-8">
//                     <div className="h-[1px] w-full !bg-slate-50" />

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       {/* Degrees */}
//                       <div className="space-y-2">
//                         <span className={labelClass}>Degree</span>
//                         <div className="flex flex-wrap gap-2">
//                           {vacancy?.degrees?.map((d) => (
//                             <span
//                               key={d.id}
//                               className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100"
//                             >
//                               {d.name}
//                             </span>
//                           )) || (
//                             <p className="text-xs text-slate-400">
//                               Standard Degree applies
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Languages */}
//                       <div className="space-y-2">
//                         <span className={labelClass}>Languages</span>
//                         <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">
//                           {vacancy?.spoken_languages?.join(" • ") ||
//                             "English / Hindi"}
//                         </p>
//                       </div>

//                       {/* Assets */}
//                       <div className="space-y-2">
//                         <span className={labelClass}>Assets</span>
//                         <div className="flex flex-wrap gap-2">
//                           {vacancy?.assets_req?.map((asset) => (
//                             <span
//                               key={asset}
//                               className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase border border-slate-100"
//                             >
//                               {asset}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Certifications */}
//                       <div className="space-y-2">
//                         <span className={labelClass}>
//                           Professional Certifications
//                         </span>
//                         <div className="flex flex-wrap gap-2">
//                           {vacancy?.certificates_req?.map((cert) => (
//                             <span
//                               key={cert}
//                               className="px-3 py-1 bg-[#2563eb] text-white rounded-lg text-[9px] font-black uppercase shadow-sm"
//                             >
//                               {cert}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
//         .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//       `,
//         }}
//       />
//     </div>
//   );
// };

// // --- SUB-COMPONENT REGISTRY ---
// const MetricTab = ({
//   icon: Icon,
//   label,
//   count,
//   onClick,
//   colorClass,
//   iconBg,
//   isActive,
// }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
//   >
//     <div className="flex items-center gap-4">
//       <div
//         className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}
//       >
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
//           {label}
//         </span>
//         <div className="flex items-center gap-2">
//           <span
//             className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}
//           >
//             {count.toString().padStart(2, "0")}
//           </span>
//           <div
//             className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`}
//           />
//         </div>
//       </div>
//     </div>
//   </button>
// );

// export default VacancyDetails;

//***********************************************working code phase 2 04/03/26**************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Users,
//   IndianRupee,
//   FileText,
//   Gavel,
//   GraduationCap,
//   UserPlus,
//   CheckCircle2,
//   Activity,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft,
//   Navigation,
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE REGISTRY ---
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null);
//   const [metricData, setMetricData] = useState([]);
//   const [loadingMetrics, setLoadingMetrics] = useState(false);
//   const [candidatePage, setCandidatePage] = useState(1);
//   const candidatesPerPage = 5;
//   const [registrySearch, setRegistrySearch] = useState("");
//   const [showMetadata, setShowMetadata] = useState(true);
//   const [skillsMaster, setSkillsMaster] = useState([]);

//   // --- ADD TO STATE REGISTRY ---
// const [filters, setFilters] = useState({
//   experiences: [],
//   educations: [],
//   districts: [],
//   cities: [],
//   genders: [],
//   industries: [],
//   skills: [],
// });
// const [industries, setIndustries] = useState([]);
// const [educationMasters, setEducationMasters] = useState([]);

//   // 1. Move the function out so the whole component can use it
// const fetchAllDetails = async () => {
//   setLoading(true);
//   try {
//     const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//     if (!vacRes.ok) throw new Error("Vacancy node not found");
//     const vacData = await vacRes.json();
//     setVacancy(vacData);

//     const [resResp, resLeads, resDb] = await Promise.all([
//       fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates`)
//     ]);

//     const [dataResp, dataLeads, dataDb] = await Promise.all([
//       resResp.json(), resLeads.json(), resDb.json()
//     ]);

//     setMetrics({
//       responses: dataResp.length || 0,
//       leads: dataLeads.length || 0,
//       database: dataDb.length || 0
//     });

//     if (vacData.job_description) {
//       const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//       const jdData = await jdRes.json();
//       setJobDescription(jdData);
//     }

//     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//     const compListData = await compRes.json();
//     const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//     if (matchedCompany) setCompany(matchedCompany);

//   } catch (err) {
//     toast.error(err.message);
//     navigate("/vacancies");
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   if (activeMetricTab) {
//     const delayDebounceFn = setTimeout(() => {
//       // 🟢 Pass 'true' for isAutoRefresh
//       handleTabClick(activeMetricTab, filters, registrySearch, true);
//     }, 500); 

//     return () => clearTimeout(delayDebounceFn);
//   }
// }, [filters, registrySearch]);

// // 2. The useEffect now simply triggers the shared function on mount
// useEffect(() => {
//   fetchAllDetails();
// }, [id, navigate]);


// // Add these to your fetchAllDetails function or a new useEffect
// useEffect(() => {
//   const fetchMasters = async () => {
//     try {
//       const [eduRes, indRes, skillRes] = await Promise.all([
//         fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100"),
//         fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100"),
//         fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100")
//       ]);
//       const eduData = await eduRes.json();
//       const indData = await indRes.json();
//       const skillData = await skillRes.json();
      
//       setEducationMasters(eduData || []);
//       setIndustries(indData || []);
//       setSkillsMaster(skillData || []);
//     } catch (err) {
//       console.error("Master Data Sync Failure", err);
//     }
//   };
//   fetchMasters();
// }, []);


// // const filteredResults = useMemo(() => {
// //   return metricData.filter((c) => {
// //     // 1. Search Query
// //     const matchesSearch = c.full_name?.toLowerCase().includes(registrySearch.toLowerCase());
    
// //     // 2. City Filter
// //     const matchesCity = filters.cities.length === 0 || filters.cities.includes(c.city?.toUpperCase());
    
// //     // 3. Education Filter
// //     const matchesEdu = filters.educations.length === 0 || filters.educations.includes(c.latest_education?.toUpperCase());
    
// //     // 4. Gender Filter
// //     const matchesGender = filters.genders.length === 0 || filters.genders.includes(c.gender?.toUpperCase());

// //     return matchesSearch && matchesCity && matchesEdu && matchesGender;
// //   });
// // }, [metricData, registrySearch, filters]);


// const filteredResults = useMemo(() => {
//   // Now simply returns the data from the API
//   return metricData;
// }, [metricData]);


// const toggleFilter = (category, value) => {
//   setFilters((prev) => ({
//     ...prev,
//     [category]: prev[category].includes(value)
//       ? prev[category].filter((item) => item !== value)
//       : [...prev[category], value],
//   }));
//   setCandidatePage(1); // Reset to first page on filter change
// };


// // This was likely defined too low in your previous code
//   const skillOptions = useMemo(() => {
//     return skillsMaster.map(s => s.name.toUpperCase()).sort();
//   }, [skillsMaster]);

//   // --- LOGIC HELPERS ---

//   const indexOfLastCandidate = candidatePage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
//   const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

//   useEffect(() => {
//     setCandidatePage(1);
//   }, [activeMetricTab, registrySearch]);

//   // const handleTabClick = async (tabType) => {
//   //   if (activeMetricTab === tabType) {
//   //     setActiveMetricTab(null);
//   //     setShowMetadata(true);
//   //     return;
//   //   }
//   //   setActiveMetricTab(tabType);
//   //   setShowMetadata(false); // 🟢 Auto-hide Vacancy Post when Registry is clicked
//   //   setLoadingMetrics(true);
//   //   try {
//   //     let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//   //               tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//   //               `https://apihrr.goelectronix.co.in/candidates`;
//   //     const res = await fetch(url);
//   //     const data = await res.json();
//   //     setMetricData(data);
//   //   } catch (err) {
//   //     toast.error("Registry sync failed");
//   //   } finally {
//   //     setLoadingMetrics(false);
//   //   }
//   // };


// //   const handleTabClick = async (tabType) => {
// //   if (activeMetricTab === tabType) {
// //     setActiveMetricTab(null);
// //     setShowMetadata(true);
// //     return;
// //   }
  
// //   setActiveMetricTab(tabType);
// //   setShowMetadata(false); 
// //   setLoadingMetrics(true);

// //   try {
// //     let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
// //               tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
// //               `https://apihrr.goelectronix.co.in/candidates`;
    
// //     const res = await fetch(url);
// //     const rawData = await res.json();

// //     // 🛠️ ATOMIC DATA SYNC: Fetch full profile for revealed candidates
// //     const synchronizedData = await Promise.all(rawData.map(async (c) => {
// //       // Check if this candidate is already revealed for the current vacancy
// //       const currentVacancyId = id.toString();
// //       const existingIds = c.applied_vacancy_ids 
// //         ? c.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
// //         : [];
      
// //       const isAlreadyRevealed = existingIds.includes(currentVacancyId);

// //       if (isAlreadyRevealed) {
// //         try {
// //           // Trigger individual fetch to get the real phone number
// //           const profileRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${c.id}`);
// //           const fullProfile = await profileRes.json();
// //           return { ...c, phone: fullProfile.phone }; // Merge real phone into candidate object
// //         } catch (e) {
// //           console.error(`Telemetry sync failed for candidate ${c.id}`);
// //           return c;
// //         }
// //       }
// //       return c; // Return as is if not revealed
// //     }));

// //     setMetricData(synchronizedData);
// //   } catch (err) {
// //     toast.error("Registry sync failed");
// //   } finally {
// //     setLoadingMetrics(false);
// //   }
// // };


// // 🟢 Added 'isAutoRefresh' parameter to identify where the call is coming from
// // 🟢 Added 'isAutoRefresh' parameter
// const handleTabClick = async (tabType, currentFilters = filters, searchQuery = registrySearch, isAutoRefresh = false) => {
  
//   const activeTab = tabType || activeMetricTab;
//   if (!activeTab) return;

//   // 🛡️ Logic Gate: 
//   // If NOT an auto-refresh (human clicked) AND the tab is already open -> Close it.
//   // If it IS an auto-refresh (filter change) -> SKIP this close logic.
//   if (!isAutoRefresh && activeMetricTab === tabType) {
//     setActiveMetricTab(null);
//     setShowMetadata(true);
//     return;
//   }

//   setActiveMetricTab(activeTab);
//   setShowMetadata(false);
//   setLoadingMetrics(true);

//   try {
//     const params = new URLSearchParams();
    
//     if (activeTab !== 'database') {
//       params.append("vacancy_id", id);
//     }
//     if (activeTab === 'responses') {
//       params.append("status", "jd_sent");
//     }

//     if (searchQuery) {
//       params.append("search", searchQuery);
//     }

//     // Add filters to URL params
//     // currentFilters.cities.forEach(city => params.append("city", city));
//     // Add District Filters
//   currentFilters.districts.forEach(d => params.append("district", d));
//   // Add City Filters
//   currentFilters.cities.forEach(c => params.append("city", c));
//     currentFilters.educations.forEach(edu => params.append("education", edu));
//     currentFilters.genders.forEach(gen => params.append("gender", gen.toLowerCase()));

//     currentFilters.industries.forEach((industryName) => {
//       const match = industries.find(i => i.name.toUpperCase() === industryName.toUpperCase());
//       if (match) params.append("industry_id", match.id);
//     });

//     currentFilters.skills.forEach(skill => {
//   params.append("skills", skill.toLowerCase());
// });

//     const url = `https://apihrr.goelectronix.co.in/candidates?${params.toString()}`;
//     const res = await fetch(url);
//     const rawData = await res.json();

//     // Re-sync phone numbers for revealed candidates
//     const synchronizedData = await Promise.all(rawData.map(async (c) => {
//       const currentVacancyId = id.toString();
//       const existingIds = c.applied_vacancy_ids 
//         ? c.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
//         : [];
      
//       if (existingIds.includes(currentVacancyId)) {
//         try {
//           const profileRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${c.id}`);
//           const fullProfile = await profileRes.json();
//           return { ...c, phone: fullProfile.phone };
//         } catch (e) { return c; }
//       }
//       return c;
//     }));

//     setMetricData(synchronizedData);
//   } catch (err) {
//     toast.error("candidate Fetch failed");
//   } finally {
//     setLoadingMetrics(false);
//   }
// };


//   const getPaginationGroup = () => {
//     const range = [];
//     const delta = 1;
//     for (let i = 1; i <= totalCandidatePages; i++) {
//       if (i === 1 || i === totalCandidatePages || (i >= candidatePage - delta && i <= candidatePage + delta)) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "...") {
//         range.push("...");
//       }
//     }
//     return range;
//   };


// //   const toggleFilter = (category, value) => {
// //   setFilters((prev) => ({
// //     ...prev,
// //     [category]: prev[category].includes(value)
// //       ? prev[category].filter((item) => item !== value)
// //       : [...prev[category], value],
// //   }));
// // };

// const clearAllFilters = () => {
//   setFilters({ 
//     experiences: [],
//     educations: [],
//     districts: [],  // 🟢 Reset Districts
//     cities: [],     // 🟢 Reset Cities
//     genders: [],
//     industries: [], // 🟢 Reset Industries
//   });

//   setRegistrySearch("");
  
//   // Reset pagination to page 1
//   setCandidatePage(1);
// };

//   const formatEnterpriseDate = (d) => {
//     if (!d) return "N/A";
//     const date = new Date(d);
//     return `${String(date.getDate()).padStart(2, '0')}-${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
//   };


//   // 1. Extract unique Districts from the current metric data
// const districtOptions = useMemo(() => {
//   const set = new Set();
//   metricData.forEach((c) => {
//     if (c.district) set.add(c.district.toUpperCase());
//   });
//   return Array.from(set).sort();
// }, [metricData]);

// // 2. Extract Cities based on selected Districts
// const dependentCityOptions = useMemo(() => {
//   const set = new Set();
//   metricData.forEach((c) => {
//     const candidateDist = c.district?.toUpperCase();
    
//     // Logic: If no district is selected, show all. 
//     // If district is selected, only show cities belonging to that district.
//     if (filters.districts.length === 0 || filters.districts.includes(candidateDist)) {
//       if (c.city) set.add(c.city.toUpperCase());
//     }
//   });
//   return Array.from(set).sort();
// }, [metricData, filters.districts]);



// // const toggleNumberReveal = async (candidate) => {
// //   // 🛡️ Guard: Check session state
// //   if (revealedNumbers[candidate.id]) return;

// //   const loadingToast = toast.loading("Executing Multi-Node Sync...");

// //   try {
// //     // 1. DATA NORMALIZATION PROTOCOL
// //     // Use 'applied_vacancy_ids' (plural) to match your logic
// //     const rawValue = candidate.applied_vacancy_ids;
// //     let existingIds = [];

// //     if (rawValue !== null && rawValue !== undefined) {
// //       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
// //     }

// //     // 2. CLUSTER AGGREGATION
// //     const currentVacancyId = id.toString();
// //     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
// //     const updatedClusterString = updatedClusterArray.join(',');

// //     // 3. TELEMETRY TRANSMISSION
// //     const formPayload = new FormData();
// //     // ⚠️ Ensure "applied_vacancy_ids" is the exact key your backend expects
// //     formPayload.append("applied_vacancy_ids", updatedClusterString);

// //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
// //       method: 'PATCH',
// //       body: formPayload,
// //       // Note: No Content-Type header for FormData
// //     });

// //     if (!res.ok) {
// //       const errorData = await res.json().catch(() => ({}));
// //       console.error("Server Rejected Protocol:", errorData);
// //       throw new Error(errorData.message || "API Node Sync Failed");
// //     }

// //     // 4. REGISTRY UPDATE
// //     setRevealedNumbers((prev) => ({
// //       ...prev,
// //       [candidate.id]: true,
// //     }));

// //     toast.success(`Access Logged: Node Cluster Updated`, { id: loadingToast });
    
// //     // 5. ATOMIC RE-SYNCHRONIZATION
// //     // Ensure fetchAllDetails is the function name you defined in your useEffect
// //     await Promise.all([
// //        fetchAllDetails(), 
// //     ]);

// //     handleTabClick(activeMetricTab) 

// //   } catch (err) {
// //     console.error("Telemetry Error Detail:", err);
// //     // Dynamic error message for better forensic debugging
// //     toast.error(`Access Denied: ${err.message || "Protocol Failure"}`, { id: loadingToast });
// //   }
// // };


// const toggleNumberReveal = async (candidate) => {
//   if (revealedNumbers[candidate.id]) return;

//   const loadingToast = toast.loading("Revealing Identity Node...");

//   try {
//     // 1. DATA NORMALIZATION
//     const rawValue = candidate.applied_vacancy_ids;
//     let existingIds = [];
//     if (rawValue !== null && rawValue !== undefined) {
//       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
//     }

//     // 2. CLUSTER AGGREGATION
//     const currentVacancyId = id.toString();
//     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
//     const updatedClusterString = updatedClusterArray.join(',');

//     // 3. PATCH: Update Access Registry
//     const formPayload = new FormData();
//     formPayload.append("applied_vacancy_ids", updatedClusterString);

//     const patchRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//       method: 'PATCH',
//       body: formPayload,
//     });

//     if (!patchRes.ok) throw new Error("Registry Sync Failed");

//     // 4. GET: Fetch Fresh Candidate Profile (This gets the real phone number)
//     const getRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`);
//     const freshData = await getRes.json();

//     // 5. ATOMIC STATE UPDATE: Update ONLY this candidate in the current list
//     // This prevents the whole list from disappearing/reloading
//     setMetricData((prevData) => 
//       prevData.map((item) => 
//         item.id === candidate.id 
//           ? { ...item, ...freshData, phone: freshData.phone } 
//           : item
//       )
//     );

//     // 6. UPDATE REVEALED CACHE
//     setRevealedNumbers((prev) => ({
//       ...prev,
//       [candidate.id]: true,
//     }));

//     toast.success("Candidate Number Revealed", { id: loadingToast });

//     // ⚠️ REMOVE handleTabClick(activeMetricTab) from here 
//     // because it clears the list and shows the loader.
//     // The setMetricData above handles the UI refresh smoothly.

//   } catch (err) {
//     console.error("Telemetry Error:", err);
//     toast.error("Access Denied", { id: loadingToast });
//   }
// };

// //   const isRevealedForThisVacancy = (candidate) => {
// //   const currentId = id.toString(); 
  
// //   if (revealedNumbers[candidate.id]) return true;

// //   // Safely check the comma string
// //   const existingIds = candidate.applied_vacancy_ids 
// //     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
// //     : [];

// //   return existingIds.includes(currentId);
// // };


// // const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   return (
// //     <div className="relative space-y-2">
// //       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
// //         {icon} {label}
// //       </label>
// //       <button 
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-blue-400 transition-all"
// //       >
// //         <span className="truncate">{selected.length > 0 ? `${selected.length} Selected` : "All Units"}</span>
// //         <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// //       </button>
      
// //       {isOpen && (
// //         <>
// //           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
// //           <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
// //             {options.map(opt => (
// //               <label key={opt} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
// //                 <input 
// //                   type="checkbox" 
// //                   checked={selected.includes(opt)} 
// //                   onChange={() => onSelect(opt)}
// //                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" 
// //                 />
// //                 <span className="text-[10px] font-black uppercase text-slate-600">{opt}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };



// const isRevealedForThisVacancy = (candidate) => {
//   const currentId = id.toString(); 
  
//   // Check local state first for immediate UI feedback
//   if (revealedNumbers[candidate.id]) return true;

//   // Check the data from the API
//   const existingIds = candidate.applied_vacancy_ids 
//     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
//     : [];

//   return existingIds.includes(currentId);
// };
// const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative space-y-2">
//       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//         {icon} {label}
//       </label>
      
//       <button 
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full flex items-center justify-between px-4 py-3 border rounded-2xl text-[11px] font-bold transition-all ${
//           selected 
//             ? "!bg-blue-50 !border-blue-200 !text-blue-700" 
//             : "!bg-slate-50 !border-slate-200 !text-slate-700 !hover:border-blue-400"
//         }`}
//       >
//         <span className="truncate uppercase">
//           {selected || "Select Unit"}
//         </span>
//         <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {isOpen && (
//         <>
//           {/* Overlay to close dropdown when clicking outside */}
//           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
//           <div className="absolute top-full left-0 w-full mt-2 !bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
//             {/* "All" or "Reset" Option */}
//             <button
//               onClick={() => { onSelect(""); setIsOpen(false); }}
//               className="w-full text-left px-4 py-3 text-[10px] !bg-transparent font-black uppercase !text-slate-400 hover:!bg-slate-50 transition-colors border-b !border-slate-50"
//             >
//               Clear Filter
//             </button>

//             {options.map(opt => (
//               <button 
//                 key={opt} 
//                 onClick={() => {
//                   onSelect(opt);
//                   setIsOpen(false); // Close immediately on selection
//                 }}
//                 className={`w-full text-left px-4 py-3 text-[10px] font-black !bg-transparent uppercase transition-colors border-b !border-slate-50 last:border-0 ${
//                   selected === opt 
//                     ? "!bg-white !text-black" 
//                     : "!text-slate-600 hover:!bg-white hover:!text-blue-600"
//                 }`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Node Protocol...</p>
//     </div>
//   );

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none">
//             <ChevronLeft size={16} /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
//             {/* --- HEADER IDENTITY SECTION --- */}
          


//             <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">


//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
    
//      {activeMetricTab && (
//                       <button 
//                         // onClick={() => setShowMetadata(!showMetadata)}
//                         onClick={() => {
//       if (!showMetadata) {
//         // 🟢 If we are showing the Post, we must hide the Candidate Registry box
//         setShowMetadata(true);
//         setActiveMetricTab(null); // This clears the registry selection
//       } else {
//         setShowMetadata(false);
//       }
//     }}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "Overview"}
//                       </button>
//                     )}
    
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    {/* <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   /> */}
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

            
//           </div>

//           {/* --- SIDEBAR MODULE --- */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><Phone size={20}/></div>
//                   <div><span className={labelClass}>Contact Person Number</span><p className={valueClass}>{company?.contact_number || vacancy?.company?.phone || "+91 ••••••••••"}</p></div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><UserCheck size={20}/></div>
//                   <div><span className={labelClass}>Contact Person</span><p className={valueClass}>{company?.contact_person || vacancy?.company?.contact_person || "Hiring Lead"}</p></div>
//                 </div>
//               </div>
//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                 <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">{formatEnterpriseDate(vacancy?.deadline_date)}</p>
//               </div>
//             </div>
//           </div>

          

//         </div>

//         <div className="flex w-full">
//           {/* --- MASTER SWITCH CONTENT AREA --- */}
       
              
//               {/* 🔵 CANDIDATE REGISTRY VIEW */}
//               {activeMetricTab && !showMetadata && (
//                <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
//          {/* ================= FILTER REGISTRY CONSOLE ================= */}
// <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
//   <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
    
//     {/* SECTION HEADER */}
//     <div className="flex items-center gap-3 mb-6 px-1">
//       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
//         <Layers size={16} strokeWidth={2.5} />
//       </div>
//       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
//         Filter
//       </span>
//     </div>

//     {/* FILTER GRID */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      
//       {/* EXPERIENCE FILTER */}
//       <FilterDropdown
//         label="Experience"
//         icon={<Clock size={13} />}
//         options={["0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"]}
//         selected={filters.experiences}
//         onSelect={(v) => toggleFilter("experiences", v)}
//       />

//       {/* EDUCATION FILTER */}
//      <FilterDropdown
//     label="Eduction"
//     icon={<GraduationCap size={13} />}
//     options={educationMasters.map(edu => edu.name.toUpperCase())}
//     selected={filters.educations}
//     onSelect={(v) => toggleFilter("educations", v)}
//   />

//   {/* 🏭 INDUSTRY FILTER (New) */}
//   <FilterDropdown
//     label="Industry"
//     icon={<Building2 size={13} />}
//     options={industries.map(ind => ind.name.toUpperCase())}
//     selected={filters.industries}
//     onSelect={(v) => toggleFilter("industries", v)}
//   />

//      <FilterDropdown
//     label="District"
//     icon={<MapPin size={13} />}
//     options={districtOptions}
//     selected={filters.districts}
//     onSelect={(v) => {
//       toggleFilter("districts", v);
//       // Optional: Clear cities when district changes to avoid invalid combinations
//       setFilters(prev => ({ ...prev, cities: [] }));
//     }}
//   />

//   {/* CITY FILTER (Dependent) */}
//   <FilterDropdown
//     label="City"
//     icon={<Navigation size={13} />}
//     options={dependentCityOptions}
//     selected={filters.cities}
//     onSelect={(v) => toggleFilter("cities", v)}
//   />

//       {/* GENDER FILTER */}
//       <FilterDropdown
//         label="Gender"
//         icon={<Users size={13} />}
//         options={["MALE", "FEMALE", "OTHER"]}
//         selected={filters.genders}
//         onSelect={(v) => toggleFilter("genders", v)}
//       />


//       <FilterDropdown
//       label="Skills"
//       icon={<Zap size={13} />}
//       options={skillOptions}
//       selected={filters.skills}
//       onSelect={(v) => toggleFilter("skills", v)}
//     />
//     </div>

//     {/* ACTIVE FILTER CHIPS */}
//     {Object.values(filters).some(arr => arr.length > 0) && (
//       <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
//         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Filter Applied:</span>
//         {Object.entries(filters).map(([cat, vals]) => 
//           vals.map(v => (
//             <button key={v} onClick={() => toggleFilter(cat, v)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-100">
//               {v} <X size={12} className="text-blue-300 group-hover:text-white" />
//             </button>
//           ))
//         )}
//         <button onClick={clearAllFilters} className="ml-auto text-[9px] !bg-transparent font-black uppercase !text-black hover:underline">Clear All</button>
//       </div>
//     )}
//   </div>
// </div>
    
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

     

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
  


//   {/* --- CONTACT NODE --- */}
// <div className="flex items-center gap-3">
//   <div className={`p-2 rounded-lg transition-all duration-500 ${
//     revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'
//   }`}>
//     <Phone size={14} strokeWidth={2.5} />
//   </div>
  
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//       Contact Number
//     </span>
    
//     <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
      
//       {isRevealedForThisVacancy(c) ? (
//               <span className="animate-in fade-in zoom-in-95 duration-300">
//                 {c.phone || "No Data"}
//               </span>
//             ) : (
//               <span className="text-slate-300 select-none tracking-[0.3em]">
//                 +91 ••••••••••
//               </span>
//             )}
//     </p>
//   </div>
// </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">

//      <button
//                                                   onClick={() => navigate(`/candidateflow?id=${c.id}`)}
//                                                   className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                                                 >
//                                                   <Gavel size={14} /> Decision
//                                                 </button>
    
   

// {!isRevealedForThisVacancy(c) ? (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         // toggleNumberReveal(c.id);
//         toggleNumberReveal(c);
//       }}
//       className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//     >
//       <UserCheck size={14} strokeWidth={3} /> View Number
//     </button>
//   ) : (
//     /* Optional: Show a "Linked" badge instead of a button for better UX */
//     <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
//       <CheckCircle2 size={12} className="text-emerald-500" />
//       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">Viewed Number</span>
//     </div>
//   )}

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

         

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
//               )}


//                {/* 🟢 VACANCY DETAILS VIEW */}
//               {showMetadata && (
//                <div className="space-y-4 pb-10 mt-10 w-full">
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
//               )}


            
//           </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
//         .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//       `}} />
//     </div>
//   );
// };

// // --- SUB-COMPONENT REGISTRY ---
// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg, isActive }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
//   >
//     <div className="flex items-center gap-4">
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">{label}</span>
//         <div className="flex items-center gap-2">
//           <span className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}>{count.toString().padStart(2, '0')}</span>
//           <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`} />
//         </div>
//       </div>
//     </div>
    
//   </button>
// );

// export default VacancyDetails;
//***************************************************working coded phase 1 4/03/26************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Users,
//   IndianRupee,
//   FileText,
//   Gavel,
//   GraduationCap,
//   UserPlus,
//   CheckCircle2,
//   Activity,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft,
//   Navigation,
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE REGISTRY ---
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null);
//   const [metricData, setMetricData] = useState([]);
//   const [loadingMetrics, setLoadingMetrics] = useState(false);
//   const [candidatePage, setCandidatePage] = useState(1);
//   const candidatesPerPage = 5;
//   const [registrySearch, setRegistrySearch] = useState("");
//   const [showMetadata, setShowMetadata] = useState(true);

//   // --- ADD TO STATE REGISTRY ---
// const [filters, setFilters] = useState({
//   experiences: [],
//   educations: [],
//   districts: [],
//   cities: [],
//   genders: [],
//   industries: [],
// });
// const [industries, setIndustries] = useState([]);
// const [educationMasters, setEducationMasters] = useState([]);

//   // 1. Move the function out so the whole component can use it
// const fetchAllDetails = async () => {
//   setLoading(true);
//   try {
//     const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//     if (!vacRes.ok) throw new Error("Vacancy node not found");
//     const vacData = await vacRes.json();
//     setVacancy(vacData);

//     const [resResp, resLeads, resDb] = await Promise.all([
//       fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates`)
//     ]);

//     const [dataResp, dataLeads, dataDb] = await Promise.all([
//       resResp.json(), resLeads.json(), resDb.json()
//     ]);

//     setMetrics({
//       responses: dataResp.length || 0,
//       leads: dataLeads.length || 0,
//       database: dataDb.length || 0
//     });

//     if (vacData.job_description) {
//       const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//       const jdData = await jdRes.json();
//       setJobDescription(jdData);
//     }

//     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//     const compListData = await compRes.json();
//     const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//     if (matchedCompany) setCompany(matchedCompany);

//   } catch (err) {
//     toast.error(err.message);
//     navigate("/vacancies");
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   if (activeMetricTab) {
//     const delayDebounceFn = setTimeout(() => {
//       // 🟢 Pass 'true' for isAutoRefresh
//       handleTabClick(activeMetricTab, filters, registrySearch, true);
//     }, 500); 

//     return () => clearTimeout(delayDebounceFn);
//   }
// }, [filters, registrySearch]);

// // 2. The useEffect now simply triggers the shared function on mount
// useEffect(() => {
//   fetchAllDetails();
// }, [id, navigate]);


// // Add these to your fetchAllDetails function or a new useEffect
// useEffect(() => {
//   const fetchMasters = async () => {
//     try {
//       const [eduRes, indRes] = await Promise.all([
//         fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100"),
//         fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100")
//       ]);
//       const eduData = await eduRes.json();
//       const indData = await indRes.json();
      
//       setEducationMasters(eduData || []);
//       setIndustries(indData || []);
//     } catch (err) {
//       console.error("Master Data Sync Failure", err);
//     }
//   };
//   fetchMasters();
// }, []);


// // const filteredResults = useMemo(() => {
// //   return metricData.filter((c) => {
// //     // 1. Search Query
// //     const matchesSearch = c.full_name?.toLowerCase().includes(registrySearch.toLowerCase());
    
// //     // 2. City Filter
// //     const matchesCity = filters.cities.length === 0 || filters.cities.includes(c.city?.toUpperCase());
    
// //     // 3. Education Filter
// //     const matchesEdu = filters.educations.length === 0 || filters.educations.includes(c.latest_education?.toUpperCase());
    
// //     // 4. Gender Filter
// //     const matchesGender = filters.genders.length === 0 || filters.genders.includes(c.gender?.toUpperCase());

// //     return matchesSearch && matchesCity && matchesEdu && matchesGender;
// //   });
// // }, [metricData, registrySearch, filters]);


// const filteredResults = useMemo(() => {
//   // Now simply returns the data from the API
//   return metricData;
// }, [metricData]);


// const toggleFilter = (category, value) => {
//   setFilters((prev) => ({
//     ...prev,
//     [category]: prev[category].includes(value)
//       ? prev[category].filter((item) => item !== value)
//       : [...prev[category], value],
//   }));
//   setCandidatePage(1); // Reset to first page on filter change
// };

//   // --- LOGIC HELPERS ---

//   const indexOfLastCandidate = candidatePage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
//   const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

//   useEffect(() => {
//     setCandidatePage(1);
//   }, [activeMetricTab, registrySearch]);

//   // const handleTabClick = async (tabType) => {
//   //   if (activeMetricTab === tabType) {
//   //     setActiveMetricTab(null);
//   //     setShowMetadata(true);
//   //     return;
//   //   }
//   //   setActiveMetricTab(tabType);
//   //   setShowMetadata(false); // 🟢 Auto-hide Vacancy Post when Registry is clicked
//   //   setLoadingMetrics(true);
//   //   try {
//   //     let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//   //               tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//   //               `https://apihrr.goelectronix.co.in/candidates`;
//   //     const res = await fetch(url);
//   //     const data = await res.json();
//   //     setMetricData(data);
//   //   } catch (err) {
//   //     toast.error("Registry sync failed");
//   //   } finally {
//   //     setLoadingMetrics(false);
//   //   }
//   // };


// //   const handleTabClick = async (tabType) => {
// //   if (activeMetricTab === tabType) {
// //     setActiveMetricTab(null);
// //     setShowMetadata(true);
// //     return;
// //   }
  
// //   setActiveMetricTab(tabType);
// //   setShowMetadata(false); 
// //   setLoadingMetrics(true);

// //   try {
// //     let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
// //               tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
// //               `https://apihrr.goelectronix.co.in/candidates`;
    
// //     const res = await fetch(url);
// //     const rawData = await res.json();

// //     // 🛠️ ATOMIC DATA SYNC: Fetch full profile for revealed candidates
// //     const synchronizedData = await Promise.all(rawData.map(async (c) => {
// //       // Check if this candidate is already revealed for the current vacancy
// //       const currentVacancyId = id.toString();
// //       const existingIds = c.applied_vacancy_ids 
// //         ? c.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
// //         : [];
      
// //       const isAlreadyRevealed = existingIds.includes(currentVacancyId);

// //       if (isAlreadyRevealed) {
// //         try {
// //           // Trigger individual fetch to get the real phone number
// //           const profileRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${c.id}`);
// //           const fullProfile = await profileRes.json();
// //           return { ...c, phone: fullProfile.phone }; // Merge real phone into candidate object
// //         } catch (e) {
// //           console.error(`Telemetry sync failed for candidate ${c.id}`);
// //           return c;
// //         }
// //       }
// //       return c; // Return as is if not revealed
// //     }));

// //     setMetricData(synchronizedData);
// //   } catch (err) {
// //     toast.error("Registry sync failed");
// //   } finally {
// //     setLoadingMetrics(false);
// //   }
// // };


// // 🟢 Added 'isAutoRefresh' parameter to identify where the call is coming from
// // 🟢 Added 'isAutoRefresh' parameter
// const handleTabClick = async (tabType, currentFilters = filters, searchQuery = registrySearch, isAutoRefresh = false) => {
  
//   const activeTab = tabType || activeMetricTab;
//   if (!activeTab) return;

//   // 🛡️ Logic Gate: 
//   // If NOT an auto-refresh (human clicked) AND the tab is already open -> Close it.
//   // If it IS an auto-refresh (filter change) -> SKIP this close logic.
//   if (!isAutoRefresh && activeMetricTab === tabType) {
//     setActiveMetricTab(null);
//     setShowMetadata(true);
//     return;
//   }

//   setActiveMetricTab(activeTab);
//   setShowMetadata(false);
//   setLoadingMetrics(true);

//   try {
//     const params = new URLSearchParams();
    
//     if (activeTab !== 'database') {
//       params.append("vacancy_id", id);
//     }
//     if (activeTab === 'responses') {
//       params.append("status", "jd_sent");
//     }

//     if (searchQuery) {
//       params.append("search", searchQuery);
//     }

//     // Add filters to URL params
//     // currentFilters.cities.forEach(city => params.append("city", city));
//     // Add District Filters
//   currentFilters.districts.forEach(d => params.append("district", d));
//   // Add City Filters
//   currentFilters.cities.forEach(c => params.append("city", c));
//     currentFilters.educations.forEach(edu => params.append("education", edu));
//     currentFilters.genders.forEach(gen => params.append("gender", gen.toLowerCase()));

//     currentFilters.industries.forEach((industryName) => {
//       const match = industries.find(i => i.name.toUpperCase() === industryName.toUpperCase());
//       if (match) params.append("industry_id", match.id);
//     });

//     const url = `https://apihrr.goelectronix.co.in/candidates?${params.toString()}`;
//     const res = await fetch(url);
//     const rawData = await res.json();

//     // Re-sync phone numbers for revealed candidates
//     const synchronizedData = await Promise.all(rawData.map(async (c) => {
//       const currentVacancyId = id.toString();
//       const existingIds = c.applied_vacancy_ids 
//         ? c.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
//         : [];
      
//       if (existingIds.includes(currentVacancyId)) {
//         try {
//           const profileRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${c.id}`);
//           const fullProfile = await profileRes.json();
//           return { ...c, phone: fullProfile.phone };
//         } catch (e) { return c; }
//       }
//       return c;
//     }));

//     setMetricData(synchronizedData);
//   } catch (err) {
//     toast.error("candidate Fetch failed");
//   } finally {
//     setLoadingMetrics(false);
//   }
// };


//   const getPaginationGroup = () => {
//     const range = [];
//     const delta = 1;
//     for (let i = 1; i <= totalCandidatePages; i++) {
//       if (i === 1 || i === totalCandidatePages || (i >= candidatePage - delta && i <= candidatePage + delta)) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "...") {
//         range.push("...");
//       }
//     }
//     return range;
//   };


// //   const toggleFilter = (category, value) => {
// //   setFilters((prev) => ({
// //     ...prev,
// //     [category]: prev[category].includes(value)
// //       ? prev[category].filter((item) => item !== value)
// //       : [...prev[category], value],
// //   }));
// // };

// const clearAllFilters = () => {
//   setFilters({ 
//     experiences: [],
//     educations: [],
//     districts: [],  // 🟢 Reset Districts
//     cities: [],     // 🟢 Reset Cities
//     genders: [],
//     industries: [], // 🟢 Reset Industries
//   });

//   setRegistrySearch("");
  
//   // Reset pagination to page 1
//   setCandidatePage(1);
// };

//   const formatEnterpriseDate = (d) => {
//     if (!d) return "N/A";
//     const date = new Date(d);
//     return `${String(date.getDate()).padStart(2, '0')}-${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
//   };


//   // 1. Extract unique Districts from the current metric data
// const districtOptions = useMemo(() => {
//   const set = new Set();
//   metricData.forEach((c) => {
//     if (c.district) set.add(c.district.toUpperCase());
//   });
//   return Array.from(set).sort();
// }, [metricData]);

// // 2. Extract Cities based on selected Districts
// const dependentCityOptions = useMemo(() => {
//   const set = new Set();
//   metricData.forEach((c) => {
//     const candidateDist = c.district?.toUpperCase();
    
//     // Logic: If no district is selected, show all. 
//     // If district is selected, only show cities belonging to that district.
//     if (filters.districts.length === 0 || filters.districts.includes(candidateDist)) {
//       if (c.city) set.add(c.city.toUpperCase());
//     }
//   });
//   return Array.from(set).sort();
// }, [metricData, filters.districts]);



// // const toggleNumberReveal = async (candidate) => {
// //   // 🛡️ Guard: Check session state
// //   if (revealedNumbers[candidate.id]) return;

// //   const loadingToast = toast.loading("Executing Multi-Node Sync...");

// //   try {
// //     // 1. DATA NORMALIZATION PROTOCOL
// //     // Use 'applied_vacancy_ids' (plural) to match your logic
// //     const rawValue = candidate.applied_vacancy_ids;
// //     let existingIds = [];

// //     if (rawValue !== null && rawValue !== undefined) {
// //       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
// //     }

// //     // 2. CLUSTER AGGREGATION
// //     const currentVacancyId = id.toString();
// //     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
// //     const updatedClusterString = updatedClusterArray.join(',');

// //     // 3. TELEMETRY TRANSMISSION
// //     const formPayload = new FormData();
// //     // ⚠️ Ensure "applied_vacancy_ids" is the exact key your backend expects
// //     formPayload.append("applied_vacancy_ids", updatedClusterString);

// //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
// //       method: 'PATCH',
// //       body: formPayload,
// //       // Note: No Content-Type header for FormData
// //     });

// //     if (!res.ok) {
// //       const errorData = await res.json().catch(() => ({}));
// //       console.error("Server Rejected Protocol:", errorData);
// //       throw new Error(errorData.message || "API Node Sync Failed");
// //     }

// //     // 4. REGISTRY UPDATE
// //     setRevealedNumbers((prev) => ({
// //       ...prev,
// //       [candidate.id]: true,
// //     }));

// //     toast.success(`Access Logged: Node Cluster Updated`, { id: loadingToast });
    
// //     // 5. ATOMIC RE-SYNCHRONIZATION
// //     // Ensure fetchAllDetails is the function name you defined in your useEffect
// //     await Promise.all([
// //        fetchAllDetails(), 
// //     ]);

// //     handleTabClick(activeMetricTab) 

// //   } catch (err) {
// //     console.error("Telemetry Error Detail:", err);
// //     // Dynamic error message for better forensic debugging
// //     toast.error(`Access Denied: ${err.message || "Protocol Failure"}`, { id: loadingToast });
// //   }
// // };


// const toggleNumberReveal = async (candidate) => {
//   if (revealedNumbers[candidate.id]) return;

//   const loadingToast = toast.loading("Revealing Identity Node...");

//   try {
//     // 1. DATA NORMALIZATION
//     const rawValue = candidate.applied_vacancy_ids;
//     let existingIds = [];
//     if (rawValue !== null && rawValue !== undefined) {
//       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
//     }

//     // 2. CLUSTER AGGREGATION
//     const currentVacancyId = id.toString();
//     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
//     const updatedClusterString = updatedClusterArray.join(',');

//     // 3. PATCH: Update Access Registry
//     const formPayload = new FormData();
//     formPayload.append("applied_vacancy_ids", updatedClusterString);

//     const patchRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//       method: 'PATCH',
//       body: formPayload,
//     });

//     if (!patchRes.ok) throw new Error("Registry Sync Failed");

//     // 4. GET: Fetch Fresh Candidate Profile (This gets the real phone number)
//     const getRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`);
//     const freshData = await getRes.json();

//     // 5. ATOMIC STATE UPDATE: Update ONLY this candidate in the current list
//     // This prevents the whole list from disappearing/reloading
//     setMetricData((prevData) => 
//       prevData.map((item) => 
//         item.id === candidate.id 
//           ? { ...item, ...freshData, phone: freshData.phone } 
//           : item
//       )
//     );

//     // 6. UPDATE REVEALED CACHE
//     setRevealedNumbers((prev) => ({
//       ...prev,
//       [candidate.id]: true,
//     }));

//     toast.success("Candidate Number Revealed", { id: loadingToast });

//     // ⚠️ REMOVE handleTabClick(activeMetricTab) from here 
//     // because it clears the list and shows the loader.
//     // The setMetricData above handles the UI refresh smoothly.

//   } catch (err) {
//     console.error("Telemetry Error:", err);
//     toast.error("Access Denied", { id: loadingToast });
//   }
// };

// //   const isRevealedForThisVacancy = (candidate) => {
// //   const currentId = id.toString(); 
  
// //   if (revealedNumbers[candidate.id]) return true;

// //   // Safely check the comma string
// //   const existingIds = candidate.applied_vacancy_ids 
// //     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
// //     : [];

// //   return existingIds.includes(currentId);
// // };


// // const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   return (
// //     <div className="relative space-y-2">
// //       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
// //         {icon} {label}
// //       </label>
// //       <button 
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-blue-400 transition-all"
// //       >
// //         <span className="truncate">{selected.length > 0 ? `${selected.length} Selected` : "All Units"}</span>
// //         <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// //       </button>
      
// //       {isOpen && (
// //         <>
// //           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
// //           <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
// //             {options.map(opt => (
// //               <label key={opt} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
// //                 <input 
// //                   type="checkbox" 
// //                   checked={selected.includes(opt)} 
// //                   onChange={() => onSelect(opt)}
// //                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" 
// //                 />
// //                 <span className="text-[10px] font-black uppercase text-slate-600">{opt}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };



// const isRevealedForThisVacancy = (candidate) => {
//   const currentId = id.toString(); 
  
//   // Check local state first for immediate UI feedback
//   if (revealedNumbers[candidate.id]) return true;

//   // Check the data from the API
//   const existingIds = candidate.applied_vacancy_ids 
//     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
//     : [];

//   return existingIds.includes(currentId);
// };
// const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative space-y-2">
//       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//         {icon} {label}
//       </label>
      
//       <button 
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full flex items-center justify-between px-4 py-3 border rounded-2xl text-[11px] font-bold transition-all ${
//           selected 
//             ? "!bg-blue-50 !border-blue-200 !text-blue-700" 
//             : "!bg-slate-50 !border-slate-200 !text-slate-700 !hover:border-blue-400"
//         }`}
//       >
//         <span className="truncate uppercase">
//           {selected || "Select Unit"}
//         </span>
//         <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {isOpen && (
//         <>
//           {/* Overlay to close dropdown when clicking outside */}
//           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
//           <div className="absolute top-full left-0 w-full mt-2 !bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
//             {/* "All" or "Reset" Option */}
//             <button
//               onClick={() => { onSelect(""); setIsOpen(false); }}
//               className="w-full text-left px-4 py-3 text-[10px] !bg-transparent font-black uppercase !text-slate-400 hover:!bg-slate-50 transition-colors border-b !border-slate-50"
//             >
//               Clear Filter
//             </button>

//             {options.map(opt => (
//               <button 
//                 key={opt} 
//                 onClick={() => {
//                   onSelect(opt);
//                   setIsOpen(false); // Close immediately on selection
//                 }}
//                 className={`w-full text-left px-4 py-3 text-[10px] font-black !bg-transparent uppercase transition-colors border-b !border-slate-50 last:border-0 ${
//                   selected === opt 
//                     ? "!bg-white !text-black" 
//                     : "!text-slate-600 hover:!bg-white hover:!text-blue-600"
//                 }`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Node Protocol...</p>
//     </div>
//   );

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none">
//             <ChevronLeft size={16} /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
//             {/* --- HEADER IDENTITY SECTION --- */}
          


//             <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">


//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
    
//      {activeMetricTab && (
//                       <button 
//                         // onClick={() => setShowMetadata(!showMetadata)}
//                         onClick={() => {
//       if (!showMetadata) {
//         // 🟢 If we are showing the Post, we must hide the Candidate Registry box
//         setShowMetadata(true);
//         setActiveMetricTab(null); // This clears the registry selection
//       } else {
//         setShowMetadata(false);
//       }
//     }}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "Overview"}
//                       </button>
//                     )}
    
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

            
//           </div>

//           {/* --- SIDEBAR MODULE --- */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><Phone size={20}/></div>
//                   <div><span className={labelClass}>Contact Person Number</span><p className={valueClass}>{company?.contact_number || vacancy?.company?.phone || "+91 ••••••••••"}</p></div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><UserCheck size={20}/></div>
//                   <div><span className={labelClass}>Contact Person</span><p className={valueClass}>{company?.contact_person || vacancy?.company?.contact_person || "Hiring Lead"}</p></div>
//                 </div>
//               </div>
//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                 <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">{formatEnterpriseDate(vacancy?.deadline_date)}</p>
//               </div>
//             </div>
//           </div>

          

//         </div>

//         <div className="flex w-full">
//           {/* --- MASTER SWITCH CONTENT AREA --- */}
       
              
//               {/* 🔵 CANDIDATE REGISTRY VIEW */}
//               {activeMetricTab && !showMetadata && (
//                <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
//          {/* ================= FILTER REGISTRY CONSOLE ================= */}
// <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
//   <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
    
//     {/* SECTION HEADER */}
//     <div className="flex items-center gap-3 mb-6 px-1">
//       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
//         <Layers size={16} strokeWidth={2.5} />
//       </div>
//       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
//         Filter
//       </span>
//     </div>

//     {/* FILTER GRID */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      
//       {/* EXPERIENCE FILTER */}
//       <FilterDropdown
//         label="Experience"
//         icon={<Clock size={13} />}
//         options={["0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"]}
//         selected={filters.experiences}
//         onSelect={(v) => toggleFilter("experiences", v)}
//       />

//       {/* EDUCATION FILTER */}
//      <FilterDropdown
//     label="Eduction"
//     icon={<GraduationCap size={13} />}
//     options={educationMasters.map(edu => edu.name.toUpperCase())}
//     selected={filters.educations}
//     onSelect={(v) => toggleFilter("educations", v)}
//   />

//   {/* 🏭 INDUSTRY FILTER (New) */}
//   <FilterDropdown
//     label="Industry"
//     icon={<Building2 size={13} />}
//     options={industries.map(ind => ind.name.toUpperCase())}
//     selected={filters.industries}
//     onSelect={(v) => toggleFilter("industries", v)}
//   />

//      <FilterDropdown
//     label="District"
//     icon={<MapPin size={13} />}
//     options={districtOptions}
//     selected={filters.districts}
//     onSelect={(v) => {
//       toggleFilter("districts", v);
//       // Optional: Clear cities when district changes to avoid invalid combinations
//       setFilters(prev => ({ ...prev, cities: [] }));
//     }}
//   />

//   {/* CITY FILTER (Dependent) */}
//   <FilterDropdown
//     label="City"
//     icon={<Navigation size={13} />}
//     options={dependentCityOptions}
//     selected={filters.cities}
//     onSelect={(v) => toggleFilter("cities", v)}
//   />

//       {/* GENDER FILTER */}
//       <FilterDropdown
//         label="Gender"
//         icon={<Users size={13} />}
//         options={["MALE", "FEMALE", "OTHER"]}
//         selected={filters.genders}
//         onSelect={(v) => toggleFilter("genders", v)}
//       />
//     </div>

//     {/* ACTIVE FILTER CHIPS */}
//     {Object.values(filters).some(arr => arr.length > 0) && (
//       <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
//         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Filter Applied:</span>
//         {Object.entries(filters).map(([cat, vals]) => 
//           vals.map(v => (
//             <button key={v} onClick={() => toggleFilter(cat, v)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-100">
//               {v} <X size={12} className="text-blue-300 group-hover:text-white" />
//             </button>
//           ))
//         )}
//         <button onClick={clearAllFilters} className="ml-auto text-[9px] !bg-transparent font-black uppercase !text-black hover:underline">Clear All</button>
//       </div>
//     )}
//   </div>
// </div>
    
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

     

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
  


//   {/* --- CONTACT NODE --- */}
// <div className="flex items-center gap-3">
//   <div className={`p-2 rounded-lg transition-all duration-500 ${
//     revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'
//   }`}>
//     <Phone size={14} strokeWidth={2.5} />
//   </div>
  
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//       Contact Number
//     </span>
    
//     <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
      
//       {isRevealedForThisVacancy(c) ? (
//               <span className="animate-in fade-in zoom-in-95 duration-300">
//                 {c.phone || "No Data"}
//               </span>
//             ) : (
//               <span className="text-slate-300 select-none tracking-[0.3em]">
//                 +91 ••••••••••
//               </span>
//             )}
//     </p>
//   </div>
// </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">

//      <button
//                                                   onClick={() => navigate(`/candidateflow?id=${c.id}`)}
//                                                   className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                                                 >
//                                                   <Gavel size={14} /> Decision
//                                                 </button>
    
   

// {!isRevealedForThisVacancy(c) ? (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         // toggleNumberReveal(c.id);
//         toggleNumberReveal(c);
//       }}
//       className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//     >
//       <UserCheck size={14} strokeWidth={3} /> View Number
//     </button>
//   ) : (
//     /* Optional: Show a "Linked" badge instead of a button for better UX */
//     <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
//       <CheckCircle2 size={12} className="text-emerald-500" />
//       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">Viewed Number</span>
//     </div>
//   )}

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

         

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
//               )}


//                {/* 🟢 VACANCY DETAILS VIEW */}
//               {showMetadata && (
//                <div className="space-y-4 pb-10 mt-10 w-full">
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
//               )}


            
//           </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
//         .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//       `}} />
//     </div>
//   );
// };

// // --- SUB-COMPONENT REGISTRY ---
// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg, isActive }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
//   >
//     <div className="flex items-center gap-4">
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">{label}</span>
//         <div className="flex items-center gap-2">
//           <span className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}>{count.toString().padStart(2, '0')}</span>
//           <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`} />
//         </div>
//       </div>
//     </div>
    
//   </button>
// );

// export default VacancyDetails;
//**************************************************working code phase 1 3/03/26****************************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Users,
//   IndianRupee,
//   FileText,
//   Gavel,
//   GraduationCap,
//   UserPlus,
//   CheckCircle2,
//   Activity,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft,
//   Navigation,
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE REGISTRY ---
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null);
//   const [metricData, setMetricData] = useState([]);
//   const [loadingMetrics, setLoadingMetrics] = useState(false);
//   const [candidatePage, setCandidatePage] = useState(1);
//   const candidatesPerPage = 5;
//   const [registrySearch, setRegistrySearch] = useState("");
//   const [showMetadata, setShowMetadata] = useState(true);

//   // --- ADD TO STATE REGISTRY ---
// const [filters, setFilters] = useState({
//   experiences: [],
//   educations: [],
//   cities: [],
//   genders: [],
// });
// const [industries, setIndustries] = useState([]);
// const [educationMasters, setEducationMasters] = useState([]);

//   // 1. Move the function out so the whole component can use it
// const fetchAllDetails = async () => {
//   setLoading(true);
//   try {
//     const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//     if (!vacRes.ok) throw new Error("Vacancy node not found");
//     const vacData = await vacRes.json();
//     setVacancy(vacData);

//     const [resResp, resLeads, resDb] = await Promise.all([
//       fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates`)
//     ]);

//     const [dataResp, dataLeads, dataDb] = await Promise.all([
//       resResp.json(), resLeads.json(), resDb.json()
//     ]);

//     setMetrics({
//       responses: dataResp.length || 0,
//       leads: dataLeads.length || 0,
//       database: dataDb.length || 0
//     });

//     if (vacData.job_description) {
//       const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//       const jdData = await jdRes.json();
//       setJobDescription(jdData);
//     }

//     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//     const compListData = await compRes.json();
//     const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//     if (matchedCompany) setCompany(matchedCompany);

//   } catch (err) {
//     toast.error(err.message);
//     navigate("/vacancies");
//   } finally {
//     setLoading(false);
//   }
// };

// // 2. The useEffect now simply triggers the shared function on mount
// useEffect(() => {
//   fetchAllDetails();
// }, [id, navigate]);


// const filteredResults = useMemo(() => {
//   return metricData.filter((c) => {
//     // 1. Search Query
//     const matchesSearch = c.full_name?.toLowerCase().includes(registrySearch.toLowerCase());
    
//     // 2. City Filter
//     const matchesCity = filters.cities.length === 0 || filters.cities.includes(c.city?.toUpperCase());
    
//     // 3. Education Filter
//     const matchesEdu = filters.educations.length === 0 || filters.educations.includes(c.latest_education?.toUpperCase());
    
//     // 4. Gender Filter
//     const matchesGender = filters.genders.length === 0 || filters.genders.includes(c.gender?.toUpperCase());

//     return matchesSearch && matchesCity && matchesEdu && matchesGender;
//   });
// }, [metricData, registrySearch, filters]);

//   // --- LOGIC HELPERS ---

//   const indexOfLastCandidate = candidatePage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
//   const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

//   useEffect(() => {
//     setCandidatePage(1);
//   }, [activeMetricTab, registrySearch]);

//   const handleTabClick = async (tabType) => {
//     if (activeMetricTab === tabType) {
//       setActiveMetricTab(null);
//       setShowMetadata(true);
//       return;
//     }
//     setActiveMetricTab(tabType);
//     setShowMetadata(false); // 🟢 Auto-hide Vacancy Post when Registry is clicked
//     setLoadingMetrics(true);
//     try {
//       let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//                 tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//                 `https://apihrr.goelectronix.co.in/candidates`;
//       const res = await fetch(url);
//       const data = await res.json();
//       setMetricData(data);
//     } catch (err) {
//       toast.error("Registry sync failed");
//     } finally {
//       setLoadingMetrics(false);
//     }
//   };

//   const getPaginationGroup = () => {
//     const range = [];
//     const delta = 1;
//     for (let i = 1; i <= totalCandidatePages; i++) {
//       if (i === 1 || i === totalCandidatePages || (i >= candidatePage - delta && i <= candidatePage + delta)) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "...") {
//         range.push("...");
//       }
//     }
//     return range;
//   };


//   const toggleFilter = (category, value) => {
//   setFilters((prev) => ({
//     ...prev,
//     [category]: prev[category].includes(value)
//       ? prev[category].filter((item) => item !== value)
//       : [...prev[category], value],
//   }));
// };

// const clearAllFilters = () => {
//   setFilters({ experiences: [], educations: [], cities: [], genders: [] });
// };

//   const formatEnterpriseDate = (d) => {
//     if (!d) return "N/A";
//     const date = new Date(d);
//     return `${String(date.getDate()).padStart(2, '0')}-${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
//   };



// const toggleNumberReveal = async (candidate) => {
//   // 🛡️ Guard: Check session state
//   if (revealedNumbers[candidate.id]) return;

//   const loadingToast = toast.loading("Executing Multi-Node Sync...");

//   try {
//     // 1. DATA NORMALIZATION PROTOCOL
//     // Use 'applied_vacancy_ids' (plural) to match your logic
//     const rawValue = candidate.applied_vacancy_ids;
//     let existingIds = [];

//     if (rawValue !== null && rawValue !== undefined) {
//       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
//     }

//     // 2. CLUSTER AGGREGATION
//     const currentVacancyId = id.toString();
//     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
//     const updatedClusterString = updatedClusterArray.join(',');

//     // 3. TELEMETRY TRANSMISSION
//     const formPayload = new FormData();
//     // ⚠️ Ensure "applied_vacancy_ids" is the exact key your backend expects
//     formPayload.append("applied_vacancy_ids", updatedClusterString);

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//       method: 'PATCH',
//       body: formPayload,
//       // Note: No Content-Type header for FormData
//     });

//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       console.error("Server Rejected Protocol:", errorData);
//       throw new Error(errorData.message || "API Node Sync Failed");
//     }

//     // 4. REGISTRY UPDATE
//     setRevealedNumbers((prev) => ({
//       ...prev,
//       [candidate.id]: true,
//     }));

//     toast.success(`Access Logged: Node Cluster Updated`, { id: loadingToast });
    
//     // 5. ATOMIC RE-SYNCHRONIZATION
//     // Ensure fetchAllDetails is the function name you defined in your useEffect
//     await Promise.all([
//        fetchAllDetails(), 
//     ]);

//     handleTabClick(activeMetricTab) 

//   } catch (err) {
//     console.error("Telemetry Error Detail:", err);
//     // Dynamic error message for better forensic debugging
//     toast.error(`Access Denied: ${err.message || "Protocol Failure"}`, { id: loadingToast });
//   }
// };



//   const isRevealedForThisVacancy = (candidate) => {
//   const currentId = id.toString(); 
  
//   if (revealedNumbers[candidate.id]) return true;

//   // Safely check the comma string
//   const existingIds = candidate.applied_vacancy_ids 
//     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
//     : [];

//   return existingIds.includes(currentId);
// };


// // const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   return (
// //     <div className="relative space-y-2">
// //       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
// //         {icon} {label}
// //       </label>
// //       <button 
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-blue-400 transition-all"
// //       >
// //         <span className="truncate">{selected.length > 0 ? `${selected.length} Selected` : "All Units"}</span>
// //         <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// //       </button>
      
// //       {isOpen && (
// //         <>
// //           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
// //           <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
// //             {options.map(opt => (
// //               <label key={opt} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
// //                 <input 
// //                   type="checkbox" 
// //                   checked={selected.includes(opt)} 
// //                   onChange={() => onSelect(opt)}
// //                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" 
// //                 />
// //                 <span className="text-[10px] font-black uppercase text-slate-600">{opt}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative space-y-2">
//       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//         {icon} {label}
//       </label>
      
//       <button 
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full flex items-center justify-between px-4 py-3 border rounded-2xl text-[11px] font-bold transition-all ${
//           selected 
//             ? "!bg-blue-50 !border-blue-200 !text-blue-700" 
//             : "!bg-slate-50 !border-slate-200 !text-slate-700 !hover:border-blue-400"
//         }`}
//       >
//         <span className="truncate uppercase">
//           {selected || "Select Unit"}
//         </span>
//         <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {isOpen && (
//         <>
//           {/* Overlay to close dropdown when clicking outside */}
//           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
//           <div className="absolute top-full left-0 w-full mt-2 !bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
//             {/* "All" or "Reset" Option */}
//             <button
//               onClick={() => { onSelect(""); setIsOpen(false); }}
//               className="w-full text-left px-4 py-3 text-[10px] !bg-transparent font-black uppercase !text-slate-400 hover:!bg-slate-50 transition-colors border-b !border-slate-50"
//             >
//               Clear Filter
//             </button>

//             {options.map(opt => (
//               <button 
//                 key={opt} 
//                 onClick={() => {
//                   onSelect(opt);
//                   setIsOpen(false); // Close immediately on selection
//                 }}
//                 className={`w-full text-left px-4 py-3 text-[10px] font-black !bg-transparent uppercase transition-colors border-b !border-slate-50 last:border-0 ${
//                   selected === opt 
//                     ? "!bg-white !text-black" 
//                     : "!text-slate-600 hover:!bg-white hover:!text-blue-600"
//                 }`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Node Protocol...</p>
//     </div>
//   );

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none">
//             <ChevronLeft size={16} /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
//             {/* --- HEADER IDENTITY SECTION --- */}
          


//             <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">


//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
    
//      {activeMetricTab && (
//                       <button 
//                         // onClick={() => setShowMetadata(!showMetadata)}
//                         onClick={() => {
//       if (!showMetadata) {
//         // 🟢 If we are showing the Post, we must hide the Candidate Registry box
//         setShowMetadata(true);
//         setActiveMetricTab(null); // This clears the registry selection
//       } else {
//         setShowMetadata(false);
//       }
//     }}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "Overview"}
//                       </button>
//                     )}
    
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

            
//           </div>

//           {/* --- SIDEBAR MODULE --- */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><Phone size={20}/></div>
//                   <div><span className={labelClass}>Contact Person Number</span><p className={valueClass}>{company?.contact_number || vacancy?.company?.phone || "+91 ••••••••••"}</p></div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><UserCheck size={20}/></div>
//                   <div><span className={labelClass}>Contact Person</span><p className={valueClass}>{company?.contact_person || vacancy?.company?.contact_person || "Hiring Lead"}</p></div>
//                 </div>
//               </div>
//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                 <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">{formatEnterpriseDate(vacancy?.deadline_date)}</p>
//               </div>
//             </div>
//           </div>

          

//         </div>

//         <div className="flex w-full">
//           {/* --- MASTER SWITCH CONTENT AREA --- */}
       
              
//               {/* 🔵 CANDIDATE REGISTRY VIEW */}
//               {activeMetricTab && !showMetadata && (
//                <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
//          {/* ================= FILTER REGISTRY CONSOLE ================= */}
// <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
//   <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
    
//     {/* SECTION HEADER */}
//     <div className="flex items-center gap-3 mb-6 px-1">
//       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
//         <Layers size={16} strokeWidth={2.5} />
//       </div>
//       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
//         Registry Filter Hub
//       </span>
//     </div>

//     {/* FILTER GRID */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      
//       {/* EXPERIENCE FILTER */}
//       <FilterDropdown
//         label="Experience"
//         icon={<Clock size={13} />}
//         options={["0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"]}
//         selected={filters.experiences}
//         onSelect={(v) => toggleFilter("experiences", v)}
//       />

//       {/* EDUCATION FILTER */}
//       <FilterDropdown
//         label="Academic"
//         icon={<GraduationCap size={13} />}
//         options={["GRADUATE", "POST GRADUATE", "DIPLOMA", "DOCTORATE"]}
//         selected={filters.educations}
//         onSelect={(v) => toggleFilter("educations", v)}
//       />

//       {/* CITY FILTER */}
//       <FilterDropdown
//         label="City"
//         icon={<Navigation size={13} />}
//         options={[...new Set(metricData.map(c => c.city?.toUpperCase()))].filter(Boolean).sort()}
//         selected={filters.cities}
//         onSelect={(v) => toggleFilter("cities", v)}
//       />

//       {/* GENDER FILTER */}
//       <FilterDropdown
//         label="Gender"
//         icon={<Users size={13} />}
//         options={["MALE", "FEMALE", "OTHER"]}
//         selected={filters.genders}
//         onSelect={(v) => toggleFilter("genders", v)}
//       />
//     </div>

//     {/* ACTIVE FILTER CHIPS */}
//     {Object.values(filters).some(arr => arr.length > 0) && (
//       <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
//         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Logic Applied:</span>
//         {Object.entries(filters).map(([cat, vals]) => 
//           vals.map(v => (
//             <button key={v} onClick={() => toggleFilter(cat, v)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-100">
//               {v} <X size={12} className="text-blue-300 group-hover:text-white" />
//             </button>
//           ))
//         )}
//         <button onClick={clearAllFilters} className="ml-auto text-[9px] font-black uppercase text-rose-500 hover:underline">Purge All</button>
//       </div>
//     )}
//   </div>
// </div>
    
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

     

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
  


//   {/* --- CONTACT NODE --- */}
// <div className="flex items-center gap-3">
//   <div className={`p-2 rounded-lg transition-all duration-500 ${
//     revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'
//   }`}>
//     <Phone size={14} strokeWidth={2.5} />
//   </div>
  
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//       Contact Number
//     </span>
    
//     <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
      
//       {isRevealedForThisVacancy(c) ? (
//               <span className="animate-in fade-in zoom-in-95 duration-300">
//                 {c.phone || "No Data"}
//               </span>
//             ) : (
//               <span className="text-slate-300 select-none tracking-[0.3em]">
//                 +91 ••••••••••
//               </span>
//             )}
//     </p>
//   </div>
// </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">

//      <button
//                                                   onClick={() => navigate(`/candidateflow?id=${c.id}`)}
//                                                   className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                                                 >
//                                                   <Gavel size={14} /> Decision
//                                                 </button>
    
   

// {!isRevealedForThisVacancy(c) ? (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         // toggleNumberReveal(c.id);
//         toggleNumberReveal(c);
//       }}
//       className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//     >
//       <UserCheck size={14} strokeWidth={3} /> View Number
//     </button>
//   ) : (
//     /* Optional: Show a "Linked" badge instead of a button for better UX */
//     <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
//       <CheckCircle2 size={12} className="text-emerald-500" />
//       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">Viewed Number</span>
//     </div>
//   )}

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

         

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
//               )}


//                {/* 🟢 VACANCY DETAILS VIEW */}
//               {showMetadata && (
//                <div className="space-y-4 pb-10 mt-10 w-full">
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
//               )}


            
//           </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
//         .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//       `}} />
//     </div>
//   );
// };

// // --- SUB-COMPONENT REGISTRY ---
// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg, isActive }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
//   >
//     <div className="flex items-center gap-4">
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">{label}</span>
//         <div className="flex items-center gap-2">
//           <span className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}>{count.toString().padStart(2, '0')}</span>
//           <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`} />
//         </div>
//       </div>
//     </div>
    
//   </button>
// );

// export default VacancyDetails;
//*****************************************************working code 23 03/02/26************************************************************* */
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Users,
//   IndianRupee,
//   FileText,
//   Gavel,
//   GraduationCap,
//   UserPlus,
//   CheckCircle2,
//   Activity,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft,
//   Navigation,
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE REGISTRY ---
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null);
//   const [metricData, setMetricData] = useState([]);
//   const [loadingMetrics, setLoadingMetrics] = useState(false);
//   const [candidatePage, setCandidatePage] = useState(1);
//   const candidatesPerPage = 5;
//   const [registrySearch, setRegistrySearch] = useState("");
//   const [showMetadata, setShowMetadata] = useState(true);

//   // --- ADD TO STATE REGISTRY ---
// const [filters, setFilters] = useState({
//   experiences: [],
//   educations: [],
//   cities: [],
//   genders: [],
// });
// const [industries, setIndustries] = useState([]);
// const [educationMasters, setEducationMasters] = useState([]);
//   // --- DATA FETCHING PROTOCOL ---
//   // useEffect(() => {
//   //   const fetchAllDetails = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//   //       if (!vacRes.ok) throw new Error("Vacancy node not found");
//   //       const vacData = await vacRes.json();
//   //       setVacancy(vacData);

//   //       const [resResp, resLeads, resDb] = await Promise.all([
//   //         fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//   //         fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//   //         fetch(`https://apihrr.goelectronix.co.in/candidates`)
//   //       ]);

//   //       const [dataResp, dataLeads, dataDb] = await Promise.all([
//   //         resResp.json(), resLeads.json(), resDb.json()
//   //       ]);

//   //       setMetrics({
//   //         responses: dataResp.length || 0,
//   //         leads: dataLeads.length || 0,
//   //         database: dataDb.length || 0
//   //       });

//   //       if (vacData.job_description) {
//   //         const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//   //         const jdData = await jdRes.json();
//   //         setJobDescription(jdData);
//   //       }

//   //       const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//   //       const compListData = await compRes.json();
//   //       const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//   //       if (matchedCompany) setCompany(matchedCompany);

//   //     } catch (err) {
//   //       toast.error(err.message);
//   //       navigate("/vacancies");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchAllDetails();
//   // }, [id, navigate]);

//   // 1. Move the function out so the whole component can use it
// const fetchAllDetails = async () => {
//   setLoading(true);
//   try {
//     const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//     if (!vacRes.ok) throw new Error("Vacancy node not found");
//     const vacData = await vacRes.json();
//     setVacancy(vacData);

//     const [resResp, resLeads, resDb] = await Promise.all([
//       fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//       fetch(`https://apihrr.goelectronix.co.in/candidates`)
//     ]);

//     const [dataResp, dataLeads, dataDb] = await Promise.all([
//       resResp.json(), resLeads.json(), resDb.json()
//     ]);

//     setMetrics({
//       responses: dataResp.length || 0,
//       leads: dataLeads.length || 0,
//       database: dataDb.length || 0
//     });

//     if (vacData.job_description) {
//       const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//       const jdData = await jdRes.json();
//       setJobDescription(jdData);
//     }

//     const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//     const compListData = await compRes.json();
//     const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//     if (matchedCompany) setCompany(matchedCompany);

//   } catch (err) {
//     toast.error(err.message);
//     navigate("/vacancies");
//   } finally {
//     setLoading(false);
//   }
// };

// // 2. The useEffect now simply triggers the shared function on mount
// useEffect(() => {
//   fetchAllDetails();
// }, [id, navigate]);


// const filteredResults = useMemo(() => {
//   return metricData.filter((c) => {
//     // 1. Search Query
//     const matchesSearch = c.full_name?.toLowerCase().includes(registrySearch.toLowerCase());
    
//     // 2. City Filter
//     const matchesCity = filters.cities.length === 0 || filters.cities.includes(c.city?.toUpperCase());
    
//     // 3. Education Filter
//     const matchesEdu = filters.educations.length === 0 || filters.educations.includes(c.latest_education?.toUpperCase());
    
//     // 4. Gender Filter
//     const matchesGender = filters.genders.length === 0 || filters.genders.includes(c.gender?.toUpperCase());

//     return matchesSearch && matchesCity && matchesEdu && matchesGender;
//   });
// }, [metricData, registrySearch, filters]);

//   // --- LOGIC HELPERS ---
//   // const filteredResults = useMemo(() => {
//   //   return metricData.filter((c) =>
//   //     c.full_name?.toLowerCase().includes(registrySearch.toLowerCase())
//   //   );
//   // }, [metricData, registrySearch]);

//   const indexOfLastCandidate = candidatePage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
//   const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

//   useEffect(() => {
//     setCandidatePage(1);
//   }, [activeMetricTab, registrySearch]);

//   const handleTabClick = async (tabType) => {
//     if (activeMetricTab === tabType) {
//       setActiveMetricTab(null);
//       setShowMetadata(true);
//       return;
//     }
//     setActiveMetricTab(tabType);
//     setShowMetadata(false); // 🟢 Auto-hide Vacancy Post when Registry is clicked
//     setLoadingMetrics(true);
//     try {
//       let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//                 tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//                 `https://apihrr.goelectronix.co.in/candidates`;
//       const res = await fetch(url);
//       const data = await res.json();
//       setMetricData(data);
//     } catch (err) {
//       toast.error("Registry sync failed");
//     } finally {
//       setLoadingMetrics(false);
//     }
//   };

//   const getPaginationGroup = () => {
//     const range = [];
//     const delta = 1;
//     for (let i = 1; i <= totalCandidatePages; i++) {
//       if (i === 1 || i === totalCandidatePages || (i >= candidatePage - delta && i <= candidatePage + delta)) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "...") {
//         range.push("...");
//       }
//     }
//     return range;
//   };


//   const toggleFilter = (category, value) => {
//   setFilters((prev) => ({
//     ...prev,
//     [category]: prev[category].includes(value)
//       ? prev[category].filter((item) => item !== value)
//       : [...prev[category], value],
//   }));
// };

// const clearAllFilters = () => {
//   setFilters({ experiences: [], educations: [], cities: [], genders: [] });
// };

//   const formatEnterpriseDate = (d) => {
//     if (!d) return "N/A";
//     const date = new Date(d);
//     return `${String(date.getDate()).padStart(2, '0')}-${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
//   };

//   // const toggleNumberReveal = async (candidateId) => {
//   //   // 🛡️ Guard: If already revealed in this session, avoid duplicate API calls
//   //   if (revealedNumbers[candidateId]) return;

//   //   const loadingToast = toast.loading("Executing Secure Access Protocol...");

//   //   try {
//   //     // 📦 FORMDATA PROTOCOL
//   //     const formPayload = new FormData();
//   //     formPayload.append("applied_vacancy_id", id); // 'id' from useParams()

//   //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidateId}`, {
//   //       method: 'PATCH',
//   //       body: formPayload, // Sending as FormData
//   //       // ⚠️ Note: Do not set Content-Type header; the browser sets multipart/form-data
//   //     });

//   //     if (!res.ok) throw new Error("API Node Sync Failed");

//   //     // ✅ Update Local Registry State
//   //     setRevealedNumbers((prev) => ({
//   //       ...prev,
//   //       [candidateId]: true,
//   //     }));

//   //     toast.success("Contact Data Synchronized", { id: loadingToast });
//   //   } catch (err) {
//   //     console.error("Telemetry Error:", err);
//   //     toast.error("Access Denied: Protocol Failure", { id: loadingToast });
//   //   }
//   // };


//   // const isAlreadyRevealed = (candidate) => {
//   //   return (
//   //     !!revealedNumbers[candidate.id] || 
//   //     (candidate.applied_vacancy_id !== null && candidate.applied_vacancy_id !== undefined)
//   //   );
//   // };


//   // 🛡️ ENTERPRISE CONTEXT PROTOCOL
//   // Checks if the candidate is revealed for THIS specific vacancy ID
//   // const isRevealedForThisVacancy = (candidate) => {
//   //   const currentVacancyId = Number(id); // 'id' from useParams()
    
//   //   return (
//   //     !!revealedNumbers[candidate.id] || 
//   //     candidate.applied_vacancy_id === currentVacancyId
//   //   );
//   // };

//   // 🛡️ ENTERPRISE MULTI-CONTEXT PROTOCOL
  

//   // const toggleNumberReveal = async (candidate) => {
//   //   // 🛡️ Guard: Check session state
//   //   if (revealedNumbers[candidate.id]) return;

//   //   const loadingToast = toast.loading("Executing Multi-Node Sync...");

//   //   try {
//   //     // 🛠️ CLUSTER AGGREGATION LOGIC
//   //     // 1. Get existing string (e.g., "35") or default to empty array
//   //     const existingRaw = candidate.applied_vacancy_id ? candidate.applied_vacancy_id.toString() : "";
//   //     const existingIds = existingRaw ? existingRaw.split(',').map(item => item.trim()) : [];
      
//   //     // 2. Add current ID and remove duplicates using Set
//   //     const updatedCluster = [...new Set([...existingIds, id.toString()])].join(',');

//   //     // 📦 FORMDATA PROTOCOL
//   //     const formPayload = new FormData();
//   //     formPayload.append("applied_vacancy_id", updatedCluster);

//   //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//   //       method: 'PATCH',
//   //       body: formPayload,
//   //     });

//   //     if (!res.ok) throw new Error("API Node Sync Failed");

//   //     // ✅ Update Local Registry State
//   //     setRevealedNumbers((prev) => ({
//   //       ...prev,
//   //       [candidate.id]: true,
//   //     }));

//   //     toast.success(`Candidate Linked to Cluster: ${updatedCluster}`, { id: loadingToast });
      
//   //     // 🔁 Optional: Re-fetch current tab data to show updated backend state
//   //     handleTabClick(activeMetricTab);

//   //   } catch (err) {
//   //     console.error("Telemetry Error:", err);
//   //     toast.error("Access Denied: Protocol Failure", { id: loadingToast });
//   //   }
//   // };

  
// // const toggleNumberReveal = async (candidate) => {
// //   // 🛡️ Guard: Check session state to prevent duplicate execution
// //   if (revealedNumbers[candidate.id]) return;

// //   const loadingToast = toast.loading("Executing Multi-Node Sync...");

// //   try {
// //     // 1. DATA NORMALIZATION PROTOCOL
// //     // Get the raw value from the database
// //     const rawValue = candidate.applied_vacancy_ids;

// //     let existingIds = [];

// //     if (rawValue !== null && rawValue !== undefined) {
// //       // Convert to string safely and split by comma
// //       // This handles cases where the DB sends a Number instead of a String
// //       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
// //     }

// //     // 2. CLUSTER AGGREGATION
// //     // Add current ID from URL params and ensure uniqueness via Set
// //     const currentVacancyId = id.toString();
// //     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
    
// //     // Convert back to CSV string for the backend
// //     const updatedClusterString = updatedClusterArray.join(',');

// //     // 3. TELEMETRY TRANSMISSION
// //     const formPayload = new FormData();
// //     formPayload.append("applied_vacancy_ids", updatedClusterString);

// //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
// //       method: 'PATCH',
// //       body: formPayload,
// //     });

// //     if (!res.ok) throw new Error("API Node Sync Failed");

// //     // 4. REGISTRY UPDATE
// //     setRevealedNumbers((prev) => ({
// //       ...prev,
// //       [candidate.id]: true,
// //     }));

// //     toast.success(`Access Logged: Node Cluster Updated`, { id: loadingToast });
    
// //     // Refresh the metric data to reflect the new comma-separated string in the UI
// //     // handleTabClick(activeMetricTab);

// //     await Promise.all([
// //        fetchAllDetails(), // This refreshes the 4 main Metric Cards at the top
// //        handleTabClick(activeMetricTab) // This refreshes the candidate list below
// //     ]);

// //   } catch (err) {
// //     console.error("Telemetry Error:", err);
// //     toast.error("Access Denied: Protocol Failure", { id: loadingToast });
// //   }
// // };

// const toggleNumberReveal = async (candidate) => {
//   // 🛡️ Guard: Check session state
//   if (revealedNumbers[candidate.id]) return;

//   const loadingToast = toast.loading("Executing Multi-Node Sync...");

//   try {
//     // 1. DATA NORMALIZATION PROTOCOL
//     // Use 'applied_vacancy_ids' (plural) to match your logic
//     const rawValue = candidate.applied_vacancy_ids;
//     let existingIds = [];

//     if (rawValue !== null && rawValue !== undefined) {
//       existingIds = rawValue.toString().split(',').map(item => item.trim()).filter(Boolean);
//     }

//     // 2. CLUSTER AGGREGATION
//     const currentVacancyId = id.toString();
//     const updatedClusterArray = [...new Set([...existingIds, currentVacancyId])];
//     const updatedClusterString = updatedClusterArray.join(',');

//     // 3. TELEMETRY TRANSMISSION
//     const formPayload = new FormData();
//     // ⚠️ Ensure "applied_vacancy_ids" is the exact key your backend expects
//     formPayload.append("applied_vacancy_ids", updatedClusterString);

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//       method: 'PATCH',
//       body: formPayload,
//       // Note: No Content-Type header for FormData
//     });

//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       console.error("Server Rejected Protocol:", errorData);
//       throw new Error(errorData.message || "API Node Sync Failed");
//     }

//     // 4. REGISTRY UPDATE
//     setRevealedNumbers((prev) => ({
//       ...prev,
//       [candidate.id]: true,
//     }));

//     toast.success(`Access Logged: Node Cluster Updated`, { id: loadingToast });
    
//     // 5. ATOMIC RE-SYNCHRONIZATION
//     // Ensure fetchAllDetails is the function name you defined in your useEffect
//     await Promise.all([
//        fetchAllDetails(), 
//     ]);

//     handleTabClick(activeMetricTab) 

//   } catch (err) {
//     console.error("Telemetry Error Detail:", err);
//     // Dynamic error message for better forensic debugging
//     toast.error(`Access Denied: ${err.message || "Protocol Failure"}`, { id: loadingToast });
//   }
// };



  
//   // const isRevealedForThisVacancy = (candidate) => {
//   //   const currentId = id.toString(); // Current Vacancy from URL
    
//   //   // 1. Check current session state
//   //   if (revealedNumbers[candidate.id]) return true;

//   //   // 2. Check if current vacancy ID exists in the comma-separated database string
//   //   const existingIds = candidate.applied_vacancy_id 
//   //     ? candidate.applied_vacancy_id.toString().split(',') 
//   //     : [];

//   //   return existingIds.includes(currentId);
//   // };

//   const isRevealedForThisVacancy = (candidate) => {
//   const currentId = id.toString(); 
  
//   if (revealedNumbers[candidate.id]) return true;

//   // Safely check the comma string
//   const existingIds = candidate.applied_vacancy_ids 
//     ? candidate.applied_vacancy_ids.toString().split(',').map(x => x.trim()) 
//     : [];

//   return existingIds.includes(currentId);
// };


// const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div className="relative space-y-2">
//       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//         {icon} {label}
//       </label>
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-blue-400 transition-all"
//       >
//         <span className="truncate">{selected.length > 0 ? `${selected.length} Selected` : "All Units"}</span>
//         <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {isOpen && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
//           <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
//             {options.map(opt => (
//               <label key={opt} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
//                 <input 
//                   type="checkbox" 
//                   checked={selected.includes(opt)} 
//                   onChange={() => onSelect(opt)}
//                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" 
//                 />
//                 <span className="text-[10px] font-black uppercase text-slate-600">{opt}</span>
//               </label>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Node Protocol...</p>
//     </div>
//   );

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none">
//             <ChevronLeft size={16} /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
//             {/* --- HEADER IDENTITY SECTION --- */}
//             {/* <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm">
//               <ShieldCheck className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" size={320} />
              
//               <div className="relative z-10 space-y-10">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                   <div className="flex items-center gap-5">
//                     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm">
//                       <Building2 size={32} strokeWidth={2.5} />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">Hiring Organization</span>
//                       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{company?.name || vacancy?.company?.name}</h2>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
                   
//                     {activeMetricTab && (
//                       <button 
//                         onClick={() => setShowMetadata(!showMetadata)}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "View Vacancy Details"}
//                       </button>
//                     )}
//                     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner">
//                         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${vacancy?.status === 'open' ? 'text-emerald-500' : 'text-red-500'}`}>
//                           <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
//                           {vacancy?.status?.replace('_', ' ') || 'PENDING'}
//                         </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">{vacancy?.title}</h1>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//                   <MetricTab icon={Users} label="Responses" count={metrics.responses} onClick={() => handleTabClick('responses')} iconBg="bg-blue-50" colorClass="text-blue-600" />
//                   <MetricTab icon={Zap} label="Hot Leads" count={metrics.leads} onClick={() => handleTabClick('leads')} iconBg="bg-orange-50" colorClass="text-orange-500" />
//                   <MetricTab icon={ShieldCheck} label="Candidate" count={metrics.database} onClick={() => navigate('/candidatefilter')} iconBg="bg-slate-50" colorClass="text-slate-600" />
//                   <MetricTab icon={UserPlus} label="Total Lead" count={metrics.database} onClick={() => navigate('/candidatefilter')} iconBg="bg-emerald-50" colorClass="text-emerald-600" />
//                 </div>
//               </div>
//             </section> */}


//             <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">


//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
//     {/* {!activeMetricTab && (
//       <button 
//         onClick={() => setShowMetadata(!showMetadata)}
//         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//           showMetadata 
//           ? "!bg-white !border-blue-500 !text-black shadow-lg shadow-slate-200" 
//           : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//         }`}
//       >
//         <Layers size={14} strokeWidth={3} />
//         {showMetadata ? "Show Vacancy" : "Hide Vacancy"}
//       </button>
//     )} */}
//      {activeMetricTab && (
//                       <button 
//                         // onClick={() => setShowMetadata(!showMetadata)}
//                         onClick={() => {
//       if (!showMetadata) {
//         // 🟢 If we are showing the Post, we must hide the Candidate Registry box
//         setShowMetadata(true);
//         setActiveMetricTab(null); // This clears the registry selection
//       } else {
//         setShowMetadata(false);
//       }
//     }}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "Overview"}
//                       </button>
//                     )}
    
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

            
//           </div>

//           {/* --- SIDEBAR MODULE --- */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><Phone size={20}/></div>
//                   <div><span className={labelClass}>Contact Person Number</span><p className={valueClass}>{company?.contact_number || vacancy?.company?.phone || "+91 ••••••••••"}</p></div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><UserCheck size={20}/></div>
//                   <div><span className={labelClass}>Contact Person</span><p className={valueClass}>{company?.contact_person || vacancy?.company?.contact_person || "Hiring Lead"}</p></div>
//                 </div>
//               </div>
//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                 <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">{formatEnterpriseDate(vacancy?.deadline_date)}</p>
//               </div>
//             </div>
//           </div>

          

//         </div>

//         <div className="flex w-full">
//           {/* --- MASTER SWITCH CONTENT AREA --- */}
       
              
//               {/* 🔵 CANDIDATE REGISTRY VIEW */}
//               {activeMetricTab && !showMetadata && (
//                <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
//          {/* ================= FILTER REGISTRY CONSOLE ================= */}
// <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
//   <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
    
//     {/* SECTION HEADER */}
//     <div className="flex items-center gap-3 mb-6 px-1">
//       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
//         <Layers size={16} strokeWidth={2.5} />
//       </div>
//       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
//         Registry Filter Hub
//       </span>
//     </div>

//     {/* FILTER GRID */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      
//       {/* EXPERIENCE FILTER */}
//       <FilterDropdown
//         label="Experience Tier"
//         icon={<Clock size={13} />}
//         options={["0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"]}
//         selected={filters.experiences}
//         onSelect={(v) => toggleFilter("experiences", v)}
//       />

//       {/* EDUCATION FILTER */}
//       <FilterDropdown
//         label="Academic Node"
//         icon={<GraduationCap size={13} />}
//         options={["GRADUATE", "POST GRADUATE", "DIPLOMA", "DOCTORATE"]}
//         selected={filters.educations}
//         onSelect={(v) => toggleFilter("educations", v)}
//       />

//       {/* CITY FILTER */}
//       <FilterDropdown
//         label="City Jurisdiction"
//         icon={<Navigation size={13} />}
//         options={[...new Set(metricData.map(c => c.city?.toUpperCase()))].filter(Boolean).sort()}
//         selected={filters.cities}
//         onSelect={(v) => toggleFilter("cities", v)}
//       />

//       {/* GENDER FILTER */}
//       <FilterDropdown
//         label="Gender Vector"
//         icon={<Users size={13} />}
//         options={["MALE", "FEMALE", "OTHER"]}
//         selected={filters.genders}
//         onSelect={(v) => toggleFilter("genders", v)}
//       />
//     </div>

//     {/* ACTIVE FILTER CHIPS */}
//     {Object.values(filters).some(arr => arr.length > 0) && (
//       <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
//         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Logic Applied:</span>
//         {Object.entries(filters).map(([cat, vals]) => 
//           vals.map(v => (
//             <button key={v} onClick={() => toggleFilter(cat, v)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all group border border-blue-100">
//               {v} <X size={12} className="text-blue-300 group-hover:text-white" />
//             </button>
//           ))
//         )}
//         <button onClick={clearAllFilters} className="ml-auto text-[9px] font-black uppercase text-rose-500 hover:underline">Purge All</button>
//       </div>
//     )}
//   </div>
// </div>
    
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

     

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
//   {/* LEFT SIDE: SECURE CONTACT NODE */}
//   {/* <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      
      
//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div> */}


//   {/* --- CONTACT NODE --- */}
// <div className="flex items-center gap-3">
//   <div className={`p-2 rounded-lg transition-all duration-500 ${
//     revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'
//   }`}>
//     <Phone size={14} strokeWidth={2.5} />
//   </div>
  
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//       Contact Number
//     </span>
    
//     <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//       {/* {revealedNumbers[c.id] ? (
//         <span className="animate-in fade-in zoom-in-95 duration-300">
//           {c.phone || "No Data"}
//         </span>
//       ) : (
//         <span className="text-slate-300 select-none tracking-[0.3em]">
//           +91 ••••••••••
//         </span>
//       )} */}
//       {/* {isAlreadyRevealed(c) ? (
//         <span className="animate-in fade-in zoom-in-95 duration-300">
//           {c.phone || "No Data"}
//         </span>
//       ) : (
//         <span className="text-slate-300 select-none tracking-[0.3em]">
//           +91 ••••••••••
//         </span>
//       )} */}
//       {isRevealedForThisVacancy(c) ? (
//               <span className="animate-in fade-in zoom-in-95 duration-300">
//                 {c.phone || "No Data"}
//               </span>
//             ) : (
//               <span className="text-slate-300 select-none tracking-[0.3em]">
//                 +91 ••••••••••
//               </span>
//             )}
//     </p>
//   </div>
// </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">

//      <button
//                                                   onClick={() => navigate(`/candidateflow?id=${c.id}`)}
//                                                   className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                                                 >
//                                                   <Gavel size={14} /> Decision
//                                                 </button>
    
//     {/* VIEW NUMBER TOGGLE */}
//     {/* <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
      
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
     
//     </button> */}
//     {/* --- ACTION BUTTON --- */}
// {/* <button
//   onClick={(e) => {
//     e.stopPropagation();
//     toggleNumberReveal(c.id);
//   }}
//   className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//     revealedNumbers[c.id] 
//       ? "!bg-emerald-50 !border-emerald-200 !text-emerald-600 cursor-default" 
//       : "!bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//   }`}
// >
//   {revealedNumbers[c.id] ? (
//     <> <CheckCircle2 size={14} strokeWidth={3} /> Accessed </>
//   ) : (
//     <> <UserCheck size={14} strokeWidth={3} /> View Number </>
//   )}
// </button> */}
// {!isRevealedForThisVacancy(c) ? (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         // toggleNumberReveal(c.id);
//         toggleNumberReveal(c);
//       }}
//       className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//     >
//       <UserCheck size={14} strokeWidth={3} /> View Number
//     </button>
//   ) : (
//     /* Optional: Show a "Linked" badge instead of a button for better UX */
//     <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
//       <CheckCircle2 size={12} className="text-emerald-500" />
//       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">Viewed Number</span>
//     </div>
//   )}

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

         

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
//               )}


//                {/* 🟢 VACANCY DETAILS VIEW */}
//               {showMetadata && (
//                <div className="space-y-4 pb-10 mt-10 w-full">
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
//               )}


            
//           </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
//         .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//       `}} />
//     </div>
//   );
// };

// // --- SUB-COMPONENT REGISTRY ---
// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg, isActive }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
//   >
//     <div className="flex items-center gap-4">
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">{label}</span>
//         <div className="flex items-center gap-2">
//           <span className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}>{count.toString().padStart(2, '0')}</span>
//           <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`} />
//         </div>
//       </div>
//     </div>
    
//   </button>
// );

// export default VacancyDetails;
//****************************************************working code phase 2 02/03/26*********************************************** */
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Users,
//   IndianRupee,
//   FileText,
//   Gavel,
//   GraduationCap,
//   UserPlus,
//   CheckCircle2,
//   Activity,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft,
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
//   Loader2,
//   Building2,
//   Phone,
//   UserCheck
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacancyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE REGISTRY ---
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState("description");
//   const [vacancy, setVacancy] = useState(null);
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null);
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null);
//   const [metricData, setMetricData] = useState([]);
//   const [loadingMetrics, setLoadingMetrics] = useState(false);
//   const [candidatePage, setCandidatePage] = useState(1);
//   const candidatesPerPage = 5;
//   const [registrySearch, setRegistrySearch] = useState("");
//   const [showMetadata, setShowMetadata] = useState(true);

//   // --- DATA FETCHING PROTOCOL ---
//   useEffect(() => {
//     const fetchAllDetails = async () => {
//       setLoading(true);
//       try {
//         const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//         if (!vacRes.ok) throw new Error("Vacancy node not found");
//         const vacData = await vacRes.json();
//         setVacancy(vacData);

//         const [resResp, resLeads, resDb] = await Promise.all([
//           fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}`),
//           fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//           fetch(`https://apihrr.goelectronix.co.in/candidates`)
//         ]);

//         const [dataResp, dataLeads, dataDb] = await Promise.all([
//           resResp.json(), resLeads.json(), resDb.json()
//         ]);

//         setMetrics({
//           responses: dataResp.length || 0,
//           leads: dataLeads.length || 0,
//           database: dataDb.length || 0
//         });

//         if (vacData.job_description) {
//           const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//           const jdData = await jdRes.json();
//           setJobDescription(jdData);
//         }

//         const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//         const compListData = await compRes.json();
//         const matchedCompany = compListData.find(c => c.id === vacData.company?.id);
//         if (matchedCompany) setCompany(matchedCompany);

//       } catch (err) {
//         toast.error(err.message);
//         navigate("/vacancies");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllDetails();
//   }, [id, navigate]);

//   // --- LOGIC HELPERS ---
//   const filteredResults = useMemo(() => {
//     return metricData.filter((c) =>
//       c.full_name?.toLowerCase().includes(registrySearch.toLowerCase())
//     );
//   }, [metricData, registrySearch]);

//   const indexOfLastCandidate = candidatePage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
//   const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

//   useEffect(() => {
//     setCandidatePage(1);
//   }, [activeMetricTab, registrySearch]);

//   const handleTabClick = async (tabType) => {
//     if (activeMetricTab === tabType) {
//       setActiveMetricTab(null);
//       setShowMetadata(true);
//       return;
//     }
//     setActiveMetricTab(tabType);
//     setShowMetadata(false); // 🟢 Auto-hide Vacancy Post when Registry is clicked
//     setLoadingMetrics(true);
//     try {
//       let url = tabType === 'responses' ? `https://apihrr.goelectronix.co.in/candidates?status=jd_sent&vacancy_id=${id}` :
//                 tabType === 'leads' ? `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}` :
//                 `https://apihrr.goelectronix.co.in/candidates`;
//       const res = await fetch(url);
//       const data = await res.json();
//       setMetricData(data);
//     } catch (err) {
//       toast.error("Registry sync failed");
//     } finally {
//       setLoadingMetrics(false);
//     }
//   };

//   const getPaginationGroup = () => {
//     const range = [];
//     const delta = 1;
//     for (let i = 1; i <= totalCandidatePages; i++) {
//       if (i === 1 || i === totalCandidatePages || (i >= candidatePage - delta && i <= candidatePage + delta)) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "...") {
//         range.push("...");
//       }
//     }
//     return range;
//   };

//   const formatEnterpriseDate = (d) => {
//     if (!d) return "N/A";
//     const date = new Date(d);
//     return `${String(date.getDate()).padStart(2, '0')}-${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
//   };

//   // const toggleNumberReveal = async (candidateId) => {
//   //   // 🛡️ Guard: If already revealed in this session, avoid duplicate API calls
//   //   if (revealedNumbers[candidateId]) return;

//   //   const loadingToast = toast.loading("Executing Secure Access Protocol...");

//   //   try {
//   //     // 📦 FORMDATA PROTOCOL
//   //     const formPayload = new FormData();
//   //     formPayload.append("applied_vacancy_id", id); // 'id' from useParams()

//   //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidateId}`, {
//   //       method: 'PATCH',
//   //       body: formPayload, // Sending as FormData
//   //       // ⚠️ Note: Do not set Content-Type header; the browser sets multipart/form-data
//   //     });

//   //     if (!res.ok) throw new Error("API Node Sync Failed");

//   //     // ✅ Update Local Registry State
//   //     setRevealedNumbers((prev) => ({
//   //       ...prev,
//   //       [candidateId]: true,
//   //     }));

//   //     toast.success("Contact Data Synchronized", { id: loadingToast });
//   //   } catch (err) {
//   //     console.error("Telemetry Error:", err);
//   //     toast.error("Access Denied: Protocol Failure", { id: loadingToast });
//   //   }
//   // };


//   // const isAlreadyRevealed = (candidate) => {
//   //   return (
//   //     !!revealedNumbers[candidate.id] || 
//   //     (candidate.applied_vacancy_id !== null && candidate.applied_vacancy_id !== undefined)
//   //   );
//   // };


//   // 🛡️ ENTERPRISE CONTEXT PROTOCOL
//   // Checks if the candidate is revealed for THIS specific vacancy ID
//   // const isRevealedForThisVacancy = (candidate) => {
//   //   const currentVacancyId = Number(id); // 'id' from useParams()
    
//   //   return (
//   //     !!revealedNumbers[candidate.id] || 
//   //     candidate.applied_vacancy_id === currentVacancyId
//   //   );
//   // };

//   // 🛡️ ENTERPRISE MULTI-CONTEXT PROTOCOL
  

//   const toggleNumberReveal = async (candidate) => {
//     // 🛡️ Guard: Check session state
//     if (revealedNumbers[candidate.id]) return;

//     const loadingToast = toast.loading("Executing Multi-Node Sync...");

//     try {
//       // 🛠️ CLUSTER AGGREGATION LOGIC
//       // 1. Get existing string (e.g., "35") or default to empty array
//       const existingRaw = candidate.applied_vacancy_id ? candidate.applied_vacancy_id.toString() : "";
//       const existingIds = existingRaw ? existingRaw.split(',').map(item => item.trim()) : [];
      
//       // 2. Add current ID and remove duplicates using Set
//       const updatedCluster = [...new Set([...existingIds, id.toString()])].join(',');

//       // 📦 FORMDATA PROTOCOL
//       const formPayload = new FormData();
//       formPayload.append("applied_vacancy_id", updatedCluster);

//       const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${candidate.id}`, {
//         method: 'PATCH',
//         body: formPayload,
//       });

//       if (!res.ok) throw new Error("API Node Sync Failed");

//       // ✅ Update Local Registry State
//       setRevealedNumbers((prev) => ({
//         ...prev,
//         [candidate.id]: true,
//       }));

//       toast.success(`Candidate Linked to Cluster: ${updatedCluster}`, { id: loadingToast });
      
//       // 🔁 Optional: Re-fetch current tab data to show updated backend state
//       handleTabClick(activeMetricTab);

//     } catch (err) {
//       console.error("Telemetry Error:", err);
//       toast.error("Access Denied: Protocol Failure", { id: loadingToast });
//     }
//   };
  
//   const isRevealedForThisVacancy = (candidate) => {
//     const currentId = id.toString(); // Current Vacancy from URL
    
//     // 1. Check current session state
//     if (revealedNumbers[candidate.id]) return true;

//     // 2. Check if current vacancy ID exists in the comma-separated database string
//     const existingIds = candidate.applied_vacancy_id 
//       ? candidate.applied_vacancy_id.toString().split(',') 
//       : [];

//     return existingIds.includes(currentId);
//   };

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Node Protocol...</p>
//     </div>
//   );

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
//   const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       <nav className="!bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors bg-transparent border-0 outline-none">
//             <ChevronLeft size={16} /> Back to Search
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
//             {/* --- HEADER IDENTITY SECTION --- */}
//             {/* <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm">
//               <ShieldCheck className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" size={320} />
              
//               <div className="relative z-10 space-y-10">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                   <div className="flex items-center gap-5">
//                     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm">
//                       <Building2 size={32} strokeWidth={2.5} />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">Hiring Organization</span>
//                       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{company?.name || vacancy?.company?.name}</h2>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
                   
//                     {activeMetricTab && (
//                       <button 
//                         onClick={() => setShowMetadata(!showMetadata)}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "View Vacancy Details"}
//                       </button>
//                     )}
//                     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner">
//                         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${vacancy?.status === 'open' ? 'text-emerald-500' : 'text-red-500'}`}>
//                           <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
//                           {vacancy?.status?.replace('_', ' ') || 'PENDING'}
//                         </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">{vacancy?.title}</h1>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//                   <MetricTab icon={Users} label="Responses" count={metrics.responses} onClick={() => handleTabClick('responses')} iconBg="bg-blue-50" colorClass="text-blue-600" />
//                   <MetricTab icon={Zap} label="Hot Leads" count={metrics.leads} onClick={() => handleTabClick('leads')} iconBg="bg-orange-50" colorClass="text-orange-500" />
//                   <MetricTab icon={ShieldCheck} label="Candidate" count={metrics.database} onClick={() => navigate('/candidatefilter')} iconBg="bg-slate-50" colorClass="text-slate-600" />
//                   <MetricTab icon={UserPlus} label="Total Lead" count={metrics.database} onClick={() => navigate('/candidatefilter')} iconBg="bg-emerald-50" colorClass="text-emerald-600" />
//                 </div>
//               </div>
//             </section> */}


//             <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">


//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
//     {/* {!activeMetricTab && (
//       <button 
//         onClick={() => setShowMetadata(!showMetadata)}
//         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//           showMetadata 
//           ? "!bg-white !border-blue-500 !text-black shadow-lg shadow-slate-200" 
//           : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//         }`}
//       >
//         <Layers size={14} strokeWidth={3} />
//         {showMetadata ? "Show Vacancy" : "Hide Vacancy"}
//       </button>
//     )} */}
//      {activeMetricTab && (
//                       <button 
//                         // onClick={() => setShowMetadata(!showMetadata)}
//                         onClick={() => {
//       if (!showMetadata) {
//         // 🟢 If we are showing the Post, we must hide the Candidate Registry box
//         setShowMetadata(true);
//         setActiveMetricTab(null); // This clears the registry selection
//       } else {
//         setShowMetadata(false);
//       }
//     }}
//                         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//                           showMetadata ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//                         }`}
//                       >
//                         <Layers size={14} strokeWidth={3} />
//                         {showMetadata ? "View Candidate List" : "Overview"}
//                       </button>
//                     )}
    
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap justify-evenly items-center gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

            
//           </div>

//           {/* --- SIDEBAR MODULE --- */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><Phone size={20}/></div>
//                   <div><span className={labelClass}>Contact Person Number</span><p className={valueClass}>{company?.contact_number || vacancy?.company?.phone || "+91 ••••••••••"}</p></div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50"><UserCheck size={20}/></div>
//                   <div><span className={labelClass}>Contact Person</span><p className={valueClass}>{company?.contact_person || vacancy?.company?.contact_person || "Hiring Lead"}</p></div>
//                 </div>
//               </div>
//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                 <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                 <p className="text-xl font-black text-white tracking-widest relative z-10 leading-none uppercase">{formatEnterpriseDate(vacancy?.deadline_date)}</p>
//               </div>
//             </div>
//           </div>

          

//         </div>

//         <div className="flex w-full">
//           {/* --- MASTER SWITCH CONTENT AREA --- */}
       
              
//               {/* 🔵 CANDIDATE REGISTRY VIEW */}
//               {activeMetricTab && !showMetadata && (
//                <div className="mt-8 animate-in slide-in-from-top-4 duration-500 w-full">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
    
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
//   {/* LEFT SIDE: SECURE CONTACT NODE */}
//   {/* <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      
      
//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div> */}


//   {/* --- CONTACT NODE --- */}
// <div className="flex items-center gap-3">
//   <div className={`p-2 rounded-lg transition-all duration-500 ${
//     revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'
//   }`}>
//     <Phone size={14} strokeWidth={2.5} />
//   </div>
  
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//       Contact Number
//     </span>
    
//     <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//       {/* {revealedNumbers[c.id] ? (
//         <span className="animate-in fade-in zoom-in-95 duration-300">
//           {c.phone || "No Data"}
//         </span>
//       ) : (
//         <span className="text-slate-300 select-none tracking-[0.3em]">
//           +91 ••••••••••
//         </span>
//       )} */}
//       {/* {isAlreadyRevealed(c) ? (
//         <span className="animate-in fade-in zoom-in-95 duration-300">
//           {c.phone || "No Data"}
//         </span>
//       ) : (
//         <span className="text-slate-300 select-none tracking-[0.3em]">
//           +91 ••••••••••
//         </span>
//       )} */}
//       {isRevealedForThisVacancy(c) ? (
//               <span className="animate-in fade-in zoom-in-95 duration-300">
//                 {c.phone || "No Data"}
//               </span>
//             ) : (
//               <span className="text-slate-300 select-none tracking-[0.3em]">
//                 +91 ••••••••••
//               </span>
//             )}
//     </p>
//   </div>
// </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">

//      <button
//                                                   onClick={() => navigate(`/candidateflow?id=${c.id}`)}
//                                                   className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                                                 >
//                                                   <Gavel size={14} /> Decision
//                                                 </button>
    
//     {/* VIEW NUMBER TOGGLE */}
//     {/* <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
      
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
     
//     </button> */}
//     {/* --- ACTION BUTTON --- */}
// {/* <button
//   onClick={(e) => {
//     e.stopPropagation();
//     toggleNumberReveal(c.id);
//   }}
//   className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//     revealedNumbers[c.id] 
//       ? "!bg-emerald-50 !border-emerald-200 !text-emerald-600 cursor-default" 
//       : "!bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//   }`}
// >
//   {revealedNumbers[c.id] ? (
//     <> <CheckCircle2 size={14} strokeWidth={3} /> Accessed </>
//   ) : (
//     <> <UserCheck size={14} strokeWidth={3} /> View Number </>
//   )}
// </button> */}
// {!isRevealedForThisVacancy(c) ? (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         // toggleNumberReveal(c.id);
//         toggleNumberReveal(c);
//       }}
//       className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 !bg-white !border-blue-600 !text-blue-600 hover:bg-blue-50 shadow-sm"
//     >
//       <UserCheck size={14} strokeWidth={3} /> View Number
//     </button>
//   ) : (
//     /* Optional: Show a "Linked" badge instead of a button for better UX */
//     <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
//       <CheckCircle2 size={12} className="text-emerald-500" />
//       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-nowrap">Viewed Number</span>
//     </div>
//   )}

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

         

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
//               )}


//                {/* 🟢 VACANCY DETAILS VIEW */}
//               {showMetadata && (
//                <div className="space-y-4 pb-10 mt-10 w-full">
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
//               )}


            
//           </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-html-view p { margin-bottom: 1.2rem; line-height: 1.6; }
//         .custom-html-view ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
//         .custom-html-view li { margin-bottom: 0.6rem; color: #475569; }
//         .custom-html-view strong { color: #0F172A; font-weight: 800; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
//       `}} />
//     </div>
//   );
// };

// // --- SUB-COMPONENT REGISTRY ---
// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg, isActive }) => (
//   <button
//     onClick={onClick}
//     className={`flex-1 flex items-center justify-between p-3 rounded-2xl !bg-transparent transition-all duration-300 border-2 bg-white group active:scale-[0.98] outline-none ${isActive ? "!border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300"}`}
//   >
//     <div className="flex items-center gap-4">
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">{label}</span>
//         <div className="flex items-center gap-2">
//           <span className={`text-2xl font-black leading-none ${isActive ? "!text-blue-600" : "!text-slate-900"}`}>{count.toString().padStart(2, '0')}</span>
//           <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-blue-600" : "bg-slate-200"}`} />
//         </div>
//       </div>
//     </div>
    
//   </button>
// );

// export default VacancyDetails;
//************************************************************************************************* */
// import React, { useEffect, useState , useMemo} from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   FileText,
//   GraduationCap,
//   UserPlus,
//   Activity ,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft, 
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
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
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null); // New state for Company data
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null); // 'responses', 'leads', 'database'
// const [metricData, setMetricData] = useState([]);
// const [loadingMetrics, setLoadingMetrics] = useState(false);
// const [candidatePage, setCandidatePage] = useState(1);
// const candidatesPerPage = 5; // Professional density for detailed cards
// const [registrySearch, setRegistrySearch] = useState("");
// const [showMetadata, setShowMetadata] = useState(true);

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

//   useEffect(() => {
//   const fetchAllDetails = async () => {
//     setLoading(true);
//     try {
//       // Existing Vacancy Fetch
//       const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//       if (!vacRes.ok) throw new Error("Vacancy node not found");
//       const vacData = await vacRes.json();
//       setVacancy(vacData);

//       // --- NEW: FETCH METRICS ---
//       const [resResp, resLeads, resDb] = await Promise.all([
//         fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates`)
//       ]);
      
//       const [dataResp, dataLeads, dataDb] = await Promise.all([
//         resResp.json(), resLeads.json(), resDb.json()
//       ]);

//       setMetrics({
//         responses: dataResp.length || 0,
//         leads: dataLeads.length || 0,
//         database: dataDb.length || 0
//       });

//       // (Keep your existing JD and Company fetch logic here...)
//       if (vacData.job_description) {
//          const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//          const jdData = await jdRes.json();
//          setJobDescription(jdData);
//       }

//       if (vacData.company?.id) {
//         const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//         const compListData = await compRes.json();
//         const matchedCompany = compListData.find(c => c.id === vacData.company.id);
//         if (matchedCompany) setCompany(matchedCompany);
//       }

//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchAllDetails();
// }, [id]);

// const getPaginationGroup = () => {
//   const range = [];
//   const delta = 1; // Pages to show around current page
  
//   for (let i = 1; i <= totalCandidatePages; i++) {
//     if (
//       i === 1 || 
//       i === totalCandidatePages || 
//       (i >= candidatePage - delta && i <= candidatePage + delta)
//     ) {
//       range.push(i);
//     } else if (range[range.length - 1] !== "...") {
//       range.push("...");
//     }
//   }
//   return range;
// };

// const formatEnterpriseDate = (dateString) => {
//   if (!dateString) return "NOT SPECIFIED";
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const handleTabClick = async (tabType) => {
//   // Toggle off if clicking the same tab
//   if (activeMetricTab === tabType) {
//     setActiveMetricTab(null);
//     return;
//   }

//   setActiveMetricTab(tabType);
//   setLoadingMetrics(true);
  
//   try {
//     let url = "";
//     if (tabType === 'responses') url = `https://apihrr.goelectronix.co.in/candidates?status=jd_sent`;
//     else if (tabType === 'leads') url = `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`;
//     else url = `https://apihrr.goelectronix.co.in/candidates`;

//     const res = await fetch(url);
//     const data = await res.json();
//     setMetricData(data);
//   } catch (err) {
//     toast.error("Failed to sync registry data");
//   } finally {
//     setLoadingMetrics(false);
//   }
// };


// // 1. First, filter the registry by search term
// const filteredResults = useMemo(() => {
//   return metricData.filter((c) =>
//     c.full_name?.toLowerCase().includes(registrySearch.toLowerCase())
//   );
// }, [metricData, registrySearch]);

// // 2. Then, calculate pagination based on filteredResults
// const indexOfLastCandidate = candidatePage * candidatesPerPage;
// const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
// const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
// const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

// // Reset to page 1 whenever the tab OR the search term changes
// useEffect(() => {
//   setCandidatePage(1);
// }, [activeMetricTab, registrySearch]);

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



// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg }) => (
//   <button
//     onClick={onClick}
//     className="flex-1 flex !bg-transparent items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 !border-slate-200 hover:!border-blue-600 hover:shadow-lg hover:shadow-blue-100 bg-white group active:scale-[0.98]"
//   >
//     <div className="flex items-center gap-4">
//       {/* Icon Branding Box */}
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>

//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
//           {label}
//         </span>
//         <div className="flex items-center gap-2">
//           <span className="text-2xl font-black leading-none !text-slate-900 group-hover:!text-blue-600 transition-colors">
//             {count.toString().padStart(2, '0')}
//           </span>
//           <div className="h-1.5 w-1.5 rounded-full !bg-slate-200 group-hover:!bg-blue-600 animate-pulse" />
//         </div>
//       </div>
//     </div>

//   </button>
// );

// const toggleNumberReveal = (candidateId) => {
//   setRevealedNumbers(prev => ({
//     ...prev,
//     [candidateId]: !prev[candidateId]
//   }));
// };



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
//        {/* --- ENTERPRISE REGISTRY NAVIGATOR --- */}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
            
 


// <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">


//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
//     {!activeMetricTab && (
//       <button 
//         onClick={() => setShowMetadata(!showMetadata)}
//         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
//           showMetadata 
//           ? "!bg-white !border-blue-500 !text-black shadow-lg shadow-slate-200" 
//           : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
//         }`}
//       >
//         <Layers size={14} strokeWidth={3} />
//         {showMetadata ? "Show Vacancy" : "Hide Vacancy"}
//       </button>
//     )}
    
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>





           
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
//               <div className="space-y-6">
               

//                 {/* SHOWING COMPANY CONTACT FROM NEW API */}
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Phone size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Contact Person Number</span>
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

//                 {/* --- STATUS PROTOCOL NODE --- */}

//               </div>

//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                  {/* <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p> */}
//                   <p className="text-xl font-black text-white tracking-tight relative z-10">
//                     {formatEnterpriseDate(vacancy?.deadline_date)}
//                   </p>
//               </div>
//             </div>
//           </div>

//         </div>
//         <div>
// {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
    
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
//   {/* LEFT SIDE: SECURE CONTACT NODE */}
//   <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      
//       {/* 🛡️ SECURITY LOGIC: The real number is NOT in the HTML until revealedNumbers[c.id] is true */}
//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">
    
//     {/* VIEW NUMBER TOGGLE */}
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
      
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
     
//     </button>

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

         

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
// )}




// {/* --- CONDITIONAL ACCORDION SECTIONS (Hidden when Metric Tab is Active OR manually toggled) --- */}
//       {!activeMetricTab && showMetadata && (
//         <div className="space-y-4 pb-10 mt-10">
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
//       )}
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
//*******************************************************woriking code phase 44 28/02/26******************************************************* */
// import React, { useEffect, useState , useMemo} from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   FileText,
//   GraduationCap,
//   UserPlus,
//   Activity ,
//   Languages,
//   Search,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft, 
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
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
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null); // New state for Company data
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null); // 'responses', 'leads', 'database'
// const [metricData, setMetricData] = useState([]);
// const [loadingMetrics, setLoadingMetrics] = useState(false);
// const [candidatePage, setCandidatePage] = useState(1);
// const candidatesPerPage = 5; // Professional density for detailed cards
// const [registrySearch, setRegistrySearch] = useState("");

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

//   useEffect(() => {
//   const fetchAllDetails = async () => {
//     setLoading(true);
//     try {
//       // Existing Vacancy Fetch
//       const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//       if (!vacRes.ok) throw new Error("Vacancy node not found");
//       const vacData = await vacRes.json();
//       setVacancy(vacData);

//       // --- NEW: FETCH METRICS ---
//       const [resResp, resLeads, resDb] = await Promise.all([
//         fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates`)
//       ]);
      
//       const [dataResp, dataLeads, dataDb] = await Promise.all([
//         resResp.json(), resLeads.json(), resDb.json()
//       ]);

//       setMetrics({
//         responses: dataResp.length || 0,
//         leads: dataLeads.length || 0,
//         database: dataDb.length || 0
//       });

//       // (Keep your existing JD and Company fetch logic here...)
//       if (vacData.job_description) {
//          const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//          const jdData = await jdRes.json();
//          setJobDescription(jdData);
//       }

//       if (vacData.company?.id) {
//         const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//         const compListData = await compRes.json();
//         const matchedCompany = compListData.find(c => c.id === vacData.company.id);
//         if (matchedCompany) setCompany(matchedCompany);
//       }

//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchAllDetails();
// }, [id]);

// const getPaginationGroup = () => {
//   const range = [];
//   const delta = 1; // Pages to show around current page
  
//   for (let i = 1; i <= totalCandidatePages; i++) {
//     if (
//       i === 1 || 
//       i === totalCandidatePages || 
//       (i >= candidatePage - delta && i <= candidatePage + delta)
//     ) {
//       range.push(i);
//     } else if (range[range.length - 1] !== "...") {
//       range.push("...");
//     }
//   }
//   return range;
// };

// const formatEnterpriseDate = (dateString) => {
//   if (!dateString) return "NOT SPECIFIED";
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const handleTabClick = async (tabType) => {
//   // Toggle off if clicking the same tab
//   if (activeMetricTab === tabType) {
//     setActiveMetricTab(null);
//     return;
//   }

//   setActiveMetricTab(tabType);
//   setLoadingMetrics(true);
  
//   try {
//     let url = "";
//     if (tabType === 'responses') url = `https://apihrr.goelectronix.co.in/candidates?status=jd_sent`;
//     else if (tabType === 'leads') url = `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`;
//     else url = `https://apihrr.goelectronix.co.in/candidates`;

//     const res = await fetch(url);
//     const data = await res.json();
//     setMetricData(data);
//   } catch (err) {
//     toast.error("Failed to sync registry data");
//   } finally {
//     setLoadingMetrics(false);
//   }
// };


// // const indexOfLastCandidate = candidatePage * candidatesPerPage;
// // const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
// // const currentCandidates = metricData.slice(indexOfFirstCandidate, indexOfLastCandidate);
// // const totalCandidatePages = Math.ceil(metricData.length / candidatesPerPage);

// // // Reset to page 1 whenever the tab changes
// // useEffect(() => {
// //   setCandidatePage(1);
// // }, [activeMetricTab]);

// // 1. First, filter the registry by search term
// const filteredResults = useMemo(() => {
//   return metricData.filter((c) =>
//     c.full_name?.toLowerCase().includes(registrySearch.toLowerCase())
//   );
// }, [metricData, registrySearch]);

// // 2. Then, calculate pagination based on filteredResults
// const indexOfLastCandidate = candidatePage * candidatesPerPage;
// const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
// const currentCandidates = filteredResults.slice(indexOfFirstCandidate, indexOfLastCandidate);
// const totalCandidatePages = Math.ceil(filteredResults.length / candidatesPerPage);

// // Reset to page 1 whenever the tab OR the search term changes
// useEffect(() => {
//   setCandidatePage(1);
// }, [activeMetricTab, registrySearch]);

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



// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg }) => (
//   <button
//     onClick={onClick}
//     className="flex-1 flex !bg-transparent items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 !border-slate-200 hover:!border-blue-600 hover:shadow-lg hover:shadow-blue-100 bg-white group active:scale-[0.98]"
//   >
//     <div className="flex items-center gap-4">
//       {/* Icon Branding Box */}
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>

//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
//           {label}
//         </span>
//         <div className="flex items-center gap-2">
//           <span className="text-2xl font-black leading-none !text-slate-900 group-hover:!text-blue-600 transition-colors">
//             {count.toString().padStart(2, '0')}
//           </span>
//           <div className="h-1.5 w-1.5 rounded-full !bg-slate-200 group-hover:!bg-blue-600 animate-pulse" />
//         </div>
//       </div>
//     </div>
//     {/* <div className="p-2 rounded-lg !bg-slate-50 !text-slate-300 group-hover:!bg-blue-50 group-hover:!text-blue-600 transition-all">
//        <ChevronRight size={18} strokeWidth={3} />
//     </div> */}
//   </button>
// );

// const toggleNumberReveal = (candidateId) => {
//   setRevealedNumbers(prev => ({
//     ...prev,
//     [candidateId]: !prev[candidateId]
//   }));
// };



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
//        {/* --- ENTERPRISE REGISTRY NAVIGATOR --- */}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           <div className="lg:col-span-8 space-y-10">
            
 


// <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6  w-full">
//         {/* <div className="flex justify-between w-full">
//           <div className="flex items-center gap-5">
//           <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] border border-blue-100 shadow-sm">
//             <Building2 size={32} strokeWidth={2.5} />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] leading-none mb-2">
//               Hiring Organization
//             </span>
//             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
//               {company?.name || vacancy?.company?.name}
//             </h2>
//           </div>
//         </div>

//         <div>
//           <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
      
//       <div className={`h-2 w-2 rounded-full animate-pulse ${
//         vacancy?.status === 'open' ? 'bg-emerald-500' : 
//         vacancy?.status === 'closed' ? 'bg-red-500' : 
//         'bg-orange-400'
//       }`} /> 
      
//       {vacancy?.status ? vacancy.status.replace('_', ' ') : 'N/A'}
//     </div>
//   </div>
// </div>
//         </div>
//         </div> */}

//         <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6 ">
  
//   {/* 🟢 LEFT: ORGANIZATION IDENTITY UNIT */}
//   <div className="flex items-center gap-5">
//     {/* Identity Box */}
//     <div className="p-4 bg-blue-50 text-[#2563eb] rounded-[1.5rem] border border-blue-100 shadow-sm shrink-0 transition-transform duration-500 hover:scale-105">
//       <Building2 size={32} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] leading-none mb-2.5">
//         Hiring Organization
//       </span>
//       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
//         {company?.name || vacancy?.company?.name}
//       </h2>
//     </div>
//   </div>

//   {/* 🔵 RIGHT: SYSTEM STATUS NODE */}
//   <div className="flex flex-col items-end gap-2 shrink-0">
    
//     <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
//       {/* Visual Indicator Branding Box */}
     

//       <div className="flex flex-col pr-2">
//         <div className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 ${
//           vacancy?.status === 'open' ? 'text-emerald-500' : 
//           vacancy?.status === 'closed' ? 'text-red-500' : 
//           'text-orange-400'
//         }`}>
//           {/* Pulsing Core Indicator */}
//           <div className={`h-2 w-2 rounded-full animate-pulse ${
//             vacancy?.status === 'open' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
//             vacancy?.status === 'closed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
//             'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
//           }`} /> 
          
//           {vacancy?.status ? vacancy.status.replace('_', ' ') : 'PENDING'}
//         </div>
//       </div>
//     </div>
//   </div>
  
// </div>
        
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//     </div>



//     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
//    <MetricTab 
//     icon={UserPlus} 
//     label="Total Lead" 
//     count={0} 
//     // isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     // onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "location", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>


// {/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
// {/* {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[3rem] border-2 border-blue-600 p-8 shadow-2xl relative overflow-hidden">
      
      
//       <div className="flex items-center justify-between mb-8 relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>
//         <button onClick={() => setActiveMetricTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
//           {metricData.map((c) => (
      
//             <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
         
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
                
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

      
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
               
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
    
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

           
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

           
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">

//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">

//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>


//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>


// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  

//   <div className="flex items-center gap-3">

//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
   
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>

//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}


//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

 
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  

//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>


//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

          
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
 
//   <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      

//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div>


//   <div className="flex items-center gap-3 w-full sm:w-auto">
    

//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
//       {revealedNumbers[c.id] ? (
//         <> <X size={14} strokeWidth={3} /> Hide Number </>
//       ) : (
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
//       )}
//     </button>

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
 
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>

//           ))}
//         </div>
//       )}
//     </div>
//   </div>
// )} */}



           
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
//               <div className="space-y-6">
//                 {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Location</span>
//                     <p className={valueClass}>{vacancy?.location[0]}</p>
//                   </div>
//                 </div> */}

//                 {/* SHOWING COMPANY CONTACT FROM NEW API */}
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Phone size={20}/></div>
//                   <div>
//                     <span className={labelClass}>Contact Person Number</span>
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

//                 {/* --- STATUS PROTOCOL NODE --- */}
// {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
      
//       <div className={`h-2 w-2 rounded-full animate-pulse ${
//         vacancy?.status === 'open' ? 'bg-emerald-500' : 
//         vacancy?.status === 'closed' ? 'bg-red-500' : 
//         'bg-orange-400'
//       }`} /> 
      
//       {vacancy?.status ? vacancy.status.replace('_', ' ') : 'N/A'}
//     </div>
//   </div>
// </div> */}
//               </div>

//               <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group shadow-lg shadow-blue-200">
//                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                  {/* <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p> */}
//                   <p className="text-xl font-black text-white tracking-tight relative z-10">
//                     {formatEnterpriseDate(vacancy?.deadline_date)}
//                   </p>
//               </div>
//             </div>
//           </div>

//         </div>
//         <div>
// {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[3rem]  p-8 shadow-sm relative overflow-hidden">
      
//       {/* Header Info */}
//       {/* <div className="flex items-center justify-between mb-8 relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>
//         <div className="flex items-center gap-4">
//            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
//              {metricData.length} Records
//            </span>
//            <button onClick={() => setActiveMetricTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//              <X size={20} />
//            </button>
//         </div>
//       </div> */}
//       {/* 🟢 HEADER HUB: TITLE + SEARCH + COUNT */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           {/* SEARCH NODE */}
//           <div className="relative group flex-1 max-w-[280px]">
//             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//               <Search size={14} strokeWidth={3} />
//             </div>
//             <input 
//               type="text"
//               placeholder="Filter by name..."
//               value={registrySearch}
//               onChange={(e) => setRegistrySearch(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
//             />
//             {registrySearch && (
//               <button onClick={() => setRegistrySearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
//                 <X size={12} strokeWidth={3} />
//               </button>
//             )}
//           </div>

//           <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
//             {filteredResults.length} Found
//           </span>

//           <button onClick={() => { setActiveMetricTab(null); setRegistrySearch(""); }} className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-90">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
//             {currentCandidates.map((c) => (
//                /* ... YOUR EXISTING CANDIDATE CARD JSX ... */
//                 <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
//   {/* LEFT SIDE: SECURE CONTACT NODE */}
//   <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      
//       {/* 🛡️ SECURITY LOGIC: The real number is NOT in the HTML until revealedNumbers[c.id] is true */}
//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">
    
//     {/* VIEW NUMBER TOGGLE */}
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
//       {/* {revealedNumbers[c.id] ? (
//         <> <X size={14} strokeWidth={3} /> Hide Number </>
//       ) : (
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
//       )} */}
      
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
     
//     </button>

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             ))}
//           </div>

//           {/* 🟢 ENTERPRISE PAGINATION CONTROLS */}
//           {/* {totalCandidatePages > 1 && (
//             <div className="flex items-center justify-between pt-8 border-t border-slate-100">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                 Showing {indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)} of {metricData.length} entries
//               </p>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={candidatePage === 1}
//                   onClick={() => setCandidatePage(p => p - 1)}
//                   className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-30 transition-all active:scale-90"
//                 >
//                   <ChevronLeft size={18} strokeWidth={3} />
//                 </button>

//                 <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
//                   {[...Array(totalCandidatePages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setCandidatePage(i + 1)}
//                       className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black transition-all ${
//                         candidatePage === i + 1 
//                           ? "bg-white text-blue-600 shadow-sm border border-blue-100 scale-105" 
//                           : "text-slate-400 hover:text-slate-600"
//                       }`}
//                     >
//                       {(i + 1).toString().padStart(2, '0')}
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   disabled={candidatePage === totalCandidatePages}
//                   onClick={() => setCandidatePage(p => p + 1)}
//                   className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-30 transition-all active:scale-90"
//                 >
//                   <ChevronRight size={18} strokeWidth={3} />
//                 </button>
//               </div>
//             </div>
//           )} */}

//       {/* 🟢 ENTERPRISE REGISTRY PAGINATION BAR */}
// {totalCandidatePages > 1 && (
//   <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
    
//     {/* LEFT SIDE: Technical Registry Info */}
//     <div className="flex items-center gap-4">
//       <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//         <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//           Showing <span className="text-slate-900">{indexOfFirstCandidate + 1} - {Math.min(indexOfLastCandidate, metricData.length)}</span> 
//           <span className="mx-2 opacity-30">|</span> 
//           Total <span className="text-slate-900">{metricData.length}</span> Entries
//         </p>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Navigation Controls */}
//     <div className="flex items-center gap-3">
//       {/* Previous Page Arrow */}
//       <button
//         disabled={candidatePage === 1}
//         onClick={() => setCandidatePage(p => p - 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronLeft size={18} strokeWidth={3} />
//       </button>

//       {/* Truncated Number Strip */}
//       <div className="flex items-center bg-slate-100/50 p-1 rounded-[1rem] border border-slate-200 shadow-inner">
//         {getPaginationGroup().map((item, index) => (
//           <React.Fragment key={index}>
//             {item === "..." ? (
//               <div className="w-8 flex items-center justify-center">
//                 <span className="text-[10px] font-black !text-slate-300 tracking-tighter">•••</span>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setCandidatePage(item)}
//                 className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black !bg-transparent uppercase transition-all duration-300 ${
//                   candidatePage === item
//                     ? "!bg-white !text-blue-600 shadow-md border !border-blue-100 scale-105 z-10"
//                     : "!text-slate-400 hover:!text-slate-600 hover:!bg-white/50"
//                 }`}
//               >
//                 {item.toString().padStart(2, "0")}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Next Page Arrow */}
//       <button
//         disabled={candidatePage === totalCandidatePages}
//         onClick={() => setCandidatePage(p => p + 1)}
//         className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
//       >
//         <ChevronRight size={18} strokeWidth={3} />
//       </button>
//     </div>
//   </div>
// )}
//         </div>
//       )}
//     </div>
//   </div>
// )}


// <div className="space-y-4 pb-10 mt-10">
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
//*********************************************working code phase 2 28/02/26************************************************************ */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   FileText,
//   GraduationCap,
//   Activity ,
//   Languages,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft, 
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
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
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null); // New state for Company data
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null); // 'responses', 'leads', 'database'
// const [metricData, setMetricData] = useState([]);
// const [loadingMetrics, setLoadingMetrics] = useState(false);

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

//   useEffect(() => {
//   const fetchAllDetails = async () => {
//     setLoading(true);
//     try {
//       // Existing Vacancy Fetch
//       const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//       if (!vacRes.ok) throw new Error("Vacancy node not found");
//       const vacData = await vacRes.json();
//       setVacancy(vacData);

//       // --- NEW: FETCH METRICS ---
//       const [resResp, resLeads, resDb] = await Promise.all([
//         fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates`)
//       ]);
      
//       const [dataResp, dataLeads, dataDb] = await Promise.all([
//         resResp.json(), resLeads.json(), resDb.json()
//       ]);

//       setMetrics({
//         responses: dataResp.length || 0,
//         leads: dataLeads.length || 0,
//         database: dataDb.length || 0
//       });

//       // (Keep your existing JD and Company fetch logic here...)
//       if (vacData.job_description) {
//          const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//          const jdData = await jdRes.json();
//          setJobDescription(jdData);
//       }

//       if (vacData.company?.id) {
//         const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//         const compListData = await compRes.json();
//         const matchedCompany = compListData.find(c => c.id === vacData.company.id);
//         if (matchedCompany) setCompany(matchedCompany);
//       }

//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchAllDetails();
// }, [id]);


// const handleTabClick = async (tabType) => {
//   // Toggle off if clicking the same tab
//   if (activeMetricTab === tabType) {
//     setActiveMetricTab(null);
//     return;
//   }

//   setActiveMetricTab(tabType);
//   setLoadingMetrics(true);
  
//   try {
//     let url = "";
//     if (tabType === 'responses') url = `https://apihrr.goelectronix.co.in/candidates?status=jd_sent`;
//     else if (tabType === 'leads') url = `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`;
//     else url = `https://apihrr.goelectronix.co.in/candidates`;

//     const res = await fetch(url);
//     const data = await res.json();
//     setMetricData(data);
//   } catch (err) {
//     toast.error("Failed to sync registry data");
//   } finally {
//     setLoadingMetrics(false);
//   }
// };

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

// // const MetricTab = ({ icon: Icon, label, count, isActive, onClick, colorClass, iconBg }) => (
// //   <button
// //     onClick={onClick}
// //     className={`flex-1 flex items-center justify-between p-2 rounded-[1.5rem] transition-all duration-300 border-2 ${
// //       isActive
// //         ? "!bg-white !border-blue-600 shadow-lg !shadow-blue-100/50 scale-[1.02] z-10"
// //         : "!bg-white !border-slate-100 !text-slate-400 hover:!border-blue-200 hover:!text-blue-600"
// //     }`}
// //   >
// //     <div className="flex items-center gap-4 ml-2">
// //       {/* Branding Box for Icon */}
// //       <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
// //         isActive ? "!bg-blue-50 !text-blue-600" : "!bg-slate-50 !text-slate-400"
// //       }`}>
// //         <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
// //       </div>

// //       <div className="flex flex-col items-start text-left">
// //         <span className={`text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 ${
// //           isActive ? "!text-blue-600/60" : "!text-slate-400"
// //         }`}>
// //           {label}
// //         </span>
// //         <div className="flex items-center gap-2">
// //           <span className={`text-xl font-black leading-none ${
// //             isActive ? '!text-blue-600' : '!text-slate-600'
// //           }`}>
// //             {count.toString().padStart(2, '0')}
// //           </span>
// //           {isActive && (
// //             <div className="flex gap-1">
// //               <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
// //               <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>

// //     {/* Interaction Arrow */}
// //     <div className={`mr-2 p-2 rounded-lg transition-all ${
// //       isActive ? 'bg-blue-50 text-blue-600' : 'opacity-0'
// //     }`}>
// //        <ChevronRight size={16} strokeWidth={3} />
// //     </div>
// //   </button>
// // );


// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg }) => (
//   <button
//     onClick={onClick}
//     className="flex-1 flex !bg-transparent items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 !border-slate-200 hover:!border-blue-600 hover:shadow-lg hover:shadow-blue-100 bg-white group active:scale-[0.98]"
//   >
//     <div className="flex items-center gap-4">
//       {/* Icon Branding Box */}
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>

//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
//           {label}
//         </span>
//         <div className="flex items-center gap-2">
//           <span className="text-2xl font-black leading-none !text-slate-900 group-hover:!text-blue-600 transition-colors">
//             {count.toString().padStart(2, '0')}
//           </span>
//           <div className="h-1.5 w-1.5 rounded-full !bg-slate-200 group-hover:!bg-blue-600 animate-pulse" />
//         </div>
//       </div>
//     </div>
//     <div className="p-2 rounded-lg !bg-slate-50 !text-slate-300 group-hover:!bg-blue-50 group-hover:!text-blue-600 transition-all">
//        <ChevronRight size={18} strokeWidth={3} />
//     </div>
//   </button>
// );

// const toggleNumberReveal = (candidateId) => {
//   setRevealedNumbers(prev => ({
//     ...prev,
//     [candidateId]: !prev[candidateId]
//   }));
// };



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
//        {/* --- ENTERPRISE REGISTRY NAVIGATOR --- */}

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


            
//             {/* <section className="relative overflow-hidden p-8 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_50px_rgba(37,99,235,0.04)]">
 
//   <ShieldCheck 
//     className="absolute -right-8 -bottom-8 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" 
//     size={200} 
//   />

//   <div className="relative z-10 space-y-8">

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

 
//     <div className="flex flex-wrap items-center gap-4 pt-4">
    
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
// </section> */}


// <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6">
//         <div className="flex items-center gap-5">
//           <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] border border-blue-100 shadow-sm">
//             <Building2 size={32} strokeWidth={2.5} />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] leading-none mb-2">
//               Hiring Organization
//             </span>
//             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
//               {company?.name || vacancy?.company?.name}
//             </h2>
//           </div>
//         </div>
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//       {/* QUICK STATUS CHIP */}
//       {/* <div className="flex flex-col items-end gap-2">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Status</span>
//         <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 shadow-inner">
//           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
//           <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
//             {vacancy?.status || "Active"}
//           </span>
//         </div>
//       </div> */}
//     </div>

//     {/* MIDDLE ROW: The Big 3 Tabs */}
//     {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//       <MetricTab 
//         icon={Users} 
//         label="Responses" 
//         count={metrics.responses} 
//         iconBg="bg-blue-50"
//         colorClass="text-blue-600"
//         onClick={() => navigate(`/candidatefilter?status=jd_sent`)}
//       />
//       <MetricTab 
//         icon={Zap} 
//         label="Hot Leads" 
//         count={metrics.leads} 
//         iconBg="bg-orange-50"
//         colorClass="text-orange-500"
//         onClick={() => navigate(`/candidatefilter?vacancy_id=${id}`)}
//       />
//       <MetricTab 
//         icon={ShieldCheck} 
//         label="Candidate" 
//         count={metrics.database} 
//         iconBg="bg-slate-50"
//         colorClass="text-slate-600"
//         onClick={() => navigate(`/candidatefilter`)}
//       />
//     </div> */}

//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "Base", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
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


// {/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
// {/* {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[2.5rem] border-2 border-blue-600 p-8 shadow-xl">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
//             <Activity size={20} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//             {activeMetricTab} Registry Results
//           </h3>
//         </div>
//         <button 
//           onClick={() => setActiveMetricTab(null)}
//           className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-20 flex flex-col items-center gap-3">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Processing Registry Query...</p>
//         </div>
//       ) : metricData.length > 0 ? (
//         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//           {metricData.map((cand) => (
//             <div key={cand.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-300 transition-all">
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[12px] font-black text-blue-600 border border-slate-200 uppercase">
//                   {(cand.full_name || cand.name || "U").charAt(0)}
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-black text-slate-900 uppercase">{cand.full_name || cand.name}</h4>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
//                       <Briefcase size={10} /> {cand.total_experience_years || cand.experience || 0} Years
//                     </span>
//                     <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
//                       <MapPin size={10} /> {cand.city || "Remote"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => navigate(`/profile/${cand.id}`)}
//                 className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-xl group-hover:border-blue-600 group-hover:text-blue-600 transition-all shadow-sm"
//               >
//                 View Profile
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="py-20 flex flex-col items-center text-center">
//           <ShieldCheck size={48} className="text-slate-200 mb-4" />
//           <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">No matching records in registry</p>
//         </div>
//       )}
//     </div>
//   </div>
// )} */}


// {/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
// {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[3rem] border-2 border-blue-600 p-8 shadow-2xl relative overflow-hidden">
      
//       {/* Header Info */}
//       <div className="flex items-center justify-between mb-8 relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>
//         <button onClick={() => setActiveMetricTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
//           {metricData.map((c) => (
//             /* --- EXACT CANDIDATE CARD DESIGN START --- */
//             <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       {/* <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Experience</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.total_experience_years}</span>
//                       </div> */}
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
  
//     <div className="space-y-4">
//       <div className="flex items-center gap-3">
//         <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
//           <Briefcase size={14} strokeWidth={3} />
//         </div>
//         <div>
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Job</p>
//           <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[180px]">
//             {c.latest_job_title || "Looking for Opportunity"}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
//           <Calendar size={14} strokeWidth={3} />
//         </div>
//         <div>
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Candidate Age</p>
//           <p className="text-[12px] font-black text-slate-700 uppercase">
//             {c.age || "Not Specified"} Years Old
//           </p>
//         </div>
//       </div>
//     </div>

  
//     <div className="space-y-2">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Spoken Language</p>
//       <div className="flex flex-wrap gap-1.5">
//         {(c.languages_spoken || []).length > 0 ? (
//            c.languages_spoken.map((lang, idx) => (
//             <span key={idx} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm">
//               {lang}
//             </span>
//           ))
//         ) : (
//           <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Specified</span>
//         )}
//       </div>
//     </div>
//   </div> */}

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 3: LANGUAGES HUB */}
//   {/* <div className="space-y-2 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Spoken Language</p>
//     <div className="flex flex-wrap gap-1.5">
//       {(c.languages_spoken || []).length > 0 ? (
//         c.languages_spoken.map((lang, idx) => (
//           <span key={idx} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all hover:border-blue-300">
//             {lang}
//           </span>
//         ))
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Specified</span>
//       )}
//     </div>
//   </div> */}
//   {/* COLUMN 3: LANGUAGES HUB */}
// {/* <div className="space-y-2 border-l border-slate-200/50 pl-2 lg:pl-6">
// <div className="flex items-center gap-2 mb-2">
//     <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100 shadow-sm shrink-0">
//       <Languages size={12} strokeWidth={2.5} />
//     </div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
//       Spoken Language
//     </p>
//   </div>
//   <div className="flex flex-wrap gap-1.5 items-center">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
   
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

      
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Specified</span>
//     )}
//   </div>
// </div> */}

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* SKILLS REGISTRY - FULL WIDTH */}
//   {/* <div className="pt-4 border-t border-slate-200/50">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Technical Stack</p>
//     <div className="flex flex-wrap gap-1.5">
//       {(c.skills || []).map((skill, idx) => (
//         <span 
//           key={idx} 
//           className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100"
//         >
//           {skill}
//         </span>
//       ))}
//       {(!c.skills || c.skills.length === 0) && (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills Committed</span>
//       )}
//     </div>
//   </div> */}

//   {/* INDUSTRIES HUB */}
//   {/* {c.industries_worked && c.industries_worked.length > 0 && (
//     <div className="pt-2">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sector Experience</p>
//       <div className="flex flex-wrap gap-3">
//         {c.industries_worked.map((ind, idx) => (
//           <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm">
//             <Layers size={10} strokeWidth={3} />
//             <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )} */}

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
//   {/* LEFT SIDE: SECURE CONTACT NODE */}
//   <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      
//       {/* 🛡️ SECURITY LOGIC: The real number is NOT in the HTML until revealedNumbers[c.id] is true */}
//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">
    
//     {/* VIEW NUMBER TOGGLE */}
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
//       {revealedNumbers[c.id] ? (
//         <> <X size={14} strokeWidth={3} /> Hide Number </>
//       ) : (
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
//       )}
//     </button>

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             /* --- EXACT CANDIDATE CARD DESIGN END --- */
//           ))}
//         </div>
//       )}
//     </div>
//   </div>
// )}


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
//                     <span className={labelClass}>Contact Person Number</span>
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
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                  <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
//               </div>

//               {/* <button className="w-full bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all active:scale-95">
//                 Apply for this job
//               </button> */}
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
//****************************************************workking code phase 4 28/02/26******************************************************* */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   Briefcase, 
//   MapPin, 
//   Clock, 
//   Users, 
//   IndianRupee, 
//   FileText,
//   GraduationCap,
//   Activity ,
//   Languages,
//   ChevronRight,
//   Zap,
//   X,
//   ChevronLeft, 
//   ChevronDown,
//   ShieldCheck,
//   Layers,
//   Calendar,
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
//   const [revealedNumbers, setRevealedNumbers] = useState({});
//   const [jobDescription, setJobDescription] = useState(null);
//   const [company, setCompany] = useState(null); // New state for Company data
//   const [metrics, setMetrics] = useState({ responses: 0, leads: 0, database: 0 });
//   const [activeMetricTab, setActiveMetricTab] = useState(null); // 'responses', 'leads', 'database'
// const [metricData, setMetricData] = useState([]);
// const [loadingMetrics, setLoadingMetrics] = useState(false);

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

//   useEffect(() => {
//   const fetchAllDetails = async () => {
//     setLoading(true);
//     try {
//       // Existing Vacancy Fetch
//       const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//       if (!vacRes.ok) throw new Error("Vacancy node not found");
//       const vacData = await vacRes.json();
//       setVacancy(vacData);

//       // --- NEW: FETCH METRICS ---
//       const [resResp, resLeads, resDb] = await Promise.all([
//         fetch(`https://apihrr.goelectronix.co.in/candidates?status=jd_sent`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`),
//         fetch(`https://apihrr.goelectronix.co.in/candidates`)
//       ]);
      
//       const [dataResp, dataLeads, dataDb] = await Promise.all([
//         resResp.json(), resLeads.json(), resDb.json()
//       ]);

//       setMetrics({
//         responses: dataResp.length || 0,
//         leads: dataLeads.length || 0,
//         database: dataDb.length || 0
//       });

//       // (Keep your existing JD and Company fetch logic here...)
//       if (vacData.job_description) {
//          const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description.id}`);
//          const jdData = await jdRes.json();
//          setJobDescription(jdData);
//       }

//       if (vacData.company?.id) {
//         const compRes = await fetch(`https://apihrr.goelectronix.co.in/companies`);
//         const compListData = await compRes.json();
//         const matchedCompany = compListData.find(c => c.id === vacData.company.id);
//         if (matchedCompany) setCompany(matchedCompany);
//       }

//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchAllDetails();
// }, [id]);


// const handleTabClick = async (tabType) => {
//   // Toggle off if clicking the same tab
//   if (activeMetricTab === tabType) {
//     setActiveMetricTab(null);
//     return;
//   }

//   setActiveMetricTab(tabType);
//   setLoadingMetrics(true);
  
//   try {
//     let url = "";
//     if (tabType === 'responses') url = `https://apihrr.goelectronix.co.in/candidates?status=jd_sent`;
//     else if (tabType === 'leads') url = `https://apihrr.goelectronix.co.in/candidates?vacancy_id=${id}`;
//     else url = `https://apihrr.goelectronix.co.in/candidates`;

//     const res = await fetch(url);
//     const data = await res.json();
//     setMetricData(data);
//   } catch (err) {
//     toast.error("Failed to sync registry data");
//   } finally {
//     setLoadingMetrics(false);
//   }
// };

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

// // const MetricTab = ({ icon: Icon, label, count, isActive, onClick, colorClass, iconBg }) => (
// //   <button
// //     onClick={onClick}
// //     className={`flex-1 flex items-center justify-between p-2 rounded-[1.5rem] transition-all duration-300 border-2 ${
// //       isActive
// //         ? "!bg-white !border-blue-600 shadow-lg !shadow-blue-100/50 scale-[1.02] z-10"
// //         : "!bg-white !border-slate-100 !text-slate-400 hover:!border-blue-200 hover:!text-blue-600"
// //     }`}
// //   >
// //     <div className="flex items-center gap-4 ml-2">
// //       {/* Branding Box for Icon */}
// //       <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
// //         isActive ? "!bg-blue-50 !text-blue-600" : "!bg-slate-50 !text-slate-400"
// //       }`}>
// //         <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
// //       </div>

// //       <div className="flex flex-col items-start text-left">
// //         <span className={`text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 ${
// //           isActive ? "!text-blue-600/60" : "!text-slate-400"
// //         }`}>
// //           {label}
// //         </span>
// //         <div className="flex items-center gap-2">
// //           <span className={`text-xl font-black leading-none ${
// //             isActive ? '!text-blue-600' : '!text-slate-600'
// //           }`}>
// //             {count.toString().padStart(2, '0')}
// //           </span>
// //           {isActive && (
// //             <div className="flex gap-1">
// //               <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
// //               <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>

// //     {/* Interaction Arrow */}
// //     <div className={`mr-2 p-2 rounded-lg transition-all ${
// //       isActive ? 'bg-blue-50 text-blue-600' : 'opacity-0'
// //     }`}>
// //        <ChevronRight size={16} strokeWidth={3} />
// //     </div>
// //   </button>
// // );


// const MetricTab = ({ icon: Icon, label, count, onClick, colorClass, iconBg }) => (
//   <button
//     onClick={onClick}
//     className="flex-1 flex !bg-transparent items-center justify-between p-3 rounded-2xl transition-all duration-300 border-2 !border-slate-200 hover:!border-blue-600 hover:shadow-lg hover:shadow-blue-100 bg-white group active:scale-[0.98]"
//   >
//     <div className="flex items-center gap-4">
//       {/* Icon Branding Box */}
//       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${iconBg} group-hover:scale-110`}>
//         <Icon size={22} className={colorClass} strokeWidth={2.5} />
//       </div>

//       <div className="flex flex-col items-start text-left">
//         <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2 text-slate-400 group-hover:text-blue-600/60 transition-colors">
//           {label}
//         </span>
//         <div className="flex items-center gap-2">
//           <span className="text-2xl font-black leading-none !text-slate-900 group-hover:!text-blue-600 transition-colors">
//             {count.toString().padStart(2, '0')}
//           </span>
//           <div className="h-1.5 w-1.5 rounded-full !bg-slate-200 group-hover:!bg-blue-600 animate-pulse" />
//         </div>
//       </div>
//     </div>
//     <div className="p-2 rounded-lg !bg-slate-50 !text-slate-300 group-hover:!bg-blue-50 group-hover:!text-blue-600 transition-all">
//        <ChevronRight size={18} strokeWidth={3} />
//     </div>
//   </button>
// );

// const toggleNumberReveal = (candidateId) => {
//   setRevealedNumbers(prev => ({
//     ...prev,
//     [candidateId]: !prev[candidateId]
//   }));
// };



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
//        {/* --- ENTERPRISE REGISTRY NAVIGATOR --- */}

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


            
//             {/* <section className="relative overflow-hidden p-8 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_50px_rgba(37,99,235,0.04)]">
 
//   <ShieldCheck 
//     className="absolute -right-8 -bottom-8 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" 
//     size={200} 
//   />

//   <div className="relative z-10 space-y-8">

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

 
//     <div className="flex flex-wrap items-center gap-4 pt-4">
    
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
// </section> */}


// <section className="relative overflow-hidden p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]">
//   {/* Security Watermark */}
//   <ShieldCheck 
//     className="absolute -right-12 -top-12 text-blue-600 opacity-[0.02] -rotate-12 pointer-events-none" 
//     size={320} 
//   />

//   <div className="relative z-10 flex flex-col gap-10">
//     {/* TOP ROW: Organization & Title */}
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//       <div className="space-y-6">
//         <div className="flex items-center gap-5">
//           <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] border border-blue-100 shadow-sm">
//             <Building2 size={32} strokeWidth={2.5} />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] leading-none mb-2">
//               Hiring Organization
//             </span>
//             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
//               {company?.name || vacancy?.company?.name}
//             </h2>
//           </div>
//         </div>
        
//         <div>
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Position</span>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase mt-2">
//             {vacancy?.title}
//           </h1>
//         </div>
//       </div>

//       {/* QUICK STATUS CHIP */}
//       {/* <div className="flex flex-col items-end gap-2">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Status</span>
//         <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 shadow-inner">
//           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
//           <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
//             {vacancy?.status || "Active"}
//           </span>
//         </div>
//       </div> */}
//     </div>

//     {/* MIDDLE ROW: The Big 3 Tabs */}
//     {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//       <MetricTab 
//         icon={Users} 
//         label="Responses" 
//         count={metrics.responses} 
//         iconBg="bg-blue-50"
//         colorClass="text-blue-600"
//         onClick={() => navigate(`/candidatefilter?status=jd_sent`)}
//       />
//       <MetricTab 
//         icon={Zap} 
//         label="Hot Leads" 
//         count={metrics.leads} 
//         iconBg="bg-orange-50"
//         colorClass="text-orange-500"
//         onClick={() => navigate(`/candidatefilter?vacancy_id=${id}`)}
//       />
//       <MetricTab 
//         icon={ShieldCheck} 
//         label="Candidate" 
//         count={metrics.database} 
//         iconBg="bg-slate-50"
//         colorClass="text-slate-600"
//         onClick={() => navigate(`/candidatefilter`)}
//       />
//     </div> */}

//     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//   <MetricTab 
//     icon={Users} 
//     label="Responses" 
//     count={metrics.responses} 
//     isActive={activeMetricTab === 'responses'}
//     iconBg="bg-blue-50"
//     colorClass="text-blue-600"
//     onClick={() => handleTabClick('responses')}
//   />
//   <MetricTab 
//     icon={Zap} 
//     label="Hot Leads" 
//     count={metrics.leads} 
//     isActive={activeMetricTab === 'leads'}
//     iconBg="bg-orange-50"
//     colorClass="text-orange-500"
//     onClick={() => handleTabClick('leads')}
//   />
//   <MetricTab 
//     icon={ShieldCheck} 
//     label="Candidate" 
//     count={metrics.database} 
//     isActive={activeMetricTab === 'database'}
//     iconBg="bg-slate-50"
//     colorClass="text-slate-600"
//     onClick={() => handleTabClick('database')}
//   />
// </div>

//     {/* BOTTOM ROW: Core Protocol Summary */}
//     <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
//       {[
//         { icon: <Briefcase size={14}/>, label: "Type", value: vacancy?.job_type },
//         { icon: <Clock size={14}/>, label: "Experience", value: `${vacancy?.min_experience}-${vacancy?.max_experience}Y` },
//         { icon: <IndianRupee size={14}/>, label: "CTC", value: `${vacancy?.min_salary}-${vacancy?.max_salary} LPA` },
//         { icon: <MapPin size={14}/>, label: "Base", value: vacancy?.location[0] }
//       ].map((item, idx) => (
//         <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
//           <div className="text-blue-600">{item.icon}</div>
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
//             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.value}</span>
//           </div>
//         </div>
//       ))}
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


// {/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
// {/* {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[2.5rem] border-2 border-blue-600 p-8 shadow-xl">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
//             <Activity size={20} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//             {activeMetricTab} Registry Results
//           </h3>
//         </div>
//         <button 
//           onClick={() => setActiveMetricTab(null)}
//           className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-20 flex flex-col items-center gap-3">
//           <Loader2 className="animate-spin text-blue-600" size={32} />
//           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Processing Registry Query...</p>
//         </div>
//       ) : metricData.length > 0 ? (
//         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//           {metricData.map((cand) => (
//             <div key={cand.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-300 transition-all">
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[12px] font-black text-blue-600 border border-slate-200 uppercase">
//                   {(cand.full_name || cand.name || "U").charAt(0)}
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-black text-slate-900 uppercase">{cand.full_name || cand.name}</h4>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
//                       <Briefcase size={10} /> {cand.total_experience_years || cand.experience || 0} Years
//                     </span>
//                     <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
//                       <MapPin size={10} /> {cand.city || "Remote"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => navigate(`/profile/${cand.id}`)}
//                 className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-xl group-hover:border-blue-600 group-hover:text-blue-600 transition-all shadow-sm"
//               >
//                 View Profile
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="py-20 flex flex-col items-center text-center">
//           <ShieldCheck size={48} className="text-slate-200 mb-4" />
//           <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">No matching records in registry</p>
//         </div>
//       )}
//     </div>
//   </div>
// )} */}


// {/* --- DYNAMIC REGISTRY LIST ACCORDION --- */}
// {activeMetricTab && (
//   <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
//     <div className="bg-white rounded-[3rem] border-2 border-blue-600 p-8 shadow-2xl relative overflow-hidden">
      
//       {/* Header Info */}
//       <div className="flex items-center justify-between mb-8 relative z-10">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
//             <Activity size={20} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//             {activeMetricTab} Candidate
//           </h3>
//         </div>
//         <button onClick={() => setActiveMetricTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
//       </div>

//       {loadingMetrics ? (
//         <div className="py-32 flex flex-col items-center justify-center animate-pulse">
//           <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</p>
//         </div>
//       ) : (
//         <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
//           {metricData.map((c) => (
//             /* --- EXACT CANDIDATE CARD DESIGN START --- */
//             <div
//               key={c.id}
//               className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
//             >
//               {/* Security Watermark Anchor */}
//               <ShieldCheck
//                 className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors"
//                 size={150}
//               />

//               <div className="relative z-10 space-y-6">
//                 {/* TOP SECTION: IDENTITY */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase ring-4 ring-white">
//                       {(c.full_name || "U").charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-tight">
//                         {c.full_name?.toLowerCase()}
//                       </h3>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                         {c.age || "Not Specified"} • {c.gender || "Not Specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MIDDLE SECTION: CORE METADATA STRIP */}
//                 <div className="space-y-4 pl-1">
//                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-2 border-t border-slate-50 pt-4">
//                     {/* EXPERIENCE NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <Briefcase size={18} strokeWidth={2.5} />
//                       </div>
//                       {/* <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Experience</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.total_experience_years}</span>
//                       </div> */}
//                       <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">
//     Experience
//   </span>
//   <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
//     {/* Logic: if total_experience_years is 0, null, or '0', show FRESHER, else show the value */}
//     {parseFloat(c.total_experience_years) === 0 ? "Fresher" : `${c.total_experience_years} Years`}
//   </span>
// </div>
//                     </div>

//                     {/* LOCATION NODE */}
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <MapPin size={18} strokeWidth={2.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Location</span>
//                         <span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{c.location || "Not Specified"}</span>
//                       </div>
//                     </div>

//                     {/* SALARY NODE */}
//                     <div className="flex items-center gap-3 min-w-[140px]">
//                       <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 text-blue-600 shadow-sm">
//                         <span className="text-[16px] font-black leading-none">₹</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none mb-1">Prev. CTC</span>
//                         <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
//                           {c.previous_ctc ? `${(c.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 🟢 RELEVANT INTELLIGENCE SECTION */}
// <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 ml-1 space-y-5 relative overflow-hidden transition-all duration-300">
//   {/* Vertical System Accent */}
//   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40" />

//   {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
  
//     <div className="space-y-4">
//       <div className="flex items-center gap-3">
//         <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
//           <Briefcase size={14} strokeWidth={3} />
//         </div>
//         <div>
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Job</p>
//           <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[180px]">
//             {c.latest_job_title || "Looking for Opportunity"}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
//           <Calendar size={14} strokeWidth={3} />
//         </div>
//         <div>
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Candidate Age</p>
//           <p className="text-[12px] font-black text-slate-700 uppercase">
//             {c.age || "Not Specified"} Years Old
//           </p>
//         </div>
//       </div>
//     </div>

  
//     <div className="space-y-2">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Spoken Language</p>
//       <div className="flex flex-wrap gap-1.5">
//         {(c.languages_spoken || []).length > 0 ? (
//            c.languages_spoken.map((lang, idx) => (
//             <span key={idx} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm">
//               {lang}
//             </span>
//           ))
//         ) : (
//           <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Specified</span>
//         )}
//       </div>
//     </div>
//   </div> */}

//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//   {/* COLUMN 1: CURRENT JOB */}
//   <div className="flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <Briefcase size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Current Job</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase truncate max-w-[140px]">
//         {c.latest_job_title || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 2: CANDIDATE AGE */}
//   <div className="flex items-center gap-3 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 shrink-0">
//       <GraduationCap size={14} strokeWidth={3} />
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Eduction</p>
//       <p className="text-[12px] font-black text-slate-700 uppercase">
//         {c.latest_education || "Not Specified"}
//       </p>
//     </div>
//   </div>

//   {/* COLUMN 3: LANGUAGES HUB */}
//   {/* <div className="space-y-2 border-l border-slate-200/50 pl-2 lg:pl-6">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Spoken Language</p>
//     <div className="flex flex-wrap gap-1.5">
//       {(c.languages_spoken || []).length > 0 ? (
//         c.languages_spoken.map((lang, idx) => (
//           <span key={idx} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all hover:border-blue-300">
//             {lang}
//           </span>
//         ))
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Specified</span>
//       )}
//     </div>
//   </div> */}
//   {/* COLUMN 3: LANGUAGES HUB */}
// {/* <div className="space-y-2 border-l border-slate-200/50 pl-2 lg:pl-6">
// <div className="flex items-center gap-2 mb-2">
//     <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100 shadow-sm shrink-0">
//       <Languages size={12} strokeWidth={2.5} />
//     </div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
//       Spoken Language
//     </p>
//   </div>
//   <div className="flex flex-wrap gap-1.5 items-center">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
   
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

      
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Specified</span>
//     )}
//   </div>
// </div> */}

// {/* COLUMN 3: LANGUAGES HUB */}
// <div className="space-y-3 border-l border-slate-200/50 pl-2 lg:pl-6">
  
//   {/* 🟢 ALIGNED HEADER UNIT */}
//   <div className="flex items-center gap-3">
//     {/* Branding Box - Sized to match the visual weight of the title */}
//     <div className="p-1.5 bg-white text-blue-600 rounded-lg border border-blue-50 shadow-sm shrink-0">
//       <Languages size={14} strokeWidth={2.5} />
//     </div>
    
//     {/* Heading - Vertically centered with icon */}
//     <div>
//       <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] leading-none">
//       Spoken Language
//     </p>
//       {/* 🔵 CONTENT AREA */}
//   <div className="flex flex-wrap gap-1.5 items-center pl-0.5 mt-2">
//     {(c.languages_spoken || []).length > 0 ? (
//       <>
//         {(c.isLanguagesExpanded ? c.languages_spoken : c.languages_spoken.slice(0, 2)).map((lang, idx) => (
//           <span 
//             key={idx} 
//             className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tight shadow-sm transition-all animate-in zoom-in-95 hover:border-blue-300"
//           >
//             {lang}
//           </span>
//         ))}

//         {/* TOGGLE BUTTON */}
//         {c.languages_spoken.length > 2 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMetricData(prev => prev.map(item => 
//                 item.id === c.id ? { ...item, isLanguagesExpanded: !item.isLanguagesExpanded } : item
//               ));
//             }}
//             className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//               c.isLanguagesExpanded 
//                 ? "bg-slate-800 text-white shadow-md" 
//                 : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//             }`}
//           >
//             {c.isLanguagesExpanded ? "Less" : `+${c.languages_spoken.length - 2} More`}
//           </button>
//         )}
//       </>
//     ) : (
//       <span className="text-[10px] font-bold text-slate-300 italic uppercase ml-1">
//         Not Specified
//       </span>
//     )}
//   </div>
//     </div>
//   </div>


// </div>
// </div>

//   {/* SKILLS REGISTRY - FULL WIDTH */}
//   {/* <div className="pt-4 border-t border-slate-200/50">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Technical Stack</p>
//     <div className="flex flex-wrap gap-1.5">
//       {(c.skills || []).map((skill, idx) => (
//         <span 
//           key={idx} 
//           className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100"
//         >
//           {skill}
//         </span>
//       ))}
//       {(!c.skills || c.skills.length === 0) && (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills Committed</span>
//       )}
//     </div>
//   </div> */}

//   {/* INDUSTRIES HUB */}
//   {/* {c.industries_worked && c.industries_worked.length > 0 && (
//     <div className="pt-2">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sector Experience</p>
//       <div className="flex flex-wrap gap-3">
//         {c.industries_worked.map((ind, idx) => (
//           <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm">
//             <Layers size={10} strokeWidth={3} />
//             <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )} */}

//   {/* 🟢 TECHNICAL & SECTOR INTELLIGENCE GRID */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200/50">
  
//   {/* SKILLS REGISTRY */}
//   <div className="space-y-2">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Skills</p>
//     <div className="flex flex-wrap gap-1.5 items-center">
//       {(c.skills || []).length > 0 ? (
//         <>
//           {(c.isSkillsExpanded ? c.skills : c.skills.slice(0, 2)).map((skill, idx) => (
//             <span 
//               key={idx} 
//               className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-100 animate-in zoom-in-95"
//             >
//               {skill}
//             </span>
//           ))}
//           {c.skills.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isSkillsExpanded: !item.isSkillsExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isSkillsExpanded ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
//               }`}
//             >
//               {c.isSkillsExpanded ? "Less" : `+${c.skills.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Skills</span>
//       )}
//     </div>
//   </div>

//   {/* INDUSTRIES HUB */}
//   <div className="space-y-2 border-l border-slate-100 pl-4 lg:pl-8">
//     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Industry</p>
//     <div className="flex flex-wrap gap-2 items-center">
//       {(c.industries_worked || []).length > 0 ? (
//         <>
//           {(c.isIndustriesExpanded ? c.industries_worked : c.industries_worked.slice(0, 2)).map((ind, idx) => (
//             <div key={idx} className="flex items-center gap-1.5 text-blue-600/80 bg-white border border-blue-50 px-2 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
//               <Layers size={10} strokeWidth={3} />
//               <span className="text-[9px] font-black uppercase tracking-tighter">{ind.name || ind}</span>
//             </div>
//           ))}
//           {c.industries_worked.length > 2 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMetricData(prev => prev.map(item => 
//                   item.id === c.id ? { ...item, isIndustriesExpanded: !item.isIndustriesExpanded } : item
//                 ));
//               }}
//               className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${
//                 c.isIndustriesExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//               }`}
//             >
//               {c.isIndustriesExpanded ? "Less" : `+${c.industries_worked.length - 2} More`}
//             </button>
//           )}
//         </>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Sectors</span>
//       )}
//     </div>
//   </div>

// </div>
// </div>

//                 {/* BOTTOM ACTION BAR */}
//                 {/* <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-50">
                  

//                   <div className="flex items-center gap-3 w-full sm:w-auto">
//                     <button
//                       onClick={() => navigate(`/profile/${c.id}`)}
//                       className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
//                     >
//                       <FileText size={14} /> View Registry
//                     </button>
//                   </div>
//                 </div> */}
//                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
  
//   {/* LEFT SIDE: SECURE CONTACT NODE */}
//   <div className="flex items-center gap-3">
//     <div className={`p-2 rounded-lg transition-all duration-500 ${
//       revealedNumbers[c.id] ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
//     }`}>
//       <Phone size={14} strokeWidth={2.5} />
//     </div>
    
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         Candidate Contact
//       </span>
      
//       {/* 🛡️ SECURITY LOGIC: The real number is NOT in the HTML until revealedNumbers[c.id] is true */}
//       <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">
//         {revealedNumbers[c.id] ? (
//           <span className="animate-in fade-in duration-300">
//             {c.phone || "No Data"}
//           </span>
//         ) : (
//           <span className="text-slate-300 select-none tracking-[0.3em]">
//             +91 ••••••••••
//           </span>
//         )}
//       </p>
//     </div>
//   </div>

//   {/* RIGHT SIDE: ACTIONS */}
//   <div className="flex items-center gap-3 w-full sm:w-auto">
    
//     {/* VIEW NUMBER TOGGLE */}
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         toggleNumberReveal(c.id);
//       }}
//       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 ${
//         revealedNumbers[c.id] 
//           ? "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-black hover:!border-black" 
//           : "!bg-white !border-blue-600 !text-blue-600 hover:!bg-blue-50 shadow-sm"
//       }`}
//     >
//       {revealedNumbers[c.id] ? (
//         <> <X size={14} strokeWidth={3} /> Hide Number </>
//       ) : (
//         <> <UserCheck size={14} strokeWidth={3} /> View Number </>
//       )}
//     </button>

//     <button
//   onClick={(e) => {
//     e.stopPropagation();
//     // 🟢 REDIRECT LOGIC: Navigates to the candidate profile registry
//     navigate(`/profile/${c.id}`); 
//   }}
//   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm shadow-blue-100 group"
// >
//   {/* Branding Box Icon Effect */}
//   <UserCheck size={14} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
//   View Candidate 
// </button>

   
//   </div>
// </div>
//               </div>
//             </div>
//             /* --- EXACT CANDIDATE CARD DESIGN END --- */
//           ))}
//         </div>
//       )}
//     </div>
//   </div>
// )}


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
//                     <span className={labelClass}>Contact Person Number</span>
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
//                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing Date</p>
//                  <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
//               </div>

//               {/* <button className="w-full bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all active:scale-95">
//                 Apply for this job
//               </button> */}
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