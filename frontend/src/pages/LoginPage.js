import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with:', { email });
            const userData = await authService.login(email, password);
            console.log('Login response full:', userData);
            console.log('Token received:', userData.token);
            
            if (!userData.token) {
                setMessage('Login successful but no token received');
                return;
            }
            
            dispatch(loginSuccess(userData));
            
            // Verify localStorage after login
            const storedUser = JSON.parse(localStorage.getItem('user'));
            console.log('Stored user in localStorage after login:', storedUser);
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Organizer Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
            </form>
            {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{message}</p>}
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</a>
            </p>
        </div>
    );
};

export default LoginPage;