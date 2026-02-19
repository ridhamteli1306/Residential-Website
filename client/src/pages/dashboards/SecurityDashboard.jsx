import React, { useContext } from 'react';
import SecurityCheckIn from '../../components/SecurityCheckIn';
import { AuthContext } from '../../context/AuthContext';

const SecurityDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h2>Security Dashboard</h2>
            <p>Officer on duty: {user.name}</p>

            <div style={{ marginTop: '2rem' }}>
                <SecurityCheckIn />
            </div>
        </div>
    );
};

export default SecurityDashboard;
