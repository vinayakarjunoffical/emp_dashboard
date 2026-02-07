import React, { useState, useMemo, useEffect } from "react";

import {
  FileSpreadsheet,
  Webhook,
  UserPlus,
  Filter,
  Search,
  Mail,
  MoreHorizontal,
  ExternalLink,
  FileWarning,
  Briefcase,
  MapPin,
  Send,
  Phone,
  Maximize2,
  X,
  Printer,
  Check,
  GraduationCap,
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

const CandidateIntake = () => {
  // --- EXTENDED MOCK DATA ---
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(false);

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
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [singleMailCandidate, setSingleMailCandidate] = useState(null);

  // --- FILTER STATES ---

  const [filters, setFilters] = useState({
    position: "All Positions",

    experience: "All Experience",

    education: "All Education",
    location: "All Locations",
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
    district: "",
    country: "",
    exp: "",
    position: "",
    education: "",
    fileName: "",
    cvFile: null,
    expLetterName: "",
    expLetterFile: null,
  });

  const [loadingCandidates, setLoadingCandidates] = useState(true);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const name = c.name || c.full_name || "";
      const email = c.email || c.email_address || "";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition =
        filters.position === "All Positions" || c.position === filters.position;

      const matchesLocation =
        filters.location === "All Locations" ||
        (c.location || "")
          .toLowerCase()
          .includes(filters.location.toLowerCase());

      const matchesEducation =
        filters.education === "All Education" ||
        c.education === filters.education;

      let matchesExperience = true;

      if (filters.experience === "Junior (0-3 yrs)")
        matchesExperience = Number(c.exp || c.experience) <= 3;

      if (filters.experience === "Mid (4-7 yrs)")
        matchesExperience =
          Number(c.exp || c.experience) >= 4 &&
          Number(c.exp || c.experience) <= 7;

      if (filters.experience === "Senior (8+ yrs)")
        matchesExperience = Number(c.exp || c.experience) >= 8;

      return (
        matchesSearch &&
        matchesPosition &&
        matchesEducation &&
        matchesExperience &&
        matchesLocation
      );
    });
  }, [candidates, searchQuery, filters]);

  // --- HANDLERS ---

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const data = await candidateService.getAll();

        console.log("API DATA:", data); // debug

        const mapped = data.map((c) => ({
          id: c.id,
          name: c.full_name || c.name,
          email: c.email,
          exp: c.experience,
          location: c.location,
          position: c.position,
          education: c.education,
          source: c.entry_method || "API",
          selected: false,
          cvUrl: c.resume_path,
          expLetterUrl: c.experience_letter_path,
        }));

        setCandidates(mapped);
      } catch (err) {
        console.error("API ERROR:", err);
        toast.error("Failed to load candidates");
      }
    };

    loadCandidates();
  }, []);

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
      position: {
        value: formData.position,
        required: true,
      },
      exp: {
        value: formData.exp,
        required: true,
        pattern: /^\d+$/,
        message: "Experience must be a number",
      },
      address: {
        value: formData.address,
        required: true,
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
      formDataApi.append("education", formData.education);
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
        fileName: "",
        cvFile: null,
        expLetterName: "",
        expLetterFile: null,
      });

      setIsModalOpen(false);

      // ✅ SUCCESS TOASTER
      toast.success("Candidate uploaded successfully 🎉");
    } catch (err) {
      console.error("Create candidate failed:", err);
      toast.error("Failed to upload candidate ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0]?.Status !== "Success") {
        toast.error("Invalid pincode ❌");
        return;
      }

      const postOffice = data[0].PostOffice[0];

      setFormData((prev) => ({
        ...prev,
        state: postOffice.State,
        district: postOffice.District,
        country: postOffice.Country,
      }));

      toast.success("Location auto-filled 📍");
    } catch (err) {
      console.error("Pincode API error:", err);
      toast.error("Failed to fetch pincode details");
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

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCandidates.slice(start, end);
  }, [filteredCandidates, currentPage]);

  const isFormInvalid =
    !formData.name ||
    !formData.email ||
    !formData.position ||
    !formData.exp ||
    !formData.address ||
    !formData.education ||
    !formData.pincode ||
    !formData.state ||
    !formData.district ||
    Object.keys(errors).length > 0;

  const validateField = (field, value) => {
    let error = "";

    if (
      ["name", "email", "position", "exp", "address", "education"].includes(
        field,
      ) &&
      !value
    ) {
      error = "This field is required";
    }

    if (field === "email" && value) {
      if (!/^[^\s@]{1,64}@[^\s@]{1,255}$/.test(value)) {
        error = "Invalid email format or length";
      }
    }

    if (field === "pincode" && value) {
      if (!/^\d{6}$/.test(value)) {
        error = "Enter valid 6 digit pincode";
      }
    }

    if (field === "phone" && value) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        error = "Enter valid 10 digit Indian mobile number";
      }
    }

    if (field === "exp" && value) {
      if (!/^\d+$/.test(value)) {
        error = "Experience must be numeric";
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

  console.log("add new chanages", selectedCandidate);
  const selectedCount = candidates.filter((c) => c.selected).length;

  const mailTargetCount = singleMailCandidate
    ? 1
    : candidates.filter((c) => c.selected).length;

  const mailTargetName = singleMailCandidate?.name || "";

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
      {/* SOURCE CONTROL HEADER */}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setActiveSourceModal("excel")}>
          <SourceCard
            icon={<FileSpreadsheet />}
            title="Excel Import"
            desc="Bulk upload .csv or .xlsx"
            color="emerald"
            isAction // Added isAction for hover effect
          />
        </div>

        <div onClick={() => setActiveSourceModal("webhook")}>
          <SourceCard
            icon={<Webhook />}
            title="API Webhook"
            desc="Connect LinkedIn/Indeed"
            color="indigo"
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
      </div>

      {/* --- ENTERPRISE FILTER BAR --- */}

      <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-3 border-r border-slate-100">
          <Filter size={16} className="text-blue-600" />

          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Filters
          </span>
        </div>

        <FilterDropdown
          label="Position"
          options={[
            "All Positions",
            "Fullstack Dev",
            "UI Designer",
            "Product Manager",
          ]}
          value={filters.position}
          onChange={(v) => setFilters({ ...filters, position: v })}
        />

        <FilterDropdown
          label="Experience"
          options={[
            "All Experience",
            "Junior (0-3 yrs)",
            "Mid (4-7 yrs)",
            "Senior (8+ yrs)",
          ]}
          value={filters.experience}
          onChange={(v) => setFilters({ ...filters, experience: v })}
        />

        <FilterDropdown
          label="Education"
          options={["All Education", "B.Tech", "Masters", "MBA"]}
          value={filters.education}
          onChange={(v) => setFilters({ ...filters, education: v })}
        />

        <FilterDropdown
          label="Location"
          options={[
            "All Locations",
            "Mumbai",
            "Pune",
            "Delhi",
            "Bangalore",
            "Hyderabad",
            "Chennai",
          ]}
          value={filters.location}
          onChange={(v) => setFilters({ ...filters, location: v })}
        />

        <button
          onClick={() =>
            setFilters({
              position: "All Positions",
              experience: "All Experience",
              education: "All Education",
              location: "All Locations",
            })
          }
          className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* TABLE CONTAINER */}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
        {/* Toolbar */}

        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black tracking-tight text-slate-800">
              Candidate Pool
            </h2>

            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
              {filteredCandidates.length} Results
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or email..."
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
              />
            </div>

            {/* <button
              // onClick={() => setIsMailModalOpen(true)}
              onClick={() => {
                setSingleMailCandidate(null); // ensure bulk mode
                setIsMailModalOpen(true);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                candidates.some((c) => c.selected)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!candidates.some((c) => c.selected)}
            >
              <Mail size={14} />
              {selectedCount <= 1 ? "Shoot Mail" : "Shoot Mails"}
            </button> */}
            <button
              onClick={() => {
                setSingleMailCandidate(null);
                setIsMailModalOpen(true);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCount > 0
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={selectedCount === 0}
            >
              <Mail size={14} />
              {selectedCount <= 1 ? "Shoot Mail" : "Shoot Mails"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* Add table-auto or table-fixed depending on how rigid you want it */}
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-slate-50/50">
                {/* Fixed narrow width for checkbox */}
                <th className="w-16 px-8 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      paginatedCandidates.length > 0 &&
                      paginatedCandidates.every((c) => c.selected)
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </th>

                {/* This column will take most of the space */}
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Candidate Info
                </th>

                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Position & Exp
                </th>

                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Education
                </th>

                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  Source
                </th>

                {/* Explicitly narrow the Actions column */}
                <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* {filteredCandidates.map((c) => ( */}
              {paginatedCandidates.map((c) => (
                <tr
                  key={c.id}
                  className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
                >
                  <td className="px-8 py-5">
                    <input
                      type="checkbox"
                      checked={c.selected}
                      onChange={() => toggleSelect(c.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
                        {/* {c.name.charAt(0)}
                        {c.name.split(" ")[1]?.charAt(0)} */}
                        {(c.name || "U").charAt(0)}
                        {(c.name?.split(" ")[1] || "").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        {" "}
                        {/* Prevents text from breaking layout */}
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Briefcase size={12} className="text-blue-500" />{" "}
                        {c.position}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <Calendar size={12} /> {c.exp}
                        {/* <Calendar size={12} /> {c.exp} Years Exp */}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                        <GraduationCap size={12} />
                      </div>
                      {c.education}
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}
                    >
                      {c.source}
                    </span>
                  </td>

                  {/* Action cell with forced narrow width */}
                  <td className="px-8 py-5 text-right w-24">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* PAGINATION */}
          {totalPages >= 1 && (
            <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-white">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase
          bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-black
          ${
            currentPage === page
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase
          bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

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
                {/* <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200">
                  <Download size={14} /> Download CV
                </button> */}
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
                  {/* <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      Visibility Status
                    </h4>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-700"
                        >
                          HM
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                        +1
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-indigo-700/70 leading-relaxed">
                      Profile currently under technical review by the
                      Engineering Leadership team.
                    </p>
                  </div> */}
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
            onClick={() => setIsModalOpen(false)}
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
                <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest flex items-center gap-2">
                  Manual Record Entry
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-slate-300 normal-case font-bold italic">
                    Fields marked (*) are required
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-5">
                    <InputField
                      label="Position"
                      placeholder="e.g. Fullstack Dev"
                      required
                      error={errors.position}
                      value={formData.position}
                      onChange={(v) => {
                        setFormData({ ...formData, position: v });
                        validateField("position", v);
                      }}
                    />
                    <InputField
                      label="Years of Experience"
                      placeholder="e.g. 5"
                      type="number"
                      required
                      error={errors.exp}
                      value={formData.exp}
                      onChange={(v) => {
                        setFormData({ ...formData, exp: v });
                        validateField("exp", v);
                      }}
                    />
                  </div>
                </div>

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
                  <InputField
                    label="Education"
                    placeholder="e.g. B.Tech"
                    required
                    error={errors.education}
                    value={formData.education}
                    onChange={(v) => {
                      setFormData({ ...formData, education: v });
                      validateField("education", v);
                    }}
                  />
                </div>

                <InputField
                  label="Location"
                  placeholder="Mumbai, MH"
                  required
                  error={errors.address}
                  value={formData.address}
                  onChange={(v) => {
                    setFormData({ ...formData, address: v });
                    validateField("address", v);
                  }}
                />
                <InputField
                  label="Pincode"
                  placeholder="e.g. 400701"
                  required
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

                <div className="grid grid-cols-2 gap-5">
                  <InputField
                    label="State"
                    value={formData.state}
                    placeholder="Auto-filled"
                    onChange={() => {}}
                  />

                  <InputField
                    label="District"
                    value={formData.district}
                    placeholder="Auto-filled"
                    onChange={() => {}}
                  />
                </div>

                <InputField
                  label="Country"
                  value={formData.country}
                  onChange={() => {}}
                />

                {/* DOCUMENT UPLOAD SECTION */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                    Supporting Documents
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* RESUME */}
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setFormData({
                            ...formData,
                            fileName: file.name,
                            cvFile: file,
                          });
                        }}
                      />
                      <div
                        className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all flex flex-col items-center justify-center min-h-[110px]
                  ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50"}`}
                      >
                        <FileText
                          size={16}
                          className={
                            formData.fileName
                              ? "text-blue-500"
                              : "text-slate-400"
                          }
                        />
                        <p className="text-[10px] font-bold text-slate-700 mt-2 text-center line-clamp-1 px-2">
                          {formData.fileName || "Upload Resume"}
                        </p>
                      </div>
                    </div>

                    {/* EXPERIENCE LETTER */}
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setFormData({
                            ...formData,
                            expLetterName: file.name,
                            expLetterFile: file,
                          });
                        }}
                      />
                      <div
                        className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all flex flex-col items-center justify-center min-h-[110px]
                  ${formData.expLetterName ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50"}`}
                      >
                        <Award
                          size={16}
                          className={
                            formData.expLetterName
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }
                        />
                        <p className="text-[10px] font-bold text-slate-700 mt-2 text-center line-clamp-1 px-2">
                          {formData.expLetterName || "Exp. Letter"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* 3. STICKY FOOTER */}
            <div className="shrink-0 px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
              <button
                form="candidate-form" // Connects to the form ID inside scrollable area
                type="submit"
                disabled={loading || isFormInvalid}
                className="flex-2 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-40"
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
                      ? "Bulk Data Ingestion"
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
                  {/* Formatting Note */}
                  <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                      <AlertCircle size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">
                        Required Schema Format
                      </h4>
                      <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
                        To ensure successful synchronization, please arrange
                        your columns in the following order:
                        <span className="text-amber-900">
                          {" "}
                          Full Name, Email, Position, Experience (Years), and
                          Education.
                        </span>
                        Empty rows will be automatically discarded during
                        parsing.
                      </p>
                    </div>
                  </div>

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
                      <Download size={32} />
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
                    href="/documents/sample_excel.xlsx"
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

// --- SUB-COMPONENTS ---

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
      {icon}
    </div>

    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>

      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const SidebarItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
    <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
      {icon}
    </div>

    <div className="overflow-hidden">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
        {label}
      </p>

      <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="flex flex-col min-w-[140px]">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
      {label}
    </span>

    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
      />
    </div>
  </div>
);

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

{
  /* Helper Component for Sidebar Items */
}
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
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none transition-all
        ${
          error
            ? "bg-red-50 border border-red-300 focus:ring-red-500/10"
            : "bg-slate-50 border border-slate-200 focus:ring-blue-500/5"
        }`}
    />

    {error && (
      <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-1">
        {error}
      </p>
    )}
  </div>
);

const QuickMetric = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
      {label}
    </p>
    <p className="text-xs font-black text-slate-800">{value}</p>
  </div>
);

const getSourceStyles = (source) => {
  if (source === "Excel Import")
    return "bg-emerald-50 text-emerald-600 border-emerald-100";

  if (source === "Webhook")
    return "bg-indigo-50 text-indigo-600 border-indigo-100";

  return "bg-blue-50 text-blue-600 border-blue-100";
};

export default CandidateIntake;
//*************************************************working code phase 22333 4/02/26************************************************************** */
// import React, { useState, useMemo, useEffect } from "react";

// import {
//   FileSpreadsheet,
//   Webhook,
//   UserPlus,
//   Filter,
//   Search,
//   Mail,
//   MoreHorizontal,
//   ExternalLink,
//   Briefcase,
//   MapPin,
//   Phone,
//   Maximize2,
//   X,
//   Printer,
//   Check,
//   GraduationCap,
//   ChevronDown,
//   Calendar,
//   Zap,
//   ArrowUpRight,
//   Eye,
//   FileText,
//   Award,
//   Download,
//   AlertCircle,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import toast from "react-hot-toast";
// import { getJobTemplates } from "../../services/jobTemplateService";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---
//   const [candidates, setCandidates] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // --- NEW STATE FOR SOURCE MODALS ---
//   const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [webhookUrl, setWebhookUrl] = useState("");
//   const [isTestingConnection, setIsTestingConnection] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
//   const [expProof, setExpProof] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMailModalOpen, setIsMailModalOpen] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [customRole, setCustomRole] = useState("");
//   const [customContent, setCustomContent] = useState("");
//   const [saveAsTemplate, setSaveAsTemplate] = useState(false);
//   const [newTemplateTitle, setNewTemplateTitle] = useState("");
//   const [excelFile, setExcelFile] = useState(null);
//   const [isImporting, setIsImporting] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(100);
//   const [errors, setErrors] = useState({});
//   // --- PAGINATION STATE ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pdfPage, setPdfPage] = useState(1);
//   const ITEMS_PER_PAGE = 10;

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   const validate = (rules) => {
//     const newErrors = {};

//     Object.keys(rules).forEach((field) => {
//       const { value, required, pattern, message } = rules[field];

//       if (required && !value) {
//         newErrors[field] = "This field is required";
//       }

//       if (pattern && value && !pattern.test(value)) {
//         newErrors[field] = message;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   phone: "",
//   //   address: "",
//   //   exp: "",
//   //   position: "",
//   //   education: "",
//   //   fileName: "",
//   //   cvFile: null,
//   //   expLetterName: "",
//   //   expLetterFile: null,
//   // });
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: "",
//     district: "",
//     country: "",
//     exp: "",
//     position: "",
//     education: "",
//     fileName: "",
//     cvFile: null,
//     expLetterName: "",
//     expLetterFile: null,
//   });

//   const [loadingCandidates, setLoadingCandidates] = useState(true);

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((c) => {
//       const name = c.name || c.full_name || "";
//       const email = c.email || c.email_address || "";

//       const matchesSearch =
//         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition =
//         filters.position === "All Positions" || c.position === filters.position;

//       const matchesEducation =
//         filters.education === "All Education" ||
//         c.education === filters.education;

//       let matchesExperience = true;

//       if (filters.experience === "Junior (0-3 yrs)")
//         matchesExperience = Number(c.exp || c.experience) <= 3;

//       if (filters.experience === "Mid (4-7 yrs)")
//         matchesExperience =
//           Number(c.exp || c.experience) >= 4 &&
//           Number(c.exp || c.experience) <= 7;

//       if (filters.experience === "Senior (8+ yrs)")
//         matchesExperience = Number(c.exp || c.experience) >= 8;

//       return (
//         matchesSearch &&
//         matchesPosition &&
//         matchesEducation &&
//         matchesExperience
//       );
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   useEffect(() => {
//     const loadCandidates = async () => {
//       try {
//         const data = await candidateService.getAll();

//         console.log("API DATA:", data); // debug

//         const mapped = data.map((c) => ({
//           id: c.id,
//           name: c.full_name || c.name,
//           email: c.email,
//           exp: c.experience,
//           location: c.location,
//           position: c.position,
//           education: c.education,
//           source: c.entry_method || "API",
//           selected: false,
//           cvUrl: c.resume_path,
//           expLetterUrl: c.experience_letter_path,
//         }));

//         setCandidates(mapped);
//       } catch (err) {
//         console.error("API ERROR:", err);
//         toast.error("Failed to load candidates");
//       }
//     };

//     loadCandidates();
//   }, []);

//   useEffect(() => {
//     const loadTemplates = async () => {
//       try {
//         const data = await getJobTemplates();
//         setTemplates(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadTemplates();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, filters]);

//   const handleManualEntry = async (e) => {
//     e.preventDefault();

//     // const isValid = validate({
//     //   name: { value: formData.name, required: true },
//     //   email: {
//     //     value: formData.email,
//     //     required: true,
//     //     pattern: /^\S+@\S+\.\S+$/,
//     //     message: "Invalid email address",
//     //   },
//     //   phone: {
//     //     value: formData.phone,
//     //     pattern: /^\d{10}$/,
//     //     message: "Enter 10 digit phone number",
//     //   },
//     //   position: { value: formData.position, required: true },
//     //   exp: { value: formData.exp, required: true },
//     //   address: { value: formData.address, required: true },
//     // });
//     const isValid = validate({
//       name: {
//         value: formData.name,
//         required: true,
//       },
//       email: {
//         value: formData.email,
//         required: true,
//         pattern: /^\S+@\S+\.\S+$/,
//         message: "Invalid email address",
//       },
//       phone: {
//         value: formData.phone,
//         pattern: /^[6-9]\d{9}$/,
//         message: "Enter valid 10 digit Indian number",
//       },
//       position: {
//         value: formData.position,
//         required: true,
//       },
//       exp: {
//         value: formData.exp,
//         required: true,
//         pattern: /^\d+$/,
//         message: "Experience must be a number",
//       },
//       address: {
//         value: formData.address,
//         required: true,
//       },
//     });

//     if (!isValid) {
//       toast.error("Please fix form errors ❌");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formDataApi = new FormData();

//       // ✅ Backend field names
//       formDataApi.append("name", formData.name);
//       formDataApi.append("email", formData.email);
//       formDataApi.append("phone", formData.phone || "");
//       formDataApi.append("address", formData.address);
//       formDataApi.append("location", formData.address);
//       formDataApi.append("position", formData.position);
//       formDataApi.append("experience", formData.exp);
//       formDataApi.append("education", formData.education);
//       formDataApi.append("entry_method", "manual");
//       formDataApi.append("pincode", formData.pincode);
//       formDataApi.append("state", formData.state);
//       formDataApi.append("district", formData.district);
//       formDataApi.append("country", formData.country);

//       // ✅ Resume Upload
//       if (formData.cvFile) {
//         formDataApi.append("resumepdf", formData.cvFile);
//       }

//       // ✅ Experience Letter Upload
//       if (formData.expLetterFile) {
//         formDataApi.append("experience_letter", formData.expLetterFile);
//       }

//       // 🔥 API CALL
//       const createdCandidate =
//         await candidateService.createCandidate(formDataApi);

//       // Add candidate to UI
//       setCandidates((prev) => [
//         {
//           id: createdCandidate.id,
//           name: createdCandidate.full_name,
//           email: createdCandidate.email,
//           exp: createdCandidate.experience,
//           location: createdCandidate.location,
//           position: createdCandidate.position,
//           education: createdCandidate.education,
//           source: "Manual Entry",
//           selected: false,
//           cvUrl: createdCandidate.resume_path,
//           expLetterUrl: createdCandidate.experience_letter_path,
//         },
//         ...prev,
//       ]);

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         exp: "",
//         position: "",
//         education: "",
//         fileName: "",
//         cvFile: null,
//         expLetterName: "",
//         expLetterFile: null,
//       });

//       setIsModalOpen(false);

//       // ✅ SUCCESS TOASTER
//       toast.success("Candidate uploaded successfully 🎉");
//     } catch (err) {
//       console.error("Create candidate failed:", err);
//       toast.error("Failed to upload candidate ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;

//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();

//       if (data[0]?.Status !== "Success") {
//         toast.error("Invalid pincode ❌");
//         return;
//       }

//       const postOffice = data[0].PostOffice[0];

//       setFormData((prev) => ({
//         ...prev,
//         state: postOffice.State,
//         district: postOffice.District,
//         country: postOffice.Country,
//       }));

//       toast.success("Location auto-filled 📍");
//     } catch (err) {
//       console.error("Pincode API error:", err);
//       toast.error("Failed to fetch pincode details");
//     }
//   };

//   const handleSendJD = async () => {
//     try {
//       const selectedIds = candidates.filter((c) => c.selected).map((c) => c.id);

//       if (!selectedIds.length) {
//         toast.error("Please select candidates");
//         return;
//       }

//       const payload = {
//         candidate_ids: selectedIds,
//         template_id: Number(selectedTemplate),
//         custom_role: customRole,
//         custom_content: customContent,
//         save_as_new_template: saveAsTemplate,
//         new_template_title: newTemplateTitle,
//       };

//       await candidateService.sendJD(payload);

//       toast.success("JD sent successfully 🚀");

//       // ✅ CLOSE MODAL
//       setIsMailModalOpen(false);

//       // ✅ CLEAR MODAL FORM DATA
//       setSelectedTemplate("");
//       setCustomRole("");
//       setCustomContent("");
//       setSaveAsTemplate(false);
//       setNewTemplateTitle("");

//       // ✅ OPTIONAL: UNSELECT ALL CANDIDATES
//       setCandidates((prev) => prev.map((c) => ({ ...c, selected: false })));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send JD ❌");
//     }
//   };

//   const toggleSelectAll = () => {
//     const allSelected = paginatedCandidates.every((c) => c.selected);

//     setCandidates((prev) =>
//       prev.map((c) =>
//         paginatedCandidates.find((p) => p.id === c.id)
//           ? { ...c, selected: !allSelected }
//           : c,
//       ),
//     );
//   };

//   const toggleSelect = (id) => {
//     setCandidates(
//       candidates.map((c) =>
//         c.id === id ? { ...c, selected: !c.selected } : c,
//       ),
//     );
//   };

//   const getInitials = (name = "") => {
//     if (!name) return "U";
//     const parts = name.split(" ");
//     return parts
//       .map((p) => p[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleExcelImport = async () => {
//     if (!excelFile) {
//       toast.error("Please select an Excel file ❌");
//       return;
//     }

//     try {
//       setIsImporting(true);

//       const formData = new FormData();
//       formData.append("file", excelFile);

//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/candidates/import",
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         // backend error message
//         throw new Error(data?.message || "Import failed");
//       }

//       toast.success(data?.message || "Candidates imported successfully 🎉");

//       // 🔁 Reload candidates after import
//       const updated = await candidateService.getAll();
//       setCandidates(
//         updated.map((c) => ({
//           id: c.id,
//           name: c.full_name || c.name,
//           email: c.email,
//           exp: c.experience,
//           location: c.location,
//           position: c.position,
//           education: c.education,
//           source: "Excel Import",
//           selected: false,
//           cvUrl: c.resume_path,
//           expLetterUrl: c.experience_letter_path,
//         })),
//       );

//       setActiveSourceModal(null);
//       setExcelFile(null);
//     } catch (err) {
//       console.error("Excel import error:", err);
//       toast.error(err.message || "Excel import failed ❌");
//     } finally {
//       setIsImporting(false);
//     }
//   };

//   const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

//   const paginatedCandidates = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     const end = start + ITEMS_PER_PAGE;
//     return filteredCandidates.slice(start, end);
//   }, [filteredCandidates, currentPage]);

//   const isFormInvalid =
//     !formData.name ||
//     !formData.email ||
//     !formData.position ||
//     !formData.exp ||
//     !formData.address ||
//     !formData.education ||
//     !formData.pincode ||
//     !formData.state ||
//     !formData.district ||
//     Object.keys(errors).length > 0;

//   const validateField = (field, value) => {
//     let error = "";

//     if (
//       ["name", "email", "position", "exp", "address", "education"].includes(
//         field,
//       ) &&
//       !value
//     ) {
//       error = "This field is required";
//     }

//     if (field === "email" && value) {
//       if (!/^[^\s@]{1,64}@[^\s@]{1,255}$/.test(value)) {
//         error = "Invalid email format or length";
//       }
//     }

//     if (field === "pincode" && value) {
//       if (!/^\d{6}$/.test(value)) {
//         error = "Enter valid 6 digit pincode";
//       }
//     }

//     if (field === "phone" && value) {
//       if (!/^[6-9]\d{9}$/.test(value)) {
//         error = "Enter valid 10 digit Indian mobile number";
//       }
//     }

//     if (field === "exp" && value) {
//       if (!/^\d+$/.test(value)) {
//         error = "Experience must be numeric";
//       }
//     }

//     // 🔥 Update ONLY this field’s error
//     // setErrors((prev) => ({
//     //   ...prev,
//     //   [field]: error,
//     // }));
//     setErrors((prev) => {
//       const updated = { ...prev };

//       if (error) {
//         updated[field] = error;
//       } else {
//         delete updated[field]; // 🔥 THIS IS KEY
//       }

//       return updated;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div onClick={() => setActiveSourceModal("excel")}>
//           <SourceCard
//             icon={<FileSpreadsheet />}
//             title="Excel Import"
//             desc="Bulk upload .csv or .xlsx"
//             color="emerald"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setActiveSourceModal("webhook")}>
//           <SourceCard
//             icon={<Webhook />}
//             title="API Webhook"
//             desc="Connect LinkedIn/Indeed"
//             color="indigo"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}

//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />

//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
//             Filters
//           </span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={[
//             "All Positions",
//             "Fullstack Dev",
//             "UI Designer",
//             "Product Manager",
//           ]}
//           value={filters.position}
//           onChange={(v) => setFilters({ ...filters, position: v })}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={[
//             "All Experience",
//             "Junior (0-3 yrs)",
//             "Mid (4-7 yrs)",
//             "Senior (8+ yrs)",
//           ]}
//           value={filters.experience}
//           onChange={(v) => setFilters({ ...filters, experience: v })}
//         />

//         <FilterDropdown
//           label="Education"
//           options={["All Education", "B.Tech", "Masters", "MBA"]}
//           value={filters.education}
//           onChange={(v) => setFilters({ ...filters, education: v })}
//         />

//         <button
//           onClick={() =>
//             setFilters({
//               position: "All Positions",
//               experience: "All Experience",
//               education: "All Education",
//             })
//           }
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}

//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">
//               Candidate Pool
//             </h2>

//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                 size={16}
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>

//             <button
//               onClick={() => setIsMailModalOpen(true)}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
//                 candidates.some((c) => c.selected)
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
//               }`}
//               disabled={!candidates.some((c) => c.selected)}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {/* Add table-auto or table-fixed depending on how rigid you want it */}
//           <table className="w-full border-collapse table-auto">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 {/* Fixed narrow width for checkbox */}
//                 <th className="w-16 px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={
//                       paginatedCandidates.length > 0 &&
//                       paginatedCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

//                 {/* This column will take most of the space */}
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Candidate Info
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Position & Exp
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Education
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Source
//                 </th>

//                 {/* Explicitly narrow the Actions column */}
//                 <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {/* {filteredCandidates.map((c) => ( */}
//               {paginatedCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {/* {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)} */}
//                         {(c.name || "U").charAt(0)}
//                         {(c.name?.split(" ")[1] || "").charAt(0)}
//                       </div>
//                       <div className="min-w-0">
//                         {" "}
//                         {/* Prevents text from breaking layout */}
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {c.name}
//                         </p>
//                         <p className="text-[11px] text-slate-500 font-medium truncate">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp}
//                         {/* <Calendar size={12} /> {c.exp} Years Exp */}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>
//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <span
//                       className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   {/* Action cell with forced narrow width */}
//                   <td className="px-8 py-5 text-right w-24">
//                     <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                         title="View Profile"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {/* PAGINATION */}
//           {totalPages >= 1 && (
//             <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-white">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   className="px-4 py-2 rounded-xl text-[10px] font-black uppercase
//           bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
//                 >
//                   Prev
//                 </button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const page =
//                     Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;

//                   return (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-8 h-8 rounded-xl text-[10px] font-black
//           ${
//             currentPage === page
//               ? "bg-blue-600 text-white shadow"
//               : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//           }`}
//                     >
//                       {page}
//                     </button>
//                   );
//                 })}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(p + 1, totalPages))
//                   }
//                   className="px-4 py-2 rounded-xl text-[10px] font-black uppercase
//           bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
//       {/* {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">

//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">

//             <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//               <div className="flex items-center gap-6">
//                 <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">

//                   {getInitials(selectedCandidate?.name)}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">
//                       {selectedCandidate.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
//                     >
//                       {selectedCandidate.source}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Mail size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.email}
//                     </span>
//                     <span className="w-1 h-1 bg-slate-200 rounded-full" />
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Briefcase size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.position}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//                   <Download size={14} /> Download CV
//                 </button>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">

//               <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//                 <QuickMetric
//                   label="Experience"
//                   value={`${selectedCandidate.exp} Years`}
//                 />
//                 <QuickMetric
//                   label="Education"
//                   value={selectedCandidate.education}
//                 />
//                 <QuickMetric
//                   label="Location"
//                   value={selectedCandidate.location}
//                 />
//                 <QuickMetric
//                   label="Candidate ID"
//                   value={`#TR-${selectedCandidate.id}`}
//                 />
//               </div>

//               <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//                 <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                       className="w-full h-full border-none"
//                       title="Resume Viewer"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                         <FileText size={48} />
//                       </div>
//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Missing Curriculum Vitae
//                       </h5>
//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                         This record does not have a professional resume
//                         attached.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div
//                       key={i}
//                       className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Shared with 3 Hiring Managers
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">
//                   Application Health
//                 </span>
//                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           <div className="relative bg-white w-full max-w-7xl h-[92vh] rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
//             {/* 1. HEADER - Enhanced with more actions */}
//             <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
//               <div className="flex items-center gap-6">
//                 <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-lg font-black text-white shadow-lg">
//                   {getInitials(selectedCandidate?.name)}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">
//                       {selectedCandidate.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
//                     >
//                       {selectedCandidate.source}
//                     </span>
//                   </div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
//                     Application ID: #TR-{selectedCandidate.id}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200">
//                   <Download size={14} /> Download CV
//                 </button>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             {/* 2. SPLIT CONTENT AREA */}
//             <div className="flex-1 flex overflow-hidden">
//               {/* LEFT PANEL: Detailed Information (Scrollable) */}
//               <div className="w-[680px] border-r border-slate-100 bg-white overflow-y-auto custom-scrollbar flex flex-col">
//                 <div className="p-8 space-y-10">
//                   {/* Contact Information Section */}
//                   <div className="space-y-4">
//                     <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-1">
//                       Contact Intelligence
//                     </h4>
//                     <div className="grid gap-3">
//                       <InfoCard
//                         icon={<Mail size={14} />}
//                         label="Primary Email"
//                         value={selectedCandidate.email}
//                       />
//                       <InfoCard
//                         icon={<Phone size={14} />}
//                         label="Phone Number"
//                         value={selectedCandidate.phone || "Not Provided"}
//                       />
//                       <InfoCard
//                         icon={<MapPin size={14} />}
//                         label="Current Location"
//                         value={selectedCandidate.location}
//                       />
//                     </div>
//                   </div>

//                   {/* Professional Background Section */}
//                   <div className="space-y-4">
//                     <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] px-1">
//                       Experience & Education
//                     </h4>
//                     <div className="grid gap-3">
//                       <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                           Current Position
//                         </p>
//                         <p className="text-sm font-bold text-slate-800">
//                           {selectedCandidate.position}
//                         </p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                             Experience
//                           </p>
//                           <p className="text-sm font-bold text-slate-800">
//                             {selectedCandidate.exp} Years
//                           </p>
//                         </div>
//                         <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                             Education
//                           </p>
//                           <p className="text-sm font-bold text-slate-800 line-clamp-1">
//                             {selectedCandidate.education}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Hiring Manager Notes / Shared Status */}
//                   <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 space-y-4">
//                     <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                       Visibility Status
//                     </h4>
//                     <div className="flex -space-x-2">
//                       {[1, 2, 3].map((i) => (
//                         <div
//                           key={i}
//                           className="w-8 h-8 rounded-full border-2 border-white bg-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-700"
//                         >
//                           HM
//                         </div>
//                       ))}
//                       <div className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
//                         +1
//                       </div>
//                     </div>
//                     <p className="text-[11px] font-bold text-indigo-700/70 leading-relaxed">
//                       Profile currently under technical review by the
//                       Engineering Leadership team.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT PANEL: Document Workspace */}
//               {/* <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col">

//           <div className="px-8 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
//             <div className="flex items-center gap-4">
//                <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                  <FileText size={14} className="text-blue-500" /> Professional_CV.pdf
//                </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="h-6 w-px bg-slate-200 mx-2" />
//               <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Maximize2 size={16}/></button>
//             </div>
//           </div>

//           <div className="flex-1 p-8 overflow-hidden flex justify-center">
//             <div className="w-full h-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden relative group">
//               {selectedCandidate.cvUrl ? (
//                 <iframe
//                   src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                   className="w-full h-full border-none"
//                   title="Resume Viewer"
//                 />
//               ) : (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-slate-50">
//                   <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
//                     <FileText size={40} />
//                   </div>
//                   <h5 className="text-lg font-black text-slate-800">No Document Attached</h5>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Please upload a resume to enable preview</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div> */}

//               {/* RIGHT PANEL: Document Workspace */}
//               <div className="flex-1 bg-slate-100/50 overflow-hidden flex flex-col">
//                 {/* 1. Integrated Workspace Toolbar */}
//                 <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                       <FileText size={18} />
//                     </div>
//                     <div>
//                       <span className="block text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">
//                         Professional_Curriculum_Vitae.pdf
//                       </span>
//                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 block">
//                         Standardized PDF Document • 1.2 MB
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
//                       <Printer size={14} /> Print
//                     </button>
//                     <div className="h-4 w-px bg-slate-200 mx-2" />
//                     {/* Link to open in a completely new tab for true "Full Screen" */}
//                     <a
//                       href={selectedCandidate.cvUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all tooltip"
//                     >
//                       <ExternalLink size={18} />
//                     </a>
//                   </div>
//                 </div>

//                 {/* 2. FULL SCREEN IFRAME CONTAINER */}
//                 <div className="flex-1 relative w-full h-full bg-white">
//                   {selectedCandidate.cvUrl ? (
//                     // <iframe
//                     //   // Using 'view=Fit' or 'view=FitH' ensures the zoom levels start correctly
//                     //   src={`${selectedCandidate.cvUrl}#toolbar=0&navpanes=0&scrollbar=1&view=Fit`}
//                     //   className="absolute inset-0 w-full h-full border-none shadow-inner"
//                     //   title="Resume Viewer"
//                     // />
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#page=1&zoom=page-fit&view=FitV&toolbar=0&navpanes=0&scrollbar=1`}
//                       className="absolute inset-0 w-full h-full border-none bg-white"
//                       title="Resume Viewer"
//                     />
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full text-center">
//                       {/* Empty State UI */}
//                       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-4 shadow-xl">
//                         <FileWarning size={40} />
//                       </div>
//                       <h5 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Preview Unavailable
//                       </h5>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 3. FOOTER: Application Health */}
//             <div className="px-10 py-5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
//               <div className="flex items-center gap-6">
//                 <div className="flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
//                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                     AI Match Score: 92%
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-blue-500" />
//                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                     Identity Verified
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg">
//                   Advance Candidate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MANUAL ENTRY MODAL (EXISITING) */}

//       {/* {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">

//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">
//                   New Candidate
//                 </h3>
//                <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//   Manual Record Entry
// </p>
// <p className="text-[9px] text-slate-400 font-bold mt-1">
//   Fields marked with <span className="text-red-500">*</span> are mandatory
// </p>

//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">

//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Full Name"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                    error={errors.name}
//                    required
//                   // onChange={(v) => setFormData({ ...formData, name: v })}
//                   onChange={(v) => {
//     setFormData({ ...formData, name: v });
//     validateField("name", v);
//   }}
//                 />
//                 <InputField
//                   label="Email Address"
//                   placeholder="john@example.com"
//                   type="email"
//                   value={formData.email}
//                   error={errors.email}
//                   required
//                   // onChange={(v) => setFormData({ ...formData, email: v })}
//                  onChange={(v) => {
//     const email = v.trim();
//     setFormData({ ...formData, email });
//     validateField("email", email);
//   }}

//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Position"
//                   placeholder="e.g. Fullstack Dev"
//                    required
//                     error={errors.position}
//                   value={formData.position}
//                   // onChange={(v) => setFormData({ ...formData, position: v })}
//                   onChange={(v) => {
//     setFormData({ ...formData, position: v });
//     validateField("position", v);
//   }}
//                 />
//                 <InputField
//                   label="Years of Experience"
//                   placeholder="e.g. 5"
//                   type="number"
//                   required
//                   error={errors.exp}
//                   value={formData.exp}
//                   // onChange={(v) => setFormData({ ...formData, exp: v })}
//                   onChange={(v) => {
//   setFormData({ ...formData, exp: v });
//   validateField("exp", v);
// }}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Phone Number"
//                   placeholder="+91 00000 00000"
//                   type="tel"
//                   maxLength={10}
//                   required
//                   error={errors.phone}
//                   value={formData.phone}
//                   // onChange={(v) => setFormData({ ...formData, phone: v })}
//                    onChange={(v) => {
//     const digits = v.replace(/\D/g, "").slice(0, 10);
//     setFormData({ ...formData, phone: digits });
//     validateField("phone", digits);
//   }}
//                 />
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                    required
//                   error={errors.education}
//                   value={formData.education}
//                   // onChange={(v) => setFormData({ ...formData, education: v })}
//                   onChange={(v) => {
//     setFormData({ ...formData, education: v });
//     validateField("education", v);
//   }}
//                 />
//               </div>

//               <div className="grid grid-cols-1">
//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   required
//                   error={errors.address}
//                   value={formData.address}
//                   // onChange={(v) => setFormData({ ...formData, address: v })}
//                   onChange={(v) => {
//   setFormData({ ...formData, address: v });
//   validateField("address", v);
// }}

//                 />
//               </div>

//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//                   Supporting Documents
//                 </label>

//                 <div className="grid grid-cols-2 gap-4">

//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           fileName: file.name,
//                           cvFile: file,
//                           cvUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div
//                       className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg mb-2 ${formData.fileName ? "bg-blue-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
//                       >
//                         {formData.fileName ? (
//                           <Check size={16} />
//                         ) : (
//                           <FileText size={16} />
//                         )}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.fileName
//                           ? formData.fileName
//                           : "Upload Resume"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           expLetterName: file.name,
//                           expLetterFile: file,
//                           expLetterUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div
//                       className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.expLetterName ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50 group-hover:border-emerald-400 group-hover:bg-emerald-50/50"}`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg mb-2 ${formData.expLetterName ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
//                       >
//                         {formData.expLetterName ? (
//                           <Check size={16} />
//                         ) : (
//                           <Award size={16} />
//                         )}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.expLetterName
//                           ? formData.expLetterName
//                           : "Experience Letter"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-[8px] font-bold text-slate-400 uppercase text-center tracking-widest mt-2">
//                   Maximum file size: 10MB per document
//                 </p>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>

//                 <button
//   type="submit"
//   disabled={loading || isFormInvalid}
//   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl
//     text-[10px] font-black uppercase tracking-widest
//     hover:bg-black transition-all shadow-xl
//     disabled:opacity-40 disabled:cursor-not-allowed"
// >
//   {loading ? "Saving..." : (
//     <>
//       <Check size={16} /> Save Candidate
//     </>
//   )}
// </button>

//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           {/* Modal Container */}
//           <div className="relative bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* 1. STICKY HEADER */}
//             <div className="shrink-0 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//                   New Candidate
//                 </h3>
//                 <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest flex items-center gap-2">
//                   Manual Record Entry
//                   <span className="h-1 w-1 rounded-full bg-slate-300" />
//                   <span className="text-slate-300 normal-case font-bold italic">
//                     Fields marked (*) are required
//                   </span>
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* 2. SCROLLABLE FORM BODY */}
//             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
//               <form
//                 id="candidate-form"
//                 onSubmit={handleManualEntry}
//                 className="space-y-6"
//               >
//                 {/* Section: Identity */}
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-5">
//                     <InputField
//                       label="Full Name"
//                       placeholder="e.g. John Doe"
//                       value={formData.name}
//                       error={errors.name}
//                       required
//                       onChange={(v) => {
//                         setFormData({ ...formData, name: v });
//                         validateField("name", v);
//                       }}
//                     />
//                     <InputField
//                       label="Email Address"
//                       placeholder="john@example.com"
//                       type="email"
//                       value={formData.email}
//                       error={errors.email}
//                       required
//                       onChange={(v) => {
//                         const email = v.trim();
//                         setFormData({ ...formData, email });
//                         validateField("email", email);
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Section: Professional */}
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-5">
//                     <InputField
//                       label="Position"
//                       placeholder="e.g. Fullstack Dev"
//                       required
//                       error={errors.position}
//                       value={formData.position}
//                       onChange={(v) => {
//                         setFormData({ ...formData, position: v });
//                         validateField("position", v);
//                       }}
//                     />
//                     <InputField
//                       label="Years of Experience"
//                       placeholder="e.g. 5"
//                       type="number"
//                       required
//                       error={errors.exp}
//                       value={formData.exp}
//                       onChange={(v) => {
//                         setFormData({ ...formData, exp: v });
//                         validateField("exp", v);
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Section: Contact */}
//                 <div className="grid grid-cols-2 gap-5">
//                   <InputField
//                     label="Phone Number"
//                     placeholder="+91 00000 00000"
//                     type="tel"
//                     maxLength={10}
//                     required
//                     error={errors.phone}
//                     value={formData.phone}
//                     onChange={(v) => {
//                       const digits = v.replace(/\D/g, "").slice(0, 10);
//                       setFormData({ ...formData, phone: digits });
//                       validateField("phone", digits);
//                     }}
//                   />
//                   <InputField
//                     label="Education"
//                     placeholder="e.g. B.Tech"
//                     required
//                     error={errors.education}
//                     value={formData.education}
//                     onChange={(v) => {
//                       setFormData({ ...formData, education: v });
//                       validateField("education", v);
//                     }}
//                   />
//                 </div>

//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   required
//                   error={errors.address}
//                   value={formData.address}
//                   onChange={(v) => {
//                     setFormData({ ...formData, address: v });
//                     validateField("address", v);
//                   }}
//                 />
//                 <InputField
//                   label="Pincode"
//                   placeholder="e.g. 400701"
//                   required
//                   value={formData.pincode}
//                   error={errors.pincode}
//                   onChange={(v) => {
//                     const digits = v.replace(/\D/g, "").slice(0, 6);

//                     setFormData((prev) => ({
//                       ...prev,
//                       pincode: digits,
//                       state: "",
//                       district: "",
//                     }));

//                     validateField("pincode", digits);

//                     if (digits.length === 6) {
//                       fetchPincodeDetails(digits);
//                     }
//                   }}
//                 />

//                 <div className="grid grid-cols-2 gap-5">
//                   <InputField
//                     label="State"
//                     value={formData.state}
//                     placeholder="Auto-filled"
//                     onChange={() => {}}
//                   />

//                   <InputField
//                     label="District"
//                     value={formData.district}
//                     placeholder="Auto-filled"
//                     onChange={() => {}}
//                   />
//                 </div>

//                 <InputField
//                   label="Country"
//                   value={formData.country}
//                   onChange={() => {}}
//                 />

//                 {/* DOCUMENT UPLOAD SECTION */}
//                 <div className="pt-4 border-t border-slate-100 space-y-3">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//                     Supporting Documents
//                   </label>
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* RESUME */}
//                     <div className="relative group">
//                       <input
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (!file) return;
//                           setFormData({
//                             ...formData,
//                             fileName: file.name,
//                             cvFile: file,
//                           });
//                         }}
//                       />
//                       <div
//                         className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all flex flex-col items-center justify-center min-h-[110px]
//                   ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50"}`}
//                       >
//                         <FileText
//                           size={16}
//                           className={
//                             formData.fileName
//                               ? "text-blue-500"
//                               : "text-slate-400"
//                           }
//                         />
//                         <p className="text-[10px] font-bold text-slate-700 mt-2 text-center line-clamp-1 px-2">
//                           {formData.fileName || "Upload Resume"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* EXPERIENCE LETTER */}
//                     <div className="relative group">
//                       <input
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (!file) return;
//                           setFormData({
//                             ...formData,
//                             expLetterName: file.name,
//                             expLetterFile: file,
//                           });
//                         }}
//                       />
//                       <div
//                         className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all flex flex-col items-center justify-center min-h-[110px]
//                   ${formData.expLetterName ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50"}`}
//                       >
//                         <Award
//                           size={16}
//                           className={
//                             formData.expLetterName
//                               ? "text-emerald-500"
//                               : "text-slate-400"
//                           }
//                         />
//                         <p className="text-[10px] font-bold text-slate-700 mt-2 text-center line-clamp-1 px-2">
//                           {formData.expLetterName || "Exp. Letter"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* 3. STICKY FOOTER */}
//             <div className="shrink-0 px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
//               >
//                 Discard
//               </button>
//               <button
//                 form="candidate-form" // Connects to the form ID inside scrollable area
//                 type="submit"
//                 disabled={loading || isFormInvalid}
//                 className="flex-2 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-40"
//               >
//                 {loading ? (
//                   "Processing..."
//                 ) : (
//                   <>
//                     <Check size={16} strokeWidth={3} />
//                     Finalize & Save
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- ENTERPRISE SOURCE PROTOCOL MODAL --- */}
//       {activeSourceModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setActiveSourceModal(null)}
//           />

