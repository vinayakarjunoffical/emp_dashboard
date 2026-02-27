import React, { useState, useMemo, useEffect } from "react";

import {
  FileSpreadsheet,
  Webhook,
  UserPlus,
  Filter,
  Search,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Upload,
  ExternalLink,
  FileWarning,
  Loader2,
  UserCog,
  Activity,
  BadgeCheck,
  Telescope,
  Terminal,
  Layers,
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
} from "lucide-react";
import { candidateService } from "../../services/candidateService";
import toast from "react-hot-toast";
import { getJobTemplates } from "../../services/jobTemplateService";
import { useNavigate, useLocation } from "react-router-dom";

const CandidateIntakeFilter = () => {
  // --- EXTENDED MOCK DATA ---
  const [candidates, setCandidates] = useState([]);

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
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [singleMailCandidate, setSingleMailCandidate] = useState(null);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [cityOptions, setCityOptions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [departments, setDepartments] = useState([]);

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

  const uniqueNormalized = (list, key, allLabel) => {
    const map = new Map();

    list.forEach((item) => {
      const raw = item[key] || "";
      const norm = normalizeText(raw);
      if (!norm) return;

      // store only first occurrence, in UPPERCASE
      if (!map.has(norm)) {
        map.set(norm, raw.toString().trim().toUpperCase());
      }
    });

    return [allLabel.toUpperCase(), ...map.values()];
  };

  const parseExperience = (val) => {
    if (val === null || val === undefined) return 0;

    // Extract only number (works for "5 yrs", "5+", "3.5", "10 Years")
    const num = parseFloat(val.toString().replace(/[^\d.]/g, ""));

    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    if (location.state?.modal) {
      setIsModalOpen(true);
    }
  }, [location.state]);

useEffect(() => {
  const fetchFilterMasters = async () => {
    try {
      const [indRes, depRes, eduRes] = await Promise.all([
        fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100"),
        fetch("https://apihrr.goelectronix.co.in/departments"),
        fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100") // 🎓 New API
      ]);

      const indData = await indRes.json();
      const depData = await depRes.json();
      const eduData = await eduRes.json();

      setIndustries(indData || []);
      setDepartments(depData || []);
      setEducationMasters(eduData || []); // Store master education list
    } catch (err) {
      console.error("Filter Master Sync Failure", err);
    }
  };
  fetchFilterMasters();
}, []);

const experienceOptions = useMemo(() => {

  if (candidates.length === 0) return ["0 YEARS", "1 YEARS", "2 YEARS", "3 YEARS", "4 YEARS", "5 YEARS"];

  const allExps = candidates.map((c) => Math.floor(parseFloat(c.total_experience_years || 0)));
  const maxExp = Math.max(...allExps, 5); 
  
  return Array.from(
    { length: maxExp + 1 },
    (_, i) => `${i} YEAR${i !== 1 ? "S" : ""}`
  );
}, [candidates]);


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
    });
  };

  const locationOptions = useMemo(() => {
    const map = new Map();

    candidates.forEach((c) => {
      const city = c.city?.trim() || "";
      const district = c.district?.trim() || "";
      const country = c.country?.trim() || "INDIA";

      // This format will be used as both the LABEL and the VALUE
      const displayLabel =
        `${city}${district ? `, ${district}` : ""}, ${country}`.toUpperCase();

      if (city && !map.has(displayLabel)) {
        map.set(displayLabel, displayLabel);
      }
    });

    return [...map.values()].sort();
  }, [candidates]);

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
    if (filters.districts.length === 0 || filters.districts.includes(candidateDist)) {
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

  const loadCandidates = async (activeFilters = filters, query = searchQuery) => {
    try {
      setLoadingCandidates(true);

      // // 1. Build Query Parameters based on your API Documentation
      // const params = new URLSearchParams();

      // 1. START with the parameters already in the URL (e.g., status=jd_sent)
    const params = new URLSearchParams(location.search);


    // --- TAB LOGIC: ROUTE TO SPECIFIC API PARAMETERS ---
   // 2. APPLY TAB-SPECIFIC PARAMETERS
    if (activeTab === "responses") {
      // Calls: ...?status=jd_sent (and keeps other existing params)
      params.set("status", "jd_sent");
      params.delete("vacancy_id"); // Ensure other tab filters don't clash
    } else if (activeTab === "hot_leads") {
      // Calls: ...?vacancy_id=2 (and keeps other existing params)
      params.set("vacancy_id", "2");
      params.delete("status"); // Ensure other tab filters don't clash
    } else if (activeTab === "all") {
      // Clean up tab-specific params if moving back to "All"
      params.delete("status");
      params.delete("vacancy_id");
    }

      // Search Query
      if (query) params.append("search", query);

      activeFilters.industries.forEach((selectedName) => {
      const match = industries.find(
        (ind) => ind.name.toUpperCase() === selectedName.toUpperCase()
      );
      if (match) {
        params.append("industry_id", match.id);
      }
    });

activeFilters.educations.forEach((eduName) => {
      params.append("education", eduName);
    });


    activeFilters.cities.forEach((c) => params.append("city", c));
    // --- NEW: DISTRICT PARAM ---
    activeFilters.districts?.forEach((d) => params.append("district", d));


   // --- Updated Experience Logic ---
// --- Updated Experience Logic ---
if (activeFilters.experiences.length > 0) {
  // 1. Extract the number (e.g., "2 YEARS" -> 2)
  const expValue = parseInt(activeFilters.experiences[0].replace(/\D/g, ""));
  
  // 2. Changed key from 'max_experience' to 'experience' as per your requirement
  // This will result in: ?experience=2
  params.append("experience", expValue); 
}


      // Multi-select Arrays (API expects ?department=Sales&department=IT)
      activeFilters.departments.forEach((d) => params.append("department", d));
    //   activeFilters.educations.forEach((e) => params.append("education", e));
      // activeFilters.cities.forEach((c) => params.append("city", c));
      activeFilters.genders.forEach((g) => params.append("gender", g));
      
      // Status mapping (ensure it matches backend lowercase expectations if necessary)
      activeFilters.statuses.forEach((s) => params.append("status", s.toLowerCase()));

      // Age Range Logic mapping to min_age and max_age
      if (activeFilters.ages.length > 0) {
        const range = activeFilters.ages[0];
        if (range === "18 - 25") { params.append("min_age", 18); params.append("max_age", 25); }
        else if (range === "26 - 35") { params.append("min_age", 26); params.append("max_age", 35); }
        else if (range === "35 - 45") { params.append("min_age", 35); params.append("max_age", 45); }
        else if (range === "45+") { params.append("min_age", 45); }
      }

      // 2. Finalize Query String
      const queryString = params.toString() ? `?${params.toString()}` : "";

      // 3. Call existing API (no changes needed to the service file)
      const data = await candidateService.getAll1(queryString);

      // 4. Transform Data (Keeping your sorting and LPA logic)
      const mapped = data.map((c) => {
        const sortedExperiences = (c.experiences || []).sort((a, b) => {
          if (!a.end_date) return -1;
          if (!b.end_date) return 1;
          return new Date(b.end_date) - new Date(a.end_date);
        });

        const latestExperience = sortedExperiences[0] || null;
        const rawCTC = c.previous_ctc ? parseFloat(c.previous_ctc) : 0;

        const sortedEducation = (c.educations || []).sort((a, b) => b.end_year - a.end_year);
        const latestEdu = sortedEducation[0] || null;
        const highestDegree = latestEdu?.education_master?.name || c.latest_education || "Not Specified";

        const totalExp = parseFloat(c.total_experience_years || 0);
        const yearsLabel = Math.floor(totalExp);
        const remainingMonths = Math.round((totalExp % 1) * 12);

        return {
          ...c,
          id: c.id,
          full_name: c.full_name,
          total_experience_years: totalExp.toFixed(1),
          experienceDisplay: yearsLabel > 0 || remainingMonths > 0 ? `${yearsLabel}y ${remainingMonths}m` : "Fresher",
          latestJobTitle: c.latest_job_title || latestExperience?.job_title || "Not Specified",
          latestCTC: rawCTC,
          highestDegree: highestDegree,
          status: c.status || "open",
          cvUrl: c.resume_path,
        };
      });


      // --- 2. INTEGRATED FINALVIEW LOGIC ---
      // This ensures that if you select "2 Years", it shows 0, 1, 1.5, and 2.
      const finalView = mapped.filter((candidate) => {
        if (activeFilters.experiences.length === 0) return true;

        const selectedMax = parseInt(activeFilters.experiences[0].replace(/\D/g, ""));
        const candidateExp = parseFloat(candidate.total_experience_years || 0);

        return candidateExp <= selectedMax;
      });

      setCandidates(mapped);
    } catch (err) {
      console.error("API FILTER ERROR:", err);
      toast.error("Failed to sync filtered data");
    } finally {
      // Small timeout to prevent flickering in the enterprise UI
      setTimeout(() => setLoadingCandidates(false), 300);
    }
  };

  useEffect(() => {
  if (candidates.length > 0) {
    setLoadingCandidates(true);
    
    // Simulate a brief network latency for the filter application
    const timer = setTimeout(() => {
      setLoadingCandidates(false);
    }, 400); 

    return () => clearTimeout(timer);
  }
}, [filters, searchQuery]); // Triggers whenever filters or search change




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
    // Removes underscores/special characters and capitalizes the first letter
    return status
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };


  const handleStatusUpdate = async (candidateId, status) => {
    // status will be 'reject' or 'hold'
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
      {/* SOURCE CONTROL HEADER */}

      {/* <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setActiveSourceModal("excel")}>
          <SourceCard
            icon={<FileSpreadsheet />}
            title="Excel Import"
            desc="Bulk upload .csv or .xlsx"
            color="emerald"
            isAction // Added isAction for hover effect
          />
        </div>

        <div onClick={() => setIsModalOpen(true)}>
          <SourceCard
            icon={<UserPlus />}
            title="Manual Entry"
            desc="Single candidate record"
            color="blue"
            isAction
          />
        </div>
      </div> */}

      {/* --- ENTERPRISE TAB NAVIGATOR --- */}
{/* --- ENTERPRISE TAB NAVIGATION --- */}
<div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit mb-8">
  {[
    { id: "all", label: "Candidate", icon: <Layers size={14} /> },
    { id: "responses", label: "Responses", icon: <Send size={14} /> },
    { id: "hot_leads", label: "Hot Leads", icon: <Zap size={14} /> },
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2.5 px-6 py-2 rounded-xl !bg-transparent text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
        activeTab === tab.id
          ? "!bg-white !text-blue-600 shadow-sm "
          : "!text-slate-800 !hover:text-slate-800 hover:!bg-slate-200/50"
      }`}
    >
      {tab.icon}
      {tab.label}
    </button>
  ))}
</div>

      {/* --- ENTERPRISE FILTER BAR --- */}

      <div className="mb-8 space-y-4">
        {/* 1. SELECTION BAR */}
        <div className="flex-wrap items-center gap-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-slate-100 mb-5">
            <Filter size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Add Filters
            </span>
          </div>

          {/* Responsive Grid: 4 columns on large screens, 2 on tablets, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            {/* GROUP 1: CORE PROFESSIONAL (Order 1, 2) */}

            {/* GROUP 1: CORE PROFESSIONAL */}
            <FilterDropdown
              label="Experience (Years)"
              options={useMemo(() => {
                // 1. Get all numeric experience values
                const allExps = candidates.map((c) =>
                  Math.floor(parseFloat(c.total_experience_years || 0)),
                );
                // 2. Find the maximum
                const maxExp = Math.max(...allExps, 5); // Default to at least 5
                // 3. Create array [0, 1, 2, 3...]
                return Array.from(
                  { length: maxExp + 1 },
                  (_, i) => `${i} YEAR${i !== 1 ? "S" : ""}`,
                );
              }, [candidates])}
              onChange={(v) => toggleFilter("experiences", v)}
              selected={filters.experiences}
            />

            <FilterDropdown
  label="Education"
  options={educationOptions} // Now comes from educationMasters API
  onChange={(v) => toggleFilter("educations", v)}
  selected={filters.educations}
/>


            {/* DISTRICT FILTER */}
  <FilterDropdown
    label="District"
    options={districtOptions}
    onChange={(v) => toggleFilter("districts", v)}
    selected={filters.districts || []}
  />

  {/* CITY FILTER (Dependent on District) */}
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

            {/* GROUP 3: PERSONAL & PIPELINE (Order 5, 6) */}
            <FilterDropdown
              label="Gender"
              options={["MALE", "FEMALE", "OTHER", "NOT SPECIFIED"]}
              onChange={(v) => toggleFilter("genders", v)}
              selected={filters.genders}
            />

            <FilterDropdown
              label="Industry"
              options={industries.map((i) => i.name.toUpperCase())}
              onChange={(v) => toggleFilter("industries", v)}
              selected={filters.industries}
            />

            {/* DEPARTMENT FILTER */}

            <FilterDropdown
              label="Department"
              options={useMemo(() => {
                // Map from the 'departments' state populated by fetchFilterMasters
                return departments.map((d) => d.name.toUpperCase()).sort();
              }, [departments])}
              onChange={(v) => toggleFilter("departments", v)}
              selected={filters.departments}
            />
          </div>
        </div>

        {/* 2. ACTIVE BADGE STRIP (WorkIndia Style) */}
        {(filters.positions.length > 0 ||
          filters.experiences.length > 0 ||
          filters.educations.length > 0 ||
          filters.cities.length > 0 ||
          filters.ages.length > 0 ||
          filters.languages.length > 0 ||
          filters.genders.length > 0 ||
          filters.statuses.length > 0 ||
          filters.departments.length > 0 ||
          filters.industries.length > 0) && (
          <div className="flex flex-wrap items-center gap-3 bg-white/50 p-4 rounded-2xl border border-dashed border-slate-200">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">
              Filters Applied:
            </span>

            {/* Render Category Badges */}
            {Object.entries(filters).map(([category, values]) =>
              values.map((val) => (
                <button
                  key={val}
                  onClick={() => removeFilter(category, val)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-blue-50 transition-all group"
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
              className="text-[10px] font-black uppercase text-red-500 hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* --- START CANDIDATE REGISTRY BLOCK --- */}
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* 1. ENTERPRISE TOOLBAR (Updated with Select All Input) */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* GLOBAL SELECT ALL NODE */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group">
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
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
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
              onClick={() => {
                setSingleMailCandidate(null);
                setIsMailModalOpen(true);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px]  font-black uppercase tracking-widest transition-all ${
                selectedCount > 0
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95"
                  : "!bg-slate-100 !text-slate-400 cursor-not-allowed"
              }`}
              disabled={selectedCount === 0}
            >
              <Mail size={14} />
              {selectedCount <= 1
                ? "Shoot Mail"
                : `Shoot ${selectedCount} Mails`}
            </button>
          </div>
        </div>

        {/* 2. ENTERPRISE CARD STREAM */}
        {/* --- START ENTERPRISE WORKINDIA-STYLE CARD STREAM --- */}
     {/* 2. ENTERPRISE CARD STREAM */}
<div className="space-y-4 min-h-[400px] relative">
  {loadingCandidates ? (
    /* --- ENTERPRISE LOADER STATE --- */
    <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-[3rem] shadow-sm animate-pulse">
      <div className="relative">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" strokeWidth={1.5} />
        <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse rounded-full" />
      </div>
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-bounce">
        Synchronizing Registry...
      </h3>
      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
        Fetching secure candidate data
      </p>
    </div>
  ) :  filteredCandidates.slice((currentPage - 1) * 10, currentPage * 10)
            .length > 0 ? (
            filteredCandidates
              .slice((currentPage - 1) * 10, currentPage * 10)
              .map((c) => (
                <div
                  key={c.id}
                  className={`bg-white border rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden ${
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
                          <div className="w-14 h-14 rounded-[1.2rem] bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase tracking-tighter ring-4 ring-white">
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
                                    : c.languages_spoken.slice(0, 2).join(", ")}
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
                        <Clock size={15} className="text-slate-600" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                          {formatRelativeTime(c.added)}
                        </p>
                      </div>

                      {/* ACTION STACK: ANCHORED BOTTOM RIGHT */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* NEW: DECISION DROPDOWN */}
                        <div className="relative group/decision">
                          <select
                            onChange={(e) => {
                              if (e.target.value)
                                handleStatusUpdate(c.id, e.target.value);
                              e.target.value = ""; // Reset dropdown after selection
                            }}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer outline-none shadow-sm"
                          >
                            <option value="">Decision</option>
                            <option value="hold" className="text-slate-600">
                              Put on Hold
                            </option>
                            <option value="reject" className="text-slate-600">
                              Reject Candidate
                            </option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/decision:text-blue-600"
                          />
                        </div>
                        <button
                          onClick={() => navigate(`/profile/${c.id}`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => navigate(`/editentry/${c.id}`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                          <Pencil size={14} /> Edit Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )  : (
    /* --- EMPTY DATA UI --- */
    <div className="py-32 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[3rem] shadow-inner">
      <Database size={48} className="text-slate-100 mb-4" />
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
        No Candidates Found
      </p>
    </div>
  )}
</div>

        {/* 3. PAGINATION CONTROLLER */}
        {Math.ceil(filteredCandidates.length / 10) > 1 && (
          <div className="bg-white px-10 py-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Pages {(currentPage - 1) * 10 + 1} —{" "}
                {Math.min(currentPage * 10, filteredCandidates.length)} of{" "}
                {filteredCandidates.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>

              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-inner">
                {[...Array(Math.ceil(filteredCandidates.length / 10))].map(
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-[10px] font-black uppercase transition-all ${
                        currentPage === i + 1
                          ? "bg-slate-900 text-white shadow-lg"
                          : "text-slate-400 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ),
                )}
              </div>

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
      {/* --- END CANDIDATE REGISTRY BLOCK --- */}

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
                  // onClick={() => window.location.href = `mailto:${selectedCandidate.email}`}
                  onClick={() => {
                    setSingleMailCandidate(selectedCandidate); // store single candidate
                    setIsMailModalOpen(true); // open existing mail modal
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
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
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
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
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
              <button
                onClick={() => navigate("/jobtemplate")} // Adjust this path to your actual route
                className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-tighter hover:text-blue-700 transition-colors group"
              >
                <PlusCircle size={12} strokeWidth={3} />
                Add New Template
              </button>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-900 flex gap-3">
              <button
                onClick={() => setIsMailModalOpen(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Abort
              </button>

              <button
                // onClick={handleSendJD}
                onClick={
                  singleMailCandidate ? handlesingleSendJD : handleSendJD
                }
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
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

const SourceCard = ({ icon, title, desc, color, isAction }) => {
  const colors = {
    emerald:
      "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

    indigo:
      "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  };

  return (
    <div
      className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
            {title}
          </h3>

          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
            {desc}
          </p>
        </div>
      </div>
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


const getSourceStyles = (source) => {
  if (source === "Excel Import")
    return "bg-emerald-50 text-emerald-600 border-emerald-100";

  if (source === "Webhook")
    return "bg-indigo-50 text-indigo-600 border-indigo-100";

  return "bg-blue-50 text-blue-600 border-blue-100";
};

export default CandidateIntakeFilter;