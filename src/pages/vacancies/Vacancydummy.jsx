import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import { useNavigate } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import {
  Briefcase,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
  GraduationCap,
  FileText,
  PlusCircle,
  X,
  Award,
  UserPlus,
  Info,
  Edit3,
  Search,
  Check,
  ShieldCheck,
  Zap,
  Loader2,
  ChevronDown,
  Plus,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const VacanciesDummyPage = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  // --- NEW STATE FOR LISTING & PAGINATION ---
  const [vacancies, setVacancies] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [deptSearch, setDeptSearch] = useState("");
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const dropdownRef = useRef(null);
  const [skillInput, setSkillInput] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [allMasterSkills, setAllMasterSkills] = useState([]);
const [skillSearch, setSkillSearch] = useState("");
const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  // Add this with your other state declarations
const [activeDetails, setActiveDetails] = useState([]);
const [allMasterEducation, setAllMasterEducation] = useState([]);
const [eduSearch, setEduSearch] = useState("");
const [showEduDrop, setShowEduDrop] = useState(false);
// Add to your state declarations
const [allMasterIndustries, setAllMasterIndustries] = useState([]);
const [industrySearch, setIndustrySearch] = useState("");
const [showIndustryDrop, setShowIndustryDrop] = useState(false);
// Add these inside your component
const [certSearch, setCertSearch] = useState("");
const [showCertDrop, setShowCertDrop] = useState(false);
const certRef = useRef(null); // To handle clicking outside
// Add to your state declarations
const [companyData, setCompanyData] = useState(null);


const [formData, setFormData] = useState({
  title: "",
  number_of_openings: 1,
  // Geo-logic (Now lists)
  location: [], 
  state: [],
  district: [],
  city: [],
  department_id: [],
  pincode: [],
  // New categorical fields
  job_type: "Full Time",
  cand_type: "",
  experience_required: "",
  min_experience: 0, // Numeric value for API
  max_experience: 0, //
  min_age: 0,
  max_age: 0,
  // Salary splitting logic
  min_salary: 0,
  max_salary: 0,
  bonus_offered: false,
  bonus_amount: 0,
  bonus_type: "",
  // Requirement arrays
  skills_req: [],
  spoken_languages: [],
  assets_req: [],
  certificates_req: [],
  // Timings & Contact
  office_timings: "9:00 AM - 6:00 PM",
  interview_timings: "10:00 AM - 4:00 PM",
  cand_can_call: "Everyday",
  call_timings: "10:00 AM - 5:00 PM",
  // Metadata
  status: "open",
  deadline_date: new Date().toISOString().split("T")[0],
  job_description_id: null,
  company_id: 1, // Defaulting to 1 or your system ID
  industry_id: null,
  degree_ids: [],
  // UI helper for Quills
  content: "", 
  responsibilities: "",
  requirements: "",
});

// Sync selections to Requirements Editor
// useEffect(() => {
//   const buildRequirements = () => {
//     let html = "";

//     // 1. Experience & Category
//     if (formData.cand_type || formData.experience_required) {
//       html += `<p><strong>Core Eligibility:</strong> Seeking an ${formData.cand_type} candidate`;
//       if (formData.experience_required && formData.experience_required !== "Fresher") {
//         html += ` with ${formData.experience_required} of professional experience.`;
//       }
//       html += `</p>`;
//     }

//     // 2. Education/Degrees
//     if (formData.degree_ids.length > 0) {
//       const degreeNames = formData.degree_ids
//         .map(id => allMasterEducation.find(e => e.id === id)?.name)
//         .filter(Boolean)
//         .join(", ");
//       html += `<p><strong>Educational background:</strong> Must hold a degree in ${degreeNames}.</p>`;
//     }

//     // 3. Technical Skills
//     if (formData.skills_req.length > 0) {
//       html += `<p><strong>Technical Competencies:</strong></p><ul>`;
//       formData.skills_req.forEach(skill => {
//         html += `<li>Proficiency in ${skill} is mandatory.</li>`;
//       });
//       html += `</ul>`;
//     }

//     // 4. Certifications
//     if (formData.certificates_req.length > 0) {
//       html += `<p><strong>Professional Certifications:</strong></p><ul>`;
//       formData.certificates_req.forEach(cert => {
//         html += `<li>Certified ${cert} Preferred.</li>`;
//       });
//       html += `</ul>`;
//     }

//     // 5. Assets
//     if (formData.assets_req.length > 0) {
//       html += `<p><strong>Physical Assets:</strong> Candidate must possess: ${formData.assets_req.join(", ")}.</p>`;
//     }

//     return html;
//   };

//   const syncContent = buildRequirements();
//   setFormData(prev => ({ ...prev, requirements: syncContent }));
// }, [
//   formData.skills_req, 
//   formData.degree_ids, 
//   formData.certificates_req, 
//   formData.assets_req, 
//   formData.cand_type, 
//   formData.experience_required,
//   allMasterEducation // Depend on master list to resolve names
// ]);

useEffect(() => {
  const buildRequirements = () => {
    let html = "";

    // // 1. Core Eligibility (Experience & Category)
    // if (formData.cand_type || formData.experience_required) {
    //   let expText = `Seeking an ${formData.cand_type} candidate`;
    //   if (formData.experience_required && formData.experience_required !== "Fresher") {
    //     expText += ` with ${formData.experience_required} of professional experience.`;
    //   }
    //   html += `<p><strong>Core Eligibility:</strong></p>`;
    //   html += `<p>${expText}</p>`;
    // }

    // 1. Core Eligibility (Experience + Industry Category)
    if (formData.cand_type || formData.experience_required || formData.industry_id) {
      const industryName = allMasterIndustries.find(i => i.id === formData.industry_id)?.name;
      
      let expText = `Seeking an ${formData.cand_type} candidate`;
      if (formData.experience_required && formData.experience_required !== "Fresher") {
        expText += ` with ${formData.experience_required} of professional experience`;
      }
      if (industryName) {
        expText += ` specifically within the ${industryName} sector`;
      }
      expText += ".";

      html += `<p><strong>Core Eligibility:</strong></p>`;
      html += `<p>${expText}</p>`;
    }

   // 2. Education/Degrees
    if (formData.degree_ids.length > 0) {
      const degreeNames = formData.degree_ids
        .map(id => allMasterEducation.find(e => e.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      html += `<p><strong>Education:</strong></p>`;
      html += `<p>Required Eduction ${degreeNames}.</p>`;
    }

    // // 3. Technical Skills (UPDATED: Grouped by comma in one line)
    // if (formData.skills_req.length > 0) {
    //   const groupedSkills = formData.skills_req.join(", ");
    //   html += `<p>Proficiency in ${groupedSkills} is mandatory.</p>`;
    // }
    // 3. Technical Skills (Header + Grouped Sentence)
if (formData.skills_req.length > 0) {
  const groupedSkills = formData.skills_req.join(", ");
  
  // Adding the Header line
  html += `<p><strong>Skills:</strong></p>`; 
  
  // Adding the descriptive sentence
  html += `<p>Proficiency in ${groupedSkills} is mandatory.</p>`;
}


// --- NEW: Spoken Languages Section ---
    if (formData.spoken_languages.length > 0) {
      const groupedLangs = formData.spoken_languages.join(", ");
      html += `<p><strong>Language Proficiency:</strong></p>`;
      html += `<p>Candidate should be Known in ${groupedLangs}.</p>`;
    }

   // 4. Certifications
    if (formData.certificates_req.length > 0) {
      const certList = formData.certificates_req.join(", ");
      html += `<p><strong>Professional Certifications:</strong></p>`;
      html += `<p>Certified in ${certList} preferred.</p>`;
    }

   // 5. Assets
    if (formData.assets_req.length > 0) {
      const assetList = formData.assets_req.join(", ");
      html += `<p><strong>Required Assets:</strong></p>`;
      html += `<p>Candidate must possess: ${assetList}.</p>`;
    }

    return html;
  };

  const syncContent = buildRequirements();
  setFormData(prev => ({ ...prev, requirements: syncContent }));
}, [
  formData.skills_req, 
  formData.degree_ids, 
  formData.certificates_req, 
  formData.assets_req, 
  formData.cand_type, 
  formData.experience_required,
  allMasterEducation
]);

  const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
  const [loadingJD, setLoadingJD] = useState(null);


  const MASTER_LANGUAGES = [
  "English", "Hindi", "Marathi", "Punjabi", "Kannada", "Bengali", "Telugu", 
  "Tamil", "Gujarati", "Urdu", "Malayalam", "Odia", "Assamese", "Santali", 
  "Meitei (Manipuri)", "Sanskrit"
];


const DISTRICT_CITY_MAP = {
  "Thane": ["Thane City", "Kalyan", "Dombivli", "Mira-Bhayandar", "Bhiwandi", "Ulhasnagar", "Ambarnath"],
  "Mumbai": ["Andheri", "Bandra", "Borivali", "Colaba", "Dadar", "Kurla", "Ghatkopar"],
  "Pune": ["Pune City", "Pimpri-Chinchwad", "Hingewadi", "Baner", "Hadapsar"]
};

const MANUAL_CERTIFICATES = [
  "AWS Certified Solutions Architect",
  "Google Cloud Professional Data Engineer",
  "Certified Kubernetes Administrator (CKA)",
  "Cisco Certified Network Associate (CCNA)",
  "Microsoft Certified: Azure Fundamentals",
  "CompTIA Security+",
  "Project Management Professional (PMP)",
  "Certified Ethical Hacker (CEH)",
  "ITIL Foundation",
  "Salesforce Certified Administrator"
];

// Master list based on Image 9
const MASTER_ASSETS = [
  "Bike", "License", "Aadhar Card", "PAN Card", "Heavy Driver License", 
  "Camera", "Laptop", "Auto / Rickshaw", "Tempo", "Tempo Traveller / Van", "Yulu / E-Bike"
];


  // 1. Fetch Master Data & Vacancies
  useEffect(() => {
    fetchMasters();
    fetchVacancies();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (certRef.current && !certRef.current.contains(event.target)) {
      setShowCertDrop(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDeptDrop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

// Update your existing fetchMasters or add a new useEffect
useEffect(() => {
  const fetchCompanyDetails = async () => {
    try {
      const res = await fetch("https://apihrr.goelectronix.co.in/companies");
      const data = await res.json();
      if (data && data.length > 0) {
        const firstCompany = data[0];
        setCompanyData(firstCompany);
        // Pre-fill the formData with first company data
        setFormData(prev => ({
          ...prev,
          company_id: firstCompany.id,
          // Syncing company metadata to form
          company_name: firstCompany.name,
          contact_person: firstCompany.contact_person || "sujit Hankare",
          company_email: firstCompany.email || "hr@goelectronix.co.in",
          company_phone: firstCompany.phone || "9004949483",
          organization_size: "11 - 50", // Standard default
          job_address: firstCompany.address || ""
        }));
      }
    } catch (err) {
      console.error("Company sync failed");
    }
  };
  fetchCompanyDetails();
}, []);



// const fetchMasters = async () => {
//   try {
//     const [deptRes, skillRes] = await Promise.all([
//       fetch("https://apihrr.goelectronix.co.in/departments"),
//       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100")
//     ]);
    
//     const deptData = await deptRes.json();
//     const skillData = await skillRes.json();
    
//     setDepartments(deptData || []);
//     setAllMasterSkills(skillData || []); // This holds all possible skills from DB
//   } catch (err) {
//     toast.error("Registry connection failed");
//   }
// };

// const fetchMasters = async () => {
//   try {
//     const [deptRes, skillRes, eduRes] = await Promise.all([
//       fetch("https://apihrr.goelectronix.co.in/departments"),
//       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100"),
//       fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100")
//     ]);
    
//     const deptData = await deptRes.json();
//     const skillData = await skillRes.json();
//     const eduData = await eduRes.json();
    
//     setDepartments(deptData || []);
//     setAllMasterSkills(skillData || []);
//     setAllMasterEducation(eduData || []); // Holds education master list
//   } catch (err) {
//     toast.error("Registry connection failed");
//   }
// };


const fetchMasters = async () => {
  try {
    const [deptRes, skillRes, eduRes, indRes] = await Promise.all([
      fetch("https://apihrr.goelectronix.co.in/departments"),
      fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100"),
      fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100"),
      fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100")
    ]);
    
    setDepartments(await deptRes.json() || []);
    setAllMasterSkills(await skillRes.json() || []);
    setAllMasterEducation(await eduRes.json() || []);
    setAllMasterIndustries(await indRes.json() || []); // Holds Industry master list
  } catch (err) {
    toast.error("Registry connection failed");
  }
};

  const fetchVacancies = async () => {
    setLoadingList(true);
    try {
      // Fetching with high limit as per your URL example
      const res = await fetch(
        "https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100",
      );
      const data = await res.json();
      setVacancies(data || []);
    } catch (err) {
      console.error("Failed to load vacancies");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;
    setIsFetchingPincode(true);
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const offices = data[0].PostOffice;
        setCityOptions(offices);
        // Auto-fill with first option
        setFormData((prev) => ({
          ...prev,
          city: offices[0].Name,
          location: offices[0].Name, // Syncing location with city
          state: offices[0].State,
          district: offices[0].District,
          country: offices[0].Country,
        }));
      }
    } catch (err) {
      toast.error("Geo-sync failed");
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const fetchJDDetails = async (jdId) => {
    // If we already have the data, don't fetch again
    if (templateDetails[jdId]) return;

    setLoadingJD(jdId);
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`,
      );
      const data = await res.json();
      setTemplateDetails((prev) => ({
        ...prev,
        [jdId]: data,
      }));
    } catch (err) {
      toast.error("Failed to fetch job protocol details");
    } finally {
      setLoadingJD(null);
    }
  };

  const generateExpOptions = () => {
    const options = [];
    options.push(
      <option key="0.5" value="0.5">
        6 Months
      </option>,
    );
    for (let i = 1; i <= 10; i++) {
      options.push(
        <option key={i} value={i}>
          {i} Year{i > 1 ? "s" : ""}
        </option>,
      );
    }
    return options;
  };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   const loadingToast = toast.loading("Executing Enterprise Deployment...");

//   try {
//     // Stage 1: Create Job Description
//     const jdBody = {
//       title: formData.title,
//       role: formData.title,
//       content: formData.content,
//       responsibilities: formData.responsibilities,
//       requirements: formData.requirements,
//       location: formData.location[0] || "", // Assuming string for JD
//       salary_range: `${formData.min_salary} - ${formData.max_salary}`,
//     };

//     const jdRes = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(jdBody),
//     });

//     if (!jdRes.ok) throw new Error("JD Protocol Failed");
//     const jdData = await jdRes.json();

//     // Stage 2: Create Complex Vacancy
//     const vacancyBody = {
//       title: formData.title,
//       number_of_openings: parseInt(formData.number_of_openings),
//       location: Array.isArray(formData.location) ? formData.location : [formData.location],
//       state: Array.isArray(formData.state) ? formData.state : [formData.state],
//       district: Array.isArray(formData.district) ? formData.district : [formData.district],
//       city: Array.isArray(formData.city) ? formData.city : [formData.city],
//       pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
//       job_type: formData.job_type,
//       cand_type: formData.cand_type,
//       experience_required: formData.experience_required,
//       min_age: parseInt(formData.min_age),
//       max_age: parseInt(formData.max_age),
//       min_salary: parseFloat(formData.min_salary),
//       max_salary: parseFloat(formData.max_salary),
//       bonus_offered: formData.bonus_offered,
//       bonus_amount: parseFloat(formData.bonus_amount),
//       bonus_type: formData.bonus_type,
//       skills_req: formData.skills_req,
//       spoken_languages: formData.spoken_languages,
//       assets_req: formData.assets_req,
//       certificates_req: formData.certificates_req,
//       office_timings: formData.office_timings,
//       interview_timings: formData.interview_timings,
//       cand_can_call: formData.cand_can_call,
//       call_timings: formData.call_timings,
//       status: formData.status,
//       deadline_date: formData.deadline_date,
//       job_description_id: jdData.id,
//       department_id: Array.isArray(formData.department_id) 
//     ? parseInt(formData.department_id[0] || 0) 
//     : parseInt(formData.department_id || 0),
//       company_id: parseInt(formData.company_id),
//       industry_id: parseInt(formData.industry_id),
//       degree_ids: formData.degree_ids,
//     };

//     const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(vacancyBody),
//     });

//     if (!vacancyRes.ok) {
//         const err = await vacancyRes.json();
//         console.error("Payload Validation Error:", err);
//         throw new Error("Vacancy Schema Validation Failed");
//     }

//     toast.success("Vacancy Protocol Active! 🚀", { id: loadingToast });
//     fetchVacancies();
//     // Reset logic here...

//   } catch (err) {
//     toast.error(err.message, { id: loadingToast });
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const loadingToast = toast.loading("Executing Enterprise Deployment...");

  try {
    // --- STAGE 0: CONDITIONAL COMPANY REGISTRY SYNC ---
    // Check if company fields have been modified compared to the initial fetch
    const hasCompanyChanges = 
      formData.company_name !== companyData?.name ||
      formData.contact_person !== (companyData?.contact_person || "sujit Hankare") ||
      formData.company_email !== (companyData?.email || "hr@goelectronix.co.in") ||
      formData.company_phone !== (companyData?.phone || "9004949483") ||
      formData.job_address !== (companyData?.address || "");

    // Only call the API if changes exist and we have a valid company ID
    if (hasCompanyChanges && formData.company_id) {
      toast.loading("Syncing Company Registry...", { id: loadingToast });
      
      const companyUpdateBody = {
        name: formData.company_name,
        contact_person: formData.contact_person,
        email: formData.company_email,
        phone: formData.company_phone,
        address: formData.job_address,
        size_of_organization: formData.organization_size 
      };

      const companyUpdateRes = await fetch(`https://apihrr.goelectronix.co.in/companies/${formData.company_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyUpdateBody),
      });

      if (!companyUpdateRes.ok) throw new Error("Company Registry Sync Failed");
    }

    // Stage 1: Create Job Description (Original Code Below)
    const jdBody = {
      title: formData.title,
      role: formData.title,
      content: formData.content,
      responsibilities: formData.responsibilities,
      requirements: formData.requirements,
      location: formData.location[0] || "", // Assuming string for JD
      salary_range: `${formData.min_salary} - ${formData.max_salary}`,
    };

    const jdRes = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jdBody),
    });

    if (!jdRes.ok) throw new Error("JD Protocol Failed");
    const jdData = await jdRes.json();

    // Stage 2: Create Complex Vacancy (Original Code Below)
    // const vacancyBody = {
    //   title: formData.title,
    //   number_of_openings: parseInt(formData.number_of_openings),
    //   location: Array.isArray(formData.location) ? formData.location : [formData.location],
    //   state: Array.isArray(formData.state) ? formData.state : [formData.state],
    //   district: Array.isArray(formData.district) ? formData.district : [formData.district],
    //   city: Array.isArray(formData.city) ? formData.city : [formData.city],
    //   pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
    //   job_type: formData.job_type,
    //   cand_type: formData.cand_type,
    //   experience_required: formData.experience_required,
    //   min_age: parseInt(formData.min_age),
    //   max_age: parseInt(formData.max_age),
    //   min_salary: parseFloat(formData.min_salary),
    //   max_salary: parseFloat(formData.max_salary),
    //   bonus_offered: formData.bonus_offered,
    //   bonus_amount: parseFloat(formData.bonus_amount),
    //   bonus_type: formData.bonus_type,
    //   skills_req: formData.skills_req,
    //   spoken_languages: formData.spoken_languages.join(", "), // Transformed to String
    //   assets_req: formData.assets_req.join(", "),             // Transformed to String
    //   certificates_req: formData.certificates_req,
    //   office_timings: formData.office_timings,
    //   interview_timings: formData.interview_timings,
    //   cand_can_call: formData.cand_can_call,
    //   call_timings: formData.call_timings,
    //   status: formData.status,
    //   deadline_date: formData.deadline_date,
    //   job_description_id: jdData.id,
    //   department_id: Array.isArray(formData.department_id) 
    // ? parseInt(formData.department_id[0] || 0) 
    // : parseInt(formData.department_id || 0),
    //   company_id: parseInt(formData.company_id),
    //   industry_id: parseInt(formData.industry_id),
    //   degree_ids: formData.degree_ids,
    // };

    // Inside handleSubmit -> Stage 2: Create Complex Vacancy
const vacancyBody = {
      title: formData.title,
      number_of_openings: parseInt(formData.number_of_openings),
      location: Array.isArray(formData.location) ? formData.location : [formData.location],
      state: Array.isArray(formData.state) ? formData.state : [formData.state],
      district: Array.isArray(formData.district) ? formData.district : [formData.district],
      city: Array.isArray(formData.city) ? formData.city : [formData.city],
      pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
      job_type: formData.job_type,
      
      // OMIT CAND_TYPE IF EMPTY
    //   ...(formData.cand_type && { cand_type: formData.cand_type }),

   cand_type: formData.cand_type,

      experience_required: formData.experience_required,
      // SEND NUMERIC PARAMETERS HERE
  min_experience: parseFloat(formData.min_experience),
  max_experience: parseFloat(formData.max_experience),
      min_age: parseInt(formData.min_age),
      max_age: parseInt(formData.max_age),
      min_salary: parseFloat(formData.min_salary),
      max_salary: parseFloat(formData.max_salary),
      bonus_offered: formData.bonus_offered,
      bonus_amount: parseFloat(formData.bonus_amount),
      bonus_type: formData.bonus_type,
      skills_req: formData.skills_req,
      spoken_languages: formData.spoken_languages, // Sent as valid List
      assets_req: formData.assets_req,             // Sent as valid List
      certificates_req: formData.certificates_req,
      office_timings: formData.office_timings,
      interview_timings: formData.interview_timings,
      cand_can_call: formData.cand_can_call,
      call_timings: formData.call_timings,
      status: formData.status,
      deadline_date: formData.deadline_date,
      job_description_id: jdData.id,
      department_id: Array.isArray(formData.department_id) 
        ? parseInt(formData.department_id[0] || 0) 
        : parseInt(formData.department_id || 0),
      company_id: parseInt(formData.company_id),
      industry_id: parseInt(formData.industry_id),
      degree_ids: formData.degree_ids,
    };

    const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacancyBody),
    });

    if (!vacancyRes.ok) {
        const err = await vacancyRes.json();
        console.error("Payload Validation Error:", err);
        throw new Error("Vacancy Schema Validation Failed");
    }

    toast.success("Vacancy Protocol Active! 🚀", { id: loadingToast });
    fetchVacancies();
    // Reset logic here...

  } catch (err) {
    toast.error(err.message, { id: loadingToast });
  } finally {
    setLoading(false);
  }
};


  const toggleAccordion = (vacancy) => {
    const isOpening = openAccordionId !== vacancy.id;
    setOpenAccordionId(isOpening ? vacancy.id : null);

    if (isOpening && vacancy.job_description_id) {
      fetchJDDetails(vacancy.job_description_id);
    }
  };


const handleCommitCert = (name) => {
  const cleanName = name.trim();
  if (!cleanName) return;

  // Prevent duplicate protocols
  if (!formData.certificates_req.includes(cleanName)) {
    setFormData({
      ...formData,
      certificates_req: [...formData.certificates_req, cleanName]
    });
    toast.success(`Protocol ${cleanName} Added`);
  } else {
    toast.error("Protocol already exists in registry");
  }
  
  // Clear states and hide dropdown
  setCertSearch("");
  setShowCertDrop(false);
};



  // Pagination Calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vacancies.length / itemsPerPage);

  const inputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
  const labelClass =
    "text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER STRIP */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <ShieldCheck
            className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none"
            size={120}
          />
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Zap size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                Vacancy
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <Layers size={12} className="text-blue-500" /> Recruitment
                System
              </p>
            </div>
          </div>
        </div>

        {/* --- EXISTING FORM LOGIC --- */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">

          
{/* <div className="space-y-3 w-full">
  <label className={labelClass}>
    Job Type <span className="text-red-500">*</span>
  </label>
  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
    {["Full Time", "Part Time"].map((type) => {
      const isActive = formData.job_type === type;
      return (
        <button
          key={type}
          type="button"
          onClick={() => setFormData({ ...formData, job_type: type })}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
            isActive
              ? "!bg-[#2563eb] text-white shadow-lg scale-[1.02]"
              : "!text-slate-500 hover:!text-slate-700 !bg-transparent"
          }`}
        >
          {type}
        </button>
      );
    })}
  </div>
</div> */}


{/* JOB TYPE SELECTOR - ENTERPRISE EDITION */}
<div className="space-y-4 w-full pt-2">
  <div className="flex items-center justify-between ml-1">
    <label className={labelClass}>
      Job Type 
    </label>
    {/* Dynamic Status Badge */}

  </div>

  <div className="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/60 w-full relative overflow-hidden backdrop-blur-sm shadow-inner">
    {["Full Time", "Part Time"].map((type) => {
      const isActive = formData.job_type === type;
      return (
        <button
          key={type}
          type="button"
          onClick={() => setFormData({ ...formData, job_type: type })}
          className={`relative flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 group ${
            isActive
              ? "!bg-white !text-blue-500 shadow-[0_8px_16px_-6px_rgba(37,99,235,0.2)] border !border-blue-100 scale-[1.01] z-10"
              : "!text-slate-500 hover:!text-slate-700 !bg-transparent opacity-70 hover:opacity-100"
          }`}
        >
          {/* Dynamic Icon Integration */}
          <div className={`p-1 rounded-md transition-all duration-300 ${isActive ? "!bg-blue-50" : "!bg-slate-200 group-hover:!bg-slate-300"}`}>
            {type === "Full Time" ? (
              <Zap size={12} strokeWidth={3} className={isActive ? "!text-blue-600" : "!text-slate-400"} />
            ) : (
              <Clock size={12} strokeWidth={3} className={isActive ? "!text-blue-600" : "!text-slate-400"} />
            )}
          </div>
          
          {type}

          {/* Active Status Indicator */}
          {/* {isActive && (
            <div className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </div>
          )} */}
        </button>
      );
    })}
  </div>
  

</div>
              {/* Department Multi-Select */}
              {/* <div className="relative" ref={dropdownRef}>
                <label className={labelClass}>Department</label>
                <div
                  onClick={() => setShowDeptDrop(!showDeptDrop)}
                  className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
                >
                  {formData.department_id.length > 0 ? (
                    formData.department_id.map((id) => (
                      <span
                        key={id}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95"
                      >
                        {
                          departments.find(
                            (d) => d.id.toString() === id.toString(),
                          )?.name
                        }
                        <X
                          size={12}
                          className="hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({
                              ...formData,
                              department_id: formData.department_id.filter(
                                (item) => item !== id,
                              ),
                            });
                          }}
                        />
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      Select department...
                    </span>
                  )}
                </div>
                {showDeptDrop && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-50">
                      <input
                        autoFocus
                        placeholder="Filter department..."
                        value={deptSearch}
                        onChange={(e) => setDeptSearch(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2">
                      {departments
                        .filter((d) =>
                          d.name
                            .toLowerCase()
                            .includes(deptSearch.toLowerCase()),
                        )
                        .map((dept) => (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => {
                              const isSelected =
                                formData.department_id.includes(
                                  dept.id.toString(),
                                );
                              setFormData({
                                ...formData,
                                department_id: isSelected
                                  ? formData.department_id.filter(
                                      (i) => i !== dept.id.toString(),
                                    )
                                  : [
                                      ...formData.department_id,
                                      dept.id.toString(),
                                    ],
                              });
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
                          >
                            {dept.name}{" "}
                            {formData.department_id.includes(
                              dept.id.toString(),
                            ) && <Check size={14} strokeWidth={3} />}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div> */}

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input
                    required
                    placeholder="Job Title"
                    className={inputClass}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Opening</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.number_of_openings}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        number_of_openings: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
  <label className={labelClass}>District</label>
  <div className="relative group">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
      <MapPin size={14} strokeWidth={2.5} />
    </div>
    <input
      required
      placeholder="e.g. Mumbai, Maharashtra"
      className={`${inputClass} pl-10`}
      value={formData.location}
      onChange={(e) =>
        setFormData({ ...formData, location: e.target.value })
      }
    />
  </div>
</div>
         <div>
  <label className={labelClass}>city</label>
  <div className="relative group">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
      <MapPin size={14} strokeWidth={2.5} />
    </div>
    <input
      required
      placeholder="e.g. Mumbai, Maharashtra"
      className={`${inputClass} pl-10`}
      value={formData.district}
      onChange={(e) =>
        setFormData({ ...formData, district: e.target.value })
      }
    />
  </div>
</div>
              </div>


              {/* Experience Logic */}
              {/* <div className="pt-2">
                <label className={labelClass}>Experience</label>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
                  {["Fresher", "Experienced"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          experience_required:
                            type === "Fresher" ? "Fresher" : "1 - 3 Years",
                        })
                      }
                      className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${(type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
                {formData.experience_required !== "Fresher" && (
                  <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
                    <select
                      className={inputClass}
                      value={formData.experience_required.split(" - ")[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || "1"} Years`,
                        })
                      }
                    >
                      {generateExpOptions()}
                    </select>
                    <select
                      className={inputClass}
                      value={formData.experience_required
                        .split(" - ")[1]
                        ?.replace(" Years", "")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`,
                        })
                      }
                    >
                      {generateExpOptions()}
                    </select>
                  </div>
                )}
              </div> */}

            {/* EXPERIENCE LEVEL SELECTOR - ENTERPRISE EDITION */}
