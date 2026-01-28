//*************************************************working code phase 33 21/01/26******************************************************* */
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
//   Trash2,
//   PlusCircle,
//   Building2,
//   Briefcase,
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
// } from "lucide-react";
// import toast from "react-hot-toast";
// import JoiningLetterWorkspace from "../../components/joining/JoiningLetterWorkspace";
// import JoiningDispatchUI from "../../components/joining/JoiningDispatchUI";
// import OfferLatter from "../../components/offer/OfferLatter";

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
//   const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [kycForm, setKycForm] = useState({
//     aadhaar_number: "",
//     pan_number: "",
//     account_holder_name: "",
//     account_number: "",
//     ifsc_code: "",
//   });
//   const [documents, setDocuments] = useState([]);
//   const [documentsLoading, setDocumentsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewDocType, setViewDocType] = useState(null);
//   const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
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
//   const [formData, setFormData] = useState({
//     offered_ctc: "",
//   });
//   const [isRevising, setIsRevising] = useState(false);

//   //   console.log("experieance", experiences)

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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//     fetchExperiences();
//   }, [id]);

//   useEffect(() => {
//     fetchKyc();
//   }, [id]);

//   const fetchKyc = async () => {
//     try {
//       const data = await employeeKycService.get(id);
//       if (data) {
//         setKyc(data);
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
//       await fetchExperiences();

//       setDraftExperiences([]);
//       setShowExperienceModal(false);

//       toast.success("Experience added successfully");
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
//     return `https://emp-onbd-1.onrender.com/${doc.document_path}`;
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

//   // 1. Sort by date (Newest First)
//   const sortedExperiences = [...experiences].sort(
//     (a, b) => new Date(b.start_date) - new Date(a.start_date),
//   );

//   // const handleOfferSubmit = async () => {
//   //   try {
//   //     if (!formData.offered_ctc) {
//   //       toast.error("Please enter offered CTC");
//   //       return;
//   //     }

//   //     const isFresher =
//   //       statusexp?.status === "filled" ? false : true;

//   //     const payload = {
//   //       full_name: employee.full_name,
//   //       email: employee.email,
//   //       phone: employee.phone,
//   //       department_id: employee.department_id,
//   //       role: employee.role,
//   //       is_fresher: isFresher,
//   //       offered_ctc: Number(formData.offered_ctc),
//   //     };

//   //     await employeeService.update(id, payload);

//   //     toast.success("Offer released successfully");
//   //     fetchEmployee();
//   //   } catch (err) {
//   //     toast.error(err.message || "Failed to release offer");
//   //   }
//   // };

//   const handleOfferSubmit = async () => {
//     try {
//       if (!formData.offered_ctc) {
//         toast.error("Please enter offered CTC");
//         return;
//       }

//       // 🔁 REVISION FLOW
//       if (isRevising) {
//         await employeeKycService.reviseOffer(id, {
//           new_ctc: Number(formData.offered_ctc),
//         });

//         toast.success("Offer revised successfully");
//         setIsRevising(false);
//         fetchEmployee();
//         return;
//       }

//       // 🚀 FIRST-TIME OFFER RELEASE FLOW
//       const isFresher = statusexp?.status === "filled" ? false : true;

//       const payload = {
//         full_name: employee.full_name,
//         email: employee.email,
//         phone: employee.phone,
//         department_id: employee.department_id,
//         role: employee.role,
//         is_fresher: isFresher,
//         offered_ctc: Number(formData.offered_ctc),
//       };

//       await employeeService.update(id, payload);

//       toast.success("Offer released successfully");
//       fetchEmployee();
//     } catch (err) {
//       toast.error(err.message || "Failed to process offer");
//     }
//   };

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
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("offer_letter");

//   console.log("working code",address?.address)

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

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
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
//       </div>

//       {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
//           {/* COLUMN 1 */}
//           <div className="space-y-3">
//             <GridItem
//               label="Employee Code"
//               value={employee.employee_code}
//               bold
//             />
//             <GridItem label="Full Name" value={employee.full_name} />
//           </div>

//           {/* COLUMN 2 */}
//           <div className="space-y-3">
//             <GridItem label="Email" value={employee.email} />
//             <GridItem label="Phone" value={employee.phone} />
//           </div>

//           {/* COLUMN 3 */}
//           <div className="space-y-3">
//             <GridItem label="Role" value={employee.role} />
//             <GridItem label="Joining Date" value={employee.joining_date} />
//           </div>

//           {/* COLUMN 4 */}
//           <div className="space-y-3">
//             {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             <GridItem label="Status">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                   employee.status === "active"
//                     ? "bg-green-100 text-green-700"
//                     : employee.status === "created"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-slate-200 text-slate-700"
//                 }`}
//               >
//                 {employee.status}
//               </span>
//             </GridItem>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-8 mt-8">
//         {/* HEADER SECTION */}
//         <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
//             className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
//           >
//             <PlusCircle size={18} /> Add Experience
//           </button>
//         </div>

//         {/* TIMELINE & DATA SECTION */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* LEFT: TIMELINE (Takes 2 columns) */}
//           <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//             {sortedExperiences.length > 0 ? (
//               sortedExperiences.map((exp, index) => (
//                 <div key={exp.id || index} className="relative pl-12 group">
//                   {/* Timeline Dot */}
//                   <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
//                     <span className="text-[10px] font-bold">{index + 1}</span>
//                   </div>

//                   <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
//                     <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//                       <div>
//                         <h3 className="text-lg font-bold text-slate-800">
//                           {exp.job_title}
//                         </h3>
//                         <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
//                           {exp.company_name}
//                         </p>
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
//               /* NO EXPERIENCE / FRESHER STATE */
//               <div className="relative pl-12">
//                 {/* Neutral Timeline Dot */}
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

//           {/* RIGHT: SALARY ANALYTICS (Takes 1 column) */}
//           <div className="space-y-6">
//             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-4 opacity-10">
//                 <TrendingUp size={80} />
//               </div>

//               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                 Salary Insights
//               </h3>

//               <div className="space-y-6 relative z-10">
//                 <div>
//                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Average Historic CTC
//                   </p>
//                   <p className="text-2xl font-black">
//                     ₹{avgCTC.toLocaleString("en-IN")}
//                   </p>
//                 </div>

//                 <div className="pt-6 border-t border-white/10">
//                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Last Drawn (Benchmark)
//                   </p>
//                   <p className="text-2xl font-black text-blue-400">
//                     ₹{lastDrawn.toLocaleString("en-IN")}
//                   </p>
//                 </div>

//                 <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
//                   <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Recommended Offer
//                   </p>
//                   <p className="text-3xl font-black text-white">
//                     ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
//                   </p>
//                   <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
//                     +20% Market Hike
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
//               <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
//                 <Globe size={16} /> Recruitment Advice
//               </h4>
//               <p className="text-xs text-blue-700 leading-relaxed">
//                 The candidate has shown a{" "}
//                 <strong>
//                   {(
//                     ((lastDrawn - (experiences[0]?.previous_ctc || 0)) /
//                       (experiences[0]?.previous_ctc || 1)) *
//                     100
//                   ).toFixed(0)}
//                   %
//                 </strong>{" "}
//                 salary growth over their career. We suggest sticking to the
//                 recommended offer to maintain internal parity.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}
//       {/* ADDRESS SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               🏠 Address Details
//             </h2>
//             <p className="text-sm text-slate-500">
//               Current & permanent address information
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAddressModal(true)}
//             className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
//             {/* <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Current Address"
//                 // value={`${address?.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//                 value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.current_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "current",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "current"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("current");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_current",
//                             e.target.files[0],
//                           );
//                           toast.success("Current address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div> */}
//              {/* CURRENT ADDRESS CARD */}
//     <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//       <ReadBlock
//         title="Current Address"
//         value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
//       />

//       <div className="flex items-start gap-2">
//         {address?.current_address_status === "verified" ? (
//           <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//             Verified
//           </span>
//         ) : address?.current_address_status ? (
//           <button
//             onClick={() => {
//               setVerifyForm({
//                 type: "current",
//                 status: "verified",
//                 remarks: "",
//               });
//               setShowVerifyModal(true);
//             }}
//             className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//           >
//             Verify
//           </button>
//         ) : (
//           <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//             {uploadingType === "current" ? "Uploading..." : "Upload Proof"}
//             <input
//               type="file"
//               hidden
//               onChange={async (e) => {
//                 try {
//                   setUploadingType("current");
//                   await employeeAddressService.uploadDocument(
//                     id,
//                     "address_proof_current",
//                     e.target.files[0]
//                   );
//                   toast.success("Current address proof uploaded");
//                   fetchAddress();
//                 } catch (err) {
//                   toast.error(err.message);
//                 } finally {
//                   setUploadingType(null);
//                 }
//               }}
//             />
//           </label>
//         )}
//       </div>
//     </div>

//             {/* PERMANENT ADDRESS CARD */}
//             {/* <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 // value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//                 value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.permanent_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "permanent",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "permanent"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("permanent");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_permanent",
//                             e.target.files[0],
//                           );
//                           toast.success("Permanent address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div> */}

//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//   <ReadBlock
//     title="Permanent Address"
//     value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
//   />

//   <div className="flex items-start gap-2">
//     {address?.permanent_address_status === "verified" ? (
//       <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//         Verified
//       </span>
//     ) : address?.permanent_address_status ? (
//       <button
//         onClick={() => {
//           setVerifyForm({
//             type: "permanent",
//             status: "verified",
//             remarks: "",
//           });
//           setShowVerifyModal(true);
//         }}
//         className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//       >
//         Verify
//       </button>
//     ) : (
//       <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//         {uploadingType === "permanent" ? "Uploading..." : "Upload Proof"}
//         <input
//           type="file"
//           hidden
//           onChange={async (e) => {
//             try {
//               setUploadingType("permanent");
//               await employeeAddressService.uploadDocument(
//                 id,
//                 "address_proof_permanent",
//                 e.target.files[0]
//               );
//               toast.success("Permanent address proof uploaded");
//               fetchAddress();
//             } catch (err) {
//               toast.error(err.message);
//             } finally {
//               setUploadingType(null);
//             }
//           }}
//         />
//       </label>
//     )}
//   </div>
// </div>

