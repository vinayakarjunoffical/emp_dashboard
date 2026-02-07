// const BASE_URL = "http://72.62.242.223:8000/departments";
const BASE_URL = "https://apihrr.goelectronix.co.in/departments";
// const BASE_URL = "https://emp-onbd-1.onrender.com/departments";

export const departmentService = {
  // ✅ GET all departments
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch departments");
    return res.json();
  },

  // ✅ GET department by ID (for edit)
  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch department");
    return res.json();
  },

  // ✅ CREATE department
  async create(payload) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create department");
    return res.json();
  },

  // ✅ UPDATE department
  async update(id, payload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update department");
    return res.json();
  },

  // ✅ PATCH status (active / inactive)
  async updateStatus(id, is_active) {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active }),
    });

    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },
};



// const API_URL = "https://emp-onbd-1.onrender.com/departments";

// export const departmentService = {
//   async getAll() {
//     const response = await fetch(API_URL);

//     if (!response.ok) {
//       throw new Error("Failed to fetch departments");
//     }

//     return response.json();
//   },
// };



// let departments = [
//   { id: 1, name: "Engineering", code: "ENG", description: "Tech team" },
//   { id: 2, name: "HR", code: "HR", description: "Human resources" },
//   { id: 3, name: "Sales", code: "SAL", description: "Sales department" },
//   { id: 4, name: "Accounts", code: "ACC", description: "Finance & accounts" },
// ];

// // Simulate API delay
// const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// export const departmentService = {
//   async getAll() {
//     await delay();
//     return [...departments];
//   },

//   async getById(id) {
//     await delay();
//     return departments.find(d => d.id === Number(id));
//   },

//   async create(data) {
//     await delay();
//     const newDept = {
//       id: Date.now(),
//       ...data,
//     };
//     departments.push(newDept);
//     return newDept;
//   },

//   async update(id, data) {
//     await delay();
//     departments = departments.map(d =>
//       d.id === Number(id) ? { ...d, ...data } : d
//     );
//     return true;
//   },
// };
