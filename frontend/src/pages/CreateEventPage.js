import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';

const CreateEventPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        start_datetime: '',
        end_datetime: '',
        total_tickets: '',
        ticket_price: '',
        terms_and_conditions: '',
    });
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleNextStep = () => {
        // Basic validation for current step before proceeding
        if (step === 1 && (!formData.name || !formData.address || !formData.start_datetime || !formData.end_datetime)) {
            setMessage('Please fill in all required fields for Event Details.');
            return;
        }
        if (step === 2 && (!formData.total_tickets || !formData.ticket_price)) {
            setMessage('Please fill in all required fields for Ticket Details.');
            return;
        }
        setMessage('');
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await eventService.createEvent(formData, images);
            setMessage('Event created successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create event.');
            console.error('Error creating event:', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>List New Event - Step {step} of 3</h2>

            {step === 1 && (
                <div>
                    <h3 style={{ marginBottom: '20px' }}>Event Details</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Event Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="address" style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="start_datetime" style={{ display: 'block', marginBottom: '5px' }}>Start Date & Time:</label>
                        <input type="datetime-local" id="start_datetime" name="start_datetime" value={formData.start_datetime} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="end_datetime" style={{ display: 'block', marginBottom: '5px' }}>End Date & Time:</label>
                        <input type="datetime-local" id="end_datetime" name="end_datetime" value={formData.end_datetime} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                    <button onClick={handleNextStep} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Next</button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h3 style={{ marginBottom: '20px' }}>Ticket Details</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="total_tickets" style={{ display: 'block', marginBottom: '5px' }}>Total Tickets:</label>
                        <input type="number" id="total_tickets" name="total_tickets" value={formData.total_tickets} onChange={handleChange} required min="1" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="ticket_price" style={{ display: 'block', marginBottom: '5px' }}>Ticket Price (₹):</label>
                        <input type="number" id="ticket_price" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required min="0" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="terms_and_conditions" style={{ display: 'block', marginBottom: '5px' }}>Terms and Conditions (Optional):</label>
                        <textarea id="terms_and_conditions" name="terms_and_conditions" value={formData.terms_and_conditions} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={handlePrevStep} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Previous</button>
                        <button onClick={handleNextStep} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Next</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h3 style={{ marginBottom: '20px' }}>Event Images</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="images" style={{ display: 'block', marginBottom: '5px' }}>Upload Images (Max 5):</label>
                        <input type="file" id="images" name="images" multiple accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={handlePrevStep} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Previous</button>
                        <button type="submit" onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create Event</button>
                    </div>
                </div>
            )}

            {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        </div>
    );
};

export default CreateEventPage;