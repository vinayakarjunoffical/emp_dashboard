import React, { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  User,
  ShieldCheck,
  Link as LinkIcon,
  Building2,
  Activity,
  ChevronLeft,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import EnterpriseInput from "../../components/comman/EnterpriseInput";
import { interviewService } from "../../services/interviewService";
import { candidateService } from "../../services/candidateService";

const ScheduleInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Added State for History ---
  // const [interviews] = useState([
  //   {
  //     round: 1,
  //     date: "Jan 12, 2026",
  //     time: "10:30 AM",
  //     mode: "online",
  //     interviewer: "Sarah Connor",
  //     role: "Engineering Manager",
  //     status: "Completed",
  //     score: 8.4,
  //     feedback:
  //       "Exceptional depth in React Internals. Strong architectural thinking. Candidate needs more exposure to AWS infrastructure.",
  //     remark: "Recommended for Round 02 with Senior Architect.",
  //   },

  //   {
  //     round: 2,
  //     date: "Jan 18, 2026",
  //     time: "02:00 PM",
  //     mode: "physical",
  //     interviewer: "Michael Scott",
  //     role: "Senior Architect",
  //     status: "Pending",
  //     score: 7.5,
  //     feedback: "",
  //     remark: "Interview scheduled. Awaiting feedback.",
  //   },
  // ]);

  const [interviews, setInterviews] = useState([]);
const [interviewLoading, setInterviewLoading] = useState(false);


  // --- 1. Integrated Candidate State ---
  // const [candidate] = useState({
  //   id: id || "CAN-8821",
  //   name: "Arjun Mehta",
  //   email: "arjun.m@tech-global.com",
  //   phone: "+91 98765 43210",
  //   position: "Senior Frontend Lead",
  //   experience: "6 Years",
  //   education: "B.Tech Computer Science",
  //   status: "Verified",
  //   location: {
  //     city: "Mumbai",
  //     state: "Maharashtra",
  //     pincode: "400001",
  //     address: "124, Skyline Towers, Andheri East",
  //   },
  //   bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
  // });
const [candidate, setCandidate] = useState(null);
const [candidateLoading, setCandidateLoading] = useState(true);
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    mode: "online",
    location: "",
    interviewerName: "",
    interviewerRole: "",
    interviewerEmail: "", 
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);



useEffect(() => {
  if (id) fetchCandidate();
}, [id]);

 const fetchCandidate = async () => {
    try {
      setCandidateLoading(true);
      setInterviewLoading(true);

      const data = await candidateService.getById(id);

      setCandidate(data);

      // ✅ Convert interviews
      const mappedInterviews = (data.interviews || []).map((i) => {
        const dateObj = new Date(i.interview_date);

        return {
          id: i.id,
          round: i.round_number,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          mode: i.mode,
          interviewer: i.interviewer_name,
          role: i.interviewer_designation || "Panelist",
          status: i.status,
          // feedback: i.review || "",
          // score: i.score || null,
          // remark: i.review || "Awaiting feedback",
          feedback: i.review?.remarks || "",
remark: i.review?.decision || "Awaiting feedback",
score: i.review?.total_score || null,

        };
      });

      setInterviews(mappedInterviews);

    } catch (error) {
      console.error("Failed to fetch candidate:", error);
    } finally {
      setCandidateLoading(false);
      setInterviewLoading(false);
    }
  };


  const handleScheduleInterview = async () => {
    // ✅ Validation
    if (
      !scheduleForm.date ||
      !scheduleForm.time ||
      !scheduleForm.location ||
      !scheduleForm.interviewerName ||
      !scheduleForm.interviewerRole ||
       !scheduleForm.interviewerEmail
    ) {
      toast.error("Please fill all fields before scheduling");
      return;
    }

    try {
      setLoading(true);
      const payload = {
  candidate_id: Number(candidate.id),

  mode: scheduleForm.mode === "online" ? "online" : "offline",

  // Convert to ISO (Backend expects timestamp)
  interview_date: new Date(
    `${scheduleForm.date}T${scheduleForm.time}`
  ).toISOString(),

  interviewer_name: scheduleForm.interviewerName,
  // interviewer_email: "vinayakarjun1234@gmail.com", // or from input if needed
  interviewer_email: scheduleForm.interviewerEmail,
  interviewer_designation: scheduleForm.interviewerRole,

  // Conditional fields
  ...(scheduleForm.mode === "online"
    ? { meeting_link: scheduleForm.location }
    : { venue_details: scheduleForm.location }),
};


      await interviewService.scheduleInterview(payload);

      setIsScheduled(true);

      await fetchCandidate();

      // Optional UX improvement:
      // alert("Interview scheduled successfully!");
      toast.success("Interview scheduled successfully!");

      // Optional reset:
      setScheduleForm({
        date: "",
        time: "",
        mode: "online",
        location: "",
        interviewerName: "",
        interviewerRole: "",
         interviewerEmail: "",
      });
    } catch (error) {
      console.error(error);
      // alert(error.message);
      toast.error(error?.message || "Failed to schedule interview");

    } finally {
      setLoading(false);
    }
  };


  if (candidateLoading) {
  return (
    <div className="p-10 text-lg font-bold">
      Loading candidate...
    </div>
  );
}

if (!candidate) {
  return (
    <div className="p-10 text-red-500 font-bold">
      Candidate not found.
    </div>
  );
}

