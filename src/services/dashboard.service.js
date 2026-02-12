// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";

export const dashboardService = {

  // 📊 CANDIDATE DASHBOARD STATS (GET)
  async getCandidateStats(filters = {}) {

    const query = new URLSearchParams(filters).toString();

    const res = await fetch(
      `${BASE_URL}/dashboard/candidates/stats?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
        }
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to fetch candidate dashboard stats");
    }

    return res.json();
  },


  // // 👨‍💼 EMPLOYEE DASHBOARD STATS (Future Ready)
  // async getEmployeeStats(filters = {}) {

  //   const query = new URLSearchParams(filters).toString();

  //   const res = await fetch(
  //     `${BASE_URL}/dashboard/employees/stats?${query}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
  //       }
  //     }
  //   );

  //   if (!res.ok) {
  //     const err = await res.text();
  //     throw new Error(err || "Failed to fetch employee dashboard stats");
  //   }

  //   return res.json();
  // }

   /* =========================================================
     👨‍💼 EMPLOYEE DASHBOARD STATS
  ========================================================= */
  async getEmployeeStats(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();

      const res = await fetch(
        `${BASE_URL}/dashboard/employees/stats${query ? `?${query}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to fetch employee dashboard stats");
      }

      return await res.json();
    } catch (error) {
      console.error("Employee Stats API Error:", error);
      throw error;
    }
  },

};
