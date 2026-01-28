// const BASE_URL = "https://emp-onbd-1.onrender.com/employees";
const BASE_URL = "http://72.62.242.223:8000/employees";

export const employeeAddressService = {
  async get(employeeId) {
    const res = await fetch(`${BASE_URL}/${employeeId}/address`);
    if (!res.ok) return null;
    return res.json();
  },

  async create(employeeId, payload) {
    const res = await fetch(`${BASE_URL}/${employeeId}/address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to add address");
    return res.json();
  },

  async update(employeeId, payload) {
    const res = await fetch(`${BASE_URL}/${employeeId}/address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update address");
    return res.json();
  },

 async verify(employeeId, payload) {
  const res = await fetch(`${BASE_URL}/${employeeId}/address/verify`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to verify address");
  }

  return res.json();
},

async uploadDocument(employeeId, documentType, file) {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${BASE_URL}/${employeeId}/documents?document_type=${documentType}`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to upload document");
  }

  return res.json();
},


};
