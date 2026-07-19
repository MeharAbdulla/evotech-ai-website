import apiClient from "./apiClient";

const serviceService = {
  async getServices(params = {}) {
    const response = await apiClient.get("/services/", { params });
    return response.data;
  },
};

export default serviceService;
