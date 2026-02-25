import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  Award,
  Eye,
  PlusCircle,
  User,
  ExternalLink,
  Briefcase,
  Fingerprint,
  Calendar,
  FileText,
  CheckCircle,
  Activity,
  MapPin,
  Loader2,
  Plus,
  Trash2,
  Layers,
  Cpu,
  Database,
  Globe,
  ShieldCheck,
  History,
  X,
  Edit3,
  LinkIcon,
  FileUp,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { candidateService } from "../../services/candidateService";
import { departmentService } from "../../services/department.service";

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-1 w-full">
    <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-start gap-1 items-center">
      <span>{label}</span>
      <span
        className={`font-bold text-[15px] normal-case ${required ? "text-red-500" : "text-slate-300"}`}
      >
        {required ? "*" : ""}
      </span>
    </label>
    {children}
    {error && (
      <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
        {error}
      </p>
    )}
  </div>
);

const ManualEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const effectiveId = id || "666";
  const ASSET_OPTIONS = [
    "Laptop",
    "Mouse",
    "Keyboard",
    "Monitor",
    "Headset",
    "Mobile",
    "ID Card",
    "SIM Card",
  ];
  // Professional Enterprise Input Style
  const inputStyle =
    "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";

  // 1. INITIALIZE ALL STATES
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [resumeMode, setResumeMode] = useState("file");
  const [skillInput, setSkillInput] = useState("");
  const [assetInput, setAssetInput] = useState("");
  const [isFresher, setIsFresher] = useState(null);
  const [deptSearch, setDeptSearch] = useState("");
  const [eduSearch, setEduSearch] = useState("");
  const [dynamicSkills, setDynamicSkills] = useState([]);
  const [existingResume, setExistingResume] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [showIndustryDrop, setShowIndustryDrop] = useState(false);
  const [dynamicAssets, setDynamicAssets] = useState([]);
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [showAssetDrop, setShowAssetDrop] = useState(false);
  const [skillFocused, setSkillFocused] = useState(false);
  const [departments, setDepartments] = useState([]);
  const dropdownContainerRef = useRef(null);
  const [existingCertificates, setExistingCertificates] = useState([]);
  const [editingCertId, setEditingCertId] = useState(null);
  const [editingCertValue, setEditingCertValue] = useState("");
  const [showExpModal, setShowExpModal] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [newExperiences, setNewExperiences] = useState([]);
  const [masterIndustries, setMasterIndustries] = useState([]);
  const [baseData, setBaseData] = useState({});
const [isSubmitted, setIsSubmitted] = useState(false);
  //**********************************certiificate and resume*********************************** */

  const [docType, setDocType] = useState("resume");
  // "resume" | "certificate"

  const [showCertEditModal, setShowCertEditModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  const [certForm, setCertForm] = useState({
    name: "",
    certificate_file: null,
    certificate_link: "",
    uploadMode: "file", // file | link
  });

  const SCORE_METRICS = ["Percentage", "CGPA", "GPA"];

  //**********************************certiificate and resume end*********************************** */

  //**********************************eduction*********************************** */

  const [showEduModal, setShowEduModal] = useState(false);
  const [masterEducations, setMasterEducations] = useState([]);
  const [eduDropdownOpen, setEduDropdownOpen] = useState(false);
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [currentEduId, setCurrentEduId] = useState(null);
  const [newEdu, setNewEdu] = useState({
    education_id: 0,
    institution_name: "",
    start_year: "",
    end_year: "",
    education_name: "", 
      score_metric: "",
  score: "",
  });

  //**********************************eduction  end*********************************** */
  const careerStepRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    location: "",
    pincode: "",
    state: "",
    city: "",
    district: "",
    country: "India",
    position: "",
    gender: "",
    dob: "",
    education: [],
    experience: "",
    about_me: "",
    languages_spoken: [],
    skills: [],
    assets: [],
    department: "",
    cvFile: null,
    resume_link: "",
    certificateFiles: [],
    certificateLinks: [""],
    experiences: [],
  });

  const totalSteps = 6;

  const educationOptions = [
    "SSC / 10th",
    "HSC / 12th",
    "ITI",
    "Diploma",
    "Polytechnic",

    "B.A",
    "B.Com",
    "B.Sc",
    "BCA",
    "BBA",
    "B.Tech",
    "BE",
    "B.Pharm",
    "B.Ed",

    "M.A",
    "M.Com",
    "M.Sc",
    "MCA",
    "MBA",
    "M.Tech",
    "ME",
    "M.Pharm",
    "M.Ed",

    "PGDM",
    "Post Graduate Diploma",

    "PhD / Doctorate",
  ];

  const POSITION_OPTIONS = [
    // IT / Software
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "Senior Software Engineer",
    "Lead Developer",
    "DevOps Engineer",
    "QA Engineer",
    "Automation Tester",
    "Manual Tester",
    "UI/UX Designer",
    "Mobile App Developer",
    "Android Developer",
    "iOS Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "Cloud Engineer",
    "System Administrator",
    "Network Engineer",
    "Cyber Security Analyst",

    // Management / Office
    "Project Manager",
    "Product Manager",
    "Operations Manager",
    "Team Lead",
    "Business Analyst",
    "HR Executive",
    "HR Manager",
    "Recruiter",
    "Office Administrator",

    // Non-IT / General
    "Accountant",
    "Finance Executive",
    "Sales Executive",
    "Marketing Executive",
    "Digital Marketing Specialist",
    "Customer Support Executive",
    "Technical Support Engineer",
    "Field Executive",
    "Supervisor",
    "Store Manager",
    "Warehouse Executive",

    // Fresher / Entry
    "Intern",
    "Trainee",
    "Graduate Engineer Trainee",
    "Apprentice",
  ];

  const filteredEducation = educationOptions.filter((e) =>
    e.toLowerCase().includes(eduSearch.toLowerCase()),
  );
  const filteredDepartments = departments.filter((d) =>
    (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()),
  );
  const isStep1Valid =
    formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && formData.phone;

  // 2. HYDRATION LOGIC (GET API)
  useEffect(() => {
    hydrateNode();
  }, [effectiveId]);

  const hydrateNode = async () => {
    setFetchingData(true);
    try {
      const response = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
      );
      if (!response.ok) throw new Error();
      const data = await response.json();

      if (data) {
        setExistingResume(data.resume_path || "");

        setExistingCertificates(
          Array.isArray(data.certificates) ? data.certificates : [],
        );

        const safeParse = (value) => {
          if (!value) return [];
          try {
            if (Array.isArray(value)) {
              const joined = value.join("");
              if (joined.startsWith("[")) {
                return JSON.parse(joined);
              }
              return value;
            }
            if (typeof value === "string" && value.startsWith("[")) {
              return JSON.parse(value);
            }
            if (typeof value === "string") {
              return value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
            return [];
          } catch {
            return [];
          }
        };

        const mappedEducation = Array.isArray(data.educations)
          ? data.educations.map((edu) => ({
              id: edu.id,
              education_id: edu.education_id,
              institution_name: edu.institution_name,
              start_year: edu.start_year,
              end_year: edu.end_year,
              education_name: edu.education_master?.name || "Unknown Degree",
               score_metric: edu.score_metric || "",   
      score: edu.score || ""                  
            }))
          : [];

        // Create a snapshot object for comparison
        const serverSnapshot = {
          name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dob: data.dob || "",
          address: data.address || "",
          address2: data.address2 || "",
          location: data.location || "",
          pincode: data.pincode || "",
          city: data.city || "",
          state: data.state || "",
          district: data.district || "",
          country: data.country || "India",
          position: data.position || "",
          experience: data.experience || "",
          education: mappedEducation,
          department: data.department || "",
          about_me: data.about_me || "",
          resume_link: data.resume_path || "",
          languages_spoken: safeParse(data.languages_spoken),
          experiences: data.experiences || [],
          skills: safeParse(data.skills),
          assets: safeParse(data.assets),
        };

        // Set both current form and base reference
        setFormData((prev) => ({ ...prev, ...serverSnapshot }));
        setBaseData(serverSnapshot); // Ensure you have [baseData, setBaseData] = useState({})

        setIsFresher(!data.experiences || data.experiences.length === 0);
      }

      const deptData = await departmentService.getAll();
      setDepartments(deptData || []);
      await fetchSkills();
      await fetchAssets(effectiveId);
    } catch (err) {
      console.warn("Initializing Empty Node");
    } finally {
      setFetchingData(false);
    }
  };
  const INDUSTRY_OPTIONS = [
    "Information Technology",
    "Software Development",
    "Banking & Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Telecom",
    "Construction",
    "Logistics",
    "Marketing & Advertising",
    "HR / Recruitment",
    "Government",
    "Automobile",
    "Pharmaceutical",
    "E-Commerce",
    "Media & Entertainment",
    "Real Estate",
    "Hospitality",
    "Other",
  ];

  // Click Outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setShowSkillDrop(false);
        setShowAssetDrop(false);
        setSkillFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // READ STEP FROM URL (?step=3)
  useEffect(() => {
    const stepFromUrl = Number(searchParams.get("step"));

    if (stepFromUrl && stepFromUrl >= 1 && stepFromUrl <= totalSteps) {
      setStep(stepFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMasterIndustries();
  }, []);

  // 3. HANDLERS
  const fetchSkills = async () => {
    try {
      const res = await fetch(
        "https://apihrr.goelectronix.co.in/masters/skills",
      );
      const data = await res.json();
      setDynamicSkills(data.map((item) => item.name || item));
    } catch {}
  };

  const fetchAssets = async (cId) => {
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${cId}/assets`,
      );
      const data = await res.json();
      setDynamicAssets(Array.isArray(data) ? data.map((a) => a.name) : []);
    } catch {}
  };

  const handleManualAddSkill = async () => {
    const name = skillInput.trim();
    if (!name) {
      await fetchSkills();
      return;
    }
    const success = await handleCreateMaster("skills", name);
    if (success) {
      if (!formData.skills.includes(name))
        setFormData((p) => ({ ...p, skills: [...p.skills, name] }));
      setSkillInput("");
      await fetchSkills();
    }
  };

  const handleCreateMaster = async (type, name) => {
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/masters/${type}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        },
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleAddAssetAPI = async (assetName) => {
    if (!assetName.trim()) return;
    const loadingToast = toast.loading(`Linking asset...`);
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/assets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: assetName.trim() }),
        },
      );
      if (res.ok) {
        toast.success("Linked", { id: loadingToast });
        await fetchAssets(effectiveId);
        return true;
      }
    } catch {
      toast.error("Sync failed", { id: loadingToast });
    }
    return false;
  };

  const filteredIndustries = INDUSTRY_OPTIONS.filter((ind) =>
    ind.toLowerCase().includes(industrySearch.toLowerCase()),
  );

  const handleSaveOrUpdateExperience = async (i) => {
    const exp = newExperiences[i];

    if (
      !exp.company_name ||
      !exp.job_title ||
      !exp.start_date ||
      !exp.end_date
    ) {
      toast.error("Company, Role, Start Date, End Date required");
      return;
    }

    const loadingToast = toast.loading(
      currentEditingIndex !== null
        ? "Updating experience..."
        : "Saving experience...",
    );

    try {
      const fd = new FormData();

      fd.append("company_name", exp.company_name);
      fd.append("job_title", exp.job_title);
      fd.append("start_date", exp.start_date);
      fd.append("department", exp.department || "");
      fd.append("end_date", exp.end_date);
      fd.append("previous_ctc", exp.previous_ctc || "");
      fd.append("location", exp.location || "");
      fd.append("description", exp.description || "");
      // fd.append("industry_id", exp.industry || "");
      fd.append("industry_id", exp.industry_id || "");

      if (exp.uploadMode === "link") {
        fd.append("exp_letter_link", exp.exp_letter_link || "");
      } else if (exp.expLetterFile instanceof File) {
        fd.append("exp_letter_file", exp.expLetterFile);
      }

      // =========================
      // UPDATE (PATCH)
      // =========================
      if (currentEditingIndex !== null && exp.id) {
        const res = await fetch(
          `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences/${exp.id}`,
          {
            method: "PUT",
            body: fd,
          },
        );

        if (!res.ok) throw new Error(await res.text());

        // Update UI instantly
        const updated = [...formData.experiences];
        updated[currentEditingIndex] = exp;

        setFormData((prev) => ({
          ...prev,
          experiences: updated,
        }));

        toast.success("Experience Updated ✅", { id: loadingToast });
      }

      // =========================
      // ADD NEW (POST)
      // =========================
      else {
        const res = await fetch(
          `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences`,
          {
            method: "POST",
            body: fd,
          },
        );

        if (!res.ok) throw new Error(await res.text());

        await hydrateNode(); // reload from backend

        toast.success("Experience Added ✅", { id: loadingToast });
      }

      setNewExperiences([]);
      setCurrentEditingIndex(null);
      setShowExpModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed ❌", { id: loadingToast });
    }
  };

  const fetchMasterIndustries = async () => {
    try {
      const res = await fetch(
        "https://apihrr.goelectronix.co.in/masters?types=industries&skip=0&limit=100",
      );
      const data = await res.json();
      // Assuming API returns { industries: [...] }
      setMasterIndustries(data.industries || []);
    } catch (err) {
      console.error("Industry Load Error", err);
    }
  };

  // Fetch Master Education List
  const fetchMasterEducations = async () => {
    try {
      const res = await fetch(
        "https://apihrr.goelectronix.co.in/masters?types=educations&skip=0&limit=100",
      );
      const data = await res.json();
      setMasterEducations(data.educations || []);
    } catch (err) {
      console.error("Master Load Error", err);
    }
  };

  // Save or Update Education
  const handleSaveEducation = async () => {
    const loadingToast = toast.loading(
      isEditingEdu ? "Updating Node..." : "Syncing Education...",
    );
    const url = isEditingEdu
      ? `https://apihrr.goelectronix.co.in/education/${currentEduId}?user_type=candidate`
      : `https://apihrr.goelectronix.co.in/education/${effectiveId}?user_type=candidate`;

    try {
      const res = await fetch(url, {
        method: isEditingEdu ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education_id: newEdu.education_id,
          institution_name: newEdu.institution_name,
          start_year: newEdu.start_year,
          end_year: newEdu.end_year,
          score_metric: newEdu.score_metric,
  score: newEdu.score,
        }),
      });

      if (res.ok) {
        toast.success("Education Node Synchronized", { id: loadingToast });
        setShowEduModal(false);
        // Logic to refresh your formData.education from GET API here
        // 🔥 REFRESH LOGIC: Trigger hydration to pull the updated 'educations' array
        await hydrateNode();

        // Reset Search state
        setEduSearch("");
      }
    } catch (err) {
      toast.error("Sync Failed", { id: loadingToast });
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;

    setIsFetchingPincode(true);

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
        const postOffices = data[0].PostOffice;

        setCityOptions(postOffices); // ⭐ store full objects

        const first = postOffices[0];

        setFormData((prev) => ({
          ...prev,
          city: first.Name || "",
          district: first.District || "",
          state: first.State || "",
          country: first.Country || "India",
        }));
      } else {
        setCityOptions([]);
      }
    } catch (err) {
      console.error(err);
      setCityOptions([]);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  // ---------- STEP VALIDATION ----------

  const STEP_FIELDS = {
    1: [
      "name",
      "email",
      "phone",
      "gender",
      "dob",
      "position",
      "experience",
      "education",
      "department",
      "about_me",
      "languages_spoken",
    ],

    2: [
      "address",
      "address2",
      "location",
      "pincode",
      "city",
      "district",
      "state",
      "country",
    ],

    // ✅ NEW EDUCATION STEP
    3: ["education"],

    // ✅ EXPERIENCE SHIFTED TO 4
    4: ["experiences"],

    // ✅ SKILLS & ASSETS SHIFTED TO 5
    5: ["skills", "assets"],

    // ✅ DOCUMENTS SHIFTED TO 6
    6: ["resume_link", "cvFile", "certificateFiles", "certificateLinks"],
  };

  // STEP 1 → Personal
  const isStep1Incomplete = () => {
    return !(
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.gender &&
      formData.dob &&
      (formData.languages_spoken || []).length > 0 &&
      formData.about_me
    );
  };

  // STEP 2 → Location
  const isStep2Incomplete = () => {
    return !(
      formData.address &&
      formData.city &&
      formData.state &&
      formData.pincode
    );
  };



// Step 3 → Education Incompletion Logic
const isStep3Incomplete = () => {
  return !(Array.isArray(formData.education) && formData.education.length > 0);
};

// Step 4 → Experience Incompletion Logic (Respects isFresher)
const isStep4Incomplete = () => {
  if (isFresher) return false; // Fresher doesn't require experience records
  return !(Array.isArray(formData.experiences) && formData.experiences.length > 0);
};



const isStep5Incomplete = () => {
  return (
    (!formData.skills || formData.skills.length === 0) &&
    (!formData.assets || formData.assets.length === 0)
  );
};



// Step 6 Check: Yellow if no Resume AND no Certificates exist
const isStep6Incomplete = () => {
  const hasResume =  (formData.resume_link && formData.resume_link.trim() !== "") || formData.cvFile || existingResume;
  const hasCertificates = (formData.certificateFiles && formData.certificateFiles.length > 0) || 
                          (existingCertificates && existingCertificates.length > 0) ||
                          (formData.certificateLinks && formData.certificateLinks.some(l => l.trim() !== ""));
                          
  return !hasResume && !hasCertificates;
};

  const fixResumeUrl = (url) => {
    if (!url) return "";

    // remove wrong https//
    let clean = url.replace(/^https\/\//, "");

    // if already full valid http/https → keep it
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    // attach correct base URL
    return `https://apihrr.goelectronix.co.in/${clean.replace(/^\/+/, "")}`;
  };

  const fixResumeUrl2 = (url) => {
    if (!url) return "";

    let clean = url.trim();

    // Fix broken https//
    clean = clean.replace(/^https\/\//, "https://");

    // 🔴 If URL is https://uploads/... → replace domain
    if (clean.startsWith("https://uploads")) {
      return clean.replace(
        "https://uploads",
        "https://apihrr.goelectronix.co.in/uploads",
      );
    }

    // Already full valid URL → return
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    // Remove starting slash
    clean = clean.replace(/^\/+/, "");

    // Attach backend base
    return `https://apihrr.goelectronix.co.in/${clean}`;
  };

  const hasExistingExperience =
    Array.isArray(formData.experiences) && formData.experiences.length > 0;

  const saveStepData = async (stepNumber) => {
    const fields = STEP_FIELDS[stepNumber] || [];

    // --- 1. CHANGE DETECTION PROTOCOL ---
    // Compares current formData against the baseData snapshot retrieved during hydration
    const hasChanged = fields.some((key) => {
      // Handling for Arrays (Languages, Skills, Assets, Education, Experiences)
      if (Array.isArray(formData[key])) {
        return JSON.stringify(formData[key]) !== JSON.stringify(baseData[key]);
      }
      // Handling for File objects (Resume/Certificates)
      if (formData[key] instanceof File) return true;

      // Standard primitive comparison (Strings/Numbers)
      return (formData[key] || "") !== (baseData[key] || "");
    });

    // If no changes are detected, we bypass the API call and return true to allow navigation
    if (!hasChanged) {
      console.log(
        `Step ${stepNumber}: No changes detected. Skipping network request.`,
      );
      return true;
    }

    try {
      const apiData = new FormData();

      // --- 2. DYNAMIC PAYLOAD CONSTRUCTION ---
      fields.forEach((key) => {
        // Group: CSV Serialization (Languages, Skills, Assets)
        if (["languages_spoken", "skills", "assets"].includes(key)) {
          apiData.append(key, (formData[key] || []).join(","));
        }

        // Group: JSON Serialization (Education, Experiences)
        else if (key === "education") {
          apiData.append(
            "education_details",
            JSON.stringify(formData.education || []),
          );
        } else if (key === "experiences") {
          apiData.append(
            "experience_details",
            JSON.stringify(formData.experiences || []),
          );
        }

        // Group: File/Link Handling (Master Resume - Step 6)
        else if (key === "cvFile" && formData.cvFile) {
          apiData.append("resumepdf", formData.cvFile);
        } else if (key === "resume_link" && formData.resume_link) {
          apiData.append("resume_link", formData.resume_link);
        }

        // Group: Certificate Batching (Step 6)
        else if (key === "certificateFiles") {
          formData.certificateFiles.forEach((file, idx) => {
            apiData.append("certificate_files", file);
            if (formData.certificateNames?.[idx]) {
              apiData.append(
                "certificate_names",
                formData.certificateNames[idx],
              );
            }
          });
        }

        // Group: Standard Strings (Name, Address, etc.)
        else {
          apiData.append(key, formData[key] ?? "");
        }
      });

      // Special Case: Ensure full_name is always present as per API requirements
      apiData.append("full_name", formData.name || "");

      // --- 3. API EXECUTION ---
      const response = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
        {
          method: "PATCH",
          body: apiData,
        },
      );

      if (response.ok) {
        // --- 4. POST-SYNC CLEANUP ---
        // Update the baseData snapshot to match current state so subsequent clicks don't re-trigger
        const updatedFields = {};
        fields.forEach((f) => {
          updatedFields[f] = formData[f];
        });
        setBaseData((prev) => ({ ...prev, ...updatedFields }));

        if (stepNumber === 6) {
          setFormData((prev) => ({
            ...prev,
            certificateFiles: [],
            certificateLinks: [""],
          }));
        }

        toast.success(`Saved the updated code: Step ${stepNumber}`);
        return true;
      } else {
        throw new Error("Registry update rejected");
      }
    } catch (err) {
      console.error("Critical Sync Error:", err);
      toast.error(`Step ${stepNumber} save failed`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Executing Final PATCH Sync...");

    try {
      const apiData = new FormData();

      // 🔹 Append ALL simple fields (NO skipping empty)
      for (const key in formData) {
        if (
          ![
            "experiences",
            "certificateFiles",
            "languages_spoken",
            "cvFile",
            "skills",
            "assets",
          ].includes(key)
        ) {
          apiData.append(key, formData[key] ?? "");
        }
      }

      // 🔹 Required backend fields
      apiData.append("full_name", formData.name || "");

      apiData.append(
        "languages_spoken",
        (formData.languages_spoken || []).join(","),
      );

      apiData.append("skills", (formData.skills || []).join(","));
      apiData.append("assets", (formData.assets || []).join(","));

      // CASE 1: Upload PDF
      if (formData.cvFile) {
        apiData.append("resumepdf", formData.cvFile); // ✅ correct key
      }

      // CASE 2: Resume Link
      else if (formData.resume_link) {
        apiData.append("resume_link", formData.resume_link); // ✅ correct key
      }

      // CASE 3: Keep existing resume (no change)
      else if (existingResume) {
        apiData.append("resume_link", existingResume);
      }

      // 🔹 Certificates FILES
      formData.certificateFiles.forEach((file) => {
        apiData.append("certificates", file);
      });

      // 🔹 Certificate LINKS
      apiData.append(
        "certificate_links",
        JSON.stringify(formData.certificateLinks.filter((l) => l && l.trim())),
      );

      // 🔹 Debug — SEE WHAT GOES TO API
      for (let pair of apiData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
        {
          method: "PATCH",
          body: apiData,
        },
      );

      if (!response.ok) {
        const err = await response.text();
        console.error(err);
        throw new Error("API Failed");
      }

      toast.success("Candidate Synchronized 🎉", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Commit failed ❌", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    // 1. Validation Logic
    if (!certForm.name.trim())
      return toast.error("Artifact Label is compulsory");

    if (certForm.uploadMode === "file" && !certForm.certificate_file) {
      return toast.error("Please select a PDF file");
    }
    if (certForm.uploadMode === "link" && !certForm.certificate_link) {
      return toast.error("Please enter a URI link");
    }

    const loadingToast = toast.loading("Deploying new credential node...");

    try {
      const apiData = new FormData();

      // ✅ Following Request Body from Image 1: name, certificate_file, certificate_link
      apiData.append("name", certForm.name.trim());

      if (certForm.uploadMode === "file") {
        apiData.append("certificate_file", certForm.certificate_file);
        // Backend expects either file or link; image shows link is optional if file is present
      } else {
        apiData.append("certificate_link", certForm.certificate_link.trim());
      }

      // ✅ Image 1 Endpoint: POST /{person_type}/{person_id}/certificates
      const response = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates`,
        {
          method: "POST",
          body: apiData,
        },
      );

      if (response.ok) {
        toast.success("Credential Registered 🎉", { id: loadingToast });

        // Reset Modal State
        setShowCertEditModal(false);
        setCertForm({
          name: "",
          certificate_file: null,
          certificate_link: "",
          uploadMode: "file",
        });

        // 🔥 REFRESH UI
        await hydrateNode();
      } else {
        const errorText = await response.text();
        console.error("Registry Sync Error:", errorText);
        throw new Error();
      }
    } catch (err) {
      toast.error("Deployment failed ❌", { id: loadingToast });
    }
  };

  // --- UPDATE EXISTING CERTIFICATE (Direct PUT) ---
  const updateCertificate = async () => {
    if (!certForm.name.trim())
      return toast.error("Artifact Label is compulsory");

    const loadingToast = toast.loading("Updating Node Artifact...");
    try {
      const fd = new FormData();

      // ✅ Following Request Body from Image 2
      fd.append("name", certForm.name.trim());

      if (certForm.uploadMode === "file" && certForm.certificate_file) {
        fd.append("certificate_file", certForm.certificate_file);
      } else if (certForm.uploadMode === "link" && certForm.certificate_link) {
        fd.append("certificate_link", certForm.certificate_link.trim());
      }

      // ✅ Image 3 Parameters: /candidates/{person_id}/certificates/{certificate_id}
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates/${editingCertificate.id}`,
        {
          method: "PUT",
          body: fd,
        },
      );

      if (res.ok) {
        toast.success("Artifact Updated ✅", { id: loadingToast });
        setShowCertEditModal(false);

        // Reset editing state
        setEditingCertificate(null);

        await hydrateNode();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Sync Error ❌", { id: loadingToast });
    }
  };

  const numberToIndianWords = (num) => {
    if (!num || isNaN(num)) return "";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const twoDigits = (n) =>
      n < 20
        ? ones[n]
        : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");

    const threeDigits = (n) => {
      if (n === 0) return "";
      if (n < 100) return twoDigits(n);
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + twoDigits(n % 100) : "")
      );
    };

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = num % 1000;

    let result = "";

    if (crore) result += twoDigits(crore) + " Crore ";
    if (lakh) result += twoDigits(lakh) + " Lakh ";
    if (thousand) result += twoDigits(thousand) + " Thousand ";
    if (hundred) result += threeDigits(hundred);

    return result.trim() + " per annum";
  };

  const today = new Date();

  // 18 years ago (max allowed DOB)
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  // 70 years ago (min allowed DOB)
  const minDate = new Date(
    today.getFullYear() - 70,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const [dobError, setDobError] = useState("");

  const handleDobChange = (value) => {
    setFormData({ ...formData, dob: value });

    if (!value) {
      setDobError("Date of Birth is required");
      return;
    }

    const selected = new Date(value);

    if (selected > new Date(maxDate)) {
      setDobError("Age must be at least 18 years");
    } else if (selected < new Date(minDate)) {
      setDobError("Age must be below 70 years");
    } else {
      setDobError("");
    }
  };

  const handleResumeDirectUpload = async (file) => {
  if (!file) return;
  
  setLoading(true);
  const syncToast = toast.loading("Executing Instant Registry Sync...");

  try {
    const apiData = new FormData();
    apiData.append("resumepdf", file); // Ensure "resumepdf" matches backend key
    apiData.append("full_name", formData.name); // Usually required by backend

    const response = await fetch(
      `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
      {
        method: "PATCH",
        body: apiData,
      }
    );

    if (response.ok) {
      toast.success("Document Verified & Live", { id: syncToast });
      // 🔥 REFRESH UI: This will trigger hydrateNode and show the success block within 1sec
      await hydrateNode(); 
    } else {
      throw new Error();
    }
  } catch (err) {
    toast.error("Protocol Rejection: Upload Failed", { id: syncToast });
  } finally {
    setLoading(false);
  }
};


const handleFinalProtocolSync = async () => {
    const score = calculateCompletion();

    if (score < 100) {
      toast.error(`Audit Failure: ${score}% Completion. Please verify all mandatory nodes (Languages, About Me, etc.) before final synchronization.`, {
        duration: 5000,
        icon: '⚠️'
      });
      return;
    }

    setLoading(true);
    // Execute final step save (Step 6)
    const success = await saveStepData(6);
    
    if (success) {
      setIsSubmitted(true); // Trigger the Success Hub
      toast.success("Registry Protocol Synchronized 100%");
    }
    setLoading(false);
  };

const calculateCompletion = () => {
  const auditMatrix = [
    // Phase 01: Identity
    !!formData.name, 
    !!formData.email, 
    !!formData.phone, 
    !!formData.gender, 
    !!formData.dob, 
    !!formData.about_me, 
    (formData.languages_spoken?.length > 0),

    // Phase 02: Geolocation
    !!formData.address, 
    !!formData.city, 
    !!formData.state, 
    !!formData.pincode,

    // Phase 03: Academic Nodes
    (formData.education?.length > 0),

    // Phase 04: Professional Timeline
    // Protocol: If Fresher is active, this node is auto-verified.
    (isFresher === true || formData.experiences?.length > 0),

    // Phase 05: Technical Stack
    (formData.skills?.length > 0 || formData.assets?.length > 0),

    // Phase 06: Document Vault
    !!(formData.cvFile || existingResume || formData.resume_link)
  ];

  const completedNodes = auditMatrix.filter(node => node === true).length;
  const totalNodes = auditMatrix.length;

  return Math.round((completedNodes / totalNodes) * 100);
};

  if (fetchingData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          Loading Data Load {effectiveId}...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
      <div className="max-w-6xl mx-auto space-y-8" ref={dropdownContainerRef}>


        
        <div className="flex justify-start">
        <button
          onClick={() => navigate("/candidate")}
          className="group flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Candidate 
        </button>
      </div>
        {/* ROADMAP HEADER */}
       

        <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
  {/* Left Section: Branding Node */}
  <div className="flex items-center gap-6">
    <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
      <Database size={32} />
    </div>
    <div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
        {id ? "Edit Profile" : "Manual Add"}
      </h2>
      <div className="flex items-center gap-2 mt-1.5">
        <ShieldCheck size={14} className="text-blue-600" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Candidate data</span>
      </div>
    </div>
  </div>

  

  {/* Center Section: Roadmap Protocol */}
<div className="flex-1 max-w-2xl w-full px-4">
  <div className="relative flex justify-between items-center w-full">
    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
    <div
      className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
      style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
    />

    {[1, 2, 3, 4, 5, 6].map((num) => {
      const isWarning = 
        (num === 1 && isStep1Incomplete()) ||
        (num === 2 && isStep2Incomplete()) ||
        (num === 3 && isStep3Incomplete()) ||
        (num === 4 && isStep4Incomplete()) ||
        (num === 5 && isStep5Incomplete()) ||
        (num === 6 && isStep6Incomplete());

      const isActive = step === num;
      const isCompleted = step > num;

      return (
        <div
          key={num}
          className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
          onClick={async () => {
            const success = await saveStepData(step);
            if (success || num < step) {
              setStep(num);
              navigate(`?step=${num}`, { replace: true });
            }
          }}
        >
          {/* STEP CIRCLE */}
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
            group-hover/step:scale-110
            ${isActive
              ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
              : isWarning
                ? "bg-white text-white border-slate-100" // Neutral background for Warning
                : isCompleted
                  ? "bg-blue-500 text-white border-emerald-50" 
                  : "bg-slate-200 text-white border-slate-50"
            }`}
          >
            {/* 🛠️ ICON LOGIC: Show Check if done, ? if incomplete, else Number */}
            {isCompleted && !isWarning ? (
              <Check size={14} strokeWidth={4} />
            ) : isWarning ? (
              <span className="text-blue-600 text-sm animate-pulse">?</span>
            ) : (
              num
            )}
          </div>

          {/* LABEL */}
          <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
            ${isActive ? "text-blue-600" : isWarning ? "text-slate-400" : "text-slate-300"} 
            group-hover/step:text-slate-900`}
          >
            {num === 1 && "Personal"}
            {num === 2 && "Location"}
            {num === 3 && "Education"}
            {num === 4 && "Experience"}
            {num === 5 && "Stack"}
            {num === 6 && "Vault"}
          </span>
        </div>
      );
    })}
  </div>
</div>

  {/* Right Section: Percentage Hub */}
  <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group transition-all hover:bg-white hover:shadow-md">
    <div className="text-right">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
        Audit Status
      </p>
      <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
        calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
      }`}>
        {calculateCompletion()}%
      </p>
    </div>
    
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
      calculateCompletion() === 100 
        ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
        : 'bg-blue-100 text-blue-600 shadow-blue-50'
    }`}>
      {calculateCompletion() === 100 ? (
        <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
      ) : (
        <Activity size={16} className="animate-pulse" />
      )}
    </div>
  </div>
</div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            {/* STEP 1: IDENTITY & CAREER */}
            {step === 1 && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <User size={18} className="text-blue-600" />
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Basic Candidate profile
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField label="Full Name" required>
                    <input
                      placeholder="Legal Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="Email" required>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="Phone" required>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm">
                      <span className="px-3 text-[11px] font-black text-slate-400">
                        +91
                      </span>
                      <input
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-transparent text-[13px] font-bold outline-none"
                      />
                    </div>
                  </FormField>
                  <FormField label="Gender">
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className={inputStyle}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <FormField label="Date of Birth">
                    <input
                      type="date"
                      min={minDate}
                      max={maxDate}
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className={inputStyle}
                    />
                  </FormField>
                  <FormField label="Languages">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-3 shadow-inner">
                      {[
                        "English",
                        "Hindi",
                        "Marathi",
                        "Gujarati",
                        "Tamil",
                        "Telugu",
                      ].map((lang) => (
                        <label
                          key={lang}
                          className="flex items-center gap-2 text-[11px] font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.languages_spoken.includes(lang)}
                            onChange={() => {
                              const u = formData.languages_spoken.includes(lang)
                                ? formData.languages_spoken.filter(
                                    (l) => l !== lang,
                                  )
                                : [...formData.languages_spoken, lang];
                              setFormData({ ...formData, languages_spoken: u });
                            }}
                            className="w-3.5 h-3.5 accent-blue-600 rounded"
                          />{" "}
                          {lang}
                        </label>
                      ))}
                    </div>
                  </FormField>
                </div>
                <FormField label="Bio Summary">
                  <textarea
                    rows={3}
                    value={formData.about_me}
                    onChange={(e) =>
                      setFormData({ ...formData, about_me: e.target.value })
                    }
                    className={inputStyle + " resize-none"}
                  />
                </FormField>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    // onClick={() => setStep(2)}
                    onClick={async () => {
                      await saveStepData(1);
                      setStep(2);
                    }}
                    className={`px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all`}
                  >
                    Next Phase →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GEOGRAPHY */}
            {step === 2 && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <MapPin size={18} className="text-blue-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    location Data
                  </h3>
                </div>
                <div className="space-y-8">
                  <FormField label="Address 1" required>
                    <input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={inputStyle}
                    />
                  </FormField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField label="Address 2" required>
                      <input
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className={inputStyle}
                      />
                    </FormField>
                    <FormField label="Pincode" required>
                      <input
                        maxLength={6}
                        placeholder="000000"
                        value={formData.pincode}
                        onChange={(e) => {
                          setFormData({ ...formData, pincode: e.target.value });
                          if (e.target.value.length === 6)
                            fetchPincodeDetails(e.target.value);
                        }}
                        className={inputStyle}
                      />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <FormField label="City">
                      {isFetchingPincode ? (
                        <input
                          value="Fetching..."
                          readOnly
                          className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-400 shadow-inner"
                        />
                      ) : cityOptions.length > 1 ? (
                        <select
                          value={formData.city}
                          onChange={(e) => {
                            const selected = cityOptions.find(
                              (c) => c.Name === e.target.value,
                            );

                            setFormData((prev) => ({
                              ...prev,
                              city: selected?.Name || "",
                              district: selected?.District || "",
                              state: selected?.State || "",
                              country: selected?.Country || "India",
                            }));
                          }}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          {cityOptions.map((c, i) => (
                            <option key={i} value={c.Name}>
                              {c.Name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={formData.city || ""}
                          readOnly
                          className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
                        />
                      )}
                    </FormField>

                    <FormField label="District">
                      <input
                        // value={formData.district}
                        value={
                          isFetchingPincode ? "Fetching..." : formData.district
                        }
                        readOnly
                        className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
                      />
                    </FormField>
                    <FormField label="State">
                      <input
                        // value={formData.state}
                        value={
                          isFetchingPincode ? "Fetching..." : formData.state
                        }
                        readOnly
                        className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
                      />
                    </FormField>
                    <FormField label="Country">
                      <input
                        value={
                          isFetchingPincode ? "Fetching..." : formData.country
                        }
                        readOnly
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className={inputStyle}
                      />
                    </FormField>
                  </div>
                </div>
                <div className="flex justify-between pt-8 border-t border-slate-50">
                  <button
                    onClick={() => setStep(1)}
                    type="button"
                    className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all shadow-sm"
                  >
                    ← Back
                  </button>
                  <button
                    //  onClick={() => setStep(3)}
                    onClick={async () => {
                      await saveStepData(2);
                      setStep(3);
                    }}
                    type="button"
                    className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl transition-all"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                        <Award size={20} />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Education History</h3>
                    </div>
                    {/* <button
                      type="button"
                      onClick={() => {
                        setIsEditingEdu(false);
                        setNewEdu({ education_id: 0, institution_name: "", start_year: "", end_year: "", education_name: "",score_metric: edu.score_metric || "", score: edu.score || "" });
                        fetchMasterEducations();
                        // setShowEduModal(true);
                        setShowEduModal(true);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} strokeWidth={3} /> Add Education
                    </button> */}
                    <button
  type="button"
  onClick={() => {
    setIsEditingEdu(false);
    // 🛠️ CRITICAL FIX: Reset to empty strings, not edu.score_metric
    setNewEdu({ 
      education_id: 0, 
      institution_name: "", 
      start_year: "", 
      end_year: "", 
      education_name: "", 
      score_metric: "", 
      score: "" 
    });
    fetchMasterEducations();
    setEduSearch(""); // Reset search text
    setShowEduModal(true); // Now this will execute
  }}
  className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
>
  <Plus size={14} strokeWidth={3} /> Add Education
</button>
                  </div>
            
            {/* VERIFIED EDUCATION LIST */}
            <div className="space-y-4 relative z-10">
              {formData.education && formData.education.length > 0 ? (
                formData.education.map((edu, i) => (
                  <div key={i} className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white  transition-all border-l-4 border-l-blue-600">
                    
                    {/* Node Index */}
                    <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-900 shadow-sm">
                      0{i + 1}
                    </div>
            
                    {/* Content Node */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                          {edu.institution_name}
                        </h4>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
                          {edu.education_name} {/* Displays "Btech", "HSC", etc. */}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-300" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {edu.start_year} <span className="text-slate-200 mx-1">—</span> {edu.end_year}
                          </span>
                        </div>
                      </div>
                    </div>
            
                    {/* Action Node */}
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsEditingEdu(true);
                        setCurrentEduId(edu.id);
                        // Pre-fill modal
                        setNewEdu({
                          education_id: edu.education_id,
                          institution_name: edu.institution_name,
                          start_year: edu.start_year,
                          end_year: edu.end_year,
                          education_name: edu.education_name,
                          score_metric: edu.score_metric || "",  
  score: edu.score || ""
                        });
                        setEduSearch(edu.education_name);
                        setShowEduModal(true);
                      }}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-90"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                  <Database className="mx-auto text-slate-200 mb-4" size={32} />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Zero Academic Nodes Registered</p>
                </div>
              )}
            </div>
                </div>
            
                {/* NAVIGATION */}
                <div className="flex justify-between pt-6">
                  <button type="button" onClick={() => setStep(2)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm">← Back</button>
                  <button
                    type="button"
                    onClick={async () => { await saveStepData(3); setStep(4); }}
                    className="px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
                  >Commit & Continue →</button>
                </div>
            
                {/* EDUCATION MODAL */}
              {/* 2. Updated Modal Content */}
            {showEduModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
                  
                  {/* Modal Header */}
                  <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                        <Award size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">Education Details</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Entry</p>
                      </div>
                    </div>
                    <button onClick={() => { setShowEduModal(false); setEduDropdownOpen(false); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
                      <X size={24} />
                    </button>
                  </div>
            
                  <div className="p-10 space-y-8 bg-white overflow-visible">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">
                      
                      {/* SEARCHABLE DROPDOWN */}
                      <div className="space-y-2 relative" ref={dropdownContainerRef}>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">
                          Degree Specification
                        </label>
                        <div className="relative group">
                          <input 
                            placeholder="Search node (HSC, Btech, SSC...)" 
                            value={eduSearch} 
                            onFocus={() => {
                              setEduDropdownOpen(true);
                              if (masterEducations.length === 0) fetchMasterEducations();
                            }}
                            onChange={(e) => {
                              setEduSearch(e.target.value);
                              setEduDropdownOpen(true);
                            }}
                            className={inputStyle + " pr-10 focus:border-blue-600 transition-all"} 
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {fetchingData ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                          </div>
                        </div>
            
                        {/* Dropdown Result Panel */}
                        {eduDropdownOpen && (
                          <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="max-h-[220px] overflow-y-auto custom-scrollbar-professional p-2 space-y-1 bg-white">
                              {masterEducations.filter(m => 
                                (m.name || "").toLowerCase().includes(eduSearch.toLowerCase())
                              ).length > 0 ? (
                                masterEducations
                                  .filter(m => (m.name || "").toLowerCase().includes(eduSearch.toLowerCase()))
                                  .slice(0, 20)
                                  .map((m) => (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => {
                                        setNewEdu({ ...newEdu, education_id: m.id, education_name: m.name });
                                        setEduSearch(m.name);
                                        setEduDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/item ${
                                        newEdu.education_id === m.id 
                                          ? "bg-blue-600 text-white" 
                                          : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                                      }`}
                                    >
                                      <span className="uppercase tracking-tight">{m.name}</span>
                                      {newEdu.education_id === m.id ? (
                                        <CheckCircle size={14} className="text-white" />
                                      ) : (
                                        <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                      )}
                                    </button>
                                  ))
                              ) : (
                                <div className="py-8 text-center bg-slate-50/50 rounded-xl">
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching degree nodes</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
            
                      <FormField label="Institution Name">
                        <input 
                          placeholder="e.g. Mumbai University" 
                          value={newEdu.institution_name} 
                          onChange={(e) => setNewEdu({ ...newEdu, institution_name: e.target.value })} 
                          className={inputStyle} 
                        />
                      </FormField>
                    </div>
            


            <div className="grid grid-cols-2 gap-8">
  {/* START YEAR NODE */}
  {/* <FormField label="Commencement Year">
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none">
        <Calendar size={16} />
      </div>
      <select 
        required
        value={newEdu.start_year} 
        onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} 
        className={inputStyle + " pl-12 appearance-none cursor-pointer relative bg-white"} 
      >
        <option value="">Select Year</option>
      
        {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors">
        <ChevronDown size={14} />
      </div>
    </div>
  </FormField> */}

<FormField label="Commencement Year">
  <div className="relative group isolate">
    {/* CONTEXT ICON */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-20 pointer-events-none">
      <Calendar size={16} />
    </div>
    
    <select 
      required
      disabled={fetchingData} // 🛠️ Disable while loading to prevent race conditions
      // value={newEdu.start_year} 
      onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} 
      className={inputStyle + ` pl-12 appearance-none cursor-pointer relative bg-white z-10 ${fetchingData ? 'opacity-0 ' : ''}`} 
    >
      <option value="" className="text-slate-400">Select Year</option>
      {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
        <option key={year} value={year} className="text-slate-900 bg-white py-2">
          {year}
        </option>
      ))}
    </select>

    {/* 🛠️ DYNAMIC ACTION NODE: Switches between Loader and Chevron */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300">
      {fetchingData ? (
        <Loader2 
          size={14} 
          className="animate-spin text-blue-600" 
        />
      ) : (
        <ChevronDown 
          size={14} 
          className="text-slate-50 group-hover:text-slate-50 transition-colors" 
        />
      )}
    </div>
  </div>
</FormField>

  {/* END YEAR NODE */}
  <FormField label="Completion Year">
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none">
        <Calendar size={16} />
      </div>
      <select 
        required
        value={newEdu.end_year} 
        onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })} 
        className={inputStyle + " pl-12 appearance-none cursor-pointer relative bg-white"} 
      >
        <option value="">Select Year</option>
        {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors">
        <ChevronDown size={14} />
      </div>
    </div>
  </FormField>
</div>

<div className="grid grid-cols-2 gap-8">
  {/* SCORE METRIC */}
  <FormField label="Score Matrix">
    <select
      value={newEdu.score_metric}
      onChange={(e) =>
        setNewEdu({ ...newEdu, score_metric: e.target.value })
      }
      className={inputStyle}
    >
      <option value="">Select</option>
      {SCORE_METRICS.map((metric) => (
        <option key={metric} value={metric}>
          {metric}
        </option>
      ))}
    </select>
  </FormField>

  {/* SCORE VALUE */}
  <FormField label="Score">
    <input
      placeholder="e.g. 8.5 / 75%"
      value={newEdu.score}
      onChange={(e) =>
        setNewEdu({ ...newEdu, score: e.target.value })
      }
      className={inputStyle}
    />
  </FormField>
</div>
            
                    <div className="flex justify-end pt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleSaveEducation}
                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3 hover:bg-blue-600"
                      >
                        <CheckCircle size={18} /> {isEditingEdu ? "Update" : "Synchronize Node"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                {/* STATUS SELECTOR CARD */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
                  <Fingerprint className="absolute -right-6 -bottom-6 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none" size={100} />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4 text-slate-900 font-black">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <Briefcase size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.15em]">Are you Fresher?</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Career status determines validation protocol</p>
                      </div>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
                      <button
                        type="button"
                        disabled={hasExistingExperience}
                        onClick={() => {
                          if (hasExistingExperience) return;
                          setIsFresher(true);
                          setFormData({ ...formData, experiences: [] });
                        }}
                        className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
                      >YES</button>
                      <button
                        type="button"
                        onClick={() => setIsFresher(false)}
                        className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
                      >NO</button>
                    </div>
                  </div>
                </div>
            
                {/* EXPERIENCE TIMELINE DISPLAY */}
                {isFresher === false && (
                  <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                          <History size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Job Experience History</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (newExperiences.length === 0) {
                            setNewExperiences([{ company_name: "", job_title: "", department: "", start_date: "", end_date: "", previous_ctc: "", location: "", description: "" }]);
                          }
                          setShowExpModal(true);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Plus size={14} strokeWidth={3} /> Add Experience
                      </button>
                    </div>
            
                    {/* VERIFIED DATA LIST (Shows existing records from formData) */}
                  
                    <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {formData.experiences && formData.experiences.length > 0 ? (
                formData.experiences.map((exp, i) => (
                  <div 
                    key={i} 
                    className="group relative flex flex-col md:flex-row items-stretch gap-0 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
                  >
                    {/* SIDE BRANDING BAR: Denotes 'Verified Node' status */}
                    <div className="w-1.5 bg-blue-600 group-hover:w-2 transition-all duration-300" />
            
                    {/* INDEX NODE: Terminal Style */}
                    <div className="flex items-center justify-center px-6 bg-slate-50/50 border-r border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 leading-none uppercase tracking-tighter">exp</span>
                        <span className="text-sm font-black text-slate-900 leading-none mt-1">0{i + 1}</span>
                      </div>
                    </div>
            
                    {/* MAIN CONTENT STRIP */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="min-w-0 space-y-2">
                        {/* Entity & Role */}
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-blue-600 transition-colors">
                            {exp.company_name || "Unidentified Entity"}
                          </h4>
                          <div className="h-1 w-1 rounded-full bg-slate-300" />
                          <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
                            {exp.job_title || "Role Pending"}
                          </div>
                        </div>
            
                        {/* Deployment Meta-Data */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={13} className="text-slate-300" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {exp.start_date || "----"} <span className="text-slate-200 mx-1">—</span> {exp.end_date || "Present"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={13} className="text-slate-300" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{exp.location || "Global Node"}</span>
                          </div>
                        </div>
                      </div>
            
                      {/* FINANCIAL NODE: High Contrast Badge */}
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end border-r border-slate-100 pr-6">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Previous CTC</span>
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[12px] font-black uppercase tracking-tight">
                              ₹{exp.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "0.00"}
                            </span>
                          </div>
                        </div>
            
                        {/* ACTION INTERFACE */}
                        <div className="flex items-center gap-2">
                          <button 
                            type="button" 
                            
            onClick={() => {
              const existing = formData.experiences[i];
            
              setCurrentEditingIndex(i);
            
              setNewExperiences([
                {
                  ...existing,
                  uploadMode: existing.exp_letter_link ? "link" : "file",
                  expLetterFile: null, // important
                },
              ]);
            
              setShowExpModal(true);
            }}
            
            
            
                            className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 border border-slate-100 active:scale-90"
                          >
                            <Edit3 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
            
                    {/* Decorative Watermark for Enterprise Feel */}
                    <History className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.02] -rotate-12 pointer-events-none group-hover:opacity-[0.05] transition-opacity" size={100} />
                  </div>
                ))
              ) : (
                /* EMPTY STATE: Audit-Empty Pattern */
                <div className="relative group flex flex-col items-center justify-center py-20 bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-[2.5rem] transition-colors hover:bg-slate-50">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-200 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Database size={32} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                      Zero Nodes Synchronized
                    </h4>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center max-w-xs">
                      Professional history registry currently empty. Initialize a new experience node to begin.
                    </p>
                  </div>
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
                     <ShieldCheck className="absolute -right-8 -bottom-8 text-slate-900 opacity-[0.02] -rotate-12" size={200} />
                  </div>
                </div>
              )}
            </div>
                  </div>
                )}
            
                {/* NAVIGATION */}
                <div className="flex justify-between pt-6">
                  <button type="button" onClick={() => setStep(3)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm transition-all hover:text-slate-900">← Back</button>
                  <button
                    type="button"
                    onClick={async () => { await saveStepData(4); setStep(5); }}
                    disabled={isFresher === null}
                    className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-200" : "bg-slate-200 text-slate-300 cursor-not-allowed"}`}
                  >Commit & Continue →</button>
                </div>
            
                {/* MODAL: ADDING NEW RECORDS ONLY (Upload Logic Removed) */}
               
                {showExpModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                  
                  {/* Modal Header */}
                  <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                        <Plus size={28} strokeWidth={3} />
                      </div>
                      <div>
                        {/* <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">New Experience</h2> */}
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">
                            {currentEditingIndex !== null ? "Edit Experience" : "New Experience"}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add new Experience Records</p>
                      </div>
                    </div>
                    <button onClick={() => setShowExpModal(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
                      <X size={24} />
                    </button>
                  </div>
            
                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar-professional bg-white">
                    {newExperiences.map((exp, i) => (
                      <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-8 rounded-[2.5rem] space-y-8 animate-in slide-in-from-bottom-4 group hover:bg-white hover:border-blue-200 transition-all">
                        {/* Remove Entry */}
                        <button
                          type="button"
                          onClick={() => setNewExperiences(newExperiences.filter((_, idx) => idx !== i))}
                          className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={18} />
                        </button>
            
                        {/* GRID 1: IDENTITY */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <FormField label="Employer">
                            <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...newExperiences]; u[i].company_name = e.target.value; setNewExperiences(u); }} className={inputStyle} />
                          </FormField>
                          <FormField label="Designation">
                            <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...newExperiences]; u[i].job_title = e.target.value; setNewExperiences(u); }} className={inputStyle} />
                          </FormField>
                          <FormField label="Location">
                            <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...newExperiences]; u[i].location = e.target.value; setNewExperiences(u); }} className={inputStyle} />
                          </FormField>
           
            
            <FormField label="Industry">
              <div className="relative">
                {/* INPUT BOX */}
                <input
                  value={exp.industry_name || ""} // Use name for display
                  placeholder="Search industry..."
                  onFocus={() => setShowIndustryDrop(true)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIndustrySearch(value);
                    const u = [...newExperiences];
                    u[i].industry_name = value; // Temporary display
                    setNewExperiences(u);
                  }}
                  className={inputStyle}
                />
            
                {/* DROPDOWN */}
                {showIndustryDrop && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-44 overflow-y-auto custom-scrollbar-professional">
                      {masterIndustries
                        .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
                        .length > 0 ? (
                        masterIndustries
                          .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
                          .map((ind) => (
                            <div
                              key={ind.id}
                              onClick={() => {
                                const u = [...newExperiences];
                                u[i].industry_id = ind.id; // ✅ Store the ID for API
                                u[i].industry_name = ind.name; // Store name for UI display
                                setNewExperiences(u);
                                setIndustrySearch("");
                                setShowIndustryDrop(false);
                              }}
                              className="px-4 py-2.5 text-[11px] font-black text-slate-700 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors uppercase tracking-tight flex justify-between items-center"
                            >
                              {ind.name}
                              {exp.industry_id === ind.id && <Check size={14} />}
                            </div>
                          ))
                      ) : (
                        <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase italic">
                          No matching industry 
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormField>
            
            
                        </div>
            
                        {/* GRID 2: TIMELINE & CTC */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                          <FormField label="Department">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Layers size={16} />
                  </div>
                  <select
                    value={exp.department || ""}
                    onChange={(e) => {
                      const u = [...newExperiences];
                      u[i].department = e.target.value;
                      setNewExperiences(u);
                    }}
                    className={inputStyle + " pl-12 appearance-none"}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </FormField>
                          <FormField label="Start Date">
                            <input type="date" value={exp.start_date} onChange={(e) => { const u = [...newExperiences]; u[i].start_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
                          </FormField>
                          <FormField label="End Date">
                            <input type="date" value={exp.end_date} onChange={(e) => { const u = [...newExperiences]; u[i].end_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
                          </FormField>
                          <FormField label="Annual CTC">
                            <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all">
                              <div className="px-4 text-blue-600 font-black italic">₹</div>
                              <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...newExperiences]; u[i].previous_ctc = e.target.value; setNewExperiences(u); }} className="w-full py-3 bg-transparent text-[12px] font-bold outline-none" />
                              <div className="pr-4 text-[9px] font-black text-slate-400">LPA</div>
                            </div>
                          </FormField>
                        </div>
            
                        {/* GRID 3: DESCRIPTION & ARTIFACT UPLOAD */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <FormField label="Professional Summary">
                            <textarea rows={4} placeholder="Briefly describe your role..." value={exp.description} onChange={(e) => { const u = [...newExperiences]; u[i].description = e.target.value; setNewExperiences(u); }} className={inputStyle + " resize-none"} />
                          </FormField>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experience Letter</p>
                              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 scale-90">
                                <button
                                  type="button"
                                  onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "file"; setNewExperiences(u); }}
                                  className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode !== "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                                >FILE</button>
                                <button
                                  type="button"
                                  onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "link"; setNewExperiences(u); }}
                                  className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                                >URL</button>
                              </div>
                            </div>
            
                            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 min-h-[140px] flex flex-col justify-center items-center group/upload hover:bg-blue-50/30 transition-all">
                              {exp.uploadMode !== "link" ? (
                                <label className="flex flex-col items-center cursor-pointer w-full">
                                  <FileUp size={24} className="text-slate-300 group-hover/upload:text-blue-500 mb-2 transition-colors" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">
                                    {exp.expLetterFile ? exp.expLetterFile.name : "Select PDF"}
                                  </span>
                                  <input 
                                    type="file" 
                                    accept=".pdf" 
                                    className="hidden" 
                                    onChange={(e) => { const u = [...newExperiences]; u[i].expLetterFile = e.target.files[0]; setNewExperiences(u); }} 
                                  />
                                </label>
                              ) : (
                                <div className="w-full px-4 relative">
                                  <LinkIcon size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
                                  <input 
                                    placeholder="Public Storage URI (https://...)" 
                                    value={exp.exp_letter_link || ""} 
                                    onChange={(e) => { const u = [...newExperiences]; u[i].exp_letter_link = e.target.value; setNewExperiences(u); }} 
                                    className={inputStyle + " pl-12"} 
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
            
                        {/* SAVE ACTION */}
                        <div className="flex justify-end pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            // onClick={() => handleSaveExperienceAPI(i)} 
                            onClick={() => handleSaveOrUpdateExperience(i)}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
                          >
                            {/* <CheckCircle size={16} /> Save */}
                            <CheckCircle size={16} />
            {currentEditingIndex !== null ? "Update" : "Save"}
            
                          </button>
                        </div>
                      </div>
                    ))}
            
                   
                    {currentEditingIndex === null && (
              <button
                type="button"
                onClick={() =>
                  setNewExperiences([
                    ...newExperiences,
                    {
                      company_name: "",
                      job_title: "",
                      start_date: "",
                      end_date: "",
                      previous_ctc: "",
                      location: "",
                      description: "",
                      industry: "",
                      uploadMode: "file",
                      expLetterFile: null,
                      exp_letter_link: "",
                      candidate_id: effectiveId,
                    },
                  ])
                }
                className="w-full py-8 border-2 border-dashed border-slate-400 rounded-[2.5rem] text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/20 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
              >
                + Add New Row
              </button>
            )}
            
                  </div>
            
                  {/* Modal Footer */}
                 
                </div>
              </div>
            )} 
              </div>
            )}

               {step === 5 && (
                          <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible">
                            <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl overflow-visible shadow-slate-200/50">
                              <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                    <Cpu size={20} />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                                      Skills & Assets
                                    </h3>
                                  </div>
                                </div>
                              </div>
                              <div className="p-8 md:p-12 space-y-12 overflow-visible">
                                <FormField label="Skills">
                                  <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                                      <div className="relative max-w-md w-full">
                                        <Plus
                                          size={16}
                                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                          value={skillInput}
                                          onChange={(e) => setSkillInput(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              const name = skillInput.trim();
                                              if (!name) return;
            
                                              // prevent duplicate
                                              if (!formData.skills.includes(name)) {
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  skills: [...prev.skills, name],
                                                }));
                                              }
            
                                              setSkillInput("");
                                            }
                                          }}
                                          placeholder="Enter skill..."
                                          className={inputStyle + " pl-12"}
                                        />
                                      </div>
                                    </div>
            
                                    <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
                                      {[
                                        ...new Set([...dynamicSkills, ...formData.skills]),
                                      ].map((skill) => {
                                        const isSelected = formData.skills.includes(skill);
            
                                        return (
                                          <button
                                            key={skill}
                                            type="button"
                                            onClick={() =>
                                              setFormData({
                                                ...formData,
                                                skills: isSelected
                                                  ? formData.skills.filter(
                                                      (s) => s !== skill,
                                                    )
                                                  : [...formData.skills, skill],
                                              })
                                            }
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${
                                              isSelected
                                                ? "bg-white border-blue-500 border-[1px] text-black shadow-lg shadow-blue-200"
                                                : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
                                            }`}
                                          >
                                            {skill}
                                            {isSelected && (
                                              <Check size={14} strokeWidth={3} />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </FormField>
                                {/* <FormField label="Enterprise Hardware Matrix"><div className="space-y-6 pt-8 border-t border-slate-100"><div className="relative max-w-md w-full"><Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={assetInput} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={async (e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) { const ok = await handleAddAssetAPI(v); if(ok) { setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); } } } }} placeholder="Link hardware..." className={inputStyle + " pl-12"} /></div><div className="flex flex-wrap gap-3 p-1">{dynamicAssets.map((asset) => { const isSelected = formData.assets.includes(asset); return (<button key={asset} type="button" onClick={async () => { if(!isSelected) { const ok = await handleAddAssetAPI(asset); if(ok) setFormData({...formData, assets: [...formData.assets, asset]}); } else { setFormData({...formData, assets: formData.assets.filter(a => a !== asset)}); } }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${isSelected ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}>{asset} {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}</button>); })}</div></div></FormField> */}
                                <div className="space-y-6 pt-8 border-t border-slate-100">
                                  <FormField label="Assets">
                                    <div className="space-y-6">
                                      {/* Search & Manual Add Input */}
                                      <div className="relative max-w-md">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                          <Layers size={16} />
                                        </div>
                                        <input
                                          value={assetInput}
                                          onChange={(e) => setAssetInput(e.target.value)}
                                          
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              const v = assetInput.trim();
                                              if (!v) return;
            
                                              // Prevent duplicate
                                              if (!formData.assets.includes(v)) {
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  assets: [...prev.assets, v],
                                                }));
                                              }
            
                                              setAssetInput("");
                                            }
                                          }}
                                          placeholder="Type Assets name and press Enter..."
                                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
                                        />
                                      </div>
            
                                      <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
                                        {[
                                          ...new Set([
                                            ...dynamicAssets,
                                            ...formData.assets,
                                          ]),
                                        ].filter(
                                          (a) => typeof a === "string" && a.trim() !== "",
                                        ).length === 0 ? (
                                          /* ❌ NO ASSETS */
                                          <div className="w-full text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                              No assets available
                                            </p>
                                          </div>
                                        ) : (
                                          /* ✅ ASSET CHIPS */
                                          [
                                            ...new Set([
                                              ...dynamicAssets,
                                              ...formData.assets,
                                            ]),
                                          ]
                                            .filter(
                                              (a) =>
                                                typeof a === "string" && a.trim() !== "",
                                            )
                                            .map((asset) => {
                                              const isSelected =
                                                formData.assets.includes(asset);
            
                                              return (
                                                <button
                                                  key={asset}
                                                  type="button"
                                                  onClick={() =>
                                                    setFormData((prev) => ({
                                                      ...prev,
                                                      assets: isSelected
                                                        ? prev.assets.filter(
                                                            (a) => a !== asset,
                                                          )
                                                        : [...prev.assets, asset],
                                                    }))
                                                  }
                                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90
                        ${
                          isSelected
                            ? "bg-white border-blue-500 text-black border-[1px] shadow-lg shadow-blue-200"
                            : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
                        }`}
                                                >
                                                  {asset}
                                                  {isSelected && (
                                                    <Check size={14} strokeWidth={3} />
                                                  )}
                                                </button>
                                              );
                                            })
                                        )}
                                      </div>
                                    </div>
                                  </FormField>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                              <button
                                onClick={() => setStep(4)}
                                type="button"
                                className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase transition-all shadow-sm hover:text-slate-900 flex items-center gap-2 transition-all"
                              >
                                <ChevronLeft size={16} /> Back
                              </button>
            
                              <button
                                onClick={async () => {
                                  await saveStepData(5);
                                  setStep(6);
                                }}
                                type="button"
                                className="px-12 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                              >
                                Next Phase <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        )}


                       

                       {step === 6 && (
                          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                            <div className="bg-white rounded-[2.5rem] border border-slate-200  overflow-hidden relative">
                              <div className=" px-10 py-8  flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                  <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                    <ShieldCheck size={28} strokeWidth={2.5} />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-black text-black tracking-tight uppercase">Document</h3>
                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] mt-1">Resume & Certificate Upload</p>
                                  </div>
                                </div>
                              </div>
                        
                              <div className="p-10 space-y-12">
                                
                                <div className="space-y-6">
                                  <div className="flex items-center gap-3 px-2">
                                    <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">01. Resume</h3>
                                  </div>
                                  {existingResume ? (
                                    <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                      <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm"><CheckCircle size={24} /></div>
                                        <div>
                                          <p className="text-[11px] font-black text-blue-700 uppercase">Resume Submited</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Uploaded</p>
                                        </div>
                                      </div>
                                      <a href={fixResumeUrl2(existingResume)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-200 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                                        <Eye size={14} /> Preview
                                      </a>
                                    </div>
                                  ) : (
                                   

<div className="relative group">
              <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-blue-500 transition-all cursor-pointer overflow-hidden">
                <FileUp className="absolute -right-4 -bottom-4 text-slate-100 opacity-50 -rotate-12 pointer-events-none" size={100} />
                
                <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <FileUp size={24} strokeWidth={2.5} />}
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                      {loading ? "Uploading..." : "Upload Resume"}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Upload the Document</p>
                  </div>
                </div>

                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf" 
                  disabled={loading}
                  onChange={(e) => handleResumeDirectUpload(e.target.files[0])} 
                />
              </label>
            </div>
                                  )}
                                </div>
                        
                             
                                <div className="space-y-6">
                                  <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                      <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">02. Uploaded Certificates</h3>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => { setEditingCertificate(null); setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); setShowCertEditModal(true); }}
                                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                                    >
                                      <PlusCircle size={14} /> Add Certificate
                                    </button>
                                  </div>
                        
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {existingCertificates.map((cert) => (
                                      <div key={cert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Award size={20} /></div>
                                          <div className="min-w-0">
                                            <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{cert.name}</p>
                                            <p className="text-[8px] font-black text-blue-500 uppercase tracking-tighter mt-0.5">Verified</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <a href={fixResumeUrl2(cert.file_path)} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
                                           <button type="button" onClick={() => { setEditingCertificate(cert); setCertForm({ name: cert.name, uploadMode: "file", certificate_file: null, certificate_link: "" }); setShowCertEditModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
                                        </div>
                                      </div>
                                    ))}
                        
                                   
                                    {formData.certificateFiles.map((file, idx) => (
                                       <div key={`pending-${idx}`} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-2xl animate-pulse">
                                          <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-600 text-white rounded-xl"><FileText size={20} /></div>
                                            <div>
                                              <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{formData.certificateNames[idx]}</p>
                                              <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">Pending Sync</p>
                                            </div>
                                          </div>
                                          <button type="button" onClick={() => {
                                            const newFiles = [...formData.certificateFiles]; newFiles.splice(idx, 1);
                                            const newNames = [...formData.certificateNames]; newNames.splice(idx, 1);
                                            setFormData({...formData, certificateFiles: newFiles, certificateNames: newNames});
                                          }} className="text-slate-300 hover:text-rose-500 transition-colors px-2"><Trash2 size={16}/></button>
                                       </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                        
                           
                              <div className="p-10  flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                              
                            <div className="flex justify-center pb-10">
                              <button
                                type="button"
                                onClick={() => setStep(5)}
                                className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
                              >
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Return to Assets & Skills
                              </button>
                            </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setLoading(true);
                                    await saveStepData(6);
                                    setLoading(false);
                                    toast.success("Final Registry Sync Complete ✔");
                                    navigate("/candidate");
                                  }}
                                  className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> <span>Submit & Close </span></>}
                                </button>
                              </div>
                            </div>
                           
                          </div>
                        )} 

          </div>
        </form>
      </div>

      {/* CERTIFICATE TERMINAL (ADD/EDIT MODAL) */}
      {showCertEditModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowCertEditModal(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header Protocol */}
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  {editingCertificate ? (
                    <Edit3 size={22} />
                  ) : (
                    <PlusCircle size={22} />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                    {editingCertificate
                      ? "Edit Certificate"
                      : "New Certificate"}
                  </h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Certificate{" "}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertEditModal(false)}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8 bg-white">
              {/* Compulsory Name Input */}
              <FormField label="Certificate Name" required>
                <input
                  placeholder="e.g. Google Cloud Professional"
                  value={certForm.name}
                  onChange={(e) =>
                    setCertForm({ ...certForm, name: e.target.value })
                  }
                  className={inputStyle}
                />
              </FormField>

              {/* Upload Mode Toggle */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Type Of Document
                </label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setCertForm({ ...certForm, uploadMode: "file" })
                    }
                    className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "file" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCertForm({ ...certForm, uploadMode: "link" })
                    }
                    className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
                  >
                    URI
                  </button>
                </div>
              </div>

              {/* Conditional Input Box */}
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {certForm.uploadMode === "file" ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/30 hover:bg-white hover:border-blue-500 transition-all group/up">
                    <label className="cursor-pointer block">
                      <FileUp
                        className="mx-auto text-slate-300 group-hover/up:text-blue-500 mb-3 transition-colors"
                        size={32}
                      />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                        {certForm.certificate_file
                          ? certForm.certificate_file.name
                          : "Add Certificate PDF"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) =>
                          setCertForm({
                            ...certForm,
                            certificate_file: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative group">
                    <LinkIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      placeholder="https://credential-verify.com/id..."
                      value={certForm.certificate_link}
                      onChange={(e) =>
                        setCertForm({
                          ...certForm,
                          certificate_link: e.target.value,
                        })
                      }
                      className={inputStyle + " pl-12 h-14"}
                    />
                  </div>
                )}
              </div>

              {/* Commit Action */}
              <button
                type="button"
                onClick={
                  editingCertificate ? updateCertificate : handleAddCertificate
                }
                className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Database size={16} />
                {editingCertificate
                  ? "Certificate Update"
                  : "Add New Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `.custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }.custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }.custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }.custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }`,
        }}
      />
    </div>
  );
};

export default ManualEntry;
///************************************************working code phase 1 24/02/26 9:26******************************************************* */
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Check,
//   Award,
//   Eye,
//   PlusCircle,
//   User,
//   ExternalLink,
//   Briefcase,
//   Fingerprint,
//   Calendar,
//   FileText,
//   CheckCircle,
//   Activity,
//   MapPin,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   Edit3,
//   LinkIcon,
//   FileUp,
//   ChevronRight,
//   ChevronLeft,
//   ChevronDown,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-start gap-1 items-center">
//       <span>{label}</span>
//       <span
//         className={`font-bold text-[15px] normal-case ${required ? "text-red-500" : "text-slate-300"}`}
//       >
//         {required ? "*" : ""}
//       </span>
//     </label>
//     {children}
//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntry = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const effectiveId = id || "666";
//   const ASSET_OPTIONS = [
//     "Laptop",
//     "Mouse",
//     "Keyboard",
//     "Monitor",
//     "Headset",
//     "Mobile",
//     "ID Card",
//     "SIM Card",
//   ];
//   // Professional Enterprise Input Style
//   const inputStyle =
//     "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";

//   // 1. INITIALIZE ALL STATES
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [isFresher, setIsFresher] = useState(null);
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState("");
//   const [dynamicSkills, setDynamicSkills] = useState([]);
//   const [existingResume, setExistingResume] = useState("");
//   const [industrySearch, setIndustrySearch] = useState("");
//   const [showIndustryDrop, setShowIndustryDrop] = useState(false);
//   const [dynamicAssets, setDynamicAssets] = useState([]);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const dropdownContainerRef = useRef(null);
//   const [existingCertificates, setExistingCertificates] = useState([]);
//   const [editingCertId, setEditingCertId] = useState(null);
//   const [editingCertValue, setEditingCertValue] = useState("");
//   const [showExpModal, setShowExpModal] = useState(false);
//   const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
//   const [newExperiences, setNewExperiences] = useState([]);
//   const [masterIndustries, setMasterIndustries] = useState([]);
//   const [baseData, setBaseData] = useState({});
// const [isSubmitted, setIsSubmitted] = useState(false);
//   //**********************************certiificate and resume*********************************** */

//   const [docType, setDocType] = useState("resume");
//   // "resume" | "certificate"

//   const [showCertEditModal, setShowCertEditModal] = useState(false);
//   const [editingCertificate, setEditingCertificate] = useState(null);

//   const [certForm, setCertForm] = useState({
//     name: "",
//     certificate_file: null,
//     certificate_link: "",
//     uploadMode: "file", // file | link
//   });

//   const SCORE_METRICS = ["Percentage", "CGPA", "GPA"];

//   //**********************************certiificate and resume end*********************************** */

//   //**********************************eduction*********************************** */

//   const [showEduModal, setShowEduModal] = useState(false);
//   const [masterEducations, setMasterEducations] = useState([]);
//   const [eduDropdownOpen, setEduDropdownOpen] = useState(false);
//   const [isEditingEdu, setIsEditingEdu] = useState(false);
//   const [currentEduId, setCurrentEduId] = useState(null);
//   const [newEdu, setNewEdu] = useState({
//     education_id: 0,
//     institution_name: "",
//     start_year: "",
//     end_year: "",
//     education_name: "", // For display in dropdown
//   });

//   //**********************************eduction  end*********************************** */
//   const careerStepRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     address2: "",
//     location: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "India",
//     position: "",
//     gender: "",
//     dob: "",
//     education: [],
//     experience: "",
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const totalSteps = 6;

//   const educationOptions = [
//     "SSC / 10th",
//     "HSC / 12th",
//     "ITI",
//     "Diploma",
//     "Polytechnic",

//     "B.A",
//     "B.Com",
//     "B.Sc",
//     "BCA",
//     "BBA",
//     "B.Tech",
//     "BE",
//     "B.Pharm",
//     "B.Ed",

//     "M.A",
//     "M.Com",
//     "M.Sc",
//     "MCA",
//     "MBA",
//     "M.Tech",
//     "ME",
//     "M.Pharm",
//     "M.Ed",

//     "PGDM",
//     "Post Graduate Diploma",

//     "PhD / Doctorate",
//   ];

//   const POSITION_OPTIONS = [
//     // IT / Software
//     "Frontend Developer",
//     "Backend Developer",
//     "Full Stack Developer",
//     "Software Engineer",
//     "Senior Software Engineer",
//     "Lead Developer",
//     "DevOps Engineer",
//     "QA Engineer",
//     "Automation Tester",
//     "Manual Tester",
//     "UI/UX Designer",
//     "Mobile App Developer",
//     "Android Developer",
//     "iOS Developer",
//     "Data Analyst",
//     "Data Scientist",
//     "Machine Learning Engineer",
//     "AI Engineer",
//     "Cloud Engineer",
//     "System Administrator",
//     "Network Engineer",
//     "Cyber Security Analyst",

//     // Management / Office
//     "Project Manager",
//     "Product Manager",
//     "Operations Manager",
//     "Team Lead",
//     "Business Analyst",
//     "HR Executive",
//     "HR Manager",
//     "Recruiter",
//     "Office Administrator",

//     // Non-IT / General
//     "Accountant",
//     "Finance Executive",
//     "Sales Executive",
//     "Marketing Executive",
//     "Digital Marketing Specialist",
//     "Customer Support Executive",
//     "Technical Support Engineer",
//     "Field Executive",
//     "Supervisor",
//     "Store Manager",
//     "Warehouse Executive",

//     // Fresher / Entry
//     "Intern",
//     "Trainee",
//     "Graduate Engineer Trainee",
//     "Apprentice",
//   ];

//   const filteredEducation = educationOptions.filter((e) =>
//     e.toLowerCase().includes(eduSearch.toLowerCase()),
//   );
//   const filteredDepartments = departments.filter((d) =>
//     (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()),
//   );
//   const isStep1Valid =
//     formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && formData.phone;

//   // 2. HYDRATION LOGIC (GET API)
//   useEffect(() => {
//     hydrateNode();
//   }, [effectiveId]);

//   //    const hydrateNode = async () => {
//   //       setFetchingData(true);
//   //       try {
//   //         const response = await fetch(
//   //           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//   //         );
//   //         if (!response.ok) throw new Error();
//   //         const data = await response.json();

//   //         if (data) {
//   //           setExistingResume(data.resume_path || "");

//   //           setExistingCertificates(
//   //             Array.isArray(data.certificates) ? data.certificates : [],
//   //           );

//   //           const safeParse = (value) => {
//   //             if (!value) return [];

//   //             try {
//   //               // Already array → fix broken JSON pieces
//   //               if (Array.isArray(value)) {
//   //                 const joined = value.join("");
//   //                 if (joined.startsWith("[")) {
//   //                   return JSON.parse(joined);
//   //                 }
//   //                 return value;
//   //               }

//   //               // If string JSON
//   //               if (typeof value === "string" && value.startsWith("[")) {
//   //                 return JSON.parse(value);
//   //               }

//   //               // If CSV string → convert to array
//   //               if (typeof value === "string") {
//   //                 return value
//   //                   .split(",")
//   //                   .map((s) => s.trim())
//   //                   .filter(Boolean);
//   //               }

//   //               return [];
//   //             } catch {
//   //               return [];
//   //             }
//   //           };

//   //           setFormData((prev) => ({
//   //             ...prev,
//   //             name: data.full_name || "",
//   //             email: data.email || "",
//   //             phone: data.phone || "",
//   //             gender: data.gender || "",
//   //             dob: data.dob || "",
//   //             address: data.address || "",
//   //             address2: data.address2 || "",
//   //             location: data.location || "",
//   //             pincode: data.pincode || "",
//   //             city: data.city || "",
//   //             state: data.state || "",
//   //             district: data.district || "",
//   //             country: data.country || "India",
//   //             position: data.position || "",
//   //             experience: data.experience || "",
//   //            education: Array.isArray(data.educations)
//   //       ? data.educations.map(edu => ({
//   //           id: edu.id,
//   //           education_id: edu.education_id,
//   //           institution_name: edu.institution_name,
//   //           start_year: edu.start_year,
//   //           end_year: edu.end_year,
//   //           // Extract the name from education_master for the UI
//   //           education_name: edu.education_master?.name || "Unknown Degree"
//   //         }))
//   //       : [],

//   //             department: data.department || "",
//   //             about_me: data.about_me || "",
//   //             resume_link: data.resume_path || "",
//   //             languages_spoken: safeParse(data.languages_spoken),
//   //             experiences: data.experiences || [],
//   //             skills: safeParse(data.skills),
//   //             assets: safeParse(data.assets),
//   //           }));

//   //           setIsFresher(!data.experiences || data.experiences.length === 0);
//   //         }

//   //         const deptData = await departmentService.getAll();
//   //         setDepartments(deptData || []);
//   //         await fetchSkills();
//   //         await fetchAssets(effectiveId);
//   //       } catch (err) {
//   //         console.warn("Initializing Empty Node");
//   //       } finally {
//   //         setFetchingData(false);
//   //       }
//   //     };

//   const hydrateNode = async () => {
//     setFetchingData(true);
//     try {
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//       );
//       if (!response.ok) throw new Error();
//       const data = await response.json();

//       if (data) {
//         setExistingResume(data.resume_path || "");

//         setExistingCertificates(
//           Array.isArray(data.certificates) ? data.certificates : [],
//         );

//         const safeParse = (value) => {
//           if (!value) return [];
//           try {
//             if (Array.isArray(value)) {
//               const joined = value.join("");
//               if (joined.startsWith("[")) {
//                 return JSON.parse(joined);
//               }
//               return value;
//             }
//             if (typeof value === "string" && value.startsWith("[")) {
//               return JSON.parse(value);
//             }
//             if (typeof value === "string") {
//               return value
//                 .split(",")
//                 .map((s) => s.trim())
//                 .filter(Boolean);
//             }
//             return [];
//           } catch {
//             return [];
//           }
//         };

//         const mappedEducation = Array.isArray(data.educations)
//           ? data.educations.map((edu) => ({
//               id: edu.id,
//               education_id: edu.education_id,
//               institution_name: edu.institution_name,
//               start_year: edu.start_year,
//               end_year: edu.end_year,
//               education_name: edu.education_master?.name || "Unknown Degree",
//             }))
//           : [];

//         // Create a snapshot object for comparison
//         const serverSnapshot = {
//           name: data.full_name || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           gender: data.gender || "",
//           dob: data.dob || "",
//           address: data.address || "",
//           address2: data.address2 || "",
//           location: data.location || "",
//           pincode: data.pincode || "",
//           city: data.city || "",
//           state: data.state || "",
//           district: data.district || "",
//           country: data.country || "India",
//           position: data.position || "",
//           experience: data.experience || "",
//           education: mappedEducation,
//           department: data.department || "",
//           about_me: data.about_me || "",
//           resume_link: data.resume_path || "",
//           languages_spoken: safeParse(data.languages_spoken),
//           experiences: data.experiences || [],
//           skills: safeParse(data.skills),
//           assets: safeParse(data.assets),
//         };

//         // Set both current form and base reference
//         setFormData((prev) => ({ ...prev, ...serverSnapshot }));
//         setBaseData(serverSnapshot); // Ensure you have [baseData, setBaseData] = useState({})

//         setIsFresher(!data.experiences || data.experiences.length === 0);
//       }

//       const deptData = await departmentService.getAll();
//       setDepartments(deptData || []);
//       await fetchSkills();
//       await fetchAssets(effectiveId);
//     } catch (err) {
//       console.warn("Initializing Empty Node");
//     } finally {
//       setFetchingData(false);
//     }
//   };
//   const INDUSTRY_OPTIONS = [
//     "Information Technology",
//     "Software Development",
//     "Banking & Finance",
//     "Healthcare",
//     "Education",
//     "Manufacturing",
//     "Retail",
//     "Telecom",
//     "Construction",
//     "Logistics",
//     "Marketing & Advertising",
//     "HR / Recruitment",
//     "Government",
//     "Automobile",
//     "Pharmaceutical",
//     "E-Commerce",
//     "Media & Entertainment",
//     "Real Estate",
//     "Hospitality",
//     "Other",
//   ];

//   // Click Outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownContainerRef.current &&
//         !dropdownContainerRef.current.contains(event.target)
//       ) {
//         setShowSkillDrop(false);
//         setShowAssetDrop(false);
//         setSkillFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // READ STEP FROM URL (?step=3)
//   useEffect(() => {
//     const stepFromUrl = Number(searchParams.get("step"));

//     if (stepFromUrl && stepFromUrl >= 1 && stepFromUrl <= totalSteps) {
//       setStep(stepFromUrl);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     fetchMasterIndustries();
//   }, []);

//   // 3. HANDLERS
//   const fetchSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills",
//       );
//       const data = await res.json();
//       setDynamicSkills(data.map((item) => item.name || item));
//     } catch {}
//   };

//   const fetchAssets = async (cId) => {
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${cId}/assets`,
//       );
//       const data = await res.json();
//       setDynamicAssets(Array.isArray(data) ? data.map((a) => a.name) : []);
//     } catch {}
//   };

//   const handleManualAddSkill = async () => {
//     const name = skillInput.trim();
//     if (!name) {
//       await fetchSkills();
//       return;
//     }
//     const success = await handleCreateMaster("skills", name);
//     if (success) {
//       if (!formData.skills.includes(name))
//         setFormData((p) => ({ ...p, skills: [...p.skills, name] }));
//       setSkillInput("");
//       await fetchSkills();
//     }
//   };

//   const handleCreateMaster = async (type, name) => {
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/masters/${type}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: name.trim() }),
//         },
//       );
//       return res.ok;
//     } catch {
//       return false;
//     }
//   };

//   const handleAddAssetAPI = async (assetName) => {
//     if (!assetName.trim()) return;
//     const loadingToast = toast.loading(`Linking asset...`);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/assets`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: assetName.trim() }),
//         },
//       );
//       if (res.ok) {
//         toast.success("Linked", { id: loadingToast });
//         await fetchAssets(effectiveId);
//         return true;
//       }
//     } catch {
//       toast.error("Sync failed", { id: loadingToast });
//     }
//     return false;
//   };

//   const filteredIndustries = INDUSTRY_OPTIONS.filter((ind) =>
//     ind.toLowerCase().includes(industrySearch.toLowerCase()),
//   );

//   const handleSaveOrUpdateExperience = async (i) => {
//     const exp = newExperiences[i];

//     if (
//       !exp.company_name ||
//       !exp.job_title ||
//       !exp.start_date ||
//       !exp.end_date
//     ) {
//       toast.error("Company, Role, Start Date, End Date required");
//       return;
//     }

//     const loadingToast = toast.loading(
//       currentEditingIndex !== null
//         ? "Updating experience..."
//         : "Saving experience...",
//     );

//     try {
//       const fd = new FormData();

//       fd.append("company_name", exp.company_name);
//       fd.append("job_title", exp.job_title);
//       fd.append("start_date", exp.start_date);
//       fd.append("department", exp.department || "");
//       fd.append("end_date", exp.end_date);
//       fd.append("previous_ctc", exp.previous_ctc || "");
//       fd.append("location", exp.location || "");
//       fd.append("description", exp.description || "");
//       // fd.append("industry_id", exp.industry || "");
//       fd.append("industry_id", exp.industry_id || "");

//       if (exp.uploadMode === "link") {
//         fd.append("exp_letter_link", exp.exp_letter_link || "");
//       } else if (exp.expLetterFile instanceof File) {
//         fd.append("exp_letter_file", exp.expLetterFile);
//       }

//       // =========================
//       // UPDATE (PATCH)
//       // =========================
//       if (currentEditingIndex !== null && exp.id) {
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences/${exp.id}`,
//           {
//             method: "PUT",
//             body: fd,
//           },
//         );

//         if (!res.ok) throw new Error(await res.text());

//         // Update UI instantly
//         const updated = [...formData.experiences];
//         updated[currentEditingIndex] = exp;

//         setFormData((prev) => ({
//           ...prev,
//           experiences: updated,
//         }));

//         toast.success("Experience Updated ✅", { id: loadingToast });
//       }

//       // =========================
//       // ADD NEW (POST)
//       // =========================
//       else {
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences`,
//           {
//             method: "POST",
//             body: fd,
//           },
//         );

//         if (!res.ok) throw new Error(await res.text());

//         await hydrateNode(); // reload from backend

//         toast.success("Experience Added ✅", { id: loadingToast });
//       }

//       setNewExperiences([]);
//       setCurrentEditingIndex(null);
//       setShowExpModal(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed ❌", { id: loadingToast });
//     }
//   };

//   const fetchMasterIndustries = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters?types=industries&skip=0&limit=100",
//       );
//       const data = await res.json();
//       // Assuming API returns { industries: [...] }
//       setMasterIndustries(data.industries || []);
//     } catch (err) {
//       console.error("Industry Load Error", err);
//     }
//   };

//   // Fetch Master Education List
//   const fetchMasterEducations = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters?types=educations&skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterEducations(data.educations || []);
//     } catch (err) {
//       console.error("Master Load Error", err);
//     }
//   };

//   // Save or Update Education
//   const handleSaveEducation = async () => {
//     const loadingToast = toast.loading(
//       isEditingEdu ? "Updating Node..." : "Syncing Education...",
//     );
//     const url = isEditingEdu
//       ? `https://apihrr.goelectronix.co.in/education/${currentEduId}?user_type=candidate`
//       : `https://apihrr.goelectronix.co.in/education/${effectiveId}?user_type=candidate`;

//     try {
//       const res = await fetch(url, {
//         method: isEditingEdu ? "PATCH" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           education_id: newEdu.education_id,
//           institution_name: newEdu.institution_name,
//           start_year: newEdu.start_year,
//           end_year: newEdu.end_year,
//         }),
//       });

//       if (res.ok) {
//         toast.success("Education Node Synchronized", { id: loadingToast });
//         setShowEduModal(false);
//         // Logic to refresh your formData.education from GET API here
//         // 🔥 REFRESH LOGIC: Trigger hydration to pull the updated 'educations' array
//         await hydrateNode();

//         // Reset Search state
//         setEduSearch("");
//       }
//     } catch (err) {
//       toast.error("Sync Failed", { id: loadingToast });
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;

//     setIsFetchingPincode(true);

//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();

//       if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
//         const postOffices = data[0].PostOffice;

//         setCityOptions(postOffices); // ⭐ store full objects

//         const first = postOffices[0];

//         setFormData((prev) => ({
//           ...prev,
//           city: first.Name || "",
//           district: first.District || "",
//           state: first.State || "",
//           country: first.Country || "India",
//         }));
//       } else {
//         setCityOptions([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setCityOptions([]);
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   // ---------- STEP VALIDATION ----------

//   const STEP_FIELDS = {
//     1: [
//       "name",
//       "email",
//       "phone",
//       "gender",
//       "dob",
//       "position",
//       "experience",
//       "education",
//       "department",
//       "about_me",
//       "languages_spoken",
//     ],

//     2: [
//       "address",
//       "address2",
//       "location",
//       "pincode",
//       "city",
//       "district",
//       "state",
//       "country",
//     ],

//     // ✅ NEW EDUCATION STEP
//     3: ["education"],

//     // ✅ EXPERIENCE SHIFTED TO 4
//     4: ["experiences"],

//     // ✅ SKILLS & ASSETS SHIFTED TO 5
//     5: ["skills", "assets"],

//     // ✅ DOCUMENTS SHIFTED TO 6
//     6: ["resume_link", "cvFile", "certificateFiles", "certificateLinks"],
//   };

//   // STEP 1 → Personal
//   const isStep1Incomplete = () => {
//     return !(
//       formData.name &&
//       formData.email &&
//       formData.phone &&
//       formData.gender &&
//       formData.dob &&
//       (formData.languages_spoken || []).length > 0 &&
//       formData.about_me
//     );
//   };

//   // STEP 2 → Location
//   const isStep2Incomplete = () => {
//     return !(
//       formData.address &&
//       formData.city &&
//       formData.state &&
//       formData.pincode
//     );
//   };

// //   // STEP 3 → Education
// //   const isStep3Incomplete = () => {
// //     return !(
// //       Array.isArray(formData.education) && formData.education.length > 0
// //     );
// //   };

// //   // STEP 4 → Experience
// //   const isStep4Incomplete = () => {
// //     if (isFresher) return false; // Fresher doesn't require experience

// //     return !(
// //       Array.isArray(formData.experiences) && formData.experiences.length > 0
// //     );
// //   };

// // Step 3 → Education Incompletion Logic
// const isStep3Incomplete = () => {
//   return !(Array.isArray(formData.education) && formData.education.length > 0);
// };

// // Step 4 → Experience Incompletion Logic (Respects isFresher)
// const isStep4Incomplete = () => {
//   if (isFresher) return false; // Fresher doesn't require experience records
//   return !(Array.isArray(formData.experiences) && formData.experiences.length > 0);
// };

//   // STEP 5 → Skills & Assets
// //   const isStep5Incomplete = () => {
// //     return !(
// //       (formData.skills && formData.skills.length > 0) ||
// //       (formData.assets && formData.assets.length > 0)
// //     );
// //   };

// const isStep5Incomplete = () => {
//   return (
//     (!formData.skills || formData.skills.length === 0) &&
//     (!formData.assets || formData.assets.length === 0)
//   );
// };

//   // STEP 6 → Documents
// //   const isStep6Incomplete = () => {
// //     return !(
// //       existingResume ||
// //       formData.cvFile ||
// //       (formData.certificateFiles && formData.certificateFiles.length > 0) ||
// //       (existingCertificates && existingCertificates.length > 0)
// //     );
// //   };

// // Step 6 Check: Yellow if no Resume AND no Certificates exist
// const isStep6Incomplete = () => {
//   const hasResume =  (formData.resume_link && formData.resume_link.trim() !== "") || formData.cvFile || existingResume;
//   const hasCertificates = (formData.certificateFiles && formData.certificateFiles.length > 0) || 
//                           (existingCertificates && existingCertificates.length > 0) ||
//                           (formData.certificateLinks && formData.certificateLinks.some(l => l.trim() !== ""));
                          
//   return !hasResume && !hasCertificates;
// };

//   const fixResumeUrl = (url) => {
//     if (!url) return "";

//     // remove wrong https//
//     let clean = url.replace(/^https\/\//, "");

//     // if already full valid http/https → keep it
//     if (clean.startsWith("http://") || clean.startsWith("https://")) {
//       return clean;
//     }

//     // attach correct base URL
//     return `https://apihrr.goelectronix.co.in/${clean.replace(/^\/+/, "")}`;
//   };

//   const fixResumeUrl2 = (url) => {
//     if (!url) return "";

//     let clean = url.trim();

//     // Fix broken https//
//     clean = clean.replace(/^https\/\//, "https://");

//     // 🔴 If URL is https://uploads/... → replace domain
//     if (clean.startsWith("https://uploads")) {
//       return clean.replace(
//         "https://uploads",
//         "https://apihrr.goelectronix.co.in/uploads",
//       );
//     }

//     // Already full valid URL → return
//     if (clean.startsWith("http://") || clean.startsWith("https://")) {
//       return clean;
//     }

//     // Remove starting slash
//     clean = clean.replace(/^\/+/, "");

//     // Attach backend base
//     return `https://apihrr.goelectronix.co.in/${clean}`;
//   };

//   const hasExistingExperience =
//     Array.isArray(formData.experiences) && formData.experiences.length > 0;

//   const saveStepData = async (stepNumber) => {
//     const fields = STEP_FIELDS[stepNumber] || [];

//     // --- 1. CHANGE DETECTION PROTOCOL ---
//     // Compares current formData against the baseData snapshot retrieved during hydration
//     const hasChanged = fields.some((key) => {
//       // Handling for Arrays (Languages, Skills, Assets, Education, Experiences)
//       if (Array.isArray(formData[key])) {
//         return JSON.stringify(formData[key]) !== JSON.stringify(baseData[key]);
//       }
//       // Handling for File objects (Resume/Certificates)
//       if (formData[key] instanceof File) return true;

//       // Standard primitive comparison (Strings/Numbers)
//       return (formData[key] || "") !== (baseData[key] || "");
//     });

//     // If no changes are detected, we bypass the API call and return true to allow navigation
//     if (!hasChanged) {
//       console.log(
//         `Step ${stepNumber}: No changes detected. Skipping network request.`,
//       );
//       return true;
//     }

//     try {
//       const apiData = new FormData();

//       // --- 2. DYNAMIC PAYLOAD CONSTRUCTION ---
//       fields.forEach((key) => {
//         // Group: CSV Serialization (Languages, Skills, Assets)
//         if (["languages_spoken", "skills", "assets"].includes(key)) {
//           apiData.append(key, (formData[key] || []).join(","));
//         }

//         // Group: JSON Serialization (Education, Experiences)
//         else if (key === "education") {
//           apiData.append(
//             "education_details",
//             JSON.stringify(formData.education || []),
//           );
//         } else if (key === "experiences") {
//           apiData.append(
//             "experience_details",
//             JSON.stringify(formData.experiences || []),
//           );
//         }

//         // Group: File/Link Handling (Master Resume - Step 6)
//         else if (key === "cvFile" && formData.cvFile) {
//           apiData.append("resumepdf", formData.cvFile);
//         } else if (key === "resume_link" && formData.resume_link) {
//           apiData.append("resume_link", formData.resume_link);
//         }

//         // Group: Certificate Batching (Step 6)
//         else if (key === "certificateFiles") {
//           formData.certificateFiles.forEach((file, idx) => {
//             apiData.append("certificate_files", file);
//             if (formData.certificateNames?.[idx]) {
//               apiData.append(
//                 "certificate_names",
//                 formData.certificateNames[idx],
//               );
//             }
//           });
//         }

//         // Group: Standard Strings (Name, Address, etc.)
//         else {
//           apiData.append(key, formData[key] ?? "");
//         }
//       });

//       // Special Case: Ensure full_name is always present as per API requirements
//       apiData.append("full_name", formData.name || "");

//       // --- 3. API EXECUTION ---
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//         {
//           method: "PATCH",
//           body: apiData,
//         },
//       );

//       if (response.ok) {
//         // --- 4. POST-SYNC CLEANUP ---
//         // Update the baseData snapshot to match current state so subsequent clicks don't re-trigger
//         const updatedFields = {};
//         fields.forEach((f) => {
//           updatedFields[f] = formData[f];
//         });
//         setBaseData((prev) => ({ ...prev, ...updatedFields }));

//         if (stepNumber === 6) {
//           setFormData((prev) => ({
//             ...prev,
//             certificateFiles: [],
//             certificateLinks: [""],
//           }));
//         }

//         toast.success(`Saved the updated code: Step ${stepNumber}`);
//         return true;
//       } else {
//         throw new Error("Registry update rejected");
//       }
//     } catch (err) {
//       console.error("Critical Sync Error:", err);
//       toast.error(`Step ${stepNumber} save failed`);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const loadingToast = toast.loading("Executing Final PATCH Sync...");

//     try {
//       const apiData = new FormData();

//       // 🔹 Append ALL simple fields (NO skipping empty)
//       for (const key in formData) {
//         if (
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "skills",
//             "assets",
//           ].includes(key)
//         ) {
//           apiData.append(key, formData[key] ?? "");
//         }
//       }

//       // 🔹 Required backend fields
//       apiData.append("full_name", formData.name || "");

//       apiData.append(
//         "languages_spoken",
//         (formData.languages_spoken || []).join(","),
//       );

//       apiData.append("skills", (formData.skills || []).join(","));
//       apiData.append("assets", (formData.assets || []).join(","));

//       // CASE 1: Upload PDF
//       if (formData.cvFile) {
//         apiData.append("resumepdf", formData.cvFile); // ✅ correct key
//       }

//       // CASE 2: Resume Link
//       else if (formData.resume_link) {
//         apiData.append("resume_link", formData.resume_link); // ✅ correct key
//       }

//       // CASE 3: Keep existing resume (no change)
//       else if (existingResume) {
//         apiData.append("resume_link", existingResume);
//       }

//       // 🔹 Certificates FILES
//       formData.certificateFiles.forEach((file) => {
//         apiData.append("certificates", file);
//       });

//       // 🔹 Certificate LINKS
//       apiData.append(
//         "certificate_links",
//         JSON.stringify(formData.certificateLinks.filter((l) => l && l.trim())),
//       );

//       // 🔹 Debug — SEE WHAT GOES TO API
//       for (let pair of apiData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//         {
//           method: "PATCH",
//           body: apiData,
//         },
//       );

//       if (!response.ok) {
//         const err = await response.text();
//         console.error(err);
//         throw new Error("API Failed");
//       }

//       toast.success("Candidate Synchronized 🎉", { id: loadingToast });
//     } catch (err) {
//       console.error(err);
//       toast.error("Commit failed ❌", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCertificate = async () => {
//     // 1. Validation Logic
//     if (!certForm.name.trim())
//       return toast.error("Artifact Label is compulsory");

//     if (certForm.uploadMode === "file" && !certForm.certificate_file) {
//       return toast.error("Please select a PDF file");
//     }
//     if (certForm.uploadMode === "link" && !certForm.certificate_link) {
//       return toast.error("Please enter a URI link");
//     }

//     const loadingToast = toast.loading("Deploying new credential node...");

//     try {
//       const apiData = new FormData();

//       // ✅ Following Request Body from Image 1: name, certificate_file, certificate_link
//       apiData.append("name", certForm.name.trim());

//       if (certForm.uploadMode === "file") {
//         apiData.append("certificate_file", certForm.certificate_file);
//         // Backend expects either file or link; image shows link is optional if file is present
//       } else {
//         apiData.append("certificate_link", certForm.certificate_link.trim());
//       }

//       // ✅ Image 1 Endpoint: POST /{person_type}/{person_id}/certificates
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates`,
//         {
//           method: "POST",
//           body: apiData,
//         },
//       );

//       if (response.ok) {
//         toast.success("Credential Registered 🎉", { id: loadingToast });

//         // Reset Modal State
//         setShowCertEditModal(false);
//         setCertForm({
//           name: "",
//           certificate_file: null,
//           certificate_link: "",
//           uploadMode: "file",
//         });

//         // 🔥 REFRESH UI
//         await hydrateNode();
//       } else {
//         const errorText = await response.text();
//         console.error("Registry Sync Error:", errorText);
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Deployment failed ❌", { id: loadingToast });
//     }
//   };

//   // --- UPDATE EXISTING CERTIFICATE (Direct PUT) ---
//   const updateCertificate = async () => {
//     if (!certForm.name.trim())
//       return toast.error("Artifact Label is compulsory");

//     const loadingToast = toast.loading("Updating Node Artifact...");
//     try {
//       const fd = new FormData();

//       // ✅ Following Request Body from Image 2
//       fd.append("name", certForm.name.trim());

//       if (certForm.uploadMode === "file" && certForm.certificate_file) {
//         fd.append("certificate_file", certForm.certificate_file);
//       } else if (certForm.uploadMode === "link" && certForm.certificate_link) {
//         fd.append("certificate_link", certForm.certificate_link.trim());
//       }

//       // ✅ Image 3 Parameters: /candidates/{person_id}/certificates/{certificate_id}
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates/${editingCertificate.id}`,
//         {
//           method: "PUT",
//           body: fd,
//         },
//       );

//       if (res.ok) {
//         toast.success("Artifact Updated ✅", { id: loadingToast });
//         setShowCertEditModal(false);

//         // Reset editing state
//         setEditingCertificate(null);

//         await hydrateNode();
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Sync Error ❌", { id: loadingToast });
//     }
//   };

//   const numberToIndianWords = (num) => {
//     if (!num || isNaN(num)) return "";

//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];

//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const twoDigits = (n) =>
//       n < 20
//         ? ones[n]
//         : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");

//     const threeDigits = (n) => {
//       if (n === 0) return "";
//       if (n < 100) return twoDigits(n);
//       return (
//         ones[Math.floor(n / 100)] +
//         " Hundred" +
//         (n % 100 ? " " + twoDigits(n % 100) : "")
//       );
//     };

//     const crore = Math.floor(num / 10000000);
//     const lakh = Math.floor((num % 10000000) / 100000);
//     const thousand = Math.floor((num % 100000) / 1000);
//     const hundred = num % 1000;

//     let result = "";

//     if (crore) result += twoDigits(crore) + " Crore ";
//     if (lakh) result += twoDigits(lakh) + " Lakh ";
//     if (thousand) result += twoDigits(thousand) + " Thousand ";
//     if (hundred) result += threeDigits(hundred);

//     return result.trim() + " per annum";
//   };

//   const today = new Date();

//   // 18 years ago (max allowed DOB)
//   const maxDate = new Date(
//     today.getFullYear() - 18,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .split("T")[0];

//   // 70 years ago (min allowed DOB)
//   const minDate = new Date(
//     today.getFullYear() - 70,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .split("T")[0];

//   const [dobError, setDobError] = useState("");

//   const handleDobChange = (value) => {
//     setFormData({ ...formData, dob: value });

//     if (!value) {
//       setDobError("Date of Birth is required");
//       return;
//     }

//     const selected = new Date(value);

//     if (selected > new Date(maxDate)) {
//       setDobError("Age must be at least 18 years");
//     } else if (selected < new Date(minDate)) {
//       setDobError("Age must be below 70 years");
//     } else {
//       setDobError("");
//     }
//   };

//   const handleResumeDirectUpload = async (file) => {
//   if (!file) return;
  
//   setLoading(true);
//   const syncToast = toast.loading("Executing Instant Registry Sync...");

//   try {
//     const apiData = new FormData();
//     apiData.append("resumepdf", file); // Ensure "resumepdf" matches backend key
//     apiData.append("full_name", formData.name); // Usually required by backend

//     const response = await fetch(
//       `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//       {
//         method: "PATCH",
//         body: apiData,
//       }
//     );

//     if (response.ok) {
//       toast.success("Document Verified & Live", { id: syncToast });
//       // 🔥 REFRESH UI: This will trigger hydrateNode and show the success block within 1sec
//       await hydrateNode(); 
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Protocol Rejection: Upload Failed", { id: syncToast });
//   } finally {
//     setLoading(false);
//   }
// };


// const handleFinalProtocolSync = async () => {
//     const score = calculateCompletion();

//     if (score < 100) {
//       toast.error(`Audit Failure: ${score}% Completion. Please verify all mandatory nodes (Languages, About Me, etc.) before final synchronization.`, {
//         duration: 5000,
//         icon: '⚠️'
//       });
//       return;
//     }

//     setLoading(true);
//     // Execute final step save (Step 6)
//     const success = await saveStepData(6);
    
//     if (success) {
//       setIsSubmitted(true); // Trigger the Success Hub
//       toast.success("Registry Protocol Synchronized 100%");
//     }
//     setLoading(false);
//   };

// //  const calculateCompletion = () => {
// //   const fieldsToTrack = [
// //     // Step 1: Personal
// //     formData.name, formData.email, formData.phone, formData.gender, 
// //     formData.dob, formData.about_me, formData.languages_spoken?.length > 0,
// //     // Step 2: Location
// //     formData.address, formData.city, formData.state, formData.pincode,
// //     // Step 3: Education (New logic added here)
// //     formData.education?.length > 0,
// //     // Step 4: Experience
// //     isFresher || formData.experiences?.length > 0,
// //     // Step 5: Skills & Assets
// //     formData.skills?.length > 0 || formData.assets?.length > 0,
// //     // Step 6: Vault
// //     formData.cvFile || existingResume
// //   ];

// //   const filledFields = fieldsToTrack.filter(field => {
// //     if (Array.isArray(field)) return field.length > 0;
// //     if (typeof field === 'boolean') return field;
// //     return !!field; 
// //   }).length;

// //   return Math.round((filledFields / fieldsToTrack.length) * 100);
// // };

// const calculateCompletion = () => {
//   const auditMatrix = [
//     // Phase 01: Identity
//     !!formData.name, 
//     !!formData.email, 
//     !!formData.phone, 
//     !!formData.gender, 
//     !!formData.dob, 
//     !!formData.about_me, 
//     (formData.languages_spoken?.length > 0),

//     // Phase 02: Geolocation
//     !!formData.address, 
//     !!formData.city, 
//     !!formData.state, 
//     !!formData.pincode,

//     // Phase 03: Academic Nodes
//     (formData.education?.length > 0),

//     // Phase 04: Professional Timeline
//     // Protocol: If Fresher is active, this node is auto-verified.
//     (isFresher === true || formData.experiences?.length > 0),

//     // Phase 05: Technical Stack
//     (formData.skills?.length > 0 || formData.assets?.length > 0),

//     // Phase 06: Document Vault
//     !!(formData.cvFile || existingResume || formData.resume_link)
//   ];

//   const completedNodes = auditMatrix.filter(node => node === true).length;
//   const totalNodes = auditMatrix.length;

//   return Math.round((completedNodes / totalNodes) * 100);
// };

//   if (fetchingData)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//         <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
//         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
//           Loading Data Load {effectiveId}...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8" ref={dropdownContainerRef}>


        
//         <div className="flex justify-start">
//         <button
//           onClick={() => navigate("/candidate")}
//           className="group flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//         >
//           <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//           Return to Candidate 
//         </button>
//       </div>
//         {/* ROADMAP HEADER */}
//         {/* <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//               <Database size={32} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//                 {id ? "Profile" : "Manual Registry"}
//               </h2>
//               <div className="flex items-center gap-2 mt-1 text-blue-600">
//                 <ShieldCheck size={14} />
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 max-w-2xl w-full px-4">
//             <div className="relative flex justify-between items-center w-full">
//               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//               <div
//                 className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//                 style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//               />
            

// {[1, 2, 3, 4, 5, 6].map((num) => {
//   // Protocol: Determine if this specific node has missing data
//   const isWarningNode = 
//     (num === 1 && isStep1Incomplete()) ||
//     (num === 2 && isStep2Incomplete()) ||
//     (num === 3 && isStep3Incomplete()) || // Yellow if education is []
//     (num === 4 && isStep4Incomplete()) ||
//     (num === 5 && isStep5Incomplete()) || 
//     (num === 6 && isStep6Incomplete());

//   return (
//     <div
//       key={num}
//       className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//       onClick={async () => {
//         if (num > step + 1) {
//           toast.error("Complete current phase registry first");
//           return;
//         }
//         const success = await saveStepData(step);
//         if (success || num < step) {
//           setStep(num);
//           navigate(`?step=${num}`, { replace: true });
//         }
//       }}
//     >
  
//       <div
//         className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//           group-hover/step:scale-110
//           ${step === num
//             ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" // Active
//             : step > num
//               ? isWarningNode 
//                 ? "bg-yellow-400 text-white border-yellow-100" // Warning (Even if passed)
//                 : "bg-emerald-500 text-white border-emerald-50" // Completed
//               : isWarningNode 
//                 ? "bg-yellow-400 text-white border-yellow-100" // Future Warning
//                 : "bg-white text-slate-300 border-slate-50" // Untouched
//           }`}
//       >
//         {step > num && !isWarningNode ? <Check size={14} strokeWidth={4} /> : num}
//       </div>

   
//       <span
//         className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//           ${step === num ? "text-blue-600" : isWarningNode ? "text-yellow-600" : "text-slate-300"} 
//           group-hover/step:text-slate-900`}
//       >
//         {num === 1 && "Personal"}
//         {num === 2 && "Location"}
//         {num === 3 && "Education"}
//         {num === 4 && "Experience"}
//         {num === 5 && "Stack"}
//         {num === 6 && "Vault"}
//       </span>
//     </div>
//   );
// })}
//             </div>
//           </div>
          
//           <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group">
//   <div className="text-right">
//     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
//       Audit Completion
//     </p>
//     <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
//       calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
//     }`}>
//       {calculateCompletion()}%
//     </p>
//   </div>
  

//   <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
//     calculateCompletion() === 100 
//       ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
//       : 'bg-blue-100 text-blue-600'
//   }`}>
//     {calculateCompletion() === 100 ? (
//       <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
//     ) : (
//       <Activity size={18} className="animate-pulse" />
//     )}
//   </div>
// </div>
//         </div> */} 

//         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//   {/* Left Section: Branding Node */}
//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//         {id ? "Edit Profile" : "Manual Add"}
//       </h2>
//       <div className="flex items-center gap-2 mt-1.5">
//         <ShieldCheck size={14} className="text-blue-600" />
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Candidate data</span>
//       </div>
//     </div>
//   </div>

//   {/* Center Section: Roadmap Protocol */}
//   {/* <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">
//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//       <div
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {[1, 2, 3, 4, 5, 6].map((num) => {
//         const isWarning = 
//           (num === 1 && isStep1Incomplete()) ||
//           (num === 2 && isStep2Incomplete()) ||
//           (num === 3 && isStep3Incomplete()) ||
//           (num === 4 && isStep4Incomplete()) ||
//           (num === 5 && isStep5Incomplete()) ||
//           (num === 6 && isStep6Incomplete());

//         return (
//           <div
//             key={num}
//             className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//             onClick={async () => {
//             //   if (num > step + 1) {
//             //     toast.error("Protocol Error: Complete current phase first");
//             //     return;
//             //   }
//               const success = await saveStepData(step);
//               if (success || num < step) {
//                 setStep(num);
//                 navigate(`?step=${num}`, { replace: true });
//               }
//             }}
//           >
//             <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               group-hover/step:scale-110
//               ${step === num
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num
//                   ? isWarning 
//                     ? "bg-yellow-400 text-white border-yellow-100" 
//                     : "bg-emerald-500 text-white border-emerald-50" 
//                   : isWarning 
//                     ? "bg-yellow-400 text-white border-yellow-100" 
//                     : "bg-emerald-400 text-slate-300 border-slate-50"
//               }`}
//             >
//               {step > num && !isWarning ? <Check size={14} strokeWidth={4} /> : num}
//             </div>
//             <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//               ${step === num ? "text-blue-600" : isWarning ? "text-yellow-600" : "text-slate-300"} 
//               group-hover/step:text-slate-900`}
//             >
//               {num === 1 && "Personal"}
//               {num === 2 && "Location"}
//               {num === 3 && "Education"}
//               {num === 4 && "Experience"}
//               {num === 5 && "Stack"}
//               {num === 6 && "Vault"}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   </div> */}

//   {/* Center Section: Roadmap Protocol */}
// <div className="flex-1 max-w-2xl w-full px-4">
//   <div className="relative flex justify-between items-center w-full">
//     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//     <div
//       className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//       style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//     />

//     {[1, 2, 3, 4, 5, 6].map((num) => {
//       const isWarning = 
//         (num === 1 && isStep1Incomplete()) ||
//         (num === 2 && isStep2Incomplete()) ||
//         (num === 3 && isStep3Incomplete()) ||
//         (num === 4 && isStep4Incomplete()) ||
//         (num === 5 && isStep5Incomplete()) ||
//         (num === 6 && isStep6Incomplete());

//       const isActive = step === num;
//       const isCompleted = step > num;

//       return (
//         <div
//           key={num}
//           className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//           onClick={async () => {
//             const success = await saveStepData(step);
//             if (success || num < step) {
//               setStep(num);
//               navigate(`?step=${num}`, { replace: true });
//             }
//           }}
//         >
//           {/* STEP CIRCLE */}
//           <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//             group-hover/step:scale-110
//             ${isActive
//               ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//               : isWarning
//                 ? "bg-white text-white border-slate-100" // Neutral background for Warning
//                 : isCompleted
//                   ? "bg-blue-500 text-white border-emerald-50" 
//                   : "bg-slate-200 text-white border-slate-50"
//             }`}
//           >
//             {/* 🛠️ ICON LOGIC: Show Check if done, ? if incomplete, else Number */}
//             {isCompleted && !isWarning ? (
//               <Check size={14} strokeWidth={4} />
//             ) : isWarning ? (
//               <span className="text-blue-600 text-sm animate-pulse">?</span>
//             ) : (
//               num
//             )}
//           </div>

//           {/* LABEL */}
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//             ${isActive ? "text-blue-600" : isWarning ? "text-slate-400" : "text-slate-300"} 
//             group-hover/step:text-slate-900`}
//           >
//             {num === 1 && "Personal"}
//             {num === 2 && "Location"}
//             {num === 3 && "Education"}
//             {num === 4 && "Experience"}
//             {num === 5 && "Stack"}
//             {num === 6 && "Vault"}
//           </span>
//         </div>
//       );
//     })}
//   </div>
// </div>

//   {/* Right Section: Percentage Hub */}
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group transition-all hover:bg-white hover:shadow-md">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
//         Audit Status
//       </p>
//       <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
//         calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
//       }`}>
//         {calculateCompletion()}%
//       </p>
//     </div>
    
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
//       calculateCompletion() === 100 
//         ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
//         : 'bg-blue-100 text-blue-600 shadow-blue-50'
//     }`}>
//       {calculateCompletion() === 100 ? (
//         <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
//       ) : (
//         <Activity size={16} className="animate-pulse" />
//       )}
//     </div>
//   </div>
// </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-12">
//             {/* STEP 1: IDENTITY & CAREER */}
//             {step === 1 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
//                   <User size={18} className="text-blue-600" />
//                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                     Basic Candidate profile
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <FormField label="Full Name" required>
//                     <input
//                       placeholder="Legal Name"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Email" required>
//                     <input
//                       type="email"
//                       placeholder="name@domain.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Phone" required>
//                     <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm">
//                       <span className="px-3 text-[11px] font-black text-slate-400">
//                         +91
//                       </span>
//                       <input
//                         maxLength={10}
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         className="w-full px-3 py-2 bg-transparent text-[13px] font-bold outline-none"
//                       />
//                     </div>
//                   </FormField>
//                   <FormField label="Gender">
//                     <select
//                       value={formData.gender}
//                       onChange={(e) =>
//                         setFormData({ ...formData, gender: e.target.value })
//                       }
//                       className={inputStyle}
//                     >
//                       <option value="">Select</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="transgender">Transgender</option>
//                       <option value="prefer_not_to_say">
//                         Prefer not to say
//                       </option>
//                     </select>
//                   </FormField>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
//                   <FormField label="Date of Birth">
//                     <input
//                       type="date"
//                       min={minDate}
//                       max={maxDate}
//                       value={formData.dob}
//                       onChange={(e) =>
//                         setFormData({ ...formData, dob: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Languages">
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-3 shadow-inner">
//                       {[
//                         "English",
//                         "Hindi",
//                         "Marathi",
//                         "Gujarati",
//                         "Tamil",
//                         "Telugu",
//                       ].map((lang) => (
//                         <label
//                           key={lang}
//                           className="flex items-center gap-2 text-[11px] font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={formData.languages_spoken.includes(lang)}
//                             onChange={() => {
//                               const u = formData.languages_spoken.includes(lang)
//                                 ? formData.languages_spoken.filter(
//                                     (l) => l !== lang,
//                                   )
//                                 : [...formData.languages_spoken, lang];
//                               setFormData({ ...formData, languages_spoken: u });
//                             }}
//                             className="w-3.5 h-3.5 accent-blue-600 rounded"
//                           />{" "}
//                           {lang}
//                         </label>
//                       ))}
//                     </div>
//                   </FormField>
//                 </div>
//                 <FormField label="Bio Summary">
//                   <textarea
//                     rows={3}
//                     value={formData.about_me}
//                     onChange={(e) =>
//                       setFormData({ ...formData, about_me: e.target.value })
//                     }
//                     className={inputStyle + " resize-none"}
//                   />
//                 </FormField>
//                 <div className="flex justify-end pt-4">
//                   <button
//                     type="button"
//                     // onClick={() => setStep(2)}
//                     onClick={async () => {
//                       await saveStepData(1);
//                       setStep(2);
//                     }}
//                     className={`px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all`}
//                   >
//                     Next Phase →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
//                   <MapPin size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     location Data
//                   </h3>
//                 </div>
//                 <div className="space-y-8">
//                   <FormField label="Address 1" required>
//                     <input
//                       value={formData.address}
//                       onChange={(e) =>
//                         setFormData({ ...formData, address: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Address 2" required>
//                       <input
//                         value={formData.location}
//                         onChange={(e) =>
//                           setFormData({ ...formData, location: e.target.value })
//                         }
//                         className={inputStyle}
//                       />
//                     </FormField>
//                     <FormField label="Pincode" required>
//                       <input
//                         maxLength={6}
//                         placeholder="000000"
//                         value={formData.pincode}
//                         onChange={(e) => {
//                           setFormData({ ...formData, pincode: e.target.value });
//                           if (e.target.value.length === 6)
//                             fetchPincodeDetails(e.target.value);
//                         }}
//                         className={inputStyle}
//                       />
//                     </FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     <FormField label="City">
//                       {isFetchingPincode ? (
//                         <input
//                           value="Fetching..."
//                           readOnly
//                           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-400 shadow-inner"
//                         />
//                       ) : cityOptions.length > 1 ? (
//                         <select
//                           value={formData.city}
//                           onChange={(e) => {
//                             const selected = cityOptions.find(
//                               (c) => c.Name === e.target.value,
//                             );

//                             setFormData((prev) => ({
//                               ...prev,
//                               city: selected?.Name || "",
//                               district: selected?.District || "",
//                               state: selected?.State || "",
//                               country: selected?.Country || "India",
//                             }));
//                           }}
//                           className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         >
//                           {cityOptions.map((c, i) => (
//                             <option key={i} value={c.Name}>
//                               {c.Name}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           value={formData.city || ""}
//                           readOnly
//                           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                         />
//                       )}
//                     </FormField>

//                     <FormField label="District">
//                       <input
//                         // value={formData.district}
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.district
//                         }
//                         readOnly
//                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                       />
//                     </FormField>
//                     <FormField label="State">
//                       <input
//                         // value={formData.state}
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.state
//                         }
//                         readOnly
//                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                       />
//                     </FormField>
//                     <FormField label="Country">
//                       <input
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.country
//                         }
//                         readOnly
//                         onChange={(e) =>
//                           setFormData({ ...formData, country: e.target.value })
//                         }
//                         className={inputStyle}
//                       />
//                     </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-8 border-t border-slate-50">
//                   <button
//                     onClick={() => setStep(1)}
//                     type="button"
//                     className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all shadow-sm"
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     //  onClick={() => setStep(3)}
//                     onClick={async () => {
//                       await saveStepData(2);
//                       setStep(3);
//                     }}
//                     type="button"
//                     className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl transition-all"
//                   >
//                     Continue →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
//                   <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                         <Award size={20} />
//                       </div>
//                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Education History</h3>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsEditingEdu(false);
//                         setNewEdu({ education_id: 0, institution_name: "", start_year: "", end_year: "", education_name: "" });
//                         fetchMasterEducations();
//                         setShowEduModal(true);
//                       }}
//                       className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
//                     >
//                       <Plus size={14} strokeWidth={3} /> Add Education
//                     </button>
//                   </div>
            
//             {/* VERIFIED EDUCATION LIST */}
//             <div className="space-y-4 relative z-10">
//               {formData.education && formData.education.length > 0 ? (
//                 formData.education.map((edu, i) => (
//                   <div key={i} className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white  transition-all border-l-4 border-l-blue-600">
                    
//                     {/* Node Index */}
//                     <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-900 shadow-sm">
//                       0{i + 1}
//                     </div>
            
//                     {/* Content Node */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-3 mb-1">
//                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
//                           {edu.institution_name}
//                         </h4>
//                         <span className="h-1 w-1 rounded-full bg-slate-300" />
//                         <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
//                           {edu.education_name} {/* Displays "Btech", "HSC", etc. */}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-4 text-slate-400">
//                         <div className="flex items-center gap-1.5">
//                           <Calendar size={12} className="text-slate-300" />
//                           <span className="text-[10px] font-black uppercase tracking-widest">
//                             {edu.start_year} <span className="text-slate-200 mx-1">—</span> {edu.end_year}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
            
//                     {/* Action Node */}
//                     <button 
//                       type="button" 
//                       onClick={() => {
//                         setIsEditingEdu(true);
//                         setCurrentEduId(edu.id);
//                         // Pre-fill modal
//                         setNewEdu({
//                           education_id: edu.education_id,
//                           institution_name: edu.institution_name,
//                           start_year: edu.start_year,
//                           end_year: edu.end_year,
//                           education_name: edu.education_name
//                         });
//                         setEduSearch(edu.education_name);
//                         setShowEduModal(true);
//                       }}
//                       className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-90"
//                     >
//                       <Edit3 size={16} />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-16 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
//                   <Database className="mx-auto text-slate-200 mb-4" size={32} />
//                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Zero Academic Nodes Registered</p>
//                 </div>
//               )}
//             </div>
//                 </div>
            
//                 {/* NAVIGATION */}
//                 <div className="flex justify-between pt-6">
//                   <button type="button" onClick={() => setStep(2)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm">← Back</button>
//                   <button
//                     type="button"
//                     onClick={async () => { await saveStepData(3); setStep(4); }}
//                     className="px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
//                   >Commit & Continue →</button>
//                 </div>
            
//                 {/* EDUCATION MODAL */}
//               {/* 2. Updated Modal Content */}
//             {showEduModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
//                 <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
                  
//                   {/* Modal Header */}
//                   <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
//                         <Award size={28} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">Education Details</h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Entry</p>
//                       </div>
//                     </div>
//                     <button onClick={() => { setShowEduModal(false); setEduDropdownOpen(false); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
//                       <X size={24} />
//                     </button>
//                   </div>
            
//                   <div className="p-10 space-y-8 bg-white overflow-visible">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">
                      
//                       {/* SEARCHABLE DROPDOWN */}
//                       <div className="space-y-2 relative" ref={dropdownContainerRef}>
//                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">
//                           Degree Specification
//                         </label>
//                         <div className="relative group">
//                           <input 
//                             placeholder="Search node (HSC, Btech, SSC...)" 
//                             value={eduSearch} 
//                             onFocus={() => {
//                               setEduDropdownOpen(true);
//                               if (masterEducations.length === 0) fetchMasterEducations();
//                             }}
//                             onChange={(e) => {
//                               setEduSearch(e.target.value);
//                               setEduDropdownOpen(true);
//                             }}
//                             className={inputStyle + " pr-10 focus:border-blue-600 transition-all"} 
//                           />
//                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
//                             {fetchingData ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
//                           </div>
//                         </div>
            
//                         {/* Dropdown Result Panel */}
//                         {eduDropdownOpen && (
//                           <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                             <div className="max-h-[220px] overflow-y-auto custom-scrollbar-professional p-2 space-y-1 bg-white">
//                               {masterEducations.filter(m => 
//                                 (m.name || "").toLowerCase().includes(eduSearch.toLowerCase())
//                               ).length > 0 ? (
//                                 masterEducations
//                                   .filter(m => (m.name || "").toLowerCase().includes(eduSearch.toLowerCase()))
//                                   .slice(0, 20)
//                                   .map((m) => (
//                                     <button
//                                       key={m.id}
//                                       type="button"
//                                       onClick={() => {
//                                         setNewEdu({ ...newEdu, education_id: m.id, education_name: m.name });
//                                         setEduSearch(m.name);
//                                         setEduDropdownOpen(false);
//                                       }}
//                                       className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/item ${
//                                         newEdu.education_id === m.id 
//                                           ? "bg-blue-600 text-white" 
//                                           : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
//                                       }`}
//                                     >
//                                       <span className="uppercase tracking-tight">{m.name}</span>
//                                       {newEdu.education_id === m.id ? (
//                                         <CheckCircle size={14} className="text-white" />
//                                       ) : (
//                                         <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
//                                       )}
//                                     </button>
//                                   ))
//                               ) : (
//                                 <div className="py-8 text-center bg-slate-50/50 rounded-xl">
//                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching degree nodes</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
            
//                       <FormField label="Institution Name">
//                         <input 
//                           placeholder="e.g. Mumbai University" 
//                           value={newEdu.institution_name} 
//                           onChange={(e) => setNewEdu({ ...newEdu, institution_name: e.target.value })} 
//                           className={inputStyle} 
//                         />
//                       </FormField>
//                     </div>
            
//                     {/* <div className="grid grid-cols-2 gap-8">
          
//               <FormField label="Commencement Year">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                     <Calendar size={16} />
//                   </div>
//                   <input 
//                     type="number" 
//                     placeholder="YYYY" 
//                     min="1970"
//                     max="2030"
//                     value={newEdu.start_year} 
//                     onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} 
//                     className={inputStyle + " pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} 
//                   />
//                 </div>
//               </FormField>
            
          
//               <FormField label="Completion Year">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                     <Calendar size={16} />
//                   </div>
//                   <input 
//                     type="number" 
//                     placeholder="YYYY" 
//                     min="1970"
//                     max="2030"
//                     value={newEdu.end_year} 
//                     onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })} 
//                     className={inputStyle + " pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} 
//                   />
//                 </div>
//               </FormField>
//             </div> */}


//             <div className="grid grid-cols-2 gap-8">
//   {/* START YEAR NODE */}
//   <FormField label="Commencement Year">
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none">
//         <Calendar size={16} />
//       </div>
//       <select 
//         required
//         value={newEdu.start_year} 
//         onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} 
//         className={inputStyle + " pl-12 appearance-none cursor-pointer relative bg-white"} 
//       >
//         <option value="">Select Year</option>
//         {/* Generates years from 2030 down to 1980 */}
//         {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors">
//         <ChevronDown size={14} />
//       </div>
//     </div>
//   </FormField>

//   {/* END YEAR NODE */}
//   <FormField label="Completion Year">
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none">
//         <Calendar size={16} />
//       </div>
//       <select 
//         required
//         value={newEdu.end_year} 
//         onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })} 
//         className={inputStyle + " pl-12 appearance-none cursor-pointer relative bg-white"} 
//       >
//         <option value="">Select Year</option>
//         {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors">
//         <ChevronDown size={14} />
//       </div>
//     </div>
//   </FormField>
// </div>
            
//                     <div className="flex justify-end pt-6 border-t border-slate-100">
//                       <button
//                         type="button"
//                         onClick={handleSaveEducation}
//                         className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3 hover:bg-blue-600"
//                       >
//                         <CheckCircle size={18} /> {isEditingEdu ? "Update" : "Synchronize Node"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//               </div>
//             )}

//             {step === 4 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 {/* STATUS SELECTOR CARD */}
//                 <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
//                   <Fingerprint className="absolute -right-6 -bottom-6 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none" size={100} />
//                   <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
//                     <div className="flex items-center gap-4 text-slate-900 font-black">
//                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
//                         <Briefcase size={22} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h3 className="text-sm uppercase tracking-[0.15em]">Are you Fresher?</h3>
//                         <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Career status determines validation protocol</p>
//                       </div>
//                     </div>
//                     <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//                       <button
//                         type="button"
//                         disabled={hasExistingExperience}
//                         onClick={() => {
//                           if (hasExistingExperience) return;
//                           setIsFresher(true);
//                           setFormData({ ...formData, experiences: [] });
//                         }}
//                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
//                       >YES</button>
//                       <button
//                         type="button"
//                         onClick={() => setIsFresher(false)}
//                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
//                       >NO</button>
//                     </div>
//                   </div>
//                 </div>
            
//                 {/* EXPERIENCE TIMELINE DISPLAY */}
//                 {isFresher === false && (
//                   <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
//                     <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
//                       <div className="flex items-center gap-4">
//                         <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                           <History size={20} />
//                         </div>
//                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Job Experience History</h3>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (newExperiences.length === 0) {
//                             setNewExperiences([{ company_name: "", job_title: "", department: "", start_date: "", end_date: "", previous_ctc: "", location: "", description: "" }]);
//                           }
//                           setShowExpModal(true);
//                         }}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
//                       >
//                         <Plus size={14} strokeWidth={3} /> Add Experience
//                       </button>
//                     </div>
            
//                     {/* VERIFIED DATA LIST (Shows existing records from formData) */}
                  
//                     <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               {formData.experiences && formData.experiences.length > 0 ? (
//                 formData.experiences.map((exp, i) => (
//                   <div 
//                     key={i} 
//                     className="group relative flex flex-col md:flex-row items-stretch gap-0 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
//                   >
//                     {/* SIDE BRANDING BAR: Denotes 'Verified Node' status */}
//                     <div className="w-1.5 bg-blue-600 group-hover:w-2 transition-all duration-300" />
            
//                     {/* INDEX NODE: Terminal Style */}
//                     <div className="flex items-center justify-center px-6 bg-slate-50/50 border-r border-slate-100">
//                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 transition-colors">
//                         <span className="text-[10px] font-black text-slate-400 leading-none uppercase tracking-tighter">exp</span>
//                         <span className="text-sm font-black text-slate-900 leading-none mt-1">0{i + 1}</span>
//                       </div>
//                     </div>
            
//                     {/* MAIN CONTENT STRIP */}
//                     <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
//                       <div className="min-w-0 space-y-2">
//                         {/* Entity & Role */}
//                         <div className="flex items-center gap-3">
//                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-blue-600 transition-colors">
//                             {exp.company_name || "Unidentified Entity"}
//                           </h4>
//                           <div className="h-1 w-1 rounded-full bg-slate-300" />
//                           <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
//                             {exp.job_title || "Role Pending"}
//                           </div>
//                         </div>
            
//                         {/* Deployment Meta-Data */}
//                         <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <Calendar size={13} className="text-slate-300" />
//                             <span className="text-[10px] font-bold uppercase tracking-widest">
//                               {exp.start_date || "----"} <span className="text-slate-200 mx-1">—</span> {exp.end_date || "Present"}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <MapPin size={13} className="text-slate-300" />
//                             <span className="text-[10px] font-bold uppercase tracking-widest">{exp.location || "Global Node"}</span>
//                           </div>
//                         </div>
//                       </div>
            
//                       {/* FINANCIAL NODE: High Contrast Badge */}
//                       <div className="flex items-center gap-6">
//                         <div className="flex flex-col items-end border-r border-slate-100 pr-6">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Previous CTC</span>
//                           <div className="flex items-center gap-1.5 text-emerald-600">
//                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                             <span className="text-[12px] font-black uppercase tracking-tight">
//                               ₹{exp.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "0.00"}
//                             </span>
//                           </div>
//                         </div>
            
//                         {/* ACTION INTERFACE */}
//                         <div className="flex items-center gap-2">
//                           <button 
//                             type="button" 
                            
//             onClick={() => {
//               const existing = formData.experiences[i];
            
//               setCurrentEditingIndex(i);
            
//               setNewExperiences([
//                 {
//                   ...existing,
//                   uploadMode: existing.exp_letter_link ? "link" : "file",
//                   expLetterFile: null, // important
//                 },
//               ]);
            
//               setShowExpModal(true);
//             }}
            
            
            
//                             className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 border border-slate-100 active:scale-90"
//                           >
//                             <Edit3 size={16} strokeWidth={2.5} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
            
//                     {/* Decorative Watermark for Enterprise Feel */}
//                     <History className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.02] -rotate-12 pointer-events-none group-hover:opacity-[0.05] transition-opacity" size={100} />
//                   </div>
//                 ))
//               ) : (
//                 /* EMPTY STATE: Audit-Empty Pattern */
//                 <div className="relative group flex flex-col items-center justify-center py-20 bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-[2.5rem] transition-colors hover:bg-slate-50">
//                   <div className="relative z-10 flex flex-col items-center">
//                     <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-200 mb-6 group-hover:scale-110 transition-transform duration-500">
//                       <Database size={32} strokeWidth={1.5} />
//                     </div>
//                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
//                       Zero Nodes Synchronized
//                     </h4>
//                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center max-w-xs">
//                       Professional history registry currently empty. Initialize a new experience node to begin.
//                     </p>
//                   </div>
//                   <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
//                      <ShieldCheck className="absolute -right-8 -bottom-8 text-slate-900 opacity-[0.02] -rotate-12" size={200} />
//                   </div>
//                 </div>
//               )}
//             </div>
//                   </div>
//                 )}
            
//                 {/* NAVIGATION */}
//                 <div className="flex justify-between pt-6">
//                   <button type="button" onClick={() => setStep(3)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm transition-all hover:text-slate-900">← Back</button>
//                   <button
//                     type="button"
//                     onClick={async () => { await saveStepData(4); setStep(5); }}
//                     disabled={isFresher === null}
//                     className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-200" : "bg-slate-200 text-slate-300 cursor-not-allowed"}`}
//                   >Commit & Continue →</button>
//                 </div>
            
//                 {/* MODAL: ADDING NEW RECORDS ONLY (Upload Logic Removed) */}
               
//                 {showExpModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
//                 <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                  
//                   {/* Modal Header */}
//                   <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//                         <Plus size={28} strokeWidth={3} />
//                       </div>
//                       <div>
//                         {/* <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">New Experience</h2> */}
//                         <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">
//                             {currentEditingIndex !== null ? "Edit Experience" : "New Experience"}
//                         </h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add new Experience Records</p>
//                       </div>
//                     </div>
//                     <button onClick={() => setShowExpModal(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
//                       <X size={24} />
//                     </button>
//                   </div>
            
//                   {/* Modal Content */}
//                   <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar-professional bg-white">
//                     {newExperiences.map((exp, i) => (
//                       <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-8 rounded-[2.5rem] space-y-8 animate-in slide-in-from-bottom-4 group hover:bg-white hover:border-blue-200 transition-all">
//                         {/* Remove Entry */}
//                         <button
//                           type="button"
//                           onClick={() => setNewExperiences(newExperiences.filter((_, idx) => idx !== i))}
//                           className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-red-500 hover:text-white"
//                         >
//                           <Trash2 size={18} />
//                         </button>
            
//                         {/* GRID 1: IDENTITY */}
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                           <FormField label="Employer">
//                             <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...newExperiences]; u[i].company_name = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Designation">
//                             <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...newExperiences]; u[i].job_title = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Location">
//                             <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...newExperiences]; u[i].location = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
           
            
//             <FormField label="Industry">
//               <div className="relative">
//                 {/* INPUT BOX */}
//                 <input
//                   value={exp.industry_name || ""} // Use name for display
//                   placeholder="Search industry..."
//                   onFocus={() => setShowIndustryDrop(true)}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setIndustrySearch(value);
//                     const u = [...newExperiences];
//                     u[i].industry_name = value; // Temporary display
//                     setNewExperiences(u);
//                   }}
//                   className={inputStyle}
//                 />
            
//                 {/* DROPDOWN */}
//                 {showIndustryDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//                     <div className="max-h-44 overflow-y-auto custom-scrollbar-professional">
//                       {masterIndustries
//                         .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
//                         .length > 0 ? (
//                         masterIndustries
//                           .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
//                           .map((ind) => (
//                             <div
//                               key={ind.id}
//                               onClick={() => {
//                                 const u = [...newExperiences];
//                                 u[i].industry_id = ind.id; // ✅ Store the ID for API
//                                 u[i].industry_name = ind.name; // Store name for UI display
//                                 setNewExperiences(u);
//                                 setIndustrySearch("");
//                                 setShowIndustryDrop(false);
//                               }}
//                               className="px-4 py-2.5 text-[11px] font-black text-slate-700 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors uppercase tracking-tight flex justify-between items-center"
//                             >
//                               {ind.name}
//                               {exp.industry_id === ind.id && <Check size={14} />}
//                             </div>
//                           ))
//                       ) : (
//                         <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase italic">
//                           No matching industry 
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </FormField>
            
            
//                         </div>
            
//                         {/* GRID 2: TIMELINE & CTC */}
//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                           <FormField label="Department">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Layers size={16} />
//                   </div>
//                   <select
//                     value={exp.department || ""}
//                     onChange={(e) => {
//                       const u = [...newExperiences];
//                       u[i].department = e.target.value;
//                       setNewExperiences(u);
//                     }}
//                     className={inputStyle + " pl-12 appearance-none"}
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept.id} value={dept.name}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </FormField>
//                           <FormField label="Start Date">
//                             <input type="date" value={exp.start_date} onChange={(e) => { const u = [...newExperiences]; u[i].start_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="End Date">
//                             <input type="date" value={exp.end_date} onChange={(e) => { const u = [...newExperiences]; u[i].end_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Annual CTC">
//                             <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all">
//                               <div className="px-4 text-blue-600 font-black italic">₹</div>
//                               <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...newExperiences]; u[i].previous_ctc = e.target.value; setNewExperiences(u); }} className="w-full py-3 bg-transparent text-[12px] font-bold outline-none" />
//                               <div className="pr-4 text-[9px] font-black text-slate-400">LPA</div>
//                             </div>
//                           </FormField>
//                         </div>
            
//                         {/* GRID 3: DESCRIPTION & ARTIFACT UPLOAD */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                           <FormField label="Professional Summary">
//                             <textarea rows={4} placeholder="Briefly describe your role..." value={exp.description} onChange={(e) => { const u = [...newExperiences]; u[i].description = e.target.value; setNewExperiences(u); }} className={inputStyle + " resize-none"} />
//                           </FormField>
                          
//                           <div className="space-y-4">
//                             <div className="flex justify-between items-center px-1">
//                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experience Letter</p>
//                               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 scale-90">
//                                 <button
//                                   type="button"
//                                   onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "file"; setNewExperiences(u); }}
//                                   className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode !== "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                                 >FILE</button>
//                                 <button
//                                   type="button"
//                                   onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "link"; setNewExperiences(u); }}
//                                   className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                                 >URL</button>
//                               </div>
//                             </div>
            
//                             <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 min-h-[140px] flex flex-col justify-center items-center group/upload hover:bg-blue-50/30 transition-all">
//                               {exp.uploadMode !== "link" ? (
//                                 <label className="flex flex-col items-center cursor-pointer w-full">
//                                   <FileUp size={24} className="text-slate-300 group-hover/upload:text-blue-500 mb-2 transition-colors" />
//                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">
//                                     {exp.expLetterFile ? exp.expLetterFile.name : "Select PDF"}
//                                   </span>
//                                   <input 
//                                     type="file" 
//                                     accept=".pdf" 
//                                     className="hidden" 
//                                     onChange={(e) => { const u = [...newExperiences]; u[i].expLetterFile = e.target.files[0]; setNewExperiences(u); }} 
//                                   />
//                                 </label>
//                               ) : (
//                                 <div className="w-full px-4 relative">
//                                   <LinkIcon size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
//                                   <input 
//                                     placeholder="Public Storage URI (https://...)" 
//                                     value={exp.exp_letter_link || ""} 
//                                     onChange={(e) => { const u = [...newExperiences]; u[i].exp_letter_link = e.target.value; setNewExperiences(u); }} 
//                                     className={inputStyle + " pl-12"} 
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
            
//                         {/* SAVE ACTION */}
//                         <div className="flex justify-end pt-4 border-t border-slate-100">
//                           <button
//                             type="button"
//                             // onClick={() => handleSaveExperienceAPI(i)} 
//                             onClick={() => handleSaveOrUpdateExperience(i)}
//                             className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
//                           >
//                             {/* <CheckCircle size={16} /> Save */}
//                             <CheckCircle size={16} />
//             {currentEditingIndex !== null ? "Update" : "Save"}
            
//                           </button>
//                         </div>
//                       </div>
//                     ))}
            
                   
//                     {currentEditingIndex === null && (
//               <button
//                 type="button"
//                 onClick={() =>
//                   setNewExperiences([
//                     ...newExperiences,
//                     {
//                       company_name: "",
//                       job_title: "",
//                       start_date: "",
//                       end_date: "",
//                       previous_ctc: "",
//                       location: "",
//                       description: "",
//                       industry: "",
//                       uploadMode: "file",
//                       expLetterFile: null,
//                       exp_letter_link: "",
//                       candidate_id: effectiveId,
//                     },
//                   ])
//                 }
//                 className="w-full py-8 border-2 border-dashed border-slate-400 rounded-[2.5rem] text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/20 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
//               >
//                 + Add New Row
//               </button>
//             )}
            
//                   </div>
            
//                   {/* Modal Footer */}
                 
//                 </div>
//               </div>
//             )} 
//               </div>
//             )}

//                {step === 5 && (
//                           <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible">
//                             <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl overflow-visible shadow-slate-200/50">
//                               <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
//                                 <div className="flex items-center gap-4">
//                                   <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                                     <Cpu size={20} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
//                                       Skills & Assets
//                                     </h3>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="p-8 md:p-12 space-y-12 overflow-visible">
//                                 <FormField label="Skills">
//                                   <div className="space-y-6">
//                                     <div className="flex flex-col sm:flex-row gap-4 items-end">
//                                       <div className="relative max-w-md w-full">
//                                         <Plus
//                                           size={16}
//                                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                                         />
//                                         <input
//                                           value={skillInput}
//                                           onChange={(e) => setSkillInput(e.target.value)}
//                                           onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                               e.preventDefault();
//                                               const name = skillInput.trim();
//                                               if (!name) return;
            
//                                               // prevent duplicate
//                                               if (!formData.skills.includes(name)) {
//                                                 setFormData((prev) => ({
//                                                   ...prev,
//                                                   skills: [...prev.skills, name],
//                                                 }));
//                                               }
            
//                                               setSkillInput("");
//                                             }
//                                           }}
//                                           placeholder="Enter skill..."
//                                           className={inputStyle + " pl-12"}
//                                         />
//                                       </div>
//                                     </div>
            
//                                     <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
//                                       {[
//                                         ...new Set([...dynamicSkills, ...formData.skills]),
//                                       ].map((skill) => {
//                                         const isSelected = formData.skills.includes(skill);
            
//                                         return (
//                                           <button
//                                             key={skill}
//                                             type="button"
//                                             onClick={() =>
//                                               setFormData({
//                                                 ...formData,
//                                                 skills: isSelected
//                                                   ? formData.skills.filter(
//                                                       (s) => s !== skill,
//                                                     )
//                                                   : [...formData.skills, skill],
//                                               })
//                                             }
//                                             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${
//                                               isSelected
//                                                 ? "bg-white border-blue-500 border-[1px] text-black shadow-lg shadow-blue-200"
//                                                 : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
//                                             }`}
//                                           >
//                                             {skill}
//                                             {isSelected && (
//                                               <Check size={14} strokeWidth={3} />
//                                             )}
//                                           </button>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 </FormField>
//                                 {/* <FormField label="Enterprise Hardware Matrix"><div className="space-y-6 pt-8 border-t border-slate-100"><div className="relative max-w-md w-full"><Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={assetInput} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={async (e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) { const ok = await handleAddAssetAPI(v); if(ok) { setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); } } } }} placeholder="Link hardware..." className={inputStyle + " pl-12"} /></div><div className="flex flex-wrap gap-3 p-1">{dynamicAssets.map((asset) => { const isSelected = formData.assets.includes(asset); return (<button key={asset} type="button" onClick={async () => { if(!isSelected) { const ok = await handleAddAssetAPI(asset); if(ok) setFormData({...formData, assets: [...formData.assets, asset]}); } else { setFormData({...formData, assets: formData.assets.filter(a => a !== asset)}); } }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${isSelected ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}>{asset} {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}</button>); })}</div></div></FormField> */}
//                                 <div className="space-y-6 pt-8 border-t border-slate-100">
//                                   <FormField label="Assets">
//                                     <div className="space-y-6">
//                                       {/* Search & Manual Add Input */}
//                                       <div className="relative max-w-md">
//                                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                                           <Layers size={16} />
//                                         </div>
//                                         <input
//                                           value={assetInput}
//                                           onChange={(e) => setAssetInput(e.target.value)}
                                          
//                                           onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                               e.preventDefault();
//                                               const v = assetInput.trim();
//                                               if (!v) return;
            
//                                               // Prevent duplicate
//                                               if (!formData.assets.includes(v)) {
//                                                 setFormData((prev) => ({
//                                                   ...prev,
//                                                   assets: [...prev.assets, v],
//                                                 }));
//                                               }
            
//                                               setAssetInput("");
//                                             }
//                                           }}
//                                           placeholder="Type Assets name and press Enter..."
//                                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//                                         />
//                                       </div>
            
//                                       <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
//                                         {[
//                                           ...new Set([
//                                             ...dynamicAssets,
//                                             ...formData.assets,
//                                           ]),
//                                         ].filter(
//                                           (a) => typeof a === "string" && a.trim() !== "",
//                                         ).length === 0 ? (
//                                           /* ❌ NO ASSETS */
//                                           <div className="w-full text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
//                                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                               No assets available
//                                             </p>
//                                           </div>
//                                         ) : (
//                                           /* ✅ ASSET CHIPS */
//                                           [
//                                             ...new Set([
//                                               ...dynamicAssets,
//                                               ...formData.assets,
//                                             ]),
//                                           ]
//                                             .filter(
//                                               (a) =>
//                                                 typeof a === "string" && a.trim() !== "",
//                                             )
//                                             .map((asset) => {
//                                               const isSelected =
//                                                 formData.assets.includes(asset);
            
//                                               return (
//                                                 <button
//                                                   key={asset}
//                                                   type="button"
//                                                   onClick={() =>
//                                                     setFormData((prev) => ({
//                                                       ...prev,
//                                                       assets: isSelected
//                                                         ? prev.assets.filter(
//                                                             (a) => a !== asset,
//                                                           )
//                                                         : [...prev.assets, asset],
//                                                     }))
//                                                   }
//                                                   className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90
//                         ${
//                           isSelected
//                             ? "bg-white border-blue-500 text-black border-[1px] shadow-lg shadow-blue-200"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
//                         }`}
//                                                 >
//                                                   {asset}
//                                                   {isSelected && (
//                                                     <Check size={14} strokeWidth={3} />
//                                                   )}
//                                                 </button>
//                                               );
//                                             })
//                                         )}
//                                       </div>
//                                     </div>
//                                   </FormField>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex justify-between items-center pt-4">
//                               <button
//                                 onClick={() => setStep(4)}
//                                 type="button"
//                                 className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase transition-all shadow-sm hover:text-slate-900 flex items-center gap-2 transition-all"
//                               >
//                                 <ChevronLeft size={16} /> Back
//                               </button>
            
//                               <button
//                                 onClick={async () => {
//                                   await saveStepData(5);
//                                   setStep(6);
//                                 }}
//                                 type="button"
//                                 className="px-12 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
//                               >
//                                 Next Phase <ChevronRight size={14} />
//                               </button>
//                             </div>
//                           </div>
//                         )}


                       

//                        {step === 6 && (
//                           <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
//                             <div className="bg-white rounded-[2.5rem] border border-slate-200  overflow-hidden relative">
//                               <div className=" px-10 py-8  flex items-center justify-between">
//                                 <div className="flex items-center gap-5">
//                                   <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
//                                     <ShieldCheck size={28} strokeWidth={2.5} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-xl font-black text-black tracking-tight uppercase">Document</h3>
//                                     <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] mt-1">Resume & Certificate Upload</p>
//                                   </div>
//                                 </div>
//                               </div>
                        
//                               <div className="p-10 space-y-12">
                                
//                                 <div className="space-y-6">
//                                   <div className="flex items-center gap-3 px-2">
//                                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">01. Resume</h3>
//                                   </div>
//                                   {existingResume ? (
//                                     <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
//                                       <div className="flex items-center gap-5">
//                                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm"><CheckCircle size={24} /></div>
//                                         <div>
//                                           <p className="text-[11px] font-black text-blue-700 uppercase">Resume Submited</p>
//                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Uploaded</p>
//                                         </div>
//                                       </div>
//                                       <a href={fixResumeUrl2(existingResume)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
//                                         <Eye size={14} /> Preview
//                                       </a>
//                                     </div>
//                                   ) : (
                                   

// <div className="relative group">
//               <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-blue-500 transition-all cursor-pointer overflow-hidden">
//                 <FileUp className="absolute -right-4 -bottom-4 text-slate-100 opacity-50 -rotate-12 pointer-events-none" size={100} />
                
//                 <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
//                   <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
//                     {loading ? <Loader2 className="animate-spin" size={24} /> : <FileUp size={24} strokeWidth={2.5} />}
//                   </div>
//                   <div className="text-center">
//                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//                       {loading ? "Uploading..." : "Upload Resume"}
//                     </p>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Upload the Document</p>
//                   </div>
//                 </div>

//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   accept=".pdf" 
//                   disabled={loading}
//                   onChange={(e) => handleResumeDirectUpload(e.target.files[0])} 
//                 />
//               </label>
//             </div>
//                                   )}
//                                 </div>
                        
                             
//                                 <div className="space-y-6">
//                                   <div className="flex items-center justify-between px-2">
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">02. Uploaded Certificates</h3>
//                                     </div>
//                                     <button 
//                                       type="button"
//                                       onClick={() => { setEditingCertificate(null); setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); setShowCertEditModal(true); }}
//                                       className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
//                                     >
//                                       <PlusCircle size={14} /> Add Certificate
//                                     </button>
//                                   </div>
                        
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
//                                     {existingCertificates.map((cert) => (
//                                       <div key={cert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 transition-all shadow-sm">
//                                         <div className="flex items-center gap-4">
//                                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
//                                           <div className="min-w-0">
//                                             <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{cert.name}</p>
//                                             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mt-0.5">Verified</p>
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                            <a href={fixResumeUrl2(cert.file_path)} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
//                                            <button type="button" onClick={() => { setEditingCertificate(cert); setCertForm({ name: cert.name, uploadMode: "file", certificate_file: null, certificate_link: "" }); setShowCertEditModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
//                                         </div>
//                                       </div>
//                                     ))}
                        
                                   
//                                     {formData.certificateFiles.map((file, idx) => (
//                                        <div key={`pending-${idx}`} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-2xl animate-pulse">
//                                           <div className="flex items-center gap-4">
//                                             <div className="p-3 bg-blue-600 text-white rounded-xl"><FileText size={20} /></div>
//                                             <div>
//                                               <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{formData.certificateNames[idx]}</p>
//                                               <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">Pending Sync</p>
//                                             </div>
//                                           </div>
//                                           <button type="button" onClick={() => {
//                                             const newFiles = [...formData.certificateFiles]; newFiles.splice(idx, 1);
//                                             const newNames = [...formData.certificateNames]; newNames.splice(idx, 1);
//                                             setFormData({...formData, certificateFiles: newFiles, certificateNames: newNames});
//                                           }} className="text-slate-300 hover:text-rose-500 transition-colors px-2"><Trash2 size={16}/></button>
//                                        </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
                        
                           
//                               <div className="p-10  flex flex-col md:flex-row items-center justify-between gap-6">
//                                 <div className="flex items-center gap-4">
                              
//                             <div className="flex justify-center pb-10">
//                               <button
//                                 type="button"
//                                 onClick={() => setStep(5)}
//                                 className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//                               >
//                                 <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//                                 Return to Assets & Skills
//                               </button>
//                             </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={async () => {
//                                     setLoading(true);
//                                     await saveStepData(6);
//                                     setLoading(false);
//                                     toast.success("Final Registry Sync Complete ✔");
//                                     navigate("/candidate");
//                                   }}
//                                   className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
//                                 >
//                                   {loading ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> <span>Submit & Close </span></>}
//                                 </button>
//                               </div>
//                             </div>
                           
//                           </div>
//                         )} 

//           </div>
//         </form>
//       </div>

//       {/* CERTIFICATE TERMINAL (ADD/EDIT MODAL) */}
//       {showCertEditModal && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setShowCertEditModal(false)}
//           />
//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header Protocol */}
//             <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
//                   {editingCertificate ? (
//                     <Edit3 size={22} />
//                   ) : (
//                     <PlusCircle size={22} />
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//                     {editingCertificate
//                       ? "Edit Certificate"
//                       : "New Certificate"}
//                   </h2>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     Certificate{" "}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowCertEditModal(false)}
//                 className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* Compulsory Name Input */}
//               <FormField label="Certificate Name" required>
//                 <input
//                   placeholder="e.g. Google Cloud Professional"
//                   value={certForm.name}
//                   onChange={(e) =>
//                     setCertForm({ ...certForm, name: e.target.value })
//                   }
//                   className={inputStyle}
//                 />
//               </FormField>

//               {/* Upload Mode Toggle */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Type Of Document
//                 </label>
//                 <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCertForm({ ...certForm, uploadMode: "file" })
//                     }
//                     className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "file" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//                   >
//                     PDF
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCertForm({ ...certForm, uploadMode: "link" })
//                     }
//                     className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//                   >
//                     URI
//                   </button>
//                 </div>
//               </div>

//               {/* Conditional Input Box */}
//               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                 {certForm.uploadMode === "file" ? (
//                   <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/30 hover:bg-white hover:border-emerald-500 transition-all group/up">
//                     <label className="cursor-pointer block">
//                       <FileUp
//                         className="mx-auto text-slate-300 group-hover/up:text-emerald-500 mb-3 transition-colors"
//                         size={32}
//                       />
//                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
//                         {certForm.certificate_file
//                           ? certForm.certificate_file.name
//                           : "Add Certificate PDF"}
//                       </span>
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) =>
//                           setCertForm({
//                             ...certForm,
//                             certificate_file: e.target.files[0],
//                           })
//                         }
//                       />
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <LinkIcon
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
//                       size={18}
//                     />
//                     <input
//                       placeholder="https://credential-verify.com/id..."
//                       value={certForm.certificate_link}
//                       onChange={(e) =>
//                         setCertForm({
//                           ...certForm,
//                           certificate_link: e.target.value,
//                         })
//                       }
//                       className={inputStyle + " pl-12 h-14"}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Commit Action */}
//               <button
//                 type="button"
//                 onClick={
//                   editingCertificate ? updateCertificate : handleAddCertificate
//                 }
//                 className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
//               >
//                 <Database size={16} />
//                 {editingCertificate
//                   ? "Certificate Update"
//                   : "Add New Certificate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `.custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }.custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }.custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }.custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }`,
//         }}
//       />
//     </div>
//   );
// };

// export default ManualEntry;
//*******************************************************working code pahse 1 24/06/26******************************************************************* */
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Check,
//   Award,
//   Eye,
//   PlusCircle,
//   User,
//   ExternalLink,
//   Briefcase,
//   Fingerprint,
//   Calendar,
//   FileText,
//   CheckCircle,
//   Activity,
//   MapPin,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   Edit3,
//   LinkIcon,
//   FileUp,
//   ChevronRight,
//   ChevronLeft,
//   ChevronDown,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-start gap-1 items-center">
//       <span>{label}</span>
//       <span
//         className={`font-bold text-[15px] normal-case ${required ? "text-red-500" : "text-slate-300"}`}
//       >
//         {required ? "*" : ""}
//       </span>
//     </label>
//     {children}
//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntry = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const effectiveId = id || "666";
//   const ASSET_OPTIONS = [
//     "Laptop",
//     "Mouse",
//     "Keyboard",
//     "Monitor",
//     "Headset",
//     "Mobile",
//     "ID Card",
//     "SIM Card",
//   ];
//   // Professional Enterprise Input Style
//   const inputStyle =
//     "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";

//   // 1. INITIALIZE ALL STATES
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [isFresher, setIsFresher] = useState(null);
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState("");
//   const [dynamicSkills, setDynamicSkills] = useState([]);
//   const [existingResume, setExistingResume] = useState("");
//   const [industrySearch, setIndustrySearch] = useState("");
//   const [showIndustryDrop, setShowIndustryDrop] = useState(false);
//   const [dynamicAssets, setDynamicAssets] = useState([]);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const dropdownContainerRef = useRef(null);
//   const [existingCertificates, setExistingCertificates] = useState([]);
//   const [editingCertId, setEditingCertId] = useState(null);
//   const [editingCertValue, setEditingCertValue] = useState("");
//   const [showExpModal, setShowExpModal] = useState(false);
//   const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
//   const [newExperiences, setNewExperiences] = useState([]);
//   const [masterIndustries, setMasterIndustries] = useState([]);
//   const [baseData, setBaseData] = useState({});
// const [isSubmitted, setIsSubmitted] = useState(false);
//   //**********************************certiificate and resume*********************************** */

//   const [docType, setDocType] = useState("resume");
//   // "resume" | "certificate"

//   const [showCertEditModal, setShowCertEditModal] = useState(false);
//   const [editingCertificate, setEditingCertificate] = useState(null);

//   const [certForm, setCertForm] = useState({
//     name: "",
//     certificate_file: null,
//     certificate_link: "",
//     uploadMode: "file", // file | link
//   });

//   //**********************************certiificate and resume end*********************************** */

//   //**********************************eduction*********************************** */

//   const [showEduModal, setShowEduModal] = useState(false);
//   const [masterEducations, setMasterEducations] = useState([]);
//   const [eduDropdownOpen, setEduDropdownOpen] = useState(false);
//   const [isEditingEdu, setIsEditingEdu] = useState(false);
//   const [currentEduId, setCurrentEduId] = useState(null);
//   const [newEdu, setNewEdu] = useState({
//     education_id: 0,
//     institution_name: "",
//     start_year: "",
//     end_year: "",
//     education_name: "", // For display in dropdown
//   });

//   //**********************************eduction  end*********************************** */
//   const careerStepRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     address2: "",
//     location: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "India",
//     position: "",
//     gender: "",
//     dob: "",
//     education: [],
//     experience: "",
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const totalSteps = 6;

//   const educationOptions = [
//     "SSC / 10th",
//     "HSC / 12th",
//     "ITI",
//     "Diploma",
//     "Polytechnic",

//     "B.A",
//     "B.Com",
//     "B.Sc",
//     "BCA",
//     "BBA",
//     "B.Tech",
//     "BE",
//     "B.Pharm",
//     "B.Ed",

//     "M.A",
//     "M.Com",
//     "M.Sc",
//     "MCA",
//     "MBA",
//     "M.Tech",
//     "ME",
//     "M.Pharm",
//     "M.Ed",

//     "PGDM",
//     "Post Graduate Diploma",

//     "PhD / Doctorate",
//   ];

//   const POSITION_OPTIONS = [
//     // IT / Software
//     "Frontend Developer",
//     "Backend Developer",
//     "Full Stack Developer",
//     "Software Engineer",
//     "Senior Software Engineer",
//     "Lead Developer",
//     "DevOps Engineer",
//     "QA Engineer",
//     "Automation Tester",
//     "Manual Tester",
//     "UI/UX Designer",
//     "Mobile App Developer",
//     "Android Developer",
//     "iOS Developer",
//     "Data Analyst",
//     "Data Scientist",
//     "Machine Learning Engineer",
//     "AI Engineer",
//     "Cloud Engineer",
//     "System Administrator",
//     "Network Engineer",
//     "Cyber Security Analyst",

//     // Management / Office
//     "Project Manager",
//     "Product Manager",
//     "Operations Manager",
//     "Team Lead",
//     "Business Analyst",
//     "HR Executive",
//     "HR Manager",
//     "Recruiter",
//     "Office Administrator",

//     // Non-IT / General
//     "Accountant",
//     "Finance Executive",
//     "Sales Executive",
//     "Marketing Executive",
//     "Digital Marketing Specialist",
//     "Customer Support Executive",
//     "Technical Support Engineer",
//     "Field Executive",
//     "Supervisor",
//     "Store Manager",
//     "Warehouse Executive",

//     // Fresher / Entry
//     "Intern",
//     "Trainee",
//     "Graduate Engineer Trainee",
//     "Apprentice",
//   ];

//   const filteredEducation = educationOptions.filter((e) =>
//     e.toLowerCase().includes(eduSearch.toLowerCase()),
//   );
//   const filteredDepartments = departments.filter((d) =>
//     (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()),
//   );
//   const isStep1Valid =
//     formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && formData.phone;

//   // 2. HYDRATION LOGIC (GET API)
//   useEffect(() => {
//     hydrateNode();
//   }, [effectiveId]);

//   //    const hydrateNode = async () => {
//   //       setFetchingData(true);
//   //       try {
//   //         const response = await fetch(
//   //           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//   //         );
//   //         if (!response.ok) throw new Error();
//   //         const data = await response.json();

//   //         if (data) {
//   //           setExistingResume(data.resume_path || "");

//   //           setExistingCertificates(
//   //             Array.isArray(data.certificates) ? data.certificates : [],
//   //           );

//   //           const safeParse = (value) => {
//   //             if (!value) return [];

//   //             try {
//   //               // Already array → fix broken JSON pieces
//   //               if (Array.isArray(value)) {
//   //                 const joined = value.join("");
//   //                 if (joined.startsWith("[")) {
//   //                   return JSON.parse(joined);
//   //                 }
//   //                 return value;
//   //               }

//   //               // If string JSON
//   //               if (typeof value === "string" && value.startsWith("[")) {
//   //                 return JSON.parse(value);
//   //               }

//   //               // If CSV string → convert to array
//   //               if (typeof value === "string") {
//   //                 return value
//   //                   .split(",")
//   //                   .map((s) => s.trim())
//   //                   .filter(Boolean);
//   //               }

//   //               return [];
//   //             } catch {
//   //               return [];
//   //             }
//   //           };

//   //           setFormData((prev) => ({
//   //             ...prev,
//   //             name: data.full_name || "",
//   //             email: data.email || "",
//   //             phone: data.phone || "",
//   //             gender: data.gender || "",
//   //             dob: data.dob || "",
//   //             address: data.address || "",
//   //             address2: data.address2 || "",
//   //             location: data.location || "",
//   //             pincode: data.pincode || "",
//   //             city: data.city || "",
//   //             state: data.state || "",
//   //             district: data.district || "",
//   //             country: data.country || "India",
//   //             position: data.position || "",
//   //             experience: data.experience || "",
//   //            education: Array.isArray(data.educations)
//   //       ? data.educations.map(edu => ({
//   //           id: edu.id,
//   //           education_id: edu.education_id,
//   //           institution_name: edu.institution_name,
//   //           start_year: edu.start_year,
//   //           end_year: edu.end_year,
//   //           // Extract the name from education_master for the UI
//   //           education_name: edu.education_master?.name || "Unknown Degree"
//   //         }))
//   //       : [],

//   //             department: data.department || "",
//   //             about_me: data.about_me || "",
//   //             resume_link: data.resume_path || "",
//   //             languages_spoken: safeParse(data.languages_spoken),
//   //             experiences: data.experiences || [],
//   //             skills: safeParse(data.skills),
//   //             assets: safeParse(data.assets),
//   //           }));

//   //           setIsFresher(!data.experiences || data.experiences.length === 0);
//   //         }

//   //         const deptData = await departmentService.getAll();
//   //         setDepartments(deptData || []);
//   //         await fetchSkills();
//   //         await fetchAssets(effectiveId);
//   //       } catch (err) {
//   //         console.warn("Initializing Empty Node");
//   //       } finally {
//   //         setFetchingData(false);
//   //       }
//   //     };

//   const hydrateNode = async () => {
//     setFetchingData(true);
//     try {
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//       );
//       if (!response.ok) throw new Error();
//       const data = await response.json();

//       if (data) {
//         setExistingResume(data.resume_path || "");

//         setExistingCertificates(
//           Array.isArray(data.certificates) ? data.certificates : [],
//         );

//         const safeParse = (value) => {
//           if (!value) return [];
//           try {
//             if (Array.isArray(value)) {
//               const joined = value.join("");
//               if (joined.startsWith("[")) {
//                 return JSON.parse(joined);
//               }
//               return value;
//             }
//             if (typeof value === "string" && value.startsWith("[")) {
//               return JSON.parse(value);
//             }
//             if (typeof value === "string") {
//               return value
//                 .split(",")
//                 .map((s) => s.trim())
//                 .filter(Boolean);
//             }
//             return [];
//           } catch {
//             return [];
//           }
//         };

//         const mappedEducation = Array.isArray(data.educations)
//           ? data.educations.map((edu) => ({
//               id: edu.id,
//               education_id: edu.education_id,
//               institution_name: edu.institution_name,
//               start_year: edu.start_year,
//               end_year: edu.end_year,
//               education_name: edu.education_master?.name || "Unknown Degree",
//             }))
//           : [];

//         // Create a snapshot object for comparison
//         const serverSnapshot = {
//           name: data.full_name || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           gender: data.gender || "",
//           dob: data.dob || "",
//           address: data.address || "",
//           address2: data.address2 || "",
//           location: data.location || "",
//           pincode: data.pincode || "",
//           city: data.city || "",
//           state: data.state || "",
//           district: data.district || "",
//           country: data.country || "India",
//           position: data.position || "",
//           experience: data.experience || "",
//           education: mappedEducation,
//           department: data.department || "",
//           about_me: data.about_me || "",
//           resume_link: data.resume_path || "",
//           languages_spoken: safeParse(data.languages_spoken),
//           experiences: data.experiences || [],
//           skills: safeParse(data.skills),
//           assets: safeParse(data.assets),
//         };

//         // Set both current form and base reference
//         setFormData((prev) => ({ ...prev, ...serverSnapshot }));
//         setBaseData(serverSnapshot); // Ensure you have [baseData, setBaseData] = useState({})

//         setIsFresher(!data.experiences || data.experiences.length === 0);
//       }

//       const deptData = await departmentService.getAll();
//       setDepartments(deptData || []);
//       await fetchSkills();
//       await fetchAssets(effectiveId);
//     } catch (err) {
//       console.warn("Initializing Empty Node");
//     } finally {
//       setFetchingData(false);
//     }
//   };
//   const INDUSTRY_OPTIONS = [
//     "Information Technology",
//     "Software Development",
//     "Banking & Finance",
//     "Healthcare",
//     "Education",
//     "Manufacturing",
//     "Retail",
//     "Telecom",
//     "Construction",
//     "Logistics",
//     "Marketing & Advertising",
//     "HR / Recruitment",
//     "Government",
//     "Automobile",
//     "Pharmaceutical",
//     "E-Commerce",
//     "Media & Entertainment",
//     "Real Estate",
//     "Hospitality",
//     "Other",
//   ];

//   // Click Outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownContainerRef.current &&
//         !dropdownContainerRef.current.contains(event.target)
//       ) {
//         setShowSkillDrop(false);
//         setShowAssetDrop(false);
//         setSkillFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // READ STEP FROM URL (?step=3)
//   useEffect(() => {
//     const stepFromUrl = Number(searchParams.get("step"));

//     if (stepFromUrl && stepFromUrl >= 1 && stepFromUrl <= totalSteps) {
//       setStep(stepFromUrl);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     fetchMasterIndustries();
//   }, []);

//   // 3. HANDLERS
//   const fetchSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills",
//       );
//       const data = await res.json();
//       setDynamicSkills(data.map((item) => item.name || item));
//     } catch {}
//   };

//   const fetchAssets = async (cId) => {
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${cId}/assets`,
//       );
//       const data = await res.json();
//       setDynamicAssets(Array.isArray(data) ? data.map((a) => a.name) : []);
//     } catch {}
//   };

//   const handleManualAddSkill = async () => {
//     const name = skillInput.trim();
//     if (!name) {
//       await fetchSkills();
//       return;
//     }
//     const success = await handleCreateMaster("skills", name);
//     if (success) {
//       if (!formData.skills.includes(name))
//         setFormData((p) => ({ ...p, skills: [...p.skills, name] }));
//       setSkillInput("");
//       await fetchSkills();
//     }
//   };

//   const handleCreateMaster = async (type, name) => {
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/masters/${type}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: name.trim() }),
//         },
//       );
//       return res.ok;
//     } catch {
//       return false;
//     }
//   };

//   const handleAddAssetAPI = async (assetName) => {
//     if (!assetName.trim()) return;
//     const loadingToast = toast.loading(`Linking asset...`);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/assets`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: assetName.trim() }),
//         },
//       );
//       if (res.ok) {
//         toast.success("Linked", { id: loadingToast });
//         await fetchAssets(effectiveId);
//         return true;
//       }
//     } catch {
//       toast.error("Sync failed", { id: loadingToast });
//     }
//     return false;
//   };

//   const filteredIndustries = INDUSTRY_OPTIONS.filter((ind) =>
//     ind.toLowerCase().includes(industrySearch.toLowerCase()),
//   );

//   const handleSaveOrUpdateExperience = async (i) => {
//     const exp = newExperiences[i];

//     if (
//       !exp.company_name ||
//       !exp.job_title ||
//       !exp.start_date ||
//       !exp.end_date
//     ) {
//       toast.error("Company, Role, Start Date, End Date required");
//       return;
//     }

//     const loadingToast = toast.loading(
//       currentEditingIndex !== null
//         ? "Updating experience..."
//         : "Saving experience...",
//     );

//     try {
//       const fd = new FormData();

//       fd.append("company_name", exp.company_name);
//       fd.append("job_title", exp.job_title);
//       fd.append("start_date", exp.start_date);
//       fd.append("department", exp.department || "");
//       fd.append("end_date", exp.end_date);
//       fd.append("previous_ctc", exp.previous_ctc || "");
//       fd.append("location", exp.location || "");
//       fd.append("description", exp.description || "");
//       // fd.append("industry_id", exp.industry || "");
//       fd.append("industry_id", exp.industry_id || "");

//       if (exp.uploadMode === "link") {
//         fd.append("exp_letter_link", exp.exp_letter_link || "");
//       } else if (exp.expLetterFile instanceof File) {
//         fd.append("exp_letter_file", exp.expLetterFile);
//       }

//       // =========================
//       // UPDATE (PATCH)
//       // =========================
//       if (currentEditingIndex !== null && exp.id) {
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences/${exp.id}`,
//           {
//             method: "PUT",
//             body: fd,
//           },
//         );

//         if (!res.ok) throw new Error(await res.text());

//         // Update UI instantly
//         const updated = [...formData.experiences];
//         updated[currentEditingIndex] = exp;

//         setFormData((prev) => ({
//           ...prev,
//           experiences: updated,
//         }));

//         toast.success("Experience Updated ✅", { id: loadingToast });
//       }

//       // =========================
//       // ADD NEW (POST)
//       // =========================
//       else {
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences`,
//           {
//             method: "POST",
//             body: fd,
//           },
//         );

//         if (!res.ok) throw new Error(await res.text());

//         await hydrateNode(); // reload from backend

//         toast.success("Experience Added ✅", { id: loadingToast });
//       }

//       setNewExperiences([]);
//       setCurrentEditingIndex(null);
//       setShowExpModal(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed ❌", { id: loadingToast });
//     }
//   };

//   const fetchMasterIndustries = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters?types=industries&skip=0&limit=100",
//       );
//       const data = await res.json();
//       // Assuming API returns { industries: [...] }
//       setMasterIndustries(data.industries || []);
//     } catch (err) {
//       console.error("Industry Load Error", err);
//     }
//   };

//   // Fetch Master Education List
//   const fetchMasterEducations = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters?types=educations&skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterEducations(data.educations || []);
//     } catch (err) {
//       console.error("Master Load Error", err);
//     }
//   };

//   // Save or Update Education
//   const handleSaveEducation = async () => {
//     const loadingToast = toast.loading(
//       isEditingEdu ? "Updating Node..." : "Syncing Education...",
//     );
//     const url = isEditingEdu
//       ? `https://apihrr.goelectronix.co.in/education/${currentEduId}?user_type=candidate`
//       : `https://apihrr.goelectronix.co.in/education/${effectiveId}?user_type=candidate`;

//     try {
//       const res = await fetch(url, {
//         method: isEditingEdu ? "PATCH" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           education_id: newEdu.education_id,
//           institution_name: newEdu.institution_name,
//           start_year: newEdu.start_year,
//           end_year: newEdu.end_year,
//         }),
//       });

//       if (res.ok) {
//         toast.success("Education Node Synchronized", { id: loadingToast });
//         setShowEduModal(false);
//         // Logic to refresh your formData.education from GET API here
//         // 🔥 REFRESH LOGIC: Trigger hydration to pull the updated 'educations' array
//         await hydrateNode();

//         // Reset Search state
//         setEduSearch("");
//       }
//     } catch (err) {
//       toast.error("Sync Failed", { id: loadingToast });
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;

//     setIsFetchingPincode(true);

//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();

//       if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
//         const postOffices = data[0].PostOffice;

//         setCityOptions(postOffices); // ⭐ store full objects

//         const first = postOffices[0];

//         setFormData((prev) => ({
//           ...prev,
//           city: first.Name || "",
//           district: first.District || "",
//           state: first.State || "",
//           country: first.Country || "India",
//         }));
//       } else {
//         setCityOptions([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setCityOptions([]);
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   // ---------- STEP VALIDATION ----------

//   const STEP_FIELDS = {
//     1: [
//       "name",
//       "email",
//       "phone",
//       "gender",
//       "dob",
//       "position",
//       "experience",
//       "education",
//       "department",
//       "about_me",
//       "languages_spoken",
//     ],

//     2: [
//       "address",
//       "address2",
//       "location",
//       "pincode",
//       "city",
//       "district",
//       "state",
//       "country",
//     ],

//     // ✅ NEW EDUCATION STEP
//     3: ["education"],

//     // ✅ EXPERIENCE SHIFTED TO 4
//     4: ["experiences"],

//     // ✅ SKILLS & ASSETS SHIFTED TO 5
//     5: ["skills", "assets"],

//     // ✅ DOCUMENTS SHIFTED TO 6
//     6: ["resume_link", "cvFile", "certificateFiles", "certificateLinks"],
//   };

//   // STEP 1 → Personal
//   const isStep1Incomplete = () => {
//     return !(
//       formData.name &&
//       formData.email &&
//       formData.phone &&
//       formData.gender &&
//       formData.dob &&
//       (formData.languages_spoken || []).length > 0 &&
//       formData.about_me
//     );
//   };

//   // STEP 2 → Location
//   const isStep2Incomplete = () => {
//     return !(
//       formData.address &&
//       formData.city &&
//       formData.state &&
//       formData.pincode
//     );
//   };

// //   // STEP 3 → Education
// //   const isStep3Incomplete = () => {
// //     return !(
// //       Array.isArray(formData.education) && formData.education.length > 0
// //     );
// //   };

// //   // STEP 4 → Experience
// //   const isStep4Incomplete = () => {
// //     if (isFresher) return false; // Fresher doesn't require experience

// //     return !(
// //       Array.isArray(formData.experiences) && formData.experiences.length > 0
// //     );
// //   };

// // Step 3 → Education Incompletion Logic
// const isStep3Incomplete = () => {
//   return !(Array.isArray(formData.education) && formData.education.length > 0);
// };

// // Step 4 → Experience Incompletion Logic (Respects isFresher)
// const isStep4Incomplete = () => {
//   if (isFresher) return false; // Fresher doesn't require experience records
//   return !(Array.isArray(formData.experiences) && formData.experiences.length > 0);
// };

//   // STEP 5 → Skills & Assets
// //   const isStep5Incomplete = () => {
// //     return !(
// //       (formData.skills && formData.skills.length > 0) ||
// //       (formData.assets && formData.assets.length > 0)
// //     );
// //   };

// const isStep5Incomplete = () => {
//   return (
//     (!formData.skills || formData.skills.length === 0) &&
//     (!formData.assets || formData.assets.length === 0)
//   );
// };

//   // STEP 6 → Documents
// //   const isStep6Incomplete = () => {
// //     return !(
// //       existingResume ||
// //       formData.cvFile ||
// //       (formData.certificateFiles && formData.certificateFiles.length > 0) ||
// //       (existingCertificates && existingCertificates.length > 0)
// //     );
// //   };

// // Step 6 Check: Yellow if no Resume AND no Certificates exist
// const isStep6Incomplete = () => {
//   const hasResume =  (formData.resume_link && formData.resume_link.trim() !== "") || formData.cvFile || existingResume;
//   const hasCertificates = (formData.certificateFiles && formData.certificateFiles.length > 0) || 
//                           (existingCertificates && existingCertificates.length > 0) ||
//                           (formData.certificateLinks && formData.certificateLinks.some(l => l.trim() !== ""));
                          
//   return !hasResume && !hasCertificates;
// };

//   const fixResumeUrl = (url) => {
//     if (!url) return "";

//     // remove wrong https//
//     let clean = url.replace(/^https\/\//, "");

//     // if already full valid http/https → keep it
//     if (clean.startsWith("http://") || clean.startsWith("https://")) {
//       return clean;
//     }

//     // attach correct base URL
//     return `https://apihrr.goelectronix.co.in/${clean.replace(/^\/+/, "")}`;
//   };

//   const fixResumeUrl2 = (url) => {
//     if (!url) return "";

//     let clean = url.trim();

//     // Fix broken https//
//     clean = clean.replace(/^https\/\//, "https://");

//     // 🔴 If URL is https://uploads/... → replace domain
//     if (clean.startsWith("https://uploads")) {
//       return clean.replace(
//         "https://uploads",
//         "https://apihrr.goelectronix.co.in/uploads",
//       );
//     }

//     // Already full valid URL → return
//     if (clean.startsWith("http://") || clean.startsWith("https://")) {
//       return clean;
//     }

//     // Remove starting slash
//     clean = clean.replace(/^\/+/, "");

//     // Attach backend base
//     return `https://apihrr.goelectronix.co.in/${clean}`;
//   };

//   const hasExistingExperience =
//     Array.isArray(formData.experiences) && formData.experiences.length > 0;

//   const saveStepData = async (stepNumber) => {
//     const fields = STEP_FIELDS[stepNumber] || [];

//     // --- 1. CHANGE DETECTION PROTOCOL ---
//     // Compares current formData against the baseData snapshot retrieved during hydration
//     const hasChanged = fields.some((key) => {
//       // Handling for Arrays (Languages, Skills, Assets, Education, Experiences)
//       if (Array.isArray(formData[key])) {
//         return JSON.stringify(formData[key]) !== JSON.stringify(baseData[key]);
//       }
//       // Handling for File objects (Resume/Certificates)
//       if (formData[key] instanceof File) return true;

//       // Standard primitive comparison (Strings/Numbers)
//       return (formData[key] || "") !== (baseData[key] || "");
//     });

//     // If no changes are detected, we bypass the API call and return true to allow navigation
//     if (!hasChanged) {
//       console.log(
//         `Step ${stepNumber}: No changes detected. Skipping network request.`,
//       );
//       return true;
//     }

//     try {
//       const apiData = new FormData();

//       // --- 2. DYNAMIC PAYLOAD CONSTRUCTION ---
//       fields.forEach((key) => {
//         // Group: CSV Serialization (Languages, Skills, Assets)
//         if (["languages_spoken", "skills", "assets"].includes(key)) {
//           apiData.append(key, (formData[key] || []).join(","));
//         }

//         // Group: JSON Serialization (Education, Experiences)
//         else if (key === "education") {
//           apiData.append(
//             "education_details",
//             JSON.stringify(formData.education || []),
//           );
//         } else if (key === "experiences") {
//           apiData.append(
//             "experience_details",
//             JSON.stringify(formData.experiences || []),
//           );
//         }

//         // Group: File/Link Handling (Master Resume - Step 6)
//         else if (key === "cvFile" && formData.cvFile) {
//           apiData.append("resumepdf", formData.cvFile);
//         } else if (key === "resume_link" && formData.resume_link) {
//           apiData.append("resume_link", formData.resume_link);
//         }

//         // Group: Certificate Batching (Step 6)
//         else if (key === "certificateFiles") {
//           formData.certificateFiles.forEach((file, idx) => {
//             apiData.append("certificate_files", file);
//             if (formData.certificateNames?.[idx]) {
//               apiData.append(
//                 "certificate_names",
//                 formData.certificateNames[idx],
//               );
//             }
//           });
//         }

//         // Group: Standard Strings (Name, Address, etc.)
//         else {
//           apiData.append(key, formData[key] ?? "");
//         }
//       });

//       // Special Case: Ensure full_name is always present as per API requirements
//       apiData.append("full_name", formData.name || "");

//       // --- 3. API EXECUTION ---
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//         {
//           method: "PATCH",
//           body: apiData,
//         },
//       );

//       if (response.ok) {
//         // --- 4. POST-SYNC CLEANUP ---
//         // Update the baseData snapshot to match current state so subsequent clicks don't re-trigger
//         const updatedFields = {};
//         fields.forEach((f) => {
//           updatedFields[f] = formData[f];
//         });
//         setBaseData((prev) => ({ ...prev, ...updatedFields }));

//         if (stepNumber === 6) {
//           setFormData((prev) => ({
//             ...prev,
//             certificateFiles: [],
//             certificateLinks: [""],
//           }));
//         }

//         toast.success(`Saved the updated code: Step ${stepNumber}`);
//         return true;
//       } else {
//         throw new Error("Registry update rejected");
//       }
//     } catch (err) {
//       console.error("Critical Sync Error:", err);
//       toast.error(`Step ${stepNumber} save failed`);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const loadingToast = toast.loading("Executing Final PATCH Sync...");

//     try {
//       const apiData = new FormData();

//       // 🔹 Append ALL simple fields (NO skipping empty)
//       for (const key in formData) {
//         if (
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "skills",
//             "assets",
//           ].includes(key)
//         ) {
//           apiData.append(key, formData[key] ?? "");
//         }
//       }

//       // 🔹 Required backend fields
//       apiData.append("full_name", formData.name || "");

//       apiData.append(
//         "languages_spoken",
//         (formData.languages_spoken || []).join(","),
//       );

//       apiData.append("skills", (formData.skills || []).join(","));
//       apiData.append("assets", (formData.assets || []).join(","));

//       // CASE 1: Upload PDF
//       if (formData.cvFile) {
//         apiData.append("resumepdf", formData.cvFile); // ✅ correct key
//       }

//       // CASE 2: Resume Link
//       else if (formData.resume_link) {
//         apiData.append("resume_link", formData.resume_link); // ✅ correct key
//       }

//       // CASE 3: Keep existing resume (no change)
//       else if (existingResume) {
//         apiData.append("resume_link", existingResume);
//       }

//       // 🔹 Certificates FILES
//       formData.certificateFiles.forEach((file) => {
//         apiData.append("certificates", file);
//       });

//       // 🔹 Certificate LINKS
//       apiData.append(
//         "certificate_links",
//         JSON.stringify(formData.certificateLinks.filter((l) => l && l.trim())),
//       );

//       // 🔹 Debug — SEE WHAT GOES TO API
//       for (let pair of apiData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//         {
//           method: "PATCH",
//           body: apiData,
//         },
//       );

//       if (!response.ok) {
//         const err = await response.text();
//         console.error(err);
//         throw new Error("API Failed");
//       }

//       toast.success("Candidate Synchronized 🎉", { id: loadingToast });
//     } catch (err) {
//       console.error(err);
//       toast.error("Commit failed ❌", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCertificate = async () => {
//     // 1. Validation Logic
//     if (!certForm.name.trim())
//       return toast.error("Artifact Label is compulsory");

//     if (certForm.uploadMode === "file" && !certForm.certificate_file) {
//       return toast.error("Please select a PDF file");
//     }
//     if (certForm.uploadMode === "link" && !certForm.certificate_link) {
//       return toast.error("Please enter a URI link");
//     }

//     const loadingToast = toast.loading("Deploying new credential node...");

//     try {
//       const apiData = new FormData();

//       // ✅ Following Request Body from Image 1: name, certificate_file, certificate_link
//       apiData.append("name", certForm.name.trim());

//       if (certForm.uploadMode === "file") {
//         apiData.append("certificate_file", certForm.certificate_file);
//         // Backend expects either file or link; image shows link is optional if file is present
//       } else {
//         apiData.append("certificate_link", certForm.certificate_link.trim());
//       }

//       // ✅ Image 1 Endpoint: POST /{person_type}/{person_id}/certificates
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates`,
//         {
//           method: "POST",
//           body: apiData,
//         },
//       );

//       if (response.ok) {
//         toast.success("Credential Registered 🎉", { id: loadingToast });

//         // Reset Modal State
//         setShowCertEditModal(false);
//         setCertForm({
//           name: "",
//           certificate_file: null,
//           certificate_link: "",
//           uploadMode: "file",
//         });

//         // 🔥 REFRESH UI
//         await hydrateNode();
//       } else {
//         const errorText = await response.text();
//         console.error("Registry Sync Error:", errorText);
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Deployment failed ❌", { id: loadingToast });
//     }
//   };

//   // --- UPDATE EXISTING CERTIFICATE (Direct PUT) ---
//   const updateCertificate = async () => {
//     if (!certForm.name.trim())
//       return toast.error("Artifact Label is compulsory");

//     const loadingToast = toast.loading("Updating Node Artifact...");
//     try {
//       const fd = new FormData();

//       // ✅ Following Request Body from Image 2
//       fd.append("name", certForm.name.trim());

//       if (certForm.uploadMode === "file" && certForm.certificate_file) {
//         fd.append("certificate_file", certForm.certificate_file);
//       } else if (certForm.uploadMode === "link" && certForm.certificate_link) {
//         fd.append("certificate_link", certForm.certificate_link.trim());
//       }

//       // ✅ Image 3 Parameters: /candidates/{person_id}/certificates/{certificate_id}
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates/${editingCertificate.id}`,
//         {
//           method: "PUT",
//           body: fd,
//         },
//       );

//       if (res.ok) {
//         toast.success("Artifact Updated ✅", { id: loadingToast });
//         setShowCertEditModal(false);

//         // Reset editing state
//         setEditingCertificate(null);

//         await hydrateNode();
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Sync Error ❌", { id: loadingToast });
//     }
//   };

//   const numberToIndianWords = (num) => {
//     if (!num || isNaN(num)) return "";

//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];

//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const twoDigits = (n) =>
//       n < 20
//         ? ones[n]
//         : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");

//     const threeDigits = (n) => {
//       if (n === 0) return "";
//       if (n < 100) return twoDigits(n);
//       return (
//         ones[Math.floor(n / 100)] +
//         " Hundred" +
//         (n % 100 ? " " + twoDigits(n % 100) : "")
//       );
//     };

//     const crore = Math.floor(num / 10000000);
//     const lakh = Math.floor((num % 10000000) / 100000);
//     const thousand = Math.floor((num % 100000) / 1000);
//     const hundred = num % 1000;

//     let result = "";

//     if (crore) result += twoDigits(crore) + " Crore ";
//     if (lakh) result += twoDigits(lakh) + " Lakh ";
//     if (thousand) result += twoDigits(thousand) + " Thousand ";
//     if (hundred) result += threeDigits(hundred);

//     return result.trim() + " per annum";
//   };

//   const today = new Date();

//   // 18 years ago (max allowed DOB)
//   const maxDate = new Date(
//     today.getFullYear() - 18,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .split("T")[0];

//   // 70 years ago (min allowed DOB)
//   const minDate = new Date(
//     today.getFullYear() - 70,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .split("T")[0];

//   const [dobError, setDobError] = useState("");

//   const handleDobChange = (value) => {
//     setFormData({ ...formData, dob: value });

//     if (!value) {
//       setDobError("Date of Birth is required");
//       return;
//     }

//     const selected = new Date(value);

//     if (selected > new Date(maxDate)) {
//       setDobError("Age must be at least 18 years");
//     } else if (selected < new Date(minDate)) {
//       setDobError("Age must be below 70 years");
//     } else {
//       setDobError("");
//     }
//   };

//   const handleResumeDirectUpload = async (file) => {
//   if (!file) return;
  
//   setLoading(true);
//   const syncToast = toast.loading("Executing Instant Registry Sync...");

//   try {
//     const apiData = new FormData();
//     apiData.append("resumepdf", file); // Ensure "resumepdf" matches backend key
//     apiData.append("full_name", formData.name); // Usually required by backend

//     const response = await fetch(
//       `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//       {
//         method: "PATCH",
//         body: apiData,
//       }
//     );

//     if (response.ok) {
//       toast.success("Document Verified & Live", { id: syncToast });
//       // 🔥 REFRESH UI: This will trigger hydrateNode and show the success block within 1sec
//       await hydrateNode(); 
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Protocol Rejection: Upload Failed", { id: syncToast });
//   } finally {
//     setLoading(false);
//   }
// };


// const handleFinalProtocolSync = async () => {
//     const score = calculateCompletion();

//     if (score < 100) {
//       toast.error(`Audit Failure: ${score}% Completion. Please verify all mandatory nodes (Languages, About Me, etc.) before final synchronization.`, {
//         duration: 5000,
//         icon: '⚠️'
//       });
//       return;
//     }

//     setLoading(true);
//     // Execute final step save (Step 6)
//     const success = await saveStepData(6);
    
//     if (success) {
//       setIsSubmitted(true); // Trigger the Success Hub
//       toast.success("Registry Protocol Synchronized 100%");
//     }
//     setLoading(false);
//   };

// //  const calculateCompletion = () => {
// //   const fieldsToTrack = [
// //     // Step 1: Personal
// //     formData.name, formData.email, formData.phone, formData.gender, 
// //     formData.dob, formData.about_me, formData.languages_spoken?.length > 0,
// //     // Step 2: Location
// //     formData.address, formData.city, formData.state, formData.pincode,
// //     // Step 3: Education (New logic added here)
// //     formData.education?.length > 0,
// //     // Step 4: Experience
// //     isFresher || formData.experiences?.length > 0,
// //     // Step 5: Skills & Assets
// //     formData.skills?.length > 0 || formData.assets?.length > 0,
// //     // Step 6: Vault
// //     formData.cvFile || existingResume
// //   ];

// //   const filledFields = fieldsToTrack.filter(field => {
// //     if (Array.isArray(field)) return field.length > 0;
// //     if (typeof field === 'boolean') return field;
// //     return !!field; 
// //   }).length;

// //   return Math.round((filledFields / fieldsToTrack.length) * 100);
// // };

// const calculateCompletion = () => {
//   const auditMatrix = [
//     // Phase 01: Identity
//     !!formData.name, 
//     !!formData.email, 
//     !!formData.phone, 
//     !!formData.gender, 
//     !!formData.dob, 
//     !!formData.about_me, 
//     (formData.languages_spoken?.length > 0),

//     // Phase 02: Geolocation
//     !!formData.address, 
//     !!formData.city, 
//     !!formData.state, 
//     !!formData.pincode,

//     // Phase 03: Academic Nodes
//     (formData.education?.length > 0),

//     // Phase 04: Professional Timeline
//     // Protocol: If Fresher is active, this node is auto-verified.
//     (isFresher === true || formData.experiences?.length > 0),

//     // Phase 05: Technical Stack
//     (formData.skills?.length > 0 || formData.assets?.length > 0),

//     // Phase 06: Document Vault
//     !!(formData.cvFile || existingResume || formData.resume_link)
//   ];

//   const completedNodes = auditMatrix.filter(node => node === true).length;
//   const totalNodes = auditMatrix.length;

//   return Math.round((completedNodes / totalNodes) * 100);
// };

//   if (fetchingData)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//         <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
//         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
//           Loading Data Load {effectiveId}...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8" ref={dropdownContainerRef}>


        
//         <div className="flex justify-start">
//         <button
//           onClick={() => navigate("/candidate")}
//           className="group flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//         >
//           <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//           Return to Candidate 
//         </button>
//       </div>
//         {/* ROADMAP HEADER */}
//         {/* <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//               <Database size={32} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//                 {id ? "Profile" : "Manual Registry"}
//               </h2>
//               <div className="flex items-center gap-2 mt-1 text-blue-600">
//                 <ShieldCheck size={14} />
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 max-w-2xl w-full px-4">
//             <div className="relative flex justify-between items-center w-full">
//               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//               <div
//                 className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//                 style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//               />
            

// {[1, 2, 3, 4, 5, 6].map((num) => {
//   // Protocol: Determine if this specific node has missing data
//   const isWarningNode = 
//     (num === 1 && isStep1Incomplete()) ||
//     (num === 2 && isStep2Incomplete()) ||
//     (num === 3 && isStep3Incomplete()) || // Yellow if education is []
//     (num === 4 && isStep4Incomplete()) ||
//     (num === 5 && isStep5Incomplete()) || 
//     (num === 6 && isStep6Incomplete());

//   return (
//     <div
//       key={num}
//       className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//       onClick={async () => {
//         if (num > step + 1) {
//           toast.error("Complete current phase registry first");
//           return;
//         }
//         const success = await saveStepData(step);
//         if (success || num < step) {
//           setStep(num);
//           navigate(`?step=${num}`, { replace: true });
//         }
//       }}
//     >
  
//       <div
//         className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//           group-hover/step:scale-110
//           ${step === num
//             ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" // Active
//             : step > num
//               ? isWarningNode 
//                 ? "bg-yellow-400 text-white border-yellow-100" // Warning (Even if passed)
//                 : "bg-emerald-500 text-white border-emerald-50" // Completed
//               : isWarningNode 
//                 ? "bg-yellow-400 text-white border-yellow-100" // Future Warning
//                 : "bg-white text-slate-300 border-slate-50" // Untouched
//           }`}
//       >
//         {step > num && !isWarningNode ? <Check size={14} strokeWidth={4} /> : num}
//       </div>

   
//       <span
//         className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//           ${step === num ? "text-blue-600" : isWarningNode ? "text-yellow-600" : "text-slate-300"} 
//           group-hover/step:text-slate-900`}
//       >
//         {num === 1 && "Personal"}
//         {num === 2 && "Location"}
//         {num === 3 && "Education"}
//         {num === 4 && "Experience"}
//         {num === 5 && "Stack"}
//         {num === 6 && "Vault"}
//       </span>
//     </div>
//   );
// })}
//             </div>
//           </div>
          
//           <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group">
//   <div className="text-right">
//     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
//       Audit Completion
//     </p>
//     <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
//       calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
//     }`}>
//       {calculateCompletion()}%
//     </p>
//   </div>
  

//   <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
//     calculateCompletion() === 100 
//       ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
//       : 'bg-blue-100 text-blue-600'
//   }`}>
//     {calculateCompletion() === 100 ? (
//       <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
//     ) : (
//       <Activity size={18} className="animate-pulse" />
//     )}
//   </div>
// </div>
//         </div> */} 

//         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//   {/* Left Section: Branding Node */}
//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//         {id ? "Edit Profile" : "Manual Add"}
//       </h2>
//       <div className="flex items-center gap-2 mt-1.5">
//         <ShieldCheck size={14} className="text-blue-600" />
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Candidate data</span>
//       </div>
//     </div>
//   </div>

//   {/* Center Section: Roadmap Protocol */}
//   {/* <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">
//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//       <div
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {[1, 2, 3, 4, 5, 6].map((num) => {
//         const isWarning = 
//           (num === 1 && isStep1Incomplete()) ||
//           (num === 2 && isStep2Incomplete()) ||
//           (num === 3 && isStep3Incomplete()) ||
//           (num === 4 && isStep4Incomplete()) ||
//           (num === 5 && isStep5Incomplete()) ||
//           (num === 6 && isStep6Incomplete());

//         return (
//           <div
//             key={num}
//             className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//             onClick={async () => {
//             //   if (num > step + 1) {
//             //     toast.error("Protocol Error: Complete current phase first");
//             //     return;
//             //   }
//               const success = await saveStepData(step);
//               if (success || num < step) {
//                 setStep(num);
//                 navigate(`?step=${num}`, { replace: true });
//               }
//             }}
//           >
//             <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               group-hover/step:scale-110
//               ${step === num
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num
//                   ? isWarning 
//                     ? "bg-yellow-400 text-white border-yellow-100" 
//                     : "bg-emerald-500 text-white border-emerald-50" 
//                   : isWarning 
//                     ? "bg-yellow-400 text-white border-yellow-100" 
//                     : "bg-emerald-400 text-slate-300 border-slate-50"
//               }`}
//             >
//               {step > num && !isWarning ? <Check size={14} strokeWidth={4} /> : num}
//             </div>
//             <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//               ${step === num ? "text-blue-600" : isWarning ? "text-yellow-600" : "text-slate-300"} 
//               group-hover/step:text-slate-900`}
//             >
//               {num === 1 && "Personal"}
//               {num === 2 && "Location"}
//               {num === 3 && "Education"}
//               {num === 4 && "Experience"}
//               {num === 5 && "Stack"}
//               {num === 6 && "Vault"}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   </div> */}

//   {/* Center Section: Roadmap Protocol */}
// <div className="flex-1 max-w-2xl w-full px-4">
//   <div className="relative flex justify-between items-center w-full">
//     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//     <div
//       className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//       style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//     />

//     {[1, 2, 3, 4, 5, 6].map((num) => {
//       const isWarning = 
//         (num === 1 && isStep1Incomplete()) ||
//         (num === 2 && isStep2Incomplete()) ||
//         (num === 3 && isStep3Incomplete()) ||
//         (num === 4 && isStep4Incomplete()) ||
//         (num === 5 && isStep5Incomplete()) ||
//         (num === 6 && isStep6Incomplete());

//       const isActive = step === num;
//       const isCompleted = step > num;

//       return (
//         <div
//           key={num}
//           className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//           onClick={async () => {
//             const success = await saveStepData(step);
//             if (success || num < step) {
//               setStep(num);
//               navigate(`?step=${num}`, { replace: true });
//             }
//           }}
//         >
//           {/* STEP CIRCLE */}
//           <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//             group-hover/step:scale-110
//             ${isActive
//               ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//               : isWarning
//                 ? "bg-white text-slate-400 border-slate-100" // Neutral background for Warning
//                 : isCompleted
//                   ? "bg-emerald-500 text-white border-emerald-50" 
//                   : "bg-slate-200 text-slate-400 border-slate-50"
//             }`}
//           >
//             {/* 🛠️ ICON LOGIC: Show Check if done, ? if incomplete, else Number */}
//             {isCompleted && !isWarning ? (
//               <Check size={14} strokeWidth={4} />
//             ) : isWarning ? (
//               <span className="text-blue-600 text-sm animate-pulse">?</span>
//             ) : (
//               num
//             )}
//           </div>

//           {/* LABEL */}
//           <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//             ${isActive ? "text-blue-600" : isWarning ? "text-slate-400" : "text-slate-300"} 
//             group-hover/step:text-slate-900`}
//           >
//             {num === 1 && "Personal"}
//             {num === 2 && "Location"}
//             {num === 3 && "Education"}
//             {num === 4 && "Experience"}
//             {num === 5 && "Stack"}
//             {num === 6 && "Vault"}
//           </span>
//         </div>
//       );
//     })}
//   </div>
// </div>

//   {/* Right Section: Percentage Hub */}
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group transition-all hover:bg-white hover:shadow-md">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
//         Audit Status
//       </p>
//       <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
//         calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
//       }`}>
//         {calculateCompletion()}%
//       </p>
//     </div>
    
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
//       calculateCompletion() === 100 
//         ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
//         : 'bg-blue-100 text-blue-600 shadow-blue-50'
//     }`}>
//       {calculateCompletion() === 100 ? (
//         <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
//       ) : (
//         <Activity size={16} className="animate-pulse" />
//       )}
//     </div>
//   </div>
// </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-12">
//             {/* STEP 1: IDENTITY & CAREER */}
//             {step === 1 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
//                   <User size={18} className="text-blue-600" />
//                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                     Basic Candidate profile
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <FormField label="Full Name" required>
//                     <input
//                       placeholder="Legal Name"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Email" required>
//                     <input
//                       type="email"
//                       placeholder="name@domain.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Phone" required>
//                     <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm">
//                       <span className="px-3 text-[11px] font-black text-slate-400">
//                         +91
//                       </span>
//                       <input
//                         maxLength={10}
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         className="w-full px-3 py-2 bg-transparent text-[13px] font-bold outline-none"
//                       />
//                     </div>
//                   </FormField>
//                   <FormField label="Gender">
//                     <select
//                       value={formData.gender}
//                       onChange={(e) =>
//                         setFormData({ ...formData, gender: e.target.value })
//                       }
//                       className={inputStyle}
//                     >
//                       <option value="">Select</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="transgender">Transgender</option>
//                       <option value="prefer_not_to_say">
//                         Prefer not to say
//                       </option>
//                     </select>
//                   </FormField>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
//                   <FormField label="Date of Birth">
//                     <input
//                       type="date"
//                       min={minDate}
//                       max={maxDate}
//                       value={formData.dob}
//                       onChange={(e) =>
//                         setFormData({ ...formData, dob: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Languages">
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-3 shadow-inner">
//                       {[
//                         "English",
//                         "Hindi",
//                         "Marathi",
//                         "Gujarati",
//                         "Tamil",
//                         "Telugu",
//                       ].map((lang) => (
//                         <label
//                           key={lang}
//                           className="flex items-center gap-2 text-[11px] font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={formData.languages_spoken.includes(lang)}
//                             onChange={() => {
//                               const u = formData.languages_spoken.includes(lang)
//                                 ? formData.languages_spoken.filter(
//                                     (l) => l !== lang,
//                                   )
//                                 : [...formData.languages_spoken, lang];
//                               setFormData({ ...formData, languages_spoken: u });
//                             }}
//                             className="w-3.5 h-3.5 accent-blue-600 rounded"
//                           />{" "}
//                           {lang}
//                         </label>
//                       ))}
//                     </div>
//                   </FormField>
//                 </div>
//                 <FormField label="Bio Summary">
//                   <textarea
//                     rows={3}
//                     value={formData.about_me}
//                     onChange={(e) =>
//                       setFormData({ ...formData, about_me: e.target.value })
//                     }
//                     className={inputStyle + " resize-none"}
//                   />
//                 </FormField>
//                 <div className="flex justify-end pt-4">
//                   <button
//                     type="button"
//                     // onClick={() => setStep(2)}
//                     onClick={async () => {
//                       await saveStepData(1);
//                       setStep(2);
//                     }}
//                     className={`px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all`}
//                   >
//                     Next Phase →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
//                   <MapPin size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     location Data
//                   </h3>
//                 </div>
//                 <div className="space-y-8">
//                   <FormField label="Address 1" required>
//                     <input
//                       value={formData.address}
//                       onChange={(e) =>
//                         setFormData({ ...formData, address: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Address 2" required>
//                       <input
//                         value={formData.location}
//                         onChange={(e) =>
//                           setFormData({ ...formData, location: e.target.value })
//                         }
//                         className={inputStyle}
//                       />
//                     </FormField>
//                     <FormField label="Pincode" required>
//                       <input
//                         maxLength={6}
//                         placeholder="000000"
//                         value={formData.pincode}
//                         onChange={(e) => {
//                           setFormData({ ...formData, pincode: e.target.value });
//                           if (e.target.value.length === 6)
//                             fetchPincodeDetails(e.target.value);
//                         }}
//                         className={inputStyle}
//                       />
//                     </FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     <FormField label="City">
//                       {isFetchingPincode ? (
//                         <input
//                           value="Fetching..."
//                           readOnly
//                           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-400 shadow-inner"
//                         />
//                       ) : cityOptions.length > 1 ? (
//                         <select
//                           value={formData.city}
//                           onChange={(e) => {
//                             const selected = cityOptions.find(
//                               (c) => c.Name === e.target.value,
//                             );

//                             setFormData((prev) => ({
//                               ...prev,
//                               city: selected?.Name || "",
//                               district: selected?.District || "",
//                               state: selected?.State || "",
//                               country: selected?.Country || "India",
//                             }));
//                           }}
//                           className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         >
//                           {cityOptions.map((c, i) => (
//                             <option key={i} value={c.Name}>
//                               {c.Name}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           value={formData.city || ""}
//                           readOnly
//                           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                         />
//                       )}
//                     </FormField>

//                     <FormField label="District">
//                       <input
//                         // value={formData.district}
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.district
//                         }
//                         readOnly
//                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                       />
//                     </FormField>
//                     <FormField label="State">
//                       <input
//                         // value={formData.state}
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.state
//                         }
//                         readOnly
//                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                       />
//                     </FormField>
//                     <FormField label="Country">
//                       <input
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.country
//                         }
//                         readOnly
//                         onChange={(e) =>
//                           setFormData({ ...formData, country: e.target.value })
//                         }
//                         className={inputStyle}
//                       />
//                     </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-8 border-t border-slate-50">
//                   <button
//                     onClick={() => setStep(1)}
//                     type="button"
//                     className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all shadow-sm"
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     //  onClick={() => setStep(3)}
//                     onClick={async () => {
//                       await saveStepData(2);
//                       setStep(3);
//                     }}
//                     type="button"
//                     className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl transition-all"
//                   >
//                     Continue →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
//                   <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                         <Award size={20} />
//                       </div>
//                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Education History</h3>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsEditingEdu(false);
//                         setNewEdu({ education_id: 0, institution_name: "", start_year: "", end_year: "", education_name: "" });
//                         fetchMasterEducations();
//                         setShowEduModal(true);
//                       }}
//                       className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
//                     >
//                       <Plus size={14} strokeWidth={3} /> Add Education
//                     </button>
//                   </div>
            
//             {/* VERIFIED EDUCATION LIST */}
//             <div className="space-y-4 relative z-10">
//               {formData.education && formData.education.length > 0 ? (
//                 formData.education.map((edu, i) => (
//                   <div key={i} className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white  transition-all border-l-4 border-l-blue-600">
                    
//                     {/* Node Index */}
//                     <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-900 shadow-sm">
//                       0{i + 1}
//                     </div>
            
//                     {/* Content Node */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-3 mb-1">
//                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
//                           {edu.institution_name}
//                         </h4>
//                         <span className="h-1 w-1 rounded-full bg-slate-300" />
//                         <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
//                           {edu.education_name} {/* Displays "Btech", "HSC", etc. */}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-4 text-slate-400">
//                         <div className="flex items-center gap-1.5">
//                           <Calendar size={12} className="text-slate-300" />
//                           <span className="text-[10px] font-black uppercase tracking-widest">
//                             {edu.start_year} <span className="text-slate-200 mx-1">—</span> {edu.end_year}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
            
//                     {/* Action Node */}
//                     <button 
//                       type="button" 
//                       onClick={() => {
//                         setIsEditingEdu(true);
//                         setCurrentEduId(edu.id);
//                         // Pre-fill modal
//                         setNewEdu({
//                           education_id: edu.education_id,
//                           institution_name: edu.institution_name,
//                           start_year: edu.start_year,
//                           end_year: edu.end_year,
//                           education_name: edu.education_name
//                         });
//                         setEduSearch(edu.education_name);
//                         setShowEduModal(true);
//                       }}
//                       className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-90"
//                     >
//                       <Edit3 size={16} />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-16 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
//                   <Database className="mx-auto text-slate-200 mb-4" size={32} />
//                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Zero Academic Nodes Registered</p>
//                 </div>
//               )}
//             </div>
//                 </div>
            
//                 {/* NAVIGATION */}
//                 <div className="flex justify-between pt-6">
//                   <button type="button" onClick={() => setStep(2)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm">← Back</button>
//                   <button
//                     type="button"
//                     onClick={async () => { await saveStepData(3); setStep(4); }}
//                     className="px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
//                   >Commit & Continue →</button>
//                 </div>
            
//                 {/* EDUCATION MODAL */}
//               {/* 2. Updated Modal Content */}
//             {showEduModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
//                 <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
                  
//                   {/* Modal Header */}
//                   <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
//                         <Award size={28} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">Education Details</h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Entry</p>
//                       </div>
//                     </div>
//                     <button onClick={() => { setShowEduModal(false); setEduDropdownOpen(false); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
//                       <X size={24} />
//                     </button>
//                   </div>
            
//                   <div className="p-10 space-y-8 bg-white overflow-visible">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">
                      
//                       {/* SEARCHABLE DROPDOWN */}
//                       <div className="space-y-2 relative" ref={dropdownContainerRef}>
//                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">
//                           Degree Specification
//                         </label>
//                         <div className="relative group">
//                           <input 
//                             placeholder="Search node (HSC, Btech, SSC...)" 
//                             value={eduSearch} 
//                             onFocus={() => {
//                               setEduDropdownOpen(true);
//                               if (masterEducations.length === 0) fetchMasterEducations();
//                             }}
//                             onChange={(e) => {
//                               setEduSearch(e.target.value);
//                               setEduDropdownOpen(true);
//                             }}
//                             className={inputStyle + " pr-10 focus:border-blue-600 transition-all"} 
//                           />
//                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
//                             {fetchingData ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
//                           </div>
//                         </div>
            
//                         {/* Dropdown Result Panel */}
//                         {eduDropdownOpen && (
//                           <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                             <div className="max-h-[220px] overflow-y-auto custom-scrollbar-professional p-2 space-y-1 bg-white">
//                               {masterEducations.filter(m => 
//                                 (m.name || "").toLowerCase().includes(eduSearch.toLowerCase())
//                               ).length > 0 ? (
//                                 masterEducations
//                                   .filter(m => (m.name || "").toLowerCase().includes(eduSearch.toLowerCase()))
//                                   .slice(0, 20)
//                                   .map((m) => (
//                                     <button
//                                       key={m.id}
//                                       type="button"
//                                       onClick={() => {
//                                         setNewEdu({ ...newEdu, education_id: m.id, education_name: m.name });
//                                         setEduSearch(m.name);
//                                         setEduDropdownOpen(false);
//                                       }}
//                                       className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/item ${
//                                         newEdu.education_id === m.id 
//                                           ? "bg-blue-600 text-white" 
//                                           : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
//                                       }`}
//                                     >
//                                       <span className="uppercase tracking-tight">{m.name}</span>
//                                       {newEdu.education_id === m.id ? (
//                                         <CheckCircle size={14} className="text-white" />
//                                       ) : (
//                                         <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
//                                       )}
//                                     </button>
//                                   ))
//                               ) : (
//                                 <div className="py-8 text-center bg-slate-50/50 rounded-xl">
//                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching degree nodes</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
            
//                       <FormField label="Institution Name">
//                         <input 
//                           placeholder="e.g. Mumbai University" 
//                           value={newEdu.institution_name} 
//                           onChange={(e) => setNewEdu({ ...newEdu, institution_name: e.target.value })} 
//                           className={inputStyle} 
//                         />
//                       </FormField>
//                     </div>
            
//                     <div className="grid grid-cols-2 gap-8">
//               {/* START YEAR NODE */}
//               <FormField label="Commencement Year">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                     <Calendar size={16} />
//                   </div>
//                   <input 
//                     type="number" 
//                     placeholder="YYYY" 
//                     min="1970"
//                     max="2030"
//                     value={newEdu.start_year} 
//                     onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} 
//                     className={inputStyle + " pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} 
//                   />
//                 </div>
//               </FormField>
            
//               {/* END YEAR NODE */}
//               <FormField label="Completion Year">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                     <Calendar size={16} />
//                   </div>
//                   <input 
//                     type="number" 
//                     placeholder="YYYY" 
//                     min="1970"
//                     max="2030"
//                     value={newEdu.end_year} 
//                     onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })} 
//                     className={inputStyle + " pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} 
//                   />
//                 </div>
//               </FormField>
//             </div>
            
//                     <div className="flex justify-end pt-6 border-t border-slate-100">
//                       <button
//                         type="button"
//                         onClick={handleSaveEducation}
//                         className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3 hover:bg-blue-600"
//                       >
//                         <CheckCircle size={18} /> {isEditingEdu ? "Update" : "Synchronize Node"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//               </div>
//             )}

//             {step === 4 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 {/* STATUS SELECTOR CARD */}
//                 <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
//                   <Fingerprint className="absolute -right-6 -bottom-6 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none" size={100} />
//                   <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
//                     <div className="flex items-center gap-4 text-slate-900 font-black">
//                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
//                         <Briefcase size={22} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h3 className="text-sm uppercase tracking-[0.15em]">Are you Fresher?</h3>
//                         <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Career status determines validation protocol</p>
//                       </div>
//                     </div>
//                     <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//                       <button
//                         type="button"
//                         disabled={hasExistingExperience}
//                         onClick={() => {
//                           if (hasExistingExperience) return;
//                           setIsFresher(true);
//                           setFormData({ ...formData, experiences: [] });
//                         }}
//                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
//                       >YES</button>
//                       <button
//                         type="button"
//                         onClick={() => setIsFresher(false)}
//                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
//                       >NO</button>
//                     </div>
//                   </div>
//                 </div>
            
//                 {/* EXPERIENCE TIMELINE DISPLAY */}
//                 {isFresher === false && (
//                   <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
//                     <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
//                       <div className="flex items-center gap-4">
//                         <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                           <History size={20} />
//                         </div>
//                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Job Experience History</h3>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (newExperiences.length === 0) {
//                             setNewExperiences([{ company_name: "", job_title: "", department: "", start_date: "", end_date: "", previous_ctc: "", location: "", description: "" }]);
//                           }
//                           setShowExpModal(true);
//                         }}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
//                       >
//                         <Plus size={14} strokeWidth={3} /> Add Experience
//                       </button>
//                     </div>
            
//                     {/* VERIFIED DATA LIST (Shows existing records from formData) */}
                  
//                     <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               {formData.experiences && formData.experiences.length > 0 ? (
//                 formData.experiences.map((exp, i) => (
//                   <div 
//                     key={i} 
//                     className="group relative flex flex-col md:flex-row items-stretch gap-0 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
//                   >
//                     {/* SIDE BRANDING BAR: Denotes 'Verified Node' status */}
//                     <div className="w-1.5 bg-blue-600 group-hover:w-2 transition-all duration-300" />
            
//                     {/* INDEX NODE: Terminal Style */}
//                     <div className="flex items-center justify-center px-6 bg-slate-50/50 border-r border-slate-100">
//                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 transition-colors">
//                         <span className="text-[10px] font-black text-slate-400 leading-none uppercase tracking-tighter">exp</span>
//                         <span className="text-sm font-black text-slate-900 leading-none mt-1">0{i + 1}</span>
//                       </div>
//                     </div>
            
//                     {/* MAIN CONTENT STRIP */}
//                     <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
//                       <div className="min-w-0 space-y-2">
//                         {/* Entity & Role */}
//                         <div className="flex items-center gap-3">
//                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-blue-600 transition-colors">
//                             {exp.company_name || "Unidentified Entity"}
//                           </h4>
//                           <div className="h-1 w-1 rounded-full bg-slate-300" />
//                           <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
//                             {exp.job_title || "Role Pending"}
//                           </div>
//                         </div>
            
//                         {/* Deployment Meta-Data */}
//                         <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <Calendar size={13} className="text-slate-300" />
//                             <span className="text-[10px] font-bold uppercase tracking-widest">
//                               {exp.start_date || "----"} <span className="text-slate-200 mx-1">—</span> {exp.end_date || "Present"}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <MapPin size={13} className="text-slate-300" />
//                             <span className="text-[10px] font-bold uppercase tracking-widest">{exp.location || "Global Node"}</span>
//                           </div>
//                         </div>
//                       </div>
            
//                       {/* FINANCIAL NODE: High Contrast Badge */}
//                       <div className="flex items-center gap-6">
//                         <div className="flex flex-col items-end border-r border-slate-100 pr-6">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Previous CTC</span>
//                           <div className="flex items-center gap-1.5 text-emerald-600">
//                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                             <span className="text-[12px] font-black uppercase tracking-tight">
//                               ₹{exp.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "0.00"}
//                             </span>
//                           </div>
//                         </div>
            
//                         {/* ACTION INTERFACE */}
//                         <div className="flex items-center gap-2">
//                           <button 
//                             type="button" 
                            
//             onClick={() => {
//               const existing = formData.experiences[i];
            
//               setCurrentEditingIndex(i);
            
//               setNewExperiences([
//                 {
//                   ...existing,
//                   uploadMode: existing.exp_letter_link ? "link" : "file",
//                   expLetterFile: null, // important
//                 },
//               ]);
            
//               setShowExpModal(true);
//             }}
            
            
            
//                             className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 border border-slate-100 active:scale-90"
//                           >
//                             <Edit3 size={16} strokeWidth={2.5} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
            
//                     {/* Decorative Watermark for Enterprise Feel */}
//                     <History className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.02] -rotate-12 pointer-events-none group-hover:opacity-[0.05] transition-opacity" size={100} />
//                   </div>
//                 ))
//               ) : (
//                 /* EMPTY STATE: Audit-Empty Pattern */
//                 <div className="relative group flex flex-col items-center justify-center py-20 bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-[2.5rem] transition-colors hover:bg-slate-50">
//                   <div className="relative z-10 flex flex-col items-center">
//                     <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-200 mb-6 group-hover:scale-110 transition-transform duration-500">
//                       <Database size={32} strokeWidth={1.5} />
//                     </div>
//                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
//                       Zero Nodes Synchronized
//                     </h4>
//                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center max-w-xs">
//                       Professional history registry currently empty. Initialize a new experience node to begin.
//                     </p>
//                   </div>
//                   <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
//                      <ShieldCheck className="absolute -right-8 -bottom-8 text-slate-900 opacity-[0.02] -rotate-12" size={200} />
//                   </div>
//                 </div>
//               )}
//             </div>
//                   </div>
//                 )}
            
//                 {/* NAVIGATION */}
//                 <div className="flex justify-between pt-6">
//                   <button type="button" onClick={() => setStep(3)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm transition-all hover:text-slate-900">← Back</button>
//                   <button
//                     type="button"
//                     onClick={async () => { await saveStepData(4); setStep(5); }}
//                     disabled={isFresher === null}
//                     className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-200" : "bg-slate-200 text-slate-300 cursor-not-allowed"}`}
//                   >Commit & Continue →</button>
//                 </div>
            
//                 {/* MODAL: ADDING NEW RECORDS ONLY (Upload Logic Removed) */}
               
//                 {showExpModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
//                 <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                  
//                   {/* Modal Header */}
//                   <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//                         <Plus size={28} strokeWidth={3} />
//                       </div>
//                       <div>
//                         {/* <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">New Experience</h2> */}
//                         <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">
//                             {currentEditingIndex !== null ? "Edit Experience" : "New Experience"}
//                         </h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add new Experience Records</p>
//                       </div>
//                     </div>
//                     <button onClick={() => setShowExpModal(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
//                       <X size={24} />
//                     </button>
//                   </div>
            
//                   {/* Modal Content */}
//                   <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar-professional bg-white">
//                     {newExperiences.map((exp, i) => (
//                       <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-8 rounded-[2.5rem] space-y-8 animate-in slide-in-from-bottom-4 group hover:bg-white hover:border-blue-200 transition-all">
//                         {/* Remove Entry */}
//                         <button
//                           type="button"
//                           onClick={() => setNewExperiences(newExperiences.filter((_, idx) => idx !== i))}
//                           className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-red-500 hover:text-white"
//                         >
//                           <Trash2 size={18} />
//                         </button>
            
//                         {/* GRID 1: IDENTITY */}
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                           <FormField label="Employer">
//                             <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...newExperiences]; u[i].company_name = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Designation">
//                             <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...newExperiences]; u[i].job_title = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Location">
//                             <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...newExperiences]; u[i].location = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
           
            
//             <FormField label="Industry">
//               <div className="relative">
//                 {/* INPUT BOX */}
//                 <input
//                   value={exp.industry_name || ""} // Use name for display
//                   placeholder="Search industry..."
//                   onFocus={() => setShowIndustryDrop(true)}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setIndustrySearch(value);
//                     const u = [...newExperiences];
//                     u[i].industry_name = value; // Temporary display
//                     setNewExperiences(u);
//                   }}
//                   className={inputStyle}
//                 />
            
//                 {/* DROPDOWN */}
//                 {showIndustryDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//                     <div className="max-h-44 overflow-y-auto custom-scrollbar-professional">
//                       {masterIndustries
//                         .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
//                         .length > 0 ? (
//                         masterIndustries
//                           .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
//                           .map((ind) => (
//                             <div
//                               key={ind.id}
//                               onClick={() => {
//                                 const u = [...newExperiences];
//                                 u[i].industry_id = ind.id; // ✅ Store the ID for API
//                                 u[i].industry_name = ind.name; // Store name for UI display
//                                 setNewExperiences(u);
//                                 setIndustrySearch("");
//                                 setShowIndustryDrop(false);
//                               }}
//                               className="px-4 py-2.5 text-[11px] font-black text-slate-700 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors uppercase tracking-tight flex justify-between items-center"
//                             >
//                               {ind.name}
//                               {exp.industry_id === ind.id && <Check size={14} />}
//                             </div>
//                           ))
//                       ) : (
//                         <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase italic">
//                           No matching industry 
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </FormField>
            
            
//                         </div>
            
//                         {/* GRID 2: TIMELINE & CTC */}
//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                           <FormField label="Department">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Layers size={16} />
//                   </div>
//                   <select
//                     value={exp.department || ""}
//                     onChange={(e) => {
//                       const u = [...newExperiences];
//                       u[i].department = e.target.value;
//                       setNewExperiences(u);
//                     }}
//                     className={inputStyle + " pl-12 appearance-none"}
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept.id} value={dept.name}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </FormField>
//                           <FormField label="Start Date">
//                             <input type="date" value={exp.start_date} onChange={(e) => { const u = [...newExperiences]; u[i].start_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="End Date">
//                             <input type="date" value={exp.end_date} onChange={(e) => { const u = [...newExperiences]; u[i].end_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Annual CTC">
//                             <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all">
//                               <div className="px-4 text-blue-600 font-black italic">₹</div>
//                               <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...newExperiences]; u[i].previous_ctc = e.target.value; setNewExperiences(u); }} className="w-full py-3 bg-transparent text-[12px] font-bold outline-none" />
//                               <div className="pr-4 text-[9px] font-black text-slate-400">LPA</div>
//                             </div>
//                           </FormField>
//                         </div>
            
//                         {/* GRID 3: DESCRIPTION & ARTIFACT UPLOAD */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                           <FormField label="Professional Summary">
//                             <textarea rows={4} placeholder="Briefly describe your role..." value={exp.description} onChange={(e) => { const u = [...newExperiences]; u[i].description = e.target.value; setNewExperiences(u); }} className={inputStyle + " resize-none"} />
//                           </FormField>
                          
//                           <div className="space-y-4">
//                             <div className="flex justify-between items-center px-1">
//                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experience Letter</p>
//                               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 scale-90">
//                                 <button
//                                   type="button"
//                                   onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "file"; setNewExperiences(u); }}
//                                   className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode !== "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                                 >FILE</button>
//                                 <button
//                                   type="button"
//                                   onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "link"; setNewExperiences(u); }}
//                                   className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                                 >URL</button>
//                               </div>
//                             </div>
            
//                             <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 min-h-[140px] flex flex-col justify-center items-center group/upload hover:bg-blue-50/30 transition-all">
//                               {exp.uploadMode !== "link" ? (
//                                 <label className="flex flex-col items-center cursor-pointer w-full">
//                                   <FileUp size={24} className="text-slate-300 group-hover/upload:text-blue-500 mb-2 transition-colors" />
//                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">
//                                     {exp.expLetterFile ? exp.expLetterFile.name : "Select PDF"}
//                                   </span>
//                                   <input 
//                                     type="file" 
//                                     accept=".pdf" 
//                                     className="hidden" 
//                                     onChange={(e) => { const u = [...newExperiences]; u[i].expLetterFile = e.target.files[0]; setNewExperiences(u); }} 
//                                   />
//                                 </label>
//                               ) : (
//                                 <div className="w-full px-4 relative">
//                                   <LinkIcon size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
//                                   <input 
//                                     placeholder="Public Storage URI (https://...)" 
//                                     value={exp.exp_letter_link || ""} 
//                                     onChange={(e) => { const u = [...newExperiences]; u[i].exp_letter_link = e.target.value; setNewExperiences(u); }} 
//                                     className={inputStyle + " pl-12"} 
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
            
//                         {/* SAVE ACTION */}
//                         <div className="flex justify-end pt-4 border-t border-slate-100">
//                           <button
//                             type="button"
//                             // onClick={() => handleSaveExperienceAPI(i)} 
//                             onClick={() => handleSaveOrUpdateExperience(i)}
//                             className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
//                           >
//                             {/* <CheckCircle size={16} /> Save */}
//                             <CheckCircle size={16} />
//             {currentEditingIndex !== null ? "Update" : "Save"}
            
//                           </button>
//                         </div>
//                       </div>
//                     ))}
            
                   
//                     {currentEditingIndex === null && (
//               <button
//                 type="button"
//                 onClick={() =>
//                   setNewExperiences([
//                     ...newExperiences,
//                     {
//                       company_name: "",
//                       job_title: "",
//                       start_date: "",
//                       end_date: "",
//                       previous_ctc: "",
//                       location: "",
//                       description: "",
//                       industry: "",
//                       uploadMode: "file",
//                       expLetterFile: null,
//                       exp_letter_link: "",
//                       candidate_id: effectiveId,
//                     },
//                   ])
//                 }
//                 className="w-full py-8 border-2 border-dashed border-slate-400 rounded-[2.5rem] text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/20 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
//               >
//                 + Add New Row
//               </button>
//             )}
            
//                   </div>
            
//                   {/* Modal Footer */}
                 
//                 </div>
//               </div>
//             )} 
//               </div>
//             )}

//                {step === 5 && (
//                           <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible">
//                             <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl overflow-visible shadow-slate-200/50">
//                               <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
//                                 <div className="flex items-center gap-4">
//                                   <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                                     <Cpu size={20} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
//                                       Skills & Assets
//                                     </h3>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="p-8 md:p-12 space-y-12 overflow-visible">
//                                 <FormField label="Skills">
//                                   <div className="space-y-6">
//                                     <div className="flex flex-col sm:flex-row gap-4 items-end">
//                                       <div className="relative max-w-md w-full">
//                                         <Plus
//                                           size={16}
//                                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                                         />
//                                         <input
//                                           value={skillInput}
//                                           onChange={(e) => setSkillInput(e.target.value)}
//                                           onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                               e.preventDefault();
//                                               const name = skillInput.trim();
//                                               if (!name) return;
            
//                                               // prevent duplicate
//                                               if (!formData.skills.includes(name)) {
//                                                 setFormData((prev) => ({
//                                                   ...prev,
//                                                   skills: [...prev.skills, name],
//                                                 }));
//                                               }
            
//                                               setSkillInput("");
//                                             }
//                                           }}
//                                           placeholder="Enter skill..."
//                                           className={inputStyle + " pl-12"}
//                                         />
//                                       </div>
//                                     </div>
            
//                                     <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
//                                       {[
//                                         ...new Set([...dynamicSkills, ...formData.skills]),
//                                       ].map((skill) => {
//                                         const isSelected = formData.skills.includes(skill);
            
//                                         return (
//                                           <button
//                                             key={skill}
//                                             type="button"
//                                             onClick={() =>
//                                               setFormData({
//                                                 ...formData,
//                                                 skills: isSelected
//                                                   ? formData.skills.filter(
//                                                       (s) => s !== skill,
//                                                     )
//                                                   : [...formData.skills, skill],
//                                               })
//                                             }
//                                             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${
//                                               isSelected
//                                                 ? "bg-white border-blue-500 border-[1px] text-black shadow-lg shadow-blue-200"
//                                                 : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
//                                             }`}
//                                           >
//                                             {skill}
//                                             {isSelected && (
//                                               <Check size={14} strokeWidth={3} />
//                                             )}
//                                           </button>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 </FormField>
//                                 {/* <FormField label="Enterprise Hardware Matrix"><div className="space-y-6 pt-8 border-t border-slate-100"><div className="relative max-w-md w-full"><Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={assetInput} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={async (e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) { const ok = await handleAddAssetAPI(v); if(ok) { setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); } } } }} placeholder="Link hardware..." className={inputStyle + " pl-12"} /></div><div className="flex flex-wrap gap-3 p-1">{dynamicAssets.map((asset) => { const isSelected = formData.assets.includes(asset); return (<button key={asset} type="button" onClick={async () => { if(!isSelected) { const ok = await handleAddAssetAPI(asset); if(ok) setFormData({...formData, assets: [...formData.assets, asset]}); } else { setFormData({...formData, assets: formData.assets.filter(a => a !== asset)}); } }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${isSelected ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}>{asset} {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}</button>); })}</div></div></FormField> */}
//                                 <div className="space-y-6 pt-8 border-t border-slate-100">
//                                   <FormField label="Assets">
//                                     <div className="space-y-6">
//                                       {/* Search & Manual Add Input */}
//                                       <div className="relative max-w-md">
//                                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                                           <Layers size={16} />
//                                         </div>
//                                         <input
//                                           value={assetInput}
//                                           onChange={(e) => setAssetInput(e.target.value)}
                                          
//                                           onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                               e.preventDefault();
//                                               const v = assetInput.trim();
//                                               if (!v) return;
            
//                                               // Prevent duplicate
//                                               if (!formData.assets.includes(v)) {
//                                                 setFormData((prev) => ({
//                                                   ...prev,
//                                                   assets: [...prev.assets, v],
//                                                 }));
//                                               }
            
//                                               setAssetInput("");
//                                             }
//                                           }}
//                                           placeholder="Type Assets name and press Enter..."
//                                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//                                         />
//                                       </div>
            
//                                       <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
//                                         {[
//                                           ...new Set([
//                                             ...dynamicAssets,
//                                             ...formData.assets,
//                                           ]),
//                                         ].filter(
//                                           (a) => typeof a === "string" && a.trim() !== "",
//                                         ).length === 0 ? (
//                                           /* ❌ NO ASSETS */
//                                           <div className="w-full text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
//                                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                               No assets available
//                                             </p>
//                                           </div>
//                                         ) : (
//                                           /* ✅ ASSET CHIPS */
//                                           [
//                                             ...new Set([
//                                               ...dynamicAssets,
//                                               ...formData.assets,
//                                             ]),
//                                           ]
//                                             .filter(
//                                               (a) =>
//                                                 typeof a === "string" && a.trim() !== "",
//                                             )
//                                             .map((asset) => {
//                                               const isSelected =
//                                                 formData.assets.includes(asset);
            
//                                               return (
//                                                 <button
//                                                   key={asset}
//                                                   type="button"
//                                                   onClick={() =>
//                                                     setFormData((prev) => ({
//                                                       ...prev,
//                                                       assets: isSelected
//                                                         ? prev.assets.filter(
//                                                             (a) => a !== asset,
//                                                           )
//                                                         : [...prev.assets, asset],
//                                                     }))
//                                                   }
//                                                   className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90
//                         ${
//                           isSelected
//                             ? "bg-white border-blue-500 text-black border-[1px] shadow-lg shadow-blue-200"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
//                         }`}
//                                                 >
//                                                   {asset}
//                                                   {isSelected && (
//                                                     <Check size={14} strokeWidth={3} />
//                                                   )}
//                                                 </button>
//                                               );
//                                             })
//                                         )}
//                                       </div>
//                                     </div>
//                                   </FormField>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex justify-between items-center pt-4">
//                               <button
//                                 onClick={() => setStep(4)}
//                                 type="button"
//                                 className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase transition-all shadow-sm hover:text-slate-900 flex items-center gap-2 transition-all"
//                               >
//                                 <ChevronLeft size={16} /> Back
//                               </button>
            
//                               <button
//                                 onClick={async () => {
//                                   await saveStepData(5);
//                                   setStep(6);
//                                 }}
//                                 type="button"
//                                 className="px-12 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
//                               >
//                                 Next Phase <ChevronRight size={14} />
//                               </button>
//                             </div>
//                           </div>
//                         )}


//                         {/* {step === 6 && (
//                           <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
//                             <div className="bg-white rounded-[2.5rem] border border-slate-200  overflow-hidden relative">
//                               <div className=" px-10 py-8  flex items-center justify-between">
//                                 <div className="flex items-center gap-5">
//                                   <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
//                                     <ShieldCheck size={28} strokeWidth={2.5} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-xl font-black text-black tracking-tight uppercase">Document</h3>
//                                     <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] mt-1">Resume & Certificate Upload</p>
//                                   </div>
//                                 </div>
//                               </div>
                        
//                               <div className="p-10 space-y-12">
                            
//                                 <div className="space-y-6">
//                                   <div className="flex items-center gap-3 px-2">
//                                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">01. Resume</h3>
//                                   </div>
//                                   {existingResume ? (
//                                     <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
//                                       <div className="flex items-center gap-5">
//                                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm"><CheckCircle size={24} /></div>
//                                         <div>
//                                           <p className="text-[11px] font-black text-blue-700 uppercase">Resume Submited</p>
//                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Uploaded</p>
//                                         </div>
//                                       </div>
//                                       <a href={fixResumeUrl2(existingResume)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
//                                         <Eye size={14} /> Preview
//                                       </a>
//                                     </div>
//                                   ) : (
//                                      <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50 flex flex-col items-center gap-3">
//                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active</p>
//                                         <button type="button" onClick={() => setResumeMode("file")} className="text-[10px] font-black text-blue-600 uppercase underline">Upload Master CV</button>
//                                      </div>
//                                   )}
//                                 </div>
                        
                             
//                                 <div className="space-y-6">
//                                   <div className="flex items-center justify-between px-2">
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">02. Uploaded Certificates</h3>
//                                     </div>
//                                     <button 
//                                       type="button"
//                                       onClick={() => { setEditingCertificate(null); setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); setShowCertEditModal(true); }}
//                                       className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
//                                     >
//                                       <PlusCircle size={14} /> Add Certificate
//                                     </button>
//                                   </div>
                        
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
//                                     {existingCertificates.map((cert) => (
//                                       <div key={cert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 transition-all shadow-sm">
//                                         <div className="flex items-center gap-4">
//                                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
//                                           <div className="min-w-0">
//                                             <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{cert.name}</p>
//                                             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mt-0.5">Verified</p>
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                            <a href={fixResumeUrl2(cert.file_path)} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
//                                            <button type="button" onClick={() => { setEditingCertificate(cert); setCertForm({ name: cert.name, uploadMode: "file", certificate_file: null, certificate_link: "" }); setShowCertEditModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
//                                         </div>
//                                       </div>
//                                     ))}
                        
                              
//                                     {formData.certificateFiles.map((file, idx) => (
//                                        <div key={`pending-${idx}`} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-2xl animate-pulse">
//                                           <div className="flex items-center gap-4">
//                                             <div className="p-3 bg-blue-600 text-white rounded-xl"><FileText size={20} /></div>
//                                             <div>
//                                               <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{formData.certificateNames[idx]}</p>
//                                               <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">Pending Sync</p>
//                                             </div>
//                                           </div>
//                                           <button type="button" onClick={() => {
//                                             const newFiles = [...formData.certificateFiles]; newFiles.splice(idx, 1);
//                                             const newNames = [...formData.certificateNames]; newNames.splice(idx, 1);
//                                             setFormData({...formData, certificateFiles: newFiles, certificateNames: newNames});
//                                           }} className="text-slate-300 hover:text-rose-500 transition-colors px-2"><Trash2 size={16}/></button>
//                                        </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
                        
                            
//                               <div className="p-10  flex flex-col md:flex-row items-center justify-between gap-6">
//                                 <div className="flex items-center gap-4">
                                
//                             <div className="flex justify-center pb-10">
//                               <button
//                                 type="button"
//                                 onClick={() => setStep(5)}
//                                 className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//                               >
//                                 <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//                                 Return to Assets & Skills
//                               </button>
//                             </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={async () => {
//                                     setLoading(true);
//                                     await saveStepData(6);
//                                     setLoading(false);
//                                     toast.success("Final Registry Sync Complete ✔");
//                                     navigate("/candidate");
//                                   }}
//                                   className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
//                                 >
//                                   {loading ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> <span>Submit & Close </span></>}
//                                 </button>
//                               </div>
//                             </div>
                           
//                           </div>
//                         )} */}

//                        {step === 6 && (
//                           <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
//                             <div className="bg-white rounded-[2.5rem] border border-slate-200  overflow-hidden relative">
//                               <div className=" px-10 py-8  flex items-center justify-between">
//                                 <div className="flex items-center gap-5">
//                                   <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
//                                     <ShieldCheck size={28} strokeWidth={2.5} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-xl font-black text-black tracking-tight uppercase">Document</h3>
//                                     <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] mt-1">Resume & Certificate Upload</p>
//                                   </div>
//                                 </div>
//                               </div>
                        
//                               <div className="p-10 space-y-12">
                                
//                                 <div className="space-y-6">
//                                   <div className="flex items-center gap-3 px-2">
//                                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">01. Resume</h3>
//                                   </div>
//                                   {existingResume ? (
//                                     <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
//                                       <div className="flex items-center gap-5">
//                                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm"><CheckCircle size={24} /></div>
//                                         <div>
//                                           <p className="text-[11px] font-black text-blue-700 uppercase">Resume Submited</p>
//                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Uploaded</p>
//                                         </div>
//                                       </div>
//                                       <a href={fixResumeUrl2(existingResume)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
//                                         <Eye size={14} /> Preview
//                                       </a>
//                                     </div>
//                                   ) : (
                                   

// <div className="relative group">
//               <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-blue-500 transition-all cursor-pointer overflow-hidden">
//                 <FileUp className="absolute -right-4 -bottom-4 text-slate-100 opacity-50 -rotate-12 pointer-events-none" size={100} />
                
//                 <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
//                   <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
//                     {loading ? <Loader2 className="animate-spin" size={24} /> : <FileUp size={24} strokeWidth={2.5} />}
//                   </div>
//                   <div className="text-center">
//                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//                       {loading ? "Uploading..." : "Upload Resume"}
//                     </p>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Upload the Document</p>
//                   </div>
//                 </div>

//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   accept=".pdf" 
//                   disabled={loading}
//                   onChange={(e) => handleResumeDirectUpload(e.target.files[0])} 
//                 />
//               </label>
//             </div>
//                                   )}
//                                 </div>
                        
                             
//                                 <div className="space-y-6">
//                                   <div className="flex items-center justify-between px-2">
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">02. Uploaded Certificates</h3>
//                                     </div>
//                                     <button 
//                                       type="button"
//                                       onClick={() => { setEditingCertificate(null); setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); setShowCertEditModal(true); }}
//                                       className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
//                                     >
//                                       <PlusCircle size={14} /> Add Certificate
//                                     </button>
//                                   </div>
                        
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
//                                     {existingCertificates.map((cert) => (
//                                       <div key={cert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 transition-all shadow-sm">
//                                         <div className="flex items-center gap-4">
//                                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
//                                           <div className="min-w-0">
//                                             <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{cert.name}</p>
//                                             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mt-0.5">Verified</p>
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                            <a href={fixResumeUrl2(cert.file_path)} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
//                                            <button type="button" onClick={() => { setEditingCertificate(cert); setCertForm({ name: cert.name, uploadMode: "file", certificate_file: null, certificate_link: "" }); setShowCertEditModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
//                                         </div>
//                                       </div>
//                                     ))}
                        
                                   
//                                     {formData.certificateFiles.map((file, idx) => (
//                                        <div key={`pending-${idx}`} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-2xl animate-pulse">
//                                           <div className="flex items-center gap-4">
//                                             <div className="p-3 bg-blue-600 text-white rounded-xl"><FileText size={20} /></div>
//                                             <div>
//                                               <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{formData.certificateNames[idx]}</p>
//                                               <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">Pending Sync</p>
//                                             </div>
//                                           </div>
//                                           <button type="button" onClick={() => {
//                                             const newFiles = [...formData.certificateFiles]; newFiles.splice(idx, 1);
//                                             const newNames = [...formData.certificateNames]; newNames.splice(idx, 1);
//                                             setFormData({...formData, certificateFiles: newFiles, certificateNames: newNames});
//                                           }} className="text-slate-300 hover:text-rose-500 transition-colors px-2"><Trash2 size={16}/></button>
//                                        </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
                        
                           
//                               <div className="p-10  flex flex-col md:flex-row items-center justify-between gap-6">
//                                 <div className="flex items-center gap-4">
                              
//                             <div className="flex justify-center pb-10">
//                               <button
//                                 type="button"
//                                 onClick={() => setStep(5)}
//                                 className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//                               >
//                                 <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//                                 Return to Assets & Skills
//                               </button>
//                             </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={async () => {
//                                     setLoading(true);
//                                     await saveStepData(6);
//                                     setLoading(false);
//                                     toast.success("Final Registry Sync Complete ✔");
//                                     navigate("/candidate");
//                                   }}
//                                   className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
//                                 >
//                                   {loading ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> <span>Submit & Close </span></>}
//                                 </button>
//                               </div>
//                             </div>
                           
//                           </div>
//                         )} 

//           </div>
//         </form>
//       </div>

//       {/* CERTIFICATE TERMINAL (ADD/EDIT MODAL) */}
//       {showCertEditModal && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setShowCertEditModal(false)}
//           />
//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header Protocol */}
//             <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
//                   {editingCertificate ? (
//                     <Edit3 size={22} />
//                   ) : (
//                     <PlusCircle size={22} />
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//                     {editingCertificate
//                       ? "Edit Certificate"
//                       : "New Certificate"}
//                   </h2>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     Certificate{" "}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowCertEditModal(false)}
//                 className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* Compulsory Name Input */}
//               <FormField label="Certificate Name" required>
//                 <input
//                   placeholder="e.g. Google Cloud Professional"
//                   value={certForm.name}
//                   onChange={(e) =>
//                     setCertForm({ ...certForm, name: e.target.value })
//                   }
//                   className={inputStyle}
//                 />
//               </FormField>

//               {/* Upload Mode Toggle */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Type Of Document
//                 </label>
//                 <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCertForm({ ...certForm, uploadMode: "file" })
//                     }
//                     className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "file" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//                   >
//                     PDF
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCertForm({ ...certForm, uploadMode: "link" })
//                     }
//                     className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//                   >
//                     URI
//                   </button>
//                 </div>
//               </div>

//               {/* Conditional Input Box */}
//               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                 {certForm.uploadMode === "file" ? (
//                   <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/30 hover:bg-white hover:border-emerald-500 transition-all group/up">
//                     <label className="cursor-pointer block">
//                       <FileUp
//                         className="mx-auto text-slate-300 group-hover/up:text-emerald-500 mb-3 transition-colors"
//                         size={32}
//                       />
//                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
//                         {certForm.certificate_file
//                           ? certForm.certificate_file.name
//                           : "Add Certificate PDF"}
//                       </span>
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) =>
//                           setCertForm({
//                             ...certForm,
//                             certificate_file: e.target.files[0],
//                           })
//                         }
//                       />
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <LinkIcon
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
//                       size={18}
//                     />
//                     <input
//                       placeholder="https://credential-verify.com/id..."
//                       value={certForm.certificate_link}
//                       onChange={(e) =>
//                         setCertForm({
//                           ...certForm,
//                           certificate_link: e.target.value,
//                         })
//                       }
//                       className={inputStyle + " pl-12 h-14"}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Commit Action */}
//               <button
//                 type="button"
//                 onClick={
//                   editingCertificate ? updateCertificate : handleAddCertificate
//                 }
//                 className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
//               >
//                 <Database size={16} />
//                 {editingCertificate
//                   ? "Certificate Update"
//                   : "Add New Certificate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `.custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }.custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }.custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }.custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }`,
//         }}
//       />
//     </div>
//   );
// };

// export default ManualEntry;

//*********************************************************************************************************** */
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Check,
//   Award,
//   Eye,
//   PlusCircle,
//   User,
//   ExternalLink,
//   Briefcase,
//   Fingerprint,
//   Calendar,
//   FileText,
//   CheckCircle,
//   Activity,
//   MapPin,
//   Loader2,
//   Plus,
//   Trash2,
//   Layers,
//   Cpu,
//   Database,
//   Globe,
//   ShieldCheck,
//   History,
//   X,
//   Edit3,
//   LinkIcon,
//   FileUp,
//   ChevronRight,
//   ChevronLeft,
//   ChevronDown,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";
// import { departmentService } from "../../services/department.service";

// const FormField = ({ label, required, error, children }) => (
//   <div className="space-y-1 w-full">
//     <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-start gap-1 items-center">
//       <span>{label}</span>
//       <span
//         className={`font-bold text-[15px] normal-case ${required ? "text-red-500" : "text-slate-300"}`}
//       >
//         {required ? "*" : ""}
//       </span>
//     </label>
//     {children}
//     {error && (
//       <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
//         {error}
//       </p>
//     )}
//   </div>
// );

// const ManualEntry = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const effectiveId = id || "666";
//   const ASSET_OPTIONS = [
//     "Laptop",
//     "Mouse",
//     "Keyboard",
//     "Monitor",
//     "Headset",
//     "Mobile",
//     "ID Card",
//     "SIM Card",
//   ];
//   // Professional Enterprise Input Style
//   const inputStyle =
//     "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";

//   // 1. INITIALIZE ALL STATES
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [resumeMode, setResumeMode] = useState("file");
//   const [skillInput, setSkillInput] = useState("");
//   const [assetInput, setAssetInput] = useState("");
//   const [isFresher, setIsFresher] = useState(null);
//   const [deptSearch, setDeptSearch] = useState("");
//   const [eduSearch, setEduSearch] = useState("");
//   const [dynamicSkills, setDynamicSkills] = useState([]);
//   const [existingResume, setExistingResume] = useState("");
//   const [industrySearch, setIndustrySearch] = useState("");
//   const [showIndustryDrop, setShowIndustryDrop] = useState(false);
//   const [dynamicAssets, setDynamicAssets] = useState([]);
//   const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [showAssetDrop, setShowAssetDrop] = useState(false);
//   const [skillFocused, setSkillFocused] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const dropdownContainerRef = useRef(null);
//   const [existingCertificates, setExistingCertificates] = useState([]);
//   const [editingCertId, setEditingCertId] = useState(null);
//   const [editingCertValue, setEditingCertValue] = useState("");
//   const [showExpModal, setShowExpModal] = useState(false);
//   const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
//   const [newExperiences, setNewExperiences] = useState([]);
//   const [masterIndustries, setMasterIndustries] = useState([]);
//   const [baseData, setBaseData] = useState({});

//   //**********************************certiificate and resume*********************************** */

//   const [docType, setDocType] = useState("resume");
//   // "resume" | "certificate"

//   const [showCertEditModal, setShowCertEditModal] = useState(false);
//   const [editingCertificate, setEditingCertificate] = useState(null);

//   const [certForm, setCertForm] = useState({
//     name: "",
//     certificate_file: null,
//     certificate_link: "",
//     uploadMode: "file", // file | link
//   });

//   //**********************************certiificate and resume end*********************************** */

//   //**********************************eduction*********************************** */

//   const [showEduModal, setShowEduModal] = useState(false);
//   const [masterEducations, setMasterEducations] = useState([]);
//   const [eduDropdownOpen, setEduDropdownOpen] = useState(false);
//   const [isEditingEdu, setIsEditingEdu] = useState(false);
//   const [currentEduId, setCurrentEduId] = useState(null);
//   const [newEdu, setNewEdu] = useState({
//     education_id: 0,
//     institution_name: "",
//     start_year: "",
//     end_year: "",
//     education_name: "", // For display in dropdown
//   });

//   //**********************************eduction  end*********************************** */
//   const careerStepRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     address2: "",
//     location: "",
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     country: "India",
//     position: "",
//     gender: "",
//     dob: "",
//     education: [],
//     experience: "",
//     about_me: "",
//     languages_spoken: [],
//     skills: [],
//     assets: [],
//     department: "",
//     cvFile: null,
//     resume_link: "",
//     certificateFiles: [],
//     certificateLinks: [""],
//     experiences: [],
//   });

//   const totalSteps = 6;

//   const educationOptions = [
//     "SSC / 10th",
//     "HSC / 12th",
//     "ITI",
//     "Diploma",
//     "Polytechnic",

//     "B.A",
//     "B.Com",
//     "B.Sc",
//     "BCA",
//     "BBA",
//     "B.Tech",
//     "BE",
//     "B.Pharm",
//     "B.Ed",

//     "M.A",
//     "M.Com",
//     "M.Sc",
//     "MCA",
//     "MBA",
//     "M.Tech",
//     "ME",
//     "M.Pharm",
//     "M.Ed",

//     "PGDM",
//     "Post Graduate Diploma",

//     "PhD / Doctorate",
//   ];

//   const POSITION_OPTIONS = [
//     // IT / Software
//     "Frontend Developer",
//     "Backend Developer",
//     "Full Stack Developer",
//     "Software Engineer",
//     "Senior Software Engineer",
//     "Lead Developer",
//     "DevOps Engineer",
//     "QA Engineer",
//     "Automation Tester",
//     "Manual Tester",
//     "UI/UX Designer",
//     "Mobile App Developer",
//     "Android Developer",
//     "iOS Developer",
//     "Data Analyst",
//     "Data Scientist",
//     "Machine Learning Engineer",
//     "AI Engineer",
//     "Cloud Engineer",
//     "System Administrator",
//     "Network Engineer",
//     "Cyber Security Analyst",

//     // Management / Office
//     "Project Manager",
//     "Product Manager",
//     "Operations Manager",
//     "Team Lead",
//     "Business Analyst",
//     "HR Executive",
//     "HR Manager",
//     "Recruiter",
//     "Office Administrator",

//     // Non-IT / General
//     "Accountant",
//     "Finance Executive",
//     "Sales Executive",
//     "Marketing Executive",
//     "Digital Marketing Specialist",
//     "Customer Support Executive",
//     "Technical Support Engineer",
//     "Field Executive",
//     "Supervisor",
//     "Store Manager",
//     "Warehouse Executive",

//     // Fresher / Entry
//     "Intern",
//     "Trainee",
//     "Graduate Engineer Trainee",
//     "Apprentice",
//   ];

//   const filteredEducation = educationOptions.filter((e) =>
//     e.toLowerCase().includes(eduSearch.toLowerCase()),
//   );
//   const filteredDepartments = departments.filter((d) =>
//     (d.name || "").toLowerCase().includes(deptSearch.toLowerCase()),
//   );
//   const isStep1Valid =
//     formData.name && /^\S+@\S+\.\S+$/.test(formData.email) && formData.phone;

//   // 2. HYDRATION LOGIC (GET API)
//   useEffect(() => {
//     hydrateNode();
//   }, [effectiveId]);

//   //    const hydrateNode = async () => {
//   //       setFetchingData(true);
//   //       try {
//   //         const response = await fetch(
//   //           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//   //         );
//   //         if (!response.ok) throw new Error();
//   //         const data = await response.json();

//   //         if (data) {
//   //           setExistingResume(data.resume_path || "");

//   //           setExistingCertificates(
//   //             Array.isArray(data.certificates) ? data.certificates : [],
//   //           );

//   //           const safeParse = (value) => {
//   //             if (!value) return [];

//   //             try {
//   //               // Already array → fix broken JSON pieces
//   //               if (Array.isArray(value)) {
//   //                 const joined = value.join("");
//   //                 if (joined.startsWith("[")) {
//   //                   return JSON.parse(joined);
//   //                 }
//   //                 return value;
//   //               }

//   //               // If string JSON
//   //               if (typeof value === "string" && value.startsWith("[")) {
//   //                 return JSON.parse(value);
//   //               }

//   //               // If CSV string → convert to array
//   //               if (typeof value === "string") {
//   //                 return value
//   //                   .split(",")
//   //                   .map((s) => s.trim())
//   //                   .filter(Boolean);
//   //               }

//   //               return [];
//   //             } catch {
//   //               return [];
//   //             }
//   //           };

//   //           setFormData((prev) => ({
//   //             ...prev,
//   //             name: data.full_name || "",
//   //             email: data.email || "",
//   //             phone: data.phone || "",
//   //             gender: data.gender || "",
//   //             dob: data.dob || "",
//   //             address: data.address || "",
//   //             address2: data.address2 || "",
//   //             location: data.location || "",
//   //             pincode: data.pincode || "",
//   //             city: data.city || "",
//   //             state: data.state || "",
//   //             district: data.district || "",
//   //             country: data.country || "India",
//   //             position: data.position || "",
//   //             experience: data.experience || "",
//   //            education: Array.isArray(data.educations)
//   //       ? data.educations.map(edu => ({
//   //           id: edu.id,
//   //           education_id: edu.education_id,
//   //           institution_name: edu.institution_name,
//   //           start_year: edu.start_year,
//   //           end_year: edu.end_year,
//   //           // Extract the name from education_master for the UI
//   //           education_name: edu.education_master?.name || "Unknown Degree"
//   //         }))
//   //       : [],

//   //             department: data.department || "",
//   //             about_me: data.about_me || "",
//   //             resume_link: data.resume_path || "",
//   //             languages_spoken: safeParse(data.languages_spoken),
//   //             experiences: data.experiences || [],
//   //             skills: safeParse(data.skills),
//   //             assets: safeParse(data.assets),
//   //           }));

//   //           setIsFresher(!data.experiences || data.experiences.length === 0);
//   //         }

//   //         const deptData = await departmentService.getAll();
//   //         setDepartments(deptData || []);
//   //         await fetchSkills();
//   //         await fetchAssets(effectiveId);
//   //       } catch (err) {
//   //         console.warn("Initializing Empty Node");
//   //       } finally {
//   //         setFetchingData(false);
//   //       }
//   //     };

//   const hydrateNode = async () => {
//     setFetchingData(true);
//     try {
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//       );
//       if (!response.ok) throw new Error();
//       const data = await response.json();

//       if (data) {
//         setExistingResume(data.resume_path || "");

//         setExistingCertificates(
//           Array.isArray(data.certificates) ? data.certificates : [],
//         );

//         const safeParse = (value) => {
//           if (!value) return [];
//           try {
//             if (Array.isArray(value)) {
//               const joined = value.join("");
//               if (joined.startsWith("[")) {
//                 return JSON.parse(joined);
//               }
//               return value;
//             }
//             if (typeof value === "string" && value.startsWith("[")) {
//               return JSON.parse(value);
//             }
//             if (typeof value === "string") {
//               return value
//                 .split(",")
//                 .map((s) => s.trim())
//                 .filter(Boolean);
//             }
//             return [];
//           } catch {
//             return [];
//           }
//         };

//         const mappedEducation = Array.isArray(data.educations)
//           ? data.educations.map((edu) => ({
//               id: edu.id,
//               education_id: edu.education_id,
//               institution_name: edu.institution_name,
//               start_year: edu.start_year,
//               end_year: edu.end_year,
//               education_name: edu.education_master?.name || "Unknown Degree",
//             }))
//           : [];

//         // Create a snapshot object for comparison
//         const serverSnapshot = {
//           name: data.full_name || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           gender: data.gender || "",
//           dob: data.dob || "",
//           address: data.address || "",
//           address2: data.address2 || "",
//           location: data.location || "",
//           pincode: data.pincode || "",
//           city: data.city || "",
//           state: data.state || "",
//           district: data.district || "",
//           country: data.country || "India",
//           position: data.position || "",
//           experience: data.experience || "",
//           education: mappedEducation,
//           department: data.department || "",
//           about_me: data.about_me || "",
//           resume_link: data.resume_path || "",
//           languages_spoken: safeParse(data.languages_spoken),
//           experiences: data.experiences || [],
//           skills: safeParse(data.skills),
//           assets: safeParse(data.assets),
//         };

//         // Set both current form and base reference
//         setFormData((prev) => ({ ...prev, ...serverSnapshot }));
//         setBaseData(serverSnapshot); // Ensure you have [baseData, setBaseData] = useState({})

//         setIsFresher(!data.experiences || data.experiences.length === 0);
//       }

//       const deptData = await departmentService.getAll();
//       setDepartments(deptData || []);
//       await fetchSkills();
//       await fetchAssets(effectiveId);
//     } catch (err) {
//       console.warn("Initializing Empty Node");
//     } finally {
//       setFetchingData(false);
//     }
//   };
//   const INDUSTRY_OPTIONS = [
//     "Information Technology",
//     "Software Development",
//     "Banking & Finance",
//     "Healthcare",
//     "Education",
//     "Manufacturing",
//     "Retail",
//     "Telecom",
//     "Construction",
//     "Logistics",
//     "Marketing & Advertising",
//     "HR / Recruitment",
//     "Government",
//     "Automobile",
//     "Pharmaceutical",
//     "E-Commerce",
//     "Media & Entertainment",
//     "Real Estate",
//     "Hospitality",
//     "Other",
//   ];

//   // Click Outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownContainerRef.current &&
//         !dropdownContainerRef.current.contains(event.target)
//       ) {
//         setShowSkillDrop(false);
//         setShowAssetDrop(false);
//         setSkillFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // READ STEP FROM URL (?step=3)
//   useEffect(() => {
//     const stepFromUrl = Number(searchParams.get("step"));

//     if (stepFromUrl && stepFromUrl >= 1 && stepFromUrl <= totalSteps) {
//       setStep(stepFromUrl);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     fetchMasterIndustries();
//   }, []);

//   // 3. HANDLERS
//   const fetchSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills",
//       );
//       const data = await res.json();
//       setDynamicSkills(data.map((item) => item.name || item));
//     } catch {}
//   };

//   const fetchAssets = async (cId) => {
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${cId}/assets`,
//       );
//       const data = await res.json();
//       setDynamicAssets(Array.isArray(data) ? data.map((a) => a.name) : []);
//     } catch {}
//   };

//   const handleManualAddSkill = async () => {
//     const name = skillInput.trim();
//     if (!name) {
//       await fetchSkills();
//       return;
//     }
//     const success = await handleCreateMaster("skills", name);
//     if (success) {
//       if (!formData.skills.includes(name))
//         setFormData((p) => ({ ...p, skills: [...p.skills, name] }));
//       setSkillInput("");
//       await fetchSkills();
//     }
//   };

//   const handleCreateMaster = async (type, name) => {
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/masters/${type}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: name.trim() }),
//         },
//       );
//       return res.ok;
//     } catch {
//       return false;
//     }
//   };

//   const handleAddAssetAPI = async (assetName) => {
//     if (!assetName.trim()) return;
//     const loadingToast = toast.loading(`Linking asset...`);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/assets`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: assetName.trim() }),
//         },
//       );
//       if (res.ok) {
//         toast.success("Linked", { id: loadingToast });
//         await fetchAssets(effectiveId);
//         return true;
//       }
//     } catch {
//       toast.error("Sync failed", { id: loadingToast });
//     }
//     return false;
//   };

//   const filteredIndustries = INDUSTRY_OPTIONS.filter((ind) =>
//     ind.toLowerCase().includes(industrySearch.toLowerCase()),
//   );

//   const handleSaveOrUpdateExperience = async (i) => {
//     const exp = newExperiences[i];

//     if (
//       !exp.company_name ||
//       !exp.job_title ||
//       !exp.start_date ||
//       !exp.end_date
//     ) {
//       toast.error("Company, Role, Start Date, End Date required");
//       return;
//     }

//     const loadingToast = toast.loading(
//       currentEditingIndex !== null
//         ? "Updating experience..."
//         : "Saving experience...",
//     );

//     try {
//       const fd = new FormData();

//       fd.append("company_name", exp.company_name);
//       fd.append("job_title", exp.job_title);
//       fd.append("start_date", exp.start_date);
//       fd.append("department", exp.department || "");
//       fd.append("end_date", exp.end_date);
//       fd.append("previous_ctc", exp.previous_ctc || "");
//       fd.append("location", exp.location || "");
//       fd.append("description", exp.description || "");
//       // fd.append("industry_id", exp.industry || "");
//       fd.append("industry_id", exp.industry_id || "");

//       if (exp.uploadMode === "link") {
//         fd.append("exp_letter_link", exp.exp_letter_link || "");
//       } else if (exp.expLetterFile instanceof File) {
//         fd.append("exp_letter_file", exp.expLetterFile);
//       }

//       // =========================
//       // UPDATE (PATCH)
//       // =========================
//       if (currentEditingIndex !== null && exp.id) {
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences/${exp.id}`,
//           {
//             method: "PUT",
//             body: fd,
//           },
//         );

//         if (!res.ok) throw new Error(await res.text());

//         // Update UI instantly
//         const updated = [...formData.experiences];
//         updated[currentEditingIndex] = exp;

//         setFormData((prev) => ({
//           ...prev,
//           experiences: updated,
//         }));

//         toast.success("Experience Updated ✅", { id: loadingToast });
//       }

//       // =========================
//       // ADD NEW (POST)
//       // =========================
//       else {
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/experiences`,
//           {
//             method: "POST",
//             body: fd,
//           },
//         );

//         if (!res.ok) throw new Error(await res.text());

//         await hydrateNode(); // reload from backend

//         toast.success("Experience Added ✅", { id: loadingToast });
//       }

//       setNewExperiences([]);
//       setCurrentEditingIndex(null);
//       setShowExpModal(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed ❌", { id: loadingToast });
//     }
//   };

//   const fetchMasterIndustries = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters?types=industries&skip=0&limit=100",
//       );
//       const data = await res.json();
//       // Assuming API returns { industries: [...] }
//       setMasterIndustries(data.industries || []);
//     } catch (err) {
//       console.error("Industry Load Error", err);
//     }
//   };

//   // Fetch Master Education List
//   const fetchMasterEducations = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters?types=educations&skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterEducations(data.educations || []);
//     } catch (err) {
//       console.error("Master Load Error", err);
//     }
//   };

//   // Save or Update Education
//   const handleSaveEducation = async () => {
//     const loadingToast = toast.loading(
//       isEditingEdu ? "Updating Node..." : "Syncing Education...",
//     );
//     const url = isEditingEdu
//       ? `https://apihrr.goelectronix.co.in/education/${currentEduId}?user_type=candidate`
//       : `https://apihrr.goelectronix.co.in/education/${effectiveId}?user_type=candidate`;

//     try {
//       const res = await fetch(url, {
//         method: isEditingEdu ? "PATCH" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           education_id: newEdu.education_id,
//           institution_name: newEdu.institution_name,
//           start_year: newEdu.start_year,
//           end_year: newEdu.end_year,
//         }),
//       });

//       if (res.ok) {
//         toast.success("Education Node Synchronized", { id: loadingToast });
//         setShowEduModal(false);
//         // Logic to refresh your formData.education from GET API here
//         // 🔥 REFRESH LOGIC: Trigger hydration to pull the updated 'educations' array
//         await hydrateNode();

//         // Reset Search state
//         setEduSearch("");
//       }
//     } catch (err) {
//       toast.error("Sync Failed", { id: loadingToast });
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (!/^\d{6}$/.test(pincode)) return;

//     setIsFetchingPincode(true);

//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();

//       if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
//         const postOffices = data[0].PostOffice;

//         setCityOptions(postOffices); // ⭐ store full objects

//         const first = postOffices[0];

//         setFormData((prev) => ({
//           ...prev,
//           city: first.Name || "",
//           district: first.District || "",
//           state: first.State || "",
//           country: first.Country || "India",
//         }));
//       } else {
//         setCityOptions([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setCityOptions([]);
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   // ---------- STEP VALIDATION ----------

//   const STEP_FIELDS = {
//     1: [
//       "name",
//       "email",
//       "phone",
//       "gender",
//       "dob",
//       "position",
//       "experience",
//       "education",
//       "department",
//       "about_me",
//       "languages_spoken",
//     ],

//     2: [
//       "address",
//       "address2",
//       "location",
//       "pincode",
//       "city",
//       "district",
//       "state",
//       "country",
//     ],

//     // ✅ NEW EDUCATION STEP
//     3: ["education"],

//     // ✅ EXPERIENCE SHIFTED TO 4
//     4: ["experiences"],

//     // ✅ SKILLS & ASSETS SHIFTED TO 5
//     5: ["skills", "assets"],

//     // ✅ DOCUMENTS SHIFTED TO 6
//     6: ["resume_link", "cvFile", "certificateFiles", "certificateLinks"],
//   };

//   // STEP 1 → Personal
//   const isStep1Incomplete = () => {
//     return !(
//       formData.name &&
//       formData.email &&
//       formData.phone &&
//       formData.gender &&
//       formData.dob &&
//       (formData.languages_spoken || []).length > 0 &&
//       formData.about_me
//     );
//   };

//   // STEP 2 → Location
//   const isStep2Incomplete = () => {
//     return !(
//       formData.address &&
//       formData.city &&
//       formData.state &&
//       formData.pincode
//     );
//   };

// //   // STEP 3 → Education
// //   const isStep3Incomplete = () => {
// //     return !(
// //       Array.isArray(formData.education) && formData.education.length > 0
// //     );
// //   };

// //   // STEP 4 → Experience
// //   const isStep4Incomplete = () => {
// //     if (isFresher) return false; // Fresher doesn't require experience

// //     return !(
// //       Array.isArray(formData.experiences) && formData.experiences.length > 0
// //     );
// //   };

// // Step 3 → Education Incompletion Logic
// const isStep3Incomplete = () => {
//   return !(Array.isArray(formData.education) && formData.education.length > 0);
// };

// // Step 4 → Experience Incompletion Logic (Respects isFresher)
// const isStep4Incomplete = () => {
//   if (isFresher) return false; // Fresher doesn't require experience records
//   return !(Array.isArray(formData.experiences) && formData.experiences.length > 0);
// };

//   // STEP 5 → Skills & Assets
// //   const isStep5Incomplete = () => {
// //     return !(
// //       (formData.skills && formData.skills.length > 0) ||
// //       (formData.assets && formData.assets.length > 0)
// //     );
// //   };

// const isStep5Incomplete = () => {
//   return (
//     (!formData.skills || formData.skills.length === 0) &&
//     (!formData.assets || formData.assets.length === 0)
//   );
// };

//   // STEP 6 → Documents
// //   const isStep6Incomplete = () => {
// //     return !(
// //       existingResume ||
// //       formData.cvFile ||
// //       (formData.certificateFiles && formData.certificateFiles.length > 0) ||
// //       (existingCertificates && existingCertificates.length > 0)
// //     );
// //   };

// // Step 6 Check: Yellow if no Resume AND no Certificates exist
// const isStep6Incomplete = () => {
//   const hasResume =  (formData.resume_link && formData.resume_link.trim() !== "") || formData.cvFile || existingResume;
//   const hasCertificates = (formData.certificateFiles && formData.certificateFiles.length > 0) || 
//                           (existingCertificates && existingCertificates.length > 0) ||
//                           (formData.certificateLinks && formData.certificateLinks.some(l => l.trim() !== ""));
                          
//   return !hasResume && !hasCertificates;
// };

//   const fixResumeUrl = (url) => {
//     if (!url) return "";

//     // remove wrong https//
//     let clean = url.replace(/^https\/\//, "");

//     // if already full valid http/https → keep it
//     if (clean.startsWith("http://") || clean.startsWith("https://")) {
//       return clean;
//     }

//     // attach correct base URL
//     return `https://apihrr.goelectronix.co.in/${clean.replace(/^\/+/, "")}`;
//   };

//   const fixResumeUrl2 = (url) => {
//     if (!url) return "";

//     let clean = url.trim();

//     // Fix broken https//
//     clean = clean.replace(/^https\/\//, "https://");

//     // 🔴 If URL is https://uploads/... → replace domain
//     if (clean.startsWith("https://uploads")) {
//       return clean.replace(
//         "https://uploads",
//         "https://apihrr.goelectronix.co.in/uploads",
//       );
//     }

//     // Already full valid URL → return
//     if (clean.startsWith("http://") || clean.startsWith("https://")) {
//       return clean;
//     }

//     // Remove starting slash
//     clean = clean.replace(/^\/+/, "");

//     // Attach backend base
//     return `https://apihrr.goelectronix.co.in/${clean}`;
//   };

//   const hasExistingExperience =
//     Array.isArray(formData.experiences) && formData.experiences.length > 0;

//   const saveStepData = async (stepNumber) => {
//     const fields = STEP_FIELDS[stepNumber] || [];

//     // --- 1. CHANGE DETECTION PROTOCOL ---
//     // Compares current formData against the baseData snapshot retrieved during hydration
//     const hasChanged = fields.some((key) => {
//       // Handling for Arrays (Languages, Skills, Assets, Education, Experiences)
//       if (Array.isArray(formData[key])) {
//         return JSON.stringify(formData[key]) !== JSON.stringify(baseData[key]);
//       }
//       // Handling for File objects (Resume/Certificates)
//       if (formData[key] instanceof File) return true;

//       // Standard primitive comparison (Strings/Numbers)
//       return (formData[key] || "") !== (baseData[key] || "");
//     });

//     // If no changes are detected, we bypass the API call and return true to allow navigation
//     if (!hasChanged) {
//       console.log(
//         `Step ${stepNumber}: No changes detected. Skipping network request.`,
//       );
//       return true;
//     }

//     try {
//       const apiData = new FormData();

//       // --- 2. DYNAMIC PAYLOAD CONSTRUCTION ---
//       fields.forEach((key) => {
//         // Group: CSV Serialization (Languages, Skills, Assets)
//         if (["languages_spoken", "skills", "assets"].includes(key)) {
//           apiData.append(key, (formData[key] || []).join(","));
//         }

//         // Group: JSON Serialization (Education, Experiences)
//         else if (key === "education") {
//           apiData.append(
//             "education_details",
//             JSON.stringify(formData.education || []),
//           );
//         } else if (key === "experiences") {
//           apiData.append(
//             "experience_details",
//             JSON.stringify(formData.experiences || []),
//           );
//         }

//         // Group: File/Link Handling (Master Resume - Step 6)
//         else if (key === "cvFile" && formData.cvFile) {
//           apiData.append("resumepdf", formData.cvFile);
//         } else if (key === "resume_link" && formData.resume_link) {
//           apiData.append("resume_link", formData.resume_link);
//         }

//         // Group: Certificate Batching (Step 6)
//         else if (key === "certificateFiles") {
//           formData.certificateFiles.forEach((file, idx) => {
//             apiData.append("certificate_files", file);
//             if (formData.certificateNames?.[idx]) {
//               apiData.append(
//                 "certificate_names",
//                 formData.certificateNames[idx],
//               );
//             }
//           });
//         }

//         // Group: Standard Strings (Name, Address, etc.)
//         else {
//           apiData.append(key, formData[key] ?? "");
//         }
//       });

//       // Special Case: Ensure full_name is always present as per API requirements
//       apiData.append("full_name", formData.name || "");

//       // --- 3. API EXECUTION ---
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//         {
//           method: "PATCH",
//           body: apiData,
//         },
//       );

//       if (response.ok) {
//         // --- 4. POST-SYNC CLEANUP ---
//         // Update the baseData snapshot to match current state so subsequent clicks don't re-trigger
//         const updatedFields = {};
//         fields.forEach((f) => {
//           updatedFields[f] = formData[f];
//         });
//         setBaseData((prev) => ({ ...prev, ...updatedFields }));

//         if (stepNumber === 6) {
//           setFormData((prev) => ({
//             ...prev,
//             certificateFiles: [],
//             certificateLinks: [""],
//           }));
//         }

//         toast.success(`Saved the updated code: Step ${stepNumber}`);
//         return true;
//       } else {
//         throw new Error("Registry update rejected");
//       }
//     } catch (err) {
//       console.error("Critical Sync Error:", err);
//       toast.error(`Step ${stepNumber} save failed`);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const loadingToast = toast.loading("Executing Final PATCH Sync...");

//     try {
//       const apiData = new FormData();

//       // 🔹 Append ALL simple fields (NO skipping empty)
//       for (const key in formData) {
//         if (
//           ![
//             "experiences",
//             "certificateFiles",
//             "languages_spoken",
//             "cvFile",
//             "skills",
//             "assets",
//           ].includes(key)
//         ) {
//           apiData.append(key, formData[key] ?? "");
//         }
//       }

//       // 🔹 Required backend fields
//       apiData.append("full_name", formData.name || "");

//       apiData.append(
//         "languages_spoken",
//         (formData.languages_spoken || []).join(","),
//       );

//       apiData.append("skills", (formData.skills || []).join(","));
//       apiData.append("assets", (formData.assets || []).join(","));

//       // CASE 1: Upload PDF
//       if (formData.cvFile) {
//         apiData.append("resumepdf", formData.cvFile); // ✅ correct key
//       }

//       // CASE 2: Resume Link
//       else if (formData.resume_link) {
//         apiData.append("resume_link", formData.resume_link); // ✅ correct key
//       }

//       // CASE 3: Keep existing resume (no change)
//       else if (existingResume) {
//         apiData.append("resume_link", existingResume);
//       }

//       // 🔹 Certificates FILES
//       formData.certificateFiles.forEach((file) => {
//         apiData.append("certificates", file);
//       });

//       // 🔹 Certificate LINKS
//       apiData.append(
//         "certificate_links",
//         JSON.stringify(formData.certificateLinks.filter((l) => l && l.trim())),
//       );

//       // 🔹 Debug — SEE WHAT GOES TO API
//       for (let pair of apiData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//         {
//           method: "PATCH",
//           body: apiData,
//         },
//       );

//       if (!response.ok) {
//         const err = await response.text();
//         console.error(err);
//         throw new Error("API Failed");
//       }

//       toast.success("Candidate Synchronized 🎉", { id: loadingToast });
//     } catch (err) {
//       console.error(err);
//       toast.error("Commit failed ❌", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCertificate = async () => {
//     // 1. Validation Logic
//     if (!certForm.name.trim())
//       return toast.error("Artifact Label is compulsory");

//     if (certForm.uploadMode === "file" && !certForm.certificate_file) {
//       return toast.error("Please select a PDF file");
//     }
//     if (certForm.uploadMode === "link" && !certForm.certificate_link) {
//       return toast.error("Please enter a URI link");
//     }

//     const loadingToast = toast.loading("Deploying new credential node...");

//     try {
//       const apiData = new FormData();

//       // ✅ Following Request Body from Image 1: name, certificate_file, certificate_link
//       apiData.append("name", certForm.name.trim());

//       if (certForm.uploadMode === "file") {
//         apiData.append("certificate_file", certForm.certificate_file);
//         // Backend expects either file or link; image shows link is optional if file is present
//       } else {
//         apiData.append("certificate_link", certForm.certificate_link.trim());
//       }

//       // ✅ Image 1 Endpoint: POST /{person_type}/{person_id}/certificates
//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates`,
//         {
//           method: "POST",
//           body: apiData,
//         },
//       );

//       if (response.ok) {
//         toast.success("Credential Registered 🎉", { id: loadingToast });

//         // Reset Modal State
//         setShowCertEditModal(false);
//         setCertForm({
//           name: "",
//           certificate_file: null,
//           certificate_link: "",
//           uploadMode: "file",
//         });

//         // 🔥 REFRESH UI
//         await hydrateNode();
//       } else {
//         const errorText = await response.text();
//         console.error("Registry Sync Error:", errorText);
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Deployment failed ❌", { id: loadingToast });
//     }
//   };

//   // --- UPDATE EXISTING CERTIFICATE (Direct PUT) ---
//   const updateCertificate = async () => {
//     if (!certForm.name.trim())
//       return toast.error("Artifact Label is compulsory");

//     const loadingToast = toast.loading("Updating Node Artifact...");
//     try {
//       const fd = new FormData();

//       // ✅ Following Request Body from Image 2
//       fd.append("name", certForm.name.trim());

//       if (certForm.uploadMode === "file" && certForm.certificate_file) {
//         fd.append("certificate_file", certForm.certificate_file);
//       } else if (certForm.uploadMode === "link" && certForm.certificate_link) {
//         fd.append("certificate_link", certForm.certificate_link.trim());
//       }

//       // ✅ Image 3 Parameters: /candidates/{person_id}/certificates/{certificate_id}
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${effectiveId}/certificates/${editingCertificate.id}`,
//         {
//           method: "PUT",
//           body: fd,
//         },
//       );

//       if (res.ok) {
//         toast.success("Artifact Updated ✅", { id: loadingToast });
//         setShowCertEditModal(false);

//         // Reset editing state
//         setEditingCertificate(null);

//         await hydrateNode();
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Sync Error ❌", { id: loadingToast });
//     }
//   };

//   const numberToIndianWords = (num) => {
//     if (!num || isNaN(num)) return "";

//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];

//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const twoDigits = (n) =>
//       n < 20
//         ? ones[n]
//         : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");

//     const threeDigits = (n) => {
//       if (n === 0) return "";
//       if (n < 100) return twoDigits(n);
//       return (
//         ones[Math.floor(n / 100)] +
//         " Hundred" +
//         (n % 100 ? " " + twoDigits(n % 100) : "")
//       );
//     };

//     const crore = Math.floor(num / 10000000);
//     const lakh = Math.floor((num % 10000000) / 100000);
//     const thousand = Math.floor((num % 100000) / 1000);
//     const hundred = num % 1000;

//     let result = "";

//     if (crore) result += twoDigits(crore) + " Crore ";
//     if (lakh) result += twoDigits(lakh) + " Lakh ";
//     if (thousand) result += twoDigits(thousand) + " Thousand ";
//     if (hundred) result += threeDigits(hundred);

//     return result.trim() + " per annum";
//   };

//   const today = new Date();

//   // 18 years ago (max allowed DOB)
//   const maxDate = new Date(
//     today.getFullYear() - 18,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .split("T")[0];

//   // 70 years ago (min allowed DOB)
//   const minDate = new Date(
//     today.getFullYear() - 70,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .split("T")[0];

//   const [dobError, setDobError] = useState("");

//   const handleDobChange = (value) => {
//     setFormData({ ...formData, dob: value });

//     if (!value) {
//       setDobError("Date of Birth is required");
//       return;
//     }

//     const selected = new Date(value);

//     if (selected > new Date(maxDate)) {
//       setDobError("Age must be at least 18 years");
//     } else if (selected < new Date(minDate)) {
//       setDobError("Age must be below 70 years");
//     } else {
//       setDobError("");
//     }
//   };

//   const handleResumeDirectUpload = async (file) => {
//   if (!file) return;
  
//   setLoading(true);
//   const syncToast = toast.loading("Executing Instant Registry Sync...");

//   try {
//     const apiData = new FormData();
//     apiData.append("resumepdf", file); // Ensure "resumepdf" matches backend key
//     apiData.append("full_name", formData.name); // Usually required by backend

//     const response = await fetch(
//       `https://apihrr.goelectronix.co.in/candidates/${effectiveId}`,
//       {
//         method: "PATCH",
//         body: apiData,
//       }
//     );

//     if (response.ok) {
//       toast.success("Document Verified & Live", { id: syncToast });
//       // 🔥 REFRESH UI: This will trigger hydrateNode and show the success block within 1sec
//       await hydrateNode(); 
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Protocol Rejection: Upload Failed", { id: syncToast });
//   } finally {
//     setLoading(false);
//   }
// };

// //  const calculateCompletion = () => {
// //   const fieldsToTrack = [
// //     // Step 1: Personal
// //     formData.name, formData.email, formData.phone, formData.gender, 
// //     formData.dob, formData.about_me, formData.languages_spoken?.length > 0,
// //     // Step 2: Location
// //     formData.address, formData.city, formData.state, formData.pincode,
// //     // Step 3: Education (New logic added here)
// //     formData.education?.length > 0,
// //     // Step 4: Experience
// //     isFresher || formData.experiences?.length > 0,
// //     // Step 5: Skills & Assets
// //     formData.skills?.length > 0 || formData.assets?.length > 0,
// //     // Step 6: Vault
// //     formData.cvFile || existingResume
// //   ];

// //   const filledFields = fieldsToTrack.filter(field => {
// //     if (Array.isArray(field)) return field.length > 0;
// //     if (typeof field === 'boolean') return field;
// //     return !!field; 
// //   }).length;

// //   return Math.round((filledFields / fieldsToTrack.length) * 100);
// // };

// const calculateCompletion = () => {
//   const auditMatrix = [
//     // Phase 01: Identity
//     !!formData.name, 
//     !!formData.email, 
//     !!formData.phone, 
//     !!formData.gender, 
//     !!formData.dob, 
//     !!formData.about_me, 
//     (formData.languages_spoken?.length > 0),

//     // Phase 02: Geolocation
//     !!formData.address, 
//     !!formData.city, 
//     !!formData.state, 
//     !!formData.pincode,

//     // Phase 03: Academic Nodes
//     (formData.education?.length > 0),

//     // Phase 04: Professional Timeline
//     // Protocol: If Fresher is active, this node is auto-verified.
//     (isFresher === true || formData.experiences?.length > 0),

//     // Phase 05: Technical Stack
//     (formData.skills?.length > 0 || formData.assets?.length > 0),

//     // Phase 06: Document Vault
//     !!(formData.cvFile || existingResume || formData.resume_link)
//   ];

//   const completedNodes = auditMatrix.filter(node => node === true).length;
//   const totalNodes = auditMatrix.length;

//   return Math.round((completedNodes / totalNodes) * 100);
// };

//   if (fetchingData)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//         <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
//         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
//           Loading Data Load {effectiveId}...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 antialiased">
//       <div className="max-w-6xl mx-auto space-y-8" ref={dropdownContainerRef}>
//         <div className="flex justify-start">
//         <button
//           onClick={() => navigate("/candidate")}
//           className="group flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//         >
//           <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//           Return to Candidate 
//         </button>
//       </div>
//         {/* ROADMAP HEADER */}
//         {/* <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//               <Database size={32} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//                 {id ? "Profile" : "Manual Registry"}
//               </h2>
//               <div className="flex items-center gap-2 mt-1 text-blue-600">
//                 <ShieldCheck size={14} />
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 max-w-2xl w-full px-4">
//             <div className="relative flex justify-between items-center w-full">
//               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//               <div
//                 className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//                 style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//               />
            

// {[1, 2, 3, 4, 5, 6].map((num) => {
//   // Protocol: Determine if this specific node has missing data
//   const isWarningNode = 
//     (num === 1 && isStep1Incomplete()) ||
//     (num === 2 && isStep2Incomplete()) ||
//     (num === 3 && isStep3Incomplete()) || // Yellow if education is []
//     (num === 4 && isStep4Incomplete()) ||
//     (num === 5 && isStep5Incomplete()) || 
//     (num === 6 && isStep6Incomplete());

//   return (
//     <div
//       key={num}
//       className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//       onClick={async () => {
//         if (num > step + 1) {
//           toast.error("Complete current phase registry first");
//           return;
//         }
//         const success = await saveStepData(step);
//         if (success || num < step) {
//           setStep(num);
//           navigate(`?step=${num}`, { replace: true });
//         }
//       }}
//     >
  
//       <div
//         className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//           group-hover/step:scale-110
//           ${step === num
//             ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" // Active
//             : step > num
//               ? isWarningNode 
//                 ? "bg-yellow-400 text-white border-yellow-100" // Warning (Even if passed)
//                 : "bg-emerald-500 text-white border-emerald-50" // Completed
//               : isWarningNode 
//                 ? "bg-yellow-400 text-white border-yellow-100" // Future Warning
//                 : "bg-white text-slate-300 border-slate-50" // Untouched
//           }`}
//       >
//         {step > num && !isWarningNode ? <Check size={14} strokeWidth={4} /> : num}
//       </div>

   
//       <span
//         className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//           ${step === num ? "text-blue-600" : isWarningNode ? "text-yellow-600" : "text-slate-300"} 
//           group-hover/step:text-slate-900`}
//       >
//         {num === 1 && "Personal"}
//         {num === 2 && "Location"}
//         {num === 3 && "Education"}
//         {num === 4 && "Experience"}
//         {num === 5 && "Stack"}
//         {num === 6 && "Vault"}
//       </span>
//     </div>
//   );
// })}
//             </div>
//           </div>
          
//           <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group">
//   <div className="text-right">
//     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
//       Audit Completion
//     </p>
//     <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
//       calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
//     }`}>
//       {calculateCompletion()}%
//     </p>
//   </div>
  

//   <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
//     calculateCompletion() === 100 
//       ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
//       : 'bg-blue-100 text-blue-600'
//   }`}>
//     {calculateCompletion() === 100 ? (
//       <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
//     ) : (
//       <Activity size={18} className="animate-pulse" />
//     )}
//   </div>
// </div>
//         </div> */} 

//         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 gap-8">
//   {/* Left Section: Branding Node */}
//   <div className="flex items-center gap-6">
//     <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
//       <Database size={32} />
//     </div>
//     <div>
//       <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//         {id ? "Edit Profile" : "Manual Add"}
//       </h2>
//       <div className="flex items-center gap-2 mt-1.5">
//         <ShieldCheck size={14} className="text-blue-600" />
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Candidate data</span>
//       </div>
//     </div>
//   </div>

//   {/* Center Section: Roadmap Protocol */}
//   <div className="flex-1 max-w-2xl w-full px-4">
//     <div className="relative flex justify-between items-center w-full">
//       <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
//       <div
//         className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
//         style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
//       />

//       {[1, 2, 3, 4, 5, 6].map((num) => {
//         const isWarning = 
//           (num === 1 && isStep1Incomplete()) ||
//           (num === 2 && isStep2Incomplete()) ||
//           (num === 3 && isStep3Incomplete()) ||
//           (num === 4 && isStep4Incomplete()) ||
//           (num === 5 && isStep5Incomplete()) ||
//           (num === 6 && isStep6Incomplete());

//         return (
//           <div
//             key={num}
//             className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group/step"
//             onClick={async () => {
//             //   if (num > step + 1) {
//             //     toast.error("Protocol Error: Complete current phase first");
//             //     return;
//             //   }
//               const success = await saveStepData(step);
//               if (success || num < step) {
//                 setStep(num);
//                 navigate(`?step=${num}`, { replace: true });
//               }
//             }}
//           >
//             <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 
//               group-hover/step:scale-110
//               ${step === num
//                 ? "bg-blue-600 text-white border-blue-100 scale-110 shadow-lg shadow-blue-200" 
//                 : step > num
//                   ? isWarning 
//                     ? "bg-yellow-400 text-white border-yellow-100" 
//                     : "bg-emerald-500 text-white border-emerald-50" 
//                   : isWarning 
//                     ? "bg-yellow-400 text-white border-yellow-100" 
//                     : "bg-emerald-400 text-slate-300 border-slate-50"
//               }`}
//             >
//               {step > num && !isWarning ? <Check size={14} strokeWidth={4} /> : num}
//             </div>
//             <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter transition-colors duration-300 whitespace-nowrap
//               ${step === num ? "text-blue-600" : isWarning ? "text-yellow-600" : "text-slate-300"} 
//               group-hover/step:text-slate-900`}
//             >
//               {num === 1 && "Personal"}
//               {num === 2 && "Location"}
//               {num === 3 && "Education"}
//               {num === 4 && "Experience"}
//               {num === 5 && "Stack"}
//               {num === 6 && "Vault"}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   </div>

//   {/* Right Section: Percentage Hub */}
//   <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner group transition-all hover:bg-white hover:shadow-md">
//     <div className="text-right">
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
//         Audit Status
//       </p>
//       <p className={`text-sm font-black mt-1 transition-colors duration-500 ${
//         calculateCompletion() === 100 ? "text-emerald-600" : "text-slate-900"
//       }`}>
//         {calculateCompletion()}%
//       </p>
//     </div>
    
//     <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
//       calculateCompletion() === 100 
//         ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100' 
//         : 'bg-blue-100 text-blue-600 shadow-blue-50'
//     }`}>
//       {calculateCompletion() === 100 ? (
//         <ShieldCheck size={18} strokeWidth={3} className="animate-in zoom-in" />
//       ) : (
//         <Activity size={16} className="animate-pulse" />
//       )}
//     </div>
//   </div>
// </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-12">
//             {/* STEP 1: IDENTITY & CAREER */}
//             {step === 1 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8 duration-500">
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
//                   <User size={18} className="text-blue-600" />
//                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                     Basic Candidate profile
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <FormField label="Full Name" required>
//                     <input
//                       placeholder="Legal Name"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Email" required>
//                     <input
//                       type="email"
//                       placeholder="name@domain.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Phone" required>
//                     <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all shadow-sm">
//                       <span className="px-3 text-[11px] font-black text-slate-400">
//                         +91
//                       </span>
//                       <input
//                         maxLength={10}
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         className="w-full px-3 py-2 bg-transparent text-[13px] font-bold outline-none"
//                       />
//                     </div>
//                   </FormField>
//                   <FormField label="Gender">
//                     <select
//                       value={formData.gender}
//                       onChange={(e) =>
//                         setFormData({ ...formData, gender: e.target.value })
//                       }
//                       className={inputStyle}
//                     >
//                       <option value="">Select</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="transgender">Transgender</option>
//                       <option value="prefer_not_to_say">
//                         Prefer not to say
//                       </option>
//                     </select>
//                   </FormField>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
//                   <FormField label="Date of Birth">
//                     <input
//                       type="date"
//                       min={minDate}
//                       max={maxDate}
//                       value={formData.dob}
//                       onChange={(e) =>
//                         setFormData({ ...formData, dob: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <FormField label="Languages">
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-3 shadow-inner">
//                       {[
//                         "English",
//                         "Hindi",
//                         "Marathi",
//                         "Gujarati",
//                         "Tamil",
//                         "Telugu",
//                       ].map((lang) => (
//                         <label
//                           key={lang}
//                           className="flex items-center gap-2 text-[11px] font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={formData.languages_spoken.includes(lang)}
//                             onChange={() => {
//                               const u = formData.languages_spoken.includes(lang)
//                                 ? formData.languages_spoken.filter(
//                                     (l) => l !== lang,
//                                   )
//                                 : [...formData.languages_spoken, lang];
//                               setFormData({ ...formData, languages_spoken: u });
//                             }}
//                             className="w-3.5 h-3.5 accent-blue-600 rounded"
//                           />{" "}
//                           {lang}
//                         </label>
//                       ))}
//                     </div>
//                   </FormField>
//                 </div>
//                 <FormField label="Bio Summary">
//                   <textarea
//                     rows={3}
//                     value={formData.about_me}
//                     onChange={(e) =>
//                       setFormData({ ...formData, about_me: e.target.value })
//                     }
//                     className={inputStyle + " resize-none"}
//                   />
//                 </FormField>
//                 <div className="flex justify-end pt-4">
//                   <button
//                     type="button"
//                     // onClick={() => setStep(2)}
//                     onClick={async () => {
//                       await saveStepData(1);
//                       setStep(2);
//                     }}
//                     className={`px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all`}
//                   >
//                     Next Phase →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: GEOGRAPHY */}
//             {step === 2 && (
//               <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 animate-in slide-in-from-right-8">
//                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
//                   <MapPin size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     location Data
//                   </h3>
//                 </div>
//                 <div className="space-y-8">
//                   <FormField label="Address 1" required>
//                     <input
//                       value={formData.address}
//                       onChange={(e) =>
//                         setFormData({ ...formData, address: e.target.value })
//                       }
//                       className={inputStyle}
//                     />
//                   </FormField>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     <FormField label="Address 2" required>
//                       <input
//                         value={formData.location}
//                         onChange={(e) =>
//                           setFormData({ ...formData, location: e.target.value })
//                         }
//                         className={inputStyle}
//                       />
//                     </FormField>
//                     <FormField label="Pincode" required>
//                       <input
//                         maxLength={6}
//                         placeholder="000000"
//                         value={formData.pincode}
//                         onChange={(e) => {
//                           setFormData({ ...formData, pincode: e.target.value });
//                           if (e.target.value.length === 6)
//                             fetchPincodeDetails(e.target.value);
//                         }}
//                         className={inputStyle}
//                       />
//                     </FormField>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     <FormField label="City">
//                       {isFetchingPincode ? (
//                         <input
//                           value="Fetching..."
//                           readOnly
//                           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-400 shadow-inner"
//                         />
//                       ) : cityOptions.length > 1 ? (
//                         <select
//                           value={formData.city}
//                           onChange={(e) => {
//                             const selected = cityOptions.find(
//                               (c) => c.Name === e.target.value,
//                             );

//                             setFormData((prev) => ({
//                               ...prev,
//                               city: selected?.Name || "",
//                               district: selected?.District || "",
//                               state: selected?.State || "",
//                               country: selected?.Country || "India",
//                             }));
//                           }}
//                           className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         >
//                           {cityOptions.map((c, i) => (
//                             <option key={i} value={c.Name}>
//                               {c.Name}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           value={formData.city || ""}
//                           readOnly
//                           className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                         />
//                       )}
//                     </FormField>

//                     <FormField label="District">
//                       <input
//                         // value={formData.district}
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.district
//                         }
//                         readOnly
//                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                       />
//                     </FormField>
//                     <FormField label="State">
//                       <input
//                         // value={formData.state}
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.state
//                         }
//                         readOnly
//                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-500 shadow-inner"
//                       />
//                     </FormField>
//                     <FormField label="Country">
//                       <input
//                         value={
//                           isFetchingPincode ? "Fetching..." : formData.country
//                         }
//                         readOnly
//                         onChange={(e) =>
//                           setFormData({ ...formData, country: e.target.value })
//                         }
//                         className={inputStyle}
//                       />
//                     </FormField>
//                   </div>
//                 </div>
//                 <div className="flex justify-between pt-8 border-t border-slate-50">
//                   <button
//                     onClick={() => setStep(1)}
//                     type="button"
//                     className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs font-black uppercase hover:text-slate-900 transition-all shadow-sm"
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     //  onClick={() => setStep(3)}
//                     onClick={async () => {
//                       await saveStepData(2);
//                       setStep(3);
//                     }}
//                     type="button"
//                     className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl transition-all"
//                   >
//                     Continue →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
//                   <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                         <Award size={20} />
//                       </div>
//                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Education History</h3>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsEditingEdu(false);
//                         setNewEdu({ education_id: 0, institution_name: "", start_year: "", end_year: "", education_name: "" });
//                         fetchMasterEducations();
//                         setShowEduModal(true);
//                       }}
//                       className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
//                     >
//                       <Plus size={14} strokeWidth={3} /> Add Education
//                     </button>
//                   </div>
            
//             {/* VERIFIED EDUCATION LIST */}
//             <div className="space-y-4 relative z-10">
//               {formData.education && formData.education.length > 0 ? (
//                 formData.education.map((edu, i) => (
//                   <div key={i} className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white  transition-all border-l-4 border-l-blue-600">
                    
//                     {/* Node Index */}
//                     <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-900 shadow-sm">
//                       0{i + 1}
//                     </div>
            
//                     {/* Content Node */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-3 mb-1">
//                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
//                           {edu.institution_name}
//                         </h4>
//                         <span className="h-1 w-1 rounded-full bg-slate-300" />
//                         <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
//                           {edu.education_name} {/* Displays "Btech", "HSC", etc. */}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-4 text-slate-400">
//                         <div className="flex items-center gap-1.5">
//                           <Calendar size={12} className="text-slate-300" />
//                           <span className="text-[10px] font-black uppercase tracking-widest">
//                             {edu.start_year} <span className="text-slate-200 mx-1">—</span> {edu.end_year}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
            
//                     {/* Action Node */}
//                     <button 
//                       type="button" 
//                       onClick={() => {
//                         setIsEditingEdu(true);
//                         setCurrentEduId(edu.id);
//                         // Pre-fill modal
//                         setNewEdu({
//                           education_id: edu.education_id,
//                           institution_name: edu.institution_name,
//                           start_year: edu.start_year,
//                           end_year: edu.end_year,
//                           education_name: edu.education_name
//                         });
//                         setEduSearch(edu.education_name);
//                         setShowEduModal(true);
//                       }}
//                       className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-90"
//                     >
//                       <Edit3 size={16} />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-16 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
//                   <Database className="mx-auto text-slate-200 mb-4" size={32} />
//                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Zero Academic Nodes Registered</p>
//                 </div>
//               )}
//             </div>
//                 </div>
            
//                 {/* NAVIGATION */}
//                 <div className="flex justify-between pt-6">
//                   <button type="button" onClick={() => setStep(2)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm">← Back</button>
//                   <button
//                     type="button"
//                     onClick={async () => { await saveStepData(3); setStep(4); }}
//                     className="px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
//                   >Commit & Continue →</button>
//                 </div>
            
//                 {/* EDUCATION MODAL */}
//               {/* 2. Updated Modal Content */}
//             {showEduModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
//                 <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
                  
//                   {/* Modal Header */}
//                   <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
//                         <Award size={28} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">Education Details</h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Entry</p>
//                       </div>
//                     </div>
//                     <button onClick={() => { setShowEduModal(false); setEduDropdownOpen(false); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
//                       <X size={24} />
//                     </button>
//                   </div>
            
//                   <div className="p-10 space-y-8 bg-white overflow-visible">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">
                      
//                       {/* SEARCHABLE DROPDOWN */}
//                       <div className="space-y-2 relative" ref={dropdownContainerRef}>
//                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">
//                           Degree Specification
//                         </label>
//                         <div className="relative group">
//                           <input 
//                             placeholder="Search node (HSC, Btech, SSC...)" 
//                             value={eduSearch} 
//                             onFocus={() => {
//                               setEduDropdownOpen(true);
//                               if (masterEducations.length === 0) fetchMasterEducations();
//                             }}
//                             onChange={(e) => {
//                               setEduSearch(e.target.value);
//                               setEduDropdownOpen(true);
//                             }}
//                             className={inputStyle + " pr-10 focus:border-blue-600 transition-all"} 
//                           />
//                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
//                             {fetchingData ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
//                           </div>
//                         </div>
            
//                         {/* Dropdown Result Panel */}
//                         {eduDropdownOpen && (
//                           <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                             <div className="max-h-[220px] overflow-y-auto custom-scrollbar-professional p-2 space-y-1 bg-white">
//                               {masterEducations.filter(m => 
//                                 (m.name || "").toLowerCase().includes(eduSearch.toLowerCase())
//                               ).length > 0 ? (
//                                 masterEducations
//                                   .filter(m => (m.name || "").toLowerCase().includes(eduSearch.toLowerCase()))
//                                   .slice(0, 20)
//                                   .map((m) => (
//                                     <button
//                                       key={m.id}
//                                       type="button"
//                                       onClick={() => {
//                                         setNewEdu({ ...newEdu, education_id: m.id, education_name: m.name });
//                                         setEduSearch(m.name);
//                                         setEduDropdownOpen(false);
//                                       }}
//                                       className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/item ${
//                                         newEdu.education_id === m.id 
//                                           ? "bg-blue-600 text-white" 
//                                           : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
//                                       }`}
//                                     >
//                                       <span className="uppercase tracking-tight">{m.name}</span>
//                                       {newEdu.education_id === m.id ? (
//                                         <CheckCircle size={14} className="text-white" />
//                                       ) : (
//                                         <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
//                                       )}
//                                     </button>
//                                   ))
//                               ) : (
//                                 <div className="py-8 text-center bg-slate-50/50 rounded-xl">
//                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching degree nodes</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
            
//                       <FormField label="Institution Name">
//                         <input 
//                           placeholder="e.g. Mumbai University" 
//                           value={newEdu.institution_name} 
//                           onChange={(e) => setNewEdu({ ...newEdu, institution_name: e.target.value })} 
//                           className={inputStyle} 
//                         />
//                       </FormField>
//                     </div>
            
//                     <div className="grid grid-cols-2 gap-8">
//               {/* START YEAR NODE */}
//               <FormField label="Commencement Year">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                     <Calendar size={16} />
//                   </div>
//                   <input 
//                     type="number" 
//                     placeholder="YYYY" 
//                     min="1970"
//                     max="2030"
//                     value={newEdu.start_year} 
//                     onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })} 
//                     className={inputStyle + " pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} 
//                   />
//                 </div>
//               </FormField>
            
//               {/* END YEAR NODE */}
//               <FormField label="Completion Year">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                     <Calendar size={16} />
//                   </div>
//                   <input 
//                     type="number" 
//                     placeholder="YYYY" 
//                     min="1970"
//                     max="2030"
//                     value={newEdu.end_year} 
//                     onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })} 
//                     className={inputStyle + " pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} 
//                   />
//                 </div>
//               </FormField>
//             </div>
            
//                     <div className="flex justify-end pt-6 border-t border-slate-100">
//                       <button
//                         type="button"
//                         onClick={handleSaveEducation}
//                         className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3 hover:bg-blue-600"
//                       >
//                         <CheckCircle size={18} /> {isEditingEdu ? "Update" : "Synchronize Node"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//               </div>
//             )}

//             {step === 4 && (
//               <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
//                 {/* STATUS SELECTOR CARD */}
//                 <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
//                   <Fingerprint className="absolute -right-6 -bottom-6 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none" size={100} />
//                   <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
//                     <div className="flex items-center gap-4 text-slate-900 font-black">
//                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
//                         <Briefcase size={22} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h3 className="text-sm uppercase tracking-[0.15em]">Are you Fresher?</h3>
//                         <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Career status determines validation protocol</p>
//                       </div>
//                     </div>
//                     <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 w-full md:w-auto">
//                       <button
//                         type="button"
//                         disabled={hasExistingExperience}
//                         onClick={() => {
//                           if (hasExistingExperience) return;
//                           setIsFresher(true);
//                           setFormData({ ...formData, experiences: [] });
//                         }}
//                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === true ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
//                       >YES</button>
//                       <button
//                         type="button"
//                         onClick={() => setIsFresher(false)}
//                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${isFresher === false ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`}
//                       >NO</button>
//                     </div>
//                   </div>
//                 </div>
            
//                 {/* EXPERIENCE TIMELINE DISPLAY */}
//                 {isFresher === false && (
//                   <div className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
//                     <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 pb-8 relative z-10">
//                       <div className="flex items-center gap-4">
//                         <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                           <History size={20} />
//                         </div>
//                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Job Experience History</h3>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (newExperiences.length === 0) {
//                             setNewExperiences([{ company_name: "", job_title: "", department: "", start_date: "", end_date: "", previous_ctc: "", location: "", description: "" }]);
//                           }
//                           setShowExpModal(true);
//                         }}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
//                       >
//                         <Plus size={14} strokeWidth={3} /> Add Experience
//                       </button>
//                     </div>
            
//                     {/* VERIFIED DATA LIST (Shows existing records from formData) */}
                  
//                     <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//               {formData.experiences && formData.experiences.length > 0 ? (
//                 formData.experiences.map((exp, i) => (
//                   <div 
//                     key={i} 
//                     className="group relative flex flex-col md:flex-row items-stretch gap-0 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
//                   >
//                     {/* SIDE BRANDING BAR: Denotes 'Verified Node' status */}
//                     <div className="w-1.5 bg-blue-600 group-hover:w-2 transition-all duration-300" />
            
//                     {/* INDEX NODE: Terminal Style */}
//                     <div className="flex items-center justify-center px-6 bg-slate-50/50 border-r border-slate-100">
//                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 transition-colors">
//                         <span className="text-[10px] font-black text-slate-400 leading-none uppercase tracking-tighter">exp</span>
//                         <span className="text-sm font-black text-slate-900 leading-none mt-1">0{i + 1}</span>
//                       </div>
//                     </div>
            
//                     {/* MAIN CONTENT STRIP */}
//                     <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
//                       <div className="min-w-0 space-y-2">
//                         {/* Entity & Role */}
//                         <div className="flex items-center gap-3">
//                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-blue-600 transition-colors">
//                             {exp.company_name || "Unidentified Entity"}
//                           </h4>
//                           <div className="h-1 w-1 rounded-full bg-slate-300" />
//                           <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
//                             {exp.job_title || "Role Pending"}
//                           </div>
//                         </div>
            
//                         {/* Deployment Meta-Data */}
//                         <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <Calendar size={13} className="text-slate-300" />
//                             <span className="text-[10px] font-bold uppercase tracking-widest">
//                               {exp.start_date || "----"} <span className="text-slate-200 mx-1">—</span> {exp.end_date || "Present"}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <MapPin size={13} className="text-slate-300" />
//                             <span className="text-[10px] font-bold uppercase tracking-widest">{exp.location || "Global Node"}</span>
//                           </div>
//                         </div>
//                       </div>
            
//                       {/* FINANCIAL NODE: High Contrast Badge */}
//                       <div className="flex items-center gap-6">
//                         <div className="flex flex-col items-end border-r border-slate-100 pr-6">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Previous CTC</span>
//                           <div className="flex items-center gap-1.5 text-emerald-600">
//                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                             <span className="text-[12px] font-black uppercase tracking-tight">
//                               ₹{exp.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "0.00"}
//                             </span>
//                           </div>
//                         </div>
            
//                         {/* ACTION INTERFACE */}
//                         <div className="flex items-center gap-2">
//                           <button 
//                             type="button" 
                            
//             onClick={() => {
//               const existing = formData.experiences[i];
            
//               setCurrentEditingIndex(i);
            
//               setNewExperiences([
//                 {
//                   ...existing,
//                   uploadMode: existing.exp_letter_link ? "link" : "file",
//                   expLetterFile: null, // important
//                 },
//               ]);
            
//               setShowExpModal(true);
//             }}
            
            
            
//                             className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 border border-slate-100 active:scale-90"
//                           >
//                             <Edit3 size={16} strokeWidth={2.5} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
            
//                     {/* Decorative Watermark for Enterprise Feel */}
//                     <History className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.02] -rotate-12 pointer-events-none group-hover:opacity-[0.05] transition-opacity" size={100} />
//                   </div>
//                 ))
//               ) : (
//                 /* EMPTY STATE: Audit-Empty Pattern */
//                 <div className="relative group flex flex-col items-center justify-center py-20 bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-[2.5rem] transition-colors hover:bg-slate-50">
//                   <div className="relative z-10 flex flex-col items-center">
//                     <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-200 mb-6 group-hover:scale-110 transition-transform duration-500">
//                       <Database size={32} strokeWidth={1.5} />
//                     </div>
//                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
//                       Zero Nodes Synchronized
//                     </h4>
//                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center max-w-xs">
//                       Professional history registry currently empty. Initialize a new experience node to begin.
//                     </p>
//                   </div>
//                   <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
//                      <ShieldCheck className="absolute -right-8 -bottom-8 text-slate-900 opacity-[0.02] -rotate-12" size={200} />
//                   </div>
//                 </div>
//               )}
//             </div>
//                   </div>
//                 )}
            
//                 {/* NAVIGATION */}
//                 <div className="flex justify-between pt-6">
//                   <button type="button" onClick={() => setStep(3)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase shadow-sm transition-all hover:text-slate-900">← Back</button>
//                   <button
//                     type="button"
//                     onClick={async () => { await saveStepData(4); setStep(5); }}
//                     disabled={isFresher === null}
//                     className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all ${isFresher !== null ? "bg-blue-600 text-white shadow-blue-200" : "bg-slate-200 text-slate-300 cursor-not-allowed"}`}
//                   >Commit & Continue →</button>
//                 </div>
            
//                 {/* MODAL: ADDING NEW RECORDS ONLY (Upload Logic Removed) */}
               
//                 {showExpModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
//                 <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                  
//                   {/* Modal Header */}
//                   <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//                         <Plus size={28} strokeWidth={3} />
//                       </div>
//                       <div>
//                         {/* <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">New Experience</h2> */}
//                         <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em]">
//                             {currentEditingIndex !== null ? "Edit Experience" : "New Experience"}
//                         </h2>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add new Experience Records</p>
//                       </div>
//                     </div>
//                     <button onClick={() => setShowExpModal(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm">
//                       <X size={24} />
//                     </button>
//                   </div>
            
//                   {/* Modal Content */}
//                   <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar-professional bg-white">
//                     {newExperiences.map((exp, i) => (
//                       <div key={i} className="relative bg-slate-50/50 border border-slate-200 p-8 rounded-[2.5rem] space-y-8 animate-in slide-in-from-bottom-4 group hover:bg-white hover:border-blue-200 transition-all">
//                         {/* Remove Entry */}
//                         <button
//                           type="button"
//                           onClick={() => setNewExperiences(newExperiences.filter((_, idx) => idx !== i))}
//                           className="absolute -top-3 -right-3 h-10 w-10 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-red-500 hover:text-white"
//                         >
//                           <Trash2 size={18} />
//                         </button>
            
//                         {/* GRID 1: IDENTITY */}
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                           <FormField label="Employer">
//                             <input placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...newExperiences]; u[i].company_name = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Designation">
//                             <input placeholder="Job Title" value={exp.job_title} onChange={(e) => { const u = [...newExperiences]; u[i].job_title = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Location">
//                             <input placeholder="City" value={exp.location} onChange={(e) => { const u = [...newExperiences]; u[i].location = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
           
            
//             <FormField label="Industry">
//               <div className="relative">
//                 {/* INPUT BOX */}
//                 <input
//                   value={exp.industry_name || ""} // Use name for display
//                   placeholder="Search industry..."
//                   onFocus={() => setShowIndustryDrop(true)}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setIndustrySearch(value);
//                     const u = [...newExperiences];
//                     u[i].industry_name = value; // Temporary display
//                     setNewExperiences(u);
//                   }}
//                   className={inputStyle}
//                 />
            
//                 {/* DROPDOWN */}
//                 {showIndustryDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//                     <div className="max-h-44 overflow-y-auto custom-scrollbar-professional">
//                       {masterIndustries
//                         .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
//                         .length > 0 ? (
//                         masterIndustries
//                           .filter((ind) => (ind.name || "").toLowerCase().includes(industrySearch.toLowerCase()))
//                           .map((ind) => (
//                             <div
//                               key={ind.id}
//                               onClick={() => {
//                                 const u = [...newExperiences];
//                                 u[i].industry_id = ind.id; // ✅ Store the ID for API
//                                 u[i].industry_name = ind.name; // Store name for UI display
//                                 setNewExperiences(u);
//                                 setIndustrySearch("");
//                                 setShowIndustryDrop(false);
//                               }}
//                               className="px-4 py-2.5 text-[11px] font-black text-slate-700 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors uppercase tracking-tight flex justify-between items-center"
//                             >
//                               {ind.name}
//                               {exp.industry_id === ind.id && <Check size={14} />}
//                             </div>
//                           ))
//                       ) : (
//                         <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase italic">
//                           No matching industry 
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </FormField>
            
            
//                         </div>
            
//                         {/* GRID 2: TIMELINE & CTC */}
//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                           <FormField label="Department">
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Layers size={16} />
//                   </div>
//                   <select
//                     value={exp.department || ""}
//                     onChange={(e) => {
//                       const u = [...newExperiences];
//                       u[i].department = e.target.value;
//                       setNewExperiences(u);
//                     }}
//                     className={inputStyle + " pl-12 appearance-none"}
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept.id} value={dept.name}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                     <ChevronDown size={16} />
//                   </div>
//                 </div>
//               </FormField>
//                           <FormField label="Start Date">
//                             <input type="date" value={exp.start_date} onChange={(e) => { const u = [...newExperiences]; u[i].start_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="End Date">
//                             <input type="date" value={exp.end_date} onChange={(e) => { const u = [...newExperiences]; u[i].end_date = e.target.value; setNewExperiences(u); }} className={inputStyle} />
//                           </FormField>
//                           <FormField label="Annual CTC">
//                             <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all">
//                               <div className="px-4 text-blue-600 font-black italic">₹</div>
//                               <input type="number" placeholder="0.00" value={exp.previous_ctc} onChange={(e) => { const u = [...newExperiences]; u[i].previous_ctc = e.target.value; setNewExperiences(u); }} className="w-full py-3 bg-transparent text-[12px] font-bold outline-none" />
//                               <div className="pr-4 text-[9px] font-black text-slate-400">LPA</div>
//                             </div>
//                           </FormField>
//                         </div>
            
//                         {/* GRID 3: DESCRIPTION & ARTIFACT UPLOAD */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                           <FormField label="Professional Summary">
//                             <textarea rows={4} placeholder="Briefly describe your role..." value={exp.description} onChange={(e) => { const u = [...newExperiences]; u[i].description = e.target.value; setNewExperiences(u); }} className={inputStyle + " resize-none"} />
//                           </FormField>
                          
//                           <div className="space-y-4">
//                             <div className="flex justify-between items-center px-1">
//                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experience Letter</p>
//                               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 scale-90">
//                                 <button
//                                   type="button"
//                                   onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "file"; setNewExperiences(u); }}
//                                   className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode !== "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                                 >FILE</button>
//                                 <button
//                                   type="button"
//                                   onClick={() => { const u = [...newExperiences]; u[i].uploadMode = "link"; setNewExperiences(u); }}
//                                   className={`px-4 py-1 text-[9px] font-black rounded-lg transition-all ${exp.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                                 >URL</button>
//                               </div>
//                             </div>
            
//                             <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 min-h-[140px] flex flex-col justify-center items-center group/upload hover:bg-blue-50/30 transition-all">
//                               {exp.uploadMode !== "link" ? (
//                                 <label className="flex flex-col items-center cursor-pointer w-full">
//                                   <FileUp size={24} className="text-slate-300 group-hover/upload:text-blue-500 mb-2 transition-colors" />
//                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">
//                                     {exp.expLetterFile ? exp.expLetterFile.name : "Select PDF"}
//                                   </span>
//                                   <input 
//                                     type="file" 
//                                     accept=".pdf" 
//                                     className="hidden" 
//                                     onChange={(e) => { const u = [...newExperiences]; u[i].expLetterFile = e.target.files[0]; setNewExperiences(u); }} 
//                                   />
//                                 </label>
//                               ) : (
//                                 <div className="w-full px-4 relative">
//                                   <LinkIcon size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
//                                   <input 
//                                     placeholder="Public Storage URI (https://...)" 
//                                     value={exp.exp_letter_link || ""} 
//                                     onChange={(e) => { const u = [...newExperiences]; u[i].exp_letter_link = e.target.value; setNewExperiences(u); }} 
//                                     className={inputStyle + " pl-12"} 
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
            
//                         {/* SAVE ACTION */}
//                         <div className="flex justify-end pt-4 border-t border-slate-100">
//                           <button
//                             type="button"
//                             // onClick={() => handleSaveExperienceAPI(i)} 
//                             onClick={() => handleSaveOrUpdateExperience(i)}
//                             className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
//                           >
//                             {/* <CheckCircle size={16} /> Save */}
//                             <CheckCircle size={16} />
//             {currentEditingIndex !== null ? "Update" : "Save"}
            
//                           </button>
//                         </div>
//                       </div>
//                     ))}
            
                   
//                     {currentEditingIndex === null && (
//               <button
//                 type="button"
//                 onClick={() =>
//                   setNewExperiences([
//                     ...newExperiences,
//                     {
//                       company_name: "",
//                       job_title: "",
//                       start_date: "",
//                       end_date: "",
//                       previous_ctc: "",
//                       location: "",
//                       description: "",
//                       industry: "",
//                       uploadMode: "file",
//                       expLetterFile: null,
//                       exp_letter_link: "",
//                       candidate_id: effectiveId,
//                     },
//                   ])
//                 }
//                 className="w-full py-8 border-2 border-dashed border-slate-400 rounded-[2.5rem] text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/20 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
//               >
//                 + Add New Row
//               </button>
//             )}
            
//                   </div>
            
//                   {/* Modal Footer */}
                 
//                 </div>
//               </div>
//             )} 
//               </div>
//             )}

//                {step === 5 && (
//                           <div className="space-y-8 animate-in slide-in-from-right-8 overflow-visible">
//                             <div className="bg-white border border-slate-200 rounded-[3.5rem] shadow-xl overflow-visible shadow-slate-200/50">
//                               <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-200 flex items-center justify-between rounded-t-[3.5rem]">
//                                 <div className="flex items-center gap-4">
//                                   <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
//                                     <Cpu size={20} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
//                                       Skills & Assets
//                                     </h3>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="p-8 md:p-12 space-y-12 overflow-visible">
//                                 <FormField label="Skills">
//                                   <div className="space-y-6">
//                                     <div className="flex flex-col sm:flex-row gap-4 items-end">
//                                       <div className="relative max-w-md w-full">
//                                         <Plus
//                                           size={16}
//                                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                                         />
//                                         <input
//                                           value={skillInput}
//                                           onChange={(e) => setSkillInput(e.target.value)}
//                                           onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                               e.preventDefault();
//                                               const name = skillInput.trim();
//                                               if (!name) return;
            
//                                               // prevent duplicate
//                                               if (!formData.skills.includes(name)) {
//                                                 setFormData((prev) => ({
//                                                   ...prev,
//                                                   skills: [...prev.skills, name],
//                                                 }));
//                                               }
            
//                                               setSkillInput("");
//                                             }
//                                           }}
//                                           placeholder="Enter skill..."
//                                           className={inputStyle + " pl-12"}
//                                         />
//                                       </div>
//                                     </div>
            
//                                     <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
//                                       {[
//                                         ...new Set([...dynamicSkills, ...formData.skills]),
//                                       ].map((skill) => {
//                                         const isSelected = formData.skills.includes(skill);
            
//                                         return (
//                                           <button
//                                             key={skill}
//                                             type="button"
//                                             onClick={() =>
//                                               setFormData({
//                                                 ...formData,
//                                                 skills: isSelected
//                                                   ? formData.skills.filter(
//                                                       (s) => s !== skill,
//                                                     )
//                                                   : [...formData.skills, skill],
//                                               })
//                                             }
//                                             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${
//                                               isSelected
//                                                 ? "bg-white border-blue-500 border-[1px] text-black shadow-lg shadow-blue-200"
//                                                 : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
//                                             }`}
//                                           >
//                                             {skill}
//                                             {isSelected && (
//                                               <Check size={14} strokeWidth={3} />
//                                             )}
//                                           </button>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 </FormField>
//                                 {/* <FormField label="Enterprise Hardware Matrix"><div className="space-y-6 pt-8 border-t border-slate-100"><div className="relative max-w-md w-full"><Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={assetInput} onChange={(e) => setAssetInput(e.target.value)} onKeyDown={async (e) => { if(e.key === 'Enter') { e.preventDefault(); const v = assetInput.trim(); if(v && !formData.assets.includes(v)) { const ok = await handleAddAssetAPI(v); if(ok) { setFormData({...formData, assets: [...formData.assets, v]}); setAssetInput(""); } } } }} placeholder="Link hardware..." className={inputStyle + " pl-12"} /></div><div className="flex flex-wrap gap-3 p-1">{dynamicAssets.map((asset) => { const isSelected = formData.assets.includes(asset); return (<button key={asset} type="button" onClick={async () => { if(!isSelected) { const ok = await handleAddAssetAPI(asset); if(ok) setFormData({...formData, assets: [...formData.assets, asset]}); } else { setFormData({...formData, assets: formData.assets.filter(a => a !== asset)}); } }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90 ${isSelected ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}>{asset} {isSelected && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}</button>); })}</div></div></FormField> */}
//                                 <div className="space-y-6 pt-8 border-t border-slate-100">
//                                   <FormField label="Assets">
//                                     <div className="space-y-6">
//                                       {/* Search & Manual Add Input */}
//                                       <div className="relative max-w-md">
//                                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                                           <Layers size={16} />
//                                         </div>
//                                         <input
//                                           value={assetInput}
//                                           onChange={(e) => setAssetInput(e.target.value)}
                                          
//                                           onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                               e.preventDefault();
//                                               const v = assetInput.trim();
//                                               if (!v) return;
            
//                                               // Prevent duplicate
//                                               if (!formData.assets.includes(v)) {
//                                                 setFormData((prev) => ({
//                                                   ...prev,
//                                                   assets: [...prev.assets, v],
//                                                 }));
//                                               }
            
//                                               setAssetInput("");
//                                             }
//                                           }}
//                                           placeholder="Type Assets name and press Enter..."
//                                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
//                                         />
//                                       </div>
            
//                                       <div className="flex flex-wrap gap-3 p-1 w-full min-h-[40px]">
//                                         {[
//                                           ...new Set([
//                                             ...dynamicAssets,
//                                             ...formData.assets,
//                                           ]),
//                                         ].filter(
//                                           (a) => typeof a === "string" && a.trim() !== "",
//                                         ).length === 0 ? (
//                                           /* ❌ NO ASSETS */
//                                           <div className="w-full text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
//                                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                               No assets available
//                                             </p>
//                                           </div>
//                                         ) : (
//                                           /* ✅ ASSET CHIPS */
//                                           [
//                                             ...new Set([
//                                               ...dynamicAssets,
//                                               ...formData.assets,
//                                             ]),
//                                           ]
//                                             .filter(
//                                               (a) =>
//                                                 typeof a === "string" && a.trim() !== "",
//                                             )
//                                             .map((asset) => {
//                                               const isSelected =
//                                                 formData.assets.includes(asset);
            
//                                               return (
//                                                 <button
//                                                   key={asset}
//                                                   type="button"
//                                                   onClick={() =>
//                                                     setFormData((prev) => ({
//                                                       ...prev,
//                                                       assets: isSelected
//                                                         ? prev.assets.filter(
//                                                             (a) => a !== asset,
//                                                           )
//                                                         : [...prev.assets, asset],
//                                                     }))
//                                                   }
//                                                   className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 border-2 active:scale-90
//                         ${
//                           isSelected
//                             ? "bg-white border-blue-500 text-black border-[1px] shadow-lg shadow-blue-200"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
//                         }`}
//                                                 >
//                                                   {asset}
//                                                   {isSelected && (
//                                                     <Check size={14} strokeWidth={3} />
//                                                   )}
//                                                 </button>
//                                               );
//                                             })
//                                         )}
//                                       </div>
//                                     </div>
//                                   </FormField>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex justify-between items-center pt-4">
//                               <button
//                                 onClick={() => setStep(4)}
//                                 type="button"
//                                 className="px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] font-black uppercase transition-all shadow-sm hover:text-slate-900 flex items-center gap-2 transition-all"
//                               >
//                                 <ChevronLeft size={16} /> Back
//                               </button>
            
//                               <button
//                                 onClick={async () => {
//                                   await saveStepData(5);
//                                   setStep(6);
//                                 }}
//                                 type="button"
//                                 className="px-12 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase shadow-xl active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
//                               >
//                                 Next Phase <ChevronRight size={14} />
//                               </button>
//                             </div>
//                           </div>
//                         )}


//                         {/* {step === 6 && (
//                           <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
//                             <div className="bg-white rounded-[2.5rem] border border-slate-200  overflow-hidden relative">
//                               <div className=" px-10 py-8  flex items-center justify-between">
//                                 <div className="flex items-center gap-5">
//                                   <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
//                                     <ShieldCheck size={28} strokeWidth={2.5} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-xl font-black text-black tracking-tight uppercase">Document</h3>
//                                     <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] mt-1">Resume & Certificate Upload</p>
//                                   </div>
//                                 </div>
//                               </div>
                        
//                               <div className="p-10 space-y-12">
                            
//                                 <div className="space-y-6">
//                                   <div className="flex items-center gap-3 px-2">
//                                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">01. Resume</h3>
//                                   </div>
//                                   {existingResume ? (
//                                     <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
//                                       <div className="flex items-center gap-5">
//                                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm"><CheckCircle size={24} /></div>
//                                         <div>
//                                           <p className="text-[11px] font-black text-blue-700 uppercase">Resume Submited</p>
//                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Uploaded</p>
//                                         </div>
//                                       </div>
//                                       <a href={fixResumeUrl2(existingResume)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
//                                         <Eye size={14} /> Preview
//                                       </a>
//                                     </div>
//                                   ) : (
//                                      <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50 flex flex-col items-center gap-3">
//                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active</p>
//                                         <button type="button" onClick={() => setResumeMode("file")} className="text-[10px] font-black text-blue-600 uppercase underline">Upload Master CV</button>
//                                      </div>
//                                   )}
//                                 </div>
                        
                             
//                                 <div className="space-y-6">
//                                   <div className="flex items-center justify-between px-2">
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">02. Uploaded Certificates</h3>
//                                     </div>
//                                     <button 
//                                       type="button"
//                                       onClick={() => { setEditingCertificate(null); setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); setShowCertEditModal(true); }}
//                                       className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
//                                     >
//                                       <PlusCircle size={14} /> Add Certificate
//                                     </button>
//                                   </div>
                        
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
//                                     {existingCertificates.map((cert) => (
//                                       <div key={cert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 transition-all shadow-sm">
//                                         <div className="flex items-center gap-4">
//                                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
//                                           <div className="min-w-0">
//                                             <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{cert.name}</p>
//                                             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mt-0.5">Verified</p>
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                            <a href={fixResumeUrl2(cert.file_path)} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
//                                            <button type="button" onClick={() => { setEditingCertificate(cert); setCertForm({ name: cert.name, uploadMode: "file", certificate_file: null, certificate_link: "" }); setShowCertEditModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
//                                         </div>
//                                       </div>
//                                     ))}
                        
                              
//                                     {formData.certificateFiles.map((file, idx) => (
//                                        <div key={`pending-${idx}`} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-2xl animate-pulse">
//                                           <div className="flex items-center gap-4">
//                                             <div className="p-3 bg-blue-600 text-white rounded-xl"><FileText size={20} /></div>
//                                             <div>
//                                               <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{formData.certificateNames[idx]}</p>
//                                               <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">Pending Sync</p>
//                                             </div>
//                                           </div>
//                                           <button type="button" onClick={() => {
//                                             const newFiles = [...formData.certificateFiles]; newFiles.splice(idx, 1);
//                                             const newNames = [...formData.certificateNames]; newNames.splice(idx, 1);
//                                             setFormData({...formData, certificateFiles: newFiles, certificateNames: newNames});
//                                           }} className="text-slate-300 hover:text-rose-500 transition-colors px-2"><Trash2 size={16}/></button>
//                                        </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
                        
                            
//                               <div className="p-10  flex flex-col md:flex-row items-center justify-between gap-6">
//                                 <div className="flex items-center gap-4">
                                
//                             <div className="flex justify-center pb-10">
//                               <button
//                                 type="button"
//                                 onClick={() => setStep(5)}
//                                 className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//                               >
//                                 <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//                                 Return to Assets & Skills
//                               </button>
//                             </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={async () => {
//                                     setLoading(true);
//                                     await saveStepData(6);
//                                     setLoading(false);
//                                     toast.success("Final Registry Sync Complete ✔");
//                                     navigate("/candidate");
//                                   }}
//                                   className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
//                                 >
//                                   {loading ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> <span>Submit & Close </span></>}
//                                 </button>
//                               </div>
//                             </div>
                           
//                           </div>
//                         )} */}

//                        {step === 6 && (
//                           <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
//                             <div className="bg-white rounded-[2.5rem] border border-slate-200  overflow-hidden relative">
//                               <div className=" px-10 py-8  flex items-center justify-between">
//                                 <div className="flex items-center gap-5">
//                                   <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
//                                     <ShieldCheck size={28} strokeWidth={2.5} />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-xl font-black text-black tracking-tight uppercase">Document</h3>
//                                     <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] mt-1">Resume & Certificate Upload</p>
//                                   </div>
//                                 </div>
//                               </div>
                        
//                               <div className="p-10 space-y-12">
                                
//                                 <div className="space-y-6">
//                                   <div className="flex items-center gap-3 px-2">
//                                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">01. Resume</h3>
//                                   </div>
//                                   {existingResume ? (
//                                     <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
//                                       <div className="flex items-center gap-5">
//                                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm"><CheckCircle size={24} /></div>
//                                         <div>
//                                           <p className="text-[11px] font-black text-blue-700 uppercase">Resume Submited</p>
//                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Uploaded</p>
//                                         </div>
//                                       </div>
//                                       <a href={fixResumeUrl2(existingResume)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
//                                         <Eye size={14} /> Preview
//                                       </a>
//                                     </div>
//                                   ) : (
                                   

// <div className="relative group">
//               <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-blue-500 transition-all cursor-pointer overflow-hidden">
//                 <FileUp className="absolute -right-4 -bottom-4 text-slate-100 opacity-50 -rotate-12 pointer-events-none" size={100} />
                
//                 <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
//                   <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
//                     {loading ? <Loader2 className="animate-spin" size={24} /> : <FileUp size={24} strokeWidth={2.5} />}
//                   </div>
//                   <div className="text-center">
//                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//                       {loading ? "Uploading..." : "Upload Resume"}
//                     </p>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Upload the Document</p>
//                   </div>
//                 </div>

//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   accept=".pdf" 
//                   disabled={loading}
//                   onChange={(e) => handleResumeDirectUpload(e.target.files[0])} 
//                 />
//               </label>
//             </div>
//                                   )}
//                                 </div>
                        
                             
//                                 <div className="space-y-6">
//                                   <div className="flex items-center justify-between px-2">
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">02. Uploaded Certificates</h3>
//                                     </div>
//                                     <button 
//                                       type="button"
//                                       onClick={() => { setEditingCertificate(null); setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); setShowCertEditModal(true); }}
//                                       className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
//                                     >
//                                       <PlusCircle size={14} /> Add Certificate
//                                     </button>
//                                   </div>
                        
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
//                                     {existingCertificates.map((cert) => (
//                                       <div key={cert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 transition-all shadow-sm">
//                                         <div className="flex items-center gap-4">
//                                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
//                                           <div className="min-w-0">
//                                             <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{cert.name}</p>
//                                             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mt-0.5">Verified</p>
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                            <a href={fixResumeUrl2(cert.file_path)} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
//                                            <button type="button" onClick={() => { setEditingCertificate(cert); setCertForm({ name: cert.name, uploadMode: "file", certificate_file: null, certificate_link: "" }); setShowCertEditModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
//                                         </div>
//                                       </div>
//                                     ))}
                        
                                   
//                                     {formData.certificateFiles.map((file, idx) => (
//                                        <div key={`pending-${idx}`} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-2xl animate-pulse">
//                                           <div className="flex items-center gap-4">
//                                             <div className="p-3 bg-blue-600 text-white rounded-xl"><FileText size={20} /></div>
//                                             <div>
//                                               <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{formData.certificateNames[idx]}</p>
//                                               <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">Pending Sync</p>
//                                             </div>
//                                           </div>
//                                           <button type="button" onClick={() => {
//                                             const newFiles = [...formData.certificateFiles]; newFiles.splice(idx, 1);
//                                             const newNames = [...formData.certificateNames]; newNames.splice(idx, 1);
//                                             setFormData({...formData, certificateFiles: newFiles, certificateNames: newNames});
//                                           }} className="text-slate-300 hover:text-rose-500 transition-colors px-2"><Trash2 size={16}/></button>
//                                        </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
                        
                           
//                               <div className="p-10  flex flex-col md:flex-row items-center justify-between gap-6">
//                                 <div className="flex items-center gap-4">
                              
//                             <div className="flex justify-center pb-10">
//                               <button
//                                 type="button"
//                                 onClick={() => setStep(5)}
//                                 className="group flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"
//                               >
//                                 <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//                                 Return to Assets & Skills
//                               </button>
//                             </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={async () => {
//                                     setLoading(true);
//                                     await saveStepData(6);
//                                     setLoading(false);
//                                     toast.success("Final Registry Sync Complete ✔");
//                                     navigate("/candidate");
//                                   }}
//                                   className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
//                                 >
//                                   {loading ? <Loader2 className="animate-spin" size={18} /> : <><Database size={18} /> <span>Submit & Close </span></>}
//                                 </button>
//                               </div>
//                             </div>
                           
//                           </div>
//                         )} 

//           </div>
//         </form>
//       </div>

//       {/* CERTIFICATE TERMINAL (ADD/EDIT MODAL) */}
//       {showCertEditModal && (
//         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
//             onClick={() => setShowCertEditModal(false)}
//           />
//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Header Protocol */}
//             <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
//                   {editingCertificate ? (
//                     <Edit3 size={22} />
//                   ) : (
//                     <PlusCircle size={22} />
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
//                     {editingCertificate
//                       ? "Edit Certificate"
//                       : "New Certificate"}
//                   </h2>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     Certificate{" "}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowCertEditModal(false)}
//                 className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* Compulsory Name Input */}
//               <FormField label="Certificate Name" required>
//                 <input
//                   placeholder="e.g. Google Cloud Professional"
//                   value={certForm.name}
//                   onChange={(e) =>
//                     setCertForm({ ...certForm, name: e.target.value })
//                   }
//                   className={inputStyle}
//                 />
//               </FormField>

//               {/* Upload Mode Toggle */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Type Of Document
//                 </label>
//                 <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCertForm({ ...certForm, uploadMode: "file" })
//                     }
//                     className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "file" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//                   >
//                     PDF
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCertForm({ ...certForm, uploadMode: "link" })
//                     }
//                     className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === "link" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//                   >
//                     URI
//                   </button>
//                 </div>
//               </div>

//               {/* Conditional Input Box */}
//               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                 {certForm.uploadMode === "file" ? (
//                   <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/30 hover:bg-white hover:border-emerald-500 transition-all group/up">
//                     <label className="cursor-pointer block">
//                       <FileUp
//                         className="mx-auto text-slate-300 group-hover/up:text-emerald-500 mb-3 transition-colors"
//                         size={32}
//                       />
//                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
//                         {certForm.certificate_file
//                           ? certForm.certificate_file.name
//                           : "Add Certificate PDF"}
//                       </span>
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) =>
//                           setCertForm({
//                             ...certForm,
//                             certificate_file: e.target.files[0],
//                           })
//                         }
//                       />
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <LinkIcon
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
//                       size={18}
//                     />
//                     <input
//                       placeholder="https://credential-verify.com/id..."
//                       value={certForm.certificate_link}
//                       onChange={(e) =>
//                         setCertForm({
//                           ...certForm,
//                           certificate_link: e.target.value,
//                         })
//                       }
//                       className={inputStyle + " pl-12 h-14"}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Commit Action */}
//               <button
//                 type="button"
//                 onClick={
//                   editingCertificate ? updateCertificate : handleAddCertificate
//                 }
//                 className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
//               >
//                 <Database size={16} />
//                 {editingCertificate
//                   ? "Certificate Update"
//                   : "Add New Certificate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `.custom-scrollbar-professional::-webkit-scrollbar { width: 6px; }.custom-scrollbar-professional::-webkit-scrollbar-track { background: transparent; }.custom-scrollbar-professional::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }.custom-scrollbar-professional::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }`,
//         }}
//       />
//     </div>
//   );
// };

// export default ManualEntry;
