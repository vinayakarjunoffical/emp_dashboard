const API_BASE = "https://apihrr.goelectronix.co.in/holidays";

// ================= CREATE HOLIDAYS (BULK) =================
export const createHolidays = async (holidayArray) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holidayArray),
  });

  if (!res.ok) throw new Error("Failed to create holidays");
  return await res.json();
};

// ================= GET ALL HOLIDAYS =================
export const getHolidays = async () => {
  const res = await fetch(API_BASE + "/");

  if (!res.ok) throw new Error("Failed to fetch holidays");
  return await res.json();
};

// ================= UPDATE HOLIDAY =================
export const updateHoliday = async (id, payload) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT", // use PATCH if your backend requires
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update holiday");
  return await res.json();
};

// ================= DELETE HOLIDAY =================
export const deleteHoliday = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete holiday");
  return true;
};
