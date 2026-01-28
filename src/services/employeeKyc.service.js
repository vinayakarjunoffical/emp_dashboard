// const BASE_URL = "https://emp-onbd-1.onrender.com/employees";
const BASE_URL = "http://72.62.242.223:8000/employees";


export const employeeKycService = {
  // GET KYC DETAILS
  async get(employeeId) {
    const res = await fetch(`${BASE_URL}/${employeeId}/kyc`);
    if (!res.ok) return null;
    return res.json();
  },

  // CREATE / UPDATE KYC DETAILS (AADHAAR / PAN / BANK METADATA)
  async create(employeeId, payload) {
    const res = await fetch(`${BASE_URL}/${employeeId}/kyc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to save KYC details");
    }

    return res.json();
  },

  // ⬇️ UPLOAD KYC DOCUMENT FILE
  async uploadDocument(employeeId, documentType, file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${BASE_URL}/${employeeId}/documents?document_type=${documentType}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to upload document");
    }

    return res.json();
  },

  async getDocuments(employeeId) {
    const res = await fetch(`${BASE_URL}/${employeeId}/documents`);
    if (!res.ok) return [];
    return res.json();
  },

async verifyPan(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/kyc/verify-pan`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || error.message || "PAN verification failed");
  }

  return res.json();
},

async verifyBank(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/kyc/verify-bank`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || error.message || "Bank verification failed");
  }

  return res.json();
},

// ADD / UPDATE EMPLOYEE EXPERIENCE (SINGLE OR MULTIPLE)
async saveExperience(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/experiences`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to save experience");
  }

  return res.json();
},

// GET EMPLOYEE EXPERIENCE (SINGLE OR MULTIPLE)
async getExperiences(employeeId) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/experiences`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch experience");
  }

  return res.json();
},

async update(employeeId, payload) {
  const res = await fetch(`${BASE_URL}/${employeeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to update employee");
  }

  return res.json();
},

// REVISE OFFER CTC
async reviseOffer(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/revise-offer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to revise offer");
  }

  return res.json();
},

// SEND OFFER EMAIL
async sendOffer(employeeId) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/send-offer`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to send offer email");
  }

  return res.json();
},

// SEND JOINING LETTER
async sendJoiningLetter(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/send-joining-letter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to send joining letter");
  }

  return res.json();
},

// GET FULL EMPLOYEE DATA (KYC + Docs + Experience + Review)
async getFull(employeeId) {
  const res = await fetch(`${BASE_URL}/${employeeId}/full`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch full employee data");
  }

  return res.json();
},

// SEND APPOINTMENT LETTER
async sendAppointmentLetter(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/send-appointment-letter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to send appointment letter");
  }

  return res.json();
},


// ADD EMPLOYEE REVIEW (Probation / Annual / Exit etc.)
async addReview(employeeId, payload) {
  const res = await fetch(`${BASE_URL}/${employeeId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to submit review");
  }

  return res.json();
},

// GET EMPLOYEE REVIEWS
async getReviews(employeeId) {
  const res = await fetch(`${BASE_URL}/${employeeId}/reviews`);

  if (!res.ok) return [];
  return res.json();
},

// ADD / UPDATE EMPLOYEE ASSETS
async addAssets(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/${employeeId}/assets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to add assets");
  }

  return res.json();
},

// ✅ GET employee assets
  async getAssets(employeeId) {
    const res = await fetch(`${BASE_URL}/${employeeId}/assets`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to fetch assets");
    }

    return res.json();
  },

};
