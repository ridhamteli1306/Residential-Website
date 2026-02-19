import React, { useState } from 'react';
import api from '../services/api';

const AddUserForm = ({ onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'watchman', // Default to watchman
        phone: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            setMessage('User created successfully!');
            setFormData({ name: '', email: '', password: '', role: 'watchman', phone: '' });
            if (onUserAdded) onUserAdded();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4>Add New User</h4>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
                <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="watchman">Watchman</option>
                    <option value="resident">Resident</option>
                    <option value="manager">Manager</option>
                </select>
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                <button type="submit" style={{ padding: '0.5rem', backgroundColor: 'var(--secondary-color)', color: 'white' }}>Create User</button>
            </form>
        </div>
    );
};

export default AddUserForm;
