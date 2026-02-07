import { TrendingUp, Globe } from "lucide-react";

export default function SalaryInsights({
  experiences,
  avgCTC,
  lastDrawn,
  suggestedCTC,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Salary Insights
        </h3>

        <div className="space-y-6">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
              Average Historic CTC
            </p>
            <p className="text-2xl font-black">
              ₹{avgCTC.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
              Last Drawn
            </p>
            <p className="text-2xl font-black text-blue-400">
              ₹{lastDrawn.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="mt-6 bg-blue-600 rounded-2xl p-5">
            <p className="text-blue-100 text-[10px] font-bold uppercase mb-1">
              Recommended Offer
            </p>
            <p className="text-3xl font-black text-white">
              ₹{Math.round(suggestedCTC).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Globe size={16} /> Recruitment Advice
        </h4>
        <p className="text-xs text-blue-700">
          Candidate salary growth trend detected. Suggested offer maintains
          parity.
        </p>
      </div>
    </div>
  );
}