//           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header */}
//             <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`p-4 rounded-2xl ${activeSourceModal === "excel" ? "bg-emerald-500" : "bg-indigo-500"} text-white shadow-xl`}
//                 >
//                   {activeSourceModal === "excel" ? (
//                     <FileSpreadsheet size={24} />
//                   ) : (
//                     <Webhook size={24} />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
//                     {activeSourceModal === "excel"
//                       ? "Bulk Data Ingestion"
//                       : "API Endpoint Configuration"}
//                   </h3>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                     {activeSourceModal === "excel"
//                       ? "Protocol: CSV / XLSX Source"
//                       : "Protocol: Restful Webhook"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setActiveSourceModal(null)}
//                 className="p-3 hover:bg-white rounded-2xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8">
//               {activeSourceModal === "excel" ? (
//                 <>
//                   {/* Formatting Note */}
//                   <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
//                     <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
//                       <AlertCircle size={20} />
//                     </div>
//                     <div className="space-y-1">
//                       <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">
//                         Required Schema Format
//                       </h4>
//                       <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
//                         To ensure successful synchronization, please arrange
//                         your columns in the following order:
//                         <span className="text-amber-900">
//                           {" "}
//                           Full Name, Email, Position, Experience (Years), and
//                           Education.
//                         </span>
//                         Empty rows will be automatically discarded during
//                         parsing.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Dropzone Area */}
//                   <div className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
//                     <input
//                       type="file"
//                       accept=".csv,.xlsx"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setExcelFile(file);
//                       }}
//                     />

