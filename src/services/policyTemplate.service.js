// const BASE_URL = "http://72.62.242.223:8000";
const BASE_URL = "https://apihrr.goelectronix.co.in";

export const policyTemplateService = {

  /* =========================================================
     📄 GET ALL POLICY TEMPLATES
     GET /policies/templates
  ========================================================= */
  async getAllTemplates() {
    try {
      const res = await fetch(`${BASE_URL}/policies/templates`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to fetch policy templates");
      }

      return await res.json();
    } catch (error) {
      console.error("Get Templates API Error:", error);
      throw error;
    }
  },


  /* =========================================================
     ➕ CREATE POLICY TEMPLATE
     POST /policies/templates
     Body: multipart/form-data
     fields:
       - name (string)
       - file (binary)
  ========================================================= */
  async createTemplate({ name, file }) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/policies/templates`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          // DO NOT set Content-Type manually for FormData
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to create template");
      }

      return await res.json();
    } catch (error) {
      console.error("Create Template API Error:", error);
      throw error;
    }
  },


  /* =========================================================
     ✏️ UPDATE POLICY TEMPLATE
     PUT /policies/templates/{template_id}
     Body: multipart/form-data
     fields:
       - file (binary)
  ========================================================= */
  async updateTemplate(templateId, { file }) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${BASE_URL}/policies/templates/${templateId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "Accept": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update template");
      }

      return await res.json();
    } catch (error) {
      console.error("Update Template API Error:", error);
      throw error;
    }
  },
};
