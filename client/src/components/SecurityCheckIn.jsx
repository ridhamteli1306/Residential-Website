import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SecurityCheckIn = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVisits = async () => {
        try {
            const response = await api.get('/visits'); // In a real app, filter by status='active'
            setVisits(response.data.filter(v => v.status === 'active'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching visits', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const handleCheckOut = async (id) => {
        try {
            // We would need a PATCH endpoint for this, implementing it next
            await api.patch(`/visits/${id}`, { status: 'completed', exitTime: new Date() });
            fetchVisits();
        } catch (error) {
            alert('Error updating visit status');
        }
    };

    if (loading) return <p>Loading active visits...</p>;

    return (
        <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3>Security Gate - Active Visits</h3>
            {visits.length === 0 ? <p>No active visits.</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {visits.map(visit => (
                        <li key={visit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                            <div>
                                <strong>{visit.visitorName}</strong> ({visit.plateNumber || 'No Plate'})
                                <br />
                                <small>Unit: {visit.Unit?.number} | In: {new Date(visit.entryTime).toLocaleTimeString()}</small>
                            </div>
                            <button
                                onClick={() => handleCheckOut(visit.id)}
                                style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Check Out
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SecurityCheckIn;
