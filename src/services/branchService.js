// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";

export const branchService = {
  // ✅ GET ALL BRANCHES FOR A SPECIFIC COMPANY
  async getByCompanyId(companyId) {
    const res = await fetch(`${BASE_URL}/companies/${companyId}/branches`);
    
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to fetch branches");
    }
    
    return res.json();
  },

  // ✅ CREATE BRANCH (POST) - Requires Company ID
  async createBranch(companyId, payload) {
    const res = await fetch(`${BASE_URL}/companies/${companyId}/branches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to create branch");
    }

    return res.json();
  },

  // ✅ UPDATE BRANCH (PATCH) - Requires Branch ID
  async updateBranch(branchId, payload) {
    const res = await fetch(`${BASE_URL}/companies/branches/${branchId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to update branch");
    }

    return res.json();
  },

  // ✅ DELETE BRANCH (DELETE) - Requires Branch ID
  async deleteBranch(branchId) {
    const res = await fetch(`${BASE_URL}/companies/branches/${branchId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to delete branch");
    }

    // Handle empty or text responses gracefully on delete
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      return await res.text();
    }
  },
};