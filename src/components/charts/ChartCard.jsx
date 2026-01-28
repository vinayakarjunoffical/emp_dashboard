import Card from "../comman/Card";

export default function ChartCard({
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <Card className="p-5">
      {/* Chart */}
      <div className="h-[240px] mb-4">
        {children}
      </div>

      {/* Text */}
      <h3 className="text-sm font-semibold text-slate-800">
        {title}
      </h3>
      <p className="text-xs text-slate-500">
        {subtitle}
      </p>

      {footer && (
        <p className="mt-2 text-xs text-slate-400">
          {footer}
        </p>
      )}
    </Card>
  );
}
