import apiClient from "./apiClient";

const gigService = {
  async getGigs(params = {}) {
    const response = await apiClient.get("/gigs/", { params });
    return response.data;
  },
};

export default gigService;
