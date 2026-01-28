import { useNavigate } from "react-router-dom";

export default function DashboardActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => navigate("/employees/add")}
        className="
          bg-slate-900 text-white
          px-5 py-2.5 rounded-lg
          text-sm font-medium
          hover:bg-slate-800
          transition
        "
      >
        + Add Employee
      </button>

      <button
        onClick={() => navigate("/employees")}
        className="
          bg-white border border-slate-300
          px-5 py-2.5 rounded-lg
          text-sm font-medium
          hover:bg-slate-100
          transition
        "
      >
        Employees
      </button>

      <button
        onClick={() => navigate("/departments")}
        className="
          bg-white border border-slate-300
          px-5 py-2.5 rounded-lg
          text-sm font-medium
          hover:bg-slate-100
          transition
        "
      >
        Departments
      </button>
    </div>
  );
}
