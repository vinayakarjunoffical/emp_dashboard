import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  IndianRupee, 
  ChevronLeft, 
  Share2, 
  Heart,
  ShieldCheck,
  Layers,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

const VacancyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vacancy, setVacancy] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        // STAGE 1: Fetch Vacancy Metadata
        const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
        if (!vacRes.ok) throw new Error("Vacancy node not found");
        const vacData = await vacRes.json();
        setVacancy(vacData);

        // STAGE 2: Fetch Job Description Template using the ID from vacancy
        if (vacData.job_description_id) {
          const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description_id}`);
          const jdData = await jdRes.json();
          setJobDescription(jdData);
        }
      } catch (err) {
        toast.error(err.message);
        navigate("/vacancies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decrypting Registry Node...</p>
      </div>
    );
  }

  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1";
  const valueClass = "text-sm font-bold text-slate-700 uppercase tracking-tight";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
          </button>
          {/* <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-all"><Heart size={20} /></button>
            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-500 transition-all"><Share2 size={20} /></button>
          </div> */}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT CONTENT AREA: 8 COLS */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* MAIN HEADER SECTION */}
            <section className="space-y-6 p-5">
               <div>
                 <span className={`px-3 ${{labelClass}}`}>Job Title</span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                {vacancy?.title}
              </h1>
               </div>
              
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Briefcase size={20} /></div>
                  <div>
                    <span className={labelClass}>Job Type</span>
                    <p className={valueClass}>Full Time / Permanent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Clock size={20} /></div>
                  <div>
                    <span className={labelClass}>Experience</span>
                    <p className={valueClass}>{vacancy?.experience_required || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><IndianRupee size={20} /></div>
                  <div>
                    <span className={labelClass}>Package</span>
                    <p className={valueClass}>{vacancy?.salary_range} LPA</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4 border-t border-slate-100 mt-6">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job ID: GOEX-V{vacancy?.id}</span>
                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted: {new Date(vacancy?.created_at).toLocaleDateString()}</span>
              </div>

              <button className="bg-blue-600 text-white px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                Apply for this job
              </button>
            </section>

            <hr className="border-slate-200" />

            {/* RICH TEXT CONTENT SECTIONS */}
            <div className="space-y-12 pb-10">
              {/* 1. JOB DESCRIPTION */}
              <section className="space-y-4 p-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Description</h3>
                </div>
                <div 
                  className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
                  dangerouslySetInnerHTML={{ __html: jobDescription?.content || "No overview protocol found." }}
                />
              </section>

              {/* 2. RESPONSIBILITIES */}
              <section className="space-y-4 p-5">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Responsibilities</h4>
                <div 
                  className="prose prose-slate text-slate-600 font-medium [overflow-wrap:anywhere] leading-relaxed custom-html-view"
                  dangerouslySetInnerHTML={{ __html: jobDescription?.responsibilities || "Standard operating procedures apply." }}
                />
              </section>

              {/* 3. REQUIREMENTS */}
              <section className="space-y-4 p-5">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 px-1">Prerequisite</h4>
                <div 
                  className="prose prose-slate max-w-none text-slate-600 [overflow-wrap:anywhere] font-medium leading-relaxed custom-html-view"
                  dangerouslySetInnerHTML={{ __html: jobDescription?.requirements || "No specific prerequisites listed." }}
                />
              </section>
            </div>
          </div>

          {/* RIGHT SIDEBAR: 4 COLS */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 sticky top-32">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Job Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={20}/></div>
                  <div>
                    <span className={labelClass}>Location</span>
                    <p className={valueClass}>{vacancy?.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Users size={20}/></div>
                  <div>
                    <span className={labelClass}>Total Openings</span>
                    <p className={valueClass}>{vacancy?.number_of_openings} Open Positions</p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Layers size={20}/></div>
                  <div>
                    <span className={labelClass}>Status Registry</span>
                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {vacancy?.status}
                    </p>
                  </div>
                </div> */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
    <Layers size={20}/>
  </div>
  <div>
    <span className={labelClass}>Status</span>
    {/* FIXED: Changed <p> to <div> to allow the child <div> pulse dot */}
    <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
      {vacancy?.status}
    </div>
  </div>
</div>
              </div>

              <div className="p-6 bg-blue-600 rounded-[2rem] relative overflow-hidden group">
                 <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-700" size={100} />
                 <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 relative z-10">Closing date</p>
                 <p className="text-xl font-black text-white tracking-tight relative z-10">{vacancy?.deadline_date}</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-html-view p { margin-bottom: 1rem; }
        .custom-html-view ul, .custom-html-view ol { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
        .custom-html-view li { margin-bottom: 0.5rem; }
        .custom-html-view strong { color: #0F172A; font-weight: 800; }
      `}} />
    </div>
  );
}

export default VacancyDetails;
//************************************************************************************************************** */
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const VacancyDetails = () => {
//   const { id } = useParams(); // Gets the ID from /vacancy-details/:id

//   useEffect(() => {
//     // Call your GET API: https://apihrr.goelectronix.co.in/vacancies/{id}
//     const fetchDetails = async () => {
//        const res = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//        const data = await res.json();
//        // Hydrate your UI with data.title, data.content, etc.
//     }
//     fetchDetails();
//   }, [id]);

//   return (
//     // Your Detail UI here...
//     <>
//     sdfsdf</>
//   );
// }
// export default VacancyDetails;