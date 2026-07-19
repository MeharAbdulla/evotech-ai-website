import apiClient from "./apiClient";

/**
 * Enterprise Project Service
 * -------------------------------------------------
 * Handles all Project CRUD operations.
 * Uses the centralized apiClient so authentication,
 * headers, and future interceptors are managed in
 * one place.
 */

const projectService = {
  /**
   * Retrieve all projects.
   * Optional filters:
   * featured=true
   * category=AI
   */
  async getProjects(params = {}) {
    const response = await apiClient.get("/projects/", {
      params,
    });

    return response.data;
  },

  /**
   * Retrieve a single project by ID.
   */
  async getProjectById(id) {
    const response = await apiClient.get(`/projects/${id}`);

    return response.data;
  },

  /**
   * Create a new project.
   */
  async createProject(formData) {
    const response = await apiClient.post(
      "/projects/",
      formData
    );

    return response.data;
  },

  /**
   * Update an existing project.
   */
  async updateProject(id, formData) {
    const response = await apiClient.put(
      `/projects/${id}`,
      formData
    );

    return response.data;
  },

  /**
   * Upload an asset file (ZIP, PDF, Image) associated with a specific project.
   */
  async uploadFile(projectId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `/projects/${projectId}/upload`,
      formData
    );

    return response.data;
  },

  /**
   * Delete a project.
   */
  async deleteProject(id) {
    await apiClient.delete(`/projects/${id}`);
  },
};

export default projectService;