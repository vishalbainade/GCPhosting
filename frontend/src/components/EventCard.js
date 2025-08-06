import React from 'react';

const EventCard = ({ event }) => {
    const defaultImage = 'https://via.placeholder.com/150?text=No+Image'; // Placeholder image

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '10px', color: '#007bff' }}>{event.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img
                    src={event.images && event.images.length > 0 ? `http://localhost:5000${event.images[0]}` : defaultImage}
                    alt={event.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
                />
                <div>
                    <p><strong>Event ID:</strong> {event.id}</p>
                    <p><strong>Address:</strong> {event.address}</p>
                    <p><strong>Date:</strong> {new Date(event.start_datetime).toLocaleDateString()} - {new Date(event.end_datetime).toLocaleDateString()}</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', margin: '5px' }}>
                    <strong>Tickets Sold:</strong>
                    <p>{event.tickets_sold}</p>
                </div>
                <div style={{ textAlign: 'center', margin: '5px' }}>
                    <strong>Remaining Tickets:</strong>
                    <p>{event.remaining_tickets}</p>
                </div>
                <div style={{ textAlign: 'center', margin: '5px' }}>
                    <strong>Total Revenue:</strong>
                    <p>₹{parseFloat(event.total_revenue).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;

