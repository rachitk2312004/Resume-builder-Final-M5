import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  chatLogin: (credentials) => api.post('/auth/chat-login', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.post('/user/change-password', data),
};

// Resume API
export const resumeAPI = {
  getResumes: () => api.get('/resumes'),
  getResume: (id) => api.get(`/resumes/${id}`),
  createResume: (data) => api.post('/resumes', data),
  updateResume: (id, data) => api.put(`/resumes/${id}`, data),
  duplicateResume: (id) => api.post(`/resumes/${id}/duplicate`),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  getPublicResume: (publicLink) => api.get(`/resumes/public/${publicLink}`),
  saveVersion: (id) => api.post(`/resumes/${id}/versions`),
  listVersions: (id) => api.get(`/resumes/${id}/versions`),
  restoreVersion: (id, versionId) => api.post(`/resumes/${id}/versions/${versionId}/restore`),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolios: () => api.get('/portfolios'),
  getPortfolio: (id) => api.get(`/portfolios/${id}`),
  createPortfolio: (data) => api.post('/portfolios', data),
  updatePortfolio: (id, data) => api.put(`/portfolios/${id}`, data),
  duplicatePortfolio: (id) => api.post(`/portfolios/${id}/duplicate`),
  deletePortfolio: (id) => api.delete(`/portfolios/${id}`),
  getPublicPortfolio: (publicLink) => api.get(`/portfolios/public/${publicLink}`),
  getPortfolioBySlug: (slug) => api.get(`/portfolios/slug/${slug}`),
  createFromResume: (data) => api.post('/portfolios/from-resume', data),
  updateSlug: (id, slug) => api.put(`/portfolios/${id}/slug`, { slug }),
  publish: (id) => api.post(`/portfolios/${id}/publish`),
  unpublish: (id) => api.post(`/portfolios/${id}/unpublish`),
  getAnalytics: (id) => api.get(`/portfolios/${id}/analytics`),
  getAnalyticsChart: (id, days = 7) => api.get(`/portfolios/${id}/analytics/chart?days=${days}`),
};

// Portfolio Template API
export const portfolioTemplateAPI = {
  getTemplates: () => api.get('/portfolio-templates'),
  getTemplate: (id) => api.get(`/portfolio-templates/${id}`),
  getTemplatesByCategory: (category) => api.get(`/portfolio-templates/category/${category}`),
  getCategories: () => api.get('/portfolio-templates/categories'),
};

// AI API
export const aiAPI = {
  summary: (payload) => api.post('/ai/summary', payload),
  skills: (payload) => api.post('/ai/skills', payload),
  atsOptimize: (payload) => api.post('/ai/ats-optimize', payload),
  generateSummary: (payload) => api.post('/ai/generate-summary', payload),
  rewriteBullets: (payload) => api.post('/ai/rewrite-bullets', payload),
  suggestSkills: (payload) => api.post('/ai/suggest-skills', payload),
  atsScore: (payload) => api.post('/ai/ats-score', payload),
  parseJob: (text) => api.post('/ai/parse-job', { text }),
};

// Export API
export const exportAPI = {
  pdf: (id, html) => api.post(`/export/pdf/${id}`, { html }, { responseType: 'blob' }),
  docx: (id, html) => api.post(`/export/docx/${id}`, { html }, { responseType: 'blob' }),
};

// OCR API
export const ocrAPI = {
  parseJD: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/ocr/parse-jd', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/ocr/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// Settings API
export const settingsAPI = {
  getAi: () => api.get('/user/settings/ai'),
  setAi: (allowExternalAi) => api.put('/user/settings/ai', { allowExternalAi }),
};

// AI Logs API
export const aiLogsAPI = {
  getLogs: (page = 0, size = 20) => api.get(`/ai/logs?page=${page}&size=${size}`),
  exportLogs: () => api.get('/ai/logs/export', { responseType: 'blob' }),
};

// ATS History API
export const atsHistoryAPI = {
  getHistory: (page = 0, size = 20) => api.get(`/ats/history?page=${page}&size=${size}`),
  exportHistory: () => api.get('/ats/history/export', { responseType: 'blob' }),
};

export default api;