//           </div>
//         ) : (
//           <div className="text-sm text-slate-500 py-6">
//             No address added yet.
//           </div>
//         )}
//       </div>

//       {showAddressModal && (
//         <Modal
//           title={address ? "Update Address" : "Add Address"}
//           onClose={() => setShowAddressModal(false)}
//         >
//           {/* CURRENT ADDRESS */}
//           <div className="mb-6">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Current Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm?.current_address_line1 || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line1: v })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm?.current_address_line2 || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line2: v })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm?.current_city || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm?.current_state || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm?.current_pincode || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* PERMANENT ADDRESS */}
//           <div className="mb-8">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Permanent Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm?.permanent_address_line1 || ""}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line1: v,
//                   })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm?.permanent_address_line2 || ""}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line2: v,
//                   })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm?.permanent_city || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm?.permanent_state || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm?.permanent_pincode || ""}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowAddressModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 if (address) {
//                   await employeeAddressService.update(id, addressForm);
//                 } else {
//                   await employeeAddressService.create(id, addressForm);
//                 }
//                 setShowAddressModal(false);
//                 fetchAddress();
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               {address ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </Modal>
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

//       {/* <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40">

//           <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-5 flex items-center justify-between">
//             <div className="flex items-center gap-4 text-white">
//               <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
//                 <ShieldCheck size={22} className="text-blue-400" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold tracking-tight">
//                   Remuneration Setup
//                 </h3>
//                 <p className="text-blue-300/60 text-[10px] font-bold uppercase tracking-[0.15em]">
//                   {employee.status === "offer_sent"
//                     ? "Offer Issued & Pending"
//                     : "Payroll & Compliance Verification"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               {employee.status === "offer_sent" && (
//                 <span className="flex items-center gap-1.5 text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 uppercase">
//                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
//                   Offer Released
//                 </span>
//               )}
//               <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 uppercase">
//                 Workflow: Phase 4
//               </span>
//             </div>
//           </div>

//           <div className="p-8 lg:p-12">
//             <div className="max-w-4xl mx-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                 <div className="space-y-4">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                     {employee.status === "offer_sent" && !isRevising
//                       ? "Current Offered CTC"
//                       : "Proposed Annual CTC (INR)"}
//                   </label>

//                   {employee.status === "offer_sent" && !isRevising ? (
//                     <div className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
//                       <div className="flex items-center gap-3">
//                         <span className="text-2xl font-black text-slate-900">
//                           ₹
//                           {Number(employee.offered_ctc).toLocaleString("en-IN")}
//                         </span>
//                         <span className="text-xs font-bold text-slate-400">
//                           / Per Annum
//                         </span>
//                       </div>
//                       <div className="p-2 bg-green-100 text-green-700 rounded-lg">
//                         <CheckCircle size={20} />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="relative group">
//                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-blue-600 transition-colors text-xl">
//                         ₹
//                       </div>
//                       <input
//                         type="number"
//                         placeholder="Ex: 800000"
//                         value={formData.offered_ctc}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             offered_ctc: e.target.value,
//                           })
//                         }
//                         className="w-full pl-12 pr-6 py-4 bg-white border-2 border-blue-600 rounded-2xl focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-black text-xl text-slate-800 shadow-sm"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
//                   <div className="flex items-center gap-3 mb-2">
//                     <TrendingUp size={16} className="text-slate-400" />
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                       Decision Support
//                     </p>
//                   </div>
//                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
//                     {isRevising
//                       ? "You are now in revision mode. Updating this will overwrite the previously sent offer and notify the candidate of the new terms."
//                       : `Standard increments for ${employee.department_name} range between 15% to 22%.`}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
//                 <div className="flex items-start gap-3 text-slate-400 max-w-sm">
//                   <Info size={18} className="shrink-0 mt-0.5" />
//                   <p className="text-[11px] leading-relaxed font-medium">
//                     Email dispatch will use the{" "}
//                     <span className="text-slate-600 font-bold">
//                       Standard Offer Template
//                     </span>
//                     . Ensure the candidate's email address is verified before
//                     sending.
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   {employee.status === "offer_sent" && !isRevising ? (
//                     <>
//                       <button
//                         onClick={() => {
//                           setFormData({
//                             ...formData,
//                             offered_ctc: employee.offered_ctc,
//                           });
//                           setIsRevising(true);
//                         }}
//                         className="group flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-sm"
//                       >
//                         <Edit3
//                           size={16}
//                           className="text-slate-400 group-hover:text-blue-500"
//                         />
//                         REVISE
//                       </button>

//                       <button
//                         disabled={employee.status !== "offer_sent"}
//                         onClick={async () => {
//                           try {
//                             toast.loading("Dispatching offer email...");
//                             await employeeKycService.sendOffer(id);
//                             toast.dismiss();
//                             toast.success("Offer email sent successfully!");
//                           } catch (err) {
//                             toast.dismiss();
//                             toast.error(
//                               err.message || "Failed to send offer email",
//                             );
//                           }
//                         }}
//                         className={`group flex items-center gap-3 px-6 py-3 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200 text-sm
//     ${
//       employee.status !== "offer_sent"
//         ? "bg-slate-300 text-slate-500 cursor-not-allowed"
//         : "bg-blue-600 text-white hover:bg-blue-700"
//     }
//   `}
//                       >
//                         <Mail size={18} />
//                         SEND OFFER MAIL
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {isRevising && (
//                         <button
//                           onClick={() => setIsRevising(false)}
//                           className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       <button
//                         onClick={handleOfferSubmit}
//                         disabled={!formData.offered_ctc}
//                         className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
//                       >
//                         <span className="text-sm tracking-tight">
//                           {isRevising ? "CONFIRM REVISION" : "RELEASE OFFER"}
//                         </span>
//                         <div className="border-l border-white/20 pl-3">
//                           {isRevising ? (
//                             <RefreshCcw size={16} />
//                           ) : (
//                             <Send size={16} />
//                           )}
//                         </div>
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       <div>

//         <OfferLatter employee={employee} />
//       </div>

//       <div>

// {/* <JoiningLetterWorkspace employee={employee} /> */}
// <JoiningDispatchUI employee={employee} />

//       </div>

//       {/* DOCUMENTS / KYC SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-bold text-slate-900">
//             📄 Documents (KYC)
//           </h2>
//           <p className="text-sm text-slate-500">
//             Aadhaar, PAN, Bank, Photo & Offer Letter
//           </p>
//         </div>

//         {kycLoading ? (
//           <div className="text-center text-slate-500 py-10">
//             Loading documents...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//             <DocumentCard
//               title="Aadhaar"
//               completed={aadhaarDoc?.status === "uploaded"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-red-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("aadhaar");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("aadhaar");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="PAN"
//               completed={panDoc?.status === "uploaded"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-gray-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("pan");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("pan");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Bank Details"
//               completed={bankDoc?.status === "uploaded"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-blue-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("bank");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("bank");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Photo"
//               completed={photoDoc?.status === "uploaded"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-orange-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("photo");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("photo");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Offer Letter"
//               completed={offerDoc?.status === "uploaded"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
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
//                           // const updated = experiences.filter((_, i) => i !== index);
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
//                             //   const updated = [...experiences];
//                             const updated = [...draftExperiences];
//                             updated[index].company_name = e.target.value;
//                             //   setExperiences(updated);
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

//       {/* VERIFY SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <h2 className="text-lg font-bold text-slate-900 mb-4">
//           🔍 Verify KYC Details
//         </h2>

//         {/* PAN VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//               Verify PAN Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "pan" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "pan" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.pan_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Info List */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Permanent Account Number
//                       </p>
//                       <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
//                         {kyc.pan_number}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.pan_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(kyc.pan_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Background Pattern */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid"
//                           width="20"
//                           height="20"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 20 0 L 0 0 0 20"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect width="100%" height="100%" fill="url(#grid)" />
//                       </svg>
//                     </div>

//                     {/* Layered Icon */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Outer Glow Ring */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Circle */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3.5}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW (Same as before) --- */
//                 <div className="space-y-4 max-w-md">
//                   <>
//                     <Input
//                       label="Name (as per PAN)"
//                       value={panVerifyForm.name}
//                       onChange={(v) =>
//                         setPanVerifyForm({ ...panVerifyForm, name: v })
//                       }
//                     />

//                     <button
//                       disabled={verifying}
//                       onClick={verifyPanHandler}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//                     >
//                       Verify PAN
//                     </button>
//                   </>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* BANK VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />{" "}
//               {/* Blue accent for Bank */}
//               Verify Bank Account
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "bank" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "bank" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.bank_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Bank Info */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Account Holder
//                       </p>
//                       <p className="text-lg font-bold text-slate-800 uppercase italic">
//                         {kyc.account_holder_name}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Account Number
//                         </p>
//                         <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
//                           {kyc.account_number.replace(/.(?=.{4})/g, "•")}{" "}
//                           {/* Masks number except last 4 */}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           IFSC Code
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {kyc.ifsc_code}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           #{kyc.bank_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           {new Date(kyc.bank_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Pattern Background */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid-bank"
//                           width="15"
//                           height="15"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 15 0 L 0 0 0 15"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect
//                           width="100%"
//                           height="100%"
//                           fill="url(#grid-bank)"
//                         />
//                       </svg>
//                     </div>

//                     {/* Layered Icon Stack */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Pulsing Outer Glow */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Shield/Circle Icon */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3}
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="relative text-center">
//                       <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                         Verified
//                       </h4>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
//                         Bank Confirmed
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW --- */
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Account Holder Name"
//                     placeholder="As per bank records"
//                     value={bankVerifyForm.name}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, name: v })
//                     }
//                   />
//                   <Input
//                     label="Account Number"
//                     placeholder="Enter account number"
//                     value={bankVerifyForm.bank_account}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
//                     }
//                   />
//                   <Input
//                     label="IFSC Code"
//                     placeholder="e.g. SBIN0001234"
//                     value={bankVerifyForm.ifsc}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
//                     }
//                   />
//                   <Input
//                     label="Phone Number"
//                     placeholder="Registered mobile"
//                     value={bankVerifyForm.phone}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, phone: v })
//                     }
//                   />

//                   <div className="md:col-span-2 pt-2">
//                     <button
//                       disabled={verifying}
//                       onClick={verifyBankHandler}
//                       className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
//                     >
//                       {verifying ? "Processing..." : "Verify Bank Account"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
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
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <input
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder={`Enter ${label}`}
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
//*********************************************working code phase 33 20/01/26***************************************************** */
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
//   Trash2,
//   PlusCircle,
//   Building2,
//   Briefcase,
//   MapPin,
//   Save,
//   Calendar,
//   TrendingUp,
//   Globe,
//   User,
//   Send,
//   ShieldCheck,
//   Zap
// } from "lucide-react";
// import toast from "react-hot-toast";

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
//   const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [kycForm, setKycForm] = useState({
//     aadhaar_number: "",
//     pan_number: "",
//     account_holder_name: "",
//     account_number: "",
//     ifsc_code: "",
//   });
//   const [documents, setDocuments] = useState([]);
//   const [documentsLoading, setDocumentsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewDocType, setViewDocType] = useState(null);
//   const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
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
// const [statusexp , setStatusexp] = useState([])
//   const [experiences, setExperiences] = useState([emptyExperience]);
//   const [formData, setFormData] = useState({
//   offered_ctc: "",
// });

// //   console.log("experieance", experiences)

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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//     fetchExperiences();
//   }, [id]);

//   useEffect(() => {
//     fetchKyc();
//   }, [id]);

//   const fetchKyc = async () => {
//     try {
//       const data = await employeeKycService.get(id);
//       if (data) {
//         setKyc(data);
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
//       await fetchExperiences();

//       setDraftExperiences([]);
//       setShowExperienceModal(false);

//       toast.success("Experience added successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to save experience");
//     }
//   };

// //   const fetchExperiences = async () => {
// //     try {
// //       const data = await employeeKycService.getExperiences(id);

// //       console.log("API DATA" , data)

// //       if (Array.isArray(data) && data.length > 0) {
// //         setExperiences(data);
// //       }
// //     } catch (err) {
// //       console.error("Failed to fetch experiences", err);
// //     }
// //   };

// const fetchExperiences = async () => {
//   try {
//     const res = await employeeKycService.getExperiences(id);

//     // console.log("API DATA", res);
//     setStatusexp(res)

//     if (res?.data && Array.isArray(res.data)) {
//       setExperiences(res.data);
//     }
//   } catch (err) {
//     console.error("Failed to fetch experiences", err);
//   }
// };

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
//         setAddress(data);
//         setAddressForm(data);
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
//     return `https://emp-onbd-1.onrender.com/${doc.document_path}`;
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

//   // 1. Sort by date (Newest First)
//   const sortedExperiences = [...experiences].sort(
//     (a, b) => new Date(b.start_date) - new Date(a.start_date),
//   );

// const handleOfferSubmit = async () => {
//   try {
//     if (!formData.offered_ctc) {
//       toast.error("Please enter offered CTC");
//       return;
//     }

//     const isFresher =
//       statusexp?.status === "filled" ? false : true;

//     const payload = {
//       full_name: employee.full_name,
//       email: employee.email,
//       phone: employee.phone,
//       department_id: employee.department_id,
//       role: employee.role,
//       is_fresher: isFresher,
//       offered_ctc: Number(formData.offered_ctc),
//     };

//     await employeeService.update(id, payload);

//     toast.success("Offer released successfully");
//     fetchEmployee();
//   } catch (err) {
//     toast.error(err.message || "Failed to release offer");
//   }
// };

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
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("offer_letter");

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

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
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
//       </div>

//       {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
//           {/* COLUMN 1 */}
//           <div className="space-y-3">
//             <GridItem
//               label="Employee Code"
//               value={employee.employee_code}
//               bold
//             />
//             <GridItem label="Full Name" value={employee.full_name} />
//           </div>

//           {/* COLUMN 2 */}
//           <div className="space-y-3">
//             <GridItem label="Email" value={employee.email} />
//             <GridItem label="Phone" value={employee.phone} />
//           </div>

//           {/* COLUMN 3 */}
//           <div className="space-y-3">
//             <GridItem label="Role" value={employee.role} />
//             <GridItem label="Joining Date" value={employee.joining_date} />
//           </div>

//           {/* COLUMN 4 */}
//           <div className="space-y-3">
//             {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             <GridItem label="Status">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                   employee.status === "active"
//                     ? "bg-green-100 text-green-700"
//                     : employee.status === "created"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-slate-200 text-slate-700"
//                 }`}
//               >
//                 {employee.status}
//               </span>
//             </GridItem>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-8 mt-8">
//         {/* HEADER SECTION */}
//         <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
//             className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
//           >
//             <PlusCircle size={18} /> Add Experience
//           </button>
//         </div>

//         {/* TIMELINE & DATA SECTION */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* LEFT: TIMELINE (Takes 2 columns) */}
//          <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//   {sortedExperiences.length > 0 ? (
//     sortedExperiences.map((exp, index) => (
//       <div key={exp.id || index} className="relative pl-12 group">
//         {/* Timeline Dot */}
//         <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
//           <span className="text-[10px] font-bold">{index + 1}</span>
//         </div>

//         <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
//           <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//             <div>
//               <h3 className="text-lg font-bold text-slate-800">
//                 {exp.job_title}
//               </h3>
//               <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
//                 {exp.company_name}
//               </p>
//             </div>
//             <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-right">
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                 Previous CTC
//               </p>
//               <p className="text-sm font-black text-slate-700">
//                 ₹{(exp.previous_ctc / 100000).toFixed(2)} LPA
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
//             <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//               <Calendar size={14} /> {exp.start_date} — {exp.end_date}
//             </span>
//             <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//               <MapPin size={14} /> {exp.location}
//             </span>
//           </div>

//           <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border-l-2 border-slate-200 italic">
//             "{exp.description}"
//           </p>
//         </div>
//       </div>
//     ))
//   ) : (
//     /* NO EXPERIENCE / FRESHER STATE */
//     <div className="relative pl-12">
//       {/* Neutral Timeline Dot */}
//       <div className="absolute left-0 w-10 h-10 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
//         <Briefcase size={16} className="text-slate-400" />
//       </div>

//       <div className="bg-white border border-dashed border-slate-300 p-10 rounded-2xl flex flex-col items-center justify-center text-center">
//         <div className="p-4 bg-slate-50 rounded-full mb-4">
//           <User size={32} className="text-slate-300" />
//         </div>
//         <h3 className="text-lg font-bold text-slate-800">No Professional Experience</h3>
//         <p className="text-sm text-slate-500 max-w-[280px] mt-1">
//           This candidate is currently marked as a <strong>Fresher</strong> or no previous work history has been recorded yet.
//         </p>
//       </div>
//     </div>
//   )}
// </div>

//           {/* RIGHT: SALARY ANALYTICS (Takes 1 column) */}
//           <div className="space-y-6">
//             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-4 opacity-10">
//                 <TrendingUp size={80} />
//               </div>

//               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                 Salary Insights
//               </h3>

//               <div className="space-y-6 relative z-10">
//                 <div>
//                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Average Historic CTC
//                   </p>
//                   <p className="text-2xl font-black">
//                     ₹{avgCTC.toLocaleString("en-IN")}
//                   </p>
//                 </div>

//                 <div className="pt-6 border-t border-white/10">
//                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Last Drawn (Benchmark)
//                   </p>
//                   <p className="text-2xl font-black text-blue-400">
//                     ₹{lastDrawn.toLocaleString("en-IN")}
//                   </p>
//                 </div>

//                 <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
//                   <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Recommended Offer
//                   </p>
//                   <p className="text-3xl font-black text-white">
//                     ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
//                   </p>
//                   <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
//                     +20% Market Hike
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
//               <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
//                 <Globe size={16} /> Recruitment Advice
//               </h4>
//               <p className="text-xs text-blue-700 leading-relaxed">
//                 The candidate has shown a{" "}
//                 <strong>
//                   {(
//                     ((lastDrawn - (experiences[0]?.previous_ctc || 0)) /
//                       (experiences[0]?.previous_ctc || 1)) *
//                     100
//                   ).toFixed(0)}
//                   %
//                 </strong>{" "}
//                 salary growth over their career. We suggest sticking to the
//                 recommended offer to maintain internal parity.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}
//       {/* ADDRESS SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               🏠 Address Details
//             </h2>
//             <p className="text-sm text-slate-500">
//               Current & permanent address information
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAddressModal(true)}
//             className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
//                 value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.current_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "current",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "current"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("current");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_current",
//                             e.target.files[0],
//                           );
//                           toast.success("Current address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}
//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.permanent_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "permanent",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "permanent"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("permanent");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_permanent",
//                             e.target.files[0],
//                           );
//                           toast.success("Permanent address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
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
//         <Modal
//           title={address ? "Update Address" : "Add Address"}
//           onClose={() => setShowAddressModal(false)}
//         >
//           {/* CURRENT ADDRESS */}
//           <div className="mb-6">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Current Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.current_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line1: v })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.current_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line2: v })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.current_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.current_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.current_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* PERMANENT ADDRESS */}
//           <div className="mb-8">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Permanent Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.permanent_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line1: v,
//                   })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.permanent_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line2: v,
//                   })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.permanent_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.permanent_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.permanent_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowAddressModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 if (address) {
//                   await employeeAddressService.update(id, addressForm);
//                 } else {
//                   await employeeAddressService.create(id, addressForm);
//                 }
//                 setShowAddressModal(false);
//                 fetchAddress();
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               {address ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </Modal>
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

// <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

//   {/* MAIN WORKSPACE CARD */}
//   <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40">

//     {/* HEADER: GRADIENT TITLE BAR */}
//     <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-5 flex items-center justify-between">
//       <div className="flex items-center gap-4 text-white">
//         <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
//           <ShieldCheck size={22} className="text-blue-400" />
//         </div>
//         <div>
//           <h3 className="text-lg font-bold tracking-tight">Remuneration Setup</h3>
//           <p className="text-blue-300/60 text-[10px] font-bold uppercase tracking-[0.15em]">Payroll & Compliance Verification</p>
//         </div>
//       </div>
//       <div className="hidden sm:block">
//         <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 uppercase">
//           Workflow: Phase 4
//         </span>
//       </div>
//     </div>

//     {/* SUB-HEADER: CANDIDATE CONTEXT BAR */}
//     <div className="bg-slate-50/50 border-b border-slate-100 p-4">
//       <div className="flex flex-wrap items-center justify-between gap-4 px-4">
//         <div className="flex items-center gap-4">
//           <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black shadow-sm text-lg">
//             {employee.full_name?.charAt(0)}
//           </div>
//           <div>
//             <h2 className="text-md font-bold text-slate-900 leading-none">{employee.full_name}</h2>
//             <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
//               {employee.employee_code} <span className="mx-2 text-slate-300">|</span> {employee.department_name}
//             </p>
//           </div>
//         </div>

//         {/* Compact Quick Stats */}
//         <div className="hidden md:flex items-center gap-6 border-l border-slate-200 pl-6">
//           <div>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Official Email</p>
//             <p className="text-xs font-bold text-slate-700">{employee.email}</p>
//           </div>
//           <div>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Primary Designation</p>
//             <p className="text-xs font-bold text-blue-600 uppercase tracking-tight">
//               {employee.role || 'Senior Professional'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* FORM CONTENT */}
//     <div className="p-8 lg:p-12">
//       <div className="max-w-4xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

//           {/* LEFT: INPUT FIELD */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                 Proposed Annual CTC (INR)
//               </label>
//               <span className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
//                 <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" /> Mandatory Field
//               </span>
//             </div>

//             <div className="relative group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-blue-600 transition-colors text-xl">₹</div>
//               <input
//                 type="number"
//                 placeholder="Ex: 800000"
//                 value={formData.offered_ctc}
//                 onChange={(e) => setFormData({...formData, offered_ctc: e.target.value})}
//                 className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-black text-xl text-slate-800 shadow-sm"
//               />
//             </div>
//             <p className="text-[10px] text-slate-400 font-medium px-1 leading-relaxed">
//               Note: The amount entered should be the <span className="text-slate-600 font-bold underline">Fixed Gross CTC</span> excluding performance bonuses.
//             </p>
//           </div>

//           {/* RIGHT: DATA INSIGHT (Optional but Pro) */}
//           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
//              <div className="flex items-center gap-3 mb-2">
//                 <TrendingUp size={16} className="text-slate-400" />
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Benchmarking</p>
//              </div>
//              <p className="text-xs text-slate-500 leading-relaxed font-medium">
//                 Standard increments for the <span className="text-slate-900 font-bold">{employee.department_name}</span> unit range between 15% to 22%. Ensure the proposed CTC aligns with internal parity guidelines.
//              </p>
//           </div>
//         </div>

//         {/* ACTION FOOTER */}
//         <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
//           <div className="flex items-start gap-3 text-slate-400 max-w-sm">
//             <Info size={18} className="shrink-0 mt-0.5" />
//             <p className="text-[11px] leading-relaxed font-medium">
//               By initiating the release, the system will finalize the digital contract. Ensure all financial disclosures have been audited.
//             </p>
//           </div>

//           <button
//             onClick={handleOfferSubmit}
//             disabled={!formData.offered_ctc}
//             className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed shadow-xl shadow-slate-200 flex items-center gap-3"
//           >
//             <span className="text-sm tracking-tight">RELEASE OFFER</span>
//             <div className="border-l border-white/20 pl-3 group-hover:border-white/40 transition-colors">
//               <Send size={16} />
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//       {/* DOCUMENTS / KYC SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-bold text-slate-900">
//             📄 Documents (KYC)
//           </h2>
//           <p className="text-sm text-slate-500">
//             Aadhaar, PAN, Bank, Photo & Offer Letter
//           </p>
//         </div>

//         {kycLoading ? (
//           <div className="text-center text-slate-500 py-10">
//             Loading documents...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//             <DocumentCard
//               title="Aadhaar"
//               completed={aadhaarDoc?.status === "uploaded"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-red-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("aadhaar");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("aadhaar");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="PAN"
//               completed={panDoc?.status === "uploaded"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-gray-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("pan");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("pan");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Bank Details"
//               completed={bankDoc?.status === "uploaded"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-blue-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("bank");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("bank");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Photo"
//               completed={photoDoc?.status === "uploaded"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-orange-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("photo");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("photo");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Offer Letter"
//               completed={offerDoc?.status === "uploaded"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
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
//                           // const updated = experiences.filter((_, i) => i !== index);
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
//                             //   const updated = [...experiences];
//                             const updated = [...draftExperiences];
//                             updated[index].company_name = e.target.value;
//                             //   setExperiences(updated);
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

//       {/* VERIFY SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <h2 className="text-lg font-bold text-slate-900 mb-4">
//           🔍 Verify KYC Details
//         </h2>

//         {/* PAN VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//               Verify PAN Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "pan" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "pan" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.pan_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Info List */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Permanent Account Number
//                       </p>
//                       <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
//                         {kyc.pan_number}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.pan_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(kyc.pan_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Background Pattern */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid"
//                           width="20"
//                           height="20"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 20 0 L 0 0 0 20"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect width="100%" height="100%" fill="url(#grid)" />
//                       </svg>
//                     </div>

//                     {/* Layered Icon */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Outer Glow Ring */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Circle */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3.5}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW (Same as before) --- */
//                 <div className="space-y-4 max-w-md">

//                   <>
//                     <Input
//                       label="Name (as per PAN)"
//                       value={panVerifyForm.name}
//                       onChange={(v) =>
//                         setPanVerifyForm({ ...panVerifyForm, name: v })
//                       }
//                     />

//                     <button
//                       disabled={verifying}
//                       onClick={verifyPanHandler}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//                     >
//                       Verify PAN
//                     </button>
//                   </>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* BANK VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />{" "}
//               {/* Blue accent for Bank */}
//               Verify Bank Account
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "bank" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "bank" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.bank_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Bank Info */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Account Holder
//                       </p>
//                       <p className="text-lg font-bold text-slate-800 uppercase italic">
//                         {kyc.account_holder_name}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Account Number
//                         </p>
//                         <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
//                           {kyc.account_number.replace(/.(?=.{4})/g, "•")}{" "}
//                           {/* Masks number except last 4 */}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           IFSC Code
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {kyc.ifsc_code}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           #{kyc.bank_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           {new Date(kyc.bank_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Pattern Background */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid-bank"
//                           width="15"
//                           height="15"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 15 0 L 0 0 0 15"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect
//                           width="100%"
//                           height="100%"
//                           fill="url(#grid-bank)"
//                         />
//                       </svg>
//                     </div>

//                     {/* Layered Icon Stack */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Pulsing Outer Glow */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Shield/Circle Icon */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3}
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="relative text-center">
//                       <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                         Verified
//                       </h4>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
//                         Bank Confirmed
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW --- */
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Account Holder Name"
//                     placeholder="As per bank records"
//                     value={bankVerifyForm.name}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, name: v })
//                     }
//                   />
//                   <Input
//                     label="Account Number"
//                     placeholder="Enter account number"
//                     value={bankVerifyForm.bank_account}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
//                     }
//                   />
//                   <Input
//                     label="IFSC Code"
//                     placeholder="e.g. SBIN0001234"
//                     value={bankVerifyForm.ifsc}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
//                     }
//                   />
//                   <Input
//                     label="Phone Number"
//                     placeholder="Registered mobile"
//                     value={bankVerifyForm.phone}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, phone: v })
//                     }
//                   />

//                   <div className="md:col-span-2 pt-2">
//                     <button
//                       disabled={verifying}
//                       onClick={verifyBankHandler}
//                       className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
//                     >
//                       {verifying ? "Processing..." : "Verify Bank Account"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
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
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <input
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder={`Enter ${label}`}
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
//***********************************************working code************************************************************ */
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
//   Trash2,
//   PlusCircle,
//   Building2,
//   Briefcase,
//   MapPin,
//   Save,
//   Calendar,
//   TrendingUp,
//   Globe,
//   User
// } from "lucide-react";
// import toast from "react-hot-toast";

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
//   const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [kycForm, setKycForm] = useState({
//     aadhaar_number: "",
//     pan_number: "",
//     account_holder_name: "",
//     account_number: "",
//     ifsc_code: "",
//   });
//   const [documents, setDocuments] = useState([]);
//   const [documentsLoading, setDocumentsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewDocType, setViewDocType] = useState(null);
//   const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
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

//   const [experiences, setExperiences] = useState([emptyExperience]);

//   console.log("experieance", experiences)

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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//     fetchExperiences();
//   }, [id]);

//   useEffect(() => {
//     fetchKyc();
//   }, [id]);

//   const fetchKyc = async () => {
//     try {
//       const data = await employeeKycService.get(id);
//       if (data) {
//         setKyc(data);
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
//       await fetchExperiences();

//       setDraftExperiences([]);
//       setShowExperienceModal(false);

//       toast.success("Experience added successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to save experience");
//     }
//   };

// //   const fetchExperiences = async () => {
// //     try {
// //       const data = await employeeKycService.getExperiences(id);

// //       console.log("API DATA" , data)

// //       if (Array.isArray(data) && data.length > 0) {
// //         setExperiences(data);
// //       }
// //     } catch (err) {
// //       console.error("Failed to fetch experiences", err);
// //     }
// //   };

// const fetchExperiences = async () => {
//   try {
//     const res = await employeeKycService.getExperiences(id);

//     console.log("API DATA", res);

//     if (res?.data && Array.isArray(res.data)) {
//       setExperiences(res.data);
//     }
//   } catch (err) {
//     console.error("Failed to fetch experiences", err);
//   }
// };

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
//         setAddress(data);
//         setAddressForm(data);
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
//     return `https://emp-onbd-1.onrender.com/${doc.document_path}`;
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

//   // 1. Sort by date (Newest First)
//   const sortedExperiences = [...experiences].sort(
//     (a, b) => new Date(b.start_date) - new Date(a.start_date),
//   );

//   console.log(sortedExperiences)

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
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("offer_letter");

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

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
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
//       </div>

//       {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
//           {/* COLUMN 1 */}
//           <div className="space-y-3">
//             <GridItem
//               label="Employee Code"
//               value={employee.employee_code}
//               bold
//             />
//             <GridItem label="Full Name" value={employee.full_name} />
//           </div>

//           {/* COLUMN 2 */}
//           <div className="space-y-3">
//             <GridItem label="Email" value={employee.email} />
//             <GridItem label="Phone" value={employee.phone} />
//           </div>

//           {/* COLUMN 3 */}
//           <div className="space-y-3">
//             <GridItem label="Role" value={employee.role} />
//             <GridItem label="Joining Date" value={employee.joining_date} />
//           </div>

//           {/* COLUMN 4 */}
//           <div className="space-y-3">
//             {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             <GridItem label="Status">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                   employee.status === "active"
//                     ? "bg-green-100 text-green-700"
//                     : employee.status === "created"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-slate-200 text-slate-700"
//                 }`}
//               >
//                 {employee.status}
//               </span>
//             </GridItem>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-8 mt-8">
//         {/* HEADER SECTION */}
//         <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
//             className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
//           >
//             <PlusCircle size={18} /> Add Experience
//           </button>
//         </div>

//         {/* TIMELINE & DATA SECTION */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* LEFT: TIMELINE (Takes 2 columns) */}
//          <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//   {sortedExperiences.length > 0 ? (
//     sortedExperiences.map((exp, index) => (
//       <div key={exp.id || index} className="relative pl-12 group">
//         {/* Timeline Dot */}
//         <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
//           <span className="text-[10px] font-bold">{index + 1}</span>
//         </div>

//         <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
//           <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//             <div>
//               <h3 className="text-lg font-bold text-slate-800">
//                 {exp.job_title}
//               </h3>
//               <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
//                 {exp.company_name}
//               </p>
//             </div>
//             <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-right">
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                 Previous CTC
//               </p>
//               <p className="text-sm font-black text-slate-700">
//                 ₹{(exp.previous_ctc / 100000).toFixed(2)} LPA
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
//             <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//               <Calendar size={14} /> {exp.start_date} — {exp.end_date}
//             </span>
//             <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//               <MapPin size={14} /> {exp.location}
//             </span>
//           </div>

//           <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border-l-2 border-slate-200 italic">
//             "{exp.description}"
//           </p>
//         </div>
//       </div>
//     ))
//   ) : (
//     /* NO EXPERIENCE / FRESHER STATE */
//     <div className="relative pl-12">
//       {/* Neutral Timeline Dot */}
//       <div className="absolute left-0 w-10 h-10 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
//         <Briefcase size={16} className="text-slate-400" />
//       </div>

//       <div className="bg-white border border-dashed border-slate-300 p-10 rounded-2xl flex flex-col items-center justify-center text-center">
//         <div className="p-4 bg-slate-50 rounded-full mb-4">
//           <User size={32} className="text-slate-300" />
//         </div>
//         <h3 className="text-lg font-bold text-slate-800">No Professional Experience</h3>
//         <p className="text-sm text-slate-500 max-w-[280px] mt-1">
//           This candidate is currently marked as a <strong>Fresher</strong> or no previous work history has been recorded yet.
//         </p>
//       </div>
//     </div>
//   )}
// </div>

//           {/* RIGHT: SALARY ANALYTICS (Takes 1 column) */}
//           <div className="space-y-6">
//             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-4 opacity-10">
//                 <TrendingUp size={80} />
//               </div>

//               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                 Salary Insights
//               </h3>

//               <div className="space-y-6 relative z-10">
//                 <div>
//                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Average Historic CTC
//                   </p>
//                   <p className="text-2xl font-black">
//                     ₹{avgCTC.toLocaleString("en-IN")}
//                   </p>
//                 </div>

//                 <div className="pt-6 border-t border-white/10">
//                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Last Drawn (Benchmark)
//                   </p>
//                   <p className="text-2xl font-black text-blue-400">
//                     ₹{lastDrawn.toLocaleString("en-IN")}
//                   </p>
//                 </div>

//                 <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
//                   <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">
//                     Recommended Offer
//                   </p>
//                   <p className="text-3xl font-black text-white">
//                     ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
//                   </p>
//                   <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
//                     +20% Market Hike
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
//               <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
//                 <Globe size={16} /> Recruitment Advice
//               </h4>
//               <p className="text-xs text-blue-700 leading-relaxed">
//                 The candidate has shown a{" "}
//                 <strong>
//                   {(
//                     ((lastDrawn - (experiences[0]?.previous_ctc || 0)) /
//                       (experiences[0]?.previous_ctc || 1)) *
//                     100
//                   ).toFixed(0)}
//                   %
//                 </strong>{" "}
//                 salary growth over their career. We suggest sticking to the
//                 recommended offer to maintain internal parity.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}
//       {/* ADDRESS SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               🏠 Address Details
//             </h2>
//             <p className="text-sm text-slate-500">
//               Current & permanent address information
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAddressModal(true)}
//             className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
//                 value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.current_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "current",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "current"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("current");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_current",
//                             e.target.files[0],
//                           );
//                           toast.success("Current address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}
//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.permanent_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "permanent",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "permanent"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("permanent");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_permanent",
//                             e.target.files[0],
//                           );
//                           toast.success("Permanent address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
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
//         <Modal
//           title={address ? "Update Address" : "Add Address"}
//           onClose={() => setShowAddressModal(false)}
//         >
//           {/* CURRENT ADDRESS */}
//           <div className="mb-6">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Current Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.current_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line1: v })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.current_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line2: v })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.current_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.current_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.current_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* PERMANENT ADDRESS */}
//           <div className="mb-8">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Permanent Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.permanent_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line1: v,
//                   })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.permanent_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line2: v,
//                   })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.permanent_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.permanent_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.permanent_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowAddressModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 if (address) {
//                   await employeeAddressService.update(id, addressForm);
//                 } else {
//                   await employeeAddressService.create(id, addressForm);
//                 }
//                 setShowAddressModal(false);
//                 fetchAddress();
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               {address ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </Modal>
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

//       {/* DOCUMENTS / KYC SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-bold text-slate-900">
//             📄 Documents (KYC)
//           </h2>
//           <p className="text-sm text-slate-500">
//             Aadhaar, PAN, Bank, Photo & Offer Letter
//           </p>
//         </div>

//         {kycLoading ? (
//           <div className="text-center text-slate-500 py-10">
//             Loading documents...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//             <DocumentCard
//               title="Aadhaar"
//               completed={aadhaarDoc?.status === "uploaded"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-red-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("aadhaar");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("aadhaar");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="PAN"
//               completed={panDoc?.status === "uploaded"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-gray-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("pan");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("pan");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Bank Details"
//               completed={bankDoc?.status === "uploaded"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-blue-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("bank");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("bank");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Photo"
//               completed={photoDoc?.status === "uploaded"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-orange-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("photo");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("photo");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Offer Letter"
//               completed={offerDoc?.status === "uploaded"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
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
//                           // const updated = experiences.filter((_, i) => i !== index);
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
//                             //   const updated = [...experiences];
//                             const updated = [...draftExperiences];
//                             updated[index].company_name = e.target.value;
//                             //   setExperiences(updated);
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

//       {/* VERIFY SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <h2 className="text-lg font-bold text-slate-900 mb-4">
//           🔍 Verify KYC Details
//         </h2>

//         {/* PAN VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//               Verify PAN Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "pan" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "pan" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.pan_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Info List */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Permanent Account Number
//                       </p>
//                       <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
//                         {kyc.pan_number}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.pan_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(kyc.pan_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Background Pattern */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid"
//                           width="20"
//                           height="20"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 20 0 L 0 0 0 20"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect width="100%" height="100%" fill="url(#grid)" />
//                       </svg>
//                     </div>

//                     {/* Layered Icon */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Outer Glow Ring */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Circle */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3.5}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW (Same as before) --- */
//                 <div className="space-y-4 max-w-md">
//                   {/* ... form content ... */}
//                   <>
//                     <Input
//                       label="Name (as per PAN)"
//                       value={panVerifyForm.name}
//                       onChange={(v) =>
//                         setPanVerifyForm({ ...panVerifyForm, name: v })
//                       }
//                     />

//                     <button
//                       disabled={verifying}
//                       onClick={verifyPanHandler}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//                     >
//                       Verify PAN
//                     </button>
//                   </>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* BANK VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />{" "}
//               {/* Blue accent for Bank */}
//               Verify Bank Account
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "bank" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "bank" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.bank_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Bank Info */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Account Holder
//                       </p>
//                       <p className="text-lg font-bold text-slate-800 uppercase italic">
//                         {kyc.account_holder_name}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Account Number
//                         </p>
//                         <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
//                           {kyc.account_number.replace(/.(?=.{4})/g, "•")}{" "}
//                           {/* Masks number except last 4 */}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           IFSC Code
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {kyc.ifsc_code}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           #{kyc.bank_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           {new Date(kyc.bank_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Pattern Background */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid-bank"
//                           width="15"
//                           height="15"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 15 0 L 0 0 0 15"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect
//                           width="100%"
//                           height="100%"
//                           fill="url(#grid-bank)"
//                         />
//                       </svg>
//                     </div>

//                     {/* Layered Icon Stack */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Pulsing Outer Glow */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Shield/Circle Icon */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3}
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="relative text-center">
//                       <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                         Verified
//                       </h4>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
//                         Bank Confirmed
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW --- */
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Account Holder Name"
//                     placeholder="As per bank records"
//                     value={bankVerifyForm.name}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, name: v })
//                     }
//                   />
//                   <Input
//                     label="Account Number"
//                     placeholder="Enter account number"
//                     value={bankVerifyForm.bank_account}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
//                     }
//                   />
//                   <Input
//                     label="IFSC Code"
//                     placeholder="e.g. SBIN0001234"
//                     value={bankVerifyForm.ifsc}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
//                     }
//                   />
//                   <Input
//                     label="Phone Number"
//                     placeholder="Registered mobile"
//                     value={bankVerifyForm.phone}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, phone: v })
//                     }
//                   />

//                   <div className="md:col-span-2 pt-2">
//                     <button
//                       disabled={verifying}
//                       onClick={verifyBankHandler}
//                       className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
//                     >
//                       {verifying ? "Processing..." : "Verify Bank Account"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
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
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <input
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder={`Enter ${label}`}
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

//*******************************************working code phase 5 20/01/26************************************************************* */
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
//   Trash2,
//   PlusCircle,
//   Building2,
//   Briefcase,
//   MapPin,
//   Save,
//   Calendar,
//   TrendingUp,
//   Globe
// } from "lucide-react";
// import toast from "react-hot-toast";

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
//   const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [kycForm, setKycForm] = useState({
//     aadhaar_number: "",
//     pan_number: "",
//     account_holder_name: "",
//     account_number: "",
//     ifsc_code: "",
//   });
//   const [documents, setDocuments] = useState([]);
//   const [documentsLoading, setDocumentsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewDocType, setViewDocType] = useState(null);
//   const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
//   const META_DOCS = ["aadhaar", "pan", "bank"];
//   const [openVerify, setOpenVerify] = useState(null); // "pan" | "bank"
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
//   const [draftExperiences, setDraftExperiences] = useState([]);

// const emptyExperience = {
//   company_name: "",
//   job_title: "",
//   start_date: "",
//   end_date: "",
//   previous_ctc: "",
//   location: "",
//   description: "",
// };

// const [experiences, setExperiences] = useState([emptyExperience]);

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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//     fetchExperiences();
//   }, [id]);

//   useEffect(() => {
//     fetchKyc();
//   }, [id]);

//   const fetchKyc = async () => {
//     try {
//       const data = await employeeKycService.get(id);
//       if (data) {
//         setKyc(data);
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

// //   const handleSaveExperience = async () => {
// //   try {
// //     const payload = {
// //       experiences: experiences,
// //     };

// //     console.log("Submitting Experience Payload:", payload);

// //     // When backend API is ready, uncomment this:
// //     // await employeeService.saveExperience(id, payload);

// //     toast.success("Experience saved successfully");
// //     setShowExperienceModal(false);
// //   } catch (err) {
// //     console.error(err);
// //     toast.error(err.message || "Failed to save experience");
// //   }
// // };

// const handleSaveExperience = async () => {
//   try {
//     // 🔹 ONLY new experiences (no id yet)
//     const newExperiences = draftExperiences.filter(
//       (exp) =>
//         !exp.id &&
//         (exp.company_name || exp.job_title)
//     );

//     if (newExperiences.length === 0) {
//       toast.error("No new experience to save");
//       return;
//     }

//     const payload = {
//       experiences: newExperiences,
//     };

//     await employeeKycService.saveExperience(id, payload);
//     await fetchExperiences();

//     setDraftExperiences([]);
//     setShowExperienceModal(false);

//     toast.success("Experience added successfully");
//   } catch (err) {
//     toast.error(err.message || "Failed to save experience");
//   }
// };

// // const handleSaveExperience = async () => {
// //   try {
// //     const payload = {
// //       experiences: experiences,
// //     };

// //     console.log("Submitting Experience Payload:", payload);

// //     await employeeKycService.saveExperience(id, payload);
// //     await fetchExperiences();

// //     toast.success("Experience saved successfully");
// //     setShowExperienceModal(false);
// //   } catch (err) {
// //     console.error(err);
// //     toast.error(err.message || "Failed to save experience");
// //   }
// // };

// const fetchExperiences = async () => {
//   try {
//     const data = await employeeKycService.getExperiences(id);

//     if (Array.isArray(data) && data.length > 0) {
//       setExperiences(data);
//     }
//   } catch (err) {
//     console.error("Failed to fetch experiences", err);
//   }
// };

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
//         setAddress(data);
//         setAddressForm(data);
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
//     return `https://emp-onbd-1.onrender.com/${doc.document_path}`;
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

//   // 1. Sort by date (Newest First)
// const sortedExperiences = [...experiences].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

// // 2. Financial Calculations
// const totalCTC = experiences.reduce((sum, exp) => sum + Number(exp.previous_ctc || 0), 0);
// const avgCTC = experiences.length > 0 ? totalCTC / experiences.length : 0;
// const lastDrawn = experiences.length > 0 ? Number(experiences[experiences.length - 1].previous_ctc) : 0;

// // 3. AI Suggestion Logic (Standard 20% Hike)
// const suggestedCTC = lastDrawn * 1.20;

//   const aadhaarDoc = getDocument("aadhaar");
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("offer_letter");

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

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
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
//       </div>

//       {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
//           {/* COLUMN 1 */}
//           <div className="space-y-3">
//             <GridItem
//               label="Employee Code"
//               value={employee.employee_code}
//               bold
//             />
//             <GridItem label="Full Name" value={employee.full_name} />
//           </div>

//           {/* COLUMN 2 */}
//           <div className="space-y-3">
//             <GridItem label="Email" value={employee.email} />
//             <GridItem label="Phone" value={employee.phone} />
//           </div>

//           {/* COLUMN 3 */}
//           <div className="space-y-3">
//             <GridItem label="Role" value={employee.role} />
//             <GridItem label="Joining Date" value={employee.joining_date} />
//           </div>

//           {/* COLUMN 4 */}
//           <div className="space-y-3">
//             {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             <GridItem label="Status">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                   employee.status === "active"
//                     ? "bg-green-100 text-green-700"
//                     : employee.status === "created"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-slate-200 text-slate-700"
//                 }`}
//               >
//                 {employee.status}
//               </span>
//             </GridItem>
//           </div>
//         </div>
//       </div>

//       {/* <div className="flex items-center justify-between mb-6">
//   <div>
//     <h2 className="text-lg font-bold text-slate-900">
//       💼 Candidate Experience
//     </h2>
//     <p className="text-sm text-slate-500">
//       Previous work experience details
//     </p>
//   </div>

//   <button
//     onClick={() => {
//       setExperiences([emptyExperience]);
//       setShowExperienceModal(true);
//     }}
//     className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//   >
//     + Add Experience
//   </button>
// </div> */}

// <div className="space-y-8 mt-8">
//   {/* HEADER SECTION */}
//   <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//         <Briefcase size={24} />
//       </div>
//       <div>
//         <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Professional Experience</h2>
//         <p className="text-sm text-slate-500 font-medium">Verified work history and career progression</p>
//       </div>
//     </div>

//     <button
// //       onClick={() => {
// //   setExperiences((prev) => [...prev, emptyExperience]);
// //   setShowExperienceModal(true);
// // }}

// onClick={() => {
// //   setDraftExperiences([...experiences, emptyExperience]);
// () => setDraftExperiences([...draftExperiences, emptyExperience])
//   setShowExperienceModal(true);
// }}

//       className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
//     >
//       <PlusCircle size={18} /> Add Experience
//     </button>
//   </div>

//   {/* TIMELINE & DATA SECTION */}
//   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//     {/* LEFT: TIMELINE (Takes 2 columns) */}
//     <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//       {sortedExperiences.map((exp, index) => (
//         <div key={exp.id || index} className="relative pl-12 group">
//           {/* Timeline Dot */}
//           <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
//             <span className="text-[10px] font-bold">{index + 1}</span>
//           </div>

//           <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
//             <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
//               <div>
//                 <h3 className="text-lg font-bold text-slate-800">{exp.job_title}</h3>
//                 <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
//                    {exp.company_name}
//                 </p>
//               </div>
//               <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-right">
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Previous CTC</p>
//                 <p className="text-sm font-black text-slate-700">₹{(exp.previous_ctc / 100000).toFixed(2)} LPA</p>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
//               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//                 <Calendar size={14} /> {exp.start_date} — {exp.end_date}
//               </span>
//               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
//                 <MapPin size={14} /> {exp.location}
//               </span>
//             </div>

//             <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border-l-2 border-slate-200 italic">
//               "{exp.description}"
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* RIGHT: SALARY ANALYTICS (Takes 1 column) */}
//     <div className="space-y-6">
//       <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
//         <div className="absolute top-0 right-0 p-4 opacity-10">
//           <TrendingUp size={80} />
//         </div>

//         <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
//           <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//           Salary Insights
//         </h3>

//         <div className="space-y-6 relative z-10">
//           <div>
//             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Average Historic CTC</p>
//             <p className="text-2xl font-black">₹{avgCTC.toLocaleString('en-IN')}</p>
//           </div>

//           <div className="pt-6 border-t border-white/10">
//             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Last Drawn (Benchmark)</p>
//             <p className="text-2xl font-black text-blue-400">₹{lastDrawn.toLocaleString('en-IN')}</p>
//           </div>

//           <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
//             <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Recommended Offer</p>
//             <p className="text-3xl font-black text-white">₹{Math.round(suggestedCTC).toLocaleString('en-IN')}</p>
//             <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
//                +20% Market Hike
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
//         <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
//           <Globe size={16} /> Recruitment Advice
//         </h4>
//         <p className="text-xs text-blue-700 leading-relaxed">
//           The candidate has shown a <strong>{( (lastDrawn - (experiences[0]?.previous_ctc || 0)) / (experiences[0]?.previous_ctc || 1) * 100).toFixed(0)}%</strong> salary growth over their career. We suggest sticking to the recommended offer to maintain internal parity.
//         </p>
//       </div>
//     </div>
//   </div>
// </div>

//       {/* ADDRESS SECTION */}
//       {/* ADDRESS SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               🏠 Address Details
//             </h2>
//             <p className="text-sm text-slate-500">
//               Current & permanent address information
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAddressModal(true)}
//             className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
//                 value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.current_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "current",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "current"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("current");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_current",
//                             e.target.files[0],
//                           );
//                           toast.success("Current address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}
//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.permanent_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "permanent",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "permanent"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("permanent");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_permanent",
//                             e.target.files[0],
//                           );
//                           toast.success("Permanent address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
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
//         <Modal
//           title={address ? "Update Address" : "Add Address"}
//           onClose={() => setShowAddressModal(false)}
//         >
//           {/* CURRENT ADDRESS */}
//           <div className="mb-6">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Current Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.current_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line1: v })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.current_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line2: v })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.current_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.current_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.current_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* PERMANENT ADDRESS */}
//           <div className="mb-8">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Permanent Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.permanent_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line1: v,
//                   })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.permanent_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line2: v,
//                   })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.permanent_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.permanent_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.permanent_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowAddressModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 if (address) {
//                   await employeeAddressService.update(id, addressForm);
//                 } else {
//                   await employeeAddressService.create(id, addressForm);
//                 }
//                 setShowAddressModal(false);
//                 fetchAddress();
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               {address ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </Modal>
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

//       {/* DOCUMENTS / KYC SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-bold text-slate-900">
//             📄 Documents (KYC)
//           </h2>
//           <p className="text-sm text-slate-500">
//             Aadhaar, PAN, Bank, Photo & Offer Letter
//           </p>
//         </div>

//         {kycLoading ? (
//           <div className="text-center text-slate-500 py-10">
//             Loading documents...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//             <DocumentCard
//               title="Aadhaar"
//               completed={aadhaarDoc?.status === "uploaded"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-red-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("aadhaar");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("aadhaar");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="PAN"
//               completed={panDoc?.status === "uploaded"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-gray-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("pan");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("pan");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Bank Details"
//               completed={bankDoc?.status === "uploaded"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-blue-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("bank");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("bank");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Photo"
//               completed={photoDoc?.status === "uploaded"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-orange-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("photo");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("photo");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Offer Letter"
//               completed={offerDoc?.status === "uploaded"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
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

//   {showExperienceModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//     {/* MODAL CONTAINER */}
//     <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">

//       {/* 1. STICKY HEADER */}
//       <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
//         <div>
//           <h2 className="text-xl font-bold text-slate-800">Professional Experience</h2>
//           <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Step 2: Add career history</p>
//         </div>
//         <button
//           onClick={() => setShowExperienceModal(false)}
//           className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//         >
//           <XCircle size={24} />
//         </button>
//       </div>

//       {/* 2. SCROLLABLE CONTENT AREA */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 custom-scrollbar">
//         {/* {experiences.map((exp, index) => ( */}
//         {draftExperiences.map((exp, index) => (
//           <div
//             key={index}
//             className="group relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all"
//           >
//             {/* Entry Badge & Remove Button */}
//             <div className="flex justify-between items-center mb-6">
//               <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full border border-blue-100">
//                 Experience #{index + 1}
//               </span>

//               {experiences.length > 1 && (
//                 <button
//                   onClick={() => {
//                     // const updated = experiences.filter((_, i) => i !== index);
//                     const updated = draftExperiences.filter((_, i) => i !== index);
//                     // setExperiences(updated);
//                     setDraftExperiences(updated);
//                   }}
//                   className="flex items-center gap-1 text-xs text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors"
//                 >
//                   <Trash2 size={14} /> REMOVE
//                 </button>
//               )}
//             </div>

//             {/* Form Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//               <div className="space-y-1">
//                 <label className={labelStyle}>Company Name</label>
//                 <div className="relative">
//                   <Building2 className={iconStyle} />
//                   <input
//                     type="text"
//                     placeholder="e.g. Google"
//                     className={inputStyle}
//                     value={exp.company_name}
//                     onChange={(e) => {
//                     //   const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                       updated[index].company_name = e.target.value;
//                     //   setExperiences(updated);
//                     setDraftExperiences(updated);

//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className={labelStyle}>Job Title</label>
//                 <div className="relative">
//                   <Briefcase className={iconStyle} />
//                   <input
//                     type="text"
//                     placeholder="e.g. Senior Developer"
//                     className={inputStyle}
//                     value={exp.job_title}
//                     onChange={(e) => {
//                     //   const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                       updated[index].job_title = e.target.value;
//                     //   setExperiences(updated);
//                     setDraftExperiences(updated);
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className={labelStyle}>Start Date</label>
//                 <input
//                   type="date"
//                   className={inputStyle.replace('pl-10', 'pl-4')}
//                   value={exp.start_date}
//                   onChange={(e) => {
//                     // const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                     updated[index].start_date = e.target.value;
//                     // setExperiences(updated);
//                     setDraftExperiences(updated);
//                   }}
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className={labelStyle}>End Date</label>
//                 <input
//                   type="date"
//                   className={inputStyle.replace('pl-10', 'pl-4')}
//                   value={exp.end_date}
//                   onChange={(e) => {
//                     // const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                     updated[index].end_date = e.target.value;
//                     // setExperiences(updated);
//                     setDraftExperiences(updated);
//                   }}
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className={labelStyle}>Previous CTC (Annual)</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
//                   <input
//                     type="number"
//                     placeholder="3,00,000"
//                     className={inputStyle}
//                     value={exp.previous_ctc}
//                     onChange={(e) => {
//                     //   const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                       updated[index].previous_ctc = e.target.value;
//                     //   setExperiences(updated);
//                     setDraftExperiences(updated);

//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className={labelStyle}>Location</label>
//                 <div className="relative">
//                   <MapPin className={iconStyle} />
//                   <input
//                     type="text"
//                     placeholder="e.g. Mumbai"
//                     className={inputStyle}
//                     value={exp.location}
//                     onChange={(e) => {
//                     //   const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                       updated[index].location = e.target.value;
//                     //   setExperiences(updated);
//                     setDraftExperiences(updated);
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="md:col-span-2 space-y-1">
//                 <label className={labelStyle}>Role Description</label>
//                 <textarea
//                   rows={3}
//                   placeholder="Key responsibilities and achievements..."
//                   className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
//                   value={exp.description}
//                   onChange={(e) => {
//                     // const updated = [...experiences];
//                     const updated = [...draftExperiences];
//                     updated[index].description = e.target.value;
//                     // setExperiences(updated);
//                     setDraftExperiences(updated);

//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* ADD ANOTHER BUTTON - inside scroll area at bottom */}
//         <button
//           onClick={
//             // () => setExperiences([...experiences, emptyExperience])
//             // () => setDraftExperiences([...experiences, emptyExperience])
//             () => setDraftExperiences([...draftExperiences, emptyExperience])

//         }
//           className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
//         >
//           <PlusCircle size={18} /> ADD ANOTHER EXPERIENCE
//         </button>
//       </div>

//       {/* 3. STICKY FOOTER */}
//       <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//         <button
//           onClick={() => setShowExperienceModal(false)}
//           className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
//         >
//           Discard
//         </button>
//         <button
//           onClick={handleSaveExperience}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
//         >
//           <Save size={18} /> Finish & Save
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       {/* VERIFY SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <h2 className="text-lg font-bold text-slate-900 mb-4">
//           🔍 Verify KYC Details
//         </h2>

//         {/* PAN VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//               Verify PAN Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "pan" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "pan" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.pan_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Info List */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Permanent Account Number
//                       </p>
//                       <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
//                         {kyc.pan_number}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.pan_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(kyc.pan_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Background Pattern */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid"
//                           width="20"
//                           height="20"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 20 0 L 0 0 0 20"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect width="100%" height="100%" fill="url(#grid)" />
//                       </svg>
//                     </div>

//                     {/* Layered Icon */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Outer Glow Ring */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Circle */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3.5}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW (Same as before) --- */
//                 <div className="space-y-4 max-w-md">
//                   {/* ... form content ... */}
//                   <>
//                     <Input
//                       label="Name (as per PAN)"
//                       value={panVerifyForm.name}
//                       onChange={(v) =>
//                         setPanVerifyForm({ ...panVerifyForm, name: v })
//                       }
//                     />

//                     <button
//                       disabled={verifying}
//                       onClick={verifyPanHandler}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//                     >
//                       Verify PAN
//                     </button>
//                   </>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* BANK VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />{" "}
//               {/* Blue accent for Bank */}
//               Verify Bank Account
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "bank" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "bank" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.bank_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Bank Info */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Account Holder
//                       </p>
//                       <p className="text-lg font-bold text-slate-800 uppercase italic">
//                         {kyc.account_holder_name}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Account Number
//                         </p>
//                         <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
//                           {kyc.account_number.replace(/.(?=.{4})/g, "•")}{" "}
//                           {/* Masks number except last 4 */}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           IFSC Code
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {kyc.ifsc_code}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           #{kyc.bank_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           {new Date(kyc.bank_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Pattern Background */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid-bank"
//                           width="15"
//                           height="15"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 15 0 L 0 0 0 15"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect
//                           width="100%"
//                           height="100%"
//                           fill="url(#grid-bank)"
//                         />
//                       </svg>
//                     </div>

//                     {/* Layered Icon Stack */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Pulsing Outer Glow */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Shield/Circle Icon */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3}
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="relative text-center">
//                       <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                         Verified
//                       </h4>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
//                         Bank Confirmed
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW --- */
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Account Holder Name"
//                     placeholder="As per bank records"
//                     value={bankVerifyForm.name}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, name: v })
//                     }
//                   />
//                   <Input
//                     label="Account Number"
//                     placeholder="Enter account number"
//                     value={bankVerifyForm.bank_account}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
//                     }
//                   />
//                   <Input
//                     label="IFSC Code"
//                     placeholder="e.g. SBIN0001234"
//                     value={bankVerifyForm.ifsc}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
//                     }
//                   />
//                   <Input
//                     label="Phone Number"
//                     placeholder="Registered mobile"
//                     value={bankVerifyForm.phone}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, phone: v })
//                     }
//                   />

//                   <div className="md:col-span-2 pt-2">
//                     <button
//                       disabled={verifying}
//                       onClick={verifyBankHandler}
//                       className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
//                     >
//                       {verifying ? "Processing..." : "Verify Bank Account"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
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
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <input
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder={`Enter ${label}`}
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
// const inputStyle = "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400";
// const labelStyle = "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";
// const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

//****************************************************working code phase 1********************************************** */
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
// } from "lucide-react";
// import toast from "react-hot-toast";

// export default function EmployeeDetails() {
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
//   const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [kycForm, setKycForm] = useState({
//     aadhaar_number: "",
//     pan_number: "",
//     account_holder_name: "",
//     account_number: "",
//     ifsc_code: "",
//   });
//   const [documents, setDocuments] = useState([]);
//   const [documentsLoading, setDocumentsLoading] = useState(true);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewDocType, setViewDocType] = useState(null);
//   const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
//   const META_DOCS = ["aadhaar", "pan", "bank"];
//   const [openVerify, setOpenVerify] = useState(null); // "pan" | "bank"

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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//   }, [id]);

//   useEffect(() => {
//     fetchKyc();
//   }, [id]);

//   const fetchKyc = async () => {
//     try {
//       const data = await employeeKycService.get(id);
//       if (data) {
//         setKyc(data);
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
//         setAddress(data);
//         setAddressForm(data);
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
//     return `https://emp-onbd-1.onrender.com/${doc.document_path}`;
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

//   const aadhaarDoc = getDocument("aadhaar");
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("offer_letter");

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

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
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
//       </div>

//       {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
//           {/* COLUMN 1 */}
//           <div className="space-y-3">
//             <GridItem
//               label="Employee Code"
//               value={employee.employee_code}
//               bold
//             />
//             <GridItem label="Full Name" value={employee.full_name} />
//           </div>

//           {/* COLUMN 2 */}
//           <div className="space-y-3">
//             <GridItem label="Email" value={employee.email} />
//             <GridItem label="Phone" value={employee.phone} />
//           </div>

//           {/* COLUMN 3 */}
//           <div className="space-y-3">
//             <GridItem label="Role" value={employee.role} />
//             <GridItem label="Joining Date" value={employee.joining_date} />
//           </div>

//           {/* COLUMN 4 */}
//           <div className="space-y-3">
//             {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             <GridItem label="Status">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                   employee.status === "active"
//                     ? "bg-green-100 text-green-700"
//                     : employee.status === "created"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-slate-200 text-slate-700"
//                 }`}
//               >
//                 {employee.status}
//               </span>
//             </GridItem>
//           </div>
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}
//       {/* ADDRESS SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               🏠 Address Details
//             </h2>
//             <p className="text-sm text-slate-500">
//               Current & permanent address information
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAddressModal(true)}
//             className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
//                 value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.current_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "current",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "current"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("current");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_current",
//                             e.target.files[0],
//                           );
//                           toast.success("Current address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}
//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//               />

//               <div className="flex items-start gap-2">
//                 {address.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address.permanent_address_status ? (
//                   <button
//                     onClick={() => {
//                       setVerifyForm({
//                         type: "permanent",
//                         status: "verified",
//                         remarks: "",
//                       });
//                       setShowVerifyModal(true);
//                     }}
//                     className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                   >
//                     Verify
//                   </button>
//                 ) : (
//                   <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//                     {uploadingType === "permanent"
//                       ? "Uploading..."
//                       : "Upload Proof"}
//                     <input
//                       type="file"
//                       hidden
//                       onChange={async (e) => {
//                         try {
//                           setUploadingType("permanent");
//                           await employeeAddressService.uploadDocument(
//                             id,
//                             "address_proof_permanent",
//                             e.target.files[0],
//                           );
//                           toast.success("Permanent address proof uploaded");
//                           fetchAddress();
//                         } catch (err) {
//                           toast.error(err.message);
//                         } finally {
//                           setUploadingType(null);
//                         }
//                       }}
//                     />
//                   </label>
//                 )}
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
//         <Modal
//           title={address ? "Update Address" : "Add Address"}
//           onClose={() => setShowAddressModal(false)}
//         >
//           {/* CURRENT ADDRESS */}
//           <div className="mb-6">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Current Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.current_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line1: v })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.current_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_address_line2: v })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.current_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.current_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.current_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, current_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* PERMANENT ADDRESS */}
//           <div className="mb-8">
//             <h3 className="text-md font-semibold text-slate-800 mb-3">
//               Permanent Address
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               <Input
//                 label="Address Line 1"
//                 value={addressForm.permanent_address_line1}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line1: v,
//                   })
//                 }
//               />
//               <Input
//                 label="Address Line 2"
//                 value={addressForm.permanent_address_line2}
//                 onChange={(v) =>
//                   setAddressForm({
//                     ...addressForm,
//                     permanent_address_line2: v,
//                   })
//                 }
//               />
//               <Input
//                 label="City"
//                 value={addressForm.permanent_city}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_city: v })
//                 }
//               />
//               <Input
//                 label="State"
//                 value={addressForm.permanent_state}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_state: v })
//                 }
//               />
//               <Input
//                 label="Pincode"
//                 value={addressForm.permanent_pincode}
//                 onChange={(v) =>
//                   setAddressForm({ ...addressForm, permanent_pincode: v })
//                 }
//               />
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowAddressModal(false)}
//               className="px-4 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 if (address) {
//                   await employeeAddressService.update(id, addressForm);
//                 } else {
//                   await employeeAddressService.create(id, addressForm);
//                 }
//                 setShowAddressModal(false);
//                 fetchAddress();
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               {address ? "Update Address" : "Save Address"}
//             </button>
//           </div>
//         </Modal>
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

//       {/* DOCUMENTS / KYC SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <div className="mb-6">
//           <h2 className="text-lg font-bold text-slate-900">
//             📄 Documents (KYC)
//           </h2>
//           <p className="text-sm text-slate-500">
//             Aadhaar, PAN, Bank, Photo & Offer Letter
//           </p>
//         </div>

//         {kycLoading ? (
//           <div className="text-center text-slate-500 py-10">
//             Loading documents...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//             <DocumentCard
//               title="Aadhaar"
//               completed={aadhaarDoc?.status === "uploaded"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-red-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("aadhaar");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("aadhaar");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="PAN"
//               completed={panDoc?.status === "uploaded"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-gray-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("pan");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("pan");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Bank Details"
//               completed={bankDoc?.status === "uploaded"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-blue-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("bank");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("bank");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Photo"
//               completed={photoDoc?.status === "uploaded"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-orange-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("photo");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("photo");
//                 setShowViewModal(true);
//               }}
//             />

//             <DocumentCard
//               title="Offer Letter"
//               completed={offerDoc?.status === "uploaded"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "uploaded"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
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

//       {/* VERIFY SECTION */}
//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//         <h2 className="text-lg font-bold text-slate-900 mb-4">
//           🔍 Verify KYC Details
//         </h2>

//         {/* PAN VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//               Verify PAN Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "pan" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "pan" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.pan_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Info List */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Permanent Account Number
//                       </p>
//                       <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
//                         {kyc.pan_number}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.pan_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(kyc.pan_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Background Pattern */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid"
//                           width="20"
//                           height="20"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 20 0 L 0 0 0 20"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect width="100%" height="100%" fill="url(#grid)" />
//                       </svg>
//                     </div>

//                     {/* Layered Icon */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Outer Glow Ring */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Circle */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3.5}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW (Same as before) --- */
//                 <div className="space-y-4 max-w-md">
//                   {/* ... form content ... */}
//                   <>
//                     <Input
//                       label="Name (as per PAN)"
//                       value={panVerifyForm.name}
//                       onChange={(v) =>
//                         setPanVerifyForm({ ...panVerifyForm, name: v })
//                       }
//                     />

//                     <button
//                       disabled={verifying}
//                       onClick={verifyPanHandler}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//                     >
//                       Verify PAN
//                     </button>
//                   </>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* BANK VERIFY ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />{" "}
//               {/* Blue accent for Bank */}
//               Verify Bank Account
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "bank" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "bank" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.bank_status === "verified" ? (
//                 /* --- PREMIUM VERIFIED VIEW --- */
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   {/* Left Side: Bank Info */}
//                   <div className="flex-1 flex flex-col justify-center space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Account Holder
//                       </p>
//                       <p className="text-lg font-bold text-slate-800 uppercase italic">
//                         {kyc.account_holder_name}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Account Number
//                         </p>
//                         <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
//                           {kyc.account_number.replace(/.(?=.{4})/g, "•")}{" "}
//                           {/* Masks number except last 4 */}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           IFSC Code
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {kyc.ifsc_code}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           #{kyc.bank_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-xs font-medium text-slate-500">
//                           {new Date(kyc.bank_verified_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Attractive Premium Badge */}
//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
//                     {/* Geometric Pattern Background */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
//                       <svg width="100%" height="100%">
//                         <pattern
//                           id="grid-bank"
//                           width="15"
//                           height="15"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M 15 0 L 0 0 0 15"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="1"
//                           />
//                         </pattern>
//                         <rect
//                           width="100%"
//                           height="100%"
//                           fill="url(#grid-bank)"
//                         />
//                       </svg>
//                     </div>

//                     {/* Layered Icon Stack */}
//                     <div className="relative flex items-center justify-center mb-4">
//                       {/* Pulsing Outer Glow */}
//                       <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

//                       {/* Main Shield/Circle Icon */}
//                       <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-8 w-8 text-white drop-shadow-md"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={3}
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="relative text-center">
//                       <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//                         Verified
//                       </h4>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
//                         Bank Confirmed
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 /* --- FORM VIEW --- */
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Account Holder Name"
//                     placeholder="As per bank records"
//                     value={bankVerifyForm.name}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, name: v })
//                     }
//                   />
//                   <Input
//                     label="Account Number"
//                     placeholder="Enter account number"
//                     value={bankVerifyForm.bank_account}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
//                     }
//                   />
//                   <Input
//                     label="IFSC Code"
//                     placeholder="e.g. SBIN0001234"
//                     value={bankVerifyForm.ifsc}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
//                     }
//                   />
//                   <Input
//                     label="Phone Number"
//                     placeholder="Registered mobile"
//                     value={bankVerifyForm.phone}
//                     onChange={(v) =>
//                       setBankVerifyForm({ ...bankVerifyForm, phone: v })
//                     }
//                   />

//                   <div className="md:col-span-2 pt-2">
//                     <button
//                       disabled={verifying}
//                       onClick={verifyBankHandler}
//                       className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
//                     >
//                       {verifying ? "Processing..." : "Verify Bank Account"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
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
//             className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">{label}</label>
//       <input
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder={`Enter ${label}`}
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