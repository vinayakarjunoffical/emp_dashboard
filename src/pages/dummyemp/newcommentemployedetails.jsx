//***************************************************working code phase 1 13/03/26******************************************************* */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { employeeKycService } from "../../services/employeeKyc.service"; // Imported for the /full endpoint
// import {
//   ArrowLeft,
//   ChevronDown,
//   Edit3,
//   MessageCircle,
//   X,
//   PlusCircle,
//   History,
//   User,
//   Globe ,
//   Trash2,
//   Clock,
//   CreditCard,
//   Plus,
//   TrendingUp,
//   Building2,
//   FileCheck,
//   Calendar,
//   UserCheck,
//   Upload,
//   Download,
//   Landmark,
//   CalendarDays,
//   Loader2,
//   ShieldCheck,
//   Eye,
//   FileText,
//   Briefcase,
//   MapPin,
//   Droplets,
//   Smartphone,
//   Mail,
//   Activity,
//   Hash,
//   Home,
//   ShieldAlert,
//   Save,
//   CheckCircle2,
//   XCircle
// } from "lucide-react";
// import toast from "react-hot-toast";
// import AllkycVerified from "../../components/kycverification/AllkycVerified";
// import PolicyStepper from "../../components/policyui/PolicyStepper";
// import OfferLatter from "../../components/offer/OfferLatter";
// import AssetManager from "../../components/assets_assign/AssetManager";
// import DocumentSubmissionUI from "../../components/employeedocument/DocumentSubmissionUI";
// import JoiningConfirmationUI from "../../components/joining/JoiningConfirmationUI";

// export default function EmployeeProfileLayout() {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   // --- EXISTING LOGIC STATES ---
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState(null);
//   const [industries, setIndustries] = useState([]);
//   const [addressLoading, setAddressLoading] = useState(true);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [docSubTab, setDocSubTab] = useState("Personal"); // Default sub-tab
//   // --- NEW: PINCODE API STATES ---
//   const [fetchingPin, setFetchingPin] = useState({ current: false, permanent: false });
//   const [cityOptions, setCityOptions] = useState({ current: [], permanent: [] });
//   const [verifyForm, setVerifyForm] = useState({ type: "", status: "verified", remarks: "" });
// const [showProfileModal, setShowProfileModal] = useState(false);
// const [departments, setDepartments] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const emptyExperience = {
//     company_name: "",
//     job_title: "",
//     start_date: "",
//     end_date: "",
//     previous_ctc: "",
//     location: "",
//     description: "",
//     industry_id: "",    // Add this
//     department_id: "",  // Add this
//     exp_letter_file: null // Add this
// };
//    const [experiences, setExperiences] = useState([emptyExperience]);
//     const [localStatus, setLocalStatus] = useState(employee?.status);

//       const [showFull, setShowFull] = useState(false);
//       const [kyc, setKyc] = useState(null);
//       const [kycLoading, setKycLoading] = useState(true);
//       const [kycSubmitting, setKycSubmitting] = useState(false);
//       const [showKycModal, setShowKycModal] = useState(false);
//       const [activeDoc, setActiveDoc] = useState(null);
//       const [selectedFile, setSelectedFile] = useState(null);
//       const [error, setError] = useState(null);
//       // EXTRA PF / NOMINEE MODAL STATE
//     const [showExtraKycModal, setShowExtraKycModal] = useState(false);
    
//       const [kycForm, setKycForm] = useState({
//         aadhaar_number: "",
//         pan_number: "",
//         account_holder_name: "",
//         account_number: "",
//         ifsc_code: "",
    
//          // ===== EXTRA PF / NOMINEE =====
//       uan_number: "",
//       pf_scheme_member: "No",
//       prev_employer_name: "",
//       prev_employer_address: "",
//       prev_pf_account_number: "",
//       prev_last_working_date: "",
//       transfer_pf_balance: "No",
//       nominee_name: "",
//       nominee_relation: "",
//       nominee_dob: "",
//       nominee_share: "",
//       });

//       const [documentsLoading, setDocumentsLoading] = useState(true);
//       const [showViewModal, setShowViewModal] = useState(false);
//       const [viewDocType, setViewDocType] = useState(null);
//       const IMAGE_ONLY_DOCS = ["photo", "previous_offer_letter"];
//       const META_DOCS = ["aadhaar", "pan", "bank"];
//       const [openVerify, setOpenVerify] = useState(null); // "pan" | "bank"
//       const [showExperienceModal, setShowExperienceModal] = useState(false);
//       const [draftExperiences, setDraftExperiences] = useState([]);
     
//       const [statusexp, setStatusexp] = useState([]);

//       const [panVerifyForm, setPanVerifyForm] = useState({
//         name: "",
//       });
//       const [bankVerifyForm, setBankVerifyForm] = useState({
//         bank_account: "",
//         ifsc: "",
//         name: "",
//         phone: "",
//       });
//       const [verifying, setVerifying] = useState(false);
//       // Assets State
//       const [previousAssets, setPreviousAssets] = useState([]); // from API (GET)
//       const [assetRows, setAssetRows] = useState([]); // draft rows
    
//       const [esignFile, setEsignFile] = useState(null);
 
//       const [documentId, setDocumentId] = useState(null);
//       const [aadhaarLast4, setAadhaarLast4] = useState("");
//       const [esignVerified, setEsignVerified] = useState(false);
//       const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
//  const [aadhaarVerifyForm, setAadhaarVerifyForm] = useState({
//     aadhaar_status: "",
//     remarks: "",
//   });
//   const [offerProfile, setOfferProfile] = useState(null);

//   const [isExitModalOpen, setIsExitModalOpen] = useState(false);

//   const [exitForm, setExitForm] = useState({
//     exit_date: "",
//     exit_reason: "",
//   });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingExp, setEditingExp] = useState(null);
//   const [editForm, setEditForm] = useState({
//     company_name: "",
//     job_title: "",
//     start_date: "",
//     end_date: "",
//     previous_ctc: "",
//     location: "",
//     description: "",
//   });
//   const [profileForm, setProfileForm] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     reporting_manager_name: "",
//     blood_group: "",
//     emergency_contact_name: "",
//     emergency_contact_relation: "",
//     emergency_contact_phone: ""
//   });

//   const [showEducationModal, setShowEducationModal] = useState(false);
// const [educations, setEducations] = useState([
//   {
//     id: 101,
//     institution: "University of Mumbai",
//     degree: "Bachelor of Technology",
//     field_of_study: "Computer Science",
//     start_date: "2020-07-01",
//     end_date: "2024-05-30",
//     grade: "9.2 CGPA",
//     location: "Mumbai, MH"
//   },
//   {
//     id: 102,
//     institution: "St. Xavier's Junior College",
//     degree: "Higher Secondary Education",
//     field_of_study: "Science",
//     start_date: "2018-06-01",
//     end_date: "2020-03-30",
//     grade: "88.40%",
//     location: "Mumbai, MH"
//   }
// ]);

//   useEffect(() => {
//     setLocalStatus(employee?.status);
//   }, [employee?.status]);

//   useEffect(() => {
//   const fetchIndustries = async () => {
//     const res = await fetch("https://apihrr.goelectronix.co.in/masters/industries?skip=0&limit=100");
//     if (res.ok) {
//       const data = await res.json();
//       setIndustries(Array.isArray(data) ? data : (data.data || []));
//     }
//   };
//   fetchIndustries();
// }, []);
  
//    // --- FETCH LOGIC ---
//   useEffect(() => {
//     fetchEmployee();
//     fetchDropdownData();
//     fetchDocuments();
//   }, [id]);

//   // --- NEW: PINCODE AUTO-FILL LOGIC ---
//   const handlePincodeChange = async (type, val) => {
//     const pincode = val.replace(/\D/g, '').slice(0, 6); // Allow only numbers, max 6
//     setAddressForm(prev => ({ ...prev, [`${type}_pincode`]: pincode }));
    
//     if (pincode.length === 6) {
//       setFetchingPin(prev => ({ ...prev, [type]: true }));
//       try {
//         const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//         const data = await res.json();
        
//         if (data && data[0].Status === "Success") {
//           const postOffices = data[0].PostOffice;
//           const state = postOffices[0].State;
//           const district = postOffices[0].District;
//           const country = postOffices[0].Country;
          
//           // Get unique areas/cities from the response
//           const areas = [...new Set(postOffices.map(po => po.Name))];
          
//           setCityOptions(prev => ({ ...prev, [type]: areas }));
          
//           setAddressForm(prev => ({
//             ...prev,
//             [`${type}_pincode`]: pincode,
//             [`${type}_state`]: state,
//             [`${type}_district`]: district,
//             [`${type}_country`]: country,
//             [`${type}_city`]: areas[0] // Auto-select the first area
//           }));
//           toast.success("Location data fetched successfully");
//         } else {
//           toast.error("Invalid Pincode");
//           setCityOptions(prev => ({ ...prev, [type]: [] }));
//           setAddressForm(prev => ({
//             ...prev,
//             [`${type}_state`]: "",
//             [`${type}_district`]: "",
//             [`${type}_country`]: "",
//             [`${type}_city`]: ""
//           }));
//         }
//       } catch (error) {
//         toast.error("Network error. Could not fetch location.");
//       } finally {
//         setFetchingPin(prev => ({ ...prev, [type]: false }));
//       }
//     }
//   };
  
//   const [addressForm, setAddressForm] = useState({
//     current_address_line1: "",
//     current_address_line2: "",
//     current_city: "",
//     current_state: "",
//     current_pincode: "",
//     permanent_address_line1: "",
//     permanent_address_line2: "",
//     permanent_city: "",
//     permanent_state: "",
//     permanent_pincode: "",
//   });

//   // --- TAB STATE ---
//   const [activeTab, setActiveTab] = useState("Profile");

//   const tabs = [
//     { id: "Profile", icon: <User size={14} /> },
//       { id: "Eduction", icon: <TrendingUp size={14} /> },
//       { id: "Experiance", icon: <TrendingUp size={14} /> },
//       { id: "Interviews", icon: <MessageCircle size={14} /> },
//     { id: "Assets", icon: <Clock size={14} /> },
//     // { id: "Rules & Policy", icon: <CreditCard size={14} /> },
//     // { id: "Loans", icon: <Landmark size={14} /> },
//     // { id: "Leave(s)", icon: <CalendarDays size={14} /> },
//     // { id: "Expense Claims", icon: <Briefcase size={14} /> },
//     { id: "Document Centre", icon: <FileText size={14} /> },
//   ];

 

//   // const fetchEmployee = async () => {
//   //   try {
//   //     setLoading(true);
//   //     setAddressLoading(true); // 🔥 Add this to sync loaders

//   //     // 🔥 MODIFIED: Using getFull instead of getById
//   //     const fullData = await employeeKycService.getFull(id);
      
//   //     // Check if API wraps response in { employee: ... } or returns directly
//   //     if (fullData && fullData.employee) {
//   //       setEmployee(fullData.employee);
        
//   //       // Extract Address Data
//   //       if (fullData.employee.address) {
//   //         setAddress(fullData.employee.address);
//   //         setAddressForm(fullData.employee.address);
//   //       }
//   //     } else {
//   //       // Fallback for direct JSON structure
//   //       setEmployee(fullData); 
        
//   //       // Extract Address Data directly
//   //       if (fullData && fullData.address) {
//   //         setAddress(fullData.address);
//   //         setAddressForm(fullData.address);
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to load comprehensive employee data");
//   //   } finally {
//   //     setLoading(false);
//   //     setAddressLoading(false); // 🔥 Ensure address loader turns off
//   //   }
//   // };


//   const fetchEmployee = async () => {
//     try {
//       setLoading(true);
//       setAddressLoading(true);

//       const fullData = await employeeKycService.getFull(id);
      
//       // Helper to pre-fill the edit form
//       const populateProfileForm = (data) => {
//         setProfileForm({
//           full_name: data.full_name || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           department_id: data.department_id || "",
//           role: data.role || "",
//           reporting_manager_name: data.reporting_manager_name || "",
//           blood_group: data.blood_group || "",
//           emergency_contact_name: data.emergency_contact_name || "",
//           emergency_contact_relation: data.emergency_contact_relation || "",
//           emergency_contact_phone: data.emergency_contact_phone || ""
//         });
//       };

//       if (fullData && fullData.employee) {
//         setEmployee(fullData.employee);
//         populateProfileForm(fullData.employee); // <-- Add this
//         if (fullData.employee.address) {
//           setAddress(fullData.employee.address);
//           setAddressForm(fullData.employee.address);
//         }
//       } else {
//         setEmployee(fullData); 
//         populateProfileForm(fullData); // <-- Add this
//         if (fullData && fullData.address) {
//           setAddress(fullData.address);
//           setAddressForm(fullData.address);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load comprehensive employee data");
//     } finally {
//       setLoading(false);
//       setAddressLoading(false);
//     }
//   };


//   const fetchAddress = async () => {
//     try {
//       setAddressLoading(true);
//       const data = await employeeAddressService.get(id);
//       if (data) {
//         setAddress(data.address);
//         setAddressForm(data.address);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setAddressLoading(false);
//     }
//   };

// // --- FETCH DROPDOWN DATA ---
//   const fetchDropdownData = async () => {
//     try {
//       // 1. Fetch Departments
//       const deptRes = await fetch("https://apihrr.goelectronix.co.in/departments");
//       if (deptRes.ok) {
//         const deptData = await deptRes.json();
//         setDepartments(Array.isArray(deptData) ? deptData : (deptData.data || [])); 
//       }

//       // 2. Fetch Confirmed Employees (for Reporting Manager list)
//       const empRes = await fetch("https://apihrr.goelectronix.co.in/employees?status=confirmed");
//       if (empRes.ok) {
//         const empData = await empRes.json();
//         const empList = Array.isArray(empData) ? empData : (empData.data || []);
//         setManagers(empList);
//       }
//     } catch (error) {
//       console.error("Failed to load dropdown data", error);
//     }
//   };

//   // --- NEW: HANDLE PROFILE UPDATE ---
//   const handleProfileUpdate = async () => {
//     try {
//       const payload = {
//         full_name: profileForm.full_name,
//         email: profileForm.email,
//         phone: profileForm.phone,
//         department_id: Number(profileForm.department_id) || 0,
//         role: profileForm.role,
//         reporting_manager_name: profileForm.reporting_manager_name,
//         blood_group: profileForm.blood_group,
//         emergency_contact_name: profileForm.emergency_contact_name,
//         emergency_contact_relation: profileForm.emergency_contact_relation,
//         emergency_contact_phone: profileForm.emergency_contact_phone
//       };

//       await toast.promise(
//         fetch(`https://apihrr.goelectronix.co.in/employees/${id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         }).then(res => {
//           if (!res.ok) throw new Error("Update Failed");
//           return res.json();
//         }),
//         {
//           loading: 'Updating profile...',
//           success: 'Profile updated successfully ✅',
//           error: 'Failed to update profile ❌',
//         }
//       );
      
//       setShowProfileModal(false);
//       fetchEmployee(); // Refresh UI with updated data
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const formatRegistryDate = (dateString) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit", month: "short", year: "numeric",
//     }).replace(/ /g, "-");
//   };

//   const fetchDocuments = async () => {
//     try {
//       const data = await employeeKycService.getDocuments(id);
//       setDocuments(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const sortedExperiences = [...experiences].sort(
//     (a, b) => new Date(b.start_date) - new Date(a.start_date),
//   );

//   // 2. Financial Calculations
//   const totalCTC = experiences.reduce(
//     (sum, exp) => sum + Number(exp.previous_ctc || 0),
//     0,
//   );
//   const avgCTC = experiences.length > 0 ? totalCTC / experiences.length : 0;
//   const lastDrawn =
//     experiences.length > 0
//       ? Number(experiences[experiences.length - 1].previous_ctc)
//       : 0;

//   // 3. AI Suggestion Logic (Standard 20% Hike)
//   const suggestedCTC = lastDrawn * 1.2;


//   // Helper variables for the UI
//   const getDocument = (type) => documents?.find((d) => d.document_type === type);
//   const currentDoc = getDocument("address_proof_current");
//   const permanentDoc = getDocument("address_proof_permanent");


//   // Logic to get the latest Offer Letter from the documents array
//   const latestOfferLetter = documents
//     ?.filter((doc) => doc.document_type === "goex_offer_letter")
//     ?.sort((a, b) => b.id - a.id)[0]; // Sort by ID descending and take the first one


//     console.log("add new 55555555code" , latestOfferLetter)


//   //******************************************************************************************* */

  
//     const fetchKyc = async () => {
//       try {
//         const data = await employeeKycService.get(id);
//         if (data) {
//           // setKyc(data);
//           setKyc({
//             ...data.kyc_details, // ← flatten KYC
//             esign_history: data.esign_history,
//           });
//           setKycForm({
//             aadhaar_number: data.aadhaar_number || "",
//             pan_number: data.pan_number || "",
//             account_holder_name: data.account_holder_name || "",
//             account_number: data.account_number || "",
//             ifsc_code: data.ifsc_code || "",
//           });
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setKycLoading(false);
//       }
//     };
  
//     const esignHistory = kyc?.esign_history || [];
  
//     const latestEsign =
//       esignHistory.length > 0 ? esignHistory[esignHistory.length - 1] : null;
  
//     const esignStatus = latestEsign?.status; // link_generated | signed
//     const isEsignSigned = esignStatus === "signed";
//     const isEsignLinkGenerated = esignStatus === "link_generated";
//     const isEsignDocumentUploaded = esignStatus === "document_uploaded";
  
  
//     // const handleSaveExperience = async () => {
//     //   try {
//     //     // 🔹 ONLY new experiences (no id yet)
//     //     const newExperiences = draftExperiences.filter(
//     //       (exp) => !exp.id && (exp.company_name || exp.job_title),
//     //     );
  
//     //     if (newExperiences.length === 0) {
//     //       toast.error("No new experience to save");
//     //       return;
//     //     }
  
//     //     const payload = {
//     //       experiences: newExperiences,
//     //     };
  
//     //     await employeeKycService.saveExperience(id, payload);
  
//     //     toast.success("Experience added successfully");
//     //     await fetchExperiences();
  
//     //     setDraftExperiences([]);
//     //     setShowExperienceModal(false);
//     //   } catch (err) {
//     //     toast.error(err.message || "Failed to save experience");
//     //   }
//     // };
  

//  const handleSaveExperience = async () => {
//   try {
//     // 1. Get the latest entry from the draft array
//     const newExp = draftExperiences.find((exp) => !exp.id && exp.company_name);

//     if (!newExp) {
//       toast.error("Company Name is required");
//       return;
//     }

//     const formData = new FormData();
    
//     // Core Data
//     formData.append("company_name", newExp.company_name);
//     formData.append("job_title", newExp.job_title);
//     formData.append("start_date", newExp.start_date);
//     formData.append("end_date", newExp.end_date);
//     formData.append("location", newExp.location || "");
//     formData.append("description", newExp.description || "");
    
//     // IDs (Ensuring they are sent as strings for FormData)
//     formData.append("industry_id", newExp.industry_id || "0");
//     formData.append("department_id", newExp.department_id || "0");
//     formData.append("previous_ctc", newExp.previous_ctc || "0");

//     // 🔥 DYNAMIC ATTACHMENT LOGIC
//     // If a PDF/Image file is selected
//     if (newExp.exp_letter_file) {
//       formData.append("exp_letter_file", newExp.exp_letter_file);
//     }
    
//     // If a URL link is provided
//     if (newExp.exp_letter_link) {
//       formData.append("exp_letter_link", newExp.exp_letter_link);
//     }

//     const response = await fetch(`https://apihrr.goelectronix.co.in/employees/${id}/experiences`, {
//       method: "POST",
//       body: formData, // Browser automatically sets 'multipart/form-data' with boundary
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail?.[0]?.msg || "Deployment failed");
//     }

//     toast.success("Experience deployed to registry ✅");
//     fetchExperiences(); // Refresh timeline
//     setShowExperienceModal(false);
//     setDraftExperiences([]);
//   } catch (err) {
//     toast.error(err.message);
//   }
// };
  
//     const fetchExperiences = async () => {
//       try {
//         const res = await employeeKycService.getExperiences(id);
  
//         // console.log("API DATA", res);
//         setStatusexp(res);
  
//         if (res?.data && Array.isArray(res.data)) {
//           setExperiences(res.data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch experiences", err);
//       }
//     };
  
//     const getAddressProofDoc = (type) => {
//       return documents?.find((d) => d.document_type === type);
//     };
  
//     console.log("docuemtn", documents);
  
//     const handleSaveAddress = async () => {
//       try {
//         if (address) {
//           await employeeAddressService.update(id, addressForm);
//           toast.success("Address updated successfully");
//         } else {
//           await employeeAddressService.create(id, addressForm);
//           toast.success("Address added successfully");
//         }
//         setShowAddressModal(false);
//         fetchAddress();
//       } catch (err) {
//         toast.error(err.message || "Failed to save address");
//       }
//     };
  
//     const handleVerifyAddress = async () => {
//       try {
//         await employeeAddressService.verify(id, verifyForm);
//         fetchAddress();
//       } catch (err) {
//         console.error(err);
//       }
//     };
  
//     const handleKycSubmit = async () => {
//       try {
//         // 1️⃣ IMAGE ONLY (PHOTO / OFFER LETTER)
//         if (IMAGE_ONLY_DOCS.includes(activeDoc)) {
//           if (!selectedFile) {
//             toast.error("Please upload a file");
//             return;
//           }
  
//           await employeeKycService.uploadDocument(id, activeDoc, selectedFile);
  
//           toast.success("Document uploaded");
//         }
  
//         // 2️⃣ METADATA + IMAGE (AADHAAR / PAN / BANK)
//         if (META_DOCS.includes(activeDoc)) {
//           // a) save JSON metadata ONLY
//           await employeeKycService.create(id, kycForm);
  
//           // b) upload file ONLY
//           if (selectedFile) {
//             await employeeKycService.uploadDocument(id, activeDoc, selectedFile);
//           }
  
//           toast.success("KYC details saved");
//         }
  
//         setShowKycModal(false);
//         setSelectedFile(null);
//         await fetchDocuments();
//         fetchKyc();
//       } catch (err) {
//         toast.error(err.message || "Something went wrong");
//       }
//     };
  
//     const getDocumentImage = (type) => {
//       const doc = getDocument(type);
//       if (!doc?.document_path) return null;
//       return `https://apihrr.goelectronix.co.in/${doc.document_path}`;
//     };
  
//     const getKycDataByType = (type) => {
//       if (!kyc) return null;
  
//       switch (type) {
//         case "aadhaar":
//           return { label: "Aadhaar Number", value: kyc.aadhaar_number };
//         case "pan":
//           return { label: "PAN Number", value: kyc.pan_number };
//         case "bank":
//           return {
//             label: "Account Number",
//             value: kyc.account_number,
//             extra: `IFSC: ${kyc.ifsc_code}`,
//           };
//         default:
//           return null;
//       }
//     };
  
//     const verifyPanHandler = async () => {
//       try {
//         setVerifying(true);
  
//         const res = await employeeKycService.verifyPan(id, panVerifyForm);
  
//         if (res.pan_status !== "verified") {
//           toast.error(res.remarks || "PAN verification failed");
//           return;
//         }
  
//         toast.success("PAN verified successfully");
  
//         // update KYC state so UI switches to verified view
//         setKyc((prev) => ({
//           ...prev,
//           ...res,
//         }));
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setVerifying(false);
//       }
//     };
  
//     const verifyBankHandler = async () => {
//       try {
//         setVerifying(true);
  
//         const res = await employeeKycService.verifyBank(id, bankVerifyForm);
  
//         if (res.bank_status !== "verified") {
//           toast.error(res.remarks || "Bank verification failed");
//           return;
//         }
  
//         toast.success("Bank verified successfully");
  
//         // update KYC state so UI switches to verified view
//         setKyc((prev) => ({
//           ...prev,
//           ...res,
//         }));
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setVerifying(false);
//       }
//     };
  
//     const generateVerificationId = () => {
//       return (
//         "ESIGN-" +
//         Date.now().toString(36).toUpperCase() +
//         "-" +
//         Math.random().toString(36).substring(2, 8).toUpperCase()
//       );
//     };
  
//     const submitAadhaar = async () => {
//       if (aadhaarLast4.length !== 4) {
//         toast.error("Enter last 4 digits of Aadhaar");
//         return;
//       }
  
//       if (!documentId?.document_id) {
//         toast.error("Document not uploaded yet");
//         return;
//       }
  
//       try {
//         setUploading(true);
  
//         const payload = {
//           verification_id: generateVerificationId(), // unique ref
//           document_id: documentId.document_id,
//           notification_modes: ["email"],
//           auth_type: "AADHAAR",
//           expiry_in_days: "7",
//           capture_location: true,
//           signers: [
//             {
//               name: employee.full_name,
//               email: employee.email,
//               phone: employee.phone,
//               sequence: 1,
//               aadhaar_last_four_digit: aadhaarLast4,
//               sign_positions: [
//                 {
//                   page: 1,
//                   top_left_x_coordinate: 400,
//                   bottom_right_x_coordinate: 550,
//                   top_left_y_coordinate: 700,
//                   bottom_right_y_coordinate: 800,
//                 },
//               ],
//             },
//           ],
//         };
  
//         const res = await fetch(
//           "https://apihrr.goelectronix.co.in/esign/create",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           },
//         );
  
//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.message || "eSign creation failed");
//         }
  
//         const data = await res.json();
  
//         toast.success("eSign request created successfully");
//         setEsignVerified(true);
  
//         await fetchKyc();
  
//         console.log("eSign response:", data);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setUploading(false);
//       }
//     };
  
//     const verifyAadhaarHandler = async () => {
//       if (!aadhaarVerifyForm.aadhaar_status) {
//         toast.error("Please select Aadhaar status");
//         return;
//       }
  
//       try {
//         setVerifyingAadhaar(true);
  
//         const res = await fetch(
//           `https://apihrr.goelectronix.co.in/employees/verify-aadhaar/${id}`,
//           {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(aadhaarVerifyForm),
//           },
//         );
  
//         if (!res.ok) {
//           const err = await res.text();
//           throw new Error(err);
//         }
  
//         const data = await res.json();
  
//         // 🔥 merge Aadhaar result into kyc state
//         setKyc((prev) => ({
//           ...prev,
//           aadhaar_status: data.aadhaar_status,
//           aadhaar_verified_at: new Date().toISOString(),
//           aadhaar_remarks: data.remarks,
//           aadhaar_verification_id: data.verification_id || "AADH-" + Date.now(),
//         }));
  
//         toast.success("Aadhaar verification updated successfully ✅");
//         await kyc();
//       } catch (err) {
//         toast.error(err.message || "Aadhaar verification failed");
//       } finally {
//         setVerifyingAadhaar(false);
//       }
//     };
  
    
  
//     const aadhaarDoc = getDocument("aadhaar");
  
