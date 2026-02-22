import React, { useState } from 'react';
import RegisterVisitorForm from '../../components/RegisterVisitorForm';
import ReportIncidentForm from '../../components/ReportIncidentForm';

const ResidentDashboard = ({ user }) => {
    const [showVisitorForm, setShowVisitorForm] = useState(false);
    const [showIncidentForm, setShowIncidentForm] = useState(false);

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
                    <button onClick={() => { setShowVisitorForm(!showVisitorForm); setShowIncidentForm(false); }} style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: showVisitorForm ? '#f1f5f9' : 'var(--primary-color)', color: showVisitorForm ? '#334155' : 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold' }}>
                        {showVisitorForm ? 'Close Form' : 'Register Visitor'}
                    </button>
                    <button onClick={() => { setShowIncidentForm(!showIncidentForm); setShowVisitorForm(false); }} style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: showIncidentForm ? '#f1f5f9' : '#eab308', color: showIncidentForm ? '#334155' : 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold' }}>
                        {showIncidentForm ? 'Close Form' : 'Report Incident'}
                    </button>
                    <button onClick={() => alert('Billing feature coming soon')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'white', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px' }}>View Bill</button>
                </div>
            </div>

            {showVisitorForm && (
                <div style={{ marginTop: '2rem' }}>
                    <RegisterVisitorForm user={user} onClose={() => setShowVisitorForm(false)} />
                </div>
            )}

            {showIncidentForm && (
                <div style={{ marginTop: '2rem' }}>
                    <ReportIncidentForm user={user} onClose={() => setShowIncidentForm(false)} />
                </div>
            )}
        </div>
    );
};

export default ResidentDashboard;