<div className="space-y-4 pt-2">
  <div className="flex items-center justify-between ml-1">
    <label className={labelClass}>Experience Protocol</label>
    {/* Micro-badge for status */}
    <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
      {formData.experience_required === "Fresher" ? "Entry Level" : "Lateral Hire"}
    </span>
  </div>

  {/* Main Toggle Container */}
  <div className="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/60 w-full relative overflow-hidden backdrop-blur-sm shadow-inner">
    {["Fresher", "Experienced"].map((type) => {
      const isActive = (type === "Fresher" && formData.experience_required === "Fresher") || 
                       (type === "Experienced" && formData.experience_required !== "Fresher");
      return (
        <button
          key={type}
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              experience_required: type === "Fresher" ? "Fresher" : "1 - 3 Years",
            })
          }
          className={`relative flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 group ${
            isActive
              ? "!bg-white !text-[#2563eb] shadow-[0_8px_16px_-6px_rgba(37,99,235,0.2)] border !border-blue-100 scale-[1.01] z-10"
              : "!text-slate-500 hover:!text-slate-700 !bg-transparent opacity-70 hover:opacity-100"
          }`}
        >
          {/* Contextual Icon Box */}
          <div className={`p-1 rounded-md transition-colors duration-300 ${isActive ? "bg-blue-50" : "bg-slate-200 group-hover:bg-slate-300"}`}>
            {type === "Fresher" ? <Zap size={12} strokeWidth={3} /> : <Briefcase size={12} strokeWidth={3} />}
          </div>
          {type}
        </button>
      );
    })}
  </div>

  {/* Conditional Multi-Select Range */}
  {/* {formData.experience_required !== "Fresher" && (
    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] animate-in zoom-in-95 duration-300 relative">
      <div className="space-y-1.5">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Years</span>
        <div className="relative group">
           <select
            className={`${inputClass} !bg-white focus:!border-blue-600 pl-3 pr-8 appearance-none`}
            value={formData.experience_required.split(" - ")[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || "1"} Years`,
              })
            }
          >
            {generateExpOptions()}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Years</span>
        <div className="relative group">
          <select
            className={`${inputClass} !bg-white focus:!border-blue-600 pl-3 pr-8 appearance-none`}
            value={formData.experience_required.split(" - ")[1]?.replace(" Years", "")}
            onChange={(e) =>
              setFormData({
                ...formData,
                experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`,
              })
            }
          >
            {generateExpOptions()}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )} */}
  {/* Conditional Multi-Select Range */}
{formData.experience_required !== "Fresher" && (
  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] animate-in zoom-in-95 duration-300 relative">
    <div className="space-y-1.5">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Years</span>
      <div className="relative group">
         <select
          className={`${inputClass} !bg-white focus:!border-blue-600 pl-3 pr-8 appearance-none`}
          value={formData.min_experience} // Bind to numeric state
          onChange={(e) => {
            const minVal = parseFloat(e.target.value);
            setFormData({
              ...formData,
              min_experience: minVal,
              // Keep the string for the Template logic
              experience_required: `${minVal} - ${formData.max_experience || "1"} Years`,
            });
          }}
        >
          {generateExpOptions()}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>

    <div className="space-y-1.5">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Years</span>
      <div className="relative group">
        <select
          className={`${inputClass} !bg-white focus:!border-blue-600 pl-3 pr-8 appearance-none`}
          value={formData.max_experience} // Bind to numeric state
          onChange={(e) => {
            const maxVal = parseFloat(e.target.value);
            setFormData({
              ...formData,
              max_experience: maxVal,
              // Keep the string for the Template logic
              experience_required: `${formData.min_experience || "0"} - ${maxVal} Years`,
            });
          }}
        >
          {generateExpOptions()}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  </div>
)}
</div>

            


              {/* SALARY RANGE GRID */}