//     console.log("adddharr4444", aadhaarDoc);
//     const panDoc = getDocument("pan");
//     const bankDoc = getDocument("bank");
//     const photoDoc = getDocument("photo");
//     const offerDoc = getDocument("previous_offer_letter");
  
//     //**********************************asset code */
//     const addAssetRow = (asset) => {
//       setAssetRows((prev) => [...prev, asset]);
//     };
  
//     // Remove row
//     const removeAssetRow = (index) => {
//       const updated = assetRows.filter((_, i) => i !== index);
//       setAssetRows(updated);
//     };
  
//     // Change row field
//     const handleAssetChange = (index, field, value) => {
//       setAssetRows((prev) =>
//         prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
//       );
//     };
  
  
//   const handleSubmitAssets = async () => {
//     try {
//       if (assetRows.length === 0) {
//         toast.error("Add at least one asset");
//         return;
//       }
  
//       const formData = new FormData();
  
//       const sendEmailFlag = assetRows.some((a) => a.send_email === true);
//       formData.append("send_email", sendEmailFlag);
  
//       assetRows.forEach((asset) => {
//         if (!asset.asset_name || !asset.serial_number) return;
  
//         // 🔹 FLAT FIELDS (NO assets[0])
//         formData.append("asset_category", asset.asset_category || "laptop");
//         formData.append("asset_name", asset.asset_name);
//         formData.append("serial_number", asset.serial_number);
//         formData.append("model_number", asset.model_number || "");
//         formData.append("allocated_at", asset.allocated_at);
//         formData.append("condition_on_allocation", asset.condition_on_allocation);
//         formData.append("remarks", asset.remarks || "");
  
//         // 🔹 MULTIPLE IMAGES
//         if (asset.images?.length > 0) {
//           asset.images.forEach((file) => {
//             formData.append("images", file);   // ← NO index
//           });
//         }
//       });
  
//       await employeeKycService.addAssets(id, formData);
  
//       toast.success("Assets assigned successfully");
//       setAssetRows([]);
//       fetchAssets();
//     } catch (err) {
//       toast.error(err.message || "Failed to assign assets");
//     }
//   };
  
  
//     const handleEmployeeExit = async () => {
//       if (!exitForm.exit_date || !exitForm.exit_reason) {
//         toast.error("Please provide exit date and reason");
//         return;
//       }
  
//       try {
//         await toast.promise(
//           fetch(`https://apihrr.goelectronix.co.in/employees/${id}/exit`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(exitForm),
//           }),
//           {
//             loading: "Marking employee exit...",
//             success: "Employee marked as exited ✅",
//             error: "Failed to update employee exit ❌",
//           },
//         );
  
//         setIsExitModalOpen(false);
//       } catch (err) {
//         console.error(err);
//       }
//     };
  
//     const fetchAssets = async () => {
//       try {
//         const res = await employeeKycService.getAssets(id);
//         console.log("inside funbtion", res);
//         setPreviousAssets(res || []);
//       } catch (err) {
//         console.error("Failed to fetch assets", err);
//       }
//     };
  
//     console.log("Add assets code", previousAssets);
  
//     const uploadEsignDocument = async () => {
//       if (!esignFile) {
//         toast.error("Please upload a document");
//         return;
//       }
  
//       try {
//         setUploading(true);
  
//         const formData = new FormData();
//         formData.append("document", esignFile);
//         for (const pair of formData.entries()) {
//           console.log(pair[0], pair[1]);
//         }
  
//         const uploadRes = await fetch(
//           "https://spillas.com/dotnet-api/Cashfree/upload-esign-document",
//           {
//             method: "POST",
//             headers: {
//               AppId: "170J3KZTCJLZBKXGQ6PAVERHYX1JLD",
//               SecretKey: "TESTVPKA8XNE6R045U9JCT4KKADDF88T8UAT",
//             },
//             body: formData,
//           },
//         );
  
//         const uploadData = await uploadRes.json();
  
//         if (uploadData.status !== "SUCCESS") {
//           throw new Error("Upload failed");
//         }
  
//         const docId = uploadData; // ✅ extract number
  
//         setDocumentId(docId);
  
//         // 🔥 AUTO CALL SECOND API
//         await processExternalUpload(docId);
  
//         toast.success("Document uploaded successfully");
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setUploading(false);
//       }
//     };
  
//     const processExternalUpload = async (docResponse) => {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/esign/process-external-upload?employee_id=${id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: docResponse.status,
//             document_id: docResponse.document_id,
//           }),
//         },
//       );
  
//       if (!res.ok) {
//         const err = await res.json();
//         console.error(err);
//         throw new Error("eSign process failed");
//       }
  
//       return await res.json();
//     };
  
//     const handleGetFullEmployee = async (id) => {
//       try {
//         setLoading(true);
//         setError(null);
  
//         const data = await employeeKycService.getFull(id);
  
//         setOfferProfile(data); // ✅ instead of setExperience
//       } catch (err) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const REVIEW_ALERT_CONFIG = {
//       probation_review: {
//         title: "Probation Period Concluding",
//         message: "This employee's probation phase ends in",
//         days: 7,
//         badge: "Priority",
//       },
//       probation_extended: {
//         title: "Probation Extended",
//         message: "Extended probation review required within",
//         days: 15,
//         badge: "Attention",
//       },
//       confirmed: {
//         title: "Post-Confirmation Review",
//         message: "Initial performance review scheduled in",
//         days: 30,
//         badge: "Review",
//       },
//     };
  
//     const handleEditExperience = (exp) => {
//       setEditingExp(exp);
  
//       setEditForm({
//         company_name: exp.company_name || "",
//         job_title: exp.job_title || "",
//         start_date: exp.start_date || "",
//         end_date: exp.end_date || "",
//         previous_ctc: exp.previous_ctc || "",
//         location: exp.location || "",
//         description: exp.description || "",
//       });
  
//       setShowEditModal(true);
//     };
  
//     const handleUpdateExperience = async () => {
//       if (!editingExp?.id) return;
  
//       try {
//         await fetch(
//           `https://apihrr.goelectronix.co.in/employees/${id}/experiences/${editingExp.id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               company_name: editForm.company_name,
//               job_title: editForm.job_title,
//               start_date: editForm.start_date,
//               end_date: editForm.end_date,
//               previous_ctc: Number(editForm.previous_ctc),
//               location: editForm.location,
//               description: editForm.description,
//             }),
//           },
//         );
  
//         toast.success("Experience updated successfully");
  
//         setShowEditModal(false);
//         setEditingExp(null);
  
//         // 🔁 reload experiences (existing function)
//         fetchExperiences();
//       } catch (err) {
//         toast.error("Failed to update experience");
//       }
//     };
  
//     const handleSubmission = () => {
//       console.log("Document Submitted");
  
//       // Example: update employee status locally
//       setEmployee((prev) => ({
//         ...prev,
//         status: "document_submitted",
//         doc_date: new Date().toISOString().split("T")[0],
//         doc_remarks: "Documents submitted successfully",
//       }));
//     };
  
//     const HIDE_SALARY_STATUSES = [
//       "on_probation",
//       "confirmed",
//       "probation_review",
//       "extended",
//       "exited",
//     ];
  
//     const shouldHideSalaryInsights = HIDE_SALARY_STATUSES.includes(
//       employee?.status,
//     );
  
  
//   const formatDate = (d) => {
//     if (!d) return null;
//     return d.length > 10 ? d.slice(0, 10) : d; // keep YYYY-MM-DD
//   };
  
//   const handleSaveExtraKyc = async () => {
//     try {
//       const payload = {
//         ...kycForm,
//         prev_last_working_date: formatDate(kycForm.prev_last_working_date),
//         nominee_dob: formatDate(kycForm.nominee_dob),
//       };
  
//       await employeeKycService.create(id, payload);
  
//       toast.success("PF / Nominee details saved");
//       setShowExtraKycModal(false);
//       fetchKyc();
//     } catch (err) {
//       toast.error(err.message || "Failed to save KYC");
//     }
//   };
  

//   const calculateDuration = (start, end) => {
//   if (!start) return "N/A";
//   const startDate = new Date(start);
//   const endDate = end ? new Date(end) : new Date();
//   const diffTime = Math.abs(endDate - startDate);
//   const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
//   if (diffMonths >= 12) {
//     const yrs = Math.floor(diffMonths / 12);
//     const mos = diffMonths % 12;
//     return `${yrs} YR ${mos > 0 ? mos + ' MO' : ''}`;
//   }
//   return `${diffMonths} MO`;
// };
    
//     const isProposedHigherThanRecommended =
//       Number(offerProfile?.offered_ctc || 0) > Math.round(suggestedCTC);
  
//       const panDocObj = documents?.find(d => d.document_type === "pan");
//   const hasPanDocument = panDocObj?.status === "exists";

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] relative">
//         {/* 🚀 HERO BANNER SKELETON */}
//         <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 animate-pulse">
//           <div className="max-w-[1440px] mx-auto">
//             <div className="w-16 h-3 bg-slate-200 rounded mb-4" /> {/* Back Button */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full bg-slate-200" /> {/* Avatar */}
//                 <div className="space-y-2">
//                   <div className="h-5 w-48 bg-slate-200 rounded-md" /> {/* Name */}
//                   <div className="h-3 w-32 bg-slate-200 rounded-md" /> {/* ID & Status */}
//                 </div>
//               </div>
//               <div className="h-8 w-24 bg-slate-200 rounded-lg" /> {/* Action Button */}
//             </div>
//           </div>
//         </div>

//         {/* 📄 MAIN LAYOUT SKELETON */}
//         <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
          
//           {/* 🧭 SIDEBAR SKELETON */}
//           <div className="w-full lg:w-56 shrink-0 lg:border-r border-slate-200 lg:pr-4 overflow-hidden">
//             <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 animate-pulse">
//               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//                 <div key={i} className="h-9 w-full bg-slate-200 rounded-lg" />
//               ))}
//             </div>
//           </div>

//           {/* 📊 CONTENT AREA SKELETON */}
//           <div className="flex-1 w-full space-y-4 animate-pulse">
//             <div className="hidden lg:block h-6 w-32 bg-slate-200 rounded-md mb-2" /> {/* Tab Title */}
            
//             {/* SKELETON CARD 1 */}
//             <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
//               <div className="flex justify-between mb-6">
//                 <div className="h-4 w-40 bg-slate-200 rounded-md" />
//                 <div className="h-6 w-24 bg-slate-200 rounded-lg" />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-6 gap-x-4">
//                 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//                   <div key={i} className="space-y-1.5">
//                     <div className="h-2 w-16 bg-slate-200 rounded" />
//                     <div className="h-3 w-full max-w-[80%] bg-slate-200 rounded" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* SKELETON CARD 2 */}
//             <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm mt-4">
//               <div className="flex justify-between mb-6">
//                 <div className="h-4 w-40 bg-slate-200 rounded-md" />
//                 <div className="h-6 w-24 bg-slate-200 rounded-lg" />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="h-16 w-full bg-slate-100 rounded-xl border border-slate-100" />
//                 <div className="h-16 w-full bg-slate-100 rounded-xl border border-slate-100" />
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!employee) {
//     return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Employee not found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] relative">
      
//       {/* 🚀 TOP HERO BANNER (Tightened Padding) */}
//       <div className="bg-gradient-to-r from-[#eff6ff] via-white to-[#eff6ff] border-b border-blue-100 relative overflow-hidden">
//         <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />

//         <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 md:py-4 relative z-10">
//           <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-1.5 text-xs font-bold !text-blue-600 hover:!text-blue-800 transition-colors mb-3">
//             <ArrowLeft size={14} strokeWidth={2.5} /> <span className="hidden md:inline">Back</span>
//           </button>

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
//             {/* Identity Block (Smaller Avatar & Text) */}
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full bg-white border-2 border-white flex items-center justify-center text-blue-600 text-base font-black shadow-md shadow-blue-500/10 uppercase">
//                 {employee.full_name?.substring(0, 2)}
//               </div>
//               <div className="min-w-0">
//                 <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none mb-1 truncate uppercase">
//                   {employee.full_name}
//                 </h1>
//                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex flex-wrap items-center gap-1.5">
//                   <span>ID: {employee.employee_code || employee.temp_id}</span>
//                   <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300" /> 
//                   <span className="md:hidden w-[1px] h-3 bg-slate-300" />
//                   <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 truncate">{employee.status?.replace("_", " ")}</span>
//                 </p>
//               </div>
//             </div>

//             {/* <button className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95">
//               Actions <ChevronDown size={12} strokeWidth={3} />
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* 📄 MAIN LAYOUT (Reduced Gap) */}
//       <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
        
//         {/* 🧭 NAVIGATION SIDEBAR (Tighter spacing) */}
//         <div className="w-full lg:w-56 shrink-0 lg:border-r border-slate-200 lg:pr-4 lg:sticky lg:top-6 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
//           <div className="flex lg:flex-col gap-1 pb-1 lg:pb-10 min-w-max lg:min-w-0">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
//                   activeTab === tab.id 
//                   ? "!bg-blue-50 !text-blue-600 shadow-sm border !border-blue-100" 
//                   : "!bg-transparent !text-slate-500 hover:!bg-slate-100 hover:!text-slate-800"
//                 }`}
//               >
//                 {activeTab === tab.id && <span className="hidden lg:block absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />}
//                 <span className="lg:hidden">{tab.icon}</span>
//                 {tab.id}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 📊 RIGHT CONTENT AREA (Tighter Gaps) */}
//         <div className="flex-1 w-full space-y-4 pb-20 overflow-x-auto  animate-in fade-in duration-300">
          
//           <h2 className="hidden lg:block text-lg font-black text-slate-900 tracking-tight uppercase mb-2">
//             {activeTab}
//           </h2>
// {activeTab === "Profile" && (
//   <div className="space-y-4 animate-in fade-in duration-500">
    
//     {/* CARD 1: PROFILE INFORMATION */}
//     <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-2 border-blue-500 pl-2 sm:border-0 sm:pl-0">
//           Profile Information
//         </h3>
//         <button 
//           onClick={() => setShowProfileModal(true)} 
//           className="flex items-center !bg-blue-50 justify-center gap-1.5 w-full sm:w-auto px-3 py-1.5 border !border-blue-600 !text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:!bg-blue-100 transition-all active:scale-95"
//         >
//           <Edit3 size={12} />
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-6 gap-x-4">
//         <DataField label="Name" value={employee.full_name}  />
//         <DataField label="ID" value={employee.employee_code || employee.temp_id}  />
//         <DataField label="Designation" value={employee.role} />
//         <DataField label="Staff Type" value="Regular" />
//         <DataField label="Contact Number" value={employee.phone} />
//         <DataField label="Attendance Supervisor" value="-" />
//         <DataField label="Reporting Manager" value={employee.reporting_manager_name} />
//         <DataField label="Department" value={employee.department_name} />
//       </div>
//     </div>

//      {/* 🔥 NEW CARD 2: EMERGENCY PROTOCOLS */}
//     <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm relative overflow-hidden">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//           <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
//             <ShieldAlert size={14} strokeWidth={2.5} />
//           </div>
//           Emergency Details
//         </h3>
//         <button className="flex items-center !bg-transparent justify-center gap-1.5 w-full sm:w-auto px-3 py-1.5 border !border-slate-100 !text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95">
//           <Edit3 size={12} /> 
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-6 gap-x-4 relative z-10">
//         <DataField label="Blood Group" value={employee.blood_group} />
//         <DataField label="Emergency Contact" value={employee.emergency_contact_name} />
//         <DataField label="Relationship" value={employee.emergency_contact_relation} />
//         <DataField label="Emergency Phone" value={employee.emergency_contact_phone} />
//       </div>

//       {/* Decorative Security Watermark */}
//       <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none rotate-12">
//         <ShieldAlert size={100} />
//       </div>
//     </div>

//     {/* 🔥 NEW CARD 2: GENERAL INFORMATION (Matching Screenshot) */}
//     <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
//           General Information
//         </h3>
//         <button className="flex items-center !bg-transparent justify-center gap-1.5 w-full sm:w-auto px-3 py-1.5 border !border-slate-200 !text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95">
//           <Edit3 size={12} /> 
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-8 gap-x-4">
//         <DataField label="Salary Cycle" value="1" />
//         <DataField label="Weekly-off Template" value="Default Template-1" />
//         <DataField label="Holiday Template" value="Holiday Calendar 2026" />
//         <DataField label="Leave Template" value="-" />
        
//         <DataField label="Shift" value="IT Staff" />
//         <DataField label="Attendance on Weekly Off" value="System Comp Off Template" />
//         <DataField label="Geofence Template" value="Office Staff" />
//         <DataField label="Attendance Settings" value="Regular Employees" />
        
//         <DataField label="Reimbursement Template" value="Default Template" />
//         <div className="col-span-1">
//            <DataField label="Salary Access" value="Allow till current cycle" />
//         </div>
//       </div>
//     </div>

   

//     {/* CARD 3: COMPLIANCE & STATUTORY */}
//     <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
//           <ShieldCheck size={14} className="text-emerald-500"/> Employment Information
//         </h3>
//         <button className="flex items-center !bg-transparent justify-center gap-1.5 w-full sm:w-auto px-3 py-1.5 border !border-slate-200 !text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95">
//           <Edit3 size={12} />
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-8 gap-x-4">
//         <DataField label="Date of Joining" value={formatRegistryDate(employee.joining_date)} />
//         <DataField label="UAN" value={employee?.kyc?.uan_number || "-"} />
        
//         <DataField label="Aadhaar Number" value={employee?.kyc?.aadhaar_number ? `XXXXXXXX${employee?.kyc.aadhaar_number.slice(-4)}` : "-"} />
        
//         <DataField label="Aadhaar Enrollment" value="-" />


//          <DataField label="PAN Number" value={employee?.kyc?.pan_number ? `${employee?.kyc.pan_number}` : "-"} />
//         <DataField label="PF Number" value="-" />
//         <DataField label="PF Joining Date" value="-" />
//         <DataField label="PF Eligible" value={kyc?.pf_scheme_member || "No"} />
        
//         <DataField label="ESI Eligible" value="No" />
//         <DataField label="ESI Number" value="-" />
//         <DataField label="PT Eligible" value="No" />
//         <DataField label="LWF Eligible" value="No" />
//       </div>
//     </div>

//     {/* CARD 4: BANK DETAILS */}
//     <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//         <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
//           Bank Details <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] rounded-full border border-emerald-100 flex items-center gap-1"><CheckCircle2 size={8} /> Bank Account Verified</span>
//         </h3>
//         <button className="flex items-center !bg-transparent justify-center gap-1.5 w-full sm:w-auto px-3 py-1.5 border !border-slate-200 !text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95">
//           <Edit3 size={12} /> Edit
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-6 gap-x-4">
//         <DataField label="Name of Bank" value="IDFC FIRST Bank" />
//         <DataField label="IFSC Code" value={employee?.kyc?.ifsc_code} />
//         <DataField label="Account Number" value={employee?.kyc?.account_number} />
//         <DataField label="Name of Account Holder" value={employee?.kyc?.account_holder_name} />
//       </div>
      
//       <div className="mt-8">
//         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">UPI Details</h4>
//         <DataField label="UPI ID" value="-" />
//       </div>
//     </div>


