import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getQuizzes = () => api.get('/quizzes');
export const getQuiz = (id) => api.get(`/quizzes/${id}`);
export const submitQuiz = (id, data) => api.post(`/quizzes/${id}/submit`, data);

export const getMyAttempts = () => api.get('/attempts/my');
export const getAttemptDetail = (id) => api.get(`/attempts/${id}`);

export const getAdminQuizzes = () => api.get('/admin/quizzes');
export const getAdminQuiz = (id) => api.get(`/admin/quizzes/${id}`);
export const createQuiz = (data) => api.post('/admin/quizzes', data);
export const updateQuiz = (id, data) => api.put(`/admin/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/admin/quizzes/${id}`);

export const getQuizQuestions = (quizId) => api.get(`/admin/quizzes/${quizId}/questions`);
export const addQuestion = (quizId, data) => api.post(`/admin/quizzes/${quizId}/questions`, data);
export const updateQuestion = (id, data) => api.put(`/admin/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/admin/questions/${id}`);

export const getAllAttempts = () => api.get('/admin/attempts');
export const getLeaderboard = () => api.get('/attempts/leaderboard');

export default api;
