import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const jobService = {
  listAll: async () => (await api.get('/jobs')).data,
  create: async (payload) => (await api.post('/jobs', payload)).data,
  update: async (id, payload) => (await api.put(`/jobs/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/jobs/${id}`)).data,
};

export default jobService;
