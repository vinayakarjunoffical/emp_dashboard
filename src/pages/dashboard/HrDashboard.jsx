
import React, {useEffect, useState } from 'react';
import { 
  Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus, 
  Lock, FileText, Activity, Clock, CheckCircle2, Database, 
  XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert,
  Fingerprint, CreditCard, Landmark, PenTool, Video, MapPin, Star, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { dashboardService } from "../../services/dashboard.service";


const HRGovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidates'); 
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState('Monthly');
  const [searchText, setSearchText] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [apiStats, setApiStats] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (activeTab === "candidates") {
    fetchDashboardStats();
  }
}, [timeRange, searchText, statusFilter, activeTab]);


const buildFilters = () => ({
  location: "vashi",
  range: timeRange,        // Today | Week | Monthly
  search: searchText || "",
  status: statusFilter !== "All" ? statusFilter : ""
});


const fetchDashboardStats = async () => {
  try {
    setLoading(true);

    const filters = buildFilters();

    const data = await dashboardService.getCandidateStats(filters);

    setApiStats(data);
  } catch (err) {
    console.error("Dashboard API Error:", err);
  } finally {
    setLoading(false);
  }
};



  // --- MOCK DATA FOR REVIEWS ---
  // const interviewReviews = [
  //   { id: 1, name: "Arjun Mehta", status: "Strong Pass", score: 94, stars: 5, date: "2 Hours ago" },
  //   { id: 2, name: "Sanya Iyer", status: "Pass", score: 78, stars: 4, date: "5 Hours ago" },
  //   { id: 3, name: "Kevin Pietersen", status: "Reject", score: null, stars: 0, date: "Yesterday" },
  //   { id: 4, name: "Priya Das", status: "Strong Pass", score: 88, stars: 5, date: "Yesterday" }
  // ];
  const interviewReviews = apiStats?.recent_activity ?? [];


  // --- YOUR EXISTING METRIC DEFINITIONS ---
  const stats = {
    // candidates: [
    //   { id: 'interviews', label: "Interviews", val: "128", icon: <Video size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
    //   { id: 'jd_sent', label: "JD Pipeline", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
    //   { id: 'offers', label: "Offers Sent", val: "42", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
    //   { id: 'total', label: "Total Apps", val: "2.8k", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
    // ],
    candidates: [
    {
      id: "total",
      label: "Total Candidates",
      val: apiStats?.total_candidates ?? 0,
      icon: <Users size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: "interviewing",
      label: "Interviewing",
      val:
        apiStats?.status_distribution?.find(s => s.label === "interviewing")?.count ?? 0,
      icon: <Video size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      id: "migrated",
      label: "Migrated",
      val:
        apiStats?.status_distribution?.find(s => s.label === "migrated")?.count ?? 0,
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      id: "manual",
      label: "Manual Entry",
      val:
        apiStats?.entry_method_distribution?.find(s => s.label === "manual")?.count ?? 0,
      icon: <Database size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ],
    employees: [
      { id: 'kyc_pending', label: "KYC Pending", val: "14", icon: <Fingerprint size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
      { id: 'esign', label: "eSign Done", val: "112", icon: <PenTool size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
      { id: 'probation', label: "On Probation", val: "84", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
      { id: 'active', label: "Active Staff", val: "1.2k", icon: <ShieldCheck size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
    ]
  };

//   const filteredInterviewReviews = interviewReviews.filter((item) => {
//   const matchSearch =
//     item.name.toLowerCase().includes(searchText.toLowerCase());

//   const matchStatus =
//     statusFilter === "All" || item.status === statusFilter;

//   return matchSearch && matchStatus;
// });

const filteredInterviewReviews = interviewReviews
  .filter((item) => {
    const matchSearch =
      item.full_name?.toLowerCase().includes(searchText.toLowerCase());

    const matchStatus =
      statusFilter === "All" || item.status === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  })
  .map((item) => {

    const lastInterview =
      item.interviews?.[item.interviews.length - 1];

    const score = lastInterview?.review?.total_score
      ? Math.round(lastInterview.review.total_score * 10)
      : null;

    const decision = lastInterview?.review?.decision;

    let statusLabel = "In Progress";
    if (decision === "strong_pass") statusLabel = "Strong Pass";
    else if (decision === "pass") statusLabel = "Pass";
    else if (decision === "reject") statusLabel = "Reject";

    return {
      id: item.id,
      name: item.full_name,
      status: statusLabel,
      score,
      stars: Math.round((score || 0) / 20),
      date: new Date(item.updated_at).toLocaleDateString()
    };
  });



  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">Core Terminal</span>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
              <Lock size={10} /> ISO 27001 Compliant
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            {activeTab === 'candidates' ? 'Talent Acquisition' : 'Employee Governance'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {['Today', 'Week', 'Monthly'].map((range) => (
              <button key={range} onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
                  timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
                }`}>{range}</button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TRACK SWITCHER --- */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
        {[{ id: 'candidates', label: 'Candidates', icon: <UserPlus size={16}/> },
          { id: 'employees', label: 'Employees', icon: <Briefcase size={16}/> }].map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}>
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
          </button>
        ))}
      </div>

      {activeView === 'dashboard' ? (
        <div className="grid grid-cols-12 gap-8">
          
          {/* --- KPI CARDS --- */}
          {/* <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats[activeTab].map((stat) => (
              <div key={stat.id} onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
                className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
              </div>
            ))}
          </div> */}
          {/* --- KPI CARDS --- */}
<div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">

  {loading ? (
    <div className="col-span-12 text-center py-10 text-sm font-bold text-slate-400">
      Loading dashboard...
    </div>
  ) : (
    stats[activeTab].map((stat) => (
      <div
        key={stat.id}
        onClick={() => {
          setSelectedCategory(stat.label);
          setActiveView("detail");
        }}
        className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
      >
        <div
          className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}
        >
          {stat.icon}{console.log("new data show in code",stat)}
        </div>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {stat.label}
        </p>

        <h2 className="text-2xl font-black text-slate-900">
          {stat.val}
        </h2>
      </div>
    ))
  )}

</div>


          {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> Interview Performance Review
              </h3>

              {/* --- SEARCH & FILTER BAR --- */}
<div className="flex flex-wrap gap-3 mb-6">
  {/* Search */}
  <div className="relative">
    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
    <input
      type="text"
      placeholder="Search candidate..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
    />
  </div>

  {/* Status Filter */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-3 py-2 text-xs rounded-xl border border-slate-200"
  >
    <option value="All">All Status</option>
    <option value="Strong Pass">Strong Pass</option>
    <option value="Pass">Pass</option>
    <option value="Reject">Reject</option>
  </select>
</div>

              
              <div className="space-y-4">
                {filteredInterviewReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${
                        review.status === 'Reject' ? 'bg-rose-100 text-rose-600' : 
                        review.status === 'Strong Pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {review.status === 'Reject' ? <ThumbsDown size={18}/> : <ThumbsUp size={18}/>}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            review.status === 'Reject' ? 'bg-rose-200 text-rose-700' : 
                            review.status === 'Strong Pass' ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-200 text-blue-700'
                          }`}>
                            {review.status}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{review.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC SCORECARD FOR PASS / STRONG PASS */}
                    {(review.status === 'Pass' || review.status === 'Strong Pass') && (
                      <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end">
                           <div className="flex gap-0.5 mb-1">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                             ))}
                           </div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Feedback Rating</p>
                        </div>
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Score</p>
                          <p className="text-lg font-black text-blue-600">{review.score}<span className="text-[10px] text-slate-300">/100</span></p>
                        </div>
                      </div>
                    )}
                    
                    {review.status === 'Reject' && (
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Profile Archived
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Video size={16} className="text-blue-500" /> Interview Lifecycle ({timeRange})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Online", val: "42", sub: "Zoom/G-Meet" },
                  { label: "Physical", val: "18", sub: "In-Office" },
                  { label: "Scheduled", val: "24", sub: "Pending Attend" },
                  { label: "No Show", val: "03", sub: "Flagged", red: true }
                ].map((box, i) => (
                  <div key={i} className={`p-4 rounded-3xl border ${box.red ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase">{box.label}</p>
                    <p className="text-xl font-black">{box.val}</p>
                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{box.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Verification Registry</h4>
              <div className="space-y-5">
                {[
                  { label: "Address Verified", count: 89, icon: <MapPin size={12}/> },
                  { label: "Aadhaar / PAN", count: 142, icon: <CreditCard size={12}/> },
                  { label: "Bank Details", count: 76, icon: <Landmark size={12}/> },
                  { label: "eSign (Pending)", count: 12, icon: <PenTool size={12}/>, alert: true }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${doc.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{doc.icon}</div>
                      <span className="text-[10px] font-bold uppercase">{doc.label}</span>
                    </div>
                    <span className="text-xs font-mono">{doc.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">eSign Status Workflow</h4>
              <div className="space-y-4">
                {['Document Uploaded', 'Pending Signature', 'Signed'].map((status, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                      <span>{status}</span>
                      <span>{Math.floor(Math.random()*100)}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${Math.random()*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- DETAIL PAGE (UNTOUCHED) --- */
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black">{selectedCategory} Table</h3>
              <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Back to Dashboard</button>
           </div>
           <div className="p-10">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
                  <div>
                    <p className="text-sm font-black">Rajesh Kumar</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar: Verified | eSign: Pending | Interview: Online</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Attended</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Doc Uploaded</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HRGovernanceDashboard;

//***********************************************working code phase 1 07/02/26************************************************************** */
// import React, { useState } from 'react';
// import { 
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus, 
//   Lock, FileText, Activity, Clock, CheckCircle2, Database, 
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert,
//   Fingerprint, CreditCard, Landmark, PenTool, Video, MapPin, Star, ThumbsUp, ThumbsDown
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates'); 
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');
//   const [searchText, setSearchText] = useState("");
// const [statusFilter, setStatusFilter] = useState("All");


//   // --- MOCK DATA FOR REVIEWS ---
//   const interviewReviews = [
//     { id: 1, name: "Arjun Mehta", status: "Strong Pass", score: 94, stars: 5, date: "2 Hours ago" },
//     { id: 2, name: "Sanya Iyer", status: "Pass", score: 78, stars: 4, date: "5 Hours ago" },
//     { id: 3, name: "Kevin Pietersen", status: "Reject", score: null, stars: 0, date: "Yesterday" },
//     { id: 4, name: "Priya Das", status: "Strong Pass", score: 88, stars: 5, date: "Yesterday" }
//   ];

//   // --- YOUR EXISTING METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       { id: 'interviews', label: "Interviews", val: "128", icon: <Video size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//       { id: 'jd_sent', label: "JD Pipeline", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//       { id: 'offers', label: "Offers Sent", val: "42", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//       { id: 'total', label: "Total Apps", val: "2.8k", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ],
//     employees: [
//       { id: 'kyc_pending', label: "KYC Pending", val: "14", icon: <Fingerprint size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//       { id: 'esign', label: "eSign Done", val: "112", icon: <PenTool size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//       { id: 'probation', label: "On Probation", val: "84", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//       { id: 'active', label: "Active Staff", val: "1.2k", icon: <ShieldCheck size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ]
//   };

//   const filteredInterviewReviews = interviewReviews.filter((item) => {
//   const matchSearch =
//     item.name.toLowerCase().includes(searchText.toLowerCase());

//   const matchStatus =
//     statusFilter === "All" || item.status === statusFilter;

//   return matchSearch && matchStatus;
// });


//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">Core Terminal</span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Talent Acquisition' : 'Employee Governance'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button key={range} onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}>{range}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[{ id: 'candidates', label: 'Candidates', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employees', icon: <Briefcase size={16}/> }].map((tab) => (
//           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}>
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <div className="grid grid-cols-12 gap-8">
          
//           {/* --- KPI CARDS --- */}
//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {stats[activeTab].map((stat) => (
//               <div key={stat.id} onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
//                 <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                 <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
//               </div>
//             ))}
//           </div>

//           {/* --- LEFT: INTERVIEW & SCORE LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Zap size={16} className="text-amber-500" /> Interview Performance Review
//               </h3>

//               {/* --- SEARCH & FILTER BAR --- */}
// <div className="flex flex-wrap gap-3 mb-6">
//   {/* Search */}
//   <div className="relative">
//     <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
//     <input
//       type="text"
//       placeholder="Search candidate..."
//       value={searchText}
//       onChange={(e) => setSearchText(e.target.value)}
//       className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
//     />
//   </div>

//   {/* Status Filter */}
//   <select
//     value={statusFilter}
//     onChange={(e) => setStatusFilter(e.target.value)}
//     className="px-3 py-2 text-xs rounded-xl border border-slate-200"
//   >
//     <option value="All">All Status</option>
//     <option value="Strong Pass">Strong Pass</option>
//     <option value="Pass">Pass</option>
//     <option value="Reject">Reject</option>
//   </select>
// </div>

              
//               <div className="space-y-4">
//                 {filteredInterviewReviews.map((review) => (
//                   <div key={review.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all">
//                     <div className="flex items-center gap-4">
//                       <div className={`p-3 rounded-2xl ${
//                         review.status === 'Reject' ? 'bg-rose-100 text-rose-600' : 
//                         review.status === 'Strong Pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
//                       }`}>
//                         {review.status === 'Reject' ? <ThumbsDown size={18}/> : <ThumbsUp size={18}/>}
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-black text-slate-900">{review.name}</h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
//                             review.status === 'Reject' ? 'bg-rose-200 text-rose-700' : 
//                             review.status === 'Strong Pass' ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-200 text-blue-700'
//                           }`}>
//                             {review.status}
//                           </span>
//                           <span className="text-[9px] font-bold text-slate-400 uppercase">{review.date}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* DYNAMIC SCORECARD FOR PASS / STRONG PASS */}
//                     {(review.status === 'Pass' || review.status === 'Strong Pass') && (
//                       <div className="flex items-center gap-8">
//                         <div className="hidden md:flex flex-col items-end">
//                            <div className="flex gap-0.5 mb-1">
//                              {[...Array(5)].map((_, i) => (
//                                <Star key={i} size={12} className={i < review.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
//                              ))}
//                            </div>
//                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Feedback Rating</p>
//                         </div>
//                         <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
//                           <p className="text-[8px] font-black text-slate-400 uppercase">Score</p>
//                           <p className="text-lg font-black text-blue-600">{review.score}<span className="text-[10px] text-slate-300">/100</span></p>
//                         </div>
//                       </div>
//                     )}
                    
//                     {review.status === 'Reject' && (
//                       <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                         Profile Archived
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* --- YOUR ORIGINAL INTERVIEW LIFECYCLE BLOCK --- */}
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true }
//                 ].map((box, i) => (
//                   <div key={i} className={`p-4 rounded-3xl border ${box.red ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
//                     <p className="text-[9px] font-black text-slate-400 uppercase">{box.label}</p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{box.sub}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS (UNTOUCHED) --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Verification Registry</h4>
//               <div className="space-y-5">
//                 {[
//                   { label: "Address Verified", count: 89, icon: <MapPin size={12}/> },
//                   { label: "Aadhaar / PAN", count: 142, icon: <CreditCard size={12}/> },
//                   { label: "Bank Details", count: 76, icon: <Landmark size={12}/> },
//                   { label: "eSign (Pending)", count: 12, icon: <PenTool size={12}/>, alert: true }
//                 ].map((doc, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${doc.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{doc.icon}</div>
//                       <span className="text-[10px] font-bold uppercase">{doc.label}</span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">eSign Status Workflow</h4>
//               <div className="space-y-4">
//                 {['Document Uploaded', 'Pending Signature', 'Signed'].map((status, i) => (
//                   <div key={i} className="space-y-2">
//                     <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                       <span>{status}</span>
//                       <span>{Math.floor(Math.random()*100)}%</span>
//                     </div>
//                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                       <div className="bg-blue-600 h-full" style={{ width: `${Math.random()*100}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE (UNTOUCHED) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//               <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Back to Dashboard</button>
//            </div>
//            <div className="p-10">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                   <div>
//                     <p className="text-sm font-black">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar: Verified | eSign: Pending | Interview: Online</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Attended</span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Doc Uploaded</span>
//                   </div>
//                 </div>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;

//************************************************working code pahse 2356*********************************************************** */
// import React, { useState } from 'react';
// import { 
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus, 
//   Lock, FileText, Activity, Clock, CheckCircle2, Database, 
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert,
//   Fingerprint, CreditCard, Landmark, PenTool, Video, MapPin
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates'); 
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');

//   // --- EXPANDED METRIC DEFINITIONS ---
//   const stats = {
//     candidates: [
//       { id: 'interviews', label: "Interviews", val: "128", icon: <Video size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//       { id: 'jd_sent', label: "JD Pipeline", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//       { id: 'offers', label: "Offers Sent", val: "42", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//       { id: 'total', label: "Total Apps", val: "2.8k", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ],
//     employees: [
//       { id: 'kyc_pending', label: "KYC Pending", val: "14", icon: <Fingerprint size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//       { id: 'esign', label: "eSign Done", val: "112", icon: <PenTool size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//       { id: 'probation', label: "On Probation", val: "84", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//       { id: 'active', label: "Active Staff", val: "1.2k", icon: <ShieldCheck size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     ]
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">Core Terminal</span>
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> ISO 27001 Compliant
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Talent Acquisition' : 'Employee Governance'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button key={range} onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}>{range}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[{ id: 'candidates', label: 'Candidates', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employees', icon: <Briefcase size={16}/> }].map((tab) => (
//           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}>
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <div className="grid grid-cols-12 gap-8">
          
//           {/* --- KPI CARDS --- */}
//           <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {stats[activeTab].map((stat) => (
//               <div key={stat.id} onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
//                 <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                 <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
//               </div>
//             ))}
//           </div>

//           {/* --- LEFT: INTERVIEW & JD LOGIC --- */}
//           <div className="col-span-12 lg:col-span-8 space-y-8">
//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
//                 <Video size={16} className="text-blue-500" /> Interview Lifecycle ({timeRange})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Online", val: "42", sub: "Zoom/G-Meet" },
//                   { label: "Physical", val: "18", sub: "In-Office" },
//                   { label: "Scheduled", val: "24", sub: "Pending Attend" },
//                   { label: "No Show", val: "03", sub: "Flagged", red: true }
//                 ].map((box, i) => (
//                   <div key={i} className={`p-4 rounded-3xl border ${box.red ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
//                     <p className="text-[9px] font-black text-slate-400 uppercase">{box.label}</p>
//                     <p className="text-xl font-black">{box.val}</p>
//                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{box.sub}</p>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Interview Status Breakdown */}
//               <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
//                 <div className="space-y-4">
//                   <p className="text-[10px] font-black text-slate-400 uppercase">Stage Status</p>
//                   {['Scheduled', 'Completed', 'Cancelled'].map(s => (
//                     <div key={s} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
//                       <span className="text-xs font-bold">{s}</span>
//                       <span className="text-xs font-mono font-black text-blue-600">{(Math.random()*50).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="space-y-4">
//                   <p className="text-[10px] font-black text-slate-400 uppercase">Attendance Logic</p>
//                   {['Pending', 'Attended', 'No Show'].map(s => (
//                     <div key={s} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
//                       <span className="text-xs font-bold">{s}</span>
//                       <span className="text-xs font-mono font-black text-indigo-600">{(Math.random()*50).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* --- RIGHT: COMPLIANCE & DOCS --- */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Verification Registry</h4>
//               <div className="space-y-5">
//                 {[
//                   { label: "Address Verified", count: 89, icon: <MapPin size={12}/> },
//                   { label: "Aadhaar / PAN", count: 142, icon: <CreditCard size={12}/> },
//                   { label: "Bank Details", count: 76, icon: <Landmark size={12}/> },
//                   { label: "eSign (Pending)", count: 12, icon: <PenTool size={12}/>, alert: true }
//                 ].map((doc, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${doc.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>{doc.icon}</div>
//                       <span className="text-[10px] font-bold uppercase">{doc.label}</span>
//                     </div>
//                     <span className="text-xs font-mono">{doc.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//               <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6">eSign Status Workflow</h4>
//               <div className="space-y-4">
//                 {['Document Uploaded', 'Pending Signature', 'Signed'].map((status, i) => (
//                   <div key={i} className="space-y-2">
//                     <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
//                       <span>{status}</span>
//                       <span>{Math.floor(Math.random()*100)}%</span>
//                     </div>
//                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                       <div className="bg-blue-600 h-full" style={{ width: `${Math.random()*100}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* --- DETAIL PAGE --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black">{selectedCategory} Table</h3>
//               <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Back to Dashboard</button>
//            </div>
//            <div className="p-10">
//               <div className="grid grid-cols-1 gap-4">
//                 {/* Example of a detailed row showing combined status */}
//                 <div className="p-6 border border-slate-100 rounded-3xl flex justify-between items-center hover:border-blue-200 transition-all">
//                   <div>
//                     <p className="text-sm font-black">Rajesh Kumar</p>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar: Verified | eSign: Pending | Interview: Online</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Attended</span>
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Doc Uploaded</span>
//                   </div>
//                 </div>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//*******************************************working code pahse 66666************************************************* */
// import React, { useState, useMemo } from 'react';
// import { 
//   Users, ShieldCheck, Briefcase, Zap, Search, Filter, ArrowUpRight, Plus, 
//   Lock, Globe, FileText, Activity, TrendingUp, Clock, CheckCircle2,Database, 
//   XCircle, Timer, Mail, Award, UserPlus, LogOut, ShieldAlert
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' or 'employees'
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('Monthly');

//   // Unified Data (Candidate + Employee Lifecycle)
//   const [data] = useState([
//     { id: "CAN-4012", name: "Alex Rivera", type: "candidate", status: "JD Accepted", source: "Manual", date: "2026-02-03" },
//     { id: "EMP-9021", name: "Sarah Chen", type: "employee", status: "On Probation", source: "Excel", date: "2026-02-01" },
//     { id: "CAN-4015", name: "Jordan Smit", type: "candidate", status: "Offer Sent", source: "Webhook", date: "2026-01-28" },
//     { id: "EMP-8820", name: "David Park", type: "employee", status: "Confirmed", source: "Manual", date: "2026-01-15" },
//   ]);

//   // --- METRIC DEFINITIONS ---
//   const candidateStats = [
//     { id: 'total', label: "Total Pipeline", val: "2,840", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     { id: 'jd_sent', label: "JD Sent", val: "892", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//     { id: 'jd_accepted', label: "JD Accepted", val: "420", icon: <CheckCircle2 size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//     { id: 'interviews', label: "Interviews", val: "48", icon: <Timer size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//   ];

//   const employeeStats = [
//     { id: 'offer_sent', label: "Offer Sent", val: "24", icon: <Award size={20}/>, color: "text-violet-600", bg: "bg-violet-50" },
//     { id: 'on_probation', label: "On Probation", val: "112", icon: <ShieldAlert size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
//     { id: 'confirmed', label: "Confirmed", val: "840", icon: <ShieldCheck size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//     { id: 'exited', label: "Exited", val: "12", icon: <LogOut size={20}/>, color: "text-rose-600", bg: "bg-rose-50" },
//   ];

//   const currentStats = activeTab === 'candidates' ? candidateStats : employeeStats;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      
//       {/* --- TOP HUD --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Operational Terminal
//             </div>
//             <div className="h-4 w-[1px] bg-slate-200" />
//             <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//               <Lock size={10} /> AES-256 Encrypted
//             </div>
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeTab === 'candidates' ? 'Candidate Pipeline' : 'Personnel Registry'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Time Filter Toggle */}
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//           <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2 active:scale-95">
//             <Plus size={14} /> New Entry
//           </button>
//         </div>
//       </div>

//       {/* --- TRACK SWITCHER (CANDIDATE VS EMPLOYEE) --- */}
//       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
//         {[
//           { id: 'candidates', label: 'Talent Acquisition', icon: <UserPlus size={16}/> },
//           { id: 'employees', label: 'Employee Management', icon: <Briefcase size={16}/> }
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => { setActiveTab(tab.id); setActiveView('dashboard'); }}
//             className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
//               activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
//             }`}
//           >
//             {tab.icon} {tab.label}
//             {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {activeView === 'dashboard' ? (
//         <>
//           {/* --- KPI GRID --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//             {currentStats.map((stat) => (
//               <div 
//                 key={stat.id} 
//                 onClick={() => { setSelectedCategory(stat.label); setActiveView('detail'); }}
//                 className="bg-white border border-slate-200 p-7 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group relative overflow-hidden"
//               >
//                 <div className="relative z-10">
//                   <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform`}>
//                     {stat.icon}
//                   </div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                   <div className="flex items-end gap-2 mt-1">
//                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</h2>
//                     <span className="text-[10px] font-bold text-emerald-500 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                       {timeRange}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-12 gap-8">
//             {/* --- SIDEBAR: STATUS FLOW --- */}
//             <div className="col-span-12 lg:col-span-4 space-y-6">
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Detailed Status Distribution</h4>
//                 <div className="space-y-6">
//                   {(activeTab === 'candidates' 
//                     ? ['JD Sent', 'JD Accepted', 'JD Rejected', 'JD Pending'] 
//                     : ['Offer Sent', 'Offer Accepted', 'Offer Rejected', 'Joining Letter', 'On Probation', 'Probation Review', 'Confirmed', 'Extended', 'Exited']
//                   ).map((status, i) => (
//                     <div key={i} className="flex items-center justify-between group">
//                       <div className="flex items-center gap-3">
//                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
//                         <span className="text-xs font-bold text-slate-600">{status}</span>
//                       </div>
//                       <span className="text-xs font-mono font-bold text-slate-400">{(Math.random() * 100).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Entry Methods */}
//               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
//                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-2">
//                   <Database size={14} /> Ingestion Sources
//                 </h4>
//                 <div className="space-y-4">
//                   {['Manual Entry', 'Excel Import', 'Webhook API'].map((source, i) => (
//                     <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors">
//                       <span className="text-[11px] font-bold uppercase tracking-tight text-slate-300">{source}</span>
//                       <ArrowUpRight size={14} className="text-blue-400" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* --- RECENT ACTIVITY TABLE --- */}
//             <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
//                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//                   <Clock size={14} className="text-blue-500" /> Recent {activeTab} Activity
//                 </h3>
//                 <button onClick={() => setActiveView('detail')} className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
//                   Expand Registry
//                 </button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-slate-50">
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Source</th>
//                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Reference</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.filter(d => d.type === activeTab.slice(0, -1)).map((item, i) => (
//                       <tr key={i} className="hover:bg-blue-50/20 transition-colors group">
//                         <td className="px-8 py-5">
//                           <div className="flex flex-col">
//                             <span className="text-sm font-black text-slate-800">{item.name}</span>
//                             <span className="text-[10px] font-bold text-slate-400">{item.id}</span>
//                           </div>
//                         </td>
//                         <td className="px-8 py-5">
//                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
//                             item.status.includes('Confirmed') || item.status.includes('Accepted') 
//                             ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
//                           }`}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-5">
//                           <span className="text-[10px] font-black text-slate-500 uppercase">{item.source}</span>
//                         </td>
//                         <td className="px-8 py-5 text-right">
//                           <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ArrowUpRight size={16}/></button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         /* --- FULL PAGE DETAIL REGISTRY (Filters applied here) --- */
//         <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm animate-in fade-in zoom-in-95">
//            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
//               <div className="relative w-96">
//                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input placeholder={`Search ${selectedCategory}...`} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
//               </div>
//               <button onClick={() => setActiveView('dashboard')} className="text-[10px] font-black uppercase text-blue-600">Close Detail View</button>
//            </div>
//            {/* Table would render here with full filtered data */}
//            <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-[0.3em]">Filtered Data Registry Loaded</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//***********************************************working code phase 55************************************************************* */
// import React, { useState } from 'react';
// import { 
//   Users, ShieldCheck, Briefcase, Zap, 
//   Search, Filter, ArrowUpRight, Plus, 
//   MoreHorizontal, Lock, Globe, FileText,
//   Activity, TrendingUp, AlertCircle, Clock,
//   ChevronDown, Database, Mail, Link, 
//   CheckCircle2, XCircle, Timer
// } from 'lucide-react';

// const HRGovernanceDashboard = () => {
//   // States for Navigation and Filtering
//   const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'detail'
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeRange, setTimeRange] = useState('This Month');

//   // Dummy Data - Candidate Assets
//   const [candidates] = useState([
//     { id: "CAN-4012", name: "Alex Rivera", source: "Manual", jdStatus: "Accepted", interviewStatus: "Pending", appliedDate: "2024-03-01" },
//     { id: "CAN-4013", name: "Priya Sharma", source: "Excel Import", jdStatus: "Sent", interviewStatus: "Scheduled", appliedDate: "2024-03-02" },
//     { id: "CAN-4014", name: "Jordan Smit", source: "Webhook", jdStatus: "Rejected", interviewStatus: "N/A", appliedDate: "2024-02-28" },
//     { id: "CAN-4015", name: "Sarah Connor", source: "Webhook", jdStatus: "Pending", interviewStatus: "Review", appliedDate: "2024-03-03" },
//   ]);

//   const stats = [
//     { id: 'total', label: "Total Candidates", val: "2,840", change: "+14%", icon: <Users size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
//     { id: 'applied', label: "Applied (Today)", val: "142", change: "Real-time", icon: <Activity size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
//     { id: 'jd_sent', label: "JD Sent Count", val: "892", change: "64% Ratio", icon: <Mail size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
//     { id: 'interviews', label: "Interviews", val: "48", change: "8 Today", icon: <Timer size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
//   ];

//   const jdMetrics = [
//     { label: "JD Accepted", count: 420, color: "bg-emerald-500" },
//     { label: "JD Rejected", count: 112, color: "bg-rose-500" },
//     { label: "JD Pending", count: 360, color: "bg-amber-400" },
//   ];

//   const handleCardClick = (category) => {
//     setSelectedCategory(category);
//     setActiveView('detail');
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black tracking-[0.2em] uppercase">
//               Recruitment Terminal
//             </div>
//             {activeView === 'detail' && (
//                <button 
//                 onClick={() => setActiveView('dashboard')}
//                 className="text-[9px] font-black text-blue-600 uppercase tracking-tighter hover:underline"
//                >
//                  ← Back to Governance
//                </button>
//             )}
//           </div>
//           <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//             {activeView === 'dashboard' ? 'Candidate Lifecycle' : `${selectedCategory} Registry`}
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Time Filter Toggle */}
//           <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
//             {['Today', 'Week', 'Monthly'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
//                   timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
//                 }`}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//           <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
//             <Plus size={14} /> New Candidate
//           </button>
//         </div>
//       </div>

//       {activeView === 'dashboard' ? (
//         <>
//           {/* --- TOP CARDS (Interactive) --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//             {stats.map((stat) => (
//               <div 
//                 key={stat.id} 
//                 onClick={() => handleCardClick(stat.label)}
//                 className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all relative overflow-hidden group"
//               >
//                 <div className="relative z-10">
//                   <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//                     {stat.icon}
//                   </div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                   <div className="flex items-end gap-2 mt-1">
//                     <h2 className="text-3xl font-black text-slate-900">{stat.val}</h2>
//                     <span className="text-[10px] font-bold text-emerald-500 mb-1.5">{stat.change}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-12 gap-8">
//             {/* Entry Methods & Metrics */}
//             <div className="col-span-12 lg:col-span-4 space-y-6">
//               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Ingestion Methods</h4>
//                 <div className="space-y-6">
//                   {[
//                     { label: "Manual Entry", val: "1,204", icon: <Plus size={14}/> },
//                     { label: "Excel Bulk", val: "840", icon: <FileText size={14}/> },
//                     { label: "API Webhook", val: "796", icon: <Zap size={14}/> },
//                   ].map((item, i) => (
//                     <div key={i} className="flex justify-between items-center group cursor-pointer">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">{item.icon}</div>
//                         <span className="text-xs font-bold text-white/70 uppercase tracking-tight">{item.label}</span>
//                       </div>
//                       <span className="font-mono font-bold text-blue-400">{item.val}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* JD Status Breakdown */}
//               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">JD Lifecycle Status</h4>
//                 <div className="space-y-5">
//                   {jdMetrics.map((jd, i) => (
//                     <div key={i} className="space-y-2">
//                       <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
//                         <span>{jd.label}</span>
//                         <span>{jd.count}</span>
//                       </div>
//                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                         <div className={`${jd.color} h-full`} style={{ width: `${(jd.count/892)*100}%` }} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Recent Table Preview */}
//             <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Influx</h3>
//                 <button onClick={() => setActiveView('detail')} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All Candidates</button>
//               </div>
//               <div className="p-4 overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-slate-50">
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</th>
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">JD Status</th>
//                       <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Interview</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((can, i) => (
//                       <tr key={i} className="hover:bg-slate-50 transition-colors">
//                         <td className="px-4 py-4">
//                            <div className="flex flex-col">
//                             <span className="text-xs font-black text-slate-800 tracking-tight">{can.name}</span>
//                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{can.id}</span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4">
//                           <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">{can.source}</span>
//                         </td>
//                         <td className="px-4 py-4">
//                            <div className={`text-[9px] font-black uppercase px-2 py-1 rounded-full w-fit flex items-center gap-1 ${
//                              can.jdStatus === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 
//                              can.jdStatus === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
//                            }`}>
//                              {can.jdStatus === 'Accepted' ? <CheckCircle2 size={10}/> : can.jdStatus === 'Rejected' ? <XCircle size={10}/> : <Clock size={10}/>}
//                              {can.jdStatus}
//                            </div>
//                         </td>
//                         <td className="px-4 py-4 text-[10px] font-bold text-slate-500">{can.interviewStatus}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         /* --- FULL PAGE DATA TABLE (Filterable) --- */
//         <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm animate-in fade-in zoom-in-95 duration-300">
//           <div className="p-8 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
//             <div className="flex items-center gap-4 flex-1">
//               <div className="relative flex-1 max-w-md">
//                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input 
//                   placeholder="Search name, ID, or source..." 
//                   className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                 />
//               </div>
//               <button className="h-12 px-6 border border-slate-200 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
//                 <Filter size={14}/> Filters
//               </button>
//             </div>
//             <div className="flex gap-2 text-[10px] font-black uppercase text-slate-400">
//               Showing 1,284 Candidates for <span className="text-slate-900 underline">{timeRange}</span>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-slate-50/50">
//                 <tr>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate Name</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Source Method</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">JD Lifecycle</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Index</th>
//                   <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {candidates.map((can) => (
//                   <tr key={can.id} className="hover:bg-blue-50/10 group cursor-pointer">
//                     <td className="px-8 py-6 font-mono text-[10px] font-bold text-blue-600">#{can.id}</td>
//                     <td className="px-8 py-6">
//                        <span className="text-sm font-black text-slate-800 tracking-tight">{can.name}</span>
//                     </td>
//                     <td className="px-8 py-6">
//                       <div className="flex items-center gap-2">
//                         {can.source === 'Manual' ? <Plus size={12}/> : can.source === 'Webhook' ? <Zap size={12}/> : <FileText size={12}/>}
//                         <span className="text-[10px] font-black text-slate-500 uppercase">{can.source}</span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6">
//                       <div className="flex items-center gap-2">
//                          <div className={`w-1.5 h-1.5 rounded-full ${can.jdStatus === 'Accepted' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
//                          <span className="text-[10px] font-black text-slate-700 uppercase">{can.jdStatus}</span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6">
//                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                           <div className="w-1/3 h-full bg-blue-500" />
//                        </div>
//                     </td>
//                     <td className="px-8 py-6 text-right">
//                       <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
//                         <ArrowUpRight size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRGovernanceDashboard;
//******************************************************working phase 11************************************************** */
// import {
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import VerificationChart from "../../components/charts/VerificationChart";
// import EmployeeStatusChart from "../../components/charts/EmployeeStatusChart";
// import DashboardActions from "../../pages/dashboard/DashboardActions";

// import {
//   hrStats,
//   verificationChartData,
//   employeeStatusFlow,
// } from "../../data/hrDashboardData";

// const icons = [
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// ];

// export default function HrDashboard() {
//   return (
//     <div className="space-y-10">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">
//           HR Dashboard
//         </h1>
//         <p className="text-sm text-slate-500">
//           Employee onboarding & verification overview
//         </p>
//       </div>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//         {hrStats.map((item, index) => (
//           <MaterialStatCard
//             key={item.title}
//             title={item.title}
//             value={item.value}
//             icon={icons[index]}
//             percent={item.percent}
//             trend={item.trend}
//             subtitle={item.subtitle}
//           />
//         ))}
//       </div>

//       {/* ACTIONS */}
//       <DashboardActions />

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard
//           title="Verification Status"
//           subtitle="Completed vs Pending documents"
//           footer="Aadhaar, PAN, Bank & Address"
//         >
//           <VerificationChart data={verificationChartData} />
//         </ChartCard>

//         <ChartCard
//           title="Employee Lifecycle"
//           subtitle="Created → Confirmed"
//           footer="Based on HR review flow"
//         >
//           <EmployeeStatusChart data={employeeStatusFlow} />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }


// import {
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import VerificationChart from "../../components/charts/VerificationChart";
// import EmployeeStatusChart from "../../components/charts/EmployeeStatusChart";
// import DashboardActions from "../../pages/dashboard/DashboardActions";

// import {
//   hrStats,
//   verificationChartData,
//   employeeStatusFlow,
// } from "../../data/hrDashboardData";

// const icons = [
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// ];

// export default function HrDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-semibold">
//         HR Dashboard
//       </h1>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {hrStats.map((item, index) => (
//           <MaterialStatCard
//             key={item.title}
//             title={item.title}
//             value={item.value}
//             icon={icons[index]}
//             percent={item.percent}
//             trend={item.trend}
//             subtitle={item.subtitle}
//           />
//         ))}
//       </div>

//       {/* ACTION BUTTONS */}
//       <DashboardActions />

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard
//           title="Verification Status"
//           subtitle="Completed vs Pending documents"
//           footer="based on employee KYC"
//         >
//           <VerificationChart data={verificationChartData} />
//         </ChartCard>

//         <ChartCard
//           title="Employee Status Flow"
//           subtitle="Lifecycle progress"
//           footer="Created → Confirmed"
//         >
//           <EmployeeStatusChart data={employeeStatusFlow} />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }


// import {
//   DollarSign,
//   Users,
//   UserPlus,
//   BarChart3,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import WebsiteViewChart from "../../components/charts/WebsiteViewChart";
// import DailySalesChart from "../../components/charts/DailySalesChart";
// import CompletedTasksChart from "../../components/charts/CompletedTasksChart";

// export default function HrDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-xl font-semibold">Home</h1>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <MaterialStatCard
//           title="Today's Money"
//           value="$53k"
//           icon={DollarSign}
//           percent={55}
//           trend="up"
//           subtitle="than last week"
//         />
//         <MaterialStatCard
//           title="Today's Users"
//           value="2,300"
//           icon={Users}
//           percent={3}
//           trend="up"
//           subtitle="than last month"
//         />
//         <MaterialStatCard
//           title="New Clients"
//           value="3,462"
//           icon={UserPlus}
//           percent={2}
//           trend="down"
//           subtitle="than yesterday"
//         />
//         <MaterialStatCard
//           title="Sales"
//           value="$103,430"
//           icon={BarChart3}
//           percent={5}
//           trend="up"
//           subtitle="than yesterday"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <ChartCard
//           title="Website View"
//           subtitle="Last Campaign Performance"
//           footer="campaign sent 2 days ago"
//         >
//           <WebsiteViewChart />
//         </ChartCard>

//         <ChartCard
//           title="Daily Sales"
//           subtitle="15% increase in today sales"
//           footer="updated 4 min ago"
//         >
//           <DailySalesChart />
//         </ChartCard>

//         <ChartCard
//           title="Completed Tasks"
//           subtitle="Last Campaign Performance"
//           footer="just updated"
//         >
//           <CompletedTasksChart />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }
