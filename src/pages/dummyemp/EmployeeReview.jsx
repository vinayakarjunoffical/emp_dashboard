import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Download,
  Eye,
  FileText,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Search,
  CreditCard,
  ArrowLeft,
  Landmark,
  Fingerprint,
  History,
  UserCheck,
  Globe,
  X,
  FileSignature,
  MailOpen,
  AlertCircle,
  ImageIcon,
  Smartphone,
  MapPin,
  Package,
  Home,
  Monitor,
} from "lucide-react";
import { useEffect } from "react";
import { employeeKycService } from "../../services/employeeKyc.service";
import ReviewSection from "../../components/review/ReviewSection";

export default function ReviewPage() {
    const { id } = useParams();
      const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null);
  const [confirmationDate, setConfirmationDate] = useState("");
  const [newCtc, setNewCtc] = useState("");
  const [sendingAppointment, setSendingAppointment] = useState(false);

  // const [assetRows, setAssetRows] = useState([
  //   {
  //     category: "laptop",
  //     model: "",
  //     serial: "",
  //   },
  // ]);
  const [assetRows, setAssetRows] = useState([
    {
      category: "laptop",
      model: "",
      serial: "",
      modelNumber: "",
    },
  ]);

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_FILE_URL = "https://apihrr.goelectronix.co.in/";

  const previousAssets = [
    { category: "laptop", model: "MacBook Pro M3", serial: "MBP889201" },
    { category: "mobile", model: "iPhone 15", serial: "IMEI9988123" },
  ];

  const handleAssetChange = (index, field, value) => {
    const updated = [...assetRows];
    updated[index][field] = value;
    setAssetRows(updated);
  };

  const addAssetRow = () => {
    setAssetRows([...assetRows, { category: "laptop", model: "", serial: "" }]);
  };

  const removeAssetRow = (index) => {
    setAssetRows(assetRows.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await employeeKycService.getFull(id); // dynamic later
        setEmployee(data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, []);

  const employeeAssets = employee?.assets || [];

  const legalDocs =
    employee?.documents?.filter((d) =>
      ["goex_offer_letter", "joining_letter"].includes(d.document_type),
    ) || [];

  // map backend → UI format (fallback kept)
  const employmentLetters = legalDocs.length
    ? legalDocs.map((doc) => ({
        name: doc.document_path.split("/").pop(),
        type:
          doc.document_type === "goex_offer_letter"
            ? "Offer Letter"
            : "Joining Letter",
        url: doc.document_path,
        date: "Uploaded",
        icon:
          doc.document_type === "goex_offer_letter" ? (
            <MailOpen size={18} />
          ) : (
            <FileSignature size={18} />
          ),
      }))
    : [
        {
          name: "Offer_Letter_v2.pdf",
          type: "Offer Letter",
          date: "Jan 12, 2026",
          icon: <MailOpen size={18} />,
        },
        {
          name: "Joining_Letter_Signed.pdf",
          type: "Joining Letter",
          date: "Jan 20, 2026",
          icon: <FileSignature size={18} />,
        },
      ];

  // const handleSendAppointmentLetter = async () => {
  //   if (!confirmationDate) {
  //     toast.error("Please select confirmation date");
  //     return;
  //   }

  //   try {
  //     setSendingAppointment(true);

  //     const payload = {
  //       confirmation_date: confirmationDate,
  //       new_ctc: Number(newCtc || 0),
  //     };

  //     toast.loading("Sending appointment letter...", { id: "appoint" });

  //     const res = await employeeKycService.sendAppointmentLetter(
  //       employee?.id || 3,
  //       payload,
  //     );

  //     console.log("Appointment Letter Sent:", res);

  //     toast.success("Appointment Letter Sent Successfully 🚀", {
  //       id: "appoint",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.message || "Failed to send appointment letter", {
  //       id: "appoint",
  //     });
  //   } finally {
  //     setSendingAppointment(false);
  //   }
  // };

  const allDocs =
    employee?.documents?.map((doc) => ({
      id: doc.id,
      name: doc.document_path.split("/").pop(),
      type: doc.document_type,
      status: doc.status,
      url: doc.document_path,
    })) || [];

  const documents = allDocs;

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const buildAssetsPayload = () => {
  return assetRows
    .filter(a => a.model && a.serial) // ignore empty rows
    .map(a => ({
      asset_category: a.category,
      asset_name: a.model,
      serial_number: a.serial,
      model_number: a.modelNumber || "",
      allocated_at: confirmationDate,
      condition_on_allocation: "new",
      remarks: "Issued with appointment letter",
    }));
};


const handleSendAppointmentLetter = async () => {
  if (!confirmationDate) {
    toast.error("Please select confirmation date");
    return;
  }

  try {
    setSendingAppointment(true);

    toast.loading("Processing appointment & assets...", { id: "appoint" });

    const appointmentPayload = {
      confirmation_date: confirmationDate,
      new_ctc: Number(newCtc || 0),
    };

    const assetsPayload = {
      assets: buildAssetsPayload(),
      send_email: false,
    };

    const employeeId = employee?.id || 3;

    // 🔥 RUN BOTH APIs TOGETHER
    const [appointmentRes, assetsRes] = await Promise.all([
      employeeKycService.sendAppointmentLetter(employeeId, appointmentPayload),
      assetsPayload.assets.length > 0
        ? employeeKycService.addAssets(employeeId, assetsPayload)
        : Promise.resolve("No assets added"),
    ]);

    console.log("Appointment Response:", appointmentRes);
    console.log("Assets Response:", assetsRes);

    toast.success("Appointment Letter & Assets Assigned Successfully 🚀", {
      id: "appoint",
    });
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed process", { id: "appoint" });
  } finally {
    setSendingAppointment(false);
  }
};

const isVerified = (value) => Boolean(value);

const panVerified = isVerified(employee?.kyc?.pan_number);

const aadhaarVerified = isVerified(employee?.kyc?.aadhaar_number);

const bankVerified =
  employee?.kyc?.account_number && employee?.kyc?.ifsc_code;


  const isProbationReviewDone = employee?.reviews?.some(
  (review) =>
    review.review_type === "probation" &&
    review.status === "Review Done"
);

const probationReviews =
  employee?.reviews?.filter(
    (r) => r.review_type === "probation" && r.status === "Review Done"
  ) || [];

const latestProbationReview =
  probationReviews.length > 0
    ? probationReviews.sort(
        (a, b) => new Date(b.reviewed_at) - new Date(a.reviewed_at)
      )[0]
    : null;

    const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) : "—";



  const VerifiedBadge = () => (
    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
      <ShieldCheck size={10} /> Verified
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 relative">
      {/* --- DOCUMENT VIEW MODAL --- */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 leading-none">
                    {viewingDoc.name}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                    Secure Document Preview
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-10 bg-slate-100 flex justify-center h-[400px] overflow-y-auto">
              <div className="p-4 bg-slate-100 h-[450px]">
                {viewingDoc?.url ? (
                  viewingDoc.url.endsWith(".pdf") ? (
                    <iframe
                      src={viewingDoc.url}
                      className="w-full h-full rounded-xl border"
                      title="Document Preview"
                    />
                  ) : (
                    <img
                      src={viewingDoc.url}
                      className="max-h-full mx-auto rounded-xl shadow-lg"
                      alt="Document Preview"
                    />
                  )
                ) : (
                  <div className="text-center text-sm font-bold text-slate-500">
                    Preview not available
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest"
              >
                Dismiss
              </button>
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP NAV */}
      <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div>
            <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95 text-gray-500 group"
          >
            <ArrowLeft size={18} className="group-hover:text-gray-900" />
          </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white">
              <UserCheck size={18} />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Goelectronix
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-500">
            {/* <History size={14} />
            <span className="text-xs font-medium uppercase tracking-wider">
              Audit Log #8802
            </span> */}
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
        {/* HEADER */}

        <div className="pb-8 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* LEFT SIDE: Profile Info */}
            <div className="flex items-center gap-6">
              {/* <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  className="h-24 w-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white"
                  alt="User"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-slate-50">
                  <CheckCircle2 size={14} />
                </div>
              </div> */}
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  {/* {employee?.full_name || "Rupesh Sharma"} */}
                  {(employee?.full_name || "Rupesh Sharma").toUpperCase()}
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
                  <Building2 size={14} className="text-blue-500" />
                  {employee?.role || "Lead UX Engineer"} •{" "}
                  {employee?.department_name || "NA"}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase border border-blue-100">
                    Full-Time
                  </span>
                  <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-md uppercase border border-slate-200">
                    On-Site
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Key Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-4 lg:gap-8">
              {/* Metric 1: Joining Date */}
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Joining Date
                </span>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                    <History size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {employee?.joining_date || "Jan 12, 2026"}
                  </span>
                </div>
              </div>

              {/* Vertical Divider (Hidden on mobile) */}
              <div className="hidden md:block h-10 w-[1px] bg-slate-200" />

              {/* Metric 2: Salary Context */}
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Current CTC
                </span>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Landmark size={14} />
                  </div>
                  <span className="text-sm font-black text-slate-800 tracking-tight">
                    ₹ {employee?.offered_ctc?.toLocaleString() || "NA"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    per annum
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {/* <div className="lg:ml-4">
                <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95 group">
                  <Download
                    size={16}
                    className="group-hover:-translate-y-0.5 transition-transform"
                  />
                  Download Profile
                </button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT CONTENT */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* ADDRESS SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
                <MapPin size={14} className="text-slate-400" />
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Address Management
                </h2>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      Current Residence
                    </span>
                    <VerifiedBadge />
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    {employee?.address
                      ? `${employee.address.current_address_line1}, ${employee.address.current_city}, ${employee.address.current_state} - ${employee.address.current_pincode}`
                      : "-"}
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      Permanent Address
                    </span>
                    <VerifiedBadge />
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    {/* 124 Conch Street, Bikini Bottom, Pacific Ocean */}
                     {employee?.address
                      ? `${employee.address.permanent_address_line1}, ${employee.address.permanent_city}, ${employee.address.permanent_state} - ${employee.address.permanent_pincode}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* KYC & BANK SECTION */}

            {/* IDENTITY & FINANCIAL KYC SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
                <Landmark size={14} className="text-slate-400" />
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Identity & Financial KYC
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {/* NEW: PAN Card Row */}
                <div className="p-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        National Identifier (PAN)
                      </p>
                      <p className="text-sm font-bold text-slate-800 tracking-wider">
                        {employee?.kyc?.pan_number || "ABCDE1234F"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setViewingDoc({ name: "PAN_Card_Original.pdf" })
                        }
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                    <VerifiedBadge />
                  </div>
                </div>

                {/* Aadhar Row */}
                <div className="p-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        Aadhar Card
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {employee?.kyc?.aadhaar_number || "XXXX-XXXX-8802"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setViewingDoc({ name: "Aadhar_Card.pdf" })
                        }
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                    <VerifiedBadge />
                  </div>
                </div>

                {/* Bank Row */}
                <div className="p-6 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Landmark size={20} />
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          Bank Account
                        </p>
                        <p className="text-[11px] font-bold text-slate-800">
                          {employee?.kyc?.account_holder_name || "Vinayak Rajaram Arjun"} •
                          ****
                          {employee?.kyc?.account_number?.slice(-4) || "8990"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          IFSC / Type
                        </p>
                        <p className="text-[11px] font-bold text-slate-800">
                          {employee?.kyc?.ifsc_code || "UIBN845124"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setViewingDoc({ name: "Passbook_Front.pdf" })
                      }
                      className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ASSETS & CONTRACTS SECTION */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Asset Section */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Package size={14} className="text-slate-400" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Inventory Assets
                  </h2>
                </div>

                <div className="p-4 space-y-3">
                  {employeeAssets.length > 0 ? (
                    employeeAssets.map((asset, i) => (
                      <div
                        key={i}
                        className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-all"
                      >
                        {/* LEFT SIDE: Icon and Basic Info */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                            {asset.asset_category === "laptop" ? (
                              <Monitor size={14} />
                            ) : asset.asset_category === "mobile" ? (
                              <Smartphone size={14} />
                            ) : (
                              <Package size={14} />
                            )}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-700 leading-tight">
                              {asset.asset_name}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                              {asset.asset_category} • SN:{" "}
                              {asset.serial_number || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT SIDE: Model Number (Replacing Eye/Download) */}
                        <div className="text-right">
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mb-0.5">
                            Model Ref
                          </p>
                          <p className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {asset.model_number || "—"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        No Assets Assigned
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Employment Section */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <FileSignature size={14} className="text-slate-400" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Legal Contracts
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {employmentLetters.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          {doc.icon}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-700">
                            {doc.type}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            {doc.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {/* VIEW */}
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="p-1.5 text-blue-400 hover:text-blue-600"
                        >
                          <Eye size={14} />
                        </button>

                        {/* DOWNLOAD */}
                        <a
                          href={doc.url}
                          download
                          target="_blank"
                          className="p-1.5 text-blue-400 hover:text-blue-600"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

{/* <div>
  <ReviewSection employeeId={employee?.id || null} />
</div> */}
{/* {!isProbationReviewDone && (
  <div>
    <ReviewSection employeeId={employee?.id || null} />
  </div>
)} */}
{/* {!isProbationReviewDone ? (
  <div>
    <ReviewSection employeeId={employee?.id || null} />
  </div>
) : (
 
  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm overflow-hidden relative group">
  
    <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5">

        <div className="relative">
          <div className="absolute inset-0 bg-emerald-100 rounded-2xl animate-ping opacity-20" />
          <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 relative">
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-wider">
              Completed
            </span>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
              <ShieldCheck size={12} /> System Verified
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Probation Review Finalized
          </h3>
          <p className="text-sm font-medium text-slate-500">
            The performance evaluation for this employee is complete and logged in the core terminal.
          </p>
        </div>
      </div>

   
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Review Date</p>
          <p className="text-sm font-bold text-slate-900">Oct 24, 2025</p>
        </div>
     
      </div>
    </div>
  </div>
)} */}

{!isProbationReviewDone ? (
  <ReviewSection employeeId={employee?.id || null} />
) : (
  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm overflow-hidden relative group">
    {/* Soft Accent */}
    <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60" />

    <div className="relative flex flex-col gap-6">
      {/* TOP ROW */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Icon */}
          <div className="relative">
            <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200">
              <CheckCircle2 size={28} strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-wider">
                Completed
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                <ShieldCheck size={12} /> System Verified
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Probation Review Finalized
            </h3>
            <p className="text-sm font-medium text-slate-500">
              This review has been completed and securely recorded.
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Review Date
          </p>
          <p className="text-sm font-bold text-slate-900">
            {formatDate(latestProbationReview?.reviewed_at)}
          </p>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-3 gap-6 border-t border-slate-100 pt-6">
        {/* Decision */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Decision
          </p>
          <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase">
            {latestProbationReview?.decision || "—"}
          </span>
        </div>

        {/* Reviewed By */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Reviewed By
          </p>
          <p className="text-sm font-bold text-slate-700 mt-1">
            {latestProbationReview?.reviewed_by || "-"}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Status
          </p>
          <p className="text-sm font-bold text-emerald-600 mt-1">
            {latestProbationReview?.status}
          </p>
        </div>
      </div>

      {/* COMMENTS */}
      {latestProbationReview?.comments && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Reviewer Comments
          </p>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            “{latestProbationReview.comments}”
          </p>
        </div>
      )}
    </div>
  </div>
)}




            {/* APPOINTMENT & ASSET ASSIGNMENT MODULE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileSignature size={14} className="text-slate-400" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Appointment Letter Issuance
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    Draft Mode
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* TOP ROW: DATE & CTC */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Confirmation Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={confirmationDate}
                        onChange={(e) => setConfirmationDate(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Revised CTC (New Annual Package)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        &#8377;
                      </span>

                      <input
                        type="number"
                        value={newCtc}
                        onChange={(e) => setNewCtc(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* ASSET ARRAY SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Hardware Assets Assignment
                    </label>
                    <button
                      onClick={addAssetRow}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      + ADD NEW ASSET
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* ASSET ARRAY SECTION - DYNAMIC DROPDOWN */}
                    <div className="space-y-4">
                      {/* Previous Assigned Assets */}

                      {/* <div className="space-y-3">
                        {previousAssets.map((a, i) => (
                          <div
                            key={i}
                            className="group grid grid-cols-12 gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 items-center"
                          >
                           
                            <div className="col-span-4 flex items-center gap-3">
                              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                {a.category.toLowerCase() === "laptop" ? (
                                  <Monitor size={16} />
                                ) : a.category.toLowerCase() === "sim card" ? (
                                  <Cpu size={16} />
                                ) : (
                                  <Package size={16} />
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                                  Asset Category
                                </p>
                                <p className="text-xs font-bold text-slate-700">
                                  {a.category.toUpperCase()}
                                </p>
                              </div>
                            </div>

                    
                            <div className="col-span-3">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                                Model / Specs
                              </p>
                              <p className="text-xs font-semibold text-slate-600 truncate">
                                {a.model}
                              </p>
                            </div>

                            <div className="col-span-3">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                                Identification
                              </p>
                              <p className="text-xs font-mono text-slate-500">
                                {a.serial}
                              </p>
                            </div>

                          
                            <div className="col-span-2 flex justify-end">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                  Assigned
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div> */}

            
                      <div className="space-y-3">
                        {assetRows.map((row, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-3 p-3 bg-white border border-slate-200 rounded-2xl items-end hover:border-blue-300 hover:shadow-sm transition-all animate-in fade-in slide-in-from-top-2"
                          >
                        
                            <div className="col-span-2 space-y-1.5">
                              <p className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-wider">
                                Category
                              </p>
                              <select
                                value={row.category}
                                onChange={(e) =>
                                  handleAssetChange(
                                    index,
                                    "category",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                              >
                                <option value="laptop">Laptop</option>
                                <option value="mobile">Mobile</option>
                                <option value="sim_card">SIM Card</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                        
                            <div className="col-span-3 space-y-1.5">
                              <p className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-wider truncate">
                                {row.category === "sim_card"
                                  ? "Carrier / Plan"
                                  : "Model / Specs"}
                              </p>
                              <input
                                value={row.model}
                                onChange={(e) =>
                                  handleAssetChange(
                                    index,
                                    "model",
                                    e.target.value,
                                  )
                                }
                                placeholder={
                                  row.category === "laptop"
                                    ? "MacBook Pro M3"
                                    : row.category === "mobile"
                                      ? "iPhone 15"
                                      : "Details..."
                                }
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                              />
                            </div>

                            <div className="col-span-3 space-y-1.5">
                              <p className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-wider truncate">
                                {row.category === "sim_card"
                                  ? "ICCID / SIM No"
                                  : "Serial Number"}
                              </p>
                              <input
                                value={row.serial}
                                onChange={(e) =>
                                  handleAssetChange(
                                    index,
                                    "serial",
                                    e.target.value,
                                  )
                                }
                                placeholder="Unique ID..."
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                              />
                            </div>

                        
                            <div className="col-span-3 space-y-1.5">
                              <p className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-wider">
                                Model Number
                              </p>
                              <input
                                value={row.modelNumber}
                                onChange={(e) =>
                                  handleAssetChange(
                                    index,
                                    "modelNumber",
                                    e.target.value,
                                  )
                                }
                                placeholder="M3-2024-Apple"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                              />
                            </div>

                    
                            <div className="col-span-1 flex justify-center pb-0.5">
                              <button
                                onClick={() => removeAssetRow(index)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                                title="Remove row"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION AREA */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={handleSendAppointmentLetter}
                    disabled={sendingAppointment}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MailOpen size={16} />
                    {sendingAppointment
                      ? "SENDING..."
                      : "GENERATE & SEND APPOINTMENT LETTER"}
                  </button>

                  <button className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: COMPLIANCE VAULT */}
          <div className="col-span-12 lg:col-span-4 h-full">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sticky top-24 h-[650px]">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Submitted Document </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">
                    ALL FILES
                  </span>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredDocs.map((doc, i) => (
                  <div
                    key={i}
                    className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-700 truncate w-40">
                          {doc.type?.replace(/_/g, " ")}
                           {/* {doc.name} */}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                        Submitted
                          {/* {doc.name} */}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* VIEW */}
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="p-2 hover:text-blue-600"
                      >
                        <Eye size={14} />
                      </button>

                      {/* DOWNLOAD */}
                      <a
                        href={doc.url}
                        download
                        target="_blank"
                        className="p-2 hover:text-slate-900"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
//****************************************************working code phase 244***************************************************** */
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import {
//   Download,
//   Eye,
//   FileText,
//   CheckCircle2,
//   Building2,
//   ShieldCheck,
//   Search,
//   CreditCard,
//   Landmark,
//   Fingerprint,
//   History,
//   UserCheck,
//   Globe,
//   X,
//   FileSignature,
//   MailOpen,
//   AlertCircle,
//   ImageIcon,
//   Smartphone,
//   MapPin,
//   Package,
//   Home,
//   Monitor,
// } from "lucide-react";
// import { useEffect } from "react";
// import { employeeKycService } from "../../services/employeeKyc.service";

// export default function ReviewPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewingDoc, setViewingDoc] = useState(null);
//   const [confirmationDate, setConfirmationDate] = useState("");
//   const [newCtc, setNewCtc] = useState("");
//   const [sendingAppointment, setSendingAppointment] = useState(false);

//   const [assetRows, setAssetRows] = useState([
//     {
//       category: "laptop",
//       model: "",
//       serial: "",
//     },
//   ]);
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const BASE_FILE_URL = "http://72.62.242.223:8000/";

//   const previousAssets = [
//     { category: "laptop", model: "MacBook Pro M3", serial: "MBP889201" },
//     { category: "mobile", model: "iPhone 15", serial: "IMEI9988123" },
//   ];

//   const handleAssetChange = (index, field, value) => {
//     const updated = [...assetRows];
//     updated[index][field] = value;
//     setAssetRows(updated);
//   };

//   const addAssetRow = () => {
//     setAssetRows([...assetRows, { category: "laptop", model: "", serial: "" }]);
//   };

//   const removeAssetRow = (index) => {
//     setAssetRows(assetRows.filter((_, i) => i !== index));
//   };

//   useEffect(() => {
//     const loadEmployee = async () => {
//       try {
//         const data = await employeeKycService.getFull(3); // dynamic later
//         setEmployee(data);
//       } catch (err) {
//         console.error("API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadEmployee();
//   }, []);

//   const employeeAssets = employee?.assets || [];

//   const legalDocs =
//     employee?.documents?.filter((d) =>
//       ["goex_offer_letter", "joining_letter"].includes(d.document_type),
//     ) || [];

//   // map backend → UI format (fallback kept)
//   const employmentLetters = legalDocs.length
//     ? legalDocs.map((doc) => ({
//         name: doc.document_path.split("/").pop(),
//         type:
//           doc.document_type === "goex_offer_letter"
//             ? "Offer Letter"
//             : "Joining Letter",
//         url: doc.document_path,
//         date: "Uploaded",
//         icon:
//           doc.document_type === "goex_offer_letter" ? (
//             <MailOpen size={18} />
//           ) : (
//             <FileSignature size={18} />
//           ),
//       }))
//     : [
//         {
//           name: "Offer_Letter_v2.pdf",
//           type: "Offer Letter",
//           date: "Jan 12, 2026",
//           icon: <MailOpen size={18} />,
//         },
//         {
//           name: "Joining_Letter_Signed.pdf",
//           type: "Joining Letter",
//           date: "Jan 20, 2026",
//           icon: <FileSignature size={18} />,
//         },
//       ];

//   const assets = [
//     {
//       name: "MacBook_Pro_M3_Receipt.pdf",
//       type: "Hardware",
//       size: "850 KB",
//       status: "Assigned",
//       icon: <Package size={18} />,
//     },
//     {
//       name: "Corporate_ID_Access.pdf",
//       type: "Security",
//       size: "420 KB",
//       status: "Active",
//       icon: <ShieldCheck size={18} />,
//     },
//   ];

//   const handleSendAppointmentLetter = async () => {
//     if (!confirmationDate) {
//       toast.error("Please select confirmation date");
//       return;
//     }

//     try {
//       setSendingAppointment(true);

//       const payload = {
//         confirmation_date: confirmationDate,
//         new_ctc: Number(newCtc || 0),
//       };

//       toast.loading("Sending appointment letter...", { id: "appoint" });

//       const res = await employeeKycService.sendAppointmentLetter(
//         employee?.id || 3,
//         payload,
//       );

//       console.log("Appointment Letter Sent:", res);

//       toast.success("Appointment Letter Sent Successfully 🚀", {
//         id: "appoint",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to send appointment letter", {
//         id: "appoint",
//       });
//     } finally {
//       setSendingAppointment(false);
//     }
//   };

//   // const documents = [
//   //   {
//   //     name: "PAN_Card_Original.pdf",
//   //     type: "PDF",
//   //     size: "1.2 MB",
//   //     status: "Verified",
//   //   },
//   //   {
//   //     name: "Aadhar_Front_Back.png",
//   //     type: "IMG",
//   //     size: "2.4 MB",
//   //     status: "Verified",
//   //   },
//   //   {
//   //     name: "Bank_Statement_Q4.pdf",
//   //     type: "PDF",
//   //     size: "3.1 MB",
//   //     status: "Verified",
//   //   },
//   //   {
//   //     name: "Rental_Agreement.pdf",
//   //     type: "PDF",
//   //     size: "4.5 MB",
//   //     status: "Pending",
//   //   },
//   // ];

//   const allDocs =
//     employee?.documents?.map((doc) => ({
//       id: doc.id,
//       name: doc.document_path.split("/").pop(),
//       type: doc.document_type,
//       status: doc.status,
//       url: doc.document_path,
//     })) || [];

//   const documents = allDocs;

//   const filteredDocs = documents.filter((doc) =>
//     doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const VerifiedBadge = () => (
//     <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
//       <ShieldCheck size={10} /> Verified
//     </span>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 relative">
//       {/* --- DOCUMENT VIEW MODAL --- */}
//       {viewingDoc && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 text-white rounded-xl">
//                   <FileText size={18} />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-sm text-slate-800 leading-none">
//                     {viewingDoc.name}
//                   </h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
//                     Secure Document Preview
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="p-10 bg-slate-100 flex justify-center h-[400px] overflow-y-auto">
//               <div className="p-4 bg-slate-100 h-[450px]">
//                 {viewingDoc?.url ? (
//                   viewingDoc.url.endsWith(".pdf") ? (
//                     <iframe
//                       src={viewingDoc.url}
//                       className="w-full h-full rounded-xl border"
//                       title="Document Preview"
//                     />
//                   ) : (
//                     <img
//                       src={viewingDoc.url}
//                       className="max-h-full mx-auto rounded-xl shadow-lg"
//                       alt="Document Preview"
//                     />
//                   )
//                 ) : (
//                   <div className="text-center text-sm font-bold text-slate-500">
//                     Preview not available
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest"
//               >
//                 Dismiss
//               </button>
//               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Download size={14} /> Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TOP NAV */}
//       <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 p-1.5 rounded-lg text-white">
//               <UserCheck size={18} />
//             </div>
//             <span className="font-bold text-sm tracking-tight">
//               ComplianceOS
//             </span>
//           </div>
//           <div className="h-4 w-[1px] bg-slate-200" />
//           <div className="flex items-center gap-2 text-slate-500">
//             <History size={14} />
//             <span className="text-xs font-medium uppercase tracking-wider">
//               Audit Log #8802
//             </span>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
//         {/* HEADER */}

//         <div className="pb-8 border-b border-slate-200">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             {/* LEFT SIDE: Profile Info */}
//             <div className="flex items-center gap-6">
//               <div className="relative">
//                 <img
//                   src="https://i.pravatar.cc/150?img=12"
//                   className="h-24 w-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white"
//                   alt="User"
//                 />
//                 <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-slate-50">
//                   <CheckCircle2 size={14} />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">
//                   {employee?.full_name || "Rupesh Sharma"}
//                 </h1>
//                 <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
//                   <Building2 size={14} className="text-blue-500" />
//                   {employee?.role || "Lead UX Engineer"} •{" "}
//                   {employee?.department_name || "Stark Industries"}
//                 </p>
//                 <div className="flex gap-2 mt-3">
//                   <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase border border-blue-100">
//                     Full-Time
//                   </span>
//                   <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-md uppercase border border-slate-200">
//                     On-Site
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SIDE: Key Metrics & Actions */}
//             <div className="flex flex-wrap items-center gap-4 lg:gap-8">
//               {/* Metric 1: Joining Date */}
//               <div className="flex flex-col">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                   Joining Date
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
//                     <History size={14} />
//                   </div>
//                   <span className="text-sm font-bold text-slate-700">
//                     {employee?.joining_date || "Jan 12, 2026"}
//                   </span>
//                 </div>
//               </div>

//               {/* Vertical Divider (Hidden on mobile) */}
//               <div className="hidden md:block h-10 w-[1px] bg-slate-200" />

//               {/* Metric 2: Salary Context */}
//               <div className="flex flex-col">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//                   Current CTC
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
//                     <Landmark size={14} />
//                   </div>
//                   <span className="text-sm font-black text-slate-800 tracking-tight">
//                     ₹{employee?.offered_ctc?.toLocaleString() || "12,45,000"}
//                   </span>
//                   <span className="text-[9px] font-bold text-slate-400 uppercase">
//                     per annum
//                   </span>
//                 </div>
//               </div>

//               {/* Action Button */}
//               <div className="lg:ml-4">
//                 <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95 group">
//                   <Download
//                     size={16}
//                     className="group-hover:-translate-y-0.5 transition-transform"
//                   />
//                   Download Profile
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT CONTENT */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             {/* ADDRESS SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <MapPin size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Address Management
//                 </h2>
//               </div>
//               <div className="p-6 grid md:grid-cols-2 gap-6">
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Current Residence
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                     {employee?.address
//                       ? `${employee.address.current_address_line1}, ${employee.address.current_city}, ${employee.address.current_state} - ${employee.address.current_pincode}`
//                       : "742 Evergreen Terrace, Springfield"}
//                   </p>
//                 </div>
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Permanent Address
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                     124 Conch Street, Bikini Bottom, Pacific Ocean
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* KYC & BANK SECTION */}

//             {/* IDENTITY & FINANCIAL KYC SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Identity & Financial KYC
//                 </h2>
//               </div>

//               <div className="divide-y divide-slate-100">
//                 {/* NEW: PAN Card Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//                       <CreditCard size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         National Identifier (PAN)
//                       </p>
//                       <p className="text-sm font-bold text-slate-800 tracking-wider">
//                         {employee?.kyc?.pan_number || "ABCDE1234F"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "PAN_Card_Original.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Aadhar Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                       <Fingerprint size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         Aadhar Card
//                       </p>
//                       <p className="text-sm font-bold text-slate-800">
//                         {employee?.kyc?.aadhaar_number || "XXXX-XXXX-8802"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "Aadhar_Card.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Bank Row */}
//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//                       <Landmark size={20} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           Bank Account
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           {employee?.kyc?.account_holder_name || "JP MORGAN"} •
//                           ****
//                           {employee?.kyc?.account_number?.slice(-4) || "8990"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           IFSC / Type
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           {employee?.kyc?.ifsc_code || "JP MORGAN"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         setViewingDoc({ name: "Passbook_Front.pdf" })
//                       }
//                       className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                     >
//                       <Eye size={14} />
//                     </button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                       <Download size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ASSETS & CONTRACTS SECTION */}
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Asset Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <Package size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Inventory Assets
//                   </h2>
//                 </div>
//                 {/* <div className="p-4 space-y-3">
//                   {assets.map((asset, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
//                           {asset.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {asset.name}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {asset.status}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => setViewingDoc(asset)}
//                           className="p-1.5 hover:text-blue-600 transition-colors"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 hover:text-slate-900 transition-colors">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div> */}
//                 {/* <div className="p-4 space-y-3">
//       {employeeAssets.length > 0 ? (
//         employeeAssets.map((asset, i) => (
//           <div
//             key={i}
//             className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">

//                 {asset.asset_category === 'laptop' ? (
//                   <Monitor size={14} />
//                 ) : asset.asset_category === 'mobile' ? (
//                   <Smartphone size={14} />
//                 ) : (
//                   <Package size={14} />
//                 )}
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold text-slate-700">
//                   {asset.asset_name}
//                 </p>
//                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
//                   {asset.asset_category} • SN: {asset.serial_number || 'N/A'}
//                 </p>

//                 {asset.model_number && (
//                   <p className="text-[8px] font-mono text-blue-500 uppercase">
//                     MOD: {asset.model_number}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex gap-1">
//               <button
//                 onClick={() => setViewingDoc(asset)}
//                 className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
//               >
//                 <Eye size={14} />
//               </button>
//               <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
//                 <Download size={14} />
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="py-8 text-center">
//           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Assets Assigned</p>
//         </div>
//       )}
//     </div> */}
//                 <div className="p-4 space-y-3">
//                   {employeeAssets.length > 0 ? (
//                     employeeAssets.map((asset, i) => (
//                       <div
//                         key={i}
//                         className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-all"
//                       >
//                         {/* LEFT SIDE: Icon and Basic Info */}
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
//                             {asset.asset_category === "laptop" ? (
//                               <Monitor size={14} />
//                             ) : asset.asset_category === "mobile" ? (
//                               <Smartphone size={14} />
//                             ) : (
//                               <Package size={14} />
//                             )}
//                           </div>
//                           <div>
//                             <p className="text-[11px] font-bold text-slate-700 leading-tight">
//                               {asset.asset_name}
//                             </p>
//                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
//                               {asset.asset_category} • SN:{" "}
//                               {asset.serial_number || "N/A"}
//                             </p>
//                           </div>
//                         </div>

//                         {/* RIGHT SIDE: Model Number (Replacing Eye/Download) */}
//                         <div className="text-right">
//                           <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mb-0.5">
//                             Model Ref
//                           </p>
//                           <p className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
//                             {asset.model_number || "—"}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="py-8 text-center">
//                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                         No Assets Assigned
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* Employment Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Legal Contracts
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {employmentLetters.map((doc, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                           {doc.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {doc.type}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {doc.name}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex gap-1">
//                         {/* VIEW */}
//                         <button
//                           onClick={() => setViewingDoc(doc)}
//                           className="p-1.5 text-blue-400 hover:text-blue-600"
//                         >
//                           <Eye size={14} />
//                         </button>

//                         {/* DOWNLOAD */}
//                         <a
//                           href={doc.url}
//                           download
//                           target="_blank"
//                           className="p-1.5 text-blue-400 hover:text-blue-600"
//                         >
//                           <Download size={14} />
//                         </a>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             {/* APPOINTMENT & ASSET ASSIGNMENT MODULE */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
//                 <div className="flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Appointment Letter Issuance
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-[10px] font-bold text-blue-600 uppercase">
//                     Draft Mode
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6 space-y-8">
//                 {/* TOP ROW: DATE & CTC */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Confirmation Date
//                     </label>
//                     <div className="relative">
//                       {/* <input
//                         type="date"
//                         defaultValue="2026-01-23"
//                         className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       /> */}
//                       <input
//                         type="date"
//                         value={confirmationDate}
//                         onChange={(e) => setConfirmationDate(e.target.value)}
//                         className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Revised CTC (New Annual Package)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
//                         &#8377;
//                       </span>

//                       {/* <input
//                         type="number"
//                         placeholder="0.00"
//                         className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       /> */}
//                       <input
//                         type="number"
//                         value={newCtc}
//                         onChange={(e) => setNewCtc(e.target.value)}
//                         placeholder="0.00"
//                         className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ASSET ARRAY SECTION */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Hardware Assets Assignment
//                     </label>
//                     <button
//                       onClick={addAssetRow}
//                       className="text-[10px] font-bold text-blue-600 hover:underline"
//                     >
//                       + ADD NEW ASSET
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     {/* Map through assets array here */}
//                     {/* ASSET ARRAY SECTION - DYNAMIC DROPDOWN */}
//                     <div className="space-y-4">
//                       {/* Previous Assigned Assets */}

//                       <div className="space-y-3">
//                         {previousAssets.map((a, i) => (
//                           <div
//                             key={i}
//                             className="group grid grid-cols-12 gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 items-center"
//                           >
//                             {/* Category Icon & Name */}
//                             <div className="col-span-4 flex items-center gap-3">
//                               <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
//                                 {a.category.toLowerCase() === "laptop" ? (
//                                   <Monitor size={16} />
//                                 ) : a.category.toLowerCase() === "sim card" ? (
//                                   <Cpu size={16} />
//                                 ) : (
//                                   <Package size={16} />
//                                 )}
//                               </div>
//                               <div>
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                   Asset Category
//                                 </p>
//                                 <p className="text-xs font-bold text-slate-700">
//                                   {a.category.toUpperCase()}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Model Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Model / Specs
//                               </p>
//                               <p className="text-xs font-semibold text-slate-600 truncate">
//                                 {a.model}
//                               </p>
//                             </div>

//                             {/* Serial Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Identification
//                               </p>
//                               <p className="text-xs font-mono text-slate-500">
//                                 {a.serial}
//                               </p>
//                             </div>

//                             {/* Status Badge */}
//                             <div className="col-span-2 flex justify-end">
//                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
//                                   Assigned
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* New Dynamic Asset Rows */}
//                       <div className="space-y-3">
//                         {assetRows.map((row, index) => (
//                           <div
//                             key={index}
//                             className="grid grid-cols-12 gap-3 p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl items-end"
//                           >
//                             {/* Category */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 Category
//                               </p>
//                               <select
//                                 value={row.category}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "category",
//                                     e.target.value,
//                                   )
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               >
//                                 <option value="laptop">Laptop</option>
//                                 <option value="mobile">Mobile</option>
//                                 <option value="sim_card">SIM Card</option>
//                                 <option value="other">Other</option>
//                               </select>
//                             </div>

//                             {/* Model / Specs (Dynamic Label) */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "Carrier / Plan"
//                                   : "Model / Specs"}
//                               </p>
//                               <input
//                                 value={row.model}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "model",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder={
//                                   row.category === "laptop"
//                                     ? "MacBook Pro M3"
//                                     : row.category === "mobile"
//                                       ? "iPhone 15"
//                                       : row.category === "sim_card"
//                                         ? "Jio Postpaid"
//                                         : "Other asset details"
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Serial / ICCID */}
//                             <div className="col-span-3 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "ICCID / SIM No"
//                                   : "Serial Number"}
//                               </p>
//                               <input
//                                 value={row.serial}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "serial",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder="Unique ID..."
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Remove */}
//                             <div className="col-span-1 flex justify-center pb-1">
//                               <button
//                                 onClick={() => removeAssetRow(index)}
//                                 className="p-2 text-slate-300 hover:text-red-500"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACTION AREA */}
//                 <div className="pt-4 flex gap-3">
//                   <button
//                     onClick={handleSendAppointmentLetter}
//                     disabled={sendingAppointment}
//                     className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     <MailOpen size={16} />
//                     {sendingAppointment
//                       ? "SENDING..."
//                       : "GENERATE & SEND APPOINTMENT LETTER"}
//                   </button>

//                   <button className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
//                     <Eye size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: COMPLIANCE VAULT */}
//           <div className="col-span-12 lg:col-span-4 h-full">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sticky top-24 h-[650px]">
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold">Audit Vault</h3>
//                   <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">
//                     ALL FILES
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={14}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {/* {filteredDocs.map((doc, i) => (
//                   <div
//                     key={i}
//                     className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
//                         <FileText size={16} />
//                       </div>
//                       <div className="overflow-hidden">
//                         <p className="text-xs font-bold text-slate-700 truncate w-32">
//                           {doc.name}
//                         </p>
//                         <p className="text-[9px] text-slate-400 font-bold uppercase">
//                           {doc.status}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setViewingDoc(doc)}
//                         className="p-2 hover:text-blue-600"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:text-slate-900">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 ))} */}

//                 {filteredDocs.map((doc, i) => (
//                   <div
//                     key={i}
//                     className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
//                         <FileText size={16} />
//                       </div>
//                       <div className="overflow-hidden">
//                         <p className="text-xs font-bold text-slate-700 truncate w-40">
//                           {doc.name}
//                         </p>
//                         <p className="text-[9px] text-slate-400 font-bold uppercase">
//                           {doc.type}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       {/* VIEW */}
//                       <button
//                         onClick={() => setViewingDoc(doc)}
//                         className="p-2 hover:text-blue-600"
//                       >
//                         <Eye size={14} />
//                       </button>

//                       {/* DOWNLOAD */}
//                       <a
//                         href={doc.url}
//                         download
//                         target="_blank"
//                         className="p-2 hover:text-slate-900"
//                       >
//                         <Download size={14} />
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* <div className="p-6 border-t border-slate-100">
//                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Full Dossier</button>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
//*************************************************working code phase 1***************************************************************** */

// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import {
//   Download,
//   Eye,
//   FileText,
//   CheckCircle2,
//   Building2,
//   ShieldCheck,
//   Search,
//   CreditCard,
//   Landmark,
//   Fingerprint,
//   History,
//   UserCheck,
//   Globe,
//   X,
//   FileSignature,
//   MailOpen,
//   AlertCircle,
//   ImageIcon,
//   MapPin,
//   Package,
//   Home,
//   Monitor
// } from "lucide-react";
// import { useEffect } from "react";
// import { employeeKycService } from "../../services/employeeKyc.service";

// export default function ReviewPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewingDoc, setViewingDoc] = useState(null);
//   const [confirmationDate, setConfirmationDate] = useState("");
// const [newCtc, setNewCtc] = useState("");
// const [sendingAppointment, setSendingAppointment] = useState(false);

//   const [assetRows, setAssetRows] = useState([
//     {
//       category: "laptop",
//       model: "",
//       serial: "",
//     },
//   ]);
//   const [employee, setEmployee] = useState(null);
// const [loading, setLoading] = useState(true);

// const BASE_FILE_URL = "http://72.62.242.223:8000/";

//   const previousAssets = [
//     { category: "laptop", model: "MacBook Pro M3", serial: "MBP889201" },
//     { category: "mobile", model: "iPhone 15", serial: "IMEI9988123" },
//   ];

//   const handleAssetChange = (index, field, value) => {
//     const updated = [...assetRows];
//     updated[index][field] = value;
//     setAssetRows(updated);
//   };

//   const addAssetRow = () => {
//     setAssetRows([...assetRows, { category: "laptop", model: "", serial: "" }]);
//   };

//   const removeAssetRow = (index) => {
//     setAssetRows(assetRows.filter((_, i) => i !== index));
//   };

//   useEffect(() => {
//   const loadEmployee = async () => {
//     try {
//       const data = await employeeKycService.getFull(3); // dynamic later
//       setEmployee(data);
//     } catch (err) {
//       console.error("API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadEmployee();
// }, []);

// const legalDocs =
//   employee?.documents?.filter((d) =>
//     ["goex_offer_letter", "joining_letter"].includes(d.document_type)
//   ) || [];

// // map backend → UI format (fallback kept)
// const employmentLetters = legalDocs.length
//   ? legalDocs.map((doc) => ({
//       name: doc.document_path.split("/").pop(),
//       type:
//         doc.document_type === "goex_offer_letter"
//           ? "Offer Letter"
//           : "Joining Letter",
//       url:  doc.document_path,
//       date: "Uploaded",
//       icon:
//         doc.document_type === "goex_offer_letter" ? (
//           <MailOpen size={18} />
//         ) : (
//           <FileSignature size={18} />
//         ),
//     }))
//   : [
//       {
//         name: "Offer_Letter_v2.pdf",
//         type: "Offer Letter",
//         date: "Jan 12, 2026",
//         icon: <MailOpen size={18} />,
//       },
//       {
//         name: "Joining_Letter_Signed.pdf",
//         type: "Joining Letter",
//         date: "Jan 20, 2026",
//         icon: <FileSignature size={18} />,
//       },
//     ];

//   const assets = [
//     {
//       name: "MacBook_Pro_M3_Receipt.pdf",
//       type: "Hardware",
//       size: "850 KB",
//       status: "Assigned",
//       icon: <Package size={18} />,
//     },
//     {
//       name: "Corporate_ID_Access.pdf",
//       type: "Security",
//       size: "420 KB",
//       status: "Active",
//       icon: <ShieldCheck size={18} />,
//     },
//   ];

// const handleSendAppointmentLetter = async () => {
//   if (!confirmationDate) {
//     toast.error("Please select confirmation date");
//     return;
//   }

//   try {
//     setSendingAppointment(true);

//     const payload = {
//       confirmation_date: confirmationDate,
//       new_ctc: Number(newCtc || 0),
//     };

//     toast.loading("Sending appointment letter...", { id: "appoint" });

//     const res = await employeeKycService.sendAppointmentLetter(
//       employee?.id || 3,
//       payload
//     );

//     console.log("Appointment Letter Sent:", res);

//     toast.success("Appointment Letter Sent Successfully 🚀", { id: "appoint" });
//   } catch (err) {
//     console.error(err);
//     toast.error(err.message || "Failed to send appointment letter", {
//       id: "appoint",
//     });
//   } finally {
//     setSendingAppointment(false);
//   }
// };

//   // const documents = [
//   //   {
//   //     name: "PAN_Card_Original.pdf",
//   //     type: "PDF",
//   //     size: "1.2 MB",
//   //     status: "Verified",
//   //   },
//   //   {
//   //     name: "Aadhar_Front_Back.png",
//   //     type: "IMG",
//   //     size: "2.4 MB",
//   //     status: "Verified",
//   //   },
//   //   {
//   //     name: "Bank_Statement_Q4.pdf",
//   //     type: "PDF",
//   //     size: "3.1 MB",
//   //     status: "Verified",
//   //   },
//   //   {
//   //     name: "Rental_Agreement.pdf",
//   //     type: "PDF",
//   //     size: "4.5 MB",
//   //     status: "Pending",
//   //   },
//   // ];

//   const allDocs =
//   employee?.documents?.map((doc) => ({
//     id: doc.id,
//     name: doc.document_path.split("/").pop(),
//     type: doc.document_type,
//     status: doc.status,
//     url: doc.document_path,
//   })) || [];

//   const documents = allDocs;

//     const filteredDocs = documents.filter((doc) =>
//     doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const VerifiedBadge = () => (
//     <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
//       <ShieldCheck size={10} /> Verified
//     </span>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 relative">
//       {/* --- DOCUMENT VIEW MODAL --- */}
//       {viewingDoc && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 text-white rounded-xl">
//                   <FileText size={18} />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-sm text-slate-800 leading-none">
//                     {viewingDoc.name}
//                   </h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
//                     Secure Document Preview
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="p-10 bg-slate-100 flex justify-center h-[400px] overflow-y-auto">

//               <div className="p-4 bg-slate-100 h-[450px]">
//   {viewingDoc?.url ? (
//     viewingDoc.url.endsWith(".pdf") ? (
//       <iframe
//         src={viewingDoc.url}
//         className="w-full h-full rounded-xl border"
//         title="Document Preview"
//       />
//     ) : (
//       <img
//         src={viewingDoc.url}
//         className="max-h-full mx-auto rounded-xl shadow-lg"
//         alt="Document Preview"
//       />
//     )
//   ) : (
//     <div className="text-center text-sm font-bold text-slate-500">
//       Preview not available
//     </div>
//   )}
// </div>

//             </div>
//             <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest"
//               >
//                 Dismiss
//               </button>
//               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Download size={14} /> Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TOP NAV */}
//       <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 p-1.5 rounded-lg text-white">
//               <UserCheck size={18} />
//             </div>
//             <span className="font-bold text-sm tracking-tight">
//               ComplianceOS
//             </span>
//           </div>
//           <div className="h-4 w-[1px] bg-slate-200" />
//           <div className="flex items-center gap-2 text-slate-500">
//             <History size={14} />
//             <span className="text-xs font-medium uppercase tracking-wider">
//               Audit Log #8802
//             </span>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
//         {/* HEADER */}

//         <div className="pb-8 border-b border-slate-200">
//   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

//     {/* LEFT SIDE: Profile Info */}
//     <div className="flex items-center gap-6">
//       <div className="relative">
//         <img
//           src="https://i.pravatar.cc/150?img=12"
//           className="h-24 w-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white"
//           alt="User"
//         />
//         <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-slate-50">
//           <CheckCircle2 size={14} />
//         </div>
//       </div>
//       <div>
//         <h1 className="text-3xl font-black text-slate-800 tracking-tight">
//         {employee?.full_name || "Rupesh Sharma"}
//         </h1>
//         <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
//           <Building2 size={14} className="text-blue-500" />
//           {employee?.role || "Lead UX Engineer"} • {employee?.department_name || "Stark Industries"}
//         </p>
//         <div className="flex gap-2 mt-3">
//           <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase border border-blue-100">Full-Time</span>
//           <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-md uppercase border border-slate-200">On-Site</span>
//         </div>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Key Metrics & Actions */}
//     <div className="flex flex-wrap items-center gap-4 lg:gap-8">

//       {/* Metric 1: Joining Date */}
//       <div className="flex flex-col">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joining Date</span>
//         <div className="flex items-center gap-2">
//           <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
//             <History size={14} />
//           </div>
//           <span className="text-sm font-bold text-slate-700">
//             {employee?.joining_date || "Jan 12, 2026"}
//           </span>
//         </div>
//       </div>

//       {/* Vertical Divider (Hidden on mobile) */}
//       <div className="hidden md:block h-10 w-[1px] bg-slate-200" />

//       {/* Metric 2: Salary Context */}
// <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//     Current CTC
//   </span>
//   <div className="flex items-center gap-2">
//     <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
//       <Landmark size={14} />
//     </div>
//     <span className="text-sm font-black text-slate-800 tracking-tight">
//      ₹{employee?.offered_ctc?.toLocaleString() || "12,45,000"}
//     </span>
//     <span className="text-[9px] font-bold text-slate-400 uppercase">per annum</span>
//   </div>
// </div>

//       {/* Action Button */}
//       <div className="lg:ml-4">
//         <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95 group">
//           <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
//           Download Profile
//         </button>
//       </div>

//     </div>
//   </div>
// </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT CONTENT */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             {/* ADDRESS SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <MapPin size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Address Management
//                 </h2>
//               </div>
//               <div className="p-6 grid md:grid-cols-2 gap-6">
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Current Residence
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                 {employee?.address
//     ? `${employee.address.current_address_line1}, ${employee.address.current_city}, ${employee.address.current_state} - ${employee.address.current_pincode}`
//     : "742 Evergreen Terrace, Springfield"}
//                   </p>
//                 </div>
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Permanent Address
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                     124 Conch Street, Bikini Bottom, Pacific Ocean
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* KYC & BANK SECTION */}

//             {/* IDENTITY & FINANCIAL KYC SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Identity & Financial KYC
//                 </h2>
//               </div>

//               <div className="divide-y divide-slate-100">
//                 {/* NEW: PAN Card Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//                       <CreditCard size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         National Identifier (PAN)
//                       </p>
//                       <p className="text-sm font-bold text-slate-800 tracking-wider">
//                        {employee?.kyc?.pan_number || "ABCDE1234F"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "PAN_Card_Original.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Aadhar Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                       <Fingerprint size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         Aadhar Card
//                       </p>
//                       <p className="text-sm font-bold text-slate-800">
//                        {employee?.kyc?.aadhaar_number || "XXXX-XXXX-8802"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "Aadhar_Card.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Bank Row */}
//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//                       <Landmark size={20} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           Bank Account
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                            {employee?.kyc?.account_holder_name || "JP MORGAN"} • ****
//   {employee?.kyc?.account_number?.slice(-4) || "8990"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           IFSC / Type
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           {employee?.kyc?.ifsc_code || "JP MORGAN"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         setViewingDoc({ name: "Passbook_Front.pdf" })
//                       }
//                       className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                     >
//                       <Eye size={14} />
//                     </button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                       <Download size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ASSETS & CONTRACTS SECTION */}
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Asset Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <Package size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Inventory Assets
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {assets.map((asset, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
//                           {asset.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {asset.name}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {asset.status}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => setViewingDoc(asset)}
//                           className="p-1.5 hover:text-blue-600 transition-colors"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 hover:text-slate-900 transition-colors">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Employment Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Legal Contracts
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">

//                   {employmentLetters.map((doc, i) => (
//   <div
//     key={i}
//     className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100"
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//         {doc.icon}
//       </div>
//       <div>
//         <p className="text-[11px] font-bold text-slate-700">{doc.type}</p>
//         <p className="text-[9px] font-bold text-slate-400 uppercase">
//           {doc.name}
//         </p>
//       </div>
//     </div>

//     <div className="flex gap-1">
//       {/* VIEW */}
//       <button
//         onClick={() => setViewingDoc(doc)}
//         className="p-1.5 text-blue-400 hover:text-blue-600"
//       >
//         <Eye size={14} />
//       </button>

//       {/* DOWNLOAD */}
//       <a
//         href={doc.url}
//         download
//         target="_blank"
//         className="p-1.5 text-blue-400 hover:text-blue-600"
//       >
//         <Download size={14} />
//       </a>
//     </div>
//   </div>
// ))}

//                 </div>
//               </div>
//             </div>
//             {/* APPOINTMENT & ASSET ASSIGNMENT MODULE */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
//                 <div className="flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Appointment Letter Issuance
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-[10px] font-bold text-blue-600 uppercase">
//                     Draft Mode
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6 space-y-8">
//                 {/* TOP ROW: DATE & CTC */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Confirmation Date
//                     </label>
//                     <div className="relative">
//                       {/* <input
//                         type="date"
//                         defaultValue="2026-01-23"
//                         className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       /> */}
//                       <input
//   type="date"
//   value={confirmationDate}
//   onChange={(e) => setConfirmationDate(e.target.value)}
//   className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
// />

//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Revised CTC (New Annual Package)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
//                         &#8377;
//                       </span>

//                       {/* <input
//                         type="number"
//                         placeholder="0.00"
//                         className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       /> */}
//                       <input
//   type="number"
//   value={newCtc}
//   onChange={(e) => setNewCtc(e.target.value)}
//   placeholder="0.00"
//   className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
// />

//                     </div>
//                   </div>
//                 </div>

//                 {/* ASSET ARRAY SECTION */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Hardware Assets Assignment
//                     </label>
//                     <button
//                       onClick={addAssetRow}
//                       className="text-[10px] font-bold text-blue-600 hover:underline"
//                     >
//                       + ADD NEW ASSET
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     {/* Map through assets array here */}
//                     {/* ASSET ARRAY SECTION - DYNAMIC DROPDOWN */}
//                     <div className="space-y-4">
//                       {/* Previous Assigned Assets */}

//                       <div className="space-y-3">
//                         {previousAssets.map((a, i) => (
//                           <div
//                             key={i}
//                             className="group grid grid-cols-12 gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 items-center"
//                           >
//                             {/* Category Icon & Name */}
//                             <div className="col-span-4 flex items-center gap-3">
//                               <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
//                                 {a.category.toLowerCase() === "laptop" ? (
//                                   <Monitor size={16} />
//                                 ) : a.category.toLowerCase() === "sim card" ? (
//                                   <Cpu size={16} />
//                                 ) : (
//                                   <Package size={16} />
//                                 )}
//                               </div>
//                               <div>
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                   Asset Category
//                                 </p>
//                                 <p className="text-xs font-bold text-slate-700">
//                                   {a.category.toUpperCase()}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Model Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Model / Specs
//                               </p>
//                               <p className="text-xs font-semibold text-slate-600 truncate">
//                                 {a.model}
//                               </p>
//                             </div>

//                             {/* Serial Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Identification
//                               </p>
//                               <p className="text-xs font-mono text-slate-500">
//                                 {a.serial}
//                               </p>
//                             </div>

//                             {/* Status Badge */}
//                             <div className="col-span-2 flex justify-end">
//                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
//                                   Assigned
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* New Dynamic Asset Rows */}
//                       <div className="space-y-3">
//                         {assetRows.map((row, index) => (
//                           <div
//                             key={index}
//                             className="grid grid-cols-12 gap-3 p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl items-end"
//                           >
//                             {/* Category */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 Category
//                               </p>
//                               <select
//                                 value={row.category}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "category",
//                                     e.target.value,
//                                   )
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               >
//                                 <option value="laptop">Laptop</option>
//                                 <option value="mobile">Mobile</option>
//                                 <option value="sim_card">SIM Card</option>
//                                 <option value="other">Other</option>
//                               </select>
//                             </div>

//                             {/* Model / Specs (Dynamic Label) */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "Carrier / Plan"
//                                   : "Model / Specs"}
//                               </p>
//                               <input
//                                 value={row.model}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "model",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder={
//                                   row.category === "laptop"
//                                     ? "MacBook Pro M3"
//                                     : row.category === "mobile"
//                                       ? "iPhone 15"
//                                       : row.category === "sim_card"
//                                         ? "Jio Postpaid"
//                                         : "Other asset details"
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Serial / ICCID */}
//                             <div className="col-span-3 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "ICCID / SIM No"
//                                   : "Serial Number"}
//                               </p>
//                               <input
//                                 value={row.serial}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "serial",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder="Unique ID..."
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Remove */}
//                             <div className="col-span-1 flex justify-center pb-1">
//                               <button
//                                 onClick={() => removeAssetRow(index)}
//                                 className="p-2 text-slate-300 hover:text-red-500"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACTION AREA */}
//                 <div className="pt-4 flex gap-3">
//                   <button
//   onClick={handleSendAppointmentLetter}
//   disabled={sendingAppointment}
//   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
// >
//   <MailOpen size={16} />
//   {sendingAppointment ? "SENDING..." : "GENERATE & SEND APPOINTMENT LETTER"}
// </button>

//                   <button className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
//                     <Eye size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: COMPLIANCE VAULT */}
//           <div className="col-span-12 lg:col-span-4 h-full">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sticky top-24 h-[650px]">
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold">Audit Vault</h3>
//                   <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">
//                     ALL FILES
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={14}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {/* {filteredDocs.map((doc, i) => (
//                   <div
//                     key={i}
//                     className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
//                         <FileText size={16} />
//                       </div>
//                       <div className="overflow-hidden">
//                         <p className="text-xs font-bold text-slate-700 truncate w-32">
//                           {doc.name}
//                         </p>
//                         <p className="text-[9px] text-slate-400 font-bold uppercase">
//                           {doc.status}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setViewingDoc(doc)}
//                         className="p-2 hover:text-blue-600"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:text-slate-900">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 ))} */}

//                 {filteredDocs.map((doc, i) => (
//   <div
//     key={i}
//     className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
//         <FileText size={16} />
//       </div>
//       <div className="overflow-hidden">
//         <p className="text-xs font-bold text-slate-700 truncate w-40">
//           {doc.name}
//         </p>
//         <p className="text-[9px] text-slate-400 font-bold uppercase">
//           {doc.type}
//         </p>
//       </div>
//     </div>

//     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//       {/* VIEW */}
//       <button
//         onClick={() => setViewingDoc(doc)}
//         className="p-2 hover:text-blue-600"
//       >
//         <Eye size={14} />
//       </button>

//       {/* DOWNLOAD */}
//       <a
//         href={doc.url}
//         download
//         target="_blank"
//         className="p-2 hover:text-slate-900"
//       >
//         <Download size={14} />
//       </a>
//     </div>
//   </div>
// ))}

//               </div>
//               {/* <div className="p-6 border-t border-slate-100">
//                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Full Dossier</button>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
//********************************************working code phase 1 27/01/26*********************************************** */
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import {
//   Download,
//   Eye,
//   FileText,
//   CheckCircle2,
//   Building2,
//   ShieldCheck,
//   Search,
//   CreditCard,
//   Landmark,
//   Fingerprint,
//   History,
//   UserCheck,
//   Globe,
//   X,
//   FileSignature,
//   MailOpen,
//   AlertCircle,
//   ImageIcon,
//   MapPin,
//   Package,
//   Home,
//   Monitor
// } from "lucide-react";
// import { useEffect } from "react";
// import { employeeKycService } from "../../services/employeeKyc.service";

// export default function ReviewPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewingDoc, setViewingDoc] = useState(null);
//   const [confirmationDate, setConfirmationDate] = useState("");
// const [newCtc, setNewCtc] = useState("");
// const [sendingAppointment, setSendingAppointment] = useState(false);

//   const [assetRows, setAssetRows] = useState([
//     {
//       category: "laptop",
//       model: "",
//       serial: "",
//     },
//   ]);
//   const [employee, setEmployee] = useState(null);
// const [loading, setLoading] = useState(true);

// const BASE_FILE_URL = "http://72.62.242.223:8000/";

//   const previousAssets = [
//     { category: "laptop", model: "MacBook Pro M3", serial: "MBP889201" },
//     { category: "mobile", model: "iPhone 15", serial: "IMEI9988123" },
//   ];

//   const handleAssetChange = (index, field, value) => {
//     const updated = [...assetRows];
//     updated[index][field] = value;
//     setAssetRows(updated);
//   };

//   const addAssetRow = () => {
//     setAssetRows([...assetRows, { category: "laptop", model: "", serial: "" }]);
//   };

//   const removeAssetRow = (index) => {
//     setAssetRows(assetRows.filter((_, i) => i !== index));
//   };

//   useEffect(() => {
//   const loadEmployee = async () => {
//     try {
//       const data = await employeeKycService.getFull(3); // dynamic later
//       setEmployee(data);
//     } catch (err) {
//       console.error("API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadEmployee();
// }, []);

// const legalDocs =
//   employee?.documents?.filter((d) =>
//     ["goex_offer_letter", "joining_letter"].includes(d.document_type)
//   ) || [];

//   // Updated Data Structures
//   // const employmentLetters = [
//   //   {
//   //     name: "Offer_Letter_v2.pdf",
//   //     type: "Offer Letter",
//   //     size: "1.4 MB",
//   //     date: "Jan 12, 2026",
//   //     icon: <MailOpen size={18} />,
//   //   },
//   //   {
//   //     name: "Joining_Letter_Signed.pdf",
//   //     type: "Joining Letter",
//   //     size: "1.1 MB",
//   //     date: "Jan 20, 2026",
//   //     icon: <FileSignature size={18} />,
//   //   },
//   // ];

// // map backend → UI format (fallback kept)
// const employmentLetters = legalDocs.length
//   ? legalDocs.map((doc) => ({
//       name: doc.document_path.split("/").pop(),
//       type:
//         doc.document_type === "goex_offer_letter"
//           ? "Offer Letter"
//           : "Joining Letter",
//       url: BASE_FILE_URL + doc.document_path,
//       date: "Uploaded",
//       icon:
//         doc.document_type === "goex_offer_letter" ? (
//           <MailOpen size={18} />
//         ) : (
//           <FileSignature size={18} />
//         ),
//     }))
//   : [
//       {
//         name: "Offer_Letter_v2.pdf",
//         type: "Offer Letter",
//         date: "Jan 12, 2026",
//         icon: <MailOpen size={18} />,
//       },
//       {
//         name: "Joining_Letter_Signed.pdf",
//         type: "Joining Letter",
//         date: "Jan 20, 2026",
//         icon: <FileSignature size={18} />,
//       },
//     ];

//   const assets = [
//     {
//       name: "MacBook_Pro_M3_Receipt.pdf",
//       type: "Hardware",
//       size: "850 KB",
//       status: "Assigned",
//       icon: <Package size={18} />,
//     },
//     {
//       name: "Corporate_ID_Access.pdf",
//       type: "Security",
//       size: "420 KB",
//       status: "Active",
//       icon: <ShieldCheck size={18} />,
//     },
//   ];

// //   const handleSendAppointmentLetter = async () => {
// //   if (!confirmationDate) {
// //     alert("Please select confirmation date");
// //     return;
// //   }

// //   try {
// //     setSendingAppointment(true);

// //     const payload = {
// //       confirmation_date: confirmationDate,
// //       new_ctc: Number(newCtc || 0),
// //     };

// //     const res = await employeeKycService.sendAppointmentLetter(
// //       employee?.id || 3, // dynamic employee id
// //       payload
// //     );

// //     console.log("Appointment Letter Sent:", res);
// //     alert("Appointment Letter Sent Successfully 🚀");
// //   } catch (err) {
// //     console.error(err);
// //     alert(err.message);
// //   } finally {
// //     setSendingAppointment(false);
// //   }
// // };

// const handleSendAppointmentLetter = async () => {
//   if (!confirmationDate) {
//     toast.error("Please select confirmation date");
//     return;
//   }

//   try {
//     setSendingAppointment(true);

//     const payload = {
//       confirmation_date: confirmationDate,
//       new_ctc: Number(newCtc || 0),
//     };

//     toast.loading("Sending appointment letter...", { id: "appoint" });

//     const res = await employeeKycService.sendAppointmentLetter(
//       employee?.id || 3,
//       payload
//     );

//     console.log("Appointment Letter Sent:", res);

//     toast.success("Appointment Letter Sent Successfully 🚀", { id: "appoint" });
//   } catch (err) {
//     console.error(err);
//     toast.error(err.message || "Failed to send appointment letter", {
//       id: "appoint",
//     });
//   } finally {
//     setSendingAppointment(false);
//   }
// };

//   const documents = [
//     {
//       name: "PAN_Card_Original.pdf",
//       type: "PDF",
//       size: "1.2 MB",
//       status: "Verified",
//     },
//     {
//       name: "Aadhar_Front_Back.png",
//       type: "IMG",
//       size: "2.4 MB",
//       status: "Verified",
//     },
//     {
//       name: "Bank_Statement_Q4.pdf",
//       type: "PDF",
//       size: "3.1 MB",
//       status: "Verified",
//     },
//     {
//       name: "Rental_Agreement.pdf",
//       type: "PDF",
//       size: "4.5 MB",
//       status: "Pending",
//     },
//   ];

//   const filteredDocs = documents.filter((doc) =>
//     doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const VerifiedBadge = () => (
//     <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
//       <ShieldCheck size={10} /> Verified
//     </span>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 relative">
//       {/* --- DOCUMENT VIEW MODAL --- */}
//       {viewingDoc && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 text-white rounded-xl">
//                   <FileText size={18} />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-sm text-slate-800 leading-none">
//                     {viewingDoc.name}
//                   </h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
//                     Secure Document Preview
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="p-10 bg-slate-100 flex justify-center h-[400px] overflow-y-auto">
//               {/* <div className="w-full max-w-md bg-white shadow-lg rounded-sm border border-slate-200 p-8 flex flex-col gap-4">
//                 <div className="h-4 w-1/4 bg-slate-100 rounded" />
//                 <div className="h-2 w-full bg-slate-50 rounded" />
//                 <div className="h-2 w-full bg-slate-50 rounded" />
//                 <div className="h-2 w-3/4 bg-slate-50 rounded" />
//               </div> */}
//               <div className="p-4 bg-slate-100 h-[450px]">
//   {viewingDoc?.url ? (
//     viewingDoc.url.endsWith(".pdf") ? (
//       <iframe
//         src={viewingDoc.url}
//         className="w-full h-full rounded-xl border"
//         title="Document Preview"
//       />
//     ) : (
//       <img
//         src={viewingDoc.url}
//         className="max-h-full mx-auto rounded-xl shadow-lg"
//         alt="Document Preview"
//       />
//     )
//   ) : (
//     <div className="text-center text-sm font-bold text-slate-500">
//       Preview not available
//     </div>
//   )}
// </div>

//             </div>
//             <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest"
//               >
//                 Dismiss
//               </button>
//               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Download size={14} /> Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TOP NAV */}
//       <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 p-1.5 rounded-lg text-white">
//               <UserCheck size={18} />
//             </div>
//             <span className="font-bold text-sm tracking-tight">
//               ComplianceOS
//             </span>
//           </div>
//           <div className="h-4 w-[1px] bg-slate-200" />
//           <div className="flex items-center gap-2 text-slate-500">
//             <History size={14} />
//             <span className="text-xs font-medium uppercase tracking-wider">
//               Audit Log #8802
//             </span>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
//         {/* HEADER */}
//         {/* <div className="pb-6 border-b border-slate-200">
//           <div className="flex items-center gap-6">
//             <img
//               src="https://i.pravatar.cc/150?img=12"
//               className="h-20 w-20 rounded-3xl object-cover shadow-xl border-4 border-white"
//               alt="User"
//             />
//             <div>
//               <h1 className="text-3xl font-black text-slate-800">
//                 Johnathan Doe
//               </h1>
//               <p className="text-slate-500 font-medium flex items-center gap-2">
//                 <Building2 size={16} /> Lead UX Engineer • Stark Industries
//               </p>
//             </div>
//           </div>
//         </div> */}
//         <div className="pb-8 border-b border-slate-200">
//   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

//     {/* LEFT SIDE: Profile Info */}
//     <div className="flex items-center gap-6">
//       <div className="relative">
//         <img
//           src="https://i.pravatar.cc/150?img=12"
//           className="h-24 w-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white"
//           alt="User"
//         />
//         <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-slate-50">
//           <CheckCircle2 size={14} />
//         </div>
//       </div>
//       <div>
//         <h1 className="text-3xl font-black text-slate-800 tracking-tight">
//         {employee?.full_name || "Rupesh Sharma"}
//         </h1>
//         <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
//           <Building2 size={14} className="text-blue-500" />
//           {employee?.role || "Lead UX Engineer"} • {employee?.department_name || "Stark Industries"}
//         </p>
//         <div className="flex gap-2 mt-3">
//           <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase border border-blue-100">Full-Time</span>
//           <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-md uppercase border border-slate-200">On-Site</span>
//         </div>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Key Metrics & Actions */}
//     <div className="flex flex-wrap items-center gap-4 lg:gap-8">

//       {/* Metric 1: Joining Date */}
//       <div className="flex flex-col">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joining Date</span>
//         <div className="flex items-center gap-2">
//           <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
//             <History size={14} />
//           </div>
//           <span className="text-sm font-bold text-slate-700">
//             {employee?.joining_date || "Jan 12, 2026"}
//           </span>
//         </div>
//       </div>

//       {/* Vertical Divider (Hidden on mobile) */}
//       <div className="hidden md:block h-10 w-[1px] bg-slate-200" />

//       {/* Metric 2: Salary Context */}
//       {/* Metric 2: Salary Context */}
// <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//     Current CTC
//   </span>
//   <div className="flex items-center gap-2">
//     <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
//       <Landmark size={14} />
//     </div>
//     <span className="text-sm font-black text-slate-800 tracking-tight">
//      ₹{employee?.offered_ctc?.toLocaleString() || "12,45,000"}
//     </span>
//     <span className="text-[9px] font-bold text-slate-400 uppercase">per annum</span>
//   </div>
// </div>

//       {/* Action Button */}
//       <div className="lg:ml-4">
//         <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95 group">
//           <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
//           Download Profile
//         </button>
//       </div>

//     </div>
//   </div>
// </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT CONTENT */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             {/* ADDRESS SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <MapPin size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Address Management
//                 </h2>
//               </div>
//               <div className="p-6 grid md:grid-cols-2 gap-6">
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Current Residence
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                 {employee?.address
//     ? `${employee.address.current_address_line1}, ${employee.address.current_city}, ${employee.address.current_state} - ${employee.address.current_pincode}`
//     : "742 Evergreen Terrace, Springfield"}
//                   </p>
//                 </div>
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Permanent Address
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                     124 Conch Street, Bikini Bottom, Pacific Ocean
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* KYC & BANK SECTION */}
//             {/* <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity & Financial KYC</h2>
//               </div>
//               <div className="divide-y divide-slate-100">

//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Fingerprint size={20} /></div>
//                     <div><p className="text-[10px] font-black text-slate-400 uppercase">Aadhar Card</p><p className="text-sm font-bold text-slate-800">XXXX-XXXX-8802</p></div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button onClick={() => setViewingDoc({name: 'Aadhar_Card.pdf'})} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200"><Eye size={14} /></button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200"><Download size={14} /></button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Landmark size={20} /></div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Bank Account</p><p className="text-[11px] font-bold text-slate-800">JP MORGAN • ****8990</p></div>
//                       <div><p className="text-[9px] font-black text-slate-400 uppercase">IFSC / Type</p><p className="text-[11px] font-bold text-slate-800">CHAS00001 • SAVINGS</p></div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setViewingDoc({name: 'Passbook_Front.pdf'})} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200"><Eye size={14} /></button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200"><Download size={14} /></button>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//             {/* IDENTITY & FINANCIAL KYC SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Identity & Financial KYC
//                 </h2>
//               </div>

//               <div className="divide-y divide-slate-100">
//                 {/* NEW: PAN Card Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//                       <CreditCard size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         National Identifier (PAN)
//                       </p>
//                       <p className="text-sm font-bold text-slate-800 tracking-wider">
//                        {employee?.kyc?.pan_number || "ABCDE1234F"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "PAN_Card_Original.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Aadhar Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                       <Fingerprint size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         Aadhar Card
//                       </p>
//                       <p className="text-sm font-bold text-slate-800">
//                        {employee?.kyc?.aadhaar_number || "XXXX-XXXX-8802"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "Aadhar_Card.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Bank Row */}
//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//                       <Landmark size={20} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           Bank Account
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                            {employee?.kyc?.account_holder_name || "JP MORGAN"} • ****
//   {employee?.kyc?.account_number?.slice(-4) || "8990"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           IFSC / Type
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           {employee?.kyc?.ifsc_code || "JP MORGAN"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         setViewingDoc({ name: "Passbook_Front.pdf" })
//                       }
//                       className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                     >
//                       <Eye size={14} />
//                     </button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                       <Download size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ASSETS & CONTRACTS SECTION */}
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Asset Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <Package size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Inventory Assets
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {assets.map((asset, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
//                           {asset.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {asset.name}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {asset.status}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => setViewingDoc(asset)}
//                           className="p-1.5 hover:text-blue-600 transition-colors"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 hover:text-slate-900 transition-colors">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Employment Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Legal Contracts
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {/* {employmentLetters.map((doc, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                           {doc.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {doc.type}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {doc.date}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => setViewingDoc(doc)}
//                           className="p-1.5 text-blue-400 hover:text-blue-600"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 text-blue-400 hover:text-blue-600">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))} */}
//                   {employmentLetters.map((doc, i) => (
//   <div
//     key={i}
//     className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100"
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//         {doc.icon}
//       </div>
//       <div>
//         <p className="text-[11px] font-bold text-slate-700">{doc.type}</p>
//         <p className="text-[9px] font-bold text-slate-400 uppercase">
//           {doc.name}
//         </p>
//       </div>
//     </div>

//     <div className="flex gap-1">
//       {/* VIEW */}
//       <button
//         onClick={() => setViewingDoc(doc)}
//         className="p-1.5 text-blue-400 hover:text-blue-600"
//       >
//         <Eye size={14} />
//       </button>

//       {/* DOWNLOAD */}
//       <a
//         href={doc.url}
//         download
//         target="_blank"
//         className="p-1.5 text-blue-400 hover:text-blue-600"
//       >
//         <Download size={14} />
//       </a>
//     </div>
//   </div>
// ))}

//                 </div>
//               </div>
//             </div>
//             {/* APPOINTMENT & ASSET ASSIGNMENT MODULE */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
//                 <div className="flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Appointment Letter Issuance
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-[10px] font-bold text-blue-600 uppercase">
//                     Draft Mode
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6 space-y-8">
//                 {/* TOP ROW: DATE & CTC */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Confirmation Date
//                     </label>
//                     <div className="relative">
//                       {/* <input
//                         type="date"
//                         defaultValue="2026-01-23"
//                         className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       /> */}
//                       <input
//   type="date"
//   value={confirmationDate}
//   onChange={(e) => setConfirmationDate(e.target.value)}
//   className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
// />

//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Revised CTC (New Annual Package)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
//                         &#8377;
//                       </span>

//                       {/* <input
//                         type="number"
//                         placeholder="0.00"
//                         className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       /> */}
//                       <input
//   type="number"
//   value={newCtc}
//   onChange={(e) => setNewCtc(e.target.value)}
//   placeholder="0.00"
//   className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
// />

//                     </div>
//                   </div>
//                 </div>

//                 {/* ASSET ARRAY SECTION */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Hardware Assets Assignment
//                     </label>
//                     <button
//                       onClick={addAssetRow}
//                       className="text-[10px] font-bold text-blue-600 hover:underline"
//                     >
//                       + ADD NEW ASSET
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     {/* Map through assets array here */}
//                     {/* ASSET ARRAY SECTION - DYNAMIC DROPDOWN */}
//                     <div className="space-y-4">
//                       {/* Previous Assigned Assets */}
//                       {/* <div className="space-y-3">
//                         {previousAssets.map((a, i) => (
//                           <div
//                             key={i}
//                             className="grid grid-cols-12 gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl"
//                           >
//                             <div className="col-span-4 text-xs font-bold">
//                               {a.category.toUpperCase()}
//                             </div>
//                             <div className="col-span-4 text-xs">{a.model}</div>
//                             <div className="col-span-3 text-xs">{a.serial}</div>
//                             <div className="col-span-1 text-green-600 text-xs font-bold">
//                               ASSIGNED
//                             </div>
//                           </div>
//                         ))}
//                       </div> */}

//                       <div className="space-y-3">
//                         {previousAssets.map((a, i) => (
//                           <div
//                             key={i}
//                             className="group grid grid-cols-12 gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 items-center"
//                           >
//                             {/* Category Icon & Name */}
//                             <div className="col-span-4 flex items-center gap-3">
//                               <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
//                                 {a.category.toLowerCase() === "laptop" ? (
//                                   <Monitor size={16} />
//                                 ) : a.category.toLowerCase() === "sim card" ? (
//                                   <Cpu size={16} />
//                                 ) : (
//                                   <Package size={16} />
//                                 )}
//                               </div>
//                               <div>
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                   Asset Category
//                                 </p>
//                                 <p className="text-xs font-bold text-slate-700">
//                                   {a.category.toUpperCase()}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Model Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Model / Specs
//                               </p>
//                               <p className="text-xs font-semibold text-slate-600 truncate">
//                                 {a.model}
//                               </p>
//                             </div>

//                             {/* Serial Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Identification
//                               </p>
//                               <p className="text-xs font-mono text-slate-500">
//                                 {a.serial}
//                               </p>
//                             </div>

//                             {/* Status Badge */}
//                             <div className="col-span-2 flex justify-end">
//                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
//                                   Assigned
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* New Dynamic Asset Rows */}
//                       <div className="space-y-3">
//                         {assetRows.map((row, index) => (
//                           <div
//                             key={index}
//                             className="grid grid-cols-12 gap-3 p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl items-end"
//                           >
//                             {/* Category */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 Category
//                               </p>
//                               <select
//                                 value={row.category}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "category",
//                                     e.target.value,
//                                   )
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               >
//                                 <option value="laptop">Laptop</option>
//                                 <option value="mobile">Mobile</option>
//                                 <option value="sim_card">SIM Card</option>
//                                 <option value="other">Other</option>
//                               </select>
//                             </div>

//                             {/* Model / Specs (Dynamic Label) */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "Carrier / Plan"
//                                   : "Model / Specs"}
//                               </p>
//                               <input
//                                 value={row.model}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "model",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder={
//                                   row.category === "laptop"
//                                     ? "MacBook Pro M3"
//                                     : row.category === "mobile"
//                                       ? "iPhone 15"
//                                       : row.category === "sim_card"
//                                         ? "Jio Postpaid"
//                                         : "Other asset details"
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Serial / ICCID */}
//                             <div className="col-span-3 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "ICCID / SIM No"
//                                   : "Serial Number"}
//                               </p>
//                               <input
//                                 value={row.serial}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "serial",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder="Unique ID..."
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Remove */}
//                             <div className="col-span-1 flex justify-center pb-1">
//                               <button
//                                 onClick={() => removeAssetRow(index)}
//                                 className="p-2 text-slate-300 hover:text-red-500"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACTION AREA */}
//                 <div className="pt-4 flex gap-3">
//                   {/* <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                     <MailOpen size={16} /> GENERATE & SEND APPOINTMENT LETTER
//                   </button> */}
//                   <button
//   onClick={handleSendAppointmentLetter}
//   disabled={sendingAppointment}
//   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
// >
//   <MailOpen size={16} />
//   {sendingAppointment ? "SENDING..." : "GENERATE & SEND APPOINTMENT LETTER"}
// </button>

//                   <button className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
//                     <Eye size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: COMPLIANCE VAULT */}
//           <div className="col-span-12 lg:col-span-4 h-full">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sticky top-24 h-[650px]">
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold">Audit Vault</h3>
//                   <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">
//                     ALL FILES
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={14}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {filteredDocs.map((doc, i) => (
//                   <div
//                     key={i}
//                     className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
//                         <FileText size={16} />
//                       </div>
//                       <div className="overflow-hidden">
//                         <p className="text-xs font-bold text-slate-700 truncate w-32">
//                           {doc.name}
//                         </p>
//                         <p className="text-[9px] text-slate-400 font-bold uppercase">
//                           {doc.status}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setViewingDoc(doc)}
//                         className="p-2 hover:text-blue-600"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:text-slate-900">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* <div className="p-6 border-t border-slate-100">
//                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Full Dossier</button>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

//******************************working code phase 1****************************************************** */
// import React, { useState } from "react";
// import {
//   Download,
//   Eye,
//   FileText,
//   CheckCircle2,
//   Building2,
//   ShieldCheck,
//   Search,
//   CreditCard,
//   Landmark,
//   Fingerprint,
//   History,
//   UserCheck,
//   Globe,
//   X,
//   FileSignature,
//   MailOpen,
//   AlertCircle,
//   ImageIcon,
//   MapPin,
//   Package,
//   Home,
//   Monitor
// } from "lucide-react";

// export default function ReviewPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewingDoc, setViewingDoc] = useState(null);
//   const [assetRows, setAssetRows] = useState([
//     {
//       category: "laptop",
//       model: "",
//       serial: "",
//     },
//   ]);

//   const previousAssets = [
//     { category: "laptop", model: "MacBook Pro M3", serial: "MBP889201" },
//     { category: "mobile", model: "iPhone 15", serial: "IMEI9988123" },
//   ];

//   const handleAssetChange = (index, field, value) => {
//     const updated = [...assetRows];
//     updated[index][field] = value;
//     setAssetRows(updated);
//   };

//   const addAssetRow = () => {
//     setAssetRows([...assetRows, { category: "laptop", model: "", serial: "" }]);
//   };

//   const removeAssetRow = (index) => {
//     setAssetRows(assetRows.filter((_, i) => i !== index));
//   };

//   // Updated Data Structures
//   const employmentLetters = [
//     {
//       name: "Offer_Letter_v2.pdf",
//       type: "Offer Letter",
//       size: "1.4 MB",
//       date: "Jan 12, 2026",
//       icon: <MailOpen size={18} />,
//     },
//     {
//       name: "Joining_Letter_Signed.pdf",
//       type: "Joining Letter",
//       size: "1.1 MB",
//       date: "Jan 20, 2026",
//       icon: <FileSignature size={18} />,
//     },
//   ];

//   const assets = [
//     {
//       name: "MacBook_Pro_M3_Receipt.pdf",
//       type: "Hardware",
//       size: "850 KB",
//       status: "Assigned",
//       icon: <Package size={18} />,
//     },
//     {
//       name: "Corporate_ID_Access.pdf",
//       type: "Security",
//       size: "420 KB",
//       status: "Active",
//       icon: <ShieldCheck size={18} />,
//     },
//   ];

//   const documents = [
//     {
//       name: "PAN_Card_Original.pdf",
//       type: "PDF",
//       size: "1.2 MB",
//       status: "Verified",
//     },
//     {
//       name: "Aadhar_Front_Back.png",
//       type: "IMG",
//       size: "2.4 MB",
//       status: "Verified",
//     },
//     {
//       name: "Bank_Statement_Q4.pdf",
//       type: "PDF",
//       size: "3.1 MB",
//       status: "Verified",
//     },
//     {
//       name: "Rental_Agreement.pdf",
//       type: "PDF",
//       size: "4.5 MB",
//       status: "Pending",
//     },
//   ];

//   const filteredDocs = documents.filter((doc) =>
//     doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const VerifiedBadge = () => (
//     <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
//       <ShieldCheck size={10} /> Verified
//     </span>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 relative">
//       {/* --- DOCUMENT VIEW MODAL --- */}
//       {viewingDoc && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 text-white rounded-xl">
//                   <FileText size={18} />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-sm text-slate-800 leading-none">
//                     {viewingDoc.name}
//                   </h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
//                     Secure Document Preview
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="p-2 hover:bg-slate-200 rounded-full transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="p-10 bg-slate-100 flex justify-center h-[400px] overflow-y-auto">
//               <div className="w-full max-w-md bg-white shadow-lg rounded-sm border border-slate-200 p-8 flex flex-col gap-4">
//                 <div className="h-4 w-1/4 bg-slate-100 rounded" />
//                 <div className="h-2 w-full bg-slate-50 rounded" />
//                 <div className="h-2 w-full bg-slate-50 rounded" />
//                 <div className="h-2 w-3/4 bg-slate-50 rounded" />
//               </div>
//             </div>
//             <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
//               <button
//                 onClick={() => setViewingDoc(null)}
//                 className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest"
//               >
//                 Dismiss
//               </button>
//               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Download size={14} /> Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TOP NAV */}
//       <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 p-1.5 rounded-lg text-white">
//               <UserCheck size={18} />
//             </div>
//             <span className="font-bold text-sm tracking-tight">
//               ComplianceOS
//             </span>
//           </div>
//           <div className="h-4 w-[1px] bg-slate-200" />
//           <div className="flex items-center gap-2 text-slate-500">
//             <History size={14} />
//             <span className="text-xs font-medium uppercase tracking-wider">
//               Audit Log #8802
//             </span>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
//         {/* HEADER */}
//         {/* <div className="pb-6 border-b border-slate-200">
//           <div className="flex items-center gap-6">
//             <img
//               src="https://i.pravatar.cc/150?img=12"
//               className="h-20 w-20 rounded-3xl object-cover shadow-xl border-4 border-white"
//               alt="User"
//             />
//             <div>
//               <h1 className="text-3xl font-black text-slate-800">
//                 Johnathan Doe
//               </h1>
//               <p className="text-slate-500 font-medium flex items-center gap-2">
//                 <Building2 size={16} /> Lead UX Engineer • Stark Industries
//               </p>
//             </div>
//           </div>
//         </div> */}
//         <div className="pb-8 border-b border-slate-200">
//   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

//     {/* LEFT SIDE: Profile Info */}
//     <div className="flex items-center gap-6">
//       <div className="relative">
//         <img
//           src="https://i.pravatar.cc/150?img=12"
//           className="h-24 w-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white"
//           alt="User"
//         />
//         <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-slate-50">
//           <CheckCircle2 size={14} />
//         </div>
//       </div>
//       <div>
//         <h1 className="text-3xl font-black text-slate-800 tracking-tight">
//           Rupesh Sharma
//         </h1>
//         <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
//           <Building2 size={14} className="text-blue-500" /> Lead UX Engineer • Stark Industries
//         </p>
//         <div className="flex gap-2 mt-3">
//           <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase border border-blue-100">Full-Time</span>
//           <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-md uppercase border border-slate-200">On-Site</span>
//         </div>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Key Metrics & Actions */}
//     <div className="flex flex-wrap items-center gap-4 lg:gap-8">

//       {/* Metric 1: Joining Date */}
//       <div className="flex flex-col">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joining Date</span>
//         <div className="flex items-center gap-2">
//           <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
//             <History size={14} />
//           </div>
//           <span className="text-sm font-bold text-slate-700">Jan 12, 2026</span>
//         </div>
//       </div>

//       {/* Vertical Divider (Hidden on mobile) */}
//       <div className="hidden md:block h-10 w-[1px] bg-slate-200" />

//       {/* Metric 2: Salary Context */}
//       {/* Metric 2: Salary Context */}
// <div className="flex flex-col">
//   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//     Previous CTC
//   </span>
//   <div className="flex items-center gap-2">
//     <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
//       <Landmark size={14} />
//     </div>
//     <span className="text-sm font-black text-slate-800 tracking-tight">
//       ₹12,45,000
//     </span>
//     <span className="text-[9px] font-bold text-slate-400 uppercase">per annum</span>
//   </div>
// </div>

//       {/* Action Button */}
//       <div className="lg:ml-4">
//         <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95 group">
//           <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
//           Download Profile
//         </button>
//       </div>

//     </div>
//   </div>
// </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* LEFT CONTENT */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             {/* ADDRESS SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <MapPin size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Address Management
//                 </h2>
//               </div>
//               <div className="p-6 grid md:grid-cols-2 gap-6">
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Current Residence
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                     742 Evergreen Terrace, Springfield, OR 97477
//                   </p>
//                 </div>
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-[9px] font-black text-slate-400 uppercase">
//                       Permanent Address
//                     </span>
//                     <VerifiedBadge />
//                   </div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">
//                     124 Conch Street, Bikini Bottom, Pacific Ocean
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* KYC & BANK SECTION */}
//             {/* <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity & Financial KYC</h2>
//               </div>
//               <div className="divide-y divide-slate-100">

//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Fingerprint size={20} /></div>
//                     <div><p className="text-[10px] font-black text-slate-400 uppercase">Aadhar Card</p><p className="text-sm font-bold text-slate-800">XXXX-XXXX-8802</p></div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button onClick={() => setViewingDoc({name: 'Aadhar_Card.pdf'})} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200"><Eye size={14} /></button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200"><Download size={14} /></button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Landmark size={20} /></div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Bank Account</p><p className="text-[11px] font-bold text-slate-800">JP MORGAN • ****8990</p></div>
//                       <div><p className="text-[9px] font-black text-slate-400 uppercase">IFSC / Type</p><p className="text-[11px] font-bold text-slate-800">CHAS00001 • SAVINGS</p></div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setViewingDoc({name: 'Passbook_Front.pdf'})} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200"><Eye size={14} /></button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200"><Download size={14} /></button>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//             {/* IDENTITY & FINANCIAL KYC SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                   Identity & Financial KYC
//                 </h2>
//               </div>

//               <div className="divide-y divide-slate-100">
//                 {/* NEW: PAN Card Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//                       <CreditCard size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         National Identifier (PAN)
//                       </p>
//                       <p className="text-sm font-bold text-slate-800 tracking-wider">
//                         ABCDE1234F
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "PAN_Card_Original.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Aadhar Row */}
//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                       <Fingerprint size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase">
//                         Aadhar Card
//                       </p>
//                       <p className="text-sm font-bold text-slate-800">
//                         XXXX-XXXX-8802
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setViewingDoc({ name: "Aadhar_Card.pdf" })
//                         }
//                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 {/* Bank Row */}
//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//                       <Landmark size={20} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           Bank Account
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           JP MORGAN • ****8990
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">
//                           IFSC / Type
//                         </p>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           CHAS00001 • SAVINGS
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         setViewingDoc({ name: "Passbook_Front.pdf" })
//                       }
//                       className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//                     >
//                       <Eye size={14} />
//                     </button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//                       <Download size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ASSETS & CONTRACTS SECTION */}
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Asset Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <Package size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Inventory Assets
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {assets.map((asset, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
//                           {asset.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {asset.name}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {asset.status}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => setViewingDoc(asset)}
//                           className="p-1.5 hover:text-blue-600 transition-colors"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 hover:text-slate-900 transition-colors">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Employment Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Legal Contracts
//                   </h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {employmentLetters.map((doc, i) => (
//                     <div
//                       key={i}
//                       className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                           {doc.icon}
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-700">
//                             {doc.type}
//                           </p>
//                           <p className="text-[9px] font-bold text-slate-400 uppercase">
//                             {doc.date}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => setViewingDoc(doc)}
//                           className="p-1.5 text-blue-400 hover:text-blue-600"
//                         >
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 text-blue-400 hover:text-blue-600">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             {/* APPOINTMENT & ASSET ASSIGNMENT MODULE */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
//                 <div className="flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Appointment Letter Issuance
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-[10px] font-bold text-blue-600 uppercase">
//                     Draft Mode
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6 space-y-8">
//                 {/* TOP ROW: DATE & CTC */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Confirmation Date
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         defaultValue="2026-01-23"
//                         className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Revised CTC (New Annual Package)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
//                         &#8377;
//                       </span>

//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ASSET ARRAY SECTION */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
//                       Hardware Assets Assignment
//                     </label>
//                     <button
//                       onClick={addAssetRow}
//                       className="text-[10px] font-bold text-blue-600 hover:underline"
//                     >
//                       + ADD NEW ASSET
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     {/* Map through assets array here */}
//                     {/* ASSET ARRAY SECTION - DYNAMIC DROPDOWN */}
//                     <div className="space-y-4">
//                       {/* Previous Assigned Assets */}
//                       {/* <div className="space-y-3">
//                         {previousAssets.map((a, i) => (
//                           <div
//                             key={i}
//                             className="grid grid-cols-12 gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl"
//                           >
//                             <div className="col-span-4 text-xs font-bold">
//                               {a.category.toUpperCase()}
//                             </div>
//                             <div className="col-span-4 text-xs">{a.model}</div>
//                             <div className="col-span-3 text-xs">{a.serial}</div>
//                             <div className="col-span-1 text-green-600 text-xs font-bold">
//                               ASSIGNED
//                             </div>
//                           </div>
//                         ))}
//                       </div> */}

//                       <div className="space-y-3">
//                         {previousAssets.map((a, i) => (
//                           <div
//                             key={i}
//                             className="group grid grid-cols-12 gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 items-center"
//                           >
//                             {/* Category Icon & Name */}
//                             <div className="col-span-4 flex items-center gap-3">
//                               <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
//                                 {a.category.toLowerCase() === "laptop" ? (
//                                   <Monitor size={16} />
//                                 ) : a.category.toLowerCase() === "sim card" ? (
//                                   <Cpu size={16} />
//                                 ) : (
//                                   <Package size={16} />
//                                 )}
//                               </div>
//                               <div>
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                   Asset Category
//                                 </p>
//                                 <p className="text-xs font-bold text-slate-700">
//                                   {a.category.toUpperCase()}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Model Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Model / Specs
//                               </p>
//                               <p className="text-xs font-semibold text-slate-600 truncate">
//                                 {a.model}
//                               </p>
//                             </div>

//                             {/* Serial Info */}
//                             <div className="col-span-3">
//                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
//                                 Identification
//                               </p>
//                               <p className="text-xs font-mono text-slate-500">
//                                 {a.serial}
//                               </p>
//                             </div>

//                             {/* Status Badge */}
//                             <div className="col-span-2 flex justify-end">
//                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//                                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
//                                   Assigned
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* New Dynamic Asset Rows */}
//                       <div className="space-y-3">
//                         {assetRows.map((row, index) => (
//                           <div
//                             key={index}
//                             className="grid grid-cols-12 gap-3 p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl items-end"
//                           >
//                             {/* Category */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 Category
//                               </p>
//                               <select
//                                 value={row.category}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "category",
//                                     e.target.value,
//                                   )
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               >
//                                 <option value="laptop">Laptop</option>
//                                 <option value="mobile">Mobile</option>
//                                 <option value="sim_card">SIM Card</option>
//                                 <option value="other">Other</option>
//                               </select>
//                             </div>

//                             {/* Model / Specs (Dynamic Label) */}
//                             <div className="col-span-4 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "Carrier / Plan"
//                                   : "Model / Specs"}
//                               </p>
//                               <input
//                                 value={row.model}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "model",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder={
//                                   row.category === "laptop"
//                                     ? "MacBook Pro M3"
//                                     : row.category === "mobile"
//                                       ? "iPhone 15"
//                                       : row.category === "sim_card"
//                                         ? "Jio Postpaid"
//                                         : "Other asset details"
//                                 }
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Serial / ICCID */}
//                             <div className="col-span-3 space-y-1.5">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">
//                                 {row.category === "sim_card"
//                                   ? "ICCID / SIM No"
//                                   : "Serial Number"}
//                               </p>
//                               <input
//                                 value={row.serial}
//                                 onChange={(e) =>
//                                   handleAssetChange(
//                                     index,
//                                     "serial",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder="Unique ID..."
//                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
//                               />
//                             </div>

//                             {/* Remove */}
//                             <div className="col-span-1 flex justify-center pb-1">
//                               <button
//                                 onClick={() => removeAssetRow(index)}
//                                 className="p-2 text-slate-300 hover:text-red-500"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ACTION AREA */}
//                 <div className="pt-4 flex gap-3">
//                   <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
//                     <MailOpen size={16} /> GENERATE & SEND APPOINTMENT LETTER
//                   </button>
//                   <button className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
//                     <Eye size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: COMPLIANCE VAULT */}
//           <div className="col-span-12 lg:col-span-4 h-full">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sticky top-24 h-[650px]">
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold">Audit Vault</h3>
//                   <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">
//                     ALL FILES
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={14}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {filteredDocs.map((doc, i) => (
//                   <div
//                     key={i}
//                     className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
//                         <FileText size={16} />
//                       </div>
//                       <div className="overflow-hidden">
//                         <p className="text-xs font-bold text-slate-700 truncate w-32">
//                           {doc.name}
//                         </p>
//                         <p className="text-[9px] text-slate-400 font-bold uppercase">
//                           {doc.status}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setViewingDoc(doc)}
//                         className="p-2 hover:text-blue-600"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       <button className="p-2 hover:text-slate-900">
//                         <Download size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* <div className="p-6 border-t border-slate-100">
//                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Full Dossier</button>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

//************************************************full code********************************************************* */

// import React, { useState } from "react";
// import {
//   Download, Eye, FileText, CheckCircle2, Building2,
//   ShieldCheck, Search, CreditCard, Landmark,
//   Fingerprint, History, UserCheck, Globe, X,
//   FileSignature, MailOpen, AlertCircle, ImageIcon,
//   MapPin, Package, Home
// } from "lucide-react";

// export default function ReviewPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewingDoc, setViewingDoc] = useState(null);

//   // Updated Data Structures
//   const employmentLetters = [
//     { name: "Offer_Letter_v2.pdf", type: "Offer Letter", size: "1.4 MB", date: "Jan 12, 2026", icon: <MailOpen size={18} /> },
//     { name: "Joining_Letter_Signed.pdf", type: "Joining Letter", size: "1.1 MB", date: "Jan 20, 2026", icon: <FileSignature size={18} /> },
//   ];

//   const assets = [
//     { name: "MacBook_Pro_M3_Receipt.pdf", type: "Hardware", size: "850 KB", status: "Assigned", icon: <Package size={18} /> },
//     { name: "Corporate_ID_Access.pdf", type: "Security", size: "420 KB", status: "Active", icon: <ShieldCheck size={18} /> },
//   ];

//   const documents = [
//     { name: "PAN_Card_Original.pdf", type: "PDF", size: "1.2 MB", status: "Verified" },
//     { name: "Aadhar_Front_Back.png", type: "IMG", size: "2.4 MB", status: "Verified" },
//     { name: "Bank_Statement_Q4.pdf", type: "PDF", size: "3.1 MB", status: "Verified" },
//     { name: "Rental_Agreement.pdf", type: "PDF", size: "4.5 MB", status: "Pending" },
//   ];

//   const filteredDocs = documents.filter(doc =>
//     doc.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const VerifiedBadge = () => (
//     <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
//       <ShieldCheck size={10} /> Verified
//     </span>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 relative">

//       {/* --- DOCUMENT VIEW MODAL --- */}
//       {viewingDoc && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-600 text-white rounded-xl">
//                   <FileText size={18} />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-sm text-slate-800 leading-none">{viewingDoc.name}</h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Secure Document Preview</p>
//                 </div>
//               </div>
//               <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
//             </div>
//             <div className="p-10 bg-slate-100 flex justify-center h-[400px] overflow-y-auto">
//               <div className="w-full max-w-md bg-white shadow-lg rounded-sm border border-slate-200 p-8 flex flex-col gap-4">
//                  <div className="h-4 w-1/4 bg-slate-100 rounded" />
//                  <div className="h-2 w-full bg-slate-50 rounded" />
//                  <div className="h-2 w-full bg-slate-50 rounded" />
//                  <div className="h-2 w-3/4 bg-slate-50 rounded" />
//               </div>
//             </div>
//             <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
//                <button onClick={() => setViewingDoc(null)} className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest">Dismiss</button>
//                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Download size={14} /> Download PDF
//                </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TOP NAV */}
//       <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 p-1.5 rounded-lg text-white"><UserCheck size={18} /></div>
//             <span className="font-bold text-sm tracking-tight">ComplianceOS</span>
//           </div>
//           <div className="h-4 w-[1px] bg-slate-200" />
//           <div className="flex items-center gap-2 text-slate-500">
//             <History size={14} />
//             <span className="text-xs font-medium uppercase tracking-wider">Audit Log #8802</span>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">

//         {/* HEADER */}
//         <div className="pb-6 border-b border-slate-200">
//           <div className="flex items-center gap-6">
//             <img src="https://i.pravatar.cc/150?img=12" className="h-20 w-20 rounded-3xl object-cover shadow-xl border-4 border-white" alt="User" />
//             <div>
//               <h1 className="text-3xl font-black text-slate-800">Johnathan Doe</h1>
//               <p className="text-slate-500 font-medium flex items-center gap-2"><Building2 size={16} /> Lead UX Engineer • Stark Industries</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-8">

//           {/* LEFT CONTENT */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">

//             {/* ADDRESS SECTION */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <MapPin size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Address Management</h2>
//               </div>
//               <div className="p-6 grid md:grid-cols-2 gap-6">
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase">Current Residence</span><VerifiedBadge /></div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">742 Evergreen Terrace, Springfield, OR 97477</p>
//                 </div>
//                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
//                   <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase">Permanent Address</span><VerifiedBadge /></div>
//                   <p className="text-xs font-bold text-slate-700 leading-relaxed">124 Conch Street, Bikini Bottom, Pacific Ocean</p>
//                 </div>
//               </div>
//             </div>

//             {/* KYC & BANK SECTION */}
//             {/* <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity & Financial KYC</h2>
//               </div>
//               <div className="divide-y divide-slate-100">

//                 <div className="p-6 flex items-center justify-between group">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Fingerprint size={20} /></div>
//                     <div><p className="text-[10px] font-black text-slate-400 uppercase">Aadhar Card</p><p className="text-sm font-bold text-slate-800">XXXX-XXXX-8802</p></div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="flex gap-2">
//                       <button onClick={() => setViewingDoc({name: 'Aadhar_Card.pdf'})} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200"><Eye size={14} /></button>
//                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200"><Download size={14} /></button>
//                     </div>
//                     <VerifiedBadge />
//                   </div>
//                 </div>

//                 <div className="p-6 flex items-center justify-between bg-slate-50/30">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Landmark size={20} /></div>
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Bank Account</p><p className="text-[11px] font-bold text-slate-800">JP MORGAN • ****8990</p></div>
//                       <div><p className="text-[9px] font-black text-slate-400 uppercase">IFSC / Type</p><p className="text-[11px] font-bold text-slate-800">CHAS00001 • SAVINGS</p></div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setViewingDoc({name: 'Passbook_Front.pdf'})} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200"><Eye size={14} /></button>
//                     <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200"><Download size={14} /></button>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//             {/* IDENTITY & FINANCIAL KYC SECTION */}
// <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//   <div className="px-6 py-4 bg-slate-50 flex items-center gap-2 border-b border-slate-100">
//     <Landmark size={14} className="text-slate-400" />
//     <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity & Financial KYC</h2>
//   </div>

//   <div className="divide-y divide-slate-100">
//     {/* NEW: PAN Card Row */}
//     <div className="p-6 flex items-center justify-between group">
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//           <CreditCard size={20} />
//         </div>
//         <div>
//           <p className="text-[10px] font-black text-slate-400 uppercase">National Identifier (PAN)</p>
//           <p className="text-sm font-bold text-slate-800 tracking-wider">ABCDE1234F</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <div className="flex gap-2">
//           <button
//             onClick={() => setViewingDoc({name: 'PAN_Card_Original.pdf'})}
//             className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//           >
//             <Eye size={14} />
//           </button>
//           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//             <Download size={14} />
//           </button>
//         </div>
//         <VerifiedBadge />
//       </div>
//     </div>

//     {/* Aadhar Row */}
//     <div className="p-6 flex items-center justify-between group">
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//           <Fingerprint size={20} />
//         </div>
//         <div>
//           <p className="text-[10px] font-black text-slate-400 uppercase">Aadhar Card</p>
//           <p className="text-sm font-bold text-slate-800">XXXX-XXXX-8802</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <div className="flex gap-2">
//           <button
//             onClick={() => setViewingDoc({name: 'Aadhar_Card.pdf'})}
//             className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//           >
//             <Eye size={14} />
//           </button>
//           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//             <Download size={14} />
//           </button>
//         </div>
//         <VerifiedBadge />
//       </div>
//     </div>

//     {/* Bank Row */}
//     <div className="p-6 flex items-center justify-between bg-slate-50/30">
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//           <Landmark size={20} />
//         </div>
//         <div className="grid grid-cols-2 gap-x-8 gap-y-1">
//           <div>
//             <p className="text-[9px] font-black text-slate-400 uppercase">Bank Account</p>
//             <p className="text-[11px] font-bold text-slate-800">JP MORGAN • ****8990</p>
//           </div>
//           <div>
//             <p className="text-[9px] font-black text-slate-400 uppercase">IFSC / Type</p>
//             <p className="text-[11px] font-bold text-slate-800">CHAS00001 • SAVINGS</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex gap-2">
//         <button
//           onClick={() => setViewingDoc({name: 'Passbook_Front.pdf'})}
//           className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-200 transition-colors"
//         >
//           <Eye size={14} />
//         </button>
//         <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
//           <Download size={14} />
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//             {/* ASSETS & CONTRACTS SECTION */}
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Asset Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <Package size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Inventory Assets</h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {assets.map((asset, i) => (
//                     <div key={i} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">{asset.icon}</div>
//                         <div><p className="text-[11px] font-bold text-slate-700">{asset.name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{asset.status}</p></div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button onClick={() => setViewingDoc(asset)} className="p-1.5 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
//                         <button className="p-1.5 hover:text-slate-900 transition-colors"><Download size={14} /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Employment Section */}
//               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
//                   <FileSignature size={14} className="text-slate-400" />
//                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Legal Contracts</h2>
//                 </div>
//                 <div className="p-4 space-y-3">
//                   {employmentLetters.map((doc, i) => (
//                     <div key={i} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-blue-50/30 border-blue-100">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">{doc.icon}</div>
//                         <div><p className="text-[11px] font-bold text-slate-700">{doc.type}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{doc.date}</p></div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button onClick={() => setViewingDoc(doc)} className="p-1.5 text-blue-400 hover:text-blue-600"><Eye size={14} /></button>
//                         <button className="p-1.5 text-blue-400 hover:text-blue-600"><Download size={14} /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: COMPLIANCE VAULT */}
//           <div className="col-span-12 lg:col-span-4 h-full">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sticky top-24 h-[650px]">
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Audit Vault</h3><span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">ALL FILES</span></div>
//                 <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10" onChange={(e) => setSearchTerm(e.target.value)} /></div>
//               </div>
//               <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {filteredDocs.map((doc, i) => (
//                   <div key={i} className="group p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg"><FileText size={16} /></div>
//                       <div className="overflow-hidden"><p className="text-xs font-bold text-slate-700 truncate w-32">{doc.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{doc.status}</p></div>
//                     </div>
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => setViewingDoc(doc)} className="p-2 hover:text-blue-600"><Eye size={14} /></button>
//                       <button className="p-2 hover:text-slate-900"><Download size={14} /></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* <div className="p-6 border-t border-slate-100">
//                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Full Dossier</button>
//               </div> */}
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import {
//   Download, Eye, FileText, MapPin, Briefcase,
//   CheckCircle2, Building2, ExternalLink, ShieldCheck,
//   AlertCircle, ImageIcon, Search, CreditCard,
//   Landmark, Fingerprint, History, UserCheck, Globe
// } from "lucide-react";

// export default function ReviewPage() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const documents = [
//     { name: "PAN_Card_Original.pdf", type: "PDF", size: "1.2 MB", status: "Verified" },
//     { name: "Aadhar_Front_Back.png", type: "IMG", size: "2.4 MB", status: "Verified" },
//     { name: "Bank_Statement_Q4.pdf", type: "PDF", size: "3.1 MB", status: "Verified" },
//     { name: "Rental_Agreement.pdf", type: "PDF", size: "4.5 MB", status: "Pending" },
//     { name: "Academic_Degree.pdf", type: "PDF", size: "1.8 MB", status: "Verified" },
//   ];

//   const filteredDocs = documents.filter(doc =>
//     doc.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const VerifiedBadge = () => (
//     <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 uppercase">
//       <ShieldCheck size={10} /> Verified
//     </span>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100">
//       {/* ENTERPRISE TOP NAV */}
//       <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 p-1.5 rounded-lg text-white">
//               <UserCheck size={18} />
//             </div>
//             <span className="font-bold text-sm tracking-tight">ComplianceOS</span>
//           </div>
//           <div className="h-4 w-[1px] bg-slate-200" />
//           <div className="flex items-center gap-2 text-slate-500">
//             <History size={14} />
//             <span className="text-xs font-medium uppercase tracking-wider">Audit Log #8802</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">DOCS</button>
//           <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">JD</div>
//         </div>
//       </nav>

//       <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">

//         {/* HEADER AREA */}
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
//           <div className="flex items-center gap-6">
//             <div className="relative group">
//               <img src="https://i.pravatar.cc/150?img=12" className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white shadow-xl group-hover:scale-105 transition-transform duration-300" alt="User" />
//               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
//                 <CheckCircle2 size={16} />
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center gap-3 mb-1">
//                 <h1 className="text-3xl font-black tracking-tight text-slate-800">Johnathan Doe</h1>
//                 <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded border border-blue-100 uppercase tracking-widest">Permanent Staff</span>
//               </div>
//               <p className="text-slate-500 font-medium flex items-center gap-2">
//                 <Building2 size={16} className="text-slate-400" /> Lead UX Engineer • Stark Industries
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
//               <Download size={14} /> EXPORT DATA
//             </button>
//             <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-xl shadow-slate-200">
//               APPROVE PROFILE
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-8">

//           {/* LEFT: MASTER DATA (Addresses & Identity) */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">

//             {/* ADDRESS MODULE */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
//                 <Globe size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Address Management</h2>
//               </div>
//               <div className="p-6 grid md:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Residence</label>
//                     <VerifiedBadge />
//                   </div>
//                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                     <p className="text-[13px] leading-relaxed text-slate-700 font-semibold">
//                       742 Evergreen Terrace, Springfield,<br />OR 97477, United States
//                     </p>
//                     <button className="mt-3 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
//                       GEOLOCATION DATA <ExternalLink size={10} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Permanent Address</label>
//                     <VerifiedBadge />
//                   </div>
//                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                     <p className="text-[13px] leading-relaxed text-slate-700 font-semibold">
//                       124 Conch Street, Bikini Bottom,<br />Pacific Ocean, 00012
//                     </p>
//                     <button className="mt-3 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
//                       VIEW REGISTERED DEED <ExternalLink size={10} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* IDENTITY & FINANCIALS */}
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
//                 <Landmark size={14} className="text-slate-400" />
//                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">KYC & Financial Identity</h2>
//               </div>
//               <div className="divide-y divide-slate-100">
//                 {/* PAN ROW */}
//                 <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
//                       <CreditCard size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">National Identifier (PAN)</p>
//                       <p className="text-lg font-mono font-bold text-slate-800 tracking-wider uppercase">ABCDE1234F</p>
//                     </div>
//                   </div>
//                   <VerifiedBadge />
//                 </div>
//                 {/* AADHAR ROW */}
//                 <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
//                       <Fingerprint size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Biometric Identity (Aadhar)</p>
//                       <p className="text-lg font-mono font-bold text-slate-800 tracking-wider uppercase">XXXX-XXXX-8802</p>
//                     </div>
//                   </div>
//                   <VerifiedBadge />
//                 </div>
//                 {/* BANKING ROW */}
//                 <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
//                       <Landmark size={20} />
//                     </div>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">Bank</p>
//                         <p className="text-xs font-bold text-slate-800">JP MORGAN</p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">Account</p>
//                         <p className="text-xs font-bold text-slate-800 font-mono">****8990</p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">IFSC</p>
//                         <p className="text-xs font-bold text-slate-800">CHAS00001</p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-slate-400 uppercase">Type</p>
//                         <p className="text-xs font-bold text-slate-800">SAVINGS</p>
//                       </div>
//                     </div>
//                   </div>
//                   <VerifiedBadge />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: COMPLIANCE VAULT (Documents) */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[700px]">
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold">Audit Vault</h3>
//                   <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full">{documents.length} FILES</span>
//                 </div>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                   <input
//                     type="text"
//                     placeholder="Search vault..."
//                     className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* CUSTOM TAILWIND SCROLLBAR (No <style> tag) */}
//               <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
//                 <div className="divide-y divide-slate-50 px-2">
//                   {filteredDocs.map((doc, i) => (
//                     <div key={i} className="group p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all">
//                       <div className="flex items-center gap-3">
//                         <div className={`p-2.5 rounded-xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
//                           {doc.type === 'PDF' ? <FileText size={18} /> : <ImageIcon size={18} />}
//                         </div>
//                         <div className="overflow-hidden">
//                           <p className="text-[13px] font-bold text-slate-700 truncate w-32">{doc.name}</p>
//                           <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.size} • {doc.status}</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100 transition-all">
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100 transition-all">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-6 mt-auto border-t border-slate-100">
//                 <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">
//                   <div className="relative z-10">
//                     <div className="flex items-center gap-2 mb-2 text-blue-400">
//                       <AlertCircle size={14} />
//                       <p className="text-[10px] font-black uppercase tracking-widest">Compliance Review</p>
//                     </div>
//                     <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
//                       Ensure all identity identifiers match the provided physical copies before final sign-off.
//                     </p>
//                     <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
//                       APPROVE ALL VAULT
//                     </button>
//                   </div>
//                   <ShieldCheck size={100} className="absolute -bottom-8 -right-8 text-white opacity-[0.03]" />
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

// import React from "react";
// import {
//   Download, Eye, FileText, MapPin, Briefcase,
//   Package, CheckCircle2, Calendar, Building2,
//   ExternalLink, ShieldCheck, AlertCircle, ImageIcon, MoreVertical
// } from "lucide-react";

// export default function ReviewPage() {
//   const experiences = [
//     {
//       role: "Senior Product Lead",
//       company: "Stark Industries",
//       period: "2021 - Present",
//       location: "Los Angeles, CA",
//       description: "Led the development of AI-driven logistics modules.",
//       current: true
//     },
//     {
//       role: "UX Engineer",
//       company: "Wayne Enterprises",
//       period: "2018 - 2021",
//       location: "Gotham City",
//       description: "Standardized design systems across tactical applications.",
//       current: false
//     }
//   ];

//   // Enhanced Document Data
//   const documents = [
//     { name: "Offer_Letter_Final.pdf", type: "PDF", size: "1.2 MB", status: "Verified", date: "Jan 12, 2026" },
//     { name: "Academic_Degree.png", type: "IMG", size: "2.4 MB", status: "Pending", date: "Jan 14, 2026" },
//     { name: "Experience_Cert.pdf", type: "PDF", size: "900 KB", status: "Verified", date: "Jan 10, 2026" },
//   ];

//   const SectionHeader = ({ icon: Icon, title }) => (
//     <div className="flex items-center gap-3 mb-6">
//       <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
//         <Icon size={16} className="text-blue-600" />
//       </div>
//       <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER SECTION */}
//         <header className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
//           <div className="absolute top-0 right-0 p-4">
//              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Employee ID: NF-8802</span>
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="relative">
//               <img src="https://i.pravatar.cc/150?img=12" alt="User" className="h-20 w-20 rounded-2xl object-cover border border-slate-100 shadow-md" />
//               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-lg">
//                 <CheckCircle2 size={14} />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight">Johnathan Doe</h1>
//               <div className="flex items-center gap-3 mt-1 text-slate-500">
//                 <span className="text-sm font-medium flex items-center gap-1.5 text-blue-600">
//                   <Building2 size={14} /> NexusFlow Corp
//                 </span>
//                 <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                 <span className="text-sm">Design Department</span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 md:mt-0 flex gap-3">
//             <button className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-[11px] hover:bg-slate-50 transition-all uppercase tracking-wider">
//               Download All
//             </button>
//             <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-black shadow-xl shadow-slate-200 transition-all uppercase tracking-wider">
//               Approve Files
//             </button>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

//           {/* LEFT COLUMN: PRIMARY INFO */}
//           <div className="lg:col-span-7 space-y-6">

//             {/* MULTI-EXPERIENCE TIMELINE */}
//             <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
//               <SectionHeader icon={Briefcase} title="Professional Timeline" />

//               <div className="relative space-y-8">
//                 <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-slate-100"></div>

//                 {experiences.map((exp, i) => (
//                   <div key={i} className="relative pl-12 group">
//                     <div className={`absolute left-0 top-1 h-[40px] w-[40px] rounded-xl border flex items-center justify-center transition-colors shadow-sm ${exp.current ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
//                       <Building2 size={18} />
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                       <div>
//                         <h4 className="text-[15px] font-bold text-slate-900">{exp.role}</h4>
//                         <p className="text-[13px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium italic italic">
//                           {exp.company} • {exp.location}
//                         </p>
//                         <p className="mt-3 text-[12px] text-slate-400 leading-relaxed max-w-xl">
//                           {exp.description}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-bold text-slate-500 whitespace-nowrap">
//                         <Calendar size={12} />
//                         {exp.period}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* ASSET & ADDRESS ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//                 <SectionHeader icon={Package} title="Hardware Asset Registry" />
//                 <div className="space-y-3">
//                   {['MacBook Pro M3 Max (64GB)', 'Pro Display XDR 32"'].map((item, i) => (
//                     <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
//                       <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                       <span className="text-[12px] font-semibold text-slate-700">{item}</span>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//                 <SectionHeader icon={MapPin} title="Verified Address" />
//                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
//                   <p className="text-[13px] text-slate-600 leading-[1.6]">
//                     742 Evergreen Terrace, Springfield,<br />
//                     Oregon, Postcode: 97477
//                   </p>
//                   <button className="mt-4 text-[10px] font-bold text-blue-600 flex items-center gap-1">
//                     VIEW ON MAP <ExternalLink size={10} />
//                   </button>
//                 </div>
//               </section>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: NEW ENTERPRISE DOCUMENT VAULT */}
//           <div className="lg:col-span-5 space-y-6">
//             <aside className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
//               <div className="flex items-center justify-between mb-6">
//                 <SectionHeader icon={FileText} title="Document Vault" />
//                 <div className="flex gap-1.5 -mt-6">
//                     <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
//                     <div className="h-2 w-2 rounded-full bg-orange-400"></div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {documents.map((doc, i) => (
//                   <div key={i} className="group relative flex flex-col p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-500/30 hover:shadow-lg transition-all duration-300">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className={`p-2.5 rounded-xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
//                           {doc.type === 'PDF' ? <FileText size={18} /> : <ImageIcon size={18} />}
//                         </div>
//                         <div>
//                           <h4 className="text-[13px] font-bold text-slate-800 truncate max-w-[140px]">
//                             {doc.name}
//                           </h4>
//                           <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
//                             {doc.type} • {doc.size}
//                           </p>
//                         </div>
//                       </div>
//                       <button className="text-slate-300 hover:text-slate-600">
//                         <MoreVertical size={16} />
//                       </button>
//                     </div>

//                     <div className="mt-4 pt-4 border-t border-slate-100/60 flex items-center justify-between">
//                       <div className="flex items-center gap-1.5">
//                         {doc.status === "Verified" ? (
//                           <ShieldCheck size={14} className="text-emerald-500" />
//                         ) : (
//                           <AlertCircle size={14} className="text-orange-400" />
//                         )}
//                         <span className={`text-[10px] font-black uppercase tracking-tight ${
//                           doc.status === "Verified" ? "text-emerald-600" : "text-orange-500"
//                         }`}>
//                           {doc.status}
//                         </span>
//                       </div>

//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
//                         <button className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-colors">
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 rounded-md bg-slate-900 text-white hover:bg-black shadow-md transition-colors">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 pt-6 border-t border-slate-100">
//                 <div className="p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
//                   <div className="relative z-10">
//                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Final Review</p>
//                     <p className="text-[12px] font-medium leading-relaxed opacity-90">Verify all uploads match physical originals for compliance.</p>
//                     <button className="w-full mt-5 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
//                       Confirm & Approve
//                     </button>
//                   </div>
//                   {/* Decorative Background Icon */}
//                   <ShieldCheck size={80} className="absolute -bottom-4 -right-4 opacity-10 text-white" />
//                 </div>
//               </div>
//             </aside>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import {
//   Download, Eye, FileText, MapPin, Briefcase,
//   Package, CheckCircle2, Calendar, Building2, ExternalLink
// } from "lucide-react";

// export default function ReviewPage() {
//   const experiences = [
//     {
//       role: "Senior Product Lead",
//       company: "Stark Industries",
//       period: "2021 - Present",
//       location: "Los Angeles, CA",
//       description: "Led the development of AI-driven logistics modules.",
//       current: true
//     },
//     {
//       role: "UX Engineer",
//       company: "Wayne Enterprises",
//       period: "2018 - 2021",
//       location: "Gotham City",
//       description: "Standardized design systems across tactical applications.",
//       current: false
//     }
//   ];

//   const documents = [
//     { name: "Offer Letter", size: "1.2 MB", status: "Verified" },
//     { name: "Aadhar Card", size: "800 KB", status: "Verified" },
//     { name: "Relieving Letter", size: "2.1 MB", status: "Verified" },
//   ];

//   const SectionHeader = ({ icon: Icon, title }) => (
//     <div className="flex items-center gap-3 mb-6">
//       <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
//         <Icon size={16} className="text-blue-600" />
//       </div>
//       <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER SECTION */}
//         <header className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
//           <div className="absolute top-0 right-0 p-4">
//              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Employee ID: NF-8802</span>
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="relative">
//               <img src="https://i.pravatar.cc/150?img=12" alt="User" className="h-20 w-20 rounded-2xl object-cover border border-slate-100 shadow-md" />
//               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-lg">
//                 <CheckCircle2 size={14} />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight">Johnathan Doe</h1>
//               <div className="flex items-center gap-3 mt-1 text-slate-500">
//                 <span className="text-sm font-medium flex items-center gap-1.5 text-blue-600">
//                   <Building2 size={14} /> NexusFlow Corp
//                 </span>
//                 <span className="h-1 w-1 rounded-full bg-slate-300"></span>
//                 <span className="text-sm">Design Department</span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 md:mt-0 flex gap-3">
//             <button className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-[11px] hover:bg-slate-50 transition-all uppercase tracking-wider">
//               Download All
//             </button>
//             <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-black shadow-xl shadow-slate-200 transition-all uppercase tracking-wider">
//               Approve Files
//             </button>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

//           {/* LEFT COLUMN: PRIMARY INFO */}
//           <div className="lg:col-span-8 space-y-6">

//             {/* MULTI-EXPERIENCE TIMELINE */}
//             <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
//               <SectionHeader icon={Briefcase} title="Professional Timeline" />

//               <div className="relative space-y-8">
//                 {/* Vertical Line Connector */}
//                 <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-slate-100"></div>

//                 {experiences.map((exp, i) => (
//                   <div key={i} className="relative pl-12 group">
//                     {/* Dot Connector */}
//                     <div className={`absolute left-0 top-1 h-[40px] w-[40px] rounded-xl border flex items-center justify-center transition-colors shadow-sm ${exp.current ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-blue-300'}`}>
//                       <Building2 size={18} />
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                       <div>
//                         <h4 className="text-[15px] font-bold text-slate-900">{exp.role}</h4>
//                         <p className="text-[13px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium italic">
//                           {exp.company} • {exp.location}
//                         </p>
//                         <p className="mt-3 text-[12px] text-slate-400 leading-relaxed max-w-xl">
//                           {exp.description}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-bold text-slate-500 whitespace-nowrap">
//                         <Calendar size={12} />
//                         {exp.period}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* ASSET & ADDRESS ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//                 <SectionHeader icon={Package} title="Hardware Asset Registry" />
//                 <div className="space-y-3">
//                   {['MacBook Pro M3 Max (64GB)', 'Pro Display XDR 32"', 'Magic Keyboard & Trackpad'].map((item, i) => (
//                     <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
//                       <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                       <span className="text-[12px] font-semibold text-slate-700">{item}</span>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//                 <SectionHeader icon={MapPin} title="Verified Address" />
//                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
//                   <p className="text-[13px] text-slate-600 leading-[1.6]">
//                     742 Evergreen Terrace, Springfield,<br />
//                     Oregon, Postcode: 97477<br />
//                     United States
//                   </p>
//                   <button className="mt-4 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
//                     VIEW ON MAP <ExternalLink size={10} />
//                   </button>
//                 </div>
//               </section>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: DOCUMENTS */}
//           <div className="lg:col-span-4 space-y-6">
//             <aside className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
//               <SectionHeader icon={FileText} title="Document Vault" />

//               <div className="space-y-3">
//                 {documents.map((doc, i) => (
//                   <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-[12px] font-bold text-slate-800">{doc.name}</span>
//                       <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{doc.size}</span>
//                       <div className="flex gap-1.5">
//                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 pt-6 border-t border-slate-100">
//                 <div className="p-4 rounded-xl bg-slate-900 text-white">
//                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Final Step</p>
//                   <p className="text-[12px] font-medium leading-snug">Verify that all uploaded documents match the physical originals.</p>
//                   <button className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors">
//                     Mark as Verified
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import {
//   Download, Eye, FileText, MapPin, Briefcase,
//   Package, CheckCircle2, User, Landmark
// } from "lucide-react";

// export default function ReviewPage() {
//   // Dummy Data for Preview
//   const documents = [
//     { name: "Offer Letter", size: "1.2 MB", status: "Verified" },
//     { name: "Aadhar Card", size: "800 KB", status: "Verified" },
//     { name: "Experience Certificate", size: "2.1 MB", status: "Verified" },
//     { name: "Degree Marksheet", size: "1.5 MB", status: "Pending" },
//   ];

//   const SectionHeader = ({ icon: Icon, title }) => (
//     <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
//       <Icon size={16} className="text-blue-600" />
//       <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800">{title}</h3>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* TOP HEADER: IDENTITY & PRIMARY ACTION */}
//         <header className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
//           <div className="flex items-center gap-5">
//             <div className="relative group">
//               <img
//                 src="https://i.pravatar.cc/150?img=12"
//                 alt="Profile"
//                 className="h-20 w-20 rounded-2xl object-cover border-4 border-slate-50 shadow-inner"
//               />
//               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg">
//                 <CheckCircle2 size={16} />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Johnathan Doe</h1>
//               <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
//                 <Briefcase size={14} /> Senior Product Lead • <span className="text-blue-600 font-semibold">NexusFlow Corp</span>
//               </p>
//             </div>
//           </div>
//           <div className="mt-4 md:mt-0 flex gap-3">
//              <button className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[12px] hover:bg-slate-50 transition-all uppercase tracking-tight">
//                Edit Profile
//              </button>
//              <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-[12px] hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all uppercase tracking-tight">
//                Approve Onboarding
//              </button>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* LEFT & CENTER: DATA SECTIONS */}
//           <div className="lg:col-span-2 space-y-6">

//             {/* 1. PROFESSIONAL EXPERIENCE & ADDRESS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//                 <SectionHeader icon={Briefcase} title="Professional Experience" />
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Previous Company</p>
//                     <p className="text-[13px] text-slate-700 font-semibold">Stark Industries</p>
//                   </div>
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Experience</p>
//                       <p className="text-[13px] text-slate-700 font-semibold">6.4 Years</p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Notice Period</p>
//                       <p className="text-[13px] text-slate-700 font-semibold">Immediate</p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//                 <SectionHeader icon={MapPin} title="Primary Address" />
//                 <p className="text-[13px] text-slate-600 leading-relaxed italic">
//                   742 Evergreen Terrace, <br />
//                   Springfield, OR 97477, <br />
//                   United States
//                 </p>
//               </section>
//             </div>

//             {/* 2. ASSET ALLOCATION */}
//             <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//               <SectionHeader icon={Package} title="Asset Allocation" />
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {[
//                   { label: "Workstation", val: "MacBook Pro M3 Max" },
//                   { label: "Peripherals", val: "Magic Mouse & Key" },
//                   { label: "Security", val: "YubiKey 5C" }
//                 ].map((item, i) => (
//                   <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
//                     <p className="text-[9px] text-slate-400 uppercase font-bold">{item.label}</p>
//                     <p className="text-[12px] text-slate-800 font-bold">{item.val}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </div>

//           {/* RIGHT: DOCUMENT CENTER */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
//               <SectionHeader icon={FileText} title="Document Repository" />
//               <div className="space-y-3">
//                 {documents.map((doc, i) => (
//                   <div key={i} className="group p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-[12px] font-bold text-slate-800">{doc.name}</span>
//                       <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
//                         {doc.status}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-[10px] text-slate-400">{doc.size}</span>
//                       <div className="flex gap-2">
//                         <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md transition-colors shadow-sm">
//                           <Eye size={14} />
//                         </button>
//                         <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md transition-colors shadow-sm">
//                           <Download size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button className="w-full mt-6 py-3 bg-slate-50 text-slate-500 rounded-xl border border-dashed border-slate-200 text-[11px] font-bold uppercase hover:bg-slate-100 transition-all">
//                 + Upload Additional Proofs
//               </button>
//             </div>
//           </aside>

//         </div>
//       </div>
//     </div>
//   );
// }