//    {/* 🌐 CARD: SKILLS & LANGUAGES (Registry Nodes) */}
//     <div className="bg-white border border-slate-200 rounded-xl p-0 shadow-sm overflow-hidden relative">
//       <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
//         {/* LEFT: SKILLS SECTION */}
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
//                 <TrendingUp size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Professional Skills</h3>
//             </div>
//             <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors border border-slate-100">
//               <PlusCircle size={14} />
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {employee?.skills?.length > 0 ? (
//               employee.skills.map((skill, idx) => (
//                 <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200 shadow-sm">
//                   {skill}
//                 </span>
//               ))
//             ) : (
//               <p className="text-[10px] font-bold text-slate-300 uppercase italic tracking-tighter">No Technical Nodes Appended</p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: LANGUAGES SECTION (Replaced Assets) */}
//         <div className="p-6 bg-slate-50/30">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white border border-blue-500 text-blue-600 rounded-lg">
//                 <Globe size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Languages </h3>
//             </div>
//             <button className="p-1.5 !bg-white !text-blue-400 hover:!text-blue-600 rounded-lg transition-colors border !border-slate-100 shadow-sm">
//               <Edit3 size={14} />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {/* Logic: Using dummy data for common languages if not in API yet */}
//             {["English", "Hindi", "Marathi"].map((lang, idx) => (
//               <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl group hover:border-emerald-200 transition-all shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
//                      <MessageCircle size={14} strokeWidth={2.5} />
//                   </div>
//                   <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{lang}</p>
//                 </div>
//                 <div className="flex gap-1">
//                   <span className="text-[7px] font-black !text-blue-600 uppercase bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Known</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       {/* Decorative Watermark */}
//       <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none -rotate-12">
//         <Globe size={120} />
//       </div>
//     </div>

//   </div>
// )}

// {/* {activeTab === "Experiance" && (
//             <div className="space-y-4">
              
//               <div>
                
              
                   
//                          <div className="space-y-8 mt-4 mb-4">
//                            <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//                              <div className="flex items-center gap-4">
//                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                                  <Briefcase size={24} />
//                                </div>
//                                <div>
//                                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
//                                    Professional Experience
//                                  </h2>
//                                  <p className="text-sm text-slate-500 font-medium">
//                                    Verified work history and career progression
//                                  </p>
//                                </div>
//                              </div>
                   
//                              <button
//                                onClick={() => {
//                                  () => setDraftExperiences([...draftExperiences, emptyExperience]);
//                                  setShowExperienceModal(true);
//                                }}
//                                className="flex items-center gap-2 px-5 py-2.5 border border-blue-500 text-sm font-bold !bg-white !text-blue-500 rounded-xl hover:bg-slate-800 transition-all "
//                              >
//                                <PlusCircle size={18} /> Add Experience
//                              </button>
//                            </div>
                   
//                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                              <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//                                {sortedExperiences.length > 0 ? (
//                                  sortedExperiences.map((exp, index) => (
//                                    <div key={exp.id || index} className="relative pl-12 group">
//                                      <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
//                                        <span className="text-[10px] font-bold">{index + 1}</span>
//                                      </div>
                   
//                                      <div className="bg-white border border-slate-200 p-5 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
//                                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//                                          <div>
//                                            <h3 className="text-lg font-bold text-slate-800">
//                                              {exp.job_title}
//                                            </h3>
//                                            <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
//                                              {exp.company_name}
//                                            </p>
//                                          </div>
                   
//                                          <div>
//                                            <button
//                                              onClick={() => handleEditExperience(exp)}
//                                              className="flex items-center gap-1 px-3 py-1.5 text-[11px] !text-blue-500 font-bold !bg-white border border-blue-500 hover:bg-slate-200 rounded-lg"
//                                            >
//                                              <Edit3 size={14} /> Edit
//                                            </button>
//                                          </div>
                   
//                                          <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-right">
//                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                                              Previous CTC
//                                            </p>
//                                            <p className="text-sm font-black text-slate-700">
//                                              ₹{(exp.previous_ctc / 100000).toFixed(2)} LPA
//                                            </p>
//                                          </div>
//                                        </div>
                   
//                                        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
//                                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//                                            <Calendar size={14} /> {exp.start_date} — {exp.end_date}
//                                          </span>
//                                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//                                            <MapPin size={14} /> {exp.location}
//                                          </span>
//                                        </div>
                   
//                                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border-l-2 border-slate-200 italic">
//                                          "{exp.description}"
//                                        </p>
//                                      </div>
//                                    </div>
//                                  ))
//                                ) : (
//                                  <div className="relative pl-12">
//                                    <div className="absolute left-0 w-10 h-10 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
//                                      <Briefcase size={16} className="text-slate-400" />
//                                    </div>
                   
//                                    <div className="bg-white border border-dashed border-slate-300 p-10 rounded-2xl flex flex-col items-center justify-center text-center">
//                                      <div className="p-4 bg-slate-50 rounded-full mb-4">
//                                        <User size={32} className="text-slate-300" />
//                                      </div>
//                                      <h3 className="text-lg font-bold text-slate-800">
//                                        No Professional Experience
//                                      </h3>
//                                      <p className="text-sm text-slate-500 max-w-[280px] mt-1">
//                                        This candidate is currently marked as a{" "}
//                                        <strong>Fresher</strong> or no previous work history has
//                                        been recorded yet.
//                                      </p>
//                                    </div>
//                                  </div>
//                                )}
//                              </div>
                   
//                              {!shouldHideSalaryInsights ? (
//                                <div className="space-y-6">
//                                  <div className="bg-white rounded-3xl p-6 border border-blue-500 text-white shadow-sm relative overflow-hidden">
//                                    <div className="absolute top-0 right-0 p-4 opacity-10">
//                                      <TrendingUp size={80} />
//                                    </div>
                   
//                                    <h3 className="text-lg font-bold mb-6 flex !text-slate-800 items-center gap-2">
//                                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                                      Salary Insights
//                                    </h3>
                   
//                                    <div className="space-y-6 relative z-10">
//                                      <div>
//                                        <p className="!text-slate-800 text-[10px] font-bold uppercase tracking-widest mb-1">
//                                          Average Historic CTC
//                                        </p>
//                                        <p className="text-2xl !text-slate-800 font-black">
//                                          ₹{avgCTC.toLocaleString("en-IN")}
//                                        </p>
//                                      </div>
                   
//                                      <div className="pt-1 border-t border-white/10">
//                                        <p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mb-1">
//                                          Last Drawn (Benchmark)
//                                        </p>
//                                        <p className="text-2xl font-black text-blue-400">
//                                          ₹{lastDrawn.toLocaleString("en-IN")}
//                                        </p>
//                                      </div>
                   
//                                      <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
//                                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">
//                                          Recommended Offer
//                                        </p>
//                                        <p className="text-3xl font-black text-white">
//                                          ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
//                                        </p>
//                                        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
//                                          +20% Market Hike
//                                        </div>
//                                      </div>
//                                    </div>
//                                  </div>
                   
                               
//                                </div>
//                              ) : (
                         
                               
//                                <div className="space-y-6">
//                                  <div className="group relative !bg-white rounded-xl p-8 text-white  overflow-hidden border border-blue-500">
                       
//                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:!bg-blue-500/20 transition-all duration-700" />
                   
                               
//                                    <div className="flex items-center justify-between mb-8">
//                                      <div className="flex items-center gap-3">
//                                        <div className="w-10 h-10 rounded-xl !bg-white border !border-white flex items-center justify-center backdrop-blur-md">
//                                          <span className="w-2 h-2 !bg-blue-500 rounded-full animate-pulse " />
//                                        </div>
//                                        <div>
//                                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 leading-none mb-1.5">
//                                            Offered by Company
//                                          </h3>
//                                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
//                                            Active Salary Structure
//                                          </p>
//                                        </div>
//                                      </div>
                   
                                    
//                                      <div className="p-2 rounded-lg !bg-blue-500/10 border !border-blue-500 !text-blue-500">
//                                        <svg
//                                          xmlns="http://www.w3.org/2000/svg"
//                                          width="14"
//                                          height="14"
//                                          viewBox="0 0 24 24"
//                                          fill="none"
//                                          stroke="currentColor"
//                                          strokeWidth="3"
//                                          strokeLinecap="round"
//                                          strokeLinejoin="round"
//                                        >
//                                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                                        </svg>
//                                      </div>
//                                    </div>
                   
                               
//                                    <div className="space-y-8">
//                                      <div>
//                                        <div className="flex items-end gap-2 mb-1">
//                                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
//                                            Annual Gross CTC
//                                          </p>
//                                        </div>
//                                        <div className="flex items-baseline gap-1">
//                                          <span className="text-xl font-bold text-blue-500">
//                                            ₹
//                                          </span>
//                                          <p className="text-4xl font-black tracking-tight !text-black group-hover:text-emerald-400 transition-colors duration-500">
//                                            {(employee?.offered_ctc || 0).toLocaleString("en-IN")}
//                                          </p>
                                         
//                                        </div>
//                                      </div>
                   
//                    =
//                                      <div className="pt-6 border-t border-white/5 relative">
//                                        <div className="flex justify-between items-center">
//                                          <div>
//                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
//                                              Employment Status
//                                            </p>
//                                            <div className="flex items-center gap-2">
//                                              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
//                                                <p className="text-[11px] font-black text-blue-600 border border-blue-500 rounded-xl px-3 py-1 uppercase tracking-wider">
//                                                  {employee?.status?.replaceAll("_", " ") ||
//                                                    "UNVERIFIED"}
//                                                </p>
//                                              </div>
//                                            </div>
//                                          </div>
                   
                                    
                                        
//                                        </div>
//                                      </div>
//                                    </div>
                   
                              
//                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
//                                  </div>
//                                </div>
//                              )}
//                            </div>
//                          </div>
                   
//               </div>

//             </div>
//           )} */}


// {activeTab === "Experiance" && (
//             <div className="space-y-6 animate-in fade-in duration-500">
//               {/* HEADER SECTION */}
//               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
//                     <History size={24} strokeWidth={2.5} />
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Experiance</h2>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experiance Details of Previous Company</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setDraftExperiences([...draftExperiences, emptyExperience]);
//                     setShowExperienceModal(true);
//                   }}
//                   className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all active:scale-95"
//                 >
//                   <Plus size={14} strokeWidth={3} /> Add Experience
//                 </button>
//               </div>

//               {/* TIMELINE CONTAINER */}
//               <div className="space-y-10 relative before:absolute before:inset-0 before:ml-20 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                
//                 {/* 🔵 CURRENT DEPLOYMENT (GoElectronix) */}
//                 <div className="relative flex items-start group">
//                   <div className="w-20 pt-1 shrink-0">
//                     <p className="text-xl font-black text-blue-600 leading-none">
//                       {new Date(employee.actual_joining_date || employee.joining_date).getFullYear()}
//                     </p>
//                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Current Node</p>
//                   </div>
//                   <div className="absolute left-20 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white z-10 mt-1.5 shadow-sm" />
                  
//                   <div className="flex-1 ml-10 bg-gradient-to-br from-blue-50/40 to-white border border-blue-100 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
//                     <div className="flex justify-between items-start mb-6">
//                       <div>
//                         <span className="px-2 py-0.5 rounded text-[8px] font-black bg-blue-600 text-white uppercase tracking-widest mb-2 inline-block">Active Deployment</span>
//                         <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">GoElectronix Enterprise</h3>
//                         <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{employee.role}</p>
//                       </div>
//                       <div className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Active</div>
//                     </div>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-blue-50">
//                       <MiniField label="Department" value={employee.department_name} />
//                       <MiniField label="Confirm Date" value={formatRegistryDate(employee.confirmation_date)} />
//                       <MiniField label="Status" value={employee.status} isBold />
//                       <MiniField label="Tenure" value={calculateDuration(employee.joining_date)} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ⚪ PAST EXPERIENCES */}
//                 {experiences.length > 0 && experiences[0].company_name !== "" ? (
//                   experiences.map((exp, index) => (
//                     <div key={index} className="relative flex items-start group">
//                       <div className="w-20 pt-1 shrink-0 opacity-60">
//                         <p className="text-xl font-black text-slate-400 leading-none">
//                           {exp.start_date ? new Date(exp.start_date).getFullYear() : "Past"}
//                         </p>
//                       </div>
//                       <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-200 border-2 border-white z-10 mt-2" />
                      
//                       <div className="flex-1 ml-10 bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
//                         <div className="flex justify-between items-start mb-6">
//                           <div>
//                             <h3 className="text-md font-black text-slate-800 uppercase">{exp.company_name}</h3>
//                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.job_title}</p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="px-2 py-1 bg-slate-50 text-slate-500 rounded-md text-[9px] font-black border border-slate-100 flex items-center gap-1">
//                               <Clock size={10} /> {calculateDuration(exp.start_date, exp.end_date)}
//                             </div>
//                             <button onClick={() => handleEditExperience(exp)} className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
//                               <Edit3 size={14} />
//                             </button>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
//                           <MiniField label="Previous CTC" value={`₹${(exp.previous_ctc/100000).toFixed(2)} LPA`} isBold />
//                           <MiniField label="Timeline" value={`${formatRegistryDate(exp.start_date)} - ${formatRegistryDate(exp.end_date)}`} />
//                           <MiniField label="Location" value={exp.location} />
//                         </div>
//                         <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none rotate-12">
//                           <Briefcase size={80} />
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   /* EMPTY STATE */
//                   <div className="relative flex items-start opacity-50">
//                      <div className="w-20 shrink-0" />
//                      <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-100 border-2 border-white z-10 mt-2" />
//                      <div className="flex-1 ml-10 p-8 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-center">
//                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">End of Historical Registry</p>
//                      </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}



//           {activeTab === "Eduction" && (
//   <div className="space-y-6 animate-in fade-in duration-500">
//     {/* HEADER SECTION */}
//     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
//           <Landmark size={24} strokeWidth={2.5} />
//         </div>
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Academic Details</h2>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Education Details</p>
//         </div>
//       </div>
//       <button
//         onClick={() => setShowEducationModal(true)}
//         className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
//       >
//         <Plus size={14} strokeWidth={3} /> Add Qualification
//       </button>
//     </div>

//     {/* TIMELINE CONTAINER */}
//     <div className="space-y-10 relative before:absolute before:inset-0 before:ml-20 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
      
//       {educations.length > 0 ? (
//         educations.map((edu, index) => (
//           <div key={edu.id || index} className="relative flex items-start group">
            
//             {/* 🗓️ LEFT SIDE: YEAR INDICATOR */}
//             <div className="w-20 pt-1 shrink-0">
//               <p className="text-xl font-black text-slate-900 leading-none">
//                 {new Date(edu.end_date).getFullYear()}
//               </p>
//               <p className="text-[8px] font-black text-blue-500 uppercase tracking-tighter mt-1">Completion</p>
//             </div>

//             {/* TIMELINE DOT */}
//             <div className="absolute left-20 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-600 z-10 mt-2 group-hover:scale-125 transition-transform" />

//             {/* 📄 RIGHT SIDE: EDUCATION CARD */}
//             <div className="flex-1 ml-10 bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{edu.institution}</h3>
//                   <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{edu.degree}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
//                      <CheckCircle2 size={12} /> {edu.grade}
//                    </div>
//                    <button className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
//                      <Edit3 size={14} />
//                    </button>
//                 </div>
//               </div>

//               {/* Data Strip */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-50">
//                 <MiniField label="Degree" value={edu.field_of_study} />
//                 <MiniField label="Location" value={edu.location} />
//                 <MiniField label="Duration" value={`${new Date(edu.start_date).getFullYear()} - ${new Date(edu.end_date).getFullYear()}`} />
//                 <MiniField label="Status" value="Verified" />
//               </div>

//               {/* Subtle Background Watermark */}
//               <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none rotate-12">
//                 <Landmark size={100} />
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         /* EMPTY STATE */
//         <div className="ml-20 bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
//            <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
//              <Landmark size={40} />
//            </div>
//            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Academic History Blank</p>
//            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">No educational nodes appended to this profile</p>
//         </div>
//       )}
//     </div>
//   </div>
// )}

//            {activeTab === "Assets" && (
//             <div className="space-y-4">
              
//               <div>
                
//                       {/* Assets SECTION */}
                
//                       <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6">
//                         <AssetManager
//                           previousAssets={previousAssets}
//                           assetRows={assetRows}
//                           onAdd={addAssetRow}
//                           onRemove={removeAssetRow}
//                           onChange={handleAssetChange}
//                           onApiSubmit={handleSubmitAssets}
//                         />
//                       </div>
//               </div>

//             </div>
//           )}

//            {activeTab === "Rules & Policy" && (
//             <div className="space-y-4">
              
//                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-2.5">
//                   <PolicyStepper employeeId={employee.id} />
//                   </div>


//                     <div>
//                        <div className="mt-4 mb-4 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
//                             <h2 className="text-lg font-bold text-slate-900 mb-4">
//                               eSign KYC Verification
//                             </h2>
                    
//                             {/* esign ACCORDION */}
                    
//                             <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
//                               <button
//                                 onClick={() =>
//                                   setOpenVerify(openVerify === "esign" ? null : "esign")
//                                 }
//                                 className="w-full flex justify-between !bg-white items-center px-5 py-4 font-bold !text-slate-500 hover:!bg-slate-50"
//                               >
//                                 <div className="flex items-center gap-3">
//                                   <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
//                                   eSign Verification
//                                 </div>
//                                 <span>{openVerify === "esign" ? "−" : "+"}</span>
//                               </button>
                    
//                               {openVerify === "esign" && (
//                                 <div className="p-6 bg-slate-50/40 border-t">
//                                   {console.log("ssssss", isEsignSigned)}
                    
//                                   {/* ================= VERIFIED VIEW ================= */}
//                                   {isEsignSigned && (
//                                     <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//                                       {/* Left Info */}
//                                       <div className="space-y-4">
//                                         <div>
//                                           <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
//                                             eSign Status
//                                           </p>
//                                           <p className="text-xl font-black text-emerald-600">
//                                             SIGNED
//                                           </p>
//                                         </div>
                    
//                                         <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                                           <div>
//                                             <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                                               Verification ID
//                                             </p>
//                                             <p className="text-sm font-semibold text-slate-700">
//                                               #{latestEsign.verification_id}
//                                             </p>
//                                           </div>
                    
//                                           <div>
//                                             <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                                               Last Updated
//                                             </p>
//                                             <p className="text-sm font-semibold text-slate-700">
//                                               {new Date(
//                                                 latestEsign.updated_at,
//                                               ).toLocaleDateString()}
//                                             </p>
//                                           </div>
//                                         </div>
                    
//                                         {latestEsign.signed_doc_url && (
//                                           <button
//                                             onClick={() =>
//                                               window.open(latestEsign.signed_doc_url, "_blank")
//                                             }
//                                             className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
//                                           >
//                                             <Download size={14} /> Download Signed Document
//                                           </button>
//                                         )}
//                                       </div>
                    
//                                       {/* Premium Badge */}
//                                       <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
//                                         <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />
//                                         <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                                           <CheckCircle2 size={32} className="text-white" />
//                                         </div>
//                                         <h4 className="mt-4 text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                                           Verified
//                                         </h4>
//                                       </div>
//                                     </div>
//                                   )}
                    
//                                   {/* ================= LINK GENERATED ================= */}
//                                   {!isEsignSigned && isEsignLinkGenerated && (
//                                     <div className="flex flex-col items-center justify-center text-center py-10">
//                                       <Clock size={40} className="text-amber-500 mb-3" />
//                                       <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">
//                                         Awaiting Signature
//                                       </h3>
//                                       <p className="text-xs text-slate-500 mt-2 max-w-sm">
//                                         The eSign link has been generated and sent to the employee.
//                                         Waiting for Aadhaar-based signature completion.
//                                       </p>
//                                     </div>
//                                   )}
                    
//                                   {!isEsignSigned && isEsignDocumentUploaded && (
//                                     <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
//                                       <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//                                         {/* Visual Status Indicator */}
//                                         <div className="relative flex-shrink-0">
//                                           <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
//                                             <svg
//                                               xmlns="http://www.w3.org/2000/svg"
//                                               width="32"
//                                               height="32"
//                                               viewBox="0 0 24 24"
//                                               fill="none"
//                                               stroke="currentColor"
//                                               strokeWidth="1.5"
//                                               strokeLinecap="round"
//                                               strokeLinejoin="round"
//                                               className="text-blue-500"
//                                             >
//                                               <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
//                                               <path d="M14 2v4a2 2 0 0 0 2 2h4" />
//                                               <path d="M9 15l2 2 4-4" />
//                                             </svg>
//                                           </div>
//                                           <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center shadow-sm">
//                                             <svg
//                                               xmlns="http://www.w3.org/2000/svg"
//                                               width="14"
//                                               height="14"
//                                               viewBox="0 0 24 24"
//                                               fill="none"
//                                               stroke="currentColor"
//                                               strokeWidth="3"
//                                               strokeLinecap="round"
//                                               strokeLinejoin="round"
//                                               className="text-white animate-spin-slow"
//                                             >
//                                               <path d="M12 2v4" />
//                                               <path d="M12 18v4" />
//                                               <path d="M4.93 4.93l2.83 2.83" />
//                                               <path d="M16.24 16.24l2.83 2.83" />
//                                               <path d="M2 12h4" />
//                                               <path d="M18 12h4" />
//                                               <path d="M4.93 19.07l2.83-2.83" />
//                                               <path d="M16.24 7.76l2.83-2.83" />
//                                             </svg>
//                                           </div>
//                                         </div>
                    
//                                         {/* Content Section */}
//                                         <div className="flex-1 text-center md:text-left space-y-4">
//                                           <div>
//                                             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
//                                               <h3 className="text-lg font-bold text-slate-900">
//                                                 Final Step: Complete eSign
//                                               </h3>
//                                               <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">
//                                                 Pending Action
//                                               </span>
//                                             </div>
//                                             <p className="text-sm text-slate-500 leading-relaxed max-w-md">
//                                               Your document has been securely processed and is ready
//                                               for signature. Please complete the Aadhaar-based eSign
//                                               to finalize the agreement.
//                                             </p>
//                                           </div>
                    
//                                           {/* Informational Micro-card */}
//                                           <div className="inline-flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
//                                             <div className="flex items-center gap-3 pr-4 md:border-r border-slate-100">
//                                               <div className="w-2 h-2 rounded-full bg-emerald-500" />
//                                               <span className="text-[12px] font-semibold text-slate-600">
//                                                 Document Uploaded
//                                               </span>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                               <svg
//                                                 className="w-4 h-4 text-slate-400"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                               >
//                                                 <path
//                                                   strokeLinecap="round"
//                                                   strokeLinejoin="round"
//                                                   strokeWidth="2"
//                                                   d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                                                 />
//                                               </svg>
//                                               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
//                                                 Verified Secure Vault
//                                               </span>
//                                             </div>
//                                           </div>
//                                         </div>
                    
//                                         {/* Primary Action */}
//                                       </div>
//                                     </div>
//                                   )}
                    
//                                   {/* ================= UPLOAD FLOW ================= */}
                    
//                                   {/* ================= AADHAAR INPUT ================= */}
                    
//                                   <div className="max-w-xl">
//                                     {!latestEsign && !documentId && (
//                                       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                                         {/* SECTION HEADER */}
//                                         <div className="space-y-1">
//                                           <h4 className="text-sm font-bold text-slate-500">
//                                             Upload E-Sign Document
//                                           </h4>
//                                           <p className="text-xs text-slate-500">
//                                             Supported formats: PDF (Max 5MB)
//                                           </p>
//                                         </div>
                    
//                                         {/* DROPZONE AREA */}
//                                         <div className="relative group">
//                                           <input
//                                             type="file"
//                                             id="esign-upload"
//                                             onChange={(e) => setEsignFile(e.target.files[0])}
//                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                                           />
//                                           <div
//                                             className={`
//                               border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center text-center
//                               ${esignFile ? "!border-blue-500 bg-indigo-50/30" : "border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300"}
//                             `}
//                                           >
//                                             <div
//                                               className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${esignFile ? "bg-indigo-600 scale-110" : "bg-white shadow-sm"}`}
//                                             >
//                                               {esignFile ? (
//                                                 <svg
//                                                   className="w-7 h-7 text-white"
//                                                   fill="none"
//                                                   stroke="currentColor"
//                                                   strokeWidth="2.5"
//                                                   viewBox="0 0 24 24"
//                                                 >
//                                                   <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M5 13l4 4L19 7"
//                                                   />
//                                                 </svg>
//                                               ) : (
//                                                 <svg
//                                                   className="w-7 h-7 text-slate-400 group-hover:text-indigo-500"
//                                                   fill="none"
//                                                   stroke="currentColor"
//                                                   strokeWidth="2"
//                                                   viewBox="0 0 24 24"
//                                                 >
//                                                   <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
//                                                   />
//                                                 </svg>
//                                               )}
//                                             </div>
                    
//                                             {esignFile ? (
//                                               <div className="space-y-1">
//                                                 <p className="text-sm font-bold text-slate-800">
//                                                   {esignFile.name}
//                                                 </p>
//                                                 <p className="text-[11px] font-medium text-slate-500">
//                                                   {(esignFile.size / (1024 * 1024)).toFixed(2)} MB •
//                                                   Ready to verify
//                                                 </p>
//                                               </div>
//                                             ) : (
//                                               <p className="text-sm font-medium text-slate-600">
//                                                 <span className="!text-blue-600 font-bold">
//                                                   Click to upload
//                                                 </span>{" "}
//                                                 or drag and drop
//                                               </p>
//                                             )}
//                                           </div>
//                                         </div>
                    
//                                         {/* ACTIONS */}
//                                         <button
//                                           onClick={uploadEsignDocument}
//                                           disabled={uploading || !esignFile}
//                                           className="w-full md:w-auto border !border-blue-600 px-10 h-12 !bg-white !text-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center gap-2"
//                                         >
//                                           {uploading ? (
//                                             <>
//                                               <svg
//                                                 className="animate-spin h-4 w-4 text-white"
//                                                 viewBox="0 0 24 24"
//                                               >
//                                                 <circle
//                                                   className="opacity-25"
//                                                   cx="12"
//                                                   cy="12"
//                                                   r="10"
//                                                   stroke="currentColor"
//                                                   strokeWidth="4"
//                                                 />
//                                                 <path
//                                                   className="opacity-75"
//                                                   fill="currentColor"
//                                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                                 />
//                                               </svg>
//                                               Processing...
//                                             </>
//                                           ) : (
//                                             "Upload & Continue"
//                                           )}
//                                         </button>
//                                       </div>
//                                     )}
                    
//                                     {/* ================= AADHAAR INPUT SECTION ================= */}
//                                     {!isEsignSigned &&
//                                       documentId &&
//                                       !isEsignLinkGenerated &&
//                                       esignStatus !== "document_uploaded" && (
//                                         <div className="mt-8 space-y-5 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
//                                           <div className="flex items-center gap-3">
//                                             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
//                                               <svg
//                                                 width="18"
//                                                 height="18"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 strokeWidth="2.5"
//                                                 viewBox="0 0 24 24"
//                                               >
//                                                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                                               </svg>
//                                             </div>
//                                             <h4 className="text-sm font-bold text-slate-800">
//                                               Confirm Identity
//                                             </h4>
//                                           </div>
                    
//                                           <div className="space-y-2">
//                                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
//                                               Aadhaar Last 4 Digits
//                                             </label>
//                                             <div className="flex flex-col sm:flex-row gap-4">
//                                               <input
//                                                 type="text"
//                                                 maxLength={4}
//                                                 placeholder="••••"
//                                                 value={aadhaarLast4}
//                                                 onChange={(e) =>
//                                                   setAadhaarLast4(e.target.value.replace(/\D/g, ""))
//                                                 }
//                                                 className="w-full sm:w-44 h-12 text-center tracking-[0.5em] text-xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
//                                               />
//                                               <button
//                                                 onClick={submitAadhaar}
//                                                 disabled={aadhaarLast4.length < 4}
//                                                 className="flex-1 sm:flex-none px-8 h-12 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 shadow-lg shadow-emerald-100 disabled:shadow-none"
//                                               >
//                                                 Submit Details
//                                               </button>
//                                             </div>
//                                             <p className="text-[10px] text-slate-500 flex items-center gap-1.5 ml-1">
//                                               <svg
//                                                 width="12"
//                                                 height="12"
//                                                 fill="currentColor"
//                                                 viewBox="0 0 20 20"
//                                               >
//                                                 <path
//                                                   fillRule="evenodd"
//                                                   d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                                                   clipRule="evenodd"
//                                                 />
//                                               </svg>
//                                               Secure end-to-end encrypted verification
//                                             </p>
//                                           </div>
//                                         </div>
//                                       )}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                   </div>

//             </div>
//           )}

//       {activeTab === "Interviews" && (
//   <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
    
//     {/* 🏆 OVERALL VERDICT & INTERVIEWER CARD */}
//     <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
//         {/* 1. Performance Data (Left) */}
//         <div className="lg:col-span-7 space-y-6">
//           <div className="flex items-center gap-3">
//              <span className="px-4 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100 flex items-center gap-2">
//                <Activity size={12} /> Strong Pass
//              </span>
//           </div>
          
//           <div className="flex items-baseline gap-2">
//             <span className="text-5xl font-black text-slate-900 tracking-tighter">80</span>
//             <span className="text-xl font-bold text-slate-400">/100</span>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Overall Performance</p>
//           </div>

//           <div className="pt-6 border-t border-slate-50">
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Reviewer Remarks</p>
//             <p className="text-sm font-medium text-slate-600 italic leading-relaxed bg-slate-50/50 p-5 rounded-2xl border !border-slate-100 border-dashed">
//                "{employee?.reviews?.[0]?.comments || "Candidate demonstrates exceptional problem-solving skills and cultural alignment."}"
//             </p>
//           </div>
//         </div>

//         {/* 2. Interviewer Details & Matrix (Right) */}
//         <div className="lg:col-span-5 flex flex-col gap-6">
//            {/* 👤 INTERVIEWER IDENTITY BOX */}
//            <div className="bg-white rounded-3xl p-6 text-white border border-blue-500 shadow-sm shadow-blue-200 relative overflow-hidden">
//               <div className="relative z-10">
//                 {/* <p className="text-[8px] font-black !text-blue-600  uppercase tracking-[0.2em] mb-4 text-center">Primary Assessor</p> */}
//                 <div className="flex items-center gap-4">
//                   <div className="h-12 w-12 rounded-2xl !bg-white backdrop-blur-md flex items-center border !border-blue-500 justify-center !text-blue-600 font-black">
//                     {employee?.reporting_manager_name?.substring(0, 2) || "HR"}
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-black !text-blue-600  uppercase tracking-tight">{employee?.reporting_manager_name || "Assessor Unassigned"}</h4>
//                     <p className="text-[10px] !text-blue-600  font-bold uppercase">{employee?.role || "Panel Lead"}</p>
//                   </div>
//                 </div>
//                 <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <span className="text-[7px] font-black !text-blue-400 uppercase tracking-widest block">Contact Node</span>
//                     <span className="text-[10px] !text-blue-600  font-bold block">{employee?.phone || "Registry Locked"}</span>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-[7px] font-black !text-blue-600  uppercase tracking-widest block">Assessed On</span>
//                     <span className="text-[10px] !text-blue-600  font-bold block">{formatRegistryDate(employee?.reviews?.[0]?.reviewed_at) || "March 12, 2026"}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute top-0 right-0 p-4 opacity-10"><UserCheck size={80} /></div>
//            </div>

//            {/* METRICS Matrix */}
//            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 space-y-4">
//              <MetricRow label="Technical" value={10} color="bg-blue-500" />
//              <MetricRow label="Communication" value={3} color="bg-indigo-400" />
//              <MetricRow label="Logic" value={10} color="bg-blue-600" />
//            </div>
//         </div>
//       </div>
//     </div>

//     {/* PHASES TIMELINE */}
//  <div className="space-y-4">
//   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
//    Interview 
//   </h3>

//   {/* 🟢 PHASE 1: INITIAL SCREENING */}
//   <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between group hover:border-blue-300 transition-all shadow-sm">
//     <div className="flex items-center gap-4">
//       {/* Round Indicator */}
//       <div className="relative shrink-0">
//         <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
//           01
//         </div>
//         <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
//       </div>

//       <div>
//         <div className="flex items-center gap-2">
//           <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
//             Phase 1: Round 1
//           </h4>
//           <span className="text-[7px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
//             Level 0
//           </span>
//         </div>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
//           Admin Level Assessment • Verified on {formatRegistryDate(employee?.created_at)}
//         </p>
//       </div>
//     </div>

//     {/* Status & Metadata */}
//     <div className="mt-4 md:mt-0 flex items-center gap-6 self-end md:self-center">
//       <div className="text-right hidden sm:block">
//         <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Verified By</p>
//         <p className="text-[10px] font-bold text-slate-600 uppercase">System Admin</p>
//       </div>
//       <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-xl border border-emerald-100 shadow-sm flex items-center gap-1.5">
//         <CheckCircle2 size={12} strokeWidth={3} /> Verified
//       </span>
//     </div>
//   </div>

//   {/* 🔵 PHASE 2: (Optional Placeholder for continuity) */}
//   {/* <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-5 flex items-center justify-between opacity-60">
//     <div className="flex items-center gap-4">
//       <div className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-sm font-black text-slate-300 italic">
//         02
//       </div>
//       <div>
//         <h4 className="text-xs font-black text-slate-400 uppercase tracking-tight">
//           Phase 2: Technical Interview
//         </h4>
//         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Awaiting Panel Assignment</p>
//       </div>
//     </div>
//     <span className="px-3 py-1 text-slate-400 text-[9px] font-black uppercase tracking-widest">Pending</span>
//   </div> */}
// </div>
//   </div>
// )}

//          {/* {activeTab === "Document Centre" && (
//             <div className="space-y-4 animate-in fade-in duration-300">
              
         
//               <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200">
//                 {["Personal", "Official"].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setDocSubTab(tab)}
//                     className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
//                       docSubTab === tab 
//                         ? "!bg-white !text-blue-600 shadow-sm" 
//                         : "!bg-transparent !text-slate-500 hover:!text-slate-700"
//                     }`}
//                   >
//                     {tab} 
//                   </button>
//                 ))}
//               </div>

       
//               {docSubTab === "Personal" && (
//                 <div className="bg-transparent rounded-xl p-1  animate-in slide-in-from-left-2 duration-300">
              

          
//                         <div className="w-full mb-4 mt-0 p-1 md:p-1 lg:p-1 flex justify-center">
//                           <div className="w-full  flex flex-col gap-8">
                  
                         
//                             <div className="relative group transition-all duration-500">
                         
//                               <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
                  
                          
                            
//                               <div className="relative bg-white/80 rounded-xl  overflow-hidden">
                          
//                                 <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-900/5 pointer-events-none"></div>
                  
//                                 <DocumentSubmissionUI
//                                   employeeId={employee.id}
//                                   status={employee.doc_submission_status}
//                                   submissionDate={employee.doc_date}
//                                   remarks={employee.doc_remarks}
//                                   onDocumentSubmit={handleSubmission}
//                                   employee={employee}
//                                   employeedata={offerProfile}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-2.5">
//                     <AllkycVerified />
//                   </div>
//                 </div>
//               )}

             
//               {docSubTab === "Official" && (
//                 <div className="bg-transparent  rounded-xl p-1 animate-in slide-in-from-right-2 duration-300">
                 

//                   <div>
                    
//                           <div>
//                             {![
//                               "offer_accepted",
//                               "confirmed",
//                               "joining_letter",
//                               "extended",
//                               "on_probation",
//                               "probation_review",
//                             ].includes(localStatus) ? (
//                               <OfferLatter
//                                 employee={employee}
//                                  setParentStatus={setLocalStatus}
//                                 fetchEmployee={fetchEmployee}
//                                 recommendedCtc={Math.round(suggestedCTC)}
//                               />
//                             ) : (
//                               <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-0 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
                        
//                                 <div className="flex items-center w-full lg:w-auto">
                             
//                                   <div className="flex-shrink-0 h-14 w-14 rounded-xl !bg-white border !border-blue-100 flex items-center justify-center !text-blue-600 shadow-sm">
//                                     <FileText size={24} strokeWidth={1.5} />
//                                   </div>
                    
//                                   <div className="ml-4 flex flex-col gap-1">
//                                     <div className="flex items-center gap-2">
//                                       <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
//                                         {employee?.full_name || "-"}
//                                       </h3>
//                                       <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                                     </div>
                    
                               
//                                     <div className="flex items-center gap-6 mt-1">
//                                       <div className="flex flex-col">
//                                         <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                                           Designation
//                                         </span>
//                                         <span className="text-[12px] text-slate-600 font-medium">
//                                           {employee?.role || "-"}
//                                         </span>
//                                       </div>
                    
//                                       <div className="h-6 w-[1px] bg-slate-100"></div>
                    
//                                       <div className="flex flex-col">
//                                         <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                                           Offer Amount
//                                         </span>
//                                         <span className="text-[12px] text-slate-900 font-mono font-bold">
//                                           ₹{employee?.offered_ctc || "-"}
//                                           <span className="text-[10px] text-slate-400 ml-0.5">
//                                             /annum
//                                           </span>
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
                    
                           
//                                 <div className="mt-5 lg:mt-0 w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-end gap-4">
                            
                    
//                     {latestOfferLetter?.document?.document_path ? (
//         <button
//           onClick={() => window.open(latestOfferLetter?.document?.document_path, "_blank")}
//           className="flex items-center gap-2 px-4 py-2 !bg-white border !border-slate-200 !text-slate-700 hover:!text-blue-600 hover:!border-blue-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
//         >
//           <Download size={14} strokeWidth={2.5} />
//           Download
//         </button>
//       ) : (
//         <span className="text-[10px] font-bold text-slate-400 italic">No Letter Found</span>
//       )}

//                                   <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>
                    
                            
//                                   <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-100/50 text-emerald-600 shadow-lg shadow-emerald-600/10">
//                                     <CheckCircle2 size={16} strokeWidth={3} />
//                                     <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                                       Completed
//                                     </span>
//                                   </div>
//                                 </div>
                    
                              
//                                 <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
//                                   <CheckCircle2 size={80} />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
                    
                    
//                           <div>
                        
//                             {employee?.status === "offer_accepted" && (
//                               <JoiningDispatchUI employee={employee}  fetchEmployee={fetchEmployee}  />
//                             )}
                    
                   
//                             {["confirmed", "on_probation" , "probation_review"].includes(employee?.status) && (
//                               <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 mb-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
                           
//                                 <div className="flex items-center w-full lg:w-auto">
                        
//                                   <div className="flex-shrink-0 h-14 w-14 rounded-xl !bg-white border !border-blue-100 flex items-center justify-center !text-blue-600 shadow-sm">
//                                     <FileCheck size={28} strokeWidth={1.5} />
//                                   </div>
                    
//                                   <div className="ml-5 flex flex-col gap-2">
//                                     <div className="flex items-center gap-2">
//                                       <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
//                                         Joining Formalities
//                                       </h3>
//                                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 uppercase tracking-wider">
//                                         Confirmed
//                                       </span>
//                                     </div>
                    
                               
//                                     <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
                                 
//                                       <div className="flex items-center gap-2.5">
//                                         <div className="p-1.5 bg-slate-50 rounded-md">
//                                           <Calendar size={14} className="text-slate-400" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                           <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
//                                             Joining Date
//                                           </span>
//                                           <span className="text-[12px] text-slate-700 font-semibold">
//                                             {employee?.joining_date
//                                               ? new Date(
//                                                   employee.joining_date,
//                                                 ).toLocaleDateString("en-IN", {
//                                                   day: "numeric",
//                                                   month: "short",
//                                                   year: "numeric",
//                                                 })
//                                               : "-"}
//                                           </span>
//                                         </div>
//                                       </div>
                    
                                  
//                                       <div className="flex items-center gap-2.5">
//                                         <div className="p-1.5 bg-slate-50 rounded-md">
//                                           <UserCheck size={14} className="text-slate-400" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                           <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
//                                             Reporting To
//                                           </span>
//                                           <span className="text-[12px] text-slate-700 font-semibold">
//                                             {employee?.reporting_manager_name}{" "}
//                                             <span className="text-slate-400 font-normal text-[11px]">
//                                               (VP Ops)
//                                             </span>
//                                           </span>
//                                         </div>
//                                       </div>
                    
                                 
//                                       <div className="flex items-center gap-2.5">
//                                         <div className="p-1.5 bg-slate-50 rounded-md">
//                                           <Clock size={14} className="text-slate-400" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                           <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
//                                             Reporting Time
//                                           </span>
//                                           <span className="text-[12px] text-slate-700 font-semibold">
//                                             {employee?.joining_time || "-"}{" "}
//                                             <span className="text-slate-400 font-normal text-[11px]">
//                                               (IST)
//                                             </span>
//                                           </span>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
                    
                           
//                                 <div className="mt-6 lg:mt-0 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                                
//                                   <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>
                    
                                  
//                                   <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-100/50 text-emerald-600 shadow-md shadow-emerald-600/20">
//                                     <CheckCircle2 size={18} strokeWidth={2.5} />
//                                     <div className="flex flex-col items-start leading-none">
//                                       <span className="text-[10px] font-black uppercase tracking-[1.5px]">
                                 
//                                         Joining Letter Send
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
                    
                              
//                                 <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
//                                   <FileCheck size={120} />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                   </div>


                

//       {employee?.doc_submission_status === "submitted" && (
//         <div className="mb-4">
//           <JoiningConfirmationUI employee={employee} />
//         </div>
//       )}
//                 </div>
//               )}

             

//             </div>
//           )} */}


// {activeTab === "Document Centre" && (
//   <div className="space-y-4 animate-in fade-in duration-100">
    
//     {/* 🛠️ SUB-TAB NAVIGATION */}
//     <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200">
//       {["Personal", "Official"].map((tab) => (
//         <button
//           key={tab}
//           onClick={() => setDocSubTab(tab)}
//           className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase  !bg-transparent tracking-wider transition-all ${
//             docSubTab === tab 
//               ? "!bg-white !text-blue-600 shadow-sm border !border-slate-200" 
//               : "!text-slate-500 hover:!text-slate-700 !bg-transparent"
//           }`}
//         >
//           {tab} 
//         </button>
//       ))}
//     </div>

//     {/* 📂 TABLE CONTAINER */}
//     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//       <table className="w-full text-left border-collapse">
//         <thead className="bg-slate-50 border-b border-slate-100">
//           <tr>
//             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
//             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
//             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Attachment</th>
//             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-50">
//           {Object.values(
//             (employee?.documents || []).reduce((acc, doc) => {
//               const personalTypes = ["address_proof_current", "address_proof_permanent", "photo", "previous_offer_letter", "fitness_certificate", "family_photo", "pan", "bank", "aadhaar"];
//               const officialTypes = ["appointment_letter", "joining_letter", "goex_offer_letter"];
              
//               const isMatch = docSubTab === "Personal" 
//                 ? personalTypes.includes(doc.document_type) 
//                 : officialTypes.includes(doc.document_type);

//               if (isMatch) {
//                 // Ensure we pick the LATEST document if duplicates exist
//                 if (!acc[doc.document_type] || doc.id > acc[doc.document_type].id) {
//                   acc[doc.document_type] = doc;
//                 }
//               }
//               return acc;
//             }, {})
//           ).map((doc) => (
//             <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
//               <td className="px-6 py-4">
//                 <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">
//                   {doc?.document_type?.replaceAll("_", " ") || "Unnamed Document"}
//                 </p>
//               </td>
//               <td className="px-6 py-4">
//                 <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
//                   {doc?.document_path?.includes('.') ? doc.document_path.split('.').pop().toUpperCase() : 'FILE'}
//                 </span>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex justify-center">
//                   {doc?.document_path ? (
//                     <div 
//                       onClick={() => window.open(doc.document_path, "_blank")}
//                       className="w-8 h-10 bg-slate-50 border border-slate-100 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all shadow-sm"
//                     >
//                       <FileText size={14} className="!text-slate-500" />
//                       <span className="text-[7px] font-black text-slate-600 uppercase font-mono">Latest</span>
//                     </div>
//                   ) : (
//                     <div className="w-8 h-10 !bg-slate-50 border !border-slate-100 rounded flex items-center justify-center opacity-40">
//                        <FileText size={14} className="!text-slate-300" />
//                     </div>
//                   )}
//                 </div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex items-center justify-end gap-3">
//                   {doc?.document_path && (
//                     <>
//                       <button 
//                         onClick={() => window.open(doc.document_path, "_blank")}
//                         className="p-2 !text-slate-400 hover:!text-blue-600 hover:!bg-blue-50 !bg-transparent rounded-lg transition-all bg-transparent border-0 outline-none"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button 
//                         onClick={() => window.open(doc.document_path, "_blank")}
//                         className="p-2 !text-slate-400 hover:!text-emerald-600 hover:bg-emerald-50 !bg-transparent rounded-lg transition-all  border-0 outline-none"
//                       >
//                         <Download size={18} />
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ⚠️ EMPTY STATE: If no documents match the sub-tab category */}
//       {Object.keys(documents || {}).length === 0 && (
//         <div className="p-20 text-center flex flex-col items-center justify-center">
//            <ShieldAlert size={32} className="text-slate-200 mb-2" />
//            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Documents Found</p>
//         </div>
//       )}
//     </div>
//   </div>
// )}

//           {["Attendance", "Salary Overview", "Salary Structure", "Loans", "Leave(s)", "Expense Claims"].includes(activeTab) && (
//             <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center">
//                <div className="p-3 bg-slate-50 rounded-full mb-3">
//                  <FileText size={20} className="text-slate-300" />
//                </div>
//                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">{activeTab} Details</h3>
//                <p className="text-[9px] text-slate-500 font-medium">Data module integration pending for this tab.</p>
//             </div>
//           )}

//          {["Profile", "Experiance", "Assets" , "Rules & Policy" , "Document Centre", ].includes(activeTab) && (
//     <>
//     {REVIEW_ALERT_CONFIG[employee?.status] && (
//             <div className="mb-4 mt-4 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
//               <div className="flex flex-col md:flex-row items-center justify-between p-6 lg:px-8">
//                 {/* LEFT SIDE: Alert Content */}
//                 <div className="flex items-center gap-5">
//                   <div className="flex-shrink-0">
//                     <div className="relative">
//                       <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
//                         <History size={28} className="animate-pulse" />
//                       </div>
//                       {/* Pulsing indicator */}
//                       <span className="absolute -top-1 -right-1 flex h-4 w-4">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
//                       </span>
//                     </div>
//                   </div>
    
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
//                         Priority
//                       </span>
//                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//                         Probation Period Concluding
//                       </h3>
//                     </div>
//                     <p className="text-sm text-slate-600 font-medium">
//                       This employee's probation phase ends in{" "}
//                       <span className="text-blue-700 font-black">7 days</span>.
//                       Please conduct the final performance review.
//                     </p>
//                   </div>
//                 </div>
    
//                 {/* RIGHT SIDE: Action Button */}
//                 <div className="mt-4 md:mt-0 flex items-center gap-4">
//                   {/* Simple count-down visual */}
//                   <div className="hidden lg:flex flex-col items-end mr-4">
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
//                       Review Deadline
//                     </span>
//                   </div>
    
//                   <button
//                     onClick={() => navigate(`/dummyemp/${id}/review`)}
//                     className="flex items-center gap-2 px-8 py-3.5 border-2 border-blue-500 !bg-white hover:!bg-white !text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/10 active:scale-95 group"
//                   >
//                     <FileCheck
//                       size={16}
//                       className="group-hover:rotate-6 transition-transform"
//                     />
//                     Conduct Review Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//     </>
//   )}

//         </div>
//       </div>

//       {/* --- MODALS (Eye-catching & High Density) --- */}
//       {showAddressModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
          
//           <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            
//             {/* COMPACT HEADER */}
//             <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
//               <div className="flex items-center gap-2">
//                 <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                 <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase">Update Address</h2>
//               </div>
//               <button onClick={() => setShowAddressModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
//                 <XCircle size={16} strokeWidth={2.5} />
//               </button>
//             </div>
            
//             {/* TIGHT SCROLLABLE BODY */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
              
//               {/* CURRENT ADDRESS BLOCK */}
//               <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><MapPin size={12} strokeWidth={2.5} /></div>
//                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Current Residence</h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2.5">
//                   <div className="col-span-2"><Input label="Address Line 1" value={addressForm.current_address_line1} onChange={(v) => setAddressForm({...addressForm, current_address_line1: v})} /></div>
//                   <div className="col-span-2"><Input label="Address Line 2" value={addressForm.current_address_line2} onChange={(v) => setAddressForm({...addressForm, current_address_line2: v})} /></div>
                  
//                   {/* Auto-Fill Triggers from Pincode */}
//                   <Input label="Pincode" value={addressForm.current_pincode} onChange={(v) => handlePincodeChange('current', v)} loading={fetchingPin.current} />
//                   <Input label="City / Area" value={addressForm.current_city} onChange={(v) => setAddressForm({...addressForm, current_city: v})} options={cityOptions.current} disabled={cityOptions.current.length === 0 && !addressForm.current_city} />
                  
//                   <Input label="District" value={addressForm.current_district} disabled />
//                   <Input label="State" value={addressForm.current_state} disabled />
//                   <div className="col-span-2"><Input label="Country" value={addressForm.current_country} disabled /></div>
//                 </div>
//               </div>

//               {/* PERMANENT ADDRESS BLOCK */}
//               <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
//                 <div className="flex justify-between items-center mb-1">
//                   <div className="flex items-center gap-2">
//                     <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><Home size={12} strokeWidth={2.5} /></div>
//                     <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Permanent Residence</h3>
//                   </div>
                  
//                   {/* SLEEK SYNC BADGE CHECKBOX */}
//                   <label className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
//                     <input 
//                       type="checkbox" 
//                       className="w-3 h-3 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer" 
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setAddressForm({
//                             ...addressForm,
//                             permanent_address_line1: addressForm.current_address_line1,
//                             permanent_address_line2: addressForm.current_address_line2,
//                             permanent_pincode: addressForm.current_pincode,
//                             permanent_city: addressForm.current_city,
//                             permanent_district: addressForm.current_district,
//                             permanent_state: addressForm.current_state,
//                             permanent_country: addressForm.current_country,
//                           });
//                           // Sync dropdown options too
//                           setCityOptions(prev => ({ ...prev, permanent: prev.current }));
//                         }
//                       }} 
//                     />
//                     <span className="text-[9px] font-black text-slate-500 group-hover:text-blue-600 uppercase tracking-widest transition-colors">Save As Current</span>
//                   </label>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2.5">
//                   <div className="col-span-2"><Input label="Address Line 1" value={addressForm.permanent_address_line1} onChange={(v) => setAddressForm({...addressForm, permanent_address_line1: v})} /></div>
//                   <div className="col-span-2"><Input label="Address Line 2" value={addressForm.permanent_address_line2} onChange={(v) => setAddressForm({...addressForm, permanent_address_line2: v})} /></div>
                  
//                   <Input label="Pincode" value={addressForm.permanent_pincode} onChange={(v) => handlePincodeChange('permanent', v)} loading={fetchingPin.permanent} />
//                   <Input label="City / Area" value={addressForm.permanent_city} onChange={(v) => setAddressForm({...addressForm, permanent_city: v})} options={cityOptions.permanent} disabled={cityOptions.permanent.length === 0 && !addressForm.permanent_city} />
                  
//                   <Input label="District" value={addressForm.permanent_district} disabled />
//                   <Input label="State" value={addressForm.permanent_state} disabled />
//                   <div className="col-span-2"><Input label="Country" value={addressForm.permanent_country} disabled /></div>
//                 </div>
//               </div>
//             </div>

//             {/* COMPACT FOOTER */}
//             <div className="px-5 py-3 border-t border-slate-100 bg-white flex justify-end gap-2 sticky bottom-0 z-20">
//               <button 
//                 onClick={() => setShowAddressModal(false)} 
//                 className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={async () => {
//                   try {
//                     await toast.promise(
//                       (async () => {
//                         if (address) return await employeeAddressService.update(id, addressForm);
//                         return await employeeAddressService.create(id, addressForm);
//                       })(),
//                       { loading: "Saving...", success: "Address saved! ✅", error: "Failed ❌" }
//                     );
//                     setShowAddressModal(false);
//                     // Fetch directly instead of using fetchAddress so the modal updates immediately
//                     fetchAddress(); 
//                   } catch (err) { console.error(err); }
//                 }} 
//                 className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 active:scale-95"
//               >
//                 <Save size={12} strokeWidth={2.5} /> {address ? "Sync Updates" : "Save Details"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* 📝 PROFILE EDIT MODAL */}
//        {showProfileModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowProfileModal(false)} />
          
//           <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            
//             <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
//               <div className="flex items-center gap-2">
//                 <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//                 <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase">Update Profile</h2>
//               </div>
//               <button onClick={() => setShowProfileModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
//                 <XCircle size={16} strokeWidth={2.5} />
//               </button>
//             </div>
            
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
      
//               <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><User size={12} strokeWidth={2.5} /></div>
//                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Primary Details</h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2.5">
//                   <div className="col-span-2 md:col-span-1"><Input label="Full Name" value={profileForm.full_name} onChange={(v) => setProfileForm({...profileForm, full_name: v})} /></div>
//                   <div className="col-span-2 md:col-span-1"><Input label="Role / Designation" value={profileForm.role} onChange={(v) => setProfileForm({...profileForm, role: v})} /></div>
                  
                
//                   <div className="flex flex-col gap-1 relative group col-span-2 md:col-span-1">
//                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Department</label>
//                     <div className="relative">
//                       <select
//                         value={profileForm.department_id}
//                         onChange={(e) => setProfileForm({...profileForm, department_id: e.target.value})}
//                         className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
//                       >
//                         <option value="">Select Department</option>
//                        {departments.map((dept) => (
//   <option key={dept.id} value={dept.id}>
//     {dept.department_name || dept.name}
//   </option>
// ))}
//                       </select>
//                       <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                     </div>
//                   </div>

                 
//                   <div className="flex flex-col gap-1 relative group col-span-2 md:col-span-1">
//                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reporting Manager</label>
//                     <div className="relative">
//                       <select
//                         value={profileForm.reporting_manager_name}
//                         onChange={(e) => setProfileForm({...profileForm, reporting_manager_name: e.target.value})}
//                         className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
//                       >
//                         <option value="">Select Manager</option>
//                         {managers.map((mgr) => (
//                           <option key={mgr.id} value={mgr.full_name}>
//                             {mgr.full_name} ({mgr.employee_code})
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

            
//               <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><Smartphone size={12} strokeWidth={2.5} /></div>
//                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Contact Details</h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2.5">
//                   <div className="col-span-2 md:col-span-1"><Input label="Phone Number" value={profileForm.phone} onChange={(v) => setProfileForm({...profileForm, phone: v})} /></div>
//                   <div className="col-span-2 md:col-span-1"><Input label="Email Address" type="email" value={profileForm.email} onChange={(v) => setProfileForm({...profileForm, email: v})} /></div>
//                 </div>
//               </div>

           
//               <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md"><ShieldAlert size={12} strokeWidth={2.5} /></div>
//                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Emergency Protocols</h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2.5">
//                   <div className="col-span-2 md:col-span-1"><Input label="Blood Group" value={profileForm.blood_group} onChange={(v) => setProfileForm({...profileForm, blood_group: v})} /></div>
//                   <div className="col-span-2 md:col-span-1"><Input label="Emergency Contact Name" value={profileForm.emergency_contact_name} onChange={(v) => setProfileForm({...profileForm, emergency_contact_name: v})} /></div>
//                   <div className="col-span-2 md:col-span-1"><Input label="Relation" value={profileForm.emergency_contact_relation} onChange={(v) => setProfileForm({...profileForm, emergency_contact_relation: v})} /></div>
//                   <div className="col-span-2 md:col-span-1"><Input label="Emergency Phone" value={profileForm.emergency_contact_phone} onChange={(v) => setProfileForm({...profileForm, emergency_contact_phone: v})} /></div>
//                 </div>
//               </div>

//             </div>

//             <div className="px-5 py-3 border-t border-slate-100 bg-white flex justify-end gap-2 sticky bottom-0 z-20">
//               <button 
//                 onClick={() => setShowProfileModal(false)} 
//                 className="px-4 py-1.5 !bg-slate-50 border !border-slate-200 !text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:!bg-slate-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleProfileUpdate}
//                 className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 active:scale-95"
//               >
//                 <Save size={12} strokeWidth={2.5} /> Update Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {showKycModal && (
//               <Modal
//                 title={`Upload ${activeDoc.replace("_", " ")}`}
//                 onClose={() => {
//                   setShowKycModal(false);
//                   setSelectedFile(null);
//                 }}
//               >
//                 {/* ================= METADATA ================= */}
//                 {activeDoc === "aadhaar" && (
//                   <Input
//                     label="Aadhaar Number"
//                     value={kycForm.aadhaar_number}
//                     onChange={(v) => setKycForm({ ...kycForm, aadhaar_number: v })}
//                   />
//                 )}
      
//                 {activeDoc === "pan" && (
//                   <Input
//                     label="PAN Number"
//                     value={kycForm.pan_number}
//                     onChange={(v) => setKycForm({ ...kycForm, pan_number: v })}
//                   />
//                 )}
      
//                 {activeDoc === "bank" && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                       label="Account Holder Name"
//                       value={kycForm.account_holder_name}
//                       onChange={(v) =>
//                         setKycForm({ ...kycForm, account_holder_name: v })
//                       }
//                     />
//                     <Input
//                       label="Account Number"
//                       value={kycForm.account_number}
//                       onChange={(v) => setKycForm({ ...kycForm, account_number: v })}
//                     />
//                     <Input
//                       label="IFSC Code"
//                       value={kycForm.ifsc_code}
//                       onChange={(v) => setKycForm({ ...kycForm, ifsc_code: v })}
//                     />
//                   </div>
//                 )}
      
//                 {/* ================= FILE UPLOAD ================= */}
//                 <div className="mt-4">
//                   <label className="block text-slate-500 font-medium mb-1">
//                     Upload Document
//                   </label>
//                   <input
//                     type="file"
//                     onChange={(e) => setSelectedFile(e.target.files[0])}
//                   />
//                 </div>
      
//                 {/* ================= ACTIONS ================= */}
//                 <div className="flex justify-end gap-2 mt-6">
//                   <button
//                     onClick={() => setShowKycModal(false)}
//                     className="px-4 py-2 border rounded-lg text-sm"
//                   >
//                     Cancel
//                   </button>
      
//                   <button
//                     onClick={handleKycSubmit}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </Modal>
//             )}
      
//             {showViewModal && (
//               <Modal
//                 title={`View ${viewDocType.replace("_", " ")}`}
//                 onClose={() => setShowViewModal(false)}
//               >
//                 {/* IMAGE */}
//                 <div className="mb-4">
//                   <img
//                     src={getDocumentImage(viewDocType)}
//                     alt={viewDocType}
//                     className="w-full max-h-80 object-contain border rounded-lg"
//                   />
//                 </div>
      
//                 {/* METADATA */}
//                 {getKycDataByType(viewDocType) && (
//                   <div className="text-sm space-y-2">
//                     <p>
//                       <span className="font-semibold">
//                         {getKycDataByType(viewDocType).label}:
//                       </span>{" "}
//                       {getKycDataByType(viewDocType).value}
//                     </p>
      
//                     {getKycDataByType(viewDocType).extra && (
//                       <p>{getKycDataByType(viewDocType).extra}</p>
//                     )}
//                   </div>
//                 )}
//               </Modal>
//             )}
      

//       {showExperienceModal && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
//           {/* Backdrop with strong blur to prevent background distraction */}
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowExperienceModal(false)} />
          
//           <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
//             {/* 1. FIXED HEADER */}
//             <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
//                   <Briefcase size={20} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Professional Experiance</h2>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Append Deployment History</p>
//                 </div>
//               </div>
//               <button onClick={() => setShowExperienceModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
//                 <XCircle size={24} strokeWidth={2} />
//               </button>
//             </div>

//             {/* 2. SCROLLABLE FORM BODY */}
//             <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30 custom-scrollbar">
//               {draftExperiences.map((exp, index) => (
//                 <div key={index} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative group animate-in slide-in-from-bottom-4 duration-500">
                  
//                   <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
//                     <span className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">Entry Node #{index + 1}</span>
//                     {draftExperiences.length > 1 && (
//                       <button onClick={() => setDraftExperiences(draftExperiences.filter((_, i) => i !== index))} className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest flex items-center gap-1">
//                         <Trash2 size={14} /> Remove Node
//                       </button>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                     {/* Standard Inputs */}
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
//                       <input className={inputStyle} value={exp.company_name} onChange={(e) => { const u = [...draftExperiences]; u[index].company_name = e.target.value; setDraftExperiences(u); }} placeholder="e.g. Microsoft" />
//                     </div>

//                     {/* API Driven Dropdowns */}
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry</label>
//                       <select 
//   className={inputStyle} 
//   value={exp.industry_id || ""} 
//   onChange={(e) => { 
//     const u = [...draftExperiences]; 
//     u[index].industry_id = e.target.value; // Store the ID
//     setDraftExperiences(u); 
//   }}
// >
//   <option value="">Select Industry</option>
//   {industries.map(i => (
//     <option key={i.id} value={i.id}>{i.name}</option>
//   ))}
// </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
//                       <select 
//   className={inputStyle} 
//   value={exp.department_id || ""} 
//   onChange={(e) => { 
//     const u = [...draftExperiences]; 
//     u[index].department_id = e.target.value; // Store the ID
//     setDraftExperiences(u); 
//   }}
// >
//   <option value="">Select Department</option>
//   {departments.map(d => (
//     <option key={d.id} value={d.id}>{d.name}</option>
//   ))}
// </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Position</label>
//                       <input className={inputStyle} value={exp.job_title} onChange={(e) => { const u = [...draftExperiences]; u[index].job_title = e.target.value; setDraftExperiences(u); }} placeholder="e.g. Lead Engineer" />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
//                       <input type="date" className={inputStyle} value={exp.start_date} onChange={(e) => { const u = [...draftExperiences]; u[index].start_date = e.target.value; setDraftExperiences(u); }} />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
//                       <input type="date" className={inputStyle} value={exp.end_date} onChange={(e) => { const u = [...draftExperiences]; u[index].end_date = e.target.value; setDraftExperiences(u); }} />
//                     </div>

                    

//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Previous CTC (Annual)</label>
//                       <input type="number" className={inputStyle} value={exp.previous_ctc} onChange={(e) => { const u = [...draftExperiences]; u[index].previous_ctc = e.target.value; setDraftExperiences(u); }} placeholder="0.00" />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
//                       <input className={inputStyle} value={exp.location} onChange={(e) => { const u = [...draftExperiences]; u[index].location = e.target.value; setDraftExperiences(u); }} placeholder="e.g. Mumbai, India" />
//                     </div>

//                     <div className="md:col-span-2 space-y-1">
//                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Role Description</label>
//                       <textarea rows={3} className={`${inputStyle} resize-none`} value={exp.description} onChange={(e) => { const u = [...draftExperiences]; u[index].description = e.target.value; setDraftExperiences(u); }} placeholder="Key responsibilities..." />
//                     </div>

//                     {/* FILE UPLOAD & LINK */}
//                     {/* <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
//                       <div className="space-y-2">
//                         <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1">Experience Letter (PDF/JPG)</label>
//                         <input type="file" className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
//                           onChange={(e) => { const u = [...draftExperiences]; u[index].exp_letter_file = e.target.files[0]; setDraftExperiences(u); }}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1">Verification Link (Optional)</label>
//                         <input className={inputStyle} value={exp.exp_letter_link} onChange={(e) => { const u = [...draftExperiences]; u[index].exp_letter_link = e.target.value; setDraftExperiences(u); }} placeholder="https://linkedin.com/..." />
//                       </div>
//                     </div> */}
//                     {/* 🔥 ATTACHMENT TOGGLE SECTION */}
//                     <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-50">
//                       <div className="flex items-center justify-between">
//                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experience Letter</label>
                         
//                          {/* Toggle Switch */}
//                          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
//                             <button 
//                               onClick={() => { const u = [...draftExperiences]; u[index].attachmentType = 'file'; setDraftExperiences(u); }}
//                               className={`px-4 py-1.5 rounded-lg text-[9px] font-black !bg-transparent  uppercase transition-all ${exp.attachmentType !== 'url' ? '!bg-white !text-blue-600 shadow-sm' : '!text-slate-400'}`}
//                             >
//                               PDF Document
//                             </button>
//                             <button 
//                               onClick={() => { const u = [...draftExperiences]; u[index].attachmentType = 'url'; setDraftExperiences(u); }}
//                               className={`px-4 py-1.5 rounded-lg text-[9px] !bg-transparent  font-black uppercase transition-all ${exp.attachmentType === 'url' ? '!bg-white !text-blue-600 shadow-sm' : '!text-slate-400'}`}
//                             >
//                               URL Link
//                             </button>
//                          </div>
//                       </div>

//                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner min-h-[100px] flex items-center">
//                         {exp.attachmentType === 'url' ? (
//                           <div className="w-full space-y-2 animate-in fade-in zoom-in-95 duration-300">
//                              <div className="relative group">
//                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                                <input 
//                                  className={inputStyle} 
//                                  value={exp.exp_letter_link || ""} 
//                                  onChange={(e) => { const u = [...draftExperiences]; u[index].exp_letter_link = e.target.value; setDraftExperiences(u); }} 
//                                  placeholder="https://verification-portal.com/verify/..." 
//                                />
//                              </div>
//                              <p className="text-[9px] text-slate-400 font-medium ml-1">* Provide a publicly accessible link to your experience letter</p>
//                           </div>
//                         ) : (
//                           <div className="w-full space-y-2 animate-in fade-in zoom-in-95 duration-300">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-all">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <Upload className={`w-8 h-8 mb-3 ${exp.exp_letter_file ? 'text-emerald-500' : 'text-slate-400'}`} />
//                                     <p className="text-xs text-slate-500 font-bold">{exp.exp_letter_file ? exp.exp_letter_file.name : 'Click to upload Experience Letter'}</p>
//                                     <p className="text-[10px] text-slate-400 uppercase mt-1">PDF or JPG (Max 5MB)</p>
//                                 </div>
//                                 <input type="file" className="hidden" onChange={(e) => { const u = [...draftExperiences]; u[index].exp_letter_file = e.target.files[0]; setDraftExperiences(u); }} />
//                             </label>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <button onClick={() => setDraftExperiences([...draftExperiences, emptyExperience])} className="w-full py-4 border-2 border-dashed !border-slate-200 rounded-2xl !text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:!bg-white hover:!border-blue-400 hover:!text-blue-600 !bg-transparent  transition-all flex items-center justify-center gap-2">
//                 <PlusCircle size={18} /> Add Another Node
//               </button>
//             </div>

//             {/* 3. FIXED FOOTER */}
//             <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 z-20">
//               <button onClick={() => setShowExperienceModal(false)} className="px-6 py-2.5 text-[11px] border border-slate-500 font-black uppercase tracking-widest !text-slate-500 !bg-transparent rounded-xl hover:!text-slate-800 transition-colors">Discard</button>
//               <button onClick={handleSaveExperience} className="flex items-center border !border-blue-500 gap-2 !bg-transparent  hover:bg-white !text-blue-600 font-black px-10 py-3 rounded-xl shadow-sm shadow-blue-500/20 transition-all active:scale-95 text-[11px] uppercase tracking-[0.15em]">
//                 <Save size={16} /> Deploy to Registry
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
       
      
//             {isExitModalOpen && (
//               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//                 {/* Backdrop: Professional blur with slightly lighter overlay */}
//                 <div
//                   className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
//                   onClick={() => setIsExitModalOpen(false)}
//                 />
      
//                 <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//                   {/* Top Warning Accent Line */}
//                   <div className="h-1.5 w-full bg-rose-500" />
      
//                   {/* Header: More balanced and communicative */}
//                   <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//                     <div className="flex gap-4">
//                       <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                           <polyline points="16 17 21 12 16 7" />
//                           <line x1="21" y1="12" x2="9" y2="12" />
//                         </svg>
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-bold text-slate-900 tracking-tight">
//                           Initiate Offboarding
//                         </h3>
//                         <p className="text-sm text-slate-500 font-medium leading-relaxed">
//                           Please provide the details to process this employee's exit
//                           from the system.
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setIsExitModalOpen(false)}
//                       className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
//                     >
//                       <svg
//                         width="20"
//                         height="20"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M18 6L6 18M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
      
//                   {/* Body: High-clarity inputs with consistent spacing */}
//                   <div className="px-8 py-6 space-y-7">
//                     {/* Warning Notice: Common in Enterprise Software */}
//                     {/* Exit Date */}
//                     <div className="space-y-2.5">
//                       <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
//                         Effective Exit Date
//                       </label>
//                       <input
//                         type="date"
//                         value={exitForm.exit_date}
//                         onChange={(e) =>
//                           setExitForm({ ...exitForm, exit_date: e.target.value })
//                         }
//                         className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
//                       />
//                     </div>
      
//                     {/* Exit Reason */}
//                     <div className="space-y-2.5">
//                       <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
//                         Reason for Separation
//                       </label>
//                       <textarea
//                         rows={4}
//                         placeholder="Document the primary reasons for exit (e.g., Better opportunity, Relocation, etc.)"
//                         value={exitForm.exit_reason}
//                         onChange={(e) =>
//                           setExitForm({ ...exitForm, exit_reason: e.target.value })
//                         }
//                         className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none resize-none placeholder:text-slate-400 placeholder:font-normal"
//                       />
//                     </div>
//                   </div>
      
//                   {/* Footer: Prominent and grouped actions */}
//                   <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
//                     <button
//                       onClick={() => setIsExitModalOpen(false)}
//                       className="px-6 py-3 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all"
//                     >
//                       Discard Changes
//                     </button>
      
//                     <button
//                       onClick={handleEmployeeExit}
//                       className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-rose-700 shadow-xl shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//                     >
//                       Confirm Offboarding
//                       <svg
//                         width="18"
//                         height="18"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="m9 18 6-6-6-6" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
      
//             {showEditModal && (
//               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//                 {/* Backdrop: Deep Blur for focus */}
//                 <div
//                   className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
//                   onClick={() => setShowEditModal(false)}
//                 />
      
//                 {/* Modal Container: Precision Geometry */}
//                 <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
//                   {/* 1. Header: Matches your Step 2 Style */}
//                   <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
//                     <div>
//                       <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                         Edit Experience
//                       </h2>
//                       <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.15em] mt-0.5">
//                         System Record : {editForm.company_name || "Entry_v1"}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => setShowEditModal(false)}
//                       className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
//                     >
//                       <XCircle size={22} />
//                     </button>
//                   </div>
      
//                   {/* 2. Form Body: Balanced Information Density */}
//                   <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
                  
      
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
//                       {/* Company Name */}
//                       <div className="flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           Company Name
//                         </label>
//                         <div className="relative group">
//                           <Building2
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                             size={16}
//                           />
//                           <input
//                             className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                             value={editForm.company_name}
//                             placeholder="e.g. Google"
//                             onChange={(e) =>
//                               setEditForm({
//                                 ...editForm,
//                                 company_name: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>
      
//                       {/* Job Title */}
//                       <div className="flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           Job Title
//                         </label>
//                         <div className="relative group">
//                           <Briefcase
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                             size={16}
//                           />
//                           <input
//                             className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                             value={editForm.job_title}
//                             placeholder="e.g. Senior Developer"
//                             onChange={(e) =>
//                               setEditForm({ ...editForm, job_title: e.target.value })
//                             }
//                           />
//                         </div>
//                       </div>
      
//                       {/* Start Date */}
//                       <div className="flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           Start Date
//                         </label>
//                         <input
//                           type="date"
//                           className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                           value={editForm.start_date}
//                           onChange={(e) =>
//                             setEditForm({ ...editForm, start_date: e.target.value })
//                           }
//                         />
//                       </div>
      
//                       {/* End Date */}
//                       <div className="flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           End Date
//                         </label>
//                         <input
//                           type="date"
//                           className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                           value={editForm.end_date}
//                           onChange={(e) =>
//                             setEditForm({ ...editForm, end_date: e.target.value })
//                           }
//                         />
//                       </div>
      
//                       {/* Previous CTC */}
//                       <div className="flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           Previous CTC (Annual)
//                         </label>
//                         <div className="relative group">
//                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs group-focus-within:text-indigo-500 transition-colors">
//                             ₹
//                           </span>
//                           <input
//                             type="number"
//                             className="w-full bg-white border border-slate-200 pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                             value={editForm.previous_ctc}
//                             placeholder="0.00"
//                             onChange={(e) =>
//                               setEditForm({
//                                 ...editForm,
//                                 previous_ctc: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>
      
//                       {/* Location */}
//                       <div className="flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           Work Location
//                         </label>
//                         <div className="relative group">
//                           <MapPin
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                             size={16}
//                           />
//                           <input
//                             className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                             value={editForm.location}
//                             placeholder="e.g. Mumbai"
//                             onChange={(e) =>
//                               setEditForm({ ...editForm, location: e.target.value })
//                             }
//                           />
//                         </div>
//                       </div>
      
//                       {/* Description */}
//                       <div className="md:col-span-2 flex flex-col gap-1.5">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                           Role Description
//                         </label>
//                         <textarea
//                           rows={4}
//                           className="w-full bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
//                           placeholder="Outline your key achievements and impact..."
//                           value={editForm.description}
//                           onChange={(e) =>
//                             setEditForm({ ...editForm, description: e.target.value })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
      
//                   {/* 3. Footer: Clear, Weighted Actions */}
//                   <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between sticky bottom-0">
//                     <button
//                       onClick={() => setShowEditModal(false)}
//                       className="text-sm !bg-white font-bold !text-slate-500 hover:!text-slate-800 transition-all"
//                     >
//                       Discard Changes
//                     </button>
      
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => setShowEditModal(false)}
//                         className="px-5 py-2.5 !bg-white border !border-blue-600 text-sm font-bold !text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleUpdateExperience}
//                         className="flex items-center gap-2 px-8 !border-blue-500 py-2.5 !bg-white hover:bg-indigo-700 !text-blue-600 text-sm font-bold rounded-xl border border-blue-600 transition-all active:scale-[0.98]"
//                       >
//                         <Save size={18} />
//                         Update Record
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
      
