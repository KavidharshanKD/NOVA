import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically add authorization JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_auth_token') || sessionStorage.getItem('nova_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiry (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out user.");
      localStorage.removeItem('nova_auth_token');
      localStorage.removeItem('nova_user_info');
      sessionStorage.removeItem('nova_auth_token');
      sessionStorage.removeItem('nova_user_info');
      // Force page reload to return user to login gate if needed
      if (window.location.pathname !== '/' && !window.location.pathname.includes('login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (email, newPassword) => {
    const res = await api.post('/auth/reset-password', { email, newPassword });
    return res.data;
  }
};

export const profileService = {
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  }
};

export const missionService = {
  getMissions: async (filters = {}) => {
    const res = await api.get('/missions', { params: filters });
    return res.data;
  },
  createMission: async (missionData) => {
    const res = await api.post('/missions', missionData);
    return res.data;
  },
  updateMissionStatus: async (id, status) => {
    const res = await api.put(`/missions/${id}/status`, { status });
    return res.data;
  },
  toggleMissionImportant: async (id) => {
    const res = await api.put(`/missions/${id}/important`);
    return res.data;
  },
  deleteMission: async (id) => {
    const res = await api.delete(`/missions/${id}`);
    return res.data;
  }
};

export const planetService = {
  getPlanets: async () => {
    const res = await api.get('/planets');
    return res.data;
  },
  getPlanetDetails: async (name) => {
    const res = await api.get(`/planets/${name}`);
    return res.data;
  }
};

export const achievementService = {
  getAchievements: async () => {
    const res = await api.get('/achievements');
    return res.data;
  }
};

export const analyticsService = {
  getAnalytics: async () => {
    const res = await api.get('/analytics');
    return res.data;
  }
};

export const settingsService = {
  getSettings: async () => {
    const res = await api.get('/settings');
    return res.data;
  },
  updateSettings: async (settingsData) => {
    const res = await api.put('/settings', settingsData);
    return res.data;
  }
};

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markRead: async () => {
    const res = await api.put('/notifications/read');
    return res.data;
  },
  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }
};

export const recommendationService = {
  getRecommendation: async () => {
    const res = await api.get('/recommendations');
    return res.data;
  },
  refreshRecommendation: async (metrics) => {
    const res = await api.post('/recommendations/refresh', metrics);
    return res.data;
  }
};

export default api;
