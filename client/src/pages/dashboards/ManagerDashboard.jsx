import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AddUserForm from '../../components/AddUserForm';

const ManagerDashboard = () => {
    const [units, setUnits] = useState([]);
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unitsRes = await api.get('/units');
                setUnits(unitsRes.data);
                const visitsRes = await api.get('/visits');
                setVisits(visitsRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Manager Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <h3>Residential Units ({units.length})</h3>
                    <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {units.map(unit => (
                            <li key={unit.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                {unit.type.toUpperCase()} {unit.number} - {unit.owner?.name || 'Vacant'}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <h3>Recent Visits ({visits.length})</h3>
                    <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {visits.map(visit => (
                            <li key={visit.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                {visit.visitorName} &rarr; Unit {visit.Unit?.number} ({visit.status})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h3>People Management</h3>
                <p>Register new Watchmen, Residents, or Managers.</p>
                <AddUserForm />
            </div>
        </div>
    );
};

export default ManagerDashboard;
