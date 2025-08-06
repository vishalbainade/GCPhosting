import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import scannerService from '../services/scannerService';
import eventService from '../services/eventService'; // To get event names for dropdown

const ScannerManagementPage = () => {
    const [scanners, setScanners] = useState([]);
    const [events, setEvents] = useState([]); // For the event dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newScannerData, setNewScannerData] = useState({
        name: '',
        eventId: '',
        validityInDays: 30, // Default validity
    });
    const [generatedCredentials, setGeneratedCredentials] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [scannersResponse, eventsResponse] = await Promise.all([
                    scannerService.getScanners(),
                    eventService.getEvents()
                ]);
                setScanners(scannersResponse.data);
                setEvents(eventsResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
                console.error('Error fetching data:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    authService.logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleInputChange = (e) => {
        setNewScannerData({ ...newScannerData, [e.target.name]: e.target.value });
    };

    const handleCreateScanner = async (e) => {
        e.preventDefault();
        try {
            const response = await scannerService.createScanner(
                newScannerData.name,
                newScannerData.eventId,
                newScannerData.validityInDays
            );
            setGeneratedCredentials(response.data.scanner);
            // Refresh the list of scanners
            const updatedScanners = await scannerService.getScanners();
            setScanners(updatedScanners.data);
            setNewScannerData({ name: '', eventId: '', validityInDays: 30 }); // Reset form
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create scanner');
            console.error('Error creating scanner:', err);
        }
    };

    const handleDeleteScanner = async (id) => {
        if (window.confirm('Are you sure you want to delete this scanner?')) {
            try {
                await scannerService.deleteScanner(id);
                setScanners(scanners.filter(scanner => scanner.id !== id));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete scanner');
                console.error('Error deleting scanner:', err);
            }
        }
    };

    const getEventName = (eventId) => {
        const event = events.find(e => e.id === eventId);
        return event ? event.name : 'N/A';
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading scanners...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333' }}>Scanner Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Create New Scanner
                </button>
            </div>

            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '500px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginBottom: '20px' }}>Create New Scanner</h2>
                        <form onSubmit={handleCreateScanner}>
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Scanner Name:</label>
                                <input type="text" id="name" name="name" value={newScannerData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="eventId" style={{ display: 'block', marginBottom: '5px' }}>Assign to Event:</label>
                                <select id="eventId" name="eventId" value={newScannerData.eventId} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                    <option value="">Select an Event</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>{event.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="validityInDays" style={{ display: 'block', marginBottom: '5px' }}>Validity (Days):</label>
                                <input type="number" id="validityInDays" name="validityInDays" value={newScannerData.validityInDays} onChange={handleInputChange} required min="1" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create Scanner</button>
                            </div>
                        </form>

                        {generatedCredentials && (
                            <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed #007bff', borderRadius: '5px', backgroundColor: '#e7f0ff' }}>
                                <h4 style={{ marginBottom: '10px', color: '#007bff' }}>Generated Credentials:</h4>
                                <p><strong>Username:</strong> {generatedCredentials.username}</p>
                                <p><strong>Password:</strong> {generatedCredentials.password}</p>
                                <p style={{ fontSize: '0.9em', color: '#555' }}>Please copy these credentials now. They will not be shown again.</p>
                                <button onClick={() => setGeneratedCredentials(null)} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <h2 style={{ marginBottom: '20px', color: '#555' }}>Your Scanners</h2>
            {scanners.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777' }}>No scanners created yet. Click "Create New Scanner" to get started!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Assigned Event</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Valid Until</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scanners.map(scanner => (
                            <tr key={scanner.id}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{scanner.name}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{getEventName(scanner.event_id)}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(scanner.valid_until).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => handleDeleteScanner(scanner.id)}
                                        style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ScannerManagementPage;