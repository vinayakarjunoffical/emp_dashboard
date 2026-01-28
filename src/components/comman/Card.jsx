export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white rounded-2xl
        border border-slate-200/60
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        transition-all duration-300
        hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
