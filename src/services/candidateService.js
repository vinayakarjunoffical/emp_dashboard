// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";

export const candidateService = {
  // GET ALL CANDIDATES
  async getAll() {
    const res = await fetch(`${BASE_URL}/candidates`);
    if (!res.ok) throw new Error("Failed to fetch candidates");
    return res.json();
  },

  // CREATE CANDIDATE (Manual Entry)
//   async createCandidate(data) {
//     const res = await fetch(`${BASE_URL}/candidates`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) throw new Error("Failed to create candidate");
//     return res.json();
//   },
// CREATE CANDIDATE (Manual Entry)
async createCandidate(formData) {
  const res = await fetch(`${BASE_URL}/candidates`, {
    method: "POST",
    body: formData, // ✅ SEND FORMDATA DIRECTLY
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
},

async sendJD(payload) {
    const res = await fetch(`${BASE_URL}/candidates/send-jd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return res.json();
  },

    // ✅ GET CANDIDATE BY ID  ⭐⭐⭐
  async getById(id) {
    const res = await fetch(`${BASE_URL}/candidates/${id}`);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to fetch candidate");
    }

    return res.json();
  },

    // ✅ MIGRATE CANDIDATES (NEW)
 // ✅ MIGRATE CANDIDATES (NO PAYLOAD)
  async migrateCandidates() {
    const res = await fetch(`${BASE_URL}/candidates/migrate`, {
      method: "POST",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Candidate migration failed");
    }

    return res.json();
  },


};
