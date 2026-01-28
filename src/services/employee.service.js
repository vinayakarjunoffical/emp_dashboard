const BASE_URL = "http://72.62.242.223:8000/employees";
// const BASE_URL = "https://emp-onbd-1.onrender.com/employees";

export const employeeService = {
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch employee");
    return res.json();
  },

  // async create(payload) {
  //   const res = await fetch(BASE_URL, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!res.ok) throw new Error("Failed to create employee");
  //   return res.json();
  // },


  // async update(id, payload) {
  //   const res = await fetch(`${BASE_URL}/${id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!res.ok) throw new Error("Failed to update employee");
  //   return res.json();
  // },


  async create(payload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Extract the error message from the backend's "detail" array
      const errorMessage = data.detail?.[0]?.msg || "Failed to create employee";
      const errorField = data.detail?.[0]?.loc?.[1] || "";
      
      // Throw a clean message: e.g., "Field required: joining_date"
      throw new Error(`${errorMessage}${errorField ? ': ' + errorField : ''}`);
    }

    return data;
  },

  async update(id, payload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data.detail?.[0]?.msg || "Failed to update employee";
      throw new Error(errorMessage);
    }

    return data;
  },

  async remove(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete employee");
    return true;
  },
};
