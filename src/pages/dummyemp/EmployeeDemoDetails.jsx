import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeeService } from "../../services/employee.service";
import { employeeAddressService } from "../../services/employeeAddress.service";
import { employeeKycService } from "../../services/employeeKyc.service";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Upload,
  Plus,
  Eye,
  XCircle,
  Trash2,
  PlusCircle,
  Building2,
  Fingerprint,
  ShieldAlert,
  Activity,
  Briefcase,
  Home,
  MapPin,
  Save,
  Calendar,
  TrendingUp,
  Globe,
  User,
  Send,
  ShieldCheck,
  Zap,
  Edit3,
  RefreshCcw,
  Mail,
  Download,
  CheckCircle2,
  FileCheck,
  UserCheck,
  Clock,
  History,
} from "lucide-react";
import toast from "react-hot-toast";
import JoiningLetterWorkspace from "../../components/joining/JoiningLetterWorkspace";
import JoiningDispatchUI from "../../components/joining/JoiningDispatchUI";
import OfferLatter from "../../components/offer/OfferLatter";
import AssetManager from "../../components/assets_assign/AssetManager";
import ExperienceSection from "../../components/experiance/ExperienceSection";
import DocumentSubmissionUI from "../../components/employeedocument/DocumentSubmissionUI";
import JoiningConfirmationUI from "../../components/joining/JoiningConfirmationUI";
import PolicyStepper from "../../components/policyui/PolicyStepper";

