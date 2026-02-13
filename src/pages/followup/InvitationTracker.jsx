import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  X,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  User,
  Eye,
  MapPin,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { candidateService } from "../../services/candidateService";

const InvitationTracker = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();
const [isMigrating, setIsMigrating] = useState(false);
  // New Filters State
  const [posFilter, setPosFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [eduFilter, setEduFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await candidateService.getAll();

        // 🔁 Map API → EXISTING invitation structure

        const normalizeStatus = (status) => {
          if (!status) return "sent";

          const s = status.toLowerCase();

          const map = {
            jd_accepted: "accepted",
            jd_rejected: "rejected",
            jd_sent: "pending",
          };

          // return mapped value OR original status
          return map[s] || s;
        };

        const mapped = data.map((c, index) => ({
          id: c.id ?? index + 1,
          name: c.full_name ?? "Unknown",
          email: c.email ?? "—",
          sentDate: c.invited_at ?? "—",
          status: normalizeStatus(c.status),
          responseDate: c.response_date ?? null,
          position: c.position ?? "—",
          experience: c.experience ?? "—",
          education: c.education ?? "—",
          location: c.location ?? "—",
        }));

        setInvitations(mapped);
      } catch (err) {
        console.error("Failed to load candidates", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const normalizeText = (val) => {
  if (!val) return "—";

  return val
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
};

const uniqueNormalized = (list, key) => [
  "all",
  ...new Map(
    list.map((i) => {
      const raw = i[key] || "—";
      return [normalizeText(raw), raw];
    }),
  ).values(),
];


  // LOGIC: Dynamic Filter Options

//   const positions = ["all", ...new Set(invitations.map((i) => i.position))];
//   const experiences = ["all", ...new Set(invitations.map((i) => i.experience))];
//   // const educations = ["all", ...new Set(invitations.map((i) => i.education))];
//   const educations = [
//   "all",
//   ...new Map(
//     invitations.map((i) => {
//       const raw = i.education || "—";
//       return [normalizeText(raw), raw]; // key = normalized, value = original
//     }),
//   ).values(),
// ];

//   const states = ["all", ...new Set(invitations.map((i) => i.location))];

const positions = uniqueNormalized(invitations, "position");
const experiences = uniqueNormalized(invitations, "experience");
const educations = uniqueNormalized(invitations, "education");
const states = uniqueNormalized(invitations, "location");


  // LOGIC: Global Filtering
  const filteredData = useMemo(() => {
    return invitations.filter((inv) => {
      const matchesSearch =
        (inv.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filter === "all" || inv.status === filter;
      const matchesPos = posFilter === "all" || inv.position === posFilter;
      const matchesExp = expFilter === "all" || inv.experience === expFilter;
      // const matchesEdu = eduFilter === "all" || inv.education === eduFilter;
      const matchesEdu =
  eduFilter === "all" ||
  normalizeText(inv.education) === normalizeText(eduFilter);

      const matchesState =
        stateFilter === "all" || inv.location === stateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPos &&
        matchesExp &&
        matchesEdu &&
        matchesState
      );
    });
  }, [
    invitations,
    searchQuery,
    filter,
    posFilter,
    expFilter,
    eduFilter,
    stateFilter,
  ]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleMigration = async () => {
  try {
    setIsMigrating(true);
    await candidateService.migrateCandidates();
    toast.success("Migration completed successfully 🚀");
  } catch (err) {
    toast.error(err.message || "Migration failed ❌");
   } finally {
    setIsMigrating(false);
  }
};

const formatStatus = (status) => {
  const map = {
    jd_sent: "JD Sent",
    opened: "Opened",
    viewed: "Viewed",
    responded: "Responded",
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
  };

  return map[status] || status || "Unknown";
};


const formatDateTime = (iso) => {
  if (!iso) return "—";

  const date = new Date(iso);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};




  return (
    <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[850px]">
      {/* HEADER & GLOBAL FILTERS */}
      <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Invitation Analytics
            </h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              Enterprise HR Console • {filteredData.length} Candidates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search name or email..."
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
              {["all", "accepted", "rejected"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilter(t);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ADVANCED FILTER ROW */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">
          <FilterSelect
            label="Position"
            value={posFilter}
            options={positions}
            onChange={setPosFilter}
          />
          <FilterSelect
            label="Experience"
            value={expFilter}
            options={experiences}
            onChange={setExpFilter}
          />
          <FilterSelect
            label="Education"
            value={eduFilter}
            options={educations}
            onChange={setEduFilter}
          />
          <FilterSelect
            label="Location"
            value={stateFilter}
            options={states}
            onChange={setStateFilter}
          />
          {(posFilter !== "all" ||
            expFilter !== "all" ||
            eduFilter !== "all" ||
            stateFilter !== "all") && (
            <button
              onClick={() => {
                setPosFilter("all");
                setExpFilter("all");
                setEduFilter("all");
                setStateFilter("all");
              }}
              className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
            >
              Clear All
            </button>
          )}

         <button
  onClick={handleMigration}
  disabled={isMigrating} // Assuming a loading state exists
  className="relative ml-auto group overflow-hidden"
>
  {/* Outer Glow/Border Layer */}
  <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl transition-all duration-300 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-95 disabled:opacity-50">
    
    {/* Animated Status Icon */}
    <div className={`transition-transform duration-700 ${isMigrating ? 'animate-spin' : 'group-hover:rotate-180'}`}>
      <RefreshCw size={12} className="text-indigo-400 group-hover:text-indigo-300" />
    </div>

    {/* Primary Label */}
    <div className="flex flex-col items-start">
      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">
        {isMigrating ? 'Synchronizing' : 'Refresh System'}
      </span>
      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter mt-1 group-hover:text-indigo-400/80 transition-colors">
        Data Migration Protocol v2.4
      </span>
    </div>

    {/* Decorative Logic Indicator */}
    <div className="ml-2 w-1 h-4 bg-slate-800 rounded-full overflow-hidden">
        <div className={`w-full bg-indigo-500 transition-all duration-1000 ${isMigrating ? 'h-full' : 'h-0 group-hover:h-1/2'}`} />
    </div>
  </div>
</button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-grow overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
            <tr>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Candidate
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Location
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Designation
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Eduction
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                Status
              </th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {
              loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-sm font-bold text-slate-400"
                  >
                    Loading candidates…
                  </td>
                </tr>
              ) : (
                currentData.map((inv) => (
                  <tr
                    key={inv.id}
                    className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
                          {(inv.name ?? "?").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {inv.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {inv.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs font-bold text-slate-600">
                        {inv.location}
                      </p>
                   
                    </td>
                    <td className="px-6 py-6 text-xs font-bold text-slate-600">
                      {inv.position}
                    </td>
                    <td className="px-6 py-6 text-xs font-bold text-slate-600">
                      {inv.education}
                    </td>
                    <td className="px-6 py-6">
                      <StatusBadge
                        status={inv.status}
                        date={inv.responseDate}
                      />
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedCandidate(inv)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click modal
                            navigate(`/invitation/${inv.id}`);
                          }}
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                          title="Redirect to Profile"
                        >
                          <ExternalLink size={16} />
                        </button>
                        {/* Schedule Interview ICON BUTTON */}
                        <button
                          onClick={() =>
                            navigate(`/invitation/${inv.id}/scheduleinterview`)
                          }
                          disabled={inv.status !== "accepted"}
                          className={`p-2.5 rounded-xl border shadow-sm transition-all ${
                            inv.status === "accepted"
                              ? "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100"
                              : "text-slate-300 bg-slate-100 border-slate-100 cursor-not-allowed"
                          }`}
                          title="Schedule Interview"
                        >
                          <Calendar size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* SIDE DRAWER */}
      {selectedCandidate && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
            onClick={() => setSelectedCandidate(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col p-10">
            <div className="flex justify-between items-start mb-10">
              <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-100">
                {selectedCandidate.name.charAt(0)}
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-10 overflow-y-auto pr-4">
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                  {selectedCandidate.name}
                </h3>
                <p className="text-blue-600 font-bold mt-4 text-sm">
                  {selectedCandidate.email}
                </p>
              </div>

              <div className="space-y-8">
                <DetailRow
                  icon={<Briefcase size={18} />}
                  label="Position & Experience"
                  value={selectedCandidate.position}
                  sub={selectedCandidate.experience}
                />
                <DetailRow
                  icon={<GraduationCap size={18} />}
                  label="Highest Qualification"
                  value={selectedCandidate.education}
                />
                <DetailRow
                  icon={<MapPin size={18} />}
                  label="Location Details"
                  value={`${selectedCandidate.location}`}
                />
                <DetailRow
                  icon={<Clock size={18} />}
                  label="Timeline"
                  value={`Invited: ${formatStatus(selectedCandidate.status)}`}
                  // sub={
                  //   formatStatus(selectedCandidate.status)
                  //     ? `Response: ${formatStatus(selectedCandidate.status)}`
                  //     : "Awaiting response..."
                  // }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// COMPONENT: Custom Filter Dropdown
const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5 min-w-[140px]">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "all" ? `All ${label}s` : opt}
        </option>
      ))}
    </select>
  </div>
);

// COMPONENT: Detail Row for Drawer
const DetailRow = ({ icon, label, value, sub }) => (
  <div className="flex gap-5">
    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-base font-bold text-slate-800 leading-snug">{value}</p>
      {sub && (
        <p className="text-xs font-bold text-blue-500/70 mt-0.5">{sub}</p>
      )}
    </div>
  </div>
);

// COMPONENT: Status Badge
const StatusBadge = ({ status, date }) => {
  const styles = {
    accepted: {
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <CheckCircle2 size={12} />,
      label: "Accepted",
    },
    rejected: {
      bg: "bg-rose-50 text-rose-600 border-rose-100",
      icon: <XCircle size={12} />,
      label: "Rejected",
    },
    sent: {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <Clock size={12} />,
      label: "Pending",
    },
  };
 
  const current = styles[status] ?? {
    bg: "bg-slate-50 text-slate-600 border-slate-200",
    icon: <Clock size={12} />,
    label: status.replace("_", " "),
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}
      >
        {current.icon} {current.label}
      </div>
      {date && (
        <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 uppercase">
          Action: {date}
        </span>
      )}
    </div>
  );
};

export default InvitationTracker;
//***************************************************working code phase 1 12/02/25******************************************************** */
// import React, { useState, useMemo, useEffect } from "react";
// import toast from "react-hot-toast";
// import {
//   Mail,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Search,
//   ExternalLink,
//   X,
//   Briefcase,
//   GraduationCap,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   Calendar,
//   User,
//   Eye,
//   MapPin,
//   Filter,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { candidateService } from "../../services/candidateService";

// const InvitationTracker = () => {
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const navigate = useNavigate();
// const [isMigrating, setIsMigrating] = useState(false);
//   // New Filters State
//   const [posFilter, setPosFilter] = useState("all");
//   const [expFilter, setExpFilter] = useState("all");
//   const [eduFilter, setEduFilter] = useState("all");
//   const [stateFilter, setStateFilter] = useState("all");
//   const [invitations, setInvitations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const itemsPerPage = 8;

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         setLoading(true);
//         const data = await candidateService.getAll();

//         // 🔁 Map API → EXISTING invitation structure

//         const normalizeStatus = (status) => {
//           if (!status) return "sent";

//           const s = status.toLowerCase();

//           const map = {
//             jd_accepted: "accepted",
//             jd_rejected: "rejected",
//             jd_sent: "pending",
//           };

//           // return mapped value OR original status
//           return map[s] || s;
//         };

//         const mapped = data.map((c, index) => ({
//           id: c.id ?? index + 1,
//           name: c.full_name ?? "Unknown",
//           email: c.email ?? "—",
//           sentDate: c.invited_at ?? "—",
//           status: normalizeStatus(c.status),
//           responseDate: c.response_date ?? null,
//           position: c.position ?? "—",
//           experience: c.experience ?? "—",
//           education: c.education ?? "—",
//           location: c.location ?? "—",
//         }));

//         setInvitations(mapped);
//       } catch (err) {
//         console.error("Failed to load candidates", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCandidates();
//   }, []);

//   // LOGIC: Dynamic Filter Options

//   const positions = ["all", ...new Set(invitations.map((i) => i.position))];
//   const experiences = ["all", ...new Set(invitations.map((i) => i.experience))];
//   const educations = ["all", ...new Set(invitations.map((i) => i.education))];
//   const states = ["all", ...new Set(invitations.map((i) => i.location))];

//   // LOGIC: Global Filtering
//   const filteredData = useMemo(() => {
//     return invitations.filter((inv) => {
//       const matchesSearch =
//         (inv.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (inv.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesStatus = filter === "all" || inv.status === filter;
//       const matchesPos = posFilter === "all" || inv.position === posFilter;
//       const matchesExp = expFilter === "all" || inv.experience === expFilter;
//       const matchesEdu = eduFilter === "all" || inv.education === eduFilter;
//       const matchesState =
//         stateFilter === "all" || inv.location === stateFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesPos &&
//         matchesExp &&
//         matchesEdu &&
//         matchesState
//       );
//     });
//   }, [
//     invitations,
//     searchQuery,
//     filter,
//     posFilter,
//     expFilter,
//     eduFilter,
//     stateFilter,
//   ]);

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const handleMigration = async () => {
//   try {
//     setIsMigrating(true);
//     await candidateService.migrateCandidates();
//     toast.success("Migration completed successfully 🚀");
//   } catch (err) {
//     toast.error(err.message || "Migration failed ❌");
//    } finally {
//     setIsMigrating(false);
//   }
// };

// const formatStatus = (status) => {
//   const map = {
//     jd_sent: "JD Sent",
//     opened: "Opened",
//     viewed: "Viewed",
//     responded: "Responded",
//     accepted: "Accepted",
//     rejected: "Rejected",
//     pending: "Pending",
//   };

//   return map[status] || status || "Unknown";
// };


// const formatDateTime = (iso) => {
//   if (!iso) return "—";

//   const date = new Date(iso);

//   return date.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };



//   return (
//     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[850px]">
//       {/* HEADER & GLOBAL FILTERS */}
//       <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">
//               Invitation Analytics
//             </h2>
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//               Enterprise HR Console • {filteredData.length} Candidates
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search name or email..."
//                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//             <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
//               {["all", "accepted", "rejected"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => {
//                     setFilter(t);
//                     setCurrentPage(1);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ADVANCED FILTER ROW */}
//         <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">
//           <FilterSelect
//             label="Position"
//             value={posFilter}
//             options={positions}
//             onChange={setPosFilter}
//           />
//           <FilterSelect
//             label="Experience"
//             value={expFilter}
//             options={experiences}
//             onChange={setExpFilter}
//           />
//           <FilterSelect
//             label="Education"
//             value={eduFilter}
//             options={educations}
//             onChange={setEduFilter}
//           />
//           <FilterSelect
//             label="Location"
//             value={stateFilter}
//             options={states}
//             onChange={setStateFilter}
//           />
//           {(posFilter !== "all" ||
//             expFilter !== "all" ||
//             eduFilter !== "all" ||
//             stateFilter !== "all") && (
//             <button
//               onClick={() => {
//                 setPosFilter("all");
//                 setExpFilter("all");
//                 setEduFilter("all");
//                 setStateFilter("all");
//               }}
//               className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
//             >
//               Clear All
//             </button>
//           )}

//          <button
//   onClick={handleMigration}
//   disabled={isMigrating} // Assuming a loading state exists
//   className="relative ml-auto group overflow-hidden"
// >
//   {/* Outer Glow/Border Layer */}
//   <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl transition-all duration-300 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-95 disabled:opacity-50">
    
//     {/* Animated Status Icon */}
//     <div className={`transition-transform duration-700 ${isMigrating ? 'animate-spin' : 'group-hover:rotate-180'}`}>
//       <RefreshCw size={12} className="text-indigo-400 group-hover:text-indigo-300" />
//     </div>

//     {/* Primary Label */}
//     <div className="flex flex-col items-start">
//       <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">
//         {isMigrating ? 'Synchronizing' : 'Refresh System'}
//       </span>
//       <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter mt-1 group-hover:text-indigo-400/80 transition-colors">
//         Data Migration Protocol v2.4
//       </span>
//     </div>

//     {/* Decorative Logic Indicator */}
//     <div className="ml-2 w-1 h-4 bg-slate-800 rounded-full overflow-hidden">
//         <div className={`w-full bg-indigo-500 transition-all duration-1000 ${isMigrating ? 'h-full' : 'h-0 group-hover:h-1/2'}`} />
//     </div>
//   </div>
// </button>
//         </div>
//       </div>

//       {/* TABLE SECTION */}
//       <div className="flex-grow overflow-y-auto">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
//             <tr>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Candidate
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Location
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Designation
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Eduction
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Status
//               </th>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {
//               loading ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="py-20 text-center text-sm font-bold text-slate-400"
//                   >
//                     Loading candidates…
//                   </td>
//                 </tr>
//               ) : (
//                 currentData.map((inv) => (
//                   <tr
//                     key={inv.id}
//                     className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
//                   >
//                     <td className="px-10 py-6">
//                       <div className="flex items-center gap-4">
//                         <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//                           {(inv.name ?? "?").charAt(0)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-slate-800">
//                             {inv.name}
//                           </p>
//                           <p className="text-[11px] text-slate-400 font-medium">
//                             {inv.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-6">
//                       <p className="text-xs font-bold text-slate-600">
//                         {inv.location}
//                       </p>
                   
//                     </td>
//                     <td className="px-6 py-6 text-xs font-bold text-slate-600">
//                       {inv.position}
//                     </td>
//                     <td className="px-6 py-6 text-xs font-bold text-slate-600">
//                       {inv.education}
//                     </td>
//                     <td className="px-6 py-6">
//                       <StatusBadge
//                         status={inv.status}
//                         date={inv.responseDate}
//                       />
//                     </td>
//                     <td className="px-10 py-6 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => setSelectedCandidate(inv)}
//                           className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                           title="View Details"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation(); // prevent row click modal
//                             navigate(`/invitation/${inv.id}`);
//                           }}
//                           className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                           title="Redirect to Profile"
//                         >
//                           <ExternalLink size={16} />
//                         </button>
//                         {/* Schedule Interview ICON BUTTON */}
//                         <button
//                           onClick={() =>
//                             navigate(`/invitation/${inv.id}/scheduleinterview`)
//                           }
//                           disabled={inv.status !== "accepted"}
//                           className={`p-2.5 rounded-xl border shadow-sm transition-all ${
//                             inv.status === "accepted"
//                               ? "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100"
//                               : "text-slate-300 bg-slate-100 border-slate-100 cursor-not-allowed"
//                           }`}
//                           title="Schedule Interview"
//                         >
//                           <Calendar size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )
//             }
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION FOOTER */}
//       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//           Page {currentPage} of {totalPages}
//         </span>
//         <div className="flex gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             <ChevronLeft size={14} /> Prev
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             Next <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* SIDE DRAWER */}
//       {selectedCandidate && (
//         <>
//           <div
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
//             onClick={() => setSelectedCandidate(null)}
//           />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col p-10">
//             <div className="flex justify-between items-start mb-10">
//               <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-100">
//                 {selectedCandidate.name.charAt(0)}
//               </div>
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-10 overflow-y-auto pr-4">
//               <div>
//                 <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
//                   {selectedCandidate.name}
//                 </h3>
//                 <p className="text-blue-600 font-bold mt-4 text-sm">
//                   {selectedCandidate.email}
//                 </p>
//               </div>

//               <div className="space-y-8">
//                 <DetailRow
//                   icon={<Briefcase size={18} />}
//                   label="Position & Experience"
//                   value={selectedCandidate.position}
//                   sub={selectedCandidate.experience}
//                 />
//                 <DetailRow
//                   icon={<GraduationCap size={18} />}
//                   label="Highest Qualification"
//                   value={selectedCandidate.education}
//                 />
//                 <DetailRow
//                   icon={<MapPin size={18} />}
//                   label="Location Details"
//                   value={`${selectedCandidate.location}`}
//                 />
//                 <DetailRow
//                   icon={<Clock size={18} />}
//                   label="Timeline"
//                   value={`Invited: ${formatStatus(selectedCandidate.status)}`}
//                   // sub={
//                   //   formatStatus(selectedCandidate.status)
//                   //     ? `Response: ${formatStatus(selectedCandidate.status)}`
//                   //     : "Awaiting response..."
//                   // }
//                 />
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // COMPONENT: Custom Filter Dropdown
// const FilterSelect = ({ label, value, options, onChange }) => (
//   <div className="flex flex-col gap-1.5 min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       {label}
//     </span>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt === "all" ? `All ${label}s` : opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // COMPONENT: Detail Row for Drawer
// const DetailRow = ({ icon, label, value, sub }) => (
//   <div className="flex gap-5">
//     <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//         {label}
//       </p>
//       <p className="text-base font-bold text-slate-800 leading-snug">{value}</p>
//       {sub && (
//         <p className="text-xs font-bold text-blue-500/70 mt-0.5">{sub}</p>
//       )}
//     </div>
//   </div>
// );

// // COMPONENT: Status Badge
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: {
//       bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
//       icon: <CheckCircle2 size={12} />,
//       label: "Accepted",
//     },
//     rejected: {
//       bg: "bg-rose-50 text-rose-600 border-rose-100",
//       icon: <XCircle size={12} />,
//       label: "Rejected",
//     },
//     sent: {
//       bg: "bg-amber-50 text-amber-600 border-amber-100",
//       icon: <Clock size={12} />,
//       label: "Pending",
//     },
//   };
 
//   const current = styles[status] ?? {
//     bg: "bg-slate-50 text-slate-600 border-slate-200",
//     icon: <Clock size={12} />,
//     label: status.replace("_", " "),
//   };

//   return (
//     <div className="flex flex-col gap-1">
//       <div
//         className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}
//       >
//         {current.icon} {current.label}
//       </div>
//       {date && (
//         <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 uppercase">
//           Action: {date}
//         </span>
//       )}
//     </div>
//   );
// };

// export default InvitationTracker;
//**************************************************working code phase 7720***************************************************** */
// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Mail,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Search,
//   ExternalLink,
//   X,
//   Briefcase,
//   GraduationCap,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   User,
//   Eye,
//   MapPin,
//   Filter,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { candidateService } from "../../services/candidateService";

// const InvitationTracker = () => {
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const navigate = useNavigate();

//   // New Filters State
//   const [posFilter, setPosFilter] = useState("all");
//   const [expFilter, setExpFilter] = useState("all");
//   const [eduFilter, setEduFilter] = useState("all");
//   const [stateFilter, setStateFilter] = useState("all");
//   const [invitations, setInvitations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const itemsPerPage = 8;

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         setLoading(true);
//         const data = await candidateService.getAll();

//         // 🔁 Map API → EXISTING invitation structure
//         // const mapped = data.map((c, index) => ({
//         //   id: c.id ?? index + 1,
//         //   name: c.name,
//         //   email: c.email,
//         //   sentDate: c.invited_at ?? "—",
//         //   status: c.status ?? "sent",
//         //   responseDate: c.response_date ?? null,
//         //   position: c.position ?? "—",
//         //   experience: c.experience ?? "—",
//         //   education: c.education ?? "—",
//         //   location: {
//         //     city: c.city ?? "—",
//         //     district: c.district ?? "",
//         //     state: c.state ?? "—",
//         //     pincode: c.pincode ?? "",
//         //     country: c.country ?? "India",
//         //   },
//         // }));
//         //      const normalizeStatus = (status) => {
//         //   if (!status) return "sent";
//         //   const s = status.toLowerCase();
//         //   if (s === "jd_accepted") return "accepted";
//         //   if (s === "jd_rejected") return "rejected";
//         //   if (s === "jd_sent") return "pending";
//         //   return "sent";
//         // };

//         const normalizeStatus = (status) => {
//           if (!status) return "sent";

//           const s = status.toLowerCase();

//           const map = {
//             jd_accepted: "accepted",
//             jd_rejected: "rejected",
//             jd_sent: "pending",
//           };

//           // return mapped value OR original status
//           return map[s] || s;
//         };

//         const mapped = data.map((c, index) => ({
//           id: c.id ?? index + 1,
//           name: c.full_name ?? "Unknown",
//           email: c.email ?? "—",
//           sentDate: c.invited_at ?? "—",
//           status: normalizeStatus(c.status),
//           responseDate: c.response_date ?? null,
//           position: c.position ?? "—",
//           experience: c.experience ?? "—",
//           education: c.education ?? "—",
//           location: c.location ?? "—",
//           // location: {
//           //   city: c.city ?? "—",
//           //   district: c.district ?? "",
//           //   state: c.state ?? "—",
//           //   pincode: c.pincode ?? "",
//           //   country: c.country ?? "India",
//           // },
//         }));

//         setInvitations(mapped);
//       } catch (err) {
//         console.error("Failed to load candidates", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCandidates();
//   }, []);

//   // const invitations = [
//   //   {
//   //     id: 1,
//   //     name: "Arjun Mehta",
//   //     email: "arjun.m@tech.com",
//   //     sentDate: "Jan 24, 2026",
//   //     status: "accepted",
//   //     responseDate: "Jan 25, 2026",
//   //     position: "Senior Frontend Lead",
//   //     experience: "6 Years",
//   //     education: "B.Tech Computer Science",
//   //     location: {
//   //       city: "Mumbai",
//   //       district: "Mumbai Suburban",
//   //       state: "Maharashtra",
//   //       pincode: "400001",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Sara Khan",
//   //     email: "sara.k@design.io",
//   //     sentDate: "Jan 23, 2026",
//   //     status: "rejected",
//   //     responseDate: "Jan 23, 2026",
//   //     position: "Product Designer",
//   //     experience: "4 Years",
//   //     education: "B.Des UI/UX",
//   //     location: {
//   //       city: "Delhi",
//   //       district: "South Delhi",
//   //       state: "Delhi",
//   //       pincode: "110017",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Michael Chen",
//   //     email: "m.chen@dev.net",
//   //     sentDate: "Jan 26, 2026",
//   //     status: "sent",
//   //     responseDate: null,
//   //     position: "Backend Engineer",
//   //     experience: "5 Years",
//   //     education: "M.Tech Software Engineering",
//   //     location: {
//   //       city: "Bangalore",
//   //       district: "Bangalore Urban",
//   //       state: "Karnataka",
//   //       pincode: "560001",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 4,
//   //     name: "Vinayak Arjun",
//   //     email: "vinayak@company.com",
//   //     sentDate: "Jan 26, 2026",
//   //     status: "accepted",
//   //     responseDate: "Jan 27, 2026",
//   //     position: "HR Manager",
//   //     experience: "7 Years",
//   //     education: "MBA HR",
//   //     location: {
//   //       city: "Pune",
//   //       district: "Pune",
//   //       state: "Maharashtra",
//   //       pincode: "411001",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 5,
//   //     name: "Riya Sharma",
//   //     email: "riya@uiux.com",
//   //     sentDate: "Jan 25, 2026",
//   //     status: "sent",
//   //     responseDate: null,
//   //     position: "UI/UX Designer",
//   //     experience: "3 Years",
//   //     education: "BFA Design",
//   //     location: {
//   //       city: "Jaipur",
//   //       district: "Jaipur",
//   //       state: "Rajasthan",
//   //       pincode: "302001",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 6,
//   //     name: "Rahul Singh",
//   //     email: "rahul@devops.io",
//   //     sentDate: "Jan 24, 2026",
//   //     status: "rejected",
//   //     responseDate: "Jan 24, 2026",
//   //     position: "DevOps Engineer",
//   //     experience: "8 Years",
//   //     education: "B.Tech IT",
//   //     location: {
//   //       city: "Noida",
//   //       district: "Gautam Buddha Nagar",
//   //       state: "Uttar Pradesh",
//   //       pincode: "201301",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 7,
//   //     name: "Amit Patel",
//   //     email: "amit@cloud.io",
//   //     sentDate: "Jan 22, 2026",
//   //     status: "sent",
//   //     responseDate: null,
//   //     position: "Cloud Engineer",
//   //     experience: "5 Years",
//   //     education: "B.Tech Computer Science",
//   //     location: {
//   //       city: "Ahmedabad",
//   //       district: "Ahmedabad",
//   //       state: "Gujarat",
//   //       pincode: "380001",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 8,
//   //     name: "Neha Verma",
//   //     email: "neha@qa.com",
//   //     sentDate: "Jan 21, 2026",
//   //     status: "accepted",
//   //     responseDate: "Jan 22, 2026",
//   //     position: "QA Analyst",
//   //     experience: "2 Years",
//   //     education: "B.Sc IT",
//   //     location: {
//   //       city: "Indore",
//   //       district: "Indore",
//   //       state: "Madhya Pradesh",
//   //       pincode: "452001",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 9,
//   //     name: "Karan Malhotra",
//   //     email: "karan@mobile.dev",
//   //     sentDate: "Jan 20, 2026",
//   //     status: "sent",
//   //     responseDate: null,
//   //     position: "Mobile App Developer",
//   //     experience: "4 Years",
//   //     education: "B.Tech CS",
//   //     location: {
//   //       city: "Chandigarh",
//   //       district: "Chandigarh",
//   //       state: "Chandigarh",
//   //       pincode: "160017",
//   //       country: "India",
//   //     },
//   //   },
//   //   {
//   //     id: 10,
//   //     name: "Priya Desai",
//   //     email: "priya@finance.com",
//   //     sentDate: "Jan 19, 2026",
//   //     status: "rejected",
//   //     responseDate: "Jan 19, 2026",
//   //     position: "Finance Analyst",
//   //     experience: "3 Years",
//   //     education: "MBA Finance",
//   //     location: {
//   //       city: "Surat",
//   //       district: "Surat",
//   //       state: "Gujarat",
//   //       pincode: "395003",
//   //       country: "India",
//   //     },
//   //   },
//   //   ...Array.from({ length: 40 }).map((_, i) => ({
//   //     id: 11 + i,
//   //     name: `Candidate ${11 + i}`,
//   //     email: `candidate${11 + i}@mail.com`,
//   //     sentDate: "Jan 10, 2026",
//   //     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
//   //     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
//   //     position: [
//   //       "Frontend Dev",
//   //       "Backend Dev",
//   //       "Full Stack Dev",
//   //       "QA Engineer",
//   //       "HR Executive",
//   //     ][i % 5],
//   //     experience: `${(i % 10) + 1} Years`,
//   //     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][
//   //       i % 5
//   //     ],
//   //     location: {
//   //       city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
//   //       state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][
//   //         i % 5
//   //       ],
//   //       pincode: `4000${i + 10}`,
//   //       country: "India",
//   //     },
//   //   })),
//   // ];

//   // LOGIC: Dynamic Filter Options

//   const positions = ["all", ...new Set(invitations.map((i) => i.position))];
//   const experiences = ["all", ...new Set(invitations.map((i) => i.experience))];
//   const educations = ["all", ...new Set(invitations.map((i) => i.education))];
//   const states = ["all", ...new Set(invitations.map((i) => i.location))];

//   // LOGIC: Global Filtering
//   const filteredData = useMemo(() => {
//     return invitations.filter((inv) => {
//       // const matchesSearch =
//       //   inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       //   inv.email.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesSearch =
//         (inv.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (inv.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesStatus = filter === "all" || inv.status === filter;
//       const matchesPos = posFilter === "all" || inv.position === posFilter;
//       const matchesExp = expFilter === "all" || inv.experience === expFilter;
//       const matchesEdu = eduFilter === "all" || inv.education === eduFilter;
//       const matchesState =
//         stateFilter === "all" || inv.location === stateFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesPos &&
//         matchesExp &&
//         matchesEdu &&
//         matchesState
//       );
//     });
//   }, [
//     invitations,
//     searchQuery,
//     filter,
//     posFilter,
//     expFilter,
//     eduFilter,
//     stateFilter,
//   ]);

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   return (
//     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[850px]">
//       {/* HEADER & GLOBAL FILTERS */}
//       <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">
//               Invitation Analytics
//             </h2>
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//               Enterprise HR Console • {filteredData.length} Candidates
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search name or email..."
//                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//             <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
//               {["all", "accepted", "rejected"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => {
//                     setFilter(t);
//                     setCurrentPage(1);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ADVANCED FILTER ROW */}
//         <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">
//           <FilterSelect
//             label="Position"
//             value={posFilter}
//             options={positions}
//             onChange={setPosFilter}
//           />
//           <FilterSelect
//             label="Experience"
//             value={expFilter}
//             options={experiences}
//             onChange={setExpFilter}
//           />
//           <FilterSelect
//             label="Education"
//             value={eduFilter}
//             options={educations}
//             onChange={setEduFilter}
//           />
//           <FilterSelect
//             label="Location"
//             value={stateFilter}
//             options={states}
//             onChange={setStateFilter}
//           />
//           {(posFilter !== "all" ||
//             expFilter !== "all" ||
//             eduFilter !== "all" ||
//             stateFilter !== "all") && (
//             <button
//               onClick={() => {
//                 setPosFilter("all");
//                 setExpFilter("all");
//                 setEduFilter("all");
//                 setStateFilter("all");
//               }}
//               className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
//             >
//               Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* TABLE SECTION */}
//       <div className="flex-grow overflow-y-auto">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
//             <tr>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Candidate
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Location
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Designation
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Status
//               </th>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {
//               loading ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="py-20 text-center text-sm font-bold text-slate-400"
//                   >
//                     Loading candidates…
//                   </td>
//                 </tr>
//               ) : (
//                 currentData.map((inv) => (
//                   <tr
//                     key={inv.id}
//                     className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
//                   >
//                     <td className="px-10 py-6">
//                       <div className="flex items-center gap-4">
//                         <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//                           {(inv.name ?? "?").charAt(0)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-slate-800">
//                             {inv.name}
//                           </p>
//                           <p className="text-[11px] text-slate-400 font-medium">
//                             {inv.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-6">
//                       <p className="text-xs font-bold text-slate-600">
//                         {inv.location}
//                       </p>
//                       {/* <p className="text-[10px] text-slate-400 font-bold uppercase">
//                     {inv.location.state}
//                   </p> */}
//                     </td>
//                     <td className="px-6 py-6 text-xs font-bold text-slate-600">
//                       {inv.position}
//                     </td>
//                     <td className="px-6 py-6">
//                       <StatusBadge
//                         status={inv.status}
//                         date={inv.responseDate}
//                       />
//                     </td>
//                     <td className="px-10 py-6 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => setSelectedCandidate(inv)}
//                           className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                           title="View Details"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation(); // prevent row click modal
//                             navigate(`/invitation/${inv.id}`);
//                           }}
//                           className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                           title="Redirect to Profile"
//                         >
//                           <ExternalLink size={16} />
//                         </button>
//                         {/* Schedule Interview ICON BUTTON */}
//                         <button
//                           onClick={() =>
//                             navigate(`/invitation/${inv.id}/scheduleinterview`)
//                           }
//                           disabled={inv.status !== "accepted"}
//                           className={`p-2.5 rounded-xl border shadow-sm transition-all ${
//                             inv.status === "accepted"
//                               ? "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100"
//                               : "text-slate-300 bg-slate-100 border-slate-100 cursor-not-allowed"
//                           }`}
//                           title="Schedule Interview"
//                         >
//                           <Calendar size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )
//               // currentData.map((inv) => (
//               //   <tr
//               //     key={inv.id}
//               //     className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
//               //   >
//               //     <td className="px-10 py-6">
//               //       <div className="flex items-center gap-4">
//               //         <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//               //           {inv.name.charAt(0)}
//               //         </div>
//               //         <div>
//               //           <p className="text-sm font-bold text-slate-800">
//               //             {inv.name}
//               //           </p>
//               //           <p className="text-[11px] text-slate-400 font-medium">
//               //             {inv.email}
//               //           </p>
//               //         </div>
//               //       </div>
//               //     </td>
//               //     <td className="px-6 py-6">
//               //       <p className="text-xs font-bold text-slate-600">
//               //         {inv.location.city}
//               //       </p>
//               //       <p className="text-[10px] text-slate-400 font-bold uppercase">
//               //         {inv.location.state}
//               //       </p>
//               //     </td>
//               //     <td className="px-6 py-6 text-xs font-bold text-slate-600">
//               //       {inv.position}
//               //     </td>
//               //     <td className="px-6 py-6">
//               //       <StatusBadge status={inv.status} date={inv.responseDate} />
//               //     </td>
//               //     <td className="px-10 py-6 text-right">
//               //       <div className="flex justify-end gap-2">
//               //         <button
//               //           onClick={() => setSelectedCandidate(inv)}
//               //           className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//               //           title="View Details"
//               //         >
//               //           <Eye size={16} />
//               //         </button>
//               //         <button
//               //           onClick={(e) => {
//               //             e.stopPropagation(); // prevent row click modal
//               //             navigate(`/invitation/${inv.id}`);
//               //           }}
//               //           className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//               //           title="Redirect to Profile"
//               //         >
//               //           <ExternalLink size={16} />
//               //         </button>
//               //         {/* Schedule Interview ICON BUTTON */}
//               //         <button
//               //           onClick={() =>
//               //             navigate(`/invitation/${inv.id}/scheduleinterview`)
//               //           }
//               //           disabled={inv.status !== "accepted"}
//               //           className={`p-2.5 rounded-xl border shadow-sm transition-all ${
//               //             inv.status === "accepted"
//               //               ? "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100"
//               //               : "text-slate-300 bg-slate-100 border-slate-100 cursor-not-allowed"
//               //           }`}
//               //           title="Schedule Interview"
//               //         >
//               //           <Calendar size={16} />
//               //         </button>
//               //       </div>
//               //     </td>
//               //   </tr>
//               // ))
//             }
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION FOOTER */}
//       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//           Page {currentPage} of {totalPages}
//         </span>
//         <div className="flex gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             <ChevronLeft size={14} /> Prev
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             Next <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* SIDE DRAWER */}
//       {selectedCandidate && (
//         <>
//           <div
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
//             onClick={() => setSelectedCandidate(null)}
//           />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col p-10">
//             <div className="flex justify-between items-start mb-10">
//               <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-100">
//                 {selectedCandidate.name.charAt(0)}
//               </div>
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-10 overflow-y-auto pr-4">
//               <div>
//                 <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
//                   {selectedCandidate.name}
//                 </h3>
//                 <p className="text-blue-600 font-bold mt-4 text-sm">
//                   {selectedCandidate.email}
//                 </p>
//               </div>

//               <div className="space-y-8">
//                 <DetailRow
//                   icon={<Briefcase size={18} />}
//                   label="Position & Experience"
//                   value={selectedCandidate.position}
//                   sub={selectedCandidate.experience}
//                 />
//                 <DetailRow
//                   icon={<GraduationCap size={18} />}
//                   label="Highest Qualification"
//                   value={selectedCandidate.education}
//                 />
//                 <DetailRow
//                   icon={<MapPin size={18} />}
//                   label="Location Details"
//                   // value={`${selectedCandidate.location.city}, ${selectedCandidate.location.state}`}
//                   value={`${selectedCandidate.location}`}
//                   // sub={`Pincode: ${selectedCandidate.location.pincode}`}
//                 />
//                 <DetailRow
//                   icon={<Clock size={18} />}
//                   label="Timeline"
//                   value={`Invited: ${selectedCandidate.sentDate}`}
//                   sub={
//                     selectedCandidate.responseDate
//                       ? `Response: ${selectedCandidate.responseDate}`
//                       : "Awaiting response..."
//                   }
//                 />
//               </div>

//               {/* <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200">
//                 Confirm Engagement
//               </button> */}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // COMPONENT: Custom Filter Dropdown
// const FilterSelect = ({ label, value, options, onChange }) => (
//   <div className="flex flex-col gap-1.5 min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       {label}
//     </span>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt === "all" ? `All ${label}s` : opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // COMPONENT: Detail Row for Drawer
// const DetailRow = ({ icon, label, value, sub }) => (
//   <div className="flex gap-5">
//     <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//         {label}
//       </p>
//       <p className="text-base font-bold text-slate-800 leading-snug">{value}</p>
//       {sub && (
//         <p className="text-xs font-bold text-blue-500/70 mt-0.5">{sub}</p>
//       )}
//     </div>
//   </div>
// );

// // COMPONENT: Status Badge
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: {
//       bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
//       icon: <CheckCircle2 size={12} />,
//       label: "Accepted",
//     },
//     rejected: {
//       bg: "bg-rose-50 text-rose-600 border-rose-100",
//       icon: <XCircle size={12} />,
//       label: "Rejected",
//     },
//     sent: {
//       bg: "bg-amber-50 text-amber-600 border-amber-100",
//       icon: <Clock size={12} />,
//       label: "Pending",
//     },
//   };
//   // const current = styles[status];

//   // const current = styles[status] ?? styles.sent;
//   const current = styles[status] ?? {
//     bg: "bg-slate-50 text-slate-600 border-slate-200",
//     icon: <Clock size={12} />,
//     label: status.replace("_", " "),
//   };

//   return (
//     <div className="flex flex-col gap-1">
//       <div
//         className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}
//       >
//         {current.icon} {current.label}
//       </div>
//       {date && (
//         <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 uppercase">
//           Action: {date}
//         </span>
//       )}
//     </div>
//   );
// };

// export default InvitationTracker;
//**********************************************working code phase 1 *************************************************************** */

// import React, { useState, useMemo } from "react";
// import {
//   Mail,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Search,
//   ExternalLink,
//   X,
//   Briefcase,
//   GraduationCap,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   User,
//   Eye,
//   MapPin,
//   Filter,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// const InvitationTracker = () => {
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const navigate = useNavigate();

//   // New Filters State
//   const [posFilter, setPosFilter] = useState("all");
//   const [expFilter, setExpFilter] = useState("all");
//   const [eduFilter, setEduFilter] = useState("all");
//   const [stateFilter, setStateFilter] = useState("all");

//   const itemsPerPage = 8;

//   const invitations = [
//     {
//       id: 1,
//       name: "Arjun Mehta",
//       email: "arjun.m@tech.com",
//       sentDate: "Jan 24, 2026",
//       status: "accepted",
//       responseDate: "Jan 25, 2026",
//       position: "Senior Frontend Lead",
//       experience: "6 Years",
//       education: "B.Tech Computer Science",
//       location: {
//         city: "Mumbai",
//         district: "Mumbai Suburban",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//       },
//     },
//     {
//       id: 2,
//       name: "Sara Khan",
//       email: "sara.k@design.io",
//       sentDate: "Jan 23, 2026",
//       status: "rejected",
//       responseDate: "Jan 23, 2026",
//       position: "Product Designer",
//       experience: "4 Years",
//       education: "B.Des UI/UX",
//       location: {
//         city: "Delhi",
//         district: "South Delhi",
//         state: "Delhi",
//         pincode: "110017",
//         country: "India",
//       },
//     },
//     {
//       id: 3,
//       name: "Michael Chen",
//       email: "m.chen@dev.net",
//       sentDate: "Jan 26, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "Backend Engineer",
//       experience: "5 Years",
//       education: "M.Tech Software Engineering",
//       location: {
//         city: "Bangalore",
//         district: "Bangalore Urban",
//         state: "Karnataka",
//         pincode: "560001",
//         country: "India",
//       },
//     },
//     {
//       id: 4,
//       name: "Vinayak Arjun",
//       email: "vinayak@company.com",
//       sentDate: "Jan 26, 2026",
//       status: "accepted",
//       responseDate: "Jan 27, 2026",
//       position: "HR Manager",
//       experience: "7 Years",
//       education: "MBA HR",
//       location: {
//         city: "Pune",
//         district: "Pune",
//         state: "Maharashtra",
//         pincode: "411001",
//         country: "India",
//       },
//     },
//     {
//       id: 5,
//       name: "Riya Sharma",
//       email: "riya@uiux.com",
//       sentDate: "Jan 25, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "UI/UX Designer",
//       experience: "3 Years",
//       education: "BFA Design",
//       location: {
//         city: "Jaipur",
//         district: "Jaipur",
//         state: "Rajasthan",
//         pincode: "302001",
//         country: "India",
//       },
//     },
//     {
//       id: 6,
//       name: "Rahul Singh",
//       email: "rahul@devops.io",
//       sentDate: "Jan 24, 2026",
//       status: "rejected",
//       responseDate: "Jan 24, 2026",
//       position: "DevOps Engineer",
//       experience: "8 Years",
//       education: "B.Tech IT",
//       location: {
//         city: "Noida",
//         district: "Gautam Buddha Nagar",
//         state: "Uttar Pradesh",
//         pincode: "201301",
//         country: "India",
//       },
//     },
//     {
//       id: 7,
//       name: "Amit Patel",
//       email: "amit@cloud.io",
//       sentDate: "Jan 22, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "Cloud Engineer",
//       experience: "5 Years",
//       education: "B.Tech Computer Science",
//       location: {
//         city: "Ahmedabad",
//         district: "Ahmedabad",
//         state: "Gujarat",
//         pincode: "380001",
//         country: "India",
//       },
//     },
//     {
//       id: 8,
//       name: "Neha Verma",
//       email: "neha@qa.com",
//       sentDate: "Jan 21, 2026",
//       status: "accepted",
//       responseDate: "Jan 22, 2026",
//       position: "QA Analyst",
//       experience: "2 Years",
//       education: "B.Sc IT",
//       location: {
//         city: "Indore",
//         district: "Indore",
//         state: "Madhya Pradesh",
//         pincode: "452001",
//         country: "India",
//       },
//     },
//     {
//       id: 9,
//       name: "Karan Malhotra",
//       email: "karan@mobile.dev",
//       sentDate: "Jan 20, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "Mobile App Developer",
//       experience: "4 Years",
//       education: "B.Tech CS",
//       location: {
//         city: "Chandigarh",
//         district: "Chandigarh",
//         state: "Chandigarh",
//         pincode: "160017",
//         country: "India",
//       },
//     },
//     {
//       id: 10,
//       name: "Priya Desai",
//       email: "priya@finance.com",
//       sentDate: "Jan 19, 2026",
//       status: "rejected",
//       responseDate: "Jan 19, 2026",
//       position: "Finance Analyst",
//       experience: "3 Years",
//       education: "MBA Finance",
//       location: {
//         city: "Surat",
//         district: "Surat",
//         state: "Gujarat",
//         pincode: "395003",
//         country: "India",
//       },
//     },
//     ...Array.from({ length: 40 }).map((_, i) => ({
//       id: 11 + i,
//       name: `Candidate ${11 + i}`,
//       email: `candidate${11 + i}@mail.com`,
//       sentDate: "Jan 10, 2026",
//       status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
//       responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
//       position: [
//         "Frontend Dev",
//         "Backend Dev",
//         "Full Stack Dev",
//         "QA Engineer",
//         "HR Executive",
//       ][i % 5],
//       experience: `${(i % 10) + 1} Years`,
//       education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][
//         i % 5
//       ],
//       location: {
//         city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
//         state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][
//           i % 5
//         ],
//         pincode: `4000${i + 10}`,
//         country: "India",
//       },
//     })),
//   ];

//   // LOGIC: Dynamic Filter Options
//   const positions = ["all", ...new Set(invitations.map((i) => i.position))];
//   const experiences = ["all", ...new Set(invitations.map((i) => i.experience))];
//   const educations = ["all", ...new Set(invitations.map((i) => i.education))];
//   const states = ["all", ...new Set(invitations.map((i) => i.location.state))];

//   // LOGIC: Global Filtering
//   const filteredData = useMemo(() => {
//     return invitations.filter((inv) => {
//       const matchesSearch =
//         inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         inv.email.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesStatus = filter === "all" || inv.status === filter;
//       const matchesPos = posFilter === "all" || inv.position === posFilter;
//       const matchesExp = expFilter === "all" || inv.experience === expFilter;
//       const matchesEdu = eduFilter === "all" || inv.education === eduFilter;
//       const matchesState =
//         stateFilter === "all" || inv.location.state === stateFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesPos &&
//         matchesExp &&
//         matchesEdu &&
//         matchesState
//       );
//     });
//   }, [searchQuery, filter, posFilter, expFilter, eduFilter, stateFilter]);

//   // LOGIC: Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   return (
//     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[850px]">
//       {/* HEADER & GLOBAL FILTERS */}
//       <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">
//               Invitation Analytics
//             </h2>
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//               Enterprise HR Console • {filteredData.length} Candidates
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search name or email..."
//                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//             <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
//               {["all", "accepted", "rejected"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => {
//                     setFilter(t);
//                     setCurrentPage(1);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ADVANCED FILTER ROW */}
//         <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">
//           <FilterSelect
//             label="Position"
//             value={posFilter}
//             options={positions}
//             onChange={setPosFilter}
//           />
//           <FilterSelect
//             label="Experience"
//             value={expFilter}
//             options={experiences}
//             onChange={setExpFilter}
//           />
//           <FilterSelect
//             label="Education"
//             value={eduFilter}
//             options={educations}
//             onChange={setEduFilter}
//           />
//           <FilterSelect
//             label="State"
//             value={stateFilter}
//             options={states}
//             onChange={setStateFilter}
//           />
//           {(posFilter !== "all" ||
//             expFilter !== "all" ||
//             eduFilter !== "all" ||
//             stateFilter !== "all") && (
//             <button
//               onClick={() => {
//                 setPosFilter("all");
//                 setExpFilter("all");
//                 setEduFilter("all");
//                 setStateFilter("all");
//               }}
//               className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
//             >
//               Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* TABLE SECTION */}
//       <div className="flex-grow overflow-y-auto">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
//             <tr>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Candidate
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Location
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Designation
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Status
//               </th>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {currentData.map((inv) => (
//               <tr
//                 key={inv.id}
//                 className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
//               >
//                 <td className="px-10 py-6">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//                       {inv.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-800">
//                         {inv.name}
//                       </p>
//                       <p className="text-[11px] text-slate-400 font-medium">
//                         {inv.email}
//                       </p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-6">
//                   <p className="text-xs font-bold text-slate-600">
//                     {inv.location.city}
//                   </p>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase">
//                     {inv.location.state}
//                   </p>
//                 </td>
//                 <td className="px-6 py-6 text-xs font-bold text-slate-600">
//                   {inv.position}
//                 </td>
//                 <td className="px-6 py-6">
//                   <StatusBadge status={inv.status} date={inv.responseDate} />
//                 </td>
//                 <td className="px-10 py-6 text-right">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => setSelectedCandidate(inv)}
//                       className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                       title="View Details"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // prevent row click modal
//                         navigate(`/invitation/${inv.id}`);
//                       }}
//                       className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                       title="Redirect to Profile"
//                     >
//                       <ExternalLink size={16} />
//                     </button>
//                     {/* Schedule Interview ICON BUTTON */}
//                     <button
//                       onClick={() =>
//                         navigate(`/invitation/${inv.id}/scheduleinterview`)
//                       }
//                       disabled={inv.status !== "accepted"}
//                       className={`p-2.5 rounded-xl border shadow-sm transition-all ${
//                         inv.status === "accepted"
//                           ? "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100"
//                           : "text-slate-300 bg-slate-100 border-slate-100 cursor-not-allowed"
//                       }`}
//                       title="Schedule Interview"
//                     >
//                       <Calendar size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION FOOTER */}
//       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//           Page {currentPage} of {totalPages}
//         </span>
//         <div className="flex gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             <ChevronLeft size={14} /> Prev
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             Next <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* SIDE DRAWER */}
//       {selectedCandidate && (
//         <>
//           <div
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
//             onClick={() => setSelectedCandidate(null)}
//           />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col p-10">
//             <div className="flex justify-between items-start mb-10">
//               <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-100">
//                 {selectedCandidate.name.charAt(0)}
//               </div>
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-10 overflow-y-auto pr-4">
//               <div>
//                 <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
//                   {selectedCandidate.name}
//                 </h3>
//                 <p className="text-blue-600 font-bold mt-4 text-sm">
//                   {selectedCandidate.email}
//                 </p>
//               </div>

//               <div className="space-y-8">
//                 <DetailRow
//                   icon={<Briefcase size={18} />}
//                   label="Position & Experience"
//                   value={selectedCandidate.position}
//                   sub={selectedCandidate.experience}
//                 />
//                 <DetailRow
//                   icon={<GraduationCap size={18} />}
//                   label="Highest Qualification"
//                   value={selectedCandidate.education}
//                 />
//                 <DetailRow
//                   icon={<MapPin size={18} />}
//                   label="Location Details"
//                   value={`${selectedCandidate.location.city}, ${selectedCandidate.location.state}`}
//                   sub={`Pincode: ${selectedCandidate.location.pincode}`}
//                 />
//                 <DetailRow
//                   icon={<Clock size={18} />}
//                   label="Timeline"
//                   value={`Invited: ${selectedCandidate.sentDate}`}
//                   sub={
//                     selectedCandidate.responseDate
//                       ? `Response: ${selectedCandidate.responseDate}`
//                       : "Awaiting response..."
//                   }
//                 />
//               </div>

//               <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200">
//                 Confirm Engagement
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // COMPONENT: Custom Filter Dropdown
// const FilterSelect = ({ label, value, options, onChange }) => (
//   <div className="flex flex-col gap-1.5 min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       {label}
//     </span>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt === "all" ? `All ${label}s` : opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // COMPONENT: Detail Row for Drawer
// const DetailRow = ({ icon, label, value, sub }) => (
//   <div className="flex gap-5">
//     <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//         {label}
//       </p>
//       <p className="text-base font-bold text-slate-800 leading-snug">{value}</p>
//       {sub && (
//         <p className="text-xs font-bold text-blue-500/70 mt-0.5">{sub}</p>
//       )}
//     </div>
//   </div>
// );

// // COMPONENT: Status Badge
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: {
//       bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
//       icon: <CheckCircle2 size={12} />,
//       label: "Accepted",
//     },
//     rejected: {
//       bg: "bg-rose-50 text-rose-600 border-rose-100",
//       icon: <XCircle size={12} />,
//       label: "Rejected",
//     },
//     sent: {
//       bg: "bg-amber-50 text-amber-600 border-amber-100",
//       icon: <Clock size={12} />,
//       label: "Pending",
//     },
//   };
//   const current = styles[status];
//   return (
//     <div className="flex flex-col gap-1">
//       <div
//         className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}
//       >
//         {current.icon} {current.label}
//       </div>
//       {date && (
//         <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 uppercase">
//           Action: {date}
//         </span>
//       )}
//     </div>
//   );
// };

// export default InvitationTracker;
//***************************************************************************************** */
// import React, { useState } from 'react';
// import { Mail, CheckCircle2, XCircle, Clock, Search, ExternalLink, X, Briefcase, GraduationCap, ChevronLeft, ChevronRight, User } from 'lucide-react';

// const InvitationTracker = () => {
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const itemsPerPage = 8;

//  const invitations = [
//   {
//     id: 1, name: "Arjun Mehta", email: "arjun.m@tech.com", sentDate: "Jan 24, 2026", status: "accepted", responseDate: "Jan 25, 2026",
//     position: "Senior Frontend Lead", experience: "6 Years", education: "B.Tech Computer Science",
//     location: { city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400001", country: "India" }
//   },
//   {
//     id: 2, name: "Sara Khan", email: "sara.k@design.io", sentDate: "Jan 23, 2026", status: "rejected", responseDate: "Jan 23, 2026",
//     position: "Product Designer", experience: "4 Years", education: "B.Des UI/UX",
//     location: { city: "Delhi", district: "South Delhi", state: "Delhi", pincode: "110017", country: "India" }
//   },
//   {
//     id: 3, name: "Michael Chen", email: "m.chen@dev.net", sentDate: "Jan 26, 2026", status: "sent", responseDate: null,
//     position: "Backend Engineer", experience: "5 Years", education: "M.Tech Software Engineering",
//     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560001", country: "India" }
//   },
//   {
//     id: 4, name: "Vinayak Arjun", email: "vinayak@company.com", sentDate: "Jan 26, 2026", status: "accepted", responseDate: "Jan 27, 2026",
//     position: "HR Manager", experience: "7 Years", education: "MBA HR",
//     location: { city: "Pune", district: "Pune", state: "Maharashtra", pincode: "411001", country: "India" }
//   },
//   {
//     id: 5, name: "Riya Sharma", email: "riya@uiux.com", sentDate: "Jan 25, 2026", status: "sent", responseDate: null,
//     position: "UI/UX Designer", experience: "3 Years", education: "BFA Design",
//     location: { city: "Jaipur", district: "Jaipur", state: "Rajasthan", pincode: "302001", country: "India" }
//   },
//   {
//     id: 6, name: "Rahul Singh", email: "rahul@devops.io", sentDate: "Jan 24, 2026", status: "rejected", responseDate: "Jan 24, 2026",
//     position: "DevOps Engineer", experience: "8 Years", education: "B.Tech IT",
//     location: { city: "Noida", district: "Gautam Buddha Nagar", state: "Uttar Pradesh", pincode: "201301", country: "India" }
//   },
//   {
//     id: 7, name: "Amit Patel", email: "amit@cloud.io", sentDate: "Jan 22, 2026", status: "sent", responseDate: null,
//     position: "Cloud Engineer", experience: "5 Years", education: "B.Tech Computer Science",
//     location: { city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India" }
//   },
//   {
//     id: 8, name: "Neha Verma", email: "neha@qa.com", sentDate: "Jan 21, 2026", status: "accepted", responseDate: "Jan 22, 2026",
//     position: "QA Analyst", experience: "2 Years", education: "B.Sc IT",
//     location: { city: "Indore", district: "Indore", state: "Madhya Pradesh", pincode: "452001", country: "India" }
//   },
//   {
//     id: 9, name: "Karan Malhotra", email: "karan@mobile.dev", sentDate: "Jan 20, 2026", status: "sent", responseDate: null,
//     position: "Mobile App Developer", experience: "4 Years", education: "B.Tech CS",
//     location: { city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pincode: "160017", country: "India" }
//   },
//   {
//     id: 10, name: "Priya Desai", email: "priya@finance.com", sentDate: "Jan 19, 2026", status: "rejected", responseDate: "Jan 19, 2026",
//     position: "Finance Analyst", experience: "3 Years", education: "MBA Finance",
//     location: { city: "Surat", district: "Surat", state: "Gujarat", pincode: "395003", country: "India" }
//   },
//   {
//     id: 11, name: "Rohit Joshi", email: "rohit@data.ai", sentDate: "Jan 18, 2026", status: "sent", responseDate: null,
//     position: "Data Scientist", experience: "6 Years", education: "M.Sc Data Science",
//     location: { city: "Hyderabad", district: "Hyderabad", state: "Telangana", pincode: "500001", country: "India" }
//   },
//   {
//     id: 12, name: "Anjali Kapoor", email: "anjali@hr.com", sentDate: "Jan 17, 2026", status: "accepted", responseDate: "Jan 18, 2026",
//     position: "HR Executive", experience: "2 Years", education: "MBA HR",
//     location: { city: "Bhopal", district: "Bhopal", state: "Madhya Pradesh", pincode: "462001", country: "India" }
//   },
//   {
//     id: 13, name: "Suresh Nair", email: "suresh@backend.io", sentDate: "Jan 16, 2026", status: "sent", responseDate: null,
//     position: "Java Developer", experience: "10 Years", education: "B.Tech CS",
//     location: { city: "Kochi", district: "Ernakulam", state: "Kerala", pincode: "682001", country: "India" }
//   },
//   {
//     id: 14, name: "Pooja Iyer", email: "pooja@test.com", sentDate: "Jan 15, 2026", status: "rejected", responseDate: "Jan 15, 2026",
//     position: "Manual Tester", experience: "3 Years", education: "BCA",
//     location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India" }
//   },
//   {
//     id: 15, name: "Aditya Rao", email: "aditya@ml.com", sentDate: "Jan 14, 2026", status: "accepted", responseDate: "Jan 15, 2026",
//     position: "ML Engineer", experience: "5 Years", education: "M.Tech AI",
//     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560102", country: "India" }
//   },

//   // ✅ AUTO GENERATED 35 USERS WITH LOCATION
//   ...Array.from({ length: 35 }).map((_, i) => ({
//     id: 16 + i,
//     name: `Candidate ${16 + i}`,
//     email: `candidate${16 + i}@mail.com`,
//     sentDate: "Jan 10, 2026",
//     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
//     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
//     position: ["Frontend Dev", "Backend Dev", "Full Stack Dev", "QA Engineer", "HR Executive"][i % 5],
//     experience: `${(i % 10) + 1} Years`,
//     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][i % 5],
//     location: {
//       city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
//       district: ["Central", "South", "North", "East", "West"][i % 5],
//       state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][i % 5],
//       pincode: `4000${i + 10}`,
//       country: "India"
//     }
//   }))
// ];

//   // LOGIC: Filter & Search
//   const filteredData = invitations.filter(inv => {
//     const matchesFilter = filter === 'all' ? true : inv.status === filter;
//     const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           inv.email.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   // LOGIC: Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[800px]">

//       {/* HEADER SECTION */}
//       <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invitation Analytics</h2>
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Management Console • {filteredData.length} Records</p>
//           </div>

//           <div className="flex flex-wrap items-center gap-4">
//             {/* Search Bar */}
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search candidate..."
//                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-64 shadow-sm"
//                 value={searchQuery}
//                 onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
//               />
//             </div>

//             {/* Filter Pills */}
//             <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-[1.2rem]">
//               {['all', 'accepted', 'rejected'].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => {setFilter(type); setCurrentPage(1);}}
//                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                     filter === type ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TABLE SECTION */}
//       <div className="flex-grow overflow-y-auto">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
//             <tr>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Name</th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Role Designation</th>
//                 <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">City</th>
//   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">State</th>
//   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Pincode</th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Delivery Date</th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status Response</th>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {currentData.map((inv) => (
//               <tr
//                 key={inv.id}
//                 className="group hover:bg-blue-50/40 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
//                 onClick={() => setSelectedCandidate(inv)}
//               >
//                 <td className="px-10 py-6">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//                       {inv.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{inv.name}</p>
//                       <p className="text-[11px] text-slate-400 font-medium tracking-tight">{inv.email}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-6 text-xs font-bold text-slate-600">{inv.position}</td>
//                 <td className="px-6 py-6 text-xs font-bold text-slate-600">
//   {inv.location.city}
// </td>

// <td className="px-6 py-6 text-xs font-bold text-slate-600">
//   {inv.location.state}
// </td>

// <td className="px-6 py-6 text-xs font-bold text-slate-500">
//   {inv.location.pincode}
// </td>

//                 <td className="px-6 py-6 text-[11px] font-bold text-slate-400">{inv.sentDate}</td>
//                 <td className="px-6 py-6"><StatusBadge status={inv.status} date={inv.responseDate} /></td>
//                 <td className="px-10 py-6 text-right">
//                   <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100">
//                     <ExternalLink size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredData.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
//             <Search size={48} className="mb-4 text-slate-300" />
//             <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No Records Found</p>
//           </div>
//         )}
//       </div>

//       {/* PAGINATION FOOTER */}
//       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//             Page {currentPage} of {totalPages}
//            </span>
//         </div>

//         <div className="flex gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
//           >
//             <ChevronLeft size={14} /> Previous
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
//           >
//             Next <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* --- SIDE DRAWER (DETAIL MODAL) --- */}
//       {selectedCandidate && (
//         <>
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300" onClick={() => setSelectedCandidate(null)} />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col">

//             {/* Drawer Header */}
//             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
//               <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-100">
//                 <User size={24} />
//               </div>
//               <button onClick={() => setSelectedCandidate(null)} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-200 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Drawer Content */}
//             <div className="p-10 space-y-10 flex-grow overflow-y-auto">
//               <div>
//                 <h3 className="text-3xl font-black text-slate-800 leading-none tracking-tight">{selectedCandidate.name}</h3>
//                 <p className="text-blue-600 font-bold mt-3 flex items-center gap-2 text-sm italic">
//                   <Mail size={14} /> {selectedCandidate.email}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-8">
//                 <InfoBlock icon={<Briefcase size={18} className="text-blue-500"/>} label="Professional Role" value={selectedCandidate.position} subValue={`${selectedCandidate.experience} Experience`} />
//                 <InfoBlock icon={<GraduationCap size={18} className="text-indigo-500"/>} label="Academic Credentials" value={selectedCandidate.education} />
//                 <InfoBlock icon={<Clock size={18} className="text-amber-500"/>} label="Invitation Timeline" value={`Sent on ${selectedCandidate.sentDate}`} subValue={selectedCandidate.responseDate ? `Responded on ${selectedCandidate.responseDate}` : 'Awaiting candidate response'} />
//               </div>

//               <div className="pt-8 space-y-3">
//                 <button className="w-full py-5 bg-slate-900 text-white rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95">
//                   Download Full Dossier
//                 </button>
//                 <button onClick={() => setSelectedCandidate(null)} className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-200/50">
//                   Close Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // HELPER: Info Display Block
// const InfoBlock = ({ icon, label, value, subValue }) => (
//   <div className="flex gap-5">
//     <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//       <p className="text-base font-bold text-slate-800 leading-tight">{value}</p>
//       {subValue && <p className="text-xs font-medium text-slate-400 mt-1">{subValue}</p>}
//     </div>
//   </div>
// );

// // HELPER: Status Badge
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Accepted" },
//     rejected: { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={12} />, label: "Rejected" },
//     sent: { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} />, label: "Pending" }
//   };
//   const current = styles[status];
//   return (
//     <div className="flex flex-col gap-1">
//       <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}>
//         {current.icon} {current.label}
//       </div>
//       {date && <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 leading-none uppercase">Action: {date}</span>}
//     </div>
//   );
// };

// export default InvitationTracker;
//**************************************************working code********************************************* */
// import React, { useState } from 'react';
// import { Mail, CheckCircle2, XCircle, Clock, Search, ExternalLink, X, Briefcase, GraduationCap, ChevronLeft, ChevronRight, User } from 'lucide-react';

// const InvitationTracker = () => {
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const itemsPerPage = 8;

//  const invitations = [
//   {
//     id: 1, name: "Arjun Mehta", email: "arjun.m@tech.com", sentDate: "Jan 24, 2026", status: "accepted", responseDate: "Jan 25, 2026",
//     position: "Senior Frontend Lead", experience: "6 Years", education: "B.Tech Computer Science",
//     location: { city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400001", country: "India" }
//   },
//   {
//     id: 2, name: "Sara Khan", email: "sara.k@design.io", sentDate: "Jan 23, 2026", status: "rejected", responseDate: "Jan 23, 2026",
//     position: "Product Designer", experience: "4 Years", education: "B.Des UI/UX",
//     location: { city: "Delhi", district: "South Delhi", state: "Delhi", pincode: "110017", country: "India" }
//   },
//   {
//     id: 3, name: "Michael Chen", email: "m.chen@dev.net", sentDate: "Jan 26, 2026", status: "sent", responseDate: null,
//     position: "Backend Engineer", experience: "5 Years", education: "M.Tech Software Engineering",
//     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560001", country: "India" }
//   },
//   {
//     id: 4, name: "Vinayak Arjun", email: "vinayak@company.com", sentDate: "Jan 26, 2026", status: "accepted", responseDate: "Jan 27, 2026",
//     position: "HR Manager", experience: "7 Years", education: "MBA HR",
//     location: { city: "Pune", district: "Pune", state: "Maharashtra", pincode: "411001", country: "India" }
//   },
//   {
//     id: 5, name: "Riya Sharma", email: "riya@uiux.com", sentDate: "Jan 25, 2026", status: "sent", responseDate: null,
//     position: "UI/UX Designer", experience: "3 Years", education: "BFA Design",
//     location: { city: "Jaipur", district: "Jaipur", state: "Rajasthan", pincode: "302001", country: "India" }
//   },
//   {
//     id: 6, name: "Rahul Singh", email: "rahul@devops.io", sentDate: "Jan 24, 2026", status: "rejected", responseDate: "Jan 24, 2026",
//     position: "DevOps Engineer", experience: "8 Years", education: "B.Tech IT",
//     location: { city: "Noida", district: "Gautam Buddha Nagar", state: "Uttar Pradesh", pincode: "201301", country: "India" }
//   },
//   {
//     id: 7, name: "Amit Patel", email: "amit@cloud.io", sentDate: "Jan 22, 2026", status: "sent", responseDate: null,
//     position: "Cloud Engineer", experience: "5 Years", education: "B.Tech Computer Science",
//     location: { city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India" }
//   },
//   {
//     id: 8, name: "Neha Verma", email: "neha@qa.com", sentDate: "Jan 21, 2026", status: "accepted", responseDate: "Jan 22, 2026",
//     position: "QA Analyst", experience: "2 Years", education: "B.Sc IT",
//     location: { city: "Indore", district: "Indore", state: "Madhya Pradesh", pincode: "452001", country: "India" }
//   },
//   {
//     id: 9, name: "Karan Malhotra", email: "karan@mobile.dev", sentDate: "Jan 20, 2026", status: "sent", responseDate: null,
//     position: "Mobile App Developer", experience: "4 Years", education: "B.Tech CS",
//     location: { city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pincode: "160017", country: "India" }
//   },
//   {
//     id: 10, name: "Priya Desai", email: "priya@finance.com", sentDate: "Jan 19, 2026", status: "rejected", responseDate: "Jan 19, 2026",
//     position: "Finance Analyst", experience: "3 Years", education: "MBA Finance",
//     location: { city: "Surat", district: "Surat", state: "Gujarat", pincode: "395003", country: "India" }
//   },
//   {
//     id: 11, name: "Rohit Joshi", email: "rohit@data.ai", sentDate: "Jan 18, 2026", status: "sent", responseDate: null,
//     position: "Data Scientist", experience: "6 Years", education: "M.Sc Data Science",
//     location: { city: "Hyderabad", district: "Hyderabad", state: "Telangana", pincode: "500001", country: "India" }
//   },
//   {
//     id: 12, name: "Anjali Kapoor", email: "anjali@hr.com", sentDate: "Jan 17, 2026", status: "accepted", responseDate: "Jan 18, 2026",
//     position: "HR Executive", experience: "2 Years", education: "MBA HR",
//     location: { city: "Bhopal", district: "Bhopal", state: "Madhya Pradesh", pincode: "462001", country: "India" }
//   },
//   {
//     id: 13, name: "Suresh Nair", email: "suresh@backend.io", sentDate: "Jan 16, 2026", status: "sent", responseDate: null,
//     position: "Java Developer", experience: "10 Years", education: "B.Tech CS",
//     location: { city: "Kochi", district: "Ernakulam", state: "Kerala", pincode: "682001", country: "India" }
//   },
//   {
//     id: 14, name: "Pooja Iyer", email: "pooja@test.com", sentDate: "Jan 15, 2026", status: "rejected", responseDate: "Jan 15, 2026",
//     position: "Manual Tester", experience: "3 Years", education: "BCA",
//     location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India" }
//   },
//   {
//     id: 15, name: "Aditya Rao", email: "aditya@ml.com", sentDate: "Jan 14, 2026", status: "accepted", responseDate: "Jan 15, 2026",
//     position: "ML Engineer", experience: "5 Years", education: "M.Tech AI",
//     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560102", country: "India" }
//   },

//   // ✅ AUTO GENERATED 35 USERS WITH LOCATION
//   ...Array.from({ length: 35 }).map((_, i) => ({
//     id: 16 + i,
//     name: `Candidate ${16 + i}`,
//     email: `candidate${16 + i}@mail.com`,
//     sentDate: "Jan 10, 2026",
//     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
//     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
//     position: ["Frontend Dev", "Backend Dev", "Full Stack Dev", "QA Engineer", "HR Executive"][i % 5],
//     experience: `${(i % 10) + 1} Years`,
//     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][i % 5],
//     location: {
//       city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
//       district: ["Central", "South", "North", "East", "West"][i % 5],
//       state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][i % 5],
//       pincode: `4000${i + 10}`,
//       country: "India"
//     }
//   }))
// ];

//   // LOGIC: Filter & Search
//   const filteredData = invitations.filter(inv => {
//     const matchesFilter = filter === 'all' ? true : inv.status === filter;
//     const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           inv.email.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   // LOGIC: Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[800px]">

//       {/* HEADER SECTION */}
//       <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invitation Analytics</h2>
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Management Console • {filteredData.length} Records</p>
//           </div>

//           <div className="flex flex-wrap items-center gap-4">
//             {/* Search Bar */}
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search candidate..."
//                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-64 shadow-sm"
//                 value={searchQuery}
//                 onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
//               />
//             </div>

//             {/* Filter Pills */}
//             <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-[1.2rem]">
//               {['all', 'accepted', 'rejected'].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => {setFilter(type); setCurrentPage(1);}}
//                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                     filter === type ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TABLE SECTION */}
//       <div className="flex-grow overflow-y-auto">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
//             <tr>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Name</th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Role Designation</th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Delivery Date</th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status Response</th>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {currentData.map((inv) => (
//               <tr
//                 key={inv.id}
//                 className="group hover:bg-blue-50/40 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
//                 onClick={() => setSelectedCandidate(inv)}
//               >
//                 <td className="px-10 py-6">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//                       {inv.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{inv.name}</p>
//                       <p className="text-[11px] text-slate-400 font-medium tracking-tight">{inv.email}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-6 text-xs font-bold text-slate-600">{inv.position}</td>
//                 <td className="px-6 py-6 text-[11px] font-bold text-slate-400">{inv.sentDate}</td>
//                 <td className="px-6 py-6"><StatusBadge status={inv.status} date={inv.responseDate} /></td>
//                 <td className="px-10 py-6 text-right">
//                   <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100">
//                     <ExternalLink size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredData.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
//             <Search size={48} className="mb-4 text-slate-300" />
//             <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No Records Found</p>
//           </div>
//         )}
//       </div>

//       {/* PAGINATION FOOTER */}
//       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//             Page {currentPage} of {totalPages}
//            </span>
//         </div>

//         <div className="flex gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
//           >
//             <ChevronLeft size={14} /> Previous
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
//           >
//             Next <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* --- SIDE DRAWER (DETAIL MODAL) --- */}
//       {selectedCandidate && (
//         <>
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300" onClick={() => setSelectedCandidate(null)} />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col">

//             {/* Drawer Header */}
//             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
//               <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-100">
//                 <User size={24} />
//               </div>
//               <button onClick={() => setSelectedCandidate(null)} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-200 transition-all">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Drawer Content */}
//             <div className="p-10 space-y-10 flex-grow overflow-y-auto">
//               <div>
//                 <h3 className="text-3xl font-black text-slate-800 leading-none tracking-tight">{selectedCandidate.name}</h3>
//                 <p className="text-blue-600 font-bold mt-3 flex items-center gap-2 text-sm italic">
//                   <Mail size={14} /> {selectedCandidate.email}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-8">
//                 <InfoBlock icon={<Briefcase size={18} className="text-blue-500"/>} label="Professional Role" value={selectedCandidate.position} subValue={`${selectedCandidate.experience} Experience`} />
//                 <InfoBlock icon={<GraduationCap size={18} className="text-indigo-500"/>} label="Academic Credentials" value={selectedCandidate.education} />
//                 <InfoBlock icon={<Clock size={18} className="text-amber-500"/>} label="Invitation Timeline" value={`Sent on ${selectedCandidate.sentDate}`} subValue={selectedCandidate.responseDate ? `Responded on ${selectedCandidate.responseDate}` : 'Awaiting candidate response'} />
//               </div>

//               <div className="pt-8 space-y-3">
//                 <button className="w-full py-5 bg-slate-900 text-white rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95">
//                   Download Full Dossier
//                 </button>
//                 <button onClick={() => setSelectedCandidate(null)} className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-200/50">
//                   Close Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // HELPER: Info Display Block
// const InfoBlock = ({ icon, label, value, subValue }) => (
//   <div className="flex gap-5">
//     <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//       <p className="text-base font-bold text-slate-800 leading-tight">{value}</p>
//       {subValue && <p className="text-xs font-medium text-slate-400 mt-1">{subValue}</p>}
//     </div>
//   </div>
// );

// // HELPER: Status Badge
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Accepted" },
//     rejected: { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={12} />, label: "Rejected" },
//     sent: { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} />, label: "Pending" }
//   };
//   const current = styles[status];
//   return (
//     <div className="flex flex-col gap-1">
//       <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}>
//         {current.icon} {current.label}
//       </div>
//       {date && <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 leading-none uppercase">Action: {date}</span>}
//     </div>
//   );
// };

// export default InvitationTracker;
//**************************************************working code ***************************************************** */
// import React, { useState } from 'react';
// import { Mail, CheckCircle2, XCircle, Clock, Filter, Search, MoreHorizontal, ExternalLink } from 'lucide-react';

// const InvitationTracker = () => {
//   const [filter, setFilter] = useState('all'); // 'all', 'accepted', 'rejected'

//   // Sample Enterprise Data
//  const invitations = [
//   { id: 1, name: "Arjun Mehta", email: "arjun.m@tech.com", sentDate: "Jan 24, 2026", status: "accepted", responseDate: "Jan 25, 2026", position: "Senior Frontend Lead", experience: "6 Years", education: "B.Tech Computer Science" },
//   { id: 2, name: "Sara Khan", email: "sara.k@design.io", sentDate: "Jan 23, 2026", status: "rejected", responseDate: "Jan 23, 2026", position: "Product Designer", experience: "4 Years", education: "B.Des UI/UX" },
//   { id: 3, name: "Michael Chen", email: "m.chen@dev.net", sentDate: "Jan 26, 2026", status: "sent", responseDate: null, position: "Backend Engineer", experience: "5 Years", education: "M.Tech Software Engineering" },

//   { id: 4, name: "Vinayak Arjun", email: "vinayak@company.com", sentDate: "Jan 26, 2026", status: "accepted", responseDate: "Jan 27, 2026", position: "HR Manager", experience: "7 Years", education: "MBA HR" },
//   { id: 5, name: "Riya Sharma", email: "riya@uiux.com", sentDate: "Jan 25, 2026", status: "sent", responseDate: null, position: "UI/UX Designer", experience: "3 Years", education: "BFA Design" },
//   { id: 6, name: "Rahul Singh", email: "rahul@devops.io", sentDate: "Jan 24, 2026", status: "rejected", responseDate: "Jan 24, 2026", position: "DevOps Engineer", experience: "8 Years", education: "B.Tech IT" },
//   { id: 7, name: "Amit Patel", email: "amit@cloud.io", sentDate: "Jan 22, 2026", status: "sent", responseDate: null, position: "Cloud Engineer", experience: "5 Years", education: "B.Tech Computer Science" },
//   { id: 8, name: "Neha Verma", email: "neha@qa.com", sentDate: "Jan 21, 2026", status: "accepted", responseDate: "Jan 22, 2026", position: "QA Analyst", experience: "2 Years", education: "B.Sc IT" },
//   { id: 9, name: "Karan Malhotra", email: "karan@mobile.dev", sentDate: "Jan 20, 2026", status: "sent", responseDate: null, position: "Mobile App Developer", experience: "4 Years", education: "B.Tech CS" },
//   { id: 10, name: "Priya Desai", email: "priya@finance.com", sentDate: "Jan 19, 2026", status: "rejected", responseDate: "Jan 19, 2026", position: "Finance Analyst", experience: "3 Years", education: "MBA Finance" },

//   // ---- 40 MORE ----
//   { id: 11, name: "Rohit Joshi", email: "rohit@data.ai", sentDate: "Jan 18, 2026", status: "sent", responseDate: null, position: "Data Scientist", experience: "6 Years", education: "M.Sc Data Science" },
//   { id: 12, name: "Anjali Kapoor", email: "anjali@hr.com", sentDate: "Jan 17, 2026", status: "accepted", responseDate: "Jan 18, 2026", position: "HR Executive", experience: "2 Years", education: "MBA HR" },
//   { id: 13, name: "Suresh Nair", email: "suresh@backend.io", sentDate: "Jan 16, 2026", status: "sent", responseDate: null, position: "Java Developer", experience: "10 Years", education: "B.Tech CS" },
//   { id: 14, name: "Pooja Iyer", email: "pooja@test.com", sentDate: "Jan 15, 2026", status: "rejected", responseDate: "Jan 15, 2026", position: "Manual Tester", experience: "3 Years", education: "BCA" },
//   { id: 15, name: "Aditya Rao", email: "aditya@ml.com", sentDate: "Jan 14, 2026", status: "accepted", responseDate: "Jan 15, 2026", position: "ML Engineer", experience: "5 Years", education: "M.Tech AI" },

//   // Auto generate pattern till 50
//   ...Array.from({ length: 35 }).map((_, i) => ({
//     id: 16 + i,
//     name: `Candidate ${16 + i}`,
//     email: `candidate${16 + i}@mail.com`,
//     sentDate: "Jan 10, 2026",
//     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
//     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
//     position: ["Frontend Dev", "Backend Dev", "Full Stack Dev", "QA Engineer", "HR Executive"][i % 5],
//     experience: `${(i % 10) + 1} Years`,
//     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][i % 5]
//   }))
// ];

//   const filteredData = invitations.filter(inv =>
//     filter === 'all' ? true : inv.status === filter
//   );

//   return (
//     <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
//       {/* Header & Filter Controls */}
//       <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-black text-slate-800 tracking-tight">Invitation Analytics</h2>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Track Mail Delivery & Candidate Intent</p>
//         </div>

//         <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
//           {['all', 'accepted', 'rejected'].map((type) => (
//             <button
//               key={type}
//               onClick={() => setFilter(type)}
//               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                 filter === type
//                 ? 'bg-slate-900 text-white shadow-lg'
//                 : 'text-slate-400 hover:text-slate-600'
//               }`}
//             >
//               {type}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-slate-50/50">
//               <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Recipient</th>
//               <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Position</th>
//               <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Sent On</th>
//               <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
//               <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {filteredData.map((inv) => (
//               <tr key={inv.id} className="group hover:bg-slate-50/80 transition-colors">
//                 <td className="px-8 py-5">
//                   <div className="flex items-center gap-3">
//                     <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
//                       <Mail size={16} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-800">{inv.name}</p>
//                       <p className="text-[11px] text-slate-400 font-medium">{inv.email}</p>
//                     </div>
//                   </div>
//                 </td>

//                 <td className="px-4 py-5">
//                   <span className="text-xs font-bold text-slate-600">{inv.position}</span>
//                 </td>

//                 <td className="px-4 py-5 text-xs font-bold text-slate-400">
//                   {inv.sentDate}
//                 </td>

//                 <td className="px-4 py-5">
//                   <StatusBadge status={inv.status} date={inv.responseDate} />
//                 </td>

//                 <td className="px-8 py-5 text-right">
//                   <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
//                     <ExternalLink size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredData.length === 0 && (
//           <div className="py-20 text-center">
//             <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
//               <Search size={32} />
//             </div>
//             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching invitations found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Sub-component for Status Badges
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: {
//       bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
//       icon: <CheckCircle2 size={12} />,
//       label: "Accepted"
//     },
//     rejected: {
//       bg: "bg-rose-50 text-rose-600 border-rose-100",
//       icon: <XCircle size={12} />,
//       label: "Rejected"
//     },
//     sent: {
//       bg: "bg-amber-50 text-amber-600 border-amber-100",
//       icon: <Clock size={12} />,
//       label: "Pending"
//     }
//   };

//   const current = styles[status];

//   return (
//     <div className="flex flex-col gap-1">
//       <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase w-fit ${current.bg}`}>
//         {current.icon}
//         {current.label}
//       </div>
//       {date && <span className="text-[9px] font-bold text-slate-400 ml-1">on {date}</span>}
//     </div>
//   );
// };

// export default InvitationTracker;

//*********************************************************************************************************** */

// import React, { useState, useMemo } from "react";
// import {
//   Mail,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Search,
//   ExternalLink,
//   X,
//   Briefcase,
//   GraduationCap,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Eye,
//   MapPin,
//   Filter,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// const InvitationTracker = () => {
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const navigate = useNavigate();

//   // New Filters State
//   const [posFilter, setPosFilter] = useState("all");
//   const [expFilter, setExpFilter] = useState("all");
//   const [eduFilter, setEduFilter] = useState("all");
//   const [stateFilter, setStateFilter] = useState("all");

//   const itemsPerPage = 8;

//   const invitations = [
//     {
//       id: 1,
//       name: "Arjun Mehta",
//       email: "arjun.m@tech.com",
//       sentDate: "Jan 24, 2026",
//       status: "accepted",
//       responseDate: "Jan 25, 2026",
//       position: "Senior Frontend Lead",
//       experience: "6 Years",
//       education: "B.Tech Computer Science",
//       location: {
//         city: "Mumbai",
//         district: "Mumbai Suburban",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//       },
//     },
//     {
//       id: 2,
//       name: "Sara Khan",
//       email: "sara.k@design.io",
//       sentDate: "Jan 23, 2026",
//       status: "rejected",
//       responseDate: "Jan 23, 2026",
//       position: "Product Designer",
//       experience: "4 Years",
//       education: "B.Des UI/UX",
//       location: {
//         city: "Delhi",
//         district: "South Delhi",
//         state: "Delhi",
//         pincode: "110017",
//         country: "India",
//       },
//     },
//     {
//       id: 3,
//       name: "Michael Chen",
//       email: "m.chen@dev.net",
//       sentDate: "Jan 26, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "Backend Engineer",
//       experience: "5 Years",
//       education: "M.Tech Software Engineering",
//       location: {
//         city: "Bangalore",
//         district: "Bangalore Urban",
//         state: "Karnataka",
//         pincode: "560001",
//         country: "India",
//       },
//     },
//     {
//       id: 4,
//       name: "Vinayak Arjun",
//       email: "vinayak@company.com",
//       sentDate: "Jan 26, 2026",
//       status: "accepted",
//       responseDate: "Jan 27, 2026",
//       position: "HR Manager",
//       experience: "7 Years",
//       education: "MBA HR",
//       location: {
//         city: "Pune",
//         district: "Pune",
//         state: "Maharashtra",
//         pincode: "411001",
//         country: "India",
//       },
//     },
//     {
//       id: 5,
//       name: "Riya Sharma",
//       email: "riya@uiux.com",
//       sentDate: "Jan 25, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "UI/UX Designer",
//       experience: "3 Years",
//       education: "BFA Design",
//       location: {
//         city: "Jaipur",
//         district: "Jaipur",
//         state: "Rajasthan",
//         pincode: "302001",
//         country: "India",
//       },
//     },
//     {
//       id: 6,
//       name: "Rahul Singh",
//       email: "rahul@devops.io",
//       sentDate: "Jan 24, 2026",
//       status: "rejected",
//       responseDate: "Jan 24, 2026",
//       position: "DevOps Engineer",
//       experience: "8 Years",
//       education: "B.Tech IT",
//       location: {
//         city: "Noida",
//         district: "Gautam Buddha Nagar",
//         state: "Uttar Pradesh",
//         pincode: "201301",
//         country: "India",
//       },
//     },
//     {
//       id: 7,
//       name: "Amit Patel",
//       email: "amit@cloud.io",
//       sentDate: "Jan 22, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "Cloud Engineer",
//       experience: "5 Years",
//       education: "B.Tech Computer Science",
//       location: {
//         city: "Ahmedabad",
//         district: "Ahmedabad",
//         state: "Gujarat",
//         pincode: "380001",
//         country: "India",
//       },
//     },
//     {
//       id: 8,
//       name: "Neha Verma",
//       email: "neha@qa.com",
//       sentDate: "Jan 21, 2026",
//       status: "accepted",
//       responseDate: "Jan 22, 2026",
//       position: "QA Analyst",
//       experience: "2 Years",
//       education: "B.Sc IT",
//       location: {
//         city: "Indore",
//         district: "Indore",
//         state: "Madhya Pradesh",
//         pincode: "452001",
//         country: "India",
//       },
//     },
//     {
//       id: 9,
//       name: "Karan Malhotra",
//       email: "karan@mobile.dev",
//       sentDate: "Jan 20, 2026",
//       status: "sent",
//       responseDate: null,
//       position: "Mobile App Developer",
//       experience: "4 Years",
//       education: "B.Tech CS",
//       location: {
//         city: "Chandigarh",
//         district: "Chandigarh",
//         state: "Chandigarh",
//         pincode: "160017",
//         country: "India",
//       },
//     },
//     {
//       id: 10,
//       name: "Priya Desai",
//       email: "priya@finance.com",
//       sentDate: "Jan 19, 2026",
//       status: "rejected",
//       responseDate: "Jan 19, 2026",
//       position: "Finance Analyst",
//       experience: "3 Years",
//       education: "MBA Finance",
//       location: {
//         city: "Surat",
//         district: "Surat",
//         state: "Gujarat",
//         pincode: "395003",
//         country: "India",
//       },
//     },
//     ...Array.from({ length: 40 }).map((_, i) => ({
//       id: 11 + i,
//       name: `Candidate ${11 + i}`,
//       email: `candidate${11 + i}@mail.com`,
//       sentDate: "Jan 10, 2026",
//       status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
//       responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
//       position: [
//         "Frontend Dev",
//         "Backend Dev",
//         "Full Stack Dev",
//         "QA Engineer",
//         "HR Executive",
//       ][i % 5],
//       experience: `${(i % 10) + 1} Years`,
//       education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][
//         i % 5
//       ],
//       location: {
//         city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
//         state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][
//           i % 5
//         ],
//         pincode: `4000${i + 10}`,
//         country: "India",
//       },
//     })),
//   ];

//   // LOGIC: Dynamic Filter Options
//   const positions = ["all", ...new Set(invitations.map((i) => i.position))];
//   const experiences = ["all", ...new Set(invitations.map((i) => i.experience))];
//   const educations = ["all", ...new Set(invitations.map((i) => i.education))];
//   const states = ["all", ...new Set(invitations.map((i) => i.location.state))];

//   // LOGIC: Global Filtering
//   const filteredData = useMemo(() => {
//     return invitations.filter((inv) => {
//       const matchesSearch =
//         inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         inv.email.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesStatus = filter === "all" || inv.status === filter;
//       const matchesPos = posFilter === "all" || inv.position === posFilter;
//       const matchesExp = expFilter === "all" || inv.experience === expFilter;
//       const matchesEdu = eduFilter === "all" || inv.education === eduFilter;
//       const matchesState =
//         stateFilter === "all" || inv.location.state === stateFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesPos &&
//         matchesExp &&
//         matchesEdu &&
//         matchesState
//       );
//     });
//   }, [searchQuery, filter, posFilter, expFilter, eduFilter, stateFilter]);

//   // LOGIC: Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   return (
//     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[850px]">
//       {/* HEADER & GLOBAL FILTERS */}
//       <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">
//               Invitation Analytics
//             </h2>
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
//               Enterprise HR Console • {filteredData.length} Candidates
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search name or email..."
//                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//             <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
//               {["all", "accepted", "rejected"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => {
//                     setFilter(t);
//                     setCurrentPage(1);
//                   }}
//                   className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ADVANCED FILTER ROW */}
//         <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-200/50">
//           <FilterSelect
//             label="Position"
//             value={posFilter}
//             options={positions}
//             onChange={setPosFilter}
//           />
//           <FilterSelect
//             label="Experience"
//             value={expFilter}
//             options={experiences}
//             onChange={setExpFilter}
//           />
//           <FilterSelect
//             label="Education"
//             value={eduFilter}
//             options={educations}
//             onChange={setEduFilter}
//           />
//           <FilterSelect
//             label="State"
//             value={stateFilter}
//             options={states}
//             onChange={setStateFilter}
//           />
//           {(posFilter !== "all" ||
//             expFilter !== "all" ||
//             eduFilter !== "all" ||
//             stateFilter !== "all") && (
//             <button
//               onClick={() => {
//                 setPosFilter("all");
//                 setExpFilter("all");
//                 setEduFilter("all");
//                 setStateFilter("all");
//               }}
//               className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
//             >
//               Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* TABLE SECTION */}
//       <div className="flex-grow overflow-y-auto">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
//             <tr>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Candidate
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Location
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Designation
//               </th>
//               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
//                 Status
//               </th>
//               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {currentData.map((inv) => (
//               <tr
//                 key={inv.id}
//                 className="group hover:bg-slate-50 transition-all border-l-4 border-l-transparent hover:border-l-blue-600"
//               >
//                 <td className="px-10 py-6">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
//                       {inv.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-800">
//                         {inv.name}
//                       </p>
//                       <p className="text-[11px] text-slate-400 font-medium">
//                         {inv.email}
//                       </p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-6">
//                   <p className="text-xs font-bold text-slate-600">
//                     {inv.location.city}
//                   </p>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase">
//                     {inv.location.state}
//                   </p>
//                 </td>
//                 <td className="px-6 py-6 text-xs font-bold text-slate-600">
//                   {inv.position}
//                 </td>
//                 <td className="px-6 py-6">
//                   <StatusBadge status={inv.status} date={inv.responseDate} />
//                 </td>
//                 <td className="px-10 py-6 text-right">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => setSelectedCandidate(inv)}
//                       className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                       title="View Details"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // prevent row click modal
//                         navigate(`/invitation/${inv.id}`);
//                       }}
//                       className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shadow-sm"
//                       title="Redirect to Profile"
//                     >
//                       <ExternalLink size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION FOOTER */}
//       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//           Page {currentPage} of {totalPages}
//         </span>
//         <div className="flex gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             <ChevronLeft size={14} /> Prev
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
//           >
//             Next <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* SIDE DRAWER */}
//       {selectedCandidate && (
//         <>
//           <div
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
//             onClick={() => setSelectedCandidate(null)}
//           />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col p-10">
//             <div className="flex justify-between items-start mb-10">
//               <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-100">
//                 {selectedCandidate.name.charAt(0)}
//               </div>
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-10 overflow-y-auto pr-4">
//               <div>
//                 <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
//                   {selectedCandidate.name}
//                 </h3>
//                 <p className="text-blue-600 font-bold mt-4 text-sm">
//                   {selectedCandidate.email}
//                 </p>
//               </div>

//               <div className="space-y-8">
//                 <DetailRow
//                   icon={<Briefcase size={18} />}
//                   label="Position & Experience"
//                   value={selectedCandidate.position}
//                   sub={selectedCandidate.experience}
//                 />
//                 <DetailRow
//                   icon={<GraduationCap size={18} />}
//                   label="Highest Qualification"
//                   value={selectedCandidate.education}
//                 />
//                 <DetailRow
//                   icon={<MapPin size={18} />}
//                   label="Location Details"
//                   value={`${selectedCandidate.location.city}, ${selectedCandidate.location.state}`}
//                   sub={`Pincode: ${selectedCandidate.location.pincode}`}
//                 />
//                 <DetailRow
//                   icon={<Clock size={18} />}
//                   label="Timeline"
//                   value={`Invited: ${selectedCandidate.sentDate}`}
//                   sub={
//                     selectedCandidate.responseDate
//                       ? `Response: ${selectedCandidate.responseDate}`
//                       : "Awaiting response..."
//                   }
//                 />
//               </div>

//               <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200">
//                 Confirm Engagement
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // COMPONENT: Custom Filter Dropdown
// const FilterSelect = ({ label, value, options, onChange }) => (
//   <div className="flex flex-col gap-1.5 min-w-[140px]">
//     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
//       {label}
//     </span>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm hover:border-slate-300"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt === "all" ? `All ${label}s` : opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // COMPONENT: Detail Row for Drawer
// const DetailRow = ({ icon, label, value, sub }) => (
//   <div className="flex gap-5">
//     <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
//       {icon}
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
//         {label}
//       </p>
//       <p className="text-base font-bold text-slate-800 leading-snug">{value}</p>
//       {sub && (
//         <p className="text-xs font-bold text-blue-500/70 mt-0.5">{sub}</p>
//       )}
//     </div>
//   </div>
// );

// // COMPONENT: Status Badge
// const StatusBadge = ({ status, date }) => {
//   const styles = {
//     accepted: {
//       bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
//       icon: <CheckCircle2 size={12} />,
//       label: "Accepted",
//     },
//     rejected: {
//       bg: "bg-rose-50 text-rose-600 border-rose-100",
//       icon: <XCircle size={12} />,
//       label: "Rejected",
//     },
//     sent: {
//       bg: "bg-amber-50 text-amber-600 border-amber-100",
//       icon: <Clock size={12} />,
//       label: "Pending",
//     },
//   };
//   const current = styles[status];
//   return (
//     <div className="flex flex-col gap-1">
//       <div
//         className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}
//       >
//         {current.icon} {current.label}
//       </div>
//       {date && (
//         <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 uppercase">
//           Action: {date}
//         </span>
//       )}
//     </div>
//   );
// };

// export default InvitationTracker;
// //***************************************************************************************** */
// // import React, { useState } from 'react';
// // import { Mail, CheckCircle2, XCircle, Clock, Search, ExternalLink, X, Briefcase, GraduationCap, ChevronLeft, ChevronRight, User } from 'lucide-react';

// // const InvitationTracker = () => {
// //   const [filter, setFilter] = useState('all');
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedCandidate, setSelectedCandidate] = useState(null);

// //   const itemsPerPage = 8;

// //  const invitations = [
// //   {
// //     id: 1, name: "Arjun Mehta", email: "arjun.m@tech.com", sentDate: "Jan 24, 2026", status: "accepted", responseDate: "Jan 25, 2026",
// //     position: "Senior Frontend Lead", experience: "6 Years", education: "B.Tech Computer Science",
// //     location: { city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400001", country: "India" }
// //   },
// //   {
// //     id: 2, name: "Sara Khan", email: "sara.k@design.io", sentDate: "Jan 23, 2026", status: "rejected", responseDate: "Jan 23, 2026",
// //     position: "Product Designer", experience: "4 Years", education: "B.Des UI/UX",
// //     location: { city: "Delhi", district: "South Delhi", state: "Delhi", pincode: "110017", country: "India" }
// //   },
// //   {
// //     id: 3, name: "Michael Chen", email: "m.chen@dev.net", sentDate: "Jan 26, 2026", status: "sent", responseDate: null,
// //     position: "Backend Engineer", experience: "5 Years", education: "M.Tech Software Engineering",
// //     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560001", country: "India" }
// //   },
// //   {
// //     id: 4, name: "Vinayak Arjun", email: "vinayak@company.com", sentDate: "Jan 26, 2026", status: "accepted", responseDate: "Jan 27, 2026",
// //     position: "HR Manager", experience: "7 Years", education: "MBA HR",
// //     location: { city: "Pune", district: "Pune", state: "Maharashtra", pincode: "411001", country: "India" }
// //   },
// //   {
// //     id: 5, name: "Riya Sharma", email: "riya@uiux.com", sentDate: "Jan 25, 2026", status: "sent", responseDate: null,
// //     position: "UI/UX Designer", experience: "3 Years", education: "BFA Design",
// //     location: { city: "Jaipur", district: "Jaipur", state: "Rajasthan", pincode: "302001", country: "India" }
// //   },
// //   {
// //     id: 6, name: "Rahul Singh", email: "rahul@devops.io", sentDate: "Jan 24, 2026", status: "rejected", responseDate: "Jan 24, 2026",
// //     position: "DevOps Engineer", experience: "8 Years", education: "B.Tech IT",
// //     location: { city: "Noida", district: "Gautam Buddha Nagar", state: "Uttar Pradesh", pincode: "201301", country: "India" }
// //   },
// //   {
// //     id: 7, name: "Amit Patel", email: "amit@cloud.io", sentDate: "Jan 22, 2026", status: "sent", responseDate: null,
// //     position: "Cloud Engineer", experience: "5 Years", education: "B.Tech Computer Science",
// //     location: { city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India" }
// //   },
// //   {
// //     id: 8, name: "Neha Verma", email: "neha@qa.com", sentDate: "Jan 21, 2026", status: "accepted", responseDate: "Jan 22, 2026",
// //     position: "QA Analyst", experience: "2 Years", education: "B.Sc IT",
// //     location: { city: "Indore", district: "Indore", state: "Madhya Pradesh", pincode: "452001", country: "India" }
// //   },
// //   {
// //     id: 9, name: "Karan Malhotra", email: "karan@mobile.dev", sentDate: "Jan 20, 2026", status: "sent", responseDate: null,
// //     position: "Mobile App Developer", experience: "4 Years", education: "B.Tech CS",
// //     location: { city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pincode: "160017", country: "India" }
// //   },
// //   {
// //     id: 10, name: "Priya Desai", email: "priya@finance.com", sentDate: "Jan 19, 2026", status: "rejected", responseDate: "Jan 19, 2026",
// //     position: "Finance Analyst", experience: "3 Years", education: "MBA Finance",
// //     location: { city: "Surat", district: "Surat", state: "Gujarat", pincode: "395003", country: "India" }
// //   },
// //   {
// //     id: 11, name: "Rohit Joshi", email: "rohit@data.ai", sentDate: "Jan 18, 2026", status: "sent", responseDate: null,
// //     position: "Data Scientist", experience: "6 Years", education: "M.Sc Data Science",
// //     location: { city: "Hyderabad", district: "Hyderabad", state: "Telangana", pincode: "500001", country: "India" }
// //   },
// //   {
// //     id: 12, name: "Anjali Kapoor", email: "anjali@hr.com", sentDate: "Jan 17, 2026", status: "accepted", responseDate: "Jan 18, 2026",
// //     position: "HR Executive", experience: "2 Years", education: "MBA HR",
// //     location: { city: "Bhopal", district: "Bhopal", state: "Madhya Pradesh", pincode: "462001", country: "India" }
// //   },
// //   {
// //     id: 13, name: "Suresh Nair", email: "suresh@backend.io", sentDate: "Jan 16, 2026", status: "sent", responseDate: null,
// //     position: "Java Developer", experience: "10 Years", education: "B.Tech CS",
// //     location: { city: "Kochi", district: "Ernakulam", state: "Kerala", pincode: "682001", country: "India" }
// //   },
// //   {
// //     id: 14, name: "Pooja Iyer", email: "pooja@test.com", sentDate: "Jan 15, 2026", status: "rejected", responseDate: "Jan 15, 2026",
// //     position: "Manual Tester", experience: "3 Years", education: "BCA",
// //     location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India" }
// //   },
// //   {
// //     id: 15, name: "Aditya Rao", email: "aditya@ml.com", sentDate: "Jan 14, 2026", status: "accepted", responseDate: "Jan 15, 2026",
// //     position: "ML Engineer", experience: "5 Years", education: "M.Tech AI",
// //     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560102", country: "India" }
// //   },

// //   // ✅ AUTO GENERATED 35 USERS WITH LOCATION
// //   ...Array.from({ length: 35 }).map((_, i) => ({
// //     id: 16 + i,
// //     name: `Candidate ${16 + i}`,
// //     email: `candidate${16 + i}@mail.com`,
// //     sentDate: "Jan 10, 2026",
// //     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
// //     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
// //     position: ["Frontend Dev", "Backend Dev", "Full Stack Dev", "QA Engineer", "HR Executive"][i % 5],
// //     experience: `${(i % 10) + 1} Years`,
// //     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][i % 5],
// //     location: {
// //       city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
// //       district: ["Central", "South", "North", "East", "West"][i % 5],
// //       state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][i % 5],
// //       pincode: `4000${i + 10}`,
// //       country: "India"
// //     }
// //   }))
// // ];

// //   // LOGIC: Filter & Search
// //   const filteredData = invitations.filter(inv => {
// //     const matchesFilter = filter === 'all' ? true : inv.status === filter;
// //     const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                           inv.email.toLowerCase().includes(searchQuery.toLowerCase());
// //     return matchesFilter && matchesSearch;
// //   });

// //   // LOGIC: Pagination
// //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
// //   const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[800px]">

// //       {/* HEADER SECTION */}
// //       <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50">
// //         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
// //           <div>
// //             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invitation Analytics</h2>
// //             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Management Console • {filteredData.length} Records</p>
// //           </div>

// //           <div className="flex flex-wrap items-center gap-4">
// //             {/* Search Bar */}
// //             <div className="relative group">
// //               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
// //               <input
// //                 type="text"
// //                 placeholder="Search candidate..."
// //                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-64 shadow-sm"
// //                 value={searchQuery}
// //                 onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
// //               />
// //             </div>

// //             {/* Filter Pills */}
// //             <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-[1.2rem]">
// //               {['all', 'accepted', 'rejected'].map((type) => (
// //                 <button
// //                   key={type}
// //                   onClick={() => {setFilter(type); setCurrentPage(1);}}
// //                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
// //                     filter === type ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
// //                   }`}
// //                 >
// //                   {type}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* TABLE SECTION */}
// //       <div className="flex-grow overflow-y-auto">
// //         <table className="w-full border-collapse">
// //           <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
// //             <tr>
// //               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Name</th>
// //               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Role Designation</th>
// //                 <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">City</th>
// //   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">State</th>
// //   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Pincode</th>
// //               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Delivery Date</th>
// //               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status Response</th>
// //               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-slate-100">
// //             {currentData.map((inv) => (
// //               <tr
// //                 key={inv.id}
// //                 className="group hover:bg-blue-50/40 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
// //                 onClick={() => setSelectedCandidate(inv)}
// //               >
// //                 <td className="px-10 py-6">
// //                   <div className="flex items-center gap-4">
// //                     <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
// //                       {inv.name.charAt(0)}
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{inv.name}</p>
// //                       <p className="text-[11px] text-slate-400 font-medium tracking-tight">{inv.email}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="px-6 py-6 text-xs font-bold text-slate-600">{inv.position}</td>
// //                 <td className="px-6 py-6 text-xs font-bold text-slate-600">
// //   {inv.location.city}
// // </td>

// // <td className="px-6 py-6 text-xs font-bold text-slate-600">
// //   {inv.location.state}
// // </td>

// // <td className="px-6 py-6 text-xs font-bold text-slate-500">
// //   {inv.location.pincode}
// // </td>

// //                 <td className="px-6 py-6 text-[11px] font-bold text-slate-400">{inv.sentDate}</td>
// //                 <td className="px-6 py-6"><StatusBadge status={inv.status} date={inv.responseDate} /></td>
// //                 <td className="px-10 py-6 text-right">
// //                   <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100">
// //                     <ExternalLink size={16} />
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         {filteredData.length === 0 && (
// //           <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
// //             <Search size={48} className="mb-4 text-slate-300" />
// //             <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No Records Found</p>
// //           </div>
// //         )}
// //       </div>

// //       {/* PAGINATION FOOTER */}
// //       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
// //         <div className="flex items-center gap-4">
// //            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
// //             Page {currentPage} of {totalPages}
// //            </span>
// //         </div>

// //         <div className="flex gap-3">
// //           <button
// //             disabled={currentPage === 1}
// //             onClick={() => setCurrentPage(prev => prev - 1)}
// //             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
// //           >
// //             <ChevronLeft size={14} /> Previous
// //           </button>
// //           <button
// //             disabled={currentPage === totalPages}
// //             onClick={() => setCurrentPage(prev => prev + 1)}
// //             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
// //           >
// //             Next <ChevronRight size={14} />
// //           </button>
// //         </div>
// //       </div>

// //       {/* --- SIDE DRAWER (DETAIL MODAL) --- */}
// //       {selectedCandidate && (
// //         <>
// //           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300" onClick={() => setSelectedCandidate(null)} />
// //           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col">

// //             {/* Drawer Header */}
// //             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
// //               <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-100">
// //                 <User size={24} />
// //               </div>
// //               <button onClick={() => setSelectedCandidate(null)} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-200 transition-all">
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             {/* Drawer Content */}
// //             <div className="p-10 space-y-10 flex-grow overflow-y-auto">
// //               <div>
// //                 <h3 className="text-3xl font-black text-slate-800 leading-none tracking-tight">{selectedCandidate.name}</h3>
// //                 <p className="text-blue-600 font-bold mt-3 flex items-center gap-2 text-sm italic">
// //                   <Mail size={14} /> {selectedCandidate.email}
// //                 </p>
// //               </div>

// //               <div className="grid grid-cols-1 gap-8">
// //                 <InfoBlock icon={<Briefcase size={18} className="text-blue-500"/>} label="Professional Role" value={selectedCandidate.position} subValue={`${selectedCandidate.experience} Experience`} />
// //                 <InfoBlock icon={<GraduationCap size={18} className="text-indigo-500"/>} label="Academic Credentials" value={selectedCandidate.education} />
// //                 <InfoBlock icon={<Clock size={18} className="text-amber-500"/>} label="Invitation Timeline" value={`Sent on ${selectedCandidate.sentDate}`} subValue={selectedCandidate.responseDate ? `Responded on ${selectedCandidate.responseDate}` : 'Awaiting candidate response'} />
// //               </div>

// //               <div className="pt-8 space-y-3">
// //                 <button className="w-full py-5 bg-slate-900 text-white rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95">
// //                   Download Full Dossier
// //                 </button>
// //                 <button onClick={() => setSelectedCandidate(null)} className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-200/50">
// //                   Close Preview
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // // HELPER: Info Display Block
// // const InfoBlock = ({ icon, label, value, subValue }) => (
// //   <div className="flex gap-5">
// //     <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
// //       {icon}
// //     </div>
// //     <div>
// //       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
// //       <p className="text-base font-bold text-slate-800 leading-tight">{value}</p>
// //       {subValue && <p className="text-xs font-medium text-slate-400 mt-1">{subValue}</p>}
// //     </div>
// //   </div>
// // );

// // // HELPER: Status Badge
// // const StatusBadge = ({ status, date }) => {
// //   const styles = {
// //     accepted: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Accepted" },
// //     rejected: { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={12} />, label: "Rejected" },
// //     sent: { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} />, label: "Pending" }
// //   };
// //   const current = styles[status];
// //   return (
// //     <div className="flex flex-col gap-1">
// //       <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}>
// //         {current.icon} {current.label}
// //       </div>
// //       {date && <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 leading-none uppercase">Action: {date}</span>}
// //     </div>
// //   );
// // };

// // export default InvitationTracker;
// //**************************************************working code********************************************* */
// // import React, { useState } from 'react';
// // import { Mail, CheckCircle2, XCircle, Clock, Search, ExternalLink, X, Briefcase, GraduationCap, ChevronLeft, ChevronRight, User } from 'lucide-react';

// // const InvitationTracker = () => {
// //   const [filter, setFilter] = useState('all');
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedCandidate, setSelectedCandidate] = useState(null);

// //   const itemsPerPage = 8;

// //  const invitations = [
// //   {
// //     id: 1, name: "Arjun Mehta", email: "arjun.m@tech.com", sentDate: "Jan 24, 2026", status: "accepted", responseDate: "Jan 25, 2026",
// //     position: "Senior Frontend Lead", experience: "6 Years", education: "B.Tech Computer Science",
// //     location: { city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400001", country: "India" }
// //   },
// //   {
// //     id: 2, name: "Sara Khan", email: "sara.k@design.io", sentDate: "Jan 23, 2026", status: "rejected", responseDate: "Jan 23, 2026",
// //     position: "Product Designer", experience: "4 Years", education: "B.Des UI/UX",
// //     location: { city: "Delhi", district: "South Delhi", state: "Delhi", pincode: "110017", country: "India" }
// //   },
// //   {
// //     id: 3, name: "Michael Chen", email: "m.chen@dev.net", sentDate: "Jan 26, 2026", status: "sent", responseDate: null,
// //     position: "Backend Engineer", experience: "5 Years", education: "M.Tech Software Engineering",
// //     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560001", country: "India" }
// //   },
// //   {
// //     id: 4, name: "Vinayak Arjun", email: "vinayak@company.com", sentDate: "Jan 26, 2026", status: "accepted", responseDate: "Jan 27, 2026",
// //     position: "HR Manager", experience: "7 Years", education: "MBA HR",
// //     location: { city: "Pune", district: "Pune", state: "Maharashtra", pincode: "411001", country: "India" }
// //   },
// //   {
// //     id: 5, name: "Riya Sharma", email: "riya@uiux.com", sentDate: "Jan 25, 2026", status: "sent", responseDate: null,
// //     position: "UI/UX Designer", experience: "3 Years", education: "BFA Design",
// //     location: { city: "Jaipur", district: "Jaipur", state: "Rajasthan", pincode: "302001", country: "India" }
// //   },
// //   {
// //     id: 6, name: "Rahul Singh", email: "rahul@devops.io", sentDate: "Jan 24, 2026", status: "rejected", responseDate: "Jan 24, 2026",
// //     position: "DevOps Engineer", experience: "8 Years", education: "B.Tech IT",
// //     location: { city: "Noida", district: "Gautam Buddha Nagar", state: "Uttar Pradesh", pincode: "201301", country: "India" }
// //   },
// //   {
// //     id: 7, name: "Amit Patel", email: "amit@cloud.io", sentDate: "Jan 22, 2026", status: "sent", responseDate: null,
// //     position: "Cloud Engineer", experience: "5 Years", education: "B.Tech Computer Science",
// //     location: { city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India" }
// //   },
// //   {
// //     id: 8, name: "Neha Verma", email: "neha@qa.com", sentDate: "Jan 21, 2026", status: "accepted", responseDate: "Jan 22, 2026",
// //     position: "QA Analyst", experience: "2 Years", education: "B.Sc IT",
// //     location: { city: "Indore", district: "Indore", state: "Madhya Pradesh", pincode: "452001", country: "India" }
// //   },
// //   {
// //     id: 9, name: "Karan Malhotra", email: "karan@mobile.dev", sentDate: "Jan 20, 2026", status: "sent", responseDate: null,
// //     position: "Mobile App Developer", experience: "4 Years", education: "B.Tech CS",
// //     location: { city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pincode: "160017", country: "India" }
// //   },
// //   {
// //     id: 10, name: "Priya Desai", email: "priya@finance.com", sentDate: "Jan 19, 2026", status: "rejected", responseDate: "Jan 19, 2026",
// //     position: "Finance Analyst", experience: "3 Years", education: "MBA Finance",
// //     location: { city: "Surat", district: "Surat", state: "Gujarat", pincode: "395003", country: "India" }
// //   },
// //   {
// //     id: 11, name: "Rohit Joshi", email: "rohit@data.ai", sentDate: "Jan 18, 2026", status: "sent", responseDate: null,
// //     position: "Data Scientist", experience: "6 Years", education: "M.Sc Data Science",
// //     location: { city: "Hyderabad", district: "Hyderabad", state: "Telangana", pincode: "500001", country: "India" }
// //   },
// //   {
// //     id: 12, name: "Anjali Kapoor", email: "anjali@hr.com", sentDate: "Jan 17, 2026", status: "accepted", responseDate: "Jan 18, 2026",
// //     position: "HR Executive", experience: "2 Years", education: "MBA HR",
// //     location: { city: "Bhopal", district: "Bhopal", state: "Madhya Pradesh", pincode: "462001", country: "India" }
// //   },
// //   {
// //     id: 13, name: "Suresh Nair", email: "suresh@backend.io", sentDate: "Jan 16, 2026", status: "sent", responseDate: null,
// //     position: "Java Developer", experience: "10 Years", education: "B.Tech CS",
// //     location: { city: "Kochi", district: "Ernakulam", state: "Kerala", pincode: "682001", country: "India" }
// //   },
// //   {
// //     id: 14, name: "Pooja Iyer", email: "pooja@test.com", sentDate: "Jan 15, 2026", status: "rejected", responseDate: "Jan 15, 2026",
// //     position: "Manual Tester", experience: "3 Years", education: "BCA",
// //     location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India" }
// //   },
// //   {
// //     id: 15, name: "Aditya Rao", email: "aditya@ml.com", sentDate: "Jan 14, 2026", status: "accepted", responseDate: "Jan 15, 2026",
// //     position: "ML Engineer", experience: "5 Years", education: "M.Tech AI",
// //     location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka", pincode: "560102", country: "India" }
// //   },

// //   // ✅ AUTO GENERATED 35 USERS WITH LOCATION
// //   ...Array.from({ length: 35 }).map((_, i) => ({
// //     id: 16 + i,
// //     name: `Candidate ${16 + i}`,
// //     email: `candidate${16 + i}@mail.com`,
// //     sentDate: "Jan 10, 2026",
// //     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
// //     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
// //     position: ["Frontend Dev", "Backend Dev", "Full Stack Dev", "QA Engineer", "HR Executive"][i % 5],
// //     experience: `${(i % 10) + 1} Years`,
// //     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][i % 5],
// //     location: {
// //       city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
// //       district: ["Central", "South", "North", "East", "West"][i % 5],
// //       state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][i % 5],
// //       pincode: `4000${i + 10}`,
// //       country: "India"
// //     }
// //   }))
// // ];

// //   // LOGIC: Filter & Search
// //   const filteredData = invitations.filter(inv => {
// //     const matchesFilter = filter === 'all' ? true : inv.status === filter;
// //     const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                           inv.email.toLowerCase().includes(searchQuery.toLowerCase());
// //     return matchesFilter && matchesSearch;
// //   });

// //   // LOGIC: Pagination
// //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
// //   const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="relative w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[800px]">

// //       {/* HEADER SECTION */}
// //       <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50">
// //         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
// //           <div>
// //             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Invitation Analytics</h2>
// //             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Management Console • {filteredData.length} Records</p>
// //           </div>

// //           <div className="flex flex-wrap items-center gap-4">
// //             {/* Search Bar */}
// //             <div className="relative group">
// //               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
// //               <input
// //                 type="text"
// //                 placeholder="Search candidate..."
// //                 className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-64 shadow-sm"
// //                 value={searchQuery}
// //                 onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
// //               />
// //             </div>

// //             {/* Filter Pills */}
// //             <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-[1.2rem]">
// //               {['all', 'accepted', 'rejected'].map((type) => (
// //                 <button
// //                   key={type}
// //                   onClick={() => {setFilter(type); setCurrentPage(1);}}
// //                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
// //                     filter === type ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
// //                   }`}
// //                 >
// //                   {type}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* TABLE SECTION */}
// //       <div className="flex-grow overflow-y-auto">
// //         <table className="w-full border-collapse">
// //           <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
// //             <tr>
// //               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Candidate Name</th>
// //               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Role Designation</th>
// //               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Delivery Date</th>
// //               <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status Response</th>
// //               <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-slate-100">
// //             {currentData.map((inv) => (
// //               <tr
// //                 key={inv.id}
// //                 className="group hover:bg-blue-50/40 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
// //                 onClick={() => setSelectedCandidate(inv)}
// //               >
// //                 <td className="px-10 py-6">
// //                   <div className="flex items-center gap-4">
// //                     <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
// //                       {inv.name.charAt(0)}
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{inv.name}</p>
// //                       <p className="text-[11px] text-slate-400 font-medium tracking-tight">{inv.email}</p>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td className="px-6 py-6 text-xs font-bold text-slate-600">{inv.position}</td>
// //                 <td className="px-6 py-6 text-[11px] font-bold text-slate-400">{inv.sentDate}</td>
// //                 <td className="px-6 py-6"><StatusBadge status={inv.status} date={inv.responseDate} /></td>
// //                 <td className="px-10 py-6 text-right">
// //                   <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100">
// //                     <ExternalLink size={16} />
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         {filteredData.length === 0 && (
// //           <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
// //             <Search size={48} className="mb-4 text-slate-300" />
// //             <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No Records Found</p>
// //           </div>
// //         )}
// //       </div>

// //       {/* PAGINATION FOOTER */}
// //       <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
// //         <div className="flex items-center gap-4">
// //            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
// //             Page {currentPage} of {totalPages}
// //            </span>
// //         </div>

// //         <div className="flex gap-3">
// //           <button
// //             disabled={currentPage === 1}
// //             onClick={() => setCurrentPage(prev => prev - 1)}
// //             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
// //           >
// //             <ChevronLeft size={14} /> Previous
// //           </button>
// //           <button
// //             disabled={currentPage === totalPages}
// //             onClick={() => setCurrentPage(prev => prev + 1)}
// //             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
// //           >
// //             Next <ChevronRight size={14} />
// //           </button>
// //         </div>
// //       </div>

// //       {/* --- SIDE DRAWER (DETAIL MODAL) --- */}
// //       {selectedCandidate && (
// //         <>
// //           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300" onClick={() => setSelectedCandidate(null)} />
// //           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100 animate-in slide-in-from-right duration-500 flex flex-col">

// //             {/* Drawer Header */}
// //             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
// //               <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-100">
// //                 <User size={24} />
// //               </div>
// //               <button onClick={() => setSelectedCandidate(null)} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-200 transition-all">
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             {/* Drawer Content */}
// //             <div className="p-10 space-y-10 flex-grow overflow-y-auto">
// //               <div>
// //                 <h3 className="text-3xl font-black text-slate-800 leading-none tracking-tight">{selectedCandidate.name}</h3>
// //                 <p className="text-blue-600 font-bold mt-3 flex items-center gap-2 text-sm italic">
// //                   <Mail size={14} /> {selectedCandidate.email}
// //                 </p>
// //               </div>

// //               <div className="grid grid-cols-1 gap-8">
// //                 <InfoBlock icon={<Briefcase size={18} className="text-blue-500"/>} label="Professional Role" value={selectedCandidate.position} subValue={`${selectedCandidate.experience} Experience`} />
// //                 <InfoBlock icon={<GraduationCap size={18} className="text-indigo-500"/>} label="Academic Credentials" value={selectedCandidate.education} />
// //                 <InfoBlock icon={<Clock size={18} className="text-amber-500"/>} label="Invitation Timeline" value={`Sent on ${selectedCandidate.sentDate}`} subValue={selectedCandidate.responseDate ? `Responded on ${selectedCandidate.responseDate}` : 'Awaiting candidate response'} />
// //               </div>

// //               <div className="pt-8 space-y-3">
// //                 <button className="w-full py-5 bg-slate-900 text-white rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95">
// //                   Download Full Dossier
// //                 </button>
// //                 <button onClick={() => setSelectedCandidate(null)} className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-200/50">
// //                   Close Preview
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // // HELPER: Info Display Block
// // const InfoBlock = ({ icon, label, value, subValue }) => (
// //   <div className="flex gap-5">
// //     <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
// //       {icon}
// //     </div>
// //     <div>
// //       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
// //       <p className="text-base font-bold text-slate-800 leading-tight">{value}</p>
// //       {subValue && <p className="text-xs font-medium text-slate-400 mt-1">{subValue}</p>}
// //     </div>
// //   </div>
// // );

// // // HELPER: Status Badge
// // const StatusBadge = ({ status, date }) => {
// //   const styles = {
// //     accepted: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} />, label: "Accepted" },
// //     rejected: { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={12} />, label: "Rejected" },
// //     sent: { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} />, label: "Pending" }
// //   };
// //   const current = styles[status];
// //   return (
// //     <div className="flex flex-col gap-1">
// //       <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase w-fit shadow-sm ${current.bg}`}>
// //         {current.icon} {current.label}
// //       </div>
// //       {date && <span className="text-[9px] font-bold text-slate-400/80 tracking-tight ml-1 leading-none uppercase">Action: {date}</span>}
// //     </div>
// //   );
// // };

// // export default InvitationTracker;
// //**************************************************working code ***************************************************** */
// // import React, { useState } from 'react';
// // import { Mail, CheckCircle2, XCircle, Clock, Filter, Search, MoreHorizontal, ExternalLink } from 'lucide-react';

// // const InvitationTracker = () => {
// //   const [filter, setFilter] = useState('all'); // 'all', 'accepted', 'rejected'

// //   // Sample Enterprise Data
// //  const invitations = [
// //   { id: 1, name: "Arjun Mehta", email: "arjun.m@tech.com", sentDate: "Jan 24, 2026", status: "accepted", responseDate: "Jan 25, 2026", position: "Senior Frontend Lead", experience: "6 Years", education: "B.Tech Computer Science" },
// //   { id: 2, name: "Sara Khan", email: "sara.k@design.io", sentDate: "Jan 23, 2026", status: "rejected", responseDate: "Jan 23, 2026", position: "Product Designer", experience: "4 Years", education: "B.Des UI/UX" },
// //   { id: 3, name: "Michael Chen", email: "m.chen@dev.net", sentDate: "Jan 26, 2026", status: "sent", responseDate: null, position: "Backend Engineer", experience: "5 Years", education: "M.Tech Software Engineering" },

// //   { id: 4, name: "Vinayak Arjun", email: "vinayak@company.com", sentDate: "Jan 26, 2026", status: "accepted", responseDate: "Jan 27, 2026", position: "HR Manager", experience: "7 Years", education: "MBA HR" },
// //   { id: 5, name: "Riya Sharma", email: "riya@uiux.com", sentDate: "Jan 25, 2026", status: "sent", responseDate: null, position: "UI/UX Designer", experience: "3 Years", education: "BFA Design" },
// //   { id: 6, name: "Rahul Singh", email: "rahul@devops.io", sentDate: "Jan 24, 2026", status: "rejected", responseDate: "Jan 24, 2026", position: "DevOps Engineer", experience: "8 Years", education: "B.Tech IT" },
// //   { id: 7, name: "Amit Patel", email: "amit@cloud.io", sentDate: "Jan 22, 2026", status: "sent", responseDate: null, position: "Cloud Engineer", experience: "5 Years", education: "B.Tech Computer Science" },
// //   { id: 8, name: "Neha Verma", email: "neha@qa.com", sentDate: "Jan 21, 2026", status: "accepted", responseDate: "Jan 22, 2026", position: "QA Analyst", experience: "2 Years", education: "B.Sc IT" },
// //   { id: 9, name: "Karan Malhotra", email: "karan@mobile.dev", sentDate: "Jan 20, 2026", status: "sent", responseDate: null, position: "Mobile App Developer", experience: "4 Years", education: "B.Tech CS" },
// //   { id: 10, name: "Priya Desai", email: "priya@finance.com", sentDate: "Jan 19, 2026", status: "rejected", responseDate: "Jan 19, 2026", position: "Finance Analyst", experience: "3 Years", education: "MBA Finance" },

// //   // ---- 40 MORE ----
// //   { id: 11, name: "Rohit Joshi", email: "rohit@data.ai", sentDate: "Jan 18, 2026", status: "sent", responseDate: null, position: "Data Scientist", experience: "6 Years", education: "M.Sc Data Science" },
// //   { id: 12, name: "Anjali Kapoor", email: "anjali@hr.com", sentDate: "Jan 17, 2026", status: "accepted", responseDate: "Jan 18, 2026", position: "HR Executive", experience: "2 Years", education: "MBA HR" },
// //   { id: 13, name: "Suresh Nair", email: "suresh@backend.io", sentDate: "Jan 16, 2026", status: "sent", responseDate: null, position: "Java Developer", experience: "10 Years", education: "B.Tech CS" },
// //   { id: 14, name: "Pooja Iyer", email: "pooja@test.com", sentDate: "Jan 15, 2026", status: "rejected", responseDate: "Jan 15, 2026", position: "Manual Tester", experience: "3 Years", education: "BCA" },
// //   { id: 15, name: "Aditya Rao", email: "aditya@ml.com", sentDate: "Jan 14, 2026", status: "accepted", responseDate: "Jan 15, 2026", position: "ML Engineer", experience: "5 Years", education: "M.Tech AI" },

// //   // Auto generate pattern till 50
// //   ...Array.from({ length: 35 }).map((_, i) => ({
// //     id: 16 + i,
// //     name: `Candidate ${16 + i}`,
// //     email: `candidate${16 + i}@mail.com`,
// //     sentDate: "Jan 10, 2026",
// //     status: i % 3 === 0 ? "accepted" : i % 3 === 1 ? "rejected" : "sent",
// //     responseDate: i % 3 === 2 ? null : "Jan 11, 2026",
// //     position: ["Frontend Dev", "Backend Dev", "Full Stack Dev", "QA Engineer", "HR Executive"][i % 5],
// //     experience: `${(i % 10) + 1} Years`,
// //     education: ["B.Tech CS", "MCA", "MBA HR", "B.Sc IT", "M.Tech Software"][i % 5]
// //   }))
// // ];

// //   const filteredData = invitations.filter(inv =>
// //     filter === 'all' ? true : inv.status === filter
// //   );

// //   return (
// //     <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
// //       {/* Header & Filter Controls */}
// //       <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
// //         <div>
// //           <h2 className="text-xl font-black text-slate-800 tracking-tight">Invitation Analytics</h2>
// //           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Track Mail Delivery & Candidate Intent</p>
// //         </div>

// //         <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
// //           {['all', 'accepted', 'rejected'].map((type) => (
// //             <button
// //               key={type}
// //               onClick={() => setFilter(type)}
// //               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
// //                 filter === type
// //                 ? 'bg-slate-900 text-white shadow-lg'
// //                 : 'text-slate-400 hover:text-slate-600'
// //               }`}
// //             >
// //               {type}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Table Section */}
// //       <div className="overflow-x-auto">
// //         <table className="w-full border-collapse">
// //           <thead>
// //             <tr className="bg-slate-50/50">
// //               <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Recipient</th>
// //               <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Position</th>
// //               <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Sent On</th>
// //               <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
// //               <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-slate-100">
// //             {filteredData.map((inv) => (
// //               <tr key={inv.id} className="group hover:bg-slate-50/80 transition-colors">
// //                 <td className="px-8 py-5">
// //                   <div className="flex items-center gap-3">
// //                     <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
// //                       <Mail size={16} />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-bold text-slate-800">{inv.name}</p>
// //                       <p className="text-[11px] text-slate-400 font-medium">{inv.email}</p>
// //                     </div>
// //                   </div>
// //                 </td>

// //                 <td className="px-4 py-5">
// //                   <span className="text-xs font-bold text-slate-600">{inv.position}</span>
// //                 </td>

// //                 <td className="px-4 py-5 text-xs font-bold text-slate-400">
// //                   {inv.sentDate}
// //                 </td>

// //                 <td className="px-4 py-5">
// //                   <StatusBadge status={inv.status} date={inv.responseDate} />
// //                 </td>

// //                 <td className="px-8 py-5 text-right">
// //                   <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
// //                     <ExternalLink size={16} />
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         {filteredData.length === 0 && (
// //           <div className="py-20 text-center">
// //             <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
// //               <Search size={32} />
// //             </div>
// //             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching invitations found</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // // Sub-component for Status Badges
// // const StatusBadge = ({ status, date }) => {
// //   const styles = {
// //     accepted: {
// //       bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
// //       icon: <CheckCircle2 size={12} />,
// //       label: "Accepted"
// //     },
// //     rejected: {
// //       bg: "bg-rose-50 text-rose-600 border-rose-100",
// //       icon: <XCircle size={12} />,
// //       label: "Rejected"
// //     },
// //     sent: {
// //       bg: "bg-amber-50 text-amber-600 border-amber-100",
// //       icon: <Clock size={12} />,
// //       label: "Pending"
// //     }
// //   };

// //   const current = styles[status];

// //   return (
// //     <div className="flex flex-col gap-1">
// //       <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase w-fit ${current.bg}`}>
// //         {current.icon}
// //         {current.label}
// //       </div>
// //       {date && <span className="text-[9px] font-bold text-slate-400 ml-1">on {date}</span>}
// //     </div>
// //   );
// // };

// // export default InvitationTracker;
