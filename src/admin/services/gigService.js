import apiClient from "./apiClient";

const gigService = {
  async getGigs(params = {}) {
    const response = await apiClient.get("/gigs/", { params });
    return response.data;
  },

  async getGigById(id) {
    const response = await apiClient.get(`/gigs/${id}`);
    return response.data;
  },

  async createGig(formData) {
    const response = await apiClient.post("/gigs/", formData);
    return response.data;
  },

  async updateGig(id, formData) {
    const response = await apiClient.put(`/gigs/${id}`, formData);
    return response.data;
  },

  async deleteGig(id) {
    await apiClient.delete(`/gigs/${id}`);
  },
};

export default gigService;
