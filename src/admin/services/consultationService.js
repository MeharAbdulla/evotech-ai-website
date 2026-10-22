import apiClient from "./apiClient";

const consultationService = {
  async getConsultations(params = {}) {
    const response = await apiClient.get("/consultations/", { params });
    return response.data;
  },
  async updateStatus(id, status) {
    const response = await apiClient.patch(`/consultations/${id}`, { status });
    return response.data;
  },
  async deleteConsultation(id) {
    await apiClient.delete(`/consultations/${id}`);
  },
};

export default consultationService;
