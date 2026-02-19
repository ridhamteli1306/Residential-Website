import React from 'react';

const ResidentDashboard = ({ user }) => {
    return (
        <div>
            <h2>Welcome Home, {user.name}</h2>
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', marginBottom: '1rem' }}>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> Active Resident</p>
            </div>

            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h3>My Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Register Visitor</button>
                    <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Report Incident</button>
                    <button onClick={() => alert('Billing feature coming soon')} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>View Bill</button>
                </div>
            </div>
        </div>
    );
};

export default ResidentDashboard;
