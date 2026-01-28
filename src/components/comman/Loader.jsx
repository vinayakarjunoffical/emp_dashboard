export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-slate-600">
        {text}
      </span>
    </div>
  );
}
