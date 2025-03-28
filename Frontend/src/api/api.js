import axios from "axios";

export const API_URL = "http://localhost:5000/api";
export const Image_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (userData) => api.post("/auth/register", userData);
export const login = (userData) => api.post("/auth/login", userData);
export const getMe = () => api.get("/auth/me");

export const getProjects = (page = 1, limit = 10) =>
  api.get(`/projects?page=${page}&limit=${limit}`);
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (projectData) => {
  return api.post("/projects", projectData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateProject = (id, projectData) => {
  return api.put(`/projects/${id}`, projectData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getTasks = (projectId, page = 1, limit = 10, filters = {}) => {
  const { status, priority } = filters;
  let url = `tasks/projects/${projectId}/tasks?page=${page}&limit=${limit}`;

  if (status) url += `&status=${status}`;
  if (priority) url += `&priority=${priority}`;

  return api.get(url);
};
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (projectId, taskData) => api.post(`tasks/projects/${projectId}/tasks`, taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
