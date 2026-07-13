import axios from 'axios';

// Base URL configuration switching automatically between deployment environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://nexus-nine-bay-69.vercel.app'
    : 'http://localhost:5000';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach JWT auth token to requests if the user is logged in
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;