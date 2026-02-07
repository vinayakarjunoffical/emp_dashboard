// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";

export const documentSubmissionService = {

  // 📌 SUBMIT DOCUMENT (Create)
  async submit(employeeId, payload) {
    const res = await fetch(
      `${BASE_URL}/employees/${employeeId}/attendance/docs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to submit document");
    }

    return res.json();
  },


// 📌 CONFIRM JOINING (Create)
async confirmJoining(employeeId, payload) {
  const res = await fetch(
    `${BASE_URL}/employees/${employeeId}/attendance/joining`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to confirm joining");
  }

  return res.json();
},



};