//                     <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
//                       <Download size={32} />
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-500 mt-2">
//                       {excelFile ? excelFile.name : "No file selected"}
//                     </p>

//                     <p className="text-sm font-black text-slate-800 tracking-tight">
//                       Deploy Spreadsheet File
//                     </p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
//                       Max Payload: 25MB
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 /* Webhook UI - Enterprise Entry Mode */
//                 <div className="space-y-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between ml-1">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Destination Endpoint
//                       </label>
//                       <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase">
//                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                         System Ready
//                       </span>
//                     </div>

//                     <div className="relative group">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                         <Webhook size={18} />
//                       </div>
//                       <input
//                         type="text"
//                         value={webhookUrl}
//                         onChange={(e) => setWebhookUrl(e.target.value)}
//                         placeholder="https://your-api-endpoint.com/hooks"
//                         className="w-full pl-12 pr-4 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm font-mono text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
//                       />
//                     </div>
//                   </div>

//                   {/* Connection Guidance */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Method
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         POST Request
//                       </p>
//                     </div>
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Auth Type
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         Bearer Token
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 flex items-start gap-4">
//                     <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
//                       <AlertCircle size={16} />
//                     </div>
//                     <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
//                       Ensure your endpoint is configured to accept{" "}
//                       <span className="underline">JSON payloads</span>. The
//                       system will send a ping request to verify this URL upon
//                       activation.
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {/* --- PLACE THE NEW BUTTON CODE HERE --- */}
//               {/* <button
//                 disabled={
//                   isImporting || (activeSourceModal === "excel" && !excelFile)
//                 }
//                 className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
//             ${
//               activeSourceModal === "excel"
//                 ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
//                 : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
//             }`}
//                 onClick={() => {
//                   if (activeSourceModal === "excel") {
//                     handleExcelImport();
//                   } else {
//                     setIsTestingConnection(true);
//                     setTimeout(() => {
//                       setIsTestingConnection(false);
//                       setActiveSourceModal(null);
//                       toast.success("Webhook activated successfully 🚀");
//                     }, 2000);
//                   }
//                 }}
//               >
//                 {isTestingConnection ? (
//                   <>
//                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Verifying Protocol...
//                   </>
//                 ) : activeSourceModal === "excel" ? (
//                   "Begin Synchronized Ingestion"
//                 ) : (
//                   "Activate Webhook"
//                 )}
//               </button> */}
//               {/* --- ACTION BUTTONS AREA --- */}
//               <div className="flex flex-col items-center gap-4">
//                 {/* Primary Action Button */}
//                 <button
//                   disabled={
//                     isImporting || (activeSourceModal === "excel" && !excelFile)
//                   }
//                   className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
//     ${
//       activeSourceModal === "excel"
//         ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
//         : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
//     }`}
//                   onClick={() => {
//                     if (activeSourceModal === "excel") {
//                       handleExcelImport();
//                     } else {
//                       setIsTestingConnection(true);
//                       setTimeout(() => {
//                         setIsTestingConnection(false);
//                         setActiveSourceModal(null);
//                         toast.success("Webhook activated successfully 🚀");
//                       }, 2000);
//                     }
//                   }}
//                 >
//                   {isTestingConnection ? (
//                     <>
//                       <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Verifying Protocol...
//                     </>
//                   ) : activeSourceModal === "excel" ? (
//                     "Begin Synchronized Ingestion"
//                   ) : (
//                     "Activate Webhook"
//                   )}
//                 </button>

