import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/events';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    console.log('User from localStorage:', user);
    if (user && user.token) {
        // Just send the token, the backend will extract the user info
        return { Authorization: 'Bearer ' + user.token };
    } else {
        console.warn('No auth token available');
        return {};
    }
};

const createEvent = (eventData, images) => {
    const formData = new FormData();
    for (const key in eventData) {
        formData.append(key, eventData[key]);
    }
    images.forEach((image) => {
        formData.append('images', image);
    });

    return axios.post(API_URL, formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getEvents = () => {
    return axios.get(API_URL, { headers: getAuthHeader() });
};

const getEventById = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const eventService = {
    createEvent,
    getEvents,
    getEventById,
};

export default eventService;