<div className="grid grid-cols-1 gap-4 pt-2">
  <div className="space-y-2 pt-2">
    <label className={labelClass}>Salary (LPA)</label>
    <div className="grid grid-cols-2 gap-4 items-center">
      
      {/* MIN SALARY NODE */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
          <IndianRupee size={12} strokeWidth={3} />
        </div>
        <input
          type="number"
          step="0.1"
          placeholder="Min"
          className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          value={formData.min_salary}
          onChange={(e) => 
            setFormData({ ...formData, min_salary: e.target.value })
          }
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
            Min
          </span>
        </div>
      </div>

      {/* MAX SALARY NODE */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
          <IndianRupee size={12} strokeWidth={3} />
        </div>
        <input
          type="number"
          step="0.1"
          placeholder="Max"
          className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          value={formData.max_salary}
          onChange={(e) => 
            setFormData({ ...formData, max_salary: e.target.value })
          }
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
            Max
          </span>
        </div>
      </div>

    </div>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      Annual CTC Range in Lakhs
    </p>
  </div>
</div>

<div>
    {/* BONUS PROTOCOL SECTION */}
{/* <div className="space-y-4 pt-4 border-t border-slate-100">
  <div className="flex items-center justify-between">
    <label className={labelClass}>
      Bonus offered in addition to salary? <span className="text-red-500">*</span>
    </label>
    

    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
      {[
        { label: "YES", value: true },
        { label: "NO", value: false }
      ].map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => setFormData({ ...formData, bonus_offered: opt.value })}
          className={`px-6 py-1.5 text-[10px] font-black rounded-lg transition-all ${
            formData.bonus_offered === opt.value
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>



  
  {formData.bonus_offered && (
    <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-top-2 duration-300">
      <div className="space-y-2">
        <label className={labelClass}>Max Bonus Amount</label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
            <IndianRupee size={12} strokeWidth={3} />
          </div>
          <input
            type="number"
            placeholder="e.g. 50000"
            className={`${inputClass} pl-9`}
            value={formData.bonus_amount || ""}
            onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Bonus Type</label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
            <Award size={14} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="e.g. Performance, Sign-on"
            className={`${inputClass} pl-9`}
            value={formData.bonus_type}
            onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
          />
        </div>
      </div>
    </div>
  )}
</div> */}



{/* BONUS PROTOCOL SECTION - STREAMLINED ENTERPRISE UI */}
<div className="space-y-4 pt-6 border-t border-slate-100/80">
  {/* Single attractive header row */}
  <div className="flex items-center justify-between px-1">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-blue-50 text-[#2563eb] rounded-lg border border-blue-100 shadow-sm">
        <Zap size={14} strokeWidth={2.5} />
      </div>
     <div className="flex flex-col">
  <label className={`${labelClass} !mb-0`}>
    Bonus offered
  </label>
  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
    In addition to salary? 
  </span>
</div>
    </div>
    
    {/* Compact Glassmorphism Toggle */}
    <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200">
      {[
        { label: "YES", value: true, icon: <Check size={10} strokeWidth={4} /> },
        { label: "NO", value: false, icon: <X size={10} strokeWidth={4} /> }
      ].map((opt) => {
        const isActive = formData.bonus_offered === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => setFormData({ ...formData, bonus_offered: opt.value })}
            className={`flex items-center gap-2 px-5 py-1.5 text-[9px] font-black rounded-lg transition-all duration-500 ${
              isActive
                ? "!bg-white !text-blue-500 shadow-sm border !border-blue-100 scale-[1.03] z-10"
                : "!text-slate-400 hover:!text-slate-600 !bg-transparent"
            }`}
          >
            {opt.label}
            {isActive && <span className="animate-in zoom-in duration-300">{opt.icon}</span>}
          </button>
        );
      })}
    </div>
  </div>

  {/* Nested Detail Card */}
  {formData.bonus_offered && (
    <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-[2rem] animate-in slide-in-from-top-4 fade-in duration-500 relative overflow-hidden">
      {/* Background Security Watermark */}
      <ShieldCheck className="absolute -right-6 -bottom-6 text-blue-600 opacity-[0.03] -rotate-12" size={120} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {/* MAX BONUS FIELD */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Bonus (₹)</span>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 !bg-white rounded-md !text-slate-300 group-focus-within:!text-[#2563eb] border !border-slate-100 transition-all shadow-sm">
              <IndianRupee size={10} strokeWidth={3} />
            </div>
            <input
              type="number"
              placeholder="e.g. 50,000"
              className={`${inputClass} pl-10 !bg-white border-slate-200 focus:border-[#2563eb] !rounded-xl !py-2`}
              value={formData.bonus_amount || ""}
              onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
            />
          </div>
        </div>

        {/* BONUS TYPE FIELD */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Bonus Category</span>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-white rounded-md text-slate-300 group-focus-within:text-[#2563eb] border border-slate-100 transition-all shadow-sm">
              <Award size={12} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="e.g. Performance Linked"
              className={`${inputClass} pl-10 !bg-white border-slate-200 focus:border-[#2563eb] !rounded-xl !py-2`}
              value={formData.bonus_type}
              onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
            />
          </div>
        </div>
      </div>
    
    </div>
  )}
</div>

  {/* CANDIDATE CALL PROTOCOL */}
{/* <div className="space-y-4 pt-6 border-t border-slate-100">
  <div className="space-y-3">
    <label className={labelClass}>
      Candidates can call me <span className="text-red-500">*</span>
    </label>
    
    
    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
      {["Everyday", "Monday to Friday", "Monday to Saturday"].map((option) => {
        const isActive = formData.cand_can_call === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setFormData({ ...formData, cand_can_call: option })}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-[#2563eb] text-white shadow-lg scale-[1.02]"
                : "text-slate-500 hover:text-slate-700 bg-transparent"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>

  
  <div className="space-y-2 max-w-md">
    <label className={labelClass}>Call Timings</label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
        <Clock size={16} strokeWidth={2.5} />
      </div>
      <input
        type="text"
        placeholder="e.g. 10 AM to 6 PM"
        className={`${inputClass} pl-11`}
        value={formData.call_timings}
        onChange={(e) => setFormData({ ...formData, call_timings: e.target.value })}
      />
    </div>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      Specify your availability for candidate inquiries
    </p>
  </div>
</div> */}


{/* CANDIDATE CALL PROTOCOL - ENTERPRISE UI */}
<div className="space-y-6 pt-8 border-t border-slate-100/80">
  
  {/* Multi-line Label with High-Impact Icon */}
  {/* <div className="flex items-start gap-3 px-1">
    <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
      <Users size={18} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col">
      <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px]`}>
        Candidates can call me
      </label>
    </div>
  </div> */}
  <div className="flex items-start gap-3 px-1">
    <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
      <Users size={18} strokeWidth={2.5} />
      
    </div>
    <div className="flex flex-col py-2">
      <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px]`}>
        Candidates can call me
      </label>
    </div>
  </div>

  {/* Elevated Multi-Toggle Card */}
  <div className="bg-white p-2 rounded-[2rem] border border-slate-200/60 shadow-sm">
    <div className="flex bg-slate-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 w-full overflow-hidden">
      {["Everyday", "Mon to Fri", "Mon to Sat"].map((option) => {
        const isActive = formData.cand_can_call === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setFormData({ ...formData, cand_can_call: option })}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 ${
              isActive
                ? "!bg-white !text-[#2563eb] shadow-[0_4px_12px_-4px_rgba(37,99,235,0.3)] border !border-blue-100 scale-[1.02] z-10"
                : "!text-slate-500 hover:text-slate-700 !bg-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {isActive && <Check size={12} strokeWidth={4} className="animate-in zoom-in" />}
            {option}
          </button>
        );
      })}
    </div>
  </div>

  {/* Call Timings Input - Matching "Salary Strip" Depth */}
  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-center">
    <div className="space-y-2">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
        Calling Interview Time
      </span>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 rounded-lg text-slate-400 group-focus-within:text-[#2563eb] group-focus-within:bg-blue-50 border border-slate-100 transition-all">
          <Clock size={14} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="e.g. 10 AM to 6 PM"
          className={`${inputClass} pl-12 !bg-white border-slate-200 focus:border-[#2563eb] !rounded-xl !py-3 shadow-sm`}
          value={formData.call_timings}
          onChange={(e) => setFormData({ ...formData, call_timings: e.target.value })}
        />
      </div>
    </div>
    

  </div>
</div>





{/* SKILLS TAG REGISTRY SECTION - FULL VISIBILITY MODE */}
{/* SKILLS TAG REGISTRY - DATABASE LINKED */}
{/* <div className="space-y-4 pt-6 border-t border-slate-100">
  <div className="flex items-center justify-between ml-1">
    <label className={labelClass}>
      Skills <span className="text-red-500">*</span>
    </label>
    <span className="text-[9px] font-black !text-[#2563eb] uppercase tracking-widest !bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
      {formData.skills_req.length} Selected for Deployment
    </span>
  </div>

  <div className="grid grid-cols-1 gap-4">
   
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
        <Search size={16} strokeWidth={2.5} />
      </div>
      <input
        type="text"
        placeholder="Required skills "
        className={`${inputClass} pl-12 py-3.5`}
        value={skillSearch}
        onChange={(e) => setSkillSearch(e.target.value)}
      />
    </div>

   
    <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
        Skills 
      </p>
      
      <div className="max-h-[250px] overflow-y-auto flex flex-wrap gap-2 custom-scrollbar">
        {allMasterSkills
          .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
          .map((skill) => {
            const isSelected = formData.skills_req.includes(skill.name);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  const updatedSkills = isSelected
                    ? formData.skills_req.filter(s => s !== skill.name)
                    : [...formData.skills_req, skill.name];
                  setFormData({ ...formData, skills_req: updatedSkills });
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-lg !shadow-blue-200"
                    : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
                }`}
              >
                {skill.name}
                {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} />}
              </button>
            );
          })}
        
        {allMasterSkills.length === 0 && (
          <div className="w-full py-10 flex flex-col items-center gap-2 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Syncing Master Skills...</span>
          </div>
        )}
      </div>
    </div>
  </div>

 
  
</div> */}


{/* SKILLS TAG REGISTRY - WITH SELECTION BADGES */}
{/* <div className="space-y-4 pt-6 border-t border-slate-100">
  <div className="flex items-center justify-between ml-1">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
        <Zap size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px] leading-none`}>
          Skills Registry <span className="text-red-500 font-bold ml-0.5">*</span>
        </label>
      </div>
    </div>
    <span className="text-[9px] font-black !text-[#2563eb] uppercase tracking-widest !bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
      {formData.skills_req.length} SECURE NODES
    </span>
  </div>

  <div className="grid grid-cols-1 gap-4">
    
    <div className="flex flex-wrap gap-2 min-h-[40px] px-1">
      {formData.skills_req.map((skillName, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 !bg-[#2563eb] !text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100"
        >
          {skillName}
          <X 
            size={13} 
            className="cursor-pointer hover:text-red-200 transition-colors" 
            strokeWidth={3}
            onClick={() => setFormData({
              ...formData,
              skills_req: formData.skills_req.filter(s => s !== skillName)
            })}
          />
        </div>
      ))}
      {formData.skills_req.length === 0 && (
        <p className="text-[11px] font-bold text-slate-300 italic py-2">No skills committed to registry yet...</p>
      )}
    </div>

    
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
        <Search size={16} strokeWidth={2.5} />
      </div>
      <input
        type="text"
        placeholder="Search master registry or type custom skill..."
        className={`${inputClass} pl-12 py-3.5 !bg-slate-50 focus:!bg-white transition-all`}
        value={skillSearch}
        onChange={(e) => setSkillSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && skillSearch.trim()) {
            e.preventDefault();
            const val = skillSearch.trim();
            if (!formData.skills_req.includes(val)) {
              setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
              setSkillSearch("");
              toast.success(`Skill "${val}" Committed`);
            }
          }
        }}
      />
      
    
      {skillSearch.trim() && !allMasterSkills.some(s => s.name.toLowerCase() === skillSearch.toLowerCase()) && (
        <button
          type="button"
          onClick={() => {
            const val = skillSearch.trim();
            if (!formData.skills_req.includes(val)) {
              setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
              setSkillSearch("");
              toast.success(`Custom Skill Linked`);
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-2 hover:bg-black transition-all animate-in fade-in zoom-in-95"
        >
          <Plus size={12} strokeWidth={3} /> Add Custom
        </button>
      )}
    </div>

  
    <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner relative overflow-hidden">
      <ShieldCheck className="absolute -right-6 -bottom-6 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" size={150} />
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 relative z-10">
        Available Master Protocols
      </p>
      
      <div className="max-h-[200px] overflow-y-auto flex flex-wrap gap-2.5 custom-scrollbar relative z-10">
        {allMasterSkills
          .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
          .map((skill) => {
            const isSelected = formData.skills_req.includes(skill.name);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  const updatedSkills = isSelected
                    ? formData.skills_req.filter(s => s !== skill.name)
                    : [...formData.skills_req, skill.name];
                  setFormData({ ...formData, skills_req: updatedSkills });
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-lg !shadow-blue-200 scale-[1.03]"
                    : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
                }`}
              >
                {skill.name}
                {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
              </button>
            );
          })}
      </div>
    </div>
  </div>
</div> */}

{/* SKILLS TAG REGISTRY - UNIFIED ENTERPRISE COLOR THEME */}
<div className="space-y-4 pt-6 border-t border-slate-100">
  <div className="flex items-center justify-between ml-1">
    <div className="flex items-center gap-3">
      {/* Branding Box with Primary Blue */}
      <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
        <Zap size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px] leading-none`}>
          Skills
        </label>
      </div>
    </div>
   
  </div>

  <div className="grid grid-cols-1 gap-4">
    {/* 1. SELECTION AREA - Primary Blue Badges */}
    <div className="flex flex-wrap gap-2 min-h-[40px] px-1">
      {formData.skills_req.map((skillName, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 !bg-white !text-[#2563eb] border !border-blue-50 rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-sm shadow-blue-100/50"
        >
          {skillName}
          <X 
            size={13} 
            className="cursor-pointer hover:!text-red-200 transition-colors" 
            strokeWidth={3}
            onClick={() => setFormData({
              ...formData,
              skills_req: formData.skills_req.filter(s => s !== skillName)
            })}
          />
        </div>
      ))}
      {formData.skills_req.length === 0 && (
        <p className="text-[11px] font-bold !text-slate-300 italic py-2">No skills committed to registry yet...</p>
      )}
    </div>

    {/* 2. SEARCH INPUT - Focused Blue State */}
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
        <Search size={16} strokeWidth={2.5} />
      </div>
      <input
        type="text"
        placeholder="Search skill"
        className={`${inputClass} pl-12 py-3.5 !bg-slate-50 focus:!bg-white focus:!border-[#2563eb] focus:!ring-4 focus:!ring-blue-500/10 transition-all`}
        value={skillSearch}
        onChange={(e) => setSkillSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && skillSearch.trim()) {
            e.preventDefault();
            const val = skillSearch.trim();
            if (!formData.skills_req.includes(val)) {
              setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
              setSkillSearch("");
              toast.success(`Skill "${val}" Committed`);
            }
          }
        }}
      />
      
      {/* MANUAL ADD BUTTON - High Contrast Slate-900 */}
      {skillSearch.trim() && !allMasterSkills.some(s => s.name.toLowerCase() === skillSearch.toLowerCase()) && (
        <button
          type="button"
          onClick={() => {
            const val = skillSearch.trim();
            if (!formData.skills_req.includes(val)) {
              setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
              setSkillSearch("");
              toast.success(`Custom Skill Linked`);
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 !bg-blue-500 !text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-2 hover:!bg-blue-500 transition-all animate-in fade-in zoom-in-95 active:scale-95"
        >
          <Plus size={12} strokeWidth={3} /> Add Custom
        </button>
      )}
    </div>

    {/* 3. MASTER POOL - Selection Colors Matched */}
    <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner relative overflow-hidden">
      <ShieldCheck className="absolute -right-6 -bottom-6 text-[#2563eb] opacity-[0.04] -rotate-12 pointer-events-none" size={150} />
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 relative z-10">
        skils
      </p>
      
      <div className="max-h-[200px] overflow-y-auto flex flex-wrap gap-2.5 custom-scrollbar relative z-10 pr-2">
        {allMasterSkills
          .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
          .map((skill) => {
            const isSelected = formData.skills_req.includes(skill.name);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  const updatedSkills = isSelected
                    ? formData.skills_req.filter(s => s !== skill.name)
                    : [...formData.skills_req, skill.name];
                  setFormData({ ...formData, skills_req: updatedSkills });
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? "!bg-white !border-white !text-[#2563eb] shadow-sm !shadow-blue-50 scale-[1.03]"
                    : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
                }`}
              >
                {skill.name}
                {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} className="text-slate-300" />}
              </button>
            );
          })}
      </div>
    </div>
  </div>
</div>


{/* PERSONAL & ADDITIONAL INFO HUB */}
<div className="space-y-6 pt-6 border-t border-slate-100">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100">
      <UserPlus size={18} strokeWidth={2.5} />
    </div>
    <h6 className="!text-[13px] font-black text-slate-800 uppercase tracking-widest">
      Personal Details, Education, & Additional Info
    </h6>
  </div>

  {/* TOGGLE SELECTORS - Matches Image 5 */}
  <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-[2rem]">
    {[
      { id: 'age', label: 'Age', icon: <Calendar size={14} /> },
      { id: 'languages', label: 'Preferred Language', icon: <Plus size={14} /> },
      { id: 'assets', label: 'Assets', icon: <Plus size={14} /> },
      { id: 'degree', label: 'Degree and Specialisation', icon: <Plus size={14} /> },
      { id: 'certification', label: 'Certification', icon: <Plus size={14} /> },
      { id: 'industry', label: 'Preferred Industry', icon: <Plus size={14} /> }
    ].map((item) => {
      const isAdded = activeDetails.includes(item.id);
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            setActiveDetails(prev => 
              prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
            );
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-300 ${
            isAdded 
              ? "!bg-white !border-[#2563eb] !text-[#2563eb] shadow-sm ring-2 !ring-blue-50" 
              : "!bg-white !border-slate-200 !text-slate-500 hover:border-slate-400"
          }`}
        >
          {item.label} {isAdded ? <Check size={14} strokeWidth={3} className="text-[#2563eb]" /> : item.icon}
        </button>
      );
    })}
  </div>

  {/* DYNAMIC FORM FIELDS - Conditioned on Toggles */}
  <div className="space-y-6">
    {/* AGE SECTION - Matches Image 5 Bottom */}
    {activeDetails.includes('age') && (
      <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group">
        <button 
          className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
          onClick={() => setActiveDetails(prev => prev.filter(i => i !== 'age'))}
        >
          <X size={18} strokeWidth={3} />
        </button>
        
        <label className={labelClass}>Candidate Age </label>
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Age</span>
            <input 
              type="number" 
              placeholder="Eg: 18" 
              className={inputClass}
              value={formData.min_age}
              onChange={(e) => setFormData({...formData, min_age: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Age</span>
            <input 
              type="number" 
              placeholder="Eg: 40" 
              className={inputClass}
              value={formData.max_age}
              onChange={(e) => setFormData({...formData, max_age: e.target.value})}
            />
          </div>
        </div>
      </div>
    )}


    {/* PREFERRED LANGUAGE REGISTRY */}
{activeDetails.includes('languages') && (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
    {/* Remove Section Button */}
    <button 
      type="button"
      className="absolute right-6 top-6 !bg-transparent !text-slate-300 hover:!text-red-500 transition-colors"
      onClick={() => {
        setActiveDetails(prev => prev.filter(i => i !== 'languages'));
        setFormData({...formData, spoken_languages: []}); // Clear data when removed
      }}
    >
      <X size={18} strokeWidth={3} />
    </button>

    <div className="flex items-center gap-2 mb-4">
      <label className={labelClass}>Preferred Language</label>
      <Info size={12} className="text-slate-400" />
    </div>

    <div className="flex flex-wrap gap-2">
      {MASTER_LANGUAGES.map((lang) => {
        const isSelected = formData.spoken_languages.includes(lang);
        return (
          <button
            key={lang}
            type="button"
            onClick={() => {
              const updated = isSelected
                ? formData.spoken_languages.filter(l => l !== lang)
                : [...formData.spoken_languages, lang];
              setFormData({ ...formData, spoken_languages: updated });
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-200 ${
              isSelected
                ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-md shadow-blue-100"
                : "!bg-white !border-slate-200 !text-slate-500 hover:border-slate-400"
            }`}
          >
            {lang}
            {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  </div>
)}


{/* DEGREE & SPECIALISATION REGISTRY */}
{activeDetails.includes('degree') && (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
    {/* Remove Section Button */}
    <button 
      type="button"
      className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
      onClick={() => {
        setActiveDetails(prev => prev.filter(i => i !== 'degree'));
        setFormData({...formData, degree_ids: []}); 
      }}
    >
      <X size={18} strokeWidth={3} />
    </button>

    <div className="flex items-center justify-between mb-4 mr-10">
      <label className={labelClass}>Degree</label>
      <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
        {formData.degree_ids.length} Qualifications Required
      </span>
    </div>

    {/* Selection Area */}
    <div className="space-y-4">
      {/* 1. Selected Degree Badges */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {formData.degree_ids.map((eduId) => {
          const edu = allMasterEducation.find(e => e.id === eduId);
          return (
            <span 
              key={eduId}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95"
            >
              {edu?.name}
              <X 
                size={12} 
                className="cursor-pointer hover:text-red-200 transition-colors" 
                onClick={() => setFormData({
                  ...formData,
                  degree_ids: formData.degree_ids.filter(id => id !== eduId)
                })}
              />
            </span>
          );
        })}
        {formData.degree_ids.length === 0 && (
          <p className="text-[11px] font-bold text-slate-400 italic py-1">Search and add mandatory degrees...</p>
        )}
      </div>

      {/* 2. Searchable Input Node */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
          <GraduationCap size={16} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="Choose Specialisation (e.g. B.Tech, MBA)..."
          className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
          value={eduSearch}
          onFocus={() => setShowEduDrop(true)}
          onChange={(e) => setEduSearch(e.target.value)}
        />

        {/* 3. Dropdown Menu */}
        {showEduDrop && (
          <div className="absolute left-0 right-0 top-full mt-2 max-h-56 !bg-white border !border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 border-b !border-slate-50 mb-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Education </p>
            </div>
            {allMasterEducation
              .filter(edu => 
                edu.name.toLowerCase().includes(eduSearch.toLowerCase()) && 
                !formData.degree_ids.includes(edu.id)
              )
              .map((edu) => (
                <button
                  key={edu.id}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      degree_ids: [...formData.degree_ids, edu.id]
                    });
                    setEduSearch("");
                    setShowEduDrop(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:!bg-blue-50 rounded-xl text-[11px] font-bold !text-slate-700 uppercase !bg-transparent tracking-tight transition-all flex items-center justify-between group/item"
                >
                  {edu.name}
                  <Plus size={14} className="text-slate-300 group-hover/item:text-[#2563eb]" />
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}


{/* PREFERRED INDUSTRY REGISTRY */}
{activeDetails.includes('industry') && (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
    {/* Remove Section Button */}
    <button 
      type="button"
      className="absolute right-6 !bg-transparent top-6 !text-slate-300 hover:text-red-500 transition-colors"
      onClick={() => {
        setActiveDetails(prev => prev.filter(i => i !== 'industry'));
        setFormData({...formData, industry_id: null}); 
      }}
    >
      <X size={18} strokeWidth={3} />
    </button>

    <div className="flex items-center gap-2 mb-4">
      <label className={labelClass}>Preferred Industry</label>
      <Info size={12} className="text-slate-400" />
    </div>

    {/* Selection Node */}
    <div className="space-y-4">
      {/* 1. Selected Industry Badge (Single Selection Logic) */}
      <div className="min-h-[40px]">
        {formData.industry_id ? (
          <div className="flex items-center gap-2 w-fit px-4 py-2 bg-[#2563eb] text-white rounded-xl text-[11px] font-black uppercase tracking-wider animate-in zoom-in-95">
            <Layers size={14} />
            {allMasterIndustries.find(i => i.id === formData.industry_id)?.name}
            <X 
              size={14} 
              className="cursor-pointer hover:!text-red-200 ml-1" 
              onClick={() => setFormData({...formData, industry_id: null})}
            />
          </div>
        ) : (
          <p className="text-[11px] font-bold text-slate-400 italic">No industry selected</p>
        )}
      </div>

      {/* 2. Searchable Input Node */}
      {!formData.industry_id && (
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
            <Search size={16} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search suggested industries (e.g. Finance, IT, Retail)..."
            className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
            value={industrySearch}
            onFocus={() => setShowIndustryDrop(true)}
            onChange={(e) => setIndustrySearch(e.target.value)}
          />

          {/* 3. Dropdown Menu */}
          {showIndustryDrop && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-60 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
              {allMasterIndustries
                .filter(ind => ind.name.toLowerCase().includes(industrySearch.toLowerCase()))
                .map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, industry_id: ind.id });
                      setIndustrySearch("");
                      setShowIndustryDrop(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:!bg-blue-50 !bg-transparent rounded-xl text-[11px] font-bold !text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item"
                  >
                    {ind.name}
                    <Plus size={14} className="text-slate-300 group-hover/item:text-[#2563eb]" />
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

{/* ASSETS REQUIREMENT REGISTRY */}
{activeDetails.includes('assets') && (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
    {/* Remove Section Button */}
    <button 
      type="button"
      className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
      onClick={() => {
        setActiveDetails(prev => prev.filter(i => i !== 'assets'));
        setFormData({...formData, assets_req: []}); 
      }}
    >
      <X size={18} strokeWidth={3} />
    </button>

    <div className="flex items-center justify-between mb-4 mr-10">
      <div className="flex items-center gap-2">
        <label className={labelClass}>Required Assets</label>
        <Info size={12} className="text-slate-400" />
      </div>
      <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
        {formData.assets_req.length} Items Mandatory
      </span>
    </div>

    {/* Asset Badge Pool - Matches Image 9 */}
    <div className="flex flex-wrap gap-2.5">
      {MASTER_ASSETS.map((asset) => {
        const isSelected = formData.assets_req.includes(asset);
        return (
          <button
            key={asset}
            type="button"
            onClick={() => {
              const updated = isSelected
                ? formData.assets_req.filter(a => a !== asset)
                : [...formData.assets_req, asset];
              setFormData({ ...formData, assets_req: updated });
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all duration-200 ${
              isSelected
                ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-md !shadow-blue-100 scale-[1.02]"
                : "!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-400"
            }`}
          >
            {asset}
            {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  </div>
)}


{/* CERTIFICATION REGISTRY - MANUAL MULTI-SELECT */}


{/* CERTIFICATION REGISTRY - INTELLIGENT SEARCH & CUSTOM ADD */}
{activeDetails.includes('certification') && (
  <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4" ref={certRef}>
    
    {/* Section Discard */}
    <button 
      type="button"
      className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
      onClick={() => {
        setActiveDetails(prev => prev.filter(i => i !== 'certification'));
        setFormData({...formData, certificates_req: []}); 
      }}
    >
      <X size={18} strokeWidth={3} />
    </button>

    <div className="flex items-center justify-between mb-5 mr-10">
      <div className="flex items-center gap-2">
        <label className={labelClass}>Certification </label>
        
      </div>
      <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
        {formData.certificates_req.length} SECURE REQS
      </span>
    </div>

    <div className="space-y-4">
      {/* 1. Registry Badges (Selected Data Above) */}
      <div className="flex flex-wrap gap-2.5 min-h-[40px]">
        {formData.certificates_req.map((certName, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100"
          >
            {certName}
            <X 
              size={13} 
              className="cursor-pointer hover:text-red-200 transition-colors" 
              strokeWidth={3}
              onClick={() => setFormData({
                ...formData,
                certificates_req: formData.certificates_req.filter(c => c !== certName)
              })}
            />
          </div>
        ))}
      </div>

      {/* 2. Intelligent Search/Entry Node */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
          <Search size={16} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="Click to view all or search..."
          className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
          value={certSearch}
          onFocus={() => setShowCertDrop(true)} // Shows all on click
          onChange={(e) => setCertSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && certSearch.trim()) {
               e.preventDefault();
               handleCommitCert(certSearch.trim());
            }
          }}
        />

        {/* 3. Predefined & Custom Dropdown Area */}
        {showCertDrop && (
          <div className="absolute left-0 right-0 top-full mt-3 max-h-64 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-[100] overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 border-t-4 border-t-[#2563eb]">
            
            {/* Header for Dropdown */}
            <div className="px-4 py-2 border-b border-slate-50 mb-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {certSearch ? `Results for "${certSearch}"` : 'Global Registry'}
              </p>
            </div>

            {/* List Item Logic */}
            {MANUAL_CERTIFICATES
              .filter(name => 
                name.toLowerCase().includes(certSearch.toLowerCase()) && 
                !formData.certificates_req.includes(name)
              )
              .map((name, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCommitCert(name)}
                  className="w-full text-left px-4 py-3 hover:!bg-blue-50 rounded-xl !bg-transparent text-[11px] font-bold !text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item mb-1"
                >
                  {name}
                  <PlusCircle size={14} className="text-slate-200 group-hover/item:text-[#2563eb]" />
                </button>
              ))}

            {/* CUSTOM ADD BUTTON: Appears if no exact match exists or if search is unique */}
            {certSearch.trim() !== "" && !MANUAL_CERTIFICATES.some(c => c.toLowerCase() === certSearch.toLowerCase()) && (
              <button
                type="button"
                onClick={() => handleCommitCert(certSearch)}
                className="w-full flex items-center justify-between px-4 py-4 bg-slate-900 text-white rounded-xl mt-2 hover:bg-black transition-all shadow-lg active:scale-95 border-2 border-blue-500/20"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[8px] font-black uppercase text-blue-400 leading-none mb-1.5">Add Custom Requirement</span>
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none truncate max-w-[250px]">Commit "{certSearch}"</span>
                </div>
                <Zap size={16} className="text-blue-400 fill-blue-400 animate-pulse" />
              </button>
            )}

            {/* Empty State when no results and no search text */}
            {!certSearch && MANUAL_CERTIFICATES.length === 0 && (
               <div className="p-4 text-center text-slate-400 text-[10px] font-bold uppercase">No Registry Data</div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}

  </div>
</div>

{/* TIMINGS & INTERVIEW PROTOCOL SECTION */}
<div className="space-y-6 pt-8 border-t border-slate-200/60">
  <div className="flex items-center gap-3 mb-2">
    <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
      <Clock size={18} strokeWidth={2.5} />
    </div>
    <h6 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">
      Operational & Interview Protocols
    </h6>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* JOB TIMINGS NODE */}
    <div className="space-y-3">
      <div className="flex items-center justify-between ml-1">
        <label className={`${labelClass} pt-5 !text-[10px]`}>
          Job Timings 
        </label>
      </div>
      <div className="relative group">
        <textarea
          required
          rows={3}
          placeholder="e.g. 9:30 AM - 6:30 PM | Monday to Saturday"
          className={`${inputClass} !h-auto py-4 leading-relaxed resize-none bg-white border-2 border-slate-100 focus:border-[#2563eb] shadow-sm`}
          value={formData.office_timings}
          onChange={(e) => setFormData({ ...formData, office_timings: e.target.value })}
        />
        <div className="absolute right-4 bottom-4 pointer-events-none">
          <Edit3 size={14} className="text-slate-200 group-focus-within:text-blue-200 transition-colors" />
        </div>
      </div>
    </div>

    {/* INTERVIEW DETAILS NODE */}
    <div className="space-y-3">
      <div className="flex items-center justify-between ml-1">
      <label className={`${labelClass} pt-5 !text-[10px]`}>
          Interview Details
        </label>
      </div>
      <div className="relative group">
        <textarea
          required
          rows={3}
          placeholder="e.g. 11:00 AM - 4:00 PM | Monday to Saturday"
          className={`${inputClass} !h-auto py-4 leading-relaxed resize-none bg-white border-2 border-slate-100 focus:border-[#2563eb] shadow-sm`}
          value={formData.interview_timings}
          onChange={(e) => setFormData({ ...formData, interview_timings: e.target.value })}
        />
        <div className="absolute right-4 bottom-4 pointer-events-none">
          <Users size={14} className="text-slate-200 group-focus-within:text-blue-200 transition-colors" />
        </div>
      </div>

    </div>
  </div>
</div>


{/* ABOUT YOUR COMPANY SECTION */}
<div className="space-y-6 pt-10 border-t-2 border-slate-100 mt-10">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl shadow-sm">
      <Briefcase size={18} strokeWidth={2.5} />
    </div>
    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
      About Your Company
    </h3>
  </div>

  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
    {/* Grid Row 1: Identity */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className={`${labelClass} !text-[10px]`}>Company Name <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          className={inputClass} 
          value={formData.company_name || ""} 
          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className={`${labelClass} !text-[10px]`}>Contact Person Name </label>
        <input 
          type="text" 
          className={inputClass} 
          value={formData.contact_person || ""} 
          onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
        />
      </div>
    </div>

    {/* Grid Row 2: Contact Protocol */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className={`${labelClass} !text-[10px]`}>Phone Number </label>
        <div className="flex gap-2">
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-400 flex items-center">
            +91
          </div>
          <input 
            type="tel" 
            className={inputClass} 
            value={formData.company_phone || ""} 
            onChange={(e) => setFormData({...formData, company_phone: e.target.value})}
          />
        </div>
        
      </div>
      <div className="space-y-2">
        <label className={`${labelClass} !text-[10px]`}>Email Id </label>
        <input 
          type="email" 
          className={inputClass} 
          value={formData.company_email || ""} 
          onChange={(e) => setFormData({...formData, company_email: e.target.value})}
        />
       
      </div>
    </div>

    {/* Grid Row 3: Organization Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className={`${labelClass} !text-[10px]`}>Person Profile </label>
        <select 
          className={inputClass}
          value={formData.contact_profile || "Owner/Partner"}
          onChange={(e) => setFormData({...formData, contact_profile: e.target.value})}
        >
          <option>Owner/Partner</option>
          <option>HR Manager</option>
          <option>Recruiter</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className={`${labelClass} !text-[10px]`}>Size of Org </label>
        <select 
          className={inputClass}
          value={formData.organization_size || ""}
          onChange={(e) => setFormData({...formData, organization_size: e.target.value})}
        >
          <option>1 - 10</option>
          <option>11 - 50</option>
          <option>51 - 200</option>
          <option>200+</option>
        </select>
      </div>
    </div>

    {/* Row 4: Job Address Node */}
    <div className="space-y-2">
      <label className={`${labelClass} !text-[10px]`}>Job Address </label>
      <textarea 
        rows={3} 
        className={`${inputClass} !h-auto py-4 resize-none`}
        placeholder="Please fill complete address, mention Landmark near your office"
        value={formData.job_address || ""}
        onChange={(e) => setFormData({...formData, job_address: e.target.value})}
      />
    </div>
  </div>
</div>

</div>

        

             

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <ShieldCheck size={20} /> Save Vacancy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    job Vacancy Template
                  </h3>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className={labelClass}>01. Overview</label>
                  <div className="enterprise-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(v) => setFormData({ ...formData, content: v })}
                      modules={quillModules}
                      placeholder="Describe the role summary..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>02. Responsibilities</label>
                  <div className="enterprise-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData.responsibilities}
                      onChange={(v) =>
                        setFormData({ ...formData, responsibilities: v })
                      }
                      modules={quillModules}
                      placeholder="List tactical duties..."
                    />
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <label className={labelClass}>03. Requirements</label>
                  <div className="enterprise-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData.requirements}
                      onChange={(v) =>
                        setFormData({ ...formData, requirements: v })
                      }
                      modules={quillModules}
                      placeholder="Skills and certifications..."
                    />
                  </div>
                </div> */}
                <div className="space-y-2">
  <div className="flex items-center justify-between">
    <label className={labelClass}>03. Requirements</label>
    <span className="text-[8px] font-black text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100 animate-pulse">
      Auto-Syncing with Node
    </span>
  </div>
  <div className="enterprise-editor shadow-sm">
    <ReactQuill
      theme="snow"
      value={formData.requirements}
      onChange={(v) => setFormData({ ...formData, requirements: v })}
      modules={quillModules}
      placeholder="Selection details will appear here automatically..."
    />
  </div>
</div>
              </div>
            </div>
          </div>
        </form>

        <hr className="border-slate-200" />

        {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Layers size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                Active Vacancies{" "}
              </h3>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {vacancies.length} Total Records Found
            </div>
          </div>

          <div className="space-y-4">
            {loadingList ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Fetching Vacancies...
                </p>
              </div>
            ) : (
              currentVacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Accordion Header */}
                  {/* <div
                    // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
                    onClick={() => toggleAccordion(vacancy)}
                    className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-slate-900 tracking-tight">
                          {vacancy.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                            <MapPin size={12} className="text-blue-500" />{" "}
                            {vacancy.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
                            <Briefcase className="text-blue-500" size={12} />{" "}
                            Experience :{" "}
                            {vacancy.experience_required || "Not Specified"}{" "}
                            Years
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
                            <Users size={12} className="text-blue-500" />{" "}
                            {vacancy.number_of_openings} Slots
                          </span>
                        </div>
                      </div>
                    </div>

      
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
                  
                      <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
                        <div className="flex items-center justify-end gap-1.5">
                          <IndianRupee
                            size={10}
                            className="text-slate-900 stroke-[3]"
                          />
                          <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
                    
                            {isNaN(vacancy.salary_range)
                              ? vacancy.salary_range
                              : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`}
                          </p>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
                          Annual CTC
                        </p>
                      </div>
                    
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Stop accordion from opening
                          navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
                        }}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
                        title="Edit Vacancy Node"
                      >
                        <Edit3 size={18} strokeWidth={2.5} />
                      </button>

                      <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

             
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAccordion(vacancy);
                        }}
                        className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
      ${
        openAccordionId === vacancy.id
          ? "bg-slate-900 border-slate-900 text-white shadow-slate-200"
          : "bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
      }`}
                      >
                        {openAccordionId === vacancy.id ? (
                          <X
                            size={18}
                            className="animate-in fade-in zoom-in duration-300 stroke-[2.5]"
                          />
                        ) : (
                          <Plus
                            size={18}
                            className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]"
                          />
                        )}
                      </div>
                    </div>
                  </div> */}
                  {/* Accordion Header */}
<div
  onClick={() => toggleAccordion(vacancy)}
  className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
>
  <div className="flex items-center gap-5 w-full md:w-auto">
    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 transition-all border border-blue-100 shadow-sm">
      <Briefcase size={24} />
    </div>
    <div>
      <h4 className="text-[15px] font-black text-slate-900 tracking-tight uppercase">
        {vacancy.title}
      </h4>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
          <MapPin size={12} className="text-blue-500" /> {vacancy.location[0]}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
          <Zap className="text-blue-500" size={12} /> {vacancy.job_type}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
          <Briefcase className="text-blue-500" size={12} /> {vacancy.min_experience}-{vacancy.max_experience} Years
        </span>
      </div>
    </div>
  </div>

  <div className="flex items-center gap-8">
    <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
      <div className="flex items-center justify-end gap-1.5">
        <IndianRupee size={10} className="text-slate-900 stroke-[3]" />
        <p className="text-[12px] font-black text-slate-900 uppercase">
          {vacancy.min_salary.toLocaleString()} - {vacancy.max_salary.toLocaleString()}
        </p>
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Annual CTC</p>
    </div>
    {/* Accordion Toggle Arrow */}
    <ChevronDown className={`text-slate-300 transition-transform duration-300 ${openAccordionId === vacancy.id ? "rotate-180 text-blue-600" : ""}`} size={20} />
  </div>
</div>

                  {/* Accordion Body */}
                  {/* {openAccordionId === vacancy.id && (
                    <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
                      {loadingJD === vacancy.job_description_id ? (
                        <div className="py-10 flex flex-col items-center justify-center gap-3">
                          <Loader2
                            className="animate-spin text-blue-600"
                            size={24}
                          />
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Retrieving Protocol...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                        
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                Job Role
                              </p>
                              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                                {templateDetails[vacancy.job_description_id]
                                  ?.title || vacancy.title}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                Job Number
                              </p>
                              <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
                                GOEX-V-{vacancy.id}-REF-
                                {vacancy.job_description_id}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                              <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                Job Description
                              </h5>
                            </div>

                            <div className="prose prose-slate max-w-full overflow-hidden">
                              <div
                                className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    templateDetails[vacancy.job_description_id]
                                      ?.content ||
                                    "No protocol content available for this node.",
                                }}
                              />
                            </div>
                          </div>

                      
                          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <button
                              onClick={() =>
                                navigate(`/vacancy-details/${vacancy.id}`)
                              }
                              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                              Read full job description <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )} */}

                  {/* Accordion Body */}
{openAccordionId === vacancy.id && (
  <div className="px-8 pb-10 pt-4 border-t border-slate-50 bg-slate-50/30 animate-in slide-in-from-top-2 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* COLUMN 1: REQUIREMENTS PROTOCOL */}
      <div className="space-y-4">
        <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={14} /> Requirements
        </h5>
        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Education</p>
            <p className="text-xs font-bold text-slate-700 uppercase">
              {vacancy.degrees.map(d => d.name).join(", ") || "No Degree Specified"}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Age</p>
            <p className="text-xs font-bold text-slate-700">{vacancy.min_age} - {vacancy.max_age} Years</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Mandatory Assets</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {vacancy.assets_req.map(asset => (
                <span key={asset} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">{asset}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2: SKILLS & LANGUAGES */}
      <div className="space-y-4">
        <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} /> Skills
        </h5>
        <div className="flex flex-wrap gap-2">
          {vacancy.skills_req.map(skill => (
            <span key={skill} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">
              {skill}
            </span>
          ))}
        </div>
        <div className="pt-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Languages Proficiency</p>
          <p className="text-xs font-bold text-slate-700 uppercase">{vacancy.spoken_languages.join(", ")}</p>
        </div>
      </div>

      {/* COLUMN 3: INCENTIVES & TIMINGS */}
      <div className="space-y-4">
        <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} /> Additional Information
        </h5>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          {vacancy.bonus_offered && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">Bonus </span>
              <span className="text-xs font-black text-slate-800">₹{vacancy.bonus_amount.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Call Time</p>
            <p className="text-[10px] font-bold text-slate-700 uppercase">{vacancy.cand_can_call} | {vacancy.call_timings}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Full JD Redirect */}
    <div className="mt-8 pt-6 border-t border-slate-100">
      <button onClick={() => navigate(`/vacancy-details/${vacancy.id}`)} className="flex !bg-transparent items-center gap-2 text-[10px] font-black !text-blue-600 uppercase tracking-widest hover:!text-blue-700 transition-all">
       Read full job description <ArrowRight size={14} />
      </button>
    </div>
  </div>
)}
                </div>
              ))
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-slate-400 border-slate-200 hover:border-blue-500"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
        .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
        .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `,
        }}
      />
    </div>
  );
};

export default VacanciesDummyPage;
//***********************************************working code phase 3 26/02/26*********************************************** */
// import React, { useState, useEffect, useRef } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate } from "react-router-dom";
// import "react-quill-new/dist/quill.snow.css";
// import {
//   Briefcase,
//   MapPin,
//   Users,
//   Calendar,
//   IndianRupee,
//   Layers,
//   ArrowRight,
//   GraduationCap,
//   FileText,
//   PlusCircle,
//   X,
//   Award,
//   UserPlus,
//   Info,
//   Edit3,
//   Search,
//   Check,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   ChevronDown,
//   Plus,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesDummyPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   // --- NEW STATE FOR LISTING & PAGINATION ---
//   const [vacancies, setVacancies] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [openAccordionId, setOpenAccordionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [deptSearch, setDeptSearch] = useState("");
//   const [showDeptDrop, setShowDeptDrop] = useState(false);
//   const dropdownRef = useRef(null);
//   const [skillInput, setSkillInput] = useState("");
//   const [cityOptions, setCityOptions] = useState([]);
//   const [allMasterSkills, setAllMasterSkills] = useState([]);
// const [skillSearch, setSkillSearch] = useState("");
// const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   // Add this with your other state declarations
// const [activeDetails, setActiveDetails] = useState([]);
// const [allMasterEducation, setAllMasterEducation] = useState([]);
// const [eduSearch, setEduSearch] = useState("");
// const [showEduDrop, setShowEduDrop] = useState(false);
// // Add to your state declarations
// const [allMasterIndustries, setAllMasterIndustries] = useState([]);
// const [industrySearch, setIndustrySearch] = useState("");
// const [showIndustryDrop, setShowIndustryDrop] = useState(false);
// // Add these inside your component
// const [certSearch, setCertSearch] = useState("");
// const [showCertDrop, setShowCertDrop] = useState(false);
// const certRef = useRef(null); // To handle clicking outside
// // Add to your state declarations
// const [companyData, setCompanyData] = useState(null);


// const [formData, setFormData] = useState({
//   title: "",
//   number_of_openings: 1,
//   // Geo-logic (Now lists)
//   location: [], 
//   state: [],
//   district: [],
//   city: [],
//   department_id: [],
//   pincode: [],
//   // New categorical fields
//   job_type: "Full Time",
//   cand_type: "",
//   experience_required: "",
//   min_age: 0,
//   max_age: 0,
//   // Salary splitting logic
//   min_salary: 0,
//   max_salary: 0,
//   bonus_offered: false,
//   bonus_amount: 0,
//   bonus_type: "",
//   // Requirement arrays
//   skills_req: [],
//   spoken_languages: [],
//   assets_req: [],
//   certificates_req: [],
//   // Timings & Contact
//   office_timings: "9:00 AM - 6:00 PM",
//   interview_timings: "10:00 AM - 4:00 PM",
//   cand_can_call: "",
//   call_timings: "10:00 AM - 5:00 PM",
//   // Metadata
//   status: "open",
//   deadline_date: new Date().toISOString().split("T")[0],
//   job_description_id: null,
//   company_id: 1, // Defaulting to 1 or your system ID
//   industry_id: null,
//   degree_ids: [],
//   // UI helper for Quills
//   content: "", 
//   responsibilities: "",
//   requirements: "",
// });

//   const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
//   const [loadingJD, setLoadingJD] = useState(null);


//   const MASTER_LANGUAGES = [
//   "English", "Hindi", "Marathi", "Punjabi", "Kannada", "Bengali", "Telugu", 
//   "Tamil", "Gujarati", "Urdu", "Malayalam", "Odia", "Assamese", "Santali", 
//   "Meitei (Manipuri)", "Sanskrit"
// ];

// const MANUAL_CERTIFICATES = [
//   "AWS Certified Solutions Architect",
//   "Google Cloud Professional Data Engineer",
//   "Certified Kubernetes Administrator (CKA)",
//   "Cisco Certified Network Associate (CCNA)",
//   "Microsoft Certified: Azure Fundamentals",
//   "CompTIA Security+",
//   "Project Management Professional (PMP)",
//   "Certified Ethical Hacker (CEH)",
//   "ITIL Foundation",
//   "Salesforce Certified Administrator"
// ];

// // Master list based on Image 9
// const MASTER_ASSETS = [
//   "Bike", "License", "Aadhar Card", "PAN Card", "Heavy Driver License", 
//   "Camera", "Laptop", "Auto / Rickshaw", "Tempo", "Tempo Traveller / Van", "Yulu / E-Bike"
// ];


//   // 1. Fetch Master Data & Vacancies
//   useEffect(() => {
//     fetchMasters();
//     fetchVacancies();
//   }, []);

//   useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (certRef.current && !certRef.current.contains(event.target)) {
//       setShowCertDrop(false);
//     }
//   };
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDeptDrop(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

// // Update your existing fetchMasters or add a new useEffect
// useEffect(() => {
//   const fetchCompanyDetails = async () => {
//     try {
//       const res = await fetch("https://apihrr.goelectronix.co.in/companies");
//       const data = await res.json();
//       if (data && data.length > 0) {
//         const firstCompany = data[0];
//         setCompanyData(firstCompany);
//         // Pre-fill the formData with first company data
//         setFormData(prev => ({
//           ...prev,
//           company_id: firstCompany.id,
//           // Syncing company metadata to form
//           company_name: firstCompany.name,
//           contact_person: firstCompany.contact_person || "sujit Hankare",
//           company_email: firstCompany.email || "hr@goelectronix.co.in",
//           company_phone: firstCompany.phone || "9004949483",
//           organization_size: "11 - 50", // Standard default
//           job_address: firstCompany.address || ""
//         }));
//       }
//     } catch (err) {
//       console.error("Company sync failed");
//     }
//   };
//   fetchCompanyDetails();
// }, []);



// // const fetchMasters = async () => {
// //   try {
// //     const [deptRes, skillRes] = await Promise.all([
// //       fetch("https://apihrr.goelectronix.co.in/departments"),
// //       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100")
// //     ]);
    
// //     const deptData = await deptRes.json();
// //     const skillData = await skillRes.json();
    
// //     setDepartments(deptData || []);
// //     setAllMasterSkills(skillData || []); // This holds all possible skills from DB
// //   } catch (err) {
// //     toast.error("Registry connection failed");
// //   }
// // };

// // const fetchMasters = async () => {
// //   try {
// //     const [deptRes, skillRes, eduRes] = await Promise.all([
// //       fetch("https://apihrr.goelectronix.co.in/departments"),
// //       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100"),
// //       fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100")
// //     ]);
    
// //     const deptData = await deptRes.json();
// //     const skillData = await skillRes.json();
// //     const eduData = await eduRes.json();
    
// //     setDepartments(deptData || []);
// //     setAllMasterSkills(skillData || []);
// //     setAllMasterEducation(eduData || []); // Holds education master list
// //   } catch (err) {
// //     toast.error("Registry connection failed");
// //   }
// // };


// const fetchMasters = async () => {
//   try {
//     const [deptRes, skillRes, eduRes, indRes] = await Promise.all([
//       fetch("https://apihrr.goelectronix.co.in/departments"),
//       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100"),
//       fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100"),
//       fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100")
//     ]);
    
//     setDepartments(await deptRes.json() || []);
//     setAllMasterSkills(await skillRes.json() || []);
//     setAllMasterEducation(await eduRes.json() || []);
//     setAllMasterIndustries(await indRes.json() || []); // Holds Industry master list
//   } catch (err) {
//     toast.error("Registry connection failed");
//   }
// };

//   const fetchVacancies = async () => {
//     setLoadingList(true);
//     try {
//       // Fetching with high limit as per your URL example
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setVacancies(data || []);
//     } catch (err) {
//       console.error("Failed to load vacancies");
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (pincode.length !== 6) return;
//     setIsFetchingPincode(true);
//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         setCityOptions(offices);
//         // Auto-fill with first option
//         setFormData((prev) => ({
//           ...prev,
//           city: offices[0].Name,
//           location: offices[0].Name, // Syncing location with city
//           state: offices[0].State,
//           district: offices[0].District,
//           country: offices[0].Country,
//         }));
//       }
//     } catch (err) {
//       toast.error("Geo-sync failed");
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   const fetchJDDetails = async (jdId) => {
//     // If we already have the data, don't fetch again
//     if (templateDetails[jdId]) return;

//     setLoadingJD(jdId);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`,
//       );
//       const data = await res.json();
//       setTemplateDetails((prev) => ({
//         ...prev,
//         [jdId]: data,
//       }));
//     } catch (err) {
//       toast.error("Failed to fetch job protocol details");
//     } finally {
//       setLoadingJD(null);
//     }
//   };

//   const generateExpOptions = () => {
//     const options = [];
//     options.push(
//       <option key="0.5" value="0.5">
//         6 Months
//       </option>,
//     );
//     for (let i = 1; i <= 10; i++) {
//       options.push(
//         <option key={i} value={i}>
//           {i} Year{i > 1 ? "s" : ""}
//         </option>,
//       );
//     }
//     return options;
//   };


// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setLoading(true);
// //   const loadingToast = toast.loading("Executing Enterprise Deployment...");

// //   try {
// //     // Stage 1: Create Job Description
// //     const jdBody = {
// //       title: formData.title,
// //       role: formData.title,
// //       content: formData.content,
// //       responsibilities: formData.responsibilities,
// //       requirements: formData.requirements,
// //       location: formData.location[0] || "", // Assuming string for JD
// //       salary_range: `${formData.min_salary} - ${formData.max_salary}`,
// //     };

// //     const jdRes = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(jdBody),
// //     });

// //     if (!jdRes.ok) throw new Error("JD Protocol Failed");
// //     const jdData = await jdRes.json();

// //     // Stage 2: Create Complex Vacancy
// //     const vacancyBody = {
// //       title: formData.title,
// //       number_of_openings: parseInt(formData.number_of_openings),
// //       location: Array.isArray(formData.location) ? formData.location : [formData.location],
// //       state: Array.isArray(formData.state) ? formData.state : [formData.state],
// //       district: Array.isArray(formData.district) ? formData.district : [formData.district],
// //       city: Array.isArray(formData.city) ? formData.city : [formData.city],
// //       pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
// //       job_type: formData.job_type,
// //       cand_type: formData.cand_type,
// //       experience_required: formData.experience_required,
// //       min_age: parseInt(formData.min_age),
// //       max_age: parseInt(formData.max_age),
// //       min_salary: parseFloat(formData.min_salary),
// //       max_salary: parseFloat(formData.max_salary),
// //       bonus_offered: formData.bonus_offered,
// //       bonus_amount: parseFloat(formData.bonus_amount),
// //       bonus_type: formData.bonus_type,
// //       skills_req: formData.skills_req,
// //       spoken_languages: formData.spoken_languages,
// //       assets_req: formData.assets_req,
// //       certificates_req: formData.certificates_req,
// //       office_timings: formData.office_timings,
// //       interview_timings: formData.interview_timings,
// //       cand_can_call: formData.cand_can_call,
// //       call_timings: formData.call_timings,
// //       status: formData.status,
// //       deadline_date: formData.deadline_date,
// //       job_description_id: jdData.id,
// //       department_id: Array.isArray(formData.department_id) 
// //     ? parseInt(formData.department_id[0] || 0) 
// //     : parseInt(formData.department_id || 0),
// //       company_id: parseInt(formData.company_id),
// //       industry_id: parseInt(formData.industry_id),
// //       degree_ids: formData.degree_ids,
// //     };

// //     const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(vacancyBody),
// //     });

// //     if (!vacancyRes.ok) {
// //         const err = await vacancyRes.json();
// //         console.error("Payload Validation Error:", err);
// //         throw new Error("Vacancy Schema Validation Failed");
// //     }

// //     toast.success("Vacancy Protocol Active! 🚀", { id: loadingToast });
// //     fetchVacancies();
// //     // Reset logic here...

// //   } catch (err) {
// //     toast.error(err.message, { id: loadingToast });
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   const loadingToast = toast.loading("Executing Enterprise Deployment...");

//   try {
//     // --- STAGE 0: CONDITIONAL COMPANY REGISTRY SYNC ---
//     // Check if company fields have been modified compared to the initial fetch
//     const hasCompanyChanges = 
//       formData.company_name !== companyData?.name ||
//       formData.contact_person !== (companyData?.contact_person || "sujit Hankare") ||
//       formData.company_email !== (companyData?.email || "hr@goelectronix.co.in") ||
//       formData.company_phone !== (companyData?.phone || "9004949483") ||
//       formData.job_address !== (companyData?.address || "");

//     // Only call the API if changes exist and we have a valid company ID
//     if (hasCompanyChanges && formData.company_id) {
//       toast.loading("Syncing Company Registry...", { id: loadingToast });
      
//       const companyUpdateBody = {
//         name: formData.company_name,
//         contact_person: formData.contact_person,
//         email: formData.company_email,
//         phone: formData.company_phone,
//         address: formData.job_address,
//         size_of_organization: formData.organization_size 
//       };

//       const companyUpdateRes = await fetch(`https://apihrr.goelectronix.co.in/companies/${formData.company_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(companyUpdateBody),
//       });

//       if (!companyUpdateRes.ok) throw new Error("Company Registry Sync Failed");
//     }

//     // Stage 1: Create Job Description (Original Code Below)
//     const jdBody = {
//       title: formData.title,
//       role: formData.title,
//       content: formData.content,
//       responsibilities: formData.responsibilities,
//       requirements: formData.requirements,
//       location: formData.location[0] || "", // Assuming string for JD
//       salary_range: `${formData.min_salary} - ${formData.max_salary}`,
//     };

//     const jdRes = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(jdBody),
//     });

//     if (!jdRes.ok) throw new Error("JD Protocol Failed");
//     const jdData = await jdRes.json();

//     // Stage 2: Create Complex Vacancy (Original Code Below)
//     // const vacancyBody = {
//     //   title: formData.title,
//     //   number_of_openings: parseInt(formData.number_of_openings),
//     //   location: Array.isArray(formData.location) ? formData.location : [formData.location],
//     //   state: Array.isArray(formData.state) ? formData.state : [formData.state],
//     //   district: Array.isArray(formData.district) ? formData.district : [formData.district],
//     //   city: Array.isArray(formData.city) ? formData.city : [formData.city],
//     //   pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
//     //   job_type: formData.job_type,
//     //   cand_type: formData.cand_type,
//     //   experience_required: formData.experience_required,
//     //   min_age: parseInt(formData.min_age),
//     //   max_age: parseInt(formData.max_age),
//     //   min_salary: parseFloat(formData.min_salary),
//     //   max_salary: parseFloat(formData.max_salary),
//     //   bonus_offered: formData.bonus_offered,
//     //   bonus_amount: parseFloat(formData.bonus_amount),
//     //   bonus_type: formData.bonus_type,
//     //   skills_req: formData.skills_req,
//     //   spoken_languages: formData.spoken_languages.join(", "), // Transformed to String
//     //   assets_req: formData.assets_req.join(", "),             // Transformed to String
//     //   certificates_req: formData.certificates_req,
//     //   office_timings: formData.office_timings,
//     //   interview_timings: formData.interview_timings,
//     //   cand_can_call: formData.cand_can_call,
//     //   call_timings: formData.call_timings,
//     //   status: formData.status,
//     //   deadline_date: formData.deadline_date,
//     //   job_description_id: jdData.id,
//     //   department_id: Array.isArray(formData.department_id) 
//     // ? parseInt(formData.department_id[0] || 0) 
//     // : parseInt(formData.department_id || 0),
//     //   company_id: parseInt(formData.company_id),
//     //   industry_id: parseInt(formData.industry_id),
//     //   degree_ids: formData.degree_ids,
//     // };

//     // Inside handleSubmit -> Stage 2: Create Complex Vacancy
// const vacancyBody = {
//       title: formData.title,
//       number_of_openings: parseInt(formData.number_of_openings),
//       location: Array.isArray(formData.location) ? formData.location : [formData.location],
//       state: Array.isArray(formData.state) ? formData.state : [formData.state],
//       district: Array.isArray(formData.district) ? formData.district : [formData.district],
//       city: Array.isArray(formData.city) ? formData.city : [formData.city],
//       pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
//       job_type: formData.job_type,
      
//       // OMIT CAND_TYPE IF EMPTY
//     //   ...(formData.cand_type && { cand_type: formData.cand_type }),

//    cand_type: formData.cand_type,

//       experience_required: formData.experience_required,
//       min_age: parseInt(formData.min_age),
//       max_age: parseInt(formData.max_age),
//       min_salary: parseFloat(formData.min_salary),
//       max_salary: parseFloat(formData.max_salary),
//       bonus_offered: formData.bonus_offered,
//       bonus_amount: parseFloat(formData.bonus_amount),
//       bonus_type: formData.bonus_type,
//       skills_req: formData.skills_req,
//       spoken_languages: formData.spoken_languages, // Sent as valid List
//       assets_req: formData.assets_req,             // Sent as valid List
//       certificates_req: formData.certificates_req,
//       office_timings: formData.office_timings,
//       interview_timings: formData.interview_timings,
//       cand_can_call: formData.cand_can_call,
//       call_timings: formData.call_timings,
//       status: formData.status,
//       deadline_date: formData.deadline_date,
//       job_description_id: jdData.id,
//       department_id: Array.isArray(formData.department_id) 
//         ? parseInt(formData.department_id[0] || 0) 
//         : parseInt(formData.department_id || 0),
//       company_id: parseInt(formData.company_id),
//       industry_id: parseInt(formData.industry_id),
//       degree_ids: formData.degree_ids,
//     };

//     const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(vacancyBody),
//     });

//     if (!vacancyRes.ok) {
//         const err = await vacancyRes.json();
//         console.error("Payload Validation Error:", err);
//         throw new Error("Vacancy Schema Validation Failed");
//     }

//     toast.success("Vacancy Protocol Active! 🚀", { id: loadingToast });
//     fetchVacancies();
//     // Reset logic here...

//   } catch (err) {
//     toast.error(err.message, { id: loadingToast });
//   } finally {
//     setLoading(false);
//   }
// };


//   const toggleAccordion = (vacancy) => {
//     const isOpening = openAccordionId !== vacancy.id;
//     setOpenAccordionId(isOpening ? vacancy.id : null);

//     if (isOpening && vacancy.job_description_id) {
//       fetchJDDetails(vacancy.job_description_id);
//     }
//   };


// const handleCommitCert = (name) => {
//   const cleanName = name.trim();
//   if (!cleanName) return;

//   // Prevent duplicate protocols
//   if (!formData.certificates_req.includes(cleanName)) {
//     setFormData({
//       ...formData,
//       certificates_req: [...formData.certificates_req, cleanName]
//     });
//     toast.success(`Protocol ${cleanName} Added`);
//   } else {
//     toast.error("Protocol already exists in registry");
//   }
  
//   // Clear states and hide dropdown
//   setCertSearch("");
//   setShowCertDrop(false);
// };



//   // Pagination Calculation
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(vacancies.length / itemsPerPage);

//   const inputClass =
//     "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
//   const labelClass =
//     "text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-12">
//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck
//             className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none"
//             size={120}
//           />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
//                 Vacancy
//               </h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Recruitment
//                 System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- EXISTING FORM LOGIC --- */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">

          
// {/* <div className="space-y-3 w-full">
//   <label className={labelClass}>
//     Job Type <span className="text-red-500">*</span>
//   </label>
//   <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//     {["Full Time", "Part Time"].map((type) => {
//       const isActive = formData.job_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, job_type: type })}
//           className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
//             isActive
//               ? "!bg-[#2563eb] text-white shadow-lg scale-[1.02]"
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent"
//           }`}
//         >
//           {type}
//         </button>
//       );
//     })}
//   </div>
// </div> */}


// {/* JOB TYPE SELECTOR - ENTERPRISE EDITION */}
// <div className="space-y-4 w-full pt-2">
//   <div className="flex items-center justify-between ml-1">
//     <label className={labelClass}>
//       Job Type 
//     </label>
//     {/* Dynamic Status Badge */}

//   </div>

//   <div className="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/60 w-full relative overflow-hidden backdrop-blur-sm shadow-inner">
//     {["Full Time", "Part Time"].map((type) => {
//       const isActive = formData.job_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, job_type: type })}
//           className={`relative flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 group ${
//             isActive
//               ? "!bg-white !text-blue-500 shadow-[0_8px_16px_-6px_rgba(37,99,235,0.2)] border !border-blue-100 scale-[1.01] z-10"
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent opacity-70 hover:opacity-100"
//           }`}
//         >
//           {/* Dynamic Icon Integration */}
//           <div className={`p-1 rounded-md transition-all duration-300 ${isActive ? "!bg-blue-50" : "!bg-slate-200 group-hover:!bg-slate-300"}`}>
//             {type === "Full Time" ? (
//               <Zap size={12} strokeWidth={3} className={isActive ? "!text-blue-600" : "!text-slate-400"} />
//             ) : (
//               <Clock size={12} strokeWidth={3} className={isActive ? "!text-blue-600" : "!text-slate-400"} />
//             )}
//           </div>
          
//           {type}

//           {/* Active Status Indicator */}
//           {/* {isActive && (
//             <div className="absolute -top-1 -right-1 flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
//             </div>
//           )} */}
//         </button>
//       );
//     })}
//   </div>
  

// </div>
//               {/* Department Multi-Select */}
//               {/* <div className="relative" ref={dropdownRef}>
//                 <label className={labelClass}>Department</label>
//                 <div
//                   onClick={() => setShowDeptDrop(!showDeptDrop)}
//                   className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
//                 >
//                   {formData.department_id.length > 0 ? (
//                     formData.department_id.map((id) => (
//                       <span
//                         key={id}
//                         className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95"
//                       >
//                         {
//                           departments.find(
//                             (d) => d.id.toString() === id.toString(),
//                           )?.name
//                         }
//                         <X
//                           size={12}
//                           className="hover:text-red-400"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setFormData({
//                               ...formData,
//                               department_id: formData.department_id.filter(
//                                 (item) => item !== id,
//                               ),
//                             });
//                           }}
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
//                       Select department...
//                     </span>
//                   )}
//                 </div>
//                 {showDeptDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                     <div className="p-3 border-b border-slate-50">
//                       <input
//                         autoFocus
//                         placeholder="Filter department..."
//                         value={deptSearch}
//                         onChange={(e) => setDeptSearch(e.target.value)}
//                         className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none"
//                       />
//                     </div>
//                     <div className="max-h-48 overflow-y-auto p-2">
//                       {departments
//                         .filter((d) =>
//                           d.name
//                             .toLowerCase()
//                             .includes(deptSearch.toLowerCase()),
//                         )
//                         .map((dept) => (
//                           <button
//                             key={dept.id}
//                             type="button"
//                             onClick={() => {
//                               const isSelected =
//                                 formData.department_id.includes(
//                                   dept.id.toString(),
//                                 );
//                               setFormData({
//                                 ...formData,
//                                 department_id: isSelected
//                                   ? formData.department_id.filter(
//                                       (i) => i !== dept.id.toString(),
//                                     )
//                                   : [
//                                       ...formData.department_id,
//                                       dept.id.toString(),
//                                     ],
//                               });
//                             }}
//                             className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
//                           >
//                             {dept.name}{" "}
//                             {formData.department_id.includes(
//                               dept.id.toString(),
//                             ) && <Check size={14} strokeWidth={3} />}
//                           </button>
//                         ))}
//                     </div>
//                   </div>
//                 )}
//               </div> */}

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Job Title</label>
//                   <input
//                     required
//                     placeholder="Job Title"
//                     className={inputClass}
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Opening</label>
//                   <input
//                     type="number"
//                     className={inputClass}
//                     value={formData.number_of_openings}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         number_of_openings: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//   <label className={labelClass}>District</label>
//   <div className="relative group">
//     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//       <MapPin size={14} strokeWidth={2.5} />
//     </div>
//     <input
//       required
//       placeholder="e.g. Mumbai, Maharashtra"
//       className={`${inputClass} pl-10`}
//       value={formData.location}
//       onChange={(e) =>
//         setFormData({ ...formData, location: e.target.value })
//       }
//     />
//   </div>
// </div>
//          <div>
//   <label className={labelClass}>city</label>
//   <div className="relative group">
//     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//       <MapPin size={14} strokeWidth={2.5} />
//     </div>
//     <input
//       required
//       placeholder="e.g. Mumbai, Maharashtra"
//       className={`${inputClass} pl-10`}
//       value={formData.district}
//       onChange={(e) =>
//         setFormData({ ...formData, district: e.target.value })
//       }
//     />
//   </div>
// </div>
//               </div>


//               {/* Experience Logic */}
//               {/* <div className="pt-2">
//                 <label className={labelClass}>Experience</label>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
//                   {["Fresher", "Experienced"].map((type) => (
//                     <button
//                       key={type}
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           experience_required:
//                             type === "Fresher" ? "Fresher" : "1 - 3 Years",
//                         })
//                       }
//                       className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${(type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                     >
//                       {type.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//                 {formData.experience_required !== "Fresher" && (
//                   <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
//                     <select
//                       className={inputClass}
//                       value={formData.experience_required.split(" - ")[0]}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || "1"} Years`,
//                         })
//                       }
//                     >
//                       {generateExpOptions()}
//                     </select>
//                     <select
//                       className={inputClass}
//                       value={formData.experience_required
//                         .split(" - ")[1]
//                         ?.replace(" Years", "")}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`,
//                         })
//                       }
//                     >
//                       {generateExpOptions()}
//                     </select>
//                   </div>
//                 )}
//               </div> */}

//               {/* CANDIDATE TYPE SELECTOR (EXPERIENCE STATUS) */}
// {/* <div className="space-y-3 w-full">
//   <label className={labelClass}>
//     Candidate Category 
//   </label>
//   <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//     {["Fresher", "Experienced"].map((type) => {
//       const isActive = formData.cand_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, cand_type: type })}
//           className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
//             isActive
//               ? "!border-blue-600 !bg-transparent border !text-black shadow-lg scale-[1.02]"
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent"
//           }`}
//         >
//           {type}
//         </button>
//       );
//     })}
//   </div>
// </div> */}

// {/* CANDIDATE CATEGORY SELECTOR - ENTERPRISE EDITION */}
// <div className="space-y-4 w-full pt-2">
//   <div className="flex items-center justify-between ml-1">
//     <label className={labelClass}>
//       Candidate Category 
//     </label>
//     {/* Micro-Metadata Badge */}
   
//   </div>

//   <div className="flex bg-slate-100/80 p-1.5 rounded-[1.25rem] border border-slate-200/60 w-full relative overflow-hidden backdrop-blur-sm shadow-inner">
//     {["Fresher", "Experienced"].map((type) => {
//       const isActive = formData.cand_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, cand_type: type })}
//           className={`relative flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 group ${
//             isActive
//               ? "!bg-white !text-[#2563eb] !shadow-[0_8px_16px_-6px_rgba(37,99,235,0.2)] border !border-blue-100 scale-[1.01] z-10"
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent opacity-70 hover:opacity-100"
//           }`}
//         >
//           {/* Dynamic Icon Indicator */}
//           <div className={`p-1 rounded-md transition-colors duration-300 ${isActive ? "bg-blue-50" : "bg-slate-200 group-hover:bg-slate-300"}`}>
//             {type === "Fresher" ? <Zap size={12} strokeWidth={3} /> : <Briefcase size={12} strokeWidth={3} />}
//           </div>
          
//           {type}

//           {/* Active Glow Dot */}
//           {/* {isActive && (
//             <span className="absolute -top-1 -right-1 flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
//             </span>
//           )} */}
//         </button>
//       );
//     })}
//   </div>
  
//   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 opacity-80">
//     <Info size={10} className="text-blue-500" /> 
//     System will filter nodes based on experience status
//   </p>
// </div>

            


//               {/* SALARY RANGE GRID */}
// <div className="grid grid-cols-1 gap-4 pt-2">
//   <div className="space-y-2 pt-2">
//     <label className={labelClass}>Salary (LPA)</label>
//     <div className="grid grid-cols-2 gap-4 items-center">
      
//       {/* MIN SALARY NODE */}
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//           <IndianRupee size={12} strokeWidth={3} />
//         </div>
//         <input
//           type="number"
//           step="0.1"
//           placeholder="Min"
//           className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           value={formData.min_salary}
//           onChange={(e) => 
//             setFormData({ ...formData, min_salary: e.target.value })
//           }
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
//             Min
//           </span>
//         </div>
//       </div>

//       {/* MAX SALARY NODE */}
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//           <IndianRupee size={12} strokeWidth={3} />
//         </div>
//         <input
//           type="number"
//           step="0.1"
//           placeholder="Max"
//           className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           value={formData.max_salary}
//           onChange={(e) => 
//             setFormData({ ...formData, max_salary: e.target.value })
//           }
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
//             Max
//           </span>
//         </div>
//       </div>

//     </div>
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//       Annual CTC Range in Lakhs
//     </p>
//   </div>
// </div>

// <div>
//     {/* BONUS PROTOCOL SECTION */}
// {/* <div className="space-y-4 pt-4 border-t border-slate-100">
//   <div className="flex items-center justify-between">
//     <label className={labelClass}>
//       Bonus offered in addition to salary? <span className="text-red-500">*</span>
//     </label>
    

//     <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//       {[
//         { label: "YES", value: true },
//         { label: "NO", value: false }
//       ].map((opt) => (
//         <button
//           key={opt.label}
//           type="button"
//           onClick={() => setFormData({ ...formData, bonus_offered: opt.value })}
//           className={`px-6 py-1.5 text-[10px] font-black rounded-lg transition-all ${
//             formData.bonus_offered === opt.value
//               ? "bg-blue-600 text-white shadow-md"
//               : "text-slate-500 hover:text-slate-700"
//           }`}
//         >
//           {opt.label}
//         </button>
//       ))}
//     </div>
//   </div>



  
//   {formData.bonus_offered && (
//     <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-top-2 duration-300">
//       <div className="space-y-2">
//         <label className={labelClass}>Max Bonus Amount</label>
//         <div className="relative group">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
//             <IndianRupee size={12} strokeWidth={3} />
//           </div>
//           <input
//             type="number"
//             placeholder="e.g. 50000"
//             className={`${inputClass} pl-9`}
//             value={formData.bonus_amount || ""}
//             onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <label className={labelClass}>Bonus Type</label>
//         <div className="relative group">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
//             <Award size={14} strokeWidth={2.5} />
//           </div>
//           <input
//             type="text"
//             placeholder="e.g. Performance, Sign-on"
//             className={`${inputClass} pl-9`}
//             value={formData.bonus_type}
//             onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   )}
// </div> */}



// {/* BONUS PROTOCOL SECTION - STREAMLINED ENTERPRISE UI */}
// <div className="space-y-4 pt-6 border-t border-slate-100/80">
//   {/* Single attractive header row */}
//   <div className="flex items-center justify-between px-1">
//     <div className="flex items-center gap-2">
//       <div className="p-1.5 bg-blue-50 text-[#2563eb] rounded-lg border border-blue-100 shadow-sm">
//         <Zap size={14} strokeWidth={2.5} />
//       </div>
//      <div className="flex flex-col">
//   <label className={`${labelClass} !mb-0`}>
//     Bonus offered
//   </label>
//   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
//     In addition to salary? 
//   </span>
// </div>
//     </div>
    
//     {/* Compact Glassmorphism Toggle */}
//     <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200">
//       {[
//         { label: "YES", value: true, icon: <Check size={10} strokeWidth={4} /> },
//         { label: "NO", value: false, icon: <X size={10} strokeWidth={4} /> }
//       ].map((opt) => {
//         const isActive = formData.bonus_offered === opt.value;
//         return (
//           <button
//             key={opt.label}
//             type="button"
//             onClick={() => setFormData({ ...formData, bonus_offered: opt.value })}
//             className={`flex items-center gap-2 px-5 py-1.5 text-[9px] font-black rounded-lg transition-all duration-500 ${
//               isActive
//                 ? "!bg-white !text-blue-500 shadow-sm border !border-blue-100 scale-[1.03] z-10"
//                 : "!text-slate-400 hover:!text-slate-600 !bg-transparent"
//             }`}
//           >
//             {opt.label}
//             {isActive && <span className="animate-in zoom-in duration-300">{opt.icon}</span>}
//           </button>
//         );
//       })}
//     </div>
//   </div>

//   {/* Nested Detail Card */}
//   {formData.bonus_offered && (
//     <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-[2rem] animate-in slide-in-from-top-4 fade-in duration-500 relative overflow-hidden">
//       {/* Background Security Watermark */}
//       <ShieldCheck className="absolute -right-6 -bottom-6 text-blue-600 opacity-[0.03] -rotate-12" size={120} />
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
//         {/* MAX BONUS FIELD */}
//         <div className="space-y-2">
//           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Bonus (₹)</span>
//           <div className="relative group">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 !bg-white rounded-md !text-slate-300 group-focus-within:!text-[#2563eb] border !border-slate-100 transition-all shadow-sm">
//               <IndianRupee size={10} strokeWidth={3} />
//             </div>
//             <input
//               type="number"
//               placeholder="e.g. 50,000"
//               className={`${inputClass} pl-10 !bg-white border-slate-200 focus:border-[#2563eb] !rounded-xl !py-2`}
//               value={formData.bonus_amount || ""}
//               onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
//             />
//           </div>
//         </div>

//         {/* BONUS TYPE FIELD */}
//         <div className="space-y-2">
//           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Bonus Category</span>
//           <div className="relative group">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-white rounded-md text-slate-300 group-focus-within:text-[#2563eb] border border-slate-100 transition-all shadow-sm">
//               <Award size={12} strokeWidth={2.5} />
//             </div>
//             <input
//               type="text"
//               placeholder="e.g. Performance Linked"
//               className={`${inputClass} pl-10 !bg-white border-slate-200 focus:border-[#2563eb] !rounded-xl !py-2`}
//               value={formData.bonus_type}
//               onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
//             />
//           </div>
//         </div>
//       </div>
    
//     </div>
//   )}
// </div>

//   {/* CANDIDATE CALL PROTOCOL */}
// {/* <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="space-y-3">
//     <label className={labelClass}>
//       Candidates can call me <span className="text-red-500">*</span>
//     </label>
    
    
//     <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//       {["Everyday", "Monday to Friday", "Monday to Saturday"].map((option) => {
//         const isActive = formData.cand_can_call === option;
//         return (
//           <button
//             key={option}
//             type="button"
//             onClick={() => setFormData({ ...formData, cand_can_call: option })}
//             className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-300 ${
//               isActive
//                 ? "bg-[#2563eb] text-white shadow-lg scale-[1.02]"
//                 : "text-slate-500 hover:text-slate-700 bg-transparent"
//             }`}
//           >
//             {option}
//           </button>
//         );
//       })}
//     </div>
//   </div>

  
//   <div className="space-y-2 max-w-md">
//     <label className={labelClass}>Call Timings</label>
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <Clock size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="e.g. 10 AM to 6 PM"
//         className={`${inputClass} pl-11`}
//         value={formData.call_timings}
//         onChange={(e) => setFormData({ ...formData, call_timings: e.target.value })}
//       />
//     </div>
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//       Specify your availability for candidate inquiries
//     </p>
//   </div>
// </div> */}


// {/* CANDIDATE CALL PROTOCOL - ENTERPRISE UI */}
// <div className="space-y-6 pt-8 border-t border-slate-100/80">
  
//   {/* Multi-line Label with High-Impact Icon */}
//   {/* <div className="flex items-start gap-3 px-1">
//     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
//       <Users size={18} strokeWidth={2.5} />
//     </div>
//     <div className="flex flex-col">
//       <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px]`}>
//         Candidates can call me
//       </label>
//     </div>
//   </div> */}
//   <div className="flex items-start gap-3 px-1">
//     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
//       <Users size={18} strokeWidth={2.5} />
      
//     </div>
//     <div className="flex flex-col py-2">
//       <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px]`}>
//         Candidates can call me
//       </label>
//     </div>
//   </div>

//   {/* Elevated Multi-Toggle Card */}
//   <div className="bg-white p-2 rounded-[2rem] border border-slate-200/60 shadow-sm">
//     <div className="flex bg-slate-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 w-full overflow-hidden">
//       {["Everyday", "Mon to Fri", "Mon to Sat"].map((option) => {
//         const isActive = formData.cand_can_call === option;
//         return (
//           <button
//             key={option}
//             type="button"
//             onClick={() => setFormData({ ...formData, cand_can_call: option })}
//             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 ${
//               isActive
//                 ? "!bg-white !text-[#2563eb] shadow-[0_4px_12px_-4px_rgba(37,99,235,0.3)] border !border-blue-100 scale-[1.02] z-10"
//                 : "!text-slate-500 hover:text-slate-700 !bg-transparent opacity-70 hover:opacity-100"
//             }`}
//           >
//             {isActive && <Check size={12} strokeWidth={4} className="animate-in zoom-in" />}
//             {option}
//           </button>
//         );
//       })}
//     </div>
//   </div>

//   {/* Call Timings Input - Matching "Salary Strip" Depth */}
//   <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-center">
//     <div className="space-y-2">
//       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//         Calling Interview Time
//       </span>
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 rounded-lg text-slate-400 group-focus-within:text-[#2563eb] group-focus-within:bg-blue-50 border border-slate-100 transition-all">
//           <Clock size={14} strokeWidth={2.5} />
//         </div>
//         <input
//           type="text"
//           placeholder="e.g. 10 AM to 6 PM"
//           className={`${inputClass} pl-12 !bg-white border-slate-200 focus:border-[#2563eb] !rounded-xl !py-3 shadow-sm`}
//           value={formData.call_timings}
//           onChange={(e) => setFormData({ ...formData, call_timings: e.target.value })}
//         />
//       </div>
//     </div>
    

//   </div>
// </div>





// {/* SKILLS TAG REGISTRY SECTION - FULL VISIBILITY MODE */}
// {/* SKILLS TAG REGISTRY - DATABASE LINKED */}
// {/* <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="flex items-center justify-between ml-1">
//     <label className={labelClass}>
//       Skills <span className="text-red-500">*</span>
//     </label>
//     <span className="text-[9px] font-black !text-[#2563eb] uppercase tracking-widest !bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
//       {formData.skills_req.length} Selected for Deployment
//     </span>
//   </div>

//   <div className="grid grid-cols-1 gap-4">
   
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
//         <Search size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="Required skills "
//         className={`${inputClass} pl-12 py-3.5`}
//         value={skillSearch}
//         onChange={(e) => setSkillSearch(e.target.value)}
//       />
//     </div>

   
//     <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
//         Skills 
//       </p>
      
//       <div className="max-h-[250px] overflow-y-auto flex flex-wrap gap-2 custom-scrollbar">
//         {allMasterSkills
//           .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
//           .map((skill) => {
//             const isSelected = formData.skills_req.includes(skill.name);
//             return (
//               <button
//                 key={skill.id}
//                 type="button"
//                 onClick={() => {
//                   const updatedSkills = isSelected
//                     ? formData.skills_req.filter(s => s !== skill.name)
//                     : [...formData.skills_req, skill.name];
//                   setFormData({ ...formData, skills_req: updatedSkills });
//                 }}
//                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
//                   isSelected
//                     ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-lg !shadow-blue-200"
//                     : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
//                 }`}
//               >
//                 {skill.name}
//                 {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} />}
//               </button>
//             );
//           })}
        
//         {allMasterSkills.length === 0 && (
//           <div className="w-full py-10 flex flex-col items-center gap-2 text-slate-400">
//             <Loader2 className="animate-spin" size={20} />
//             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Syncing Master Skills...</span>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>

 
  
// </div> */}


// {/* SKILLS TAG REGISTRY - WITH SELECTION BADGES */}
// {/* <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="flex items-center justify-between ml-1">
//     <div className="flex items-center gap-3">
//       <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
//         <Zap size={18} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col">
//         <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px] leading-none`}>
//           Skills Registry <span className="text-red-500 font-bold ml-0.5">*</span>
//         </label>
//       </div>
//     </div>
//     <span className="text-[9px] font-black !text-[#2563eb] uppercase tracking-widest !bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
//       {formData.skills_req.length} SECURE NODES
//     </span>
//   </div>

//   <div className="grid grid-cols-1 gap-4">
    
//     <div className="flex flex-wrap gap-2 min-h-[40px] px-1">
//       {formData.skills_req.map((skillName, index) => (
//         <div 
//           key={index}
//           className="flex items-center gap-2 px-3 py-1.5 !bg-[#2563eb] !text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100"
//         >
//           {skillName}
//           <X 
//             size={13} 
//             className="cursor-pointer hover:text-red-200 transition-colors" 
//             strokeWidth={3}
//             onClick={() => setFormData({
//               ...formData,
//               skills_req: formData.skills_req.filter(s => s !== skillName)
//             })}
//           />
//         </div>
//       ))}
//       {formData.skills_req.length === 0 && (
//         <p className="text-[11px] font-bold text-slate-300 italic py-2">No skills committed to registry yet...</p>
//       )}
//     </div>

    
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
//         <Search size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="Search master registry or type custom skill..."
//         className={`${inputClass} pl-12 py-3.5 !bg-slate-50 focus:!bg-white transition-all`}
//         value={skillSearch}
//         onChange={(e) => setSkillSearch(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' && skillSearch.trim()) {
//             e.preventDefault();
//             const val = skillSearch.trim();
//             if (!formData.skills_req.includes(val)) {
//               setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
//               setSkillSearch("");
//               toast.success(`Skill "${val}" Committed`);
//             }
//           }
//         }}
//       />
      
    
//       {skillSearch.trim() && !allMasterSkills.some(s => s.name.toLowerCase() === skillSearch.toLowerCase()) && (
//         <button
//           type="button"
//           onClick={() => {
//             const val = skillSearch.trim();
//             if (!formData.skills_req.includes(val)) {
//               setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
//               setSkillSearch("");
//               toast.success(`Custom Skill Linked`);
//             }
//           }}
//           className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-2 hover:bg-black transition-all animate-in fade-in zoom-in-95"
//         >
//           <Plus size={12} strokeWidth={3} /> Add Custom
//         </button>
//       )}
//     </div>

  
//     <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner relative overflow-hidden">
//       <ShieldCheck className="absolute -right-6 -bottom-6 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" size={150} />
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 relative z-10">
//         Available Master Protocols
//       </p>
      
//       <div className="max-h-[200px] overflow-y-auto flex flex-wrap gap-2.5 custom-scrollbar relative z-10">
//         {allMasterSkills
//           .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
//           .map((skill) => {
//             const isSelected = formData.skills_req.includes(skill.name);
//             return (
//               <button
//                 key={skill.id}
//                 type="button"
//                 onClick={() => {
//                   const updatedSkills = isSelected
//                     ? formData.skills_req.filter(s => s !== skill.name)
//                     : [...formData.skills_req, skill.name];
//                   setFormData({ ...formData, skills_req: updatedSkills });
//                 }}
//                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
//                   isSelected
//                     ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-lg !shadow-blue-200 scale-[1.03]"
//                     : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
//                 }`}
//               >
//                 {skill.name}
//                 {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
//               </button>
//             );
//           })}
//       </div>
//     </div>
//   </div>
// </div> */}

// {/* SKILLS TAG REGISTRY - UNIFIED ENTERPRISE COLOR THEME */}
// <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="flex items-center justify-between ml-1">
//     <div className="flex items-center gap-3">
//       {/* Branding Box with Primary Blue */}
//       <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm shrink-0">
//         <Zap size={18} strokeWidth={2.5} />
//       </div>
//       <div className="flex flex-col">
//         <label className={`${labelClass} !mb-0 !text-slate-900 !tracking-tight !text-[11px] leading-none`}>
//           Skills
//         </label>
//       </div>
//     </div>
   
//   </div>

//   <div className="grid grid-cols-1 gap-4">
//     {/* 1. SELECTION AREA - Primary Blue Badges */}
//     <div className="flex flex-wrap gap-2 min-h-[40px] px-1">
//       {formData.skills_req.map((skillName, index) => (
//         <div 
//           key={index}
//           className="flex items-center gap-2 px-3 py-1.5 !bg-white !text-[#2563eb] border !border-blue-50 rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100/50"
//         >
//           {skillName}
//           <X 
//             size={13} 
//             className="cursor-pointer hover:!text-red-200 transition-colors" 
//             strokeWidth={3}
//             onClick={() => setFormData({
//               ...formData,
//               skills_req: formData.skills_req.filter(s => s !== skillName)
//             })}
//           />
//         </div>
//       ))}
//       {formData.skills_req.length === 0 && (
//         <p className="text-[11px] font-bold !text-slate-300 italic py-2">No skills committed to registry yet...</p>
//       )}
//     </div>

//     {/* 2. SEARCH INPUT - Focused Blue State */}
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
//         <Search size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="Search skill"
//         className={`${inputClass} pl-12 py-3.5 !bg-slate-50 focus:!bg-white focus:!border-[#2563eb] focus:!ring-4 focus:!ring-blue-500/10 transition-all`}
//         value={skillSearch}
//         onChange={(e) => setSkillSearch(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' && skillSearch.trim()) {
//             e.preventDefault();
//             const val = skillSearch.trim();
//             if (!formData.skills_req.includes(val)) {
//               setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
//               setSkillSearch("");
//               toast.success(`Skill "${val}" Committed`);
//             }
//           }
//         }}
//       />
      
//       {/* MANUAL ADD BUTTON - High Contrast Slate-900 */}
//       {skillSearch.trim() && !allMasterSkills.some(s => s.name.toLowerCase() === skillSearch.toLowerCase()) && (
//         <button
//           type="button"
//           onClick={() => {
//             const val = skillSearch.trim();
//             if (!formData.skills_req.includes(val)) {
//               setFormData({ ...formData, skills_req: [...formData.skills_req, val] });
//               setSkillSearch("");
//               toast.success(`Custom Skill Linked`);
//             }
//           }}
//           className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 !bg-slate-900 !text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-2 hover:!bg-black transition-all animate-in fade-in zoom-in-95 active:scale-95"
//         >
//           <Plus size={12} strokeWidth={3} /> Add Custom
//         </button>
//       )}
//     </div>

//     {/* 3. MASTER POOL - Selection Colors Matched */}
//     <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner relative overflow-hidden">
//       <ShieldCheck className="absolute -right-6 -bottom-6 text-[#2563eb] opacity-[0.04] -rotate-12 pointer-events-none" size={150} />
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 relative z-10">
//         skils
//       </p>
      
//       <div className="max-h-[200px] overflow-y-auto flex flex-wrap gap-2.5 custom-scrollbar relative z-10 pr-2">
//         {allMasterSkills
//           .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
//           .map((skill) => {
//             const isSelected = formData.skills_req.includes(skill.name);
//             return (
//               <button
//                 key={skill.id}
//                 type="button"
//                 onClick={() => {
//                   const updatedSkills = isSelected
//                     ? formData.skills_req.filter(s => s !== skill.name)
//                     : [...formData.skills_req, skill.name];
//                   setFormData({ ...formData, skills_req: updatedSkills });
//                 }}
//                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
//                   isSelected
//                     ? "!bg-white !border-white !text-[#2563eb] shadow-lg !shadow-blue-200 scale-[1.03]"
//                     : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
//                 }`}
//               >
//                 {skill.name}
//                 {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} className="text-slate-300" />}
//               </button>
//             );
//           })}
//       </div>
//     </div>
//   </div>
// </div>


// {/* PERSONAL & ADDITIONAL INFO HUB */}
// <div className="space-y-6 pt-6 border-t border-slate-100">
//   <div className="flex items-center gap-3">
//     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100">
//       <UserPlus size={18} strokeWidth={2.5} />
//     </div>
//     <h6 className="!text-[13px] font-black text-slate-800 uppercase tracking-widest">
//       Personal Details, Education, & Additional Info
//     </h6>
//   </div>

//   {/* TOGGLE SELECTORS - Matches Image 5 */}
//   <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-[2rem]">
//     {[
//       { id: 'age', label: 'Age', icon: <Calendar size={14} /> },
//       { id: 'languages', label: 'Preferred Language', icon: <Plus size={14} /> },
//       { id: 'assets', label: 'Assets', icon: <Plus size={14} /> },
//       { id: 'degree', label: 'Degree and Specialisation', icon: <Plus size={14} /> },
//       { id: 'certification', label: 'Certification', icon: <Plus size={14} /> },
//       { id: 'industry', label: 'Preferred Industry', icon: <Plus size={14} /> }
//     ].map((item) => {
//       const isAdded = activeDetails.includes(item.id);
//       return (
//         <button
//           key={item.id}
//           type="button"
//           onClick={() => {
//             setActiveDetails(prev => 
//               prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
//             );
//           }}
//           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-300 ${
//             isAdded 
//               ? "!bg-white !border-[#2563eb] !text-[#2563eb] shadow-sm ring-2 !ring-blue-50" 
//               : "!bg-white !border-slate-200 !text-slate-500 hover:border-slate-400"
//           }`}
//         >
//           {item.label} {isAdded ? <Check size={14} strokeWidth={3} className="text-[#2563eb]" /> : item.icon}
//         </button>
//       );
//     })}
//   </div>

//   {/* DYNAMIC FORM FIELDS - Conditioned on Toggles */}
//   <div className="space-y-6">
//     {/* AGE SECTION - Matches Image 5 Bottom */}
//     {activeDetails.includes('age') && (
//       <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group">
//         <button 
//           className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
//           onClick={() => setActiveDetails(prev => prev.filter(i => i !== 'age'))}
//         >
//           <X size={18} strokeWidth={3} />
//         </button>
        
//         <label className={labelClass}>Candidate Age </label>
//         <div className="grid grid-cols-2 gap-8 mt-4">
//           <div className="space-y-2">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Age</span>
//             <input 
//               type="number" 
//               placeholder="Eg: 18" 
//               className={inputClass}
//               value={formData.min_age}
//               onChange={(e) => setFormData({...formData, min_age: e.target.value})}
//             />
//           </div>
//           <div className="space-y-2">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Age</span>
//             <input 
//               type="number" 
//               placeholder="Eg: 40" 
//               className={inputClass}
//               value={formData.max_age}
//               onChange={(e) => setFormData({...formData, max_age: e.target.value})}
//             />
//           </div>
//         </div>
//       </div>
//     )}


//     {/* PREFERRED LANGUAGE REGISTRY */}
// {activeDetails.includes('languages') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 !bg-transparent !text-slate-300 hover:!text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'languages'));
//         setFormData({...formData, spoken_languages: []}); // Clear data when removed
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center gap-2 mb-4">
//       <label className={labelClass}>Preferred Language</label>
//       <Info size={12} className="text-slate-400" />
//     </div>

//     <div className="flex flex-wrap gap-2">
//       {MASTER_LANGUAGES.map((lang) => {
//         const isSelected = formData.spoken_languages.includes(lang);
//         return (
//           <button
//             key={lang}
//             type="button"
//             onClick={() => {
//               const updated = isSelected
//                 ? formData.spoken_languages.filter(l => l !== lang)
//                 : [...formData.spoken_languages, lang];
//               setFormData({ ...formData, spoken_languages: updated });
//             }}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-200 ${
//               isSelected
//                 ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-md shadow-blue-100"
//                 : "!bg-white !border-slate-200 !text-slate-500 hover:border-slate-400"
//             }`}
//           >
//             {lang}
//             {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
//           </button>
//         );
//       })}
//     </div>
//   </div>
// )}


// {/* DEGREE & SPECIALISATION REGISTRY */}
// {activeDetails.includes('degree') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'degree'));
//         setFormData({...formData, degree_ids: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-4 mr-10">
//       <label className={labelClass}>Degree</label>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
//         {formData.degree_ids.length} Qualifications Required
//       </span>
//     </div>

//     {/* Selection Area */}
//     <div className="space-y-4">
//       {/* 1. Selected Degree Badges */}
//       <div className="flex flex-wrap gap-2 min-h-[40px]">
//         {formData.degree_ids.map((eduId) => {
//           const edu = allMasterEducation.find(e => e.id === eduId);
//           return (
//             <span 
//               key={eduId}
//               className="flex items-center gap-2 px-3 py-1.5 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95"
//             >
//               {edu?.name}
//               <X 
//                 size={12} 
//                 className="cursor-pointer hover:text-red-200 transition-colors" 
//                 onClick={() => setFormData({
//                   ...formData,
//                   degree_ids: formData.degree_ids.filter(id => id !== eduId)
//                 })}
//               />
//             </span>
//           );
//         })}
//         {formData.degree_ids.length === 0 && (
//           <p className="text-[11px] font-bold text-slate-400 italic py-1">Search and add mandatory degrees...</p>
//         )}
//       </div>

//       {/* 2. Searchable Input Node */}
//       <div className="relative group">
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//           <GraduationCap size={16} strokeWidth={2.5} />
//         </div>
//         <input
//           type="text"
//           placeholder="Choose Specialisation (e.g. B.Tech, MBA)..."
//           className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//           value={eduSearch}
//           onFocus={() => setShowEduDrop(true)}
//           onChange={(e) => setEduSearch(e.target.value)}
//         />

//         {/* 3. Dropdown Menu */}
//         {showEduDrop && (
//           <div className="absolute left-0 right-0 top-full mt-2 max-h-56 !bg-white border !border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
//             <div className="p-2 border-b !border-slate-50 mb-1">
//                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Education </p>
//             </div>
//             {allMasterEducation
//               .filter(edu => 
//                 edu.name.toLowerCase().includes(eduSearch.toLowerCase()) && 
//                 !formData.degree_ids.includes(edu.id)
//               )
//               .map((edu) => (
//                 <button
//                   key={edu.id}
//                   type="button"
//                   onClick={() => {
//                     setFormData({
//                       ...formData,
//                       degree_ids: [...formData.degree_ids, edu.id]
//                     });
//                     setEduSearch("");
//                     setShowEduDrop(false);
//                   }}
//                   className="w-full text-left px-4 py-3 hover:!bg-blue-50 rounded-xl text-[11px] font-bold !text-slate-700 uppercase !bg-transparent tracking-tight transition-all flex items-center justify-between group/item"
//                 >
//                   {edu.name}
//                   <Plus size={14} className="text-slate-300 group-hover/item:text-[#2563eb]" />
//                 </button>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )}


// {/* PREFERRED INDUSTRY REGISTRY */}
// {activeDetails.includes('industry') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 !bg-transparent top-6 !text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'industry'));
//         setFormData({...formData, industry_id: null}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center gap-2 mb-4">
//       <label className={labelClass}>Preferred Industry</label>
//       <Info size={12} className="text-slate-400" />
//     </div>

//     {/* Selection Node */}
//     <div className="space-y-4">
//       {/* 1. Selected Industry Badge (Single Selection Logic) */}
//       <div className="min-h-[40px]">
//         {formData.industry_id ? (
//           <div className="flex items-center gap-2 w-fit px-4 py-2 bg-[#2563eb] text-white rounded-xl text-[11px] font-black uppercase tracking-wider animate-in zoom-in-95">
//             <Layers size={14} />
//             {allMasterIndustries.find(i => i.id === formData.industry_id)?.name}
//             <X 
//               size={14} 
//               className="cursor-pointer hover:!text-red-200 ml-1" 
//               onClick={() => setFormData({...formData, industry_id: null})}
//             />
//           </div>
//         ) : (
//           <p className="text-[11px] font-bold text-slate-400 italic">No industry selected</p>
//         )}
//       </div>

//       {/* 2. Searchable Input Node */}
//       {!formData.industry_id && (
//         <div className="relative group">
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//             <Search size={16} strokeWidth={2.5} />
//           </div>
//           <input
//             type="text"
//             placeholder="Search suggested industries (e.g. Finance, IT, Retail)..."
//             className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//             value={industrySearch}
//             onFocus={() => setShowIndustryDrop(true)}
//             onChange={(e) => setIndustrySearch(e.target.value)}
//           />

//           {/* 3. Dropdown Menu */}
//           {showIndustryDrop && (
//             <div className="absolute left-0 right-0 top-full mt-2 max-h-60 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
//               {allMasterIndustries
//                 .filter(ind => ind.name.toLowerCase().includes(industrySearch.toLowerCase()))
//                 .map((ind) => (
//                   <button
//                     key={ind.id}
//                     type="button"
//                     onClick={() => {
//                       setFormData({ ...formData, industry_id: ind.id });
//                       setIndustrySearch("");
//                       setShowIndustryDrop(false);
//                     }}
//                     className="w-full text-left px-4 py-3 hover:!bg-blue-50 !bg-transparent rounded-xl text-[11px] font-bold !text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item"
//                   >
//                     {ind.name}
//                     <Plus size={14} className="text-slate-300 group-hover/item:text-[#2563eb]" />
//                   </button>
//                 ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   </div>
// )}

// {/* ASSETS REQUIREMENT REGISTRY */}
// {activeDetails.includes('assets') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'assets'));
//         setFormData({...formData, assets_req: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-4 mr-10">
//       <div className="flex items-center gap-2">
//         <label className={labelClass}>Required Assets</label>
//         <Info size={12} className="text-slate-400" />
//       </div>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
//         {formData.assets_req.length} Items Mandatory
//       </span>
//     </div>

//     {/* Asset Badge Pool - Matches Image 9 */}
//     <div className="flex flex-wrap gap-2.5">
//       {MASTER_ASSETS.map((asset) => {
//         const isSelected = formData.assets_req.includes(asset);
//         return (
//           <button
//             key={asset}
//             type="button"
//             onClick={() => {
//               const updated = isSelected
//                 ? formData.assets_req.filter(a => a !== asset)
//                 : [...formData.assets_req, asset];
//               setFormData({ ...formData, assets_req: updated });
//             }}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all duration-200 ${
//               isSelected
//                 ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-md !shadow-blue-100 scale-[1.02]"
//                 : "!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-400"
//             }`}
//           >
//             {asset}
//             {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
//           </button>
//         );
//       })}
//     </div>
//   </div>
// )}


// {/* CERTIFICATION REGISTRY - MANUAL MULTI-SELECT */}


// {/* CERTIFICATION REGISTRY - INTELLIGENT SEARCH & CUSTOM ADD */}
// {activeDetails.includes('certification') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4" ref={certRef}>
    
//     {/* Section Discard */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 !text-slate-300 hover:!text-red-500 !bg-transparent transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'certification'));
//         setFormData({...formData, certificates_req: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-5 mr-10">
//       <div className="flex items-center gap-2">
//         <label className={labelClass}>Certification </label>
        
//       </div>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
//         {formData.certificates_req.length} SECURE REQS
//       </span>
//     </div>

//     <div className="space-y-4">
//       {/* 1. Registry Badges (Selected Data Above) */}
//       <div className="flex flex-wrap gap-2.5 min-h-[40px]">
//         {formData.certificates_req.map((certName, index) => (
//           <div 
//             key={index}
//             className="flex items-center gap-2 px-3.5 py-2 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100"
//           >
//             {certName}
//             <X 
//               size={13} 
//               className="cursor-pointer hover:text-red-200 transition-colors" 
//               strokeWidth={3}
//               onClick={() => setFormData({
//                 ...formData,
//                 certificates_req: formData.certificates_req.filter(c => c !== certName)
//               })}
//             />
//           </div>
//         ))}
//       </div>

//       {/* 2. Intelligent Search/Entry Node */}
//       <div className="relative group">
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//           <Search size={16} strokeWidth={2.5} />
//         </div>
//         <input
//           type="text"
//           placeholder="Click to view all or search..."
//           className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//           value={certSearch}
//           onFocus={() => setShowCertDrop(true)} // Shows all on click
//           onChange={(e) => setCertSearch(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && certSearch.trim()) {
//                e.preventDefault();
//                handleCommitCert(certSearch.trim());
//             }
//           }}
//         />

//         {/* 3. Predefined & Custom Dropdown Area */}
//         {showCertDrop && (
//           <div className="absolute left-0 right-0 top-full mt-3 max-h-64 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-[100] overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 border-t-4 border-t-[#2563eb]">
            
//             {/* Header for Dropdown */}
//             <div className="px-4 py-2 border-b border-slate-50 mb-2">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                 {certSearch ? `Results for "${certSearch}"` : 'Global Registry'}
//               </p>
//             </div>

//             {/* List Item Logic */}
//             {MANUAL_CERTIFICATES
//               .filter(name => 
//                 name.toLowerCase().includes(certSearch.toLowerCase()) && 
//                 !formData.certificates_req.includes(name)
//               )
//               .map((name, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => handleCommitCert(name)}
//                   className="w-full text-left px-4 py-3 hover:!bg-blue-50 rounded-xl !bg-transparent text-[11px] font-bold !text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item mb-1"
//                 >
//                   {name}
//                   <PlusCircle size={14} className="text-slate-200 group-hover/item:text-[#2563eb]" />
//                 </button>
//               ))}

//             {/* CUSTOM ADD BUTTON: Appears if no exact match exists or if search is unique */}
//             {certSearch.trim() !== "" && !MANUAL_CERTIFICATES.some(c => c.toLowerCase() === certSearch.toLowerCase()) && (
//               <button
//                 type="button"
//                 onClick={() => handleCommitCert(certSearch)}
//                 className="w-full flex items-center justify-between px-4 py-4 bg-slate-900 text-white rounded-xl mt-2 hover:bg-black transition-all shadow-lg active:scale-95 border-2 border-blue-500/20"
//               >
//                 <div className="flex flex-col text-left">
//                   <span className="text-[8px] font-black uppercase text-blue-400 leading-none mb-1.5">Add Custom Requirement</span>
//                   <span className="text-[11px] font-black uppercase tracking-widest leading-none truncate max-w-[250px]">Commit "{certSearch}"</span>
//                 </div>
//                 <Zap size={16} className="text-blue-400 fill-blue-400 animate-pulse" />
//               </button>
//             )}

//             {/* Empty State when no results and no search text */}
//             {!certSearch && MANUAL_CERTIFICATES.length === 0 && (
//                <div className="p-4 text-center text-slate-400 text-[10px] font-bold uppercase">No Registry Data</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )}

//   </div>
// </div>

// {/* TIMINGS & INTERVIEW PROTOCOL SECTION */}
// <div className="space-y-6 pt-8 border-t border-slate-200/60">
//   <div className="flex items-center gap-3 mb-2">
//     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100 shadow-sm">
//       <Clock size={18} strokeWidth={2.5} />
//     </div>
//     <h6 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">
//       Operational & Interview Protocols
//     </h6>
//   </div>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//     {/* JOB TIMINGS NODE */}
//     <div className="space-y-3">
//       <div className="flex items-center justify-between ml-1">
//         <label className={`${labelClass} pt-5 !text-[10px]`}>
//           Job Timings 
//         </label>
//       </div>
//       <div className="relative group">
//         <textarea
//           required
//           rows={3}
//           placeholder="e.g. 9:30 AM - 6:30 PM | Monday to Saturday"
//           className={`${inputClass} !h-auto py-4 leading-relaxed resize-none bg-white border-2 border-slate-100 focus:border-[#2563eb] shadow-sm`}
//           value={formData.office_timings}
//           onChange={(e) => setFormData({ ...formData, office_timings: e.target.value })}
//         />
//         <div className="absolute right-4 bottom-4 pointer-events-none">
//           <Edit3 size={14} className="text-slate-200 group-focus-within:text-blue-200 transition-colors" />
//         </div>
//       </div>
//     </div>

//     {/* INTERVIEW DETAILS NODE */}
//     <div className="space-y-3">
//       <div className="flex items-center justify-between ml-1">
//       <label className={`${labelClass} pt-5 !text-[10px]`}>
//           Interview Details
//         </label>
//       </div>
//       <div className="relative group">
//         <textarea
//           required
//           rows={3}
//           placeholder="e.g. 11:00 AM - 4:00 PM | Monday to Saturday"
//           className={`${inputClass} !h-auto py-4 leading-relaxed resize-none bg-white border-2 border-slate-100 focus:border-[#2563eb] shadow-sm`}
//           value={formData.interview_timings}
//           onChange={(e) => setFormData({ ...formData, interview_timings: e.target.value })}
//         />
//         <div className="absolute right-4 bottom-4 pointer-events-none">
//           <Users size={14} className="text-slate-200 group-focus-within:text-blue-200 transition-colors" />
//         </div>
//       </div>

//     </div>
//   </div>
// </div>


// {/* ABOUT YOUR COMPANY SECTION */}
// <div className="space-y-6 pt-10 border-t-2 border-slate-100 mt-10">
//   <div className="flex items-center gap-3">
//     <div className="p-2 bg-blue-500 text-white rounded-xl shadow-lg">
//       <Briefcase size={18} strokeWidth={2.5} />
//     </div>
//     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//       About Your Company
//     </h3>
//   </div>

//   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
//     {/* Grid Row 1: Identity */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div className="space-y-2">
//         <label className={`${labelClass} !text-[10px]`}>Company Name <span className="text-red-500">*</span></label>
//         <input 
//           type="text" 
//           className={inputClass} 
//           value={formData.company_name || ""} 
//           onChange={(e) => setFormData({...formData, company_name: e.target.value})}
//         />
//       </div>
//       <div className="space-y-2">
//         <label className={`${labelClass} !text-[10px]`}>Person Name </label>
//         <input 
//           type="text" 
//           className={inputClass} 
//           value={formData.contact_person || ""} 
//           onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
//         />
//       </div>
//     </div>

//     {/* Grid Row 2: Contact Protocol */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div className="space-y-2">
//         <label className={`${labelClass} !text-[10px]`}>Phone Number </label>
//         <div className="flex gap-2">
//           <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-400 flex items-center">
//             +91
//           </div>
//           <input 
//             type="tel" 
//             className={inputClass} 
//             value={formData.company_phone || ""} 
//             onChange={(e) => setFormData({...formData, company_phone: e.target.value})}
//           />
//         </div>
        
//       </div>
//       <div className="space-y-2">
//         <label className={`${labelClass} !text-[10px]`}>Email Id </label>
//         <input 
//           type="email" 
//           className={inputClass} 
//           value={formData.company_email || ""} 
//           onChange={(e) => setFormData({...formData, company_email: e.target.value})}
//         />
       
//       </div>
//     </div>

//     {/* Grid Row 3: Organization Details */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div className="space-y-2">
//         <label className={`${labelClass} !text-[10px]`}>Person Profile </label>
//         <select 
//           className={inputClass}
//           value={formData.contact_profile || "Owner/Partner"}
//           onChange={(e) => setFormData({...formData, contact_profile: e.target.value})}
//         >
//           <option>Owner/Partner</option>
//           <option>HR Manager</option>
//           <option>Recruiter</option>
//         </select>
//       </div>
//       <div className="space-y-2">
//         <label className={`${labelClass} !text-[10px]`}>Size of Org </label>
//         <select 
//           className={inputClass}
//           value={formData.organization_size || ""}
//           onChange={(e) => setFormData({...formData, organization_size: e.target.value})}
//         >
//           <option>1 - 10</option>
//           <option>11 - 50</option>
//           <option>51 - 200</option>
//           <option>200+</option>
//         </select>
//       </div>
//     </div>

//     {/* Row 4: Job Address Node */}
//     <div className="space-y-2">
//       <label className={`${labelClass} !text-[10px]`}>Job Address </label>
//       <textarea 
//         rows={3} 
//         className={`${inputClass} !h-auto py-4 resize-none`}
//         placeholder="Please fill complete address, mention Landmark near your office"
//         value={formData.job_address || ""}
//         onChange={(e) => setFormData({...formData, job_address: e.target.value})}
//       />
//     </div>
//   </div>
// </div>

// </div>

        

             

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Save Vacancy
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     job Vacancy Template
//                   </h3>
//                 </div>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.content}
//                       onChange={(v) => setFormData({ ...formData, content: v })}
//                       modules={quillModules}
//                       placeholder="Describe the role summary..."
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.responsibilities}
//                       onChange={(v) =>
//                         setFormData({ ...formData, responsibilities: v })
//                       }
//                       modules={quillModules}
//                       placeholder="List tactical duties..."
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.requirements}
//                       onChange={(v) =>
//                         setFormData({ ...formData, requirements: v })
//                       }
//                       modules={quillModules}
//                       placeholder="Skills and certifications..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <hr className="border-slate-200" />

//         {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
//                 <Layers size={18} />
//               </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                 Active Vacancies{" "}
//               </h3>
//             </div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//               {vacancies.length} Total Records Found
//             </div>
//           </div>

//           <div className="space-y-4">
//             {loadingList ? (
//               <div className="py-20 flex flex-col items-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                   Fetching Vacancies...
//                 </p>
//               </div>
//             ) : (
//               currentVacancies.map((vacancy) => (
//                 <div
//                   key={vacancy.id}
//                   className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md"
//                 >
//                   {/* Accordion Header */}
//                   <div
//                     // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
//                     onClick={() => toggleAccordion(vacancy)}
//                     className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
//                   >
//                     <div className="flex items-center gap-5 w-full md:w-auto">
//                       <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                         <Briefcase size={24} />
//                       </div>
//                       <div>
//                         <h4 className="text-[15px] font-black text-slate-900 tracking-tight">
//                           {vacancy.title}
//                         </h4>
//                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
//                             <MapPin size={12} className="text-blue-500" />{" "}
//                             {vacancy.location}
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                             <Briefcase className="text-blue-500" size={12} />{" "}
//                             Experience :{" "}
//                             {vacancy.experience_required || "Not Specified"}{" "}
//                             Years
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                             <Users size={12} className="text-blue-500" />{" "}
//                             {vacancy.number_of_openings} Slots
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* --- ACTION & ACCORDION CONTROL --- */}
//                     <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
//                       {/* FINANCIAL METRIC NODE */}
//                       <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
//                         <div className="flex items-center justify-end gap-1.5">
//                           <IndianRupee
//                             size={10}
//                             className="text-slate-900 stroke-[3]"
//                           />
//                           <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
//                             {/* Logic to handle both string ranges and numeric formatting */}
//                             {isNaN(vacancy.salary_range)
//                               ? vacancy.salary_range
//                               : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`}
//                           </p>
//                         </div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
//                           Annual CTC
//                         </p>
//                       </div>
//                       {/* NEW: EDIT REGISTRY BUTTON */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // Stop accordion from opening
//                           navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
//                         }}
//                         className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
//                         title="Edit Vacancy Node"
//                       >
//                         <Edit3 size={18} strokeWidth={2.5} />
//                       </button>

//                       <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//                       {/* INTERACTIVE TOGGLE NODE */}
//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleAccordion(vacancy);
//                         }}
//                         className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
//       ${
//         openAccordionId === vacancy.id
//           ? "bg-slate-900 border-slate-900 text-white shadow-slate-200"
//           : "bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
//       }`}
//                       >
//                         {openAccordionId === vacancy.id ? (
//                           <X
//                             size={18}
//                             className="animate-in fade-in zoom-in duration-300 stroke-[2.5]"
//                           />
//                         ) : (
//                           <Plus
//                             size={18}
//                             className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]"
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Accordion Body */}
//                   {openAccordionId === vacancy.id && (
//                     <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
//                       {loadingJD === vacancy.job_description_id ? (
//                         <div className="py-10 flex flex-col items-center justify-center gap-3">
//                           <Loader2
//                             className="animate-spin text-blue-600"
//                             size={24}
//                           />
//                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                             Retrieving Protocol...
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-8">
//                           {/* TOP INFO BAR */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
//                             <div>
//                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                 Job Role
//                               </p>
//                               <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//                                 {templateDetails[vacancy.job_description_id]
//                                   ?.title || vacancy.title}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                 Job Number
//                               </p>
//                               <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
//                                 GOEX-V-{vacancy.id}-REF-
//                                 {vacancy.job_description_id}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="space-y-4">
//                             <div className="flex items-center gap-2">
//                               <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//                               <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//                                 Job Description
//                               </h5>
//                             </div>

//                             <div className="prose prose-slate max-w-full overflow-hidden">
//                               <div
//                                 className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
//                                 dangerouslySetInnerHTML={{
//                                   __html:
//                                     templateDetails[vacancy.job_description_id]
//                                       ?.content ||
//                                     "No protocol content available for this node.",
//                                 }}
//                               />
//                             </div>
//                           </div>

//                           {/* ACTION STRIP */}
//                           <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
//                             <button
//                               onClick={() =>
//                                 navigate(`/vacancy-details/${vacancy.id}`)
//                               }
//                               className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95"
//                             >
//                               Read full job description <ArrowRight size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-4 pt-6">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-slate-400 border-slate-200 hover:border-blue-500"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `,
//         }}
//       />
//     </div>
//   );
// };

// export default VacanciesDummyPage;
//**************************************************working code phase 2 26/02/26********************************************************** */
// import React, { useState, useEffect, useRef } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate } from "react-router-dom";
// import "react-quill-new/dist/quill.snow.css";
// import {
//   Briefcase,
//   MapPin,
//   Users,
//   Calendar,
//   IndianRupee,
//   Layers,
//   ArrowRight,
//   GraduationCap,
//   FileText,
//   PlusCircle,
//   X,
//   Award,
//   UserPlus,
//   Info,
//   Edit3,
//   Search,
//   Check,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   ChevronDown,
//   Plus,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesDummyPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   // --- NEW STATE FOR LISTING & PAGINATION ---
//   const [vacancies, setVacancies] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [openAccordionId, setOpenAccordionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [deptSearch, setDeptSearch] = useState("");
//   const [showDeptDrop, setShowDeptDrop] = useState(false);
//   const dropdownRef = useRef(null);
//   const [skillInput, setSkillInput] = useState("");
//   const [cityOptions, setCityOptions] = useState([]);
//   const [allMasterSkills, setAllMasterSkills] = useState([]);
// const [skillSearch, setSkillSearch] = useState("");
// const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   // Add this with your other state declarations
// const [activeDetails, setActiveDetails] = useState([]);
// const [allMasterEducation, setAllMasterEducation] = useState([]);
// const [eduSearch, setEduSearch] = useState("");
// const [showEduDrop, setShowEduDrop] = useState(false);
// // Add to your state declarations
// const [allMasterIndustries, setAllMasterIndustries] = useState([]);
// const [industrySearch, setIndustrySearch] = useState("");
// const [showIndustryDrop, setShowIndustryDrop] = useState(false);
// // Add these inside your component
// const [certSearch, setCertSearch] = useState("");
// const [showCertDrop, setShowCertDrop] = useState(false);
// const certRef = useRef(null); // To handle clicking outside


// const [formData, setFormData] = useState({
//   title: "",
//   number_of_openings: 1,
//   // Geo-logic (Now lists)
//   location: [], 
//   state: [],
//   district: [],
//   city: [],
//   department_id: [],
//   pincode: [],
//   // New categorical fields
//   job_type: "Full Time",
//   cand_type: "",
//   experience_required: "",
//   min_age: 0,
//   max_age: 0,
//   // Salary splitting logic
//   min_salary: 0,
//   max_salary: 0,
//   bonus_offered: false,
//   bonus_amount: 0,
//   bonus_type: "",
//   // Requirement arrays
//   skills_req: [],
//   spoken_languages: [],
//   assets_req: [],
//   certificates_req: [],
//   // Timings & Contact
//   office_timings: "9:00 AM - 6:00 PM",
//   interview_timings: "10:00 AM - 4:00 PM",
//   cand_can_call: "",
//   call_timings: "10:00 AM - 5:00 PM",
//   // Metadata
//   status: "open",
//   deadline_date: new Date().toISOString().split("T")[0],
//   job_description_id: null,
//   company_id: 1, // Defaulting to 1 or your system ID
//   industry_id: null,
//   degree_ids: [],
//   // UI helper for Quills
//   content: "", 
//   responsibilities: "",
//   requirements: "",
// });

//   const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
//   const [loadingJD, setLoadingJD] = useState(null);


//   const MASTER_LANGUAGES = [
//   "English", "Hindi", "Marathi", "Punjabi", "Kannada", "Bengali", "Telugu", 
//   "Tamil", "Gujarati", "Urdu", "Malayalam", "Odia", "Assamese", "Santali", 
//   "Meitei (Manipuri)", "Sanskrit"
// ];

// const MANUAL_CERTIFICATES = [
//   "AWS Certified Solutions Architect",
//   "Google Cloud Professional Data Engineer",
//   "Certified Kubernetes Administrator (CKA)",
//   "Cisco Certified Network Associate (CCNA)",
//   "Microsoft Certified: Azure Fundamentals",
//   "CompTIA Security+",
//   "Project Management Professional (PMP)",
//   "Certified Ethical Hacker (CEH)",
//   "ITIL Foundation",
//   "Salesforce Certified Administrator"
// ];

// // Master list based on Image 9
// const MASTER_ASSETS = [
//   "Bike", "License", "Aadhar Card", "PAN Card", "Heavy Driver License", 
//   "Camera", "Laptop", "Auto / Rickshaw", "Tempo", "Tempo Traveller / Van", "Yulu / E-Bike"
// ];


//   // 1. Fetch Master Data & Vacancies
//   useEffect(() => {
//     fetchMasters();
//     fetchVacancies();
//   }, []);

//   useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (certRef.current && !certRef.current.contains(event.target)) {
//       setShowCertDrop(false);
//     }
//   };
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDeptDrop(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);



// // const fetchMasters = async () => {
// //   try {
// //     const [deptRes, skillRes] = await Promise.all([
// //       fetch("https://apihrr.goelectronix.co.in/departments"),
// //       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100")
// //     ]);
    
// //     const deptData = await deptRes.json();
// //     const skillData = await skillRes.json();
    
// //     setDepartments(deptData || []);
// //     setAllMasterSkills(skillData || []); // This holds all possible skills from DB
// //   } catch (err) {
// //     toast.error("Registry connection failed");
// //   }
// // };

// // const fetchMasters = async () => {
// //   try {
// //     const [deptRes, skillRes, eduRes] = await Promise.all([
// //       fetch("https://apihrr.goelectronix.co.in/departments"),
// //       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100"),
// //       fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100")
// //     ]);
    
// //     const deptData = await deptRes.json();
// //     const skillData = await skillRes.json();
// //     const eduData = await eduRes.json();
    
// //     setDepartments(deptData || []);
// //     setAllMasterSkills(skillData || []);
// //     setAllMasterEducation(eduData || []); // Holds education master list
// //   } catch (err) {
// //     toast.error("Registry connection failed");
// //   }
// // };


// const fetchMasters = async () => {
//   try {
//     const [deptRes, skillRes, eduRes, indRes] = await Promise.all([
//       fetch("https://apihrr.goelectronix.co.in/departments"),
//       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100"),
//       fetch("https://apihrr.goelectronix.co.in/masters/educations?skip=0&limit=100"),
//       fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100")
//     ]);
    
//     setDepartments(await deptRes.json() || []);
//     setAllMasterSkills(await skillRes.json() || []);
//     setAllMasterEducation(await eduRes.json() || []);
//     setAllMasterIndustries(await indRes.json() || []); // Holds Industry master list
//   } catch (err) {
//     toast.error("Registry connection failed");
//   }
// };

//   const fetchVacancies = async () => {
//     setLoadingList(true);
//     try {
//       // Fetching with high limit as per your URL example
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setVacancies(data || []);
//     } catch (err) {
//       console.error("Failed to load vacancies");
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (pincode.length !== 6) return;
//     setIsFetchingPincode(true);
//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         setCityOptions(offices);
//         // Auto-fill with first option
//         setFormData((prev) => ({
//           ...prev,
//           city: offices[0].Name,
//           location: offices[0].Name, // Syncing location with city
//           state: offices[0].State,
//           district: offices[0].District,
//           country: offices[0].Country,
//         }));
//       }
//     } catch (err) {
//       toast.error("Geo-sync failed");
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   const fetchJDDetails = async (jdId) => {
//     // If we already have the data, don't fetch again
//     if (templateDetails[jdId]) return;

//     setLoadingJD(jdId);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`,
//       );
//       const data = await res.json();
//       setTemplateDetails((prev) => ({
//         ...prev,
//         [jdId]: data,
//       }));
//     } catch (err) {
//       toast.error("Failed to fetch job protocol details");
//     } finally {
//       setLoadingJD(null);
//     }
//   };

//   const generateExpOptions = () => {
//     const options = [];
//     options.push(
//       <option key="0.5" value="0.5">
//         6 Months
//       </option>,
//     );
//     for (let i = 1; i <= 10; i++) {
//       options.push(
//         <option key={i} value={i}>
//           {i} Year{i > 1 ? "s" : ""}
//         </option>,
//       );
//     }
//     return options;
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   const loadingToast = toast.loading("Executing Enterprise Deployment...");

//   try {
//     // Stage 1: Create Job Description
//     const jdBody = {
//       title: formData.title,
//       role: formData.title,
//       content: formData.content,
//       responsibilities: formData.responsibilities,
//       requirements: formData.requirements,
//       location: formData.location[0] || "", // Assuming string for JD
//       salary_range: `${formData.min_salary} - ${formData.max_salary}`,
//     };

//     const jdRes = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(jdBody),
//     });

//     if (!jdRes.ok) throw new Error("JD Protocol Failed");
//     const jdData = await jdRes.json();

//     // Stage 2: Create Complex Vacancy
//     const vacancyBody = {
//       title: formData.title,
//       number_of_openings: parseInt(formData.number_of_openings),
//       location: Array.isArray(formData.location) ? formData.location : [formData.location],
//       state: Array.isArray(formData.state) ? formData.state : [formData.state],
//       district: Array.isArray(formData.district) ? formData.district : [formData.district],
//       city: Array.isArray(formData.city) ? formData.city : [formData.city],
//       pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
//       job_type: formData.job_type,
//       cand_type: formData.cand_type,
//       experience_required: formData.experience_required,
//       min_age: parseInt(formData.min_age),
//       max_age: parseInt(formData.max_age),
//       min_salary: parseFloat(formData.min_salary),
//       max_salary: parseFloat(formData.max_salary),
//       bonus_offered: formData.bonus_offered,
//       bonus_amount: parseFloat(formData.bonus_amount),
//       bonus_type: formData.bonus_type,
//       skills_req: formData.skills_req,
//       spoken_languages: formData.spoken_languages,
//       assets_req: formData.assets_req,
//       certificates_req: formData.certificates_req,
//       office_timings: formData.office_timings,
//       interview_timings: formData.interview_timings,
//       cand_can_call: formData.cand_can_call,
//       call_timings: formData.call_timings,
//       status: formData.status,
//       deadline_date: formData.deadline_date,
//       job_description_id: jdData.id,
//       department_id: Array.isArray(formData.department_id) 
//     ? parseInt(formData.department_id[0] || 0) 
//     : parseInt(formData.department_id || 0),
//       company_id: parseInt(formData.company_id),
//       industry_id: parseInt(formData.industry_id),
//       degree_ids: formData.degree_ids,
//     };

//     const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(vacancyBody),
//     });

//     if (!vacancyRes.ok) {
//         const err = await vacancyRes.json();
//         console.error("Payload Validation Error:", err);
//         throw new Error("Vacancy Schema Validation Failed");
//     }

//     toast.success("Vacancy Protocol Active! 🚀", { id: loadingToast });
//     fetchVacancies();
//     // Reset logic here...

//   } catch (err) {
//     toast.error(err.message, { id: loadingToast });
//   } finally {
//     setLoading(false);
//   }
// };

//   const toggleAccordion = (vacancy) => {
//     const isOpening = openAccordionId !== vacancy.id;
//     setOpenAccordionId(isOpening ? vacancy.id : null);

//     if (isOpening && vacancy.job_description_id) {
//       fetchJDDetails(vacancy.job_description_id);
//     }
//   };


// const handleCommitCert = (name) => {
//   const cleanName = name.trim();
//   if (!cleanName) return;

//   // Prevent duplicate protocols
//   if (!formData.certificates_req.includes(cleanName)) {
//     setFormData({
//       ...formData,
//       certificates_req: [...formData.certificates_req, cleanName]
//     });
//     toast.success(`Protocol ${cleanName} Added`);
//   } else {
//     toast.error("Protocol already exists in registry");
//   }
  
//   // Clear states and hide dropdown
//   setCertSearch("");
//   setShowCertDrop(false);
// };

//   // Pagination Calculation
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(vacancies.length / itemsPerPage);

//   const inputClass =
//     "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
//   const labelClass =
//     "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-12">
//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck
//             className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none"
//             size={120}
//           />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
//                 Vacancy
//               </h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Recruitment
//                 System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- EXISTING FORM LOGIC --- */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">

          
// <div className="space-y-3 w-full">
//   <label className={labelClass}>
//     Job Type <span className="text-red-500">*</span>
//   </label>
//   <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//     {["Full Time", "Part Time"].map((type) => {
//       const isActive = formData.job_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, job_type: type })}
//           className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
//             isActive
//               ? "!bg-[#2563eb] text-white shadow-lg scale-[1.02]"
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent"
//           }`}
//         >
//           {type}
//         </button>
//       );
//     })}
//   </div>
// </div>
//               {/* Department Multi-Select */}
//               <div className="relative" ref={dropdownRef}>
//                 <label className={labelClass}>Department</label>
//                 <div
//                   onClick={() => setShowDeptDrop(!showDeptDrop)}
//                   className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
//                 >
//                   {formData.department_id.length > 0 ? (
//                     formData.department_id.map((id) => (
//                       <span
//                         key={id}
//                         className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95"
//                       >
//                         {
//                           departments.find(
//                             (d) => d.id.toString() === id.toString(),
//                           )?.name
//                         }
//                         <X
//                           size={12}
//                           className="hover:text-red-400"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setFormData({
//                               ...formData,
//                               department_id: formData.department_id.filter(
//                                 (item) => item !== id,
//                               ),
//                             });
//                           }}
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
//                       Select department...
//                     </span>
//                   )}
//                 </div>
//                 {showDeptDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                     <div className="p-3 border-b border-slate-50">
//                       <input
//                         autoFocus
//                         placeholder="Filter department..."
//                         value={deptSearch}
//                         onChange={(e) => setDeptSearch(e.target.value)}
//                         className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none"
//                       />
//                     </div>
//                     <div className="max-h-48 overflow-y-auto p-2">
//                       {departments
//                         .filter((d) =>
//                           d.name
//                             .toLowerCase()
//                             .includes(deptSearch.toLowerCase()),
//                         )
//                         .map((dept) => (
//                           <button
//                             key={dept.id}
//                             type="button"
//                             onClick={() => {
//                               const isSelected =
//                                 formData.department_id.includes(
//                                   dept.id.toString(),
//                                 );
//                               setFormData({
//                                 ...formData,
//                                 department_id: isSelected
//                                   ? formData.department_id.filter(
//                                       (i) => i !== dept.id.toString(),
//                                     )
//                                   : [
//                                       ...formData.department_id,
//                                       dept.id.toString(),
//                                     ],
//                               });
//                             }}
//                             className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
//                           >
//                             {dept.name}{" "}
//                             {formData.department_id.includes(
//                               dept.id.toString(),
//                             ) && <Check size={14} strokeWidth={3} />}
//                           </button>
//                         ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Job Identity</label>
//                   <input
//                     required
//                     placeholder="Position Title"
//                     className={inputClass}
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Opening</label>
//                   <input
//                     type="number"
//                     className={inputClass}
//                     value={formData.number_of_openings}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         number_of_openings: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//   <label className={labelClass}>District</label>
//   <div className="relative group">
//     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//       <MapPin size={14} strokeWidth={2.5} />
//     </div>
//     <input
//       required
//       placeholder="e.g. Mumbai, Maharashtra"
//       className={`${inputClass} pl-10`}
//       value={formData.location}
//       onChange={(e) =>
//         setFormData({ ...formData, location: e.target.value })
//       }
//     />
//   </div>
// </div>
//          <div>
//   <label className={labelClass}>city</label>
//   <div className="relative group">
//     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//       <MapPin size={14} strokeWidth={2.5} />
//     </div>
//     <input
//       required
//       placeholder="e.g. Mumbai, Maharashtra"
//       className={`${inputClass} pl-10`}
//       value={formData.district}
//       onChange={(e) =>
//         setFormData({ ...formData, district: e.target.value })
//       }
//     />
//   </div>
// </div>
//               </div>


//               {/* Experience Logic */}
//               <div className="pt-2">
//                 <label className={labelClass}>Experience</label>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
//                   {["Fresher", "Experienced"].map((type) => (
//                     <button
//                       key={type}
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           experience_required:
//                             type === "Fresher" ? "Fresher" : "1 - 3 Years",
//                         })
//                       }
//                       className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${(type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                     >
//                       {type.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//                 {formData.experience_required !== "Fresher" && (
//                   <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
//                     <select
//                       className={inputClass}
//                       value={formData.experience_required.split(" - ")[0]}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || "1"} Years`,
//                         })
//                       }
//                     >
//                       {generateExpOptions()}
//                     </select>
//                     <select
//                       className={inputClass}
//                       value={formData.experience_required
//                         .split(" - ")[1]
//                         ?.replace(" Years", "")}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`,
//                         })
//                       }
//                     >
//                       {generateExpOptions()}
//                     </select>
//                   </div>
//                 )}
//               </div>

            


//               {/* SALARY RANGE GRID */}
// <div className="grid grid-cols-1 gap-4 pt-2">
//   <div className="space-y-2 pt-2">
//     <label className={labelClass}>Salary (LPA)</label>
//     <div className="grid grid-cols-2 gap-4 items-center">
      
//       {/* MIN SALARY NODE */}
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//           <IndianRupee size={12} strokeWidth={3} />
//         </div>
//         <input
//           type="number"
//           step="0.1"
//           placeholder="Min"
//           className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           value={formData.min_salary}
//           onChange={(e) => 
//             setFormData({ ...formData, min_salary: e.target.value })
//           }
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
//             Min
//           </span>
//         </div>
//       </div>

//       {/* MAX SALARY NODE */}
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//           <IndianRupee size={12} strokeWidth={3} />
//         </div>
//         <input
//           type="number"
//           step="0.1"
//           placeholder="Max"
//           className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           value={formData.max_salary}
//           onChange={(e) => 
//             setFormData({ ...formData, max_salary: e.target.value })
//           }
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
//             Max
//           </span>
//         </div>
//       </div>

//     </div>
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//       Annual CTC Range in Lakhs
//     </p>
//   </div>
// </div>

// <div>
//     {/* BONUS PROTOCOL SECTION */}
// <div className="space-y-4 pt-4 border-t border-slate-100">
//   <div className="flex items-center justify-between">
//     <label className={labelClass}>
//       Bonus offered in addition to salary? <span className="text-red-500">*</span>
//     </label>
    
//     {/* WorkIndia Style Toggle */}
//     <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//       {[
//         { label: "YES", value: true },
//         { label: "NO", value: false }
//       ].map((opt) => (
//         <button
//           key={opt.label}
//           type="button"
//           onClick={() => setFormData({ ...formData, bonus_offered: opt.value })}
//           className={`px-6 py-1.5 text-[10px] font-black rounded-lg transition-all ${
//             formData.bonus_offered === opt.value
//               ? "bg-blue-600 text-white shadow-md"
//               : "text-slate-500 hover:text-slate-700"
//           }`}
//         >
//           {opt.label}
//         </button>
//       ))}
//     </div>
//   </div>



//   {/* Conditional Bonus Details */}
//   {formData.bonus_offered && (
//     <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-top-2 duration-300">
//       <div className="space-y-2">
//         <label className={labelClass}>Max Bonus Amount</label>
//         <div className="relative group">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
//             <IndianRupee size={12} strokeWidth={3} />
//           </div>
//           <input
//             type="number"
//             placeholder="e.g. 50000"
//             className={`${inputClass} pl-9`}
//             value={formData.bonus_amount || ""}
//             onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <label className={labelClass}>Bonus Type</label>
//         <div className="relative group">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
//             <Award size={14} strokeWidth={2.5} />
//           </div>
//           <input
//             type="text"
//             placeholder="e.g. Performance, Sign-on"
//             className={`${inputClass} pl-9`}
//             value={formData.bonus_type}
//             onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   )}
// </div>

//   {/* CANDIDATE CALL PROTOCOL */}
// <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="space-y-3">
//     <label className={labelClass}>
//       Candidates can call me <span className="text-red-500">*</span>
//     </label>
    
//     {/* WorkIndia Style Multi-Toggle */}
//     <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//       {["Everyday", "Monday to Friday", "Monday to Saturday"].map((option) => {
//         const isActive = formData.cand_can_call === option;
//         return (
//           <button
//             key={option}
//             type="button"
//             onClick={() => setFormData({ ...formData, cand_can_call: option })}
//             className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-300 ${
//               isActive
//                 ? "bg-[#2563eb] text-white shadow-lg scale-[1.02]"
//                 : "text-slate-500 hover:text-slate-700 bg-transparent"
//             }`}
//           >
//             {option}
//           </button>
//         );
//       })}
//     </div>
//   </div>

//   {/* Call Timings Input */}
//   <div className="space-y-2 max-w-md">
//     <label className={labelClass}>Call Timings</label>
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <Clock size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="e.g. 10 AM to 6 PM"
//         className={`${inputClass} pl-11`}
//         value={formData.call_timings}
//         onChange={(e) => setFormData({ ...formData, call_timings: e.target.value })}
//       />
//     </div>
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//       Specify your availability for candidate inquiries
//     </p>
//   </div>
// </div>





// {/* SKILLS TAG REGISTRY SECTION - FULL VISIBILITY MODE */}
// {/* SKILLS TAG REGISTRY - DATABASE LINKED */}
// <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="flex items-center justify-between ml-1">
//     <label className={labelClass}>
//       Skills <span className="text-red-500">*</span>
//     </label>
//     <span className="text-[9px] font-black !text-[#2563eb] uppercase tracking-widest !bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
//       {formData.skills_req.length} Selected for Deployment
//     </span>
//   </div>

//   <div className="grid grid-cols-1 gap-4">
//     {/* 1. SEARCH INPUT */}
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
//         <Search size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="Required skills "
//         className={`${inputClass} pl-12 py-3.5`}
//         value={skillSearch}
//         onChange={(e) => setSkillSearch(e.target.value)}
//       />
//     </div>

//     {/* 2. MASTER SELECTION POOL (Scrollable Area) */}
//     <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
//         Skills 
//       </p>
      
//       <div className="max-h-[250px] overflow-y-auto flex flex-wrap gap-2 custom-scrollbar">
//         {allMasterSkills
//           .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
//           .map((skill) => {
//             const isSelected = formData.skills_req.includes(skill.name);
//             return (
//               <button
//                 key={skill.id}
//                 type="button"
//                 onClick={() => {
//                   const updatedSkills = isSelected
//                     ? formData.skills_req.filter(s => s !== skill.name)
//                     : [...formData.skills_req, skill.name];
//                   setFormData({ ...formData, skills_req: updatedSkills });
//                 }}
//                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
//                   isSelected
//                     ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-lg !shadow-blue-200"
//                     : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
//                 }`}
//               >
//                 {skill.name}
//                 {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} />}
//               </button>
//             );
//           })}
        
//         {allMasterSkills.length === 0 && (
//           <div className="w-full py-10 flex flex-col items-center gap-2 text-slate-400">
//             <Loader2 className="animate-spin" size={20} />
//             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Syncing Master Skills...</span>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>

//   {/* 3. COMPLIANCE INFO BOX */}
  
// </div>


// {/* PERSONAL & ADDITIONAL INFO HUB */}
// <div className="space-y-6 pt-6 border-t border-slate-100">
//   <div className="flex items-center gap-3">
//     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100">
//       <UserPlus size={18} strokeWidth={2.5} />
//     </div>
//     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//       Personal Details, Education, & Additional Info
//     </h3>
//   </div>

//   {/* TOGGLE SELECTORS - Matches Image 5 */}
//   <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-[2rem]">
//     {[
//       { id: 'age', label: 'Age', icon: <Calendar size={14} /> },
//       { id: 'languages', label: 'Preferred Language', icon: <Plus size={14} /> },
//       { id: 'assets', label: 'Assets', icon: <Plus size={14} /> },
//       { id: 'degree', label: 'Degree and Specialisation', icon: <Plus size={14} /> },
//       { id: 'certification', label: 'Certification', icon: <Plus size={14} /> },
//       { id: 'industry', label: 'Preferred Industry', icon: <Plus size={14} /> }
//     ].map((item) => {
//       const isAdded = activeDetails.includes(item.id);
//       return (
//         <button
//           key={item.id}
//           type="button"
//           onClick={() => {
//             setActiveDetails(prev => 
//               prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
//             );
//           }}
//           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-300 ${
//             isAdded 
//               ? "bg-white border-[#2563eb] text-[#2563eb] shadow-sm ring-2 ring-blue-50" 
//               : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
//           }`}
//         >
//           {item.label} {isAdded ? <Check size={14} strokeWidth={3} className="text-[#2563eb]" /> : item.icon}
//         </button>
//       );
//     })}
//   </div>

//   {/* DYNAMIC FORM FIELDS - Conditioned on Toggles */}
//   <div className="space-y-6">
//     {/* AGE SECTION - Matches Image 5 Bottom */}
//     {activeDetails.includes('age') && (
//       <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group">
//         <button 
//           className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//           onClick={() => setActiveDetails(prev => prev.filter(i => i !== 'age'))}
//         >
//           <X size={18} strokeWidth={3} />
//         </button>
        
//         <label className={labelClass}>Candidate Age Registry</label>
//         <div className="grid grid-cols-2 gap-8 mt-4">
//           <div className="space-y-2">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Age</span>
//             <input 
//               type="number" 
//               placeholder="Eg: 18" 
//               className={inputClass}
//               value={formData.min_age}
//               onChange={(e) => setFormData({...formData, min_age: e.target.value})}
//             />
//           </div>
//           <div className="space-y-2">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Age</span>
//             <input 
//               type="number" 
//               placeholder="Eg: 40" 
//               className={inputClass}
//               value={formData.max_age}
//               onChange={(e) => setFormData({...formData, max_age: e.target.value})}
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Placeholder for other sections (Languages, Assets, etc.) */}
//     {/* PREFERRED LANGUAGE REGISTRY */}
// {activeDetails.includes('languages') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'languages'));
//         setFormData({...formData, spoken_languages: []}); // Clear data when removed
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center gap-2 mb-4">
//       <label className={labelClass}>Preferred Language</label>
//       <Info size={12} className="text-slate-400" />
//     </div>

//     <div className="flex flex-wrap gap-2">
//       {MASTER_LANGUAGES.map((lang) => {
//         const isSelected = formData.spoken_languages.includes(lang);
//         return (
//           <button
//             key={lang}
//             type="button"
//             onClick={() => {
//               const updated = isSelected
//                 ? formData.spoken_languages.filter(l => l !== lang)
//                 : [...formData.spoken_languages, lang];
//               setFormData({ ...formData, spoken_languages: updated });
//             }}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-200 ${
//               isSelected
//                 ? "bg-[#2563eb] border-[#2563eb] text-white shadow-md shadow-blue-100"
//                 : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
//             }`}
//           >
//             {lang}
//             {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
//           </button>
//         );
//       })}
//     </div>
//   </div>
// )}


// {/* DEGREE & SPECIALISATION REGISTRY */}
// {activeDetails.includes('degree') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'degree'));
//         setFormData({...formData, degree_ids: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-4 mr-10">
//       <label className={labelClass}>Degree and Specialisation</label>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
//         {formData.degree_ids.length} Qualifications Required
//       </span>
//     </div>

//     {/* Selection Area */}
//     <div className="space-y-4">
//       {/* 1. Selected Degree Badges */}
//       <div className="flex flex-wrap gap-2 min-h-[40px]">
//         {formData.degree_ids.map((eduId) => {
//           const edu = allMasterEducation.find(e => e.id === eduId);
//           return (
//             <span 
//               key={eduId}
//               className="flex items-center gap-2 px-3 py-1.5 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95"
//             >
//               {edu?.name}
//               <X 
//                 size={12} 
//                 className="cursor-pointer hover:text-red-200 transition-colors" 
//                 onClick={() => setFormData({
//                   ...formData,
//                   degree_ids: formData.degree_ids.filter(id => id !== eduId)
//                 })}
//               />
//             </span>
//           );
//         })}
//         {formData.degree_ids.length === 0 && (
//           <p className="text-[11px] font-bold text-slate-400 italic py-1">Search and add mandatory degrees...</p>
//         )}
//       </div>

//       {/* 2. Searchable Input Node */}
//       <div className="relative group">
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//           <GraduationCap size={16} strokeWidth={2.5} />
//         </div>
//         <input
//           type="text"
//           placeholder="Choose Specialisation (e.g. B.Tech, MBA)..."
//           className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//           value={eduSearch}
//           onFocus={() => setShowEduDrop(true)}
//           onChange={(e) => setEduSearch(e.target.value)}
//         />

//         {/* 3. Dropdown Menu */}
//         {showEduDrop && (
//           <div className="absolute left-0 right-0 top-full mt-2 max-h-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
//             <div className="p-2 border-b border-slate-50 mb-1">
//                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Education Registry</p>
//             </div>
//             {allMasterEducation
//               .filter(edu => 
//                 edu.name.toLowerCase().includes(eduSearch.toLowerCase()) && 
//                 !formData.degree_ids.includes(edu.id)
//               )
//               .map((edu) => (
//                 <button
//                   key={edu.id}
//                   type="button"
//                   onClick={() => {
//                     setFormData({
//                       ...formData,
//                       degree_ids: [...formData.degree_ids, edu.id]
//                     });
//                     setEduSearch("");
//                     setShowEduDrop(false);
//                   }}
//                   className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item"
//                 >
//                   {edu.name}
//                   <Plus size={14} className="text-slate-300 group-hover/item:text-[#2563eb]" />
//                 </button>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )}


// {/* PREFERRED INDUSTRY REGISTRY */}
// {activeDetails.includes('industry') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'industry'));
//         setFormData({...formData, industry_id: null}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center gap-2 mb-4">
//       <label className={labelClass}>Preferred Industry</label>
//       <Info size={12} className="text-slate-400" />
//     </div>

//     {/* Selection Node */}
//     <div className="space-y-4">
//       {/* 1. Selected Industry Badge (Single Selection Logic) */}
//       <div className="min-h-[40px]">
//         {formData.industry_id ? (
//           <div className="flex items-center gap-2 w-fit px-4 py-2 bg-[#2563eb] text-white rounded-xl text-[11px] font-black uppercase tracking-wider animate-in zoom-in-95">
//             <Layers size={14} />
//             {allMasterIndustries.find(i => i.id === formData.industry_id)?.name}
//             <X 
//               size={14} 
//               className="cursor-pointer hover:text-red-200 ml-1" 
//               onClick={() => setFormData({...formData, industry_id: null})}
//             />
//           </div>
//         ) : (
//           <p className="text-[11px] font-bold text-slate-400 italic">No industry selected for this node protocol...</p>
//         )}
//       </div>

//       {/* 2. Searchable Input Node */}
//       {!formData.industry_id && (
//         <div className="relative group">
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//             <Search size={16} strokeWidth={2.5} />
//           </div>
//           <input
//             type="text"
//             placeholder="Search suggested industries (e.g. Finance, IT, Retail)..."
//             className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//             value={industrySearch}
//             onFocus={() => setShowIndustryDrop(true)}
//             onChange={(e) => setIndustrySearch(e.target.value)}
//           />

//           {/* 3. Dropdown Menu */}
//           {showIndustryDrop && (
//             <div className="absolute left-0 right-0 top-full mt-2 max-h-60 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
//               {allMasterIndustries
//                 .filter(ind => ind.name.toLowerCase().includes(industrySearch.toLowerCase()))
//                 .map((ind) => (
//                   <button
//                     key={ind.id}
//                     type="button"
//                     onClick={() => {
//                       setFormData({ ...formData, industry_id: ind.id });
//                       setIndustrySearch("");
//                       setShowIndustryDrop(false);
//                     }}
//                     className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item"
//                   >
//                     {ind.name}
//                     <Plus size={14} className="text-slate-300 group-hover/item:text-[#2563eb]" />
//                   </button>
//                 ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   </div>
// )}

// {/* ASSETS REQUIREMENT REGISTRY */}
// {activeDetails.includes('assets') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4">
//     {/* Remove Section Button */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'assets'));
//         setFormData({...formData, assets_req: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-4 mr-10">
//       <div className="flex items-center gap-2">
//         <label className={labelClass}>Required Assets</label>
//         <Info size={12} className="text-slate-400" />
//       </div>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
//         {formData.assets_req.length} Items Mandatory
//       </span>
//     </div>

//     {/* Asset Badge Pool - Matches Image 9 */}
//     <div className="flex flex-wrap gap-2.5">
//       {MASTER_ASSETS.map((asset) => {
//         const isSelected = formData.assets_req.includes(asset);
//         return (
//           <button
//             key={asset}
//             type="button"
//             onClick={() => {
//               const updated = isSelected
//                 ? formData.assets_req.filter(a => a !== asset)
//                 : [...formData.assets_req, asset];
//               setFormData({ ...formData, assets_req: updated });
//             }}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all duration-200 ${
//               isSelected
//                 ? "bg-[#2563eb] border-[#2563eb] text-white shadow-md shadow-blue-100 scale-[1.02]"
//                 : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
//             }`}
//           >
//             {asset}
//             {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={3} />}
//           </button>
//         );
//       })}
//     </div>
//   </div>
// )}


// {/* CERTIFICATION REGISTRY - MANUAL MULTI-SELECT */}
// {/* {activeDetails.includes('certification') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4" ref={certRef}>
  
//     <button 
//       type="button"
//       className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'certification'));
//         setFormData({...formData, certificates_req: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-5 mr-10">
//       <div className="flex items-center gap-2">
//         <label className={labelClass}>Certification Requirements</label>
//         <div className="p-1 bg-blue-50 rounded text-[#2563eb]">
//           <Award size={12} strokeWidth={2.5} />
//         </div>
//       </div>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm">
//         {formData.certificates_req.length} PROTOCOLS ADDED
//       </span>
//     </div>

//     <div className="space-y-4">
     
//       <div className="flex flex-wrap gap-2.5 min-h-[40px]">
//         {formData.certificates_req.map((certName, index) => (
//           <div 
//             key={index}
//             className="flex items-center gap-2 px-3.5 py-2 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100"
//           >
//             {certName}
//             <X 
//               size={13} 
//               className="cursor-pointer hover:text-red-200 transition-colors" 
//               strokeWidth={3}
//               onClick={() => setFormData({
//                 ...formData,
//                 certificates_req: formData.certificates_req.filter(c => c !== certName)
//               })}
//             />
//           </div>
//         ))}
//         {formData.certificates_req.length === 0 && (
//           <div className="flex items-center gap-2 text-slate-300 italic py-2">
//             <Info size={14} />
//             <p className="text-[11px] font-bold">No certifications currently committed to this node...</p>
//           </div>
//         )}
//       </div>

//       <div className="relative group">
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//           <Search size={16} strokeWidth={2.5} />
//         </div>
//         <input
//           type="text"
//           placeholder="Search predefined manual registry..."
//           className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//           value={certSearch}
//           onFocus={() => setShowCertDrop(true)}
//           onChange={(e) => setCertSearch(e.target.value)}
//         />

       
//         {showCertDrop && (
//           <div className="absolute left-0 right-0 top-full mt-3 max-h-60 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-[100] overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 border-t-4 border-t-[#2563eb]">
//             <div className="px-4 py-2 border-b border-slate-50 mb-2">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manual Node Options</p>
//             </div>
//             {MANUAL_CERTIFICATES
//               .filter(name => 
//                 name.toLowerCase().includes(certSearch.toLowerCase()) && 
//                 !formData.certificates_req.includes(name)
//               )
//               .map((name, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => {
//                     setFormData({
//                       ...formData,
//                       certificates_req: [...formData.certificates_req, name]
//                     });
//                     setCertSearch("");
//                     setShowCertDrop(false);
//                   }}
//                   className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item"
//                 >
//                   {name}
//                   <Plus size={14} strokeWidth={3} className="text-slate-200 group-hover/item:text-[#2563eb] transition-colors" />
//                 </button>
//               ))}
//             {MANUAL_CERTIFICATES.filter(n => n.toLowerCase().includes(certSearch.toLowerCase())).length === 0 && (
//               <div className="p-6 text-center">
//                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">Requirement not found in manual registry</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )} */}


// {/* CERTIFICATION REGISTRY - SEARCH OR ADD CUSTOM */}
// {/* CERTIFICATION REGISTRY - SEARCH OR ADD CUSTOM */}
// {/* CERTIFICATION REGISTRY - INTELLIGENT SEARCH & CUSTOM ADD */}
// {activeDetails.includes('certification') && (
//   <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group mt-4" ref={certRef}>
    
//     {/* Section Discard */}
//     <button 
//       type="button"
//       className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//       onClick={() => {
//         setActiveDetails(prev => prev.filter(i => i !== 'certification'));
//         setFormData({...formData, certificates_req: []}); 
//       }}
//     >
//       <X size={18} strokeWidth={3} />
//     </button>

//     <div className="flex items-center justify-between mb-5 mr-10">
//       <div className="flex items-center gap-2">
//         <label className={labelClass}>Certification Requirements</label>
//         <div className="p-1 bg-blue-50 rounded text-[#2563eb]">
//           <Award size={12} strokeWidth={2.5} />
//         </div>
//       </div>
//       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
//         {formData.certificates_req.length} SECURE REQS
//       </span>
//     </div>

//     <div className="space-y-4">
//       {/* 1. Registry Badges (Selected Data Above) */}
//       <div className="flex flex-wrap gap-2.5 min-h-[40px]">
//         {formData.certificates_req.map((certName, index) => (
//           <div 
//             key={index}
//             className="flex items-center gap-2 px-3.5 py-2 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 shadow-md shadow-blue-100"
//           >
//             {certName}
//             <X 
//               size={13} 
//               className="cursor-pointer hover:text-red-200 transition-colors" 
//               strokeWidth={3}
//               onClick={() => setFormData({
//                 ...formData,
//                 certificates_req: formData.certificates_req.filter(c => c !== certName)
//               })}
//             />
//           </div>
//         ))}
//       </div>

//       {/* 2. Intelligent Search/Entry Node */}
//       <div className="relative group">
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
//           <Search size={16} strokeWidth={2.5} />
//         </div>
//         <input
//           type="text"
//           placeholder="Click to view all or search..."
//           className={`${inputClass} pl-12 py-3.5 bg-slate-50`}
//           value={certSearch}
//           onFocus={() => setShowCertDrop(true)} // Shows all on click
//           onChange={(e) => setCertSearch(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && certSearch.trim()) {
//                e.preventDefault();
//                handleCommitCert(certSearch.trim());
//             }
//           }}
//         />

//         {/* 3. Predefined & Custom Dropdown Area */}
//         {showCertDrop && (
//           <div className="absolute left-0 right-0 top-full mt-3 max-h-64 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-[100] overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 border-t-4 border-t-[#2563eb]">
            
//             {/* Header for Dropdown */}
//             <div className="px-4 py-2 border-b border-slate-50 mb-2">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                 {certSearch ? `Results for "${certSearch}"` : 'Global Registry'}
//               </p>
//             </div>

//             {/* List Item Logic */}
//             {MANUAL_CERTIFICATES
//               .filter(name => 
//                 name.toLowerCase().includes(certSearch.toLowerCase()) && 
//                 !formData.certificates_req.includes(name)
//               )
//               .map((name, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => handleCommitCert(name)}
//                   className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight transition-all flex items-center justify-between group/item mb-1"
//                 >
//                   {name}
//                   <PlusCircle size={14} className="text-slate-200 group-hover/item:text-[#2563eb]" />
//                 </button>
//               ))}

//             {/* CUSTOM ADD BUTTON: Appears if no exact match exists or if search is unique */}
//             {certSearch.trim() !== "" && !MANUAL_CERTIFICATES.some(c => c.toLowerCase() === certSearch.toLowerCase()) && (
//               <button
//                 type="button"
//                 onClick={() => handleCommitCert(certSearch)}
//                 className="w-full flex items-center justify-between px-4 py-4 bg-slate-900 text-white rounded-xl mt-2 hover:bg-black transition-all shadow-lg active:scale-95 border-2 border-blue-500/20"
//               >
//                 <div className="flex flex-col text-left">
//                   <span className="text-[8px] font-black uppercase text-blue-400 leading-none mb-1.5">Add Custom Requirement</span>
//                   <span className="text-[11px] font-black uppercase tracking-widest leading-none truncate max-w-[250px]">Commit "{certSearch}"</span>
//                 </div>
//                 <Zap size={16} className="text-blue-400 fill-blue-400 animate-pulse" />
//               </button>
//             )}

//             {/* Empty State when no results and no search text */}
//             {!certSearch && MANUAL_CERTIFICATES.length === 0 && (
//                <div className="p-4 text-center text-slate-400 text-[10px] font-bold uppercase">No Registry Data</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )}

//   </div>
// </div>

// </div>

        

             

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Save Vacancy
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     job Vacancy Template
//                   </h3>
//                 </div>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.content}
//                       onChange={(v) => setFormData({ ...formData, content: v })}
//                       modules={quillModules}
//                       placeholder="Describe the role summary..."
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.responsibilities}
//                       onChange={(v) =>
//                         setFormData({ ...formData, responsibilities: v })
//                       }
//                       modules={quillModules}
//                       placeholder="List tactical duties..."
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.requirements}
//                       onChange={(v) =>
//                         setFormData({ ...formData, requirements: v })
//                       }
//                       modules={quillModules}
//                       placeholder="Skills and certifications..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <hr className="border-slate-200" />

//         {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
//                 <Layers size={18} />
//               </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                 Active Vacancies{" "}
//               </h3>
//             </div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//               {vacancies.length} Total Records Found
//             </div>
//           </div>

//           <div className="space-y-4">
//             {loadingList ? (
//               <div className="py-20 flex flex-col items-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                   Fetching Vacancies...
//                 </p>
//               </div>
//             ) : (
//               currentVacancies.map((vacancy) => (
//                 <div
//                   key={vacancy.id}
//                   className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md"
//                 >
//                   {/* Accordion Header */}
//                   <div
//                     // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
//                     onClick={() => toggleAccordion(vacancy)}
//                     className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
//                   >
//                     <div className="flex items-center gap-5 w-full md:w-auto">
//                       <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                         <Briefcase size={24} />
//                       </div>
//                       <div>
//                         <h4 className="text-[15px] font-black text-slate-900 tracking-tight">
//                           {vacancy.title}
//                         </h4>
//                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
//                             <MapPin size={12} className="text-blue-500" />{" "}
//                             {vacancy.location}
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                             <Briefcase className="text-blue-500" size={12} />{" "}
//                             Experience :{" "}
//                             {vacancy.experience_required || "Not Specified"}{" "}
//                             Years
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                             <Users size={12} className="text-blue-500" />{" "}
//                             {vacancy.number_of_openings} Slots
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* --- ACTION & ACCORDION CONTROL --- */}
//                     <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
//                       {/* FINANCIAL METRIC NODE */}
//                       <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
//                         <div className="flex items-center justify-end gap-1.5">
//                           <IndianRupee
//                             size={10}
//                             className="text-slate-900 stroke-[3]"
//                           />
//                           <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
//                             {/* Logic to handle both string ranges and numeric formatting */}
//                             {isNaN(vacancy.salary_range)
//                               ? vacancy.salary_range
//                               : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`}
//                           </p>
//                         </div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
//                           Annual CTC
//                         </p>
//                       </div>
//                       {/* NEW: EDIT REGISTRY BUTTON */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // Stop accordion from opening
//                           navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
//                         }}
//                         className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
//                         title="Edit Vacancy Node"
//                       >
//                         <Edit3 size={18} strokeWidth={2.5} />
//                       </button>

//                       <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//                       {/* INTERACTIVE TOGGLE NODE */}
//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleAccordion(vacancy);
//                         }}
//                         className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
//       ${
//         openAccordionId === vacancy.id
//           ? "bg-slate-900 border-slate-900 text-white shadow-slate-200"
//           : "bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
//       }`}
//                       >
//                         {openAccordionId === vacancy.id ? (
//                           <X
//                             size={18}
//                             className="animate-in fade-in zoom-in duration-300 stroke-[2.5]"
//                           />
//                         ) : (
//                           <Plus
//                             size={18}
//                             className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]"
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Accordion Body */}
//                   {openAccordionId === vacancy.id && (
//                     <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
//                       {loadingJD === vacancy.job_description_id ? (
//                         <div className="py-10 flex flex-col items-center justify-center gap-3">
//                           <Loader2
//                             className="animate-spin text-blue-600"
//                             size={24}
//                           />
//                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                             Retrieving Protocol...
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-8">
//                           {/* TOP INFO BAR */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
//                             <div>
//                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                 Job Role
//                               </p>
//                               <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//                                 {templateDetails[vacancy.job_description_id]
//                                   ?.title || vacancy.title}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                 Job Number
//                               </p>
//                               <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
//                                 GOEX-V-{vacancy.id}-REF-
//                                 {vacancy.job_description_id}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="space-y-4">
//                             <div className="flex items-center gap-2">
//                               <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//                               <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//                                 Job Description
//                               </h5>
//                             </div>

//                             <div className="prose prose-slate max-w-full overflow-hidden">
//                               <div
//                                 className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
//                                 dangerouslySetInnerHTML={{
//                                   __html:
//                                     templateDetails[vacancy.job_description_id]
//                                       ?.content ||
//                                     "No protocol content available for this node.",
//                                 }}
//                               />
//                             </div>
//                           </div>

//                           {/* ACTION STRIP */}
//                           <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
//                             <button
//                               onClick={() =>
//                                 navigate(`/vacancy-details/${vacancy.id}`)
//                               }
//                               className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95"
//                             >
//                               Read full job description <ArrowRight size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-4 pt-6">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-slate-400 border-slate-200 hover:border-blue-500"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `,
//         }}
//       />
//     </div>
//   );
// };

// export default VacanciesDummyPage;
///************************************************working code phase 1 26/02/26************************************************************ */
// import React, { useState, useEffect, useRef } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate } from "react-router-dom";
// import "react-quill-new/dist/quill.snow.css";
// import {
//   Briefcase,
//   MapPin,
//   Users,
//   Calendar,
//   IndianRupee,
//   Layers,
//   ArrowRight,
//   FileText,
//   PlusCircle,
//   X,
//   Award,
//   UserPlus,
//   Info,
//   Edit3,
//   Search,
//   Check,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   ChevronDown,
//   Plus,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesDummyPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   // --- NEW STATE FOR LISTING & PAGINATION ---
//   const [vacancies, setVacancies] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [openAccordionId, setOpenAccordionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [deptSearch, setDeptSearch] = useState("");
//   const [showDeptDrop, setShowDeptDrop] = useState(false);
//   const dropdownRef = useRef(null);
//   const [skillInput, setSkillInput] = useState("");
//   const [cityOptions, setCityOptions] = useState([]);
//   const [allMasterSkills, setAllMasterSkills] = useState([]);
// const [skillSearch, setSkillSearch] = useState("");
// const [showSkillDrop, setShowSkillDrop] = useState(false);
//   const [isFetchingPincode, setIsFetchingPincode] = useState(false);
//   // Add this with your other state declarations
// const [activeDetails, setActiveDetails] = useState([]);
// //   const [formData, setFormData] = useState({
// //   title: "",
// //   department_id: [], // Assuming multi-select
// //   number_of_openings: 1,
// //   location: [], // Fixed: Now an empty list
// //   experience_required: "Fresher", // Fixed: Default to Fresher
// //   salary_range: "",
// //   location: "",
// //   status: "open",
// //   deadline_date: new Date().toISOString().split("T")[0],
// //   content: "",
// //   responsibilities: "",
// //   requirements: "",
// // });

// const [formData, setFormData] = useState({
//   title: "",
//   number_of_openings: 1,
//   // Geo-logic (Now lists)
//   location: [], 
//   state: [],
//   district: [],
//   city: [],
//   department_id: [],
//   pincode: [],
//   // New categorical fields
//   job_type: "Full Time",
//   cand_type: "",
//   experience_required: "",
//   min_age: 0,
//   max_age: 0,
//   // Salary splitting logic
//   min_salary: 0,
//   max_salary: 0,
//   bonus_offered: false,
//   bonus_amount: 0,
//   bonus_type: "",
//   // Requirement arrays
//   skills_req: [],
//   spoken_languages: [],
//   assets_req: [],
//   certificates_req: [],
//   // Timings & Contact
//   office_timings: "9:00 AM - 6:00 PM",
//   interview_timings: "10:00 AM - 4:00 PM",
//   cand_can_call: "",
//   call_timings: "10:00 AM - 5:00 PM",
//   // Metadata
//   status: "open",
//   deadline_date: new Date().toISOString().split("T")[0],
//   job_description_id: null,
//   company_id: 1, // Defaulting to 1 or your system ID
//   industry_id: null,
//   degree_ids: [],
//   // UI helper for Quills
//   content: "", 
//   responsibilities: "",
//   requirements: "",
// });

//   const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
//   const [loadingJD, setLoadingJD] = useState(null);


//   // 1. Fetch Master Data & Vacancies
//   useEffect(() => {
//     fetchMasters();
//     fetchVacancies();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDeptDrop(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

// //   const fetchMasters = async () => {
// //     try {
// //       const res = await fetch("https://apihrr.goelectronix.co.in/departments");
// //       const data = await res.json();
// //       setDepartments(data || []);
// //     } catch (err) {
// //       toast.error("Registry connection failed");
// //     }
// //   };

// const fetchMasters = async () => {
//   try {
//     const [deptRes, skillRes] = await Promise.all([
//       fetch("https://apihrr.goelectronix.co.in/departments"),
//       fetch("https://apihrr.goelectronix.co.in/masters/skills?skip=0&limit=100")
//     ]);
    
//     const deptData = await deptRes.json();
//     const skillData = await skillRes.json();
    
//     setDepartments(deptData || []);
//     setAllMasterSkills(skillData || []); // This holds all possible skills from DB
//   } catch (err) {
//     toast.error("Registry connection failed");
//   }
// };

//   const fetchVacancies = async () => {
//     setLoadingList(true);
//     try {
//       // Fetching with high limit as per your URL example
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100",
//       );
//       const data = await res.json();
//       setVacancies(data || []);
//     } catch (err) {
//       console.error("Failed to load vacancies");
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//     if (pincode.length !== 6) return;
//     setIsFetchingPincode(true);
//     try {
//       const res = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`,
//       );
//       const data = await res.json();
//       if (data[0]?.Status === "Success") {
//         const offices = data[0].PostOffice;
//         setCityOptions(offices);
//         // Auto-fill with first option
//         setFormData((prev) => ({
//           ...prev,
//           city: offices[0].Name,
//           location: offices[0].Name, // Syncing location with city
//           state: offices[0].State,
//           district: offices[0].District,
//           country: offices[0].Country,
//         }));
//       }
//     } catch (err) {
//       toast.error("Geo-sync failed");
//     } finally {
//       setIsFetchingPincode(false);
//     }
//   };

//   const fetchJDDetails = async (jdId) => {
//     // If we already have the data, don't fetch again
//     if (templateDetails[jdId]) return;

//     setLoadingJD(jdId);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`,
//       );
//       const data = await res.json();
//       setTemplateDetails((prev) => ({
//         ...prev,
//         [jdId]: data,
//       }));
//     } catch (err) {
//       toast.error("Failed to fetch job protocol details");
//     } finally {
//       setLoadingJD(null);
//     }
//   };

//   const generateExpOptions = () => {
//     const options = [];
//     options.push(
//       <option key="0.5" value="0.5">
//         6 Months
//       </option>,
//     );
//     for (let i = 1; i <= 10; i++) {
//       options.push(
//         <option key={i} value={i}>
//           {i} Year{i > 1 ? "s" : ""}
//         </option>,
//       );
//     }
//     return options;
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   const loadingToast = toast.loading("Executing Enterprise Deployment...");

//   try {
//     // Stage 1: Create Job Description
//     const jdBody = {
//       title: formData.title,
//       role: formData.title,
//       content: formData.content,
//       responsibilities: formData.responsibilities,
//       requirements: formData.requirements,
//       location: formData.location[0] || "", // Assuming string for JD
//       salary_range: `${formData.min_salary} - ${formData.max_salary}`,
//     };

//     const jdRes = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(jdBody),
//     });

//     if (!jdRes.ok) throw new Error("JD Protocol Failed");
//     const jdData = await jdRes.json();

//     // Stage 2: Create Complex Vacancy
//     const vacancyBody = {
//       title: formData.title,
//       number_of_openings: parseInt(formData.number_of_openings),
//       location: Array.isArray(formData.location) ? formData.location : [formData.location],
//       state: Array.isArray(formData.state) ? formData.state : [formData.state],
//       district: Array.isArray(formData.district) ? formData.district : [formData.district],
//       city: Array.isArray(formData.city) ? formData.city : [formData.city],
//       pincode: Array.isArray(formData.pincode) ? formData.pincode : [formData.pincode],
//       job_type: formData.job_type,
//       cand_type: formData.cand_type,
//       experience_required: formData.experience_required,
//       min_age: parseInt(formData.min_age),
//       max_age: parseInt(formData.max_age),
//       min_salary: parseFloat(formData.min_salary),
//       max_salary: parseFloat(formData.max_salary),
//       bonus_offered: formData.bonus_offered,
//       bonus_amount: parseFloat(formData.bonus_amount),
//       bonus_type: formData.bonus_type,
//       skills_req: formData.skills_req,
//       spoken_languages: formData.spoken_languages,
//       assets_req: formData.assets_req,
//       certificates_req: formData.certificates_req,
//       office_timings: formData.office_timings,
//       interview_timings: formData.interview_timings,
//       cand_can_call: formData.cand_can_call,
//       call_timings: formData.call_timings,
//       status: formData.status,
//       deadline_date: formData.deadline_date,
//       job_description_id: jdData.id,
//       department_id: Array.isArray(formData.department_id) 
//     ? parseInt(formData.department_id[0] || 0) 
//     : parseInt(formData.department_id || 0),
//       company_id: parseInt(formData.company_id),
//       industry_id: parseInt(formData.industry_id),
//       degree_ids: formData.degree_ids,
//     };

//     const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(vacancyBody),
//     });

//     if (!vacancyRes.ok) {
//         const err = await vacancyRes.json();
//         console.error("Payload Validation Error:", err);
//         throw new Error("Vacancy Schema Validation Failed");
//     }

//     toast.success("Vacancy Protocol Active! 🚀", { id: loadingToast });
//     fetchVacancies();
//     // Reset logic here...

//   } catch (err) {
//     toast.error(err.message, { id: loadingToast });
//   } finally {
//     setLoading(false);
//   }
// };

//   const toggleAccordion = (vacancy) => {
//     const isOpening = openAccordionId !== vacancy.id;
//     setOpenAccordionId(isOpening ? vacancy.id : null);

//     if (isOpening && vacancy.job_description_id) {
//       fetchJDDetails(vacancy.job_description_id);
//     }
//   };

//   // Pagination Calculation
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(vacancies.length / itemsPerPage);

//   const inputClass =
//     "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
//   const labelClass =
//     "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-12">
//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck
//             className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none"
//             size={120}
//           />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
//                 Vacancy
//               </h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Recruitment
//                 System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- EXISTING FORM LOGIC --- */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//         >
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">

//             {/* Job Type Selector */}
// {/* <div className="space-y-3 w-full">
//   <label className={labelClass}>Job Type <span className="text-red-500">*</span></label>
//   <div className="flex bg-slate-100 p-1.5 px-6 gap-6 rounded-[1.25rem] border border-slate-200 w-full">
//     {["Full Time", "Part Time"].map((type) => {
//       const isActive = formData.job_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, job_type: type })}
//           className={`px-8 py-2.5  text-[11px] w-full font-black  uppercase tracking-widest rounded-xl transition-all duration-300 ${
//             isActive
//               ? "!bg-blue-600 "
//               : "!text-slate-500 !bg-transparent hover:!text-slate-700"
//           }`}
//         >
//           {type}
//         </button>
//       );
//     })}
//   </div>
// </div> */}
// <div className="space-y-3 w-full">
//   <label className={labelClass}>
//     Job Type <span className="text-red-500">*</span>
//   </label>
//   <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//     {["Full Time", "Part Time"].map((type) => {
//       const isActive = formData.job_type === type;
//       return (
//         <button
//           key={type}
//           type="button"
//           onClick={() => setFormData({ ...formData, job_type: type })}
//           className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
//             isActive
//               ? "!bg-[#2563eb] text-white shadow-lg scale-[1.02]"
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent"
//           }`}
//         >
//           {type}
//         </button>
//       );
//     })}
//   </div>
// </div>
//               {/* Department Multi-Select */}
//               <div className="relative" ref={dropdownRef}>
//                 <label className={labelClass}>Department</label>
//                 <div
//                   onClick={() => setShowDeptDrop(!showDeptDrop)}
//                   className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
//                 >
//                   {formData.department_id.length > 0 ? (
//                     formData.department_id.map((id) => (
//                       <span
//                         key={id}
//                         className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95"
//                       >
//                         {
//                           departments.find(
//                             (d) => d.id.toString() === id.toString(),
//                           )?.name
//                         }
//                         <X
//                           size={12}
//                           className="hover:text-red-400"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setFormData({
//                               ...formData,
//                               department_id: formData.department_id.filter(
//                                 (item) => item !== id,
//                               ),
//                             });
//                           }}
//                         />
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
//                       Select department...
//                     </span>
//                   )}
//                 </div>
//                 {showDeptDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                     <div className="p-3 border-b border-slate-50">
//                       <input
//                         autoFocus
//                         placeholder="Filter department..."
//                         value={deptSearch}
//                         onChange={(e) => setDeptSearch(e.target.value)}
//                         className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none"
//                       />
//                     </div>
//                     <div className="max-h-48 overflow-y-auto p-2">
//                       {departments
//                         .filter((d) =>
//                           d.name
//                             .toLowerCase()
//                             .includes(deptSearch.toLowerCase()),
//                         )
//                         .map((dept) => (
//                           <button
//                             key={dept.id}
//                             type="button"
//                             onClick={() => {
//                               const isSelected =
//                                 formData.department_id.includes(
//                                   dept.id.toString(),
//                                 );
//                               setFormData({
//                                 ...formData,
//                                 department_id: isSelected
//                                   ? formData.department_id.filter(
//                                       (i) => i !== dept.id.toString(),
//                                     )
//                                   : [
//                                       ...formData.department_id,
//                                       dept.id.toString(),
//                                     ],
//                               });
//                             }}
//                             className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
//                           >
//                             {dept.name}{" "}
//                             {formData.department_id.includes(
//                               dept.id.toString(),
//                             ) && <Check size={14} strokeWidth={3} />}
//                           </button>
//                         ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Job Identity</label>
//                   <input
//                     required
//                     placeholder="Position Title"
//                     className={inputClass}
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Opening</label>
//                   <input
//                     type="number"
//                     className={inputClass}
//                     value={formData.number_of_openings}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         number_of_openings: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//   <label className={labelClass}>Job Location</label>
//   <div className="relative group">
//     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//       <MapPin size={14} strokeWidth={2.5} />
//     </div>
//     <input
//       required
//       placeholder="e.g. Mumbai, Maharashtra"
//       className={`${inputClass} pl-10`}
//       value={formData.location}
//       onChange={(e) =>
//         setFormData({ ...formData, location: e.target.value })
//       }
//     />
//   </div>
// </div>
//               </div>


//               {/* Experience Logic */}
//               <div className="pt-2">
//                 <label className={labelClass}>Experience</label>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
//                   {["Fresher", "Experienced"].map((type) => (
//                     <button
//                       key={type}
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           experience_required:
//                             type === "Fresher" ? "Fresher" : "1 - 3 Years",
//                         })
//                       }
//                       className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${(type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
//                     >
//                       {type.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//                 {formData.experience_required !== "Fresher" && (
//                   <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
//                     <select
//                       className={inputClass}
//                       value={formData.experience_required.split(" - ")[0]}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || "1"} Years`,
//                         })
//                       }
//                     >
//                       {generateExpOptions()}
//                     </select>
//                     <select
//                       className={inputClass}
//                       value={formData.experience_required
//                         .split(" - ")[1]
//                         ?.replace(" Years", "")}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`,
//                         })
//                       }
//                     >
//                       {generateExpOptions()}
//                     </select>
//                   </div>
//                 )}
//               </div>

//               {/* SALARY RANGE & GENDER GRID */}
//               {/* <div className="grid grid-cols-1 gap-4 pt-2">
//                 <div className="space-y-2 pt-2">
//                   <label className={labelClass}>Budget </label>
//                   <div className="grid grid-cols-2 gap-4 items-center">
                 
//                     <div className="relative group">
//                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                         <IndianRupee size={12} strokeWidth={3} />
//                       </div>
//                       <input
//                         type="number"
//                         step="0.1"
//                         placeholder="Min"
//                         className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//                         value={formData.salary_range.split(" - ")[0] || ""}
//                         onChange={(e) => {
//                           const min = e.target.value;
//                           const max =
//                             formData.salary_range.split(" - ")[1] || "";
//                           setFormData({
//                             ...formData,
//                             salary_range: `${min} - ${max}`,
//                           });
//                         }}
//                       />
//                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                         <span className="text-[8px] font-black text-slate-300 uppercase">
//                           Min
//                         </span>
//                       </div>
//                     </div>

                  
//                     <div className="relative group">
//                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//                         <IndianRupee size={12} strokeWidth={3} />
//                       </div>
//                       <input
//                         type="number"
//                         step="0.1"
//                         placeholder="Max"
//                         className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//                         value={formData.salary_range.split(" - ")[1] || ""}
//                         onChange={(e) => {
//                           const min =
//                             formData.salary_range.split(" - ")[0] || "";
//                           const max = e.target.value;
//                           setFormData({
//                             ...formData,
//                             salary_range: `${min} - ${max}`,
//                           });
//                         }}
//                       />
//                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                         <span className="text-[8px] font-black text-slate-300 uppercase">
//                           Max
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//                     Range in Lakhs Per Annum
//                   </p>
//                 </div>
//               </div> */}


//               {/* SALARY RANGE GRID */}
// <div className="grid grid-cols-1 gap-4 pt-2">
//   <div className="space-y-2 pt-2">
//     <label className={labelClass}>Budget (LPA)</label>
//     <div className="grid grid-cols-2 gap-4 items-center">
      
//       {/* MIN SALARY NODE */}
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//           <IndianRupee size={12} strokeWidth={3} />
//         </div>
//         <input
//           type="number"
//           step="0.1"
//           placeholder="Min"
//           className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           value={formData.min_salary}
//           onChange={(e) => 
//             setFormData({ ...formData, min_salary: e.target.value })
//           }
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
//             Min
//           </span>
//         </div>
//       </div>

//       {/* MAX SALARY NODE */}
//       <div className="relative group">
//         <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//           <IndianRupee size={12} strokeWidth={3} />
//         </div>
//         <input
//           type="number"
//           step="0.1"
//           placeholder="Max"
//           className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           value={formData.max_salary}
//           onChange={(e) => 
//             setFormData({ ...formData, max_salary: e.target.value })
//           }
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
//             Max
//           </span>
//         </div>
//       </div>

//     </div>
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//       Annual CTC Range in Lakhs
//     </p>
//   </div>
// </div>

// <div>
//     {/* BONUS PROTOCOL SECTION */}
// <div className="space-y-4 pt-4 border-t border-slate-100">
//   <div className="flex items-center justify-between">
//     <label className={labelClass}>
//       Bonus offered in addition to salary? <span className="text-red-500">*</span>
//     </label>
    
//     {/* WorkIndia Style Toggle */}
//     <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//       {[
//         { label: "YES", value: true },
//         { label: "NO", value: false }
//       ].map((opt) => (
//         <button
//           key={opt.label}
//           type="button"
//           onClick={() => setFormData({ ...formData, bonus_offered: opt.value })}
//           className={`px-6 py-1.5 text-[10px] font-black rounded-lg transition-all ${
//             formData.bonus_offered === opt.value
//               ? "bg-blue-600 text-white shadow-md"
//               : "text-slate-500 hover:text-slate-700"
//           }`}
//         >
//           {opt.label}
//         </button>
//       ))}
//     </div>
//   </div>



//   {/* Conditional Bonus Details */}
//   {formData.bonus_offered && (
//     <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-top-2 duration-300">
//       <div className="space-y-2">
//         <label className={labelClass}>Max Bonus Amount</label>
//         <div className="relative group">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
//             <IndianRupee size={12} strokeWidth={3} />
//           </div>
//           <input
//             type="number"
//             placeholder="e.g. 50000"
//             className={`${inputClass} pl-9`}
//             value={formData.bonus_amount || ""}
//             onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <label className={labelClass}>Bonus Type</label>
//         <div className="relative group">
//           <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">
//             <Award size={14} strokeWidth={2.5} />
//           </div>
//           <input
//             type="text"
//             placeholder="e.g. Performance, Sign-on"
//             className={`${inputClass} pl-9`}
//             value={formData.bonus_type}
//             onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   )}
// </div>

//   {/* CANDIDATE CALL PROTOCOL */}
// <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="space-y-3">
//     <label className={labelClass}>
//       Candidates can call me <span className="text-red-500">*</span>
//     </label>
    
//     {/* WorkIndia Style Multi-Toggle */}
//     <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 w-full overflow-hidden">
//       {["Everyday", "Monday to Friday", "Monday to Saturday"].map((option) => {
//         const isActive = formData.cand_can_call === option;
//         return (
//           <button
//             key={option}
//             type="button"
//             onClick={() => setFormData({ ...formData, cand_can_call: option })}
//             className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-300 ${
//               isActive
//                 ? "bg-[#2563eb] text-white shadow-lg scale-[1.02]"
//                 : "text-slate-500 hover:text-slate-700 bg-transparent"
//             }`}
//           >
//             {option}
//           </button>
//         );
//       })}
//     </div>
//   </div>

//   {/* Call Timings Input */}
//   <div className="space-y-2 max-w-md">
//     <label className={labelClass}>Call Timings</label>
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <Clock size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="e.g. 10 AM to 6 PM"
//         className={`${inputClass} pl-11`}
//         value={formData.call_timings}
//         onChange={(e) => setFormData({ ...formData, call_timings: e.target.value })}
//       />
//     </div>
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//       Specify your availability for candidate inquiries
//     </p>
//   </div>
// </div>

// {/* SKILLS TAG INPUT SECTION */}
// {/* <div className="space-y-3 pt-6 border-t border-slate-100">
//   <div className="flex items-center justify-between ml-1">
//     <label className={labelClass}>
//       Skills Required <span className="text-red-500">*</span>
//     </label>
//     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
//       Press Enter to Add Tag
//     </span>
//   </div>

//   <div className="min-h-[100px] w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus-within:bg-white focus-within:border-blue-600 transition-all shadow-inner">
  
//     <div className="flex flex-wrap gap-2 mb-3">
//       {formData.skills_req.map((skill, index) => (
//         <span 
//           key={index}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95"
//         >
//           {skill}
//           <X 
//             size={12} 
//             className="cursor-pointer hover:text-red-300 transition-colors" 
//             onClick={() => {
//               setFormData({
//                 ...formData,
//                 skills_req: formData.skills_req.filter((_, i) => i !== index)
//               });
//             }}
//           />
//         </span>
//       ))}
//     </div>

  
//     <div className="relative group">
//       <div className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//         <Search size={14} />
//       </div>
//       <input
//         type="text"
//         placeholder="Type a skill (e.g. Python, React) and press Enter..."
//         className="w-full pl-7 py-1 bg-transparent text-xs font-bold outline-none placeholder:text-slate-400"
//         value={skillInput}
//         onChange={(e) => setSkillInput(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' && skillInput.trim()) {
//             e.preventDefault();
//             if (!formData.skills_req.includes(skillInput.trim())) {
//               setFormData({
//                 ...formData,
//                 skills_req: [...formData.skills_req, skillInput.trim()]
//               });
//             }
//             setSkillInput("");
//           }
//         }}
//       />
//     </div>
//   </div>
  
//   <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
//     <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-blue-100">
//       <Info size={14} strokeWidth={2.5} />
//     </div>
//     <p className="text-[10px] text-blue-700 font-bold leading-tight">
//       Only candidates with the marked skills can apply to this node.
//     </p>
//   </div>
// </div> */}



// {/* SKILLS TAG REGISTRY SECTION - FULL VISIBILITY MODE */}
// {/* SKILLS TAG REGISTRY - DATABASE LINKED */}
// <div className="space-y-4 pt-6 border-t border-slate-100">
//   <div className="flex items-center justify-between ml-1">
//     <label className={labelClass}>
//       Skills Registry <span className="text-red-500">*</span>
//     </label>
//     <span className="text-[9px] font-black !text-[#2563eb] uppercase tracking-widest !bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
//       {formData.skills_req.length} Selected for Deployment
//     </span>
//   </div>

//   <div className="grid grid-cols-1 gap-4">
//     {/* 1. SEARCH INPUT */}
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 !text-slate-400 group-focus-within:!text-[#2563eb] transition-colors">
//         <Search size={16} strokeWidth={2.5} />
//       </div>
//       <input
//         type="text"
//         placeholder="Filter available skills from database..."
//         className={`${inputClass} pl-12 py-3.5`}
//         value={skillSearch}
//         onChange={(e) => setSkillSearch(e.target.value)}
//       />
//     </div>

//     {/* 2. MASTER SELECTION POOL (Scrollable Area) */}
//     <div className="!bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
//         Available Database Skills (Click to Toggle)
//       </p>
      
//       <div className="max-h-[250px] overflow-y-auto flex flex-wrap gap-2 custom-scrollbar">
//         {allMasterSkills
//           .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
//           .map((skill) => {
//             const isSelected = formData.skills_req.includes(skill.name);
//             return (
//               <button
//                 key={skill.id}
//                 type="button"
//                 onClick={() => {
//                   const updatedSkills = isSelected
//                     ? formData.skills_req.filter(s => s !== skill.name)
//                     : [...formData.skills_req, skill.name];
//                   setFormData({ ...formData, skills_req: updatedSkills });
//                 }}
//                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
//                   isSelected
//                     ? "!bg-[#2563eb] !border-[#2563eb] !text-white shadow-lg !shadow-blue-200"
//                     : "!bg-white !border-slate-200 !text-slate-500 hover:!border-[#2563eb] hover:!text-[#2563eb]"
//                 }`}
//               >
//                 {skill.name}
//                 {isSelected ? <Check size={12} strokeWidth={4} /> : <Plus size={12} />}
//               </button>
//             );
//           })}
        
//         {allMasterSkills.length === 0 && (
//           <div className="w-full py-10 flex flex-col items-center gap-2 text-slate-400">
//             <Loader2 className="animate-spin" size={20} />
//             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Syncing Master Skills...</span>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>

//   {/* 3. COMPLIANCE INFO BOX */}
  
// </div>


// {/* PERSONAL & ADDITIONAL INFO HUB */}
// <div className="space-y-6 pt-6 border-t border-slate-100">
//   <div className="flex items-center gap-3">
//     <div className="p-2 bg-blue-50 text-[#2563eb] rounded-xl border border-blue-100">
//       <UserPlus size={18} strokeWidth={2.5} />
//     </div>
//     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//       Personal Details, Education, & Additional Info
//     </h3>
//   </div>

//   {/* TOGGLE SELECTORS - Matches Image 5 */}
//   <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-[2rem]">
//     {[
//       { id: 'age', label: 'Age', icon: <Calendar size={14} /> },
//       { id: 'languages', label: 'Preferred Language', icon: <Plus size={14} /> },
//       { id: 'assets', label: 'Assets', icon: <Plus size={14} /> },
//       { id: 'degree', label: 'Degree and Specialisation', icon: <Plus size={14} /> },
//       { id: 'certification', label: 'Certification', icon: <Plus size={14} /> },
//       { id: 'industry', label: 'Preferred Industry', icon: <Plus size={14} /> }
//     ].map((item) => {
//       const isAdded = activeDetails.includes(item.id);
//       return (
//         <button
//           key={item.id}
//           type="button"
//           onClick={() => {
//             setActiveDetails(prev => 
//               prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
//             );
//           }}
//           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all duration-300 ${
//             isAdded 
//               ? "bg-white border-[#2563eb] text-[#2563eb] shadow-sm ring-2 ring-blue-50" 
//               : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
//           }`}
//         >
//           {item.label} {isAdded ? <Check size={14} strokeWidth={3} className="text-[#2563eb]" /> : item.icon}
//         </button>
//       );
//     })}
//   </div>

//   {/* DYNAMIC FORM FIELDS - Conditioned on Toggles */}
//   <div className="space-y-6">
//     {/* AGE SECTION - Matches Image 5 Bottom */}
//     {activeDetails.includes('age') && (
//       <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm animate-in slide-in-from-top-2 duration-300 relative group">
//         <button 
//           className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"
//           onClick={() => setActiveDetails(prev => prev.filter(i => i !== 'age'))}
//         >
//           <X size={18} strokeWidth={3} />
//         </button>
        
//         <label className={labelClass}>Candidate Age Registry</label>
//         <div className="grid grid-cols-2 gap-8 mt-4">
//           <div className="space-y-2">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Age</span>
//             <input 
//               type="number" 
//               placeholder="Eg: 18" 
//               className={inputClass}
//               value={formData.min_age}
//               onChange={(e) => setFormData({...formData, min_age: e.target.value})}
//             />
//           </div>
//           <div className="space-y-2">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Age</span>
//             <input 
//               type="number" 
//               placeholder="Eg: 40" 
//               className={inputClass}
//               value={formData.max_age}
//               onChange={(e) => setFormData({...formData, max_age: e.target.value})}
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Placeholder for other sections (Languages, Assets, etc.) */}
//     {activeDetails.includes('languages') && (
//         <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem] text-center">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Language Preference Protocol Active</p>
//         </div>
//     )}
//   </div>
// </div>

// </div>

        

             

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     <ShieldCheck size={20} /> Save Vacancy
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     job Vacancy Template
//                   </h3>
//                 </div>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.content}
//                       onChange={(v) => setFormData({ ...formData, content: v })}
//                       modules={quillModules}
//                       placeholder="Describe the role summary..."
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.responsibilities}
//                       onChange={(v) =>
//                         setFormData({ ...formData, responsibilities: v })
//                       }
//                       modules={quillModules}
//                       placeholder="List tactical duties..."
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill
//                       theme="snow"
//                       value={formData.requirements}
//                       onChange={(v) =>
//                         setFormData({ ...formData, requirements: v })
//                       }
//                       modules={quillModules}
//                       placeholder="Skills and certifications..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <hr className="border-slate-200" />

//         {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
//                 <Layers size={18} />
//               </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                 Active Vacancies{" "}
//               </h3>
//             </div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//               {vacancies.length} Total Records Found
//             </div>
//           </div>

//           <div className="space-y-4">
//             {loadingList ? (
//               <div className="py-20 flex flex-col items-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                   Fetching Vacancies...
//                 </p>
//               </div>
//             ) : (
//               currentVacancies.map((vacancy) => (
//                 <div
//                   key={vacancy.id}
//                   className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md"
//                 >
//                   {/* Accordion Header */}
//                   <div
//                     // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
//                     onClick={() => toggleAccordion(vacancy)}
//                     className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
//                   >
//                     <div className="flex items-center gap-5 w-full md:w-auto">
//                       <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                         <Briefcase size={24} />
//                       </div>
//                       <div>
//                         <h4 className="text-[15px] font-black text-slate-900 tracking-tight">
//                           {vacancy.title}
//                         </h4>
//                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
//                             <MapPin size={12} className="text-blue-500" />{" "}
//                             {vacancy.location}
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                             <Briefcase className="text-blue-500" size={12} />{" "}
//                             Experience :{" "}
//                             {vacancy.experience_required || "Not Specified"}{" "}
//                             Years
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                             <Users size={12} className="text-blue-500" />{" "}
//                             {vacancy.number_of_openings} Slots
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* --- ACTION & ACCORDION CONTROL --- */}
//                     <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
//                       {/* FINANCIAL METRIC NODE */}
//                       <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
//                         <div className="flex items-center justify-end gap-1.5">
//                           <IndianRupee
//                             size={10}
//                             className="text-slate-900 stroke-[3]"
//                           />
//                           <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
//                             {/* Logic to handle both string ranges and numeric formatting */}
//                             {isNaN(vacancy.salary_range)
//                               ? vacancy.salary_range
//                               : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`}
//                           </p>
//                         </div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
//                           Annual CTC
//                         </p>
//                       </div>
//                       {/* NEW: EDIT REGISTRY BUTTON */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // Stop accordion from opening
//                           navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
//                         }}
//                         className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
//                         title="Edit Vacancy Node"
//                       >
//                         <Edit3 size={18} strokeWidth={2.5} />
//                       </button>

//                       <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//                       {/* INTERACTIVE TOGGLE NODE */}
//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleAccordion(vacancy);
//                         }}
//                         className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
//       ${
//         openAccordionId === vacancy.id
//           ? "bg-slate-900 border-slate-900 text-white shadow-slate-200"
//           : "bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
//       }`}
//                       >
//                         {openAccordionId === vacancy.id ? (
//                           <X
//                             size={18}
//                             className="animate-in fade-in zoom-in duration-300 stroke-[2.5]"
//                           />
//                         ) : (
//                           <Plus
//                             size={18}
//                             className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]"
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Accordion Body */}
//                   {openAccordionId === vacancy.id && (
//                     <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
//                       {loadingJD === vacancy.job_description_id ? (
//                         <div className="py-10 flex flex-col items-center justify-center gap-3">
//                           <Loader2
//                             className="animate-spin text-blue-600"
//                             size={24}
//                           />
//                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                             Retrieving Protocol...
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-8">
//                           {/* TOP INFO BAR */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
//                             <div>
//                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                 Job Role
//                               </p>
//                               <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//                                 {templateDetails[vacancy.job_description_id]
//                                   ?.title || vacancy.title}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                                 Job Number
//                               </p>
//                               <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
//                                 GOEX-V-{vacancy.id}-REF-
//                                 {vacancy.job_description_id}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="space-y-4">
//                             <div className="flex items-center gap-2">
//                               <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//                               <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//                                 Job Description
//                               </h5>
//                             </div>

//                             <div className="prose prose-slate max-w-full overflow-hidden">
//                               <div
//                                 className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
//                                 dangerouslySetInnerHTML={{
//                                   __html:
//                                     templateDetails[vacancy.job_description_id]
//                                       ?.content ||
//                                     "No protocol content available for this node.",
//                                 }}
//                               />
//                             </div>
//                           </div>

//                           {/* ACTION STRIP */}
//                           <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
//                             <button
//                               onClick={() =>
//                                 navigate(`/vacancy-details/${vacancy.id}`)
//                               }
//                               className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95"
//                             >
//                               Read full job description <ArrowRight size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>

//           {/* PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-4 pt-6">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-slate-400 border-slate-200 hover:border-blue-500"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `,
//         }}
//       />
//     </div>
//   );
// };

// export default VacanciesDummyPage;
//**************************************************************************************************************** */
// import React, { useState, useEffect ,useRef  } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate } from "react-router-dom";
// import "react-quill-new/dist/quill.snow.css";
// import {
//   Briefcase,
//   MapPin,
//   Users,
//   Calendar,
//   IndianRupee,
//   Layers,
//   ArrowRight,
//   FileText,
//   PlusCircle,
//   X,
//   Info,
//   Edit3,
//   Search,
//   Check,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   ChevronDown,
//   Plus,
//   Clock,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesDummyPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   // --- NEW STATE FOR LISTING & PAGINATION ---
//   const [vacancies, setVacancies] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [openAccordionId, setOpenAccordionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
// const [deptSearch, setDeptSearch] = useState("");
// const [showDeptDrop, setShowDeptDrop] = useState(false);
// const dropdownRef = useRef(null);
// const [cityOptions, setCityOptions] = useState([]);
// const [isFetchingPincode, setIsFetchingPincode] = useState(false);

//   const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
// const [loadingJD, setLoadingJD] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: new Date().toISOString().split("T")[0],
//     content: "",
//     responsibilities: "",
//     requirements: ""
//   });

//   // 1. Fetch Master Data & Vacancies
//   useEffect(() => {
//     fetchMasters();
//     fetchVacancies();
//   }, []);

//   useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setShowDeptDrop(false);
//     }
//   };
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);

//   const fetchMasters = async () => {
//     try {
//       const res = await fetch("https://apihrr.goelectronix.co.in/departments");
//       const data = await res.json();
//       setDepartments(data || []);
//     } catch (err) {
//       toast.error("Registry connection failed");
//     }
//   };

//   const fetchVacancies = async () => {
//     setLoadingList(true);
//     try {
//       // Fetching with high limit as per your URL example
//       const res = await fetch("https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100");
//       const data = await res.json();
//       setVacancies(data || []);
//     } catch (err) {
//       console.error("Failed to load vacancies");
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//   if (pincode.length !== 6) return;
//   setIsFetchingPincode(true);
//   try {
//     const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//     const data = await res.json();
//     if (data[0]?.Status === "Success") {
//       const offices = data[0].PostOffice;
//       setCityOptions(offices);
//       // Auto-fill with first option
//       setFormData(prev => ({
//         ...prev,
//         city: offices[0].Name,
//         location: offices[0].Name, // Syncing location with city
//         state: offices[0].State,
//         district: offices[0].District,
//         country: offices[0].Country
//       }));
//     }
//   } catch (err) { toast.error("Geo-sync failed"); }
//   finally { setIsFetchingPincode(false); }
// };

//   const fetchJDDetails = async (jdId) => {
//   // If we already have the data, don't fetch again
//   if (templateDetails[jdId]) return;

//   setLoadingJD(jdId);
//   try {
//     const res = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`);
//     const data = await res.json();
//     setTemplateDetails(prev => ({
//       ...prev,
//       [jdId]: data
//     }));
//   } catch (err) {
//     toast.error("Failed to fetch job protocol details");
//   } finally {
//     setLoadingJD(null);
//   }
// };

// const generateExpOptions = () => {
//   const options = [];
//   options.push(<option key="0.5" value="0.5">6 Months</option>);
//   for (let i = 1; i <= 10; i++) {
//     options.push(<option key={i} value={i}>{i} Year{i > 1 ? 's' : ''}</option>);
//   }
//   return options;
// };

//   // 2. Sequential Logic: Create JD -> Get ID -> Create Vacancy
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Executing Multi-Stage Deployment...");

//     try {
//       const jdBody = {
//         title: formData.title,
//         role: formData.title,
//         content: formData.content,
//         responsibilities: formData.responsibilities,
//         requirements: formData.requirements,
//         location: formData.location,
//         salary_range: formData.salary_range
//       };

//       const jdResponse = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       if (!jdResponse.ok) throw new Error("JD Protocol Creation Failed");

//       const jdData = await jdResponse.json();
//       const newJdId = jdData.id;

//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: newJdId,
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody),
//       });

//       if (!vacancyRes.ok) throw new Error("Vacancy Deployment Failed");

//       toast.success("Vacancy Node Active & Linked! 🚀", { id: loadingToast });

//       // Refresh list and clear form
//       fetchVacancies();
//       setFormData({
//         title: "", department_id: "", number_of_openings: 1, location: "",
//         experience_required: "", salary_range: "", status: "open",
//         deadline_date: new Date().toISOString().split("T")[0],
//         content: "", responsibilities: "", requirements: ""
//       });

//     } catch (err) {
//       toast.error(err.message || "Transmission failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAccordion = (vacancy) => {
//   const isOpening = openAccordionId !== vacancy.id;
//   setOpenAccordionId(isOpening ? vacancy.id : null);

//   if (isOpening && vacancy.job_description_id) {
//     fetchJDDetails(vacancy.job_description_id);
//   }
// };

//   // Pagination Calculation
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(vacancies.length / itemsPerPage);

//   const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
//   const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-12">

//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={120} />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Vacancy</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Recruitment System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- EXISTING FORM LOGIC --- */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">

//               {/* Department Multi-Select */}
//               <div className="relative" ref={dropdownRef}>
//                 <label className={labelClass}>Department</label>
//                 <div
//                   onClick={() => setShowDeptDrop(!showDeptDrop)}
//                   className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
//                 >
//                   {formData.department_id.length > 0 ? (
//                     formData.department_id.map(id => (
//                       <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95">
//                         {departments.find(d => d.id.toString() === id.toString())?.name}
//                         <X size={12} className="hover:text-red-400" onClick={(e) => {
//                           e.stopPropagation();
//                           setFormData({...formData, department_id: formData.department_id.filter(item => item !== id)});
//                         }} />
//                       </span>
//                     ))
//                   ) : <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select department...</span>}
//                 </div>
//                 {showDeptDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                     <div className="p-3 border-b border-slate-50"><input autoFocus placeholder="Filter department..." value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none" /></div>
//                     <div className="max-h-48 overflow-y-auto p-2">
//                       {departments.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase())).map(dept => (
//                         <button key={dept.id} type="button" onClick={() => {
//                           const isSelected = formData.department_id.includes(dept.id.toString());
//                           setFormData({...formData, department_id: isSelected ? formData.department_id.filter(i => i !== dept.id.toString()) : [...formData.department_id, dept.id.toString()]});
//                         }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
//                           {dept.name} {formData.department_id.includes(dept.id.toString()) && <Check size={14} strokeWidth={3} />}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                  <div>
//                 <label className={labelClass}>Job Identity</label>
//                 <input required placeholder="Position Title" className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//               </div>
//                 <div>
//                   <label className={labelClass}>Opening</label>
//                   <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                 </div>

//               </div>

//               {/* GEOLOCATION ENGINE */}
//     <div className="space-y-4 pt-2 border-t border-slate-50">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className={labelClass}>Pincode</label>
//           <div className="relative">
//             <input maxLength={6} placeholder="000000" className={inputClass} value={formData.pincode}
//               onChange={(e) => {
//                 const val = e.target.value.replace(/\D/g, "");
//                 setFormData({...formData, pincode: val});
//                 if(val.length === 6) fetchPincodeDetails(val);
//               }}
//             />
//             {isFetchingPincode && <Loader2 className="absolute right-3 top-2.5 animate-spin text-blue-500" size={16} />}
//           </div>
//         </div>
//         <div>
//           <label className={labelClass}>City</label>
//           {cityOptions.length > 1 ? (
//             <select className={`${inputClass} border-blue-200 bg-blue-50/30`} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value, location: e.target.value})}>
//               {cityOptions.map((o, i) => <option key={i} value={o.Name}>{o.Name}</option>)}
//             </select>
//           ) : (
//             <input readOnly placeholder="Auto-fetched" className={`${inputClass} opacity-60`} value={formData.city} />
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <input readOnly placeholder="District" className={`${inputClass} opacity-60`} value={formData.district} />
//         <input readOnly placeholder="State" className={`${inputClass} opacity-60`} value={formData.state} />
//       </div>
//     </div>

//               {/* Experience Logic */}
//               <div className="pt-2">
//                 <label className={labelClass}>Experience</label>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
//                   {["Fresher", "Experienced"].map(type => (
//                     <button key={type} type="button" onClick={() => setFormData({...formData, experience_required: type === "Fresher" ? "Fresher" : "1 - 3 Years"})} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${ (type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500" }`}>
//                       {type.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//                 {formData.experience_required !== "Fresher" && (
//                   <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
//                     <select className={inputClass} value={formData.experience_required.split(" - ")[0]} onChange={(e) => setFormData({...formData, experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || '1'} Years`})}>
//                       {generateExpOptions()}
//                     </select>
//                     <select className={inputClass} value={formData.experience_required.split(" - ")[1]?.replace(" Years", "")} onChange={(e) => setFormData({...formData, experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`})}>
//                       {generateExpOptions()}
//                     </select>
//                   </div>
//                 )}
//               </div>

//               {/* SALARY RANGE & GENDER GRID */}
//     <div className="grid grid-cols-1 gap-4 pt-2">

//       <div className="space-y-2 pt-2">
//   <label className={labelClass}>Budget </label>
//   <div className="grid grid-cols-2 gap-4 items-center">

//     {/* MIN SALARY NODE */}
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <IndianRupee size={12} strokeWidth={3} />
//       </div>
//       <input
//         type="number"
//         step="0.1"
//         placeholder="Min"
//         className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//         value={formData.salary_range.split(" - ")[0] || ""}
//         onChange={(e) => {
//           const min = e.target.value;
//           const max = formData.salary_range.split(" - ")[1] || "";
//           setFormData({ ...formData, salary_range: `${min} - ${max}` });
//         }}
//       />
//       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//         <span className="text-[8px] font-black text-slate-300 uppercase">Min</span>
//       </div>
//     </div>

//     {/* MAX SALARY NODE */}
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <IndianRupee size={12} strokeWidth={3} />
//       </div>
//       <input
//         type="number"
//         step="0.1"
//         placeholder="Max"
//         className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//         value={formData.salary_range.split(" - ")[1] || ""}
//         onChange={(e) => {
//           const min = formData.salary_range.split(" - ")[0] || "";
//           const max = e.target.value;
//           setFormData({ ...formData, salary_range: `${min} - ${max}` });
//         }}
//       />
//       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//         <span className="text-[8px] font-black text-slate-300 uppercase">Max</span>
//       </div>
//     </div>

//   </div>
//   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//     Range in Lakhs Per Annum
//   </p>
// </div>

//     </div>

//     <div className="space-y-6 pt-6 border-t border-slate-100">

//       {/* Contact Node Identity */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div>
//           <label className={labelClass}>Company Name</label>
//           <input required placeholder="Legal Entity Name" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
//         </div>
//         <div>
//           <label className={labelClass}>Contact Person Name</label>
//           <input required placeholder="Primary HR / Owner" className={inputClass} value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} />
//         </div>
//       </div>

//       {/* Communication Hub */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div>
//           <label className={labelClass}>Phone Number</label>
//           <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-600 transition-all">
//             <span className="px-3 py-2.5 bg-slate-100 text-[10px] font-black text-slate-400 border-r border-slate-200">+91</span>
//             <input maxLength={10} placeholder="9004949483" className="w-full px-3 bg-transparent text-[13px] font-bold outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
//           </div>
//         </div>
//         <div>
//           <label className={labelClass}>Email Address</label>
//           <input type="email" placeholder="hr@domain.co.in" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
//         </div>
//       </div>

//       {/* Profile & Scale Nodes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div className="relative group">
//           <label className={labelClass}>Contact Person Profile</label>
//           <select className={`${inputClass} appearance-none pr-10`} value={formData.contact_profile} onChange={(e) => setFormData({...formData, contact_profile: e.target.value})}>
//             <option value="owner">Owner / Partner</option>
//             <option value="hr">HR Manager</option>
//             <option value="consultant">Third-party Consultant</option>
//           </select>
//           <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
//         </div>
//         <div className="relative group">
//           <label className={labelClass}>Organization Size</label>
//           <select className={`${inputClass} appearance-none pr-10`} value={formData.org_size} onChange={(e) => setFormData({...formData, org_size: e.target.value})}>
//             <option value="1-10">1 - 10 Employees</option>
//             <option value="11-50">11 - 50 Employees</option>
//             <option value="51-200">51 - 200 Employees</option>
//             <option value="200+">200+ Employees</option>
//           </select>
//           <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
//         </div>
//       </div>

//       {/* Urgency & Frequency Strategy */}
//       <div className="space-y-6 pt-2">
//         <div>
//           <label className={labelClass}>How soon do you want to fill the position?</label>
//           <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full">
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, urgency: "immediate" })}
//               className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${formData.urgency === "immediate" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//             >
//               IMMEDIATELY (1-2 WEEKS)
//             </button>
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, urgency: "wait" })}
//               className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${formData.urgency === "wait" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//             >
//               CAN WAIT
//             </button>
//           </div>
//         </div>

