import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Download,
  Loader2,
  Calendar,
  FileType,
} from "lucide-react";

const PolicyStepper = ({ employeeId = 4 }) => {
  const [templates, setTemplates] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agreeLoading, setAgreeLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [mergeLoading, setMergeLoading] = useState(false);

  // --- NEW STATE FOR IFRAME LOADING ---
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://apihrr.goelectronix.co.in/policies/templates",
        );
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchTemplates();
    fetchStatus();
  }, []);

  // Reset iframe loader whenever step changes
  useEffect(() => {
    setIframeLoading(true);
  }, [step]);

  const currentTemplate = templates[step];

  const fetchStatus = async () => {
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/policies/status/${employeeId}`,
      );
      if (!res.ok) throw new Error("Status fetch failed");
      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.error("Status API Error", err);
    }
  };

  const handleAgree = async () => {
    if (!currentTemplate) return;
    setAgreeLoading(true);
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
        { method: "POST", headers: { Accept: "application/json" } },
      );
      if (!res.ok) throw new Error("Generate API failed");
      await fetchStatus();
      setCompleted((prev) => [...prev, currentTemplate.id]);
    } catch (err) {
      console.error(err);
    }
    setAgreeLoading(false);
  };

  const getCurrentStatus = () => {
    if (!statusData || !currentTemplate) return null;
    const keyBase = currentTemplate.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/\.pdf$/, "");
    return {
      status: statusData?.[`${keyBase}_status`],
      path: statusData?.[`${keyBase}_path`],
    };
  };

  const handleMergePolicies = async () => {
    setMergeLoading(true);
    try {
      const res = await fetch(
        `https://apihrr.goelectronix.co.in/policies/merge/${employeeId}`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error("Merge failed");

      await fetchStatus(); // refresh merged status
    } catch (err) {
      console.error("Merge API Error", err);
    }
    setMergeLoading(false);
  };

  const allPoliciesGenerated = () => {
    if (!statusData) return false;

    return Object.keys(statusData)
      .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
      .every((k) => statusData[k] === "generated");
  };

  const mergedPending =
    statusData?.merged_policy_status === "pending" && allPoliciesGenerated();

  const showFinalMergeScreen =
    statusData &&
    statusData.merged_policy_status === "pending" &&
    Object.keys(statusData)
      .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
      .every((k) => statusData[k] === "generated");

  const currentStatus = getCurrentStatus();

  const isCurrentGenerated = currentStatus?.status === "generated";



  const TEMPLATE_LABELS = {
  employment_declaration: "Employment Declaration Form",
  probation_policy: "Probation Policy Agreement",
  leave_policy: "Leave & Holiday Policy",
  attendance_policy: "Attendance & Working Hours Policy",
  dress_code_policy: "Dress Code Guidelines",
  id_card_policy: "ID Card & Identity Policy",
  termination_policy: "Termination & Exit Policy",
  nda_policy: "Non-Disclosure Agreement (NDA)",
  it_usage_policy: "IT & System Usage Policy",
  loan_policy: "Employee Loan Policy",
  code_of_conduct: "Code of Conduct Declaration",
  non_compete_policy: "Non-Compete Agreement",
  epf_declaration: "EPF Declaration Form",
  gratuity_form: "Gratuity Nomination Form",
  employment_agreement: "Employment Agreement Contract",
};


