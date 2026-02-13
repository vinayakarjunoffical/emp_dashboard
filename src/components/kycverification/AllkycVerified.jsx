import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeeService } from "../../services/employee.service";
import { employeeAddressService } from "../../services/employeeAddress.service";
import { employeeKycService } from "../../services/employeeKyc.service";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Plus,
  Eye,
  XCircle,
  Trash2,
  Hash,
  Loader2,
  Activity,
  PlusCircle,
  Shield,
  Building2,
  ChevronRight,
   Fingerprint,
  Zap,
  Upload,
  Lock,
  ChevronDown,
  Briefcase,
  MapPin,
  Save,
  ShieldCheck,
  Download,
  CheckCircle2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

/* ---------- SMALL UI HELPERS ---------- */

function Info({ label, value, bold }) {
  return (
    <div>
      <span className="block text-slate-500 font-medium mb-1">{label}</span>
      <span
        className={`text-slate-900 ${bold ? "font-bold" : "font-semibold"}`}
      >
        {value}
      </span>
    </div>
  );
}

function DocumentCard({
  title,
  completed,
  hasFile,
  onAdd,
  onView,
  iconColor = "text-blue-500",
}) {
  return (
    <div className="border border-slate-100 rounded-sm p-4 flex flex-col gap-3 items-center">
      <div className="p-4 bg-gray-50 rounded-full">
        <FileText size={32} className={iconColor} />
      </div>

      <span className="font-semibold text-sm text-slate-800">{title}</span>

      {completed && (
        <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
          <CheckCircle size={14} />
          Uploaded
        </span>
      )}

      <div className="flex gap-2">
        {!completed && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={12} />
            Add Info
          </button>
        )}

        {hasFile && (
          <button
            onClick={onView}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            <Eye size={12} />
            View
          </button>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-slate-500 font-medium mb-1">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="px-6 py-4 flex justify-between">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function GridItem({ label, value, bold, children }) {
  return (
    <div>
      <span className="block text-slate-500 font-medium mb-1">{label}</span>

      {children ? (
        children
      ) : (
        <span
          className={`text-slate-900 ${bold ? "font-bold" : "font-semibold"}`}
        >
          {value ?? "-"}
        </span>
      )}
    </div>
  );
}

function ReadBlock({ title, value }) {
  return (
    <div>
      <span className="block text-slate-500 font-medium mb-1">{title}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Add these inside your function before the return
const inputStyle =
  "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400";
const labelStyle =
  "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";
const iconStyle =
  "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";


const AllkycVerified = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);
  const [kyc, setKyc] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);
  const [showKycModal, setShowKycModal] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);

  const [kycForm, setKycForm] = useState({
    aadhaar_number: "",
    pan_number: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  });
  const [documents, setDocuments] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDocType, setViewDocType] = useState(null);
  const IMAGE_ONLY_DOCS = ["photo", "previous_offer_letter", "fitness_certificate",
  "family_photo",];
  const META_DOCS = ["aadhaar", "pan", "bank"];
  const [openVerify, setOpenVerify] = useState(null); // "pan" | "bank"
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [draftExperiences, setDraftExperiences] = useState([]);
  const emptyExperience = {
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    previous_ctc: "",
    location: "",
    description: "",
  };
  const [panVerifyForm, setPanVerifyForm] = useState({
    name: "",
  });
  const [bankVerifyForm, setBankVerifyForm] = useState({
    bank_account: "",
    ifsc: "",
    name: "",
    phone: "",
  });
  const [verifying, setVerifying] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [error, setError] = useState(null);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [aadhaarVerifyForm, setAadhaarVerifyForm] = useState({
    aadhaar_status: "",
    remarks: "",
  });
  const [showPanUpload, setShowPanUpload] = useState(false);
