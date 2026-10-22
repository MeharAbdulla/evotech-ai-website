import apiClient from "./apiClient";

const userService = {
  async getUsers() {
    const response = await apiClient.get("/users/");
    return response.data;
  },
  async createUser(payload) {
    const response = await apiClient.post("/users/", payload);
    return response.data;
  },
  async deleteUser(username) {
    await apiClient.delete(`/users/${encodeURIComponent(username)}`);
  },
};

export default userService;
