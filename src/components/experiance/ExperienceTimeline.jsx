import { Briefcase, Calendar, MapPin, User } from "lucide-react";

export default function ExperienceTimeline({ sortedExperiences }) {
  return (
    <div className="lg:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
      {sortedExperiences.length > 0 ? (
        sortedExperiences.map((exp, index) => (
          <div key={exp.id || index} className="relative pl-12 group">
            <div className="absolute left-0 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
              <span className="text-[10px] font-bold">{index + 1}</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {exp.job_title}
                  </h3>
                  <p className="text-blue-600 font-bold text-sm">
                    {exp.company_name}
                  </p>
                </div>

                <div className="bg-slate-50 px-3 py-1 rounded-lg text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Previous CTC
                  </p>
                  <p className="text-sm font-black text-slate-700">
                    ₹{(exp.previous_ctc / 100000).toFixed(2)} LPA
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                  <Calendar size={14} /> {exp.start_date} — {exp.end_date}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                  <MapPin size={14} /> {exp.location}
                </span>
              </div>

              <p className="text-sm text-slate-600 italic">
                "{exp.description}"
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="relative pl-12">
          <div className="absolute left-0 w-10 h-10 bg-slate-50 border rounded-full flex items-center justify-center">
            <Briefcase size={16} className="text-slate-400" />
          </div>

          <div className="bg-white border border-dashed border-slate-300 p-10 rounded-2xl text-center">
            <User size={32} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              No Professional Experience
            </h3>
            <p className="text-sm text-slate-500">
              Candidate is currently marked as Fresher.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
