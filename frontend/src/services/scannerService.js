import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/scanners';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const createScanner = (name, eventId, validityInDays) => {
    return axios.post(API_URL, { name, eventId, validityInDays }, { headers: getAuthHeader() });
};

const getScanners = () => {
    return axios.get(API_URL, { headers: getAuthHeader() });
};

const deleteScanner = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const scannerService = {
    createScanner,
    getScanners,
    deleteScanner,
};

export default scannerService;