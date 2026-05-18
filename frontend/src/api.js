import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    
    // ✅ تحديث: لا ترسل التوكن في طلبات التسجيل أو الدخول
    const authExcludedRoutes = ['register/', 'login/'];
    const isExcluded = authExcludedRoutes.some(route => config.url.includes(route));

    if (token && !isExcluded) {
        config.headers.Authorization =` Bearer ${token}`; // تأكد من استخدام الـ Backticks ``
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;