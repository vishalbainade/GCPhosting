import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';

const DashboardPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await eventService.getEvents();
                setEvents(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch events');
                console.error('Error fetching events:', err);
                // If token is invalid or expired, redirect to login
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    authService.logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading events...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333' }}>Organizer Dashboard</h1>
                <div>
                    <button
                        onClick={() => navigate('/create-event')}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        List New Event
                    </button>
                    <button
                        onClick={() => navigate('/manage-scanners')}
                        style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        Manage Scanners
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <h2 style={{ marginBottom: '20px', color: '#555' }}>Your Events</h2>
            {events.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777' }}>No events created yet. Click "List New Event" to get started!</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;


