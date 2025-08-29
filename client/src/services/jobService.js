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

// Simple in-memory cache to avoid hitting rate limits with repeated calls
const cache = {
  jobs: { data: null, ts: 0, ttl: 30_000 }, // 30s TTL
};

function isFresh(entry) {
  return entry.data && (Date.now() - entry.ts) < entry.ttl;
}

export const jobService = {
  // forceRefresh allows bypassing the cache when needed
  listAll: async (forceRefresh = false) => {
    if (!forceRefresh && isFresh(cache.jobs)) return cache.jobs.data;
    const res = await api.get('/jobs');
    cache.jobs = { data: res.data, ts: Date.now(), ttl: cache.jobs.ttl };
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post('/jobs', payload);
    // Invalidate cache on create
    cache.jobs = { data: null, ts: 0, ttl: cache.jobs.ttl };
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/jobs/${id}`, payload);
    // Invalidate cache on update
    cache.jobs = { data: null, ts: 0, ttl: cache.jobs.ttl };
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/jobs/${id}`);
    // Invalidate cache on delete
    cache.jobs = { data: null, ts: 0, ttl: cache.jobs.ttl };
    return res.data;
  },
  clearCache: () => { cache.jobs = { data: null, ts: 0, ttl: cache.jobs.ttl }; },
};

export default jobService;
