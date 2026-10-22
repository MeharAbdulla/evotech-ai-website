import apiClient from "./apiClient";

const blogService = {
  async getAll() {
    const response = await apiClient.get("/blog/admin/all");
    return response.data;
  },

  async generate(force = true, fillDaily = false) {
    const response = await apiClient.post(
      `/blog/admin/generate?force=${force ? "true" : "false"}&fill_daily=${fillDaily ? "true" : "false"}`
    );
    return response.data;
  },

  async update(id, payload) {
    const response = await apiClient.patch(`/blog/admin/${id}`, payload);
    return response.data;
  },

  async remove(id) {
    await apiClient.delete(`/blog/admin/${id}`);
  },
};

export default blogService;
