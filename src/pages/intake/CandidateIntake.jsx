import React, { useState, useMemo } from "react";

import {
  FileSpreadsheet,
  Webhook,
  UserPlus,
  Filter,
  Search,
  Mail,
  MoreHorizontal,
  ExternalLink,
  Briefcase,
  MapPin,
  X,
  Check,
  GraduationCap,
  ChevronDown,
  Calendar,
  Eye,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";

const CandidateIntake = () => {
  // --- EXTENDED MOCK DATA ---

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      exp: 8,
      location: "Mumbai, MH",
      source: "Excel Import",
      position: "Fullstack Dev",
      education: "B.Tech",
      selected: false,
      cvUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },

    {
      id: 2,
      name: "Arjun Mehta",
      email: "arjun.m@tech.com",
      exp: 4,
      location: "Bangalore, KA",
      source: "Webhook",
      position: "UI Designer",
      education: "Masters",
      selected: false,
      cvUrl: null,
    },

    {
      id: 3,
      name: "Sarah Smith",
      email: "sarah.s@global.com",
      exp: 12,
      location: "Remote",
      source: "Manual Entry",
      position: "Product Manager",
      education: "MBA",
      selected: false,
      cvUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },

    {
      id: 4,
      name: "Rahul Verma",
      email: "rahul.v@dev.io",
      exp: 2,
      location: "Delhi, NCR",
      source: "Excel Import",
      position: "Fullstack Dev",
      education: "B.Tech",
      selected: false,
      cvUrl: null,
    },
  ]);

  // --- NEW STATE FOR SOURCE MODALS ---
  const [activeSourceModal, setActiveSourceModal] = useState(null); // 'excel', 'webhook', or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog
