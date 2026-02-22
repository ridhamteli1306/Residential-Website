import React, { useState } from 'react';
import api from '../services/api';

const ReportIncidentForm = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        type: 'maintenance',
        description: '',
        location: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/incidents', {
                ...formData,
                reporterId: user.id
            });
            setMessage('Incident reported successfully!');
            setFormData({
                type: 'maintenance',
                description: '',
                location: ''
            });
            setTimeout(() => { if (onClose) onClose(); }, 2000);
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: 0 }}>Report an Incident</h4>
                {onClose && (
                    <button onClick={onClose} type="button" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                )}
            </div>

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

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Incident Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}>
                        <option value="maintenance">Maintenance Request</option>
                        <option value="security">Security Concern</option>
                        <option value="noise">Noise Complaint</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Location *</label>
                    <input name="location" placeholder="e.g. Near the main gate, Building B hallway, My Unit" value={formData.location} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Description *</label>
                    <textarea name="description" placeholder="Please provide details about the incident..." value={formData.description} onChange={handleChange} required rows={4} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                    <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportIncidentForm;
