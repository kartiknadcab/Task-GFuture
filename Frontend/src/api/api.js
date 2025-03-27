import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getMe = () => api.get('/auth/me');

// Projects API
export const getProjects = (page = 1, limit = 10) =>
  api.get(`/projects?page=${page}&limit=${limit}`);
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (projectData) => api.post('/projects', projectData);
export const updateProject = (id, projectData) =>
  api.put(`/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Tasks API
export const getTasks = (projectId, page = 1, limit = 10, filters = {}) => {
  const { status, priority } = filters;
  let url = `/projects/${projectId}/tasks?page=${page}&limit=${limit}`;
  
  if (status) url += `&status=${status}`;
  if (priority) url += `&priority=${priority}`;
  
  return api.get(url);
};
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (projectId, taskData) =>
  api.post(`/projects/${projectId}/tasks`, taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;