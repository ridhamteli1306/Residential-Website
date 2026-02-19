import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const VisitorRegistrationForm = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        visitorName: user?.name || '',
        visitorIdCard: '',
        plateNumber: '',
        unitId: '', // Ideally a dropdown
        hostId: '' // Ideally select resident
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/visits', { ...formData, hostId: 3 }); // Hardcoding hostId=3 (Alice) for demo if not selected
            setMessage('Registration successful!');
            setFormData({ ...formData, visitorIdCard: '', plateNumber: '', unitId: '' });
        } catch (error) {
            setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px' }}>
            <h3>Register a Visit</h3>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Visitor Name:</label>
                    <input name="visitorName" value={formData.visitorName} onChange={handleChange} style={{ display: 'block', width: '100%' }} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>ID Card / DL:</label>
                    <input name="visitorIdCard" value={formData.visitorIdCard} onChange={handleChange} style={{ display: 'block', width: '100%' }} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>License Plate:</label>
                    <input name="plateNumber" value={formData.plateNumber} onChange={handleChange} style={{ display: 'block', width: '100%' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Unit ID (Demo: Use 1):</label>
                    <input name="unitId" value={formData.unitId} onChange={handleChange} style={{ display: 'block', width: '100%' }} required />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none' }}>Register</button>
            </form>
        </div>
    );
};

export default VisitorRegistrationForm;