//          {showExtraKycModal && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={() => setShowExtraKycModal(false)}
//           />
      
//           <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
//             {/* HEADER */}
//             <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
//               <h2 className="text-lg font-bold">PF / Nominee Details</h2>
//               <button onClick={() => setShowExtraKycModal(false)}>✕</button>
//             </div>
      
//             {/* BODY */}
//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
      
//               <Input
//                 label="UAN Number"
//                 value={kycForm.uan_number || ""}
//                 onChange={(v) => setKycForm({ ...kycForm, uan_number: v })}
//               />
      
//               <SelectYN
//                 label="PF Scheme Member"
//                 value={kycForm.pf_scheme_member || "No"}
//                 onChange={(v) => setKycForm({ ...kycForm, pf_scheme_member: v })}
//               />
      
//               {kycForm.pf_scheme_member === "Yes" && (
//                 <>
//                   <Input
//                     label="Previous Employer"
//                     value={kycForm.prev_employer_name || ""}
//                     onChange={(v) =>
//                       setKycForm({ ...kycForm, prev_employer_name: v })
//                     }
//                   />
      
//                   <Input
//                     label="Employer Address"
//                     value={kycForm.prev_employer_address || ""}
//                     onChange={(v) =>
//                       setKycForm({ ...kycForm, prev_employer_address: v })
//                     }
//                   />
      
