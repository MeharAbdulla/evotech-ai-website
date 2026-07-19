import apiClient from './apiClient';

/**
 * Public Project Service
 * Handles read-only data operations for the public-facing application.
 */
const projectService = {
  /**
   * Fetch all project records from the cluster repository.
   * @returns {Promise<Array>} Array of project entities.
   */
  getProjects: async () => {
    const response = await apiClient.get('/projects/');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Fetch a single project structure by its unique identifier.
   * @param {string} id - The target project object ID.
   * @returns {Promise<Object>} The target project entity data block.
   */
  getProjectById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  }
};

export default projectService;