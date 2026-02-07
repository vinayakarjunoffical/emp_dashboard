import { Briefcase, PlusCircle } from "lucide-react";
import ExperienceTimeline from "./ExperienceTimeline";
import SalaryInsights from "./SalaryInsights";

export default function ExperienceSection({
  sortedExperiences,
  experiences,
  avgCTC,
  lastDrawn,
  suggestedCTC,
  onAddExperienceClick,
}) {
  return (
    <div className="space-y-8 mt-8">
      {/* HEADER */}
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
          onClick={onAddExperienceClick}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <PlusCircle size={18} /> Add Experience
        </button>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ExperienceTimeline sortedExperiences={sortedExperiences} />
        <SalaryInsights
          experiences={experiences}
          avgCTC={avgCTC}
          lastDrawn={lastDrawn}
          suggestedCTC={suggestedCTC}
        />
      </div>
    </div>
  );
}
