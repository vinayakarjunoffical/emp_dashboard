import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { departmentService } from "../../services/department.service";

export default function AddEditDepartment() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit) {
      departmentService.getById(id).then(data => {
        if (data) setForm(data);
      });
    }
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isEdit) {
      await departmentService.update(id, form);
    } else {
      await departmentService.create(form);
    }

    navigate("/departments");
  }

  return (
    <div className="max-w-xl bg-white border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Department" : "Add Department"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            Department Name
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Code (optional)
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-slate-900 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/departments")}
            className="border px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
