import apiClient from "./apiClient";

const developerService = {
  async getDevelopers() {
    const response = await apiClient.get("/developers/");
    return response.data;
  },
};

export default developerService;