//         <div className="relative group">
//           <label className={labelClass}>How often do you need to hire?</label>
//           <select className={`${inputClass} appearance-none pr-10`} value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
//             <option value="monthly">Every Month</option>
//             <option value="quarterly">Every Quarter</option>
//             <option value="occasionally">Occasionally</option>
//           </select>
//           <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
//         </div>
//         <div>
//           <label className={labelClass}>Job Address</label>
//           <input required placeholder="Job Address" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
//         </div>
//       </div>
//     </div>

//               <div className="grid grid-cols-2 gap-5">

//                  <div>
//         <label className={labelClass}>Gender</label>
//         <select className={inputClass} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
//           <option value="any">Any</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//       </div>
//                 <div>
//                   <label className={labelClass}>Closing Date</label>
//                   <input type="date" min={new Date().toISOString().split("T")[0]} className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>

//               <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
//                 {loading ? <Loader2 className="animate-spin" size={20}/> : <><ShieldCheck size={20} /> Save Vacancy</>}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">job Vacancy Template</h3>
//                 </div>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} placeholder="Describe the role summary..." />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} placeholder="List tactical duties..." />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} placeholder="Skills and certifications..." />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <hr className="border-slate-200" />

//         {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
//                 <Layers size={18} />
//               </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Active Vacancies </h3>
//             </div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//               {vacancies.length} Total Records Found
//             </div>
//           </div>