//                   <Input
//                     label="Previous PF Account"
//                     value={kycForm.prev_pf_account_number || ""}
//                     onChange={(v) =>
//                       setKycForm({ ...kycForm, prev_pf_account_number: v })
//                     }
//                   />
      
//                   <Input
//                     label="Last Working Date"
//                     type="date"
//                     value={kycForm.prev_last_working_date || ""}
//                     onChange={(v) =>
//                       setKycForm({ ...kycForm, prev_last_working_date: v })
//                     }
//                   />
      
//                   <SelectYN
//                     label="Transfer PF Balance"
//                     value={kycForm.transfer_pf_balance || "No"}
//                     onChange={(v) =>
//                       setKycForm({ ...kycForm, transfer_pf_balance: v })
//                     }
//                   />
//                 </>
//               )}
      
//               <Input
//                 label="Nominee Name"
//                 value={kycForm.nominee_name || ""}
//                 onChange={(v) => setKycForm({ ...kycForm, nominee_name: v })}
//               />
      
//               <Input
//                 label="Nominee Relation"
//                 value={kycForm.nominee_relation || ""}
//                 onChange={(v) =>
//                   setKycForm({ ...kycForm, nominee_relation: v })
//                 }
//               />
      
//               <Input
//                 label="Nominee DOB"
//                 type="date"
//                 value={kycForm.nominee_dob || ""}
//                 onChange={(v) =>
//                   setKycForm({ ...kycForm, nominee_dob: v })
//                 }
//               />
      
//               <Input
//                 label="Nominee Share (%)"
//                 value={kycForm.nominee_share || ""}
//                 onChange={(v) =>
//                   setKycForm({ ...kycForm, nominee_share: v })
//                 }
//               />
//             </div>
      
//             {/* FOOTER */}
//             <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-2">
//               <button
//                 onClick={() => setShowExtraKycModal(false)}
//                 className="px-4 py-2 border rounded-lg text-sm"
//               >
//                 Cancel
//               </button>
      
//               <button
//                 onClick={handleSaveExtraKyc}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
//               >
//                 Save Details
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      


//       {/* 🛡️ ADDRESS VERIFICATION MODAL */}
//       {showVerifyModal && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center p-3">
//           {/* Backdrop */}
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowVerifyModal(false)} />
          
//           <div className="relative bg-white w-full max-w-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
//             {/* HEADER */}
//             <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
//                   <ShieldCheck size={16} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase">Verify Address</h2>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Adress Confirmation</p>
//                 </div>
//               </div>
//               <button onClick={() => setShowVerifyModal(false)} className="!text-slate-400 hover:!text-slate-600 !bg-transparent transition-colors">
//                 <XCircle size={18} strokeWidth={2.5} />
//               </button>
//             </div>

//             {/* BODY */}
//             <div className="p-5 space-y-4">
//               <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
//                 <div className="mt-0.5 text-blue-600"><Activity size={14}/></div>
//                 <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
//                   You are performing a verification action on the <span className="text-blue-700 font-black uppercase tracking-widest underline decoration-2 underline-offset-2">{verifyForm.type}</span> address.
//                 </p>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Remarks</label>
//                 <textarea
//                   value={verifyForm.remarks}
//                   onChange={(e) => setVerifyForm({ ...verifyForm, remarks: e.target.value })}
//                   placeholder="Document the verification findings..."
//                   rows={3}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 text-xs font-semibold text-slate-900 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none placeholder:text-slate-400"
//                 />
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
//               <button 
//                 onClick={() => setShowVerifyModal(false)} 
//                 className="px-4 py-2 !bg-white border !border-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-100 transition-colors"
//               >
//                 Discard
//               </button>
//               <button
//                 onClick={async () => {
//                   try {
//                     await toast.promise(
//                       employeeAddressService.verify(id, verifyForm),
//                       {
//                         loading: 'Executing verification...',
//                         success: 'Node verified successfully ✅',
//                         error: 'Verification failure ❌',
//                       }
//                     );
//                     setShowVerifyModal(false);
//                     fetchAddress(); // Refresh data
//                   } catch (err) {
//                     console.error(err);
//                   }
//                 }}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
//               >
//                 <CheckCircle2 size={14} strokeWidth={2.5} /> Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

      

//       {/* Internal CSS for mobile scrollbar */}
//     <style dangerouslySetInnerHTML={{__html: `
//   .no-scrollbar::-webkit-scrollbar { display: none; }
//   .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// `}} />
//     </div>
//   );
// }

// // 🛡️ HELPER COMPONENTS (Reduced spacing inside fields)
// const DataField = ({ label, value, required }) => (
//   <div className="space-y-1 group">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center group-hover:text-blue-500 transition-colors">
//       {label} {required && <span className="text-rose-500 ml-1 text-[10px]">*</span>}
//     </p>
//     <p className="text-[11px] md:text-xs font-bold text-slate-800 break-words uppercase leading-tight">
//       {value || "-"}
//     </p>
//   </div>
// );

// const MiniField = ({ label, value, isBold }) => (
//   <div className="space-y-1">
//     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
//     <p className={`text-[10px] uppercase tracking-tight ${isBold ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
//       {value || "Not Specified"}
//     </p>
//   </div>
// );


// const MetricRow = ({ label, value, color }) => (
//   <div className="space-y-1.5">
//     <div className="flex justify-between items-end">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
//       <span className="text-[10px] font-black text-slate-700">{value}/10</span>
//     </div>
//     <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 p-0.5">
//        {[...Array(10)].map((_, i) => (
//          <div 
//            key={i} 
//            className={`h-full flex-1 rounded-sm transition-all duration-1000 ${i < value ? color : 'bg-slate-100'}`} 
//          />
//        ))}
//     </div>
//   </div>
// );


// const inputStyle =
//   "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400";

// const Input = ({ label, value, onChange, type = "text", options = [], disabled = false, loading = false }) => (
//   <div className="flex flex-col gap-1 relative group">
//     <div className="flex items-center justify-between">
//       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
//       {loading && <Loader2 size={10} className="animate-spin text-blue-500" />}
//     </div>
    
//     {options.length > 1 ? (
//       <div className="relative">
//         <select
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           disabled={disabled}
//           className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
//         >
//           {options.map((opt, i) => (
//             <option key={i} value={opt}>{opt}</option>
//           ))}
//         </select>
//         <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
//       </div>
//     ) : (
//       <input
//         type={type}
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         disabled={disabled}
//         className="w-full bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
//         placeholder={`Enter ${label.toLowerCase()}`}
//       />
//     )}
//   </div>
// );

// const iconStyle =
//   "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

// const labelStyle =
//   "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";

// // 📄 DOCUMENT ENTRY COMPONENT (Horizontal Mini-Card)
// const DocEntry = ({ label, type, docs }) => {
//   const doc = docs?.find(d => d.document_type === type);
//   const exists = !!doc?.document_path;

//   return (
//     <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
//       exists ? "bg-slate-50/50 border-slate-200 shadow-sm" : "bg-white border-dashed border-slate-200 opacity-60"
//     }`}>
//       <div className="flex items-center gap-2.5 min-w-0">
//         <div className={`p-2 rounded-md ${exists ? "bg-white text-blue-600 shadow-sm" : "bg-slate-100 text-slate-400"}`}>
//           <FileText size={14} />
//         </div>
//         <div className="min-w-0">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Type</p>
//           <p className="text-[11px] font-bold text-slate-700 truncate">{label}</p>
//         </div>
//       </div>

//       {exists ? (
//         <button 
//           onClick={() => window.open(doc.document_path, "_blank")}
//           className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-md text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
//         >
//           <Eye size={10} strokeWidth={3} /> View
//         </button>
//       ) : (
//         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 px-2">Missing</span>
//       )}
//     </div>
//   );
// };


//*************************************************working code phase 1 12/03/26********************************************************* */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import {
//   ArrowLeft,
//   FileText,
//   CheckCircle,
//   Upload,
//   Plus,
//   Eye,
//   XCircle,
//   Hash,
//   Smartphone,
//   Droplets,
//   Trash2,
//   PlusCircle,
//   Building2,
//   Fingerprint,
//   ShieldAlert,
//   Activity,
//   Briefcase,
//   Home,
//   MapPin,
//   Save,
//   Calendar,
//   TrendingUp,
//   Globe,
//   User,
//   Send,
//   ShieldCheck,
//   Zap,
//   Edit3,
//   RefreshCcw,
//   Mail,
//   Download,
//   CheckCircle2,
//   FileCheck,
//   UserCheck,
//   Clock,
//   History,
// } from "lucide-react";
// import toast from "react-hot-toast";
// // import { Toaster } from "react-hot-toast";
// import JoiningLetterWorkspace from "../../components/joining/JoiningLetterWorkspace";
// import JoiningDispatchUI from "../../components/joining/JoiningDispatchUI";
// import OfferLatter from "../../components/offer/OfferLatter";
// import AssetManager from "../../components/assets_assign/AssetManager";
// import ExperienceSection from "../../components/experiance/ExperienceSection";
// import DocumentSubmissionUI from "../../components/employeedocument/DocumentSubmissionUI";
// import JoiningConfirmationUI from "../../components/joining/JoiningConfirmationUI";
// import PolicyStepper from "../../components/policyui/PolicyStepper";
// import AllkycVerified from "../../components/kycverification/AllkycVerified";