const [selectedPanFile, setSelectedPanFile] = useState(null);
const [selectedBankFile, setSelectedBankFile] = useState(null);
const [selectedAadhaarFile, setSelectedAadhaarFile] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);




  useEffect(() => {
    fetchEmployee();
    fetchDocuments();

  }, [id]);

  useEffect(() => {
    fetchKyc();
    handleGetFullEmployee(id);
  }, [id]);

  // const fetchKyc = async () => {
  //   try {
  //     const data = await employeeKycService.get(id);
  //     if (data) {
  //       // setKyc(data);
  //       setKyc({
  //         ...data.kyc_details, // ← flatten KYC
  //         esign_history: data.esign_history,
  //       });
  //       setKycForm({
  //         aadhaar_number: data.aadhaar_number || "",
  //         pan_number: data.pan_number || "",
  //         account_holder_name: data.account_holder_name || "",
  //         account_number: data.account_number || "",
  //         ifsc_code: data.ifsc_code || "",
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setKycLoading(false);
  //   }
  // };

  const fetchKyc = async () => {
  try {
    const data = await employeeKycService.get(id);

    if (data) {
      const kycDetails = data.kyc_details || {};

      setKyc({
        ...kycDetails,
        esign_history: data.esign_history,
      });

      setKycForm({
        aadhaar_number: kycDetails.aadhaar_number || "",
        pan_number: kycDetails.pan_number || "",
        account_holder_name: kycDetails.account_holder_name || "",
        account_number: kycDetails.account_number || "",
        ifsc_code: kycDetails.ifsc_code || "",
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    setKycLoading(false);
  }
};

  const esignHistory = kyc?.esign_history || [];

  const latestEsign =
    esignHistory.length > 0 ? esignHistory[esignHistory.length - 1] : null;

  const esignStatus = latestEsign?.status; // link_generated | signed
  const isEsignSigned = esignStatus === "signed";
  const isEsignLinkGenerated = esignStatus === "link_generated";
  const isEsignDocumentUploaded = esignStatus === "document_uploaded";

  const fetchDocuments = async () => {
    try {
      const data = await employeeKycService.getDocuments(id);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDocumentsLoading(false);
    }
  };



  const getAddressProofDoc = (type) => {
    return documents?.find((d) => d.document_type === type);
  };


  const getDocument = (type) => documents.find((d) => d.document_type === type);

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getById(id);
      setEmployee(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const getDocumentImage = (type) => {
    const doc = getDocument(type);
    if (!doc?.document_path) return null;
    return `https://apihrr.goelectronix.co.in/${doc.document_path}`;
  };

  const getKycDataByType = (type) => {
    if (!kyc) return null;

    switch (type) {
      case "aadhaar":
        return { label: "Aadhaar Number", value: kyc.aadhaar_number };
      case "pan":
        return { label: "PAN Number", value: kyc.pan_number };
      case "bank":
        return {
          label: "Account Number",
          value: kyc.account_number,
          extra: `IFSC: ${kyc.ifsc_code}`,
        };
      default:
        return null;
    }
  };

  const verifyPanHandler = async () => {
    try {
      setVerifying(true);

      const res = await employeeKycService.verifyPan(id, panVerifyForm);

      if (res.pan_status !== "verified") {
        toast.error(res.remarks || "PAN verification failed");
        return;
      }

      toast.success("PAN verified successfully");

      // update KYC state so UI switches to verified view
      setKyc((prev) => ({
        ...prev,
        ...res,
      }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setVerifying(false);
    }
  };

  // const verifyBankHandler = async () => {
  //   try {
  //     setVerifying(true);

  //     const res = await employeeKycService.verifyBank(id, bankVerifyForm);

  //     if (res.bank_status !== "verified") {
  //       toast.error(res.remarks || "Bank verification failed");
  //       return;
  //     }

  //     toast.success("Bank verified successfully");

  //     // update KYC state so UI switches to verified view
  //     setKyc((prev) => ({
  //       ...prev,
  //       ...res,
  //     }));
  //   } catch (err) {
  //     toast.error(err.message);
  //   } finally {
  //     setVerifying(false);
  //   }
  // };

  const generateVerificationId = () => {
    return (
      "ESIGN-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  };

  const submitAadhaar = async () => {
    if (aadhaarLast4.length !== 4) {
      toast.error("Enter last 4 digits of Aadhaar");
      return;
    }

    if (!documentId?.document_id) {
      toast.error("Document not uploaded yet");
      return;
    }

    try {
      setUploading(true);

      const payload = {
        verification_id: generateVerificationId(), // unique ref
        document_id: documentId.document_id,
        notification_modes: ["email"],
        auth_type: "AADHAAR",
        expiry_in_days: "7",
        capture_location: true,
        signers: [
          {
            name: employee.full_name,
            email: employee.email,
            phone: employee.phone,
            sequence: 1,
            aadhaar_last_four_digit: aadhaarLast4,
            sign_positions: [
              {
                page: 1,
                top_left_x_coordinate: 400,
                bottom_right_x_coordinate: 550,
                top_left_y_coordinate: 700,
                bottom_right_y_coordinate: 800,
              },
            ],
          },
        ],
      };

      const res = await fetch(
        "https://apihrr.goelectronix.co.in/esign/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "eSign creation failed");
      }

      const data = await res.json();

      toast.success("eSign request created successfully");
      setEsignVerified(true);

      await fetchKyc();

      console.log("eSign response:", data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const verifyAadhaarHandler = async () => {
    if (!aadhaarVerifyForm.aadhaar_status) {
      toast.error("Please select Aadhaar status");
      return;
    }

    try {
      setVerifyingAadhaar(true);

      const res = await fetch(
        `https://apihrr.goelectronix.co.in/employees/verify-aadhaar/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aadhaarVerifyForm),
        },
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();

      // 🔥 merge Aadhaar result into kyc state
      setKyc((prev) => ({
        ...prev,
        aadhaar_status: data.aadhaar_status,
        aadhaar_verified_at: new Date().toISOString(),
        aadhaar_remarks: data.remarks,
        aadhaar_verification_id: data.verification_id || "AADH-" + Date.now(),
      }));

      toast.success("Aadhaar verification updated successfully ✅");
      // await kyc();
      await fetchKyc();  
    } catch (err) {
      toast.error(err.message || "Aadhaar verification failed");
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handleKycSubmit = async () => {
  try {
    if (!activeDoc) return;

    // =========================
    // VALIDATION
    // =========================
    if (IMAGE_ONLY_DOCS.includes(activeDoc) && !selectedFile) {
      toast.error("Please upload a file");
      return;
    }

    // =========================
    // 1️⃣ SAVE METADATA (AADHAAR / PAN / BANK)
    // =========================
    let kycResponse = null;

    if (META_DOCS.includes(activeDoc)) {
      kycResponse = await employeeKycService.create(id, kycForm);
    }

    // =========================
    // 2️⃣ UPLOAD FILE (ALL DOC TYPES)
    // =========================
    let uploadResponse = null;

    if (selectedFile) {
      uploadResponse = await employeeKycService.uploadDocument(
        id,
        activeDoc,
        selectedFile
      );
    }

    // =========================
    // SUCCESS MESSAGE
    // =========================
    if (META_DOCS.includes(activeDoc) && selectedFile) {
      toast.success("KYC details & document saved successfully");
    } else if (META_DOCS.includes(activeDoc)) {
      toast.success("KYC details saved");
    } else {
      toast.success("Document uploaded successfully");
    }

    // =========================
    // CLOSE MODAL + RESET
    // =========================
    setShowKycModal(false);
    setSelectedFile(null);

    // =========================
    // REFRESH DATA
    // =========================
    await Promise.all([fetchDocuments(), fetchKyc()]);

    console.log("KYC Saved:", {
      metadata: kycResponse,
      upload: uploadResponse,
    });
  } catch (err) {
    console.error(err);
    toast.error(err.message || "KYC save failed");
  }
};



  const aadhaarDoc = getDocument("aadhaar");

  const panDoc = getDocument("pan");
  const bankDoc = getDocument("bank");
  const photoDoc = getDocument("photo");
  const offerDoc = getDocument("previous_offer_letter");
  const currentDoc = getAddressProofDoc("address_proof_current");
  const permanentDoc = getAddressProofDoc("address_proof_permanent");
  const fitnessDoc = getDocument("fitness_certificate");
const familyPhotoDoc = getDocument("family_photo");




  const uploadEsignDocument = async () => {
    if (!esignFile) {
      toast.error("Please upload a document");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("document", esignFile);
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const uploadRes = await fetch(
        "https://spillas.com/dotnet-api/Cashfree/upload-esign-document",
        {
          method: "POST",
          headers: {
            AppId: "170J3KZTCJLZBKXGQ6PAVERHYX1JLD",
            SecretKey: "TESTVPKA8XNE6R045U9JCT4KKADDF88T8UAT",
          },
          body: formData,
        },
      );

      const uploadData = await uploadRes.json();

      if (uploadData.status !== "SUCCESS") {
        throw new Error("Upload failed");
      }

      const docId = uploadData; // ✅ extract number

      setDocumentId(docId);

      // 🔥 AUTO CALL SECOND API
      await processExternalUpload(docId);

      toast.success("Document uploaded successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const processExternalUpload = async (docResponse) => {
    const res = await fetch(
      `https://apihrr.goelectronix.co.in/sesign/process-external-upload?employee_id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: docResponse.status,
          document_id: docResponse.document_id,
        }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      throw new Error("eSign process failed");
    }

    return await res.json();
  };

  const handleGetFullEmployee = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const data = await employeeKycService.getFull(id);

      setOfferProfile(data); // ✅ instead of setExperience
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


//   const submitPanMetadata = async () => {
//   try {
//     if (!kycForm.pan_number) {
//       toast.error("Enter PAN number");
//       return;
//     }

//     setVerifying(true);

//     // 🔥 ONLY THIS API WILL BE CALLED
//     await employeeKycService.create(id, {
//       pan_number: kycForm.pan_number,
//     });

//     toast.success("PAN saved successfully");

//     await fetchKyc(); // refresh UI

//   } catch (err) {
//     console.error(err);
//     toast.error(err.message || "Failed to save PAN");
//   } finally {
//     setVerifying(false);
//   }
// };


const submitPanMetadata = async () => {
  try {
    const pan = (kycForm.pan_number || "").toUpperCase().trim();

    if (!pan) {
      toast.error("Enter PAN number");
      return;
    }

    // 🔥 FRONTEND VALIDATION (prevents backend error)
    if (!isValidPan(pan)) {
      toast.error("Invalid PAN format (ABCDE1234F)");
      return;
    }

    setVerifying(true);

    await employeeKycService.create(id, {
      pan_number: pan,
    });

    toast.success("PAN saved successfully");

    await fetchKyc();

  } catch (err) {
    console.error(err);

    // Show backend error message properly
    if (err?.response?.data?.detail?.[0]?.msg) {
      toast.error(err.response.data.detail[0].msg);
    } else {
      toast.error(err.message || "Failed to save PAN");
    }
  } finally {
    setVerifying(false);
  }
};

const uploadPanDocument = async () => {
  try {
    if (!selectedPanFile) {
      toast.error("Please select PAN image");
      return;
    }

    setVerifying(true);

    await employeeKycService.uploadDocument(
      id,
      "pan",          // activeDoc = pan
      selectedPanFile
    );

    toast.success("PAN document uploaded successfully");

    setShowPanUpload(false);
    setSelectedPanFile(null);

    await fetchDocuments();
    await fetchKyc();

  } catch (err) {
    console.error(err);
    toast.error(err.message || "PAN upload failed");
  } finally {
    setVerifying(false);
  }
};

const verifyBankHandler = async () => {
  try {
    setVerifying(true);

    const payload = {
      bank_account: kyc?.account_number || 0,
      ifsc: kyc?.ifsc_code || 0,
      name: kyc?.account_holder_name || "null",
      phone: "7977458177",
    };

    const res = await employeeKycService.verifyBank(id, payload);

    if (res.bank_status !== "verified") {
      toast.error(res.remarks || "Bank verification failed");
      return;
    }

    toast.success("Bank verified successfully");

    setKyc((prev) => ({
      ...prev,
      ...res,
    }));

  } catch (err) {
    toast.error(err.message);
  } finally {
    setVerifying(false);
  }
};






  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading employee details...
      </div>
    );
  }

  if (!employee) {
    return <div className="p-10 text-center">Employee not found</div>;
  }

  const panSaved = Boolean(kyc?.pan_number);
const panUploaded = documents?.some(d => d.document_type === "pan");

const isValidPan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

// Find PAN document from documents API
const panDocObj = documents?.find(d => d.document_type === "pan");

// TRUE only when backend says PAN exists
const panExists = panDocObj?.status === "exists";


const bankSaved =
  Boolean(kyc?.account_holder_name) &&
  Boolean(kyc?.account_number) &&
  Boolean(kyc?.ifsc_code);

const bankDocObj = documents?.find(d => d.document_type === "bank");
const bankExists = bankDocObj?.status === "exists";

const aadhaarSaved = Boolean(kyc?.aadhaar_number);
const aadhaarDocObj = documents?.find(d => d.document_type === "aadhaar");
const aadhaarExists = aadhaarDocObj?.status === "exists";


const submitAadhaarMetadata = async () => {
  try {
    const aadhaar = (kycForm.aadhaar_number || "").trim();

    if (!aadhaar || aadhaar.length !== 12) {
      toast.error("Enter valid 12-digit Aadhaar");
      return;
    }

    setVerifying(true);

    await employeeKycService.create(id, {
      aadhaar_number: aadhaar,
    });

    toast.success("Aadhaar saved");
    await fetchKyc();

  } catch (err) {
    toast.error(err.message);
  } finally {
    setVerifying(false);
  }
};


const uploadAadhaarDocument = async () => {
  try {
    if (!selectedAadhaarFile) {
      toast.error("Select Aadhaar document");
      return;
    }

    setVerifying(true);

    await employeeKycService.uploadDocument(
      id,
      "aadhaar",
      selectedAadhaarFile
    );

    toast.success("Aadhaar uploaded");

    setSelectedAadhaarFile(null);
    await fetchDocuments();
    await fetchKyc();

  } catch (err) {
    toast.error(err.message);
  } finally {
    setVerifying(false);
  }
};






  return (
    <div className="min-h-screen bg-slate-50 p-8">
     



      {/* DOCUMENTS / KYC SECTION */}
      <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            📄 Documents (KYC)
          </h2>
          {/* <p className="text-sm text-slate-500">
            Aadhaar, PAN, Bank, Photo & Offer Letter
          </p> */}
        </div>

        {kycLoading ? (
          <div className="text-center text-slate-500 py-10">
            Loading documents...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            

            <DocumentCard
              title="Photo"
              completed={photoDoc?.status === "exists"}
              hasFile={!!photoDoc?.document_path}
              iconColor={
                photoDoc?.status === "exists"
                  ? "text-green-500"
                  : "text-orange-400"
              }
              onAdd={() => {
                setActiveDoc("photo");
                setShowKycModal(true);
              }}
              onView={() => {
                setViewDocType("photo");
                setShowViewModal(true);
              }}
            />

            <DocumentCard
              title="Previous Offer Letter"
              completed={offerDoc?.status === "exists"}
              hasFile={!!offerDoc?.document_path}
              iconColor={
                offerDoc?.status === "exists"
                  ? "text-green-500"
                  : "text-green-400"
              }
              onAdd={() => {
                setActiveDoc("previous_offer_letter");
                setShowKycModal(true);
              }}
              onView={() => {
                setViewDocType("previous_offer_letter");
                setShowViewModal(true);
              }}
            />


            <DocumentCard
  title="Fitness Certificate"
  completed={fitnessDoc?.status === "exists"}
  hasFile={!!fitnessDoc?.document_path}
  iconColor={
    fitnessDoc?.status === "exists"
      ? "text-green-500"
      : "text-rose-400"
  }
  onAdd={() => {
    setActiveDoc("fitness_certificate");
    setShowKycModal(true);
  }}
  onView={() => {
    setViewDocType("fitness_certificate");
    setShowViewModal(true);
  }}
/>


<DocumentCard
  title="Family Group Photo"
  completed={familyPhotoDoc?.status === "exists"}
  hasFile={!!familyPhotoDoc?.document_path}
  iconColor={
    familyPhotoDoc?.status === "exists"
      ? "text-green-500"
      : "text-purple-400"
  }
  onAdd={() => {
    setActiveDoc("family_photo");
    setShowKycModal(true);
  }}
  onView={() => {
    setViewDocType("family_photo");
    setShowViewModal(true);
  }}
/>

          </div>
        )}
      </div>

    





{/* FINANCIAL PROTOCOL: PAN ACCORDION */}
<div className="border mt-10 border-slate-200 rounded-[2rem] overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
  {/* Accordion Trigger */}
  <button
    onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
    className="w-full flex justify-between items-center px-8 py-6 group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl transition-all duration-500 ${
        kyc?.pan_status === "verified" 
        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm" 
        : "bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600"
      }`}>
        <FileText size={20} />
      </div>
      <div className="text-left">
        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.1em] leading-none mb-1.5">
          Permanent Account Number
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Pan Number: 
          </p>
          <span className="text-[11px] font-mono font-bold text-slate-600 tracking-tighter bg-slate-50 px-1.5 py-0.5 rounded">
            {kycForm.pan_number || "AWAITING INPUT"}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      {kyc?.pan_status === "verified" && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
          <ShieldCheck size={12} /> Authenticated
        </div>
      )}
      <div className={`p-2 rounded-full transition-all duration-300 ${openVerify === "pan" ? "rotate-180 bg-slate-100 text-slate-900" : "bg-transparent text-slate-300"}`}>
        <ChevronDown size={20} />
      </div>
    </div>
  </button>

  {/* Accordion Content */}
  {openVerify === "pan" && (
    <div className="p-8 pt-0 border-t border-slate-50 bg-[#F9FAFB] animate-in slide-in-from-top-4 duration-500">
      <div className="max-w-3xl mt-8 mx-auto">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          
          {/* Subtle decorative grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', size: '20px 20px' }} />

          <div className="relative z-10 space-y-8">
            
            {/* 1️⃣ SUBMISSION STATE */}
            {!panSaved && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full" />
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Official Account Registry</label>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative group flex-1">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={kycForm.pan_number || ""}
                      onChange={(e) => setKycForm({ ...kycForm, pan_number: e.target.value.toUpperCase() })}
                      className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-800 font-mono tracking-[0.3em] outline-none focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all uppercase placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                    />
                  </div>

                  <button 
                    onClick={submitPanMetadata}
                    disabled={verifying || !kycForm.pan_number}
                    className="flex items-center justify-center gap-3 px-10 h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-30 flex-shrink-0"
                  >
                    {verifying ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    Staging Entry
                  </button>
                </div>
              </div>
            )}

            {/* 2️⃣ UPLOAD STATE */}
            {panSaved && !panExists && (
              <div className="mt-6 p-8 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                   <Upload size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Awaiting Physical Evidence</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Upload the digital twin of the PAN Instrument</p>
                </div>

                <div className="w-full max-w-xs">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setSelectedPanFile(e.target.files[0])}
                    className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>

                <button
                  onClick={uploadPanDocument}
                  disabled={verifying || !selectedPanFile}
                  className="px-10 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all active:scale-95 disabled:opacity-30"
                >
                  {verifying ? "Uploading Node..." : "Commit Document"}
                </button>
              </div>
            )}

            {/* 3️⃣ VERIFICATION / STAGED STATE */}
            {!isEsignSigned && panExists && kyc?.pan_status !== "verified" && (
              <div className="mt-6 p-8 rounded-[2rem] bg-emerald-50/30 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Artifact Staged</h4>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tighter mt-0.5">Asset ready for forensic audit</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {panDocObj?.document_path && (
                    <button
                      onClick={() => window.open(`https://apihrr.goelectronix.co.in/${panDocObj.document_path}`, "_blank")}
                      className="px-5 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                    >
                      Inspect Scan
                    </button>
                  )}
                  <button
                    onClick={verifyPanHandler}
                    disabled={verifying}
                    className="px-10 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {verifying ? "Executing..." : "Run Forensic Audit"}
                  </button>
                </div>
              </div>
            )}

            {/* 4️⃣ FINAL VERIFIED STATE */}
            {kyc?.pan_status === "verified" && (
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-8 p-10 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] relative overflow-hidden animate-in fade-in zoom-in-95">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-emerald-900">
                  <ShieldCheck size={120} />
                </div>
                <div className="space-y-6 flex-1 relative z-10">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black mb-1.5">Verification Status</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Pan Card Authenticated</p>
                  </div>
                  <div className="grid grid-cols-3 gap-10 pt-6 border-t border-emerald-200/50">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registry ID</p>
                      <p className="text-sm font-bold text-slate-700">{kyc.pan_verification_id}</p>
                    </div>
                     <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pan Card Number</p>
                      <p className="text-sm font-bold text-slate-700 font-extrabold">{kycForm.pan_number || "AWAITING_INPUT"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sync Timestamp</p>
                      <p className="text-sm font-bold text-slate-700">{new Date(kyc.pan_verified_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-white rounded-full shadow-inner border border-emerald-100" />
                  <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            )}

            {/* SHARED ACTIONS FOOTER */}
            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
              {/* <div className="flex items-center gap-2.5 text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] font-black uppercase tracking-widest">Protocol Fidelity Status: Optimal</span>
              </div>
              <button 
                onClick={submitPanMetadata}
                className="group flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
              >
                Sync Metadata Engine
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button> */}
            </div>
          </div>
        </div>
        
        {/* COMPLIANCE MICRO-FOOTER */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 select-none">
           {/* <div className="flex items-center gap-1.5">
              <Lock size={12} className="text-slate-400" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Hardware Encrypted</span>
           </div>
           <div className="w-1 h-1 bg-slate-300 rounded-full" />
           <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-slate-400" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Governance Node: {kyc.pan_verification_id || "PENDING"}</span>
           </div> */}
        </div>
      </div>
    </div>
  )}
</div>



{/* FINANCIAL PROTOCOL: BANK ACCORDION */}
<div className="border border-slate-200 rounded-[2rem] mt-8 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">

  {/* Accordion Trigger */}
  <button
    onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
    className="w-full flex justify-between items-center px-8 py-6 group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl transition-all duration-500 ${
        kyc?.bank_status === "verified"
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm"
          : "bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600"
      }`}>
        <Building2 size={20} />
      </div>

      <div className="text-left">
        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.1em] leading-none mb-1.5">
          Bank Account Verification
        </h3>

        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number: </p>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
            {kyc?.account_number
              ? kyc.account_number.replace(/.(?=.{4})/g, "•")
              : "AWAITING DATA LINK"}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      {kyc?.bank_status === "verified" && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 animate-in fade-in zoom-in">
          <ShieldCheck size={12} /> Authenticated
        </div>
      )}

      <div
        className={`p-2 rounded-full transition-all duration-300 ${
          openVerify === "bank"
            ? "rotate-180 bg-slate-900 text-white"
            : "bg-transparent text-slate-300 group-hover:text-slate-900"
        }`}
      >
        <ChevronDown size={20} />
      </div>
    </div>
  </button>

  {/* Accordion Content */}
  {openVerify === "bank" && (
    <div className="p-8 pt-0 border-t border-slate-50 bg-[#F9FAFB] animate-in slide-in-from-top-4 duration-500">
      <div className="max-w-3xl mt-8 mx-auto">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* ================= 1️⃣ BANK INPUT STATE ================= */}
          {!bankSaved && (
            <div className="relative z-10 space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full" />
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Settlement Credentials</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Account Holder Name</label>
                  <Input
                    placeholder="As per bank records"
                    value={kycForm.account_holder_name}
                    onChange={(v) => setKycForm({ ...kycForm, account_holder_name: v })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Account Number</label>
                  <Input
                    placeholder="00000000000"
                    value={kycForm.account_number}
                    onChange={(v) => setKycForm({ ...kycForm, account_number: v })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">IFSC Routing Code</label>
                  <Input
                    placeholder="e.g. HDFC0001234"
                    value={kycForm.ifsc_code}
                    onChange={(v) => setKycForm({ ...kycForm, ifsc_code: v })}
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    setVerifying(true);
                    await employeeKycService.create(id, {
                      account_holder_name: kycForm.account_holder_name,
                      account_number: kycForm.account_number,
                      ifsc_code: kycForm.ifsc_code,
                    });
                    toast.success("Bank details saved");
                    await fetchKyc();
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setVerifying(false);
                  }
                }}
                className="group flex items-center justify-center gap-3 px-10 h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-30"
              >
                {verifying ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Bank Details
              </button>
            </div>
          )}

          {/* ================= 2️⃣ UPLOAD STATE ================= */}
          {bankSaved && !bankExists && (
            <div className="relative z-10 py-6 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center mx-auto text-slate-300 shadow-inner">
                <Upload size={32} />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Document Staging</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Upload Passbook or Cancelled Cheque for audit</p>
              </div>

              <div className="max-w-xs mx-auto">
                 <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setSelectedBankFile(e.target.files[0])}
                  className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>

              <button
                onClick={async () => {
                  try {
                    if (!selectedBankFile) {
                      toast.error("Please select bank document");
                      return;
                    }
                    setVerifying(true);
                    await employeeKycService.uploadDocument(id, "bank", selectedBankFile);
                    toast.success("Bank document uploaded");
                    setSelectedBankFile(null);
                    await fetchDocuments();
                    await fetchKyc();
                  } catch (err) {
                    toast.error(err.message || "Bank upload failed");
                  } finally {
                    setVerifying(false);
                  }
                }}
                className="px-10 h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
              >
                {verifying ? "Uploading Node..." : "Commit Document"}
              </button>
            </div>
          )}

          {/* ================= 3️⃣ VERIFY STATE ================= */}
          {bankExists && kyc?.bank_status !== "verified" && (
            <div className="relative z-10 p-8 rounded-[2rem] bg-amber-50/50 border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">Verification Pending</h4>
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tighter">Identity link ready for forensic audit</p>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                {bankDocObj?.document_path && (
                  <button
                    onClick={() => window.open(`https://apihrr.goelectronix.co.in/${bankDocObj.document_path}`, "_blank")}
                    className="px-6 h-12 bg-white border border-amber-200 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all"
                  >
                    Inspect Scan
                  </button>
                )}

                <button
                  onClick={verifyBankHandler}
                  disabled={verifying}
                  className="px-10 h-12 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95"
                >
                  {verifying ? "Executing Audit..." : "Execute Verification"}
                </button>
              </div>
            </div>
          )}

          {/* ================= 4️⃣ VERIFIED STATE ================= */}
          {kyc?.bank_status === "verified" && (
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 p-6 bg-emerald-50/30 border border-emerald-100 rounded-[2.5rem] animate-in zoom-in-95">
              <div className="space-y-6 flex-1 text-center md:text-left">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black">Authorized Record</p>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Bank Account Verified</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-emerald-100/50">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Holder Name</p>
                      <p className="text-sm font-bold text-slate-800">{kyc.account_holder_name}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Indexed Account</p>
                      <p className="text-sm font-mono font-bold text-slate-800 tracking-widest">
                        {kyc.account_number.replace(/.(?=.{4})/g, "•")}
                      </p>
                   </div>
                </div>
              </div>

              <div className="relative w-32 h-32 flex-shrink-0">
                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-10 animate-ping" />
                <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center border-8 border-emerald-50 shadow-inner">
                  <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          )}

          {/* Shared Compliance Footer */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-2">
                <Lock size={12} className="text-slate-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Financial Vault Node Locked</span>
             </div>
             <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
               Governance ID: {kyc.bank_verification_id || "AWAITING_AUTH"}
             </div>
          </div>

        </div>
      </div>
    </div>
  )}
