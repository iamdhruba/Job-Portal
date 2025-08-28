import axios from 'axios';

// Axios instance for user-related APIs
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userService = {
  getMe: async () => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },
  updateProfile: async (profile) => {
    const res = await apiClient.put('/users/me', profile);
    return res.data;
  },
  uploadAvatar: async (file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    const res = await apiClient.post('/users/me/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  uploadCover: async (file) => {
    const fd = new FormData();
    fd.append('cover', file);
    const res = await apiClient.post('/users/me/cover', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  // Portfolio
  listPortfolio: async () => {
    const res = await apiClient.get('/users/me/portfolio');
    return res.data;
  },
  addPortfolio: async (item) => {
    const res = await apiClient.post('/users/me/portfolio', item);
    return res.data;
  },
  updatePortfolio: async (itemId, updates) => {
    const res = await apiClient.put(`/users/me/portfolio/${itemId}`, updates);
    return res.data;
  },
  deletePortfolio: async (itemId) => {
    const res = await apiClient.delete(`/users/me/portfolio/${itemId}`);
    return res.data;
  },
  uploadPortfolioImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await apiClient.post('/users/me/portfolio/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  // Experiences
  listExperiences: async () => (await apiClient.get('/users/me/experiences')).data,
  addExperience: async (item) => (await apiClient.post('/users/me/experiences', item)).data,
  updateExperience: async (id, updates) => (await apiClient.put(`/users/me/experiences/${id}`, updates)).data,
  deleteExperience: async (id) => (await apiClient.delete(`/users/me/experiences/${id}`)).data,
  // Education
  listEducation: async () => (await apiClient.get('/users/me/education')).data,
  addEducation: async (item) => (await apiClient.post('/users/me/education', item)).data,
  updateEducation: async (id, updates) => (await apiClient.put(`/users/me/education/${id}`, updates)).data,
  deleteEducation: async (id) => (await apiClient.delete(`/users/me/education/${id}`)).data,
  // Qualifications
  listQualifications: async () => (await apiClient.get('/users/me/qualifications')).data,
  addQualification: async (item) => (await apiClient.post('/users/me/qualifications', item)).data,
  updateQualification: async (id, updates) => (await apiClient.put(`/users/me/qualifications/${id}`, updates)).data,
  deleteQualification: async (id) => (await apiClient.delete(`/users/me/qualifications/${id}`)).data,
  // Certifications
  listCertifications: async () => (await apiClient.get('/users/me/certifications')).data,
  addCertification: async (item) => (await apiClient.post('/users/me/certifications', item)).data,
  updateCertification: async (id, updates) => (await apiClient.put(`/users/me/certifications/${id}`, updates)).data,
  deleteCertification: async (id) => (await apiClient.delete(`/users/me/certifications/${id}`)).data,
};

export default userService;