const getTemplateLabel = (name) => {
  return TEMPLATE_LABELS[name] || name.replace(/_/g, " ");
};


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Initializing Secure Vault...
        </p>
      </div>
    );
  }

  if (!templates.length)
    return (
      <div className="text-center py-20 font-black text-slate-400">
        NO ASSETS DETECTED
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
      {/* ENTERPRISE HEADER */}
      <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">
              Compliance & Policy Engine
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Employee ID: {employeeId.toString().padStart(4, "0")}
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Session Protocol
          </p>
          <p className="text-[11px] font-bold text-blue-400">SSL-ENCRYPTED</p>
        </div>
      </div>

      {showFinalMergeScreen ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {/* SUCCESS ICON WITH AMBIENT GLOW */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-emerald-400/20 blur-[40px] rounded-full animate-pulse" />
            <div className="relative w-28 h-28 rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
          </div>

          {/* MAIN HEADLINE */}
          <div className="space-y-3 mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {/* Verification Milestone Reached */}
              Employee Policy Generated
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-slate-200" />
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                All Assets Generated
              </p>
              <span className="h-[1px] w-8 bg-slate-200" />
            </div>
          </div>

          <p className="text-sm text-slate-500 max-w-lg mb-12 leading-relaxed font-medium">
            Individual policy agreements have been successfully staged. To
            finalize your onboarding protocol, please authorize the master
            compliance merger below.
          </p>

          {/* FINAL TERMS BOX — THE "LEGAL VAULT" LOOK */}
          {/* <div className="relative bg-slate-50 border border-slate-200 rounded-[2rem] p-10 max-w-2xl mb-12 text-left shadow-sm overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <ShieldCheck size={120} className="text-slate-900" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                  Master Compliance Declaration
                </h4>
              </div>

              <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                By executing the{" "}
                <span className="text-slate-900 font-bold">
                  "Agree All Policies"
                </span>{" "}
                command, you provide a binding digital signature. You
                acknowledge that you have reviewed all organizational protocols
                and agree to adhere to the employment terms, security
                regulations, and code of conduct established by the enterprise.
              </p>
            </div>
          </div> */}

          {/* FINAL ACTION BUTTON */}
          <button
            onClick={handleMergePolicies}
            disabled={mergeLoading}
            className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center gap-4 overflow-hidden"
          >
            {mergeLoading ? (
              <>
                <Loader2 size={18} className="animate-spin text-blue-400" />
                <span>Synthesizing Final Deed...</span>
              </>
            ) : (
              <>
                <ShieldCheck
                  size={18}
                  className="group-hover:text-emerald-400 transition-colors"
                />
                <span>Agree to All Company Policies</span>
              </>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          {/* SECURITY FOOTER */}
          <div className="mt-8 flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">
                RSA-2048 Signed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">
                Tamper Evident
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {statusData?.merged_policy_status === "generated" &&
          statusData?.merged_policy_path ? (
            /* ===== AFTER MERGE SUCCESS ===== */

            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
              {/* SUCCESS BADGE */}
              <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl mb-10 shadow-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 animate-pulse" />
                  <CheckCircle2
                    size={20}
                    className="relative text-emerald-600"
                  />
                </div>
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">
                  Protocol Finalized & Encrypted
                </span>
              </div>

              {/* FINAL DOWNLOAD CARD */}
              <div className="relative w-full max-w-md bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden group border border-slate-800">
                {/* DECORATIVE ELEMENTS */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                <div className="relative z-10 text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <FileText size={32} className="text-emerald-400" />
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                    Master Compliance Deed
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-8">
                    Ref:{" "}
                    {statusData.merged_policy_path?.split("/").pop() ||
                      "COMP-FINAL-01"}
                  </p>

                  {/* ACTION BUTTON */}

                  <button
                    onClick={async () => {
                      try {
                        const url = `https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}`;

                        const response = await fetch(url, {
                          method: "GET",
                          headers: {
                            Accept: "application/pdf",
                          },
                        });

                        if (!response.ok) throw new Error("Download failed");

                        const blob = await response.blob();

                        const blobUrl = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = blobUrl;
                        link.download = "Final_Compliance_Policies.pdf"; // file name
                        document.body.appendChild(link);
                        link.click();

                        link.remove();
                        window.URL.revokeObjectURL(blobUrl);
                      } catch (err) {
                        console.error("Download error", err);
                        alert("Failed to download file");
                      }
                    }}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Download size={18} strokeWidth={3} />
                    Download Secured PDF
                  </button>

                  {/* MICRO METADATA */}
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center opacity-60">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-500 uppercase">
                        Format
                      </p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase">
                        PDF / ISO 32000
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase">
                        Status
                      </p>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase">
                        Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* REDIRECT HINT (Optional) */}
              <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                A copy has been sent to your registered corporate email.
              </p>
            </div>
          ) : (
            <>
              <div className="p-8">
                {/* PROGRESS STEPPER */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
                  {templates.map((t, index) => {
                    const isActive = index === step;
                    const isDone =
                      completed.includes(t.id) ||
                      statusData?.[
                        `${t.name
                          .toLowerCase()
                          .replace(/\s+/g, "_")
                          .replace(/\.pdf$/, "")}_status`
                      ] === "generated";

                    return (
                      <React.Fragment key={t.id}>
                        <div
                          onClick={() => setStep(index)}
                          className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border ${
                            isActive
                              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                              : isDone
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                : "bg-white border-slate-100 text-slate-400"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : isDone
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-100"
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={14} /> : index + 1}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
                            Step {index + 1}
                          </span>
                        </div>
                        {index !== templates.length - 1 && (
                          <div className="w-8 h-[2px] bg-slate-100 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* MAIN INTERFACE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* <div className="lg:col-span-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-sm">
                          <FileType size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                            {currentTemplate.name.replace(/_/g, " ")}
                          </h3>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Object ID: {currentTemplate.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500">
                          {new Date(
                            currentTemplate.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-inner h-[550px]">
                      {iframeLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[2px]">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Rendering Document...
                          </p>
                        </div>
                      )}

                      {statusData?.merged_policy_status === "generated" &&
                      statusData?.merged_policy_path ? (
                        <iframe
                          src={`https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}#zoom=51&toolbar=0`}
                          title="Merged Policy"
                          className="w-full h-full"
                          onLoad={() => setIframeLoading(false)}
                        />
                      ) : currentStatus?.status === "generated" &&
                        currentStatus?.path ? (
                        <iframe
                          src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=51&toolbar=0`}
                          title="Generated Policy"
                          className="w-full h-full"
                          onLoad={() => setIframeLoading(false)}
                        />
                      ) : currentTemplate.file_path?.endsWith(".pdf") ? (
                        <iframe
                          src={currentTemplate.file_path}
                          title="Policy Document"
                          className="w-full h-full"
                          onLoad={() => setIframeLoading(false)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                          <FileText size={48} className="opacity-20" />
                          <p className="text-xs font-bold uppercase tracking-widest">
                            {currentTemplate.file_path}
                          </p>
                        </div>
                      )}
                    </div>
                  </div> */}
                  {/* LEFT PANEL — DOCUMENT VIEWER */}
<div className="lg:col-span-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 relative overflow-hidden group">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-sm">
        <FileType size={18} />
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
          {/* {currentTemplate.name.replace(/_/g, " ")} */}
          {getTemplateLabel(currentTemplate.name)}
        </h3>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          Object ID: {currentTemplate.id}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
      <Calendar size={12} className="text-slate-400" />
      <span className="text-[10px] font-bold text-slate-500">
        {new Date(currentTemplate.created_at).toLocaleDateString()}
      </span>
    </div>
  </div>

  <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-inner h-[550px]">
    
    {/* --- NEW: GENERATION LOADER OVERLAY --- */}
    {/* {(agreeLoading || iframeLoading) && (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-[4px] animate-in fade-in duration-300">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
          <div className="relative w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl border border-slate-800">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
          Rendering Document...
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
          {agreeLoading ? "Executing Secure Generation Protocol" : "Optimizing Visual Asset"}
        </p>
      </div>
    )} */}
    {(agreeLoading || iframeLoading) && (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white animate-in fade-in duration-500">
    
    {/* CENTERED TEMPLATE IDENTITY DATA */}
    <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
      
      {/* ASSET ICON */}
      <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800 mb-2">
        <FileType size={32} className="text-blue-500" />
      </div>

      {/* TEXT DATA */}
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">
            System Identity Node
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
            {/* {currentTemplate.name.replace(/_/g, " ")} */}
            {getTemplateLabel(currentTemplate.name)}
          </h3>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Object ID: <span className="text-slate-900">{currentTemplate.id}</span>
            </p>
          </div>
          
          {/* SYSTEM STATUS LABEL */}
          <div className="flex items-center gap-2 mt-4">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               {agreeLoading ? "Generating Secure PDF..." : "Initializing Frame View..."}
             </p>
          </div>
        </div>
      </div>
    </div>

    {/* FOOTER AUTHENTICITY BAR */}
    <div className="absolute bottom-10 flex items-center gap-6 text-slate-300">
       <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-widest">Verified Template Asset</span>
       </div>
       <div className="w-[1px] h-3 bg-slate-200" />
       <div className="text-[9px] font-black uppercase tracking-widest">Employee Directory Protocol</div>
    </div>
  </div>
)}

    {/* EXISTING IFRAME LOGIC (UNTOUCHED) */}
    {statusData?.merged_policy_status === "generated" &&
    statusData?.merged_policy_path ? (
      <iframe
        src={`https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}#zoom=51&toolbar=0`}
        title="Merged Policy"
        className="w-full h-full"
        onLoad={() => setIframeLoading(false)}
      />
    ) : currentStatus?.status === "generated" &&
      currentStatus?.path ? (
      <iframe
        src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=51&toolbar=0`}
        title="Generated Policy"
        className="w-full h-full"
        onLoad={() => setIframeLoading(false)}
      />
    ) : currentTemplate.file_path?.endsWith(".pdf") ? (
      <iframe
        src={currentTemplate.file_path}
        title="Policy Document"
        className="w-full h-full"
        onLoad={() => setIframeLoading(false)}
      />
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <FileText size={48} className="opacity-20" />
        <p className="text-xs font-bold uppercase tracking-widest">
          {currentTemplate.file_path}
        </p>
      </div>
    )}
  </div>
</div>

                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -z-0" />

                      <div className="relative z-10">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                          Execution Panel
                        </h4>
                        <div className="space-y-4">
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-800 mb-2 leading-relaxed">
                              Compliance Verification
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                              "By generating this document, you confirm that you
                              have read and understood the organizational
                              protocols."
                            </p>
                          </div>

                          {currentStatus?.status === "generated" ? (
                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-emerald-700 uppercase leading-none mb-1">
                                  Asset Verified
                                </p>
                                <p className="text-[9px] font-bold text-emerald-600/70">
                                  Signature recorded successfully
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                                <Loader2 size={16} className="animate-spin" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">
                                  Awaiting Action
                                </p>
                                <p className="text-[9px] font-bold text-amber-600/70">
                                  Execution required to proceed
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 space-y-3">
                        {currentStatus?.status === "generated" ? (
                          <a
                            href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                          >
                            <Download size={16} /> Download Copy
                          </a>
                        ) : (
                          <button
                            onClick={handleAgree}
                            disabled={agreeLoading}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
                          >
                            {agreeLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ShieldCheck size={16} />
                            )}
                            {agreeLoading
                              ? "Encrypting Data..."
                              : "Generate Document"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        disabled={step === 0}
                        onClick={() => setStep(step - 1)}
                        className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
                      >
                        <ArrowLeft size={14} /> Previous
                      </button>

                      {/* <button
                        // disabled={step === templates.length - 1}
                        disabled={step === templates.length - 1 || !isCurrentGenerated}
                        onClick={() => setStep(step + 1)}
                        className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
                      >
                        Next <ArrowRight size={14} />
                      </button> */}
                      <button
  disabled={step === templates.length - 1 || !isCurrentGenerated}
  onClick={() => setStep(step + 1)}
  className={`py-4 rounded-2xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
    ${
      step === templates.length - 1 || !isCurrentGenerated
        ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
        : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
    }
  `}
>
  Next <ArrowRight size={14} />
</button>

                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PolicyStepper;
//*********************************************working code phase 1 11/02/26****************************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText, ShieldCheck, Download, Loader2, Calendar, FileType } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);
//   const [statusData, setStatusData] = useState(null);
//   const [mergeLoading, setMergeLoading] = useState(false);

//   // --- NEW STATE FOR IFRAME LOADING ---
//   const [iframeLoading, setIframeLoading] = useState(true);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("https://apihrr.goelectronix.co.in/policies/templates");
//         if (!res.ok) throw new Error("Failed to fetch templates");
//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) { console.error(err); }
//       setLoading(false);
//     };

//     fetchTemplates();
//     fetchStatus();
//   }, []);

//   // Reset iframe loader whenever step changes
//   useEffect(() => {
//     setIframeLoading(true);
//   }, [step]);

//   const currentTemplate = templates[step];

//   const fetchStatus = async () => {
//     try {
//       const res = await fetch(`https://apihrr.goelectronix.co.in/policies/status/${employeeId}`);
//       if (!res.ok) throw new Error("Status fetch failed");
//       const data = await res.json();
//       setStatusData(data);
//     } catch (err) { console.error("Status API Error", err); }
//   };

//   const handleAgree = async () => {
//     if (!currentTemplate) return;
//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         { method: "POST", headers: { Accept: "application/json" } }
//       );
//       if (!res.ok) throw new Error("Generate API failed");
//       await fetchStatus();
//       setCompleted((prev) => [...prev, currentTemplate.id]);
//     } catch (err) { console.error(err); }
//     setAgreeLoading(false);
//   };

//   const getCurrentStatus = () => {
//     if (!statusData || !currentTemplate) return null;
//     const keyBase = currentTemplate.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "");
//     return {
//       status: statusData?.[`${keyBase}_status`],
//       path: statusData?.[`${keyBase}_path`],
//     };
//   };

//   const handleMergePolicies = async () => {
//   setMergeLoading(true);
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/merge/${employeeId}`,
//       { method: "POST" }
//     );

//     if (!res.ok) throw new Error("Merge failed");

//     await fetchStatus(); // refresh merged status

//   } catch (err) {
//     console.error("Merge API Error", err);
//   }
//   setMergeLoading(false);
// };

// const allPoliciesGenerated = () => {
//   if (!statusData) return false;

//   return Object.keys(statusData)
//     .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
//     .every((k) => statusData[k] === "generated");
// };

// const mergedPending =
//   statusData?.merged_policy_status === "pending" && allPoliciesGenerated();

//   const showFinalMergeScreen =
//   statusData &&
//   statusData.merged_policy_status === "pending" &&
//   Object.keys(statusData)
//     .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
//     .every((k) => statusData[k] === "generated");

//   const currentStatus = getCurrentStatus();

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-[500px] gap-4">
//         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Secure Vault...</p>
//       </div>
//     );
//   }

//   if (!templates.length) return <div className="text-center py-20 font-black text-slate-400">NO ASSETS DETECTED</div>;

//   return (
//     <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">

//       {/* ENTERPRISE HEADER */}
//       <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
//             <ShieldCheck size={24} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">Compliance & Policy Engine</h2>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Employee ID: {employeeId.toString().padStart(4, '0')}
//             </p>
//           </div>
//         </div>
//         <div className="hidden md:block text-right">
//           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Protocol</p>
//           <p className="text-[11px] font-bold text-blue-400">SSL-ENCRYPTED</p>
//         </div>
//       </div>

//       {showFinalMergeScreen ? (

// <div className="flex flex-col items-center justify-center py-24 text-center">

//   {/* SUCCESS ICON WITH AMBIENT GLOW */}
//   <div className="relative mb-10">
//     <div className="absolute inset-0 bg-emerald-400/20 blur-[40px] rounded-full animate-pulse" />
//     <div className="relative w-28 h-28 rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
//       <CheckCircle2 size={48} className="text-emerald-400" />
//     </div>
//   </div>

//   {/* MAIN HEADLINE */}
//   <div className="space-y-3 mb-10">
//     <h2 className="text-3xl font-black text-slate-900 tracking-tight">
//       Verification Milestone Reached
//     </h2>
//     <div className="flex items-center justify-center gap-2">
//       <span className="h-[1px] w-8 bg-slate-200" />
//       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
//         All Assets Generated
//       </p>
//       <span className="h-[1px] w-8 bg-slate-200" />
//     </div>
//   </div>

//   <p className="text-sm text-slate-500 max-w-lg mb-12 leading-relaxed font-medium">
//     Individual policy agreements have been successfully staged. To finalize your
//     onboarding protocol, please authorize the master compliance merger below.
//   </p>

//   {/* FINAL TERMS BOX — THE "LEGAL VAULT" LOOK */}
//   <div className="relative bg-slate-50 border border-slate-200 rounded-[2rem] p-10 max-w-2xl mb-12 text-left shadow-sm overflow-hidden group">
//     <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
//       <ShieldCheck size={120} className="text-slate-900" />
//     </div>

//     <div className="relative z-10">
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//           Master Compliance Declaration
//         </h4>
//       </div>

//       <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
//         By executing the <span className="text-slate-900 font-bold">"Agree All Policies"</span> command,
//         you provide a binding digital signature. You acknowledge that you have reviewed all
//         organizational protocols and agree to adhere to the employment terms, security
//         regulations, and code of conduct established by the enterprise.
//       </p>
//     </div>
//   </div>

//   {/* FINAL ACTION BUTTON */}
//   <button
//     onClick={handleMergePolicies}
//     disabled={mergeLoading}
//     className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center gap-4 overflow-hidden"
//   >
//     {mergeLoading ? (
//       <>
//         <Loader2 size={18} className="animate-spin text-blue-400" />
//         <span>Synthesizing Final Deed...</span>
//       </>
//     ) : (
//       <>
//         <ShieldCheck size={18} className="group-hover:text-emerald-400 transition-colors" />
//         <span>Agree to All Company Policies</span>
//       </>
//     )}

//     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//   </button>

//   {/* SECURITY FOOTER */}
//   <div className="mt-8 flex items-center gap-4 text-slate-400">
//     <div className="flex items-center gap-1.5">
//       <div className="w-1 h-1 rounded-full bg-slate-300" />
//       <span className="text-[9px] font-bold uppercase tracking-tighter">RSA-2048 Signed</span>
//     </div>
//     <div className="flex items-center gap-1.5">
//       <div className="w-1 h-1 rounded-full bg-slate-300" />
//       <span className="text-[9px] font-bold uppercase tracking-tighter">Tamper Evident</span>
//     </div>
//   </div>

// </div>

// ) : (

// <>
// {statusData?.merged_policy_status === "generated" && statusData?.merged_policy_path ? (

//   /* ===== AFTER MERGE SUCCESS ===== */
// //   <div className="flex flex-col items-center gap-6">

// //     <div className="flex items-center gap-2 text-emerald-600">
// //       <CheckCircle2 size={18} />
// //       <span className="text-[11px] font-black uppercase tracking-widest">
// //         Compliance Completed
// //       </span>
// //     </div>

// //     {/* DIRECT DOWNLOAD BUTTON */}
// //     <button
// //       onClick={() => {
// //         const link = document.createElement("a");
// //         link.href = `https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}`;
// //         link.download = "Final_Compliance_Policies.pdf";
// //         document.body.appendChild(link);
// //         link.click();
// //         document.body.removeChild(link);
// //       }}
// //       className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl flex items-center gap-3"
// //     >
// //       <Download size={18} />
// //       Download Final Document
// //     </button>

// //   </div>

// <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">

//   {/* SUCCESS BADGE */}
//   <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl mb-10 shadow-sm">
//     <div className="relative">
//       <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 animate-pulse" />
//       <CheckCircle2 size={20} className="relative text-emerald-600" />
//     </div>
//     <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">
//       Protocol Finalized & Encrypted
//     </span>
//   </div>

//   {/* FINAL DOWNLOAD CARD */}
//   <div className="relative w-full max-w-md bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden group border border-slate-800">

//     {/* DECORATIVE ELEMENTS */}
//     <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
//     <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

//     <div className="relative z-10 text-center">
//       <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
//         <FileText size={32} className="text-emerald-400" />
//       </div>

//       <h3 className="text-lg font-black uppercase tracking-tight mb-2">
//         Master Compliance Deed
//       </h3>
//       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-8">
//         Ref: {statusData.merged_policy_path?.split('/').pop() || "COMP-FINAL-01"}
//       </p>

//       {/* ACTION BUTTON */}
//       {/* <button
//         onClick={() => {
//           const link = document.createElement("a");
//           link.href = `https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}`;
//           link.download = "Final_Compliance_Policies.pdf";
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         }}
//         className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
//       >
//         <Download size={18} strokeWidth={3} />
//         Download Secured PDF
//       </button> */}
//       <button
//   onClick={async () => {
//     try {
//       const url = `https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}`;

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/pdf",
//         },
//       });

//       if (!response.ok) throw new Error("Download failed");

//       const blob = await response.blob();

//       const blobUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = "Final_Compliance_Policies.pdf"; // file name
//       document.body.appendChild(link);
//       link.click();

//       link.remove();
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.error("Download error", err);
//       alert("Failed to download file");
//     }
//   }}
//   className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
// >
//   <Download size={18} strokeWidth={3} />
//   Download Secured PDF
// </button>

//       {/* MICRO METADATA */}
//       <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center opacity-60">
//         <div className="text-left">
//           <p className="text-[8px] font-black text-slate-500 uppercase">Format</p>
//           <p className="text-[10px] font-bold text-slate-300 uppercase">PDF / ISO 32000</p>
//         </div>
//         <div className="text-right">
//           <p className="text-[8px] font-black text-slate-500 uppercase">Status</p>
//           <p className="text-[10px] font-bold text-emerald-400 uppercase">Verified</p>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* REDIRECT HINT (Optional) */}
//   <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//     A copy has been sent to your registered corporate email.
//   </p>
// </div>

// ) : (

//   <>
//     <div className="p-8">
//         {/* PROGRESS STEPPER */}
//         <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
//           {templates.map((t, index) => {
//             const isActive = index === step;
//             const isDone = completed.includes(t.id) || (statusData?.[`${t.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "")}_status`] === 'generated');

//             return (
//               <React.Fragment key={t.id}>
//                 <div
//                   onClick={() => setStep(index)}
//                   className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border ${
//                     isActive ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" :
//                     isDone ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-slate-100 text-slate-400"
//                   }`}
//                 >
//                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
//                     isActive ? "bg-blue-600 text-white" : isDone ? "bg-emerald-500 text-white" : "bg-slate-100"
//                   }`}>
//                     {isDone ? <CheckCircle2 size={14} /> : index + 1}
//                   </div>
//                   <span className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap">Step {index + 1}</span>
//                 </div>
//                 {index !== templates.length - 1 && <div className="w-8 h-[2px] bg-slate-100 shrink-0" />}
//               </React.Fragment>
//             );
//           })}
//         </div>

//         {/* MAIN INTERFACE GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           <div className="lg:col-span-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 relative overflow-hidden group">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-sm">
//                   <FileType size={18} />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
//                     {currentTemplate.name.replace(/_/g, " ")}
//                   </h3>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Object ID: {currentTemplate.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
//                 <Calendar size={12} className="text-slate-400" />
//                 <span className="text-[10px] font-bold text-slate-500">{new Date(currentTemplate.created_at).toLocaleDateString()}</span>
//               </div>
//             </div>

//             <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-inner h-[550px]">

//               {iframeLoading && (
//                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[2px]">
//                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
//                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendering Document...</p>
//                 </div>
//               )}

// {statusData?.merged_policy_status === "generated" &&
//  statusData?.merged_policy_path ? (
//   <iframe
//     src={`https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}#zoom=51&toolbar=0`}
//     title="Merged Policy"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : currentStatus?.status === "generated" && currentStatus?.path ? (
//   <iframe
//     src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=51&toolbar=0`}
//     title="Generated Policy"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//   <iframe
//     src={currentTemplate.file_path}
//     title="Policy Document"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : (
//   <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
//     <FileText size={48} className="opacity-20" />
//     <p className="text-xs font-bold uppercase tracking-widest">
//       {currentTemplate.file_path}
//     </p>
//   </div>
// )}

//             </div>
//           </div>

//           <div className="lg:col-span-4 flex flex-col gap-6">
//             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
//                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -z-0" />

//                <div className="relative z-10">
//                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Execution Panel</h4>
//                 <div className="space-y-4">
//                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
//                     <p className="text-xs font-bold text-slate-800 mb-2 leading-relaxed">Compliance Verification</p>
//                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
//                       "By generating this document, you confirm that you have read and understood the organizational protocols."
//                     </p>
//                   </div>

//                   {currentStatus?.status === "generated" ? (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
//                         <CheckCircle2 size={16} />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-emerald-700 uppercase leading-none mb-1">Asset Verified</p>
//                         <p className="text-[9px] font-bold text-emerald-600/70">Signature recorded successfully</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
//                         <Loader2 size={16} className="animate-spin" />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">Awaiting Action</p>
//                         <p className="text-[9px] font-bold text-amber-600/70">Execution required to proceed</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                </div>

//                <div className="mt-8 space-y-3">
//                 {currentStatus?.status === "generated" ? (
//                   <a
//                     href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
//                   >
//                     <Download size={16} /> Download Copy
//                   </a>
//                 ) : (
//                   <button
//                     onClick={handleAgree}
//                     disabled={agreeLoading}
//                     className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
//                   >
//                     {agreeLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
//                     {agreeLoading ? "Encrypting Data..." : "Generate Document"}
//                   </button>
//                 )}
//                </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 disabled={step === 0}
//                 onClick={() => setStep(step - 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
//               >
//                 <ArrowLeft size={14} /> Previous
//               </button>

//               <button
//                 disabled={step === templates.length - 1}
//                 onClick={() => setStep(step + 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
//               >
//                 Next <ArrowRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//   </>

// )}
// </>

//       )}

//     </div>
//   );
// };

// export default PolicyStepper;
//***************************************************working code phase 22*************************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText, ShieldCheck, Download, Loader2, Calendar, FileType } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);
//   const [statusData, setStatusData] = useState(null);
//   const [mergeLoading, setMergeLoading] = useState(false);

//   // --- NEW STATE FOR IFRAME LOADING ---
//   const [iframeLoading, setIframeLoading] = useState(true);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("https://apihrr.goelectronix.co.in/policies/templates");
//         if (!res.ok) throw new Error("Failed to fetch templates");
//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) { console.error(err); }
//       setLoading(false);
//     };

//     fetchTemplates();
//     fetchStatus();
//   }, []);

//   // Reset iframe loader whenever step changes
//   useEffect(() => {
//     setIframeLoading(true);
//   }, [step]);

//   const currentTemplate = templates[step];

//   const fetchStatus = async () => {
//     try {
//       const res = await fetch(`https://apihrr.goelectronix.co.in/policies/status/${employeeId}`);
//       if (!res.ok) throw new Error("Status fetch failed");
//       const data = await res.json();
//       setStatusData(data);
//     } catch (err) { console.error("Status API Error", err); }
//   };

//   const handleAgree = async () => {
//     if (!currentTemplate) return;
//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         { method: "POST", headers: { Accept: "application/json" } }
//       );
//       if (!res.ok) throw new Error("Generate API failed");
//       await fetchStatus();
//       setCompleted((prev) => [...prev, currentTemplate.id]);
//     } catch (err) { console.error(err); }
//     setAgreeLoading(false);
//   };

//   const getCurrentStatus = () => {
//     if (!statusData || !currentTemplate) return null;
//     const keyBase = currentTemplate.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "");
//     return {
//       status: statusData?.[`${keyBase}_status`],
//       path: statusData?.[`${keyBase}_path`],
//     };
//   };

//   const handleMergePolicies = async () => {
//   setMergeLoading(true);
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/merge/${employeeId}`,
//       { method: "POST" }
//     );

//     if (!res.ok) throw new Error("Merge failed");

//     await fetchStatus(); // refresh merged status

//   } catch (err) {
//     console.error("Merge API Error", err);
//   }
//   setMergeLoading(false);
// };

// const allPoliciesGenerated = () => {
//   if (!statusData) return false;

//   return Object.keys(statusData)
//     .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
//     .every((k) => statusData[k] === "generated");
// };

// const mergedPending =
//   statusData?.merged_policy_status === "pending" && allPoliciesGenerated();

//   const showFinalMergeScreen =
//   statusData &&
//   statusData.merged_policy_status === "pending" &&
//   Object.keys(statusData)
//     .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
//     .every((k) => statusData[k] === "generated");

//   const currentStatus = getCurrentStatus();

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-[500px] gap-4">
//         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Secure Vault...</p>
//       </div>
//     );
//   }

//   if (!templates.length) return <div className="text-center py-20 font-black text-slate-400">NO ASSETS DETECTED</div>;

//   return (
//     <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">

//       {/* ENTERPRISE HEADER */}
//       <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
//             <ShieldCheck size={24} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">Compliance & Policy Engine</h2>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Employee ID: {employeeId.toString().padStart(4, '0')}
//             </p>
//           </div>
//         </div>
//         <div className="hidden md:block text-right">
//           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Protocol</p>
//           <p className="text-[11px] font-bold text-blue-400">SSL-ENCRYPTED</p>
//         </div>
//       </div>

//       {showFinalMergeScreen ? (

//   /* ================= FINAL MERGE FULL SCREEN ================= */
// //   <div className="flex flex-col items-center justify-center py-28 text-center">

// //     <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center mb-6 shadow-inner">
// //       <CheckCircle2 size={40} className="text-emerald-600" />
// //     </div>

// //     <h2 className="text-2xl font-black text-slate-900 mb-3">
// //       All Documents Generated Successfully
// //     </h2>

// //     <p className="text-sm text-slate-500 max-w-md mb-8">
// //       You have successfully completed all individual policy agreements.
// //       Please accept the final company terms & conditions to complete your compliance.
// //     </p>

// //     <div className="bg-slate-50 border rounded-2xl p-6 max-w-xl mb-8 text-left shadow-sm">
// //       <p className="text-xs font-black text-slate-700 mb-2 uppercase">
// //         Final Terms & Conditions
// //       </p>
// //       <p className="text-[11px] text-slate-500 leading-relaxed">
// //         By clicking "Agree All Policies", you legally acknowledge that you
// //         have read, understood, and accepted all organizational policies,
// //         compliance regulations, and employment terms provided by the company.
// //       </p>
// //     </div>

// //     <button
// //       onClick={handleMergePolicies}
// //       disabled={mergeLoading}
// //       className="px-10 py-4 bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-800 disabled:opacity-50 flex items-center gap-3 shadow-lg"
// //     >
// //       {mergeLoading ? (
// //         <>
// //           <Loader2 size={16} className="animate-spin" />
// //           Merging Documents...
// //         </>
// //       ) : (
// //         <>
// //           <ShieldCheck size={16} />
// //           Agree All Policies
// //         </>
// //       )}
// //     </button>

// //   </div>

// <div className="flex flex-col items-center justify-center py-24 text-center">

//   {/* SUCCESS ICON WITH AMBIENT GLOW */}
//   <div className="relative mb-10">
//     <div className="absolute inset-0 bg-emerald-400/20 blur-[40px] rounded-full animate-pulse" />
//     <div className="relative w-28 h-28 rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
//       <CheckCircle2 size={48} className="text-emerald-400" />
//     </div>
//   </div>

//   {/* MAIN HEADLINE */}
//   <div className="space-y-3 mb-10">
//     <h2 className="text-3xl font-black text-slate-900 tracking-tight">
//       Verification Milestone Reached
//     </h2>
//     <div className="flex items-center justify-center gap-2">
//       <span className="h-[1px] w-8 bg-slate-200" />
//       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
//         All Assets Generated
//       </p>
//       <span className="h-[1px] w-8 bg-slate-200" />
//     </div>
//   </div>

//   <p className="text-sm text-slate-500 max-w-lg mb-12 leading-relaxed font-medium">
//     Individual policy agreements have been successfully staged. To finalize your
//     onboarding protocol, please authorize the master compliance merger below.
//   </p>

//   {/* FINAL TERMS BOX — THE "LEGAL VAULT" LOOK */}
//   <div className="relative bg-slate-50 border border-slate-200 rounded-[2rem] p-10 max-w-2xl mb-12 text-left shadow-sm overflow-hidden group">
//     <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
//       <ShieldCheck size={120} className="text-slate-900" />
//     </div>

//     <div className="relative z-10">
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//           Master Compliance Declaration
//         </h4>
//       </div>

//       <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
//         By executing the <span className="text-slate-900 font-bold">"Agree All Policies"</span> command,
//         you provide a binding digital signature. You acknowledge that you have reviewed all
//         organizational protocols and agree to adhere to the employment terms, security
//         regulations, and code of conduct established by the enterprise.
//       </p>
//     </div>
//   </div>

//   {/* FINAL ACTION BUTTON */}
//   <button
//     onClick={handleMergePolicies}
//     disabled={mergeLoading}
//     className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center gap-4 overflow-hidden"
//   >
//     {mergeLoading ? (
//       <>
//         <Loader2 size={18} className="animate-spin text-blue-400" />
//         <span>Synthesizing Final Deed...</span>
//       </>
//     ) : (
//       <>
//         <ShieldCheck size={18} className="group-hover:text-emerald-400 transition-colors" />
//         <span>Agree to All Company Policies</span>
//       </>
//     )}

//     {/* SUBTLE BUTTON GLOSS */}
//     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//   </button>

//   {/* SECURITY FOOTER */}
//   <div className="mt-8 flex items-center gap-4 text-slate-400">
//     <div className="flex items-center gap-1.5">
//       <div className="w-1 h-1 rounded-full bg-slate-300" />
//       <span className="text-[9px] font-bold uppercase tracking-tighter">RSA-2048 Signed</span>
//     </div>
//     <div className="flex items-center gap-1.5">
//       <div className="w-1 h-1 rounded-full bg-slate-300" />
//       <span className="text-[9px] font-bold uppercase tracking-tighter">Tamper Evident</span>
//     </div>
//   </div>

// </div>

// ) : (

//   /* ================= ORIGINAL UI ================= */
//   <div className="p-8">
//         {/* PROGRESS STEPPER */}
//         <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
//           {templates.map((t, index) => {
//             const isActive = index === step;
//             const isDone = completed.includes(t.id) || (statusData?.[`${t.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "")}_status`] === 'generated');

//             return (
//               <React.Fragment key={t.id}>
//                 <div
//                   onClick={() => setStep(index)}
//                   className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border ${
//                     isActive ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" :
//                     isDone ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-slate-100 text-slate-400"
//                   }`}
//                 >
//                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
//                     isActive ? "bg-blue-600 text-white" : isDone ? "bg-emerald-500 text-white" : "bg-slate-100"
//                   }`}>
//                     {isDone ? <CheckCircle2 size={14} /> : index + 1}
//                   </div>
//                   <span className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap">Step {index + 1}</span>
//                 </div>
//                 {index !== templates.length - 1 && <div className="w-8 h-[2px] bg-slate-100 shrink-0" />}
//               </React.Fragment>
//             );
//           })}
//         </div>

//         {/* MAIN INTERFACE GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           <div className="lg:col-span-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 relative overflow-hidden group">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-sm">
//                   <FileType size={18} />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
//                     {currentTemplate.name.replace(/_/g, " ")}
//                   </h3>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Object ID: {currentTemplate.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
//                 <Calendar size={12} className="text-slate-400" />
//                 <span className="text-[10px] font-bold text-slate-500">{new Date(currentTemplate.created_at).toLocaleDateString()}</span>
//               </div>
//             </div>

//             <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-inner h-[550px]">

//               {iframeLoading && (
//                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[2px]">
//                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
//                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendering Document...</p>
//                 </div>
//               )}

// {statusData?.merged_policy_status === "generated" &&
//  statusData?.merged_policy_path ? (
//   <iframe
//     src={`https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}#zoom=51&toolbar=0`}
//     title="Merged Policy"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : currentStatus?.status === "generated" && currentStatus?.path ? (
//   <iframe
//     src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=51&toolbar=0`}
//     title="Generated Policy"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//   <iframe
//     src={currentTemplate.file_path}
//     title="Policy Document"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : (
//   <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
//     <FileText size={48} className="opacity-20" />
//     <p className="text-xs font-bold uppercase tracking-widest">
//       {currentTemplate.file_path}
//     </p>
//   </div>
// )}

//             </div>
//           </div>

//           <div className="lg:col-span-4 flex flex-col gap-6">
//             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
//                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -z-0" />

//                <div className="relative z-10">
//                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Execution Panel</h4>
//                 <div className="space-y-4">
//                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
//                     <p className="text-xs font-bold text-slate-800 mb-2 leading-relaxed">Compliance Verification</p>
//                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
//                       "By generating this document, you confirm that you have read and understood the organizational protocols."
//                     </p>
//                   </div>

//                   {currentStatus?.status === "generated" ? (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
//                         <CheckCircle2 size={16} />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-emerald-700 uppercase leading-none mb-1">Asset Verified</p>
//                         <p className="text-[9px] font-bold text-emerald-600/70">Signature recorded successfully</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
//                         <Loader2 size={16} className="animate-spin" />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">Awaiting Action</p>
//                         <p className="text-[9px] font-bold text-amber-600/70">Execution required to proceed</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                </div>

//                <div className="mt-8 space-y-3">
//                 {currentStatus?.status === "generated" ? (
//                   <a
//                     href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
//                   >
//                     <Download size={16} /> Download Copy
//                   </a>
//                 ) : (
//                   <button
//                     onClick={handleAgree}
//                     disabled={agreeLoading}
//                     className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
//                   >
//                     {agreeLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
//                     {agreeLoading ? "Encrypting Data..." : "Generate Document"}
//                   </button>
//                 )}
//                </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 disabled={step === 0}
//                 onClick={() => setStep(step - 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
//               >
//                 <ArrowLeft size={14} /> Previous
//               </button>

//               <button
//                 disabled={step === templates.length - 1}
//                 onClick={() => setStep(step + 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
//               >
//                 Next <ArrowRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//       )}

//     </div>
//   );
// };

// export default PolicyStepper;
//**************************************************************************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText, ShieldCheck, Download, Loader2, Calendar, FileType } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);
//   const [statusData, setStatusData] = useState(null);
//   const [mergeLoading, setMergeLoading] = useState(false);

//   // --- NEW STATE FOR IFRAME LOADING ---
//   const [iframeLoading, setIframeLoading] = useState(true);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("https://apihrr.goelectronix.co.in/policies/templates");
//         if (!res.ok) throw new Error("Failed to fetch templates");
//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) { console.error(err); }
//       setLoading(false);
//     };

//     fetchTemplates();
//     fetchStatus();
//   }, []);

//   // Reset iframe loader whenever step changes
//   useEffect(() => {
//     setIframeLoading(true);
//   }, [step]);

//   const currentTemplate = templates[step];

//   const fetchStatus = async () => {
//     try {
//       const res = await fetch(`https://apihrr.goelectronix.co.in/policies/status/${employeeId}`);
//       if (!res.ok) throw new Error("Status fetch failed");
//       const data = await res.json();
//       setStatusData(data);
//     } catch (err) { console.error("Status API Error", err); }
//   };

//   const handleAgree = async () => {
//     if (!currentTemplate) return;
//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         { method: "POST", headers: { Accept: "application/json" } }
//       );
//       if (!res.ok) throw new Error("Generate API failed");
//       await fetchStatus();
//       setCompleted((prev) => [...prev, currentTemplate.id]);
//     } catch (err) { console.error(err); }
//     setAgreeLoading(false);
//   };

//   const getCurrentStatus = () => {
//     if (!statusData || !currentTemplate) return null;
//     const keyBase = currentTemplate.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "");
//     return {
//       status: statusData?.[`${keyBase}_status`],
//       path: statusData?.[`${keyBase}_path`],
//     };
//   };

//   const handleMergePolicies = async () => {
//   setMergeLoading(true);
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/merge/${employeeId}`,
//       { method: "POST" }
//     );

//     if (!res.ok) throw new Error("Merge failed");

//     await fetchStatus(); // refresh merged status

//   } catch (err) {
//     console.error("Merge API Error", err);
//   }
//   setMergeLoading(false);
// };

// const allPoliciesGenerated = () => {
//   if (!statusData) return false;

//   return Object.keys(statusData)
//     .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
//     .every((k) => statusData[k] === "generated");
// };

// const mergedPending =
//   statusData?.merged_policy_status === "pending" && allPoliciesGenerated();

//   const showFinalMergeScreen =
//   statusData &&
//   statusData.merged_policy_status === "pending" &&
//   Object.keys(statusData)
//     .filter((k) => k.endsWith("_status") && k !== "merged_policy_status")
//     .every((k) => statusData[k] === "generated");

//   const currentStatus = getCurrentStatus();

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-[500px] gap-4">
//         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Secure Vault...</p>
//       </div>
//     );
//   }

//   if (!templates.length) return <div className="text-center py-20 font-black text-slate-400">NO ASSETS DETECTED</div>;

//   return (
//     <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">

//       {/* ENTERPRISE HEADER */}
//       <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
//             <ShieldCheck size={24} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">Compliance & Policy Engine</h2>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Employee ID: {employeeId.toString().padStart(4, '0')}
//             </p>
//           </div>
//         </div>
//         <div className="hidden md:block text-right">
//           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Protocol</p>
//           <p className="text-[11px] font-bold text-blue-400">SSL-ENCRYPTED</p>
//         </div>
//       </div>

//       <div className="p-8">
//         {/* PROGRESS STEPPER */}
//         <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
//           {templates.map((t, index) => {
//             const isActive = index === step;
//             const isDone = completed.includes(t.id) || (statusData?.[`${t.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "")}_status`] === 'generated');

//             return (
//               <React.Fragment key={t.id}>
//                 <div
//                   onClick={() => setStep(index)}
//                   className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border ${
//                     isActive ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" :
//                     isDone ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-slate-100 text-slate-400"
//                   }`}
//                 >
//                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
//                     isActive ? "bg-blue-600 text-white" : isDone ? "bg-emerald-500 text-white" : "bg-slate-100"
//                   }`}>
//                     {isDone ? <CheckCircle2 size={14} /> : index + 1}
//                   </div>
//                   <span className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap">Step {index + 1}</span>
//                 </div>
//                 {index !== templates.length - 1 && <div className="w-8 h-[2px] bg-slate-100 shrink-0" />}
//               </React.Fragment>
//             );
//           })}
//         </div>

//         {/* MAIN INTERFACE GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           {/* LEFT PANEL — DOCUMENT VIEWER */}
//           <div className="lg:col-span-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 relative overflow-hidden group">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-sm">
//                   <FileType size={18} />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
//                     {currentTemplate.name.replace(/_/g, " ")}
//                   </h3>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Object ID: {currentTemplate.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
//                 <Calendar size={12} className="text-slate-400" />
//                 <span className="text-[10px] font-bold text-slate-500">{new Date(currentTemplate.created_at).toLocaleDateString()}</span>
//               </div>
//             </div>

//             {/* DOCUMENT VIEWER FRAME WITH LOADER */}
//             <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-inner h-[550px]">

//               {/* --- IFRAME LOADER OVERLAY --- */}
//               {iframeLoading && (
//                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[2px]">
//                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
//                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendering Document...</p>
//                 </div>
//               )}

//               {/* {currentStatus?.status === "generated" && currentStatus?.path ? (
//                 <iframe
//                   src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=51&toolbar=0`}
//                   title="Generated Policy"
//                   className="w-full h-full"
//                   onLoad={() => setIframeLoading(false)}
//                 />
//               ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//                 <iframe
//                   src={currentTemplate.file_path}
//                   title="Policy Document"
//                   className="w-full h-full"
//                   onLoad={() => setIframeLoading(false)}
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
//                   <FileText size={48} className="opacity-20" />
//                   <p className="text-xs font-bold uppercase tracking-widest">{currentTemplate.file_path}</p>
//                 </div>
//               )} */}

//               {/* ===== MERGED DOCUMENT (ADD FIRST) ===== */}
// {statusData?.merged_policy_status === "generated" &&
//  statusData?.merged_policy_path ? (
//   <iframe
//     src={`https://apihrr.goelectronix.co.in/${statusData.merged_policy_path}#zoom=51&toolbar=0`}
//     title="Merged Policy"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : currentStatus?.status === "generated" && currentStatus?.path ? (
//   <iframe
//     src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=51&toolbar=0`}
//     title="Generated Policy"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//   <iframe
//     src={currentTemplate.file_path}
//     title="Policy Document"
//     className="w-full h-full"
//     onLoad={() => setIframeLoading(false)}
//   />
// ) : (
//   <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
//     <FileText size={48} className="opacity-20" />
//     <p className="text-xs font-bold uppercase tracking-widest">
//       {currentTemplate.file_path}
//     </p>
//   </div>
// )}

//             </div>
//           </div>

//           {/* RIGHT PANEL — ACTION TERMINAL */}
//           <div className="lg:col-span-4 flex flex-col gap-6">
//             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
//                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -z-0" />

//                <div className="relative z-10">
//                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Execution Panel</h4>
//                 <div className="space-y-4">
//                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
//                     <p className="text-xs font-bold text-slate-800 mb-2 leading-relaxed">Compliance Verification</p>
//                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
//                       "By generating this document, you confirm that you have read and understood the organizational protocols."
//                     </p>
//                   </div>

//                   {currentStatus?.status === "generated" ? (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
//                         <CheckCircle2 size={16} />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-emerald-700 uppercase leading-none mb-1">Asset Verified</p>
//                         <p className="text-[9px] font-bold text-emerald-600/70">Signature recorded successfully</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
//                         <Loader2 size={16} className="animate-spin" />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">Awaiting Action</p>
//                         <p className="text-[9px] font-bold text-amber-600/70">Execution required to proceed</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                </div>

//                <div className="mt-8 space-y-3">
//                 {currentStatus?.status === "generated" ? (
//                   <a
//                     href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
//                   >
//                     <Download size={16} /> Download Copy
//                   </a>
//                 ) : (
//                   <button
//                     onClick={handleAgree}
//                     disabled={agreeLoading}
//                     className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
//                   >
//                     {agreeLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
//                     {agreeLoading ? "Encrypting Data..." : "Generate Document"}
//                   </button>
//                 )}
//                </div>
//             </div>

//             {/* QUICK FOOTER NAV */}
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 disabled={step === 0}
//                 onClick={() => setStep(step - 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
//               >
//                 <ArrowLeft size={14} /> Previous
//               </button>

//               <button
//                 disabled={step === templates.length - 1}
//                 onClick={() => setStep(step + 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500 bg-white"
//               >
//                 Next <ArrowRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;
//************************************************************************************************************************ */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText, ShieldCheck, Download, Loader2, Calendar, FileType } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);
//   const [statusData, setStatusData] = useState(null);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("https://apihrr.goelectronix.co.in/policies/templates");
//         if (!res.ok) throw new Error("Failed to fetch templates");
//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) { console.error(err); }
//       setLoading(false);
//     };

//     fetchTemplates();
//     fetchStatus();
//   }, []);

//   const currentTemplate = templates[step];

//   const fetchStatus = async () => {
//     try {
//       const res = await fetch(`https://apihrr.goelectronix.co.in/policies/status/${employeeId}`);
//       if (!res.ok) throw new Error("Status fetch failed");
//       const data = await res.json();
//       setStatusData(data);
//     } catch (err) { console.error("Status API Error", err); }
//   };

//   const handleAgree = async () => {
//     if (!currentTemplate) return;
//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         { method: "POST", headers: { Accept: "application/json" } }
//       );
//       if (!res.ok) throw new Error("Generate API failed");
//       await fetchStatus();
//       setCompleted((prev) => [...prev, currentTemplate.id]);
//     } catch (err) { console.error(err); }
//     setAgreeLoading(false);
//   };

//   const getCurrentStatus = () => {
//     if (!statusData || !currentTemplate) return null;
//     const keyBase = currentTemplate.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "");
//     return {
//       status: statusData?.[`${keyBase}_status`],
//       path: statusData?.[`${keyBase}_path`],
//     };
//   };

//   const currentStatus = getCurrentStatus();

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-[500px] gap-4">
//         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Secure Vault...</p>
//       </div>
//     );
//   }

//   if (!templates.length) return <div className="text-center py-20 font-black text-slate-400">NO ASSETS DETECTED</div>;

//   return (
//     <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">

//       {/* ENTERPRISE HEADER */}
//       <div className="px-8 py-6 bg-slate-900 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
//             <ShieldCheck size={24} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">Compliance & Policy Engine</h2>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Employee ID: {employeeId.toString().padStart(4, '0')}
//             </p>
//           </div>
//         </div>
//         <div className="hidden md:block text-right">
//           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Protocol</p>
//           <p className="text-[11px] font-bold text-blue-400">SSL-ENCRYPTED</p>
//         </div>
//       </div>

//       <div className="p-8">
//         {/* PROGRESS STEPPER */}
//         <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
//           {templates.map((t, index) => {
//             const isActive = index === step;
//             const isDone = completed.includes(t.id) || (statusData?.[`${t.name.toLowerCase().replace(/\s+/g, "_").replace(/\.pdf$/, "")}_status`] === 'generated');

//             return (
//               <React.Fragment key={t.id}>
//                 <div
//                   onClick={() => setStep(index)}
//                   className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border ${
//                     isActive ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" :
//                     isDone ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-slate-100 text-slate-400"
//                   }`}
//                 >
//                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
//                     isActive ? "bg-blue-600 text-white" : isDone ? "bg-emerald-500 text-white" : "bg-slate-100"
//                   }`}>
//                     {isDone ? <CheckCircle2 size={14} /> : index + 1}
//                   </div>
//                   <span className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap">Step {index + 1}</span>
//                 </div>
//                 {index !== templates.length - 1 && <div className="w-8 h-[2px] bg-slate-100 shrink-0" />}
//               </React.Fragment>
//             );
//           })}
//         </div>

//         {/* MAIN INTERFACE GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//           {/* LEFT PANEL — DOCUMENT VIEWER */}
//           <div className="lg:col-span-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 relative overflow-hidden group">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400">
//                   <FileType size={18} />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
//                     {currentTemplate.name.replace(/_/g, " ")}
//                   </h3>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Object ID: {currentTemplate.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200">
//                 <Calendar size={12} className="text-slate-400" />
//                 <span className="text-[10px] font-bold text-slate-500">{new Date(currentTemplate.created_at).toLocaleDateString()}</span>
//               </div>
//             </div>

//             {/* DOCUMENT VIEWER FRAME */}
//             <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-inner h-[500px]">
//               {currentStatus?.status === "generated" && currentStatus?.path ? (
//                 <iframe
//                   src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=47&toolbar=0`}
//                   title="Generated Policy"
//                   className="w-full h-full"
//                 />
//               ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//                 <iframe
//                   src={currentTemplate.file_path}
//                   title="Policy Document"
//                   className="w-full h-full"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
//                   <FileText size={48} className="opacity-20" />
//                   <p className="text-xs font-bold uppercase tracking-widest">{currentTemplate.file_path}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT PANEL — ACTION TERMINAL */}
//           <div className="lg:col-span-4 flex flex-col gap-6">
//             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
//                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -z-0" />

//                <div className="relative z-10">
//                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Execution Panel</h4>
//                 <div className="space-y-4">
//                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
//                     <p className="text-xs font-bold text-slate-800 mb-2 leading-relaxed">Compliance Verification</p>
//                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
//                       By generating this document, you confirm that you have read and understood the organizational protocols outlined in this registry asset.
//                     </p>
//                   </div>

//                   {currentStatus?.status === "generated" ? (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
//                         <CheckCircle2 size={16} />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-emerald-700 uppercase leading-none mb-1">Asset Verified</p>
//                         <p className="text-[9px] font-bold text-emerald-600/70">Document generated successfully</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
//                       <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
//                         <Loader2 size={16} className="animate-spin" />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black text-amber-700 uppercase leading-none mb-1">Awaiting Action</p>
//                         <p className="text-[9px] font-bold text-amber-600/70">Signature required to proceed</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                </div>

//                <div className="mt-8 space-y-3">
//                 {currentStatus?.status === "generated" ? (
//                   <a
//                     href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
//                   >
//                     <Download size={16} /> Download Asset
//                   </a>
//                 ) : (
//                   <button
//                     onClick={handleAgree}
//                     disabled={agreeLoading}
//                     className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
//                   >
//                     {agreeLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
//                     {agreeLoading ? "Processing Encryption..." : "Execute & Generate"}
//                   </button>
//                 )}
//                </div>
//             </div>

//             {/* QUICK FOOTER NAV */}
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 disabled={step === 0}
//                 onClick={() => setStep(step - 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500"
//               >
//                 <ArrowLeft size={14} /> Back
//               </button>

//               <button
//                 disabled={step === templates.length - 1}
//                 onClick={() => setStep(step + 1)}
//                 className="py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500"
//               >
//                 Next <ArrowRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;
//*************************************************working code phase 44*************************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);
//   const [statusData, setStatusData] = useState(null);

//   useEffect(() => {
//   const fetchTemplates = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/policies/templates"
//       );
//       if (!res.ok) throw new Error("Failed to fetch templates");
//       const data = await res.json();
//       setTemplates(data);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   fetchTemplates();
//   fetchStatus(); // ⭐ IMPORTANT
// }, []);

//   const currentTemplate = templates[step];

//   const fetchStatus = async () => {
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/status/${employeeId}`
//     );
//     if (!res.ok) throw new Error("Status fetch failed");
//     const data = await res.json();
//     setStatusData(data);
//   } catch (err) {
//     console.error("Status API Error", err);
//   }
// };

// const handleAgree = async () => {
//   if (!currentTemplate) return;

//   setAgreeLoading(true);
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//       { method: "POST", headers: { Accept: "application/json" } }
//     );

//     if (!res.ok) throw new Error("Generate API failed");

//     await fetchStatus(); // ⭐ fetch updated status

//     setCompleted((prev) => [...prev, currentTemplate.id]);

//   } catch (err) {
//     console.error(err);
//   }
//   setAgreeLoading(false);
// };

// const getCurrentStatus = () => {
//   if (!statusData || !currentTemplate) return null;

//   const keyBase = currentTemplate.name
//     .toLowerCase()
//     .replace(/\s+/g, "_")
//     .replace(/\.pdf$/, "");

//   return {
//     status: statusData?.[`${keyBase}_status`],
//     path: statusData?.[`${keyBase}_path`],
//   };
// };

// const currentStatus = getCurrentStatus();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!templates.length) {
//     return <div className="text-center py-20">No Templates Found</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => (
//           <div
//             key={t.id}
//             className={`flex-1 text-center text-sm font-semibold ${
//               index === step
//                 ? "text-blue-600"
//                 : completed.includes(t.id)
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             Step {index + 1}
//           </div>
//         ))}
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {/* LEFT — Document Info */}
//         <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 border min-h-[300px]">
//           <h3 className="text-lg font-bold mb-2 capitalize">
//             {currentTemplate.name.replace(/_/g, " ")}
//           </h3>

//           <p className="text-sm text-gray-500 mb-4">
//             Template ID: {currentTemplate.id}
//           </p>

//           {/* If PDF */}

//           {/* PDF VIEW */}
// {currentStatus?.status === "generated" && currentStatus?.path ? (

// <iframe
//   src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=39&toolbar=0&navpanes=0&scrollbar=0`}
//   title="Generated Policy"
//   className="w-full h-[420px] rounded-xl border bg-white"
// />

// ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//   <iframe
//     src={currentTemplate.file_path}
//     title="Policy Document"
//     className="w-full h-[420px] rounded-xl border"
//   />
// ) : (
//   <div className="text-sm text-gray-600">
//     📄 File: {currentTemplate.file_path}
//   </div>
// )}

//           <div className="text-xs text-gray-400 mt-3">
//             Created: {new Date(currentTemplate.created_at).toLocaleString()}
//           </div>
//         </div>

//         {/* RIGHT — Agree Panel */}
//         <div className="bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-sm">

//           <div>
//             <h4 className="font-semibold mb-3">Agreement</h4>

//             <p className="text-sm text-gray-500 mb-4">
//               Please review the document carefully before agreeing.
//             </p>

//             {completed.includes(currentTemplate.id) && (
//               <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
//                 <CheckCircle2 size={18} /> Already Agreed
//               </div>
//             )}
//           </div>

//           {currentStatus?.status === "generated" ? (
//   <div className="text-center space-y-3">
//     <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
//       <CheckCircle2 size={18} /> Document Generated
//     </div>

//     <a
//       href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="block w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//     >
//       Download Document
//     </a>
//   </div>
// ) : (
//   <button
//     onClick={handleAgree}
//     disabled={agreeLoading}
//     className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
//   >
//     {agreeLoading ? "Generating..." : "Generate Document"}
//   </button>
// )}

//         </div>
//       </div>

//       {/* Footer Navigation */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;
//*****************************************************working code phase 123 10/02/26*********************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);
//   const [statusData, setStatusData] = useState(null);

// //   useEffect(() => {
// //     const fetchTemplates = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await fetch(
// //           "https://apihrr.goelectronix.co.in/policies/templates"
// //         );
// //         if (!res.ok) throw new Error("Failed to fetch templates");
// //         const data = await res.json();
// //         setTemplates(data);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //       setLoading(false);
// //     };
// //     fetchTemplates();
// //   }, []);

//   useEffect(() => {
//   const fetchTemplates = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         "https://apihrr.goelectronix.co.in/policies/templates"
//       );
//       if (!res.ok) throw new Error("Failed to fetch templates");
//       const data = await res.json();
//       setTemplates(data);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   fetchTemplates();
//   fetchStatus(); // ⭐ IMPORTANT
// }, []);

//   const currentTemplate = templates[step];

//   const fetchStatus = async () => {
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/status/${employeeId}`
//     );
//     if (!res.ok) throw new Error("Status fetch failed");
//     const data = await res.json();
//     setStatusData(data);
//   } catch (err) {
//     console.error("Status API Error", err);
//   }
// };

// //   const handleAgree = async () => {
// //     if (!currentTemplate) return;

// //     setAgreeLoading(true);
// //     try {
// //       const res = await fetch(
// //         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
// //         { method: "POST", headers: { Accept: "application/json" } }
// //       );

// //       if (!res.ok) throw new Error("Agree API failed");

// //       setCompleted((prev) => [...prev, currentTemplate.id]);

// //       if (step < templates.length - 1) setStep(step + 1);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //     setAgreeLoading(false);
// //   };

// const handleAgree = async () => {
//   if (!currentTemplate) return;

//   setAgreeLoading(true);
//   try {
//     const res = await fetch(
//       `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//       { method: "POST", headers: { Accept: "application/json" } }
//     );

//     if (!res.ok) throw new Error("Generate API failed");

//     await fetchStatus(); // ⭐ fetch updated status

//     setCompleted((prev) => [...prev, currentTemplate.id]);

//   } catch (err) {
//     console.error(err);
//   }
//   setAgreeLoading(false);
// };

// // const getCurrentStatus = () => {
// //   if (!statusData || !currentTemplate) return null;

// //   const keyBase = currentTemplate.name.toLowerCase();
// //   // Example: employment_declaration

// //   return {
// //     status: statusData[`${keyBase}_status`],
// //     path: statusData[`${keyBase}_path`],
// //   };
// // };

// const getCurrentStatus = () => {
//   if (!statusData || !currentTemplate) return null;

//   const keyBase = currentTemplate.name
//     .toLowerCase()
//     .replace(/\s+/g, "_")
//     .replace(/\.pdf$/, "");

//   return {
//     status: statusData?.[`${keyBase}_status`],
//     path: statusData?.[`${keyBase}_path`],
//   };
// };

// const currentStatus = getCurrentStatus();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!templates.length) {
//     return <div className="text-center py-20">No Templates Found</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => (
//           <div
//             key={t.id}
//             className={`flex-1 text-center text-sm font-semibold ${
//               index === step
//                 ? "text-blue-600"
//                 : completed.includes(t.id)
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             Step {index + 1}
//           </div>
//         ))}
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {/* LEFT — Document Info */}
//         <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 border min-h-[300px]">
//           <h3 className="text-lg font-bold mb-2 capitalize">
//             {currentTemplate.name.replace(/_/g, " ")}
//           </h3>

//           <p className="text-sm text-gray-500 mb-4">
//             Template ID: {currentTemplate.id}
//           </p>

//           {/* If PDF */}
//           {/* {currentTemplate.file_path?.endsWith(".pdf") ? (
//             <iframe
//               src={currentTemplate.file_path}
//               title="Policy Document"
//               className="w-full h-[400px] rounded-xl border"
//             />
//           ) : (
//             <div className="text-sm text-gray-600">
//               📄 File: {currentTemplate.file_path}
//             </div>
//           )} */}
//           {/* PDF VIEW */}
// {currentStatus?.status === "generated" && currentStatus?.path ? (
// //   <iframe
// //     src={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
// //     title="Generated Policy"
// //     className="w-full h-[420px] rounded-xl border"
// //   />
// <iframe
//   src={`https://apihrr.goelectronix.co.in/${currentStatus.path}#zoom=39&toolbar=0&navpanes=0&scrollbar=0`}
//   title="Generated Policy"
//   className="w-full h-[420px] rounded-xl border bg-white"
// />

// ) : currentTemplate.file_path?.endsWith(".pdf") ? (
//   <iframe
//     src={currentTemplate.file_path}
//     title="Policy Document"
//     className="w-full h-[420px] rounded-xl border"
//   />
// ) : (
//   <div className="text-sm text-gray-600">
//     📄 File: {currentTemplate.file_path}
//   </div>
// )}

//           <div className="text-xs text-gray-400 mt-3">
//             Created: {new Date(currentTemplate.created_at).toLocaleString()}
//           </div>
//         </div>

//         {/* RIGHT — Agree Panel */}
//         <div className="bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-sm">

//           <div>
//             <h4 className="font-semibold mb-3">Agreement</h4>

//             <p className="text-sm text-gray-500 mb-4">
//               Please review the document carefully before agreeing.
//             </p>

//             {completed.includes(currentTemplate.id) && (
//               <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
//                 <CheckCircle2 size={18} /> Already Agreed
//               </div>
//             )}
//           </div>

//           {/* <button
//             onClick={handleAgree}
//             disabled={agreeLoading || completed.includes(currentTemplate.id)}
//             className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
//           >
//             {agreeLoading ? "Processing..." : "Generated Document"}
//           </button> */}
//           {currentStatus?.status === "generated" ? (
//   <div className="text-center space-y-3">
//     <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
//       <CheckCircle2 size={18} /> Document Generated
//     </div>

//     <a
//       href={`https://apihrr.goelectronix.co.in/${currentStatus.path}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="block w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//     >
//       Download Document
//     </a>
//   </div>
// ) : (
//   <button
//     onClick={handleAgree}
//     disabled={agreeLoading}
//     className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
//   >
//     {agreeLoading ? "Generating..." : "Generate Document"}
//   </button>
// )}

//         </div>
//       </div>

//       {/* Footer Navigation */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;

//********************************************************************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);

//   // Fetch Templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "https://apihrr.goelectronix.co.in/policies/templates"
//         );

//         if (!res.ok) throw new Error("Failed to fetch templates");

//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) {
//         console.error("Error loading templates", err);
//       }
//       setLoading(false);
//     };

//     fetchTemplates();
//   }, []);

//   const currentTemplate = templates[step];

//   // Agree Button API Call
//   const handleAgree = async () => {
//     if (!currentTemplate) return;

//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Agree API failed");

//       setCompleted((prev) => [...prev, currentTemplate.id]);

//       // Move to next step automatically
//       if (step < templates.length - 1) {
//         setStep(step + 1);
//       }
//     } catch (err) {
//       console.error("Agree API Error", err);
//     }
//     setAgreeLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!templates.length) {
//     return <div className="text-center py-20">No Templates Found</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => (
//           <div
//             key={t.id}
//             className={`flex-1 text-center text-sm font-semibold ${
//               index === step
//                 ? "text-blue-600"
//                 : completed.includes(t.id)
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             Step {index + 1}
//           </div>
//         ))}
//       </div>

//       {/* Template Content */}
//       <div className="bg-slate-50 rounded-2xl p-6 min-h-[220px] border">
//         <h3 className="text-lg font-bold mb-2 capitalize">
//           {currentTemplate.name.replace(/_/g, " ")}
//         </h3>

//         <p className="text-sm text-gray-500 mb-4">
//           Template ID: {currentTemplate.id}
//         </p>

//         <div className="text-sm text-gray-600">
//           📄 File: {currentTemplate.file_path}
//         </div>

//         <div className="text-xs text-gray-400 mt-2">
//           Created: {new Date(currentTemplate.created_at).toLocaleString()}
//         </div>
//       </div>

//       {/* Footer Buttons */}
//       <div className="flex justify-between items-center mt-6">
//         {/* Previous */}
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         {/* Agree */}
//         <button
//           onClick={handleAgree}
//           disabled={agreeLoading}
//           className="px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 shadow"
//         >
//           {agreeLoading ? "Processing..." : "Agree"}
//           <CheckCircle2 size={16} />
//         </button>

//         {/* Next */}
//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;

//***********************************************working code phase 444 10/02/26****************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);

//   // Fetch Templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "https://apihrr.goelectronix.co.in/policies/templates"
//         );

//         if (!res.ok) throw new Error("Failed to fetch templates");

//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) {
//         console.error("Error loading templates", err);
//       }
//       setLoading(false);
//     };

//     fetchTemplates();
//   }, []);

//   const currentTemplate = templates[step];

//   // Agree Button API Call
//   const handleAgree = async () => {
//     if (!currentTemplate) return;

//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Agree API failed");

//       setCompleted((prev) => [...prev, currentTemplate.id]);

//       // Move to next step automatically
//       if (step < templates.length - 1) {
//         setStep(step + 1);
//       }
//     } catch (err) {
//       console.error("Agree API Error", err);
//     }
//     setAgreeLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!templates.length) {
//     return <div className="text-center py-20">No Templates Found</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => (
//           <div
//             key={t.id}
//             className={`flex-1 text-center text-sm font-semibold ${
//               index === step
//                 ? "text-blue-600"
//                 : completed.includes(t.id)
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             Step {index + 1}
//           </div>
//         ))}
//       </div>

//       {/* Template Content */}
//       <div className="bg-slate-50 rounded-2xl p-6 min-h-[220px] border">
//         <h3 className="text-lg font-bold mb-2 capitalize">
//           {currentTemplate.name.replace(/_/g, " ")}
//         </h3>

//         <p className="text-sm text-gray-500 mb-4">
//           Template ID: {currentTemplate.id}
//         </p>

//         <div className="text-sm text-gray-600">
//           📄 File: {currentTemplate.file_path}
//         </div>

//         <div className="text-xs text-gray-400 mt-2">
//           Created: {new Date(currentTemplate.created_at).toLocaleString()}
//         </div>
//       </div>

//       {/* Footer Buttons */}
//       <div className="flex justify-between items-center mt-6">
//         {/* Previous */}
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         {/* Agree */}
//         <button
//           onClick={handleAgree}
//           disabled={agreeLoading}
//           className="px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 shadow"
//         >
//           {agreeLoading ? "Processing..." : "Agree"}
//           <CheckCircle2 size={16} />
//         </button>

//         {/* Next */}
//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;
//*************************************************working code phase 12222 ************************************************************** */
// import React, { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   ArrowRight,
//   ArrowLeft,
//   FileText,
//   ShieldCheck,
// } from "lucide-react";

// const API = "https://apihrr.goelectronix.co.in";

// const PolicyStepper = ({ employeeId = 2 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [status, setStatus] = useState(null);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [mergeLoading, setMergeLoading] = useState(false);

//   useEffect(() => {
//     loadAll();
//   }, []);

//   const normalizePath = (p) => (p ? p.replace(/\\/g, "/") : null);

//   const loadAll = async () => {
//     try {
//       setLoading(true);

//       const [templatesRes, statusRes] = await Promise.all([
//         fetch(`${API}/policies/templates`),
//         fetch(`${API}/policies/status/${employeeId}`),
//       ]);

//       setTemplates(await templatesRes.json());
//       setStatus(await statusRes.json());
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[500px]">
//         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const currentTemplate = templates[step];
//   const key = currentTemplate?.name;
//   const statusKey = `${key}_status`;
//   const pathKey = `${key}_path`;

//   const isGenerated = status?.[statusKey] === "generated";
//   const docPath = status?.[pathKey];

//   const templatePath = normalizePath(currentTemplate?.file_path);
// const generatedPath = normalizePath(docPath);

// // If generated PDF exists → show generated
// // else → show template PDF
// const previewUrl = generatedPath
//   ? `${API}/${generatedPath}`
//   : templatePath
//   ? `${API}/${templatePath}`
//   : null;

//   const handleAgree = async () => {
//     setAgreeLoading(true);
//     await fetch(
//       `${API}/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//       { method: "POST" }
//     );
//     await loadAll();
//     setAgreeLoading(false);
//   };

//   const handleMerge = async () => {
//     setMergeLoading(true);
//     await fetch(`${API}/policies/merge/${employeeId}`, { method: "POST" });
//     await loadAll();
//     setMergeLoading(false);
//   };

//   const allVerified = templates.every(
//     (t) => status?.[`${t.name}_status`] === "generated"
//   );

//   if (allVerified) {
//     return (
//       <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 text-center">
//         <ShieldCheck size={48} className="mx-auto text-green-600 mb-4" />
//         <h2 className="text-2xl font-bold">All Documents Verified</h2>

//         {status?.merged_policy_status !== "generated" ? (
//           <button
//             onClick={handleMerge}
//             className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl"
//           >
//             {mergeLoading ? "Completing..." : "Complete Verification"}
//           </button>
//         ) : (
//           <p className="text-green-600 mt-4 font-semibold">
//             🎉 Final Document Generated
//           </p>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-12 gap-6 h-[80vh]">
//       {/* ================= LEFT DOCUMENT VIEWER ================= */}
//       {/* <div className="col-span-7 bg-white border rounded-3xl shadow p-4 overflow-hidden">
//         <div className="flex items-center gap-2 mb-3">
//           <FileText className="text-blue-600" />
//           <h3 className="font-semibold capitalize">
//             {currentTemplate.name.replace(/_/g, " ")}
//           </h3>
//         </div>

//         {isGenerated && docPath ? (
//           <iframe
//             title="doc-preview"
//             src={`${API}/${docPath}`}
//             className="w-full h-[90%] rounded-xl border"
//           />
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full text-gray-400">
//             <FileText size={40} />
//             <p className="mt-2">Document preview will appear after agreeing</p>
//           </div>
//         )}
//       </div> */}

//       {/* ================= LEFT DOCUMENT VIEWER ================= */}
// <div className="col-span-7 bg-white border rounded-3xl shadow p-4 overflow-hidden">
//   <div className="flex items-center gap-2 mb-3">
//     <FileText className="text-blue-600" />
//     <h3 className="font-semibold capitalize">
//       {currentTemplate.name.replace(/_/g, " ")}
//     </h3>
//   </div>

//   {previewUrl ? (
//     <iframe
//       title="pdf-preview"
//       src={previewUrl}
//       className="w-full h-[90%] rounded-xl border"
//     />
//   ) : (
//     <div className="flex flex-col items-center justify-center h-full text-gray-400">
//       <FileText size={40} />
//       <p className="mt-2">No document available</p>
//     </div>
//   )}
// </div>

//       {/* ================= RIGHT PANEL ================= */}
//       <div className="col-span-5 bg-white border rounded-3xl shadow p-6 flex flex-col justify-between">
//         {/* Top */}
//         <div>
//           <h2 className="text-xl font-bold mb-4">Policy Status</h2>

//           <div className="mb-4">
//             <span className="text-sm text-gray-500">Current Step:</span>
//             <div className="text-lg font-semibold">
//               {step + 1} / {templates.length}
//             </div>
//           </div>

//           <div className="mb-6">
//             <span className="text-sm text-gray-500">Status:</span>
//             <div
//               className={`mt-1 font-semibold ${
//                 isGenerated ? "text-green-600" : "text-orange-500"
//               }`}
//             >
//               {isGenerated ? "Agreed" : "Pending"}
//             </div>
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         <div className="space-y-3">
//           {!isGenerated && (
//             <button
//               onClick={handleAgree}
//               disabled={agreeLoading}
//               className="w-full py-3 bg-green-600 text-white rounded-xl shadow"
//             >
//               {agreeLoading ? "Processing..." : "Agree & Generate Document"}
//             </button>
//           )}

//           <div className="flex gap-2">
//             <button
//               disabled={step === 0}
//               onClick={() => setStep(step - 1)}
//               className="flex-1 py-2 border rounded-xl"
//             >
//               <ArrowLeft size={16} /> Prev
//             </button>

//             <button
//               disabled={step === templates.length - 1}
//               onClick={() => setStep(step + 1)}
//               className="flex-1 py-2 border rounded-xl"
//             >
//               Next <ArrowRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;

//************************************************working code phase 01125************************************************************** */
// import React, { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   ArrowRight,
//   ArrowLeft,
//   FileText,
//   ShieldCheck,
// } from "lucide-react";

// const API = "https://apihrr.goelectronix.co.in";

// const PolicyStepper = ({ employeeId = 2 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [status, setStatus] = useState(null);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [mergeLoading, setMergeLoading] = useState(false);

//   // ------------------ FETCH DATA ------------------
//   useEffect(() => {
//     loadAll();
//   }, []);

//   const loadAll = async () => {
//     try {
//       setLoading(true);

//       const [templatesRes, statusRes] = await Promise.all([
//         fetch(`${API}/policies/templates`),
//         fetch(`${API}/policies/status/${employeeId}`),
//       ]);

//       const templatesData = await templatesRes.json();
//       const statusData = await statusRes.json();

//       setTemplates(templatesData);
//       setStatus(statusData);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const currentTemplate = templates[step];
//   const statusKey = `${currentTemplate?.name}_status`;
//   const isGenerated = status?.[statusKey] === "generated";

//   // ------------------ AGREE ------------------
//   const handleAgree = async () => {
//     setAgreeLoading(true);
//     try {
//       await fetch(
//         `${API}/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         { method: "POST" }
//       );
//       await loadAll(); // refresh status
//     } catch (err) {
//       console.error(err);
//     }
//     setAgreeLoading(false);
//   };

//   // ------------------ MERGE ------------------
//   const handleMerge = async () => {
//     setMergeLoading(true);
//     try {
//       await fetch(`${API}/policies/merge/${employeeId}`, {
//         method: "POST",
//       });
//       await loadAll();
//     } catch (err) {
//       console.error(err);
//     }
//     setMergeLoading(false);
//   };

//   // ------------------ CHECK ALL VERIFIED ------------------
//   const allVerified = templates.every(
//     (t) => status?.[`${t.name}_status`] === "generated"
//   );

//   // ====================== FINAL VERIFIED UI ======================
//   if (allVerified) {
//     return (
//       <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 border text-center">
//         <ShieldCheck className="mx-auto text-green-600 mb-4" size={48} />

//         <h2 className="text-2xl font-bold mb-2">All Documents Verified</h2>
//         <p className="text-gray-500 mb-6">
//           All policies are agreed successfully.
//         </p>

//         {status?.merged_policy_status !== "generated" && (
//           <button
//             onClick={handleMerge}
//             disabled={mergeLoading}
//             className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
//           >
//             {mergeLoading
//               ? "Completing..."
//               : "Complete All Document Verification"}
//           </button>
//         )}

//         {status?.merged_policy_status === "generated" && (
//           <div className="text-green-600 font-semibold">
//             🎉 Final Policy Document Generated Successfully
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ====================== NORMAL STEPPER ======================
//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => {
//           const done = status?.[`${t.name}_status`] === "generated";
//           return (
//             <div
//               key={t.id}
//               className={`flex-1 text-center text-sm font-semibold ${
//                 index === step
//                   ? "text-blue-600"
//                   : done
//                   ? "text-green-600"
//                   : "text-gray-400"
//               }`}
//             >
//               Step {index + 1}
//             </div>
//           );
//         })}
//       </div>

//       {/* Template Card */}
//       <div className="bg-slate-50 rounded-2xl p-6 border min-h-[220px]">
//         <h3 className="text-lg font-bold capitalize">
//           {currentTemplate.name.replace(/_/g, " ")}
//         </h3>

//         <div className="text-sm text-gray-500 mt-2">
//           Status:
//           <span
//             className={`ml-2 font-semibold ${
//               isGenerated ? "text-green-600" : "text-orange-500"
//             }`}
//           >
//             {isGenerated ? "Agreed" : "Pending"}
//           </span>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between mt-6">
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 border rounded-xl"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         {!isGenerated && (
//           <button
//             onClick={handleAgree}
//             disabled={agreeLoading}
//             className="px-6 py-2 bg-green-600 text-white rounded-xl"
//           >
//             {agreeLoading ? "Processing..." : "Agree"}
//           </button>
//         )}

//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 border rounded-xl"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;

//*************************************************working code phase 14******************************************************************* */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText } from "lucide-react";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);

//   // Fetch Templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "https://apihrr.goelectronix.co.in/policies/templates"
//         );

//         if (!res.ok) throw new Error("Failed to fetch templates");

//         const data = await res.json();
//         setTemplates(data);
//       } catch (err) {
//         console.error("Error loading templates", err);
//       }
//       setLoading(false);
//     };

//     fetchTemplates();
//   }, []);

//   const currentTemplate = templates[step];

//   // Agree Button API Call
//   const handleAgree = async () => {
//     if (!currentTemplate) return;

//     setAgreeLoading(true);
//     try {
//       const res = await fetch(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Agree API failed");

//       setCompleted((prev) => [...prev, currentTemplate.id]);

//       // Move to next step automatically
//       if (step < templates.length - 1) {
//         setStep(step + 1);
//       }
//     } catch (err) {
//       console.error("Agree API Error", err);
//     }
//     setAgreeLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!templates.length) {
//     return <div className="text-center py-20">No Templates Found</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => (
//           <div
//             key={t.id}
//             className={`flex-1 text-center text-sm font-semibold ${
//               index === step
//                 ? "text-blue-600"
//                 : completed.includes(t.id)
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             Step {index + 1}
//           </div>
//         ))}
//       </div>

//       {/* Template Content */}
//       <div className="bg-slate-50 rounded-2xl p-6 min-h-[220px] border">
//         <h3 className="text-lg font-bold mb-2 capitalize">
//           {currentTemplate.name.replace(/_/g, " ")}
//         </h3>

//         <p className="text-sm text-gray-500 mb-4">
//           Template ID: {currentTemplate.id}
//         </p>

//         <div className="text-sm text-gray-600">
//           📄 File: {currentTemplate.file_path}
//         </div>

//         <div className="text-xs text-gray-400 mt-2">
//           Created: {new Date(currentTemplate.created_at).toLocaleString()}
//         </div>
//       </div>

//       {/* Footer Buttons */}
//       <div className="flex justify-between items-center mt-6">
//         {/* Previous */}
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         {/* Agree */}
//         <button
//           onClick={handleAgree}
//           disabled={agreeLoading}
//           className="px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 shadow"
//         >
//           {agreeLoading ? "Processing..." : "Agree"}
//           <CheckCircle2 size={16} />
//         </button>

//         {/* Next */}
//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;

//************************************************************************************************************** */
// import React, { useEffect, useState } from "react";
// import { CheckCircle2, ArrowRight, ArrowLeft, FileText } from "lucide-react";
// import axios from "axios";

// const PolicyStepper = ({ employeeId = 4 }) => {
//   const [templates, setTemplates] = useState([]);
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [agreeLoading, setAgreeLoading] = useState(false);
//   const [completed, setCompleted] = useState([]);

//   // Fetch Templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(
//           "https://apihrr.goelectronix.co.in/policies/templates"
//         );
//         setTemplates(res.data);
//       } catch (err) {
//         console.error("Error loading templates", err);
//       }
//       setLoading(false);
//     };

//     fetchTemplates();
//   }, []);

//   const currentTemplate = templates[step];

//   // Agree Button API Call
//   const handleAgree = async () => {
//     if (!currentTemplate) return;

//     setAgreeLoading(true);
//     try {
//       await axios.post(
//         `https://apihrr.goelectronix.co.in/policies/generate/${employeeId}?template_id=${currentTemplate.id}`
//       );

//       setCompleted([...completed, currentTemplate.id]);

//       // Move to next step automatically
//       if (step < templates.length - 1) {
//         setStep(step + 1);
//       }
//     } catch (err) {
//       console.error("Agree API Error", err);
//     }
//     setAgreeLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!templates.length) {
//     return <div className="text-center py-20">No Templates Found</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <FileText className="text-blue-600" />
//         <h2 className="text-xl font-bold">Employee Policy Agreement</h2>
//       </div>

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {templates.map((t, index) => (
//           <div
//             key={t.id}
//             className={`flex-1 text-center text-sm font-semibold ${
//               index === step
//                 ? "text-blue-600"
//                 : completed.includes(t.id)
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             Step {index + 1}
//           </div>
//         ))}
//       </div>

//       {/* Template Content */}
//       <div className="bg-slate-50 rounded-2xl p-6 min-h-[220px] border">
//         <h3 className="text-lg font-bold mb-2 capitalize">
//           {currentTemplate.name.replace(/_/g, " ")}
//         </h3>

//         <p className="text-sm text-gray-500 mb-4">
//           Template ID: {currentTemplate.id}
//         </p>

//         <div className="text-sm text-gray-600">
//           📄 File: {currentTemplate.file_path}
//         </div>

//         <div className="text-xs text-gray-400 mt-2">
//           Created: {new Date(currentTemplate.created_at).toLocaleString()}
//         </div>
//       </div>

//       {/* Footer Buttons */}
//       <div className="flex justify-between items-center mt-6">
//         {/* Previous */}
//         <button
//           disabled={step === 0}
//           onClick={() => setStep(step - 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           <ArrowLeft size={16} /> Previous
//         </button>

//         {/* Agree */}
//         <button
//           onClick={handleAgree}
//           disabled={agreeLoading}
//           className="px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 shadow"
//         >
//           {agreeLoading ? "Processing..." : "Agree"}
//           <CheckCircle2 size={16} />
//         </button>

//         {/* Next */}
//         <button
//           disabled={step === templates.length - 1}
//           onClick={() => setStep(step + 1)}
//           className="px-5 py-2 rounded-xl border flex items-center gap-2 hover:bg-gray-100 disabled:opacity-40"
//         >
//           Next <ArrowRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PolicyStepper;