const [expProof, setExpProof] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- FILTER STATES ---

  const [filters, setFilters] = useState({
    position: "All Positions",

    experience: "All Experience",

    education: "All Education",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    exp: "",
    position: "Fullstack Dev",
    education: "B.Tech",
  });

  // --- FILTERING LOGIC ---

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition =
        filters.position === "All Positions" || c.position === filters.position;

      const matchesEducation =
        filters.education === "All Education" ||
        c.education === filters.education;

      let matchesExperience = true;

      if (filters.experience === "Junior (0-3 yrs)")
        matchesExperience = c.exp <= 3;

      if (filters.experience === "Mid (4-7 yrs)")
        matchesExperience = c.exp >= 4 && c.exp <= 7;

      if (filters.experience === "Senior (8+ yrs)")
        matchesExperience = c.exp >= 8;

      return (
        matchesSearch &&
        matchesPosition &&
        matchesEducation &&
        matchesExperience
      );
    });
  }, [candidates, searchQuery, filters]);

  // --- HANDLERS ---

  const handleManualEntry = (e) => {
    e.preventDefault();

    const newCandidate = {
      id: Date.now(),
      ...formData,
      exp: parseInt(formData.exp),
      source: "Manual Entry",
      selected: false,
      cvUrl: formData.cvUrl || null,
    };

    setCandidates([newCandidate, ...candidates]);

    setIsModalOpen(false);
  };

  const toggleSelectAll = () => {
    const allSelected = filteredCandidates.every((c) => c.selected);

    setCandidates(
      candidates.map((c) =>
        filteredCandidates.find((f) => f.id === c.id)
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
      {/* SOURCE CONTROL HEADER */}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* <SourceCard
          icon={<FileSpreadsheet />}
          title="Excel Import"
          desc="Bulk upload .csv or .xlsx"
          color="emerald"
        />

        <SourceCard
          icon={<Webhook />}
          title="API Webhook"
          desc="Connect LinkedIn/Indeed"
          color="indigo"
        />

        <div onClick={() => setIsModalOpen(true)}>
          <SourceCard
            icon={<UserPlus />}
            title="Manual Entry"
            desc="Single candidate record"
            color="blue"
            isAction
          />
        </div> */}
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

        <button
          onClick={() =>
            setFilters({
              position: "All Positions",
              experience: "All Experience",
              education: "All Education",
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

            <button
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            >
              <Mail size={14} /> Shoot Mail
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
                      filteredCandidates.length > 0 &&
                      filteredCandidates.every((c) => c.selected)
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
              {filteredCandidates.map((c) => (
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
                        {c.name.charAt(0)}
                        {c.name.split(" ")[1]?.charAt(0)}
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
                        <Calendar size={12} /> {c.exp} Years Exp
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
        </div>
      </div>

      {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

      {/* --- ENTERPRISE POPUP PREVIEW --- */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
          {/* High-End Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setSelectedCandidate(null)}
          />

          {/* Main Modal Container */}
          <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
            {/* 1. Integrated Header Section */}
            <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
                  {selectedCandidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <Mail size={12} className="text-blue-500" />{" "}
                      {selectedCandidate.email}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <Briefcase size={12} className="text-blue-500" />{" "}
                      {selectedCandidate.position}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
                  <Download size={14} /> Download CV
                </button>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {/* Quick Info Bar */}
              <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
                <QuickMetric
                  label="Experience"
                  value={`${selectedCandidate.exp} Years`}
                />
                <QuickMetric
                  label="Education"
                  value={selectedCandidate.education}
                />
                <QuickMetric
                  label="Location"
                  value={selectedCandidate.location}
                />
                <QuickMetric
                  label="Candidate ID"
                  value={`#TR-${selectedCandidate.id}`}
                />
              </div>

              {/* The PDF Viewer Surface */}
              <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
                <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
                  {selectedCandidate.cvUrl ? (
                    <iframe
                      src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
                      className="w-full h-full border-none"
                      title="Resume Viewer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
                        <FileText size={48} />
                      </div>
                      <h5 className="text-xl font-black text-slate-800 tracking-tight">
                        Missing Curriculum Vitae
                      </h5>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
                        This record does not have a professional resume
                        attached.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Status Footer / Progress Bar */}
            <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                    />
                  ))}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Shared with 3 Hiring Managers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Application Health
                </span>
                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ENTRY MODAL (EXISITING) */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  New Candidate
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
                  Manual Record Entry
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualEntry} className="p-8 space-y-5">
              {/* ROW 1 */}
              <div className="grid grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
                <InputField
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                />
              </div>

              {/* ROW 2 */}
              <div className="grid grid-cols-2 gap-5">
                <InputField
                  label="Position"
                  placeholder="e.g. Fullstack Dev"
                  value={formData.position}
                  onChange={(v) => setFormData({ ...formData, position: v })}
                />
                <InputField
                  label="Years of Experience"
                  placeholder="e.g. 5"
                  type="number"
                  value={formData.exp}
                  onChange={(v) => setFormData({ ...formData, exp: v })}
                />
              </div>

              {/* ROW 3 */}
              <div className="grid grid-cols-2 gap-5">
                <InputField
                  label="Education"
                  placeholder="e.g. B.Tech"
                  value={formData.education}
                  onChange={(v) => setFormData({ ...formData, education: v })}
                />
                <InputField
                  label="Location"
                  placeholder="Mumbai, MH"
                  value={formData.address}
                  onChange={(v) => setFormData({ ...formData, address: v })}
                />
              </div>

              {/* --- ENTERPRISE UPLOAD SECTION --- */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                  Resume / Curriculum Vitae
                </label>
                <div className="relative group">
                  {/* Hidden Input for Functionality */}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const previewUrl = URL.createObjectURL(file);

                      setFormData({
                        ...formData,
                        fileName: file.name,
                        cvFile: file,
                        cvUrl: previewUrl, // 🔥 important
                      });
                    }}
                  />

                  {/* Visual UI Box */}
                  <div
                    className={`
              border-2 border-dashed rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col items-center justify-center
              ${formData.fileName ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}
            `}
                  >
                    <div
                      className={`
                p-3 rounded-xl mb-3 transition-colors
                ${formData.fileName ? "bg-blue-500 text-white" : "bg-white text-slate-400 shadow-sm group-hover:text-blue-500"}
              `}
                    >
                      {formData.fileName ? (
                        <Check size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">
                        {formData.fileName
                          ? formData.fileName
                          : "Click or drag to upload candidate CV"}
                      </p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                        Supported formats: PDF, DOCX (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Save Candidate
                </button>
              </div>
            </form>
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
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".csv, .xlsx"
                    />
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white shadow-inner mb-4 transition-all">
                      <Download size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-800 tracking-tight">
                      Deploy Spreadsheet File
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                      Max Payload: 25MB
                    </p>
                  </div>
                </>
              ) : (
                /* Webhook UI */
                // <div className="space-y-6">
                //   <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
                //     <div className="flex items-center justify-between">
                //       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Endpoint URL</span>
                //       <span className="text-[9px] font-bold text-slate-500 uppercase">Status: Active</span>
                //     </div>
                //     <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                //       <code className="text-xs font-mono text-indigo-300 overflow-hidden text-ellipsis">https://api.talent-os.io/v1/webhook/TR-9921</code>
                //       <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><ExternalLink size={14}/></button>
                //     </div>
                //   </div>
                //   <p className="text-[11px] text-slate-500 font-bold text-center italic">
                //     "System is listening for incoming POST requests from LinkedIn and Indeed integration."
                //   </p>
                // </div>
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

              {/* <button 
          className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl ${activeSourceModal === 'excel' ? 'bg-emerald-600 shadow-emerald-200 text-white' : 'bg-slate-900 shadow-slate-200 text-white'}`}
          onClick={() => setActiveSourceModal(null)}
        >
          {activeSourceModal === 'excel' ? "Begin Synchronized Ingestion" : "Validate Connection"}
        </button> */}
              {/* --- PLACE THE NEW BUTTON CODE HERE --- */}
              <button
                className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
            ${
              activeSourceModal === "excel"
                ? "bg-emerald-600 shadow-emerald-200 text-white hover:bg-emerald-700"
                : "bg-slate-900 shadow-slate-900/20 text-white hover:bg-black"
            }`}
                onClick={() => {
                  if (activeSourceModal === "webhook") {
                    setIsTestingConnection(true);
                    // Simulate a verification pulse
                    setTimeout(() => {
                      setIsTestingConnection(false);
                      setActiveSourceModal(null);
                    }, 2000);
                  } else {
                    setActiveSourceModal(null);
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

const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
      {label}
    </label>

    <input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
    />
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
//**************************************************working code phase 1*********************************************************** */
// import React, { useState, useMemo } from "react";

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
//   Eye,
//   FileText,
//   Download,
//   AlertCircle,
// } from "lucide-react";

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---

//   const [candidates, setCandidates] = useState([
//     {
//       id: 1,
//       name: "Jane Doe",
//       email: "jane.doe@example.com",
//       exp: 8,
//       location: "Mumbai, MH",
//       source: "Excel Import",
//       position: "Fullstack Dev",
//       education: "B.Tech",
//       selected: false,
//       cvUrl:
//         "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     },

//     {
//       id: 2,
//       name: "Arjun Mehta",
//       email: "arjun.m@tech.com",
//       exp: 4,
//       location: "Bangalore, KA",
//       source: "Webhook",
//       position: "UI Designer",
//       education: "Masters",
//       selected: false,
//       cvUrl: null,
//     },

//     {
//       id: 3,
//       name: "Sarah Smith",
//       email: "sarah.s@global.com",
//       exp: 12,
//       location: "Remote",
//       source: "Manual Entry",
//       position: "Product Manager",
//       education: "MBA",
//       selected: false,
//       cvUrl:
//         "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     },

//     {
//       id: 4,
//       name: "Rahul Verma",
//       email: "rahul.v@dev.io",
//       exp: 2,
//       location: "Delhi, NCR",
//       source: "Excel Import",
//       position: "Fullstack Dev",
//       education: "B.Tech",
//       selected: false,
//       cvUrl: null,
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Preview Dialog

//   const [searchQuery, setSearchQuery] = useState("");

//   // --- FILTER STATES ---

//   const [filters, setFilters] = useState({
//     position: "All Positions",

//     experience: "All Experience",

//     education: "All Education",
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     exp: "",
//     position: "Fullstack Dev",
//     education: "B.Tech",
//   });

//   // --- FILTERING LOGIC ---

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((c) => {
//       const matchesSearch =
//         c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         c.email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition =
//         filters.position === "All Positions" || c.position === filters.position;

//       const matchesEducation =
//         filters.education === "All Education" ||
//         c.education === filters.education;

//       let matchesExperience = true;

//       if (filters.experience === "Junior (0-3 yrs)")
//         matchesExperience = c.exp <= 3;

//       if (filters.experience === "Mid (4-7 yrs)")
//         matchesExperience = c.exp >= 4 && c.exp <= 7;

//       if (filters.experience === "Senior (8+ yrs)")
//         matchesExperience = c.exp >= 8;

//       return (
//         matchesSearch &&
//         matchesPosition &&
//         matchesEducation &&
//         matchesExperience
//       );
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---

//   const handleManualEntry = (e) => {
//     e.preventDefault();

//    const newCandidate = {
//   id: Date.now(),
//   ...formData,
//   exp: parseInt(formData.exp),
//   source: "Manual Entry",
//   selected: false,
//   cvUrl: formData.cvUrl || null,
// };

//     setCandidates([newCandidate, ...candidates]);

//     setIsModalOpen(false);
//   };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every((c) => c.selected);

//     setCandidates(
//       candidates.map((c) =>
//         filteredCandidates.find((f) => f.id === c.id)
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

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       {/* SOURCE CONTROL HEADER */}

//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard
//           icon={<FileSpreadsheet />}
//           title="Excel Import"
//           desc="Bulk upload .csv or .xlsx"
//           color="emerald"
//         />

//         <SourceCard
//           icon={<Webhook />}
//           title="API Webhook"
//           desc="Connect LinkedIn/Indeed"
//           color="indigo"
//         />

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
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some((c) => c.selected) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
//             >
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}

//         {/* <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredCandidates.length > 0 &&
//                       filteredCandidates.every((c) => c.selected)
//                     }
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>

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

//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr
//                   key={c.id}
//                   className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//                 >
//                   <td className="px-8 py-5 text-left">
//                     <input
//                       type="checkbox"
//                       checked={c.selected}
//                       onChange={() => toggleSelect(c.id)}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {c.name.charAt(0)}
//                         {c.name.split(" ")[1]?.charAt(0)}
//                       </div>

//                       <div>
//                         <p className="text-sm font-bold text-slate-800">
//                           {c.name}
//                         </p>

//                         <p className="text-[11px] text-slate-500 font-medium">
//                           {c.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" />{" "}
//                         {c.position}
//                       </div>

//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp} Years Exp
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                         <GraduationCap size={12} />
//                       </div>

//                       {c.education}
//                     </div>
//                   </td>

//                   <td className="px-4 py-5 text-[10px]">
//                     <span
//                       className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}
//                     >
//                       {c.source}
//                     </span>
//                   </td>

//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         onClick={() => setSelectedCandidate(c)}
//                         className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
//                       >
//                         <Eye size={16} />
//                       </button>

//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredCandidates.length === 0 && (
//             <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
//               No candidates match your filters
//             </div>
//           )}
//         </div> */}
//         <div className="overflow-x-auto">
//   {/* Add table-auto or table-fixed depending on how rigid you want it */}
//   <table className="w-full border-collapse table-auto">
//     <thead>
//       <tr className="bg-slate-50/50">
//         {/* Fixed narrow width for checkbox */}
//         <th className="w-16 px-8 py-4 text-left">
//           <input
//             type="checkbox"
//             checked={filteredCandidates.length > 0 && filteredCandidates.every((c) => c.selected)}
//             onChange={toggleSelectAll}
//             className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//           />
//         </th>

//         {/* This column will take most of the space */}
//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Candidate Info
//         </th>

//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Position & Exp
//         </th>

//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Education
//         </th>

//         <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//           Source
//         </th>

//         {/* Explicitly narrow the Actions column */}
//         <th className="w-24 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//           Actions
//         </th>
//       </tr>
//     </thead>

//     <tbody className="divide-y divide-slate-100">
//       {filteredCandidates.map((c) => (
//         <tr
//           key={c.id}
//           className={`group transition-colors ${c.selected ? "bg-blue-50/40" : "hover:bg-slate-50/80"}`}
//         >
//           <td className="px-8 py-5">
//             <input
//               type="checkbox"
//               checked={c.selected}
//               onChange={() => toggleSelect(c.id)}
//               className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//             />
//           </td>

//           <td className="px-4 py-5">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                 {c.name.charAt(0)}{c.name.split(" ")[1]?.charAt(0)}
//               </div>
//               <div className="min-w-0"> {/* Prevents text from breaking layout */}
//                 <p className="text-sm font-bold text-slate-800 truncate">{c.name}</p>
//                 <p className="text-[11px] text-slate-500 font-medium truncate">{c.email}</p>
//               </div>
//             </div>
//           </td>

//           <td className="px-4 py-5 whitespace-nowrap">
//             <div className="space-y-1">
//               <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                 <Briefcase size={12} className="text-blue-500" /> {c.position}
//               </div>
//               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                 <Calendar size={12} /> {c.exp} Years Exp
//               </div>
//             </div>
//           </td>

//           <td className="px-4 py-5 whitespace-nowrap">
//             <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//               <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
//                 <GraduationCap size={12} />
//               </div>
//               {c.education}
//             </div>
//           </td>

//           <td className="px-4 py-5">
//             <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase border whitespace-nowrap ${getSourceStyles(c.source)}`}>
//               {c.source}
//             </span>
//           </td>

//           {/* Action cell with forced narrow width */}
//           <td className="px-8 py-5 text-right w-24">
//             <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
//               <button
//                 onClick={() => setSelectedCandidate(c)}
//                 className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
//                 title="View Profile"
//               >
//                 <Eye size={16} />
//               </button>
//             </div>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>
//       </div>

//       {/* --- CANDIDATE PROFILE DIALOG (NEW) --- */}

//       {/* {selectedCandidate && (
//         <div className="fixed inset-0 z-[150] flex justify-end overflow-hidden">
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
//             onClick={() => setSelectedCandidate(null)}
//           />

//           <div className="relative w-full max-w-5xl bg-white h-full shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 ease-in-out">

//             <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//                 >
//                   <X size={20} />
//                 </button>

//                 <div className="h-6 w-[1px] bg-slate-100" />

//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                     Candidate ID:
//                   </span>

//                   <span className="text-[10px] font-black uppercase text-slate-900">
//                     #TR-{selectedCandidate.id}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
//                   Archive
//                 </button>

//                 <button className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
//                   <Calendar size={14} /> Schedule Interview
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 flex overflow-hidden">

//               <div className="w-[380px] border-r border-slate-100 overflow-y-auto bg-slate-50/30 p-8 space-y-8">

//                 <div className="space-y-6">
//                   <div className="flex flex-col items-center text-center p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
//                     <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-slate-200 mb-4">
//                       {selectedCandidate.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </div>

//                     <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//                       {selectedCandidate.name}
//                     </h3>

//                     <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-tighter">
//                       {selectedCandidate.position}
//                     </p>

//                     <div className="flex gap-2 mt-6 w-full">
//                       <button className="flex-1 p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
//                         <Mail size={18} className="mx-auto" />
//                       </button>

//                       <button className="flex-1 p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
//                         <MoreHorizontal size={18} className="mx-auto" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="p-4 bg-white border border-slate-100 rounded-2xl">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Experience
//                       </p>

//                       <p className="text-sm font-black text-slate-800">
//                         {selectedCandidate.exp} Yrs
//                       </p>
//                     </div>

//                     <div className="p-4 bg-white border border-slate-100 rounded-2xl">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Education
//                       </p>

//                       <p className="text-sm font-black text-slate-800">
//                         {selectedCandidate.education}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
//                     General Information
//                   </h4>

//                   <SidebarItem
//                     icon={<Mail size={14} />}
//                     label="Email Address"
//                     value={selectedCandidate.email}
//                   />

//                   <SidebarItem
//                     icon={<MapPin size={14} />}
//                     label="Location"
//                     value={selectedCandidate.location}
//                   />

//                   <SidebarItem
//                     icon={<Webhook size={14} />}
//                     label="Application Source"
//                     value={selectedCandidate.source}
//                   />
//                 </div>

//                 <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[10px] font-black text-emerald-700 uppercase">
//                       Current Stage
//                     </span>

//                     <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
//                   </div>

//                   <p className="text-lg font-black text-emerald-900 tracking-tight">
//                     Technical Review
//                   </p>
//                 </div>
//               </div>

//               <div className="flex-1 bg-white p-8 lg:p-12 flex flex-col">
//                 <div className="flex items-center justify-between mb-8">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
//                       <FileText size={24} />
//                     </div>

//                     <div>
//                       <h4 className="text-lg font-black text-slate-800 tracking-tight">
//                         Curriculum Vitae
//                       </h4>

//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         Verified Document • PDF
//                       </p>
//                     </div>
//                   </div>

//                   {selectedCandidate.cvUrl && (
//                     <div className="flex gap-3">
//                       <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
//                         <Download size={18} />
//                       </button>

//                       <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
//                         <ExternalLink size={18} />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden relative shadow-inner">
//                   {selectedCandidate.cvUrl ? (
//                     <iframe
//                       src={`${selectedCandidate.cvUrl}#view=FitH&toolbar=0`}
//                       className="w-full h-full border-none"
//                       title="Resume Preview"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm border border-slate-100">
//                         <AlertCircle size={32} />
//                       </div>

//                       <h5 className="text-xl font-black text-slate-800 tracking-tight">
//                         Document Not Found
//                       </h5>

//                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[280px] leading-relaxed">
//                         This candidate was added manually without an attached
//                         resume.
//                       </p>

//                       <button className="mt-8 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
//                         Request Document
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* --- ENTERPRISE POPUP PREVIEW --- */}
// {selectedCandidate && (
//   <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
//     {/* High-End Backdrop */}
//     <div
//       className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
//       onClick={() => setSelectedCandidate(null)}
//     />

//     {/* Main Modal Container */}
//     <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">

//       {/* 1. Integrated Header Section */}
//       <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
//         <div className="flex items-center gap-6">
//           <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-slate-200">
//             {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
//           </div>
//           <div>
//             <div className="flex items-center gap-3">
//               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCandidate.name}</h3>
//               <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase border tracking-[0.1em] ${getSourceStyles(selectedCandidate.source)}`}>
//                 {selectedCandidate.source}
//               </span>
//             </div>
//             <div className="flex items-center gap-4 mt-1">
//               <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                 <Mail size={12} className="text-blue-500"/> {selectedCandidate.email}
//               </span>
//               <span className="w-1 h-1 bg-slate-200 rounded-full"/>
//               <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
//                 <Briefcase size={12} className="text-blue-500"/> {selectedCandidate.position}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
//             <Download size={14} /> Download CV
//           </button>
//           {/* <button className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
//              Schedule Interview
//           </button> */}
//           <button onClick={() => setSelectedCandidate(null)} className="ml-2 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
//             <X size={24} />
//           </button>
//         </div>
//       </div>

//       {/* 2. Main Content Area */}
//       <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">

//         {/* Quick Info Bar */}
//         <div className="bg-white px-10 py-4 flex items-center gap-12 border-b border-slate-100">
//           <QuickMetric label="Experience" value={`${selectedCandidate.exp} Years`} />
//           <QuickMetric label="Education" value={selectedCandidate.education} />
//           <QuickMetric label="Location" value={selectedCandidate.location} />
//           <QuickMetric label="Candidate ID" value={`#TR-${selectedCandidate.id}`} />
//         </div>

//         {/* The PDF Viewer Surface */}
//         <div className="flex-1 p-6 lg:p-10 overflow-hidden flex flex-col items-center">
//           <div className="w-full h-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
//             {selectedCandidate.cvUrl ? (
//               <iframe
//                 src={`${selectedCandidate.cvUrl}#toolbar=0&view=FitH`}
//                 className="w-full h-full border-none"
//                 title="Resume Viewer"
//               />
//             ) : (
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
//                 <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
//                   <FileText size={48} />
//                 </div>
//                 <h5 className="text-xl font-black text-slate-800 tracking-tight">Missing Curriculum Vitae</h5>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-2 max-w-[320px] leading-loose">
//                   This record does not have a professional resume attached.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 3. Status Footer / Progress Bar */}
//       <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="flex -space-x-2">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
//             ))}
//           </div>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shared with 3 Hiring Managers</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-[10px] font-black text-slate-400 uppercase">Application Health</span>
//           <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//             <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

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
//                 <h3 className="text-xl font-black text-slate-800">
//                   New Candidate
//                 </h3>

//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">
//                   Manual Record Entry
//                 </p>
//               </div>

//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all"
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

//               <div className="grid grid-cols-2 gap-5">
//                 <InputField
//                   label="Education"
//                   placeholder="e.g. B.Tech"
//                   value={formData.education}
//                   onChange={(v) => setFormData({ ...formData, education: v })}
//                 />

//                 <InputField
//                   label="Location"
//                   placeholder="Mumbai, MH"
//                   value={formData.address}
//                   onChange={(v) => setFormData({ ...formData, address: v })}
//                 />
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
//                 >
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}

//       {isModalOpen && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//       onClick={() => setIsModalOpen(false)}
//     />

//     <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//       {/* HEADER */}
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div>
//           <h3 className="text-xl font-black text-slate-800 tracking-tight">
//             New Candidate
//           </h3>
//           <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">
//             Manual Record Entry
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//         {/* ROW 1 */}
//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             label="Full Name"
//             placeholder="e.g. John Doe"
//             value={formData.name}
//             onChange={(v) => setFormData({ ...formData, name: v })}
//           />
//           <InputField
//             label="Email Address"
//             placeholder="john@example.com"
//             type="email"
//             value={formData.email}
//             onChange={(v) => setFormData({ ...formData, email: v })}
//           />
//         </div>

//         {/* ROW 2 */}
//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             label="Position"
//             placeholder="e.g. Fullstack Dev"
//             value={formData.position}
//             onChange={(v) => setFormData({ ...formData, position: v })}
//           />
//           <InputField
//             label="Years of Experience"
//             placeholder="e.g. 5"
//             type="number"
//             value={formData.exp}
//             onChange={(v) => setFormData({ ...formData, exp: v })}
//           />
//         </div>

//         {/* ROW 3 */}
//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             label="Education"
//             placeholder="e.g. B.Tech"
//             value={formData.education}
//             onChange={(v) => setFormData({ ...formData, education: v })}
//           />
//           <InputField
//             label="Location"
//             placeholder="Mumbai, MH"
//             value={formData.address}
//             onChange={(v) => setFormData({ ...formData, address: v })}
//           />
//         </div>

//         {/* --- ENTERPRISE UPLOAD SECTION --- */}
//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//             Resume / Curriculum Vitae
//           </label>
//           <div className="relative group">
//             {/* Hidden Input for Functionality */}
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//              onChange={(e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const previewUrl = URL.createObjectURL(file);

//   setFormData({
//     ...formData,
//     fileName: file.name,
//     cvFile: file,
//     cvUrl: previewUrl, // 🔥 important
//   });
// }}

//             />

//             {/* Visual UI Box */}
//             <div className={`
//               border-2 border-dashed rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col items-center justify-center
//               ${formData.fileName ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50'}
//             `}>
//               <div className={`
//                 p-3 rounded-xl mb-3 transition-colors
//                 ${formData.fileName ? 'bg-blue-500 text-white' : 'bg-white text-slate-400 shadow-sm group-hover:text-blue-500'}
//               `}>
//                 {formData.fileName ? <Check size={20} /> : <FileText size={20} />}
//               </div>

//               <div className="text-center">
//                 <p className="text-xs font-bold text-slate-700">
//                   {formData.fileName ? formData.fileName : "Click or drag to upload candidate CV"}
//                 </p>
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">
//                   Supported formats: PDF, DOCX (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="pt-4 flex gap-3">
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(false)}
//             className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
//           >
//             <Check size={16} /> Save Candidate
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
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

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
//       {label}
//     </label>

//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const QuickMetric = ({ label, value }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
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
//*********************************working code************************************************ */

// import React, { useState, useMemo } from 'react';
// import {
//   FileSpreadsheet, Webhook, UserPlus, Filter, Search, Mail,
//   MoreHorizontal, ExternalLink, Briefcase, MapPin, X, Check,
//   GraduationCap, ChevronDown, Calendar
// } from 'lucide-react';

// const CandidateIntake = () => {
//   // --- EXTENDED MOCK DATA ---
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Jane Doe", email: "jane.doe@example.com", exp: 8, location: "Mumbai, MH", source: "Excel Import", position: "Fullstack Dev", education: "B.Tech", selected: false },
//     { id: 2, name: "Arjun Mehta", email: "arjun.m@tech.com", exp: 4, location: "Bangalore, KA", source: "Webhook", position: "UI Designer", education: "Masters", selected: false },
//     { id: 3, name: "Sarah Smith", email: "sarah.s@global.com", exp: 12, location: "Remote", source: "Manual Entry", position: "Product Manager", education: "MBA", selected: false },
//     { id: 4, name: "Rahul Verma", email: "rahul.v@dev.io", exp: 2, location: "Delhi, NCR", source: "Excel Import", position: "Fullstack Dev", education: "B.Tech", selected: false }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   // --- FILTER STATES ---
//   const [filters, setFilters] = useState({
//     position: 'All Positions',
//     experience: 'All Experience',
//     education: 'All Education'
//   });

//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', exp: '', position: 'Fullstack Dev', education: 'B.Tech' });

//   // --- FILTERING LOGIC ---
//   const filteredCandidates = useMemo(() => {
//     return candidates.filter(c => {
//       const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             c.email.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPosition = filters.position === 'All Positions' || c.position === filters.position;

//       const matchesEducation = filters.education === 'All Education' || c.education === filters.education;

//       let matchesExperience = true;
//       if (filters.experience === 'Junior (0-3 yrs)') matchesExperience = c.exp <= 3;
//       if (filters.experience === 'Mid (4-7 yrs)') matchesExperience = c.exp >= 4 && c.exp <= 7;
//       if (filters.experience === 'Senior (8+ yrs)') matchesExperience = c.exp >= 8;

//       return matchesSearch && matchesPosition && matchesEducation && matchesExperience;
//     });
//   }, [candidates, searchQuery, filters]);

//   // --- HANDLERS ---
//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     const newCandidate = {
//       id: Date.now(),
//       ...formData,
//       exp: parseInt(formData.exp),
//       source: "Manual Entry",
//       selected: false
//     };
//     setCandidates([newCandidate, ...candidates]);
//     setIsModalOpen(false);
//   };

//   const toggleSelectAll = () => {
//     const allSelected = filteredCandidates.every(c => c.selected);
//     setCandidates(candidates.map(c =>
//       filteredCandidates.find(f => f.id === c.id) ? { ...c, selected: !allSelected } : c
//     ));
//   };

//   const toggleSelect = (id) => {
//     setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">

//       {/* SOURCE CONTROL HEADER */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard icon={<FileSpreadsheet />} title="Excel Import" desc="Bulk upload .csv or .xlsx" color="emerald" />
//         <SourceCard icon={<Webhook />} title="API Webhook" desc="Connect LinkedIn/Indeed" color="indigo" />
//         <div onClick={() => setIsModalOpen(true)}>
//             <SourceCard icon={<UserPlus />} title="Manual Entry" desc="Single candidate record" color="blue" isAction />
//         </div>
//       </div>

//       {/* --- ENTERPRISE FILTER BAR --- */}
//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 px-3 border-r border-slate-100">
//           <Filter size={16} className="text-blue-600" />
//           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Filters</span>
//         </div>

//         <FilterDropdown
//           label="Position"
//           options={['All Positions', 'Fullstack Dev', 'UI Designer', 'Product Manager']}
//           value={filters.position}
//           onChange={(v) => setFilters({...filters, position: v})}
//         />

//         <FilterDropdown
//           label="Experience"
//           options={['All Experience', 'Junior (0-3 yrs)', 'Mid (4-7 yrs)', 'Senior (8+ yrs)']}
//           value={filters.experience}
//           onChange={(v) => setFilters({...filters, experience: v})}
//         />

//         <FilterDropdown
//           label="Education"
//           options={['All Education', 'B.Tech', 'Masters', 'MBA']}
//           value={filters.education}
//           onChange={(v) => setFilters({...filters, education: v})}
//         />

//         <button
//           onClick={() => setFilters({ position: 'All Positions', experience: 'All Experience', education: 'All Education' })}
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
//             <h2 className="text-xl font-black tracking-tight text-slate-800">Candidate Pool</h2>
//             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Results
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search name or email..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>
//             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${candidates.some(c => c.selected) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
//               <Mail size={14} /> Shoot Mail
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={filteredCandidates.length > 0 && filteredCandidates.every(c => c.selected)}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Info</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Position & Exp</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Education</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Source</th>
//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr key={c.id} className={`group transition-colors ${c.selected ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'}`}>
//                   <td className="px-8 py-5 text-left">
//                     <input
//                         type="checkbox"
//                         checked={c.selected}
//                         onChange={() => toggleSelect(c.id)}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-100 uppercase">
//                         {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{c.name}</p>
//                         <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <Briefcase size={12} className="text-blue-500" /> {c.position}
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <Calendar size={12} /> {c.exp} Years Exp
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                         <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><GraduationCap size={12} /></div>
//                         {c.education}
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-[10px]">
//                     <span className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}>
//                         {c.source}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink size={16} /></button>
//                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredCandidates.length === 0 && (
//             <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
//               No candidates match your filters
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL IS UNCHANGED BUT REQUIRES POSITION/EDUCATION INPUTS */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">New Candidate</h3>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Manual Record Entry</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 <InputField label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Position" placeholder="e.g. Fullstack Dev" value={formData.position} onChange={(v) => setFormData({...formData, position: v})} />
//                 <InputField label="Years of Experience" placeholder="e.g. 5" type="number" value={formData.exp} onChange={(v) => setFormData({...formData, exp: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Education" placeholder="e.g. B.Tech" value={formData.education} onChange={(v) => setFormData({...formData, education: v})} />
//                 <InputField label="Location" placeholder="Mumbai, MH" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- REFINED SUB-COMPONENTS ---
// const FilterDropdown = ({ label, options, value, onChange }) => (
//   <div className="flex flex-col min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">{label}</span>
//     <div className="relative group">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer pr-8"
//       >
//         {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//       </select>
//       <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
//     </div>
//   </div>
// );

// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//     const colors = {
//         emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
//         indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
//         blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
//     };
//     return (
//         <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1' : ''}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}>{icon}</div>
//                 <div>
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{desc}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const getSourceStyles = (source) => {
//     if (source === "Excel Import") return "bg-emerald-50 text-emerald-600 border-emerald-100";
//     if (source === "Webhook") return "bg-indigo-50 text-indigo-600 border-indigo-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
//*********************************************************************************************** */
// import React, { useState, useMemo } from 'react';
// import {
//   FileSpreadsheet, Webhook, UserPlus, Filter, Search, Mail,
//   MoreHorizontal, ExternalLink, Briefcase, MapPin, X, Check
// } from 'lucide-react';

// const CandidateIntake = () => {
//   // --- STATE MANAGEMENT ---
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Jane Doe", email: "jane.doe@example.com", exp: "8.5", location: "Mumbai, MH", source: "Excel Import", selected: false },
//     { id: 2, name: "Arjun Mehta", email: "arjun.m@tech.com", exp: "4.2", location: "Bangalore, KA", source: "Webhook", selected: false }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', exp: '' });

//   // --- HANDLERS ---
//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     const newCandidate = {
//       id: Date.now(),
//       name: formData.name,
//       email: formData.email,
//       exp: formData.exp,
//       location: formData.address,
//       source: "Manual Entry",
//       selected: false
//     };
//     setCandidates([newCandidate, ...candidates]);
//     setIsModalOpen(false);
//     setFormData({ name: '', email: '', phone: '', address: '', exp: '' });
//   };

//   const toggleSelectAll = () => {
//     const allSelected = candidates.every(c => c.selected);
//     setCandidates(candidates.map(c => ({ ...c, selected: !allSelected })));
//   };

//   const toggleSelect = (id) => {
//     setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
//   };

//   // --- FILTERING LOGIC ---
//   const filteredCandidates = useMemo(() => {
//     return candidates.filter(c =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [candidates, searchQuery]);

//   const selectedCount = candidates.filter(c => c.selected).length;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">

//       {/* SOURCE CONTROL HEADER */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard icon={<FileSpreadsheet />} title="Excel Import" desc="Bulk upload .csv or .xlsx" color="emerald" />
//         <SourceCard icon={<Webhook />} title="API Webhook" desc="Connect LinkedIn/Indeed" color="indigo" />
//         <div onClick={() => setIsModalOpen(true)}>
//             <SourceCard icon={<UserPlus />} title="Manual Entry" desc="Single candidate record" color="blue" isAction />
//         </div>
//       </div>

//       {/* TABLE CONTAINER */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">

//         {/* Toolbar */}
//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight">Candidate Pool</h2>
//             <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Displayed
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search candidates..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>
//             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCount > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
//               <Mail size={14} /> Shoot Mail ({selectedCount})
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={candidates.length > 0 && candidates.every(c => c.selected)}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Info</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Experience</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Location</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Source</th>
//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr key={c.id} className={`group transition-colors ${c.selected ? 'bg-blue-50/30' : 'hover:bg-slate-50/80'}`}>
//                   <td className="px-8 py-5 text-left">
//                     <input
//                         type="checkbox"
//                         checked={c.selected}
//                         onChange={() => toggleSelect(c.id)}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200 uppercase">
//                         {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{c.name}</p>
//                         <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={12} /></div>
//                       {c.exp} Years
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-xs font-bold text-slate-700">
//                     <div className="flex items-center gap-2">
//                         <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><MapPin size={12} /></div>
//                         {c.location}
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-[10px]">
//                     <span className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}>
//                         {c.source}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink size={16} /></button>
//                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MANUAL ENTRY MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">New Candidate</h3>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Manual Record Entry</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 <InputField label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Contact Number" placeholder="+91 ..." value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
//                 <InputField label="Years of Experience" placeholder="e.g. 5" type="number" value={formData.exp} onChange={(v) => setFormData({...formData, exp: v})} />
//               </div>
//               <InputField label="Office Address / Location" placeholder="e.g. Mumbai, Maharashtra" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />

//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---
// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//     const colors = {
//         emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
//         indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
//         blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
//     };
//     return (
//         <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1' : ''}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}>{icon}</div>
//                 <div>
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{desc}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const getSourceStyles = (source) => {
//     if (source === "Excel Import") return "bg-emerald-50 text-emerald-600 border-emerald-100";
//     if (source === "Webhook") return "bg-indigo-50 text-indigo-600 border-indigo-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;

//**************************************************working code phase 1 27/01/25******************************************************** */

// import React, { useState, useMemo } from 'react';
// import {
//   FileSpreadsheet, Webhook, UserPlus, Filter, Search, Mail,
//   MoreHorizontal, ExternalLink, Briefcase, MapPin, X, Check
// } from 'lucide-react';

// const CandidateIntake = () => {
//   // --- STATE MANAGEMENT ---
//   const [candidates, setCandidates] = useState([
//     { id: 1, name: "Jane Doe", email: "jane.doe@example.com", exp: "8.5", location: "Mumbai, MH", source: "Excel Import", selected: false },
//     { id: 2, name: "Arjun Mehta", email: "arjun.m@tech.com", exp: "4.2", location: "Bangalore, KA", source: "Webhook", selected: false }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', exp: '' });

//   // --- HANDLERS ---
//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     const newCandidate = {
//       id: Date.now(),
//       name: formData.name,
//       email: formData.email,
//       exp: formData.exp,
//       location: formData.address,
//       source: "Manual Entry",
//       selected: false
//     };
//     setCandidates([newCandidate, ...candidates]);
//     setIsModalOpen(false);
//     setFormData({ name: '', email: '', phone: '', address: '', exp: '' });
//   };

//   const toggleSelectAll = () => {
//     const allSelected = candidates.every(c => c.selected);
//     setCandidates(candidates.map(c => ({ ...c, selected: !allSelected })));
//   };

//   const toggleSelect = (id) => {
//     setCandidates(candidates.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
//   };

//   // --- FILTERING LOGIC ---
//   const filteredCandidates = useMemo(() => {
//     return candidates.filter(c =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [candidates, searchQuery]);

//   const selectedCount = candidates.filter(c => c.selected).length;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">

//       {/* SOURCE CONTROL HEADER */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SourceCard icon={<FileSpreadsheet />} title="Excel Import" desc="Bulk upload .csv or .xlsx" color="emerald" />
//         <SourceCard icon={<Webhook />} title="API Webhook" desc="Connect LinkedIn/Indeed" color="indigo" />
//         <div onClick={() => setIsModalOpen(true)}>
//             <SourceCard icon={<UserPlus />} title="Manual Entry" desc="Single candidate record" color="blue" isAction />
//         </div>
//       </div>

//       {/* TABLE CONTAINER */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">

//         {/* Toolbar */}
//         <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-black tracking-tight">Candidate Pool</h2>
//             <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase">
//               {filteredCandidates.length} Displayed
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search candidates..."
//                 className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 w-64 transition-all"
//               />
//             </div>
//             <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCount > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
//               <Mail size={14} /> Shoot Mail ({selectedCount})
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-8 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={candidates.length > 0 && candidates.every(c => c.selected)}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Info</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Experience</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Location</th>
//                 <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Source</th>
//                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCandidates.map((c) => (
//                 <tr key={c.id} className={`group transition-colors ${c.selected ? 'bg-blue-50/30' : 'hover:bg-slate-50/80'}`}>
//                   <td className="px-8 py-5 text-left">
//                     <input
//                         type="checkbox"
//                         checked={c.selected}
//                         onChange={() => toggleSelect(c.id)}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200 uppercase">
//                         {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{c.name}</p>
//                         <p className="text-[11px] text-slate-500 font-medium">{c.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={12} /></div>
//                       {c.exp} Years
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-xs font-bold text-slate-700">
//                     <div className="flex items-center gap-2">
//                         <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><MapPin size={12} /></div>
//                         {c.location}
//                     </div>
//                   </td>
//                   <td className="px-4 py-5 text-[10px]">
//                     <span className={`px-2.5 py-1 font-black rounded-md uppercase border ${getSourceStyles(c.source)}`}>
//                         {c.source}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink size={16} /></button>
//                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MANUAL ENTRY MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div>
//                 <h3 className="text-xl font-black text-slate-800">New Candidate</h3>
//                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">Manual Record Entry</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleManualEntry} className="p-8 space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 <InputField label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <InputField label="Contact Number" placeholder="+91 ..." value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
//                 <InputField label="Years of Experience" placeholder="e.g. 5" type="number" value={formData.exp} onChange={(v) => setFormData({...formData, exp: v})} />
//               </div>
//               <InputField label="Office Address / Location" placeholder="e.g. Mumbai, Maharashtra" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />

//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                   <Check size={16} /> Save Candidate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---
// const SourceCard = ({ icon, title, desc, color, isAction }) => {
//     const colors = {
//         emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
//         indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
//         blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
//     };
//     return (
//         <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all group ${isAction ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-100 hover:-translate-y-1' : ''}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-2xl transition-all duration-300 ${colors[color]}`}>{icon}</div>
//                 <div>
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{desc}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
//     <input
//       required
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//     />
//   </div>
// );

// const getSourceStyles = (source) => {
//     if (source === "Excel Import") return "bg-emerald-50 text-emerald-600 border-emerald-100";
//     if (source === "Webhook") return "bg-indigo-50 text-indigo-600 border-indigo-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
// };

// export default CandidateIntake;
