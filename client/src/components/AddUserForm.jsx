import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AddUserForm = ({ onUserAdded }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '', // No default selection
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
            setFormData({ name: '', email: '', password: '', role: '', phone: '' });
            if (onUserAdded) onUserAdded();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Register New User</h4>

            {message && (
                <div style={{
                    padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
                    backgroundColor: message.startsWith('Error') ? '#fee2e2' : '#dcfce7',
                    color: message.startsWith('Error') ? '#b91c1c' : '#166534',
                    fontWeight: 'bold', fontSize: '0.9rem'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Full Name *</label>
                    <input name="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Email Address *</label>
                    <input name="email" placeholder="john@example.com" type="email" value={formData.email} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Temporary Password *</label>
                    <input name="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Assigned Role *</label>
                    <select name="role" value={formData.role} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}>
                        <option value="" disabled>Select a role...</option>
                        <option value="watchman">Watchman</option>
                        <option value="lifeguard">Lifeguard</option>
                        <option value="visitor">Visitor</option>
                        <option value="resident">Resident</option>
                        {user?.role === 'superadmin' && <option value="manager">Manager</option>}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Phone Number</label>
                    <input name="phone" placeholder="(555) 123-4567" value={formData.phone} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                    <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                        Create User Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUserForm;
