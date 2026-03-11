// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";

export const companyService = {
  // ✅ GET ALL COMPANIES
  async getAll() {
    const res = await fetch(`${BASE_URL}/companies`);
    if (!res.ok) throw new Error("Failed to fetch companies");
    return res.json();
  },

  // ✅ CREATE COMPANY (POST)
  async createCompany(payload) {
    const res = await fetch(`${BASE_URL}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to create company");
    }

    return res.json();
  },

  // ✅ UPDATE COMPANY (PATCH)
  async updateCompany(id, payload) {
    const res = await fetch(`${BASE_URL}/companies/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to update company");
    }

    return res.json();
  },

  // ✅ DELETE COMPANY (DELETE)
  async deleteCompany(id) {
    const res = await fetch(`${BASE_URL}/companies/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to delete company");
    }

    // Sometimes DELETE requests don't return JSON, so we handle it gracefully
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return res.json();
    } else {
      return await res.text();
    }
  },
};