//                 {/* Secondary Download Button - Centered below */}
//                 {activeSourceModal === "excel" && (
//                   <a
//                     href="/documents/sample_excel.xlsx"
//                     download
//                     className="group flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors py-2"
//                   >
//                     <Download
//                       size={14}
//                       className="group-hover:translate-y-0.5 transition-transform"
//                     />
//                     <span>Download Sample Schema Template</span>
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {isMailModalOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsMailModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Communication Hub */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
//                   <Zap size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Transmission Protocol
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Deploying Job Architecture
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsMailModalOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Template Selector Section */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Select Source Template
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                     <FileText size={16} />
//                   </div>
//                   <select
//                     value={selectedTemplate}
//                     onChange={(e) => setSelectedTemplate(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
//                   >
//                     <option value="">Manual Override (No Template)</option>
//                     {templates.map((t) => (
//                       <option key={t.id} value={t.id}>
//                         {t.title}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <Filter size={14} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer Actions */}
//             <div className="p-6 bg-slate-900 flex gap-3">
//               <button
//                 onClick={() => setIsMailModalOpen(false)}
//                 className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
//               >
//                 Abort
//               </button>

//               <button
//                 onClick={handleSendJD}
//                 className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
//               >
//                 Execute Transmission
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
//       {icon}
//     </div>

//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SidebarItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
//     <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>

//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
//         {label}
//       </p>

//       <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
//       {label}
//     </span>

//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={14}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
//       />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//   const colors = {
//     emerald:
//       "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

//     indigo:
//       "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

//     blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
//   };

//   return (
//     <div
//       className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//             {title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
//             {desc}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// {
//   /* Helper Component for Sidebar Items */
// }
// function InfoCard({ icon, label, value }) {
//   return (
//     <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
//       <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:text-blue-500 transition-colors">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//           {label}
//         </p>
//         <p className="text-[13px] font-bold text-slate-700 break-all leading-tight">
//           {value}
//         </p>
//       </div>
//     </div>
//   );
// }

// // const InputField = ({
// //   label,
// //   placeholder,
// //   type = "text",
// //   value,
// //   onChange,
// //   error,
// // }) => (
// //   <div className="space-y-1.5">
// //     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
// //       {label}
// //     </label>

// //     <input
// //       type={type}
// //       value={value}
// //       onChange={(e) => onChange(e.target.value)}
// //       placeholder={placeholder}
// //       className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none transition-all
// //         ${
// //           error
// //             ? "bg-red-50 border-red-300 focus:ring-red-500/10"
// //             : "bg-slate-50 border-slate-200 focus:ring-blue-500/5"
// //         }`}
// //     />

// //     {error && (
// //       <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-1">
// //         {error}
// //       </p>
// //     )}
// //   </div>
// // );

// const InputField = ({
//   label,
//   placeholder,
//   type = "text",
//   value,
//   onChange,
//   error,
//   required = false,
// }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//       {required && <span className="text-red-500 ml-1">*</span>}
//     </label>

//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none transition-all
//         ${
//           error
//             ? "bg-red-50 border border-red-300 focus:ring-red-500/10"
//             : "bg-slate-50 border border-slate-200 focus:ring-blue-500/5"
//         }`}
//     />

//     {error && (
//       <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//       {label}
//     </p>
//     <p className="text-xs font-black text-slate-800">{value}</p>
//   </div>
// );

// const getSourceStyles = (source) => {
//   if (source === "Excel Import")
//     return "bg-emerald-50 text-emerald-600 border-emerald-100";

//   if (source === "Webhook")
//     return "bg-indigo-50 text-indigo-600 border-indigo-100";

//   return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//***************************************************working code pahse 111 4/02/26******************************************************************* */
// import React, { useState, useMemo, useEffect } from "react";

// import {
//   FileSpreadsheet,
//   Webhook,
//   UserPlus,
//   Filter,
//   Search,
//   Mail,
//   MoreHorizontal,
//   ExternalLink,
//   Briefcase,
//   MapPin,
//   X,
//   Check,
//   GraduationCap,
//   ChevronDown,
//   Calendar,
//   Zap,
//   ArrowUpRight,
//   Eye,
//   FileText,
//   Award,
//   Download,
//   AlertCircle,
// } from "lucide-react";
// import { candidateService } from "../../services/candidateService";
// import toast from "react-hot-toast";
// import { getJobTemplates } from "../../services/jobTemplateService";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---

//   // const [candidates, setCandidates] = useState([
//   //   {
//   //     id: 1,
//   //     name: "Jane Doe",
//   //     email: "jane.doe@example.com",
//   //     exp: 8,
//   //     location: "Mumbai, MH",
//   //     source: "Excel Import",
//   //     position: "Fullstack Dev",
//   //     education: "B.Tech",
//   //     selected: false,
//   //     cvUrl:
//   //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   //   },

//   //   {
//   //     id: 2,
//   //     name: "Arjun Mehta",
//   //     email: "arjun.m@tech.com",
//   //     exp: 4,
//   //     location: "Bangalore, KA",
//   //     source: "Webhook",
//   //     position: "UI Designer",
//   //     education: "Masters",
//   //     selected: false,
//   //     cvUrl: null,
//   //   },

//   //   {
//   //     id: 3,
//   //     name: "Sarah Smith",
//   //     email: "sarah.s@global.com",
//   //     exp: 12,
//   //     location: "Remote",
//   //     source: "Manual Entry",
//   //     position: "Product Manager",
//   //     education: "MBA",
//   //     selected: false,
//   //     cvUrl:
//   //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//   //   },

//   //   {
//   //     id: 4,
//   //     name: "Rahul Verma",
//   //     email: "rahul.v@dev.io",
//   //     exp: 2,
//   //     location: "Delhi, NCR",
//   //     source: "Excel Import",
//   //     position: "Fullstack Dev",
//   //     education: "B.Tech",
//   //     selected: false,
//   //     cvUrl: null,
//   //   },
//   // ]);
//   const [candidates, setCandidates] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // --- NEW STATE FOR SOURCE MODALS ---
//   const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [webhookUrl, setWebhookUrl] = useState("");
//   const [isTestingConnection, setIsTestingConnection] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
//   const [expProof, setExpProof] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMailModalOpen, setIsMailModalOpen] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [customRole, setCustomRole] = useState("");
//   const [customContent, setCustomContent] = useState("");
//   const [saveAsTemplate, setSaveAsTemplate] = useState(false);
//   const [newTemplateTitle, setNewTemplateTitle] = useState("");
//   const [excelFile, setExcelFile] = useState(null);
//   const [isImporting, setIsImporting] = useState(false);
//   const [errors, setErrors] = useState({});
//   // --- PAGINATION STATE ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 2;

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   email: "",
//   //   phone: "",
//   //   address: "",
//   //   exp: "",
//   //   position: "",
//   //   education: "",
//   // });

//   const validate = (rules) => {
//     const newErrors = {};

//     Object.keys(rules).forEach((field) => {
//       const { value, required, pattern, message } = rules[field];

//       if (required && !value) {
//         newErrors[field] = "This field is required";
//       }

//       if (pattern && value && !pattern.test(value)) {
//         newErrors[field] = message;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     exp: "",
//     position: "",
//     education: "",
//     fileName: "",
//     cvFile: null,
//     expLetterName: "",
//     expLetterFile: null,
//   });
//   const [loadingCandidates, setLoadingCandidates] = useState(true);

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((c) => {
//       const name = c.name || c.full_name || "";
//       const email = c.email || c.email_address || "";

//       const matchesSearch =
//         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition =
//         filters.position === "All Positions" || c.position === filters.position;

//       const matchesEducation =
//         filters.education === "All Education" ||
//         c.education === filters.education;

//       let matchesExperience = true;

//       if (filters.experience === "Junior (0-3 yrs)")
//         matchesExperience = Number(c.exp || c.experience) <= 3;

//       if (filters.experience === "Mid (4-7 yrs)")
//         matchesExperience =
//           Number(c.exp || c.experience) >= 4 &&
//           Number(c.exp || c.experience) <= 7;

//       if (filters.experience === "Senior (8+ yrs)")
//         matchesExperience = Number(c.exp || c.experience) >= 8;

//       return (
//         matchesSearch &&
//         matchesPosition &&
//         matchesEducation &&
//         matchesExperience
//       );
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   useEffect(() => {
//     const loadCandidates = async () => {
//       try {
//         const data = await candidateService.getAll();

//         console.log("API DATA:", data); // debug

//         const mapped = data.map((c) => ({
//           id: c.id,
//           name: c.full_name || c.name,
//           email: c.email,
//           exp: c.experience,
//           location: c.location,
//           position: c.position,
//           education: c.education,
//           source: c.entry_method || "API",
//           selected: false,
//           cvUrl: c.resume_path,
//           expLetterUrl: c.experience_letter_path,
//         }));

//         setCandidates(mapped);
//       } catch (err) {
//         console.error("API ERROR:", err);
//         toast.error("Failed to load candidates");
//       }
//     };

//     loadCandidates();
//   }, []);

//   useEffect(() => {
//     const loadTemplates = async () => {
//       try {
//         const data = await getJobTemplates();
//         setTemplates(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadTemplates();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, filters]);

//   const handleManualEntry = async (e) => {
//     e.preventDefault();

//     const isValid = validate({
//       name: { value: formData.name, required: true },
//       email: {
//         value: formData.email,
//         required: true,
//         pattern: /^\S+@\S+\.\S+$/,
//         message: "Invalid email address",
//       },
//       phone: {
//         value: formData.phone,
//         pattern: /^\d{10}$/,
//         message: "Enter 10 digit phone number",
//       },
//       position: { value: formData.position, required: true },
//       exp: { value: formData.exp, required: true },
//       address: { value: formData.address, required: true },
//     });

//     if (!isValid) {
//       toast.error("Please fix form errors ❌");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formDataApi = new FormData();

//       // ✅ Backend field names
//       formDataApi.append("name", formData.name);
//       formDataApi.append("email", formData.email);
//       formDataApi.append("phone", formData.phone || "");
//       formDataApi.append("address", formData.address);
//       formDataApi.append("location", formData.address);
//       formDataApi.append("position", formData.position);
//       formDataApi.append("experience", formData.exp);
//       formDataApi.append("education", formData.education);
//       formDataApi.append("entry_method", "manual");

//       // ✅ Resume Upload
//       if (formData.cvFile) {
//         formDataApi.append("resumepdf", formData.cvFile);
//       }

//       // ✅ Experience Letter Upload
//       if (formData.expLetterFile) {
//         formDataApi.append("experience_letter", formData.expLetterFile);
//       }

//       // 🔥 API CALL
//       const createdCandidate =
//         await candidateService.createCandidate(formDataApi);

//       // Add candidate to UI
//       setCandidates((prev) => [
//         {
//           id: createdCandidate.id,
//           name: createdCandidate.full_name,
//           email: createdCandidate.email,
//           exp: createdCandidate.experience,
//           location: createdCandidate.location,
//           position: createdCandidate.position,
//           education: createdCandidate.education,
//           source: "Manual Entry",
//           selected: false,
//           cvUrl: createdCandidate.resume_path,
//           expLetterUrl: createdCandidate.experience_letter_path,
//         },
//         ...prev,
//       ]);

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         exp: "",
//         position: "",
//         education: "",
//         fileName: "",
//         cvFile: null,
//         expLetterName: "",
//         expLetterFile: null,
//       });

//       setIsModalOpen(false);

//       // ✅ SUCCESS TOASTER
//       toast.success("Candidate uploaded successfully 🎉");
//     } catch (err) {
//       console.error("Create candidate failed:", err);
//       toast.error("Failed to upload candidate ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendJD = async () => {
//     try {
//       const selectedIds = candidates.filter((c) => c.selected).map((c) => c.id);

//       if (!selectedIds.length) {
//         toast.error("Please select candidates");
//         return;
//       }

//       const payload = {
//         candidate_ids: selectedIds,
//         template_id: Number(selectedTemplate),
//         custom_role: customRole,
//         custom_content: customContent,
//         save_as_new_template: saveAsTemplate,
//         new_template_title: newTemplateTitle,
//       };

//       await candidateService.sendJD(payload);

//       toast.success("JD sent successfully 🚀");

//       // ✅ CLOSE MODAL
//       setIsMailModalOpen(false);

//       // ✅ CLEAR MODAL FORM DATA
//       setSelectedTemplate("");
//       setCustomRole("");
//       setCustomContent("");
//       setSaveAsTemplate(false);
//       setNewTemplateTitle("");

//       // ✅ OPTIONAL: UNSELECT ALL CANDIDATES
//       setCandidates((prev) => prev.map((c) => ({ ...c, selected: false })));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send JD ❌");
//     }
//   };

//   // const toggleSelectAll = () => {
//   //   const allSelected = filteredCandidates.every((c) => c.selected);

//   //   setCandidates(
//   //     candidates.map((c) =>
//   //       filteredCandidates.find((f) => f.id === c.id)
//   //         ? { ...c, selected: !allSelected }
//   //         : c,
//   //     ),
//   //   );
//   // };

//   const toggleSelectAll = () => {
//     const allSelected = paginatedCandidates.every((c) => c.selected);

//     setCandidates((prev) =>
//       prev.map((c) =>
//         paginatedCandidates.find((p) => p.id === c.id)
//           ? { ...c, selected: !allSelected }
//           : c,
//       ),
//     );
//   };

//   const toggleSelect = (id) => {
//     setCandidates(
//       candidates.map((c) =>
//         c.id === id ? { ...c, selected: !c.selected } : c,
//       ),
//     );
//   };

//   const getInitials = (name = "") => {
//     if (!name) return "U";
//     const parts = name.split(" ");
//     return parts
//       .map((p) => p[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleExcelImport = async () => {
//     if (!excelFile) {
//       toast.error("Please select an Excel file ❌");
//       return;
//     }

//     try {
//       setIsImporting(true);

//       const formData = new FormData();
//       formData.append("file", excelFile); // 🔥 backend field name

//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/candidates/import",
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         // backend error message
//         throw new Error(data?.message || "Import failed");
//       }

//       toast.success(data?.message || "Candidates imported successfully 🎉");

//       // 🔁 Reload candidates after import
//       const updated = await candidateService.getAll();
//       setCandidates(
//         updated.map((c) => ({
//           id: c.id,
//           name: c.full_name || c.name,
//           email: c.email,
//           exp: c.experience,
//           location: c.location,
//           position: c.position,
//           education: c.education,
//           source: "Excel Import",
//           selected: false,
//           cvUrl: c.resume_path,
//           expLetterUrl: c.experience_letter_path,
//         })),
//       );

//       setActiveSourceModal(null);
//       setExcelFile(null);
//     } catch (err) {
//       console.error("Excel import error:", err);
//       toast.error(err.message || "Excel import failed ❌");
//     } finally {
//       setIsImporting(false);
//     }
//   };

//   const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

//   const paginatedCandidates = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     const end = start + ITEMS_PER_PAGE;
//     return filteredCandidates.slice(start, end);
//   }, [filteredCandidates, currentPage]);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div onClick={() => setActiveSourceModal("excel")}>
//           <SourceCard
//             icon={<FileSpreadsheet />}
//             title="Excel Import"
//             desc="Bulk upload .csv or .xlsx"
//             color="emerald"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setActiveSourceModal("webhook")}>
//           <SourceCard
//             icon={<Webhook />}
//             title="API Webhook"
//             desc="Connect LinkedIn/Indeed"
//             color="indigo"
//             isAction // Added isAction for hover effect
//           />
//         </div>

//         <div onClick={() => setIsModalOpen(true)}>
//           <SourceCard
//             icon={<UserPlus />}
//             title="Manual Entry"
//             desc="Single candidate record"
//             color="blue"
//             isAction
//           />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}

//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />

//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
//             Filters
//           </span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={[
//             "All Positions",
//             "Fullstack Dev",
//             "UI Designer",
//             "Product Manager",
//           ]}
//           value={filters.position}
//           onChange={(v) => setFilters({ ...filters, position: v })}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={[
//             "All Experience",
//             "Junior (0-3 yrs)",
//             "Mid (4-7 yrs)",
//             "Senior (8+ yrs)",
//           ]}
//           value={filters.experience}
//           onChange={(v) => setFilters({ ...filters, experience: v })}
//         />

//         <FilterDropdown
//           label="Education"
//           options={["All Education", "B.Tech", "Masters", "MBA"]}
//           value={filters.education}
//           onChange={(v) => setFilters({ ...filters, education: v })}
//         />

//         <button
//           onClick={() =>
//             setFilters({
//               position: "All Positions",
//               experience: "All Experience",
//               education: "All Education",
//             })
//           }
//           className="ml-auto text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           Reset All
//         </button>
//       </div>

//       {/* TABLE CONTAINER */}

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
//         {/* Toolbar */}

//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight text-slate-800">
//               Candidate Pool
//             </h2>

//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
//                 size={16}
//               />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>

//             {/* <button
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button> */}
//             <button
//               onClick={() => setIsMailModalOpen(true)}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
//                 candidates.some((c) => c.selected)
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
//               }`}
//               disabled={!candidates.some((c) => c.selected)}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {/* Add table-auto or table-fixed depending on how rigid you want it */}
//           <table className="w-full border-collapse table-auto">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 {/* Fixed narrow width for checkbox */}
//                 <th className="w-16 px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     // checked={
//                     //   filteredCandidates.length > 0 &&
//                     //   filteredCandidates.every((c) => c.selected)
//                     // }
//                     checked={
//                       paginatedCandidates.length > 0 &&
//                       paginatedCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

//                 {/* This column will take most of the space */}
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Candidate Info
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Position & Exp
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Education
//                 </th>

//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                   Source
//                 </th>

//                 {/* Explicitly narrow the Actions column */}
//                 <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {/* {filteredCandidates.map((c) => ( */}
//               {paginatedCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {/* {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)} */}
//                         {(c.name || "U").charAt(0)}
//                         {(c.name?.split(" ")[1] || "").charAt(0)}
//                       </div>
//                       <div className="min-w-0">
//                         {" "}
//                         {/* Prevents text from breaking layout */}
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {c.name}
//                         </p>
//                         <p className="text-[11px] text-slate-500 font-medium truncate">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp}
//                         {/* <Calendar size={12} /> {c.exp} Years Exp */}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 whitespace-nowrap">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>
//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <span
//                       className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   {/* Action cell with forced narrow width */}
//                   <td className="px-8 py-5 text-right w-24">
//                     <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                         title="View Profile"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {/* PAGINATION */}
//           {totalPages >= 1 && (
//             <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-white">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   className="px-4 py-2 rounded-xl text-[10px] font-black uppercase
//           bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
//                 >
//                   Prev
//                 </button>

//                 {/* {[...Array(totalPages)].map((_, i) => (
//         <button
//           key={i}
//           onClick={() => setCurrentPage(i + 1)}
//           className={`w-8 h-8 rounded-xl text-[10px] font-black
//             ${
//               currentPage === i + 1
//                 ? "bg-blue-600 text-white shadow"
//                 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//             }`}
//         >
//           {i + 1}
//         </button>
//       ))} */}
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const page =
//                     Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;

//                   return (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-8 h-8 rounded-xl text-[10px] font-black
//           ${
//             currentPage === page
//               ? "bg-blue-600 text-white shadow"
//               : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//           }`}
//                     >
//                       {page}
//                     </button>
//                   );
//                 })}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(p + 1, totalPages))
//                   }
//                   className="px-4 py-2 rounded-xl text-[10px] font-black uppercase
//           bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//           {/* High-End Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           {/* Main Modal Container */}
//           <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
//             {/* 1. Integrated Header Section */}
//             <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//               <div className="flex items-center gap-6">
//                 <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
//                   {/* {selectedCandidate.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")} */}
//                   {getInitials(selectedCandidate?.name)}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">
//                       {selectedCandidate.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}
//                     >
//                       {selectedCandidate.source}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Mail size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.email}
//                     </span>
//                     <span className="w-1 h-1 bg-slate-200 rounded-full" />
//                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                       <Briefcase size={12} className="text-blue-500" />{" "}
//                       {selectedCandidate.position}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//                   <Download size={14} /> Download CV
//                 </button>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             {/* 2. Main Content Area */}
//             <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
//               {/* Quick Info Bar */}
//               <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//                 <QuickMetric
//                   label="Experience"
//                   value={`${selectedCandidate.exp} Years`}
//                 />
//                 <QuickMetric
//                   label="Education"
//                   value={selectedCandidate.education}
//                 />
//                 <QuickMetric
//                   label="Location"
//                   value={selectedCandidate.location}
//                 />
//                 <QuickMetric
//                   label="Candidate ID"
//                   value={`#TR-${selectedCandidate.id}`}
//                 />
//               </div>

//               {/* The PDF Viewer Surface */}
//               <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//                 <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                       className="w-full h-full border-none"
//                       title="Resume Viewer"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                         <FileText size={48} />
//                       </div>
//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Missing Curriculum Vitae
//                       </h5>
//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                         This record does not have a professional resume
//                         attached.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 3. Status Footer / Progress Bar */}
//             <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div
//                       key={i}
//                       className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Shared with 3 Hiring Managers
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">
//                   Application Health
//                 </span>
//                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MANUAL ENTRY MODAL (EXISITING) */}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* HEADER */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800 tracking-tight">
//                   New Candidate
//                 </h3>
//                 <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//                   Manual Record Entry
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               {/* ROW 1: Identity */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Full Name"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(v) => setFormData({ ...formData, name: v })}
//                 />
//                 <InputField
//                   label="Email Address"
//                   placeholder="john@example.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(v) => setFormData({ ...formData, email: v })}
//                 />
//               </div>

//               {/* ROW 2: Professional Details */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Position"
//                   placeholder="e.g. Fullstack Dev"
//                   value={formData.position}
//                   onChange={(v) => setFormData({ ...formData, position: v })}
//                 />
//                 <InputField
//                   label="Years of Experience"
//                   placeholder="e.g. 5"
//                   type="number"
//                   value={formData.exp}
//                   onChange={(v) => setFormData({ ...formData, exp: v })}
//                 />
//               </div>

//               {/* ROW 3: Contact & Education */}
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Phone Number"
//                   placeholder="+91 00000 00000"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(v) => setFormData({ ...formData, phone: v })}
//                 />
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                   value={formData.education}
//                   onChange={(v) => setFormData({ ...formData, education: v })}
//                 />
//               </div>

//               {/* ROW 4: Geography */}
//               <div className="grid grid-cols-1">
//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   value={formData.address}
//                   onChange={(v) => setFormData({ ...formData, address: v })}
//                 />
//               </div>

//               {/* --- DOCUMENT UPLOAD SECTION --- */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//                   Supporting Documents
//                 </label>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* RESUME UPLOAD */}
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           fileName: file.name,
//                           cvFile: file,
//                           cvUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div
//                       className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg mb-2 ${formData.fileName ? "bg-blue-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
//                       >
//                         {formData.fileName ? (
//                           <Check size={16} />
//                         ) : (
//                           <FileText size={16} />
//                         )}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.fileName
//                           ? formData.fileName
//                           : "Upload Resume"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* EXPERIENCE LETTER UPLOAD */}
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setFormData({
//                           ...formData,
//                           expLetterName: file.name,
//                           expLetterFile: file,
//                           expLetterUrl: URL.createObjectURL(file),
//                         });
//                       }}
//                     />
//                     <div
//                       className={`border-2 border-dashed rounded-[1.5rem] p-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
//                       ${formData.expLetterName ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50 group-hover:border-emerald-400 group-hover:bg-emerald-50/50"}`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg mb-2 ${formData.expLetterName ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}
//                       >
//                         {formData.expLetterName ? (
//                           <Check size={16} />
//                         ) : (
//                           <Award size={16} />
//                         )}
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-700 text-center line-clamp-1 px-2">
//                         {formData.expLetterName
//                           ? formData.expLetterName
//                           : "Experience Letter"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-[8px] font-bold text-slate-400 uppercase text-center tracking-widest mt-2">
//                   Maximum file size: 10MB per document
//                 </p>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-60"
//                 >
//                   {loading ? (
//                     "Saving..."
//                   ) : (
//                     <>
//                       <Check size={16} /> Save Candidate
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- ENTERPRISE SOURCE PROTOCOL MODAL --- */}
//       {activeSourceModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setActiveSourceModal(null)}
//           />

//           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header */}
//             <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`p-4 rounded-2xl ${activeSourceModal === "excel" ? "bg-emerald-500" : "bg-indigo-500"} text-white shadow-xl`}
//                 >
//                   {activeSourceModal === "excel" ? (
//                     <FileSpreadsheet size={24} />
//                   ) : (
//                     <Webhook size={24} />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
//                     {activeSourceModal === "excel"
//                       ? "Bulk Data Ingestion"
//                       : "API Endpoint Configuration"}
//                   </h3>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//                     {activeSourceModal === "excel"
//                       ? "Protocol: CSV / XLSX Source"
//                       : "Protocol: Restful Webhook"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setActiveSourceModal(null)}
//                 className="p-3 hover:bg-white rounded-2xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8">
//               {activeSourceModal === "excel" ? (
//                 <>
//                   {/* Formatting Note */}
//                   <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
//                     <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
//                       <AlertCircle size={20} />
//                     </div>
//                     <div className="space-y-1">
//                       <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">
//                         Required Schema Format
//                       </h4>
//                       <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed">
//                         To ensure successful synchronization, please arrange
//                         your columns in the following order:
//                         <span className="text-amber-900">
//                           {" "}
//                           Full Name, Email, Position, Experience (Years), and
//                           Education.
//                         </span>
//                         Empty rows will be automatically discarded during
//                         parsing.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Dropzone Area */}
//                   <div className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
//                     {/* <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       accept=".csv, .xlsx"
//                     /> */}
//                     <input
//                       type="file"
//                       accept=".csv,.xlsx"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (!file) return;
//                         setExcelFile(file);
//                       }}
//                     />

//                     <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
//                       <Download size={32} />
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-500 mt-2">
//                       {excelFile ? excelFile.name : "No file selected"}
//                     </p>

//                     <p className="text-sm font-black text-slate-800 tracking-tight">
//                       Deploy Spreadsheet File
//                     </p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
//                       Max Payload: 25MB
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 /* Webhook UI - Enterprise Entry Mode */
//                 <div className="space-y-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between ml-1">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Destination Endpoint
//                       </label>
//                       <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase">
//                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                         System Ready
//                       </span>
//                     </div>

//                     <div className="relative group">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                         <Webhook size={18} />
//                       </div>
//                       <input
//                         type="text"
//                         value={webhookUrl}
//                         onChange={(e) => setWebhookUrl(e.target.value)}
//                         placeholder="https://your-api-endpoint.com/hooks"
//                         className="w-full pl-12 pr-4 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm font-mono text-indigo-300 placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
//                       />
//                     </div>
//                   </div>

//                   {/* Connection Guidance */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Method
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         POST Request
//                       </p>
//                     </div>
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Auth Type
//                       </p>
//                       <p className="text-xs font-bold text-slate-700">
//                         Bearer Token
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 flex items-start gap-4">
//                     <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
//                       <AlertCircle size={16} />
//                     </div>
//                     <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
//                       Ensure your endpoint is configured to accept{" "}
//                       <span className="underline">JSON payloads</span>. The
//                       system will send a ping request to verify this URL upon
//                       activation.
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {/* --- PLACE THE NEW BUTTON CODE HERE --- */}
//               <button
//                 disabled={
//                   isImporting || (activeSourceModal === "excel" && !excelFile)
//                 }
//                 className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
//             ${
//               activeSourceModal === "excel"
//                 ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
//                 : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
//             }`}
//                 onClick={() => {
//                   if (activeSourceModal === "excel") {
//                     handleExcelImport();
//                   } else {
//                     setIsTestingConnection(true);
//                     setTimeout(() => {
//                       setIsTestingConnection(false);
//                       setActiveSourceModal(null);
//                       toast.success("Webhook activated successfully 🚀");
//                     }, 2000);
//                   }
//                 }}
//               >
//                 {isTestingConnection ? (
//                   <>
//                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Verifying Protocol...
//                   </>
//                 ) : activeSourceModal === "excel" ? (
//                   "Begin Synchronized Ingestion"
//                 ) : (
//                   "Activate Webhook"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isMailModalOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
//           {/* Backdrop with extreme glass effect */}
//           <div
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
//             onClick={() => setIsMailModalOpen(false)}
//           />

//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
//             {/* Header: Communication Hub */}
//             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
//                   <Zap size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
//                     Transmission Protocol
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//                     Deploying Job Architecture
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsMailModalOpen(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               {/* Template Selector Section */}
//               <div className="space-y-2">
//                 <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                   Select Source Template
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                     <FileText size={16} />
//                   </div>
//                   <select
//                     value={selectedTemplate}
//                     onChange={(e) => setSelectedTemplate(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
//                   >
//                     <option value="">Manual Override (No Template)</option>
//                     {templates.map((t) => (
//                       <option key={t.id} value={t.id}>
//                         {t.title}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
//                     <Filter size={14} />
//                   </div>
//                 </div>
//               </div>

//               {/* Dynamic Fields Grid */}
//               {/* <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Effective Role Designation
//                   </label>
//                   <input
//                     placeholder="e.g. Senior Logic Architect"
//                     value={customRole}
//                     onChange={(e) => setCustomRole(e.target.value)}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all placeholder:text-slate-300"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                     Custom Logic Payload
//                   </label>
//                   <textarea
//                     placeholder="Define specific transmission content..."
//                     value={customContent}
//                     onChange={(e) => setCustomContent(e.target.value)}
//                     className="w-full h-32 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all resize-none leading-relaxed"
//                   />
//                 </div>
//               </div>

//               <div
//                 className={`p-4 rounded-2xl border transition-all duration-500 ${saveAsTemplate ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"}`}
//               >
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={saveAsTemplate}
//                       onChange={(e) => setSaveAsTemplate(e.target.checked)}
//                       className="peer sr-only"
//                     />
//                     <div className="w-10 h-5 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
//                     <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
//                   </div>
//                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
//                     Commit to Registry as New Template
//                   </span>
//                 </label>

//                 {saveAsTemplate && (
//                   <div className="mt-4 animate-in slide-in-from-top-2">
//                     <input
//                       placeholder="Input New Registry Name"
//                       value={newTemplateTitle}
//                       onChange={(e) => setNewTemplateTitle(e.target.value)}
//                       className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-blue-700 outline-none placeholder:text-blue-200"
//                     />
//                   </div>
//                 )}
//               </div> */}
//             </div>

//             {/* Footer Actions */}
//             <div className="p-6 bg-slate-900 flex gap-3">
//               <button
//                 onClick={() => setIsMailModalOpen(false)}
//                 className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
//               >
//                 Abort
//               </button>

//               <button
//                 onClick={handleSendJD}
//                 className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
//               >
//                 Execute Transmission
//                 <ArrowUpRight
//                   size={14}
//                   className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-4">
//     <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 shadow-sm">
//       {icon}
//     </div>

//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SidebarItem = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm hover:rounded-2xl transition-all border border-transparent group">
//     <div className="p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>

//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
//         {label}
//       </p>

//       <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">
//       {label}
//     </span>

//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={14}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
//       />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//   const colors = {
//     emerald:
//       "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",

//     indigo:
//       "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

//     blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
//   };

//   return (
//     <div
//       className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? "cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1" : ""}`}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//             {title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
//             {desc}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
// //   <div className="space-y-1.5">
// //     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
// //       {label}
// //     </label>

// //     <input
// //       required
// //       type={type}
// //       value={value}
// //       onChange={(e) => onChange(e.target.value)}
// //       placeholder={placeholder}
// //       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
// //     />
// //   </div>
// // );

// const InputField = ({
//   label,
//   placeholder,
//   type = "text",
//   value,
//   onChange,
//   error,
// }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//     </label>

//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none transition-all
//         ${
//           error
//             ? "bg-red-50 border-red-300 focus:ring-red-500/10"
//             : "bg-slate-50 border-slate-200 focus:ring-blue-500/5"
//         }`}
//     />

//     {error && (
//       <p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
//       {label}
//     </p>
//     <p className="text-xs font-black text-slate-800">{value}</p>
//   </div>
// );

// const getSourceStyles = (source) => {
//   if (source === "Excel Import")
//     return "bg-emerald-50 text-emerald-600 border-emerald-100";

//   if (source === "Webhook")
//     return "bg-indigo-50 text-indigo-600 border-indigo-100";

//   return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
