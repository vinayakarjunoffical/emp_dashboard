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
  Briefcase,
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

// const emptyAsset = {
//   category: "laptop",
//   model: "",
//   serial: "",
// };
const createEmptyAsset = () => ({
  category: "laptop",
  model: "",
  serial: "",
});



  useEffect(() => {
    fetchEmployee();
    fetchAddress();
    fetchDocuments();
    fetchExperiences();
  }, [id]);

  useEffect(() => {
    fetchKyc();
      fetchAssets();
  }, [id]);

  const fetchKyc = async () => {
    try {
      const data = await employeeKycService.get(id);
      if (data) {
        setKyc(data);
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
    return `http://72.62.242.223:8000/${doc.document_path}`;
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
const addAssetRow = () => {
  setAssetRows((prev) => [...prev, createEmptyAsset()]);
};


// Remove row
const removeAssetRow = (index) => {
  const updated = assetRows.filter((_, i) => i !== index);
  setAssetRows(updated);
};

// Change row field
const handleAssetChange = (index, field, value) => {
  setAssetRows((prev) =>
    prev.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    )
  );
};



const handleSubmitAssets = async () => {
  try {
    const validAssets = assetRows.filter(
      (a) => a.model && a.serial
    );

    if (validAssets.length === 0) {
      toast.error("Add valid asset details");
      return;
    }

    await employeeService.addAssets(id, { assets: validAssets });

    toast.success("Assets assigned successfully");

    setAssetRows([]);
    fetchAssets();
  } catch (err) {
    toast.error(err.message || "Failed to assign assets");
  }
};


const fetchAssets = async () => {
  try {
    const res = await employeeService.getAssets(id);
    setPreviousAssets(res?.data || []);
  } catch (err) {
    console.error("Failed to fetch assets", err);
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-700"
                    : employee.status === "created"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {employee.status}
              </span>
            </GridItem>
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        {/* HEADER SECTION */}
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

        {/* TIMELINE & DATA SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: TIMELINE (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
            {sortedExperiences.length > 0 ? (
              sortedExperiences.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-12 group">
                  {/* Timeline Dot */}
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
              /* NO EXPERIENCE / FRESHER STATE */
              <div className="relative pl-12">
                {/* Neutral Timeline Dot */}
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

          {/* RIGHT: SALARY ANALYTICS (Takes 1 column) */}
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
                value={`${address?.current_address_line1 || ""}, ${address?.current_city || ""}, ${address?.current_state || ""} - ${address?.current_pincode || ""}`}
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
                value={`${address?.permanent_address_line1 || ""}, ${address?.permanent_city || ""}, ${address?.permanent_state || ""} - ${address?.permanent_pincode || ""}`}
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
                {address?.permanent_address_status === "verified" &&
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
        <Modal
          title={address ? "Update Address" : "Add Address"}
          onClose={() => setShowAddressModal(false)}
        >
          {/* CURRENT ADDRESS */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-slate-800 mb-3">
              Current Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Input
                label="Address Line 1"
                value={addressForm?.current_address_line1 || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_address_line1: v })
                }
              />
              <Input
                label="Address Line 2"
                value={addressForm?.current_address_line2 || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_address_line2: v })
                }
              />
              <Input
                label="City"
                value={addressForm?.current_city || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_city: v })
                }
              />
              <Input
                label="State"
                value={addressForm?.current_state || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_state: v })
                }
              />
              <Input
                label="Pincode"
                value={addressForm?.current_pincode || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_pincode: v })
                }
              />
            </div>
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-slate-800 mb-3">
              Permanent Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Input
                label="Address Line 1"
                value={addressForm?.permanent_address_line1 || ""}
                onChange={(v) =>
                  setAddressForm({
                    ...addressForm,
                    permanent_address_line1: v,
                  })
                }
              />
              <Input
                label="Address Line 2"
                value={addressForm?.permanent_address_line2 || ""}
                onChange={(v) =>
                  setAddressForm({
                    ...addressForm,
                    permanent_address_line2: v,
                  })
                }
              />
              <Input
                label="City"
                value={addressForm?.permanent_city || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, permanent_city: v })
                }
              />
              <Input
                label="State"
                value={addressForm?.permanent_state || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, permanent_state: v })
                }
              />
              <Input
                label="Pincode"
                value={addressForm?.permanent_pincode || ""}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, permanent_pincode: v })
                }
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddressModal(false)}
              className="px-4 py-2 border rounded-lg text-sm"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              {address ? "Update Address" : "Save Address"}
            </button>
          </div>
        </Modal>
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

      <div>
        {!["offer_accepted", "confirmed", "on_probation"].includes(
          employee?.status,
        ) ? (
          <OfferLatter employee={employee} fetchEmployee={fetchEmployee} />
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
                    Johnathan Doe
                  </h3>
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    NexusFlow Corp
                  </span>
                </div>

                {/* Designation & Package Row */}
                <div className="flex items-center gap-6 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      Designation
                    </span>
                    <span className="text-[12px] text-slate-600 font-medium">
                      Senior Product Lead
                    </span>
                  </div>

                  <div className="h-6 w-[1px] bg-slate-100"></div>

                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      Offer Amount
                    </span>
                    <span className="text-[12px] text-slate-900 font-mono font-bold">
                      $145,000
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
              <button
                onClick={() => {
                  /* Add download logic here */
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all text-[11px] font-bold uppercase tracking-tight"
              >
                <Download size={14} className="text-slate-400" />
                Offer Letter.pdf
              </button>

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
                        Jan 26, 2026
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
                        Sarah Jenkins{" "}
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
                        09:30 AM{" "}
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
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-tight shadow-sm active:scale-[0.98]">
                <Download size={14} className="text-blue-500" />
                Joining Letter
              </button>

              <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-1"></div>

              {/* Final Status Indicator */}
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <CheckCircle2 size={18} strokeWidth={2.5} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase tracking-[1.5px]">
                    Onboarded
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

      {/* <div>
        <AssetManager previousAssets={previousAssets}
      assetRows={assetRows}
      onAdd={addAssetRow}
      onRemove={removeAssetRow}
      onChange={handleAssetChange} />
      </div> */}
 <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">💻 Asset Assignment</h2>

    <button
      onClick={handleSubmitAssets}
      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold"
    >
      Save Assets
    </button>
  </div>

  <AssetManager
    previousAssets={previousAssets}
    assetRows={assetRows}
    onAdd={addAssetRow}
    onRemove={removeAssetRow}
    onChange={handleAssetChange}
  />
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
                            //   const updated = [...experiences];
                            const updated = [...draftExperiences];
                            updated[index].company_name = e.target.value;
                            //   setExperiences(updated);
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
                    <Input
                      label="Name (as per PAN)"
                      value={panVerifyForm.name}
                      onChange={(v) =>
                        setPanVerifyForm({ ...panVerifyForm, name: v })
                      }
                    />

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

      {/* PROBATION REVIEW NOTIFICATION - CONDITIONAL RENDER */}
      {employee?.status === "on_probation" && (
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
                <span className="text-xs font-bold text-slate-700">
                  Jan 31, 2026
                </span>
              </div>

              <button
                onClick={() => navigate("/dummyemp/3/review")}
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
