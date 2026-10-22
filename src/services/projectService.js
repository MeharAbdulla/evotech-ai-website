import apiClient from './apiClient';
import { pcbProjects } from '../data/pcbProjects';
import { cvProjects } from '../data/cvProjects';
import { aiProjects } from '../data/aiProjects';

const staticProjects = [...cvProjects, ...aiProjects, ...pcbProjects];

/**
 * Public Project Service
 * Merges API projects with CV (first), AI agent, and proprietary PCB catalogs.
 */
const projectService = {
  getProjects: async () => {
    try {
      const response = await apiClient.get('/projects/');
      const apiProjects = Array.isArray(response.data) ? response.data : [];
      return [...staticProjects, ...apiProjects];
    } catch (err) {
      return [...staticProjects];
    }
  },

  getProjectById: async (id) => {
    const local = staticProjects.find((p) => p.id === id);
    if (local) return local;

    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  }
};

export default projectService;