//           <div className="space-y-4">
//             {loadingList ? (
//               <div className="py-20 flex flex-col items-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fetching Vacancies...</p>
//               </div>
//             ) : currentVacancies.map((vacancy) => (
//               <div key={vacancy.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md">
//                 {/* Accordion Header */}
//                 <div
//                   // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
//                   onClick={() => toggleAccordion(vacancy)}
//                   className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
//                 >
//                   <div className="flex items-center gap-5 w-full md:w-auto">
//                     <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                       <Briefcase size={24} />
//                     </div>
//                     <div>
//                       <h4 className="text-[15px] font-black text-slate-900 tracking-tight">{vacancy.title}</h4>
//                       <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
//                           <MapPin size={12} className="text-blue-500" /> {vacancy.location}
//                         </span>
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                           <Briefcase  className="text-blue-500" size={12} /> Experience : {vacancy.experience_required || "Not Specified"} Years
//                         </span>
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                           <Users size={12} className="text-blue-500" /> {vacancy.number_of_openings} Slots
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* --- ACTION & ACCORDION CONTROL --- */}
// <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
//   {/* FINANCIAL METRIC NODE */}
//   <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
//     <div className="flex items-center justify-end gap-1.5">
//       <IndianRupee size={10} className="text-slate-900 stroke-[3]" />
//       <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
//         {/* Logic to handle both string ranges and numeric formatting */}
//         {isNaN(vacancy.salary_range)
//           ? vacancy.salary_range
//           : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`
//         }
//       </p>
//     </div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
//       Annual CTC
//     </p>
//   </div>
//   {/* NEW: EDIT REGISTRY BUTTON */}
//   <button
//     onClick={(e) => {
//       e.stopPropagation(); // Stop accordion from opening
//       navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
//     }}
//     className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
//     title="Edit Vacancy Node"
//   >
//     <Edit3 size={18} strokeWidth={2.5} />
//   </button>

