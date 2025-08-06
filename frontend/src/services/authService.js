import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Assuming backend runs on port 5000

const register = (name, email, password) => {
    return axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
    });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password,
    })
    .then(response => {
        console.log('Full login response:', response.data);
        if (response.data.token) {
            // Store the token and add user type information
            const userData = {
                token: response.data.token,
                type: 'organizer' // Since this is the organizer login
            };
            console.log('Storing user data:', userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        }
        return response.data;
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// Add this function to authService.js
const refreshToken = async () => {
    const user = getCurrentUser();
    if (!user || !user.token) return null;
    
    try {
        const response = await axios.post(`${API_URL}/refresh-token`, {}, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (response.data.token) {
            const updatedUser = { ...user, token: response.data.token };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        }
        return null;
    } catch (error) {
        // If refresh fails, log out the user
        logout();
        return null;
    }
};

// Add refreshToken to the exported object
const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    refreshToken,
};

export default authService;