// export default function EmployeeDemoDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState(null);
//   const [addressLoading, setAddressLoading] = useState(true);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [uploadingType, setUploadingType] = useState(null);
//   const [addressForm, setAddressForm] = useState({
//     current_address_line1: "",
//     current_address_line2: "",
//     current_city: "",
//     current_state: "",
//     current_pincode: "",
//     permanent_address_line1: "",
//     permanent_address_line2: "",
//     permanent_city: "",
//     permanent_state: "",
//     permanent_pincode: "",
//   });
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [verifyForm, setVerifyForm] = useState({
//     type: "",
//     status: "verified",
//     remarks: "",
//   });
//   const [showFull, setShowFull] = useState(false);
//   const [kyc, setKyc] = useState(null);
//   const [kycLoading, setKycLoading] = useState(true);
//   const [kycSubmitting, setKycSubmitting] = useState(false);
//   const [showKycModal, setShowKycModal] = useState(false);
//   const [activeDoc, setActiveDoc] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [error, setError] = useState(null);
//   // EXTRA PF / NOMINEE MODAL STATE
// const [showExtraKycModal, setShowExtraKycModal] = useState(false);

//   const [kycForm, setKycForm] = useState({
//     aadhaar_number: "",
//     pan_number: "",
//     account_holder_name: "",
//     account_number: "",
//     ifsc_code: "",

//      // ===== EXTRA PF / NOMINEE =====
//   uan_number: "",
//   pf_scheme_member: "No",
//   prev_employer_name: "",
//   prev_employer_address: "",
//   prev_pf_account_number: "",
//   prev_last_working_date: "",
//   transfer_pf_balance: "No",
//   nominee_name: "",
//   nominee_relation: "",
//   nominee_dob: "",
//   nominee_share: "",
//   });
//   const [documents, setDocuments] = useState([]);
//   const [documentsLoading, setDocumentsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewDocType, setViewDocType] = useState(null);
//   const IMAGE_ONLY_DOCS = ["photo", "previous_offer_letter"];
//   const META_DOCS = ["aadhaar", "pan", "bank"];
//   const [openVerify, setOpenVerify] = useState(null); // "pan" | "bank"
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
//   const [draftExperiences, setDraftExperiences] = useState([]);
//   const emptyExperience = {
//     company_name: "",
//     job_title: "",
//     start_date: "",
//     end_date: "",
//     previous_ctc: "",
//     location: "",
//     description: "",
//   };
//   const [statusexp, setStatusexp] = useState([]);
//   const [experiences, setExperiences] = useState([emptyExperience]);
//   const [panVerifyForm, setPanVerifyForm] = useState({
//     name: "",
//   });
//   const [bankVerifyForm, setBankVerifyForm] = useState({
//     bank_account: "",
//     ifsc: "",
//     name: "",
//     phone: "",
//   });
//   const [verifying, setVerifying] = useState(false);
//   // Assets State
//   const [previousAssets, setPreviousAssets] = useState([]); // from API (GET)
//   const [assetRows, setAssetRows] = useState([]); // draft rows

//   const [esignFile, setEsignFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [documentId, setDocumentId] = useState(null);
//   const [aadhaarLast4, setAadhaarLast4] = useState("");
//   const [esignVerified, setEsignVerified] = useState(false);
//   const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
//   const [localStatus, setLocalStatus] = useState(employee?.status);


// useEffect(() => {
//   setLocalStatus(employee?.status);
// }, [employee?.status]);


//   const [aadhaarVerifyForm, setAadhaarVerifyForm] = useState({
//     aadhaar_status: "",
//     remarks: "",
//   });
//   const [offerProfile, setOfferProfile] = useState(null);

//   const [isExitModalOpen, setIsExitModalOpen] = useState(false);

//   const [exitForm, setExitForm] = useState({
//     exit_date: "",
//     exit_reason: "",
//   });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingExp, setEditingExp] = useState(null);
//   const [editForm, setEditForm] = useState({
//     company_name: "",
//     job_title: "",
//     start_date: "",
//     end_date: "",
//     previous_ctc: "",
//     location: "",
//     description: "",
//   });

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//     fetchExperiences();
//     fetchAssets();
//   }, [id]);

//   useEffect(() => {
//     fetchKyc();
//     handleGetFullEmployee(id);
//   }, [id]);

//   const fetchKyc = async () => {
//     try {
//       const data = await employeeKycService.get(id);
//       if (data) {
//         // setKyc(data);
//         setKyc({
//           ...data.kyc_details, // ← flatten KYC
//           esign_history: data.esign_history,
//         });
//         setKycForm({
//           aadhaar_number: data.aadhaar_number || "",
//           pan_number: data.pan_number || "",
//           account_holder_name: data.account_holder_name || "",
//           account_number: data.account_number || "",
//           ifsc_code: data.ifsc_code || "",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setKycLoading(false);
//     }
//   };

//   const esignHistory = kyc?.esign_history || [];

//   const latestEsign =
//     esignHistory.length > 0 ? esignHistory[esignHistory.length - 1] : null;

//   const esignStatus = latestEsign?.status; // link_generated | signed
//   const isEsignSigned = esignStatus === "signed";
//   const isEsignLinkGenerated = esignStatus === "link_generated";
//   const isEsignDocumentUploaded = esignStatus === "document_uploaded";

//   const fetchDocuments = async () => {
//     try {
//       const data = await employeeKycService.getDocuments(id);
//       setDocuments(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setDocumentsLoading(false);
//     }
//   };

//   const handleSaveExperience = async () => {
//     try {
//       // 🔹 ONLY new experiences (no id yet)
//       const newExperiences = draftExperiences.filter(
//         (exp) => !exp.id && (exp.company_name || exp.job_title),
//       );

//       if (newExperiences.length === 0) {
//         toast.error("No new experience to save");
//         return;
//       }

//       const payload = {
//         experiences: newExperiences,
//       };

//       await employeeKycService.saveExperience(id, payload);

//       toast.success("Experience added successfully");
//       await fetchExperiences();

//       setDraftExperiences([]);
//       setShowExperienceModal(false);
//     } catch (err) {
//       toast.error(err.message || "Failed to save experience");
//     }
//   };


//   const fetchExperiences = async () => {
//     try {
//       const res = await employeeKycService.getExperiences(id);

//       // console.log("API DATA", res);
//       setStatusexp(res);

//       if (res?.data && Array.isArray(res.data)) {
//         setExperiences(res.data);
//       }
//     } catch (err) {
//       console.error("Failed to fetch experiences", err);
//     }
//   };

//   const getAddressProofDoc = (type) => {
//     return documents?.find((d) => d.document_type === type);
//   };

//   console.log("docuemtn", documents);

//   const getDocument = (type) => documents.find((d) => d.document_type === type);

//   const fetchEmployee = async () => {
//     try {
//       const data = await employeeService.getById(id);
//       setEmployee(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAddress = async () => {
//     try {
//       const data = await employeeAddressService.get(id);
//       if (data) {
//         setAddress(data.address);
//         setAddressForm(data.address);
//       } else {
//         setAddress(null);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setAddressLoading(false);
//     }
//   };

//   const handleSaveAddress = async () => {
//     try {
//       if (address) {
//         await employeeAddressService.update(id, addressForm);
//         toast.success("Address updated successfully");
//       } else {
//         await employeeAddressService.create(id, addressForm);
//         toast.success("Address added successfully");
//       }
//       setShowAddressModal(false);
//       fetchAddress();
//     } catch (err) {
//       toast.error(err.message || "Failed to save address");
//     }
//   };

//   const handleVerifyAddress = async () => {
//     try {
//       await employeeAddressService.verify(id, verifyForm);
//       fetchAddress();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleKycSubmit = async () => {
//     try {
//       // 1️⃣ IMAGE ONLY (PHOTO / OFFER LETTER)
//       if (IMAGE_ONLY_DOCS.includes(activeDoc)) {
//         if (!selectedFile) {
//           toast.error("Please upload a file");
//           return;
//         }

//         await employeeKycService.uploadDocument(id, activeDoc, selectedFile);

//         toast.success("Document uploaded");
//       }

//       // 2️⃣ METADATA + IMAGE (AADHAAR / PAN / BANK)
//       if (META_DOCS.includes(activeDoc)) {
//         // a) save JSON metadata ONLY
//         await employeeKycService.create(id, kycForm);

//         // b) upload file ONLY
//         if (selectedFile) {
//           await employeeKycService.uploadDocument(id, activeDoc, selectedFile);
//         }

//         toast.success("KYC details saved");
//       }

//       setShowKycModal(false);
//       setSelectedFile(null);
//       await fetchDocuments();
//       fetchKyc();
//     } catch (err) {
//       toast.error(err.message || "Something went wrong");
//     }
//   };

//   const getDocumentImage = (type) => {
//     const doc = getDocument(type);
//     if (!doc?.document_path) return null;
//     return `https://apihrr.goelectronix.co.in/${doc.document_path}`;
//   };

//   const getKycDataByType = (type) => {
//     if (!kyc) return null;

//     switch (type) {
//       case "aadhaar":
//         return { label: "Aadhaar Number", value: kyc.aadhaar_number };
//       case "pan":
//         return { label: "PAN Number", value: kyc.pan_number };
//       case "bank":
//         return {
//           label: "Account Number",
//           value: kyc.account_number,
//           extra: `IFSC: ${kyc.ifsc_code}`,
//         };
//       default:
//         return null;
//     }
//   };

//   const verifyPanHandler = async () => {
//     try {
//       setVerifying(true);

//       const res = await employeeKycService.verifyPan(id, panVerifyForm);

//       if (res.pan_status !== "verified") {
//         toast.error(res.remarks || "PAN verification failed");
//         return;
//       }

//       toast.success("PAN verified successfully");

//       // update KYC state so UI switches to verified view
//       setKyc((prev) => ({
//         ...prev,
//         ...res,
//       }));
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const verifyBankHandler = async () => {
//     try {
//       setVerifying(true);

//       const res = await employeeKycService.verifyBank(id, bankVerifyForm);

//       if (res.bank_status !== "verified") {
//         toast.error(res.remarks || "Bank verification failed");
//         return;
//       }

//       toast.success("Bank verified successfully");

//       // update KYC state so UI switches to verified view
//       setKyc((prev) => ({
//         ...prev,
//         ...res,
//       }));
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const generateVerificationId = () => {
//     return (
//       "ESIGN-" +
//       Date.now().toString(36).toUpperCase() +
//       "-" +
//       Math.random().toString(36).substring(2, 8).toUpperCase()
//     );
//   };

//   const submitAadhaar = async () => {
//     if (aadhaarLast4.length !== 4) {
//       toast.error("Enter last 4 digits of Aadhaar");
//       return;
//     }

//     if (!documentId?.document_id) {
//       toast.error("Document not uploaded yet");
//       return;
//     }

//     try {
//       setUploading(true);

//       const payload = {
//         verification_id: generateVerificationId(), // unique ref
//         document_id: documentId.document_id,
//         notification_modes: ["email"],
//         auth_type: "AADHAAR",
//         expiry_in_days: "7",
//         capture_location: true,
//         signers: [
//           {
//             name: employee.full_name,
//             email: employee.email,
//             phone: employee.phone,
//             sequence: 1,
//             aadhaar_last_four_digit: aadhaarLast4,
//             sign_positions: [
//               {
//                 page: 1,
//                 top_left_x_coordinate: 400,
//                 bottom_right_x_coordinate: 550,
//                 top_left_y_coordinate: 700,
//                 bottom_right_y_coordinate: 800,
//               },
//             ],
//           },
//         ],
//       };

//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/esign/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "eSign creation failed");
//       }

//       const data = await res.json();

//       toast.success("eSign request created successfully");
//       setEsignVerified(true);

//       await fetchKyc();

//       console.log("eSign response:", data);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const verifyAadhaarHandler = async () => {
//     if (!aadhaarVerifyForm.aadhaar_status) {
//       toast.error("Please select Aadhaar status");
//       return;
//     }

//     try {
//       setVerifyingAadhaar(true);

//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/employees/verify-aadhaar/${id}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(aadhaarVerifyForm),
//         },
//       );

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err);
//       }

//       const data = await res.json();

//       // 🔥 merge Aadhaar result into kyc state
//       setKyc((prev) => ({
//         ...prev,
//         aadhaar_status: data.aadhaar_status,
//         aadhaar_verified_at: new Date().toISOString(),
//         aadhaar_remarks: data.remarks,
//         aadhaar_verification_id: data.verification_id || "AADH-" + Date.now(),
//       }));

//       toast.success("Aadhaar verification updated successfully ✅");
//       await kyc();
//     } catch (err) {
//       toast.error(err.message || "Aadhaar verification failed");
//     } finally {
//       setVerifyingAadhaar(false);
//     }
//   };

//   // 1. Sort by date (Newest First)
//   const sortedExperiences = [...experiences].sort(
//     (a, b) => new Date(b.start_date) - new Date(a.start_date),
//   );

//   // 2. Financial Calculations
//   const totalCTC = experiences.reduce(
//     (sum, exp) => sum + Number(exp.previous_ctc || 0),
//     0,
//   );
//   const avgCTC = experiences.length > 0 ? totalCTC / experiences.length : 0;
//   const lastDrawn =
//     experiences.length > 0
//       ? Number(experiences[experiences.length - 1].previous_ctc)
//       : 0;

//   // 3. AI Suggestion Logic (Standard 20% Hike)
//   const suggestedCTC = lastDrawn * 1.2;

//   const aadhaarDoc = getDocument("aadhaar");

//   console.log("adddharr4444", aadhaarDoc);
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("previous_offer_letter");
//   const currentDoc = getAddressProofDoc("address_proof_current");
//   const permanentDoc = getAddressProofDoc("address_proof_permanent");

//   //**********************************asset code */
//   const addAssetRow = (asset) => {
//     setAssetRows((prev) => [...prev, asset]);
//   };

//   // Remove row
//   const removeAssetRow = (index) => {
//     const updated = assetRows.filter((_, i) => i !== index);
//     setAssetRows(updated);
//   };

//   // Change row field
//   const handleAssetChange = (index, field, value) => {
//     setAssetRows((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
//     );
//   };


// const handleSubmitAssets = async () => {
//   try {
//     if (assetRows.length === 0) {
//       toast.error("Add at least one asset");
//       return;
//     }

//     const formData = new FormData();

//     const sendEmailFlag = assetRows.some((a) => a.send_email === true);
//     formData.append("send_email", sendEmailFlag);

//     assetRows.forEach((asset) => {
//       if (!asset.asset_name || !asset.serial_number) return;

//       // 🔹 FLAT FIELDS (NO assets[0])
//       formData.append("asset_category", asset.asset_category || "laptop");
//       formData.append("asset_name", asset.asset_name);
//       formData.append("serial_number", asset.serial_number);
//       formData.append("model_number", asset.model_number || "");
//       formData.append("allocated_at", asset.allocated_at);
//       formData.append("condition_on_allocation", asset.condition_on_allocation);
//       formData.append("remarks", asset.remarks || "");

//       // 🔹 MULTIPLE IMAGES
//       if (asset.images?.length > 0) {
//         asset.images.forEach((file) => {
//           formData.append("images", file);   // ← NO index
//         });
//       }
//     });

//     await employeeKycService.addAssets(id, formData);

//     toast.success("Assets assigned successfully");
//     setAssetRows([]);
//     fetchAssets();
//   } catch (err) {
//     toast.error(err.message || "Failed to assign assets");
//   }
// };


//   const handleEmployeeExit = async () => {
//     if (!exitForm.exit_date || !exitForm.exit_reason) {
//       toast.error("Please provide exit date and reason");
//       return;
//     }

//     try {
//       await toast.promise(
//         fetch(`https://apihrr.goelectronix.co.in/employees/${id}/exit`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(exitForm),
//         }),
//         {
//           loading: "Marking employee exit...",
//           success: "Employee marked as exited ✅",
//           error: "Failed to update employee exit ❌",
//         },
//       );

//       setIsExitModalOpen(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchAssets = async () => {
//     try {
//       const res = await employeeKycService.getAssets(id);
//       console.log("inside funbtion", res);
//       setPreviousAssets(res || []);
//     } catch (err) {
//       console.error("Failed to fetch assets", err);
//     }
//   };

//   console.log("Add assets code", previousAssets);

//   const uploadEsignDocument = async () => {
//     if (!esignFile) {
//       toast.error("Please upload a document");
//       return;
//     }

//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("document", esignFile);
//       for (const pair of formData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const uploadRes = await fetch(
//         "https://spillas.com/dotnet-api/Cashfree/upload-esign-document",
//         {
//           method: "POST",
//           headers: {
//             AppId: "170J3KZTCJLZBKXGQ6PAVERHYX1JLD",
//             SecretKey: "TESTVPKA8XNE6R045U9JCT4KKADDF88T8UAT",
//           },
//           body: formData,
//         },
//       );

//       const uploadData = await uploadRes.json();

//       if (uploadData.status !== "SUCCESS") {
//         throw new Error("Upload failed");
//       }

//       const docId = uploadData; // ✅ extract number

//       setDocumentId(docId);

//       // 🔥 AUTO CALL SECOND API
//       await processExternalUpload(docId);

//       toast.success("Document uploaded successfully");
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const processExternalUpload = async (docResponse) => {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/esign/process-external-upload?employee_id=${id}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: docResponse.status,
//           document_id: docResponse.document_id,
//         }),
//       },
//     );

//     if (!res.ok) {
//       const err = await res.json();
//       console.error(err);
//       throw new Error("eSign process failed");
//     }

//     return await res.json();
//   };

//   const handleGetFullEmployee = async (id) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await employeeKycService.getFull(id);

//       setOfferProfile(data); // ✅ instead of setExperience
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const REVIEW_ALERT_CONFIG = {
//     probation_review: {
//       title: "Probation Period Concluding",
//       message: "This employee's probation phase ends in",
//       days: 7,
//       badge: "Priority",
//     },
//     probation_extended: {
//       title: "Probation Extended",
//       message: "Extended probation review required within",
//       days: 15,
//       badge: "Attention",
//     },
//     confirmed: {
//       title: "Post-Confirmation Review",
//       message: "Initial performance review scheduled in",
//       days: 30,
//       badge: "Review",
//     },
//   };

//   const handleEditExperience = (exp) => {
//     setEditingExp(exp);

//     setEditForm({
//       company_name: exp.company_name || "",
//       job_title: exp.job_title || "",
//       start_date: exp.start_date || "",
//       end_date: exp.end_date || "",
//       previous_ctc: exp.previous_ctc || "",
//       location: exp.location || "",
//       description: exp.description || "",
//     });

//     setShowEditModal(true);
//   };

//   const handleUpdateExperience = async () => {
//     if (!editingExp?.id) return;

//     try {
//       await fetch(
//         `https://apihrr.goelectronix.co.in/employees/${id}/experiences/${editingExp.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             company_name: editForm.company_name,
//             job_title: editForm.job_title,
//             start_date: editForm.start_date,
//             end_date: editForm.end_date,
//             previous_ctc: Number(editForm.previous_ctc),
//             location: editForm.location,
//             description: editForm.description,
//           }),
//         },
//       );

//       toast.success("Experience updated successfully");

//       setShowEditModal(false);
//       setEditingExp(null);

//       // 🔁 reload experiences (existing function)
//       fetchExperiences();
//     } catch (err) {
//       toast.error("Failed to update experience");
//     }
//   };

//   const handleSubmission = () => {
//     console.log("Document Submitted");

//     // Example: update employee status locally
//     setEmployee((prev) => ({
//       ...prev,
//       status: "document_submitted",
//       doc_date: new Date().toISOString().split("T")[0],
//       doc_remarks: "Documents submitted successfully",
//     }));
//   };

//   const HIDE_SALARY_STATUSES = [
//     "on_probation",
//     "confirmed",
//     "probation_review",
//     "extended",
//     "exited",
//   ];

//   const shouldHideSalaryInsights = HIDE_SALARY_STATUSES.includes(
//     employee?.status,
//   );


// const formatDate = (d) => {
//   if (!d) return null;
//   return d.length > 10 ? d.slice(0, 10) : d; // keep YYYY-MM-DD
// };

// const handleSaveExtraKyc = async () => {
//   try {
//     const payload = {
//       ...kycForm,
//       prev_last_working_date: formatDate(kycForm.prev_last_working_date),
//       nominee_dob: formatDate(kycForm.nominee_dob),
//     };

//     await employeeKycService.create(id, payload);

//     toast.success("PF / Nominee details saved");
//     setShowExtraKycModal(false);
//     fetchKyc();
//   } catch (err) {
//     toast.error(err.message || "Failed to save KYC");
//   }
// };

// const formatRegistryDate = (dateString) => {
//   if (!dateString) return "Not Created";
//   const date = new Date(dateString);
  
//   // Returns format: 12-Mar-2026
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).replace(/ /g, "-");
// };

  

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-slate-500">
//         Loading employee details...
//       </div>
//     );
//   }

//   if (!employee) {
//     return <div className="p-10 text-center">Employee not found</div>;
//   }

//   const isProposedHigherThanRecommended =
//     Number(offerProfile?.offered_ctc || 0) > Math.round(suggestedCTC);

//     const panDocObj = documents?.find(d => d.document_type === "pan");
// const hasPanDocument = panDocObj?.status === "exists";


//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg !text-blue-500 !bg-transparent border border-slate-300 hover:bg-slate-100"
//             >
//               <ArrowLeft size={16} />
//             </button>
//             <h1 className="text-2xl font-bold text-slate-900">
//               Employee Details
//             </h1>
//           </div>
//           <p className="text-sm text-slate-500 mt-2">
//             Dashboard <span className="mx-1">•</span> Employees{" "}
//             <span className="mx-1">•</span>{" "}
//             <span className="text-slate-700">Employee Details</span>
//           </p>
//         </div>
//         {/* NEW BUTTON */}
//         {/* <button
//           onClick={() => setIsExitModalOpen(true)}
//           className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
//         >
//           Mark Employee Exit
//         </button> */}
//         <div className="flex items-center gap-3">
  
//   {/* EXTRA KYC BUTTON */}
//   <button
//     onClick={() => setShowExtraKycModal(true)}
//     className="px-5 py-2.5 !bg-white !text-blue-500 border border-blue-600 rounded-xl text-sm font-bold hover:bg-white  transition-all"
//   >
//     Add PF / Nominee Details
//   </button>

//   {/* EXIT BUTTON */}
//   <button
//     onClick={() => setIsExitModalOpen(true)}
//     className="px-5 py-2.5 !bg-white !text-blue-500 rounded-xl text-sm font-bold hover:!bg-white border border-blue-500 transition-all"
//   >
//     Mark Employee Exit
//   </button>

// </div>

//       </div>

//       {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
//       {/* <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
         
//           <div className="space-y-3">
//             <GridItem
//               label="Employee Code"
//               value={employee.employee_code}
//               bold
//             />
//             <GridItem label="Full Name" value={employee.full_name?.toUpperCase()} />
//           </div>

        
//           <div className="space-y-3">
//             <GridItem label="Email" value={employee.email} />
//             <GridItem label="Phone" value={employee.phone} />
//           </div>

       
//           <div className="space-y-3">
//             <GridItem label="Role" value={employee.role?.toUpperCase()} />
//             <GridItem label="Joining Date" value={employee.joining_date} />
//           </div>

//           <div className="space-y-3">
//             <GridItem
//               label="Department Name"
//               value={employee.department_name?.toUpperCase()}
//             />
//             <GridItem label="Status">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
//                   employee.status === "active" ||
//                   employee.status === "offer_accepted"
//                     ? "bg-green-100 text-green-700 border border-green-200"
//                     : employee.status === "offer_rejected"
//                       ? "bg-red-100 text-red-700 border border-red-200"
//                       : employee.status === "created"
//                         ? "bg-blue-100 text-blue-700 border border-blue-200"
//                         : "bg-slate-200 text-slate-700 border border-slate-300"
//                 }`}
//               >
               
//                 <span
//                   className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
//                     employee.status === "active" ||
//                     employee.status === "offer_accepted"
//                       ? "bg-green-500"
//                       : employee.status === "offer_rejected"
//                         ? "bg-red-500"
//                         : employee.status === "created"
//                           ? "bg-blue-500"
//                           : "bg-slate-500"
//                   }`}
//                 />
//                 {employee.status.replace("_", " ")}
//               </span>
//             </GridItem>
//           </div>
//         </div>
//       </div> */}

//       {/* EXTRA DETAILS */}
// {/* <div className="border-t border-slate-100 mt-6 pt-6">
//   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
//     Emergency & Medical Details
//   </h3>

//   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
    
   
//     <GridItem
//       label="Blood Group"
//       value={employee.blood_group?.toUpperCase() || "-"}
//     />

   
//     <GridItem
//       label="Emergency Contact Name"
//       value={employee.emergency_contact_name?.toUpperCase() || "-"}
//     />


//     <GridItem
//       label="Relation"
//       value={employee.emergency_contact_relation?.toUpperCase() || "-"}
//     />

  
//     <GridItem
//       label="Emergency Phone"
//       value={employee.emergency_contact_phone || "-"}
//     />

//   </div>
// </div> */}

// <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
  
//   {/* SYSTEM HEADER BAR */}
//   <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
//     <div className="flex items-center gap-3">
//       <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse" />
//       <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Employee Data</span>
//     </div>
//     <div className="flex items-center gap-2">
//        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
//          Employee Id: {employee.id || 'N/A'}
//        </span>
//     </div>
//   </div>

//   <div className="p-10 space-y-12">
    
//     {/* PRIMARY DATA GRID */}
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
      
//       {/* COLUMN 1: SYSTEM IDENTITY */}
//       <div className="space-y-6 relative">
//         <RegistryItem 
//           label="Employee Code" 
//           value={employee.employee_code} 
//           bold 
//           icon={<Hash size={12} className="text-blue-500" />} 
//         />
//         <RegistryItem 
//           label="Full name" 
//           value={employee.full_name?.toUpperCase()} 
//           icon={<User size={12} className="text-slate-400" />} 
//         />
//       </div>

//       {/* COLUMN 2: COMMUNICATIONS */}
//       <div className="space-y-6 md:border-l md:border-slate-100 md:pl-10">
//         <RegistryItem 
//           label="Primary Email" 
//           value={employee.email} 
//           icon={<Mail size={12} className="text-slate-400" />} 
//         />
//         <RegistryItem 
//           label="Contact Number" 
//           value={employee.phone} 
//           icon={<Smartphone size={12} className="text-slate-400" />} 
//         />
//       </div>

//       {/* COLUMN 3: ROLE & LOGISTICS */}
//       <div className="space-y-6 md:border-l md:border-slate-100 md:pl-10">
//         <RegistryItem 
//           label="Role" 
//           value={employee.role?.toUpperCase()} 
//           icon={<Briefcase size={12} className="text-slate-400" />} 
//         />
//         <RegistryItem 
//           label="Joining Date" 
//           value={formatRegistryDate(employee.joining_date)}
//           icon={<Calendar size={12} className="text-slate-400" />} 
//         />
//       </div>

//       {/* COLUMN 4: DEPARTMENT & STATE */}
//       <div className="space-y-6 md:border-l md:border-slate-100 md:pl-10">
//         <RegistryItem 
//           label="Assigned Department" 
//           value={employee.department_name?.toUpperCase()} 
//           icon={<Activity size={12} className="text-slate-400" />} 
//         />
        
//         <div className="space-y-2">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
//           <span
//             className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
//               employee.status === "active" || employee.status === "offer_accepted"
//                 ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                 : employee.status === "offer_rejected"
//                   ? "bg-rose-50 text-rose-700 border-rose-100"
//                   : "bg-blue-50 text-blue-700 border-blue-100"
//             }`}
//           >
//             <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
//               employee.status === "active" || employee.status === "offer_accepted" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
//             }`} />
//             {employee.status.replace("_", " ")}
//           </span>
//         </div>
//       </div>
//     </div>

//     {/* SECONDARY REGISTRY: CONTINGENCY PROTOCOLS */}
//     <div className="pt-10 border-t border-slate-100">
//       <div className="flex items-center gap-3 mb-8">
//         <div className="p-1.5 bg-rose-50 rounded-lg border border-rose-100 shadow-sm">
//           <ShieldAlert size={14} className="text-rose-500" />
//         </div>
//         <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">
//           Emergency Details
//         </h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
//         <RegistryItem label="Blood Group" value={employee.blood_group?.toUpperCase()} icon={<Droplets size={12} className="text-rose-400" />} />
//         <RegistryItem label="emergency Contact" value={employee.emergency_contact_name?.toUpperCase()} icon={<User size={12} className="text-slate-400" />} />
//         <RegistryItem label="Relation" value={employee.emergency_contact_relation?.toUpperCase()} icon={<Activity size={12} className="text-slate-400" />} />
//         <RegistryItem label="emergency Number" value={employee.emergency_contact_phone} icon={<Smartphone size={12} className="text-slate-400" />} />
//       </div>
//     </div>

//   </div>
// </div>


//       {/* Experience SECTION */}

//       <div className="space-y-8 mt-4 mb-4">
//         <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//               <Briefcase size={24} />
//             </div>
//             <div>
//               <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
//                 Professional Experience
//               </h2>
//               <p className="text-sm text-slate-500 font-medium">
//                 Verified work history and career progression
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => {
//               () => setDraftExperiences([...draftExperiences, emptyExperience]);
//               setShowExperienceModal(true);
//             }}
//             className="flex items-center gap-2 px-5 py-2.5 border border-blue-500 text-sm font-bold !bg-white !text-blue-500 rounded-xl hover:bg-slate-800 transition-all "
//           >
//             <PlusCircle size={18} /> Add Experience
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//             {sortedExperiences.length > 0 ? (
//               sortedExperiences.map((exp, index) => (
//                 <div key={exp.id || index} className="relative pl-12 group">
//                   <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
//                     <span className="text-[10px] font-bold">{index + 1}</span>
//                   </div>

//                   <div className="bg-white border border-slate-200 p-5 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
//                     <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//                       <div>
//                         <h3 className="text-lg font-bold text-slate-800">
//                           {exp.job_title}
//                         </h3>
//                         <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
//                           {exp.company_name}
//                         </p>
//                       </div>

//                       <div>
//                         <button
//                           onClick={() => handleEditExperience(exp)}
//                           className="flex items-center gap-1 px-3 py-1.5 text-[11px] !text-blue-500 font-bold !bg-white border border-blue-500 hover:bg-slate-200 rounded-lg"
//                         >
//                           <Edit3 size={14} /> Edit
//                         </button>
//                       </div>

//                       <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-right">
//                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                           Previous CTC
//                         </p>
//                         <p className="text-sm font-black text-slate-700">
//                           ₹{(exp.previous_ctc / 100000).toFixed(2)} LPA
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
//                       <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//                         <Calendar size={14} /> {exp.start_date} — {exp.end_date}
//                       </span>
//                       <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//                         <MapPin size={14} /> {exp.location}
//                       </span>
//                     </div>

//                     <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border-l-2 border-slate-200 italic">
//                       "{exp.description}"
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="relative pl-12">
//                 <div className="absolute left-0 w-10 h-10 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
//                   <Briefcase size={16} className="text-slate-400" />
//                 </div>

//                 <div className="bg-white border border-dashed border-slate-300 p-10 rounded-2xl flex flex-col items-center justify-center text-center">
//                   <div className="p-4 bg-slate-50 rounded-full mb-4">
//                     <User size={32} className="text-slate-300" />
//                   </div>
//                   <h3 className="text-lg font-bold text-slate-800">
//                     No Professional Experience
//                   </h3>
//                   <p className="text-sm text-slate-500 max-w-[280px] mt-1">
//                     This candidate is currently marked as a{" "}
//                     <strong>Fresher</strong> or no previous work history has
//                     been recorded yet.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {!shouldHideSalaryInsights ? (
//             <div className="space-y-6">
//               <div className="bg-white rounded-3xl p-6 border border-blue-500 text-white shadow-sm relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-4 opacity-10">
//                   <TrendingUp size={80} />
//                 </div>

//                 <h3 className="text-lg font-bold mb-6 flex !text-slate-800 items-center gap-2">
//                   <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                   Salary Insights
//                 </h3>

//                 <div className="space-y-6 relative z-10">
//                   <div>
//                     <p className="!text-slate-800 text-[10px] font-bold uppercase tracking-widest mb-1">
//                       Average Historic CTC
//                     </p>
//                     <p className="text-2xl !text-slate-800 font-black">
//                       ₹{avgCTC.toLocaleString("en-IN")}
//                     </p>
//                   </div>

//                   <div className="pt-1 border-t border-white/10">
//                     <p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mb-1">
//                       Last Drawn (Benchmark)
//                     </p>
//                     <p className="text-2xl font-black text-blue-400">
//                       ₹{lastDrawn.toLocaleString("en-IN")}
//                     </p>
//                   </div>

//                   <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
//                     <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">
//                       Recommended Offer
//                     </p>
//                     <p className="text-3xl font-black text-white">
//                       ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
//                     </p>
//                     <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
//                       +20% Market Hike
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
//                 <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
//                   <Globe size={16} /> Recruitment Advice
//                 </h4>
//                 <p className="text-xs text-blue-700 leading-relaxed">
//                   The candidate has shown a{" "}
//                   <strong>
//                     {(
//                       ((lastDrawn - (experiences[0]?.previous_ctc || 0)) /
//                         (experiences[0]?.previous_ctc || 1)) *
//                       100
//                     ).toFixed(0)}
//                     %
//                   </strong>{" "}
//                   salary growth over their career. We suggest sticking to the
//                   recommended offer to maintain internal parity.
//                 </p>
//               </div> */}
//             </div>
//           ) : (
//             /* ================= CURRENT SALARY (NEW UI) ================= */
            
//             <div className="space-y-6">
//               <div className="group relative !bg-white rounded-xl p-8 text-white  overflow-hidden border border-blue-500">
//                 {/* AMBIENT BACKGROUND GLOW */}
//                 <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:!bg-blue-500/20 transition-all duration-700" />

//                 {/* HEADER SECTION */}
//                 <div className="flex items-center justify-between mb-8">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl !bg-white border !border-white flex items-center justify-center backdrop-blur-md">
//                       <span className="w-2 h-2 !bg-blue-500 rounded-full animate-pulse " />
//                     </div>
//                     <div>
//                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 leading-none mb-1.5">
//                         Offered by Company
//                       </h3>
//                       <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
//                         Active Salary Structure
//                       </p>
//                     </div>
//                   </div>

//                   {/* SHIELD ICON FOR SECURITY FEEL */}
//                   <div className="p-2 rounded-lg !bg-blue-500/10 border !border-blue-500 !text-blue-500">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* MAIN CTC DISPLAY */}
//                 <div className="space-y-8">
//                   <div>
//                     <div className="flex items-end gap-2 mb-1">
//                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
//                         Annual Gross CTC
//                       </p>
//                     </div>
//                     <div className="flex items-baseline gap-1">
//                       <span className="text-xl font-bold text-blue-500">
//                         ₹
//                       </span>
//                       <p className="text-4xl font-black tracking-tight !text-black group-hover:text-emerald-400 transition-colors duration-500">
//                         {(employee?.offered_ctc || 0).toLocaleString("en-IN")}
//                       </p>
//                       {/* <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
//                         INR
//                       </span> */}
//                     </div>
//                   </div>

//                   {/* STATUS SECTION */}
//                   <div className="pt-6 border-t border-white/5 relative">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
//                           Employment Status
//                         </p>
//                         <div className="flex items-center gap-2">
//                           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
//                             <p className="text-[11px] font-black text-blue-600 border border-blue-500 rounded-xl px-3 py-1 uppercase tracking-wider">
//                               {employee?.status?.replaceAll("_", " ") ||
//                                 "UNVERIFIED"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* MICRO-TRENDING INDICATOR */}
                     
//                     </div>
//                   </div>
//                 </div>

//                 {/* DECORATIVE BOTTOM SCAN-LINE */}
//                 <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}

//       <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           {/* <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               🏠 Address Details
//             </h2>
//             <p className="text-sm text-slate-500">
//               Current & permanent address information
//             </p>
//           </div> */}
//           <div className="flex items-center gap-4 mb-8">
//     <div className="w-12 h-12 bg-white rounded-2xl flex border border-blue-500 items-center justify-center shadow-md shadow-slate-100">
//       <Home size={18} className="text-blue-500" strokeWidth={2.5} />
//     </div>
//     <div>
//       <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//         Address Details
//       </h2>
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//         Verified Address & Location
//       </p>
//     </div>
//   </div>

//           <button
//             onClick={() => setShowAddressModal(true)}
//             className="px-4 py-2 text-sm border border-blue-500 font-semibold !bg-white !text-blue-500 rounded-lg hover:bg-blue-700"
//           >
//             {address ? "Update Address" : "Add Address"}
//           </button>
//         </div>

//         {/* CONTENT */}
//         {addressLoading ? (
//           <div className="text-center py-10 text-slate-500">
//             Loading address...
//           </div>
//         ) : address ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//             {/* CURRENT ADDRESS CARD */}
//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Current Address"
//                 value={`${address?.current_address_line1 || "-"}, ${address?.current_city || "-"}, ${address?.current_state || "-"} - ${address?.current_pincode || "-"}`}
//               />

//               <div className="flex items-start gap-2">
//                 {/* VERIFIED */}
//                 {address?.current_address_status === "verified" && (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 )}

//                 {/* DOCUMENT EXISTS → VERIFY */}
//                 {address?.current_address_status !== "verified" &&
//                   currentDoc?.status === "exists" && (
//                     <button
//                       onClick={() => {
//                         setVerifyForm({
//                           type: "current",
//                           status: "verified",
//                           remarks: "",
//                         });
//                         setShowVerifyModal(true);
//                       }}
//                       className="px-3 py-1.5 text-xs font-semibold !bg-white !text-blue-500 border !border-blue-500 rounded-lg"
//                     >
//                       Verify
//                     </button>
//                   )}

//                 {/* ✅ VIEW BUTTON */}
//                 {currentDoc?.status === "exists" &&
//                   currentDoc?.document?.document_path && (
//                     <button
//                       onClick={() =>
//                         window.open(
//                           `${currentDoc.document.document_path}`,
//                           "_blank",
//                         )
//                       }
//                       className="px-3 py-1.5 text-xs font-semibold !bg-white border !border-blue-500 !text-blue-500 rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {/* DOCUMENT NOT EXISTS → UPLOAD */}
//                 {/* {currentDoc?.status === "not_exists" && (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     Upload Proof
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_current",
//                             e.target.files[0],
//                           );
//                           toast.success("Current address proof uploaded");
//                           fetchDocuments();
//                         } catch (err) {
//                           toast.error(err.message);
//                         }
//                       }}
//                     />
//                   </label>
//                 )} */}
//                 {currentDoc?.status === "not_exists" && (
//   <label
//     className={`px-3 py-1.5 !text-[10px] font-semibold rounded-lg cursor-pointer ${
//       uploading
//         ? "!bg-slate-100 !text-slate-400 pointer-events-none"
//         : "!bg-slate-200 !text-slate-700"
//     }`}
//   >
//     {uploading ? "Uploading..." : "Upload Proof"}

//     <input
//       type="file"
//       hidden
//       disabled={uploading}
//       onChange={async (e) => {
//         try {
//           setUploading(true);

//           await employeeAddressService.uploadDocument(
//             id,
//             "address_proof_current",
//             e.target.files[0]
//           );

//           toast.success("Current address proof uploaded");
//           await fetchDocuments();
//         } catch (err) {
//           toast.error(err.message);
//         } finally {
//           setUploading(false);
//         }
//       }}
//     />
//   </label>
// )}

//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}

//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address?.permanent_address_line1 || "-"}, ${address?.permanent_city || "-"}, ${address?.permanent_state || "-"} - ${address?.permanent_pincode || "-"}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address?.permanent_address_status === "verified" && (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 )}

//                 {address?.permanent_address_status !== "verified" &&
//                   permanentDoc?.status === "exists" && (
//                     <button
//                       onClick={() => {
//                         setVerifyForm({
//                           type: "permanent",
//                           status: "verified",
//                           remarks: "",
//                         });
//                         setShowVerifyModal(true);
//                       }}
//                       className="px-3 py-1.5 text-xs font-semibold !bg-white !text-blue-500 border !border-blue-500 rounded-lg"
//                     >
//                       Verify
//                     </button>
//                   )}

//                 {/* ✅ VIEW BUTTON */}
//                 {permanentDoc?.status === "exists" &&
//                   permanentDoc?.document?.document_path && (
//                     <button
//                       onClick={() =>
//                         window.open(
//                           `${permanentDoc.document.document_path}`,
//                           "_blank",
//                         )
//                       }
//                       className="px-3 py-1.5 text-xs font-semibold !bg-white border !border-blue-500 !text-blue-500 rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {/* {permanentDoc?.status === "not_exists" && (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     Upload Proof
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_permanent",
//                             e.target.files[0],
//                           );
//                           toast.success("Permanent address proof uploaded");
//                           fetchDocuments();
//                         } catch (err) {
//                           toast.error(err.message);
//                         }
//                       }}
//                     />
//                   </label>
//                 )} */}

//                 {permanentDoc?.status === "not_exists" && (
//   <label
//     className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg cursor-pointer ${
//       uploading
//         ? "!bg-slate-100 !text-slate-400 pointer-events-none"
//         : "!bg-slate-200 !text-slate-700"
//     }`}
//   >
//     {uploading ? "Uploading..." : "Upload Proof"}

//     <input
//       type="file"
//       hidden
//       disabled={uploading}
//       onChange={async (e) => {
//         try {
//           setUploading(true);

//           await employeeAddressService.uploadDocument(
//             id,
//             "address_proof_permanent",
//             e.target.files[0]
//           );

//           toast.success("Permanent address proof uploaded");
//           await fetchDocuments();
//         } catch (err) {
//           toast.error(err.message);
//         } finally {
//           setUploading(false);
//         }
//       }}
//     />
//   </label>
// )}

//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-sm text-slate-500 py-6">
//             No address added yet.
//           </div>
//         )}
//       </div>

//       {showAddressModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* High-End Backdrop */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
//             onClick={() => setShowAddressModal(false)}
//           />

//           {/* Modal Container */}
//           <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
//             {/* 1. Header: Overlapping / Sticky Style */}
//             <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                   {address ? "Update Address Profile" : "Add Address Details"}
//                 </h2>
//                 <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.15em] mt-0.5">
//                   Personnel_Location_Master / v2.0
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowAddressModal(false)}
//                 className="p-2 rounded-full !bg-white hover:!bg-white !text-blue-500 transition-all"
//               >
//                 <XCircle size={22} />
//               </button>
//             </div>

//             {/* 2. Scrollable Form Body */}
//             <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30 custom-scrollbar">
//               {/* CURRENT ADDRESS SECTION */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
//                     <MapPin size={18} />
//                   </div>
//                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
//                     Current Residence
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="md:col-span-2 flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       Address Line 1
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.current_address_line1 || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           current_address_line1: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="md:col-span-2 flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       Address Line 2
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.current_address_line2 || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           current_address_line2: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       City
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.current_city || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           current_city: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       State
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.current_state || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           current_state: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       Pincode
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.current_pincode || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           current_pincode: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="relative py-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-slate-200"></div>
//                 </div>
//                 <div className="relative flex justify-center">
//                   <span className="bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
//                     Transition
//                   </span>
//                 </div>
//               </div>

//               {/* PERMANENT ADDRESS SECTION */}
//               <div className="space-y-6">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
//                       <Home size={18} />
//                     </div>
//                     <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
//                       Permanent Residence
//                     </h3>
//                   </div>

//                   {/* SYNC TOOL */}
//                   <label className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:shadow-sm transition-all group">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setAddressForm({
//                             ...addressForm,
//                             permanent_address_line1:
//                               addressForm.current_address_line1,
//                             permanent_address_line2:
//                               addressForm.current_address_line2,
//                             permanent_city: addressForm.current_city,
//                             permanent_state: addressForm.current_state,
//                             permanent_pincode: addressForm.current_pincode,
//                           });
//                         }
//                       }}
//                     />
//                     <span className="text-[11px] font-black text-slate-500 group-hover:text-indigo-600 uppercase tracking-tight transition-colors">
//                       Same as Current Address
//                     </span>
//                   </label>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="md:col-span-2 flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       Address Line 1
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.permanent_address_line1 || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           permanent_address_line1: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="md:col-span-2 flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       Address Line 2
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.permanent_address_line2 || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           permanent_address_line2: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       City
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.permanent_city || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           permanent_city: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       State
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.permanent_state || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           permanent_state: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                       Pincode
//                     </label>
//                     <input
//                       className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={addressForm?.permanent_pincode || ""}
//                       onChange={(e) =>
//                         setAddressForm({
//                           ...addressForm,
//                           permanent_pincode: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 3. Sticky Footer */}
//             <div className="px-8 py-5 !bg-slate-50 border-t !border-slate-100  flex items-center justify-end gap-3 sticky bottom-0 z-20">
//               <button
//                 onClick={() => setShowAddressModal(false)}
//                 className="px-5 py-2.5 !bg-white border border-blue-600 !text-blue-500 text-sm font-bold text-slate-500 rounded-xl hover:text-slate-800 transition-all"
//               >
//                 Cancel
//               </button>
//               {/* <button
//                 onClick={async () => {
//                   if (address) {
//                     await employeeAddressService.update(id, addressForm);
//                   } else {
//                     await employeeAddressService.create(id, addressForm);
//                   }
//                   setShowAddressModal(false);
//                   fetchAddress();
//                 }}
//                 className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
//               >
//                 <Save size={18} />
//                 {address ? "Sync Updates" : "Save Address"}
//               </button> */}
            

// <button
//   onClick={async () => {
//     try {
//       await toast.promise(
//         (async () => {
//           if (address) {
//             return await employeeAddressService.update(id, addressForm);
//           } else {
//             return await employeeAddressService.create(id, addressForm);
//           }
//         })(),
//         {
//           loading: address ? "Updating address..." : "Saving address...",
//           success: address ? "Address updated successfully ✅" : "Address saved successfully ✅",
//           error: "Failed to save address ❌",
//         }
//       );

//       setShowAddressModal(false);
//       fetchAddress();
//     } catch (err) {
//       console.error(err);
//     }
//   }}
//   className="flex items-center gap-2 px-8 py-2.5 !bg-white hover:bg-white !text-blue-500 text-sm font-bold rounded-xl border border-blue-600 transition-all active:scale-95"
// >
//   <Save size={18} />
//   {address ? "Sync Updates" : "Save Address"}
// </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {showVerifyModal && (
//         <Modal title="Verify Address" onClose={() => setShowVerifyModal(false)}>
//           {/* INFO */}
//           <p className="text-sm text-slate-600 mb-4">
//             Verifying{" "}
//             <span className="font-semibold capitalize">{verifyForm.type}</span>{" "}
//             address
//           </p>

//           {/* REMARKS (ONLY INPUT) */}
//           <div className="mb-6">
//             <label className="block text-slate-500 font-medium mb-1">
//               Remarks
//             </label>
//             <textarea
//               value={verifyForm.remarks}
//               onChange={(e) =>
//                 setVerifyForm({ ...verifyForm, remarks: e.target.value })
//               }
//               placeholder="Enter verification remarks"
//               className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowVerifyModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 try {
//                   await employeeAddressService.verify(id, verifyForm);
//                   toast.success("Address verified successfully");
//                   setShowVerifyModal(false);
//                   fetchAddress();
//                 } catch (err) {
//                   toast.error(err.message);
//                 }
//               }}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//             >
//               Verify
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* offer SECTION */}
//       <div>
//         {![
//           "offer_accepted",
//           "confirmed",
//           "joining_letter",
//           "extended",
//           "on_probation",
//           "probation_review",
//         ].includes(localStatus) ? (
//           <OfferLatter
//             employee={employee}
//              setParentStatus={setLocalStatus}
//             fetchEmployee={fetchEmployee}
//             recommendedCtc={Math.round(suggestedCTC)}
//           />
//         ) : (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Identity & Data */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Icon Representation of a Document */}
//               <div className="flex-shrink-0 h-14 w-14 rounded-xl !bg-white border !border-blue-100 flex items-center justify-center !text-blue-600 shadow-sm">
//                 <FileText size={24} strokeWidth={1.5} />
//               </div>

//               <div className="ml-4 flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
//                     {offerProfile?.full_name || "-"}
//                   </h3>
//                   <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                 </div>

//                 {/* Designation & Package Row */}
//                 <div className="flex items-center gap-6 mt-1">
//                   <div className="flex flex-col">
//                     <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                       Designation
//                     </span>
//                     <span className="text-[12px] text-slate-600 font-medium">
//                       {offerProfile?.role || "-"}
//                     </span>
//                   </div>

//                   <div className="h-6 w-[1px] bg-slate-100"></div>

//                   <div className="flex flex-col">
//                     <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                       Offer Amount
//                     </span>
//                     <span className="text-[12px] text-slate-900 font-mono font-bold">
//                       ₹{offerProfile?.offered_ctc || "-"}
//                       <span className="text-[10px] text-slate-400 ml-0.5">
//                         /annum
//                       </span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Section: Actions & Status */}
//             <div className="mt-5 lg:mt-0 w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-end gap-4">
//               {/* Download Button - Professional Ghost Style */}

//               <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>

//               {/* Attractive Success Indicator */}
//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-100/50 text-emerald-600 shadow-lg shadow-emerald-600/10">
//                 <CheckCircle2 size={16} strokeWidth={3} />
//                 <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                   Completed
//                 </span>
//               </div>
//             </div>

//             {/* Subtle Background Badge for "Signed" status */}
//             <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
//               <CheckCircle2 size={80} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* joining SECTION */}
//       <div>
//         {/* 1️⃣ If status is offer_accepted */}
//         {employee?.status === "offer_accepted" && (
//           <JoiningDispatchUI employee={employee}  fetchEmployee={fetchEmployee}  />
//         )}

//         {/* 2️⃣ If status is confirmed */}
//         {["confirmed", "on_probation" , "probation_review"].includes(employee?.status) && (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Logistics & Reporting */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Document Branding Icon */}
//               <div className="flex-shrink-0 h-14 w-14 rounded-xl !bg-white border !border-blue-100 flex items-center justify-center !text-blue-600 shadow-sm">
//                 <FileCheck size={28} strokeWidth={1.5} />
//               </div>

//               <div className="ml-5 flex flex-col gap-2">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
//                     Joining Formalities
//                   </h3>
//                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 uppercase tracking-wider">
//                     Confirmed
//                   </span>
//                 </div>

//                 {/* Logistics Grid */}
//                 <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
//                   {/* Joining Date */}
//                   <div className="flex items-center gap-2.5">
//                     <div className="p-1.5 bg-slate-50 rounded-md">
//                       <Calendar size={14} className="text-slate-400" />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
//                         Joining Date
//                       </span>
//                       <span className="text-[12px] text-slate-700 font-semibold">
//                         {employee?.joining_date
//                           ? new Date(
//                               employee.joining_date,
//                             ).toLocaleDateString("en-IN", {
//                               day: "numeric",
//                               month: "short",
//                               year: "numeric",
//                             })
//                           : "-"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Reporting To */}
//                   <div className="flex items-center gap-2.5">
//                     <div className="p-1.5 bg-slate-50 rounded-md">
//                       <UserCheck size={14} className="text-slate-400" />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
//                         Reporting To
//                       </span>
//                       <span className="text-[12px] text-slate-700 font-semibold">
//                         {employee?.reporting_manager_name}{" "}
//                         <span className="text-slate-400 font-normal text-[11px]">
//                           (VP Ops)
//                         </span>
//                       </span>
//                     </div>
//                   </div>

//                   {/* Reporting Time */}
//                   <div className="flex items-center gap-2.5">
//                     <div className="p-1.5 bg-slate-50 rounded-md">
//                       <Clock size={14} className="text-slate-400" />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
//                         Reporting Time
//                       </span>
//                       <span className="text-[12px] text-slate-700 font-semibold">
//                         {employee?.joining_time || "-"}{" "}
//                         <span className="text-slate-400 font-normal text-[11px]">
//                           (IST)
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Section: Professional CTA Group */}
//             <div className="mt-6 lg:mt-0 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
//               {/* Download Joining Letter - Enterprise Style */}

//               <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>

//               {/* Final Status Indicator */}
//               <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-100/50 text-emerald-600 shadow-md shadow-emerald-600/20">
//                 <CheckCircle2 size={18} strokeWidth={2.5} />
//                 <div className="flex flex-col items-start leading-none">
//                   <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                     {/* Onboarded */}
//                     Joining Letter Send
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Professional Watermark */}
//             <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
//               <FileCheck size={120} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* document verification employee */}
//       <div className="w-full mb-4 mt-4 p-1 md:p-1 lg:p-1 flex justify-center">
//         <div className="w-full  flex flex-col gap-8">

//           {/* 2. THE COMPONENT CONTAINER (No Borders, Layered Elevation) */}
//           <div className="relative group transition-all duration-500">
//             {/* Decorative Glow (Ambient Background) */}
//             <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>

//             {/* The Main Content Card */}
//             {/* <div className="relative bg-white/80  rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden"> */}
//             <div className="relative bg-white/80 rounded-xl  overflow-hidden">
//               {/* Subtle Internal Shadow for Depth */}
//               <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-900/5 pointer-events-none"></div>

//               <DocumentSubmissionUI
//                 employeeId={employee.id}
//                 status={employee.doc_submission_status}
//                 submissionDate={employee.doc_date}
//                 remarks={employee.doc_remarks}
//                 onDocumentSubmit={handleSubmission}
//                 employee={employee}
//                 employeedata={offerProfile}
//               />
//             </div>
//           </div>
//         </div>
//       </div>


//       <div>
//         <AllkycVerified />
//         </div>

     

      

      
//       {/* policy doc SECTION */}
//       <div className=" rounded-xl mt-4 mb-4">
//         <PolicyStepper employeeId={employee.id} />
//       </div>

//     {/* esign SECTION */}
//       <div className="mt-4 mb-4 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
//         <h2 className="text-lg font-bold text-slate-900 mb-4">
//           eSign KYC Verification
//         </h2>

//         {/* esign ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
//           <button
//             onClick={() =>
//               setOpenVerify(openVerify === "esign" ? null : "esign")
//             }
//             className="w-full flex justify-between !bg-white items-center px-5 py-4 font-bold !text-slate-500 hover:!bg-slate-50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
//               eSign Verification
//             </div>
//             <span>{openVerify === "esign" ? "−" : "+"}</span>
//           </button>

//           {openVerify === "esign" && (
//             <div className="p-6 bg-slate-50/40 border-t">
//               {console.log("ssssss", isEsignSigned)}

//               {/* ================= VERIFIED VIEW ================= */}
//               {isEsignSigned && (
//                 <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//                   {/* Left Info */}
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
//                         eSign Status
//                       </p>
//                       <p className="text-xl font-black text-emerald-600">
//                         SIGNED
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{latestEsign.verification_id}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Last Updated
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(
//                             latestEsign.updated_at,
//                           ).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     {latestEsign.signed_doc_url && (
//                       <button
//                         onClick={() =>
//                           window.open(latestEsign.signed_doc_url, "_blank")
//                         }
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
//                       >
//                         <Download size={14} /> Download Signed Document
//                       </button>
//                     )}
//                   </div>

//                   {/* Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
//                     <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />
//                     <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                       <CheckCircle2 size={32} className="text-white" />
//                     </div>
//                     <h4 className="mt-4 text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               )}

//               {/* ================= LINK GENERATED ================= */}
//               {!isEsignSigned && isEsignLinkGenerated && (
//                 <div className="flex flex-col items-center justify-center text-center py-10">
//                   <Clock size={40} className="text-amber-500 mb-3" />
//                   <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">
//                     Awaiting Signature
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-2 max-w-sm">
//                     The eSign link has been generated and sent to the employee.
//                     Waiting for Aadhaar-based signature completion.
//                   </p>
//                 </div>
//               )}

//               {!isEsignSigned && isEsignDocumentUploaded && (
//                 <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
//                   <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//                     {/* Visual Status Indicator */}
//                     <div className="relative flex-shrink-0">
//                       <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="32"
//                           height="32"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="text-blue-500"
//                         >
//                           <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
//                           <path d="M14 2v4a2 2 0 0 0 2 2h4" />
//                           <path d="M9 15l2 2 4-4" />
//                         </svg>
//                       </div>
//                       <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center shadow-sm">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="14"
//                           height="14"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="3"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="text-white animate-spin-slow"
//                         >
//                           <path d="M12 2v4" />
//                           <path d="M12 18v4" />
//                           <path d="M4.93 4.93l2.83 2.83" />
//                           <path d="M16.24 16.24l2.83 2.83" />
//                           <path d="M2 12h4" />
//                           <path d="M18 12h4" />
//                           <path d="M4.93 19.07l2.83-2.83" />
//                           <path d="M16.24 7.76l2.83-2.83" />
//                         </svg>
//                       </div>
//                     </div>

//                     {/* Content Section */}
//                     <div className="flex-1 text-center md:text-left space-y-4">
//                       <div>
//                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
//                           <h3 className="text-lg font-bold text-slate-900">
//                             Final Step: Complete eSign
//                           </h3>
//                           <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">
//                             Pending Action
//                           </span>
//                         </div>
//                         <p className="text-sm text-slate-500 leading-relaxed max-w-md">
//                           Your document has been securely processed and is ready
//                           for signature. Please complete the Aadhaar-based eSign
//                           to finalize the agreement.
//                         </p>
//                       </div>

//                       {/* Informational Micro-card */}
//                       <div className="inline-flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
//                         <div className="flex items-center gap-3 pr-4 md:border-r border-slate-100">
//                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
//                           <span className="text-[12px] font-semibold text-slate-600">
//                             Document Uploaded
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <svg
//                             className="w-4 h-4 text-slate-400"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                             />
//                           </svg>
//                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
//                             Verified Secure Vault
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Primary Action */}
//                   </div>
//                 </div>
//               )}

//               {/* ================= UPLOAD FLOW ================= */}

//               {/* ================= AADHAAR INPUT ================= */}

//               <div className="max-w-xl">
//                 {!latestEsign && !documentId && (
//                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
//                     {/* SECTION HEADER */}
//                     <div className="space-y-1">
//                       <h4 className="text-sm font-bold text-slate-500">
//                         Upload E-Sign Document
//                       </h4>
//                       <p className="text-xs text-slate-500">
//                         Supported formats: PDF (Max 5MB)
//                       </p>
//                     </div>

//                     {/* DROPZONE AREA */}
//                     <div className="relative group">
//                       <input
//                         type="file"
//                         id="esign-upload"
//                         onChange={(e) => setEsignFile(e.target.files[0])}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                       />
//                       <div
//                         className={`
//           border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center text-center
//           ${esignFile ? "!border-blue-500 bg-indigo-50/30" : "border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300"}
//         `}
//                       >
//                         <div
//                           className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${esignFile ? "bg-indigo-600 scale-110" : "bg-white shadow-sm"}`}
//                         >
//                           {esignFile ? (
//                             <svg
//                               className="w-7 h-7 text-white"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2.5"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M5 13l4 4L19 7"
//                               />
//                             </svg>
//                           ) : (
//                             <svg
//                               className="w-7 h-7 text-slate-400 group-hover:text-indigo-500"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
//                               />
//                             </svg>
//                           )}
//                         </div>

//                         {esignFile ? (
//                           <div className="space-y-1">
//                             <p className="text-sm font-bold text-slate-800">
//                               {esignFile.name}
//                             </p>
//                             <p className="text-[11px] font-medium text-slate-500">
//                               {(esignFile.size / (1024 * 1024)).toFixed(2)} MB •
//                               Ready to verify
//                             </p>
//                           </div>
//                         ) : (
//                           <p className="text-sm font-medium text-slate-600">
//                             <span className="!text-blue-600 font-bold">
//                               Click to upload
//                             </span>{" "}
//                             or drag and drop
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* ACTIONS */}
//                     <button
//                       onClick={uploadEsignDocument}
//                       disabled={uploading || !esignFile}
//                       className="w-full md:w-auto border !border-blue-600 px-10 h-12 !bg-white !text-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center gap-2"
//                     >
//                       {uploading ? (
//                         <>
//                           <svg
//                             className="animate-spin h-4 w-4 text-white"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             />
//                           </svg>
//                           Processing...
//                         </>
//                       ) : (
//                         "Upload & Continue"
//                       )}
//                     </button>
//                   </div>
//                 )}

