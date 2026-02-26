import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Smartphone,
  Monitor,
  FileCheck,
  FileText,
  Activity,
  Database,
  ShieldCheck,
  Eye,
  CheckCircle,
  Loader2,
  MapPin,
  History,
  User,
  FileUp,
  LinkIcon,
  Plus,
  Briefcase,
  X,
  GraduationCap,
  ExternalLink,
  Calendar,
  Globe,
  Shield,
  Download,
  PlusCircle,
  MoreVertical,
  Edit3,
  Fingerprint,
  Cpu,
  Layers,
  Award,
  BadgeCheck,
  Languages,
} from "lucide-react";
import toast from "react-hot-toast";

const CandidateProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [showSkillAssetModal, setShowSkillAssetModal] = useState(false);
  const [masterSkills, setMasterSkills] = useState([]); // All possible skills
  const [selectedSkills, setSelectedSkills] = useState([]); // Candidate's skills
  const [selectedAssets, setSelectedAssets] = useState([]); // Candidate's assets
  const [newAssetInput, setNewAssetInput] = useState("");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const [isAssetsExpanded, setIsAssetsExpanded] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experienceList, setExperienceList] = useState([]);
  // Add this with your other useState hooks
  const [fetchingMasters, setFetchingMasters] = useState(false);
  const [isSubmittingExp, setIsSubmittingExp] = useState(false);
  const [newExp, setNewExp] = useState({
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    previous_ctc: "",
    location: "",
    description: "",
    industry_id: "", // Node: integer
    department_id: "", // Node: integer
    exp_letter_file: null, // Node: binary
    exp_letter_link: "", // Node: string/url
  });
  const [industries, setIndustries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showEditExpModal, setShowEditExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null); // Stores the single node being updated
  const [showAddEduModal, setShowAddEduModal] = useState(false);
  const [showEditEduModal, setShowEditEduModal] = useState(false);
  const [masterEducations, setMasterEducations] = useState([]);
  const [newEdu, setNewEdu] = useState({
    education_id: "",
    institution_name: "",
    start_year: "",
    end_year: "",
    score_metric: "Percentage", // Default value
    score: "",
  });
  const [editingEdu, setEditingEdu] = useState(null);
  const SCORE_METRICS = ["Percentage", "CGPA", "GPA"];
  const [showCertEditModal, setShowCertEditModal] = useState(false);
const [certForm, setCertForm] = useState({
  name: "",
  certificate_file: null,
  certificate_link: "",
  uploadMode: "file", // 'file' or 'link'
});
const [editingCertificate, setEditingCertificate] = useState(null); // 🛠️ Add this

  const handleUpdateExperience = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Updating Employment Node...");

    try {
      const fd = new FormData();
      fd.append("company_name", editingExp.company_name);
      fd.append("job_title", editingExp.job_title);
      fd.append("start_date", editingExp.start_date);
      fd.append("end_date", editingExp.end_date);

      if (editingExp.industry_id)
        fd.append("industry_id", parseInt(editingExp.industry_id));
      if (editingExp.department_id)
        fd.append("department_id", parseInt(editingExp.department_id));
      if (editingExp.previous_ctc)
        fd.append("previous_ctc", editingExp.previous_ctc);
      if (editingExp.location) fd.append("location", editingExp.location);
      if (editingExp.description)
        fd.append("description", editingExp.description);

      // Artifact Logic
      if (editingExp.artifact_type === "file" && editingExp.exp_letter_file) {
        fd.append("exp_letter_file", editingExp.exp_letter_file);
      } else if (
        editingExp.artifact_type === "link" &&
        editingExp.exp_letter_link
      ) {
        fd.append("exp_letter_link", editingExp.exp_letter_link);
      }

      // Dynamic URL using Candidate ID and Experience ID
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}/experiences/${editingExp.id}`,
        {
          method: "PUT",
          body: fd,
        },
      );

      if (res.ok) {
        toast.success("Node Updated Successfully", { id: toastId });

        // Refresh Profile Data
        const freshRes = await fetch(
          `https://apihrr.goelectronix.co.in/candidates/${id}`,
        );
        const freshData = await freshRes.json();
        setEmployee(freshData);

        setShowEditExpModal(false);
        setEditingExp(null);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Handshake Failed: Ensure all fields are valid", {
        id: toastId,
      });
    } finally {
      setUpdating(false);
    }
  };

  const addExperienceNode = () => {
    setExperienceList([
      ...experienceList,
      {
        company_name: "",
        job_title: "",
        start_date: "",
        end_date: "",
        location: "",
        previous_ctc: "",
        industry_id: "",
        department_id: "",
        description: "",
        // Artifact Logic
        artifact_type: "file", // internal UI helper: 'file' or 'link'
        exp_letter_file: null,
        exp_letter_link: "",
      },
    ]);
  };

  const DEFAULT_LANGS = [
    "English",
    "Hindi",
    "Marathi",
    "Gujarati",
    "Tamil",
    "Telugu",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://apihrr.goelectronix.co.in/candidates/${id}`,
        );
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error("Profile Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Effect to sync modal state with employee data when modal opens
  useEffect(() => {
    if (showLanguageModal && employee?.languages_spoken) {
      // If API returns string, split it; if array, use it directly
      const current = Array.isArray(employee.languages_spoken)
        ? employee.languages_spoken
        : employee.languages_spoken.split(",").map((l) => l.trim());
      setSelectedLangs(current);
    }
  }, [showLanguageModal, employee]);

  // Initialize Modal Data
  useEffect(() => {
    if (showSkillAssetModal) {
      fetchMasterSkills();
      // Normalize Skills (handle Array or String)
      const currentSkills = Array.isArray(employee?.skills)
        ? employee.skills
        : employee?.skills
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [];
      setSelectedSkills(currentSkills);

      // Normalize Assets
      const currentAssets = Array.isArray(employee?.assets)
        ? employee.assets
        : employee?.assets
            ?.split(",")
            .map((a) => a.trim())
            .filter(Boolean) || [];
      setSelectedAssets(currentAssets);
    }
  }, [showSkillAssetModal, employee]);

  // Fetch Master Registries for Industries and Departments
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [indRes, depRes] = await Promise.all([
          fetch(
            "https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100",
          ),
          fetch("https://apihrr.goelectronix.co.in/departments"),
        ]);
        const indData = await indRes.json();
        const depData = await depRes.json();
        setIndustries(indData || []);
        setDepartments(depRes.ok ? depData : []); // Safety check for department response
      } catch (err) {
        console.error("Registry Sync Failure", err);
      }
    };
    fetchMasters();
  }, []);

  useEffect(() => {
    const fetchEduMasters = async () => {
      try {
        const res = await fetch(
          "https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100",
        );
        const data = await res.json();
        setMasterEducations(data || []);
      } catch (err) {
        console.error("Edu Master Sync Failure");
      }
    };
    fetchEduMasters();
  }, []);

  // POST: Add New Academic Node
  const handleAddEducation = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Deploying Academic Node...");
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/education/${id}?user_type=candidate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            education_id: parseInt(newEdu.education_id),
            institution_name: newEdu.institution_name,
            start_year: newEdu.start_year,
            end_year: newEdu.end_year,
            score_metric: newEdu.score_metric, // 🛠️ Added
            score: newEdu.score, // 🛠️ Added
          }),
        },
      );
      if (res.ok) {
        toast.success("Academic Node Integrated", { id: toastId });
        const freshData = await (
          await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`)
        ).json();
        setEmployee(freshData);
        setShowAddEduModal(false);
        setNewEdu({
          education_id: "",
          institution_name: "",
          start_year: "",
          end_year: "",
        });
      } else throw new Error();
    } catch (err) {
      toast.error("Deployment Failed", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  // PATCH: Update Existing Academic Node
  const handleEditEducation = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const toastId = toast.loading("Patching Academic Node...");
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/education/${editingEdu.id}?user_type=candidate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            education_id: parseInt(editingEdu.education_id),
            institution_name: editingEdu.institution_name,
            start_year: editingEdu.start_year,
            end_year: editingEdu.end_year,
            score_metric: editingEdu.score_metric,
            score: editingEdu.score,
          }),
        },
      );
      if (res.ok) {
        toast.success("Node Synchronized", { id: toastId });
        const freshData = await (
          await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`)
        ).json();
        setEmployee(freshData);
        setShowEditEduModal(false);
      } else throw new Error();
    } catch (err) {
      toast.error("Update Failed", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  // Protocol: Force a clean, empty state whenever the modal is activated
  useEffect(() => {
    if (showExperienceModal) {
      // 🛠️ ALWAYS reset the list to exactly one blank node
      // This ignores any data already saved in the employee object
      setExperienceList([
        {
          company_name: "",
          job_title: "",
          start_date: "",
          end_date: "",
          location: "",
          previous_ctc: "",
          industry_id: "",
          department_id: "",
          description: "",
          artifact_type: "file",
          exp_letter_file: null,
          exp_letter_link: "",
        },
      ]);
    } else {
      // Purge state when modal closes to prevent "ghost data" next time
      setExperienceList([]);
    }
  }, [showExperienceModal]); // ⚠️ Only watch the modal state, NOT the employee data

  // PATCH Transmission
  const handleSyncRegistry = async () => {
    setUpdating(true);
    const syncToast = toast.loading("Executing Node Synchronization...");
    try {
      const formData = new FormData();
      formData.append("skills", selectedSkills.join(","));
      formData.append("assets", selectedAssets.join(","));

      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}`,
        {
          method: "PATCH",
          body: formData,
        },
      );

      if (res.ok) {
        toast.success("Audit Registry Updated", { id: syncToast });
        setEmployee({
          ...employee,
          skills: selectedSkills,
          assets: selectedAssets,
        });
        setShowSkillAssetModal(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Handshake Refused", { id: syncToast });
    } finally {
      setUpdating(false);
    }
  };

  // Registry Logic
  const fetchMasterSkills = async () => {
    try {
      const res = await fetch(
        "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
      );
      const data = await res.json();
      setMasterSkills(data || []);
    } catch (err) {
      console.error("Master Sync Failure");
    }
  };

  // Initialize Skill Data when Skill Modal opens
  useEffect(() => {
    if (showSkillModal) {
      fetchMasterSkills();
      const current = Array.isArray(employee?.skills)
        ? employee.skills
        : employee?.skills
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [];
      setSelectedSkills(current);
    }
  }, [showSkillModal, employee]);

  // Initialize Asset Data when Asset Modal opens
  useEffect(() => {
    if (showAssetModal) {
      const current = Array.isArray(employee?.assets)
        ? employee.assets
        : employee?.assets
            ?.split(",")
            .map((a) => a.trim())
            .filter(Boolean) || [];
      setSelectedAssets(current);
    }
  }, [showAssetModal, employee]);

  const handleExperienceSync = async () => {
    setUpdating(true);
    const toastId = toast.loading("Deploying Employment Nodes...");

    try {
      const uploadPromises = experienceList.map(async (exp) => {
        const fd = new FormData();

        // Mandatory Protocol Nodes
        fd.append("company_name", exp.company_name);
        fd.append("job_title", exp.job_title);
        fd.append("start_date", exp.start_date);
        fd.append("end_date", exp.end_date);

        // Master Node Identifiers (Integers)
        if (exp.industry_id)
          fd.append("industry_id", parseInt(exp.industry_id));
        if (exp.department_id)
          fd.append("department_id", parseInt(exp.department_id));

        // Optional Meta-Data
        if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
        if (exp.location) fd.append("location", exp.location);

        // Artifact Handling
        if (exp.artifact_type === "file" && exp.exp_letter_file) {
          fd.append("exp_letter_file", exp.exp_letter_file);
        } else if (exp.artifact_type === "link" && exp.exp_letter_link) {
          fd.append("exp_letter_link", exp.exp_letter_link);
        }

        const res = await fetch(
          `https://apihrr.goelectronix.co.in/candidates/${id}/experiences`,
          {
            method: "POST",
            body: fd,
          },
        );
        if (!res.ok) throw new Error();
        return res.json();
      });

      await Promise.all(uploadPromises);

      toast.success("Nodes Integrated Successfully", { id: toastId });

      // Refresh main profile to show the new list
      const freshRes = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}`,
      );
      const freshData = await freshRes.json();
      setEmployee(freshData);

      // 🛠️ FINAL PURGE: Wiping local state
      setExperienceList([]);
      setShowExperienceModal(false);
    } catch (err) {
      toast.error("Handshake Failed: Ensure all fields are filled", {
        id: toastId,
      });
    } finally {
      setUpdating(false);
    }
  };

  // Independent Sync Handlers
  const syncSkills = async () => {
    setUpdating(true);
    const toastId = toast.loading("Syncing Skill Matrix...");
    try {
      const fd = new FormData();
      fd.append("skills", selectedSkills.join(","));
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}`,
        { method: "PATCH", body: fd },
      );
      if (res.ok) {
        toast.success("Skill Node Updated", { id: toastId });
        setEmployee({ ...employee, skills: selectedSkills });
        setShowSkillModal(false);
      } else throw new Error();
    } catch (err) {
      toast.error("Sync Failed", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  const addManualSkill = () => {
    const skill = newSkillInput.trim();
    // Case-insensitive check to prevent duplicates
    if (
      skill &&
      !selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
    ) {
      setSelectedSkills([...selectedSkills, skill]);
      setNewSkillInput("");
    }
  };

  const syncAssets = async () => {
    setUpdating(true);
    const toastId = toast.loading("Syncing Asset Registry...");
    try {
      const fd = new FormData();
      fd.append("assets", selectedAssets.join(","));
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}`,
        { method: "PATCH", body: fd },
      );
      if (res.ok) {
        toast.success("Asset Node Updated", { id: toastId });
        setEmployee({ ...employee, assets: selectedAssets });
        setShowAssetModal(false);
      } else throw new Error();
    } catch (err) {
      toast.error("Sync Failed", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  const formatDocUrl = (rawUrl) => {
    if (!rawUrl) return "#";
    const path = rawUrl.split("uploads/")[1];
    return `https://apihrr.goelectronix.co.in/uploads/${path}`;
  };

  const calculateTotalExperience = (experiences) => {
    if (!experiences || experiences.length === 0) return "0 Months";
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.start_date);
      const end = exp.end_date ? new Date(exp.end_date) : new Date();
      const diff =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, diff);
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0) return `${months} Months`;
    return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
  };

  const handleLanguageUpdate = async () => {
    setUpdating(true);
    const syncToast = toast.loading("Synchronizing Linguistic Nodes...");

    try {
      const formData = new FormData();
      // Convert array to comma-separated string
      formData.append("languages_spoken", selectedLangs.join(","));

      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}`,
        {
          method: "PATCH",
          body: formData,
        },
      );

      if (res.ok) {
        toast.success("Registry Updated Successfully", { id: syncToast });
        // Refresh local employee state
        setEmployee({ ...employee, languages_spoken: selectedLangs });
        setShowLanguageModal(false);
      } else {
        throw new Error("Protocol Rejection");
      }
    } catch (err) {
      toast.error("Handshake Failed", { id: syncToast });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddExperienceNode = async (e) => {
    e.preventDefault();
    setIsSubmittingExp(true);
    const loadingToast = toast.loading("Deploying Employment Node...");

    try {
      const formData = new FormData();

      // REQUIRED PROTOCOL NODES
      formData.append("company_name", newExp.company_name);
      formData.append("job_title", newExp.job_title);
      formData.append("start_date", newExp.start_date);
      formData.append("end_date", newExp.end_date);

      // CLASSIFICATION NODES (Integers)
      if (newExp.industry_id)
        formData.append("industry_id", parseInt(newExp.industry_id));
      if (newExp.department_id)
        formData.append("department_id", parseInt(newExp.department_id));

      // FINANCIAL & GEO NODES
      if (newExp.previous_ctc)
        formData.append("previous_ctc", newExp.previous_ctc);
      formData.append("location", newExp.location);
      formData.append("description", newExp.description);

      // ARTIFACT NODES (Binary & Link)
      if (newExp.exp_letter_file)
        formData.append("exp_letter_file", newExp.exp_letter_file);
      if (newExp.exp_letter_link)
        formData.append("exp_letter_link", newExp.exp_letter_link);

      const res = await fetch(
        `https://apihrr.goelectronix.co.in/candidates/${id}/experiences`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (res.ok) {
        toast.success("Node Integrated Successfully", { id: loadingToast });
        // Refresh local profile logic here...
        setShowExperienceModal(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Handshake Failed", { id: loadingToast });
    } finally {
      setIsSubmittingExp(false);
    }
  };


  const handleResumeDirectUpload = async (file) => {
  if (!file) return;

  const syncToast = toast.loading("Executing Registry Artifact Sync...");
  setUpdating(true);

  try {
    const fd = new FormData();
    fd.append("resumepdf", file); // 🛠️ Ensure key matches your backend schema
    fd.append("full_name", employee.full_name); // Prevents validation errors

    const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`, {
      method: "PATCH",
      body: fd,
    });

    if (res.ok) {
      toast.success("Document Verified & Live", { id: syncToast });
      
      // 🔥 RE-HYDRATE: Pull fresh data from API to toggle the UI state
      const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
      const freshData = await freshRes.json();
      setEmployee(freshData);
    } else {
      throw new Error();
    }
  } catch (err) {
    toast.error("Handshake Failed: PDF Rejected", { id: syncToast });
  } finally {
    setUpdating(false);
  }
};

const handleAddCertificate = async () => {
  // 1. Validation Logic
  if (!certForm.name.trim()) {
    return toast.error("Artifact Label (Name) is required");
  }

  const syncToast = toast.loading("Deploying new credential node...");
  setUpdating(true);

  try {
    const apiData = new FormData();
    
    // Exact keys from your API documentation image
    apiData.append("name", certForm.name.trim());

    if (certForm.uploadMode === "file" && certForm.certificate_file) {
      apiData.append("certificate_file", certForm.certificate_file);
    } else if (certForm.uploadMode === "link" && certForm.certificate_link) {
      apiData.append("certificate_link", certForm.certificate_link.trim());
    }

    // Endpoint: /{person_type}/{person_id}/certificates
    const response = await fetch(
      `https://apihrr.goelectronix.co.in/candidates/${id}/certificates`, 
      {
        method: "POST",
        body: apiData,
      }
    );

    if (response.ok) {
      toast.success("Credential Registered Successfully", { id: syncToast });
      
      // Reset Local UI State
      setShowCertEditModal(false);
      setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" });

      // 🔥 RE-HYDRATE: Pull fresh list to show new certificate in the grid
      const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
      const freshData = await freshRes.json();
      setEmployee(freshData);
    } else {
      throw new Error();
    }
  } catch (err) {
    toast.error("Handshake Failed: Registry rejected document", { id: syncToast });
  } finally {
    setUpdating(false);
  }
};

const handleCertificateSync = async () => {
  if (!certForm.name.trim()) return toast.error("Artifact Label is required");

  const isUpdate = !!editingCertificate;
  const syncToast = toast.loading(isUpdate ? "Patching Node Artifact..." : "Deploying New Node...");
  setUpdating(true);

  try {
    const fd = new FormData();
    fd.append("name", certForm.name.trim());

    // Only append if a new file is selected or a link is provided
    if (certForm.uploadMode === "file" && certForm.certificate_file) {
      fd.append("certificate_file", certForm.certificate_file);
    } else if (certForm.uploadMode === "link" && certForm.certificate_link) {
      fd.append("certificate_link", certForm.certificate_link.trim());
    }

    /* 🛠️ API URL Selection based on mode */
    const url = isUpdate 
      ? `https://apihrr.goelectronix.co.in/candidates/${id}/certificates/${editingCertificate.id}`
      : `https://apihrr.goelectronix.co.in/candidates/${id}/certificates`;

    const res = await fetch(url, {
      method: isUpdate ? "PUT" : "POST",
      body: fd,
    });

    if (res.ok) {
      toast.success(isUpdate ? "Artifact Updated ✅" : "Registered Successfully ✅", { id: syncToast });
      setShowCertEditModal(false);
      
      // Clean Registry States
      setEditingCertificate(null);
      setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" });

      // Refresh Data Load
      const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
      const freshData = await freshRes.json();
      setEmployee(freshData);
    } else {
      throw new Error();
    }
  } catch (err) {
    toast.error("Handshake Failed: Registry Node rejected", { id: syncToast });
  } finally {
    setUpdating(false);
  }
};

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <nav className="flex text-sm font-medium text-slate-500 gap-2">
              <span className="hover:text-blue-600 cursor-pointer">
                Candidates
              </span>
              <span>/</span>
              <span className="text-slate-900 font-bold tracking-tight">
                {employee?.full_name}
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT COLUMN */}

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              {/* Decorative Background Icon */}
              <Fingerprint
                className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none"
                size={140}
              />

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative group mb-6">
                  <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
                  <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
                      {employee?.profile_image ? (
                        <img
                          src={employee.profile_image}
                          alt={employee?.full_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
                          <User
                            size={42}
                            className="text-white mb-1"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                  {employee?.full_name || "Unknown"}
                </h1>
              </div>

              {/* DATA STACK: Left Aligned Personal Info */}
              <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
                <SidebarInfo
                  icon={<Mail />}
                  label=" Email"
                  value={employee?.email}
                />
                <SidebarInfo
                  icon={<Smartphone />}
                  label="Primary Contact"
                  value={employee?.phone}
                />

                {/* ADDED DOB & GENDER HERE */}
                <div className="grid grid-cols-2 gap-4">
                  <SidebarInfo
                    icon={<Calendar />}
                    label="Birth date"
                    value={employee?.dob}
                  />
                  <SidebarInfo
                    icon={<User />}
                    label="Gender"
                    // value={employee?.gender}
                    value={
                      employee?.gender
                        ? employee.gender.charAt(0).toUpperCase() +
                          employee.gender.slice(1)
                        : ""
                    }
                  />
                </div>
                <SidebarInfo
                  icon={<MapPin />}
                  label="Location"
                  value={
                    [employee?.city, employee?.state, employee?.pincode]
                      .filter(
                        (val) =>
                          val &&
                          val !== "null" &&
                          val !== "Not Specified" &&
                          val !== "",
                      ) // Removes null, "null" string, empty strings, and duplicates
                      .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
                  }
                />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                label="Candidate Overview"
                icon={<Activity size={18} />}
              />
              <TabButton
                active={activeTab === "vault"}
                onClick={() => setActiveTab("vault")}
                label="Document"
                icon={<ShieldCheck size={18} />}
              />
              <TabButton
                active={activeTab === "logs"}
                onClick={() => setActiveTab("logs")}
                label="Candidate Logs"
                icon={<History size={18} />}
              />
            </div>

            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
                    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
                      {/* Decorative Security Pattern Header */}
                      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

                      <div className="flex flex-col md:flex-row items-stretch">
                        {/* Branding Box (Left) */}
                        <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                            <Languages size={24} strokeWidth={1.5} />
                          </div>
                          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
                            Language
                          </h3>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                            Spoken
                          </p>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 flex items-center">
                          {/* 🛠️ ACTION NODE: ADD/EDIT BUTTON */}
                          <div className="absolute top-4 right-6">
                            <button
                              onClick={() => setShowLanguageModal(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-95 group/btn"
                            >
                              <Plus
                                size={12}
                                strokeWidth={3}
                                className="group-hover/btn:rotate-90 transition-transform"
                              />
                              Edit Languages
                            </button>
                          </div>
                          <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Languages
                              </span>
                              <div className="h-[1px] flex-1 bg-slate-100" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {employee?.languages_spoken?.length > 0 ? (
                                employee.languages_spoken.map((lang, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[11px] font-black text-slate-700 uppercase">
                                      {lang}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-slate-600 font-medium">
                                  No language data
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Globe
                        className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none"
                        size={120}
                      />
                    </div>

                    {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
                    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
                      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

                      <div className="flex flex-col md:flex-row items-stretch">
                        {/* Branding Box (Left) */}
                        <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
                            <Cpu size={24} strokeWidth={1.5} />
                          </div>
                          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
                            Assets & Skill
                          </h3>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                            Assets & Skills Data
                          </p>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Skills Subsection */}

                          <div className="space-y-4">
                            <div className="flex items-center justify-between group/sub">
                              <div className="flex items-center gap-2">
                                <Layers size={14} className="text-blue-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  Skills
                                </span>
                              </div>
                              <button
                                onClick={() => setShowSkillModal(true)}
                                className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
                              >
                                <Edit3 size={12} strokeWidth={2.5} />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {employee?.skills &&
                              (Array.isArray(employee.skills)
                                ? employee.skills.length > 0
                                : String(employee.skills).trim() !== "") ? (
                                (() => {
                                  const allSkills = Array.isArray(
                                    employee.skills,
                                  )
                                    ? employee.skills
                                    : String(employee.skills).split(",");
                                  const hasOverflow = allSkills.length > 4;
                                  const visibleSkills = isSkillsExpanded
                                    ? allSkills
                                    : allSkills.slice(0, 4);

                                  return (
                                    <>
                                      {visibleSkills.map((skill, i) => (
                                        <span
                                          key={i}
                                          className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default animate-in fade-in zoom-in-95"
                                        >
                                          {typeof skill === "string"
                                            ? skill.trim()
                                            : String(skill)}
                                        </span>
                                      ))}

                                      {/* 🛠️ EXPANSION NODE */}
                                      {hasOverflow && (
                                        <button
                                          onClick={() =>
                                            setIsSkillsExpanded(
                                              !isSkillsExpanded,
                                            )
                                          }
                                          className="px-2.5 py-1 bg-white text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                          {isSkillsExpanded
                                            ? "Show Less"
                                            : `+${allSkills.length - 4} More`}
                                        </button>
                                      )}
                                    </>
                                  );
                                })()
                              ) : (
                                <span className="text-xs text-slate-800 font-medium italic opacity-60">
                                  No Skill Added
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Assets Subsection */}

                          <div className="space-y-4">
                            {/* SECTION HEADER */}
                            <div className="flex items-center justify-between group/sub">
                              <div className="flex items-center gap-2">
                                <Monitor size={14} className="text-blue-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  Assets
                                </span>
                              </div>

                              <button
                                onClick={() => setShowAssetModal(true)}
                                className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
                              >
                                <Edit3 size={12} strokeWidth={2.5} />
                              </button>
                            </div>

                            {/* CHIP CONTAINER */}
                            <div className="flex flex-wrap gap-1.5">
                              {employee?.assets &&
                              (Array.isArray(employee.assets)
                                ? employee.assets.length > 0
                                : String(employee.assets).trim() !== "") ? (
                                (() => {
                                  // Normalize data into a unified array
                                  const allAssets = Array.isArray(
                                    employee.assets,
                                  )
                                    ? employee.assets
                                    : String(employee.assets).split(",");
                                  const hasOverflow = allAssets.length > 4;
                                  const visibleAssets = isAssetsExpanded
                                    ? allAssets
                                    : allAssets.slice(0, 4);

                                  return (
                                    <>
                                      {visibleAssets.map((asset, i) => (
                                        <span
                                          key={i}
                                          className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm animate-in fade-in zoom-in-95"
                                        >
                                          {typeof asset === "string"
                                            ? asset.trim()
                                            : String(asset)}
                                        </span>
                                      ))}

                                      {/* 🛠️ ASSET EXPANSION NODE */}
                                      {hasOverflow && (
                                        <button
                                          onClick={() =>
                                            setIsAssetsExpanded(
                                              !isAssetsExpanded,
                                            )
                                          }
                                          className="px-2.5 py-1 bg-white text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                          {isAssetsExpanded
                                            ? "Show Less"
                                            : `+${allAssets.length - 4} More`}
                                        </button>
                                      )}
                                    </>
                                  );
                                })()
                              ) : (
                                <span className="text-xs text-slate-800 font-medium italic opacity-60">
                                  No Assets Allocated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Layers
                        className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none"
                        size={120}
                      />
                    </div>
                  </div>

                  <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">
                    {/* SYSTEM WATERMARK: Large rotated background icon */}
                    <History
                      className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
                      size={260}
                      strokeWidth={1}
                    />

                    {/* HEADER SECTION */}
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                          <History size={18} strokeWidth={2.5} />
                        </div>

                        <div>
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
                            Candidate
                          </h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Previous Job History
                          </p>
                        </div>
                      </div>

                      {/* TENURE COUNTER */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                            Total Experience
                          </span>
                          <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
                            {calculateTotalExperience(employee?.experiences)}
                          </span>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                        <div className="flex items-center gap-2 px-3 py-1  rounded-full">
                          {/* EDIT BUTTON */}

                          <button
                            type="button"
                            onClick={() => {
                              setExperienceList([]); // Force immediate purge
                              setShowExperienceModal(true); // Deploy Modal
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 border border-slate-200 hover:border-blue-500 text-white hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
                          >
                            Add Experience
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BODY CONTENT */}
                    <div className="relative z-10">
                      {employee?.experiences &&
                      employee.experiences.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {employee.experiences.map((exp, i) => {
                            const industryName =
                              industries.find(
                                (ind) => ind.id === exp.industry_id,
                              )?.name || "General Industry";
                            const departmentName =
                              departments.find(
                                (dep) => dep.id === exp.department_id,
                              )?.name || "Operations";

                            // 🛠️ INDIVIDUAL DURATION CALCULATION PROTOCOL
                            const calculateSingleDuration = (start, end) => {
                              if (!start) return "—";
                              const startDate = new Date(start);
                              const endDate = end ? new Date(end) : new Date();

                              let months =
                                (endDate.getFullYear() -
                                  startDate.getFullYear()) *
                                  12 +
                                (endDate.getMonth() - startDate.getMonth());
                              months = Math.max(0, months);

                              const years = Math.floor(months / 12);
                              const remainingMonths = months % 12;

                              const yrText =
                                years > 0
                                  ? `${years} yr${years > 1 ? "s" : ""}`
                                  : "";
                              const moText =
                                remainingMonths > 0
                                  ? `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`
                                  : "";

                              return (
                                [yrText, moText].filter(Boolean).join(" ") ||
                                "1 mo"
                              );
                            };

                            return (
                              <div
                                key={i}
                                className="group hover:bg-slate-50/40 transition-colors duration-300"
                              >
                                <div className="flex flex-col md:flex-row p-8 gap-8">
                                  {/* TIME IDENTIFIER */}
                                  <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                                    <span className="text-xl font-black text-slate-900 tracking-tighter">
                                      {exp?.start_date
                                        ? new Date(exp.start_date).getFullYear()
                                        : "----"}
                                    </span>
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
                                      {exp?.start_date
                                        ? new Date(
                                            exp.start_date,
                                          ).toLocaleDateString("en-IN", {
                                            month: "short",
                                          })
                                        : "---"}{" "}
                                      DEPLOYMENT
                                    </span>
                                  </div>

                                  {/* CONTENT BODY */}

                                  {/* CONTENT BODY */}
                                  <div className="flex-1 space-y-4">
                                    {/* TOP ROW: IDENTITY + TENURE / ACTIONS */}

                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                      {/* LEFT SIDE: PRIMARY IDENTITY */}
                                      <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                            {exp?.company_name || "-"}
                                          </h4>
                                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {exp?.location || "-"}
                                          </span>
                                        </div>
                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">
                                          {exp?.job_title || "-"}
                                        </p>
                                      </div>

                                      {/* RIGHT SIDE: STATUS NODES + EDIT ACTION */}
                                      <div className="flex items-start gap-4">
                                        {/* DATA NODES STACK */}
                                        <div className="flex items-end gap-2">
                                          {/* Tenure Branding Box */}
                                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                                            <Calendar
                                              size={12}
                                              className="text-blue-500"
                                            />
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                              {calculateSingleDuration(
                                                exp.start_date,
                                                exp.end_date,
                                              )}
                                            </span>
                                          </div>

                                          {/* Artifact Node */}
                                          {exp?.experience_letter_path ? (
                                            <a
                                              href={exp.experience_letter_path}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
                                            >
                                              <FileText
                                                size={12}
                                                className="text-slate-400 group-hover/artifact:text-blue-500"
                                              />
                                              Letter
                                              <ExternalLink
                                                size={10}
                                                className="opacity-40"
                                              />
                                            </a>
                                          ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
                                              <Shield
                                                size={12}
                                                className="text-slate-300"
                                              />
                                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                No Artifact
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* EDIT ACTION NODE: Separated for clarity */}
                                        <div className="h-full pt-0.5">
                                          <button
                                            onClick={() => {
                                              setEditingExp({
                                                ...exp,
                                                artifact_type:
                                                  exp.experience_letter_path
                                                    ? "link"
                                                    : "file",
                                                exp_letter_link:
                                                  exp.experience_letter_path ||
                                                  "",
                                              });
                                              setShowEditExpModal(true);
                                            }}
                                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 hover:shadow-inner rounded-xl transition-all border border-slate-100"
                                            title="Modify Entry"
                                          >
                                            <Edit3
                                              size={16}
                                              strokeWidth={2.5}
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* BOTTOM ROW: FINANCIALS & TIMELINE */}

                                    {/* BOTTOM ROW: FINANCIALS, TIMELINE & CLASSIFICATION */}
                                    <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4 border-t border-slate-50">
                                      {/* INDUSTRY NODE */}
                                      <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                          Industry
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase">
                                          {industryName}
                                        </span>
                                      </div>

                                      <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                          Department
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase">
                                          {departmentName}
                                        </span>
                                      </div>

                                      {/* CTC NODE */}
                                      <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                          Previous CTC
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-blue-600 font-black text-[10px]">
                                            ₹
                                          </span>
                                          <span className="text-[11px] font-bold text-slate-700">
                                            {exp?.previous_ctc
                                              ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
                                              : "Not Specified"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* TIMELINE NODE */}
                                      <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                          Timeline
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
                                          {exp?.start_date
                                            ? new Date(
                                                exp.start_date,
                                              ).toLocaleDateString("en-IN", {
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : "---"}
                                          {" — "}
                                          {exp?.end_date
                                            ? new Date(
                                                exp.end_date,
                                              ).toLocaleDateString("en-IN", {
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : "Present"}
                                        </span>
                                      </div>
                                    </div>

                                    {exp?.description && (
                                      <div className="max-w-3xl pt-2">
                                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
                                          "{exp.description}"
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
                            <Database size={28} strokeWidth={1.5} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                            Fresher Profile
                          </h4>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                            No prior professional experience recorded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EDUCATION HISTORY: SYSTEM STREAM */}
                  <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
                    {/* SYSTEM WATERMARK */}
                    <Award
                      className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
                      size={260}
                      strokeWidth={1}
                    />

                    {/* HEADER SECTION */}
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                          <Award size={18} strokeWidth={2.5} />
                        </div>

                        <div>
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
                            Academic History
                          </h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Education History
                          </p>
                        </div>
                      </div>

                      {/* EDIT REDIRECT */}
                      <div className="flex items-center gap-2 px-3 py-1  rounded-full">
                       
                        <button
                          onClick={() => setShowAddEduModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-200 transition-all active:scale-95 group"
                        >
                          <Plus
                            size={14}
                            strokeWidth={3}
                            className="group-hover:rotate-90 transition-transform"
                          />
                          Add Academic
                        </button>
                      </div>
                    </div>

                    

                    <div className="relative z-10">
                      {employee?.educations &&
                      employee.educations.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {employee.educations.map((edu, i) => (
                            <div
                              key={i}
                              className="group/item hover:bg-slate-50/40 transition-colors duration-300 relative"
                            >
                              {/* --- MODAL TRIGGER AREA (Top Right) --- */}
                              <div className="absolute top-8 right-8 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => {
                                    setEditingEdu(edu);
                                    setShowEditEduModal(true);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                                >
                                  <Edit3 size={12} strokeWidth={2.5} />
                                  Edit
                                </button>
                              </div>

                              <div className="flex flex-col md:flex-row p-8 gap-8">
                                {/* TIME IDENTIFIER */}
                                <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                                  <span className="text-xl font-black text-slate-900 tracking-tighter">
                                    {edu?.end_year || "----"}
                                  </span>
                                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
                                    GRADUATION
                                  </span>
                                </div>

                          
                                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-2">
                                  {/* TIMELINE STACK */}
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                      Academic Period
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Calendar
                                        size={12}
                                        className="text-slate-300"
                                      />
                                      <span className="text-[11px] font-bold text-slate-700 uppercase">
                                        {edu?.start_year || "----"} —{" "}
                                        {edu?.end_year || "----"}
                                      </span>
                                    </div>
                                  </div>

                                
                                  {/* PERFORMANCE STACK */}
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                      Academic Score
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {edu?.score ? (
                                        // SUCCESS STATE: Data is present
                                        <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md shadow-sm">
                                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                                            {edu.score_metric}: {edu.score}
                                          </span>
                                        </div>
                                      ) : (
                                        // NEUTRAL STATE: Data is missing
                                        <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">
                                            Not Specified
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* EMPTY STATE */
                        <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
                            <GraduationCap size={28} strokeWidth={1.5} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                            No Academic Records
                          </h4>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                            Node synchronized but education array is empty
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "vault" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Resume
                      </h3>
                    </div>
                    {employee?.resume_path ? (
                      <ModernDocCard
                        title="Master Curriculum Vitae"
                        url={employee.resume_path}
                        type="resume"
                        formatDocUrl={formatDocUrl}
                      />
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                          Resume Missing
                        </p>
                      </div>
                    )}
                  </div> */}
                  {/* RESUME SECTION */}
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Primary Resume
          </h3>
        </div>

        {/* 🛠️ ADD BUTTON: Only shows if resume is missing */}
        {!employee?.resume_path && (
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-200 transition-all active:scale-95 cursor-pointer group">
            <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Upload Master CV
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf" 
              onChange={(e) => handleResumeDirectUpload(e.target.files[0])} 
            />
          </label>
        )}
      </div>

      {employee?.resume_path ? (
        <ModernDocCard
          title="Resume"
          url={employee.resume_path}
          type="resume"
          formatDocUrl={formatDocUrl}
          showEdit={false}
        />
      ) : (
        /* EMPTY STATE */
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-blue-300 transition-all">
          <FileText size={32} className="text-slate-200 mb-3 group-hover:text-blue-200 transition-colors" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Registry Entry Vacant
          </p>
          <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
            No PDF artifact detected for this candidate
          </p>
        </div>
      )}
    </div>

  
                  {/* <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Certificate
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employee?.certificates?.map((cert) => (
                        <ModernDocCard
                          key={cert.id}
                          title={cert.name}
                          url={cert.file_path}
                          type="Certificate"
                          formatDocUrl={formatDocUrl}
                          icon={Award}
                        />
                      )) || (
                        <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">
                          No Certificates Found
                        </div>
                      )}
                    </div>
                  </div> */}
                  <div className="space-y-4">
  <div className="flex items-center justify-between px-2">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        Certificate
      </h3>
    </div>
    
    {/* 🛠️ ADD ACTION: Deploys the modal */}
    {/* <button 
      onClick={() => { setEditingCertificate(null); setShowCertEditModal(true); }}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 group"
    >
      <PlusCircle size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
      Add Certificate
    </button> */}
    <button 
  onClick={() => { 
    setEditingCertificate(null); // Clear any previous edit state
    setCertForm({ name: "", certificate_file: null, certificate_link: "", uploadMode: "file" }); // Reset form
    setShowCertEditModal(true); 
  }}
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 group"
>
  <PlusCircle size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
  Add Certificate
</button>
  </div>

  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {employee?.certificates?.length > 0 ? (
      employee.certificates.map((cert) => (
        <ModernDocCard
          key={cert.id}
          title={cert.name}
          url={cert.file_path || cert.certificate_link}
          type="Certificate"
          formatDocUrl={formatDocUrl}
          icon={Award}
        />
      ))
    ) : (
      <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-[2rem]">
        No Certificates Synchronized
      </div>
    )}
  </div> */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {employee?.certificates?.length > 0 ? (
    employee.certificates.map((cert) => (
      /* 🛠️ Container for hover actions */
      <div key={cert.id} className="relative group/card">
        <ModernDocCard
          title={cert.name}
          url={cert.file_path || cert.certificate_link}
          type="Certificate"
          formatDocUrl={formatDocUrl}
          icon={Award}
          onEdit={() => {
          setEditingCertificate(cert);
          setCertForm({
            name: cert.name,
            uploadMode: cert.certificate_link ? "link" : "file",
            certificate_file: null,
            certificate_link: cert.certificate_link || ""
          });
          setShowCertEditModal(true);
        }}
        />
        
        {/* 🛠️ Edit Button: Positioned Top-Right */}
        {/* <button
          onClick={() => {
            setEditingCertificate(cert); // Identify which node is being modified
            setCertForm({
              name: cert.name,
              uploadMode: cert.certificate_link ? "link" : "file",
              certificate_file: null, // Reset file so it only updates if a new one is picked
              certificate_link: cert.certificate_link || ""
            });
            setShowCertEditModal(true);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all opacity-0 group-hover/card:opacity-100 active:scale-95 z-10"
          title="Edit Node"
        >
          <Edit3 size={14} strokeWidth={2.5} />
        </button> */}
      </div>
    ))
  ) : (
    <div className="col-span-full text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-[2rem]">
      No Certificates Synchronized
    </div>
  )}
</div>
</div>
                </div>
              )}


              {activeTab === "logs" && (
                <></>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* --- ENTERPRISE MODAL PORTAL --- */}

      {showLanguageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => !updating && setShowLanguageModal(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Languages size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Update Languages
                </h3>
              </div>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="p-8">
              {/* <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
                Select nodes to sync with the candidate's communication stack.
              </p> */}

              {/* CHIP SELECTION GRID */}
              <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {[...new Set([...DEFAULT_LANGS, ...selectedLangs])].map(
                  (lang) => {
                    const isSelected = selectedLangs.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedLangs((prev) =>
                            isSelected
                              ? prev.filter((l) => l !== lang)
                              : [...prev, lang],
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                            : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                        }`}
                      >
                        {lang}
                        {isSelected && (
                          <CheckCircle size={12} strokeWidth={3} />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              <button
                disabled={updating}
                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                onClick={handleLanguageUpdate}
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <BadgeCheck size={16} />
                )}
                {updating ? "Submitting..." : "Update Languge"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SKILL REGISTRY --- */}

      {showSkillModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => !updating && setShowSkillModal(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* HEADER NODE */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
                  <Layers size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Skill
                </h3>
              </div>
              <button
                onClick={() => setShowSkillModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* INPUT NODE: Manual Entry */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">
                  Skill
                </label>
                <div className="flex gap-2">
                  <input
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Type and press Enter..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addManualSkill())
                    }
                  />
                  <button type="button" onClick={addManualSkill} className="px-5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Add Skill</button>
                </div>
              </div>

              {/* ACTIVE NODES AREA (Everything in this list will be sent to API) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Selected Skills
                  </label>
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedSkills.length} Selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-100 min-h-[80px]">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black uppercase shadow-sm animate-in zoom-in-95"
                      >
                        {skill}
                        <X
                          size={12}
                          className="cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() =>
                            setSelectedSkills(
                              selectedSkills.filter((_, idx) => idx !== i),
                            )
                          }
                        />
                      </span>
                    ))
                  ) : (
                    <p className="text-[9px] font-black text-slate-300 uppercase m-auto tracking-widest">
                      No Skills
                    </p>
                  )}
                </div>
              </div>

              {/* MASTER REGISTRY: Quick Toggle Nodes */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Skill History
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                  {masterSkills.map((item) => {
                    const name = item.name || item;
                    const isSelected = selectedSkills.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() =>
                          setSelectedSkills((prev) =>
                            isSelected
                              ? prev.filter((s) => s !== name)
                              : [...prev, name],
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
                          isSelected
                            ? "bg-blue-500 border-blue-500 text-white shadow-md"
                            : "bg-slate-50 border-slate-500 text-slate-800 hover:border-blue-200"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                disabled={updating}
                onClick={syncSkills}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                Save Skills
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: HARDWARE ASSETS --- */}

      {showAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with Glassmorphism */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !updating && setShowAssetModal(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* 1. BRANDED HEADER */}
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
              <div className="flex items-center gap-5">
                {/* LOGO NODE */}
                <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
                  <Monitor size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                    Asset
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Update the assets
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAssetModal(false)}
                className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="p-10 space-y-8 bg-white">
              {/* 2. INPUT NODE */}
              {/* <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-1">
                  Add Assets
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                      <Plus size={16} strokeWidth={3} />
                    </div>
                    <input
                      value={newAssetInput}
                      onChange={(e) => setNewAssetInput(e.target.value)}
                      placeholder="e.g. MacBook Pro M3"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newAssetInput.trim()) {
                            setSelectedAssets([
                              ...selectedAssets,
                              newAssetInput.trim(),
                            ]);
                            setNewAssetInput("");
                          }
                        }
                      }}
                    />
                   
    <button
      type="button"
      disabled={!newAssetInput.trim()}
      onClick={() => {
        if (newAssetInput.trim()) {
          setSelectedAssets([...selectedAssets, newAssetInput.trim()]);
          setNewAssetInput("");
        }
      }}
      className="px-6 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale disabled:scale-100"
    >
      <Plus size={20} strokeWidth={3} />
    </button>
                  </div>
                </div>
              </div> */}

              {/* ASSET REGISTRY INPUT NODE */}
<div className="space-y-3">
  <div className="flex items-center justify-between ml-1">
    <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
      Identify Asset
    </label>
    {newAssetInput.trim() && (
      <span className="text-[8px] font-black text-slate-400 uppercase animate-pulse">
        Press Enter to Quick-Add
      </span>
    )}
  </div>

  <div className="relative group">
    {/* CONTEXT ICON */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors z-10 pointer-events-none">
      <Monitor size={18} strokeWidth={2.5} />
    </div>

    {/* ENTERPRISE INPUT */}
    <input
      value={newAssetInput}
      onChange={(e) => setNewAssetInput(e.target.value)}
      placeholder="e.g. MacBook Pro M3"
      className="w-full pl-12 pr-16 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner placeholder:text-slate-300"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (newAssetInput.trim()) {
            setSelectedAssets([...selectedAssets, newAssetInput.trim()]);
            setNewAssetInput("");
          }
        }
      }}
    />

    {/* 🛠️ ATTRACTIVE ACTION NODE */}
    <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
      <button
        type="button"
        disabled={!newAssetInput.trim()}
        onClick={() => {
          if (newAssetInput.trim()) {
            setSelectedAssets([...selectedAssets, newAssetInput.trim()]);
            setNewAssetInput("");
          }
        }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-0 disabled:translate-x-4 pointer-events-auto
          ${newAssetInput.trim() 
            ? "bg-blue-600 text-white shadow-blue-200 opacity-100 translate-x-0" 
            : "bg-slate-100 text-slate-400 opacity-0"
          }`}
      >
        <span>Add</span>
        <Plus size={14} strokeWidth={4} />
      </button>
    </div>
  </div>
</div>

              {/* 3. ENHANCED CHIP CONTAINER (Matched to Skills Style) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Selected Assets
                  </label>
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
                    {selectedAssets.length} Allocated
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[120px] items-start content-start">
                  {selectedAssets.length > 0 ? (
                    selectedAssets.map((asset, i) => (
                      <div
                        key={i}
                        className="group/chip flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm hover:border-blue-400 hover:shadow-md transition-all animate-in zoom-in-95"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {asset}
                        <button
                          onClick={() =>
                            setSelectedAssets(
                              selectedAssets.filter((_, idx) => idx !== i),
                            )
                          }
                          className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="m-auto flex flex-col items-center gap-2 opacity-30">
                      <Database size={24} strokeWidth={1.5} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Registry Vacant
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. SUBMIT ACTION */}
              <button
                disabled={updating}
                onClick={syncAssets}
                className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <ShieldCheck size={20} /> Commit Allocation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExperienceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => !updating && setShowExperienceModal(false)}
          />

          <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
            {/* HEADER */}
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Add Experience
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Add New Experiance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExperienceModal(false)}
                className="p-2 hover:!bg-slate-200 rounded-full !bg-transparent border !text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
              {experienceList.map((exp, index) => (
                <div
                  key={index}
                  className="group p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative hover:border-blue-300 transition-all space-y-6"
                >
                  <button
                    onClick={() =>
                      setExperienceList(
                        experienceList.filter((_, i) => i !== index),
                      )
                    }
                    className="absolute top-4 right-4 p-2 !text-slate-300 hover:!text-red-500 transition-colors !bg-white rounded-full shadow-sm"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>

                  {/* GRID 1: IDENTITY */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Company Name
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
                        placeholder="e.g. Google"
                        value={exp.company_name}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].company_name = e.target.value;
                          setExperienceList(newList);
                        }}
                      />
                    </div>
                    {/* <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Industry
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
                        value={exp.industry_id}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].industry_id = e.target.value;
                          setExperienceList(newList);
                        }}
                      >
                        <option value="">Select Industry</option>
                        {industries.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.name}
                          </option>
                        ))}
                      </select>
                    </div> */}
                      <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Industry
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
                        value={exp.industry_id}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].industry_id = e.target.value;
                          setExperienceList(newList);
                        }}
                      >
                        <option value="">Select Industry</option>
                        {industries.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* GRID 2: INDUSTRY & DEPARTMENT SELECTION */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Department
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
                        value={exp.department_id}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].department_id = e.target.value;
                          setExperienceList(newList);
                        }}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                          <option key={dep.id} value={dep.id}>
                            {dep.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Position
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
                        placeholder="e.g. Senior Dev"
                        value={exp.job_title}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].job_title = e.target.value;
                          setExperienceList(newList);
                        }}
                      />
                    </div>
                  </div>

                  {/* GRID 3: TIMELINE & PAYROLL */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Start
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
                        value={exp.start_date}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].start_date = e.target.value;
                          setExperienceList(newList);
                        }}
                      />
                    </div>
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        End
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
                        value={exp.end_date}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].end_date = e.target.value;
                          setExperienceList(newList);
                        }}
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        CTC (LPA)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm"
                        placeholder="e.g. 1200000"
                        value={exp.previous_ctc}
                        onChange={(e) => {
                          const newList = [...experienceList];
                          newList[index].previous_ctc = e.target.value;
                          setExperienceList(newList);
                        }}
                      />
                    </div>
                  </div>

                  {/* ARTIFACT SWITCHER PROTOCOL */}
                  <div className="space-y-4 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                        Validation Artifact
                      </label>
                      <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
                        <button
                          onClick={() => {
                            const nl = [...experienceList];
                            nl[index].artifact_type = "file";
                            setExperienceList(nl);
                          }}
                          className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === "file" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
                        >
                          Upload PDF
                        </button>
                        <button
                          onClick={() => {
                            const nl = [...experienceList];
                            nl[index].artifact_type = "link";
                            setExperienceList(nl);
                          }}
                          className={`px-3 py-1 text-[9px] !bg-transparent font-black uppercase rounded-md transition-all ${exp.artifact_type === "link" ? "!bg-blue-600 !text-white shadow-md" : "!text-slate-400"}`}
                        >
                          External Link
                        </button>
                      </div>
                    </div>

                    <div className="animate-in slide-in-from-top-2 duration-300">
                      {exp.artifact_type === "file" ? (
                        <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => {
                              const newList = [...experienceList];
                              newList[index].exp_letter_file =
                                e.target.files[0];
                              setExperienceList(newList);
                            }}
                          />
                          <Download size={20} className="text-slate-300 mb-1" />
                          <span className="text-[9px] font-black text-slate-400 uppercase">
                            {exp.exp_letter_file
                              ? exp.exp_letter_file.name
                              : "Select Binary File"}
                          </span>
                        </div>
                      ) : (
                        <div className="relative group">
                          <input
                            className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
                            placeholder="https://drive.google.com/..."
                            value={exp.exp_letter_link}
                            onChange={(e) => {
                              const newList = [...experienceList];
                              newList[index].exp_letter_link = e.target.value;
                              setExperienceList(newList);
                            }}
                          />
                          <ExternalLink
                            size={14}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addExperienceNode}
                className="w-full py-5 border-2 border-dashed !border-slate-200 rounded-[2rem] text-[11px] font-black uppercase !text-slate-400 hover:!border-blue-400 hover:!text-blue-600 transition-all flex items-center justify-center gap-3 !bg-slate-50/50"
              >
                <Plus size={16} strokeWidth={3} /> Add New Record
              </button>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white">
              <button
                disabled={
                  updating ||
                  experienceList.length === 0 ||
                  experienceList.some(
                    (exp) =>
                      !exp.company_name ||
                      !exp.job_title ||
                      !exp.start_date ||
                      !exp.end_date,
                  )
                }
                onClick={handleExperienceSync}
                className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
                Add Experiance
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditExpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => !updating && setShowEditExpModal(false)}
          />

          <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
            {/* HEADER - Reused Design */}
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Edit Experience
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Modify Professional Registry Node
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditExpModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative space-y-6">
                {/* GRID 1: IDENTITY */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Company Name
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
                      value={editingExp.company_name}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          company_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Industry
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
                      value={editingExp.industry_id}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          industry_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Industry</option>
                      {industries.map((ind) => (
                        <option key={ind.id} value={ind.id}>
                          {ind.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* GRID 2: DEPT & POSITION */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Department
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
                      value={editingExp.department_id}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          department_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Position
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
                      value={editingExp.job_title}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          job_title: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* GRID 3: DATES & CTC */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Start
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
                      value={editingExp.start_date}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      End
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
                      value={editingExp.end_date}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          end_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      CTC (LPA)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm"
                      value={editingExp.previous_ctc}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          previous_ctc: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* ARTIFACT SWITCHER */}
                <div className="space-y-4 pt-4 border-t border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                      Experiance certificate
                    </label>
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
                      <button
                        onClick={() =>
                          setEditingExp({
                            ...editingExp,
                            artifact_type: "file",
                          })
                        }
                        className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === "file" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
                      >
                        Upload PDF
                      </button>
                      <button
                        onClick={() =>
                          setEditingExp({
                            ...editingExp,
                            artifact_type: "link",
                          })
                        }
                        className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === "link" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
                      >
                        External Link
                      </button>
                    </div>
                  </div>

                  <div className="animate-in slide-in-from-top-2">
                    {editingExp.artifact_type === "file" ? (
                      <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) =>
                            setEditingExp({
                              ...editingExp,
                              exp_letter_file: e.target.files[0],
                            })
                          }
                        />
                        <Download size={20} className="text-slate-300 mb-1" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          {editingExp.exp_letter_file
                            ? editingExp.exp_letter_file.name
                            : "Select New File"}
                        </span>
                      </div>
                    ) : (
                      <div className="relative group">
                        <input
                          className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
                          value={editingExp.exp_letter_link}
                          onChange={(e) =>
                            setEditingExp({
                              ...editingExp,
                              exp_letter_link: e.target.value,
                            })
                          }
                        />
                        <ExternalLink
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white">
              <button
                disabled={updating}
                onClick={handleUpdateExperience}
                className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
                Update Experiance
              </button>
            </div>
          </div>
        </div>
      )}

 

      {showAddEduModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setShowAddEduModal(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Add Academic History
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {" "}
                    New Academic Data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEduModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddEducation}
              className="p-10 space-y-6 bg-white"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Degree Type
                </label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
                  value={newEdu.education_id}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, education_id: e.target.value })
                  }
                >
                  <option value="">Select Degree</option>
                  {masterEducations.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Institution Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
                  placeholder="University of Mumbai"
                  value={newEdu.institution_name}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, institution_name: e.target.value })
                  }
                />
              </div>

              {/* 🛠️ SCORE CONFIGURATION NODE */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Score Type
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
                    value={newEdu.score_metric}
                    onChange={(e) =>
                      setNewEdu({ ...newEdu, score_metric: e.target.value })
                    }
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Score Value
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
                    placeholder={
                      newEdu.score_metric === "Percentage"
                        ? "e.g. 85.5"
                        : "e.g. 9.2"
                    }
                    value={newEdu.score}
                    onChange={(e) =>
                      setNewEdu({ ...newEdu, score: e.target.value })
                    }
                  />
                </div>
              </div>

  

              <div className="grid grid-cols-2 gap-6">
                {/* START YEAR NODE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Start Year
                  </label>
                  <div className="relative group">
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
                      value={newEdu.start_year}
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, start_year: e.target.value })
                      }
                    >
                      <option value="">Year</option>
                      {/* Generates a 40-year window from 2030 downwards */}
                      {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ),
                      )}
                    </select>
                    <Calendar
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
                    />
                  </div>
                </div>

                {/* END YEAR NODE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    End Year
                  </label>
                  <div className="relative group">
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
                      value={newEdu.end_year}
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, end_year: e.target.value })
                      }
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ),
                      )}
                    </select>
                    <Calendar
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={updating}
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}{" "}
                Add Academic
              </button>
            </form>
          </div>
        </div>
      )}

    

      {showEditEduModal && editingEdu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setShowEditEduModal(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
                  <Edit3 size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Edit Academic Record
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Edit Existing Data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditEduModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleEditEducation}
              className="p-10 space-y-6 bg-white"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Degree Type
                </label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
                  value={editingEdu.education_id}
                  onChange={(e) =>
                    setEditingEdu({
                      ...editingEdu,
                      education_id: e.target.value,
                    })
                  }
                >
                  {masterEducations.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Institution Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
                  value={editingEdu.institution_name}
                  onChange={(e) =>
                    setEditingEdu({
                      ...editingEdu,
                      institution_name: e.target.value,
                    })
                  }
                />
              </div>

              {/* 🛠️ SCORE CONFIGURATION NODE */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Score type
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
                    value={editingEdu.score_metric}
                    onChange={(e) =>
                      setEditingEdu({
                        ...editingEdu,
                        score_metric: e.target.value,
                      })
                    }
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Score Value
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
                    value={editingEdu.score}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, score: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* START YEAR NODE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Start Year
                  </label>
                  <div className="relative group">
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
                      value={editingEdu?.start_year || ""}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          start_year: e.target.value,
                        })
                      }
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ),
                      )}
                    </select>
                    <Calendar
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
                    />
                  </div>
                </div>

                {/* END YEAR NODE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    End Year
                  </label>
                  <div className="relative group">
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
                      value={editingEdu?.end_year || ""}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          end_year: e.target.value,
                        })
                      }
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ),
                      )}
                    </select>
                    <Calendar
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={updating}
                type="submit"
                className="w-full py-5 bg-blue-500 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}{" "}
                Edit Academic
              </button>
            </form>
          </div>
        </div>
      )}

      {/* {showCertEditModal && (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !updating && setShowCertEditModal(false)} />
    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">New Certificate</h3>
        <button onClick={() => setShowCertEditModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={18}/></button>
      </div>

      <div className="p-8 space-y-6">
       
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Certificate Name</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. AWS Certified Solutions Architect"
            value={certForm.name}
            onChange={(e) => setCertForm({...certForm, name: e.target.value})}
          />
        </div>

       
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${certForm.uploadMode === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            onClick={() => setCertForm({...certForm, uploadMode: 'file'})}
          >UPLOAD PDF</button>
          <button 
            className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${certForm.uploadMode === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            onClick={() => setCertForm({...certForm, uploadMode: 'link'})}
          >EXTERNAL URI</button>
        </div>

        
        {certForm.uploadMode === 'file' ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 group hover:border-blue-400 transition-all cursor-pointer relative">
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf" onChange={(e) => setCertForm({...certForm, certificate_file: e.target.files[0]})} />
             <FileUp size={24} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
             <span className="text-[10px] font-black text-slate-500 uppercase">{certForm.certificate_file ? certForm.certificate_file.name : "Choose Binary File"}</span>
          </div>
        ) : (
          <div className="relative group">
            <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input className={inputStyle + " pl-12"} placeholder="https://verify.cert.com/id..." value={certForm.certificate_link} onChange={(e) => setCertForm({...certForm, certificate_link: e.target.value})} />
          </div>
        )}

        <button 
          disabled={updating}
          onClick={handleAddCertificate}
          className="w-full py-4 bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {updating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
          Add New Certificate
        </button>
      </div>
    </div>
  </div>
)} */}

{/* {showCertEditModal && (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
   
    <div 
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={() => !updating && setShowCertEditModal(false)} 
    />
    
    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
      
 
      <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
            {editingCertificate ? <Edit3 size={24} strokeWidth={2.5} /> : <Plus size={24} strokeWidth={3} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {editingCertificate ? "Edit Certificate" : "New Certificate"}
            </h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
              {editingCertificate ? "Edit existing Certificate" : "new document Certificate"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowCertEditModal(false)} 
          className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="p-10 space-y-8 bg-white overflow-y-auto custom-scrollbar-professional">
        
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Certificate Name
          </label>
          <input 
            className={inputStyle} 
            placeholder="e.g. AWS Certified Solutions Architect"
            value={certForm.name}
            onChange={(e) => setCertForm({...certForm, name: e.target.value})}
          />
        </div>

        
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Document Format
          </label>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full shadow-inner">
            <button 
              type="button"
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === 'file' ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400'}`}
              onClick={() => setCertForm({...certForm, uploadMode: 'file'})}
            >PDF FILE</button>
            <button 
              type="button"
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === 'link' ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-500'}`}
              onClick={() => setCertForm({...certForm, uploadMode: 'link'})}
            >EXTERNAL URI</button>
          </div>
        </div>

    

<div className="animate-in slide-in-from-top-2 duration-300">
  {certForm.uploadMode === 'file' ? (
    <div className="space-y-4">
      
      {editingCertificate && !certForm.certificate_file && editingCertificate.file_path && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
              <FileCheck size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Existing Artifact Detected</p>
              <p className="text-[8px] font-bold text-emerald-500 uppercase truncate max-w-[180px]">
                {editingCertificate.file_path.split('/').pop()}
              </p>
            </div>
          </div>
          <a 
            href={formatDocUrl(editingCertificate.file_path)} 
            target="_blank" 
            rel="noreferrer"
            className="p-2 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm border border-emerald-100"
          >
            <Eye size={14} />
          </a>
        </div>
      )}

      
      <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center bg-slate-50/50 group/upload hover:border-blue-500 hover:bg-white transition-all cursor-pointer">
         <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer z-20" 
          accept=".pdf,.jpg,.png" 
          onChange={(e) => setCertForm({...certForm, certificate_file: e.target.files[0]})} 
         />
         <div className="relative z-10">
           <FileUp size={32} className="mx-auto text-slate-300 group-hover/upload:text-blue-500 mb-3 transition-colors" />
           <p className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
             {certForm.certificate_file 
                ? certForm.certificate_file.name 
                : editingCertificate 
                  ? "Select to Replace Current File" 
                  : "Select Document Artifact"}
           </p>
           <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">PDF or High-Res Image</p>
         </div>
      </div>
    </div>
  ) : (
    <div className="relative group">
      <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
      <input 
        className={inputStyle + " pl-12 h-14"} 
        placeholder="https://verify.credential.com/id/..." 
        value={certForm.certificate_link} 
        onChange={(e) => setCertForm({...certForm, certificate_link: e.target.value})} 
      />
    </div>
  )}
</div>

     
        <button 
          disabled={updating}
          onClick={handleCertificateSync}
          className={`w-full py-5 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 ${
            editingCertificate ? "bg-blue-600 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {updating ? <Loader2 className="animate-spin" size={20} /> : editingCertificate ? <ShieldCheck size={20} /> : <PlusCircle size={20} />}
          {editingCertificate ? "Updates" : "Add Certificate"}
        </button>
      </div>
    </div>
  </div>
)} */}

{showCertEditModal && (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6">
    {/* Backdrop with Glassmorphism */}
    <div 
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={() => !updating && setShowCertEditModal(false)} 
    />
    
    {/* 🛠️ Main Container: Added h-full and max-h logic for screen fitting */}
    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
      
      {/* 1. STICKY HEADER */}
      <div className="shrink-0 px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
            {editingCertificate ? <Edit3 size={24} strokeWidth={2.5} /> : <Plus size={24} strokeWidth={3} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {editingCertificate ? "Edit Certificate" : "New Certificate"}
            </h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
              {editingCertificate ? "Update Registry Node" : "Deploy Document Node"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowCertEditModal(false)} 
          className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      {/* 2. SCROLLABLE BODY: Added custom-scrollbar-professional and overflow-y-auto */}
      <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 bg-white custom-scrollbar-professional">
        
        {/* IDENTITY INPUT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Certificate Name
          </label>
          <input 
            className={inputStyle} 
            placeholder="e.g. AWS Certified Solutions Architect"
            value={certForm.name}
            onChange={(e) => setCertForm({...certForm, name: e.target.value})}
          />
        </div>

        {/* FORMAT SWITCHER */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Document Format
          </label>
          <div className="flex !bg-slate-100 p-1.5 rounded-2xl border !border-slate-200 w-full shadow-inner">
            <button 
              type="button"
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === 'file' ? '!bg-white shadow-sm !text-blue-600 border !border-slate-100' : '!text-slate-400'}`}
              onClick={() => setCertForm({...certForm, uploadMode: 'file'})}
            >PDF FILE</button>
            <button 
              type="button"
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${certForm.uploadMode === 'link' ? '!bg-white shadow-sm !text-blue-600 border !border-slate-100' : '!text-slate-400'}`}
              onClick={() => setCertForm({...certForm, uploadMode: 'link'})}
            >EXTERNAL URI</button>
          </div>
        </div>

        {/* DYNAMIC CONTENT NODE */}
        <div className="animate-in slide-in-from-top-2 duration-300">
          {certForm.uploadMode === 'file' ? (
            <div className="space-y-4">
              {/* 🛠️ PREVIOUS FILE BADGE (Shown in Edit Mode) */}
              {editingCertificate && !certForm.certificate_file && editingCertificate.file_path && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-blue-100">
                      <BadgeCheck size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-tight leading-none">uploaded File</p>
                      <p className="text-[8px] font-bold text-blue-500 uppercase truncate max-w-[150px] mt-1">
                        {editingCertificate.file_path.split('/').pop()}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={editingCertificate.file_path} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm border border-blue-100"
                  >
                    <Eye size={14} />
                  </a>
                </div>
              )}

              {/* UPLOAD ZONE */}
              <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center bg-slate-50/50 group/upload hover:border-blue-500 hover:bg-white transition-all cursor-pointer">
                 <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                  accept=".pdf,.jpg,.png" 
                  onChange={(e) => setCertForm({...certForm, certificate_file: e.target.files[0]})} 
                 />
                 <div className="relative z-10">
                   <FileUp size={32} className="mx-auto text-slate-300 group-hover/upload:text-blue-500 mb-3 transition-colors" />
                   <p className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                     {certForm.certificate_file 
                        ? certForm.certificate_file.name 
                        : editingCertificate 
                          ? "Pick New File to Replace" 
                          : "Select Document Artifact"}
                   </p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">PDF or Image</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <input 
                className={inputStyle + " pl-12 h-14"} 
                placeholder="https://verify.credential.com/id/..." 
                value={certForm.certificate_link} 
                onChange={(e) => setCertForm({...certForm, certificate_link: e.target.value})} 
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. STICKY FOOTER */}
      <div className="shrink-0 p-8 border-t border-slate-100 bg-white">
        <button 
          disabled={updating}
          onClick={handleCertificateSync}
          className={`w-full py-5 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 ${
            editingCertificate ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {updating ? <Loader2 className="animate-spin" size={20} /> : editingCertificate ? <ShieldCheck size={20} /> : <PlusCircle size={20} />}
          {editingCertificate ? "Update Certificate" : "Add Certificate"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

/* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

const SidebarInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
      {React.cloneElement(icon, { size: 14 })}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-700 break-all">
        {value || "Not Specified"}
      </span>
    </div>
  </div>
);

const InfoCard = ({ title, children, icon: HeaderIcon }) => (
  <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
      <div className="p-1.5 bg-blue-50 rounded-lg">
        {HeaderIcon && (
          <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />
        )}
      </div>
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
        {title}
      </h3>
    </div>
    <div className="relative z-10 p-6 space-y-4">{children}</div>
    <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
      {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
    </div>
  </div>
);

const DetailRow = ({ label, value, icon, isSkills = false }) => (
  <div
    className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}
  >
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    {isSkills ? (
      <div className="flex flex-wrap gap-2">
        {value ? (
          String(value)
            .split(",")
            .map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter"
              >
                {skill.trim()}
              </span>
            ))
        ) : (
          <span className="text-[10px] text-slate-300 uppercase">Void</span>
        )}
      </div>
    ) : (
      <span className="text-xs font-black text-slate-800 uppercase">
        {value || "—"}
      </span>
    )}
  </div>
);

// const ModernDocCard = ({
//   title,
//   url,
//   type,
//   formatDocUrl,
//   icon: CardIcon = FileText,
// }) => (
//   <a
//     // href={formatDocUrl(url)}
//      href={url}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm"
//   >
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
//           {title}
//         </p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
//           {type}
//         </p>
//       </div>
//     </div>
//     <ExternalLink
//       size={16}
//       className="text-slate-200 group-hover:text-blue-600 transition-colors"
//     />
//   </a>
// );

// const ModernDocCard = ({
//   title,
//   url,
//   type,
//   formatDocUrl,
//   icon: CardIcon = FileText,
//   onEdit // New prop for cleaner logic
// }) => (
//   <div className="relative flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl transition-all group/card shadow-sm hover:border-slate-300">
//     <div className="flex items-center gap-4 min-w-0">
//       {/* BRANDING BOX */}
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 flex-shrink-0">
//         <CardIcon size={20} />
//       </div>
      
//       {/* IDENTITY NODE: Clicking title opens the link */}
//       <div className="min-w-0">
//         <a 
//           href={url} 
//           target="_blank" 
//           rel="noreferrer" 
//           className="text-sm font-black text-slate-900 tracking-tight uppercase truncate block hover:text-blue-600 transition-colors"
//         >
//           {title}
//         </a>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
//           {type}
//         </p>
//       </div>
//     </div>

//     {/* ACTION STACK: Separate nodes for View and Edit */}
//     <div className="flex items-center gap-2 relative z-20">
//       {/* EDIT BUTTON: Matches Enterprise Slate theme */}
//       <button
//         onClick={onEdit}
//         className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-blue-100"
//       >
//         <Edit3 size={15} strokeWidth={2.5} />
//       </button>

//       {/* VIEW BUTTON */}
//       <a
//         href={url}
//         target="_blank"
//         rel="noreferrer"
//         className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-emerald-100"
//       >
//         <ExternalLink size={16} strokeWidth={2.5} />
//       </a>
//     </div>
//   </div>
// );


const ModernDocCard = ({
  title,
  url,
  type,
  formatDocUrl,
  icon: CardIcon = FileText,
  onEdit,
  showEdit = true // 🛠️ New Control Node
}) => (
  <div className="relative flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl transition-all group/card shadow-sm hover:border-slate-300">
    <div className="flex items-center gap-4 min-w-0">
      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 flex-shrink-0">
        <CardIcon size={20} />
      </div>
      
      <div className="min-w-0">
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer" 
          className="text-sm font-black text-slate-900 tracking-tight uppercase truncate block hover:text-blue-600 transition-colors"
        >
          {title}
        </a>
        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
          {type}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 relative z-20">
      {/* 🛠️ CONDITIONAL EDIT NODE: Only renders if showEdit is truthy */}
      {showEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-blue-100 animate-in fade-in"
        >
          <Edit3 size={15} strokeWidth={2.5} />
        </button>
      )}

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-blue-100"
      >
        <ExternalLink size={16} strokeWidth={2.5} />
      </a>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 pb-4 text-[11px] !bg-transparent font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
      active
        ? "!border-blue-600 !text-blue-600"
        : "border-transparent !text-slate-400 hover:!text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
      Loading ...
    </p>
  </div>
);

const StripDetail = ({ icon, label, value }) => (
  <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
    {/* ICON BRANDING BOX: Glassmorphism effect */}
    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
      <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
        {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
      </div>
    </div>

    {/* DATA STACK */}
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
          {label}
        </span>
        {/* Verification Dot: Hidden by default, shown on hover */}
        <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
          {value || "—"}
        </span>
      </div>
    </div>
  </div>
);

// Professional Enterprise Input Style Protocol
const inputStyle = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner placeholder:text-slate-400 placeholder:font-medium";

export default CandidateProfilePage;
//*******************************************************working code pahse 2 24/02/26 5:54********************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   CheckCircle,
//   Loader2,
//   MapPin,
//   History,
//   User,
//   Plus,
//   Briefcase,
//   X,
//   GraduationCap,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
//   Fingerprint,
//   Cpu,
//   Layers,
//   Award,
//   BadgeCheck,
//   Languages,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [selectedLangs, setSelectedLangs] = useState([]);
//   const [updating, setUpdating] = useState(false);
//   const [showSkillAssetModal, setShowSkillAssetModal] = useState(false);
//   const [masterSkills, setMasterSkills] = useState([]); // All possible skills
//   const [selectedSkills, setSelectedSkills] = useState([]); // Candidate's skills
//   const [selectedAssets, setSelectedAssets] = useState([]); // Candidate's assets
//   const [newAssetInput, setNewAssetInput] = useState("");
//   const [showSkillModal, setShowSkillModal] = useState(false);
//   const [showAssetModal, setShowAssetModal] = useState(false);
//   const [newSkillInput, setNewSkillInput] = useState("");
//   const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
//   const [isAssetsExpanded, setIsAssetsExpanded] = useState(false);
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
//   const [experienceList, setExperienceList] = useState([]);
//   // Add this with your other useState hooks
//   const [fetchingMasters, setFetchingMasters] = useState(false);
//   const [isSubmittingExp, setIsSubmittingExp] = useState(false);
//   const [newExp, setNewExp] = useState({
//     company_name: "",
//     job_title: "",
//     start_date: "",
//     end_date: "",
//     previous_ctc: "",
//     location: "",
//     description: "",
//     industry_id: "", // Node: integer
//     department_id: "", // Node: integer
//     exp_letter_file: null, // Node: binary
//     exp_letter_link: "", // Node: string/url
//   });
//   const [industries, setIndustries] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [showEditExpModal, setShowEditExpModal] = useState(false);
//   const [editingExp, setEditingExp] = useState(null); // Stores the single node being updated
//   const [showAddEduModal, setShowAddEduModal] = useState(false);
//   const [showEditEduModal, setShowEditEduModal] = useState(false);
//   const [masterEducations, setMasterEducations] = useState([]);
//   const [newEdu, setNewEdu] = useState({
//     education_id: "",
//     institution_name: "",
//     start_year: "",
//     end_year: "",
//     score_metric: "Percentage", // Default value
//     score: "",
//   });
//   const [editingEdu, setEditingEdu] = useState(null);
//   const SCORE_METRICS = ["Percentage", "CGPA", "GPA"];

//   const handleUpdateExperience = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     const toastId = toast.loading("Updating Employment Node...");

//     try {
//       const fd = new FormData();
//       fd.append("company_name", editingExp.company_name);
//       fd.append("job_title", editingExp.job_title);
//       fd.append("start_date", editingExp.start_date);
//       fd.append("end_date", editingExp.end_date);

//       if (editingExp.industry_id)
//         fd.append("industry_id", parseInt(editingExp.industry_id));
//       if (editingExp.department_id)
//         fd.append("department_id", parseInt(editingExp.department_id));
//       if (editingExp.previous_ctc)
//         fd.append("previous_ctc", editingExp.previous_ctc);
//       if (editingExp.location) fd.append("location", editingExp.location);
//       if (editingExp.description)
//         fd.append("description", editingExp.description);

//       // Artifact Logic
//       if (editingExp.artifact_type === "file" && editingExp.exp_letter_file) {
//         fd.append("exp_letter_file", editingExp.exp_letter_file);
//       } else if (
//         editingExp.artifact_type === "link" &&
//         editingExp.exp_letter_link
//       ) {
//         fd.append("exp_letter_link", editingExp.exp_letter_link);
//       }

//       // Dynamic URL using Candidate ID and Experience ID
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}/experiences/${editingExp.id}`,
//         {
//           method: "PUT",
//           body: fd,
//         },
//       );

//       if (res.ok) {
//         toast.success("Node Updated Successfully", { id: toastId });

//         // Refresh Profile Data
//         const freshRes = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const freshData = await freshRes.json();
//         setEmployee(freshData);

//         setShowEditExpModal(false);
//         setEditingExp(null);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Handshake Failed: Ensure all fields are valid", {
//         id: toastId,
//       });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const addExperienceNode = () => {
//     setExperienceList([
//       ...experienceList,
//       {
//         company_name: "",
//         job_title: "",
//         start_date: "",
//         end_date: "",
//         location: "",
//         previous_ctc: "",
//         industry_id: "",
//         department_id: "",
//         description: "",
//         // Artifact Logic
//         artifact_type: "file", // internal UI helper: 'file' or 'link'
//         exp_letter_file: null,
//         exp_letter_link: "",
//       },
//     ]);
//   };

//   const DEFAULT_LANGS = [
//     "English",
//     "Hindi",
//     "Marathi",
//     "Gujarati",
//     "Tamil",
//     "Telugu",
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   // Effect to sync modal state with employee data when modal opens
//   useEffect(() => {
//     if (showLanguageModal && employee?.languages_spoken) {
//       // If API returns string, split it; if array, use it directly
//       const current = Array.isArray(employee.languages_spoken)
//         ? employee.languages_spoken
//         : employee.languages_spoken.split(",").map((l) => l.trim());
//       setSelectedLangs(current);
//     }
//   }, [showLanguageModal, employee]);

//   // Initialize Modal Data
//   useEffect(() => {
//     if (showSkillAssetModal) {
//       fetchMasterSkills();
//       // Normalize Skills (handle Array or String)
//       const currentSkills = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(currentSkills);

//       // Normalize Assets
//       const currentAssets = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(currentAssets);
//     }
//   }, [showSkillAssetModal, employee]);

//   // Fetch Master Registries for Industries and Departments
//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const [indRes, depRes] = await Promise.all([
//           fetch(
//             "https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100",
//           ),
//           fetch("https://apihrr.goelectronix.co.in/departments"),
//         ]);
//         const indData = await indRes.json();
//         const depData = await depRes.json();
//         setIndustries(indData || []);
//         setDepartments(depRes.ok ? depData : []); // Safety check for department response
//       } catch (err) {
//         console.error("Registry Sync Failure", err);
//       }
//     };
//     fetchMasters();
//   }, []);

//   useEffect(() => {
//     const fetchEduMasters = async () => {
//       try {
//         const res = await fetch(
//           "https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100",
//         );
//         const data = await res.json();
//         setMasterEducations(data || []);
//       } catch (err) {
//         console.error("Edu Master Sync Failure");
//       }
//     };
//     fetchEduMasters();
//   }, []);

//   // POST: Add New Academic Node
//   const handleAddEducation = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     const toastId = toast.loading("Deploying Academic Node...");
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/education/${id}?user_type=candidate`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             education_id: parseInt(newEdu.education_id),
//             institution_name: newEdu.institution_name,
//             start_year: newEdu.start_year,
//             end_year: newEdu.end_year,
//             score_metric: newEdu.score_metric, // 🛠️ Added
//             score: newEdu.score, // 🛠️ Added
//           }),
//         },
//       );
//       if (res.ok) {
//         toast.success("Academic Node Integrated", { id: toastId });
//         const freshData = await (
//           await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`)
//         ).json();
//         setEmployee(freshData);
//         setShowAddEduModal(false);
//         setNewEdu({
//           education_id: "",
//           institution_name: "",
//           start_year: "",
//           end_year: "",
//         });
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Deployment Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // PATCH: Update Existing Academic Node
//   const handleEditEducation = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     const toastId = toast.loading("Patching Academic Node...");
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/education/${editingEdu.id}?user_type=candidate`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             education_id: parseInt(editingEdu.education_id),
//             institution_name: editingEdu.institution_name,
//             start_year: editingEdu.start_year,
//             end_year: editingEdu.end_year,
//             score_metric: editingEdu.score_metric,
//             score: editingEdu.score,
//           }),
//         },
//       );
//       if (res.ok) {
//         toast.success("Node Synchronized", { id: toastId });
//         const freshData = await (
//           await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`)
//         ).json();
//         setEmployee(freshData);
//         setShowEditEduModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Update Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Protocol: Force a clean, empty state whenever the modal is activated
//   useEffect(() => {
//     if (showExperienceModal) {
//       // 🛠️ ALWAYS reset the list to exactly one blank node
//       // This ignores any data already saved in the employee object
//       setExperienceList([
//         {
//           company_name: "",
//           job_title: "",
//           start_date: "",
//           end_date: "",
//           location: "",
//           previous_ctc: "",
//           industry_id: "",
//           department_id: "",
//           description: "",
//           artifact_type: "file",
//           exp_letter_file: null,
//           exp_letter_link: "",
//         },
//       ]);
//     } else {
//       // Purge state when modal closes to prevent "ghost data" next time
//       setExperienceList([]);
//     }
//   }, [showExperienceModal]); // ⚠️ Only watch the modal state, NOT the employee data

//   // PATCH Transmission
//   const handleSyncRegistry = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Executing Node Synchronization...");
//     try {
//       const formData = new FormData();
//       formData.append("skills", selectedSkills.join(","));
//       formData.append("assets", selectedAssets.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Audit Registry Updated", { id: syncToast });
//         setEmployee({
//           ...employee,
//           skills: selectedSkills,
//           assets: selectedAssets,
//         });
//         setShowSkillAssetModal(false);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Handshake Refused", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Registry Logic
//   const fetchMasterSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterSkills(data || []);
//     } catch (err) {
//       console.error("Master Sync Failure");
//     }
//   };

//   // Initialize Skill Data when Skill Modal opens
//   useEffect(() => {
//     if (showSkillModal) {
//       fetchMasterSkills();
//       const current = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(current);
//     }
//   }, [showSkillModal, employee]);

//   // Initialize Asset Data when Asset Modal opens
//   useEffect(() => {
//     if (showAssetModal) {
//       const current = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(current);
//     }
//   }, [showAssetModal, employee]);

//   const handleExperienceSync = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Deploying Employment Nodes...");

//     try {
//       const uploadPromises = experienceList.map(async (exp) => {
//         const fd = new FormData();

//         // Mandatory Protocol Nodes
//         fd.append("company_name", exp.company_name);
//         fd.append("job_title", exp.job_title);
//         fd.append("start_date", exp.start_date);
//         fd.append("end_date", exp.end_date);

//         // Master Node Identifiers (Integers)
//         if (exp.industry_id)
//           fd.append("industry_id", parseInt(exp.industry_id));
//         if (exp.department_id)
//           fd.append("department_id", parseInt(exp.department_id));

//         // Optional Meta-Data
//         if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
//         if (exp.location) fd.append("location", exp.location);

//         // Artifact Handling
//         if (exp.artifact_type === "file" && exp.exp_letter_file) {
//           fd.append("exp_letter_file", exp.exp_letter_file);
//         } else if (exp.artifact_type === "link" && exp.exp_letter_link) {
//           fd.append("exp_letter_link", exp.exp_letter_link);
//         }

//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}/experiences`,
//           {
//             method: "POST",
//             body: fd,
//           },
//         );
//         if (!res.ok) throw new Error();
//         return res.json();
//       });

//       await Promise.all(uploadPromises);

//       toast.success("Nodes Integrated Successfully", { id: toastId });

//       // Refresh main profile to show the new list
//       const freshRes = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//       );
//       const freshData = await freshRes.json();
//       setEmployee(freshData);

//       // 🛠️ FINAL PURGE: Wiping local state
//       setExperienceList([]);
//       setShowExperienceModal(false);
//     } catch (err) {
//       toast.error("Handshake Failed: Ensure all fields are filled", {
//         id: toastId,
//       });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Independent Sync Handlers
//   const syncSkills = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Skill Matrix...");
//     try {
//       const fd = new FormData();
//       fd.append("skills", selectedSkills.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Skill Node Updated", { id: toastId });
//         setEmployee({ ...employee, skills: selectedSkills });
//         setShowSkillModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const addManualSkill = () => {
//     const skill = newSkillInput.trim();
//     // Case-insensitive check to prevent duplicates
//     if (
//       skill &&
//       !selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
//     ) {
//       setSelectedSkills([...selectedSkills, skill]);
//       setNewSkillInput("");
//     }
//   };

//   const syncAssets = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Asset Registry...");
//     try {
//       const fd = new FormData();
//       fd.append("assets", selectedAssets.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Asset Node Updated", { id: toastId });
//         setEmployee({ ...employee, assets: selectedAssets });
//         setShowAssetModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(exp.start_date);
//       const end = exp.end_date ? new Date(exp.end_date) : new Date();
//       const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += Math.max(0, diff);
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
//   };

//   const handleLanguageUpdate = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Synchronizing Linguistic Nodes...");

//     try {
//       const formData = new FormData();
//       // Convert array to comma-separated string
//       formData.append("languages_spoken", selectedLangs.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Registry Updated Successfully", { id: syncToast });
//         // Refresh local employee state
//         setEmployee({ ...employee, languages_spoken: selectedLangs });
//         setShowLanguageModal(false);
//       } else {
//         throw new Error("Protocol Rejection");
//       }
//     } catch (err) {
//       toast.error("Handshake Failed", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleAddExperienceNode = async (e) => {
//     e.preventDefault();
//     setIsSubmittingExp(true);
//     const loadingToast = toast.loading("Deploying Employment Node...");

//     try {
//       const formData = new FormData();

//       // REQUIRED PROTOCOL NODES
//       formData.append("company_name", newExp.company_name);
//       formData.append("job_title", newExp.job_title);
//       formData.append("start_date", newExp.start_date);
//       formData.append("end_date", newExp.end_date);

//       // CLASSIFICATION NODES (Integers)
//       if (newExp.industry_id)
//         formData.append("industry_id", parseInt(newExp.industry_id));
//       if (newExp.department_id)
//         formData.append("department_id", parseInt(newExp.department_id));

//       // FINANCIAL & GEO NODES
//       if (newExp.previous_ctc)
//         formData.append("previous_ctc", newExp.previous_ctc);
//       formData.append("location", newExp.location);
//       formData.append("description", newExp.description);

//       // ARTIFACT NODES (Binary & Link)
//       if (newExp.exp_letter_file)
//         formData.append("exp_letter_file", newExp.exp_letter_file);
//       if (newExp.exp_letter_link)
//         formData.append("exp_letter_link", newExp.exp_letter_link);

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}/experiences`,
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Node Integrated Successfully", { id: loadingToast });
//         // Refresh local profile logic here...
//         setShowExperienceModal(false);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Handshake Failed", { id: loadingToast });
//     } finally {
//       setIsSubmittingExp(false);
//     }
//   };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900 font-bold tracking-tight">
//                 {employee?.full_name}
//               </span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN */}

//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
//               {/* Decorative Background Icon */}
//               <Fingerprint
//                 className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none"
//                 size={140}
//               />

//               <div className="flex flex-col items-center text-center relative z-10">
//                 <div className="relative group mb-6">
//                   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//                   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//                       {employee?.profile_image ? (
//                         <img
//                           src={employee.profile_image}
//                           alt={employee?.full_name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
//                           <User
//                             size={42}
//                             className="text-white mb-1"
//                             strokeWidth={1.5}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//                       <div className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//                   {employee?.full_name || "Unknown"}
//                 </h1>
//               </div>

//               {/* DATA STACK: Left Aligned Personal Info */}
//               <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
//                 <SidebarInfo
//                   icon={<Mail />}
//                   label=" Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone />}
//                   label="Primary Contact"
//                   value={employee?.phone}
//                 />

//                 {/* ADDED DOB & GENDER HERE */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <SidebarInfo
//                     icon={<Calendar />}
//                     label="Birth date"
//                     value={employee?.dob}
//                   />
//                   <SidebarInfo
//                     icon={<User />}
//                     label="Gender"
//                     // value={employee?.gender}
//                     value={
//                       employee?.gender
//                         ? employee.gender.charAt(0).toUpperCase() +
//                           employee.gender.slice(1)
//                         : ""
//                     }
//                   />
//                 </div>
//                 <SidebarInfo
//                   icon={<MapPin />}
//                   label="Location"
//                   value={
//                     [employee?.city, employee?.state, employee?.pincode]
//                       .filter(
//                         (val) =>
//                           val &&
//                           val !== "null" &&
//                           val !== "Not Specified" &&
//                           val !== "",
//                       ) // Removes null, "null" string, empty strings, and duplicates
//                       .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
//                   }
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="Candidate Overview"
//                 icon={<Activity size={18} />}
//               />
//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Document"
//                 icon={<ShieldCheck size={18} />}
//               />
//             </div>

//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
//                     {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       {/* Decorative Security Pattern Header */}
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
//                             <Languages size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Language
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Spoken
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 flex items-center">
//                           {/* 🛠️ ACTION NODE: ADD/EDIT BUTTON */}
//                           <div className="absolute top-4 right-6">
//                             <button
//                               onClick={() => setShowLanguageModal(true)}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-95 group/btn"
//                             >
//                               <Plus
//                                 size={12}
//                                 strokeWidth={3}
//                                 className="group-hover/btn:rotate-90 transition-transform"
//                               />
//                               Edit Languages
//                             </button>
//                           </div>
//                           <div className="space-y-3 w-full">
//                             <div className="flex items-center gap-2">
//                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                 Languages
//                               </span>
//                               <div className="h-[1px] flex-1 bg-slate-100" />
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                               {employee?.languages_spoken?.length > 0 ? (
//                                 employee.languages_spoken.map((lang, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
//                                   >
//                                     <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
//                                     <span className="text-[11px] font-black text-slate-700 uppercase">
//                                       {lang}
//                                     </span>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <span className="text-xs text-slate-600 font-medium">
//                                   No language data
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Globe
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>

//                     {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
//                             <Cpu size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Assets & Skill
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Assets & Skills Data
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//                           {/* Skills Subsection */}

//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Layers size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Skills
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => setShowSkillModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.skills &&
//                               (Array.isArray(employee.skills)
//                                 ? employee.skills.length > 0
//                                 : String(employee.skills).trim() !== "") ? (
//                                 (() => {
//                                   const allSkills = Array.isArray(
//                                     employee.skills,
//                                   )
//                                     ? employee.skills
//                                     : String(employee.skills).split(",");
//                                   const hasOverflow = allSkills.length > 4;
//                                   const visibleSkills = isSkillsExpanded
//                                     ? allSkills
//                                     : allSkills.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleSkills.map((skill, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof skill === "string"
//                                             ? skill.trim()
//                                             : String(skill)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsSkillsExpanded(
//                                               !isSkillsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isSkillsExpanded
//                                             ? "Show Less"
//                                             : `+${allSkills.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Skill Added
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Assets Subsection */}

//                           <div className="space-y-4">
//                             {/* SECTION HEADER */}
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Monitor size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Assets
//                                 </span>
//                               </div>

//                               <button
//                                 onClick={() => setShowAssetModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             {/* CHIP CONTAINER */}
//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.assets &&
//                               (Array.isArray(employee.assets)
//                                 ? employee.assets.length > 0
//                                 : String(employee.assets).trim() !== "") ? (
//                                 (() => {
//                                   // Normalize data into a unified array
//                                   const allAssets = Array.isArray(
//                                     employee.assets,
//                                   )
//                                     ? employee.assets
//                                     : String(employee.assets).split(",");
//                                   const hasOverflow = allAssets.length > 4;
//                                   const visibleAssets = isAssetsExpanded
//                                     ? allAssets
//                                     : allAssets.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleAssets.map((asset, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof asset === "string"
//                                             ? asset.trim()
//                                             : String(asset)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ ASSET EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsAssetsExpanded(
//                                               !isAssetsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isAssetsExpanded
//                                             ? "Show Less"
//                                             : `+${allAssets.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Assets Allocated
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Layers
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>
//                   </div>

//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">
//                     {/* SYSTEM WATERMARK: Large rotated background icon */}
//                     <History
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <History size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Candidate
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Previous Job History
//                           </p>
//                         </div>
//                       </div>

//                       {/* TENURE COUNTER */}
//                       <div className="flex items-center gap-3">
//                         <div className="flex flex-col items-end">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                             Total Experience
//                           </span>
//                           <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//                             {calculateTotalExperience(employee?.experiences)}
//                           </span>
//                         </div>

//                         <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//                         <div className="flex items-center gap-2 px-3 py-1  rounded-full">
//                           {/* EDIT BUTTON */}

//                           <button
//                             type="button"
//                             onClick={() => {
//                               setExperienceList([]); // Force immediate purge
//                               setShowExperienceModal(true); // Deploy Modal
//                             }}
//                             className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 border border-slate-200 hover:border-blue-500 text-white hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
//                           >
//                             Add Experience
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     <div className="relative z-10">
//                       {employee?.experiences &&
//                       employee.experiences.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.experiences.map((exp, i) => {
//                             const industryName =
//                               industries.find(
//                                 (ind) => ind.id === exp.industry_id,
//                               )?.name || "General Industry";
//                             const departmentName =
//                               departments.find(
//                                 (dep) => dep.id === exp.department_id,
//                               )?.name || "Operations";

//                             // 🛠️ INDIVIDUAL DURATION CALCULATION PROTOCOL
//                             const calculateSingleDuration = (start, end) => {
//                               if (!start) return "—";
//                               const startDate = new Date(start);
//                               const endDate = end ? new Date(end) : new Date();

//                               let months =
//                                 (endDate.getFullYear() -
//                                   startDate.getFullYear()) *
//                                   12 +
//                                 (endDate.getMonth() - startDate.getMonth());
//                               months = Math.max(0, months);

//                               const years = Math.floor(months / 12);
//                               const remainingMonths = months % 12;

//                               const yrText =
//                                 years > 0
//                                   ? `${years} yr${years > 1 ? "s" : ""}`
//                                   : "";
//                               const moText =
//                                 remainingMonths > 0
//                                   ? `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`
//                                   : "";

//                               return (
//                                 [yrText, moText].filter(Boolean).join(" ") ||
//                                 "1 mo"
//                               );
//                             };

//                             return (
//                               <div
//                                 key={i}
//                                 className="group hover:bg-slate-50/40 transition-colors duration-300"
//                               >
//                                 <div className="flex flex-col md:flex-row p-8 gap-8">
//                                   {/* TIME IDENTIFIER */}
//                                   <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                     <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                       {exp?.start_date
//                                         ? new Date(exp.start_date).getFullYear()
//                                         : "----"}
//                                     </span>
//                                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                       {exp?.start_date
//                                         ? new Date(
//                                             exp.start_date,
//                                           ).toLocaleDateString("en-IN", {
//                                             month: "short",
//                                           })
//                                         : "---"}{" "}
//                                       DEPLOYMENT
//                                     </span>
//                                   </div>

//                                   {/* CONTENT BODY */}

//                                   {/* CONTENT BODY */}
//                                   <div className="flex-1 space-y-4">
//                                     {/* TOP ROW: IDENTITY + TENURE / ACTIONS */}

//                                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
//                                       {/* LEFT SIDE: PRIMARY IDENTITY */}
//                                       <div className="space-y-1.5 flex-1">
//                                         <div className="flex items-center gap-2">
//                                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                             {exp?.company_name || "-"}
//                                           </h4>
//                                           <span className="h-1 w-1 rounded-full bg-slate-300" />
//                                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                             {exp?.location || "-"}
//                                           </span>
//                                         </div>
//                                         <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">
//                                           {exp?.job_title || "-"}
//                                         </p>
//                                       </div>

//                                       {/* RIGHT SIDE: STATUS NODES + EDIT ACTION */}
//                                       <div className="flex items-start gap-4">
//                                         {/* DATA NODES STACK */}
//                                         <div className="flex items-end gap-2">
//                                           {/* Tenure Branding Box */}
//                                           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
//                                             <Calendar
//                                               size={12}
//                                               className="text-blue-500"
//                                             />
//                                             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
//                                               {calculateSingleDuration(
//                                                 exp.start_date,
//                                                 exp.end_date,
//                                               )}
//                                             </span>
//                                           </div>

//                                           {/* Artifact Node */}
//                                           {exp?.experience_letter_path ? (
//                                             <a
//                                               href={exp.experience_letter_path}
//                                               target="_blank"
//                                               rel="noreferrer"
//                                               className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                                             >
//                                               <FileText
//                                                 size={12}
//                                                 className="text-slate-400 group-hover/artifact:text-blue-500"
//                                               />
//                                               Letter
//                                               <ExternalLink
//                                                 size={10}
//                                                 className="opacity-40"
//                                               />
//                                             </a>
//                                           ) : (
//                                             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
//                                               <Shield
//                                                 size={12}
//                                                 className="text-slate-300"
//                                               />
//                                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
//                                                 No Artifact
//                                               </span>
//                                             </div>
//                                           )}
//                                         </div>

//                                         {/* EDIT ACTION NODE: Separated for clarity */}
//                                         <div className="h-full pt-0.5">
//                                           <button
//                                             onClick={() => {
//                                               setEditingExp({
//                                                 ...exp,
//                                                 artifact_type:
//                                                   exp.experience_letter_path
//                                                     ? "link"
//                                                     : "file",
//                                                 exp_letter_link:
//                                                   exp.experience_letter_path ||
//                                                   "",
//                                               });
//                                               setShowEditExpModal(true);
//                                             }}
//                                             className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 hover:shadow-inner rounded-xl transition-all border border-slate-100"
//                                             title="Modify Entry"
//                                           >
//                                             <Edit3
//                                               size={16}
//                                               strokeWidth={2.5}
//                                             />
//                                           </button>
//                                         </div>
//                                       </div>
//                                     </div>

//                                     {/* BOTTOM ROW: FINANCIALS & TIMELINE */}

//                                     {/* BOTTOM ROW: FINANCIALS, TIMELINE & CLASSIFICATION */}
//                                     <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4 border-t border-slate-50">
//                                       {/* INDUSTRY NODE */}
//                                       <div className="flex flex-col">
//                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                           Industry
//                                         </span>
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                           {industryName}
//                                         </span>
//                                       </div>

//                                       <div className="flex flex-col">
//                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                           Department
//                                         </span>
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                           {departmentName}
//                                         </span>
//                                       </div>

//                                       {/* CTC NODE */}
//                                       <div className="flex flex-col">
//                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                           Previous CTC
//                                         </span>
//                                         <div className="flex items-center gap-1.5">
//                                           <span className="text-blue-600 font-black text-[10px]">
//                                             ₹
//                                           </span>
//                                           <span className="text-[11px] font-bold text-slate-700">
//                                             {exp?.previous_ctc
//                                               ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                                               : "Not Specified"}
//                                           </span>
//                                         </div>
//                                       </div>

//                                       {/* TIMELINE NODE */}
//                                       <div className="flex flex-col">
//                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                           Timeline
//                                         </span>
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
//                                           {exp?.start_date
//                                             ? new Date(
//                                                 exp.start_date,
//                                               ).toLocaleDateString("en-IN", {
//                                                 month: "short",
//                                                 year: "numeric",
//                                               })
//                                             : "---"}
//                                           {" — "}
//                                           {exp?.end_date
//                                             ? new Date(
//                                                 exp.end_date,
//                                               ).toLocaleDateString("en-IN", {
//                                                 month: "short",
//                                                 year: "numeric",
//                                               })
//                                             : "Present"}
//                                         </span>
//                                       </div>
//                                     </div>

//                                     {exp?.description && (
//                                       <div className="max-w-3xl pt-2">
//                                         <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
//                                           "{exp.description}"
//                                         </p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       ) : (
//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <Database size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             Fresher Profile
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             No prior professional experience recorded
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* EDUCATION HISTORY: SYSTEM STREAM */}
//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
//                     {/* SYSTEM WATERMARK */}
//                     <Award
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <Award size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Academic History
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Education History
//                           </p>
//                         </div>
//                       </div>

//                       {/* EDIT REDIRECT */}
//                       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//                         {/* <button
//                           type="button"
//                           onClick={() => navigate(`/editentry/${id}?step=3`)}
//                           className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//                         >
//                           <Edit3 size={12} strokeWidth={3} />
//                           Edit Nodes
//                         </button> */}
//                         <button
//                           onClick={() => setShowAddEduModal(true)}
//                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-200 transition-all active:scale-95 group"
//                         >
//                           <Plus
//                             size={14}
//                             strokeWidth={3}
//                             className="group-hover:rotate-90 transition-transform"
//                           />
//                           Add Academic Nodes
//                         </button>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     {/* <div className="relative z-10">
//                       {employee?.educations &&
//                       employee.educations.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.educations.map((edu, i) => (
//                             <div
//                               key={i}
//                               className="group/item hover:bg-slate-50/40 transition-colors duration-300"
//                             >
//                               <div className="flex flex-col md:flex-row p-8 gap-8">
                                
//                                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                     {edu?.end_year || "----"}
//                                   </span>

//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                     GRADUATION
//                                   </span>
//                                 </div>

                             
//                                 <div className="flex-1 space-y-4">
//                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                           {edu?.institution_name ||
//                                             "Unidentified Institute"}
//                                         </h4>
//                                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                                       </div>

                                      
//                                       <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                                         {edu?.education_master?.name ||
//                                           "Specialization Undefined"}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                         Academic Period
//                                       </span>
//                                       <div className="flex items-center gap-2">
//                                         <Calendar
//                                           size={12}
//                                           className="text-slate-300"
//                                         />
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                           {edu?.start_year || "----"} —{" "}
//                                           {edu?.end_year || "----"}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
                       
//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <GraduationCap size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             No Academic Records
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             Node synchronized but education array is empty
//                           </p>
//                         </div>
//                       )}
//                     </div> */}

//                     <div className="relative z-10">
//                       {employee?.educations &&
//                       employee.educations.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.educations.map((edu, i) => (
//                             <div
//                               key={i}
//                               className="group/item hover:bg-slate-50/40 transition-colors duration-300 relative"
//                             >
//                               {/* --- MODAL TRIGGER AREA (Top Right) --- */}
//                               <div className="absolute top-8 right-8 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
//                                 <button
//                                   onClick={() => {
//                                     setEditingEdu(edu);
//                                     setShowEditEduModal(true);
//                                   }}
//                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
//                                 >
//                                   <Edit3 size={12} strokeWidth={2.5} />
//                                   Modify Node
//                                 </button>
//                               </div>

//                               <div className="flex flex-col md:flex-row p-8 gap-8">
//                                 {/* TIME IDENTIFIER */}
//                                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                     {edu?.end_year || "----"}
//                                   </span>
//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                     GRADUATION
//                                   </span>
//                                 </div>

//                                 {/* CONTENT BODY */}
//                                 {/* <div className="flex-1 space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                       {edu?.institution_name || "Unidentified Institute"}
//                     </h4>
//                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                   </div>

//                   <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                     {edu?.education_master?.name || "Specialization Undefined"}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                 <div className="flex flex-col">
//                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                     Academic Period
//                   </span>
//                   <div className="flex items-center gap-2">
//                     <Calendar
//                       size={12}
//                       className="text-slate-300"
//                     />
//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                       {edu?.start_year || "----"} — {edu?.end_year || "----"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//                                 <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-2">
//                                   {/* TIMELINE STACK */}
//                                   <div className="flex flex-col">
//                                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                       Academic Period
//                                     </span>
//                                     <div className="flex items-center gap-2">
//                                       <Calendar
//                                         size={12}
//                                         className="text-slate-300"
//                                       />
//                                       <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                         {edu?.start_year || "----"} —{" "}
//                                         {edu?.end_year || "----"}
//                                       </span>
//                                     </div>
//                                   </div>

//                                   {/* NEW: PERFORMANCE STACK */}
//                                   {/* <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//       Academic Performance
//     </span>
//     <div className="flex items-center gap-2">
//       <div className="px-2 py-0.5 bg-white border border-white rounded-md shadow-sm">
//         <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
//           {edu?.score_metric || "Not Specified"}: {edu?.score || "Not Specified"}
//         </span>
//       </div>
 
//       {parseFloat(edu?.score) > 9 && (
//         <BadgeCheck size={14} className="text-emerald-500 animate-pulse" />
//       )}
//     </div>
//   </div> */}
//                                   {/* PERFORMANCE STACK */}
//                                   <div className="flex flex-col">
//                                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                       Academic Score
//                                     </span>
//                                     <div className="flex items-center gap-2">
//                                       {edu?.score ? (
//                                         // SUCCESS STATE: Data is present
//                                         <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md shadow-sm">
//                                           <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
//                                             {edu.score_metric}: {edu.score}
//                                           </span>
//                                         </div>
//                                       ) : (
//                                         // NEUTRAL STATE: Data is missing
//                                         <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
//                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">
//                                             Not Specified
//                                           </span>
//                                         </div>
//                                       )}

//                                       {/* Subtle High-Performer Indicator */}
//                                       {/* {parseFloat(edu?.score) > 9 && (
//       <BadgeCheck size={14} className="text-blue-500" />
//     )} */}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         /* EMPTY STATE */
//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <GraduationCap size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             No Academic Records
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             Node synchronized but education array is empty
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Resume
//                       </h3>
//                     </div>
//                     {employee?.resume_path ? (
//                       <ModernDocCard
//                         title="Master Curriculum Vitae"
//                         url={employee.resume_path}
//                         type="resume"
//                         formatDocUrl={formatDocUrl}
//                       />
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                           Resume Missing
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Certificate
//                       </h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {employee?.certificates?.map((cert) => (
//                         <ModernDocCard
//                           key={cert.id}
//                           title={cert.name}
//                           url={cert.file_path}
//                           type="Certificate"
//                           formatDocUrl={formatDocUrl}
//                           icon={Award}
//                         />
//                       )) || (
//                         <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">
//                           No Certificates Found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* --- ENTERPRISE MODAL PORTAL --- */}

//       {showLanguageModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowLanguageModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white">
//                   <Languages size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Update Languages
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowLanguageModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-8">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
//                 Select nodes to sync with the candidate's communication stack.
//               </p>

//               {/* CHIP SELECTION GRID */}
//               <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                 {[...new Set([...DEFAULT_LANGS, ...selectedLangs])].map(
//                   (lang) => {
//                     const isSelected = selectedLangs.includes(lang);
//                     return (
//                       <button
//                         key={lang}
//                         type="button"
//                         onClick={() => {
//                           setSelectedLangs((prev) =>
//                             isSelected
//                               ? prev.filter((l) => l !== lang)
//                               : [...prev, lang],
//                           );
//                         }}
//                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
//                           isSelected
//                             ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
//                         }`}
//                       >
//                         {lang}
//                         {isSelected && (
//                           <CheckCircle size={12} strokeWidth={3} />
//                         )}
//                       </button>
//                     );
//                   },
//                 )}
//               </div>

//               <button
//                 disabled={updating}
//                 className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
//                 onClick={handleLanguageUpdate}
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <BadgeCheck size={16} />
//                 )}
//                 {updating ? "Synchronizing..." : "Update Linguistic Node"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: SKILL REGISTRY --- */}

//       {showSkillModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowSkillModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//             {/* HEADER NODE */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
//                   <Layers size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Skill
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowSkillModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-8">
//               {/* INPUT NODE: Manual Entry */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">
//                   Skill
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     value={newSkillInput}
//                     onChange={(e) => setNewSkillInput(e.target.value)}
//                     placeholder="Type and press Enter..."
//                     className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                     onKeyDown={(e) =>
//                       e.key === "Enter" &&
//                       (e.preventDefault(), addManualSkill())
//                     }
//                   />
//                   {/* <button type="button" onClick={addManualSkill} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Add</button> */}
//                 </div>
//               </div>

//               {/* ACTIVE NODES AREA (Everything in this list will be sent to API) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Selected Skills
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
//                     {selectedSkills.length} Selected
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-100 min-h-[80px]">
//                   {selectedSkills.length > 0 ? (
//                     selectedSkills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black uppercase shadow-sm animate-in zoom-in-95"
//                       >
//                         {skill}
//                         <X
//                           size={12}
//                           className="cursor-pointer hover:text-red-500 transition-colors"
//                           onClick={() =>
//                             setSelectedSkills(
//                               selectedSkills.filter((_, idx) => idx !== i),
//                             )
//                           }
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-[9px] font-black text-slate-300 uppercase m-auto tracking-widest">
//                       No Skills
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* MASTER REGISTRY: Quick Toggle Nodes */}
//               <div className="space-y-3 pt-4 border-t border-slate-100">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                   Skill History
//                 </label>
//                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
//                   {masterSkills.map((item) => {
//                     const name = item.name || item;
//                     const isSelected = selectedSkills.includes(name);
//                     return (
//                       <button
//                         key={name}
//                         type="button"
//                         onClick={() =>
//                           setSelectedSkills((prev) =>
//                             isSelected
//                               ? prev.filter((s) => s !== name)
//                               : [...prev, name],
//                           )
//                         }
//                         className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
//                           isSelected
//                             ? "bg-blue-500 border-blue-500 text-white shadow-md"
//                             : "bg-slate-50 border-slate-500 text-slate-800 hover:border-blue-200"
//                         }`}
//                       >
//                         {name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* SUBMIT BUTTON */}
//               <button
//                 disabled={updating}
//                 onClick={syncSkills}
//                 className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <ShieldCheck size={16} />
//                 )}
//                 Save Skills
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: HARDWARE ASSETS --- */}

//       {showAssetModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* Backdrop with Glassmorphism */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => !updating && setShowAssetModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* 1. BRANDED HEADER */}
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
//               <div className="flex items-center gap-5">
//                 {/* LOGO NODE */}
//                 <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
//                   <Monitor size={24} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
//                     Asset
//                   </h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                       Update the assets
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAssetModal(false)}
//                 className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
//               >
//                 <X size={20} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* 2. INPUT NODE */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-1">
//                   Add Assets
//                 </label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1 group">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                       <Plus size={16} strokeWidth={3} />
//                     </div>
//                     <input
//                       value={newAssetInput}
//                       onChange={(e) => setNewAssetInput(e.target.value)}
//                       placeholder="e.g. MacBook Pro M3"
//                       className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           if (newAssetInput.trim()) {
//                             setSelectedAssets([
//                               ...selectedAssets,
//                               newAssetInput.trim(),
//                             ]);
//                             setNewAssetInput("");
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* 3. ENHANCED CHIP CONTAINER (Matched to Skills Style) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
//                     Selected Assets
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//                     {selectedAssets.length} Allocated
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[120px] items-start content-start">
//                   {selectedAssets.length > 0 ? (
//                     selectedAssets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="group/chip flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm hover:border-blue-400 hover:shadow-md transition-all animate-in zoom-in-95"
//                       >
//                         <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
//                         {asset}
//                         <button
//                           onClick={() =>
//                             setSelectedAssets(
//                               selectedAssets.filter((_, idx) => idx !== i),
//                             )
//                           }
//                           className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
//                         >
//                           <X size={14} strokeWidth={3} />
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="m-auto flex flex-col items-center gap-2 opacity-30">
//                       <Database size={24} strokeWidth={1.5} />
//                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                         Registry Vacant
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* 4. SUBMIT ACTION */}
//               <button
//                 disabled={updating}
//                 onClick={syncAssets}
//                 className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Commit Allocation
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showExperienceModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowExperienceModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//             {/* HEADER */}
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
//                   <Briefcase size={22} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//                     Add Experience
//                   </h3>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     Add New Experiance
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowExperienceModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//               {experienceList.map((exp, index) => (
//                 <div
//                   key={index}
//                   className="group p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative hover:border-blue-300 transition-all space-y-6"
//                 >
//                   <button
//                     onClick={() =>
//                       setExperienceList(
//                         experienceList.filter((_, i) => i !== index),
//                       )
//                     }
//                     className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
//                   >
//                     <X size={16} strokeWidth={3} />
//                   </button>

//                   {/* GRID 1: IDENTITY */}
//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         Company Name
//                       </label>
//                       <input
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
//                         placeholder="e.g. Google"
//                         value={exp.company_name}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].company_name = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         Industry
//                       </label>
//                       <select
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                         value={exp.industry_id}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].industry_id = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       >
//                         <option value="">Select Industry</option>
//                         {industries.map((ind) => (
//                           <option key={ind.id} value={ind.id}>
//                             {ind.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* GRID 2: INDUSTRY & DEPARTMENT SELECTION */}
//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         Department
//                       </label>
//                       <select
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                         value={exp.department_id}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].department_id = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       >
//                         <option value="">Select Department</option>
//                         {departments.map((dep) => (
//                           <option key={dep.id} value={dep.id}>
//                             {dep.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         Position
//                       </label>
//                       <input
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
//                         placeholder="e.g. Senior Dev"
//                         value={exp.job_title}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].job_title = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* GRID 3: TIMELINE & PAYROLL */}
//                   <div className="grid grid-cols-4 gap-4">
//                     <div className="col-span-1 space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         Start
//                       </label>
//                       <input
//                         type="date"
//                         className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
//                         value={exp.start_date}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].start_date = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       />
//                     </div>
//                     <div className="col-span-1 space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         End
//                       </label>
//                       <input
//                         type="date"
//                         className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
//                         value={exp.end_date}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].end_date = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       />
//                     </div>
//                     <div className="col-span-2 space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                         CTC (LPA)
//                       </label>
//                       <input
//                         type="number"
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm"
//                         placeholder="e.g. 1200000"
//                         value={exp.previous_ctc}
//                         onChange={(e) => {
//                           const newList = [...experienceList];
//                           newList[index].previous_ctc = e.target.value;
//                           setExperienceList(newList);
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* ARTIFACT SWITCHER PROTOCOL */}
//                   <div className="space-y-4 pt-4 border-t border-slate-200/60">
//                     <div className="flex items-center justify-between">
//                       <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
//                         Validation Artifact
//                       </label>
//                       <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                         <button
//                           onClick={() => {
//                             const nl = [...experienceList];
//                             nl[index].artifact_type = "file";
//                             setExperienceList(nl);
//                           }}
//                           className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === "file" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
//                         >
//                           Upload PDF
//                         </button>
//                         <button
//                           onClick={() => {
//                             const nl = [...experienceList];
//                             nl[index].artifact_type = "link";
//                             setExperienceList(nl);
//                           }}
//                           className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === "link" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
//                         >
//                           External Link
//                         </button>
//                       </div>
//                     </div>

//                     <div className="animate-in slide-in-from-top-2 duration-300">
//                       {exp.artifact_type === "file" ? (
//                         <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                           <input
//                             type="file"
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                             accept=".pdf,.jpg,.png"
//                             onChange={(e) => {
//                               const newList = [...experienceList];
//                               newList[index].exp_letter_file =
//                                 e.target.files[0];
//                               setExperienceList(newList);
//                             }}
//                           />
//                           <Download size={20} className="text-slate-300 mb-1" />
//                           <span className="text-[9px] font-black text-slate-400 uppercase">
//                             {exp.exp_letter_file
//                               ? exp.exp_letter_file.name
//                               : "Select Binary File"}
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="relative group">
//                           <input
//                             className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
//                             placeholder="https://drive.google.com/..."
//                             value={exp.exp_letter_link}
//                             onChange={(e) => {
//                               const newList = [...experienceList];
//                               newList[index].exp_letter_link = e.target.value;
//                               setExperienceList(newList);
//                             }}
//                           />
//                           <ExternalLink
//                             size={14}
//                             className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <button
//                 onClick={addExperienceNode}
//                 className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[11px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-slate-50/50"
//               >
//                 <Plus size={16} strokeWidth={3} /> Add New Record
//               </button>
//             </div>

//             <div className="p-8 border-t border-slate-100 bg-white">
//               <button
//                 disabled={
//                   updating ||
//                   experienceList.length === 0 ||
//                   experienceList.some(
//                     (exp) =>
//                       !exp.company_name ||
//                       !exp.job_title ||
//                       !exp.start_date ||
//                       !exp.end_date,
//                   )
//                 }
//                 onClick={handleExperienceSync}
//                 className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <ShieldCheck size={20} />
//                 )}
//                 Add Experiance
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showEditExpModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowEditExpModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//             {/* HEADER - Reused Design */}
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
//                   <Briefcase size={22} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//                     Edit Experience
//                   </h3>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     Modify Professional Registry Node
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowEditExpModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//               <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative space-y-6">
//                 {/* GRID 1: IDENTITY */}
//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       Company Name
//                     </label>
//                     <input
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
//                       value={editingExp.company_name}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           company_name: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       Industry
//                     </label>
//                     <select
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                       value={editingExp.industry_id}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           industry_id: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Select Industry</option>
//                       {industries.map((ind) => (
//                         <option key={ind.id} value={ind.id}>
//                           {ind.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* GRID 2: DEPT & POSITION */}
//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       Department
//                     </label>
//                     <select
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                       value={editingExp.department_id}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           department_id: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map((dep) => (
//                         <option key={dep.id} value={dep.id}>
//                           {dep.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       Position
//                     </label>
//                     <input
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm"
//                       value={editingExp.job_title}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           job_title: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* GRID 3: DATES & CTC */}
//                 <div className="grid grid-cols-4 gap-4">
//                   <div className="col-span-1 space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       Start
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
//                       value={editingExp.start_date}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           start_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="col-span-1 space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       End
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm"
//                       value={editingExp.end_date}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           end_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="col-span-2 space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                       CTC (LPA)
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm"
//                       value={editingExp.previous_ctc}
//                       onChange={(e) =>
//                         setEditingExp({
//                           ...editingExp,
//                           previous_ctc: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* ARTIFACT SWITCHER */}
//                 <div className="space-y-4 pt-4 border-t border-slate-200/60">
//                   <div className="flex items-center justify-between">
//                     <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
//                       Experiance certificate
//                     </label>
//                     <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                       <button
//                         onClick={() =>
//                           setEditingExp({
//                             ...editingExp,
//                             artifact_type: "file",
//                           })
//                         }
//                         className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === "file" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
//                       >
//                         Upload PDF
//                       </button>
//                       <button
//                         onClick={() =>
//                           setEditingExp({
//                             ...editingExp,
//                             artifact_type: "link",
//                           })
//                         }
//                         className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === "link" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
//                       >
//                         External Link
//                       </button>
//                     </div>
//                   </div>

//                   <div className="animate-in slide-in-from-top-2">
//                     {editingExp.artifact_type === "file" ? (
//                       <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                         <input
//                           type="file"
//                           className="absolute inset-0 opacity-0 cursor-pointer"
//                           onChange={(e) =>
//                             setEditingExp({
//                               ...editingExp,
//                               exp_letter_file: e.target.files[0],
//                             })
//                           }
//                         />
//                         <Download size={20} className="text-slate-300 mb-1" />
//                         <span className="text-[9px] font-black text-slate-400 uppercase">
//                           {editingExp.exp_letter_file
//                             ? editingExp.exp_letter_file.name
//                             : "Select New File"}
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="relative group">
//                         <input
//                           className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm"
//                           value={editingExp.exp_letter_link}
//                           onChange={(e) =>
//                             setEditingExp({
//                               ...editingExp,
//                               exp_letter_link: e.target.value,
//                             })
//                           }
//                         />
//                         <ExternalLink
//                           size={14}
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8 border-t border-slate-100 bg-white">
//               <button
//                 disabled={updating}
//                 onClick={handleUpdateExperience}
//                 className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <ShieldCheck size={20} />
//                 )}
//                 Update Experiance
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {showAddEduModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddEduModal(false)} />
//     <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><GraduationCap size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Add Academic History</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deploy New Academic Node</p>
//           </div>
//         </div>
//         <button onClick={() => setShowAddEduModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>
//       <form onSubmit={handleAddEducation} className="p-10 space-y-6 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Type</label>
//           <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={newEdu.education_id} onChange={(e) => setNewEdu({...newEdu, education_id: e.target.value})}>
//             <option value="">Select Degree</option>
//             {masterEducations.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//           </select>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
//           <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="University of Mumbai" value={newEdu.institution_name} onChange={(e) => setNewEdu({...newEdu, institution_name: e.target.value})} />
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2018" value={newEdu.start_year} onChange={(e) => setNewEdu({...newEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2022" value={newEdu.end_year} onChange={(e) => setNewEdu({...newEdu, end_year: e.target.value})} />
//           </div>
//         </div>
//         <button disabled={updating} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />} Commit Academic Node
//         </button>
//       </form>
//     </div>
//   </div>
// )} */}

//       {showAddEduModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => setShowAddEduModal(false)}
//           />
//           <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
//                   <GraduationCap size={22} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//                     Add Academic History
//                   </h3>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     {" "}
//                     New Academic Data
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAddEduModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleAddEducation}
//               className="p-10 space-y-6 bg-white"
//             >
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Degree Type
//                 </label>
//                 <select
//                   required
//                   className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
//                   value={newEdu.education_id}
//                   onChange={(e) =>
//                     setNewEdu({ ...newEdu, education_id: e.target.value })
//                   }
//                 >
//                   <option value="">Select Degree</option>
//                   {masterEducations.map((m) => (
//                     <option key={m.id} value={m.id}>
//                       {m.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Institution Name
//                 </label>
//                 <input
//                   required
//                   className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                   placeholder="University of Mumbai"
//                   value={newEdu.institution_name}
//                   onChange={(e) =>
//                     setNewEdu({ ...newEdu, institution_name: e.target.value })
//                   }
//                 />
//               </div>

//               {/* 🛠️ SCORE CONFIGURATION NODE */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Score Type
//                   </label>
//                   <select
//                     required
//                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
//                     value={newEdu.score_metric}
//                     onChange={(e) =>
//                       setNewEdu({ ...newEdu, score_metric: e.target.value })
//                     }
//                   >
//                     <option value="Percentage">Percentage</option>
//                     <option value="CGPA">CGPA</option>
//                     <option value="GPA">GPA</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Score Value
//                   </label>
//                   <input
//                     required
//                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                     placeholder={
//                       newEdu.score_metric === "Percentage"
//                         ? "e.g. 85.5"
//                         : "e.g. 9.2"
//                     }
//                     value={newEdu.score}
//                     onChange={(e) =>
//                       setNewEdu({ ...newEdu, score: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2018" value={newEdu.start_year} onChange={(e) => setNewEdu({...newEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2022" value={newEdu.end_year} onChange={(e) => setNewEdu({...newEdu, end_year: e.target.value})} />
//           </div>
//         </div> */}

//               <div className="grid grid-cols-2 gap-6">
//                 {/* START YEAR NODE */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Start Year
//                   </label>
//                   <div className="relative group">
//                     <select
//                       required
//                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//                       value={newEdu.start_year}
//                       onChange={(e) =>
//                         setNewEdu({ ...newEdu, start_year: e.target.value })
//                       }
//                     >
//                       <option value="">Year</option>
//                       {/* Generates a 40-year window from 2030 downwards */}
//                       {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
//                         (year) => (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <Calendar
//                       size={14}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
//                     />
//                   </div>
//                 </div>

//                 {/* END YEAR NODE */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     End Year
//                   </label>
//                   <div className="relative group">
//                     <select
//                       required
//                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//                       value={newEdu.end_year}
//                       onChange={(e) =>
//                         setNewEdu({ ...newEdu, end_year: e.target.value })
//                       }
//                     >
//                       <option value="">Year</option>
//                       {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
//                         (year) => (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <Calendar
//                       size={14}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 disabled={updating}
//                 type="submit"
//                 className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <ShieldCheck size={20} />
//                 )}{" "}
//                 Add Academic
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* {showEditEduModal && editingEdu && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowEditEduModal(false)} />
//     <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg"><Edit3 size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Academic Record</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modify Existing Registry Node</p>
//           </div>
//         </div>
//         <button onClick={() => setShowEditEduModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>
//       <form onSubmit={handleEditEducation} className="p-10 space-y-6 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Type</label>
//           <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={editingEdu.education_id} onChange={(e) => setEditingEdu({...editingEdu, education_id: e.target.value})}>
//             {masterEducations.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//           </select>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
//           <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.institution_name} onChange={(e) => setEditingEdu({...editingEdu, institution_name: e.target.value})} />
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.start_year} onChange={(e) => setEditingEdu({...editingEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.end_year} onChange={(e) => setEditingEdu({...editingEdu, end_year: e.target.value})} />
//           </div>
//         </div>
//         <button disabled={updating} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />} Commit Changes
//         </button>
//       </form>
//     </div>
//   </div>
// )} */}

//       {showEditEduModal && editingEdu && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => setShowEditEduModal(false)}
//           />
//           <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
//                   <Edit3 size={22} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//                     Edit Academic Record
//                   </h3>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                     Edit Existing Data
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowEditEduModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleEditEducation}
//               className="p-10 space-y-6 bg-white"
//             >
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Degree Type
//                 </label>
//                 <select
//                   required
//                   className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
//                   value={editingEdu.education_id}
//                   onChange={(e) =>
//                     setEditingEdu({
//                       ...editingEdu,
//                       education_id: e.target.value,
//                     })
//                   }
//                 >
//                   {masterEducations.map((m) => (
//                     <option key={m.id} value={m.id}>
//                       {m.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Institution Name
//                 </label>
//                 <input
//                   required
//                   className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                   value={editingEdu.institution_name}
//                   onChange={(e) =>
//                     setEditingEdu({
//                       ...editingEdu,
//                       institution_name: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* 🛠️ SCORE CONFIGURATION NODE */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Score type
//                   </label>
//                   <select
//                     required
//                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none"
//                     value={editingEdu.score_metric}
//                     onChange={(e) =>
//                       setEditingEdu({
//                         ...editingEdu,
//                         score_metric: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Percentage">Percentage</option>
//                     <option value="CGPA">CGPA</option>
//                     <option value="GPA">GPA</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Score Value
//                   </label>
//                   <input
//                     required
//                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                     value={editingEdu.score}
//                     onChange={(e) =>
//                       setEditingEdu({ ...editingEdu, score: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.start_year} onChange={(e) => setEditingEdu({...editingEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.end_year} onChange={(e) => setEditingEdu({...editingEdu, end_year: e.target.value})} />
//           </div>
//         </div> */}

//               <div className="grid grid-cols-2 gap-6">
//                 {/* START YEAR NODE */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     Start Year
//                   </label>
//                   <div className="relative group">
//                     <select
//                       required
//                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//                       value={editingEdu?.start_year || ""}
//                       onChange={(e) =>
//                         setEditingEdu({
//                           ...editingEdu,
//                           start_year: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Year</option>
//                       {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
//                         (year) => (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <Calendar
//                       size={14}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
//                     />
//                   </div>
//                 </div>

//                 {/* END YEAR NODE */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                     End Year
//                   </label>
//                   <div className="relative group">
//                     <select
//                       required
//                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//                       value={editingEdu?.end_year || ""}
//                       onChange={(e) =>
//                         setEditingEdu({
//                           ...editingEdu,
//                           end_year: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Year</option>
//                       {Array.from({ length: 41 }, (_, i) => 2030 - i).map(
//                         (year) => (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <Calendar
//                       size={14}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 disabled={updating}
//                 type="submit"
//                 className="w-full py-5 bg-blue-500 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <ShieldCheck size={20} />
//                 )}{" "}
//                 Edit Academic
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
//       {React.cloneElement(icon, { size: 14 })}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-bold text-slate-700 break-all">
//         {value || "Not Specified"}
//       </span>
//     </div>
//   </div>
// );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
//   <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//       <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && (
//           <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />
//         )}
//       </div>
//       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
//         {title}
//       </h3>
//     </div>
//     <div className="relative z-10 p-6 space-y-4">{children}</div>
//     <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
//       {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}
//   >
//     <div className="flex items-center gap-2 text-slate-400">
//       {icon}
//       <span className="text-[10px] font-black uppercase tracking-widest">
//         {label}
//       </span>
//     </div>
//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {value ? (
//           String(value)
//             .split(",")
//             .map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter"
//               >
//                 {skill.trim()}
//               </span>
//             ))
//         ) : (
//           <span className="text-[10px] text-slate-300 uppercase">Void</span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-black text-slate-800 uppercase">
//         {value || "—"}
//       </span>
//     )}
//   </div>
// );

// const ModernDocCard = ({
//   title,
//   url,
//   type,
//   formatDocUrl,
//   icon: CardIcon = FileText,
// }) => (
//   <a
//     href={formatDocUrl(url)}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm"
//   >
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
//           {title}
//         </p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
//           {type}
//         </p>
//       </div>
//     </div>
//     <ExternalLink
//       size={16}
//       className="text-slate-200 group-hover:text-blue-600 transition-colors"
//     />
//   </a>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-400 hover:text-slate-600"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="relative w-16 h-16">
//       <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
//       <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//     </div>
//     <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
//       Loading ...
//     </p>
//   </div>
// );

// const StripDetail = ({ icon, label, value }) => (
//   <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
//     {/* ICON BRANDING BOX: Glassmorphism effect */}
//     <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
//       <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
//         {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
//       </div>
//     </div>

//     {/* DATA STACK */}
//     <div className="flex flex-col min-w-0">
//       <div className="flex items-center gap-1.5 mb-0.5">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
//           {label}
//         </span>
//         {/* Verification Dot: Hidden by default, shown on hover */}
//         <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
//           {value || "—"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
//***************************************************************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   CheckCircle,
//   Loader2,
//   MapPin,
//   History,
//   User,
//   Plus,
//   Briefcase,
//   X,
//   GraduationCap,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
//   Fingerprint,
//   Cpu,
//   Layers,
//   Award,
//   BadgeCheck,
//   Languages,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [selectedLangs, setSelectedLangs] = useState([]);
//   const [updating, setUpdating] = useState(false);
//   const [showSkillAssetModal, setShowSkillAssetModal] = useState(false);
//   const [masterSkills, setMasterSkills] = useState([]); // All possible skills
//   const [selectedSkills, setSelectedSkills] = useState([]); // Candidate's skills
//   const [selectedAssets, setSelectedAssets] = useState([]); // Candidate's assets
//   const [newAssetInput, setNewAssetInput] = useState("");
//   const [showSkillModal, setShowSkillModal] = useState(false);
//   const [showAssetModal, setShowAssetModal] = useState(false);
//   const [newSkillInput, setNewSkillInput] = useState("");
//   const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
//   const [isAssetsExpanded, setIsAssetsExpanded] = useState(false);
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
// const [experienceList, setExperienceList] = useState([]);
// // Add this with your other useState hooks
// const [fetchingMasters, setFetchingMasters] = useState(false);
// const [isSubmittingExp, setIsSubmittingExp] = useState(false);
// const [newExp, setNewExp] = useState({
//   company_name: "",
//   job_title: "",
//   start_date: "",
//   end_date: "",
//   previous_ctc: "",
//   location: "",
//   description: "",
//   industry_id: "", // Node: integer
//   department_id: "", // Node: integer
//   exp_letter_file: null, // Node: binary
//   exp_letter_link: "" // Node: string/url
// });
// const [industries, setIndustries] = useState([]);
// const [departments, setDepartments] = useState([]);
// const [showEditExpModal, setShowEditExpModal] = useState(false);
// const [editingExp, setEditingExp] = useState(null); // Stores the single node being updated
// const [showAddEduModal, setShowAddEduModal] = useState(false);
// const [showEditEduModal, setShowEditEduModal] = useState(false);
// const [masterEducations, setMasterEducations] = useState([]);
// const [newEdu, setNewEdu] = useState({
//   education_id: "",
//   institution_name: "",
//   start_year: "",
//   end_year: "",
//   score_metric: "Percentage", // Default value
//   score: ""
// });
// const [editingEdu, setEditingEdu] = useState(null);
// const SCORE_METRICS = ["Percentage", "CGPA", "GPA"];

// const handleUpdateExperience = async (e) => {
//   e.preventDefault();
//   setUpdating(true);
//   const toastId = toast.loading("Updating Employment Node...");

//   try {
//     const fd = new FormData();
//     fd.append("company_name", editingExp.company_name);
//     fd.append("job_title", editingExp.job_title);
//     fd.append("start_date", editingExp.start_date);
//     fd.append("end_date", editingExp.end_date);

//     if (editingExp.industry_id) fd.append("industry_id", parseInt(editingExp.industry_id));
//     if (editingExp.department_id) fd.append("department_id", parseInt(editingExp.department_id));
//     if (editingExp.previous_ctc) fd.append("previous_ctc", editingExp.previous_ctc);
//     if (editingExp.location) fd.append("location", editingExp.location);
//     if (editingExp.description) fd.append("description", editingExp.description);

//     // Artifact Logic
//     if (editingExp.artifact_type === 'file' && editingExp.exp_letter_file) {
//       fd.append("exp_letter_file", editingExp.exp_letter_file);
//     } else if (editingExp.artifact_type === 'link' && editingExp.exp_letter_link) {
//       fd.append("exp_letter_link", editingExp.exp_letter_link);
//     }

//     // Dynamic URL using Candidate ID and Experience ID
//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences/${editingExp.id}`, {
//       method: "PUT",
//       body: fd,
//     });

//     if (res.ok) {
//       toast.success("Node Updated Successfully", { id: toastId });

//       // Refresh Profile Data
//       const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
//       const freshData = await freshRes.json();
//       setEmployee(freshData);

//       setShowEditExpModal(false);
//       setEditingExp(null);
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Handshake Failed: Ensure all fields are valid", { id: toastId });
//   } finally {
//     setUpdating(false);
//   }
// };

// const addExperienceNode = () => {
//   setExperienceList([
//     ...experienceList,
//     {
//       company_name: "",
//       job_title: "",
//       start_date: "",
//       end_date: "",
//       location: "",
//       previous_ctc: "",
//       industry_id: "",
//       department_id: "",
//       description: "",
//       // Artifact Logic
//       artifact_type: "file", // internal UI helper: 'file' or 'link'
//       exp_letter_file: null,
//       exp_letter_link: ""
//     }
//   ]);
// };

//   const DEFAULT_LANGS = [
//     "English",
//     "Hindi",
//     "Marathi",
//     "Gujarati",
//     "Tamil",
//     "Telugu",
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   // Effect to sync modal state with employee data when modal opens
//   useEffect(() => {
//     if (showLanguageModal && employee?.languages_spoken) {
//       // If API returns string, split it; if array, use it directly
//       const current = Array.isArray(employee.languages_spoken)
//         ? employee.languages_spoken
//         : employee.languages_spoken.split(",").map((l) => l.trim());
//       setSelectedLangs(current);
//     }
//   }, [showLanguageModal, employee]);

//   // Initialize Modal Data
//   useEffect(() => {
//     if (showSkillAssetModal) {
//       fetchMasterSkills();
//       // Normalize Skills (handle Array or String)
//       const currentSkills = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(currentSkills);

//       // Normalize Assets
//       const currentAssets = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(currentAssets);
//     }
//   }, [showSkillAssetModal, employee]);

// // Fetch Master Registries for Industries and Departments
// useEffect(() => {
//   const fetchMasters = async () => {
//     try {
//       const [indRes, depRes] = await Promise.all([
//         fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100"),
//         fetch("https://apihrr.goelectronix.co.in/departments")
//       ]);
//       const indData = await indRes.json();
//       const depData = await depRes.json();
//       setIndustries(indData || []);
//       setDepartments(depRes.ok ? depData : []); // Safety check for department response
//     } catch (err) {
//       console.error("Registry Sync Failure", err);
//     }
//   };
//   fetchMasters();
// }, []);

// useEffect(() => {
//   const fetchEduMasters = async () => {
//     try {
//       const res = await fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100");
//       const data = await res.json();
//       setMasterEducations(data || []);
//     } catch (err) { console.error("Edu Master Sync Failure"); }
//   };
//   fetchEduMasters();
// }, []);

// // POST: Add New Academic Node
// const handleAddEducation = async (e) => {
//   e.preventDefault();
//   setUpdating(true);
//   const toastId = toast.loading("Deploying Academic Node...");
//   try {
//     const res = await fetch(`https://apihrr.goelectronix.co.in/education/${id}?user_type=candidate`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         education_id: parseInt(newEdu.education_id),
//         institution_name: newEdu.institution_name,
//         start_year: newEdu.start_year,
//         end_year: newEdu.end_year,
//         score_metric: newEdu.score_metric, // 🛠️ Added
//         score: newEdu.score // 🛠️ Added
//       }),
//     });
//     if (res.ok) {
//       toast.success("Academic Node Integrated", { id: toastId });
//       const freshData = await (await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`)).json();
//       setEmployee(freshData);
//       setShowAddEduModal(false);
//       setNewEdu({ education_id: "", institution_name: "", start_year: "", end_year: "" });
//     } else throw new Error();
//   } catch (err) { toast.error("Deployment Failed", { id: toastId }); } finally { setUpdating(false); }
// };

// // PATCH: Update Existing Academic Node
// const handleEditEducation = async (e) => {
//   e.preventDefault();
//   setUpdating(true);
//   const toastId = toast.loading("Patching Academic Node...");
//   try {
//     const res = await fetch(`https://apihrr.goelectronix.co.in/education/${editingEdu.id}?user_type=candidate`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         education_id: parseInt(editingEdu.education_id),
//         institution_name: editingEdu.institution_name,
//         start_year: editingEdu.start_year,
//         end_year: editingEdu.end_year,
//         score_metric: editingEdu.score_metric,
//         score: editingEdu.score

//       }),
//     });
//     if (res.ok) {
//       toast.success("Node Synchronized", { id: toastId });
//       const freshData = await (await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`)).json();
//       setEmployee(freshData);
//       setShowEditEduModal(false);
//     } else throw new Error();
//   } catch (err) { toast.error("Update Failed", { id: toastId }); } finally { setUpdating(false); }
// };

// // Protocol: Force a clean, empty state whenever the modal is activated
// useEffect(() => {
//   if (showExperienceModal) {
//     // 🛠️ ALWAYS reset the list to exactly one blank node
//     // This ignores any data already saved in the employee object
//     setExperienceList([
//       {
//         company_name: "",
//         job_title: "",
//         start_date: "",
//         end_date: "",
//         location: "",
//         previous_ctc: "",
//         industry_id: "",
//         department_id: "",
//         description: "",
//         artifact_type: "file",
//         exp_letter_file: null,
//         exp_letter_link: ""
//       }
//     ]);
//   } else {
//     // Purge state when modal closes to prevent "ghost data" next time
//     setExperienceList([]);
//   }
// }, [showExperienceModal]); // ⚠️ Only watch the modal state, NOT the employee data

//   // PATCH Transmission
//   const handleSyncRegistry = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Executing Node Synchronization...");
//     try {
//       const formData = new FormData();
//       formData.append("skills", selectedSkills.join(","));
//       formData.append("assets", selectedAssets.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Audit Registry Updated", { id: syncToast });
//         setEmployee({
//           ...employee,
//           skills: selectedSkills,
//           assets: selectedAssets,
//         });
//         setShowSkillAssetModal(false);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Handshake Refused", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Registry Logic
//   const fetchMasterSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterSkills(data || []);
//     } catch (err) {
//       console.error("Master Sync Failure");
//     }
//   };

//   // Initialize Skill Data when Skill Modal opens
//   useEffect(() => {
//     if (showSkillModal) {
//       fetchMasterSkills();
//       const current = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(current);
//     }
//   }, [showSkillModal, employee]);

//   // Initialize Asset Data when Asset Modal opens
//   useEffect(() => {
//     if (showAssetModal) {
//       const current = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(current);
//     }
//   }, [showAssetModal, employee]);

// const handleExperienceSync = async () => {
//   setUpdating(true);
//   const toastId = toast.loading("Deploying Employment Nodes...");

//   try {
//     const uploadPromises = experienceList.map(async (exp) => {
//       const fd = new FormData();

//       // Mandatory Protocol Nodes
//       fd.append("company_name", exp.company_name);
//       fd.append("job_title", exp.job_title);
//       fd.append("start_date", exp.start_date);
//       fd.append("end_date", exp.end_date);

//       // Master Node Identifiers (Integers)
//       if (exp.industry_id) fd.append("industry_id", parseInt(exp.industry_id));
//       if (exp.department_id) fd.append("department_id", parseInt(exp.department_id));

//       // Optional Meta-Data
//       if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
//       if (exp.location) fd.append("location", exp.location);

//       // Artifact Handling
//       if (exp.artifact_type === 'file' && exp.exp_letter_file) {
//         fd.append("exp_letter_file", exp.exp_letter_file);
//       } else if (exp.artifact_type === 'link' && exp.exp_letter_link) {
//         fd.append("exp_letter_link", exp.exp_letter_link);
//       }

//       const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
//         method: "POST",
//         body: fd,
//       });
//       if (!res.ok) throw new Error();
//       return res.json();
//     });

//     await Promise.all(uploadPromises);

//     toast.success("Nodes Integrated Successfully", { id: toastId });

//     // Refresh main profile to show the new list
//     const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
//     const freshData = await freshRes.json();
//     setEmployee(freshData);

//     // 🛠️ FINAL PURGE: Wiping local state
//     setExperienceList([]);
//     setShowExperienceModal(false);

//   } catch (err) {
//     toast.error("Handshake Failed: Ensure all fields are filled", { id: toastId });
//   } finally {
//     setUpdating(false);
//   }
// };

//   // Independent Sync Handlers
//   const syncSkills = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Skill Matrix...");
//     try {
//       const fd = new FormData();
//       fd.append("skills", selectedSkills.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Skill Node Updated", { id: toastId });
//         setEmployee({ ...employee, skills: selectedSkills });
//         setShowSkillModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const addManualSkill = () => {
//     const skill = newSkillInput.trim();
//     // Case-insensitive check to prevent duplicates
//     if (
//       skill &&
//       !selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
//     ) {
//       setSelectedSkills([...selectedSkills, skill]);
//       setNewSkillInput("");
//     }
//   };

//   const syncAssets = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Asset Registry...");
//     try {
//       const fd = new FormData();
//       fd.append("assets", selectedAssets.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Asset Node Updated", { id: toastId });
//         setEmployee({ ...employee, assets: selectedAssets });
//         setShowAssetModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(exp.start_date);
//       const end = exp.end_date ? new Date(exp.end_date) : new Date();
//       const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += Math.max(0, diff);
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
//   };

//   const handleLanguageUpdate = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Synchronizing Linguistic Nodes...");

//     try {
//       const formData = new FormData();
//       // Convert array to comma-separated string
//       formData.append("languages_spoken", selectedLangs.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Registry Updated Successfully", { id: syncToast });
//         // Refresh local employee state
//         setEmployee({ ...employee, languages_spoken: selectedLangs });
//         setShowLanguageModal(false);
//       } else {
//         throw new Error("Protocol Rejection");
//       }
//     } catch (err) {
//       toast.error("Handshake Failed", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleAddExperienceNode = async (e) => {
//   e.preventDefault();
//   setIsSubmittingExp(true);
//   const loadingToast = toast.loading("Deploying Employment Node...");

//   try {
//     const formData = new FormData();

//     // REQUIRED PROTOCOL NODES
//     formData.append("company_name", newExp.company_name);
//     formData.append("job_title", newExp.job_title);
//     formData.append("start_date", newExp.start_date);
//     formData.append("end_date", newExp.end_date);

//     // CLASSIFICATION NODES (Integers)
//     if (newExp.industry_id) formData.append("industry_id", parseInt(newExp.industry_id));
//     if (newExp.department_id) formData.append("department_id", parseInt(newExp.department_id));

//     // FINANCIAL & GEO NODES
//     if (newExp.previous_ctc) formData.append("previous_ctc", newExp.previous_ctc);
//     formData.append("location", newExp.location);
//     formData.append("description", newExp.description);

//     // ARTIFACT NODES (Binary & Link)
//     if (newExp.exp_letter_file) formData.append("exp_letter_file", newExp.exp_letter_file);
//     if (newExp.exp_letter_link) formData.append("exp_letter_link", newExp.exp_letter_link);

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       toast.success("Node Integrated Successfully", { id: loadingToast });
//       // Refresh local profile logic here...
//       setShowExperienceModal(false);
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Handshake Failed", { id: loadingToast });
//   } finally {
//     setIsSubmittingExp(false);
//   }
// };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900 font-bold tracking-tight">
//                 {employee?.full_name}
//               </span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN */}

//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
//               {/* Decorative Background Icon */}
//               <Fingerprint
//                 className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none"
//                 size={140}
//               />

//               <div className="flex flex-col items-center text-center relative z-10">
//                 <div className="relative group mb-6">
//                   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//                   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//                       {employee?.profile_image ? (
//                         <img
//                           src={employee.profile_image}
//                           alt={employee?.full_name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
//                           <User
//                             size={42}
//                             className="text-white mb-1"
//                             strokeWidth={1.5}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//                       <div className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//                   {employee?.full_name || "Unknown"}
//                 </h1>
//               </div>

//               {/* DATA STACK: Left Aligned Personal Info */}
//               <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
//                 <SidebarInfo
//                   icon={<Mail />}
//                   label=" Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone />}
//                   label="Primary Contact"
//                   value={employee?.phone}
//                 />

//                 {/* ADDED DOB & GENDER HERE */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <SidebarInfo
//                     icon={<Calendar />}
//                     label="Birth date"
//                     value={employee?.dob}
//                   />
//                   <SidebarInfo
//                     icon={<User />}
//                     label="Gender"
//                     // value={employee?.gender}
//                     value={
//                       employee?.gender
//                         ? employee.gender.charAt(0).toUpperCase() +
//                           employee.gender.slice(1)
//                         : ""
//                     }
//                   />
//                 </div>
//                 <SidebarInfo
//                   icon={<MapPin />}
//                   label="Location"
//                   value={
//                     [employee?.city, employee?.state, employee?.pincode]
//                       .filter(
//                         (val) =>
//                           val &&
//                           val !== "null" &&
//                           val !== "Not Specified" &&
//                           val !== "",
//                       ) // Removes null, "null" string, empty strings, and duplicates
//                       .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
//                   }
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="Candidate Overview"
//                 icon={<Activity size={18} />}
//               />
//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Document"
//                 icon={<ShieldCheck size={18} />}
//               />
//             </div>

//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
//                     {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       {/* Decorative Security Pattern Header */}
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
//                             <Languages size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Language
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Spoken
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 flex items-center">
//                           {/* 🛠️ ACTION NODE: ADD/EDIT BUTTON */}
//                           <div className="absolute top-4 right-6">
//                             <button
//                               onClick={() => setShowLanguageModal(true)}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-95 group/btn"
//                             >
//                               <Plus
//                                 size={12}
//                                 strokeWidth={3}
//                                 className="group-hover/btn:rotate-90 transition-transform"
//                               />
//                               Edit Languages
//                             </button>
//                           </div>
//                           <div className="space-y-3 w-full">
//                             <div className="flex items-center gap-2">
//                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                 Languages
//                               </span>
//                               <div className="h-[1px] flex-1 bg-slate-100" />
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                               {employee?.languages_spoken?.length > 0 ? (
//                                 employee.languages_spoken.map((lang, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
//                                   >
//                                     <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
//                                     <span className="text-[11px] font-black text-slate-700 uppercase">
//                                       {lang}
//                                     </span>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <span className="text-xs text-slate-600 font-medium">
//                                   No language data
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Globe
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>

//                     {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
//                             <Cpu size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Assets & Skill
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Assets & Skills Data
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//                           {/* Skills Subsection */}

//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Layers size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Skills
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => setShowSkillModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.skills &&
//                               (Array.isArray(employee.skills)
//                                 ? employee.skills.length > 0
//                                 : String(employee.skills).trim() !== "") ? (
//                                 (() => {
//                                   const allSkills = Array.isArray(
//                                     employee.skills,
//                                   )
//                                     ? employee.skills
//                                     : String(employee.skills).split(",");
//                                   const hasOverflow = allSkills.length > 4;
//                                   const visibleSkills = isSkillsExpanded
//                                     ? allSkills
//                                     : allSkills.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleSkills.map((skill, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof skill === "string"
//                                             ? skill.trim()
//                                             : String(skill)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsSkillsExpanded(
//                                               !isSkillsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isSkillsExpanded
//                                             ? "Show Less"
//                                             : `+${allSkills.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Skill Added
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Assets Subsection */}

//                           <div className="space-y-4">
//                             {/* SECTION HEADER */}
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Monitor size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Assets
//                                 </span>
//                               </div>

//                               <button
//                                 onClick={() => setShowAssetModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             {/* CHIP CONTAINER */}
//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.assets &&
//                               (Array.isArray(employee.assets)
//                                 ? employee.assets.length > 0
//                                 : String(employee.assets).trim() !== "") ? (
//                                 (() => {
//                                   // Normalize data into a unified array
//                                   const allAssets = Array.isArray(
//                                     employee.assets,
//                                   )
//                                     ? employee.assets
//                                     : String(employee.assets).split(",");
//                                   const hasOverflow = allAssets.length > 4;
//                                   const visibleAssets = isAssetsExpanded
//                                     ? allAssets
//                                     : allAssets.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleAssets.map((asset, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof asset === "string"
//                                             ? asset.trim()
//                                             : String(asset)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ ASSET EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsAssetsExpanded(
//                                               !isAssetsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isAssetsExpanded
//                                             ? "Show Less"
//                                             : `+${allAssets.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Assets Allocated
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Layers
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>
//                   </div>

//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">
//                     {/* SYSTEM WATERMARK: Large rotated background icon */}
//                     <History
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <History size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Candidate
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Previous Job History
//                           </p>
//                         </div>
//                       </div>

//                       {/* TENURE COUNTER */}
//                       <div className="flex items-center gap-3">
//                         <div className="flex flex-col items-end">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                             Total Experience
//                           </span>
//                           <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//                             {calculateTotalExperience(employee?.experiences)}
//                           </span>
//                         </div>

//                         <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//                         <div className="flex items-center gap-2 px-3 py-1  rounded-full">
//                           {/* EDIT BUTTON */}

// <button
//   type="button"
//   onClick={() => {
//     setExperienceList([]); // Force immediate purge
//     setShowExperienceModal(true); // Deploy Modal
//   }}
//   className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 border border-slate-200 hover:border-blue-500 text-white hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
// >

//   Add Experience
// </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     <div className="relative z-10">

//                       {employee?.experiences && employee.experiences.length > 0 ? (
//   <div className="divide-y divide-slate-100">
//     {employee.experiences.map((exp, i) => {

//       const industryName = industries.find(ind => ind.id === exp.industry_id)?.name || "General Industry";
//       const departmentName = departments.find(dep => dep.id === exp.department_id)?.name || "Operations";

//       // 🛠️ INDIVIDUAL DURATION CALCULATION PROTOCOL
//       const calculateSingleDuration = (start, end) => {
//         if (!start) return "—";
//         const startDate = new Date(start);
//         const endDate = end ? new Date(end) : new Date();

//         let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
//         months = Math.max(0, months);

//         const years = Math.floor(months / 12);
//         const remainingMonths = months % 12;

//         const yrText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : "";
//         const moText = remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : "";

//         return [yrText, moText].filter(Boolean).join(" ") || "1 mo";
//       };

//       return (
//         <div key={i} className="group hover:bg-slate-50/40 transition-colors duration-300">
//           <div className="flex flex-col md:flex-row p-8 gap-8">
//             {/* TIME IDENTIFIER */}
//             <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//               <span className="text-xl font-black text-slate-900 tracking-tighter">
//                 {exp?.start_date ? new Date(exp.start_date).getFullYear() : "----"}
//               </span>
//               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                 {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short" }) : "---"} DEPLOYMENT
//               </span>
//             </div>

//             {/* CONTENT BODY */}

//             {/* CONTENT BODY */}
// <div className="flex-1 space-y-4">
//   {/* TOP ROW: IDENTITY + TENURE / ACTIONS */}

//   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
//   {/* LEFT SIDE: PRIMARY IDENTITY */}
//   <div className="space-y-1.5 flex-1">
//     <div className="flex items-center gap-2">
//       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//         {exp?.company_name || "-"}
//       </h4>
//       <span className="h-1 w-1 rounded-full bg-slate-300" />
//       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//         {exp?.location || "-"}
//       </span>
//     </div>
//     <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">
//       {exp?.job_title || "-"}
//     </p>
//   </div>

//   {/* RIGHT SIDE: STATUS NODES + EDIT ACTION */}
//   <div className="flex items-start gap-4">
//     {/* DATA NODES STACK */}
//     <div className="flex items-end gap-2">
//       {/* Tenure Branding Box */}
//       <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
//         <Calendar size={12} className="text-blue-500" />
//         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
//           {calculateSingleDuration(exp.start_date, exp.end_date)}
//         </span>
//       </div>

//       {/* Artifact Node */}
//       {exp?.experience_letter_path ? (
//         <a
//           href={exp.experience_letter_path}
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//         >
//           <FileText size={12} className="text-slate-400 group-hover/artifact:text-blue-500" />
//           Letter
//           <ExternalLink size={10} className="opacity-40" />
//         </a>
//       ) : (
//         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
//           <Shield size={12} className="text-slate-300" />
//           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">No Artifact</span>
//         </div>
//       )}
//     </div>

//     {/* EDIT ACTION NODE: Separated for clarity */}
//     <div className="h-full pt-0.5">
//       <button
//         onClick={() => {
//           setEditingExp({
//             ...exp,
//             artifact_type: exp.experience_letter_path ? "link" : "file",
//             exp_letter_link: exp.experience_letter_path || ""
//           });
//           setShowEditExpModal(true);
//         }}
//         className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 hover:shadow-inner rounded-xl transition-all border border-slate-100"
//         title="Modify Entry"
//       >
//         <Edit3 size={16} strokeWidth={2.5} />
//       </button>
//     </div>
//   </div>
// </div>

//   {/* BOTTOM ROW: FINANCIALS & TIMELINE */}

//   {/* BOTTOM ROW: FINANCIALS, TIMELINE & CLASSIFICATION */}
// <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4 border-t border-slate-50">

//   {/* INDUSTRY NODE */}
//  <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Industry</span>
//             <span className="text-[11px] font-bold text-slate-700 uppercase">{industryName}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Department</span>
//             <span className="text-[11px] font-bold text-slate-700 uppercase">{departmentName}</span>
//           </div>

//   {/* CTC NODE */}
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous CTC</span>
//     <div className="flex items-center gap-1.5">
//       <span className="text-blue-600 font-black text-[10px]">₹</span>
//       <span className="text-[11px] font-bold text-slate-700">
//         {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//       </span>
//     </div>
//   </div>

//   {/* TIMELINE NODE */}
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline</span>
//     <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
//        {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "---"}
//        {" — "}
//        {exp?.end_date ? new Date(exp.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present"}
//     </span>
//   </div>
// </div>

//   {exp?.description && (
//     <div className="max-w-3xl pt-2">
//       <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
//         "{exp.description}"
//       </p>
//     </div>
//   )}
// </div>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// ) : (
//    <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <Database size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             Fresher Profile
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             No prior professional experience recorded
//                           </p>
//                         </div>
// )}
//                     </div>
//                   </div>

//                   {/* EDUCATION HISTORY: SYSTEM STREAM */}
//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
//                     {/* SYSTEM WATERMARK */}
//                     <Award
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <Award size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Academic History
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Education History
//                           </p>
//                         </div>
//                       </div>

//                       {/* EDIT REDIRECT */}
//                       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//                         {/* <button
//                           type="button"
//                           onClick={() => navigate(`/editentry/${id}?step=3`)}
//                           className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//                         >
//                           <Edit3 size={12} strokeWidth={3} />
//                           Edit Nodes
//                         </button> */}
//                         <button
//   onClick={() => setShowAddEduModal(true)}
//   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-200 transition-all active:scale-95 group"
// >
//   <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//   Add Academic Nodes
// </button>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     {/* <div className="relative z-10">
//                       {employee?.educations &&
//                       employee.educations.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.educations.map((edu, i) => (
//                             <div
//                               key={i}
//                               className="group/item hover:bg-slate-50/40 transition-colors duration-300"
//                             >
//                               <div className="flex flex-col md:flex-row p-8 gap-8">

//                                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                     {edu?.end_year || "----"}
//                                   </span>

//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                     GRADUATION
//                                   </span>
//                                 </div>

//                                 <div className="flex-1 space-y-4">
//                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                           {edu?.institution_name ||
//                                             "Unidentified Institute"}
//                                         </h4>
//                                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                                       </div>

//                                       <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                                         {edu?.education_master?.name ||
//                                           "Specialization Undefined"}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                         Academic Period
//                                       </span>
//                                       <div className="flex items-center gap-2">
//                                         <Calendar
//                                           size={12}
//                                           className="text-slate-300"
//                                         />
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                           {edu?.start_year || "----"} —{" "}
//                                           {edu?.end_year || "----"}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (

//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <GraduationCap size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             No Academic Records
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             Node synchronized but education array is empty
//                           </p>
//                         </div>
//                       )}
//                     </div> */}

//                     <div className="relative z-10">
//   {employee?.educations && employee.educations.length > 0 ? (
//     <div className="divide-y divide-slate-100">
//       {employee.educations.map((edu, i) => (
//         <div
//           key={i}
//           className="group/item hover:bg-slate-50/40 transition-colors duration-300 relative"
//         >
//           {/* --- MODAL TRIGGER AREA (Top Right) --- */}
//           <div className="absolute top-8 right-8 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
//             <button
//               onClick={() => {
//                 setEditingEdu(edu);
//                 setShowEditEduModal(true);
//               }}
//               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
//             >
//               <Edit3 size={12} strokeWidth={2.5} />
//               Modify Node
//             </button>
//           </div>

//           <div className="flex flex-col md:flex-row p-8 gap-8">
//             {/* TIME IDENTIFIER */}
//             <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//               <span className="text-xl font-black text-slate-900 tracking-tighter">
//                 {edu?.end_year || "----"}
//               </span>
//               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                 GRADUATION
//               </span>
//             </div>

//             {/* CONTENT BODY */}
//             {/* <div className="flex-1 space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                       {edu?.institution_name || "Unidentified Institute"}
//                     </h4>
//                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                   </div>

//                   <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                     {edu?.education_master?.name || "Specialization Undefined"}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                 <div className="flex flex-col">
//                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                     Academic Period
//                   </span>
//                   <div className="flex items-center gap-2">
//                     <Calendar
//                       size={12}
//                       className="text-slate-300"
//                     />
//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                       {edu?.start_year || "----"} — {edu?.end_year || "----"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//             <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-2">
//   {/* TIMELINE STACK */}
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//       Academic Period
//     </span>
//     <div className="flex items-center gap-2">
//       <Calendar size={12} className="text-slate-300" />
//       <span className="text-[11px] font-bold text-slate-700 uppercase">
//         {edu?.start_year || "----"} — {edu?.end_year || "----"}
//       </span>
//     </div>
//   </div>

//   {/* NEW: PERFORMANCE STACK */}
//   {/* <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//       Academic Performance
//     </span>
//     <div className="flex items-center gap-2">
//       <div className="px-2 py-0.5 bg-white border border-white rounded-md shadow-sm">
//         <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
//           {edu?.score_metric || "Not Specified"}: {edu?.score || "Not Specified"}
//         </span>
//       </div>

//       {parseFloat(edu?.score) > 9 && (
//         <BadgeCheck size={14} className="text-emerald-500 animate-pulse" />
//       )}
//     </div>
//   </div> */}
//   {/* PERFORMANCE STACK */}
// <div className="flex flex-col">
//   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//     Academic Score
//   </span>
//   <div className="flex items-center gap-2">
//     {edu?.score ? (
//       // SUCCESS STATE: Data is present
//       <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md shadow-sm">
//         <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
//           {edu.score_metric}: {edu.score}
//         </span>
//       </div>
//     ) : (
//       // NEUTRAL STATE: Data is missing
//       <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">
//           Not Specified
//         </span>
//       </div>
//     )}

//     {/* Subtle High-Performer Indicator */}
//     {/* {parseFloat(edu?.score) > 9 && (
//       <BadgeCheck size={14} className="text-blue-500" />
//     )} */}
//   </div>
// </div>
// </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   ) : (
//     /* EMPTY STATE */
//     <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//         <GraduationCap size={28} strokeWidth={1.5} />
//       </div>
//       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//         No Academic Records
//       </h4>
//       <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//         Node synchronized but education array is empty
//       </p>
//     </div>
//   )}
// </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Resume
//                       </h3>
//                     </div>
//                     {employee?.resume_path ? (
//                       <ModernDocCard
//                         title="Master Curriculum Vitae"
//                         url={employee.resume_path}
//                         type="resume"
//                         formatDocUrl={formatDocUrl}
//                       />
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                           Resume Missing
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Certificate
//                       </h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {employee?.certificates?.map((cert) => (
//                         <ModernDocCard
//                           key={cert.id}
//                           title={cert.name}
//                           url={cert.file_path}
//                           type="Certificate"
//                           formatDocUrl={formatDocUrl}
//                           icon={Award}
//                         />
//                       )) || (
//                         <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">
//                           No Certificates Found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* --- ENTERPRISE MODAL PORTAL --- */}

//       {showLanguageModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowLanguageModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white">
//                   <Languages size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Update Languages
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowLanguageModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-8">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
//                 Select nodes to sync with the candidate's communication stack.
//               </p>

//               {/* CHIP SELECTION GRID */}
//               <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                 {[...new Set([...DEFAULT_LANGS, ...selectedLangs])].map(
//                   (lang) => {
//                     const isSelected = selectedLangs.includes(lang);
//                     return (
//                       <button
//                         key={lang}
//                         type="button"
//                         onClick={() => {
//                           setSelectedLangs((prev) =>
//                             isSelected
//                               ? prev.filter((l) => l !== lang)
//                               : [...prev, lang],
//                           );
//                         }}
//                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
//                           isSelected
//                             ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
//                         }`}
//                       >
//                         {lang}
//                         {isSelected && (
//                           <CheckCircle size={12} strokeWidth={3} />
//                         )}
//                       </button>
//                     );
//                   },
//                 )}
//               </div>

//               <button
//                 disabled={updating}
//                 className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
//                 onClick={handleLanguageUpdate}
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <BadgeCheck size={16} />
//                 )}
//                 {updating ? "Synchronizing..." : "Update Linguistic Node"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: SKILL REGISTRY --- */}

//       {showSkillModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowSkillModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//             {/* HEADER NODE */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
//                   <Layers size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Skill
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowSkillModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-8">
//               {/* INPUT NODE: Manual Entry */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">
//                   Skill
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     value={newSkillInput}
//                     onChange={(e) => setNewSkillInput(e.target.value)}
//                     placeholder="Type and press Enter..."
//                     className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                     onKeyDown={(e) =>
//                       e.key === "Enter" &&
//                       (e.preventDefault(), addManualSkill())
//                     }
//                   />
//                   {/* <button type="button" onClick={addManualSkill} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Add</button> */}
//                 </div>
//               </div>

//               {/* ACTIVE NODES AREA (Everything in this list will be sent to API) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Selected Skills
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
//                     {selectedSkills.length} Selected
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-100 min-h-[80px]">
//                   {selectedSkills.length > 0 ? (
//                     selectedSkills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black uppercase shadow-sm animate-in zoom-in-95"
//                       >
//                         {skill}
//                         <X
//                           size={12}
//                           className="cursor-pointer hover:text-red-500 transition-colors"
//                           onClick={() =>
//                             setSelectedSkills(
//                               selectedSkills.filter((_, idx) => idx !== i),
//                             )
//                           }
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-[9px] font-black text-slate-300 uppercase m-auto tracking-widest">
//                       No Skills
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* MASTER REGISTRY: Quick Toggle Nodes */}
//               <div className="space-y-3 pt-4 border-t border-slate-100">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                   Skill History
//                 </label>
//                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
//                   {masterSkills.map((item) => {
//                     const name = item.name || item;
//                     const isSelected = selectedSkills.includes(name);
//                     return (
//                       <button
//                         key={name}
//                         type="button"
//                         onClick={() =>
//                           setSelectedSkills((prev) =>
//                             isSelected
//                               ? prev.filter((s) => s !== name)
//                               : [...prev, name],
//                           )
//                         }
//                         className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
//                           isSelected
//                             ? "bg-blue-500 border-blue-500 text-white shadow-md"
//                             : "bg-slate-50 border-slate-500 text-slate-800 hover:border-blue-200"
//                         }`}
//                       >
//                         {name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* SUBMIT BUTTON */}
//               <button
//                 disabled={updating}
//                 onClick={syncSkills}
//                 className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <ShieldCheck size={16} />
//                 )}
//                 Save Skills
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: HARDWARE ASSETS --- */}

//       {showAssetModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* Backdrop with Glassmorphism */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => !updating && setShowAssetModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* 1. BRANDED HEADER */}
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
//               <div className="flex items-center gap-5">
//                 {/* LOGO NODE */}
//                 <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
//                   <Monitor size={24} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
//                     Asset
//                   </h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                       Update the assets
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAssetModal(false)}
//                 className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
//               >
//                 <X size={20} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* 2. INPUT NODE */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-1">
//                   Add Assets
//                 </label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1 group">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                       <Plus size={16} strokeWidth={3} />
//                     </div>
//                     <input
//                       value={newAssetInput}
//                       onChange={(e) => setNewAssetInput(e.target.value)}
//                       placeholder="e.g. MacBook Pro M3"
//                       className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           if (newAssetInput.trim()) {
//                             setSelectedAssets([
//                               ...selectedAssets,
//                               newAssetInput.trim(),
//                             ]);
//                             setNewAssetInput("");
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* 3. ENHANCED CHIP CONTAINER (Matched to Skills Style) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
//                     Selected Assets
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//                     {selectedAssets.length} Allocated
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[120px] items-start content-start">
//                   {selectedAssets.length > 0 ? (
//                     selectedAssets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="group/chip flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm hover:border-blue-400 hover:shadow-md transition-all animate-in zoom-in-95"
//                       >
//                         <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
//                         {asset}
//                         <button
//                           onClick={() =>
//                             setSelectedAssets(
//                               selectedAssets.filter((_, idx) => idx !== i),
//                             )
//                           }
//                           className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
//                         >
//                           <X size={14} strokeWidth={3} />
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="m-auto flex flex-col items-center gap-2 opacity-30">
//                       <Database size={24} strokeWidth={1.5} />
//                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                         Registry Vacant
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* 4. SUBMIT ACTION */}
//               <button
//                 disabled={updating}
//                 onClick={syncAssets}
//                 className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Commit Allocation
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

// {showExperienceModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowExperienceModal(false)} />

//     <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//       {/* HEADER */}
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Add Experience</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add New Experiance</p>
//           </div>
//         </div>
//         <button onClick={() => setShowExperienceModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//         {experienceList.map((exp, index) => (
//           <div key={index} className="group p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative hover:border-blue-300 transition-all space-y-6">
//             <button
//               onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
//               className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
//             >
//               <X size={16} strokeWidth={3} />
//             </button>

//             {/* GRID 1: IDENTITY */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Google" value={exp.company_name} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].company_name = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
//                 <select
//                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                   value={exp.industry_id}
//                   onChange={(e) => {
//                     const newList = [...experienceList]; newList[index].industry_id = e.target.value; setExperienceList(newList);
//                   }}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map(ind => (
//                     <option key={ind.id} value={ind.id}>{ind.name}</option>
//                   ))}
//                 </select>
//               </div>

//             </div>

//             {/* GRID 2: INDUSTRY & DEPARTMENT SELECTION */}
//             <div className="grid grid-cols-2 gap-6">

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//                 <select
//                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                   value={exp.department_id}
//                   onChange={(e) => {
//                     const newList = [...experienceList]; newList[index].department_id = e.target.value; setExperienceList(newList);
//                   }}
//                 >
//                   <option value="">Select Department</option>
//                   {departments.map(dep => (
//                     <option key={dep.id} value={dep.id}>{dep.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Senior Dev" value={exp.job_title} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].job_title = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             {/* GRID 3: TIMELINE & PAYROLL */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.start_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].start_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.end_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].end_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTC (LPA)</label>
//                 <input type="number" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm" placeholder="e.g. 1200000" value={exp.previous_ctc} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].previous_ctc = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             {/* ARTIFACT SWITCHER PROTOCOL */}
//             <div className="space-y-4 pt-4 border-t border-slate-200/60">
//               <div className="flex items-center justify-between">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Validation Artifact</label>
//                 <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "file"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
//                   >Upload PDF</button>
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "link"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
//                   >External Link</button>
//                 </div>
//               </div>

//               <div className="animate-in slide-in-from-top-2 duration-300">
//                 {exp.artifact_type === "file" ? (
//                   <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.png" onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_file = e.target.files[0]; setExperienceList(newList);
//                     }} />
//                     <Download size={20} className="text-slate-300 mb-1" />
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       {exp.exp_letter_file ? exp.exp_letter_file.name : "Select Binary File"}
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" placeholder="https://drive.google.com/..." value={exp.exp_letter_link} onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_link = e.target.value; setExperienceList(newList);
//                     }} />
//                     <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={addExperienceNode}
//           className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[11px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-slate-50/50"
//         >
//           <Plus size={16} strokeWidth={3} /> Add New Record
//         </button>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">

// <button
//   disabled={
//     updating ||
//     experienceList.length === 0 ||
//     experienceList.some(exp => !exp.company_name || !exp.job_title || !exp.start_date || !exp.end_date)
//   }
//   onClick={handleExperienceSync}
//   className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
// >
//   {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//   Add Experiance
// </button>
//       </div>
//     </div>
//   </div>
// )}

// {showEditExpModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowEditExpModal(false)} />

//     <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//       {/* HEADER - Reused Design */}
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Experience</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modify Professional Registry Node</p>
//           </div>
//         </div>
//         <button onClick={() => setShowEditExpModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//           <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative space-y-6">

//             {/* GRID 1: IDENTITY */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" value={editingExp.company_name} onChange={(e) => setEditingExp({...editingExp, company_name: e.target.value})} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
//                 <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none" value={editingExp.industry_id} onChange={(e) => setEditingExp({...editingExp, industry_id: e.target.value})}>
//                   <option value="">Select Industry</option>
//                   {industries.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* GRID 2: DEPT & POSITION */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//                 <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none" value={editingExp.department_id} onChange={(e) => setEditingExp({...editingExp, department_id: e.target.value})}>
//                   <option value="">Select Department</option>
//                   {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" value={editingExp.job_title} onChange={(e) => setEditingExp({...editingExp, job_title: e.target.value})} />
//               </div>
//             </div>

//             {/* GRID 3: DATES & CTC */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={editingExp.start_date} onChange={(e) => setEditingExp({...editingExp, start_date: e.target.value})} />
//               </div>
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={editingExp.end_date} onChange={(e) => setEditingExp({...editingExp, end_date: e.target.value})} />
//               </div>
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTC (LPA)</label>
//                 <input type="number" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm" value={editingExp.previous_ctc} onChange={(e) => setEditingExp({...editingExp, previous_ctc: e.target.value})} />
//               </div>
//             </div>

//             {/* ARTIFACT SWITCHER */}
//             <div className="space-y-4 pt-4 border-t border-slate-200/60">
//               <div className="flex items-center justify-between">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Experiance certificate</label>
//                 <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                   <button onClick={() => setEditingExp({...editingExp, artifact_type: "file"})} className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Upload PDF</button>
//                   <button onClick={() => setEditingExp({...editingExp, artifact_type: "link"})} className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>External Link</button>
//                 </div>
//               </div>

//               <div className="animate-in slide-in-from-top-2">
//                 {editingExp.artifact_type === "file" ? (
//                   <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setEditingExp({...editingExp, exp_letter_file: e.target.files[0]})} />
//                     <Download size={20} className="text-slate-300 mb-1" />
//                     <span className="text-[9px] font-black text-slate-400 uppercase">{editingExp.exp_letter_file ? editingExp.exp_letter_file.name : "Select New File"}</span>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" value={editingExp.exp_letter_link} onChange={(e) => setEditingExp({...editingExp, exp_letter_link: e.target.value})} />
//                     <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">
//         <button disabled={updating} onClick={handleUpdateExperience} className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//           Update Experiance
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// {/* {showAddEduModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddEduModal(false)} />
//     <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><GraduationCap size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Add Academic History</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deploy New Academic Node</p>
//           </div>
//         </div>
//         <button onClick={() => setShowAddEduModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>
//       <form onSubmit={handleAddEducation} className="p-10 space-y-6 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Type</label>
//           <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={newEdu.education_id} onChange={(e) => setNewEdu({...newEdu, education_id: e.target.value})}>
//             <option value="">Select Degree</option>
//             {masterEducations.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//           </select>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
//           <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="University of Mumbai" value={newEdu.institution_name} onChange={(e) => setNewEdu({...newEdu, institution_name: e.target.value})} />
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2018" value={newEdu.start_year} onChange={(e) => setNewEdu({...newEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2022" value={newEdu.end_year} onChange={(e) => setNewEdu({...newEdu, end_year: e.target.value})} />
//           </div>
//         </div>
//         <button disabled={updating} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />} Commit Academic Node
//         </button>
//       </form>
//     </div>
//   </div>
// )} */}

// {showAddEduModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddEduModal(false)} />
//     <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><GraduationCap size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Add Academic History</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1"> New Academic Data</p>
//           </div>
//         </div>
//         <button onClick={() => setShowAddEduModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <form onSubmit={handleAddEducation} className="p-10 space-y-6 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Type</label>
//           <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={newEdu.education_id} onChange={(e) => setNewEdu({...newEdu, education_id: e.target.value})}>
//             <option value="">Select Degree</option>
//             {masterEducations.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//           </select>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
//           <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="University of Mumbai" value={newEdu.institution_name} onChange={(e) => setNewEdu({...newEdu, institution_name: e.target.value})} />
//         </div>

//         {/* 🛠️ SCORE CONFIGURATION NODE */}
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Score Type</label>
//             <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={newEdu.score_metric} onChange={(e) => setNewEdu({...newEdu, score_metric: e.target.value})}>
//               <option value="Percentage">Percentage</option>
//               <option value="CGPA">CGPA</option>
//               <option value="GPA">GPA</option>
//             </select>
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Score Value</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder={newEdu.score_metric === 'Percentage' ? "e.g. 85.5" : "e.g. 9.2"} value={newEdu.score} onChange={(e) => setNewEdu({...newEdu, score: e.target.value})} />
//           </div>
//         </div>

//         {/* <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2018" value={newEdu.start_year} onChange={(e) => setNewEdu({...newEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" placeholder="2022" value={newEdu.end_year} onChange={(e) => setNewEdu({...newEdu, end_year: e.target.value})} />
//           </div>
//         </div> */}

//         <div className="grid grid-cols-2 gap-6">
//   {/* START YEAR NODE */}
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       Start Year
//     </label>
//     <div className="relative group">
//       <select
//         required
//         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//         value={newEdu.start_year}
//         onChange={(e) => setNewEdu({...newEdu, start_year: e.target.value})}
//       >
//         <option value="">Year</option>
//         {/* Generates a 40-year window from 2030 downwards */}
//         {Array.from({ length: 41 }, (_, i) => 2030 - i).map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <Calendar
//         size={14}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
//       />
//     </div>
//   </div>

//   {/* END YEAR NODE */}
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       End Year
//     </label>
//     <div className="relative group">
//       <select
//         required
//         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//         value={newEdu.end_year}
//         onChange={(e) => setNewEdu({...newEdu, end_year: e.target.value})}
//       >
//         <option value="">Year</option>
//         {Array.from({ length: 41 }, (_, i) => 2030 - i).map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <Calendar
//         size={14}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors"
//       />
//     </div>
//   </div>
// </div>

//         <button disabled={updating} type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />} Add Academic
//         </button>
//       </form>
//     </div>
//   </div>
// )}

// {/* {showEditEduModal && editingEdu && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowEditEduModal(false)} />
//     <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg"><Edit3 size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Academic Record</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modify Existing Registry Node</p>
//           </div>
//         </div>
//         <button onClick={() => setShowEditEduModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>
//       <form onSubmit={handleEditEducation} className="p-10 space-y-6 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Type</label>
//           <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={editingEdu.education_id} onChange={(e) => setEditingEdu({...editingEdu, education_id: e.target.value})}>
//             {masterEducations.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//           </select>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
//           <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.institution_name} onChange={(e) => setEditingEdu({...editingEdu, institution_name: e.target.value})} />
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.start_year} onChange={(e) => setEditingEdu({...editingEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.end_year} onChange={(e) => setEditingEdu({...editingEdu, end_year: e.target.value})} />
//           </div>
//         </div>
//         <button disabled={updating} type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />} Commit Changes
//         </button>
//       </form>
//     </div>
//   </div>
// )} */}

// {showEditEduModal && editingEdu && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowEditEduModal(false)} />
//     <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Edit3 size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Academic Record</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Edit Existing Data</p>
//           </div>
//         </div>
//         <button onClick={() => setShowEditEduModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <form onSubmit={handleEditEducation} className="p-10 space-y-6 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Type</label>
//           <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={editingEdu.education_id} onChange={(e) => setEditingEdu({...editingEdu, education_id: e.target.value})}>
//             {masterEducations.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//           </select>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
//           <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.institution_name} onChange={(e) => setEditingEdu({...editingEdu, institution_name: e.target.value})} />
//         </div>

//         {/* 🛠️ SCORE CONFIGURATION NODE */}
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Score type</label>
//             <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={editingEdu.score_metric} onChange={(e) => setEditingEdu({...editingEdu, score_metric: e.target.value})}>
//               <option value="Percentage">Percentage</option>
//               <option value="CGPA">CGPA</option>
//               <option value="GPA">GPA</option>
//             </select>
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Score Value</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.score} onChange={(e) => setEditingEdu({...editingEdu, score: e.target.value})} />
//           </div>
//         </div>

//         {/* <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.start_year} onChange={(e) => setEditingEdu({...editingEdu, start_year: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingEdu.end_year} onChange={(e) => setEditingEdu({...editingEdu, end_year: e.target.value})} />
//           </div>
//         </div> */}

//         <div className="grid grid-cols-2 gap-6">
//   {/* START YEAR NODE */}
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       Start Year
//     </label>
//     <div className="relative group">
//       <select
//         required
//         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//         value={editingEdu?.start_year || ""}
//         onChange={(e) => setEditingEdu({...editingEdu, start_year: e.target.value})}
//       >
//         <option value="">Year</option>
//         {Array.from({ length: 41 }, (_, i) => 2030 - i).map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
//     </div>
//   </div>

//   {/* END YEAR NODE */}
//   <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       End Year
//     </label>
//     <div className="relative group">
//       <select
//         required
//         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer pr-10"
//         value={editingEdu?.end_year || ""}
//         onChange={(e) => setEditingEdu({...editingEdu, end_year: e.target.value})}
//       >
//         <option value="">Year</option>
//         {Array.from({ length: 41 }, (_, i) => 2030 - i).map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
//     </div>
//   </div>
// </div>

//         <button disabled={updating} type="submit" className="w-full py-5 bg-blue-500 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />} Edit Academic
//         </button>
//       </form>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
//       {React.cloneElement(icon, { size: 14 })}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-bold text-slate-700 break-all">
//         {value || "Not Specified"}
//       </span>
//     </div>
//   </div>
// );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
//   <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//       <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && (
//           <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />
//         )}
//       </div>
//       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
//         {title}
//       </h3>
//     </div>
//     <div className="relative z-10 p-6 space-y-4">{children}</div>
//     <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
//       {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}
//   >
//     <div className="flex items-center gap-2 text-slate-400">
//       {icon}
//       <span className="text-[10px] font-black uppercase tracking-widest">
//         {label}
//       </span>
//     </div>
//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {value ? (
//           String(value)
//             .split(",")
//             .map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter"
//               >
//                 {skill.trim()}
//               </span>
//             ))
//         ) : (
//           <span className="text-[10px] text-slate-300 uppercase">Void</span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-black text-slate-800 uppercase">
//         {value || "—"}
//       </span>
//     )}
//   </div>
// );

// const ModernDocCard = ({
//   title,
//   url,
//   type,
//   formatDocUrl,
//   icon: CardIcon = FileText,
// }) => (
//   <a
//     href={formatDocUrl(url)}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm"
//   >
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
//           {title}
//         </p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
//           {type}
//         </p>
//       </div>
//     </div>
//     <ExternalLink
//       size={16}
//       className="text-slate-200 group-hover:text-blue-600 transition-colors"
//     />
//   </a>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-400 hover:text-slate-600"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="relative w-16 h-16">
//       <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
//       <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//     </div>
//     <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
//       Loading ...
//     </p>
//   </div>
// );

// const StripDetail = ({ icon, label, value }) => (
//   <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
//     {/* ICON BRANDING BOX: Glassmorphism effect */}
//     <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
//       <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
//         {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
//       </div>
//     </div>

//     {/* DATA STACK */}
//     <div className="flex flex-col min-w-0">
//       <div className="flex items-center gap-1.5 mb-0.5">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
//           {label}
//         </span>
//         {/* Verification Dot: Hidden by default, shown on hover */}
//         <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
//           {value || "—"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
//************************************************************working code phase 1 24/06******************************************* */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   CheckCircle,
//   Loader2,
//   MapPin,
//   History,
//   User,
//   Plus,
//   Briefcase,
//   X,
//   GraduationCap,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
//   Fingerprint,
//   Cpu,
//   Layers,
//   Award,
//   BadgeCheck,
//   Languages,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [selectedLangs, setSelectedLangs] = useState([]);
//   const [updating, setUpdating] = useState(false);
//   const [showSkillAssetModal, setShowSkillAssetModal] = useState(false);
//   const [masterSkills, setMasterSkills] = useState([]); // All possible skills
//   const [selectedSkills, setSelectedSkills] = useState([]); // Candidate's skills
//   const [selectedAssets, setSelectedAssets] = useState([]); // Candidate's assets
//   const [newAssetInput, setNewAssetInput] = useState("");
//   const [showSkillModal, setShowSkillModal] = useState(false);
//   const [showAssetModal, setShowAssetModal] = useState(false);
//   const [newSkillInput, setNewSkillInput] = useState("");
//   const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
//   const [isAssetsExpanded, setIsAssetsExpanded] = useState(false);
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
// const [experienceList, setExperienceList] = useState([]);
// const [isSubmittingExp, setIsSubmittingExp] = useState(false);
// const [newExp, setNewExp] = useState({
//   company_name: "",
//   job_title: "",
//   start_date: "",
//   end_date: "",
//   previous_ctc: "",
//   location: "",
//   description: "",
//   industry_id: "", // Node: integer
//   department_id: "", // Node: integer
//   exp_letter_file: null, // Node: binary
//   exp_letter_link: "" // Node: string/url
// });
// const [industries, setIndustries] = useState([]);
// const [departments, setDepartments] = useState([]);
// const [showEditExpModal, setShowEditExpModal] = useState(false);
// const [editingExp, setEditingExp] = useState(null); // Stores the single node being updated

// const handleUpdateExperience = async (e) => {
//   e.preventDefault();
//   setUpdating(true);
//   const toastId = toast.loading("Updating Employment Node...");

//   try {
//     const fd = new FormData();
//     fd.append("company_name", editingExp.company_name);
//     fd.append("job_title", editingExp.job_title);
//     fd.append("start_date", editingExp.start_date);
//     fd.append("end_date", editingExp.end_date);

//     if (editingExp.industry_id) fd.append("industry_id", parseInt(editingExp.industry_id));
//     if (editingExp.department_id) fd.append("department_id", parseInt(editingExp.department_id));
//     if (editingExp.previous_ctc) fd.append("previous_ctc", editingExp.previous_ctc);
//     if (editingExp.location) fd.append("location", editingExp.location);
//     if (editingExp.description) fd.append("description", editingExp.description);

//     // Artifact Logic
//     if (editingExp.artifact_type === 'file' && editingExp.exp_letter_file) {
//       fd.append("exp_letter_file", editingExp.exp_letter_file);
//     } else if (editingExp.artifact_type === 'link' && editingExp.exp_letter_link) {
//       fd.append("exp_letter_link", editingExp.exp_letter_link);
//     }

//     // Dynamic URL using Candidate ID and Experience ID
//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences/${editingExp.id}`, {
//       method: "PUT",
//       body: fd,
//     });

//     if (res.ok) {
//       toast.success("Node Updated Successfully", { id: toastId });

//       // Refresh Profile Data
//       const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
//       const freshData = await freshRes.json();
//       setEmployee(freshData);

//       setShowEditExpModal(false);
//       setEditingExp(null);
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Handshake Failed: Ensure all fields are valid", { id: toastId });
//   } finally {
//     setUpdating(false);
//   }
// };

// const addExperienceNode = () => {
//   setExperienceList([
//     ...experienceList,
//     {
//       company_name: "",
//       job_title: "",
//       start_date: "",
//       end_date: "",
//       location: "",
//       previous_ctc: "",
//       industry_id: "",
//       department_id: "",
//       description: "",
//       // Artifact Logic
//       artifact_type: "file", // internal UI helper: 'file' or 'link'
//       exp_letter_file: null,
//       exp_letter_link: ""
//     }
//   ]);
// };

//   const DEFAULT_LANGS = [
//     "English",
//     "Hindi",
//     "Marathi",
//     "Gujarati",
//     "Tamil",
//     "Telugu",
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   // Effect to sync modal state with employee data when modal opens
//   useEffect(() => {
//     if (showLanguageModal && employee?.languages_spoken) {
//       // If API returns string, split it; if array, use it directly
//       const current = Array.isArray(employee.languages_spoken)
//         ? employee.languages_spoken
//         : employee.languages_spoken.split(",").map((l) => l.trim());
//       setSelectedLangs(current);
//     }
//   }, [showLanguageModal, employee]);

//   // Initialize Modal Data
//   useEffect(() => {
//     if (showSkillAssetModal) {
//       fetchMasterSkills();
//       // Normalize Skills (handle Array or String)
//       const currentSkills = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(currentSkills);

//       // Normalize Assets
//       const currentAssets = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(currentAssets);
//     }
//   }, [showSkillAssetModal, employee]);

// // Fetch Master Registries for Industries and Departments
// useEffect(() => {
//   const fetchMasters = async () => {
//     try {
//       const [indRes, depRes] = await Promise.all([
//         fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100"),
//         fetch("https://apihrr.goelectronix.co.in/departments")
//       ]);
//       const indData = await indRes.json();
//       const depData = await depRes.json();
//       setIndustries(indData || []);
//       setDepartments(depRes.ok ? depData : []); // Safety check for department response
//     } catch (err) {
//       console.error("Registry Sync Failure", err);
//     }
//   };
//   fetchMasters();
// }, []);

// // Protocol: Force a clean, empty state whenever the modal is activated
// useEffect(() => {
//   if (showExperienceModal) {
//     // 🛠️ ALWAYS reset the list to exactly one blank node
//     // This ignores any data already saved in the employee object
//     setExperienceList([
//       {
//         company_name: "",
//         job_title: "",
//         start_date: "",
//         end_date: "",
//         location: "",
//         previous_ctc: "",
//         industry_id: "",
//         department_id: "",
//         description: "",
//         artifact_type: "file",
//         exp_letter_file: null,
//         exp_letter_link: ""
//       }
//     ]);
//   } else {
//     // Purge state when modal closes to prevent "ghost data" next time
//     setExperienceList([]);
//   }
// }, [showExperienceModal]); // ⚠️ Only watch the modal state, NOT the employee data

//   // PATCH Transmission
//   const handleSyncRegistry = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Executing Node Synchronization...");
//     try {
//       const formData = new FormData();
//       formData.append("skills", selectedSkills.join(","));
//       formData.append("assets", selectedAssets.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Audit Registry Updated", { id: syncToast });
//         setEmployee({
//           ...employee,
//           skills: selectedSkills,
//           assets: selectedAssets,
//         });
//         setShowSkillAssetModal(false);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Handshake Refused", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Registry Logic
//   const fetchMasterSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterSkills(data || []);
//     } catch (err) {
//       console.error("Master Sync Failure");
//     }
//   };

//   // Initialize Skill Data when Skill Modal opens
//   useEffect(() => {
//     if (showSkillModal) {
//       fetchMasterSkills();
//       const current = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(current);
//     }
//   }, [showSkillModal, employee]);

//   // Initialize Asset Data when Asset Modal opens
//   useEffect(() => {
//     if (showAssetModal) {
//       const current = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(current);
//     }
//   }, [showAssetModal, employee]);

// // const handleExperienceSync = async () => {
// //   setUpdating(true);
// //   const toastId = toast.loading("Deploying Employment Nodes...");

// //   try {
// //     const uploadPromises = experienceList.map(async (exp) => {
// //       const fd = new FormData();
// //       fd.append("company_name", exp.company_name);
// //       fd.append("job_title", exp.job_title);
// //       fd.append("start_date", exp.start_date);
// //       fd.append("end_date", exp.end_date);
// //       if (exp.industry_id) fd.append("industry_id", parseInt(exp.industry_id));
// //       if (exp.department_id) fd.append("department_id", parseInt(exp.department_id));

// //       // ... (rest of your FormData appends)

// //       const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
// //         method: "POST",
// //         body: fd,
// //       });
// //       return res; // Return the response for the Promise.all
// //     });

// //     // 🛠️ WAIT FOR ALL UPLOADS TO FINISH
// //     const results = await Promise.all(uploadPromises);
// //     const allSuccessful = results.every(res => res.ok);

// //     // --- ADD YOUR BLOCK HERE ---
// //     if (allSuccessful) {
// //       toast.success("Nodes Integrated Successfully", { id: toastId });

// //       // Re-fetch profile to show new data on the main page
// //       const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
// //       const freshData = await freshRes.json();
// //       setEmployee(freshData);

// //       // 🛠️ DATA CLEANUP: Clear the modal state
// //       setExperienceList([]);
// //       setShowExperienceModal(false);
// //     } else {
// //       throw new Error("One or more nodes failed to sync");
// //     }

// //   } catch (err) {
// //     toast.error("Handshake Failed: Ensure all mandatory fields are filled", { id: toastId });
// //   } finally {
// //     setUpdating(false);
// //   }
// // };

// const handleExperienceSync = async () => {
//   setUpdating(true);
//   const toastId = toast.loading("Deploying Employment Nodes...");

//   try {
//     const uploadPromises = experienceList.map(async (exp) => {
//       const fd = new FormData();

//       // Mandatory Protocol Nodes
//       fd.append("company_name", exp.company_name);
//       fd.append("job_title", exp.job_title);
//       fd.append("start_date", exp.start_date);
//       fd.append("end_date", exp.end_date);

//       // Master Node Identifiers (Integers)
//       if (exp.industry_id) fd.append("industry_id", parseInt(exp.industry_id));
//       if (exp.department_id) fd.append("department_id", parseInt(exp.department_id));

//       // Optional Meta-Data
//       if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
//       if (exp.location) fd.append("location", exp.location);

//       // Artifact Handling
//       if (exp.artifact_type === 'file' && exp.exp_letter_file) {
//         fd.append("exp_letter_file", exp.exp_letter_file);
//       } else if (exp.artifact_type === 'link' && exp.exp_letter_link) {
//         fd.append("exp_letter_link", exp.exp_letter_link);
//       }

//       const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
//         method: "POST",
//         body: fd,
//       });
//       if (!res.ok) throw new Error();
//       return res.json();
//     });

//     await Promise.all(uploadPromises);

//     toast.success("Nodes Integrated Successfully", { id: toastId });

//     // Refresh main profile to show the new list
//     const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
//     const freshData = await freshRes.json();
//     setEmployee(freshData);

//     // 🛠️ FINAL PURGE: Wiping local state
//     setExperienceList([]);
//     setShowExperienceModal(false);

//   } catch (err) {
//     toast.error("Handshake Failed: Ensure all fields are filled", { id: toastId });
//   } finally {
//     setUpdating(false);
//   }
// };

//   // Independent Sync Handlers
//   const syncSkills = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Skill Matrix...");
//     try {
//       const fd = new FormData();
//       fd.append("skills", selectedSkills.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Skill Node Updated", { id: toastId });
//         setEmployee({ ...employee, skills: selectedSkills });
//         setShowSkillModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const addManualSkill = () => {
//     const skill = newSkillInput.trim();
//     // Case-insensitive check to prevent duplicates
//     if (
//       skill &&
//       !selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
//     ) {
//       setSelectedSkills([...selectedSkills, skill]);
//       setNewSkillInput("");
//     }
//   };

//   const syncAssets = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Asset Registry...");
//     try {
//       const fd = new FormData();
//       fd.append("assets", selectedAssets.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Asset Node Updated", { id: toastId });
//         setEmployee({ ...employee, assets: selectedAssets });
//         setShowAssetModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(exp.start_date);
//       const end = exp.end_date ? new Date(exp.end_date) : new Date();
//       const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += Math.max(0, diff);
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
//   };

//   const handleLanguageUpdate = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Synchronizing Linguistic Nodes...");

//     try {
//       const formData = new FormData();
//       // Convert array to comma-separated string
//       formData.append("languages_spoken", selectedLangs.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Registry Updated Successfully", { id: syncToast });
//         // Refresh local employee state
//         setEmployee({ ...employee, languages_spoken: selectedLangs });
//         setShowLanguageModal(false);
//       } else {
//         throw new Error("Protocol Rejection");
//       }
//     } catch (err) {
//       toast.error("Handshake Failed", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleAddExperienceNode = async (e) => {
//   e.preventDefault();
//   setIsSubmittingExp(true);
//   const loadingToast = toast.loading("Deploying Employment Node...");

//   try {
//     const formData = new FormData();

//     // REQUIRED PROTOCOL NODES
//     formData.append("company_name", newExp.company_name);
//     formData.append("job_title", newExp.job_title);
//     formData.append("start_date", newExp.start_date);
//     formData.append("end_date", newExp.end_date);

//     // CLASSIFICATION NODES (Integers)
//     if (newExp.industry_id) formData.append("industry_id", parseInt(newExp.industry_id));
//     if (newExp.department_id) formData.append("department_id", parseInt(newExp.department_id));

//     // FINANCIAL & GEO NODES
//     if (newExp.previous_ctc) formData.append("previous_ctc", newExp.previous_ctc);
//     formData.append("location", newExp.location);
//     formData.append("description", newExp.description);

//     // ARTIFACT NODES (Binary & Link)
//     if (newExp.exp_letter_file) formData.append("exp_letter_file", newExp.exp_letter_file);
//     if (newExp.exp_letter_link) formData.append("exp_letter_link", newExp.exp_letter_link);

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       toast.success("Node Integrated Successfully", { id: loadingToast });
//       // Refresh local profile logic here...
//       setShowExperienceModal(false);
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Handshake Failed", { id: loadingToast });
//   } finally {
//     setIsSubmittingExp(false);
//   }
// };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900 font-bold tracking-tight">
//                 {employee?.full_name}
//               </span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN */}

//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
//               {/* Decorative Background Icon */}
//               <Fingerprint
//                 className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none"
//                 size={140}
//               />

//               <div className="flex flex-col items-center text-center relative z-10">
//                 <div className="relative group mb-6">
//                   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//                   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//                       {employee?.profile_image ? (
//                         <img
//                           src={employee.profile_image}
//                           alt={employee?.full_name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
//                           <User
//                             size={42}
//                             className="text-white mb-1"
//                             strokeWidth={1.5}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//                       <div className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//                   {employee?.full_name || "Unknown"}
//                 </h1>
//               </div>

//               {/* DATA STACK: Left Aligned Personal Info */}
//               <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
//                 <SidebarInfo
//                   icon={<Mail />}
//                   label=" Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone />}
//                   label="Primary Contact"
//                   value={employee?.phone}
//                 />

//                 {/* ADDED DOB & GENDER HERE */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <SidebarInfo
//                     icon={<Calendar />}
//                     label="Birth date"
//                     value={employee?.dob}
//                   />
//                   <SidebarInfo
//                     icon={<User />}
//                     label="Gender"
//                     // value={employee?.gender}
//                     value={
//                       employee?.gender
//                         ? employee.gender.charAt(0).toUpperCase() +
//                           employee.gender.slice(1)
//                         : ""
//                     }
//                   />
//                 </div>
//                 <SidebarInfo
//                   icon={<MapPin />}
//                   label="Location"
//                   value={
//                     [employee?.city, employee?.state, employee?.pincode]
//                       .filter(
//                         (val) =>
//                           val &&
//                           val !== "null" &&
//                           val !== "Not Specified" &&
//                           val !== "",
//                       ) // Removes null, "null" string, empty strings, and duplicates
//                       .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
//                   }
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="Candidate Overview"
//                 icon={<Activity size={18} />}
//               />
//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Document"
//                 icon={<ShieldCheck size={18} />}
//               />
//             </div>

//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
//                     {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       {/* Decorative Security Pattern Header */}
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
//                             <Languages size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Language
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Spoken
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 flex items-center">
//                           {/* 🛠️ ACTION NODE: ADD/EDIT BUTTON */}
//                           <div className="absolute top-4 right-6">
//                             <button
//                               onClick={() => setShowLanguageModal(true)}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-95 group/btn"
//                             >
//                               <Plus
//                                 size={12}
//                                 strokeWidth={3}
//                                 className="group-hover/btn:rotate-90 transition-transform"
//                               />
//                               Edit Languages
//                             </button>
//                           </div>
//                           <div className="space-y-3 w-full">
//                             <div className="flex items-center gap-2">
//                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                 Languages
//                               </span>
//                               <div className="h-[1px] flex-1 bg-slate-100" />
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                               {employee?.languages_spoken?.length > 0 ? (
//                                 employee.languages_spoken.map((lang, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
//                                   >
//                                     <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
//                                     <span className="text-[11px] font-black text-slate-700 uppercase">
//                                       {lang}
//                                     </span>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <span className="text-xs text-slate-600 font-medium">
//                                   No language data
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Globe
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>

//                     {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
//                             <Cpu size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Assets & Skill
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Assets & Skills Data
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//                           {/* Skills Subsection */}

//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Layers size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Skills
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => setShowSkillModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.skills &&
//                               (Array.isArray(employee.skills)
//                                 ? employee.skills.length > 0
//                                 : String(employee.skills).trim() !== "") ? (
//                                 (() => {
//                                   const allSkills = Array.isArray(
//                                     employee.skills,
//                                   )
//                                     ? employee.skills
//                                     : String(employee.skills).split(",");
//                                   const hasOverflow = allSkills.length > 4;
//                                   const visibleSkills = isSkillsExpanded
//                                     ? allSkills
//                                     : allSkills.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleSkills.map((skill, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof skill === "string"
//                                             ? skill.trim()
//                                             : String(skill)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsSkillsExpanded(
//                                               !isSkillsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isSkillsExpanded
//                                             ? "Show Less"
//                                             : `+${allSkills.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Skill Added
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Assets Subsection */}

//                           <div className="space-y-4">
//                             {/* SECTION HEADER */}
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Monitor size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Assets
//                                 </span>
//                               </div>

//                               <button
//                                 onClick={() => setShowAssetModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             {/* CHIP CONTAINER */}
//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.assets &&
//                               (Array.isArray(employee.assets)
//                                 ? employee.assets.length > 0
//                                 : String(employee.assets).trim() !== "") ? (
//                                 (() => {
//                                   // Normalize data into a unified array
//                                   const allAssets = Array.isArray(
//                                     employee.assets,
//                                   )
//                                     ? employee.assets
//                                     : String(employee.assets).split(",");
//                                   const hasOverflow = allAssets.length > 4;
//                                   const visibleAssets = isAssetsExpanded
//                                     ? allAssets
//                                     : allAssets.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleAssets.map((asset, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof asset === "string"
//                                             ? asset.trim()
//                                             : String(asset)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ ASSET EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsAssetsExpanded(
//                                               !isAssetsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isAssetsExpanded
//                                             ? "Show Less"
//                                             : `+${allAssets.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Assets Allocated
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Layers
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>
//                   </div>

//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">
//                     {/* SYSTEM WATERMARK: Large rotated background icon */}
//                     <History
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <History size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Candidate
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Previous Job History
//                           </p>
//                         </div>
//                       </div>

//                       {/* TENURE COUNTER */}
//                       <div className="flex items-center gap-3">
//                         <div className="flex flex-col items-end">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                             Total Experience
//                           </span>
//                           <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//                             {calculateTotalExperience(employee?.experiences)}
//                           </span>
//                         </div>

//                         <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//                         <div className="flex items-center gap-2 px-3 py-1  rounded-full">
//                           {/* EDIT BUTTON */}

// <button
//   type="button"
//   onClick={() => {
//     setExperienceList([]); // Force immediate purge
//     setShowExperienceModal(true); // Deploy Modal
//   }}
//   className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 border border-slate-200 hover:border-blue-500 text-white hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
// >

//   Add Experience
// </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     <div className="relative z-10">

//                       {employee?.experiences && employee.experiences.length > 0 ? (
//   <div className="divide-y divide-slate-100">
//     {employee.experiences.map((exp, i) => {

//       const industryName = industries.find(ind => ind.id === exp.industry_id)?.name || "General Industry";
//       const departmentName = departments.find(dep => dep.id === exp.department_id)?.name || "Operations";

//       // 🛠️ INDIVIDUAL DURATION CALCULATION PROTOCOL
//       const calculateSingleDuration = (start, end) => {
//         if (!start) return "—";
//         const startDate = new Date(start);
//         const endDate = end ? new Date(end) : new Date();

//         let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
//         months = Math.max(0, months);

//         const years = Math.floor(months / 12);
//         const remainingMonths = months % 12;

//         const yrText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : "";
//         const moText = remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : "";

//         return [yrText, moText].filter(Boolean).join(" ") || "1 mo";
//       };

//       return (
//         <div key={i} className="group hover:bg-slate-50/40 transition-colors duration-300">
//           <div className="flex flex-col md:flex-row p-8 gap-8">
//             {/* TIME IDENTIFIER */}
//             <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//               <span className="text-xl font-black text-slate-900 tracking-tighter">
//                 {exp?.start_date ? new Date(exp.start_date).getFullYear() : "----"}
//               </span>
//               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                 {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short" }) : "---"} DEPLOYMENT
//               </span>
//             </div>

//             {/* CONTENT BODY */}

//             {/* CONTENT BODY */}
// <div className="flex-1 space-y-4">
//   {/* TOP ROW: IDENTITY + TENURE / ACTIONS */}
//   {/* <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//     <div className="space-y-1">
//       <div className="flex items-center gap-2">
//         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//           {exp?.company_name || "-"}
//         </h4>
//         <span className="h-1 w-1 rounded-full bg-slate-300" />
//         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//           {exp?.location || "-"}
//         </span>
//       </div>
//       <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//         {exp?.job_title || "-"}
//       </p>
//     </div>

//     <div className="flex flex-col sm:items-end gap-2">

//       <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
//         <Calendar size={12} className="text-blue-500" />
//         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
//           {calculateSingleDuration(exp.start_date, exp.end_date)}
//         </span>
//       </div>

//       {exp?.experience_letter_path ? (
//         <a
//           href={exp.experience_letter_path}
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//         >
//           <FileText size={12} className="text-slate-400 group-hover/artifact:text-blue-500" />
//           Experiance Letter
//           <ExternalLink size={10} className="opacity-40" />
//         </a>
//       ) : (
//         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
//           <Shield size={12} className="text-slate-300" />
//           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">No Experiace Latter</span>
//         </div>
//       )}

//       <button
//   onClick={() => {
//     setEditingExp({
//       ...exp,
//       artifact_type: exp.experience_letter_path ? "link" : "file",
//       exp_letter_link: exp.experience_letter_path || ""
//     });
//     setShowEditExpModal(true);
//   }}
//   className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
// >
//   <Edit3 size={16} />
// </button>
//     </div>
//   </div> */}

//   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
//   {/* LEFT SIDE: PRIMARY IDENTITY */}
//   <div className="space-y-1.5 flex-1">
//     <div className="flex items-center gap-2">
//       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//         {exp?.company_name || "-"}
//       </h4>
//       <span className="h-1 w-1 rounded-full bg-slate-300" />
//       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//         {exp?.location || "-"}
//       </span>
//     </div>
//     <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">
//       {exp?.job_title || "-"}
//     </p>
//   </div>

//   {/* RIGHT SIDE: STATUS NODES + EDIT ACTION */}
//   <div className="flex items-start gap-4">
//     {/* DATA NODES STACK */}
//     <div className="flex items-end gap-2">
//       {/* Tenure Branding Box */}
//       <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
//         <Calendar size={12} className="text-blue-500" />
//         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
//           {calculateSingleDuration(exp.start_date, exp.end_date)}
//         </span>
//       </div>

//       {/* Artifact Node */}
//       {exp?.experience_letter_path ? (
//         <a
//           href={exp.experience_letter_path}
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//         >
//           <FileText size={12} className="text-slate-400 group-hover/artifact:text-blue-500" />
//           Letter
//           <ExternalLink size={10} className="opacity-40" />
//         </a>
//       ) : (
//         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
//           <Shield size={12} className="text-slate-300" />
//           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">No Artifact</span>
//         </div>
//       )}
//     </div>

//     {/* EDIT ACTION NODE: Separated for clarity */}
//     <div className="h-full pt-0.5">
//       <button
//         onClick={() => {
//           setEditingExp({
//             ...exp,
//             artifact_type: exp.experience_letter_path ? "link" : "file",
//             exp_letter_link: exp.experience_letter_path || ""
//           });
//           setShowEditExpModal(true);
//         }}
//         className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 hover:shadow-inner rounded-xl transition-all border border-slate-100"
//         title="Modify Entry"
//       >
//         <Edit3 size={16} strokeWidth={2.5} />
//       </button>
//     </div>
//   </div>
// </div>

//   {/* BOTTOM ROW: FINANCIALS & TIMELINE */}
//   {/* <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2 border-t border-slate-50">
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous CTC</span>
//       <div className="flex items-center gap-1.5">
//         <span className="text-blue-600 font-black text-[10px]">₹</span>
//         <span className="text-[11px] font-bold text-slate-700">
//           {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Logged"}
//         </span>
//       </div>
//     </div>

//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline Registry</span>
//       <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
//          {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "---"}
//          {" — "}
//          {exp?.end_date ? new Date(exp.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present"}
//       </span>
//     </div>
//   </div> */}
//   {/* BOTTOM ROW: FINANCIALS, TIMELINE & CLASSIFICATION */}
// <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4 border-t border-slate-50">

//   {/* INDUSTRY NODE */}
//  <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Industry</span>
//             <span className="text-[11px] font-bold text-slate-700 uppercase">{industryName}</span>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Department</span>
//             <span className="text-[11px] font-bold text-slate-700 uppercase">{departmentName}</span>
//           </div>

//   {/* CTC NODE */}
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous CTC</span>
//     <div className="flex items-center gap-1.5">
//       <span className="text-blue-600 font-black text-[10px]">₹</span>
//       <span className="text-[11px] font-bold text-slate-700">
//         {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Specified"}
//       </span>
//     </div>
//   </div>

//   {/* TIMELINE NODE */}
//   <div className="flex flex-col">
//     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline</span>
//     <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
//        {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "---"}
//        {" — "}
//        {exp?.end_date ? new Date(exp.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present"}
//     </span>
//   </div>
// </div>

//   {exp?.description && (
//     <div className="max-w-3xl pt-2">
//       <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
//         "{exp.description}"
//       </p>
//     </div>
//   )}
// </div>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// ) : (
//    <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <Database size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             Fresher Profile
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             No prior professional experience recorded
//                           </p>
//                         </div>
// )}
//                     </div>
//                   </div>

//                   {/* EDUCATION HISTORY: SYSTEM STREAM */}
//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
//                     {/* SYSTEM WATERMARK */}
//                     <Award
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <Award size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Academic History
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Education History
//                           </p>
//                         </div>
//                       </div>

//                       {/* EDIT REDIRECT */}
//                       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//                         <button
//                           type="button"
//                           onClick={() => navigate(`/editentry/${id}?step=3`)}
//                           className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//                         >
//                           <Edit3 size={12} strokeWidth={3} />
//                           Edit Nodes
//                         </button>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     <div className="relative z-10">
//                       {employee?.educations &&
//                       employee.educations.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.educations.map((edu, i) => (
//                             <div
//                               key={i}
//                               className="group/item hover:bg-slate-50/40 transition-colors duration-300"
//                             >
//                               <div className="flex flex-col md:flex-row p-8 gap-8">
//                                 {/* TIME IDENTIFIER */}
//                                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                     {edu?.end_year || "----"}
//                                   </span>

//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                     GRADUATION
//                                   </span>
//                                 </div>

//                                 {/* CONTENT BODY */}
//                                 <div className="flex-1 space-y-4">
//                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                           {edu?.institution_name ||
//                                             "Unidentified Institute"}
//                                         </h4>
//                                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                                       </div>

//                                       {/* Degree Name from education_master mapping */}
//                                       <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                                         {edu?.education_master?.name ||
//                                           "Specialization Undefined"}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                         Academic Period
//                                       </span>
//                                       <div className="flex items-center gap-2">
//                                         <Calendar
//                                           size={12}
//                                           className="text-slate-300"
//                                         />
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                           {edu?.start_year || "----"} —{" "}
//                                           {edu?.end_year || "----"}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         /* EMPTY STATE */
//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <GraduationCap size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             No Academic Records
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             Node synchronized but education array is empty
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Resume
//                       </h3>
//                     </div>
//                     {employee?.resume_path ? (
//                       <ModernDocCard
//                         title="Master Curriculum Vitae"
//                         url={employee.resume_path}
//                         type="resume"
//                         formatDocUrl={formatDocUrl}
//                       />
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                           Resume Missing
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Certificate
//                       </h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {employee?.certificates?.map((cert) => (
//                         <ModernDocCard
//                           key={cert.id}
//                           title={cert.name}
//                           url={cert.file_path}
//                           type="Certificate"
//                           formatDocUrl={formatDocUrl}
//                           icon={Award}
//                         />
//                       )) || (
//                         <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">
//                           No Certificates Found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* --- ENTERPRISE MODAL PORTAL --- */}

//       {showLanguageModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowLanguageModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white">
//                   <Languages size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Update Languages
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowLanguageModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-8">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
//                 Select nodes to sync with the candidate's communication stack.
//               </p>

//               {/* CHIP SELECTION GRID */}
//               <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                 {[...new Set([...DEFAULT_LANGS, ...selectedLangs])].map(
//                   (lang) => {
//                     const isSelected = selectedLangs.includes(lang);
//                     return (
//                       <button
//                         key={lang}
//                         type="button"
//                         onClick={() => {
//                           setSelectedLangs((prev) =>
//                             isSelected
//                               ? prev.filter((l) => l !== lang)
//                               : [...prev, lang],
//                           );
//                         }}
//                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
//                           isSelected
//                             ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
//                         }`}
//                       >
//                         {lang}
//                         {isSelected && (
//                           <CheckCircle size={12} strokeWidth={3} />
//                         )}
//                       </button>
//                     );
//                   },
//                 )}
//               </div>

//               <button
//                 disabled={updating}
//                 className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
//                 onClick={handleLanguageUpdate}
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <BadgeCheck size={16} />
//                 )}
//                 {updating ? "Synchronizing..." : "Update Linguistic Node"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: SKILL REGISTRY --- */}

//       {showSkillModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowSkillModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//             {/* HEADER NODE */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
//                   <Layers size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Skill
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowSkillModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-8">
//               {/* INPUT NODE: Manual Entry */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">
//                   Skill
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     value={newSkillInput}
//                     onChange={(e) => setNewSkillInput(e.target.value)}
//                     placeholder="Type and press Enter..."
//                     className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                     onKeyDown={(e) =>
//                       e.key === "Enter" &&
//                       (e.preventDefault(), addManualSkill())
//                     }
//                   />
//                   {/* <button type="button" onClick={addManualSkill} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Add</button> */}
//                 </div>
//               </div>

//               {/* ACTIVE NODES AREA (Everything in this list will be sent to API) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Selected Skills
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
//                     {selectedSkills.length} Selected
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-100 min-h-[80px]">
//                   {selectedSkills.length > 0 ? (
//                     selectedSkills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black uppercase shadow-sm animate-in zoom-in-95"
//                       >
//                         {skill}
//                         <X
//                           size={12}
//                           className="cursor-pointer hover:text-red-500 transition-colors"
//                           onClick={() =>
//                             setSelectedSkills(
//                               selectedSkills.filter((_, idx) => idx !== i),
//                             )
//                           }
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-[9px] font-black text-slate-300 uppercase m-auto tracking-widest">
//                       No Skills
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* MASTER REGISTRY: Quick Toggle Nodes */}
//               <div className="space-y-3 pt-4 border-t border-slate-100">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                   Skill History
//                 </label>
//                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
//                   {masterSkills.map((item) => {
//                     const name = item.name || item;
//                     const isSelected = selectedSkills.includes(name);
//                     return (
//                       <button
//                         key={name}
//                         type="button"
//                         onClick={() =>
//                           setSelectedSkills((prev) =>
//                             isSelected
//                               ? prev.filter((s) => s !== name)
//                               : [...prev, name],
//                           )
//                         }
//                         className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
//                           isSelected
//                             ? "bg-blue-500 border-blue-500 text-white shadow-md"
//                             : "bg-slate-50 border-slate-500 text-slate-800 hover:border-blue-200"
//                         }`}
//                       >
//                         {name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* SUBMIT BUTTON */}
//               <button
//                 disabled={updating}
//                 onClick={syncSkills}
//                 className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <ShieldCheck size={16} />
//                 )}
//                 Save Skills
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: HARDWARE ASSETS --- */}

//       {showAssetModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* Backdrop with Glassmorphism */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => !updating && setShowAssetModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* 1. BRANDED HEADER */}
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
//               <div className="flex items-center gap-5">
//                 {/* LOGO NODE */}
//                 <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
//                   <Monitor size={24} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
//                     Asset
//                   </h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                       Update the assets
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAssetModal(false)}
//                 className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
//               >
//                 <X size={20} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* 2. INPUT NODE */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-1">
//                   Add Assets
//                 </label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1 group">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                       <Plus size={16} strokeWidth={3} />
//                     </div>
//                     <input
//                       value={newAssetInput}
//                       onChange={(e) => setNewAssetInput(e.target.value)}
//                       placeholder="e.g. MacBook Pro M3"
//                       className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           if (newAssetInput.trim()) {
//                             setSelectedAssets([
//                               ...selectedAssets,
//                               newAssetInput.trim(),
//                             ]);
//                             setNewAssetInput("");
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* 3. ENHANCED CHIP CONTAINER (Matched to Skills Style) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
//                     Selected Assets
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//                     {selectedAssets.length} Allocated
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[120px] items-start content-start">
//                   {selectedAssets.length > 0 ? (
//                     selectedAssets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="group/chip flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm hover:border-blue-400 hover:shadow-md transition-all animate-in zoom-in-95"
//                       >
//                         <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
//                         {asset}
//                         <button
//                           onClick={() =>
//                             setSelectedAssets(
//                               selectedAssets.filter((_, idx) => idx !== i),
//                             )
//                           }
//                           className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
//                         >
//                           <X size={14} strokeWidth={3} />
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="m-auto flex flex-col items-center gap-2 opacity-30">
//                       <Database size={24} strokeWidth={1.5} />
//                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                         Registry Vacant
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* 4. SUBMIT ACTION */}
//               <button
//                 disabled={updating}
//                 onClick={syncAssets}
//                 className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Commit Allocation
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

// {showExperienceModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowExperienceModal(false)} />

//     <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//       {/* HEADER */}
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Add Experience</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add New Experiance</p>
//           </div>
//         </div>
//         <button onClick={() => setShowExperienceModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//         {experienceList.map((exp, index) => (
//           <div key={index} className="group p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative hover:border-blue-300 transition-all space-y-6">
//             <button
//               onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
//               className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
//             >
//               <X size={16} strokeWidth={3} />
//             </button>

//             {/* GRID 1: IDENTITY */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Google" value={exp.company_name} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].company_name = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
//                 <select
//                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                   value={exp.industry_id}
//                   onChange={(e) => {
//                     const newList = [...experienceList]; newList[index].industry_id = e.target.value; setExperienceList(newList);
//                   }}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map(ind => (
//                     <option key={ind.id} value={ind.id}>{ind.name}</option>
//                   ))}
//                 </select>
//               </div>

//             </div>

//             {/* GRID 2: INDUSTRY & DEPARTMENT SELECTION */}
//             <div className="grid grid-cols-2 gap-6">

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//                 <select
//                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                   value={exp.department_id}
//                   onChange={(e) => {
//                     const newList = [...experienceList]; newList[index].department_id = e.target.value; setExperienceList(newList);
//                   }}
//                 >
//                   <option value="">Select Department</option>
//                   {departments.map(dep => (
//                     <option key={dep.id} value={dep.id}>{dep.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Senior Dev" value={exp.job_title} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].job_title = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             {/* GRID 3: TIMELINE & PAYROLL */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.start_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].start_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.end_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].end_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTC (LPA)</label>
//                 <input type="number" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm" placeholder="e.g. 1200000" value={exp.previous_ctc} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].previous_ctc = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             {/* ARTIFACT SWITCHER PROTOCOL */}
//             <div className="space-y-4 pt-4 border-t border-slate-200/60">
//               <div className="flex items-center justify-between">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Validation Artifact</label>
//                 <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "file"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
//                   >Upload PDF</button>
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "link"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
//                   >External Link</button>
//                 </div>
//               </div>

//               <div className="animate-in slide-in-from-top-2 duration-300">
//                 {exp.artifact_type === "file" ? (
//                   <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.png" onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_file = e.target.files[0]; setExperienceList(newList);
//                     }} />
//                     <Download size={20} className="text-slate-300 mb-1" />
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       {exp.exp_letter_file ? exp.exp_letter_file.name : "Select Binary File"}
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" placeholder="https://drive.google.com/..." value={exp.exp_letter_link} onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_link = e.target.value; setExperienceList(newList);
//                     }} />
//                     <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={addExperienceNode}
//           className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[11px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-slate-50/50"
//         >
//           <Plus size={16} strokeWidth={3} /> Add New Record
//         </button>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">

// <button
//   disabled={
//     updating ||
//     experienceList.length === 0 ||
//     experienceList.some(exp => !exp.company_name || !exp.job_title || !exp.start_date || !exp.end_date)
//   }
//   onClick={handleExperienceSync}
//   className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
// >
//   {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//   Add Experiance
// </button>
//       </div>
//     </div>
//   </div>
// )}

// {/*
// {showEditExpModal && editingExp && (
//   <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !updating && setShowEditExpModal(false)} />

//     <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
//       <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-100"><Edit3 size={20} /></div>
//           <div>
//             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Edit Employment Node</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update existing registry data</p>
//           </div>
//         </div>
//         <button onClick={() => setShowEditExpModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <form onSubmit={handleUpdateExperience} className="p-10 overflow-y-auto custom-scrollbar space-y-6">
//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingExp.company_name} onChange={(e) => setEditingExp({...editingExp, company_name: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
//             <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all" value={editingExp.job_title} onChange={(e) => setEditingExp({...editingExp, job_title: e.target.value})} />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
//             <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={editingExp.industry_id} onChange={(e) => setEditingExp({...editingExp, industry_id: e.target.value})}>
//                <option value="">Select Industry</option>
//                {industries.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
//             </select>
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//             <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none" value={editingExp.department_id} onChange={(e) => setEditingExp({...editingExp, department_id: e.target.value})}>
//                <option value="">Select Department</option>
//                {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
//             <input type="date" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none" value={editingExp.start_date} onChange={(e) => setEditingExp({...editingExp, start_date: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
//             <input type="date" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none" value={editingExp.end_date} onChange={(e) => setEditingExp({...editingExp, end_date: e.target.value})} />
//           </div>
//         </div>

//         <div className="pt-4 border-t border-slate-100">
//            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">Documentation Update</label>
//            <div className="flex gap-4 mb-4">
//               <button type="button" onClick={() => setEditingExp({...editingExp, artifact_type: 'file'})} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg border-2 transition-all ${editingExp.artifact_type === 'file' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>New Upload</button>
//               <button type="button" onClick={() => setEditingExp({...editingExp, artifact_type: 'link'})} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg border-2 transition-all ${editingExp.artifact_type === 'link' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>External Link</button>
//            </div>

//            {editingExp.artifact_type === 'file' ? (
//              <input type="file" className="w-full text-xs" onChange={(e) => setEditingExp({...editingExp, exp_letter_file: e.target.files[0]})} />
//            ) : (
//              <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:border-blue-600" placeholder="Paste URL here..." value={editingExp.exp_letter_link} onChange={(e) => setEditingExp({...editingExp, exp_letter_link: e.target.value})} />
//            )}
//         </div>

//         <button disabled={updating} type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95">
//           {updating ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
//           Update Registry Node
//         </button>
//       </form>
//     </div>
//   </div>
// )} */}

// {showEditExpModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowEditExpModal(false)} />

//     <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//       {/* HEADER - Reused Design */}
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Experience</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modify Professional Registry Node</p>
//           </div>
//         </div>
//         <button onClick={() => setShowEditExpModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//           <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative space-y-6">

//             {/* GRID 1: IDENTITY */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" value={editingExp.company_name} onChange={(e) => setEditingExp({...editingExp, company_name: e.target.value})} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
//                 <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none" value={editingExp.industry_id} onChange={(e) => setEditingExp({...editingExp, industry_id: e.target.value})}>
//                   <option value="">Select Industry</option>
//                   {industries.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* GRID 2: DEPT & POSITION */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//                 <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none" value={editingExp.department_id} onChange={(e) => setEditingExp({...editingExp, department_id: e.target.value})}>
//                   <option value="">Select Department</option>
//                   {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" value={editingExp.job_title} onChange={(e) => setEditingExp({...editingExp, job_title: e.target.value})} />
//               </div>
//             </div>

//             {/* GRID 3: DATES & CTC */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={editingExp.start_date} onChange={(e) => setEditingExp({...editingExp, start_date: e.target.value})} />
//               </div>
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={editingExp.end_date} onChange={(e) => setEditingExp({...editingExp, end_date: e.target.value})} />
//               </div>
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTC (LPA)</label>
//                 <input type="number" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm" value={editingExp.previous_ctc} onChange={(e) => setEditingExp({...editingExp, previous_ctc: e.target.value})} />
//               </div>
//             </div>

//             {/* ARTIFACT SWITCHER */}
//             <div className="space-y-4 pt-4 border-t border-slate-200/60">
//               <div className="flex items-center justify-between">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Experiance certificate</label>
//                 <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                   <button onClick={() => setEditingExp({...editingExp, artifact_type: "file"})} className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Upload PDF</button>
//                   <button onClick={() => setEditingExp({...editingExp, artifact_type: "link"})} className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${editingExp.artifact_type === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>External Link</button>
//                 </div>
//               </div>

//               <div className="animate-in slide-in-from-top-2">
//                 {editingExp.artifact_type === "file" ? (
//                   <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setEditingExp({...editingExp, exp_letter_file: e.target.files[0]})} />
//                     <Download size={20} className="text-slate-300 mb-1" />
//                     <span className="text-[9px] font-black text-slate-400 uppercase">{editingExp.exp_letter_file ? editingExp.exp_letter_file.name : "Select New File"}</span>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" value={editingExp.exp_letter_link} onChange={(e) => setEditingExp({...editingExp, exp_letter_link: e.target.value})} />
//                     <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">
//         <button disabled={updating} onClick={handleUpdateExperience} className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//           Update Experiance
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
//       {React.cloneElement(icon, { size: 14 })}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-bold text-slate-700 break-all">
//         {value || "Not Specified"}
//       </span>
//     </div>
//   </div>
// );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
//   <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//       <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && (
//           <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />
//         )}
//       </div>
//       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
//         {title}
//       </h3>
//     </div>
//     <div className="relative z-10 p-6 space-y-4">{children}</div>
//     <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
//       {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}
//   >
//     <div className="flex items-center gap-2 text-slate-400">
//       {icon}
//       <span className="text-[10px] font-black uppercase tracking-widest">
//         {label}
//       </span>
//     </div>
//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {value ? (
//           String(value)
//             .split(",")
//             .map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter"
//               >
//                 {skill.trim()}
//               </span>
//             ))
//         ) : (
//           <span className="text-[10px] text-slate-300 uppercase">Void</span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-black text-slate-800 uppercase">
//         {value || "—"}
//       </span>
//     )}
//   </div>
// );

// const ModernDocCard = ({
//   title,
//   url,
//   type,
//   formatDocUrl,
//   icon: CardIcon = FileText,
// }) => (
//   <a
//     href={formatDocUrl(url)}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm"
//   >
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
//           {title}
//         </p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
//           {type}
//         </p>
//       </div>
//     </div>
//     <ExternalLink
//       size={16}
//       className="text-slate-200 group-hover:text-blue-600 transition-colors"
//     />
//   </a>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-400 hover:text-slate-600"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="relative w-16 h-16">
//       <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
//       <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//     </div>
//     <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
//       Loading ...
//     </p>
//   </div>
// );

// const StripDetail = ({ icon, label, value }) => (
//   <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
//     {/* ICON BRANDING BOX: Glassmorphism effect */}
//     <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
//       <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
//         {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
//       </div>
//     </div>

//     {/* DATA STACK */}
//     <div className="flex flex-col min-w-0">
//       <div className="flex items-center gap-1.5 mb-0.5">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
//           {label}
//         </span>
//         {/* Verification Dot: Hidden by default, shown on hover */}
//         <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
//           {value || "—"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
//******************************************************************************************************* */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   CheckCircle,
//   Loader2,
//   MapPin,
//   History,
//   User,
//   Plus,
//   Briefcase,
//   X,
//   GraduationCap,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
//   Fingerprint,
//   Cpu,
//   Layers,
//   Award,
//   BadgeCheck,
//   Languages,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [selectedLangs, setSelectedLangs] = useState([]);
//   const [updating, setUpdating] = useState(false);
//   const [showSkillAssetModal, setShowSkillAssetModal] = useState(false);
//   const [masterSkills, setMasterSkills] = useState([]); // All possible skills
//   const [selectedSkills, setSelectedSkills] = useState([]); // Candidate's skills
//   const [selectedAssets, setSelectedAssets] = useState([]); // Candidate's assets
//   const [newAssetInput, setNewAssetInput] = useState("");
//   const [showSkillModal, setShowSkillModal] = useState(false);
//   const [showAssetModal, setShowAssetModal] = useState(false);
//   const [newSkillInput, setNewSkillInput] = useState("");
//   const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
//   const [isAssetsExpanded, setIsAssetsExpanded] = useState(false);
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
// const [experienceList, setExperienceList] = useState([]);
// const [isSubmittingExp, setIsSubmittingExp] = useState(false);
// const [newExp, setNewExp] = useState({
//   company_name: "",
//   job_title: "",
//   start_date: "",
//   end_date: "",
//   previous_ctc: "",
//   location: "",
//   description: "",
//   industry_id: "", // Node: integer
//   department_id: "", // Node: integer
//   exp_letter_file: null, // Node: binary
//   exp_letter_link: "" // Node: string/url
// });
// const [industries, setIndustries] = useState([]);
// const [departments, setDepartments] = useState([]);

// const addExperienceNode = () => {
//   setExperienceList([
//     ...experienceList,
//     {
//       company_name: "",
//       job_title: "",
//       start_date: "",
//       end_date: "",
//       location: "",
//       previous_ctc: "",
//       industry_id: "",
//       department_id: "",
//       description: "",
//       // Artifact Logic
//       artifact_type: "file", // internal UI helper: 'file' or 'link'
//       exp_letter_file: null,
//       exp_letter_link: ""
//     }
//   ]);
// };

//   const DEFAULT_LANGS = [
//     "English",
//     "Hindi",
//     "Marathi",
//     "Gujarati",
//     "Tamil",
//     "Telugu",
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   // Effect to sync modal state with employee data when modal opens
//   useEffect(() => {
//     if (showLanguageModal && employee?.languages_spoken) {
//       // If API returns string, split it; if array, use it directly
//       const current = Array.isArray(employee.languages_spoken)
//         ? employee.languages_spoken
//         : employee.languages_spoken.split(",").map((l) => l.trim());
//       setSelectedLangs(current);
//     }
//   }, [showLanguageModal, employee]);

//   // Initialize Modal Data
//   useEffect(() => {
//     if (showSkillAssetModal) {
//       fetchMasterSkills();
//       // Normalize Skills (handle Array or String)
//       const currentSkills = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(currentSkills);

//       // Normalize Assets
//       const currentAssets = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(currentAssets);
//     }
//   }, [showSkillAssetModal, employee]);

// // Fetch Master Registries for Industries and Departments
// useEffect(() => {
//   const fetchMasters = async () => {
//     try {
//       const [indRes, depRes] = await Promise.all([
//         fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100"),
//         fetch("https://apihrr.goelectronix.co.in/departments")
//       ]);
//       const indData = await indRes.json();
//       const depData = await depRes.json();
//       setIndustries(indData || []);
//       setDepartments(depRes.ok ? depData : []); // Safety check for department response
//     } catch (err) {
//       console.error("Registry Sync Failure", err);
//     }
//   };
//   fetchMasters();
// }, []);

// // Protocol: Force a clean, empty state with exactly one form node
// // useEffect(() => {
// //   if (showExperienceModal) {
// //     setExperienceList([
// //       {
// //         company_name: "",
// //         job_title: "",
// //         start_date: "",
// //         end_date: "",
// //         location: "",
// //         previous_ctc: "",
// //         industry_id: "",
// //         department_id: "",
// //         description: "",
// //         artifact_type: "file",
// //         exp_letter_file: null,
// //         exp_letter_link: ""
// //       }
// //     ]);
// //   } else {
// //     // Optional: Clear list when modal closes to save memory
// //     setExperienceList([]);
// //   }
// // }, [showExperienceModal]);

// // Protocol: Force a clean, empty state whenever the modal is activated
// useEffect(() => {
//   if (showExperienceModal) {
//     // 🛠️ ALWAYS reset the list to exactly one blank node
//     setExperienceList([
//       {
//         company_name: "",
//         job_title: "",
//         start_date: "",
//         end_date: "",
//         location: "",
//         previous_ctc: "",
//         industry_id: "",
//         department_id: "",
//         description: "",
//         artifact_type: "file",
//         exp_letter_file: null,
//         exp_letter_link: ""
//       }
//     ]);
//   } else {
//     // Purge state when modal closes to prevent "ghost data" next time
//     setExperienceList([]);
//   }
// }, [showExperienceModal]); // Removed 'employee' from dependencies

//   // PATCH Transmission
//   const handleSyncRegistry = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Executing Node Synchronization...");
//     try {
//       const formData = new FormData();
//       formData.append("skills", selectedSkills.join(","));
//       formData.append("assets", selectedAssets.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Audit Registry Updated", { id: syncToast });
//         setEmployee({
//           ...employee,
//           skills: selectedSkills,
//           assets: selectedAssets,
//         });
//         setShowSkillAssetModal(false);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Handshake Refused", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Registry Logic
//   const fetchMasterSkills = async () => {
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setMasterSkills(data || []);
//     } catch (err) {
//       console.error("Master Sync Failure");
//     }
//   };

//   // Initialize Skill Data when Skill Modal opens
//   useEffect(() => {
//     if (showSkillModal) {
//       fetchMasterSkills();
//       const current = Array.isArray(employee?.skills)
//         ? employee.skills
//         : employee?.skills
//             ?.split(",")
//             .map((s) => s.trim())
//             .filter(Boolean) || [];
//       setSelectedSkills(current);
//     }
//   }, [showSkillModal, employee]);

//   // Initialize Asset Data when Asset Modal opens
//   useEffect(() => {
//     if (showAssetModal) {
//       const current = Array.isArray(employee?.assets)
//         ? employee.assets
//         : employee?.assets
//             ?.split(",")
//             .map((a) => a.trim())
//             .filter(Boolean) || [];
//       setSelectedAssets(current);
//     }
//   }, [showAssetModal, employee]);

// //   useEffect(() => {
// //   if (showExperienceModal && employee?.experiences) {
// //     setExperienceList(employee.experiences);
// //   }
// // }, [showExperienceModal, employee]);

// // Initialize Experience Data when modal opens
// useEffect(() => {
//   if (showExperienceModal) {
//     // Check if the candidate already has experiences in the registry
//     if (employee?.experiences && employee.experiences.length > 0) {
//       // Map existing data and ensure UI helpers like artifact_type are set
//       const formattedExisting = employee.experiences.map(exp => ({
//         ...exp,
//         // Helper to decide which input to show by default
//         artifact_type: exp.experience_letter_path ? "file" : "link",
//         exp_letter_file: null,
//         exp_letter_link: exp.experience_letter_path || ""
//       }));
//       setExperienceList(formattedExisting);
//     } else {
//       // 🛠️ DEFAULT PROTOCOL: If registry is vacant, deploy one blank node automatically
//       addExperienceNode();
//     }
//   }
// }, [showExperienceModal, employee]);

// // Sync Function for Job History
// // const handleExperienceSync = async () => {
// //   setUpdating(true);
// //   const toastId = toast.loading("Updating Employment Registry...");
// //   try {
// //     const fd = new FormData();
// //     // We send the JSON array of experiences
// //     fd.append("experiences", JSON.stringify(experienceList));

// //     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
// //       method: "POST",
// //       body: fd,
// //     });

// //     if (res.ok) {
// //       toast.success("Job History Synchronized", { id: toastId });
// //       // Update local state with new data
// //       setEmployee({ ...employee, experiences: experienceList });
// //       setExperienceList([]);
// //       setShowExperienceModal(false);
// //     } else throw new Error();
// //   } catch (err) {
// //     toast.error("Registry Sync Failed", { id: toastId });
// //   } finally {
// //     setUpdating(false);
// //   }
// // };

// // const handleExperienceSync = async () => {
// //   setUpdating(true);
// //   const toastId = toast.loading("Deploying Employment Nodes...");

// //   try {
// //     // 🛠️ Loop through the list to POST each node individually as required by the API
// //     const uploadPromises = experienceList.map(async (exp) => {
// //       // Create a fresh FormData object for this specific record
// //       const fd = new FormData();

// //       // Mandatory Nodes (Required by your error log)
// //       fd.append("company_name", exp.company_name || "");
// //       fd.append("job_title", exp.job_title || "");
// //       fd.append("start_date", exp.start_date || "");
// //       fd.append("end_date", exp.end_date || "");

// //       // Optional Master & Financial Nodes
// //       if (exp.industry_id) fd.append("industry_id", exp.industry_id);
// //       if (exp.department_id) fd.append("department_id", exp.department_id);
// //       if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
// //       if (exp.location) fd.append("location", exp.location);
// //       if (exp.description) fd.append("description", exp.description);

// //       // Artifact Logic (Only send the chosen type)
// //       if (exp.artifact_type === 'file' && exp.exp_letter_file) {
// //         fd.append("exp_letter_file", exp.exp_letter_file);
// //       } else if (exp.artifact_type === 'link' && exp.exp_letter_link) {
// //         fd.append("exp_letter_link", exp.exp_letter_link);
// //       }

// //       const response = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
// //         method: "POST",
// //         body: fd,
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         console.error("Node Rejection Data:", errorData);
// //         throw new Error(`Node for ${exp.company_name} failed`);
// //       }

// //       return response.json();
// //     });

// //     // Execute all transmissions
// //     await Promise.all(uploadPromises);

// //     toast.success("Registry Successfully Synchronized", { id: toastId });

// //     // 🛠️ RE-FETCH: Get fresh data from server to reflect new IDs and Paths in UI
// //     const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
// //     const freshData = await freshRes.json();
// //     setEmployee(freshData);

// //     // CLEANUP
// //     setExperienceList([]);
// //     setShowExperienceModal(false);

// //   } catch (err) {
// //     toast.error("Handshake Failed: Ensure all mandatory fields are filled", { id: toastId });
// //     console.error("Registry Sync Error:", err);
// //   } finally {
// //     setUpdating(false);
// //   }
// // };

// // const handleExperienceSync = async () => {
// //   setUpdating(true);
// //   const toastId = toast.loading("Deploying Employment Nodes...");

// //   try {
// //     // API expects individual record POSTs
// //     const uploadPromises = experienceList.map(async (exp) => {
// //       const fd = new FormData();

// //       // Mandatory Fields
// //       fd.append("company_name", exp.company_name || "");
// //       fd.append("job_title", exp.job_title || "");
// //       fd.append("start_date", exp.start_date || "");
// //       fd.append("end_date", exp.end_date || "");

// //       // Optional classification & metadata
// //       if (exp.industry_id) fd.append("industry_id", parseInt(exp.industry_id));
// //       if (exp.department_id) fd.append("department_id", parseInt(exp.department_id));
// //       if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
// //       if (exp.location) fd.append("location", exp.location);
// //       if (exp.description) fd.append("description", exp.description);

// //       // Documentation Node (File or Link)
// //       if (exp.artifact_type === 'file' && exp.exp_letter_file) {
// //         fd.append("exp_letter_file", exp.exp_letter_file);
// //       } else if (exp.artifact_type === 'link' && exp.exp_letter_link) {
// //         fd.append("exp_letter_link", exp.exp_letter_link);
// //       }

// //       const response = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
// //         method: "POST",
// //         body: fd,
// //       });

// //       if (!response.ok) throw new Error("Registry Rejection");
// //       return response.json();
// //     });

// //     await Promise.all(uploadPromises);

// //     // --- SUCCESS PROTOCOL ---
// //     toast.success("Nodes Integrated Successfully", { id: toastId });

// //     // 1. Refresh main profile to show new data with database IDs
// //     const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
// //     const freshData = await freshRes.json();
// //     setEmployee(freshData);

// //     // 2. 🛠️ DATA CLEANUP: Reset all local form states
// //     setExperienceList([]); // Clears the list
// //     setNewExp({ // Clears the template state
// //       company_name: "", job_title: "", start_date: "", end_date: "",
// //       previous_ctc: "", location: "", description: "", industry_id: "",
// //       department_id: "", exp_letter_file: null, exp_letter_link: ""
// //     });

// //     // 3. Close the modal
// //     setShowExperienceModal(false);

// //   } catch (err) {
// //     toast.error("Transmission Error: Check required fields", { id: toastId });
// //   } finally {
// //     setUpdating(false);
// //   }
// // };

// // const handleExperienceSync = async () => {
// //   setUpdating(true);
// //   const toastId = toast.loading("Deploying Employment Nodes...");

// //   try {
// //     // Loop through the fresh list to POST each record individually
// //     const uploadPromises = experienceList.map(async (exp) => {
// //       const fd = new FormData();

// //       fd.append("company_name", exp.company_name);
// //       fd.append("job_title", exp.job_title);
// //       fd.append("start_date", exp.start_date);
// //       fd.append("end_date", exp.end_date);

// //       if (exp.industry_id) fd.append("industry_id", parseInt(exp.industry_id));
// //       if (exp.department_id) fd.append("department_id", parseInt(exp.department_id));
// //       if (exp.previous_ctc) fd.append("previous_ctc", exp.previous_ctc);
// //       if (exp.location) fd.append("location", exp.location);
// //       if (exp.description) fd.append("description", exp.description);

// //       // Artifact Logic
// //       if (exp.artifact_type === 'file' && exp.exp_letter_file) {
// //         fd.append("exp_letter_file", exp.exp_letter_file);
// //       } else if (exp.artifact_type === 'link' && exp.exp_letter_link) {
// //         fd.append("exp_letter_link", exp.exp_letter_link);
// //       }

// //       const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
// //         method: "POST",
// //         body: fd,
// //       });
// //       if (!res.ok) throw new Error();
// //       return res.json();
// //     });

// //     await Promise.all(uploadPromises);

// //     toast.success("Registry Successfully Integrated", { id: toastId });

// //     // 🛠️ REFRESH PROFILE: Get fresh data from server to show on main page
// //     const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
// //     const freshData = await freshRes.json();
// //     setEmployee(freshData);

// //     // 🛠️ PURGE: Clear local list so next open triggers a fresh form again
// //     setExperienceList([]);
// //     setShowExperienceModal(false);

// //   } catch (err) {
// //     toast.error("Handshake Failed: Ensure all mandatory fields are filled", { id: toastId });
// //   } finally {
// //     setUpdating(false);
// //   }
// // };

// const handleExperienceSync = async () => {
//   setUpdating(true);
//   const toastId = toast.loading("Deploying Employment Nodes...");

//   try {
//     const uploadPromises = experienceList.map(async (exp) => {
//       const fd = new FormData();
//       fd.append("company_name", exp.company_name);
//       fd.append("job_title", exp.job_title);
//       fd.append("start_date", exp.start_date);
//       fd.append("end_date", exp.end_date);
//       if (exp.industry_id) fd.append("industry_id", parseInt(exp.industry_id));
//       if (exp.department_id) fd.append("department_id", parseInt(exp.department_id));

//       // ... (rest of your FormData appends)

//       const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
//         method: "POST",
//         body: fd,
//       });
//       return res; // Return the response for the Promise.all
//     });

//     // 🛠️ WAIT FOR ALL UPLOADS TO FINISH
//     const results = await Promise.all(uploadPromises);
//     const allSuccessful = results.every(res => res.ok);

//     // --- ADD YOUR BLOCK HERE ---
//     if (allSuccessful) {
//       toast.success("Nodes Integrated Successfully", { id: toastId });

//       // Re-fetch profile to show new data on the main page
//       const freshRes = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`);
//       const freshData = await freshRes.json();
//       setEmployee(freshData);

//       // 🛠️ DATA CLEANUP: Clear the modal state
//       setExperienceList([]);
//       setShowExperienceModal(false);
//     } else {
//       throw new Error("One or more nodes failed to sync");
//     }

//   } catch (err) {
//     toast.error("Handshake Failed: Ensure all mandatory fields are filled", { id: toastId });
//   } finally {
//     setUpdating(false);
//   }
// };

//   // Independent Sync Handlers
//   const syncSkills = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Skill Matrix...");
//     try {
//       const fd = new FormData();
//       fd.append("skills", selectedSkills.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Skill Node Updated", { id: toastId });
//         setEmployee({ ...employee, skills: selectedSkills });
//         setShowSkillModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const addManualSkill = () => {
//     const skill = newSkillInput.trim();
//     // Case-insensitive check to prevent duplicates
//     if (
//       skill &&
//       !selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
//     ) {
//       setSelectedSkills([...selectedSkills, skill]);
//       setNewSkillInput("");
//     }
//   };

//   const syncAssets = async () => {
//     setUpdating(true);
//     const toastId = toast.loading("Syncing Asset Registry...");
//     try {
//       const fd = new FormData();
//       fd.append("assets", selectedAssets.join(","));
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         { method: "PATCH", body: fd },
//       );
//       if (res.ok) {
//         toast.success("Asset Node Updated", { id: toastId });
//         setEmployee({ ...employee, assets: selectedAssets });
//         setShowAssetModal(false);
//       } else throw new Error();
//     } catch (err) {
//       toast.error("Sync Failed", { id: toastId });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(exp.start_date);
//       const end = exp.end_date ? new Date(exp.end_date) : new Date();
//       const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += Math.max(0, diff);
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
//   };

//   const handleLanguageUpdate = async () => {
//     setUpdating(true);
//     const syncToast = toast.loading("Synchronizing Linguistic Nodes...");

//     try {
//       const formData = new FormData();
//       // Convert array to comma-separated string
//       formData.append("languages_spoken", selectedLangs.join(","));

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         {
//           method: "PATCH",
//           body: formData,
//         },
//       );

//       if (res.ok) {
//         toast.success("Registry Updated Successfully", { id: syncToast });
//         // Refresh local employee state
//         setEmployee({ ...employee, languages_spoken: selectedLangs });
//         setShowLanguageModal(false);
//       } else {
//         throw new Error("Protocol Rejection");
//       }
//     } catch (err) {
//       toast.error("Handshake Failed", { id: syncToast });
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleAddExperienceNode = async (e) => {
//   e.preventDefault();
//   setIsSubmittingExp(true);
//   const loadingToast = toast.loading("Deploying Employment Node...");

//   try {
//     const formData = new FormData();

//     // REQUIRED PROTOCOL NODES
//     formData.append("company_name", newExp.company_name);
//     formData.append("job_title", newExp.job_title);
//     formData.append("start_date", newExp.start_date);
//     formData.append("end_date", newExp.end_date);

//     // CLASSIFICATION NODES (Integers)
//     if (newExp.industry_id) formData.append("industry_id", parseInt(newExp.industry_id));
//     if (newExp.department_id) formData.append("department_id", parseInt(newExp.department_id));

//     // FINANCIAL & GEO NODES
//     if (newExp.previous_ctc) formData.append("previous_ctc", newExp.previous_ctc);
//     formData.append("location", newExp.location);
//     formData.append("description", newExp.description);

//     // ARTIFACT NODES (Binary & Link)
//     if (newExp.exp_letter_file) formData.append("exp_letter_file", newExp.exp_letter_file);
//     if (newExp.exp_letter_link) formData.append("exp_letter_link", newExp.exp_letter_link);

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}/experiences`, {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       toast.success("Node Integrated Successfully", { id: loadingToast });
//       // Refresh local profile logic here...
//       setShowExperienceModal(false);
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     toast.error("Handshake Failed", { id: loadingToast });
//   } finally {
//     setIsSubmittingExp(false);
//   }
// };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900 font-bold tracking-tight">
//                 {employee?.full_name}
//               </span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN */}

//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
//               {/* Decorative Background Icon */}
//               <Fingerprint
//                 className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none"
//                 size={140}
//               />

//               <div className="flex flex-col items-center text-center relative z-10">
//                 <div className="relative group mb-6">
//                   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//                   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//                       {employee?.profile_image ? (
//                         <img
//                           src={employee.profile_image}
//                           alt={employee?.full_name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
//                           <User
//                             size={42}
//                             className="text-white mb-1"
//                             strokeWidth={1.5}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//                       <div className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//                   {employee?.full_name || "Unknown"}
//                 </h1>
//               </div>

//               {/* DATA STACK: Left Aligned Personal Info */}
//               <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
//                 <SidebarInfo
//                   icon={<Mail />}
//                   label=" Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone />}
//                   label="Primary Contact"
//                   value={employee?.phone}
//                 />

//                 {/* ADDED DOB & GENDER HERE */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <SidebarInfo
//                     icon={<Calendar />}
//                     label="Birth date"
//                     value={employee?.dob}
//                   />
//                   <SidebarInfo
//                     icon={<User />}
//                     label="Gender"
//                     // value={employee?.gender}
//                     value={
//                       employee?.gender
//                         ? employee.gender.charAt(0).toUpperCase() +
//                           employee.gender.slice(1)
//                         : ""
//                     }
//                   />
//                 </div>
//                 <SidebarInfo
//                   icon={<MapPin />}
//                   label="Location"
//                   value={
//                     [employee?.city, employee?.state, employee?.pincode]
//                       .filter(
//                         (val) =>
//                           val &&
//                           val !== "null" &&
//                           val !== "Not Specified" &&
//                           val !== "",
//                       ) // Removes null, "null" string, empty strings, and duplicates
//                       .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
//                   }
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="Candidate Overview"
//                 icon={<Activity size={18} />}
//               />
//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Document"
//                 icon={<ShieldCheck size={18} />}
//               />
//             </div>

//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
//                     {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       {/* Decorative Security Pattern Header */}
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
//                             <Languages size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Language
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Spoken
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 flex items-center">
//                           {/* 🛠️ ACTION NODE: ADD/EDIT BUTTON */}
//                           <div className="absolute top-4 right-6">
//                             <button
//                               onClick={() => setShowLanguageModal(true)}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-95 group/btn"
//                             >
//                               <Plus
//                                 size={12}
//                                 strokeWidth={3}
//                                 className="group-hover/btn:rotate-90 transition-transform"
//                               />
//                               Edit Languages
//                             </button>
//                           </div>
//                           <div className="space-y-3 w-full">
//                             <div className="flex items-center gap-2">
//                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                 Languages
//                               </span>
//                               <div className="h-[1px] flex-1 bg-slate-100" />
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                               {employee?.languages_spoken?.length > 0 ? (
//                                 employee.languages_spoken.map((lang, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
//                                   >
//                                     <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
//                                     <span className="text-[11px] font-black text-slate-700 uppercase">
//                                       {lang}
//                                     </span>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <span className="text-xs text-slate-600 font-medium">
//                                   No language data
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Globe
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>

//                     {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
//                     <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//                       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

//                       <div className="flex flex-col md:flex-row items-stretch">
//                         {/* Branding Box (Left) */}
//                         <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//                           <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
//                             <Cpu size={24} strokeWidth={1.5} />
//                           </div>
//                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">
//                             Assets & Skill
//                           </h3>
//                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">
//                             Assets & Skills Data
//                           </p>
//                         </div>

//                         {/* Content Area */}
//                         <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//                           {/* Skills Subsection */}

//                           <div className="space-y-4">
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Layers size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Skills
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => setShowSkillModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.skills &&
//                               (Array.isArray(employee.skills)
//                                 ? employee.skills.length > 0
//                                 : String(employee.skills).trim() !== "") ? (
//                                 (() => {
//                                   const allSkills = Array.isArray(
//                                     employee.skills,
//                                   )
//                                     ? employee.skills
//                                     : String(employee.skills).split(",");
//                                   const hasOverflow = allSkills.length > 4;
//                                   const visibleSkills = isSkillsExpanded
//                                     ? allSkills
//                                     : allSkills.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleSkills.map((skill, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof skill === "string"
//                                             ? skill.trim()
//                                             : String(skill)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsSkillsExpanded(
//                                               !isSkillsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isSkillsExpanded
//                                             ? "Show Less"
//                                             : `+${allSkills.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Skill Added
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Assets Subsection */}

//                           <div className="space-y-4">
//                             {/* SECTION HEADER */}
//                             <div className="flex items-center justify-between group/sub">
//                               <div className="flex items-center gap-2">
//                                 <Monitor size={14} className="text-blue-500" />
//                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                                   Assets
//                                 </span>
//                               </div>

//                               <button
//                                 onClick={() => setShowAssetModal(true)}
//                                 className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//                               >
//                                 <Edit3 size={12} strokeWidth={2.5} />
//                               </button>
//                             </div>

//                             {/* CHIP CONTAINER */}
//                             <div className="flex flex-wrap gap-1.5">
//                               {employee?.assets &&
//                               (Array.isArray(employee.assets)
//                                 ? employee.assets.length > 0
//                                 : String(employee.assets).trim() !== "") ? (
//                                 (() => {
//                                   // Normalize data into a unified array
//                                   const allAssets = Array.isArray(
//                                     employee.assets,
//                                   )
//                                     ? employee.assets
//                                     : String(employee.assets).split(",");
//                                   const hasOverflow = allAssets.length > 4;
//                                   const visibleAssets = isAssetsExpanded
//                                     ? allAssets
//                                     : allAssets.slice(0, 4);

//                                   return (
//                                     <>
//                                       {visibleAssets.map((asset, i) => (
//                                         <span
//                                           key={i}
//                                           className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm animate-in fade-in zoom-in-95"
//                                         >
//                                           {typeof asset === "string"
//                                             ? asset.trim()
//                                             : String(asset)}
//                                         </span>
//                                       ))}

//                                       {/* 🛠️ ASSET EXPANSION NODE */}
//                                       {hasOverflow && (
//                                         <button
//                                           onClick={() =>
//                                             setIsAssetsExpanded(
//                                               !isAssetsExpanded,
//                                             )
//                                           }
//                                           className="px-2.5 py-1 bg-white text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
//                                         >
//                                           {isAssetsExpanded
//                                             ? "Show Less"
//                                             : `+${allAssets.length - 4} More`}
//                                         </button>
//                                       )}
//                                     </>
//                                   );
//                                 })()
//                               ) : (
//                                 <span className="text-xs text-slate-800 font-medium italic opacity-60">
//                                   No Assets Allocated
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Layers
//                         className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none"
//                         size={120}
//                       />
//                     </div>
//                   </div>

//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">
//                     {/* SYSTEM WATERMARK: Large rotated background icon */}
//                     <History
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <History size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Candidate
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Previous Job History
//                           </p>
//                         </div>
//                       </div>

//                       {/* TENURE COUNTER */}
//                       <div className="flex items-center gap-3">
//                         <div className="flex flex-col items-end">
//                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                             Total Experience
//                           </span>
//                           <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//                             {calculateTotalExperience(employee?.experiences)}
//                           </span>
//                         </div>

//                         <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//                         <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//                           {/* EDIT BUTTON */}
//                           {/* <button
//                             type="button"
//                             onClick={() => navigate(`/editentry/${id}?step=4`)}
//                             className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//                           >
//                             <Edit3 size={12} strokeWidth={3} />
//                             Edit
//                           </button> */}
//                           {/* <button
//       type="button"
//       onClick={() => setShowExperienceModal(true)}
//       className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
//     >
//       <Edit3 size={12} strokeWidth={3} />
//       Modify Experience
//     </button> */}
// <button
//   type="button"
//   onClick={() => {
//     setExperienceList([]); // Force immediate purge
//     setShowExperienceModal(true); // Deploy Modal
//   }}
//   className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
// >
//   <Edit3 size={12} strokeWidth={3} />
//   Modify Experience
// </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     <div className="relative z-10">
//                       {/* {employee?.experiences &&
//                       employee.experiences.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.experiences.map((exp, i) => (
//                             <div
//                               key={i}
//                               className="group hover:bg-slate-50/40 transition-colors duration-300"
//                             >
//                               <div className="flex flex-col md:flex-row p-8 gap-8">

//                                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                     {exp?.start_date
//                                       ? new Date(exp.start_date).getFullYear()
//                                       : "----"}
//                                   </span>

//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                     {exp?.start_date
//                                       ? new Date(
//                                           exp.start_date,
//                                         ).toLocaleDateString("en-IN", {
//                                           month: "short",
//                                         })
//                                       : "---"}{" "}
//                                     DEPLOYMENT
//                                   </span>
//                                 </div>

//                                 <div className="flex-1 space-y-4">
//                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div>
//                                       <div className="flex items-center gap-2 mb-1">
//                                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                           {exp?.company_name ||
//                                             "Unidentified Entity"}
//                                         </h4>
//                                         <span className="h-1 w-1 rounded-full bg-slate-300" />
//                                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                           {exp?.location || "Global Node"}
//                                         </span>
//                                       </div>

//                                       <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                                         {exp?.job_title || "Role Undefined"}
//                                       </p>
//                                     </div>

//                                     {exp?.experience_letter_path && (
//                                       <a
//                                         // href={formatDocUrl(
//                                         //   exp.experience_letter_path,
//                                         // )}
//                                         href={exp.experience_letter_path}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                                       >
//                                         <FileText
//                                           size={14}
//                                           className="text-slate-400 group-hover/artifact:text-blue-500"
//                                         />
//                                         Experience Letter
//                                         <ExternalLink
//                                           size={10}
//                                           className="opacity-40"
//                                         />
//                                       </a>
//                                     )}
//                                   </div>

//                                   <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                         Previous CTC
//                                       </span>
//                                       <div className="flex items-center gap-1.5">
//                                         <span className="text-blue-600 font-black text-[10px]">
//                                           ₹
//                                         </span>
//                                         <span className="text-[11px] font-bold text-slate-700">
//                                           {exp?.previous_ctc
//                                             ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                                             : "Not Logged"}
//                                         </span>
//                                       </div>
//                                     </div>

//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                         Duration
//                                       </span>
//                                       <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                         {exp?.start_date
//                                           ? new Date(
//                                               exp.start_date,
//                                             ).toLocaleDateString("en-IN", {
//                                               month: "short",
//                                               year: "numeric",
//                                             })
//                                           : "---"}{" "}
//                                         -{" "}
//                                         {exp?.end_date
//                                           ? new Date(
//                                               exp.end_date,
//                                             ).toLocaleDateString("en-IN", {
//                                               month: "short",
//                                               year: "numeric",
//                                             })
//                                           : "Present"}
//                                       </span>
//                                     </div>
//                                   </div>

//                                   {exp?.description && (
//                                     <div className="max-w-3xl">
//                                       <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                                         "{exp.description}"
//                                       </p>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <Database size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             Fresher Profile
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             No prior professional experience recorded
//                           </p>
//                         </div>
//                       )} */}

//                       {employee?.experiences && employee.experiences.length > 0 ? (
//   <div className="divide-y divide-slate-100">
//     {employee.experiences.map((exp, i) => {
//       // 🛠️ INDIVIDUAL DURATION CALCULATION PROTOCOL
//       const calculateSingleDuration = (start, end) => {
//         if (!start) return "—";
//         const startDate = new Date(start);
//         const endDate = end ? new Date(end) : new Date();

//         let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
//         months = Math.max(0, months);

//         const years = Math.floor(months / 12);
//         const remainingMonths = months % 12;

//         const yrText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : "";
//         const moText = remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : "";

//         return [yrText, moText].filter(Boolean).join(" ") || "1 mo";
//       };

//       return (
//         <div key={i} className="group hover:bg-slate-50/40 transition-colors duration-300">
//           <div className="flex flex-col md:flex-row p-8 gap-8">
//             {/* TIME IDENTIFIER */}
//             <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//               <span className="text-xl font-black text-slate-900 tracking-tighter">
//                 {exp?.start_date ? new Date(exp.start_date).getFullYear() : "----"}
//               </span>
//               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                 {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short" }) : "---"} DEPLOYMENT
//               </span>
//             </div>

//             {/* CONTENT BODY */}
//             {/* <div className="flex-1 space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                       {exp?.company_name || "-"}
//                     </h4>
//                     <span className="h-1 w-1 rounded-full bg-slate-300" />
//                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                       {exp?.location || "-"}
//                     </span>
//                   </div>
//                   <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                     {exp?.job_title || "-"}
//                   </p>
//                 </div>

//                 <div className="flex flex-col items-start gap-2">

//   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
//     Experiance
//   </h4>

//   <div className="flex items-center gap-2">
//     <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-300">
//       <Calendar size={10} className="text-blue-500 group-hover:text-white transition-colors" />
//       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:text-white transition-colors">
//         {calculateSingleDuration(exp.start_date, exp.end_date)}
//       </span>
//     </div>
//   </div>
// </div>

//                 {exp?.experience_letter_path && (
//                   <a
//                     href={exp.experience_letter_path}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                   >
//                     <FileText size={14} className="text-slate-400 group-hover/artifact:text-blue-500" />
//                     Experience Letter
//                     <ExternalLink size={10} className="opacity-40" />
//                   </a>
//                 )}
//               </div>

//               <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                 <div className="flex flex-col">
//                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous CTC</span>
//                   <div className="flex items-center gap-1.5">
//                     <span className="text-blue-600 font-black text-[10px]">₹</span>
//                     <span className="text-[11px] font-bold text-slate-700">
//                       {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Logged"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tenure</span>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                        {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "---"}
//                        {" — "}
//                        {exp?.end_date ? new Date(exp.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {exp?.description && (
//                 <div className="max-w-3xl">
//                   <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
//                     "{exp.description}"
//                   </p>
//                 </div>
//               )}
//             </div> */}

//             {/* CONTENT BODY */}
// <div className="flex-1 space-y-4">
//   {/* TOP ROW: IDENTITY + TENURE / ACTIONS */}
//   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//     <div className="space-y-1">
//       <div className="flex items-center gap-2">
//         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//           {exp?.company_name || "-"}
//         </h4>
//         <span className="h-1 w-1 rounded-full bg-slate-300" />
//         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//           {exp?.location || "-"}
//         </span>
//       </div>
//       <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//         {exp?.job_title || "-"}
//       </p>
//     </div>

//     {/* TENURE & DOCUMENT NODE: Grouped for perfect alignment */}
//     <div className="flex flex-col sm:items-end gap-2">
//       {/* Tenure Branding Box */}
//       <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
//         <Calendar size={12} className="text-blue-500" />
//         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
//           {calculateSingleDuration(exp.start_date, exp.end_date)}
//         </span>
//       </div>

//       {/* Artifact Node: Only shows if path exists, otherwise shows a subtle status */}
//       {exp?.experience_letter_path ? (
//         <a
//           href={exp.experience_letter_path}
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//         >
//           <FileText size={12} className="text-slate-400 group-hover/artifact:text-blue-500" />
//           Experiance Letter
//           <ExternalLink size={10} className="opacity-40" />
//         </a>
//       ) : (
//         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
//           <Shield size={12} className="text-slate-300" />
//           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">No Artifact Logged</span>
//         </div>
//       )}
//     </div>
//   </div>

//   {/* BOTTOM ROW: FINANCIALS & TIMELINE */}
//   <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2 border-t border-slate-50">
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous CTC</span>
//       <div className="flex items-center gap-1.5">
//         <span className="text-blue-600 font-black text-[10px]">₹</span>
//         <span className="text-[11px] font-bold text-slate-700">
//           {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Logged"}
//         </span>
//       </div>
//     </div>

//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline Registry</span>
//       <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
//          {exp?.start_date ? new Date(exp.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "---"}
//          {" — "}
//          {exp?.end_date ? new Date(exp.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present"}
//       </span>
//     </div>
//   </div>

//   {exp?.description && (
//     <div className="max-w-3xl pt-2">
//       <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
//         "{exp.description}"
//       </p>
//     </div>
//   )}
// </div>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// ) : (
//    <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <Database size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             Fresher Profile
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             No prior professional experience recorded
//                           </p>
//                         </div>
// )}
//                     </div>
//                   </div>

//                   {/* EDUCATION HISTORY: SYSTEM STREAM */}
//                   <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
//                     {/* SYSTEM WATERMARK */}
//                     <Award
//                       className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
//                       size={260}
//                       strokeWidth={1}
//                     />

//                     {/* HEADER SECTION */}
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                           <Award size={18} strokeWidth={2.5} />
//                         </div>

//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                             Academic History
//                           </h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                             Education History
//                           </p>
//                         </div>
//                       </div>

//                       {/* EDIT REDIRECT */}
//                       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//                         <button
//                           type="button"
//                           onClick={() => navigate(`/editentry/${id}?step=3`)}
//                           className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//                         >
//                           <Edit3 size={12} strokeWidth={3} />
//                           Edit Nodes
//                         </button>
//                       </div>
//                     </div>

//                     {/* BODY CONTENT */}
//                     <div className="relative z-10">
//                       {employee?.educations &&
//                       employee.educations.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.educations.map((edu, i) => (
//                             <div
//                               key={i}
//                               className="group/item hover:bg-slate-50/40 transition-colors duration-300"
//                             >
//                               <div className="flex flex-col md:flex-row p-8 gap-8">
//                                 {/* TIME IDENTIFIER */}
//                                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                     {edu?.end_year || "----"}
//                                   </span>

//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                     GRADUATION
//                                   </span>
//                                 </div>

//                                 {/* CONTENT BODY */}
//                                 <div className="flex-1 space-y-4">
//                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div className="space-y-1">
//                                       <div className="flex items-center gap-2">
//                                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                           {edu?.institution_name ||
//                                             "Unidentified Institute"}
//                                         </h4>
//                                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                                       </div>

//                                       {/* Degree Name from education_master mapping */}
//                                       <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                                         {edu?.education_master?.name ||
//                                           "Specialization Undefined"}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                         Academic Period
//                                       </span>
//                                       <div className="flex items-center gap-2">
//                                         <Calendar
//                                           size={12}
//                                           className="text-slate-300"
//                                         />
//                                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                           {edu?.start_year || "----"} —{" "}
//                                           {edu?.end_year || "----"}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         /* EMPTY STATE */
//                         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                             <GraduationCap size={28} strokeWidth={1.5} />
//                           </div>
//                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                             No Academic Records
//                           </h4>
//                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                             Node synchronized but education array is empty
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Resume
//                       </h3>
//                     </div>
//                     {employee?.resume_path ? (
//                       <ModernDocCard
//                         title="Master Curriculum Vitae"
//                         url={employee.resume_path}
//                         type="resume"
//                         formatDocUrl={formatDocUrl}
//                       />
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
//                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                           Resume Missing
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Certificate
//                       </h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {employee?.certificates?.map((cert) => (
//                         <ModernDocCard
//                           key={cert.id}
//                           title={cert.name}
//                           url={cert.file_path}
//                           type="Certificate"
//                           formatDocUrl={formatDocUrl}
//                           icon={Award}
//                         />
//                       )) || (
//                         <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">
//                           No Certificates Found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* --- ENTERPRISE MODAL PORTAL --- */}

//       {showLanguageModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowLanguageModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white">
//                   <Languages size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Update Languages
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowLanguageModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-8">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
//                 Select nodes to sync with the candidate's communication stack.
//               </p>

//               {/* CHIP SELECTION GRID */}
//               <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                 {[...new Set([...DEFAULT_LANGS, ...selectedLangs])].map(
//                   (lang) => {
//                     const isSelected = selectedLangs.includes(lang);
//                     return (
//                       <button
//                         key={lang}
//                         type="button"
//                         onClick={() => {
//                           setSelectedLangs((prev) =>
//                             isSelected
//                               ? prev.filter((l) => l !== lang)
//                               : [...prev, lang],
//                           );
//                         }}
//                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
//                           isSelected
//                             ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
//                             : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
//                         }`}
//                       >
//                         {lang}
//                         {isSelected && (
//                           <CheckCircle size={12} strokeWidth={3} />
//                         )}
//                       </button>
//                     );
//                   },
//                 )}
//               </div>

//               <button
//                 disabled={updating}
//                 className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
//                 onClick={handleLanguageUpdate}
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <BadgeCheck size={16} />
//                 )}
//                 {updating ? "Synchronizing..." : "Update Linguistic Node"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: SKILL REGISTRY --- */}

//       {showSkillModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
//             onClick={() => !updating && setShowSkillModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//             {/* HEADER NODE */}
//             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
//                   <Layers size={18} strokeWidth={2.5} />
//                 </div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                   Skill
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowSkillModal(false)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-8 space-y-8">
//               {/* INPUT NODE: Manual Entry */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">
//                   Skill
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     value={newSkillInput}
//                     onChange={(e) => setNewSkillInput(e.target.value)}
//                     placeholder="Type and press Enter..."
//                     className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//                     onKeyDown={(e) =>
//                       e.key === "Enter" &&
//                       (e.preventDefault(), addManualSkill())
//                     }
//                   />
//                   {/* <button type="button" onClick={addManualSkill} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Add</button> */}
//                 </div>
//               </div>

//               {/* ACTIVE NODES AREA (Everything in this list will be sent to API) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Selected Skills
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
//                     {selectedSkills.length} Selected
//                   </span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-100 min-h-[80px]">
//                   {selectedSkills.length > 0 ? (
//                     selectedSkills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black uppercase shadow-sm animate-in zoom-in-95"
//                       >
//                         {skill}
//                         <X
//                           size={12}
//                           className="cursor-pointer hover:text-red-500 transition-colors"
//                           onClick={() =>
//                             setSelectedSkills(
//                               selectedSkills.filter((_, idx) => idx !== i),
//                             )
//                           }
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-[9px] font-black text-slate-300 uppercase m-auto tracking-widest">
//                       No Skills
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* MASTER REGISTRY: Quick Toggle Nodes */}
//               <div className="space-y-3 pt-4 border-t border-slate-100">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//                   Skill History
//                 </label>
//                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
//                   {masterSkills.map((item) => {
//                     const name = item.name || item;
//                     const isSelected = selectedSkills.includes(name);
//                     return (
//                       <button
//                         key={name}
//                         type="button"
//                         onClick={() =>
//                           setSelectedSkills((prev) =>
//                             isSelected
//                               ? prev.filter((s) => s !== name)
//                               : [...prev, name],
//                           )
//                         }
//                         className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
//                           isSelected
//                             ? "bg-blue-500 border-blue-500 text-white shadow-md"
//                             : "bg-slate-50 border-slate-500 text-slate-800 hover:border-blue-200"
//                         }`}
//                       >
//                         {name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* SUBMIT BUTTON */}
//               <button
//                 disabled={updating}
//                 onClick={syncSkills}
//                 className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={16} />
//                 ) : (
//                   <ShieldCheck size={16} />
//                 )}
//                 Save Skills
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: HARDWARE ASSETS --- */}

//       {showAssetModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* Backdrop with Glassmorphism */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => !updating && setShowAssetModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* 1. BRANDED HEADER */}
//             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
//               <div className="flex items-center gap-5">
//                 {/* LOGO NODE */}
//                 <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
//                   <Monitor size={24} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
//                     Asset
//                   </h3>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                       Update the assets
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAssetModal(false)}
//                 className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
//               >
//                 <X size={20} strokeWidth={3} />
//               </button>
//             </div>

//             <div className="p-10 space-y-8 bg-white">
//               {/* 2. INPUT NODE */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-1">
//                   Add Assets
//                 </label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1 group">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                       <Plus size={16} strokeWidth={3} />
//                     </div>
//                     <input
//                       value={newAssetInput}
//                       onChange={(e) => setNewAssetInput(e.target.value)}
//                       placeholder="e.g. MacBook Pro M3"
//                       className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           if (newAssetInput.trim()) {
//                             setSelectedAssets([
//                               ...selectedAssets,
//                               newAssetInput.trim(),
//                             ]);
//                             setNewAssetInput("");
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* 3. ENHANCED CHIP CONTAINER (Matched to Skills Style) */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between ml-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
//                     Selected Assets
//                   </label>
//                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//                     {selectedAssets.length} Allocated
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[120px] items-start content-start">
//                   {selectedAssets.length > 0 ? (
//                     selectedAssets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="group/chip flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm hover:border-blue-400 hover:shadow-md transition-all animate-in zoom-in-95"
//                       >
//                         <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
//                         {asset}
//                         <button
//                           onClick={() =>
//                             setSelectedAssets(
//                               selectedAssets.filter((_, idx) => idx !== i),
//                             )
//                           }
//                           className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
//                         >
//                           <X size={14} strokeWidth={3} />
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="m-auto flex flex-col items-center gap-2 opacity-30">
//                       <Database size={24} strokeWidth={1.5} />
//                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                         Registry Vacant
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* 4. SUBMIT ACTION */}
//               <button
//                 disabled={updating}
//                 onClick={syncAssets}
//                 className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
//               >
//                 {updating ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Commit Allocation
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* {showExperienceModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowExperienceModal(false)} />

//     <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Experience Registry</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Maintain employment node accuracy</p>
//           </div>
//         </div>
//         <button onClick={() => setShowExperienceModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-6 bg-white">
//         {experienceList.length > 0 ? (
//           experienceList.map((exp, index) => (
//             <div key={index} className="group p-6 bg-slate-50 border border-slate-200 rounded-[2rem] relative hover:border-blue-300 transition-all">
//               <button
//                 onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
//                 className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 transition-colors"
//               >
//                 <X size={16} strokeWidth={3} />
//               </button>

//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
//                   <input
//                     className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none"
//                     value={exp.company_name}
//                     onChange={(e) => {
//                       const newList = [...experienceList];
//                       newList[index].company_name = e.target.value;
//                       setExperienceList(newList);
//                     }}
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
//                   <input
//                     className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none"
//                     value={exp.job_title}
//                     onChange={(e) => {
//                       const newList = [...experienceList];
//                       newList[index].job_title = e.target.value;
//                       setExperienceList(newList);
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem]">
//             <History size={40} className="text-slate-200 mb-4" />
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No nodes present in local registry</p>
//           </div>
//         )}

//         <button
//           onClick={() => setExperienceList([...experienceList, { company_name: "", job_title: "", start_date: "", end_date: "", location: "", previous_ctc: "" }])}
//           className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
//         >
//           <Plus size={14} strokeWidth={3} /> Add Employment Node
//         </button>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">
//         <button
//           disabled={updating}
//           onClick={handleExperienceSync}
//           className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
//         >
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//           Commit History Update
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}
// {/* {showExperienceModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowExperienceModal(false)} />

//     <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">

//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Experience Registry</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Node Employment Audit</p>
//           </div>
//         </div>
//         <button onClick={() => setShowExperienceModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//         {experienceList.map((exp, index) => (
//           <div key={index} className="group p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative hover:border-blue-300 transition-all space-y-6">
//             <button
//               onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
//               className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
//             >
//               <X size={16} strokeWidth={3} />
//             </button>

//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Google" value={exp.company_name} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].company_name = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position Held</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Senior Dev" value={exp.job_title} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].job_title = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             <div className="grid grid-cols-4 gap-4">
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.start_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].start_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.end_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].end_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTC Node (LPA)</label>
//                 <input type="number" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm" placeholder="e.g. 1200000" value={exp.previous_ctc} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].previous_ctc = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             <div className="space-y-4 pt-4 border-t border-slate-200/60">
//               <div className="flex items-center justify-between">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Validation Artifact</label>
//                 <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "file"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
//                   >Upload PDF</button>
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "link"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
//                   >External Link</button>
//                 </div>
//               </div>

//               <div className="animate-in slide-in-from-top-2 duration-300">
//                 {exp.artifact_type === "file" ? (
//                   <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.png" onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_file = e.target.files[0]; setExperienceList(newList);
//                     }} />
//                     <Download size={20} className="text-slate-300 mb-1" />
//                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                       {exp.exp_letter_file ? exp.exp_letter_file.name : "Select Binary File"}
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" placeholder="https://drive.google.com/..." value={exp.exp_letter_link} onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_link = e.target.value; setExperienceList(newList);
//                     }} />
//                     <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={addExperienceNode}
//           className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[11px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-slate-50/50"
//         >
//           <Plus size={16} strokeWidth={3} /> Expand Professional Registry
//         </button>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">
//         <button
//           disabled={updating}
//           onClick={handleExperienceSync}
//           className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//         >
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//           Commit Integrated Nodes
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

// {showExperienceModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowExperienceModal(false)} />

//     <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
//       {/* HEADER */}
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Briefcase size={22} /></div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Experience Registry</h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Node Employment Audit</p>
//           </div>
//         </div>
//         <button onClick={() => setShowExperienceModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
//       </div>

//       <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white">
//         {experienceList.map((exp, index) => (
//           <div key={index} className="group p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative hover:border-blue-300 transition-all space-y-6">
//             <button
//               onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
//               className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
//             >
//               <X size={16} strokeWidth={3} />
//             </button>

//             {/* GRID 1: IDENTITY */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Google" value={exp.company_name} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].company_name = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
//                 <select
//                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                   value={exp.industry_id}
//                   onChange={(e) => {
//                     const newList = [...experienceList]; newList[index].industry_id = e.target.value; setExperienceList(newList);
//                   }}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map(ind => (
//                     <option key={ind.id} value={ind.id}>{ind.name}</option>
//                   ))}
//                 </select>
//               </div>

//             </div>

//             {/* GRID 2: INDUSTRY & DEPARTMENT SELECTION */}
//             <div className="grid grid-cols-2 gap-6">

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//                 <select
//                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm appearance-none"
//                   value={exp.department_id}
//                   onChange={(e) => {
//                     const newList = [...experienceList]; newList[index].department_id = e.target.value; setExperienceList(newList);
//                   }}
//                 >
//                   <option value="">Select Department</option>
//                   {departments.map(dep => (
//                     <option key={dep.id} value={dep.id}>{dep.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
//                 <input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-blue-600 outline-none shadow-sm" placeholder="e.g. Senior Dev" value={exp.job_title} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].job_title = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             {/* GRID 3: TIMELINE & PAYROLL */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.start_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].start_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-1 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
//                 <input type="date" className="w-full px-3 py-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold outline-none shadow-sm" value={exp.end_date} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].end_date = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//               <div className="col-span-2 space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTC (LPA)</label>
//                 <input type="number" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none shadow-sm" placeholder="e.g. 1200000" value={exp.previous_ctc} onChange={(e) => {
//                   const newList = [...experienceList]; newList[index].previous_ctc = e.target.value; setExperienceList(newList);
//                 }} />
//               </div>
//             </div>

//             {/* ARTIFACT SWITCHER PROTOCOL */}
//             <div className="space-y-4 pt-4 border-t border-slate-200/60">
//               <div className="flex items-center justify-between">
//                 <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Validation Artifact</label>
//                 <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "file"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'file' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
//                   >Upload PDF</button>
//                   <button
//                     onClick={() => { const nl = [...experienceList]; nl[index].artifact_type = "link"; setExperienceList(nl); }}
//                     className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${exp.artifact_type === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
//                   >External Link</button>
//                 </div>
//               </div>

//               <div className="animate-in slide-in-from-top-2 duration-300">
//                 {exp.artifact_type === "file" ? (
//                   <div className="relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.png" onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_file = e.target.files[0]; setExperienceList(newList);
//                     }} />
//                     <Download size={20} className="text-slate-300 mb-1" />
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       {exp.exp_letter_file ? exp.exp_letter_file.name : "Select Binary File"}
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input className="w-full px-11 py-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-600 shadow-sm" placeholder="https://drive.google.com/..." value={exp.exp_letter_link} onChange={(e) => {
//                       const newList = [...experienceList]; newList[index].exp_letter_link = e.target.value; setExperienceList(newList);
//                     }} />
//                     <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={addExperienceNode}
//           className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[11px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-slate-50/50"
//         >
//           <Plus size={16} strokeWidth={3} /> Expand Professional Registry
//         </button>
//       </div>

//       <div className="p-8 border-t border-slate-100 bg-white">
//         {/* <button
//           disabled={updating}
//           onClick={handleExperienceSync}
//           className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
//         >
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//           Commit Integrated Nodes
//         </button> */}
//         {/* <button
//   disabled={updating || experienceList.some(exp => !exp.company_name || !exp.job_title || !exp.start_date || !exp.end_date)}
//   onClick={handleExperienceSync}
//   className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
// >
//   {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//   Commit Integrated Nodes
// </button> */}
// <button
//   disabled={
//     updating ||
//     experienceList.length === 0 ||
//     experienceList.some(exp => !exp.company_name || !exp.job_title || !exp.start_date || !exp.end_date)
//   }
//   onClick={handleExperienceSync}
//   className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
// >
//   {updating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
//   Commit Integrated Nodes
// </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
//       {React.cloneElement(icon, { size: 14 })}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-bold text-slate-700 break-all">
//         {value || "Not Specified"}
//       </span>
//     </div>
//   </div>
// );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
//   <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//       <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && (
//           <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />
//         )}
//       </div>
//       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
//         {title}
//       </h3>
//     </div>
//     <div className="relative z-10 p-6 space-y-4">{children}</div>
//     <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
//       {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}
//   >
//     <div className="flex items-center gap-2 text-slate-400">
//       {icon}
//       <span className="text-[10px] font-black uppercase tracking-widest">
//         {label}
//       </span>
//     </div>
//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {value ? (
//           String(value)
//             .split(",")
//             .map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter"
//               >
//                 {skill.trim()}
//               </span>
//             ))
//         ) : (
//           <span className="text-[10px] text-slate-300 uppercase">Void</span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-black text-slate-800 uppercase">
//         {value || "—"}
//       </span>
//     )}
//   </div>
// );

// const ModernDocCard = ({
//   title,
//   url,
//   type,
//   formatDocUrl,
//   icon: CardIcon = FileText,
// }) => (
//   <a
//     href={formatDocUrl(url)}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm"
//   >
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
//           {title}
//         </p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
//           {type}
//         </p>
//       </div>
//     </div>
//     <ExternalLink
//       size={16}
//       className="text-slate-200 group-hover:text-blue-600 transition-colors"
//     />
//   </a>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-400 hover:text-slate-600"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="relative w-16 h-16">
//       <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
//       <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//     </div>
//     <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
//       Loading ...
//     </p>
//   </div>
// );

// const StripDetail = ({ icon, label, value }) => (
//   <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
//     {/* ICON BRANDING BOX: Glassmorphism effect */}
//     <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
//       <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
//         {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
//       </div>
//     </div>

//     {/* DATA STACK */}
//     <div className="flex flex-col min-w-0">
//       <div className="flex items-center gap-1.5 mb-0.5">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
//           {label}
//         </span>
//         {/* Verification Dot: Hidden by default, shown on hover */}
//         <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
//           {value || "—"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
//***************************************************************working code phase 2 24/02/26********************************************************* */
//     import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   CheckCircle,
//   Loader2,
//   MapPin,
//   History,
//   User,
//   Plus,
//   Briefcase,
//    X ,
//   GraduationCap,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
//   Fingerprint,
//   Cpu,
//   Layers,
//   Award,
//   BadgeCheck,
//   Languages
// } from "lucide-react";
// import toast from "react-hot-toast";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
// const [showLanguageModal, setShowLanguageModal] = useState(false);
// const [selectedLangs, setSelectedLangs] = useState([]);
// const [updating, setUpdating] = useState(false);
// const [showSkillAssetModal, setShowSkillAssetModal] = useState(false);
// const [masterSkills, setMasterSkills] = useState([]); // All possible skills
// const [selectedSkills, setSelectedSkills] = useState([]); // Candidate's skills
// const [selectedAssets, setSelectedAssets] = useState([]); // Candidate's assets
// const [newAssetInput, setNewAssetInput] = useState("");
// const [showSkillModal, setShowSkillModal] = useState(false);
// const [showAssetModal, setShowAssetModal] = useState(false);
// const [newSkillInput, setNewSkillInput] = useState("");
// const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
// const [isAssetsExpanded, setIsAssetsExpanded] = useState(false);

// const DEFAULT_LANGS = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"];
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   // Effect to sync modal state with employee data when modal opens
// useEffect(() => {
//   if (showLanguageModal && employee?.languages_spoken) {
//     // If API returns string, split it; if array, use it directly
//     const current = Array.isArray(employee.languages_spoken)
//       ? employee.languages_spoken
//       : employee.languages_spoken.split(',').map(l => l.trim());
//     setSelectedLangs(current);
//   }
// }, [showLanguageModal, employee]);

// // Initialize Modal Data
// useEffect(() => {
//   if (showSkillAssetModal) {
//     fetchMasterSkills();
//     // Normalize Skills (handle Array or String)
//     const currentSkills = Array.isArray(employee?.skills)
//       ? employee.skills
//       : employee?.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];
//     setSelectedSkills(currentSkills);

//     // Normalize Assets
//     const currentAssets = Array.isArray(employee?.assets)
//       ? employee.assets
//       : employee?.assets?.split(',').map(a => a.trim()).filter(Boolean) || [];
//     setSelectedAssets(currentAssets);
//   }
// }, [showSkillAssetModal, employee]);

// // PATCH Transmission
// const handleSyncRegistry = async () => {
//   setUpdating(true);
//   const syncToast = toast.loading("Executing Node Synchronization...");
//   try {
//     const formData = new FormData();
//     formData.append("skills", selectedSkills.join(","));
//     formData.append("assets", selectedAssets.join(","));

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`, {
//       method: "PATCH",
//       body: formData,
//     });

//     if (res.ok) {
//       toast.success("Audit Registry Updated", { id: syncToast });
//       setEmployee({ ...employee, skills: selectedSkills, assets: selectedAssets });
//       setShowSkillAssetModal(false);
//     } else { throw new Error(); }
//   } catch (err) {
//     toast.error("Handshake Refused", { id: syncToast });
//   } finally { setUpdating(false); }
// };

// // Registry Logic
// const fetchMasterSkills = async () => {
//   try {
//     const res = await fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100");
//     const data = await res.json();
//     setMasterSkills(data || []);
//   } catch (err) { console.error("Master Sync Failure"); }
// };

// // Initialize Skill Data when Skill Modal opens
// useEffect(() => {
//   if (showSkillModal) {
//     fetchMasterSkills();
//     const current = Array.isArray(employee?.skills)
//       ? employee.skills
//       : employee?.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];
//     setSelectedSkills(current);
//   }
// }, [showSkillModal, employee]);

// // Initialize Asset Data when Asset Modal opens
// useEffect(() => {
//   if (showAssetModal) {
//     const current = Array.isArray(employee?.assets)
//       ? employee.assets
//       : employee?.assets?.split(',').map(a => a.trim()).filter(Boolean) || [];
//     setSelectedAssets(current);
//   }
// }, [showAssetModal, employee]);

// // Independent Sync Handlers
// const syncSkills = async () => {
//   setUpdating(true);
//   const toastId = toast.loading("Syncing Skill Matrix...");
//   try {
//     const fd = new FormData();
//     fd.append("skills", selectedSkills.join(","));
//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`, { method: "PATCH", body: fd });
//     if (res.ok) {
//       toast.success("Skill Node Updated", { id: toastId });
//       setEmployee({ ...employee, skills: selectedSkills });
//       setShowSkillModal(false);
//     } else throw new Error();
//   } catch (err) { toast.error("Sync Failed", { id: toastId }); }
//   finally { setUpdating(false); }
// };

// const addManualSkill = () => {
//   const skill = newSkillInput.trim();
//   // Case-insensitive check to prevent duplicates
//   if (skill && !selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
//     setSelectedSkills([...selectedSkills, skill]);
//     setNewSkillInput("");
//   }
// };

// const syncAssets = async () => {
//   setUpdating(true);
//   const toastId = toast.loading("Syncing Asset Registry...");
//   try {
//     const fd = new FormData();
//     fd.append("assets", selectedAssets.join(","));
//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`, { method: "PATCH", body: fd });
//     if (res.ok) {
//       toast.success("Asset Node Updated", { id: toastId });
//       setEmployee({ ...employee, assets: selectedAssets });
//       setShowAssetModal(false);
//     } else throw new Error();
//   } catch (err) { toast.error("Sync Failed", { id: toastId }); }
//   finally { setUpdating(false); }
// };

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(exp.start_date);
//       const end = exp.end_date ? new Date(exp.end_date) : new Date();
//       const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += Math.max(0, diff);
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
//   };

//   const handleLanguageUpdate = async () => {
//   setUpdating(true);
//   const syncToast = toast.loading("Synchronizing Linguistic Nodes...");

//   try {
//     const formData = new FormData();
//     // Convert array to comma-separated string
//     formData.append("languages_spoken", selectedLangs.join(","));

//     const res = await fetch(`https://apihrr.goelectronix.co.in/candidates/${id}`, {
//       method: "PATCH",
//       body: formData,
//     });

//     if (res.ok) {
//       toast.success("Registry Updated Successfully", { id: syncToast });
//       // Refresh local employee state
//       setEmployee({ ...employee, languages_spoken: selectedLangs });
//       setShowLanguageModal(false);
//     } else {
//       throw new Error("Protocol Rejection");
//     }
//   } catch (err) {
//     toast.error("Handshake Failed", { id: syncToast });
//   } finally {
//     setUpdating(false);
//   }
// };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">Candidates</span>
//               <span>/</span>
//               <span className="text-slate-900 font-bold tracking-tight">{employee?.full_name}</span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN */}

//           <div className="col-span-12 lg:col-span-4 space-y-6">
//   <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
//     {/* Decorative Background Icon */}
//     <Fingerprint className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none" size={140} />

//     <div className="flex flex-col items-center text-center relative z-10">
//       <div className="relative group mb-6">
//         <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//         <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//           <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//             {employee?.profile_image ? (
//               <img
//                 src={employee.profile_image}
//                 alt={employee?.full_name}
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
//                 <User size={42} className="text-white mb-1" strokeWidth={1.5} />
//               </div>
//             )}
//           </div>
//           <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//             <div className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//         {employee?.full_name || "Unknown"}
//       </h1>

//     </div>

//     {/* DATA STACK: Left Aligned Personal Info */}
//     <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
//       <SidebarInfo icon={<Mail />} label=" Email" value={employee?.email} />
//       <SidebarInfo icon={<Smartphone />} label="Primary Contact" value={employee?.phone} />

//       {/* ADDED DOB & GENDER HERE */}
//       <div className="grid grid-cols-2 gap-4">
//         <SidebarInfo icon={<Calendar />} label="Birth date" value={employee?.dob} />
//         <SidebarInfo  icon={<User />} label="Gender"
//         // value={employee?.gender}
//         value={
//   employee?.gender
//     ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)
//     : ""
// }

//          />
//       </div>
//       <SidebarInfo
//   icon={<MapPin />}
//   label="Location"
//   value={
//     [employee?.city, employee?.state, employee?.pincode]
//       .filter(val =>
//         val &&
//         val !== "null" &&
//         val !== "Not Specified" &&
//         val !== ""
//       ) // Removes null, "null" string, empty strings, and duplicates
//       .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
//   }
// />
//     </div>
//   </section>
// </div>

//           {/* RIGHT COLUMN */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Candidate Overview" icon={<Activity size={18} />} />
//               <TabButton active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Document" icon={<ShieldCheck size={18} />} />
//             </div>

//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

// <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

//   {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
//   <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//     {/* Decorative Security Pattern Header */}
//     <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

//     <div className="flex flex-col md:flex-row items-stretch">
//       {/* Branding Box (Left) */}
//       <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//         <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
//           <Languages size={24} strokeWidth={1.5} />
//         </div>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Language</h3>
//         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Spoken</p>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 p-6 flex items-center">
//         {/* 🛠️ ACTION NODE: ADD/EDIT BUTTON */}
//       <div className="absolute top-4 right-6">
//         <button
//           onClick={() => setShowLanguageModal(true)}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-95 group/btn"
//         >
//           <Plus size={12} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
//           Edit Languages
//         </button>
//       </div>
//         <div className="space-y-3 w-full">
//           <div className="flex items-center gap-2">
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Languages</span>
//             <div className="h-[1px] flex-1 bg-slate-100" />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {employee?.languages_spoken?.length > 0 ? (
//               employee.languages_spoken.map((lang, i) => (
//                 <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
//                   <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-[11px] font-black text-slate-700 uppercase">{lang}</span>
//                 </div>
//               ))
//             ) : (
//               <span className="text-xs text-slate-600 font-medium">No language data</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//     <Globe className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={120} />
//   </div>

//   {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
//   <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//     <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

//     <div className="flex flex-col md:flex-row items-stretch">
//       {/* Branding Box (Left) */}
//       <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//         <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
//           <Cpu size={24} strokeWidth={1.5} />
//         </div>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Assets & Skill</h3>
//         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Assets & Skills Data</p>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Skills Subsection */}
//         {/* <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Layers size={14} className="text-blue-500" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {employee?.skills ? (
//               String(employee.skills).split(',').map((skill, i) => (
//                 <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default">
//                   {skill.trim()}
//                 </span>
//               ))
//             ) : <span className="text-[9px] text-slate-300 uppercase">Empty Set</span>}
//           </div>
//         </div> */}
//       {/* <div className="space-y-3">
//   <div className="flex items-center gap-2">
//     <Layers size={14} className="text-blue-500" />
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//       Skills Matrix
//     </span>
//   </div>

//   <div className="flex flex-wrap gap-1.5">

//     {employee?.skills && (Array.isArray(employee.skills) ? employee.skills.length > 0 : String(employee.skills).trim() !== "") ? (
//       (Array.isArray(employee.skills) ? employee.skills : String(employee.skills).split(","))
//         .map((skill, i) => (
//           <span
//             key={i}
//             className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm"
//           >
//             {typeof skill === 'string' ? skill.trim() : String(skill)}
//           </span>
//         ))
//     ) : (

//       // <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg opacity-60">
//         <span className="text-xs text-slate-800 font-medium">
//           No Skill Added
//         </span>
//       // </div>
//     )}
//   </div>
// </div> */}

// {/* <div className="space-y-4">
//         <div className="flex items-center justify-between group/sub">
//           <div className="flex items-center gap-2">
//             <Layers size={14} className="text-blue-500" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills Matrix</span>
//           </div>

//           <button
//             onClick={() => setShowSkillModal(true)}
//             className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//           >
//             <Edit3 size={12} strokeWidth={2.5} />
//           </button>
//         </div>

//         <div className="flex flex-wrap gap-1.5">
//           {employee?.skills && (Array.isArray(employee.skills) ? employee.skills.length > 0 : String(employee.skills).trim() !== "") ? (
//             (Array.isArray(employee.skills) ? employee.skills : String(employee.skills).split(","))
//               .map((skill, i) => (
//                 <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default">
//                   {typeof skill === 'string' ? skill.trim() : String(skill)}
//                 </span>
//               ))
//           ) : (
//             <span className="text-xs text-slate-800 font-medium italic opacity-60">No Skill Added</span>
//           )}
//         </div>
//       </div> */}

//       <div className="space-y-4">
//   <div className="flex items-center justify-between group/sub">
//     <div className="flex items-center gap-2">
//       <Layers size={14} className="text-blue-500" />
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills</span>
//     </div>
//     <button
//       onClick={() => setShowSkillModal(true)}
//       className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//     >
//       <Edit3 size={12} strokeWidth={2.5} />
//     </button>
//   </div>

//   <div className="flex flex-wrap gap-1.5">
//     {employee?.skills && (Array.isArray(employee.skills) ? employee.skills.length > 0 : String(employee.skills).trim() !== "") ? (() => {
//       const allSkills = Array.isArray(employee.skills) ? employee.skills : String(employee.skills).split(",");
//       const hasOverflow = allSkills.length > 4;
//       const visibleSkills = isSkillsExpanded ? allSkills : allSkills.slice(0, 4);

//       return (
//         <>
//           {visibleSkills.map((skill, i) => (
//             <span
//               key={i}
//               className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 transition-all cursor-default animate-in fade-in zoom-in-95"
//             >
//               {typeof skill === 'string' ? skill.trim() : String(skill)}
//             </span>
//           ))}

//           {/* 🛠️ EXPANSION NODE */}
//           {hasOverflow && (
//             <button
//               onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
//               className="px-2.5 py-1 bg-white text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
//             >
//               {isSkillsExpanded ? "Show Less" : `+${allSkills.length - 4} More`}
//             </button>
//           )}
//         </>
//       );
//     })() : (
//       <span className="text-xs text-slate-800 font-medium italic opacity-60">No Skill Added</span>
//     )}
//   </div>
// </div>

//         {/* Assets Subsection */}
//         {/* <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Monitor size={14} className="text-blue-500" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assets</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {employee?.assets ? (
//               String(employee.assets).split(',').map((asset, i) => (
//                 <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight">
//                   {asset.trim()}
//                 </span>
//               ))
//             ) : <span className="text-[9px] text-slate-300 uppercase">No Assets Logged</span>}
//           </div>
//         </div> */}
//         {/* <div className="space-y-3">

//   <div className="flex items-center justify-between group/sub">
//           <div className="flex items-center gap-2">
//             <Monitor size={14} className="text-blue-500" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hardware Assets</span>
//           </div>

//           <button
//             onClick={() => setShowAssetModal(true)}
//             className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//           >
//             <Edit3 size={12} strokeWidth={2.5} />
//           </button>
//         </div>

//   <div className="flex flex-wrap gap-1.5">

//     {employee?.assets && (Array.isArray(employee.assets) ? employee.assets.length > 0 : String(employee.assets).trim() !== "") ? (
//       (Array.isArray(employee.assets) ? employee.assets : String(employee.assets).split(","))
//         .map((asset, i) => (
//           <span
//             key={i}
//             className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm"
//           >
//             {typeof asset === 'string' ? asset.trim() : String(asset)}
//           </span>
//         ))
//     ) : (

//       // <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg opacity-60">
//         <span className="text-xs text-slate-800 font-medium">
//           No Assets Allocated
//         </span>
//       // </div>
//     )}
//   </div>
// </div> */}

// <div className="space-y-4">
//   {/* SECTION HEADER */}
//   <div className="flex items-center justify-between group/sub">
//     <div className="flex items-center gap-2">
//       <Monitor size={14} className="text-blue-500" />
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assets</span>
//     </div>

//     <button
//       onClick={() => setShowAssetModal(true)}
//       className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
//     >
//       <Edit3 size={12} strokeWidth={2.5} />
//     </button>
//   </div>

//   {/* CHIP CONTAINER */}
//   <div className="flex flex-wrap gap-1.5">
//     {employee?.assets && (Array.isArray(employee.assets) ? employee.assets.length > 0 : String(employee.assets).trim() !== "") ? (() => {
//       // Normalize data into a unified array
//       const allAssets = Array.isArray(employee.assets) ? employee.assets : String(employee.assets).split(",");
//       const hasOverflow = allAssets.length > 4;
//       const visibleAssets = isAssetsExpanded ? allAssets : allAssets.slice(0, 4);

//       return (
//         <>
//           {visibleAssets.map((asset, i) => (
//             <span
//               key={i}
//               className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-all cursor-default shadow-sm animate-in fade-in zoom-in-95"
//             >
//               {typeof asset === 'string' ? asset.trim() : String(asset)}
//             </span>
//           ))}

//           {/* 🛠️ ASSET EXPANSION NODE */}
//           {hasOverflow && (
//             <button
//               onClick={() => setIsAssetsExpanded(!isAssetsExpanded)}
//               className="px-2.5 py-1 bg-white text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
//             >
//               {isAssetsExpanded ? "Show Less" : `+${allAssets.length - 4} More`}
//             </button>
//           )}
//         </>
//       );
//     })() : (
//       <span className="text-xs text-slate-800 font-medium italic opacity-60">
//         No Assets Allocated
//       </span>
//     )}
//   </div>
// </div>
//       </div>
//     </div>
//     <Layers className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none" size={120} />
//   </div>

// </div>

//                     <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">

//   {/* SYSTEM WATERMARK: Large rotated background icon */}
//   <History
//     className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
//     size={260}
//     strokeWidth={1}
//   />

//   {/* HEADER SECTION */}
//   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//     <div className="flex items-center gap-3">
//       <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <History size={18} strokeWidth={2.5} />
//       </div>

//       <div>
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//           Candidate
//         </h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//           Previous Job History
//         </p>
//       </div>
//     </div>

//     {/* TENURE COUNTER */}
//     <div className="flex items-center gap-3">
//       <div className="flex flex-col items-end">
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//           Total Experience
//         </span>
//         <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//           {calculateTotalExperience(employee?.experiences)}
//         </span>
//       </div>

//       <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//          {/* EDIT BUTTON */}
//   <button
//     type="button"
// onClick={() => navigate(`/editentry/${id}?step=4`)}
//     className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//   >
//     <Edit3 size={12} strokeWidth={3} />
//     Edit
//   </button>
//       </div>
//     </div>
//   </div>

//   {/* BODY CONTENT */}
//   <div className="relative z-10">
//     {employee?.experiences && employee.experiences.length > 0 ? (
//       <div className="divide-y divide-slate-100">
//         {employee.experiences.map((exp, i) => (
//           <div
//             key={i}
//             className="group hover:bg-slate-50/40 transition-colors duration-300"
//           >
//             <div className="flex flex-col md:flex-row p-8 gap-8">
//               {/* TIME IDENTIFIER */}
//               <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                 <span className="text-xl font-black text-slate-900 tracking-tighter">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).getFullYear()
//                     : "----"}
//                 </span>

//                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                         month: "short",
//                       })
//                     : "---"}{" "}
//                   DEPLOYMENT
//                 </span>
//               </div>

//               {/* CONTENT BODY */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                         {exp?.company_name || "Unidentified Entity"}
//                       </h4>
//                       <span className="h-1 w-1 rounded-full bg-slate-300" />
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                         {exp?.location || "Global Node"}
//                       </span>
//                     </div>

//                     <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                       {exp?.job_title || "Role Undefined"}
//                     </p>
//                   </div>

//                   {exp?.experience_letter_path && (
//                     <a
//                       href={formatDocUrl(exp.experience_letter_path)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                     >
//                       <FileText
//                         size={14}
//                         className="text-slate-400 group-hover/artifact:text-blue-500"
//                       />
//                       Experience Letter
//                       <ExternalLink size={10} className="opacity-40" />
//                     </a>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Previous CTC
//                     </span>
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-blue-600 font-black text-[10px]">
//                         ₹
//                       </span>
//                       <span className="text-[11px] font-bold text-slate-700">
//                         {exp?.previous_ctc
//                           ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                           : "Not Logged"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Duration
//                     </span>
//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                       {exp?.start_date
//                         ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "---"}{" "}
//                       -{" "}
//                       {exp?.end_date
//                         ? new Date(exp.end_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "Present"}
//                     </span>
//                   </div>
//                 </div>

//                 {exp?.description && (
//                   <div className="max-w-3xl">
//                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                       "{exp.description}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//           <Database size={28} strokeWidth={1.5} />
//         </div>
//         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//           Fresher Profile
//         </h4>
//         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//           No prior professional experience recorded
//         </p>
//       </div>
//     )}
//   </div>
// </div>

// {/* EDUCATION HISTORY: SYSTEM STREAM */}
// <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
//   {/* SYSTEM WATERMARK */}
//   <Award
//     className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
//     size={260}
//     strokeWidth={1}
//   />

//   {/* HEADER SECTION */}
//   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//     <div className="flex items-center gap-3">
//       <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <Award size={18} strokeWidth={2.5} />
//       </div>

//       <div>
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//           Academic History
//         </h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//            Education History
//         </p>
//       </div>
//     </div>

//     {/* EDIT REDIRECT */}
//     <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//       <button
//         type="button"
//         onClick={() => navigate(`/editentry/${id}?step=3`)}
//         className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//       >
//         <Edit3 size={12} strokeWidth={3} />
//         Edit Nodes
//       </button>
//     </div>
//   </div>

//   {/* BODY CONTENT */}
//   <div className="relative z-10">
//     {employee?.educations && employee.educations.length > 0 ? (
//       <div className="divide-y divide-slate-100">
//         {employee.educations.map((edu, i) => (
//           <div
//             key={i}
//             className="group/item hover:bg-slate-50/40 transition-colors duration-300"
//           >
//             <div className="flex flex-col md:flex-row p-8 gap-8">
//               {/* TIME IDENTIFIER */}
//               <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                 <span className="text-xl font-black text-slate-900 tracking-tighter">
//                   {edu?.end_year || "----"}
//                 </span>

//                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                   GRADUATION
//                 </span>
//               </div>

//               {/* CONTENT BODY */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                         {edu?.institution_name || "Unidentified Institute"}
//                       </h4>
//                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                     </div>

//                     {/* Degree Name from education_master mapping */}
//                     <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                       {edu?.education_master?.name || "Specialization Undefined"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Academic Period
//                     </span>
//                     <div className="flex items-center gap-2">
//                        <Calendar size={12} className="text-slate-300" />
//                        <span className="text-[11px] font-bold text-slate-700 uppercase">
//                         {edu?.start_year || "----"} — {edu?.end_year || "----"}
//                       </span>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       /* EMPTY STATE */
//       <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//           <GraduationCap size={28} strokeWidth={1.5} />
//         </div>
//         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//           No Academic Records
//         </h4>
//         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//           Node synchronized but education array is empty
//         </p>
//       </div>
//     )}
//   </div>
// </div>

//                 </div>
//               )}

//               {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resume</h3>
//                     </div>
//                     {employee?.resume_path ? (
//                       <ModernDocCard title="Master Curriculum Vitae" url={employee.resume_path} type="resume" formatDocUrl={formatDocUrl} />
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center"><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Resume Missing</p></div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Certificate</h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {employee?.certificates?.map((cert) => (
//                         <ModernDocCard key={cert.id} title={cert.name} url={cert.file_path} type="Certificate" formatDocUrl={formatDocUrl} icon={Award} />
//                       )) || <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">No Certificates Found</div>}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* --- ENTERPRISE MODAL PORTAL --- */}
//   {/* {showLanguageModal && (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

//       <div
//         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//         onClick={() => setShowLanguageModal(false)}
//       />

//       <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//         <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-600 rounded-lg text-white">
//               <Languages size={18} strokeWidth={2.5} />
//             </div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Update Languages</h3>
//           </div>
//           <button onClick={() => setShowLanguageModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
//             <X size={18} strokeWidth={3} />
//           </button>
//         </div>

//         <div className="p-8">
//            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
//              Modification of linguistic nodes will trigger a registry synchronization.
//            </p>

//            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[100px] flex items-center justify-center">
//               <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Protocol UI Component Pending...</p>
//            </div>

//            <button
//              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98]"
//              onClick={() => setShowLanguageModal(false)}
//            >
//              Save Registry Update
//            </button>
//         </div>
//       </div>
//     </div>
//   )} */}

//   {showLanguageModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowLanguageModal(false)} />

//     <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-600 rounded-lg text-white">
//             <Languages size={18} strokeWidth={2.5} />
//           </div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Update Languages</h3>
//         </div>
//         <button onClick={() => setShowLanguageModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
//           <X size={18} strokeWidth={3} />
//         </button>
//       </div>

//       <div className="p-8">
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">
//           Select nodes to sync with the candidate's communication stack.
//         </p>

//         {/* CHIP SELECTION GRID */}
//         <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-200">
//           {[...new Set([...DEFAULT_LANGS, ...selectedLangs])].map((lang) => {
//             const isSelected = selectedLangs.includes(lang);
//             return (
//               <button
//                 key={lang}
//                 type="button"
//                 onClick={() => {
//                   setSelectedLangs(prev =>
//                     isSelected ? prev.filter(l => l !== lang) : [...prev, lang]
//                   );
//                 }}
//                 className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 flex items-center gap-2 ${
//                   isSelected
//                     ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
//                     : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
//                 }`}
//               >
//                 {lang}
//                 {isSelected && <CheckCircle size={12} strokeWidth={3} />}
//               </button>
//             );
//           })}
//         </div>

//         <button
//           disabled={updating}
//           className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
//           onClick={handleLanguageUpdate}
//         >
//           {updating ? <Loader2 className="animate-spin" size={16} /> : <BadgeCheck size={16} />}
//           {updating ? "Synchronizing..." : "Update Linguistic Node"}
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// {/* --- MODAL: SKILL REGISTRY --- */}
// {/* {showSkillModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowSkillModal(false)} />
//     <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg"><Layers size={18} strokeWidth={2.5} /></div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Skill Matrix Sync</h3>
//         </div>
//         <button onClick={() => setShowSkillModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={18} /></button>
//       </div>
//       <div className="p-8 space-y-6">
//         <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 max-h-64 overflow-y-auto custom-scrollbar-professional">
//           {masterSkills.map((item) => {
//             const name = item.name || item;
//             const isSelected = selectedSkills.includes(name);
//             return (
//               <button key={name} type="button" onClick={() => setSelectedSkills(prev => isSelected ? prev.filter(s => s !== name) : [...prev, name])}
//                 className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"}`}
//               > {name} </button>
//             );
//           })}
//         </div>
//         <button disabled={updating} onClick={syncSkills} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />} Update Skill Registry
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

// {showSkillModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowSkillModal(false)} />

//     <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//       {/* HEADER NODE */}
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg"><Layers size={18} strokeWidth={2.5} /></div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Skill</h3>
//         </div>
//         <button onClick={() => setShowSkillModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={18} /></button>
//       </div>

//       <div className="p-8 space-y-8">
//         {/* INPUT NODE: Manual Entry */}
//         <div className="space-y-3">
//           <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Skill</label>
//           <div className="flex gap-2">
//             <input
//               value={newSkillInput}
//               onChange={(e) => setNewSkillInput(e.target.value)}
//               placeholder="Type and press Enter..."
//               className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualSkill())}
//             />
//             {/* <button type="button" onClick={addManualSkill} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Add</button> */}
//           </div>
//         </div>

//         {/* ACTIVE NODES AREA (Everything in this list will be sent to API) */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between ml-1">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Selected Skills</label>
//             <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{selectedSkills.length} Selected</span>
//           </div>
//           <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-100 min-h-[80px]">
//             {selectedSkills.length > 0 ? selectedSkills.map((skill, i) => (
//               <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black uppercase shadow-sm animate-in zoom-in-95">
//                 {skill}
//                 <X size={12} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setSelectedSkills(selectedSkills.filter((_, idx) => idx !== i))} />
//               </span>
//             )) : <p className="text-[9px] font-black text-slate-300 uppercase m-auto tracking-widest">No Skills</p>}
//           </div>
//         </div>

//         {/* MASTER REGISTRY: Quick Toggle Nodes */}
//         <div className="space-y-3 pt-4 border-t border-slate-100">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Skill History</label>
//           <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
//             {masterSkills.map((item) => {
//               const name = item.name || item;
//               const isSelected = selectedSkills.includes(name);
//               return (
//                 <button
//                   key={name}
//                   type="button"
//                   onClick={() => setSelectedSkills(prev => isSelected ? prev.filter(s => s !== name) : [...prev, name])}
//                   className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
//                     isSelected ? "bg-blue-500 border-blue-500 text-white shadow-md" : "bg-slate-50 border-slate-500 text-slate-800 hover:border-blue-200"
//                   }`}
//                 >
//                   {name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button
//           disabled={updating}
//           onClick={syncSkills}
//           className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//         >
//           {updating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
//           Save Skills
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// {/* --- MODAL: HARDWARE ASSETS --- */}
// {/* {showAssetModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !updating && setShowAssetModal(false)} />
//     <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//       <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg"><Monitor size={18} strokeWidth={2.5} /></div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Asset Allocation</h3>
//         </div>
//         <button onClick={() => setShowAssetModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={18} /></button>
//       </div>
//       <div className="p-8 space-y-8">
//         <div className="flex gap-2">
//           <input value={newAssetInput} onChange={(e) => setNewAssetInput(e.target.value)} placeholder="Type asset name (MacBook, Mouse...)" className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all"
//             onKeyDown={(e) => { if(e.key==='Enter'){ e.preventDefault(); if(newAssetInput.trim()){ setSelectedAssets([...selectedAssets, newAssetInput.trim()]); setNewAssetInput(""); } } }}
//           />
//           <button type="button" onClick={() => { if(newAssetInput.trim()){ setSelectedAssets([...selectedAssets, newAssetInput.trim()]); setNewAssetInput(""); } }} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600">Link</button>
//         </div>
//         <div className="flex flex-wrap gap-2 p-1 min-h-[100px] bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
//           {selectedAssets.length > 0 ? selectedAssets.map((asset, i) => (
//             <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase shadow-sm">
//               {asset} <X size={12} className="cursor-pointer text-slate-300 hover:text-red-500" onClick={() => setSelectedAssets(selectedAssets.filter((_, idx) => idx !== i))} />
//             </span>
//           )) : <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest m-auto">Registry Empty</span>}
//         </div>
//         <button disabled={updating} onClick={syncAssets} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
//           {updating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />} Commit Asset Changes
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

// {showAssetModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     {/* Backdrop with Glassmorphism */}
//     <div
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
//       onClick={() => !updating && setShowAssetModal(false)}
//     />

//     <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">

//       {/* 1. BRANDED HEADER */}
//       <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
//         <div className="flex items-center gap-5">
//           {/* LOGO NODE */}
//           <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform">
//             <Monitor size={24} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
//               Asset
//             </h3>
//             <div className="flex items-center gap-2 mt-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Update the assets</p>
//             </div>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowAssetModal(false)}
//           className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
//         >
//           <X size={20} strokeWidth={3} />
//         </button>
//       </div>

//       <div className="p-10 space-y-8 bg-white">
//         {/* 2. INPUT NODE */}
//         <div className="space-y-3">
//           <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] ml-1">Add Assets</label>
//           <div className="flex gap-3">
//             <div className="relative flex-1 group">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                 <Plus size={16} strokeWidth={3} />
//               </div>
//               <input
//                 value={newAssetInput}
//                 onChange={(e) => setNewAssetInput(e.target.value)}
//                 placeholder="e.g. MacBook Pro M3"
//                 className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-inner"
//                 onKeyDown={(e) => {
//                   if(e.key === 'Enter') {
//                     e.preventDefault();
//                     if(newAssetInput.trim()){
//                       setSelectedAssets([...selectedAssets, newAssetInput.trim()]);
//                       setNewAssetInput("");
//                     }
//                   }
//                 }}
//               />
//             </div>
//             {/* <button
//               type="button"
//               onClick={() => {
//                 if(newAssetInput.trim()){
//                   setSelectedAssets([...selectedAssets, newAssetInput.trim()]);
//                   setNewAssetInput("");
//                 }
//               }}
//               className="px-8 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all active:scale-95"
//             >
//               Link
//             </button> */}
//           </div>
//         </div>

//         {/* 3. ENHANCED CHIP CONTAINER (Matched to Skills Style) */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between ml-1">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Selected Assets</label>
//             <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
//               {selectedAssets.length} Allocated
//             </span>
//           </div>

//           <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[120px] items-start content-start">
//             {selectedAssets.length > 0 ? selectedAssets.map((asset, i) => (
//               <div
//                 key={i}
//                 className="group/chip flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm hover:border-blue-400 hover:shadow-md transition-all animate-in zoom-in-95"
//               >
//                 <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
//                 {asset}
//                 <button
//                   onClick={() => setSelectedAssets(selectedAssets.filter((_, idx) => idx !== i))}
//                   className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
//                 >
//                   <X size={14} strokeWidth={3} />
//                 </button>
//               </div>
//             )) : (
//               <div className="m-auto flex flex-col items-center gap-2 opacity-30">
//                 <Database size={24} strokeWidth={1.5} />
//                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registry Vacant</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 4. SUBMIT ACTION */}
//         <button
//           disabled={updating}
//           onClick={syncAssets}
//           className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
//         >
//           {updating ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} /> Commit Allocation</>}
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
//       {React.cloneElement(icon, { size: 14 })}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
//       <span className="text-sm font-bold text-slate-700 break-all">{value || "Not Specified"}</span>
//     </div>
//   </div>
// );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
//   <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//       <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />}
//       </div>
//       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h3>
//     </div>
//     <div className="relative z-10 p-6 space-y-4">{children}</div>
//     <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
//       {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}>
//     <div className="flex items-center gap-2 text-slate-400">
//       {icon}
//       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
//     </div>
//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {value ? (
//           String(value).split(',').map((skill, i) => (
//             <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter">
//               {skill.trim()}
//             </span>
//           ))
//         ) : <span className="text-[10px] text-slate-300 uppercase">Void</span>}
//       </div>
//     ) : (
//       <span className="text-xs font-black text-slate-800 uppercase">{value || "—"}</span>
//     )}
//   </div>
// );

// const ModernDocCard = ({ title, url, type, formatDocUrl, icon: CardIcon = FileText }) => (
//   <a href={formatDocUrl(url)} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm">
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{title}</p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{type}</p>
//       </div>
//     </div>
//     <ExternalLink size={16} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
//   </a>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
//     active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
//   }`}>
//     {icon} {label}
//   </button>
// );

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="relative w-16 h-16">
//         <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
//         <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//     </div>
//     <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Loading ...</p>
//   </div>
// );

// const StripDetail = ({ icon, label, value }) => (
//   <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
//     {/* ICON BRANDING BOX: Glassmorphism effect */}
//     <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
//       <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
//         {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
//       </div>
//     </div>

//     {/* DATA STACK */}
//     <div className="flex flex-col min-w-0">
//       <div className="flex items-center gap-1.5 mb-0.5">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
//           {label}
//         </span>
//         {/* Verification Dot: Hidden by default, shown on hover */}
//         <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
//           {value || "—"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
//*****************************************************working code phase 1 24/02/26************************************************************** */
//     import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   MapPin,
//   History,
//   User,
//   Briefcase,
//   GraduationCap,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
//   Fingerprint,
//   Cpu,
//   Layers,
//   Award,
//   BadgeCheck,
//   Languages
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(exp.start_date);
//       const end = exp.end_date ? new Date(exp.end_date) : new Date();
//       const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += Math.max(0, diff);
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
//   };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">Candidates</span>
//               <span>/</span>
//               <span className="text-slate-900 font-bold tracking-tight">{employee?.full_name}</span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN */}
//           {/* <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">

//                <Fingerprint className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none" size={140} />

//               <div className="flex flex-col items-center text-center relative z-10">
//                 <div className="relative group mb-6">
//                   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//                   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//                       {employee?.profile_image ? (
//                         <img
//                           src={employee.profile_image}
//                           alt={employee?.full_name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
//                           <User size={42} className="text-slate-500 mb-1" strokeWidth={1.5} />
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//                       <div className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//                   {employee?.full_name || "Unknown"}
//                 </h1>

//                 <div className="flex gap-2 mt-2">
//                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
//                       employee?.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}>
//                     {employee?.status || "Pending"}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4 border-t border-slate-50 pt-6 relative z-10">
//                 <SidebarInfo icon={<Mail size={16} />} label="System Email" value={employee?.email} />
//                 <SidebarInfo icon={<Smartphone size={16} />} label="Primary Contact" value={employee?.phone} />
//                 <SidebarInfo icon={<MapPin size={16} />} label="Geographic Node" value={`${employee?.city}, ${employee?.state}`} />
//               </div>
//             </section>
//           </div> */}

//           <div className="col-span-12 lg:col-span-4 space-y-6">
//   <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
//     {/* Decorative Background Icon */}
//     <Fingerprint className="absolute -top-6 -left-6 text-slate-50 opacity-[0.5] -rotate-12 pointer-events-none" size={140} />

//     <div className="flex flex-col items-center text-center relative z-10">
//       <div className="relative group mb-6">
//         <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
//         <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//           <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//             {employee?.profile_image ? (
//               <img
//                 src={employee.profile_image}
//                 alt={employee?.full_name}
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center relative">
//                 <User size={42} className="text-white mb-1" strokeWidth={1.5} />
//               </div>
//             )}
//           </div>
//           <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//             <div className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
//         {employee?.full_name || "Unknown"}
//       </h1>

//       {/* <div className="flex gap-2 mt-2">
//         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
//             employee?.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
//           }`}>
//           {employee?.status || "Pending"}
//         </span>
//       </div> */}
//     </div>

//     {/* DATA STACK: Left Aligned Personal Info */}
//     <div className="mt-8 space-y-5 border-t border-slate-50 pt-6 relative z-10">
//       <SidebarInfo icon={<Mail />} label=" Email" value={employee?.email} />
//       <SidebarInfo icon={<Smartphone />} label="Primary Contact" value={employee?.phone} />

//       {/* ADDED DOB & GENDER HERE */}
//       <div className="grid grid-cols-2 gap-4">
//         <SidebarInfo icon={<Calendar />} label="Birth date" value={employee?.dob} />
//         <SidebarInfo  icon={<User />} label="Gender"
//         // value={employee?.gender}
//         value={
//   employee?.gender
//     ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)
//     : ""
// }

//          />
//       </div>

//       {/* <SidebarInfo icon={<MapPin />} label="Location" value={`${employee?.city || "Not Specified"}, ${employee?.state } , ${employee?.pincode}`} /> */}
//       <SidebarInfo
//   icon={<MapPin />}
//   label="Location"
//   value={
//     [employee?.city, employee?.state, employee?.pincode]
//       .filter(val =>
//         val &&
//         val !== "null" &&
//         val !== "Not Specified" &&
//         val !== ""
//       ) // Removes null, "null" string, empty strings, and duplicates
//       .join(", ") || "Not Specified" // Joins with comma, or shows default exactly once
//   }
// />
//     </div>
//   </section>
// </div>

//           {/* RIGHT COLUMN */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Candidate Overview" icon={<Activity size={18} />} />
//               <TabButton active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Document" icon={<ShieldCheck size={18} />} />
//             </div>

//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InfoCard title="Core Identity" icon={Fingerprint}>
//                       <DetailRow label="DOB" value={employee?.dob} icon={<Calendar size={14} />} />
//                       <DetailRow label="Gender Spec" value={employee?.gender} icon={<User size={14} />} />
//                       <DetailRow label="Linguistic Stack" value={employee?.languages_spoken?.join(", ")} icon={<Languages size={14} />} />
//                     </InfoCard>

//                     <InfoCard title="Professional Stack" icon={Cpu}>
//                       <DetailRow label="Technical Skills" value={employee?.skills} icon={<Layers size={14} />} isSkills={true} />
//                       <div className="my-2 border-t border-slate-100/50" />
//                       <DetailRow label="Hardware Assets" value={employee?.assets} icon={<Monitor size={14} />} isSkills={true} />
//                     </InfoCard>
//                   </div> */}
//                   {/* MODERN INFO STRIP SECTION */}
// {/* <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">

//   <div className="group relative flex flex-wrap md:flex-nowrap items-center gap-6 bg-white border border-slate-200 p-2 pr-6 rounded-2xl transition-all hover:border-blue-200 hover:shadow-md overflow-hidden">

//     <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[180px]">
//       <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
//         <Fingerprint size={20} strokeWidth={2.5} />
//       </div>
//       <div>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Identity</h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">Core Profile</p>
//       </div>
//     </div>

//     <div className="flex flex-1 flex-wrap items-center gap-x-12 gap-y-4 px-4">
//       <StripDetail icon={<Calendar size={14} />} label="Date of Birth" value={employee?.dob} />
//       <div className="hidden md:block h-8 w-[1px] bg-slate-100" />
//       <StripDetail icon={<User size={14} />} label="Gender Spec" value={employee?.gender} />
//       <div className="hidden md:block h-8 w-[1px] bg-slate-100" />
//       <StripDetail icon={<Languages size={14} />} label="Linguistic Stack" value={employee?.languages_spoken?.join(", ")} />
//     </div>

//     <Fingerprint className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={80} />
//   </div>

//   <div className="group relative flex flex-wrap md:flex-nowrap items-center gap-6 bg-white border border-slate-200 p-2 pr-6 rounded-2xl transition-all hover:border-emerald-200 hover:shadow-md overflow-hidden">

//     <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[180px]">
//       <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <Cpu size={20} strokeWidth={2.5} />
//       </div>
//       <div>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Technology</h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">Professional Stack</p>
//       </div>
//     </div>

//     <div className="flex flex-1 flex-wrap items-center gap-8 px-4">
//       <div className="flex flex-col gap-2">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Skills</span>
//         <div className="flex flex-wrap gap-1.5">
//           {employee?.skills ? (
//             String(employee.skills).split(',').map((skill, i) => (
//               <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-black uppercase">
//                 {skill.trim()}
//               </span>
//             ))
//           ) : <span className="text-[9px] text-slate-300 italic">None Logged</span>}
//         </div>
//       </div>

//       <div className="hidden md:block h-10 w-[1px] bg-slate-100" />

//       <div className="flex flex-col gap-2">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Assets</span>
//         <div className="flex flex-wrap gap-1.5">
//           {employee?.assets ? (
//             String(employee.assets).split(',').map((asset, i) => (
//               <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase">
//                 {asset.trim()}
//               </span>
//             ))
//           ) : <span className="text-[9px] text-slate-300 italic">No Assets Assigned</span>}
//         </div>
//       </div>
//     </div>

//     <Cpu className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={80} />
//   </div>
// </div> */}

// <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

//   {/* FRAME 1: LINGUISTIC & COMMUNICATION NODE */}
//   <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
//     {/* Decorative Security Pattern Header */}
//     <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

//     <div className="flex flex-col md:flex-row items-stretch">
//       {/* Branding Box (Left) */}
//       <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//         <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
//           <Languages size={24} strokeWidth={1.5} />
//         </div>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Language</h3>
//         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Spoken</p>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 p-6 flex items-center">
//         <div className="space-y-3 w-full">
//           <div className="flex items-center gap-2">
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Languages</span>
//             <div className="h-[1px] flex-1 bg-slate-100" />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {employee?.languages_spoken?.length > 0 ? (
//               employee.languages_spoken.map((lang, i) => (
//                 <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
//                   <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-[11px] font-black text-slate-700 uppercase">{lang}</span>
//                 </div>
//               ))
//             ) : (
//               <span className="text-xs text-slate-400 italic font-medium">No language data</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//     <Globe className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none" size={120} />
//   </div>

//   {/* FRAME 2: PROFESSIONAL CAPABILITIES & ASSET AUDIT */}
//   <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5">
//     <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />

//     <div className="flex flex-col md:flex-row items-stretch">
//       {/* Branding Box (Left) */}
//       <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
//         <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-center text-white mb-3 group-hover:rotate-12 transition-transform">
//           <Cpu size={24} strokeWidth={1.5} />
//         </div>
//         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Assets & Skill</h3>
//         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1">Assets & Skills Data</p>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Skills Subsection */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Layers size={14} className="text-blue-500" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {employee?.skills ? (
//               String(employee.skills).split(',').map((skill, i) => (
//                 <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default">
//                   {skill.trim()}
//                 </span>
//               ))
//             ) : <span className="text-[9px] text-slate-300 uppercase">Empty Set</span>}
//           </div>
//         </div>

//         {/* Assets Subsection */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Monitor size={14} className="text-blue-500" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assets</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {employee?.assets ? (
//               String(employee.assets).split(',').map((asset, i) => (
//                 <span key={i} className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight">
//                   {asset.trim()}
//                 </span>
//               ))
//             ) : <span className="text-[9px] text-slate-300 uppercase">No Assets Logged</span>}
//           </div>
//         </div>
//       </div>
//     </div>
//     <Layers className="absolute -right-6 -bottom-6 text-slate-900 opacity-[0.03] rotate-12 pointer-events-none" size={120} />
//   </div>

// </div>

//                   {/* EXPERIENCE SECTION */}
//                   {/* <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
//                     <History className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none" size={200} />
//                     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
//                           <History size={20} strokeWidth={2.5} />
//                         </div>
//                         <div>
//                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Experience History</h3>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Experience Logs</p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tenure</span>
//                         <span className="text-[11px] font-black text-blue-600 uppercase">{calculateTotalExperience(employee?.experiences)}</span>
//                       </div>
//                     </div>

//                     <div className="relative z-10">
//                       {employee?.experiences?.length > 0 ? (
//                         <div className="divide-y divide-slate-100">
//                           {employee.experiences.map((exp, i) => (
//                             <div key={i} className="group hover:bg-slate-50/40 transition-colors p-8">
//                               <div className="flex flex-col md:flex-row gap-8">
//                                 <div className="md:w-32">
//                                   <span className="text-xl font-black text-slate-900 tracking-tighter block">
//                                     {exp?.start_date ? new Date(exp.start_date).getFullYear() : "----"}
//                                   </span>
//                                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Experience</span>
//                                 </div>
//                                 <div className="flex-1 space-y-4">
//                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div>
//                                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{exp?.company_name || "Unidentified Entity"}</h4>
//                                       <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">{exp?.job_title || "Role Undefined"}</p>
//                                     </div>
//                                     {exp?.experience_letter_path && (
//                                       <a href={formatDocUrl(exp.experience_letter_path)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
//                                         <FileText size={14} className="text-slate-400" /> View <ExternalLink size={10} />
//                                       </a>
//                                     )}
//                                   </div>
//                                   <div className="flex gap-10">
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Previous CTC</span>
//                                       <span className="text-[11px] font-bold text-slate-700">₹{exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "N/A"}</span>
//                                     </div>
//                                     <div className="flex flex-col">
//                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
//                                       <span className="text-[11px] font-bold text-slate-700 uppercase">{new Date(exp.start_date).toLocaleDateString('en-IN', {month:'short', year:'numeric'})} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-IN', {month:'short', year:'numeric'}) : 'Present'}</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="py-20 flex flex-col items-center opacity-50"><Database size={40} className="mb-4 text-slate-200" /><p className="text-[10px] font-black uppercase tracking-widest">No Historical Data</p></div>
//                       )}
//                     </div>
//                   </div> */}
//                                    {/* <div>
//                         <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
//                         <History
//                             className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none"
//                             size={200}
//                         />

//                         <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//                             <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//                                 <History size={18} strokeWidth={2.5} />
//                             </div>

//                             <div>
//                                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//                                 Candidate
//                                 </h3>
//                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                                 Previous History
//                                 </p>
//                             </div>
//                             </div>

//                             <div className="flex items-center gap-3">
//                             <div className="flex flex-col items-end">
//                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                                 Total Experiance
//                                 </span>
//                                 <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//                                 {calculateTotalExperience(employee?.experiences)}
//                                 </span>
//                             </div>

//                             <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//                             <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
//                                 Active Stream
//                                 </span>
//                             </div>
//                             </div>
//                         </div>

//                         <div className="relative z-10">
//                             {employee?.experiences &&
//                             employee.experiences.length > 0 ? (
//                             <div className="divide-y divide-slate-100">
//                                 {employee.experiences.map((exp, i) => (
//                                 <div
//                                     key={i}
//                                     className="group hover:bg-slate-50/40 transition-colors duration-300"
//                                 >
//                                     <div className="flex flex-col md:flex-row p-8 gap-8">

//                                     <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                                         <span className="text-xl font-black text-slate-900 tracking-tighter">
//                                         {exp?.start_date
//                                             ? new Date(exp.start_date).getFullYear()
//                                             : "----"}
//                                         </span>

//                                         <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                                         {exp?.start_date
//                                             ? new Date(
//                                                 exp.start_date,
//                                             ).toLocaleDateString("en-IN", {
//                                                 month: "short",
//                                             })
//                                             : "---"}{" "}
//                                         DEPLOYMENT
//                                         </span>
//                                     </div>

//                                     <div className="flex-1 space-y-4">
//                                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                         <div>
//                                             <div className="flex items-center gap-2 mb-1">
//                                             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                                                 {exp?.company_name ||
//                                                 "Unidentified Entity"}
//                                             </h4>
//                                             <span className="h-1 w-1 rounded-full bg-slate-300" />
//                                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                                 {exp?.location || "Global Node"}
//                                             </span>
//                                             </div>

//                                             <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                                             {exp?.job_title || "Role Undefined"}
//                                             </p>
//                                         </div>

//                                         {exp?.experience_letter_path && (
//                                             <a
//                                             href={formatDocUrl(
//                                                 exp.experience_letter_path,
//                                             )}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                                             >
//                                             <FileText
//                                                 size={14}
//                                                 className="text-slate-400 group-hover/artifact:text-blue-500"
//                                             />
//                                             Experience Letter
//                                             <ExternalLink
//                                                 size={10}
//                                                 className="opacity-40"
//                                             />
//                                             </a>
//                                         )}
//                                         </div>

//                                         <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                                         <div className="flex flex-col">
//                                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                             Previous CTC
//                                             </span>

//                                             <div className="flex items-center gap-1.5">
//                                             <span className="text-blue-600 font-black text-[10px]">
//                                                 ₹
//                                             </span>
//                                             <span className="text-[11px] font-bold text-slate-700">
//                                                 {exp?.previous_ctc
//                                                 ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                                                 : "Not Logged"}
//                                             </span>
//                                             </div>
//                                         </div>

//                                         <div className="flex flex-col">
//                                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                             Duration
//                                             </span>

//                                             <span className="text-[11px] font-bold text-slate-700 uppercase">
//                                             {exp?.start_date
//                                                 ? new Date(
//                                                     exp.start_date,
//                                                 ).toLocaleDateString("en-IN", {
//                                                     month: "short",
//                                                     year: "numeric",
//                                                 })
//                                                 : "---"}{" "}
//                                             -{" "}
//                                             {exp?.end_date
//                                                 ? new Date(
//                                                     exp.end_date,
//                                                 ).toLocaleDateString("en-IN", {
//                                                     month: "short",
//                                                     year: "numeric",
//                                                 })
//                                                 : "Present"}
//                                             </span>
//                                         </div>
//                                         </div>

//                                         {exp?.description && (
//                                         <div className="max-w-3xl">
//                                             <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                                             "{exp.description}"
//                                             </p>
//                                         </div>
//                                         )}
//                                     </div>
//                                     </div>
//                                 </div>
//                                 ))}
//                             </div>
//                             ) : (
//                             <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//                                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//                                 <Database size={28} strokeWidth={1.5} />
//                                 </div>

//                                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//                                 Fresher Profile
//                                 </h4>

//                                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                                 No prior professional experience recorded
//                                 </p>
//                             </div>
//                             )}
//                         </div>
//                         </div>
//                     </div> */}

//                     <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/history">

//   {/* SYSTEM WATERMARK: Large rotated background icon */}
//   <History
//     className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/history:rotate-0 group-hover/history:scale-110"
//     size={260}
//     strokeWidth={1}
//   />

//   {/* HEADER SECTION */}
//   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//     <div className="flex items-center gap-3">
//       <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <History size={18} strokeWidth={2.5} />
//       </div>

//       <div>
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//           Candidate
//         </h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//           Previous Job History
//         </p>
//       </div>
//     </div>

//     {/* TENURE COUNTER */}
//     <div className="flex items-center gap-3">
//       <div className="flex flex-col items-end">
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//           Total Experience
//         </span>
//         <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//           {calculateTotalExperience(employee?.experiences)}
//         </span>
//       </div>

//       <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//          {/* EDIT BUTTON */}
//   <button
//     type="button"
// onClick={() => navigate(`/editentry/${id}?step=4`)}
//     className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//   >
//     <Edit3 size={12} strokeWidth={3} />
//     Edit
//   </button>
//       </div>
//     </div>
//   </div>

//   {/* BODY CONTENT */}
//   <div className="relative z-10">
//     {employee?.experiences && employee.experiences.length > 0 ? (
//       <div className="divide-y divide-slate-100">
//         {employee.experiences.map((exp, i) => (
//           <div
//             key={i}
//             className="group hover:bg-slate-50/40 transition-colors duration-300"
//           >
//             <div className="flex flex-col md:flex-row p-8 gap-8">
//               {/* TIME IDENTIFIER */}
//               <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                 <span className="text-xl font-black text-slate-900 tracking-tighter">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).getFullYear()
//                     : "----"}
//                 </span>

//                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                         month: "short",
//                       })
//                     : "---"}{" "}
//                   DEPLOYMENT
//                 </span>
//               </div>

//               {/* CONTENT BODY */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                         {exp?.company_name || "Unidentified Entity"}
//                       </h4>
//                       <span className="h-1 w-1 rounded-full bg-slate-300" />
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                         {exp?.location || "Global Node"}
//                       </span>
//                     </div>

//                     <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                       {exp?.job_title || "Role Undefined"}
//                     </p>
//                   </div>

//                   {exp?.experience_letter_path && (
//                     <a
//                       href={formatDocUrl(exp.experience_letter_path)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                     >
//                       <FileText
//                         size={14}
//                         className="text-slate-400 group-hover/artifact:text-blue-500"
//                       />
//                       Experience Letter
//                       <ExternalLink size={10} className="opacity-40" />
//                     </a>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Previous CTC
//                     </span>
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-blue-600 font-black text-[10px]">
//                         ₹
//                       </span>
//                       <span className="text-[11px] font-bold text-slate-700">
//                         {exp?.previous_ctc
//                           ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                           : "Not Logged"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Duration
//                     </span>
//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                       {exp?.start_date
//                         ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "---"}{" "}
//                       -{" "}
//                       {exp?.end_date
//                         ? new Date(exp.end_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "Present"}
//                     </span>
//                   </div>
//                 </div>

//                 {exp?.description && (
//                   <div className="max-w-3xl">
//                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                       "{exp.description}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//           <Database size={28} strokeWidth={1.5} />
//         </div>
//         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//           Fresher Profile
//         </h4>
//         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//           No prior professional experience recorded
//         </p>
//       </div>
//     )}
//   </div>
// </div>

// {/* EDUCATION HISTORY: SYSTEM STREAM */}
// <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group/edu">
//   {/* SYSTEM WATERMARK */}
//   <Award
//     className="absolute -right-12 -top-12 text-slate-900 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover/edu:rotate-0 group-hover/edu:scale-110"
//     size={260}
//     strokeWidth={1}
//   />

//   {/* HEADER SECTION */}
//   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//     <div className="flex items-center gap-3">
//       <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <Award size={18} strokeWidth={2.5} />
//       </div>

//       <div>
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//           Academic History
//         </h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//            Education History
//         </p>
//       </div>
//     </div>

//     {/* EDIT REDIRECT */}
//     <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//       <button
//         type="button"
//         onClick={() => navigate(`/editentry/${id}?step=3`)}
//         className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition"
//       >
//         <Edit3 size={12} strokeWidth={3} />
//         Edit Nodes
//       </button>
//     </div>
//   </div>

//   {/* BODY CONTENT */}
//   <div className="relative z-10">
//     {employee?.educations && employee.educations.length > 0 ? (
//       <div className="divide-y divide-slate-100">
//         {employee.educations.map((edu, i) => (
//           <div
//             key={i}
//             className="group/item hover:bg-slate-50/40 transition-colors duration-300"
//           >
//             <div className="flex flex-col md:flex-row p-8 gap-8">
//               {/* TIME IDENTIFIER */}
//               <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                 <span className="text-xl font-black text-slate-900 tracking-tighter">
//                   {edu?.end_year || "----"}
//                 </span>

//                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                   GRADUATION
//                 </span>
//               </div>

//               {/* CONTENT BODY */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                         {edu?.institution_name || "Unidentified Institute"}
//                       </h4>
//                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//                     </div>

//                     {/* Degree Name from education_master mapping */}
//                     <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-black uppercase tracking-[0.1em]">
//                       {edu?.education_master?.name || "Specialization Undefined"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-x-10 gap-y-2 pt-2">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Academic Period
//                     </span>
//                     <div className="flex items-center gap-2">
//                        <Calendar size={12} className="text-slate-300" />
//                        <span className="text-[11px] font-bold text-slate-700 uppercase">
//                         {edu?.start_year || "----"} — {edu?.end_year || "----"}
//                       </span>
//                     </div>
//                   </div>
// {/*
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Verification Status
//                     </span>
//                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
//                       <BadgeCheck size={12} /> Registry Confirmed
//                     </span>
//                   </div> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       /* EMPTY STATE */
//       <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//           <GraduationCap size={28} strokeWidth={1.5} />
//         </div>
//         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//           No Academic Records
//         </h4>
//         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//           Node synchronized but education array is empty
//         </p>
//       </div>
//     )}
//   </div>
// </div>

//                 </div>
//               )}

//               {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resume</h3>
//                     </div>
//                     {employee?.resume_path ? (
//                       <ModernDocCard title="Master Curriculum Vitae" url={employee.resume_path} type="resume" formatDocUrl={formatDocUrl} />
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center"><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Resume Missing</p></div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                       <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
//                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Certificate</h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {employee?.certificates?.map((cert) => (
//                         <ModernDocCard key={cert.id} title={cert.name} url={cert.file_path} type="Certificate" formatDocUrl={formatDocUrl} icon={Award} />
//                       )) || <div className="col-span-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">No Certificates Found</div>}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS - STYLED FOR ENTERPRISE */

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
//       {React.cloneElement(icon, { size: 14 })}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
//       <span className="text-sm font-bold text-slate-700 break-all">{value || "Not Specified"}</span>
//     </div>
//   </div>
// );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
//   <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//       <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && <HeaderIcon size={16} className="text-blue-600" strokeWidth={2.5} />}
//       </div>
//       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h3>
//     </div>
//     <div className="relative z-10 p-6 space-y-4">{children}</div>
//     <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none">
//       {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-1`}>
//     <div className="flex items-center gap-2 text-slate-400">
//       {icon}
//       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
//     </div>
//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {value ? (
//           String(value).split(',').map((skill, i) => (
//             <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-black uppercase tracking-tighter">
//               {skill.trim()}
//             </span>
//           ))
//         ) : <span className="text-[10px] text-slate-300 uppercase">Void</span>}
//       </div>
//     ) : (
//       <span className="text-xs font-black text-slate-800 uppercase">{value || "—"}</span>
//     )}
//   </div>
// );

// const ModernDocCard = ({ title, url, type, formatDocUrl, icon: CardIcon = FileText }) => (
//   <a href={formatDocUrl(url)} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all group shadow-sm">
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
//         <CardIcon size={20} />
//       </div>
//       <div>
//         <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{title}</p>
//         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{type}</p>
//       </div>
//     </div>
//     <ExternalLink size={16} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
//   </a>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
//     active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
//   }`}>
//     {icon} {label}
//   </button>
// );

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="relative w-16 h-16">
//         <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
//         <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//     </div>
//     <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing System Nodes...</p>
//   </div>
// );

// const StripDetail = ({ icon, label, value }) => (
//   <div className="group/detail flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50/80">
//     {/* ICON BRANDING BOX: Glassmorphism effect */}
//     <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm transition-all duration-300 group-hover/detail:border-blue-200 group-hover/detail:shadow-blue-100/50 group-hover/detail:scale-110">
//       <div className="text-slate-400 group-hover/detail:text-blue-600 transition-colors duration-300">
//         {React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}
//       </div>
//     </div>

//     {/* DATA STACK */}
//     <div className="flex flex-col min-w-0">
//       <div className="flex items-center gap-1.5 mb-0.5">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
//           {label}
//         </span>
//         {/* Verification Dot: Hidden by default, shown on hover */}
//         <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover/detail:opacity-100 transition-opacity" />
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
//           {value || "—"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
//*******************************************************working code phase 2 19/02/26******************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
// ArrowLeft,
// Mail,
// Smartphone,
// Monitor,
// FileCheck,
// FileText,
// Activity,
// Database,
// ShieldCheck,
// MapPin,
// History,
// User,
// Briefcase,
// ExternalLink,
// Calendar,
// Globe,
// Shield,
// Download,
// MoreVertical,
// Edit3,
// } from "lucide-react";

// const CandidateProfilePage = () => {
// const { id } = useParams();
// const navigate = useNavigate();
// const [employee, setEmployee] = useState(null);
// const [loading, setLoading] = useState(true);
// const [activeTab, setActiveTab] = useState("overview");

// useEffect(() => {
//     const fetchProfile = async () => {
//     try {
//         setLoading(true);
//         const res = await fetch(
//         `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//     } catch (err) {
//         console.error("Profile Load Error", err);
//     } finally {
//         setLoading(false);
//     }
//     };
//     fetchProfile();
// }, [id]);

// const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     // This removes everything before 'uploads/' and adds your new base URL
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
// };

// const calculateTotalExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "0 Months";

//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//     const start = new Date(exp.start_date);
//     const end = exp.end_date ? new Date(exp.end_date) : new Date(); // Defaults to today if no end_date
//     const diff =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//     totalMonths += Math.max(0, diff);
//     });

//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;

//     if (years === 0) return `${months} Months`;
//     return `${years} Year${years > 1 ? "s" : ""} ${months > 0 ? `& ${months} Month${months > 1 ? "s" : ""}` : ""}`;
// };

// if (loading) return <LoadingSkeleton />;

// return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//     {/* TOP NAVIGATION BAR */}
//     <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//             <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//             <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//             <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//             </span>
//             <span>/</span>
//             <span className="text-slate-900">{employee?.full_name}</span>
//             </nav>
//         </div>
//         </div>
//     </header>

//     <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//         {/* LEFT COLUMN: IDENTITY CARD */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//             <div className="flex flex-col items-center text-center">
//                 <div className="relative group mb-6">
//                 {/* External Soft Glow Layer */}
//                 <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>

//                 {/* Main Avatar Container */}
//                 <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//                     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
//                     {employee?.profile_image ? (
//                         <img
//                         src={employee.profile_image}
//                         alt={employee?.full_name}
//                         loading="lazy"
//                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                         onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//                         }}
//                         />
//                     ) : (
//                         /* FALLBACK: Enterprise Personnel Icon */
//                         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
//                         <User
//                             size={42}
//                             className="text-slate-500 mb-1"
//                             strokeWidth={1.5}
//                         />
//                         <div className="absolute bottom-3 flex gap-1">
//                             <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
//                             <div className="h-1 w-1 rounded-full bg-blue-500/40" />
//                             <div className="h-1 w-1 rounded-full bg-blue-500/20" />
//                         </div>
//                         </div>
//                     )}

//                     {/* Decorative Overlay for a "Digital ID" feel */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                     </div>

//                     {/* Verification Badge (System Active) */}
//                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//                     <div className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
//                     </div>
//                     </div>
//                 </div>
//                 </div>
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
//                 {employee?.full_name
//                     ? employee.full_name.charAt(0).toUpperCase() +
//                     employee.full_name.slice(1)
//                     : "Unkown"}
//                 </h1>

//                 <div className="flex gap-2 mt-2">
//                 <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
//                     employee?.status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                         : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}
//                 >
//                     {employee?.status || "Pending"}
//                 </span>
//                 </div>
//             </div>

//             <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
//                 <SidebarInfo
//                 icon={<Mail size={16} />}
//                 label="Email"
//                 value={employee?.email}
//                 />
//                 <SidebarInfo
//                 icon={<Smartphone size={16} />}
//                 label="Phone"
//                 value={employee?.phone}
//                 />
//                 <SidebarInfo
//                 icon={<MapPin size={16} />}
//                 label="Location"
//                 value={`${employee?.city}, ${employee?.state}, ${employee?.district} , ${employee?.pincode}`}
//                 />
//             </div>
//             </section>
//         </div>

//         {/* RIGHT COLUMN: TABS AND CONTENT */}
//         <div className="col-span-12 lg:col-span-8">
//             {/* TAB SELECTOR */}
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//             <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="General Overview"
//                 icon={<Activity size={18} />}
//             />

//             <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Documentation"
//                 icon={<FileCheck size={18} />}
//             />
//             </div>

//             {/* TAB CONTENT */}
//             <div className="min-h-[400px]">
//             {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <InfoCard title="Personal Information">
//                     <DetailRow
//                         label="Date of Birth"
//                         value={employee?.dob}
//                         icon={<Calendar size={14} />}
//                     />
//                     <DetailRow
//                         label="Gender "
//                         value={employee?.gender}
//                         icon={<Shield size={14} />}
//                     />
//                     <DetailRow
//                         label="language"
//                         value={employee?.languages_spoken?.join(", ")}
//                         icon={<Globe size={14} />}
//                     />
//                     </InfoCard>

//                     <InfoCard title="Professional Information">
//                     <DetailRow
//                         label="Skill"
//                         value={employee?.skills || "-"}
//                         icon={<Briefcase size={14} />}
//                         isSkills={true}
//                     />

//                     <div className="my-4 border-t border-slate-50" />

//                     <DetailRow
//                         label="Assets"
//                         value={employee?.assets || "-"}
//                         icon={<Shield size={14} />}
//                         isSkills={true}
//                     />
//                     </InfoCard>
//                 </div>

// <div>
//     <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative">
//     <History
//         className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none"
//         size={200}
//     />

//     <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//         <div className="flex items-center gap-3">
//         <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//             <History size={18} strokeWidth={2.5} />
//         </div>

//         <div>
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//             Candidate
//             </h3>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//             Previous History
//             </p>
//         </div>
//         </div>

//         {/* TENURE COUNTER */}
//         <div className="flex items-center gap-3">
//         <div className="flex flex-col items-end">
//             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//             Total Experiance
//             </span>
//             <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//             {calculateTotalExperience(employee?.experiences)}
//             </span>
//         </div>

//         <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//         <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
//             Active Stream
//             </span>
//         </div>
//         </div>
//     </div>

//     {/* BODY */}
//     <div className="relative z-10">
//         {employee?.experiences &&
//         employee.experiences.length > 0 ? (
//         <div className="divide-y divide-slate-100">
//             {employee.experiences.map((exp, i) => (
//             <div
//                 key={i}
//                 className="group hover:bg-slate-50/40 transition-colors duration-300"
//             >
//                 <div className="flex flex-col md:flex-row p-8 gap-8">
//                 {/* TIME IDENTIFIER */}
//                 <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                     <span className="text-xl font-black text-slate-900 tracking-tighter">
//                     {exp?.start_date
//                         ? new Date(exp.start_date).getFullYear()
//                         : "----"}
//                     </span>

//                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                     {exp?.start_date
//                         ? new Date(
//                             exp.start_date,
//                         ).toLocaleDateString("en-IN", {
//                             month: "short",
//                         })
//                         : "---"}{" "}
//                     DEPLOYMENT
//                     </span>
//                 </div>

//                 {/* CONTENT BODY */}
//                 <div className="flex-1 space-y-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                     <div>
//                         <div className="flex items-center gap-2 mb-1">
//                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                             {exp?.company_name ||
//                             "Unidentified Entity"}
//                         </h4>
//                         <span className="h-1 w-1 rounded-full bg-slate-300" />
//                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                             {exp?.location || "Global Node"}
//                         </span>
//                         </div>

//                         <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                         {exp?.job_title || "Role Undefined"}
//                         </p>
//                     </div>

//                     {exp?.experience_letter_path && (
//                         <a
//                         href={formatDocUrl(
//                             exp.experience_letter_path,
//                         )}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                         >
//                         <FileText
//                             size={14}
//                             className="text-slate-400 group-hover/artifact:text-blue-500"
//                         />
//                         Experience Letter
//                         <ExternalLink
//                             size={10}
//                             className="opacity-40"
//                         />
//                         </a>
//                     )}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                     <div className="flex flex-col">
//                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                         Previous CTC
//                         </span>

//                         <div className="flex items-center gap-1.5">
//                         <span className="text-blue-600 font-black text-[10px]">
//                             ₹
//                         </span>
//                         <span className="text-[11px] font-bold text-slate-700">
//                             {exp?.previous_ctc
//                             ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                             : "Not Logged"}
//                         </span>
//                         </div>
//                     </div>

//                     <div className="flex flex-col">
//                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                         Duration
//                         </span>

//                         <span className="text-[11px] font-bold text-slate-700 uppercase">
//                         {exp?.start_date
//                             ? new Date(
//                                 exp.start_date,
//                             ).toLocaleDateString("en-IN", {
//                                 month: "short",
//                                 year: "numeric",
//                             })
//                             : "---"}{" "}
//                         -{" "}
//                         {exp?.end_date
//                             ? new Date(
//                                 exp.end_date,
//                             ).toLocaleDateString("en-IN", {
//                                 month: "short",
//                                 year: "numeric",
//                             })
//                             : "Present"}
//                         </span>
//                     </div>
//                     </div>

//                     {exp?.description && (
//                     <div className="max-w-3xl">
//                         <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                         "{exp.description}"
//                         </p>
//                     </div>
//                     )}
//                 </div>
//                 </div>
//             </div>
//             ))}
//         </div>
//         ) : (
//         <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//             <Database size={28} strokeWidth={1.5} />
//             </div>

//             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//             Fresher Profile
//             </h4>

//             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//             No prior professional experience recorded
//             </p>
//         </div>
//         )}
//     </div>
//     </div>
// </div>
//                 </div>
//             )}

//             {activeTab === "vault" && (
//                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 {/* SECTION 1: MASTER IDENTITY DOCUMENTS */}
//                 <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                     <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Master Identity Node
//                     </h3>
//                     </div>

//                     {employee?.resume_path ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <ModernDocCard
//                         title="Candidate Resume"
//                         url={employee.resume_path}
//                         type="employee"
//                         formatDocUrl={formatDocUrl}
//                         />
//                     </div>
//                     ) : (
//                     <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                         Resume not updated
//                         </p>
//                     </div>
//                     )}
//                 </div>

//                 {/* SECTION 3: ACADEMIC & SKILL CERTIFICATIONS */}
//                 <div className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                     <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Certifications
//                     </h3>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {employee?.certificates?.length > 0 ? (
//                         employee.certificates.map((cert) => (
//                         <ModernDocCard
//                             key={cert.id}
//                             title={cert.name}
//                             url={cert.file_path}
//                             type="COMPLIANCE_CERT"
//                             formatDocUrl={formatDocUrl}
//                         />
//                         ))
//                     ) : (
//                         <div className="col-span-full p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                             No External Credentials Found
//                         </p>
//                         </div>
//                     )}
//                     </div>
//                 </div>

//                 {/* SYSTEM FOOTER WATERMARK */}
//                 <div className="pt-10 border-t border-slate-100 flex justify-center">
//                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
//                     <ShieldCheck size={12} className="text-slate-400" />
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
//                         Encrypted Artifact Vault v4.2.0
//                     </span>
//                     </div>
//                 </div>
//                 </div>
//             )}
//             </div>
//         </div>
//         </div>
//     </main>
//     </div>
// );
// };

// /* REUSABLE SUB-COMPONENTS */

// const LoadingSkeleton = () => (
// <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
//     <p className="text-sm font-medium text-slate-500 animate-pulse">
//     Initializing Candidate Data...
//     </p>
// </div>
// );

// const SidebarInfo = ({ icon, label, value }) => (
// <div className="flex items-center gap-4 group">
//     <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
//     {icon}
//     </div>
//     <div className="flex flex-col">
//     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//     </span>
//     <span className="text-sm font-semibold text-slate-700 break-all">
//         {value || "Not provided"}
//     </span>
//     </div>
// </div>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
// <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 ${
//     active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-500 hover:text-slate-700"
//     }`}
// >
//     {icon} {label}
// </button>
// );

// // const InfoCard = ({ title, children }) => (
// //   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
// //     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
// //       <h3 className="text-sm font-bold text-slate-800 capitalize tracking-tight">
// //         {title}
// //       </h3>
// //     </div>
// //     <div className="p-6 space-y-4">{children}</div>
// //   </div>
// // );

// const InfoCard = ({ title, children, icon: HeaderIcon }) => (
// <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
//     {/* Header Section */}
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
//     <div className="p-1.5 bg-blue-50 rounded-lg">
//         {HeaderIcon && <HeaderIcon size={16} className="text-blue-600" strokeWidth={2} />}
//     </div>
//     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
//         {title}
//     </h3>
//     </div>

//     {/* Content Area */}
//     <div className="relative z-10 p-6 space-y-5">
//     {children}
//     </div>

//     {/* Branding/Security Watermark */}
//     <div className="absolute -bottom-6 -right-6 opacity-[0.04] text-slate-900 pointer-events-none">
//     {HeaderIcon && <HeaderIcon size={120} strokeWidth={1} />}
//     </div>
// </div>
// );

// /* UPDATED COMPONENT */
// const ModernDocCard = ({ title, url, type, formatDocUrl }) => {
// // Apply the URL transformation here
// const formattedUrl = formatDocUrl(url);

// return (
//     <a
//     href={formattedUrl}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
//     >
//     <div className="flex items-center gap-4">
//         <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//         <FileText size={20} />
//         </div>
//         <div>
//         <p className="text-sm font-bold text-slate-800">{title}</p>
//         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
//             {type}
//         </p>
//         </div>
//     </div>
//     <div className="flex items-center gap-2">
//         <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
//         View Document
//         </span>
//         <ExternalLink
//         size={16}
//         className="text-slate-300 group-hover:text-blue-600"
//         />
//     </div>
//     </a>
// );
// };

// const EmptyState = ({ message }) => (
// <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
//     <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
//     <Shield size={32} />
//     </div>
//     <p className="text-slate-500 text-sm font-medium">{message}</p>
// </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
// <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-2`}
// >
//     <div className="flex items-center gap-2 text-slate-500">
//     {icon}
//     <span className="text-[11px] font-semibold uppercase tracking-wider">
//         {label}
//     </span>
//     </div>

//     {isSkills ? (
//     <div className="flex flex-wrap gap-2">
//         {Array.isArray(value) && value.length > 0 ? (
//         value.map((skill, i) => (
//             <span
//             key={i}
//             className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
//             >
//             {skill}
//             </span>
//         ))
//         ) : (
//         <span className="text-xs text-slate-400 italic">
//             No skills listed
//         </span>
//         )}
//     </div>
//     ) : (
//     <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
//     )}
// </div>
// );

// export default CandidateProfilePage;
//***********************************************working phase 1 19/02/26**************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   Database,
//   ShieldCheck,
//   MapPin,
//   History,
//   User,
//   Briefcase,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     // This removes everything before 'uploads/' and adds your new base URL
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   const calculateTotalExperience = (experiences) => {
//   if (!experiences || experiences.length === 0) return "0 Months";

//   let totalMonths = 0;
//   experiences.forEach(exp => {
//     const start = new Date(exp.start_date);
//     const end = exp.end_date ? new Date(exp.end_date) : new Date(); // Defaults to today if no end_date
//     const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
//     totalMonths += Math.max(0, diff);
//   });

//   const years = Math.floor(totalMonths / 12);
//   const months = totalMonths % 12;

//   if (years === 0) return `${months} Months`;
//   return `${years} Year${years > 1 ? 's' : ''} ${months > 0 ? `& ${months} Month${months > 1 ? 's' : ''}` : ''}`;
// };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       {/* TOP NAVIGATION BAR */}
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900">{employee?.full_name}</span>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN: IDENTITY CARD */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//               <div className="flex flex-col items-center text-center">
//                <div className="relative group mb-6">
//   {/* External Soft Glow Layer */}
//   <div className="absolute -inset-2 bg-slate-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>

//   {/* Main Avatar Container */}
//   <div className="relative w-28 h-28 bg-white p-1 rounded-[2.2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
//     <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">

//       {employee?.profile_image ? (
//         <img
//           src={employee.profile_image}
//           alt={employee?.full_name}
//           loading="lazy"
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name)}&background=0f172a&color=fff&bold=true&size=128`;
//           }}
//         />
//       ) : (
//         /* FALLBACK: Enterprise Personnel Icon */
//         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
//           <User size={42} className="text-slate-500 mb-1" strokeWidth={1.5} />
//           <div className="absolute bottom-3 flex gap-1">
//             <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
//             <div className="h-1 w-1 rounded-full bg-blue-500/40" />
//             <div className="h-1 w-1 rounded-full bg-blue-500/20" />
//           </div>
//         </div>
//       )}

//       {/* Decorative Overlay for a "Digital ID" feel */}
//       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//     </div>

//     {/* Verification Badge (System Active) */}
//     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
//       <div className="relative flex h-2.5 w-2.5">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
//       </div>
//     </div>
//   </div>
// </div>
//                 {/* <h1 className="text-2xl font-bold text-slate-900 leading-tight">
//                   {employee?.full_name}
//                 </h1> */}
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
//   {employee?.full_name
//     ? employee.full_name.charAt(0).toUpperCase() + employee.full_name.slice(1)
//     : "Unkown"}
// </h1>
//                 {/* <p className="text-slate-500 font-medium mb-4">
//                   {employee?.position || "Position not set"}
//                 </p> */}
//                 <div className="flex gap-2 mt-2">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
//                       employee?.status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                         : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}
//                   >
//                     {employee?.status || "Pending"}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
//                 <SidebarInfo
//                   icon={<Mail size={16} />}
//                   label="Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone size={16} />}
//                   label="Phone"
//                   value={employee?.phone}
//                 />
//                 <SidebarInfo
//                   icon={<MapPin size={16} />}
//                   label="Location"
//                   value={`${employee?.city}, ${employee?.state}, ${employee?.district} , ${employee?.pincode}`}
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN: TABS AND CONTENT */}
//           <div className="col-span-12 lg:col-span-8">
//             {/* TAB SELECTOR */}
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="General Overview"
//                 icon={<Activity size={18} />}
//               />

//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Documentation"
//                 icon={<FileCheck size={18} />}
//               />
//             </div>

//             {/* TAB CONTENT */}
//             <div className="min-h-[400px]">
//               {/* {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InfoCard title="Personal Details">
//                       <DetailRow
//                         label="Date of Birth"
//                         value={employee?.dob}
//                         icon={<Calendar size={14} />}
//                       />
//                       <DetailRow
//                         label="Gender"
//                         value={employee?.gender}
//                         icon={<Shield size={14} />}
//                       />
//                       <DetailRow
//                         label="Languages"
//                         value={employee?.languages_spoken?.join(", ")}
//                         icon={<Globe size={14} />}
//                       />
//                     </InfoCard>

//                     <InfoCard title="Professional information">

//                       <DetailRow
//                         label="Skills"
//                         value={employee?.skills}
//                         icon={<Briefcase size={14} />}
//                         isSkills={true}
//                       />
//                       <DetailRow
//                         label="Assets"
//                         value={employee?.assets}
//                         icon={<Briefcase size={14} />}
//                         isSkills={true}
//                       />
//                       <div className="my-4 border-t border-slate-50" />{" "}

//                     </InfoCard>
//                   </div>
//                 </div>
//               )} */}

// {/* {activeTab === "overview" && (
//   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//       <InfoCard title="Identity Metadata">
//         <DetailRow
//           label="Date of Birth"
//           value={employee?.dob}
//           icon={<Calendar size={14} />}
//         />
//         <DetailRow
//           label="Gender Mapping"
//           value={employee?.gender}
//           icon={<Shield size={14} />}
//         />
//         <DetailRow
//           label="Linguistic Stack"
//           value={employee?.languages_spoken?.join(", ")}
//           icon={<Globe size={14} />}
//         />
//       </InfoCard>

//       <InfoCard title="Professional Induction">
//         <DetailRow
//           label="Core Proficiency"
//           value={employee?.skills}
//           icon={<Briefcase size={14} />}
//           isSkills={true}
//         />

//         <div className="my-4 border-t border-slate-50" />

//         <DetailRow
//           label="Assigned Department"
//           value={employee?.department || "General Pool"}
//           icon={<Shield size={14} />}
//         />
//       </InfoCard>
//     </div>

//     <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative">

//       <History className="absolute -right-10 -bottom-10 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={250} />

//       <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//             <History size={20} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Professional Audit Trail</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
//                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Career Trajectory Log
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-10 relative z-10">

//         <div className="absolute left-1/2 top-10 bottom-10 w-[1px] bg-slate-100 -translate-x-1/2 hidden md:block" />

//         <div className="space-y-12">
//           {employee?.experiences && employee.experiences.length > 0 ? (
//             employee.experiences.map((exp, i) => (
//               <div key={i} className="relative flex flex-col md:flex-row items-center justify-between md:odd:flex-row-reverse group transition-all duration-500">

//                 <div className="absolute left-1/2 flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-white border-[4px] border-slate-50 text-slate-300 group-hover:border-blue-600 group-hover:text-blue-600 group-hover:shadow-xl group-hover:shadow-blue-100 transition-all duration-500 z-20 -translate-x-1/2 hidden md:flex">
//                   <Briefcase size={18} strokeWidth={2.5} />
//                 </div>

//                 <div className="w-full md:w-[calc(50%-3.5rem)] bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-blue-300 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 relative overflow-hidden group/card">

//                   <FileCheck className="absolute -right-4 -bottom-4 text-slate-50 opacity-40 group-hover/card:text-blue-50 transition-colors duration-500" size={100} />

//                   <div className="relative z-10">
//                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
//                       <div>
//                         <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-blue-100">
//                           {exp?.job_title || "Position Undefined"}
//                         </div>
//                         <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
//                           {exp?.company_name || "Entity Unnamed"}
//                         </h4>
//                       </div>

//                       {exp?.experience_letter_path && (
//                         <a
//                           href={formatDocUrl(exp.experience_letter_path)}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95 group/btn"
//                         >
//                           <FileText size={14} />
//                           Artifact
//                           <ExternalLink size={12} className="opacity-50 group-hover/btn:translate-x-0.5 transition-transform" />
//                         </a>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 mb-6">
//                       <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Induction Period</p>
//                         <p className="text-[11px] font-bold text-slate-700 uppercase">
//                           {exp?.start_date ? new Date(exp.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '---'} — {exp?.end_date ? new Date(exp.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Present'}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Final Compensation</p>
//                         <div className="flex items-center gap-1.5">
//                           <span className="text-blue-600 font-black text-[11px]">₹</span>
//                           <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
//                             {exp?.previous_ctc ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA` : "Not Disclosed"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {exp?.description ? (
//                       <div className="bg-white border-l-4 border-blue-500 pl-4 py-1 mb-6">
//                         <p className="text-[12px] text-slate-600 font-medium leading-relaxed italic">
//                           "{exp.description}"
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-6 italic">No execution notes provided</p>
//                     )}

//                     <div className="flex items-center gap-2.5 pt-5 border-t border-slate-50">
//                       <MapPin size={14} className="text-slate-300" />
//                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                         Deployment: {exp?.location || "Remote/Global"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="hidden md:flex flex-col items-center w-[calc(50%-3.5rem)] px-10">
//                    <div className="text-3xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-500">
//                      {exp?.start_date ? new Date(exp.start_date).getFullYear() : '----'}
//                    </div>
//                    <div className="h-1 w-8 bg-slate-100 group-hover:bg-blue-200 transition-colors mt-2 rounded-full" />
//                 </div>

//               </div>
//             ))
//           ) : (

//             <div className="py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 animate-in fade-in duration-1000">
//               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100 mb-6">
//                 <Database size={32} strokeWidth={1.5} />
//               </div>
//               <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2">No Professional Data</h4>
//               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Candidate has not yet provided experience artifacts</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="px-10 py-5 bg-slate-900 border-t border-slate-800 text-center relative overflow-hidden">
//         <div className="absolute inset-0 bg-blue-600 opacity-5" />
//         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] relative z-10">
//           End of verified career trajectory record • ID: {id}
//         </p>
//       </div>
//     </div>
//   </div>
// )} */}

// {activeTab === "overview" && (
//   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//       <InfoCard title="Personal Information">
//         <DetailRow
//           label="Date of Birth"
//           value={employee?.dob}
//           icon={<Calendar size={14} />}
//         />
//         <DetailRow
//           label="Gender "
//           value={employee?.gender}
//           icon={<Shield size={14} />}
//         />
//         <DetailRow
//           label="language"
//           value={employee?.languages_spoken?.join(", ")}
//           icon={<Globe size={14} />}
//         />
//       </InfoCard>

//       <InfoCard title="Professional Information">
//         <DetailRow
//           label="Skill"
//           value={employee?.skills || "-"}
//           icon={<Briefcase size={14} />}
//           isSkills={true}
//         />

//         <div className="my-4 border-t border-slate-50" />

//         <DetailRow
//           label="Assets"
//           value={employee?.assets || "-"}
//           icon={<Shield size={14} />}
//              isSkills={true}
//         />
//       </InfoCard>
//     </div>

//     <div>
//         <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative">
//   <History
//     className="absolute -right-10 -top-10 text-slate-50 opacity-[0.3] -rotate-12 pointer-events-none"
//     size={200}
//   />

//   <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between relative z-10">
//     <div className="flex items-center gap-3">
//       <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//         <History size={18} strokeWidth={2.5} />
//       </div>

//       <div>
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] leading-none">
//           Candidate
//         </h3>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//          Previous History
//         </p>
//       </div>
//     </div>

//     {/* TENURE COUNTER */}
//     <div className="flex items-center gap-3">
//       <div className="flex flex-col items-end">
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//           Total Experiance
//         </span>
//         <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
//           {calculateTotalExperience(employee?.experiences)}
//         </span>
//       </div>

//       <div className="h-8 w-[1px] bg-slate-200 mx-1" />

//       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
//           Active Stream
//         </span>
//       </div>
//     </div>
//   </div>

//   {/* BODY */}
//   <div className="relative z-10">
//     {employee?.experiences && employee.experiences.length > 0 ? (
//       <div className="divide-y divide-slate-100">
//         {employee.experiences.map((exp, i) => (
//           <div
//             key={i}
//             className="group hover:bg-slate-50/40 transition-colors duration-300"
//           >
//             <div className="flex flex-col md:flex-row p-8 gap-8">

//               {/* TIME IDENTIFIER */}
//               <div className="md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
//                 <span className="text-xl font-black text-slate-900 tracking-tighter">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).getFullYear()
//                     : "----"}
//                 </span>

//                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest md:mt-1">
//                   {exp?.start_date
//                     ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                         month: "short",
//                       })
//                     : "---"}{" "}
//                   DEPLOYMENT
//                 </span>
//               </div>

//               {/* CONTENT BODY */}
//               <div className="flex-1 space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//                         {exp?.company_name || "Unidentified Entity"}
//                       </h4>
//                       <span className="h-1 w-1 rounded-full bg-slate-300" />
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                         {exp?.location || "Global Node"}
//                       </span>
//                     </div>

//                     <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
//                       {exp?.job_title || "Role Undefined"}
//                     </p>
//                   </div>

//                   {exp?.experience_letter_path && (
//                     <a
//                       href={formatDocUrl(exp.experience_letter_path)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/artifact"
//                     >
//                       <FileText
//                         size={14}
//                         className="text-slate-400 group-hover/artifact:text-blue-500"
//                       />
//                      Experience Letter
//                       <ExternalLink size={10} className="opacity-40" />
//                     </a>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                      Previous  CTC
//                     </span>

//                     <div className="flex items-center gap-1.5">
//                       <span className="text-blue-600 font-black text-[10px]">
//                         ₹
//                       </span>
//                       <span className="text-[11px] font-bold text-slate-700">
//                         {exp?.previous_ctc
//                           ? `${(exp.previous_ctc / 100000).toFixed(2)} LPA`
//                           : "Not Logged"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                       Duration
//                     </span>

//                     <span className="text-[11px] font-bold text-slate-700 uppercase">
//                       {exp?.start_date
//                         ? new Date(exp.start_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "---"}{" "}
//                       -{" "}
//                       {exp?.end_date
//                         ? new Date(exp.end_date).toLocaleDateString("en-IN", {
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "Present"}
//                     </span>
//                   </div>
//                 </div>

//                 {exp?.description && (
//                   <div className="max-w-3xl">
//                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
//                       "{exp.description}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="py-24 flex flex-col items-center justify-center animate-in zoom-in duration-700">
//         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
//           <Database size={28} strokeWidth={1.5} />
//         </div>

//         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
//            Fresher Profile
//         </h4>

//         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//          No prior professional experience recorded
//         </p>
//       </div>
//     )}
//   </div>

// </div>

//     </div>

//   </div>
// )}

//               {/* {activeTab === "vault" && (
//                 <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

//                   {employee?.resume_path && (
//                     <ModernDocCard
//                       title="Primary Resume"
//                       url={employee.resume_path}
//                       type="PDF"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   )}

//                   {employee?.experiences?.map(
//                     (exp) =>
//                       exp.experience_letter_path && (
//                         <ModernDocCard
//                           key={exp.id}
//                           title={`${exp.company_name} Experience Letter`}
//                           url={exp.experience_letter_path}
//                           type="Experience"
//                           formatDocUrl={formatDocUrl}
//                         />
//                       ),
//                   )}

//                   {employee?.certificates?.map((cert) => (
//                     <ModernDocCard
//                       key={cert.id}
//                       title={cert.name}
//                       url={cert.file_path}
//                       type="Certificate"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   ))}
//                 </div>
//               )} */}

//               {activeTab === "vault" && (
//   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

//     {/* SECTION 1: MASTER IDENTITY DOCUMENTS */}
//     <div className="space-y-4">
//       <div className="flex items-center gap-3 px-2">
//         <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Identity Node</h3>
//       </div>

//       {employee?.resume_path ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <ModernDocCard
//             title="Candidate Resume"
//             url={employee.resume_path}
//             type="employee"
//             formatDocUrl={formatDocUrl}
//           />
//         </div>
//       ) : (
//         <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Resume not updated</p>
//         </div>
//       )}
//     </div>

//     {/* SECTION 2: SERVICE & TENURE VERIFICATION */}
//     {/* <div className="space-y-4">
//       <div className="flex items-center gap-3 px-2">
//         <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
//         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tenure Verification Artifacts</h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {employee?.experiences?.filter(exp => exp.experience_letter_path).length > 0 ? (
//           employee.experiences.map((exp) => exp.experience_letter_path && (
//             <ModernDocCard
//               key={exp.id}
//               title={`${exp.company_name} Relieving`}
//               url={exp.experience_letter_path}
//               type="EXPERIENCE_AUDIT"
//               formatDocUrl={formatDocUrl}
//             />
//           ))
//         ) : (
//           <div className="col-span-full p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Experience Artifacts Registered</p>
//           </div>
//         )}
//       </div>
//     </div> */}

//     {/* SECTION 3: ACADEMIC & SKILL CERTIFICATIONS */}
//     <div className="space-y-4">
//       <div className="flex items-center gap-3 px-2">
//         <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
//         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Certifications</h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {employee?.certificates?.length > 0 ? (
//           employee.certificates.map((cert) => (
//             <ModernDocCard
//               key={cert.id}
//               title={cert.name}
//               url={cert.file_path}
//               type="COMPLIANCE_CERT"
//               formatDocUrl={formatDocUrl}
//             />
//           ))
//         ) : (
//           <div className="col-span-full p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
//             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No External Credentials Found</p>
//           </div>
//         )}
//       </div>
//     </div>

//     {/* SYSTEM FOOTER WATERMARK */}
//     <div className="pt-10 border-t border-slate-100 flex justify-center">
//       <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
//         <ShieldCheck size={12} className="text-slate-400" />
//         <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Artifact Vault v4.2.0</span>
//       </div>
//     </div>
//   </div>
// )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
//     <p className="text-sm font-medium text-slate-500 animate-pulse">
//       Initializing Candidate Data...
//     </p>
//   </div>
// );

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-semibold text-slate-700 break-all">
//         {value || "Not provided"}
//       </span>
//     </div>
//   </div>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-500 hover:text-slate-700"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const InfoCard = ({ title, children }) => (
//   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
//       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//         {title}
//       </h3>
//     </div>
//     <div className="p-6 space-y-4">{children}</div>
//   </div>
// );

// /* UPDATED COMPONENT */
// const ModernDocCard = ({ title, url, type, formatDocUrl }) => {
//   // Apply the URL transformation here
//   const formattedUrl = formatDocUrl(url);

//   return (
//     <a
//       href={formattedUrl}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
//     >
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//           <FileText size={20} />
//         </div>
//         <div>
//           <p className="text-sm font-bold text-slate-800">{title}</p>
//           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
//             {type}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
//           View Document
//         </span>
//         <ExternalLink
//           size={16}
//           className="text-slate-300 group-hover:text-blue-600"
//         />
//       </div>
//     </a>
//   );
// };

// const EmptyState = ({ message }) => (
//   <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
//     <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
//       <Shield size={32} />
//     </div>
//     <p className="text-slate-500 text-sm font-medium">{message}</p>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div
//     className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-2`}
//   >
//     <div className="flex items-center gap-2 text-slate-500">
//       {icon}
//       <span className="text-[11px] font-semibold uppercase tracking-wider">
//         {label}
//       </span>
//     </div>

//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {Array.isArray(value) && value.length > 0 ? (
//           value.map((skill, i) => (
//             <span
//               key={i}
//               className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
//             >
//               {skill}
//             </span>
//           ))
//         ) : (
//           <span className="text-xs text-slate-400 italic">
//             No skills listed
//           </span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
//     )}
//   </div>
// );

// export default CandidateProfilePage;
//******************************************************working cdoe phase 1 19/02/26********************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Smartphone,
//   Monitor,
//   FileCheck,
//   FileText,
//   Activity,
//   MapPin,
//   Briefcase,
//   ExternalLink,
//   Calendar,
//   Globe,
//   Shield,
//   Download,
//   MoreVertical,
//   Edit3,
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`,
//         );
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   const formatDocUrl = (rawUrl) => {
//     if (!rawUrl) return "#";
//     // This removes everything before 'uploads/' and adds your new base URL
//     const path = rawUrl.split("uploads/")[1];
//     return `https://apihrr.goelectronix.co.in/uploads/${path}`;
//   };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
//       {/* TOP NAVIGATION BAR */}
//       <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="h-6 w-[1px] bg-slate-200 mx-2" />
//             <nav className="flex text-sm font-medium text-slate-500 gap-2">
//               <span className="hover:text-blue-600 cursor-pointer">
//                 Candidates
//               </span>
//               <span>/</span>
//               <span className="text-slate-900">{employee?.full_name}</span>
//             </nav>
//           </div>

//           {/* <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
//               <Download size={16} /> Export PDF
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all">
//               <Edit3 size={16} /> Edit Profile
//             </button>
//           </div> */}
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT COLUMN: IDENTITY CARD */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-100">
//                   {employee?.full_name?.charAt(0)}
//                 </div>
//                 <h1 className="text-2xl font-bold text-slate-900 leading-tight">
//                   {employee?.full_name}
//                 </h1>
//                 <p className="text-slate-500 font-medium mb-4">
//                   {employee?.position || "Position not set"}
//                 </p>
//                 <div className="flex gap-2">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
//                       employee?.status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                         : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}
//                   >
//                     {employee?.status || "Pending"}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
//                 <SidebarInfo
//                   icon={<Mail size={16} />}
//                   label="Email"
//                   value={employee?.email}
//                 />
//                 <SidebarInfo
//                   icon={<Smartphone size={16} />}
//                   label="Phone"
//                   value={employee?.phone}
//                 />
//                 <SidebarInfo
//                   icon={<MapPin size={16} />}
//                   label="Location"
//                   value={`${employee?.city}, ${employee?.state}, ${employee?.district} , ${employee?.pincode}`}
//                 />
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN: TABS AND CONTENT */}
//           <div className="col-span-12 lg:col-span-8">
//             {/* TAB SELECTOR */}
//             <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
//               <TabButton
//                 active={activeTab === "overview"}
//                 onClick={() => setActiveTab("overview")}
//                 label="General Overview"
//                 icon={<Activity size={18} />}
//               />
//               {/* <TabButton
//                 active={activeTab === "infrastructure"}
//                 onClick={() => setActiveTab("infrastructure")}
//                 label="Assets & Tools"
//                 icon={<Monitor size={18} />}
//               /> */}
//               <TabButton
//                 active={activeTab === "vault"}
//                 onClick={() => setActiveTab("vault")}
//                 label="Documentation"
//                 icon={<FileCheck size={18} />}
//               />
//             </div>

//             {/* TAB CONTENT */}
//             <div className="min-h-[400px]">
//               {activeTab === "overview" && (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InfoCard title="Personal Details">
//                       <DetailRow
//                         label="Date of Birth"
//                         value={employee?.dob}
//                         icon={<Calendar size={14} />}
//                       />
//                       <DetailRow
//                         label="Gender"
//                         value={employee?.gender}
//                         icon={<Shield size={14} />}
//                       />
//                       <DetailRow
//                         label="Languages"
//                         value={employee?.languages_spoken?.join(", ")}
//                         icon={<Globe size={14} />}
//                       />
//                     </InfoCard>

//                     {/* <InfoCard title="Professional Setup">
//                       <DetailRow
//                         label="Skills"
//                         value={employee?.skills?.join(", ")}
//                         icon={<Briefcase size={14} />}
//                       />
//                       <DetailRow
//                         label="Pincode"
//                         value={employee?.pincode}
//                         icon={<MapPin size={14} />}
//                       />
//                       <DetailRow label="District" value={employee?.district} />
//                     </InfoCard> */}
//                     <InfoCard title="Professional information">
//   {/* SKILLS SECTION WITH CHIPS */}
//   <DetailRow
//     label="Skills"
//     value={employee?.skills}
//     icon={<Briefcase size={14} />}
//     isSkills={true}
//   />

//    <DetailRow
//     label="Assets"
//     value={employee?.assets}
//     icon={<Briefcase size={14} />}
//     isSkills={true}
//   />
//   <div className="my-4 border-t border-slate-50" /> {/* Visual Separator */}

//   {/* <DetailRow
//     label="Pincode"
//     value={employee?.pincode}
//     icon={<MapPin size={14} />}
//   />

//   <DetailRow
//     label="District"
//     value={employee?.district}
//     icon={<Shield size={14} />}
//   /> */}
// </InfoCard>
//                   </div>
//                 </div>
//               )}
// {/*
//               {activeTab === "infrastructure" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   {employee?.assets?.length > 0 ? (
//                     employee.assets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors"
//                       >
//                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4">
//                           <Monitor size={20} />
//                         </div>
//                         <span className="font-semibold text-slate-700">
//                           {asset}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <EmptyState message="No assets assigned to this candidate." />
//                   )}
//                 </div>
//               )} */}

//               {/* {activeTab === "vault" && (
//                 <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   {employee?.resume_path && <ModernDocCard title="Primary Resume" url={employee.resume_path} type="PDF" />}
//                   {employee?.experiences?.map(exp => exp.experience_letter_path && (
//                     <ModernDocCard key={exp.id} title={`${exp.company_name} Experience Letter`} url={exp.experience_letter_path} type="Experience" />
//                   ))}
//                   {employee?.certificates?.map(cert => (
//                     <ModernDocCard key={cert.id} title={cert.name} url={cert.file_path} type="Certificate" />
//                   ))}
//                 </div>
//               )} */}

//               {activeTab === "vault" && (
//                 <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   {/* Resume */}
//                   {employee?.resume_path && (
//                     <ModernDocCard
//                       title="Primary Resume"
//                       url={employee.resume_path}
//                       type="PDF"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   )}

//                   {/* Experience Letters */}
//                   {employee?.experiences?.map(
//                     (exp) =>
//                       exp.experience_letter_path && (
//                         <ModernDocCard
//                           key={exp.id}
//                           title={`${exp.company_name} Experience Letter`}
//                           url={exp.experience_letter_path}
//                           type="Experience"
//                           formatDocUrl={formatDocUrl}
//                         />
//                       ),
//                   )}

//                   {/* Certificates */}
//                   {employee?.certificates?.map((cert) => (
//                     <ModernDocCard
//                       key={cert.id}
//                       title={cert.name}
//                       url={cert.file_path}
//                       type="Certificate"
//                       formatDocUrl={formatDocUrl}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const LoadingSkeleton = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//     <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
//     <p className="text-sm font-medium text-slate-500 animate-pulse">
//       Initializing Secure Environment...
//     </p>
//   </div>
// );

// const SidebarInfo = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
//       {icon}
//     </div>
//     <div className="flex flex-col">
//       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
//         {label}
//       </span>
//       <span className="text-sm font-semibold text-slate-700 break-all">
//         {value || "Not provided"}
//       </span>
//     </div>
//   </div>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 ${
//       active
//         ? "border-blue-600 text-blue-600"
//         : "border-transparent text-slate-500 hover:text-slate-700"
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const InfoCard = ({ title, children }) => (
//   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
//       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//         {title}
//       </h3>
//     </div>
//     <div className="p-6 space-y-4">{children}</div>
//   </div>
// );

// // const DetailRow = ({ label, value, icon }) => (
// //   <div className="flex items-start justify-between">
// //     <div className="flex items-center gap-2 text-slate-500">
// //       {icon} <span className="text-xs font-medium">{label}</span>
// //     </div>
// //     <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
// //   </div>
// // );

// // const ModernDocCard = ({ title, url, type }) => (
// //   <a
// //     href={url} target="_blank" rel="noreferrer"
// //     className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
// //   >
// //     <div className="flex items-center gap-4">
// //       <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
// //         <FileText size={20} />
// //       </div>
// //       <div>
// //         <p className="text-sm font-bold text-slate-800">{title}</p>
// //         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{type}</p>
// //       </div>
// //     </div>
// //     <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
// //   </a>
// // );

// /* UPDATED COMPONENT */
// const ModernDocCard = ({ title, url, type, formatDocUrl }) => {
//   // Apply the URL transformation here
//   const formattedUrl = formatDocUrl(url);

//   return (
//     <a
//       href={formattedUrl}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
//     >
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//           <FileText size={20} />
//         </div>
//         <div>
//           <p className="text-sm font-bold text-slate-800">{title}</p>
//           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
//             {type}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
//           View Document
//         </span>
//         <ExternalLink
//           size={16}
//           className="text-slate-300 group-hover:text-blue-600"
//         />
//       </div>
//     </a>
//   );
// };

// const EmptyState = ({ message }) => (
//   <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
//     <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
//       <Shield size={32} />
//     </div>
//     <p className="text-slate-500 text-sm font-medium">{message}</p>
//   </div>
// );

// const DetailRow = ({ label, value, icon, isSkills = false }) => (
//   <div className={`flex ${isSkills ? "flex-col gap-3" : "items-center justify-between"} py-2`}>
//     <div className="flex items-center gap-2 text-slate-500">
//       {icon}
//       <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
//     </div>

//     {isSkills ? (
//       <div className="flex flex-wrap gap-2">
//         {Array.isArray(value) && value.length > 0 ? (
//           value.map((skill, i) => (
//             <span
//               key={i}
//               className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
//             >
//               {skill}
//             </span>
//           ))
//         ) : (
//           <span className="text-xs text-slate-400 italic">No skills listed</span>
//         )}
//       </div>
//     ) : (
//       <span className="text-xs font-bold text-slate-900">{value || "—"}</span>
//     )}
//   </div>
// );

// export default CandidateProfilePage;
//********************************************************************************************************************* */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor,
//   FileCheck, FileText, ShieldCheck, Activity, MapPin,
//   Briefcase, ExternalLink
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/candidates/${id}`
//         );
//         const data = await res.json();

//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen font-black uppercase text-slate-400 animate-pulse tracking-widest text-xs">
//         Node_Retrieval_In_Progress
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900">

//       {/* HEADER */}
//       <div className="bg-slate-50/50 border-b pt-8 pb-0">
//         <div className="max-w-[1400px] mx-auto px-8">

//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">

//             <div className="flex items-start gap-6">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="mt-1 p-2 bg-white border rounded-xl hover:shadow-md"
//               >
//                 <ArrowLeft size={18} />
//               </button>

//               <div>
//                 <div className="flex items-center gap-2 mb-1.5">
//                   <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase">
//                     Candidate
//                   </span>

//                   <span className="text-[10px] font-bold text-slate-400 uppercase">
//                     ID-{employee?.id}
//                   </span>
//                 </div>

//                 <h1 className="text-4xl font-black tracking-tighter uppercase italic">
//                   {employee?.full_name}
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center gap-8 pb-1">
//               <StatNode label="Status" val={employee?.status} />
//               <StatNode label="Position" val={employee?.position} />
//               <StatNode label="City" val={employee?.city} />
//             </div>

//           </div>

//           {/* TABS */}
//           <div className="flex gap-1 overflow-x-auto">

//             <NavSegment
//               active={activeTab === "overview"}
//               onClick={() => setActiveTab("overview")}
//               label="Overview"
//               icon={<Activity size={14} />}
//             />

//             <NavSegment
//               active={activeTab === "infrastructure"}
//               onClick={() => setActiveTab("infrastructure")}
//               label="Assets"
//               icon={<Monitor size={14} />}
//             />

//             <NavSegment
//               active={activeTab === "vault"}
//               onClick={() => setActiveTab("vault")}
//               label="Documents"
//               icon={<FileCheck size={14} />}
//             />
//           </div>
//         </div>
//       </div>

//       {/* MAIN */}
//       <main className="max-w-[1400px] mx-auto px-8 py-12">

//         {/* OVERVIEW */}
//         {activeTab === "overview" && (
//           <div className="grid grid-cols-12 gap-10">

//             <div className="col-span-12 lg:col-span-8 space-y-10">

//               <div className="grid grid-cols-3 gap-6">
//                 <ValueBlock
//                   label="Email"
//                   val={employee?.email}
//                   icon={<Mail size={16} />}
//                 />

//                 <ValueBlock
//                   label="Phone"
//                   val={employee?.phone}
//                   icon={<Smartphone size={16} />}
//                 />

//                 <ValueBlock
//                   label="Skills"
//                   val={employee?.skills?.join(", ")}
//                   icon={<Briefcase size={16} />}
//                 />
//               </div>

//               <div>
//                 <h4 className="text-[11px] font-black uppercase text-slate-400 border-b pb-3">
//                   Personal Info
//                 </h4>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 mt-6">
//                   <GhostField label="DOB" val={employee?.dob} />
//                   <GhostField label="Gender" val={employee?.gender} />
//                   <GhostField
//                     label="Languages"
//                     val={employee?.languages_spoken?.join(", ")}
//                   />
//                   <GhostField label="State" val={employee?.state} />
//                   <GhostField label="District" val={employee?.district} />
//                   <GhostField label="Pincode" val={employee?.pincode} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ASSETS */}
//         {activeTab === "infrastructure" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {employee?.assets?.map((asset, i) => (
//               <div
//                 key={i}
//                 className="p-6 bg-slate-50 border rounded-2xl flex items-center gap-3"
//               >
//                 <Monitor size={18} className="text-blue-600" />
//                 <span className="font-bold">{asset}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* DOCUMENTS */}
//         {activeTab === "vault" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             {/* Resume */}
//             {employee?.resume_path && (
//               <DocCard title="Resume" url={employee.resume_path} />
//             )}

//             {/* Experience Letters */}
//             {employee?.experiences?.map(
//               (exp) =>
//                 exp.experience_letter_path && (
//                   <DocCard
//                     key={exp.id}
//                     title={`${exp.company_name} Experience Letter`}
//                     url={exp.experience_letter_path}
//                   />
//                 )
//             )}

//             {/* Certificates */}
//             {employee?.certificates?.map((cert) => (
//               <DocCard key={cert.id} title={cert.name} url={cert.file_path} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// /* COMPONENTS */

// const StatNode = ({ label, val }) => (
//   <div className="flex flex-col items-end">
//     <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
//     <p className="text-xs font-black uppercase">{val || "Pending"}</p>
//   </div>
// );

// const NavSegment = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className="px-6 py-4 flex gap-2 items-center">
//     <span className={active ? "text-blue-600" : "text-slate-400"}>
//       {icon}
//     </span>
//     <span className="text-[11px] font-black uppercase">{label}</span>
//   </button>
// );

// const ValueBlock = ({ label, val, icon }) => (
//   <div className="p-6 border rounded-3xl shadow-sm">
//     <div className="flex items-center gap-3 mb-4">
//       <div className="p-2 bg-slate-50 rounded-xl text-blue-600">{icon}</div>
//       <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
//     </div>
//     <p className="text-sm font-black">{val || "—"}</p>
//   </div>
// );

// const GhostField = ({ label, val }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
//     <p className="text-sm font-bold">{val || "Not Set"}</p>
//   </div>
// );

// const DocCard = ({ title, url }) => (
//   <a
//     href={url}
//     target="_blank"
//     rel="noreferrer"
//     className="flex items-center justify-between p-6 bg-white border rounded-3xl shadow-sm hover:border-blue-600"
//   >
//     <div className="flex items-center gap-4">
//       <FileText size={20} />
//       <span className="text-[11px] font-black uppercase">{title}</span>
//     </div>
//     <ExternalLink size={14} />
//   </a>
// );

// export default CandidateProfilePage;

//*********************************************************working code phase 1************************************************************ */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import {
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor,
//   FileCheck, FileText, ShieldCheck, Activity, MapPin, Lock,
//   Briefcase, Calendar, ChevronRight, ExternalLink, Hash, Info
// } from "lucide-react";

// const CandidateProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchFullProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await employeeKycService.getFull(id);
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullProfile();
//   }, [id]);

//   if (loading) return <div className="flex items-center justify-center min-h-screen font-black uppercase text-slate-400 animate-pulse tracking-widest text-xs">Node_Retrieval_In_Progress</div>;

//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">

//       {/* 01. INTEGRATED SYSTEM HEADER */}
//       <div className="bg-slate-50/50 border-b border-slate-100 pt-8 pb-0">
//         <div className="max-w-[1400px] mx-auto px-8">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
//             <div className="flex items-start gap-6">
//               <button onClick={() => navigate(-1)} className="mt-1 p-2 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
//                 <ArrowLeft size={18} />
//               </button>
//               <div>
//                 <div className="flex items-center gap-2 mb-1.5">
//                   <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-widest">Employee</span>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{employee?.employee_code}</span>
//                 </div>
//                 <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
//                   {employee?.full_name}
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center gap-8 pb-1">
//                <StatNode label="Employment" val={employee?.status} color="text-emerald-500" />
//                <StatNode label="Assignment" val={employee?.role} />
//                <StatNode label="Node" val={employee?.address?.current_city} />
//             </div>
//           </div>

//           {/* 02. SEGMENTED TAB NAVIGATOR (Linear Style) */}
//           <div className="flex items-center gap-1 border-b border-transparent overflow-x-auto no-scrollbar">
//             <NavSegment active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" icon={<Activity size={14}/>} />
//             <NavSegment active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} label="Identity Registry" icon={<Fingerprint size={14}/>} />
//             <NavSegment active={activeTab === "infrastructure"} onClick={() => setActiveTab("infrastructure")} label="Assets & Hardware" icon={<Monitor size={14}/>} />
//             <NavSegment active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Documentation" icon={<FileCheck size={14}/>} />
//           </div>
//         </div>
//       </div>

//       {/* 03. MAIN STAGE */}
//       <main className="max-w-[1400px] mx-auto px-8 py-12">

//         {/* TAB: OVERVIEW */}
//         {activeTab === "overview" && (
//           <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
//             {/* Core Metrics */}
//             <div className="col-span-12 lg:col-span-8 space-y-10">
//                <div className="grid grid-cols-3 gap-6">
//                   <ValueBlock label="Communications" val={employee.email} icon={<Mail size={16}/>} />
//                   <ValueBlock label="Contact" val={employee.phone} icon={<Smartphone size={16}/>} />
//                   <ValueBlock label="Offered CTC" val={`₹${employee.offered_ctc?.toLocaleString()}`} icon={<TrendingUp size={16}/>} />
//                </div>

//                <div className="space-y-6">
//                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-3">Deployment Schedule</h4>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
//                      <GhostField label="Probation Start" val={employee.probation_start_date} />
//                      <GhostField label="Probation End" val={employee.probation_end_date} />
//                      <GhostField label="Confirmation" val={employee.confirmation_date} />
//                      <GhostField label="Actual Joining" val={employee.actual_joining_date} />
//                   </div>
//                </div>
//             </div>

//             {/* Reporting Context Sidebar */}
//             <div className="col-span-12 lg:col-span-4">
//                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
//                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Matrix</h4>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 shadow-sm">
//                       {employee.reporting_manager_name?.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-xs font-black text-slate-900 uppercase">{employee.reporting_manager_name}</p>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase">Reporting Head</p>
//                     </div>
//                   </div>
//                </div>
//             </div>
//           </div>
//         )}

//         {/* TAB: KYC */}
//         {activeTab === "kyc" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
//              <RegistrySlate label="Aadhaar UID" val={employee.kyc?.aadhaar_number} status={employee.kyc?.aadhaar_status} />
//              <RegistrySlate label="PAN Inventory" val={employee.kyc?.pan_number} status={employee.kyc?.pan_status} />
//              <RegistrySlate label="IFSC Protocol" val={employee.kyc?.ifsc_code} status={employee.kyc?.bank_status} />
//              <RegistrySlate label="Settlement Index" val={employee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={employee.kyc?.bank_status} />
//           </div>
//         )}

//         {/* TAB: INFRASTRUCTURE */}
//         {activeTab === "infrastructure" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
//              {employee.assets?.map(asset => (
//                <div key={asset.id} className="group p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
//                   <div className="flex justify-between items-start mb-6">
//                     <div className="flex gap-4">
//                       <div className="p-3 bg-white rounded-2xl border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform shadow-sm"><Monitor size={20}/></div>
//                       <div>
//                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{asset.asset_category}</p>
//                         <h5 className="text-lg font-black text-slate-800 leading-none mt-1">{asset.asset_name}</h5>
//                       </div>
//                     </div>
//                     <span className="text-[10px] font-mono font-bold text-slate-400">{asset.serial_number}</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200/50">
//                     {asset.images?.map((img, i) => (
//                       <img key={i} src={`https://apihrr.goelectronix.co.in${img}`} className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer" alt="asset" />
//                     ))}
//                   </div>
//                </div>
//              ))}
//           </div>
//         )}

//         {/* TAB: VAULT */}
//         {activeTab === "vault" && (
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-500">
//              {employee.documents?.map(doc => (
//                <a key={doc.id} href={doc.document_path} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 transition-all shadow-sm group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors"><FileText size={20} className="text-slate-400 group-hover:text-blue-600"/></div>
//                     <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight leading-tight">{doc.document_type.replace(/_/g, " ")}</span>
//                   </div>
//                   <ExternalLink size={14} className="text-slate-200 group-hover:text-blue-600 transition-all" />
//                </a>
//              ))}
//            </div>
//         )}

//       </main>
//     </div>
//   );
// };

// /* --- ENTERPRISE SLATE SUB-COMPONENTS --- */

// const StatNode = ({ label, val, color }) => (
//   <div className="flex flex-col items-end">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
//     <p className={`text-xs font-black uppercase tracking-widest ${color || 'text-slate-900'}`}>{val || "Pending"}</p>
//   </div>
// );

// const NavSegment = ({ active, onClick, label, icon }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2.5 px-6 py-4 transition-all relative group`}
//   >
//     <span className={`transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
//     <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{label}</span>
//     {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.4)]" />}
//   </button>
// );

// const ValueBlock = ({ label, val, icon }) => (
//   <div className="p-6 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
//     <div className="flex items-center gap-3 mb-4">
//       <div className="p-2 bg-slate-50 rounded-xl text-blue-600">{icon}</div>
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//     </div>
//     <p className="text-sm font-black text-slate-900 truncate">{val || "—"}</p>
//   </div>
// );

// const GhostField = ({ label, val }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
//     <p className="text-sm font-bold text-slate-700">{val || "Not_Set"}</p>
//   </div>
// );

// const RegistrySlate = ({ label, val, status }) => (
//   <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
//     <div className="space-y-1">
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//       <p className="text-sm font-black text-slate-800 font-mono tracking-[0.1em]">{val || "--- --- ---"}</p>
//     </div>
//     <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${status === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
//        <div className={`w-1.5 h-1.5 rounded-full ${status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
//        {status || "Pending"}
//     </div>
//   </div>
// );

// export default CandidateProfilePage;
