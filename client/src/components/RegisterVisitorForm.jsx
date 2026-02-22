import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RegisterVisitorForm = ({ user, onClose }) => {
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({
        visitorName: '',
        visitorIdCard: '',
        plateNumber: '',
        unitId: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await api.get('/units');
                // Filter units where this resident is the owner, or just show all if none
                const myUnits = res.data.filter(u => u.ownerId === user.id);
                setUnits(myUnits.length > 0 ? myUnits : res.data);
                if (myUnits.length > 0) {
                    setFormData(prev => ({ ...prev, unitId: myUnits[0].id }));
                } else if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, unitId: res.data[0].id }));
                }
            } catch (err) {
                console.error('Failed to fetch units', err);
            }
        };
        fetchUnits();
    }, [user.id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/visits', {
                ...formData,
                hostId: user.id
            });
            setMessage('Visitor registered successfully!');
            setFormData({
                visitorName: '',
                visitorIdCard: '',
                plateNumber: '',
                unitId: units.length > 0 ? units[0].id : ''
            });
            setTimeout(() => { if (onClose) onClose(); }, 2000);
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: 0 }}>Register a Visitor</h4>
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

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Visitor Full Name *</label>
                    <input name="visitorName" placeholder="e.g. Jane Smith" value={formData.visitorName} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>ID / Passport Number *</label>
                    <input name="visitorIdCard" placeholder="e.g. 123456789" value={formData.visitorIdCard} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Vehicle Plate (Optional)</label>
                    <input name="plateNumber" placeholder="e.g. ABC 123" value={formData.plateNumber} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Destination Unit *</label>
                    <select name="unitId" value={formData.unitId} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}>
                        <option value="" disabled>Select unit...</option>
                        {units.map(unit => (
                            <option key={unit.id} value={unit.id}>{unit.block}-{unit.number}</option>
                        ))}
                    </select>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                    <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                        Register Visitor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterVisitorForm;
