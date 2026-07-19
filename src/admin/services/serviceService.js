import apiClient from "./apiClient";

const serviceService = {
  async getServices(params = {}) {
    const response = await apiClient.get("/services/", { params });
    return response.data;
  },

  async getServiceById(id) {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  async createService(formData) {
    const response = await apiClient.post("/services/", formData);
    return response.data;
  },

  async updateService(id, formData) {
    const response = await apiClient.put(`/services/${id}`, formData);
    return response.data;
  },

  async deleteService(id) {
    await apiClient.delete(`/services/${id}`);
  },
};

export default serviceService;
