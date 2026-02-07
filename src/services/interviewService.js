// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";


export const interviewService = {
  async scheduleInterview(payload) {
    const res = await fetch(`${BASE_URL}/interviews/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to schedule interview");
    }

    return res.json();
  },

   // ✅ Submit Interview Review
  async submitReview(interviewId, payload) {

    const res = await fetch(
      `${BASE_URL}/interviews/${interviewId}/review`,
      {
        method: "POST", // ⚠️ change to PUT if backend requires
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to submit review");
    }

    return res.json();
  },


  // async rescheduleInterview(interviewId, payload) {
  //   const res = await fetch(
  //     `http://72.62.242.223:8000/interviews/${interviewId}/reschedule`,
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     }
  //   );

  //   if (!res.ok) {
  //     throw new Error("Failed to reschedule interview");
  //   }

  //   return res.json();
  // },

  // ✅ Reschedule Interview
  async rescheduleInterview(interviewId, payload) {
    const res = await fetch(
      `${BASE_URL}/interviews/${interviewId}/reschedule`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to reschedule interview");
    }

    return res.json();
  },

  // ✅ UPDATE ATTENDANCE STATUS (NEW)
  async updateAttendance(interviewId, payload) {
    const res = await fetch(
      `${BASE_URL}/interviews/${interviewId}/attendance`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), 
        // { attendance_status: "attended" | "no_show" }
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to update attendance");
    }

    return res.json();
  },

  

};