const candidateName =
  candidate?.name ||
  candidate?.full_name ||
  candidate?.candidate_name ||
  "Unknown Candidate";


  const formatStatus = (status) => {
  if (!status) return "";

  return status
    .replace(/_/g, " ")          // remove underscores
    .replace(/\b\w/g, (c) => c.toUpperCase());  // capitalize words
};



  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
      {/* --- IDENTITY & NAVIGATION HEADER --- */}
      <div className="max-w-6xl mx-auto mb-10 space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all"
          >
            <ChevronLeft
              size={18}
              className="text-slate-400 group-hover:text-indigo-600"
            />
            <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-widest">
              Back
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Application
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-200">
              {/* {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")} */}
                {candidateName
  .split(" ")
  .map((n) => n[0])
  .join("")}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {candidate.full_name}
                </h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100">
                  {/* Candidate Id{candidate.id}  */}
                    Candidate Id # {String(candidate.id).padStart(5, "0")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-wide">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Briefcase size={14} /> {candidate.position}
                </span>
                <span className="flex items-center gap-1.5">
                  <Award size={14} /> {candidate.experience} Years
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={14} /> {candidate.education}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                Direct Contact
              </p>
              <p className="text-xs font-bold text-slate-700">
                {candidate.email}
              </p>
            </div>
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                Candidate Address
              </p>
              <p className="text-xs font-bold text-slate-700">
                {candidate.location}
                {/* {candidate.location.city}, {candidate.location.state} */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SCHEDULING INTERFACE --- */}
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <Calendar size={22} />
              </div>
              Schedule Interview Rounds
            </h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-16">
              Protocol Configuration & Notification Center
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              Candidate Status
            </span>
            <span className="text-sm font-black text-slate-900">
              {/* {candidate.status} Candidate */}
               {formatStatus(candidate.status)} Candidate
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12">
          {/* Form Side */}
          <div className="col-span-12 lg:col-span-7 p-10 space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Session Interface
              </span>
              <div className="flex p-1.5 bg-slate-100 rounded-3xl border border-slate-200/50">
                {["online", "physical"].map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      setScheduleForm({ ...scheduleForm, mode: m })
                    }
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                      scheduleForm.mode === m
                        ? "bg-white shadow-xl text-indigo-600 scale-[1.02]"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {m === "online" ? (
                      <Globe size={16} />
                    ) : (
                      <MapPin size={16} />
                    )}
                    {m} 
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <EnterpriseInput
                label="Interview Date"
                type="date"
                icon={Calendar}
                value={scheduleForm.date}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, date: e.target.value })
                }
              />
              <EnterpriseInput
                label="Interview Time"
                type="time"
                icon={Clock}
                value={scheduleForm.time}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, time: e.target.value })
                }
              />
            </div>

            <EnterpriseInput
              label={
                scheduleForm.mode === "online"
                  ? "Meeting Secure URL"
                  : "Physical Venue Detail"
              }
              placeholder={
                scheduleForm.mode === "online"
                  ? "https://teams.microsoft.com/..."
                  : "Executive Boardroom 02"
              }
              icon={scheduleForm.mode === "online" ? LinkIcon : Building2}
              value={scheduleForm.location}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, location: e.target.value })
              }
            />

            {/* --- PROTOCOL HISTORY TERMINAL --- */}
            <div className="max-w-6xl mx-auto mb-10 space-y-6">
              <div className="flex items-center justify-between ml-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-indigo-500" /> Previous
                  Protocol Records
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {interviews.length} Round(s) Finalized
                </span>
              </div>

              <div className="space-y-4">
                {interviews.map((item, index) => {
                  const isCompleted = item.date && item.interviewer;

                  return (
                    <div
                      key={index}
                      className="group relative bg-white border border-slate-200 p-1 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row items-stretch gap-6 p-5">
                        {/* Round Box */}
                        <div className="flex flex-col items-center justify-center bg-slate-900 text-white rounded-[22px] px-6 py-4 min-w-[120px]">
                          <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">
                            Round
                          </span>
                          <span className="text-2xl font-black italic">
                            0{item.round}
                          </span>
                          <div
                            className={`mt-2 px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-tighter text-white ${
                              isCompleted ? "bg-emerald-500" : "bg-yellow-500"
                            }`}
                          >
                            {isCompleted ? "Completed" : "Pending"}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          {isCompleted ? (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-bold text-xs">
                                    {item.interviewer
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                      {item.interviewer}
                                    </h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                                      {item.role}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-slate-900">
                                    {item.date}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {item.time}
                                  </p>
                                </div>
                              </div>

                              <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 ml-2">
                                <div className="absolute left-[-6px] top-4 w-3 h-3 bg-slate-50 border-l border-b border-slate-100 rotate-45" />
                                <p className="text-[11px] text-slate-600 font-semibold italic">
                                  {/* "{item.feedback}" */}
                                  "{item.feedback?.remarks || "No feedback available"}"
                                </p>

                                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                    HR Remark: {item.remark}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                                    <Activity
                                      size={10}
                                      className="text-indigo-500"
                                    />
                                    SCORE: {item.score}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm font-bold italic">
                              Round not completed yet / No data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Side */}
          <div className="col-span-12 lg:col-span-5 bg-slate-50/50 p-10 border-l border-slate-100 flex flex-col">
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Interviewer Details
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Interviewer 
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <EnterpriseInput
                  label="Interviewer Name"
                  placeholder="Enter interviewer name"
                  value={scheduleForm.interviewerName}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      interviewerName: e.target.value,
                    })
                  }
                />


<EnterpriseInput
  label="Interviewer Email"
  type="email"
  placeholder="panelist@company.com"
  icon={Mail}
  value={scheduleForm.interviewerEmail}
  onChange={(e) =>
    setScheduleForm({
      ...scheduleForm,
      interviewerEmail: e.target.value,
    })
  }
/>



                <EnterpriseInput
                  label="Official Designation"
                  placeholder="e.g. Senior VP of Engineering"
                  value={scheduleForm.interviewerRole}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      interviewerRole: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-12 space-y-6">
             
              <button
                onClick={handleScheduleInterview}
                disabled={loading || isScheduled}
                className={`w-full py-5 rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em]
  flex items-center justify-center gap-4 active:scale-95
  ${
    isScheduled
      ? "bg-emerald-500 text-white shadow-lg"
      : "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl"
  }
  ${loading ? "opacity-70 cursor-not-allowed" : ""}
`}
              >
                {loading ? (
                  <>Scheduling...</>
                ) : isScheduled ? (
                  <>
                    <ShieldCheck size={20} /> Schedule Locked
                  </>
                ) : (
                  <>
                    <Activity size={20} /> Schedule Round
                  </>
                )}
              </button>

              {/* <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-[10px] text-indigo-700 font-bold leading-relaxed text-center italic">
                  "System will trigger automated invitations to{" "}
                  {candidateName.split(" ")} and the assigned panelist upon
                  deployment."
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;
//******************************************working code phase 4444444********************************************** */
// import React, { useState,useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   Clock,
//   Globe,
//   MapPin,
//   User,
//   ShieldCheck,
//   Link as LinkIcon,
//   Building2,
//   Activity,
//   ChevronLeft,
//   Mail,
//   Phone,
//   Briefcase,
//   GraduationCap,
//   Award,
// } from "lucide-react";
// import EnterpriseInput from "../../components/comman/EnterpriseInput";
// import { interviewService } from "../../services/interviewService";
// import { candidateService } from "../../services/candidateService";

// const ScheduleInterview = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- Added State for History ---
//   // const [interviews] = useState([
//   //   {
//   //     round: 1,
//   //     date: "Jan 12, 2026",
//   //     time: "10:30 AM",
//   //     mode: "online",
//   //     interviewer: "Sarah Connor",
//   //     role: "Engineering Manager",
//   //     status: "Completed",
//   //     score: 8.4,
//   //     feedback:
//   //       "Exceptional depth in React Internals. Strong architectural thinking. Candidate needs more exposure to AWS infrastructure.",
//   //     remark: "Recommended for Round 02 with Senior Architect.",
//   //   },

//   //   {
//   //     round: 2,
//   //     date: "Jan 18, 2026",
//   //     time: "02:00 PM",
//   //     mode: "physical",
//   //     interviewer: "Michael Scott",
//   //     role: "Senior Architect",
//   //     status: "Pending",
//   //     score: 7.5,
//   //     feedback: "",
//   //     remark: "Interview scheduled. Awaiting feedback.",
//   //   },
//   // ]);

//   const [interviews, setInterviews] = useState([]);
// const [interviewLoading, setInterviewLoading] = useState(false);


//   // --- 1. Integrated Candidate State ---
//   // const [candidate] = useState({
//   //   id: id || "CAN-8821",
//   //   name: "Arjun Mehta",
//   //   email: "arjun.m@tech-global.com",
//   //   phone: "+91 98765 43210",
//   //   position: "Senior Frontend Lead",
//   //   experience: "6 Years",
//   //   education: "B.Tech Computer Science",
//   //   status: "Verified",
//   //   location: {
//   //     city: "Mumbai",
//   //     state: "Maharashtra",
//   //     pincode: "400001",
//   //     address: "124, Skyline Towers, Andheri East",
//   //   },
//   //   bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
//   // });
// const [candidate, setCandidate] = useState(null);
// const [candidateLoading, setCandidateLoading] = useState(true);
//   const [scheduleForm, setScheduleForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerRole: "",
//   });
//   const [isScheduled, setIsScheduled] = useState(false);
//   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //   const fetchCandidate = async () => {
// //     try {
// //       setCandidateLoading(true);

// //       const data = await candidateService.getById(id);

// //       setCandidate(data);

// //     } catch (error) {
// //       console.error("Failed to fetch candidate:", error);
// //     } finally {
// //       setCandidateLoading(false);
// //     }
// //   };

// //   if (id) {
// //     fetchCandidate();
// //   }
// // }, [id]);

// useEffect(() => {
//   if (id) fetchCandidate();
// }, [id]);

//  const fetchCandidate = async () => {
//     try {
//       setCandidateLoading(true);
//       setInterviewLoading(true);

//       const data = await candidateService.getById(id);

//       setCandidate(data);

//       // ✅ Convert interviews
//       const mappedInterviews = (data.interviews || []).map((i) => {
//         const dateObj = new Date(i.interview_date);

//         return {
//           id: i.id,
//           round: i.round_number,
//           date: dateObj.toLocaleDateString(),
//           time: dateObj.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//           mode: i.mode,
//           interviewer: i.interviewer_name,
//           role: i.interviewer_designation || "Panelist",
//           status: i.status,
//           // feedback: i.review || "",
//           // score: i.score || null,
//           // remark: i.review || "Awaiting feedback",
//           feedback: i.review?.remarks || "",
// remark: i.review?.decision || "Awaiting feedback",
// score: i.review?.total_score || null,

//         };
//       });

//       setInterviews(mappedInterviews);

//     } catch (error) {
//       console.error("Failed to fetch candidate:", error);
//     } finally {
//       setCandidateLoading(false);
//       setInterviewLoading(false);
//     }
//   };


//   const handleScheduleInterview = async () => {
//     // ✅ Validation
//     if (
//       !scheduleForm.date ||
//       !scheduleForm.time ||
//       !scheduleForm.location ||
//       !scheduleForm.interviewerName ||
//       !scheduleForm.interviewerRole
//     ) {
//       alert("Please fill all fields before scheduling.");
//       return;
//     }

//     try {
//       setLoading(true);

     
//       // const payload = {
//       //   candidate_id: Number(candidate.id), // safer if backend expects int
//       //   round: interviews.length + 1,

//       //   interview_date: scheduleForm.date, // ✅ FIXED
//       //   interview_time: scheduleForm.time, // ⚠️ recommend matching backend naming

//       //   mode: scheduleForm.mode === "online" ? "Online" : "Offline",

//       //   location: scheduleForm.location,
//       //   interviewer_name: scheduleForm.interviewerName,
//       //   interviewer_role: scheduleForm.interviewerRole,
//       // };


//       const payload = {
//   candidate_id: Number(candidate.id),

//   mode: scheduleForm.mode === "online" ? "online" : "offline",

//   // Convert to ISO (Backend expects timestamp)
//   interview_date: new Date(
//     `${scheduleForm.date}T${scheduleForm.time}`
//   ).toISOString(),

//   interviewer_name: scheduleForm.interviewerName,
//   interviewer_email: "vinayakarjun1234@gmail.com", // or from input if needed
//   interviewer_designation: scheduleForm.interviewerRole,

//   // Conditional fields
//   ...(scheduleForm.mode === "online"
//     ? { meeting_link: scheduleForm.location }
//     : { venue_details: scheduleForm.location }),
// };


//       await interviewService.scheduleInterview(payload);

//       setIsScheduled(true);

//       await fetchCandidate();

//       // Optional UX improvement:
//       // alert("Interview scheduled successfully!");
//       toast.success("Interview scheduled successfully!");

//       // Optional reset:
//       setScheduleForm({
//         date: "",
//         time: "",
//         mode: "online",
//         location: "",
//         interviewerName: "",
//         interviewerRole: "",
//       });
//     } catch (error) {
//       console.error(error);
//       // alert(error.message);
//       toast.error(error?.message || "Failed to schedule interview");

//     } finally {
//       setLoading(false);
//     }
//   };


//   if (candidateLoading) {
//   return (
//     <div className="p-10 text-lg font-bold">
//       Loading candidate...
//     </div>
//   );
// }

// if (!candidate) {
//   return (
//     <div className="p-10 text-red-500 font-bold">
//       Candidate not found.
//     </div>
//   );
// }

// const candidateName =
//   candidate?.name ||
//   candidate?.full_name ||
//   candidate?.candidate_name ||
//   "Unknown Candidate";



//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
//       {/* --- IDENTITY & NAVIGATION HEADER --- */}
//       <div className="max-w-6xl mx-auto mb-10 space-y-8">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all"
//           >
//             <ChevronLeft
//               size={18}
//               className="text-slate-400 group-hover:text-indigo-600"
//             />
//             <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-widest">
//               Back
//             </span>
//           </button>

//           <div className="flex items-center gap-3">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//               Application Intelligence
//             </span>
//             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           <div className="flex items-start gap-6">
//             <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-200">
//               {/* {candidate.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")} */}
//                 {candidateName
//   .split(" ")
//   .map((n) => n[0])
//   .join("")}
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight">
//                   {candidate.full_name}
//                 </h1>
//                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100">
//                   {candidate.id}
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-wide">
//                 <span className="flex items-center gap-1.5 text-indigo-600">
//                   <Briefcase size={14} /> {candidate.position}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <Award size={14} /> {candidate.experience}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <GraduationCap size={14} /> {candidate.education}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                 Direct Contact
//               </p>
//               <p className="text-xs font-bold text-slate-700">
//                 {candidate.email}
//               </p>
//             </div>
//             <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                 Geographical Origin
//               </p>
//               <p className="text-xs font-bold text-slate-700">
//                 {candidate.location}
//                 {/* {candidate.location.city}, {candidate.location.state} */}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- SCHEDULING INTERFACE --- */}
//       <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
//         <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex justify-between items-end">
//           <div className="space-y-1">
//             <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
//               <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
//                 <Calendar size={22} />
//               </div>
//               Schedule Interview Rounds
//             </h2>
//             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-16">
//               Protocol Configuration & Notification Center
//             </p>
//           </div>
//           <div className="hidden md:flex flex-col items-end">
//             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//               Candidate Status
//             </span>
//             <span className="text-sm font-black text-slate-900">
//               {candidate.status} Candidate
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-12">
//           {/* Form Side */}
//           <div className="col-span-12 lg:col-span-7 p-10 space-y-10">
//             <div className="space-y-4">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Session Interface
//               </span>
//               <div className="flex p-1.5 bg-slate-100 rounded-3xl border border-slate-200/50">
//                 {["online", "physical"].map((m) => (
//                   <button
//                     key={m}
//                     onClick={() =>
//                       setScheduleForm({ ...scheduleForm, mode: m })
//                     }
//                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
//                       scheduleForm.mode === m
//                         ? "bg-white shadow-xl text-indigo-600 scale-[1.02]"
//                         : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {m === "online" ? (
//                       <Globe size={16} />
//                     ) : (
//                       <MapPin size={16} />
//                     )}
//                     {m} 
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-8">
//               <EnterpriseInput
//                 label="Execution Date"
//                 type="date"
//                 icon={Calendar}
//                 value={scheduleForm.date}
//                 onChange={(e) =>
//                   setScheduleForm({ ...scheduleForm, date: e.target.value })
//                 }
//               />
//               <EnterpriseInput
//                 label="Synchronization Time"
//                 type="time"
//                 icon={Clock}
//                 value={scheduleForm.time}
//                 onChange={(e) =>
//                   setScheduleForm({ ...scheduleForm, time: e.target.value })
//                 }
//               />
//             </div>

//             <EnterpriseInput
//               label={
//                 scheduleForm.mode === "online"
//                   ? "Meeting Secure URL"
//                   : "Physical Venue Detail"
//               }
//               placeholder={
//                 scheduleForm.mode === "online"
//                   ? "https://teams.microsoft.com/..."
//                   : "Executive Boardroom 02"
//               }
//               icon={scheduleForm.mode === "online" ? LinkIcon : Building2}
//               value={scheduleForm.location}
//               onChange={(e) =>
//                 setScheduleForm({ ...scheduleForm, location: e.target.value })
//               }
//             />

//             {/* --- PROTOCOL HISTORY TERMINAL --- */}
//             <div className="max-w-6xl mx-auto mb-10 space-y-6">
//               <div className="flex items-center justify-between ml-2">
//                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
//                   <Activity size={14} className="text-indigo-500" /> Previous
//                   Protocol Records
//                 </h3>
//                 <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//                   {interviews.length} Round(s) Finalized
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 {interviews.map((item, index) => {
//                   const isCompleted = item.date && item.interviewer;

//                   return (
//                     <div
//                       key={index}
//                       className="group relative bg-white border border-slate-200 p-1 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
//                     >
//                       <div className="flex flex-col lg:flex-row items-stretch gap-6 p-5">
//                         {/* Round Box */}
//                         <div className="flex flex-col items-center justify-center bg-slate-900 text-white rounded-[22px] px-6 py-4 min-w-[120px]">
//                           <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">
//                             Round
//                           </span>
//                           <span className="text-2xl font-black italic">
//                             0{item.round}
//                           </span>
//                           <div
//                             className={`mt-2 px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-tighter text-white ${
//                               isCompleted ? "bg-emerald-500" : "bg-yellow-500"
//                             }`}
//                           >
//                             {isCompleted ? "Completed" : "Pending"}
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 space-y-4">
//                           {isCompleted ? (
//                             <>
//                               <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                   <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-bold text-xs">
//                                     {item.interviewer
//                                       .split(" ")
//                                       .map((n) => n[0])
//                                       .join("")}
//                                   </div>
//                                   <div>
//                                     <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
//                                       {item.interviewer}
//                                     </h4>
//                                     <p className="text-[9px] text-slate-400 font-bold uppercase">
//                                       {item.role}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="text-xs font-black text-slate-900">
//                                     {item.date}
//                                   </p>
//                                   <p className="text-[10px] text-slate-400">
//                                     {item.time}
//                                   </p>
//                                 </div>
//                               </div>

//                               <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 ml-2">
//                                 <div className="absolute left-[-6px] top-4 w-3 h-3 bg-slate-50 border-l border-b border-slate-100 rotate-45" />
//                                 <p className="text-[11px] text-slate-600 font-semibold italic">
//                                   {/* "{item.feedback}" */}
//                                   "{item.feedback?.remarks || "No feedback available"}"
//                                 </p>

//                                 <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
//                                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
//                                     HR Remark: {item.remark}
//                                   </span>
//                                   <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
//                                     <Activity
//                                       size={10}
//                                       className="text-indigo-500"
//                                     />
//                                     SCORE: {item.score}
//                                   </div>
//                                 </div>
//                               </div>
//                             </>
//                           ) : (
//                             <div className="flex items-center justify-center h-full text-slate-400 text-sm font-bold italic">
//                               Round not completed yet / No data available
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Action Side */}
//           <div className="col-span-12 lg:col-span-5 bg-slate-50/50 p-10 border-l border-slate-100 flex flex-col">
//             <div className="space-y-8">
//               <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
//                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
//                   <User size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     Assign Panelist
//                   </h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                     Lead Decision Maker
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <EnterpriseInput
//                   label="Panelist Name"
//                   placeholder="Enter interviewer name"
//                   value={scheduleForm.interviewerName}
//                   onChange={(e) =>
//                     setScheduleForm({
//                       ...scheduleForm,
//                       interviewerName: e.target.value,
//                     })
//                   }
//                 />
//                 <EnterpriseInput
//                   label="Official Designation"
//                   placeholder="e.g. Senior VP of Engineering"
//                   value={scheduleForm.interviewerRole}
//                   onChange={(e) =>
//                     setScheduleForm({
//                       ...scheduleForm,
//                       interviewerRole: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>

//             <div className="mt-12 space-y-6">
             
//               <button
//                 onClick={handleScheduleInterview}
//                 disabled={loading || isScheduled}
//                 className={`w-full py-5 rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em]
//   flex items-center justify-center gap-4 active:scale-95
//   ${
//     isScheduled
//       ? "bg-emerald-500 text-white shadow-lg"
//       : "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl"
//   }
//   ${loading ? "opacity-70 cursor-not-allowed" : ""}
// `}
//               >
//                 {loading ? (
//                   <>Scheduling...</>
//                 ) : isScheduled ? (
//                   <>
//                     <ShieldCheck size={20} /> Schedule Locked
//                   </>
//                 ) : (
//                   <>
//                     <Activity size={20} /> Deploy Round
//                   </>
//                 )}
//               </button>

//               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
//                 <p className="text-[10px] text-indigo-700 font-bold leading-relaxed text-center italic">
//                   "System will trigger automated invitations to{" "}
//                   {candidateName.split(" ")} and the assigned panelist upon
//                   deployment."
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleInterview;
//***********************************************working code phase 225555******************************************************** */
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   Clock,
//   Globe,
//   MapPin,
//   User,
//   ShieldCheck,
//   Link as LinkIcon,
//   Building2,
//   Activity,
//   ChevronLeft,
//   Mail,
//   Phone,
//   Briefcase,
//   GraduationCap,
//   Award,
// } from "lucide-react";
// import EnterpriseInput from "../../components/comman/EnterpriseInput";
// import { interviewService } from "../../services/interviewService";

// const ScheduleInterview = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- Added State for History ---
//   const [interviews] = useState([
//     {
//       round: 1,
//       date: "Jan 12, 2026",
//       time: "10:30 AM",
//       mode: "online",
//       interviewer: "Sarah Connor",
//       role: "Engineering Manager",
//       status: "Completed",
//       score: 8.4,
//       feedback:
//         "Exceptional depth in React Internals. Strong architectural thinking. Candidate needs more exposure to AWS infrastructure.",
//       remark: "Recommended for Round 02 with Senior Architect.",
//     },

//     {
//       round: 2,
//       date: "Jan 18, 2026",
//       time: "02:00 PM",
//       mode: "physical",
//       interviewer: "Michael Scott",
//       role: "Senior Architect",
//       status: "Pending",
//       score: 7.5,
//       feedback: "",
//       remark: "Interview scheduled. Awaiting feedback.",
//     },
//   ]);

//   // --- 1. Integrated Candidate State ---
//   const [candidate] = useState({
//     id: id || "CAN-8821",
//     name: "Arjun Mehta",
//     email: "arjun.m@tech-global.com",
//     phone: "+91 98765 43210",
//     position: "Senior Frontend Lead",
//     experience: "6 Years",
//     education: "B.Tech Computer Science",
//     status: "Verified",
//     location: {
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       address: "124, Skyline Towers, Andheri East",
//     },
//     bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
//   });

//   const [scheduleForm, setScheduleForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerRole: "",
//   });
//   const [isScheduled, setIsScheduled] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleScheduleInterview = async () => {
//     // ✅ Validation
//     if (
//       !scheduleForm.date ||
//       !scheduleForm.time ||
//       !scheduleForm.location ||
//       !scheduleForm.interviewerName ||
//       !scheduleForm.interviewerRole
//     ) {
//       alert("Please fill all fields before scheduling.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // const payload = {
//       //   candidate_id: candidate.id,
//       //   round: interviews.length + 1, // next round
//       //   date: scheduleForm.date,
//       //   time: scheduleForm.time,
//       //   mode: scheduleForm.mode,
//       //   location: scheduleForm.location,
//       //   interviewer_name: scheduleForm.interviewerName,
//       //   interviewer_role: scheduleForm.interviewerRole,
//       // };

//       const payload = {
//         candidate_id: Number(candidate.id), // safer if backend expects int
//         round: interviews.length + 1,

//         interview_date: scheduleForm.date, // ✅ FIXED
//         interview_time: scheduleForm.time, // ⚠️ recommend matching backend naming

//         mode: scheduleForm.mode === "online" ? "Online" : "Offline",

//         location: scheduleForm.location,
//         interviewer_name: scheduleForm.interviewerName,
//         interviewer_role: scheduleForm.interviewerRole,
//       };

//       await interviewService.scheduleInterview(payload);

//       setIsScheduled(true);

//       // Optional UX improvement:
//       alert("Interview scheduled successfully!");

//       // Optional reset:
//       setScheduleForm({
//         date: "",
//         time: "",
//         mode: "online",
//         location: "",
//         interviewerName: "",
//         interviewerRole: "",
//       });
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
//       {/* --- IDENTITY & NAVIGATION HEADER --- */}
//       <div className="max-w-6xl mx-auto mb-10 space-y-8">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all"
//           >
//             <ChevronLeft
//               size={18}
//               className="text-slate-400 group-hover:text-indigo-600"
//             />
//             <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-widest">
//               Back
//             </span>
//           </button>

//           <div className="flex items-center gap-3">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//               Application Intelligence
//             </span>
//             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           <div className="flex items-start gap-6">
//             <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-200">
//               {candidate.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight">
//                   {candidate.name}
//                 </h1>
//                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100">
//                   {candidate.id}
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-wide">
//                 <span className="flex items-center gap-1.5 text-indigo-600">
//                   <Briefcase size={14} /> {candidate.position}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <Award size={14} /> {candidate.experience}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <GraduationCap size={14} /> {candidate.education}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                 Direct Contact
//               </p>
//               <p className="text-xs font-bold text-slate-700">
//                 {candidate.email}
//               </p>
//             </div>
//             <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                 Geographical Origin
//               </p>
//               <p className="text-xs font-bold text-slate-700">
//                 {candidate.location.city}, {candidate.location.state}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- SCHEDULING INTERFACE --- */}
//       <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
//         <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex justify-between items-end">
//           <div className="space-y-1">
//             <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
//               <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
//                 <Calendar size={22} />
//               </div>
//               Schedule Interview Rounds
//             </h2>
//             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-16">
//               Protocol Configuration & Notification Center
//             </p>
//           </div>
//           <div className="hidden md:flex flex-col items-end">
//             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//               Candidate Status
//             </span>
//             <span className="text-sm font-black text-slate-900">
//               {candidate.status} Candidate
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-12">
//           {/* Form Side */}
//           <div className="col-span-12 lg:col-span-7 p-10 space-y-10">
//             <div className="space-y-4">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Session Interface
//               </span>
//               <div className="flex p-1.5 bg-slate-100 rounded-3xl border border-slate-200/50">
//                 {["online", "physical"].map((m) => (
//                   <button
//                     key={m}
//                     onClick={() =>
//                       setScheduleForm({ ...scheduleForm, mode: m })
//                     }
//                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
//                       scheduleForm.mode === m
//                         ? "bg-white shadow-xl text-indigo-600 scale-[1.02]"
//                         : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {m === "online" ? (
//                       <Globe size={16} />
//                     ) : (
//                       <MapPin size={16} />
//                     )}
//                     {m} Protocol
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-8">
//               <EnterpriseInput
//                 label="Execution Date"
//                 type="date"
//                 icon={Calendar}
//                 value={scheduleForm.date}
//                 onChange={(e) =>
//                   setScheduleForm({ ...scheduleForm, date: e.target.value })
//                 }
//               />
//               <EnterpriseInput
//                 label="Synchronization Time"
//                 type="time"
//                 icon={Clock}
//                 value={scheduleForm.time}
//                 onChange={(e) =>
//                   setScheduleForm({ ...scheduleForm, time: e.target.value })
//                 }
//               />
//             </div>

//             <EnterpriseInput
//               label={
//                 scheduleForm.mode === "online"
//                   ? "Meeting Secure URL"
//                   : "Physical Venue Detail"
//               }
//               placeholder={
//                 scheduleForm.mode === "online"
//                   ? "https://teams.microsoft.com/..."
//                   : "Executive Boardroom 02"
//               }
//               icon={scheduleForm.mode === "online" ? LinkIcon : Building2}
//               value={scheduleForm.location}
//               onChange={(e) =>
//                 setScheduleForm({ ...scheduleForm, location: e.target.value })
//               }
//             />

//             {/* --- PROTOCOL HISTORY TERMINAL --- */}
//             <div className="max-w-6xl mx-auto mb-10 space-y-6">
//               <div className="flex items-center justify-between ml-2">
//                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
//                   <Activity size={14} className="text-indigo-500" /> Previous
//                   Protocol Records
//                 </h3>
//                 <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//                   {interviews.length} Round(s) Finalized
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 {interviews.map((item, index) => {
//                   const isCompleted = item.date && item.interviewer;

//                   return (
//                     <div
//                       key={index}
//                       className="group relative bg-white border border-slate-200 p-1 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
//                     >
//                       <div className="flex flex-col lg:flex-row items-stretch gap-6 p-5">
//                         {/* Round Box */}
//                         <div className="flex flex-col items-center justify-center bg-slate-900 text-white rounded-[22px] px-6 py-4 min-w-[120px]">
//                           <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">
//                             Round
//                           </span>
//                           <span className="text-2xl font-black italic">
//                             0{item.round}
//                           </span>
//                           <div
//                             className={`mt-2 px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-tighter text-white ${
//                               isCompleted ? "bg-emerald-500" : "bg-yellow-500"
//                             }`}
//                           >
//                             {isCompleted ? "Completed" : "Pending"}
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 space-y-4">
//                           {isCompleted ? (
//                             <>
//                               <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                   <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-bold text-xs">
//                                     {item.interviewer
//                                       .split(" ")
//                                       .map((n) => n[0])
//                                       .join("")}
//                                   </div>
//                                   <div>
//                                     <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
//                                       {item.interviewer}
//                                     </h4>
//                                     <p className="text-[9px] text-slate-400 font-bold uppercase">
//                                       {item.role}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="text-xs font-black text-slate-900">
//                                     {item.date}
//                                   </p>
//                                   <p className="text-[10px] text-slate-400">
//                                     {item.time}
//                                   </p>
//                                 </div>
//                               </div>

//                               <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 ml-2">
//                                 <div className="absolute left-[-6px] top-4 w-3 h-3 bg-slate-50 border-l border-b border-slate-100 rotate-45" />
//                                 <p className="text-[11px] text-slate-600 font-semibold italic">
//                                   "{item.feedback}"
//                                 </p>

//                                 <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
//                                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
//                                     HR Remark: {item.remark}
//                                   </span>
//                                   <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
//                                     <Activity
//                                       size={10}
//                                       className="text-indigo-500"
//                                     />
//                                     SCORE: {item.score}
//                                   </div>
//                                 </div>
//                               </div>
//                             </>
//                           ) : (
//                             <div className="flex items-center justify-center h-full text-slate-400 text-sm font-bold italic">
//                               Round not completed yet / No data available
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Action Side */}
//           <div className="col-span-12 lg:col-span-5 bg-slate-50/50 p-10 border-l border-slate-100 flex flex-col">
//             <div className="space-y-8">
//               <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
//                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
//                   <User size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//                     Assign Panelist
//                   </h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                     Lead Decision Maker
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <EnterpriseInput
//                   label="Panelist Name"
//                   placeholder="Enter interviewer name"
//                   value={scheduleForm.interviewerName}
//                   onChange={(e) =>
//                     setScheduleForm({
//                       ...scheduleForm,
//                       interviewerName: e.target.value,
//                     })
//                   }
//                 />
//                 <EnterpriseInput
//                   label="Official Designation"
//                   placeholder="e.g. Senior VP of Engineering"
//                   value={scheduleForm.interviewerRole}
//                   onChange={(e) =>
//                     setScheduleForm({
//                       ...scheduleForm,
//                       interviewerRole: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>

//             <div className="mt-12 space-y-6">
//               {/* <button
//                 // onClick={() => setIsScheduled(true)}
//                 onClick={handleScheduleInterview}
// disabled={loading || isScheduled}

//                 className={`w-full py-5 rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 active:scale-95 ${
//                   isScheduled 
//                   ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" 
//                   : "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl shadow-slate-300"
//                 }`}
//               >
//                 {isScheduled ? (
//                   <><ShieldCheck size={20} /> Schedule Locked</>
//                 ) : (
//                   <><Activity size={20} /> Deploy Round</>
//                 )}
//               </button> */}
//               <button
//                 onClick={handleScheduleInterview}
//                 disabled={loading || isScheduled}
//                 className={`w-full py-5 rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em]
//   flex items-center justify-center gap-4 active:scale-95
//   ${
//     isScheduled
//       ? "bg-emerald-500 text-white shadow-lg"
//       : "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl"
//   }
//   ${loading ? "opacity-70 cursor-not-allowed" : ""}
// `}
//               >
//                 {loading ? (
//                   <>Scheduling...</>
//                 ) : isScheduled ? (
//                   <>
//                     <ShieldCheck size={20} /> Schedule Locked
//                   </>
//                 ) : (
//                   <>
//                     <Activity size={20} /> Deploy Round
//                   </>
//                 )}
//               </button>

//               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
//                 <p className="text-[10px] text-indigo-700 font-bold leading-relaxed text-center italic">
//                   "System will trigger automated invitations to{" "}
//                   {candidate.name.split(" ")[0]} and the assigned panelist upon
//                   deployment."
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleInterview;
//****************************************************working code phase 224******************************************************** */

// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Calendar, Clock, Globe, MapPin, User, ShieldCheck,
//   Link as LinkIcon, Building2, Activity, ChevronLeft,
//   Mail, Phone, Briefcase, GraduationCap, Award
// } from "lucide-react";

// const ScheduleInterview = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- Added State for History ---
// const [interviews] = useState([
//   {
//     round: 1,
//     date: "Jan 12, 2026",
//     time: "10:30 AM",
//     mode: "online",
//     interviewer: "Sarah Connor",
//     role: "Engineering Manager",
//     status: "Completed",
//     score: 8.4,
//     feedback:
//       "Exceptional depth in React Internals. Strong architectural thinking. Candidate needs more exposure to AWS infrastructure.",
//     remark: "Recommended for Round 02 with Senior Architect."
//   },

//   {
//     round: 2,
//     date: "Jan 18, 2026",
//     time: "02:00 PM",
//     mode: "physical",
//     interviewer: "Michael Scott",
//     role: "Senior Architect",
//     status: "Pending",
//     score: 7.5,
//     feedback: "",
//     remark: "Interview scheduled. Awaiting feedback."
//   },

// ]);

//   // --- 1. Integrated Candidate State ---
//   const [candidate] = useState({
//     id: id || "CAN-8821",
//     name: "Arjun Mehta",
//     email: "arjun.m@tech-global.com",
//     phone: "+91 98765 43210",
//     position: "Senior Frontend Lead",
//     experience: "6 Years",
//     education: "B.Tech Computer Science",
//     status: "Verified",
//     location: {
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       address: "124, Skyline Towers, Andheri East",
//     },
//     bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
//   });

//   const [scheduleForm, setScheduleForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerRole: ""
//   });
//   const [isScheduled, setIsScheduled] = useState(false);

//   // --- 2. Professional Input Component ---
//   const EnterpriseInput = ({ label, value, onChange, type = "text", placeholder, icon: Icon }) => (
//     <div className="flex flex-col gap-2 group w-full">
//       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//         {label}
//       </label>
//       <div className="relative">
//         {/* {Icon && (
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//             <Icon size={16} />
//           </div>
//         )} */}
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl ${Icon ? 'pl-12' : 'px-5'} py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-sm hover:bg-slate-100/50`}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">

//       {/* --- IDENTITY & NAVIGATION HEADER --- */}
//       <div className="max-w-6xl mx-auto mb-10 space-y-8">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all"
//           >
//             <ChevronLeft size={18} className="text-slate-400 group-hover:text-indigo-600" />
//             <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-widest">Back</span>
//           </button>

//           <div className="flex items-center gap-3">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application Intelligence</span>
//             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           <div className="flex items-start gap-6">
//             <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-200">
//               {candidate.name.split(' ').map(n => n[0]).join('')}
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight">{candidate.name}</h1>
//                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100">
//                   {candidate.id}
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-wide">
//                 <span className="flex items-center gap-1.5 text-indigo-600"><Briefcase size={14}/> {candidate.position}</span>
//                 <span className="flex items-center gap-1.5"><Award size={14}/> {candidate.experience}</span>
//                 <span className="flex items-center gap-1.5"><GraduationCap size={14}/> {candidate.education}</span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Direct Contact</p>
//                 <p className="text-xs font-bold text-slate-700">{candidate.email}</p>
//              </div>
//              <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Geographical Origin</p>
//                 <p className="text-xs font-bold text-slate-700">{candidate.location.city}, {candidate.location.state}</p>
//              </div>
//           </div>
//         </div>
//       </div>

//       {/* --- SCHEDULING INTERFACE --- */}
//       <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">

//         <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex justify-between items-end">
//           <div className="space-y-1">
//             <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
//               <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
//                 <Calendar size={22} />
//               </div>
//              Schedule Interview Rounds
//             </h2>
//             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-16">
//               Protocol Configuration & Notification Center
//             </p>
//           </div>
//           <div className="hidden md:flex flex-col items-end">
//             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Candidate Status</span>
//             <span className="text-sm font-black text-slate-900">{candidate.status} Candidate</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-12">
//           {/* Form Side */}
//           <div className="col-span-12 lg:col-span-7 p-10 space-y-10">

//             <div className="space-y-4">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Interface</span>
//               <div className="flex p-1.5 bg-slate-100 rounded-3xl border border-slate-200/50">
//                 {["online", "physical"].map((m) => (
//                   <button
//                     key={m}
//                     onClick={() => setScheduleForm({ ...scheduleForm, mode: m })}
//                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
//                       scheduleForm.mode === m
//                       ? "bg-white shadow-xl text-indigo-600 scale-[1.02]"
//                       : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {m === 'online' ? <Globe size={16} /> : <MapPin size={16} />}
//                     {m} Protocol
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-8">
//               <EnterpriseInput
//                 label="Execution Date"
//                 type="date"
//                 icon={Calendar}
//                 value={scheduleForm.date}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
//               />
//               <EnterpriseInput
//                 label="Synchronization Time"
//                 type="time"
//                 icon={Clock}
//                 value={scheduleForm.time}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
//               />
//             </div>

//             <EnterpriseInput
//               label={scheduleForm.mode === "online" ? "Meeting Secure URL" : "Physical Venue Detail"}
//               placeholder={scheduleForm.mode === "online" ? "https://teams.microsoft.com/..." : "Executive Boardroom 02"}
//               icon={scheduleForm.mode === "online" ? LinkIcon : Building2}
//               value={scheduleForm.location}
//               onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
//             />

//             {/* --- PROTOCOL HISTORY TERMINAL --- */}
// <div className="max-w-6xl mx-auto mb-10 space-y-6">
//   <div className="flex items-center justify-between ml-2">
//     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
//       <Activity size={14} className="text-indigo-500" /> Previous Protocol Records
//     </h3>
//     <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//       {interviews.length} Round(s) Finalized
//     </span>
//   </div>

//   <div className="space-y-4">
//     {/* {interviews.map((item, index) => (
//       <div key={index} className="group relative bg-white border border-slate-200 p-1 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
//         <div className="flex flex-col lg:flex-row items-stretch gap-6 p-5">

//           <div className="flex flex-col items-center justify-center bg-slate-900 text-white rounded-[22px] px-6 py-4 min-w-[120px]">
//             <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">Round</span>
//             <span className="text-2xl font-black italic">0{item.round}</span>
//             <div className="mt-2 px-2 py-0.5 bg-indigo-500 text-[8px] font-black rounded-full uppercase tracking-tighter text-white">
//               {item.status}
//             </div>
//           </div>

//           <div className="flex-1 space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-bold text-xs">
//                   {item.interviewer.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.interviewer}</h4>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase">{item.role}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs font-black text-slate-900 tracking-tight">{item.date}</p>
//                 <p className="text-[10px] text-slate-400 font-bold">{item.time}</p>
//               </div>
//             </div>

//             <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 ml-2">
//               <div className="absolute left-[-6px] top-4 w-3 h-3 bg-slate-50 border-l border-b border-slate-100 rotate-45" />
//               <p className="text-[11px] text-slate-600 font-semibold leading-relaxed italic">
//                 "{item.feedback}"
//               </p>
//               <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
//                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">HR Remark: {item.remark}</span>
//                 <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
//                    <Activity size={10} className="text-indigo-500"/> SCORE: {item.score}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))} */}
//     {interviews.map((item, index) => {
//   const isCompleted = item.date && item.interviewer;

//   return (
//     <div key={index} className="group relative bg-white border border-slate-200 p-1 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
//       <div className="flex flex-col lg:flex-row items-stretch gap-6 p-5">

//         {/* Round Box */}
//         <div className="flex flex-col items-center justify-center bg-slate-900 text-white rounded-[22px] px-6 py-4 min-w-[120px]">
//           <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">Round</span>
//           <span className="text-2xl font-black italic">0{item.round}</span>
//           <div className={`mt-2 px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-tighter text-white ${
//             isCompleted ? "bg-emerald-500" : "bg-yellow-500"
//           }`}>
//             {isCompleted ? "Completed" : "Pending"}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 space-y-4">
//           {isCompleted ? (
//             <>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-bold text-xs">
//                     {item.interviewer.split(" ").map(n => n[0]).join("")}
//                   </div>
//                   <div>
//                     <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
//                       {item.interviewer}
//                     </h4>
//                     <p className="text-[9px] text-slate-400 font-bold uppercase">
//                       {item.role}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs font-black text-slate-900">{item.date}</p>
//                   <p className="text-[10px] text-slate-400">{item.time}</p>
//                 </div>
//               </div>

//               <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 ml-2">
//                 <div className="absolute left-[-6px] top-4 w-3 h-3 bg-slate-50 border-l border-b border-slate-100 rotate-45" />
//                 <p className="text-[11px] text-slate-600 font-semibold italic">
//                   "{item.feedback}"
//                 </p>

//                 <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
//                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
//                     HR Remark: {item.remark}
//                   </span>
//                   <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
//                     <Activity size={10} className="text-indigo-500" />
//                     SCORE: {item.score}
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-full text-slate-400 text-sm font-bold italic">
//               Round not completed yet / No data available
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// })}

//   </div>
// </div>
//           </div>

//           {/* Action Side */}
//           <div className="col-span-12 lg:col-span-5 bg-slate-50/50 p-10 border-l border-slate-100 flex flex-col">

//             <div className="space-y-8">
//               <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
//                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
//                   <User size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Assign Panelist</h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lead Decision Maker</p>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <EnterpriseInput
//                   label="Panelist Name"
//                   placeholder="Enter interviewer name"
//                   value={scheduleForm.interviewerName}
//                   onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
//                 />
//                 <EnterpriseInput
//                   label="Official Designation"
//                   placeholder="e.g. Senior VP of Engineering"
//                   value={scheduleForm.interviewerRole}
//                   onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerRole: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="mt-12 space-y-6">
//               <button
//                 onClick={() => setIsScheduled(true)}
//                 className={`w-full py-5 rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 active:scale-95 ${
//                   isScheduled
//                   ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
//                   : "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl shadow-slate-300"
//                 }`}
//               >
//                 {isScheduled ? (
//                   <><ShieldCheck size={20} /> Schedule Locked</>
//                 ) : (
//                   <><Activity size={20} /> Deploy Round</>
//                 )}
//               </button>
//               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
//                 <p className="text-[10px] text-indigo-700 font-bold leading-relaxed text-center italic">
//                   "System will trigger automated invitations to {candidate.name.split(' ')[0]} and the assigned panelist upon deployment."
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default ScheduleInterview;
//****************************************working code phase 3***************************************************** */
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Calendar, Clock, Globe, MapPin, User, ShieldCheck,
//   Link as LinkIcon, Building2, Activity, ChevronLeft,
//   Mail, Phone, Briefcase, GraduationCap, Award
// } from "lucide-react";

// const ScheduleInterview = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- 1. Integrated Candidate State ---
//   const [candidate] = useState({
//     id: id || "CAN-8821",
//     name: "Arjun Mehta",
//     email: "arjun.m@tech-global.com",
//     phone: "+91 98765 43210",
//     position: "Senior Frontend Lead",
//     experience: "6 Years",
//     education: "B.Tech Computer Science",
//     status: "Verified",
//     location: {
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       address: "124, Skyline Towers, Andheri East",
//     },
//     bio: "Passionate frontend architect specializing in React performance optimization, design systems, and micro-frontend architecture for scale.",
//   });

//   const [scheduleForm, setScheduleForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerRole: ""
//   });
//   const [isScheduled, setIsScheduled] = useState(false);

//   // --- 2. Professional Input Component ---
//   const EnterpriseInput = ({ label, value, onChange, type = "text", placeholder, icon: Icon }) => (
//     <div className="flex flex-col gap-2 group w-full">
//       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//         {label}
//       </label>
//       <div className="relative">
//         {/* {Icon && (
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//             <Icon size={16} />
//           </div>
//         )} */}
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl ${Icon ? 'pl-12' : 'px-5'} py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-sm hover:bg-slate-100/50`}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">

//       {/* --- IDENTITY & NAVIGATION HEADER --- */}
//       <div className="max-w-6xl mx-auto mb-10 space-y-8">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all"
//           >
//             <ChevronLeft size={18} className="text-slate-400 group-hover:text-indigo-600" />
//             <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-widest">Back</span>
//           </button>

//           <div className="flex items-center gap-3">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application Intelligence</span>
//             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           <div className="flex items-start gap-6">
//             <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-200">
//               {candidate.name.split(' ').map(n => n[0]).join('')}
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight">{candidate.name}</h1>
//                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100">
//                   {candidate.id}
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-wide">
//                 <span className="flex items-center gap-1.5 text-indigo-600"><Briefcase size={14}/> {candidate.position}</span>
//                 <span className="flex items-center gap-1.5"><Award size={14}/> {candidate.experience}</span>
//                 <span className="flex items-center gap-1.5"><GraduationCap size={14}/> {candidate.education}</span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Direct Contact</p>
//                 <p className="text-xs font-bold text-slate-700">{candidate.email}</p>
//              </div>
//              <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Geographical Origin</p>
//                 <p className="text-xs font-bold text-slate-700">{candidate.location.city}, {candidate.location.state}</p>
//              </div>
//           </div>
//         </div>
//       </div>

//       {/* --- SCHEDULING INTERFACE --- */}
//       <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">

//         <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex justify-between items-end">
//           <div className="space-y-1">
//             <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
//               <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
//                 <Calendar size={22} />
//               </div>
//              Schedule Interview Rounds
//             </h2>
//             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-16">
//               Protocol Configuration & Notification Center
//             </p>
//           </div>
//           <div className="hidden md:flex flex-col items-end">
//             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Candidate Status</span>
//             <span className="text-sm font-black text-slate-900">{candidate.status} Candidate</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-12">
//           {/* Form Side */}
//           <div className="col-span-12 lg:col-span-7 p-10 space-y-10">

//             <div className="space-y-4">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Interface</span>
//               <div className="flex p-1.5 bg-slate-100 rounded-3xl border border-slate-200/50">
//                 {["online", "physical"].map((m) => (
//                   <button
//                     key={m}
//                     onClick={() => setScheduleForm({ ...scheduleForm, mode: m })}
//                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
//                       scheduleForm.mode === m
//                       ? "bg-white shadow-xl text-indigo-600 scale-[1.02]"
//                       : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {m === 'online' ? <Globe size={16} /> : <MapPin size={16} />}
//                     {m} Protocol
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-8">
//               <EnterpriseInput
//                 label="Execution Date"
//                 type="date"
//                 icon={Calendar}
//                 value={scheduleForm.date}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
//               />
//               <EnterpriseInput
//                 label="Synchronization Time"
//                 type="time"
//                 icon={Clock}
//                 value={scheduleForm.time}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
//               />
//             </div>

//             <EnterpriseInput
//               label={scheduleForm.mode === "online" ? "Meeting Secure URL" : "Physical Venue Detail"}
//               placeholder={scheduleForm.mode === "online" ? "https://teams.microsoft.com/..." : "Executive Boardroom 02"}
//               icon={scheduleForm.mode === "online" ? LinkIcon : Building2}
//               value={scheduleForm.location}
//               onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
//             />
//           </div>

//           {/* Action Side */}
//           <div className="col-span-12 lg:col-span-5 bg-slate-50/50 p-10 border-l border-slate-100 flex flex-col justify-between">
//             <div className="space-y-8">
//               <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
//                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
//                   <User size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Assign Panelist</h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lead Decision Maker</p>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <EnterpriseInput
//                   label="Panelist Name"
//                   placeholder="Enter interviewer name"
//                   value={scheduleForm.interviewerName}
//                   onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
//                 />
//                 <EnterpriseInput
//                   label="Official Designation"
//                   placeholder="e.g. Senior VP of Engineering"
//                   value={scheduleForm.interviewerRole}
//                   onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerRole: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="mt-12 space-y-6">
//               <button
//                 onClick={() => setIsScheduled(true)}
//                 className={`w-full py-5 rounded-[26px] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 active:scale-95 ${
//                   isScheduled
//                   ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
//                   : "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl shadow-slate-300"
//                 }`}
//               >
//                 {isScheduled ? (
//                   <><ShieldCheck size={20} /> Schedule Locked</>
//                 ) : (
//                   <><Activity size={20} /> Deploy Round</>
//                 )}
//               </button>
//               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
//                 <p className="text-[10px] text-indigo-700 font-bold leading-relaxed text-center italic">
//                   "System will trigger automated invitations to {candidate.name.split(' ')[0]} and the assigned panelist upon deployment."
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default ScheduleInterview;
//****************************************working cdoe phase 1***************************************************** */
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// // Ensure you have lucide-react installed: npm install lucide-react
// import {
//   Calendar, Clock, Globe, MapPin, User, ShieldCheck,
//   Link as LinkIcon, Building2, Activity, ChevronRight
// } from "lucide-react";

// const ScheduleInterview = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- 1. Keep/Add your state logic here ---
//   const [scheduleForm, setScheduleForm] = useState({
//     date: "",
//     time: "",
//     mode: "online",
//     location: "",
//     interviewerName: "",
//     interviewerRole: ""
//   });
//   const [isScheduled, setIsScheduled] = useState(false);

//   // --- 2. Professional Input Sub-component (Internal) ---
//   const EnterpriseInput = ({ label, value, onChange, type = "text", placeholder, icon: Icon }) => (
//     <div className="flex flex-col gap-2 group w-full">
//       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
//         {label}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//             <Icon size={16} />
//           </div>
//         )}
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl ${Icon ? 'pl-12' : 'px-5'} py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-sm`}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-2">
//       {/* Existing content placeholder */}
//       <div className="mb-6 text-slate-400 text-xs font-medium tracking-widest uppercase flex items-center gap-2">
//         Application ID: <span className="text-slate-900 font-black">{id}</span>
//       </div>

//       {/* --- START OF ENTERPRISE SCHEDULE SECTION --- */}
//       <div className="max-w-5xl mx-auto bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

//         {/* Module Header */}
//         <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//               <div className="p-2 bg-indigo-600 rounded-lg text-white">
//                 <Calendar size={18} />
//               </div>
//               Schedule Interview Round
//             </h2>
//             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-11">
//               Configuration & Logistics Engine
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-12">
//           {/* Left Side: Form Details */}
//           <div className="col-span-12 lg:col-span-7 p-8 space-y-8">

//             {/* Mode Switcher */}
//             <div className="space-y-3">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Protocol</span>
//               <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/50">
//                 {["online", "physical"].map((m) => (
//                   <button
//                     key={m}
//                     onClick={() => setScheduleForm({ ...scheduleForm, mode: m })}
//                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
//                       scheduleForm.mode === m
//                       ? "bg-white shadow-md text-indigo-600"
//                       : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {m === 'online' ? <Globe size={14} /> : <MapPin size={14} />}
//                     {m}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <EnterpriseInput
//                 label="Date"
//                 type="date"
//                 icon={Calendar}
//                 value={scheduleForm.date}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
//               />
//               <EnterpriseInput
//                 label="Time"
//                 type="time"
//                 icon={Clock}
//                 value={scheduleForm.time}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
//               />
//             </div>

//             <EnterpriseInput
//               label={scheduleForm.mode === "online" ? "Meeting Link" : "Office Location"}
//               placeholder={scheduleForm.mode === "online" ? "https://zoom.us/..." : "Floor 4, Suite 2"}
//               icon={scheduleForm.mode === "online" ? LinkIcon : Building2}
//               value={scheduleForm.location}
//               onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
//             />
//           </div>

//           {/* Right Side: Interviewer & Submit */}
//           <div className="col-span-12 lg:col-span-5 bg-slate-50/50 p-8 border-l border-slate-100 flex flex-col justify-between">
//             <div className="space-y-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <User size={16} className="text-indigo-600" />
//                 <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Lead Interviewer</span>
//               </div>

//               <EnterpriseInput
//                 label="Full Name"
//                 placeholder="Assign Reviewer"
//                 value={scheduleForm.interviewerName}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
//               />
//               <EnterpriseInput
//                 label="Designation"
//                 placeholder="Engineering Lead"
//                 value={scheduleForm.interviewerRole}
//                 onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerRole: e.target.value })}
//               />
//             </div>

//             <div className="mt-10">
//               <button
//                 onClick={() => setIsScheduled(true)}
//                 className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
//                   isScheduled
//                   ? "bg-emerald-500 text-white"
//                   : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200"
//                 }`}
//               >
//                 {isScheduled ? (
//                   <><ShieldCheck size={16} /> Dispatched</>
//                 ) : (
//                   <><Activity size={16} /> Schedule Session</>
//                 )}
//               </button>
//               <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
//                 Notifications will be sent automatically
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* --- END OF ENTERPRISE SCHEDULE SECTION --- */}

//     </div>
//   );
// };

// export default ScheduleInterview;
