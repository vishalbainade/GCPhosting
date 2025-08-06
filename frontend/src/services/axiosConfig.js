import axios from 'axios';

// Add request interceptor for debugging
axios.interceptors.request.use(
    config => {
        console.log('Axios Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    error => {
        console.error('Axios Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
    response => {
        console.log('Axios Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    error => {
        console.error('Axios Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default axios;