export default function EmployeeDemoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [uploadingType, setUploadingType] = useState(null);
  const [addressForm, setAddressForm] = useState({
    current_address_line1: "",
    current_address_line2: "",
    current_city: "",
    current_state: "",
    current_pincode: "",
    permanent_address_line1: "",
    permanent_address_line2: "",
    permanent_city: "",
    permanent_state: "",
    permanent_pincode: "",
  });
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyForm, setVerifyForm] = useState({
    type: "",
    status: "verified",
    remarks: "",
  });
  const [showFull, setShowFull] = useState(false);
  const [kyc, setKyc] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [kycForm, setKycForm] = useState({
    aadhaar_number: "",
    pan_number: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  });
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDocType, setViewDocType] = useState(null);
  const IMAGE_ONLY_DOCS = ["photo", "previous_offer_letter"];
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
  const [statusexp, setStatusexp] = useState([]);
  const [experiences, setExperiences] = useState([emptyExperience]);
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
  // Assets State
  const [previousAssets, setPreviousAssets] = useState([]); // from API (GET)
  const [assetRows, setAssetRows] = useState([]); // draft rows

  const [esignFile, setEsignFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [esignVerified, setEsignVerified] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);

  const [aadhaarVerifyForm, setAadhaarVerifyForm] = useState({
    aadhaar_status: "",
    remarks: "",
  });
  const [offerProfile, setOfferProfile] = useState(null);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const [exitForm, setExitForm] = useState({
    exit_date: "",
    exit_reason: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [editForm, setEditForm] = useState({
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    previous_ctc: "",
    location: "",
    description: "",
  });

  // const createEmptyAsset = () => ({
  //   category: "laptop",
  //   model: "",
  //   serial: "",
  //   model_number: "", // ✅ add
  // });

  useEffect(() => {
    fetchEmployee();
    fetchAddress();
    fetchDocuments();
    fetchExperiences();
    fetchAssets();
  }, [id]);

  useEffect(() => {
    fetchKyc();
    handleGetFullEmployee(id);
  }, [id]);

  const fetchKyc = async () => {
    try {
      const data = await employeeKycService.get(id);
      if (data) {
        // setKyc(data);
        setKyc({
          ...data.kyc_details, // ← flatten KYC
          esign_history: data.esign_history,
        });
        setKycForm({
          aadhaar_number: data.aadhaar_number || "",
          pan_number: data.pan_number || "",
          account_holder_name: data.account_holder_name || "",
          account_number: data.account_number || "",
          ifsc_code: data.ifsc_code || "",
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

  const handleSaveExperience = async () => {
    try {
      // 🔹 ONLY new experiences (no id yet)
      const newExperiences = draftExperiences.filter(
        (exp) => !exp.id && (exp.company_name || exp.job_title),
      );

      if (newExperiences.length === 0) {
        toast.error("No new experience to save");
        return;
      }

      const payload = {
        experiences: newExperiences,
      };

      await employeeKycService.saveExperience(id, payload);
      await fetchExperiences();

      setDraftExperiences([]);
      setShowExperienceModal(false);

      toast.success("Experience added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save experience");
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await employeeKycService.getExperiences(id);

      // console.log("API DATA", res);
      setStatusexp(res);

      if (res?.data && Array.isArray(res.data)) {
        setExperiences(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch experiences", err);
    }
  };

  const getAddressProofDoc = (type) => {
    return documents?.find((d) => d.document_type === type);
  };

  console.log("docuemtn", documents);

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

  const fetchAddress = async () => {
    try {
      const data = await employeeAddressService.get(id);
      if (data) {
        setAddress(data.address);
        setAddressForm(data.address);
      } else {
        setAddress(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      if (address) {
        await employeeAddressService.update(id, addressForm);
        toast.success("Address updated successfully");
      } else {
        await employeeAddressService.create(id, addressForm);
        toast.success("Address added successfully");
      }
      setShowAddressModal(false);
      fetchAddress();
    } catch (err) {
      toast.error(err.message || "Failed to save address");
    }
  };

  const handleVerifyAddress = async () => {
    try {
      await employeeAddressService.verify(id, verifyForm);
      fetchAddress();
    } catch (err) {
      console.error(err);
    }
  };

  const handleKycSubmit = async () => {
    try {
      // 1️⃣ IMAGE ONLY (PHOTO / OFFER LETTER)
      if (IMAGE_ONLY_DOCS.includes(activeDoc)) {
        if (!selectedFile) {
          toast.error("Please upload a file");
          return;
        }

        await employeeKycService.uploadDocument(id, activeDoc, selectedFile);

        toast.success("Document uploaded");
      }

      // 2️⃣ METADATA + IMAGE (AADHAAR / PAN / BANK)
      if (META_DOCS.includes(activeDoc)) {
        // a) save JSON metadata ONLY
        await employeeKycService.create(id, kycForm);

        // b) upload file ONLY
        if (selectedFile) {
          await employeeKycService.uploadDocument(id, activeDoc, selectedFile);
        }

        toast.success("KYC details saved");
      }

      setShowKycModal(false);
      setSelectedFile(null);
      await fetchDocuments();
      fetchKyc();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
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

  const verifyBankHandler = async () => {
    try {
      setVerifying(true);

      const res = await employeeKycService.verifyBank(id, bankVerifyForm);

      if (res.bank_status !== "verified") {
        toast.error(res.remarks || "Bank verification failed");
        return;
      }

      toast.success("Bank verified successfully");

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
      await kyc();
    } catch (err) {
      toast.error(err.message || "Aadhaar verification failed");
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  // 1. Sort by date (Newest First)
  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b.start_date) - new Date(a.start_date),
  );

  // 2. Financial Calculations
  const totalCTC = experiences.reduce(
    (sum, exp) => sum + Number(exp.previous_ctc || 0),
    0,
  );
  const avgCTC = experiences.length > 0 ? totalCTC / experiences.length : 0;
  const lastDrawn =
    experiences.length > 0
      ? Number(experiences[experiences.length - 1].previous_ctc)
      : 0;

  // 3. AI Suggestion Logic (Standard 20% Hike)
  const suggestedCTC = lastDrawn * 1.2;

  const aadhaarDoc = getDocument("aadhaar");

  console.log("adddharr4444", aadhaarDoc);
  const panDoc = getDocument("pan");
  const bankDoc = getDocument("bank");
  const photoDoc = getDocument("photo");
  const offerDoc = getDocument("previous_offer_letter");
  const currentDoc = getAddressProofDoc("address_proof_current");
  const permanentDoc = getAddressProofDoc("address_proof_permanent");

  //**********************************asset code */

  // Add new row
  // const addAssetRow = () => {
  //   setAssetRows((prev) => [...prev, createEmptyAsset()]);
  // };
  const addAssetRow = (asset) => {
  setAssetRows((prev) => [...prev, asset]);
};


  // Remove row
  const removeAssetRow = (index) => {
    const updated = assetRows.filter((_, i) => i !== index);
    setAssetRows(updated);
  };

  // Change row field
  const handleAssetChange = (index, field, value) => {
    setAssetRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  // const handleSubmitAssets = async () => {
  //   try {
  //     const validAssets = assetRows
  //       .filter((a) => a.model && a.serial)
  //       .map((a) => ({
  //         asset_category: a.category,
  //         asset_name: a.model,
  //         serial_number: a.serial,
  //         model_number: a.model_number ? a.model_number : null,
  //       }));

  //     if (validAssets.length === 0) {
  //       toast.error("Add valid asset details");
  //       return;
  //     }

  //     await employeeKycService.addAssets(id, { assets: validAssets });

  //     toast.success("Assets assigned successfully");
  //     setAssetRows([]);
  //     fetchAssets();
  //   } catch (err) {
  //     toast.error(err.message || "Failed to assign assets");
  //   }
  // };

const handleSubmitAssets = async () => {
    console.log("assetRows →", assetRows);
  try {
    if (assetRows.length === 0) {
      toast.error("Add at least one asset");
      return;
    }

    // 🔹 Convert UI rows → API format
    const formattedAssets = assetRows
      .filter((a) => a.asset_name && a.serial_number)
      .map((a) => ({
        asset_category: a.asset_category || "laptop",
        asset_name: a.asset_name,
        serial_number: a.serial_number,
        model_number: a.model_number || null,
        allocated_at:
          a.allocated_at || new Date().toISOString().split("T")[0],
        condition_on_allocation: a.condition_on_allocation || "new",
        remarks: a.remarks || "",
      }));

      console.log("assetRows →", assetRows);

    if (formattedAssets.length === 0) {
      toast.error("Fill required asset fields");
      return;
    }

    // 🔹 Detect if ANY asset has send_email enabled
    const sendEmailFlag = assetRows.some((a) => a.send_email === true);

    // 🔹 Final Request Body (MATCHES YOUR API)
    const payload = {
      assets: formattedAssets,
      send_email: sendEmailFlag,
    };

    console.log("API Payload →", payload);

    await employeeKycService.addAssets(id, payload);

    toast.success("Assets assigned successfully");

    setAssetRows([]); // clear draft
    fetchAssets(); // reload previous assets
  } catch (err) {
    toast.error(err.message || "Failed to assign assets");
  }
};


  const handleEmployeeExit = async () => {
    if (!exitForm.exit_date || !exitForm.exit_reason) {
      toast.error("Please provide exit date and reason");
      return;
    }

    try {
      await toast.promise(
        fetch(`https://apihrr.goelectronix.co.in/employees/${id}/exit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exitForm),
        }),
        {
          loading: "Marking employee exit...",
          success: "Employee marked as exited ✅",
          error: "Failed to update employee exit ❌",
        },
      );

      setIsExitModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await employeeKycService.getAssets(id);
      console.log("inside funbtion", res);
      setPreviousAssets(res || []);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  };

  console.log("Add assets code", previousAssets);

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

  const REVIEW_ALERT_CONFIG = {
    probation_review: {
      title: "Probation Period Concluding",
      message: "This employee's probation phase ends in",
      days: 7,
      badge: "Priority",
    },
    probation_extended: {
      title: "Probation Extended",
      message: "Extended probation review required within",
      days: 15,
      badge: "Attention",
    },
    confirmed: {
      title: "Post-Confirmation Review",
      message: "Initial performance review scheduled in",
      days: 30,
      badge: "Review",
    },
  };

  const handleEditExperience = (exp) => {
    setEditingExp(exp);

    setEditForm({
      company_name: exp.company_name || "",
      job_title: exp.job_title || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      previous_ctc: exp.previous_ctc || "",
      location: exp.location || "",
      description: exp.description || "",
    });

    setShowEditModal(true);
  };

  const handleUpdateExperience = async () => {
    if (!editingExp?.id) return;

    try {
      await fetch(
        `https://apihrr.goelectronix.co.in/employees/${id}/experiences/${editingExp.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: editForm.company_name,
            job_title: editForm.job_title,
            start_date: editForm.start_date,
            end_date: editForm.end_date,
            previous_ctc: Number(editForm.previous_ctc),
            location: editForm.location,
            description: editForm.description,
          }),
        },
      );

      toast.success("Experience updated successfully");

      setShowEditModal(false);
      setEditingExp(null);

      // 🔁 reload experiences (existing function)
      fetchExperiences();
    } catch (err) {
      toast.error("Failed to update experience");
    }
  };

  const handleSubmission = () => {
  console.log("Document Submitted");

  // Example: update employee status locally
  setEmployee((prev) => ({
    ...prev,
    status: "document_submitted",
    doc_date: new Date().toISOString().split("T")[0],
    doc_remarks: "Documents submitted successfully"
  }));
};

const HIDE_SALARY_STATUSES = [
  "on_probation",
  "confirmed",
  "probation_review",
  "extended",
  "exited",
];

const shouldHideSalaryInsights = HIDE_SALARY_STATUSES.includes(
  employee?.status
);


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

  const isProposedHigherThanRecommended =
  Number(offerProfile?.offered_ctc || 0) > Math.round(suggestedCTC);


  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* PAGE HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              Employee Details
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Dashboard <span className="mx-1">•</span> Employees{" "}
            <span className="mx-1">•</span>{" "}
            <span className="text-slate-700">Employee Details</span>
          </p>
        </div>
        {/* NEW BUTTON */}
        <button
          onClick={() => setIsExitModalOpen(true)}
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
        >
          Mark Employee Exit
        </button>
      </div>

      {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          {/* COLUMN 1 */}
          <div className="space-y-3">
            <GridItem
              label="Employee Code"
              value={employee.employee_code}
              bold
            />
            <GridItem label="Full Name" value={employee.full_name} />
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-3">
            <GridItem label="Email" value={employee.email} />
            <GridItem label="Phone" value={employee.phone} />
          </div>

          {/* COLUMN 3 */}
          <div className="space-y-3">
            <GridItem label="Role" value={employee.role} />
            <GridItem label="Joining Date" value={employee.joining_date} />
          </div>

          {/* COLUMN 4 */}
          <div className="space-y-3">
            <GridItem
              label="Department Name"
              value={employee.department_name}
            />
            <GridItem label="Status">
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
      employee.status === "active" || employee.status === "offer_accepted"
        ? "bg-green-100 text-green-700 border border-green-200"
        : employee.status === "offer_rejected"
          ? "bg-red-100 text-red-700 border border-red-200"
          : employee.status === "created"
            ? "bg-blue-100 text-blue-700 border border-blue-200"
            : "bg-slate-200 text-slate-700 border border-slate-300"
    }`}
  >
    {/* Added dot indicator for extra enterprise feel */}
    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
      employee.status === "active" || employee.status === "offer_accepted" ? "bg-green-500" :
      employee.status === "offer_rejected" ? "bg-red-500" :
      employee.status === "created" ? "bg-blue-500" : "bg-slate-500"
    }`} />
    {employee.status.replace("_", " ")}
  </span>
</GridItem>
          </div>
        </div>
      </div>

      {/* Experience SECTION */}

      <div className="space-y-8 mt-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Professional Experience
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Verified work history and career progression
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              () => setDraftExperiences([...draftExperiences, emptyExperience]);
              setShowExperienceModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <PlusCircle size={18} /> Add Experience
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
            {sortedExperiences.length > 0 ? (
              sortedExperiences.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-12 group">
                  <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {exp.job_title}
                        </h3>
                        <p className="text-blue-600 font-bold text-sm flex items-center gap-1">
                          {exp.company_name}
                        </p>
                      </div>

                      <div>
                        <button
                          onClick={() => handleEditExperience(exp)}
                          className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 rounded-lg"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          Previous CTC
                        </p>
                        <p className="text-sm font-black text-slate-700">
                          ₹{(exp.previous_ctc / 100000).toFixed(2)} LPA
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                        <Calendar size={14} /> {exp.start_date} — {exp.end_date}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                        <MapPin size={14} /> {exp.location}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border-l-2 border-slate-200 italic">
                      "{exp.description}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="relative pl-12">
                <div className="absolute left-0 w-10 h-10 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
                  <Briefcase size={16} className="text-slate-400" />
                </div>

                <div className="bg-white border border-dashed border-slate-300 p-10 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <User size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    No Professional Experience
                  </h3>
                  <p className="text-sm text-slate-500 max-w-[280px] mt-1">
                    This candidate is currently marked as a{" "}
                    <strong>Fresher</strong> or no previous work history has
                    been recorded yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {!shouldHideSalaryInsights ? (

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={80} />
              </div>

              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Salary Insights
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Average Historic CTC
                  </p>
                  <p className="text-2xl font-black">
                    ₹{avgCTC.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Last Drawn (Benchmark)
                  </p>
                  <p className="text-2xl font-black text-blue-400">
                    ₹{lastDrawn.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="mt-8 bg-blue-600 rounded-2xl p-5 shadow-inner">
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Recommended Offer
                  </p>
                  <p className="text-3xl font-black text-white">
                    ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-blue-500/30 px-2 py-1 rounded-md w-fit">
                    +20% Market Hike
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Globe size={16} /> Recruitment Advice
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                The candidate has shown a{" "}
                <strong>
                  {(
                    ((lastDrawn - (experiences[0]?.previous_ctc || 0)) /
                      (experiences[0]?.previous_ctc || 1)) *
                    100
                  ).toFixed(0)}
                  %
                </strong>{" "}
                salary growth over their career. We suggest sticking to the
                recommended offer to maintain internal parity.
              </p>
            </div>
          </div>

          ) : (
            /* ================= CURRENT SALARY (NEW UI) ================= */
  // <div className="space-y-6">
  //   <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">

  //     <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
  //       <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
  //       Current Salary
  //     </h3>

  //     <div className="space-y-6">
  //       <div>
  //         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
  //           Current CTC
  //         </p>
  //         <p className="text-3xl font-black text-green-400">
  //           ₹{(employee?.offered_ctc || 0).toLocaleString("en-IN")}
  //         </p>
  //       </div>

  //       <div className="pt-6 border-t border-white/10">
  //         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
  //           Employment Status
  //         </p>
  //         <p className="text-lg font-bold text-white capitalize">
  //           {employee?.status?.replaceAll("_", " ") || "N/A"}
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  <div className="space-y-6">
  <div className="group relative bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-800">
    
    {/* AMBIENT BACKGROUND GLOW */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
    
    {/* HEADER SECTION */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1.5">
            Compensation Ledger
          </h3>
          <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-tighter italic">
            Active Payroll Cycle
          </p>
        </div>
      </div>
      
      {/* SHIELD ICON FOR SECURITY FEEL */}
      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
    </div>

    {/* MAIN CTC DISPLAY */}
    <div className="space-y-8">
      <div>
        <div className="flex items-end gap-2 mb-1">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
            Annual Gross CTC
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-emerald-500/50">₹</span>
          <p className="text-4xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-500">
            {(employee?.offered_ctc || 0).toLocaleString("en-IN")}
          </p>
          <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
            INR
          </span>
        </div>
      </div>

      {/* STATUS SECTION */}
      <div className="pt-6 border-t border-white/5 relative">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
              Employment Status
            </p>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                 <p className="text-[11px] font-black text-white uppercase tracking-wider">
                  {employee?.status?.replaceAll("_", " ") || "UNVERIFIED"}
                </p>
              </div>
            </div>
          </div>
          
          {/* MICRO-TRENDING INDICATOR */}
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Audit Trail</p>
            <p className="text-[10px] font-bold text-slate-400">Locked</p>
          </div>
        </div>
      </div>
    </div>

    {/* DECORATIVE BOTTOM SCAN-LINE */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </div>
</div>
          )}
        </div>
      </div>

      {/* ADDRESS SECTION */}

      <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              🏠 Address Details
            </h2>
            <p className="text-sm text-slate-500">
              Current & permanent address information
            </p>
          </div>

          <button
            onClick={() => setShowAddressModal(true)}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {address ? "Update Address" : "Add Address"}
          </button>
        </div>

        {/* CONTENT */}
        {addressLoading ? (
          <div className="text-center py-10 text-slate-500">
            Loading address...
          </div>
        ) : address ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* CURRENT ADDRESS CARD */}
            <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
              <ReadBlock
                title="Current Address"
                value={`${address?.current_address_line1 || "-"}, ${address?.current_city || "-"}, ${address?.current_state || "-"} - ${address?.current_pincode || "-"}`}
              />

              <div className="flex items-start gap-2">
                {/* VERIFIED */}
                {address?.current_address_status === "verified" && (
                  <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
                    Verified
                  </span>
                )}

                {/* DOCUMENT EXISTS → VERIFY */}
                {address?.current_address_status !== "verified" &&
                  currentDoc?.status === "exists" && (
                    <button
                      onClick={() => {
                        setVerifyForm({
                          type: "current",
                          status: "verified",
                          remarks: "",
                        });
                        setShowVerifyModal(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
                    >
                      Verify
                    </button>
                  )}

                {/* ✅ VIEW BUTTON */}
                {currentDoc?.status === "exists" &&
                  currentDoc?.document?.document_path && (
                    <button
                      onClick={() =>
                        window.open(
                          `${currentDoc.document.document_path}`,
                          "_blank",
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
                    >
                      View
                    </button>
                  )}

                {/* DOCUMENT NOT EXISTS → UPLOAD */}
                {currentDoc?.status === "not_exists" && (
                  <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                    Upload Proof
                    <input
                      type="file"
                      hidden
                      onChange={async (e) => {
                        try {
                          await employeeAddressService.uploadDocument(
                            id,
                            "address_proof_current",
                            e.target.files[0],
                          );
                          toast.success("Current address proof uploaded");
                          fetchDocuments();
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* PERMANENT ADDRESS CARD */}

            <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
              <ReadBlock
                title="Permanent Address"
                value={`${address?.permanent_address_line1 || "-"}, ${address?.permanent_city || "-"}, ${address?.permanent_state || "-"} - ${address?.permanent_pincode || "-"}`}
              />

              <div className="flex items-start gap-2">
                {address?.permanent_address_status === "verified" && (
                  <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
                    Verified
                  </span>
                )}

                {address?.permanent_address_status !== "verified" &&
                  permanentDoc?.status === "exists" && (
                    <button
                      onClick={() => {
                        setVerifyForm({
                          type: "permanent",
                          status: "verified",
                          remarks: "",
                        });
                        setShowVerifyModal(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
                    >
                      Verify
                    </button>
                  )}

                {/* ✅ VIEW BUTTON */}
                {permanentDoc?.status === "exists" &&
                  permanentDoc?.document?.document_path && (
                    <button
                      onClick={() =>
                        window.open(
                          `${permanentDoc.document.document_path}`,
                          "_blank",
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
                    >
                      View
                    </button>
                  )}

                {permanentDoc?.status === "not_exists" && (
                  <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                    Upload Proof
                    <input
                      type="file"
                      hidden
                      onChange={async (e) => {
                        try {
                          await employeeAddressService.uploadDocument(
                            id,
                            "address_proof_permanent",
                            e.target.files[0],
                          );
                          toast.success("Permanent address proof uploaded");
                          fetchDocuments();
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 py-6">
            No address added yet.
          </div>
        )}
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* High-End Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowAddressModal(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* 1. Header: Overlapping / Sticky Style */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {address ? "Update Address Profile" : "Add Address Details"}
                </h2>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.15em] mt-0.5">
                  Personnel_Location_Master / v2.0
                </p>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* 2. Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30 custom-scrollbar">
              {/* CURRENT ADDRESS SECTION */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <MapPin size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Current Residence
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Address Line 1
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.current_address_line1 || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          current_address_line1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Address Line 2
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.current_address_line2 || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          current_address_line2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.current_city || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          current_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      State
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.current_state || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          current_state: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pincode
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.current_pincode || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          current_pincode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Transition
                  </span>
                </div>
              </div>

              {/* PERMANENT ADDRESS SECTION */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <Home size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Permanent Residence
                    </h3>
                  </div>

                  {/* SYNC TOOL */}
                  <label className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:shadow-sm transition-all group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAddressForm({
                            ...addressForm,
                            permanent_address_line1:
                              addressForm.current_address_line1,
                            permanent_address_line2:
                              addressForm.current_address_line2,
                            permanent_city: addressForm.current_city,
                            permanent_state: addressForm.current_state,
                            permanent_pincode: addressForm.current_pincode,
                          });
                        }
                      }}
                    />
                    <span className="text-[11px] font-black text-slate-500 group-hover:text-indigo-600 uppercase tracking-tight transition-colors">
                      Same as Current Address
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Address Line 1
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.permanent_address_line1 || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          permanent_address_line1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Address Line 2
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.permanent_address_line2 || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          permanent_address_line2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.permanent_city || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          permanent_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      State
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.permanent_state || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          permanent_state: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pincode
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={addressForm?.permanent_pincode || ""}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          permanent_pincode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Sticky Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-20">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (address) {
                    await employeeAddressService.update(id, addressForm);
                  } else {
                    await employeeAddressService.create(id, addressForm);
                  }
                  setShowAddressModal(false);
                  fetchAddress();
                }}
                className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Save size={18} />
                {address ? "Sync Updates" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerifyModal && (
        <Modal title="Verify Address" onClose={() => setShowVerifyModal(false)}>
          {/* INFO */}
          <p className="text-sm text-slate-600 mb-4">
            Verifying{" "}
            <span className="font-semibold capitalize">{verifyForm.type}</span>{" "}
            address
          </p>

          {/* REMARKS (ONLY INPUT) */}
          <div className="mb-6">
            <label className="block text-slate-500 font-medium mb-1">
              Remarks
            </label>
            <textarea
              value={verifyForm.remarks}
              onChange={(e) =>
                setVerifyForm({ ...verifyForm, remarks: e.target.value })
              }
              placeholder="Enter verification remarks"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await employeeAddressService.verify(id, verifyForm);
                  toast.success("Address verified successfully");
                  setShowVerifyModal(false);
                  fetchAddress();
                } catch (err) {
                  toast.error(err.message);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              Verify
            </button>
          </div>
        </Modal>
      )}

      {/* offer SECTION */}
      <div>
        {!["offer_accepted", "confirmed", "on_probation" , "probation_review"].includes(
          employee?.status,
        ) ? (
          <OfferLatter employee={employee} fetchEmployee={fetchEmployee} recommendedCtc={Math.round(suggestedCTC)} />
        ) : (
          <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
            {/* Left Section: Identity & Data */}
            <div className="flex items-center w-full lg:w-auto">
              {/* Icon Representation of a Document */}
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                <FileText size={24} strokeWidth={1.5} />
              </div>

              <div className="ml-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                    {offerProfile?.full_name || "-"}
                  </h3>
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                </div>

                {/* Designation & Package Row */}
                <div className="flex items-center gap-6 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      Designation
                    </span>
                    <span className="text-[12px] text-slate-600 font-medium">
                      {offerProfile?.role || "-"}
                    </span>
                  </div>

                  <div className="h-6 w-[1px] bg-slate-100"></div>

                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      Offer Amount
                    </span>
                    <span className="text-[12px] text-slate-900 font-mono font-bold">
                      ₹{offerProfile?.offered_ctc || "-"}
                      <span className="text-[10px] text-slate-400 ml-0.5">
                        /annum
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Actions & Status */}
            <div className="mt-5 lg:mt-0 w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-end gap-4">
              {/* Download Button - Professional Ghost Style */}

              <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>

              {/* Attractive Success Indicator */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
                <CheckCircle2 size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[1.5px]">
                  Completed
                </span>
              </div>
            </div>

            {/* Subtle Background Badge for "Signed" status */}
            <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
              <CheckCircle2 size={80} />
            </div>
          </div>
        )}
      </div>
     
      {/* joining SECTION */}
      <div>
        {/* 1️⃣ If status is offer_accepted */}
        {employee?.status === "offer_accepted" && (
          <JoiningDispatchUI employee={employee} />
        )}

        {/* 2️⃣ If status is confirmed */}
        {["confirmed", "on_probation"].includes(employee?.status) && (
          <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
            {/* Left Section: Logistics & Reporting */}
            <div className="flex items-center w-full lg:w-auto">
              {/* Document Branding Icon */}
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <FileCheck size={28} strokeWidth={1.5} />
              </div>

              <div className="ml-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                    Joining Formalities
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 uppercase tracking-wider">
                    Confirmed
                  </span>
                </div>

                {/* Logistics Grid */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
                  {/* Joining Date */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-slate-50 rounded-md">
                      <Calendar size={14} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
                        Joining Date
                      </span>
                      <span className="text-[12px] text-slate-700 font-semibold">
                        {offerProfile?.joining_date
                          ? new Date(
                              offerProfile.joining_date,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Reporting To */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-slate-50 rounded-md">
                      <UserCheck size={14} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
                        Reporting To
                      </span>
                      <span className="text-[12px] text-slate-700 font-semibold">
                        {offerProfile?.reporting_manager_name}{" "}
                        <span className="text-slate-400 font-normal text-[11px]">
                          (VP Ops)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Reporting Time */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-slate-50 rounded-md">
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
                        Reporting Time
                      </span>
                      <span className="text-[12px] text-slate-700 font-semibold">
                        {offerProfile?.joining_time || "-"}{" "}
                        <span className="text-slate-400 font-normal text-[11px]">
                          (IST)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Professional CTA Group */}
            <div className="mt-6 lg:mt-0 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
              {/* Download Joining Letter - Enterprise Style */}

              <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>

              {/* Final Status Indicator */}
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <CheckCircle2 size={18} strokeWidth={2.5} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase tracking-[1.5px]">
                    {/* Onboarded */}
                    Joining Latter Send
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Watermark */}
            <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-[0.4] pointer-events-none group-hover:text-blue-50 transition-colors">
              <FileCheck size={120} />
            </div>
          </div>
        )}
      </div>


          {/* document verification employee */}
<div className="w-full mb-8 mt-8 p-1 md:p-1 lg:p-1 flex justify-center">
  
  <div className="w-full  flex flex-col gap-8">
    
    {/* 1. MODULE BREADCRUMB & HEADER
    <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase tracking-widest">
            Step 04
          </span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            / Employee Onboarding
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Document Verification <span className="text-slate-400 font-light">Module</span>
        </h1>
      </div>

      <div className="flex items-center gap-6 pb-1">
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Integrity</p>
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end">
            <ShieldCheck size={14} /> Encrypted
          </p>
        </div>
        <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Priority</p>
          <p className="text-sm font-bold text-slate-700 uppercase">Critical</p>
        </div>
      </div>
    </div> */}

    {/* 2. THE COMPONENT CONTAINER (No Borders, Layered Elevation) */}
    <div className="relative group transition-all duration-500">
      
      {/* Decorative Glow (Ambient Background) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
      
      {/* The Main Content Card */}
      {/* <div className="relative bg-white/80  rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden"> */}
      <div className="relative bg-white/80 rounded-[2rem] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">

        
        {/* Subtle Internal Shadow for Depth */}
        <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-slate-900/5 pointer-events-none"></div>
        
        <DocumentSubmissionUI 
        employeeId={employee.id}
           status={employee.doc_submission_status} 
           submissionDate={employee.doc_date} 
           remarks={employee.doc_remarks}
           onDocumentSubmit={handleSubmission}
           employee={employee}
           employeedata = {offerProfile}
        />

      </div>

     
    </div>

  </div>
</div>


       {/* DOCUMENTS / KYC SECTION */}
      <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            📄 Documents (KYC)
          </h2>
          <p className="text-sm text-slate-500">
            Aadhaar, PAN, Bank, Photo & Offer Letter
          </p>
        </div>

        {kycLoading ? (
          <div className="text-center text-slate-500 py-10">
            Loading documents...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <DocumentCard
              title="Aadhaar"
              completed={aadhaarDoc?.status === "exists"}
              hasFile={!!aadhaarDoc?.document_path}
              iconColor={
                aadhaarDoc?.status === "exists"
                  ? "text-green-500"
                  : "text-red-400"
              }
              onAdd={() => {
                setActiveDoc("aadhaar");
                setShowKycModal(true);
              }}
              onView={() => {
                setViewDocType("aadhaar");
                setShowViewModal(true);
              }}
            />

            <DocumentCard
              title="PAN"
              completed={panDoc?.status === "exists"}
              hasFile={!!panDoc?.document_path}
              iconColor={
                panDoc?.status === "exists" ? "text-green-500" : "text-gray-400"
              }
              onAdd={() => {
                setActiveDoc("pan");
                setShowKycModal(true);
              }}
              onView={() => {
                setViewDocType("pan");
                setShowViewModal(true);
              }}
            />

            <DocumentCard
              title="Bank Details"
              completed={bankDoc?.status === "exists"}
              hasFile={!!bankDoc?.document_path}
              iconColor={
                bankDoc?.status === "exists"
                  ? "text-green-500"
                  : "text-blue-400"
              }
              onAdd={() => {
                setActiveDoc("bank");
                setShowKycModal(true);
              }}
              onView={() => {
                setViewDocType("bank");
                setShowViewModal(true);
              }}
            />

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
              title="Offer Letter"
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
          </div>
        )}
      </div>


      {/* VERIFY SECTION */}

      <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          🔍 Verify KYC Details
        </h2>

        {/* PAN VERIFY ACCORDION */}

        <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
          <button
            onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
            className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              Verify PAN Card
            </div>
            <span className="text-xl text-slate-400">
              {openVerify === "pan" ? "−" : "+"}
            </span>
          </button>

          {openVerify === "pan" && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              {kyc?.pan_status === "verified" ? (
                /* --- PREMIUM VERIFIED VIEW --- */
                <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
                  {/* Left Side: Info List */}
                  <div className="flex-1 flex flex-col justify-center space-y-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
                        Permanent Account Number
                      </p>
                      <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
                        {kyc.pan_number}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verification ID
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          #{kyc.pan_verification_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verified On
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(kyc.pan_verified_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Attractive Premium Badge */}
                  <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
                    {/* Geometric Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                      <svg width="100%" height="100%">
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    {/* Layered Icon */}
                    <div className="relative flex items-center justify-center mb-4">
                      {/* Outer Glow Ring */}
                      <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

                      {/* Main Circle */}
                      <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white drop-shadow-md"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
                      Verified
                    </h4>
                  </div>
                </div>
              ) : (
                /* --- FORM VIEW (Same as before) --- */
                <div className="space-y-4 max-w-md">
                  <>
                    {/* <Input
                      label="Name (as per PAN)"
                      value={panVerifyForm.name}
                      onChange={(v) =>
                        setPanVerifyForm({ ...panVerifyForm, name: v })
                      }
                    /> */}

                    <button
                      disabled={verifying}
                      onClick={verifyPanHandler}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                    >
                      Verify PAN
                    </button>
                  </>
                </div>
              )}
            </div>
          )}
        </div>

        {/*  adhaaar card */}

        <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
          <button
            onClick={() =>
              setOpenVerify(openVerify === "aadhaar" ? null : "aadhaar")
            }
            className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
              Verify Aadhaar Card
            </div>
            <span className="text-xl text-slate-400">
              {openVerify === "aadhaar" ? "−" : "+"}
            </span>
          </button>

          {openVerify === "aadhaar" && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              {kyc?.aadhaar_status === "verified" ? (
                <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
                        Aadhaar Status
                      </p>
                      <p className="text-xl font-bold text-slate-800">
                        {kyc.aadhaar_status.toUpperCase()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verification ID
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          #{kyc.aadhaar_verification_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verified On
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(
                            kyc.aadhaar_verified_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        Remarks
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {kyc.aadhaar_remarks}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
                    <div className="absolute w-20 h-20 bg-indigo-100 rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3.5}
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-[0.2em]">
                      Verified
                    </h4>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Left Column: Form Inputs */}
                  <div className="flex-1 w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Decision Select */}
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">
                          Verification Decision
                        </label>
                        <div className="relative">
                          <select
                            value={aadhaarVerifyForm.aadhaar_status}
                            onChange={(e) =>
                              setAadhaarVerifyForm({
                                ...aadhaarVerifyForm,
                                aadhaar_status: e.target.value,
                              })
                            }
                            className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer group-hover:border-slate-300"
                          >
                            <option value="">Choose an action...</option>
                            <option
                              value="verified"
                              className="text-emerald-600 font-bold"
                            >
                              Approve Identity
                            </option>
                            <option
                              value="rejected"
                              className="text-rose-600 font-bold"
                            >
                              Reject Document
                            </option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remarks Area */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                          Internal Remarks
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium italic">
                          User will see this note
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={aadhaarVerifyForm.remarks}
                        onChange={(e) =>
                          setAadhaarVerifyForm({
                            ...aadhaarVerifyForm,
                            remarks: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 group-hover:border-slate-300"
                        placeholder="e.g. Photograph is blurred, or Name mismatch with profile..."
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        disabled={verifyingAadhaar}
                        onClick={verifyAadhaarHandler}
                        className="relative flex-1 md:flex-none px-8 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                      >
                        {verifyingAadhaar ? (
                          <span className="flex items-center gap-2 justify-center">
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Finalize Verification"
                        )}
                      </button>
                      <button className="px-6 h-12 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Mini Guideline (The "Enterprise" touch) */}
                  <div className="w-full lg:w-72 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      Verification Steps
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                          1
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Cross-check Name with Profile.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                          2
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Ensure Document is not expired.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                          3
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Check for signs of digital editing.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BANK VERIFY ACCORDION */}

        <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
          <button
            onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
            className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />{" "}
              {/* Blue accent for Bank */}
              Verify Bank Account
            </div>
            <span className="text-xl text-slate-400">
              {openVerify === "bank" ? "−" : "+"}
            </span>
          </button>

          {openVerify === "bank" && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              {kyc?.bank_status === "verified" ? (
                /* --- PREMIUM VERIFIED VIEW --- */
                <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
                  {/* Left Side: Bank Info */}
                  <div className="flex-1 flex flex-col justify-center space-y-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
                        Account Holder
                      </p>
                      <p className="text-lg font-bold text-slate-800 uppercase italic">
                        {kyc.account_holder_name}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Account Number
                        </p>
                        <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
                          {kyc.account_number.replace(/.(?=.{4})/g, "•")}{" "}
                          {/* Masks number except last 4 */}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          IFSC Code
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {kyc.ifsc_code}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verification ID
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          #{kyc.bank_verification_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verified On
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {new Date(kyc.bank_verified_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Attractive Premium Badge */}
                  <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
                    {/* Geometric Pattern Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                      <svg width="100%" height="100%">
                        <pattern
                          id="grid-bank"
                          width="15"
                          height="15"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 15 0 L 0 0 0 15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </pattern>
                        <rect
                          width="100%"
                          height="100%"
                          fill="url(#grid-bank)"
                        />
                      </svg>
                    </div>

                    {/* Layered Icon Stack */}
                    <div className="relative flex items-center justify-center mb-4">
                      {/* Pulsing Outer Glow */}
                      <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />

                      {/* Main Shield/Circle Icon */}
                      <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white drop-shadow-md"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="relative text-center">
                      <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
                        Verified
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                        Bank Confirmed
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* --- FORM VIEW --- */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Account Holder Name"
                    placeholder="As per bank records"
                    value={bankVerifyForm.name}
                    onChange={(v) =>
                      setBankVerifyForm({ ...bankVerifyForm, name: v })
                    }
                  />
                  <Input
                    label="Account Number"
                    placeholder="Enter account number"
                    value={bankVerifyForm.bank_account}
                    onChange={(v) =>
                      setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
                    }
                  />
                  <Input
                    label="IFSC Code"
                    placeholder="e.g. SBIN0001234"
                    value={bankVerifyForm.ifsc}
                    onChange={(v) =>
                      setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
                    }
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Registered mobile"
                    value={bankVerifyForm.phone}
                    onChange={(v) =>
                      setBankVerifyForm({ ...bankVerifyForm, phone: v })
                    }
                  />

                  <div className="md:col-span-2 pt-2">
                    <button
                      disabled={verifying}
                      onClick={verifyBankHandler}
                      className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {verifying ? "Processing..." : "Verify Bank Account"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

       
      </div>

      {/* policy doc SECTION */}
      <div className=" rounded-2xl mt-8 mb-8">
        <PolicyStepper employeeId={employee.id} />
      </div>


 <div className="mt-10 mb-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          🔍 eSign KYC Verification
        </h2>

       


       

        {/* esign ACCORDION */}

        <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
          <button
            onClick={() =>
              setOpenVerify(openVerify === "esign" ? null : "esign")
            }
            className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              eSign Verification
            </div>
            <span>{openVerify === "esign" ? "−" : "+"}</span>
          </button>

          {openVerify === "esign" && (
            <div className="p-6 bg-slate-50/40 border-t">
              {console.log("ssssss", isEsignSigned)}

              {/* ================= VERIFIED VIEW ================= */}
              {isEsignSigned && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  {/* Left Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                        eSign Status
                      </p>
                      <p className="text-xl font-black text-emerald-600">
                        SIGNED
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Verification ID
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          #{latestEsign.verification_id}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(
                            latestEsign.updated_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {latestEsign.signed_doc_url && (
                      <button
                        onClick={() =>
                          window.open(latestEsign.signed_doc_url, "_blank")
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                      >
                        <Download size={14} /> Download Signed Document
                      </button>
                    )}
                  </div>

                  {/* Premium Badge */}
                  <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
                    <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
                      <CheckCircle2 size={32} className="text-white" />
                    </div>
                    <h4 className="mt-4 text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
                      Verified
                    </h4>
                  </div>
                </div>
              )}

              {/* ================= LINK GENERATED ================= */}
              {!isEsignSigned && isEsignLinkGenerated && (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <Clock size={40} className="text-amber-500 mb-3" />
                  <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">
                    Awaiting Signature
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    The eSign link has been generated and sent to the employee.
                    Waiting for Aadhaar-based signature completion.
                  </p>
                </div>
              )}

              {!isEsignSigned && isEsignDocumentUploaded && (
                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Visual Status Indicator */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-indigo-500"
                        >
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          <path d="M9 15l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white animate-spin-slow"
                        >
                          <path d="M12 2v4" />
                          <path d="M12 18v4" />
                          <path d="M4.93 4.93l2.83 2.83" />
                          <path d="M16.24 16.24l2.83 2.83" />
                          <path d="M2 12h4" />
                          <path d="M18 12h4" />
                          <path d="M4.93 19.07l2.83-2.83" />
                          <path d="M16.24 7.76l2.83-2.83" />
                        </svg>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            Final Step: Complete eSign
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                            Pending Action
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                          Your document has been securely processed and is ready
                          for signature. Please complete the Aadhaar-based eSign
                          to finalize the agreement.
                        </p>
                      </div>

                      {/* Informational Micro-card */}
                      <div className="inline-flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 pr-4 md:border-r border-slate-100">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[12px] font-semibold text-slate-600">
                            Document Uploaded
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                            Verified Secure Vault
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Primary Action */}
                  </div>
                </div>
              )}

              {/* ================= UPLOAD FLOW ================= */}

              {/* ================= AADHAAR INPUT ================= */}

              <div className="max-w-xl">
                {!latestEsign && !documentId && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* SECTION HEADER */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">
                        Upload E-Sign Document
                      </h4>
                      <p className="text-xs text-slate-500">
                        Supported formats: PDF (Max 5MB)
                      </p>
                    </div>

                    {/* DROPZONE AREA */}
                    <div className="relative group">
                      <input
                        type="file"
                        id="esign-upload"
                        onChange={(e) => setEsignFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className={`
          border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center text-center
          ${esignFile ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300"}
        `}
                      >
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${esignFile ? "bg-indigo-600 scale-110" : "bg-white shadow-sm"}`}
                        >
                          {esignFile ? (
                            <svg
                              className="w-7 h-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-7 h-7 text-slate-400 group-hover:text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                              />
                            </svg>
                          )}
                        </div>

                        {esignFile ? (
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800">
                              {esignFile.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-500">
                              {(esignFile.size / (1024 * 1024)).toFixed(2)} MB •
                              Ready to verify
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-slate-600">
                            <span className="text-indigo-600 font-bold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <button
                      onClick={uploadEsignDocument}
                      disabled={uploading || !esignFile}
                      className="w-full md:w-auto px-10 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Upload & Continue"
                      )}
                    </button>
                  </div>
                )}

                {/* ================= AADHAAR INPUT SECTION ================= */}
                {!isEsignSigned &&
                  documentId &&
                  !isEsignLinkGenerated &&
                  esignStatus !== "document_uploaded" && (
                    <div className="mt-8 space-y-5 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Confirm Identity
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Aadhaar Last 4 Digits
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="••••"
                            value={aadhaarLast4}
                            onChange={(e) =>
                              setAadhaarLast4(e.target.value.replace(/\D/g, ""))
                            }
                            className="w-full sm:w-44 h-12 text-center tracking-[0.5em] text-xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                          />
                          <button
                            onClick={submitAadhaar}
                            disabled={aadhaarLast4.length < 4}
                            className="flex-1 sm:flex-none px-8 h-12 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 shadow-lg shadow-emerald-100 disabled:shadow-none"
                          >
                            Submit Details
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1.5 ml-1">
                          <svg
                            width="12"
                            height="12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Secure end-to-end encrypted verification
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    

      

  

   {/* joining confirmation employee */}
{employee?.doc_submission_status === "submitted" && (
  <div className="mb-8">
    <JoiningConfirmationUI employee={employee} />
  </div>
)}




       {/* Assets SECTION */}

      <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-6">
        <AssetManager
          previousAssets={previousAssets}
          assetRows={assetRows}
          onAdd={addAssetRow}
          onRemove={removeAssetRow}
          onChange={handleAssetChange}
          onApiSubmit={handleSubmitAssets}
        />
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

      {isExitModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop: Professional blur with slightly lighter overlay */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsExitModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Top Warning Accent Line */}
            <div className="h-1.5 w-full bg-rose-500" />

            {/* Header: More balanced and communicative */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Initiate Offboarding
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Please provide the details to process this employee's exit
                    from the system.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body: High-clarity inputs with consistent spacing */}
            <div className="px-8 py-6 space-y-7">
              {/* Warning Notice: Common in Enterprise Software */}
              {/* Exit Date */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
                  Effective Exit Date
                </label>
                <input
                  type="date"
                  value={exitForm.exit_date}
                  onChange={(e) =>
                    setExitForm({ ...exitForm, exit_date: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                />
              </div>

              {/* Exit Reason */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
                  Reason for Separation
                </label>
                <textarea
                  rows={4}
                  placeholder="Document the primary reasons for exit (e.g., Better opportunity, Relocation, etc.)"
                  value={exitForm.exit_reason}
                  onChange={(e) =>
                    setExitForm({ ...exitForm, exit_reason: e.target.value })
                  }
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none resize-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Footer: Prominent and grouped actions */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="px-6 py-3 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all"
              >
                Discard Changes
              </button>

              <button
                onClick={handleEmployeeExit}
                className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-rose-700 shadow-xl shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Confirm Offboarding
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop: Deep Blur for focus */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowEditModal(false)}
          />

          {/* Modal Container: Precision Geometry */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* 1. Header: Matches your Step 2 Style */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Edit Experience
                </h2>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.15em] mt-0.5">
                  System Record : {editForm.company_name || "Entry_v1"}
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* 2. Form Body: Balanced Information Density */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
              {/* Experience Context Badge (Matches Step 2) */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full border border-indigo-100 mb-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                Modify Existing Record
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Company Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Company Name
                  </label>
                  <div className="relative group">
                    <Building2
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                      size={16}
                    />
                    <input
                      className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={editForm.company_name}
                      placeholder="e.g. Google"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          company_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Job Title
                  </label>
                  <div className="relative group">
                    <Briefcase
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                      size={16}
                    />
                    <input
                      className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={editForm.job_title}
                      placeholder="e.g. Senior Developer"
                      onChange={(e) =>
                        setEditForm({ ...editForm, job_title: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    value={editForm.start_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, start_date: e.target.value })
                    }
                  />
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    value={editForm.end_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, end_date: e.target.value })
                    }
                  />
                </div>

                {/* Previous CTC */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Previous CTC (Annual)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs group-focus-within:text-indigo-500 transition-colors">
                      ₹
                    </span>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={editForm.previous_ctc}
                      placeholder="0.00"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          previous_ctc: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Work Location
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                      size={16}
                    />
                    <input
                      className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      value={editForm.location}
                      placeholder="e.g. Mumbai"
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Role Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                    placeholder="Outline your key achievements and impact..."
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 3. Footer: Clear, Weighted Actions */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between sticky bottom-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
              >
                Discard Changes
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateExperience}
                  className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                >
                  <Save size={18} />
                  Update Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
      {REVIEW_ALERT_CONFIG[employee?.status] && (
        <div className="mb-8 mt-5 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[1rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 lg:px-8">
            {/* LEFT SIDE: Alert Content */}
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                    <History size={28} className="animate-pulse" />
                  </div>
                  {/* Pulsing indicator */}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                    Priority
                  </span>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    Probation Period Concluding
                  </h3>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  This employee's probation phase ends in{" "}
                  <span className="text-blue-700 font-black">7 days</span>.
                  Please conduct the final performance review.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: Action Button */}
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              {/* Simple count-down visual */}
              <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Review Deadline
                </span>
              </div>

              <button
                onClick={() => navigate(`/dummyemp/${id}/review`)}
                className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 active:scale-95 group"
              >
                <FileCheck
                  size={16}
                  className="group-hover:rotate-6 transition-transform"
                />
                Conduct Review Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
//***********************************************************working code phase 12************************************************** */
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
// import JoiningLetterWorkspace from "../../components/joining/JoiningLetterWorkspace";
// import JoiningDispatchUI from "../../components/joining/JoiningDispatchUI";
// import OfferLatter from "../../components/offer/OfferLatter";
// import AssetManager from "../../components/assets_assign/AssetManager";
// import ExperienceSection from "../../components/experiance/ExperienceSection";
// import DocumentSubmissionUI from "../../components/employeedocument/DocumentSubmissionUI";
// import JoiningConfirmationUI from "../../components/joining/JoiningConfirmationUI";
// import PolicyStepper from "../../components/policyui/PolicyStepper";

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

//   // const createEmptyAsset = () => ({
//   //   category: "laptop",
//   //   model: "",
//   //   serial: "",
//   //   model_number: "", // ✅ add
//   // });

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

//   // Add new row
//   // const addAssetRow = () => {
//   //   setAssetRows((prev) => [...prev, createEmptyAsset()]);
//   // };
//   const addAssetRow = (asset) => {
//   setAssetRows((prev) => [...prev, asset]);
// };


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

//   // const handleSubmitAssets = async () => {
//   //   try {
//   //     const validAssets = assetRows
//   //       .filter((a) => a.model && a.serial)
//   //       .map((a) => ({
//   //         asset_category: a.category,
//   //         asset_name: a.model,
//   //         serial_number: a.serial,
//   //         model_number: a.model_number ? a.model_number : null,
//   //       }));

//   //     if (validAssets.length === 0) {
//   //       toast.error("Add valid asset details");
//   //       return;
//   //     }

//   //     await employeeKycService.addAssets(id, { assets: validAssets });

//   //     toast.success("Assets assigned successfully");
//   //     setAssetRows([]);
//   //     fetchAssets();
//   //   } catch (err) {
//   //     toast.error(err.message || "Failed to assign assets");
//   //   }
//   // };

// const handleSubmitAssets = async () => {
//     console.log("assetRows →", assetRows);
//   try {
//     if (assetRows.length === 0) {
//       toast.error("Add at least one asset");
//       return;
//     }

//     // 🔹 Convert UI rows → API format
//     const formattedAssets = assetRows
//       .filter((a) => a.asset_name && a.serial_number)
//       .map((a) => ({
//         asset_category: a.asset_category || "laptop",
//         asset_name: a.asset_name,
//         serial_number: a.serial_number,
//         model_number: a.model_number || null,
//         allocated_at:
//           a.allocated_at || new Date().toISOString().split("T")[0],
//         condition_on_allocation: a.condition_on_allocation || "new",
//         remarks: a.remarks || "",
//       }));

//       console.log("assetRows →", assetRows);

//     if (formattedAssets.length === 0) {
//       toast.error("Fill required asset fields");
//       return;
//     }

//     // 🔹 Detect if ANY asset has send_email enabled
//     const sendEmailFlag = assetRows.some((a) => a.send_email === true);

//     // 🔹 Final Request Body (MATCHES YOUR API)
//     const payload = {
//       assets: formattedAssets,
//       send_email: sendEmailFlag,
//     };

//     console.log("API Payload →", payload);

//     await employeeKycService.addAssets(id, payload);

//     toast.success("Assets assigned successfully");

//     setAssetRows([]); // clear draft
//     fetchAssets(); // reload previous assets
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
//       `https://apihrr.goelectronix.co.in/sesign/process-external-upload?employee_id=${id}`,
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
//   console.log("Document Submitted");

//   // Example: update employee status locally
//   setEmployee((prev) => ({
//     ...prev,
//     status: "document_submitted",
//     doc_date: new Date().toISOString().split("T")[0],
//     doc_remarks: "Documents submitted successfully"
//   }));
// };

// const HIDE_SALARY_STATUSES = [
//   "on_probation",
//   "confirmed",
//   "probation_review",
//   "extended",
//   "exited",
// ];

// const shouldHideSalaryInsights = HIDE_SALARY_STATUSES.includes(
//   employee?.status
// );


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
//   Number(offerProfile?.offered_ctc || 0) > Math.round(suggestedCTC);


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
//         {/* NEW BUTTON */}
//         <button
//           onClick={() => setIsExitModalOpen(true)}
//           className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
//         >
//           Mark Employee Exit
//         </button>
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
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             <GridItem label="Status">
//   <span
//     className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
//       employee.status === "active" || employee.status === "offer_accepted"
//         ? "bg-green-100 text-green-700 border border-green-200"
//         : employee.status === "offer_rejected"
//           ? "bg-red-100 text-red-700 border border-red-200"
//           : employee.status === "created"
//             ? "bg-blue-100 text-blue-700 border border-blue-200"
//             : "bg-slate-200 text-slate-700 border border-slate-300"
//     }`}
//   >
//     {/* Added dot indicator for extra enterprise feel */}
//     <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
//       employee.status === "active" || employee.status === "offer_accepted" ? "bg-green-500" :
//       employee.status === "offer_rejected" ? "bg-red-500" :
//       employee.status === "created" ? "bg-blue-500" : "bg-slate-500"
//     }`} />
//     {employee.status.replace("_", " ")}
//   </span>
// </GridItem>
//           </div>
//         </div>
//       </div>

//       {/* Experience SECTION */}

//       <div className="space-y-8 mt-8">
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

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//             {sortedExperiences.length > 0 ? (
//               sortedExperiences.map((exp, index) => (
//                 <div key={exp.id || index} className="relative pl-12 group">
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

//                       <div>
//                         <button
//                           onClick={() => handleEditExperience(exp)}
//                           className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 rounded-lg"
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

//           ) : (
//             /* ================= CURRENT SALARY (NEW UI) ================= */
//   // <div className="space-y-6">
//   //   <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">

//   //     <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
//   //       <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//   //       Current Salary
//   //     </h3>

//   //     <div className="space-y-6">
//   //       <div>
//   //         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//   //           Current CTC
//   //         </p>
//   //         <p className="text-3xl font-black text-green-400">
//   //           ₹{(employee?.offered_ctc || 0).toLocaleString("en-IN")}
//   //         </p>
//   //       </div>

//   //       <div className="pt-6 border-t border-white/10">
//   //         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//   //           Employment Status
//   //         </p>
//   //         <p className="text-lg font-bold text-white capitalize">
//   //           {employee?.status?.replaceAll("_", " ") || "N/A"}
//   //         </p>
//   //       </div>
//   //     </div>
//   //   </div>
//   // </div>
//   <div className="space-y-6">
//   <div className="group relative bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-800">
    
//     {/* AMBIENT BACKGROUND GLOW */}
//     <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
    
//     {/* HEADER SECTION */}
//     <div className="flex items-center justify-between mb-8">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
//           <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
//         </div>
//         <div>
//           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1.5">
//             Compensation Ledger
//           </h3>
//           <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-tighter italic">
//             Active Payroll Cycle
//           </p>
//         </div>
//       </div>
      
//       {/* SHIELD ICON FOR SECURITY FEEL */}
//       <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
//         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
//       </div>
//     </div>

//     {/* MAIN CTC DISPLAY */}
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-end gap-2 mb-1">
//           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
//             Annual Gross CTC
//           </p>
//         </div>
//         <div className="flex items-baseline gap-1">
//           <span className="text-xl font-bold text-emerald-500/50">₹</span>
//           <p className="text-4xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-500">
//             {(employee?.offered_ctc || 0).toLocaleString("en-IN")}
//           </p>
//           <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
//             INR
//           </span>
//         </div>
//       </div>

//       {/* STATUS SECTION */}
//       <div className="pt-6 border-t border-white/5 relative">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
//               Employment Status
//             </p>
//             <div className="flex items-center gap-2">
//               <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
//                  <p className="text-[11px] font-black text-white uppercase tracking-wider">
//                   {employee?.status?.replaceAll("_", " ") || "UNVERIFIED"}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           {/* MICRO-TRENDING INDICATOR */}
//           <div className="text-right">
//             <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Audit Trail</p>
//             <p className="text-[10px] font-bold text-slate-400">Locked</p>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* DECORATIVE BOTTOM SCAN-LINE */}
//     <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
//   </div>
// </div>
//           )}
//         </div>
//       </div>

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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {/* DOCUMENT NOT EXISTS → UPLOAD */}
//                 {currentDoc?.status === "not_exists" && (
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
//                 )}
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                     >
//                       Verify
//                     </button>
//                   )}

//                 {/* ✅ VIEW BUTTON */}
//                 {address?.permanent_address_status === "verified" &&
//                   permanentDoc?.document?.document_path && (
//                     <button
//                       onClick={() =>
//                         window.open(
//                           `${permanentDoc.document.document_path}`,
//                           "_blank",
//                         )
//                       }
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {permanentDoc?.status === "not_exists" && (
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
//                 className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
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
//             <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-20">
//               <button
//                 onClick={() => setShowAddressModal(false)}
//                 className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
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
//               </button>
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
//         {!["offer_accepted", "confirmed", "on_probation" , "probation_review"].includes(
//           employee?.status,
//         ) ? (
//           <OfferLatter employee={employee} fetchEmployee={fetchEmployee} recommendedCtc={Math.round(suggestedCTC)} />
//         ) : (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Identity & Data */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Icon Representation of a Document */}
//               <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
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
//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
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
//           <JoiningDispatchUI employee={employee} />
//         )}

//         {/* 2️⃣ If status is confirmed */}
//         {["confirmed", "on_probation"].includes(employee?.status) && (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Logistics & Reporting */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Document Branding Icon */}
//               <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
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
//                         {offerProfile?.joining_date
//                           ? new Date(
//                               offerProfile.joining_date,
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
//                         {offerProfile?.reporting_manager_name}{" "}
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
//                         {offerProfile?.joining_time || "-"}{" "}
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
//               <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
//                 <CheckCircle2 size={18} strokeWidth={2.5} />
//                 <div className="flex flex-col items-start leading-none">
//                   <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                     {/* Onboarded */}
//                     Joining Latter Send
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Professional Watermark */}
//             <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-[0.4] pointer-events-none group-hover:text-blue-50 transition-colors">
//               <FileCheck size={120} />
//             </div>
//           </div>
//         )}
//       </div>


//           {/* document verification employee */}
// <div className="w-full mb-8 mt-8 p-1 md:p-1 lg:p-1 flex justify-center">
  
//   <div className="w-full  flex flex-col gap-8">
    
//     {/* 1. MODULE BREADCRUMB & HEADER
//     <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
//       <div>
//         <div className="flex items-center gap-2 mb-2">
//           <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase tracking-widest">
//             Step 04
//           </span>
//           <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//             / Employee Onboarding
//           </span>
//         </div>
//         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//           Document Verification <span className="text-slate-400 font-light">Module</span>
//         </h1>
//       </div>

//       <div className="flex items-center gap-6 pb-1">
//         <div className="text-right">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Integrity</p>
//           <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end">
//             <ShieldCheck size={14} /> Encrypted
//           </p>
//         </div>
//         <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
//         <div className="text-right">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Priority</p>
//           <p className="text-sm font-bold text-slate-700 uppercase">Critical</p>
//         </div>
//       </div>
//     </div> */}

//     {/* 2. THE COMPONENT CONTAINER (No Borders, Layered Elevation) */}
//     <div className="relative group transition-all duration-500">
      
//       {/* Decorative Glow (Ambient Background) */}
//       <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
      
//       {/* The Main Content Card */}
//       {/* <div className="relative bg-white/80  rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden"> */}
//       <div className="relative bg-white/80 rounded-[2rem] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">

        
//         {/* Subtle Internal Shadow for Depth */}
//         <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-slate-900/5 pointer-events-none"></div>
        
//         <DocumentSubmissionUI 
//         employeeId={employee.id}
//            status={employee.doc_submission_status} 
//            submissionDate={employee.doc_date} 
//            remarks={employee.doc_remarks}
//            onDocumentSubmit={handleSubmission}
//            employee={employee}
//            employeedata = {offerProfile}
//         />

//       </div>

     
//     </div>

//   </div>
// </div>


//        {/* DOCUMENTS / KYC SECTION */}
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
//               completed={aadhaarDoc?.status === "exists"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "exists"
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
//               completed={panDoc?.status === "exists"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "exists" ? "text-green-500" : "text-gray-400"
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
//               completed={bankDoc?.status === "exists"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "exists"
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
//               completed={photoDoc?.status === "exists"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "exists"
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
//               completed={offerDoc?.status === "exists"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "exists"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("previous_offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("previous_offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
//       </div>


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

//         {/*  adhaaar card */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() =>
//               setOpenVerify(openVerify === "aadhaar" ? null : "aadhaar")
//             }
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
//               Verify Aadhaar Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "aadhaar" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "aadhaar" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.aadhaar_status === "verified" ? (
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   <div className="flex-1 space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Aadhaar Status
//                       </p>
//                       <p className="text-xl font-bold text-slate-800">
//                         {kyc.aadhaar_status.toUpperCase()}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.aadhaar_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(
//                             kyc.aadhaar_verified_at,
//                           ).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     <div>
//                       <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                         Remarks
//                       </p>
//                       <p className="text-sm font-semibold text-slate-700">
//                         {kyc.aadhaar_remarks}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
//                     <div className="absolute w-20 h-20 bg-indigo-100 rounded-full animate-pulse" />
//                     <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                       <svg
//                         className="h-8 w-8 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={3.5}
//                       >
//                         <path d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <h4 className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
//                   {/* Left Column: Form Inputs */}
//                   <div className="flex-1 w-full space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Decision Select */}
//                       <div className="space-y-2 group">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">
//                           Verification Decision
//                         </label>
//                         <div className="relative">
//                           <select
//                             value={aadhaarVerifyForm.aadhaar_status}
//                             onChange={(e) =>
//                               setAadhaarVerifyForm({
//                                 ...aadhaarVerifyForm,
//                                 aadhaar_status: e.target.value,
//                               })
//                             }
//                             className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer group-hover:border-slate-300"
//                           >
//                             <option value="">Choose an action...</option>
//                             <option
//                               value="verified"
//                               className="text-emerald-600 font-bold"
//                             >
//                               Approve Identity
//                             </option>
//                             <option
//                               value="rejected"
//                               className="text-rose-600 font-bold"
//                             >
//                               Reject Document
//                             </option>
//                           </select>
//                           <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="3"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M19 9l-7 7-7-7"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Remarks Area */}
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center ml-1">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
//                           Internal Remarks
//                         </label>
//                         <span className="text-[10px] text-slate-400 font-medium italic">
//                           User will see this note
//                         </span>
//                       </div>
//                       <textarea
//                         rows={4}
//                         value={aadhaarVerifyForm.remarks}
//                         onChange={(e) =>
//                           setAadhaarVerifyForm({
//                             ...aadhaarVerifyForm,
//                             remarks: e.target.value,
//                           })
//                         }
//                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 group-hover:border-slate-300"
//                         placeholder="e.g. Photograph is blurred, or Name mismatch with profile..."
//                       />
//                     </div>

//                     {/* Action Bar */}
//                     <div className="flex items-center gap-4 pt-2">
//                       <button
//                         disabled={verifyingAadhaar}
//                         onClick={verifyAadhaarHandler}
//                         className="relative flex-1 md:flex-none px-8 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
//                       >
//                         {verifyingAadhaar ? (
//                           <span className="flex items-center gap-2 justify-center">
//                             <svg
//                               className="animate-spin h-4 w-4 text-white"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Processing...
//                           </span>
//                         ) : (
//                           "Finalize Verification"
//                         )}
//                       </button>
//                       <button className="px-6 h-12 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
//                         Cancel
//                       </button>
//                     </div>
//                   </div>

//                   {/* Right Column: Mini Guideline (The "Enterprise" touch) */}
//                   <div className="w-full lg:w-72 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
//                       Verification Steps
//                     </h4>
//                     <ul className="space-y-4">
//                       <li className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
//                           1
//                         </div>
//                         <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                           Cross-check Name with Profile.
//                         </p>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
//                           2
//                         </div>
//                         <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                           Ensure Document is not expired.
//                         </p>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
//                           3
//                         </div>
//                         <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                           Check for signs of digital editing.
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
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

//         {/* esign ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
//           <button
//             onClick={() =>
//               setOpenVerify(openVerify === "esign" ? null : "esign")
//             }
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
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
//                           className="text-indigo-500"
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
//                       <h4 className="text-sm font-bold text-slate-800">
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
//           ${esignFile ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300"}
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
//                             <span className="text-indigo-600 font-bold">
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
//                       className="w-full md:w-auto px-10 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center gap-2"
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

//       {/* policy doc SECTION */}
//       {/* <div className=" rounded-2xl mt-8 mb-8">
//         <PolicyStepper employeeId={employee.id} />
//       </div> */}

//       {/* ================= POLICY & LEGAL AUTHORIZATION SECTION ================= */}
// <div className="space-y-8 mt-10 mb-10">
  
//   {/* 01. POLICY GENERATION ENGINE */}
//   <div className="rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 bg-white">
//     <PolicyStepper employeeId={employee.id} />
//   </div>

//   {/* 02. LEGAL ESIGN CONSOLE - Triggers only after policies are generated */}
//   <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
//     {/* Header: Dark Command Terminal Style */}
//     <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
//           <Fingerprint size={24} />
//         </div>
//         <div>
//           <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">Legal eSign Console</h2>
//           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Authentication Node: {isEsignSigned ? 'Verified' : 'Awaiting Signature'}
//           </p>
//         </div>
//       </div>
//       <div className="hidden md:block text-right">
//         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Protocol Type</p>
//         <p className="text-[11px] font-bold text-emerald-400 uppercase">Aadhaar_Auth_v4</p>
//       </div>
//     </div>

//     <div className="p-10">
//       {isEsignSigned ? (
//         /* ================= STATE 01: SIGNED & VERIFIED ================= */
//         <div className="flex flex-col md:flex-row justify-between items-stretch gap-8">
//           <div className="flex-1 space-y-6">
//             <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] relative overflow-hidden">
//                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
//                  <ShieldCheck size={100} className="text-emerald-900" />
//                </div>
//                <div className="relative z-10">
//                   <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black mb-2">Legal Status</p>
//                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Contract Fully Executed</h3>
//                   <p className="text-sm text-slate-500 mt-2 font-medium">This document has been legally signed and timestamped via Aadhaar biometric authentication.</p>
//                </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Verification ID</p>
//                 <p className="text-sm font-bold text-slate-700">#{latestEsign.verification_id}</p>
//               </div>
//               <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Signed Timestamp</p>
//                 <p className="text-sm font-bold text-slate-700">{new Date(latestEsign.updated_at).toLocaleDateString()}</p>
//               </div>
//             </div>

//             {latestEsign.signed_doc_url && (
//               <button 
//                 onClick={() => window.open(latestEsign.signed_doc_url, "_blank")}
//                 className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl"
//               >
//                 <Download size={16} /> Download Signed Protocol
//               </button>
//             )}
//           </div>

//           <div className="w-full md:w-72 bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center shadow-inner relative group">
//             <div className="absolute inset-0 bg-emerald-400/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative w-32 h-32 rounded-full border-8 border-emerald-50 flex items-center justify-center">
//               <ShieldCheck size={50} className="text-emerald-500" />
//               <div className="absolute inset-0 border-4 border-dashed border-emerald-200 rounded-full animate-spin-slow" />
//             </div>
//             <h4 className="mt-6 text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">Verified Signature</h4>
//           </div>
//         </div>
//       ) : (
//         /* ================= STATE 02: PENDING SIGNATURE ================= */
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//           <div className="lg:col-span-7 space-y-8">
//             <div className="space-y-2">
//               <h3 className="text-xl font-black text-slate-900 tracking-tight">Digital Policy Authorization</h3>
//               <p className="text-sm text-slate-500 font-medium leading-relaxed">
//                 To complete the legal binding of generated policies, please proceed with the Aadhaar-linked eSign protocol. 
//                 This ensures document integrity and authenticates your acceptance.
//               </p>
//             </div>

//             {!documentId ? (
//               /* STEP A: SECURE UPLOAD */
//               <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
//                 <div className="relative group cursor-pointer">
//                   <input 
//                     type="file" 
//                     onChange={(e) => setEsignFile(e.target.files[0])}
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
//                   />
//                   <div className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all duration-500 ${esignFile ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200 group-hover:bg-white group-hover:border-blue-300'}`}>
//                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 ${esignFile ? 'bg-blue-600 text-white rotate-0' : 'bg-white text-slate-400 shadow-sm group-hover:scale-110'}`}>
//                       <Upload size={28} />
//                     </div>
//                     <p className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                       {esignFile ? esignFile.name : "Select Document for Staging"}
//                     </p>
//                     <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Format: PDF / Limit: 5.0 MB</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={uploadEsignDocument}
//                   disabled={uploading || !esignFile}
//                   className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
//                 >
//                   {uploading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
//                   {uploading ? "Encrypting Document Stream..." : "Stage Document for Signing"}
//                 </button>
//               </div>
//             ) : (
//               /* STEP B: IDENTITY CHALLENGE (AADHAAR) */
//               <div className="p-10 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-8 animate-in zoom-in-95 duration-500">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
//                     <Lock size={22} />
//                   </div>
//                   <div>
//                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none mb-1.5">Security Challenge</p>
//                     <h4 className="text-sm font-black text-indigo-900 uppercase">Aadhaar Identity Verification</h4>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Input Last 4 Digits of UID</label>
//                   <input 
//                     type="text" 
//                     maxLength={4}
//                     placeholder="••••"
//                     value={aadhaarLast4}
//                     onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ""))}
//                     className="w-full h-16 text-center tracking-[1em] text-3xl font-black rounded-2xl border-2 border-indigo-200 bg-white text-indigo-900 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-600/5 transition-all outline-none shadow-inner"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   <button 
//                     onClick={submitAadhaar}
//                     disabled={uploading || aadhaarLast4.length < 4}
//                     className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
//                   >
//                     {uploading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
//                     {uploading ? "Verifying Credentials..." : "Finalize & Sign Document"}
//                   </button>
//                   <p className="text-center text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
//                     This will trigger an OTP to your UID-registered mobile number
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* RIGHT SIDE: SECURITY MANIFESTO */}
//           <div className="lg:col-span-5 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col justify-between">
//             <div className="space-y-8">
//               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
//                 <ShieldAlert size={14} className="text-amber-500" /> Compliance Manifesto
//               </h4>
              
//               <div className="space-y-6">
//                 {[
//                   { t: "Legal Equivalence", d: "eSignatures carry the same legal weight as wet-ink signatures under IT Act." },
//                   { t: "Encryption Protocol", d: "Documents are stored using AES-256 military-grade encryption." },
//                   { t: "Biometric Link", d: "Identity is verified via UIDAI's secure biometric database (Aadhaar)." },
//                   { t: "Tamper Evidence", d: "Any modification post-signing invalidates the digital certificate." }
//                 ].map((item, i) => (
//                   <div key={i} className="flex gap-4">
//                     <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
//                     <div>
//                       <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mb-1">{item.t}</p>
//                       <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">{item.d}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="pt-8 mt-8 border-t border-slate-200 flex items-center gap-4">
//                <Activity size={16} className="text-slate-300 animate-pulse" />
//                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Governance Module v4.28.0</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>

      

  

//    {/* joining confirmation employee */}
// {employee?.doc_submission_status === "submitted" && (
//   <div className="mb-8">
//     <JoiningConfirmationUI employee={employee} />
//   </div>
// )}




//        {/* Assets SECTION */}

//       <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-6">
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
//                 <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.15em] mt-0.5">
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
//               {/* Experience Context Badge (Matches Step 2) */}
//               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full border border-indigo-100 mb-2">
//                 <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
//                 Modify Existing Record
//               </div>

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
//                 className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
//               >
//                 Discard Changes
//               </button>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdateExperience}
//                   className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
//                 >
//                   <Save size={18} />
//                   Update Record
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
//       {REVIEW_ALERT_CONFIG[employee?.status] && (
//         <div className="mb-8 mt-5 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[1rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
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
//                 className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 active:scale-95 group"
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
//*********************************************************working code phase 33 6/02/26****************************************************************** */
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
// import JoiningLetterWorkspace from "../../components/joining/JoiningLetterWorkspace";
// import JoiningDispatchUI from "../../components/joining/JoiningDispatchUI";
// import OfferLatter from "../../components/offer/OfferLatter";
// import AssetManager from "../../components/assets_assign/AssetManager";
// import ExperienceSection from "../../components/experiance/ExperienceSection";

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

//   const createEmptyAsset = () => ({
//     category: "laptop",
//     model: "",
//     serial: "",
//     model_number: "", // ✅ add
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

//   // Add new row
//   const addAssetRow = () => {
//     setAssetRows((prev) => [...prev, createEmptyAsset()]);
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

//   const handleSubmitAssets = async () => {
//     try {
//       const validAssets = assetRows
//         .filter((a) => a.model && a.serial)
//         .map((a) => ({
//           asset_category: a.category,
//           asset_name: a.model,
//           serial_number: a.serial,
//           model_number: a.model_number ? a.model_number : null,
//         }));

//       if (validAssets.length === 0) {
//         toast.error("Add valid asset details");
//         return;
//       }

//       await employeeKycService.addAssets(id, { assets: validAssets });

//       toast.success("Assets assigned successfully");
//       setAssetRows([]);
//       fetchAssets();
//     } catch (err) {
//       toast.error(err.message || "Failed to assign assets");
//     }
//   };

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
//       `https://apihrr.goelectronix.co.in/sesign/process-external-upload?employee_id=${id}`,
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
//   Number(offerProfile?.offered_ctc || 0) > Math.round(suggestedCTC);


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
//         {/* NEW BUTTON */}
//         <button
//           onClick={() => setIsExitModalOpen(true)}
//           className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
//         >
//           Mark Employee Exit
//         </button>
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
//             <GridItem
//               label="Department Name"
//               value={employee.department_name}
//             />
//             {/* <GridItem label="Status">
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
//             </GridItem> */}
//             <GridItem label="Status">
//   <span
//     className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
//       employee.status === "active" || employee.status === "offer_accepted"
//         ? "bg-green-100 text-green-700 border border-green-200"
//         : employee.status === "offer_rejected"
//           ? "bg-red-100 text-red-700 border border-red-200"
//           : employee.status === "created"
//             ? "bg-blue-100 text-blue-700 border border-blue-200"
//             : "bg-slate-200 text-slate-700 border border-slate-300"
//     }`}
//   >
//     {/* Added dot indicator for extra enterprise feel */}
//     <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
//       employee.status === "active" || employee.status === "offer_accepted" ? "bg-green-500" :
//       employee.status === "offer_rejected" ? "bg-red-500" :
//       employee.status === "created" ? "bg-blue-500" : "bg-slate-500"
//     }`} />
//     {employee.status.replace("_", " ")}
//   </span>
// </GridItem>
//           </div>
//         </div>
//       </div>

//       {/* Experience SECTION */}

//       <div className="space-y-8 mt-8">
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

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
//             {sortedExperiences.length > 0 ? (
//               sortedExperiences.map((exp, index) => (
//                 <div key={exp.id || index} className="relative pl-12 group">
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

//                       <div>
//                         <button
//                           onClick={() => handleEditExperience(exp)}
//                           className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 rounded-lg"
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
//                 value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {/* DOCUMENT NOT EXISTS → UPLOAD */}
//                 {currentDoc?.status === "not_exists" && (
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
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}

//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                     >
//                       Verify
//                     </button>
//                   )}

//                 {/* ✅ VIEW BUTTON */}
//                 {address?.permanent_address_status === "verified" &&
//                   permanentDoc?.document?.document_path && (
//                     <button
//                       onClick={() =>
//                         window.open(
//                           `${permanentDoc.document.document_path}`,
//                           "_blank",
//                         )
//                       }
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {permanentDoc?.status === "not_exists" && (
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

//       {/* {showAddressModal && (
//         <Modal
//           title={address ? "Update Address" : "Add Address"}
//           onClose={() => setShowAddressModal(false)}
//         >
         
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
//       )} */}

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
//                 className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
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
//             <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-20">
//               <button
//                 onClick={() => setShowAddressModal(false)}
//                 className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
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
//               </button>
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
//         {!["offer_accepted", "confirmed", "on_probation"].includes(
//           employee?.status,
//         ) ? (
//           <OfferLatter employee={employee} fetchEmployee={fetchEmployee} recommendedCtc={Math.round(suggestedCTC)} />
//         ) : (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Identity & Data */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Icon Representation of a Document */}
//               <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
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
//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
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
//               completed={aadhaarDoc?.status === "exists"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "exists"
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
//               completed={panDoc?.status === "exists"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "exists" ? "text-green-500" : "text-gray-400"
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
//               completed={bankDoc?.status === "exists"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "exists"
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
//               completed={photoDoc?.status === "exists"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "exists"
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
//               completed={offerDoc?.status === "exists"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "exists"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("previous_offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("previous_offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
//       </div>

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

//         {/*  adhaaar card */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//           <button
//             onClick={() =>
//               setOpenVerify(openVerify === "aadhaar" ? null : "aadhaar")
//             }
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
//               Verify Aadhaar Card
//             </div>
//             <span className="text-xl text-slate-400">
//               {openVerify === "aadhaar" ? "−" : "+"}
//             </span>
//           </button>

//           {openVerify === "aadhaar" && (
//             <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//               {kyc?.aadhaar_status === "verified" ? (
//                 <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//                   <div className="flex-1 space-y-5">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                         Aadhaar Status
//                       </p>
//                       <p className="text-xl font-bold text-slate-800">
//                         {kyc.aadhaar_status.toUpperCase()}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verification ID
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           #{kyc.aadhaar_verification_id}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                           Verified On
//                         </p>
//                         <p className="text-sm font-semibold text-slate-700">
//                           {new Date(
//                             kyc.aadhaar_verified_at,
//                           ).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     <div>
//                       <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                         Remarks
//                       </p>
//                       <p className="text-sm font-semibold text-slate-700">
//                         {kyc.aadhaar_remarks}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
//                     <div className="absolute w-20 h-20 bg-indigo-100 rounded-full animate-pulse" />
//                     <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//                       <svg
//                         className="h-8 w-8 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={3.5}
//                       >
//                         <path d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <h4 className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-[0.2em]">
//                       Verified
//                     </h4>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
//                   {/* Left Column: Form Inputs */}
//                   <div className="flex-1 w-full space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Decision Select */}
//                       <div className="space-y-2 group">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">
//                           Verification Decision
//                         </label>
//                         <div className="relative">
//                           <select
//                             value={aadhaarVerifyForm.aadhaar_status}
//                             onChange={(e) =>
//                               setAadhaarVerifyForm({
//                                 ...aadhaarVerifyForm,
//                                 aadhaar_status: e.target.value,
//                               })
//                             }
//                             className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer group-hover:border-slate-300"
//                           >
//                             <option value="">Choose an action...</option>
//                             <option
//                               value="verified"
//                               className="text-emerald-600 font-bold"
//                             >
//                               Approve Identity
//                             </option>
//                             <option
//                               value="rejected"
//                               className="text-rose-600 font-bold"
//                             >
//                               Reject Document
//                             </option>
//                           </select>
//                           <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="3"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M19 9l-7 7-7-7"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Remarks Area */}
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center ml-1">
//                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
//                           Internal Remarks
//                         </label>
//                         <span className="text-[10px] text-slate-400 font-medium italic">
//                           User will see this note
//                         </span>
//                       </div>
//                       <textarea
//                         rows={4}
//                         value={aadhaarVerifyForm.remarks}
//                         onChange={(e) =>
//                           setAadhaarVerifyForm({
//                             ...aadhaarVerifyForm,
//                             remarks: e.target.value,
//                           })
//                         }
//                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 group-hover:border-slate-300"
//                         placeholder="e.g. Photograph is blurred, or Name mismatch with profile..."
//                       />
//                     </div>

//                     {/* Action Bar */}
//                     <div className="flex items-center gap-4 pt-2">
//                       <button
//                         disabled={verifyingAadhaar}
//                         onClick={verifyAadhaarHandler}
//                         className="relative flex-1 md:flex-none px-8 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
//                       >
//                         {verifyingAadhaar ? (
//                           <span className="flex items-center gap-2 justify-center">
//                             <svg
//                               className="animate-spin h-4 w-4 text-white"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Processing...
//                           </span>
//                         ) : (
//                           "Finalize Verification"
//                         )}
//                       </button>
//                       <button className="px-6 h-12 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
//                         Cancel
//                       </button>
//                     </div>
//                   </div>

//                   {/* Right Column: Mini Guideline (The "Enterprise" touch) */}
//                   <div className="w-full lg:w-72 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
//                       Verification Steps
//                     </h4>
//                     <ul className="space-y-4">
//                       <li className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
//                           1
//                         </div>
//                         <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                           Cross-check Name with Profile.
//                         </p>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
//                           2
//                         </div>
//                         <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                           Ensure Document is not expired.
//                         </p>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
//                           3
//                         </div>
//                         <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                           Check for signs of digital editing.
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
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

//         {/* esign ACCORDION */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
//           <button
//             onClick={() =>
//               setOpenVerify(openVerify === "esign" ? null : "esign")
//             }
//             className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
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
//                           className="text-indigo-500"
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
//                       <h4 className="text-sm font-bold text-slate-800">
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
//           ${esignFile ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300"}
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
//                             <span className="text-indigo-600 font-bold">
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
//                       className="w-full md:w-auto px-10 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center gap-2"
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

//       {/* joining SECTION */}
//       <div>
//         {/* 1️⃣ If status is offer_accepted */}
//         {employee?.status === "offer_accepted" && (
//           <JoiningDispatchUI employee={employee} />
//         )}

//         {/* 2️⃣ If status is confirmed */}
//         {["confirmed", "on_probation"].includes(employee?.status) && (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Logistics & Reporting */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Document Branding Icon */}
//               <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
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
//                         {offerProfile?.joining_date
//                           ? new Date(
//                               offerProfile.joining_date,
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
//                         {offerProfile?.reporting_manager_name}{" "}
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
//                         {offerProfile?.joining_time || "-"}{" "}
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
//               <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
//                 <CheckCircle2 size={18} strokeWidth={2.5} />
//                 <div className="flex flex-col items-start leading-none">
//                   <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                     Onboarded
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Professional Watermark */}
//             <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-[0.4] pointer-events-none group-hover:text-blue-50 transition-colors">
//               <FileCheck size={120} />
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">
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

//       {/* {showEditModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//     <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">

//       <div className="flex justify-between mb-4">
//         <h2 className="text-lg font-bold">Edit Experience</h2>
//         <button onClick={() => setShowEditModal(false)}>✕</button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         <Input
//           label="Company Name"
//           value={editForm.company_name}
//           onChange={(v) => setEditForm({ ...editForm, company_name: v })}
//         />

//         <Input
//           label="Job Title"
//           value={editForm.job_title}
//           onChange={(v) => setEditForm({ ...editForm, job_title: v })}
//         />

//         <Input
//           label="Start Date"
//           value={editForm.start_date}
//           onChange={(v) => setEditForm({ ...editForm, start_date: v })}
//         />

//         <Input
//           label="End Date"
//           value={editForm.end_date}
//           onChange={(v) => setEditForm({ ...editForm, end_date: v })}
//         />

//         <Input
//           label="Previous CTC"
//           value={editForm.previous_ctc}
//           onChange={(v) => setEditForm({ ...editForm, previous_ctc: v })}
//         />

//         <Input
//           label="Location"
//           value={editForm.location}
//           onChange={(v) => setEditForm({ ...editForm, location: v })}
//         />

//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             rows={3}
//             value={editForm.description}
//             onChange={(e) =>
//               setEditForm({ ...editForm, description: e.target.value })
//             }
//             className="w-full border border-slate-300 rounded-lg px-3 py-2"
//           />
//         </div>

//       </div>

//       <div className="flex justify-end gap-2 mt-6">
//         <button
//           onClick={() => setShowEditModal(false)}
//           className="px-4 py-2 border rounded-lg"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleUpdateExperience}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           Update Experience
//         </button>
//       </div>

//     </div>
//   </div>
// )} */}

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
//                 <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.15em] mt-0.5">
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
//               {/* Experience Context Badge (Matches Step 2) */}
//               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full border border-indigo-100 mb-2">
//                 <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
//                 Modify Existing Record
//               </div>

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
//                 className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
//               >
//                 Discard Changes
//               </button>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdateExperience}
//                   className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
//                 >
//                   <Save size={18} />
//                   Update Record
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
//       {REVIEW_ALERT_CONFIG[employee?.status] && (
//         <div className="mb-8 mt-5 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[1rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
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
//                 className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 active:scale-95 group"
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
//**************************************************working code phase 111111 5/02/26***************************************************************** */
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
//   Download,
//   CheckCircle2,
//   FileCheck,
//   UserCheck,
//   Clock,
//   History,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import JoiningLetterWorkspace from "../../components/joining/JoiningLetterWorkspace";
// import JoiningDispatchUI from "../../components/joining/JoiningDispatchUI";
// import OfferLatter from "../../components/offer/OfferLatter";
// import AssetManager from "../../components/assets_assign/AssetManager";

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
// const [previousAssets, setPreviousAssets] = useState([]); // from API (GET)
// const [assetRows, setAssetRows] = useState([]); // draft rows

// const [esignFile, setEsignFile] = useState(null);
// const [uploading, setUploading] = useState(false);
// const [documentId, setDocumentId] = useState(null);
// const [aadhaarLast4, setAadhaarLast4] = useState("");
// const [esignVerified, setEsignVerified] = useState(false);
// const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);

// const [aadhaarVerifyForm, setAadhaarVerifyForm] = useState({
//   aadhaar_status: "",
//   remarks: "",
// });
// const [offerProfile, setOfferProfile] = useState(null);

// const [isExitModalOpen, setIsExitModalOpen] = useState(false);

// const [exitForm, setExitForm] = useState({
//   exit_date: "",
//   exit_reason: "",
// });

// // const emptyAsset = {
// //   category: "laptop",
// //   model: "",
// //   serial: "",
// // };
// const createEmptyAsset = () => ({
//   category: "laptop",
//   model: "",
//   serial: "",
//   model_number: "",   // ✅ add
// });

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//     fetchExperiences();
//      fetchAssets();
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
//   ...data.kyc_details,        // ← flatten KYC
//   esign_history: data.esign_history,
// });
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

// const latestEsign =
//   esignHistory.length > 0
//     ? esignHistory[esignHistory.length - 1]
//     : null;

// const esignStatus = latestEsign?.status; // link_generated | signed
// const isEsignSigned = esignStatus === "signed";
// const isEsignLinkGenerated = esignStatus === "link_generated";
// const isEsignDocumentUploaded = esignStatus === "document_uploaded";

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
//   return (
//     "ESIGN-" +
//     Date.now().toString(36).toUpperCase() +
//     "-" +
//     Math.random().toString(36).substring(2, 8).toUpperCase()
//   );
// };

//   const submitAadhaar = async () => {
//   if (aadhaarLast4.length !== 4) {
//     toast.error("Enter last 4 digits of Aadhaar");
//     return;
//   }

//   if (!documentId?.document_id) {
//     toast.error("Document not uploaded yet");
//     return;
//   }

//   try {
//     setUploading(true);

//     const payload = {
//       verification_id: generateVerificationId(), // unique ref
//       document_id: documentId.document_id,
//       notification_modes: ["email"],
//       auth_type: "AADHAAR",
//       expiry_in_days: "7",
//       capture_location: true,
//       signers: [
//         {
//           name: employee.full_name,
//           email: employee.email,
//           phone: employee.phone,
//           sequence: 1,
//           aadhaar_last_four_digit: aadhaarLast4,
//           sign_positions: [
//             {
//               page: 1,
//               top_left_x_coordinate: 400,
//               bottom_right_x_coordinate: 550,
//               top_left_y_coordinate: 700,
//               bottom_right_y_coordinate: 800,
//             },
//           ],
//         },
//       ],
//     };

//     const res = await fetch(
//       "https://apihrr.goelectronix.co.in/esign/create",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "eSign creation failed");
//     }

//     const data = await res.json();

//     toast.success("eSign request created successfully");
//     setEsignVerified(true);

//     await fetchKyc();

//     console.log("eSign response:", data);
//   } catch (err) {
//     toast.error(err.message);
//   } finally {
//     setUploading(false);
//   }
// };

// const verifyAadhaarHandler = async () => {
//   if (!aadhaarVerifyForm.aadhaar_status) {
//     toast.error("Please select Aadhaar status");
//     return;
//   }

//   try {
//     setVerifyingAadhaar(true);

//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/employees/verify-aadhaar/${id}`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(aadhaarVerifyForm),
//       }
//     );

//     if (!res.ok) {
//       const err = await res.text();
//       throw new Error(err);
//     }

//     const data = await res.json();

//     // 🔥 merge Aadhaar result into kyc state
//     setKyc((prev) => ({
//       ...prev,
//       aadhaar_status: data.aadhaar_status,
//       aadhaar_verified_at: new Date().toISOString(),
//       aadhaar_remarks: data.remarks,
//       aadhaar_verification_id: data.verification_id || "AADH-" + Date.now(),
//     }));

//     toast.success("Aadhaar verification updated successfully ✅");
//     await kyc()
//   } catch (err) {
//     toast.error(err.message || "Aadhaar verification failed");
//   } finally {
//     setVerifyingAadhaar(false);
//   }
// };

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

//   // Add new row
// const addAssetRow = () => {
//   setAssetRows((prev) => [...prev, createEmptyAsset()]);
// };

// // Remove row
// const removeAssetRow = (index) => {
//   const updated = assetRows.filter((_, i) => i !== index);
//   setAssetRows(updated);
// };

// // Change row field
// const handleAssetChange = (index, field, value) => {
//   setAssetRows((prev) =>
//     prev.map((row, i) =>
//       i === index ? { ...row, [field]: value } : row
//     )
//   );
// };

// // const handleSubmitAssets = async () => {
// //   try {
// //     const validAssets = assetRows
// //       .filter((a) => a.model && a.serial)
// //       .map((a) => ({
// //         asset_category: a.category,   // map category
// //         asset_name: a.model,          // model → asset_name
// //         serial_number: a.serial,      // serial → serial_number
// //       }));

// //     if (validAssets.length === 0) {
// //       toast.error("Add valid asset details");
// //       return;
// //     }

// //     await employeeKycService.addAssets(id, { assets: validAssets });

// //     toast.success("Assets assigned successfully");
// //     setAssetRows([]);
// //     fetchAssets();
// //   } catch (err) {
// //     toast.error(err.message || "Failed to assign assets");
// //   }
// // };

// const handleSubmitAssets = async () => {
//   try {
//     const validAssets = assetRows
//       .filter((a) => a.model && a.serial)
//       .map((a) => ({
//         asset_category: a.category,
//         asset_name: a.model,
//         serial_number: a.serial,
//         model_number: a.model_number ? a.model_number : null
//       }));

//     if (validAssets.length === 0) {
//       toast.error("Add valid asset details");
//       return;
//     }

//     await employeeKycService.addAssets(id, { assets: validAssets });

//     toast.success("Assets assigned successfully");
//     setAssetRows([]);
//     fetchAssets();
//   } catch (err) {
//     toast.error(err.message || "Failed to assign assets");
//   }
// };

// const handleEmployeeExit = async () => {
//   if (!exitForm.exit_date || !exitForm.exit_reason) {
//     toast.error("Please provide exit date and reason");
//     return;
//   }

//   try {
//     await toast.promise(
//       fetch(`https://apihrr.goelectronix.co.in/employees/${id}/exit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(exitForm),
//       }),
//       {
//         loading: "Marking employee exit...",
//         success: "Employee marked as exited ✅",
//         error: "Failed to update employee exit ❌",
//       }
//     );

//     setIsExitModalOpen(false);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const fetchAssets = async () => {
//   try {
//     const res = await employeeKycService.getAssets(id);
//     console.log("inside funbtion",res)
//     setPreviousAssets(res || []);
//   } catch (err) {
//     console.error("Failed to fetch assets", err);
//   }
// };

// console.log("Add assets code", previousAssets)

// // const uploadEsignDocument = async () => {
// //   if (!esignFile) return alert("Please upload a document");

// //   try {
// //     setUploading(true);

// //     const formData = new FormData();
// //     formData.append("file", esignFile);

// //     const uploadRes = await fetch(
// //       "https://spillas.com/dotnet-api/Cashfree/upload-esign-document",
// //       {
// //         method: "POST",
// //         headers: {
// //           AppId: "170J3KZTCJLZBKXGQ6PAVERHYX1JLD",
// //           SecretKey: "TESTVPKA8XNE6R045U9JCT4KKADDF88T8UAT",
// //         },
// //         body: formData,
// //       }
// //     );

// //     const uploadData = await uploadRes.json();

// //     if (uploadData.status !== "SUCCESS") {
// //       throw new Error("Upload failed");
// //     }

// //     setDocumentId(uploadData);

// //     // 🔥 AUTO CALL SECOND API
// //     await processExternalUpload(uploadData);

// //   } catch (err) {
// //     alert(err.message);
// //   } finally {
// //     setUploading(false);
// //   }
// // };

// const uploadEsignDocument = async () => {
//   if (!esignFile) {
//     toast.error("Please upload a document");
//     return;
//   }

//   try {
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("document", esignFile);
//     for (const pair of formData.entries()) {
//   console.log(pair[0], pair[1]);
// }

//     const uploadRes = await fetch(
//       "https://spillas.com/dotnet-api/Cashfree/upload-esign-document",
//       {
//         method: "POST",
//         headers: {
//           AppId: "170J3KZTCJLZBKXGQ6PAVERHYX1JLD",
//           SecretKey: "TESTVPKA8XNE6R045U9JCT4KKADDF88T8UAT",
//         },
//         body: formData,
//       }
//     );

//     const uploadData = await uploadRes.json();

//     if (uploadData.status !== "SUCCESS") {
//       throw new Error("Upload failed");
//     }

//     const docId = uploadData; // ✅ extract number

//     setDocumentId(docId);

//     // 🔥 AUTO CALL SECOND API
//     await processExternalUpload(docId);

//     toast.success("Document uploaded successfully");
//   } catch (err) {
//     toast.error(err.message);
//   } finally {
//     setUploading(false);
//   }
// };

// // const processExternalUpload = async (docId) => {
// //   const res = await fetch(
// //     `http://72.62.242.223:8000/esign/process-external-upload?employee_id=${id}`,
// //     {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ document_id: docId }),
// //     }
// //   );

// //   if (!res.ok) {
// //     throw new Error("eSign process failed");
// //   }
// // };

// // const processExternalUpload = async (docId) => {
// //   const res = await fetch(
// //     `http://72.62.242.223:8000/esign/process-external-upload?employee_id=${id}`,
// //     {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         document: docId, // ✅ THIS IS THE KEY FIX
// //       }),
// //     }
// //   );

// //   if (!res.ok) {
// //     const err = await res.json();
// //     console.error(err);
// //     throw new Error("eSign process failed");
// //   }
// // };

// const processExternalUpload = async (docResponse) => {
//   const res = await fetch(
//     `https://apihrr.goelectronix.co.in/sesign/process-external-upload?employee_id=${id}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         status: docResponse.status,
//         document_id: docResponse.document_id,
//       }),
//     }
//   );

//   if (!res.ok) {
//     const err = await res.json();
//     console.error(err);
//     throw new Error("eSign process failed");
//   }

//   return await res.json();
// };

// // const handleGetFullEmployee = async (id) => {
// //   try {
// //     setLoading(true);
// //     setError(null);

// //     const data = await employeeKycService.getFull(id);

// //     // 🔥 Map API response safely
// //        setExperience(data || []);

// //   } catch (err) {
// //     console.error("Failed to load employee data:", err);
// //     setError(err.message || "Something went wrong");
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// const handleGetFullEmployee = async (id) => {
//   try {
//     setLoading(true);
//     setError(null);

//     const data = await employeeKycService.getFull(id);

//     setOfferProfile(data); // ✅ instead of setExperience
//   } catch (err) {
//     setError(err.message || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

// const REVIEW_ALERT_CONFIG = {
//   probation_review: {
//     title: "Probation Period Concluding",
//     message: "This employee's probation phase ends in",
//     days: 7,
//     badge: "Priority",
//   },
//   probation_extended: {
//     title: "Probation Extended",
//     message: "Extended probation review required within",
//     days: 15,
//     badge: "Attention",
//   },
//   confirmed: {
//     title: "Post-Confirmation Review",
//     message: "Initial performance review scheduled in",
//     days: 30,
//     badge: "Review",
//   },
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
//           {/* NEW BUTTON */}
//   <button
//     onClick={() => setIsExitModalOpen(true)}
//     className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
//   >
//     Mark Employee Exit
//   </button>
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
//                 value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {/* DOCUMENT NOT EXISTS → UPLOAD */}
//                 {currentDoc?.status === "not_exists" && (
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
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}

//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                     >
//                       Verify
//                     </button>
//                   )}

//                 {/* ✅ VIEW BUTTON */}
//                 {address?.permanent_address_status === "verified" &&
//                   permanentDoc?.document?.document_path && (
//                     <button
//                       onClick={() =>
//                         window.open(
//                           `${permanentDoc.document.document_path}`,
//                           "_blank",
//                         )
//                       }
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {permanentDoc?.status === "not_exists" && (
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

//  {/* offer SECTION */}
//       <div>
//         {!["offer_accepted", "confirmed", "on_probation"].includes(
//           employee?.status,
//         ) ? (
//           <OfferLatter employee={employee} fetchEmployee={fetchEmployee} />
//         ) : (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Identity & Data */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Icon Representation of a Document */}
//               <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
//                 <FileText size={24} strokeWidth={1.5} />
//               </div>

//               <div className="ml-4 flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
//                     {offerProfile?.full_name || "-"}
//                   </h3>
//                   <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                   {/* <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
//                     NexusFlow Corp
//                   </span> */}
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
//               {/* <button
//                 onClick={() => {

//                 }}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all text-[11px] font-bold uppercase tracking-tight"
//               >
//                 <Download size={14} className="text-slate-400" />
//                 Offer Letter.pdf
//               </button> */}

//               <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>

//               {/* Attractive Success Indicator */}
//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
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

//         {/* DOCUMENTS / KYC SECTION */}
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
//               completed={aadhaarDoc?.status === "exists"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "exists"
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
//               completed={panDoc?.status === "exists"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "exists" ? "text-green-500" : "text-gray-400"
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
//               completed={bankDoc?.status === "exists"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "exists"
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
//               completed={photoDoc?.status === "exists"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "exists"
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
//               completed={offerDoc?.status === "exists"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "exists"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("previous_offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("previous_offer_letter");
//                 setShowViewModal(true);
//               }}
//             />
//           </div>
//         )}
//       </div>

//        {/* VERIFY SECTION */}
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

//         {/*  adhaaar card */}

//         <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
//   <button
//     onClick={() =>
//       setOpenVerify(openVerify === "aadhaar" ? null : "aadhaar")
//     }
//     className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
//   >
//     <div className="flex items-center gap-3">
//       <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
//       Verify Aadhaar Card
//     </div>
//     <span className="text-xl text-slate-400">
//       {openVerify === "aadhaar" ? "−" : "+"}
//     </span>
//   </button>

//   {openVerify === "aadhaar" && (
//     <div className="p-6 border-t border-slate-100 bg-slate-50/30">
//       {kyc?.aadhaar_status === "verified" ? (

//         <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
//           <div className="flex-1 space-y-5">
//             <div>
//               <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">
//                 Aadhaar Status
//               </p>
//               <p className="text-xl font-bold text-slate-800">
//                 {kyc.aadhaar_status.toUpperCase()}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//               <div>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                   Verification ID
//                 </p>
//                 <p className="text-sm font-semibold text-slate-700">
//                   #{kyc.aadhaar_verification_id}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                   Verified On
//                 </p>
//                 <p className="text-sm font-semibold text-slate-700">
//                   {new Date(kyc.aadhaar_verified_at).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <div>
//               <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                 Remarks
//               </p>
//               <p className="text-sm font-semibold text-slate-700">
//                 {kyc.aadhaar_remarks}
//               </p>
//             </div>
//           </div>

//           <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
//             <div className="absolute w-20 h-20 bg-indigo-100 rounded-full animate-pulse" />
//             <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//               <svg
//                 className="h-8 w-8 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={3.5}
//               >
//                 <path d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h4 className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-[0.2em]">
//               Verified
//             </h4>
//           </div>
//         </div>
//       ) : (

//         // <div className="space-y-4 max-w-md">

//         //   <div>
//         //     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//         //       Aadhaar Status
//         //     </label>
//         //     <select
//         //       value={aadhaarVerifyForm.aadhaar_status}
//         //       onChange={(e) =>
//         //         setAadhaarVerifyForm({
//         //           ...aadhaarVerifyForm,
//         //           aadhaar_status: e.target.value,
//         //         })
//         //       }
//         //       className="w-full mt-1 px-4 py-2 border rounded-lg text-sm"
//         //     >
//         //       <option value="">Select Status</option>
//         //       <option value="verified">Verified</option>
//         //       <option value="rejected">Rejected</option>
//         //     </select>
//         //   </div>

//         //   <div>
//         //     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//         //       Remarks
//         //     </label>
//         //     <textarea
//         //       rows={3}
//         //       value={aadhaarVerifyForm.remarks}
//         //       onChange={(e) =>
//         //         setAadhaarVerifyForm({
//         //           ...aadhaarVerifyForm,
//         //           remarks: e.target.value,
//         //         })
//         //       }
//         //       className="w-full mt-1 px-4 py-2 border rounded-lg text-sm resize-none"
//         //       placeholder="Enter verification remarks"
//         //     />
//         //   </div>

//         //   <button
//         //     disabled={verifyingAadhaar}
//         //     onClick={verifyAadhaarHandler}
//         //     className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
//         //   >
//         //     {verifyingAadhaar ? "Verifying..." : "Submit Aadhaar Verification"}
//         //   </button>
//         // </div>
//         <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
//   {/* Left Column: Form Inputs */}
//   <div className="flex-1 w-full space-y-6">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Decision Select */}
//       <div className="space-y-2 group">
//         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">
//           Verification Decision
//         </label>
//         <div className="relative">
//           <select
//             value={aadhaarVerifyForm.aadhaar_status}
//             onChange={(e) =>
//               setAadhaarVerifyForm({ ...aadhaarVerifyForm, aadhaar_status: e.target.value })
//             }
//             className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer group-hover:border-slate-300"
//           >
//             <option value="">Choose an action...</option>
//             <option value="verified" className="text-emerald-600 font-bold">Approve Identity</option>
//             <option value="rejected" className="text-rose-600 font-bold">Reject Document</option>
//           </select>
//           <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Remarks Area */}
//     <div className="space-y-2">
//       <div className="flex justify-between items-center ml-1">
//         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
//           Internal Remarks
//         </label>
//         <span className="text-[10px] text-slate-400 font-medium italic">User will see this note</span>
//       </div>
//       <textarea
//         rows={4}
//         value={aadhaarVerifyForm.remarks}
//         onChange={(e) =>
//           setAadhaarVerifyForm({ ...aadhaarVerifyForm, remarks: e.target.value })
//         }
//         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300 group-hover:border-slate-300"
//         placeholder="e.g. Photograph is blurred, or Name mismatch with profile..."
//       />
//     </div>

//     {/* Action Bar */}
//     <div className="flex items-center gap-4 pt-2">
//       <button
//         disabled={verifyingAadhaar}
//         onClick={verifyAadhaarHandler}
//         className="relative flex-1 md:flex-none px-8 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
//       >
//         {verifyingAadhaar ? (
//           <span className="flex items-center gap-2 justify-center">
//             <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//             Processing...
//           </span>
//         ) : (
//           "Finalize Verification"
//         )}
//       </button>
//       <button className="px-6 h-12 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
//         Cancel
//       </button>
//     </div>
//   </div>

//   {/* Right Column: Mini Guideline (The "Enterprise" touch) */}
//   <div className="w-full lg:w-72 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Steps</h4>
//     <ul className="space-y-4">
//       <li className="flex items-start gap-3">
//         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
//         <p className="text-xs text-slate-600 font-medium leading-relaxed">Cross-check Name with Profile.</p>
//       </li>
//       <li className="flex items-start gap-3">
//         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
//         <p className="text-xs text-slate-600 font-medium leading-relaxed">Ensure Document is not expired.</p>
//       </li>
//       <li className="flex items-start gap-3">
//         <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
//         <p className="text-xs text-slate-600 font-medium leading-relaxed">Check for signs of digital editing.</p>
//       </li>
//     </ul>
//   </div>
// </div>
//       )}
//     </div>
//   )}
// </div>

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
//   {/* esign ACCORDION */}

//         {/* <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
//   <button
//     onClick={() => setOpenVerify(openVerify === "esign" ? null : "esign")}
//     className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50"
//   >
//     <div className="flex items-center gap-3">
//       <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//       eSign Verification
//     </div>
//     <span>{openVerify === "esign" ? "−" : "+"}</span>
//   </button>

//   {openVerify === "esign" && (
//     <div className="p-6 bg-slate-50/40 border-t">

//       {esignVerified ? (
//         <div className="text-center py-10">
//           <div className="text-emerald-600 font-black tracking-widest">
//             ESIGN VERIFIED
//           </div>
//         </div>
//       ) : !documentId ? (

//         <>
//           <input
//             type="file"
//             onChange={(e) => setEsignFile(e.target.files[0])}
//             className="mb-4"
//           />

//           <button
//             onClick={uploadEsignDocument}
//             disabled={uploading}
//             className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50"
//           >
//             {uploading ? "Uploading..." : "Upload & Verify"}
//           </button>
//         </>
//       ) : (

//         <>
//           <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">
//             Aadhaar Last 4 Digits
//           </label>

//           <input
//             maxLength={4}
//             value={aadhaarLast4}
//             onChange={(e) =>
//               setAadhaarLast4(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-40 text-center tracking-[0.5em] text-xl font-bold rounded-xl border px-4 py-2"
//           />

//           <button
//             onClick={submitAadhaar}
//             className="ml-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
//           >
//             Submit
//           </button>
//         </>
//       )}
//     </div>
//   )}
// </div> */}

// <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
//   <button
//     onClick={() => setOpenVerify(openVerify === "esign" ? null : "esign")}
//     className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50"
//   >
//     <div className="flex items-center gap-3">
//       <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
//       eSign Verification
//     </div>
//     <span>{openVerify === "esign" ? "−" : "+"}</span>
//   </button>

//   {openVerify === "esign" && (
//     <div className="p-6 bg-slate-50/40 border-t">

//       {console.log("ssssss", isEsignSigned)}

//       {/* ================= VERIFIED VIEW ================= */}
//       {isEsignSigned && (
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//           {/* Left Info */}
//           <div className="space-y-4">
//             <div>
//               <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
//                 eSign Status
//               </p>
//               <p className="text-xl font-black text-emerald-600">
//                 SIGNED
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
//               <div>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                   Verification ID
//                 </p>
//                 <p className="text-sm font-semibold text-slate-700">
//                   #{latestEsign.verification_id}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
//                   Last Updated
//                 </p>
//                 <p className="text-sm font-semibold text-slate-700">
//                   {new Date(latestEsign.updated_at).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             {latestEsign.signed_doc_url && (
//               <button
//                 onClick={() => window.open(latestEsign.signed_doc_url, "_blank")}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
//               >
//                 <Download size={14} /> Download Signed Document
//               </button>
//             )}
//           </div>

//           {/* Premium Badge */}
//           <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl">
//             <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />
//             <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
//               <CheckCircle2 size={32} className="text-white" />
//             </div>
//             <h4 className="mt-4 text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
//               Verified
//             </h4>
//           </div>
//         </div>
//       )}

//       {/* ================= LINK GENERATED ================= */}
//       {!isEsignSigned && isEsignLinkGenerated && (
//         <div className="flex flex-col items-center justify-center text-center py-10">
//           <Clock size={40} className="text-amber-500 mb-3" />
//           <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">
//             Awaiting Signature
//           </h3>
//           <p className="text-xs text-slate-500 mt-2 max-w-sm">
//             The eSign link has been generated and sent to the employee.
//             Waiting for Aadhaar-based signature completion.
//           </p>
//         </div>
//       )}

//       {!isEsignSigned && isEsignDocumentUploaded && (
//   <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
//     <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

//       {/* Visual Status Indicator */}
//       <div className="relative flex-shrink-0">
//         <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
//           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
//             <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15l2 2 4-4"/>
//           </svg>
//         </div>
//         <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center shadow-sm">
//           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white animate-spin-slow">
//             <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
//           </svg>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="flex-1 text-center md:text-left space-y-4">
//         <div>
//           <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
//             <h3 className="text-lg font-bold text-slate-900">Final Step: Complete eSign</h3>
//             <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">
//               Pending Action
//             </span>
//           </div>
//           <p className="text-sm text-slate-500 leading-relaxed max-w-md">
//             Your document has been securely processed and is ready for signature.
//             Please complete the Aadhaar-based eSign to finalize the agreement.
//           </p>
//         </div>

//         {/* Informational Micro-card */}
//         <div className="inline-flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
//           <div className="flex items-center gap-3 pr-4 md:border-r border-slate-100">
//             <div className="w-2 h-2 rounded-full bg-emerald-500" />
//             <span className="text-[12px] font-semibold text-slate-600">Document Uploaded</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
//             </svg>
//             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Verified Secure Vault</span>
//           </div>
//         </div>
//       </div>

//       {/* Primary Action */}
//       {/* <div className="flex-shrink-0 w-full md:w-auto">
//         <button
//           // onClick={handleStartEsign} // Assume this is your trigger function
//           onClick={submitAadhaar}
//           className="w-full px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
//         >
//           Sign with Aadhaar
//           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
//         </button>
//       </div> */}
//     </div>
//   </div>
// )}

//       {/* ================= UPLOAD FLOW ================= */}
//       {/* {!latestEsign && !documentId && (
//         <>
//           <input
//             type="file"
//             onChange={(e) => setEsignFile(e.target.files[0])}
//             className="mb-4"
//           />

//           <button
//             onClick={uploadEsignDocument}
//             disabled={uploading}
//             className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50"
//           >
//             {uploading ? "Uploading..." : "Upload & Verify"}
//           </button>
//         </>
//       )} */}

//       {/* ================= AADHAAR INPUT ================= */}
//       {/* {!isEsignSigned && documentId && !isEsignLinkGenerated && (
//         <>
//           <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">
//             Aadhaar Last 4 Digits
//           </label>

//           <input
//             maxLength={4}
//             value={aadhaarLast4}
//             onChange={(e) =>
//               setAadhaarLast4(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-40 text-center tracking-[0.5em] text-xl font-bold rounded-xl border px-4 py-2"
//           />

//           <button
//             onClick={submitAadhaar}
//             className="ml-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
//           >
//             Submit
//           </button>
//         </>
//       )} */}

//       <div className="max-w-xl">
//   {!latestEsign && !documentId && (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
//       {/* SECTION HEADER */}
//       <div className="space-y-1">
//         <h4 className="text-sm font-bold text-slate-800">Upload E-Sign Document</h4>
//         <p className="text-xs text-slate-500">Supported formats: PDF (Max 5MB)</p>
//       </div>

//       {/* DROPZONE AREA */}
//       <div className="relative group">
//         <input
//           type="file"
//           id="esign-upload"
//           onChange={(e) => setEsignFile(e.target.files[0])}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//         />
//         <div className={`
//           border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center text-center
//           ${esignFile ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300'}
//         `}>
//           <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${esignFile ? 'bg-indigo-600 scale-110' : 'bg-white shadow-sm'}`}>
//             {esignFile ? (
//               <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
//             ) : (
//               <svg className="w-7 h-7 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/></svg>
//             )}
//           </div>

//           {esignFile ? (
//             <div className="space-y-1">
//               <p className="text-sm font-bold text-slate-800">{esignFile.name}</p>
//               <p className="text-[11px] font-medium text-slate-500">{(esignFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to verify</p>
//             </div>
//           ) : (
//             <p className="text-sm font-medium text-slate-600">
//               <span className="text-indigo-600 font-bold">Click to upload</span> or drag and drop
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ACTIONS */}
//       <button
//         onClick={uploadEsignDocument}
//         disabled={uploading || !esignFile}
//         className="w-full md:w-auto px-10 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center gap-2"
//       >
//         {uploading ? (
//           <>
//             <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
//             Processing...
//           </>
//         ) : "Upload & Continue"}
//       </button>
//     </div>
//   )}

//   {/* ================= AADHAAR INPUT SECTION ================= */}
//   {!isEsignSigned && documentId && !isEsignLinkGenerated &&
//   esignStatus !== "document_uploaded" && (
//     <div className="mt-8 space-y-5 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
//           <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
//         </div>
//         <h4 className="text-sm font-bold text-slate-800">Confirm Identity</h4>
//       </div>

//       <div className="space-y-2">
//         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
//           Aadhaar Last 4 Digits
//         </label>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <input
//             type="text"
//             maxLength={4}
//             placeholder="••••"
//             value={aadhaarLast4}
//             onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ""))}
//             className="w-full sm:w-44 h-12 text-center tracking-[0.5em] text-xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
//           />
//           <button
//             onClick={submitAadhaar}
//             disabled={aadhaarLast4.length < 4}
//             className="flex-1 sm:flex-none px-8 h-12 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 shadow-lg shadow-emerald-100 disabled:shadow-none"
//           >
//             Submit Details
//           </button>
//         </div>
//         <p className="text-[10px] text-slate-500 flex items-center gap-1.5 ml-1">
//           <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
//           Secure end-to-end encrypted verification
//         </p>
//       </div>
//     </div>
//   )}
// </div>
//     </div>
//   )}
// </div>

//       </div>

//  {/* joining SECTION */}
//       <div>
//         {/* 1️⃣ If status is offer_accepted */}
//         {employee?.status === "offer_accepted" && (
//           <JoiningDispatchUI employee={employee} />
//         )}

//         {/* 2️⃣ If status is confirmed */}
//         {["confirmed", "on_probation"].includes(employee?.status) && (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Logistics & Reporting */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Document Branding Icon */}
//               <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
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
//                        {offerProfile?.joining_date
//   ? new Date(offerProfile.joining_date).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     })
//   : "-"}

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
//                         {offerProfile?.reporting_manager_name}{" "}
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
//                         {offerProfile?.joining_time || "-" }{" "}
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
//               {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-tight shadow-sm active:scale-[0.98]">
//                 <Download size={14} className="text-blue-500" />
//                 Joining Letter
//               </button> */}

//               <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>

//               {/* Final Status Indicator */}
//               <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
//                 <CheckCircle2 size={18} strokeWidth={2.5} />
//                 <div className="flex flex-col items-start leading-none">
//                   <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                     Onboarded
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Professional Watermark */}
//             <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-[0.4] pointer-events-none group-hover:text-blue-50 transition-colors">
//               <FileCheck size={120} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* <div>
//         <AssetManager previousAssets={previousAssets}
//       assetRows={assetRows}
//       onAdd={addAssetRow}
//       onRemove={removeAssetRow}
//       onChange={handleAssetChange} />
//       </div> */}
//  <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">

//   <AssetManager
//     previousAssets={previousAssets}
//     assetRows={assetRows}
//     onAdd={addAssetRow}
//     onRemove={removeAssetRow}
//     onChange={handleAssetChange}
//     onApiSubmit={handleSubmitAssets}
//   />
// </div>

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

//       {/* {isExitModalOpen && (
//   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">

//     <div
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//       onClick={() => setIsExitModalOpen(false)}
//     />

//     <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

//       <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
//         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//           Employee Exit
//         </h3>
//         <button
//           onClick={() => setIsExitModalOpen(false)}
//           className="p-2 hover:bg-slate-100 rounded-lg"
//         >
//           ✕
//         </button>
//       </div>

//       <div className="p-6 space-y-5">

//         <div className="space-y-2">
//           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//             Exit Date
//           </label>
//           <input
//             type="date"
//             value={exitForm.exit_date}
//             onChange={(e) =>
//               setExitForm({ ...exitForm, exit_date: e.target.value })
//             }
//             className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//             Exit Reason
//           </label>
//           <textarea
//             rows={3}
//             placeholder="Reason for exit..."
//             value={exitForm.exit_reason}
//             onChange={(e) =>
//               setExitForm({ ...exitForm, exit_reason: e.target.value })
//             }
//             className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none"
//           />
//         </div>
//       </div>

//       <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
//         <button
//           onClick={() => setIsExitModalOpen(false)}
//           className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleEmployeeExit}
//           className="px-5 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100"
//         >
//           Confirm Exit
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}

// {isExitModalOpen && (
//   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//     {/* Backdrop: Professional blur with slightly lighter overlay */}
//     <div
//       className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
//       onClick={() => setIsExitModalOpen(false)}
//     />

//     <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">

//       {/* Top Warning Accent Line */}
//       <div className="h-1.5 w-full bg-rose-500" />

//       {/* Header: More balanced and communicative */}
//       <div className="px-8 pt-8 pb-4 flex justify-between items-start">
//         <div className="flex gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold text-slate-900 tracking-tight">Initiate Offboarding</h3>
//             <p className="text-sm text-slate-500 font-medium leading-relaxed">Please provide the details to process this employee's exit from the system.</p>
//           </div>
//         </div>
//         <button
//           onClick={() => setIsExitModalOpen(false)}
//           className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
//         >
//           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
//         </button>
//       </div>

//       {/* Body: High-clarity inputs with consistent spacing */}
//       <div className="px-8 py-6 space-y-7">

//         {/* Warning Notice: Common in Enterprise Software */}
//         {/* <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3">
//           <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
//           <p className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider leading-normal">
//             Heads up: Access to all company resources will be revoked automatically on the selected exit date.
//           </p>
//         </div> */}

//         {/* Exit Date */}
//         <div className="space-y-2.5">
//           <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
//             Effective Exit Date
//           </label>
//           <input
//             type="date"
//             value={exitForm.exit_date}
//             onChange={(e) =>
//               setExitForm({ ...exitForm, exit_date: e.target.value })
//             }
//             className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
//           />
//         </div>

//         {/* Exit Reason */}
//         <div className="space-y-2.5">
//           <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
//             Reason for Separation
//           </label>
//           <textarea
//             rows={4}
//             placeholder="Document the primary reasons for exit (e.g., Better opportunity, Relocation, etc.)"
//             value={exitForm.exit_reason}
//             onChange={(e) =>
//               setExitForm({ ...exitForm, exit_reason: e.target.value })
//             }
//             className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none resize-none placeholder:text-slate-400 placeholder:font-normal"
//           />
//         </div>
//       </div>

//       {/* Footer: Prominent and grouped actions */}
//       <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
//         <button
//           onClick={() => setIsExitModalOpen(false)}
//           className="px-6 py-3 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all"
//         >
//           Discard Changes
//         </button>

//         <button
//           onClick={handleEmployeeExit}
//           className="px-8 py-3 bg-rose-600 text-white rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-rose-700 shadow-xl shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//         >
//           Confirm Offboarding
//           <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
//       {
//       // employee?.status === "on_probation"
//       REVIEW_ALERT_CONFIG[employee?.status]
//       && (
//         <div className="mb-8 mt-5 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[1rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
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
//                 {/* <span className="text-xs font-bold text-slate-700">
//                   Jan 31, 2026
//                 </span> */}
//               </div>

//               <button
//                 // onClick={() => navigate("/dummyemp/3/review")}
//                    onClick={() => navigate(`/dummyemp/${id}/review`)}
//                 className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 active:scale-95 group"
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
//***********************************************working code phase 2********************************************************** */
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
//   Download,
//   CheckCircle2,
//   FileCheck,
//   UserCheck,
//   Clock,
//    History
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

//   const getAddressProofDoc = (type) => {
//     return documents?.find((d) => d.document_type === type);
//   };

//   console.log("docuemtn" , documents)

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
//     return `http://72.62.242.223:8000/${doc.document_path}`;
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

//   console.log("adddharr4444" , aadhaarDoc)
//   const panDoc = getDocument("pan");
//   const bankDoc = getDocument("bank");
//   const photoDoc = getDocument("photo");
//   const offerDoc = getDocument("previous_offer_letter");

//   const currentDoc = getAddressProofDoc("address_proof_current");
//   const permanentDoc = getAddressProofDoc("address_proof_permanent");

//   //   console.log("working code", address?.address);

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
//                 value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
//               />

//               {/* <div className="flex items-start gap-2">
//                 {address?.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address?.current_address_status ? (
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
//               </div> */}

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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
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
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {/* DOCUMENT NOT EXISTS → UPLOAD */}
//                 {currentDoc?.status === "not_exists" && (
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
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}

//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
//               />

//               {/* <div className="flex items-start gap-2">
//                 {address?.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address?.permanent_address_status ? (
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
//               </div> */}

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
//                       className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//                     >
//                       Verify
//                     </button>
//                   )}

//                 {/* ✅ VIEW BUTTON */}
//                 {address?.permanent_address_status === "verified" &&
//                   permanentDoc?.document?.document_path && (
//                     <button
//                       onClick={() =>
//                         window.open(
//                           `${permanentDoc.document.document_path}`,
//                           "_blank",
//                         )
//                       }
//                       className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//                     >
//                       View
//                     </button>
//                   )}

//                 {permanentDoc?.status === "not_exists" && (
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

//       <div>
//         {!["offer_accepted", "confirmed" , "on_probation"].includes(employee?.status) ? (
//           <OfferLatter employee={employee} fetchEmployee={fetchEmployee} />
//         ) : (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             {/* Left Section: Identity & Data */}
//             <div className="flex items-center w-full lg:w-auto">
//               {/* Icon Representation of a Document */}
//               <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
//                 <FileText size={24} strokeWidth={1.5} />
//               </div>

//               <div className="ml-4 flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
//                     Johnathan Doe
//                   </h3>
//                   <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                   <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
//                     NexusFlow Corp
//                   </span>
//                 </div>

//                 {/* Designation & Package Row */}
//                 <div className="flex items-center gap-6 mt-1">
//                   <div className="flex flex-col">
//                     <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                       Designation
//                     </span>
//                     <span className="text-[12px] text-slate-600 font-medium">
//                       Senior Product Lead
//                     </span>
//                   </div>

//                   <div className="h-6 w-[1px] bg-slate-100"></div>

//                   <div className="flex flex-col">
//                     <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                       Offer Amount
//                     </span>
//                     <span className="text-[12px] text-slate-900 font-mono font-bold">
//                       $145,000
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
//               <button
//                 onClick={() => {
//                   /* Add download logic here */
//                 }}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all text-[11px] font-bold uppercase tracking-tight"
//               >
//                 <Download size={14} className="text-slate-400" />
//                 Offer Letter.pdf
//               </button>

//               <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>

//               {/* Attractive Success Indicator */}
//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
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

//       {/* <div>
//         <JoiningDispatchUI employee={employee} />
//       </div> */}

//       {/* {employee?.status === "offer_accepted" && (
//         <div>
//           <JoiningDispatchUI employee={employee} />
//         </div>
//       )} */}

//       {/* <div>
//         {["offer_accepted"].includes(employee?.status) ? (
//           <JoiningDispatchUI employee={employee} />
//         ) : (
//           <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">
//             <div className="flex items-center w-full lg:w-auto">

//               <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
//                 <FileText size={24} strokeWidth={1.5} />
//               </div>

//               <div className="ml-4 flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
//                     Johnathan Doe
//                   </h3>
//                   <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                   <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
//                     NexusFlow Corp
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-6 mt-1">
//                   <div className="flex flex-col">
//                     <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                       Designation
//                     </span>
//                     <span className="text-[12px] text-slate-600 font-medium">
//                       Senior Product Lead
//                     </span>
//                   </div>

//                   <div className="h-6 w-[1px] bg-slate-100"></div>

//                   <div className="flex flex-col">
//                     <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
//                       Offer Amount
//                     </span>
//                     <span className="text-[12px] text-slate-900 font-mono font-bold">
//                       $145,000
//                       <span className="text-[10px] text-slate-400 ml-0.5">
//                         /annum
//                       </span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-5 lg:mt-0 w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-end gap-4">

//               <button
//                 onClick={() => {

//                 }}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all text-[11px] font-bold uppercase tracking-tight"
//               >
//                 <Download size={14} className="text-slate-400" />
//                 Offer Letter.pdf
//               </button>

//               <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>

//               <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
//                 <CheckCircle2 size={16} strokeWidth={3} />
//                 <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//                   Completed
//                 </span>
//               </div>
//             </div>

//             <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
//               <CheckCircle2 size={80} />
//             </div>
//           </div>
//         )}
//       </div> */}

//       <div>
//   {/* 1️⃣ If status is offer_accepted */}
//   {employee?.status === "offer_accepted" && (
//     <JoiningDispatchUI employee={employee} />
//   )}

//   {/* 2️⃣ If status is confirmed */}
//   {/* {employee?.status === "confirmed" && (
//    <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">

//       <div className="flex items-center w-full lg:w-auto">

//         <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
//           <FileCheck size={28} strokeWidth={1.5} />
//         </div>

//         <div className="ml-5 flex flex-col gap-2">
//           <div className="flex items-center gap-2">
//             <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
//               Joining Formalities
//             </h3>
//             <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 uppercase tracking-wider">
//               Confirmed
//             </span>
//           </div>

//           <div className="flex flex-wrap items-center gap-y-2 gap-x-8">

//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-slate-50 rounded-md">
//                 <Calendar size={14} className="text-slate-400" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Joining Date</span>
//                 <span className="text-[12px] text-slate-700 font-semibold">Jan 26, 2026</span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-slate-50 rounded-md">
//                 <UserCheck size={14} className="text-slate-400" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Reporting To</span>
//                 <span className="text-[12px] text-slate-700 font-semibold">Sarah Jenkins <span className="text-slate-400 font-normal text-[11px]">(VP Ops)</span></span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-slate-50 rounded-md">
//                 <Clock size={14} className="text-slate-400" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Reporting Time</span>
//                 <span className="text-[12px] text-slate-700 font-semibold">09:30 AM <span className="text-slate-400 font-normal text-[11px]">(IST)</span></span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 lg:mt-0 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">

//         <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-tight shadow-sm active:scale-[0.98]">
//           <Download size={14} className="text-blue-500" />
//           Joining Letter
//         </button>

//         <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>

//         <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
//           <CheckCircle2 size={18} strokeWidth={2.5} />
//           <div className="flex flex-col items-start leading-none">
//             <span className="text-[10px] font-black uppercase tracking-[1.5px]">Onboarded</span>
//           </div>
//         </div>
//       </div>

//       <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-[0.4] pointer-events-none group-hover:text-blue-50 transition-colors">
//         <FileCheck size={120} />
//       </div>
//     </div>
//   )} */}
//   {["confirmed", "on_probation"].includes(employee?.status) && (
//    <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">

//       {/* Left Section: Logistics & Reporting */}
//       <div className="flex items-center w-full lg:w-auto">
//         {/* Document Branding Icon */}
//         <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
//           <FileCheck size={28} strokeWidth={1.5} />
//         </div>

//         <div className="ml-5 flex flex-col gap-2">
//           <div className="flex items-center gap-2">
//             <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
//               Joining Formalities
//             </h3>
//             <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 uppercase tracking-wider">
//               Confirmed
//             </span>
//           </div>

//           {/* Logistics Grid */}
//           <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
//             {/* Joining Date */}
//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-slate-50 rounded-md">
//                 <Calendar size={14} className="text-slate-400" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Joining Date</span>
//                 <span className="text-[12px] text-slate-700 font-semibold">Jan 26, 2026</span>
//               </div>
//             </div>

//             {/* Reporting To */}
//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-slate-50 rounded-md">
//                 <UserCheck size={14} className="text-slate-400" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Reporting To</span>
//                 <span className="text-[12px] text-slate-700 font-semibold">Sarah Jenkins <span className="text-slate-400 font-normal text-[11px]">(VP Ops)</span></span>
//               </div>
//             </div>

//             {/* Reporting Time */}
//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-slate-50 rounded-md">
//                 <Clock size={14} className="text-slate-400" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Reporting Time</span>
//                 <span className="text-[12px] text-slate-700 font-semibold">09:30 AM <span className="text-slate-400 font-normal text-[11px]">(IST)</span></span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Section: Professional CTA Group */}
//       <div className="mt-6 lg:mt-0 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">

//         {/* Download Joining Letter - Enterprise Style */}
//         <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-tight shadow-sm active:scale-[0.98]">
//           <Download size={14} className="text-blue-500" />
//           Joining Letter
//         </button>

//         <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>

//         {/* Final Status Indicator */}
//         <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
//           <CheckCircle2 size={18} strokeWidth={2.5} />
//           <div className="flex flex-col items-start leading-none">
//             <span className="text-[10px] font-black uppercase tracking-[1.5px]">Onboarded</span>
//           </div>
//         </div>
//       </div>

//       {/* Professional Watermark */}
//       <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-[0.4] pointer-events-none group-hover:text-blue-50 transition-colors">
//         <FileCheck size={120} />
//       </div>
//     </div>
//   )}
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
//               completed={aadhaarDoc?.status === "exists"}
//               hasFile={!!aadhaarDoc?.document_path}
//               iconColor={
//                 aadhaarDoc?.status === "exists"
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
//               completed={panDoc?.status === "exists"}
//               hasFile={!!panDoc?.document_path}
//               iconColor={
//                 panDoc?.status === "exists"
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
//               completed={bankDoc?.status === "exists"}
//               hasFile={!!bankDoc?.document_path}
//               iconColor={
//                 bankDoc?.status === "exists"
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
//               completed={photoDoc?.status === "exists"}
//               hasFile={!!photoDoc?.document_path}
//               iconColor={
//                 photoDoc?.status === "exists"
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
//               completed={offerDoc?.status === "exists"}
//               hasFile={!!offerDoc?.document_path}
//               iconColor={
//                 offerDoc?.status === "exists"
//                   ? "text-green-500"
//                   : "text-green-400"
//               }
//               onAdd={() => {
//                 setActiveDoc("previous_offer_letter");
//                 setShowKycModal(true);
//               }}
//               onView={() => {
//                 setViewDocType("previous_offer_letter");
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

//       {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
// {employee?.status === "on_probation" && (
//   <div className="mb-8 mt-5 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[1rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
//     <div className="flex flex-col md:flex-row items-center justify-between p-6 lg:px-8">

//       {/* LEFT SIDE: Alert Content */}
//       <div className="flex items-center gap-5">
//         <div className="flex-shrink-0">
//           <div className="relative">
//             <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
//               <History size={28} className="animate-pulse" />
//             </div>
//             {/* Pulsing indicator */}
//             <span className="absolute -top-1 -right-1 flex h-4 w-4">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
//             </span>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
//               Priority
//             </span>
//             <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
//               Probation Period Concluding
//             </h3>
//           </div>
//           <p className="text-sm text-slate-600 font-medium">
//             This employee's probation phase ends in <span className="text-blue-700 font-black">7 days</span>. Please conduct the final performance review.
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE: Action Button */}
//       <div className="mt-4 md:mt-0 flex items-center gap-4">
//         {/* Simple count-down visual */}
//         <div className="hidden lg:flex flex-col items-end mr-4">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Review Deadline</span>
//           <span className="text-xs font-bold text-slate-700">Jan 31, 2026</span>
//         </div>

//         {/* <button className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 active:scale-95 group">
//           <FileCheck size={16} className="group-hover:rotate-6 transition-transform" />
//           Conduct Review Now
//         </button> */}

//         <button
//       onClick={() => navigate("/dummyemp/3/review")}
//       className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 active:scale-95 group"
//     >
//       <FileCheck size={16} className="group-hover:rotate-6 transition-transform" />
//       Conduct Review Now
//     </button>
//       </div>

//     </div>
//   </div>
// )}
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
//***********************************************working code phase 1 23/1/25******************************************************** */
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
//   Mail,Download, CheckCircle2,
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

//   const getAddressProofDoc = (type) => {
//   return documents?.find((d) => d.document_type === type);
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

//   const currentDoc = getAddressProofDoc("address_proof_current");
// const permanentDoc = getAddressProofDoc("address_proof_permanent");

// //   console.log("working code", address?.address);

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
//                 value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
//               />

//               {/* <div className="flex items-start gap-2">
//                 {address?.current_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address?.current_address_status ? (
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
//               </div> */}

//               <div className="flex items-start gap-2">
//   {/* VERIFIED */}
//   {address?.current_address_status === "verified" && (
//     <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//       Verified
//     </span>
//   )}

//   {/* DOCUMENT EXISTS → VERIFY */}
//   {address?.current_address_status !== "verified" &&
//     currentDoc?.status === "exists" && (
//       <button
//         onClick={() => {
//           setVerifyForm({
//             type: "current",
//             status: "verified",
//             remarks: "",
//           });
//           setShowVerifyModal(true);
//         }}
//         className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//       >
//         Verify
//       </button>
//     )}

//      {/* ✅ VIEW BUTTON */}
//   {currentDoc?.status === "exists" &&
//     currentDoc?.document?.document_path && (
//       <button
//         onClick={() =>
//           window.open(
//             `https://emp-onbd-1.onrender.com/${currentDoc.document.document_path}`,
//             "_blank"
//           )
//         }
//         className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//       >
//         View
//       </button>
//     )}

//   {/* DOCUMENT NOT EXISTS → UPLOAD */}
//   {currentDoc?.status === "not_exists" && (
//     <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//       Upload Proof
//       <input
//         type="file"
//         hidden
//         onChange={async (e) => {
//           try {
//             await employeeAddressService.uploadDocument(
//               id,
//               "address_proof_current",
//               e.target.files[0]
//             );
//             toast.success("Current address proof uploaded");
//             fetchDocuments();
//           } catch (err) {
//             toast.error(err.message);
//           }
//         }}
//       />
//     </label>
//   )}
// </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}

//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
//               />

//               {/* <div className="flex items-start gap-2">
//                 {address?.permanent_address_status === "verified" ? (
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 ) : address?.permanent_address_status ? (
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
//               </div> */}

//               <div className="flex items-start gap-2">
//   {address?.permanent_address_status === "verified" && (
//     <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//       Verified
//     </span>
//   )}

//   {address?.permanent_address_status !== "verified" &&
//     permanentDoc?.status === "exists" && (
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
//     )}

//      {/* ✅ VIEW BUTTON */}
//   {address?.permanent_address_status === "verified" &&
//     permanentDoc?.document?.document_path && (
//       <button
//         onClick={() =>
//           window.open(
//             `https://emp-onbd-1.onrender.com/${permanentDoc.document.document_path}`,
//             "_blank"
//           )
//         }
//         className="px-3 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded-lg"
//       >
//         View
//       </button>
//     )}

//   {permanentDoc?.status === "not_exists" && (
//     <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
//       Upload Proof
//       <input
//         type="file"
//         hidden
//         onChange={async (e) => {
//           try {
//             await employeeAddressService.uploadDocument(
//               id,
//               "address_proof_permanent",
//               e.target.files[0]
//             );
//             toast.success("Permanent address proof uploaded");
//             fetchDocuments();
//           } catch (err) {
//             toast.error(err.message);
//           }
//         }}
//       />
//     </label>
//   )}
// </div>

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

//       {/* <div>
//         {employee?.status !== "offer_accepted" && (
//         <OfferLatter employee={employee} fetchEmployee={fetchEmployee} />
//         )}
//       </div> */}

//       {/* <div>
//   {employee?.status !== "offer_accepted" ? (
//     <OfferLatter employee={employee} fetchEmployee={fetchEmployee} />
//   ) : (
//     // Professional Enterprise UI for Accepted Status
//     <div className="border border-green-200 bg-green-50 rounded-lg p-6 mt-5 flex items-center shadow-sm">
//       <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
//         <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//         </svg>
//       </div>
//       <div className="ml-4">
//         <h3 className="text-lg font-semibold text-gray-900">Offer Accepted</h3>
//         <p className="text-sm text-gray-600">
//           The candidate has officially accepted the offer. The onboarding process is now active.
//         </p>
//       </div>
//       <div className="ml-auto">
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 uppercase tracking-wider">
//           Completed
//         </span>
//       </div>
//     </div>
//   )}
// </div> */}

//     <div>
//   {!["offer_accepted", "confirmed"].includes(employee?.status) ? (
//     <OfferLatter employee={employee} fetchEmployee={fetchEmployee} />
//   ) : (
//     // Professional Enterprise UI for Accepted Status
//     // <div className="border border-green-200 bg-green-50 rounded-lg p-6 mt-5 flex items-center shadow-sm">
//     //   <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
//     //     <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//     //     </svg>
//     //   </div>
//     //   <div className="ml-4">
//     //     <h3 className="text-lg font-semibold text-gray-900">Offer Accepted</h3>
//     //     <p className="text-sm text-gray-600">
//     //       The candidate has officially accepted the offer. The onboarding process is now active.
//     //     </p>
//     //   </div>
//     //   <div className="ml-auto">
//     //     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 uppercase tracking-wider">
//     //       Completed
//     //     </span>
//     //   </div>
//     // </div>
// <div className="relative overflow-hidden border border-slate-200 bg-white rounded-xl p-5 mt-4 flex flex-col lg:flex-row items-center justify-between transition-all hover:shadow-md group">

//   {/* Left Section: Identity & Data */}
//   <div className="flex items-center w-full lg:w-auto">
//     {/* Icon Representation of a Document */}
//     <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
//       <FileText size={24} strokeWidth={1.5} />
//     </div>

//     <div className="ml-4 flex flex-col gap-1">
//       <div className="flex items-center gap-2">
//         <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
//           Johnathan Doe
//         </h3>
//         <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//         <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
//           NexusFlow Corp
//         </span>
//       </div>

//       {/* Designation & Package Row */}
//       <div className="flex items-center gap-6 mt-1">
//         <div className="flex flex-col">
//           <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Designation</span>
//           <span className="text-[12px] text-slate-600 font-medium">Senior Product Lead</span>
//         </div>

//         <div className="h-6 w-[1px] bg-slate-100"></div>

//         <div className="flex flex-col">
//           <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Offer Amount</span>
//           <span className="text-[12px] text-slate-900 font-mono font-bold">$145,000<span className="text-[10px] text-slate-400 ml-0.5">/annum</span></span>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Right Section: Actions & Status */}
//   <div className="mt-5 lg:mt-0 w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-end gap-4">

//     {/* Download Button - Professional Ghost Style */}
//     <button
//       onClick={() => {/* Add download logic here */}}
//       className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all text-[11px] font-bold uppercase tracking-tight"
//     >
//       <Download size={14} className="text-slate-400" />
//       Offer Letter.pdf
//     </button>

//     <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>

//     {/* Attractive Success Indicator */}
//     <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
//       <CheckCircle2 size={16} strokeWidth={3} />
//       <span className="text-[10px] font-black uppercase tracking-[1.5px]">
//         Completed
//       </span>
//     </div>
//   </div>

//   {/* Subtle Background Badge for "Signed" status */}
//   <div className="absolute top-2 right-2 opacity-[0.03] pointer-events-none">
//     <CheckCircle2 size={80} />
//   </div>
// </div>
//   )}
// </div>

//       {/* <div>
//         <JoiningDispatchUI employee={employee} />
//       </div> */}

//       {employee?.status === "offer_accepted" && (
//   <div>
//     <JoiningDispatchUI employee={employee} />
//   </div>
// )}

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