//                 {/* ================= AADHAAR INPUT SECTION ================= */}
//                 {!isEsignSigned &&
//                   documentId &&
//                   !isEsignLinkGenerated &&
//                   esignStatus !== "document_uploaded" && (
//                     <div className="mt-8 space-y-5 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
//                           <svg
//                             width="18"
//                             height="18"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2.5"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                           </svg>
//                         </div>
//                         <h4 className="text-sm font-bold text-slate-800">
//                           Confirm Identity
//                         </h4>
//                       </div>

//                       <div className="space-y-2">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
//                           Aadhaar Last 4 Digits
//                         </label>
//                         <div className="flex flex-col sm:flex-row gap-4">
//                           <input
//                             type="text"
//                             maxLength={4}
//                             placeholder="••••"
//                             value={aadhaarLast4}
//                             onChange={(e) =>
//                               setAadhaarLast4(e.target.value.replace(/\D/g, ""))
//                             }
//                             className="w-full sm:w-44 h-12 text-center tracking-[0.5em] text-xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
//                           />
//                           <button
//                             onClick={submitAadhaar}
//                             disabled={aadhaarLast4.length < 4}
//                             className="flex-1 sm:flex-none px-8 h-12 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 shadow-lg shadow-emerald-100 disabled:shadow-none"
//                           >
//                             Submit Details
//                           </button>
//                         </div>
//                         <p className="text-[10px] text-slate-500 flex items-center gap-1.5 ml-1">
//                           <svg
//                             width="12"
//                             height="12"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                           Secure end-to-end encrypted verification
//                         </p>
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

      

