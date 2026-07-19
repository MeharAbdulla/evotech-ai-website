import apiClient from "./apiClient";

const developerService = {
  async getDevelopers() {
    const response = await apiClient.get("/developers/");
    return response.data;
  },

  async getDeveloperById(id) {
    const response = await apiClient.get(`/developers/${id}`);
    return response.data;
  },

  async createDeveloper(formData) {
    const response = await apiClient.post("/developers/", formData);
    return response.data;
  },

  async updateDeveloper(id, formData) {
    const response = await apiClient.put(`/developers/${id}`, formData);
    return response.data;
  },

  async deleteDeveloper(id) {
    await apiClient.delete(`/developers/${id}`);
  },
};

export default developerService;