//   <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//   {/* INTERACTIVE TOGGLE NODE */}
//   <div
//   onClick={(e) => {
//     e.stopPropagation();
//     toggleAccordion(vacancy);
//   }}
//     className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
//       ${openAccordionId === vacancy.id
//         ? 'bg-slate-900 border-slate-900 text-white shadow-slate-200'
//         : 'bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
//       }`}
//   >
//     {openAccordionId === vacancy.id ? (
//       <X size={18} className="animate-in fade-in zoom-in duration-300 stroke-[2.5]" />
//     ) : (
//       <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]" />
//     )}
//   </div>
// </div>
//                 </div>

//                 {/* Accordion Body */}
// {openAccordionId === vacancy.id && (
//   <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
//     {loadingJD === vacancy.job_description_id ? (
//       <div className="py-10 flex flex-col items-center justify-center gap-3">
//         <Loader2 className="animate-spin text-blue-600" size={24} />
//         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retrieving Protocol...</p>
//       </div>
//     ) : (
//       <div className="space-y-8">
//         {/* TOP INFO BAR */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
//            <div>
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Role</p>
//              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//                {templateDetails[vacancy.job_description_id]?.title || vacancy.title}
//              </p>
//            </div>
//            <div>
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Number</p>
//              <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
//                GOEX-V-{vacancy.id}-REF-{vacancy.job_description_id}
//              </p>
//            </div>
//         </div>

//         <div className="space-y-4">
//   <div className="flex items-center gap-2">
//     <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//       Job Description
//     </h5>
//   </div>

//   <div className="prose prose-slate max-w-full overflow-hidden">
//     <div

//       className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
//       dangerouslySetInnerHTML={{
//         __html: templateDetails[vacancy.job_description_id]?.content || "No protocol content available for this node."
//       }}
//     />
//   </div>
// </div>

//         {/* ACTION STRIP */}
//         <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">

//           <button
//           onClick={() => navigate(`/vacancy-details/${vacancy.id}`)}
//           className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95">
//             Read full job description <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
// )}
//               </div>
//             ))}
//           </div>

//           {/* PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-4 pt-6">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500'}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `}} />
//     </div>
//   );
// };

// export default VacanciesDummyPage;