//       {/* joining confirmation employee */}
//       {employee?.doc_submission_status === "submitted" && (
//         <div className="mb-4">
//           <JoiningConfirmationUI employee={employee} />
//         </div>
//       )}

//       {/* Assets SECTION */}

//       <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6">
//         <AssetManager
//           previousAssets={previousAssets}
//           assetRows={assetRows}
//           onAdd={addAssetRow}
//           onRemove={removeAssetRow}
//           onChange={handleAssetChange}
//           onApiSubmit={handleSubmitAssets}
//         />
//       </div>

//       {showKycModal && (
//         <Modal
//           title={`Upload ${activeDoc.replace("_", " ")}`}
//           onClose={() => {
//             setShowKycModal(false);
//             setSelectedFile(null);
//           }}
//         >
//           {/* ================= METADATA ================= */}
//           {activeDoc === "aadhaar" && (
//             <Input
//               label="Aadhaar Number"
//               value={kycForm.aadhaar_number}
//               onChange={(v) => setKycForm({ ...kycForm, aadhaar_number: v })}
//             />
//           )}

//           {activeDoc === "pan" && (
//             <Input
//               label="PAN Number"
//               value={kycForm.pan_number}
//               onChange={(v) => setKycForm({ ...kycForm, pan_number: v })}
//             />
//           )}

//           {activeDoc === "bank" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="Account Holder Name"
//                 value={kycForm.account_holder_name}
//                 onChange={(v) =>
//                   setKycForm({ ...kycForm, account_holder_name: v })
//                 }
//               />
//               <Input
//                 label="Account Number"
//                 value={kycForm.account_number}
//                 onChange={(v) => setKycForm({ ...kycForm, account_number: v })}
//               />
//               <Input
//                 label="IFSC Code"
//                 value={kycForm.ifsc_code}
//                 onChange={(v) => setKycForm({ ...kycForm, ifsc_code: v })}
//               />
//             </div>
//           )}

//           {/* ================= FILE UPLOAD ================= */}
//           <div className="mt-4">
//             <label className="block text-slate-500 font-medium mb-1">
//               Upload Document
//             </label>
//             <input
//               type="file"
//               onChange={(e) => setSelectedFile(e.target.files[0])}
//             />
//           </div>

//           {/* ================= ACTIONS ================= */}
//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               onClick={() => setShowKycModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleKycSubmit}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               Save
//             </button>
//           </div>
//         </Modal>
//       )}

//       {showViewModal && (
//         <Modal
//           title={`View ${viewDocType.replace("_", " ")}`}
//           onClose={() => setShowViewModal(false)}
//         >
//           {/* IMAGE */}
//           <div className="mb-4">
//             <img
//               src={getDocumentImage(viewDocType)}
//               alt={viewDocType}
//               className="w-full max-h-80 object-contain border rounded-lg"
//             />
//           </div>

//           {/* METADATA */}
//           {getKycDataByType(viewDocType) && (
//             <div className="text-sm space-y-2">
//               <p>
//                 <span className="font-semibold">
//                   {getKycDataByType(viewDocType).label}:
//                 </span>{" "}
//                 {getKycDataByType(viewDocType).value}
//               </p>

//               {getKycDataByType(viewDocType).extra && (
//                 <p>{getKycDataByType(viewDocType).extra}</p>
//               )}
//             </div>
//           )}
//         </Modal>
//       )}

//       {showExperienceModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           {/* MODAL CONTAINER */}
//           <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
//             {/* 1. STICKY HEADER */}
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800">
//                   Professional Experience
//                 </h2>
//                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
//                   Step 2: Add career history
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowExperienceModal(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//               >
//                 <XCircle size={24} />
//               </button>
//             </div>

//             {/* 2. SCROLLABLE CONTENT AREA */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 custom-scrollbar">
//               {/* {experiences.map((exp, index) => ( */}
//               {draftExperiences.map((exp, index) => (
//                 <div
//                   key={index}
//                   className="group relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all"
//                 >
//                   {/* Entry Badge & Remove Button */}
//                   <div className="flex justify-between items-center mb-6">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full border border-blue-100">
//                       Experience #{index + 1}
//                     </span>

//                     {experiences.length > 1 && (
//                       <button
//                         onClick={() => {
//                           const updated = draftExperiences.filter(
//                             (_, i) => i !== index,
//                           );
//                           // setExperiences(updated);
//                           setDraftExperiences(updated);
//                         }}
//                         className="flex items-center gap-1 text-xs text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors"
//                       >
//                         <Trash2 size={14} /> REMOVE
//                       </button>
//                     )}
//                   </div>

//                   {/* Form Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                     <div className="space-y-1">
//                       <label className={labelStyle}>Company Name</label>
//                       <div className="relative">
//                         <Building2 className={iconStyle} />
//                         <input
//                           type="text"
//                           placeholder="e.g. Google"
//                           className={inputStyle}
//                           value={exp.company_name}
//                           onChange={(e) => {
//                             const updated = [...draftExperiences];
//                             updated[index].company_name = e.target.value;
//                             setDraftExperiences(updated);
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className={labelStyle}>Job Title</label>
//                       <div className="relative">
//                         <Briefcase className={iconStyle} />
//                         <input
//                           type="text"
//                           placeholder="e.g. Senior Developer"
//                           className={inputStyle}
//                           value={exp.job_title}
//                           onChange={(e) => {
//                             //   const updated = [...experiences];
//                             const updated = [...draftExperiences];
//                             updated[index].job_title = e.target.value;
//                             //   setExperiences(updated);
//                             setDraftExperiences(updated);
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className={labelStyle}>Start Date</label>
//                       <input
//                         type="date"
//                         className={inputStyle.replace("pl-10", "pl-4")}
//                         value={exp.start_date}
//                         onChange={(e) => {
//                           // const updated = [...experiences];
//                           const updated = [...draftExperiences];
//                           updated[index].start_date = e.target.value;
//                           // setExperiences(updated);
//                           setDraftExperiences(updated);
//                         }}
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className={labelStyle}>End Date</label>
//                       <input
//                         type="date"
//                         className={inputStyle.replace("pl-10", "pl-4")}
//                         value={exp.end_date}
//                         onChange={(e) => {
//                           // const updated = [...experiences];
//                           const updated = [...draftExperiences];
//                           updated[index].end_date = e.target.value;
//                           // setExperiences(updated);
//                           setDraftExperiences(updated);
//                         }}
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className={labelStyle}>
//                         Previous CTC (Annual)
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
//                           ₹
//                         </span>
//                         <input
//                           type="number"
//                           placeholder="3,00,000"
//                           className={inputStyle}
//                           value={exp.previous_ctc}
//                           onChange={(e) => {
//                             //   const updated = [...experiences];
//                             const updated = [...draftExperiences];
//                             updated[index].previous_ctc = e.target.value;
//                             //   setExperiences(updated);
//                             setDraftExperiences(updated);
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className={labelStyle}>Location</label>
//                       <div className="relative">
//                         <MapPin className={iconStyle} />
//                         <input
//                           type="text"
//                           placeholder="e.g. Mumbai"
//                           className={inputStyle}
//                           value={exp.location}
//                           onChange={(e) => {
//                             //   const updated = [...experiences];
//                             const updated = [...draftExperiences];
//                             updated[index].location = e.target.value;
//                             //   setExperiences(updated);
//                             setDraftExperiences(updated);
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div className="md:col-span-2 space-y-1">
//                       <label className={labelStyle}>Role Description</label>
//                       <textarea
//                         rows={3}
//                         placeholder="Key responsibilities and achievements..."
//                         className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
//                         value={exp.description}
//                         onChange={(e) => {
//                           // const updated = [...experiences];
//                           const updated = [...draftExperiences];
//                           updated[index].description = e.target.value;
//                           // setExperiences(updated);
//                           setDraftExperiences(updated);
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* ADD ANOTHER BUTTON - inside scroll area at bottom */}
//               <button
//                 onClick={() =>
//                   setDraftExperiences([...draftExperiences, emptyExperience])
//                 }
//                 className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
//               >
//                 <PlusCircle size={18} /> ADD ANOTHER EXPERIENCE
//               </button>
//             </div>

//             {/* 3. STICKY FOOTER */}
//             <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowExperienceModal(false)}
//                 className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
//               >
//                 Discard
//               </button>
//               <button
//                 onClick={handleSaveExperience}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
//               >
//                 <Save size={18} /> Finish & Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isExitModalOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           {/* Backdrop: Professional blur with slightly lighter overlay */}
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
//             onClick={() => setIsExitModalOpen(false)}
//           />

//           <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             {/* Top Warning Accent Line */}
//             <div className="h-1.5 w-full bg-rose-500" />

//             {/* Header: More balanced and communicative */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//               <div className="flex gap-4">
//                 <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                     <polyline points="16 17 21 12 16 7" />
//                     <line x1="21" y1="12" x2="9" y2="12" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">
//                     Initiate Offboarding
//                   </h3>
//                   <p className="text-sm text-slate-500 font-medium leading-relaxed">
//                     Please provide the details to process this employee's exit
//                     from the system.
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsExitModalOpen(false)}
//                 className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
//               >
//                 <svg
//                   width="20"
//                   height="20"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M18 6L6 18M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Body: High-clarity inputs with consistent spacing */}
//             <div className="px-8 py-6 space-y-7">
//               {/* Warning Notice: Common in Enterprise Software */}
//               {/* Exit Date */}
//               <div className="space-y-2.5">
//                 <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
//                   Effective Exit Date
//                 </label>
//                 <input
//                   type="date"
//                   value={exitForm.exit_date}
//                   onChange={(e) =>
//                     setExitForm({ ...exitForm, exit_date: e.target.value })
//                   }
//                   className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
//                 />
//               </div>

//               {/* Exit Reason */}
//               <div className="space-y-2.5">
//                 <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
//                   Reason for Separation
//                 </label>
//                 <textarea
//                   rows={4}
//                   placeholder="Document the primary reasons for exit (e.g., Better opportunity, Relocation, etc.)"
//                   value={exitForm.exit_reason}
//                   onChange={(e) =>
//                     setExitForm({ ...exitForm, exit_reason: e.target.value })
//                   }
//                   className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none resize-none placeholder:text-slate-400 placeholder:font-normal"
//                 />
//               </div>
//             </div>

//             {/* Footer: Prominent and grouped actions */}
//             <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
//               <button
//                 onClick={() => setIsExitModalOpen(false)}
//                 className="px-6 py-3 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all"
//               >
//                 Discard Changes
//               </button>

//               <button
//                 onClick={handleEmployeeExit}
//                 className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-rose-700 shadow-xl shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//               >
//                 Confirm Offboarding
//                 <svg
//                   width="18"
//                   height="18"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="m9 18 6-6-6-6" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showEditModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* Backdrop: Deep Blur for focus */}
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
//             onClick={() => setShowEditModal(false)}
//           />

//           {/* Modal Container: Precision Geometry */}
//           <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
//             {/* 1. Header: Matches your Step 2 Style */}
//             <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                   Edit Experience
//                 </h2>
//                 <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.15em] mt-0.5">
//                   System Record : {editForm.company_name || "Entry_v1"}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
//               >
//                 <XCircle size={22} />
//               </button>
//             </div>

//             {/* 2. Form Body: Balanced Information Density */}
//             <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
            

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
//                 {/* Company Name */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     Company Name
//                   </label>
//                   <div className="relative group">
//                     <Building2
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                       size={16}
//                     />
//                     <input
//                       className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={editForm.company_name}
//                       placeholder="e.g. Google"
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           company_name: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Job Title */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     Job Title
//                   </label>
//                   <div className="relative group">
//                     <Briefcase
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                       size={16}
//                     />
//                     <input
//                       className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={editForm.job_title}
//                       placeholder="e.g. Senior Developer"
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, job_title: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Start Date */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                     value={editForm.start_date}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, start_date: e.target.value })
//                     }
//                   />
//                 </div>

//                 {/* End Date */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                     value={editForm.end_date}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, end_date: e.target.value })
//                     }
//                   />
//                 </div>

//                 {/* Previous CTC */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     Previous CTC (Annual)
//                   </label>
//                   <div className="relative group">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs group-focus-within:text-indigo-500 transition-colors">
//                       ₹
//                     </span>
//                     <input
//                       type="number"
//                       className="w-full bg-white border border-slate-200 pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={editForm.previous_ctc}
//                       placeholder="0.00"
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           previous_ctc: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     Work Location
//                   </label>
//                   <div className="relative group">
//                     <MapPin
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
//                       size={16}
//                     />
//                     <input
//                       className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
//                       value={editForm.location}
//                       placeholder="e.g. Mumbai"
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, location: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="md:col-span-2 flex flex-col gap-1.5">
//                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                     Role Description
//                   </label>
//                   <textarea
//                     rows={4}
//                     className="w-full bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
//                     placeholder="Outline your key achievements and impact..."
//                     value={editForm.description}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, description: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* 3. Footer: Clear, Weighted Actions */}
//             <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between sticky bottom-0">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="text-sm !bg-white font-bold !text-slate-500 hover:!text-slate-800 transition-all"
//               >
//                 Discard Changes
//               </button>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="px-5 py-2.5 !bg-white border !border-blue-600 text-sm font-bold !text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdateExperience}
//                   className="flex items-center gap-2 px-8 !border-blue-500 py-2.5 !bg-white hover:bg-indigo-700 !text-blue-600 text-sm font-bold rounded-xl border border-blue-600 transition-all active:scale-[0.98]"
//                 >
//                   <Save size={18} />
//                   Update Record
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//    {showExtraKycModal && (
//   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//     <div
//       className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//       onClick={() => setShowExtraKycModal(false)}
//     />

//     <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

//       {/* HEADER */}
//       <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
//         <h2 className="text-lg font-bold">PF / Nominee Details</h2>
//         <button onClick={() => setShowExtraKycModal(false)}>✕</button>
//       </div>

//       {/* BODY */}
//       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">

//         <Input
//           label="UAN Number"
//           value={kycForm.uan_number || ""}
//           onChange={(v) => setKycForm({ ...kycForm, uan_number: v })}
//         />

//         <SelectYN
//           label="PF Scheme Member"
//           value={kycForm.pf_scheme_member || "No"}
//           onChange={(v) => setKycForm({ ...kycForm, pf_scheme_member: v })}
//         />

//         {kycForm.pf_scheme_member === "Yes" && (
//           <>
//             <Input
//               label="Previous Employer"
//               value={kycForm.prev_employer_name || ""}
//               onChange={(v) =>
//                 setKycForm({ ...kycForm, prev_employer_name: v })
//               }
//             />

//             <Input
//               label="Employer Address"
//               value={kycForm.prev_employer_address || ""}
//               onChange={(v) =>
//                 setKycForm({ ...kycForm, prev_employer_address: v })
//               }
//             />

//             <Input
//               label="Previous PF Account"
//               value={kycForm.prev_pf_account_number || ""}
//               onChange={(v) =>
//                 setKycForm({ ...kycForm, prev_pf_account_number: v })
//               }
//             />

//             <Input
//               label="Last Working Date"
//               type="date"
//               value={kycForm.prev_last_working_date || ""}
//               onChange={(v) =>
//                 setKycForm({ ...kycForm, prev_last_working_date: v })
//               }
//             />

//             <SelectYN
//               label="Transfer PF Balance"
//               value={kycForm.transfer_pf_balance || "No"}
//               onChange={(v) =>
//                 setKycForm({ ...kycForm, transfer_pf_balance: v })
//               }
//             />
//           </>
//         )}

//         <Input
//           label="Nominee Name"
//           value={kycForm.nominee_name || ""}
//           onChange={(v) => setKycForm({ ...kycForm, nominee_name: v })}
//         />

//         <Input
//           label="Nominee Relation"
//           value={kycForm.nominee_relation || ""}
//           onChange={(v) =>
//             setKycForm({ ...kycForm, nominee_relation: v })
//           }
//         />

//         <Input
//           label="Nominee DOB"
//           type="date"
//           value={kycForm.nominee_dob || ""}
//           onChange={(v) =>
//             setKycForm({ ...kycForm, nominee_dob: v })
//           }
//         />

//         <Input
//           label="Nominee Share (%)"
//           value={kycForm.nominee_share || ""}
//           onChange={(v) =>
//             setKycForm({ ...kycForm, nominee_share: v })
//           }
//         />
//       </div>

//       {/* FOOTER */}
//       <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-2">
//         <button
//           onClick={() => setShowExtraKycModal(false)}
//           className="px-4 py-2 border rounded-lg text-sm"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleSaveExtraKyc}
//           className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
//         >
//           Save Details
//         </button>
//       </div>
//     </div>
//   </div>
// )}



//       {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
//       {REVIEW_ALERT_CONFIG[employee?.status] && (
//         <div className="mb-4 mt-4 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
//           <div className="flex flex-col md:flex-row items-center justify-between p-6 lg:px-8">
//             {/* LEFT SIDE: Alert Content */}
//             <div className="flex items-center gap-5">
//               <div className="flex-shrink-0">
//                 <div className="relative">
//                   <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
//                     <History size={28} className="animate-pulse" />
//                   </div>
//                   {/* Pulsing indicator */}
//                   <span className="absolute -top-1 -right-1 flex h-4 w-4">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
//                     Priority
//                   </span>
//                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//                     Probation Period Concluding
//                   </h3>
//                 </div>
//                 <p className="text-sm text-slate-600 font-medium">
//                   This employee's probation phase ends in{" "}
//                   <span className="text-blue-700 font-black">7 days</span>.
//                   Please conduct the final performance review.
//                 </p>
//               </div>
//             </div>

//             {/* RIGHT SIDE: Action Button */}
//             <div className="mt-4 md:mt-0 flex items-center gap-4">
//               {/* Simple count-down visual */}
//               <div className="hidden lg:flex flex-col items-end mr-4">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
//                   Review Deadline
//                 </span>
//               </div>

//               <button
//                 onClick={() => navigate(`/dummyemp/${id}/review`)}
//                 className="flex items-center gap-2 px-8 py-3.5 border-2 border-blue-500 !bg-white hover:!bg-white !text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/10 active:scale-95 group"
//               >
//                 <FileCheck
//                   size={16}
//                   className="group-hover:rotate-6 transition-transform"
//                 />
//                 Conduct Review Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- SMALL UI HELPERS ---------- */

// function Info({ label, value, bold }) {
//   return (
//     <div>
//       <span className="block text-slate-500 font-medium mb-1">{label}</span>
//       <span
//         className={`text-slate-900 ${bold ? "font-bold" : "font-semibold"}`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

// const RegistryItem = ({ label, value, bold, icon }) => (
//   <div className="space-y-2 group">
//     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2 group-hover:text-slate-600 transition-colors">
//       {icon} {label}
//     </p>
//     <p className={`text-[13px] font-bold text-slate-800 ${bold ? 'tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100' : ''}`}>
//       {value || "Not Created"}
//     </p>
//   </div>
// );

// function SelectYN({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <select
//         value={value}
//         onChange={(e)=>onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
//       >
//         <option value="No">No</option>
//         <option value="Yes">Yes</option>
//       </select>
//     </div>
//   );
// }


// function DocumentCard({
//   title,
//   completed,
//   hasFile,
//   onAdd,
//   onView,
//   iconColor = "text-blue-500",
// }) {
//   return (
//     <div className="border border-slate-100 rounded-sm p-4 flex flex-col gap-3 items-center">
//       <div className="p-4 bg-gray-50 rounded-full">
//         <FileText size={32} className={iconColor} />
//       </div>

//       <span className="font-semibold text-sm text-slate-800">{title}</span>

//       {completed && (
//         <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//           <CheckCircle size={14} />
//           Uploaded
//         </span>
//       )}

//       <div className="flex gap-2">
//         {!completed && (
//           <button
//             onClick={onAdd}
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold !bg-white !text-blue-500 rounded-lg hover:!bg-white"
//           >
//             <Plus size={12} />
//             Add Info
//           </button>
//         )}

//         {hasFile && (
//           <button
//             onClick={onView}
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-slate-600 text-white rounded-lg hover:bg-slate-700"
//           >
//             <Eye size={12} />
//             View
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }



// function Input({ label, value, onChange, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <input
//         type={type}   // ✅ IMPORTANT
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder={type === "date" ? "" : `Enter ${label}`}
//       />
//     </div>
//   );
// }


// function DetailRow({ label, value }) {
//   return (
//     <div className="px-6 py-4 flex justify-between">
//       <span className="text-slate-500 font-medium">{label}</span>
//       <span className="font-semibold text-slate-800">{value}</span>
//     </div>
//   );
// }

// function GridItem({ label, value, bold, children }) {
//   return (
//     <div>
//       <span className="block text-slate-500 font-medium mb-1">{label}</span>

//       {children ? (
//         children
//       ) : (
//         <span
//           className={`text-slate-900 ${bold ? "font-bold" : "font-semibold"}`}
//         >
//           {value ?? "-"}
//         </span>
//       )}
//     </div>
//   );
// }

// function ReadBlock({ title, value }) {
//   return (
//     <div>
//       <span className="block text-slate-500 font-medium mb-1">{title}</span>
//       <span className="font-semibold text-slate-800">{value}</span>
//     </div>
//   );
// }

// function Modal({ title, children, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-2xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold">{title}</h2>
//           <button onClick={onClose}>✕</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// // Add these inside your function before the return
// const inputStyle =
//   "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400";
// const labelStyle =
//   "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";
// const iconStyle =
//   "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";
