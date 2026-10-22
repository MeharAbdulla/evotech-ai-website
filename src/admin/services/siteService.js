import apiClient from "./apiClient";

const siteService = {
  async getCompany() {
    const response = await apiClient.get("/site/company");
    return response.data;
  },
  async updateCompany(payload) {
    const response = await apiClient.put("/site/company", payload);
    return response.data;
  },
  async getSettings() {
    const response = await apiClient.get("/site/settings");
    return response.data;
  },
  async updateSettings(payload) {
    const response = await apiClient.put("/site/settings", payload);
    return response.data;
  },
};

export default siteService;