</div>



{/* FINANCIAL PROTOCOL: AADHAAR ACCORDION */}
<div className="border border-slate-200 rounded-[2rem] overflow-hidden bg-white shadow-sm mt-8 transition-all hover:shadow-md">
  
  {/* HEADER: COMMAND STYLE */}
  <button
    onClick={() => setOpenVerify(openVerify === "aadhaar_full" ? null : "aadhaar_full")}
    className="w-full flex justify-between items-center px-8 py-6 group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl transition-all duration-500 ${
        kyc?.aadhaar_status === "verified" 
        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm" 
        : "bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600"
      }`}>
        <Fingerprint size={20} />
      </div>
      <div className="text-left">
        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.1em] leading-none mb-1.5">
          Aadhaar Identity Registry
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adhaar Number: </p>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded tracking-tighter">
            UID 
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      {kyc?.aadhaar_status === "verified" && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
          <ShieldCheck size={12} /> Authenticated
        </div>
      )}
      <div className={`p-2 rounded-full transition-all duration-300 ${openVerify === "aadhaar_full" ? "rotate-180 bg-slate-100 text-slate-900" : "bg-transparent text-slate-300"}`}>
        <ChevronDown size={20} />
      </div>
    </div>
  </button>

  {openVerify === "aadhaar_full" && (
    <div className="p-10 pt-0 border-t border-slate-50 bg-[#F9FAFB] animate-in slide-in-from-top-4 duration-500">
      <div className="max-w-4xl mx-auto mt-10 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative z-10 space-y-10">

          {/* STEP 1 — DATA REGISTRY INPUT */}
          {!aadhaarSaved && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full" />
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Adhaar Number</label>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative group flex-1">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                  <input 
                    type="text"
                    maxLength={12}
                    value={kycForm.aadhaar_number}
                    onChange={(e)=>setKycForm({...kycForm, aadhaar_number:e.target.value.replace(/\D/g,"")})}
                    placeholder="Enter 12 Digit UID"
                    className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-800 font-mono tracking-[0.3em] outline-none focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-600/5 transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                  />
                </div>
                <button
                  onClick={submitAadhaarMetadata}
                  className="flex items-center justify-center gap-3 px-10 h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 flex-shrink-0"
                >
                  Stage Metadata
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — PHYSICAL ARTIFACT UPLOAD */}
          {aadhaarSaved && !aadhaarExists && (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                 <Upload size={32} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Document Ingestion</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-2 max-w-xs mx-auto">Upload a high-resolution scan of the original physical document (Front & Back).</p>
              </div>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e)=>setSelectedAadhaarFile(e.target.files[0])}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />

              <button
                onClick={uploadAadhaarDocument}
                className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all active:scale-95"
              >
                Commit to Vault
              </button>
            </div>
          )}

          {/* STEP 3 — AUDIT CONSOLE */}
          {aadhaarExists && kyc?.aadhaar_status !== "verified" && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Left Column: Forensic Audit */}
                <div className="flex-1 w-full space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">System Decision</label>
                      <div className="relative">
                        <select
                          value={aadhaarVerifyForm.aadhaar_status}
                          onChange={(e) => setAadhaarVerifyForm({ ...aadhaarVerifyForm, aadhaar_status: e.target.value })}
                          className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-700 uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Awaiting Decision...</option>
                          <option value="verified" className="text-emerald-600">Approve Identity</option>
                          <option value="rejected" className="text-rose-600">Reject Protocol</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Audit Remarks</label>
                    <textarea
                      rows={4}
                      value={aadhaarVerifyForm.remarks}
                      onChange={(e) => setAadhaarVerifyForm({ ...aadhaarVerifyForm, remarks: e.target.value })}
                      placeholder="Input forensic audit summary..."
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all resize-none shadow-inner"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      disabled={verifyingAadhaar}
                      onClick={verifyAadhaarHandler}
                      className="px-10 h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30"
                    >
                      {verifyingAadhaar ? "Executing Audit..." : "Verify"}
                    </button>
                    <button className="px-6 h-14 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800">Cancel</button>
                  </div>
                </div>

                {/* Right Column: Mini Guideline */}
                <div className="w-full lg:w-72 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-between">
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} /> Audit Checklist
                      </h4>
                      <ul className="space-y-5">
                        {["Cross-check Name with Profile", "Verify Biometric Photo Clarity", "Validate UID check-sum"].map((step, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="text-[10px] font-black text-blue-600">0{i+1}</span>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{step}</p>
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — FINAL VERIFIED CERTIFICATION */}
          {kyc?.aadhaar_status === "verified" && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 p-10 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] relative overflow-hidden animate-in zoom-in-95">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-emerald-900">
                <ShieldCheck size={140} />
              </div>
              
              <div className="space-y-6 flex-1 relative z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black mb-1.5">Authorized</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Adhaar Card Verified</p>
                </div>
                
                <div className="grid grid-cols-2 gap-10 pt-6 border-t border-emerald-200/50">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Adhaar Number</p>
                    <p className="text-sm font-bold text-slate-700 font-extrabold">{kyc.aadhaar_number}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Verified Date</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(kyc.aadhaar_verified_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white/60 rounded-2xl border border-emerald-100 backdrop-blur-sm">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Auditor Remarks</p>
                   <p className="text-xs font-bold text-slate-600 italic">"{kyc.aadhaar_remarks}"</p>
                </div>
              </div>

              <div className="relative w-40 h-40 shrink-0">
                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-10 animate-ping" />
                <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center border-8 border-emerald-50 shadow-inner">
                  <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        
        {/* Compliance Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 select-none">
           {/* <div className="flex items-center gap-1.5">
              <Lock size={12} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Encrypted AES-256 Vault</span>
           </div>
           <div className="w-1 h-1 bg-slate-300 rounded-full" />
           <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">GOV_REF: REF_177080</span> */}
        </div>

      </div>
    </div>
  )}
</div>





      {showKycModal && (
        <Modal
          title={`Upload ${activeDoc.replace("_", " ")}`}
          onClose={() => {
            setShowKycModal(false);
            setSelectedFile(null);
          }}
        >
          {/* ================= METADATA ================= */}
          {activeDoc === "aadhaar" && (
            <Input
              label="Aadhaar Number"
              value={kycForm.aadhaar_number}
              onChange={(v) => setKycForm({ ...kycForm, aadhaar_number: v })}
            />
          )}

          {activeDoc === "pan" && (
            <Input
              label="PAN Number"
              value={kycForm.pan_number}
              onChange={(v) => setKycForm({ ...kycForm, pan_number: v })}
            />
          )}

          {activeDoc === "bank" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Account Holder Name"
                value={kycForm.account_holder_name}
                onChange={(v) =>
                  setKycForm({ ...kycForm, account_holder_name: v })
                }
              />
              <Input
                label="Account Number"
                value={kycForm.account_number}
                onChange={(v) => setKycForm({ ...kycForm, account_number: v })}
              />
              <Input
                label="IFSC Code"
                value={kycForm.ifsc_code}
                onChange={(v) => setKycForm({ ...kycForm, ifsc_code: v })}
              />
            </div>
          )}

          {/* ================= FILE UPLOAD ================= */}
          <div className="mt-4">
            <label className="block text-slate-500 font-medium mb-1">
              Upload Document
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowKycModal(false)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleKycSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {showViewModal && (
        <Modal
          title={`View ${viewDocType.replace("_", " ")}`}
          onClose={() => setShowViewModal(false)}
        >
          {/* IMAGE */}
          <div className="mb-4">
            <img
              src={getDocumentImage(viewDocType)}
              alt={viewDocType}
              className="w-full max-h-80 object-contain border rounded-lg"
            />
          </div>

          {/* METADATA */}
          {getKycDataByType(viewDocType) && (
            <div className="text-sm space-y-2">
              <p>
                <span className="font-semibold">
                  {getKycDataByType(viewDocType).label}:
                </span>{" "}
                {getKycDataByType(viewDocType).value}
              </p>

              {getKycDataByType(viewDocType).extra && (
                <p>{getKycDataByType(viewDocType).extra}</p>
              )}
            </div>
          )}
        </Modal>
      )}

      {showExperienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          {/* MODAL CONTAINER */}
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            {/* 1. STICKY HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Professional Experience
                </h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Step 2: Add career history
                </p>
              </div>
              <button
                onClick={() => setShowExperienceModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* 2. SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 custom-scrollbar">
              {/* {experiences.map((exp, index) => ( */}
              {draftExperiences.map((exp, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all"
                >
                  {/* Entry Badge & Remove Button */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full border border-blue-100">
                      Experience #{index + 1}
                    </span>

                    {experiences.length > 1 && (
                      <button
                        onClick={() => {
                          const updated = draftExperiences.filter(
                            (_, i) => i !== index,
                          );
                          // setExperiences(updated);
                          setDraftExperiences(updated);
                        }}
                        className="flex items-center gap-1 text-xs text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        <Trash2 size={14} /> REMOVE
                      </button>
                    )}
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                      <label className={labelStyle}>Company Name</label>
                      <div className="relative">
                        <Building2 className={iconStyle} />
                        <input
                          type="text"
                          placeholder="e.g. Google"
                          className={inputStyle}
                          value={exp.company_name}
                          onChange={(e) => {
                            const updated = [...draftExperiences];
                            updated[index].company_name = e.target.value;
                            setDraftExperiences(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyle}>Job Title</label>
                      <div className="relative">
                        <Briefcase className={iconStyle} />
                        <input
                          type="text"
                          placeholder="e.g. Senior Developer"
                          className={inputStyle}
                          value={exp.job_title}
                          onChange={(e) => {
                            //   const updated = [...experiences];
                            const updated = [...draftExperiences];
                            updated[index].job_title = e.target.value;
                            //   setExperiences(updated);
                            setDraftExperiences(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyle}>Start Date</label>
                      <input
                        type="date"
                        className={inputStyle.replace("pl-10", "pl-4")}
                        value={exp.start_date}
                        onChange={(e) => {
                          // const updated = [...experiences];
                          const updated = [...draftExperiences];
                          updated[index].start_date = e.target.value;
                          // setExperiences(updated);
                          setDraftExperiences(updated);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyle}>End Date</label>
                      <input
                        type="date"
                        className={inputStyle.replace("pl-10", "pl-4")}
                        value={exp.end_date}
                        onChange={(e) => {
                          // const updated = [...experiences];
                          const updated = [...draftExperiences];
                          updated[index].end_date = e.target.value;
                          // setExperiences(updated);
                          setDraftExperiences(updated);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyle}>
                        Previous CTC (Annual)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="3,00,000"
                          className={inputStyle}
                          value={exp.previous_ctc}
                          onChange={(e) => {
                            //   const updated = [...experiences];
                            const updated = [...draftExperiences];
                            updated[index].previous_ctc = e.target.value;
                            //   setExperiences(updated);
                            setDraftExperiences(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyle}>Location</label>
                      <div className="relative">
                        <MapPin className={iconStyle} />
                        <input
                          type="text"
                          placeholder="e.g. Mumbai"
                          className={inputStyle}
                          value={exp.location}
                          onChange={(e) => {
                            //   const updated = [...experiences];
                            const updated = [...draftExperiences];
                            updated[index].location = e.target.value;
                            //   setExperiences(updated);
                            setDraftExperiences(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className={labelStyle}>Role Description</label>
                      <textarea
                        rows={3}
                        placeholder="Key responsibilities and achievements..."
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                        value={exp.description}
                        onChange={(e) => {
                          // const updated = [...experiences];
                          const updated = [...draftExperiences];
                          updated[index].description = e.target.value;
                          // setExperiences(updated);
                          setDraftExperiences(updated);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* ADD ANOTHER BUTTON - inside scroll area at bottom */}
              <button
                onClick={() =>
                  setDraftExperiences([...draftExperiences, emptyExperience])
                }
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} /> ADD ANOTHER EXPERIENCE
              </button>
            </div>

            {/* 3. STICKY FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowExperienceModal(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSaveExperience}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <Save size={18} /> Finish & Save
              </button>
            </div>
          </div>
        </div>
      )}
    
    
    </div>

  );
}

export default AllkycVerified
