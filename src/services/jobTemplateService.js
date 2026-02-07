// const BASE_URL = "http://72.62.242.223:8000/job-descriptions";
const BASE_URL = "https://apihrr.goelectronix.co.in/job-descriptions";


// CREATE TEMPLATE
export const createJobTemplate = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create job template");
  return res.json();
};

// GET ALL TEMPLATES
export const getJobTemplates = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
};

// GET TEMPLATE BY ID (For Modal)
export const getJobTemplateById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch template by ID");
  return res.json();
};
