import apiClient from "./apiClient";

const blogService = {
  async getPosts(limit = 2000) {
    const response = await apiClient.get("/blog/", {
      params: { limit, skip: 0 },
    });
    return response.data;
  },

  async getPostBySlug(slug) {
    const response = await apiClient.get(`/blog/${encodeURIComponent(slug)}`);
    return response.data;
  },
};

export default blogService;
