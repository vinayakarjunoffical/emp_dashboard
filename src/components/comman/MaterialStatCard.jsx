import Card from "../comman/Card";

export default function MaterialStatCard({
  title,
  value,
  icon: Icon,
  percent,
  trend,
  subtitle,
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>

        {/* Value */}
        <div className="text-right">
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200/60 pt-3">
        <p className="text-sm">
          <span
            className={`font-semibold ${
              trend === "up"
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {trend === "up" ? "+" : "-"}
            {percent}%
          </span>{" "}
          <span className="text-slate-500">
            {subtitle}
          </span>
        </p>
      </div>
    </Card>
  );
}
