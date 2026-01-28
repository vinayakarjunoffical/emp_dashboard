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
} from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeDetails() {
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
  const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
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
  const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
  const META_DOCS = ["aadhaar", "pan", "bank"];
  const [openVerify, setOpenVerify] = useState(null); // "pan" | "bank"

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

  useEffect(() => {
    fetchEmployee();
    fetchAddress();
    fetchDocuments();
  }, [id]);

  useEffect(() => {
    fetchKyc();
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
        setAddress(data);
        setAddressForm(data);
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
    return `https://emp-onbd-1.onrender.com/${doc.document_path}`;
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



  const aadhaarDoc = getDocument("aadhaar");
  const panDoc = getDocument("pan");
  const bankDoc = getDocument("bank");
  const photoDoc = getDocument("photo");
  const offerDoc = getDocument("offer_letter");

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
            {/* <GridItem label="Department ID" value={employee.department_id} /> */}
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

      {/* ADDRESS SECTION */}
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
                value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
              />

              <div className="flex items-start gap-2">
                {address.current_address_status === "verified" ? (
                  <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
                    Verified
                  </span>
                ) : address.current_address_status ? (
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
                ) : (
                  <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                    {uploadingType === "current"
                      ? "Uploading..."
                      : "Upload Proof"}
                    <input
                      type="file"
                      hidden
                      onChange={async (e) => {
                        try {
                          setUploadingType("current");
                          await employeeAddressService.uploadDocument(
                            id,
                            "address_proof_current",
                            e.target.files[0],
                          );
                          toast.success("Current address proof uploaded");
                          fetchAddress();
                        } catch (err) {
                          toast.error(err.message);
                        } finally {
                          setUploadingType(null);
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
                value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
              />

              <div className="flex items-start gap-2">
                {address.permanent_address_status === "verified" ? (
                  <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
                    Verified
                  </span>
                ) : address.
permanent_address_status
 ? (
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
                ) : (
                  <label className="px-3 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                    {uploadingType === "permanent"
                      ? "Uploading..."
                      : "Upload Proof"}
                    <input
                      type="file"
                      hidden
                      onChange={async (e) => {
                        try {
                          setUploadingType("permanent");
                          await employeeAddressService.uploadDocument(
                            id,
                            "address_proof_permanent",
                            e.target.files[0],
                          );
                          toast.success("Permanent address proof uploaded");
                          fetchAddress();
                        } catch (err) {
                          toast.error(err.message);
                        } finally {
                          setUploadingType(null);
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
                value={addressForm.current_address_line1}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_address_line1: v })
                }
              />
              <Input
                label="Address Line 2"
                value={addressForm.current_address_line2}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_address_line2: v })
                }
              />
              <Input
                label="City"
                value={addressForm.current_city}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_city: v })
                }
              />
              <Input
                label="State"
                value={addressForm.current_state}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, current_state: v })
                }
              />
              <Input
                label="Pincode"
                value={addressForm.current_pincode}
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
                value={addressForm.permanent_address_line1}
                onChange={(v) =>
                  setAddressForm({
                    ...addressForm,
                    permanent_address_line1: v,
                  })
                }
              />
              <Input
                label="Address Line 2"
                value={addressForm.permanent_address_line2}
                onChange={(v) =>
                  setAddressForm({
                    ...addressForm,
                    permanent_address_line2: v,
                  })
                }
              />
              <Input
                label="City"
                value={addressForm.permanent_city}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, permanent_city: v })
                }
              />
              <Input
                label="State"
                value={addressForm.permanent_state}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, permanent_state: v })
                }
              />
              <Input
                label="Pincode"
                value={addressForm.permanent_pincode}
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
              completed={aadhaarDoc?.status === "uploaded"}
              hasFile={!!aadhaarDoc?.document_path}
              iconColor={
                aadhaarDoc?.status === "uploaded"
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
              completed={panDoc?.status === "uploaded"}
              hasFile={!!panDoc?.document_path}
              iconColor={
                panDoc?.status === "uploaded"
                  ? "text-green-500"
                  : "text-gray-400"
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
              completed={bankDoc?.status === "uploaded"}
              hasFile={!!bankDoc?.document_path}
              iconColor={
                bankDoc?.status === "uploaded"
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
              completed={photoDoc?.status === "uploaded"}
              hasFile={!!photoDoc?.document_path}
              iconColor={
                photoDoc?.status === "uploaded"
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
              completed={offerDoc?.status === "uploaded"}
              hasFile={!!offerDoc?.document_path}
              iconColor={
                offerDoc?.status === "uploaded"
                  ? "text-green-500"
                  : "text-green-400"
              }
              onAdd={() => {
                setActiveDoc("offer_letter");
                setShowKycModal(true);
              }}
              onView={() => {
                setViewDocType("offer_letter");
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

      {/* VERIFY SECTION */}
      <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          🔍 Verify KYC Details
        </h2>

        {/* PAN VERIFY ACCORDION */}
        {/* <div className="border rounded-lg mb-4">
          <button
            onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
            className="w-full flex justify-between items-center px-4 py-3 font-semibold text-slate-700"
          >
            Verify PAN
            <span>{openVerify === "pan" ? "−" : "+"}</span>
          </button>

          {openVerify === "pan" && (
            <div className="p-4 border-t space-y-4">
              <Input
                label="Name (as per PAN)"
                value={panVerifyForm.name}
                onChange={(v) =>
                  setPanVerifyForm({ ...panVerifyForm, name: v })
                }
              />

              <button
                disabled={verifying}
                onClick={async () => {
                  // try {
                  //   setVerifying(true);
                  //   await employeeKycService.verifyPan(id, panVerifyForm);
                  //   toast.success("PAN verified successfully");
                  // } catch (err) {
                  //   toast.error(err.message);
                  // } finally {
                  //   setVerifying(false);
                  // }
                  try {
                    setVerifying(true);

                    const res = await employeeKycService.verifyPan(
                      id,
                      panVerifyForm,
                    );

                    if (res.pan_status !== "verified") {
                      toast.error(res.remarks || "PAN verification failed");
                      return;
                    }

                    toast.success("PAN verified successfully");
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setVerifying(false);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Verify PAN
              </button>
            </div>
          )}
        </div> */}
        {/* PAN VERIFY ACCORDION */}
{/* <div className="border rounded-lg mb-4">
  <button
    onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-slate-700"
  >
    Verify PAN
    <span>{openVerify === "pan" ? "−" : "+"}</span>
  </button>

  {openVerify === "pan" && (
    <div className="p-4 border-t space-y-4">
      {kyc?.pan_status === "verified" ? (
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">PAN Number:</span>{" "}
            {kyc.pan_number}
          </p>
          <p>
            <span className="font-semibold">Verification ID:</span>{" "}
            {kyc.pan_verification_id}
          </p>
          <p>
            <span className="font-semibold">Verified At:</span>{" "}
            {new Date(kyc.pan_verified_at).toLocaleString()}
          </p>

          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
            PAN Verified
          </span>
        </div>
      ) : (
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
      )}
    </div>
  )}
</div> */}

<div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
  <button
    onClick={() => setOpenVerify(openVerify === "pan" ? null : "pan")}
    className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
      Verify PAN Card
    </div>
    <span className="text-xl text-slate-400">{openVerify === "pan" ? "−" : "+"}</span>
  </button>

  {openVerify === "pan" && (
    <div className="p-6 border-t border-slate-100 bg-slate-50/30">
      {kyc?.pan_status === "verified" ? (
        /* --- PREMIUM VERIFIED VIEW --- */
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
          
          {/* Left Side: Info List */}
          <div className="flex-1 flex flex-col justify-center space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">Permanent Account Number</p>
              <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
                {kyc.pan_number}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Verification ID</p>
                <p className="text-sm font-semibold text-slate-700">#{kyc.pan_verification_id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Verified On</p>
                <p className="text-sm font-semibold text-slate-700">{new Date(kyc.pan_verified_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Attractive Premium Badge */}
          <div className="relative flex flex-col items-center justify-center min-w-[180px] py-6 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%"><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
            </div>

            {/* Layered Icon */}
            <div className="relative flex items-center justify-center mb-4">
               {/* Outer Glow Ring */}
               <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />
               
               {/* Main Circle */}
               <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                  </svg>
               </div>
            </div>

            <h4 className="relative text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">Verified</h4>
          </div>

        </div>
      ) : (
        /* --- FORM VIEW (Same as before) --- */
        <div className="space-y-4 max-w-md">
            {/* ... form content ... */}
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
        {/* <div className="border rounded-lg">
          <button
            onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
            className="w-full flex justify-between items-center px-4 py-3 font-semibold text-slate-700"
          >
            Verify Bank
            <span>{openVerify === "bank" ? "−" : "+"}</span>
          </button>

          {openVerify === "bank" && (
            <div className="p-4 border-t space-y-4">
              <Input
                label="Account Number"
                value={bankVerifyForm.bank_account}
                onChange={(v) =>
                  setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
                }
              />

              <Input
                label="IFSC Code"
                value={bankVerifyForm.ifsc}
                onChange={(v) =>
                  setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
                }
              />

              <Input
                label="Account Holder Name"
                value={bankVerifyForm.name}
                onChange={(v) =>
                  setBankVerifyForm({ ...bankVerifyForm, name: v })
                }
              />

              <Input
                label="Phone Number"
                value={bankVerifyForm.phone}
                onChange={(v) =>
                  setBankVerifyForm({ ...bankVerifyForm, phone: v })
                }
              />

              <button
                disabled={verifying}
                onClick={async () => {
                  // try {
                  //   setVerifying(true);
                  //   await employeeKycService.verifyBank(id, bankVerifyForm);
                  //   toast.success("Bank verified successfully");
                  // } catch (err) {
                  //   toast.error(err.message);
                  // } finally {
                  //   setVerifying(false);
                  // }
                  try {
                    setVerifying(true);

                    const res = await employeeKycService.verifyBank(
                      id,
                      bankVerifyForm,
                    );

                    if (res.bank_status !== "verified") {
                      toast.error(res.remarks || "Bank verification failed");
                      return;
                    }

                    toast.success("Bank verified successfully");
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setVerifying(false);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Verify Bank
              </button>
            </div>
          )}
        </div> */}
        {/* BANK VERIFY ACCORDION */}
{/* <div className="border rounded-lg">
  <button
    onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
    className="w-full flex justify-between items-center px-4 py-3 font-semibold text-slate-700"
  >
    Verify Bank
    <span>{openVerify === "bank" ? "−" : "+"}</span>
  </button>

  {openVerify === "bank" && (
    <div className="p-4 border-t space-y-4">
      {kyc?.bank_status === "verified" ? (
  
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Account Holder:</span>{" "}
            {kyc.account_holder_name}
          </p>
          <p>
            <span className="font-semibold">Account Number:</span>{" "}
            {kyc.account_number}
          </p>
          <p>
            <span className="font-semibold">IFSC:</span>{" "}
            {kyc.ifsc_code}
          </p>
          <p>
            <span className="font-semibold">Verification ID:</span>{" "}
            {kyc.bank_verification_id}
          </p>
          <p>
            <span className="font-semibold">Verified At:</span>{" "}
            {new Date(kyc.bank_verified_at).toLocaleString()}
          </p>

          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
            Bank Verified
          </span>
        </div>
      ) : (

        <>
          <Input
            label="Account Number"
            value={bankVerifyForm.bank_account}
            onChange={(v) =>
              setBankVerifyForm({ ...bankVerifyForm, bank_account: v })
            }
          />

          <Input
            label="IFSC Code"
            value={bankVerifyForm.ifsc}
            onChange={(v) =>
              setBankVerifyForm({ ...bankVerifyForm, ifsc: v })
            }
          />

          <Input
            label="Account Holder Name"
            value={bankVerifyForm.name}
            onChange={(v) =>
              setBankVerifyForm({ ...bankVerifyForm, name: v })
            }
          />

          <Input
            label="Phone Number"
            value={bankVerifyForm.phone}
            onChange={(v) =>
              setBankVerifyForm({ ...bankVerifyForm, phone: v })
            }
          />

          <button
            disabled={verifying}
            onClick={verifyBankHandler}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            Verify Bank
          </button>
        </>
      )}
    </div>
  )}
</div> */}

<div className="border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm bg-white">
  <button
    onClick={() => setOpenVerify(openVerify === "bank" ? null : "bank")}
    className="w-full flex justify-between items-center px-5 py-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-6 bg-blue-500 rounded-full" /> {/* Blue accent for Bank */}
      Verify Bank Account
    </div>
    <span className="text-xl text-slate-400">{openVerify === "bank" ? "−" : "+"}</span>
  </button>

  {openVerify === "bank" && (
    <div className="p-6 border-t border-slate-100 bg-slate-50/30">
      {kyc?.bank_status === "verified" ? (
        /* --- PREMIUM VERIFIED VIEW --- */
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
          
          {/* Left Side: Bank Info */}
          <div className="flex-1 flex flex-col justify-center space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-1">Account Holder</p>
              <p className="text-lg font-bold text-slate-800 uppercase italic">
                {kyc.account_holder_name}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Account Number</p>
                <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
                  {kyc.account_number.replace(/.(?=.{4})/g, '•')} {/* Masks number except last 4 */}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">IFSC Code</p>
                <p className="text-sm font-semibold text-slate-700">{kyc.ifsc_code}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Verification ID</p>
                <p className="text-xs font-medium text-slate-500">#{kyc.bank_verification_id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Verified On</p>
                <p className="text-xs font-medium text-slate-500">{new Date(kyc.bank_verified_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Attractive Premium Badge */}
          <div className="relative flex flex-col items-center justify-center min-w-[180px] py-8 px-4 rounded-3xl bg-white border border-slate-100 shadow-xl overflow-hidden">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%"><pattern id="grid-bank" width="15" height="15" patternUnits="userSpaceOnUse"><path d="M 15 0 L 0 0 0 15" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid-bank)" /></svg>
            </div>

            {/* Layered Icon Stack */}
            <div className="relative flex items-center justify-center mb-4">
               {/* Pulsing Outer Glow */}
               <div className="absolute w-20 h-20 bg-emerald-100 rounded-full animate-pulse" />
               
               {/* Main Shield/Circle Icon */}
               <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
               </div>
            </div>

            <div className="relative text-center">
                <h4 className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">Verified</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Bank Confirmed</p>
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
            onChange={(v) => setBankVerifyForm({ ...bankVerifyForm, name: v })}
          />
          <Input
            label="Account Number"
            placeholder="Enter account number"
            value={bankVerifyForm.bank_account}
            onChange={(v) => setBankVerifyForm({ ...bankVerifyForm, bank_account: v })}
          />
          <Input
            label="IFSC Code"
            placeholder="e.g. SBIN0001234"
            value={bankVerifyForm.ifsc}
            onChange={(v) => setBankVerifyForm({ ...bankVerifyForm, ifsc: v })}
          />
          <Input
            label="Phone Number"
            placeholder="Registered mobile"
            value={bankVerifyForm.phone}
            onChange={(v) => setBankVerifyForm({ ...bankVerifyForm, phone: v })}
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

//       {/* ICON */}
//       <div className="p-4 bg-gray-50 rounded-full">
//         <FileText size={32} className={iconColor} />
//       </div>

//       <span className="font-semibold text-sm text-slate-800">
//         {title}
//       </span>

//       {/* STATUS */}
//       {completed ? (
//         <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//           <CheckCircle size={14} />
//           Uploaded
//         </span>
//       ) : (
//         <div className="flex gap-2">

//           {/* ADD INFO */}
//           <button
//             disabled={completed}
//             onClick={onAdd}
//             className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg
//               ${
//                 completed
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//           >
//             <Plus size={12} />
//             Add Info
//           </button>

//           {/* VIEW */}
//           <button
//             disabled={!hasFile}
//             onClick={onView}
//             className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg
//               ${
//                 hasFile
//                   ? "bg-slate-600 text-white hover:bg-slate-700"
//                   : "bg-gray-200 text-gray-400 cursor-not-allowed"
//               }`}
//           >
//             <Eye size={12} />
//             View
//           </button>

//         </div>
//       )}
//     </div>
//   );
// }

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
//*************************************************working code phase 2********************************************* */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { ArrowLeft,FileText, CheckCircle, Upload , Plus, Eye } from "lucide-react";
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
//   const [kyc, setKyc] = useState(null);
// const [kycLoading, setKycLoading] = useState(true);
// const [kycSubmitting, setKycSubmitting] = useState(false);
// const [showKycModal, setShowKycModal] = useState(false);
// const [activeDoc, setActiveDoc] = useState(null); // aadhaar | pan | bank | photo | offer_letter
// const [selectedFile, setSelectedFile] = useState(null);
// const [kycForm, setKycForm] = useState({
//   aadhaar_number: "",
//   pan_number: "",
//   account_holder_name: "",
//   account_number: "",
//   ifsc_code: "",
// });
// const [documents, setDocuments] = useState([]);
// const [documentsLoading, setDocumentsLoading] = useState(true);

//  const IMAGE_ONLY_DOCS = ["photo", "offer_letter"];
// const META_DOCS = ["aadhaar", "pan", "bank"];

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//     fetchDocuments();
//   }, [id]);

//   useEffect(() => {
//   fetchKyc();
// }, [id]);

// const fetchKyc = async () => {
//   try {
//     const data = await employeeKycService.get(id);
//     if (data) {
//       setKyc(data);
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

// const fetchDocuments = async () => {
//   try {
//     const data = await employeeKycService.getDocuments(id);
//     setDocuments(data);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setDocumentsLoading(false);
//   }
// };

// const getDocument = (type) =>
//   documents.find((d) => d.document_type === type);

//   //   useEffect(() => {
//   //     fetchEmployee();
//   //     fetchAddress();
//   //   }, [id]);

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
//   try {
//     // 1️⃣ IMAGE ONLY (PHOTO / OFFER LETTER)
//     if (IMAGE_ONLY_DOCS.includes(activeDoc)) {
//       if (!selectedFile) {
//         toast.error("Please upload a file");
//         return;
//       }

//       await employeeKycService.uploadDocument(
//         id,
//         activeDoc,
//         selectedFile
//       );

//       toast.success("Document uploaded");
//     }

//     // 2️⃣ METADATA + IMAGE (AADHAAR / PAN / BANK)
//     if (META_DOCS.includes(activeDoc)) {
//       // a) save JSON metadata ONLY
//       await employeeKycService.create(id, kycForm);

//       // b) upload file ONLY
//       if (selectedFile) {
//         await employeeKycService.uploadDocument(
//           id,
//           activeDoc,
//           selectedFile
//         );
//       }

//       toast.success("KYC details saved");
//     }

//     setShowKycModal(false);
//     setSelectedFile(null);
//       await fetchDocuments();
//     fetchKyc();
//   } catch (err) {
//     toast.error(err.message || "Something went wrong");
//   }
// };

// const aadhaarDoc = getDocument("aadhaar");
// const panDoc = getDocument("pan");
// const bankDoc = getDocument("bank");
// const photoDoc = getDocument("photo");
// const offerDoc = getDocument("offer_letter");

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
//                 ) : address.current_address_proof_exists ? (
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
//                 ) : address.permanent_address_proof_exists ? (
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

// {/* DOCUMENTS / KYC SECTION */}
// <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//   <div className="mb-6">
//     <h2 className="text-lg font-bold text-slate-900">📄 Documents (KYC)</h2>
//     <p className="text-sm text-slate-500">
//       Aadhaar, PAN, Bank, Photo & Offer Letter
//     </p>
//   </div>

//   {kycLoading ? (
//     <div className="text-center text-slate-500 py-10">
//       Loading documents...
//     </div>
//   ) : (
//    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

//   <DocumentCard
//     title="Aadhaar"
//     completed={aadhaarDoc?.status === "uploaded"}
//     hasFile={!!aadhaarDoc?.document_path}
//     iconColor={
//       aadhaarDoc?.status === "uploaded"
//         ? "text-green-500"
//         : "text-red-400"
//     }
//     onAdd={() => {
//       setActiveDoc("aadhaar");
//       setShowKycModal(true);
//     }}
//     onView={() =>
//       window.open(
//         `https://emp-onbd-1.onrender.com/${aadhaarDoc.document_path}`,
//         "_blank"
//       )
//     }
//   />

//   <DocumentCard
//     title="PAN"
//     completed={panDoc?.status === "uploaded"}
//     hasFile={!!panDoc?.document_path}
//     iconColor={
//       panDoc?.status === "uploaded"
//         ? "text-green-500"
//         : "text-gray-400"
//     }
//     onAdd={() => {
//       setActiveDoc("pan");
//       setShowKycModal(true);
//     }}
//     onView={() =>
//       window.open(
//         `https://emp-onbd-1.onrender.com/${panDoc.document_path}`,
//         "_blank"
//       )
//     }
//   />

//   <DocumentCard
//     title="Bank Details"
//     completed={bankDoc?.status === "uploaded"}
//     hasFile={!!bankDoc?.document_path}
//     iconColor={
//       bankDoc?.status === "uploaded"
//         ? "text-green-500"
//         : "text-blue-400"
//     }
//     onAdd={() => {
//       setActiveDoc("bank");
//       setShowKycModal(true);
//     }}
//     onView={() =>
//       window.open(
//         `https://emp-onbd-1.onrender.com/${bankDoc.document_path}`,
//         "_blank"
//       )
//     }
//   />

//   <DocumentCard
//     title="Photo"
//     completed={photoDoc?.status === "uploaded"}
//     hasFile={!!photoDoc?.document_path}
//     iconColor={
//       photoDoc?.status === "uploaded"
//         ? "text-green-500"
//         : "text-orange-400"
//     }
//     onAdd={() => {
//       setActiveDoc("photo");
//       setShowKycModal(true);
//     }}
//     onView={() =>
//       window.open(
//         `https://emp-onbd-1.onrender.com/${photoDoc.document_path}`,
//         "_blank"
//       )
//     }
//   />

//   <DocumentCard
//     title="Offer Letter"
//     completed={offerDoc?.status === "uploaded"}
//     hasFile={!!offerDoc?.document_path}
//     iconColor={
//       offerDoc?.status === "uploaded"
//         ? "text-green-500"
//         : "text-green-400"
//     }
//     onAdd={() => {
//       setActiveDoc("offer_letter");
//       setShowKycModal(true);
//     }}
//     onView={() =>
//       window.open(
//         `https://emp-onbd-1.onrender.com/${offerDoc.document_path}`,
//         "_blank"
//       )
//     }
//   />

// </div>

//   )}
// </div>

// {showKycModal && (
//   <Modal
//     title={`Upload ${activeDoc.replace("_", " ")}`}
//     onClose={() => {
//       setShowKycModal(false);
//       setSelectedFile(null);
//     }}
//   >
//     {/* ================= METADATA ================= */}
//     {activeDoc === "aadhaar" && (
//       <Input
//         label="Aadhaar Number"
//         value={kycForm.aadhaar_number}
//         onChange={(v) =>
//           setKycForm({ ...kycForm, aadhaar_number: v })
//         }
//       />
//     )}

//     {activeDoc === "pan" && (
//       <Input
//         label="PAN Number"
//         value={kycForm.pan_number}
//         onChange={(v) =>
//           setKycForm({ ...kycForm, pan_number: v })
//         }
//       />
//     )}

//     {activeDoc === "bank" && (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="Account Holder Name"
//           value={kycForm.account_holder_name}
//           onChange={(v) =>
//             setKycForm({ ...kycForm, account_holder_name: v })
//           }
//         />
//         <Input
//           label="Account Number"
//           value={kycForm.account_number}
//           onChange={(v) =>
//             setKycForm({ ...kycForm, account_number: v })
//           }
//         />
//         <Input
//           label="IFSC Code"
//           value={kycForm.ifsc_code}
//           onChange={(v) =>
//             setKycForm({ ...kycForm, ifsc_code: v })
//           }
//         />
//       </div>
//     )}

//     {/* ================= FILE UPLOAD ================= */}
//     <div className="mt-4">
//       <label className="block text-slate-500 font-medium mb-1">
//         Upload Document
//       </label>
//       <input
//         type="file"
//         onChange={(e) => setSelectedFile(e.target.files[0])}
//       />
//     </div>

//     {/* ================= ACTIONS ================= */}
//     <div className="flex justify-end gap-2 mt-6">
//       <button
//         onClick={() => setShowKycModal(false)}
//         className="px-4 py-2 border rounded-lg text-sm"
//       >
//         Cancel
//       </button>

//       <button
//         onClick={handleKycSubmit}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//       >
//         Save
//       </button>
//     </div>
//   </Modal>
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

// // function DocumentCard({ title, completed, onClick }) {
// //   return (
// //     <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
// //       <span className="font-semibold text-slate-800">{title}</span>

// //       {completed ? (
// //         <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
// //           Uploaded
// //         </span>
// //       ) : (
// //         <button
// //           onClick={onClick}
// //           className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
// //         >
// //           Add Info
// //         </button>
// //       )}
// //     </div>
// //   );
// // }

// // function DocumentCard({ title, completed, onClick,  iconColor = "text-blue-500" }) {
// //   return (
// //     <div className="border border-slate-100 rounded-sm p-4 flex flex-col gap-3 justify-between items-center">
// //       {/* LEFT: ICON + TITLE */}
// //       <div className="p-4 bg-gray-50 rounded-full">
// //         <FileText size={32}  className={iconColor} />
// //       </div>
// //       <div className="flex  items-center gap-2">

// //         <span className="font-semibold text-sm text-slate-800">{title}</span>
// //       </div>

// //       {/* RIGHT: STATUS / ACTION */}
// //       {completed ? (
// //         <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
// //           <CheckCircle size={14} />
// //           Uploaded
// //         </span>
// //       ) : (
// //        <div className="flex gap-3">
// //         <button
// //           onClick={onClick}
// //           className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //         >
// //           <Plus size={12} />
// //           Add Info
// //         </button>
// //         <button
// //           onClick={onClick}
// //           className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //         >
// //           <Eye size={12} />
// //           View
// //         </button>
// //        </div>

// //       )}
// //     </div>
// //   );
// // }

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

//       {/* ICON */}
//       <div className="p-4 bg-gray-50 rounded-full">
//         <FileText size={32} className={iconColor} />
//       </div>

//       <span className="font-semibold text-sm text-slate-800">
//         {title}
//       </span>

//       {/* STATUS */}
//       {completed ? (
//         <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//           <CheckCircle size={14} />
//           Uploaded
//         </span>
//       ) : (
//         <div className="flex gap-2">

//           {/* ADD INFO */}
//           <button
//             disabled={completed}
//             onClick={onAdd}
//             className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg
//               ${
//                 completed
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//           >
//             <Plus size={12} />
//             Add Info
//           </button>

//           {/* VIEW */}
//           <button
//             disabled={!hasFile}
//             onClick={onView}
//             className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg
//               ${
//                 hasFile
//                   ? "bg-slate-600 text-white hover:bg-slate-700"
//                   : "bg-gray-200 text-gray-400 cursor-not-allowed"
//               }`}
//           >
//             <Eye size={12} />
//             View
//           </button>

//         </div>
//       )}
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
//****************************************working code 19-1-26******************************************************** */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { ArrowLeft } from "lucide-react";
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
//   const [documents, setDocuments] = useState([]);
// const [showDocumentModal, setShowDocumentModal] = useState(false);
// const [documentType, setDocumentType] = useState("");
// const [documentFile, setDocumentFile] = useState(null);
// const [documentForm, setDocumentForm] = useState({
//   aadhaar_number: "",
//   pan_number: "",
//   account_holder_name: "",
//   account_number: "",
//   ifsc_code: "",
// });

// useEffect(() => {
//   fetchEmployee();
//   fetchAddress();
//   fetchDocuments();
// }, [id]);

// //   useEffect(() => {
// //     fetchEmployee();
// //     fetchAddress();
// //   }, [id]);

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

// //  const fetchDocuments = async () => {
// //   try {
// //     const data = await employeeKycService.getDocuments(id);
// //     setDocuments(data || []);
// //   } catch (err) {
// //     console.error(err);
// //   }
// // };

// const fetchDocuments = async () => {
//   try {
//     const data = await employeeKycService.getDocuments(id);

//     const docs = [];

//     if (data.aadhaar_number) {
//       docs.push({
//         type: "aadhaar",
//         label: "Aadhaar",
//         number: data.aadhaar_number,
//         status: data.aadhaar_status,
//         exists: data.aadhaar_document_exists,
//         url: data.aadhaar_document_url,
//       });
//     }

//     if (data.pan_number) {
//       docs.push({
//         type: "pan",
//         label: "PAN",
//         number: data.pan_number,
//         status: data.pan_status,
//         exists: data.pan_document_exists,
//         url: data.pan_document_url,
//       });
//     }

//     if (data.bank_status) {
//       docs.push({
//         type: "bank",
//         label: "Bank",
//         status: data.bank_status,
//         exists: data.bank_document_exists,
//         url: data.bank_document_url,
//       });
//     }

//     setDocuments(docs);
//   } catch (err) {
//     console.error(err);
//   }
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
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-slate-200 text-slate-700"
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
//                 ) : address.current_address_proof_exists ? (
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
//                             e.target.files[0]
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
//                 ) : address.permanent_address_proof_exists ? (
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
//                             e.target.files[0]
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

//       {/* DOCUMENT SECTION */}
// <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//   {/* HEADER */}
//   <div className="flex items-center justify-between mb-6">
//     <div>
//       <h2 className="text-lg font-bold text-slate-900">📄 Documents</h2>
//       <p className="text-sm text-slate-500">
//         Employee uploaded documents
//       </p>
//     </div>

//     <button
//       onClick={() => setShowDocumentModal(true)}
//       className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg"
//     >
//       Upload Document
//     </button>
//   </div>

//   {/* CONTENT */}
//   {documents.length === 0 ? (
//     <div className="text-sm text-slate-500">No documents uploaded</div>
//   ) : (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//       {documents.map((doc) => (
//         <div
//           key={doc.id}
//           className="border border-slate-200 rounded-xl p-4 flex justify-between"
//         >
//           <div>
//             <span className="block text-slate-500 font-medium mb-1">
//               {doc.document_type.replace("_", " ").toUpperCase()}
//             </span>
//             <a
//               href={doc.document_url}
//               target="_blank"
//               className="text-blue-600 text-sm font-semibold"
//             >
//               View Document
//             </a>
//           </div>

//           <span
//             className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
//               doc.status === "verified"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-yellow-100 text-yellow-700"
//             }`}
//           >
//             {doc.status}
//           </span>
//         </div>
//       ))}
//     </div>
//   )}
// </div>

// {showDocumentModal && (
//   <Modal title="Upload Document" onClose={() => setShowDocumentModal(false)}>
//     {/* DOCUMENT TYPE */}
//     <div className="mb-4">
//       <label className="block text-slate-500 font-medium mb-1">
//         Document Type
//       </label>
//       <select
//         value={documentType}
//         onChange={(e) => setDocumentType(e.target.value)}
//         className="w-full border rounded-lg px-3 py-2 text-sm"
//       >
//         <option value="">Select document</option>
//         <option value="photo">Photo</option>
//         <option value="offer_letter">Offer Letter</option>
//         <option value="aadhaar">Aadhaar</option>
//         <option value="pan">PAN</option>
//         <option value="bank">Bank</option>
//       </select>
//     </div>

//     {/* CONDITIONAL INPUTS */}
//     {documentType === "aadhaar" && (
//       <Input
//         label="Aadhaar Number"
//         value={documentForm.aadhaar_number}
//         onChange={(v) =>
//           setDocumentForm({ ...documentForm, aadhaar_number: v })
//         }
//       />
//     )}

//     {documentType === "pan" && (
//       <Input
//         label="PAN Number"
//         value={documentForm.pan_number}
//         onChange={(v) =>
//           setDocumentForm({ ...documentForm, pan_number: v })
//         }
//       />
//     )}

//     {documentType === "bank" && (
//       <>
//         <Input
//           label="Account Holder Name"
//           value={documentForm.account_holder_name}
//           onChange={(v) =>
//             setDocumentForm({ ...documentForm, account_holder_name: v })
//           }
//         />
//         <Input
//           label="Account Number"
//           value={documentForm.account_number}
//           onChange={(v) =>
//             setDocumentForm({ ...documentForm, account_number: v })
//           }
//         />
//         <Input
//           label="IFSC Code"
//           value={documentForm.ifsc_code}
//           onChange={(v) =>
//             setDocumentForm({ ...documentForm, ifsc_code: v })
//           }
//         />
//       </>
//     )}

//     {/* FILE UPLOAD */}
//     <div className="mt-4">
//       <label className="block text-slate-500 font-medium mb-1">
//         Upload File
//       </label>
//       <input
//         type="file"
//         onChange={(e) => setDocumentFile(e.target.files[0])}
//       />
//     </div>

//     {/* ACTIONS */}
//     <div className="flex justify-end gap-2 mt-6">
//       <button
//         onClick={() => setShowDocumentModal(false)}
//         className="px-4 py-2 border rounded-lg text-sm"
//       >
//         Cancel
//       </button>

//       {/* <button
//         onClick={async () => {
//           try {
//             await employeeService.uploadDocument(id, {
//               document_type: documentType,
//               file: documentFile,
//               ...documentForm,
//             });
//             toast.success("Document uploaded");
//             setShowDocumentModal(false);
//             fetchDocuments();
//           } catch (err) {
//             toast.error(err.message);
//           }
//         }}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//       >
//         Upload
//       </button> */}

//       <button
//   onClick={async () => {
//     try {
//       // basic validation
//       if (!documentType) {
//         toast.error("Please select document type");
//         return;
//       }

//       if (!documentFile) {
//         toast.error("Please upload a file");
//         return;
//       }

//       // 1️⃣ Call CREATE only for Aadhaar / PAN / Bank
//       if (["aadhaar", "pan", "bank"].includes(documentType)) {
//         await employeeKycService.create(id, {
//         //   document_type: documentType,
//           ...documentForm,
//         });
//       }

//       // 2️⃣ Always upload document file
//       await employeeKycService.uploadDocument(
//         id,
//         documentType,
//         documentFile
//       );

//       toast.success("Document uploaded successfully");
//       setShowDocumentModal(false);
//       fetchDocuments();
//     } catch (err) {
//       toast.error(err.message || "Upload failed");
//     }
//   }}
//   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
// >
//   Upload
// </button>

//     </div>
//   </Modal>
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
//****************************************************working code phase 1011********************************************************** */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { ArrowLeft } from "lucide-react";
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
//   const [documents, setDocuments] = useState([]);
// const [showDocumentModal, setShowDocumentModal] = useState(false);
// const [documentType, setDocumentType] = useState("");
// const [documentFile, setDocumentFile] = useState(null);
// const [documentForm, setDocumentForm] = useState({
//   aadhaar_number: "",
//   pan_number: "",
//   account_holder_name: "",
//   account_number: "",
//   ifsc_code: "",
// });

// useEffect(() => {
//   fetchEmployee();
//   fetchAddress();
//   fetchDocuments();
// }, [id]);

// //   useEffect(() => {
// //     fetchEmployee();
// //     fetchAddress();
// //   }, [id]);

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

//  const fetchDocuments = async () => {
//   try {
//     const data = await employeeKycService.getDocuments(id);
//     setDocuments(data || []);
//   } catch (err) {
//     console.error(err);
//   }
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
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-slate-200 text-slate-700"
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
//                 ) : address.current_address_proof_exists ? (
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
//                             e.target.files[0]
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
//                 ) : address.permanent_address_proof_exists ? (
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
//                             e.target.files[0]
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

//       {/* DOCUMENT SECTION */}
// <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//   {/* HEADER */}
//   <div className="flex items-center justify-between mb-6">
//     <div>
//       <h2 className="text-lg font-bold text-slate-900">📄 Documents</h2>
//       <p className="text-sm text-slate-500">
//         Employee uploaded documents
//       </p>
//     </div>

//     <button
//       onClick={() => setShowDocumentModal(true)}
//       className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg"
//     >
//       Upload Document
//     </button>
//   </div>

//   {/* CONTENT */}
//   {documents.length === 0 ? (
//     <div className="text-sm text-slate-500">No documents uploaded</div>
//   ) : (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//       {documents.map((doc) => (
//         <div
//           key={doc.id}
//           className="border border-slate-200 rounded-xl p-4 flex justify-between"
//         >
//           <div>
//             <span className="block text-slate-500 font-medium mb-1">
//               {doc.document_type.replace("_", " ").toUpperCase()}
//             </span>
//             <a
//               href={doc.document_url}
//               target="_blank"
//               className="text-blue-600 text-sm font-semibold"
//             >
//               View Document
//             </a>
//           </div>

//           <span
//             className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
//               doc.status === "verified"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-yellow-100 text-yellow-700"
//             }`}
//           >
//             {doc.status}
//           </span>
//         </div>
//       ))}
//     </div>
//   )}
// </div>

// {showDocumentModal && (
//   <Modal title="Upload Document" onClose={() => setShowDocumentModal(false)}>
//     {/* DOCUMENT TYPE */}
//     <div className="mb-4">
//       <label className="block text-slate-500 font-medium mb-1">
//         Document Type
//       </label>
//       <select
//         value={documentType}
//         onChange={(e) => setDocumentType(e.target.value)}
//         className="w-full border rounded-lg px-3 py-2 text-sm"
//       >
//         <option value="">Select document</option>
//         <option value="photo">Photo</option>
//         <option value="offer_letter">Offer Letter</option>
//         <option value="aadhaar">Aadhaar</option>
//         <option value="pan">PAN</option>
//         <option value="bank">Bank</option>
//       </select>
//     </div>

//     {/* CONDITIONAL INPUTS */}
//     {documentType === "aadhaar" && (
//       <Input
//         label="Aadhaar Number"
//         value={documentForm.aadhaar_number}
//         onChange={(v) =>
//           setDocumentForm({ ...documentForm, aadhaar_number: v })
//         }
//       />
//     )}

//     {documentType === "pan" && (
//       <Input
//         label="PAN Number"
//         value={documentForm.pan_number}
//         onChange={(v) =>
//           setDocumentForm({ ...documentForm, pan_number: v })
//         }
//       />
//     )}

//     {documentType === "bank" && (
//       <>
//         <Input
//           label="Account Holder Name"
//           value={documentForm.account_holder_name}
//           onChange={(v) =>
//             setDocumentForm({ ...documentForm, account_holder_name: v })
//           }
//         />
//         <Input
//           label="Account Number"
//           value={documentForm.account_number}
//           onChange={(v) =>
//             setDocumentForm({ ...documentForm, account_number: v })
//           }
//         />
//         <Input
//           label="IFSC Code"
//           value={documentForm.ifsc_code}
//           onChange={(v) =>
//             setDocumentForm({ ...documentForm, ifsc_code: v })
//           }
//         />
//       </>
//     )}

//     {/* FILE UPLOAD */}
//     <div className="mt-4">
//       <label className="block text-slate-500 font-medium mb-1">
//         Upload File
//       </label>
//       <input
//         type="file"
//         onChange={(e) => setDocumentFile(e.target.files[0])}
//       />
//     </div>

//     {/* ACTIONS */}
//     <div className="flex justify-end gap-2 mt-6">
//       <button
//         onClick={() => setShowDocumentModal(false)}
//         className="px-4 py-2 border rounded-lg text-sm"
//       >
//         Cancel
//       </button>

//       <button
//         onClick={async () => {
//           try {
//             await employeeService.uploadDocument(id, {
//               document_type: documentType,
//               file: documentFile,
//               ...documentForm,
//             });
//             toast.success("Document uploaded");
//             setShowDocumentModal(false);
//             fetchDocuments();
//           } catch (err) {
//             toast.error(err.message);
//           }
//         }}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//       >
//         Upload
//       </button>
//     </div>
//   </Modal>
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
//*******************************************working code phase 99************************************************************ */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { ArrowLeft } from "lucide-react";
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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//   }, [id]);

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
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-slate-200 text-slate-700"
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
//                 ) : address.current_address_proof_exists ? (
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
//                             e.target.files[0]
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
//                 ) : address.permanent_address_proof_exists ? (
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
//                             e.target.files[0]
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
//*****************************************working code phase 88***************************************************** */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { ArrowLeft } from "lucide-react";
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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//   }, [id]);

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

//   // const handleSaveAddress = async () => {
//   //   try {
//   //     if (address) {
//   //       await employeeAddressService.update(id, form);
//   //     } else {
//   //       await employeeAddressService.create(id, form);
//   //     }
//   //     onSaved();
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

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
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-slate-200 text-slate-700"
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
//                 ) : address.current_document_uploaded ? (
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
//                             e.target.files[0]
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
//                 ) : address.permanent_document_uploaded ? (
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
//                             e.target.files[0]
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

//             {/* <button
//         onClick={async () => {
//           await employeeAddressService.verify(id, verifyForm);
//           setShowVerifyModal(false);
//           fetchAddress();
//         }}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//       >
//         Verify
//       </button> */}

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
//***************************************working code phase 4*************************************************** */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { ArrowLeft } from "lucide-react";
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

//   useEffect(() => {
//     fetchEmployee();
//     fetchAddress();
//   }, [id]);

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

//   // const handleSaveAddress = async () => {
//   //   try {
//   //     if (address) {
//   //       await employeeAddressService.update(id, form);
//   //     } else {
//   //       await employeeAddressService.create(id, form);
//   //     }
//   //     onSaved();
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

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
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-slate-200 text-slate-700"
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

//               <div className="flex items-start">
//                 {address.current_address_status === "pending" ? (
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
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* PERMANENT ADDRESS CARD */}
//             <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//               <ReadBlock
//                 title="Permanent Address"
//                 value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//               />

//               <div className="flex items-start">
//                 {address.permanent_address_status === "pending" ? (
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
//                   <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//                     Verified
//                   </span>
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

//             {/* <button
//         onClick={async () => {
//           await employeeAddressService.verify(id, verifyForm);
//           setShowVerifyModal(false);
//           fetchAddress();
//         }}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//       >
//         Verify
//       </button> */}

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
//*********************************************working code phase 2***************************************************** */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { employeeAddressService } from "../../services/employeeAddress.service";
// import { ArrowLeft } from "lucide-react";
// import toast from "react-hot-toast";

// export default function EmployeeDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState(null);
// const [addressLoading, setAddressLoading] = useState(true);
// const [showAddressModal, setShowAddressModal] = useState(false);
// const [addressForm, setAddressForm] = useState({
//   current_address_line1: "",
//   current_address_line2: "",
//   current_city: "",
//   current_state: "",
//   current_pincode: "",
//   permanent_address_line1: "",
//   permanent_address_line2: "",
//   permanent_city: "",
//   permanent_state: "",
//   permanent_pincode: "",
// });
// const [showVerifyModal, setShowVerifyModal] = useState(false);

// const [verifyForm, setVerifyForm] = useState({
//   type: "",
//   status: "verified",
//   remarks: "",
// });

// useEffect(() => {
//   fetchEmployee();
//   fetchAddress();
// }, [id]);

// //   useEffect(() => {
// //     fetchEmployee();
// //   }, [id]);

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

//  const fetchAddress = async () => {
//   try {
//     const data = await employeeAddressService.get(id);
//     if (data) {
//       setAddress(data);
//       setAddressForm(data);
//     } else {
//       setAddress(null);
//     }
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setAddressLoading(false);
//   }
// };

// const handleSaveAddress = async () => {
//   try {
//     if (address) {
//       await employeeAddressService.update(id, form);
//     } else {
//       await employeeAddressService.create(id, form);
//     }
//     onSaved();
//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleVerifyAddress = async () => {
//   try {
//     await employeeAddressService.verify(id, verifyForm);
//     fetchAddress();
//   } catch (err) {
//     console.error(err);
//   }
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
//       </div>

// {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
// <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">

//     {/* COLUMN 1 */}
//     <div className="space-y-3">
//       <GridItem label="Employee Code" value={employee.employee_code} bold />
//       <GridItem label="Full Name" value={employee.full_name} />
//     </div>

//     {/* COLUMN 2 */}
//     <div className="space-y-3">
//       <GridItem label="Email" value={employee.email} />
//       <GridItem label="Phone" value={employee.phone} />
//     </div>

//     {/* COLUMN 3 */}
//     <div className="space-y-3">
//       <GridItem label="Role" value={employee.role} />
//       <GridItem label="Joining Date" value={employee.joining_date} />
//     </div>

//     {/* COLUMN 4 */}
//     <div className="space-y-3">
//       {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//       <GridItem label="Department Name" value={employee.department_name} />
//       <GridItem label="Status">
//         <span
//           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//             employee.status === "active"
//               ? "bg-green-100 text-green-700"
//               : employee.status === "created"
//               ? "bg-blue-100 text-blue-700"
//               : "bg-slate-200 text-slate-700"
//           }`}
//         >
//           {employee.status}
//         </span>
//       </GridItem>
//     </div>

//   </div>
// </div>

// {/* ADDRESS SECTION */}
// {/* ADDRESS SECTION */}
// <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//   {/* HEADER */}
//   <div className="flex items-center justify-between mb-6">
//     <div>
//       <h2 className="text-lg font-bold text-slate-900">
//         🏠 Address Details
//       </h2>
//       <p className="text-sm text-slate-500">
//         Current & permanent address information
//       </p>
//     </div>

//     <button
//       onClick={() => setShowAddressModal(true)}
//       className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//     >
//       {address ? "Update Address" : "Add Address"}
//     </button>
//   </div>

//   {/* CONTENT */}
//   {addressLoading ? (
//     <div className="text-center py-10 text-slate-500">
//       Loading address...
//     </div>
//   ) : address ? (
//     // <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//     //   <ReadBlock
//     //     title="Current Address"
//     //     value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//     //   />
//     //   <ReadBlock
//     //     title="Permanent Address"
//     //     value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//     //   />
//     // </div>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

//   {/* CURRENT ADDRESS CARD */}
//   <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//     <ReadBlock
//       title="Current Address"
//       value={`${address.current_address_line1}, ${address.current_city}, ${address.current_state} - ${address.current_pincode}`}
//     />

//     <div className="flex items-start">
//       {address.current_address_status === "pending" ? (
//         <button
//           onClick={() => {
//             setVerifyForm({
//               type: "current",
//               status: "verified",
//               remarks: "",
//             });
//             setShowVerifyModal(true);
//           }}
//           className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//         >
//           Verify
//         </button>
//       ) : (
//         <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//           Verified
//         </span>
//       )}
//     </div>
//   </div>

//   {/* PERMANENT ADDRESS CARD */}
//   <div className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
//     <ReadBlock
//       title="Permanent Address"
//       value={`${address.permanent_address_line1}, ${address.permanent_city}, ${address.permanent_state} - ${address.permanent_pincode}`}
//     />

//     <div className="flex items-start">
//       {address.permanent_address_status === "pending" ? (
//         <button
//           onClick={() => {
//             setVerifyForm({
//               type: "permanent",
//               status: "verified",
//               remarks: "",
//             });
//             setShowVerifyModal(true);
//           }}
//           className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg"
//         >
//           Verify
//         </button>
//       ) : (
//         <span className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg">
//           Verified
//         </span>
//       )}
//     </div>
//   </div>

// </div>

//   ) : (
//     <div className="text-sm text-slate-500 py-6">
//       No address added yet.
//     </div>
//   )}
// </div>

// {showAddressModal && (
//   <Modal
//     title={address ? "Update Address" : "Add Address"}
//     onClose={() => setShowAddressModal(false)}
//   >
//     {/* CURRENT ADDRESS */}
//     <div className="mb-6">
//       <h3 className="text-md font-semibold text-slate-800 mb-3">
//         Current Address
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//         <Input
//           label="Address Line 1"
//           value={addressForm.current_address_line1}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, current_address_line1: v })
//           }
//         />
//         <Input
//           label="Address Line 2"
//           value={addressForm.current_address_line2}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, current_address_line2: v })
//           }
//         />
//         <Input
//           label="City"
//           value={addressForm.current_city}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, current_city: v })
//           }
//         />
//         <Input
//           label="State"
//           value={addressForm.current_state}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, current_state: v })
//           }
//         />
//         <Input
//           label="Pincode"
//           value={addressForm.current_pincode}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, current_pincode: v })
//           }
//         />
//       </div>
//     </div>

//     {/* PERMANENT ADDRESS */}
//     <div className="mb-8">
//       <h3 className="text-md font-semibold text-slate-800 mb-3">
//         Permanent Address
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//         <Input
//           label="Address Line 1"
//           value={addressForm.permanent_address_line1}
//           onChange={(v) =>
//             setAddressForm({
//               ...addressForm,
//               permanent_address_line1: v,
//             })
//           }
//         />
//         <Input
//           label="Address Line 2"
//           value={addressForm.permanent_address_line2}
//           onChange={(v) =>
//             setAddressForm({
//               ...addressForm,
//               permanent_address_line2: v,
//             })
//           }
//         />
//         <Input
//           label="City"
//           value={addressForm.permanent_city}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, permanent_city: v })
//           }
//         />
//         <Input
//           label="State"
//           value={addressForm.permanent_state}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, permanent_state: v })
//           }
//         />
//         <Input
//           label="Pincode"
//           value={addressForm.permanent_pincode}
//           onChange={(v) =>
//             setAddressForm({ ...addressForm, permanent_pincode: v })
//           }
//         />
//       </div>
//     </div>

//     {/* ACTIONS */}
//     <div className="flex justify-end gap-2">
//       <button
//         onClick={() => setShowAddressModal(false)}
//         className="px-4 py-2 border rounded-lg text-sm"
//       >
//         Cancel
//       </button>

//       <button
//         onClick={async () => {
//           if (address) {
//             await employeeAddressService.update(id, addressForm);
//           } else {
//             await employeeAddressService.create(id, addressForm);
//           }
//           setShowAddressModal(false);
//           fetchAddress();
//         }}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//       >
//         {address ? "Update Address" : "Save Address"}
//       </button>
//     </div>
//   </Modal>
// )}

// {showVerifyModal && (
//   <Modal title="Verify Address" onClose={() => setShowVerifyModal(false)}>

//     {/* INFO */}
//     <p className="text-sm text-slate-600 mb-4">
//       Verifying{" "}
//       <span className="font-semibold capitalize">
//         {verifyForm.type}
//       </span>{" "}
//       address
//     </p>

//     {/* REMARKS (ONLY INPUT) */}
//     <div className="mb-6">
//       <label className="block text-slate-500 font-medium mb-1">
//         Remarks
//       </label>
//       <textarea
//         value={verifyForm.remarks}
//         onChange={(e) =>
//           setVerifyForm({ ...verifyForm, remarks: e.target.value })
//         }
//         placeholder="Enter verification remarks"
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>

//     {/* ACTIONS */}
//     <div className="flex justify-end gap-2">
//       <button
//         onClick={() => setShowVerifyModal(false)}
//         className="px-4 py-2 border rounded-lg text-sm"
//       >
//         Cancel
//       </button>

//       <button
//         onClick={async () => {
//           await employeeAddressService.verify(id, verifyForm);
//           setShowVerifyModal(false);
//           fetchAddress();
//         }}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
//       >
//         Verify
//       </button>
//     </div>

//   </Modal>
// )}

//     </div>
//   );
// }

// /* ---------- SMALL UI HELPERS ---------- */

// function Info({ label, value, bold }) {
//   return (
//     <div>
//       <span className="block text-slate-500 font-medium mb-1">
//         {label}
//       </span>
//       <span
//         className={`text-slate-900 ${
//           bold ? "font-bold" : "font-semibold"
//         }`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">
//         {label}
//       </label>
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
//       <span className="block text-slate-500 font-medium mb-1">
//         {label}
//       </span>

//       {children ? (
//         children
//       ) : (
//         <span
//           className={`text-slate-900 ${
//             bold ? "font-bold" : "font-semibold"
//           }`}
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
//       <span className="block text-slate-500 font-medium mb-1">
//         {title}
//       </span>
//       <span className="font-semibold text-slate-800">
//         {value}
//       </span>
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

// function AddressField({ label, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">
//         {label}
//       </label>

//       {type === "file" ? (
//         <input
//           type="file"
//           className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-slate-100 file:text-slate-700"
//         />
//       ) : (
//         <input
//           type="text"
//           placeholder={`Enter ${label}`}
//           className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       )}
//     </div>
//   );
// }

//*********************************************working code phase 1************************************************* */
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import { ArrowLeft } from "lucide-react";

// export default function EmployeeDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchEmployee();
//   }, [id]);

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

// {/* EMPLOYEE DETAILS – SINGLE GRID CARD */}
// <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">

//     {/* COLUMN 1 */}
//     <div className="space-y-3">
//       <GridItem label="Employee Code" value={employee.employee_code} bold />
//       <GridItem label="Full Name" value={employee.full_name} />
//     </div>

//     {/* COLUMN 2 */}
//     <div className="space-y-3">
//       <GridItem label="Email" value={employee.email} />
//       <GridItem label="Phone" value={employee.phone} />
//     </div>

//     {/* COLUMN 3 */}
//     <div className="space-y-3">
//       <GridItem label="Role" value={employee.role} />
//       <GridItem label="Joining Date" value={employee.joining_date} />
//     </div>

//     {/* COLUMN 4 */}
//     <div className="space-y-3">
//       {/* <GridItem label="Department ID" value={employee.department_id} /> */}
//       <GridItem label="Department Name" value={employee.department_name} />
//       <GridItem label="Status">
//         <span
//           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//             employee.status === "active"
//               ? "bg-green-100 text-green-700"
//               : employee.status === "created"
//               ? "bg-blue-100 text-blue-700"
//               : "bg-slate-200 text-slate-700"
//           }`}
//         >
//           {employee.status}
//         </span>
//       </GridItem>
//     </div>

//   </div>
// </div>

// {/* ADDRESS SECTION */}
// <div className="mt-10 space-y-6">

//   {/* SECTION HEADER */}
//   <div>
//     <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//       🏠 Address Details
//     </h2>
//     <p className="text-sm text-slate-500 mt-1">
//       Current and permanent address information
//     </p>
//   </div>

//   {/* CURRENT ADDRESS */}
//   <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//     <h3 className="text-lg font-semibold text-slate-800 mb-4">
//       Current Address
//     </h3>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//       <AddressField label="Address Line 1" />
//       <AddressField label="Address Line 2" />
//       <AddressField label="City" />
//       <AddressField label="State" />
//       <AddressField label="Pincode" />
//       <AddressField label="Address Proof" type="file" />

//       <div>
//         <span className="block text-slate-500 font-medium mb-1">
//           Status
//         </span>
//         <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
//           Pending
//         </span>
//       </div>
//     </div>

//     <div className="mt-6">
//       <button className="px-4 py-2 text-sm font-semibold border border-slate-300 rounded-lg hover:bg-slate-100">
//         Copy to Permanent Address
//       </button>
//     </div>
//   </div>

//   {/* PERMANENT ADDRESS */}
//   <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
//     <h3 className="text-lg font-semibold text-slate-800 mb-4">
//       Permanent Address
//     </h3>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//       <AddressField label="Address Line 1" />
//       <AddressField label="Address Line 2" />
//       <AddressField label="City" />
//       <AddressField label="State" />
//       <AddressField label="Pincode" />
//       <AddressField label="Address Proof" type="file" />

//       <div>
//         <span className="block text-slate-500 font-medium mb-1">
//           Status
//         </span>
//         <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
//           Pending
//         </span>
//       </div>
//     </div>
//   </div>
// </div>

//     </div>
//   );
// }

// /* ---------- SMALL UI HELPERS ---------- */

// function Info({ label, value, bold }) {
//   return (
//     <div>
//       <span className="block text-slate-500 font-medium mb-1">
//         {label}
//       </span>
//       <span
//         className={`text-slate-900 ${
//           bold ? "font-bold" : "font-semibold"
//         }`}
//       >
//         {value}
//       </span>
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
//       <span className="block text-slate-500 font-medium mb-1">
//         {label}
//       </span>

//       {children ? (
//         children
//       ) : (
//         <span
//           className={`text-slate-900 ${
//             bold ? "font-bold" : "font-semibold"
//           }`}
//         >
//           {value ?? "-"}
//         </span>
//       )}
//     </div>
//   );
// }

// function AddressField({ label, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-slate-500 font-medium mb-1">
//         {label}
//       </label>

//       {type === "file" ? (
//         <input
//           type="file"
//           className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-slate-100 file:text-slate-700"
//         />
//       ) : (
//         <input
//           type="text"
//           placeholder={`Enter ${label}`}
//           className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       )}
//     </div>
//   );
// }
