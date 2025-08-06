import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import authService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        authService.logout(); // Clear local storage
        dispatch(logout()); // Dispatch Redux logout action
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#333', color: 'white' }}>
            <div>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>EventHive</Link>
            </div>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Dashboard</Link>
                        <Link to="/create-event" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Create Event</Link>
                        <Link to="/manage-scanners" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Manage Scanners</Link>
                        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginLeft: '20px' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Login</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;