import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        console.log('API Response:', response.config.url, response.status);
        return response;
    },
    error => {
        console.error('API Error:',
            error.config?.url,
            error.response?.status,
            error.response?.data || error.message
        );
        return Promise.reject(error);
    }
);

export default api;